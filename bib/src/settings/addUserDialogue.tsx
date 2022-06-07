import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { Language, PrivilegeLevel } from "../api/api_types";
import { Formik, useFormikContext, useField } from "formik";
import { api_manager } from "../api";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { EditDialogue, useEditDialogue } from "../util";
import { CopyIcon } from "@primer/octicons-react";
import ClipboardJS from "clipboard";
import InputGroup from "react-bootstrap/InputGroup";

interface AddUserFields {
  username: string;
  language: string;
  privilege_level: string;
}

new ClipboardJS(".btn");

/**
 * This component is a subcomponent of the userManagement component which provides a dialogue
 *  to delete a selected user as well as a corresponding button to open the dialogue.
 * @param props the user to be deleted and a call-back to the parent component
 * which is fired upon user deletion
 */
export const AddUserDialogue = (props: { onAdd(): void }) => {
  const { t } = useTranslation();
  return (
    <EditDialogue title={t("settings.add_user.add_user_description")}>
      <AddUserDialogue.OpenModalButton />
      <EditDialogue.Modal>
        <AddUserDialogue.Formik {...props} />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

/**
 * This is the button which opens the dialogue
 */
AddUserDialogue.OpenModalButton = () => {
  const { t } = useTranslation();
  const { handleShow } = useEditDialogue();
  return (
    <Button
      variant="primary"
      title={t("settings.add_user.add_user_description")}
      onClick={handleShow}
    >
      {t("settings.add_user.add_user")}
    </Button>
  );
};

/**
 * This component does all the set up needed to use formik
 * @param props a call back handler
 */
AddUserDialogue.Formik = (props: { onAdd(): void }) => {
  const { t } = useTranslation();
  const { setErrorMessage } = useEditDialogue();
  const [oneTimePW, setOneTimePW] = React.useState<string>("");

  const handleUserAddition = (values: AddUserFields) => {
    let privLvl: PrivilegeLevel = "USER";
    let lang: Language = "german";
    if (t("settings.english") === values.language) {
      lang = "english";
    }
    if (t("settings.admin") === values.privilege_level) {
      privLvl = "ADMIN";
    }

    api_manager
      .addUser(values.username, privLvl, lang)
      .then((response) => {
        props.onAdd();
        setErrorMessage(undefined);
        setOneTimePW(response.one_time_password);
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const initVal: AddUserFields = {
    username: "",
    language: t("settings.add_user.german"),
    privilege_level: t("settings.add_user.user"),
  };

  return (
    <Formik onSubmit={handleUserAddition} initialValues={initVal}>
      <AddUserDialogue.Form oneTimePW={oneTimePW} />
    </Formik>
  );
};

AddUserDialogue.Form = (props: { oneTimePW: string }) => {
  const { handleSubmit } = useFormikContext<AddUserFields>();

  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <AddUserDialogue.Body />
        <AddUserDialogue.ControlSelects />
        <AddUserDialogue.OneTimePW oneTimePW={props.oneTimePW} />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        <AddUserDialogue.Buttons />
      </EditDialogue.Footer>
    </Form>
  );
};

/**
 * This component is used for the username text field
 */
AddUserDialogue.Body = () => {
  const { t } = useTranslation();

  const validateUsername = (username: string) => {
    let error: string | undefined;
    if (username.length < 4 || username.length > 20) {
      error = t("settings.add_user.username_wrong");
    }
    return error;
  };

  const [field, meta] = useField({
    name: "username",
    validate: validateUsername,
  });

  return (
    <Form.Group>
      <Form.Label>{t("settings.add_user.username")}</Form.Label>
      <Form.Control
        {...field}
        type="text"
        data-testid="username"
        isValid={meta.touched && !meta.error}
        isInvalid={meta.touched && !!meta.error}
        placeholder={t("settings.add_user.enter_username")}
      />
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

/**
 * This component contains the fields to select the user language and the privilege level
 */
AddUserDialogue.ControlSelects = () => {
  const { handleChange, values } = useFormikContext<AddUserFields>();
  const { t } = useTranslation();

  return (
    <>
      <Form.Group>
        <Form.Label>{t("settings.privilege_level")}</Form.Label>
        <Form.Control
          as="select"
          name="privilege_level"
          id="privilege_level"
          onChange={handleChange}
          value={values.privilege_level}
        >
          <option>{t("settings.user")}</option>
          <option>{t("settings.admin")}</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>{t("settings.add_user.user_language")}</Form.Label>
        <Form.Control
          as="select"
          name="language"
          id="language"
          onChange={handleChange}
          value={values.language}
        >
          <option>{t("settings.german")}</option>
          <option>{t("settings.english")}</option>
        </Form.Control>
      </Form.Group>
    </>
  );
};

/**
 * This component renders the one time password. It is only shown after a user has been created
 * @param props The new user's one time password
 */
AddUserDialogue.OneTimePW = (props: { oneTimePW: string }) => {
  const { t } = useTranslation();
  if (props.oneTimePW === "") {
    return <></>;
  } else {
    return (
      <Form.Group>
        <Form.Label>{t("settings.add_user.one_time_password")}</Form.Label>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control type="text" value={props.oneTimePW} readOnly />
            <InputGroup.Append>
              <Button data-clipboard-text={props.oneTimePW}>
                <CopyIcon />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Form.Group>
    );
  }
};

/**
 * This component contains the buttons in the footer of the dialogue
 */
AddUserDialogue.Buttons = () => {
  const { t } = useTranslation();
  const { isValid, dirty } = useFormikContext<AddUserFields>();
  const { handleClose } = useEditDialogue();
  return (
    <>
      <Button variant="secondary" onClick={handleClose}>
        {t("datasets.delete_dialogue.close")}
      </Button>
      <Button
        data-testid="addUsr"
        variant="primary"
        type="submit"
        disabled={!dirty || !isValid}
      >
        {t("settings.add_user.add_user")}
      </Button>
    </>
  );
};

/* eslint-enable */
