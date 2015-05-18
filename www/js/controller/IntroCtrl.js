
  ////////////////////////
  // 	Onboarding
  ////////////////////////

//TODO: FOrklar!

angular.module('IntroCtrl', [])

stories.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window, $cordovaSplashscreen) {


	//TODO: Forklar
	$scope.startApp = function () {
	  $state.go('login');
	};

	//TODO: Forklar
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	  $window.localStorage.setItem('didTutorial', true);
	  console.log("ELSE $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	};

	//TODO: Forklar
	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	$scope.goOnboardOne = function () {
		$state.go('onboardOne');
	}	

	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

	//TODO: Forklar
	$scope.goLogin = function () {
		$state.go('login');
		$window.localStorage.setItem('didTutorial', true);
		console.log("ELSE $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	}	



})






