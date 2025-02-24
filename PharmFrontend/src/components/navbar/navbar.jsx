import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import AuthContext from '@components/login/AuthContext.jsx';
import { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import { useState, useEffect } from "react";

import $ from 'jquery';
import "./Navbar.css";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function Navbar() {
  const authState = CheckAuth();
  const { logout } = useContext(AuthContext);
  const [FetchedData, setFetchedData] = useState(false);
  const navigate = useNavigate();
  const [UserInfo, setUserInfo] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);
  const location = useLocation(); // Get the current route

  const Logout = () => {
    logout(); //uses authcontext logout function
    navigate("/login");
    //window.location.reload(); //commented this out testing to see if i need it still
  };
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
  //load user info on page load
  useEffect( function(){
          const Interval = setInterval(function(){
              if (FetchedData == false){
                  GetUserInfo()
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
      },[FetchedData])

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
          <Dropdown className="pl-2">
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
