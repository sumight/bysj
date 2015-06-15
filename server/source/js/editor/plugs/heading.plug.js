/**
* 该模块为编辑器的一个功能插件，用来完成对标题的操作
* @module heading.plug
*/
define(['./plug.js',"../others/util.js"],function(Plug,util){
	/**
	* 标题插件
	* @class HeadingPlug
	* @extends Plug
	*/
	function HeadingPlug(plugName){
		this.plugName = plugName;
	}
	HeadingPlug.prototype = new Plug();


	/**
	* 标题插件是否处于标题模式的状态
	* @property {Boolean} headingModel
	* @for HeadingPlug
	* @default false;
	*/
	HeadingPlug.prototype.headingModel = false;

	/**
	* 设置标题模式的状态
	* @function setHeadingModel
	* @param {Boolean} isHeadingModel
	* @for HeadingPlug
	*/ 
	HeadingPlug.prototype.setHeadingModel = function(isHeadingModel){
		if(isHeadingModel){
			this.headingModel = isHeadingModel
		}else{
			this.headingModel = isHeadingModel
		}
	}

	/**
	* 对键盘事件的反应
	* @method act
	* @for HeadingPlug
	* @param {Event} event 键盘事件对象
	*/
	HeadingPlug.prototype.actForKey = function(event){
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
	* 一个包含对标题所有操作的对象，用于对外提供
	* @property operations
	* @for HeadingPlug
	*/
	HeadingPlug.prototype.operations = {
		addSameLevelHeading:addSameLevelHeading,
		addSecondaryHeading:addSecondaryHeading,
		deleteHeading:deleteHeading
	}


	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for HeadingPlug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	HeadingPlug.prototype.getScope = getScope;
	function getScope(){
		var theFocus = util.getFocusElement();
		return theFocus;
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	HeadingPlug.prototype.isCharge = function(){
		var theFocus = util.getFocusElement();
		if(!theFocus) return false;
		// theFocus的tagName 如果不在h1~h6之间 返回false;
		if(theFocus.tagName.charAt(0) != "H" || (theFocus.tagName.charAt(2)<=6 && theFocus.tagName.charAt(2)>=1)) return false;
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
		if(this.headingModel){
			addSameLevelHeading();
		}else{
			this.leave('new');
		}
		event.preventDefault();
	}
	/**
	* 处理tab键事件
	* @function tabHeandle
	* @param {Event} event 事件对象
	*/
	function tabHeandle(event){
		if(this.headingModel){
			addSecondaryHeading();
		}
		event.preventDefault();
	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	*/
	function deleteHandle(event){
		console.log(this.headingModel)
		var heading = util.getFocusElement();
		if(heading&&heading.innerHTML.length===0){
			// 如果heading当时为空
			if(this.headingModel){
				// 当在标题模式下
				deleteHeading();
			}else{
				// 不在标题模式下
				heading.innerText = "--未定义标题";
				util.selectAllText(heading);
			}
			event.preventDefault();
		}
	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	*/
	function upArrowHandle(event){
		var selection = window.getSelection();
		if(selection.focusOffset === 0){
			if(this.headingModel){
				// 如果在标题模式下
				focusPreviousHeader(document.activeElement, true);
			}else{
				// 如果不在标题模式下
				util.focusPreviousEditable(document.activeElement,true);
			}
			event.preventDefault();
		}
	}
	/**
	* 处理回车键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	*/
	function downArrowHandle(){
		var selection = window.getSelection();
		if(selection.focusOffset === document.activeElement.innerHTML.length){
			if(this.headingModel){
				// 如果在标题模式下
				focusNextHeader(document.activeElement,false);
			}else{
				// 如果不在标题模式下
				util.focusNextEditable(document.activeElement,false);
			}
			event.preventDefault();
		}
	}
	/**
	* 处理回车键事件
	* @function leftArrowHandle
	* @param {Event} event 事件对象
	*/
	function leftArrowHandle(){
		var selection = window.getSelection();
		if(selection.focusOffset === 0){
			if(this.headingModel){
				focusPreviousHeader(document.activeElement, false);
			}else{
				util.focusPreviousEditable(document.activeElement, false);
			}
			event.preventDefault();
		}
	}
	/**
	* 处理回车键事件
	* @function rightArrowHandle
	* @param {Event} event 事件对象
	*/
	function rightArrowHandle(){
		var selection = window.getSelection();
		if(selection.focusOffset === document.activeElement.innerHTML.length){
			if(this.headingModel){
				focusNextHeader(document.activeElement, true);
			}else{
				util.focusNextEditable(document.activeElement,true);
			}
			event.preventDefault();
		}
	}

	// operations的函数
	/**
	* 添加一个同级标题
	* @function addSameLevelHeading
	*/
	function addSameLevelHeading(){
		// 最外面的section
		var theFocusElement = util.getFocusElement();
		var editor = $(theFocusElement).closest(".editor_area").get(0);
		// 获取当前焦点所在的section
		var section = util.getFocusElement().parentNode;
		// 判断是否为顶级标题
		if(section === editor){
			// 如果为顶级标题
			addFirstChildSection();
		}else{
			addNextSiblingSection();
		}
	}

	/**
	* 添加一个次级标题
	* @function addSecondaryHeading
	*/
	function addSecondaryHeading(){
		addFirstChildSection();
	}

	/**
	* 删除一个标题
	* @function DeleteHeading
	*/
	function deleteHeading(){
		// 最外面的section
		var editor = document.getElementById("editor_area");
		var heading = util.getFocusElement();
		var section = heading.parentNode;
		// 判断是否为顶级标题
		if(section !== editor){
			// 如果不为顶级标题
			focusPreviousHeader(heading);
			removeSection(section);
		}
	}

	// 一些被operations调用的内部函数
	/**
	* 获取第一个section子元素
	* @function getFirstSectionChild
	* @param {Node} element 一个文档节点元素
	* @returns {Node} 第一个为Section的子元素
	*/
	function getFirstSectionChild (element){
		var child = element.firstElementChild;
		while(child){
			if(child.tagName === 'SECTION'){
				return child;
			}else{
				child = child.nextElementSibling;
			}
		}
		return null; 
	}

	/**
	* 获取最后一个section子元素
	* @function getLastSectionChild
	* @param {Node} element 一个文档节点元素
	* @returns {Node} 最后一个Section子元素
	*/
	function getLastSectionChild(element){
		var child = element.lastElementChild;
		while(child){
			if(child.tagName === 'SECTION'){
				return child;
			}else{
				child = child.previousElementSibling;
			}
		}
		return null; 
	}

	/**
	* 获取下一个section兄弟元素
	* @function getNextSectionSibling
	* @param {Node} element 一个文档节点元素
	* @returns {Node} 下一个Section兄弟元素
	*/
	function getNextSectionSibling(element){
		var sibling = element.nextElementSibling;
		while(sibling){
			if(sibling.tagName === 'SECTION'){
				return sibling;
			}else{
				sibling = sibling.nextElementSibling;
			}
		}
		return null;
	}

	/**
	* 获取上一个section兄弟元素
	* @function getPreviousSectionSibling
	* @param {Node} element 一个文档节点元素
	* @returns {Node} 上一个Section兄弟元素
	*/
	function getPreviousSectionSibling(element){
		var sibling = element.previousElementSibling;
		while(sibling){
			if(sibling.tagName === 'SECTION'){
				return sibling;
			}else{
				sibling = sibling.previousElementSibling;
			}
		}
		return null;
	}

	/** 
	* 根据当前section获得铺平后的下一个section 
	* @function getNextSection
	* @param {Node} nowSection 当前的section节点
	* @returns {Node} 下一个section元素
	*/
	function getNextSection(nowSection){
		// 首先判断子元素是否存在，存在则返回
		var fs;
		if(fs = getFirstSectionChild(nowSection)){
			return fs;
		}else{
		// 没有子元素则判断下兄弟或者祖先下兄弟元素是否存在，存在则返回
			var nextSiblingSection = nowSection;
			while(nextSiblingSection.id !== 'editor_area'){
				var ns;
				if(ns = getNextSectionSibling(nextSiblingSection)){
					return ns;
				}else{
					nextSiblingSection = nextSiblingSection.parentNode;
				}
			}	
		}
		return null;
	}

	/** 
	* 根据当前section获得铺平后的上一个section 
	* @function getPreviousSection
	* @param {Node} nowSection 当前的section节点
	* @returns {Node} 上一个section元素
	*/
	function getPreviousSection(nowSection){
		// 首先判断是否为根元素，如果为根元素则返回null
		if(nowSection.id === 'editor_area'){
			return null;
		}
		// 首先判断上兄弟元素是否存在，存在则返回他或者他的子元素
		var lastSectionChild;
		if(lastSectionChild = getPreviousSectionSibling(nowSection)){
			var lc;
			while(lc = getLastSectionChild(lastSectionChild)){
					lastSectionChild = lc;
			}
			return lastSectionChild;
		}else{
		// 如果不存在上兄弟元素，则返回父元素
			return nowSection.parentNode;
		}
	}
	/** 
	* 清除section
	* @function removeSection
	* @param {Node} section 被清除的section元素
	*/
	function removeSection(section){
		section.parentNode.removeChild(section);
	}

	/**
	* 光标定位到下一个section的header
	* @function focusNextHeader
	* @param {Node} header 当前的heading元素
	* @param {Boolean} cursorAtStart 光标位置
	*/
	function focusNextHeader(header, cursorAtStart){
		var selection = window.getSelection();
		var section = header.parentNode;
		var nextSection = getNextSection(section);
		if(nextSection){
			// 获取下一个标题
			var nextHeader = nextSection.firstElementChild;
			// 设置光标位置
			if(cursorAtStart){
				selection.collapse(nextHeader.firstChild, 0);
			}else{
				selection.collapse(nextHeader.firstChild, nextSection.firstElementChild.innerHTML.length);
			}
			nextHeader.focus();			
		}
	}

	/**
	* 光标定位到上一个section的header
	* @function focusPreviousHeader
	* @param {Node} header 当前的heading元素
	* @param {Boolean} cursorAtStart 光标位置
	*/
	function focusPreviousHeader(header, cursorAtStart){
		var selection = window.getSelection();
		var section = header.parentNode;
		var previousSection = getPreviousSection(section);
		if(previousSection){
			// 获取上一个标题
			var previousHeader = previousSection.firstElementChild;
			// 设置光标位置
			if(cursorAtStart){
				selection.collapse(previousHeader.firstChild, 0);
			}else{
				selection.collapse(previousHeader.firstChild, previousSection.firstElementChild.innerHTML.length);
			}
			previousHeader.focus();	
		}
	}

	/**
	* 在某个section之前插入一个section
	* @function insertSectionBefore
	* @param {Node} beforeSection
	* @returns {Node} 插入成功则返回被插入的元素
	*/
	function insertSectionBefore(beforeSection){
		var pSection;
		if(beforeSection){
			pSection = beforeSection.parentNode;
		}else{
			pSection = this;
		}
		// 判断上一级section的标题级别
		var hLevel = Number(pSection.firstElementChild.tagName.charAt(1));
		// 确定添加上去的标题的级别
		if(hLevel<6){
			hLevel++;
			// 组装section
			var section = document.createElement('section');
			var title = document.createElement('h'+hLevel);
			title.setAttribute('contenteditable','true');
			section.appendChild(title);
			// 插入section
			pSection.insertBefore(section,beforeSection);
			return section;
		}else{
			return false;
		}
	}

	/**
	* 在当前section的下方添加一个同级section
	* @function addNextSiblingSection
	*/
	function addNextSiblingSection(){
		var focusingSection = util.getFocusElement().parentNode;
		if(focusingSection){
			var newSection = insertSectionBefore.call(focusingSection.parentNode,focusingSection.nextElementSibling);
		}
		newSection.firstElementChild.focus();
	}

	/**
	* 在当前section的最后添加一个次级section
	* @function addLastChildSection
	*/
	function addLastChildSection(){
		var focusingSection = util.getFocusElement().parentNode;
		if(focusingSection){
			var newSection = insertSectionBefore.call(focusingSection,null);
		}
		newSection.firstElementChild.focus();
		console.log(newSection.firstElementChild);
	}

	/**
	* 在当前section的第一个位置添加一个次级section
	* @function addFirstChildSection
	*/
	function addFirstChildSection(){
		var focusingSection = util.getFocusElement().parentNode;
		var firstChildSection = getFirstSectionChild(focusingSection);
		if(focusingSection){
			var newSection = insertSectionBefore.call(focusingSection,firstChildSection);
		}
		newSection.firstElementChild.focus();
		
	}

	return new HeadingPlug("headingPlug");
})