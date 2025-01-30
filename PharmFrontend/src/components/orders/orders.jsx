//react imports 
import {useState, useEffect} from 'react';
import React from "react";
import $ from 'jquery';
//mode imports
import AddOrder from '@components/orders/addorder.jsx';
import MyOrders from '@components/orders/myorders.jsx';
import AllOrders from '@components/orders/allorders.jsx';

function Orders() {

    const [content, setContent] = useState(null);

     //setting some default css
     document.body.style = 'background-color: #007599';
    $(document).ready(async function(){
        document.getElementById("navbarMenu").style = "margin-right: 1em";
        let Items = document.getElementsByClassName("navbar-brand");
        Items[0].style = "margin-left: 1em";
    })
    //change mode depending on content that should show
    const ChangeDisplay = (e) =>{

        let select = e.target.id;
        
        if (select === "orderall"){
            setContent(<AllOrders></AllOrders>);
        }
        else if (select === "ordermy"){
            setContent(<MyOrders></MyOrders>);
        }
        else if (select === "orderadd"){
            setContent(<AddOrder></AddOrder>);
        }

    }

    return(

        <div>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"/>
            <h1>Orders</h1>
            <hr/>

            <button className="button" id="orderall" onClick={ChangeDisplay}>All Orders</button>
            <button className="button" id="ordermy" onClick={ChangeDisplay}>My Orders</button>
            <button className="button" id="orderadd" onClick={ChangeDisplay}>Add Order</button>

            {content}

        </div>

    )

}

export default Orders;