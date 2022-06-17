import "./SourceMenu.css"
import { Table } from "react-bootstrap"
import SourceItem from "./SourceItem"
import { useState } from "react"
import { SourceMenuInterface, Source } from "../models/models"

const SourceMenu = (props: SourceMenuInterface) => {

  let currentSources = props.data

  //Note the key prop in SourceItem (seems to be necessary. key prop is a special prop which doesnt have to be specified in the SourceItem Interface)
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Index</th>
          <th>ID</th>
          <th>Document Type</th>
          <th>Title</th>
          <th>Main Author</th>
          <th>Creation Date</th>
          <th>URL</th>
          <th>Reviewed</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currentSources.map((item: Source, index: any) => {
          return <SourceItem
            key={index}
            source_menu_index={index}
            data={item}
            triggerShowConentMenu={props.triggerShowConentMenu}
          />
        })}
      </tbody>
    </Table>
  );
}

export default SourceMenu