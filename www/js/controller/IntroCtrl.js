
  ////////////////////////
  // 	Onboarding
  ////////////////////////

//TODO: FOrklar!

angular.module('IntroCtrl', [])

stories.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window) {
	
	//TODO: Forklar
	$scope.startApp = function () {
	  $state.go('login');
	   window.localStorage.didTutorial = 'true';
	};

	//TODO: Forklar
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	   window.localStorage.didTutorial = 'true';
	};

	//TODO: Forklar
	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	//TODO: FOrklar
	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

	//TODO: Forklar
	$scope.goLogin = function () {
		$state.go('login');
	}	

	//TODO: Forklar
	if($window.localStorage.getItem('userId') !== undefined && $window.localStorage.getItem('userId') !== "-1") {
		$scope.recommendedView();
		$scope.startApp();
	} 

	//TODO: Forklar
	else if (window.localStorage.didTutorial === 'true' && $window.localStorage.getItem('userId') === undefined) {
		$scope.startApp();
	} 

	//TODO: Forklar
	else {
		console.log("Need to do login");
	}

})






