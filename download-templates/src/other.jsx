import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import "./style.less";
const Index = () => {
  return (
    <div>
      <h1>ohter.html</h1>
      <App />
    </div>
  );
};
ReactDom.render(<Index />, document.getElementById("other"));
