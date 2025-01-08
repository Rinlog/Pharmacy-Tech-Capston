import { useState, useEffect } from "react";
import { SanitizeEmail, SanitizeName, SanitizeDate, SanitizeInput } from "@components/datasanitization/sanitization";


const AddDrugModal = ({ isOpen, onClose}) => {

    const [modalHeight, setModalHeight] = useState('auto');

    const AddDrug = async () => {

        // Sanitize the inputs
            // DIN must be an 8 digit number
            if(!/^\d{8}$/.test(document.getElementById('DIN').value)){
                alert("DIN must be an 8 digit number");
                return;
            }
            let din = SanitizeInput(document.getElementById('DIN').value);
            let name = SanitizeInput(document.getElementById('drugName').value);
            let dosage = SanitizeInput(document.getElementById('dosage').value);
            let strength = SanitizeInput(document.getElementById('strength').value);
            let manufacturer = SanitizeInput(document.getElementById('manufacturer').value);
            let concentration = SanitizeInput(document.getElementById('concentration').value);
            let referenceBrand = SanitizeInput(document.getElementById('referenceBrand').value);
            let containerSize = SanitizeInput(document.getElementById('containerSize').value);

        try {
            // Call the API
            const response = await fetch('https://localhost:7172/api/Drug/adddrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    "DIN": din,
                    "name": name,
                    "dosage": dosage,
                    "strength": strength,
                    "manufacturer": manufacturer,
                    "concentration": concentration,
                    "referenceBrand": referenceBrand,
                    "containerSize": containerSize
                })
            });
            
            if(response.status === 200) {
                // Alert the user that the drug was added
                alert("Drug Added");
                // Close the modal
                onClose();
            }
            else{// Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        AddDrug();
    }

    const handleClose = () => {
        onClose();
    }

    return (
        isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight, width: '60%' }}>
                    <span className="close" onClick={handleClose}>&times;</span>

                    <form onSubmit={handleSubmit} style={{ width: '90%'}}>
                        <h1>Add Drug</h1>

                        <label htmlFor="DIN">DIN:</label>
                        <input type="text" id="DIN" name="DIN" required/>
                        <br></br>

                        <label htmlFor="drugName">Drug Name:</label>
                        <input type="text" id="drugName" name="drugName" required/>
                        <br></br>

                        <label htmlFor="dosage">Dosage:</label>
                        <input type="text" id="dosage" name="dosage" required/>
                        <br></br>

                        <label htmlFor="strength">Strength:</label>
                        <input type="text" id="strength" name="strength" required/>
                        <br></br>

                        <label htmlFor="manufacturer">Manufacturer:</label>
                        <input type="text" id="manufacturer" name="manufacturer" required/>
                        <br></br>

                        <label htmlFor="concentration">Concentration:</label>
                        <input type="text" id="concentration" name="concentration" required/>
                        <br></br>

                        <label htmlFor="referenceBrand">Reference Brand:</label>
                        <input type="text" id="referenceBrand" name="referenceBrand"/>
                        <br></br>

                        <label htmlFor="containerSize">Container Size:</label>
                        <input type="text" id="containerSize" name="containerSize" required/>
                        <br></br>

                        <br></br>

                        <button type="submit">Add Drug</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default AddDrugModal;