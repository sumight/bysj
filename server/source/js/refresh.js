/**
 * 日期格式化输出
 * @function dateFormat
 * @param {Date} date 日期对象
 * @returns {String}
 */
function dateFormat(date) {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

/**
 * 设置ajax参数
 */
$.ajaxSetup({
    processData: false,
    type: 'POST',
    dataType: 'json'
});

/*for courseOfTeacher*/
/**
 * 刷新课程列表
 * @function refreshCourseList
 * @param {String} userId
用户编号
 */
function refreshCourseList(userId) {
        $.ajax({
            url: '/user/course_summary',
            data: JSON.stringify({
                userId: userId
            }),
            success: function(data) {
                updateCourseList(data);
            }
        })
    }
    /**
     * 刷新课程列表
     * @function updateCourseList
     * @param {CourseSummary} data
     */
function updateCourseList(data) {
    var courseSummary = data;
    var $listGroup = $('#course-list-box .list-group').first();
    $listGroup.html('');
    for (var key in courseSummary) {
        var courseBrief = courseSummary[key];
        var itemText = '<a class="list-group-item">' + courseBrief.courseName + '</a>';
        var item = $(itemText);
        item.data('model', courseBrief);
        $listGroup.append($(itemText));
    }
}

/**
 * 刷新课堂陈列
 * @function refreshLessonPut
 * @param {String} courseId
 */
function refreshLessonPut(courseId) {
        $.ajax({
            url: '/course/lesson_summary',
            data: JSON.stringify({
                courseId: courseId
            }),
            success: function(data) {
                updateLessonPut(data);
            }
        })
    }
    /**
     * 刷新课堂陈列
     * @function updateLessonPut
     * @param {LessonSummary} data 
     */
function updateLessonPut(data) {
    var lessonSummary = data;
    var $lessonPutBox = $('#lesson-put-box');
    $lessonPutBox.html('');
    for (var key in lessonSummary) {
        var lessonBrief = lessonSummary[key];
        var itemText = '<div class="col-xs-4"><a href="javascript:void(0)"><div class="panel panel-default lesson-ico"><div class="panel-heading"><h3 class="panel-title">' + lessonBrief.lessonTitle + '</h3></div><div class="panel-body">' + lessonBrief.summary + '</div></div></a></div>';
        var item = $(itemText);
        item.find('a').first().data('model', lessonBrief);
        $lessonPutBox.append(item);
    }
}

/**
 * 刷新课程文档列表
 * @function refreshCourseDocList
 * @param {String} userId 用户ID
 * @param {String} courseId 课程ID
 */
function refreshCourseDocList(userId, courseId) {
        $.ajax({
            url: '/user/course/doc_summary',
            data: JSON.stringify({
                userId: userId,
                courseId: courseId
            }),
            success: function(data) {
                updateCourseDocList(data);
            }
        })
    }
    /**
     * 更新课程文档列表
     * @function updateCourseDocList
     * @param {DocSummary} data 
     */
function updateCourseDocList(data) {
    var docSummary = data;
    var $listGroup = $('#course-doc-list-box .list-group').first();
    $listGroup.html('');
    for (var key in docSummary) {
        var docBrief = docSummary[key];
        var itemText = '<a class="list-group-item" href="javascript:void(0)"><p class="doc-name hide-text">' + docBrief.docTitle + '</p><p class="doc-update-time">' + dateFormat(docBrief.updateDate) + '</p></a>'
        var item = $(itemText);
        item.data('model', docBrief);
        $listGroup.append(item);
    }
    $listGroup.append('<a class="list-group-item add-item">+</a>');
}

/*for lessonOfTeacher*/
/**
 * 刷新课堂文档列表
 * @function refreshLessonDocListOfTeacher
 * @param {String} userId 用户ID
 * @param {String} lessonId 课堂ID
 */
function refreshLessonDocListOfTeacher(userId, lessonId) {
    $.ajax({
        url: '/user/lesson/doc_summary',
        data: JSON.stringify({
            userId: userId,
            lessonId: lessonId
        }),
        success: function(data) {
            updateLessonDocList(data);
        }
    })
}

/**
 * 跟新课堂文档列表
 * @function updateLessonDocListOfTeacher
 * @param {String} data 课堂ID
 */
function updateLessonDocListOfTeacher(data) {
    var $itemOfCourseContent = $('#lesson-content-doc').first();
    var $itemOfCoursePPT = $('#lesson-ppt-doc').first();
    var $otherDocList = $('#other-doc-list');
    var docSummary = data;
    $otherDocList.html('');
    for (var key in docSummary) {
        var docBrief = docSummary[key];
        if (docBrief.type === 3) {
            $itemOfCourseContent.text(docBrief.docTitle);
            $itemOfCourseContent.data('model', docBrief);
            continue;
        }
        if (docBrief.type === 4) {
            $itemOfCoursePPT.text(docBrief.docTitle);
            $itemOfCoursePPT.data('model', docBrief);
            continue;
        }
        var itemText = '<a class="list-group-item" href="javascript:void(0)"><p class="doc-name hide-text">' + docBrief.docTitle + '</p><p class="doc-update-time">' + dateFormat(docBrief.updateDate) + '</p></a>'
        var item = $(itemText);
        item.data('model', docBrief);
        $otherDocList.append(item);
    }
    $otherDocList.append('<a class="list-group-item add-item">+</a>');
}

/*for monitor*/

/**
 * 刷新监视器的课堂列表
 * @refreshCourseListWithLesson
 * @param {String} userId 用户编号
 */
function refreshCourseListWithLesson(userId) {
    $.ajax({
        url: '/user/course_summary/with_lesson_summary',
        data: JSON.stringify({
            userId: userId
        }),
        success: function(data) {
            updateCourseListWithLesson(data);
        }
    })
}

/**
 * 刷新监视器的课堂列表
 * @updateCourseListWithLesson
 * @param {CourseSummaryWithLessonSummary} data 用户编号
 */
function updateCourseListWithLesson(data) {
    var $courseList = $('#accordion').first();
    $courseList.html('');
    var courseSummary = data;
    for (var key in courseSummary) {
        var courseBrief = courseSummary[key];
        var courseItemText = '<div class="panel panel-default"><div class="panel-heading" role="tab" id="headingOne"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse' + key + '">' + courseBrief.courseName + '</a></h4></div><div id="collapse' + key + '" class="panel-collapse collapse"><div class="list-group"></div></div></div>'
        var $courseItem = $(courseItemText);
        $courseItem.find('a').first().data('model', courseBrief);
        $courseList.append($courseItem);
        var $lessonList = $courseItem.find('.list-group').first();
        // 
        for (var key1 in courseBrief.lessonSummary) {
            var lessonBrief = courseBrief.lessonSummary[key1];
            var lessonItemText = '<a class="list-group-item" href="javascript:void(0)">' + lessonBrief.lessonTitle + '</a>';
            var $lessonItem = $(lessonItemText);
            $lessonItem.data('model', lessonBrief);
            $lessonList.append($lessonItem);
        }
    }
}

/**
 * 刷新监视器的课堂文档
 * @function refreshDocPutOfMonitor
 * @param {String} userId
 * @param {String} lessonId
 */
function refreshDocPutOfMonitor(userId, lessonId) {
    $.ajax({
        url: '/user/course_summary/with_lesson_summary',
        data: JSON.stringify({
            userId: userId,
            lessonId: lessonId,
        }),
        success: function(data) {
            updateDocPutOfMonitor(data);
        }
    })
}

/**
 * 更新监视器的课堂文档
 * @function updateDocPutOfMonitor
 * @param {DocSummary} data
 */
function updateDocPutOfMonitor(data) {
        var docSummary = data;
        var $docPutBox = $('#doc-put-box');
        $docPutBox.html('');
        var groups = groupDocByTag(docSummary);
        for (var key in groups) {
            var group = groups[key];
            $tag = $('<div class="col-xs-12"><hr><p class="doc-label">' + key + '</p></div>');
            $docPutBox.append($tag);
            for (var key1 in group) {
                var docBrief = group[key1];
                $item = $('<div class="col-xs-4"><a href="javascript:void(0)"><div class="panel panel-default doc-ico"><div class="panel-body">' + docBrief.docTitle + '</div></div></a></div>')
                $item.find('a').first().data('model', docBrief);
                $docPutBox.append($item);
            }
        }
    }
    /**
     * 将docSummary按照标签分组
     * @function groupDocByTag
     * @param {DocSummary} docSummary
     * @returns {Groups}
     */
function groupDocByTag(docSummary) {
    var groups = {}
    for (var key in docSummary) {
        var docBrief = docSummary[key];
        if (groups[docBrief.tag] === undefined) {
            groups[docBrief.tag] = [];
        }
        groups[docBrief.tag].push(docBrief);
    }
    return groups;
}
function groupDocByTag1(docSummary) {
    var groups = {}
    for (var key in docSummary) {
        var docBrief = docSummary[key];
        if (groups[docBrief.tag] === undefined) {
            groups[docBrief.tag] = [];
        }
        groups[docBrief.tag].push(docBrief);
    }
    return groups;
}

/**
 * 刷新监视器的学生列表
 * @function refreshStudentList
 * @param {String} courseId 课程编号
 */
function refreshStudentList(courseId) {
    $.ajax({
        url: '/course/student_summary',
        data: JSON.stringify({
            courseId: courseId
        }),
        success: function(data) {
            upateStudentList(data);
        }
    })
}

/**
 * 更新监视器的学生列表
 * @function upateStudentList
 * @param {StudentSummary} data
 */
function upateStudentList(data) {
        var studentList = data;
        var $studentList = $('#student-list-box .list-group').first();
        $studentList.html('')
        for (var key in studentList) {
            var studentBrief = studentList[key];
            var itemStr = '<a class="list-group-item" href="javascript:void(0)">' + studentBrief.userName + '</a>'
            var $item = $(itemStr);
            $item.data('model', studentBrief);
            $studentList.append($item);
        }
    }
    /*for lesson of student*/

/**
 * 刷新学生的课堂文档列表
 * @function refreshCourseDocListOfStudent
 * @param {String} userId 用户ID
 * @param {String} teacherId 教师ID 
 * @param {String} courseId 课程ID
 */
function refreshCourseDocListOfStudent(userId, teacherId, courseId) {
    $.ajax({
        url: '/user/course_summary',
        data: JSON.stringify({
            userId: userId,
            courseId: courseId
        }),
        success: function(data) {
            updateCourseDocListOfStudent(data, 'student');
        }
    })
    $.ajax({
        url: '/user/course_summary',
        data: JSON.stringify({
            userId: teacherId,
            courseId: courseId
        }),
        success: function(data) {
            updateCourseDocListOfStudent(data, 'teacher');
        }
    })
}

/**
 * 更新学生的课堂文档列表
 * @function updateCourseDocListOfStudent
 * @param {DocSummary} data
 */
function updateCourseDocListOfStudent(data, docFrom) {
    var docSummary = data;
    if (docFrom === 'teacher') {
        var $docListOfTeacher = $('#course-doc-list-of-teacher');
        $docListOfTeacher.html('');
        for (var key in docSummary) {
            var docBrief = docSummary[key];
            var itemStr = '<a class="list-group-item" href="javascript:void(0)"><p class="doc-name hide-text">' + docBrief.docTitle + '</p><p class="doc-update-time">' + dateFormat(docBrief.updateDate) + '</p></a>';
            var $item = $(itemStr);
            $item.data(docBrief);
            $docListOfTeacher.append($item);
        }
        return;
    }
    if (docFrom === 'student') {
        var $docListOfStudent = $('#course-doc-list-of-student');
        $docListOfStudent.html('');
        for (var key in docSummary) {
            var docBrief = docSummary[key];
            var itemStr = '<a class="list-group-item" href="javascript:void(0)"><p class="doc-name hide-text">' + docBrief.docTitle + '</p><p class="doc-update-time">' + dateFormat(docBrief.updateDate) + '</p></a>';
            var $item = $(itemStr);
            $item.data(docBrief);
            $docListOfStudent.append($item);
        }
        return;
    }
}

/*for lesson of student*/

function main($scope, $http) {
    var url = '/document'
    $http.get(url).success(function(response) {
        $scope.data = response;
    })

    $scope.refreshAll = function(){
        $http.get(url).success(function(response) {
            $scope.data = response;
        })
    }
}
