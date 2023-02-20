// import React, { Component } from 'react';
// import Navbar from './components/Navbar'
// import Navbar from './NavBar'
// import { Route, BrowserRouter, Routes } from 'react-router-dom'
// import Home from './components/Home'
// import About from './components/About'
// import Schedule from './components/Schedule'

// import LoginPage from './components/LoginPage.tsx';
// import AuthenticationPage from './components/pages/AuthenticationPage.tsx'
// import RegisterPage from './components/pages/RegisterPage.tsx'
// import NotFoundPage from './components/pages/NotFound.tsx'

// /* "npm start" in "package.json" changed according to https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported */

// import "./App.css"

// class App extends Component {
//   render() {
//     return (
//       <div className='background'>
//       <BrowserRouter>
//         <div className="App">
          
//         </div>
//       </BrowserRouter>
//       </div>
//     );
//   }
// }

// export default App;

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

// When the login button is clicked, the following code is executed
if(loginButton){
  loginButton.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();
    // Get the values input by the user in the form fields
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "user" && password === "web_dev") {
        // If the credentials are valid, show an alert box and reload the page
        alert("You have successfully logged in.");
        window.location.reload();
    } else {
        // Otherwise, make the login error message show (change its oppacity)
        loginErrorMsg.style.opacity = 1;
    }
})
}
