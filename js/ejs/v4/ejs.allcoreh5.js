/*!
 * @epoint-mrc/ejsv4 v1.0.3
 * (c) 2017-2020 
 * Released under the BSD-3-Clause License.
 * 
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue'), require('vant')) :
	typeof define === 'function' && define.amd ? define(['vue', 'vant'], factory) :
	(global.ejs = factory(global.Vue,global.vant));
}(this, (function (Vue,vant) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var pickdateStyle = document.createElement('style');
pickdateStyle.textContent = '\n    .ejs-ui-pickdate .van-picker{\n        padding: 52px 0 70px;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__toolbar{\n        position: absolute;\n        width: 100%;\n        height: 70px;\n        box-sizing: border-box;\n        bottom: 0;\n        padding: 10px 20px 20px;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar button{\n        width: calc(50% - 14px);\n        border-radius: 22px;\n        font-size: 15px;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar .van-picker__cancel{\n        border: 1px solid #969799;\n        color: #2e3033;\n    }\n\n    .ejs-ui-pickdate .van-picker .van-picker__toolbar .van-picker__confirm{\n        background-color: #2463e0;\n        color: #fff;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__title{\n        position: absolute;\n        top: -300px;\n    }\n    \n    .ejs-ui-pickdate .van-picker .van-picker__columns{\n        height: 264px !important;\n        color: #2E3033;\n        border-top: 1px solid #ebedf0;\n        padding: 0 20px;\n    }\n    ';
pickdateStyle.id = 'pickdateStyle';

var pickdatetimeStyle = document.createElement('style');
pickdatetimeStyle.textContent = '\n    #ejs-ui-pickDateTime .van-picker .van-picker-column:nth-child(1){\n        flex: 2;\n    }\n';
pickdatetimeStyle.id = 'pickdatetimeStyle';

var selectStyle = document.createElement('style');
selectStyle.textContent = '\n    .ejs-ui-select .van-cell-group{\n        max-height: 376px;\n        overflow: scroll;\n    }\n    .ejs-ui-select .van-cell-group::after{\n        border: none;\n    }\n    .ejs-ui-select .van-cell-group .van-cell{\n        padding: 10px 20px;\n        font-size: 16px;\n        color: #2e3033;\n    }\n    .ejs-ui-select .van-cell-group .van-cell::after{\n        border-bottom: none;\n    }\n    .ejs-ui-select .van-cell-group .van-cell .van-radio__icon .van-icon{\n        border: none;\n    }\n    .ejs-ui-select .van-popup__close-icon{\n        color: #2e3033;\n    }\n    .ejs-ui-select .van-checkbox__icon--checked .van-icon,\n    .ejs-ui-select .van-radio__icon--checked .van-icon{\n        background-color: #2463e0;\n    }\n    .ejs-ui-select .van-cell-group .fontActive{\n        color: #2463e0;\n    }\n';
selectStyle.id = 'selectStyle';

var dialogStyle = document.createElement('style');
dialogStyle.textContent = '\n    .van-dialog{\n        border-radius: 6px;\n    }\n    .van-dialog__footer{\n        padding: 0 24px 20px;\n    }\n    .van-dialog__footer .van-button{\n        border-radius: 25px;\n        height: 40px;\n    }\n    .van-dialog__footer .van-dialog__cancel{\n        border: 1px solid #ebedf0;\n        margin-right: 16px;\n    }\n    .van-dialog__footer .van-dialog__confirm{\n        background-color: rgb(36, 99, 224);\n        color: #fff;\n    }\n    .van-dialog__message{\n        padding: 0;\n        color: #000;\n    }\n    .van-dialog__message--has-title{\n        padding: 0;\n    }\n    .van-dialog__content{\n        padding: 20px 0 28px;\n    }\n    .van-hairline--top::after{\n        border-top-width: 0;\n    }\n    .van-hairline--left::after{\n        border-left-width: 0;\n    }\n    [class*=van-hairline]::after{\n        border: none;\n    }\n';
dialogStyle.id = 'dialogStyle';

/**
 * 将小于10的数字前面补齐0,然后变为字符串返回
 * @param {Number} number 需要不起的数字
 * @return {String} 补齐0后的字符串
 */
function paddingWith0(numberStr) {
    var DECIMAL_TEN = 10;
    var number = numberStr;

    if (typeof number === 'number' || typeof number === 'string') {
        number = parseInt(number, DECIMAL_TEN);
        if (number < DECIMAL_TEN) {
            number = '0' + number;
        }

        return number;
    }

    return '';
}

var option = {
    minDate: null,
    maxDate: null
};
var nowValue = null;
var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getMonthEndDay(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}

function times(n, iteratee) {
    var index = -1;
    var result = Array(n);

    while (++index < n) {
        result[index] = iteratee(index);
    }

    return result;
}

function formatDate(year, month, date) {
    var week = weekDay[new Date(year, month - 1, date).getDay()];
    return year + '-' + paddingWith0(month) + '-' + paddingWith0(date) + ' ' + week;
}

function getBoundary(type, value) {
    var _ref = void 0;

    var boundary = option[type + 'Date'];
    var year = boundary.getFullYear();
    var month = 1;
    var date = 1;
    var hour = 0;
    var minute = 0;

    if (type === 'max') {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
    }

    if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;

        if (value.getMonth() + 1 === month) {
            date = boundary.getDate();

            if (value.getDate() === date) {
                hour = boundary.getHours();

                if (value.getHours() === hour) {
                    minute = boundary.getMinutes();
                }
            }
        }
    }

    return _ref = {}, _ref[type + 'Year'] = year, _ref[type + 'Month'] = month, _ref[type + 'Date'] = date, _ref[type + 'Hour'] = hour, _ref[type + 'Minute'] = minute, _ref;
}

function ranges() {
    var _this$getBoundary = getBoundary('max', nowValue),
        maxYear = _this$getBoundary.maxYear,
        maxDate = 31,
        maxMonth = 12,
        maxHour = _this$getBoundary.maxHour,
        maxMinute = _this$getBoundary.maxMinute;

    var _this$getBoundary2 = getBoundary('min', nowValue),
        minYear = _this$getBoundary2.minYear,
        minDate = 1,
        minMonth = 1,
        minHour = _this$getBoundary2.minHour,
        minMinute = _this$getBoundary2.minMinute;

    var result = [{
        type: 'year',
        range: [minYear, maxYear]
    }, {
        type: 'month',
        range: [minMonth, maxMonth]
    }, {
        type: 'day',
        range: [minDate, maxDate]
    }, {
        type: 'hour',
        range: [minHour, maxHour]
    }, {
        type: 'minute',
        range: [minMinute, maxMinute]
    }];

    return result;
}

function originColumns() {
    var rangesData = ranges();

    return rangesData.map(function (_ref) {
        var type = _ref.type,
            rangeArr = _ref.range;
        var values = times(rangeArr[1] - rangeArr[0] + 1, function (index) {
            var value = rangeArr[0] + index;
            return value;
        });

        return {
            type: type,
            values: values
        };
    });
}

function columns() {
    var originColumnsData = originColumns();
    var changeColumns = originColumnsData.slice(-2);
    var maxDate = option.maxDate.getDate(),
        maxMonth = option.maxDate.getMonth() + 1,
        maxYear = option.maxDate.getFullYear(),
        minDate = option.minDate.getDate(),
        minMonth = option.minDate.getMonth() + 1,
        minYear = option.minDate.getFullYear();
    var col_1 = [];

    originColumnsData[0].values.forEach(function (year) {
        originColumnsData[1].values.forEach(function (month) {
            if (maxYear === year && month > maxMonth || minYear === year && month < minMonth) {} else {
                originColumnsData[2].values.forEach(function (date) {
                    if (maxYear === year && month === maxMonth && date > maxDate || minYear === year && month === minMonth && date < minDate || date > getMonthEndDay(year, month)) {} else {
                        col_1.push(formatDate(year, month, date));
                    }
                });
            }
        });
    });

    changeColumns = [{
        type: 'day',
        values: col_1
    }].concat(changeColumns);

    return changeColumns.map(function (column) {
        var index = 0;

        if (column.type === 'day') {
            var now = formatDate(nowValue.getFullYear(), nowValue.getMonth() + 1, nowValue.getDate());
            index = column.values.indexOf(now);
        }

        if (column.type === 'hour') {
            index = column.values.indexOf(nowValue.getHours());
            column.values = column.values.map(function (ele) {
                return paddingWith0(ele);
            });
        }

        if (column.type === 'minute') {
            index = column.values.indexOf(nowValue.getMinutes());
            column.values = column.values.map(function (ele) {
                return paddingWith0(ele);
            });
        }
        return {
            values: column.values,
            defaultIndex: index
        };
    });
}

function getColumns(minDate, maxDate, innerValue) {

    option.minDate = minDate;
    option.maxDate = maxDate;
    nowValue = innerValue;

    return columns();
}

function insertFormatCSS() {
    if (!document.querySelector('#pickdateStyle')) {
        var head = document.getElementsByTagName('head')[0];

        head.appendChild(pickdateStyle);
    }
}

function uiVue(args, method) {
    var options = args[0];
    var resolve = args[1];
    var vueData = {
        type: '',
        prompt: {
            show: false,
            message: '',
            value: '',
            title: '',
            buttonLabels: '',
            hint: '',
            maxlength: '',
            autosize: null,
            cancelable: true
        },
        actionSheet: {
            show: false,
            actions: [],
            canClose: false,
            cancelable: true
        },
        pickDate: {
            show: false,
            type: '',
            value: null,
            title: '',
            minDate: null,
            maxDate: null,
            innerValue: null,
            columns: null,
            canClose: false
        },
        pickTime: {
            show: false,
            value: null,
            title: '',
            minHour: '',
            maxHour: '',
            minMinute: '',
            maxMinute: '',
            canClose: false
        },
        pickDateTime: {
            show: false,
            value: null,
            title: '',
            minDate: null,
            maxDate: null,
            innerValue: null,
            columns: null,
            canClose: false
        },
        popPicker: {
            show: false,
            columns: [],
            canClose: false
        },
        showWaiting: {
            show: false,
            message: '',
            canClose: false
        },
        select: {
            title: '',
            items: [],
            choiceState: [],
            // 由以前的true和false替换为了1和0
            isMultiSelect: 1,
            // 样式类型，默认为0。 0：单列表样式；1：九宫格样式(目前只支持单选)
            type: '',
            columns: '',
            // 可取消
            cancelable: '',
            show: false,
            value: '',
            canClose: false
        }
    };

    var datetime = options.datetime;
    var minDate = options.minDate;
    var maxDate = options.maxDate;

    if (method === 'pickDate' || method === 'pickDateTime' || method === 'pickMonth') {
        insertFormatCSS();

        if (!datetime) {
            // 如果不存在，默认为当前时间
            datetime = new Date();
        } else {
            datetime = new Date(datetime);
        }

        if (method !== 'pickDateTime') {
            if (!minDate) {
                // 如果不传
                minDate = new Date().getFullYear() - 10;
                minDate += '/01/01';
            }

            if (!maxDate) {
                maxDate = new Date().getFullYear() + 10;
                maxDate += '/12/31';
            }
        }
    }

    switch (method) {
        case 'prompt':
            if (!document.querySelector('#dialogStyle')) {
                var head = document.getElementsByTagName('head')[0];

                head.appendChild(dialogStyle);
            }
            vueData.type = 'prompt';
            vueData.prompt.message = options.message;
            vueData.prompt.value = options.text;
            vueData.prompt.title = options.title;
            vueData.prompt.buttonLabels = options.buttonLabels;
            vueData.prompt.hint = options.hint;
            vueData.prompt.maxlength = options.maxLength;
            vueData.prompt.cancelable = options.cancelable === 1;
            vueData.prompt.autosize = {
                // 一行的高度是24px
                maxHeight: options.lines * 24,
                minHeight: 24
            };
            break;
        case 'actionSheet':
            vueData.type = 'actionSheet';
            options.items = options.items.map(function (element) {
                return { name: element };
            });
            vueData.actionSheet.actions = options.items;
            vueData.actionSheet.cancelable = options.cancelable === 1;
            break;
        case 'pickDate':
            vueData.type = 'pickDate';
            vueData.pickDate.type = 'date';
            vueData.pickDate.value = datetime;
            vueData.pickDate.title = options.title;
            vueData.pickDate.minDate = new Date(minDate);
            vueData.pickDate.maxDate = new Date(maxDate);
            break;
        case 'pickMonth':
            vueData.type = 'pickDate';
            vueData.pickDate.type = 'year-month';
            vueData.pickDate.value = datetime;
            vueData.pickDate.title = options.title;
            vueData.pickDate.minDate = new Date(minDate);
            vueData.pickDate.maxDate = new Date(maxDate);
            break;
        case 'pickTime':
            insertFormatCSS();
            var _datetime = options.datetime;

            if (!_datetime) {
                // 如果不存在，默认为当前时间
                var dateNow = new Date();
                var hours = paddingWith0(dateNow.getHours());
                var minutes = paddingWith0(dateNow.getMinutes());
                _datetime = hours + ':' + minutes;
            }
            vueData.type = 'pickTime';
            vueData.pickTime.value = _datetime;
            vueData.pickTime.title = options.title;
            vueData.pickTime.minHour = options.minHour;
            vueData.pickTime.maxHour = options.maxHour;
            vueData.pickTime.minMinute = options.minMinute;
            vueData.pickTime.maxMinute = options.maxMinute;
            break;
        case 'pickDateTime':
            vueData.type = 'pickDateTime';
            if (!document.querySelector('pickdatetimeStyle')) {
                var _head = document.getElementsByTagName('head')[0];

                _head.appendChild(pickdatetimeStyle);
            }

            if (!minDate) {
                // 如果不传
                vueData.pickDateTime.minDate = new Date(datetime.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
            } else {
                vueData.pickDateTime.minDate = new Date(minDate);
            }

            if (!maxDate) {
                vueData.pickDateTime.maxDate = new Date(datetime.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
            } else {
                vueData.pickDateTime.maxDate = new Date(maxDate);
            }
            vueData.pickDateTime.value = datetime;
            vueData.pickDateTime.title = options.title;
            vueData.pickDateTime.innerValue = datetime;
            vueData.pickDateTime.columns = getColumns(vueData.pickDateTime.minDate, vueData.pickDateTime.maxDate, datetime);
            break;
        case 'popPicker':
            vueData.type = 'popPicker';
            vueData.popPicker.columns = options.data;
            break;
        case 'showWaiting':
            vueData.type = 'showWaiting';
            vueData.showWaiting.message = options.message;
            vueData.showWaiting.opacityArray = [0.3, 0.7, 1];
            break;
        case 'select':
            var setValue = '';
            var _type = '';

            if (options.type === 0 && options.isMultiSelect === 1) {
                // 多选
                _type = 'selectMulti';
                setValue = [];
                options.choiceState.forEach(function (item, index) {
                    if (item === '1') {
                        setValue.push(options.items[index]);
                    }
                });
            } else if (options.type === 0 && options.isMultiSelect === 0) {
                // 单选
                _type = 'select';
            } else if (options.type === 1) {
                // 九宫格单选
                _type = 'selectSingleSP';
                if (!document.querySelector('#dialogStyle')) {
                    var _head2 = document.getElementsByTagName('head')[0];

                    _head2.appendChild(dialogStyle);
                }
            }

            if (options.type === 0 && !document.querySelector('#selectStyle')) {
                var _head3 = document.getElementsByTagName('head')[0];

                _head3.appendChild(selectStyle);
            }
            vueData.type = 'select';
            vueData.select.title = options.title;
            vueData.select.items = options.items;
            vueData.select.choiceState = options.choiceState;
            vueData.select.isMultiSelect = options.isMultiSelect;
            vueData.select.type = _type;
            vueData.select.columns = options.columns;
            vueData.select.cancelable = options.cancelable === 1;
            vueData.select.value = setValue;
            break;
        default:
            break;
    }

    if (options.success) {
        vueData[vueData.type].success = options.success;
    }

    if (resolve) {
        vueData[vueData.type].resolve = resolve;
    }

    var createPickDate = function createPickDate() {
        var vnode = new Vue({
            data: function data() {
                return vueData;
            },
            render: function render() {
                var h = arguments[0];

                var self = this;
                var innerDOM = '';

                switch (self.type) {
                    case 'prompt':
                        innerDOM = h(
                            vant.Dialog.Component,
                            {
                                attrs: {
                                    id: 'ejs-ui-prompt'
                                },
                                props: {
                                    'value': self.prompt.show,
                                    'title': self.prompt.title,
                                    'show-cancel-button': self.prompt.cancelable,
                                    'confirm-button-text': self.prompt.buttonLabels[1],
                                    'cancel-button-text': self.prompt.buttonLabels[0]
                                },
                                on: {
                                    'confirm': self.promptConfirm,
                                    'cancel': self.promptCancel
                                }
                            },
                            [h(vant.Field, {
                                props: {
                                    'value': self.prompt.value,
                                    'type': 'textarea',
                                    'autosize': self.prompt.autosize,
                                    'placeholder': self.prompt.hint,
                                    'maxlength': self.prompt.maxlength
                                },
                                on: {
                                    'input': self.promptInput
                                }
                            })]
                        );
                        break;
                    case 'actionSheet':
                        if (self.actionSheet.cancelable) {
                            innerDOM = h(vant.ActionSheet, {
                                attrs: {
                                    id: 'ejs-ui-actionSheet'
                                },
                                props: {
                                    'value': self.actionSheet.show,
                                    'actions': self.actionSheet.actions,
                                    'cancelText': '\u53D6\u6D88',
                                    'close-on-click-overlay': false
                                },
                                on: {
                                    'select': self.actionSheetSelect,
                                    'cancel': self.cancel,
                                    'click-overlay': self.cancel
                                }
                            });
                        } else {
                            innerDOM = h(vant.ActionSheet, {
                                attrs: {
                                    id: 'ejs-ui-actionSheet'
                                },
                                props: {
                                    'value': self.actionSheet.show,
                                    'actions': self.actionSheet.actions,
                                    'close-on-click-overlay': false
                                },
                                on: {
                                    'select': self.actionSheetSelect,
                                    'cancel': self.cancel,
                                    'click-overlay': self.cancel
                                }
                            });
                        }
                        break;
                    case 'pickDate':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickDate.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.type
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.DatetimePicker, {
                                props: {
                                    'value': self.pickDate.value,
                                    'type': self.pickDate.type,
                                    'title': self.pickDate.title,
                                    'minDate': self.pickDate.minDate,
                                    'maxDate': self.pickDate.maxDate,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickDateConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'pickTime':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickTime.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false
                                },
                                attrs: {
                                    id: 'ejs-ui-pickTime'
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.DatetimePicker, {
                                props: {
                                    'value': self.pickTime.value,
                                    'type': 'time',
                                    'title': self.pickTime.title,
                                    'min-hour': self.pickTime.minHour,
                                    'max-hour': self.pickTime.maxHour,
                                    'min-minute': self.pickTime.minMinute,
                                    'max-minute': self.pickTime.maxMinute,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickTimeConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'pickDateTime':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.pickDateTime.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false,
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.type
                                },
                                'class': 'ejs-ui-pickdate',
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.Picker, {
                                props: {
                                    'title': self.pickDateTime.title,
                                    'show-toolbar': true,
                                    'columns': self.pickDateTime.columns,
                                    'confirm-button-text': '\u786E\u5B9A'
                                },
                                on: {
                                    'confirm': self.pickDateTimeConfirm,
                                    'cancel': self.cancel,
                                    'change': self.pickDateTimeChange
                                }
                            })]
                        );
                        break;
                    case 'popPicker':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.popPicker.show,
                                    'position': 'bottom',
                                    'close-on-click-overlay': false
                                },
                                attrs: {
                                    id: 'ejs-ui-popPicker'
                                },
                                on: {
                                    'click-overlay': self.cancel
                                }
                            },
                            [h(vant.Picker, {
                                props: {
                                    'show-toolbar': true,
                                    'columns': self.popPicker.columns
                                },
                                on: {
                                    'confirm': self.popPickerConfirm,
                                    'cancel': self.cancel
                                }
                            })]
                        );
                        break;
                    case 'showWaiting':
                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.showWaiting.show,
                                    'close-on-click-overlay': false
                                },
                                attrs: {
                                    id: 'ejs-ui-showWaiting',

                                    overlay: false
                                },
                                on: {
                                    'click-overlay': self.cancel
                                },
                                style: { width: '140px', height: '115px', backgroundColor: '#000', opacity: '0.7', borderRadius: '10px' }
                            },
                            [h(
                                'div',
                                { style: { textAlign: 'center', width: '100%', height: '100%', padding: '30px 0 20px' } },
                                [h(
                                    'div',
                                    { style: { display: 'flex', justifyContent: 'space-around', margin: '0 auto 24px', width: '36px', height: '14px' } },
                                    [self.showWaiting.opacityArray.map(function (item) {
                                        return h('span', {
                                            style: { backgroundColor: '#fff', opacity: item, height: '100%', width: '3px', transform: 'skewX(-15deg)' }
                                        });
                                    })]
                                ), h(
                                    'div',
                                    { style: { color: '#fff', fontSize: '15px' } },
                                    [self.showWaiting.message]
                                )]
                            )]
                        );
                        break;
                    case 'select':
                        var _innerSelect = '';

                        if (self.select.type === 'select') {
                            // 单选
                            _innerSelect = h(
                                vant.RadioGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(vant.CellGroup, [self.select.items.map(function (item) {
                                    var clickEvent = function clickEvent() {
                                        self.select.value = item;
                                        self.selectConfirm();
                                    };

                                    return h(
                                        vant.Cell,
                                        {
                                            props: {
                                                'title': item,
                                                'clickable': true
                                            },
                                            on: {
                                                'click': clickEvent
                                            },

                                            'class': { fontActive: self.select.value === item }
                                        },
                                        [h(vant.Radio, {
                                            attrs: { name: item },
                                            slot: 'right-icon' })]
                                    );
                                })])]
                            );
                        } else if (self.select.type === 'selectMulti') {
                            // 多选
                            _innerSelect = h('div', [h(
                                vant.CheckboxGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(
                                    vant.CellGroup,
                                    { style: { maxHeight: '292px' } },
                                    [self.select.items.map(function (item) {
                                        var clickEvent = function clickEvent() {
                                            var k = self.select.value.indexOf(item);
                                            if (k > -1) {
                                                self.select.value.splice(k, 1);
                                            } else {
                                                self.select.value.push(item);
                                            }
                                        };

                                        return h(
                                            vant.Cell,
                                            {
                                                props: {
                                                    'title': item,
                                                    'clickable': true
                                                },
                                                on: {
                                                    'click': clickEvent
                                                },

                                                'class': { fontActive: self.select.value.indexOf(item) > -1 }
                                            },
                                            [h(vant.Checkbox, {
                                                props: {
                                                    'name': item,
                                                    'shape': 'square'
                                                },
                                                slot: 'right-icon' })]
                                        );
                                    })]
                                )]
                            ), h(
                                'div',
                                { style: { padding: '10px 20px' } },
                                [h(
                                    'div',
                                    {
                                        style: { height: '44px', width: '100%', lineHeight: '44px', color: '#fff', fontSize: '16px', textAlign: 'center', borderRadius: '22px', backgroundColor: '#2463e0' },
                                        on: {
                                            'click': self.selectConfirm
                                        }
                                    },
                                    ['\u786E\u5B9A']
                                )]
                            )]);
                        }

                        innerDOM = h(
                            vant.Popup,
                            {
                                props: {
                                    'value': self.select.show,
                                    'position': 'bottom',
                                    'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                                    'close-on-click-overlay': false,
                                    'closeable': self.select.cancelable
                                },
                                attrs: {
                                    id: 'ejs-ui-' + self.select.type
                                },
                                'class': 'ejs-ui-select',
                                on: {
                                    'click-overlay': self.cancel,
                                    'click': self.clickPop
                                }
                            },
                            [h(
                                'h5',
                                { style: { color: '#2e3033', fontSize: '16px', paddingLeft: '20px', height: '44px', lineHeight: '44px', borderBottom: '0.5px solid #ebedf0', marginBottom: '10px' } },
                                [self.select.title]
                            ), _innerSelect]
                        );

                        if (self.select.type === 'selectSingleSP') {
                            // 九宫格
                            var items = [[]];
                            var i = 0;
                            self.select.items.forEach(function (item) {
                                if (items[i].length >= self.select.columns) {
                                    i += 1;
                                    items.push([]);
                                }
                                items[i].push(item);
                            });

                            _innerSelect = h(
                                vant.RadioGroup,
                                {
                                    props: {
                                        'value': self.select.value
                                    }
                                },
                                [h(vant.CellGroup, [items.map(function (item) {
                                    return h(vant.Row, [item.map(function (ele) {
                                        var clickEvent = function clickEvent() {
                                            self.select.value = ele;
                                        };

                                        return h(
                                            vant.Col,
                                            {
                                                props: {
                                                    'span': 24 / self.select.columns
                                                }
                                            },
                                            [h(
                                                vant.Cell,
                                                {
                                                    props: {
                                                        'title': ele,
                                                        'clickable': true
                                                    },
                                                    on: {
                                                        'click': clickEvent
                                                    }
                                                },
                                                [h(vant.Radio, {
                                                    attrs: { name: ele },
                                                    slot: 'right-icon' })]
                                            )]
                                        );
                                    })]);
                                })])]
                            );

                            innerDOM = h(
                                vant.Dialog.Component,
                                {
                                    attrs: {
                                        id: 'ejs-ui-' + self.select.type
                                    },
                                    props: {
                                        'value': self.select.show,
                                        'title': self.select.title,
                                        'show-cancel-button': self.select.cancelable,
                                        'overlay-style': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                                    },
                                    on: {
                                        'confirm': self.selectConfirm,
                                        'cancel': self.cancel
                                    }
                                },
                                [_innerSelect]
                            );
                        }
                        break;
                    default:
                        break;
                }

                return h(
                    'div',
                    {
                        attrs: { id: 'ejs-ui' }
                    },
                    [innerDOM]
                );
            },

            watch: {
                'pickDateTime.innerValue': function pickDateTimeInnerValue(val, oldVal) {
                    var minDate = this.pickDateTime.minDate;
                    var maxDate = this.pickDateTime.maxDate;
                    if (this.compareDate(val, minDate) || this.compareDate(val, maxDate) || this.compareDate(oldVal, minDate) || this.compareDate(oldVal, maxDate)) {
                        this.pickDateTime.columns = getColumns(this.pickDateTime.minDate, this.pickDateTime.maxDate, val);
                    }
                },
                type: function type(val) {
                    if (val === 'showWaiting') {
                        this.showWaitingAnimation();
                    }
                }
            },
            methods: {
                promptConfirm: function promptConfirm() {
                    var result = {
                        which: 1,
                        content: this.prompt.value
                    };
                    this.prompt.show = false;
                    this.success(result);
                },
                promptCancel: function promptCancel() {
                    var result = {
                        which: 0,
                        content: this.prompt.value
                    };
                    this.prompt.show = false;
                    this.success(result);
                },
                promptInput: function promptInput(value) {
                    this.prompt.value = value;
                },
                actionSheetSelect: function actionSheetSelect(item) {
                    var index = this.actionSheet.actions.indexOf(item);
                    var result = {
                        which: index,
                        content: item.name
                    };
                    this.actionSheet.show = false;
                    this.actionSheet.canClose = false;
                    this.success(result);
                },
                pickDateConfirm: function pickDateConfirm(value) {
                    var result = null;
                    var date = new Date(value);
                    var year = date.getFullYear();
                    var month = paddingWith0(date.getMonth() + 1);
                    var day = paddingWith0(date.getDate());
                    if (this.pickDate.type === 'date') {
                        result = {
                            date: year + '-' + month + '-' + day
                        };
                    } else {
                        result = {
                            month: year + '-' + month
                        };
                    }
                    this.pickDate.show = false;
                    this.pickDate.canClose = false;
                    this.success(result);
                },
                pickDateTimeConfirm: function pickDateTimeConfirm(value) {
                    var nyr = value[0].substring(0, 10);
                    var week = value[0].substring(11, 13);
                    var result = {
                        datetime: nyr + ' ' + value[1] + ':' + value[2],
                        week: week
                    };
                    this.pickDateTime.show = false;
                    this.pickDateTime.canClose = false;
                    this.success(result);
                },
                pickDateTimeChange: function pickDateTimeChange(v) {
                    var val = v.getValues();
                    val = val[0].substring(0, 10) + ' ' + val[1] + ':' + val[2];
                    this.pickDateTime.innerValue = new Date(val);
                },
                pickTimeConfirm: function pickTimeConfirm(value) {
                    var result = {
                        time: value
                    };
                    this.pickTime.show = false;
                    this.pickTime.canClose = false;
                    this.success(result);
                },
                popPickerConfirm: function popPickerConfirm(item) {
                    var res = item;
                    if (Array.isArray(item)) {
                        res = item.map(function (element) {
                            return {
                                text: element,
                                value: element
                            };
                        });
                    } else {
                        res = [item];
                    }
                    var result = {
                        items: res
                    };
                    this.popPicker.show = false;
                    this.popPicker.canClose = false;
                    this.success(result);
                },
                selectConfirm: function selectConfirm() {
                    var result = null;
                    var self = this;
                    if (Array.isArray(self.select.value)) {
                        var choiceState = self.select.items.map(function (item) {
                            if (self.select.value.indexOf(item) > -1) {
                                return '1';
                            }
                            return '0';
                        });

                        result = {
                            choiceState: choiceState,
                            choiceContent: this.select.value
                        };
                    } else {
                        var index = self.select.items.indexOf(this.select.value);
                        result = {
                            which: index,
                            content: this.select.value
                        };
                    }

                    this.select.show = false;
                    this.select.canClose = false;

                    this.success(result);
                },
                clickPop: function clickPop(e) {
                    if (e.target.classList.contains('van-popup__close-icon') && this.select.canClose) {
                        this.select.show = false;
                        this.select.canClose = false;
                    }
                },
                cancel: function cancel() {
                    var type = this.type;
                    if (this[type].canClose) {
                        this[type].show = false;
                        this[type].canClose = false;
                    }
                },
                success: function success(result) {
                    this[this.type].success && this[this.type].success(result);
                    this[this.type].resolve && this[this.type].resolve(result);
                },
                compareDate: function compareDate(date1, date2) {
                    if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
                        return true;
                    } else {
                        return false;
                    }
                },

                showWaitingAnimation: function showWaitingAnimation() {
                    var self = this;
                    var count = 0;
                    var updateArray = function updateArray() {
                        var last = self.showWaiting.opacityArray.pop();
                        self.showWaiting.opacityArray.unshift(last);
                    };
                    var step = function step() {
                        count++;
                        if (count >= 10) {
                            count = 0;
                            updateArray();
                        }

                        if (self.type === 'showWaiting') {
                            requestAnimationFrame(step);
                        }
                    };
                    requestAnimationFrame(step);
                }
            },
            mounted: function mounted() {
                var _this = this;

                var type = this.type;
                this[type].show = true;
                if ('canClose' in this[type]) {
                    setTimeout(function () {
                        _this[type].canClose = true;
                    }, 300);
                }

                if (this.type === 'showWaiting') {
                    this.showWaitingAnimation();
                }
            }
        }).$mount();

        document.body.appendChild(vnode.$el);
        return vnode;
    };

    if (!document.querySelector('#ejs-ui')) {
        Vue.prototype.$ejsUI = createPickDate();
    } else {
        var type = vueData.type;
        Vue.prototype.$ejsUI.type = type;
        Vue.prototype.$ejsUI[type] = vueData[type];
        Vue.prototype.$ejsUI[type].show = true;
        setTimeout(function () {
            Vue.prototype.$ejsUI[type].canClose = true;
        }, 300);
    }

    if (method === 'showWaiting') {
        options.success && options.success();
        resolve && resolve();
    }
}

function uiMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['h5'],
        defaultParams: {
            message: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            var options = args[0];
            var resolve = args[1];

            vant.Toast(options.message);
            options.success && options.success();
            resolve && resolve();
        }
    }, {
        namespace: 'showDebugDialog',
        os: ['h5'],
        defaultParams: {
            debugInfo: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'debugInfo');

            args[0] = {
                title: '',
                message: args[0].debugInfo,
                buttonName: '确定',
                success: args[0].success
            };

            ejs.ui.alert.apply(this, args);
        }
    }, {
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
            // 默认可取消
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message', 'title', 'buttonName');
            var resolve = args[1];

            var options = {
                title: args[0].title,
                message: args[0].message,
                confirmButtonText: args[0].buttonName,
                showCancelButton: args[0].cancelable === 1
            };

            if (!document.querySelector('#dialogStyle')) {
                var head = document.getElementsByTagName('head')[0];

                head.appendChild(dialogStyle);
            }

            vant.Dialog.alert(options).then(function () {
                args[0].success && args[0].success({});
                resolve && resolve({});
            });
        }
    }, {
        namespace: 'confirm',
        os: ['h5'],
        defaultParams: {
            // 这是默认参数，API的每一个参数都应该有一个默认值
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            // 兼容字符串形式
            var args = rest;
            var resolve = args[1];
            var options = {
                title: args[0].title,
                message: args[0].message,
                showCancelButton: args[0].cancelable === 1,
                confirmButtonText: args[0].buttonLabels[1],
                cancelButtonText: args[0].buttonLabels[0]
            };

            if (!document.querySelector('#dialogStyle')) {
                var head = document.getElementsByTagName('head')[0];

                head.appendChild(dialogStyle);
            }

            vant.Dialog.confirm(options).then(function () {
                var result = {
                    which: 1
                };
                args[0].success && args[0].success(result);
                resolve && resolve(result);
            }).catch(function () {
                var result = {
                    which: 0
                };
                args[0].success && args[0].success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'prompt',
        os: ['h5'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            lines: 1,
            cancelable: 1,
            maxLength: 10000,
            buttonLabels: ['取消', '确定']
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'prompt');
        }
    }, {
        namespace: 'actionSheet',
        os: ['h5'],
        defaultParams: {
            items: []
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'actionSheet');
        }
    }, {
        namespace: 'pickDate',
        os: ['h5'],
        defaultParams: {
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: '',
            title: '选择日期'
        },
        runCode: function runCode() {
            for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                rest[_key7] = arguments[_key7];
            }

            // 兼容字符串形式
            var args = rest;

            uiVue(args, 'pickDate');
        }
    }, {
        namespace: 'pickTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 hh:mm。
            datetime: '',
            title: '选择时间',
            minHour: 0,
            maxHour: 23,
            minMinute: 0,
            maxMinute: 59
        },
        runCode: function runCode() {
            for (var _len8 = arguments.length, rest = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                rest[_key8] = arguments[_key8];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickTime');
        }
    }, {
        namespace: 'pickDateTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd hh:mm。
            datetime: '',
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            title: '选择日期时间'
        },
        runCode: function runCode() {
            for (var _len9 = arguments.length, rest = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                rest[_key9] = arguments[_key9];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickDateTime');
        }
    }, {
        namespace: 'pickMonth',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM
            datetime: '',
            // h5中的开始年份
            minDate: '',
            // h5中的结束年份
            maxDate: '',
            title: '选择年月'
        },
        runCode: function runCode() {
            for (var _len10 = arguments.length, rest = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                rest[_key10] = arguments[_key10];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'pickMonth');
        }
    }, {
        namespace: 'popPicker',
        os: ['h5'],
        defaultParams: {
            // 层级，默认为1
            layer: 1,
            data: []
        },
        runCode: function runCode() {
            for (var _len11 = arguments.length, rest = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                rest[_key11] = arguments[_key11];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'popPicker');
        }
    }, {
        namespace: 'showWaiting',
        os: ['h5'],
        defaultParams: {
            message: '加载中...',
            padlock: true
        },
        runCode: function runCode() {
            for (var _len12 = arguments.length, rest = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                rest[_key12] = arguments[_key12];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            uiVue(args, 'showWaiting');
        }
    }, {
        namespace: 'closeWaiting',
        os: ['h5'],
        runCode: function runCode() {
            for (var _len13 = arguments.length, rest = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                rest[_key13] = arguments[_key13];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            if (Vue.prototype.$ejsUI && Vue.prototype.$ejsUI.showWaiting.show) {
                Vue.prototype.$ejsUI.showWaiting.show = false;
                Vue.prototype.$ejsUI.showWaiting.canClose = false;
            }

            options.success && options.success();
            resolve && resolve();
        }
    }, {
        namespace: 'select',
        os: ['h5'],
        defaultParams: {
            title: '',
            items: [],
            choiceState: [],
            // 由以前的true和false替换为了1和0
            isMultiSelect: 0,
            // 样式类型，默认为0。 0：单列表样式；1：九宫格样式(目前只支持单选)
            type: 0,
            columns: 2,
            // 可取消
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len14 = arguments.length, rest = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
                rest[_key14] = arguments[_key14];
            }

            // 兼容字符串形式
            var args = rest;
            uiVue(args, 'select');
        }
    }]);
}

function pageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['h5'],
        defaultParams: {
            pageUrl: '',
            // 额外数据
            data: {},
            useRouter: false
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'pageUrl', 'data');
            var options = args[0];

            if (window.vm && vm.$router && options.useRouter) {
                options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data, true);
                vm.$router.push(options.pageUrl);
            } else {
                // 将额外数据拼接到url中
                options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data);
                // 普通
                window.location.href = options.pageUrl;
            }
        }
    }, {
        namespace: 'close',
        os: ['h5'],
        runCode: function runCode() {
            // 浏览器退出
            if (window.history.length > 1) {
                window.history.back();
            }
        }
    }, {
        namespace: 'reload',
        os: ['h5'],
        runCode: function runCode() {
            window.location.reload();
        }
    }]);
}

function storageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('storage', [{
        namespace: 'getItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;
            var values = {};

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    var value = localStorage.getItem(keys[i]);

                    values[keys[i]] = value;
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u83B7\u53D6\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success(values);
            resolve && resolve(values);
        }
    }, {
        namespace: 'setItem',
        os: ['h5'],
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            try {
                Object.keys(options).forEach(function (key) {
                    if (key !== 'success' && key !== 'error') {
                        var value = options[key];

                        localStorage.setItem(key, value);
                    }
                });
            } catch (msg) {
                var errorMsg = '';

                if (msg.name === 'QuotaExceededError') {
                    errorMsg = '超出本地存储限额，建议先清除一些无用空间!';
                } else {
                    errorMsg = 'localStorage存储值出错';
                }

                var err = {
                    code: 0,
                    msg: errorMsg,
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'removeItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    localStorage.removeItem(keys[i]);
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u79FB\u9664\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }]);
}

function deviceMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('device', [{
        namespace: 'callPhone',
        os: ['h5'],
        defaultParams: {
            phoneNum: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum');
            var phoneNum = args[0].phoneNum;

            window.location.href = 'tel:' + phoneNum;
        }
    }, {
        namespace: 'sendMsg',
        os: ['h5'],
        defaultParams: {
            phoneNum: '',
            message: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum', 'message');
            var phoneNum = args[0].phoneNum;
            var message = args[0].message;

            window.location.href = 'sms:' + phoneNum + '?body=' + message;
        }
    }, {
        namespace: 'sendMail',
        os: ['h5'],
        defaultParams: {
            mail: '',
            subject: '',
            cc: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'mail', 'subject', 'cc');
            var mail = args[0].mail;
            var subject = args[0].subject;
            var cc = args[0].cc;

            window.location.href = 'mailto:' + mail + '?subject=' + subject + '&cc=' + cc;
        }
    }]);
}

