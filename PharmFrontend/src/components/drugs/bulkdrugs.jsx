// React imports
import { useState } from 'react';

// Other imports
import readXlsxFile from 'read-excel-file';
import { SanitizeInput, SanitizeLength } from '@components/datasanitization/sanitization';
import AlertModal from '../modals/alertModal';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function BulkDrugs({setDisplay, getDrugs}) {

    const [excelFile, setExcelFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const handleAdd = async () => {

        if (!excelFile) {
            setAlertMessage("Please select a file.");
            setIsAlertModalOpen(true);
            return;
        }

        const headerMapping = {
            "DIN": "DIN",
            "Drug Name": "name",
            "Dosage": "dosage",
            "Strength": "strength",
            "Manufacturer": "manufacturer",
            "Concentration": "concentration",
            "Reference Brand": "referenceBrand",
            "Container Size": "containerSize"
        };

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
                for (let j = 0; j < keys.length; j++) {

                    // Check for empty columns
                    if (!rawData[i][j]) {
                        setAlertMessage(`Empty cell found at row ${i + 1}, column ${j + 1}`);
                        setIsAlertModalOpen(true);
                        return;
                    }
                    // Use the mapping to get the changed key names
                    let key = headerMapping[keys[j]];


                    // Convert the values to strings because type coercion is the devil
                    rawData[i][j] = String(rawData[i][j]);

                    // Cut the length of the data to the max for the database (255 for all fields except DIN)
                    if (key == "DIN" && !/^\d{8}$/.test(rawData[i][j])) {
                        // If the DIN is not 8 digits, send an error
                        setAlertMessage(`DIN must be an 8 digit number at row ${i + 1}, column ${j + 1}`);
                        setIsAlertModalOpen(true);
                        return;
                    }
                    else {
                        rawData[i][j] = SanitizeLength(rawData[i][j], 255);
                    }

                    // Sanitize the input
                    let sanitized = SanitizeInput(rawData[i][j]);

                    // Assign each column to keys
                    obj[key] = sanitized;

                }
                // Push the object to array
                formattedData.push(obj);

            }

            //setAlertMessage("Please wait. Do not refresh the page.");
            //setIsAlertModalOpen(true);

            // API call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/bulkdrug' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(formattedData),
            });

            const data = await response.json();

            console.log('Response status:', response.status);
            console.log('Response data:', data);
           
            if (response.status !== 200) {
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
            if (!totalResponse.trim()) {
                totalResponse = "All drugs added successfully!";
            }
            else {
                totalResponse = "Some drugs could not be added. Please review the file.";
            }

            // Set the display back to the main page
            setAlertMessage(totalResponse);
            setIsAlertModalOpen(true);

        }
        catch (error) {
            console.error("Error reading Excel file:", error);
            setAlertMessage("An error occurred while processing the request. Please check the file format.");
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
                            <th>DIN</th>
                            <th>Drug Name</th>
                            <th>Dosage</th>
                            <th>Strength</th>
                            <th>Manufacturer</th>
                            <th>Concentration</th>
                            <th>Reference Brand</th>
                            <th>Container Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>12345678</td>
                            <td>Tylenol</td>
                            <td>1 Pill</td>
                            <td>500mg</td>
                            <td>Johnson & Johnson</td>
                            <td>50mg/mL</td>
                            <td>Tylenol</td>
                            <td>100mL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <AlertModal
                            isOpen={isAlertModalOpen}
                            message={alertMessage}
                            onClose={() => {
                                setIsAlertModalOpen(false);
                                setDisplay("main");
                                getDrugs();
                            }}
                        />
            <div>
                <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
                <button className="button" type="button" onClick={handleAdd}>Add Drugs</button><br></br><br></br>
            </div>
        </div>

    )

}

export default BulkDrugs;