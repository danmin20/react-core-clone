# ✨**REACT CORE CLONE CLODING STUDY**✨

### 1주차(20.07.18) 과제 : JSX -> React.createElement 변환 구현

<details>
<summary>React.createElement 정리</summary>
<div markdown="1">

<br>
<div>

## React Core & DOM

React 0.14부터 React는 Core와 DOM의 두 패키지로 분리되었다.  
컴포넌트를 정의할 때 사용되는 API는 Core 패키지에 존재하며 플랫폼 독립적이다.  
따라서 createElement를 구현하기 위한 코드는 Core 패키지에 속한다.

</div>
<br>
<div>

## JSX & createElement

React에서는 JSX 문법으로 가상 DOM 구조를 나타낸다.  
JSX는 일반적인 js코드로 변환되며, 이때 React.createElement함수는 ReactElement 타입의 객체를 리턴한다.

### React createElement의 소스 코드

```
ReactElement.createElement = function(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (__DEV__) {
      ref = !config.hasOwnProperty('ref') ||
        Object.getOwnPropertyDescriptor(config, 'ref').get ? null : config.ref;
      key = !config.hasOwnProperty('key') ||
        Object.getOwnPropertyDescriptor(config, 'key').get ? null : '' + config.key;
    } else {
      ref = config.ref === undefined ? null : config.ref;
      key = config.key === undefined ? null : '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    // Create dummy `key` and `ref` property to `props` to warn users
    // against its use
    if (typeof props.$$typeof === 'undefined' ||
        props.$$typeof !== REACT_ELEMENT_TYPE) {
      if (!props.hasOwnProperty('key')) {
        Object.defineProperty(props, 'key', {
          get: function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              warning(
                false,
                '%s: `key` is not a prop. Trying to access it will result ' +
                  'in `undefined` being returned. If you need to access the same ' +
                  'value within the child component, you should pass it as a different ' +
                  'prop. (https://fb.me/react-special-props)',
                'displayName' in type ? type.displayName: 'Element'
              );
            }
            return undefined;
          },
          configurable: true,
        });
      }
      if (!props.hasOwnProperty('ref')) {
        Object.defineProperty(props, 'ref', {
          get: function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              warning(
                false,
                '%s: `ref` is not a prop. Trying to access it will result ' +
                  'in `undefined` being returned. If you need to access the same ' +
                  'value within the child component, you should pass it as a different ' +
                  'prop. (https://fb.me/react-special-props)',
                'displayName' in type ? type.displayName: 'Element'
              );
            }
            return undefined;
          },
          configurable: true,
        });
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
};
```

- **DEV** 변수는 빌드 과정에서 개발/프로덕션 모드에 따라 나타나는 boolean

</div>
<br>
<div>

## props 정규화

createElement에서 가장 먼저 하는 작업은 React에서 예약되어 있는 prop을 제거하는 것이다.  
key와 ref를 별도의 변수에 저장하고, 나머지는 props 객체에 복사한다.  
(key와 ref에 접근하지 못하게 함)

```
if (config != null) {
    if (__DEV__) {
      ref = !config.hasOwnProperty('ref') ||
        Object.getOwnPropertyDescriptor(config, 'ref').get ? null : config.ref;
      key = !config.hasOwnProperty('key') ||
        Object.getOwnPropertyDescriptor(config, 'key').get ? null : '' + config.key;
    } else {
      ref = config.ref === undefined ? null : config.ref;
      key = config.key === undefined ? null : '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }
```

다음으로는 자식 엘리먼트들을 props.children에 넣는다.  
 자식이 하나일 경우에는 배열로 만들어지지 않고 바로 children으로 만든다.

```
var childrenLength = arguments.length - 2;
 if (childrenLength === 1) {
   props.children = children;
 } else if (childrenLength > 1) {
   var childArray = Array(childrenLength);
   for (var i = 0; i < childrenLength; i++) {
     childArray[i] = arguments[i + 2];
   }
   props.children = childArray;
 }
```

컴포넌트 안에서 this.props.children이 배열인지 아닌지 알기 어렵기 때문에,  
 이를 일관성있게 다루기 위한 [React.Children 유틸리티 함수들](https://reactjs.org/docs/react-api.html#react.children)이 제공된다.

 </div>
 <br>
 <div>
 
 ## ReactElement 객체의 구조
 정규화 및 추출을 마친 값들은 ReactElement 함수에 넘겨지면서 객체로 만들어진다.
 ```
 var element = {
  // This tag allow us to uniquely identify this as a React Element
  $$typeof: REACT_ELEMENT_TYPE,

// Built-in properties that belong on the element
type: type,
key: key,
ref: ref,
props: props,

// Record the component responsible for creating this element.
\_owner: owner,
};

if (**DEV**)
... // 생략

return element;

```
- $$typeof 프로퍼티는 이 객체가 ReactElement임을 나타내 주는 표식
- React.isValidElement 함수는 올바른 element인지를 검사
- REACT_ELEMENT_TYPE의 값은 (ES5 Symbol을 사용할 수 있을 경우) ? Symbol : 0xeac7

</div>
<br>
<div>

## Owner
this.refs를 만들기 위해 필요하다.  
createElement의 마지막 부분에서 ReactCurrentOwner.current가 넘어오는데,  
ReactCurrentOwner 모듈 자체는 current 프로퍼티만을 가지는 객체를 노출한다. (일종의 싱글톤 객체)  
current 프로퍼티는 컴포넌트의 render 메소드가 호출되기 직전에 현재 컴포넌트 객체로 설정되며,  
렌더링이 완료된 후 refs에 붙게 된다.  
```
_renderValidatedComponent: function() {
var renderedComponent;
ReactCurrentOwner.current = this;
try {
renderedComponent =
this.\_renderValidatedComponentWithoutOwnerOrContext();
} finally {
ReactCurrentOwner.current = null;
}
invariant(
// TODO: An `isValidNode` function would probably be more appropriate
renderedComponent === null || renderedComponent === false ||
ReactElement.isValidElement(renderedComponent),
'%s.render(): A valid React element (or null) must be returned. You may have ' +
'returned undefined, an array or some other invalid object.',
this.getName() || 'ReactCompositeComponent'
);
return renderedComponent;
},

ReactRef.attachRefs = function(instance, element) {
if (element === null || element === false) {
return;
}
var ref = element.ref;
if (ref != null) {
attachRef(ref, instance, element.\_owner);
}
};
```
따라서 render 메소드 밖에서 미리 만들어진 ReactElement에서는  
 _owner 프로퍼티가 null로 되어있으며,  
여기에 ref가 붙어있으면 렌더 시 오류가 발생한다.  
전역 싱글턴을 쓰지 않고 render 메소드에서 리턴된 ReactElement를 순회하면서 owner를 붙일 수도 있지만,  
순회 비용 때문에 이렇게 구현한 것으로 보인다. (ReactElement는 불변 객체이기 때문에 복사 비용이 큼)  

</div>
<br>
<div>

## createElement의 최적화
createElement를 호출하지 않고 컴파일 타임에 미리 객체를 만들어 버리자는 아이디어가 바로,  
[Babel의 react-inline-elements 플러그인](https://babeljs.io/docs/en/babel-plugin-transform-react-inline-elements/)  
이는 JSX 태그를 createElement 호출로 변환하지 않고 바로 객체 리터럴로 변환해준다.  

</div>

</div>
</details>

