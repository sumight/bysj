var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    ejs = require('ejs'),
    assert = require('assert');

var controllers = {};
var pathname = '';

var server = http.createServer(function(req,res){
    req.pathname = url.parse(req.url).pathname;
    /* global pathname */
    pathname = req.pathname;
    req.query = url.parse(req.url,true).query;
    req.setEncoding('utf8');
    req.on("data",function(chunk){
        if(req.body === undefined)
            req.body = ""
        req.body += chunk
    })
    req.on('end',function(){
        // 解析json对象
        if(!!req.body){
            req.body = JSON.parse(req.body);
            for(key in req.body){
                if(key.match(/^_id/)){
                    // 将ObjectID字符串传化成对应的对象
                    req.body[key] = new ObjectID(req.body[key])
                }
                if(key.match(/Date$/)){
                    // 将日期字符串转化成对应的对象
                    req.body[key] = new Date(req.body[key]);
                }
            }    
        }

        var responseData = null;

        if(!isControllerRequest(req)){
            responseSourse(req,res);
        }else{
            var params = extractParams(req);
            var names = req.pathname.split('/');
            names.shift();
            var method = controllers;
            for(key in names){
                console.log(method)
                var name = names[key];
                method = method[name];
            }
            var responseText = method(params);
            res.end(responseText);
        }
    })
})

/**
* 判断是否为控制器请求
* @function isControllerRequest
* @param {Request} req 请求对象
* @returns {Boolean} 
*/
function isControllerRequest(req){
    var pathname = url.parse(req.url).pathname;
    var hasSuffix = /\.[a-z]+$/.test(pathname);
    if(hasSuffix)
        return false;
    return true;
}

/**
 * 获取一个文本文件
 * @function getPage
 * @param {HttpRequest} req 响应对象
 * @param {HttpResponse} res 响应对象
 */
function responseSourse(req, res) {
    var pathname = req.pathname;
    var filepath = path.join(__dirname, 'source');
    /* global pathname */
    var filepath = path.join(filepath, pathname);
    fs.exists(filepath, function(exists) {
        if (exists) {
            fs.readFile(filepath, function(err, data) {
                assert.equal(null, err)
                res.writeHeader(200, {'Content-Type':'text/plain;charset=utf-8'});
                res.end(data);
            })
        } else {
            res.writeHeader(404, {})
            res.end("未找到资源")
        }
    })
}

/**
* 提取参数
* @function extractParams
* @param {Request} req http请求对象
* @returns {Object} 提取的参数
*/
function extractParams(req){
    var params = {};
    if(req.method === 'POST'){
        params[0] = req.body;
    }
    if(req.method === 'GET'){
        params = req.query;
    }
    return params;
}

/**
* 生成一个视图
* @function view
* @param {Object} data 数据
* @returns {String} html字符串
*/
function view(data){
    var filepath = path.join(__dirname, 'views');
    var filepath = path.join(filepath, pathname);
    filepath += '.ejs';
    console.log(filepath);
    if(fs.existsSync(filepath)){
        var fileData = fs.readFileSync(filepath).toString();
        return ejs.render(fileData,data);
    }    
}

/**
* 生成一个数据
* @function data
* @param {Object} data 数据
* @returns {String} 序列化的数据
*/

function data(data){
    return JSON.stringify(data);
}

/**
* 加载controllers路径下的所有控制器
* @function loadControllers
* @param {String} ctrlsPath 控制器的路径
* @returns {Object} 控制器对象
*/
function loadControllers(ctrlsPath){
    var dirArray = fs.readdir(ctrlsPath);
    for(var key in dirArray){
        var dir = dirArray[key];
        dddaaa
    }
}

exports.controllers = controllers;
exports.view = view;
exports.data = data;
exports.server = server;

// //for test 
// controllers.abc = {}
// controllers.abc.test = function(params){
//     return data(params);
// }
// server.listen(4000);