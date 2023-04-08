import React, { useEffect, useState, useRef } from "react";

const Scanboard = () => {
    var jsonData = {
        "users": [
            {
                "name": "alan",
                "age": 23,
                "username": "aturing"
            },
            {
                "name": "john",
                "age": 29,
                "username": "__john__"
            }
        ]
    }

    const handleClick = () => {
        // Send data to the backend via POST
        fetch('https://127.0.0.1:5000/scan', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(jsonData) // body data type must match "Content-Type" header
        })
            .then(response => {
                // if (!response.ok) {
                //     throw new Error(response.statusText)
                // }
                // return response.json()
                console.log("get the response");
            }).catch(err => {
                console.log(err)
            })

    }

    return (
        <>
            <button onClick={handleClick}>Hi</button>
        </>
    );


}

export default Scanboard;