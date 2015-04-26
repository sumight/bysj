var http = require('http'),
    url = require('url');


var server = http.createServer(function(req,res){
    req.pathname = url.parse(req.url).pathname;
    req.query = url.parse(req.url,true).query;
    req.setEncoding('utf8');
    req.on("data",function(chunk){
        if(req.body === undefined)
            req.body = ""
        req.body += chunk
    })
    req.on('end',function(){
        // 使用request处理工具
        for(var key in reqToolList){
            reqToolList[key](req,res);
        }
        // 分发和处理请求
        for(var key in reqHandleList){
            var pathname = reqHandleList[key].pathname;
            if(pathname instanceof RegExp){
                if(!pathname.test(req.pathname)) continue;
                reqHandleList[key].cb(req,res);
            }else{
                if(pathname !== req.pathname) continue;
                reqHandleList[key].cb(req,res);
            }
        }
    })
})

// 请求处理列表
var reqHandleList = []
// 工具列表，用来对request进行处理
var reqToolList = []

express = {}
/**
* 处理一个post请求
* @method post
* @param {String} pathname 请求的路径
* @param {Function} cb 回调函数
* @for express
*/
express.post = function(pathname,cb){
    reqHandleList.push({pathname:pathname,cb:cb});
}

/**
* 使用一个req处理工具
* @method use
* @param {Function} tool 处理函数
* @for express
*/
express.use = function(tool){
    reqToolList.push(tool);
}

/**
* 开始对一个端口进行监听
* @method listen
* @param {Number} port 处理函数
* @for express
*/
express.listen = function(port){
    server.listen(port);
}

module.exports = express;