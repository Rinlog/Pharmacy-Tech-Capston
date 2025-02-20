//react imports
import { useState, useEffect } from 'react';

//sanitize import
import { SanitizeName } from '@components/datasanitization/sanitization.jsx'; 
import AlertModal from '../modals/alertModal';
import DeleteUserModal from '../modals/deleteUserModal';
import SortByHeader from '@components/headerSort/sortByHeader';

//other imports

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function EditUser() {

    //users from DB
    const [data, setData] = useState([]);

    //state to ensure data has been obtained and set
    const [dataObtained, setDataObtained] = useState(false);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);
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
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');

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
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/getusers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
            });
            let fetchedData = await response.json();
            fetchedData = fetchedData.data
            const filteredData = fetchedData.filter(function(User){
                if (User.removed === false){
                    return true;
                }
                else{
                    return false;
                }
            })
            console.log(filteredData);
            if (filteredData && filteredData.length > 0) {
                // Transform keys in data
                const transformedData = filteredData.map(item => {
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
                
                // Use the transformed data directly for headers
                const keys = Object.keys(transformedData[0]);
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
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
     useEffect(() => {
        if (data.length > 0) {
            const filtered = data.filter(item => {
                for (const key in item) {
                    if (item[key] && item[key].toString().toLowerCase().includes(search.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            });
            setFilteredData(filtered);
        }
    }, [search, data]);

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
        const headerSort = (header,swap) => {
    
            //this sets a use state header so that when the page is updated it will re-sort
    
            //toggle sort order if clicking the same column, otherwise it will do ascending
            
            if (swap == true){
                let newSortOrder = 'asc';
                if (column === header && sortOrder === 'asc') {
                    newSortOrder = 'desc';
                }
                setColumn(header);
                setOrder(newSortOrder);
                let sortedData = SortByHeader(filteredData,header,newSortOrder);
                setFilteredData(sortedData);
            }
            else{
                let sortedData = SortByHeader(filteredData,header,sortOrder);
                setColumn(header);
                setFilteredData(sortedData);
    
            }
            
            
            
        };
    

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
                            onClose={() => setIsDeleteModalOpen(false)}
                            userToDelete={selectedUser}
                            onDelete={() => {
                                //setIsDeleteModalOpen(false);
                                setEditing(false);
                                GetUsers();
                            }}
                        />
                    </form>
                    </>
                )}

                {/* Search bar */}
                <input type="text" className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                
                <table className="table">
                
                    {/* Map headers to table */}
                    <thead>
                        
                        <tr>
                            
                            {/* Empty header for RDO button*/}
                            <th></th>

                            {tableHeaders.map(header => (
                                <th className="table-headers" key={header} onClick={() => headerSort(header,true)} style={{ cursor: 'pointer' }}
                                >{header} {column === header ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                            ))}
                        </tr>

                    </thead>

                    {/* Map data to table body */}
                    <tbody>
                        
                        {/* Rows */}
                        {filteredData.map((item, index) => (

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