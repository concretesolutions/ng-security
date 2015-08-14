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
        /*jshint camelcase: false */
        language_in: 'ECMASCRIPT5_STRICT',
        create_source_map: './dist/' + config.name + '.min.js.map',
        source_map_format: 'V3',
        output_wrapper: '//# sourceMappingURL=' + config.name + '.min.js.map\n%output%'
      }
    }))
    .pipe(gulp.dest('dist'));
});
