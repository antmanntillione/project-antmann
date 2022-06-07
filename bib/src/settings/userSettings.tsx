import React from "react";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { User } from "../api";
import { ChangePasswordCard } from "./changePasswordCard";
import { ChangeLanguageDialogue } from "./changeLanguageCard";
import { DeleteUserCard } from "./deleteUserCard";

/**
 * UserSettings is the main component of our menu for editing the settings of the current user.
 * Our settings menu allows the user to change the tools language, to change his password and to delete his account,
 *  hence this component consists of the respective subcomponents to enable these features.
 * @param props the currently active user
 */
export const UserSettings = (props: { user?: User }) => {
  const { t } = useTranslation();

  if (props.user === undefined) {
    return <></>;
  }

  return (
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle
            as={Button}
            data-testid="changePW"
            variant="link"
            eventKey="0"
          >
            {t("settings.change_password.change_password")}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ChangePasswordCard user={props.user} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle
            as={Button}
            data-testid="changeLang"
            variant="link"
            eventKey="1"
          >
            {t("settings.change_language")}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <ChangeLanguageDialogue user={props.user} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle
            as={Button}
            data-testid="deleteUSR"
            variant="link"
            eventKey="2"
          >
            {t("settings.delete_user.delete_user")}
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <DeleteUserCard user={props.user} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
