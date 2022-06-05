import "./AddContent.css"

import { useState } from "react"
import { Button } from "react-bootstrap"
import AddContentForm from "./AddContentForm"

interface AddContentInterface {
    addContent?: any
}

const AddContent = (props: AddContentInterface) => {

    //AddContentForm Modal show
    const [showForm, setShowForm] = useState(false)
    const handleShow = () => setShowForm(true)
    const handleClose = () => setShowForm(false)

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Add Content
            </Button>
            <AddContentForm show={showForm} onHide={handleClose} addContent={props.addContent}/>
        </>
    );
}

export default AddContent