// select.ts

import type { Element } from 'html';

export default function select(el: string, all = false): Element | null | Element[] {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
}


// on.ts

import type { AddEventListenerOptions, EventListenerOrEventListenerObject } from 'dom.iterable';

export default function on(type: string, el: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void {
  const element = select(el);
  if (element) {
    element.addEventListener(type, listener, options);
  }
}


// scrollto.ts

export default function scrollto(el: string): void {
  const element = select(el);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}


// navbarlinksActive.ts

export default function navbarlinksActive(): void {
  const navbarlinks = select('#navbar .scrollto', true);
  navbarlinks.forEach((navbarlink) => {
    if (!navbarlink.hash) return;
    const section = select(navbarlink.hash);
    if (!section) return;
    if (section.getBoundingClientRect().top <= 0 && section.getBoundingClientRect().bottom >= 0) {
      navbarlink.classList.add('active');
    } else {
      navbarlink.classList.remove('active');
    }
  });
}


// toggleBacktotop.ts

export default function toggleBacktotop(): void {
  select('.back-to-top').classList.toggle('active', window.scrollY > 100);
}


// mobileNavToggle.ts

export default function mobileNavToggle(): void {
  on('click', '.mobile-nav-toggle', function () {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });
}


// readme.md

This is a collection of utility functions for a web application.

## Functions

### select(el: string, all = false): Element | null | Element[]

Selects one or more elements from the DOM, based on the given selector.

### on(type: string, el: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void

Attaches an event listener to an element, with the given type, listener and options.

### scrollto(el: string): void

Scrolls the window smoothly to the given element.

### navbarlinksActive(): void

Activates the navigation links that point to the current section.

### toggleBacktotop(): void

Shows or hides the "back to top" button, based on the scroll position.

### mobileNavToggle(): void

Toggles the mobile navigation and the hamburger/close icon.
