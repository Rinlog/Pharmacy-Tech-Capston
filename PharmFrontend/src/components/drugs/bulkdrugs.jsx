// React imports
import { useState } from 'react';

// Other imports
import readXlsxFile from 'read-excel-file';
import { SanitizeInput, SanitizeLength } from '@components/datasanitization/sanitization';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function BulkDrugs({setDisplay}) {

    const [excelFile, setExcelFile] = useState(null);

    const handleAdd = async () => {

        if (!excelFile) {
            alert("Please select a file.");
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
                alert("Invalid Spreadsheet Format. Please check headers.");
                return;
            }

            // Create them as keys and format data

            let formattedData = [];

            for (let i = 1; i < rawData.length; i++) {
                let obj = {};
                for (let j = 0; j < keys.length; j++) {

                    // Check for empty columns
                    if (!rawData[i][j]) {
                        alert(`Empty cell found at row ${i + 1}, column ${j + 1}`);
                        return;
                    }
                    // Use the mapping to get the changed key names
                    let key = headerMapping[keys[j]];


                    // Convert the values to strings because type coercion is the devil
                    rawData[i][j] = String(rawData[i][j]);

                    // Cut the length of the data to the max for the database (255 for all fields except DIN)
                    if (key == "DIN" && !/^\d{8}$/.test(rawData[i][j])) {
                        // If the DIN is not 8 digits, send an error
                        alert(`DIN must be an 8 digit number at row ${i + 1}, column ${j + 1}`);
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

            alert("Please wait. Do not refresh the page.");

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
           
            if (response.status !== 200) {
                // Alert out the message sent from the API
                alert(data.message);
            }
            else{
                let totalResponse = "";

                // Get the info for any rows that may have failed
                for (const element of data.data){
                    totalResponse += element + "\n";
                }

                // If there were no failures, this will be empty so lets just say success
                if (totalResponse === "") {
                    totalResponse = "All drugs added successfully!";
                }
                
                alert(totalResponse);
            }

            // Set the display back to the main page
            setDisplay("main");

        }
        catch (error) {
            console.error("Error reading Excel file:", error);
            alert("Only excel files are currently supported");
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
            <div>
                <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
                <button className="button" type="button" onClick={handleAdd}>Add Drugs</button><br></br><br></br>
            </div>
        </div>

    )

}

export default BulkDrugs;