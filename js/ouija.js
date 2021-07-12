function dyouija(){
function random(seed1, seed2) {
    var n = seed1 % 11117;
    for (var i = 0; i < 100 + seed2; i++) {
        n = n * n;
        n = n % 11117;
    }
    return n;
}

function pickRandom(array, size) {
    var result = [];

    for (var i = 0; i < array.length; i++) {
        result.push(array[i]);
    }

    for (var j = 0; j < array.length - size; j++) {
        var index = random(iday, j) % result.length;
        result.splice(index, 1);
    }

    return result;
}

var weeks = ["日", "一", "二", "三", "四", "五", "六"];
function getTodayString() {
    return "今天是" + today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日 星期" + weeks[today.getDay()];
}

var today = new Date();
var timeseed = today.getMilliseconds();

var results = ['超大吉', '大吉', '吉', '小吉', ' ', '小凶', '凶', '大凶', '超大凶'];
var descriptions = ['','','','','','','','',''];
var luck_rate = [10, 100, 500, 800, 300, 800, 500, 100, 10];

function pickRandomWithRate(seed1, seed2) {
    var result = random(seed1, seed2) % 3120;
    var addup = 0;
    
    for (var i = 0; i < luck_rate.length; i++) {
        addup += luck_rate[i];
        if (result <= addup) {
            return {title: results[i], desc: descriptions[i]};
        }
    }
    return {title:' ', desc: ''};
}

var selectedEvent = null;

function initEventTable() {
    $('.event_table td').click(function() {
        $('.event_table td').removeClass('selected');
        $(this).addClass('selected'); 
        selectedEvent = $(this).data('event');
        
        $('div.ouija_card.clickable').nextAll().remove();
        showCard('div.ouija_card.clickable', 300);
    });
}

function getNextCardText() {
    return pickRandomWithRate(timeseed + selectedEvent, slidecount);
}

function showCard(selector, duration, complete) {
    $(selector).animate({top:'-1px'}, duration, 'swing', complete);
}

var tail, slidecount = 0;

function initClickEvent() {
    $('div.ouija_card.clickable').click(function() {
        tail = $('div.ouija_card.clickable');
        slidecount = 0;
        slide();
    });
}

function slide() {
    if (slidecount > 35) {
        return;
    }
    
    var duration = slidecount > 33? 1500:
            (slidecount > 32? 800: 
             (slidecount > 25? 400: 
              (slidecount > 20? 200: 
                 (slidecount > 15? 150: 100))));
    
    var cardInfo = getNextCardText();
    
    card = $('<div class="ouija_card">' + 
                     '<div class="ouija_title">' + cardInfo.title + '</div>' +
                     '<div class="desc">' + cardInfo.desc + '</div>' +
                     '</div>');
    tail.after(card);
    tail = card;
    slidecount++;
    showCard(card, duration, slide);
}

$(function() {
    $('.ouija_date').html(getTodayString());
    initEventTable();
    initClickEvent();
});
}

if (typeof(btf)!="undefined"){
    /*从其他页面通过pjax到达（占卜）页面执行此句，此时btf存在*/
	btf.isJqueryLoad(dyouija);
}else {
    /*（占卜）页面F5刷新执行此句：window.onload=function(){btf...}，等待btf加载好 由于在右键便签部分也使用了相同的操作，所以会发生覆盖，因此改为追加型写法*/
    if(window.attachEvent){
        window.attachEvent("onload",function() {
            btf.isJqueryLoad(dyouija);
        });
    }else{
        window.addEventListener("load",function() {
            btf.isJqueryLoad(dyouija);
        },true);
    }
}