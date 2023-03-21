import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"

import Login from "./Login"
import Dashboard from './Dashboard';
import Scanboard from './Scanboard';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                {/* <Route index element={<App/>} /> */}
                    <Route path="" element={<Login/>} />
                    <Route path="login" element={<Login/>} />
                    <Route path="dashboard" element={<Dashboard/>} />
                    <Route path="dashboard/scan" element={<Scanboard/>} />

                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;

