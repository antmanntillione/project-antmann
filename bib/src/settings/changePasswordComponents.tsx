import React from "react";
import { useFormikContext, useField } from "formik";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export interface ChangePasswordFields {
  new_password: string;
  confirmed_new_password: string;
}

/**
 * This component supplies changePasswordDialogue and changePasswordCard
 *  with the form needed to change a user's password.
 */
export const ChangePasswordForm = () => {
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: "30rem" }}>
      <Form.Group>
        <Form.Label>{t("settings.change_password.new_password")}</Form.Label>
        <Form.Row>
          <ChangePasswordForm.NewPW />
        </Form.Row>
      </Form.Group>
      <Form.Group>
        <Form.Label>
          {t("settings.change_password.confirm_password")}
        </Form.Label>
        <Form.Row>
          <ChangePasswordForm.ConfirmPW />
        </Form.Row>
      </Form.Group>
    </div>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * Contains the field for the new password
 */
ChangePasswordForm.NewPW = () => {
  const { t } = useTranslation();
  const validatePassword = (new_password: string) => {
    let error: string | undefined;
    if (!(new_password.length > 7 && new_password.length < 201)) {
      error = t("settings.change_password.incorrect_length");
    }
    return error;
  };

  const [field, meta] = useField({
    name: "new_password",
    validate: validatePassword,
  });

  return (
    <>
      <Form.Control
        {...field}
        data-testid="changePwNewPw"
        placeholder={t("settings.change_password.enter_new_password")}
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </>
  );
};

/**
 * Contains a field to confirm the new password
 */
ChangePasswordForm.ConfirmPW = () => {
  const { values, errors } = useFormikContext<ChangePasswordFields>();
  const { t } = useTranslation();
  const validateConfirmedPassword = (new_password: string) => {
    let error: string | undefined;
    if (!(values.new_password === new_password)) {
      error = t("settings.change_password.no_match");
    } else if (errors.new_password) {
      error = t("settings.change_password.incorrect_length");
    }
    return error;
  };

  const [field, meta] = useField({
    name: "confirmed_new_password",
    validate: validateConfirmedPassword,
  });

  return (
    <>
      <Form.Control
        {...field}
        data-testid="changePwConfirmPw"
        placeholder={t("settings.change_password.confirm_new_password")}
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </>
  );
};

/* eslint-enable */

/**
 * Contains the button(s) to submit the new password or to close the dialogue,
 *  if the component is used in a dialogue
 * @param props the potential error message, the dialogue and a boolean
 *  stating whether the operation was successful or not
 */
export const ChangePasswordButton = (props: {
  errorMessage?: string;
  dialogue: boolean;
  success: boolean;
}) => {
  const { isValid, dirty } = useFormikContext<ChangePasswordFields>();

  const { t } = useTranslation();
  return (
    <>
      <Button
        data-testid="cngPW"
        variant="warning"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("settings.change_password.change_password")}
      </Button>
      <Alert show={!!props.errorMessage && !props.dialogue} variant="danger">
        {props.errorMessage}
      </Alert>
      <Alert show={props.success === true && !props.dialogue} variant="success">
        {t("settings.change_password.success")}
      </Alert>
    </>
  );
};
