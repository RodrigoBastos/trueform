var gulp          = require("gulp");
var rename        = require("gulp-rename");
var uglify        = require("gulp-uglify");
var include       = require("gulp-include");

gulp.task("js", function (done) {

  gulp.src("./source/js/*.js")
    .pipe(include())
    //.pipe(uglify({mangle:false}))
    .pipe(rename({extname:".min.js"}))
    .pipe(gulp.dest("./dist"))
    .on("end", done);
});
