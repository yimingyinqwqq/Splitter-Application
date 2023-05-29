import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"

import Login from "./Login"
import PasswordReset from "./PasswordReset"
import Dashboard from './Dashboard';
import FileUploader from './FileUploader';
import Group from './Group';
import History from './History';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                {/* <Route index element={<App/>} /> */}
                    <Route path="" element={<Login/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/forget-password" element={<PasswordReset/>} />
                    <Route path="/dashboard" element={<><Dashboard/><Group/></>} />
                    <Route path="/dashboard/scan" element={<><Dashboard/><FileUploader/></>} />
                    <Route path="/dashboard/history" element={<><Dashboard/><History/></>} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;

