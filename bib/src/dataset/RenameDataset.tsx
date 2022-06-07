import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";
import { EditDialogue, useEditDialogue } from "../util";

import { api_manager } from "../api";
import { Formik, useFormikContext } from "formik";

import { PencilIcon } from "@primer/octicons-react";
import { DatasetName } from "../form_components";

interface RenameDatasetValues {
  datasetName: string;
}

interface RenameProps {
  onRename(): void;
  name: string;
  id: number;
}

/**
 * This component is a subcomponent of the datasetMenu component which provides a dialogue
 *  to rename a dataset as well as a corresponding button to open the dialogue.
 * @param props the name and the id of the dataset as well as a call-back function to the parent component
 * which is fired upon renaming the dataset
 */
export const RenameDataset = (props: RenameProps) => {
  const { t } = useTranslation();
  return (
    <EditDialogue
      title={t("datasets.rename_dialogue.title", { dataset: props.name })}
      body={t("datasets.rename_dialogue.body")}
    >
      <RenameDataset.OpenModalButton name={props.name} />
      <EditDialogue.Modal>
        <RenameDataset.Formik {...props} />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

RenameDataset.OpenModalButton = (props: { name: string }) => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();
  return (
    <Button
      data-testid={"rename" + props.name}
      variant="warning"
      title={t("datasets.rename_dialogue.tooltip_rename")}
      size="sm"
      onClick={handleShow}
    >
      <PencilIcon />
    </Button>
  );
};

RenameDataset.Formik = (props: RenameProps) => {
  const { setErrorMessage, handleClose } = useEditDialogue();

  const handleFormSubmit = (values: RenameDatasetValues) => {
    api_manager
      .setDatasetName(props.id, values.datasetName)
      .then((response) => {
        handleClose();
        props.onRename();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const initialValues: RenameDatasetValues = {
    datasetName: "",
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      <RenameDataset.Form />
    </Formik>
  );
};

RenameDataset.Form = () => {
  const { handleSubmit } = useFormikContext<RenameDatasetValues>();

  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <DatasetName fieldName="datasetName" />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        <RenameDataset.Buttons />
      </EditDialogue.Footer>
    </Form>
  );
};

RenameDataset.Buttons = () => {
  const { isValid, dirty } = useFormikContext<RenameDatasetValues>();

  const { t } = useTranslation();

  const { handleClose } = useEditDialogue();
  return (
    <>
      <Button variant="secondary" onClick={handleClose}>
        {t("datasets.rename_dialogue.close")}
      </Button>
      <Button
        data-testid="confirmRename"
        variant="warning"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("datasets.rename_dialogue.rename")}
      </Button>
    </>
  );
};

/* eslint-enable */
