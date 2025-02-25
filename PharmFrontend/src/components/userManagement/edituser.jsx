//react imports
import { useState, useEffect } from 'react';

//sanitize import
import { SanitizeName } from '@components/datasanitization/sanitization.jsx'; 
import AlertModal from '../modals/alertModal';
import DeleteUserModal from '../modals/deleteUserModal';
import Dropdown from 'react-bootstrap/Dropdown';
import headerSort from '@components/headerSort/HeaderSort';
//other imports

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function EditUser() {

    //users from DB
    const [SearchBy, setSearchBy] = useState("First Name");
    const [OG_data, setOG_Data] = useState([]);
    const [Data, setData] = useState([]);

    //state to ensure data has been obtained and set
    const [dataObtained, setDataObtained] = useState(false);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState({ "User ID": null, selected: false });

    //table data
    const headerMapping = {
        "id": "User ID",
        "fName": "First Name",
        "lName": "Last Name",
        "email": "Email",
        "campus": "Campus",
        "admin": "Admin",
        "active": "Active",
        "createdDate": "Created",
        "expirationDate": "Expires"
    };
    const [tableHeaders, setTableHeaders] = useState([]);


    //edit state
    const [editing, setEditing] = useState(false);

    //states for selected user
    const [userID, setUserID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [active, setActive] = useState('');
    const [admin, setAdmin] = useState('');
    const [email, setEmail] = useState(''); //email needed to be added

    //pget user data
    const GetUsers = async () => {
        try {
            setDataObtained(false);
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/getusers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
            });
            let fetchedData = await response.json();
            fetchedData = fetchedData.data
            const Data = fetchedData.filter(function(User){
                if (User.removed === false){
                    return true;
                }
                else{
                    return false;
                }
            })
            if (Data && Data.length > 0) {
                // Transform keys in data
                const transformedData = Data.map(item => {
                    return {
                        "User ID": item.id,
                        "First Name": item.fName,
                        "Last Name": item.lName,
                        "Email": item.email,
                        "Campus": item.campus,
                        "Admin": item.admin,
                        "Active": item.active,
                        "Created": item.createdDate,
                        "Expires": item.expirationDate
                    };
                });
        
                // Set the transformed data
                setData(transformedData);
                setOG_Data(transformedData);
                // Use the transformed data directly for headers
                const keys = Object.keys(transformedData[0]);
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setTimeout(function(){
                    setDataObtained(true);
                },20);
            }
        } catch (error) {
            setAlertMessage("Could not obtain user data at this time. \nPlease contact system administrator.");
            setIsAlertModalOpen(true);
            console.log(error);
        }
    }

    //attempt to obtain user data until success
    useEffect(() => {

        if (!dataObtained) GetUsers();

    });

     // Filter user data on search
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_data //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let Data = LocalData.filter(function(User){
            
                let result = expression.test(User[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setData(Data);
        }
        else{
            setData(OG_data);
        }
    }
    useEffect(function(){
            if (column !== null){
                headerSort(column,false,column, setColumn,sortOrder, setOrder, Data, setData); //tells it not to swap the order from asc/desc, just re-sort
            }
    },[Data])

    //What to when data is selected
    const handleSelect = (rowData) => {

        //set form Data
        setUserID(rowData["User ID"]);

        setFirstName(rowData["First Name"]);
        setLastName(rowData["Last Name"]);
        setEmail(rowData["Email"]); //email needed to be added

        //console.log("email being sent: " , rowData["Email"]); //debugging

        if (rowData["Active"] === "Y") setActive("Yes");
        else setActive("No")
        if (rowData["Admin"] === "Y") setAdmin("Yes");
        else setAdmin("No");

        //set editing to true
        setEditing(true);

    };

    //sanitize input
    const SanitizeForm = () => {

        setFirstName(SanitizeName(firstName));
        setLastName(SanitizeName(lastName));

    }

    //submit changes to user
    const SubmitEdit = async (e) => {

        e.preventDefault();

        //sanitize
        SanitizeForm();
        
        //create user object
        let editedUser = {

            UserID: userID,
            FName: firstName,
            LName: lastName,
            Email: email, //added for bug
            Admin: admin,
            Active: active
            
        }

        //api call
        try {
        const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/edituser' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(editedUser)
            });
            const data = await response.json();

            setAlertMessage(data.message);
            setIsAlertModalOpen(true);

            //remove form and refresh table
            setEditing(false);
            //GetUsers();
        }
        catch{
            return;
        }
        
    }

    // Modified section of EditUser.jsx
    const HandleDelete = () => {
        setSelectedUser({
            "User ID": userID,
            "First Name": firstName,
            "Last Name": lastName
        });
        setIsDeleteModalOpen(true);
    };

    //function to handle sorting when a header is clicked
    

    return(

        <div>

            {/* Displays when data has not been obtained */}
            {!dataObtained && (
            <label>Fetching Data...</label>
            )}

            {dataObtained &&  (
                <>

                {editing && (
                    <>
                    <form className="regular-form" onSubmit={SubmitEdit}>

                        <label className='input-label'>First Name:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}>
                        </input>
                        <br></br>

                        <label className='input-label'>Last Name:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}>
                        </input>
                        <br></br>

                        <label className='input-label'>Active:</label>
                        <br></br>
                        <select
                            className="combo-input"
                            required
                            type="text"
                            value={active}
                            onChange={(e) => setActive(e.target.value)}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                        </select>
                        <br></br>

                        <label className='input-label'>Admin:</label>
                        <br></br>
                        <select
                            className="combo-input"
                            required
                            type="text"
                            value={admin}
                            onChange={(e) => setAdmin(e.target.value)}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                        </select>
                        <br></br>

                        <button className="button" type="submit">Submit Changes</button>

                        <button className="button" type="button" onClick={HandleDelete}>Delete User</button>
                        <DeleteUserModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => {
                                setEditing(false);
                                GetUsers();
                                setIsDeleteModalOpen(false)
                            }}
                            userToDelete={selectedUser}
                        />
                    </form>
                    </>
                )}

                {/* Search bar */}
                <div className='d-flex align-items-center'>
                <div>
                    <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
                </div>
                <Dropdown>
                    <Dropdown.Toggle className='HideButtonCSS SearchTypeButton'>
                        <svg width={30} height={35} viewBox="1 -4 30 30" preserveAspectRatio="xMinYMin meet" >
                            <rect id="svgEditorBackground" x="0" y="0" width="10px" height="10px" style={{fill: 'none', stroke: 'none'}}/>
                            <circle id="e2_circle" cx="10" cy="10" style={{fill:'white',stroke:'black',strokeWidth:'2px'}} r="5"/>
                            <line id="e3_line" x1="14" y1="14" x2="20.235" y2="20.235" style={{fill:'white',stroke:'black',strokeWidth:'2px'}}/>
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item id="User ID" onClick={(e)=>{setSearchBy(e.target.id)}}>User ID</Dropdown.Item>
                        <Dropdown.Item id="First Name" onClick={(e)=>{setSearchBy(e.target.id)}}>First Name</Dropdown.Item>
                        <Dropdown.Item id="Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Last Name</Dropdown.Item>
                        <Dropdown.Item id="Email" onClick={(e)=>{setSearchBy(e.target.id)}}>Email</Dropdown.Item>
                        <Dropdown.Item id="Campus" onClick={(e)=>{setSearchBy(e.target.id)}}>Campus</Dropdown.Item>
                        <Dropdown.Item id="Admin" onClick={(e)=>{setSearchBy(e.target.id)}}>Admin</Dropdown.Item>
                        <Dropdown.Item id="Active" onClick={(e)=>{setSearchBy(e.target.id)}}>Active</Dropdown.Item>
                        <Dropdown.Item id="Created" onClick={(e)=>{setSearchBy(e.target.id)}}>Created</Dropdown.Item>
                        <Dropdown.Item id="Expires" onClick={(e)=>{setSearchBy(e.target.id)}}>Expires</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
                
                <table className="table">
                
                    {/* Map headers to table */}
                    <thead>
                        
                        <tr>
                            
                            {/* Empty header for RDO button*/}
                            <th></th>

                            {tableHeaders.map(header => (
                                <th className="table-headers" key={header} onClick={() => headerSort(header,true,column, setColumn,sortOrder, setOrder, Data, setData)} style={{ cursor: 'pointer' }}
                                >{header} {column === header ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                            ))}
                        </tr>

                    </thead>

                    {/* Map data to table body */}
                    <tbody>
                        
                        {/* Rows */}
                        {Data.map((item, index) => (

                                <tr key={index} >
                                    {/* Add radio button for each row */}
                                    <td>
                                    <input
                                        type="radio"
                                        name="selectedRow"
                                        onChange={() => handleSelect(item)}
                                    />
                                    </td>

                                {tableHeaders.map(header => (
                                    <td className="table-data" key={header}>{item[header]}</td>
                                ))}

                            </tr>
                        ))}

                    </tbody>
                    
                </table>

                <AlertModal
                        isOpen={isAlertModalOpen}
                        message={alertMessage}
                        onClose={() => {setIsAlertModalOpen(false)
                                        GetUsers();
                        }}
                ></AlertModal>
                </>
            )}
        </div>

    )

}

export default EditUser;