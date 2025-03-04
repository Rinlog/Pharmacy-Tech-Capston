import React, { useCallback } from "react";
import $, { grep } from 'jquery';
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
import AlertModal from "../modals/alertModal";


const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function AllOrders(){

    //search stuff
    const [SearchBy, setSearchBy] = useState("First Name");
    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    //Table structure variables
    const [OrdersGotten,setOrdersGotten] = useState(false);
    const [onlyOne,setonlyOne] = useState(1);

    const [OG_OrderData, setOG_OrderData] = useState([])
    const [OrderData, setOrderData] = useState([])

    const [ApprovedOrder, setApprovedOrders] = useState([])
    const [RejectedOrder, setRejectedOrders] = useState([])
    const [OtherOrder, setOtherOrders] = useState([])

    const [cookies] = useCookies(["user"])
    const [DisplayAllVerifiedOrders, setDisplayAllVerifiedOrders] = useState(true);
    const [DisplayMyVerifiedOrders, setDisplayMyVerifiedOrders] = useState(false);

    const [OG_MyOrderData, setOG_MyOrderData] = useState([])
    const [MyOrderData, setMyOrderData] = useState([])

    const [MyApprovedOrder, setMyApprovedOrders] = useState([])
    const [Reload, setReload] = useState(false);
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
    //handles reloading when table structure is modified
    useEffect(function(){
        //these regrab all data and re-generate tables
        if (Reload == true){
            LoadAllOrders();
            LoadVerifiedByMe();
            setReload(false);
        }
    },[Reload])

    function ReloadTable(){
        setReload(true);
    }
    const handleClose = () => {
        ClearPrintInfo();
        ReloadTable();
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
                setAlertMessage(ex.responseText);
                setIsAlertModalOpen(true);
            }
            else{
                setAlertMessage("Sorry, something went wrong");
                setIsAlertModalOpen(true);
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
                setAlertMessage(ex.responseText);
                setIsAlertModalOpen(true);
                return;
            }
            else{
                console.log(ex);
                setAlertMessage("could not connect to backend servers");
                setIsAlertModalOpen(true);
                return;
            }
        }
        if (Verified === false) {
            setAlertMessage("Can not print an order that wasn't verified by you");
            setIsAlertModalOpen(true);
            return;
        }
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
                    handleClose(); //reloads and closes modal
                }
                else{
                    setAlertMessage("No order id Provided");
                    setIsAlertModalOpen(true);
                }
            }
            catch(ex){
                if (ex.responseText != undefined){
                    setAlertMessage(ex.responseText);
                    setIsAlertModalOpen(true);
                }
                else{
                    setAlertMessage("Could not connect to backend servers");
                    setIsAlertModalOpen(true);
                }
            }
        }
        //this will print to printer
        else{
            try{
                if (OrderID != null){
                    if (isNaN(PrintQuantity)) {
                        setAlertMessage(PrintQuantity + " is not a number");
                        setIsAlertModalOpen(true);
                        return;
                    }
                    if (PrintQuantity <10 && PrintQuantity > 0){
                            await $.ajax({
                                method:"POST",
                                url:"https://"+BackendIP+':'+BackendPort+"/api/printer/PrintOrder",
                                data: JSON.stringify(+OrderID+"~!~"+PrintStatusID+"~!~"+PrintQuantity),
                                headers:{
                                    "Content-Type":"application/json",
                                    'Key-Auth':ApiAccess
                                },
                                success:function(data){
                                    setAlertMessage(data);
                                    setIsAlertModalOpen(true);
                                    handleClose(); //reloads and closes modal
                                }
                            });
                    }
                    else{
                        setAlertMessage("Please enter a quantity from 1 to 10");
                        setIsAlertModalOpen(true);
                        return;
                    }
                }
                else{
                    setAlertMessage("No order id Provided");
                    setIsAlertModalOpen(true);
                }
            }
            catch(ex){
                if (ex.responseText != undefined){
                    setAlertMessage(ex.responseText);
                    setIsAlertModalOpen(true);
                }
                else{
                    setAlertMessage("Could not connect to backend servers");
                    setIsAlertModalOpen(true);
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
    function GenerateTables(Data,Type){
        let OrderNumber = 0;
        //Now that we have all the data we will output it
        let TempApproved = []
        let TempMyApproved = []
        let TempRejected = []
        let TempOther = []
        Data.forEach(function(Order){
            let CurrentOrder = (
                <tr key={Order["Rx Number"]}>
                    <td>{Order["Rx Number"]}</td>
                    <td>{Order["Patient ID"]}</td>
                    <td>{Order["Last Name"]}</td>
                    <td>{Order["First Name"]}</td>
                    <td>{Order["DIN"]}</td>
                    <td>{Order["Drug Name"]}</td>
                    <td>{Order["Physician ID"]}</td>
                    <td>{Order["Phys Last Name"]}</td>
                    <td>{Order["Status"]}</td>
                    <td>{Order["Date Submitted"]}</td>
                    <td>{Order["SIG Code"]}</td>
                    <td>{Order["SIG Description"]}</td>
                    <td>{Order["Form"]}</td>
                    <td>{Order["Route"]}</td>
                    <td>{Order["Prescribed Dose"]}</td>
                    <td>{Order["Frequency"]}</td>
                    <td>{Order["Duration"]}</td>
                    <td>{Order["Quantity"]}</td>
                    <td>{Order["Start Date"]}</td>
                    <td>{Order["Start Time"]}</td>
                    <td>{Order["Comments"]}</td>
                    {Order["Status"] == "Approved" && Order["printStatusID"] == "" && cookies.user == Order["verifier"]&&(
                        <td><button id="PrintOrder" orderid={Order["Rx Number"]} onClick={handleShow}>Print</button></td>
                    )}
                    {Order["Status"] == "Approved" && Order["printStatusID"] != "" && cookies.user == Order["verifier"]&&(
                        <td><button id="RePrintOrder" orderid={Order["Rx Number"]} onClick={handleShow}>Reprint</button></td>
                    )}
                    {Order["Status"] == "Approved" && cookies.user != Order.verifier &&(
                        <td></td>
                    )}
                </tr>

            )
            if (Order.Status == "Approved"){
                if (Type == "All"){
                    TempApproved.push(CurrentOrder);
                    setApprovedOrders(TempApproved)
                }
                else{
                    TempMyApproved.push(CurrentOrder)
                    setMyApprovedOrders(TempMyApproved)
                }
            }
            else if (Order.Status == "Rejected"){
                TempRejected.push(CurrentOrder)
                setRejectedOrders(TempRejected)
            }
            else{
                TempOther.push(CurrentOrder);
                setOtherOrders(TempOther)
            }
            OrderNumber+=1
        })
    }
    //used for the search functionality
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalOrderData = OG_OrderData //makes sure we start searching with every search option included.
        let LocalMyOrderData = OG_MyOrderData
        if (SearchTerm != ""){
            let FilteredOrders = LocalOrderData.filter(function(Order){
            
                let result = expression.test(Order[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            let MyFilteredOrders = LocalMyOrderData.filter(function(Order){
            
                let result = expression.test(Order[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setApprovedOrders([]);
            setMyApprovedOrders([]);
            setRejectedOrders([]);
            setOtherOrders([]);
            setOrderData(FilteredOrders);
            setMyOrderData(MyFilteredOrders);
        }
        else{
            setOrderData(OG_OrderData);
            setMyOrderData(OG_MyOrderData);
        }
    }
    //used for the hide and show buttons
    function HandleHideShowPress(e){
        let TriggerHideVal = $(e.currentTarget).attr("triggerhide")
        let TableAffecting = $(e.currentTarget).attr("table")

        if (TriggerHideVal == "true"){
            $("#"+TableAffecting).addClass("hide");
            $("#"+TableAffecting + "Hide").addClass("hide"); //this would be the un-crossed out eye, it hides the orders when clicked
            $("#"+TableAffecting + "Show").removeClass("hide"); //this would be the crossed out eye, it shows the orders when clicked
        }
        else{
            $("#"+TableAffecting).removeClass("hide");
            $("#"+TableAffecting + "Show").addClass("hide");
            $("#"+TableAffecting + "Hide").removeClass("hide");
        }
    }
    useEffect(function(){
        GenerateTables(OrderData,"All")
        GenerateTables(MyOrderData,"My")
    },[OrderData,MyOrderData])
    async function LoadAllOrders(){
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
        let TempData = []
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
                success:function(NamedData){
                    CurrentOrderAmount+=1
                    TempData.push({
                        "Rx Number":Order.rxNum,
                        "Patient ID":Order.ppr,
                        "Last Name":NamedData.patientLName,
                        "First Name":NamedData.patientFName,
                        "DIN":Order.din,
                        "Drug Name": NamedData.drugName,
                        "Physician ID": Order.physicianID,
                        "Phys Last Name": NamedData.physicianLName,
                        "Status": Order.status,
                        "Date Submitted": Order.dateSubmitted,
                        "SIG Code": Order.sig,
                        "SIG Description": Order.sigDescription,
                        "Form": Order.form,
                        "Route": Order.route,
                        "Prescribed Dose": Order.prescribedDose,
                        "Frequency": Order.frequency,
                        "Duration":Order.duration,
                        "Quantity":Order.quantity,
                        "Start Date": Order.startDate,
                        "Start Time": Order.startTime,
                        "Comments" : Order.comments,
                        "printStatusID": Order.printStatusID,
                        "verifier":Order.verifier
                    })
                    if (CurrentOrderAmount == OrderAmount){
                        //sorts ascending
                        TempData.sort((a,b)=>{
                            if (a["Rx Number"] > b["Rx Number"]){
                                return 1
                            }
                            else if (a["Rx Number"] < b["Rx Number"]){
                                return -1
                            }
                            else{
                                return 0
                            }
                        })
                        setOG_OrderData(TempData)
                        setOrderData(TempData)
                    }
                }});
        });
    }
    async function LoadVerifiedByMe(){
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
            let TempData = []
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
                    success:function(NamedData){
                        CurrentOrderAmount+=1
                        TempData.push({
                            "Rx Number":Order.rxNum,
                            "Patient ID":Order.ppr,
                            "Last Name":NamedData.patientLName,
                            "First Name":NamedData.patientFName,
                            "DIN":Order.din,
                            "Drug Name": NamedData.drugName,
                            "Physician ID": Order.physicianID,
                            "Phys Last Name": NamedData.physicianLName,
                            "Status": Order.status,
                            "Date Submitted": Order.dateSubmitted,
                            "SIG Code": Order.sig,
                            "SIG Description": Order.sigDescription,
                            "Form": Order.form,
                            "Route": Order.route,
                            "Prescribed Dose": Order.prescribedDose,
                            "Frequency": Order.frequency,
                            "Duration":Order.duration,
                            "Quantity":Order.quantity,
                            "Start Date": Order.startDate,
                            "Start Time": Order.startTime,
                            "Comments" : Order.comments,
                            "printStatusID": Order.printStatusID,
                            "verifier":Order.verifier
                        })
                        if (CurrentOrderAmount == OrderAmount){
                            //sorts ascending
                            TempData.sort((a,b)=>{
                                if (a["Rx Number"] > b["Rx Number"]){
                                    return 1
                                }
                                else if (a["Rx Number"] < b["Rx Number"]){
                                    return -1
                                }
                                else{
                                    return 0
                                }
                            })
                            setOG_MyOrderData(TempData)
                            setMyOrderData(TempData)
                    }
                    }});
        })
        }
        catch(ex){
            if (ex.responseText != null){
                setAlertMessage(ex.responseText);
                setIsAlertModalOpen(true);
            }
            else{
                setAlertMessage("Failed to get orders");
                setIsAlertModalOpen(true);
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
                LoadAllOrders();
                LoadVerifiedByMe();
            }
            catch(ex){
                if (ex.responseText != null){
                    setAlertMessage(ex.responseText);
                    setIsAlertModalOpen(true);
                }
                else{
                    setAlertMessage("Failed to get orders");
                    setIsAlertModalOpen(true);
                    return;
                }
            }
        }
        
    })

    //sorting useeffect. this is easier than doing a full reright of code for the jsx loading
    useEffect(() => {
        //using jquery
        //attaching this to the header called "sroll-table" in the page content section below
        $(".scroll-table table thead th").off("click").on("click", function() {

            //header the table belongs to
            var table = $(this).closest("table");
            //getting the element from the table
            var tbody = table.find("tbody");

            //getting all the rows and putting them in an array
            var rows = tbody.find("tr").toArray();
            //index of the header clicked
            var index = $(this).index();

            //sort and toggle the order. checking to see if it has asc, if this does switch to desc
            var asc = !$(this).hasClass("asc");

            //need to make sure to remove the header class to put in a new one
            table.find("th").removeClass("asc desc");
            //depending on the 
            $(this).toggleClass("asc", asc);
            $(this).toggleClass("desc", !asc);

            //this will sort the tables now
            rows.sort((a, b) => {

                var UP = $(a).children("td").eq(index).text().toUpperCase();
                var DOWN = $(b).children("td").eq(index).text().toUpperCase();

                //took some logic from sortbyheader page
                if (UP < DOWN) {
                    return asc ? -1 : 1;
                }
                if (UP > DOWN) {
                    return asc ? 1 : -1;
                }
                return 0;
            });

            //place the new rows back into the table (append them)
            $.each(rows, (i, row) => {
                tbody.append(row);
            });
        });
      }, [OrdersGotten]);

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
            <div className='d-flex align-items-center'>
                <div>
                    <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
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
                        <Dropdown.Item id="Rx Number" onClick={(e)=>{setSearchBy(e.target.id)}}>Rx Number</Dropdown.Item>
                        <Dropdown.Item id="Patient ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Patient ID</Dropdown.Item>
                        <Dropdown.Item id="Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Last Name</Dropdown.Item>
                        <Dropdown.Item id="First Name" onClick={(e)=>{setSearchBy(e.target.id)}}>First Name</Dropdown.Item>
                        <Dropdown.Item id="DIN" onClick={(e)=>{setSearchBy(e.target.id)}}>DIN</Dropdown.Item>
                        <Dropdown.Item id="Physician ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Physician ID</Dropdown.Item>
                        <Dropdown.Item id="Phys Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Phys Last Name</Dropdown.Item>
                        <Dropdown.Item id="Status" onClick={(e)=>{setSearchBy(e.target.id)}}>Status</Dropdown.Item>
                        <Dropdown.Item id="Date Submitted" onClick={(e)=>{setSearchBy(e.target.id)}}>Date Submitted</Dropdown.Item>
                        <Dropdown.Item id="SIG Code" onClick={(e)=>{setSearchBy(e.target.id)}}>SIG Code</Dropdown.Item>
                        <Dropdown.Item id="SIG Description" onClick={(e)=>{setSearchBy(e.target.id)}}>SIG Description</Dropdown.Item>
                        <Dropdown.Item id="Form" onClick={(e)=>{setSearchBy(e.target.id)}}>Form</Dropdown.Item>
                        <Dropdown.Item id="Route" onClick={(e)=>{setSearchBy(e.target.id)}}>Route</Dropdown.Item>
                        <Dropdown.Item id="Prescribed Dose" onClick={(e)=>{setSearchBy(e.target.id)}}>Prescribed Dose</Dropdown.Item>
                        <Dropdown.Item id="Frequency" onClick={(e)=>{setSearchBy(e.target.id)}}>Frequency</Dropdown.Item>
                        <Dropdown.Item id="Duration" onClick={(e)=>{setSearchBy(e.target.id)}}>Duration</Dropdown.Item>
                        <Dropdown.Item id="Quantity" onClick={(e)=>{setSearchBy(e.target.id)}}>Quantity</Dropdown.Item>
                        <Dropdown.Item id="Start Date" onClick={(e)=>{setSearchBy(e.target.id)}}>Start Date</Dropdown.Item>
                        <Dropdown.Item id="Start Time" onClick={(e)=>{setSearchBy(e.target.id)}}>Start Time</Dropdown.Item>
                        <Dropdown.Item id="Comments" onClick={(e)=>{setSearchBy(e.target.id)}}>Comments</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="d-flex align-items-center">
                <h2>Rejected</h2>
                <div className="hide" id="RejectedShow">
                    <button className="HideButtonCSS" triggerhide="false" table="Rejected" onClick={HandleHideShowPress}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                            <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                        </svg>
                    </button>
                </div>
                <div id="RejectedHide">
                    <button className="HideButtonCSS" triggerhide="true" table="Rejected" onClick={HandleHideShowPress}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="scroll-table">
                <table>
                    
                        {PageHeaders}
                    
                    <tbody id="Rejected">
                        {RejectedOrder}
                    </tbody>
                </table>
            </div>
            <div className="d-flex align-items-center">
                <h2>Approved</h2>
                    <div className="hide" id="ApprovedShow">
                        <button className="HideButtonCSS" triggerhide="false" table="Approved" onClick={HandleHideShowPress}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                                <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                            </svg>
                        </button>
                    </div>
                    <div  id="ApprovedHide">
                        <button className="HideButtonCSS" triggerhide="true" table="Approved" onClick={HandleHideShowPress}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                            </svg>
                        </button>
                    </div>
            </div>
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
            <div className="d-flex align-items-center">
                <h2>Other</h2>
                    <div className="hide"  id="OtherShow">
                        <button className="HideButtonCSS" triggerhide="false" table="Other" onClick={HandleHideShowPress}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                                <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                            </svg>
                        </button>
                    </div>
                    <div  id="OtherHide">
                        <button className="HideButtonCSS" triggerhide="true" table="Other" onClick={HandleHideShowPress}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                            </svg>
                        </button>
                    </div>
            </div>
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Other">
                        {OtherOrder}
                    </tbody>
                </table>
            </div>

            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {setIsAlertModalOpen(false)}}
            />
        </div>
    );
    return(

        <div>
            {OrdersGotten ? PageContent : "Fetching Data..."}
        </div>
    )

}

export default AllOrders;