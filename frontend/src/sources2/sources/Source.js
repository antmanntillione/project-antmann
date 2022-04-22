import './Source.css';


const Source = props => {
  return (
    <tr>
      <td>{props.who}</td>
      <td>{props.when}</td>
      <td>{props.what}</td>
      <td><a href={props.source_url} target="_blank" className="link">Link</a></td>
      <td>{props.source_quality}</td>
  </tr>
  );
}

export default Source;
