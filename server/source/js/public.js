/**
 * 文档保存的触发器
 * @function docSaveTrigger
 * @param window 窗口对象
 * @param cb 触发器开启后的回调函数
 */
function docSaveTrigger(window, cb) {
    var keydownCount = 0;
    window.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.keyCode == '83') {
            cb && cb();
            event.preventDefault()
        }
        keydownCount++;
        if(keydownCount>=35){
            keydownCount = 0;
            cb && cb();
        }
    })
}
