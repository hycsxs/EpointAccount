/*!
 * @epoint-mrc/ejsv4 v4.1.2
 * (c) 2017-2022 
 * Released under the BSD-3-Clause License.
 * 
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ejs = factory());
})(this, (function () { 'use strict';

    /**
     * 加入系统判断功能
     * @param {Object} hybrid hybrid对象
     */
    function osMixin(hybrid) {
      var hybridJs = hybrid;

      var detect = function detect(ua) {
        this.os = {};
        var android = ua.match(/(Android);?[\s/]+([\d.]+)?/);

        if (android) {
          this.os.android = true;
          this.os.version = android[2];
          this.os.isBadAndroid = !/Chrome\/\d/.test(ua);
        }

        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);

        if (iphone) {
          this.os.ios = true;
          this.os.iphone = true;
          this.os.version = iphone[2].replace(/_/g, '.');
        }

        var mac = ua.match(/Mac/i);

        if (mac) {
          this.os.ios = true;
        }

        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

        if (ipad) {
          this.os.ios = true;
          this.os.ipad = true;
          this.os.version = ipad[2].replace(/_/g, '.');
        }

        var isFireFox = /Firefox/.test(ua);
        var isTablet = /(iPad|PlayBook)/.test(ua) || android && !/Mobile/.test(ua) || isFireFox && /Tablet/.test(ua);

        if (isTablet) {
          this.os.isTablet = true;
        } // epoint的容器


        var ejs = ua.match(/EpointEJS/i);

        if (ejs) {
          this.os.ejs = true;
        } // epoint小程序容器


        var miniH5 = ua.match(/EpointMiniH5/i);

        if (miniH5) {
          this.os.ejs = true;
          this.os.miniH5 = true;
        } // 卡片加载环境是否是原生门户


        var primordial = ua.match(/primordial/i);

        if (primordial) {
          this.os.ejs = true;
          this.os.ejsCard = true;
        }

        var dd = ua.match(/DingTalk/i);

        if (dd) {
          this.os.dd = true;
        } // 政务微信容器


        var wxWorkLocal = ua.match(/wxworklocal/i);

        if (wxWorkLocal) {
          this.os.wxWorkLocal = true;
        } // 企业微信容器


        var wxWork = ua.match(/wxwork/i);

        if (!wxWorkLocal && wxWork) {
          this.os.wxWork = true;
        } // 微信容器


        var wechat = ua.match(/MicroMessenger/i);

        if (!wxWork && !wxWorkLocal && wechat) {
          this.os.wechat = true;
        } // welink容器


        var welink = ua.match(/welink/i);
        var cloudlink = ua.match(/cloudlink/i);

        if (welink || cloudlink) {
          this.os.welink = true;
        } // 讯盟容器


        var xm = ua.match(/hwminiapp/i);

        if (xm) {
          this.os.xm = true;
        } // 政务钉钉容器


        var ddGov = ua.match(/mPaaSClient/i);

        if (!dd && !wxWorkLocal && !wxWork && !wechat && !welink && !cloudlink && !xm && ddGov) {
          this.os.ddGov = true;
        } // 支付宝容器


        var alipay = ua.match(/alipay/i);

        if (!ddGov && alipay) {
          this.os.alipay = true;
        } // 如果ejs和钉钉都不是，则默认为h5


        if (!ejs && !dd) {
          this.os.h5 = true; // this.os.xm = true;
        }
      };

      detect.call(hybridJs, navigator.userAgent);
    }

    /**
     * 不用polyfill，避免体积增大
     * @param {Object} hybrid hybrid对象
     */
    function promiseMixin(hybrid) {
      var hybridJs = hybrid; // 暂时去除默认的promise支持，防止普通开发人员不会使用导致报错无法补货

      hybridJs.Promise = window.Promise;

      hybridJs.getPromise = function () {
        return hybridJs.Promise;
      };

      hybridJs.setPromise = function (newPromise) {
        hybridJs.Promise = newPromise;
      };
    }

    var globalError = {
      /**
       * 1001 api os错误
       */
      ERROR_TYPE_APIOS: {
        code: 1001,
        // 这个只是默认的提示，如果没有新的提示，就会采用默认的提示
        msg: '该API无法在当前OS下运行'
      },

      /**
       * 1002 api modify错误
       */
      ERROR_TYPE_APIMODIFY: {
        code: 1002,
        msg: '不允许更改JSSDK的API'
      },

      /**
       * 1003 module modify错误
       */
      ERROR_TYPE_MODULEMODIFY: {
        code: 1003,
        msg: '不允许更改JSSDK的模块'
      },

      /**
       * 1004 api 不存在
       */
      ERROR_TYPE_APINOTEXIST: {
        code: 1004,
        msg: '调用了不存在的api'
      },

      /**
       * 1005 组件api对应的proto不存在
       */
      ERROR_TYPE_PROTONOTEXIST: {
        code: 1005,
        msg: '调用错误，该组件api对应的proto不存在'
      },

      /**
       * 1006 非容器环境下无法调用自定义组件API
       */
      ERROR_TYPE_CUSTOMEAPINOTEXIST: {
        code: 1006,
        msg: '非容器下无法调用自定义组件API'
      },

      /**
       * 1007 对应的event事件在该环境下不存在
       */
      ERROR_TYPE_EVENTNOTEXIST: {
        code: 1007,
        msg: '对应的event事件在该环境下不存在'
      },

      /**
       * 1008 对应的event事件在该环境下不存在
       */
      ERROR_TYPE_INITVERSIONERROR: {
        code: 1008,
        msg: '初始化版本号错误，请检查容器api的实现情况'
      },

      /**
       * 1009 当前容器版本不支持API
       */
      ERROR_TYPE_APINEEDHIGHNATIVEVERSION: {
        code: 1009,
        msg: '当前API需要更高版本的容器支持'
      },

      /**
       * 2001 ready modify错误-ready回调正常只允许定义一个
       */
      ERROR_TYPE_READYMODIFY: {
        code: 2001,
        msg: 'ready回调不允许多次设置'
      },

      /**
       * 2002 config modify错误-正常一个页面只允许config一次
       */
      ERROR_TYPE_CONFIGMODIFY: {
        code: 2002,
        msg: 'config不允许多次调用'
      },

      /**
       * 2003 config 错误
       */
      ERROR_TYPE_CONFIGERROR: {
        code: 2003,
        msg: 'config校验错误'
      },

      /**
       * 2004 version not support
       */
      ERROR_TYPE_VERSIONNOTSUPPORT: {
        code: 2004,
        msg: '不支持当前容器版本，请确保容器与前端库版本匹配'
      },

      /**
       * 2004 version not support
       */
      ERROR_TYPE_VERSIONNEEDUPGRADE: {
        code: 2005,
        msg: '当前JSSDK库小于容器版本，请将前端库升级到最新版本'
      },

      /**
       * 3000 原生错误(非API错误)，原生捕获到的错误都会通知J5
       */
      ERROR_TYPE_NATIVE: {
        code: 3000,
        msg: '捕获到一处原生容器错误'
      },

      /**
       * 3001 原生调用h5错误  原生通过JSBridge调用h5错误，可能是参数不对
       */
      ERROR_TYPE_NATIVECALL: {
        code: 3001,
        msg: '原生调用H5时参数不对'
      },

      /**
       * 9999 其它未知错误
       */
      ERROR_TYPE_UNKNOWN: {
        code: 9999,
        msg: '未知错误'
      }
    };

    function warn(msg) {
      // 模板字符串
      console.error("[hybridJs error]: ".concat(msg));
    }
    function log(msg) {
      console.log("[hybridJs log]: ".concat(msg));
    }

    function errorMixin(hybrid) {
      var hybridJs = hybrid;
      var errorFunc;
      /**
       * 提示全局错误
       * @param {Nunber} code 错误代码
       * @param {String} msg 错误提示
       */

      function showError() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '错误!';
        warn("code:".concat(code, ", msg:").concat(msg));
        errorFunc && errorFunc({
          code: code,
          message: msg
        });
      }

      hybridJs.showError = showError;
      hybridJs.globalError = globalError;
      /**
       * 当出现错误时，会通过这个函数回调给开发者，可以拿到里面的提示信息
       * @param {Function} callback 开发者设置的回调(每次会监听一个全局error函数)
       * 回调的参数好似
       * msg 错误信息
       * code 错误码
       */

      hybridJs.error = function error(callback) {
        errorFunc = callback; // 兼容钉钉

        if (hybridJs.os.dd) {
          window.dd && dd.error(errorFunc);
        }
      };
    }

    // 返回一个当前时刻的毫秒数，用于获取一个时间戳

    function isObject(object) {
      var classType = Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
      return classType !== 'String' && classType !== 'Number' && classType !== 'Boolean' && classType !== 'Undefined' && classType !== 'Null';
    }
    var noop = function noop() {}; // 对象拓展，且覆盖目标对象的相同的key, 后面的覆盖前面的

    function extend(target) {
      if (!isObject(target)) {
        throw new Error('extend请传对象');
      }

      var finalTarget = target;

      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      rest.forEach(function (source) {
        source && Object.keys(source).forEach(function (key) {
          finalTarget[key] = source[key];
        });
      });
      return finalTarget;
    }
    /**
     * 如果version1大于version2，返回1，如果小于，返回-1，否则返回0。 TODO
     * 增加可以比较字母 2019年12月6日 14:45:59 wsz
     * @param {string} version1 版本1
     * @param {string} version2 版本2
     * @return {number} 返回版本1和版本2的关系
     */

    function compareVersion(version1, version2) {
      if (typeof version1 !== 'string' || typeof version2 !== 'string') {
        throw new Error('版本号应该是一个字符串');
      } // 非数字字符转换


      var getCharCode = function getCharCode(char) {
        return char.replace(/[a-zA-Z]/g, function (match) {
          return match.charCodeAt();
        }).replace(/[^\d]/g, '') - 0;
      }; // 判断版本号每个连字符之间字符大小


      var compareChar = function compareChar(char1, char2, hyphen, islong) {
        // 连字符情况
        var charArray1 = char1.split(hyphen);
        var charArray2 = char2.split(hyphen);

        for (var j = 0; j < charArray1.length; j += 1) {
          if (!charArray2[j]) {
            // 前几位都相同的情况下，char2比char1短
            // islong为true时，谁长谁大
            return islong ? 1 : -1;
          }

          if (charArray1[j].match(/-/) || charArray2[j].match(/-/)) {
            // 如果有连字符，判断字符大小
            return compareChar(charArray1[j], charArray2[j], '-', true);
          }

          if (getCharCode(charArray1[j]) > getCharCode(charArray2[j])) {
            return 1;
          } else if (getCharCode(charArray1[j]) < getCharCode(charArray2[j])) {
            return -1;
          }
        }

        if (charArray1.length === charArray2.length) {
          // 若跳出循环时，两者长度相同，表明两者相等
          return 0;
        } // 若跳出循环时，char2比char1长
        // islong为true时，谁长谁大


        return islong ? -1 : 1;
      };

      return compareChar(version1, version2, '.', true);
    }
    /**
     * 字符串超出截取
     * @param {string} str 目标字符串
     * @param {Number} count 字数，以英文为基数，如果是中文，会自动除2
     * @return {string} 返回截取后的字符串
     * 暂时不考虑只遍历一部分的性能问题，因为在应用场景内是微不足道的
     */

    function eclipseText() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      var LEN_CHINESE = 2;
      var LEN_ENGLISH = 1;
      var num = 0;
      return str.split('').filter(function (ch) {
        num += /[\u4e00-\u9fa5]/.test(ch) ? LEN_CHINESE : LEN_ENGLISH;
        return num <= count;
      }).join('');
    }
    /**
     * 得到一个项目的根路径
     * h5模式下例如:http://id:端口/项目名/
     * @return {String} 项目的根路径，返回'http://id:端口/项目名/'或'http://id:端口/'
     */

    function getProjectBasePath() {
      var locObj = window.location;
      var patehName = locObj.pathname;
      var pathArray = patehName.split('/'); // 如果是 host/xxx.html 则是/，如果是host/project/xxx.html,则是project/
      // pathName一般是 /context.html 或 /xxx/xx/content.html

      var hasProject = pathArray.length > 2;
      var contextPath = "".concat(pathArray[Number(hasProject)], "/"); // 如果尾部有两个//替换成一个

      return "".concat(locObj.protocol, "//").concat(locObj.host, "/").concat(contextPath).replace(/[/]{2}$/, '/');
    }
    /**
     * 将相对路径转为绝对路径 ./ ../ 开头的  为相对路径
     * 会基于对应调用js的html路径去计算
     * @param {String} path 需要转换的路径
     * @return {String} 返回转换后的路径
     */

    function changeRelativePathToAbsolute(path) {
      if (!path) {
        throw new Error('changeRelativePathToAbsolute传参不为空');
      }

      var isAbsolute = !path.match(/(^\.\.\/)|(^\.\/)/g);

      if (isAbsolute) {
        return "".concat(getProjectBasePath()).concat(path.substring(0, 1) === '/' ? path.substring(1) : path);
      }

      var locObj = window.location;
      var patehName = locObj.pathname; // 匹配相对路径返回父级的个数

      var relatives = path.match(/\.\.\//g);
      var count = relatives && relatives.length || 0; // 将patehName拆为数组，然后计算当前的父路径，需要去掉相应相对路径的层级

      var pathArray = patehName.split('/');
      var parentPath = pathArray.slice(0, pathArray.length - (count + 1)).join('/');
      var childPath = path.replace(/\.+\//g, ''); // 找到最后的路径， 通过正则 去除 ./ 之前的所有路径

      var finalPath = "".concat(parentPath, "/").concat(childPath);
      finalPath = "".concat(locObj.protocol, "//").concat(locObj.host).concat(finalPath);
      return finalPath;
    }
    /**
     * 得到一个全路径
     * @param {String} path 路径
     * @return {String} 返回最终的路径
     */

    function getFullPath() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      // 全路径
      if (/^(http|https|ftp|epth|h5|file|\/\/)/g.test(path)) {
        return path;
      } // 是否是相对路径


      var isRelative = /(\.\/)|(\.\.\/)/.test(path);

      if (isRelative) {
        return changeRelativePathToAbsolute(path);
      }

      return "".concat(getProjectBasePath()).concat(path.substring(0, 1) === '/' ? path.substring(1) : path);
    }
    /**
     * 将json参数拼接到url中
     * @param {String} url url地址
     * @param {Object} data 需要添加的json数据
     * @param {Boolean} type 是否相对路径
     * @return {String} 返回最终的url
     */

    function getFullUrlByParams() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments.length > 1 ? arguments[1] : undefined;
      var type = arguments.length > 2 ? arguments[2] : undefined;
      var fullUrl = type === true ? url : getFullPath(url);
      var extrasDataStr = '';

      if (data) {
        Object.keys(data).forEach(function (item) {
          if (extrasDataStr.indexOf('?') === -1 && fullUrl.indexOf('?') === -1) {
            extrasDataStr += '?';
          } else {
            extrasDataStr += '&';
          }

          extrasDataStr += "".concat(item, "=").concat(data[item]);
        });
      }

      fullUrl += extrasDataStr;
      return fullUrl;
    }
    /**
     * 获取 base64 去除 url 部分
     * @param {String} base64 base64值
     * @returns {String} 该 base64 去除 url 后的值
     */

    function getBase64NotUrl() {
      var base64 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return base64.replace(/^data.*,/, '');
    }
    /**
     * 产生一个 唯一uuid，默认为32位的随机字符串，8-4-4-4-12 格式
     * @param {Object} options 配置項
     * len 默认为32位（包括连字符），最大不能超过36，最小不能小于4
     * radix 随机的基数，如果小于等于10代表只用纯数字，最大为62，最小为2，默认为62
     * type 类别，默认为default代表 8-4-4-4-12的模式，如果为 其他（不为空） 代表不会有连线
     * @returns {String} uuid
     */

    function uuid(options) {
      var option = options || {};
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var innerUuid = [];
      var i;
      var radix = option.radix || chars.length;
      var len = option.len || 32;
      var type = option.type || 'default';
      len = Math.min(len, 36);
      len = Math.max(len, 4);
      radix = Math.min(radix, 62);
      radix = Math.max(radix, 2);

      if (len) {
        for (i = 0; i < len; i += 1) {
          // eslint-disable-next-line no-bitwise
          innerUuid[i] = chars[0 | Math.random() * radix];
        }

        if (type === 'default') {
          len > 23 && (innerUuid[23] = '-');
          len > 18 && (innerUuid[18] = '-');
          len > 13 && (innerUuid[13] = '-');
          len > 8 && (innerUuid[8] = '-');
        }
      }

      return innerUuid.join('');
    }

    /**
     * 依赖于以下的基础库
     * Promise
     * @param {Object} hybrid hybrid对象
     */

    function proxyMixin(hybrid) {
      var hybridJs = hybrid;
      var globalError = hybridJs.globalError;
      /**
       * 对所有的API进行统一参数预处理，promise逻辑支持等操作
       * @param {Object} api 对应的API
       * @param {Function} callback 回调
       * @constructor
       */

      function Proxy(api, callback) {
        this.api = api;
        this.callback = callback;
      }
      /**
       * 实际的代理操作
       * @param {Object} hy hybrid对象
       * @return {Function} hybrid finallyCallback
       */


      Proxy.prototype.walk = function walk(hy) {
        var _this = this;

        // 实时获取promise
        var Promise = hybridJs.getPromise(); // 返回一个闭包函数

        return function () {
          for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }

          var args = rest;
          args[0] = args[0] || {}; // 默认参数的处理

          if (_this.api.defaultParams && args[0] instanceof Object) {
            Object.keys(_this.api.defaultParams).forEach(function (item) {
              if (args[0][item] === undefined) {
                args[0][item] = _this.api.defaultParams[item];
              }
            });
          } // 决定是否使用Promise


          var finallyCallback;

          if (_this.callback) {
            // 将this指针修正为proxy内部，方便直接使用一些api关键参数
            finallyCallback = _this.callback;
          }

          if (_this.api.support && hybridJs.nativeVersion && compareVersion(hybridJs.nativeVersion, _this.api.support) < 0) {
            // 如果当前版本还不支持API
            // 实际上也可以在原生容器进行检测，这里由于遗留问题，改为前端进行
            var msg = "".concat(_this.api.namespace, "\u8981\u6C42\u7684\u5BB9\u5668EJS\u7248\u672C\u81F3\u5C11\u4E3A:").concat(_this.api.support, "\uFF0C\u5F53\u524D\u5BB9\u5668EJS\u7248\u672C\uFF1A").concat(hybridJs.nativeVersion, "\uFF0C\u8BF7\u5347\u7EA7");
            var errorTips = {
              code: globalError.ERROR_TYPE_APINEEDHIGHNATIVEVERSION.code,
              msg: msg
            };

            if (hy.ui && typeof hy.ui.toast === 'function') {
              hy.ui.toast(msg);
            } // 不满足要求，直接走错误回调，内部走错误


            finallyCallback = function finallyCallback() {
              var len = arguments.length;
              var options = arguments.length <= 0 ? undefined : arguments[0];
              var reject;

              if (Promise) {
                reject = len - 1 < 0 || arguments.length <= len - 1 ? undefined : arguments[len - 1];
              } // 如果存在错误回调


              options.error && options.error(errorTips);
              reject && reject(errorTips);
            };
          }

          if (!finallyCallback) {
            // 如果没有实现
            finallyCallback = function finallyCallback() {
              var len = arguments.length;
              var options = arguments.length <= 0 ? undefined : arguments[0];
              var errorTips = "".concat(_this.api.namespace, "\u672A\u5B9A\u4E49\u5177\u4F53\u5B9E\u73B0\u65B9\u6CD5");
              var reject;

              if (Promise) {
                reject = len - 1 < 0 || arguments.length <= len - 1 ? undefined : arguments[len - 1];
              } // 如果存在错误回调


              options.error && options.error(errorTips);
              reject && reject(errorTips);
            };
          }

          if (Promise) {
            return finallyCallback && new Promise(function (resolve, reject) {
              // 拓展 args
              args = args.concat([resolve, reject]);
              finallyCallback.apply(_this, args);
            });
          }

          return finallyCallback && finallyCallback.apply(_this, args);
        };
      };
      /**
       * 析构函数
       */


      Proxy.prototype.dispose = function dispose() {
        this.api = null;
        this.callback = null;
      };

      hybridJs.Proxy = Proxy;
    }

    /**
     * h5和原生交互，jsbridge核心代码
     * 依赖于showError，globalError，os
     * @param {Object} hybrid hybrid对象
     */

    function jsbridgeMixin(hybrid) {
      var hybridJs = hybrid;
      var ejsIframeUuid = uuid({
        len: 10,
        type: 'noline'
      }); // 必须要有一个全局的JSBridge，否则原生和H5无法通信
      // 定义每次重新生成一个JSBridge

      window.JSBridge = window.JSBridge || {};
      var JSBridge = window.JSBridge; // 声明依赖

      var showError = hybridJs.showError;
      var globalError = hybridJs.globalError;
      var os = hybridJs.os;
      hybridJs.JSBridge = JSBridge; // jsbridge协议定义的名称

      var CUSTOM_PROTOCOL_SCHEME = 'EpointJSBridge'; // 本地注册的方法集合,原生只能调用本地注册的方法,否则会提示错误

      if (!hybridJs.messageHandlers) {
        hybridJs.messageHandlers = {};
      } // 短期回调函数集合
      // 在原生调用完对应的方法后,会执行对应的回调函数id，并删除


      if (!hybridJs.responseCallbacks) {
        hybridJs.responseCallbacks = {};
      } // 长期存在的回调，调用后不会删除


      if (!hybridJs.responseCallbacksLongTerm) {
        hybridJs.responseCallbacksLongTerm = {};
      }

      if (!hybridJs.functionCallbacks) {
        hybridJs.functionCallbacks = {};
      } // 唯一id,用来确保长期回调的唯一性，初始化为最大值


      var uniqueLongCallbackId = 65536; // 临时解决：iframe跨域时，长期回调port需要随机。防止安卓非iframe的webview下，从全局port中读取到iframeuuid，误以iframe传参方式进行回调。

      if (!(window.self === window.top)) {
        uniqueLongCallbackId = 50000 + Math.round(Math.random() * (65536 - 50000));
      } // 要排除掉的端口号


      var excludePort = [8193, 8194, 8195];
      /**
       * 获取短期回调id，内部要避免和长期回调的冲突
       * @return {Number} 返回一个随机的短期回调id
       */

      function getCallbackId() {
        var exclude = function exclude(port) {
          if (excludePort.indexOf(port) !== -1) {
            return exclude(Math.floor(Math.random() * uniqueLongCallbackId));
          }

          return port;
        }; // 确保每次都不会和长期id相同


        return exclude(Math.floor(Math.random() * uniqueLongCallbackId));
      }
      /**
       * 将JSON参数转为字符串
       * @param {Object} data 对应的json对象
       * @return {String} 转为字符串后的结果
       */


      function getParam(data) {
        if (typeof data !== 'string') {
          return JSON.stringify(data);
        }

        return data;
      }
      /**
       * 递归获取当前iframe位置层级
       * @param {Object} win window环境
       * @param {String} str 拼接的iframe字符串
       * @returns {String} 拼接的iframe字符串
       */


      function getParentWindow(win, str) {
        var callBack;
        var callStr;

        if (win.parent === win) {
          // 当前页面已经是根页面了
          if ((str || '').length >= 0) {
            callBack = str;
          }
        } else {
          // 存在父级页面
          try {
            var p = win.parent; // 跨域执行时，无法获取到p.document，走try-catch回调

            var frames = p.document.getElementsByTagName('iframe');
            var index = 0;

            for (var i = 0; i < frames.length; i += 1) {
              var frame = frames[i];

              if (frame.contentWindow === win) {
                index = i;
                break;
              }
            }

            if ((str || '').length > 0) {
              callStr = ".".concat(str);
            }

            callBack = getParentWindow(p, "document.getElementsByTagName(\"iframe\")[".concat(index, "].contentWindow").concat(callStr || ''));
          } catch (error) {
            console.error( // '请勿在小程序内嵌入iframe使用ejs，或者请升级ejs容器组件、ejs前端框架版本4.0.3-c及以上，4.0.3-c及以上请忽略'
            '识别当前页面为iframe下跨域使用ejsapi\n为了正常使用ejsapi，请确认：\n移动前端框架ejs版本v4.0.3-c及以上\nv7容器ejs组件版本v3.5.1.e(Android)、v3.5.1.l(iOS)及以上\nM8容器ejs组件版本v4.0.3.c及以上\n同时iframe标签请去除sandbox属性或者sandbox属性增加allow-modals值');
          }
        }

        return callBack;
      }
      /**
       * 提取出原生给ejs回调处理方式
       * @param {Object} ejs hybridjs变量
       * @param {Object} message 原生传递给ejs的回调参数
       */


      function nativeActionCallback(ejs, message) {
        // 回调函数
        var responseId = message.responseId;
        var responseData = message.responseData;
        var responseCallback;

        if (responseId) {
          // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
          responseCallback = ejs.responseCallbacks[responseId]; // 默认先短期再长期

          responseCallback = responseCallback || ejs.responseCallbacksLongTerm[responseId]; // 执行本地的回调函数

          responseCallback && responseCallback(responseData); // 删除api回调
          // eslint-disable-next-line no-param-reassign

          delete ejs.responseCallbacks[responseId]; // 删除参数函数回调

          if (ejs.functionCallbacks[responseId]) {
            ejs.functionCallbacks[responseId].forEach(function (e) {
              // eslint-disable-next-line no-param-reassign
              delete ejs.responseCallbacks[e];
            });
          }
        } else {
          /**
           * 否则,代表原生主动执行h5本地的函数
           * 从本地注册的函数中获取
           */
          var handler = ejs.messageHandlers[message.handlerName];
          var data = message.data; // 执行本地函数,按照要求传入数据和回调

          handler && handler(data);
        }
      }
      /**
       * 给所有iframe页面推送内容
       * @param {Object} message 对应的方法的详情,需要手动转为json
       */


      function allIframePostMessage(message) {
        // 获取原生传递过来指定的iframe标记
        var iframeUuid = message.callbackIframeUUid || message.iframeUuid;
        var ifrmaePages = document.getElementsByTagName('iframe');
        [].forEach.call(ifrmaePages, function (e) {
          e.contentWindow.postMessage({
            iframeUuid: iframeUuid,
            message: message
          }, '*');
        });
      }
      /**
       * 获取最终的url scheme
       * @param {String} proto 协议头，一般不同模块会有不同的协议头
       * @param {Object} message 兼容android中的做法
       * android中由于原生不能获取JS函数的返回值,所以得通过协议传输
       * @return {String} 返回拼接后的uri
       */


      function getUri(proto, message) {
        var uri = "".concat(CUSTOM_PROTOCOL_SCHEME, "://").concat(proto); // 回调id作为端口存在

        var callbackId;
        var method;
        var params;

        if (message.callbackId) {
          // 必须有回调id才能生成一个scheme
          // 这种情况是H5主动调用native时
          callbackId = message.callbackId;
          method = message.handlerName;
          params = message.data;
        }

        if (!(window.self === window.top)) {
          // 老版本对ejsiframe页面ejs兼容，存在跨域无法响应问题
          params.callbackFunc = getParentWindow(window); // 4.0.3a以上，使用新版iframe兼容，由原生判断使用新版还是老版

          params.callbackIframeUUid = "".concat(ejsIframeUuid);
        } // 参数转为字符串


        params = encodeURIComponent(getParam(params)); // uri 补充,需要编码，防止非法字符

        uri += ":".concat(callbackId, "/").concat(method, "?").concat(params);
        return uri;
      }
      /**
       * 将长字符串转成数组
       * @param {String} uri 长参数字符串
       * @returns {Array} ejsLongArr 根据5000长度拆分的数组
       */


      function longStringToArr(uri) {
        var ejsLongArr = [];
        var n = 5000;

        for (var i = 0, l = uri.length; i < l / n; i += 1) {
          var a = uri.slice(n * i, n * (i + 1));
          ejsLongArr.push(a);
        }

        return ejsLongArr;
      }
      /**
       * 手动实现setItem
       * @param {Number} id 数字
       * @param {String} string 数据拆分后的字符串
       * @param {String} index 拆分序列
       * @returns {String} uir 单独调用存储api
       */


      function callSetItem(id, string, index) {
        var uir = '';

        if (hybrid.version > '4.0.3') {
          // 在小程序里传大数据参数,setItem原生无法正常获取,改用setLongCache
          uir = "EpointJSBridge://storage:".concat(id + 99, "/setLongCache?").concat(encodeURIComponent("{\"".concat(id, "-").concat(index, "\":\"").concat(string, "\"}")));
        } else {
          uir = "EpointJSBridge://storage:".concat(id + 99, "/setItem?{\"").concat(id, "-").concat(index, "\":\"").concat(string, "\"}");
        }

        return uir;
      }
      /**
       * 手动函数传参
       * @param {String} UUID 唯一标识
       * @returns {String} FuncString 带协议的字符串
       */


      function callFuncData(UUID) {
        var FuncString = "JSBridgeParamForCallback://".concat(UUID);
        return FuncString;
      }
      /**
       * 将函数转换为唯一协议标识
       * @param {object} newMessage 构建后参数
       * @param {function} fun 函数参数
       * @returns {String} FuncString 带协议的字符串
       */


      function funToGuid(newMessage, fun) {
        var FuncId = getCallbackId(); // 全局存储参数函数

        hybridJs.responseCallbacks[FuncId] = fun; // 存储函数参数id至本地，将与api成功回调id绑定，用于统一成功回调后销毁

        newMessage.funcitonCallbackId.push(FuncId);
        return callFuncData(FuncId);
      }
      /**
       * 递归处理传参内函数参数未唯一协议标识字符串
       * @param {object} newMessage 构建后参数
       * @param {object} data api入参
       */


      function handleFunOpt(newMessage, data) {
        data && Object.keys(data).forEach(function (item) {
          if (typeof data[item] === 'function') {
            // eslint-disable-next-line no-param-reassign
            data[item] = funToGuid(newMessage, data[item]);
          } else if (typeof data[item] === 'object') {
            handleFunOpt(newMessage, data[item]);
          }
        });
      }
      /**
       * JS调用原生方法前,会先send到这里进行处理
       * @param {String} proto 这个属于协议头的一部分
       * @param {JSON} message 调用的方法详情,包括方法名,参数
       * @param {Object} responseCallback 调用完方法后的回调,或者长期回调的id
       */


      function doSend(proto, message, responseCallback) {
        var newMessage = message;
        newMessage.funcitonCallbackId = []; // 递归处理api参数内函数参数

        handleFunOpt(newMessage, message.data);

        if (typeof responseCallback === 'function') {
          // 如果传入的回调时函数，需要给它生成id
          // 取到一个唯一的callbackid
          var callbackId = getCallbackId(); // 回调函数添加到短期集合中

          hybridJs.responseCallbacks[callbackId] = responseCallback; // 方法的详情添加回调函数的关键标识

          newMessage.callbackId = callbackId; // 将函数参数与函数回调绑定

          if (newMessage.funcitonCallbackId.length > 0) {
            // 与api回调id存储在functionCallbacks中
            hybridJs.functionCallbacks[callbackId] = newMessage.funcitonCallbackId;
          }
        } else {
          // 如果传入时已经是id，代表已经在回调池中了，直接使用即可
          newMessage.callbackId = responseCallback;
        } // 获取 触发方法的url scheme


        var uri = getUri(proto, newMessage);

        if (os.ejs) {
          // 依赖于os判断
          if (os.ios) {
            // ios采用
            window.webkit.messageHandlers.WKWebViewJavascriptBridge.postMessage(uri);
          } else if (os.android && uri.length > 5000) {
            // 当安卓传入数据大于5000时，进行拆分
            var uriArr = longStringToArr(uri);
            var _callbackId = newMessage.callbackId;
            var callArr = [];
            uriArr.forEach(function (e, n) {
              var uriLong = callSetItem(_callbackId, e, n); // eslint-disable-next-line no-alert

              window.prompt(uriLong, '');
              callArr.push("".concat(_callbackId, "-").concat(n));
            });
            var newUri = "EpointJSBridge://veryLongString?{'storageKey':".concat(JSON.stringify(callArr), "}"); // eslint-disable-next-line no-alert

            window.prompt(newUri, '');
          } else if (os.android) {
            // eslint-disable-next-line no-alert
            window.prompt(uri, '');
          } else {
            warn("\u5F53\u524Dejs\u73AF\u5883\u672A\u8BC6\u522B\u7CFB\u7EDF\u7C7B\u578B\uFF0C\u5BF9\u5E94ua:".concat(navigator.userAgent));
          }
        } else {
          // 浏览器
          warn("\u6D4F\u89C8\u5668\u4E2Djsbridge\u65E0\u6548,\u5BF9\u5E94scheme:".concat(uri));
        }
      }
      /**
       * 注册本地JS方法通过JSBridge给原生调用
       * 我们规定,原生必须通过JSBridge来调用H5的方法
       * 注意,这里一般对本地函数有一些要求,要求第一个参数是data,第二个参数是callback
       * @param {String} handlerName 方法名
       * @param {Function} handler 对应的方法
       */


      JSBridge.registerHandler = function registerHandler(handlerName, handler) {
        hybridJs.messageHandlers[handlerName] = handler;
      };
      /**
       * 注册长期回调到本地
       * @param {String} callbackId 回调id
       * @param {Function} callback 对应回调函数
       */


      JSBridge.registerLongCallback = function registerLongCallback(callbackId, callback) {
        hybridJs.responseCallbacksLongTerm[callbackId] = callback;
      };
      /**
       * 获得本地的长期回调，每一次都是一个唯一的值
       * @retrurn 返回对应的回调id
       * @return {Number} 返回长期回调id
       */


      JSBridge.getLongCallbackId = function getLongCallbackId() {
        uniqueLongCallbackId -= 1;
        return uniqueLongCallbackId;
      };
      /**
       * 调用原生开放的方法
       * @param {String} proto 这个属于协议头的一部分
       * @param {String} handlerName 方法名
       * @param {JSON} data 参数
       * @param {Object} callback 回调函数或者是长期的回调id
       */


      JSBridge.callHandler = function callHandler(proto, handlerName, data, callback) {
        doSend(proto, {
          handlerName: handlerName,
          data: data
        }, callback);
      };
      /**
       * 函数参数执行回调
       * @param {String} messageJSON 对应的方法的详情,需要手动转为json
       */
      // eslint-disable-next-line max-len


      JSBridge._handleParamCallbackMessageFromNative = function _handleParamCallbackMessageFromNative(messageJSON) {
        /**
         * 处理原生过来的方法
         */
        function doDispatchMessageFromNative() {
          var message;
          var ejs = window.ejs || hybridJs || {};

          if (!messageJSON) {
            showError(globalError.ERROR_TYPE_NATIVECALL.code, globalError.ERROR_TYPE_NATIVECALL.msg);
            return;
          }

          try {
            if (typeof messageJSON === 'string') {
              message = decodeURIComponent(messageJSON);
              message = JSON.parse(message);
            } else {
              message = messageJSON;
            }
          } catch (e) {
            showError(globalError.ERROR_TYPE_NATIVECALL.code, globalError.ERROR_TYPE_NATIVECALL.msg);
            return;
          } // 回调函数


          var responseId = message.responseId;
          var responseData = message.responseData;
          var responseCallback;

          if (responseId) {
            // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
            responseCallback = ejs.responseCallbacks[responseId]; // 默认先短期再长期

            responseCallback = responseCallback || ejs.responseCallbacksLongTerm[responseId]; // 执行本地的回调函数

            if (responseData && responseData.code === 1) {
              responseData.result && responseCallback && responseCallback(responseData.result);
            } else {
              console.error('原生返回的参数函数回调responseData');
              console.error(responseData);
            }
          } else {
            /**
             * 否则,代表原生主动执行h5本地的函数
             * 从本地注册的函数中获取
             */
            var handler = ejs.messageHandlers[message.handlerName];
            var data = message.data;

            if (handler) {
              // 执行本地函数,按照要求传入数据和回调
              handler(data);
            } else {
              showError(0, "\u672A\u5728\u672C\u5730\u627E\u5230".concat(message.handlerName, "\u65B9\u6CD5\u7684\u56DE\u8C03"));
            }
          }
        }

        setTimeout(doDispatchMessageFromNative);
      };
      /**
       * 原生调用H5页面注册的方法,或者调用回调方法
       * @param {String} messageJSON 对应的方法的详情,需要手动转为json
       */


      JSBridge._handleMessageFromNative = function _handleMessageFromNative(messageJSON) {
        /**
         * 处理原生过来的方法
         */
        function doDispatchMessageFromNative() {
          var message;
          var ejs = window.ejs || hybridJs || {};

          if (!messageJSON) {
            showError(globalError.ERROR_TYPE_NATIVECALL.code, globalError.ERROR_TYPE_NATIVECALL.msg);
            return;
          }

          try {
            if (typeof messageJSON === 'string') {
              message = decodeURIComponent(messageJSON);
              message = JSON.parse(message);
            } else {
              message = messageJSON;
            }
          } catch (e) {
            showError(globalError.ERROR_TYPE_NATIVECALL.code, globalError.ERROR_TYPE_NATIVECALL.msg);
            return;
          } // 回调函数


          var responseId = message.responseId;
          var responseData = message.responseData;
          var responseCallback;

          if (responseId) {
            // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
            responseCallback = ejs.responseCallbacks[responseId]; // 默认先短期再长期

            responseCallback = responseCallback || ejs.responseCallbacksLongTerm[responseId]; // 执行本地的回调函数

            responseCallback && responseCallback(responseData); // 删除api回调

            delete ejs.responseCallbacks[responseId]; // 删除参数函数回调

            if (ejs.functionCallbacks[responseId]) {
              ejs.functionCallbacks[responseId].forEach(function (e) {
                delete ejs.responseCallbacks[e];
              });
            }
          } else {
            /**
             * 否则,代表原生主动执行h5本地的函数
             * 从本地注册的函数中获取
             */
            var handler = ejs.messageHandlers[message.handlerName];
            var data = message.data;

            if (handler) {
              // 执行本地函数,按照要求传入数据和回调
              handler(data);
            } else {
              showError(0, "\u672A\u5728\u672C\u5730\u627E\u5230".concat(message.handlerName, "\u65B9\u6CD5\u7684\u56DE\u8C03"));
            }
          }
        } // 使用异步


        setTimeout(doDispatchMessageFromNative);
      }; // 用于给原生在iframe跨域情况下给ejs的回调信息
      // eslint-disable-next-line no-underscore-dangle


      JSBridge._handlePostMessage = function _handlePostMessage(messageJSON) {
        var message;

        try {
          if (typeof messageJSON === 'string') {
            message = decodeURIComponent(messageJSON);
            message = JSON.parse(message);
          } else {
            message = messageJSON;
          }
        } catch (e) {
          showError(globalError.ERROR_TYPE_NATIVECALL.code, globalError.ERROR_TYPE_NATIVECALL.msg);
          return;
        } // 给所有的iframe推送消息


        allIframePostMessage(message);
      }; // 用于监听跨域iframe发送的执行内容


      window.addEventListener('message', function (e) {
        if (e.data && e.data.message) {
          var message = e.data.message;
          var iframeUuid = message.iframeUuid;

          if (iframeUuid === ejsIframeUuid) {
            var ejs = window.ejs || hybridJs || {};
            nativeActionCallback(ejs, message);
          } else {
            // 给所有的iframe推送消息
            allIframePostMessage(message);
          }
        }
      }); // }
    }

    /**
     * 内部触发jsbridge的方式，作为一个工具类提供
     * @param {Object} JSBridge JSBridge对象
     * @return {Object} callJsBridge
     */
    function generateJSBridgeTrigger(JSBridge) {
      /**
       * 有三大类型，短期回调，延时回调，长期回调，其中长期回调中又有一个event比较特殊
       * @param {JSON} options 配置参数，包括
       * handlerName 方法名
       * data 额外参数
       * isLongCb 是否是长期回调，如果是，则会生成一个长期回调id，以长期回调的形式存在
       * proto 对应方法的模块名
       * 其它 代表相应的头部
       * @param {Function} resolve promise中成功回调函数
       * @param {Function} reject promise中失败回调函数
       */
      return function callJsBridge(options, resolve, reject) {
        var success = options.success;
        var error = options.error;
        var dataFilter = options.dataFilter;
        var proto = options.proto;
        var handlerName = options.handlerName;
        var isLongCb = options.isLongCb;
        var isEvent = options.isEvent;
        var data = options.data; // 统一的回调处理

        var cbFunc = function cbFunc(res) {
          if (!res) {
            error && error('原生未正常传参');
            reject && reject('原生未正常传参');
            return;
          }

          if (res.code === 0) {
            error && error(res); // 长期回调不走promise

            !isLongCb && reject && reject(res);
          } else {
            var finalRes = res;

            if (dataFilter) {
              finalRes = dataFilter(finalRes);
            } // 提取出result


            success && success(finalRes.result);
            !isLongCb && resolve && resolve(finalRes.result);
          }
        };

        if (isLongCb) {
          /**
           * 长期回调的做法，需要注册一个长期回调id,每一个方法都有一个固定的长期回调id
           * 短期回调的做法(短期回调执行一次后会自动销毁)
           * 但长期回调不会销毁，因此可以持续触发，例如下拉刷新
           * 长期回调id通过函数自动生成，每次会获取一个唯一的id
           */
          var longCbId = JSBridge.getLongCallbackId();

          if (isEvent) {
            // 如果是event，data里需要增加一个参数
            data.port = longCbId;
          }

          JSBridge.registerLongCallback(longCbId, cbFunc); // 传入的是id

          JSBridge.callHandler(proto, handlerName, data, longCbId); // 长期回调默认就成功了，这是兼容的情况，防止有人误用

          resolve && resolve();
        } else {
          // 短期回调直接使用方法
          JSBridge.callHandler(proto, handlerName, data, cbFunc);
        }
      };
    }

    function callinnerMixin(hybrid) {
      var hybridJs = hybrid;
      var os = hybridJs.os;
      var JSBridge = hybridJs.JSBridge;
      var callJsBridge = generateJSBridgeTrigger(JSBridge);
      /**
       * 专门供API内部调用的，this指针被指向了proxy对象，方便处理
       * @param {Object} options 配置参数
       * @param {Function} resolve promise的成功回调
       * @param {Function} reject promise的失败回调
       */

      function callInner(options, resolve, reject) {
        var data = extend({}, options); // 纯数据不需要回调

        data.success = undefined;
        data.error = undefined;
        data.dataFilter = undefined;

        if (os.ejs) {
          // 默认ejs环境才触发jsbridge
          callJsBridge({
            handlerName: this.api.namespace,
            data: data,
            proto: this.api.moduleName,
            success: options.success,
            error: options.error,
            dataFilter: options.dataFilter,
            isLongCb: this.api.isLongCb,
            isEvent: this.api.isEvent
          }, resolve, reject);
        }
      }

      hybridJs.callInner = callInner;
    }

    /**
     * 定义API的添加
     * 必须按照特定方法添加API才能正常的代理
     * 依赖于一些基本库
     * os
     * Proxy
     * globalError
     * showError
     * callInner
     * @param {Object} hybrid hybrid
     */

    function defineapiMixin(hybrid) {
      var hybridJs = hybrid;
      var Proxy = hybridJs.Proxy;
      var globalError = hybridJs.globalError;
      var showError = hybridJs.showError;
      var os = hybridJs.os;
      var callInner = hybridJs.callInner;
      /**
       * 存放所有的代理 api对象
       * 每一个命名空间下的每一个os都可以执行
       * proxyapi[namespace][os]
       */

      var proxysApis = {};
      /**
       * 存放所有的代理 module对象
       */

      var proxysModules = {};
      var supportOsArray = ['ejs', 'dd', 'xm', 'h5'];

      function getCurrProxyApiOs(currOs) {
        for (var i = 0, len = supportOsArray.length; i < len; i += 1) {
          if (currOs[supportOsArray[i]]) {
            return supportOsArray[i];
          }
        } // 默认是h5


        return 'h5';
      }

      function getModuleApiParentByNameSpace(module, namespace) {
        var apiParent = module; // 只取命名空间的父级,如果仅仅是xxx，是没有父级的

        var parentNamespaceArray = /[.]/.test(namespace) ? namespace.replace(/[.][^.]+$/, '').split('.') : [];
        parentNamespaceArray.forEach(function (item) {
          apiParent[item] = apiParent[item] || {};
          apiParent = apiParent[item];
        });
        return apiParent;
      }

      function proxyApiNamespace(apiParent, apiName, finalNameSpace, hy) {
        // 代理API，将apiParent里的apiName代理到Proxy执行
        Object.defineProperty(apiParent, apiName, {
          configurable: true,
          enumerable: true,
          get: function proxyGetter() {
            // 确保get得到的函数一定是能执行的
            var nameSpaceApi = proxysApis[finalNameSpace]; // 得到当前是哪一个环境，获得对应环境下的代理对象

            var proxyObj = nameSpaceApi[getCurrProxyApiOs(os)] || nameSpaceApi.h5;

            if (proxyObj) {
              /**
               * 返回代理对象，所以所有的api都会通过这个代理函数
               * 注意引用问题，如果直接返回原型链式的函数对象，由于是在getter中，里面的this会被改写
               * 所以需要通过walk后主动返回
               */
              return proxyObj.walk(hy);
            }

            var apiOs = nameSpaceApi.os; // 正常情况下走不到，除非预编译的时候在walk里手动抛出

            var osMsg = apiOs ? apiOs.map(function (item) {
              switch (item) {
                default:
                  return item;

                case 'ejs':
                  return '新点移动端';

                case 'dd':
                  return '钉钉容器';

                case 'xm':
                  return '迅盟容器';

                case 'h5':
                  return '浏览器';
              }
            }) : '';
            var osErrorTips = osMsg ? osMsg.join('或') : '该api未定义可执行的环境os';
            var msg = "".concat(apiName, "\u8981\u6C42\u7684os\u73AF\u5883\u4E3A:").concat(osErrorTips);
            showError(globalError.ERROR_TYPE_APIOS.code, msg);
            return noop;
          },
          set: function proxySetter() {
            showError(globalError.ERROR_TYPE_APIMODIFY.code, globalError.ERROR_TYPE_APIMODIFY.msg);
          }
        });
      }
      /**
       * 监听模块，防止被篡改
       * @param {String} moduleName 模块名
       * @param {Object} hy hybrid对象
       */


      function observeModule(moduleName, hy) {
        Object.defineProperty(hy, moduleName, {
          configurable: true,
          enumerable: true,
          get: function proxyGetter() {
            if (!proxysModules[moduleName]) {
              proxysModules[moduleName] = {};
            }

            return proxysModules[moduleName];
          },
          set: function proxySetter() {
            showError(globalError.ERROR_TYPE_MODULEMODIFY.code, globalError.ERROR_TYPE_MODULEMODIFY.msg);
          }
        });
      }
      /**
       * 在某一个模块下拓展一个API
       * @param {String} moduleName 模块名
       * @param {String} apiParam api对象,包含
       * namespace 命名空间，必填
       * os 支持的环境
       * defaultParams 默认参数
       * @param {Object} hy hybrid对象
       */


      function extendApi(moduleName, apiParam, hy) {
        var hyb = hy || this;

        if (!moduleName || typeof moduleName !== 'string') {
          return;
        }

        if (!apiParam || !apiParam.namespace) {
          return;
        }

        if (!hyb[moduleName]) {
          // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
          // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
          observeModule(moduleName, hyb);
        }

        var api = apiParam;
        var modlue = hyb[moduleName];
        var apiNamespace = api.namespace; // api加上module关键字，方便内部处理

        api.moduleName = moduleName;
        var apiParent = getModuleApiParentByNameSpace(modlue, apiNamespace); // 最终的命名空间是包含模块的

        var finalNameSpace = "".concat(moduleName, ".").concat(api.namespace); // 如果仅仅是xxx，直接取xxx，如果aa.bb，取bb

        var apiName = /[.]/.test(apiNamespace) ? api.namespace.match(/[.][^.]+$/)[0].substr(1) : apiNamespace; // 这里防止触发代理，就不用apiParent[apiName]了，而是用proxysApis[finalNameSpace]

        if (!proxysApis[finalNameSpace]) {
          // 如果还没有代理这个API的命名空间，代理之，只需要设置一次代理即可
          proxyApiNamespace(apiParent, apiName, finalNameSpace, hy);
        } // 一个新的API代理，会替换以前API命名空间中对应的内容


        var apiRuncode = api.runCode;

        if (!apiRuncode && callInner) {
          // 如果没有runcode，默认使用callInner
          apiRuncode = callInner;
        }

        var newApiProxy = new Proxy(api, apiRuncode);
        var oldProxyNamespace = proxysApis[finalNameSpace] || {};
        var oldProxyOsNotUse = {};
        proxysApis[finalNameSpace] = {};
        supportOsArray.forEach(function (osTmp) {
          if (api.os && api.os.indexOf(osTmp) !== -1) {
            // 如果存在这个os，并且合法，重新定义
            proxysApis[finalNameSpace][osTmp] = newApiProxy;
            oldProxyOsNotUse[osTmp] = true;
          } else if (oldProxyNamespace[osTmp]) {
            // 否则仍然使用老版本的代理
            proxysApis[finalNameSpace][osTmp] = oldProxyNamespace[osTmp]; // api本身的os要添加这个环境，便于提示

            api.os && api.os.push(osTmp);
          }
        });
        proxysApis[finalNameSpace].os = api.os;
        Object.keys(oldProxyOsNotUse).forEach(function (notUseOs) {
          // 析构不用的代理
          oldProxyNamespace[notUseOs] && oldProxyNamespace[notUseOs].dispose();
        });
      }
      /**
       * 拓展整个对象的模块
       * @param {String} moduleName 模块名
       * @param {Array} apis 对应的api数组
       */


      function extendModule(moduleName, apis) {
        if (!moduleName || typeof moduleName !== 'string') {
          return;
        }

        if (!apis || !Array.isArray(apis)) {
          return;
        }

        if (!this[moduleName]) {
          // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
          // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
          observeModule(moduleName, this);
        }

        for (var i = 0, len = apis.length; i < len; i += 1) {
          extendApi(moduleName, apis[i], this);
        }
      }

      hybridJs.extendModule = extendModule;
      hybridJs.extendApi = extendApi;
    }

    /**
     * 定义如何调用一个API
     * 一般指调用原生环境下的API
     * 依赖于Promise,calljsbridgeMixin
     * @param {Object} hybrid hybrid
     */

    function callnativeapiMixin(hybrid) {
      var hybridJs = hybrid;
      var JSBridge = hybridJs.JSBridge;
      var callJsBridge = generateJSBridgeTrigger(JSBridge);
      /**
       * 调用自定义API
       * @param {Object} options 配置参数
       * @return {Object} 返回一个Promise对象，如果没有Promise环境，直接返回运行结果
       */

      function callApi(options) {
        // 实时获取promise
        var Promise = hybridJs.getPromise();
        var finalOptions = options || {};

        var callback = function callback(resolve, reject) {
          var appVersion = finalOptions.appVersion;

          var callInner = function callInner() {
            callJsBridge({
              handlerName: finalOptions.name,
              proto: finalOptions.mudule,
              data: finalOptions.data || {},
              success: finalOptions.success,
              error: finalOptions.error,
              isLongCb: finalOptions.isLongCb,
              isEvent: finalOptions.isEvent
            }, resolve, reject);
          };

          if (appVersion) {
            // 若传了容器版本，需要进行比较
            hybridJs.runtime.getAppVersion({
              success: function success(result) {
                if (result.version && compareVersion(result.version, appVersion) >= 0) {
                  // 若容器版本大于传进来的最低版本
                  callInner();
                } else {
                  var msg = "".concat(finalOptions.name, "\u8981\u6C42\u7684\u5BB9\u5668\u7248\u672C\u81F3\u5C11\u4E3A:").concat(appVersion, "\uFF0C\u5F53\u524D\u5BB9\u5668\u7248\u672C\uFF1A").concat(result.version, "\uFF0C\u8BF7\u5347\u7EA7");
                  hybridJs.showError(hybridJs.globalError.ERROR_TYPE_APINEEDHIGHNATIVEVERSION.code, msg);
                }
              },
              error: function error(_error) {
                console.error(_error);
              }
            });
          } else {
            callInner();
          }
        };

        return Promise && new Promise(callback) || callback();
      }

      hybridJs.callApi = callApi;
      hybridJs.callNativeApi = callApi;
    }

    /**
     * 初始化给配置全局函数
     * @param {Object} hybrid hybrid对象
     */

    function initMixin(hybrid) {
      var hybridJs = hybrid;
      var globalError = hybridJs.globalError;
      var showError = hybridJs.showError;
      var JSBridge = hybridJs.JSBridge;
      /**
       * 几个全局变量 用来控制全局的config与ready逻辑
       * 默认ready是false的
       */

      var readyFunc;
      var isAllowReady = false;
      var isConfig = false; // 用于请求接口的封装方法

      var utilAjax = null;
      /**
       * 检查环境是否合法，包括
       * 检测是否有检测版本号，如果不是，给出错误提示
       * 是否版本号小于容器版本号，如果小于，给予升级提示
       * @param {Object} hy hybrid对象
       */

      function checkEnvAndPrompt(hy) {
        if (!hy.runtime || !hy.runtime.getEjsVersion) {
          showError(globalError.ERROR_TYPE_VERSIONNOTSUPPORT.code, globalError.ERROR_TYPE_VERSIONNOTSUPPORT.msg);
        } else {
          hy.runtime.getEjsVersion({
            success: function success(result) {
              /**
               * 版本可以有差异
              const version = `${result.version} `;
                if (compareVersion(hybridJs.version, version) < 0) {
                  showError(
                      globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.code,
                      globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.msg);
              }
               */
              // 记录原生容器的版本号
              hybridJs.nativeVersion = result.version;
            },
            error: function error() {
              showError(globalError.ERROR_TYPE_INITVERSIONERROR.code, globalError.ERROR_TYPE_INITVERSIONERROR.msg);
            }
          });
        }
      } // 用于M7框架编码，避免老版本M7框架没有编码的情况


      function param(data) {
        var params = [];

        for (var k in data) {
          params.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
        }

        return params.join('&').replace(/%20/g, '+');
      } // 获取sso地址


      function getSsoUrl(preUrl) {
        return new Promise(function (resolve, reject) {
          var getSSOUrl = "".concat(preUrl, "rest/common/getSSOUrl");
          var option = {
            url: getSSOUrl,
            contentType: 'application/x-www-form-urlencoded',
            type: 'GET',
            // 获取sso地址是匿名
            isAutoProxy: false,
            success: function success(result) {
              var resUrl = result.custom && result.custom.ssourl || '';
              resUrl.substring(resUrl.length - 1) === '/' ? resUrl = resUrl.substring(0, resUrl.length - 1) : resUrl;

              if (result.status && parseInt(result.status.code, 0) === 1 && resUrl && resUrl !== getSSOUrl) {
                hybridJs.storage.setItem({
                  'h5Home_sso_url': result.custom.ssourl,
                  success: function success() {
                    console.log('ejs存储sso地址成功');
                    resolve(result.custom.ssourl);
                  },
                  error: function error(_error) {
                    console.error('ejs存储sso地址失败', _error);
                    reject(_error);
                  }
                });
              } else {
                console.error('ejs存储sso地址失败', result);
                reject(result);
              }
            },
            error: function error(err) {
              console.error('ejs存储sso地址失败', err);
              reject(err);
            }
          };
          utilAjax(option);
        });
      } // 通过不同接口获取鉴权参数


      function getJsTicket(env, ssoUrl, data, token, cb) {
        var ajax = function ajax(getJsTicketUrl) {
          return new Promise(function (resolve, reject) {
            var option = {
              url: "".concat(ssoUrl).concat(getJsTicketUrl),
              data: data,
              contentType: 'application/x-www-form-urlencoded',
              isAutoProxy: true,
              success: function success(result) {
                if (result.status && parseInt(result.status.code, 0) === 1) {
                  cb && cb(result.custom);
                  reject();
                } else {
                  resolve(result);
                }
              },
              error: function error(_error2) {
                console.log(_error2);
                resolve(_error2);
              }
            };

            if (Config.version && compareVersion(Config.version, '8.0.0') < 0) {
              // M7框架需要独立编码
              option.data = param(option.data);
            }

            if (token) {
              // 如果传了token，或者不自动代理情况下传了token
              option.isAutoProxy = false;
              option.headers = {
                Authorization: "Bearer ".concat(token)
              };
            }

            utilAjax(option);
          });
        }; // 先用新接口获取鉴权参数


        var getJsTicketUrl = 'rest/thirdparty/common/getJsTicket';

        if (env === 'wxWorkLocal') {
          data.tickettype = 'govweixin';
        } else if (env === 'wxWork') {
          data.tickettype = 'weixin';
        }

        ajax(getJsTicketUrl).then(function (res) {
          console.log('通过新版getJsTicket接口获取鉴权参数失败');
          console.log('改为使用旧版getJsTicket接口获取鉴权参数');
          getJsTicketUrl = 'rest/common/getJsTicket';

          if (env === 'wxWorkLocal' || env === 'wxWork') {
            data.tickettype = 'weixin';
          }

          ajax(getJsTicketUrl).then(function (res) {
            console.error(res);
          }).catch(function (error) {
            console.log('获取JSTicket成功');
          });
        }).catch(function (error) {
          console.log('获取JSTicket成功');
        });
      } // 用于自动鉴权


      function autoConfig(env, preUrl, token, agentId) {
        return new Promise(function (resolve, reject) {
          var data = {
            tickettype: 'dingtalk',
            // 政务微信获取时，中文传参编译有问题，此处不进行编译
            // pageurl: decodeURIComponent(window.location.href.replace(window.location.hash, '')),
            pageurl: window.location.href.replace(window.location.hash, ''),
            agentid: agentId || ''
          };

          var cb = function cb(result) {
            if (result.jsApiSignature) {
              resolve(result);
            } else {
              var finalResult = {
                nonceStr: result.nonceStr,
                jsApiSignature: result.signature,
                corpId: result.corpId,
                timestamp: result.timestamp,
                userInfoSignature: '',
                'dingtalk_agentid': result.dingtalk_agentid
              };
              resolve(finalResult);
            }
          }; // 获取sso地址，用于刷新token


          getSsoUrl(preUrl).then(function (res) {
            res += res.substring(res.length - 1) === '/' ? '' : '/'; // 获取JSTicket

            getJsTicket(env, res, data, token, cb);
          }).catch(function () {
            console.log('获取sso地址失败，使用传进来的url获取鉴权参数'); // 获取JSTicket

            getJsTicket(env, preUrl, data, token, cb);
          });
        });
      }
      /**
       * 页面初始化时必须要这个config函数
       * 必须先声明ready，然后再config
       * @param {Object} params
       * config的jsApiList主要是同来通知给原生进行注册的
       * 所以这个接口到时候需要向原生容器请求的
       */


      hybridJs.config = function config(params) {
        if (isConfig) {
          showError(globalError.ERROR_TYPE_CONFIGMODIFY.code, globalError.ERROR_TYPE_CONFIGMODIFY.msg);
        } else {
          isConfig = true;

          var successcb = function successcb() {
            // 允许ready直接执行
            isAllowReady = true; // 如果这时候有ready回调

            if (readyFunc) {
              log('ready!');
              readyFunc();
            }
          };

          if (hybridJs.os.ejs) {
            // 暂时检查环境默认就进行，因为框架默认注册了基本api的，并且这样2.也可以给予相应提示
            checkEnvAndPrompt(this);
            this.event.config(extend({
              success: function success() {
                successcb();
              },
              error: function error(_error3) {
                var tips = JSON.stringify(_error3);
                showError(globalError.ERROR_TYPE_CONFIGERROR.code, tips);
              }
            }, params));
          } else if (params && params.isAutoConfig === 1 && params.jsApiList && params.jsApiList.length > 0) {
            utilAjax = params.ajax;
            params.preUrl += params.preUrl.substring(params.preUrl.length - 1) === '/' ? '' : '/'; // 其他平台是否自动鉴权

            if (hybridJs.os.dd) {
              // 钉钉容器自动鉴权
              if (window.dd) {
                autoConfig('dd', params.preUrl, params.token, params.agentId).then(function (res) {
                  var nonceStr = res.nonceStr,
                      jsApiSignature = res.jsApiSignature,
                      corpId = res.corpId,
                      timestamp = res.timestamp;
                  var agentId = res.dingtalk_agentid;
                  dd.config({
                    agentId: agentId || Config && Config.agentId || '',
                    // 必填，微应用ID
                    corpId: corpId,
                    // 必填，企业ID
                    timeStamp: timestamp,
                    // 必填，生成签名的时间戳
                    nonceStr: nonceStr,
                    // 必填，生成签名的随机串
                    signature: jsApiSignature,
                    // 必填，签名
                    // 选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                    type: 0,
                    jsApiList: params.jsApiList || ['runtime.info', 'biz.contact.choose', 'device.notification.confirm', 'device.notification.alert', 'device.notification.prompt', 'biz.ding.post', 'biz.util.openLink', 'biz.contact.complexPicker', 'biz.cspace.saveFile', 'biz.cspace.preview', 'biz.cspace.chooseSpaceDir', 'biz.util.uploadAttachment'] // 必填，需要使用的jsapi列表，注意：不要带dd。

                  });
                  dd.error(function (error) {
                    console.log("dd error: ".concat(JSON.stringify(error)));
                  });
                  dd.ready(function () {
                    log('dd ready');
                    localStorage.setItem('corpId', corpId);
                    successcb();
                  });
                });
              } else {
                hybridJs.ui.toast('未引入钉钉的JSSDK，无法自动鉴权');
              }
            } else if ((hybridJs.os.wxWork || hybridJs.os.wxWorkLocal) && window.self === window.top) {
              if (window.wx) {
                var env = 'wxWork';

                if (hybridJs.os.wxWorkLocal) {
                  env = 'wxWorkLocal';
                } // 企业微信或政务微信自动鉴权


                autoConfig(env, params.preUrl, params.token, params.agentId).then(function (res) {
                  var nonceStr = res.nonceStr,
                      jsApiSignature = res.jsApiSignature,
                      corpId = res.corpId,
                      timestamp = res.timestamp,
                      userInfoSignature = res.userInfoSignature;
                  timestamp = Number(timestamp);
                  wx.config({
                    beta: true,
                    // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false,
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                    appId: corpId,
                    // 必填，企业微信的corpID
                    timestamp: timestamp,
                    // 必填，生成签名的时间戳
                    nonceStr: nonceStr,
                    // 必填，生成签名的随机串
                    signature: jsApiSignature,
                    // 必填，签名，见附录1
                    jsApiList: params.jsApiList || [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

                  });
                  wx.ready(function () {
                    log(env + ' ready');

                    if (params.agentId && userInfoSignature) {
                      if (hybridJs.os.wxWorkLocal) {
                        wx.invoke('agentConfig', {
                          agentid: params.agentId,
                          // 必填，单位应用的agentid
                          corpid: corpId,
                          // 必填，政务微信的corpid
                          timestamp: timestamp,
                          // 必填，生成签名的时间戳,int类型, 如 1539100800
                          nonceStr: nonceStr,
                          // 必填，生成签名的随机串
                          signature: userInfoSignature // 必填，签名，见附录5

                        }, function (res) {
                          if (res.err_msg != 'agentConfig:ok') {
                            hybridJs.ui.alert('应用身份鉴权失败');
                            console.log(res);
                            return;
                          }

                          log(env + ' agentConfig ready');
                          successcb();
                        });
                      } else {
                        wx.agentConfig({
                          corpid: corpId,
                          // 必填，企业微信的corpid，必须与当前登录的企业一致
                          agentid: params.agentId,
                          // 必填，企业微信的应用id （e.g. 1000247）
                          timestamp: timestamp,
                          // 必填，生成签名的时间戳
                          nonceStr: nonceStr,
                          // 必填，生成签名的随机串
                          signature: userInfoSignature,
                          // 必填，签名，见附录-JS-SDK使用权限签名算法
                          jsApiList: params.jsApiList || [],
                          //必填，传入需要使用的接口名称
                          success: function success(res) {
                            log(env + ' agentConfig ready');
                            successcb();
                          },
                          fail: function fail(res) {
                            if (res.errMsg.indexOf('function not exist') > -1) {
                              hybridJs.ui.alert('应用身份鉴权失败, 版本过低请升级');
                            }

                            console.log(res);
                          }
                        });
                      }
                    } else {
                      successcb();
                    }
                  });
                  wx.error(function (error) {
                    console.log("wxWork error: ".concat(JSON.stringify(error)));
                  });
                });
              } else {
                hybridJs.ui.toast('未引入企业微信的JSSDK，无法自动鉴权');
              }
            } else {
              successcb();
            }
          } else {
            successcb();
          }
        }
      };
      /**
       * 初始化完毕，并且config验证完毕后会触发这个回调
       * 注意，只有config了，才会触发ready，否则无法触发
       * ready只会触发一次，所以如果同时设置两个，第二个ready回调会无效
       * @param {Function} callback 回调函数
       */


      hybridJs.ready = function ready(callback) {
        // 修改ready，改为可以触发多个ready回调
        // if (!readyFunc) {
        readyFunc = callback; // 如果config先进行，然后才进行ready,这时候恰好又isAllowReady，代表ready可以直接自动执行

        if (isAllowReady) {
          log('ready!'); // isAllowReady = false;

          readyFunc();
        } // } else {
        //     showError(globalError.ERROR_TYPE_READYMODIFY.code, globalError.ERROR_TYPE_READYMODIFY.msg);
        // }

      };

      document.addEventListener('DOMContentLoaded', function () {
        if (!hybridJs.os.ejs) {
          return;
        }

        hybridJs.event.dispatchEventToNative && hybridJs.event.dispatchEventToNative({
          key: 'DOMContentLoaded'
        });
      });

      hybridJs.app = function app(params) {
        this.event.app(extend({}, params));
      };
      /**
       * 注册接收原生的错误信息
       */


      JSBridge.registerHandler('handleError', function (data) {
        showError(globalError.ERROR_TYPE_NATIVE.code, JSON.stringify(data));
      });
    }

    function innerUtilMixin(hybrid) {
      var hybridJs = hybrid;
      var innerUtil = {};
      hybridJs.innerUtil = innerUtil;
      /**
       * 将参数兼容字符串形式，返回新的args
       * 正常应该是 object, resolve, reject
       * 兼容的字符串可能是 key1, (key2, key3,) ..., resolve, reject
       * @param {Object} args 原始的参数
       * @param {Object} rest 剩余的参数，相当于从arguments1开始算起
       * @return {Object} 返回标准的参数
       */

      function compatibleStringParamsToObject(args) {
        var _this = this;

        var newArgs = args;

        if (!args || !Array.isArray(args)) {
          return args;
        }

        if (!innerUtil.isObject(newArgs[0])) {
          var options = {};
          var isPromise = !!hybridJs.getPromise();
          var len = newArgs.length;
          var paramsLen = isPromise ? len - 2 : len; // 填充字符串key，排除最后的resolve与reject

          for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
          }

          for (var i = 0; i < paramsLen; i += 1) {
            // 注意映射关系，rest[0]相当于以前的arguments[1]
            if (rest[i] !== undefined) {
              options[rest[i]] = newArgs[i];
            }
          } // 分别为options，resolve，reject


          newArgs[0] = options;

          if (isPromise) {
            newArgs[1] = newArgs[len - 2];
            newArgs[2] = newArgs[len - 1];
          } else {
            // 去除普通参数对resolve与reject的影响
            newArgs[1] = undefined;
            newArgs[2] = undefined;
          }
        } // 默认参数的处理，因为刚兼容字符串后是没有默认参数的


        if (this.api && this.api.defaultParams && newArgs[0] instanceof Object) {
          Object.keys(this.api.defaultParams).forEach(function (item) {
            if (newArgs[0][item] === undefined) {
              newArgs[0][item] = _this.api.defaultParams[item];
            }
          });
        } // 否则已经是标准的参数形式，直接返回


        return newArgs;
      }
      /**
       * 限制按钮个数，只选其中num个
       * @param {Array} arr 参数数组
       * @param {Number} maximum 允许最大个数
       * @returns {Array} 返回正确的数组
       */


      function eclipseButtonsNumber(arr, maximum) {
        var result = arr;

        if (result && Array.isArray(result)) {
          var len = result.length;

          if (len > maximum) {
            var difference = len - (len - maximum);
            result.length = difference;
          }
        }

        return result;
      }

      innerUtil.extend = extend;
      innerUtil.isObject = isObject;
      innerUtil.getFullPath = getFullPath;
      innerUtil.getFullUrlByParams = getFullUrlByParams;
      innerUtil.eclipseText = eclipseText;
      innerUtil.compatibleStringParamsToObject = compatibleStringParamsToObject;
      innerUtil.eclipseButtonsNumber = eclipseButtonsNumber;
      innerUtil.getBase64NotUrl = getBase64NotUrl;
    }

    function mixin(hybrid) {
      var hybridJs = hybrid;
      hybridJs.version = '4.1.2';
      osMixin(hybridJs);
      promiseMixin(hybridJs);
      errorMixin(hybridJs); // 不依赖于promise，但是是否有Promise决定返回promise对象还是普通函数, 依赖于globalError

      proxyMixin(hybridJs); // 依赖于showError，globalError，os

      jsbridgeMixin(hybridJs); // api没有runcode时的默认实现，依赖于jsbridge与os

      callinnerMixin(hybridJs); // 依赖于os，Proxy，globalError，showError，以及callInner

      defineapiMixin(hybridJs); // 依赖于JSBridge，Promise,sbridge

      callnativeapiMixin(hybridJs); // init依赖与基础库以及部分原生的API

      initMixin(hybridJs); // 给API快速使用的内部工具集

      innerUtilMixin(hybridJs);
    }

    var hybridJs = {};
    mixin(hybridJs);

    return hybridJs;

}));
