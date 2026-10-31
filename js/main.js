// 添加视差效果
var image = document.getElementsByClassName('banner-pic-img');
new simpleParallax(image, {
  orientation: 'up',
  scale: 1.2,
  delay: 2,
  transition: 'cubic-bezier(0,0,0,1)',
  maxTransition: 50,
  overflow: true
});

// 添加菜单点击事件
var menuButton = document.getElementById("nav-menu");
menuButton.addEventListener('click',function(){
  if(document.getElementById("body").classList.contains('show-menu')) {
    heoWeb.hideMenu();
  }else {
    heoWeb.showMenu();
  }
},false)

//关闭菜单
$('.menu-list').click(function () {
	heoWeb.hideMenu();
});

//阻止菜单滚动
document.querySelector('.menu-list').addEventListener('wheel',(e)=>{
  e.preventDefault()
})

// zhheo 风格导航滑动高亮胶囊
var navCenter = document.getElementById('nav-center');
var navPill = document.getElementById('nav-pill');
var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-center .nav-item'));
var navHovered = false;

function moveNavPill(item) {
  if (!item) {
    navPill.style.opacity = '0';
    return;
  }
  var centerRect = navCenter.getBoundingClientRect();
  var rect = item.getBoundingClientRect();
  navPill.style.left = (rect.left - centerRect.left) + 'px';
  navPill.style.width = rect.width + 'px';
  navPill.style.opacity = '1';
}

function setActiveNavItem(item) {
  navItems.forEach(function (it) {
    it.classList.toggle('active', it === item);
  });
}

function currentSectionItem() {
  var scrollLine = window.pageYOffset + 120;
  var result = null;
  navItems.forEach(function (item) {
    var section = document.getElementById(item.getAttribute('data-section'));
    if (section && section.offsetTop <= scrollLine) result = item;
  });
  return result;
}

function syncNavPill() {
  if (navHovered) return;
  var item = currentSectionItem();
  setActiveNavItem(item);
  moveNavPill(item);
}

navCenter.addEventListener('mouseenter', function () {
  navHovered = true;
});

navCenter.addEventListener('mouseleave', function () {
  navHovered = false;
  syncNavPill();
});

navItems.forEach(function (item) {
  item.addEventListener('mouseenter', function () {
    moveNavPill(item);
  });
});

window.addEventListener('scroll', function () {
  window.requestAnimationFrame(syncNavPill);
}, { passive: true });

window.addEventListener('resize', function () {
  if (!navHovered) syncNavPill();
});

window.addEventListener('load', syncNavPill);
syncNavPill();

var heoWeb = {
  //显示菜单
  showMenu: function() {
    document.getElementById("body").classList.add("show-menu");
  },

  hideMenu: function() {
    document.getElementById("body").classList.remove("show-menu");
  },

  //跳转到id
  scrollTo(id) {
    let target = document.getElementById(id);
    if (!target) return;
    let targetPosition = target.offsetTop - 60;
    let startPosition = window.pageYOffset;
    let distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      let run = ease(timeElapsed, startPosition, distance, 600);
      window.scrollTo(0, run);
      if (timeElapsed < 600) requestAnimationFrame(animation);
    }
  
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
  
    requestAnimationFrame(animation);
  }
}

//滚动页面动画
function scrollToTopWithAnimation() {  const duration = 600; // in milliseconds
  const startPosition = window.pageYOffset;
  const distance = -window.pageYOffset;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) {
      startTime = currentTime;
    }
    const timeElapsed = currentTime - startTime;
    const scrollY = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, scrollY);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

/* ===== 明暗主题 =====
 * 默认按时间自动切换：07:00-18:59 白天，其余时间深夜。
 * 点击图标手动切换后记住选择；当手动选择与自动结果一致时自动回归「跟随时间」。
 */
var heoTheme = (function () {
  var STORAGE_KEY = 'heo-theme-mode';
  var DAY_START_HOUR = 7;
  var NIGHT_START_HOUR = 19;
  var CHECK_INTERVAL = 60 * 1000;
  var button = document.getElementById('theme-toggle');
  var meta = document.getElementById('theme-color');

  function autoTheme() {
    var hour = new Date().getHours();
    return (hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR) ? 'light' : 'dark';
  }

  function getPref() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return (value === 'light' || value === 'dark') ? value : 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function setPref(value) {
    try {
      if (value === 'auto') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
    } catch (e) { }
  }

  function current() {
    var pref = getPref();
    return pref === 'auto' ? autoTheme() : pref;
  }

  function render(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-mode', getPref());
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1C1C1F' : '#F5F5F7');
    }
    if (button) {
      var isDark = theme === 'dark';
      button.setAttribute('aria-label', isDark ? '切换为浅色模式' : '切换为深色模式');
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('title', (isDark ? '深色模式' : '浅色模式') +
        (getPref() === 'auto' ? ' · 跟随时间自动切换' : ' · 已手动切换') +
        '，点击切换');
    }
  }

  function apply() {
    render(current());
  }

  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    // 手动选择恰好等于自动结果时，不必记住，继续跟随时间
    setPref(next === autoTheme() ? 'auto' : next);
    apply();
  }

  // 跨过时间分界（含标签页切回前台）时重新判断
  function tick() {
    var pref = getPref();
    if (pref !== 'auto' && pref === autoTheme()) {
      setPref('auto');
    }
    apply();
  }

  if (button) {
    button.addEventListener('click', toggle);
  }
  setInterval(tick, CHECK_INTERVAL);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) tick();
  });
  apply();

  return {
    toggle: toggle,
    set: function (mode) {
      setPref(mode === 'light' || mode === 'dark' ? mode : 'auto');
      apply();
    },
    get: current
  };
})();