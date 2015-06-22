////////////////////////
//  ListView 
////////////////////////

// Controller which handles lists of bookmarks

angular.module('ListViewCtrl', [])

stories.controller('ListViewCtrl', function(
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

	//$animate.enabled(true);

	$scope.chosenCategory = "Filter";

	$scope.tag = Requests.getSelectedTag();

	$scope.categorynames = [
		"Kunst",
		"Arkitektur",
		"Arkeologi",
		"Historie",
		"Tradisjon",
		"Natur",
		"Litteratur",
		"Musikk",
		"Teknologi"
	]

	//For Requests
	$scope.currentOffset = 0;
	$scope.currentSortOrder = 'DESC';
	$scope.currentSortBy = 'insertion_time';
	$scope.filterByCat = 0;

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
	Requests.getStoryList(
		$scope.tag,
		$window.localStorage.getItem('userId'),
		$scope.currentOffset,
		$scope.currentSortOrder,
		$scope.currentSortBy,
		$scope.filterByCat
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
		Requests.getStoryList(
			$scope.tag,
			$window.localStorage.getItem('userId'),
			$scope.currentOffset += 20,
			$scope.currentSortOrder,
			$scope.currentSortBy,
			$scope.filterByCat
		).success(function(data, status) {
			$scope.storyPreviewsNext = data;
			if ($scope.storyPreviewsNext.length == 0) {
				$scope.isMore = false;
				console.log('next 0  :' + $scope.currentOffset);
			} else if ($scope.storyPreviewsNext.length < 20) {
				$scope.arrayEnd = true;
				$scope.isMore = true;
				console.log('next < 20  :' + $scope.currentOffset);
			} else if ($scope.storyPreviewsNext.length = 20) {
				$scope.isMore = true;
				console.log('next 20   :' + $scope.currentOffset);
				//TODO: EVEN MORE 
			}

		}).error(function(data, status) {
			console.log('respons: ' + data + status);
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


	// Remove a story from the listview
	$scope.remove = function(story, event) {
		$ionicPlatform.ready(function() {
			var confirmPopup = $ionicPopup.confirm({
				cssClass: 'popUp',
				title: 'Fjern fortelling',
				template: 'Er du sikker på at du vil fjerne denne fortellingen?',
				cancelText: 'Avbryt',
				okText: 'OK'
			});

			confirmPopup.then(function(res) {
				if (res) {
					//Removing Story form backend
					Requests.removeTagStory(Requests.getSelectedTag(), $window.localStorage.getItem('userId'), story.id)
						.then(function(response) {
							//Removing Story from view
							var index = $scope.storyPreviews.indexOf(story);
							$scope.storyPreviews.splice(index, 1);
						});
				} else {
					console.log('Noe gikk galt');
					//TODO: Call the error popup
				}
			});
			event.preventDefault();
			event.stopPropagation();
		});


	};

	/**
	 * Askes backend for a new array of stories 
	 * @return {[array]} [array of stories]
	 */
	$scope.updateStoryList = function() {
		Requests.getStoryList(
			$scope.tag,
			$window.localStorage.getItem('userId'),
			$scope.currentOffset,
			$scope.currentSortOrder,
			$scope.currentSortBy,
			$scope.filterByCat
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

	/**
	 * Sorts the list according to date or rating and in a decending or acending order
	 * @param  {[string]} sortProperty [DESC or ASC]
	 * @return {[void]}              [Updates the list]
	 */
	$scope.sortStories = function(sortProperty) {
		$scope.currentOffset = 0;

		if (sortProperty == $scope.currentSortBy) {

			if ($scope.currentSortOrder == 'DESC') {
				$scope.currentSortOrder = 'ASC';
				$scope.updateStoryList();
			} else {
				$scope.currentSortOrder = 'DESC';
				$scope.updateStoryList();
			}
		} else if (sortProperty != $scope.currentSortBy) {
			$scope.currentSortBy = sortProperty;
			$scope.currentSortOrder = 'DESC';
			$scope.updateStoryList();
		} else {

			if ($scope.currentSortOrder == 'DESC') {
				$scope.currentSortOrder = 'ASC';
				$scope.updateStoryList();
			} else {
				$scope.currentSortOrder = 'DESC';
				$scope.updateStoryList();
			}
		}
		console.log("Sorting stories by: " + $scope.currentSortBy + " Sort order: " + $scope.currentSortOrder);
	}

	/**
	 * Set the userinput and updates the list with a given category
	 * @param  {[int]} category [denotes which category to filter on. 1-9 for a category, 0 for no category selected.]
	 * @return {[void]}          []
	 */
	$scope.filterByCategory = function(category) {

		$scope.filterByCat = category;
		$scope.currentOffset = 0;

		console.log('Category' + $scope.filterByCat);
		console.log('Category' + category);

		$scope.updateStoryList();

		$scope.modal.hide();

		if (category == 0) {
			$scope.chosenCategory = "Kategori";
		} else {
			$scope.chosenCategory = $scope.categorynames[category - 1];
		}
	}

	// Displays the modal specified in templateUrl.
	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

})
