// First parameter is the name of the module
// the 2nd parameter is an array of 'requires'
//TODO: Forklar! FIX
// 'starter.controllers' is found in controllers.js Files ending with Ctrl is found in the controlles folder
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
	'RatingCtrl'
])


.run(function($ionicPlatform, $cordovaDialogs, $cordovaNetwork, $rootScope, $cordovaSplashscreen) {
	$ionicPlatform.ready(function() {
		
		//TODO: Forklar! FIX
		//Enable fullsceen for the onboarding and splashscreen
		//StatusBar.hide();
		//Showing the SpashScreen for 5 sec.
		setTimeout(function() {
			$cordovaSplashscreen.hide()
		}, 5000)

		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			//Undersøk om denne får ønskelig resultat i IOS
			cordova.plugins.Keyboard.disableScroll(true);
		}
		//TODO: Forklar!
		if (window.StatusBar) {
			//TODO: Forklar!
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
			StatusBar.hide();
		}

		//TODO: Forklar!
		if (window.Connection) {
			if ($cordovaNetwork.isOffline()) {
				$cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
			}
			if ($cordovaNetwork.isOnline()) {
				$cordovaDialogs.alert("Nett!", "Hurra!");
			}

			// listen for Online event
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
				var onlineState = networkState;
			});

			// listen for Offline event
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
				var offlineState = networkState;
				$cordovaDialogs.alert("Ingen nettilgang", "Enheten din er ikke tilkoblet Internett");
			});
		}
	});
})

//TODO: Forklar!
.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
	$ionicConfigProvider.backButton.text('Tilbake');
	$stateProvider

		.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'MenuCtrl'
	})

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

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})

	.state('profile', {
		url: "/profile",
		templateUrl: "templates/profile.html",
		controller: 'ProfilCtrl'
	})

	.state('preferences', {
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
	$urlRouterProvider.otherwise('/onboardOne');
  
});