//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Sanitization import
import { SanitizeInput } from '@components/datasanitization/sanitization';


const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function EditPatient({setDisplay, selectedPatient, setSelectedPatient}) {

    //states for selected patient
    const [patientID, setPatientID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [sex, setSex] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [allergies, setAllergies] = useState('');
    const [conditions, setConditions] = useState('');

    //What to do when data is selected
    const handleSelect = (rowData) => {
        // Set the data to what's in the object
        setPatientID(he.decode(rowData["Patient ID"] || ''));
        setFirstName(he.decode(rowData["First Name"] || ''));
        setLastName(he.decode(rowData["Last Name"] || ''));

        // DOB is more complex because it includes time which the date picker does not want
        const dobWithTime = rowData["Date of Birth"];
        if (dobWithTime) {
            const dobDate = new Date(dobWithTime);
            const dobWithoutTime = dobDate.toISOString().slice(0, 10);
            setDob(dobWithoutTime);
        } else {
            setDob('');
        }

        // Back to our regularly scheduled programming
        setSex(he.decode(rowData["Sex"] || ''));
        setAddress(he.decode(rowData["Address"] || ''));
        setCity(he.decode(rowData["City"] || ''));
        setHospitalName(he.decode(rowData["Hospital"] || ''));
        setRoomNumber(he.decode(rowData["Room #"] || ''));
        setUnitNumber(he.decode(rowData["Unit #"] || ''));
        setAllergies(he.decode(rowData["Allergies"] || ''));
        setConditions(he.decode(rowData["Conditions"] || ''));
    };

    useEffect(() => {
        if (selectedPatient) {
            handleSelect(selectedPatient);
        }
    }, [selectedPatient]);

    //submit changes to patient
    const SubmitEdit = async (e) => {

        e.preventDefault();
        
        //create patient object
        let editedPatient = {
            PPR: SanitizeInput(patientID),
            FName: SanitizeInput(firstName),
            LName: SanitizeInput(lastName),
            DOB: dob,
            Sex: SanitizeInput(sex),
            Address: SanitizeInput(address),
            City: SanitizeInput(city),
            HospitalName: SanitizeInput(hospitalName),
            RoomNumber: SanitizeInput(roomNumber),
            UnitNumber: SanitizeInput(unitNumber),
            Allergies: SanitizeInput(allergies),
            Conditions: SanitizeInput(conditions)
        }

        try{

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Patient/editpatient' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedPatient)
            });

            if (response.ok) {
                alert("Patient edited successfully");
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
            setDisplay("main");
            setSelectedPatient({ "Patient ID": null, selected: false });

        }
        catch(error){
            console.error(error);
        }


        
    }

    return(

        <div>
            {/* Displays the form for editing a patient */}
            <form className="regular-form" onSubmit={SubmitEdit}>

                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required></input>
                <br></br>

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required></input>
                <br></br>

                <label htmlFor="dob">Date of Birth:</label>
                <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required></input>
                <br></br>

                <label htmlFor="sex">Sex:</label>
                <input type="text" id="sex" value={sex} onChange={(e) => setSex(e.target.value)} required></input>
                <br></br>

                <label htmlFor="address">Address:</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required></input>
                <br></br>

                <label htmlFor="city">City:</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required></input>
                <br></br>

                <label htmlFor="hospitalName">Hospital:</label>
                <input type="text" id="hospitalName" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required></input>
                <br></br>

                <label htmlFor="roomNumber">Room Number:</label>
                <input type="text" id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required></input>
                <br></br>

                <label htmlFor="unitNumber">Unit Number:</label>
                <input type="text" id="unitNumber" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} required></input>
                <br></br>

                <label htmlFor="allergies">Allergies:</label>
                <input type="text" id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} required></input>
                <br></br>

                <label htmlFor="conditions">Conditions:</label>
                <input type="text" id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} required></input>
                <br></br>

                <button className="button">Submit Changes</button>

            </form>
        </div>

    )

}

export default EditPatient;