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
function scrollToTopWithAnimation() {
  const duration = 600; // in milliseconds
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