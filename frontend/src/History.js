import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, ListGroup, Button } from 'react-bootstrap';

const History = () => {
    const b1 = {
        id: 1,
        date: new Date(),
        items: [
            { id: 1, name: "Item 1", price: 10 },
            { id: 2, name: "Item 2", price: 20 },
            { id: 3, name: "Item 3", price: 30 },
        ],
    };
    const b2 = {
        id: 2,
        date: new Date(),
        items: [
            { id: 1, name: "Item 1", price: 110 },
            { id: 2, name: "Item 2", price: 3.2 },
            { id: 3, name: "Item 3", price: 30 },
        ],
    };
    const bills = [b1, b2];

    console.log(bills)

    const handleCancel = () => {

    }

    return (
        <ListGroup>
            {bills.map((bill) => (
                <ListGroup.Item key={bill.id} className="rounded mb-5">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <h5 className="mb-1 me-2">Bill #{bill.id}</h5>
                        <small>{bill.date.toLocaleString()}</small>
                        <Button variant="link" className="cancel-button" onClick={() => handleCancel(bill.id)}>Cancel this bill</Button>
                    </div>
                    <div className="mt-3">
                        {bill.items.map((item) => (
                            <div key={item.id} className="d-flex w-100 justify-content-between align-items-center">
                                <h6 className="mb-0">{item.name}</h6>
                                <span className="text-muted">${item.price}</span>
                            </div>
                        ))}
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default History;