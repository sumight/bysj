var mvc = require('mvc'),
    Server = require('mongodb').Server,
    assert = require('assert'),
    Db = require('mongodb').Db,
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient;

module.exports = {
	courseOfTeacher: function(params){
        var session = mvc.getSession();
        var n = 'null';
        if(!session.name){
            session.name = "xjc";
        }else{
            n = session.name;
        }
        console.log(n);
        mvc.view(params);
	},
    lessonOfTeacher:function(params){
        if(!params.lessonId){
            mvc.view({});
            return;
        }

        var lessonId = new ObjectID(params.lessonId);
        var pageData = {
            lessonTitle:'',
            summary:''
        }
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.findOne({_id:lessonId}, function(err, item) {
                assert.equal(null, err);
                if(item) {
                    pageData.lessonTitle = item.lessonTitle;
                    pageData.summary = item.summary;
                }
                mvc.view(pageData);
                db.close()
            })
        })
    },
    monitor:function(params){
        mvc.view({})
    },
    courseOfStudent:function(params){
        mvc.view({})
    },
    lessonOfStudent:function(params){
        if(!params.lessonId){
            mvc.view({});
            return;
        }

        var lessonId = new ObjectID(params.lessonId);
        var pageData = {
            lessonTitle:'',
            summary:''
        }
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.findOne({_id:lessonId}, function(err, item) {
                assert.equal(null, err);
                if(item) {
                    pageData.lessonTitle = item.lessonTitle;
                    pageData.summary = item.summary;
                }
                mvc.view(pageData);
                db.close()
            })
        })
    },
    login: function(params){
        mvc.view({});
    },
    document: function(params){
        if(!params.docId){
            mvc.view({});
            return;
        }
        var docId = new ObjectID(params.docId);
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.findOne({
                _id: docId
            }, function(err, document) {
                mvc.view(document);
            })
        })
    }
}