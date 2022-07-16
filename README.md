# 云积分互动开发框架

## 如何开始
1. 下载本种子工程
2. npm i
3. npm run serve 启动开发

## 开发指引

### 新增路由
`不支持子路由`
``` js
// src/config.js
import step1 from './view/step1.vue';
import step2 from './view/step2.vue';

export default {
    // 路由规则配置
    // 路由规则会被合并到整个后台的规则配置中
    // 请尽量按照规定格式编写，其他的字段可能未做兼容
    // path 字段必须使用 / 开头，另外不能使用参数匹配， 比如 /create/:id, 参数在query做匹配
    routers: [
        { path: '/step1', component: step1 },
        { path: '/step2', component: step2 },
    ]
}
```
### 路由跳转
``` js
// 只能使用该方法进行跳转，参数传递只支持query
this.$router.push({ path: "/step1", query: {} });
```

### 获取路由参数
``` js
    console.info(this.$route.query);
```

## 配置互动的操作菜单
互动的操作菜单配置在 `src/tools.vue` 这是一个vue组件，按照设计以及elementUI，进行编码即可，相关的弹框操作，需要自己实现，在这个VUE组件中，还被注入了一些其他方法，可以直接使用它（挂载到了props下面）

1. 刷新互动活动列表页面 - 在触发编辑等动作后可以进行刷新。 this.updateInteractionList()

## 注意
1. 修改babel.config.js 可能会导致应用集成上线时无法编译通过，修改请与云积分沟通(kezy@jifenn.com)
2. 请勿修改 `jifenn-interaction-core` 目录，该目录仅针对开发有效，集成发布时此处代码没用
3. 请勿修改程序入口文件是 `main.js` 文件，该文件仅针对开发有效，集成发布时此处代码没用
4. 路由配置文件使用`config.js`文件，请按照格式编写，该文件作为集成发布的，请注意修修改
5. 支持 less, css, 请使用 `less` 并注意命名空间，防止集成发布时和其他业务冲突

## 线上调试
代理配置, 注意顺序

第一组
1. regex:(?inx)https://s1.enbrands.com/api
2. https://s1.enbrands.com/api

第二组
1. regex:(?inx)https://s1.enbrands.com/new
2. https://s1.enbrands.com/new

第三组
1. regex:(?inx)https://s1.enbrands.com/
2. http://localhost:8080/

然后访问 https://s1.enbrands.com/