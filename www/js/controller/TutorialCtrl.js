
  ////////////////////////
  // 	App 1-2-3
  ////////////////////////

//TODO: FOrklar!

angular.module('TutorialCtrl', [])

stories.controller('TutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window) {


	//TODO: Forklar
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	};

	//TODO: Forklar
	$scope.goAppTwo = function () {
		$state.go('appTwo');		
	}	

	//TODO: FOrklar
	$scope.goAppTree = function () {
		$state.go('appTree');
		console.log("TEST sadasd ")
	}	

		//TODO: Forklar
	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	$scope.goOnboardOne = function () {
		$state.go('onboardOne');
	}	

	//TODO: FOrklar
	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

});