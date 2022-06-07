import React from "react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

type ErrorMessage = string | undefined;

interface EditDialogueContextInterface {
  setErrorMessage: (message: ErrorMessage) => void;
  handleClose: () => void;
  handleShow: () => void;
  show: boolean;
  errorMessage: ErrorMessage;
  title: string;
  body?: string;
}

const EditDialogueContext = React.createContext<EditDialogueContextInterface>({
  setErrorMessage() {
    //Do nothing
  },
  handleClose() {
    //Do nothing
  },
  handleShow() {
    //Do nothing
  },
  show: false,
  errorMessage: undefined,
  title: "",
});

export interface EditDialogueProps {
  title: string;
  body?: string;
}

/**
 * Editdialogue is used as a template for a dialogue for example in RenameDataset (in package dataset)
 * @param props the components in the edit dialogue
 */
export const EditDialogue = (
  props: React.PropsWithChildren<EditDialogueProps>
) => {
  const [show, setShow] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );

  const handleClose = () => {
    setShow(false);
    setErrorMessage(undefined);
  };

  const handleShow = () => setShow(true);

  return (
    <EditDialogueContext.Provider
      value={{
        setErrorMessage: setErrorMessage,
        handleClose: handleClose,
        handleShow: handleShow,
        show: show,
        errorMessage: errorMessage,
        title: props.title,
        body: props.body,
      }}
    >
      {props.children}
    </EditDialogueContext.Provider>
  );
};

export function useEditDialogue(): EditDialogueContextInterface {
  return React.useContext(EditDialogueContext);
}

//The react plugin cannot handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

EditDialogue.Modal = (props: { children?: React.ReactNode }) => {
  const { show, handleClose, title } = useEditDialogue();

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {props.children}
    </Modal>
  );
};

EditDialogue.Body = (props: { children?: React.ReactNode }) => {
  const { errorMessage, body } = useEditDialogue();
  return (
    <Modal.Body>
      <Alert show={!!errorMessage} variant="danger">
        {errorMessage}
      </Alert>
      {body}
      {props.children}
    </Modal.Body>
  );
};

EditDialogue.Footer = (props: { children?: React.ReactNode }) => {
  return <Modal.Footer>{props.children}</Modal.Footer>;
};

/* eslint-enable */
