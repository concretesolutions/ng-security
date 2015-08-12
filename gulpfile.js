'use strict';
var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function () {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('test', ['lint'], function () {

});
