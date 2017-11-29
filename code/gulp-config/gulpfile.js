var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    htmlMin = require('gulp-htmlmin'),
    htmlImgBase64 = require('gulp-img64'),
    base64 = require('gulp-base64');
var fs = require('fs');


gulp.task('jsmin', function () {
    return gulp.src('yijian/common.js')
        .pipe(uglify())
        .pipe(gulp.dest('yijian/dist/'));
});

gulp.task('handleCss', function () {
    return gulp.src('yijian/common.css')
        .pipe(base64({
            baseDir: 'yijian',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [],
            excludeDec: 'yijian/build/img',
            maxImageSize: 20*1024,
            debug: true
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('yijian/dist/'));
});

gulp.task('htmlMin', function () {
    return gulp.src('yijian/index.html')
        .pipe(htmlImgBase64({
            exclude: ['title.png'],
            excludeDec: 'yijian/build/img'
        }))
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(gulp.dest('yijian/dist/'));
});

gulp.task('htmlConcat', ['jsmin', 'handleCss', 'htmlMin'], function () {
    var html = fs.readFileSync('yijian/dist/index.html').toString();
    var css = fs.readFileSync('yijian/dist/common.css').toString();
    var js = fs.readFileSync('yijian/dist/common.js').toString();
    html = html.replace('<link rel="stylesheet" href="common.css">', '<style>' + css + '</style>');
    html = html.replace('<script src="common.js"></script>', '<script>' + js + '</script>');
    // fs.rmdir("/yijian/build/", function () {
    //     fs.mkdir("/yijian/build/",function(){
    //         fs.writeFile('yijian/build/start.html', html, function () {});
    //     });
    // })
    fs.writeFile('yijian/build/start.html', html, function () {});
});

gulp.task('default', ['htmlConcat']);

// gulp.task('default', gulpSequence(['jsmin', 'handleCss', 'htmlMin'], 'htmlConcat'));