/**
 * 获取两个颜色之间的渐变色
 * @param {String} start 开始颜色
 * @param {String} end 结束颜色
 * @param {Number} steps 步长
 * @param {Number} gamma 色彩校正
 */
function gradientColors(start, end, steps, gamma) {
    var i, j, ms, me, output = [], so = [];
    gamma = gamma || 1;
    var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
    };
    start = parseColor(start).map(normalize);
    end = parseColor(end).map(normalize);
    for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
            so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
    }
    return output;
    // convert #hex notation to rgb array
    function parseColor(hexStr) {
        return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
    };

    // zero-pad 1 digit to 2
    function pad(s) {
        return (s.length === 1) ? '0' + s : s;
    };

};

// try if it works
console.log(gradientColors('#00ff00', '#ff0000', 100));

console.log(gradientColors('#000', '#fff', 100, 2.2));