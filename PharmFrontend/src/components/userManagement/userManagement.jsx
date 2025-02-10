//page imports
import EditUser from "@components/userManagement/edituser.jsx";
import AddUsers from "@components/userManagement/addusers.jsx";

//react imports
import { useState, useEffect } from "react";

//jquery
import $ from 'jquery';
function UserManagement() {

    //states that manage what is shown
    const [display, setDisplay] = useState("main");

    const [content, setContent] = useState(null);

    //changes should be shown
    const ChangeDisplay = (e) =>{

        let select = e.target.id;
        
        if (select === "userAdd"){
            $("#userAdd").addClass("selected");
            $("#userEdit").removeClass("selected");
            setDisplay("userAdd");
        }
        if (select === "userEdit"){
            $("#userAdd").removeClass("selected");
            $("#userEdit").addClass("selected");
            setDisplay("userEdit");
        }

    }

    //renders on change to display selected content
    useEffect(() => {

        switch (display){
            case "main":
                setContent(null);
                break;
            case "userAdd":
                setContent(<AddUsers></AddUsers>)
                break;
            case "userEdit":
                setContent(<EditUser></EditUser>)
                break;
        }

    },[display, setContent],);

    return(

        <div>
            <div className='page-header-name'>User Management</div>
            <hr/>
            <br></br>

            <button id="userAdd" className="button" onClick={ChangeDisplay}>Bulk Add</button>
            <button id="userEdit" className="button" onClick={ChangeDisplay}>Edit/Delete</button>

            {content}

        </div>

    )

}

export default UserManagement;