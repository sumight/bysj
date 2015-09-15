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
        if (keydownCount >= 35) {
            keydownCount = 0;
            cb && cb();
        }
    })
}

/**
 * 在独立页面中编辑
 * @function editInAnohterPage
 * @param docBrief 要打开的文档简要
 */
function editInAnohterPage(docBrief) {
    console.log('dd')
    window.open('/interface/docEdit?docId=' + docBrief._id);
}

/**
* 将一个元素全屏显示
* @function showInFullScreen
* @param target 被全屏显示的元素
*/
function showInFullScreen(target){
    var windowWidth = window.innerWidth;
    target.webkitRequestFullScreen();
    console.log(target);
    $(target).find('p').css('text-align','center');
    target.style.maxWidth = (Math.floor(windowWidth*.75)+'px');

}