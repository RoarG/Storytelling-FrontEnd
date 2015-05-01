////////////////////////
//  List
////////////////////////

angular.module('RecomdCtrl', [])

//TODO: Forklar!

stories.controller('RecomdCtrl', function($scope, Requests, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory, $window) {

	$scope.storyPreviews = [];
	/*Used to know which of the stories in this list of recommendations that have been recommended
  	Used to avoid storing a story as recommended multiple times for one list of recommendations*/
	$scope.recommendArray = [];
	$scope.userId = $window.localStorage.getItem('userId');

	$scope.$on('$ionicView.enter', function() {
		$ionicHistory.clearHistory();
		$ionicSideMenuDelegate.canDragContent(false);
	});

	//TODO: Forklar!
	Requests.getRecommendedStories($scope.userId).then(function(response) {
		$scope.storyPreviews = response.data;
		console.log($scope.storyPreviews);
		/*Set the first story as recommended*/
		Requests.recommendedStory($scope.userId, $scope.storyPreviews[0].id);
		$scope.recommendArray.push($scope.storyPreviews[0].id);
		Requests.setSelectedStory($scope.storyPreviews[0].id);
		$ionicSlideBoxDelegate.update();
		$ionicLoading.hide();
	}, function(response) {
    		console.log(response.status);
  	});


	//TODO: Forklar!
	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	};

	//TODO: Forklar!
	$scope.previousSlide = function() {
		$ionicSlideBoxDelegate.previous();
	};

	//TODO: Forklar!
	$scope.rejectStory = function(index) {
		// If it is the last slide, go back to previous slide. Otherwise, next slide. 
		if (index == $scope.storyPreviews.length - 1) {
			$ionicSlideBoxDelegate.previous();
		} else {
			$ionicSlideBoxDelegate.next();
		}
		// Wait 500 milliseconds so it slides to another slide before deleting current slide. 
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
	 //TODO: Forklar! Del opp
	$scope.slideChanged = function() {
		Requests.setSelectedStory($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	    //TODO: Record swiped_past for the slide we came from?
	    /*Only want to set a story as recommended one time for each list of recommendations*/
	    if($scope.recommendArray.indexOf($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id) == -1){
	      Requests.recommendedStory($scope.userId, $scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	      $scope.recommendArray.push($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	    }
	    if($ionicSlideBoxDelegate.currentIndex() === $scope.storyPreviews.length-3) {
	      Requests.getRecommendedStories($scope.userId).success(function(data, status) {
	        $scope.storyPreviews = $scope.storyPreviews.concat(data);
	        $timeout(function() {
	          console.log($scope.storyPreviews);
	          $ionicSlideBoxDelegate.update();
	        }, 100);
	      }).error(function(data, status) {
	          console.log(status);
	      });
	    }
    };

    //TODO: Forklar!
	$scope.openStory = function(story) {
		$ionicLoading.show({
      		template: '<h2>Laster inn historie</h2><div class="icon ion-loading-a"></div>',
    		noBackdrop: false
	    });
	    console.log(Requests.getSelectedStory());
		$state.go("app.story");
	};

	//TODO: Forklar!
	$scope.openStoryLink = function(storyId) {
	    $ionicLoading.show({
	      template: '<h2>Laster inn historie</h2><div class="icon ion-loading-a"></div>',
	      noBackdrop: false
	    });
	    Requests.setSelectedStory(storyId);
	    $state.go("app.story");
  	};

  	//TODO: Forklar!
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

	//TODO: Forklar!
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicSlideBoxDelegate.update();
	});

})