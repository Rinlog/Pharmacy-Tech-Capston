//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Sanitization import
<<<<<<< HEAD
import { SanitizeInput } from '@components/datasanitization/sanitization';
=======
import { SanitizeInput, SanitizeLength } from '@components/datasanitization/sanitization';
import AlertModal from '../modals/alertModal';
>>>>>>> dev

const ApiAccess = import.meta.env.VITE_APIAccess
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort

function EditDrug({setDisplay, selectedDrug, setSelectedDrug, getDrugs}) {

    //states for selected drug
    const [din, setDin] = useState('');
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [strength, setStrength] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [concentration, setConcentration] = useState('');
    const [referenceBrand, setReferenceBrand] = useState('');
    const [containerSize, setContainerSize] = useState('');

    //Modal things
    const [isEditDrugModalOpen, setIsEditDrugOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    //What to do when data is selected
    const handleSelect = (rowData) => {
        // Set the data to what's in the object
        setDin(he.decode(rowData["DIN"] || ''));
        setDrugName(he.decode(rowData["Drug Name"] || ''));
        setDosage(he.decode(rowData["Dosage"] || ''));
        setStrength(he.decode(rowData["Strength"] || ''));
        setManufacturer(he.decode(rowData["Manufacturer"] || ''));
        setConcentration(he.decode(rowData["Concentration"] || ''));
        setReferenceBrand(he.decode(rowData["Reference Brand"] || ''));
        setContainerSize(he.decode(rowData["Container Size"] || ''));
    };

    useEffect(() => {
        //console.log(selectedDrug); //debugging
        if (selectedDrug) {
            handleSelect(selectedDrug);
        }
    }, [selectedDrug]);

    

    //submit changes to drug
    const SubmitEdit = async (e) => {

        e.preventDefault();
        
        //create drug object
        let editedDrug = {
            din: din,
            name: SanitizeInput(drugName),
            dosage: SanitizeInput(dosage),
            strength: SanitizeInput(strength),
            manufacturer: SanitizeInput(manufacturer),
            concentration: SanitizeInput(concentration),
            referenceBrand: SanitizeInput(referenceBrand),
            containerSize: SanitizeInput(containerSize)            
        }

        try{

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/editdrug' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(editedDrug)
            });
            
            if (response.ok) {
                setModalMessage("Drug edited successfully!");
                setIsEditDrugOpen(true);
            }
            else{
                const data = await response.json();
                setModalMessage(data.message | "Error updating drug");
                setIsEditDrugOpen(true);
            }

        }
        catch(error){
            console.error(error);
            setModalMessage(error.message || "An error has occurred.");
            setIsEditDrugOpen(true);     
        }  
    }

    return(

        <div>
            {/* Displays the form for editing a drug */}
            <form className="regular-form" onSubmit={SubmitEdit}>

                <label htmlFor="din">DIN:</label>
                <input type="text" id="din" value={din} disabled/>
                <br></br>

                <label htmlFor="drugName">Drug Name:</label>
                <input type="text" id="drugName" value={drugName} onChange={(e) => setDrugName(e.target.value)} required/>
                <br></br>

                <label htmlFor="dosage">Dosage:</label>
                <input type="text" id="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} required/>
                <br></br>

                <label htmlFor="strength">Strength:</label>
                <input type="text" id="strength" value={strength} onChange={(e) => setStrength(e.target.value)} required/>
                <br></br>

                <label htmlFor="manufacturer">Manufacturer:</label>
                <input type="text" id="manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required/>
                <br></br>

                <label htmlFor="concentration">Concentration:</label>
                <input type="text" id="concentration" value={concentration} onChange={(e) => setConcentration(e.target.value)} required/>
                <br></br>

                <label htmlFor="referenceBrand">Reference Brand:</label>
                <input type="text" id="referenceBrand" value={referenceBrand} onChange={(e) => setReferenceBrand(e.target.value)} required/>
                <br></br>

                <label htmlFor="containerSize">Container Size:</label>
                <input type="text" id="containerSize" value={containerSize} onChange={(e) => setContainerSize(e.target.value)} required/>
                <br></br>

                <button type="submit" className="button">
                    Submit Changes
                    </button>   
            </form>

            <AlertModal
                    isOpen={isEditDrugModalOpen}
                    message={modalMessage}
                    onClose={() => {
                        setIsEditDrugOpen(false);
                        setDisplay("main");
                        setSelectedDrug({ "DIN": null, selected: false });
                        getDrugs();
                    }}
                    />
        </div>

    )

}

export default EditDrug;