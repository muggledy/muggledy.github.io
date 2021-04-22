/*本脚本是为git calendar编写的，页面右下角存在三个能导致calendar所在容器大小发生改变的按钮，原本的机制是当窗口大小发生改变(onresize事件)时重绘calendar，于是现在当这几个按钮被按下时手动触发onresize事件*/
var dyhiddenbutton=document.getElementById("hide-aside-btn");

if (dyhiddenbutton) {
	dyhiddenbutton.onclick=function(){
        dyasidebtn = true;
        dydoresize(0);
    };
}
