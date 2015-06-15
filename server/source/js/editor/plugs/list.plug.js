/**
* 该模块为编辑器提供列表功能
* @module list.plug
*/
define(['./plug.js',"../others/util.js"],function(Plug,util){
	/**
	* 列表插件
	* @class ListPlug
	* @extends Plug
	*/
	function ListPlug(plugName){
		this.plugName = plugName;
	}
	ListPlug.prototype = new Plug();

	/**
	* 对键盘事件的反应
	* @method actForKey
	* @for ListPlug
	* @param {Event} event 键盘事件对象
	*/
	ListPlug.prototype.actForKey = function(event){
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
	* @for ListPlug
	*/
	ListPlug.prototype.operations = {
		createList:createList,
		addSecondaryList:addSecondaryList,
		addItem:addItem,
		deleteItem:deleteItem,
		changeListStyle:changeListStyle
	}

	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for ListPlug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	ListPlug.prototype.getScope = getScope;
	function getScope(){
		var theFocus = util.getFocusElement();
		var scope = theFocus.parentNode;
		var surround = scope.parentNode;
		while(true){
			if((scope.tagName=="UL"||scope.tagName=="OL")&&surround.tagName=="SECTION")
				return scope;
			scope = surround;
			surround = surround.parentNode;
		}
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	ListPlug.prototype.isCharge = function(){
		var theFocus = util.getFocusElement();
		if(!theFocus) return false;
		if(theFocus.tagName != "P") return false;
		if(theFocus.parentNode.tagName != "LI") return false;
		if(theFocus.parentNode.parentNode.tagName != "UL" && theFocus.parentNode.parentNode.tagName != "OL") return false;
		return true;
	}

	// 用于处理事件的函数
	/**
	* 处理回车键事件
	* @function enterHandle
	* @param {Event} event 事件对象
	*/
	function enterHandle(event){
		var theFocus = util.getFocusElement();
		if(isParagraphEmpty(theFocus)){
			// 如果当前列表项内容为空
			if(isInLastItem(theFocus)){
				// 如果当前项目为最后一个项目
				// 跳出当前列表
				dropList.call(this,theFocus);
				// if(surround.tagName === "SECTION"){
				// 	// 如果外部的环境为section
				// 	// 则离开当前的插件
				// 	this.leave("new");
				// }
			}
		}else{
			// 如果不为空
			// 产生一个新的列表项
			duplicateItem(theFocus);
		}
		event.preventDefault();
	}
	/**
	* 处理tab键事件
	* @function tabHeandle
	* @param {Event} event 事件对象
	*/
	function tabHeandle(event){
		addSecondaryList(false);
		event.preventDefault();
	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	*/
	function deleteHandle(event){
		var theEditable = util.getFocusElement()
		// 如果焦点位于列表段落中
		var listPara = theEditable;
		// 获得列表项
		var item = listPara.parentNode;
		// 获取list
		var list = getListByListPara(listPara);
		if(isListEmpty(list)){
			// 如果列表为空
			// 光标移动到上一个可编辑元素末尾
			util.focusPreviousEditable(theEditable,false);
			// 删除列表
			list.parentNode.removeChild(list);
			// 离开插件
			this.leave("skip");
			// 禁用默认
			if(event) event.preventDefault();
		}else if(isItemEmpty(item)){
			// 如果列表项为空
			// 光标移动到上一个可编辑元素末尾
			util.focusPreviousEditable(theEditable,false);
			// 删除item
			list.removeChild(item);
			// 禁用默认
			if(event) event.preventDefault();
		}
	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	*/
	function upArrowHandle(event){
		var selection = window.getSelection();
		var theFocus = util.getFocusElement();
		if(selection.focusOffset === 0){
			// 聚焦到上一个可编辑元素
			util.focusPreviousEditable(theFocus,true);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			if(!isListPara(theFocus)){
				// 如果可编辑元素不是列表文字，说明已经离开了列表
				this.leave("skip");
			}
			event.preventDefault();
		}
	}
	/**
	* 处理下方向键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	*/
	function downArrowHandle(){
		var theFocus = util.getFocusElement()
		var selection = window.getSelection();
		if(util.isFocusLast()){
			// 聚焦到上一个可编辑元素
			util.focusNextEditable(theFocus,false);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			if(!isListPara(theFocus)){
				// 如果可编辑元素不是列表文字，说明已经离开了列表
				this.leave("skip");
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
			// 聚焦到上一个可编辑元素
			util.focusPreviousEditable(theFocus,false);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			if(!isListPara(theFocus)){
				// 如果可编辑元素不是列表文字，说明已经离开了列表
				this.leave("skip");
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
		var theFocus = util.getFocusElement()
		var selection = window.getSelection();
		if(util.isFocusLast()){
			// 聚焦到上一个可编辑元素
			util.focusNextEditable(theFocus,true);
			// 重新获取当前的可编辑元素
			theFocus = util.getFocusElement();
			if(!isListPara(theFocus)){
				// 如果可编辑元素不是列表文字，说明已经离开了列表
				this.leave("skip");
			}
			event.preventDefault();
		}
	}

	// 用于operations的函数

	/**
	* 创建一个列表
	* @function createList
	* @param {Boolean} isOrder 决定是否创建一个有序
	*/
	function createList(isOrder){
		var theFocus = util.getFocusElement();
		var listStyle = isOrder?"OL":"UL";
		enterList(theFocus,listStyle);

	}

	/**
	* 在当前列表项下创建一个次级列表项
	* @function addSecondaryList
	* @param {Boolean} isOrder 决定是否创建一个有序
	*/
	function addSecondaryList(isOrder){
		var theFocus = util.getFocusElement();
		var listStyle = isOrder?"OL":"UL";
		enterList(theFocus,listStyle);
	}

	/**
	* 添加在当前列表下面一个列表项
	* @function addItem
	*/
	function addItem(){
		var theFocus = util.getFocusElement();
		duplicateItem(theFocus);
	}

	/**
	* 删除当前的列表项，如何删除后列表中没有列表项，顺便也删除列表
	* @function deleteItem
	*/
	function deleteItem(){
		var theEditable = util.getFocusElement();
		// 如果焦点位于列表段落中
		var listPara = theEditable;
		// 获得列表项
		var item = listPara.parentNode;
		// 获取list
		var list = editOp.getListByListPara(listPara);
		util.focusPreviousEditable(theEditable,false);
		if(editOp.isListEmpty(list)){
			// 光标移动到上一个可编辑元素末尾
			list.parentNode.removeChild(list);
		}else{
			list.removeChild(item);
		}
	}

	/**
	* 切换当前列表的样式
	* @function changeListStyle 
	* @param {Boolean} isOrder 列表是否为有序列表
	*/
	function changeListStyle(isOrder){
		var theEditable = util.getFocusElement();
		// 如果焦点位于列表段落中
		var listPara = theEditable;
		// 获取list
		var list = editOp.getListByListPara(listPara);

		var tagString = isOrder?"ol":"ul";
		// 新的List
		var newList = document.createElement(tagString);
		// 将旧的list中的所有子元素添加到新的list中
		var child = list.firstElementChild;
		while(child){
			newList.appendChild(child);
			child = child.nextElementSibling;
		}
		// 用新的list替换旧的list
		list.parentNode.replaceChild(newList,list);

		theEditable.focus();
	}

	// 其他内部函数

	/** 
	* 复制一个列表项
	* @function duplicateItem
	* @param {Node} nowParagraph 焦点所在的段落
	*/
	function duplicateItem(nowParagraph){
		// 或得当前item
		var nowItem = nowParagraph.parentNode;
		// 创建一个项
		var item = document.createElement('li');
		// 创建一个paragraph
		var paragraph = document.createElement('p');
		paragraph.setAttribute('contenteditable','true');	
		// 组装
		item.appendChild(paragraph);
		// 将item插入当前item之后
		nowItem.parentNode.insertBefore(item, nowItem.nextElementSibling);
		// 聚焦
		paragraph.focus();
	}

	/** 
	* 进入一个列表,以及缩进
	* @function enterList
	* @param {Node} nowEditable 焦点所在的编辑元素
	* @param {String} listType 列表的类型
	*/
	function enterList(nowEditable,listType){
		// 首先确保被编辑元素存在且是一个段落
		if(nowEditable&&nowEditable.tagName==='P'){
			var paragraph = nowEditable;
			var surround = nowEditable.parentNode;
			var surroundName = surround.tagName;
			if(surroundName==='SECTION'){
				// 如果段落位于section中
				// 获取section
				var section = surround;
				// 插入list
				insertListBefore(section,nowEditable.nextElementSibling,listType);
				// 清理之前的元素
				if(isParagraphEmpty(paragraph)){
					section.removeChild(paragraph);
				}
			}else if(surroundName==='LI'){
				// 如果段落位于li中(进行列表缩进)
				var item = surround;
				var list = item.parentNode;
				var plistType = list.tagName;
				if(isItemEmpty(item)){
					// 如果item为空
					// 判断是否有前item
					var previousItem = item.previousElementSibling;
					if(previousItem&&previousItem.tagName==='li'){
						// 如果有前item
						// 判断前item中有没有list
						var preItemList = previousItem.lastElementChild;
						if(preItemList&&(preItemList.tagName==='UL'||preItemList.tagName==='OL')){
							// 如果前item中又list
							addItem();
						}else{
							// 如果前item中没有list
							insertListBefore(previousItem,null,plistType);
							previousItem
						}
					}
				}else{
					// 如果item不为空
					// 在当前item内插入list
					insertListBefore(item,nowEditable.nextElementSibling,plistType);
				}
			}
		}
	}

	/** 
	* 跳出一个列表
	* @function dropList
	* @param {Node} nowParagraph 焦点所在的段落
	* @returns {Node} 列表的外部环境
	*/
	function dropList(nowParagraph){
		// 当前项
		var nowItem = nowParagraph.parentNode;
		// 列表
		var list = nowItem.parentNode;
		// 判断外部环境
		var surround = list.parentNode.tagName;
		if(surround === 'SECTION'){
			// 如果外面是section
			// 跳出list，进入一个段落继续编辑
			// this.insertParagraphBefore(list.parentNode,list.nextElementSibling);
			this.leave("new");
		}else 
		if(surround === 'LI'){
			// 如果外面是li
			// 跳出这个list，进入上级list的item中继续编辑
			var pList = getParentList(list);
			addItem(pList);
		}
		// 清理空项目
		// 如果该项是空的，则清理之
		if(isListEmpty(list)){
			list.parentNode.removeChild(list);
		}else if(isItemEmpty(nowItem)){
			list.removeChild(nowItem);
		}
		return list.parentNode;
	}

	/** 
	* 插入一个list
	* @function insertListBefore
	* @param {Node} parentNode 父元素
	* @param {Node} beforeNode 之前的元素
	* @param {String} listType 列表的类型
	*/
	function insertListBefore(parentNode,beforeNode,listType){
		// 创建一个list
		var list = document.createElement(listType);
		// 创建一个项
		var item = document.createElement('li');
		// 创建一个paragraph
		var paragraph = document.createElement('p');
		paragraph.setAttribute('contenteditable','true');	
		// 组装
		item.appendChild(paragraph);
		list.appendChild(item);
		// 插入
		parentNode.insertBefore(list,beforeNode);
		// 聚焦
		paragraph.focus();
	}

	/** 
	* 判断item是否为空
	* @function isItemEmpty
	* @param {Node} item 列表项
	*/
	function isItemEmpty(item){
		// item的第一个元素一定为p
		var paragraph = item.firstChild;
		if(paragraph){
			if(paragraph.innerHTML === '')
				return true;
			else
				return false;
		}
		return true;
	}

	/** 
	* 判断list是否为空
	* @function isListEmpty
	* @param {Node} list 列表项
	*/
	function isListEmpty(list){
		// list的子元素数量
		var n = list.childElementCount;
		if(n === 0){
			// 如果没有子元素，list为空
			return true;
		}else if(n === 1){
			// 如果有一个子元素item
			// 判断item是否为空
			var item = list.firstElementChild;
			if(isItemEmpty(item)){
				return true;
			}
		}
		// 否则都不是空
		return false;
	}

	/** 
	* 在section中加入p标签
	* @function insertParagraphBefore
	* @param {Node} section 插入到的section
	* @param {Node} beforeNode 在什么节点之前插入
	*/
	function insertParagraphBefore(section,beforeNode){
		var p = document.createElement('p');
		p.setAttribute('contenteditable','true');
		section.insertBefore(p,beforeNode);
		p.focus();
	}

	/** 
	* 根据listPara获取list
	* @function getListByListPara
	* @param {Node} lisPara 列表段落
	*/
	function getListByListPara(lisPara){
		// 列表项
		var item = lisPara.parentNode;
		if(item){
			// 如果如果列表项存在
			// 获取列表项的列表
			var list = item.parentNode;
			if(list){
				// 如果list存在，则返回
				return list;
			}
		}
		return null;
	}

	/** 
	* 判断是否是列表段落
	* @function isListPara
	* @param {Node} paragraph 段落节点
	*/
	function isListPara(paragraph){
		if(paragraph&&paragraph.tagName==='P'){
			var section = paragraph.parentNode;
			if(section&&section.tagName==='LI'){
				return true;
			}
		}
		return false;
	}

	/** 
	* 获取上一级的列表
	* @function getParentList
	* @param {Node} list 列表节点
	*/
	function getParentList(list){
		var pItem = list.parentNode;
		if(pItem&&pItem.tagName === 'LI'){
			var pList = pItem.parentNode;
			if(pList&&(pList.tagName==='UL'||pList.tagName==='OL')){
				return pList;
			}
		}
		return null;
	}

	/** 
	* 在list的最后增加一个item
	* @function addItem
	* @param {Node} list 列表节点
	*/
	function addItem(list){
		// 创建一个项
		var item = document.createElement('li');
		// 创建一个paragraph
		var paragraph = document.createElement('p');
		paragraph.setAttribute('contenteditable','true');	
		// 组装
		item.appendChild(paragraph);
		// 将item插入当前item之后
		list.appendChild(item);
		// 聚焦
		paragraph.focus();
	}

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
	* 判断是否处在最后一个item中
	* @function isInLastItem
	* @param {Node} paragraph item的paragraph
	* @returns {Boolean} 
	*/
	function isInLastItem(paragraph){
		var item = paragraph.parentNode;
		var list = item.parentNode;
		if(list.lastElementChild == item){
			return true;
		}else{
			return false;
		}
	}

	return new ListPlug("listPlug");
})