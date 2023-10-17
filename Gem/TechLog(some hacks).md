非常 讨厌写笔记, 我做记录的根本原因是长期难以忍受互联网上的'无用信息',没脑子的只会他妈的抄抄抄,永远他妈的都是浅尝辄止, 发现自己思考也能解决很多问题并且更能触碰到问题的根源, 才决定自己做笔记, 这些记录或许只会在'初级阶段'有点作用.
#### 弹性布局中实现响应式特定元素换行

如下述场景
<img src='./src/WrappingSpecificElementsOfFlexLayout.png'></img>

```css
//父级flex包含块
.flex-wrapper{
    display:flex;
    flex-wrap: wrap;
}
// @media screen 实现响应式
@media screen and (max-width: 1900px) {
    //需要响应式定位的子元素
    .second-flexitem-wrapper{
    /* other style properties... */
    /* ... ... */
    /* flex wrap specific style properties */
    flex-basis: 100%;
    flex-wrap: nowrap;
    order: 3;
    }
}
```

> 原理:
> 屏幕宽度小于一定值时,调整.filter-wrap弹性布局内flex item的顺序
> 将筛选项宽度置为100%保证其换行,再将其order置为flex布局中最后一个元素,保证其换到下一行

#### debounce与throttle
debounce与throttle的难点均不在其概念本身或者实现方式,而在于其涉及到的javascript underhood
##### 1.Debounce
###### 概述
> Prompt:
> Debouncing is a method of preventing a funciton from being
> invoked too often, and instead waiting a certain amount of
> time until it was last called before invoking it.

其本质就是一个高阶函数,接收一个function参数,和一个timeOut参数,
它返回一个包裹着定时器的'debounced version'函数,同时行形成一个closure,该closure由以下两个部分构成:
1. 在closure中的`timer(定时器)`的引用reference
2. 刷新/启动(首次执行被认为是'启动定时器',在timeOut之内再次执行重置了定时器,所以被认为是'刷新定时器')`timer(定时器)`的函数

从而实现了下述机制:
```js
  Fn = (a,b,c)=>{
    //...
  }
  debounced_Fn = Utils.debounce(Fn,timeBuffer);
  /*每一次调用 debounced_Fn,都在重置debounce(Fn,timeBuffer)
  所构造出的闭包(也是debounced_Fn所在的闭包)中的计时器(timer)*/
  函数调用方式的转变: Fn(a,b,c) => debounced_Fn(a,b,c),非常的简洁和语义化,开发者只需要关注when/where调用即可

  // this问题,已经由Fn函数的ArrowFunction声明(()=>{})自动传递,不需要bind
```
```js
  class Utils{
  static debounce(fn, timeBuffer) {
    let timer;
    return function(...args){
        const _this = this;
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(_this, args); // _this.fn(args);
        }, timeBuffer)
    }
  }
  // ...
  }
```

###### 思考
防抖的实现非常简单,难点其实不在'防抖',而在
1. 闭包(定时器的更新)
2. 'this'
3. setTimeout回调函数的this问题
理解debounce中对的this的处理需要掌握下述四点:
1. 箭头函数中的this
2. 函数的调用方式对this的影响(函数中的this)
3. setTimeout回调函数的this
4. bind/call/apply对this的影响以及和ArrowFun式函数声明对this影响的优先级
> 但是本人日常开发的过程中发现this问题其实可以由开发者在外部自己解决,即利用ArrowFun词法作用域的优先性,直接在函数声明的时候将this绑定好,这样改函数传递到防抖函数内部定时器中作为回调函数时就不用考虑this的控制
>那为什么underscore/lodash或者社区中的很多防抖函数要考虑this问题呢?
>答案当然是这些团队/作者想要自己做的工具非常的'好用',用户不用关心this这种细节问题,只需要把debouce当作一个机器,只需要把想要'debounce'的函数往里面一丢,就可以变出一个debouced版本的函数,不用关心this问题,直接像使用原始函数(undebounced function)那样使用debouced版本的函数,很有趣,未来我有机会造轮子的话也是要有这样的思想的.
下述案例读者可以自己尝试从而自己理解所谓的this问题.如感觉晦涩难懂,可以先补充js基础知识.
```javascript
function debounce (fn, timeBuffer){
    let timer;
    return function(){
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
          //fn丢失this
            fn(...arguments)
        },timeBuffer)
    }
}
function debounce(fn, timeBuffer){
    let timer;
    return function(...args){
        const _this = this;
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
          //fn绑定this
            fn.apply(_this, args); // _this.fn(args);
        }, timeBuffer)
    }
}
class Me {
    constructor(params) {
        this.name = params.name
    }
    speak = (...something)=> {
        console.log(something)
        console.log('this when invoked: ' , this)
    }
    _speak(...something){
        console.log(something)
        console.log('this when invoked: ' , this)
    }
    debouncedSpeakInMe = debounce(this.speak,1000)
    debounced_SpeakInMe = debounce(this._speak,1000)
}

let ssx = new Me({
    name: 'AhXian'
})

let debouncedSpeak = debounce(ssx.speak,1000)
let debounced_Speak = debounce(ssx._speak,1000)
// console ssx
debouncedSpeak('outer defined debounced speak') // 1
// console window
debounced_Speak('outer defined debounced _speak') // 2
// 1和2的不同说明了箭头式的函数声明 函数内部的this由声明时的"词法作用域"决定

// console ssx
ssx.debouncedSpeakInMe('inner defined debounced Speak') // 3
// console ssx
ssx.debounced_SpeakInMe('inner defined debounced _Speak') // 4
/* 3和4相同说明了传统方式声明的函数(debouce函数返回的函数)的this取决于其调用方式,
谁调用它this就指向谁 */

```

