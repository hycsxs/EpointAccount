/**
 * 作者： 夏云涛
 * 时间： 2021-5-25 10:09:34
 * 版本： [1.0  2022-5-25]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 交易明细
 */

var pagesize = '15',
    // 下拉刷新对象
    pullToRefreshToolObj;

(function(doc, Config, Util) {
    'use strict';
    
    Util.loadJs([
        'pages/common/common.js',

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
                initListeners();
                // 下拉刷新
                initPullRefreshList();
            }, function(error) {});
        }
    };

    function initListeners() {}
    
    // 下拉刷新列表
    function initPullRefreshList() {
        var urlFunc = function () {
            var url = Config.epointAccountUrl + 'transItemInfo';

            return url;
        };
        // 请求参数
        var dataRequestFunc = function (currPage) {
            var requestData = {
                params: JSON.stringify({
                    pagenum: currPage,
                    pagesize: pagesize
                })
            };

            return requestData;
        };
        // 改变数据
        var dataChangeFunc = function (response) {
            var outData = response.custom.list;

            outData.forEach(function (item) {
                item.incomeType = ''; // 收入 +  支出 -
                item.incomeStyle = ''; // 收入/支出颜色样式

                if (item.transdirection === 'in') {
                    item.incomeType = '+';
                    item.incomeStyle = 'em-income';
                } else {
                    item.incomeType = '-';
                }
            });

            return outData;
        };
        // 模板
        var templateFunc = function () {
            var template = Zepto('#item-template').html();

            return template;
        };
        // 点击
        var itemClickFunc = function (e) {};

        pullToRefreshToolObj = new MiniRefreshBiz({
            isDebug: true,
            container: '#minirefresh',
            // 默认的列表数据容器选择器
            listContainer: '#listdata',
            // 得到模板 要求是一个函数(返回字符串) 或者字符串
            template: templateFunc,
            // 得到url 要求是一个函数(返回字符串) 或者字符串
            url: urlFunc,
            dataRequest: dataRequestFunc,
            dataChange: dataChangeFunc,
            itemClick: itemClickFunc,
            success: function (res, isPulldown) {
                // 手动处理渲染列表
                // 如果是下拉刷新，清空列表
                // 数据为空时！
                setTimeout(function () {
                    var dataLength = document.getElementById('listdata').querySelectorAll('li').length;

                    if (parseInt(dataLength, 10) > 0) {
                        Zepto('.em-no-data').addClass('mui-hidden');
                        Zepto('#minirefresh').removeClass('mui-hidden');
                    } else {
                        Zepto('#noDataText').text('暂无交易明细');
                        // 显示空盒子
                        Zepto('.em-no-data').removeClass('mui-hidden');
                        Zepto('#minirefresh').addClass('mui-hidden');
                    }
                }, 500);
            }
        });
    }
})(document, window.Config, window.Util);