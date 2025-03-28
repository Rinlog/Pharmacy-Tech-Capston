//react imports 
import {useState, useEffect} from 'react';
import React from "react";
import $ from 'jquery';
//mode imports
import AddOrder from '@components/orders/addorder.jsx';
import MyOrders from '@components/orders/myorders.jsx';
import AllOrders from '@components/orders/allorders.jsx';
import { useParams } from 'react-router-dom';
function Orders() {
    
    const [content, setContent] = useState(<AllOrders></AllOrders>);
    const Location = useParams();
    const [RenderAmount, setRenderAmount] = useState(0);

    if (Location.specificPage!= undefined){
        //trick where it won't for re-render the page a bunch
        if (RenderAmount == 0){
            setRenderAmount(RenderAmount+1);
            if (RenderAmount <1){
                $(document).ready(function(){
                    $("#orderall").removeClass("selected");
                    $("#ordermy").addClass("selected");
                    $("#orderadd").removeClass("selected");
                })
                if (Location.specificPage == "myOrders"){
                    setContent(<MyOrders></MyOrders>);
                }
                else if (Location.specificPage == "AddOrder"){
                    setContent(<AddOrder></AddOrder>);
                }
            }
        }
    }
    else{
        if (RenderAmount != 0){
            setRenderAmount(0);
            $(document).ready(function(){
                $("#orderall").addClass("selected");
                $("#ordermy").removeClass("selected");
                $("#orderadd").removeClass("selected");
            })
            setContent(<AllOrders></AllOrders>);
        }
    }

    //change mode depending on content that should show
    const ChangeDisplay = (e) =>{

        let select = e.target.id;
        
        if (select === "orderall"){
            $("#orderall").addClass("selected");
            $("#ordermy").removeClass("selected");
            $("#orderadd").removeClass("selected");
            setContent(<AllOrders></AllOrders>);
        }
        else if (select === "ordermy"){
            $("#orderall").removeClass("selected");
            $("#ordermy").addClass("selected");
            $("#orderadd").removeClass("selected");
            setContent(<MyOrders></MyOrders>);
        }
        else if (select === "orderadd"){
            $("#orderall").removeClass("selected");
            $("#ordermy").removeClass("selected");
            $("#orderadd").addClass("selected");
            setContent(<AddOrder></AddOrder>);
        }

    }

    return(

        <div>
            <div className='page-header-name'>Orders</div>
            <hr/>

            <button className="button selected" id="orderall" onClick={ChangeDisplay}>All Orders</button>
            <button className="button" id="ordermy" onClick={ChangeDisplay}>My Orders</button>
            <button className="button" id="orderadd" onClick={ChangeDisplay}>Add Order</button>

            {content}

        </div>

    )

}

export default Orders;