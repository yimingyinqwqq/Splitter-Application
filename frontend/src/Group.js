import React, { useState } from 'react';
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Group = () => {
    const [groupName, setGroupName] = useState("");
    const [isGroupNameValid, setIsGroupNameValid] = useState(true);

    const handleCreateGroupFormChange = (e) => {
        e.preventDefault();
        setGroupName(e.target.value);
    }

    const handleCreateGroup = (e) => {
        e.preventDefault();

        fetch('/create_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": groupName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json()
            })
            .then(data => {
                if (data === 200) {
                    console.log("200");
                    setIsGroupNameValid(true);
                    // console.log("200");
                } else if (data === 409) {
                    console.log("409");
                    setIsGroupNameValid(false);
                }


            })

            .catch(err => {
                console.log(err)
            })
    }

    const handleAddGroup = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <Form>
                <InputGroup className="mb-3" hasValidation>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Create your group name"
                        value={groupName}
                        onChange={handleCreateGroupFormChange}
                        isInvalid={!isGroupNameValid}
                    />
                    <Form.Control.Feedback type="invalid"> The group name has been taken! </Form.Control.Feedback>
                </InputGroup>
                <Button type="submit" onClick={handleCreateGroup}> Create Group </Button>
            </Form>

            <Form>
                <InputGroup className="mb-3" hasValidation>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter your group name"
                        value={groupName}
                        onChange={handleCreateGroupFormChange}
                        isInvalid={!isGroupNameValid}
                    />
                    <Form.Control.Feedback type="invalid"> The group does not exist! </Form.Control.Feedback>
                </InputGroup>
                <Button type="submit" onClick={handleAddGroup}> Add Group </Button>
            </Form>

            
        </>
    );
}

export default Group;