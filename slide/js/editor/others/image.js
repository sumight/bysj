define(['./util.js'],function(util){
	//最大的编辑区域
	var editor = document.getElementById('editor_area');
	//被选中的img
	var selectedImg = null;
	
	//imgNode的模板
	var imgHTML = "<span class='img_wrap' contenteditable='false'><img class='img'/><span class='scale_handle'></span></span>";	
	//图片读取
	var imgReader = new FileReader();
	
	//图片事件
	(function(){
		//添加事件代理，选中一个img元素
		editor.addEventListener('mousedown',function(event){
			var target = event.target;
			if(target.dataset.imgType === 'inline-img'){
				//如果点击了图片
				var img = target;
				var imgWrap = getImgWrap();
				if(imgWrap){
					//如果有图片被选中
					//解除被选中的图片
					unWrapImg(imgWrap);
				}
				//给当前被选图片加上外壳
				wrapImg(img);
				focusImg(getImgWrap());
			}else if(target.className=='scale_handle'){
				
			}else{
				//如果没有点击图片
				var imgWrap = getImgWrap();
				if(imgWrap){
					//如果有图片被选中
					//解除被选中的图片
					unWrapImg(imgWrap);
				}
			}
		})
		//调节图片大小
		
		//鼠标的起始位置
		var originX = 0;
		//图片的原始宽度
		var originWidth = 0;
		//获取鼠标偏移量的函数
		function showMouseOffset(event){
			event.preventDefault();
			event.stopPropagation();
			//计算鼠标的偏移量
			var offsetX = event.clientX - originX;
			//计算图片的大小
			var nowWidth = originWidth + offsetX;
			//设置图片大小
			getImgWrap().firstElementChild.style.width = nowWidth+'px';
		}
		//鼠标按下事件
		document.addEventListener('mousedown',function(event){
			//检测触发的事件的对象
			var target = event.target;
			if(target.className == 'scale_handle'){
				//设置鼠标的起始位置
				originX = event.clientX;
				//设置图片的原始宽度
				originWidth = getImgWrap().offsetWidth;
				//添加鼠标移动事件计算偏移量
				document.addEventListener('mousemove',showMouseOffset);				
			}
		})
		//鼠标弹起事件
		document.addEventListener('mouseup',function(event){
			//删除计算偏移量的事件处理
			document.removeEventListener('mousemove',showMouseOffset);
		})
		
		//拖动图片进入编辑元素时候，编辑元素被标注
		document.addEventListener('dragenter',function(event){
			event.preventDefault();
			var target = event.target;
			console.log('enter');
			if(target.contentEditable==='true'){
				//如果进入编辑元素
				//设置可编辑元素的样式为img-adding
				target.setAttribute('data-img-adding','true');
				console.log('-----------enter',target);
			}
		},false)
		//拖动图片离开编辑元素的时候，编辑元素解除标注
		document.addEventListener('dragleave',function(event){
			event.preventDefault();
			var  target = event.target;
			console.log('leave');
			if(target.contentEditable=='true'){
				//如果离开的是编辑元素
				//去除可编辑元素的样式img-adding
				target.removeAttribute('data-img-adding');
				console.log('-------leave',target);
			}
		},false)
		//拖动图片在编辑元素释放的时候，图片被添加到编辑元素的末尾
		document.addEventListener('drop',function(event){
			event.preventDefault();
			var target = event.target;
			if(target.contentEditable=='true'){
				//如果在可编辑元素中释放的是编辑元素
				//去除可编辑元素的样式img-adding
				target.removeAttribute('data-img-adding');
				console.log('-------drop',target);
				//读取文件
				var file = event.dataTransfer.files[0];
				if(util.isFileImg(file)){
					//如果文件是图片
					//添加结果处理
					imgReader.onload = function(e){
						console.log(e.target.result);
						appendImg(target,this.result);
					}
					//读取文件的url
					imgReader.readAsDataURL(file);
					console.log(imgReader.result);
				}
			}
		})
		window.addEventListener('keydown',function(event){
			var imgWrap = getImgWrap();
			if(imgWrap){
				//如果有图片被选中
				//解除被选中的图片
				unWrapImg(imgWrap);
			}
		})
	})()
	
	//在元素添加一个img
	function appendImg(pNode,src){
		//创建图片节点
		var img = document.createElement('img');
		//设置图片类型
		img.setAttribute('data-img-type','inline-img');
		//设置图片元素的属性
		img.src = src;
		//添加图片到指定位置
		pNode.appendChild(img);
	}
	//选择一个img
	function wrapImg(img){
		var wrap = document.createElement('span');
		wrap.setAttribute('class','img_wrap');
		var handle = document.createElement('span');
		handle.className = 'scale_handle';
		wrap.setAttribute('contenteditable','false');
		//获取img的父元素和下一个子元素
		var imgParent = img.parentNode;
		var imgNext = img.nextSibling;
		//将img,hanle插入到wrap中
		wrap.appendChild(img);
		wrap.appendChild(handle);
		//将wrap放回原来img的位置
		imgParent.insertBefore(wrap,imgNext);
	}
	//不选择一个img
	function unWrapImg(wrap){
		//记录wrap的位置
		var wrapParent = wrap.parentNode;
		var wrapNext = wrap.nextSibling;
		//取出img
		var img = wrap.firstElementChild;
		//在文档中移除wrap
		wrapParent.removeChild(wrap);
		//在文档中加入img
		wrapParent.insertBefore(img,wrapNext);
	}
	//获取唯一的imgWrap
	function getImgWrap(){
		return document.getElementsByClassName('img_wrap')[0];
	}
	//聚焦到一个图片
	function focusImg(wrap){
		var wrapp = wrap.parentNode;
		var selection = window.getSelection();
		var n = util.getChildRank(wrap)
		selection.collapse(wrapp,n);
	}
	return {
		appendImg:appendImg
	}
})
