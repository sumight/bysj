/**
* 该模块用来管理插件
* @medule plug.state.mgr
*/
define(["../others/util.js"],function(util){
	/**
	* 进行插件的状态的管理
	* @object plugStateMgr
	*/
	plugStateMgr = {
		/**
		* 插件管理器的状态，指明当前的插件
		* @property {String} state
		*/
		state:null,

		/**
		* 内联插件的状态，指明当前的内联插件
		* @property {String} innerState
		*/
		innerState:null,

		/**
		* 默认的处理插件
		* @property {String} defaultPlug
		*/
		defaultPlug:null,

		/**
		* 插件和插件名之间的映射
		* @property {Object} plugsMap
		*/
		plugsMap:{},

		/**
		* 内联插件和插件名之间的映射
		* @property {Object} innerPlugsMap
		*/
		innerPlugsMap:{},

		/**
		* 获得当前的插件的状态
		* @method getState
		* @return {String} 插件状态
		*/
		getState:function(){
			return this.state;
		},

		/**
		* 获得当前的插件的状态
		* @method setState
		* @param {String} plugName 插件状态
		*/
		setState:function(plugName){
			this.state = plugName;
		},

		/**
		* 注册一个插件
		* @method registerPlug
		* @param {String} plugName 插件的名字
		* @param {Object} plugObject 插件的对象
		*/
		registerPlug:function(plugObject){
			plugObject.registerMgr(this);
		},

		/**
		* 注册一个内联插件
		* @method registerInnerPlug
		* @param {String} plugName 插件的名字
		* @param {Object} plugObject 插件的对象
		*/
		registerInnerPlug:function(plugObject){
			plugObject.registerMgr(this,true);
		},

		/**
		* 插件之间工作的转换
		* @method switchPlug
		* @param {Object} startPlug 原plug
		* @param {String} leaveEvent 原plug的离开事件类型 skip new skipinner
		*/
		switchPlug:function(startPlug, leaveEvent){
			// 处理skip离开事件
			if(leaveEvent == "skip"){
				this.redispatchDuty();
			}
			// 处理create事件
			if(leaveEvent == "new"){
				// 原来插件的辖区
				var scope = startPlug.getScope();
				// 用默认插件创建一个段落
				this.defaultPlug.operations.createParagraph(scope.parentNode, scope.nextElementSibling)
				// 启用默认插件
				this.defaultPlug.enter();
			}
			// 处理skipinner事件
			if(leaveEvent == "skipinner"){
				this.redispatchDuty(true);
			}
		},

		/**
		* 重新分派插件的责任
		* @method redispatchDuty
		* @param {Boolean} isInInnerRange 是否在内联插件的范围内
		*/
		redispatchDuty:function(isInInnerRange){
			if(isInInnerRange){
				var tag = false;
				for(var key in this.innerPlugsMap){
					var plug = this.innerPlugsMap[key];
					if(plug.isCharge()){
						if(tag == true){
							throw new Error("内联插件职责冲突，检查"+this.getState()+"和"+plug.plugName+"这两个插件的isCharge方法");
						}
						else{
							tag = true;
						}
						plug.enter(true);
						return null;
					}
				}
				this.innerState = null;
			}else{
				var tag = false;
				for(var key in this.plugsMap){
					var plug = this.plugsMap[key];
					if(plug.isCharge()){
						if(tag == true){
							// throw new Error("插件职责冲突，检查"+this.getState()+"和"+plug.plugName+"这两个插件的isCharge方法");
						}
						else{
							tag = true;
						}
						plug.enter();
					}
				}				
			}
		}
	}

	return plugStateMgr;
})