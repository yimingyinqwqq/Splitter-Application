import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from "react-bootstrap/Button"

const NavBar = () => {
    const [userName, setUserName] = useState("");

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
            <Navbar className='navbar-container' variant="dark" expand='lg'>
                <Container>
                    <Nav>
                        <Nav.Link as={Link} to="/dashboard" > Dashboard </Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/scan" > Scan </Nav.Link>
                    </Nav>
                    {/* TODO: change margintop */}
                    <p style={{ marginLeft: "40rem", marginTop: "1rem", color: "#fff" }}> Account: {userName} </p>
                    <Button onClick={handleLogout}> Logout </Button>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;