##### 2.throttle

#### 箭头函数词法作用域对this的决定性,优先于bind/apply/call对this的指定
所谓的词法作用域也就是箭头函数定义时的词法上下文,简而言之 在哪个词法作用域下定义箭头函数,箭头函数内部的this就指向什么.这种指定一旦发生就不接受更改(bind/apply/call都不能更改this指向)
```javascript
var name= 'global scope'
let fooScope = {
    name: 'fooScope'
}
let arrowFoo = ()=>{
    console.log(this.name)
}
let plainFoo = function() {
    console.log(this.name)
}
arrowFoo()           //'global scope'
arrowFoo.apply(scope)//'global scope'
plainFoo()           //'global scope'
plainFoo.apply(scope)//'fooScope'
```

#### react + dva 前端缓存实践

```javascript
export default {
    namespace: 'template',
    state: {
        templates: [],
    },
    reducers: {
        setTemplate(state, action) {
            let templates = [...state.templates]
            // 时间戳用于控制缓存时间
            let { requestTimeStamp, template } = action.payload
            // 某一模板的缓存'过期', 更新缓存
            let oldTemplateIndex = templates.findIndex(item => item.template.code === template.code)
            if (oldTemplateIndex !== -1) {
                // 更新模板缓存
                templates.splice(oldTemplateIndex, 1,
                    {
                        requestTimeStamp: requestTimeStamp,
                        template: template
                    })
            } else {
                // 某一模板首次请求, 直接入栈作为缓存, 不需要'更新'
                templates.push({
                    requestTimeStamp: requestTimeStamp,
                    template: template
                })
            }
            return { ...state, templates: templates }
        },
    },
    //dva中的 effect
    effects: {
        * queryMetaTemplateByCode(action, { call, put, select }) {
            let categoryCode = action.payload.categoryCode
            const templates = [...yield select(state => state.metadetail.templates)]
            // 判断用户查询的元信息对应的模板是否有缓存, 如果有缓存则不再重复请求
            let templateCache = templates.find(item => item.template.code === categoryCode)
            /**元信息对应的模板是否有缓存 */
            let isCached = (templates.length > 0) && (typeof templateCache !== 'undefined')
            /**元信息对应的模板缓存是否超过有效期 */
            let cacheOutDate = false
            // 有缓存的同时判断缓存是否'过期', '过期'的标准由常量指定
            if (isCached) {
                let cacheTimeString = templateCache.requestTimeStamp
                let timeDiff = moment().diff(cacheTimeString, 'seconds')
                cacheOutDate = timeDiff > 5
            }
            /**模板有缓存且未过期, 则不查询模板 */
            if (isCached && !cacheOutDate) return

            const templateResponse = yield call(() => axiosFn.createAxios(axiosFn.getToken()).get(Url.templateGetUrl, { params: { category: categoryCode } }))
            if (templateResponse.data.status === 200) {
                // 记录请求的时间戳, 以备控制缓存的有效时间使用
                let requestTimeStamp = templateResponse.data.timeStamp
                let template = templateResponse.data.data
                yield put({
                    type: 'setTemplate',
                    payload: {
                        requestTimeStamp: requestTimeStamp,
                        template: template,
                    }
                })
            } else {
                message.error(templateResponse.data.message)
            }
        },
    }
}

```

#### null and undefined

最靠谱的 null/undefined 空值检查:
const condition = (item)=>(item === void 0 || item === null)

