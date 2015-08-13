'use strict';

describe('Module', function () {
  it('should initialize', function () {
    var ngSecurity = angular.module('ngSecurity');
    assert.isDefined(ngSecurity);
  });
});
