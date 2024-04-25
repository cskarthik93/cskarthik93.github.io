'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

const HTMLParser = require('./html-parser');
const Initializer = require('./initializer');

const defaults = {
  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
  typeSpeed: 0,
  startDelay: 0,
  backSpeed: 0,
  smartBackspace: true,
  shuffle: false,
  backDelay: 700,
  fadeOut: false,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500,
  loop: false,
  loopCount: Infinity,
  showCursor: true,
  cursorChar: '|',
  attr: null,
  bindInputFocusEvents: false,
  contentType: 'html',
  onBegin: function onBegin() {},
  onComplete: function onComplete() {},
  preStringTyped: function preStringTyped() {},
  onStringTyped: function onStringTyped() {},
  onLastStringBackspaced: function onLastStringBackspaced() {},
  onTypingPaused: function onTypingPaused() {},
  onTypingResumed: function onTypingResumed() {},
  onReset: function onReset() {},
  onStop: function onStop() {},
  onStart: function onStart() {},
  onDestroy: function onDestroy() {}
};

class Typed {
  constructor(elementId, options) {
    _classCallCheck(this, Typed);

    this.options = Object.assign({}, defaults, options);

    Initializer.initializer.load(this, options, elementId);
    this.begin();
  }

  get currentElContent() {
    if (this.attr) {
      return this.el.getAttribute(this.attr);
    } else if (this.isInput) {
      return this.el.value;
    } else if (this.contentType === 'html') {
      return this.el.innerHTML;
    } else {
      return this.el.textContent;
    }
  }

  get isInput() {
    return this.el.tagName.toLowerCase() === 'input';
  }

