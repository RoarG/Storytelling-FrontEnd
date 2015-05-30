// Main file that defines the app. 

// This creates a module for the app called 'stories', and the second parameter is the modules it is dependent on. 
// Files ending with Ctrl is found in the controller folder
var stories = angular.module('stories', [
	'ionic',	
	'backend.services',
	'ngCordova',	
	'ui.router',
	'IntroCtrl',
	'LoginCtrl',
	'ProfilCtrl',
	'PrefCtrl',
	'MenuCtrl',
	'ListViewCtrl',
	'RecomdCtrl',
	'StoryCtrl',
	'BookmarkCtrl',
	'SettingsCtrl',
	'RatingCtrl',
	'TutorialCtrl'
])

// This runs when the application is started. 
.run(function($ionicPlatform, $cordovaDialogs, $cordovaNetwork, $rootScope, $cordovaSplashscreen, Requests, $window, $state) {
	$ionicPlatform.ready(function() {
		
		// Tells the back-end that the app has been started.
		Requests.opensApp($window.localStorage.getItem('userId'));
		
		//TODO: Forklar! FIX
		//Enable fullsceen for the onboarding and splashscreen
		//StatusBar.hide();



		// Uses ionic keyboard plugin
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the keyboard accessory bar by default (on the top of the keyboard when filling in form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Avoids content being pushed up when focusing on inputs below the keyboard. 
			cordova.plugins.Keyboard.disableScroll(true);
		}
		// Uses cordova statusbar plugin
		if (window.StatusBar) {
			StatusBar.styleDefault(); // Light background, black text
			StatusBar.hide();
		}

		// Checks for an internet connection. Uses the ngCordova plugin called $cordovaNetwork
		if (window.Connection) {
			// Checks if offline when app is started
			if ($cordovaNetwork.isOffline()) {
				$cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
			}

			// Listen for Offline event
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
				$cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
			});
		}

		screen.lockOrientation("portrait");
		
		// Decides which view to go to first:
		$ionicPlatform.ready(function() {
			// If the user has not been through the tutorial, go to tutorial. 
			if (!($window.localStorage.getItem('didTutorial'))) 
			{
				$state.go('onboardOne');
			}
			// If user is logged in, go to recommendation view. 
			else if ($window.localStorage.getItem('userId') !== "-1" && $window.localStorage.getItem('userId') !== null)
			{
				$state.go('app.recommendations');
			}
			// If logged out but have done tutorial, go to login view. 
			else
			{
				$state.go('login');
			}
			$cordovaSplashscreen.hide();
		});
	});

  // Tells back-end that the app has been opened again after having been paused.
  $ionicPlatform.on('resume', function() {
    Requests.opensApp($window.localStorage.getItem('userId'));
  });
  // Tells back-end that the app has been paused
  $ionicPlatform.on('pause', function() {
    Requests.closesApp($window.localStorage.getItem('userId'));
  });
})

// Defines the different states of the app and the templates and controllers that are associated to them. 
.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
	$ionicConfigProvider.backButton.text('Tilbake'); // Changes the default text of the back button to Norwegian "Tilbake".
	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'MenuCtrl'
	})

// Tutorial when starting app
	.state('onboardOne', {
		url: "/onboardOne",
		templateUrl: "templates/onboardingOne.html",
		controller: 'IntroCtrl'
	})

	.state('onboardTwo', {
		url: "/onboardTwo",
		templateUrl: "templates/onboardingTwo.html",
		controller: 'IntroCtrl'
	})

	.state('onboardTree', {
		url: "/onboardTree",
		templateUrl: "templates/onboardingTree.html",
		controller: 'IntroCtrl'
	})

// Tutorial accessed through settings
	.state('appOne', {
		url: "/appOne",
		templateUrl: "templates/appOne.html",
		controller: 'TutorialCtrl'
	})

	.state('appTwo', {
		url: "/appTwo",
		templateUrl: "templates/appTwo.html",
		controller: 'TutorialCtrl'
	})

	.state('appTree', {
		url: "/appTree",
		templateUrl: "templates/appTree.html",
		controller: 'TutorialCtrl'
	})

	.state('login', {
		cache: false,
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})

	.state('profile', {
		cache: false,
		url: "/profile",
		templateUrl: "templates/profile.html",
		controller: 'ProfilCtrl'
	})

	.state('preferences', {
		cache: false,
		url: "/preferences",
		templateUrl: "templates/preferences.html",
		controller: 'PrefCtrl'
	})

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
				controller: 'ProfilCtrl'
			}
		}
	})

	.state('app.editPreferences', {
		url: "/editPreferences",
		views: {
			'menuContent': {
				templateUrl: "templates/editPreferences.html",
				controller: 'PrefCtrl'
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
				controller: 'RecomdCtrl'
			}
		}
	})

	.state('app.story', {
		url: "/story",
		views: {
			'menuContent': {
				templateUrl: "templates/story.html"
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

	// If app is not started before go to onboardOne
	// already logged in, go to recommendation view, otherwise go to login. 	
	/*$urlRouterProvider.otherwise('/onboardOne');*/
  
});