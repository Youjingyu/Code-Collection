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