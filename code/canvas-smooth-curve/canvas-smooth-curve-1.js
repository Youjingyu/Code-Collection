// 实现简单，但不够精确

var ctx = document.getElementById('canvas').getContext('2d');
var points = [
    {x: 10, y: 100},
    {x: 60, y: 200},
    {x: 110, y: 150},
    {x: 160, y: 160},
    {x: 210, y: 120},
    {x: 260, y: 100},
    {x: 310, y: 150},
];
for (var j = 0; j < points.length; j ++) {
    ctx.font = "20px serif";
    ctx.fillText(String(points[j].y), points[j].x, points[j].y);
}
ctx.beginPath();
ctx.moveTo(points[0][0], points[0][1]);
for (var i = 0; i < points.length - 2; i ++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
}

// curve through the last two points
ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
ctx.stroke();