import "./SourceItem.css"
import { Button, Card } from "react-bootstrap"
import { useState } from "react"
import SourcesInformation from "./SourcesItemInformation"
import { SourceItemInterface } from "../models/models"

const SourceItem = (props: SourceItemInterface) => {

  const [moreInfo, setMoreInfo] = useState(false)
  const accordionButtonHandler = () => {
    setMoreInfo(!moreInfo)
  }



  return (
    <>
      <tr>
        <td>{props.source_menu_index}</td>
        <td>{props.data.id}</td>
        <td>{props.data.document_type}</td>
        <td>{props.data.title}</td>
        <td>{props.data.main_author}</td>
        <td>{props.data.creation_date}</td>
        <td><a href={props.data.url} target="_blank" onClick={() => {
          props.triggerShowConentMenu(props.data)
          return false
        }}>Link</a></td>
        <td>{props.data.reviewed ? "Yes" : "No"}</td>
        <td>
          <Button variant="outline-primary" onClick={accordionButtonHandler}>
            More Info
          </Button>
        </td>
      </tr>
      {moreInfo &&
        <>
          <tr>
            <td colSpan={9999}>
              <SourcesInformation data={props.data} />
            </td>
          </tr>
        </>}
    </>
  );
}

export default SourceItem