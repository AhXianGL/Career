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

the most "safe" way of null/undefined check:
const condition = (item)=>(item === void 0 || item === null)

JavaScript has two “nonvalues” that indicate missing information, undefined and null:
JavaScript 有两种表示缺损信息的"空值",'undefined'和'null'
* **undefined** means “no value” (neither primitive nor object). Uninitialized variables, missing parameters, and missing properties have that nonvalue. And functions implicitly return it if nothing has been explicitly returned.
* **undefined** 表示"空`值`"(既不是原始数据类型,也不是对象)。未初始化的变量,缺损的参数,缺损的属性都用undefined表示。如果一个函数没有显示地指定返回值,那么将隐式地返回undefined。
* **null** means “no object.” It is used as a nonvalue where an object is expected (as a parameter, as a member in a chain of objects, etc.).
undefined and null are the only values for which any kind of property access results in an exception:
* **null** 表示"空`对象`",用于表示值为"对象"类型的变量的空值
> function returnFoo(x) { return x.foo }

> returnFoo(true)
undefined
> returnFoo(0)
undefined

> returnFoo(null)
TypeError: Cannot read property 'foo' of null
> returnFoo(undefined)
TypeError: Cannot read property 'foo' of undefined
undefined is also sometimes used as more of a metavalue that indicates nonexistence. In contrast, null indicates emptiness. For example, a JSON node visitor (see Transforming Data via Node Visitors) returns:

undefined to remove an object property or array element
null to set the property or element to null
Occurrences of undefined and null
Here we review the various scenarios where undefined and null occur.

Occurrences of undefined
Uninitialized variables are undefined:

> var foo;
> foo
undefined
Missing parameters are undefined:

> function f(x) { return x }
> f()
undefined
If you read a nonexistent property, you get undefined:

> var obj = {}; // empty object
> obj.foo
undefined
And functions implicitly return undefined if nothing has been explicitly returned:

> function f() {}
> f()
undefined

> function g() { return; }
> g()
undefined
Occurrences of null
null is the last element in the prototype chain (a chain of objects; see Layer 2: The Prototype Relationship Between Objects):

> Object.getPrototypeOf(Object.prototype)
null
null is returned by RegExp.prototype.exec() if there was no match for the regular expression in the string:

> /x/.exec('aaa')
null
Checking for undefined or null
In the following sections we review how to check for undefined and null individually, or to check if either exists.

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
    setTimeout(()=>{console.log('setTimeOut in promise1')})
    resolve('promise1 resolved')
});
let promise2 = ()=>new Promise((resolve,reject)=>{
    console.log('promise2 running')
    setTimeout(()=>{console.log('setTimeOut in promise2')})
    resolve('promise2 resolved')
});
const CallBack = ()=>{
    console.log('callBack Run')
    return 'callBack Finished'
}
function main(CallBack){
    console.log('1');
    console.log(CallBack())
    setTimeout(()=>{
        console.log('setTimeOut1 CallBack');
    });
    setTimeout(()=>{
        console.log('setTimeOut2 CallBack');
    });
    console.log('before promise1')
    promise1().then(res=>{
        console.log(res)
        setTimeout(()=>{
        console.log('setTimeOut3 CallBack');
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
main(CallBack)
```

#### typescript handbook nice sentences

>**Remember, generics are all about relating two or more values with the same type!** from typescript doc -> handbook -> More On Functions -> Constraints