import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

/**
 * This component is used in the UploadDatasetMenu (in package dataset) to upload a file and validate it.
 * @param props
 */
export function DatasetUpload(props: { fieldName: string }) {
  const { t } = useTranslation();
  const validateFile = (file: File | undefined) => {
    let error: string | undefined;
    if (!file) {
      error = t("formFields.datasetUpload.file_required");
    }
    return error;
  };

  const [field, meta, helpers] = useField({
    name: props.fieldName,
    validate: validateFile,
  });

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.currentTarget.files != null &&
      event.currentTarget.files.length > 0
    ) {
      helpers.setValue(event.currentTarget.files[0]);
    }
  };

  return (
    <Form.Group>
      <Form.File
        name={field.name}
        onInput={handleFileInput}
        accept=".csv, .h5, .hdf5, .he5, .json"
        label={t("formFields.datasetUpload.file")}
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
        feedback={meta.error}
      />
    </Form.Group>
  );
}
