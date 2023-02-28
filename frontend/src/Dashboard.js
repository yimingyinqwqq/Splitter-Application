// reference from https://www.makeuseof.com/redirect-user-after-login-react/
import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
    const authenticated = useRef(false);
    authenticated.current = (sessionStorage.getItem("authenticated") === "true");

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("authenticated");

        if (loggedInUser === true) {
            authenticated.current = true;
        }
        
    }, []);
    

    // render page according to value of "authenticated"
    if (!authenticated.current) {
        console.log(authenticated);
        return <Navigate replace to="/login" />;
    } else {
        return (
            <div>
                <p> Welcome to your Dashboard </p>
            </div>
        );
    }
};

export default Dashboard;