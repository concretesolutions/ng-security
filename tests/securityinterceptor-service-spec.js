'use strict';

describe('Service:securityInterceptor', function () {
  beforeEach(module('ngSecurity'));
  var $securityInterceptor,
      $security,
      $rootScope;

  beforeEach(inject(function ($injector) {
    $security = $injector.get('$security');
    $securityInterceptor = $injector.get('$securityInterceptor');
    $rootScope = $injector.get('$rootScope');
  }));

  it('should broadcast authorization problem', function () {
    var rejection = {
      status: 401
    };
    var rootScopeOn = sinon.spy($rootScope, '$broadcast');
    $securityInterceptor.responseError(rejection);
    $rootScope.$digest();
    rootScopeOn.calledWith('unauthenticated').should.be.ok;
  });

  it('should broadcast permission problem', function () {
    var rejection = {
      status: 403
    };
    var rootScopeOn = sinon.spy($rootScope, '$broadcast');
    $securityInterceptor.responseError(rejection);
    $rootScope.$digest();
    rootScopeOn.calledWith('permissionDenied').should.be.ok;
  });

  it('should request with authorization token', function () {
    var config = {
      headers: {}
    };
    $security.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    config = $securityInterceptor.request(config);
    assert.equal(config.headers.Authorization, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });
});
