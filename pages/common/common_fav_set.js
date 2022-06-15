/**
 * 作者：Gejie
 * 创建时间：2020/12/24
 * 版本：[1.0, 2020/12/24]
 * 版权：江苏国泰新点软件有限公司
 * 描述：重写收藏设置的弹窗
 * 如需排序，则需要引入Sortable.js，并在业务模块中new实例
 */
(function() {
    var defaultSetting = {
        container: document.body,
        HTML: '<div class="mask opacity0"></div>\
                <div class="content translateY100p">\
                    <div class="em-favset-pop-top">\
                        <div class="title">名称</div>\
                        <div class="name">\
                            <input type="text" id="fav-title" placeholder="请输入" value="关于园区推广网上协同办公平台及产品深入">\
                            <span class="em-disabled mui-hidden"></span>\
                        </div>\
                    </div>\
                    <div class="em-favset-pop-bottom ">\
                        <div class="em-favset-pop-bottom-title">\
                            <span class="name">请选择收藏夹</span>\
                            <span class="manage">管理</span>\
                        </div>\
                        <ul class="em-favset-pop-bottom-list"></ul>\
                    </div>\
                    <div class="em-favset-pop-button ">\
                        <button class="cancel">取消</button>\
                        <button class="confirm">确定</button>\
                    </div>\
                </div>\
                <div class="em-manage-frame translateY100p">\
                    <div class="em-manage-list mui-table-view">\
                        <div class="mui-table-view-cell item disabled"' + 'folderguid="">\
                            <div class="mui-slider-handle info">\
                                <div class="em-fav-icon action">\
                                    <img src="../common/img/default/icon_fav_action_v1.png" class="mui-hidden" alt="">\
                                </div>\
                                <div class="em-fav-info"><span class="folder-name handle">我的收藏</span><span class="num"></span></div>\
                                <div class="em-fav-icon edit">\
                                    <img src="../common/img/default/icon_fav_edit_v1.png" class="mui-hidden" alt="">\
                                </div>\
                            </div>\
                        </div>\
                        <div id="manage-list"></div>\
                    </div>\
                    <div class="em-manage-bottom-btn"><button class="add">创建收藏夹</button>\
                </div>\
                </div>\
            <div class="em-edit-frame translateY100p">\
                <div class="em-edit-frame-header">\
                        <span class="action cancel">取消</span>\
                        <span class="title">创建收藏夹</span>\
                        <span class="action confirm">完成</span>\
                    </div>\
                    <div class="em-edit-frame-main">\
                        <input type="text" placeholder="请输入收藏夹名称（8个字以内）" class="em-input" maxlength="8">\
                    </div>\
                </div>',
    };

    /**
     * 构造函数
     * @param {Object} options 配置参数
     */
    function FavSet(options) {
        options = Util.extend({}, defaultSetting, options);

        if (typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }
        
        this.options = options;
        this.container = options.container;
        this._init();
    }

    FavSet.prototype = {
        /**
         * 初始化
         */
        _init: function() {
            var self = this;
            var oDiv = document.createElement('div');
            var node = document.querySelector('.mui-content');
    
            oDiv.classList.add('em-favset-pop');
            oDiv.classList.add('mui-hidden');
            oDiv.innerHTML = this.options.HTML;
    
            this.container.insertBefore(oDiv, node);

            this._addListener();
            this._getDataByAjax(function(res) {
                self._renderFavList(res);
            });

            this.getClientTypeList();

            self.popframe = document.querySelector('.em-favset-pop');
            self.mask = document.querySelector('.em-favset-pop').querySelector('.mask');

            // 外部传入相关的回调（需要在某些方法后调用）
            if (self.options.addFavorites) {
                self.addFavoritesCallback = self.options.addFavorites.fn;
            }

            if (self.options.updateFavorites) {
                self.updateFavoritesCallback = self.options.updateFavorites.fn;
            }

            // 初始化长按拖动
            new Sortable(document.getElementById('manage-list'), {
                animation: 300,
                filter: '.disabled',
                handle: '.handle',
                dropBubble: true,
                dragoverBubble: true,
                scroll: true,
                // 元素被选中
                onChoose: function (/**Event*/evt) {
                    // evt.oldIndex;  // element index within parent
                    console.log('元素被选中')
                },
            
                // 元素未被选中的时候（从选中到未选中）
                onUnchoose: function(/**Event*/evt) {
                    // same properties as onEnd
                    console.log('元素未被选中')
                },
            
                // 开始拖拽的时候
                onStart: function (/**Event*/evt) {
                    // evt.oldIndex;  // element index within parent
                    console.log('开始拖拽');

                    document.querySelector('.em-manage-list').classList.add('ischange');
                },
            
                // 结束拖拽
                onEnd: self.debounce(function() {
                    var manageList = document.querySelector('.em-manage-list');
                    var folderlist = [];
                    var itemNodes = manageList.querySelectorAll('.item');

                    [].forEach.call(itemNodes, function(el, i) {
                        console.log(i)
                        console.log(el.getAttribute('folderguid'))

                        if (!el.classList.contains('disabled')) {
                            var folderguid = el.getAttribute('folderguid');

                            folderlist.push({
                                folderguid: folderguid,
                                ordernumber: itemNodes.length - i,
                            })
                        }
                    });
                    console.log(folderlist)

                    self._sortFavFolder(folderlist);
                }, 2000),
            });
        },

        /**
         * 注册监听
         */
        _addListener: function() {
            var self = this;

            // 勾选
            mui('body').on('tap', '.em-favset-pop-bottom-list .item', function() {
                var _this = this;
                var itemNodes = _this.parentNode.querySelectorAll('.item');

                [].forEach.call(itemNodes, function(el) {
                    el.classList.remove('active');
                });

                _this.classList.add('active');
            });

            // 底部按钮点击
            mui('body').on('tap', '.em-favset-pop-button button', function() {
                var _this = this;
                var activeItemNode = _this.parentNode.parentNode.querySelector('.em-favset-pop-bottom-list').querySelector('.item.active');

                if (_this.classList.contains('cancel')) {
                    self.hideFrame();
                } else if (_this.classList.contains('confirm')) {
                    if (self.callback && typeof((self.callback) === 'function')) {
                        self.callback(activeItemNode.getAttribute('folderguid'));
                    } else {
                        self.hideFrame();
                    }
                }

                self.inputBlur();
            });

            // 点击遮罩
            mui('body').on('tap', '.em-favset-pop .mask', function() {
                self.hideFrame();
            });

            // 新建收藏夹（显示编辑弹窗）
            mui('body').on('tap', '.em-manage-bottom-btn .add', function() {
                self.showFavEditPop('add');
            });

            // 点击收藏夹管理，预留
            // mui('body').on('tap', '.em-favset-pop .manage', function() {
            //     // self.showManageList();
            // });

            // 编辑文件夹（显示编辑弹窗）
            mui('body').on('tap', '.em-manage-frame .em-fav-icon.edit', function() {
                var _this = this;
                var oParNode = _this.parentNode;
                var folderName = oParNode.querySelector('.folder-name').innerText;
                var folderGuid = oParNode.parentNode.getAttribute('folderguid');

                self.showFavEditPop('update', folderName, folderGuid);
            });

            // 编辑弹窗-确认/取消
            mui('body').on('tap', '.em-edit-frame .action', function() {
                var _this = this;
                var frameNode = document.querySelector('.em-edit-frame');
                var inputNode = frameNode.querySelector('.em-input');
                var inputValue = '';
                var folderguid = '';

                self.inputBlur();

                if (_this.classList.contains('cancel')) { // 取消
                    self.hideFrame();
                } else if (_this.classList.contains('confirm')) { // 完成
                    inputValue = inputNode.value.trim();

                    if (!inputValue) {
                        ejs.ui.toast('请输入文件夹名称');
        
                        return;
                    }

                    if (frameNode.classList.contains('add')) { // 此时是新增
                        self.addFavFolder(inputValue, self.addFavoritesCallback);
                    } else if (frameNode.classList.contains('update')) { // 此时是修改
                        folderguid = frameNode.getAttribute('folderguid');

                        // 如果外部传入了需要执行的回调，则需要获取相关的参数
                        if (self.updateFavoritesCallback) {
                            self.editFavoritesParams = {
                                folderguid: self.folderguid
                            }
                        }

                        self.updateFavFolder(folderguid, inputValue, self.updateFavoritesCallback);
                    }
                }
            });

            // 删除收藏夹
            mui('body').on('tap', '.em-manage-list .delete', function() {
                var _this = this;
                var folderguid = _this.parentNode.parentNode.getAttribute('folderguid');
                var total = _this.parentNode.parentNode.getAttribute('total');
                var message = '';

                if (total == 0) {
                    message = '是否删除该收藏夹'
                } else {
                    message = '该收藏夹下的内容将被清空，是否确认删除？'
                }

                ejs.ui.confirm({
                    title: "提示",
                    message: message,
                    buttonLabels: ['取消', '确定'],
                    cancelable: 1,
                    h5UI: false,
                    success: function(result) {
                        if (result.which == 1) {
                            // 如果外部传入了需要执行的回调，则需要获取相关的参数
                            if (self.updateFavoritesCallback) {
                                self.editFavoritesParams = {
                                    folderguid: self.folderguid
                                }
                            }

                            self.deleteFavFolder(folderguid, self.updateFavoritesCallback);
                        }
                    },
                    error: function(err) {}
                });
            });

            // 返回键监听，预留该功能
            // ejs.navigator.hookBackBtn({
            //     success: function(result) {
            //         var editFrame = document.querySelector('.em-edit-frame'); // 收藏夹编辑弹窗
            //         var manageListFrame = document.querySelector('.em-manage-frame'); // 收藏管理列表

            //         if (!manageListFrame.classList.contains('translateY100p') && editFrame.classList.contains('translateY100vh')) { // 此时只显示列表，未显示编辑弹窗，则直接隐藏所有的收藏部分
            //             self.hideFrame();
            //         } else if (!manageListFrame.classList.contains('translateY100p') && !editFrame.classList.contains('translateY100vh')) { // 此时显示列表，同时也显示编辑弹窗，则直接隐藏编辑弹窗
            //             self.hideFavEditPop();
            //         } else if (manageListFrame.classList.contains('translateY100p') && editFrame.classList.contains('translateY100vh')) { // 此时未显示列表，也未显示编辑弹窗，则直接关闭页面
            //             ejs.page.close({
            //                 // 也支持传递字符串
            //                 resultData: {
            //                     key: 'value2'
            //                 },
            //                 success: function (result) {}
            //             });
            //         }
            //     }
            // });

            // 返回键监听(安卓底部自带的返回键)，预留该功能
            // ejs.navigator.hookSysBack({
            //     success: function(result) {
            //         var editFrame = document.querySelector('.em-edit-frame'); // 收藏夹编辑弹窗
            //         var manageListFrame = document.querySelector('.em-manage-frame'); // 收藏管理列表

            //         if (!manageListFrame.classList.contains('translateY100p') && editFrame.classList.contains('translateY100vh')) { // 此时只显示列表，未显示编辑弹窗，则直接隐藏所有的收藏部分
            //             self.hideFrame();
            //         } else if (!manageListFrame.classList.contains('translateY100p') && !editFrame.classList.contains('translateY100vh')) { // 此时显示列表，同时也显示编辑弹窗，则直接隐藏编辑弹窗
            //             self.hideFavEditPop();
            //         } else if (manageListFrame.classList.contains('translateY100p') && editFrame.classList.contains('translateY100vh')) { // 此时未显示列表，也未显示编辑弹窗，则直接关闭页面
            //             ejs.page.close({
            //                 // 也支持传递字符串
            //                 resultData: {
            //                     key: 'value2'
            //                 },
            //                 success: function (result) {}
            //             });
            //         }
            //     }
            // });
        },

        /**
         * 个性化对外暴露的点击管理的事件
         * @param {Function} callback 
         */
        _addManageClick: function(callback) {
            // 点击收藏夹管理
            mui('body').on('tap', '.em-favset-pop .manage', function() {
                // self.showManageList();
                callback && callback()
            });
        },

        /**
         * 获取数据
         */
        _getDataByAjax: function(callback) {
            var self = this;

            // 获取收藏夹
            common.ajax({
                url: 'collectfolder_list_v7',
                data: {
                    currentpageindex: '-1',
                    currentpagesize: '-1'
                },
                isShowWaiting: false
            }, function (result) {
                var tmpInfo = [];

                if (result.status.code == '1') {
                    tmpInfo = result.custom.folderlist;

                    for (var i = 0, len = tmpInfo.length; i < len; i++) {
                        if (i === 0) {
                            self.defaultFolderguid = tmpInfo[i].folderguid;

                            document.querySelector('.em-manage-list').querySelectorAll('.item')[0].setAttribute('folderguid', tmpInfo[i].folderguid);
                            document.querySelector('.em-manage-list').querySelectorAll('.item')[0].querySelector('.folder-name').innerText = tmpInfo[i].foldername;
                            document.querySelector('.em-manage-list').querySelectorAll('.item')[0].querySelector('.num').innerText = tmpInfo[i].total > 0 ? '(' + tmpInfo[i].total + ')' : '';
                        }

                        tmpInfo.sort(function(a, b) {
                            return b.ordernumber - a.ordernumber;
                        })
                    }

                    self.folderlist = tmpInfo;
                } else {
                    ejs.ui.toast(result.status.text);
                }

                callback && callback(tmpInfo);
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 渲染收藏夹列表
         * @param {Array} list 需要渲染的列表
         */
        _renderFavList: function(list) {
            var frameNode = document.querySelector('.em-favset-pop-bottom-list'); // 存在数据的节点
            var manageListNode = document.querySelector('#manage-list'); // 管理列表数据容器节点
            var favData = !list || list.length <= 0 ? [{ // 测试数据
                foldername: '我的收藏',
                folderguid: 'ae19f4f3-5eb7-4da5-9c9e-fa4d703674fb',
                total: '11',
                ismr: 1,
            }, {
                foldername: '业务培训',
                folderguid: '11111',
                total: '119',
                ismr: 0
            }, {
                foldername: '规章制度',
                folderguid: '22222',
                total: '9',
                ismr: 0
            }, {
                foldername: '规范',
                folderguid: '33333',
                total: '3',
                ismr: 0
            }] : list;
            var html1 = '';
            var html2 = '';

            for (var i = 0, len = favData.length; i < len; i++) {
                if (!favData[i].total || favData[i].total == '0') {
                    favData[i].numshow = 'mui-hidden';
                }

                if (i === 0) {
                    favData[i].active = 'active';
                } else {
                    favData[i].active = '';

                    html2 += '<div class="mui-table-view-cell item"' + 'folderguid="' + favData[i].folderguid + '"' + 'total ="' + favData[i].total + '">\
                            <div class="mui-slider-right mui-disabled disabled">\
                                <a class="mui-btn mui-btn-red delete">删除</a>\
                            </div>\
                            <div class="mui-slider-handle info">\
                                <div class="em-fav-icon action">\
                                    <img src="../common/img/default/icon_fav_action_v1.png" class="handle" alt="">\
                                </div>\
                                <div class="em-fav-info"><span class="folder-name handle">' + favData[i].foldername + '</span><span class="num ' + favData[i].numshow + '">(' + favData[i].total + ')</span></div>\
                                    <div class="em-fav-icon edit">\
                                        <img src="../common/img/default/icon_fav_edit_v1.png" alt="">\
                                    </div>\
                                </div>\
                          </div>';
                }

                html1 += '<li class="item ' + favData[i].active + '"folderguid=' + favData[i].folderguid + '>\
                            <div class="icon">\
                                    <img src="../common/img/default/icon_tpgl_check_f.png" alt="" class="em-favset-check-icon check">\
                                    <img src="../common/img/default/icon_tpgl_checked_s.png" alt="" class="em-favset-check-icon checked">\
                                </div>\
                                <div class="name"><span class="folder-name">' + favData[i].foldername + '</span><span class="num ' + favData[i].numshow + '">(' + favData[i].total + ')</span></div>\
                        </li>';
                
            }

            frameNode.innerHTML = html1;
            manageListNode.innerHTML = html2;
        },

        /**
         * 刷新收藏夹，对外使用
         * @param {Function} callback 
         */
        refresh: function(callback) {
            var self = this;

            self._getDataByAjax(function(res) {
                self._renderFavList(res);

                callback && callback();
            });
        },

         /**
         * 添加收藏
         * @param {String} title 业务标题
         * @param {String} typeid 业务标识 例如：邮件：mail；分类信息审核webinfo
         * @param {Array} data 需要添加的业务参数，格式参考：[{"pviguid":"1234"},{"wdguid":"5678"}]
         * @param {Function} callback 回调
         */
        addFav: function(title, typeid, data, callback) {
            var self = this;
            
            common.ajax({
                url: 'attentioncollect_add_v7',
                data: {
                    title: title,
                    folderguid: self.defaultFolderguid || '',
                    typeid: typeid, 
                    clientinfo: data,
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    callback && callback(result.custom.collectguid)
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },
        
        /**
         * 更新收藏
         * @param {String} title 更新的标题
         * @param {String} collectguid 收藏标识
         * @param {String} folderguid 文件夹标识
         */
        updateFav: function(collectguid, folderguid) {
            return new Promise(function(resolve, reject) {
                common.ajax({
                    url: 'attentioncollect_update_v7',
                    data: {
                        title: document.querySelector('#fav-title').value.trim(),
                        collectguid: collectguid,
                        folderguid: folderguid
                    },
                    isShowWaiting: true
                }, function (result) {
                    if (result.status.code == '1') {
                        resolve();
                    } else {
                        ejs.ui.toast(result.status.text);

                        reject();
                    }
                }, function (error) {
                    console.log(error);
                    reject();
                }, {
                    isDebug: false
                });
            })
        },

        /**
         * 取消收藏
         * @param {String} collectguid 收藏标识
         * @param {Function} callback 回调
         */
        cancelFav: function(collectguid, callback) {
            common.ajax({
                url: 'attentioncollect_delete_v7',
                data: {
                    collectguids: collectguid, // 收藏标识
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    ejs.ui.toast('已取消收藏');

                    callback && callback();
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 转移收藏
         * @param {String} collectguid 收藏标识
         * @param {String} folderguid 文件夹标识
         */
        transferFav: function(collectguid, folderguid) {
            return new Promise(function(resolve, reject) {
                common.ajax({
                    url: 'attentioncollect_transfer_v7',
                    data: {
                        collectguids: collectguid,
                        folderguid: folderguid
                    },
                    isShowWaiting: true
                }, function (result) {
                    if (result.status.code == '1') {
                        resolve();
                    } else {
                        ejs.ui.toast(result.status.text);

                        reject();
                    }
                }, function (error) {
                    console.log(error);
                    reject();
                }, {
                    isDebug: false
                });
            })
        },

        /**
         * 新增收藏夹
         * @param {String} foldername 文件夹名称
         * @param {Function} callback 回调
         */
        addFavFolder: function(foldername, callback) {
            var self = this;

            common.ajax({
                url: 'collectfolder_add_v7',
                data: {
                    foldername: foldername
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    self._getDataByAjax(function(res) {
                        ejs.ui.toast('新增成功!');

                        self._renderFavList(res);
                        self.hideFavEditPop();
                        self.inputBlur();

                        callback && callback(self.editFavoritesParams);
                    });
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 修改文件夹
         * @param {String} folderguid 文件夹guid
         * @param {String} foldername 文件夹名称
         * @param {Function} callback 回调
         */
        updateFavFolder: function(folderguid, foldername, callback) {
            var self = this;

            if (!foldername) {
                ejs.ui.toast('请输入文件夹名称');

                return;
            }

            common.ajax({
                url: 'collectfolder_update_v7',
                data: {
                    folderguid: folderguid,
                    foldername: foldername,
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    self._getDataByAjax(function(res) {
                        ejs.ui.toast('操作成功!');

                        self._renderFavList(res);

                        self.hideFavEditPop();

                        callback && callback(self.editFavoritesParams);
                    });
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 收藏夹排序
         * @param {Array} folderlist 需要排序的数组
         * @param {Function} callback 回调
         * folderlist包含字段folderguid：收藏夹guid；ordernumber：序号
         */
        _sortFavFolder: function(folderlist, callback) {
            if (!folderlist || (Array.isArray(folderlist) && folderlist.length <= 1)) {
                return
            }

            common.ajax({
                url: 'collectfolder_save_v7',
                data: {
                    folderlist: folderlist
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    callback && callback();
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 删除收藏夹
         * @param {String} folderguid 收藏夹guid
         * @param {Function} callback 回调
         */
        deleteFavFolder: function(folderguid, callback) {
            var self = this;
            
            common.ajax({
                url: 'collectfolder_delete_v7',
                data: {
                    folderguid: folderguid,
                },
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    self._getDataByAjax(function(res) {
                        ejs.ui.toast('删除成功!');

                        self._renderFavList(res);
                        
                        callback && callback(self.editFavoritesParams);
                    });
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 获取业务类别
         */
        getClientTypeList: function() {
            var self = this;
            
            common.ajax({
                url: 'getClientTypeList_v7',
                data: {},
                isShowWaiting: true
            }, function (result) {
                if (result.status.code == '1') {
                    
                } else {
                    ejs.ui.toast(result.status.text);
                }
            }, function (error) {
                console.log(error);
            }, {
                isDebug: false
            });
        },

        /**
         * 隐藏
         */
        hideFrame: function() {
            var self = this;

            self.inputBlur();

            // 此时正在进行收藏夹新增或者修改的操作，则只对编辑文件夹的dom进行操作
            if (!self.popframe.querySelector('.em-edit-frame').classList.contains('translateY100p')) {
                if (self.popframe.querySelector('.em-manage-frame').classList.contains('translateY100p')) { // 没有显示收藏管理列表，说明此时是某个页面上直接调用了showFavEditPop
                    self.hideAll();
                } else if (!self.popframe.querySelector('.em-manage-frame').classList.contains('translateY100p')) { // 显示了收藏管理列表
                    self.hideFavEditPop();
                }
            } else {
                self.hideAll();
            }
        },

        /**
         * 隐藏所有收藏相关
         */
        hideAll: function() {
            var self = this;

            self.mask.classList.add('opacity0');
            self.popframe.querySelector('.content').classList.add('translateY100p');
            self.popframe.querySelector('.em-manage-frame').classList.add('translateY100p');
            self.popframe.querySelector('.em-edit-frame').classList.add('translateY100p'); 
            self.popframe.querySelector('.em-edit-frame').classList.remove('update'); 
            self.popframe.querySelector('.em-edit-frame').classList.remove('add'); 

            self.popframe.querySelector('.em-edit-frame').setAttribute('foldername', '');
            self.popframe.querySelector('.em-edit-frame').setAttribute('folderguid', '');

            setTimeout(function() {
                self.popframe.classList.add('mui-hidden');
                self.mask.classList.remove('mui-hidden');
            }, 350);
        },

        /**
         * 显示收藏设置
         * @param {String} title 显示的名称
         * @param {String} ishowmask open/close 是否需要显示遮罩（部分业务中已存在遮罩）
         * @param {String} folderguid 当前收藏夹的guid
         * @param {String} callback 回调
         * @param {Object} params 外部业务模块传入的参数
         */
        showSetFrame: function(title, ishowmask, folderguid, callback) {
            var self = this;

            // 如果传了title，则赋值
            if (title) {
                document.querySelector('.em-favset-pop-top input').value = title;
                document.querySelector('.em-favset-pop-top').classList.remove('mui-hidden');
            } else { // 如果没传title，说明此时不需要显示头部名称，隐藏
                document.querySelector('.em-favset-pop-top input').value = '';
                document.querySelector('.em-favset-pop-top').classList.add('mui-hidden');
            }

            // 需要弹窗
            if (ishowmask === 'open') {
                self.mask.classList.remove('opacity0');
            } else if (ishowmask === 'close') { // 不需要弹窗
                self.mask.classList.add('opacity0');
            }

            self.popframe.classList.remove('mui-hidden');

            setTimeout(function() {
                self.popframe.querySelector('.content').classList.remove('translateY100p');
            }, 10);

            // 选中对应的收藏夹
            if (folderguid) {
                self.folderguid = folderguid;

                var nodes = document.querySelector('.em-favset-pop-bottom-list').querySelectorAll('.item');

                [].forEach.call(nodes, function(el) {
                    el.classList.remove('active');

                    if (el.getAttribute('folderguid') === folderguid) {
                        el.classList.add('active');
                    }
                })
            }

            callback ? self.callback = callback : self.callback = null;
        },

        /**
         * 收藏管理列表显示
         */
        showManageList: function() {
            var self = this;

            self.popframe.classList.contains('mui-hidden') ? self.popframe.classList.remove('mui-hidden') : '';

            self.popframe.querySelector('.content').classList.add('translateY100p');
            self.popframe.querySelector('.em-edit-frame').classList.add('translateY100p');
            self.popframe.querySelector('.em-manage-frame').classList.remove('translateY100p');

            self.mask.classList.add('opacity0');

            setTimeout(function() {
                self.mask.classList.add('mui-hidden');
            }, 250);
        },

        /**
         * 显示收藏夹编辑的弹窗
         * @param {String} type 类型：add/update
         * @param {String} foldername 文件夹名称 注：只有修改操作时才有值
         * @param {String} folderguid 文件夹类型 注：只有修改操作时才有值
         * @param {Function} fn 外部业务传入的方法
         * @param {Object} params 外部业务传入的参数
         */
        showFavEditPop: function(type, foldername, folderguid, fn, params) {
            var self = this;

            self.popframe.classList.remove('mui-hidden');
            self.popframe.querySelector('.content').classList.add('translateY100p');
            self.popframe.querySelector('.em-edit-frame').classList.remove('translateY100p');
            self.popframe.querySelector('.em-edit-frame').classList.add(type);


            self.popframe.querySelector('.em-edit-frame').setAttribute('foldername', foldername ? foldername : '');
            self.popframe.querySelector('.em-edit-frame').setAttribute('folderguid', folderguid ? folderguid : '');
            self.popframe.querySelector('.em-edit-frame').querySelector('.em-edit-frame-header .title').innerText = type === 'update' ? '修改收藏夹' : '创建收藏夹';

            self.popframe.querySelector('.em-edit-frame').querySelector('.em-input').value = foldername ? foldername : '';
            self.popframe.querySelector('.em-edit-frame').querySelector('.em-input').focus();
            self.mask.classList.remove('mui-hidden');

            setTimeout(function() {
                self.mask.classList.remove('opacity0');
            }, 10);

            // 外部业务传入，如果没有传，则不需要
            params ? self.editFavoritesParams = params : self.editFavoritesParams = null;
        },

        /**
         * 隐藏收藏夹编辑的弹窗
         */
        hideFavEditPop: function() {
            var self = this;

            // 此时外部业务模块中单独调用了新增、修改收藏夹的功能，隐藏全部
            if (self.popframe.querySelector('.em-manage-frame').classList.contains('translateY100p')) {
                self.hideAll();
            } else {
                self.popframe.querySelector('.em-edit-frame').classList.add('translateY100p'); 
                self.popframe.querySelector('.em-edit-frame').classList.remove('update'); 
                self.popframe.querySelector('.em-edit-frame').classList.remove('add'); 

                self.popframe.querySelector('.em-edit-frame').setAttribute('foldername', '');
                self.popframe.querySelector('.em-edit-frame').setAttribute('folderguid', '');
                self.popframe.querySelector('.em-edit-frame').querySelector('.em-edit-frame-header .title').innerText = '创建收藏夹';

                self.mask.classList.add('opacity0');

                setTimeout(function() {
                    self.mask.classList.add('mui-hidden');
                }, 250);
            }
        },

        /**
         * 取消所有input焦点
         */
        inputBlur: function () {
            var inputNodes = document.querySelectorAll('input');

            [].forEach.call(inputNodes, function(el) {
                el.blur();
            })

            window.scrollTo(0, 0);
        },

        /**
         * 防抖
         * @param {Function} fn 需要执行的函数
         * @param {*} wait 等待时间
         */
        debounce: function(fn, wait) {
            var timer = null;

            return function () {
                clearTimeout(timer);

                timer = setTimeout(function() {
                    fn();
                }, wait);
            }
        },

        /**
         * 获取当前样式
         * @param {Object} element 元素对象
         * @param {Object} att 属性名
         * @return {String} 属性值
         */
        getStyle: function (element, att) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(element)[att];
            } else {
                return element.currentStyle[att];
            }
        },
    }

    window.FavSet = FavSet;
})();