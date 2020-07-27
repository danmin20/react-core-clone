/**
 * 빌드 과정이 개발 모드라고 가정한 코드
 */
"use strict";

const ReactCurrentOwner = {
  currentOwner: null,
};

/**
 * tag를 지정하는 데 사용되는 심볼
 * native 심볼이나 polyfill이 없으면 일반 번호 사용됨
 */
const REACT_ELEMENT_TYPE =
  (typeof Symbol === "function" && Symbol.for && Symbol.for("react.element")) ||
  0xeac7;

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

/**
 * 새 React element를 만듦
 *
 * @param {*} type
 * @param {*} key
 * @param {*} ref
 * @param {*} self React.CreateElement가 호출될 때,
 * 'this'가 'owner'와 다른 곳을 감지하는 임시 helper
 * @param {*} source annotation object
 * @param {*} owner
 * @param {*} props
 */
const ReactElement = (type, key, ref, self, source, owner, props) => {
  const element = {
    // $$typeof 속성은 이 객체가 ReactElement임을 나타내는 표식
    $$typeof: REACT_ELEMENT_TYPE,

    // element에 속하는 built-in 속성들
    type: type,
    key: key,
    ref: ref,
    props: props,

    /**
     * ReactCurrentOwner 모듈 자체는 current 속성을 가지는 객체를 노출함 (일종의 싱글톤 객체)
     * current 속성은 컴포넌트의 render 메소드가 호출되기 직전에
     * 현재 컴포넌트 객체로 설정됨
     * 렌더링이 완료된 후 refs에 붙게 됨
     * 따라서 render 메소드 밖에서 미리 만들어진 ReactElement에는 _owner 속성이 null
     */
    _owner: owner,
  };

  element._store = {};

  element._store.validated = false;
  element._self = self;
  element._source = source;
  if (Object.freeze) {
    Object.freeze(element.props);
    Object.freeze(element);
  }
  return element;
};

export function createElement(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  /**
   * React에서 예약되어 있는 prop 제거
   */
  if (config != null) {
    // key, ref는 별도의 변수에 저장됨 (this.props.key로 접근 불가)
    ref =
      !config.hasOwnProperty("ref") ||
      Object.getOwnPropertyDescriptor(config, "ref").get
        ? null
        : config.ref;
    key =
      !config.hasOwnProperty("key") ||
      Object.getOwnPropertyDescriptor(config, "key").get
        ? null
        : "" + config.key;

    // 남은 속성들은 새 props 객체에 추가됨
    for (propName in config) {
      if (
        config.hasOwnProperty(propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  /**
   * 자식 엘리먼트들을 props.children에 넣음
   */
  var childrenLength = arguments.length - 2;
  // 자식이 하나일 경우는 배열로 만들어지지 않고 바로 children이 됨
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current, // 컴포넌트에서 this.refs를 만들기 위해 필요함
    props
  );
}
