import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./sources/Navigation/Header"
import Footer from "./sources/Navigation/Footer"

import ToolsMenu from './sources/tools-menu/ToolsMenu';
import ContentMenu from './sources/triple-window/ContentMenu';


function App() {

  /*
  HOW TO USE REDIRECT AND SWITCH IN TYPESCRIPT?
  {routes}
  let routes = (
    <Switch>
      <Redirect to="/" />
    </Switch>
  );
  */

  return (
    <Router>
      <div className="App">
        <Header text="Welcome to Sourcer!" />
        <ToolsMenu />
        <ContentMenu />
        <Footer text="Made by Antmann" />
      </div>
    </Router>
  );
}

export default App;
