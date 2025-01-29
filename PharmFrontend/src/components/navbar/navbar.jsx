import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import "./Navbar.css";

function Navbar() {
  const authState = CheckAuth();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user', 'admin']);
  const location = useLocation(); // Get the current route

  const Logout = () => {
    let currentDate = new Date()
    let pastDate = currentDate - new Date(100000)
    let pastStringDate = new Date(pastDate) 

    setCookie("user",null,{expires: pastStringDate})
    setCookie("admin",null,{expires: pastStringDate})
    navigate("/login");
    //window.location.reload(); //commented this out testing to see if i need it still
  };

  // Check if the current path is the home page
  const isHomePage = location.pathname === "/home";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src="/images/logo-NBCC.png"
          alt="NBCC Logo"
          className="home-logo"
          style={{ height: "30px" }}
        />
      </div>

      <div className="navbar-menu" id="navbarMenu">
        <div className="navbar-links">
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
            <div className="logout-container">
            <div className="navbar-hometext">
                Welcome to the NBCC Pharmaceutical Tech System!
            </div>
            <button className="navbar-button" onClick={Logout}>
                Logout
            </button>
        </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
