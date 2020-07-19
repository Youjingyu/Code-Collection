### react 性能优化
https://www.zhihu.com/search?type=content&q=react%20%E4%BC%98%E5%8C%96

- 列表的事件绑定
```jsx
function Parent () {
  return (
    <div>
      {
        list.map((item, index) =>{
          // bad
          // return <Child index={index} onClick={() => onClick(index)} />
          // 尽量保证 props 不变，因此通过子组件回传 index
          // 如果子组件是 dom 或者 第三方组件，可以尝试传递 data-*=index
          // 然后通过 event target 获取 data-*
          // good
          return <Child index={index} onClick={onClick} />
        })
      }      
    </div>
  )
}
function Child (props) {
  return (
    <div onClick={props.onClick(props.index)}></div>
  )
}
```

- react hooks 状态问题
如果 react 的子组件使用了 React.memo 阻止渲染，子组件的 props 引用的父组件 function 也不会随着每次渲染更新，也就是永远都是父组件上一次的function
```jsx
function Parent () {
  [state, setState] = useState({});

  const handler = () => {
    console.log(state);
  }
  return (
    <Child onClick={handler}>
    </Child>
  )
}
React.memo(function Child (props) {
  // 只要 child 不重新渲染，props.onClick 永远都是这次渲染的值
  // 也就是父组件中引用的 state 永远都是这次渲染的 state
  return (
    <div onClick={props.onClick(props.index)}></div>
  )
}, () => {
  // 阻止渲染
})

// 解决方式，如果需要在 handler 中 setState，可以使用 setState 的 callback 方案
function Parent () {
  [state, setState] = useState({});

  const handler = () => {
    // 永远都是老的 state
    console.log(state);
    setState((preState) => {
      // react 会将最新的 state 放到这里
      console.log(preState)
    })
  }
  return (
    <Child onClick={handler}>
    </Child>
  )
}
```

- react 懒加载原理
 - react-loadable 原理：使用 import 语法，让 webpack 拆包，然后调用 import(..).then(component => {})，组件加载成功后，就将 loading 替换为真正的组件。但组件没有被用到时（比如在if else 的另一分支用到），不会执行 import(xxx)，也就是不会加载。react-loadable 没有用 Suspense
 - suspense 原理：React.lazy 异步加载的组件会 throw 一个 Promise 出来，然后 Suspense 在 componentDidCatch 中将该 Promise 捕获，从而拿到子组件的加载状态，从而决定是渲染 loading 还是渲染子组件。如果 Suspense 有多个 lazy 子组件，每个子组件的 Promise resolve 都会重新 render，然后在 render 的时候，重新获取子组件的值，就是 resolve 后的具体组件内容了
 ```jsx
  // React.lazy 伪代码
  React.lazy = function (loader) {
    const comp = loader();
    switch (comp.status) {
      case Pending: {
        // suspense 会捕获到这个 Promise
        throw comp;
      }
      case Resolved: {
        return comp;
      }
      case Rejected: {        
        throw error;
      }      
    }
  }
 ```
- React.forwardRef
React.forwardRef 解决高阶组件无法访问 wrapped component 的 ref 的问题
```jsx
function Hoc (WrappedComponent) {
  class InnerComp extends React.Component {
    render () {
      return <WrappedComponent {...this.props} />
    }
  }
  return InnerComp;
}
// 外部引用的时候，无法访问到 SomeComponent 的 ref
export default Hoc(SomeComponent);

// 解决
function Hoc (WrappedComponent) {
  class InnerComp extends React.Component {
    render () {
      return <WrappedComponent ref={forwardedRef} {...this.props} />
    }
  }
  return React.forwardRef((props, ref) => {
    // 外部可以通过 forwardedRef 访问到 WrappedComponent 的 ref
    return <InnerComp {...props} forwardedRef={ref} />;
  });
}
```
- useImperativeHandle
函数组件没有 ref（其实只有 class 组件和 dom 才能绑定 ref），useImperativeHandle 可以自定义暴露给父组件的 ref 的值
```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  // 父组件的拿到的 ref 就是 {focus: () => void}
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```