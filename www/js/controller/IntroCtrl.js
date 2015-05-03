
  ////////////////////////
  // 	Onboarding
  ////////////////////////

//TODO: FOrklar!

angular.module('IntroCtrl', [])

stories.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window) {
	
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

	//TODO: FOrklar
	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
		$window.localStorage.setItem('didTutorial', true);
		console.log("ELSE $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	}	

	//TODO: Forklar
	$scope.goLogin = function () {
		$state.go('login');
		$window.localStorage.setItem('didTutorial', true);
		console.log("ELSE $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	}	

	//TODO: Forklar
	if($window.localStorage.getItem('userId') !== undefined && $window.localStorage.getItem('userId') !== "-1" && $window.localStorage.getItem('userId') !== null) {
		$scope.recommendedView();
		console.log("IF $window.localStorage.getItem('userId')" + $window.localStorage.getItem('userId'));
		console.log("IF $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	} 

	//TODO: Forklar
	else if ($window.localStorage.getItem('didTutorial') === true && $window.localStorage.getItem('userId') === undefined) {
		$scope.startApp();
		console.log("ELSE $window.localStorage.getItem('userId')" + $window.localStorage.getItem('userId'));
		console.log("ELSE $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	} 

	//TODO: Forklar
	else {
		console.log("Need to do login");
		console.log("NEED $window.localStorage.getItem('userId')" + $window.localStorage.getItem('userId'));
		console.log("NEES $window.localStorage.getItem('didTutorial')" + $window.localStorage.getItem('didTutorial'));
	}

})






