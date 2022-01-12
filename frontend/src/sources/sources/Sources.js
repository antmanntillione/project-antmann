import './Sources.css';
import Source from './Source';
import Table from 'react-bootstrap/Table'

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
  return (
    <Table className="table">
      <tr>
        <th>Who</th>
        <th>When</th>
        <th>What</th>
        <th>Source URL</th>
        <th>Source Quality</th>
      </tr>
      {DUMMY_LIST.map(item => <Source 
        who={item.who}
        when={item.when}
        what={item.what}
        source_url={item.source_url}
        source_quality={item.source_quality}
      />)}

    </Table> 
  );
}

export default Sources;
