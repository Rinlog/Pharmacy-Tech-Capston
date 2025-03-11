import { Link } from "react-router-dom";
import { CheckAuth } from "@components/login/CheckAuth";
import React from 'react'
import Homepageslide from './slide.jsx';
import { useState } from "react";
function Home() {
    const authState = CheckAuth();
    //console.log('Home component:', authState); //debugging
    const [Loaded,setLoaded] = useState(false)
    const loadingSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="e59qthQWJXs1" viewBox="0 0 1920 1080" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" project-id="48827d0584e448e09aaf5ea0a40cd5c2" export-id="401eec5ea37b4e3a81e63ec0c59192be" cached="false"><defs><linearGradient id="e59qthQWJXs4-fill" x1="0" y1="0.5" x2="1" y2="0.5" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)"><stop id="e59qthQWJXs4-fill-0" offset="0%" stop-color="rgba(255,255,255,0)"/><stop id="e59qthQWJXs4-fill-1" offset="90%" stop-color="#015872"/><stop id="e59qthQWJXs4-fill-2" offset="100%" stop-color="#015872"/></linearGradient><linearGradient id="e59qthQWJXs5-fill" x1="0.5" y1="0" x2="0.5" y2="1" spreadMethod="pad" gradientUnits="objectBoundingBox" gradientTransform="translate(0 0)"><stop id="e59qthQWJXs5-fill-0" offset="0%" stop-color="rgba(255,255,255,0)"/><stop id="e59qthQWJXs5-fill-1" offset="100%" stop-color="#010022"/></linearGradient></defs><g id="e59qthQWJXs2" transform="matrix(0.942769 0 0 1 54.941763 0)"><path d="M1130.35584,528.04c0-80.38524,68.74305-145.55036,153.5419-145.55036s153.5419,65.16512,153.5419,145.55036c0,4.02696-.17252,8.01572-.51092,11.96h-20.81854c.39993-3.93612.60449-7.92566.60449-11.96c0-68.78407-59.46417-124.54458-132.81693-124.54458s-132.81693,55.76051-132.81693,124.54458c0,3.28272.13544,6.53578.40137,9.75454h-20.78698c-.22505-3.22395-.33935-6.47659-.33935-9.75454h-.00001Z" transform="translate(-323.897737 11.558554)" fill="#015872" stroke-width="0"/><path d="M1303.18381,672.45322v-21.17213c60.84755-8.29995,108.32094-55.28426,113.12949-113.48655h20.78698c-4.86864,69.74695-61.56546,126.06358-133.91648,134.65868h.00001Z" transform="translate(-324.069337 13.077279)" fill="url(#e59qthQWJXs4-fill)" stroke-width="0"/></g></svg>
    )
    return (

        <div className="home-container">
            
            <Homepageslide />
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
                    {loadingSVG}
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