import "./ContentMenu.css"
import { Accordion } from "react-bootstrap"
import SourceMenu from "../source-menu/SourceMenu"
import SourceContentMenu from "../source-content-menu/SourceContentMenu"
import ThesisMenu from "../thesis-menu/ThesisMenu"
import { useState } from "react"
import { Source } from "../models/source-models"

interface ContentMenuInterface {
  sourcesData: any
}

const ContentMenu = (props: ContentMenuInterface) => {

  const [currentDataInSourceContentMenu, setCurrentSourcesMenuData] = useState<Source | null>(null)


  function triggerShowContentMenu(data: Source) {
    setCurrentSourcesMenuData(data)
  }

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Sources Menu
          </Accordion.Header>
          <Accordion.Body>
            <SourceMenu data={props.sourcesData} triggerShowContentMenu={triggerShowContentMenu} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Source Content Menu
          </Accordion.Header>
          <Accordion.Body>
            <SourceContentMenu data={currentDataInSourceContentMenu} />
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