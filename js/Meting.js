"use strict";console.log("\n".concat(" %c MetingJS v1.2.0 %c https://github.com/metowolf/MetingJS ","\n"),"color: #fadfa3; background: #030307; padding:5px 0;","background: #fadfa3; padding:5px 0;");var aplayers=[],loadMeting=function(){var r="https://api.injahow.cn/meting/?type=playlist&id=:id";"undefined"!=typeof meting_api&&(r=meting_api);for(var e=0;e<aplayers.length;e++)if(!aplayers[e].container.classList.contains("no-destroy"))try{aplayers[e].destroy()}catch(e){console.log(e)}aplayers=[];for(var s=document.querySelectorAll(".aplayer"),c=0;c<s.length;c++)(function(){var t,e,a=s[c];if(a.classList.contains("no-reload"))return;a.classList.contains("no-destroy")&&a.classList.add("no-reload"),a.dataset.id?(e=(e=(e=(e=(e=(e=a.dataset.api||r).replace(":server",a.dataset.server)).replace(":type",a.dataset.type)).replace(":id",a.dataset.id)).replace(":auth",a.dataset.auth)).replace(":r",Math.random()),(t=new XMLHttpRequest).onreadystatechange=function(){var e;4===t.readyState&&(200<=t.status&&t.status<300||304===t.status)&&(e=JSON.parse(t.responseText),i(a,e))},t.onerror=function(){i(a,[{name:"永远的长安",artist:"程池",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/src/metrics/%E7%A8%8B%E6%B1%A0%20-%20%E6%B0%B8%E8%BF%9C%E7%9A%84%E9%95%BF%E5%AE%89.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/metrics/%E7%A8%8B%E6%B1%A0%20-%20%E6%B0%B8%E8%BF%9C%E7%9A%84%E9%95%BF%E5%AE%89.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/metrics/%E7%A8%8B%E6%B1%A0%20-%20%E6%B0%B8%E8%BF%9C%E7%9A%84%E9%95%BF%E5%AE%89.lrc"},{name:"カントリー・ロード",artist:"本名陽子",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/src/fonts/lib/%E6%9C%AC%E5%90%8D%E9%99%BD%E5%AD%90%20-%20%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%83%BB%E3%83%AD%E3%83%BC%E3%83%89.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/fonts/lib/%E6%9C%AC%E5%90%8D%E9%99%BD%E5%AD%90%20-%20%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%83%BB%E3%83%AD%E3%83%BC%E3%83%89.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/fonts/lib/%E6%9C%AC%E5%90%8D%E9%99%BD%E5%AD%90%20-%20%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%83%BB%E3%83%AD%E3%83%BC%E3%83%89.lrc"},{name:"夜的钢琴曲5（翻自 石进）",artist:"九月橙",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/src/environments/%E4%B9%9D%E6%9C%88%E6%A9%99%20-%20%E5%A4%9C%E7%9A%84%E9%92%A2%E7%90%B4%E6%9B%B25%EF%BC%88%E7%BF%BB%E8%87%AA%20%E7%9F%B3%E8%BF%9B%EF%BC%89.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/environments/%E4%B9%9D%E6%9C%88%E6%A9%99%20-%20%E5%A4%9C%E7%9A%84%E9%92%A2%E7%90%B4%E6%9B%B25%EF%BC%88%E7%BF%BB%E8%87%AA%20%E7%9F%B3%E8%BF%9B%EF%BC%89.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/environments/%E4%B9%9D%E6%9C%88%E6%A9%99%20-%20%E5%A4%9C%E7%9A%84%E9%92%A2%E7%90%B4%E6%9B%B25%EF%BC%88%E7%BF%BB%E8%87%AA%20%E7%9F%B3%E8%BF%9B%EF%BC%89.lrc"},{name:"梦中的婚礼",artist:"Richard Clayderman",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/dockers/texcmp/Richard%20Clayderman%20-%20%E6%A2%A6%E4%B8%AD%E7%9A%84%E5%A9%9A%E7%A4%BC.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/texcmp/Richard%20Clayderman%20-%20%E6%A2%A6%E4%B8%AD%E7%9A%84%E5%A9%9A%E7%A4%BC.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/texcmp/Richard%20Clayderman%20-%20%E6%A2%A6%E4%B8%AD%E7%9A%84%E5%A9%9A%E7%A4%BC.lrc"},{name:"Pole",artist:"Djelem",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/contrib/mhchem/Djelem%20-%20Pole.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/mhchem/Djelem%20-%20Pole.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/mhchem/Djelem%20-%20Pole.lrc"},{name:"El Dorado (Dubstep Remix)",artist:"Two Steps From Hell / Thomas Bergersen",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/flow-typed/npm/Two%20Steps%20From%20Hell%2CThomas%20Bergersen%20-%20El%20Dorado%20(Dubstep%20Remix).mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/flow-typed/npm/Two%20Steps%20From%20Hell%2CThomas%20Bergersen%20-%20El%20Dorado%20(Dubstep%20Remix).jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/flow-typed/npm/Two%20Steps%20From%20Hell%2CThomas%20Bergersen%20-%20El%20Dorado%20(Dubstep%20Remix).lrc"},{name:"Empire of Angels",artist:"Thomas Bergersen",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/docs/Thomas%20Bergersen%20-%20Empire%20of%20Angels.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/docs/Thomas%20Bergersen%20-%20Empire%20of%20Angels.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/docs/Thomas%20Bergersen%20-%20Empire%20of%20Angels.lrc"},{name:"深山幽谷-中音笙/二胡",artist:"群星",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/website/core/%E7%BE%A4%E6%98%9F%20-%20%E6%B7%B1%E5%B1%B1%E5%B9%BD%E8%B0%B7-%E4%B8%AD%E9%9F%B3%E7%AC%99_%E4%BA%8C%E8%83%A1.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/website/core/%E7%BE%A4%E6%98%9F%20-%20%E6%B7%B1%E5%B1%B1%E5%B9%BD%E8%B0%B7-%E4%B8%AD%E9%9F%B3%E7%AC%99_%E4%BA%8C%E8%83%A1.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/website/core/%E7%BE%A4%E6%98%9F%20-%20%E6%B7%B1%E5%B1%B1%E5%B9%BD%E8%B0%B7-%E4%B8%AD%E9%9F%B3%E7%AC%99_%E4%BA%8C%E8%83%A1.lrc"},{name:"24/7",artist:"CAGNET",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/contrib/copy-tex/CAGNET%20-%2024_7.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/copy-tex/CAGNET%20-%2024_7.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/copy-tex/CAGNET%20-%2024_7.lrc"},{name:"Childhood Memories",artist:"Ennio Morricone",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/contrib/render-a11y-string/Ennio%20Morricone%20-%20Childhood%20Memories.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/render-a11y-string/Ennio%20Morricone%20-%20Childhood%20Memories.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/render-a11y-string/Ennio%20Morricone%20-%20Childhood%20Memories.lrc"},{name:"福贵与家珍",artist:"赵季平",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/test/screenshotter/%E8%B5%B5%E5%AD%A3%E5%B9%B3%20-%20%E7%A6%8F%E8%B4%B5%E4%B8%8E%E5%AE%B6%E7%8F%8D.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/test/screenshotter/%E8%B5%B5%E5%AD%A3%E5%B9%B3%20-%20%E7%A6%8F%E8%B4%B5%E4%B8%8E%E5%AE%B6%E7%8F%8D.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/test/screenshotter/%E8%B5%B5%E5%AD%A3%E5%B9%B3%20-%20%E7%A6%8F%E8%B4%B5%E4%B8%8E%E5%AE%B6%E7%8F%8D.lrc"},{name:"Here We Are Again",artist:"CAGNET / 日向大介",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/contrib/mathtex-script-type/CAGNET%2C%E6%97%A5%E5%90%91%E5%A4%A7%E4%BB%8B%20-%20Here%20We%20Are%20Again.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/mathtex-script-type/CAGNET%2C%E6%97%A5%E5%90%91%E5%A4%A7%E4%BB%8B%20-%20Here%20We%20Are%20Again.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/mathtex-script-type/CAGNET%2C%E6%97%A5%E5%90%91%E5%A4%A7%E4%BB%8B%20-%20Here%20We%20Are%20Again.lrc"},{name:"Breath and Life",artist:"Audiomachine",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/contrib/auto-render/test/Audiomachine%20-%20Breath%20and%20Life.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/auto-render/test/Audiomachine%20-%20Breath%20and%20Life.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/contrib/auto-render/test/Audiomachine%20-%20Breath%20and%20Life.lrc"},{name:"Victory",artist:"Two Steps From Hell",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/fonts/Two%20Steps%20From%20Hell%20-%20Victory.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/fonts/Two%20Steps%20From%20Hell%20-%20Victory.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/fonts/Two%20Steps%20From%20Hell%20-%20Victory.lrc"},{name:"Deborah's Theme",artist:"Ennio Morricone",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/dockers/fonts/Ennio%20Morricone%20-%20Deborah's%20Theme.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/fonts/Ennio%20Morricone%20-%20Deborah's%20Theme.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/fonts/Ennio%20Morricone%20-%20Deborah's%20Theme.lrc"},{name:"恨爱交加",artist:"麦振鸿",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/test/__snapshots__/%E9%BA%A6%E6%8C%AF%E9%B8%BF%20-%20%E6%81%A8%E7%88%B1%E4%BA%A4%E5%8A%A0.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/test/__snapshots__/%E9%BA%A6%E6%8C%AF%E9%B8%BF%20-%20%E6%81%A8%E7%88%B1%E4%BA%A4%E5%8A%A0.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/test/__snapshots__/%E9%BA%A6%E6%8C%AF%E9%B8%BF%20-%20%E6%81%A8%E7%88%B1%E4%BA%A4%E5%8A%A0.lrc"},{name:"その名は“ウルトラマンティガ” M-18,M-36,M60予告B",artist:"矢野立美",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/src/functions/utils/%E7%9F%A2%E9%87%8E%E7%AB%8B%E7%BE%8E%20-%20%E3%81%9D%E3%81%AE%E5%90%8D%E3%81%AF%E2%80%9C%E3%82%A6%E3%83%AB%E3%83%88%E3%83%A9%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%82%AC%E2%80%9D%20M-18%2CM-36%2CM60%E4%BA%88%E5%91%8AB.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/functions/utils/%E7%9F%A2%E9%87%8E%E7%AB%8B%E7%BE%8E%20-%20%E3%81%9D%E3%81%AE%E5%90%8D%E3%81%AF%E2%80%9C%E3%82%A6%E3%83%AB%E3%83%88%E3%83%A9%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%82%AC%E2%80%9D%20M-18%2CM-36%2CM60%E4%BA%88%E5%91%8AB.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/src/functions/utils/%E7%9F%A2%E9%87%8E%E7%AB%8B%E7%BE%8E%20-%20%E3%81%9D%E3%81%AE%E5%90%8D%E3%81%AF%E2%80%9C%E3%82%A6%E3%83%AB%E3%83%88%E3%83%A9%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%82%AC%E2%80%9D%20M-18%2CM-36%2CM60%E4%BA%88%E5%91%8AB.lrc"},{name:"Broken Hearts",artist:"Michael Ortega",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/dockers/screenshotter/Michael%20Ortega%20-%20Broken%20Hearts.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/screenshotter/Michael%20Ortega%20-%20Broken%20Hearts.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/dockers/screenshotter/Michael%20Ortega%20-%20Broken%20Hearts.lrc"},{name:"Field Of Poppies",artist:"群星",url:"https://github.com/celestezj/KaTeX-main-zj/raw/master/static/%E7%BE%A4%E6%98%9F%20-%20Field%20Of%20Poppies.mp3",cover:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/static/%E7%BE%A4%E6%98%9F%20-%20Field%20Of%20Poppies.jpg",lrc:"https://cdn.statically.io/gh/celestezj/KaTeX-main-zj/master/static/%E7%BE%A4%E6%98%9F%20-%20Field%20Of%20Poppies.lrc"}])},t.open("get",e,!0),t.send(null)):a.dataset.url&&(e=[{name:a.dataset.name||a.dataset.title||"Audio name",artist:a.dataset.artist||a.dataset.author||"Audio artist",url:a.dataset.url,cover:a.dataset.cover||a.dataset.pic,lrc:a.dataset.lrc,type:a.dataset.type||"auto"}],i(a,e))})();function i(e,t){var a={container:e,audio:t,mini:null,fixed:null,autoplay:!1,mutex:!0,lrcType:3,listFolded:!1,preload:"auto",theme:"#2980b9",loop:"all",order:"list",volume:.2,listMaxHeight:null,customAudioType:null,storageName:"metingjs"};if(t.length){t[0].lrc||(a.lrcType=0);var r,s={};for(r in a){var c=r.toLowerCase();(e.dataset.hasOwnProperty(c)||e.dataset.hasOwnProperty(r)||null!==a[r])&&(s[r]=e.dataset[c]||e.dataset[r]||a[r],"true"!==s[r]&&"false"!==s[r]||(s[r]="true"==s[r]))}aplayers.push(new APlayer(s))}}};function create_aplayer_meting(){var e=0;void 0!==window.createAplayerMetingTimer&&clearInterval(window.createAplayerMetingTimer),window.createAplayerMetingTimer=setInterval(function(){10<e&&clearInterval(window.createAplayerMetingTimer);try{e+=1,"undefined"!=typeof APlayer&&(loadMeting(),clearInterval(window.createAplayerMetingTimer))}catch(e){clearInterval(window.createAplayerMetingTimer)}},1e3)}create_aplayer_meting();