/**
* 该模块为编辑器的一个功能插件，用来完成默认的操作
* @module default.plug
*/
define(['./plug.js',"../others/util.js"],function(Plug,util){
	/**
	* 默认插件
	* @class DefaultPlug
	* @extends Plug
	*/
	function DefaultPlug(plugName){
		this.plugName = plugName;
	}
	DefaultPlug.prototype = new Plug();

	/**
	* 对键盘事件的反应
	* @method act
	* @for DefaultPlug
	* @param {Event} event 键盘事件对象
	*/
	DefaultPlug.prototype.actForKey = function(event){
		var keyName = util.getKeyName(event.keyCode);
		switch(keyName){
		case "Enter":
			enterHandle.call(this,event);
			break;
		case "BackSpace":
			deleteHandle.call(this,event);
			break;
		case "Tab":
			tabHandle.call(this,event);
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
			rightArrowHandle(event);
			break;
		}
	}

	/**
	* 一个包含对标题所有操作的对象，用于对外提供
	* @property operations
	* @for DefaultPlug
	*/
	DefaultPlug.prototype.operations = {
		addParagraph:addParagraph,
		deleteParagraph:deleteParagraph,
		createParagraph:createParagraph,
		clearParagraph:clearParagraph
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	DefaultPlug.prototype.isCharge = function(){
		var theFocus = util.getFocusElement();
		if(theFocus.tagName != "P") return false;
		if(theFocus.parentNode.tagName != "SECTION") return false;
		return true;
	}

	// 用于事件处理的函数

	/**
	* 处理回车键事件
	* @function enterHandle
	* @param {Event} event 事件对象
	*/
	function enterHandle(event){
		var theFocus = util.getFocusElement();
		if(theFocus){
			insertParagraph(theFocus);
		}
		event.preventDefault();
	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	*/
	function deleteHandle(event){
		var theFocus = util.getFocusElement();
		if(theFocus&&isParagraphEmpty(theFocus)){
			// 如果当前的可编辑元素为空
			// 暂存空段落
			var p = theFocus;
			event.preventDefault();
			// 光标移动到上一个可编辑元素
			util.focusPreviousEditable(theFocus);
			// 删除当前的空段落
			theFocus.parentNode.removeChild(p);
			this.leave("skip");
		}
	}
	/**
	* 处理tab键事件
	* @function tabHandle
	* @param {Event} event 事件对象
	*/
	function tabHandle(event){
		event.preventDefault();
	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	*/
	function upArrowHandle(event){
		var selection = window.getSelection();
		var theFocus = util.getFocusElement();
		if(util.isFocusFirstOf(theFocus)){
			// 聚焦到上一个可编辑元素
			util.focusPreviousEditable(theFocus,true);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			this.leave("skip");
			event.preventDefault();
		}
	}
	/**
	* 处理下方向键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	*/
	function downArrowHandle(){
		var selection = window.getSelection();
		var theFocus = util.getFocusElement()
		if(util.isFocusLastOf(theFocus)){
			// 聚焦到上一个可编辑元素
			util.focusNextEditable(theFocus,false);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			this.leave("skip");
			event.preventDefault();
		}
	}

	/**
	* 处理左方向键事件
	* @function leftArrowHandle
	* @param {Event} event 事件对象
	*/
	function leftArrowHandle(){
		var theFocus = util.getFocusElement();
		var selection = window.getSelection();
		if(util.isFocusFirstOf(theFocus)){
			// 聚焦到上一个可编辑元素
			util.focusPreviousEditable(theFocus,false);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			this.leave("skip");		
			event.preventDefault();
		}
	}
	/**
	* 处理右方向键事件
	* @function rightArrowHandle
	* @param {Event} event 事件对象
	*/
	function rightArrowHandle(){
		var selection = window.getSelection();
		var theFocus = util.getFocusElement();
		if(util.isFocusLastOf(theFocus)){
			// 聚焦到上一个可编辑元素
			util.focusNextEditable(theFocus,true);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			this.leave("skip");
			event.preventDefault();
		}
	}
	/**
	* 插入一个段落
	* @function insertParagraph
	* @param theEditable 当前的可编辑元素
	*/
	function insertParagraph(theEditable){
		// 或得section
		var section = theEditable.parentNode;
		// 获取插入之前的元素
		var theAfter = theEditable.nextElementSibling;
		// 插入正文
		insertParagraphBefore(section, theAfter);
	}

	// #用于operations的函数

	/**
	* 在当前段落后面添加一个段落
	* @function paragraph
	*/
	function addParagraph(){
		var theFocus = util.getFocusElement();
		if(!theFocus){
			insertParagraph(theFocus);
		}
	}

	/**
	* 删除当前段落
	* @function deleteParagraph
	*/
	function deleteParagraph(){
		var theFocus = util.getFocusElement();
		if(theFocus){
			// 删除当前的空段落
			theFocus.parentNode.removeChild(p);
			this.leave("delete");
		}
	}

	/**
	* 新建一个段落
	* @function createParagraph
	* @param {Node} parentNode 在这个元素里面创建段落
	* @param {Node} afterNode 在这个元素之前创建段落
	*/
	function createParagraph(parentNode, afterNode){
		insertParagraphBefore(parentNode, afterNode)
	}

	/**
	* 如果当前的段落为空，则清理当前段落
	* @function clearParagraph
	*/
	function clearParagraph(paragraph){
		if(isParagraphEmpty(paragraph)){
			paragraph.parentNode.removeChild(paragraph);
		}
	}

	//其他内部函数

	/**
	* 判断一个段落是否为空
	* @function isParagraphEmpty
	* @param paragraph 待判断的段落
	*/
	function isParagraphEmpty(paragraph){
		if(paragraph.innerHTML===''){
			return true;
		}
		return false;
	}
	/**
	* 在一个段落之前插入一个段落
	* @function insertParagraphBefore
	* @param section 当前焦点所在的section
	* @beforeNode 插入在哪个section之前
	*/
	function insertParagraphBefore(section,beforeNode){
		var p = document.createElement('p');
		p.setAttribute('contenteditable','true');
		section.insertBefore(p,beforeNode);
		p.focus();
	}
	return new DefaultPlug("defalutPlug");
})