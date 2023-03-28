// followed the tutorial from https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
// and https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button"

const FileUploader = () => {
    const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const [fileUploaded, setfileUploaded] = useState(null);
    const [preview, setPreview] = useState(null);
    
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
        // TODO: connect to backend to send and retreive scanning result
        alert("start scanning");
        
        // FIXME: protect this route
        navigate('/dashboard/scan', { replace: true });
    }

    return (
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

            { fileUploaded && <img style={{ maxWidth: 500, maxHeight: 500 }} src={preview} alt=""/> }

            <br /><br /><br />

            { fileUploaded && <button onClick={handleScan}> Scan the Receipt </button> }

        </div>
    );
}

export default FileUploader;