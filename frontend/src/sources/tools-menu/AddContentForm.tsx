import "./AddContentForm.css"

import Form from "react-bootstrap/Form"
import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useEffect, useReducer } from "react";

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import FloatingLabel from "react-bootstrap/FloatingLabel"
//import DateField from 'react-native-datefield';

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
                    <Container>
                        <Row className="g-2">
                            <Col>
                                <Form.Label>What do you want to add?</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select>
                                    <option value="source">Source</option>
                                    <option value="thesis" disabled={true}>Thesis</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Container>
                        <Row>
                            <Col>
                                <Form.Label>What method do you want to use?</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select>
                                    <option value="manual">Manual</option>
                                    <option value="automatic" disabled={true}>Automatic</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="Enter the source URL">
                        <Form.Control placeholder="" />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Container>
                        <Row>
                            <Col>
                                <Form.Label>Make a backup of the source?</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select>
                                    <option value="no">No</option>
                                    <option value="yes" disabled={true}>Yes</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>

                <Form.Label>Fill the following fields:</Form.Label>

                <Form.Group className="mb-3">
                    <FloatingLabel label="Enter a title">
                        <Form.Control placeholder="" />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="Who is the sources main author?">
                        <Form.Control placeholder="" />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="Who is the sources publisher?">
                        <Form.Control placeholder="" />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Container>
                        <Row>
                            <Col>
                                <Form.Label>Select the sources document type.</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select>
                                    <option value="webpage">Webpage</option>
                                    <option value="pdf">PDF Document</option>
                                    <option value="video">Video file</option>
                                    <option value="audio">Audio file</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="What is the source URL?">
                        <Form.Control placeholder="Enter an URL Link..." />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="What is the source URL?">
                        <Form.Control placeholder="Enter an URL Link..." />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3">
                    <FloatingLabel label="What is the source URL?">
                        <Form.Control placeholder="Enter an URL Link..." />
                    </FloatingLabel>
                </Form.Group>

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