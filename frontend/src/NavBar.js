import React, { } from 'react';
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button"

const NavBar = () => {
    const handleLogout = () => {
        //TODO: set a timeout to automatically display logout info
        sessionStorage.setItem("authenticated", "false");
    }

    return (
        <>
            <Navbar className='navbar-container' variant="dark" expand='lg'>
                <Container>
                    <Nav>
                        <Nav.Link as={Link} to="/dashboard" > Dashboard </Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/scan" > Scan </Nav.Link>
                    </Nav>
                    <Button onClick={handleLogout}> Logout </Button>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;


