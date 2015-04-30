////////////////////////
//  Rating 
////////////////////////

angular.module('RatingCtrl', [])


stories.controller("RatingCtrl", function($scope, Requests, User) {
	$scope.userId = window.localStorage['userId'];
	$scope.story = Requests.getSelectedStory();
	$scope.ratingSaved = false;

	// Rate story
	$scope.rateFunction = function(rating) {
		$scope.story.rating = rating;
		Requests.addRating($scope.story.storyId, $scope.userId, rating);
		console.log("Rated story: " + rating);
		$scope.ratingSaved = true;
	};
})