////////////////////////
//  List
////////////////////////

angular.module('RecomdCtrl', [])

stories.controller('RecomdCtrl', function($scope, Requests, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory) {

	var storyPreviews = [];
	/*Used to know which of the stories in this list of recommendations that have been recommended
  	Used to avoid storing a story as recommended multiple times for one list of recommendations*/
	var recommendArray = [];
	$scope.userId = window.localStorage['userId'];

	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		$ionicSideMenuDelegate.canDragContent(false);
	});


	Requests.getRecommendedStories($scope.userId).then(function(response) {
		$scope.storyPreviews = response.data;
		/*Set the first story as recommended*/
		Requests.recommendedStory($scope.userId, $scope.storyPreviews[0].id);
		recommendArray.push($scope.storyPreviews[0].id);
		Requests.setSelectedStory($scope.storyPreviews[0].id);
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
		if (index == $scope.storyPreviews.length - 1) {
			$ionicSlideBoxDelegate.previous();
		} else {
			$ionicSlideBoxDelegate.next();
		}
		// Wait 500 seconds so it slides to another slide before deleting current slide. 
		$timeout(function() {
			if (index < $scope.storyPreviews.length - 1) {
				$ionicSlideBoxDelegate.previous();
			}
			$scope.storyPreviews.splice(index, 1);
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
		//TODO: Record swiped_past for the slide we came from?
		/*Only want to set a story as recommended one time for each list of recommendations*/
		if (recommendArray.indexOf($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id) == -1) {
			Requests.recommendedStory($scope.userId, $scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
			recommendArray.push($scope.stories[$ionicSlideBoxDelegate.currentIndex()].storyId);
		}
		$ionicSlideBoxDelegate.update();
		Requests.setSelectedStory($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	};

	$scope.openStory = function(story) {
		$ionicLoading.show({
      		template: '<h2>Laster inn historie</h2><div class="icon ion-loading-a"></div>',
    		noBackdrop: false
	    });
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