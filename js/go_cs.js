"use strict";function goto_comment(){var o;window.location.hash&&(o=setInterval(function(){$(window.location.hash).length&&($("html, body").animate({scrollTop:$(window.location.hash).offset().top-90},1e3),clearInterval(o))},100))}"undefined"!=typeof btf?btf.isJqueryLoad(goto_comment):window.attachEvent?window.attachEvent("onload",function(){btf.isJqueryLoad(goto_comment)}):window.addEventListener("load",function(){btf.isJqueryLoad(goto_comment)},!0);