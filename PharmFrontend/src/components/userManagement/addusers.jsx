//react imports
import { useState } from 'react';

//other imports
import readXlsxFile from 'read-excel-file';


const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function AddUsers() {

    const [excelFile, setExcelFile] = useState(null);

    const handleAdd = async () => {

        if (!excelFile) {
            alert("Please select a file.");
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

            //if headers don't match expexted, send error
            if (!identical){
                alert("Invalid Spreadsheet Format. Please check headers.");
                return;
            }

            //if they are, create them as keys and format data

            let formattedData = [];

            for (let i = 1; i < rawData.length; i++) {
                let obj = {};
                for (let j = 0; j < keys.length; j++) {
                    //check for empty columns
                    if (!rawData[i][j]) {
                        alert(`Empty cell found at row ${i + 1}, column ${j + 1}`);
                        return;
                    }
                    //Assign each column to keys
                    obj[keys[j]] = rawData[i][j];
                }
                //Push the object to array
                formattedData.push(obj);

            }

            alert("Please wait. Do not refresh the page.");

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/bulkadd' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
            const data = await response.json();
           
            let totalResponse = "";

            for (const element of data.data){
                totalResponse += element + "\n";
            }
            
            alert(totalResponse);


        } catch (error) {
            console.error("Error reading Excel file:", error);
        }

    }

    return(

        <div>
            <input type="file" placeholder="Select File" onChange={(event) => setExcelFile(event.target.files[0])}></input>
            <button className="button" type="button" onClick={handleAdd}>Add Users</button>
        </div>

    )

}

export default AddUsers;