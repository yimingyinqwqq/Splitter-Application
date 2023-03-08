// followed the tutorial from https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
import React from "react";

const FileUploader = () => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);
    
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (e) => {
        hiddenFileInput.current.click();
    };

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = (e) => {
        const fileUploaded = e.target.files[0];
        
        // handle the input file by constraining its type to be image format and make a preview of the picture
        var inputfiletype = fileUploaded.type;
        console.log(inputfiletype);

        // we still need to do a file check, since the user can escape the Image format and instead add any file format
        if (inputfiletype.match(/image\/\S+/) === null) { // "\S+ matches one or more non-space character"
            // TODO: for testing purposes. CHANGE ME!
            alert("Invalid Image format");
        } else {
            // TODO: make a preview of the Image

        }
    };

    return (
        <>
            <button onClick={handleClick}> Upload a Image </button>

            <input
                type="file"
                accept="image/*"            /* only images can be uploaded */
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{display: 'none'}}   /* do not display the input file */
            />
        </>
    );
}

export default FileUploader;