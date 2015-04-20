// 基础工具-----------------------------------------------------
define(function(){
	return {
		// 事件代理
		delegate:function(parentElement,eventType,eventHandle){
			// 如果浏览器支持addEventListener，说明是IE9以及以上版本	
			if(parentElement.addEventListener){
				// 使用addEventListener，进行事件捕获，为了支持focus等无法冒泡的事件
				parentElement.addEventListener(eventType,function(event){
					eventHandle(event);
				},true);
			// 如果不支持addEventListener，说明是IE9以下版本
			}else if(parentElement.attachEvent){
				// IE9以下版本不支持事件的捕获，但是focus，blur等又无法冒泡，
				// 所以替换为可以冒泡的focusin和focusout	
				if(eventType==="focus") eventType="focusin";
				if(eventType==="blur") eventType="focusout";
				parentElement.attachEvent("on"+eventType,function(event){
					event = event||window.event;
					eventHandle(event);
				})
			}	
		},
		// 遍历所有子元素
		findOffspring:function(root,cb){
			var fc = root.firstElementChild;
			while(fc){
				cb(fc);
				this.findOffspring(fc,cb);
				fc = fc.nextElementSibling;
			}
		},
		// 先序遍历文档树的节点,满足回调函数则停止遍历
		preoderNode:function(root ,cb){
			var stack = [];
			var node = root;
			while(node){
				if(cb(node)) return node;
				var child = node.lastElementChild;
				while(child){
					stack.push(child);
					child = child.previousElementSibling;
				}
				node = stack.pop();
			}
			return null;
		},
		// 后序遍历文档树的节点,满足回调函数则停止遍历
		afterorderNode:function(root,cb){
			// 存数组的栈
			var stack = [root];
			// 某节点
			var node = stack.pop();
			do{
				// 判断是否是拆封的节点
				if(node.single){
					// 如果节点已经拆封，则删除单身标记，处理节点
					delete node.single;
					if(cb(node)){
						// 如果处理的目的已经达到，则处理结束
						// 清理single标记
						var xnode = stack.pop();
						while(xnode){
							if(xnode.single){
								delete xnode.single;
							}
							// 接棒
							xnode = stack.pop();
						}
						// 返回导致处理结束的节点
						return node;
					}
				}else{
					// 如果没有拆封，则拆封后放回
					// 添加单身节点
					node.single = true;
					stack.push(node);
					// 遍历子元素压入栈中
					var child = node.firstElementChild;
					while(child){
						stack.push(child);
						child = child.nextElementSibling;
					}
				}
				// 取一个节点
				node = stack.pop();
			}while(node)
		},
		// 判断是否是title元素
		isTitle:function(node){
			var tagName = node.tagName;
			if(tagName.charAt(0)==='H'&&Number(tagName.charAt(1))!==NaN){
				return true;
			}
			return false;
		},
		// 选中元素中的文字
		selectAllText:function(node){
			// 选择对象
			var selection = window.getSelection();
			// 新建选择范围对象
			var range = document.createRange();
			// 设置选择范围
			if(node.firstChild){
				range.setStart(node.firstChild,0);
				range.setEnd(node.firstChild,node.innerText.length);
				// 设置选择对象的选择范围
				selection.removeAllRanges();
				selection.addRange(range);
			}
		},
		// 获取当前的焦点所在的元素
		getFocusElement:function(){
			// 获取选择对象
			var selection = window.getSelection();
			// 获取焦点元素
			var focusNode = selection.focusNode;
			// 如果焦点元素为空，则直接返回空
			if(!focusNode) return null;
			if(focusNode.nodeType === 3){
				// 如果焦点是文本节点
				//判断文本节点是否位于可编辑元素的最后
				var pNode = focusNode;
				while(pNode.nodeType==3 ||!pNode.hasAttribute('contenteditable')){
					pNode = pNode.parentNode;
				}
				return pNode;
			}else{
				//如果节点不是文本节点
				var pNode = focusNode;

				while(!pNode.hasAttribute('contenteditable')){
					if($(pNode).hasClass('.editor_area')) return false;
					pNode = pNode.parentNode;
				}
				return pNode;
			}
		},
		//判断光标是否位于可编辑元素的最后
		isFocusLast:function(){
			//获取文本选择对象
			var selector = window.getSelection();
			//获取焦点元素
			var focusNode = selector.focusNode;
			if(focusNode.nodeType === 3){
				//如果节点是文本节点
				//判断光标是否在文本节点的最后
				if(focusNode.nodeValue.length===selector.focusOffset){
					//如果文本选择器光标位置和文本长度一样
					//判断文本节点是否位于可编辑元素的最后
					var pNode = focusNode;
					while(pNode.nodeType==3 ||!pNode.hasAttribute('contenteditable')){
						if(pNode.parentNode.lastChild !== pNode){
							return false;
						}
						pNode = pNode.parentNode;
					}
					return true
				}
			}else{
				//如果节点不是文本节点
				var pNode = focusNode;
				if(pNode.hasAttribute('contenteditable')){
					//如果pNode就是可编辑元素
					if(selector.focusOffset === pNode.childNodes.length){
						return true;
					}else{
						return false;
					}
				}
				//判断节点是否位于可编辑元素的最后
				
				while(!pNode.hasAttribute('contenteditable')){
					var ppNode = pNode.parentNode;
					if(pNode.parentNode.lastChild !== pNode){
						return false;
					}
					pNode = pNode.parentNode;
				}
				return true
			}
		},
		// 根据当前元素获取下一个可编辑元素
		getNextEditable:function(nowEditable){
			var util = this;
			// 可编辑元素
			var theEditable = null;
			// 当前元素的子元素
			var child = nowEditable.firstElementChild;
			// 遍历所有子元素
			while(child){
				// 先序遍历子元素的子孙，寻找可编辑元素
				theEditable = this.preoderNode(child,function(node){
					if(util.isEditable(node))
						return true;
				});
				// 找到可编辑元素就返回
				if(theEditable) return theEditable;
				// 没有找到则找下一个子元素
				child = child.nextElementSibling;
			}
			// 祖先元素的下一个兄弟元素
			var ancestor = null;
			// 当前元素的祖先元素
			ancestor = nowEditable;
			// 追溯祖先
			while(ancestor.id!=='editor_area'){
				// 下一个子元素
				var nextSibling = ancestor.nextElementSibling;
				// 遍历右兄弟
				while(nextSibling){
					// 先序遍历右兄弟元素，寻找可编辑元素
					theEditable = this.preoderNode(nextSibling,function(node){
						if(util.isEditable(node))
							return true;
					});
					// 如果找到可编辑元素则返回
					if(theEditable) return theEditable;
					// 接棒
					nextSibling = nextSibling.nextElementSibling;
				}
				// 接棒
				ancestor = ancestor.parentNode;
			}
			return null;
		},
		// 根据当前元素获取上一个可编辑元素
		getPreviousEditable:function(nowElement){
			var util = this;
			// 可编辑元素
			var theEditable = null;
			// 祖先元素
			var ancestor = nowElement;
			// 向上追溯祖先
			while(ancestor.id !== 'editor_area'){
				// 前兄弟元素
				var previousSibling = ancestor.previousElementSibling;
				// 向前遍历兄弟元素
				while(previousSibling){
					theEditable = this.afterorderNode(previousSibling,function(node){
						if(util.isEditable(node))
							return true;
					});
					// 如果找到了可编辑元素则停止返回
					if(theEditable) return theEditable;
					// 接棒
					previousSibling = previousSibling.previousElementSibling;
				}
				// 接棒
				ancestor = ancestor.parentNode;
			}
			return null;
		},
		//判断文件是否是图片
		isFileImg:function(file){
			if(file instanceof File){
				var name = file.name;
				if(file.name.indexOf('.png')>-1){
					return true;
				}else if(file.name.indexOf('.gif')>-1){
					return true;
				}else if(file.name.indexOf('.jpg')>-1){
					return true;
				}else if(file.name.indexOf('.bmp')>-1){
					return true;
				}
			}
			return false;
		},
		//判断是否是可编辑元素
		//可编辑元素的定义，contentEditable为true的元素(正文行，列表行，表格单元格)，标题
		isEditable:function(node){
			if(node.contentEditable == 'true'||this.isTitle(node)){
				return true;
			}else{
				return false;
			}
		},
		//获取子元素在父元素中的排序
		getChildRank:function(child){
			var parent = child.parentNode;
			var i;
			var length = parent.childNodes.length;
			for(i=0;i<length;i++){
				if(parent.childNodes[i]===child){
					return i+1;
				}
			}
			return 0;
		},

		/**
		* 通过键值判断键位
		* @function getKeyName
		* @param {Integer} keyCode 键值
		* @returns {String} 键名
		*/
		getKeyName:function(keyCode){
			// 键值键位的映射
			keysMap = {
				// 字母
				"65":"A",
				"66":"B",
				"67":"C",
				"68":"D",
				"69":"E",
				"70":"F",
				"71":"G",
				"72":"H",
				"73":"I",
				"74":"J",
				"75":"K",
				"76":"L",
				"77":"M",
				"78":"N",
				"79":"O",
				"80":"P",
				"81":"Q",
				"82":"R",
				"83":"S",
				"84":"T",
				"85":"U",
				"86":"V",
				"87":"W",
				"88":"X",
				"89":"Y",
				"90":"Z",
				// 数字
				"48":"0",
				"49":"1",
				"50":"2",
				"51":"3",
				"52":"4",
				"53":"5",
				"54":"6",
				"55":"7",
				"56":"8",
				"57":"9",
				// 功能
				"8":"BackSpace",
				"9":"Tab",
				"13":"Enter",
				"16":"Shift",
				"17":"Control",
				"18":"Alt",
				"27":"Esc",
				"46":"Delete",
				// 方向
				"37":"LeftArrow",
				"38":"UpArrow",
				"39":"RightArrow",
				"40":"DownArrow"
			}
			return keysMap[keyCode]
		},
		// 定位到下一个可编辑元素
		focusNextEditable:function(nowEditable,cursorAtStart){
			// 文本选取对象
			var selection = window.getSelection();
			// 下一个可编辑元素
			var nextEditable = this.getNextEditable(nowEditable);
			// 如果有下一个可编辑元素
			if(nextEditable){
				// 如果下一个元素是标题
				if(this.isTitle(nextEditable)){
					// 全选文字
					this.selectAllText(nextEditable);
				}else{
					if(!!nextEditable.firstChild){
						// 如果下一个可编辑元素有子元素
						// 根据参数设置光标位置
						if(cursorAtStart){
							selection.collapse(nextEditable, 0);
						}else{
							selection.collapse(nextEditable, nextEditable.childNodes.length);
						}
					}
				}
				return true;
			}else{
				return false;
			}
			nextEditable.focus();
		},
		// 定位到上一个可编辑元素
		focusPreviousEditable:function(nowEditable,cursorAtStart){
			// 文本选取对象
			var selection = window.getSelection();
			// 下一个可编辑元素
			var preEditable = this.getPreviousEditable(nowEditable);
			// 如果有下一个可编辑元素
			if(preEditable){
				if(this.isTitle(preEditable)){
					// 全选文字
					this.selectAllText(preEditable);
				}else{
					if(!!preEditable.firstChild){
						// 根据参数设置光标位置
						if(cursorAtStart){
							selection.collapse(preEditable.firstChild, 0);
						}else{
							selection.collapse(preEditable, preEditable.childNodes.length);
						}
					}
				}
			}
			// 聚焦
			preEditable.focus();
		},
		/**
		* @function backSelfHeading
		* @param {Node} nowEditable 当前的编辑元素
		*/ 
		backSelfHeading:function(nowEditable){
			var section = nowEditable;
			while(section.tagName != 'SECTION'){
				section = section.parentNode;
			}
			var heading = section.firstElementChild;
			console.log('heading',heading);
			heading.focus();
			var selection = window.getSelection();
			selection.collapse(heading.firstChild, heading.innerHTML.length);
		},

		/**
		* 是否聚焦在元素的最后
		* @function isFocusLastOf
		* @param {Node} theEditable 被判定的可编辑元素
		* @returns {Boolean} 是否在聚焦在可编辑元素的最后
		*/
		isFocusLastOf:function(theEditable){
			// 判断theEditable是否为行内编辑元素
			var isInner = theEditable.getAttribute("contenteditable")==="true"?false:true;
			var selection = window.getSelection();
			var focusNode = selection.focusNode;
			if(isInner){
				if(selection.focusOffset === 1){
					if((selection.focusNode.nodeValue.charAt(0)===" ")||(selection.focusNode.nodeValue.charCodeAt(0)===160)){
						if(selection.focusNode.previousSibling === theEditable)
							// 如果位于插件范围中的外部范围的空格之后
							return true;
					}
				}
				return false;
			}else{
				var theLastChild;
				if(focusNode.nodeType === 3){
					// 如果焦点节点为文本节点
					if(selection.focusOffset !== focusNode.nodeValue.length)
						return false;
				}
				while(focusNode !== theEditable){
					theLastChild = focusNode.parentNode.lastChild;
					if(theLastChild === focusNode){
						focusNode = focusNode.parentNode;
					}else{
						return false;
					}
				}
				return true;
			}
		},

		/**
		* 是否聚焦在可编辑元素的最开始
		* @function isFocusFirstOf
		* @param {Node} theEditable 被判定的可编辑元素
		* @returns {Boolean} 是否聚焦在可编辑元素的开头
		*/
		isFocusFirstOf:function(theEditable){
			// 判断theEditable是否为行内编辑元素
			var isInner = theEditable.getAttribute("contenteditable")==="true"?false:true;

			var selection = window.getSelection();
			var focusNode = selection.focusNode;
			var originFocusNode = focusNode;
			var theFirstChild;
			while(focusNode !== theEditable){
				theFirstChild = focusNode.parentNode.firstChild;
				if(theFirstChild === focusNode){
					focusNode = focusNode.parentNode;
				}else{
					return false;
				}
			}
			// 如果不为文本节点则说明可编辑元素中没有内容
			if(isInner){
				// 如果是内联的
				if(originFocusNode.nodeType === 3){
					// 如果焦点节点为文本节点
					if(selection.focusOffset === 1){
						if((selection.focusNode.nodeValue.charAt(0) === " ")||(selection.focusNode.nodeValue.charCodeAt(0)===160)){
							return true;
						}
					}
					return false;
				}	
			}else{
				// 如果不是内联的
				if(originFocusNode.nodeType === 3){
					// 如果焦点节点为文本节点
					if(selection.focusOffset === 0){
						return true;
					}
					return false;
				}
			}
		}
	}
})
