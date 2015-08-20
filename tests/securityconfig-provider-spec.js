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
    assert.equal(config.storageName.token, 'ng-security-authorization');
    assert.equal(config.storageName.user, 'ng-security-user');
    assert.equal(config.storageName.permissions, 'ng-security-permissions');
  });

  it('should define configuration', function () {
    var config;

    provider.configure({
      token: {
        header: 'X-Auth',
      },
      storageName: {
        token: 'myToken',
        user: 'myUser',
        permissions: 'myPermissions'
      }
    });

    config = provider.$get();

    assert.equal(config.token.header, 'X-Auth');
    assert.equal(config.storageName.token, 'myToken');
    assert.equal(config.storageName.user, 'myUser');
    assert.equal(config.storageName.permissions, 'myPermissions');
  });
});
