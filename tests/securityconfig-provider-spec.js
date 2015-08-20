'use strict';

describe('Provider:security', function () {
  var provider;

  beforeEach(module('ngSecurity'));
  beforeEach(module(function ($securityConfigProvider) {
    provider = $securityConfigProvider;
  }));
  beforeEach(inject());

  it('should return default value from configuration', function () {
    assert.equal(provider.$get().token.header, 'Authorization');
    assert.equal(provider.$get().token.storage, 'ng-security-authorization');
    assert.equal(provider.$get().user.storage, 'ng-security-user');
  });

  it('should define configuration', function () {
    provider.configure({
      token: {
        header: 'X-Auth',
        storage: 'myToken'
      },
      user: {
        storage: 'myUser'
      }
    });

    assert.equal(provider.$get().token.header, 'X-Auth');
    assert.equal(provider.$get().token.storage, 'myToken');
    assert.equal(provider.$get().user.storage, 'myUser');
  });
});
