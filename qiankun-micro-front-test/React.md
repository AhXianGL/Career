# React

### 创建React项目

> 原始：全局安装`npm i -g create-react-app` ，在通过脚手架的命令来创建 React 项目
>
> 现在：npx 调用最新的 create-react-app 直接创建 React 项目，npx是 npm v5.2 版本新添加的命令，用来简化 npm 中工具包的使用

- 命令：`npx create-react-app xxx`
- 启动项目：`yarn start`or `npm start`



### React基本使用

1. 导入react核心包
2. 导入ReactDOM 用于浏览器上渲染结构
3. 使用ReactDOM.createRoot获取根节点
4. 创建结构 React.createElement() 三个参数，类似于vue中的h函数，创建的是一个React元素
5. 使用render函数挂载元素

```react
// 1.导入react核心包
import React from "react";
// 2.导入ReactDOM 用于浏览器上渲染结构
import ReactDOM from 'react-dom/client'

// 3.使用ReactDOM.createRoot获取根节点
// 4.创建结构 React.createElement() 三个参数 类似于vue中的h函数，创建的是一个React元素
//    参数1：创建节点的类型  div、img、a....
//    参数2：节点的属性
//    参数3：节点内容
// 5.使用render函数挂载元素

// 获取到挂载点
const root = ReactDOM.createRoot(document.querySelector('#root'))

// 创建元素
const h1 = React.createElement('h1', {}, '我是h1标签')

// 调用rander函数挂载
root.render(h1)
```





### JSX语法

`JSX`是`JavaScript XML`的简写，表示了在Javascript代码中写XML(HTML)格式的代码

优势：声明式语法更加直观，与HTML结构相同，降低学习成本，提高开发效率。

使用：

1. 导入reactDOM包
2. 使用jsx创建react元素
3. 将react元素渲染到页面中

```react
import ReactDOM from 'react-dom/client'

// 创建元素
const dom = (
  <>
    <h1>我是h1</h1>
    <h2>我是h2</h2>
    <h3 className="box">"我是h3"</h3>
    <div />
  </>
)
const root = ReactDOM.createRoot(document.getElementById('root'));
// 渲染元素
root.render(dom)
```

