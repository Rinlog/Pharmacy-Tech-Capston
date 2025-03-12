//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

//modal imports
import DrugLookupModal from '@components/modals/drugLookupModal.jsx';
import PatientLookupModal from '@components/modals/patientLookupModal.jsx';
import PhysicianLookupModal from '@components/modals/physicianLookupModal.jsx';
import AlertModal from '@components/modals/alertModal';
import SIGLookupModal from "@components/modals/SIGLookupModal";
import PrescriptionUpload from './pictureUpload';
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
import axios from 'axios';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
function AddOrder(){

    //modal stuff
    const [drug, setDrug] = useState(null);
    const [patient, setPatient] = useState(null);
    const [physician, setPhysician] = useState(null);
    
    const [drugIsOpen, setDrugIsOpen] = useState(false);
    const [patientIsOpen, setPatientIsOpen] = useState(false);
    const [physicianIsOpen, setPhysicianIsOpen] = useState(false);
    const [SIGIsOpen, setSIGIsOpen] = useState(false);

    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();
    //form states from db
    const [formPatient, setFormPatient] = useState('');
    const [formDIN, setFormDIN] = useState('');
    const [formDbDose, setFormDbDose] = useState('');
    const [formPhysician, setFormPhysician] = useState('');

    //form states from entry
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
    const [savedImage, setSavedImage] = useState(null)
    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;
    
    function validate(){
        //these if statements are so that html5 will activate if one of the fields are blank and also for custom errors
        if (formPatient === ''){
            setAlertMessage("Patient is required");
            setAlertModalOpen(true);
            return false;
        }
        if (formDIN === ''){
            setAlertMessage("Medication is required");
            setAlertModalOpen(true);
            return false;
        }
        if (formDose === ''){return false;}
        if (formForm=== ''){return false;}
        if (route === ''){return false;}
        if (frequency === ''){return false;}
        if (duration === ''){return false;}
        if (quantity === ''){return false;}
        if (formPhysician === ''){
            setAlertMessage("Physician is required");
            setAlertModalOpen(true);
            return false;
        }
        if (SIG === ''){
            setAlertMessage("SIG code is required");
            setAlertModalOpen(true);
            return false;
        }
        if (startDate === ''){return false;}
        if (startTime === ''){return false;}
    }
    //used to submit the form only once image is added to backend and variable is set(if they chose to add an image)
    useEffect(function(){
        if (savedImage != null){
            //if it's greater than two that means it was set from the axios request
            //Object.keys is needed to get object length
            console.log(savedImage);
            if (Object.keys(savedImage).length > 2){
                AddOrder()
            }
        }
    },[savedImage])
    async function AddOrder(){
        let order = {

            "PPR": patient["ppr"],
            "DIN": drug["din"],
            "PhysicianID": physician["physicianID"],
            "Initiator": user,
            "SIG": SIG,
            "SIGDescription": SIGDesc,
            "Form": formForm,
            "Route": route,
            "Dose": formDose,
            "Frequency": frequency,
            "Duration": duration,
            "Quantity": quantity,
            "StartDate": startDate,
            "StartTime": startTime,
            "OrderImage": (savedImage == null) ?"None" : savedImage.filePath,
            "Comments": comments

        }

        console.log(order);

        //API call 
        try {
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/addorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(order)
            });
            const data = await response.json();
<<<<<<< HEAD
            console.log(data);
            alert(data.message);
            return;
=======
>>>>>>> dev

            if (data.message == "Order successfully created.") {
                setAlertMessage(data.message);
                setAlertModalOpen(true);
            }
            else {
                setAlertMessage(data.message);
                setAlertModalOpen(true);
                return;
            }
        }
        catch (error){
            setAlertMessage("Could not submit, please contact system administrator.");
            setAlertMessage(error)
            setAlertModalOpen(true);
        }
    }
    //form submission
    const OnSubmit = async (e) =>{
        
        if (validate() == false){return;}
        e.preventDefault();

        if (comments === '' || comments === null) setComments("No Comments");

        //this adds the image into the backend if one is chosen
        if (savedImage == null) {AddOrder(); return;}
        let formData = new FormData();
        formData.append('image',savedImage.file) //this needs to be named same as backend name
        try{
            let response = await axios({
            url: "https://"+BackendIP+":"+BackendPort+"/api/order/addorderimage",
            headers:{
                "Content-Type":"multipart/form-data",
                "Key-Auth":ApiAccess
            },
            method:"POST",
            responseType:"json",
            data:formData
            })
            setSavedImage({filePath:response.data,previewUrl:savedImage.previewUrl,CommitSave:true})
        }
        catch(error){
            if (error.response != undefined){
                if (error.response.data != undefined){
                    setAlertMessage(error.response.data)
                    setAlertModalOpen(true)
                }
                else{
                    setAlertMessage("Could not save image for unknown reason.. please try again later")
                    setAlertModalOpen(true)
                }
            }
            else{
                setAlertMessage(error.message);
                setAlertModalOpen(true)
            }
        }
        
    }

    //when the drug is selected
    useEffect(() => {

        if (drug !== undefined && drug !== null){
            let formatted = drug["din"] + " - " + drug["name"];
            setFormDIN(formatted);
            formatted = "EX: (" + drug["dosage"] + ")";
            setFormDbDose(formatted);
        }

    },[drug]);

    //when the patient is selected
    useEffect(() => {

        if (patient !== undefined && patient !== null){
            let formatted = patient["ppr"] + " - " + patient["lName"] + ", " + patient["fName"];
            setFormPatient(formatted);
        }

    },[patient]);

    //when the physician is selected
    useEffect(() => {
        if (physician !== undefined && physician !== null){
            let formatted = physician["physicianID"] + " - " + physician["lName"] + ", " + physician["fName"];
            setFormPhysician(formatted);
        }

    },[physician]);

    return(

        <Container fluid>
            <AlertModal
                isOpen={AlertModalOpen}
                message={AlertMessage}
                onClose={function(){
                    setAlertModalOpen(false);
                    if (AlertMessage == "Order successfully created."){
                        location.reload();
                    }
                }}
            ></AlertModal>
            <Row>
                <Col>
                    <form className="form" id="addorder" onSubmit={OnSubmit}>
                    <label htmlFor="orderPatient">Patient:</label>
                    <input className="text-input" readOnly={true} value={formPatient}></input>

                    <button type="button" className="button" onClick={() => setPatientIsOpen(true)}>Patient</button>


                    <PatientLookupModal
                        visible={patientIsOpen}
                        setVisible={setPatientIsOpen}
                        setPatient={setPatient}
                    />

                    <label htmlFor="orderDrug">Medication:</label>
                    <input className="text-input" id="orderDrug" required={true} readOnly={true} value={formDIN}></input> 

                    <label htmlFor="orderDose">Dose:</label>
                    <input className="text-input" id="orderDose" required={true} value={formDose} onChange={(e) => setFormDose(e.target.value)}></input>
                    <label>{formDbDose}</label>
                    
                    <button type="button" className="button" id="drugBtn" onClick={() => setDrugIsOpen(true)}>Drug</button>


                    <DrugLookupModal
                        visible={drugIsOpen}
                        setVisible={setDrugIsOpen}
                        setDrug={setDrug}
                    />

                    <label htmlFor="orderForm">Form:</label>
                    <input className="text-input" id="orderForm" required={true} value={formForm} onChange={(e) => setFormForm(e.target.value)}></input> <br></br>

                    <label htmlFor="orderRoute">Route:</label>
                    <input className="text-input" id="orderRoute" required={true} value={route} onChange={(e) => setRoute(e.target.value)}></input> <br></br>

                    <label htmlFor="orderFrequency">Frequency:</label>
                    <input className="text-input" id="orderFrequency" required={true} value={frequency} onChange={(e) => setFrequency(e.target.value)}></input> <br></br>

                    <label htmlFor="orderDuration">Duration:</label>
                    <input className="text-input" id="orderDuration" required={true} value={duration} onChange={(e) => setDuration(e.target.value)}></input> <br></br>

                    <label htmlFor="orderQuantity">Quantity:</label>
                    <input className="text-input" id="orderQuantity" required={true} value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>

                    <br></br>

                    <label htmlFor="orderPhysician">Physician:</label>
                    <input className="text-input" id="orderPhysician" required={true} readOnly={true} value={formPhysician} onChange={setFormPhysician}></input>

                    <button type="button" className="button" onClick={() => setPhysicianIsOpen(true)}>Physician</button>

                    <PhysicianLookupModal
                        visible={physicianIsOpen}
                        setVisible={setPhysicianIsOpen}
                        setPhysician={setPhysician}
                    />

                    <label htmlFor="orderSIG">SIG:</label>
                    <input type="text" id="orderSIG" className="text-input" required={true} readOnly={true} value={SIG} ></input>

                    <button type="button" className='button' onClick={function(e){setSIGIsOpen(true)}}>SIG Code</button><br></br>

                    <SIGLookupModal
                        visible={SIGIsOpen}
                        setVisible={setSIGIsOpen}
                        setSig={setSIG}
                        setSigDesc={setSIGDesc}
                    />

                    <label htmlFor="orderStart">SIG Description:</label>
                    <input type="text" id="orderStart" className="text-input" required={true} readOnly={true} value={SIGDesc}></input> <br></br>

                    <label htmlFor="orderStart">Start Date:</label>
                    <input type="date" id="orderStart" style={{width:'20%'}} className="date-input"  required={true} value={startDate} onChange={(e) => setStartDate(e.target.value)}></input> <br></br>

                    <label htmlFor="orderTime">Start Time:</label>
                    <input id="orderTime" className="text-input" required={true} value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
                    <label>XX:XX Format (24h)</label> <br></br>

                    <label htmlFor="orderComments">Comments:</label>
                    <input type="text" id="orderComments" className="text-input" required={true} value={comments} onChange={(e) => setComments(e.target.value)}></input> <br></br>

                    <button type="submit" className="button" required={true} onClick={OnSubmit}>Submit</button>

                </form>
                </Col>
                <Col className='d-flex'>
                    <PrescriptionUpload
                        savedImage={savedImage}
                        setSavedImage={setSavedImage}
                    ></PrescriptionUpload>
                </Col>
            </Row>
            
        </Container>


    )

}

export default AddOrder;