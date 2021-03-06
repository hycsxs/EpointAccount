/**
 * 作者: 郭天琦
 * 创建时间: 2018/01/04
 * 版本: [1.0, 2018/01/04 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: 对浮点数、或者整数的加减乘除
 */

(function () {
    'use strict';

    /**
     * mathTools 包含加减乘除四个方法，能确保浮点数运算不丢失精度
     *
     * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
     * 以下是十进制小数对应的二进制表示
     *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
     *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
     * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
     *
     * ** method **
     *  add / subtract / multiply / divide
     *
     * ** explame **
     *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
     *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
     *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
     *
     * mathTools.add(0.1, 0.2) >> 0.3
     * mathTools.multiply(19.9, 100) >> 1990
     *
     */
    var mathTools = {

        /*
         * 判断obj是否为一个整数
         */
        isInteger: function (num) {
            return Math.floor(num) === num;
        },

        /*
         * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
         * @param floatNum {number} 小数
         * @resulturn {object}
         *   {times:100, num: 314}
         */
        toInteger: function (floatNum) {
            var self = this;
            var result = {
                times: 1,
                num: 0
            };

            if (self.isInteger(floatNum)) {
                result.num = floatNum;

                return result;
            }

            var str = floatNum + '',
                dotIndex = str.indexOf('.'),
                len = str.substring(dotIndex + 1).length,
                times = Math.pow(10, len),
                intNum = parseInt(floatNum * times + 0.5, 10);

            result.times = times;
            result.num = intNum;

            return result;
        },

        /*
         * 核心方法，实现加减乘除运算，确保不丢失精度
         * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
         *
         * @param num1 {number} 运算数1
         * @param num2 {number} 运算数2
         * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
         * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
         *
         */
        operation: function (num1, num2, op) {
            var self = this;
            var o1 = self.toInteger(num1),
                o2 = self.toInteger(num2),
                n1 = o1.num,
                n2 = o2.num,
                t1 = o1.times,
                t2 = o2.times,
                max = t1 > t2 ? t1 : t2;

            var result = null;

            switch (op) {
                case 'add':

                    if (t1 === t2) { // 两个小数位数相同
                        result = n1 + n2;
                    } else if (t1 > t2) { // o1 小数位 大于 o2
                        result = n1 + n2 * (t1 / t2);
                    } else { // o1 小数位 小于 o2
                        result = n1 * (t2 / t1) + n2;
                    }

                    return result / max;

                case 'subtract':
                    if (t1 === t2) {
                        result = n1 - n2;
                    } else if (t1 > t2) {
                        result = n1 - n2 * (t1 / t2);
                    } else {
                        result = n1 * (t2 / t1) - n2;
                    }

                    return result / max;

                case 'multiply':
                    result = (n1 * n2) / (t1 * t2);

                    return result;

                case 'divide':
                    var r1 = n1 / n2,
                        r2 = t2 / t1;

                    return self.operation(r1, r2, 'multiply');

                default:
            }
        }
    };

    /**
     * 暴露出去的运算方法
     */
    var exportsMethod = {
        /**
         * add two numbers
         * @param {Number} num1 The first number
         * @param {Number} num2 The second number
         * @return {Number} The sum of the two numbers.
         */
        add: function (num1, num2) {
            return mathTools.operation(num1, num2, 'add');
        },

        /**
         * subtract two numbers
         * @param {Number} num1 The first number
         * @param {Number} num2 The second number
         * @return {Number} The subtract of the two numbers.
         */
        subtract: function (num1, num2) {
            return mathTools.operation(num1, num2, 'subtract');
        },

        /**
         * multiply two numbers
         * @param {Number} num1 The first number
         * @param {Number} num2 The second number
         * @return {Number} The multiply of the two numbers.
         */
        multiply: function (num1, num2) {
            return mathTools.operation(num1, num2, 'multiply');
        },

        /**
         * divide two numbers
         * @param {Number} num1 The first number
         * @param {Number} num2 The second number
         * @return {Number} The divide of the two numbers.
         */
        divide: function (num1, num2) {
            return mathTools.operation(num1, num2, 'divide');
        }
    };

    // 将方法暴露出去
    if (!Util.math && typeof Util.math !== 'object') {
        Util.math = exportsMethod;
    } else {
        Util.math = Util.extend(Util.math, exportsMethod);
    }
}());