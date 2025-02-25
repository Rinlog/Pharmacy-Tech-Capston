import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import AuthContext from '@components/login/AuthContext.jsx';
import { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import { useState, useEffect } from "react";
import timeSince from "./TimeSince";
import $ from 'jquery';
import "./Navbar.css";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function Navbar() {
  const authState = CheckAuth();
  const { logout } = useContext(AuthContext);

  //notification info
  const [NotificationData, setNotificationData] = useState();
  const [NotificationContent, setNotificationContent] = useState([]);
  const [NotificationsFetched, setNotificationsFetched] = useState(false);
  const [NotificationUnread, setNotificationUnread] = useState(false);
  //misc
  const [FetchedData, setFetchedData] = useState(false);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({});
  let [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);
  const location = useLocation() // Get the current route
  const [oldLocation, setOldLocation] = useState('');

  const Logout = () => {
    logout(); //uses authcontext logout function
    navigate("/login");
    //window.location.reload(); //commented this out testing to see if i need it still
  };

  //adding event listners so when bell icon is clicked the unread circle will disappear if it was there
  $(document).ready(function(){
    let Buttons = $(".NotificationBell")
    for (let i = 0; i < Buttons.length; i++){
        Buttons[i].addEventListener("click",setNotificationsSeen)
    }
  })
  function setNotificationsSeen(){
    if (NotificationData != undefined){
      NotificationData.forEach(async function(Notification){
        if (Notification.seen == false){
          let result = await $.ajax({
            url:"https://"+BackendIP+":"+BackendPort+"/api/User/updateUserNotificationStatus",
            method:"POST",
            data:JSON.stringify(Notification.notificationID + "~!~" + true),
            headers:{
              'Content-Type': 'application/json',
              'Key-Auth':ApiAccess
            }
          })
        }
        setNotificationUnread(false);
      })
    }
  }

  //will update notifications when we change page location
  useEffect(function(){
    setOldLocation(location);//will not update until this use effect goes through meaning we will have the old location still
    if((location.pathname != oldLocation.pathname) && (oldLocation.pathname !== undefined && oldLocation.pathname !== '')){
      setNotificationContent([]);
      //setting a small timeout to help ensure the notification content is empty before we re-populate it
  
      GetNotifications(0); //0 means starting from offset 0 (row 1)
  
      $(".LoadMoreButton").attr("offset",5);
    }
  },[location])
  
  //used for when the load more button is clicked
  function NotificationButtonClicked(e){
    let button = e.target;
    let Offset = $(button).attr("offset").valueOf()
    GetNotifications(Offset);
    $(button).attr("offset",Number(Offset)+5);

  }
  async function GetNotifications(NotificationOffset){
    setNotificationsFetched(false);
    let result = await $.ajax({
      url:"https://"+BackendIP+":"+BackendPort+"/api/User/getUserNotifications",
      method:"POST",
      data:JSON.stringify(cookies.user + "~!~" + NotificationOffset),
      headers:{
        'Content-Type': 'application/json',
        'Key-Auth':ApiAccess
      }
    })
    setNotificationData(result);

    setTimeout(function(){
      setNotificationsFetched(true);
    },10)
  }
  async function GetUserInfo(){
    let result = await $.ajax({
      url:"https://"+BackendIP+":"+BackendPort+"/api/User/getUserByID",
      method:"POST",
      data:JSON.stringify(cookies.user),
      headers:{
        'Content-Type': 'application/json',
        'Key-Auth':ApiAccess
      }
    })
    setUserInfo(result);
    setFetchedData(true);
    
  }
  useEffect(function(){
          if (NotificationData != undefined && NotificationData != null && NotificationData != ''){
            //if you have a notification it will show the orange circle indicating you do
            NotificationData.forEach(function(Notification){
              if (Notification.seen == false && NotificationContent.length >= 5){ //this means i loaded more in and they were also not seen
                setNotificationsSeen();
              }
              else if (Notification.seen == false){ //this is for when the page first loads
                setNotificationUnread(true);
              }
              
            })
            //loads the notifications when the data changes, this will append to already loaded notifications
            NotificationData.forEach(function(Notification){
                  //section for distinguishing hrefs
                  let NotificationHref = "";
                  if (Notification.nMessage.toLowerCase().includes("click to start amending the order")){
                    NotificationHref="/orders/myOrders"
                  }

                  //converting into easy to read time
                  let TimeSince = timeSince(new Date(Notification.dateAdded))

                  NotificationContent.push(
                      <span key={Notification.notificationID}>
                        {Notification.seen == true ?(
                          <span>
                            <Dropdown.Item key={Notification.notificationID} href={NotificationHref} className="p-3 d-flex flex-column">
                              <label className="text-wrap ProfileText">{Notification.nMessage}</label>
                              <div className="align-self-end pt-2">
                                <small>Sent {TimeSince} ago</small>
                              </div>
                            </Dropdown.Item> 
                          </span>  
                          ):(
                            <span className="UnseenNotification">
                              <Dropdown.Item key={Notification.notificationID} href={NotificationHref} className="p-3 d-flex flex-column">
                                <label className="text-wrap ProfileText">{Notification.nMessage}</label>
                                <div className="align-self-end pt-2">
                                  <small>Sent {TimeSince} ago</small>
                                </div>
                              </Dropdown.Item>
                            </span>
                        )}
                        <Dropdown.Divider></Dropdown.Divider>
                      </span>
                      
                  )
              })
          }
  },[NotificationData])

  //load user info on page load
  useEffect( function(){
          const Interval = setInterval(function(){
              if (FetchedData == false){
                if (cookies.user != undefined && cookies.user != ''){
                  GetUserInfo();
                  //basically if the old path is undefined they refreshed
                  if (oldLocation.pathname == undefined){
                    GetNotifications(0);
                  }
                }
              }
              else{
                  clearInterval(Interval);
              }
          },200)
          return (
              function(){
                  clearInterval(Interval);
              }
          )
      },[FetchedData,cookies]) 
      //cookies is a dependency because when you first login after first accessing 
      //the website, the cookies need to re-render as they don't load in time

  // Check if the current path is the home page
  const isHomePage = location.pathname === "/home";
  const NavContent = (<div className="flex-fill d-flex align-items-center">
        {!isHomePage && authState.loggedIn && (
        <>
        <Link to="/home" className="navbar-item">
            Home
          </Link>
          <Link to="/drugs" className="navbar-item">
            Drugs
          </Link>
          <Link to="/physicians" className="navbar-item">
            Physicians
          </Link>
          <Link to="/patients" className="navbar-item">
            Patients
          </Link>
          <Link to="/orders" className="navbar-item">
            Orders
          </Link>
          <Link to="/verification" className="navbar-item">
            Verification
          </Link>

          {authState.loggedIn && authState.isAdmin && (
            <>
              <Link to="/usermanagement" className="navbar-item">
                User Management
              </Link>
              <Link to="/logs" className="navbar-item">
                Logs
              </Link>
            </>
          )}
          {/*Notification Area */}
          <Dropdown className="pl-3">
            <Dropdown.Toggle className='HideButtonCSS NotificationBell'>
              <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" preserveAspectRatio="xMidYMid meet" focusable="false">
                <path fill="none" d="M25.532 23.71c-1.71-1.71-2.53-3.47-2.53-8.71 0-5.31-3.432-9-8.003-9s-8.004 3.69-8.004 9c0 5.24-.82 7-2.53 8.71-.11.1-.19.2-.25.29H25.78c-.058-.09-.138-.19-.248-.29z"></path>
                <path d="M9.34 20.974c.263.087.546-.054.634-.316.3-.903.36-1.605.36-3.195 0-3.065.418-4.508 2.52-6.61.195-.194.195-.51 0-.706-.195-.195-.512-.195-.707 0-2.323 2.323-2.814 4.01-2.814 7.317 0 1.484-.052 2.11-.308 2.88-.088.26.054.543.316.63z"></path>
                <path  d="M26.942 22.29c-1.29-1.29-1.94-2.53-1.94-7.29 0-4.32-1.96-7.83-5-9.64V4C20 1.8 18.2 0 16 0h-2c-2.2 0-4 1.8-4 4v1.36C6.957 7.17 4.997 10.68 4.997 15c0 4.76-.65 6-1.94 7.29-1.51 1.51-1.51 3.71.7 3.71h6.34c.46 2.28 2.482 4 4.902 4s4.44-1.72 4.9-4h6.34c2.21 0 2.21-2.2.7-3.71zM12 4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v.46c-.94-.3-1.95-.46-3-.46s-2.06.16-3 .46V4zm3 24c-1.3 0-2.41-.84-2.82-2h5.64c-.41 1.16-1.52 2-2.82 2zM4.218 24c.06-.09.14-.19.25-.29 1.71-1.71 2.53-3.47 2.53-8.71 0-5.31 3.43-9 8.002-9s8.002 3.69 8.002 9c0 5.24.82 7 2.53 8.71.11.1.19.2.25.29H4.22z"></path>
                <circle className={NotificationUnread ? "" : "hide"} fill="orange" r="6" cx={23} cy={7}></circle>
              </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu className="Notifications text-break">
              {NotificationsFetched && NotificationContent}
              <button offset="5" onClick={NotificationButtonClicked} className="LoadMoreButton">Load More</button>
            </Dropdown.Menu>
          </Dropdown>
          {/*User Info Section */}
          <Dropdown>
            <Dropdown.Toggle className='HideButtonCSS'>
              <span>
                <svg height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60.671 60.671" xmlSpace="preserve" fill="#000000" className="UserIcon">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                  <g id="SVGRepo_iconCarrier"> <g> <g> <ellipse style={{fill:"#010002"}} cx="30.336" cy="12.097" rx="11.997" ry="12.097"/> <path style={{fill:"#010002"}} d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9 C48.354,35.818,42.661,30.079,35.64,30.079z"/> </g> </g> </g>
                </svg>
                <label className="ProfileText">{UserInfo.fName + ", " + UserInfo.lName}</label>
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={Logout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
      {authState.loggedIn && isHomePage && (
        <div className="d-flex align-items-center justify-content-right flex-fill">
          <div className="d-flex navbar-hometext justify-content-center flex-fill">
            Welcome to the NBCC Pharmaceutical Tech System!
          </div>
          <div className="logout-container align-self-right pl-5">
            {/*Notification Area */}
            <Dropdown>
              <Dropdown.Toggle className='HideButtonCSS NotificationBell' >
                <svg height="30px" width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" preserveAspectRatio="xMidYMid meet" focusable="false">
                  <path fill="none" d="M25.532 23.71c-1.71-1.71-2.53-3.47-2.53-8.71 0-5.31-3.432-9-8.003-9s-8.004 3.69-8.004 9c0 5.24-.82 7-2.53 8.71-.11.1-.19.2-.25.29H25.78c-.058-.09-.138-.19-.248-.29z"></path>
                  <path d="M9.34 20.974c.263.087.546-.054.634-.316.3-.903.36-1.605.36-3.195 0-3.065.418-4.508 2.52-6.61.195-.194.195-.51 0-.706-.195-.195-.512-.195-.707 0-2.323 2.323-2.814 4.01-2.814 7.317 0 1.484-.052 2.11-.308 2.88-.088.26.054.543.316.63z"></path>
                  <path  d="M26.942 22.29c-1.29-1.29-1.94-2.53-1.94-7.29 0-4.32-1.96-7.83-5-9.64V4C20 1.8 18.2 0 16 0h-2c-2.2 0-4 1.8-4 4v1.36C6.957 7.17 4.997 10.68 4.997 15c0 4.76-.65 6-1.94 7.29-1.51 1.51-1.51 3.71.7 3.71h6.34c.46 2.28 2.482 4 4.902 4s4.44-1.72 4.9-4h6.34c2.21 0 2.21-2.2.7-3.71zM12 4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v.46c-.94-.3-1.95-.46-3-.46s-2.06.16-3 .46V4zm3 24c-1.3 0-2.41-.84-2.82-2h5.64c-.41 1.16-1.52 2-2.82 2zM4.218 24c.06-.09.14-.19.25-.29 1.71-1.71 2.53-3.47 2.53-8.71 0-5.31 3.43-9 8.002-9s8.002 3.69 8.002 9c0 5.24.82 7 2.53 8.71.11.1.19.2.25.29H4.22z"></path>
                  <circle className={NotificationUnread ? "" : "hide"} fill="orange" r="6" cx={23} cy={7}></circle>
                </svg>
              </Dropdown.Toggle>
              <Dropdown.Menu className="Notifications">
                {NotificationsFetched && NotificationContent}
                <button offset="5" onClick={NotificationButtonClicked} className="LoadMoreButton">Load More</button>
              </Dropdown.Menu>
            </Dropdown>
            {/*User Info section */}
            <Dropdown>
              <Dropdown.Toggle className='HideButtonCSS'>
                <span>
                  <svg height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60.671 60.671" xmlSpace="preserve" fill="#000000" className="UserIcon">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                    <g id="SVGRepo_iconCarrier"> <g> <g> <ellipse style={{fill:"#010002"}} cx="30.336" cy="12.097" rx="11.997" ry="12.097"/> <path style={{fill:"#010002"}} d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9 C48.354,35.818,42.661,30.079,35.64,30.079z"/> </g> </g> </g>
                  </svg>
                  <label className="ProfileText">{UserInfo.fName + ", " + UserInfo.lName}</label>
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={Logout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      )}
  </div>)
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home">
        <img
          src="/images/logo-NBCC.png"
          alt="NBCC Logo"
          className="home-logo"
          style={{ height: "30px" }}
        />
        </Link>
      </div>

      <div className="navbar-menu" id="navbarMenu">
      {authState.loggedIn && isHomePage && (<div className="navbar-links flex-fill">
        {NavContent}
      </div>) || authState.loggedIn && !isHomePage && (<div className="navbar-links d-flex">
        {NavContent}
      </div>)}
      </div>
    </nav>
  );
}

export default Navbar;