JavaScript 有两种表示缺损信息的"空值",'undefined'和'null'
* **undefined** 表示"空`值`"(既不是原始数据类型,也不是对象)。未初始化的变量,缺损的参数,缺损的属性都用被undefined所表示。如果一个函数没有显示地指定返回值,那么也将隐式地返回undefined。
* **null** 表示"空`对象`",用于表示值为"对象"类型的变量的空值
* undefined、null 是仅有的两个访问其属性将会抛出异常的值.
***javascript
function returnFoo(x) { return x.foo }
returnFoo(true)
undefined
returnFoo(0)
undefined
returnFoo(null)
TypeError: Cannot read property 'foo' of null
returnFoo(undefined)
TypeError: Cannot read property 'foo' of undefined
***

undefined 通常用于表示"不存在"的含义. 相对而言, null 用来表示"空"的含义.
这一点体现在JSON.stringify和JSON.parse函数所接受的节点处理器上.
***javascript
function nodeVisitor(key,value){
    // ... ...some pre/post process code
    if('name' === key) return null;
    if('child' === key) return undefined;
    return value; //means keep the value as it is
}
let obj = {
    name:'obj',
    prop:{
        child:'child',
    }
};
let str = JSON.stringify(obj, nodeVisitor);
// str: '{"name":null,"prop":{}}'
***
可见JSON转换器函数的返回值为undefined时 有移除某个属性的作用(即表示"不存在"这个含义)
返回值为null 则将某个属性设为null(即表示"空"的含义),这一机制在前端构造某个接口所需参数之前对数据进行预处理很有用,可以在批量赋值之后剔除某些后端不需要的参数,或者指定某些参数为null。

大概枚举一下除用户自己制定之外,undefined 和 null 出现的场景
* undefined
1. 未初始化的变量
> var foo;
> foo
undefined
2. 未传递的参数
> function f(x) { return x }
> f()
undefined
3. 读取不存在的属性
> var obj = {}; // empty object
> obj.foo
undefined
4. 函数隐式返回
> function f() {}
> f()
undefined
> function g() { return; }
> g()
undefined

* null
1. 原型链的最顶层元素
> Object.getPrototypeOf(Object.prototype)
null
2. 正则表达式的 exec()方法无匹配项
> /x/.exec('aaa')
null

一般使用下述方法来对null和undefined做检测
Checking for null
You check for null via strict equality:

if (x === null) ...
Checking for undefined
Strict equality (===) is the canonical way of checking for undefined:

if (x === undefined) ...
You can also check for undefined via the typeof operator (typeof: Categorizing Primitives), but you should normally use the aforementioned approach.

Checking for either undefined or null
Most functions allow you to indicate a missing value via either undefined or null. One way of checking for both of them is via an explicit comparison:

// Does x have a value?
if (x !== undefined && x !== null) {
    ...
}
// Is x a non-value?
if (x === undefined || x === null) {
    ...
}
Another way is to exploit the fact that both undefined and null are considered false (see Truthy and Falsy Values):

// Does x have a value (is it truthy)?
if (x) {
    ...
}
// Is x falsy?
if (!x) {
    ...
}
WARNING
false, 0, NaN, and '' are also considered false.

The History of undefined and null
A single nonvalue could play the roles of both undefined and null. Why does JavaScript have two such values? The reason is historical.

JavaScript adopted Java’s approach of partitioning values into primitives and objects. It also used Java’s value for “not an object,” null. Following the precedent set by C (but not Java), null becomes 0 if coerced to a number:

> Number(null)
0
> 5 + null
5
Remember that the first version of JavaScript did not have exception handling. Therefore, exceptional cases such as uninitialized variables and missing properties had to be indicated via a value. null would have been a good choice, but Brendan Eich wanted to avoid two things at the time:

The value shouldn’t have the connotation of a reference, because it was about more than just objects.
The value shouldn’t coerce to 0, because that makes errors harder to spot.
As a result, Eich added undefined as an additional nonvalue to the language. It coerces to NaN:

> Number(undefined)
NaN
> 5 + undefined
NaN
Changing undefined
undefined is a property of the global object (and thus a global variable; see The Global Object). Under ECMAScript 3, you had to take precautions when reading undefined, because it was easy to accidentally change its value. Under ECMAScript 5, that is not necessary, because undefined is read-only.

To protect against a changed undefined, two techniques were popular (they are still relevant for older JavaScript engines):

Technique 1
Shadow the global undefined (which may have the wrong value):

(function (undefined) {
    if (x === undefined) ...  // safe now
}());  // don’t hand in a parameter
In the preceding code, undefined is guaranteed to have the right value, because it is a parameter whose value has not been provided by the function call.

