import "./ContentMenu.css"

import SourceMenu from "../source-menu/SourceMenu"
import SourceContentMenu from "../source-content-menu/SourceContentMenu"
import ThesisMenu from "../thesis-menu/ThesisMenu"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import Accordion from "react-bootstrap/Accordion"

interface ContentMenuInterface {
  sourcesData: any
}

const ContentMenu = (props: ContentMenuInterface) => {
  return (
    <><Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          Sources Menu
        </Accordion.Header>
        <Accordion.Body>
          <SourceMenu data={props.sourcesData}/>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          Source Content Menu
        </Accordion.Header>
        <Accordion.Body>
          <SourceContentMenu />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>
          Thesis Menu
        </Accordion.Header>
        <Accordion.Body>
          <ThesisMenu />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </>
  )
}

export default ContentMenu