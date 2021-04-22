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

//全局变量（另见cal_rs.js）
var dywinwidth = window.innerWidth; //浏览器宽度记录（旧值）
var dyasidebtn = false; //是否因为按下aside隐藏/显示按钮触发的resize
var dyxuanzhuan = false;
window.addEventListener("resize", function() {
    var new_posts_chart = document.getElementById("new-posts-chart");
    var new_tags_chart = document.getElementById("new-tags-chart");
    var new_categories_chart = document.getElementById("new-categories-chart");
    if (new_posts_chart || new_tags_chart || new_categories_chart) {
        if (window.innerWidth!=dywinwidth || dyasidebtn || dyxuanzhuan){
            var dyallnum = 25;
            var dytjiange = 20;
            if (dyxuanzhuan) {dyallnum = 15;dytjiange = 100;}
            dywinwidth = window.innerWidth;
            dyasidebtn = false;
            dyxuanzhuan = false;
            /*现在改变策略，当旋转屏幕或者按下aside按钮，就连续多次不断触发resize事件，使得图表的resize显得更加平滑美观
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
            var dychartjishuqi = 0;
            var dychartdingshiqi = setInterval(function(){
                dychartjishuqi+=1;
                if (dychartjishuqi>=dyallnum){ //连续执行的总次数
                    clearInterval(dychartdingshiqi);
                }
                
                if (new_posts_chart && typeof(newPostsChart)!="undefined") {
                    //console.log("newPostsChart Resize");
                    newPostsChart.resize();
                    //new_posts_chart.style.visibility="visible";
                }
                if (new_tags_chart && typeof(newTagsChart)!="undefined") {
                    //console.log("newTagsChart Resize");
                    newTagsChart.resize();
                    //new_tags_chart.style.visibility="visible";
                }
                if (new_categories_chart && typeof(newCategoriesChart)!="undefined") {
                    //console.log("newCategoriesChart Resize");
                    newCategoriesChart.resize();
                    //new_categories_chart.style.visibility="visible";
                }
            },dytjiange);
        }
    } else { //即使不存在图表，也应实时更新当前浏览器宽度
        //if (window.innerWidth!=dywinwidth){
            dywinwidth = window.innerWidth;
        //}
        dyasidebtn = false;
        dyxuanzhuan = false;
    }
});

window.addEventListener('orientationchange', function(event){
    //if( window.orientation == 90 || window.orientation == -90 ) {
    //手机端横屏翻转处理事件
    //}else{
	//手机端竖屏处理事件
    //}
    if (document.getElementById("new-posts-chart")||document.getElementById("new-tags-chart")||document.getElementById("new-categories-chart")){
        dyxuanzhuan = true;
        dydoresize(0);
    }
});