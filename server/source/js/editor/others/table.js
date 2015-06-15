define(['./util.js'],function(util){
	// 创建一个只有一个单元格的可编辑表格，返回一个表格对象
	var Table = function(tableElement){
		this.tableElement = tableElement;
		this.tableBody = tableElement.getElementsByTagName('tbody')[0];
		this.tableHead = tableElement.getElementsByTagName('thead')[0];
		this.newEditable = this.tableHead.firstElementChild.firstElementChild;
		this.colNumber = this.tableHead.firstElementChild.childElementCount;
		this.isEditable = true;
	}
	// table对象共享的方法
	Table.prototype = (function(){
		// 聚焦到一个单元格
		function _focusCell(cell){
			util.selectAllText(cell);
			cell.focus();
		}
		// 在另外一行之前插入一行，如果没有传入另外一行，则在tbody的最后插入
		function _insertRowBefore(nexttr){
			// 创建一个tr
			var tr = document.createElement('tr');
			// 填充tr中的td
			var htmlText = '';
			for(var i=0; i<this.colNumber; i++){
				htmlText+='<td contenteditable="true"></td>';
			}
			tr.innerHTML = htmlText;
			// 插入
			this.tableBody.insertBefore(tr,nexttr);
			return tr;
		}
		// 删除一行
		function _removeRow(tr){
			console.log(this.tableBody);
			console.log(tr);
			this.tableBody.removeChild(tr);
			return tr;
		}
		// 在一个th之前插入一个th
		function _insertHeadCellBefore(nextth){
			// 创建一个th
			var th = document.createElement('th');
			th.setAttribute('contenteditable','true');
			// 插入
			this.tableHead.firstElementChild.insertBefore(th,nextth);
			return th;
		}
		// 删除一个th
		function _removeHeadCell(th){
			this.tableHead.firstChild.removeChild(th);
			return th;
		}
		// 获得前一个单元格
		function _getPreCell(cell){
			return util.getPreviousEditable(cell);
		}
		// 获得后一个单元格
		function _getNextCell(cell){
			return util.getNextEditable(cell);
		}
		// 获取前一行，包括表头行
		function _getPreRow(row){
			// 试图获取前一行
			var preRow = row.previousElementSibling;
			if(!!preRow){
				// 如果前一行存在，则返回
				return preRow;
			}else{
				// 否则如果当前行在tbody中
				if(row.parentNode.tagName==='TBODY'){
					// 返回thead的行
					return this.tableHead.firstElementChild;
				}
			}
			return null;
		}
		// 获取后一行，包括在表头行获取表体行
		function _getNextRow(row){
			// 视图获取后一行
			var nextRow = row.nextElementSibling;
			if(!!nextRow){
				// 如果存在后一行，则返回
				return nextRow;
			}else{
				// 否则如果当前行在thead中
				if(row.parentNode.tagName==='THEAD'){
					// 返回tbody的第一行
					return this.tableBody.firstElementChild;
				}
			}
			return null;
		}
		// 获得上一个单元格
		function _getUpCell(cell){
			// 当前行
			var row = cell.parentNode;
			// 获取前一行
			var preRow = _getPreRow.call(this,row);
			if(!!preRow){
				// 如果前一行存在
				// 获取当前单元格的索引
				var cellArray = Array.prototype.slice.call(row.children);
				var index = cellArray.indexOf(cell);
				// 返回相同索引的上一个cell；
				return preRow.children[index];
			}
			return null;
		}
		// 获得下一个单元格
		function _getDownCell(cell){
			// 当前行
			var row = cell.parentNode;
			// 获取前一行
			var nextRow = _getNextRow.call(this,row);
			if(!!nextRow){
				// 如果前一行存在
				// 获取当前单元格的索引
				var cellArray = Array.prototype.slice.call(row.children);
				var index = cellArray.indexOf(cell);
				// 返回相同索引的上一个cell；
				return nextRow.children[index];
			}
			return null;
		}
		// 定位到前一个单元格
		function focusPreCell(){
			// 获取当前值
			var cell = util.getFocusElement();
			if(!!cell){
				// 如果cell存在
				// 获取前一个cell
				var preCell = _getPreCell.call(this,cell);
				// 全选之
				util.selectAllText(preCell);
				preCell.focus();
			}
			return this;
		}
		// 定位到后一个单元格
		function focusNextCell(){
			// 获取当前值
			var cell = util.getFocusElement();
			if(!!cell){
				// 如果cell存在
				// 获取前一个cell
				var preCell = _getNextCell.call(this,cell);
				// 全选之
				if(!!preCell){
					_focusCell(preCell);
				}
			}
			return this;
		}
		// 定位到上一个单元格
		function focusUpCell(){
			// 获取当前值
			var cell = util.getFocusElement();
			if(!!cell){
				// 如果cell存在
				// 获取前一个cell
				var preCell = _getUpCell.call(this,cell);
				// 全选之
				util.selectAllText(preCell);
				preCell.focus();
			}
			return this;
		}
		// 定位到下一个单元格
		function focusDownCell(){
			// 获取当前值
			var cell = util.getFocusElement();
			if(!!cell){
				// 如果cell存在
				// 获取前一个cell
				var preCell = _getDownCell.call(this,cell);
				// 全选之
				util.selectAllText(preCell);
				preCell.focus();
			}
			return this;
		}
		// 在表体为空的情况下，在表头添加一个单元格,否则添加失败只是跳转到下一个单元格
		function appendHeadCell(){
			// 添加一个新的单元格
			var newCell = _insertHeadCellBefore.call(this,null);
			// 聚焦到新的单元格
			_focusCell.call(this,newCell);
			return this;
		}
		// 在表头删除最后一个单元格
		function removeLastHeadCell(){
			var cell = util.getFocusElement();
			var row = cell.parentNode;
			var lastCell = row.lastElementChild;
			// 当前单元的前一个单元
			var preCell = _getPreCell.call(this,cell);
			// 删除最后一个cell
			_removeHeadCell.call(this,lastCell);
			// 聚焦到前一个cell
			_focusCell.call(this,preCell);
			return this;
		}
		// 在当前表格后添加一行
		function insertRow(){
			// 获取当单元格
			var nowCell = util.getFocusElement();
			// 获取当前行
			var nowRow = nowCell.parentNode;
			// 获取下一行,即使当前行在表头中，下一行也一定在表体中
			var nextRow = _getNextRow.call(this,nowRow);
			// 插入行
			var newRow = _insertRowBefore.call(this,nextRow);
			// 聚焦到下一个
			_focusCell.call(this,newRow.firstElementChild);
			return this;
		}
		// 删除当前行
		function removeRow(cell){
			// 获取当单元格
			var nowCell = cell||util.getFocusElement();
			// 获取当前行
			var nowRow = nowCell.parentNode;
			// 聚焦到前一个单元格
			var preCell = _getPreCell(nowCell)
			util.selectAllText(preCell);
			preCell.focus();
			// 在表体中删除这一行
			_removeRow.call(this,nowRow);
			// 如果nowRow不在表体中，删除也就无法成功
			return this;
		}
		// 将这个表格添加到某个元素中
		function appendTo(parentElement, nextElement){
			// 将表格添加到固定元素
			parentElement.insertBefore(this.tableElement,nextElement);
			return this;
		}
		// 在文档中删除自己
		function removeSelf(){
			var table = this.tableElement;
			// table的父元素
			var parent = table.parentNode;
			if(!!parent){
				// 如果父元素存在，则在父元素中删除自己
				parent.removeChild(table);
			}
		}
		// 切换可编辑状态
		function switchEditable(isEditable){
			if(this.isEditable !== isEditable){
				if(isEditable){
					// 如果需要切换到可编辑
					// 遍历所有后代
					util.findOffspring(this.tableElement,function(ele){
						// 如果是编辑元素，设置为可编辑
						if(ele.hasAttribute('contenteditable')){
							ele.setAttribute('contenteditable','true');
						}
					})
				}else{
					// 如果需要切换到不可编辑
					// 遍历所有后代
					util.findOffspring(this.tableElement,function(ele){
						// 如果是编辑元素，设置为不可编辑
						if(ele.hasAttribute('contenteditable')){
							ele.setAttribute('contenteditable','false');
						}
					})
				}
			}
			return this;
		}
		// 表体是否为空
		function isTableBodyEmpty(){
			if(!this.tableBody.firstElementChild){
				return true;
			}else{
				return false;
			}
		}
		// 聚焦到table
		function focus(){
			_focusCell.call(this,this.tableElement.firstElementChild.firstElementChild.firstElementChild);
			return this;
		}
		// 获得table的第一个cell
		function getFirstCellOfTable(){
			return this.tableElement.firstElementChild.firstElementChild.firstElementChild;
		}
		// 获得table的最后一个cell
		function getLastCellOfTable(){
			return this.tableElement.lastElementChild.lastElementChild.lastElementChild;
		}
		return {
			focus:focus,
			switchEditable:switchEditable,
			appendTo:appendTo,
			removeRow:removeRow,
			insertRow:insertRow,
			removeLastHeadCell:removeLastHeadCell,
			appendHeadCell:appendHeadCell,
			focusDownCell:focusDownCell,
			focusUpCell:focusUpCell,
			focusNextCell:focusNextCell,
			focusPreCell:focusPreCell,
			isTableBodyEmpty:isTableBodyEmpty,
			removeSelf:removeSelf,
			getFirstCellOfTable:getFirstCellOfTable,
			getLastCellOfTable:getLastCellOfTable
		}
	})();
	// ele 是table中的任意子元素
	var tQuery = function(ele){
		// 将ele定位可能的table元素
		var tableElement = ele;
		// 寻找table元素
		while(!!tableElement){
			if(tableElement.tagName === 'TABLE'){
				// 如果找到了停止循环，当前可能的table元素作为真正的table元素
				break;
			}else{
				// 否则向上遍历
				tableElement = tableElement.parentNode;
			}
		}
		if(!!tableElement){
			// 如果找到了table元素，返回新创建的table对象
			return new Table(tableElement);
		}else{
			// 否则抛出错误找不到table元素
			throw new Error('找不到table元素');
		}
	}
	// 创建一个table元素
	tQuery.createTable = function(){
		// 创建一个表格元素
		var table = document.createElement('table');
		table.innerHTML = '<thead><tr><th></th></tr></thead><tbody></tbody>';
		// 获取th
		var th = table.firstElementChild.firstElementChild.firstElementChild;
		// 设置th为可编辑
		th.setAttribute('contenteditable','true');
		// 返回table
		return table;
	}
	// 判断是否是表头单元格
	tQuery.isHeadCell = function(cell){
		if(cell.tagName ==='TH'){
			return true;
		}else{
			return false;
		}
	}
	// 判断表格行是否为空
	tQuery.isRowEmpty = function(cell){
		var row = cell.parentNode;
		var nextCell = row.firstElementChild;
		while(nextCell){
			if(nextCell.innerHTML !==''){
				// 如果有一个cell不为空
				return false;
			}
			nextCell = nextCell.nextElementSibling;
		}
		return true;
	}
	// 判断单元格是否为行的第一个单元格
	tQuery.isFirstCellOfRow = function(cell){
		if(!cell.previousElementSibling){
			return true;
		}else{
			return false;
		}
	}
	// 判断是否为表格中第一个单元格
	tQuery.isFirstCellOfTable = function(cell){
		var tr = cell.parentNode;
		var thead = tr.parentNode;
		if(tr.firstElementChild !== cell)
			return false;
		if(thead.tagName !== 'THEAD')
			return false;
		return true;
	}
	// 判断是否为表格中最后一个单元格
	tQuery.isLastCellOfTable = function(cell){
		var tr = cell.parentNode;
		var tbody = tr.parentNode;
		var table = tbody.parentNode;
		if(tr.lastElementChild !== cell)
			return false;
		if(tbody.tagName !== 'TBODY')
			return false;
		if(tbody.lastElementChild !== tr)
			return false;
		return true;
	}
	// 判断是否为表格中第一个行
	tQuery.isFirstRowOfTable = function(cell){
		var tr = cell.parentNode;
		var thead = tr.parentNode;
		if(thead.tagName !== 'THEAD')
			return false;
		return true;
	}
	// 判断是否为表格中最后一个行
	tQuery.isLastRowOfTable = function(cell){
		var tr = cell.parentNode;
		var tbody = tr.parentNode;
		if(tbody.tagName !== 'TBODY')
			return false;
		if(tbody.lastElementChild !== tr)
			return false;
		return true;
	}
	// 判断单元格是否是最后一个单元格
	tQuery.isLastCellOfRow = function(cell){
		if(!cell.nextElementSibling){
			return true;
		}else{
			return false;
		}
	}
	// 判断单元格是否为空
	tQuery.isCellEmpty = function(cell){
		if(cell.innerHTML===''){
			return true;
		}else{
			return false;
		}
	}
	// 判断可编辑元素是否在表格中
	tQuery.isCellOfTable = function(theEditable){
		if((theEditable.tagName==='TH')||(theEditable.tagName === 'TD')){
			return true;
		}else{
			return false;
		}
	}

	return tQuery;
})