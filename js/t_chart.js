//console.log("对屏幕resize进行(仅针对宽度变化)监听以重绘（那三个）图表"); //之所以放在这里仅仅是为了避免重复给同一事件绑定相同的注册函数。本脚本只在F5刷新页面时执行一次，pjax跳转不会执行
var dywinwidth = window.innerWidth; //浏览器宽度记录（旧值）
window.addEventListener("resize", function() {
    var posts_chart = document.getElementById("posts-chart");
    var tags_chart = document.getElementById("tags-chart");
    var categories_chart = document.getElementById("categories-chart");
    if (window.innerWidth!=dywinwidth){
        if (posts_chart){
            posts_chart.style.visibility="hidden";
        }
        if (tags_chart){
            tags_chart.style.visibility="hidden";
        }
        if (categories_chart){
            categories_chart.style.visibility="hidden";
        }
    }
    setTimeout(function(){
        if (window.innerWidth!=dywinwidth){
            dywinwidth = window.innerWidth;
            if (posts_chart && typeof(postsChart)!="undefined") {
                posts_chart.style.visibility="visible";
                postsChart.resize();
            }
            if (tags_chart && typeof(tagsChart)!="undefined") {
                tags_chart.style.visibility="visible";
                tagsChart.resize();
            }
            if (categories_chart && typeof(categoriesChart)!="undefined") {
                categories_chart.style.visibility="visible";
                categoriesChart.resize();
            }
        }
    },250);
});