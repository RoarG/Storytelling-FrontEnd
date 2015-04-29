
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


	if (window.localStorage.didTutorial === 'true') {
		$scope.startApp();
	} else {
		console.log("Need to do login");
	}


})






