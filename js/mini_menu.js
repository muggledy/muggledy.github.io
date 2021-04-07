//将页面的url作为键，以在本地存放当前页面的便签数据
var wll_mask_currpage_name = window.location.href;
console.log('wll_mask_currpage_name(当前页面路径/便签保存的键名): '+wll_mask_currpage_name);

// 该脚本启用了daya-pjax，每次通过pjax打开新页面仍会执行本脚本，如果上页的计时器存在则清除并初始化为null
if (typeof(autosave_timer)=="undefined") {
	var autosave_timer = null;
} else if (autosave_timer==null) {
	
} else {
	clearInterval(autosave_timer);
	autosave_timer = null;
}

var wll_menu = null;

function mini_note_wrapper(){
$(function(){
// 页面加载时运行  保存到本地

var wll_mask = localStorage.getItem(wll_mask_currpage_name);
if(wll_mask){
	$(".dyminibox").html(wll_mask);
	if (autosave_timer==null) { //执行auto_timer前需要加以判断以确保一个页面有且只有一个计时器
		auto_timer();
	}
} else {
	$(".dyminibox").html("");
}


//屏蔽浏览器的右键属性
document.oncontextmenu = function(){return false;}

//点击鼠标右键  显示右键菜单
$(document).mousedown(function(e){
//获取鼠标点击时的坐标（右键是3  左键是1  鼠标滚轮是2）
var key = e.which;
//判断
if(key == 3){
	var x = e.clientX;
	var y = e.clientY;
	//console.log("显示坐标:&nbsp;X = "+ x +",Y = "+y);
	$(".dyminimenu").show().css({left:x,top:y});
}

});
//点击完成后  隐藏右键  
$(document).click(function(){
	$(".dyminimenu").hide();
});

});


//右键菜单中的属性  功能实现
wll_menu = function (flag){
	//按照菜单的顺序实现
	//1 添加mini标签
	if(flag == 1){
		var w = Math.floor(Math.random()*30);
		var wll = new Array("pulse","bounce","tada","swing","wobble",
							"flip","flipInX","bounceIn","bounceInUp","bounceInDown",
							"fadeIn","fadeInUp","fadeInDown","fadeInLeft","fadeInRight",
							"fadeInUpBig","fadeInDownBig","fadeInLeftBig","fadeInRightBig","rotateIn",
							"rotateInUpLeft","rotateInDownLeft","rotateInUpRight","rotateInDownRight","swing",
							"rollIn","bounce","tada","swing","wobble");
		//获取当前鼠标右键的坐标位置
		var left = $(".dyminimenu").offset().left;
		var top = $(".dyminimenu").offset().top;
		//console.log(left+', '+top);
		//随机数 1--3
		var random = Math.floor(Math.random()*3)+1;
		//显示mini标签
		$(".dyminibox").append("<div class='b_list animated "+wll[w]+"' style='left:"+left+"px;top:"+top+"px;'><img src='/img/"+random+".png' alt='便签' width='294' height='310'>"+"<div class='b_content' contenteditable='true'></div>"+"<p class='mini_note_timer'><span>3</span>秒后自动保存</p>"+"</div>");
		//自动保存
		if (autosave_timer==null){
			auto_timer();
		}
	}
	//2 清空页面
	if(flag == 2){
		$(".b_list").removeClass("animated rollIn").addClass("animated bounceOutRight").fadeOut(1000);
		localStorage.removeItem(wll_mask_currpage_name);
		$(".dyminibox").html(""); //可以注释该行，意味着即使你右键清除页面，但是历史便签上的数据仍会被保存(F12即可查看)，只不过隐藏不显示而已，这可以防止你误删某些重要的便签信息
		if (autosave_timer!=null) {
			clearInterval(autosave_timer);
			autosave_timer = null;
		}
	}
}


//3秒之后保存到本地
function auto_timer(){
	var count = 3;
	autosave_timer = setInterval(function(){
		if(count <= 0){
			//保存到本地
			count = 3;
			localStorage.setItem(wll_mask_currpage_name,$(".dyminibox").html());
		}
		$(".mini_note_timer").find("span").text(count);
		count--;
		//console.log("便签自动保存计时器");
	},1000);
}
}


if(window.attachEvent){
	window.attachEvent("onload",function() {
		btf.isJqueryLoad(mini_note_wrapper);
	});
}else{
	window.addEventListener("load",function() {
		btf.isJqueryLoad(mini_note_wrapper);
	},true);
}

if (typeof(btf)!="undefined"){
	btf.isJqueryLoad(mini_note_wrapper);
}