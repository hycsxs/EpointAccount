/**
 * 作者： 夏云涛
 * 时间： 2021-5-25 10:09:34
 * 版本： [1.0  2022-5-25]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 支付成功
 */

var amount = Util.getExtraDataByKey('amount') || ''; // 消费金额
var popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1; // 打开页面数量
var type = Util.getExtraDataByKey('type') || '0';//0表示二维码付款成功页面，1表示午餐/晚餐支付成功页面

(function(doc, Config, Util) {
    'use strict';
    
    Util.loadJs(function() {
        customBiz.configReady();
    });

    /**
     * @description 所有业务处理
     */
    var customBiz = {
        // 初始化校验，必须调用
        // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
        configReady: function() {
            Config.configReady(null, function() {
                initPage();
                initListeners();
            }, function(error) {});
        }
    };

    function initPage() {
        Zepto('.em-amount').text('¥' + formateNumber(amount));
        if(type == '0'){
            Zepto('.em-return-btn').removeClass('mui-hidden');
        } else{
            Zepto('.em-pay-success').removeClass('mui-hidden');
        }

    }

    function initListeners() {

        ejs.navigator.hookBackBtn({
            success: function(result) {
                /**
                 * 每一次按下导航栏左侧返回就会触发回调
                 */
                ejs.page.close({
                    popPageNumber: popPageNumber
                });
            },
            error: function(error) {}
        });

        ejs.navigator.hookSysBack({
            success: function(result) {
                /**
                 * Android中每一次按下系统返回就会触发回调
                 */
                ejs.page.close({
                    popPageNumber: popPageNumber
                });
            },
            error: function(error) {}
        });
    
        // 点击返回首页
        Zepto('.mui-content').on('tap', '.em-return-btn', function() {
            ejs.page.open('./account_index.html', {
                popPageNumber: popPageNumber + 1
            });
        });
        // 点击打开支付凭证
        Zepto('.mui-content').on('tap', '.em-pay-success', function() {
            ejs.page.open('./account_proof.html', {
                popPageNumber: popPageNumber + 1
            });
        });
    }
    /**
     * @description 格式化数字 000,000.00
     * @param {Number} num 数字
     * @return {Number} formateNumber 000,000.00
     */
    function formateNumber(num) {
        var formateNumber = ''; // 格式化之后的数字

        // 当没有传入数字的情况，默认显示0.00
        if (!num) {
            formateNumber = '0.00';

            return formateNumber;
        }

        var int = num.toString().split('.')[0]; // 整数部分
        var decimal = num.toString().split('.')[1] || '00'; // 小数 没有小数的话 默认 00
        var formateIntList = []; // 格式化之后的数组

        // 先翻转整数数组，进行格式化
        int.split('').reverse().forEach(function(item, index) {
            if (index && (index % 3) === 0) {
                formateIntList.push(',');
            }
            formateIntList.push(item);
        });

        // 格式化后的数组再翻转回来，并拼接上小数
        formateNumber = formateIntList.reverse().join('') + '.' + decimal;

        return formateNumber;
    }
})(document, window.Config, window.Util);