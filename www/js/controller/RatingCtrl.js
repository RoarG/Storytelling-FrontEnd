////////////////////////
//  Rating 
////////////////////////

// Controller which handles the rating of a story

angular.module('RatingCtrl', [])


stories.controller("RatingCtrl", function(
	$window,
	$scope,
	$ionicHistory,
	$cordovaDialogs,
	Requests
) {

	$scope.userId = $window.localStorage.getItem('userId');
	$scope.currentlyRating = false;

	$scope.showAlert = function(title, msg) {
		var alertPopup = $ionicPopup.alert({
			cssClass: 'alertPopup',
			title: title,
			template: msg
		});
		alertPopup.then(function(response) {
			//Do something when closing the alert box
			console.log('closing the alert box');
		});
	};

	// Rates story from 1-5. Clears cache so that recommendations are updated. 
	$scope.rateFunction = function(rating) {
		$scope.currentlyRating = true;
		$scope.story.rating = rating;

		Requests.addRating(Requests.getSelectedStory(), $scope.userId, rating).then(function(response) {
			$scope.currentlyRating = false;
		}, function(response) {
			$scope.currentlyRating = false;
			$scope.showAlert('Vettu Hva?', "Tilbakemeldingen din ble ikke lagret.");

		});
	};
})
