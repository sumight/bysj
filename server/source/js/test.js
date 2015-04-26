var data = {
        docSummary: [{
            _id: '234567',
            docTitle: "这是一个文档",
            tag: '作业',
            type: 1,
            createDate: new Date(),
            updateDate: new Date()
        }, {
            _id: '334567',
            docTitle: "字数超过的文档标题好吧好吧",
            tag: '笔记',
            type: 1,
            createDate: new Date(),
            updateDate: new Date()
        }, {
            _id: '434567',
            docTitle: "正常的文档",
            tag: '论文',
            type: 1,
            createDate: new Date(),
            updateDate: new Date()
        }, {
            _id: '434567',
            docTitle: "课堂内容文档哈哈哈",
            tag: '作业',
            type: 3,
            createDate: new Date(),
            updateDate: new Date()
        }, {
            _id: '434567',
            docTitle: "ppt文档哈哈",
            tag: '论文',
            type: 4,
            createDate: new Date(),
            updateDate: new Date()
        }],
        courseSummary: [{
            _id: 'a2asd',
            courseName: "化学课",
            term: 3,
            teacherName: "teacher"
        }, {
            _id: 'a2asd',
            courseName: "英语课",
            term: 3,
            teacherName: "teacher"
        }, {
            _id: 'a2asd',
            courseName: "英语课",
            term: 3,
            teacherName: "teacher"
        }],
        courseSummaryWithLessonSummary: [{
            _id: 'a2asd',
            courseName: "化学课",
            term: 3,
            teacherName: "teacher",
            lessonSummary: [{
                _id: 'asf2342',
                lessonTitle: '化学元素周期表',
                summary: '介绍化学基础元素周期'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学实验基础',
                summary: '介绍烧杯的使用方法'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }],
        }, {
            _id: 'a2asd',
            courseName: "英语课",
            term: 3,
            teacherName: "teacher",
            lessonSummary: [{
                _id: 'asf2342',
                lessonTitle: '化学元素周期表',
                summary: '介绍化学基础元素周期'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学实验基础',
                summary: '介绍烧杯的使用方法'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }],

        }, {
            _id: 'a2asd',
            courseName: "英语课",
            term: 3,
            teacherName: "teacher",
            lessonSummary: [{
                _id: 'asf2342',
                lessonTitle: '化学元素周期表',
                summary: '介绍化学基础元素周期'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学实验基础',
                summary: '介绍烧杯的使用方法'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }, {
                _id: 'asf2342',
                lessonTitle: '化学表达式配平',
                summary: '介绍如何将一个简单的化学表达是配平'
            }],
        }],
        lessonSummary: [{
            _id: 'asf2342',
            lessonTitle: '化学元素周期表',
            summary: '介绍化学基础元素周期'
        }, {
            _id: 'asf2342',
            lessonTitle: '化学实验基础',
            summary: '介绍烧杯的使用方法'
        }, {
            _id: 'asf2342',
            lessonTitle: '化学表达式配平',
            summary: '介绍如何将一个简单的化学表达是配平'
        }, {
            _id: 'asf2342',
            lessonTitle: '化学表达式配平',
            summary: '介绍如何将一个简单的化学表达是配平'
        }],
        saveReslult: {
            result: "success/fail",
            Message: "fail message"
        },
        doc: {
            _id: "asdf3234",
            docTitle: "docTitle",
            content: '',
            type: '1',
            shareType: '2',
            tags: '23',
            lesson: {
                _id: 'asdf',
                lessonTitle: 'lessonTitle',
                summary: 'lessonSummary'
            },
            course: {
                _id: 'a2asd',
                courseName: "courseName",
                term: 3
            },
            docOwner: {
                _id: "asdf",
                userType: '2',
                userName: "name",
                accountNumber: '123424'
            }
        },
        userSummary: [{
            userName: '小明',
            _id: 'asdf',
            userType: '1',
            accountNumber: '201107670127'
        }, {
            userName: '小可',
            _id: 'asdf',
            userType: '1',
            accountNumber: '201107670124'
        }]
    }
    //     // course
    // updateCourseList(data.courseSummary);
    // updateLessonPut(data.lessonSummary);
    // updateCourseDocList(data.docSummary);
    // // lesson
    // updateLessonDocListOfTeacher(data.docSummary);
    // monitor
updateCourseListWithLesson(data.courseSummaryWithLessonSummary);
upateStudentList(data.userSummary);
updateDocPutOfMonitor(data.docSummary);
//courseOfstudent
updateCourseDocListOfStudent(data.docSummary,'teacher');
updateCourseDocListOfStudent(data.docSummary,'student');