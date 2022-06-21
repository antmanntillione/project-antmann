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

  /*
<a href={props.data.url} target="_blank" onClick={() => {
            props.triggerShowContentMenu(props.data)
            return false
          }}>Link</a>
  */

  return (
    <>
      <tr>
        <td>{props.data.index}</td>
        <td>{props.data.main_information.document_type}</td>
        <td>{props.data.main_information.title}</td>
        <td>{props.data.main_information.main_author}</td>
        <td>{props.data.main_information.creation_date.toString()}</td>
        <td>
          <Button variant="outline-primary" onClick={() => {
            props.triggerShowContentMenu(props.data)
            return false
          }}>
            Show Site below
          </Button>
        </td>
        <td>{props.data.is_reviewed ? "Yes" : "No"}</td>
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