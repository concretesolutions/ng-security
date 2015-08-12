'use strict';
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server;

gulp.task('lint', function () {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('test', ['lint'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function () {
    done();
  });
});
