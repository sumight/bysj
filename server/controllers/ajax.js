var mvc = require('mvc'),
    Server = require('mongodb').Server,
    assert = require('assert'),
    Db = require('mongodb').Db,
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient;

module.exports = {
    login: function(params) {
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var users = db.collection('users');
            users.findOne(params, function(err, item) {
                assert.equal(null, err);
                if (item) {
                    var session = mvc.getNewSession();
                    session.user = item;
                    mvc.data({
                        status: "ok",
                        message: "登录成功",
                        data: item
                    })
                } else {
                    mvc.data({
                        status: "fail",
                        message: "用户名或密码错误",
                        data: {}
                    })
                }
                db.close()
            })
        })
    },
    register: function(params) {
        var user = params;
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var users = db.collection('users');
            users.insert(user, function(err, result) {
                assert.equal(null, err);
                users.findOne(user, function(err, item) {
                    assert.equal(null, err);
                    var session = mvc.getNewSession();
                    session.user = item;
                    mvc.data({
                        status: "ok",
                        message: "",
                        data: {}
                    });
                    db.close();
                })
            })
        })
    },
    /**
     * 获取学生所上的课程
     * @function getCoursesOfStudent
     */
    getCoursesOfStudent: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            var student_course = db.collection('student_course');
            student_course.find({
                studentId: session.user._id
            }).toArray(function(err, scs) {
                assert.equal(null, err);
                var coursesOfStudent = [];

                if (!scs || scs.length <= 0) {
                    mvc.data({
                        status: 'ok',
                        message: '',
                        data: coursesOfStudent
                    });
                    db.close();
                    return;
                }

                var scsLen = scs.length;
                var courses = db.collection('courses');
                for (key in scs) {
                    courses.findOne({
                        _id: scs[key].courseId
                    }, function(err, course) {
                        assert.equal(null, err);
                        if (course) coursesOfStudent.push(course);
                        scsLen--;
                        if (scsLen <= 0) {
                            mvc.data({
                                status: 'ok',
                                message: '',
                                data: coursesOfStudent
                            });
                            db.close();
                        }
                    })
                }
            })
        })
    },
    getCourseOfTeacher: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var courses = db.collection('courses');
            courses.find({
                teacherId: session.user._id
            }).sort({
                term: -1
            }).toArray(function(err, courses) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: courses
                });
                db.close()
            })
        })
    },
    getCourseOfTeacherWithLessons: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            var courses = db.collection('courses');
            courses.find({
                teacherId: session.user._id
            }).sort({
                term: -1
            }).toArray(function(err, courses) {
                assert.equal(null, err);
                var lessons = db.collection('lessons');
                var courseLen = courses.length;
                for (key in courses) {
                    lessons.find({
                        courseId: courses[key]._id
                    }).toArray(function(err, lessons) {
                        console.log('lessons', lessons);
                        assert.equal(null, err);
                        if (!lessons || lessons.length <= 0) return;

                        // courses[key].lessons = lessons;

                        for (key in courses) {
                            if (courses[key]._id.toString() === lessons[0].courseId.toString()) {
                                courses[key].lessons = lessons
                            }
                        }

                        courseLen--;
                        if (courseLen === 0) {
                            mvc.data({
                                status: 'ok',
                                message: '',
                                data: courses
                            });
                            db.close()
                        }
                    })
                }
            })
        })
    },
    getLessonOfCourse: function(params) {
        var courseId = new ObjectID(params.courseId);
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.find({
                courseId: courseId
            }).sort({
                updateDate: -1
            }).toArray(function(err, lessons) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: lessons
                });
                db.close()
            })
        })
    },
    /**
     * 获取当前用户的课程文档摘要
     */
    getDocSummaryOfCourse: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        var courseId = new ObjectID(params.courseId);
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.find({
                courseId: courseId,
                userId: session.user._id
            }, {
                fields: {
                    _id: 1,
                    docTitle: 1,
                    tags: 1,
                    type: 1,
                    updateDate: 1
                }
            }).sort({
                updateDate: -1
            }).toArray(function(err, docs) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: docs
                });
                db.close()
            })
        })
    },

    /**
     * 获取由教师创建的本课堂的文档
     */
    getDocSummaryOfLessonOfTeacher: function(params) {
        var lessonId = new ObjectID(params.lessonId);
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.findOne({
                _id: lessonId
            }, function(err, lesson) {
                assert.equal(null, err);
                var courses = db.collection('courses');
                courses.findOne({
                    _id: lesson.courseId
                }, function(err, course) {
                    assert.equal(null, err);
                    var documents = db.collection('documents');
                    documents.find({
                        lessonId: lessonId,
                        userId: course.teacherId
                    }).sort({
                        updateDate: -1
                    }).toArray(function(err, docs) {
                        mvc.data({
                            status: 'ok',
                            message: '',
                            data: docs
                        });
                        db.close()
                    })
                })
            })
        })
    },

    /**
     * 获取由教师创建的本课程的文档
     */
    getDocSummaryOfCourseOfTeacher: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        var courseId = new ObjectID(params.courseId);
        var teacherId = new ObjectID(params.teacherId);

        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.find({
                courseId: courseId,
                userId: teacherId
            }, {
                fields: {
                    _id: 1,
                    docTitle: 1,
                    tags: 1,
                    type: 1,
                    updateDate: 1
                }
            }).sort({
                updateDate: -1
            }).toArray(function(err, docs) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: docs
                });
                db.close()
            })
        })
    },
    getDocument: function(params) {
        var docId = new ObjectID(params.docId);
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.findOne({
                _id: docId
            }, function(err, document) {
                assert.equal(null, err);
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: document
                });
                db.close()
            })
        })
    },


    /**
     * 新建一个课堂，在新建课程的过程中同时新建一个演示文稿文档和一个课堂文稿文档
     * @function addLesson
     * @param courseId 课堂所属的课程id
     */
    addLesson: function(params) {
        // 验证登录
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        var courseId = new ObjectID(params.courseId);
        var lesson = {
            courseId: courseId,
            lessonTitle: "新建课程",
            summary: "点击编辑",
            updateDate: new Date(),
            createDate: new Date()
        }
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.insert(lesson, function(err, result) {
                assert.equal(null, err);

                // 添加演示文稿和课堂内容的文档
                var documents = db.collection('documents');
                var docOfPPt = {
                    docTitle: '新演示文稿',
                    content: '<h1 id="h1" contenteditable="true">新演示文稿</h1><p contenteditable="true">新演示文稿</p>',
                    type: '演示文稿',
                    shareType: '3',
                    lessonId: lesson._id,
                    userId: session.user._id,
                    tags: '',
                    createDate: new Date(),
                    updateDate: new Date()
                }
                var docOfContent = {
                    docTitle: '新课堂内容',
                    content: '<h1 id="h1" contenteditable="true">新课堂内容</h1><p contenteditable="true">新课堂内容</p>',
                    type: '课堂内容',
                    shareType: '3',
                    lessonId: lesson._id,
                    userId: session.user._id,
                    tags: '',
                    createDate: new Date(),
                    updateDate: new Date()
                }
                documents.insert([docOfContent, docOfPPt], function(err, result) {
                    assert.equal(null, err);
                    mvc.data({
                        status: 'ok',
                        message: '',
                        data: {}
                    });
                    db.close();
                })
            })
        });
    },
    addCourseDocument: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }
        var courseId = new ObjectID(params.courseId);
        var document = {
            courseId: courseId,
            docTitle: '新建文档',
            content: '<h1 id="h1" contenteditable="true">文档标题</h1><p contenteditable="true">副标题</p>',
            type: '一般',
            shareType: '4',
            tags: '',
            userId: session.user._id,
            createDate: new Date(),
            updateDate: new Date()
        }
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.insert(document, function(err, result) {
                assert.equal(null, err);
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: {}
                });
                db.close()
            })
        })
    },
    addLessonDocument: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }
        var lessonId = new ObjectID(params.lessonId);
        var document = {
            lessonId: lessonId,
            docTitle: '新建文档',
            content: '<h1 id="h1" contenteditable="true">文档标题</h1><p contenteditable="true">副标题</p>',
            type: '一般',
            shareType: '4',
            tags: '',
            userId: session.user._id,
            createDate: new Date(),
            updateDate: new Date()
        }
        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.insert(document, function(err, result) {
                assert.equal(null, err);
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: {}
                });
                db.close()
            })
        })
    },
    updateDocumentContent: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }
        var docId = new ObjectID(params[0].docId);
        var content = params[0].content;
        var docTitle = params[0].docTitle;
        var tags = params[0].tags;

        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.update({
                _id: docId,
                userId: session.user._id,
            }, {
                $set: {
                    content: content,
                    docTitle: docTitle,
                    tags: tags,
                    updateDate: new Date()
                }
            }, function(err, result) {
                assert.equal(null, err);
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: {}
                });
                db.close()
            })
        })
    },
    getDocsOfLesson: function(params) {
        var lessonId = new ObjectID(params.lessonId);
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var documents = db.collection('documents');
            documents.find({
                lessonId: lessonId,
                userId: session.user._id
            }, {
                fields: {
                    _id: 1,
                    docTitle: 1,
                    tags: 1,
                    type: 1,
                    updateDate: 1
                }
            }).sort({
                updateDate: -1
            }).toArray(function(err, docs) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: docs
                });
                db.close()
            })
        })
    },
    saveLessonInfo: function(params) {
        var lessonTitle = params[0].lessonTitle;
        var summary = params[0].summary;
        var lessonId = new ObjectID(params[0].lessonId);

        var db = new Db('bysj', new Server('localhost', 12355), {
            safe: false
        })
        db.open(function(err, db) {
            assert.equal(null, err);
            var lessons = db.collection('lessons');
            lessons.update({
                _id: lessonId
            }, {
                $set: {
                    lessonTitle: lessonTitle,
                    summary: summary,
                    updateDate: new Date()
                }
            }, function(err, result) {
                assert.equal(null, err);
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: {}
                });
                db.close()
            })
        })
    },
    /**
     * 根据courseid获取学习该课程的所有的学生
     * @function getStudentByCourse
     * @param courseId 课程id
     */
    getStudentByCourse: function(params) {
        var courseId = new ObjectID(params.courseId);
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            assert.equal(null, err);
            var student_course = db.collection('student_course');
            student_course.find({
                courseId: courseId
            }).toArray(function(err, scs) {
                assert.equal(null, err);
                var studentsOfCourse = [];

                if (!scs || scs.length <= 0) {
                    mvc.data({
                        status: 'ok',
                        message: '',
                        data: studentsOfCourse
                    });
                    db.close();
                    return;
                }

                var scsLen = scs.length;
                var users = db.collection('users');
                for (key in scs) {
                    users.findOne({
                        _id: scs[key].studentId
                    }, function(err, user) {
                        assert.equal(null, err);
                        if (user) studentsOfCourse.push(user);
                        scsLen--;
                        if (scsLen <= 0) {
                            mvc.data({
                                status: 'ok',
                                message: '',
                                data: studentsOfCourse
                            });
                            db.close();
                        }
                    })
                }
            })
        })
    },
    /**
     * 新建一个笔记
     * @function createLessonNote
     * @param lessonId 课堂编号
     */
    createLessonNote: function(params) {
        var session = mvc.getSession();
        if (!session || !session.user) {
            mvc.data({
                status: 'fail',
                message: '请登录',
                data: {}
            });
            return;
        }

        var lessonId = new ObjectID(params.lessonId);
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            var documents = db.collection('documents');
            var noteDoc = {
                docTitle: '笔记',
                content: '<h1 id="h1" contenteditable="true">新的笔记</h1><p contenteditable="true">新的笔记</p>',
                type: '笔记',
                shareType: '1',
                lessonId: lessonId,
                userId: session.user._id,
                tags: '',
                createDate: new Date(),
                updateDate: new Date()
            }
            documents.insert(noteDoc, function(err, result) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: {
                        _id: noteDoc._id
                    }
                });
                db.close();
            })
        })
    },
    /**
     * 获取一个学生所有的文档
     * @function getDocsOfStudent
     */
    getDocsOfStudent: function(params) {
        var studentId = new ObjectID(params.studentId);
        MongoClient.connect('mongodb://localhost:12355/bysj', function(err, db) {
            var documents = db.collection('documents');
            documents.find({
                userId: studentId
            }, {
                fields: {
                    _id: 1,
                    docTitle: 1,
                    tags: 1,
                    type: 1,
                    updateDate: 1
                }
            }).sort({
                updateDate: -1
            }).toArray(function(err, documents) {
                mvc.data({
                    status: 'ok',
                    message: '',
                    data: documents
                });
                db.close();
            })
        })
    }
}
