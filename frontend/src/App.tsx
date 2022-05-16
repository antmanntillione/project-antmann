import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./sources/tools-menu/Header"
import Footer from "./sources/tools-menu/Footer"

import SourceMenu from "./sources/source-menu/SourceMenu"
import SourceContentMenu from "./sources/source-content-menu/SourceContentMenu"
import ThesisMenu from "./sources/thesis-menu/ThesisMenu"


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
        <SourceMenu />
        <SourceContentMenu />
        <ThesisMenu />
        <Footer text="Made by Antmann" />
      </div>
    </Router>
  );
}

export default App;
