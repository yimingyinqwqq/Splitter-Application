import React, { useState } from 'react'

const Login = () => {
    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = name;
        const password = pwd;
        const loginErrorMsg = document.getElementById("login-error-msg");

        if (username === "123" && password === "123") {
            alert("You have successfully logged in.");
            window.location.reload();
        } else {
            loginErrorMsg.style.opacity = 1;
        }
    }


    return (
    <main id="main-holder">
        
        <h1 id="login-header"> Login </h1>

        <div id="login-error-msg-holder">
          <p id="login-error-msg"> Invalid username <span id="error-msg-second-line"> and/or password </span></p>
        </div>

        <form id="login-form" onSubmit={handleSubmit}>
          <input type="text" name="username" id="username-field" class="login-form-field" placeholder="Username" 
            onChange = {(e) => setName(e.target.value)} value = {name}/>

          <input type="password" name="password" id="password-field" class="login-form-field" placeholder="Password"
            onChange = {(e) => setPwd(e.target.value)} value = {pwd}/>

          {/* <input type="submit" value="Login" id="login-submit"/> */}
          <button type="submit">Login</button>
        </form>
        
    </main>
    )
}

export default Login;
