import './SourceContentMenu.css';
import { SourceContentMenuInterface } from "../models/models"
import { Button, Card, Container, Row, Col } from "react-bootstrap"

const SourceContentMenu = (props: SourceContentMenuInterface) => {
  return (
    <>

      {props.data === null
        ? <div>Please select a source.</div>
        :
        <>
          <Button href={props.data.meta_information.url} target="_blank" variant="light">
            Open site in a new tab
          </Button>
          <object type="text/html" data={props.data.meta_information.url}
            className={"webframe"}></object>
        </>
      }
    </>
  );
}

export default SourceContentMenu;
