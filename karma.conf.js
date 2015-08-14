'use strict';
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/module.js',
      'src/*.js',
      'tests/fixtures/*.js',
      'tests/*-spec.js'
    ],
    autoWatch: false,
    singleRun: true
  });
};
