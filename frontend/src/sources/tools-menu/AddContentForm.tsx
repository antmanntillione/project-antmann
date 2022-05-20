import "./AddContentForm.css"

import Form from "react-bootstrap/Form"
import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useEffect, useReducer } from "react";

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "add":
            return { ...state, add: action.value }
        case "method":
            return { ...state, add: action.value }
        case "url":
            return { ...state, add: action.value }
        case "backup":
            return { ...state, add: action.value }
        case "title":
            return { ...state, add: action.value }
        case "author":
            return { ...state, add: action.value }
        case "publisher":
            return { ...state, add: action.value }
        case "doctype":
            return { ...state, add: action.value }
        case "date":
            return { ...state, add: action.value }
    }
}

const initialState = {
    add: "source",
    method: "manual",
    url: "",
    backup: false,
    title: "",
    author: "",
    publisher: "",
    doctype: "",
    date: ""
}

const AddContentForm = (props: any) => {
    const [formState, dispatch] = useReducer(reducer, initialState)
    console.log(formState)

    useEffect(() => {
        console.log(formState)
    }, [formState])
    
    return (
        <>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>What do you want to add?</Form.Label>
                    <ButtonGroup className="me-2">
                        <ToggleButton
                            value="source"
                            checked={formState.add == "source"}
                            onChange={(e) => {dispatch({type: "add", value: e.target.value})}}
                        >
                            A Source
                        </ToggleButton>
                        <ToggleButton
                            value="thesis"
                            checked={formState.add == "thesis"}
                            onChange={(e) => {dispatch({type: "add", value: e.target.value})}}
                        >
                            A Thesis
                        </ToggleButton>
                    </ButtonGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>What method do you want to use?</Form.Label>
                    <Form.Control placeholder="Enter an URL Link..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>What is the source URL?</Form.Label>
                    <Form.Control placeholder="Enter an URL Link..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Make a backup of the source?</Form.Label>
                    <Form.Control placeholder="Enter an URL Link..." />
                </Form.Group>
                <Form.Label>Fill the following fields:</Form.Label>

                <Form.Group className="mb-3">
                    <Form.Label>Source Title</Form.Label>
                    <Form.Control placeholder="Enter a Title..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Source main author</Form.Label>
                    <Form.Control placeholder="Enter the main author..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Source publisher</Form.Label>
                    <Form.Control placeholder="Enter the source publisher..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Source document type</Form.Label>
                    <Form.Control placeholder="Enter an URL Link..." />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Source creation date</Form.Label>
                    <Form.Control placeholder="Enter an URL Link..." />
                </Form.Group>

            </Form>
        </>
    );
}

export default AddContentForm