Technique 2
Compare with void 0, which is always (the correct) undefined (see The void Operator):

if (x === void 0)  // always safe

#### promise,thenable,setTimeout,callback,function,event loop ...

```javascript
let promise1 = ()=>new Promise((resolve,reject)=>{
    console.log('promise1 running')
    setTimeout(()=>{
        console.log('task in promise1')
    },1000)//可以尝试改变这里的时间参数来探究Task先进先出的'队列'特性
    for (let index = 0; index < 100; index++) {
        queueMicrotask(()=>{console.log('second microTask group')})
    }
    resolve('promise1 resolved')
});
let promise2 = ()=>new Promise((resolve,reject)=>{
    console.log('promise2 running')
    resolve('promise2 resolved')
    for (let index = 0; index < 100; index++) {
        queueMicrotask(()=>{console.log('third microTask group')})
    }
    setTimeout(()=>{
        console.log('task in promise2')
    },1000)//可以尝试改变这里的时间参数来探究Task先进先出的'队列'特性
});
const CallBack = ()=>{
    console.log('callBack Run')
    return 'callBack Finished'
}
function main(CallBack){
    for (let index = 0; index < 100; index++) {
            queueMicrotask(()=>{console.log('first microTask group')})
    }
    console.log('main function start running');
    console.log(CallBack())
    setTimeout(()=>{
        for (let index = 0; index < 100; index++) {
            queueMicrotask(()=>{console.log(' microTask group in Task1')})
        }
        console.log('Task1 Finished');
    });
    setTimeout(()=>{
        console.log('Task2 Finished');
    });
    console.log('before promise1')
    promise1().then(res=>{
        for (let index = 0; index < 100; index++) {
            queueMicrotask(()=>{console.log('promise1 then microTask group')})
        }
        console.log(res)
        setTimeout(()=>{
        console.log('setTimeOut3 CallBack');
        for (let index = 0; index < 100; index++) {
            queueMicrotask(()=>{console.log(' microTask group in Task2')})
        }
        });
    });
    console.log('after promise1')
    console.log('before promise2')
    promise2().then(res=>{
        console.log(res)
        setTimeout(()=>{
        console.log('setTimeOut4 CallBack');
        });
    });
    console.log('after promise2')
    return 'main function finished and poped out from stack'
}
function function2(params) {
    return console.log('function2 finished')
}
console.log(main(CallBack))
function2()
```

#### typescript handbook nice sentences

>**Remember, generics are all about relating two or more values with the same type!** from typescript doc -> handbook -> More On Functions -> Constraints

#### make a immediately invoked setInterval

add patch to the window.setInterval fullfilling invoking callback when interval set up
```js
(function patchSetInterval (){
    const oldSetInterval = window.setInterval;
    window.setInterval = (callBack,timeRange)=>{
        callBack();
        return oldSetInterval.call(null,callBack,timeRange);
    }
})();
```

#### uri-like params in get request search params
axiosFn.createTokenAxios().get(rootUrl + `/assets/preview/file/extent`, {
        params: {
          path: btoa(encodeURIComponent(path))
        }
      })

history of the function eval in javascript(lose reference of this when indirectly invoke the eval function-- interesting)

### 实现前端定时请求改变UI的需求, 我更倾向于使用递归调用setTimeOut的方法而不是简单的setInterVal
#### 概述
**本问题的场景: 没有条件使用websocket协议进行前后端通信, 需要前端自己定时请求来刷新一些多用户共享的一些数据或是一些动态变化的数据。**

