////////////////////////
//  Settings 
////////////////////////

//TODO: Forklar!

angular.module('SettingsCtrl', [])


stories.controller('SettingsCtrl', function($scope, Requests, User, $ionicLoading, $window) {
	//retrieve the user email when opening the settings view
	Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
		$scope.user = response.data;
		$scope.email = $scope.user.userModel.email;
	});

	//test function which retrieves all user information
	$scope.retrieveUser = function() {
		$scope.userId = $window.localStorage.getItem('userId');
		Requests.getUserFromId($scope.userId).then(function(response) {
			$scope.user = response.data;
			console.log($scope.user);
		});
	};

	//updates the user's email
	$scope.saveEmail = function(email) {

		//do not update email if string is erroneous or empty
		if (!email) {
			$ionicLoading.show({
				template: '<h2>Mislykket: E-mail adresse er feilskrevet eller tom</h2>',
				noBackdrop: true,
				duration: 3000
			});
		}

		else {
			Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
				console.log("response status(getUserFromId) : " + response.data.status);

				user = new User(($window.localStorage.getItem('userId')), response.data.userModel);

				oldEmail = user.email;			//store the old email in case new email is incorrect
				user.setEmail(email);			//set user's email to the new email
				$scope.email = email;			//display the new email in the template

				Requests.updateUser(user).then(function(response) {
					console.log("response status(updateUser) : " + response.data.status);
					//if update succeeds, display a confirmation message
					if (response.data.status === "successfull") {
						$ionicLoading.show({
							template: '<h2>Din e-mail adresse har blitt oppdatert</h2>',
							noBackdrop: true,
							duration: 3000
						});
					}
					//if update fails, it means the new email address is already in use
					//revert to old email and display error message
					else if (response.data.status === "failed"){
						$scope.email = oldEmail;
						$ionicLoading.show({
							template: '<h2>Mislykket: E-mail adresse er allerede i bruk</h2>',
							noBackdrop: true,
							duration: 3000
						});
			   		}

				});

			});
		}
	};
})