function pageMixin$1(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('util', [{
        namespace: 'encrypt',
        os: ['h5'],
        defaultParams: {
            type: '1',
            keys: [],
            text: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!options.text) {
                var err = {
                    code: 0,
                    msg: '需要加密的字符串不存在'
                };

                error && error(err);
                reject && reject(err);

                return;
            }
            if (options.type === '0') {
                var _result = {
                    text: options.text
                };
                success && success(_result);
                resolve && resolve(_result);

                return;
            }
            if (!options.keys || options.keys.length !== 2) {
                var _err = {
                    code: 0,
                    msg: 'H5encrypt加密需要正确传参keys数组'
                };

                error && error(_err);
                reject && reject(_err);

                return;
            }
            var key = options.keys[0];
            var iv = options.keys[1];
            var message = options.text;
            var result = void 0;
            try {
                var ciphertext = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
                    iv: CryptoJS.enc.Utf8.parse(iv),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                var encryptText = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext);
                result = {
                    text: encryptText
                };
            } catch (msg) {
                var errorMsg = 'CryptoJS加密失败，H5加密需要引入aes.js文件库';

                var _err2 = {
                    code: 0,
                    msg: errorMsg,
                    result: msg
                };

                error && error(_err2);
                reject && reject(_err2);

                return;
            }
            success && success(result);
            resolve && resolve(result);
        }
    }]);
}

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**!
 * Sortable 1.10.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.Sortable = factory());
})(undefined, function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var version = "1.10.2";

  function userAgent(pattern) {
    if (typeof window !== 'undefined' && window.navigator) {
      return !!
      /*@__PURE__*/
      navigator.userAgent.match(pattern);
    }
  }

  var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
  var Edge = userAgent(/Edge/i);
  var FireFox = userAgent(/firefox/i);
  var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
  var IOS = userAgent(/iP(ad|od|hone)/i);
  var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

  var captureMode = {
    capture: false,
    passive: false
  };

  function on(el, event, fn) {
    el.addEventListener(event, fn, !IE11OrLess && captureMode);
  }

  function off(el, event, fn) {
    el.removeEventListener(event, fn, !IE11OrLess && captureMode);
  }

  function matches(
  /**HTMLElement*/
  el,
  /**String*/
  selector) {
    if (!selector) return;
    selector[0] === '>' && (selector = selector.substring(1));

    if (el) {
      try {
        if (el.matches) {
          return el.matches(selector);
        } else if (el.msMatchesSelector) {
          return el.msMatchesSelector(selector);
        } else if (el.webkitMatchesSelector) {
          return el.webkitMatchesSelector(selector);
        }
      } catch (_) {
        return false;
      }
    }

    return false;
  }

  function getParentOrHost(el) {
    return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
  }

  function closest(
  /**HTMLElement*/
  el,
  /**String*/
  selector,
  /**HTMLElement*/
  ctx, includeCTX) {
    if (el) {
      ctx = ctx || document;

      do {
        if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
          return el;
        }

        if (el === ctx) break;
        /* jshint boss:true */
      } while (el = getParentOrHost(el));
    }

    return null;
  }

  var R_SPACE = /\s+/g;

  function toggleClass(el, name, state) {
    if (el && name) {
      if (el.classList) {
        el.classList[state ? 'add' : 'remove'](name);
      } else {
        var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
        el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
      }
    }
  }

  function css(el, prop, val) {
    var style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style) && prop.indexOf('webkit') === -1) {
          prop = '-webkit-' + prop;
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }

  function matrix(el, selfOnly) {
    var appliedTransforms = '';

    if (typeof el === 'string') {
      appliedTransforms = el;
    } else {
      do {
        var transform = css(el, 'transform');

        if (transform && transform !== 'none') {
          appliedTransforms = transform + ' ' + appliedTransforms;
        }
        /* jshint boss:true */
      } while (!selfOnly && (el = el.parentNode));
    }

    var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
    /*jshint -W056 */

    return matrixFn && new matrixFn(appliedTransforms);
  }

  function find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName),
          i = 0,
          n = list.length;

      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }

      return list;
    }

    return [];
  }

  function getWindowScrollingElement() {
    var scrollingElement = document.scrollingElement;

    if (scrollingElement) {
      return scrollingElement;
    } else {
      return document.documentElement;
    }
  }
  /**
   * Returns the "bounding client rect" of given element
   * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
   * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
   * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
   * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
   * @param  {[HTMLElement]} container              The parent the element will be placed in
   * @return {Object}                               The boundingClientRect of el, with specified adjustments
   */

  function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
    if (!el.getBoundingClientRect && el !== window) return;
    var elRect, top, left, bottom, right, height, width;

    if (el !== window && el !== getWindowScrollingElement()) {
      elRect = el.getBoundingClientRect();
      top = elRect.top;
      left = elRect.left;
      bottom = elRect.bottom;
      right = elRect.right;
      height = elRect.height;
      width = elRect.width;
    } else {
      top = 0;
      left = 0;
      bottom = window.innerHeight;
      right = window.innerWidth;
      height = window.innerHeight;
      width = window.innerWidth;
    }

    if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
      // Adjust for translate()
      container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
      // Not needed on <= IE11

      if (!IE11OrLess) {
        do {
          if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
            var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

            top -= containerRect.top + parseInt(css(container, 'border-top-width'));
            left -= containerRect.left + parseInt(css(container, 'border-left-width'));
            bottom = top + elRect.height;
            right = left + elRect.width;
            break;
          }
          /* jshint boss:true */
        } while (container = container.parentNode);
      }
    }

    if (undoScale && el !== window) {
      // Adjust for scale()
      var elMatrix = matrix(container || el),
          scaleX = elMatrix && elMatrix.a,
          scaleY = elMatrix && elMatrix.d;

      if (elMatrix) {
        top /= scaleY;
        left /= scaleX;
        width /= scaleX;
        height /= scaleY;
        bottom = top + height;
        right = left + width;
      }
    }

    return {
      top: top,
      left: left,
      bottom: bottom,
      right: right,
      width: width,
      height: height
    };
  }
  /**
   * Checks if a side of an element is scrolled past a side of its parents
   * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
   * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
   * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
   * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
   */

  function isScrolledPast(el, elSide, parentSide) {
    var parent = getParentAutoScrollElement(el, true),
        elSideVal = getRect(el)[elSide];
    /* jshint boss:true */

    while (parent) {
      var parentSideVal = getRect(parent)[parentSide],
          visible = void 0;

      if (parentSide === 'top' || parentSide === 'left') {
        visible = elSideVal >= parentSideVal;
      } else {
        visible = elSideVal <= parentSideVal;
      }

      if (!visible) return parent;
      if (parent === getWindowScrollingElement()) break;
      parent = getParentAutoScrollElement(parent, false);
    }

    return false;
  }
  /**
   * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
   * and non-draggable elements
   * @param  {HTMLElement} el       The parent element
   * @param  {Number} childNum      The index of the child
   * @param  {Object} options       Parent Sortable's options
   * @return {HTMLElement}          The child at index childNum, or null if not found
   */

  function getChild(el, childNum, options) {
    var currentChild = 0,
        i = 0,
        children = el.children;

    while (i < children.length) {
      if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && children[i] !== Sortable.dragged && closest(children[i], options.draggable, el, false)) {
        if (currentChild === childNum) {
          return children[i];
        }

        currentChild++;
      }

      i++;
    }

    return null;
  }
  /**
   * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
   * @param  {HTMLElement} el       Parent element
   * @param  {selector} selector    Any other elements that should be ignored
   * @return {HTMLElement}          The last child, ignoring ghostEl
   */

  function lastChild(el, selector) {
    var last = el.lastElementChild;

    while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
      last = last.previousElementSibling;
    }

    return last || null;
  }
  /**
   * Returns the index of an element within its parent for a selected set of
   * elements
   * @param  {HTMLElement} el
   * @param  {selector} selector
   * @return {number}
   */

  function index(el, selector) {
    var index = 0;

    if (!el || !el.parentNode) {
      return -1;
    }
    /* jshint boss:true */

    while (el = el.previousElementSibling) {
      if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
        index++;
      }
    }

    return index;
  }
  /**
   * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
   * The value is returned in real pixels.
   * @param  {HTMLElement} el
   * @return {Array}             Offsets in the format of [left, top]
   */

  function getRelativeScrollOffset(el) {
    var offsetLeft = 0,
        offsetTop = 0,
        winScroller = getWindowScrollingElement();

    if (el) {
      do {
        var elMatrix = matrix(el),
            scaleX = elMatrix.a,
            scaleY = elMatrix.d;
        offsetLeft += el.scrollLeft * scaleX;
        offsetTop += el.scrollTop * scaleY;
      } while (el !== winScroller && (el = el.parentNode));
    }

    return [offsetLeft, offsetTop];
  }
  /**
   * Returns the index of the object within the given array
   * @param  {Array} arr   Array that may or may not hold the object
   * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
   * @return {Number}      The index of the object in the array, or -1
   */

  function indexOfObject(arr, obj) {
    for (var i in arr) {
      if (!arr.hasOwnProperty(i)) continue;

      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
      }
    }

    return -1;
  }

  function getParentAutoScrollElement(el, includeSelf) {
    // skip to window
    if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
    var elem = el;
    var gotSelf = false;

    do {
      // we don't need to get elem css if it isn't even overflowing in the first place (performance)
      if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
        var elemCSS = css(elem);

        if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
          if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
          if (gotSelf || includeSelf) return elem;
          gotSelf = true;
        }
      }
      /* jshint boss:true */
    } while (elem = elem.parentNode);

    return getWindowScrollingElement();
  }

  function extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dst[key] = src[key];
        }
      }
    }

    return dst;
  }

  function isRectEqual(rect1, rect2) {
    return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
  }

  var _throttleTimeout;

  function throttle(callback, ms) {
    return function () {
      if (!_throttleTimeout) {
        var args = arguments,
            _this = this;

        if (args.length === 1) {
          callback.call(_this, args[0]);
        } else {
          callback.apply(_this, args);
        }

        _throttleTimeout = setTimeout(function () {
          _throttleTimeout = void 0;
        }, ms);
      }
    };
  }

  function cancelThrottle() {
    clearTimeout(_throttleTimeout);
    _throttleTimeout = void 0;
  }

  function scrollBy(el, x, y) {
    el.scrollLeft += x;
    el.scrollTop += y;
  }

  function clone(el) {
    var Polymer = window.Polymer;
    var $ = window.jQuery || window.Zepto;

    if (Polymer && Polymer.dom) {
      return Polymer.dom(el).cloneNode(true);
    } else if ($) {
      return $(el).clone(true)[0];
    } else {
      return el.cloneNode(true);
    }
  }

  function setRect(el, rect) {
    css(el, 'position', 'absolute');
    css(el, 'top', rect.top);
    css(el, 'left', rect.left);
    css(el, 'width', rect.width);
    css(el, 'height', rect.height);
  }

  function unsetRect(el) {
    css(el, 'position', '');
    css(el, 'top', '');
    css(el, 'left', '');
    css(el, 'width', '');
    css(el, 'height', '');
  }

  var expando = 'Sortable' + new Date().getTime();

  function AnimationStateManager() {
    var animationStates = [],
        animationCallbackId;
    return {
      captureAnimationState: function captureAnimationState() {
        animationStates = [];
        if (!this.options.animation) return;
        var children = [].slice.call(this.el.children);
        children.forEach(function (child) {
          if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
          animationStates.push({
            target: child,
            rect: getRect(child)
          });

          var fromRect = _objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


          if (child.thisAnimationDuration) {
            var childMatrix = matrix(child, true);

            if (childMatrix) {
              fromRect.top -= childMatrix.f;
              fromRect.left -= childMatrix.e;
            }
          }

          child.fromRect = fromRect;
        });
      },
      addAnimationState: function addAnimationState(state) {
        animationStates.push(state);
      },
      removeAnimationState: function removeAnimationState(target) {
        animationStates.splice(indexOfObject(animationStates, {
          target: target
        }), 1);
      },
      animateAll: function animateAll(callback) {
        var _this = this;

        if (!this.options.animation) {
          clearTimeout(animationCallbackId);
          if (typeof callback === 'function') callback();
          return;
        }

        var animating = false,
            animationTime = 0;
        animationStates.forEach(function (state) {
          var time = 0,
              target = state.target,
              fromRect = target.fromRect,
              toRect = getRect(target),
              prevFromRect = target.prevFromRect,
              prevToRect = target.prevToRect,
              animatingRect = state.rect,
              targetMatrix = matrix(target, true);

          if (targetMatrix) {
            // Compensate for current animation
            toRect.top -= targetMatrix.f;
            toRect.left -= targetMatrix.e;
          }

          target.toRect = toRect;

          if (target.thisAnimationDuration) {
            // Could also check if animatingRect is between fromRect and toRect
            if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
            (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
              // If returning to same place as started from animation and on same axis
              time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
            }
          } // if fromRect != toRect: animate


          if (!isRectEqual(toRect, fromRect)) {
            target.prevFromRect = fromRect;
            target.prevToRect = toRect;

            if (!time) {
              time = _this.options.animation;
            }

            _this.animate(target, animatingRect, toRect, time);
          }

          if (time) {
            animating = true;
            animationTime = Math.max(animationTime, time);
            clearTimeout(target.animationResetTimer);
            target.animationResetTimer = setTimeout(function () {
              target.animationTime = 0;
              target.prevFromRect = null;
              target.fromRect = null;
              target.prevToRect = null;
              target.thisAnimationDuration = null;
            }, time);
            target.thisAnimationDuration = time;
          }
        });
        clearTimeout(animationCallbackId);

        if (!animating) {
          if (typeof callback === 'function') callback();
        } else {
          animationCallbackId = setTimeout(function () {
            if (typeof callback === 'function') callback();
          }, animationTime);
        }

        animationStates = [];
      },
      animate: function animate(target, currentRect, toRect, duration) {
        if (duration) {
          css(target, 'transition', '');
          css(target, 'transform', '');
          var elMatrix = matrix(this.el),
              scaleX = elMatrix && elMatrix.a,
              scaleY = elMatrix && elMatrix.d,
              translateX = (currentRect.left - toRect.left) / (scaleX || 1),
              translateY = (currentRect.top - toRect.top) / (scaleY || 1);
          target.animatingX = !!translateX;
          target.animatingY = !!translateY;
          css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
          css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
          css(target, 'transform', 'translate3d(0,0,0)');
          typeof target.animated === 'number' && clearTimeout(target.animated);
          target.animated = setTimeout(function () {
            css(target, 'transition', '');
            css(target, 'transform', '');
            target.animated = false;
            target.animatingX = false;
            target.animatingY = false;
          }, duration);
        }
      }
    };
  }

  function calculateRealTime(animatingRect, fromRect, toRect, options) {
    return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
  }

  var plugins = [];
  var defaults = {
    initializeByDefault: true
  };
  var PluginManager = {
    mount: function mount(plugin) {
      // Set default static properties
      for (var option in defaults) {
        if (defaults.hasOwnProperty(option) && !(option in plugin)) {
          plugin[option] = defaults[option];
        }
      }

      plugins.push(plugin);
    },
    pluginEvent: function pluginEvent(eventName, sortable, evt) {
      var _this = this;

      this.eventCanceled = false;

      evt.cancel = function () {
        _this.eventCanceled = true;
      };

      var eventNameGlobal = eventName + 'Global';
      plugins.forEach(function (plugin) {
        if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

        if (sortable[plugin.pluginName][eventNameGlobal]) {
          sortable[plugin.pluginName][eventNameGlobal](_objectSpread({
            sortable: sortable
          }, evt));
        } // Only fire plugin event if plugin is enabled in this sortable,
        // and plugin has event defined


        if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
          sortable[plugin.pluginName][eventName](_objectSpread({
            sortable: sortable
          }, evt));
        }
      });
    },
    initializePlugins: function initializePlugins(sortable, el, defaults, options) {
      plugins.forEach(function (plugin) {
        var pluginName = plugin.pluginName;
        if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
        var initialized = new plugin(sortable, el, sortable.options);
        initialized.sortable = sortable;
        initialized.options = sortable.options;
        sortable[pluginName] = initialized; // Add default options from plugin

        _extends(defaults, initialized.defaults);
      });

      for (var option in sortable.options) {
        if (!sortable.options.hasOwnProperty(option)) continue;
        var modified = this.modifyOption(sortable, option, sortable.options[option]);

        if (typeof modified !== 'undefined') {
          sortable.options[option] = modified;
        }
      }
    },
    getEventProperties: function getEventProperties(name, sortable) {
      var eventProperties = {};
      plugins.forEach(function (plugin) {
        if (typeof plugin.eventProperties !== 'function') return;

        _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
      });
      return eventProperties;
    },
    modifyOption: function modifyOption(sortable, name, value) {
      var modifiedValue;
      plugins.forEach(function (plugin) {
        // Plugin must exist on the Sortable
        if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

        if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
          modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
        }
      });
      return modifiedValue;
    }
  };

  function dispatchEvent(_ref) {
    var sortable = _ref.sortable,
        rootEl = _ref.rootEl,
        name = _ref.name,
        targetEl = _ref.targetEl,
        cloneEl = _ref.cloneEl,
        toEl = _ref.toEl,
        fromEl = _ref.fromEl,
        oldIndex = _ref.oldIndex,
        newIndex = _ref.newIndex,
        oldDraggableIndex = _ref.oldDraggableIndex,
        newDraggableIndex = _ref.newDraggableIndex,
        originalEvent = _ref.originalEvent,
        putSortable = _ref.putSortable,
        extraEventProperties = _ref.extraEventProperties;
    sortable = sortable || rootEl && rootEl[expando];
    if (!sortable) return;
    var evt,
        options = sortable.options,
        onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent(name, {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
    }

    evt.to = toEl || rootEl;
    evt.from = fromEl || rootEl;
    evt.item = targetEl || rootEl;
    evt.clone = cloneEl;
    evt.oldIndex = oldIndex;
    evt.newIndex = newIndex;
    evt.oldDraggableIndex = oldDraggableIndex;
    evt.newDraggableIndex = newDraggableIndex;
    evt.originalEvent = originalEvent;
    evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

    var allEventProperties = _objectSpread({}, extraEventProperties, PluginManager.getEventProperties(name, sortable));

    for (var option in allEventProperties) {
      evt[option] = allEventProperties[option];
    }

    if (rootEl) {
      rootEl.dispatchEvent(evt);
    }

    if (options[onName]) {
      options[onName].call(sortable, evt);
    }
  }

  var pluginEvent = function pluginEvent(eventName, sortable) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        originalEvent = _ref.evt,
        data = _objectWithoutProperties(_ref, ["evt"]);

    PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread({
      dragEl: dragEl,
      parentEl: parentEl,
      ghostEl: ghostEl,
      rootEl: rootEl,
      nextEl: nextEl,
      lastDownEl: lastDownEl,
      cloneEl: cloneEl,
      cloneHidden: cloneHidden,
      dragStarted: moved,
      putSortable: putSortable,
      activeSortable: Sortable.active,
      originalEvent: originalEvent,
      oldIndex: oldIndex,
      oldDraggableIndex: oldDraggableIndex,
      newIndex: newIndex,
      newDraggableIndex: newDraggableIndex,
      hideGhostForTarget: _hideGhostForTarget,
      unhideGhostForTarget: _unhideGhostForTarget,
      cloneNowHidden: function cloneNowHidden() {
        cloneHidden = true;
      },
      cloneNowShown: function cloneNowShown() {
        cloneHidden = false;
      },
      dispatchSortableEvent: function dispatchSortableEvent(name) {
        _dispatchEvent({
          sortable: sortable,
          name: name,
          originalEvent: originalEvent
        });
      }
    }, data));
  };

  function _dispatchEvent(info) {
    dispatchEvent(_objectSpread({
      putSortable: putSortable,
      cloneEl: cloneEl,
      targetEl: dragEl,
      rootEl: rootEl,
      oldIndex: oldIndex,
      oldDraggableIndex: oldDraggableIndex,
      newIndex: newIndex,
      newDraggableIndex: newDraggableIndex
    }, info));
  }

  var dragEl,
      parentEl,
      ghostEl,
      rootEl,
      nextEl,
      lastDownEl,
      cloneEl,
      cloneHidden,
      oldIndex,
      newIndex,
      oldDraggableIndex,
      newDraggableIndex,
      activeGroup,
      putSortable,
      awaitingDragStarted = false,
      ignoreNextClick = false,
      sortables = [],
      tapEvt,
      touchEvt,
      lastDx,
      lastDy,
      tapDistanceLeft,
      tapDistanceTop,
      moved,
      lastTarget,
      lastDirection,
      pastFirstInvertThresh = false,
      isCircumstantialInvert = false,
      targetMoveDistance,

  // For positioning ghost absolutely
  ghostRelativeParent,
      ghostRelativeParentInitialScroll = [],

  // (left, top)
  _silent = false,
      savedInputChecked = [];
  /** @const */

  var documentExists = typeof document !== 'undefined',
      PositionGhostAbsolutely = IOS,
      CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',

  // This will not pass for IE9, because IE9 DnD only works on anchors
  supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
      supportCssPointerEvents = function () {
    if (!documentExists) return; // false when <= IE11

    if (IE11OrLess) {
      return false;
    }

    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    return el.style.pointerEvents === 'auto';
  }(),
      _detectDirection = function _detectDirection(el, options) {
    var elCSS = css(el),
        elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
        child1 = getChild(el, 0, options),
        child2 = getChild(el, 1, options),
        firstChildCSS = child1 && css(child1),
        secondChildCSS = child2 && css(child2),
        firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
        secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

    if (elCSS.display === 'flex') {
      return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
    }

    if (elCSS.display === 'grid') {
      return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
    }

    if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
      var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
      return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
    }

    return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
  },
      _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
    var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
        dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
        dragElOppLength = vertical ? dragRect.width : dragRect.height,
        targetS1Opp = vertical ? targetRect.left : targetRect.top,
        targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
        targetOppLength = vertical ? targetRect.width : targetRect.height;
    return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
  },


  /**
   * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
   * @param  {Number} x      X position
   * @param  {Number} y      Y position
   * @return {HTMLElement}   Element of the first found nearest Sortable
   */
  _detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
    var ret;
    sortables.some(function (sortable) {
      if (lastChild(sortable)) return;
      var rect = getRect(sortable),
          threshold = sortable[expando].options.emptyInsertThreshold,
          insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
          insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

      if (threshold && insideHorizontally && insideVertically) {
        return ret = sortable;
      }
    });
    return ret;
  },
      _prepareGroup = function _prepareGroup(options) {
    function toFn(value, pull) {
      return function (to, from, dragEl, evt) {
        var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

        if (value == null && (pull || sameGroup)) {
          // Default pull value
          // Default pull and put value if same group
          return true;
        } else if (value == null || value === false) {
          return false;
        } else if (pull && value === 'clone') {
          return value;
        } else if (typeof value === 'function') {
          return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
        } else {
          var otherGroup = (pull ? to : from).options.group.name;
          return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
        }
      };
    }

    var group = {};
    var originalGroup = options.group;

    if (!originalGroup || _typeof(originalGroup) != 'object') {
      originalGroup = {
        name: originalGroup
      };
    }

    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  },
      _hideGhostForTarget = function _hideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', 'none');
    }
  },
      _unhideGhostForTarget = function _unhideGhostForTarget() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, 'display', '');
    }
  }; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


  if (documentExists) {
    document.addEventListener('click', function (evt) {
      if (ignoreNextClick) {
        evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
        ignoreNextClick = false;
        return false;
      }
    }, true);
  }

  var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
    if (dragEl) {
      evt = evt.touches ? evt.touches[0] : evt;

      var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

      if (nearest) {
        // Create imitation event
        var event = {};

        for (var i in evt) {
          if (evt.hasOwnProperty(i)) {
            event[i] = evt[i];
          }
        }

        event.target = event.rootEl = nearest;
        event.preventDefault = void 0;
        event.stopPropagation = void 0;

        nearest[expando]._onDragOver(event);
      }
    }
  };

  var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
    if (dragEl) {
      dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
    }
  };
  /**
   * @class  Sortable
   * @param  {HTMLElement}  el
   * @param  {Object}       [options]
   */

  function Sortable(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
    }

    this.el = el; // root element

    this.options = options = _extends({}, options); // Export instance

    el[expando] = this;
    var defaults = {
      group: null,
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
      swapThreshold: 1,
      // percentage; 0 <= x <= 1
      invertSwap: false,
      // invert always
      invertedSwapThreshold: null,
      // will be set to same as swapThreshold if default
      removeCloneOnHide: true,
      direction: function direction() {
        return _detectDirection(el, this.options);
      },
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      ignore: 'a, img',
      filter: null,
      preventOnFilter: true,
      animation: 0,
      easing: null,
      setData: function setData(dataTransfer, dragEl) {
        dataTransfer.setData('Text', dragEl.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: 'data-id',
      delay: 0,
      delayOnTouchOnly: false,
      touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: false,
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window,
      emptyInsertThreshold: 5
    };
    PluginManager.initializePlugins(this, el, defaults); // Set default options

    for (var name in defaults) {
      !(name in options) && (options[name] = defaults[name]);
    }

    _prepareGroup(options); // Bind all private methods


    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    } // Setup drag mode


    this.nativeDraggable = options.forceFallback ? false : supportDraggable;

    if (this.nativeDraggable) {
      // Touch start threshold cannot be greater than the native dragstart threshold
      this.options.touchStartThreshold = 1;
    } // Bind events


    if (options.supportPointer) {
      on(el, 'pointerdown', this._onTapStart);
    } else {
      on(el, 'mousedown', this._onTapStart);
      on(el, 'touchstart', this._onTapStart);
    }

    if (this.nativeDraggable) {
      on(el, 'dragover', this);
      on(el, 'dragenter', this);
    }

    sortables.push(this.el); // Restore sorting

    options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

    _extends(this, AnimationStateManager());
  }

  Sortable.prototype =
  /** @lends Sortable.prototype */
  {
    constructor: Sortable,
    _isOutsideThisEl: function _isOutsideThisEl(target) {
      if (!this.el.contains(target) && target !== this.el) {
        lastTarget = null;
      }
    },
    _getDirection: function _getDirection(evt, target) {
      return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
    },
    _onTapStart: function _onTapStart(
    /** Event|TouchEvent */
    evt) {
      if (!evt.cancelable) return;

      var _this = this,
          el = this.el,
          options = this.options,
          preventOnFilter = options.preventOnFilter,
          type = evt.type,
          touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
          target = (touch || evt).target,
          originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
          filter = options.filter;

      _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


      if (dragEl) {
        return;
      }

      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return; // only left button and enabled
      } // cancel dnd if original target is content editable


      if (originalTarget.isContentEditable) {
        return;
      }

      target = closest(target, options.draggable, el, false);

      if (target && target.animated) {
        return;
      }

      if (lastDownEl === target) {
        // Ignoring duplicate `down`
        return;
      } // Get the index of the dragged element within its parent


      oldIndex = index(target);
      oldDraggableIndex = index(target, options.draggable); // Check filter

      if (typeof filter === 'function') {
        if (filter.call(this, evt, target, this)) {
          _dispatchEvent({
            sortable: _this,
            rootEl: originalTarget,
            name: 'filter',
            targetEl: target,
            toEl: el,
            fromEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      } else if (filter) {
        filter = filter.split(',').some(function (criteria) {
          criteria = closest(originalTarget, criteria.trim(), el, false);

          if (criteria) {
            _dispatchEvent({
              sortable: _this,
              rootEl: criteria,
              name: 'filter',
              targetEl: target,
              fromEl: el,
              toEl: el
            });

            pluginEvent('filter', _this, {
              evt: evt
            });
            return true;
          }
        });

        if (filter) {
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return; // cancel dnd
        }
      }

      if (options.handle && !closest(originalTarget, options.handle, el, false)) {
        return;
      } // Prepare `dragstart`


      this._prepareDragStart(evt, touch, target);
    },
    _prepareDragStart: function _prepareDragStart(
    /** Event */
    evt,
    /** Touch */
    touch,
    /** HTMLElement */
    target) {
      var _this = this,
          el = _this.el,
          options = _this.options,
          ownerDocument = el.ownerDocument,
          dragStartFn;

      if (target && !dragEl && target.parentNode === el) {
        var dragRect = getRect(target);
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        Sortable.dragged = dragEl;
        tapEvt = {
          target: dragEl,
          clientX: (touch || evt).clientX,
          clientY: (touch || evt).clientY
        };
        tapDistanceLeft = tapEvt.clientX - dragRect.left;
        tapDistanceTop = tapEvt.clientY - dragRect.top;
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style['will-change'] = 'all';

        dragStartFn = function dragStartFn() {
          pluginEvent('delayEnded', _this, {
            evt: evt
          });

          if (Sortable.eventCanceled) {
            _this._onDrop();

            return;
          } // Delayed drag has been triggered
          // we can re-enable the events: touchmove/mousemove


          _this._disableDelayedDragEvents();

          if (!FireFox && _this.nativeDraggable) {
            dragEl.draggable = true;
          } // Bind the events: dragstart/dragend


          _this._triggerDragStart(evt, touch); // Drag start event


          _dispatchEvent({
            sortable: _this,
            name: 'choose',
            originalEvent: evt
          }); // Chosen item


          toggleClass(dragEl, options.chosenClass, true);
        }; // Disable "draggable"


        options.ignore.split(',').forEach(function (criteria) {
          find(dragEl, criteria.trim(), _disableDraggable);
        });
        on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
        on(ownerDocument, 'mouseup', _this._onDrop);
        on(ownerDocument, 'touchend', _this._onDrop);
        on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

        if (FireFox && this.nativeDraggable) {
          this.options.touchStartThreshold = 4;
          dragEl.draggable = true;
        }

        pluginEvent('delayStart', this, {
          evt: evt
        }); // Delay is impossible for native DnD in Edge or IE

        if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
          if (Sortable.eventCanceled) {
            this._onDrop();

            return;
          } // If the user moves the pointer or let go the click or touch
          // before the delay has been reached:
          // disable the delayed drag


          on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
          on(ownerDocument, 'touchend', _this._disableDelayedDrag);
          on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
          on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
          on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
          options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
          _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
        } else {
          dragStartFn();
        }
      }
    },
    _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
    /** TouchEvent|PointerEvent **/
    e) {
      var touch = e.touches ? e.touches[0] : e;

      if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
        this._disableDelayedDrag();
      }
    },
    _disableDelayedDrag: function _disableDelayedDrag() {
      dragEl && _disableDraggable(dragEl);
      clearTimeout(this._dragStartTimer);

      this._disableDelayedDragEvents();
    },
    _disableDelayedDragEvents: function _disableDelayedDragEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, 'mouseup', this._disableDelayedDrag);
      off(ownerDocument, 'touchend', this._disableDelayedDrag);
      off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
      off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
      off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
      off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
    },
    _triggerDragStart: function _triggerDragStart(
    /** Event */
    evt,
    /** Touch */
    touch) {
      touch = touch || evt.pointerType == 'touch' && evt;

      if (!this.nativeDraggable || touch) {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._onTouchMove);
        } else if (touch) {
          on(document, 'touchmove', this._onTouchMove);
        } else {
          on(document, 'mousemove', this._onTouchMove);
        }
      } else {
        on(dragEl, 'dragend', this);
        on(rootEl, 'dragstart', this._onDragStart);
      }

      try {
        if (document.selection) {
          // Timeout neccessary for IE9
          _nextTick(function () {
            document.selection.empty();
          });
        } else {
          window.getSelection().removeAllRanges();
        }
      } catch (err) {}
    },
    _dragStarted: function _dragStarted(fallback, evt) {

      awaitingDragStarted = false;

      if (rootEl && dragEl) {
        pluginEvent('dragStarted', this, {
          evt: evt
        });

        if (this.nativeDraggable) {
          on(document, 'dragover', _checkOutsideTargetEl);
        }

        var options = this.options; // Apply effect

        !fallback && toggleClass(dragEl, options.dragClass, false);
        toggleClass(dragEl, options.ghostClass, true);
        Sortable.active = this;
        fallback && this._appendGhost(); // Drag start event

        _dispatchEvent({
          sortable: this,
          name: 'start',
          originalEvent: evt
        });
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function _emulateDragOver() {
      if (touchEvt) {
        this._lastX = touchEvt.clientX;
        this._lastY = touchEvt.clientY;

        _hideGhostForTarget();

        var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        var parent = target;

        while (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          if (target === parent) break;
          parent = target;
        }

        dragEl.parentNode[expando]._isOutsideThisEl(target);

        if (parent) {
          do {
            if (parent[expando]) {
              var inserted = void 0;
              inserted = parent[expando]._onDragOver({
                clientX: touchEvt.clientX,
                clientY: touchEvt.clientY,
                target: target,
                rootEl: parent
              });

              if (inserted && !this.options.dragoverBubble) {
                break;
              }
            }

            target = parent; // store last element
          }
          /* jshint boss:true */
          while (parent = parent.parentNode);
        }

        _unhideGhostForTarget();
      }
    },
    _onTouchMove: function _onTouchMove(
    /**TouchEvent*/
    evt) {
      if (tapEvt) {
        var options = this.options,
            fallbackTolerance = options.fallbackTolerance,
            fallbackOffset = options.fallbackOffset,
            touch = evt.touches ? evt.touches[0] : evt,
            ghostMatrix = ghostEl && matrix(ghostEl, true),
            scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
            scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
            relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
            dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
            dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

        if (!Sortable.active && !awaitingDragStarted) {
          if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }

          this._onDragStart(evt, true);
        }

        if (ghostEl) {
          if (ghostMatrix) {
            ghostMatrix.e += dx - (lastDx || 0);
            ghostMatrix.f += dy - (lastDy || 0);
          } else {
            ghostMatrix = {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              e: dx,
              f: dy
            };
          }

          var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
          css(ghostEl, 'webkitTransform', cssMatrix);
          css(ghostEl, 'mozTransform', cssMatrix);
          css(ghostEl, 'msTransform', cssMatrix);
          css(ghostEl, 'transform', cssMatrix);
          lastDx = dx;
          lastDy = dy;
          touchEvt = touch;
        }

        evt.cancelable && evt.preventDefault();
      }
    },
    _appendGhost: function _appendGhost() {
      // Bug if using scale(): https://stackoverflow.com/questions/2637058
      // Not being adjusted for
      if (!ghostEl) {
        var container = this.options.fallbackOnBody ? document.body : rootEl,
            rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
            options = this.options; // Position absolutely

        if (PositionGhostAbsolutely) {
          // Get relatively positioned parent
          ghostRelativeParent = container;

          while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
            ghostRelativeParent = ghostRelativeParent.parentNode;
          }

          if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
            if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
            rect.top += ghostRelativeParent.scrollTop;
            rect.left += ghostRelativeParent.scrollLeft;
          } else {
            ghostRelativeParent = getWindowScrollingElement();
          }

          ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
        }

        ghostEl = dragEl.cloneNode(true);
        toggleClass(ghostEl, options.ghostClass, false);
        toggleClass(ghostEl, options.fallbackClass, true);
        toggleClass(ghostEl, options.dragClass, true);
        css(ghostEl, 'transition', '');
        css(ghostEl, 'transform', '');
        css(ghostEl, 'box-sizing', 'border-box');
        css(ghostEl, 'margin', 0);
        css(ghostEl, 'top', rect.top);
        css(ghostEl, 'left', rect.left);
        css(ghostEl, 'width', rect.width);
        css(ghostEl, 'height', rect.height);
        css(ghostEl, 'opacity', '0.8');
        css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
        css(ghostEl, 'zIndex', '100000');
        css(ghostEl, 'pointerEvents', 'none');
        Sortable.ghost = ghostEl;
        container.appendChild(ghostEl); // Set transform-origin

        css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
      }
    },
    _onDragStart: function _onDragStart(
    /**Event*/
    evt,
    /**boolean*/
    fallback) {
      var _this = this;

      var dataTransfer = evt.dataTransfer;
      var options = _this.options;
      pluginEvent('dragStart', this, {
        evt: evt
      });

      if (Sortable.eventCanceled) {
        this._onDrop();

        return;
      }

      pluginEvent('setupClone', this);

      if (!Sortable.eventCanceled) {
        cloneEl = clone(dragEl);
        cloneEl.draggable = false;
        cloneEl.style['will-change'] = '';

        this._hideClone();

        toggleClass(cloneEl, this.options.chosenClass, false);
        Sortable.clone = cloneEl;
      } // #1143: IFrame support workaround


      _this.cloneId = _nextTick(function () {
        pluginEvent('clone', _this);
        if (Sortable.eventCanceled) return;

        if (!_this.options.removeCloneOnHide) {
          rootEl.insertBefore(cloneEl, dragEl);
        }

        _this._hideClone();

        _dispatchEvent({
          sortable: _this,
          name: 'clone'
        });
      });
      !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

      if (fallback) {
        ignoreNextClick = true;
        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        // Undo what was set in _prepareDragStart before drag started
        off(document, 'mouseup', _this._onDrop);
        off(document, 'touchend', _this._onDrop);
        off(document, 'touchcancel', _this._onDrop);

        if (dataTransfer) {
          dataTransfer.effectAllowed = 'move';
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }

        on(document, 'drop', _this); // #1276 fix:

        css(dragEl, 'transform', 'translateZ(0)');
      }

      awaitingDragStarted = true;
      _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
      on(document, 'selectstart', _this);
      moved = true;

      if (Safari) {
        css(document.body, 'user-select', 'none');
      }
    },
    // Returns true - if no further action is needed (either inserted or another condition)
    _onDragOver: function _onDragOver(
    /**Event*/
    evt) {
      var el = this.el,
          target = evt.target,
          dragRect,
          targetRect,
          revert,
          options = this.options,
          group = options.group,
          activeSortable = Sortable.active,
          isOwner = activeGroup === group,
          canSort = options.sort,
          fromSortable = putSortable || activeSortable,
          vertical,
          _this = this,
          completedFired = false;

      if (_silent) return;

      function dragOverEvent(name, extra) {
        pluginEvent(name, _this, _objectSpread({
          evt: evt,
          isOwner: isOwner,
          axis: vertical ? 'vertical' : 'horizontal',
          revert: revert,
          dragRect: dragRect,
          targetRect: targetRect,
          canSort: canSort,
          fromSortable: fromSortable,
          target: target,
          completed: completed,
          onMove: function onMove(target, after) {
            return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
          },
          changed: changed
        }, extra));
      } // Capture animation state


      function capture() {
        dragOverEvent('dragOverAnimationCapture');

        _this.captureAnimationState();

        if (_this !== fromSortable) {
          fromSortable.captureAnimationState();
        }
      } // Return invocation when dragEl is inserted (or completed)


      function completed(insertion) {
        dragOverEvent('dragOverCompleted', {
          insertion: insertion
        });

        if (insertion) {
          // Clones must be hidden before folding animation to capture dragRectAbsolute properly
          if (isOwner) {
            activeSortable._hideClone();
          } else {
            activeSortable._showClone(_this);
          }

          if (_this !== fromSortable) {
            // Set ghost class to new sortable's ghost class
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
            toggleClass(dragEl, options.ghostClass, true);
          }

          if (putSortable !== _this && _this !== Sortable.active) {
            putSortable = _this;
          } else if (_this === Sortable.active && putSortable) {
            putSortable = null;
          } // Animation


          if (fromSortable === _this) {
            _this._ignoreWhileAnimating = target;
          }

          _this.animateAll(function () {
            dragOverEvent('dragOverAnimationComplete');
            _this._ignoreWhileAnimating = null;
          });

          if (_this !== fromSortable) {
            fromSortable.animateAll();
            fromSortable._ignoreWhileAnimating = null;
          }
        } // Null lastTarget if it is not inside a previously swapped element


        if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
          lastTarget = null;
        } // no bubbling and not fallback


        if (!options.dragoverBubble && !evt.rootEl && target !== document) {
          dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


          !insertion && nearestEmptyInsertDetectEvent(evt);
        }

        !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
        return completedFired = true;
      } // Call when dragEl has been inserted


      function changed() {
        newIndex = index(dragEl);
        newDraggableIndex = index(dragEl, options.draggable);

        _dispatchEvent({
          sortable: _this,
          name: 'change',
          toEl: el,
          newIndex: newIndex,
          newDraggableIndex: newDraggableIndex,
          originalEvent: evt
        });
      }

      if (evt.preventDefault !== void 0) {
        evt.cancelable && evt.preventDefault();
      }

      target = closest(target, options.draggable, el, true);
      dragOverEvent('dragOver');
      if (Sortable.eventCanceled) return completedFired;

      if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
        return completed(false);
      }

      ignoreNextClick = false;

      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
      : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
        vertical = this._getDirection(evt, target) === 'vertical';
        dragRect = getRect(dragEl);
        dragOverEvent('dragOverValid');
        if (Sortable.eventCanceled) return completedFired;

        if (revert) {
          parentEl = rootEl; // actualization

          capture();

          this._hideClone();

          dragOverEvent('revert');

          if (!Sortable.eventCanceled) {
            if (nextEl) {
              rootEl.insertBefore(dragEl, nextEl);
            } else {
              rootEl.appendChild(dragEl);
            }
          }

          return completed(true);
        }

        var elLastChild = lastChild(el, options.draggable);

        if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
          // If already at end of list: Do not insert
          if (elLastChild === dragEl) {
            return completed(false);
          } // assign target only if condition is true


          if (elLastChild && el === evt.target) {
            target = elLastChild;
          }

          if (target) {
            targetRect = getRect(target);
          }

          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
            capture();
            el.appendChild(dragEl);
            parentEl = el; // actualization

            changed();
            return completed(true);
          }
        } else if (target.parentNode === el) {
          targetRect = getRect(target);
          var direction = 0,
              targetBeforeFirstSwap,
              differentLevel = dragEl.parentNode !== el,
              differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
              side1 = vertical ? 'top' : 'left',
              scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
              scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

          if (lastTarget !== target) {
            targetBeforeFirstSwap = targetRect[side1];
            pastFirstInvertThresh = false;
            isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
          }

          direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
          var sibling;

          if (direction !== 0) {
            // Check if target is beside dragEl in respective direction (ignoring hidden elements)
            var dragIndex = index(dragEl);

            do {
              dragIndex -= direction;
              sibling = parentEl.children[dragIndex];
            } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
          } // If dragEl is already beside target: Do not insert


          if (direction === 0 || sibling === target) {
            return completed(false);
          }

          lastTarget = target;
          lastDirection = direction;
          var nextSibling = target.nextElementSibling,
              after = false;
          after = direction === 1;

          var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

          if (moveVector !== false) {
            if (moveVector === 1 || moveVector === -1) {
              after = moveVector === 1;
            }

            _silent = true;
            setTimeout(_unsilent, 30);
            capture();

            if (after && !nextSibling) {
              el.appendChild(dragEl);
            } else {
              target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
            } // Undo chrome's scroll adjustment (has no effect on other browsers)


            if (scrolledPastTop) {
              scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
            }

            parentEl = dragEl.parentNode; // actualization
            // must be done before animation

            if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
              targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
            }

            changed();
            return completed(true);
          }
        }

        if (el.contains(dragEl)) {
          return completed(false);
        }
      }

      return false;
    },
    _ignoreWhileAnimating: null,
    _offMoveEvents: function _offMoveEvents() {
      off(document, 'mousemove', this._onTouchMove);
      off(document, 'touchmove', this._onTouchMove);
      off(document, 'pointermove', this._onTouchMove);
      off(document, 'dragover', nearestEmptyInsertDetectEvent);
      off(document, 'mousemove', nearestEmptyInsertDetectEvent);
      off(document, 'touchmove', nearestEmptyInsertDetectEvent);
    },
    _offUpEvents: function _offUpEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, 'mouseup', this._onDrop);
      off(ownerDocument, 'touchend', this._onDrop);
      off(ownerDocument, 'pointerup', this._onDrop);
      off(ownerDocument, 'touchcancel', this._onDrop);
      off(document, 'selectstart', this);
    },
    _onDrop: function _onDrop(
    /**Event*/
    evt) {
      var el = this.el,
          options = this.options; // Get the index of the dragged element within its parent

      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      pluginEvent('drop', this, {
        evt: evt
      });
      parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      if (Sortable.eventCanceled) {
        this._nulling();

        return;
      }

      awaitingDragStarted = false;
      isCircumstantialInvert = false;
      pastFirstInvertThresh = false;
      clearInterval(this._loopId);
      clearTimeout(this._dragStartTimer);

      _cancelNextTick(this.cloneId);

      _cancelNextTick(this._dragStartId); // Unbind events


      if (this.nativeDraggable) {
        off(document, 'drop', this);
        off(el, 'dragstart', this._onDragStart);
      }

      this._offMoveEvents();

      this._offUpEvents();

      if (Safari) {
        css(document.body, 'user-select', '');
      }

      css(dragEl, 'transform', '');

      if (evt) {
        if (moved) {
          evt.cancelable && evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }

        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

        if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
          // Remove clone(s)
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }

        if (dragEl) {
          if (this.nativeDraggable) {
            off(dragEl, 'dragend', this);
          }

          _disableDraggable(dragEl);

          dragEl.style['will-change'] = ''; // Remove classes
          // ghostClass is added in dragStarted

          if (moved && !awaitingDragStarted) {
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
          }

          toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

          _dispatchEvent({
            sortable: this,
            name: 'unchoose',
            toEl: parentEl,
            newIndex: null,
            newDraggableIndex: null,
            originalEvent: evt
          });

          if (rootEl !== parentEl) {
            if (newIndex >= 0) {
              // Add event
              _dispatchEvent({
                rootEl: parentEl,
                name: 'add',
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              }); // Remove event


              _dispatchEvent({
                sortable: this,
                name: 'remove',
                toEl: parentEl,
                originalEvent: evt
              }); // drag from one list and drop into another


              _dispatchEvent({
                rootEl: parentEl,
                name: 'sort',
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }

            putSortable && putSortable.save();
          } else {
            if (newIndex !== oldIndex) {
              if (newIndex >= 0) {
                // drag & drop within the same list
                _dispatchEvent({
                  sortable: this,
                  name: 'update',
                  toEl: parentEl,
                  originalEvent: evt
                });

                _dispatchEvent({
                  sortable: this,
                  name: 'sort',
                  toEl: parentEl,
                  originalEvent: evt
                });
              }
            }
          }

          if (Sortable.active) {
            /* jshint eqnull:true */
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
              newDraggableIndex = oldDraggableIndex;
            }

            _dispatchEvent({
              sortable: this,
              name: 'end',
              toEl: parentEl,
              originalEvent: evt
            }); // Save sorting


            this.save();
          }
        }
      }

      this._nulling();
    },
    _nulling: function _nulling() {
      pluginEvent('nulling', this);
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
      savedInputChecked.forEach(function (el) {
        el.checked = true;
      });
      savedInputChecked.length = lastDx = lastDy = 0;
    },
    handleEvent: function handleEvent(
    /**Event*/
    evt) {
      switch (evt.type) {
        case 'drop':
        case 'dragend':
          this._onDrop(evt);

          break;

        case 'dragenter':
        case 'dragover':
          if (dragEl) {
            this._onDragOver(evt);

            _globalDragOver(evt);
          }

          break;

        case 'selectstart':
          evt.preventDefault();
          break;
      }
    },

    /**
     * Serializes the item into an array of string.
     * @returns {String[]}
     */
    toArray: function toArray() {
      var order = [],
          el,
          children = this.el.children,
          i = 0,
          n = children.length,
          options = this.options;

      for (; i < n; i++) {
        el = children[i];

        if (closest(el, options.draggable, this.el, false)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }

      return order;
    },

    /**
     * Sorts the elements according to the array.
     * @param  {String[]}  order  order of the items
     */
    sort: function sort(order) {
      var items = {},
          rootEl = this.el;
      this.toArray().forEach(function (id, i) {
        var el = rootEl.children[i];

        if (closest(el, this.options.draggable, rootEl, false)) {
          items[id] = el;
        }
      }, this);
      order.forEach(function (id) {
        if (items[id]) {
          rootEl.removeChild(items[id]);
          rootEl.appendChild(items[id]);
        }
      });
    },

    /**
     * Save the current sorting
     */
    save: function save() {
      var store = this.options.store;
      store && store.set && store.set(this);
    },

    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param   {HTMLElement}  el
     * @param   {String}       [selector]  default: `options.draggable`
     * @returns {HTMLElement|null}
     */
    closest: function closest$1(el, selector) {
      return closest(el, selector || this.options.draggable, this.el, false);
    },

    /**
     * Set/get option
     * @param   {string} name
     * @param   {*}      [value]
     * @returns {*}
     */
    option: function option(name, value) {
      var options = this.options;

      if (value === void 0) {
        return options[name];
      } else {
        var modifiedValue = PluginManager.modifyOption(this, name, value);

        if (typeof modifiedValue !== 'undefined') {
          options[name] = modifiedValue;
        } else {
          options[name] = value;
        }

        if (name === 'group') {
          _prepareGroup(options);
        }
      }
    },

    /**
     * Destroy
     */
    destroy: function destroy() {
      pluginEvent('destroy', this);
      var el = this.el;
      el[expando] = null;
      off(el, 'mousedown', this._onTapStart);
      off(el, 'touchstart', this._onTapStart);
      off(el, 'pointerdown', this._onTapStart);

      if (this.nativeDraggable) {
        off(el, 'dragover', this);
        off(el, 'dragenter', this);
      } // Remove draggable attributes


      Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
        el.removeAttribute('draggable');
      });

      this._onDrop();

      this._disableDelayedDragEvents();

      sortables.splice(sortables.indexOf(this.el), 1);
      this.el = el = null;
    },
    _hideClone: function _hideClone() {
      if (!cloneHidden) {
        pluginEvent('hideClone', this);
        if (Sortable.eventCanceled) return;
        css(cloneEl, 'display', 'none');

        if (this.options.removeCloneOnHide && cloneEl.parentNode) {
          cloneEl.parentNode.removeChild(cloneEl);
        }

        cloneHidden = true;
      }
    },
    _showClone: function _showClone(putSortable) {
      if (putSortable.lastPutMode !== 'clone') {
        this._hideClone();

        return;
      }

      if (cloneHidden) {
        pluginEvent('showClone', this);
        if (Sortable.eventCanceled) return; // show clone at dragEl or original position

        if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
          rootEl.insertBefore(cloneEl, dragEl);
        } else if (nextEl) {
          rootEl.insertBefore(cloneEl, nextEl);
        } else {
          rootEl.appendChild(cloneEl);
        }

        if (this.options.group.revertClone) {
          this.animate(dragEl, cloneEl);
        }

        css(cloneEl, 'display', '');
        cloneHidden = false;
      }
    }
  };

  function _globalDragOver(
  /**Event*/
  evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = 'move';
    }

    evt.cancelable && evt.preventDefault();
  }

  function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
    var evt,
        sortable = fromEl[expando],
        onMoveFn = sortable.options.onMove,
        retVal; // Support for new CustomEvent feature

    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent('move', {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent('Event');
      evt.initEvent('move', true, true);
    }

    evt.to = toEl;
    evt.from = fromEl;
    evt.dragged = dragEl;
    evt.draggedRect = dragRect;
    evt.related = targetEl || toEl;
    evt.relatedRect = targetRect || getRect(toEl);
    evt.willInsertAfter = willInsertAfter;
    evt.originalEvent = originalEvent;
    fromEl.dispatchEvent(evt);

    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvent);
    }

    return retVal;
  }

  function _disableDraggable(el) {
    el.draggable = false;
  }

  function _unsilent() {
    _silent = false;
  }

  function _ghostIsLast(evt, vertical, sortable) {
    var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
    var spacer = 10;
    return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
  }

  function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
    var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
        targetLength = vertical ? targetRect.height : targetRect.width,
        targetS1 = vertical ? targetRect.top : targetRect.left,
        targetS2 = vertical ? targetRect.bottom : targetRect.right,
        invert = false;

    if (!invertSwap) {
      // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
      if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
        // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
        // check if past first invert threshold on side opposite of lastDirection
        if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
          // past first invert threshold, do not restrict inverted threshold to dragEl shadow
          pastFirstInvertThresh = true;
        }

        if (!pastFirstInvertThresh) {
          // dragEl shadow (target move distance shadow)
          if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
          : mouseOnAxis > targetS2 - targetMoveDistance) {
            return -lastDirection;
          }
        } else {
          invert = true;
        }
      } else {
        // Regular
        if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
          return _getInsertDirection(target);
        }
      }
    }

    invert = invert || invertSwap;

    if (invert) {
      // Invert of regular
      if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
        return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
      }
    }

    return 0;
  }
  /**
   * Gets the direction dragEl must be swapped relative to target in order to make it
   * seem that dragEl has been "inserted" into that element's position
   * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
   * @return {Number}                   Direction dragEl must be swapped
   */

  function _getInsertDirection(target) {
    if (index(dragEl) < index(target)) {
      return 1;
    } else {
      return -1;
    }
  }
  /**
   * Generate id
   * @param   {HTMLElement} el
   * @returns {String}
   * @private
   */

  function _generateId(el) {
    var str = el.tagName + el.className + el.src + el.href + el.textContent,
        i = str.length,
        sum = 0;

    while (i--) {
      sum += str.charCodeAt(i);
    }

    return sum.toString(36);
  }

  function _saveInputCheckedState(root) {
    savedInputChecked.length = 0;
    var inputs = root.getElementsByTagName('input');
    var idx = inputs.length;

    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }

  function _nextTick(fn) {
    return setTimeout(fn, 0);
  }

  function _cancelNextTick(id) {
    return clearTimeout(id);
  } // Fixed #973:


  if (documentExists) {
    on(document, 'touchmove', function (evt) {
      if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
        evt.preventDefault();
      }
    });
  } // Export utils


  Sortable.utils = {
    on: on,
    off: off,
    css: css,
    find: find,
    is: function is(el, selector) {
      return !!closest(el, selector, el, false);
    },
    extend: extend,
    throttle: throttle,
    closest: closest,
    toggleClass: toggleClass,
    clone: clone,
    index: index,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick,
    detectDirection: _detectDirection,
    getChild: getChild
  };
  /**
   * Get the Sortable instance of an element
   * @param  {HTMLElement} element The element
   * @return {Sortable|undefined}         The instance of Sortable
   */

  Sortable.get = function (element) {
    return element[expando];
  };
  /**
   * Mount a plugin to Sortable
   * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
   */

  Sortable.mount = function () {
    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }

    if (plugins[0].constructor === Array) plugins = plugins[0];
    plugins.forEach(function (plugin) {
      if (!plugin.prototype || !plugin.prototype.constructor) {
        throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
      }

      if (plugin.utils) Sortable.utils = _objectSpread({}, Sortable.utils, plugin.utils);
      PluginManager.mount(plugin);
    });
  };
  /**
   * Create sortable instance
   * @param {HTMLElement}  el
   * @param {Object}      [options]
   */

  Sortable.create = function (el, options) {
    return new Sortable(el, options);
  }; // Export


  Sortable.version = version;

  var autoScrolls = [],
      scrollEl,
      scrollRootEl,
      scrolling = false,
      lastAutoScrollX,
      lastAutoScrollY,
      touchEvt$1,
      pointerElemChangedInterval;

  function AutoScrollPlugin() {
    function AutoScroll() {
      this.defaults = {
        scroll: true,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        bubbleScroll: true
      }; // Bind all private methods

      for (var fn in this) {
        if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
          this[fn] = this[fn].bind(this);
        }
      }
    }

    AutoScroll.prototype = {
      dragStarted: function dragStarted(_ref) {
        var originalEvent = _ref.originalEvent;

        if (this.sortable.nativeDraggable) {
          on(document, 'dragover', this._handleAutoScroll);
        } else {
          if (this.options.supportPointer) {
            on(document, 'pointermove', this._handleFallbackAutoScroll);
          } else if (originalEvent.touches) {
            on(document, 'touchmove', this._handleFallbackAutoScroll);
          } else {
            on(document, 'mousemove', this._handleFallbackAutoScroll);
          }
        }
      },
      dragOverCompleted: function dragOverCompleted(_ref2) {
        var originalEvent = _ref2.originalEvent;

        // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
        if (!this.options.dragOverBubble && !originalEvent.rootEl) {
          this._handleAutoScroll(originalEvent);
        }
      },
      drop: function drop() {
        if (this.sortable.nativeDraggable) {
          off(document, 'dragover', this._handleAutoScroll);
        } else {
          off(document, 'pointermove', this._handleFallbackAutoScroll);
          off(document, 'touchmove', this._handleFallbackAutoScroll);
          off(document, 'mousemove', this._handleFallbackAutoScroll);
        }

        clearPointerElemChangedInterval();
        clearAutoScrolls();
        cancelThrottle();
      },
      nulling: function nulling() {
        touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
        autoScrolls.length = 0;
      },
      _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
        this._handleAutoScroll(evt, true);
      },
      _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
        var _this = this;

        var x = (evt.touches ? evt.touches[0] : evt).clientX,
            y = (evt.touches ? evt.touches[0] : evt).clientY,
            elem = document.elementFromPoint(x, y);
        touchEvt$1 = evt; // IE does not seem to have native autoscroll,
        // Edge's autoscroll seems too conditional,
        // MACOS Safari does not have autoscroll,
        // Firefox and Chrome are good

        if (fallback || Edge || IE11OrLess || Safari) {
          autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

          var ogElemScroller = getParentAutoScrollElement(elem, true);

          if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
            pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

            pointerElemChangedInterval = setInterval(function () {
              var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

              if (newElem !== ogElemScroller) {
                ogElemScroller = newElem;
                clearAutoScrolls();
              }

              autoScroll(evt, _this.options, newElem, fallback);
            }, 10);
            lastAutoScrollX = x;
            lastAutoScrollY = y;
          }
        } else {
          // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
          if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
            clearAutoScrolls();
            return;
          }

          autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
        }
      }
    };
    return _extends(AutoScroll, {
      pluginName: 'scroll',
      initializeByDefault: true
    });
  }

  function clearAutoScrolls() {
    autoScrolls.forEach(function (autoScroll) {
      clearInterval(autoScroll.pid);
    });
    autoScrolls = [];
  }

  function clearPointerElemChangedInterval() {
    clearInterval(pointerElemChangedInterval);
  }

  var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
    // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    if (!options.scroll) return;
    var x = (evt.touches ? evt.touches[0] : evt).clientX,
        y = (evt.touches ? evt.touches[0] : evt).clientY,
        sens = options.scrollSensitivity,
        speed = options.scrollSpeed,
        winScroller = getWindowScrollingElement();
    var scrollThisInstance = false,
        scrollCustomFn; // New scroll root, set scrollEl

    if (scrollRootEl !== rootEl) {
      scrollRootEl = rootEl;
      clearAutoScrolls();
      scrollEl = options.scroll;
      scrollCustomFn = options.scrollFn;

      if (scrollEl === true) {
        scrollEl = getParentAutoScrollElement(rootEl, true);
      }
    }

    var layersOut = 0;
    var currentParent = scrollEl;

    do {
      var el = currentParent,
          rect = getRect(el),
          top = rect.top,
          bottom = rect.bottom,
          left = rect.left,
          right = rect.right,
          width = rect.width,
          height = rect.height,
          canScrollX = void 0,
          canScrollY = void 0,
          scrollWidth = el.scrollWidth,
          scrollHeight = el.scrollHeight,
          elCSS = css(el),
          scrollPosX = el.scrollLeft,
          scrollPosY = el.scrollTop;

      if (el === winScroller) {
        canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
        canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
      } else {
        canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
        canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
      }

      var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
      var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

      if (!autoScrolls[layersOut]) {
        for (var i = 0; i <= layersOut; i++) {
          if (!autoScrolls[i]) {
            autoScrolls[i] = {};
          }
        }
      }

      if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
        autoScrolls[layersOut].el = el;
        autoScrolls[layersOut].vx = vx;
        autoScrolls[layersOut].vy = vy;
        clearInterval(autoScrolls[layersOut].pid);

        if (vx != 0 || vy != 0) {
          scrollThisInstance = true;
          /* jshint loopfunc:true */

          autoScrolls[layersOut].pid = setInterval(function () {
            // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
            if (isFallback && this.layer === 0) {
              Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely
            }

            var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
            var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

            if (typeof scrollCustomFn === 'function') {
              if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
                return;
              }
            }

            scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
          }.bind({
            layer: layersOut
          }), 24);
        }
      }

      layersOut++;
    } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

    scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
  }, 30);

  var drop = function drop(_ref) {
    var originalEvent = _ref.originalEvent,
        putSortable = _ref.putSortable,
        dragEl = _ref.dragEl,
        activeSortable = _ref.activeSortable,
        dispatchSortableEvent = _ref.dispatchSortableEvent,
        hideGhostForTarget = _ref.hideGhostForTarget,
        unhideGhostForTarget = _ref.unhideGhostForTarget;
    if (!originalEvent) return;
    var toSortable = putSortable || activeSortable;
    hideGhostForTarget();
    var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
    var target = document.elementFromPoint(touch.clientX, touch.clientY);
    unhideGhostForTarget();

    if (toSortable && !toSortable.el.contains(target)) {
      dispatchSortableEvent('spill');
      this.onSpill({
        dragEl: dragEl,
        putSortable: putSortable
      });
    }
  };

  function Revert() {}

  Revert.prototype = {
    startIndex: null,
    dragStart: function dragStart(_ref2) {
      var oldDraggableIndex = _ref2.oldDraggableIndex;
      this.startIndex = oldDraggableIndex;
    },
    onSpill: function onSpill(_ref3) {
      var dragEl = _ref3.dragEl,
          putSortable = _ref3.putSortable;
      this.sortable.captureAnimationState();

      if (putSortable) {
        putSortable.captureAnimationState();
      }

      var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

      if (nextSibling) {
        this.sortable.el.insertBefore(dragEl, nextSibling);
      } else {
        this.sortable.el.appendChild(dragEl);
      }

      this.sortable.animateAll();

      if (putSortable) {
        putSortable.animateAll();
      }
    },
    drop: drop
  };

  _extends(Revert, {
    pluginName: 'revertOnSpill'
  });

  function Remove() {}

  Remove.prototype = {
    onSpill: function onSpill(_ref4) {
      var dragEl = _ref4.dragEl,
          putSortable = _ref4.putSortable;
      var parentSortable = putSortable || this.sortable;
      parentSortable.captureAnimationState();
      dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
      parentSortable.animateAll();
    },
    drop: drop
  };

  _extends(Remove, {
    pluginName: 'removeOnSpill'
  });

  var lastSwapEl;

  function SwapPlugin() {
    function Swap() {
      this.defaults = {
        swapClass: 'sortable-swap-highlight'
      };
    }

    Swap.prototype = {
      dragStart: function dragStart(_ref) {
        var dragEl = _ref.dragEl;
        lastSwapEl = dragEl;
      },
      dragOverValid: function dragOverValid(_ref2) {
        var completed = _ref2.completed,
            target = _ref2.target,
            onMove = _ref2.onMove,
            activeSortable = _ref2.activeSortable,
            changed = _ref2.changed,
            cancel = _ref2.cancel;
        if (!activeSortable.options.swap) return;
        var el = this.sortable.el,
            options = this.options;

        if (target && target !== el) {
          var prevSwapEl = lastSwapEl;

          if (onMove(target) !== false) {
            toggleClass(target, options.swapClass, true);
            lastSwapEl = target;
          } else {
            lastSwapEl = null;
          }

          if (prevSwapEl && prevSwapEl !== lastSwapEl) {
            toggleClass(prevSwapEl, options.swapClass, false);
          }
        }

        changed();
        completed(true);
        cancel();
      },
      drop: function drop(_ref3) {
        var activeSortable = _ref3.activeSortable,
            putSortable = _ref3.putSortable,
            dragEl = _ref3.dragEl;
        var toSortable = putSortable || this.sortable;
        var options = this.options;
        lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

        if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
          if (dragEl !== lastSwapEl) {
            toSortable.captureAnimationState();
            if (toSortable !== activeSortable) activeSortable.captureAnimationState();
            swapNodes(dragEl, lastSwapEl);
            toSortable.animateAll();
            if (toSortable !== activeSortable) activeSortable.animateAll();
          }
        }
      },
      nulling: function nulling() {
        lastSwapEl = null;
      }
    };
    return _extends(Swap, {
      pluginName: 'swap',
      eventProperties: function eventProperties() {
        return {
          swapItem: lastSwapEl
        };
      }
    });
  }

  function swapNodes(n1, n2) {
    var p1 = n1.parentNode,
        p2 = n2.parentNode,
        i1,
        i2;
    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
    i1 = index(n1);
    i2 = index(n2);

    if (p1.isEqualNode(p2) && i1 < i2) {
      i2++;
    }

    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
  }

  var multiDragElements = [],
      multiDragClones = [],
      lastMultiDragSelect,

  // for selection with modifier key down (SHIFT)
  multiDragSortable,
      initialFolding = false,

  // Initial multi-drag fold when drag started
  folding = false,

  // Folding any other time
  dragStarted = false,
      dragEl$1,
      clonesFromRect,
      clonesHidden;

  function MultiDragPlugin() {
    function MultiDrag(sortable) {
      // Bind all private methods
      for (var fn in this) {
        if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
          this[fn] = this[fn].bind(this);
        }
      }

      if (sortable.options.supportPointer) {
        on(document, 'pointerup', this._deselectMultiDrag);
      } else {
        on(document, 'mouseup', this._deselectMultiDrag);
        on(document, 'touchend', this._deselectMultiDrag);
      }

      on(document, 'keydown', this._checkKeyDown);
      on(document, 'keyup', this._checkKeyUp);
      this.defaults = {
        selectedClass: 'sortable-selected',
        multiDragKey: null,
        setData: function setData(dataTransfer, dragEl) {
          var data = '';

          if (multiDragElements.length && multiDragSortable === sortable) {
            multiDragElements.forEach(function (multiDragElement, i) {
              data += (!i ? '' : ', ') + multiDragElement.textContent;
            });
          } else {
            data = dragEl.textContent;
          }

          dataTransfer.setData('Text', data);
        }
      };
    }

    MultiDrag.prototype = {
      multiDragKeyDown: false,
      isMultiDrag: false,
      delayStartGlobal: function delayStartGlobal(_ref) {
        var dragged = _ref.dragEl;
        dragEl$1 = dragged;
      },
      delayEnded: function delayEnded() {
        this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
      },
      setupClone: function setupClone(_ref2) {
        var sortable = _ref2.sortable,
            cancel = _ref2.cancel;
        if (!this.isMultiDrag) return;

        for (var i = 0; i < multiDragElements.length; i++) {
          multiDragClones.push(clone(multiDragElements[i]));
          multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
          multiDragClones[i].draggable = false;
          multiDragClones[i].style['will-change'] = '';
          toggleClass(multiDragClones[i], this.options.selectedClass, false);
          multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
        }

        sortable._hideClone();

        cancel();
      },
      clone: function clone(_ref3) {
        var sortable = _ref3.sortable,
            rootEl = _ref3.rootEl,
            dispatchSortableEvent = _ref3.dispatchSortableEvent,
            cancel = _ref3.cancel;
        if (!this.isMultiDrag) return;

        if (!this.options.removeCloneOnHide) {
          if (multiDragElements.length && multiDragSortable === sortable) {
            insertMultiDragClones(true, rootEl);
            dispatchSortableEvent('clone');
            cancel();
          }
        }
      },
      showClone: function showClone(_ref4) {
        var cloneNowShown = _ref4.cloneNowShown,
            rootEl = _ref4.rootEl,
            cancel = _ref4.cancel;
        if (!this.isMultiDrag) return;
        insertMultiDragClones(false, rootEl);
        multiDragClones.forEach(function (clone) {
          css(clone, 'display', '');
        });
        cloneNowShown();
        clonesHidden = false;
        cancel();
      },
      hideClone: function hideClone(_ref5) {
        var _this = this;

        var sortable = _ref5.sortable,
            cloneNowHidden = _ref5.cloneNowHidden,
            cancel = _ref5.cancel;
        if (!this.isMultiDrag) return;
        multiDragClones.forEach(function (clone) {
          css(clone, 'display', 'none');

          if (_this.options.removeCloneOnHide && clone.parentNode) {
            clone.parentNode.removeChild(clone);
          }
        });
        cloneNowHidden();
        clonesHidden = true;
        cancel();
      },
      dragStartGlobal: function dragStartGlobal(_ref6) {
        if (!this.isMultiDrag && multiDragSortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();
        }

        multiDragElements.forEach(function (multiDragElement) {
          multiDragElement.sortableIndex = index(multiDragElement);
        }); // Sort multi-drag elements

        multiDragElements = multiDragElements.sort(function (a, b) {
          return a.sortableIndex - b.sortableIndex;
        });
        dragStarted = true;
      },
      dragStarted: function dragStarted(_ref7) {
        var _this2 = this;

        var sortable = _ref7.sortable;
        if (!this.isMultiDrag) return;

        if (this.options.sort) {
          // Capture rects,
          // hide multi drag elements (by positioning them absolute),
          // set multi drag elements rects to dragRect,
          // show multi drag elements,
          // animate to rects,
          // unset rects & remove from DOM
          sortable.captureAnimationState();

          if (this.options.animation) {
            multiDragElements.forEach(function (multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              css(multiDragElement, 'position', 'absolute');
            });
            var dragRect = getRect(dragEl$1, false, true, true);
            multiDragElements.forEach(function (multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              setRect(multiDragElement, dragRect);
            });
            folding = true;
            initialFolding = true;
          }
        }

        sortable.animateAll(function () {
          folding = false;
          initialFolding = false;

          if (_this2.options.animation) {
            multiDragElements.forEach(function (multiDragElement) {
              unsetRect(multiDragElement);
            });
          } // Remove all auxiliary multidrag items from el, if sorting enabled


          if (_this2.options.sort) {
            removeMultiDragElements();
          }
        });
      },
      dragOver: function dragOver(_ref8) {
        var target = _ref8.target,
            completed = _ref8.completed,
            cancel = _ref8.cancel;

        if (folding && ~multiDragElements.indexOf(target)) {
          completed(false);
          cancel();
        }
      },
      revert: function revert(_ref9) {
        var fromSortable = _ref9.fromSortable,
            rootEl = _ref9.rootEl,
            sortable = _ref9.sortable,
            dragRect = _ref9.dragRect;

        if (multiDragElements.length > 1) {
          // Setup unfold animation
          multiDragElements.forEach(function (multiDragElement) {
            sortable.addAnimationState({
              target: multiDragElement,
              rect: folding ? getRect(multiDragElement) : dragRect
            });
            unsetRect(multiDragElement);
            multiDragElement.fromRect = dragRect;
            fromSortable.removeAnimationState(multiDragElement);
          });
          folding = false;
          insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
        }
      },
      dragOverCompleted: function dragOverCompleted(_ref10) {
        var sortable = _ref10.sortable,
            isOwner = _ref10.isOwner,
            insertion = _ref10.insertion,
            activeSortable = _ref10.activeSortable,
            parentEl = _ref10.parentEl,
            putSortable = _ref10.putSortable;
        var options = this.options;

        if (insertion) {
          // Clones must be hidden before folding animation to capture dragRectAbsolute properly
          if (isOwner) {
            activeSortable._hideClone();
          }

          initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

          if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
            // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
            var dragRectAbsolute = getRect(dragEl$1, false, true, true);
            multiDragElements.forEach(function (multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
              // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

              parentEl.appendChild(multiDragElement);
            });
            folding = true;
          } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


          if (!isOwner) {
            // Only remove if not folding (folding will remove them anyways)
            if (!folding) {
              removeMultiDragElements();
            }

            if (multiDragElements.length > 1) {
              var clonesHiddenBefore = clonesHidden;

              activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


              if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
                multiDragClones.forEach(function (clone) {
                  activeSortable.addAnimationState({
                    target: clone,
                    rect: clonesFromRect
                  });
                  clone.fromRect = clonesFromRect;
                  clone.thisAnimationDuration = null;
                });
              }
            } else {
              activeSortable._showClone(sortable);
            }
          }
        }
      },
      dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
        var dragRect = _ref11.dragRect,
            isOwner = _ref11.isOwner,
            activeSortable = _ref11.activeSortable;
        multiDragElements.forEach(function (multiDragElement) {
          multiDragElement.thisAnimationDuration = null;
        });

        if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
          clonesFromRect = _extends({}, dragRect);
          var dragMatrix = matrix(dragEl$1, true);
          clonesFromRect.top -= dragMatrix.f;
          clonesFromRect.left -= dragMatrix.e;
        }
      },
      dragOverAnimationComplete: function dragOverAnimationComplete() {
        if (folding) {
          folding = false;
          removeMultiDragElements();
        }
      },
      drop: function drop(_ref12) {
        var evt = _ref12.originalEvent,
            rootEl = _ref12.rootEl,
            parentEl = _ref12.parentEl,
            sortable = _ref12.sortable,
            dispatchSortableEvent = _ref12.dispatchSortableEvent,
            oldIndex = _ref12.oldIndex,
            putSortable = _ref12.putSortable;
        var toSortable = putSortable || this.sortable;
        if (!evt) return;
        var options = this.options,
            children = parentEl.children; // Multi-drag selection

        if (!dragStarted) {
          if (options.multiDragKey && !this.multiDragKeyDown) {
            this._deselectMultiDrag();
          }

          toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

          if (!~multiDragElements.indexOf(dragEl$1)) {
            multiDragElements.push(dragEl$1);
            dispatchEvent({
              sortable: sortable,
              rootEl: rootEl,
              name: 'select',
              targetEl: dragEl$1,
              originalEvt: evt
            }); // Modifier activated, select from last to dragEl

            if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
              var lastIndex = index(lastMultiDragSelect),
                  currentIndex = index(dragEl$1);

              if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
                // Must include lastMultiDragSelect (select it), in case modified selection from no selection
                // (but previous selection existed)
                var n, i;

                if (currentIndex > lastIndex) {
                  i = lastIndex;
                  n = currentIndex;
                } else {
                  i = currentIndex;
                  n = lastIndex + 1;
                }

                for (; i < n; i++) {
                  if (~multiDragElements.indexOf(children[i])) continue;
                  toggleClass(children[i], options.selectedClass, true);
                  multiDragElements.push(children[i]);
                  dispatchEvent({
                    sortable: sortable,
                    rootEl: rootEl,
                    name: 'select',
                    targetEl: children[i],
                    originalEvt: evt
                  });
                }
              }
            } else {
              lastMultiDragSelect = dragEl$1;
            }

            multiDragSortable = toSortable;
          } else {
            multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
            lastMultiDragSelect = null;
            dispatchEvent({
              sortable: sortable,
              rootEl: rootEl,
              name: 'deselect',
              targetEl: dragEl$1,
              originalEvt: evt
            });
          }
        } // Multi-drag drop


        if (dragStarted && this.isMultiDrag) {
          // Do not "unfold" after around dragEl if reverted
          if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
            var dragRect = getRect(dragEl$1),
                multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
            if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
            toSortable.captureAnimationState();

            if (!initialFolding) {
              if (options.animation) {
                dragEl$1.fromRect = dragRect;
                multiDragElements.forEach(function (multiDragElement) {
                  multiDragElement.thisAnimationDuration = null;

                  if (multiDragElement !== dragEl$1) {
                    var rect = folding ? getRect(multiDragElement) : dragRect;
                    multiDragElement.fromRect = rect; // Prepare unfold animation

                    toSortable.addAnimationState({
                      target: multiDragElement,
                      rect: rect
                    });
                  }
                });
              } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
              // properly they must all be removed


              removeMultiDragElements();
              multiDragElements.forEach(function (multiDragElement) {
                if (children[multiDragIndex]) {
                  parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
                } else {
                  parentEl.appendChild(multiDragElement);
                }

                multiDragIndex++;
              }); // If initial folding is done, the elements may have changed position because they are now
              // unfolding around dragEl, even though dragEl may not have his index changed, so update event
              // must be fired here as Sortable will not.

              if (oldIndex === index(dragEl$1)) {
                var update = false;
                multiDragElements.forEach(function (multiDragElement) {
                  if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                    update = true;
                    return;
                  }
                });

                if (update) {
                  dispatchSortableEvent('update');
                }
              }
            } // Must be done after capturing individual rects (scroll bar)


            multiDragElements.forEach(function (multiDragElement) {
              unsetRect(multiDragElement);
            });
            toSortable.animateAll();
          }

          multiDragSortable = toSortable;
        } // Remove clones if necessary


        if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
          multiDragClones.forEach(function (clone) {
            clone.parentNode && clone.parentNode.removeChild(clone);
          });
        }
      },
      nullingGlobal: function nullingGlobal() {
        this.isMultiDrag = dragStarted = false;
        multiDragClones.length = 0;
      },
      destroyGlobal: function destroyGlobal() {
        this._deselectMultiDrag();

        off(document, 'pointerup', this._deselectMultiDrag);
        off(document, 'mouseup', this._deselectMultiDrag);
        off(document, 'touchend', this._deselectMultiDrag);
        off(document, 'keydown', this._checkKeyDown);
        off(document, 'keyup', this._checkKeyUp);
      },
      _deselectMultiDrag: function _deselectMultiDrag(evt) {
        if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

        if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

        if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

        if (evt && evt.button !== 0) return;

        while (multiDragElements.length) {
          var el = multiDragElements[0];
          toggleClass(el, this.options.selectedClass, false);
          multiDragElements.shift();
          dispatchEvent({
            sortable: this.sortable,
            rootEl: this.sortable.el,
            name: 'deselect',
            targetEl: el,
            originalEvt: evt
          });
        }
      },
      _checkKeyDown: function _checkKeyDown(evt) {
        if (evt.key === this.options.multiDragKey) {
          this.multiDragKeyDown = true;
        }
      },
      _checkKeyUp: function _checkKeyUp(evt) {
        if (evt.key === this.options.multiDragKey) {
          this.multiDragKeyDown = false;
        }
      }
    };
    return _extends(MultiDrag, {
      // Static methods & properties
      pluginName: 'multiDrag',
      utils: {
        /**
         * Selects the provided multi-drag item
         * @param  {HTMLElement} el    The element to be selected
         */
        select: function select(el) {
          var sortable = el.parentNode[expando];
          if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

          if (multiDragSortable && multiDragSortable !== sortable) {
            multiDragSortable.multiDrag._deselectMultiDrag();

            multiDragSortable = sortable;
          }

          toggleClass(el, sortable.options.selectedClass, true);
          multiDragElements.push(el);
        },

        /**
         * Deselects the provided multi-drag item
         * @param  {HTMLElement} el    The element to be deselected
         */
        deselect: function deselect(el) {
          var sortable = el.parentNode[expando],
              index = multiDragElements.indexOf(el);
          if (!sortable || !sortable.options.multiDrag || !~index) return;
          toggleClass(el, sortable.options.selectedClass, false);
          multiDragElements.splice(index, 1);
        }
      },
      eventProperties: function eventProperties() {
        var _this3 = this;

        var oldIndicies = [],
            newIndicies = [];
        multiDragElements.forEach(function (multiDragElement) {
          oldIndicies.push({
            multiDragElement: multiDragElement,
            index: multiDragElement.sortableIndex
          }); // multiDragElements will already be sorted if folding

          var newIndex;

          if (folding && multiDragElement !== dragEl$1) {
            newIndex = -1;
          } else if (folding) {
            newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
          } else {
            newIndex = index(multiDragElement);
          }

          newIndicies.push({
            multiDragElement: multiDragElement,
            index: newIndex
          });
        });
        return {
          items: _toConsumableArray(multiDragElements),
          clones: [].concat(multiDragClones),
          oldIndicies: oldIndicies,
          newIndicies: newIndicies
        };
      },
      optionListeners: {
        multiDragKey: function multiDragKey(key) {
          key = key.toLowerCase();

          if (key === 'ctrl') {
            key = 'Control';
          } else if (key.length > 1) {
            key = key.charAt(0).toUpperCase() + key.substr(1);
          }

          return key;
        }
      }
    });
  }

  function insertMultiDragElements(clonesInserted, rootEl) {
    multiDragElements.forEach(function (multiDragElement, i) {
      var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

      if (target) {
        rootEl.insertBefore(multiDragElement, target);
      } else {
        rootEl.appendChild(multiDragElement);
      }
    });
  }
  /**
   * Insert multi-drag clones
   * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
   * @param  {HTMLElement} rootEl
   */

  function insertMultiDragClones(elementsInserted, rootEl) {
    multiDragClones.forEach(function (clone, i) {
      var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

      if (target) {
        rootEl.insertBefore(clone, target);
      } else {
        rootEl.appendChild(clone);
      }
    });
  }

  function removeMultiDragElements() {
    multiDragElements.forEach(function (multiDragElement) {
      if (multiDragElement === dragEl$1) return;
      multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
    });
  }

  Sortable.mount(new AutoScrollPlugin());
  Sortable.mount(Remove, Revert);

  Sortable.mount(new SwapPlugin());
  Sortable.mount(new MultiDragPlugin());

  return Sortable;
});

