import React from "react";
import {useState } from "react";
import $ from 'jquery';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image"
import './printorder.css';
import { DropdownButton } from "react-bootstrap";
import { useCookies } from 'react-cookie';

import { useParams } from "react-router-dom";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function printOrder(){
    //this displays the print order page

    $(document).ready(async function(){

        try{
            await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/VerifyOrderNotPrinted",
                data: JSON.stringify(OrderID),
                headers:{
                    "Content-Type":"application/json"
                },
                success:function(data){
                   if (data == false){
                    window.location.replace("/home")
                   }
                }
            });
        }
        catch(ex){
            if (ex.responseText != null){
                alert(ex.responseText);
            }
            else{
                alert("Sorry, something went wrong");
            }
        }

    })

    const [show, setShow] = useState(false);
    const [PrintPreview,setPrintPreview] = useState();
    const [PrinterOption, setPrinterOption] = useState("Print To PDF");

    const [cookies] = useCookies(['user','admin']);
    const {user,admin} = cookies;

    const {OrderID} = useParams(); //used to get the url Query String

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        try{
            await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/GeneratePrintPreview",
                data: JSON.stringify(OrderID+"~!~"+undefined),
                headers:{
                    "Content-Type":"application/json"
                },
                success:function(data){
                    setPrintPreview(data);
                }
            });
            setShow(true);
        }
        catch(ex){
            if (ex.responseText != null){
                alert(ex.responseText);
            }
            else{
                alert("Sorry, something went wrong");
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
                    "Content-Type":"application/json"
                },
                success:function(data){
                    Verified = data;
                }
            });
        }
        catch(ex){
            if (ex.responseText != null){
                alert(ex.responseText);
                return;
            }
            else{
                console.log(ex);
                alert("could not connect to backend servers");
                return;
            }
        }
        if (Verified == false){alert("Can not print an order that wasn't verified by you");return;}
        //first is print to pdf
        if (PrinterOption.toLowerCase() === "print to pdf"){
            try{
                if (OrderID != null){
                    setTimeout(function(){
                        window.location.replace("/home")
                    }
                    ,1000)
                    window.location = "https://"+BackendIP+':'+BackendPort+"/api/printer/PrintToPDF?OrderInfo="+OrderID+"~!~"+"1";   
                }
                else{
                    alert("No order id Provided");
                }
            }
            catch(ex){
                if (ex.responseText != undefined){
                    alert(ex.responseText);
                }
                else{
                    alert("Could not connect to backend servers")
                }
            }
        }
        //this will print to printer
        else{
            try{
                if (OrderID != null){
                    await $.ajax({
                        method:"POST",
                        url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintOrder",
                        data: JSON.stringify(OrderID+"~!~"+"5"+"~!~"+"1"),
                        headers:{
                            "Content-Type":"application/json"
                        },
                        success:function(data){
                            alert(data)
                            window.location.replace("/home")
                        }
                    });
                }
                else{
                    alert("No order id Provided");
                }
            }
            catch(ex){
                if (ex.responseText != undefined){
                    alert(ex.responseText);
                }
                else{
                    alert("Could not connect to backend servers")
                }
            }
            
        }
    }
    
    function ChoosePrintOption(e){
        
        $("#PrinterOption").text("");
        $("#PrinterOption").text(e);
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
                    >
                        <Dropdown.Item eventKey={"Print To PDF"}>
                            Print To PDF
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"Print from Printer"}>
                            Print from Printer
                        </Dropdown.Item>
                    </DropdownButton>
                    <div id="PrinterOption">
                        {PrinterOption}
                    </div>
                </div>
                <div id="PrintImage">
                    <Image src={PrintPreview} alt="Print Preview of Order" rounded fluid></Image>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={HandlePrint}>
                Print
            </Button>
             </Modal.Footer>
         </Modal>
    );

    
    return(
            <div className="Container">
                {PrintModal}
                <div className="Header">
                    <h1>Order {OrderID} has been successfully verified</h1>
                </div>
                <div className="DisplayText">
                    <img src="/images/GreenVerified.png" alt="Verification checkmark" className="VerifiedImage"></img>
                </div>
                <div className="Buttons">
                    <button type="button" id="Home" className="RegularButton"><a href="/home">Home</a></button>
                    <button type="button" id="Print" onClick={handleShow} className='RegularButton'>Print</button>
                </div>
            </div>
    )
}

export default printOrder;