> 注意：
>
> 1. JSX必须要有一个根节点，没有根节点可以使用幽灵节点`<></>`，也可以使用`<React.Fragment></React.Fragment>`
> 2. 所有标签必须结束，单标签可以使用  ` /> `  结束
> 3. 关键字：`class =>  className `    `for => htmlFor`
> 4. 在书写style行内样式的时候,`style`希望接受的是一个对象格式 所以案例写法`style={{color:"red"}}`
> 5. JSX语法有多行可以使用 () 包裹
> 6. JSX中注释:{/* <Hello/> ✳/}



**JSX的插值语法中不能放对象和函数,如果要放一个数据的集合可以使用数组**

```js
// jsx的插值语法中不能放对象和函数,如果要放一个数据的集合可以使用数组
const course = ["html","css","js","react","node"];
const vDOM = (
  <ul>
    {
      course.map(item => {
        return <li>{item}</li>
      })
    }
  </ul>
);
root.render(vDOM)

```





### 函数式组件

定义：接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。这类组件被称为“函数组件”

```js
// 声明函数式组件
function Welcome(props) {
  return <h1>{props.name}{props.age}</h1>
}

const element = <Welcome name="Sara" age={18} />

// 挂载
root.render(element)
```

> 1. 我们调用 `root.render()` 函数，并传入 `<Welcome name="Sara" />` 作为参数。
> 2. React 调用 `Welcome` 组件，并将 `{name: 'Sara'}` 作为 props 传入。
> 3. `Welcome` 组件将 `<h1>Hello, Sara</h1>` 元素作为返回值。
> 4. React DOM 将 DOM 高效地更新为 `<h1>Hello, Sara</h1>`。



#### props的只读性

**所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。**

组件无论是使用函数声明还是通过 class 声明，都绝不能修改自身的 props。

```js
// 纯函数
function sum(a, b) {
  return a + b;
}

// 改变了参数，不是纯函数
function sum(a, b) {
   a -= b;
}
```





### class组件

1. 创建一个class组件继承与`React.Component`
2. 每次组件更新时 `render` 方法都会被调用，但只要在相同的 DOM 节点中渲染组件，就仅有一个组件的 class 实例被创建使用。这就使得我们可以使用如 state 或生命周期方法等很多其他特性。

3. 只能在构造器`constructor`中声明state的值。

```react
class Clock extends React.Component {
  // constructor默认返回实例对象（即this）
  constructor(props) {
    super(props)
    // 构造器中的this指向实例
    this.state = {date: new Date().toLocaleTimeString()}
  }
  // 组件挂载完成钩子函数
  componentDidMount() {
    console.log(this)
    // 创建一个定时器
    this.timerID = setInterval(() => {
      this.tick()
    },1000)
  }
  // 组件销毁钩子函数
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  // 更新state
  tick() {
    this.setState({
      date: new Date().toLocaleTimeString()
    })
  }
  // 状态每次改变都会自动执行render函数，更新视图
  render() {
    return (
      <div>
        <h1>你好</h1>
        <h2>{this.state.date}</h2>
      </div>
    )
  }
}

root.render(<Clock name="zhangsan"/>)
```





### 构造器constructor()

- 通过给 `this.state` 赋值对象来初始化内部 state
- 为事件处理函数绑定实例

> 在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前调用 `super(props)`。否则，`this.props` 在构造函数中可能会出现未定义的 bug。



### State

1. 不能直接修改`state`，需要通过`setState()`方法来修改

   ```js
   // wrong
   this.state.name = "lisi"
   
   // correct
   this.setState({name: "lisi"})
   ```

2. `State`的更新可能是异步的，不要以来自身的值来更新下一个状态，可以使用`setState()` 接收一个函数而不是一个对象。这个函数用上一个 `state` 作为第一个参数，将此次更新被应用时的 `props` 做为第二个参数。

   ```js
   this.setState((state, props) => ({
     counter: state.counter + props.increment
   }));
   ```

> 检查相应数据是否属于 state
>
> 1. 该数据是否是由父组件通过 props 传递而来的？如果是，那它应该不是 state。
> 2. 该数据是否随时间的推移而保持不变？如果是，那它应该也不是 state。
> 3. 你能否根据其他 state 或 props 计算出该数据的值？如果是，那它也不是 state。



#### setState

状态`state`的修改必须使用`setState`来更新状态，且更新是一种合并的操作，不是替换，`setState` 是异步更新 `state` 的值

```js
// 方式一
this.setState({
    属性：值
})

// 方式二
// state代表上一次没更新之前的状态，props表示组件的props属性
this.setState((state, props) => ({
  counter: state.counter + props.increment
}))
```



### props

```js
class Welcome extends React.Component {
  // 使用static关键字给类的本身上增加属性，static定义的属性实例上没有该属性
  // 配置规则
  static propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    speck: PropTypes.func
  }
  // 配置默认属性
  static defaultProps = {
    age: 18
  }
  render() {
    console.log(this)
    const {name, age, sex} = this.props
    return (
      <ul>
        <li>姓名:{name}</li>
        <li>年龄:{age}</li>
        <li>性别:{sex}</li>
      </ul>
    )
  }
}

// 方式一：限制props类型
// 限制组件中的props属性的类型，propTypes是规则配置对象，PropTypes是具体规则对象
// Welcome.propTypes = {
//   // isRequired 必须传值
//   name: PropTypes.string.isRequired,
//   age: PropTypes.number,
//   // speck的默认值为函数
//   speck: PropTypes.func
// }
// // 配置组件props属性的默认值
// Welcome.defaultProps = {
//   // 定义props默认值
//   age: 18
// }

const person = {name:"lisi", age:28, sex:"男", speck: ()=>{console.log(this)}}
const element = <Welcome {...person} />
```





#### state和props的区别

`props` 和 `state` 本质上都是普通的 JavaScript对象，他们用来保存信息的，这些信息可以控制组件的渲染输出，它们的不同点在于：`props` 时传递给组件的（类似于函数的形参），而 `state` 是在组件内被组件自己所管理的（类似于一个函数内部声明的变量）



### ref

##### 字符串形式

通过`ref`属性绑定一个字符串，可以在类组件中使用`this.refs.字符串`取得DOM元素

```js
class Demo extends React.Component{
  //展示输入框的数据
  showData = ()=>{
    const {input1} = this.refs
    alert(input1.value)
  }
  render(){
    return(
      <div>
        // 通过字符串形式
        <input ref="input1" type="text" placeholder="点击按钮提示数据"/>&nbsp;
        <button onClick={this.showData}>点我提示左侧的数据</button>
      </div>
    )
  }
}
```

##### 回调形式

通过`ref`属性绑定一个回调函数，该回调函数会传递一个参数，该参数就是被绑定DOM元素

```react	
class Demo extends React.Component{
  //展示输入框的数据
  showData = ()=>{
    const {input1} = this
    alert(input1.value)
  }
  render(){
    return(
      <div>
        // 通过回调形式绑定ref
        <input ref={c => this.input1 = c } type="text" placeholder="点击按钮提示数据"/>&nbsp;
        <button onClick={this.showData}>点我提示左侧的数据</button>
      </div>
    )
  }
}
```

> 回调形式绑定ref时，在更新的过程中回调函数会被执行两次，第一次传入参数 `null`，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。

##### createRef 形式

`React.createRef`调用后可以返回一个容器，该容器可以存储被`ref`所标识的节点，这个容器只能存储一个DOM元素，专人专用

```react
class Demo extends React.Component{
  /* 
    React.createRef调用后可以返回一个容器，该容器可以存储被ref所标识的节点,该容器是“专人专用”的
    */
  myRef = React.createRef()
  //展示左侧输入框的数据
  showData = ()=>{
    alert(this.myRef.current.value);
  }
  render(){
    return(
      <div>
        <input ref={this.myRef} type="text" placeholder="点击按钮提示数据"/>&nbsp;
        <button onClick={this.showData}>点我提示左侧的数据</button>
      </div>
    )
  }
}
```

> antd 组件中Form表单通过createRef 获取不到实例





### 事件处理

1. 事件函数并不是当前绑定事件的DOM调用的,事件函数是默认调用的,事件函数中的this默认指向undefined
2. 类中的方法默认开启了严格模式，所以类中的方法中的this指向undefined
3. 通过实例调用类中的方法，方法中的this才会指向这个实例
4. React 中使用的是自定义（合成）事件，而不是使用的原生DOM事件，为了更好的兼容性
5. React 中的事件是通过事件委托的方式处理的，为了更高效

```js
class Content extends React.Component {
  constructor() {
    super()
    // 构造器中的this指向这个实例
    this.state = {
      content: "123",
      count: 0,
    }
    this.btnClick = this.btnClick.bind(this)
  }
  //btnClick放在哪里？ ———— Content的原型对象上，供实例使用
  //由于btnClick是作为onClick的回调，所以不是通过实例调用的，是直接调用
  //类中的方法默认开启了局部的严格模式，所以btnClick中的this为undefined
  btnClick() {
    this.setState({
      count: this.state.count + 1
    })
    // console.log(this)
  }
  render() {
    return (
      <div>
        <h1>{this.state.content}</h1>
        <p>{this.state.count}</p>
        {/* 这里只是将this.btnClick作为onClick的回调，相当于直接调用函数，this指向函数的上下文，如果使用普通声明函数的方式，方法中的this是指向window的，但是由于类中的方法都开启了局部严格模式，所以事件调用时this打印的是undefined，所以组件中声明函数都通过箭头函数来实现，或者在构造器中将函数的this改变为类的this指向 */}
        <button onClick={this.btnClick}>+</button>
      </div>
    )
  }
}


