import React from "react";
import {useState } from "react";
import $ from 'jquery';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image"
import { DropdownButton, Nav } from "react-bootstrap";
import { useCookies } from 'react-cookie';

import { useParams } from "react-router-dom";
import axios from "axios";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
import { useNavigate } from "react-router-dom";
//alert modal
import AlertModal from '@components/modals/alertModal';
function printOrder(){
    let Navigate = useNavigate();
    //this displays the print order page


    const [show, setShow] = useState(false);
    const [PrintPreview,setPrintPreview] = useState();
    const [PrinterOption, setPrinterOption] = useState("Print To PDF");

    const [cookies] = useCookies(['user','admin']);
    const {user,admin} = cookies;

    const {OrderID} = useParams(); //used to get the url Query String

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();
    
    async function VerifyOrderNotPrinted(){
        try{
            await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/VerifyOrderNotPrinted",
                data: JSON.stringify(OrderID),
                headers:{
                    "Content-Type":"application/json",
                    'Key-Auth':ApiAccess
                },
                success:function(data){
                   if (data == false){
                    console.log("test");
                    Navigate("/home");
                   }
                }
            });
        }
        catch(ex){
            if (ex.responseText != null){
                setAlertMessage(ex.responseText);
                setAlertModalOpen(true);
            }
            else{
                setAlertMessage("Sorry, something went wrong");
                setAlertModalOpen(true);
            }
        }
    }
    //this line is so that the modal can stay popped up when someone hits print. React re-renders once the modal is set to visible so this prevents the page from verifying
    //order status until the modal is closed
    if (AlertModalOpen == false){
        VerifyOrderNotPrinted(); //checks on page load if order was already printed
    }

    const handleClose = () => {
        setPrinterOption("Print To PDF");
        setShow(false);
    }
    const handleShow = async () => {
        try{
            await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/GeneratePrintPreview",
                data: JSON.stringify(OrderID+"~!~"+""),
                headers:{
                    "Content-Type":"application/json",
                    'Key-Auth':ApiAccess
                },
                success:function(data){
                    setPrintPreview(data);
                }
            });
            setShow(true);
        }
        catch(ex){
            if (ex.responseText != null){
                setAlertMessage(ex.responseText);
                setAlertModalOpen(true);
            }
            else{
                setAlertMessage("Sorry, something went wrong");
                setAlertModalOpen(true);
            }
        }

    }

    
    async function  HandlePrint(){
        let Verified = false;
        let Info = user + "~!~" + OrderID
        try{
            await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/VerifyUser",
                data: JSON.stringify(Info),
                headers:{
                    "Content-Type":"application/json",
                    'Key-Auth':ApiAccess
                },
                success:function(data){
                    Verified = data;
                }
            });
        }
        catch(ex){
            if (ex.responseText != null){
                setAlertMessage(ex.responseText);
                setAlertModalOpen(true);
            }
            else{
                setAlertMessage("Could not connect to backend servers");
                setAlertModalOpen(true);
            }
        }
        if (Verified == false){
            setAlertMessage("Can not print an order that wasn't verified by you");
            setAlertModalOpen(true);
        }
        //first is print to pdf
        if (PrinterOption.toLowerCase() === "print to pdf"){
            try{
                if (OrderID != null){
                    let result = await axios({
                        url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintToPDF?OrderInfo="+OrderID+"~!~"+"1",
                        method: "get",
                        headers:{
                            "Key-Auth":ApiAccess
                        },
                        responseType: 'blob'
                    })
                    const href = URL.createObjectURL(result.data); //creates a custom link to the file to download

                    //stores it in an a tag which we then click through code
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'PrintedPDF.pdf');
                    $("body").append(link)
                    link.click();

                    //now we remove both the generated link and a tag
                    $("body").remove(link);
                    URL.revokeObjectURL(href);
                    Navigate("/home");
                }
                else{
                    setAlertMessage("No order id provided");
                    setAlertModalOpen(true);
                }
            }
            catch(ex){
                if (ex.responseText != null){
                    setAlertMessage(ex.responseText);
                    setAlertModalOpen(true);
                }
                else{
                    setAlertMessage("Could not connect to backend servers");
                    setAlertModalOpen(true);
                }
            }
        }
        //this will print to printer
        else{
            try{
                if (OrderID != null){
                    let result = await $.ajax({
                        method:"POST",
                        url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintOrder",
                        data: JSON.stringify(OrderID+"~!~"+"5"+"~!~"+"1"),
                        headers:{
                            "Content-Type":"application/json",
                            'Key-Auth':ApiAccess
                        }
                    });
                    setAlertMessage(result);
                    setAlertModalOpen(true);
                }
                else{
                    setAlertMessage("No order id provided");
                    setAlertModalOpen(true);
                }
            }
            catch(ex){
                if (ex.responseText != null){
                    setAlertMessage(ex.responseText);
                    setAlertModalOpen(true);
                    return;
                }
                else{
                    setAlertMessage("Could not connect to backend servers");
                    setAlertModalOpen(true);
                    return;
                }
            }
            
        }
    }
    function ChoosePrintOption(e){
        
        setPrinterOption(e);
    }
    let PrintModal = (
        <Modal 
        show={show} 
        onHide={handleClose} 
        size="lg"
        className="Modal"
        centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Print Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
                <div className="PrintOptionsSection">
                    <DropdownButton
                        onSelect={ChoosePrintOption}
                        title="Print Options"
                        className="ModalDropDownB"
                    >
                        <Dropdown.Item eventKey={"Print To PDF"}>
                            Print To PDF
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"Print from Printer"}>
                            Print from Printer
                        </Dropdown.Item>
                    </DropdownButton>
                    <div id="PrinterOption">
                        <label>{PrinterOption}</label>
                    </div>
                </div>
                <div id="PrintImage">
                    <div className="d-flex2" id="Loading3">
                            <div className="Loading Dot1">
                                .
                            </div>
                            <div className="Loading Dot2">
                                .
                            </div>
                            <div className="Loading Dot3">
                                .
                            </div>
                    </div>
                    {<Image src={PrintPreview} alt="Print Preview of Order" rounded fluid onLoad={function(e){
                        $("#Loading3").addClass("hide");
                    }}></Image>}
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button className="ModalbuttonB" onClick={handleClose}>
                Cancel
            </Button>
            <Button className="ModalbuttonG" onClick={HandlePrint}>
                Print
            </Button>
             </Modal.Footer>
         </Modal>
    );

    
    return(
            <div className="Container">
                {PrintModal}
                <AlertModal
                    isOpen={AlertModalOpen}
                    message={AlertMessage}
                    onClose={function(){
                        setAlertModalOpen(false);
                    }}
                ></AlertModal>
                <div className="Header">
                    <h1>Order {OrderID} has been successfully verified</h1>
                </div>
                <div className="DisplayText">
                    <img src="/images/GreenVerified.png" alt="Verification checkmark" className="VerifiedImage"></img>
                </div>
                <div className="Buttons">
                    <button type="button" id="Home"  onClick={function(e){
                        Navigate("/home");
                    }}>Home</button>
                    <button type="button" id="Print" onClick={handleShow}>Print</button>
                </div>
            </div>
    )
}

export default printOrder;