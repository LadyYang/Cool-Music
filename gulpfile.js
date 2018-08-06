var gulp = require("gulp");
var imagemin = require("gulp-imagemin")
// var htmlclean = require("gulp-htmlclean");
var uglify = require("gulp-uglify");
var stripDebug = require("gulp-strip-debug");
// var concat = require("gulp-concat");
// var deporder = require("gulp-deporder");
// var less = require("gulp-less");
// var postcss = require("gulp-postcss");
// var autoprefixer = require("autoprefixer");
// var cssnano = require("cssnano");
var connect = require("gulp-connect");



var folder = {
    src: "src/",
    dist: "dist/"
}


// //流操作 task running
// gulp.task("html", function () {
//     var page = gulp.src(folder.src + "html/index.html")
//         .pipe(connect.reload());
//     if (!devMode) {
//         page.pipe(htmlclean());
//     }
//     page.pipe(gulp.dest(folder.dist + "html/"))
// })

gulp.task("images", function () {
    gulp.src(folder.src + "images/*")
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images/"))
})
gulp.task("js", function () {
    gulp.src(folder.src + "utils/*")
        // .pipe(connect.reload())
        // .pipe(uglify())
        .pipe(stripDebug())
        .pipe(gulp.dest(folder.dist + "utils/"))
})

gulp.task("default", ["images", "js"]);