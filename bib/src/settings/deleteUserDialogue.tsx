import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, useFormikContext } from "formik";
import { api_manager, PrivilegeLevel, User } from "../api";
import Button from "react-bootstrap/Button";
import { TrashIcon } from "@primer/octicons-react";
import Form from "react-bootstrap/Form";
import { EditDialogue, useEditDialogue } from "../util";
import {
  DeleteUserFields,
  DeleteUserForm,
  DeleteUserButton,
} from "./deleteUserComponents";

/**
 * This component is a subcomponent of the userManagement component which provides a dialogue
 *  to delete a selected user as well as a corresponding button to open the dialogue.
 * @param props the user to be deleted and a call-back to the parent component
 * which is fired upon user deletion
 */
export const DeleteUserDialogue = (props: { user: User; onDelete(): void }) => {
  const { t } = useTranslation();

  return (
    <EditDialogue
      title={t("settings.delete_user.delete_user", {
        user: props.user.username,
      })}
    >
      <DeleteUserDialogue.OpenModalButton
        privLvl={props.user.privilege_level}
        username={props.user.username}
      />
      <EditDialogue.Modal>
        <DeleteUserDialogue.Formik
          user={props.user}
          onDelete={props.onDelete}
        />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * This is the button which opens the dialogue
 */
DeleteUserDialogue.OpenModalButton = (props: {
  privLvl: PrivilegeLevel;
  username: string;
}) => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();

  return (
    <Button
      data-testid={"delete" + props.username}
      variant="danger"
      title={t("settings.delete_user.delete_user", { user: props.username })}
      size="sm"
      onClick={handleShow}
    >
      <TrashIcon />
    </Button>
  );
};

/**
 * This component does all the set up needed to use formik
 * @param props a call back handler and the user who is deleted
 */
DeleteUserDialogue.Formik = (props: { user: User; onDelete(): void }) => {
  const { setErrorMessage, handleClose } = useEditDialogue();
  const { t } = useTranslation();

  const handleUserDeletion = () => {
    api_manager
      .deleteUser(props.user.id)
      .then(() => {
        handleClose();
        props.onDelete();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const initVal: DeleteUserFields = {
    username: "",
  };

  return (
    <Formik onSubmit={handleUserDeletion} initialValues={initVal}>
      <DeleteUserDialogue.Form username={props.user.username} />
    </Formik>
  );
};

DeleteUserDialogue.Form = (props: { username: string }) => {
  const { handleSubmit } = useFormikContext<DeleteUserFields>();
  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <DeleteUserForm username={props.username} />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        <DeleteUserButton dialogue={true} />
      </EditDialogue.Footer>
    </Form>
  );
};

/* eslint-enable */
