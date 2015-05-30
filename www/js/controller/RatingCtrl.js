////////////////////////
//  Rating 
////////////////////////

// Controller which handles the rating of a story

angular.module('RatingCtrl', [])


stories.controller("RatingCtrl", function($scope, Requests, $window, $ionicHistory, $cordovaDialogs) {
	$scope.userId = $window.localStorage.getItem('userId');
	$scope.ratingStatus = "notRated";

	// Rates story from 1-5. Clears cache so that recommendations are updated. 
	$scope.rateFunction = function(rating) {
		$scope.ratingStatus = "rating";
		$scope.story.rating = rating;
            
    Requests.addRating(Requests.getSelectedStory(), $scope.userId, rating).then(function(response) {
      $scope.ratingStatus = "rated";
    }, function(response) {
      $cordovaDialogs.alert("Tilbakemeldingen din ble ikke lagret.");
      $scope.ratingStatus = "notRated";
    });
    $ionicHistory.clearCache();
	};
})