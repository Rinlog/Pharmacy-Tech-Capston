import "./Home.css";
import { Link } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";

function Home() {
    const authState = CheckAuth();
    //console.log('Home component:', authState); //debugging

    return (
        <div className="home-container">
            {/* <header className="home-header">
                <h1>Welcome to the NBCC Pharmaceutical Tech System!</h1>
                </header> */}
            {/*commenting this out for now*/}
            <div className="home-content">
                <div className="button-grid">
                    <div className="button-with-image">
                        <Link to="/drugs" className="home-button">
                        Drugs
                        </Link>
                        <img src="/images/medipills.jpg" alt="pills" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                        <Link to="/physicians" className="home-button">
                        Physicians
                        </Link>
                        <img src="/images/phys.jpg" alt="Physicians" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                        <Link to="/patients" className="home-button">
                        Patients
                        </Link>
                        <img src="/images/patients.jpg" alt="patients" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                        <Link to="/orders" className="home-button">
                        Orders
                        </Link>
                        <img src="/images/orders.jpg" alt="orders" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                        <Link to="/verification" className="home-button">
                        Verification
                        </Link>
                        <img src="/images/verification.jpg" alt="verification" className="pictures-rounded"/>
                    </div>
                    {authState.loggedIn && authState.isAdmin && (
                        <>
                        <div className="button-with-image">
                        <Link to="/usermanagement" className="home-button">
                            User Management
                        </Link>
                        <img src="/images/usermanagement.jpg" alt="usermanagement" className="pictures-rounded"/>
                        </div>
                        <div className="button-with-image">
                        <Link to="/logs" className="home-button">
                            Logs
                        </Link>
                        <img src="/images/logs.jpg" alt="Logs" className="pictures-rounded"/>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;