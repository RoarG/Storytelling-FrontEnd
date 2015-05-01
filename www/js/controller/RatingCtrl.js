////////////////////////
//  Rating 
////////////////////////

//TODO: Forklar!

angular.module('RatingCtrl', [])


stories.controller("RatingCtrl", function($scope, Requests, $window) {
	$scope.userId = $window.localStorage.getItem('userId');
	$scope.ratingSaved = "notRated";

	// Rate story //TODO: Forklar!
	$scope.rateFunction = function(rating) {
		$scope.ratingStatus = "rating";
            
        Requests.addRating(Requests.getSelectedStory(), $scope.userId, rating).then(function(response) {
          $scope.ratingStatus = "rated";
          $scope.story.rating = rating;
        }, function(response) {
          console.log("Rating not saved");
        });
	};
})