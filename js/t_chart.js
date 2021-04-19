//console.log("对屏幕resize进行(仅针对宽度变化)监听以重绘（那三个）图表"); //之所以放在这里仅仅是为了避免重复给同一事件绑定相同的注册函数。本脚本只在F5刷新页面时执行一次，pjax跳转不会执行
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

var dywinwidth = window.innerWidth; //浏览器宽度记录（旧值）
var dyasidebtn = false; //是否因为按下aside隐藏/显示按钮触发的resize
window.addEventListener("resize", function() {
    console.log("监听resize");
    var new_posts_chart = document.getElementById("new-posts-chart");
    var new_tags_chart = document.getElementById("new-tags-chart");
    var new_categories_chart = document.getElementById("new-categories-chart");
    if (new_posts_chart || new_tags_chart || new_categories_chart) {
        console.log(dyasidebtn);
        if (window.innerWidth!=dywinwidth || dyasidebtn){
            var timedelay = 0;
            if (dyasidebtn) {timedelay = 0;}
            dywinwidth = window.innerWidth;
            dyasidebtn = false;
            /*
            if (new_posts_chart){
                new_posts_chart.style.visibility="hidden";
            }
            if (new_tags_chart){
                new_tags_chart.style.visibility="hidden";
            }
            if (new_categories_chart){
                new_categories_chart.style.visibility="hidden";
            }
            */
            setTimeout(function(){
                if (new_posts_chart && typeof(newPostsChart)!="undefined") {
                    console.log("newPostsChart Resize");
                    newPostsChart.resize();
                    //new_posts_chart.style.visibility="visible";
                }
                if (new_tags_chart && typeof(newTagsChart)!="undefined") {
                    console.log("newTagsChart Resize");
                    newTagsChart.resize();
                    //new_tags_chart.style.visibility="visible";
                }
                if (new_categories_chart && typeof(newCategoriesChart)!="undefined") {
                    console.log("newCategoriesChart Resize");
                    newCategoriesChart.resize();
                    //new_categories_chart.style.visibility="visible";
                }
            },timedelay);
        }
    }
});

window.addEventListener('orientationchange', function(event){
    //if( window.orientation == 90 || window.orientation == -90 ) {
    //横屏翻转处理事件
    //}else{
	//竖屏处理事件
    //}
    var dyjishuqi = 0;
    var dydingshiqi = setInterval(function(){
            dyjishuqi+=1;
            if (dyjishuqi>20){
                clearInterval(dydingshiqi);
            }
            console.log("resize...");
            dyasidebtn=true;
            dydoresize(0);
    },25);
});