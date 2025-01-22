import React from "react";
import $ from 'jquery';
import {useState} from 'react';
import './Orders.css';
function AllOrders(){
    const [OrdersGotten,setOrdersGotten] = useState(false);
    const [onlyOne,setonlyOne] = useState(1);

    $(document).ready(async function(){
        setonlyOne(onlyOne+1); //using this because for some reason the page gets called multiple times??? this reduces it to only twice
        if (onlyOne == 1){
            try{
                let Data = await $.ajax({
                    method:"POST",
                    url:"https://localhost:7172/api/Order/getorders",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    success:function(data){
                        setOrdersGotten(true);
                        console.log(data)
                    }});
                Data = Data.data; //a weird line because of how the previous team wrote code... too late to change structure
                
                Data.forEach(async Order => {
                    let NamedData = await $.ajax({
                        method:"POST",
                        url:"https://localhost:7172/api/Management/getnames",
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
                            console.log(data);
                        }});
                    //Now that we have all the data we will output it
                    if (Order.status == "Approved"){
                        
                    }
                    else if (Order.status == "Rejected"){

                    }
                    else{

                    }
                });
            }
            catch(ex){
                if (ex.responseText != null){
                    alert(ex.responseText);
                }
                else{
                    alert(ex);
                }
            }
        }
        
    })
    const PageHeaders = (
        <thead>
            <tr>
                <th></th>
                <th>RxNum</th>
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
            <h1>Rejected</h1>
            <div className="scroll-table">
                <table>
                    
                        {PageHeaders}
                    
                    <tbody id="Approved">
                        <tr>

                        </tr>
                    </tbody>
                </table>
            </div>
            <h1>Approved</h1>
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Rejected">
                        <tr>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h1>Other</h1>
            <div className="scroll-table">
                <table>
                    {PageHeaders}
                    <tbody id="Other">
                            <tr>
                            
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
    return(

        <span>
            {OrdersGotten ? PageContent : "Fetching Orders..."}
        </span>
    )

}

export default AllOrders;