/**
 * 选择人员界面
 * 依赖mui.css
 */

var ACTION_WRAP_UNIQUE_ID = 'defaultSelectPersonWrapContent';
var ACTION_STRUCTURE_UNIQUE_ID = 'defaultStructureContent';
var ACTION_EDIT_UNIQUE_ID = 'defaultEditContent';
var ACTION_SEARCH_UNIQUE_ID = 'defaultSearchContent';
var FORMAL_URL = 'http://218.4.136.126:1443/oa9_v7/rest/oa9/';
// 头像地址
var PHOTO_URL = FORMAL_URL.match(/(\S*)rest/)[1];
// 获取部门及人员列表接口
var getoulistwithuser = 'address_getoulistwithuser_v7';
// 搜索人员接口
var searchuserbycondition = 'address_searchuserbycondition_v7';
// 获取部门下所有人员列表
var getalluserlist = 'address_getalluserlist_v7';
// 获取个人用户信息
var personalgetdetail = 'getuserinfo_guid_v7';
// 通过guids获取用户信息
var getuserinfolist = 'address_getuserinfolist_v7';
// 获取分组列表
var getgrouplist = 'frame_myaddressgrouplist_v7';
// 获取分组下直属子用户列表
var getaddressbooklist = 'frame_myaddressbooklist_v7';

