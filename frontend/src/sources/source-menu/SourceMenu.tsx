import "./SourceMenu.css"
import { Table } from "react-bootstrap"
import SourceItem from "./SourceItem"
import { useState } from "react"
import { SourceMenuInterface } from "../models/models"
import {Source} from "../models/source-models"

const SourceMenu = (props: SourceMenuInterface) => {

  let currentSources = props.data

  //Note the key prop in SourceItem (seems to be necessary. key prop is a special prop which doesnt have to be specified in the SourceItem Interface)
  return (
    <Table striped hover>
      <thead>
        <tr>
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
            data={item}
            triggerShowContentMenu={props.triggerShowContentMenu}
          />
        })}
      </tbody>
    </Table>
  );
}

export default SourceMenu