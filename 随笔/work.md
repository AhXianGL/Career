## 九月工作总结--孙硕鲜

### 1、概述

#### 工作主线

1. **DMES-IPM定制版 v 1.0 alpha** 版本的Web前端开发

#### 工作支线

1. **heydat 4.1.0 release** 前端的bug的持续修订,前端业务逻辑代码优化,前端样式优化。
2. 参与**地图瓦片服务**(**全国卫星遥感影像数据服务系统**)前端的维护与更新。
3. 参与**资产检索系统 v 0.4.6-枣庄** 前端的维护与更新。

### 2、成果总结

<u>九月份工作日内 DMES-IPM定制版 v 1.0 alpha 共计 **69**次 commit</u>

#### 2.1 主线 DMES-IPM定制版 v 1.0 alpha: 

工作流
1. 删减前端基础设施(路由,页面,组件)。
2. 对照需求文档和UI/UE设计稿添加新的路由, 组件。
3. 测试, 实现交互设计需求中的细节, 修复bug。
4. 调整部分组件的组合结构, 封装可复用的组件, 优化代码质量。

成果
1. roadhog打包配置优化**最大代码片段(chunk)体积缩减**由原先的1.2M 降低为现在 的800kb。
2. 前端**顺利封装了依据json生成表单的组件**, 完全由数据驱动, 根据json内容实现表单渲染, 
实现了响应式的字段校验, 表单折叠, 表单值重置等交互需求, 并且在'重置项目','创建项目',
'工艺设计页面创建项目'三种场景**复用**该组件。
3. **封装了导入xml文件的组件**,可以根据BaseXml中的hasAdvance值控制用户是否可以上传AdvanceXml。
3. 完成了**UI/UE的升级**, DMES-IPM定制版 1.0.0-alpha 顺利进入测试。
4. 优化了部分**代码的风格和质量**, 添加大量注释。

#### 2.2 支线

成果
1. 修复了heydat 4.1.0 release测试文档中的bug, UI/UE更新已完成。
2. 支线工作 以webgis类型为主, 维护现有地图业务前端代码的过程中, 更深入地理解了leaflet
这类地图库的核心概念, 提升了自己对webgis领域前端技术的信心
3. 使用leaflet插件L.TileLayer.Canvas, 将TileLayer瓦片由原先的image转为Canvas在前端
渲染,**解决了地图瓦片之间白色间隙的问题**