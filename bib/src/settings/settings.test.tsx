import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  findByTestId,
} from "@testing-library/react";
import { UserManagement } from "./userManagement";
import { UserSettings } from "./userSettings";
import i18n from "../i18n/config";
import { api_manager } from "../api/";
import { User } from "../api/api_types";
import { I18nextProvider } from "react-i18next";

let mock_users: Array<User> = [
  {
    username: "PaulMuller",
    id: 43264635,
    language: "german",
    privilege_level: "USER",
  },
  {
    username: "Alice_w2065",
    id: 43097269,
    language: "english",
    privilege_level: "ADMIN",
  },
];

const testUser: User = {
  username: "aa",
  id: 1,
  privilege_level: "ADMIN",
  language: "english",
};

const mockGetUsers = (api_manager.getUsers = jest.fn());
const mockAddUser = (api_manager.addUser = jest.fn());
const mockChangePW = (api_manager.changePassword = jest.fn());
const mockDeleteUser = (api_manager.deleteUser = jest.fn());
it("User management", async () => {
  //Check if rendering works
  mockGetUsers.mockResolvedValueOnce(mock_users);
  mockAddUser.mockResolvedValueOnce(12345678);
  mockChangePW.mockResolvedValueOnce(null);
  mockDeleteUser.mockResolvedValueOnce(null);
  render(
    <I18nextProvider i18n={i18n}>
      <UserManagement userid={123} />
    </I18nextProvider>
  );
  await waitFor(() => expect(mockGetUsers).toHaveBeenCalledTimes(1));
  //Check if correct contents are shown on screen
  await screen.findByText("Username");
  await screen.findByText("ID");
  await screen.findByText("Privilege level");
  await screen.findByText("PaulMuller");
  await screen.findByText("Alice_w2065");

  //check if opening add user dialogue works
  const addUserDialogueOpen = await screen.findByText("Add user");
  fireEvent.click(addUserDialogueOpen);
  const submitButton = await screen.findByTestId("addUsr");
  expect(submitButton).toBeDisabled();
  const username = await screen.findByTestId("username");
  fireEvent.change(username, { target: { value: "EllaSux" } });
  mock_users.push({
    username: "EllaSux",
    id: 43264635,
    language: "german",
    privilege_level: "USER",
  });
  mockGetUsers.mockResolvedValueOnce(mock_users.slice());
  fireEvent.click(submitButton);
  await waitFor(() => expect(mockGetUsers).toHaveBeenCalledTimes(1));
  const closeAddUserButtons = await screen.findAllByText("Close");
  fireEvent.click(closeAddUserButtons[0]);

  //check if change password dialogue works
  const changePasswordDialogueOpen = await screen.findByTestId("cpwEllaSux");
  fireEvent.click(changePasswordDialogueOpen);
  const newPW = await screen.findByTestId("changePwNewPw");
  const confirmPW = await screen.findByTestId("changePwConfirmPw");
  const changePwButton = await screen.findByTestId("cngPW");
  expect(changePwButton).toBeDisabled();
  fireEvent.change(newPW, { target: { value: "123456789" } });
  fireEvent.change(confirmPW, { target: { value: "123456789" } });
  fireEvent.click(changePwButton);

  //check if delete user dialogue works
  const deleteUserDialogueOpen = await screen.findByTestId("deleteEllaSux");
  fireEvent.click(deleteUserDialogueOpen);
  const name = screen.getByRole("textbox", { name: "" });
  const deleteUserButton = await screen.findByTestId("deleteUsr");
  expect(deleteUserButton).toBeDisabled();
  fireEvent.change(name, { target: { value: "EllaSux" } });
  mock_users.pop();
  mockGetUsers.mockResolvedValueOnce(mock_users.slice());
  fireEvent.click(deleteUserButton);
  await waitFor(() => expect(mockGetUsers).toHaveBeenCalled());
});

const mockChangeLng = (api_manager.changeUserLanguage = jest.fn());
it("User settings", async () => {
  mockChangeLng.mockResolvedValue(null);
  mockChangePW.mockResolvedValueOnce(null);
  mockDeleteUser.mockResolvedValueOnce(null);
  //Check if rendering works
  render(
    <I18nextProvider i18n={i18n}>
      <UserSettings user={testUser} />
    </I18nextProvider>
  );
  //Check if correct contents are shown on screen
  expect(await screen.findByTestId("changePW")).toHaveTextContent(
    "Change password"
  );
  await screen.findByText("Delete user");

  //check if changing user language works
  const cngLangCard = await screen.findByText("Change language");
  fireEvent.click(cngLangCard);
  const langDe = await screen.findByTestId("langDE");
  fireEvent.click(langDe);
  await waitFor(() => expect(mockChangeLng).toHaveBeenCalled());
  expect(await screen.findByTestId("changePW")).toHaveTextContent(
    "Passwort ändern"
  );
  const langEn = await screen.findByTestId("langEN");
  fireEvent.click(langEn);
  await waitFor(() => expect(mockChangeLng).toHaveBeenCalled());
  fireEvent.click(cngLangCard);

  //check if changing password works
  const cngPwCard = await screen.findByTestId("changePW");
  fireEvent.click(cngPwCard);
  const newPW = await screen.findByTestId("changePwNewPw");
  const confirmPW = await screen.findByTestId("changePwConfirmPw");
  const changePwButton = await screen.findByTestId("cngPW");
  expect(changePwButton).toBeDisabled();
  fireEvent.change(newPW, { target: { value: "123456789" } });
  fireEvent.change(confirmPW, { target: { value: "123456789" } });
  fireEvent.click(changePwButton);
  await waitFor(() => expect(mockChangePW).toHaveBeenCalled());
  fireEvent.click(cngPwCard);

  //check if deleting user works
  const deleteUserCard = await screen.findByTestId("deleteUSR");
  fireEvent.click(deleteUserCard);
  const name = screen.getAllByRole("textbox", { name: "" });
  const deleteUserButton = await screen.findByTestId("deleteUsr");
  expect(deleteUserButton).toBeDisabled();
  fireEvent.change(name[2], { target: { value: "aa" } });
  fireEvent.click(deleteUserButton);
  await waitFor(() => expect(mockDeleteUser).toHaveBeenCalled());
});
