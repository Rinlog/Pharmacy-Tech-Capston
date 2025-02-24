import $ from 'jquery';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import AlertModal from "@components/modals/alertModal";
import Dropdown from 'react-bootstrap/Dropdown';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function SIGLookupModal({visible, setVisible,setSig, setSigDesc}){
    //Search related
    const [SearchBy, setSearchBy] = useState("abbreviation");
    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();

    //SIG stuff
    const [SIGS, setSIGS] = useState([]);
    const [SIGData, setSIGData] = useState();
    const [OG_SIGData, setOG_SIGData] = useState([]);
    const [FetchedData, setFetchedData] = useState(false);
    const [RadioSelected, setRadioSelected] = useState(false);
    const Headers = (
        <tr>
            <th></th>
            <th>Abbreviation</th>
            <th>Description</th>
        </tr>
    )
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalSIGData = OG_SIGData //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredSIGs = LocalSIGData.filter(function(SIG){
            
                let result = expression.test(SIG[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setSIGData(FilteredSIGs);
        }
        else{
            setSIGData(OG_SIGData);
        }
    }

    function HandleSelect(abbreviation, description){
        setSig(abbreviation);
        setSigDesc(description);
        setRadioSelected(true);
    }
    
    //used for when page first loads
    useEffect( function(){
        const Interval = setInterval(function(){
            if (FetchedData == false){
                getSIGS();
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
        let TempSIG = [];
        if (SIGData != undefined && SIGData != null && SIGData != ''){
            SIGData.forEach(function(SIG){
                TempSIG.push(
                    <tr key={SIG.abbreviation}>
                        <td><input type="radio" name="SIGradio" onClick={function(e){HandleSelect(SIG.abbreviation, SIG.description)}}></input></td>
                        <td>{SIG.abbreviation}</td>
                        <td>{SIG.description}</td>
                    </tr>
                )
            })
            setSIGS(TempSIG);
        }
    },[SIGData])
    async function getSIGS(){
        let data = await $.ajax({
            url:'https://'+BackendIP+':'+BackendPort+'/api/SIG/getSIGs',
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Key-Auth':ApiAccess
            }
        })
        setOG_SIGData(data);
        setSIGData(data);
        setFetchedData(true);

    }

    function onClose(){
        setFetchedData(false);
        setVisible(false);
    }
    function SelectSIG(){
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
                        <h2>Select SIG Code below</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        {FetchedData ? (
                            <div>
                                <div className='d-flex align-items-center pl-3'>
                                    <div>
                                        <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle className='HideButtonCSS SearchTypeButton'>
                                            <svg width={30} height={35} viewBox="1 -4 30 30" preserveAspectRatio="xMinYMin meet" >
                                                <rect id="svgEditorBackground" x="0" y="0" width="10px" height="10px" style={{fill: 'none', stroke: 'none'}}/>
                                                <circle id="e2_circle" cx="10" cy="10" style={{fill:'white',stroke:'black',strokeWidth:'2px'}} r="5"/>
                                                <line id="e3_line" x1="14" y1="14" x2="20.235" y2="20.235" style={{fill:'white',stroke:'black',strokeWidth:'2px'}}/>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item id="abbreviation" onClick={(e)=>{setSearchBy(e.target.id)}}>Abbreviation</Dropdown.Item>
                                            <Dropdown.Item id="description" onClick={(e)=>{setSearchBy(e.target.id)}}>Description</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <table>
                                        <thead>
                                            {Headers}
                                        </thead>
                                        <tbody>
                                            {SIGS}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Button type="button" onClick={SelectSIG} className='ModalbuttonG w-100'>Confirm</Button>
                                </div>
                            </div>
                        ) : "Fetching Data..."}
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default SIGLookupModal;