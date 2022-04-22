import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Header from "./sources/tools-menu/Header"
import Footer from "./sources/tools-menu/Footer"

import SourceMenu from "./sources/source-menu/SourceMenu"
import SourceContentMenu from "./sources/source-content-menu/SourceContentMenu"
import ThesisMenu from "./sources/thesis-menu/ThesisMenu"

const App = () => {

  let routes = (
    <Switch>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <Router>
      <div className="App">
        <Header text="Welcome to SourceFlow!" />
        {routes}
        <SourceMenu />
        <SourceContentMenu />
        <ThesisMenu />
        <Footer text="Made by Antmann" />
      </div>
    </Router>
  );
}

export default App;
