//console.log("对屏幕resize进行(仅针对宽度变化)监听以重绘（那三个）图表"); //之所以放在这里仅仅是为了避免重复给同一事件绑定相同的注册函数。本脚本只在F5刷新页面时执行一次，pjax跳转不会执行
var dywinwidth = window.innerWidth; //浏览器宽度记录（旧值）
window.addEventListener("resize", function() {
    for (var i=0;i<3;i++) {
    setInterval(function(){
        if (window.innerWidth!=dywinwidth){
            dywinwidth = window.innerWidth;
            if (document.getElementById("posts-chart") && typeof(postsChart)!="undefined") {
                console.log("POST调整");
                postsChart.resize();
            }
            if (document.getElementById("tags-chart") && typeof(tagsChart)!="undefined") {
                console.log("TAG调整");
                tagsChart.resize();
            }
            if (document.getElementById("categories-chart") && typeof(categoriesChart)!="undefined") {
                console.log("CATEGORY调整");
                categoriesChart.resize();
            }
        }
    },300); //800~1000
    }
});