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
  var header = [
    '/*',
    ' ' + config.name + ' v' + config.version,
    ' ' + config.copyright,
    ' License: ' + config.license,
    '*/'
  ].join('\n');
  return gulp.src([
      './src/module.js',
      './src/*.js'
    ])
    .pipe(concat(config.name + '.js'))
    .pipe(wrapper({
      header: [
        header,
        '\'use strict\';',
        '(function () {',
      ].join('\n'),
      footer: '}).call(window);'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      fileName: config.name + '.min.js',
      compilerFlags: {
        /*jshint camelcase: false */
        language_in: 'ECMASCRIPT5_STRICT',
        create_source_map: './dist/' + config.name + '.min.js.map',
        source_map_format: 'V3',
        output_wrapper: header + '\n//# sourceMappingURL=' + config.name + '.min.js.map\n%output%'
      }
    }))
    .pipe(gulp.dest('dist'));
});
