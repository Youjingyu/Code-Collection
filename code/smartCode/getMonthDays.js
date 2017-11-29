/**
 * 获取某年某月的天数
 * @param {Date} date 日期
 */
function getDeepObjectData(date) {
    var year = date.getYear(), month = date.getMonth() + 1;
    // 判断是否是闰年
    var isLeapYear = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    // 获取当月天数
    return (month === 2) ?  (28 + isLeapYear) : 31 - (month - 1) % 7 % 2;
}