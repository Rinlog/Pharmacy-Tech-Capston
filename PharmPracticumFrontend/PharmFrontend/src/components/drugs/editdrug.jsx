//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Sanitization import
import { SanitizeInput } from '@components/datasanitization/sanitization';


function EditDrug({setDisplay, selectedDrug, setSelectedDrug}) {

    //states for selected drug
    const [din, setDin] = useState('');
    const [drugName, setDrugName] = useState('');
    const [dosage, setDosage] = useState('');
    const [strength, setStrength] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [concentration, setConcentration] = useState('');
    const [referenceBrand, setReferenceBrand] = useState('');
    const [containerSize, setContainerSize] = useState('');

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
            const response = await fetch('https://localhost:7172/api/Drug/editdrug' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedDrug)
            });

            if (response.ok) {
                alert("Drug edited successfully");
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
            setDisplay("main");
            setSelectedDrug({ "DIN": null, selected: false });

        }
        catch(error){
            console.error(error);
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

                <button className="button">Submit Changes</button>

            </form>
        </div>

    )

}

export default EditDrug;