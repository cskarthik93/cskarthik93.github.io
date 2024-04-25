import select from './modules/select.js';
import on from './modules/on.js';
import scrollto from './modules/scrollto.js';
import navbarlinksActive from './modules/navbarlinksActive.js';
import toggleBacktotop from './modules/toggleBacktotop.js';
import mobileNavToggle from './modules/mobileNavToggle.js';

const navbarlinks = select('#navbar .scrollto', true);
const backtotop = select('.back-to-top');

document.addEventListener('load', navbarlinksActive);
onscroll(document, () => requestAnimationFrame(navbarlinksActive));

if (backtotop) {
  toggleBacktotop();
  onscroll(document, toggleBacktotop);
}

mobileNavToggle();

on('click', '.scrollto', scrollto, true);

window.addEventListener('load', () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  }
});

const preloader = select('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.remove();
  });
}

const typed = select('.typed');
if (typed) {
  const typed_strings = typed.dataset.typedItems.split(',');
  new Typed('.typed', {
    strings: typed_strings,
    loop: true,
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000
  });
}

const skilsContent = select('.skills-content');
if (skilsContent) {
  new Waypoint({
    element: skilsContent,
    offset: '80%',
    handler: function(direction) {
      const progress = select('.progress .progress-bar', true);
      progress.forEach((el) => {
        el.style.width = el.dataset.valuenow + '%';
      });
    }
  })
}

const portfolioContainer = select('.portfolio-container');
if (portfolioContainer) {
  const portfolioIsotope = new Isotope(portfolioContainer, {
    itemSelector: '.portfolio-item'
  });

  const portfolioFilters = select('#portfolio-flters li', true);

  on('click', '#portfolio-flters li', (e) => {
    e.preventDefault();
    portfolioFilters.forEach((el) => el.classList.remove('filter-active'));
    e.target.classList.add('filter-active');

    portfolioIsotope.arrange({
      filter: e.target.dataset.filter
    });
    portfolioIsotope.on('arrangeComplete', () => AOS.refresh());
  }, true);
}

const portfolioLightbox = GLightbox({
  selector: '.portfolio-lightbox'
});

const portfolioDetailsLightbox = GLightbox({
  selector: '.portfolio-details-lightbox',
  width: '90%',
  height: '90vh'
});

const portfolioDetailsSlider = new Swiper('.portfolio-details-slider', {
  speed: 400,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
});

const testimonialsSlider = new Swiper('.testimonials-slider', {
  speed: 600,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  slidesPerView: 'auto',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
});

const mobileNav = matchMedia('(max-width: 991.98px)');
const navbarToggleBtn = select('.mobile-nav-toggle');
const navbarLinks = select('#navbar .scrollto', true);

const navbarLinksActiveOnMobile = () => {
  if (mobileNav.matches) {
    navbarLinks.forEach((el) => {
      if (!el.hash) return;
      let section = select(el.hash);
      if (!section) return;
      if (
        window.scrollY >= section.offsetTop - 50 &&
        window.scrollY <= section.offsetTop + section.offsetHeight - 50
      ) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
};

mobileNav.addListener(navbarLinksActiveOnMobile);
navbarLinksActiveOnMobile();

window.addEventListener('load', () => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
});


export default function select(el, all = false) {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
}


import select from './select.js';

export default function on(type, el, listener) {
  const element = select(el);
  if (element) {
    element.addEventListener(type, listener);
  }
}


import select from './select.js';

export default function scrollto(el) {
  const elementPos = select(el).offsetTop;
  window.scrollTo({
    top: elementPos,
    behavior: 'smooth'
  });
}


import select from './select.js';

export default function navbarlinksActive() {
  const position = window.scrollY + 200;
  const navbarlinks = select('#navbar .scrollto', true);
  navbarlinks.forEach((navbarlink) => {
    if (!navbarlink.hash) return;
    const section = select(navbarlink.hash);
    if (!section) return;
    if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
      navbarlink.classList.add('active');
    } else {
      navbarlink.classList.remove('active');
    }
  });
}


import select from './select.js';

export default function toggleBacktotop() {
  if (window.scrollY > 100) {
    select('.back-to-top').classList.add('active');
  } else {
    select('.back-to-top').classList.remove('active');
  }
}


import on from './on.js';
import select from './select.js';

export default function mobileNavToggle() {
  on('click', '.mobile-nav-toggle', function (e) {
    const body = select('body');
    body.classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });
}
