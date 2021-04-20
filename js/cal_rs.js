/*本脚本是为git calendar编写的，页面右下角存在三个能导致calendar所在容器大小发生改变的按钮，原本的机制是当窗口大小发生改变(onresize事件)时重绘calendar，于是现在当这几个按钮被按下时手动触发onresize事件*/
var dyhiddenbutton=document.getElementById("hide-aside-btn");

if (dyhiddenbutton) {
	dyhiddenbutton.onclick=function(){
        if (document.getElementById("new-posts-chart")||document.getElementById("new-tags-chart")||document.getElementById("new-categories-chart")){
            //dyasidebtn = true; //服务于t_chart.js
            //dydoresize(150) //时延是因为，这些按钮在改变容器大小时是有一个过程的 | 目前为了用于dyasidebtn，特地将时延置为了0 因为改为了连续触发
            var dyjishuqi = 0;
            var dydingshiqi = setInterval(function(){
                dyjishuqi+=1;
                if (dyjishuqi>=22){
                    clearInterval(dydingshiqi);
                }
                console.log("#################################");
                dyasidebtn=true;
                dydoresize(0);
            },20);
        }else{
            console.log("------------------------------");
            dydoresize(0);
        }
    };
}
