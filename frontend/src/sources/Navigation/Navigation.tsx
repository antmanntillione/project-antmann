import './Navigation.css';

import { NavLink } from "react-router-dom";
import React from 'react';

const Navigation = (props: any) => {
  return (
      <React.Fragment>
        <ul className="nav-links"> 
            <li>
                <NavLink to="/sources">Sources</NavLink>
            </li>
            <li>
                <NavLink to="/extracts">Extracts</NavLink>
            </li>
            <li>
                <NavLink to="/thesis">Thesis</NavLink>
            </li>
        </ul>
    </React.Fragment>
  );
}

export default Navigation;
