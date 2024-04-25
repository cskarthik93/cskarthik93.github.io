// main.ts

import { PureCounter } from './purecounter';

const counters = document.querySelectorAll('.purecounter');
new PureCounter(counters);


// purecounter.ts

import { IntersectionObserver, IntersectionObserverEntry } from 'intersection-observer';

export class PureCounter {
  private counters: NodeListOf<HTMLElement>;

  constructor(counters: NodeListOf<HTMLElement>) {
    this.counters = counters;
    this.registerEventListeners();
  }

  private registerEventListeners(): void {
    if (this.intersectionListenerSupported()) {
      const observer = new IntersectionObserver(this.animateElements.bind(this), {
        root: null,
        rootMargin: '20px',
        threshold: 0.5,
      });

      for (let i = 0; i < this.counters.length; i++) {
        observer.observe(this.counters[i]);
      }
    } else {
      window.addEventListener('scroll', this.animateLegacy.bind(this));
      this.animateLegacy(this.counters);
    }
  }

  private animateLegacy(counters: NodeListOf<HTMLElement>): void {
    for (let i = 0; i < counters.length; i++) {
      if (this.parseConfig(counters[i]).legacy) {
        this.elementIsInView(counters[i]) && this.animateElements([counters[i]]);
      }
    }
  }

  private animateElements(entries: IntersectionObserverEntry[], observer?: IntersectionObserver): void {
    for (const entry of entries) {
      if (entry.isIntersecting || (observer && entry.intersectionRatio < 0.5)) {
        this.startCounter(entry.target, this.parseConfig(entry.target));
      }
    }
  }

  private startCounter(element: HTMLElement, config: Config): void {
    const raf = requestAnimationFrame(() => {
      const interval = setInterval(() => {
        const nextNumber = this.nextNumber(config, config.start > config.end ? 'dec' : 'inc');
        this.formatNumber(element, nextNumber, config);

        if ((config.start > config.end && nextNumber === config.end) || (config.start < config.end && nextNumber === config.end)) {
          clearInterval(interval);
          element.innerHTML = config.decimals <= 0 ? parseInt(config.end) : config.end.toFixed(config.decimals);
          cancelAnimationFrame(raf);
        }
      }, config.delay);
    });
  }

  private parseConfig(element: HTMLElement): Config {
    const attributes = Array.from(element.attributes).filter((attr) => attr.name.startsWith('data-purecounter-'));
    const config: Partial<Config> = {
      start: 0,
      end: 9001,
      duration: 2000,
      delay: 10,
      once: true,
      decimals: 0,
      legacy: true,
    };

    for (const attr of attributes) {
      const key = attr.name.replace('data-purecounter-', '');
      config[key.toLowerCase()] = this.castDataType(attr.value);
    }

    return config as Config;
  }

  private nextNumber(config: Config, direction: 'inc' | 'dec'): number {
    if (direction === 'inc') {
      return config.decimals <= 0 ? Math.floor(config.start) + Math.floor(config.duration / config.delay) : +config.start + +config.duration / +config.delay;
    } else {
      return config.decimals <= 0 ? Math.floor(config.start) - Math.floor(config.duration / config.delay) : +config.start - +config.duration / +config.delay;
    }
  }

  private formatNumber(element: HTMLElement, value: number, config: Config): void {
    if (config.decimals <= 0) {
      element.innerHTML = Math.floor(value);
    } else {
      element.innerHTML = value.toLocaleString(undefined, { minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals });
    }
  }

  private castDataType(value: string): number | string {
    return /^\d+\.\d+$/.test(value) ? parseFloat(value) : /^\d+$/.test(value) ? parseInt(value) : value;
  }

  private elementIsInView(element: HTMLElement): boolean {
    const { top, left, width, height } = element.getBoundingClientRect();
    return (
      top >= 0 &&
      left >= 0 &&
      top - window.innerHeight <= 0 &&
      left - window.innerWidth <= 0 &&
      top + height >= 0 &&
      left + width >= 0
    );
  }

  private intersectionListenerSupported(): boolean {
    return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
  }
}

interface Config {
  start: number;
  end: number;
  duration: number;
  delay: number;
  once: boolean;
  decimals: number;
  legacy: boolean;
}


npm install intersection-observer


tsc main.ts purecounter.ts
