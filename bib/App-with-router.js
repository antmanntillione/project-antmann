import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./sources/tools-menu/Header"
import Footer from "./sources/tools-menu/Footer"
import Navigation from "./sources/tools-menu/Navigation"

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Sources from "./sources2/sources/Sources"
import Persons from "./sources2/persons/Persons"
import Groups from "./sources2/groups/Groups"

const App = () => {

  let routes = (
    <Switch>
      <Route path="/" exact></Route>
      <Route path="/sources" exact>
        <Sources className="App-header" />
      </Route>
      <Route path="/extracts" exact>
        <Persons></Persons>
      </Route>
      <Route path="/thesis" exact>
        <Groups></Groups>
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <Router>
      <div className="App">
        <Header text="Welcome to SourceFlow!" />
        <Navigation />
        {routes}
        <Footer text="Made by Antmann" />
      </div>
    </Router>
  );
}

export default App;
