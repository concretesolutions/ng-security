'use strict';
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    wrapper = require('gulp-wrapper'),
    karma = require('karma').server,
    config = require('./package.json');

gulp.task('lint', function () {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', ['lint'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function () {
    done();
  });
});

gulp.task('dist', function () {
  return gulp.src('./src/*.js')
    .pipe(concat(config.name + '.js'))
    .pipe(wrapper({
      header: '"use strict";\n(function () {\n',
      footer: '}).call(window);'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(closureCompiler({
      compilerPath: 'node_modules/closure-compiler/lib/vendor/compiler.jar',
      fileName: config.name + '.min.js',
      compilerFlags: {
        language_in: 'ECMASCRIPT5_STRICT'
      }
    }))
    .pipe(gulp.dest('dist'));
});
