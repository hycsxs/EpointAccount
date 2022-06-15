/*
 * 作者: 钱愉
 * 创建时间: 2022-04-11 11:11:12
 * 修改时间: 2022-04-15 19:56:25
 * 版本: [1.0]
 * 版权: 国泰新点软件股份有限公司
 * 描述: 支付凭证
 */

var keyword;//搜索关键字
var listdata = [];
var newdata = [];
var lunchPrice = 25;
var supperPrice = 10;
var popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1; 
var voucherlist = [];//所有凭证

(function(doc, Config, Util) {
'use strict';

Util.loadJs([
    'pages/common/common.js',
    'pages/common/libs/swiper.min.js',
    'pages/common/libs/swiper.min.css'
   //  'pages/account/account_canteen_util.js',

], 
function() {
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

    //获取用餐凭证
    getCanteenVoucher();


    //iOS禁止回弹
    ejs.device.setBounce({
        isEnable: 0,
        success: function(result) {},
        error: function(error) {}
    });

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

    
}

//获取凭证
function getCanteenVoucher(){
	//TODO 打开页面时弹出设置页面，让用户选择食堂区域、用餐类型（午餐、晚餐）、创建时间（默认今天），用餐结束时间（固定，根据用餐类型变化）、用餐人、工号
	var result = {
        "custom": {
          "voucherlist": [
            {
              "canteenname": "总部食堂(东区)",
              "vouchertype": "lunch",
              "createdate": "2022-06-14 11:42:47",
              "endtime": "2022-06-14 13:30:00",
              "operateusername": "易怀龙",
              "personno": "20210702278",
              "dinernum": 1
            }
          ]
        },
        "status": {
          "code": "1",
          "text": "请求成功"
        }};
	var data = result.custom.voucherlist;
    var voucherlist = result.custom.voucherlist;
		var html = '';
        var template = document.getElementById('template').innerHTML;
        mui.each(data,function(key,value){
            if(value.vouchertype == 'lunch'){
                value.vouchername = '午餐凭证';
                value.count = value.dinernum*lunchPrice +'.00';
            } else if(value.vouchertype == 'supper'){
                value.vouchername = '晚餐凭证';
                value.count = value.dinernum*supperPrice +'.00';
            }
            value.time = value.endtime.slice(0,10)
            
            html += Mustache.render(template, value);
        })
        Zepto('.swiper-wrapper').html(html);
        Zepto('.mui-content').removeClass('mui-hidden');
        var mySwiper = new Swiper('.swiper-container', {
            // autoplay: false,//可选选项，自动滑动
            pagination : '.swiper-pagination',
            speed:800,
        });

        //处理倒计时
        mui.each(voucherlist,function(key,value){
            countdown(key,value.endtime);
        })
    /*common.ajax({
        url: Config.epointAccountNewUrl +'cashRegister/getCanteenVoucher',
        data: {},
        isShowWaiting: false
    },
    function (result) {
		
        if (result.status.code === '1') {
            if(result.custom && result.custom.voucherlist){
                var data = result.custom.voucherlist;
                voucherlist = result.custom.voucherlist;
                if(data.length == 0){
                    ejs.ui.alert({
                        title: "提示",
                        message: '你还未生成凭证',
                        buttonName: "确定",
                        cancelable: 1,
                        h5UI: false, // 是否强制使用H5-UI效果，默认false
                        success: function(result) {
                            ejs.page.close();
                        },
                        error: function(err) {}
                    });
                    setTimeout(function(){
                        ejs.page.close();
                    },2000)
                } else{
                    var html = '';
                    var template = document.getElementById('template').innerHTML;
                    mui.each(data,function(key,value){
                        if(value.vouchertype == 'lunch'){
                            value.vouchername = '午餐凭证';
                            value.count = value.dinernum*lunchPrice +'.00';
                        } else if(value.vouchertype == 'supper'){
                            value.vouchername = '晚餐凭证';
                            value.count = value.dinernum*supperPrice +'.00';
                        }
                        value.time = value.endtime.slice(0,10)
                        
                        html += Mustache.render(template, value);
                    })
                    Zepto('.swiper-wrapper').html(html);
                    Zepto('.mui-content').removeClass('mui-hidden');
                    var mySwiper = new Swiper('.swiper-container', {
                        // autoplay: false,//可选选项，自动滑动
                        pagination : '.swiper-pagination',
                        speed:800,
                    });

                    //处理倒计时
                    mui.each(voucherlist,function(key,value){
                        countdown(key,value.endtime);
                    })
                    
                }
            }
        } else{
            ejs.ui.alert({
                title: "提示",
                message: result.status.text,
                buttonName: "确定",
                cancelable: 1,
                h5UI: false, // 是否强制使用H5-UI效果，默认false
                success: function(result) {
                    ejs.page.close();
                },
                error: function(err) {}
            });
            setTimeout(function(){
                ejs.page.close();
            },2000)
        }
    },
    function (error) {
        ejs.ui.toast(Config.TIPS_II);
    }, {
        isDebug: true
    });*/
}


 function countdown(index,time){
    var times = time.replace(/-/g,"/");
    function GetRTime(){
        var EndTime= new Date(times);
        var NowTime = new Date();
        var t =EndTime.getTime() - NowTime.getTime();
        var h=Math.floor(t/1000/60/60),
            m=Math.floor(t/1000/60%60),
            s=Math.floor(t/1000%60);
            h <10 ? h = '0' +h :h =h;
            m <10 ? m = '0' +m :m =m;
            s <10 ? s = '0' +s :s =s;
        if(t < 0){
            clearTimeout(GetRTime);
            Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-h').text('00');
            Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-m').text('00');
            Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-s').text('00');
            return false;
        }
        Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-h').text(h);
        Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-m').text(m);
        Zepto('.swiper-wrapper').find('.swiper-slide').eq(index).find('.em-time-s').text(s);
       
        setTimeout(GetRTime,1000);
    }
     GetRTime();
 }



})(document, window.Config, window.Util);
