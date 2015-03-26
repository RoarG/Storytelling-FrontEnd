// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'backend.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.hide();
    }
  });
})

/*  $scope.Platform.ready(function() {
    //hide the status bar using the StatusBar plugin
    StatusBar.hide();
  });*/
.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.story', {
      url: "/story",
      views: {
          'menuContent': {
              templateUrl: "templates/story.html"
          }
      }
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'AppCtrl'
  })

  .state('profile', {
    url: "/profile",
    templateUrl: "templates/profile.html",
    controller: 'AppCtrl'
  })

  .state('preferences', {
    url: "/preferences",
    templateUrl: "templates/preferences.html",
    controller: 'AppCtrl'
  })


/*
  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller: 'AppCtrl'
      }
    }
  })



  .state('app.profile', {
  url: "/profile",
  views: {
    'menuContent': {
      templateUrl: "templates/profile.html",
      controller: 'AppCtrl'
    }
  }
})

  .state('app.preferences', {
  url: "/preferences",
  views: {
    'menuContent': {
      templateUrl: "templates/preferences.html",
      controller: 'AppCtrl'
    }
  }
})
*/
  
  .state('app.settings', {
	url: "/settings",
	views: {
		'menuContent': {
			templateUrl: "templates/settings.html"
		}
	}
  })
  
    .state('app.listView', {
      url: "/listView",
      views: {
        'menuContent': {
          templateUrl: "templates/listView.html",
          controller: 'ListViewCtrl'
        }
      }
    })

    .state('app.recommendations', {
      url: "/recommendations",
      views: {
        'menuContent': {
          templateUrl: "templates/recommendations.html",
          controller: 'RecommendationCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });

// If already logged in, go to recommendation view, otherwise go to login. 
  //if(window.localStorage['userId'] !== undefined && window.localStorage['userId'] !== "-1") {
     //$urlRouterProvider.otherwise('/app/recommendations');
  //} else {
    $urlRouterProvider.otherwise('/login');
  //}
  
});
