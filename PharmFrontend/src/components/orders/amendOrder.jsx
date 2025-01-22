//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

//modal imports
import DrugLookupModal from '@components/modals/drugLookupModal.jsx';
import PatientLookupModal from '@components/modals/patientLookupModal.jsx';
import PhysicianLookupModal from '@components/modals/physicianLookupModal.jsx';

function AmendOrder(item){

    //modal stuff
    const [drug, setDrug] = useState(null);
    const [patient, setPatient] = useState(null);
    const [physician, setPhysician] = useState(null);
    
    const [drugIsOpen, setDrugIsOpen] = useState(false);
    const [patientIsOpen, setPatientIsOpen] = useState(false);
    const [physicianIsOpen, setPhysicianIsOpen] = useState(false);

    //form states from db
    const [formPatient, setFormPatient] = useState('');
    const [formDIN, setFormDIN] = useState('');
    const [formDbDose, setFormDbDose] = useState('');
    const [formPhysician, setFormPhysician] = useState('');

    //form states from entry
    const [rx, setRx] = useState('');
    const [route, setRoute] = useState('');
    const [formDose, setFormDose] = useState('');
    const [formForm, setFormForm] = useState('');
    const [frequency, setFrequency] = useState('');
    const [SIG, setSIG] = useState('');
    const [SIGDesc, setSIGDesc] = useState('');
    const [duration, setDuration] = useState('');
    const [quantity, setQuantity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [comments, setComments] = useState('No Comments');

    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;

    //when the drug is selected
    useEffect(() => {

        if (drug !== undefined && drug !== null){
            let formatted = drug["DIN"] + " - " + drug["Drug Name"];
            setFormDIN(formatted);

            if (drug["Dosage"] !== undefined && drug["Dosage"] !== null){
                formatted = "EX: (" + drug["Dosage"] + ")";
                setFormDbDose(formatted);
            }
        }

    },[drug]);

    //when the patient is selected
    useEffect(() => {

        if (patient !== undefined && patient !== null){
            let formatted = patient["Patient ID"] + " - " + patient["Last Name"] + ", " + patient["First Name"];
            setFormPatient(formatted);
        }

    },[patient]);

    //when the physician is selected
    useEffect(() => {

        if (physician !== undefined && physician !== null){
            let formatted = physician["Physician ID"] + " - " + physician["Last Name"] + ", " + physician["First Name"];
            setFormPhysician(formatted);
        }

    },[physician]);

    //set up form
    const SetupForm = (oldData) => {

            //set up form
            setDrug({
                "DIN": oldData["DIN"],
                "Drug Name": oldData["Drug Name"]
            });

            setPhysician({
                "Physician ID": oldData["Physician ID"],
                "Last Name": oldData["Phys Last Name"],
                "First Name": oldData["Phys First Name"]
            });

            setPatient({
                "Patient ID": oldData["Patient ID"],
                "First Name": oldData["First Name"],
                "Last Name": oldData["Last Name"]
            });

            setRx(oldData["Rx Number"]);
            setRoute(oldData["Route"]);
            setFormDose(oldData["Prescribed Dose"]);
            setFormForm(oldData["Form"]);
            setFrequency(oldData["Frequency"]);
            setSIG(oldData["SIG Code"]);
            setSIGDesc(oldData["SIG Description"]);
            setDuration(oldData["Duration"]);
            setQuantity(oldData["Quantity"]);
            setStartDate(oldData["Start Date"]);
            setStartTime(oldData["Start Time"]);
            setComments(oldData["Comments"]);

    }

    useEffect(() => {

        if (item !== null && item !== undefined) SetupForm(item);

    },[item])

    //form submission
    const OnSubmit = (e) =>{
        e.preventDefault();
    }

        return (

            <div>
            
            <form className="form" id="addorder" onSubmit={OnSubmit}>

                <label htmlFor="orderPatient">Patient:</label>
                <input className="text-input" readOnly={true} value={formPatient}></input>

                <button type="button" className="button" onClick={() => setPatientIsOpen(true)}>Patient</button>

                {patientIsOpen && (
                <PatientLookupModal
                    patientIsOpen={patientIsOpen}
                    setPatientIsOpen={setPatientIsOpen}
                    setPatient={setPatient}
                />
                )}

                <br></br>

                <label htmlFor="orderDrug">Medication:</label>
                <input className="text-input" id="orderDrug" required={true} readOnly={true} value={formDIN}></input> 

                <label htmlFor="orderDose">Dose:</label>
                <input className="text-input" id="orderDose" required={true} defaultValue={formDose} onChange={(e) => setFormDose(e.target.value)}></input>
                <label>{formDbDose}</label>
                
                <button type="button" className="button" id="drugBtn" onClick={() => setDrugIsOpen(true)}>Drugs</button>


                {drugIsOpen && (
                <DrugLookupModal
                    drugIsOpen={drugIsOpen}
                    setDrugIsOpen={setDrugIsOpen}
                    setDrug={setDrug}
                />
                )}

                <br></br>

                <label htmlFor="orderForm">Form:</label>
                <input className="text-input" id="orderForm" required={true} defaultValue={formForm} onChange={(e) => setFormForm(e.target.value)}></input> <br></br>

                <label htmlFor="orderRoute">Route:</label>
                <input className="text-input" id="orderRoute" required={true} defaultValue={route} onChange={(e) => setRoute(e.target.value)}></input> <br></br>

                <label htmlFor="orderFrequency">Frequency:</label>
                <input className="text-input" id="orderFrequency" required={true} defaultValue={frequency} onChange={(e) => setFrequency(e.target.value)}></input> <br></br>

                <label htmlFor="orderDuration">Duration:</label>
                <input className="text-input" id="orderDuration" required={true} defaultValue={duration} onChange={(e) => setDuration(e.target.value)}></input> <br></br>

                <label htmlFor="orderQuantity">Quantity:</label>
                <input className="text-input" id="orderQuantity" required={true} defaultValue={quantity} onChange={(e) => setQuantity(e.target.value)}></input>

                <br></br>

                <label htmlFor="orderPhysician">Physician:</label>
                <input className="text-input" id="orderPhysician" required={true} readOnly={true} value={formPhysician} onChange={setFormPhysician}></input>

                <button type="button" className="button" onClick={() => setPhysicianIsOpen(true)}>Physician</button>

                {physicianIsOpen && (
                <PhysicianLookupModal
                    physicianIsOpen={physicianIsOpen}
                    setPhysicianIsOpen={setPhysicianIsOpen}
                    setPhysician={setPhysician}
                />
                )}

                <br></br>

                <label htmlFor="orderSIG">SIG:</label>
                <input type="text" id="orderSIG" className="text-input" required={true} defaultValue={SIG} onChange={(e) => setSIG(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">SIG Description:</label>
                <input type="text" id="orderStart" className="text-input" required={true} defaultValue={SIGDesc} onChange={(e) => setSIGDesc(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">Start Date:</label>
                <input type="date" id="orderStart" className="date-input" required={true} defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)}></input> <br></br>

                <label htmlFor="orderTime">Start Time:</label>
                <input id="orderTime" className="text-input" required={true} defaultValue={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
                <label>XX:XX Format</label> <br></br>

                <label htmlFor="orderComments">Comments:</label>
                <input type="text" id="orderComments" className="text-input" required={true} defaultValue={comments} onChange={(e) => setComments(e.target.value)}></input> <br></br>

                <button type="submit" className="button" required={true} onClick={OnSubmit}>Submit</button>

            </form>
            
        </div>

        )

}

export default AmendOrder;