// 传入参数
var formalUrl = '';
var maxchoosecount = 500;
var isouonly = '0';
var issingle = '0';
var selectedusers = [];
var unableselectusers = [];
var selectedous = [];
var custom = {};
var token = '';
var callback$1 = null;

var searchonce = 0;
var timer = null;
var isSelectRange = '0';
var selectedNum = 0;
var getFromAjaxOu = [];
var getFromAjaxUser = [];
var getFromSearchUser = [];
// 选择范围时用于计算部门人数
var usercount = 0;
var renderStructure = void 0;
var renderSearchContent = void 0;
var myShadowDom = null;

// 公共样式
var commonClassName = function commonClassName() {
    var style = document.createElement('style');
    style.textContent = '\n        .ejs-select-wrapper .mui-scroll-wrapper,\n        .ejs-edit-wrapper .mui-scroll-wrapper{\n            width: 100%;\n            overflow: scroll;\n            touch-action: none;\n        }\n        .ejs-select-wrapper{\n            z-index: 10000;\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            background-color: #f9f9f9;\n            width: 100vw;\n            height: 0;\n            overflow: hidden;\n        }\n        .ejs-select-wrapper header {\n            padding: 0 10px;\n            text-align: center;\n            height: 48px;\n            line-height: 46px;\n            background-color: #fff;\n            border-bottom: 1px solid #d9d9d9;\n        }\n        .ejs-select-wrapper header .mui-input-search{\n            position: relative;\n            height: 46px;\n            vertical-align: middle;\n        }\n        .ejs-select-wrapper header .mui-input-search.focus{\n            display: inline-block;\n            width: 87%;\n        }\n        .ejs-select-wrapper header .mui-input-search.focus input{\n            text-align: left;\n        }\n        .ejs-select-wrapper header .mui-input-search input{\n            margin-bottom: 0;\n            padding: 10px 28px;\n            height: 31px;\n        }\n        .ejs-select-wrapper header .mui-icon-search{\n            position: absolute;\n            left: 2px;\n            top: 11px;\n        }\n        .ejs-select-wrapper header .cancel-btn{\n            color: #3C80E6;\n        }\n        .ejs-select-wrapper .content-body{\n            position: relative;\n            height: calc(100% - 56px);\n        }\n        .ejs-select-wrapper .content-body #view-0.mui-scroll-wrapper{\n            height: 100%;\n        }\n        .ejs-select-wrapper .select-tip,\n        .ejs-edit-wrapper .selected-tip {\n            padding-left: 10px;\n            width: 100%;\n            height: 43px;\n            line-height: 43px;\n            color: #999;\n            font-size: 14px;\n            background-color: #f9f9f9;\n        }\n        .ejs-select-wrapper .bottom-bar{\n            position: absolute;\n            left: 0;\n            bottom: 0;\n            padding-right: 10px;\n            padding-bottom: 15px;\n            width: 100%;\n            font-size: 16px;\n            text-align: center;\n            background-color: #fff;\n            border-top: 1px solid #d9d9d9;\n        }\n        .ejs-select-wrapper .bottom-bar #selectall{\n            line-height: 46px;\n        }\n        .ejs-select-wrapper .bottom-bar .mui-input-row input{\n            top: 10px;\n            left: 10px;\n        }\n        .ejs-select-wrapper .bottom-bar .btn-set{\n            margin-top: 8px;\n            padding: 0 12px;\n            height: 30px;\n        }\n        .ejs-select-wrapper .bottom-bar .edit-selected-btn{\n            height: 100%;\n            line-height: 45px;\n        }\n        .ejs-select-wrapper [data-type="ou"]{\n            line-height: 23px;\n        }\n        .ejs-select-wrapper [data-type="ou"] .mui-input-row{\n            display: inline-block;\n            width: 28px;\n            height: 26px;\n            vertical-align: middle;\n        }\n        .ejs-select-wrapper [data-type="ou"] .mui-input-row label,\n        .ejs-select-wrapper [data-type="ou"] .user-single-span{\n            display: inline-block;\n            width: 55%;\n        }\n        .ejs-select-wrapper [data-type="ou"] .user-single-span{\n            vertical-align: middle;\n        }\n        .ejs-select-wrapper [data-type="ou"] .mui-input-row.checked label,\n        .ejs-select-wrapper [data-type="ou"] span.checked{\n            color: #999;\n        }\n        .ejs-select-wrapper [data-type="user"] .mui-input-row{\n            width: 100%;\n            height: 100%;\n        }\n        .ejs-select-wrapper .content-body .mui-input-row input,\n        .ejs-search-wrapper .mui-input-row.mui-left input{\n            top: 0;\n            right: 0;\n            left: 0;\n        }\n        .ejs-select-wrapper .mui-input-row input:before{\n            font-size: 24px;\n        }\n        .ejs-select-wrapper .mui-input-row.mui-left label{\n            padding: 3px 0;\n            padding-left: 38px;\n        }\n        .ejs-select-wrapper .user-photo,\n        .ejs-edit-wrapper .user-photo,\n        .ejs-select-wrapper .imgerror-backup,\n        .ejs-edit-wrapper .imgerror-backup{\n            width: 50px;\n            height: 50px;\n            border-radius: 50%;\n            vertical-align: middle;\n        }\n        .ejs-select-wrapper .imgerror-backup,\n        .ejs-edit-wrapper .imgerror-backup{\n            display: inline-block;\n            text-align: center;\n            color: #fff;\n            line-height: 50px;\n            background-color: #3C80E6;\n        }\n        .ejs-select-wrapper .user-info-txt,\n        .ejs-edit-wrapper .user-info-txt{\n            display: inline-block;\n            color: #000;\n            font-size: 16px;\n            vertical-align: middle;\n        }\n        .ejs-select-wrapper .user-info-txt{\n            width: 78%;\n        }\n        .ejs-edit-wrapper .user-info-txt{\n            width: 172px;\n            margin-left: 5px;\n        }\n        .ejs-select-wrapper .user-name,\n        .ejs-edit-wrapper .user-name{\n            line-height: 28px;\n        }\n        .ejs-select-wrapper .user-title{\n            color: #999;\n            font-size: 14px;\n            line-height: 26px;\n        }\n        .ejs-select-wrapper [data-type="user"] .mui-input-row input{\n            top: calc(50% - 13px);\n        }\n        .ejs-select-wrapper .mui-icon-arrowright{\n            font-size: 20px;\n            color: #bbb;\n            line-height: 23px;\n        }\n        .ejs-select-wrapper .empty-tip{\n            margin-top: 45%;\n            width: 100%;\n            font-size: 18px;\n            color: #8D939D;\n            text-align: center;\n        }\n        .ejs-structure-wrapper{\n            position: absolute;\n            right: 0;\n            top: 0;\n            width: 0;\n            height: 100%;\n            transition: width .5s;\n        }\n        .ejs-structure-wrapper.width-100{\n            width: 100vw;\n        }\n        .ejs-structure-wrapper .mui-scroll-wrapper.mui-slider-indicator{\n            top: 0;\n            left: 0;\n            margin-bottom: 10px;\n            padding: 0 10px;\n            height: 38px;\n            line-height: 38px;\n            background-color: #fff;\n            border-bottom: 1px solid #d9d9d9;\n        }\n        .ejs-structure-wrapper .nav-title{\n            color: #000;\n        }\n        .ejs-structure-wrapper .nav-title span{\n            display: none;\n        }\n        .ejs-structure-wrapper .nav-title.active,\n        .ejs-structure-wrapper .nav-title.active .mui-icon-arrowright{\n            color: #3C80E6;\n        }\n        .ejs-structure-wrapper .nav-title.active span{\n            display: inline;\n            border: none;\n        }\n        .ejs-structure-wrapper .structure-body{\n            position: relative;\n            height: calc(100% - 48px);\n            border-top: 1px solid #d9d9d9;\n        }\n        .ejs-structure-wrapper .structure-body .mui-scroll-wrapper{\n            top: 0;\n            left: 0;\n            height: 100%;\n        }\n        .ejs-structure-wrapper .person-num,\n        .ejs-edit-wrapper .person-num{\n            color: #007aff;\n        }\n        .ejs-poptotop{\n            height: 100% !important;\n        }\n        .ejs-poptoleft{\n            width: 100vw !important;\n        }\n        .ejs-transitionH{\n            transition: height .5s;\n        }';

    return style;
};

// 编辑人员界面样式
var editClassName = function editClassName() {
    myShadowDom.querySelector('style').innerHTML += '\n        .ejs-edit-wrapper{\n            z-index: 10000;\n            position: fixed;\n            top: 0;\n            right: 0;\n            background-color: #f9f9f9;\n            width: 0;\n            height: 100%;\n            overflow: hidden;\n            transition: width .5s;\n        }\n        .ejs-edit-wrapper .mui-scroll-wrapper{\n            height: calc(100% - 54px);\n        }\n        .ejs-edit-wrapper .person-num{\n            position: absolute;\n            right: 39px;\n            top: calc(50% - 11px);\n        }\n        .ejs-edit-wrapper .mui-table-view-cell label{\n            display: inline-block;\n            width: 208px;\n        }\n        .ejs-edit-wrapper .mui-icon{\n            color: #999;\n            line-height: 100%;\n        }\n        .ejs-edit-wrapper .mui-icon.mui-icon-bars{\n            margin-right: 5px;\n            position: relative;\n            top: 3px;\n        }\n        .ejs-edit-wrapper .mui-icon.mui-icon-trash{\n            position: absolute;\n            top: calc(50% - 12px);\n            right: 15px;\n        }\n        .ejs-edit-wrapper .opacity0{\n            opacity: 0;\n        }\n        .ejs-edit-wrapper .bg-color#000{\n            background-color: rgba(0, 0, 0, .5);\n        }\n        .ejs-edit-wrapper .bottom-bar{\n            position: absolute;\n            bottom: 0;\n            left: 0;\n            padding: 10px;\n            padding-bottom: 15px;\n            width: 100%;\n            background-color: #fff;\n            border-top: 1px solid #d9d9d9;\n            z-index: 1;\n        }\n        ';
};

// 搜索界面样式
var searchClassName = function searchClassName() {
    if (searchonce === 0) {
        searchonce = 1;
        myShadowDom.querySelector('style').innerHTML += '\n        #' + ACTION_SEARCH_UNIQUE_ID + ' {\n            position: relative;\n            width: 100vw;\n            height: calc(100% - 48px);\n            background-color: #fff;\n        }\n\n        #' + ACTION_SEARCH_UNIQUE_ID + ' .fail-tip{\n            width: 100%;\n            font-size: 14px;\n            text-align: center;\n            color: #ccc;\n            line-height: 50px;\n        }\n        ';
    }
};

