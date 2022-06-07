import React from "react";
import { useTranslation } from "react-i18next";
import { api_manager, User } from "../api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { AddUserDialogue } from "./addUserDialogue";
import { DeleteUserDialogue } from "./deleteUserDialogue";
import { ChangePasswordDialogue } from "./changePasswordDialogue";

/**
 * UserManagement is the main component of our menu for managing all users and
 * it is only accessible for privileged users (i.e. admins).
 * Our user management menu allows adding a user, deleting a user and changing a user's password,
 * hence this component consists of the respective subcomponents to enable these features.
 */
export const UserManagement = (props: { userid?: number }) => {
  const { t } = useTranslation();
  const [users, setUsers] = React.useState<Array<User>>([]);

  const loadUsers = () => {
    api_manager
      .getUsers()
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        alert(error);
      });
  };

  React.useEffect(loadUsers, []);

  if (props.userid === undefined) {
    return <></>;
  }

  return (
    <Container fluid>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("settings.username")}</th>
            <th>{t("settings.id")}</th>
            <th>{t("settings.language")}</th>
            <th>{t("settings.privilege_level")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User, index: number) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.id}</td>
              <td>{t("settings." + user.language.toLowerCase())}</td>
              <td>{t("settings." + user.privilege_level.toLowerCase())}</td>
              {user.id !== props.userid && (
                <>
                  <td>
                    <ChangePasswordDialogue
                      user={user}
                    ></ChangePasswordDialogue>
                  </td>
                  <td>
                    <DeleteUserDialogue user={user} onDelete={loadUsers} />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <AddUserDialogue onAdd={loadUsers}></AddUserDialogue>
    </Container>
  );
};
