import { Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { CheckAuth } from '@components/login/CheckAuth';


function Navbar() {

    const authState = CheckAuth();

    const navigate = useNavigate();

    const cookies = new Cookies();

    const toggleNavbar = () => {
        const navbarMenu = document.getElementById('navbarMenu');
        navbarMenu.classList.toggle('hide');
    };

    const Logout = () => {

        cookies.remove('user');
        cookies.remove('admin');
        navigate("/login");

    }

    return(

        <nav className="navbar-class" id="navbar">

            <div className="navbar-brand">
                <Link to="/" className="navbar-item">NBCC Pharm Tech System</Link>
                <button className="navbar-toggler" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon">&#9776;</span>
                </button>
            </div>

            <div className="navbar-menu" id="navbarMenu">

                <div className="navbar-end">
                    { authState.loggedIn && (
                        <>
                            <Link to="/home" className="navbar-item">Home</Link> &nbsp;
                            <Link to="/drugs" className="navbar-item">Drugs</Link> &nbsp;
                            <Link to="/physicians" className="navbar-item">Physicians</Link> &nbsp;
                            <Link to="/patients" className="navbar-item">Patients</Link> &nbsp;
                            <Link to="/orders" className="navbar-item">Orders</Link> &nbsp;
                            <Link to="/verification" className="navbar-item">Verification</Link> &nbsp;
                        
                        { authState.loggedIn && authState.isAdmin && (
                            <>
                            <Link to="/usermanagement" className="navbar-item">User Management</Link> &nbsp;
                            <Link to="/logs" className="navbar-item">Logs</Link>
                            </>
                        )}
                        <button className="navbar-button" onClick={Logout}>Logout</button>
                        </>
                    )}
                </div>

            </div>

        </nav>

    )

    
}

export default Navbar;