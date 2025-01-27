// React imports
import { useState } from 'react';

// Other imports
import readXlsxFile from 'read-excel-file';
import { SanitizeInput } from '@components/datasanitization/sanitization';

function BulkPatients({setDisplay}) {

    const [excelFile, setExcelFile] = useState(null);

    const handleAdd = async () => {

        if (!excelFile) {
            alert("Please select a file.");
            return;
        }

        const headerMapping = {
            "First Name" : "FName",
            "Last Name" : "LName",
            "Date of Birth" : "DOB",
            "Sex" : "Sex",
            "Address" : "Address",
            "City" : "City",
            "Hospital" : "HospitalName",
            "Room #" : "RoomNumber",
            "Unit #" : "UnitNumber",
            "Allergies" : "Allergies",
            "Conditions" : "Conditions"};

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
                obj["PPR"] = null;
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

                    // Check if it's the DOB since that one is a nightmare sent from hell to kill me
                    if (key === "DOB") {
                        // Format the date
                        let date = new Date(rawData[i][j]);
                        let month = String(date.getMonth() + 1).padStart(2, '0');
                        let day = String(date.getDate()).padStart(2, '0');
                        let year = date.getFullYear();
                        let formattedDate = `${year}-${month}-${day}`;

                        // Sanitize the formatted date
                        let sanitizedDate = SanitizeInput(formattedDate);
                        obj[key] = sanitizedDate;
                    }
                    else{
                        // Sanitize the input
                        let sanitized = SanitizeInput(rawData[i][j]);

                        // Assign each column to keys
                        obj[key] = sanitized;
                    }
                }
                // Push the object to array
                formattedData.push(obj);

            }

            alert("Please wait. Do not refresh the page.");

            // API call
            const response = await fetch('https://localhost:7172/api/Patient/bulkpatient' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            // Make sure the response is ok
            if (!response.ok) {
                alert("Error adding patients. Please try again." + response.statusText + " " + response.status + "!");
                return;
            }

            const data = await response.json();
           
            if (!response.ok) {
                // Alert out the message sent from the API
                alert(data.message);
            }

            let totalResponse = "";

            // Get the info for any rows that may have failed
            for (const element of data.data){
                totalResponse += element + "\n";
            }

            // If there were no failures, this will be empty so lets just say success
            if (totalResponse === "") {
                totalResponse = "All patients added successfully!";
            }
            
            alert(totalResponse);

            // Set the display back to the main page
            setDisplay("main");

        }
        catch (error) {
            console.error("Error reading Excel file:", error);
        }

    }

    return(

        <div>
            <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
            <button className="button" type="button" onClick={handleAdd}>Add Patients</button><br></br><br></br>
        </div>

    )

}

export default BulkPatients;