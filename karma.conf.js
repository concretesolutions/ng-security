'use strict';
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    files: [
      'src/*.js',
      'tests/*.js'
    ],
    autoWatch: false,
    singleRun: true
  });
};
