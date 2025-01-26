//react imports 
import {useState, useEffect} from 'react';
import React from "react";
//mode imports
import AddOrder from '@components/orders/addorder.jsx';
import MyOrders from '@components/orders/myorders.jsx';
import AllOrders from '@components/orders/allorders.jsx';

function Orders() {

    const [content, setContent] = useState(null);

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