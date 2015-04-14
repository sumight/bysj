/**
* 对快捷键做出反应的函数
* @module actForShortcutKey
*/

define([
	"./others/util.js",
	"./plugs/plug.state.mgr.js"
],function(util,plugStateMgr){
	/**
	* 对快捷键做出反应
	* @function actForShortcutKey
	* @param {Event} event 事件对象 
	*/
	function actForShortcutKey(event){
		var keyName = util.getKeyName(event.keyCode);
		if(event.ctrlKey){
			switch(keyName){
			// ctrl + u
			case "U":
				ctrlUHandle(event);
				break;
			// ctrl + o
			case "O":
				ctrlOHandle(event);
				break;
			// ctrl + t
			case "T":
				ctrlTHandle(event);
				break;
			// ctrl + h
			case "H":
				ctrlHHandle(event);
				break;
				// ctrl + c
			case "C":
				ctrlCHandle(event);
				// ctrl + p
			case "P":
				ctrlPHandle(event);
			}
		}
	}

	/**
	* 处理control+u事件
	* @function ctrlUHandle
	* @param {Event} event 事件对象
	*/
	function ctrlUHandle(event){
		if(plugStateMgr.defaultPlug.isCharge()){
			plugStateMgr.plugsMap["listPlug"].enter();
			plugStateMgr.plugsMap["listPlug"].operations.createList(false);			
		}
		event.preventDefault();
	}

	/**
	* 处理control+o事件
	* @function ctrlOHandle
	* @param {Event} event 事件对象
	*/
	function ctrlOHandle(event){
		if(plugStateMgr.defaultPlug.isCharge()){
			plugStateMgr.plugsMap["listPlug"].enter();
			plugStateMgr.plugsMap["listPlug"].operations.createList(true);			
		}
		event.preventDefault();
	}

	/**
	* 处理control+t事件
	* @function ctrlTHandle
	* @param {Event} event 事件对象
	*/
	function ctrlTHandle(event){
		// 判断焦点是否在defaultPlug所负责的内容
		if(plugStateMgr.defaultPlug.isCharge()){
			var paragraph = util.getFocusElement();
			var section = paragraph.parentNode;
			plugStateMgr.plugsMap["tablePlug"].enter()
			plugStateMgr.plugsMap["tablePlug"].operations.createTable(section,paragraph.nextElementSibling);
			// 清理空段落
			plugStateMgr.defaultPlug.operations.clearParagraph(paragraph);
		}
		event.preventDefault();
	}

	/**
	* 处理control+h事件
	* @function ctrlTHandle
	* @param {Event} event 事件对象
	*/
	function ctrlHHandle(event){
		var headingModel = plugStateMgr.plugsMap['headingPlug'].headingModel
		var editorArea = document.getElementById('editor_area');
		if(headingModel){
			// 处于标题模式
			editorArea.setAttribute('data-headingmodel','false');
		}else{
			// 没有处于标题模式
			var editable = util.getFocusElement()
			util.backSelfHeading(editable);
			editorArea.setAttribute('data-headingmodel','true');
			plugStateMgr.redispatchDuty();
		}

		plugStateMgr.plugsMap['headingPlug'].headingModel = !headingModel
		event.preventDefault()
	}

	/**
	* 处理control+c事件
	* @function ctrlTHandle
	* @param {Event} event 事件对象
	*/
	function ctrlCHandle(event){
		plugStateMgr.innerPlugsMap['commentPlug'].operations.createComment();
		plugStateMgr.innerPlugsMap['commentPlug'].enter(true);
		event.preventDefault();
	}

	/**
	* 处理control+p事件
	* @function ctrlPHandle
	* @param {Event} event 事件对象
	*/
	function ctrlPHandle(event){
		console.log("ctrl P mgrState:",plugStateMgr.getState())
		console.log("ctrl P mgrInnerState:",plugStateMgr.innerState)
		event.preventDefault();
	}

	return actForShortcutKey;
})