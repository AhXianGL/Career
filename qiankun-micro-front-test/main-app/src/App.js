import './App.css';
// import {HashRouter,BrowserRouter, Route, Routes} from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from './pages/IndexPage';
import MicroOne from './pages/micro-one';
import MicroTwo from './pages/micro-two';
import { useEffect } from 'react';
// import StylesView from './pages/styles-view';
function App(props) {
  return (
    <BrowserRouter className="App">
      <MicroOne />
      <MicroTwo />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        {/* <Route path="react-micro-one" element={<MicroOne />} />
        <Route path="react-micro-two" element={<MicroTwo />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