/**
 * 检查是否全选
 */
function checkIsAll(dom) {
    if (issingle !== '1') {
        var items = myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID).getElementsByTagName('li');
        var flag = false;

        for (var i = 0; i < items.length; i += 1) {
            if (!items[i].querySelector('.mui-input-row input').disabled && !items[i].querySelector('input').checked && !(dom && items[i] === dom)) {
                flag = true;
            }
        }

        if (flag && myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #selectall input').checked) {
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #selectall input').checked = false;
        } else if (!flag) {
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #selectall input').checked = true;
        }
    }
}

/**
 * 获取数组中特定标识项的索引
 * @param {Array} arr 数组
 * @param {String} guid 标识
 * @param {String} type 类型
 */
function getArrItemIndex(arr, guid, type) {
    var i = 0;
    for (; i < arr.length; i += 1) {
        if (type === 'ou' && arr[i].ouguid === guid || type === 'user' && arr[i].userguid === guid) {
            break;
        }
    }

    if (i >= arr.length) {
        i = -1;
    }

    return i;
}

/**
 * 获取部门及人员列表
 * @param {String} ouGuid 部门guid
 */
function getOuListWithUser(ouGuid) {
    ejs.ui.showWaiting();
    Util.ajax({
        url: '' + formalUrl + getoulistwithuser,
        data: {
            params: JSON.stringify({
                ouguid: ouGuid
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                getFromAjaxOu = result.custom.oulist;
                getFromAjaxUser = result.custom.userlist;

                if (result.custom.oulist.length || result.custom.userlist.length) {
                    // 处理数据
                    result.custom.oulist.forEach(function (e) {
                        var guid = e.ouguid;
                        var element = e;
                        element.isnext = '';
                        element.ischecked = '';

                        if (getArrItemIndex(selectedous, guid, 'ou') > -1) {
                            element.ischecked = 'checked';
                        }

                        if (isouonly === '1' && parseInt(element.haschildou, 0) === 0) {
                            element.isnext = 'mui-hidden';
                        }
                    });

                    result.custom.userlist.forEach(function (e) {
                        var guid = e.userguid;
                        var element = e;
                        element.ischecked = '';
                        element.disabled = '';

                        if (getArrItemIndex(selectedusers, guid, 'user') > -1) {
                            element.ischecked = 'checked';
                        }

                        if (getArrItemIndex(unableselectusers, guid, 'user') > -1) {
                            element.disabled = 'disabled';
                        }
                    });

                    // 渲染
                    renderStructure(result.custom);
                }
            } else {
                ejs.ui.toast(result.status.text);
            }
        }
    });
}

/**
 * 从custom中获取数据列表
 * @param {String} ouguid 部门guid
 * @param {Object} parentou 父部门
 */
function getDataFromCustom(ouguid, parentou) {
    if (parentou.ouguid === ouguid) {
        getFromAjaxOu = [];
        getFromAjaxUser = [];

        if ('userlist' in parentou && parentou.userlist.length > 0) {
            parentou.userlist.forEach(function (e) {
                getFromAjaxUser.push(e);
                var element = e;

                if (!('displayname' in element)) {
                    element.displayname = element.username;
                }

                if (!('disabled' in element)) {
                    element.disabled = '';

                    if (getArrItemIndex(unableselectusers, element.userguid, 'user') > -1) {
                        element.disabled = 'disabled';
                    }
                }

                element.ischecked = '';
                if (getArrItemIndex(selectedusers, element.userguid, 'user') > -1) {
                    element.ischecked = 'checked';
                }
            });
        }

        if ('oulist' in parentou && parentou.oulist.length > 0) {
            parentou.oulist.forEach(function (e) {
                var element = e;
                if (!('isnext' in element)) {
                    element.isnext = '';
                    if (isouonly === '1' && element.haschildou === '0') {
                        element.isnext = 'mui-hidden';
                    }
                }

                element.ischecked = '';

                if (getArrItemIndex(selectedous, element.ouguid, 'ou') > -1) {
                    element.ischecked = 'checked';
                }

                getFromAjaxOu.push(element);
            });
        }

        var result = {
            oulist: parentou.oulist || [],
            userlist: parentou.userlist || []
        };

        renderStructure(result);
    } else if ('oulist' in parentou && parentou.oulist.length > 0) {
        for (var i = 0; i < parentou.oulist.length; i += 1) {
            getDataFromCustom(ouguid, parentou.oulist[i]);
        }
    }
}

/**
 * 搜索人员
 * @param {String} keyWord 关键词
 */
function searchUser(keyWord) {
    Util.ajax({
        url: '' + formalUrl + searchuserbycondition,
        data: {
            params: JSON.stringify({
                keyword: keyWord,
                currentpageindex: 1,
                pagesize: -1
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            if (result.status.code === 1 || result.status.code === '1') {
                if (result.custom.userlist.length > 0) {
                    getFromSearchUser = result.custom.userlist;
                    // 处理返回数据
                    result.custom.userlist.forEach(function (e) {
                        var element = e;
                        element.disabled = '';
                        element.ischecked = '';

                        if (getArrItemIndex(selectedusers, element.userguid, 'user') > -1) {
                            element.ischecked = 'checked';
                        }

                        if (getArrItemIndex(unableselectusers, element.userguid, 'user') > -1) {
                            element.disabled = 'disabled';
                        }
                    });

                    renderSearchContent(result.custom.userlist);
                } else {
                    myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).innerHTML = '<div class="fail-tip">未找到相关搜索结果</div>';
                }
            } else {
                ejs.ui.toast(result.status.text);
            }
        }
    });
}

/**
 * 获取部门下所有人员列表
 * @param {String} parentOuGuid 父部门guid
 */
function getUserList(parentOuGuid, cb) {
    ejs.ui.showWaiting();
    Util.ajax({
        url: '' + formalUrl + getalluserlist,
        data: {
            params: JSON.stringify({
                parentouguid: parentOuGuid,
                keyword: '',
                currentpageindex: 1,
                pagesize: -1
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                result.custom.userlist.forEach(function (element) {
                    if (getArrItemIndex(selectedusers, element.userguid, 'user') === -1 && getArrItemIndex(unableselectusers, element.userguid, 'user') === -1) {
                        selectedusers.push(element);
                    }
                });
                cb && cb();
            } else {
                ejs.ui.toast(result.status.text);
            }
        }
    });
}

/**
 * 从custom中获取部门人员
 * @param {String} parentOuGuid 父部门guid
 */
function getUserFromCustom(parentOuGuid, parentou) {
    if (parentou.ouguid === parentOuGuid) {
        if ('userlist' in parentou && parentou.userlist.length > 0) {
            parentou.userlist.forEach(function (element) {
                if (getArrItemIndex(selectedusers, element.userguid, 'user') === -1 && getArrItemIndex(unableselectusers, element.userguid, 'user') === -1) {
                    selectedusers.push(element);
                }
            });
        }

        if ('oulist' in parentou && parentou.oulist.length > 0) {
            for (var i = 0; i < parentou.oulist.length; i += 1) {
                getUserFromCustom(parentou.oulist[i].ouguid, parentou.oulist[i]);
            }
        }
    } else if ('oulist' in parentou && parentou.oulist.length > 0) {
        for (var _i = 0; _i < parentou.oulist.length; _i += 1) {
            getUserFromCustom(parentOuGuid, parentou.oulist[_i]);
        }
    }
}

/**
 * 获取分组列表
 * @param {String} groupType 分组类别，public是公共分组，''是我的分组
 */
function getGroupList(groupType) {
    ejs.ui.showWaiting();
    Util.ajax({
        url: '' + formalUrl + getgrouplist,
        data: {
            params: JSON.stringify({
                type: groupType
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                if (result.custom.grouplist.length) {
                    var data = {
                        userlist: [],
                        oulist: [],
                        grouptype: groupType
                    };

                    result.custom.grouplist.forEach(function (element) {
                        var ele = element;
                        ele.ouguid = element.groupguid;
                        ele.haschildou = '0';

                        if (parseInt(ele.addresscount, 10) === 0) {
                            ele.haschilduser = '0';
                        } else {
                            ele.haschilduser = '1';
                        }

                        ele.isnext = '';
                        ele.usercount = element.addresscount;
                        ele.ischecked = '';
                        ele.ouname = element.groupname;
                        data.oulist.push(element);
                    });
                    getFromAjaxUser = [];
                    getFromAjaxOu = result.custom.grouplist;
                    // 渲染
                    renderStructure(data);
                } else {
                    // 展示空提示
                    getFromAjaxUser = [];
                    getFromAjaxOu = [];
                    myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-body').innerHTML = '<div class="empty-tip">暂无分组</div>';
                }
            } else {
                //     ejs.ui.toast(result.status.text);
            }
        }
    });
}

/**
 * 获取分组下的直属子用户
 * @param {String} guid 分组标识
 */
function getAddressBookList(groupType, guid) {
    ejs.ui.showWaiting();
    Util.ajax({
        url: '' + formalUrl + getaddressbooklist,
        data: {
            params: JSON.stringify({
                type: groupType,
                groupguid: guid,
                keyword: '',
                currentpageindex: 1,
                pagesize: -1
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                var data = {
                    userlist: [],
                    oulist: [],
                    type: 'groups'
                };

                result.custom.userlist.forEach(function (element) {
                    var ele = element;
                    ele.disabled = '';
                    ele.ischecked = '';

                    ele.userguid = element.objectguid;
                    ele.displayname = element.objectname;
                    if (getArrItemIndex(unableselectusers, element.objectguid, 'user') > -1) {
                        ele.disabled = 'disabled';
                    }

                    if (getArrItemIndex(selectedusers, element.objectguid, 'user') > -1) {
                        ele.ischecked = 'checked';
                    }

                    data.userlist.push(element);
                });
                getFromAjaxOu = [];
                getFromAjaxUser = result.custom.userlist;
                // 渲染
                renderStructure(data);
            } else {
                //     ejs.ui.toast(result.status.text);
            }
        }
    });
}

/**
 * 创建选人主界面HTML
 */
function createSelectPersonPage() {
    var finalHtml = '';

    if (Object.prototype.toString.call(custom) !== '[object Object]' && isouonly === '0') {
        finalHtml += '<header>\n        <div class="mui-input-row mui-input-search">\n        <span class="mui-icon mui-icon-search"></span>\n        <input type="search" class="mui-input-speech mui-input-clear" id="search-input" placeholder="\u641C\u7D22\u9009\u62E9\u4EBA\u5458">\n        </div>\n        <span class="cancel-btn mui-hidden">\u786E\u5B9A</span>\n        </header>';
    }
    finalHtml += '<div class="content-body">';

    if (isouonly === '1' || Object.prototype.toString.call(custom) === '[object Object]') {
        // 只选部门或选择范围
        finalHtml += '<div id="' + ACTION_STRUCTURE_UNIQUE_ID + '" class="ejs-structure-wrapper width-100">\n        <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">\n        <div class="mui-scroll structure-bar"></div>\n        </div>\n        <div class="structure-body"></div>\n        </div>';
    } else {
        // 选择人员
        finalHtml += '<div class="mui-scroll-wrapper" id="view-0"><div class="mui-scroll">';
        finalHtml += '<div class="selectperson-all-list">';
        finalHtml += '<div class="select-tip">选择人员</div>';
        finalHtml += '<ul class="mui-table-view" id="zzjg">';
        finalHtml += '<li class="mui-table-view-cell">\n            <a class="mui-navigate-right">\u7EC4\u7EC7\u67B6\u6784</a>\n        </li>\n        <li class="mui-table-view-cell">\n            <a class="mui-navigate-right">\u6211\u7684\u90E8\u95E8</a>\n        </li>';
        // 分组功能
        finalHtml += '<li class="mui-table-view-cell">\n            <a class="mui-navigate-right">\u6211\u7684\u5206\u7EC4</a>\n        </li>';
        finalHtml += '<li class="mui-table-view-cell">\n            <a class="mui-navigate-right">\u516C\u5171\u5206\u7EC4</a>\n        </li>';
        finalHtml += '</ul>';
        finalHtml += '</div>';
        finalHtml += '</div></div>';
    }

    finalHtml += '</div>';
    finalHtml += '<div class="bottom-bar">';
    finalHtml += '<div class="mui-input-row mui-checkbox mui-left l mui-hidden"  id="selectall">\n    <label>\u5168\u9009</label>\n    <input name="checkbox1" value="Item 1" type="checkbox">\n    </div>';
    finalHtml += '<button type="button" class="mui-btn mui-btn-primary btn-set r">确定<span class="selected-num mui-hidden"></span></button>';
    if (isouonly === '1') {
        finalHtml += '<a class="edit-selected-btn mui-hidden">编辑已选部门<span class="mui-icon mui-icon-arrowup"></span></a>';
    } else {
        finalHtml += '<a class="edit-selected-btn mui-hidden">编辑已选人员<span class="mui-icon mui-icon-arrowup"></span></a>';
    }
    finalHtml += '</div>';

    return finalHtml;
}

/**
 * 创建组织架构目录标题导航
 * @param {String} navTitle 组织架构目录标题
 * @param {String} ouguid 部门guid
 */
function createNavTitle(navTitle, ouguid) {
    var navNextDom = document.createElement('a');
    navNextDom.classList.add('nav-title');
    navNextDom.id = ouguid;
    if (navTitle === '我的分组' || navTitle === '公共分组') {
        navNextDom.setAttribute('type', 'grouptitle');
    } else {
        navNextDom.setAttribute('type', 'commontitle');
    }

    navNextDom.innerHTML = navTitle + '<span class="mui-icon mui-icon-arrowright"></span>';

    if (myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID).getElementsByClassName('nav-title').length > 0) {
        // 给前一个标题添加样式
        myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-bar').lastElementChild.classList.add('active');
    }
    myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-bar').appendChild(navNextDom);

    // 给新插入的标题添加点击事件
    myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-bar').lastElementChild.addEventListener('click', function tapNav() {
        var guid = this.id;
        var title = this.getAttribute('type');

        if (this.classList.contains('active')) {
            var aList = myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID).getElementsByClassName('nav-title');
            var i = 0;
            var j = 0;

            for (; i < aList.length; i += 1) {
                if (aList[i].id === guid) {
                    break;
                }
            }

            for (j = aList.length - 1; j > i; j -= 1) {
                aList[j].parentNode.removeChild(aList[j]);
            }

            this.classList.remove('active');
            if (isSelectRange === '1') {
                getDataFromCustom(guid, custom);
            } else if (title === 'grouptitle') {
                getGroupList(guid);
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').classList.add('mui-hidden');
            } else {
                getOuListWithUser(guid);
            }
        }
    });

    // 初始化横向滚动条
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body .mui-scroll-wrapper')).scroll();
}

/**
 * 渲染组织架构
 * @param {Object} data 部门及人员列表数据
 */
renderStructure = function renderStructure(data) {
    var oulist = data.oulist;
    var userlist = data.userlist;

    var html = '';

    var isoushow = '';
    var isshowcount = '';
    var isshowtitle = '';

    if (issingle === '1' && isouonly === '0' || 'grouptype' in data) {
        // 如果是选人单选，部门的checkbox应该隐藏
        // 或者是分组的情况
        isoushow = 'mui-hidden';
    }
    if (isouonly === '1') {
        // 如果是只选部门，部门不显示人数
        isshowcount = 'mui-hidden';
    }
    if (isSelectRange === '1') {
        // 选择范围时不显示职位
        isshowtitle = 'mui-hidden';
    }

    html += '<div class="mui-scroll-wrapper"><div class="mui-scroll">';
    html += '<ul class="mui-table-view">';

    if (userlist.length > 0 && isouonly !== '1') {
        for (var j = 0; j < userlist.length; j += 1) {
            html += '<li class="mui-table-view-cell" data-guid="' + userlist[j].userguid + '" data-type="user">\n            <div class="mui-input-row mui-checkbox mui-left">\n            <label>';
            html += '<img src="' + (PHOTO_URL + userlist[j].photourl) + '" class="user-photo" onerror="this.classList.add(\'mui-hidden\');this.parentNode.querySelector(\'.imgerror-backup\').classList.remove(\'mui-hidden\');onerror=null;">';

            html += '<span class="imgerror-backup mui-hidden">' + userlist[j].displayname.substring(userlist[j].displayname.length - 2) + '</span>\n            <p class="user-info-txt"><span class="user-name">' + userlist[j].displayname + '</span><br><span class="user-title ' + isshowtitle + '">' + userlist[j].title + '</span></p>\n            </label>\n            <input type="checkbox" ' + userlist[j].ischecked + ' ' + userlist[j].disabled + '>\n            </div>\n            </li>';
        }
    }

    if (oulist.length > 0) {
        for (var i = 0; i < oulist.length; i += 1) {
            html += '<li class="mui-table-view-cell" data-guid="' + oulist[i].ouguid + '" data-type="ou" data-haschildou="' + oulist[i].haschildou + '" data-haschilduser="' + oulist[i].haschilduser + '">\n            <span class="mui-icon mui-icon-arrowright r ' + oulist[i].isnext + '"></span>\n            <span class="person-num r ' + isshowcount + '">' + oulist[i].usercount + '</span>\n            <div class="mui-input-row mui-checkbox mui-left ' + oulist[i].ischecked + ' ' + isoushow + '"><input type="checkbox" ' + oulist[i].ischecked + '></div>\n            <span class="' + oulist[i].ischecked + ' user-single-span">' + oulist[i].ouname + '</span>\n            </li>';
        }
    }

    html += '</ul>';
    html += '</div></div>';

    var structureView = document.createElement('div');

    structureView.classList.add('structureView');
    structureView.innerHTML = html;
    // 清空内容
    myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-body').innerHTML = '';
    myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-body').appendChild(structureView);

    // 每一次渲染检查全选
    checkIsAll();

    // 添加item点击事件
    mui(myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-body .structureView')).on('click', 'li', function tapItem(e) {
        var ouCount = 0;
        var guid = this.dataset.guid;

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL' || e.target.classList.contains('mui-checkbox') || e.target.classList.contains('user-photo') || e.target.classList.contains('user-info-txt') || e.target.classList.contains('user-name') || e.target.classList.contains('user-title')) {
            // 点击复选框
            if (!this.querySelector('.mui-input-row input').checked) {
                // 取消全选
                if (myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #selectall input').checked) {
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #selectall input').checked = false;
                }

                if (this.dataset.type === 'ou') {
                    this.querySelector('.mui-input-row').classList.remove('checked');
                    this.querySelector('.user-single-span').classList.remove('checked');
                    ouCount = parseInt(this.querySelector('.person-num').innerText.trim(), 0);
                    selectedous.splice(getArrItemIndex(selectedous, guid, 'ou'), 1);
                    selectedNum -= ouCount;
                } else if (this.dataset.type === 'user') {
                    selectedusers.splice(getArrItemIndex(selectedusers, guid, 'user'), 1);
                    selectedNum -= 1;
                }

                if (selectedNum === 0 || isouonly === '1' && selectedous.length <= 0) {
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.add('mui-hidden');
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.add('mui-hidden');
                } else if (selectedNum > 0 && isouonly !== '1') {
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                }
            } else if (!this.querySelector('.mui-input-row input').disabled) {
                if (this.dataset.type === 'ou') {
                    // 选中部门
                    if (issingle === '1') {
                        // 单选部门
                        var nextOuLi = this.parentNode.firstChild;
                        for (; nextOuLi; nextOuLi = nextOuLi.nextSibling) {
                            if (nextOuLi.nodeType === 1 && nextOuLi !== this && nextOuLi.dataset.type === 'ou') {
                                nextOuLi.querySelector('input').checked = false;
                                nextOuLi.querySelector('.mui-input-row').classList.remove('checked');
                                nextOuLi.querySelector('.user-single-span').classList.remove('checked');
                            }
                        }
                    }
                    this.querySelector('.mui-input-row').classList.add('checked');
                    this.querySelector('.user-single-span').classList.add('checked');
                    getFromAjaxOu.forEach(function (ele) {
                        if (ele.ouguid === guid) {
                            if (issingle === '1') {
                                selectedous = [];
                            }
                            selectedous.push(ele);
                        }
                    });
                    if (issingle === '0') {
                        ouCount = parseInt(this.querySelector('.person-num').innerText.trim(), 0);
                        selectedNum += ouCount;
                    }
                } else if (this.dataset.type === 'user') {
                    // 选中人员
                    if (issingle === '1') {
                        // 单选人员
                        var nextUserLi = this.parentNode.firstChild;
                        for (; nextUserLi; nextUserLi = nextUserLi.nextSibling) {
                            if (nextUserLi.nodeType === 1 && nextUserLi !== this && nextUserLi.dataset.type === 'user') {
                                nextUserLi.querySelector('input').checked = false;
                            }
                        }
                    }
                    getFromAjaxUser.forEach(function (ele) {
                        if (ele.userguid === guid) {
                            if (issingle === '1') {
                                selectedusers = [];
                            }
                            selectedusers.push(ele);
                        }
                    });

                    if (issingle === '1') {
                        selectedNum = 1;
                    } else {
                        selectedNum += 1;
                    }
                }

                // 每一次选择检查全选，如果已全部选中，改变全选按钮状态
                checkIsAll(this);

                if (isouonly !== '1') {
                    if (issingle === '1') {
                        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + ')';
                    } else {
                        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                    }
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.remove('mui-hidden');
                }
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
            }
        } else if (!this.querySelector('.mui-input-row').classList.contains('checked') && this.dataset.type === 'ou') {
            // 点击部门进入下一层级
            var navTitle = this.querySelector('.user-single-span').innerText.trim();

            if (this.dataset.haschildou === '0' && isouonly === '1') {
                // 只选部门且此部门没有子部门时，不做动作
                return;
            }
            if (this.dataset.haschildou === '0' && this.dataset.haschilduser === '0') {
                // 没有子部门且没有人员时不做动作
                return;
            }

            createNavTitle(navTitle, guid);
            if (isSelectRange === '1') {
                // 选择范围时
                getDataFromCustom(guid, custom);
            } else if ('grouptype' in data) {
                getAddressBookList(data.grouptype, guid);
            } else {
                getOuListWithUser(guid);
            }
        }
    });

    // 滚动初始化
    mui(myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structureView .mui-scroll-wrapper')).scroll();

    if ('grouptype' in data) {
        return;
    }

    if (issingle !== '1') {
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').classList.remove('mui-hidden');
    }
};

/**
 * 创建编辑已选人员界面
 */
function createEditPage() {
    var html = '';
    var isshowcount = '';

    if (isouonly === '1') {
        isshowcount = 'mui-hidden';
    }

    html += '<div class="mui-scroll-wrapper"><div class="mui-scroll">';

    if (selectedous.length > 0) {
        html += '<div class="selected-ous">\n        <div class="selected-tip">\u5DF2\u9009\u90E8\u95E8</div>\n        <ul class="mui-table-view">';

        selectedous.forEach(function (element) {
            html += '<li class="mui-table-view-cell" data-guid="' + element.ouguid + '" data-type="ou">\n                <span class="mui-icon mui-icon-trash del-btn"></span>\n                <span class="person-num r ' + isshowcount + '">' + element.usercount + '</span>\n                <label>' + element.ouname + '</label>\n                </li>';
        });

        html += '</ul>';
        html += '</div>';
    }

    if (selectedusers.length > 0) {
        html += '<div class="selected-users">\n        <div class="selected-tip">\u957F\u6309\u53EF\u4EE5\u8C03\u6574\u987A\u5E8F</div>\n        <ul class="mui-table-view">';

        selectedusers.forEach(function (element) {
            html += '<li class="mui-table-view-cell" data-guid="' + element.userguid + '" data-type="user">\n            <span class="mui-icon mui-icon-trash del-btn"></span>\n            <span class="mui-icon mui-icon-bars"></span>';
            html += '<img src="' + (PHOTO_URL + element.photourl) + '" class="user-photo" onerror="this.classList.add(\'mui-hidden\');this.parentNode.querySelector(\'.imgerror-backup\').classList.remove(\'mui-hidden\');onerror=null;">';

            html += '<span class="imgerror-backup mui-hidden">' + element.displayname.substring(element.displayname.length - 2) + '</span>\n            <p class="user-info-txt"><span class="user-name">' + element.displayname + '</span></p>\n            </li>';
        });

        html += '</ul>';
        html += '</div>';
    }

    html += '</div></div>';
    html += '<div class="bottom-bar"><button class="mui-btn mui-btn-primary clearall-btn r">一键清空</button></div>';

    if (!myShadowDom.getElementById(ACTION_EDIT_UNIQUE_ID)) {
        // 不重复添加
        editClassName();

        var wrapper = document.createElement('div');

        wrapper.id = ACTION_EDIT_UNIQUE_ID;
        wrapper.classList.add('ejs-edit-wrapper');
        wrapper.innerHTML = html;
        myShadowDom.appendChild(wrapper);

        // 添加删除事件
        mui(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID)).on('click', '.del-btn', function tapDelBtn() {
            if (this.parentNode.dataset.type === 'ou') {
                selectedous.splice(getArrItemIndex(selectedous, this.parentNode.dataset.guid, 'ou'), 1);
                selectedNum -= parseInt(this.parentNode.querySelector('.person-num').innerText.trim(), 0);

                if (selectedous.length > 0) {
                    this.parentNode.parentNode.removeChild(this.parentNode);
                } else {
                    myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .mui-scroll').removeChild(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .selected-ous'));
                }
            } else {
                selectedusers.splice(getArrItemIndex(selectedusers, this.parentNode.dataset.guid, 'user'), 1);
                selectedNum -= 1;

                if (selectedusers.length > 0) {
                    this.parentNode.parentNode.removeChild(this.parentNode);
                } else {
                    myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .mui-scroll').removeChild(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .selected-users'));
                }
            }

            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
            if (selectedNum <= 0) {
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.add('mui-hidden');
            }
        });
    } else {
        // 直接更改html
        myShadowDom.getElementById(ACTION_EDIT_UNIQUE_ID).innerHTML = html;
    }

    // 初始化滚动
    mui(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .mui-scroll-wrapper')).scroll();

    // 添加一键清空事件
    mui(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .bottom-bar')).on('click', 'button', function () {
        selectedusers = [];
        selectedous = [];
        selectedNum = 0;
        myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .mui-scroll').innerHTML = '';
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '';
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.add('mui-hidden');
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.add('mui-hidden');
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').querySelector('input').checked = false;
    });

    // 长按拖拽功能
    if (myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .selected-users')) {
        new Sortable(myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID + ' .selected-users ul'), { // eslint-disable-line
            disabled: false,
            delay: 300,
            ghostClass: 'bg-color#000',
            onClone: function onClone(e) {
                e.item.classList.add('opacity0');
            },
            onEnd: function onEnd(e) {
                var con = selectedusers[e.oldIndex];
                selectedusers[e.oldIndex] = selectedusers[e.newIndex];
                selectedusers[e.newIndex] = con;
                e.item.classList.remove('opacity0');
            }
        });
    }

    // 切换到编辑已选人员界面
    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.add('mui-hidden');
    myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID).classList.add('ejs-poptoleft');
}

