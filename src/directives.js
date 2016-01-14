angular
  .module('ngSecurity')
  .directive('ngIfAuthenticated', ifAuthenticated)
  .directive('ngIfAnonymous', ifAnonymous)
  .directive('ngIfPermission', ifPermission)
  .directive('ngIfPermissionModel', ifPermissionModel)
  .directive('ngEnabledPermission', enabledPermission)
  .directive('ngClickLogout', clickLogout)
  .directive('ngBindUser', bindUser)
  .directive('ngSubmitLogin', submitLogin)
  .directive('ngShowLoginSuccess', showLoginSuccess)
  .directive('ngShowLoginError', showLoginError);

ifAuthenticated.$inject = ['$security', '$animate', '$rootScope'];
ifAnonymous.$inject = ['$security', '$animate', '$rootScope'];
ifPermission.$inject = ['$security'];
ifPermissionModel.$inject = ['$security', '$parse'];
enabledPermission.$inject = ['$security'];
clickLogout.$inject = ['$security'];
bindUser.$inject = ['$security'];
submitLogin.$inject = ['$rootScope', '$security'];
showLoginSuccess.$inject = ['$rootScope'];
showLoginError.$inject = ['$rootScope'];

function ifAuthenticated ($security, $animate, $rootScope) {
  /** interface */
  var directive = {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: link
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, ctrl, transclude) {
    var render = new RenderHandler(scope, element, attrs, ctrl, transclude, $animate);
    var deregister = $rootScope.$on('authChanged', function (event, status) {
      render.handle(status);

    });
    render.handle($security.isAuthenticated());
  }
}

function ifAnonymous ($security,  $animate,  $rootScope) {
  /** interface */
  var directive = {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: link
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, ctrl, transclude) {
    var render = new RenderHandler(scope, element, attrs, ctrl, transclude, $animate);
    var deregister = $rootScope.$on('authChanged', function (event, status) {
      render.handle(!status);

    });
    render.handle(!$security.isAuthenticated());
  }
}

function ifPermission ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display'),
        permissionType = attrs.ngPermissionType,
        permissions = attrs.ngIfPermission.split(',');

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.css('display', defaultStyle);
      } else {
        element.css('display', 'none');
      }
    }, true);
  }
}

function ifPermissionModel ($security, $parse) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var defaultStyle = element.css('display'),
        permissionType = attrs.ngPermissionType;

    var updateElement = function (permissions) {
        if ($security.hasPermission(permissions) || $security.getPermissionValidation(permissionType)(permissions)) {
          element.css('display', defaultStyle);
        } else {
          element.css('display', 'none');
        }
    };

    scope.$watch(function () {
      return $parse(attrs.ngIfPermissionModel)(scope);
    }, function (permissions) {
      updateElement(permissions);
    });

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      var permissions = $parse(attrs.ngIfPermissionModel)(scope);
      updateElement(permissions);
    }, true);
  }
}

function enabledPermission ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    var permissionType = attrs.ngPermissionType,
        permissions = attrs.ngEnabledPermission.split(',');

    scope.$watch(function () {
      return $security.getPermissions();
    }, function () {
      if ($security.getPermissionValidation(permissionType)(permissions)) {
        element.removeAttr('disabled');
      } else {
        element.attr('disabled', 'true');
      }
    }, true);
  }
}

function clickLogout ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    element.bind('click', $security.logout);
  }
}

function bindUser ($security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs) {
    scope.$watch(function () {
      return $security.getUser();
    }, function (user) {
      element.text(user[attrs.ngBindUser]);
    }, true);
  }
}

function submitLogin ($rootScope, $security) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'A',
    scope: {
      'ngLoginSuccess': '&',
      'ngLoginError': '&'
    },
    require: '^form'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, formCtrl) {
    element.bind('submit', function () {
      var url = attrs.ngSubmitLogin,
          fields = element.find('input'),
          credentials = {};
      angular.forEach(fields, function (input) {
        if (input.type !== 'submit' && !!input.name) {
          credentials[input.name] = input.value;
        }
      });

      $security.loginByUrl(url, credentials)
        .then(function (response) {
          $rootScope.$broadcast('ng-security:login:success');
          scope.ngLoginSuccess({$response: response});
        })
        .catch(function (response) {
          $rootScope.$broadcast('ng-security:login:error');
          scope.ngLoginError({$response: response});
        });
    });
  }
}

function showLoginSuccess ($rootScope) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'AEC'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, formCtrl) {
    var defaultStyle = element.css('display');
    element.css('display', 'none');

    $rootScope.$on('ng-security:login:success', function () {
      element.css('display', defaultStyle);
    });

    $rootScope.$on('ng-security:login:error', function () {
      element.css('display', 'none');
    });
  }
}

function showLoginError ($rootScope) {
  /** interface */
  var directive = {
    link: link,
    restrict: 'AEC'
  };

  return directive;

  /** implementation */
  function link (scope, element, attrs, formCtrl) {
    var defaultStyle = element.css('display');
    element.css('display', 'none');

    $rootScope.$on('ng-security:login:success', function () {
      element.css('display', 'none');
    });

    $rootScope.$on('ng-security:login:error', function () {
      element.css('display', defaultStyle);
    });
  }
}


//render class
function RenderHandler(scope, element, attrs, ctrl, transclude, $animate) {
  var block, childScope, previousElements;



  this.handle = function (expression) {
    if (expression) {
      if (!childScope) {
        transclude(function(clone, newScope) {
          childScope = newScope;
          clone[clone.length++] = document.createComment(' end ng-securityIf');
          // Note: We only need the first/last node of the cloned nodes.
          // However, we need to keep the reference to the jqlite wrapper as it might be changed later
          // by a directive with templateUrl when its template arrives.
          block = {
            clone: clone
          };
          $animate.enter(clone, element.parent(), element);
        });
      }
    }
    else{
      if (previousElements) {
        previousElements.remove();
        previousElements = null;
      }
      if (childScope) {
        childScope.$destroy();
        childScope = null;
      }
      if (block) {
        previousElements = getBlockNodes(block.clone);
        $animate.leave(previousElements).then(function() {
          previousElements = null;
        });
        block = null;
      }
    }
  };

  function getBlockNodes(nodes) {
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes;

    for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
      if (blockNodes || nodes[i] !== node) {
        if (!blockNodes) {
          blockNodes = jqLite(slice.call(nodes, 0, i));
        }
        blockNodes.push(node);
      }
    }

    return blockNodes || nodes;
  }

};
