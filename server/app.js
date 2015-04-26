var app = require('./express.js'),
    tool = require('./tool.js'),
    data = require('./unrealData.js'),
    path = require('path'),
    fs = require('fs'),
    assert = require('assert'),
    ejs = require('ejs');


app.post('/document', function(req, res) {
    var params = req.body;
    res.write('params: ' + params);
    res.end(JSON.stringify(data.doc));
})

app.post('/user/name', function(req, res) {
    res.end(req.pathname);
})

app.post('/user/age', function(req, res) {
    res.end(req.pathname);
})

app.post('/courseOfTeacher.ejs',function(req,res){
    var userId = req.query.userId;
    responseEjs(req.pathname,res,{userId:userId});
})
app.post('/monitor.ejs',function(req,res){
    var userId = req.query.userId;
    responseEjs(req.pathname,res,{userId:userId});
})
app.post('/lessonOfTeacher.ejs',function(req,res){
    var lessonId = req.query.lessonId;
    /**
    * 从数据库中
    * 查询出lesson对象
    */
    responseEjs(req.pathname,res,{lessonId:lessonId,lessonTitle:'化学的原理（假数据）',summary:'化学原理简洁（假数据）'});
})
app.post('/createLesson',function(req,res){
    var courseId = req.query.courseId;
    /*新建一个lesson
    *
    */
    var lessonId = '';
    responseEjs('/lessonOfTeacher.ejs',{courseId:courseId});

})

// 设置默认主页面为index.html
app.post(/^\/(index)?$/, function(req, res) {
    console.log("index");
    req.pathname = '/index.ejs';
    responseEjs(req,res,{user:{name:'xjc',age:123}});
})

// 设置默认主页面为index.html
app.post(/^\/(index)?$/, function(req, res) {
    console.log("index");
    req.pathname = '/index.html';
    responseSourse(req, res);
})

// 获取页面资源html，js，css文件
app.post(/^\//, function(req, res) {
    responseSourse(req, res);
})
app.use(tool.jsonParser);
app.listen(3000);

/**
 * 获取一个页面的数据
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

/**
 * 渲染一个ejs页面，并且响应
 * @function responseEjs
 * @param {String} pathname 文件的路径
 * @param {HttpResponse} res 响应对象
 */
function responseEjs(pathname, res, pageData) {
    var filepath = path.join(__dirname, 'source');
    var filepath = path.join(filepath, pathname);
    fs.exists(filepath, function(exists) {
        if (exists) {
            fs.readFile(filepath, function(err, data) {
                assert.equal(null, err)
                res.writeHeader(200, {});
                res.end(ejs.render(data.toString(),pageData));
            })
        } else {
            res.writeHeader(404, {})
            res.end("未找到资源")
        }
    })
}

function isStringEndBy(mainStr, endStr) {
    var mainStrL = mainStr.length;
    var endStrL = endStr.length;
    if (mainStrL < endStrL) return false;
    if (mainStr.substr(-endStrL, endStrL) !== endStr) return false;
    return true;
}

