/**
* 这个模块负责编辑器图片的操作
* @module image.plug
*/

define(['./plug.js',"../others/util.js","../others/image.js"],function(Plug,util,image){
	/**
	* 列表插件
	* @class ImagePlug
	* @extends Plug
	*/
	function ImagePlug(plugName){
		this.plugName = plugName;
	}
	ImagePlug.prototype = new Plug();

	/**
	* 对键盘事件的反应
	* @method actForKey
	* @for ImagePlug
	* @param {Event} event 键盘事件对象
	*/
	ImagePlug.prototype.actForKey = function(event){
		var keyName = util.getKeyName(event.keyCode);
		console.log(keyName);
		switch(keyName){
		case "Enter":
			enterHandle.call(this,event);
			break;
		case "Tab":
			tabHeandle.call(this,event);
			break;
		case "BackSpace":
			deleteHandle.call(this,event);
			break;
		case "UpArrow":
			upArrowHandle.call(this,event);
			break;
		case "DownArrow":
			downArrowHandle.call(this,event);
			break;
		case "LeftArrow":
			leftArrowHandle.call(this,event);
			break;
		case "RightArrow":
			rightArrowHandle.call(this,event);
			break;
		}
	}

	/**
	* 一个包含对列表的所有操作的对象，用于对外提供
	* @property operations
	* @for ImagePlug
	*/
	ImagePlug.prototype.operations = {

	}

	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for ImagePlug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	ImagePlug.prototype.getScope = getScope;
	function getScope(){

	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	ImagePlug.prototype.isCharge = function(){

	}

	// 用于处理事件的函数
	/**
	* 处理回车键事件
	* @function enterHandle
	* @param {Event} event 事件对象
	*/
	function enterHandle(event){

	}
	/**
	* 处理tab键事件
	* @function tabHeandle
	* @param {Event} event 事件对象
	*/
	function tabHeandle(event){

	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	*/
	function deleteHandle(event){

	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	*/
	function upArrowHandle(event){

	}
	/**
	* 处理下方向键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	*/
	function downArrowHandle(){

	}

	/**
	* 处理回车键事件
	* @function leftArrowHandle
	* @param {Event} event 事件对象
	*/
	function leftArrowHandle(){

	}
	/**
	* 处理回车键事件
	* @function rightArrowHandle
	* @param {Event} event 事件对象
	*/
	function rightArrowHandle(){

	}

	return new ImagePlug("imagePlug");	
})