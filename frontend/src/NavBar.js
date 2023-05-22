import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const menuRef = useRef(null);                                      // reference of the mobile menu part

    // the navbar will show in mobile view if the width of the page decreases to certain amount of pixels
    const handleShowMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    }

    // when user click regions outside mobile menu, the menu will collapse
    const handleOutsideClick = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.classList.contains('navbar-mobile-item')) {
            setShowMobileMenu(false);
        }
    };

    // when user expand the webpage to have width greater than 1000px, the mobile menu will collapse
    const handleWindowResize = () => {
        if (window.innerWidth > 1000) {
            setShowMobileMenu(false);
        }
    };

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
                console.log(err);
            })

        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('resize', handleWindowResize);

        return () => {
            // clear up usage
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('resize', handleWindowResize);
        };

    }, []);

    const handleLogout = () => {
        //TODO: set a timeout to automatically display logout info
        sessionStorage.setItem("authenticated", "false");

        navigate('/login', { replace: true });
    }

    return (
        <>
            <Navbar className="navbar-container" variant="dark" expand='lg'>
                <Container className={`navbar-mobile-item ${showMobileMenu ? 'active' : ''}`}>
                    <Nav>
                        <Nav.Link as={Link} to="/dashboard" > Dashboard </Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/scan" > Scan </Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/history" > History </Nav.Link>
                    </Nav>

                    {/* TODO: change margintop */}
                    <p> Account: {userName} </p>
                    <Button onClick={handleLogout}> Logout </Button>
                </Container>
                <FontAwesomeIcon className="mobile-menu-icon" icon={showMobileMenu ? faTimes : faBars} onClick={handleShowMobileMenu} ref={menuRef} />
            </Navbar>
        </>
    );
}

export default NavBar;


