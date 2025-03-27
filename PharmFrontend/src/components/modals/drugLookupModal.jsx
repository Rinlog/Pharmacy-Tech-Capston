import $ from 'jquery';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import AlertModal from "@components/modals/alertModal";
import Dropdown from 'react-bootstrap/Dropdown';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function DrugLookupModal({visible, setVisible,setDrug}){

    //Search related
    const [SearchBy, setSearchBy] = useState("name");
    const [SearchByDisplay,setSearchByDisplay] = useState("Drug Name");
    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();

    //Drug stuff
    const [Drugs, setDrugs] = useState([]); //for holding the table data

    const [DrugData, setDrugData] = useState();
    const [OG_DrugData, setOG_DrugData] = useState([]);
    const [FetchedData, setFetchedData] = useState(false);
    const [RadioSelected, setRadioSelected] = useState(false);
    const Headers = (
        <tr>
            <th></th>
            <th>DIN</th>
            <th>Drug Name</th>
            <th>Dosage</th>
            <th>Strength</th>
            <th>Manufacturer</th>
            <th>Concentration</th>
            <th>Reference Brand</th>
            <th>Containter Size</th>
        </tr>
    )
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalDrugData = OG_DrugData //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredDrugs = LocalDrugData.filter(function(Drug){
            
                let result = expression.test(Drug[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setDrugData(FilteredDrugs);
        }
        else{
            setDrugData(OG_DrugData);
        }
    }

    function HandleSelect(Drug){
        setDrug(Drug); //on the add order and ammend order page, it gets formatted
        setRadioSelected(true);
    }
    
    //used for when page first loads
    useEffect( function(){
        const Interval = setInterval(function(){
            if (FetchedData == false){
                getDrugs();
            }
            else{
                clearInterval(Interval);
            }
        },200)
        return (
            function(){
                clearInterval(Interval);
            }
        )
    },[FetchedData])
    useEffect(function(){
        let TempDrug = [];
        if (DrugData != undefined && DrugData != null && DrugData != ''){
            DrugData.forEach(function(Drug){
                TempDrug.push(
                    <tr key={Drug.din}>
                        <td><input type="radio" name="Drugradio" class="Drugradio" onClick={function(e){HandleSelect(Drug)}}></input></td>
                        <td>{Drug.din}</td>
                        <td>{Drug.name}</td>
                        <td>{Drug.dosage}</td>
                        <td>{Drug.strength}</td>
                        <td>{Drug.manufacturer}</td>
                        <td>{Drug.concentration}</td>
                        <td>{Drug.referenceBrand}</td>
                        <td>{Drug.containerSize}</td>
                    </tr>
                )
            })
            setDrugs(TempDrug);
        }
    },[DrugData])
    async function getDrugs(){
        let data = await $.ajax({
            url:'https://'+BackendIP+':'+BackendPort+'/api/drug/getdrugs',
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Key-Auth':ApiAccess
            }
        })
        data = data.data;
        setOG_DrugData(data);
        setDrugData(data);
        setFetchedData(true);

    }

    function onClose(){
        setFetchedData(false);
        setVisible(false);
    }
    function SelectDrug(){
        if (RadioSelected == true){
            onClose();
            setRadioSelected(false);
        }
        
    }
    return(
        <div>
            <AlertModal
                isOpen={AlertModalOpen}
                message={AlertMessage}
                onClose={function(){
                    setAlertModalOpen(false);
                }}
            ></AlertModal>
            <Modal
            show={visible}
            onHide={onClose}
            size="xl"
            className="Modal"
            centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>Select Drug Below</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        {FetchedData ? (
                            <div>
                                <div className='d-flex align-items-center pl-3'>
                                    <div>
                                        <input type="text" id="drugSearch" placeholder={"Search by "+SearchByDisplay} onChange={e => Search(e.target.value)}/>
                                    </div>
                                    <small className='pl-1'>SearchBy:</small>
                                    <Dropdown>
                                        <Dropdown.Toggle className='HideButtonCSS SearchTypeButton'>
                                            <svg width={30} height={35} viewBox="1 -4 30 30" preserveAspectRatio="xMinYMin meet" >
                                                <rect id="svgEditorBackground" x="0" y="0" width="10px" height="10px" style={{fill: 'none', stroke: 'none'}}/>
                                                <circle id="e2_circle" cx="10" cy="10" style={{fill:'white',stroke:'black',strokeWidth:'2px'}} r="5"/>
                                                <line id="e3_line" x1="14" y1="14" x2="20.235" y2="20.235" style={{fill:'white',stroke:'black',strokeWidth:'2px'}}/>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item id="din" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("DIN");
                                            }}>DIN</Dropdown.Item>
                                            <Dropdown.Item id="name" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Drug Name");
                                            }}>Drug Name</Dropdown.Item>
                                            <Dropdown.Item id="dosage" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Dosage");
                                            }}>Dosage</Dropdown.Item>
                                            <Dropdown.Item id="strength" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Strength");
                                            }}>Strength</Dropdown.Item>
                                            <Dropdown.Item id="manufacturer" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Manufacturer");
                                            }}>Manufacturer</Dropdown.Item>
                                            <Dropdown.Item id="concentration" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Concentration");
                                            }}>Concentration</Dropdown.Item>
                                            <Dropdown.Item id="referenceBrand" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Reference Brand");
                                            }}>Reference Brand</Dropdown.Item>
                                            <Dropdown.Item id="containerSize" onClick={(e)=>{setSearchBy(e.target.id)
                                                    setSearchByDisplay("Containter Size");
                                            }}>Container Size</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <table>
                                        <thead>
                                            {Headers}
                                        </thead>
                                        <tbody>
                                            {Drugs}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Button type="button" onClick={SelectDrug} id="DrugConfirm" className='ModalbuttonG w-100'>Confirm</Button>
                                </div>
                            </div>
                        ) : "Fetching Data..."}
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default DrugLookupModal;