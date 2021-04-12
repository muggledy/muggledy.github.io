/* 参考 https://www.ijkxs.com/27.html
 * 1. 从https://www.revolvermaps.com/拷贝想要的js代码并转义（将其中的"和/替换为\"和\/）
 * 2. 替换下面的变量s
 */

function visitors_map_wrapper(){
  var s = '<script type=\"text\/javascript\" src="\/\/rf.revolvermaps.com\/0\/0\/3.js?i=5omsyd7751e&amp;b=0&amp;s=40&amp;m=2&amp;cl=ffffff&amp;co=010020&amp;cd=aa0000&amp;v0=60&amp;v1=60&amp;r=1\" async=\"async\"><\/script>';
  
  $(document).ready(function(){
    if ($("#dy_visitors_map")){
      $("#dy_visitors_map").html(s);
    }
  });
  
  window.addEventListener('pjax:complete', function() {
    if ($("#dy_visitors_map")){
      $("#dy_visitors_map").html(s);
    }
  });
}

if (typeof(btf)!="undefined"){
	btf.isJqueryLoad(visitors_map_wrapper);
} else {
	if(window.attachEvent){
		window.attachEvent("onload",function() {
			btf.isJqueryLoad(visitors_map_wrapper);
		});
	}else{
		window.addEventListener("load",function() {
			btf.isJqueryLoad(visitors_map_wrapper);
		},true);
	}
}