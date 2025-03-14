//react imports
import { useState } from 'react';

//other imports
import readXlsxFile from 'read-excel-file';
import AlertModal from '../modals/alertModal';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function AddUsers({ setDisplay }) {

    const [excelFile, setExcelFile] = useState(null);
    const [fileSubmitted, setFileSubmitted] = useState(false);

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    
    const handleAdd = async () => {

        if (!excelFile) {
            setAlertMessage("Please select a file.");
            setIsAlertModalOpen(true);
            return;
        }

        let rawData = [];

        try {
            const rows = await readXlsxFile(excelFile);
            //foreach row
            rows.forEach(row => {
                //add row to array
                rawData.push(row);
            });

            //manipulate row data

            //get headers
            let keys = rawData[0];

            //expected headers
            let headers = ["FirstName", "LastName", "Email", "Campus"];

            // Check if the header arrays are identical
            let identical = true;
            if (keys.length === headers.length) {
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] !== headers[i]) {
                        identical = false;
                        break;
                    }
                }
            } else {
                identical = false;
            }

            //if headers don't match expected, send error
            if (!identical){
                setAlertMessage("Invalid Spreadsheet Format. Please check headers");
                setIsAlertModalOpen(true);
                return;
            }

            //if they are, create them as keys and format data

            let formattedData = [];

            for (let i = 1; i < rawData.length; i++) {
                let obj = {};
                for (let j = 0; j < keys.length; j++) {
                    //check for empty columns
                    if (!rawData[i][j]) {
                        setAlertMessage(`Empty cell found at row ${i + 1}, column ${j + 1}`);
                        setIsAlertModalOpen(true);
                        return;
                    }
                    //Assign each column to keys
                    obj[keys[j]] = rawData[i][j];
                }
                //Push the object to array
                formattedData.push(obj);

            }

            //alert("Please wait. Do not refresh the page.");

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/bulkadd' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(formattedData),
            });
            const data = await response.json();
           
            let totalResponse = "";

            for (const element of data.data){
                totalResponse += element + "\n";
            }
            
            setAlertMessage(totalResponse);
            setFileSubmitted(true);
            setIsAlertModalOpen(true);


        } catch (error) {
            console.error("Error reading Excel file:", error);
            setAlertMessage("Only excel files are currently supported");
            setIsAlertModalOpen(true);
        }

    }

    return(

        <div>
        <div>
            <h2>Valid Campus Locations</h2>
            <ul>
                <li>Fredericton</li>
                <li>St. John</li>
                <li>Moncton</li>
                <li>St. Andrews</li>
                <li>Miramichi</li>
                <li>Woodstock</li>
            </ul>
        </div>
        <div>
            <h2>Format</h2>
            <table>
                <thead>
                    <tr>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Email</th>
                        <th>Campus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>test@mynbcc.ca</td>
                        <td>Moncton</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
            <button className="button" type="button" onClick={handleAdd}>Add Users</button>
        </div>

        <AlertModal
            isOpen={isAlertModalOpen}
            message={alertMessage}
            onClose={() => {
                setIsAlertModalOpen(false)

                if (fileSubmitted) {
                    setDisplay("userEdit");
                }
            }}
        />
        </div>

    )

}

export default AddUsers;