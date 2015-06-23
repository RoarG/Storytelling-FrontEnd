////////////////////////
//  ListView 
////////////////////////

// Controller which handles lists of bookmarks

angular.module('NotificationsCtrl', [])

stories.controller('NotificationsCtrl', function(
	$window,
	$scope,
	$state,
	$rootScope,
	$ionicLoading,
	$cordovaDialogs,
	$animate,
	$ionicPlatform,
	$ionicModal,
	$filter,
	$ionicPopup,
	Story,
	Requests
) {



	//For Requests
	$scope.currentOffset = 0;

	//For array
	$scope.isMore = false;
	$scope.arrayEnd = false;

	//For Icons
	$scope.gettingMore = false;

	/*Get all stories that a user has connected to tagName
	* Parameters for sorting:
		offset: denotes which row is the first row to be returned. 
				Use 0 to start from the first row, 20 to start from the twenty-first row.
		order: 'DESC' for largest first, 'ASC' for smallest first.
		sortby: 'insertion_time' for sorting by date, 'rating' for sorting by rating.
		category: denotes which category to filter on. 1-9 for a category, 0 for no category selected.
	*/
	// Retrieve stories associated with selected tag, so that they can be displayed
	Requests.getNotifications(
		$window.localStorage.getItem('userId'),
		$scope.currentOffset
	).success(function(data, status) {
		//Display loading screen
		$ionicLoading.show({
			template: '<h2>Laster inn...</h2><div class="icon ion-loading-a"></div>',
			noBackdrop: false
		});
		$scope.storyPreviews = data;

		$ionicLoading.hide();

		for (var i = 0; i < $scope.storyPreviews.length; i++) {
			if ($scope.storyPreviews[i].rating == null) {
				$scope.storyPreviews[i].rating = 0;
			}
		}

		//Sjekk if there is more in the list and cache them
		$scope.getNext()
			//TODO: Legg til see more knapp her hvis det er flere som kan bes om.

	}).error(function(data, status) {
		console.log('respons: ' + data + status);
		$cordovaDialogs.alert("Får ikke svar fra server.");
	});

	/**
	 * Looks at the next 20 stories for the see more button 
	 * @return {[array]} [array with story objects]
	 */
	$scope.getNext = function() {
		Requests.getNotifications(
			$window.localStorage.getItem('userId'),
			$scope.currentOffset += 20
		).success(function(data, status) {
			$scope.storyPreviewsNext = data;
			if ($scope.storyPreviewsNext.length == 0) {
				$scope.isMore = false;
			} else if ($scope.storyPreviewsNext.length < 20) {
				$scope.arrayEnd = true;
				$scope.isMore = true;
			} else if ($scope.storyPreviewsNext.length = 20) {
				$scope.isMore = true;
				//TODO: EVEN MORE 
			}

		}).error(function(data, status) {
			$cordovaDialogs.alert("Får ikke svar fra server.");
		});
	}

	/**
	 * Concats the array recived form getNext() onto the orginal list array and controls gettingMore var to change the icon
	 * @return {[void]} [Sets the ]
	 */
	$scope.seeMore = function() {
		$scope.gettingMore = true;
		setTimeout(function() {
			$scope.gettingMore = false
			$scope.storyPreviews = $scope.storyPreviews.concat($scope.storyPreviewsNext);
			$scope.getNext();
		}, 800);
	}


	

	/**
	 * Askes backend for a new array of stories 
	 * @return {[array]} [array of stories]
	 */
	$scope.updateStoryList = function() {
		Requests.getNotifications(
			$window.localStorage.getItem('userId'),
			$scope.currentOffset
		).success(function(data, status) {

			$scope.storyPreviews = data;
			$scope.getNext();

			console.log('$scope.storyPreviews : ' + $scope.storyPreviews);

			for (var i = 0; i < $scope.storyPreviews.length; i++) {
				if ($scope.storyPreviews[i].rating == null) {
					$scope.storyPreviews[i].rating = 0;
				}
			}
		}).error(function(data, status) {
			console.log('respons: ' + data + status);
			$cordovaDialogs.alert("Får ikke svar fra server.");
		});
	}

	// Opens the selected story. 
	$scope.open = function(story) {
		$ionicLoading.show({
			template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
			noBackdrop: false
		});

		Requests.setSelectedStory(story.id);
		$state.go("app.story");

	};



})
