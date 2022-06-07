import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import { Formik, useFormikContext } from "formik";
import { User, api_manager, PrivilegeLevel } from "../api";
import { RiLockPasswordFill } from "react-icons/ri";
import { EditDialogue, useEditDialogue } from "../util";
import {
  ChangePasswordForm,
  ChangePasswordFields,
  ChangePasswordButton,
} from "./changePasswordComponents";

/**
 * This component is a subcomponent of the userManagement component which provides a dialogue
 *  to change the password of a selected user as well as a corresponding button to open the dialogue.
 * @param props the user whose password will be changed
 */
export const ChangePasswordDialogue = (props: { user: User }) => {
  const { t } = useTranslation();
  return (
    <EditDialogue
      title={t("settings.change_password.change_password_for", {
        user: props.user.username,
      })}
    >
      <ChangePasswordDialogue.OpenModalButton
        privLvl={props.user.privilege_level}
        username={props.user.username}
      />
      <EditDialogue.Modal>
        <ChangePasswordDialogue.Formik {...props} />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * This is the button which opens the dialogue
 */
ChangePasswordDialogue.OpenModalButton = (props: {
  privLvl: PrivilegeLevel;
  username: string;
}) => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();
  return (
    <Button
      data-testid={"cpw" + props.username}
      variant="warning"
      title={t("settings.change_password.change_password_for", {
        user: props.username,
      })}
      size="sm"
      onClick={handleShow}
    >
      <RiLockPasswordFill />
    </Button>
  );
};

/**
 * This component does all the set up needed to use formik
 * @param props the user whose password is supposed to be changed
 */
ChangePasswordDialogue.Formik = (props: { user: User }) => {
  const { setErrorMessage, handleClose } = useEditDialogue();

  const handlePasswordChange = (values: ChangePasswordFields) => {
    api_manager
      .changePassword(props.user.id, values.new_password)
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const initVals: ChangePasswordFields = {
    new_password: "",
    confirmed_new_password: "",
  };

  return (
    <Formik onSubmit={handlePasswordChange} initialValues={initVals}>
      <ChangePasswordDialogue.Form />
    </Formik>
  );
};

ChangePasswordDialogue.Form = () => {
  const { handleSubmit } = useFormikContext<ChangePasswordFields>();
  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <ChangePasswordForm />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        {/* success is always false here because no success message is shown in the dialogue*/}
        <ChangePasswordButton dialogue={true} success={false} />
      </EditDialogue.Footer>
    </Form>
  );
};

/* eslint-enable */
