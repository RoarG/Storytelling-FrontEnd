////////////////////////
//  ListView 
////////////////////////


angular.module('ListViewCtrl', [])

stories.controller('ListViewCtrl', function($scope, Requests, Story, $state, $rootScope, $ionicLoading,) {
	//Display loading screen
	$ionicLoading.show({
		template: '<h2>Laster inn...</h2><div class="icon ion-loading-a"></div>',
		noBackdrop: false
	});


	$scope.tag = Requests.getSelectedTag();
	// Retrieve stories associated with selected tag
	Requests.getStoryList($scope.tag, window.localStorage['userId']).success(function(data, status) {
		$scope.storyPreviews = data;
		$ionicLoading.hide();
	}).error(function(data, status) {
		console.log(status);
	});

	//remove a story from the listview
	$scope.remove = function(story) {
		var index = $scope.storyPreviews.indexOf(story);
		$scope.storyPreviews.splice(index, 1);
		Requests.removeTagStory(Requests.getSelectedTag(), window.localStorage['userId'], story.id);
	};

	$scope.open = function(story) {
		$ionicLoading.show({
			template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
			noBackdrop: false
		});
		// Get story data.
		//Må ha .then() for å kunne hente fra http.post i backend.services
		Requests.getStory(story.id, window.localStorage['userId']).success(function(data, status) {
			Requests.setSelectedStory(new Story(data));
			$state.go("app.story");
			$ionicLoading.hide();
		}).error(function(data, status) {
			console.log(status)
		})
	};

})