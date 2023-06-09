// followed a simple tutorial https://medium.com/swlh/how-to-create-your-firhandleSubmitst-login-page-with-html-css-and-javascript-602dd71144f1
// and https://react-bootstrap.github.io/forms/validation
// and https://github.com/dmalvia/React_Forms_Tutorials/blob/use-native/src/App.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup, Col, Modal } from 'react-bootstrap';

import GoogleButton from 'react-google-button'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const initialValues = { username: "", email: "", password: "", passwordRep: "" };
    const [logFormValues, setLogFormValues] = useState(initialValues);                  // login form values
    const [logFormErrors, setLogFormErrors] = useState({});                             // login form errors
    const [regFormValues, setRegFormValues] = useState(initialValues);                  // registration form values
    const [regFormErrors, setRegFormErrors] = useState({});                             // registration form errors

    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isRegisterValidated, setIsRegisterValidated] = useState(false);
    const [isTouched, setIsTouched] = useState(false);                                  // true if the registration form has been modified
    // const [authenticated, setauthenticated] = useState(
    //     JSON.parse(localStorage.getItem("authenticated")) || false
    // );
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [isLoginSuccessModal, setIsLoginSuccessModal] = useState(false);
    const [isLoginFailedModal, setIsLoginFailedModal] = useState(false);
    const [loginFailedMsg, setLoginFailedMsg] = useState("");

    const state = {
        button: 1
    };

    useEffect(() => {
        console.log(regFormErrors);
    }, [regFormErrors]);

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }

    }, [user]);

    useEffect(() => {
        if (profile) {
            fetch('/googleLogin', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: profile.name, email: profile.email, picture: profile.picture })
            })
                .then(response => {
                    if (response.status === 200) {
                        setIsLoginSuccessModal(true);

                        // set sessionStorage for authenticating purposes
                        sessionStorage.setItem("authenticated", true);
                        navigate('/dashboard', { replace: true });
                    } else {
                        return response.json().then(data => {
                            setIsLoginFailedModal(true);
                            alert(data['error']);
                        })
                    }
                })
                .catch(err => {
                    alert(err)
                })
        }
    }, [profile]);

    // function to revoke goole api for google login
    const handlegooglelogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    // switch between login form and registration form
    const handleToggle = (e) => {
        e.preventDefault();
        setIsLoginForm(!isLoginForm);

        // clear all data stored in login/registration form during toggle
        setLogFormValues(initialValues);
        setLogFormErrors({});
        setRegFormValues(initialValues);
        setRegFormErrors({});
        setIsTouched(false);
    }

    // handle the onchange event when filling out the login form
    const handleLogFormChange = (e) => {
        const { name, value } = e.target;
        setLogFormValues({ ...logFormValues, [name]: value });
    }

    // handle the onchange event when filling out the registration form
    const handleRegFormChange = (e) => {
        const { name, value } = e.target;
        setRegFormValues({ ...regFormValues, [name]: value });
    }

    // handle the onclick event for login
    const handleLogin = (e) => {
        // user-password login
        if (state.button === 1) {
            e.preventDefault();

            const formErrors = loginFormValidate(logFormValues);
            setLogFormErrors(formErrors);

            // // only for testing purposes
            // if (logFormValues.username === "123" && logFormValues.password === "123") {
            //     alert("You have successfully logged in.");

            //     // set sessionStorage for authenticating purposes
            //     sessionStorage.setItem("authenticated", true);
            //     navigate('/dashboard', { replace: true });
            // }

            fetch('/localLogin', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                //TODO: change usernmae 
                body: JSON.stringify({ email: logFormValues.username, password: logFormValues.password })
            })
                .then(response => {
                    if (response.status === 200) {
                        setIsLoginSuccessModal(true);

                        // set sessionStorage for authenticating purposes
                        sessionStorage.setItem("authenticated", true);
                    } else {
                        return response.json().then(data => {
                            setIsLoginFailedModal(true);
                            setLoginFailedMsg(data['error']);
                        })
                    }
                })
                .catch(err => {
                    alert(err)
                })
        }

        // google login
        else if (state.button === 2) {
            handlegooglelogin();
        }
    }

    // handle the onclick event for register
    const handleRegister = (e) => {
        e.preventDefault();

        const formErrors = registerFormValidate(regFormValues);
        setRegFormErrors(formErrors);
        setIsTouched(true);

        // check if formError is empty
        if (JSON.stringify(formErrors) === "{}") {
            // console.log(JSON.stringify(formErrors));
            alert("successful");
            setIsRegisterValidated(true);

            //TODO: Currently only allow using email to login, add username later
            fetch('/localRegister', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: regFormValues.username, email: regFormValues.email, password: regFormValues.password })
            })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                })
                .catch(err => {
                    alert(err)
                })

        } else {
            alert("unsuccessful");
            e.stopPropagation();
        }
    }

    // validate the login form with backend
    const loginFormValidate = (values) => {
        const errors = {};

        if (!values.username) {
            errors.username = "Username/Email is required!";
        } else if (false) {
            //TODO:
            errors.username = "Username/Email does not exist!";
        }

        if (!values.password) {
            errors.password = "Password is required!";
        } else if (false) {
            //TODO:
            errors.password = "Incorrect password!";
        }

        return errors;
    }

    // validate the registration form
    const registerFormValidate = (values) => {
        // TODO: move everything here to backend and use requests for verifying
        const errors = {};

        if (!values.username) {
            errors.username = "Username is required!";
        }

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i)) {
            errors.email = "This is not a valid email format!";
        }

        if (!values.password) {
            errors.password = "Password is required!";
        } else if (!values.password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.+)/)) {
            errors.password = "Password must contain at least one letter, number, and special character!";
        } else if (!values.password.match(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)) {
            errors.password = "Password must contain at least one special character!";
        } else if (values.password.length < 8 || values.password.length > 15) {
            errors.password = "Password must has length 8-15!";
        }

        if (!values.passwordRep) {
            errors.passwordRep = "Password confirmation is required!";
        } else if (values.passwordRep !== values.password) {
            errors.passwordRep = "Passwords do not match!";
        }

        return errors;
    }


    return (
        <main id="main-holder">
            {/* show login form */}
            {isLoginForm &&
                <div className="login-holder" align="center">
                    <div id="login-register-toggle">
                        <span style={{ marginLeft: "35%" }}> </span>
                        <h1> Login </h1>
                        <Button className="rounded-pill" style={{ marginLeft: "50%" }} onClick={handleToggle}> Register </Button>
                    </div>

                    <br /><br />

                    {/* form for authentication/login purposes */}
                    <Form noValidate autoComplete="off" onSubmit={handleLogin} style={{ maxWidth: "200px" }}>
                        <Form.Group as={Col} controlId="login-validation-username">
                            <Form.Label> Username/Email </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Username/Email"
                                    name="username"
                                    value={logFormValues.username}
                                    onChange={handleLogFormChange}
                                    // isValid={isTouched && !logFormErrors.username}
                                    isInvalid={!!logFormErrors.username}
                                />
                                <Form.Control.Feedback type="invalid"> {logFormErrors.username} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!logFormErrors.username && <br />}

                        <Form.Group as={Col} controlId="login-validation-password">
                            <Form.Label> Password </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={logFormValues.password}
                                    onChange={handleLogFormChange}
                                    // isValid={isTouched && !logFormErrors.password}
                                    isInvalid={!!logFormErrors.password}
                                />
                                <Form.Control.Feedback type="invalid"> {logFormErrors.password} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!logFormErrors.password && <br />}

                        <Button onClick={() => (state.button = 1)} type="submit"> Login </Button>

                        <a id="forget-password" href="/forget-password"> Forgot Password? </a>
                    </Form>

                    <br /><br />

                    <GoogleButton onClick={() => { state.button = 2; handleLogin(); }} type="submit" />
                </div>
            }

            {/* show register form */}
            {!isLoginForm &&
                <div className="login-holder" align="center">
                    <div id="login-register-toggle">
                        <span style={{ marginLeft: "25%" }}> </span>
                        <h1> Register </h1>
                        <Button className="rounded-pill" style={{ marginLeft: "50%" }} onClick={handleToggle}> Login </Button>
                    </div>

                    <br />

                    {/* form for register purposes */}
                    <Form noValidate autoComplete="off" validated={isRegisterValidated} onSubmit={handleRegister} style={{ maxWidth: "250px" }}>
                        <Form.Group as={Col} controlId="validation-username">
                            <Form.Label> Username </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    value={regFormValues.username}
                                    onChange={handleRegFormChange}
                                    isValid={isTouched && !regFormErrors.username}
                                    isInvalid={!!regFormErrors.username}
                                />
                                <Form.Control.Feedback type="invalid"> {regFormErrors.username} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!regFormErrors.username && <br />}

                        <Form.Group as={Col} controlId="validation-email">
                            <Form.Label> Email Address </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    value={regFormValues.email}
                                    onChange={handleRegFormChange}
                                    isValid={isTouched && !regFormErrors.email}
                                    isInvalid={!!regFormErrors.email}
                                />
                                <Form.Control.Feedback type="invalid"> {regFormErrors.email} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!regFormErrors.email && <br />}

                        <Form.Group as={Col} controlId="validation-password">
                            <Form.Label> Password </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={regFormValues.password}
                                    onChange={handleRegFormChange}
                                    isValid={isTouched && !regFormErrors.password}
                                    isInvalid={!!regFormErrors.password}
                                />
                                <Form.Control.Feedback type="invalid"> {regFormErrors.password} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!regFormErrors.password && <br />}

                        <Form.Group as={Col} controlId="validation-password-confirm">
                            <Form.Label> Confirm Your Password </Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Confirmed Password"
                                    name="passwordRep"
                                    value={regFormValues.passwordRep}
                                    onChange={handleRegFormChange}
                                    isValid={isTouched && !regFormErrors.passwordRep}
                                    isInvalid={!!regFormErrors.passwordRep}
                                />
                                <Form.Control.Feedback type="invalid"> {regFormErrors.passwordRep} </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <br /> {!regFormErrors.passwordRep && <br />}

                        <Button type="submit"> Register </Button>

                    </Form>
                </div>
            }

            {/* modals showing login success or failure */}
            {isLoginSuccessModal &&
                <Modal className="login-successful-modal" show={isLoginSuccessModal} onHide={() => { setIsLoginSuccessModal(false); navigate('/dashboard', { replace: true }); }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body color='#721c24'>
                        You have logged in!
                    </Modal.Body>
                </Modal>
            }

            {isLoginFailedModal &&
                <Modal className="login-failed-modal" show={isLoginFailedModal} onHide={() => setIsLoginFailedModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title color='#721c24'>Failure</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loginFailedMsg}
                    </Modal.Body>
                </Modal>}

        </main>
    )
}

export default Login;