递归调用setTimeOut可以解决setInterVal回调函数中的请求不稳定造成的问题
```JS
// 举例: 
setInterVal(
  someRequest.then(res=>{
    do(res);
  }), 1000);

// ticker1: someRequest花了三秒
// ticker2: someRequest花了一秒
// ticker3: someRequest瞬时响应
// tickerN: ... ...
setInterval只能保证发起请求这个行为是等时间间隔的, 并不能保证请求成功响应后的所作的额外操作是等时间间隔的,这会导致不易察觉的bug: ticker1对 UI/数据 的修改很可能会覆盖掉ticker2对 UI/数据 的修改, 这不符合我们的期望。
我们重新思考需要解决的问题: 我们想定时循环调用一个函数, 并且需要保证其在时间序列上的先后顺序, 前后帧触发的函数的作用不可以互相干扰。
将这个问题拆成两个问题:
问题1: 函数调用的顺序必须是类似队列一样, 在时间线的维度上是有序的。
问题2: 函数的执行间隔是像定时器一样, 在时间线的维度上是等间隔的。
因为浏览器视角下, 对请求的响应时间是不知道的, 所以我们其实解决不了问题2, 我们只能解决问题1,想要保证ajax类型的函数及其回调函数 这一"操作整体" 是按照时间顺序一次一次执行的, 定时器是行不通的, 那么什么方法可以用来保证函数调用的先后顺序呢?
就是setTimeOut, 我们可以使用递归调用setTimeOut的方式, 在当前帧操作完成之后再定时发起下一帧操作。这样就巧妙地解决了问题1。

//实现方法: 
let timer = null // 用于防止内存泄漏
function initialization(params){
  timer = setTimeOut(()=>{
    someRequest.then(
      res=>{
        initialization(parms)
      }
    )
  },1000)
}
递归调用setTimeOut可以保证副作用的执行具有严格的时间先后顺序,不受网络波动的影响,实现了真正的副作用的定时器,而不仅是请求的定时器

其中一个核心的逻辑就是: 定时的请求!==定时响应,可能1s发送一次请求,但是不同帧(一次定时器的执行)发送出去的请求的响应, 并不一定就在下一帧到来之前回来, 因为同一个请求在不同帧的速度可能不同, 这种偶发的响应速度差异会导致请求的then函数的频率与定时器发生频率不一致。
```
#### 常见问题

1. 为啥递归调用setTimeOut不会造成js栈溢出呢?
经过测试确实不会栈溢出, 很有意思
因为setTimeOut回调函数不用栈存储,是事件机制队列控制的
1. 内存泄漏的问题
我们使用一个变量来存放timer,在每一帧给timer附上新的定时器, 在react应用中, 这个timer可以用ref来存放

### 前端下载文件

```javascript
let starTimeString = this.state.timeRange[0]
let endTimeString = this.state.timeRange[1]
if (!starTimeString || !endTimeString) {
    message.error('开始时间、结束时间不能为空')
} else {
    starTimeString = starTimeString.format('YYYY-MM-DD')
    endTimeString = endTimeString.format('YYYY-MM-DD')
}
axiosFn.createAxios(axiosFn.getToken()).get(dataUrl + '/order/excel/export', {
    params: {
        fromTime: starTimeString,
        toTime: endTimeString
    },
    responseType: 'blob'
}).then(res => {
    let blob = new Blob([res.data], {
        type: "application/vnd.ms-excel",
    });
    let downLoadName = '台账';
    let filename = downLoadName + ".xls";
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.style.display = "none";
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
})
```

### 前端无法获取到自定义响应头

客户端默认只能获取以下响应头信息

* Cache-Control
* Content-language
* Content-Type
* Expires
* Last-Modified
* Pragma

想要客户端可以获取到自定义响应头, 需要在响应头中添加 ``Access-Contorl-Expose-Headers : '响应头名称'``

### table-cell内容元素设置百分比高度不生效

背景: 想要改变某个table-cell内部的元素的布局又不想改变某个table-cell元素本身的样式, 那就需要在这个table-cell内部增加一层div作为填充, 改变这个div内部的元素的布局就相当于改变了table-cell内部元素的布局了. 

需要给table增加一个固定高度,height: 1px;

为什么是1px呢?因为这个固定高度要尽可能地小, 这样才不会导致table高度超出其内容本来具有的高度.

### 不占用css文档流空间的'边框'

我们使用大批量元素并且给这些元素增加边框时, 这些累加起来的边框会占用一定的css文档流空间, 会在某些场景下影响我们的布局, 使用box-shadow属性可以实现不占用文档流空间的假的边框效果.

### 正则表达式判断路径

文件路径有两种风格
1. windows: \node_modules\mapbox-gl\
2. unix: /node_modules/mapbox-gl/

所以比较通用的路径正则匹配应该是这样

``/[\\/]node_modules[\\/]mapbox-gl/``

### 如何调整GeoJsonLayer的视觉层级

创建mapPane 设置mapPane容器的zIndex , 再将geoJsonLayer添加到mapPane中

### promise 注意事项

```js
let pro = new Promise(resolve=>{resolve()}) //pro=>fullfilled
let pro1 = new Promise(resolve=>{return}) //pro1=>pending
无论pro1.then做什么 pro1永远处于pending状态

```

### redux abstract

You can think of a reducer as an event listener which handles events based on the received action (event) type.
 ref: [redux core concept snippet ](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#reducers)

 ### 数据驱动的成分进度条
 用css flex属性即可, flex无单位单值表示该元素分配的flex容器的剩余空间