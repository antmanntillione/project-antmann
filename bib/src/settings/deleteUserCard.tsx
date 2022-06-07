import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, useFormikContext } from "formik";
import { api_manager, User } from "../api";
import Form from "react-bootstrap/Form";
import {
  DeleteUserFields,
  DeleteUserForm,
  DeleteUserButton,
} from "./deleteUserComponents";

/**
 * This component is a subcomponent of the userSettings component which
 * provides the functionality to delete the current user.
 * @param props the current and to be deleted user
 */
export const DeleteUserCard = (props: { user: User }) => {
  return <DeleteUserCard.Formik {...props} />;
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * This component does all the set up needed to use formik
 * @param props the user whose password is changed
 */
DeleteUserCard.Formik = (props: { user: User }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );

  const handleUserDeletion = () => {
    api_manager
      .deleteUser(props.user.id)
      .then(() => {
        setErrorMessage(undefined);
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
      <DeleteUserCard.Form
        username={props.user.username}
        errorMessage={errorMessage}
      />
    </Formik>
  );
};

/**
 * This is the acutal form where the user enters his username to confirm the deletion.
 *  Since this part is identical to the deleteUserDialogue-Form, it has been outsourced into another component
 * @param props the user's username and an error message if the operation failed
 */
DeleteUserCard.Form = (props: {
  username: string;
  errorMessage: string | undefined;
}) => {
  const { handleSubmit } = useFormikContext<DeleteUserFields>();
  return (
    <Form onSubmit={handleSubmit}>
      <DeleteUserForm username={props.username} />
      <DeleteUserButton dialogue={true} errorMessage={props.errorMessage} />
    </Form>
  );
};

/* eslint-enable */
