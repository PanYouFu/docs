---
sidebarDepth: 3
---

# Vue CLI 4.3  +  Element UI 项目搭建

## 前言

> Vue CLi 4+ 相较于 cli3 的改动不算大，但和 cli 2 还是有不少不同的地方。而我们现有的项目基本是基于cli2 进行搭建，故而整理此文档供大家参考如何使用cli 4。包含测试环境区分，添加mock服务等。

## 安装cli

Node 版本要求。Vue CLI 需要 [Node.js](https://nodejs.org/) 8.9 或更高版本 (推荐 8.11.0+)。

*默认使用 npm*

```sh
npm install -g @vue/cli
```

安装后，可在命令行中访问 `vue` 命令。

```sh
vue --version
```

## 基础搭建

### 创建项目

1. 使用`vue-create app-name`创建项目。
2. 选择配置(babel，router等)。

```sh
C02Q6H0KFVH5:cliTest pankaixin792$ vue create cli-test	// 输入项目名

Vue CLI v4.3.1
// 选择配置，若之前配置过可选择自己的默认配置，此处我们选择自定义
? Please pick a preset: (Use arrow keys) 
	myvue-default (less, babel, router, vuex, eslint) 
  vue-default (less, babel, router, vuex, eslint) 
  default (babel, eslint) 
❯ Manually select features 
```

### 自定义配置

根据提示选择项目所需配置，本次演示添加 `Babel` `Router` `Vuex` `CSS Pre-processors` `Linter / Formatter` 。

```sh
Vue CLI v4.3.1
? Please pick a preset: Manually select features
? Check the features needed for your project: 
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
❯◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

### 详细配置

1. `Router`是否使用history模式路由。本次使用`hash`模式。

   [*history模式与hash模式路由的差别*](https://www.jianshu.com/p/9449d7605279)、[*Vue的History模式和Hash模式的区别理解*](https://zhuanlan.zhihu.com/p/127186558)

   ```sh
   Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) n
   ```

2. 选择`CSS预处理器` ，本次使用`less` 。

   ```sh
   Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): 
     Sass/SCSS (with dart-sass) 
     Sass/SCSS (with node-sass) 
   ❯ Less 
     Stylus 
   ```

3. 选择` linter`， 选择标准规范，后续根据前端委员会添加自定义规则。

   ```sh
   Pick a linter / formatter config: 
     ESLint with error prevention only 
     ESLint + Airbnb config 
   ❯ ESLint + Standard config 
     ESLint + Prettier 
   ```

4. 选择何时触发`lint`  。
   ```sh
   Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
   ❯ ◉ Lint on save
     ◯ Lint and fix on commit
   ```
   
5. 选择将配置放置何处，放置在package.json中。

   ```
   Where do you prefer placing config for Babel, ESLint, etc.? 
   	In dedicated config files 
   ❯ In package.json 
   ```

6. 将上述配置设为以后的优先选项。

   ```sh
   Save this as a preset for future projects? (y/N) y
   ```

7. 生成项目的目录结构为：   </br>
![屏幕快照 2020-05-18 上午11.22.42](./catalogue.png)


### 启动与打包
在生成的`package.json` 的`scripts` 命令里包含 `serve` 、`build` 命令。`npm run serve` 启动服务；`npm run build  `打包资源。

```javascript
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint"
},
```

通过上述步骤，完成项目的基础建设，可以跑通运行。但多环境搭建，mock服务等还需要进一步配置。

## 多环境配置

> 在一个常规项目中，我们除了需要开发环境与生产环境外，还需要有测试环境。

+ 在根目录文件夹下新建下新建`.env`文件夹。`.env`文件夹下新建 `.prod`   `.test `文件

+ 配置`.prod`   `.test ` 文件，`VUE_APP_BASE_URL` 可以用于设置不同环境下axios 的访问路径

  ```sh
  // .prod
  NODE_ENV="production"
  VUE_APP_BASE_URL="https://xxx.com.cn/"
  ```

  ```sh
  // .test
  NODE_ENV="test"
  VUE_APP_BASE_URL="https://yyy.com.cn/"
  ```

  ```javascript
  // NODE_ENV VUE_APP_BASE_URL 内容在项目中可以这样获取
  console.log(process.env.NODE_ENV)
  console.log(process.env.VUE_APP_BASE_URL)
  ```

+ 修改 `package.json`

  ```javascript
  // 修改 scripts
  "scripts": {
    "serve": "vue-cli-service serve",
    "test": "vue-cli-service build --mode test",
    "build": "vue-cli-service build --mode production",
    "lint": "vue-cli-service lint"
   },
  ```

###webpack相关配置

> 在使用vue-cli3创建项目后，因为webpack的配置均被隐藏了，当你需要覆盖原有的配置时，则需要在项目的根目录下，新建vue.config.js文件，来配置新的配置。

## vue.config.js基础配置

vue.config.js会被自动加载。

```javascript
module.exports = {
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，使用publicPath */
  /* 部署应用包时的基本 URL。*/
  /* 可以设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。 */
  publicPath: process.env.NODE_ENV === 'production' ? './' : 'my-test',
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: 'dist',
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: 'assets',
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  filenameHashing: true,
  /* 代码保存时进行eslint检测 */
  lintOnSave: true,
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    compress: true,
  },
  css: {
    sourceMap: true // 开启 CSS source maps
  }
}
```

## 简单调整 webpack 配置

> 调整 webpack 配置最简单的方式就是在 `vue.config.js` 中的 `configureWebpack` 选项提供一个对象，该对象将会被 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并入最终的 webpack 配置。

实际运用中我们需要基于环境有条件地配置行为，可以将 `configureWebpack`换成一个函数 (该函数会在环境变量被设置之后懒执行)。

应用举例：配置删除`console`的插件

```javascript
// vue.config.js
module.exports = {
  configureWebpack: (config) => {
    // 入口文件
    config.entry.app = ['babel-polyfill', './src/main.js']
    // 删除console插件
    const plugins = [
      new UglifyJSPlugin({
        uglifyOptions: {
          warnings: false,
          output: {
            // 去掉注释内容
            comments: false
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
    // 只有打包生产环境才需要将console删除且不打开source-map
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
    } else {
      config.devtool = 'source-map'
    }
  }
}
```

## 引入Element UI

安装依赖

```
npm install element-ui
```

完整引入

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

## mock服务搭建

### 引入`axios`

```sh
npm install axios // 安装依赖
```

在src下新建`axios`文件夹，创建`interceptor.js`，`axiosConfig.js`。

`interceptor.js`中配置请求，`axiosConfig.js`中将请求挂在到`Vue.prototype`中。

```javascript
// interceptor.js
import axios from 'axios'
import Api from '@/common/api'

const service = axios.create({
  withCredentials: true, // 表示跨域请求时是否需要使用凭证
  crossDomain: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
})

const httpError = (error) => {
  // 响应错误处理，可在此处统一对异常进行处理
  return Promise.reject(error)
}

/** **** request拦截器==>对请求参数做处理 ******/
const requestInterceptor = (axiosRequest) => {
  // 可在此处对请求做统一处理，如对请求参数
  // axiosRequest.data = stringify(axiosRequest.data)
  return axiosRequest
}

/** **** respone拦截器==>对响应做处理 ******/
const responseInterceptor = (axiosResponse) => {
  // 可在此处对某些特殊状态提前处理，不进入业务逻辑代码
  return Promise.resolve(response)
}

service.interceptors.request.use(requestInterceptor, httpError)
service.interceptors.response.use(responseInterceptor, httpError)
export default service
```

```javascript
// axiosConfig.js
import server from './interceptor'
export default {
  install (Vue) {
    Vue.prototype.$get = function (url, params = {}) {
      return new Promise((resolve, reject) => {
        server
          .get(url, {
            params: params
          })
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
    Vue.prototype.$post = function (url, data = {}) {
      return new Promise((resolve, reject) => {
        server.post(url, data).then(
          response => {
            resolve(response.data)
          },
          err => {
            reject(err)
          }
        )
      })
    }
  }
}
```

在`main.js` 中引入 `axiosConfig`。

```javascript
import axiosConfig from './axios/axiosConfig'
```

在vue文件中使用。

```javascript
const params = { mobile: '13866669999' }
this.$post(API.SEND_CODE, params).then(res => {
	console.log('post------res----', res)
})
```

### 搭建服务

> 我们搭建mock服务，旨在开发阶段模拟接口请求，获取后端接口返回数据，编写相应数据所需的前端渲染与交互逻辑。如果我们能在本地服务中对每一次的请求进行拦截，根据请求路径的差异，返回我们所需的结果，那么就可以达到我们的需求。

#### 拦截请求

在`vue.config.js`的 `devServer`对象中 ，使用`before` 钩子函数，用来监听来自web的http请求。[devServer.before如何使用](https://www.webpackjs.com/configuration/dev-server/#devserver-before)

```javascript
// vue.config.js
const Interceptor = require('./mock/mock.js') // 引入编写好的mock服务

devServer: {
	before (app) {
		if (process.env.VUE_APP_HOST_ENV === 'mock') {
    	Interceptor(app) // 只有当启动mock服务时，才进行拦截，并使用mock
    }
	}
}
```

#### mock.js

根目录下新建`mock` 文件夹，创建`mock.js`。`mock`文件夹下创建`api`文件夹，存放莫宁接口返回数据的js文件。接口与js文件一一对应。

```javascript
// api/sendCode.js (模拟验证码接口)
// 返回一个对象，key为接口请求相对路径，value为模拟的预期返回结果
module.exports = {
  '/mp/measureAmt/login/sendCode': {
    data: {
      name: 'hahahah',
      codeNum: 22222222
    },
    code: 200,
    message: 'abc'
  }
}
```

```javascript
// mock.js(提前安装mockjs，klaw依赖)
const Mock = require('mockjs')
const path = require('path')
const klaw = require('klaw')
const mockDir = path.join(process.cwd(), 'mock/api')

const routers = {} // 存放由接口相对路径与模拟的预期返回结果组成的一个个键值对
const mockFiles = [] // 存放mock/api 下的文件

function interceptor (app) {
  klaw(mockDir)
    .on('data', (file) => {
      if (path.extname(file.path) !== '.js') return
      mockFiles.push(file.path)
    })
    .on('end', () => {
      mockFiles.forEach((file) => {
        try {
          const router = require(file) // require mock文件夹下的文件
          Object.assign(routers, router)
        } catch (error) {
          console.log(error)
        }
      })
    })
  // 处理get，post请求；
  // 第一个参数可以是一个正则，匹配你所需要的接口
  // 第二个参数是在devServer中拦截到的请求的请求路径
  app.get('*', (req, res) => {
    const result = Mock.mock(routers[req.path])
    res.json(result)
  })
  app.post('*', (req, res) => {
    const result = Mock.mock(routers[req.path])
    res.json(result)
  })
}

module.exports = interceptor
```

#### 配置执行命令

在`package.json`中配置mock服务启动命令

```json
"scripts": {
  "serve": "vue-cli-service serve",
  "serve:mock": "vue-cli-service serve --mock",
  "test": "vue-cli-service build --mode test",
  "build": "vue-cli-service build --mode production",
  "lint": "vue-cli-service lint"
},
```

在vue.config.js中获取命令语句的参数，判断是否执行mock服务

```javascript
// vue.config.js
const Interceptor = require('./mock/mock.js')

// 获取VUE_APP_HOST_ENV 判断是否是mock
process.env.VUE_APP_HOST_ENV = process.argv[process.argv.length - 1].split('--')[1]

module.exports = {
 	... // 省略其余配置
  devServer: {
    ... // 省略其余配置
    before (app) {
      if (process.env.VUE_APP_HOST_ENV === 'mock') {
        Interceptor(app)
      }
    }
  }
}
```

### proxy代理设置

在项目联调阶段，我们需要通过配置代理，用于连接后端开发启动的服务器。

通常我们在`vue.config.js`的`devServe`中配置。

```javascript
// vue.config.js
module.exports = {
  ... // 省略其余配置
  devServer: {
    ... // 省略其余配置
    /* 使用代理 */
    proxy: {
      /* 匹配规则，匹配到路径中包含 myapi 则使用代理 */
      '/myapi': {
        /* 目标代理服务器地址 */
        // target: 'https://xxx-stg1.ph.com.cn/',
        target: 'http://10.181.0.10:8890', 
        /* 允许跨域 */
        changeOrigin: true,
        pathRewrite: { // 路径重写
          '^/api': ''
        }
      }
  }
}
```



##  小结

至此，我们项目基本是搭建初始化完成了，一个使用`ElementUI`，使用`vuex` 进行状态管理，有多环境配置，可以本地mock与联调，且有着相关`lint`校验的项目。但是我们在正式开发中还需要根据实际业务场景，逐步完善我们的一些公共文件，如常量，公共方法等；同时也需要丰富我们的`vue.config.js`，`axios`等文件。

相对`vue cli 2+` 来说，`cli 4+`移除了`.build`文件夹，帮我们完成了很多前期准备，如代码压缩，css预处理等插件的配置。同时也新增了`vue.config.js`文件，方便开发根据实际场景新增或覆盖`webpack`配置。所以相对来说对开发人员还是较为友好的。