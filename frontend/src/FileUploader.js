// followed the tutorial from https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
// and https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';

const FileUploader = () => {
    const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const [scanForms, setScanForms] = useState({});                  // scan form values
    const [fileUploaded, setfileUploaded] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [receiptData, setReceiptData] = useState([]);

    // Programatically click the hidden file input element
    const handleClick = (e) => {
        hiddenFileInput.current.click();
    };

    // handle the user-selected file 
    const handleUpload = (e) => {
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
            .then(data => setReceiptData(data['receipt_text']))

            .catch(err => {
                console.log(err)
            })
    }

    // handle scan form changes
    const handleScanFormsChange = (e, index) => {
        const value = e.target.value;
        const name = "Item" + index;
        console.log("name is: ", name);
        console.log("value is: ", value);
        setScanForms({ ...scanForms, [name]: value });
    }

    // handle submission of user modification and confirmation of the scanning result
    const handleSubmitScanForm = (e) => {
        console.log(scanForms);
        // for (let i = 0; i < scanForms.current.length; ++i) {
        //     console.log(scanForms.current[i].defaultValue);
        // }
    }

    return (
        <div className="dashboard">
            {scanning ? (
                <>
                    <h1>Receipt Data:</h1>
                    <Form>
                        {receiptData.map((line, index) => (
                            <>
                                {/* ref={(element) => scanForms.current.push(element)} */}
                                <Form.Group className="mb-3" controlId="formBasicEmail" key={index} >
                                    <Form.Label> Placeholder </Form.Label>
                                    <Form.Control type="email" defaultValue={line} onChange={(e) => handleScanFormsChange(e, index)} />
                                </Form.Group>
                                <Form.Check type="checkbox" label="Check me out" />

                            </>
                        ))}
                        <Button type="submit" onClick={handleSubmitScanForm}> Confirm Changes </Button>
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

                    {fileUploaded && <button onClick={handleScan}> Scan the Receipt </button>}

                </div>
            )
            }
        </div >

    );
}

export default FileUploader;