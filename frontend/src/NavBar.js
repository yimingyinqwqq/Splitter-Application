import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import MenuButton from "./Button"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Navbar.css'

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [mobile, setMobile] = useState(true);
  const [currTag, setCurrTag] = useState("");

  const handleClick = () => { setClick(!click); }

  const closeMobileMenu = (data) => { 
    setClick(false);

    if (data === currTag) {
      // scroll to the top of the page everytime we click a button on navbar
      window.scrollTo( {top: 0, behavior: 'smooth'} );
    } else {
      window.scrollTo(0, 0);
    }

    setCurrTag(data);
  }

  const showMobile = () => {
    if (window.innerWidth <= 960) {
      setMobile(false);
    } else {
      setMobile(true);
    }
  }

  useEffect(() => {
    showMobile();
  }, []);

  // show the mobile menu if the window is less than 960
  window.addEventListener('resize', showMobile);

  return (
    <>
      <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/js/all.min.js" crossOrigin="anonymous"></link>

      {/* <!-- Load font awesome icons --> */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"></link>

      {/* <!-- The social media icon bar --> */}
      {/* <div className="icon-bar">
        <a href="#" className="facebook"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="twitter"><i className="fab fa-twitter"></i></a>
        <a href="#" className="google"><i className="fab fa-google"></i></a>
        <a href="#" className="linkedin"><i className="fab fa-linkedin-in"></i></a>
        <a href="#" className="youtube"><i className="fab fa-youtube"></i></a>
        <a href="#" className="calculator"><i className="fas fa-calculator"></i></a>
        <a href="#" className="brain"><i className="fas fa-brain"></i></a>
      </div> */}
      </>

      <nav className="navbar">
        <div className="navbar-container">
          {/* <nav className="nav-wrapper red darken-3"> */}
          <Link to="/" className="navbar-logo" onClick={() => closeMobileMenu("home")}> 
            Team 
            {/* <i className='fab fa-typo3' /> */}
            <i className="fas fa-trademark fa-xs" ></i>
          </Link>

          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'} >
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={() => closeMobileMenu("home")}>
                Home
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/about' className='nav-links' onClick={() => closeMobileMenu("about")}>
                About
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/schedule' className='nav-links' onClick={() => closeMobileMenu("schedule")}>
                Schedule
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/courses' className='nav-links' onClick={() => closeMobileMenu("courses")}>
                Classmate
              </Link>
            </li>

            <li className='nav-item'>
              <Link to='/login' className='nav-links' onClick={() => closeMobileMenu("login")}>
                Login
              </Link>
            </li>
          </ul>

          {mobile && <MenuButton buttonStyle='grey' onClick={() => closeMobileMenu("signup")}> SIGN UP </MenuButton>}
          
        </div>
      </nav>
    </>
  );
}

export default Navbar;