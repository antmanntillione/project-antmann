import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

/**
 * This component is used in the UploadDatasetMenu (in package dataset) to select type of a dataset and validate it.
 *
 */
export function DatasetType(props: { fieldName: string }) {
  const { t } = useTranslation();
  const validateSelectedValue = (datasetType: string) => {
    let error: string | undefined;
    if (datasetType === "" || typeof datasetType === "undefined") {
      error = t("formFields.datasetType.dataset_type_required");
    }
    return error;
  };
  //
  const [field, meta] = useField({
    name: props.fieldName,
    validate: validateSelectedValue,
  });

  const dropdownOptions = [
    { key: t("formFields.datasetType.select_dataset_type"), value: "" },
    {
      key: t("formFields.datasetType.options.timeseries"),
      value: "timeseries",
    },
    {
      key: t("formFields.datasetType.options.timeseries_georeferenced"),
      value: "timeseries_georeferenced",
    },
    { key: t("formFields.datasetType.options.image"), value: "image" },
  ];

  return (
    <Form.Group>
      <Form.Label>{t("datasets.dataset_type")}</Form.Label>
      <Form.Control
        {...field}
        as="select"
        data-testid="datasetType"
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
        required
      >
        {dropdownOptions.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {t("formFields.datasetType.dataset_type_required")}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