  begin() {
    this.options.onBegin(this);
    this.typingComplete = false;
    this.shuffleStringsIfNeeded(this);
    this.insertCursor();
    if (this.bindInputFocusEvents) this.bindFocusEvents();
    this.timeout = setTimeout(() => {
      if (!this.currentElContent || this.currentElContent.length === 0) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
      } else {
        this.backspace(this.currentElContent, this.currentElContent.length);
      }
    }, this.startDelay);
  }

  typewrite(curString, curStrPos) {
    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);
    }

    const humanize = this.humanizer(this.typeSpeed);
    let numChars = 1;

    if (this.pause.status === true) {
      this.setPauseStatus(curString, curStrPos, true);
      return;
    }

    this.timeout = setTimeout(() => {
      curStrPos = HTMLParser.htmlParser.typeHtmlChars(curString, curStrPos, this);

      let pauseTime = 0;
      let substr = curString.substr(curStrPos);
      if (substr.charAt(0) === '^') {
        if (/^\^\d+/.test(substr)) {
          const skip = 1;
          substr = /\d+/.exec(substr)[0];
          pauseTime = parseInt(substr);
          this.temporaryPause = true;
          this.options.onTypingPaused(this.arrayPos, this);
          curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
        }
      }

      this.timeout = setTimeout(() => {
        this.toggleBlinking(false);

        if (curStrPos >= curString.length) {
          this.doneTyping(curString, curStrPos);
        } else {
          this.keepTyping(curString, curStrPos, numChars);
        }

        if (this.temporaryPause) {
          this.temporaryPause = false;
          this.options.onTypingResumed(this.arrayPos, this);
        }
      }, pauseTime);
    }, humanize);
  }

  keepTyping(curString, curStrPos, numChars) {
    if (curStrPos === 0) {
      this.toggleBlinking(false);
      this.options.preStringTyped(this.arrayPos, this);
    }

    curStrPos += numChars;
    const nextString = curString.substr(0, curStrPos);
    this.replaceText(nextString);
    this.typewrite(curString, curStrPos);
  }

  doneTyping(curString, curStrPos) {
    this.options.onStringTyped(this.arrayPos, this);
    this.toggleBlinking(true);

    if (this.arrayPos === this.strings.length - 1) {
      this.complete();
      if (this.loop === false || this.curLoop === this.loopCount) {
        return;
      }
    }

    this.timeout = setTimeout(() => {
      this.backspace(curString, curStrPos);
    }, this.backDelay);
  }

  backspace(curString, curStrPos) {
    if (this.pause.status === true) {
      this.setPauseStatus(curString, curStrPos, true);
      return;
    }
    if (this.fadeOut) return this.initFadeOut();

    this.toggleBlinking(false);
    const humanize = this.humanizer(this.backSpeed);

    this.timeout = setTimeout(() => {
      curStrPos = HTMLParser.htmlParser.backSpaceHtmlChars(curString, curStrPos, this);
      const curStringAtPosition = curString.substr(0, curStrPos);
      this.replaceText(curStringAtPosition);

      if (this.smartBackspace) {
        const nextString = this.strings[this.arrayPos + 1];
        if (nextString && curStringAtPosition === nextString.substr(0, curStrPos)) {
          this.stopNum = curStrPos;
        } else {
          this.stopNum = 0;
        }
      }

      if (curStrPos > this.stopNum) {
        curStrPos--;
        this.backspace(curString, curStrPos);
      } else if (curStrPos <= this.stopNum) {
        this.arrayPos++;
        if (this.arrayPos === this.strings.length) {
          this.arrayPos = 0;
          this.options.onLastStringBackspaced();
          this.shuffleStringsIfNeeded();
          this.begin();
        } else {
          this.typewrite(this.strings[this.sequence[this.arrayPos]], curStrPos);
        }
      }
    }, humanize);
  }

  complete() {
    this.options.onComplete(this);
    if (this.loop) {
      this.curLoop++;
    } else {
      this.typingComplete = true;
    }
  }

  setPauseStatus(curString, curStrPos, isTyping) {
    this.pause.typewrite = isTyping;
    this.pause.curString = curString;
    this.pause.curStrPos = curStrPos;
  }

  toggleBlinking(isBlinking) {
    if (!this.cursor) return;
    if (this.pause.status) return;
    if (this.cursorBlinking === isBlinking) return;
    this.cursorBlinking = isBlinking;
    if (isBlinking) {
      this.cursor.classList.add('typed-cursor--blink');
    } else {
      this.cursor.classList.remove('typed-cursor--blink');
    }
  }

  humanizer(speed) {
    return Math.round(Math.random() * speed / 2) + speed;
  }

  shuffleStringsIfNeeded() {
    if (!this.shuffle) return;
    this.sequence = this.sequence.sort(() => Math.random() - 0.5);
  }

  initFadeOut() {
    const self = this;

    this.el.classList.add(this.fadeOutClass);
    if (this.cursor) this.cursor.classList.add(this.fadeOutClass);

    setTimeout(() => {
      this.arrayPos++;
      this.replaceText('');

      if (this.strings.length > this.arrayPos) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);
      } else {
        this.typewrite(this.strings[0], 0);
        this.arrayPos = 0;
      }
    }, this.fadeOutDelay);
  }

  replaceText(str) {
    if (this.attr) {
      this.el.setAttribute(this.attr, str);
    } else {
      if (this.isInput) {
        this.el.value = str;
      } else if (this.contentType === 'html') {
        this.el.innerHTML = str;
      } else {
        this.el.textContent = str;
      }
    }
  }

  bindFocusEvents() {
    const self = this;

    if (!this.isInput) return;
    this.el.addEventListener('focus', e => {
      this.stop();
    });
    this.el.addEventListener('blur', e => {
      if (this.el.value && this.el.value.length !== 0) {
        return;
      }
      this.start();
    });
  }

  insertCursor() {
    if (!this.showCursor) return;
    if (this.cursor) return;
    this.cursor = document.createElement('span');
    this.cursor.className = 'typed-cursor';
    this.cursor.innerHTML = this.cursorChar;
    this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
  }

  dispose() {
    clearTimeout(this.timeout);
    this.reset(false);
    this.options.onDestroy(this);
  }

  reset(restart) {
    clearInterval(this.timeout);
    this.replaceText('');
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
      this.cursor = null;
    }
    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
    if (restart) {
      this.insertCursor();
      this.options.onReset(this);
      this.begin();
    }
  }
}

exports['default'] = Typed;
module.exports = exports['default'];


'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

const defaultsJs = require('./defaults');

