import React from "react";
import Form from "react-bootstrap/Form";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

/**
 * This renders a input field for a list of feature names
 */

export function FeatureNames(props: { fieldName: string }) {
  //Use Field Array
  const { t } = useTranslation();
  const validateFeatureNames = (featureNames: string) => {
    let error: string | undefined;
    if (featureNames === "") {
      error = t("formFields.featureNames.featureNames_required");
    } else {
      const features = featureNames.split(",");
      for (const feat of features) {
        if (feat.length === 0) {
          error = t("formFields.featureNames.empty_feature");
        }
      }
    }
    return error;
  };

  const [field, meta] = useField({
    name: props.fieldName,
    validate: validateFeatureNames,
  });

  return (
    <Form.Group controlId="featureNamesField">
      <Form.Label>{t("formFields.featureNames.featureNames")}</Form.Label>
      <Form.Control
        {...field}
        data-testid="featureNames"
        required
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
        as="textarea"
        rows={3}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
}
