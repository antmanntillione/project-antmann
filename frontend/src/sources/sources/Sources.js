import './Sources.css';
import Source from './Source';
import Table from 'react-bootstrap/Table'
import axios from "axios"
import React, { useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner"

const DUMMY_LIST = [
  {
    who: "Dr. Ioannidis",
    when: 20201214,
    what: "Infection fatality rate of COVID-19 similair to Influenza",
    source_url: "https://apps.who.int/iris/handle/10665/340124?locale-attribute=de",
    source_quality: 5

  }, 
  {
    who: "Dr. Ioannidis",
    when: 20210125,
    what: "Infection fatality rate higher than Influenza",
    source_url: "https://apps.who.int/iris/handle/10665/340124?locale-attribute=de",
    source_quality: 2

  }
]


const Sources = () => {
  
  const [sources, setSources] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getSourcesHandler = async () => {
    setIsLoading(true)
    setError(false)

    await axios.get(
      "https://127.0.0.1:5000/sources/get"
    ).then(
      res => {
        setSources(res)
        setIsLoading(false)
        setError(false)
        console.log(res)
      }
    ).catch(
      err => {
        setError(true)
        setIsLoading(false)
        console.log(err)
      }
    )
  }

  return (
    <React.Fragment>
      <Button variant="outline-primary" onClick={getSourcesHandler}>Update Sources</Button>
      {error && (
        <div>Something went wrong with Loading the sources.</div>
      )}
      {isLoading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
      </Spinner>
      )}
      {!isLoading && sources && (
        <Table className="table">
          <tr>
            <th>Who</th>
            <th>When</th>
            <th>What</th>
            <th>Source URL</th>
            <th>Source Quality</th>
          </tr>
          {sources.map(item => <Source 
            who={item.who}
            when={item.when}
            what={item.what}
            source_url={item.source_url}
            source_quality={item.source_quality}
          />)}
        </Table> 
      )}
    </React.Fragment>
  );
}

export default Sources;
