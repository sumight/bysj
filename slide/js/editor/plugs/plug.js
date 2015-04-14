/**
* 这个模块为所有编辑器插件的超类
* @module plug
*/
define(function(){
	/**
	* 一个文本编辑器插件的超类
	* @class Plug
	*/
	function Plug(){}

	/**
	* 插件的名字
	* @property {String} plugName
	* @for Plug
	*/
	Plug.prototype.plugName = null;
	
	/**
	* 插件管理器的引用
	* @property {Object} plugStateMgr
	* @for Plug
	*/
	Plug.prototype.plugStateMgr = null;

	/**
	* 一个包含对列表的所有操作的对象，用于对外提供
	* @property operations
	* @for Plug
	*/
	Plug.prototype.operations = null;

	/**
	* 将自己注册到一个插件管理器中
	* @method registerMgr
	* @for Plug
	* @param {Object} plugStateMgr 插件管理器
	* @param {Boolean} isRegisterInner 是否进行内联插件的注册
	*/
	Plug.prototype.registerMgr = function(plugStateMgr,isRegisterInner){
		if(isRegisterInner){
			plugStateMgr.innerPlugsMap[this.plugName] = this;
			this.plugStateMgr = plugStateMgr;
		}else{
			plugStateMgr.plugsMap[this.plugName] = this;
			this.plugStateMgr = plugStateMgr;			
		}
	}

	/**
	* 切换为本插件的状态
	* @method enter
	* @param {Boolean} isInner 是否是内联插件
	* @param {function} cb 回调函数
	* @for Plug
	*/
	Plug.prototype.enter = function(isInner, cb){
		if(isInner){
			this.plugStateMgr.innerState = this.plugName;
		}else{
			this.plugStateMgr.setState(this.plugName);
		}
		if(cb) cb();
	}
	
	/**
	* 调用的时候告诉插件管理器，已经跳出了当前的插件控制范围
	* @method leave
	* @param {String} leaveEvent 离开的事件类型 [new(离开后新建),delete(删除后离开),skip(跳跃离开也就是焦点突然转变)]
	* @param {function} cb 回调函数	
	* @for Plug
	*/
	Plug.prototype.leave = function(leaveEvent, cb){
		// 调用插件管理器的转换插件的函数
		this.plugStateMgr.switchPlug(this, leaveEvent);
		if(cb) cb();
	}

	/**
	* 判断当前的焦点是否在插件所辖的文本区域内
	* @interface isCharge
	* @for Plug
	* @return {Boolean} 是否
	*/
	Plug.prototype.isCharge = function(){
		throw new Error("这是一个接口，无法被调用")
	}

	/**
	* 对键盘事件做出反应
	* @interface actForKey
	* @for Plug
	* @param {Event} event 键盘事件对象
	*/
	Plug.prototype.actForKey = function(event){
		throw new Error("这是一个接口，无法被调用")
	}

	/**
	* 获取当前焦点的所在范围
	* @method getScope
	* @for Plug
	* @returns {Node} 返回一个节点作为范围，如果不在范围内，则返回null
	*/
	Plug.prototype.getScope = function(){
		throw new Error("这是一个接口，无法被调用")
	}

	return Plug
})