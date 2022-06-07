import React from "react";
import { User, api_manager, Language } from "../api";
import i18n from "../i18n/config";
import Button from "react-bootstrap/Button";
import UnitedKingdom from "../resources/united-kingdom.svg";
import Germany from "../resources/germany.svg";
import Alert from "react-bootstrap/Alert";

/**
 * This component is a subcomponent of the userSettings component which
 * provides the functionality to change the language of the current user.
 * @param props the current user
 */
export const ChangeLanguageDialogue = (props: { user: User }) => {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const changeLanguage = (lng: Language) => {
    api_manager
      .changeUserLanguage(props.user.id, lng)
      .then(() => {
        i18n.changeLanguage(lng);
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };
  return (
    <div>
      <Button
        size="sm"
        data-testid="langEN"
        onClick={() => changeLanguage("english")}
      >
        <img alt="English" src={UnitedKingdom} width="40" height="40" />
      </Button>
      <Button
        size="sm"
        data-testid="langDE"
        onClick={() => changeLanguage("german")}
      >
        <img alt="German" src={Germany} width="40" height="40" />
      </Button>
      <Alert show={!!errorMessage} variant="danger">
        {errorMessage}
      </Alert>
    </div>
  );
};
