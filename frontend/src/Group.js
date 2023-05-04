import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

const Group = () => {
    const [creatGroupName, setCreatGroupName] = useState("");
    const [findGroupName, setFindGroupName] = useState("");
    const [isCreatGroupNameValid, setIsCreatGroupNameValid] = useState(true);
    const [isFindGroupNameValid, setIsFindGroupNameValid] = useState(true);
    const [userGroups, setUserGroups] = useState([]);                                         // all groups that the current user is in
    const [selectedGroup, setSelectedGroup] = useState(null);                                 // current group user is selected

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

    const handleFindGroupFormChange = (e) => {
        e.preventDefault();
        setFindGroupName(e.target.value);
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
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(data => {
                if (data === 200) {
                    console.log("200");
                    setIsCreatGroupNameValid(true);
                    // console.log("200");
                } else if (data === 409) {
                    console.log("409");
                    setIsCreatGroupNameValid(false);
                }


            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleAddGroup = (e) => {
        e.preventDefault();

        // fetch('/add_to_group', {
        //     method: 'POST',
        //     mode: 'cors',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ "group_name": creatGroupName })
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error(response.statusText)
        //         }

        //         return response.json()
        //     })

    }

    const handleGroupSelection = (e) => {
        e.preventDefault();
        setSelectedGroup(e.target.id);
    }

    return (
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
                            <ListGroup.Item key={index} id={"group" + index} action onClick={handleGroupSelection} variant="warning">
                                {item}
                            </ListGroup.Item>
                        ))}
                    </>
                )}

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
                        value={findGroupName}
                        onChange={handleFindGroupFormChange}
                        isInvalid={!isFindGroupNameValid}
                    />
                    <Form.Control.Feedback type="invalid"> The group does not exist! </Form.Control.Feedback>
                </InputGroup>
                <Button type="submit" onClick={handleAddGroup}> Add Group </Button>
            </Form>
        </div>
    );
}

export default Group;