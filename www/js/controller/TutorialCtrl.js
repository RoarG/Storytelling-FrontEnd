
  ////////////////////////
  // 	App 1-2-3
  ////////////////////////

//TODO: FOrklar!

angular.module('TutorialCtrl', [])

stories.controller('TutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window) {

	//TODO: Forklar
	$scope.startApp = function () {
	  $state.go('recommendedView');
	};

	//TODO: Forklar
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	};

	//TODO: Forklar
	$scope.goAppTwo = function () {
		$state.go('appTwo');
		
		console.log("TEST sad")
	}	

	//TODO: FOrklar
	$scope.goAppTree = function () {
		$state.go('appTree');
		console.log("TEST sadasd ")
	}	
});