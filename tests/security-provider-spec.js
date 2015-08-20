'use strict';

describe('Provider:security', function () {
  var provider;

  beforeEach(module('ngSecurity'));
  beforeEach(module(function ($securityConfigProvider) {
    provider = $securityConfigProvider;
  }));
  beforeEach(inject());

  it('should return default value from token header name', function () {
    assert.equal(provider.$get().token.header, 'Authorization');
  });

  it('should define token header name', function () {
    provider.configure({
      token: {
        header: 'X-Auth'
      }
    });

    assert.equal(provider.$get().token.header, 'X-Auth');
  });
});
