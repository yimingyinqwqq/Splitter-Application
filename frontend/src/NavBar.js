import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button"

import FileUploader from "./FileUploader";
import Group from './Group';

const NavBar = () => {
    const [isDashBoard, setIsDashBoard] = useState(true);

    const handleClick = (elementName) => {
        //TODO: not work as intended, check conditionally rendering
        if (elementName === "dashboard") {
            setIsDashBoard(true);
        } else {
            setIsDashBoard(false);
        }
    }

    const handleLogout = () => {
        //TODO: set a timeout to automatically display logout info
        sessionStorage.setItem("authenticated", "false");
    }

    return (
        <>
            <Navbar className='navbar-container' variant="dark" expand='lg'>
                <Container>
                    <Nav>
                        <Nav.Link onClick={() => handleClick("dashboard")}> Dashboard </Nav.Link>
                        <Nav.Link onClick={() => handleClick("scan")}> Scan </Nav.Link>
                    </Nav>
                    <Button onClick={handleLogout}> Logout </Button>
                </Container>
            </Navbar>

            {isDashBoard ?
                (
                    <>
                        <p className='scanning-section-text'> Welcome to your Dashboard </p>
                        <Group />
                    </>
                ) : (
                    <>
                        <p className='scanning-section-text'> Scanning receipt </p>
                        <FileUploader />
                    </>
                )
            }

        </>
    );
}

export default NavBar;


