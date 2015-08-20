'use strict';

describe('Provider:security', function () {
  var provider;

  beforeEach(module('ngSecurity'));
  beforeEach(module(function ($securityConfigProvider) {
    provider = $securityConfigProvider;
  }));
  beforeEach(inject());

  it('should return default value from configuration', function () {
    var config = provider.$get();

    assert.equal(config.token.header, 'Authorization');
    assert.equal(config.token.storage, 'ng-security-authorization');
    assert.equal(config.user.storage, 'ng-security-user');
    assert.equal(config.permissions.storage, 'ng-security-permissions');
  });

  it('should define configuration', function () {
    var config;

    provider.configure({
      token: {
        header: 'X-Auth',
        storage: 'myToken'
      },
      user: {
        storage: 'myUser'
      },
      permissions: {
        storage: 'myPermissions'
      }
    });

    config = provider.$get();

    assert.equal(config.token.header, 'X-Auth');
    assert.equal(config.token.storage, 'myToken');
    assert.equal(config.user.storage, 'myUser');
    assert.equal(config.permissions.storage, 'myPermissions');
  });
});
