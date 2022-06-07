import React from "react";
import Form from "react-bootstrap/Form";
import { Formik, useFormikContext } from "formik";
import { User, api_manager } from "../api";
import {
  ChangePasswordForm,
  ChangePasswordButton,
} from "./changePasswordComponents";

interface ChangePasswordFields {
  new_password: string;
  confirmed_new_password: string;
}

/**
 * This component is a subcomponent of the userSettings component which
 * provides the functionality to change the password of the current user.
 * @param props the current user
 */
export const ChangePasswordCard = (props: { user: User }) => {
  return <ChangePasswordCard.Formik user={props.user} />;
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * This component does all the set up needed to use formik
 * @param props the user whose password is changed
 */
ChangePasswordCard.Formik = (props: { user: User }) => {
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const handlePasswordChange = (values: ChangePasswordFields) => {
    api_manager
      .changePassword(props.user.id, values.new_password)
      .then(() => {
        setSuccess(true);
        setErrorMessage(undefined);
      })
      .catch((error) => {
        if (success === true) {
          setSuccess(false);
        }
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
      <ChangePasswordCard.Form errorMessage={errorMessage} success={success} />
    </Formik>
  );
};

/**
 * This is the actual form of the card. The rest is identical to the change password dialogue,
 * hence it has been outsourced to another component
 * @param props the potential error message and a booelan determining if the operation was sucessful or not
 */
ChangePasswordCard.Form = (props: {
  errorMessage?: string;
  success: boolean;
}) => {
  const { handleSubmit } = useFormikContext<ChangePasswordFields>();

  return (
    <Form onSubmit={handleSubmit}>
      <ChangePasswordForm />
      <ChangePasswordButton
        errorMessage={props.errorMessage}
        dialogue={false}
        success={props.success}
      />
    </Form>
  );
};

/* eslint-enable */
