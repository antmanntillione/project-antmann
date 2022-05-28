import "./SearchBar.css"

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"

const SearchBar = (props: any) => {
    return (
        <>
            <Form>
                <Form.Group className="mb-3">
                    <Container>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control placeholder="Search a phrase..." />
                            </Col>
                            <Col xs={6} md={4}>
                                <Button variant="primary" type="submit">
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>
        </>
    )
}

export default SearchBar