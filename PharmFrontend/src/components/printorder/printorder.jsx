import React from "react";
import {useState } from "react";
import $ from 'jquery';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image"
import './printorder.css';
import { DropdownButton } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
function printOrder(){
    //this displays the print order page

    //setting some default css
    document.body.style = 'background-color: #007599';
    $(document).ready(function(){
        document.getElementById("navbarMenu").style = "margin-right: 1em";
        let Items = document.getElementsByClassName("navbar-brand");
        Items[0].style = "margin-left: 1em";
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
                url:"https://localhost:7172/api/printer/GeneratePrintPreview",
                data: JSON.stringify(OrderID),
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
                url:"https://localhost:7172/api/printer/VerifyUser",
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
                    window.location = "https://localhost:7172/api/printer/PrintToPDF?OrderID="+OrderID;   
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
                        url:"https://localhost:7172/api/printer/PrintOrder",
                        data: JSON.stringify(OrderID),
                        headers:{
                            "Content-Type":"application/json"
                        },
                        success:function(data){
                            alert(data)
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
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"/>
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