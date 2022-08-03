import "./SearchBar.css"

import { useState } from "react"
import { Form, Button, Row, Col, Container } from "react-bootstrap"

interface SearchBarInterface {
    triggerSearch: any
}

const SearchBar = (props: SearchBarInterface) => {

    const [validated, setValidated] = useState(false)
    const [searchText, setSearchText] = useState("")

    const handleSearchSubmit = (event: any) => {
        event.preventDefault()

        //validation
        const form = event.currentTarget
        if (form.checkValidity() == false) {
            event.stopPropagation();

        } else {
            setValidated(true)

            console.log(searchText)
            props.triggerSearch(searchText)

        }

        //form validation doesnt work right, if this doesnt stand here, but why ?!
        setValidated(true);
    }

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSearchSubmit}>
                <Form.Group className="mb-3">
                    <Container>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control required placeholder="Search a phrase..." onChange={(e: any) => { setSearchText(e.target.value) }} />
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