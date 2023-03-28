// reference from https://www.makeuseof.com/redirect-user-after-login-react/
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import NavBar from "./NavBar";

const Dashboard = () => {
    const authenticated = useRef(false);
    authenticated.current = (sessionStorage.getItem("authenticated") === "true");

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem("authenticated");
        console.log("useeffect");

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
            <div >
                <NavBar/>
            </div>
        );
    }
};

export default Dashboard;