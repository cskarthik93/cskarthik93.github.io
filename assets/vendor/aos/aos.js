import MutationObserver from 'mutation-observer';

const isSupported = () => 'MutationObserver' in window;

const ready = (callback) => {
  if (isSupported()) {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      removedNodes: true,
    });
  } else {
    console.warn('MutationObserver is not supported on this browser. Code mutations observing has been disabled.');
  }
};

export default { isSupported, ready };


const getOffset = (element, offset) => {
  const rect = element.getBoundingClientRect();
  return rect.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0) + (offset || 0);
};

const getScrollTop = () => (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

const getWindowHeight = () => window.innerHeight || document.documentElement.clientHeight;

export { getOffset, getScrollTop, getWindowHeight };


import { getOffset } from './aos-utils';

const animateElements = (elements, threshold) => {
  const scrollTop = getScrollTop();
  elements.forEach((element) => {
    if (getOffset(element, threshold) < scrollTop + getWindowHeight()) {
      element.classList.add('aos-animate');
    }
  });
};

export default animateElements;


import { getOffset } from './aos-utils';

const initElements = (elements, config) => {
  elements.forEach((element) => {
    element.classList.add('aos-init');
    element.dataset.aosPosition = getOffset(element, config.offset);
  });
};

export default initElements;


const getPosition = (element, config) => {
  const windowHeight = window.innerHeight;
  const offset = config.offset || 0;
  const anchor = document.querySelector(config.anchor);
  let position = 0;

  switch (config.anchorPlacement) {
    case 'top-bottom':
      break;
    case 'center-bottom':
      position += element.offsetHeight / 2;
      break;
    case 'bottom-bottom':
      position += element.offsetHeight;
      break;
    case 'top-center':
      position += windowHeight / 2;
      break;
    case 'bottom-center':
      position += windowHeight / 2 + element.offsetHeight;
      break;
    case 'center-center':
      position += windowHeight / 2 + element.offsetHeight / 2;
      break;
    case 'top-top':
      position += windowHeight;
      break;
    case 'bottom-top':
      position += element.offsetHeight + windowHeight;
      break;
    case 'center-top':
      position += element.offsetHeight / 2 + windowHeight;
      break;
    default:
      break;
  }

  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    position += (rect.top + window.pageYOffset) - (document.documentElement.clientTop || 0);
  }

  return position + offset;
};

export default getPosition;


import aos from './aos';
import animateElements from './aos-animate';
import initElements from './aos-init';
import getPosition from './aos-position';

const { isSupported, ready } = aos;
const { getWindowHeight, getOffset, getScrollTop } = aosUtils;

let elements = [];

const initAOS = () => {
  if (!isSupported()) return;

  const observer = new MutationObserver(() => {
    elements = document.querySelectorAll('[data-aos]');
    elements = Array.from(elements).map(element => ({ node: element }));
    initElements(elements, { offset: 120 });
    animateElements(elements, getScrollTop());
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('scroll', () => {
    animateElements(elements, getScrollTop());
  });

  window.addEventListener('resize', () => {
    animateElements(elements, getScrollTop());
  });

  ready(() => {
    elements = document.querySelectorAll('[data-aos]');
    elements = Array.from(elements).map(element => ({ node: element }));
    initElements(elements, { offset: 120 });
    animateElements(elements, getScrollTop());
  });
};

initAOS();
