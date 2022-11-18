# 工作日志

## 2022/08/01

1. ✅工艺列表中,单击其中某一项工艺记录尾部的"导出工艺按钮",导出的工艺文件(.craft),其文件名总是export.craft.

    Bug原因:工艺列表组件中pathTo函数中 调用
    ```javascript
    craftService.exportCraft(CraftId, CraftName)
    ```
    函数时,只传入了CraftId参数,导致CraftName函数传参错误,导出文件的结果异常.

2. ✅工艺设计页面,拖动工序节点,调用api层失败,暴露连接点时页面卡死.

    Bug原因:工艺设计编辑组件(CraftDesignEditor)移动工序节点位置时,触发父组件(CraftDesign)updateProcedureLoc 更新工序位置的函数调用
    ```javascript
    craftService.moduleInterfaceProcedure(procedureID, procedureWithPartFlag)
    ```
    多传入了一个 craft.id 参数,新版service已将该参数移除.

3. ✅工艺设计顶部导航栏右侧,"成员"弹框内添加成员操作报错.

    Bug原因: 新版projectService.deleteProjectMember 函数名出错

4. ✅工艺设计顶部导航栏右侧,"成员"弹框内'同上'操作异常.

    Bug原因: project.js dva modal 中*updateProjectMember Effect调用projectService.saveProjectMemberInfo()时函数传参错误

5. ✅工艺设计顶部导航栏右侧,"成员"弹框内'移除'操作报错.

    Bug定位: 

        ProjectService.js line194 deleteProjectMember

    Bug原因: 

        后端

6. ✅CraftRightTab 中生产配置选项卡 '编辑'/'添加'生产工具 弹框时报错.

    Bug定位:

        ProcedureToolConfig.jsx Line120 

    Bug原因:

        新版procedureService中获取工艺一级前置的函数名改为'getHeadProceduresCraft'

7. ✅工艺设计编辑器(条) 创建新的工序出错

    Bug原因:

        dva Effect中 yield call() 调用procedureService 对象中的函数时丢失this.将this.fnName 换成objName.fnName即可

## 2022/08/02

1. ✅编辑工艺模态框弹出时,出现Warning.(只在开发环境下出现)

    原因: 
    
        dataTypeList生成的option标签列表没有赋key属性.

2. ✅工艺列表页面,导入工艺接口返回`用户在位置[GxUser-PosOid：0；GxUser-PosOtype：0]不具备[工艺导入]权限列表中任一权限，接口访问失败', status: 10205`

    Bug原因:

        发送请求时headers缺少GxUser参数

3. ✅工艺列表页面,导出工艺,工艺文件内为空值.

    Bug原因:

        axios(config: AxiosRequestConfig<any>).then(res=>resolve(res)) 
        
        使用这样的写法发出request请求,config中所配置的responseType: 'arraybuffer' 无效,浏览器观察该网络请求,该请求的请求头中不携带responseType

    Bug解决方案:

    ```javascript
        // 先创建axios实例
        const createAxiosInstance = ()=>{
          return axios.create({
          headers:_headers
        })}
        createAxiosInstance({responseType: "arraybuffer"})
        .get(url)
    ```

        

4. ✅工艺列表页面,导入工艺接口返回`status: 10001, message: '工艺版本不兼容，导入失败'`

    Bug原因: 

        工艺导出下载文件为空

修改了部分变量名和函数名,删除部分无效的function

## 2022/08/03

1. ✅缩减工艺设计/调试/项目预览|进行 页面下 右侧表单的代码量,继续抽取组件,缩减代码量,提升封装性.

    优化思路:努力将`右侧表单`中对数据做出更改的函数 内置到右侧表单中`生产配置、之间配置等子Tab`中,其他页面下也可复用

## 2022/08/04

1. ✅右侧Table 质检配置 是否质检选项切换时 客户端崩溃闪退

    Bug原因: qcUnit字段值在单位切换之后从GxUnit对象转变为了纯数字,导致Select控件Value属性读值失败,web崩溃.

    已解决闪退崩溃等基本使用上的问题,代码亟需优化,需要改善 按模块更新 工序的方法,需要进一步完善"即点即存"的业务,`需要提升自己对'表单即点即存即更新'业务的理解,学习该类型业务的实现方式`

    值得学习的地方: `表单即点即存`业务的实现方式,前后端使用`业务模型对象`进行通信

## 2022/08/08

1. ✅将node-module中的gx-design-view 组件 搬入src中,完全移除node_modules中的gx-design-view,补充安装antd x6
2. ✅解决模块移除后import 语句路径报错的问题

    Bug原因:

    node_module语境下的gx-design-view模块,有自己的路径别名配置,导致将其直接搬入现有src目录下,当前webpack配置不适用于gx-design-view中的一些路径名称的使用

## 2022/08/09

