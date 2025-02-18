// React imports
import { useState } from 'react';

// Other imports
import readXlsxFile from 'read-excel-file';
import { SanitizeInput } from '@components/datasanitization/sanitization';
import AlertModal from '../modals/alertModal';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function BulkPhysicians({setDisplay}) {

    const [excelFile, setExcelFile] = useState(null);

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const handleAdd = async () => {

        if (!excelFile) {
            setAlertMessage("Please select a file.");
            setIsAlertModalOpen(true);
            return;
        }

        const headerMapping = {
            "First Name" : "FName",
            "Last Name" : "LName",
            "City" : "City",
            "Province" : "Province"};

        let rawData = [];

        try {
            const rows = await readXlsxFile(excelFile);
            // Foreach row
            rows.forEach(row => {
                // Add row to unfomatted array
                rawData.push(row);
            });

            // Manipulate row data

            // Get headers
            let keys = rawData[0];

            // Expected headers, which come from the headerMapping object
            let headers = Object.keys(headerMapping);

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

            // If headers don't match expected, send error
            if (!identical){
                setAlertMessage("Invalid Spreadsheet Format. Please check headers.");
                setIsAlertModalOpen(true);
                return;
            }

            // Create them as keys and format data

            let formattedData = [];

            for (let i = 1; i < rawData.length; i++) {
                let obj = {};
                obj["PhysicianID"] = null;
                for (let j = 0; j < keys.length; j++) {

                    // Check for empty columns
                    if (!rawData[i][j]) {
                        setAlertMessage("Empty cell found at row ${i + 1}, column ${j + 1}");
                        setIsAlertModalOpen(true);
                        return;
                    }
                    // Use the mapping to get the changed key names
                    let key = headerMapping[keys[j]];

                    // Convert the values to strings because type coercion is the devil
                    rawData[i][j] = String(rawData[i][j]);

                    // Sanitize the input
                    let sanitized = SanitizeInput(rawData[i][j]);

                    // Assign each column to keys
                    obj[key] = sanitized;

                }
                // Push the object to array
                formattedData.push(obj);

            }

            //alert("Please wait. Do not refresh the page.");

            // API call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/bulkphysician' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(formattedData),
            });

            // Make sure the response is ok
            if (!response.ok) {
                setAlertMessage("Error adding physicians. Please try again." + response.statusText + " " + response.status + "!");
                setIsAlertModalOpen(true);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                // Alert out the message sent from the API
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
           
            let totalResponse = "";

            // Get the info for any rows that may have failed
            for (const element of data.data){
                totalResponse += element + "\n";
            }

            // If there were no failures, this will be empty so lets just say success
            if (totalResponse === "") {
                totalResponse = "All physicians added successfully!";
            }
            
            setAlertMessage(totalResponse);
            setIsAlertModalOpen(true);

            // Set the display back to the main page
            //setDisplay("main");

        }
        catch (error) {
            console.error("Error reading Excel file:", error);
            setAlertMessage("Only excel files are currently supported");
            setIsAlertModalOpen(true);
        }

    }

    return(

        <div>         
            <div>
                <h2>Format</h2>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>City</th>
                            <th>Province</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John</td>
                            <td>Doe</td>
                            <td>Moncton</td>
                            <td>NB</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
                <button className="button" type="button" onClick={handleAdd}>Add Physicians</button><br></br><br></br>
            </div>

            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {
                    setIsAlertModalOpen(false)
                    setDisplay("main");
            }}
            />
        </div>

    )

}

export default BulkPhysicians;