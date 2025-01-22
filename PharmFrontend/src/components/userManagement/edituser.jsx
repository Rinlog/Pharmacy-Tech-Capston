//react imports
import { useState, useEffect } from 'react';

//sanitize import
import { SanitizeName } from '@components/datasanitization/sanitization.jsx'; 

//other imports


function EditUser() {

    //users from DB
    const [data, setData] = useState([]);

    //state to ensure data has been obtained and set
    const [dataObtained, setDataObtained] = useState(false);

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

    //pget user data
    const GetUsers = async () =>{

        try {

            //api call
            const response = await fetch('https://localhost:7172/api/Management/getusers' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const fetchedData = await response.json();

            //set data state
            setData(fetchedData.data);

            if (data.length > 0){

                //transform keys in data
                const transformedData = fetchedData.data.map(item => {

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
        
                //set data to the transformed version (change keys)
                setData(transformedData);
                const keys = Object.keys(data[0]);

                //map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
            }
        }
        catch (error) {
            alert("Could not obtain user data at this time.\nPlease contact system administrator.");
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
            Admin: admin,
            Active: active
            
        }

        //api call
        try {
        const response = await fetch('https://localhost:7172/api/Management/edituser' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser)
            });
            const data = await response.json();

            alert(data.message);

            //remove form and refresh table
            setEditing(false);
            GetUsers();
        }
        catch{
            return;
        }
        
    }

    const HandleDelete = async (e) => {

        e.preventDefault();

        let confirmTwo = false;
        //prompt user to confirm twice
        let confirmOne = confirm("Deleting a user will remove all associated records created by that user.\nAre you sure you wish to delete?");
        if (confirmOne) {
            confirmTwo = confirm("Are you absolutely sure?")
        }
        else return;
        if (confirmTwo){

            //api call
            try {

                const response = await fetch('https://localhost:7172/api/Management/deleteuser' , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userID)
                });
                const data = await response.json();

                alert(data.message);

                //remove form and refresh table
                setEditing(false);
                GetUsers();

            }
            catch{
                return;
            }


            
        }
        else return;
    

    }


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
                                <th className="table-headers" key={header}>{header}</th>
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
                </>
            )}
        </div>

    )

}

export default EditUser;