1. ✅梳理CraftDesignEditor组件内部所有模态框的相关的逻辑,添加注释,改善变量名.
2. 理清gx-design-view 组件,将,添加注释,理解x6的用法与核心概念.
3. 梳理CraftDesignEditor与gx-design-view中CraftView与CraftEdit的联系(数据流,函数).
4. ✅探索大型工艺,选择工艺高亮时卡顿的原因(探索高亮显示的代码逻辑,尝试优化).

## 2022/08/10

1. ✅梳理右侧表单部分更新工序逻辑,理解目前代码的更新逻辑.
2. ✅右侧表单'是否质检'改为true时,给予默认存在第一道质检，且质检选择默认 是按人员选择,避免了首次将质检改为true时,没有默认质检项的问题. 

## 2022/08/11

1. ✅梳理CraftEdit中拖拽创建新的工序节点的逻辑,添加大量的注释.
2. ✅为创建投料口工序时弹出的模态框中的表单增加了"异常任务数量阈值"和"任务生成频率"字段.
3. ✅投料口节点 新增'已完成'和'异常'状态标签

## 2022/08/12

1. ✅加载工艺图性能提升1/3

## 2022/08/15

1. ✅按照蓝湖文档将投料口样式的风格改为与普通工序的风格相同,并且优化投料口右侧表单的样式.
2. 在左侧菜单列表中添加'字典'

## 2022/08/17

左侧菜单
系统域下项目按钮不展示
系统域下进入物料 查询物料列表 无需权限
系统域下进入工具 查询工具列表 无需权限
系统域下进入工艺 需要工艺浏览权限
系统域下进入用户 需要 "查看用户viewUser"权限
系统域下进入字典 不需要权限
系统域下进入团队菜单 不需要权限 根据权限获取特定的团队的列表

查询团队的时候不需要判断用户的权限
但是系统域下的团队列表是全部团队,
进入团队之后的团队列表是用户所属的团队

1. ✅修复了用户首次登陆,进入团队列表页面或者个人中心时,"权限不足,禁止访问哦!"的报错
2. ✅完成了系统域下菜单的交互,新增了动态路由,给'/system'路由添加路由参数'/system:clickedManuItem',由系统域下用户所点击的按钮中的<Link>标签的'to'属性传递路由参数,渲染system动态路由的时候根据location.params中的参数决定渲染哪个视图(用户视图或者是字典视图)
3. ✅严格控制系统域下的交互,`除选择团队之外`,都不改变"处于系统域"的状态(localStorage中的otype保持0),返回团队列表即返回系统域.

## 2022/08/18

1. ✅将系统域下的左上角团队logo改为新版本的黑蚁图片
2. ✅实现8/17日工作日志中所描述的系统域下点击特定菜单,展示特定内容的更新.目前项目中的工艺,物料,工具,成员还不能展示内容,系统域下与后端的交互还没对好

## 2022/08/19

1. ✅实现了系统域下工艺,物料,工具,用户,字典路由下的内容展示,请求系统域中的工艺,物料,工具,用户,字典成功.
2. ✅域的控制更严密,修复了otype为非0的情况下(团队域及项目域)进入团队列表时页面崩溃的bug
3. ✅梳理系统域下和非系统域下 HeyHeader组件的条件渲染逻辑,分成完整的两套,梳理按钮隐藏的逻辑,尝试重写或者优化代码结构.
   
## 2022/08/22

1. ✅修复了系统域进入工艺设计页面跳回团队列表的Bug
2. ✅修复了工艺设计页面进入工艺调试页面后无法返回工艺设计页面的bug
3. ✅修复了系统域下进入工艺设计页面 mypurview接口请求错误的bug

    Bug原因:
    > 进入工艺设计页面时,otype改为2,实际上系统域下的工艺还是属于系统域

4. ✅参考新版本的权限设计,重写整个APP的权限控制逻辑

## 2022/08/23

1. ✅更新权限设置请求函数,更新团队域中和UI交互

## 2022/08/24

1. ✅更新系统域中的权限设置交互,对接系统域权限查询,权限获取接口

## 2022/08/25

1. ✅完成右侧表单编辑状态判断,完成/修补项目中的工艺更新函数
2. ✅权限设置点开始查询用户权限(换接口)

## 2022/08/26

1. ✅设置权限模态框交互优化,从上一级域继承的权限置灰,用户对上一级域继承而来的权限编辑,本来就不会触发更新,所以置灰用户体验更佳

## 2022/09/05

开启工作支线: IPM定制版云端控制系统Web开发
工作描述: 将heydat 4.0.0版本的旧代码(重构之前)直接复制,对照ui/ue 删减代码
工作思路: 
1. 首先删减前端基础设施(路由,页面,组件)
2. 对照UI/UE设计修改细节
3. 优化

开启工作支线: 江苏省卫星遥感影像数据服务系统的维护