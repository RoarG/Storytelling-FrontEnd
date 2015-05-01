
  ////////////////////////
  // 	Onboarding
  ////////////////////////


angular.module('IntroCtrl', [])

stories.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
	

	$scope.startApp = function () {
	  $state.go('login');
	   window.localStorage.didTutorial = 'true';
	};

	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	   window.localStorage.didTutorial = 'true';
	};

	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

	$scope.goLogin = function () {
		$state.go('login');
	}	

	if(window.localStorage['userId'] !== undefined && window.localStorage['userId'] !== "-1") {
	//	$scope.recommendedView();
		$scope.startApp();
	} 

	else if (window.localStorage.didTutorial === 'true' && window.localStorage['userId'] === undefined) {
		$scope.startApp();
	} 

	else {
		console.log("Need to do login");
	}

})






