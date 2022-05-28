import "./SourceMenu.css"

import Accordion from "react-bootstrap/Accordion"
import Table from "react-bootstrap/Table"

import SourceItem from "./SourceItem"

let DUMMY_DATA = [
  {
    id: 1,
    title: "Title1",
    url: "URL1",
    author: "author1",
    publisher: "publisher1"
  },
  {
    id: 2,
    title: "Title2",
    url: "URL2",
    author: "author2",
    publisher: "publisher2"
  },
  {
    id: 3,
    title: "Title3",
    url: "URL3",
    author: "author3",
    publisher: "publisher3"
  }
]

const getSources = () => {
  return DUMMY_DATA
}

const SourceMenu = (props: any) => {


  /*
    <Accordion>
              {DUMMY_DATA.map(item => {
                <SourceItem />
              })}
            </Accordion>

                <Accordion defaultActiveKey="">
          
        </Accordion>
  */

  let currentSources = getSources()

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
        {currentSources.map((item, index) => {
          return <SourceItem
            key={item.id}
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