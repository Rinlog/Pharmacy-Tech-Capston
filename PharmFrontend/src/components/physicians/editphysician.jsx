//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Sanitization import
import { SanitizeInput } from '@components/datasanitization/sanitization';
import AlertModal from '../modals/alertModal';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function EditPhysician({setDisplay, selectedPhysician, setSelectedPhysician}) {

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    //states for selected physician
    const [physicianID, setPhysicianID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');    

    //What to do when data is selected
    const handleSelect = (rowData) => {
        // Set the data to what's in the object
        setPhysicianID(he.decode(rowData["Physician ID"] || ''));
        setFirstName(he.decode(rowData["First Name"] || ''));
        setLastName(he.decode(rowData["Last Name"] || ''));
        setCity(he.decode(rowData["City"] || ''));
        setProvince(he.decode(rowData["Province"] || ''));
    };

    useEffect(() => {
        if (selectedPhysician) {
            handleSelect(selectedPhysician);
        }
    }, [selectedPhysician]);

    //submit changes to physician
    const SubmitEdit = async (e) => {

        e.preventDefault();
        
        //create physician object
        let editedPhysician = {
            PhysicianID: SanitizeInput(physicianID),
            FName: SanitizeInput(firstName),
            LName: SanitizeInput(lastName),
            City: SanitizeInput(city),
            Province: SanitizeInput(province)
        }

        try{

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/editphysician' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(editedPhysician)
            });

            if (response.ok) {
                setAlertMessage("Physician edited successfully");
                setIsAlertModalOpen(true);
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
            
        }
        catch(error){
            console.error(error);
        }


        
    }

    return(

        <div>
            {/* Displays the form for editing a physician */}
            <form className="regular-form" onSubmit={SubmitEdit}>

                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required></input>
                <br></br>

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required></input>
                <br></br>

                <label htmlFor="city">City:</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required></input>
                <br></br>

                <label htmlFor="province">Province:</label>
                <select id="province" value={province} onChange={(e) => setProvince(e.target.value)} required>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="YT">Yukon</option>
                </select>

                <button className="button">Submit Changes</button>

                <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {
                    setIsAlertModalOpen(false)
                    setDisplay("main");
                    setSelectedPhysician({ "Physician ID": null, selected: false });
                }}
            />
            </form>
        </div>

    )

}

export default EditPhysician;