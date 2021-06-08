### Webpack热更新

1. **webpack对文件系统 watch 。将新打包编译的结果保存至内存中**

   webpack-dev-middleware 调用 webpack 的 api 对文件系统 watch。当文件内容发生变化时，webpack重新对文件进行打包编译，并将结果保存至内存中。

   本应该打包构建至 output 的文件夹下的。但是memory-fs 是 webpack-dev-middleware 的一个依赖库，webpack-dev-middleware 将 webpack 原本的 outputFileSystem 替换成了MemoryFileSystem 实例，这样代码就将输出到内存中。

   打到内存中的好处，访问的更快，节省开销。浏览器请求bundle.js时，devServer直接去内存中找之前保存的

2. **devServer 通知浏览器端文件发生改变**

   服务端与客户端，建立webSocket长连接。在DevServer启动的时候建立。通过sockjs建立。以便将 webpack 编译和打包的各个阶段状态告知浏览器。

   关键步骤： webpack-dev-server 调用 webpack api 监听 compile的 `done` 事件，当compile 完成后，webpack-dev-server通过 `_sendStatus` 方法将编译打包后的 新模块 hash 值 发送到浏览器端。

3. **webpack-dev-server/client 接收到服务端消息做出响应**

   webpack-dev-server 修改了webpack 配置中的 entry 属性，在里面添加了 webpack-dev-client 的代码，这样在最后的 bundle.js 文件中就会有接收 websocket 消息的代码了。

   webpack-dev-server/client 接受到hash信息时，会现将此类信息保存起来，收到type为OK的消息后，对应用执行reload操作。

   在执行reload时，webpack-dev-server/client 会根据 hot 配置决定是刷新浏览器还是对代码进行热更新（HMR）

4. **webpack 接收到最新 hash 值验证并请求模块代码**

    webpack/hot/dev-server（以下简称 dev-server） 

   监听 webpack-dev-server/client 发送的 `webpackHotUpdate` 消息

   调用webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）中的 check 方法，检测是否有新的更新

   在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 `hotDownloadUpdateChunk` 和 `hotDownloadManifest` ，

    `hotDownloadManifest` 是调用 AJAX 向服务端请求是否有更新的文件，如果有将发更新的文件**列表**返回浏览器端，(ps:manifest(名单，货单)

   `hotDownloadUpdateChunk`是通过 jsonp 请求最新的模块代码，然后将代码返回给 HMR runtime，HMR runtime 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新。

5. **HotModuleReplacement.runtime 对模块进行热更新**

