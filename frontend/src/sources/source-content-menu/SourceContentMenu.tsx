import './SourceContentMenu.css';
import { SourceContentMenuInterface } from "../models/models"
import { isPropertySignature } from 'typescript';

const SourceContentMenu = (props: SourceContentMenuInterface) => {
  return (
    <>
      {props.data === null
        ? <div>Please select a source.</div>
        : <object type="text/html" data={props.data.url}
          style={{ width: '100%', height: '100%' }}></object>
      }

    </>
  );
}

export default SourceContentMenu;
