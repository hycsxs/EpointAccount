/*
 * 作者: 钱愉
 * 创建时间: 2022-04-13 10:05:59
 * 修改时间: 2022-04-14 14:47:20
 * 版本: [1.0]
 * 版权: 国泰新点软件股份有限公司
 * 描述: 
 */
 var popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1; // 打开页面数量
 
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
                 initListeners();
             }, function(error) {});
         }
     };
 
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
        var time = '3';
        function GetRTime(){
            if(time < 1){
                clearTimeout(GetRTime);
                ejs.page.close({
                    popPageNumber: popPageNumber
                });
                return false;
            }
            Zepto('.em-time').text(time);
            time--;
            setTimeout(GetRTime,1000);
        }
         GetRTime();
     }
     
 })(document, window.Config, window.Util);