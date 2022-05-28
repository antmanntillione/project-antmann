import "./SourceItem.css"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { useState } from "react"
import Table from "react-bootstrap/Table"

interface SourceItemProps {
  id: number
  title: string,
  url: string,
  author: string,
  publisher: string
  accordion_index: number
}

const SourceItem = (props: SourceItemProps) => {

  const [moreInfo, setMoreInfo] = useState(false)
  const accordionButtonHandler = () => {
    setMoreInfo(!moreInfo)
  }

  return (
    <>
      <tr>
        <td>{props.id}</td>
        <td>{props.title}</td>
        <td>{props.url}</td>
        <td>{props.author}</td>
        <td>{props.publisher}</td>
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
              <Card>
                Here you can see more Info for that source!
              </Card>
            </td>
          </tr>
        </>}
    </>
  );
}

export default SourceItem