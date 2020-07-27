import { createElement } from "./src/createElement.js";
import ReactDOM from "react-dom";

const Title = () => {
  return createElement(
    "div",
    {
      style: {
        fontSize: "40px",
      },
    },
    "DEPROMEET_ React Study"
  );
};

const Element = () => {
  return createElement(
    "div",
    null,
    createElement(
      "div",
      {
        key: 1,
      },
      createElement(Title, null)
    ),
    createElement(
      "div",
      {
        key: 2,
        style: {
          opacity: "50%",
        },
      },
      "danmin20_lee.jeong.min"
    )
  );
};

ReactDOM.render(createElement(Element, null), document.getElementById("root"));