/**
 * 渲染搜索人员列表
 * @param {Array} userlist 人员列表
 */
renderSearchContent = function renderSearchContent(userlist) {
    var html = '';

    html += '<div class="mui-scroll-wrapper"><div class="mui-scroll">';
    html += '<ul class="mui-table-view">';

    userlist.forEach(function (element) {
        html += '<li class="mui-table-view-cell" data-guid="' + element.userguid + '" data-type="user">\n            <div class="mui-input-row mui-checkbox mui-left">\n            <label>';
        html += '<img src="' + (PHOTO_URL + element.photourl) + '" class="user-photo" onerror="this.classList.add(\'mui-hidden\');this.parentNode.querySelector(\'.imgerror-backup\').classList.remove(\'mui-hidden\');onerror=null;">';

        html += '<span class="imgerror-backup mui-hidden">' + element.displayname.substring(element.displayname.length - 2) + '</span>\n            <p class="user-info-txt"><span class="user-name">' + element.displayname + '</span>';
        if (element.ouname) {
            html += '<br><span class="user-title">' + element.ouname + '</span>';
        }
        html += '</p>\n            </label>\n            <input type="checkbox" ' + element.ischecked + ' ' + element.disabled + '>\n            </div>\n            </li>';
    });

    html += '</ul>';
    html += '</div></div>';

    myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).innerHTML = html;
    // 初始化滚动
    mui(myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID + ' .mui-scroll-wrapper')).scroll();
};

/**
 * 重新渲染架构
 */
function refreshStructure() {
    var flag = false;
    var data = {};

    getFromAjaxOu.forEach(function (e) {
        var element = e;
        if (getArrItemIndex(selectedous, element.ouguid, 'ou') > -1) {
            element.ischecked = 'checked';
        } else {
            element.ischecked = '';
            flag = true;
        }
    });
    getFromAjaxUser.forEach(function (e) {
        var element = e;
        if (getArrItemIndex(selectedusers, element.userguid, 'user') > -1) {
            element.ischecked = 'checked';
        } else {
            element.ischecked = '';
            flag = true;
        }
    });

    if (myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').querySelector('input').checked && flag) {
        // 取消全选
        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').querySelector('input').checked = false;
    }

    var title = myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-bar').lastElementChild.innerText;

    if (title === '我的分组' || title === '公共分组') {
        if (getFromAjaxOu.length === 0) {
            myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID + ' .structure-body').innerHTML = '<div class="empty-tip">暂无分组</div>';
        } else {
            if (title === '我的分组') {
                data = {
                    userlist: [],
                    oulist: getFromAjaxOu,
                    grouptype: ''
                };
            } else {
                data = {
                    oulist: getFromAjaxOu,
                    userlist: [],
                    grouptype: 'public'
                };
            }

            renderStructure(data);
        }
    } else {
        data = {
            oulist: getFromAjaxOu,
            userlist: getFromAjaxUser
        };
        renderStructure(data);
    }
}

/**
 * 插入历史记录
 * @param {String} tit 标题
 * @param {String} Url 索引
 */
function insertHistory(tit, Url) {
    var state = {
        title: tit,
        url: Url
    };
    window.history.pushState(state, state.title, state.url);
}

/**
* 用于搜索框防抖
*/
function debounce(fn, wait) {
    clearTimeout(timer);

    timer = setTimeout(function () {
        fn();
    }, wait);
}

/**
 * 添加公共事件
 */
function addEventListener() {
    // 拦截返回判断
    var intercept = function hookEvent(callback) {
        var guid = window.location.href;
        var reg1 = new RegExp(ACTION_WRAP_UNIQUE_ID, 'g');
        var reg2 = new RegExp(ACTION_STRUCTURE_UNIQUE_ID, 'g');

        if (reg1.test(guid)) {
            if (myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID) && myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID).classList.contains('ejs-poptoleft')) {
                // 组织架构子界面到主界面
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #view-0').classList.remove('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID).classList.remove('ejs-poptoleft');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar #selectall').classList.add('mui-hidden');
            } else if (myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID) && myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID).classList.contains('ejs-poptoleft')) {
                // 编辑人员界面回到主界面
                if (myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID)) {
                    refreshStructure();
                }
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.remove('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID).classList.remove('ejs-poptoleft');
            } else if (myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID) && !myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.contains('mui-hidden')) {
                // 搜索界面回到组织架构主界面
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header input').value = '';
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .mui-input-search').classList.remove('focus');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .cancel-btn').classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body').classList.remove('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar').classList.remove('mui-hidden');
            }
        } else if (reg2.test(guid)) {
            refreshStructure();
            if (myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID) && myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID).classList.contains('ejs-poptoleft')) {
                // 编辑人员界面回到组织架构子界面
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.remove('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_EDIT_UNIQUE_ID).classList.remove('ejs-poptoleft');
            } else if (myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID) && !myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.contains('mui-hidden')) {
                // 搜索界面回到组织架构子界面
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header input').value = '';
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .mui-input-search').classList.remove('focus');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .cancel-btn').classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body').classList.remove('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar').classList.remove('mui-hidden');
            }
        } else if (myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.contains('ejs-poptotop')) {
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.add('ejs-transitionH');
            // 关闭选人界面
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.remove('ejs-poptotop');
        } else {
            callback && callback();
        }
    };

    // 用于外部页面拦截返回时调用的函数，以此来正常使用选人的功能
    window.goback = function (callback) {
        window.history.go(-1);
        intercept(callback);
    };

    // 如果是ejs容器，使用ejs的API返回拦截
    if (Util.os.ejs) {
        // 拦截系统返回
        ejs.navigator.hookSysBack({
            success: function success() {
                var reg1 = new RegExp(ACTION_WRAP_UNIQUE_ID, 'g');
                var reg2 = new RegExp(ACTION_STRUCTURE_UNIQUE_ID, 'g');
                var reg3 = new RegExp(ACTION_EDIT_UNIQUE_ID, 'g');
                var reg4 = new RegExp(ACTION_SEARCH_UNIQUE_ID, 'g');

                if (reg1.test(window.location.href) || reg2.test(window.location.href) || reg3.test(window.location.href) || reg4.test(window.location.href)) {
                    window.history.go(-1);
                } else {
                    ejs.page.close();
                }
            },
            error: function error(_error) {
                window.toast(_error);
            }
        });

        // 拦截返回按钮
        ejs.navigator.hookBackBtn({
            success: function success() {
                var reg1 = new RegExp(ACTION_WRAP_UNIQUE_ID, 'g');
                var reg2 = new RegExp(ACTION_STRUCTURE_UNIQUE_ID, 'g');
                var reg3 = new RegExp(ACTION_EDIT_UNIQUE_ID, 'g');
                var reg4 = new RegExp(ACTION_SEARCH_UNIQUE_ID, 'g');

                if (reg1.test(window.location.href) || reg2.test(window.location.href) || reg3.test(window.location.href) || reg4.test(window.location.href)) {
                    window.history.go(-1);
                } else {
                    ejs.page.close();
                }
            },
            error: function error(_error2) {
                window.toast(_error2);
            }
        });
    }
    // 左上角返回事件绑定
    window.addEventListener('popstate', function () {
        intercept();
    }, false);

    // 顶部搜索框，点击
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('click', '#search-input', function tapSearch() {
        this.focus();
        if (!myShadowDom.getElementById(ACTION_SEARCH_UNIQUE_ID) || myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.contains('mui-hidden')) {
            if (!myShadowDom.getElementById(ACTION_SEARCH_UNIQUE_ID)) {
                // 不重复添加
                searchClassName();

                var wrapper = document.createElement('div');

                wrapper.id = ACTION_SEARCH_UNIQUE_ID;
                wrapper.classList.add('ejs-search-wrapper');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).appendChild(wrapper);

                // 添加点击事件
                mui(myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID)).on('click', 'li', function tapSearchLi() {
                    var guid = this.dataset.guid;

                    if (this.querySelector('.mui-input-row input').checked) {
                        selectedusers.splice(getArrItemIndex(selectedusers, guid, 'user'), 1);
                        selectedNum -= 1;

                        if (selectedNum === 0) {
                            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.add('mui-hidden');
                            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.add('mui-hidden');
                        } else if (selectedNum > 0) {
                            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                        }
                    } else if (!this.querySelector('.mui-input-row input').disabled) {
                        // 选中人员
                        if (issingle === '1') {
                            // 单选
                            var nextUserLi = this.parentNode.firstChild;
                            for (; nextUserLi; nextUserLi = nextUserLi.nextSibling) {
                                if (nextUserLi.nodeType === 1 && nextUserLi !== this) {
                                    nextUserLi.querySelector('input').checked = false;
                                }
                            }
                        }
                        getFromSearchUser.forEach(function (ele) {
                            if (ele.userguid === guid) {
                                if (issingle === '1') {
                                    selectedusers = [];
                                }
                                selectedusers.push(ele);
                            }
                        });

                        if (issingle === '1') {
                            selectedNum = 1;
                        } else {
                            selectedNum += 1;
                        }

                        if (issingle === '1') {
                            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + ')';
                        } else {
                            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                        }
                        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.remove('mui-hidden');
                        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
                    }
                });
            } else {
                myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).innerHTML = '';
                myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).classList.remove('mui-hidden');
            }
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .mui-input-search').classList.add('focus');
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' header .cancel-btn').classList.remove('mui-hidden');
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body').classList.add('mui-hidden');
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .bottom-bar').classList.add('mui-hidden');
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.remove('ejs-transitionH');

            // 插入历史记录
            insertHistory('搜索界面', '#' + ACTION_SEARCH_UNIQUE_ID);
        }
    });

    // 顶部搜索框，搜索
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('input', '#search-input', function keyup() {
        var keyword = this.value;

        debounce(function () {
            if (keyword === '') {
                // 清空关键字
                myShadowDom.querySelector('#' + ACTION_SEARCH_UNIQUE_ID).innerHTML = '';
            } else {
                searchUser(keyword);
            }
        }, 800);
    });

    // 顶部搜索框，取消
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('click', '.cancel-btn', function tapCancel() {
        this.parentNode.getElementsByTagName('input')[0].blur();
        window.history.go(-1);
    });

    // 底部全选按钮点击
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('click', '#selectall', function tapSelectall() {
        var items = myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID).getElementsByTagName('li');

        if (!this.querySelector('input').checked) {
            // 取消全选
            for (var i = 0; i < items.length; i += 1) {
                if (!items[i].querySelector('.mui-input-row input').disabled) {
                    items[i].querySelector('.mui-input-row').classList.remove('checked');
                    items[i].querySelector('input').checked = false;

                    if (items[i].dataset.type === 'ou' && getArrItemIndex(selectedous, items[i].dataset.guid, 'ou') > -1) {
                        items[i].querySelector('.user-single-span').classList.remove('checked');
                        selectedous.splice(getArrItemIndex(selectedous, items[i].dataset.guid, 'ou'), 1);
                        selectedNum -= parseInt(items[i].querySelector('.person-num').innerText.trim(), 0);
                    } else if (items[i].dataset.type === 'user' && getArrItemIndex(selectedusers, items[i].dataset.guid, 'user') > -1) {
                        selectedusers.splice(getArrItemIndex(selectedusers, items[i].dataset.guid, 'user'), 1);
                        selectedNum -= 1;
                    }
                }
            }

            if (selectedNum > 0) {
                if (isouonly !== '1') {
                    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                }
            } else {
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.add('mui-hidden');
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.add('mui-hidden');
            }
        } else {
            // 全选
            for (var _i2 = 0; _i2 < items.length; _i2 += 1) {
                if (!items[_i2].querySelector('.mui-input-row input').disabled) {
                    items[_i2].querySelector('.mui-input-row').classList.add('checked');
                    items[_i2].querySelector('input').checked = true;

                    if (items[_i2].dataset.type === 'ou' && getArrItemIndex(selectedous, items[_i2].dataset.guid, 'ou') === -1) {
                        items[_i2].querySelector('.user-single-span').classList.add('checked');
                        for (var j = 0; j < getFromAjaxOu.length; j += 1) {
                            if (getFromAjaxOu[j].ouguid === items[_i2].dataset.guid) {
                                selectedous.push(getFromAjaxOu[j]);
                            }
                        }
                        selectedNum += parseInt(items[_i2].querySelector('.person-num').innerText.trim(), 0);
                    } else if (items[_i2].dataset.type === 'user' && getArrItemIndex(selectedusers, items[_i2].dataset.guid, 'user') === -1) {
                        for (var _j = 0; _j < getFromAjaxUser.length; _j += 1) {
                            if (getFromAjaxUser[_j].userguid === items[_i2].dataset.guid) {
                                selectedusers.push(getFromAjaxUser[_j]);
                            }
                        }
                        selectedNum += 1;
                    }
                }
            }

            if (isouonly !== '1') {
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.remove('mui-hidden');
            }
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
        }
    });

    // 点击编辑已选人员
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('click', '.edit-selected-btn', function () {
        // 创建编辑已选人员界面
        createEditPage();
        // 插入历史记录
        insertHistory('编辑已选人员界面', '#' + ACTION_EDIT_UNIQUE_ID);
    });

    // 点击确定按钮返回选择结果
    mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID)).on('click', '.btn-set', function () {
        var result = {};
        var i = 0;

        if (selectedNum > maxchoosecount && isouonly !== '1') {
            ejs.ui.toast('选择人数超出最大限制人数');
            return;
        }

        var handleResultUsers = function handleResultUsers() {
            selectedusers.forEach(function (e) {
                var element = e;
                delete element.ischecked;
                delete element.disabled;
            });

            result = {
                resultCode: -1,
                ouData: selectedous,
                resultData: selectedusers
            };

            if (isouonly === '1' || isSelectRange === '1') {
                window.history.go(-1);
            } else if (myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID) && myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID).classList.contains('ejs-poptoleft')) {
                window.history.go(-2);
            } else {
                window.history.go(-1);
            }

            // if (document.getElementsByTagName('body').length > 1) {
            //     for (let k = 0; k < document.getElementsByTagName('body').length; k += 1) {
            //         if (document.getElementsByTagName('body')[k].childNodes.length === 0) {
            //             document.getElementsByTagName('body')[k].parentNode.removeChild(document.getElementsByTagName('body')[k]);
            //         }
            //     }
            // }
            callback$1 && callback$1(result);
        };

        var handleResult = function handleResult() {
            if (i < selectedous.length) {
                var element = selectedous[i];
                delete element.ischecked;
                delete element.isnext;

                if (isouonly === '0' && isSelectRange === '0') {
                    getUserList(element.ouguid, function () {
                        i += 1;
                        handleResult();
                    });
                } else if (isSelectRange === '1') {
                    getUserFromCustom(element.ouguid, custom);
                    i += 1;
                    handleResult();
                } else {
                    handleResultUsers();
                }
            } else {
                handleResultUsers();
            }
        };

        handleResult();
    });
}

/**
 * 获取个人用户信息
 */
function getUserInfo() {
    ejs.ui.showWaiting();

    Util.ajax({
        url: '' + formalUrl + personalgetdetail,
        data: {
            params: JSON.stringify({
                devicenumber: ''
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                var ouname = result.custom.ouname;
                var ouguid = result.custom.ouguid;
                // const ouname = result.custom.baseouname;
                // const ouguid = result.custom.baseouguid;

                createNavTitle(ouname, ouguid);
                getOuListWithUser(ouguid);
            } else {
                ejs.ui.toast(result.custom.text);
            }
        }
    });
}

/**
 * 获取给定userguid的信息
 */
function getUserInfoByGuids() {
    ejs.ui.showWaiting();
    var guids = selectedusers.map(function (element) {
        return element.userguid;
    });

    Util.ajax({
        url: '' + formalUrl + getuserinfolist,
        data: {
            params: JSON.stringify({
                sequenceid: '',
                userguid: guids.join(';')
            })
        },
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function success(result) {
            ejs.ui.closeWaiting();
            if (result.status.code === 1) {
                selectedusers = result.custom.infolist;
            } else {
                ejs.ui.toast(result.custom.text);
            }
        }
    });
}

/**
 * 计算部门总人数
 * @param {Object} ou 要计算人数的部门
 */
function getUserCount(ou) {
    var n = 0;

    if ('userlist' in ou && ou.userlist.length > 0) {
        n = ou.userlist.length;
    }

    usercount += n;
    if ('oulist' in ou && ou.oulist.length > 0) {
        for (var i = 0; i < ou.oulist.length; i += 1) {
            getUserCount(ou.oulist[i]);
        }
    }
}

/**
 * 给需要的对象各个部门添加usercount参数
 * @param {Object} ou 对象
 */
function countUser(ou) {
    var obj = ou;
    if ('oulist' in obj && obj.oulist.length > 0) {
        for (var i = 0; i < obj.oulist.length; i += 1) {
            usercount = 0;
            getUserCount(obj.oulist[i]);
            obj.oulist[i].usercount = usercount;
            countUser(obj.oulist[i]);
        }
    }
}

/**
 * 用于选择范围对已选部门的人数统计
 * @param {String} guid 需要搜索的guid
 * @param {Object} ou 部门
 */
function searchChecked(guid, ou) {
    if (ou.ouguid === guid) {
        return ou.usercount;
    } else if ('oulist' in ou && ou.oulist.length > 0) {
        var i = 0;
        for (; i < ou.oulist.length; i += 1) {
            var t = searchChecked(guid, ou.oulist[i]);
            if (t !== false) {
                return t;
            }
        }
        if (i >= ou.oulist.length) {
            return false;
        }
    }
    return false;
}

/**
 * 用于选择范围兼容已选人员传参
 */
function setSelectedUsers(nowcustom) {
    if ('userlist' in nowcustom && nowcustom.userlist.length > 0) {
        for (var i = 0; i < selectedusers.length; i += 1) {
            for (var j = 0; j < nowcustom.userlist.length; j += 1) {
                if (nowcustom.userlist[j].userguid === selectedusers[i].userguid) {
                    selectedusers[i] = nowcustom.userlist[j];
                    selectedusers[i].displayname = nowcustom.userlist[j].username;
                }
            }
        }
    }

    if ('oulist' in nowcustom && nowcustom.oulist.length > 0) {
        nowcustom.oulist.forEach(function (element) {
            setSelectedUsers(element);
        });
    }
}

/**
 * 用于选择范围兼容已选部门传参
 */
function setSelectedOus(nowcustom) {
    if ('oulist' in nowcustom && nowcustom.oulist.length > 0) {
        for (var i = 0; i < selectedous.length; i += 1) {
            for (var j = 0; j < nowcustom.oulist.length; j += 1) {
                if (nowcustom.oulist[j].ouguid === selectedous[i].ouguid) {
                    selectedous[i].usercount = nowcustom.oulist[j].usercount;
                    selectedous[i].ouname = nowcustom.oulist[j].ouname;
                }

                if ('oulist' in nowcustom.oulist[j] && nowcustom.oulist[j].oulist.length > 0) {
                    setSelectedOus(nowcustom.oulist[j]);
                }
            }
        }
    }
}

/**
   * 得到一个项目的根路径
   * h5模式下例如:http://id:端口/项目名/
   * @return {String} 项目的根路径
   */
function getProjectBasePath() {
    var locObj = window.location;
    var patehName = locObj.pathname;
    var pathArray = patehName.split('/');
    // 如果是 host/xxx.html 则是/，如果是host/project/xxx.html,则是project/
    // pathName一般是 /context.html 或 /xxx/xx/content.html
    var hasProject = pathArray.length > 2;
    var contextPath = pathArray[Number(hasProject)] + '/';

    return contextPath;
}

function selectPerson(params, success) {
    var options = params || {};

    formalUrl = options.url || FORMAL_URL;
    token = options.token;
    maxchoosecount = options.maxchoosecount;
    isouonly = options.isouonly;
    issingle = options.issingle;
    selectedusers = options.selectedusers.slice(0);
    unableselectusers = options.unableselectusers.slice(0);
    selectedous = options.selectedous.slice(0);
    callback$1 = success;
    custom = options.custom;

    getFromAjaxOu = [];
    getFromAjaxUser = [];

    if (Object.prototype.toString.call(custom) === '[object Object]' && ('oulist' in custom || 'userlist' in custom)) {
        // 选择范围参数合法
        isSelectRange = '1';
    } else {
        // 传入的custom不是对象或参数不合法时
        isSelectRange = '0';
    }

    // 获取首界面HTML
    var html = createSelectPersonPage();

    if (!myShadowDom) {
        // 创建影子DOM
        var shadowEL = document.createElement('div');
        shadowEL.classList.add('shadow-host');
        document.body.appendChild(shadowEL);
        var shadow = shadowEL.attachShadow({ mode: 'open' });

        // 引入mui样式
        var basePath = getProjectBasePath();
        var linkElem = document.createElement('link');
        var linkElem2 = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', '/' + basePath + 'js/mui/mui.css');
        shadow.appendChild(linkElem);
        linkElem2.setAttribute('rel', 'stylesheet');
        linkElem2.setAttribute('href', '/' + basePath + 'js/mui/mui.extend.css');
        shadow.appendChild(linkElem2);

        // 不重复添加公共样式
        var style = commonClassName();
        shadow.appendChild(style);

        var wrapper = document.createElement('div');

        wrapper.id = ACTION_WRAP_UNIQUE_ID;
        wrapper.classList.add('ejs-select-wrapper');
        wrapper.classList.add('ejs-transitionH');
        wrapper.innerHTML = html;
        shadow.appendChild(wrapper);
        myShadowDom = shadowEL.shadowRoot;
        // 添加公共事件
        addEventListener();
    } else {
        // 直接更改html
        myShadowDom.getElementById(ACTION_WRAP_UNIQUE_ID).innerHTML = html;
    }

    if (Object.prototype.toString.call(custom) === '[object Object]') {
        // 选择范围
        // 添加usercount属性
        countUser(custom);
        // 计算已选人数
        selectedNum = selectedusers.length;
        if (selectedous.length > 0) {
            selectedous.forEach(function (e) {
                var element = e;
                var num = searchChecked(element.ouguid, custom);

                if ('usercount' in element && num === false) {
                    selectedNum += element.usercount;
                } else if (num !== false) {
                    element.usercount = num;
                    selectedNum += num;
                }
            });
        }
        if (selectedNum > 0) {
            if (isouonly === '0') {
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.remove('mui-hidden');
            }
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
        }

        if (isSelectRange === '1') {
            if ('oulist' in custom && custom.oulist.length > 0) {
                custom.ouguid = custom.oulist[0].parentouguid;
            } else {
                custom.ouguid = 'root';
            }

            if (selectedusers.length > 0) {
                // 兼容不规范已选人员传参
                setSelectedUsers(custom);
                selectedusers.forEach(function (element) {
                    var ele = element;
                    if (!('displayname' in element)) {
                        ele.displayname = '';
                    }
                });
            }

            if (selectedous.length > 0) {
                // 兼容不规范已选部门传参
                setSelectedOus(custom);
                selectedous.forEach(function (element) {
                    var ele = element;
                    if (!('ouname' in element)) {
                        ele.ouname = '';
                    }
                    if (!('usercount' in element)) {
                        ele.usercount = 0;
                    }
                });
            }

            createNavTitle('选择范围', custom.ouguid);
            getDataFromCustom(custom.ouguid, custom);
        } else {
            if (selectedusers.length > 0) {
                // 兼容不规范已选人员传参
                getUserInfoByGuids();
            }
            selectedous = [];
            // 选择范围参数不合法
            createNavTitle('选择范围', '');
            getOuListWithUser('');
        }
    } else if (isouonly === '1') {
        // 只选部门
        selectedusers = [];
        unableselectusers = [];
        if (selectedous.length > 0) {
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
        }
        // 渲染组织架构
        createNavTitle('组织架构', '');
        getOuListWithUser('');
    } else {
        // 选择人员
        selectedous = [];
        selectedNum = selectedusers.length;

        if (selectedNum > 0) {
            // 兼容不规范已选人员传参
            getUserInfoByGuids();
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').innerHTML = '(' + selectedNum + '/' + maxchoosecount + ')';
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .selected-num').classList.remove('mui-hidden');
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .edit-selected-btn').classList.remove('mui-hidden');
        }

        myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body').style.height = 'calc(100% - 56px - 48px)';
        mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #view-0')).scroll();
        // 选择人员主界面item点击事件
        mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #view-0 #zzjg')).on('click', 'li', function tapFunc() {
            var title = this.innerText.trim();
            var structureHtml = '';

            structureHtml += '<div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">\n                <div class="mui-scroll structure-bar"></div>\n                </div>';
            structureHtml += '<div class="structure-body"></div>';

            if (!myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID)) {
                // 不重复添加
                var structureWrapper = document.createElement('div');

                structureWrapper.id = ACTION_STRUCTURE_UNIQUE_ID;
                structureWrapper.classList.add('ejs-structure-wrapper');
                structureWrapper.innerHTML = structureHtml;
                myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body').appendChild(structureWrapper);

                // 初始化横向滚动条
                mui(myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' .content-body .mui-scroll-wrapper')).scroll();
            } else {
                // 直接更改html
                myShadowDom.getElementById(ACTION_STRUCTURE_UNIQUE_ID).innerHTML = structureHtml;
            }

            if (title === '我的部门') {
                getUserInfo();
            } else if (title === '组织架构') {
                createNavTitle('组织架构', '');
                getOuListWithUser('');
            } else if (title === '我的分组') {
                createNavTitle('我的分组', '');
                getGroupList('');
            } else if (title === '公共分组') {
                createNavTitle('公共分组', 'public');
                getGroupList('public');
            }

            // 主界面切换到组织架构子界面
            myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID + ' #view-0').classList.add('mui-hidden');
            myShadowDom.querySelector('#' + ACTION_STRUCTURE_UNIQUE_ID).classList.add('ejs-poptoleft');

            // 插入历史记录
            insertHistory('组织架构界面', '#' + ACTION_STRUCTURE_UNIQUE_ID);
        });
    }

    // 显示选人界面
    myShadowDom.querySelector('#' + ACTION_WRAP_UNIQUE_ID).classList.add('ejs-poptotop');

    // 插入历史记录
    insertHistory('选择人员界面', '#' + ACTION_WRAP_UNIQUE_ID);
}

