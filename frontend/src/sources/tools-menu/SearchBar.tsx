import "./SearchBar.css"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import React from "react"


const SearchBar = (props: any) => {
    return (
        <React.Fragment>
            <h2>
                Search
            </h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label></Form.Label>
                    <Form.Control placeholder="Enter your phrase..." />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Search
                </Button>
            </Form>
        </React.Fragment>
    )
}

export default SearchBar