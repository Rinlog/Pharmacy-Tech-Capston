import React from "react";
import $ from 'jquery';
import {useState} from 'react';
import { useEffect } from "react";
import './Orders.css';
import '../printorder/printorder.css'
import { useCookies } from "react-cookie";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import { Anchor, DropdownButton } from "react-bootstrap";   
import axios from "axios";
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function AllOrders(){

    //Table structure variables
    const [OrdersGotten,setOrdersGotten] = useState(false);
    const [onlyOne,setonlyOne] = useState(1);

    const [NamedData, setNamedData] = useState([])
    const [ApprovedOrder, setApprovedOrders] = useState([])
    const [RejectedOrder, setRejectedOrders] = useState([])
    const [OtherOrder, setOtherOrders] = useState([])

    const [cookies] = useCookies(["user"])
    const [DisplayAllVerifiedOrders, setDisplayAllVerifiedOrders] = useState(true);
    const [DisplayMyVerifiedOrders, setDisplayMyVerifiedOrders] = useState(false);

    const [myNamedData, setMyNamedData] = useState([])
    const [MyApprovedOrder, setMyApprovedOrders] = useState([])
    //Printing Related Variables
    const [show, setShow] = useState(false);
    const [reprintShow, setReprintShow] = useState(false);
    const [PrintReasonID, setPrintReasonID] = useState();
    const [PrintStatusID, setPrintStatusID] = useState(1);
    const [PrintReason, setPrintReason] = useState("Insufficient Supply")
    const [PrintPreview,setPrintPreview] = useState();
    const [PrinterOption, setPrinterOption] = useState("Print To PDF");
    const [OrderID, setOrderID] = useState("");

    const [DisplayPrintQuantity,setDisplayPrintQuantity] = useState(false)
    const [PrintQuantity, setPrintQuantity] = useState("")
    
    //PRINT RELATED CODE
    function UpdatePrintQuantity(e){
        setPrintQuantity(e.target.value)
    }

    //handles updating print reason id
    useEffect(function(){
        if (PrinterOption.toLowerCase().includes("pdf")){
            setDisplayPrintQuantity(false)
            if (PrintReasonID == undefined){
                setPrintStatusID(1); //regular print option was selected, was not a reprint
            }
            else if (PrintReasonID == 1){
                setPrintStatusID(2)
            }
            else if (PrintReasonID == 2){
                setPrintStatusID(3)
            }
            else if (PrintReasonID == 3){
                setPrintStatusID(4)
            }
        }
        else if (PrinterOption.toLowerCase().includes("printer")){
            setDisplayPrintQuantity(true)
            if (PrintReasonID == undefined){
                setPrintStatusID(5); //regular print option was selected, was not a reprint 
            }
            else if (PrintReasonID == 1){
                setPrintStatusID(6)
            }
            else if (PrintReasonID == 2){
                setPrintStatusID(7)
            }
            else if (PrintReasonID == 3){
                setPrintStatusID(8)
            }
        }
    },[PrintReasonID,PrinterOption])

    async function GeneratePrintPreview(OrderID){
        await $.ajax({
            method:"POST",
            url:"https://"+BackendIP+':'+BackendPort+"/api/printer/GeneratePrintPreview",
            data: JSON.stringify(OrderID+"~!~"+PrintQuantity),
            headers:{
                "Content-Type":"application/json",
                'Key-Auth':ApiAccess
            },
            success:function(data){
                setPrintPreview(data);
            }
        });
    }
    function ClearPrintInfo(){
        setShow(false);
        setReprintShow(false);
        setPrintReasonID();
        setPrintStatusID(1);
        setPrintReason("Insufficient Supply")
        setPrintPreview();
        setPrinterOption("Print To PDF");
        setOrderID("");

        setDisplayPrintQuantity(false)
        setPrintQuantity("")
    }
    const handleClose = () => {
        ClearPrintInfo()
    }
    const handleShow = async (e) => {
        let button = e.currentTarget;

        let LocalOrderID = button.getAttribute("orderid");
        setOrderID(LocalOrderID);
        //IMPORTANT TO USE LOCALORDERID IN THIS FUNCTION
        //because use states set method is async we can not access it in this function and get the correct value
        //hence we use the local one for here, the stateful one else where
        try{
            GeneratePrintPreview(LocalOrderID)
            if (button.id == "PrintOrder"){
                setShow(true);
            }
            else{
                setPrintReasonID(1)
                setReprintShow(true)
            }
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

    async function  HandlePrint(e){
        let Verified = false;
        let Info = cookies.user + "~!~" + OrderID
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
                    let result = await axios({
                        url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintToPDF?OrderInfo="+OrderID+"~!~"+PrintStatusID,
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
                    if (isNaN(PrintQuantity)){alert(PrintQuantity + " is not a number"); return;}
                    if (PrintQuantity <10 && PrintQuantity > 0){
                        setTimeout(async function(){
                            await $.ajax({
                                method:"POST",
                                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintOrder",
                                data: JSON.stringify(+OrderID+"~!~"+PrintStatusID+"~!~"+PrintQuantity),
                                headers:{
                                    "Content-Type":"application/json",
                                    'Key-Auth':ApiAccess
                                },
                                success:function(data){
                                    alert(data)
                                    window.location.replace("/home")
                                }
                            });
                        },1000)
                    }
                    else{
                        alert("please enter a quantity from 1 to 10");
                        return;
                    }
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
        setPrinterOption(e) 
    }

    function ChoosePrintReason(e){

        if (e == 1){
            setPrintReason("Insufficient Supply")
        }
        else if (e == 2){
            setPrintReason("Label Only")
        }
        else if (e == 3){
            setPrintReason("For Transfer")
        }

        setPrintReasonID(e)
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
                    <div className="d-flex2" id="Loading1">
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
                        $("#Loading1").addClass("hide");
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

    let RePrintModal = (
        <Modal 
        show={reprintShow} 
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
                <div className="PrintOptionsSection">
                    <DropdownButton
                        onSelect={ChoosePrintReason}
                        title="Reason for Reprinting"
                        className="ModalDropDownB"
                    >
                        <Dropdown.Item eventKey={1}>
                            Insufficient Supply
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={2}>
                            Label Only
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={3}>
                            For Transfer
                        </Dropdown.Item>
                    </DropdownButton>
                    <div id="PrinterReason">
                        <label>{PrintReason}</label>
                    </div>
                </div>
                <div className="PrintQuantity">
                    <Form>

                        {DisplayPrintQuantity && (
                        <div>
                            <Form.Control
                            type="text"
                            placeholder="Please enter Quantity to dispense"
                            onChange={UpdatePrintQuantity}
                        >

                        </Form.Control>
                        <small><b>NOTE:</b> amount dispensing will display on printed label</small>
                        </div>
                        )}
                    </Form>
                </div>
                <div id="PrintImage">
                    <div className="d-flex2" id="Loading2">
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
                        $("#Loading2").addClass("hide");
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
    //GENERATING TABLE STRUCTURE
    async function LoadVerifiedByMe(GenerateTableFunction){
        try{
            let Data = await $.ajax({
                method:"POST",
                url:"https://"+BackendIP+':'+BackendPort+"/api/Order/GetOrdersVerifiedByUser",
                data: JSON.stringify(cookies.user),
                headers:{
                    "Content-Type":"application/json",
                    'Key-Auth':ApiAccess
                },
                success:function(data){
                    
                }});

            let OrderAmount = Data.length;
            let CurrentOrderAmount = 0;
            Data.forEach(async Order => {
                    await $.ajax({
                    method:"POST",
                    url:"https://"+BackendIP+':'+BackendPort+"/api/Management/getnames",
                    data:JSON.stringify({
                        userID: Order.initiator,
                        ppr: Order.ppr,
                        physicianID: Order.physicianID,
                        din: Order.din,
                        // We also need to pass through empty strings for the other fields since the API expects them
                        patientFName: '',
                        patientLName: '',
                        drugName: '',
                        physicianFName: '',
                        physicianLName: '',
                        userFName: '',
                        userLName: '',
                    }),
                    headers:{
                        "Content-Type":"application/json",
                        'Key-Auth':ApiAccess
                    },
                    success:function(data){
                        CurrentOrderAmount+=1
                        myNamedData.push(data)
                        if (CurrentOrderAmount == OrderAmount){
                            GenerateTableFunction(Data,myNamedData,"My")
                        }
                    }});
        })
        }
        catch(ex){
            if (ex.responseText != null){
                alert(ex.responseText);
            }
            else{
                alert("Failed to get orders")
                return;
            }
        }
    }
    function SetDisplayAllOrders(){
        $("#AllOrders").addClass("selected")
        $("#VerifiedByMe").removeClass("selected")
        setDisplayAllVerifiedOrders(true);
        setDisplayMyVerifiedOrders(false);
    }
    function SetDisplayMyOrders(){
        $("#AllOrders").removeClass("selected")
        $("#VerifiedByMe").addClass("selected")
        setDisplayAllVerifiedOrders(false);
        setDisplayMyVerifiedOrders(true);
    }
    $(document).ready(async function(){
        setonlyOne(onlyOne+1);
        if (onlyOne == 1){
            try{
                let Data = await $.ajax({
                    method:"POST",
                    url:"https://"+BackendIP+':'+BackendPort+"/api/Order/getorders",
                    headers:{
                        "Content-Type":"application/json",
                        'Key-Auth':ApiAccess
                    },
                    success:function(data){
                        setOrdersGotten(true);
                    }});
                Data = Data.data; //a weird line because of how the previous team wrote code... too late to change structure

                let OrderAmount = Data.length;
                let CurrentOrderAmount = 0;
                Data.forEach(async Order => {
                        await $.ajax({
                        method:"POST",
                        url:"https://"+BackendIP+':'+BackendPort+"/api/Management/getnames",
                        data:JSON.stringify({
                            userID: Order.initiator,
                            ppr: Order.ppr,
                            physicianID: Order.physicianID,
                            din: Order.din,
                            // We also need to pass through empty strings for the other fields since the API expects them
                            patientFName: '',
                            patientLName: '',
                            drugName: '',
                            physicianFName: '',
                            physicianLName: '',
                            userFName: '',
                            userLName: '',
                        }),
                        headers:{
                            "Content-Type":"application/json",
                            'Key-Auth':ApiAccess
                        },
                        success:function(data){
                            CurrentOrderAmount+=1
                            NamedData.push(data)
                            if (CurrentOrderAmount == OrderAmount){
                                GenerateTables(Data,NamedData,"All")
                                LoadVerifiedByMe(GenerateTables)
                            }
                        }});
                });
                function GenerateTables(Data,NamedData,Type){
                    let OrderNumber = 0;
                    //Now that we have all the data we will output it
                    Data.forEach(function(Order){
                        let CurrentOrder = (
                            <tr key={Order.rxNum}>
                                <td>{he.decode(Order.rxNum)}</td>
                                <td>{he.decode(Order.ppr)}</td>
                                <td>{he.decode(NamedData[OrderNumber].patientLName)}</td>
                                <td>{he.decode(NamedData[OrderNumber].patientFName)}</td>
                                <td>{he.decode(NamedData[OrderNumber].din)}</td>
                                <td>{he.decode(NamedData[OrderNumber].drugName)}</td>
                                <td>{he.decode(NamedData[OrderNumber].physicianID)}</td>
                                <td>{he.decode(NamedData[OrderNumber].physicianLName)}</td>
                                <td>{he.decode(Order.status)}</td>
                                <td>{he.decode(Order.dateSubmitted)}</td>
                                <td>{he.decode(Order.sig)}</td>
                                <td>{he.decode(Order.sigDescription)}</td>
                                <td>{he.decode(Order.form)}</td>
                                <td>{he.decode(Order.route)}</td>
                                <td>{he.decode(Order.prescribedDose)}</td>
                                <td>{he.decode(Order.frequency)}</td>
                                <td>{he.decode(Order.duration)}</td>
                                <td>{he.decode(Order.quantity)}</td>
                                <td>{he.decode(Order.startDate)}</td>
                                <td>{he.decode(Order.startTime)}</td>
                                <td>{he.decode(Order.comments)}</td>
                                {Order.status == "Approved" && Order.printStatusID == "" && cookies.user == Order.verifier&&(
                                    <td><button id="PrintOrder" orderid={Order.rxNum} onClick={handleShow}>Print</button></td>
                                )}
                                {Order.status == "Approved" && Order.printStatusID != "" && cookies.user == Order.verifier&&(
                                    <td><button id="RePrintOrder" orderid={Order.rxNum} onClick={handleShow}>Reprint</button></td>
                                )}
                                {Order.status == "Approved" && cookies.user != Order.verifier &&(
                                    <td></td>
                                )}
                            </tr>
    
                        )
                        if (Order.status == "Approved"){
                            if (Type == "All"){
                                ApprovedOrder.push(CurrentOrder);
                            }
                            else{
                                MyApprovedOrder.push(CurrentOrder)
                            }
                        }
                        else if (Order.status == "Rejected"){
                            RejectedOrder.push(CurrentOrder)
                        }
                        else{
                            OtherOrder.push(CurrentOrder);
                        }
                        OrderNumber+=1
                    })
                    
                }

            }
            catch(ex){
                if (ex.responseText != null){
                    alert(ex.responseText);
                }
                else{
                    alert("Failed to get orders")
                    return;
                }
            }
        }
        
    })
    const PageHeaders = (
        <thead>
            <tr>
                <th>Rx Number</th>
                <th>Patient ID</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>DIN</th>
                <th>Drug Name</th>
                <th>Physician ID</th>
                <th>Phys Last Name</th>
                <th>Status</th>
                <th>Date Submitted</th>
                <th>SIG Code</th>
                <th>SIG Description</th>
                <th>Form</th>
                <th>Route</th>
                <th>Prescribed Dose</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Quantity</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>Comments</th>
                <th></th>
            </tr>
        </thead>
    )
    const PageContent = (
        <div>
            {PrintModal}
            {RePrintModal}
            <h2>Rejected</h2>
            <div className="scroll-table">
                <table>
                    
                        {PageHeaders}
                    
                    <tbody id="Rejected">
                        {RejectedOrder}
                    </tbody>
                </table>
            </div>
            <h2>Approved</h2>
            <div className="ApprovedButtons">
                <button id="VerifiedByMe" className="" onClick={SetDisplayMyOrders}>Verified by Me</button>
                <button id="AllOrders" className="selected" onClick={SetDisplayAllOrders}>All Orders</button>
            </div>
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Approved">
                        {DisplayAllVerifiedOrders == true && ApprovedOrder ||
                        DisplayMyVerifiedOrders == true && MyApprovedOrder
                        }
                    </tbody>
                </table>
            </div>
            <h2>Other</h2>
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Other">
                        {OtherOrder}
                    </tbody>
                </table>
            </div>
        </div>
    );
    return(

        <div>
            {OrdersGotten ? PageContent : "Fetching Data..."}
        </div>
    )

}

export default AllOrders;