import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerMicroApps, start } from 'qiankun';
import { createBrowserHistory } from '@remix-run/router';
const history = new createBrowserHistory()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerMicroApps([
  {
    name: 'micro-one', // app name registered
    entry: '//118.178.238.85:8081',
    // entry: '//localhost:3001',// dev
    container: '#micro-one',
    activeRule: '/react-micro-one',
  },
  {
    name: 'micro-two', // app name registered
    entry: '//118.178.238.85:8082',
    // entry: '//localhost:3002',// dev
    container: '#micro-two',
    // 三种写法
    // activeRule: '/react-micro-two',
    activeRule: (location) => String.prototype.startsWith.call(location.pathname, ['/react-micro-two']),
    // activeRule: (location) => location.pathname.startsWith('/react-micro-two'),
    props: {
      data: {
        name: 'appleyk',
        history: history
      }
    }
  },
]);

start(
  {
    sandbox: true
  }
);


