/*
 * 作者: 钱愉
 * 创建时间: 2022-04-11 11:11:12
 * 修改时间: 2022-04-18 16:32:17
 * 版本: [1.0]
 * 版权: 国泰新点软件股份有限公司
 * 描述: 食堂选择
 */

 var keyword;//搜索关键字
 // 0表示选择从付款码页面进入，选择默认食堂；1表示首页食堂设置进入，设置默认食堂;2表示付款页面进入，选择吃饭食堂
var canteentype = Util.getExtraDataByKey('canteentype') || '';

 var listdata = [],
    popPageNumber = Number(Util.getExtraDataByKey('popPageNumber')) || 1; // 打开页面数量

(function(doc, Config, Util) {
 'use strict';
 
 Util.loadJs([
     'pages/common/common.js',
    //  'pages/account/js/account_canteen_util.js',

     // 下拉刷新
     'js/widgets/minirefresh/minirefresh.css',
     'js/widgets/minirefresh/minirefresh.js'
 ], [
     // 如果需要主题，则换为对应的主题文件引入
     'js/widgets/minirefresh/themes/ark/minirefresh.theme.ark.min.css',
     'js/widgets/minirefresh/themes/ark/minirefresh.theme.ark.min.js'
 ],
 'js/widgets/minirefresh/minirefresh.bizlogic.js',
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
             //判断是中午还是晚上
             judgetime();
             initListeners();
         }, function(error) {});
     }
 };

 function initListeners() {
    

     // 获取数据
     getcanteen();
     // 原生搜索
     ejs.navigator.showSearchBar({
        success: function(result) {
            keyword = result.keyword;
            getcanteen();
        },
        error: function(error) {}
    });

    // 设置默认食堂
    // mui('.mui-content').on('tap','.em-star',function(e){
    //     e.stopPropagation();
    //     var type = Zepto(this).attr('type');
    //     if(type == '0'){
    //         Zepto(this).attr('type','1');
    //         Zepto(this).find('img').attr('src','./img/img_star_checked.png');
    //         Zepto(this).parent().siblings().find('.em-star').attr('type','0');
    //         Zepto(this).parent().siblings().find('img').attr('src','./img/img_star.png');
    //     }
    // });

    // 选择食堂
    mui('.mui-content').on('tap','.em-list',function(e){
        //  e.stopPropagation();
         var isdefault = Zepto(this).attr('isdefault');
         var _this = this;
        if(canteentype == '0'){
            var canteenguid = Zepto(_this).attr('canteenguid');
            var canteenname = Zepto(_this).find('.em-name').text();
            //从付款码页面进入，选择默认食堂
            chooseCanteen(canteenguid,function(){
                ejs.page.open('./account_payment.html', {
                    popPageNumber: 2,
                    canteenname: canteenname,
                    canteenguid:canteenguid
                });
            })
        } else if(canteentype == '1'){
            //首页"食堂设置"，设置默认食堂
            if(isdefault == '0'){
                var canteenguid = Zepto(_this).attr('canteenguid');
                Zepto(_this).attr('isdefault','1');
                Zepto(_this).find('img').attr('src','./img/img_star_checked.png');
                Zepto(_this).siblings().attr('isdefault','0');
                Zepto(_this).siblings().find('img').attr('src','./img/img_star.png');
                chooseCanteen(canteenguid,function(){
                    ejs.ui.toast('设置成功');
                })
            }
            
        } else if(canteentype == '2'){
            //餐食支付页面进入，选择吃饭食堂
            var canteenguid = Zepto(_this).attr('canteenguid');
            var canteenname = Zepto(_this).find('.em-name').text();
            ejs.page.close({
                // 也支持传递字符串
                resultData: {
                    canteenname: canteenname,
                    canteenguid:canteenguid
                },
                success: function(result) {
                },
                error: function(error) {}
            });
        }
    });

    // 拖拽功能 暂时隐藏
    // var example1 = document.getElementsByClassName('em-content')[0];
    // console.log(example1)
    // new Sortable(example1, {
    //     animation: 150,
    //     ghostClass: 'blue-background',
    //     draggable: ".em-list",
    //     onEnd:function(evt){
    //         console.log(evt)
    //         console.log(evt.oldIndex)
    //         console.log(evt.newIndex)
    //         var oldIndex = evt.oldIndex;
    //         var newIndex = evt.newIndex;
    //         var currtemp = listdata[oldIndex]
    //         if(oldIndex<newIndex){
    //             for(var i=oldIndex;i<newIndex;i++){
    //                 listdata[i] = listdata[i+1];
    //             }
    //         } else if(oldIndex > newIndex){
    //             for(var i=oldIndex;i>newIndex;i--){
    //                 listdata[i] = listdata[i-1];
    //             }
    //         }
    //         listdata[newIndex] = currtemp;
    //         console.log(listdata)
    //     }
    // });
 }

//获取食堂列表
 function getcanteen(){
    common.ajax({
        url: Config.epointAccountNewUrl +'cashRegister/getCanteenInfo',
        data: {
            keyword:keyword
        },
        isShowWaiting: false
    },
    function (result) {
        if (result.status.code === '1') {
            if(result.custom && result.custom.voucherlist){
                var data = result.custom.voucherlist;
                var template =  document.getElementById('list-template').innerHTML;
                var html = '';
                mui.each(data,function(key,value){
                    if(value.isdefault == '1'){
                        value.imgsrc = './img/img_star_checked.png';
                    } else{
                        value.imgsrc = './img/img_star.png';
                    }
                    html += Mustache.render(template, value);
                })
                Zepto('.em-list-div').html(html);
                Zepto('.mui-content').removeClass('mui-hidden');
            }
        }
    },
    function (error) {
        ejs.ui.toast(Config.TIPS_II);
    }, {
        isDebug: true
    });
 }

 //设置默认食堂
 function chooseCanteen(canteenguid,callback){
    common.ajax({
        url: Config.epointAccountNewUrl +'cashRegister/setDefaultCanteen',
        data: {
            canteenguid:canteenguid
        },
        isShowWaiting: false
    },
    function (result) {
        if (result.status.code === '1') {
                callback && callback()
            }
    },
    function (error) {
        ejs.ui.toast(Config.TIPS_II);
    }, {
        isDebug: true
    });
    
 }

//  判断是午饭还是晚饭时间
 function judgetime(){
    var date = new Date();
    var time = date.getHours() + '.' + date.getMinutes();
    if(canteentype == '1'){
        Zepto('.em-title').text('设置默认食堂');
    }else if(time >= Config.lunchstarttime && time <= Config.lunchendtime){
        Zepto('.em-title').text('食堂选择');
    }
    else if(time >= Config.supperstarttime && time <= Config.supperendtime){
        Zepto('.em-title').text('食堂选择');
    }
 }
 
 
})(document, window.Config, window.Util);