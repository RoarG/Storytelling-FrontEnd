
  ////////////////////////
  // 	Onboarding
  ////////////////////////

// Controller that handles the onboarding views. 

angular.module('IntroCtrl', [])

stories.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window, $cordovaSplashscreen) {


	// Go to recommendation view  
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	  $window.localStorage.setItem('didTutorial', true);
	};

	$scope.goOnboardOne = function () {
		$state.go('onboardOne');
	}	
	
	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

	// Go to login view. Remember that the user has gone through the tutorial. 
	$scope.goLogin = function () {
		$state.go('login');
		$window.localStorage.setItem('didTutorial', true);
	}	


})






