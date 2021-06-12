document.addEventListener('DOMContentLoaded', function () {
  const $blogName = document.getElementById('site-name')
  let blogNameWidth = $blogName && $blogName.offsetWidth
  const $menusEle = document.querySelector('#menus .menus_items')
  let menusWidth = $menusEle && $menusEle.offsetWidth
  const $searchEle = document.querySelector('#search-button')
  let searchWidth = $searchEle && $searchEle.offsetWidth
  
  var article_double_css = "https://cdn.jsdelivr.net/gh/celestezj/ImageHosting@v2.5/data/butterfly/cardlistpost.min.css";
  if (typeof(saveToLocal.get('local_article_double_status'))!="undefined"){ //此处的逻辑只会在F5刷新网站时执行一次，之后在网站中由于采用了pjax，这里不会再重复执行（当然了，即使未启用pjax，此处不断重复执行也不会出错）。目的是读取本地保存的（是否启用双栏文章）状态并应用，未定义则不管
	  var if_exists_article_css = false; //含义：当前是否应用双栏样式，在此代码块中，执行到哪句都要时刻更新。此处是赋初值
	  document.querySelectorAll('link[rel=stylesheet]').forEach(function (dom){
		  if (dom.href==article_double_css){
			    if_exists_article_css = true;
			    if (saveToLocal.get('local_article_double_status')==false){
					dom.remove();
					if_exists_article_css = false;
				}
		  }
	  })
	  if (!if_exists_article_css && saveToLocal.get('local_article_double_status')==true){
		  new_article_css_element=document.createElement("link");
		  new_article_css_element.setAttribute("rel","stylesheet");
		  new_article_css_element.setAttribute("type","text/css");
		  new_article_css_element.setAttribute("href",article_double_css);
		  document.body.appendChild(new_article_css_element);
	  }
  }

  const adjustMenu = (change = false) => {
    if (change) {
      blogNameWidth = $blogName && $blogName.offsetWidth
      menusWidth = $menusEle && $menusEle.offsetWidth
      searchWidth = $searchEle && $searchEle.offsetWidth
    }
    const $nav = document.getElementById('nav')
    let t
    if (window.innerWidth < 768) t = true
    else t = blogNameWidth + menusWidth + searchWidth > $nav.offsetWidth - 120

    if (t) {
      $nav.classList.add('hide-menu')
    } else {
      $nav.classList.remove('hide-menu')
    }
  }

  // 初始化header
  const initAdjust = () => {
    if (document.getElementById('nav')!=null) {
    adjustMenu()
    document.getElementById('nav').classList.add('show')
    }
  }

  // sidebar menus
  const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu')
    if ($toggleMenu!=null) {
    const $mobileSidebarMenus = document.getElementById('sidebar-menus')
    const $menuMask = document.getElementById('menu-mask')
    const $body = document.body

    function openMobileSidebar () {
      btf.sidebarPaddingR()
      $body.style.overflow = 'hidden'
      btf.fadeIn($menuMask, 0.5)
      $mobileSidebarMenus.classList.add('open')
    }

    function closeMobileSidebar () {
      $body.style.overflow = ''
      $body.style.paddingRight = ''
      btf.fadeOut($menuMask, 0.5)
      $mobileSidebarMenus.classList.remove('open')
    }

    $toggleMenu.addEventListener('click', openMobileSidebar)

    $menuMask.addEventListener('click', e => {
      if ($mobileSidebarMenus.classList.contains('open')) {
        closeMobileSidebar()
      }
    })

    window.addEventListener('resize', e => {
      if (btf.isHidden($toggleMenu)) {
        if ($mobileSidebarMenus.classList.contains('open')) closeMobileSidebar()
      }
    })
    }
  }

  /**
 * 首頁top_img底下的箭頭
 */
  const scrollDownInIndex = () => {
    const $scrollDownEle = document.getElementById('scroll-down')
    $scrollDownEle && $scrollDownEle.addEventListener('click', function () {
      btf.scrollToDest(document.getElementById('content-inner').offsetTop, 300)
    })
  }

  /**
 * 代碼
 * 只適用於Hexo默認的代碼渲染
 */
  window.ifExe_addHighlightTool=true; //锁
  const addHighlightTool = function () {
    const highLight = GLOBAL_CONFIG.highlight
    if (!highLight) return

    const isHighlightCopy = highLight.highlightCopy
    const isHighlightLang = highLight.highlightLang
    const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink
    const highlightHeightLimit = highLight.highlightHeightLimit
    const isShowTool = isHighlightCopy || isHighlightLang || isHighlightShrink !== undefined
    const $figureHighlight = highLight.plugin === 'highlighjs' ? document.querySelectorAll('figure.highlight') : document.querySelectorAll('pre[class*="language-"]')

    if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length)) return
    
    if (window.ifExe_addHighlightTool) {
        window.ifExe_addHighlightTool=false;
    } else { //如果本函数体已执行过一次，ifExe_addHighlightTool将置为false，下次再执行到此处发现为false，则立即return，不再执行下面的内容
        return
    }

    const isPrismjs = highLight.plugin === 'prismjs'

    let highlightShrinkEle = ''
    let highlightCopyEle = ''
    const highlightShrinkClass = isHighlightShrink === true ? 'closed' : ''

    if (isHighlightShrink !== undefined) {
      highlightShrinkEle = `<i class="fas fa-angle-down expand ${highlightShrinkClass}"></i>`
    }

    if (isHighlightCopy) {
      highlightCopyEle = '<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>'
      if (`${highlightShrinkClass}`=="closed") {
          highlightCopyEle = '<div class="copy-notice"></div><i class="fas fa-paste copy-button closed"></i>'
      }
    }

    const copy = (text, ctx) => {
      if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        document.execCommand('copy')
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          btf.snackbarShow(GLOBAL_CONFIG.copy.success)
        } else {
          const prevEle = ctx.previousElementSibling
          prevEle.innerText = GLOBAL_CONFIG.copy.success
          prevEle.style.opacity = 1
          setTimeout(() => { prevEle.style.opacity = 0 }, 700)
        }
      } else {
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport)
        } else {
          ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport
        }
      }
    }

    // click events
    const highlightCopyFn = (ele) => {
      const $buttonParent = ele.parentNode
      $buttonParent.classList.add('copy-true')
      const selection = window.getSelection()
      const range = document.createRange()
      if (isPrismjs) range.selectNodeContents($buttonParent.querySelectorAll('pre code')[0])
      else range.selectNodeContents($buttonParent.querySelectorAll('table .code pre')[0])
      selection.removeAllRanges()
      selection.addRange(range)
      const text = selection.toString()
      copy(text, ele.lastChild)
      selection.removeAllRanges()
      $buttonParent.classList.remove('copy-true')
    }

    const highlightShrinkFn = (ele) => {
      const $nextEle = [...ele.parentNode.children].slice(1)
      ele.firstChild.classList.toggle('closed')
      ele.lastChild.classList.toggle('closed')
      if (btf.isHidden($nextEle[$nextEle.length - 1])) {
        $nextEle.forEach(e => { e.style.display = 'block' })
      } else {
        $nextEle.forEach(e => { e.style.display = 'none' })
      }
    }

    const highlightToolsFn = function (e) {
      const $target = e.target.classList
      if ($target.contains('expand')) highlightShrinkFn(this)
      else if ($target.contains('copy-button')) highlightCopyFn(this)
    }

    const expandCode = function () {
      this.classList.toggle('expand-done')
    }

    function createEle (lang, item, service) {
      const fragment = document.createDocumentFragment()

      if (isShowTool) {
        const hlTools = document.createElement('div')
        hlTools.className = `highlight-tools ${highlightShrinkClass}`
        hlTools.innerHTML = highlightShrinkEle + lang + highlightCopyEle
        hlTools.addEventListener('click', highlightToolsFn)
        fragment.appendChild(hlTools)
      }

      if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
        const ele = document.createElement('div')
        ele.className = 'code-expand-btn'
        ele.innerHTML = '<i class="fas fa-angle-double-down"></i>'
        ele.addEventListener('click', expandCode)
        fragment.appendChild(ele)
      }

      if (service === 'hl') {
        item.insertBefore(fragment, item.firstChild)
      } else {
        item.parentNode.insertBefore(fragment, item)
      }
    }

    if (isHighlightLang) {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          const langName = item.getAttribute('data-language') ? item.getAttribute('data-language') : 'Code'
          const highlightLangEle = `<div class="code-lang">${langName}</div>`
          btf.wrap(item, 'figure', '', 'highlight')
          createEle(highlightLangEle, item)
        })
      } else {
        $figureHighlight.forEach(function (item) {
          let langName = item.getAttribute('class').split(' ')[1]
          if (langName === 'plain' || langName === undefined) langName = 'Code'
          const highlightLangEle = `<div class="code-lang">${langName}</div>`
          createEle(highlightLangEle, item, 'hl')
        })
      }
    } else {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          btf.wrap(item, 'figure', '', 'highlight')
          createEle('', item)
        })
      } else {
        $figureHighlight.forEach(function (item) {
          createEle('', item, 'hl')
        })
      }
    }
  }

  /**
 * PhotoFigcaption
 * butterfly主题的inlineimage本身就存在问题，图片是可以出现在行内，但是只能出现在行尾，图片后的文本还是会换行，这是因为img图像在被解析（即此处js代码）的时候总是加上<div class="img-alt is-center">alt文本</div>，而div又非行内元素，是块级元素，所以会换行，此处我加上一个if (ele.textContent!="")的判断，当alt无值的时候，显然不应再添加<div class="img-alt is-center">块，另外，当图像作为行内元素时也不需要alt（当然也不能有），因此此处的修改是合理的
 */
  window.ifExe_addPhotoFigcaption=true; //锁
  function addPhotoFigcaption () {
    var dy_article_container_imgs = document.querySelectorAll('#article-container img');
    if (dy_article_container_imgs.length>0 && window.ifExe_addPhotoFigcaption) {
    window.ifExe_addPhotoFigcaption=false;
    dy_article_container_imgs.forEach(function (item) {
      const parentEle = item.parentNode
      if (!parentEle.parentNode.classList.contains('justified-gallery')) {
        const ele = document.createElement('div')
        ele.className = 'img-alt is-center'
        ele.textContent = item.getAttribute('alt')
		if (ele.textContent!="") {
			parentEle.insertBefore(ele, item.nextSibling)
		}
      }
    })
    }
  }

  /**
 * justified-gallery 圖庫排版
 * 需要 jQuery
 */

  let detectJgJsLoad = false
  const runJustifiedGallery = function (ele) {
    const $justifiedGallery = $(ele)
    const $imgList = $justifiedGallery.find('img')
    $imgList.unwrap()
    if ($imgList.length) {
      $imgList.each(function (i, o) {
        if ($(o).attr('data-lazy-src')) $(o).attr('src', $(o).attr('data-lazy-src'))
        $(o).wrap('<div></div>')
      })
    }

    if (detectJgJsLoad) btf.initJustifiedGallery($justifiedGallery)
    else {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${GLOBAL_CONFIG.source.justifiedGallery.css}">`)
      $.getScript(`${GLOBAL_CONFIG.source.justifiedGallery.js}`, function () {
        btf.initJustifiedGallery($justifiedGallery)
      })
      detectJgJsLoad = true
    }
  }

  /**
 * fancybox和 mediumZoom
 */
  const addFancybox = function (ele) {
    const runFancybox = (ele) => {
      ele.each(function (i, o) {
        const $this = $(o)
        const lazyloadSrc = $this.attr('data-lazy-src') || $this.attr('src')
        const dataCaption = $this.attr('alt') || ''
        $this.wrap(`<a href="${lazyloadSrc}" data-fancybox="group" data-caption="${dataCaption}" class="fancybox"></a>`)
      })

      $().fancybox({
        selector: '[data-fancybox]',
        loop: true,
        transitionEffect: 'slide',
        protect: true,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],
        hash: false
      })
    }

    if (typeof $.fancybox === 'undefined') {
      $('head').append(`<link rel="stylesheet" type="text/css" href="${GLOBAL_CONFIG.source.fancybox.css}">`)
      $.getScript(`${GLOBAL_CONFIG.source.fancybox.js}`, function () {
        runFancybox($(ele))
      })
    } else {
      runFancybox($(ele))
    }
  }

  const addMediumZoom = () => {
    const zoom = mediumZoom(document.querySelectorAll('#article-container :not(a)>img'))
    zoom.on('open', e => {
      const photoBg = document.documentElement.getAttribute('data-theme') === 'dark' ? '#121212' : '#fff'
      zoom.update({
        background: photoBg
      })
    })
  }

  window.ifExe_jqLoadAndRun_jg=true; //锁1
  window.ifExe_jqLoadAndRun_fb=true; //锁2
  const jqLoadAndRun = () => {
    const $fancyboxEle = GLOBAL_CONFIG.lightbox === 'fancybox'
      ? document.querySelectorAll('#article-container :not(a):not(.gallery-group) > img, #article-container > img')
      : []
    const fbLengthNoZero = $fancyboxEle.length > 0
    const $jgEle = document.querySelectorAll('#article-container .justified-gallery')
    const jgLengthNoZero = $jgEle.length > 0

    if ((jgLengthNoZero && window.ifExe_jqLoadAndRun_jg) && (fbLengthNoZero && window.ifExe_jqLoadAndRun_fb)) {
      window.ifExe_jqLoadAndRun_jg=false;
      window.ifExe_jqLoadAndRun_fb=false;
      btf.isJqueryLoad(() => {
        runJustifiedGallery($jgEle)
        addFancybox($fancyboxEle)
      })
    } else if ((jgLengthNoZero && window.ifExe_jqLoadAndRun_jg) && !(fbLengthNoZero && window.ifExe_jqLoadAndRun_fb)){
      window.ifExe_jqLoadAndRun_jg=false;
      btf.isJqueryLoad(() => {
        runJustifiedGallery($jgEle)
      })
    } else if (!(jgLengthNoZero && window.ifExe_jqLoadAndRun_jg) && (fbLengthNoZero && window.ifExe_jqLoadAndRun_fb)) {
      window.ifExe_jqLoadAndRun_fb=false;
      btf.isJqueryLoad(() => {
        addFancybox($fancyboxEle)
      })
    }
  }

  /**
 * 滾動處理
 */
  const scrollFn = function () {
    const $rightside = document.getElementById('rightside')
    if ($rightside!=null) {
    const innerHeight = window.innerHeight + 56

    // 當滾動條小于 56 的時候
    if (document.body.scrollHeight <= innerHeight) {
      $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
      return
    }

    let initTop = 0
    let isChatShow = true
    const $header = document.getElementById('page-header')
    const isChatBtnHide = typeof chatBtnHide === 'function'
    const isChatBtnShow = typeof chatBtnShow === 'function'
    window.addEventListener('scroll', btf.throttle(function (e) {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      const isDown = scrollDirection(currentTop)
      if (currentTop > 56) {
        if (isDown) {
          if ($header.classList.contains('nav-visible')) $header.classList.remove('nav-visible')
          if (isChatBtnShow && isChatShow === true) {
            chatBtnHide()
            isChatShow = false
          }
        } else {
          if (!$header.classList.contains('nav-visible')) $header.classList.add('nav-visible')
          if (isChatBtnHide && isChatShow === false) {
            chatBtnShow()
            isChatShow = true
          }
        }
        $header.classList.add('nav-fixed')
        if (window.getComputedStyle($rightside).getPropertyValue('opacity') === '0') {
          $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
        }
      } else {
        if (currentTop === 0) {
          $header.classList.remove('nav-fixed', 'nav-visible')
        }
        $rightside.style.cssText = "opacity: ''; transform: ''"
      }

      if (document.body.scrollHeight <= innerHeight) {
        $rightside.style.cssText = 'opacity: 1; transform: translateX(-38px)'
      }
    }, 200))

    // find the scroll direction
    function scrollDirection (currentTop) {
      const result = currentTop > initTop // true is down & false is up
      initTop = currentTop
      return result
    }
    }
  }

  /**
 *  toc
 */
  const tocFn = function () {
    const $cardTocLayout = document.getElementById('card-toc')
    const $cardToc = $cardTocLayout.getElementsByClassName('toc-content')[0]
    const $tocLink = $cardToc.querySelectorAll('.toc-link')
    const $article = document.getElementById('article-container')

    // main of scroll
    window.addEventListener('scroll', btf.throttle(function (e) {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      scrollPercent(currentTop)
      findHeadPosition(currentTop)
    }, 100))

    const scrollPercent = function (currentTop) {
      const docHeight = $article.clientHeight
      const winHeight = document.documentElement.clientHeight
      const headerHeight = $article.offsetTop
      const contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : (document.documentElement.scrollHeight - winHeight)
      const scrollPercent = (currentTop - headerHeight) / (contentMath)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      const percentage = (scrollPercentRounded > 100) ? 100 : (scrollPercentRounded <= 0) ? 0 : scrollPercentRounded
      $cardToc.setAttribute('progress-percentage', percentage)
    }

    // anchor
    const isAnchor = GLOBAL_CONFIG.isanchor
    const updateAnchor = function (anchor) {
      if (window.history.replaceState && anchor !== window.location.hash) {
        if (!anchor) anchor = location.pathname
        window.history.replaceState({}, '', anchor)
      }
    }

    const mobileToc = {
      open: () => {
        $cardTocLayout.style.cssText = 'animation: toc-open .3s; opacity: 1; right: 45px'
      },

      close: () => {
        $cardTocLayout.style.animation = 'toc-close .2s'
        setTimeout(() => {
          $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''"
        }, 100)
      }
    }

    document.getElementById('mobile-toc-button').addEventListener('click', () => {
      if (window.getComputedStyle($cardTocLayout).getPropertyValue('opacity') === '0') mobileToc.open()
      else mobileToc.close()
    })

    // toc元素點擊
    $cardToc.addEventListener('click', (e) => {
      e.preventDefault()
      const $target = e.target.classList.contains('toc-link')
        ? e.target
        : e.target.parentElement
      btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI($target.getAttribute('href')).replace('#', ''))), 300)
      if (window.innerWidth < 900) {
        mobileToc.close()
      }
    })

    const autoScrollToc = function (item) {
      const activePosition = item.getBoundingClientRect().top
      const sidebarScrollTop = $cardToc.scrollTop
      if (activePosition > (document.documentElement.clientHeight - 100)) {
        $cardToc.scrollTop = sidebarScrollTop + 150
      }
      if (activePosition < 100) {
        $cardToc.scrollTop = sidebarScrollTop - 150
      }
    }

    // find head position & add active class
    const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let detectItem = ''
    const findHeadPosition = function (top) {
      if ($tocLink.length === 0 || top === 0) {
        return false
      }

      let currentId = ''
      let currentIndex = ''

      list.forEach(function (ele, index) {
        if (top > btf.getEleTop(ele) - 80) {
          currentId = '#' + encodeURI(ele.getAttribute('id'))
          currentIndex = index
        }
      })

      if (detectItem === currentIndex) return

      if (isAnchor) updateAnchor(currentId)

      if (currentId === '') {
        $cardToc.querySelectorAll('.active').forEach(i => { i.classList.remove('active') })
        detectItem = currentIndex
        return
      }

      detectItem = currentIndex

      $cardToc.querySelectorAll('.active').forEach(item => { item.classList.remove('active') })
      const currentActive = $tocLink[currentIndex]
      currentActive.classList.add('active')

      setTimeout(() => {
        autoScrollToc(currentActive)
      }, 0)

      let parent = currentActive.parentNode

      for (; !parent.matches('.toc'); parent = parent.parentNode) {
        if (parent.matches('li')) parent.classList.add('active')
      }
    }
  }

  /**
 * Rightside
 */
  const rightSideFn = {
    switchReadMode: () => { // read-mode
      const $body = document.body
      $body.classList.add('read-mode')
      const newEle = document.createElement('button')
      newEle.type = 'button'
      newEle.className = 'fas fa-sign-out-alt exit-readmode'
      $body.appendChild(newEle)

      function clickFn () {
        $body.classList.remove('read-mode')
        newEle.remove()
        newEle.removeEventListener('click', clickFn)
      }

      newEle.addEventListener('click', clickFn)
    },
    switchDarkMode: () => { // Switch Between Light And Dark Mode
      const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      if (nowMode === 'light') {
        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
      } else {
        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
      }
      // handle some cases
      typeof utterancesTheme === 'function' && utterancesTheme()
      typeof FB === 'object' && window.loadFBComment()
      window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
    },
    showOrHideBtn: () => { // rightside 點擊設置 按鈕 展開
      document.getElementById('rightside-config-hide').classList.toggle('show')
    },
    scrollToTop: () => { // Back to top
      btf.scrollToDest(0, 500)
    },
    hideAsideBtn: () => { // Hide aside
      const $htmlDom = document.documentElement.classList
      $htmlDom.contains('hide-aside')
        ? saveToLocal.set('aside-status', 'show', 2)
        : saveToLocal.set('aside-status', 'hide', 2)
      $htmlDom.toggle('hide-aside')
    },
    toggleArticleDouble: () => { //由于文章双栏插件的实现是纯css的，因此关闭该功能只需要删除此css文件即可消除样式，再启用，就再引入即可，切换的方法确实很low，但是有效~
        var dyallcsslinks = document.querySelectorAll('link[rel=stylesheet]');
		var exists_article_double_css = false; //含义：toggle之前（即点击切换按钮之前）是否应用了双栏样式。此处仅是赋初值
		
        dyallcsslinks.forEach(function (dom) {
            if (dom.href==article_double_css){
				exists_article_double_css = true;
				dom.remove();
				saveToLocal.set('local_article_double_status', false, 2); //将（toggle之后的）当前状态保存到本地，刷新网站时读取该值，将会继承该状态
			}
        });
        if (!exists_article_double_css){ //之前没有应用双栏样式，现在启用
			var dy_new_element=document.createElement("link");
			dy_new_element.setAttribute("rel","stylesheet");
			dy_new_element.setAttribute("type","text/css");
			dy_new_element.setAttribute("href",article_double_css);
			document.body.appendChild(dy_new_element);
			saveToLocal.set('local_article_double_status', true, 2);
		}
    },

    adjustFontSize: (plus) => {
      const fontSizeVal = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--global-font-size'))
      let newValue = ''
      if (plus) {
        if (fontSizeVal >= 18) return
        newValue = fontSizeVal + 1
        document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
        !document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
      } else {
        if (fontSizeVal <= 14) return
        newValue = fontSizeVal - 1
        document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
        document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
      }

      saveToLocal.set('global-font-size', newValue, 2)
      // document.getElementById('font-text').innerText = newValue
    }
  }

  if (document.getElementById('rightside')!=null) {
  document.getElementById('rightside').addEventListener('click', function (e) {
    const $target = e.target.id || e.target.parentNode.id
    switch ($target) {
      case 'go-up':
        rightSideFn.scrollToTop()
        break
      case 'rightside_config':
        rightSideFn.showOrHideBtn()
        break
      case 'readmode':
        rightSideFn.switchReadMode()
        break
      case 'darkmode':
        rightSideFn.switchDarkMode()
        break
      case 'hide-aside-btn':
        rightSideFn.hideAsideBtn()
        break
      case 'list-article-double-btn':
        rightSideFn.toggleArticleDouble()
        break
      case 'font-plus':
        rightSideFn.adjustFontSize(true)
        break
      case 'font-minus':
        rightSideFn.adjustFontSize()
        break
      default:
        break
    }
  })
  }

  /**
 * menu
 * 側邊欄sub-menu 展開/收縮
 * 解決menus在觸摸屏下，滑動屏幕menus_item_child不消失的問題（手機hover的bug)
 */
  const clickFnOfSubMenu = function () {
    document.querySelectorAll('#sidebar-menus .expand').forEach(function (e) {
      e.addEventListener('click', function () {
        this.classList.toggle('hide')
        const $dom = this.parentNode.nextElementSibling
        if (btf.isHidden($dom)) {
          $dom.style.display = 'block'
        } else {
          $dom.style.display = 'none'
        }
      })
    })

    window.addEventListener('touchmove', function (e) {
      const $menusChild = document.querySelectorAll('#nav .menus_item_child')
      $menusChild.forEach(item => {
        if (!btf.isHidden(item)) item.style.display = 'none'
      })
    })
  }

  /**
 * 複製時加上版權信息
 */
  const addCopyright = () => {
    const copyright = GLOBAL_CONFIG.copyright
    document.body.oncopy = (e) => {
      e.preventDefault()
      let textFont; const copyFont = window.getSelection(0).toString()
      if (copyFont.length > copyright.limitCount) {
        textFont = copyFont + '\n' + '\n' + '\n' +
        copyright.languages.author + '\n' +
        copyright.languages.link + window.location.href + '\n' +
        copyright.languages.source + '\n' +
        copyright.languages.info
      } else {
        textFont = copyFont
      }
      if (e.clipboardData) {
        return e.clipboardData.setData('text', textFont)
      } else {
        return window.clipboardData.setData('text', textFont)
      }
    }
  }

  /**
 * 網頁運行時間
 */
  const addRuntime = () => {
    const $runtimeCount = document.getElementById('runtimeshow')
    if ($runtimeCount) {
      const publishDate = $runtimeCount.getAttribute('data-publishDate')
      $runtimeCount.innerText = btf.diffDate(publishDate) + ' ' + GLOBAL_CONFIG.runtime
    }
  }

  /**
 * 最後一次更新時間
 */
  const addLastPushDate = () => {
    const $lastPushDateItem = document.getElementById('last-push-date')
    if ($lastPushDateItem) {
      const lastPushDate = $lastPushDateItem.getAttribute('data-lastPushDate')
      $lastPushDateItem.innerText = btf.diffDate(lastPushDate, true)
    }
  }

  /**
 * table overflow
 */
  window.ifExe_addTableWrap=true; //锁
  const addTableWrap = function () {
    const $table = document.querySelectorAll('#article-container :not(.highlight) > table, #article-container > table')
    if ($table.length && window.ifExe_addTableWrap) {
      window.ifExe_addTableWrap=false;
      $table.forEach(item => {
        btf.wrap(item, 'div', '', 'table-wrap')
      })
    }
  }

  /**
 * tag-hide
 */
  window.ifExe_clickFnOfTagHide=true; //锁
  const clickFnOfTagHide = function () {
    const $hideInline = document.querySelectorAll('#article-container .hide-button')
    if ($hideInline.length && window.ifExe_clickFnOfTagHide) {
      window.ifExe_clickFnOfTagHide=false;
      $hideInline.forEach(function (item) {
        item.addEventListener('click', function (e) {
          const $this = this
          const $hideContent = $this.nextElementSibling
          $this.classList.toggle('open')
          if ($this.classList.contains('open')) {
            if ($hideContent.querySelectorAll('.justified-gallery').length > 0) {
              btf.initJustifiedGallery($hideContent.querySelectorAll('.justified-gallery'))
            }
          }
        })
      })
    }
  }

  const tabsFn = {
    clickFnOfTabs: function () {
      document.querySelectorAll('#article-container .tab > button').forEach(function (item) {
        item.addEventListener('click', function (e) {
          const $this = this
          const $tabItem = $this.parentNode

          if (!$tabItem.classList.contains('active')) {
            const $tabContent = $tabItem.parentNode.nextElementSibling
            const $siblings = btf.siblings($tabItem, '.active')[0]
            $siblings && $siblings.classList.remove('active')
            $tabItem.classList.add('active')
            const tabId = $this.getAttribute('data-href').replace('#', '')
            const childList = [...$tabContent.children]
            childList.forEach(item => {
              if (item.id === tabId) item.classList.add('active')
              else item.classList.remove('active')
            })
            const $isTabJustifiedGallery = $tabContent.querySelectorAll(`#${tabId} .justified-gallery`)
            if ($isTabJustifiedGallery.length > 0) {
              btf.initJustifiedGallery($isTabJustifiedGallery)
            }
          }
        })
      })
    },
    backToTop: () => {
      document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(function (item) {
        item.addEventListener('click', function () {
          btf.scrollToDest(btf.getEleTop(btf.getParents(this, '.tabs')), 300)
        })
      })
    }
  }

  const toggleCardCategory = function () {
    const $cardCategory = document.querySelectorAll('#aside-cat-list .card-category-list-item.parent i')
    if ($cardCategory.length) {
      $cardCategory.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault()
          const $this = this
          $this.classList.toggle('expand')
          const $parentEle = $this.parentNode.nextElementSibling
          if (btf.isHidden($parentEle)) {
            $parentEle.style.display = 'block'
          } else {
            $parentEle.style.display = 'none'
          }
        })
      })
    }
  }

  const switchComments = function () {
    let switchDone = false
    const $switchBtn = document.querySelector('#comment-switch > .switch-btn')
    $switchBtn && $switchBtn.addEventListener('click', function () {
      this.classList.toggle('move')
      document.querySelectorAll('#post-comment > .comment-wrap > div').forEach(function (item) {
        if (btf.isHidden(item)) {
          item.style.cssText = 'display: block;animation: tabshow .5s'
        } else {
          item.style.cssText = "display: none;animation: ''"
        }
      })

      if (!switchDone && typeof loadOtherComment === 'function') {
        switchDone = true
        loadOtherComment()
      }
    })
  }

  const addPostOutdateNotice = function () {
    const data = GLOBAL_CONFIG.noticeOutdate
    const diffDay = btf.diffDate(GLOBAL_CONFIG_SITE.postUpdate)
    if (diffDay >= data.limitDay) {
      const ele = document.createElement('div')
      ele.className = 'post-outdate-notice'
      ele.textContent = data.messagePrev + ' ' + diffDay + ' ' + data.messageNext
      const $targetEle = document.getElementById('article-container')
      if (data.position === 'top') {
        $targetEle.insertBefore(ele, $targetEle.firstChild)
      } else {
        $targetEle.appendChild(ele)
      }
    }
  }

  const lazyloadImg = () => {
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: 'img',
      threshold: 0,
      data_src: 'lazy-src'
    })
  }

  const relativeDate = function (selector) {
    selector.forEach(item => {
      const $this = item
      const timeVal = $this.getAttribute('datetime')
      $this.innerText = btf.diffDate(timeVal, true)
      $this.style.display = 'inline'
    })
  }

  const unRefreshFn = function () {
    window.addEventListener('resize', adjustMenu)
    window.addEventListener('orientationchange', () => { setTimeout(adjustMenu(true), 100) })

    clickFnOfSubMenu()
    GLOBAL_CONFIG.islazyload && lazyloadImg()
    GLOBAL_CONFIG.copyright !== undefined && addCopyright()
  }

  window.refreshFn = function () {
    initAdjust()

    if (GLOBAL_CONFIG_SITE.isPost) {
      GLOBAL_CONFIG_SITE.isToc && tocFn()
      GLOBAL_CONFIG.noticeOutdate !== undefined && addPostOutdateNotice()
      GLOBAL_CONFIG.relativeDate.post && relativeDate(document.querySelectorAll('#post-meta time'))
    } else {
      GLOBAL_CONFIG.relativeDate.homepage && relativeDate(document.querySelectorAll('#recent-posts time'))
      GLOBAL_CONFIG.runtime && addRuntime()
      addLastPushDate()
      toggleCardCategory()
    }

    sidebarFn()
    GLOBAL_CONFIG_SITE.isHome && scrollDownInIndex()
    addHighlightTool()
    GLOBAL_CONFIG.isPhotoFigcaption && addPhotoFigcaption()
    jqLoadAndRun()
    GLOBAL_CONFIG.lightbox === 'mediumZoom' && addMediumZoom()
    scrollFn()
    addTableWrap()
    clickFnOfTagHide()
    tabsFn.clickFnOfTabs()
    tabsFn.backToTop()
    switchComments()
  }
  
  //tocFn_forEncrypt和refreshFn_forEncrypt为加密页面提供支持（主要处理三大问题：标签插件、评论toggle、手机端toc）
  const tocFn_forEncrypt = function () {
    const $cardTocLayout = document.getElementById('card-toc')
    const $cardToc = $cardTocLayout.getElementsByClassName('toc-content')[0]
    const $tocLink = $cardToc.querySelectorAll('.toc-link')
    const $article = document.getElementById('article-container')

    // main of scroll
    window.addEventListener('scroll', btf.throttle(function (e) {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      scrollPercent(currentTop)
      findHeadPosition(currentTop)
    }, 100))

    const scrollPercent = function (currentTop) {
      const docHeight = $article.clientHeight
      const winHeight = document.documentElement.clientHeight
      const headerHeight = $article.offsetTop
      const contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : (document.documentElement.scrollHeight - winHeight)
      const scrollPercent = (currentTop - headerHeight) / (contentMath)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      const percentage = (scrollPercentRounded > 100) ? 100 : (scrollPercentRounded <= 0) ? 0 : scrollPercentRounded
      $cardToc.setAttribute('progress-percentage', percentage)
    }

    // anchor
    const isAnchor = GLOBAL_CONFIG.isanchor
    const updateAnchor = function (anchor) {
      if (window.history.replaceState && anchor !== window.location.hash) {
        if (!anchor) anchor = location.pathname
        window.history.replaceState({}, '', anchor)
      }
    }

    const autoScrollToc = function (item) {
      const activePosition = item.getBoundingClientRect().top
      const sidebarScrollTop = $cardToc.scrollTop
      if (activePosition > (document.documentElement.clientHeight - 100)) {
        $cardToc.scrollTop = sidebarScrollTop + 150
      }
      if (activePosition < 100) {
        $cardToc.scrollTop = sidebarScrollTop - 150
      }
    }

    // find head position & add active class
    const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let detectItem = ''
    const findHeadPosition = function (top) {
      if ($tocLink.length === 0 || top === 0) {
        return false
      }

      let currentId = ''
      let currentIndex = ''

      list.forEach(function (ele, index) {
        if (top > btf.getEleTop(ele) - 80) {
          currentId = '#' + encodeURI(ele.getAttribute('id'))
          currentIndex = index
        }
      })

      if (detectItem === currentIndex) return

      if (isAnchor) updateAnchor(currentId)

      if (currentId === '') {
        $cardToc.querySelectorAll('.active').forEach(i => { i.classList.remove('active') })
        detectItem = currentIndex
        return
      }

      detectItem = currentIndex

      $cardToc.querySelectorAll('.active').forEach(item => { item.classList.remove('active') })
      const currentActive = $tocLink[currentIndex]
      currentActive.classList.add('active')

      setTimeout(() => {
        autoScrollToc(currentActive)
      }, 0)

      let parent = currentActive.parentNode

      for (; !parent.matches('.toc'); parent = parent.parentNode) {
        if (parent.matches('li')) parent.classList.add('active')
      }
    }
  }
  
  window.refreshFn_forEncrypt = function () {
    initAdjust()

    if (GLOBAL_CONFIG_SITE.isPost) {
      GLOBAL_CONFIG_SITE.isToc && tocFn_forEncrypt()
      GLOBAL_CONFIG.noticeOutdate !== undefined && addPostOutdateNotice()
      GLOBAL_CONFIG.relativeDate.post && relativeDate(document.querySelectorAll('#post-meta time'))
    } else {
      GLOBAL_CONFIG.relativeDate.homepage && relativeDate(document.querySelectorAll('#recent-posts time'))
      GLOBAL_CONFIG.runtime && addRuntime()
      addLastPushDate()
      toggleCardCategory()
    }

    sidebarFn()
    GLOBAL_CONFIG_SITE.isHome && scrollDownInIndex()
    addHighlightTool() //目前发现在使用encrypt加密情况下，由于需要在页面底部执行一次refreshFn_forEncrypt()，可能会导致addHighlightTool()执行两次，之前第一次一般不会执行addHighlightTool的真实函数体，因为不满足条件函数直接return了，但是发现偶尔居然也能满足条件（这种随机性我不知道是怎么出现的），总之需要加锁，使addHighlightTool函数体执行且仅执行一次，同样，clickFnOfTagHide()和addTableWrap()也存在该问题
    GLOBAL_CONFIG.isPhotoFigcaption && addPhotoFigcaption()
    jqLoadAndRun()
    GLOBAL_CONFIG.lightbox === 'mediumZoom' && addMediumZoom()
    scrollFn()
    addTableWrap()
    clickFnOfTagHide()
    tabsFn.clickFnOfTabs()
    tabsFn.backToTop()
  }

  refreshFn()
  unRefreshFn()
  
  console.log(`嗨！欢迎来到我的博客😃！本站新增了一个垃圾的功能😅，请执行get_mini_note_status()获取相关提示（仅限电脑端）...`);
})
