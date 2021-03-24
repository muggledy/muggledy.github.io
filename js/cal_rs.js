/*本脚本是为git calendar编写的，页面右下角存在三个能导致calendar所在容器大小发生改变的按钮，原本的机制是当窗口大小发生改变(onresize事件)时重绘calendar，于是现在当这几个按钮被按下时手动触发onresize事件*/
function dydoresize(delay){
            setTimeout(function(){
                //手动触发窗口resize事件
                if(document.createEvent) {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("resize", true, true);
                    window.dispatchEvent(event);
                } else if(document.createEventObject) {
                    window.fireEvent("onresize");
                }
            },delay);
};

var dyhiddenbutton=document.getElementById("hide-aside-btn");
//var dyplusbutton=document.getElementById("font-plus");
//var dyminusbutton=document.getElementById("font-minus");
if (dyhiddenbutton) {
	dyhiddenbutton.onclick=function(){
		dydoresize(300); //时延是因为，这些按钮在改变容器大小时是有一个过程的
	};
}
/*
if (dyplusbutton) {
	dyplusbutton.onclick=function(){
		console.log('clickplus');
		dydoresize(300);
	};
}
if (dyminusbutton) {
	dyminusbutton.onclick=function(){
		console.log('clickminus');
		dydoresize(300);
	};
}*/