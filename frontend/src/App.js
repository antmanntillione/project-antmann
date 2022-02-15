import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./sources/Header"
import Footer from "./sources/Footer"
import Navigation from "./sources/Navigation"

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Sources from "./sources/sources/Sources"
import Persons from "./sources/persons/Persons"
import Groups from "./sources/groups/Groups"


const App = () => {

  let routes = (
    <Switch>
      <Route path="/" exact></Route>
      <Route path="/sources" exact>
        <Sources className ="App-header"/>
      </Route>
      <Route path="/extracts" exact>
        <Persons></Persons>
      </Route>
      <Route path="/thesis" exact>
        <Groups></Groups>
      </Route>
      <Redirect to="/"/>
    </Switch>
  );

  return (
    <Router>
      <div className="App">
        <Header text="Welcome to SourceFlow!"/>
          <Navigation/>
          {routes}
        <Footer text = "Made by Antmann"/>
      </div>
    </Router>
  );
}

export default App;
