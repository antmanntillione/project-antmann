import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./Custom.css";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { ExplainerMenu } from "./explainer";
import { DatasetMenu } from "./dataset";
import { RatingsMenu } from "./ratings";
import { UserSettings } from "./settings/userSettings";
import { UserManagement } from "./settings/userManagement";
import { useTranslation } from "react-i18next";

import { ProvideAuth, Login, useAuth, ProtectedRoute } from "./login";
import { api_manager } from "./api";

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <ProtectedRoute path="/">
            <ArkansasMenu />
          </ProtectedRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

function ArkansasMenu() {
  const authContex = useAuth();
  const { t } = useTranslation();

  const user = authContex.user;

  const settingsNavMenuItem = (
    <LinkContainer to="/settings/user_management">
      <NavDropdown.Item>{t("settings.user_management")}</NavDropdown.Item>
    </LinkContainer>
  );

  return (
    <>
      <Navbar bg="primary" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand>Arkansas</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <LinkContainer to="/explain">
              <Nav.Link active={false}>{t("menu.explainer")}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/dataset">
              <Nav.Link active={false}>{t("menu.datasets")}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/rating">
              <Nav.Link active={false}>{t("menu.rating")}</Nav.Link>
            </LinkContainer>
            <NavDropdown
              title={t("menu.settings")}
              id="collasible-nav-dropdown"
            >
              <LinkContainer to="/settings/user_settings">
                <NavDropdown.Item>
                  {t("settings.user_settings")}
                </NavDropdown.Item>
              </LinkContainer>
              {user?.privilege_level === "ADMIN" && settingsNavMenuItem}
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  api_manager
                    .logout()
                    .then(() => {
                      window.location.replace("/login");
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }}
              >
                {t("menu.logout")}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route path="/explain" component={ExplainerMenu} />
        <Route path="/dataset">
          <DatasetMenu is_admin={user?.privilege_level === "ADMIN"} />
        </Route>
        <Route path="/rating" component={RatingsMenu} />
        <Route path="/settings/user_settings">
          <UserSettings user={user} />
        </Route>
        <Route path="/settings/user_management">
          <UserManagement userid={user?.id} />
        </Route>
        <Route>
          <Redirect to="/explain" />
        </Route>
      </Switch>
    </>
  );
}
