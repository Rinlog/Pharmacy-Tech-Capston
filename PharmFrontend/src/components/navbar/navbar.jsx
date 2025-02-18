import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import AuthContext from '@components/login/AuthContext.jsx';
import { useContext } from 'react';
import "./Navbar.css";

function Navbar() {
  const authState = CheckAuth();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);
  const location = useLocation(); // Get the current route
  const Logout = () => {
    logout(); //uses authcontext logout function
    navigate("/login");
    //window.location.reload(); //commented this out testing to see if i need it still
  };

  // Check if the current path is the home page
  const isHomePage = location.pathname === "/home";
  const NavContent = (<div className="flex-fill">
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
          <button className="navbar-button" onClick={Logout}>
          Logout
        </button>
        </>
      )}
      {authState.loggedIn && isHomePage && (
        <div className="d-flex align-items-center justify-content-right flex-fill">
          <div className="d-flex navbar-hometext justify-content-center flex-fill">
            Welcome to the NBCC Pharmaceutical Tech System!
          </div>
          <div className="logout-container align-self-right pl-5">
            <button className="navbar-button" onClick={Logout}>
                Logout
            </button>
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
      </div>) || authState.loggedIn && !isHomePage && (<div className="navbar-links">
        {NavContent}
      </div>)}
      </div>
    </nav>
  );
}

export default Navbar;
