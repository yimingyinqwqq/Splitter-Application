import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ListGroup, Button, Modal } from 'react-bootstrap';

const History = () => {
    const [bills, setBills] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // const b1 = {
    //     id: 1,
    //     date: new Date(),
    //     items: [
    //         { id: 1, name: "Item 1", price: 10 },
    //         { id: 2, name: "Item 2", price: 20 },
    //         { id: 3, name: "Item 3", price: 30 },
    //     ],
    // };

    // update bill history
    useEffect(() => {
        console.log(bills);

        fetch('/show_bill_info', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            // CHANGEME: change this "0" to current group selected using variables or stuff
            body: JSON.stringify({ "selected_group": "0" })
        })
            .then(response => {
                if (!response.ok) {
                    console.log("lol");
                    setBills([{ id: -1, date: "NA", items: [] }]);
                    throw new Error(response.statusText)
                } else {
                    return response.json();
                }
            })
            .then(data => {
                console.log("bill is: ", data);
                setBills(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleEdit = (e, bill_index) => {
        e.preventDefault();
        //TODO: Create a popup window to display the edit space

    }

    const handleCancel = (e, bill_index) => {
        e.preventDefault();
        //TODO: call delete bill function
        setShowModal(true);
    }

    const handleConfirmCancel = (e, bill_index) => {
        e.preventDefault();
        //TODO: call delete bill function
        setShowModal(false);
    }

    return (
        <>
            <ListGroup>
                {bills.map((bill, bill_index) => (
                    <ListGroup.Item key={bill_index} className="rounded mb-5">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                            <h5 className="mb-1 me-2">Bill #{bill_index + 1}</h5>
                            <small>{bill.date.toLocaleString()}</small>
                            <Button variant="link" className="edit-button" onClick={(e) => handleEdit(e, bill_index)}>Edit this bill</Button>
                            <Button variant="link" className="cancel-button" onClick={(e) => handleCancel(e, bill_index)}>Cancel this bill</Button>
                        </div>
                        <div className="mt-3">
                            {bill.items.map((item, item_index) => (
                                <div key={item_index} className="d-flex w-100 justify-content-between align-items-center">
                                    <h6 className="mb-0">{item.name}</h6>
                                    <span className="text-muted">${item.amount * item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <img src="holder.js/100px250"></img>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure about deleting this bill?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirmCancel}>
                        Yes, I am sure
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        No, let me think
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default History;