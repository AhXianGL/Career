// 非常 讨厌写笔记, 我做记录的根本原因是长期难以忍受互联网上的'无用信息', 发现自己思考也能解决很多问题并且更能触碰到问题的根源, 才决定自己做笔记, 这些记录或许只会在'初级阶段'有点作用,由于记录之前就是由自己实现,理解并频繁使用,写完基本就不会再看.
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
    display: flex;
    margin-top: 12px;
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
1. 在closure中的`timer(定时器)`的reference
2. 刷新/启动(首次执行被认为是'启动定时器',在timeOut之内再次执行重置了定时器,所以被认为是'刷新定时器')`timer(定时器)`的函数

从而实现了下述注释中的概念:
```js
  Fn = (a,b,c)=>{
    //...
  }
  debounced_Fn = Utils.debounce(Fn,timeBuffer);
  /*每一次调用 debounced_Fn,都在重置debounce(Fn,timeBuffer)
  所构造出的闭包(也是debounced_Fn所在的闭包)中的计时器(timer)*/
  函数调用方式的转变: Fn(a,b,c) => debounced_Fn(a,b,c),非常的简洁和语义化,开发者只需要关注when
  /where调用即可

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
防抖的实现非常简单,唯一难点其实不在'防抖',而在'this',在于setTimeout回调函数的执行上下文
理解debounce中对的this的处理需要掌握下述四点:
1. 箭头函数的声明方式对this的影响
2. setTimeout对函数执行时this的影像
3. 函数的调用方式对this的影响
4. bind/call/apply对this的影响以及和ArrowFun对this影响的优先级
下述案例读者可以自己尝试从而自己理解所谓的this问题.如感觉晦涩难懂,可以先补充js基础知识.
> 但是本人日常开发的过程中发现this问题其实可以由开发者在外部自己解决,即利用ArrowFun词法作用域的优先性,直接在函数声明的时候将this绑定好,这样防抖函数内部就不用考虑this的控制
>那为什么underscore/lodash或者社区中的很多防抖函数要考虑this问题呢?
>答案当然是这些团队/作者想要自己做的工具非常的'好用',用户不用关心this这种细节问题,只需要把debouce当作一个机器,只需要把想要'debounce'的函数往里面一丢,就可以变出一个debouced版本的函数,不用关心this问题,直接像使用原始函数(undebounced function)那样使用debouced版本的函数,很有趣,未来我有机会造轮子的话也是要有这样的思想的.
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
        console.log('this when invoked: ' , JSON.stringify(this))
    }
    _speak(...something){
        console.log(something)
        console.log('this when invoked: ' , JSON.stringify(this))
    }
    debouncedSpeakInMe = debounce(this.speak,1000)
    debounced_SpeakInMe = debounce(this._speak,1000)
}

let ssx = new Me({
    name: 'AhXian'
})

let debouncedSpeak = debounce(ssx.speak,1000)
let debounced_Speak = debounce(ssx._speak,1000)
debouncedSpeak('outer defined debounced speak')
debounced_Speak('outer defined debounced _speak')
ssx.debouncedSpeakInMe('inner defined debounced Speak')
ssx.debounced_SpeakInMe('inner defined debounced _Speak')
```

##### 2.throttle

#### 箭头函数词法作用域对this的决定性,优先于bind/apply/call对this的指定
所谓的词法作用域也就是箭头函数定义时的词法上下文,简而言之 在哪个词法作用域下定义箭头函数,箭头函数内部的this就指向什么.这种指定一旦发生就不接受更改(bind/apply/call都不能更改this指向)
```javascript
var name= 'global scope'
let scope = {
    name: 'scope'
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
plainFoo.apply(scope)//'scope'
```

#### react + dva缓存 实践

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