import "./AddContent.css"

import { useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import AddContentForm from "./AddContentForm"

const AddContent = (props: any) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Add Content
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add your content!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddContentForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Add Content
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddContent