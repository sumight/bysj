var jsonParser = function(req,res){
    var body = req.body;
    if(!!body){
        try {
            req.body = JSON.parse(body);
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
        } catch (er) {
          // uh oh!  bad json!
          console.log('err：json 对象解析错误')
          res.statusCode = 400;
          return res.end('错误: ' + er.message);
        }
    }
}

module.exports = {
    jsonParser:jsonParser
}