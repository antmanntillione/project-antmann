import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//eslint-disable-next-line
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState, useReducer, useEffect, useRef, createContext } from "react"

import Header from "./sources/Navigation/Header"
import Footer from "./sources/Navigation/Footer"
import ToolsMenu from './sources/tools-menu/ToolsMenu';
import ContentMenu from './sources/triple-window/ContentMenu';

import { api } from "./sources/API/API"

function App() {

  //stores the current sources menu data (may always be adapted when triggering a search and receiving data from backend)
  const [currentSourcesMenuData, setCurrentSourcesMenuData] = useState([])

  const addContent = (newContent: any) => {
    api.sendNewContent(newContent)
    setNum(num => num + 1)
  }

  const getContent = () => {
    setCurrentSourcesMenuData(api.getContent())
  }

  const [num, setNum] = useState(0)
  useEffect(() => { getContent() }, [num])

  return (
    <Router>
      <div className="App">
        <Header text="Welcome to SourceFlow!" />
        <ToolsMenu addContent={addContent} />
        <ContentMenu sourcesData={currentSourcesMenuData} />
        <Footer text="Made by Antmann" />
      </div>
    </Router>
  );
}

export default App;
