import "./App.css";
import { BrowserRouter } from "react-router-dom";
function App(props) {
  console.log(props.history)
  return (
    <BrowserRouter basename="/react-micro-one">
      <div className="App">
        <h1>micro-one-new</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;
