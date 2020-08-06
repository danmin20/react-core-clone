import { isValidHTMLTag } from "./partials/htmlTags";

const isFunctionElement = (element) => typeof element.type === "function";
const isTextElement = (element) => element.type === "text";

const toArray = (arg) => {
  if (!Array.isArray(arg) && arg) return (arg = [arg]);
  else return arg;
};

const validatedHTMLTag = (tag) => {
  if (!isValidHTMLTag(tag)) {
    throw new Error("유효하지 않은 HTML tag");
  }
};

const parseFunctionalElement = (element, container) => {
  const functionalComponent = element.type;
  const createdElement = functionalComponent();
  ReactDom.render(createdElement, container);
};

const parseTextElement = (element, container) => {
  const textNode = document.createTextNode(element.props.children);
  container.appendChild(textNode);
};

const ReactDom = {
  render: (element, container) => {
    if (isFunctionElement(element)) {
      parseFunctionalElement(element, container);
      return;
    }
    if (isTextElement(element)) {
      parseTextElement(element, container);
      return;
    }
    try {
      validatedHTMLTag(element.type);
    } catch (e) {
      console.log(e);
    }

    const subContainer = document.createElement(element.type);
    for (const propName in element.props) {
      if (propName !== "children") {
        subContainer[propName] = element.props[propName];
      }
    }
    container.appendChild(subContainer);

    const childs = toArray(element.props.children);
    if (childs) {
      childs.map((child) => {
        if (typeof child === "function") ReactDom.render(child(), subContainer);
        else ReactDom.render(child, subContainer);
      });
    }
  },
};

export default ReactDom;
