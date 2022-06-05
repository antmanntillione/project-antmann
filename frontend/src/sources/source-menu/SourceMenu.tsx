import "./SourceMenu.css"

import Table from "react-bootstrap/Table"
import SourceItem from "./SourceItem"
import { useState } from "react"

interface SourceMenuInterface {
  data: any
}

const SourceMenu = (props: SourceMenuInterface) => {

  let currentSources = props.data

  //Note the key prop in SourceItem (seems to be necessary. key prop is a special prop which doesnt have to be specified in the SourceItem Interface)
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Index</th>
          <th>Title</th>
          <th>URL</th>
          <th>Author</th>
          <th>Publisher</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currentSources.map((item: any, index: any) => {
          return <SourceItem
            key={index}
            id={item.id}
            title={item.title}
            url={item.url}
            author={item.author}
            publisher={item.publisher}
            accordion_index={index}
          />
        })}
      </tbody>
    </Table>
  );
}

export default SourceMenu