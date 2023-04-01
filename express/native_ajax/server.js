//import express
const express = require('express');

//build app object
const app = express();

//搭建路由规则
//request是对请求报文的封装
//response是对响应报文的封装
app.get('/server', (request, response)=>{
    //设置响应头,设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    //设置响应体
    response.send('Hello Ajax')
});

//可以接受任何请求
app.all('/server', (request, response)=>{
    //设置响应头,设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    //允许自定义响应头
    response.setHeader('Access-Control-Allow-Headers', '*');
    //设置响应体
    response.send('Hello Ajax post');
});
//可以接受任何请求
app.all('/json-server', (request, response)=>{
    //设置响应头,设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    //允许自定义响应头
    response.setHeader('Access-Control-Allow-Headers', '*');
    //响应一个数据
    const data = {
        name: 'yrz'
    };
    //对对象进行字符串转换
    let str = JSON.stringify(data);
    //设置响应体
    response.send(str);
});

app.get('/ie', (request, response)=>{
    //设置响应头,设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    //允许自定义响应头
    response.setHeader('Access-Control-Allow-Headers', '*');
    //设置响应体
    response.send('Hello Ajax IE');
});

//延时响应
app.get('/timer', (request, response)=>{
    //设置响应头,设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    setTimeout(() => {
        response.send('Hello Ajax timer');
    }, 3000);
    //设置响应体
    
});

//监听端口启动服务
app.listen(8000, ()=>{
    console.log("server has started, 8000 端口监听中...");
})