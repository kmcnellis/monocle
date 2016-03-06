'use strict';

angular.module('monocleApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Purpose',
      'link': '#purpose'
    },
    {
      'title': 'Features',
      'link': '#features'
    },
    {
      'title': 'Team',
      'link': '#team'
    },
    {
      'title': 'Demo',
      'link': '#demo'
    }
  ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
