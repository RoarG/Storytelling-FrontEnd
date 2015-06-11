////////////////////////
//  ListView 
////////////////////////

// Controller which handles lists of bookmarks

angular.module('ListViewCtrl', [])

stories.controller('ListViewCtrl', function($scope, Requests, Story, $state, $rootScope, $ionicLoading, $window, $cordovaDialogs, $animate, $ionicPlatform) {
	//Display loading screen
	$ionicLoading.show({
		template: '<h2>Laster inn...</h2><div class="icon ion-loading-a"></div>',
		noBackdrop: false
	});

	$animate.enabled(true);


	$scope.tag = Requests.getSelectedTag();
	// Retrieve stories associated with selected tag, so that they can be displayed
	Requests.getStoryList($scope.tag, $window.localStorage.getItem('userId')).success(function(data, status) {
		$scope.storyPreviews = data;
		$scope.storyPreviewsByDate = data;
		$ionicLoading.hide();
	}).error(function(data, status) {
		$cordovaDialogs.alert("Får ikke svar fra server.");
	});

	// Remove a story from the listview
	$scope.remove = function(story, event) {
		$ionicPlatform.ready(function() {
			$cordovaDialogs.confirm('Er du sikker på at du vil slette denne fortellingen?', 'Slett fortelling', ['OK', 'Avbryt']).then(function(response) {
				// response == 1 means that the user has replied "OK", so the list is deleted and the bookmark is removed from the story. 
				if (response === 1) {
					var index = $scope.storyPreviews.indexOf(story);
					$scope.storyPreviews.splice(index, 1);
					Requests.removeTagStory(Requests.getSelectedTag(), $window.localStorage.getItem('userId'), story.id);
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
		if(sortProperty == "date") {
			$scope.storyPreviews = $scope.storyPreviewsByDate.reverse();
		} else if(sortProperty == "rating") {

		}
		
	}

})