class Person {
  speak() {
    console.log(this)
  }
}
const per = new Person()
per.speak() // 通过实例调用，this指向实例
// 组件中的事件只能将函数作为回调，类似下列操作，相当于直接调用
const newPer = per.speak
newPer() // 直接调用，this指向函数的上下文
```



##### 通过事件传参

```js
{/* 事件传参 */}
// 方式一，通过箭头函数，事件对象会被作为第二个参数传递
<button onClick={(event) => this.btnClick(this.state.id, event)}>+</button>
// 方式二，通过Function.prototype.bind来实现
<button onClick={this.btnClick.bind(this, this.state.id)}>+</button>
// 方式三，通过函数返回函数来实现
btnClick = (id)=>{
  return (event)=>{
    this.setState({[dataType]:event.target.value})
  }
}
<button onClick={this.btnClick(this.state.id)}>+</button>
```



### Context

由于组件内数据是通过 `props` 属性自上而下（由父及子）进行传递的，当需要跨多级组件传递时，会变得繁琐。`Context` 提供了一种在组件之间共享此类值的方式，类似于全局变量，而不必显式地通过组件树的逐层传递 `props`。

- 创建 Context 数据
  - 通过 `React.createContext()` 创建默认值
  - 通过 `Context.Provider` 的 `value` 属性创建数据
- 获取 Context 数据
  -  类组件通过 `Context.Consumer` 组件来访问 `Context`，`Consumer` 标签中需要返回一个回调函数，函数的参数是 `Context` 的数据
  -  函数组件使用钩子函数 `useContext` 需要一个` Context` 作为参数，会将 `Context` 中的数据作为返回值返回

```js
// LearnContext.js
import React from "react";
// 创建默认数据
const LearnContext = React.createContext({
  name: "zs",
  age: 100
})
// React DevTools 使用该字符串来确定 context 要显示的内容。
LearnContext.displayName = 'LearnContext'; 
export default LearnContext


