/**
 * 作者： 夏云涛
 * 时间： 2021-5-25 10:09:34
 * 版本： [1.0  2022-5-25]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 付款码
 */

var socket,
    popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1, // 打开页面数量
    subSocket, // socket实例
    codeToken = '', // 付款码token
    userguid = '', // 用户guid
    loginid = '',//loginid
    paycode = '',
    timer = null,
    qrcode = ''; // 二维码

//扩展mui.showLoading  
(function ($, window) {
    //显示加载框  
    $.showLoading = function (message, type) {
        if ($.os.plus && type !== 'div') {
            $.plusReady(function () {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层  
            var mask = document.getElementsByClassName("mui-show-loading-mask");
            if (mask.length == 0) {
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function (e) { e.stopPropagation(); e.preventDefault(); });
            } else {
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框  
            var toast = document.getElementsByClassName("mui-show-loading");
            if (toast.length == 0) {
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function (e) { e.stopPropagation(); e.preventDefault(); });
            } else {
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }
    };

    //隐藏加载框  
    $.hideLoading = function (callback) {
        if ($.os.plus) {
            $.plusReady(function () {
                plus.nativeUI.closeWaiting();
            });
        }
        var mask = document.getElementsByClassName("mui-show-loading-mask");
        var toast = document.getElementsByClassName("mui-show-loading");
        if (mask.length > 0) {
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if (toast.length > 0) {
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
    }
})(mui, window);

(function (doc, Config, Util) {
    'use strict';

    Util.loadJs(
        'pages/common/common.js',
        'js/widgets/qrcode/qrcode.min.js',
        'js/widgets/barcode/JsBarcode.all.min.js',
        'js/widgets/atmosphere/atmosphere.js',
        'js/utils/util.date.js',
        function () {
            customBiz.configReady();
        });

    /**
     * @description 所有业务处理
     */
    var customBiz = {
        // 初始化校验，必须调用
        // 注，如果没有组件API需要注册，可以传空，注册组件时，必须容器支持对应组件才能注册成功
        configReady: function () {
            Config.configReady(null, function () {
                initListeners();

                ejs.auth.getUserInfo({
                    success: function (result) {
                        userguid = JSON.parse(result.userInfo).userguid;
                        loginid = JSON.parse(result.userInfo).loginid;
                        // 2022-06-02 qy 调整支付逻辑，不获取token，获取paycode
                        var date = new Date();
    					var time = date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds();
                        console.log('获取用户信息time:',time)
                        getPayCode();
                        initWebSocket();
                        timer = setInterval(function(){
			                getPayCode();
			            }, 30000);
                    },
                    error: function (error) { }
                });
            }, function (error) { });
        }
    };

    function initListeners() {
        // 进入页面刷新
//      ejs.event.registerEvent({
//          key: 'resume',
//          success: function (result) {
//          	var date = new Date();
//  			var time = date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds();
//          	console.log('resume时间：：',time)
//          	socket.unsubscribe();
//          	clearInterval(timer);
//          	getPayCode();
//          	initWebSocket();
//          	timer = setInterval(function(){
//	                getPayCode();
//	            }, 30000);
//          },
//          error: function (error) { }
//      });

        // 初始化二维码
        qrcode = new QRCode(document.getElementById('qrcode'), {
            render: 'table',
            text: '',
            width: 250,
            height: 250,
            colorDark: '#333',
            colorLight: 'transparent',
            correctLevel: QRCode.CorrectLevel.Q // LMQH
        });

        // 点击右下角按钮跳转到账户首页
        Zepto('.mui-content').on('tap', '#accountBtn', function () {
            ejs.page.open('./account_index.html', {
                popPageNumber: popPageNumber + 1
            });
        });

        // 点击右下角按钮跳转到餐食支付;
        Zepto('.mui-content').on('tap', '#paymentBtn', function () {
            var date = new Date();
            var time = date.getHours() + '.' + date.getMinutes();
            //午饭支付时间：10：30~13:00;晚饭支付时间：17:00~18:30
            if((time >= Config.lunchstarttime && time <= Config.lunchendtime) || (time >= Config.supperstarttime && time <= Config.supperendtime)){
                // 获取默认食堂
                getCanteenInfo(function(data){
                    var defaultCanteenname = '';
                    var defaultCanteenguid = '';
                    mui.each(data,function(key,value){
                        if(value.isdefault =='1'){
                            defaultCanteenname =value.canteenname;
                            defaultCanteenguid = value.canteenguid;
                        }
                    });
                    if(defaultCanteenguid != ''){
                        //有默认食堂
                        ejs.page.open('./account_payment.html', {
                            popPageNumber: popPageNumber,
                            canteenguid:defaultCanteenguid,
                            canteenname:defaultCanteenname
                        });
                    } else{
                        //没有默认食堂，跳转到选择默认食堂页面
                        ejs.page.open('./account_canteen.html', {
                            popPageNumber: popPageNumber + 1,
                            canteentype:'0'
                        });
                    }
                });
            } else{
                ejs.page.open('./account_canteen_close.html', {});
            }
            
        });

        // 点击右下角按钮跳转到今日凭证
        Zepto('.mui-content').on('tap', '#proofBtn', function () {
            var date = new Date();
            var time = date.getHours() + '.' + date.getMinutes();
            
            if((time >= Config.lunchstarttime && time <= Config.lunchendtime) || (time >= Config.supperstarttime && time <= Config.supperendtime)){
                ejs.page.open('./account_proof.html', {});
            }  else{
                ejs.page.open('./account_canteen_close.html', {});
            }
            
        });

        // 点击刷新付款码  暂时保留
        // Zepto('.mui-content').on('tap', '#refreshCode', function () {
        //     var data = {
        //         origin: 'client',
        //         msgType: 'genPayCode',
        //         token: codeToken
        //     };

        //     // 发送消息至服务端
        //     subSocket.push(JSON.stringify(data));
        // });
    }

    function renderCode(paycode) {
        // 初始化条形码  不传入format 默认 code128  扫码枪支持条码的格式
//      JsBarcode('#barcode', paycode, {
//          width: 1.5,
//          height: 60
//      });

        // 清除生成的qrcode
        qrcode.clear();
        // 生成新的qrcode(参数必须是字符串)
        console.log('生成二维码字符串：：',paycode)
        qrcode.makeCode(paycode.toString());

        // 暂时隐藏刷新二维码功能
        // Zepto('#refreshBtn').removeClass('mui-hidden');
    }

    
    /**
     * 获取二维码的paycode
     */
    function getPayCode(){
    	var date = new Date();
    	var time = date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds();
    	console.log('调用接口时间：：',time)
        common.ajax({
            url: Config.epointAccountUrl + 'genPayCode',
            data: {},
            isShowWaiting: false
        },
            function (result) {
                //mui.hideLoading();
				ejs.ui.closeWaiting();
                if (result.status.code === '1') {
                    paycode = result.custom.fkm;
					renderCode(paycode+ '@' +loginid);
                } else{
                	ejs.ui.toast(result.status.text);
                }
            },
            function (error) {
                //mui.hideLoading();
                ejs.ui.closeWaiting();
                ejs.ui.toast(Config.TIPS_II);
            }, {
            isDebug: true
        });
    }

    /**
     * @description initWebSocket 该方法用来与远程服务端建立连接。
     * @param {String} codeToken 条码/二维码token
    */
    function initWebSocket(codeToken) {
        socket = atmosphere;
//         let url = 'http://192.168.219.191:8082/epoint-cardmanage-web/rest/accountManage/';
        // 注册request对象
        var request = {
            url: Config.epointAccountUrl.replace('epoint-cardmanage-web/rest/accountManage/', 'epoint-cardmanage-websocket/') + 'websocket/paycode', // socket地址
//             url: url.replace('epoint-cardmanage-web/rest/accountManage/', 'epoint-cardmanage-websocket/') + 'websocket/paycode', // socket地址
            contentType: 'application/json',
            transport: 'websocket',
            reconnectInterval: 5000,
            fallbackTransport: 'long-polling',
            headers: {
//              token: codeToken,
                uid: userguid,
                loginid:loginid
            }
        };

        // 连接打开时
        request.onOpen = function (response) { };

        // 重新连接时
        request.onReconnect = function (request, response) { };

        // 收到推送消息时
        request.onMessage = function (response) {
            // message 即为收到的消息内容
            var message = JSON.parse(response.responseBody);
            console.log('收到的推送消息~~~~~~~~~~');
            console.log(response);
            console.log(message);

            // msgType类型 expense 支付成功跳转成功页面  genPayCode 刷新付款码
            if (message.msgType === 'expense') {
            	clearInterval(timer);
                if(message && message.custom && message.custom.amount){
                	socket.unsubscribe(); // 交易成功断开websocket
                	var amount = message.custom.amount;

	                ejs.page.open('./account_payment_success.html', {
	                    amount: amount,
	                    popPageNumber: popPageNumber + 1
	                });
                }else {
                	console.log('支付失败，此时显示的paycode是::',paycode)
                	var msg = message.msg || '支付失败，请刷新重试~'
                	ejs.ui.alert({
					    title: "温馨提示",
					    message: msg,
					    buttonName: "刷新",
					    cancelable: 0,
					    h5UI: false, // 是否强制使用H5-UI效果，默认false
					    success: function(result) {
					        getPayCode();
			            	timer = setInterval(function(){
				                getPayCode();
				            }, 30000);
					    },
					    error: function(err) {}
					});
                }
            }
        };

        // 发生错误时
        request.onError = function (response) {
        	socket.unsubscribe();
        	console.log('onError：：')
        	console.log(response)
            getPayCode();
            initWebSocket();
        };

        subSocket = socket.subscribe(request);
    }

    //获取默认食堂
    function getCanteenInfo(callback){
        common.ajax({
            url: Config.epointAccountNewUrl +'cashRegister/getCanteenInfo',
            data: {
                keyword:''
            },
            isShowWaiting:false
        },
        function (result) {
            
            if (result.status.code === '1') {
                if(result.custom && result.custom.voucherlist){
                    var data = result.custom.voucherlist;
                    callback && callback(data);
                }
            }
        },
        function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: true
        });
    } 
    //上传错误信息
    function websocketerrorregist(uid,userguid,paycode){
        common.ajax({
            url: Config.epointAccountNewUrl +'cashRegister/websocketerrorregist',
            data: {
               uid:uid,
               userguid:userguid,
               paycode:paycode
            },
            isShowWaiting:false
        },
        function (result) {
            
            if (result.status.code === '1') {
                
            }
        },
        function (error) {
            ejs.ui.toast(Config.TIPS_II);
        }, {
            isDebug: true
        });
    }
})(document, window.Config, window.Util);