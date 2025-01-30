
import { useEffect } from 'react';
import {useState} from 'react'
import { useCookies } from "react-cookie";
import { CheckAuth } from "@components/login/CheckAuth";
import * as React from 'react'
function ManageLoginStatus(){

    const authState = CheckAuth();

    let idleRef = React.useRef(0).current;

    const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);
    useEffect(function(){
        if (authState.loggedIn === true){
            const idleInterval = setInterval(timerIncrement, 1000);
            function timerIncrement() {
                idleRef += 1;
                //console.log(idleRef) debug code that shows how many seconds have passed
                if (idleRef > 119) { // 2 minute
                    // Do something here
                    clearInterval(idleInterval);
                    removeCookie("user")
                    removeCookie("admin")
                    alert("Logged out due to inactivity")
                }
            }

            function resetIdleRef() {
                idleRef = 0;
            }
            document.body.addEventListener('mousemove', resetIdleRef);
            document.body.addEventListener('keypress', resetIdleRef);

            //clears previous useeffect hook before starting the new one
            return () => {
                document.body.removeEventListener('mousemove', resetIdleRef);
                document.body.removeEventListener('keypress', resetIdleRef);
                clearInterval(idleInterval);
            };
        }
    },[authState.loggedIn])

    return null;
    
}


export default ManageLoginStatus