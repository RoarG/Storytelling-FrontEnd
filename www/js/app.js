// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'backend.services', 'ngCordova', 'ui.router'])


.run(function($ionicPlatform, $cordovaDialogs, $cordovaNetwork, $rootScope) {
  $ionicPlatform.ready(function() {

      //Initial new user
    window.localStorage['newUser'] = false;
      //Enable fullsceen 
    StatusBar.hide();
      //Showing the SpashScreen for 5 sec.
    setTimeout(function() {
      $cordovaSplashscreen.hide()
    }, 5000)

    console.log("Winsows.statrsdbar" + window.StatusBar)
    //StatusBar.hide();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        //Undersøk om denne får ønskelig resultat i IOS
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {

      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.hide();
    }

    if (window.Connection) {
      if ($cordovaNetwork.isOffline()) {
        $cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
      }
      if ($cordovaNetwork.isOnline()) {
        $cordovaDialogs.alert("Nett!", "Hurra!");
      }

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        var offlineState = networkState;
        $cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
      });
    }
  });
})


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

  .state('onboardOne', {
    url: "/onboardOne",
    templateUrl: "templates/onboardingOne.html",
    controller: 'AppCtrl'
  })

  .state('onboardTwo', {
    url: "/onboardTwo",
    templateUrl: "templates/onboardingTwo.html",
    controller: 'AppCtrl'
  })

  .state('onboardTree', {
    url: "/onboardTree",
    templateUrl: "templates/onboardingTree.html",
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
    			templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
    		}
    	}
    })

    .state('app.editProfile', {
      url: "/editProfile",
      views: {
        'menuContent': {
          templateUrl: "templates/editProfile.html",
          controller: 'AppCtrl'
        }
      }
    })

    .state('app.editPreferences', {
      url: "/editPreferences",
      views: {
        'menuContent': {
          templateUrl: "templates/editPreferences.html",
          controller: 'AppCtrl'
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

    .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
    });

        // If app is not started befor go to onboardOne
    // already logged in, go to recommendation view, otherwise go to login. 
  if(!(window.localStorage['newUser'])) {
    console.log("ONBOARD" + window.localStorage['newUser']);
    $urlRouterProvider.otherwise('/onboardOne'); 
  }
  else if(window.localStorage['userId'] !== undefined && window.localStorage['userId'] !== "-1") {
    console.log("recommendations");
    $urlRouterProvider.otherwise('/app/recommendations');
  } 
  else {
    console.log("login" + window.localStorage['newUser']);
   $urlRouterProvider.otherwise('/login');
  }

  
});
