import "./Home.css";
import { Link } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import React from 'react'
import IndividualIntervalsExample from './slide.jsx';

function Home() {
    const authState = CheckAuth();
    //console.log('Home component:', authState); //debugging
    
    return (

        <div className="home-container">
            
            <IndividualIntervalsExample />
            <div className="home-content">
                <div className="button-grid">
                    <div className="button-with-image">
                    <img src="/images/medipills.jpg" alt="pills" className="pictures-rounded"/>
                        <Link to="/drugs" className="home-button">
                        Drugs
                        </Link>
                    </div>
                    <div className="button-with-image">
                        <Link to="/physicians" className="home-button">
                        Physicians
                        </Link>
                        <img src="/images/phys.jpg" alt="Physicians" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                    <img src="/images/patients.jpg" alt="patients" className="pictures-rounded"/>
                        <Link to="/patients" className="home-button">
                        Patients
                        </Link>
                    </div>
                    <div className="button-with-image">
                        <Link to="/orders" className="home-button">
                        Orders
                        </Link>
                        <img src="/images/orders.jpg" alt="orders" className="pictures-rounded"/>
                    </div>
                    <div className="button-with-image">
                    <img src="/images/verification.jpg" alt="verification" className="pictures-rounded"/>
                        <Link to="/verification" className="home-button">
                        Verification
                        </Link>
                    </div>
                    <div></div>
                    
                    {authState.loggedIn && authState.isAdmin && (
                        <>
                            <hr className="admin-separator" />
                            <div className="button-with-image">
                            <img src="/images/usermanagement.jpg" alt="usermanagement" className="pictures-rounded"/>
                            <Link to="/usermanagement" className="home-button">
                                User Management
                            </Link>
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