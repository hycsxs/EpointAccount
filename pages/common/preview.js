/**
 * 作者： 孙尊路
 * 创建时间： 2017/06/16 13:27:09
 * 版本： [1.0, 2017/6/16]
 * 版权： 江苏国泰新点软件有限公司
 * 描述： 文件在线预览和下载通用方法
 */

'use strict';

var preview = window.preview || (function (exports, undefined) {

	/**
	 * 在线预览文件
	 */
	exports.openPreviewUrl = function (options) {
		var self = this;
		// 默认
		options = {
			url: options.url || 'default url',
			data: options.data || {},
			successCB: options.successCB || function () { },
			errorCB: options.errorCB || function () { },
			isDebug: options.isDebug || false,
			fileName: options.fileName || '',
			reDownloaded: options.reDownloaded || '1'
		};
		// var attachfilename = escape(options.fileName);
		var attachfilename = options.fileName;
		var filePreviewFormat = 'doc,docx,rtf,xls,xlsx,ppt,pptx,pdf,zip,rar,7z,wps,txt,png,jpg,jpeg,gif';

		// 后缀名：suffix
		var suffix = Util.getPathSuffix(attachfilename);

		// alert(filePreviewFormat.indexOf(suffix));
		// 后缀是否支持预览
		if (filePreviewFormat.indexOf(suffix.toLowerCase()) != '-1' || attachfilename == '') {

			ejs.util.getPreviewUrl({
				success: function (result) {
					console.log(result)
					var previewUrl = result.previewUrl;
					// 判断预览前缀url是否有furl字段
					var urlType = previewUrl.match(/furl=/);
					var tempUrl;

					if (attachfilename) {
						// 2020年10月13日15:27:34 ysjie 编译过的字符超过255就会导致windows电脑附件下载报错，365无法正常预览，截取 附件前20个字符
						if (attachfilename.length > 20) {
							attachfilename = attachfilename.substr(0, 20);
						}
						attachfilename = encodeURIComponent(attachfilename) + '(' + self.getGuid(options.url) + ')';
					}
					ejs.util.invokePluginApi({
						path: 'contact.provider.serverOperation',
						dataMap: {
							method: 'getPersonalDetailInfo',
						},
						success: function (result) {
							var jsonstr = result;
							var username = result.displayname;
							var ouname = result.ouname;
							
							options.url = options.url.replace(/\?/g, '&');

							if (urlType && urlType.length > 0 && attachfilename) {
								// 开启新预览模式预览附件，解决缓存问题
								previewUrl = previewUrl.replace(/furl=/, '');
								tempUrl = previewUrl + '?fname=' + attachfilename + "&tp=1;" + username + "," + ouname + '&furl=' + options.url;
							} else {
								// previewUrl = previewUrl.replace(/furl=/, '');
								tempUrl = previewUrl + '?fname=' + attachfilename + '&furl=' + options.url;
							}

							if (options.isDebug) {
								ejs.ui.showDebugDialog(tempUrl);
							}

							ejs.auth.getToken({
								success: function (result) {
									tempUrl +=
										'&access_token=' +
										result.access_token +
										'&ejs_pagetitle=' +
										options.fileName +
										'&ejs_orientation=-1';
									console.log('跳转地址：', tempUrl)
									console.log('跳转地址：', encodeURI(tempUrl))

									ejs.page.open({
										pageUrl: ejs.os.ios ? encodeURI(tempUrl) : tempUrl,
										orientation: -1,
										pageStyle: 1,
										success: function (result) {
											options.successCB && options.successCB(result);
										},
									});
								},
								error: function (error) {
									callback('');
								}
							});
						},
						error: function (err) {
							alert(JSON.stringify(err));
							// err 错误信息
						}
					});
				},
				error: function (error) { }
			});

		} else {
			preview.downloadFile({
				url: options.url,
				fileName: options.fileName,
				reDownloaded: options.reDownloaded,
				isBackground: 0
			}, function () {
				ejs.ui.toast('文件下载完成');
			});
		}

	};
	exports.getGuid = function (url) {
		return url.replace(/^.+?attachguid=/i, '');
	};
	/**
	 * 文件下载
	 */
	exports.downloadFile = function (options, success) {
		if (options.isBackground || options.isBackground == 0) {
			options.isBackground = options.isBackground.toString();
		} else {
			options.isBackground = "1";
		}
		/*options.isBackground = options.isBackground.toString() || '1';*/
		// 仅在后台静默下载时有用，请慎重使用，如果有参数(譬如为1)，代表下载后强制打开，默认请不要传递
		options.openAfterComplete = options.openAfterComplete || '1';
		// 默认为1，后台下载，显示进度条
		if (options.isBackground == '1') {
			// 开启进度条
			ejs.ui.showWaiting('努力下载中...');
		}
		// 开始下载
		ejs.io.downloadFile({
			// 下载地址
			url: options.url,
			// 文件名。必须带后缀。如果为空，会根据url地址或者头文件中读取出文件名。
			fileName: options.fileName,
			// 默认为1，是否后台下载，为0时，会跳转到"附件管理模块"下载。如果没有附件管理模块，请设置为1
			isBackground: options.isBackground,
			// 如果本地已有该文件是否重新下载。默认为0(直接打开文件)，为1时重新下载文件并且重命名。
			reDownloaded: options.reDownloaded || '1',
			openAfterComplete: options.openAfterComplete,
			success: function (result) {
				if (options.isBackground == '1') {
					// 关闭进度条
					ejs.ui.closeWaiting();
				}
				if (options.openAfterComplete != '1') {
					if (success && typeof (success) === 'function') {
						success(result);
					}
				}

			},
			error: function (error) {
				ejs.ui.toast('下载错误' + JSON.stringify(error));
				ejs.ui.closeWaiting();
			}

		});
	};

	/**
	 * 兼容require
	 */
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = exports;
	} else if (typeof define === 'function' && (define.amd || define.cmd)) {
		define(function () {
			return exports;
		});
	}

	return exports;
})({});