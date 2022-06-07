import React from "react";
import { useTranslation } from "react-i18next";
import { EnterName } from "./enterName";

/**
 * This renders an input field for a datasetName and accepts any non-empty input
 */
export function DatasetName(props: { fieldName: string }) {
  const { t } = useTranslation();
  return (
    <EnterName
      {...props}
      label={t("formFields.datasetName.dataset_name")}
      placeholder={t("formFields.datasetName.enter_name")}
      error_msg={t("formFields.datasetName.dataset_name_required")}
      confirmationValue=""
      should_equal={false}
    />
  );
}
