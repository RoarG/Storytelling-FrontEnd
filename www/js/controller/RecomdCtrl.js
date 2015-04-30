////////////////////////
//  List
////////////////////////

angular.module('RecomdCtrl', [])

stories.controller('RecomdCtrl', function($scope, Requests, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory) {

	var storyPreviews = [];
	$scope.stories = [];
	$scope.userId = window.localStorage['userId'];

	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		$ionicSideMenuDelegate.canDragContent(false);
	});

	//Display loading screen
	$ionicLoading.show({
		template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
		noBackdrop: false
	});

	Requests.getMultipleStories($scope.userId).then(function(response) {
		$scope.storyPreviews = response.data;
		console.log("Første id (sjekk at den stemmer med første item i lista overnfor): " + $scope.storyPreviews[0].id);
		return Requests.getStory($scope.storyPreviews[0].id, $scope.userId);
	}).then(function(story) {
		$scope.stories.push(new Story(story.data));
		return Requests.getStory($scope.storyPreviews[1].id, $scope.userId);
	}).then(function(story) {
		$scope.stories.push(new Story(story.data));
		return Requests.getStory($scope.storyPreviews[2].id, $scope.userId);
	}).then(function(story) {
		$scope.stories.push(new Story(story.data));
		Requests.setSelectedStory($scope.stories[0]);
		$ionicSlideBoxDelegate.update();
		$ionicLoading.hide();
	});



	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.previousSlide = function() {
		$ionicSlideBoxDelegate.previous();
	};

	$scope.rejectStory = function(index) {
		// If it is the last slide, go back to previous slide. Otherwise, next slide. 
		if (index == $scope.stories.length - 1) {
			$ionicSlideBoxDelegate.previous();
		} else {
			$ionicSlideBoxDelegate.next();
		}
		// Wait 500 seconds so it slides to another slide before deleting current slide. 
		$timeout(function() {
			if (index < $scope.stories.length - 1) {
				$ionicSlideBoxDelegate.previous();
			}
			$scope.stories.splice(index, 1);
			// Necessary to update slides:
			$ionicSlideBoxDelegate._instances[0].kill();
			$ionicSlideBoxDelegate.update();
		}, 500);
	};

	/*
	  Runs when going to next/previous slide (and when a slide is changed?)
	  Set the story in current slide as the current story. 
	 */
	$scope.slideChanged = function() {
		$ionicSlideBoxDelegate.update();
		Requests.setSelectedStory($scope.stories[$ionicSlideBoxDelegate.currentIndex()]);
	};

	$scope.openStory = function(story) {
		//Requests.setSelectedStory(story.storyId);
		$state.go("app.story");
	};

	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove();
	};

	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicSlideBoxDelegate.update();
	});

})