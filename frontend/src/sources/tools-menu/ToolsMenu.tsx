import "./ToolsMenu.css"
import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"

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
                    <Container>
                        <Row>
                            <Col xs={12} md={8}>
                                <SearchBar />
                            </Col>
                            <Col xs={6} md={4}>
                                <AddContent />
                            </Col>
                        </Row>
                    </Container>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default ToolsMenu