/**
* 该模块为程序的入口，提供插件的管理，事件的导流的功能
* @module main
*/
require([
	"./js/editor/plugs/heading.plug.js",
	"./js/editor/plugs/list.plug.js",
	"./js/editor/plugs/default.plug.js",
	"./js/editor/plugs/table.plug.js",
	"./js/editor/plugs/image.plug.js",
	"./js/editor/plugs/comment.plug.js",
	"./js/editor/plugs/plug.state.mgr.js",
	"./js/editor/actForShortcutKey.js",
	],function(headingPlug,listPlug,defaultPlug,tablePlug,imagePlug,commentPlug,plugStateMgr,actForShortcutKey){
	// 注册插件
	plugStateMgr.registerPlug(headingPlug)
	plugStateMgr.registerPlug(listPlug)
	plugStateMgr.registerPlug(defaultPlug)
	plugStateMgr.registerPlug(tablePlug)

	// 注册内联插件
	// plugStateMgr.registerInnerPlug(commentPlug)
	
	// 指定起始插件
	plugStateMgr.setState(defaultPlug.plugName);
	// 指定默认插件
	plugStateMgr.defaultPlug = defaultPlug;
	// 对编辑器的键盘事件进行导流
	var $editorAreas = $(".editor_area");
	$(document).on('keydown','.editor_area',function(event){
		// 对内联插件做出反应
		// 是否传递到Block插件进行处理
		var isGoToBlockPlug = true;
		if(plugStateMgr.innerPlugsMap[plugStateMgr.innerState]){
			// 如果存在对应的内联插件
			isGoToBlockPlug = plugStateMgr.innerPlugsMap[plugStateMgr.innerState].actForKey(event);
		}
		// 对应的插件做出对应的反应
		if(isGoToBlockPlug){
			// 没有内联插件，isGoToBlockPlug的默认值为true
			plugStateMgr.plugsMap[plugStateMgr.getState()].actForKey(event);
		}
		// 编辑器的功能快捷键
		actForShortcutKey(event);		
	})
	// editorArea.addEventListener('keydown',function(event){
	// 	// 对内联插件做出反应
	// 	// 是否传递到Block插件进行处理
	// 	var isGoToBlockPlug = true;
	// 	if(plugStateMgr.innerPlugsMap[plugStateMgr.innerState]){
	// 		// 如果存在对应的内联插件
	// 		isGoToBlockPlug = plugStateMgr.innerPlugsMap[plugStateMgr.innerState].actForKey(event);
	// 	}
	// 	// 对应的插件做出对应的反应
	// 	if(isGoToBlockPlug){
	// 		// 没有内联插件，isGoToBlockPlug的默认值为true
	// 		plugStateMgr.plugsMap[plugStateMgr.getState()].actForKey(event);
	// 	}
	// 	// 编辑器的功能快捷键
	// 	actForShortcutKey(event);
	// })

	// 对内联插件的工作范围进行重新定向
	$(document).on('keyup','.editor_area',function(event){
		plugStateMgr.plugsMap[plugStateMgr.getState()].leave('skipinner');
	})
	// editorArea.addEventListener("keyup",function(event){
	// 	plugStateMgr.plugsMap[plugStateMgr.getState()].leave('skipinner');
	// })
	// 处理鼠标点击事件

	$(document).on('click','.editor_area',function(event){
		if(plugStateMgr.innerPlugsMap[plugStateMgr.innerState]){
			plugStateMgr.innerPlugsMap[plugStateMgr.innerState].leave('skipinner');
		}else{
			plugStateMgr.redispatchDuty(true);
		}
		plugStateMgr.plugsMap[plugStateMgr.getState()].leave('skip');
	})
	// editorArea.addEventListener('click',function(event){
	// 	if(plugStateMgr.innerPlugsMap[plugStateMgr.innerState]){
	// 		plugStateMgr.innerPlugsMap[plugStateMgr.innerState].leave('skipinner');
	// 	}else{
	// 		plugStateMgr.redispatchDuty(true);
	// 	}
	// 	plugStateMgr.plugsMap[plugStateMgr.getState()].leave('skip');
	// })
})