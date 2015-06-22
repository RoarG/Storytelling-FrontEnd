////////////////////////
//  List
////////////////////////

// Controller for the browsing of recommended stories. 

angular.module('RecomdCtrl', [])


stories.controller('RecomdCtrl', function(
	$window,
	$rootScope,
	$scope, 
	$animate, 
	$ionicSlideBoxDelegate, 
	$ionicModal, 
	$ionicLoading, 
	$state, 
	$ionicSideMenuDelegate, 
	$timeout, 
	$ionicHistory, 
	$cordovaDialogs,
	Requests, 
	Story 
) {

	$scope.storyPreviews = [];
	$scope.currentSlideIndex = 0;

	/*Used to know which of the stories in this list of recommendations that have been recommended,
  	and avoid storing a story as recommended multiple times for one list of recommendations*/
	$scope.recommendArray = [];

	$scope.userId = $window.localStorage.getItem('userId');


	StatusBar.show();
	
	//Trying to disable animate on the slidebox element
	/*console.log('SlideBox: ' + document.getElementById("slideBox"));
	console.log('SlideBox: ' + $animate.enabled());
	var element = document.getElementById("slideBox");
	
	console.log('SlideBox: ' + $animate.enabled());*/
	$animate.enabled(false);


	$scope.$on('$ionicView.enter', function() {
		$ionicLoading.show({
	        template: '<h2>Laster inn...</h2>',
	    });
		// Required to avoid buggy behavior of the slides when coming back to the view. 
		$ionicHistory.clearHistory(); 
		// Disable dragging of menu, as it can interfere with swiping of stories. 
		$ionicSideMenuDelegate.canDragContent(false); 

		$ionicLoading.hide();
		
		//$scope.refreshRecommendations();
	});


/*
	// Get array of recommended stories. 
	Requests.getRecommendedStories($scope.userId).then(function(response) {
		$scope.storyPreviews = response.data;

		// Make sure that no more than 4 categories are displayed on each story. 
		for(var i = 0; i < $scope.storyPreviews.length; i++) {
			$scope.storyPreviews[i].categories = $scope.storyPreviews[i].categories.slice(0,4);
		}

		//Set the first story as recommended
		Requests.recommendedStory($scope.userId, $scope.storyPreviews[0].id);
		$scope.recommendArray.push($scope.storyPreviews[0].id);

		// Set the first story as the selected one. 
		Requests.setSelectedStory($scope.storyPreviews[0].id);

		// Update slidebox: necessary because of the new content. 
		$ionicSlideBoxDelegate.update();

		$ionicLoading.hide();
	}, function(response) {
		$cordovaDialogs.alert("Får ikke tak i historier");
  	});
*/

	$scope.refreshRecommendations = function() {
		$scope.storyPreviews = [];
		
		$scope.currentlyLoading = true;

		// Get array of recommended stories. 
		Requests.getRecommendedStories($scope.userId).then(function(response) {
			$timeout(function() {
			$scope.currentSlideIndex = 0;
			$scope.storyPreviews = response.data;
			$scope.recommendArray = [];
			// Make sure that no more than 4 categories are displayed on each story. 
			for(var i = 0; i < $scope.storyPreviews.length; i++) {
				$scope.storyPreviews[i].categories = $scope.storyPreviews[i].categories.slice(0,4);
			}

			//Set the first story as recommended
			Requests.recommendedStory($scope.userId, $scope.storyPreviews[0].id);
			$scope.recommendArray.push($scope.storyPreviews[0].id);

			// Set the first story as the selected one. 
			Requests.setSelectedStory($scope.storyPreviews[0].id);

			// Update slidebox: necessary because of the new content.
			$ionicSlideBoxDelegate.slide(0); 
			$ionicSlideBoxDelegate.update();

			
			$scope.currentlyLoading = false;
			}, 1000);
			
		}, function(response) {
				if ($rootScope.networkAccess) {
					$rootScope.popUp("Server problemer", "Prøv igjen nå eller senere" );
				}
				else {
					$rootScope.popUp("Ingen nettilgang", "Appliksjonen trenger en internett forbindelse for å virke");
				}
	  		}
	  	);

	  	$ionicSlideBoxDelegate.update();
	}

	// Go to next slide in slidebox. 
	$scope.nextSlide = function() {
		Requests.swipedPastStory($scope.userId, $scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
		$ionicSlideBoxDelegate.next();
	};

	// Go to previous slide in slidebox. 
	$scope.previousSlide = function() {
		Requests.swipedPastStory($scope.userId, $scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
		$ionicSlideBoxDelegate.previous();
	};

	// Remove story from slidebox and set story as rejected. 
	// Currently works in browser, but not on Android/iOS. 
	$scope.rejectStory = function(index) {

		$ionicLoading.show({
	        template: '<h2>Fortellingen er fjernet fra dine anbefalinger</h2>',
	        duration: 1800
	    });
		
		Requests.rejectStory($scope.userId, $scope.storyPreviews[index].id);

		// If it is the last slide, go back to previous slide. Otherwise, next slide. 
		$scope.storyPreviews.splice(index, 1);
		$ionicSlideBoxDelegate.update();
		if($scope.currentSlideIndex == $scope.storyPreviews.length) {
			$ionicSlideBoxDelegate.slide($scope.storyPreviews.length-1);
		}

		
	/**
	 * Commented out: created a visual bug. 
	 */
		// if (index == $scope.storyPreviews.length - 1) {
		// 	$ionicSlideBoxDelegate.previous();
		// } else {
		// 	$ionicSlideBoxDelegate.next();
		// }
		// Wait 500 milliseconds so it slides to another slide before deleting current slide. 
		// $timeout(function() {
		// 	if (index < $scope.storyPreviews.length - 1) {
		// 	//$ionicSlideBoxDelegate.slide(index+1);
		// 	}
		// 	// Necessary to update slides:
		// 	// $ionicSlideBoxDelegate._instances[0].kill();
		// }, 500);
	};

	 // Runs when going to next/previous slide
	 // Set the story in current slide as recommended, and as the current story. 
	$scope.slideChanged = function() {
		$scope.currentSlideIndex = $ionicSlideBoxDelegate.currentIndex();
		Requests.setSelectedStory($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	    
	    //Only want to set a story as recommended one time for each list of recommendations
	    if($scope.recommendArray.indexOf($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id) == -1){
	      Requests.recommendedStory($scope.userId, $scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	      $scope.recommendArray.push($scope.storyPreviews[$ionicSlideBoxDelegate.currentIndex()].id);
	    }

	    /*
	    // If the user is getting to the end of the array of slides, then get more recommendations. 
	    // Currently it gets more recommendations when there are three slides left, so that the user does not have to wait for it to load. 
	    if($ionicSlideBoxDelegate.currentIndex() === $scope.storyPreviews.length-4) {
	      Requests.getMoreRecommendedStories($scope.userId).success(function(data, status) {
	        $scope.storyPreviews = $scope.storyPreviews.concat(data);
	        $timeout(function() {
	          $ionicSlideBoxDelegate.update();
	        }, 100);
	      }).error(function(data, status) {
	          $cordovaDialogs.alert("Får ikke tak i flere anbefalinger");
	      });
	    }*/
    };

    // Sets the story as selected, and goes to story view. 
	$scope.openStory = function(story) {
		$ionicLoading.show({
      		template: '<h2>Laster inn historie</h2><div class="icon ion-loading-a"></div>',
    		noBackdrop: false
	    });
	    Requests.setSelectedStory(story.id);
		$state.go("app.story");
	};

	// Opens story by storyId. Used by the story links in the recommendation explanation. 
	$scope.openStoryLink = function(storyId) {
	    $ionicLoading.show({
	      template: '<h2>Laster inn historie</h2><div class="icon ion-loading-a"></div>',
	      noBackdrop: false
	    });
	    Requests.setSelectedStory(storyId);
	    $state.go("app.story");
  	};

  	// Displays the modal specified in templateUrl. 
	$scope.showModal = function(templateUrl) {
		if(templateUrl == "templates/bookmark-modal.html" && $scope.storyPreviews.length == 0) {
			return;
		}
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

	// Update slidebox when entering view. 
	$scope.$on('$ionicView.beforeEnter', function() {
		$ionicSlideBoxDelegate.update();
	});

})