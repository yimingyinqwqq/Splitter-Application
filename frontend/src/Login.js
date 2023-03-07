// followed a simple tutorial https://medium.com/swlh/how-to-create-your-first-login-page-with-html-css-and-javascript-602dd71144f1
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');
    // const [authenticated, setauthenticated] = useState(
    //     JSON.parse(localStorage.getItem("authenticated")) || false
    // );

    const state = {
        button: 1
    };

    // handle the onclick event for the Submit button
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // user-password login
        if (state.button === 1) {
            const username = name;
            const password = pwd;
            const loginErrorMsg = document.getElementById("login-error-msg");

            // only for testing purposes
            if (username === "123" && password === "123") {
                alert("You have successfully logged in.");
                
                // set sessionStorage for authenticating purposes
                sessionStorage.setItem("authenticated", true);
                navigate('/dashboard', { replace: true });
            } else {
                loginErrorMsg.style.opacity = 1;
            }
        } 

        // google login
        else if (state.button === 2) {
            window.location.replace("https://127.0.0.1:5000/login")

            // TODO: finish google login redirection
        }
    }


    return (
        <main id="main-holder">

            <h1 id="login-header"> Login </h1>

            {/* show error messages */}
            <div id="login-error-msg-holder">
                <p id="login-error-msg"> Invalid username <span id="error-msg-second-line"> and/or password </span></p>
            </div>

            {/* form for authentication/login purposes */}
            <form id="login-form" onSubmit={handleSubmit}>
                <input type="text" name="username" id="username-field" className="login-form-field" placeholder="Username" 
                    onChange = {(e) => setName(e.target.value)} value = {name}/>

                <input type="password" name="password" id="password-field" className="login-form-field" placeholder="Password"
                    onChange = {(e) => setPwd(e.target.value)} value = {pwd}/>

                <button onClick={() => (state.button = 1)} type="submit" name="btn1" value="btn1"> Login </button>
                <button onClick={() => (state.button = 2)} type="submit" name="btn2" value="btn2"> Google Login </button>
            </form>
            
        </main>
    )
}

export default Login;
