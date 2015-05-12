////////////////////////
//  Rating 
////////////////////////

//TODO: Forklar!

angular.module('RatingCtrl', [])


stories.controller("RatingCtrl", function($scope, Requests, $window, $ionicHistory, $cordovaDialogs) {
	$scope.userId = $window.localStorage.getItem('userId');
	$scope.ratingStatus = "notRated";

	// Rate story //TODO: Forklar!
	$scope.rateFunction = function(rating) {
		$scope.ratingStatus = "rating";
		$scope.story.rating = rating;
            
        Requests.addRating(Requests.getSelectedStory(), $scope.userId, rating).then(function(response) {
          $scope.ratingStatus = "rated";
        }, function(response) {
          console.log("Rating not saved");
          $cordovaDialogs.alert("Tilbakemeldingen din ble ikke lagret.");
          $scope.ratingStatus = "notRated";
        });
        $ionicHistory.clearCache();
	};
})