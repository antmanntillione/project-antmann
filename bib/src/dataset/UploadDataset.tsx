import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";
import { EditDialogue, useEditDialogue } from "../util";

import { api_manager } from "../api";
import { Formik, useFormikContext } from "formik";
import {
  FeatureNames,
  DatasetName,
  DatasetUpload,
  DatasetType,
} from "../form_components";

interface UploadFormValues {
  datasetName: string;
  datasetType: string;
  feature_names: string;
  file: File | undefined;
}

/**
 * This component is a subcomponent of the datasetMenu component which provides a dialogue
 *  to upload a new dataset as well as a corresponding button to open the dialogue.
 * @param props a call-back function to the parent component which is fired
 *  upon uploading the new dataset
 */
export const UploadMenu = (props: { onUpload(): void }) => {
  const { t } = useTranslation();
  return (
    <EditDialogue
      title={t("datasets.upload_dialogue.title")}
      body={t("datasets.upload_dialogue.body")}
    >
      <UploadMenu.OpenModalButton />
      <EditDialogue.Modal>
        <UploadMenu.Formik onUpload={props.onUpload}>
          <EditDialogue.Body>
            <DatasetName fieldName="datasetName" />
            <DatasetType fieldName="datasetType" />
            <FeatureNames fieldName="feature_names" />
            <DatasetUpload fieldName="file" />
          </EditDialogue.Body>
          <EditDialogue.Footer>
            <UploadMenu.Buttons />
          </EditDialogue.Footer>
        </UploadMenu.Formik>
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

UploadMenu.OpenModalButton = () => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();
  return (
    <Button
      variant="primary"
      data-testid="uploadButton"
      title={t("datasets.upload_dialogue.tooltip_upload")}
      onClick={handleShow}
    >
      {t("datasets.upload_dialogue.button_upload")}
    </Button>
  );
};

interface UploadDialogueFormProps {
  onUpload: () => void;
}

UploadMenu.Formik = (
  props: React.PropsWithChildren<UploadDialogueFormProps>
) => {
  const { setErrorMessage, handleClose } = useEditDialogue();

  const handleFormSubmit = (values: UploadFormValues) => {
    if (!values.file) {
      throw new Error("File is null despite validation");
    }

    api_manager
      .addDataset(
        values.file,
        values.datasetName,
        values.datasetType,
        values.feature_names.split(",").map((feature) => feature.trim())
      )
      .then((resp) => {
        handleClose();
        props.onUpload();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const initialValues: UploadFormValues = {
    datasetName: "",
    feature_names: "",
    datasetType: "",
    file: undefined,
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      <UploadMenu.Form>{props.children}</UploadMenu.Form>
    </Formik>
  );
};

UploadMenu.Form = (props: React.PropsWithChildren<unknown>) => {
  const { handleSubmit } = useFormikContext<UploadFormValues>();

  return <Form onSubmit={handleSubmit}>{props.children}</Form>;
};

UploadMenu.Buttons = () => {
  const { isValid, dirty } = useFormikContext<UploadFormValues>();

  const { t } = useTranslation();

  const { handleClose } = useEditDialogue();
  return (
    <>
      <Button
        variant="secondary"
        data-testid="closeButton"
        onClick={handleClose}
      >
        {t("datasets.upload_dialogue.close")}
      </Button>
      <Button
        variant="primary"
        data-testid="confirmUpload"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("datasets.upload_dialogue.upload")}
      </Button>
    </>
  );
};

/* eslint-enable */
