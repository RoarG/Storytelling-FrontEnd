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
	$ionicPopover,
	$filter,
	$ionicPopup,
	Story,
	Requests
) {

	$animate.enabled(true);

	$scope.chosenCategory = "Kategori";

	$scope.tag = Requests.getSelectedTag();

	$scope.categorynames = ["Kunst", "Arkitektur", "Arkeologi", "Historie", "Tradisjon", "Natur", "Litteratur", "Musikk", "Teknologi"]

	$scope.$on('$ionicView.enter', function() {
		// Retrieve stories associated with selected tag, so that they can be displayed
		Requests.getStoryList($scope.tag, $window.localStorage.getItem('userId')).success(function(data, status) {
			//Display loading screen
			$ionicLoading.show({
				template: '<h2>Laster inn...</h2><div class="icon ion-loading-a"></div>',
				noBackdrop: false
			});
			$scope.storyPreviews = data;
			$scope.storyPreviewsOriginal = data.slice(0);
			$ionicLoading.hide();

			for (var i = 0; i < $scope.storyPreviews.length; i++) {
				if ($scope.storyPreviews[i].rating == null) {
					$scope.storyPreviews[i].rating = 0;
				}
			}

			if ($scope.chosenCategory && $scope.chosenCategory != "Kategori") {
				console.log($scope.chosenCategory);
				$scope.filterByCategory($scope.categorynames.indexOf($scope.chosenCategory) + 1);
			}

			if ($scope.currentSortProperty) {
				if ($scope.currentSortProperty.indexOf("Inverse") != -1) {
					$scope.currentSortProperty = $scope.currentSortProperty.substring(0, $scope.currentSortProperty.length - 7);
					$scope.sortStories($scope.currentSortProperty);
				} else {
					var tempSortProperty = $scope.currentSortProperty;
					$scope.currentSortProperty = $scope.currentSortProperty + "Inverse";
					$scope.sortStories(tempSortProperty);
				}
			} else {
				$scope.sortStories("date");
			}

		}).error(function(data, status) {
			$cordovaDialogs.alert("Får ikke svar fra server.");
		});
	});

	$ionicPopover.fromTemplateUrl('templates/categoryFilteringDropdown.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});

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
					var index = $scope.storyPreviews.indexOf(story);
					$scope.storyPreviews.splice(index, 1);
					var originalIndex = $scope.storyPreviewsOriginal.indexOf(story);
					$scope.storyPreviewsOriginal.splice(originalIndex, 1);
					Requests.removeTagStory(Requests.getSelectedTag(), $window.localStorage.getItem('userId'), story.id);
				} else {
					console.log('Noe gikk galt');
				}
			});
			event.preventDefault();
			event.stopPropagation();
		});


	};


	// Opens the selected story. 
	$scope.open = function(story) {
		$ionicLoading.show({
			template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
			noBackdrop: false
		});

		Requests.setSelectedStory(story.id);
		$state.go("app.story");

	};

	$scope.sortStories = function(sortProperty) {

		if (sortProperty == "date") {

			if ($scope.currentSortProperty == "date") {
				$scope.storyPreviews = $filter('orderBy')($scope.storyPreviews, "insertTime", false);
				$scope.currentSortProperty = "dateInverse";
			} else {
				$scope.storyPreviews = $filter('orderBy')($scope.storyPreviews, "insertTime", true);
				$scope.currentSortProperty = "date";
			}

		} else if (sortProperty == "rating") {
			if ($scope.currentSortProperty == "rating") {
				$scope.storyPreviews = $filter('orderBy')($scope.storyPreviews, "rating", false);
				$scope.currentSortProperty = "ratingInverse";
			} else {
				$scope.storyPreviews = $filter('orderBy')($scope.storyPreviews, "rating", true);
				console.log("Sorting by ratin!!!!!!!");
				$scope.currentSortProperty = "rating";
			}

		}
		console.log("Sorting stories by: " + $scope.currentSortProperty);

	};

	$scope.filterByCategory = function(category) {
		$scope.popover.hide();
		if (category == 0) {
			$scope.storyPreviews = $scope.storyPreviewsOriginal.splice(0);
			$scope.chosenCategory = "Kategori";
			return;
		}
		$scope.chosenCategory = $scope.categorynames[category - 1];

		$scope.storyPreviews = [];
		for (var i = 0; i < $scope.storyPreviewsOriginal.length; i++) {
			console.log($scope.storyPreviewsOriginal[i].categories);
			var storyHasCategory = $scope.storyPreviewsOriginal[i].categories.indexOf(category.toString()) != -1;
			if (storyHasCategory) {
				$scope.storyPreviews.push($scope.storyPreviewsOriginal[i]);
			}
		}
	}




	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});

})
