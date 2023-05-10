import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const [userName, setUserName] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // the navbar will show in mobile view if the width of the page decreases to certain amount of pixels
    const handleShowMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    }

    useEffect(() => {
        // fetch from the backend the User Name
        fetch('/home', {
            method: 'GET',
            mode: 'cors',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json();
            })
            .then(data => {
                console.log("name is: ", data);
                setUserName(data['email']);
            })
            .catch(err => {
                console.log(err)
            })


    }, []);

    const handleLogout = () => {
        //TODO: set a timeout to automatically display logout info
        sessionStorage.setItem("authenticated", "false");
    }

    return (
        <>
            <Navbar className="navbar-container" variant="dark" expand='lg'>
                <Container className={`navbar-mobile-item ${showMobileMenu && 'active'}`}>
                    <Nav>
                        <Nav.Link as={Link} to="/dashboard" > Dashboard </Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/scan" > Scan </Nav.Link>
                    </Nav>

                    {/* TODO: change margintop */}
                    <p> Account: {userName} </p>
                    <Button onClick={handleLogout}> Logout </Button>
                </Container>
                <FontAwesomeIcon className="mobile-menu-icon" icon={showMobileMenu ? faTimes : faBars} onClick={handleShowMobileMenu} />
            </Navbar>
        </>
    );
}

export default NavBar;


