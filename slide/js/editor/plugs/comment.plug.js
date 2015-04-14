/**
* 该模块为编辑器提供列表功能
* @module list.plug
*/
define(['./plug.js',"../others/util.js"],function(Plug,util){
	/**
	* 列表插件
	* @class CommentPlug
	* @extends Plug
	*/
	function CommentPlug(plugName){
		this.plugName = plugName;
	}
	CommentPlug.prototype = new Plug();

	/**
	* 对键盘事件的反应
	* @method actForKey
	* @for CommentPlug
	* @param {Event} event 键盘事件对象
	*/
	CommentPlug.prototype.actForKey = function(event){
		var keyName = util.getKeyName(event.keyCode);
		// 判断事件是否继续传递，首先传递到非内联插件的事件处理
		var isGoToBlockPlug = true;
		switch(keyName){
		case "Enter":
			isGoToBlockPlug = enterHandle.call(this,event);
			break;
		case "Tab":
			isGoToBlockPlug = tabHandle.call(this,event);
			break;
		case "BackSpace":
			isGoToBlockPlug = deleteHandle.call(this,event);
			break;
		case "UpArrow":
			isGoToBlockPlug = upArrowHandle.call(this,event);
			break;
		case "DownArrow":
			isGoToBlockPlug = downArrowHandle.call(this,event);
			break;
		case "LeftArrow":
			isGoToBlockPlug = leftArrowHandle.call(this,event);
			break;
		case "RightArrow":
			isGoToBlockPlug = rightArrowHandle.call(this,event);
			break;
		}
		return isGoToBlockPlug;
	}

	/**
	* 一个包含对列表的所有操作的对象，用于对外提供
	* @property operations
	* @for CommentPlug
	*/
	CommentPlug.prototype.operations = {
		createComment:createComment
	}

	/**
	* 当前的commentBlock
	* @property currentCommentBlock
	* @for CommentPlug
	*/ 
	CommentPlug.prototype.currentCommentBlock = null;

	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for CommentPlug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	CommentPlug.prototype.getScope = getScope;
	function getScope(){
		var theFocusElement = util.getFocusElement();
		if($(theFocusElement).hasClass("comment-block")){
			var commentWrap = $(theFocusElement).data("commentWrap")
			return $(commentWrap).get(0);
		}else{
			var selection = window.getSelection()
			var theFocus = selection.focusNode;
			var theFocusNode = selection.focusNode;
			var theAnchorNode = selection.anchorNode;
			if(isOutPart(theFocusNode)) return theFocusNode.previousSibling;
			if(isOutPart(theAnchorNode)) return theAnchorNode.previousSibling;
			var scope = theFocus;
			while(scope){
				if($(scope).hasClass("comment-wrap")){
					return scope;
				}
				scope = scope.parentNode;
			}			
		}
		return null;
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内,这个判断应该放在其外包插件的前面
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	CommentPlug.prototype.isCharge = function(){
		var selection = window.getSelection();
		var theFocus = selection.focusNode;
		var theFocusNode = selection.focusNode;
		var theAnchorNode = selection.anchorNode;

		if(isOutPart(theFocusNode)) return true;
		if(isOutPart(theAnchorNode)) return true;

		var scope = theFocus;
		while(scope){
			if($(scope).hasClass("comment-wrap")||$(scope).hasClass("comment-block")){
				return true;
			}
			scope = scope.parentNode;
		}
		return false;
		
	}

	/**
	* 显示当前的commentBlock 使用this来调用
	* @method showCommentBlock
	*/
	CommentPlug.prototype.showCommentBlock = showCommentBlock;

	/**
	* 影藏当前的commentBlock
	* @method hideCommentBlock
	*/ 
	CommentPlug.prototype.hideCommentBlock = hideCommentBlock;

	/**
	* 进入插件
	* @method enter
	*/ 
	CommentPlug.prototype.enter = function(){
		this.plugStateMgr.innerState = this.plugName;
		this.showCommentBlock();
		console.log("改写后的enter")
	}

	/**
	* 离开插件
	* @method leave
	*/ 
	CommentPlug.prototype.leave = function(leaveEvent){
		this.hideCommentBlock();
		this.plugStateMgr.switchPlug(this, leaveEvent);
		console.log("改写后的leave")
	}

	// 用于处理事件的函数
	/**
	* 处理回车键事件
	* @function enterHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function enterHandle(event){
		console.log("comment enter")
		var element = util.getFocusElement();
		if($(element).hasClass("comment-block")){
			return false;
		}
		return true
	}
	/**
	* 处理tab键事件
	* @function tabHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function tabHandle(event){
		var selection = window.getSelection()
		var theFocus = selection.focusNode;
		var theFocusElement = util.getFocusElement();
		if($(theFocusElement).hasClass('comment-block')){
			event.preventDefault();
			return false;
		}else if(!isOutPart(theFocus)){
			var commentBlock = $(getScope()).data("commentBlock");
			// 聚焦到对应的commentBlock
			$(commentBlock).get(0).focus();
			event.preventDefault()
			return false;
		}else{
			return true;
		}
	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function deleteHandle(event){
		var theFocusElement = util.getFocusElement();
		return true;
	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function upArrowHandle(event){
		if(isInCommentBlock()){
			return false;
		}else{
			return true;
		}
	}
	/**
	* 处理下方向键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function downArrowHandle(){
		if(isInCommentBlock()){
			return false;
		}else{
			return true;
		}
	}

	/**
	* 处理回车键事件
	* @function leftArrowHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function leftArrowHandle(){
		if(isInCommentBlock()){
			return false;
		}else{
			var selection = window.getSelection()
			var scope = this.getScope();
			console.log("scope",scope);
			if(util.isFocusFirstOf(scope)){
				var that = this;
				this.leave("skipinner");
				console.log("leave from left")
			}
			return true;			
		}
	}

	/**
	* 处理回车键事件
	* @function rightArrowHandle
	* @param {Event} event 事件对象
	* @returns {Boolean} 是否把事件处理传递给blockPlug
	*/
	function rightArrowHandle(){
		if(isInCommentBlock()){
			return false;
		}else{
			var selection = window.getSelection()
			var scope = this.getScope();
			if(util.isFocusLastOf(scope)){
				var that = this;
				this.leave("skipinner");
				console.log("leave from right")
			}
			return true;			
		}
	}

	// #operations的函数
	/**
	* 创建一个标注
	* @function createComment
	*/ 
	function createComment(){
		var selection = window.getSelection();
		var range = selection.getRangeAt();
		if(range.startContainer == range.endContainer){
			var allString = range.startContainer.data;
			var textNode = range.startContainer;
			var parentNode = range.startContainer.parentNode;
			var startOffset = range.startOffset;
			var endOffset = range.endOffset;
			var selectionString = allString.substring(startOffset,endOffset);
			var selectionBefore = allString.substring(0,startOffset);
			var selectionAfter = allString.substring(endOffset);
			var wrap = createCommentWrap();
			if(!selection.isCollapsed){
				// 如果选中了文字(需要在选中的文字开头加上一个空格)
				$(wrap).html('&nbsp'+selectionString);
			}else{
				// 在标注块的开始添加一个空格
				$(wrap).html("&nbsp");
			}
			var nextNode = textNode.nextSibling;
			parentNode.removeChild(textNode);
			if(selectionBefore !== "") parentNode.insertBefore(document.createTextNode(selectionBefore),nextNode);
			parentNode.insertBefore($(wrap).get(0),nextNode);
			if(selectionAfter != "") parentNode.insertBefore(document.createTextNode(selectionAfter),nextNode);
			if(selectionString == ''){
				// 如果没有选中文字
				selection.collapse($(wrap).get(0),1);
				// $(wrap).text('');
			}else{
				// 如果选中了文字
				util.selectAllText($(wrap).get(0));
			}
			// 在标注块的后面添加一个空格
			var theNextNode = $(wrap).get(0).nextSibling;
			if(theNextNode && theNextNode.nodeType == 3){
				// 如果后面的一个元素存在且为文本节点
				theNextNode.nodeValue = ' ' + theNextNode.nodeValue;
			}else{
				// 不存在或者不为文本节点
				var wrapE = $(wrap).get(0);
				wrapE.insertAdjacentHTML("afterend","&nbsp;")
			}
		}
		// 绑定commentBlock
		var commentBlock = createCommentBlock($(wrap).get(0));
		$(wrap).data("commentBlock",commentBlock);
		$(commentBlock).data("commentWrap",wrap);
		$("#comment-block-list").append($(commentBlock));
		// $(wrap).click(function(){
		// 	$(this).data("commentBlock").show();
		// })
	}

	// #创建元素

	/**
	* 创建一个标注的包裹
	* @function createCommentWrap
	* @returns {Node} 创建的commentWrap
	* @example <span class='comment-wrap'></span>
	*/ 
	function createCommentWrap(){
		return $("<strong></strong>").addClass('comment-wrap');
	}

	// #其他函数
	/**
	* 判断是否是外面的部分
	* @function isOutPart
	* @param {Node} theNode 被判断的节点
	* @param {Number} offset 光标所在的位置
	* @returns {Boolean} 判断的结果
	*/ 
	function isOutPart(theNode){
		var selection = window.getSelection();
		if(theNode.nodeType !== 3) return false;
		if(selection.focusOffset !== 1) return false;
		if((theNode.nodeValue.charAt(0) != " ")&&(theNode.nodeValue.charCodeAt(0)!=160)) return false;
		if(!theNode.previousSibling) return false;
		if(theNode.previousSibling.nodeType !== 1) return false;
		if(!$(theNode.previousSibling).hasClass("comment-wrap")) return false;

		return true;
	} 

	/**
	* 创建一个注释框
	* @function createCommentBlock
	* @param {Node} commentWrap 被注释的语句
	* @example <div class="panel panel-default"><div class="panel-body" contenteditable="true"></div></div>
	*/ 
	function createCommentBlock(commentWrap){
		var editorArea = document.getElementById("editor_area");
		var commentRect = {};
		var wrapRect
		var editorRect

		// 确定注释语句的位置
		if(!commentWrap || !commentWrap.getBoundingClientRect){
			// 抛出错误
			throw new Error("commentWrap 参数不符合要求")
		}
		wrapRect = commentWrap.getBoundingClientRect();
		editorRect = editorArea.getBoundingClientRect();
		
		commentRect.left =wrapRect.left - editorRect.left;
		commentRect.top = wrapRect.top - editorRect.top + wrapRect.height
		commentRect.width = editorRect.width / 2;

		// 开始创建元素
		var commentBlock = $('<div class="comment-block" contenteditable="true">abc</div>')
		commentBlock.css({
			"top":commentRect.top,
			"left":commentRect.left,
			"width":commentRect.width
		})
		return commentBlock
	}

	/**
	* 判断是否在commentBlock中
	* @function isInCommentBlock
	*/
	function isInCommentBlock(){
		var theFocusElement = util.getFocusElement();
		if($(theFocusElement).hasClass("comment-block")){
			return true;
		}else{
			return false;
		}
	}

	/**
	* 显示当前的commentBlock 使用this来调用
	* @function showCommentBlock
	*/
	function showCommentBlock(){
		var commentWrap = getScope();
		var commentBlock = $(commentWrap).data("commentBlock");
		$(commentBlock).show();
		this.currentCommentBlock = commentBlock;

	}

	/**
	* 影藏当前的commentBlock
	* @function hideCommentBlock
	*/ 
	function hideCommentBlock(){
		$(this.currentCommentBlock).hide();
		this.currentCommentBlock = null;
	}

	return new CommentPlug("commentPlug");
})