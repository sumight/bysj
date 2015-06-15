/**
* 该模块为编辑器提供表格的功能
* @module table.plug
*/

define(['./plug.js',"../others/util.js","../others/table.js"],function(Plug,util,$){
	/**
	* 列表插件
	* @class TablePlug
	* @extends Plug
	*/
	function TablePlug(plugName){
		this.plugName = plugName;
	}
	TablePlug.prototype = new Plug();

	/**
	* 对键盘事件的反应
	* @method actForKey
	* @for TablePlug
	* @param {Event} event 键盘事件对象
	*/
	TablePlug.prototype.actForKey = function(event){
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
	* @for TablePlug
	*/
	TablePlug.prototype.operations = {
		createTable:createTable
		// deleteTable:deleteTable
	}

	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for TablePlug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	TablePlug.prototype.getScope = getScope;
	function getScope(){
		var theEditable = util.getFocusElement();
		var trNode = theEditable.parentNode;
		if(trNode.tagName != "TR") throw new Error("getScope:获取插件辖区信息错误");
		var theadOrTbody = trNode.parentNode;
		if((theadOrTbody.tagName != "THEAD") && (theadOrTbody.tagName != "TBODY")) throw new Error("getScope:获取插件辖区信息错误");
		var table = theadOrTbody.parentNode;
		if(table.tagName != "TABLE") throw new Error("getScope:获取插件辖区信息错误");
		return table;
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @method isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	TablePlug.prototype.isCharge = function(){
		var theEditable = util.getFocusElement();
		if(!theEditable) return false;
		if(theEditable.tagName == "TH") return true;
		if(theEditable.tagName == "TD") return true;
		return false;
	}

	// #用于处理事件的函数
	/**
	* 处理回车键事件
	* @function enterHandle
	* @param {Event} event 事件对象
	*/
	function enterHandle(event){
		var cell = util.getFocusElement();
		if($.isRowEmpty(cell)){
			// 如果所在的行是空的
			// 获得表格元素
			var table = $(cell).tableElement;
			// 删除当前空行
			$(cell).removeRow(cell);
			// 离开表格
			this.leave("new");
		}else{
			// 如果不是空的
			// 插入新的行
			$(cell).insertRow();
		}
		event.preventDefault();
	}
	/**
	* 处理tab键事件
	* @function tabHeandle
	* @param {Event} event 事件对象
	*/
	function tabHeandle(event){
		var theEditable = util.getFocusElement();
		if($.isHeadCell(theEditable)){
			// 如果焦点在表头单元格
			if($(theEditable).isTableBodyEmpty()){
				// 如果表格体为空
				// 增加表头单元格
				$(theEditable).appendHeadCell();
			}else{
				// 焦点跳转到下一个单元格中
				if(!$.isLastCellOfTable(theEditable)){
					$(theEditable).focusNextCell();
				}
			}
		}else{
			// 如果焦点在表体单元格中
			// 焦点跳转到下一个单元格中
			if(!$.isLastCellOfTable(theEditable)){
				$(theEditable).focusNextCell();
			}
		}
		event.preventDefault();
	}
	/**
	* 处理delete键事件
	* @function deleteHandle
	* @param {Event} event 事件对象
	*/
	function deleteHandle(event){
		var cell = util.getFocusElement();
		if($.isHeadCell(cell)){
			// 如果是表头单元格
			if($.isCellEmpty(cell)){
				// 如果cell是空的
				event.preventDefault();
				if($.isLastCellOfRow(cell)){
					// 如果是最后一个单元格
					if($(cell).isTableBodyEmpty()){
						// 如果表格体为空
						if($.isFirstCellOfRow(cell)){
							// 是第一个单元格
							// 聚焦到上一个可编辑元素
							util.focusPreviousEditable(cell,false);
							// 也就是这个是唯一的表头单元格删除表格
							$(cell).removeSelf();
							// 切换模式
							this.leave('skip')
						}else{
							// 不是第一个单元格
							// 删除这个单元格
							$(cell).removeLastHeadCell();
						}								
					}else{
						// 如果表格体不为空
						$(cell).focusPreCell();
					}
				}else{
					// 如果不是最后一个单元格
					$(cell).focusPreCell();
				}
				event.preventDefault();
			}
		}else{
			// 如果是表体单元格
			if($.isCellEmpty(cell)){
				// 如果cell是空的
				if($.isFirstCellOfRow(cell)){
					// 如果是第一个单元格
					if($.isRowEmpty(cell)){
						// 如果行是空的
						// 删除行
						$(cell).removeRow();
					}else{
						// 如果行不是空的
						// do nothing
					}
				}else{
					// 如果不是
					$(cell).focusPreCell();
				}
				event.preventDefault();
			}
		}
	}
	/**
	* 处理上方向键事件
	* @function upArrowHandle
	* @param {Event} event 事件对象
	*/
	function upArrowHandle(event){
		var cell = util.getFocusElement();
		// 判断边界
		if($.isFirstRowOfTable(cell)){
			// 如果处在第一row
			// 定位到表格的前一个可编辑元素
			var firstCell = $(cell).getFirstCellOfTable();
			util.focusPreviousEditable(firstCell,false);
			this.leave("skip")
			event.preventDefault();
		}else{
			// 如果不是第一个row
			$(cell).focusUpCell();
			event.preventDefault();
		}
	}
	/**
	* 处理下方向键事件
	* @function downArrowHandle
	* @param {Event} event 事件对象
	*/
	function downArrowHandle(){
		var cell = util.getFocusElement();
		// 判断边界
		if($.isLastRowOfTable(cell)){
			// 如果处在第一row
			// 定位到表格的前一个可编辑元素
			var lastCell = $(cell).getLastCellOfTable();
			// 定位到前一个可编辑元素
			var isFocus = util.focusNextEditable(lastCell,true);
			if(isFocus){
				// 如果定位成功
				// 跳出table模式
				this.leave('skip');
			}
			event.preventDefault();
		}else{
			// 如果不是第一个row
			$(cell).focusDownCell();
			event.preventDefault();
		}
	}

	/**
	* 处理左方向键事件
	* @function leftArrowHandle
	* @param {Event} event 事件对象
	*/
	function leftArrowHandle(){
		var cell = util.getFocusElement();
		var selection = window.getSelection();
		// 判断边界
		if($.isFirstCellOfTable(cell)){
			// 如果是第一个table的第一个cell
			if(selection.focusOffset===0){
				// 如果位于第一个字符前
				// 定位到前一个可编辑元素
				util.focusPreviousEditable(cell,false);
				this.leave("skip");
				event.preventDefault();	
			}
		}else{
			// 如果不是第一个cell
			if(selection.focusOffset===0){
				$(cell).focusPreCell();
				event.preventDefault();	
			}
		}
	}
	/**
	* 处理回车键事件
	* @function rightArrowHandle
	* @param {Event} event 事件对象
	*/
	function rightArrowHandle(){
		var cell = util.getFocusElement();
		var selection = window.getSelection();
		if($.isLastCellOfTable(cell)){
			// 如果位于最后一个表格单元格
			if(selection.focusOffset===cell.innerHTML.length){
				// 如果光标位于最后一个字符后
				// 定位到前一个可编辑元素
				var isFocus = util.focusNextEditable(cell,true);
				if(isFocus){
					// 如果定位成功
					// 跳出table模式
					this.leave('skip')
				}
				event.preventDefault();	
			}
		}else{
			// 如果不是出于最后一个单元格
			if(selection.focusOffset===cell.innerHTML.length){
				$(cell).focusNextCell();
				event.preventDefault();	
			}
		}
	}

	// #用于operations的函数

	/**
	* 创建一个表格
	* @function createTable
	* @param {Node} parentNode 在这个节点内创建表格
	* @param {Node} afterNode 在这个节点之前创建表格
	*/
	function createTable(parentNode, afterNode){
		// 创建table // 聚焦到table
		var table = $.createTable();
		$(table)
			.appendTo(parentNode,afterNode)
			.focus();
	}

	return new TablePlug("tablePlug");
})