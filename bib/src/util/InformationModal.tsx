import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./InformationModal.css";

import infoImage from "../resources/information.png";

export const InformationModal = (
        props: {
            title?: string,
            info?: string,
            onOpen?: any,
            onClose?: any
        }
    ) => {

    const [show, setShow] = React.useState(false);
    const handleShow = () => {
        //see adjustments in XAIModelSelection.
        //onOpen and onClose is needed, if the information button shall be clicked, but the model selection shall not fire
        props.onOpen()
        setShow(true)
    }
    const handleClose = () => {
        props.onClose()
        setShow(false)
    }
    
    return (
        <>  
            <img 
                src={infoImage}
                className={"info"}
                onClick={handleShow}
            ></img>
            <Modal 
                show={show} 
                onHide={handleClose} 
                animation={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.info}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

