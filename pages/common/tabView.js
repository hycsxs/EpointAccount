/*
 * @Author: 吴松泽
 * @Date: 2018-07-24 11:20:13
 * @Last Modified by: 吴松泽
 * @Last Modified time: 2019-05-07 17:51:36
 * @Description:  待办详情滑动组件
 */

(function (exports, doc, win) {
    'use strict';
    /**
     * 使用
     * @constructor
     * @param {JSON} options 一些配置
     * container - 容器dom元素 必填
     */
    function tabView(options) {
        var self = this;

        if (!options) {
            throw new Error('请传入配置项');
        }
        var container = options.container;
        var isSwipe = options.isSwipe || '1';

        if (!(container.nodeType === 1)) {
            container = document.querySelector(container);
        }
        // self.bodyEle = container.querySelector('[data-role=body]');
        // tab按钮父元素
        self.TABBTNRENTNODE = document.querySelector('.em-nav');
        // 每一个tab按钮宽度
        self.TABBTNWIDTH = document.querySelector('.em-nav a').offsetWidth;
        // tab按钮下划线
        self.TABLINENODE = document.querySelector('#topNavLine');
        // tab按钮下划线宽度
        self.TABLINEWIDTH = self.TABLINENODE.offsetWidth;

        // alert(TABLINEWIDTH)
        // tabview父元素
        self.TABVIEWPARENTNODE = document.querySelector('.em-tab-view');
        // 每个tabview宽度
        self.TABVIEWWIDTH = document.querySelector('.em-tab-item').offsetWidth;

        self.MESSAGEITEMGUID = Util.getExtraDataByKey('messageitemguid') || '';
        self.TYPE = Util.getExtraDataByKey('type') || '';
        var currentPostion = 0;

        // self._setBodyStyle(self.bodyEle);
        if (isSwipe == 1) {
            self._screenMove();
        }
        // tab点击切换、
        self._changeTab();
    }
    /*
     * 原型
     */
    tabView.prototype = {
        _screenMove: function () {
            this.currentPostion = this.currentPostion || 0; // 滑动初始位置

            var that = this,
                dom = document.querySelector('.em-main'),
                initialPos,
                elBody = this.TABVIEWPARENTNODE,
                maxWidth = this.TABVIEWWIDTH * (this.TABVIEWPARENTNODE.children.length - 1),
                moveLen = 0, // 移动距离
                direction = 'left', // 滑动方向
                isMove = false, // 是否发生左右滑动
                upDownMove = false,
                xtrue = [],
                startX,
                startY;

            // 按下
            dom.addEventListener('touchstart', function (e) {
                var touches = e.touches[0];

                startX = touches.pageX;
                startY = touches.pageY;
                initialPos = that.currentPostion;
                // console.log('initialPos:' + initialPos);
                elBody.style.webkitTransition = 'all 0s';
                isMove = false;
            });

            // 滑动
            dom.addEventListener('touchmove', this._throttle(function (e) {
                e.preventDefault();

                var touches = e.touches[0],
                    pageX = touches.pageX,
                    pageY = touches.pageY;

                var deltaX = pageX - startX,
                    deltaY = pageY - startY;

                // 如果X方向上的的位移距离大于Y方向，则代表滑动
                if (Math.abs(deltaX) > Math.abs(deltaY) && upDownMove != true) {
                    e.preventDefault();
                    moveLen = deltaX;
                    var translate = initialPos + deltaX;
                    var t = /(-?\d+)(\.\d+)?px/g;


                    var realyX = that.TABVIEWPARENTNODE.style.webkitTransform.match(t);

                    try {
                        // 实际DOM偏移距离
                        realyX = realyX[0].replace('px', '');
                        // console.log('realyX:' + realyX);
                    } catch (error) {

                    }
                    xtrue.push(deltaX);
                    if (xtrue.length > 2) {
                        xtrue.shift();
                    }
                    // console.log(xtrue[0] - xtrue[1]);

                    // 左右方向
                    direction = xtrue[0] - xtrue[1] < 0 ? 'right' : 'left';
                    // 超出边距
                    if (realyX <= 0 && realyX >= -maxWidth) {
                        if (translate <= 0 && translate >= -maxWidth) {
                            that._transfrom(elBody, translate);
                            isMove = true;
                        } else {
                            that._transfrom(elBody, deltaX > 0 ? 0 : -maxWidth);
                            isMove = true;
                        }
                    }
                } else {
                    // 上下滑动时禁止左右滑动
                    upDownMove = true;

                }
            }, 12, true));
            // 移开屏幕
            dom.addEventListener('touchend', this._debounce(function (e) {

                var translate = 0,
                    // 移动赋值距离
                    currentPosition = that.currentPostion,
                    // 页面宽度
                    pageWidth = that.TABVIEWWIDTH;

                upDownMove = false;
                elBody.style.webkitTransition = '.5s transform';

                if (isMove) {

                    translate = direction == 'left' ?
                        currentPosition - (pageWidth + moveLen) : currentPosition + pageWidth - moveLen;

                    if (translate > 0) {
                        translate = 0;
                    }
                    if (translate < -maxWidth) {
                        translate = -maxWidth;
                    }
                    var index = Math.abs(that.currentPostion) / Math.abs(pageWidth);

                    // 页面滑动超过0.5，切换
                    if (direction == 'left') {
                        index += 0.35
                    } else {
                        index -= 0.35
                    }
                    // console.log('index:' + index);
                    // console.log(pageWidth);
                    // 改用屏宽*index来决定释放后的tab位置，解决页面停在中间问题
                    that._transfrom(elBody, -pageWidth * Math.round(index));

                    that._switchHead(Math.round(index) + 1);
                }


            }, 16));
        },
        /**
         * 平滑移动
         * @param {HTMLElement} dom 移动的元素
         * @param {Number} translate 移动的距离
         * @param {Number} isLineNode 是否是导航NODE移动
         */
        _transfrom: function (dom, translate, isLineNode) {
            dom.style.webkitTransform = 'translate3d(' + translate + 'px,0,0)';
            if (isLineNode != true) {
                this.currentPostion = translate;
            }

        },
        /**
         * 防抖
         * @param {Function} doSomething 执行函数
         * @param {Number} wait 防抖时间
         * @param {Number} isImmediate 是否初次执行
         * @return {Function} 闭包主体
         */
        _debounce: function (doSomething, wait, isImmediate) {
            var timeout; // 需要一个外部变量，为增强封装，所以使用闭包

            return function () {
                var _this = this,
                    _arguments = arguments; // arguments中存着e

                clearTimeout(timeout);
                if (isImmediate) {
                    var isTrigger = !timeout;

                    timeout = setTimeout(function () {
                        timeout = null;
                    }, wait);
                    isTrigger && doSomething.apply(_this, _arguments);
                } else {
                    timeout = setTimeout(function () {
                        doSomething.apply(_this, _arguments);
                    }, wait);
                }
            };
        },
        /**
         * 节流
         * @param {Function} doSomething 执行函数
         * @param {Number} wait 节流时间
         * @return {Function} 闭包主体
         */
        _throttle: function (doSomething, wait) {
            var timeout,
                _this,
                _arguments,
                previous = 0;

            var later = function () {
                previous = +new Date();
                timeout = null;
                doSomething.apply(_this, _arguments);
            };
            var throttled = function () {
                var now = +new Date();
                // 下次触发 doSomething 剩余的时间
                var remaining = wait - (now - previous),
                    _this = this;

                _arguments = arguments;
                // 如果没有剩余的时间了
                if (remaining <= 0) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    doSomething.apply(_this, _arguments);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
            };

            return throttled;
        },
        /**
         * tab按钮点击事件
         */
        _changeTab: function () {
            var self = this;

            setTimeout(function () {
                self.TABBTNWIDTH = document.querySelector('.em-nav a').offsetWidth;
                self.TABLINENODE = document.querySelector('#topNavLine');
                // 设置tab下划线初始位置
                var initPosition = (self.TABBTNWIDTH - self.TABLINEWIDTH) / 2;

                // 初始化下划线
                self.TABLINENODE.style.webkitTransform = 'translate3d(' + initPosition + 'px, 0px, 0px)';
                setTimeout(function () {
                    self.TABLINENODE.style.opacity = '1';
                }, 300);

                // tab点击
                mui('.em-nav').on('tap', 'a', function () {
                    // 切换下划线
                    // 当前点击按钮距离屏幕左侧距离
                    var leftRect = this.getBoundingClientRect().left;
                    var initPositionNew = initPosition + leftRect;

                    // 赋值距离
                    self.TABLINENODE.style.webkitTransform = 'translate3d(' + initPositionNew + 'px, 0px, 0px)';

                    // 初始左偏移
                    var initViewLeft = 0;
                    var index = Zepto(this).index();

                    self._transfrom(self.TABVIEWPARENTNODE, -(initViewLeft + self.TABVIEWWIDTH * index));
                    // TABVIEWPARENTNODE.style.webkitTransform = 'translate3d(-' + initViewLeft + TABVIEWWIDTH * index + 'px, 0px, 0px)';
                });
            }, 200);

        },
        /**
         * 头部切换
         * @param {Number} index 索引值
         */
        _switchHead: function (index) {
            var self = this;
            var initPosition = (self.TABBTNWIDTH - self.TABLINEWIDTH) / 2;

            self._transfrom(self.TABLINENODE, initPosition + (self.TABBTNWIDTH * (index - 1)), true);
        },
        /**
         * 设置em-body样式
         * @param {HTMLElement} bodyEle em-body元素
         */
        _setBodyStyle: function (bodyEle) {
            var bodyChildEle = bodyEle.children,
                moveWidth = bodyChildEle.length * 100;

            bodyEle.style.cssText = 'display: flex; width: ' + moveWidth + '%; overflow: hidden; transform: translate3d(0, 0, 0);';

            for (var i = 0, len = bodyChildEle.length; i < len; i++) {
                bodyChildEle[i].style.width = '100%';
            }
        },

    };
    win.tabView = tabView;
}({}, document, window));