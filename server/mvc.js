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
            
        }
        res.end(req.method+JSON.stringify(req.body));
        // 分发和处理请求
        // for(var key in reqHandleList){
        //     var pathname = reqHandleList[key].pathname;
        //     if(pathname instanceof RegExp){
        //         if(!pathname.test(req.pathname)) continue;
        //         reqHandleList[key].cb(req,res);
        //     }else{
        //         if(pathname !== req.pathname) continue;
        //         reqHandleList[key].cb(req,res);
        //     }
        // }
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
    var filepath = path.join(filepath, pathname);
    fs.exists(filepath, function(exists) {
        if (exists) {
            fs.readFile(filepath, function(err, data) {
                assert.equal(null, err)
                res.writeHeader(200, {});
                res.end(data);
            })
        } else {
            res.writeHeader(404, {})
            res.end("未找到资源")
        }
    })
}

//for test 
server.listen(4000);