// ContextTest.jsx
import React, { Component, useContext } from 'react';
import LearnContext from '../store/LearnContext';
// 方式一
class ContextTest extends Component {
  render() {
    return (
      <div>
        <LearnContext.Consumer> // "LearnContext.Provider" 在 DevTools 中
          {(ctx) => {
             return <>
             	// 就近原则找到Context的值    
               {ctx.name} - {ctx.age}
             </>
          	}}
        </LearnContext.Consumer>
      </div>
    );
  }
}
// 方式二
/*const ContextTest = () => {
  const ctx = useContext(LearnContext)
  return (
    <div>
      {ctx.name} ?? {ctx.age}
    </div>
  );
}*/

// App.js
function App() {
  return (
    <div className="App">
    	// 通过 Context.Provider 设置 Context 属性  
        <LearnContext.Provider value={{name: 'ls', age: 15}}>
          <ContextTest></ContextTest>
        </LearnContext.Provider>
    </div>
  );
}
```

> 将 `undefined` 传递给 Provider 的 value 时，`React.createContext(defaultValue)` 的 `defaultValue` 不会生效。







### 函数的柯里化

高阶函数：如果一个函数符合下面2个规范中的任何一个，那该函数就是高阶函数。

1. 若A函数，接收的参数是一个函数，那么A就可以称之为高阶函数。
2. 若A函数，调用的返回值依然是一个函数，那么A就可以称之为高阶函数。

​        常见的高阶函数有：Promise、setTimeout、arr.map()等等

**函数的柯里化：通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式**。 

```js
// 不使用柯里化
function sum(a,b,c){
  return a+b+c
}
const result = sum(1,2,3)

