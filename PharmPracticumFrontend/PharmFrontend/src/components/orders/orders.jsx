//react imports 
import {useState, useEffect} from 'react';

//mode imports
import AddOrder from '@components/orders/addorder.jsx';
import MyOrders from '@components/orders/myorders.jsx';
import AllOrders from '@components/orders/allorders.jsx';

function Orders() {

    const [mode, setMode] = useState(null);
    const [content, setContent] = useState(null);

    //change mode depending on content that should show
    const ChangeDisplay = (e) =>{

        let select = e.target.id;
        
        if (select === "orderall"){
            setMode("orderall");
        }
        else if (select === "ordermy"){
            setMode("ordermy");
        }
        else if (select === "orderadd"){
            setMode("orderadd");
        }

    }
    
    //renders on change to display selected content
    useEffect(() => {

        switch (mode){
            case null:
                setContent(null);
                break;
            case "orderall":
                setContent(<AllOrders></AllOrders>);
                break;
            case "orderadd":
                setContent(<AddOrder></AddOrder>);
                break;
            case "ordermy":
                setContent(<MyOrders></MyOrders>);
                break;
        }

    },[mode, setContent],);

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