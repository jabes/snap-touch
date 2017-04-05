'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(selector) {
        _classCallCheck(this, Slider);

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
            hasMoved: undefined
        };

        this.init();
    }

    _createClass(Slider, [{
        key: 'init',
        value: function init() {
            if (this.el.container && this.el.slides.length >= 0) {
                this.getActiveIndex();
                this.bindEvents();
                this.resize();
                this.addClass(this.el.container, 'slider-active');
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.removeAllEvents();
            this.resetAllParams();
            this.deactivateLinks();
            this.el.animator.removeAttribute("style");
            this.removeClass(this.el.container, 'slider-active');
        }
    }, {
        key: 'hasClass',
        value: function hasClass(el, className) {
            return el.className.indexOf(className) > -1;
        }
    }, {
        key: 'addClass',
        value: function addClass(el, className) {
            el.className = el.className + ' ' + className + ' ';
        }
    }, {
        key: 'removeClass',
        value: function removeClass(el, className) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }, {
        key: 'cloneObject',
        value: function cloneObject(obj) {
            return this.extendObject({}, obj);
        }
    }, {
        key: 'extendObject',
        value: function extendObject(obj) {
            for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                sources[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        obj[key] = source[key];
                    }
                }
            }
            return obj;
        }
    }, {
        key: 'getActiveIndex',
        value: function getActiveIndex() {
            var _this = this;

            var activeIndex = 0;
            var _isActive = function _isActive(anchor) {
                return _this.hasClass(anchor, 'active');
            };
            var activeAnchors = Array.prototype.filter.call(this.el.anchors, _isActive);
            if (activeAnchors.length > 0) {
                var activeAnchor = activeAnchors[0];
                activeIndex = Array.prototype.slice.call(this.el.anchors).indexOf(activeAnchor);
            }
            this.params.activeIndex = activeIndex;
            return activeIndex;
        }
    }, {
        key: 'on',
        value: function on(target, type, callback) {
            var _this2 = this;

            var key = target._key || Math.random().toString(36).substring(7);
            target._key = key;
            if (!this.events.hasOwnProperty(key)) {
                this.events[key] = {};
            }
            if (!this.events[key].hasOwnProperty(type)) {
                this.events[key][type] = {
                    target: target,
                    listeners: []
                };
            }
            var _listener = function _listener(event) {
                event._key = key;
                event._target = target;
                callback.call(_this2, event);
            };
            this.events[key][type].listeners.push(_listener);
            target.addEventListener(type, _listener);
        }
    }, {
        key: 'off',
        value: function off(target) {
            var _this3 = this;

            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var key = target._key;
            var _removeByType = function _removeByType(key, type) {
                var target = _this3.events[key][type].target;
                var listeners = _this3.events[key][type].listeners;
                for (var i = 0; i < listeners.length; i++) {
                    target.removeEventListener(type, listeners[i]);
                    _this3.events[key][type].listeners.splice(i, 1);
                }
                if (_this3.events[key][type].listeners.length === 0) {
                    delete _this3.events[key][type];
                }
                if (Object.keys(_this3.events[key]).length === 0) {
                    delete _this3.events[key];
                }
            };
            if (this.events.hasOwnProperty(key)) {
                if (type) {
                    _removeByType(key, type);
                } else {
                    var events = this.events[key];
                    for (var _type in events) {
                        if (events.hasOwnProperty(_type)) {
                            _removeByType(key, _type);
                        }
                    }
                }
            }
        }
    }, {
        key: 'removeAllEvents',
        value: function removeAllEvents() {
            for (var key in this.events) {
                if (this.events.hasOwnProperty(key)) {
                    for (var type in this.events[key]) {
                        if (this.events[key].hasOwnProperty(type)) {
                            this.off(this.events[key][type].target, type);
                        }
                    }
                }
            }
        }
    }, {
        key: 'resetAllParams',
        value: function resetAllParams() {
            for (var key in this.params) {
                if (this.params.hasOwnProperty(key)) {
                    this.params[key] = undefined;
                }
            }
        }
    }, {
        key: 'activateLink',
        value: function activateLink(target) {
            this.deactivateLinks();
            this.addClass(target, 'active');
        }
    }, {
        key: 'deactivateLinks',
        value: function deactivateLinks() {
            for (var i = 0; i < this.el.anchors.length; i++) {
                this.removeClass(this.el.anchors.item(i), 'active');
            }
        }
    }, {
        key: 'delayLocationChange',
        value: function delayLocationChange(href) {
            var _this4 = this;

            var _setLocation = function _setLocation(href) {
                if (_this4.params.isEasing) {
                    _this4.delayLocationChange(href);
                } else {
                    window.location.href = href;
                }
            };
            window.setTimeout(_setLocation.bind(this, href), 100);
        }
    }, {
        key: 'preventDefault',
        value: function preventDefault(event) {
            event.preventDefault();
            return false;
        }
    }, {
        key: 'dispatchEvent',
        value: function dispatchEvent(typeArg) {
            var customEventInit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { bubbles: false, cancelable: false, detail: null };

            var supported = 'CustomEvent' in window && typeof window.CustomEvent === 'function';
            if (!supported) {
                var CustomEvent = function CustomEvent(typeArg, customEventInit) {
                    var event = document.createEvent("CustomEvent");
                    event.initCustomEvent(typeArg, customEventInit.bubbles, customEventInit.cancelable, customEventInit.detail);
                    return event;
                };
                CustomEvent.prototype = window.Event.prototype;
                window.CustomEvent = CustomEvent;
            }
            var event = new window.CustomEvent(typeArg, customEventInit);
            this.el.container.dispatchEvent(event);
            return event;
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this5 = this;

            this.on(this.el.animator, 'dragstart', this.preventDefault);
            this.on(this.el.animator, 'touchstart', this.touchStart);
            this.on(this.el.animator, 'mousedown', this.touchStart);
            this.on(window, 'resize', this.resize);
            for (var i = 0; i < this.el.anchors.length; i++) {
                this.on(this.el.anchors.item(i), 'click', function (event) {
                    _this5.preventDefault(event);
                    if (_this5.params.isClick) {
                        _this5.activateLink(event._target);
                        _this5.getActiveIndex();
                        _this5.easeTowardsLink();
                        _this5.delayLocationChange(event._target.href);
                    }
                });
            }
        }
    }, {
        key: 'eventCoords',
        value: function eventCoords(event) {
            var touchEvents = ['touchmove', 'touchstart', 'touchend'];
            var isTouchEvent = touchEvents.indexOf(event.type) > -1;
            if (isTouchEvent) {
                var touch = event.targetTouches[0] || event.changedTouches[0];
                return {
                    x: touch.clientX,
                    y: touch.clientY
                };
            } else {
                return {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        }
    }, {
        key: 'prefixed',
        value: function prefixed(style, property) {
            var prefixes = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
            var camelProp = property[0].toUpperCase() + property.slice(1);
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                var prop = prefix ? prefix + camelProp : property;
                if (prop in style) {
                    return prop;
                }
                i++;
            }
            return undefined;
        }
    }, {
        key: 'startTracking',
        value: function startTracking() {
            this.dispatchEvent("slider.startTracking");
            if (this.params.ticker) this.stopTracking();
            this.params.ticker = window.setInterval(this.track.bind(this), 100);
            this.on(document, 'touchmove', this.touchMove);
            this.on(document, 'mousemove', this.touchMove);
            this.on(document, 'touchend', this.touchEnd);
            this.on(document, 'mouseup', this.touchEnd);
        }
    }, {
        key: 'stopTracking',
        value: function stopTracking() {
            this.dispatchEvent("slider.stopTracking");
            window.clearInterval(this.params.ticker);
            delete this.params.ticker;
            this.off(document);
        }
    }, {
        key: 'track',
        value: function track() {
            var now = Date.now();
            var timeElapsed = now - this.params.lastTimestamp;
            var delta = this.params.posX - this.params.lastPosX;
            var v = 1000 * delta / (1 + timeElapsed);
            this.params.velocity = 0.8 * v + 0.2 * this.params.velocity;
            this.params.lastPosX = this.params.posX;
            this.params.lastTimestamp = now;
            this.dispatchEvent("slider.track", {
                bubbles: false,
                cancelable: false,
                detail: this.cloneObject(this.params)
            });
        }
    }, {
        key: 'setPosition',
        value: function setPosition(posX) {
            if (this.params.posX !== posX) {
                var xMin = this.params.slideWidth * -(this.params.slideTotal - 1);
                var xMax = 0;
                var style = this.el.animator.style;
                var prefixed = this.prefixed(style, 'transform');
                this.params.posX = posX > xMax ? xMax : posX < xMin ? xMin : posX;
                this.params.hasMoved = true;
                style[prefixed] = 'translate(' + this.params.posX + 'px, 0)';
            }
        }
    }, {
        key: 'getTargetPosition',
        value: function getTargetPosition() {
            this.params.targetX = this.params.posX;
            if (this.params.velocity > 10 || this.params.velocity < -10) {
                this.params.amplitude = 0.8 * this.params.velocity;
                this.params.targetX = this.params.posX + this.params.amplitude;
            }
            var snap = this.params.slideWidth;
            this.params.targetX = Math.round(this.params.targetX / snap) * snap;
        }
    }, {
        key: 'easePosition',
        value: function easePosition() {
            if (this.params.amplitude) {
                var timeConstant = 325;
                var timeElapsed = Date.now() - this.params.lastTimestamp;
                var delta = -this.params.amplitude * Math.exp(-timeElapsed / timeConstant);
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
    }, {
        key: 'easeTowardsLink',
        value: function easeTowardsLink() {
            this.params.targetX = this.params.slideWidth * this.params.activeIndex * -1;
            this.params.amplitude = this.params.targetX - this.params.posX;
            this.requestAnimation(this.easePosition);
        }
    }, {
        key: 'requestAnimation',
        value: function requestAnimation(callback) {
            callback = callback.bind(this);
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(callback);
            } else {
                window.setTimeout(callback, 10);
            }
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.params.slideWidth = this.el.slides.item(0).getBoundingClientRect().width;
            this.params.slideTotal = this.el.slides.length;
            this.el.animator.style.width = this.params.slideWidth * this.params.slideTotal + 'px';
            this.setPosition(this.params.slideWidth * this.params.activeIndex * -1);
        }
    }, {
        key: 'touchStart',
        value: function touchStart(event) {
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
    }, {
        key: 'touchMove',
        value: function touchMove(event) {
            var touchX = this.eventCoords(event).x;
            var delta = touchX - this.params.lastTouchX;
            if (delta > 2 || delta < -2) {
                this.params.lastTouchX = touchX;
                this.setPosition(this.params.posX + delta);
            }
        }
    }, {
        key: 'touchEnd',
        value: function touchEnd() {
            this.stopTracking();
            this.getTargetPosition();
            this.params.amplitude = this.params.targetX - this.params.posX;
            this.params.lastTimestamp = Date.now();
            this.requestAnimation(this.easePosition);
            // IE fires click events on drag/swipe release
            // ..so we need to decide if click behaviour should be honoured
            var timeElapsed = this.params.lastTimestamp - this.params.firstTimestamp;
            this.params.isClick = !this.params.hasMoved && timeElapsed < 300;
        }
    }]);

    return Slider;
}();

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = Slider;
}

if (typeof window !== "undefined") {
    window.Slider = Slider;
}