function contactMixin(hybrid) {
    var hybridJs = hybrid;

    // contact是底层用的openLocal
    hybridJs.extendModule('contact', [{
        namespace: 'select',
        os: ['h5'],
        defaultParams: {
            token: '',
            url: '',
            // 已选人员的用户guid列表
            selectedusers: [],
            unableselectusers: [],
            issingle: '0',
            maxchoosecount: 500,
            isouonly: '0',
            isgroupenable: '0',
            selectedous: [],
            custom: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            selectPerson(options, function (result) {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }]);
}

/**
 * 加入系统判断功能
 */
function osMixin(hybrid) {
    var hybridJs = hybrid;
    var detect = function detect(ua) {
        this.os = {};

        var android = ua.match(/(Android);?[\s/]+([\d.]+)?/);

        if (android) {
            this.os.android = true;
            this.os.version = android[2];
            this.os.isBadAndroid = !/Chrome\/\d/.test(window.navigator.appVersion);
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

        // epoint的容器
        var ejs = ua.match(/EpointEJS/i);

        if (ejs) {
            this.os.ejs = true;
        }

        var dd = ua.match(/DingTalk/i);

        if (dd) {
            this.os.dd = true;
        }

        // 政务微信容器
        var wxWorkLocal = ua.match(/wxworklocal/i);

        if (wxWorkLocal) {
            this.os.wxWorkLocal = true;
        }

        // 企业微信容器
        var wxWork = ua.match(/wxwork/i);

        if (!wxWorkLocal && wxWork) {
            this.os.wxWork = true;
        }

        // 微信容器
        var wechat = ua.match(/MicroMessenger/i);

        if (!wxWork && !wxWorkLocal && wechat) {
            this.os.wechat = true;
        }

        // welink容器
        var welink = ua.match(/welink/i);
        var cloudlink = ua.match(/cloudlink/i);

        if (welink || cloudlink) {
            this.os.welink = true;
        }

        // 讯盟容器
        var xm = ua.match(/hwminiapp/i);

        if (xm) {
            this.os.xm = true;
        }

        // 政务钉钉容器
        var ddGov = ua.match(/mPaaSClient/i);

        if (!dd && !wxWorkLocal && !wxWork && !wechat && !welink && !cloudlink && !xm && ddGov) {
            this.os.ddGov = true;
        }

        // 支付宝容器
        var alipay = ua.match(/alipay/i);

        if (!ddGov && alipay) {
            this.os.alipay = true;
        }

        // 如果ejs和钉钉都不是，则默认为h5
        if (!ejs && !dd) {
            this.os.h5 = true;
            // this.os.xm = true;
        }
    };

    detect.call(hybridJs, navigator.userAgent);
}

/**
 * 不用polyfill，避免体积增大
 */
function promiseMixin(hybrid) {
    var hybridJs = hybrid;

    // 暂时去除默认的promise支持，防止普通开发人员不会使用导致报错无法补货
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
    console.error("[hybridJs error]: " + msg);
}

function log(msg) {
    console.log("[hybridJs log]: " + msg);
}

function errorMixin(hybrid) {
    var hybridJs = hybrid;
    var errorFunc = void 0;

    /**
     * 提示全局错误
     * @param {Nunber} code 错误代码
     * @param {String} msg 错误提示
     */
    function showError() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '错误!';

        warn('code:' + code + ', msg:' + msg);
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
        errorFunc = callback;
        // 兼容钉钉
        if (hybridJs.os.dd) {
            window.dd && dd.error(errorFunc);
        }
    };
}

function isObject(object) {
    var classType = Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];

    return classType !== 'String' && classType !== 'Number' && classType !== 'Boolean' && classType !== 'Undefined' && classType !== 'Null';
}

var noop = function noop() {};

function extend(target) {
    var finalTarget = target;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
        throw new Error('version need to be string type');
    }

    var versionNumber1 = version1.replace(/[a-zA-Z]/g, function (match) {
        return match.charCodeAt();
    }).replace(/[^\d]/g, '') - 0;
    var versionNumber2 = version2.replace(/[a-zA-Z]/g, function (match) {
        return match.charCodeAt();
    }).replace(/[^\d]/g, '') - 0;

    if (versionNumber1 > versionNumber2) {
        return 1;
    } else if (versionNumber1 < versionNumber2) {
        return -1;
    }
    return 0;
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
 * @return {String} 项目的根路径
 */
function getProjectBasePath$1() {
    var locObj = window.location;
    var patehName = locObj.pathname;
    var pathArray = patehName.split('/');
    // 如果是 host/xxx.html 则是/，如果是host/project/xxx.html,则是project/
    // pathName一般是 /context.html 或 /xxx/xx/content.html
    var hasProject = pathArray.length > 2;
    var contextPath = pathArray[Number(hasProject)] + '/';

    // 如果尾部有两个//替换成一个
    return (locObj.protocol + '//' + locObj.host + '/' + contextPath).replace(/[/]{2}$/, '/');
}

/**
 * 将相对路径转为绝对路径 ./ ../ 开头的  为相对路径
 * 会基于对应调用js的html路径去计算
 * @param {String} path 需要转换的路径
 * @return {String} 返回转换后的路径
 */
function changeRelativePathToAbsolute(path) {
    var locObj = window.location;
    var patehName = locObj.pathname;
    // 匹配相对路径返回父级的个数
    var relatives = path.match(/\.\.\//g);
    var count = relatives && relatives.length || 0;
    // 将patehName拆为数组，然后计算当前的父路径，需要去掉相应相对路径的层级
    var pathArray = patehName.split('/');
    var parentPath = pathArray.slice(0, pathArray.length - (count + 1)).join('/');
    var childPath = path.replace(/\.+\//g, '');
    // 找到最后的路径， 通过正则 去除 ./ 之前的所有路径
    var finalPath = parentPath + '/' + childPath;

    finalPath = locObj.protocol + '//' + locObj.host + finalPath;

    return finalPath;
}

/**
 * 得到一个全路径
 * @param {String} path 路径
 * @return {String} 返回最终的路径
 */
function getFullPath(path) {
    // 全路径
    if (/^(http|https|ftp|epth|EPTH|h5|file|\/\/)/g.test(path)) {
        return path;
    }

    // 是否是相对路径
    var isRelative = /(\.\/)|(\.\.\/)/.test(path);

    if (isRelative) {
        return changeRelativePathToAbsolute(path);
    }

    return '' + getProjectBasePath$1() + path;
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
    var data = arguments[1];
    var type = arguments[2];

    var fullUrl = type === true ? url : getFullPath(url);
    var extrasDataStr = '';

    if (data) {
        Object.keys(data).forEach(function (item) {
            if (extrasDataStr.indexOf('?') === -1 && fullUrl.indexOf('?') === -1) {
                extrasDataStr += '?';
            } else {
                extrasDataStr += '&';
            }
            extrasDataStr += item + '=' + data[item];
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
function getBase64NotUrl(base64) {
    return base64.replace(/^data.*,/, '');
}

/**
 * 依赖于以下的基础库
 * Promise
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
     */
    Proxy.prototype.walk = function walk() {
        var _this = this;

        // 实时获取promise
        var Promise = hybridJs.getPromise();

        // 返回一个闭包函数
        return function () {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            var args = rest;

            args[0] = args[0] || {};

            // 默认参数的处理
            if (_this.api.defaultParams && args[0] instanceof Object) {
                Object.keys(_this.api.defaultParams).forEach(function (item) {
                    if (args[0][item] === undefined) {
                        args[0][item] = _this.api.defaultParams[item];
                    }
                });
            }

            // 决定是否使用Promise
            var finallyCallback = void 0;

            if (_this.callback) {
                // 将this指针修正为proxy内部，方便直接使用一些api关键参数
                finallyCallback = _this.callback;
            }

            if (_this.api.support && hybridJs.nativeVersion && compareVersion(hybridJs.nativeVersion, _this.api.support) < 0) {
                // 如果当前版本还不支持API
                // 实际上也可以在原生容器进行检测，这里由于遗留问题，改为前端进行
                var msg = _this.api.namespace + '\u8981\u6C42\u7684\u5BB9\u5668\u7248\u672C\u81F3\u5C11\u4E3A:' + _this.api.support + '\uFF0C\u5F53\u524D\u5BB9\u5668\u7248\u672C\uFF1A' + hybridJs.nativeVersion + '\uFF0C\u8BF7\u5347\u7EA7';

                var errorTips = {
                    code: globalError.ERROR_TYPE_APINEEDHIGHNATIVEVERSION.code,
                    msg: msg
                };

                if (hybridJs.ui && typeof hybridJs.ui.toast === 'function') {
                    hybridJs.ui.toast(msg);
                }

                // 不满足要求，直接走错误回调，内部走错误
                finallyCallback = function finallyCallback() {
                    var len = arguments.length;
                    var options = arguments.length <= 0 ? undefined : arguments[0];
                    var reject = void 0;

                    if (Promise) {
                        reject = arguments.length <= len - 1 ? undefined : arguments[len - 1];
                    }

                    // 如果存在错误回调
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
 */
function jsbridgeMixin(hybrid) {
    var hybridJs = hybrid;

    // 必须要有一个全局的JSBridge，否则原生和H5无法通信
    // 定义每次重新生成一个JSBridge
    if (!hybridJs.os.xm) {
        window.JSBridge = {};
    }

    var JSBridge = window.JSBridge;
    // 声明依赖
    var showError = hybridJs.showError;
    var globalError = hybridJs.globalError;
    var os = hybridJs.os;

    hybridJs.JSBridge = JSBridge;

    // jsbridge协议定义的名称
    var CUSTOM_PROTOCOL_SCHEME = 'EpointJSBridge';
    // 本地注册的方法集合,原生只能调用本地注册的方法,否则会提示错误
    var messageHandlers = {};
    // 短期回调函数集合
    // 在原生调用完对应的方法后,会执行对应的回调函数id，并删除
    var responseCallbacks = {};
    // 长期存在的回调，调用后不会删除
    var responseCallbacksLongTerm = {};

    // 唯一id,用来确保长期回调的唯一性，初始化为最大值
    var uniqueLongCallbackId = 65536;

    // 要排除掉的端口号
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
        };

        // 确保每次都不会和长期id相同
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
        var callBack = void 0;
        var callStr = void 0;

        if (win.parent === win) {
            // 当前页面已经是根页面了
            if ((str || '').length >= 0) {
                callBack = str;
            }
        } else {
            // 存在父级页面
            var p = win.parent;
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
                callStr = '.' + str;
            }
            callBack = getParentWindow(p, 'document.getElementsByTagName("iframe")[' + index + '].contentWindow' + (callStr || ''));
        }
        return callBack;
    }

    /**
     * 获取最终的url scheme
     * @param {String} proto 协议头，一般不同模块会有不同的协议头
     * @param {Object} message 兼容android中的做法
     * android中由于原生不能获取JS函数的返回值,所以得通过协议传输
     * @return {String} 返回拼接后的uri
     */
    function getUri(proto, message) {
        var uri = CUSTOM_PROTOCOL_SCHEME + '://' + proto;

        // 回调id作为端口存在
        var callbackId = void 0;
        var method = void 0;
        var params = void 0;

        if (message.callbackId) {
            // 必须有回调id才能生成一个scheme
            // 这种情况是H5主动调用native时
            callbackId = message.callbackId;
            method = message.handlerName;
            params = message.data;
        }
        if (!(window.self === window.top)) {
            params.callbackFunc = getParentWindow(window);
        }
        // 参数转为字符串
        params = encodeURIComponent(getParam(params));
        // uri 补充,需要编码，防止非法字符
        uri += ':' + callbackId + '/' + method + '?' + params;

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
     * @param {Number} proto 数字
     * @param {String} String 数据拆分后的字符串
     * @returns {String} uir 单独调用存储api
     */
    function callSetItem(id, String, index) {
        var uir = 'EpointJSBridge://storage:' + (id + 99) + '/setItem?{"' + id + '-' + index + '":"' + String + '"}';
        return uir;
    }
    /**
     * 手动函数传参
     * @param {String} UUID 唯一标识
     * @returns {String} FuncString 带协议的字符串
     */
    function callFuncData(UUID) {
        var FuncString = 'JSBridgeParamForCallback://' + UUID;
        return FuncString;
    }

    /**
     * JS调用原生方法前,会先send到这里进行处理
     * @param {String} proto 这个属于协议头的一部分
     * @param {JSON} message 调用的方法详情,包括方法名,参数
     * @param {Object} responseCallback 调用完方法后的回调,或者长期回调的id
     */
    function doSend(proto, message, responseCallback) {
        var newMessage = message;

        message.data && Object.keys(message.data).forEach(function (item) {
            if (typeof message.data[item] === 'function') {
                var FuncId = getCallbackId();

                responseCallbacks[FuncId] = message.data[item];
                // eslint-disable-next-line no-param-reassign
                message.data[item] = callFuncData(FuncId);
                // / 回调函数添加到短期集合中
                // 方法的详情添加回调函数的关键标识
                newMessage.callbackId = FuncId;
            }
        });
        if (typeof responseCallback === 'function') {
            // 如果传入的回调时函数，需要给它生成id
            // 取到一个唯一的callbackid
            var callbackId = getCallbackId();
            // 回调函数添加到短期集合中
            responseCallbacks[callbackId] = responseCallback;
            // 方法的详情添加回调函数的关键标识
            newMessage.callbackId = callbackId;
        } else {
            // 如果传入时已经是id，代表已经在回调池中了，直接使用即可
            newMessage.callbackId = responseCallback;
        }

        // 获取 触发方法的url scheme
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
                    var uriLong = callSetItem(_callbackId, e, n);

                    window.top.prompt(uriLong, '');
                    callArr.push(_callbackId + '-' + n);
                });
                var newUri = 'EpointJSBridge://veryLongString?{\'storageKey\':' + JSON.stringify(callArr) + '}';

                window.top.prompt(newUri, '');
            } else if (os.android) {
                window.top.prompt(uri, '');
            } else {
                warn('\u5F53\u524Dejs\u73AF\u5883\u672A\u8BC6\u522B\u7CFB\u7EDF\u7C7B\u578B\uFF0C\u5BF9\u5E94ua:' + navigator.userAgent);
            }
        } else {
            // 浏览器
            warn('\u6D4F\u89C8\u5668\u4E2Djsbridge\u65E0\u6548,\u5BF9\u5E94scheme:' + uri);
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
        messageHandlers[handlerName] = handler;
    };

    /**
     * 注册长期回调到本地
     * @param {String} callbackId 回调id
     * @param {Function} callback 对应回调函数
     */
    JSBridge.registerLongCallback = function registerLongCallback(callbackId, callback) {
        responseCallbacksLongTerm[callbackId] = callback;
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
            var message = void 0;

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
            }

            // 回调函数
            var responseId = message.responseId;
            var responseData = message.responseData;
            var responseCallback = void 0;

            if (responseId) {
                // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
                responseCallback = responseCallbacks[responseId];
                // 默认先短期再长期
                responseCallback = responseCallback || responseCallbacksLongTerm[responseId];
                // 执行本地的回调函数
                responseCallback && responseCallback(responseData);
            } else {
                /**
                 * 否则,代表原生主动执行h5本地的函数
                 * 从本地注册的函数中获取
                 */
                var handler = messageHandlers[message.handlerName];
                var data = message.data;

                // 执行本地函数,按照要求传入数据和回调
                handler && handler(data);
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
            var message = void 0;

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
            }

            // 回调函数
            var responseId = message.responseId;
            var responseData = message.responseData;
            var responseCallback = void 0;

            if (responseId) {
                // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
                responseCallback = responseCallbacks[responseId];
                // 默认先短期再长期
                responseCallback = responseCallback || responseCallbacksLongTerm[responseId];
                // 执行本地的回调函数
                responseCallback && responseCallback(responseData);
                delete responseCallbacks[responseId];
            } else {
                /**
                 * 否则,代表原生主动执行h5本地的函数
                 * 从本地注册的函数中获取
                 */
                var handler = messageHandlers[message.handlerName];
                var data = message.data;

                // 执行本地函数,按照要求传入数据和回调
                handler && handler(data);
            }
        }

        // 使用异步
        setTimeout(doDispatchMessageFromNative);
    };
}

/**
 * 内部触发jsbridge的方式，作为一个工具类提供
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
        var data = options.data;

        // 统一的回调处理
        var cbFunc = function cbFunc(res) {
            if (res.code === 0) {
                error && error(res);
                // 长期回调不走promise
                !isLongCb && reject && reject(res);
            } else {
                var finalRes = res;

                if (dataFilter) {
                    finalRes = dataFilter(finalRes);
                }
                // 提取出result
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
            JSBridge.registerLongCallback(longCbId, cbFunc);
            // 传入的是id
            JSBridge.callHandler(proto, handlerName, data, longCbId);
            // 长期回调默认就成功了，这是兼容的情况，防止有人误用
            resolve && resolve();
        } else {
            // 短期回调直接使用方法
            JSBridge.callHandler(proto, handlerName, data, cbFunc);
        }
    };
}

/**
 * 如果api没有runcode，应该有一个默认的实现
 */
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
        var data = extend({}, options);

        // 纯数据不需要回调
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
        }

        // 默认是h5
        return 'h5';
    }

    function getModuleApiParentByNameSpace(module, namespace) {
        var apiParent = module;
        // 只取命名空间的父级,如果仅仅是xxx，是没有父级的
        var parentNamespaceArray = /[.]/.test(namespace) ? namespace.replace(/[.][^.]+$/, '').split('.') : [];

        parentNamespaceArray.forEach(function (item) {
            apiParent[item] = apiParent[item] || {};
            apiParent = apiParent[item];
        });

        return apiParent;
    }

    function proxyApiNamespace(apiParent, apiName, finalNameSpace, api) {
        // 代理API，将apiParent里的apiName代理到Proxy执行
        Object.defineProperty(apiParent, apiName, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
                // 确保get得到的函数一定是能执行的
                var nameSpaceApi = proxysApis[finalNameSpace];
                // 得到当前是哪一个环境，获得对应环境下的代理对象
                var proxyObj = nameSpaceApi[getCurrProxyApiOs(os)] || nameSpaceApi.h5;

                if (proxyObj) {
                    /**
                     * 返回代理对象，所以所有的api都会通过这个代理函数
                     * 注意引用问题，如果直接返回原型链式的函数对象，由于是在getter中，里面的this会被改写
                     * 所以需要通过walk后主动返回
                     */
                    return proxyObj.walk();
                }

                // 正常情况下走不到，除非预编译的时候在walk里手动抛出
                var osErrorTips = api.os ? api.os.join('或') : '"非法"';
                var msg = api.namespace + '\u8981\u6C42\u7684os\u73AF\u5883\u4E3A:' + osErrorTips;

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
     */
    function observeModule(moduleName) {
        Object.defineProperty(hybridJs, moduleName, {
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
     * namespace 命名空间
     * os 支持的环境
     * defaultParams 默认参数
     */
    function extendApi(moduleName, apiParam) {
        if (!apiParam || !apiParam.namespace) {
            return;
        }
        if (!hybridJs[moduleName]) {
            // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
            // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
            observeModule(moduleName);
        }

        var api = apiParam;
        var modlue = hybridJs[moduleName];
        var apiNamespace = api.namespace;

        // api加上module关键字，方便内部处理
        api.moduleName = moduleName;

        var apiParent = getModuleApiParentByNameSpace(modlue, apiNamespace);

        // 最终的命名空间是包含模块的
        var finalNameSpace = moduleName + '.' + api.namespace;
        // 如果仅仅是xxx，直接取xxx，如果aa.bb，取bb
        var apiName = /[.]/.test(apiNamespace) ? api.namespace.match(/[.][^.]+$/)[0].substr(1) : apiNamespace;

        // 这里防止触发代理，就不用apiParent[apiName]了，而是用proxysApis[finalNameSpace]
        if (!proxysApis[finalNameSpace]) {
            // 如果还没有代理这个API的命名空间，代理之，只需要设置一次代理即可
            proxyApiNamespace(apiParent, apiName, finalNameSpace, api);
        }

        // 一个新的API代理，会替换以前API命名空间中对应的内容
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
                proxysApis[finalNameSpace][osTmp] = oldProxyNamespace[osTmp];
                // api本身的os要添加这个环境，便于提示
                api.os && api.os.push(osTmp);
            }
        });

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
        if (!apis || !Array.isArray(apis)) {
            return;
        }
        if (!hybridJs[moduleName]) {
            // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
            // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
            observeModule(moduleName);
        }
        for (var i = 0, len = apis.length; i < len; i += 1) {
            extendApi(moduleName, apis[i]);
        }
    }

    hybridJs.extendModule = extendModule;
    hybridJs.extendApi = extendApi;
}

/**
 * 定义如何调用一个API
 * 一般指调用原生环境下的API
 * 依赖于Promise,calljsbridgeMixin
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

        return Promise && new Promise(callback) || callback();
    }

    hybridJs.callApi = callApi;
    hybridJs.callNativeApi = callApi;
}

/**
 * 初始化给配置全局函数
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
    var readyFunc = void 0;
    var isAllowReady = false;
    var isConfig = false;

    /**
     * 检查环境是否合法，包括
     * 检测是否有检测版本号，如果不是，给出错误提示
     * 是否版本号小于容器版本号，如果小于，给予升级提示
     */
    function checkEnvAndPrompt() {
        if (!hybridJs.runtime || !hybridJs.runtime.getEjsVersion) {
            showError(globalError.ERROR_TYPE_VERSIONNOTSUPPORT.code, globalError.ERROR_TYPE_VERSIONNOTSUPPORT.msg);
        } else {
            hybridJs.runtime.getEjsVersion({
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
    }

    /**
     * 页面初始化时必须要这个config函数
     * 必须先声明ready，然后再config
     * @param {Object} params
     * config的jsApiList主要是同来通知给原生进行注册的
     * 所以这个接口到时候需要向原生容器请求的
     */
    hybridJs.config = function config(params) {
        if (hybridJs.os.dd && window.dd) {
            dd.config(params);
        } else if (isConfig) {
            showError(globalError.ERROR_TYPE_CONFIGMODIFY.code, globalError.ERROR_TYPE_CONFIGMODIFY.msg);
        } else {
            isConfig = true;

            var _success = function _success() {
                // 如果这时候有ready回调
                if (readyFunc) {
                    log('ready!');
                    readyFunc();
                } else {
                    // 允许ready直接执行
                    isAllowReady = true;
                }
            };

            if (hybridJs.os.ejs) {
                // 暂时检查环境默认就进行，因为框架默认注册了基本api的，并且这样2.也可以给予相应提示
                checkEnvAndPrompt();
                hybridJs.event.config(extend({
                    success: function success() {
                        _success();
                    },
                    error: function error(_error) {
                        var tips = JSON.stringify(_error);

                        showError(globalError.ERROR_TYPE_CONFIGERROR.code, tips);
                    }
                }, params));
            } else {
                _success();
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
        if (hybridJs.os.dd && window.dd) {
            dd.ready(callback);
        } else if (!readyFunc) {
            readyFunc = callback;
            // 如果config先进行，然后才进行ready,这时候恰好又isAllowReady，代表ready可以直接自动执行
            if (isAllowReady) {
                log('ready!');
                isAllowReady = false;
                readyFunc();
            }
        } else {
            showError(globalError.ERROR_TYPE_READYMODIFY.code, globalError.ERROR_TYPE_READYMODIFY.msg);
        }
    };

    hybridJs.app = function app(params) {
        hybridJs.os.ejs && document.addEventListener('DOMContentLoaded', function () {
            hybridJs.event.dispatchEventToNative && hybridJs.event.dispatchEventToNative({
                key: 'DOMContentLoaded'
            });
        });

        hybridJs.event.app(extend({}, params));
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

        if (!innerUtil.isObject(newArgs[0])) {
            var options = {};
            var isPromise = !!hybridJs.getPromise();
            var len = newArgs.length;
            var paramsLen = isPromise ? len - 2 : len;

            // 填充字符串key，排除最后的resolve与reject

            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                rest[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < paramsLen; i += 1) {
                // 注意映射关系，rest[0]相当于以前的arguments[1]
                if (rest[i] !== undefined) {
                    options[rest[i]] = newArgs[i];
                }
            }

            // 分别为options，resolve，reject
            newArgs[0] = options;
            if (isPromise) {
                newArgs[1] = newArgs[len - 2];
                newArgs[2] = newArgs[len - 1];
            } else {
                // 去除普通参数对resolve与reject的影响
                newArgs[1] = undefined;
                newArgs[2] = undefined;
            }
        }

        // 默认参数的处理，因为刚兼容字符串后是没有默认参数的
        if (this.api && this.api.defaultParams && newArgs[0] instanceof Object) {
            Object.keys(this.api.defaultParams).forEach(function (item) {
                if (newArgs[0][item] === undefined) {
                    newArgs[0][item] = _this.api.defaultParams[item];
                }
            });
        }

        // 否则已经是标准的参数形式，直接返回
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

// import appMixin from './core/app';

function mixin(hybrid) {
    var hybridJs = hybrid;

    osMixin(hybridJs);
    promiseMixin(hybridJs);
    errorMixin(hybridJs);
    // 不依赖于promise，但是是否有Promise决定返回promise对象还是普通函数, 依赖于globalError
    proxyMixin(hybridJs);
    // 依赖于showError，globalError，os
    jsbridgeMixin(hybridJs);
    // api没有runcode时的默认实现，依赖于jsbridge与os
    callinnerMixin(hybridJs);
    // 依赖于os，Proxy，globalError，showError，以及callInner
    defineapiMixin(hybridJs);
    // 依赖于JSBridge，Promise,sbridge
    callnativeapiMixin(hybridJs);
    // init依赖与基础库以及部分原生的API
    initMixin(hybridJs);
    // 给API快速使用的内部工具集
    innerUtilMixin(hybridJs);
    // 生命周期API
    // appMixin(hybridJs);
}

var hybridJs = {};

mixin(hybridJs);

hybridJs.version = '4.0.0';

uiMixin(hybridJs);
pageMixin(hybridJs);
storageMixin(hybridJs);
deviceMixin(hybridJs);
pageMixin$1(hybridJs);
contactMixin(hybridJs);

return hybridJs;

})));
