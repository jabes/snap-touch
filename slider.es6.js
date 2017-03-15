const Slider = class {

    constructor(selector) {

        this.el = {};
        this.el.container = document.getElementById(selector);
        this.el.animator = this.el.container ? this.el.container.querySelector('.slides') : undefined;
        this.el.slides = this.el.animator ? this.el.animator.querySelectorAll('.slide') : [];
        this.el.anchors = this.el.animator ? this.el.animator.querySelectorAll('a[href]') : [];

        this.events = {};

        this.params = {
            slideWidth: undefined,
            slideTotal: undefined,
            velocity: undefined,
            amplitude: undefined,
            posX: undefined,
            targetX: undefined,
            lastPosX: undefined,
            lastTouchX: undefined,
            firstTimestamp: undefined,
            lastTimestamp: undefined,
            ticker: undefined,
            activeIndex: undefined,
            isClick: undefined,
            isEasing: undefined,
            hasMoved: undefined,
        };

        this.init();
    }

    init() {
        if (this.el.container && this.el.slides.length >= 0) {
            this.getActiveIndex();
            this.bindEvents();
            this.resize();
            this.addClass(this.el.container, 'slider-active');
        }
    }

    destroy() {
        this.removeAllEvents();
        this.resetAllParams();
        this.el.animator.removeAttribute("style");
        this.removeClass(this.el.container, 'slider-active');
    }

    hasClass(el, className) {
        return el.className.indexOf(className) > -1;
    }

    addClass(el, className) {
        el.className = el.className + ' ' + className + ' ';
    }

    removeClass(el, className) {
        const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }

    cloneObject(obj) {
        return this.extendObject({}, obj);
    }

    extendObject(obj, ...sources) {
        for (let i = 0; i < sources.length; i++) {
            let source = sources[i];
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    obj[key] = source[key];
                }
            }
        }
        return obj;
    }

    getActiveIndex() {
        let activeIndex = 0;
        const _isActive = (anchor) => {
            return this.hasClass(anchor, 'active');
        };
        const activeAnchors = Array.prototype.filter.call(this.el.anchors, _isActive);
        if (activeAnchors.length > 0) {
            const activeAnchor = activeAnchors[0];
            activeIndex = Array.prototype.slice.call(this.el.anchors).indexOf(activeAnchor);
        }
        this.params.activeIndex = activeIndex;
        return activeIndex;
    }

    on(target, type, callback) {
        const key = target._key || Math.random().toString(36).substring(7);
        target._key = key;
        if (!this.events.hasOwnProperty(key)) {
            this.events[key] = {};
        }
        if (!this.events[key].hasOwnProperty(type)) {
            this.events[key][type] = {
                target: target,
                listeners: [],
            };
        }
        const _listener = (event) => {
            event._key = key;
            event._target = target;
            callback.call(this, event);
        };
        this.events[key][type].listeners.push(_listener);
        target.addEventListener(type, _listener);
    }

    off(target, type = null) {
        const key = target._key;
        const _removeByType = (key, type) => {
            const target = this.events[key][type].target;
            const listeners = this.events[key][type].listeners;
            for (let i = 0; i < listeners.length; i++) {
                target.removeEventListener(type, listeners[i]);
                this.events[key][type].listeners.splice(i, 1);
            }
            if (this.events[key][type].listeners.length === 0) {
                delete this.events[key][type];
            }
            if (Object.keys(this.events[key]).length === 0) {
                delete this.events[key];
            }
        };
        if (this.events.hasOwnProperty(key)) {
            if (type) {
                _removeByType(key, type);
            } else {
                const events = this.events[key];
                for (let type in events) {
                    if (events.hasOwnProperty(type)) {
                        _removeByType(key, type);
                    }
                }
            }
        }
    }

    removeAllEvents() {
        for (let key in this.events) {
            if (this.events.hasOwnProperty(key)) {
                for (let type in this.events[key]) {
                    if (this.events[key].hasOwnProperty(type)) {
                        this.off(this.events[key][type].target, type);
                    }
                }
            }
        }
    }

    resetAllParams() {
        for (let key in this.params) {
            if (this.params.hasOwnProperty(key)) {
                this.params[key] = undefined;
            }
        }
    }

    activateLink(target) {
        this.deactivateLinks();
        this.addClass(target, 'active');
    }

    deactivateLinks() {
        for (let i = 0; i < this.el.anchors.length; i++) {
            this.removeClass(this.el.anchors.item(i), 'active');
        }
    }

    delayLocationChange(href) {
        const _setLocation = (href) => {
            if (this.params.isEasing) {
                this.delayLocationChange(href);
            } else {
                window.location.href = href;
            }
        };
        window.setTimeout(_setLocation.bind(this, href), 100);
    }

    preventDefault(event) {
        event.preventDefault();
        return false;
    }

    dispatchEvent(typeArg, customEventInit = {bubbles: false, cancelable: false, detail: null}) {
        const supported = 'CustomEvent' in window && typeof window.CustomEvent === 'function';
        if (!supported) {
            const CustomEvent = function (typeArg, customEventInit) {
                let event = document.createEvent("CustomEvent");
                event.initCustomEvent(typeArg, customEventInit.bubbles, customEventInit.cancelable, customEventInit.detail);
                return event;
            };
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        }
        const event = new window.CustomEvent(typeArg, customEventInit);
        this.el.container.dispatchEvent(event);
        return event;
    }

    bindEvents() {
        this.on(this.el.animator, 'dragstart', this.preventDefault);
        this.on(this.el.animator, 'touchstart', this.touchStart);
        this.on(this.el.animator, 'mousedown', this.touchStart);
        this.on(window, 'resize', this.resize);
        for (let i = 0; i < this.el.anchors.length; i++) {
            this.on(this.el.anchors.item(i), 'click', (event) => {
                this.preventDefault(event);
                if (this.params.isClick) {
                    this.activateLink(event._target);
                    this.getActiveIndex();
                    this.easeTowardsLink();
                    this.delayLocationChange(event._target.href);
                }
            });
        }
    }

    eventCoords(event) {
        const touchEvents = ['touchmove', 'touchstart', 'touchend'];
        const isTouchEvent = touchEvents.indexOf(event.type) > -1;
        if (isTouchEvent) {
            let touch = event.targetTouches[0] || event.changedTouches[0];
            return {
                x: touch.clientX,
                y: touch.clientY,
            };
        } else {
            return {
                x: event.clientX,
                y: event.clientY,
            };
        }
    }

    prefixed(style, property) {
        const prefixes = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
        let camelProp = property[0].toUpperCase() + property.slice(1);
        for (let i = 0; i < prefixes.length; i++) {
            let prefix = prefixes[i];
            let prop = prefix ? prefix + camelProp : property;
            if (prop in style) {
                return prop;
            }
            i++;
        }
        return undefined;
    }

    startTracking() {
        this.dispatchEvent("slider.startTracking");
        if (this.params.ticker) this.stopTracking();
        this.params.ticker = window.setInterval(this.track.bind(this), 100);
        this.on(document, 'touchmove', this.touchMove);
        this.on(document, 'mousemove', this.touchMove);
        this.on(document, 'touchend', this.touchEnd);
        this.on(document, 'mouseup', this.touchEnd);
    }

    stopTracking() {
        this.dispatchEvent("slider.stopTracking");
        window.clearInterval(this.params.ticker);
        delete this.params.ticker;
        this.off(document);
    }

    track() {
        const now = Date.now();
        const timeElapsed = now - this.params.lastTimestamp;
        const delta = this.params.posX - this.params.lastPosX;
        const v = 1000 * delta / (1 + timeElapsed);
        this.params.velocity = 0.8 * v + 0.2 * this.params.velocity;
        this.params.lastPosX = this.params.posX;
        this.params.lastTimestamp = now;
        this.dispatchEvent("slider.track", {
            bubbles: false,
            cancelable: false,
            detail: this.cloneObject(this.params),
        });
    }

    setPosition(posX) {
        if (this.params.posX !== posX) {
            const xMin = this.params.slideWidth * -(this.params.slideTotal - 1);
            const xMax = 0;
            let style = this.el.animator.style;
            let prefixed = this.prefixed(style, 'transform');
            this.params.posX = (posX > xMax) ? xMax : (posX < xMin) ? xMin : posX;
            this.params.hasMoved = true;
            style[prefixed] = 'translate(' + this.params.posX + 'px, 0)';
        }
    }

    getTargetPosition() {
        this.params.targetX = this.params.posX;
        if (this.params.velocity > 10 || this.params.velocity < -10) {
            this.params.amplitude = 0.8 * this.params.velocity;
            this.params.targetX = this.params.posX + this.params.amplitude;
        }
        const snap = this.params.slideWidth;
        this.params.targetX = Math.round(this.params.targetX / snap) * snap;
    }

    easePosition() {
        if (this.params.amplitude) {
            const timeConstant = 325;
            const timeElapsed = Date.now() - this.params.lastTimestamp;
            const delta = -this.params.amplitude * Math.exp(-timeElapsed / timeConstant);
            this.params.isEasing = delta > 5 || delta < -5;
            if (this.params.isEasing) {
                this.setPosition(this.params.targetX + delta);
                this.requestAnimation(this.easePosition);
            } else {
                this.setPosition(this.params.targetX);
                this.dispatchEvent("slider.easePositionEnd");
            }
        }
    }

    easeTowardsLink() {
        this.params.targetX = this.params.slideWidth * this.params.activeIndex * -1;
        this.params.amplitude = this.params.targetX - this.params.posX;
        this.requestAnimation(this.easePosition);
    }

    requestAnimation(callback) {
        callback = callback.bind(this);
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(callback);
        } else {
            window.setTimeout(callback, 10);
        }
    }

    resize() {
        this.params.slideWidth = this.el.slides.item(0).getBoundingClientRect().width;
        this.params.slideTotal = this.el.slides.length;
        this.el.animator.style.width = (this.params.slideWidth * this.params.slideTotal) + 'px';
        this.setPosition(this.params.slideWidth * this.params.activeIndex * -1);
    }

    touchStart(event) {
        this.params.velocity = 0;
        this.params.amplitude = 0;
        this.params.posX = this.params.posX || 0;
        this.params.lastPosX = this.params.posX;
        this.params.firstTimestamp = Date.now();
        this.params.lastTimestamp = this.params.firstTimestamp;
        this.params.lastTouchX = this.eventCoords(event).x;
        this.params.isClick = false;
        this.params.isEasing = false;
        this.params.hasMoved = false;
        this.startTracking();
    }

    touchMove(event) {
        const touchX = this.eventCoords(event).x;
        const delta = touchX - this.params.lastTouchX;
        if (delta > 2 || delta < -2) {
            this.params.lastTouchX = touchX;
            this.setPosition(this.params.posX + delta);
        }
    }

    touchEnd() {
        this.stopTracking();
        this.getTargetPosition();
        this.params.amplitude = this.params.targetX - this.params.posX;
        this.params.lastTimestamp = Date.now();
        this.requestAnimation(this.easePosition);
        // IE fires click events on drag/swipe release
        // ..so we need to decide if click behaviour should be honoured
        const timeElapsed = this.params.lastTimestamp - this.params.firstTimestamp;
        this.params.isClick = !this.params.hasMoved && timeElapsed < 300;
    }

};

if (typeof module === 'object' && module.exports) {
    module.exports = Slider;
}

if (typeof window !== "undefined") {
    window.Slider = Slider;
}
