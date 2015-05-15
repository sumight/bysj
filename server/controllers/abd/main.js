var controllers = require('./mvc.js').controllers;

controllers.interface = {};
controllers.interface.courseOfTeacher = function(params){
    return view(params);
}
