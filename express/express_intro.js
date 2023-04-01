//import express
const express = require('express');

//build app object
const app = express();

//搭建路由规则
//request是对请求报文的封装
//response是对响应报文的封装
app.get('/', (request, response)=>{
    //设置响应
    response.send('HELLO EXPRESS');
});

//监听端口启动服务
app.listen(8000, ()=>{
    console.log("server has started, 8000 端口监听中...");
})