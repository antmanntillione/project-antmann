import React from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { EnterName } from "../form_components";

export interface DeleteUserFields {
  username: string;
}

/**
 * This component supplies deleteUserDialogue and deleteUserCard
 *  with the form needed to delete a user.
 * @param props the username of the to be deleted user
 */
export const DeleteUserForm = (props: { username: string }) => {
  const { t } = useTranslation();

  return (
    <EnterName
      error_msg={t("settings.delete_user.username_wrong")}
      placeholder={t("settings.delete_user.enter_username")}
      label={t("settings.username")}
      should_equal={true}
      fieldName="username"
      confirmationValue={props.username}
    />
  );
};

/**
 * This component contains the submit button and an error message, if the request failed
 * @param props the error message, if it exists nand a boolean value,
 *  stating whether or not the component is used in a dialogue
 */
export const DeleteUserButton = (props: {
  errorMessage?: string;
  dialogue: boolean;
}) => {
  const { t } = useTranslation();
  const { dirty, isValid } = useFormikContext<DeleteUserFields>();
  return (
    <>
      <Button
        data-testid="deleteUsr"
        variant="danger"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("datasets.delete_dialogue.delete")}
      </Button>
      <Alert show={!!props.errorMessage && !props.dialogue} variant="danger">
        {props.errorMessage}
      </Alert>
    </>
  );
};
