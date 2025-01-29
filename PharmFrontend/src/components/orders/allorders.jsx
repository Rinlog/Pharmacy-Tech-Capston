import React from "react";
import $ from 'jquery';
import {useState} from 'react';
import './Orders.css';
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function AllOrders(){
    const [OrdersGotten,setOrdersGotten] = useState(false);
    const [onlyOne,setonlyOne] = useState(1);

    const [ApprovedOrder, setApprovedOrders] = useState([])
    const [RejectedOrder, setRejectedOrders] = useState([])
    const [OtherOrder, setOtherOrders] = useState([])
    $(document).ready(async function(){
        setonlyOne(onlyOne+1);
        if (onlyOne == 1){
            try{
                let Data = await $.ajax({
                    method:"POST",
                    url:"https://"+BackendIP+':'+BackendPort+"/api/Order/getorders",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    success:function(data){
                        setOrdersGotten(true);
                    }});
                Data = Data.data; //a weird line because of how the previous team wrote code... too late to change structure
                
                Data.forEach(async Order => {
                    let NamedData = await $.ajax({
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
                            "Content-Type":"application/json"
                        },
                        success:function(data){

                        }});
                    //Now that we have all the data we will output it
                    let CurrentOrder = (
                        <tr key={Order.rxNum}>
                            <td>{he.decode(Order.rxNum)}</td>
                            <td>{he.decode(Order.ppr)}</td>
                            <td>{he.decode(NamedData.patientLName)}</td>
                            <td>{he.decode(NamedData.patientFName)}</td>
                            <td>{he.decode(NamedData.din)}</td>
                            <td>{he.decode(NamedData.drugName)}</td>
                            <td>{he.decode(NamedData.physicianID)}</td>
                            <td>{he.decode(NamedData.physicianLName)}</td>
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
                        </tr>

                    )
                    if (Order.status == "Approved"){
                        ApprovedOrder.push(CurrentOrder);
                    }
                    else if (Order.status == "Rejected"){
                        RejectedOrder.push(CurrentOrder)
                    }
                    else{
                        OtherOrder.push(CurrentOrder);
                    }
                });
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
            </tr>
        </thead>
    )
    const PageContent = (
        <div>
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
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Approved">
                        {ApprovedOrder}
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