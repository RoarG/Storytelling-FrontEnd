////////////////////////
//  Settings 
////////////////////////

angular.module('SettingsCtrl', [])


stories.controller('SettingsCtrl', function($scope, Requests, User) {
	//retrieve the user email when opening the settings view
	Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
		$scope.user = response.data;
		$scope.email = $scope.user.userModel.email;
	});

	//test function which retrieves all user information
	$scope.retrieveUser = function() {
		$scope.userId = window.localStorage['userId'];
		Requests.getUserFromId($scope.userId).then(function(response) {
			$scope.user = response.data;
			console.log($scope.user);
		});
	};

	//updates the user's email
	$scope.saveEmail = function(email) {
		Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);

			user = new User(window.localStorage['userId'], response.data.userModel);
			user.setEmail(email);
			$scope.email = email;

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.status);
				//TODO: If failed= notify user that email is already in use
			});

		});

	};
})