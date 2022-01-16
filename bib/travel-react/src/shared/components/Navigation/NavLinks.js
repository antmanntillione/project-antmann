import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import Modal from "../../components/UIElements/Modal";
import Button from "../FormElements/Button";

import "./NavLinks.css";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const [askLogout, setAskLogout] = useState(false);

    const showAskLogout = () => {
        setAskLogout(true);
    };

    const unshowAskLogout = () => {
        setAskLogout(false);
    };

    const logoutHandler = () => {
        unshowAskLogout();
        auth.logout();
    };

    return (
        <React.Fragment>
            <Modal header="Do you want to logout?" show={askLogout} onCancel={unshowAskLogout}>
                <Button inverse onClick={unshowAskLogout}>
                    CANCEL
                </Button>
                <Button danger onClick={logoutHandler}>
                    LOGOUT
                </Button>
            </Modal>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" exact>All Users</NavLink>
                </li>
                {auth.isLoggedIn &&
                    <li>
                        <NavLink to="/u1/places">My Places</NavLink>
                    </li>}
                {auth.isLoggedIn &&
                    <li>
                        <NavLink to="/places/new">Add Place</NavLink>
                    </li>}
                {!auth.isLoggedIn &&
                    <li>
                        <NavLink to="/auth">Authenticate</NavLink>
                    </li>}
                {auth.isLoggedIn &&
                    <li>
                        <Button onClick={showAskLogout}>Logout</Button>
                    </li>}
            </ul>
        </React.Fragment>

    );
};

export default NavLinks;