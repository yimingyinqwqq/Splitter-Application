import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

const Group = () => {
    const navigate = useNavigate();
    const [creatGroupName, setCreatGroupName] = useState("");
    const [joinGroupName, setJoinGroupName] = useState("");
    const [isCreatGroupNameValid, setIsCreatGroupNameValid] = useState(true);
    const [isJoinGroupNameValid, setIsJoinGroupNameValid] = useState(true);
    const [userGroups, setUserGroups] = useState([]);                                         // all groups that the current user is in


    useEffect(() => {
        fetch('/show_user_groups', {
            method: 'GET',
            mode: 'cors',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(data => {
                console.log(data);
                // TODO: handle error code
                if ("error" in data) {
                    throw new Error(data["error"]);
                } else {
                    // set all groups user is in
                    setUserGroups(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const handleCreateGroupFormChange = (e) => {
        e.preventDefault();
        setCreatGroupName(e.target.value);
    }

    const handleJoinGroupFormChange = (e) => {
        e.preventDefault();
        setJoinGroupName(e.target.value);
    }

    const handleCreateGroup = (e) => {
        fetch('/create_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": creatGroupName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(data => {
                if (data === 200) {
                    console.log("200");
                    setIsCreatGroupNameValid(true);
                } else if (data === 409) {
                    // group name already exists
                    console.log("409");
                    setIsCreatGroupNameValid(false);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleAddGroup = (e) => {
        fetch('/add_to_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": joinGroupName })
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
                    setIsJoinGroupNameValid(true);
                } else if (data === 409) {
                    // group name not found
                    console.log("409");
                    setIsJoinGroupNameValid(false);
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    // handle when user select a group
    const handleGroupSelection = (e, item) => {
        e.preventDefault();

        console.log("item is: ", item);
        
        // tell backend the selected group name
        fetch('/select_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"group_name" : item})
        })

        navigate('/dashboard/scan', { replace: true });
    }

    return (
        <>
            <p className='scanning-section-text'> Welcome to your Dashboard</p>

            <div className="group-function-container">


                <ListGroup className="group-container">
                    {userGroups.length === 0 ? (
                        <>
                            <ListGroup.Item variant="danger">
                                Add one group first
                            </ListGroup.Item>
                        </>
                    ) : (
                        <>
                            {userGroups.map((item, index) => (
                                <ListGroup.Item key={index} id={"group" + index} action onClick={(e) => handleGroupSelection(e, item)} variant="warning">
                                    {item}
                                </ListGroup.Item>
                            ))}
                        </>
                    )}

                    {/* <ListGroup.Item action variant="primary">
                    Select this group
                </ListGroup.Item> */}
                </ListGroup>

                <Form className="create-group-container">
                    <InputGroup className="mb-3" hasValidation>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Create your group name"
                            value={creatGroupName}
                            onChange={handleCreateGroupFormChange}
                            isInvalid={!isCreatGroupNameValid}
                        />
                        <Form.Control.Feedback type="invalid"> The group name has been taken! </Form.Control.Feedback>
                    </InputGroup>
                    <Button type="submit" onClick={handleCreateGroup}> Create Group </Button>
                </Form>

                <Form className="add-group-container">
                    <InputGroup className="mb-3" hasValidation>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter your group name"
                            value={joinGroupName}
                            onChange={handleJoinGroupFormChange}
                            isInvalid={!isJoinGroupNameValid}
                        />
                        <Form.Control.Feedback type="invalid"> The group does not exist! </Form.Control.Feedback>
                    </InputGroup>
                    <Button type="submit" onClick={handleAddGroup}> Join Group </Button>
                </Form>
            </div>
        </>
    );
}

export default Group;