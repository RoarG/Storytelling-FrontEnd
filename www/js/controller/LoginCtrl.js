////////////////////////
// Login
////////////////////////

//Controller handeling the logic in the Login view, like setting user id, requests to the Db and validating the input. 

angular.module('LoginCtrl', [])


stories.controller('LoginCtrl', function(
	$window,
	$rootScope,
	$scope,
	$state,
	$ionicLoading,
	$cordovaDialogs,
	Requests,
	User
) {


	$scope.responseData = {}
	$scope.tempMail = null;
	$scope.user = {};

	// Validate function for Email with regEx not i use atm. Using the built in AngularJs validator
	$scope.validateEmail = function(email) {

		var reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	}

	//request backend for the user with Email // 
	$scope.requestUser = function(email) {
		Requests.getUserFromEmail(email).then(function(response) {
			$scope.responseData = response.data;
			$scope.responseData.status = response.data.status;
			$window.localStorage.setItem('responseData', response.data);


			if (response.data.status === "successfull") {
				$scope.userExist(response.data);
			} else if (response.data.status === "failed") {
				$scope.userDontExist(email);
			}

		}, function(response) {
			$ionicLoading.hide();
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
	}

	//Sets the user from the response 
	$scope.userExist = function(data) {
		$scope.user = new User(data.userModel.userId, data.userModel);

		//Sets the localStorage.getItem userId and User model
		$window.localStorage.setItem('userId', data.userModel.userId);
		$window.localStorage.setItem('userModel', $scope.responseData.userModel);
		$window.localStorage.setItem('userMail', data.userModel.email);

		$ionicLoading.hide();

		console.log('email: ' + $window.localStorage.getItem('userMail'));
		//TODO: Fjern comment under
		StatusBar.show();

		//TODO: Set user assosiated with the email ??
		$state.go("app.recommendations");

		//Sets the input filed as a empty string
		$scope.user.email = '';
	}

	$scope.setLocalUser = function(userid) {
		Requests.getUserFromId(userid).then(function(response) {
			$window.localStorage.setItem('userId', $scope.responseData.userId);
			$window.localStorage.setItem('userModel', $scope.responseData.userModel);
		}, function(response) {
			$ionicLoading.hide();
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
	}

	//Adds a new user to the Database
	$scope.userDontExist = function(email) {
		$scope.user.email = $scope.tempMail
		Requests.addUser(email).then(function(response) {
			$scope.responseData = response.data;

			//Sets the localStorage.getItem userId 
			$scope.user.userId = $scope.responseData.userId;
			$window.localStorage.setItem('userId', $scope.responseData.userId);
			$window.localStorage.setItem('userModel', $scope.responseData.userModel);

			//Logs when the first time a user starts the app.
			Requests.opensApp($window.localStorage.getItem('userId'));

			//Go to the next view 
			//Sets the input as a empty string
			$scope.user.email = '';

			//User is created on the server sider or not
			if (response.data.status === "sucessfull") {
				$scope.setLocalUser(response.data.userId);
				$scope.clearProfil();
				$state.go("profile");
				$ionicLoading.hide();
			} else if (response.data.status === "failed") {
				$ionicLoading.hide();
				$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');

			}
		}, function(response) {
			$ionicLoading.hide();
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
	}

	// Displays popup that tells the user to use a valid email address. 
	$scope.showValidatePopup = function() {
		$ionicLoading.show({
			template: '<h2>Du må bruke en gyldig adresse</h2>',
			noBackdrop: true,
			duration: 2000
		});
	}

	// Display loading indicator
	$scope.showLoading = function() {
		$ionicLoading.show({
			template: '<h2>Kontakter server...<div class="icon ion-loading-a"></div></h2>',
			noBackdrop: true,
		});
	}

	//Updates the user with the curent user model
	$scope.updateUser = function() {
		Requests.updateUser(new User($window.localStorage.getItem('userId'))).then(function(response1) {}, function(response) {
			$ionicLoading.hide();
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
	}

	// Login with the submitet email adress.
	$scope.doLogin = function(email) {
		$scope.showLoading();
		$scope.requestUser(email);
	};

	// Triggered in the login view to skip it
	$scope.closeLogin = function() {
		//Makes a new User object to send to backened Sets mail as -1 when no mail is provided
		/*user = new User($scope.user);*/
		$scope.userDontExist(-1);
	};

	$scope.clearProfil = function() {
		$scope.ageGrp = null;
		$scope.gender = null;
	}

})
