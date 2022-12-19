import "./App.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
const divStyle = {
  border: '1px blue solid'
}
function Comp(props) {
  return (<div className="App">
    <h1>micro-two</h1>
    <div style={divStyle}>
      {!props.history && <p color="red">丢失主应用传递而来的history对象</p>}
      <header style={{ fontSize: '16px' }}>
        将主应用的history传递给子应用调用history.push实现应用之间跳转
      </header>
      <button onClick={() => {
        props.history.push('/')
      }}>跳转至主应用(/)</button>
      <button onClick={() => {
        props.history.push('/react-micro-one')
      }}>跳转至子应用1(/react-micro-one)</button>
      缺点: 若页面刷新或者用户直接访问微应用, 则丢失(无法获取)主应用的history对象
    </div>
    <div style={divStyle}>
      <header style={{ fontSize: '16px' }}>
        由Link 标签 to 属性实现
      </header>
      <Link to={'/'}>跳转至主应用(/)</Link><br />
      <Link to={'/react-micro-one'}>跳转至子应用1(/react-micro-one)</Link><br />
      <footer>报错: 无匹配的路由,Link标签驱动的跳转只在当前路由上下文中跳转, 无法跳转到本微应用之外的路由</footer>
    </div>
    <div style={divStyle}>
      <header style={{ fontSize: '16px' }}>
        由window.history.pushState实现
      </header>
      <button onClick={() => {
        window.history.pushState('', '', '/')
      }}>跳转至主应用</button>
      <button onClick={() => {
        window.history.pushState('', '', '/react-micro-one')
      }}>跳转至子应用1</button>
      <footer style={{ color: 'red', fontWeight: 'bolder' }}></footer>
    </div>
    <div style={divStyle}>
      <header style={{ fontSize: '16px' }}>
        由window.location.href实现
      </header>
      <button onClick={() => {
        window.location.href = '/'
      }}>跳转至主应用</button>
      <button onClick={() => {
        window.location.href = '/react-micro-one'
      }}>跳转至子应用1</button>
      <footer>缺点: 页面会闪烁, 此跳转方式相当于输入url调用get请求(相当于刷新页面或者单独访问子应用), 而不只是单纯的'应用切换'</footer>
    </div>
    <img className="App-logo" alt="logo" />
    <footer>方法1-3在丢失主应用后都会失效</footer>
  </div>)
}
function App(props) {
  console.log('微应用2 拿到的history', props)
  return (
    <BrowserRouter basename="/react-micro-two">
      <Comp history={props.history}></Comp>
    </BrowserRouter>
  );
}
export default App;
