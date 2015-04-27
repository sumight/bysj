// 添加分割线
/**
* 在主文档中添加分隔线
* @function addLine
*/
function addLine(){
    
}

/**
* 为所有合理位置预留分割线的位置
* @function setPartinglinePos
*/
function setPartinglinePos(){
    // 在每个section的前面和后面加上分割线
    $("#main_block .editor_area").find("section")
        .before("<div class='hr-box'> <hr /> </div>");
    // 添加视觉效果
    $("#main_block .editor_area").find("hr").attr("color","#fff");
    $("#main_block .editor_area")
        .on("mouseenter",".hr-box",function(){
            // 如果未激活，则显示效果
            if(!$(this).hasClass("actived")){
                $(this).children().eq(0).attr("color","#000");
            }
        })
        .on("mouseleave",".hr-box",function(){
            // 如果未激活，则显示效果
            if(!$(this).hasClass("actived")){
                $(this).children().eq(0).attr("color","#fff");
            }
        })
        .on("click",".hr-box",function(){
            // 改变激活状态
            $(this).toggleClass("actived");
            // 根据激活状态设置样式
            if($(this).hasClass("actived")){
                $(this).children().eq(0).attr("color","#000");
            }else{
                $(this).children().eq(0).attr("color","#fff");
            }
            
            console.log("click");
        })
}
setPartinglinePos();