class Initializer {
  static initializer = {
    load(self, options, elementId) {
      _classCallCheck(this, Initializer);

      // chosen element to manipulate text
      if (typeof elementId === 'string') {
        self.el = document.querySelector(elementId);
      } else {
        self.el = elementId;
      }

      self.options = Object.assign({}, defaultsJs.default, options);

      // attribute to type into
      self.isInput = self.el.tagName.toLowerCase() === 'input';
      self.attr = self.options.attr;
      self.bindInputFocusEvents = self.options.bindInputFocusEvents;

      // show cursor
      self.showCursor = self.isInput ? false : self.options.showCursor;

      // custom cursor
      self.cursorChar = self.options.cursorChar;

      // Is the cursor blinking
      self.cursorBlinking = true;

      // text content of element
      self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;

      // html or plain text
      self.contentType = self.options.contentType;

      // typing speed
      self.typeSpeed = self.options.typeSpeed;

      // add a delay before typing starts
      self.startDelay = self.options.startDelay;

      // backspacing speed
      self.backSpeed = self.options.backSpeed;

      // only backspace what doesn't match the previous string
      self.smartBackspace = self.options.smartBackspace;

      // amount of time to wait before backspacing
      self.backDelay = self.options.backDelay;

      // Fade out instead of backspace
      self.fadeOut = self.options.fadeOut;
      self.fadeOutClass = self.options.fadeOutClass;
      self.fadeOutDelay = self.options.fadeOutDelay;

      // variable to check whether typing is currently paused
      self.isPaused = false;

      // input strings of text
      self.strings = self.options.strings.map(s => s.trim());

      // div containing strings
      if (typeof self.options.stringsElement === 'string') {
        self.stringsElement = document.querySelector(self.options.stringsElement);
      } else {
        self.stringsElement = self.options.stringsElement;
      }

      if (self.stringsElement) {
        self.strings = [];
        self.stringsElement.style.display = 'none';
        const strings = Array.prototype.slice.apply(self.stringsElement.children);
        const stringsLength = strings.length;

        if (stringsLength) {
          for (let i = 0; i < stringsLength; i += 1) {
            const stringEl = strings[i];
            self.strings.push(stringEl.innerHTML.trim());
          }
        }
      }

      // character number position of current string
      self.strPos = 0;

      // current array position
      self.arrayPos = 0;

      // index of string to stop backspacing on
      self.stopNum = 0;

      // Looping logic
      self.loop = self.options.loop;
      self.loopCount = self.options.loopCount;
      self.curLoop = 0;

      // Shuffle the strings
      self.shuffle = self.options.shuffle;
      // the order of strings
      self.sequence = [];

      self.pause = {
        status: false,
        typewrite: true,
        curString: '',
        curStrPos: 0
      };

      // When the typing is complete (when not looped)
      self.typingComplete = false;

      // Set the order in which the strings are typed
      for (let i in self.strings) {
        self.sequence[i] = i;
      }

      // If there is some text in the element
      self.currentElContent = this.getCurrentElContent(self);

      self.autoInsertCss = self.options.autoInsertCss;

      this.appendAnimationCss(self);
    }
  };

  static getCurrentElContent(self) {
    let elContent = '';
    if (self.attr) {
      elContent = self.el.getAttribute(self.attr);
    } else if (self.isInput) {
      elContent = self.el.value;
    } else if (self.contentType === 'html') {
      elContent = self.el.innerHTML;
    } else {
      elContent = self.el.textContent;
    }
    return elContent;
  }

  static appendAnimationCss(self) {
    if (!self.autoInsertCss) {
      return;
    }
    if (!self.showCursor && !self.fadeOut) {
      return;
    }
    if (document.querySelector('[' + 'data-typed-js-css' + ']')) {
      return;
    }

    const css = document.createElement('style');
    css.type = 'text/css';
    css.setAttribute('data-typed-js-css', true);

    let innerCss = '';
    if (self.showCursor) {
      innerCss += '\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ';
    }
    if (self.fadeOut) {
      innerCss += '\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ';
    }
    if (css.length === 0) {
      return;
    }
    css.innerHTML = innerCss;
    document.body.appendChild(css);
  }
}

exports['default'] = Initializer;
module.exports = exports['default'];


'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

class HTMLParser {
  constructor() {
    _classCallCheck(this, HTMLParser);
  }

  static typeHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '<' || curChar === '&') {
      let endTag = '';
      if (curChar === '<') {
        endTag = '>';
      } else {
        endTag = ';';
      }
      while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
        curStrPos++;
        if (curStrPos + 1 > curString.length) {
          break;
        }
      }
      curStrPos++;
    }
    return curStrPos;
  }

  static backSpaceHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '>' || curChar === ';') {
      let endTag = '';
      if (curChar === '>') {
        endTag = '<';
      } else {
        endTag = '&';
      }
      while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
        curStrPos--;
        if (curStrPos < 0) {
          break;
        }
      }
      curStrPos--;
    }
    return curStrPos;
  }
}

exports['default'] = HTMLParser;
module.exports = exports['default'];


'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = {
  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
  stringsElement: null,
  typeSpeed: 0,
  startDelay: 0,
  backSpeed: 0,
  smartBackspace: true,
  shuffle: false,
  backDelay: 700,
  fadeOut: false,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500,
  loop: false,
  loopCount: Infinity,
  showCursor: true,
  cursorChar: '|',
  attr: null,
  bindInputFocusEvents: false,
  contentType: 'html',
  onBegin: function onBegin() {},
  onComplete: function onComplete() {},
  preStringTyped: function preStringTyped() {},
  onStringTyped: function onStringTyped() {},
  onLastStringBackspaced: function onLastStringBackspaced() {},
  onTypingPaused: function onTypingPaused() {},
  onTypingResumed: function onTypingResumed() {},
  onReset: function onReset() {},
  onStop: function onStop() {},
  onStart: function onStart() {},
  onDestroy: function onDestroy() {}
};
module.exports = exports['default'];
