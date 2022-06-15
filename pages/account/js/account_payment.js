/*
 * 作者: 钱愉
 * 创建时间: 2022-04-11 11:05:05
 * 修改时间: 2022-04-25 15:31:20
 * 版本: [1.0]
 * 版权: 国泰新点软件股份有限公司
 * 描述: 午餐/晚餐支付
 */

var keyword;//搜索关键字
var listdata = [];
var newdata = [];
var price = 25;//单价
var popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1;
var canteenguid = Util.getExtraDataByKey('canteenguid') || '';//食堂guid
var canteenname = Util.getExtraDataByKey('canteenname') || '';//食堂name


(function(doc, Config, Util) {
'use strict';

Util.loadJs([
    'pages/common/common.js',
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
            initPage();
            //判断午餐还是晚餐时间
            judgetime();
            // 获取剩余 份数
            getCanteenSupplyCount();
            initListeners();
        }, function(error) {});
    }
};

function initPage(){
    Zepto('.em-canteen-name').text(canteenname);
    ejs.auth.getUserInfo({
        success: function(result) {
            Zepto('.em-username').text(JSON.parse(result.userInfo).displayname);
        },
        error: function(error) {}
    });
}


function initListeners() {


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

    //用餐人数 +
    mui('.mui-content').on('tap','.em-plus',function(){
        var num = Zepto('.em-num').val();
        //当前人数
        var nownum = Number(num)+1;
        Zepto('.em-num').val(nownum);
        //实付金额
        countamount(nownum)
    });

    //用餐人数 -
    mui('.mui-content').on('tap','.em-sub',function(){
        var num = Zepto('.em-num').val();
        if(num > 1){
            //当前人数
            var nownum = num-1;
            Zepto('.em-num').val(nownum)
            //实付金额
            countamount(nownum)
        }
    });

    // 进入凭证页面
    mui('.mui-content').on('tap','.em-goproof',function(){
    	ejs.page.open('./account_proof.html', {
            popPageNumber: 1
        });
    })

    // 确认支付
    mui('.mui-content').on('tap','.em-pay-button',function(){
        var message = '实付' + Zepto('.em-amount').text() + '元，确认支付？'
        // 实付25.00元，确认支付？
        ejs.ui.confirm({
            title: '提示',
            message: message,
            buttonLabels: ['取消', '确定'],
            cancelable: 1,
            h5UI: false, // 是否强制使用H5-UI效果，默认false
            success: function(result) {
                if(result.which == '1'){
                    //提交数据
                    generateCanteenVoucher(function(){
                        ejs.page.open('./account_proof.html', {
                            popPageNumber: popPageNumber + 1
                        });
                        // ejs.page.open('./account_payment_success.html', {
                        //     amount: Zepto('.em-amount').text(),
                        //     popPageNumber: popPageNumber + 1,
                        //     type:1
                        // });
                    })
                 
                } else {
                    
                }
            },
            error: function(err) {}
        });
    });



    // 选择食堂
    mui('.mui-content').on('tap','.em-choosecanteen',function(){
        ejs.page.open({
            pageUrl: "./account_canteen.html",
            pageStyle: 1,
            orientation: 1,
            // 为1保活状态关闭小程序，为0不保活,默认为0
            alive: 0,
            data: {
                canteentype:'2'
            },
            useRouter: true,
            success: function(result) {
                if(result.resultData){
                    canteenguid = result.resultData.canteenguid;
                    canteenname = result.resultData.canteenname;
                    Zepto('.em-canteen-name').text(canteenname)
                }
            },
            error: function(error) {}
        });
    });

    // 手动输入用餐人数失去焦点后
    // Zepto('.em-num').on('blur',function(){
    //     var num = Zepto('.em-num').val();
    //     if(num < 1){
    //         Zepto('.em-num').val('1');
    //         Zepto('.em-amount').text(10);
    //     } else{
    //         //实付金额
    //         countamount(num)
    //     }
    // });
    
    //iOS软键盘问题
    Zepto('.em-sub').on('focus',function(){
        Zepto(this).trigger('blur')
    })
    Zepto('.em-num').on('focus',function(){
        Zepto(this).trigger('blur')
    })
    Zepto('.em-plus').on('focus',function(){
        Zepto(this).trigger('blur')
    })
     
}

//提交接口，生成凭证
function generateCanteenVoucher(callback){
    common.ajax({
        url: Config.epointAccountNewUrl +'cashRegister/generateCanteenVoucher',
        data: {
            dinernum:Zepto('.em-num').text(),
            canteenguid:canteenguid,
            canteenname:canteenname
        },
        isShowWaiting: false
    },
    function (result) {
        if (result.status.code === '1') {
            callback && callback()
        } else{
            ejs.ui.toast(result.status.text)
        }
    },
    function (error) {
        ejs.ui.toast(Config.TIPS_II);
    }, {
        isDebug: true
    });
}

//实付金额
function countamount(num){
    var count = num*price +'.00';
    Zepto('.em-amount').text(count);
}

//  判断是午饭还是晚饭时间;午饭：10：30~13:00;晚饭：17:00~18:30
function judgetime(){
    var date = new Date();
    var time = date.getHours() + '.' + date.getMinutes();
    if(time >= Config.lunchstarttime && time <= Config.lunchendtime){
        Zepto('.em-title').text('午餐支付');
        ejs.navigator.setTitle('午餐支付');
        price = 25;
        Zepto('.em-amount').text(price+'.00');
        Zepto('.mui-content').removeClass('mui-hidden');
    } else if(time >= Config.supperstarttime && time <= Config.supperendtime){
        Zepto('.em-title').text('晚餐支付');
        ejs.navigator.setTitle('晚餐支付');
        price = 10;
        Zepto('.em-amount').text(price+'.00');
        Zepto('.mui-content').removeClass('mui-hidden');
    } else{
        ejs.page.open('./account_canteen_close.html', {
            popPageNumber: popPageNumber+1,
        });
    }
 }

//获取剩余份数
function getCanteenSupplyCount(){
	common.ajax({
        url: Config.epointAccountNewUrl +'cashRegister/getCanteenSupplyCount',
        data: {
            canteenguid:canteenguid,
            canteenname:canteenname
        },
        isShowWaiting: false
    },
    function (result) {
        if (result.status.code === '1') {
            if(result.custom && result.custom.supplycount && result.custom.supplycount >0){
            	//supplycount 总数大于0表示设置了午餐份数，就显示剩余数量remaincount
            	Zepto('.em-supplycount').text(result.custom.remaincount);
            	Zepto('.em-supplycount-div').removeClass('mui-hidden');
            }
        } else{
//          ejs.ui.toast(result.status.text)
        }
    },
    function (error) {
        ejs.ui.toast(Config.TIPS_II);
    }, {
        isDebug: true
    });
}



})(document, window.Config, window.Util);