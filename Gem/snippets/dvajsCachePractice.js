/** 
 * 场景: 面向对象模式的 设计, 设计数据的元信息,类似遥感数据的元信息,通常元信息是不常变动的
 * 所以查询此类元信息时不需要频繁重新获取
 * 
 * 模板的获取是我们系统中比较常用的一个'操作'
 * 目前的获取方式 
 * 1.应用启动(组件挂载)时一把获取所有,页面不刷新就不更新。
 * 2.用到某个模板的时候再进行查询,不做缓存,每次交互都查询一次,全局一次性只能使用一种模板数据, 请求频率高。
 * 
 * 以下解决方案(模式)优点: 
 * 1.减少请求次数, 不必重启应用就可以更新, 前端数据模板的缓存的模式可以统一。
 * 2.有利于代码维护, 复用'数据模板'这一设计的应用,其前端部分可以复用这种模式管理数据模板,不用反复重写管理模板数据的代码。
 * 
*/
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
      // 判断用户查询的元信息对应的模板是否有缓存
      let templateCache = templates.find(item => item.template.code === categoryCode)
      // 没有缓存分为两种情况 1.从未请求数据模板 2.缓存池中没有某种类型模板的缓存
      // (templates.length > 0) 是为缓存过期的逻辑判断做准备,从未做过缓存就自然无法比较缓存是否过期, 不加此条件, 判断是否过期时程序会无法进行下去
      let isCached = (templates.length > 0) && (typeof templateCache !== 'undefined')
      /**元信息对应的模板缓存是否超过有效期 */
      let cacheOutDate = false
      // 有缓存的同时判断缓存是否'过期', '过期'的标准由常量指定(这里是5s的魔法值,可以改成配置式)
      if (isCached) {
        let cacheTimeString = templateCache.requestTimeStamp
        // 这里moment.js可以换成其他库, 只要能计算时间差就行
        let timeDiff = moment().diff(cacheTimeString, 'seconds')
        cacheOutDate = timeDiff > 5
      }
      /**模板有缓存且未过期, 则不查询模板 */
      if (isCached && !cacheOutDate) return

      const templateResponse = yield call(() => axiosFn.createAxios(axiosFn.getToken()).get(Url.templateGetUrl, { params: { category: categoryCode } }))
      if (templateResponse.data.status === 200) {
        // 记录请求的时间戳, 以备控制缓存的有效时间使用
        // 如果后端返回的数据中没有时间戳那么前端可以自己创建
        // let requestTimeStamp = moment().format('YYYY-MM-DD HH:MM:SS')
        let requestTimeStamp = templateResponse.data.timeStamp
        let newTemplate = templateResponse.data.data
        yield put({
          type: 'setTemplate',
          payload: {
            requestTimeStamp: requestTimeStamp,
            template: newTemplate,
          }
        })
      } else {
        message.error(templateResponse.data.message)
      }
    },
  }
}