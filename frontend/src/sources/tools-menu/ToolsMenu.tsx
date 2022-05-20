import "./ToolsMenu.css"
import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import SearchBar from "./SearchBar";
import AddContent from "./AddContent"


const ToolsMenu = (props: any) => {
    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    Tools Menu
                </Accordion.Header>
                <Accordion.Body>
                    <SearchBar />
                    <hr />
                    <AddContent />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default ToolsMenu