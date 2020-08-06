import { createElement } from "./src/createElement.js";
import ReactDOM from "./src/reactDom";

const Component1 = () => {
  return createElement(
    "div",
    null,
    createElement("text", null, "DEPROMEET_ React Study")
  );
};

const Component2 = () => {
  return createElement(
    "div",
    null,
    createElement("text", null, "danmin20_lee.jeong.min")
  );
};

const Element = () => {
  return createElement("div", null, Component1, Component2);
};

ReactDOM.render(createElement(Element, null), document.getElementById("root"));
