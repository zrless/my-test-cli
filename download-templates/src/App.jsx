import React from "react";
import smallImage from "@/static/img.jpg";
import bigImage from "./static/logo.png";
import { sum_1, sum_2 } from "./utils";
import _ from "lodash";
// import $ from "jquery";
// console.log($);
sum_1(1, 2);

//ES6
const App = () => {
  return (
    <div>
      <div>
        <img src={smallImage} alt="" />
      </div>
      <div>
        <img src={bigImage} alt="" />
      </div>
      <h1 className="h1">webpack-react 测试</h1>
    </div>
  );
};

export default App;
