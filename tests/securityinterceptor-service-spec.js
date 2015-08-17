'use strict';

describe('Service:securityInterceptor', function () {
  beforeEach(module('ngSecurity'));
  var $securityInterceptor,
      $rootScope;

  beforeEach(inject(function ($injector) {
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
});
