import "./AddContentForm.css"

import { Form, Container, Row, Col, FloatingLabel } from "react-bootstrap"
import { useReducer, useState } from "react";
import { Modal, Button } from "react-bootstrap"

//https://www.npmjs.com/package/react-date-picker
import DatePicker from 'react-date-picker';
import "react-date-picker/dist/DatePicker.css"

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "add":
            return { ...state, add: action.value }
        case "method":
            return { ...state, method: action.value }
        case "url":
            return { ...state, url: action.value }
        case "backup":
            return { ...state, backup: action.value }
        case "title":
            return { ...state, title: action.value }
        case "author":
            return { ...state, author: action.value }
        case "publisher":
            return { ...state, publisher: action.value }
        case "doctype":
            return { ...state, doctype: action.value }
        case "date":
            return { ...state, date: action.value }
        case "reset":
            return initialState
    }
}

const initialState = {
    key: 0,
    add: "source",
    method: "manual",
    url: "",
    backup: "no",
    title: "",
    author: "",
    publisher: "",
    doctype: "webpage",
    date: new Date("Feb 2 2022")
}

interface AddContentFormInterface {
    show: boolean
    onHide: any
    addContent?: any
}

const AddContentForm = (props: AddContentFormInterface) => {

    const [formState, dispatch] = useReducer(reducer, initialState)
    const handleFormReset = () => dispatch({ type: "reset" })

    const handleFormSubmit = () => {

        //after validation
        props.addContent(formState) //gets executed in API file

        //hide and reset form
        props.onHide(false)
        handleFormReset()
    }

    return (
        <>
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Add your content!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Container>
                                <Row className="g-2">
                                    <Col>
                                        <Form.Label>What do you want to add?</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Select
                                            onChange={(event: any) => { dispatch({ type: "add", value: event.target.value }) }}
                                            value={formState.add}
                                        >
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
                                        <Form.Select
                                            onChange={(event: any) => { dispatch({ type: "method", value: event.target.value }) }}
                                            value={formState.method}
                                        >
                                            <option value="manual">Manual</option>
                                            <option value="automatic" disabled={true}>Automatic</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Container>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Enter the source URL">
                                <Form.Control
                                    onChange={(event: any) => { dispatch({ type: "url", value: event.target.value }) }}
                                    value={formState.url}
                                    placeholder=""
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Container>
                                <Row>
                                    <Col>
                                        <Form.Label>Make a backup of the source?</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Select
                                            onChange={(event: any) => { dispatch({ type: "backup", value: event.target.value }) }}
                                            value={formState.backup}
                                        >
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
                                <Form.Control
                                    onChange={(event: any) => { dispatch({ type: "title", value: event.target.value }) }}
                                    value={formState.title}
                                    placeholder=""
                                />                    </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Who is the sources main author?">
                                <Form.Control
                                    onChange={(event: any) => { dispatch({ type: "author", value: event.target.value }) }}
                                    value={formState.author}
                                    placeholder=""
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <FloatingLabel label="Who is the sources publisher?">
                                <Form.Control
                                    onChange={(event: any) => { dispatch({ type: "publisher", value: event.target.value }) }}
                                    value={formState.publisher}
                                    placeholder=""
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Container>
                                <Row>
                                    <Col>
                                        <Form.Label>Select the sources document type.</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Select
                                            onChange={(event: any) => { dispatch({ type: "doctype", value: event.target.value }) }}
                                            value={formState.doctype}
                                        >
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
                            <Container>
                                <Row>
                                    <Col>
                                        <Form.Label>Source creation date:</Form.Label>
                                    </Col>
                                    <Col>
                                        <DatePicker
                                            closeCalendar={true}
                                            value={formState.date}
                                            showLeadingZeros={true}
                                            calendarClassName="react-calender"
                                            onChange={(value: any) => { dispatch({ type: "date", value: value }) }}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Form.Group>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleFormReset}>
                        Reset
                    </Button>
                    <Button variant="danger" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleFormSubmit}>
                        Add Content
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddContentForm