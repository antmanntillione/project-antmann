import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";
import { EditDialogue, useEditDialogue } from "../util";

import { api_manager } from "../api";
import { Formik, useFormikContext } from "formik";

import { TrashIcon } from "@primer/octicons-react";
import { EnterName } from "../form_components";

interface DeleteDatasetValues {
  datasetName: string;
}

interface DeleteProps {
  onDelete(): void;
  name: string;
  id: number;
}

/**
 * This component is a subcomponent of the datasetMenu component which provides a dialogue
 *  to delete a dataset as well as a corresponding button to open the dialogue.
 * @param props the name and the id of the dataset as well as a call-back function to the parent component
 * which is fired upon deleting
 */
export const DeleteDataset = (props: DeleteProps) => {
  const { t } = useTranslation();
  return (
    <EditDialogue
      title={t("datasets.delete_dialogue.title", { dataset: props.name })}
      body={t("datasets.delete_dialogue.body")}
    >
      <DeleteDataset.OpenModalButton name={props.name} />
      <EditDialogue.Modal>
        <DeleteDataset.Formik {...props} />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

DeleteDataset.OpenModalButton = (props: { name: string }) => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();
  return (
    <Button
      data-testid={"delete" + props.name}
      variant="danger"
      title={t("datasets.delete_dialogue.tooltip_delete")}
      size="sm"
      onClick={handleShow}
    >
      <TrashIcon />
    </Button>
  );
};

DeleteDataset.Formik = (props: DeleteProps) => {
  const { setErrorMessage, handleClose } = useEditDialogue();

  const handleFormSubmit = () => {
    api_manager
      .deleteDataset(props.id)
      .then(() => {
        handleClose();
        props.onDelete();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        }
      });
  };

  const initialValues: DeleteDatasetValues = {
    datasetName: "",
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      <DeleteDataset.Form name={props.name} />
    </Formik>
  );
};

DeleteDataset.Form = (props: { name: string }) => {
  const { handleSubmit } = useFormikContext<DeleteDatasetValues>();
  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <EnterName
          error_msg={t(
            "datasets.delete_dialogue.confirmDatasetName.confirm_name_required"
          )}
          placeholder={t(
            "datasets.delete_dialogue.confirmDatasetName.enter_name"
          )}
          label={t("datasets.delete_dialogue.confirmDatasetName.enter_name")}
          should_equal={true}
          fieldName="datasetName"
          confirmationValue={props.name}
        />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        <DeleteDataset.Buttons />
      </EditDialogue.Footer>
    </Form>
  );
};

DeleteDataset.Buttons = () => {
  const { isValid, dirty } = useFormikContext<DeleteDatasetValues>();

  const { t } = useTranslation();

  const { handleClose } = useEditDialogue();
  return (
    <>
      <Button variant="secondary" onClick={handleClose}>
        {t("datasets.delete_dialogue.close")}
      </Button>
      <Button
        variant="danger"
        data-testid="confirmDeletion"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("datasets.delete_dialogue.delete")}
      </Button>
    </>
  );
};

/* eslint-enable */
