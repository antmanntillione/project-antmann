import React from "react";
import { Redirect, Route, RouteProps, useHistory } from "react-router-dom";
import { User, api_manager } from "./api";

import { useTranslation } from "react-i18next";

import Form from "react-bootstrap/Form";

import { Formik } from "formik";
import { ErrorAlert, GradientBackground } from "./util";

import Button from "react-bootstrap/Button";
import i18n from "./i18n/config";

export interface AuthContext {
  user: User | undefined;
  setUser(user: User | undefined): void;
}

export const authContext = React.createContext<AuthContext>({
  user: undefined,
  setUser: (user: User | undefined) => {
    return;
  },
});

function clearLoginStore() {
  localStorage.removeItem("user");
}

function loadLoginStore(): User | undefined {
  const storedSession = localStorage.getItem("user");
  if (storedSession) {
    const parsedUser: User = JSON.parse(storedSession);
    return parsedUser;
  }
  return undefined;
}

function saveLoginStore(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function handleLogout() {
  clearLoginStore();
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

export function ProvideAuth(props: { children: React.ReactNode }) {
  const loadedUser = React.useMemo(loadLoginStore, []);
  const [user, setUser] = React.useState<User | undefined>(loadedUser);

  React.useEffect(() => {
    if (loadedUser !== undefined) {
      //Verify login
      api_manager.getLogin();
    }
  }, []);

  const handleUserChange = (user: User) => {
    //Run hooks
    saveLoginStore(user);
    i18n.changeLanguage(user.language);
    setUser(user);
  };

  return (
    <authContext.Provider value={{ user: user, setUser: handleUserChange }}>
      {props.children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(authContext);
}

interface LoginValues {
  username: string;
  password: string;
}

export function Login() {
  const ctx = useAuth();

  return <>{!!ctx.user ? <Redirect to="/" /> : <LoginMenu />}</>;
}

export const ProtectedRoute = ({ children, ...rest }: RouteProps) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={() => (auth.user ? children : <Redirect to="/login" />)}
    />
  );
};

export function LoginMenu() {
  const { t } = useTranslation();
  const authContex = useAuth();

  const [errorMessage, setError] = React.useState<string | undefined>(
    undefined
  );

  const handleSubmit = (values: LoginValues) => {
    api_manager
      .login(values.username, values.password)
      .then((response) => {
        authContex.setUser(response);
      })
      .catch((error) => {
        if (error.message) {
          setError(error.message);
        } else {
          setError("Internal Error");
        }
      });
  };

  return (
    <GradientBackground>
      <h4 className="text-center">{t("login.title")}</h4>
      <ErrorAlert error={errorMessage} />
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={() => {}}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, values }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="usernameField">
              <Form.Label>{t("login.username")}</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                name="username"
                value={values.username}
              />
            </Form.Group>
            <Form.Group controlId="passwordField">
              <Form.Label>{t("login.password")}</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                name="password"
                value={values.password}
              />
            </Form.Group>
            <Button
              block
              disabled={values.username === "" || values.password === ""}
              type="submit"
            >
              {t("login.login")}
            </Button>
          </Form>
        )}
      </Formik>
    </GradientBackground>
  );
}