// 使用柯里化
function sum(a){
  return(b)=>{
    return (c)=>{
      return a+b+c
    }
  }
}
const result = sum(1)(2)(3)
console.log(result);
```





### 受控组件和非受控组件

非受控组件是现用现取，使用 `ref`来从 DOM 节点中获取表单数据。

受控组件就是使用`state `唯一数据源来控制取值的表单输入元素就叫做“受控组件”。。



### 生命周期

旧

![](./image/2_react生命周期(旧).png)

新

![](./image/3_react生命周期(新).png)

> 在17.x版本中使用到三个will的生命周期要带上`UNSAFE_`前缀，在18.x中使用的新生命周期废弃了旧生命周期中**componentWillMount**，**componentWillUpdate**，**componentWillReceiveProps**，增加了**getDerivedStateFromProps** 和 **getSnapshotBeforeUpdate**两个生命周期



##### static getDerivedStateFromProps

`getDerivedStateFromProps` 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 `null` 则不更新任何内容。常用于 state 的值在任何时候都取决于 props。

```react
//若state的值在任何时候都取决于props，那么可以使用getDerivedStateFromProps
static getDerivedStateFromProps(props,state){
  console.log('getDerivedStateFromProps',props,state);
  return props
}
```

##### getSnapshotBeforeUpdate

在更新之前获取快照，获取更新之前的DOM的信息，返回值会传递给`componentDidUpdate`

```react
//在更新之前获取快照
getSnapshotBeforeUpdate(){
    console.log('getSnapshotBeforeUpdate');
    return 'zhangsan'
}
//组件更新完毕的钩子
componentDidUpdate(preProps,preState,snapshotValue){
    console.log('Count---componentDidUpdate',preProps,preState,snapshotValue);
}
```



### React配置代理

#### 方法一

> 在package.json中追加如下配置

```json
"proxy":"http://localhost:5000"
```

> 说明：
>
> 1. 优点：配置简单，前端请求资源时可以不加任何前缀。
>
> 2. 缺点：不能配置多个代理。
>
> 3. 工作方式：上述方式配置代理，当请求了3000不存在的资源时，那么该请求会转发给5000 （优先匹配前端资源）

#### 方法二

1. 第一步：创建代理配置文件， 在src下创建配置文件：src/setupProxy.js

2. 编写setupProxy.js配置具体代理规则：

   ```js
   const proxy = require('http-proxy-middleware')
   module.exports = function(app) {
     app.use(
       proxy('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
         target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
         changeOrigin: true, //控制服务器接收到的请求头中host字段的值
         /*
         changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
         changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
         changeOrigin默认值为false，但我们一般将changeOrigin值设为true
         */
         pathRewrite: {'^/api1': ''} //重写请求路径，用空字符串代替/api，去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
       }),
       proxy('/api2', { 
         target: 'http://localhost:5001',
         changeOrigin: true,
         pathRewrite: {'^/api2': ''}
       })
     )
   }
   ```

> 说明：1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。2. 缺点：配置繁琐，前端请求资源时必须加前缀。
>
> 配置代理项目无法访问时是版本的问题，将proxy改为const {**createProxyMiddleware**} = **require**('http-proxy-middleware')  使用 createProxyMiddleware 代替 proxy









## 路由

- `NavLink` 会给当前选中的导航链接添加一个`active`类名，可以通过`activeClassName` 来实现
- `Route` 不同的路由组件的对应出口，`exact` 开启路由的精准匹配
- `Switch` 匹配到第一个路由路径后就不再往后查找
- `Redirect` 重定向，使用`to` 来指定找不到是的重定向组件
- `params` 参数需要在路径后设置占位符，在路由组件中通过`this.props.match.params`获取
- `search` 参数无需设置占位符，可以在路由组件中通过 `this.props.location.search` 获取查询字符串，再通过`querystring` 对字符串进行处理，使用`stringify(str)`和`parse(str)`进行字符串和对象的转换
- `state`参数无需设置，通过`to={{path: xxx , state:{id:xxx, name:xxx}}}`设置。可以在路由组件中通过 `this.props.location.state` 获取，使用这种方法地址栏不会有所体现，刷新参数也不会丢失



# 性能优化

### 1. 使用PureComponent

> React.PureComponent中浅层对比了prop和state来避免重新渲染，但是假如props和state的属性值是对象的情况下，并不能阻止不必要的渲染，因为只是比较了地址，所以在使用PureComponent的时候要确保数据类型是值的类型，如果是引用类型，最好不要有深层次的变化。
>
> 注意：
>
> - 函数组件中，匿名函数，箭头函数和普通函数都会重新声明，可以使用`uweCallback`来缓存一份函数，保证不会重复声明
> - class组件中不使用箭头函数，匿名函数
> - 不在 class 组件的render函数中调用bind 函数，bind每一次调用都会返回一个新的函数，所以同样会造成`PureComponent`的失效

```js
//  使用PureComponent
export default function Father1 (){
    let [name,setName] = React.useState('');
    return (
        <div>
            <button onClick={()=>setName("父组件的数据")}>点击刷新父组件</button>
            {name}
            <Children1/>
        </div>
    )
}

