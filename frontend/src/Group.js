import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';

const Group = () => {
    const navigate = useNavigate();
    const [creatGroupName, setCreatGroupName] = useState("");
    const [joinGroupName, setJoinGroupName] = useState("");
    const [isCreatGroupNameValid, setIsCreatGroupNameValid] = useState(true);
    const [isJoinGroupNameValid, setIsJoinGroupNameValid] = useState(true);
    const [createGroupError, setCreateGroupError] = useState("");
    const [joinGroupError, setJoinGroupError] = useState("");
    const [userGroups, setUserGroups] = useState([]);                                         // all groups that the current user is in
    const [currGroupName, setCurrGroupName] = useState("");                                   // current group that user selects
    const [selectedGroupInfo, setSelectedGroupInfo] = useState(null);                         // current group information that user is selected


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
        e.preventDefault();

        fetch('/create_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": creatGroupName })
        })
            .then(response => {
                if (response.ok) {
                    setIsCreatGroupNameValid(true);
                    window.location.reload();
                } else {
                    setIsCreatGroupNameValid(false);
                    return response.json().then(data => {
                        setCreateGroupError(data['error']);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleAddGroup = (e) => {
        e.preventDefault();

        fetch('/add_to_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": joinGroupName })
        })
            .then(response => {
                if (response.ok) {
                    setIsJoinGroupNameValid(true);
                    window.location.reload();
                } else {
                    setIsCreatGroupNameValid(false);
                    return response.json().then(data => {
                        // group name not found
                        setJoinGroupError(data["error"]);
                        setIsJoinGroupNameValid(false);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    // handle when user click on a group and show the group information
    const handleShowGroup = (e, item) => {
        e.preventDefault();

        setCurrGroupName(item);

        fetch('/show_members', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": item })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json();
            })
            .then(data => {
                console.log("group info is: ", data);
                setSelectedGroupInfo(data);
            })
            .catch(err => {
                console.log(err)
            })
    }

    // handle when user select a group
    const handleGroupSelection = (e) => {
        e.preventDefault();

        // tell backend the selected group name
        fetch('/select_group', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "group_name": currGroupName })
        })

        //TODO: Selected group not reflecting immediately when called in FileUploader.js for GET method
        navigate('/dashboard/scan', { replace: true });
    }

    return (
        <>
            <p className='scanning-section-text'> Welcome to your Dashboard</p>

            <div className="group-function-container">
                <div className="group-box">
                    <div className="group-box-left">
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
                                        <ListGroup.Item key={index} id={"group" + index} action onClick={(e) => handleShowGroup(e, item)} variant="warning">
                                            {item}
                                        </ListGroup.Item>
                                    ))}
                                </>
                            )}

                            {/* <ListGroup.Item action variant="primary">
                                    Select this group
                                </ListGroup.Item> */}
                        </ListGroup>
                    </div>

                    <div className="group-box-right">
                        {/* <h3>{groups.find((group) => group.id === 1).name}</h3> */}
                        {selectedGroupInfo && Object.keys(selectedGroupInfo).map((email, index) => (
                            <h5 key={index}> {email} </h5>
                        ))}

                        {/* Display group information here */}
                        {selectedGroupInfo && <Button onClick={handleGroupSelection} style={{ marginTop: "2rem" }}>Select Group</Button>}
                    </div>
                </div>

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
                        <Form.Control.Feedback type="invalid"> {createGroupError} </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid"> {joinGroupError} </Form.Control.Feedback>
                    </InputGroup>
                    <Button type="submit" onClick={handleAddGroup}> Join Group </Button>
                </Form>
            </div>
        </>
    );
}

export default Group;