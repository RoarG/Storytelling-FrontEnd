
  ////////////////////////
  // 	App 1-2-3
  ////////////////////////

//module to controll the Tutorial and onboarding section of the application

angular.module('TutorialCtrl', [])

stories.controller('TutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate, $window) {


	/**
	* A simple state change to go to the recommendations view
	*/
	$scope.recommendedView = function () {
	  $state.go('app.recommendations');
	};

	
	/**
	* A simple state change to go to the Tutorial page 2 view
	*/
	$scope.goAppTwo = function () {
		$state.go('app.appTwo');		
	}	

	/**
	* A simple state change to go to the Tutorial page 3 view
	*/
	$scope.goAppTree = function () {
		$state.go('app.appTree');
	}	
	
	/**
	* A simple state change to go to the Tutorial page 1 view
	*/
	$scope.goOnboardOne = function () {
		$state.go('onboardOne');
	}	

	/**
	* A simple state change to go to the Tutorial page 2 view
	*/
	$scope.goOnboardTwo = function () {
		$state.go('onboardTwo');
	}	

	/**
	* A simple state change to go to the Tutorial page 3 view
	*/
	$scope.goOnboardTree = function () {
		$state.go('onboardTree');
	}	

});