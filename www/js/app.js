// Main file that defines the app.

// This creates a module for the app called 'stories', and the second parameter is the modules it is dependent on.
// Files ending with Ctrl is found in the controller folder
var stories = angular.module('stories', [
	'ionic',
	'backend.services',
	'ngCordova',
	'ui.router',
	'ngIOS9UIWebViewPatch',
	'uiGmapgoogle-maps',
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
	'TutorialCtrl',
	'NotificationsCtrl'
])

// This runs when the application is started.
.run(function(
	$window,
	$ionicPlatform,
	$ionicPopup,
	$cordovaDialogs,
	$cordovaNetwork,
	$rootScope,
	$cordovaSplashscreen,
	$state,
	$ionicSideMenuDelegate,
	$ionicLoading,
	Requests
) {




	$ionicPlatform.ready(function() {

		var isIOS = ionic.Platform.isIOS();
		var isAndroid = ionic.Platform.isAndroid();


		$rootScope.popUp = function(title, msg) {
			var confirmPopup = $ionicPopup.confirm({
			cssClass: 'popUp',
	     	title: title ,
	     	template: msg ,
	     	cancelText: 'Lukk app',
	     	okText: 'Prøv igjen'
	   		});
	   		$ionicLoading.hide();

	   		confirmPopup.then(function(res) {
				console.log('Buttonres: '+ res);
			    if(res) {
			    	if ($cordovaNetwork.isOnline()) {
						$state.go($state.current, {}, {reload: true});
			    	}
			    	else {
			    		$rootScope.popUp(title, msg);
			    	}
		     	} else {
		    	   console.log('You are closing the app');
		    	   ionic.Platform.exitApp();
		     	}
		   	});
		}


		$rootScope.showAlert = function(title, msg) {
			var alertPopup = $ionicPopup.alert({
				cssClass: 'alertPopup',
				title: title,
				template: msg
			});
			alertPopup.then(function(response) {
				//Do something when closing the alert box
				console.log('closing the alert box');
			});
		};

		$rootScope.toggleMenu = function() {
	    	$ionicSideMenuDelegate.toggleLeft();
		};


		// Tells the back-end that the app has been started.
		Requests.opensApp($window.localStorage.getItem('userId'));

		// Lock orientation on ios.
		if(isIOS) {
			screen.lockOrientation('portrait');
		}

		// Uses ionic k)eyboard plugin
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the keyboard accessory bar by default (on the top of the keyboard when filling in form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Avoids content being pushed up when focusing on inputs below the keyboard.
			if(isAndroid) {
				cordova.plugins.Keyboard.disableScroll(true);
			} else if(isIOS) {
				cordova.plugins.Keyboard.disableScroll(false);
			}
		}
		// Uses cordova statusbar plugin
		if (window.StatusBar) {
			StatusBar.styleBlackTranslucent(); // Light background, black text
			StatusBar.hide();
		}

		// Checks for an internet connection. Uses the ngCordova plugin called $cordovaNetwork
		if (window.Connection) {
			// Checks if offline when app is started
			if ($cordovaNetwork.isOffline()) {
				console.log('Først If');
				$rootScope.popUp("Ingen nettilgang", "Applikasjonen trenger en internettforbindelse for å virke");
			}

			else {
					// Listen for Offline event
				$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
					$rootScope.networkAccess = true;
					console.log('Cordova network online');
				})

					// Listen for Offline event
				$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
					console.log('Cordova network offiline');

					$rootScope.popUp("Ingen nettilgang", "Applikasjonen trenger en internettforbindelse for å virke");
					$rootScope.networkAccess = false;

				})
				//STATECHECK HERE!!
				// Decides which view to go to first:
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
			}
		}


			// TODO: STATECHECK Denne blocken tom. cordovaSplashscreen.hide() inne i else blocken over i build

		$cordovaSplashscreen.hide();
		//STATECHECK HERE!!

	  // Tells back-end that the app has been opened again after having been paused.
	  $ionicPlatform.on('resume', function() {
	    Requests.opensApp($window.localStorage.getItem('userId'));
	  });
	  // Tells back-end that the app has been paused
	  $ionicPlatform.on('pause', function() {
	    Requests.closesApp($window.localStorage.getItem('userId'));
	  });

	});
})

	// Defines the different states of the app and the templates and controllers that are associated to them.
.config(function(
	$stateProvider,
	$urlRouterProvider,
	$sceDelegateProvider,
	$ionicConfigProvider
	) {

	$ionicConfigProvider.backButton.text('Tilbake'); // Changes the default text of the back button to Norwegian "Tilbake".
	$ionicConfigProvider.backButton.previousTitleText(false);
	$ionicConfigProvider.backButton.icon("ion-ios-arrow-back"); //Sets the icon for to use for back

	$stateProvider

	.state('app', {
		url: "/app",
		abstract: false,
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

// Tutorial accessed through settings
	.state('app.appOne', {
		url: "/appOne",
		views: {
		'menuContent': {
				templateUrl: "templates/appOne.html",
				controller: 'TutorialCtrl'
			}
		}
	})

	.state('app.appTwo', {
		url: "/appTwo",
		views: {
			'menuContent': {
				templateUrl: "templates/appTwo.html",
				controller: 'TutorialCtrl'
			}
		}
	})

	.state('app.appTree', {
		url: "/appTree",
		views: {
			'menuContent': {
				templateUrl: "templates/appTree.html",
				controller: 'TutorialCtrl'
			}
		}
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

	.state('app.acknowledgment', {
		url: "/acknowledgment",
		views: {
			'menuContent': {
				templateUrl: "templates/acknowledgment.html",
				controller: "MenuCtrl"
			}
		}
	})

	.state('app.about', {
		url: "/about",
		views: {
			'menuContent': {
				templateUrl: "templates/about.html",
				controller: "MenuCtrl"
			}
		}
	})

	.state('app.notificationView', {
		url: "/notificationView",
		views: {
			'menuContent': {
				templateUrl: "templates/notificationView.html",
				controller: 'NotificationsCtrl'
			}
		}
	});

	// If app is not started before go to onboardOne
	// already logged in, go to recommendation view, otherwise go to login.
	/*$urlRouterProvider.otherwise('/onboardOne');*/

});
