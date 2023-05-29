// followed the tutorial from https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
// and https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Checkbox } from '@mui/material';

const FileUploader = () => {
    // const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const [scanForms, setScanForms] = useState({});                  // scan form values
    const [fileUploaded, setfileUploaded] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [receiptData, setReceiptData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");                                 // current group user is selected

    useEffect(() => {
        // fetch from the backend the selected group name
        fetch('/select_group', {
            method: 'GET',
            mode: 'cors',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json();
            })
            .then(data => {
                console.log("selected group is: ", data);
                setSelectedGroup(data);
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    // Programatically click the hidden file input element
    const handleClick = (e) => {
        if (selectedGroup === "" || selectedGroup === null || selectedGroup === 409) {
            alert("Select your group first!");
        } else {
            hiddenFileInput.current.click();
        }
    };

    // handle the user-selected file 
    const handleUpload = (e) => {
        e.preventDefault();

        // check if no file selected
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        setfileUploaded(e.target.files[0]);
        let file = e.target.files[0];
        let inputfiletype = file.type;
        console.log(inputfiletype);

        // we need to do a file check here, since the user can escape the required Image format
        if (inputfiletype.match(/image\/\S+/) === null) {
            // TODO: for testing purposes. CHANGE ME!
            alert("Invalid Image format");

        } else {
            console.log("preview");
            setPreview(URL.createObjectURL(file));
        }
    };

    // handle the scanning of the uploaded image
    const handleScan = (e) => {
        e.preventDefault();

        setScanning(true);

        const imgData = new FormData();
        imgData.append('receipt', fileUploaded);

        fetch('/scan', {
            method: 'POST',
            mode: 'cors',
            body: imgData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json()
            })
            .then(data => {
                setReceiptData(data['receipt_text']);
                data['receipt_text'].map((line, index) => {
                    setScanForms(scanForms => {
                        const newItemKey = "Item" + index;
                        const newItemValue = {
                            name: line[0],
                            amount: line[1],
                            price: line[2],
                            checked: false
                        };
                        return { ...scanForms, [newItemKey]: newItemValue };
                    });

                    // placeholder
                    return null;
                });
            })
            .catch(err => {
                console.log(err)
            })
    }

    // handle scan form changes
    const handleScanFormsChange = (e, index, tag) => {
        const value = e.target.value;
        const key = "Item" + index;
        console.log("key is: ", key);
        console.log("value is: ", value);
        // tag specifies whether to set the "amount", "price", or "checked" of the current item
        if (tag === "checked") {
            setScanForms((prevScanForms) => {
                const newItem = { ...prevScanForms[key], [tag]: !prevScanForms[key][tag] };
                return { ...prevScanForms, [key]: newItem };
            });
        } else if (tag === "attach_image") {
            // TODO: send the image to backend
            
        } else {
            e.preventDefault();

            setScanForms((prevScanForms) => {
                const newItem = { ...prevScanForms[key], [tag]: value };
                return { ...prevScanForms, [key]: newItem };
            });
        }
    }

    // handle submission of user modification and confirmation of the scanning result
    const handleSubmitScanForm = (e) => {
        e.preventDefault();
        // // remove all entries that are not checked
        // for (const [key1, value1] of Object.entries(scanForms)) {
        //     console.log(key1, value1);
        //     if (!value1["checked"]) {
        //       delete scanForms[key1];
        //     }
        // }

        // send the confirm scanning result to the backend

        fetch('/scan_confirm', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scanForms)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json();
            })
            .then(data => {
                // TODO: change the alert into separate web pages
                let msg = "";
                for (const [key, value] of Object.entries(data)) {
                    console.log(key, value);
                    msg += ("account : " + key + " needs to pay " + value + "$\n");
                }
                alert(msg);
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <div className="dashboard">
            <p className='scanning-section-text'> Scanning receipt </p>

            {scanning ? (
                <>
                    <h1>Receipt Data:</h1>

                    <br></br>

                    <Form>
                        <Form.Group className="mb-3 d-flex">
                            <Col md={5}><Form.Label className="fw-bold">Name</Form.Label></Col>
                            <Col md={3}><Form.Label className="fw-bold ms-2">Quantity</Form.Label></Col>
                            <Col md={4}><Form.Label className="fw-bold ms-3">Price($)</Form.Label></Col>
                        </Form.Group>

                        {receiptData.map((line, index) => (
                            <Form.Group className="mb-3" key={index}>
                                <Row>
                                    <Col md={5}><Form.Label>{line[0]}</Form.Label></Col>
                                    <Col md={3}><Form.Control type="text" defaultValue={line[1]} onChange={(e) => handleScanFormsChange(e, index, "amount")} /></Col>
                                    <Col md={3}><Form.Control type="text" defaultValue={line[2]} onChange={(e) => handleScanFormsChange(e, index, "price")} /></Col>
                                    <Col md={1}><Checkbox color="success" onChange={(e) => handleScanFormsChange(e, index, "checked")} /></Col>
                                </Row>
                            </Form.Group>
                        ))}

                        <Form.Group className="mb-3 d-column">
                            {/* FIXME: 1. figure out how to add text to a checkbox. 2. adjust the flex direction to be column */}
                            <Checkbox color="success" onChange={(e) => handleScanFormsChange(e, -1, "attach_image")}>hihi</Checkbox>
                            <Button type="submit" onClick={handleSubmitScanForm}>Confirm Changes</Button>
                        </Form.Group>
                    </Form>
                </>
            ) : (
                <div className="fileUploader-container">
                    <Button onClick={handleClick}> Upload a Image </Button>

                    <input
                        type="file"
                        accept="image/*"            /* only images can be uploaded */
                        ref={hiddenFileInput}
                        onChange={handleUpload}
                        style={{ display: 'none' }}   /* do not display the input file */
                    />

                    <br /><br /><br />

                    {fileUploaded && <img style={{ maxWidth: 500, maxHeight: 500 }} src={preview} alt="" />}

                    <br /><br /><br />

                    {fileUploaded && <Button className="scan-button" onClick={handleScan}> Scan the Receipt </Button>}

                </div>
            )
            }
        </div >

    );
}

export default FileUploader;