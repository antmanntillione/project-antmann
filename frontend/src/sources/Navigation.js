import './Navigation.css';

import { NavLink } from "react-router-dom";
import React from 'react';

const Navigation = props => {
  return (
      <React.Fragment>
        <ul className="nav-links"> 
            <li>
                <NavLink to="/sources">Sources</NavLink>
            </li>
            <li>
                <NavLink to="/persons">Persons</NavLink>
            </li>
            <li>
                <NavLink to="/groups">Groups</NavLink>
            </li>
        </ul>
    </React.Fragment>
  );
}

export default Navigation;