class Children extends React.PureComponent{
    render() {
        return (
            <div>这里是子组件</div>
        )
    }
}
```



### 2. 使用ShouldComponentUpdate

> 这个函数可以决定是否要重新渲染组件，也属于一个生命周期函数，如果props更改或者调用setState这个函数会返回一个布尔值，true表示会重新渲染，如果为false则不会重新渲染。

```js
class Children2 extends React. PureComponent{
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        //判断只有偶数的时候，子组件才会更新
        if(nextProps !== this.props && nextProps.count  % 2 === 0){
            return true;
        }else{
            return false;
        }
    }
    render() {
        return (
            <div>
                只有父组件传入的值等于 2的时候才会更新
                {this.props.count}
            </div>
        )
    }
}
```



### 3. 使用React.memo

> 如果组件在相同的props的情况下渲染结果相同时，可以通过将其包装在React.memo中，React将跳过渲染组件并直接复用最近一次渲染的结果。React.memo对比的时props的变化，如果一个组件被这个钩子函数包裹，但是其内部有useState或者useReducer之类的，仍会进行重新渲染，这个也是进行的浅层比较，如果想要控制对比的过程，可以将自定义的函数通过第二个参数进行传递。







# 技巧

#### 1. 组件开始加载进行数据的回显

问题：当一个组件需要挂载时发送请求，后续每次显示都是重新挂载，不会出发更新，可以在父组件中定义一个标识符，在父组件中用来控制子组件是否渲染，以此来达到每次显示都是挂载的效果，在卸载子组件时，改变标识符，让子组件不渲染。常用于模态框的封装

```react
{
    this.state.isShow && <TackModal changeItem={this.changeItem} closedModal={this.closedModal}/>
}
```

#### 2. 使用组件懒加载`React.lazy`

`React.lazy` 函数能让你像渲染常规组件一样处理动态引入（的组件）。

`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise`，该 Promise 需要 resolve 一个 `default` export 的 React 组件。`import` 返回一个Promise。需要包裹在 `Suspense`组件内

- `React.Suspense` 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。在未来，我们计划让 `Suspense` 处理更多的场景，如数据获取等，允许定义一个fallback指示符。

- `fallback` 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 `Suspense` 组件置于懒加载组件之上的任何位置。你甚至可以用一个 `Suspense` 组件包裹多个懒加载组件。

```react
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```



# 开发注意点

### 1. forEach

- 在forEach中使用return关键字无效，不会跳出循环或者结束函数
- forEach不支持break
- forEach删除自身元素index不会被重置







# 开发错误

### 1. ‘’yarn : 无法加载文件 C:\Users\hy\AppData\Roaming\npm\yarn.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 abo ut_Execution_Policies。‘’

> 解决方法：
>
> 右键开始菜单，找到Windows PowerShell（管理员），点击运行，输入命令：set-ExecutionPolicy RemoteSigned 然后回车，选择：输入A选择全是，或者输入Y选择是 再重新启动



### 2. “error Command failed with exit code 3221225725. info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.”

> 解决办法：清除 yarn 的缓存
>
> - 检查当前yarn 的 bin的 位置：yarn global bin 
> - 查询cache缓存文件目录路径：yarn cache dir
> - 检查当前 yarn 的 全局安装位置：yarn global dir
> - 清除缓存：yarn cache clean
> - 改变 yarn 的缓存路径：yarn config set cache-folder <path>



### 3. npm报错 cb() 

> 解决办法：清除 npm 缓存：npm cache clean --force







# Nginx部署

环境：CentOS  7.9 64位

### 1. 安装依赖包

```js
//一键安装上面四个依赖
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
```

### 2. 下载并解压安装包

这里打算把nginx装到 `/usr/local/nginx` 文件夹下

```js
//创建一个文件夹
cd /usr/local
mkdir nginx
cd nginx

//下载tar包
wget http://nginx.org/download/nginx-1.13.7.tar.gz
tar -xvf nginx-1.13.7.tar.gz
```

### 3. 安装Nginx

```js
//进入nginx目录
cd /usr/local/nginx

//进入目录
cd nginx-1.13.7

//执行命令
./configure

//执行make命令
make

//执行make install命令
make install
```

### 4. 配置nginx.conf（可选）

```js
# 打开配置文件
vi /usr/local/nginx/conf/nginx.conf
```

将http下的server端口号改成8089，因为可能apeache占用80端口，apeache端口尽量不要修改，我们选择修改nginx端口。

```js
server {
    listen       8090;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   /home/react/dist;
        index  index.html index.htm;
    }
    ......
```

### 5. 启动Nginx

```js
/usr/local/nginx/sbin/nginx -s reload
```

如果出现报错：`nginx: [error] open() ＂/usr/local/nginx/logs/nginx.pid＂ failed`

则运行： 

```bash
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

然后再次启动，访问服务器 IP 地址出现 'Welcome to nginx!' 则部署成功

### 6. Nginx常用命令

- 启动
  - `./nginx`
- 停止
  - `./nginx -s stop`
- 重启
  - `./nginx -s reload`
- 检查是否有语法问题
  - `./nginx -t`

重启nginx前，建议大家都使用`./nginx -t`去检查语法是否有问题，若显示

`nginx.conf syntax is ok nginx.conf test is successful`

说明配置文件正确！

### 7. 部署dist文件

将`dist`文件放在服务器的某个文件夹下，我这里放在 `/home/react/dist`

修改 `http` 的 `server` 对象，将 `location` 对象的`root`路径配置成自己的`dist`文件夹即可

```js
server {
    listen       8090;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        root   /home/react/dist;
        index  index.html index.htm;
    }
    ....
```

最后访问`服务器IP+端口号`就可以了。

>        // 解决跨域
>        location /api {
>            add_header Access-Control-Allow-Origin * always;
>            add_header Access-Control-Allow-Headers *;
>            add_header Access-Control-Allow-Methods "GET, POST, PUT, OPTIONS";
>            proxy_pass http://10.16.21.19:8081/ecs;
>        }













# qiankun使用

