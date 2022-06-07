import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { api_manager, User } from "./api";
import { LoginMenu, AuthContext, authContext } from "./login";

const mockUser: User = {
  username: "Alice_w2065",
  id: 43097269,
  language: "english",
  privilege_level: "ADMIN",
};
const mockUserContext: AuthContext = {
  user: mockUser,
  setUser: jest.fn(),
};

jest.mock("./api");

const mock_api = api_manager as jest.Mocked<typeof api_manager>;

test("login component renders", async () => {
  render(
    <authContext.Provider value={mockUserContext}>
      <LoginMenu />
    </authContext.Provider>
  );

  await screen.findByText("Arkansas - Login");
  const submitButton = screen.getByRole("button", { name: "Login" });

  const username = screen.getByRole("textbox", { name: "Username" });

  //https://github.com/testing-library/dom-testing-library/issues/500
  const password = screen.getByLabelText("Password");

  expect(submitButton).toBeDisabled();
  fireEvent.change(username, { target: { value: "EllaSux" } });
  expect(submitButton).toBeDisabled();
  fireEvent.change(password, { target: { value: "123" } });
  expect(submitButton).toBeEnabled();

  mock_api.login.mockImplementationOnce(async () => {
    throw new Error("The username or password is wrong.");
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mock_api.login).toBeCalledWith("EllaSux", "123");
  });

  await screen.findByText("The username or password is wrong.");

  mock_api.login.mockResolvedValueOnce(mockUser);
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mock_api.login).toBeCalled();
  });

  expect(mockUserContext.setUser).toBeCalledWith(mockUser);
});
