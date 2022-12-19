import "./public_path";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

/**
 * 挂载和卸载需要保持root是同一个对象，不然浏览器会报警告信息
 * You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, 
 * call root.render() on the existing root instead if you want to update it.
 */
let root = undefined;

function getRoot(container) {
  if (root) {
    return root;
  }
  root = container
    ? createRoot(container.querySelector("#root"))
    : createRoot(document.querySelector("#root"));
  return root;
}

//将渲染过程封装，以便使用
function render(props) {
  const { container } = props;
  getRoot(container).render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  );
}

//如果不是被基座加载，则正常渲染
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

//bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
//通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。

export async function bootstrap() {
  console.log("react app bootstraped");
}
//应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法，以及监听基座传递的消息
export async function mount(props) {
  console.log("props from main framework", props);
  render(props);
  props.onGlobalStateChange((state, prev) => {
    console.log("子应用监听", state, prev);
  });
}

export async function unmount(props) {
  const { container } = props;
  getRoot(container).unmount();
  console.log("micro-one uninstall..");
  /** 这个地方切记要重置为未定义 */
  root = undefined;
}

export async function update(props) {
  console.log("update props", props);
}
