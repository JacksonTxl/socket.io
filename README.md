# socket.io 选择吃饭地点
### 安装
安装socket.io <br/>
```
npm install socket.io
```
### 配置
#### server 
配置启动的服务，通过http server 启动<br/>
```
npm run server
```
#### client
通过启动的服务访问index.html页面，发送自己的名字到服务可以获取服务 推送回来的信息

### 说明文档
* socket.emit() ：向建立该连接的客户端广播
* socket.broadcast.emit() ：向除去建立该连接的客户端的所有客户端广播
* io.sockets.emit() ：向所有客户端广播，等同于上面两个的和

更多server api 请查阅https://github.com/socketio/socket.io/blob/master/docs/API.md <br/>
更多client api 请查阅https://github.com/socketio/socket.io-client/blob/master/docs/API.md
