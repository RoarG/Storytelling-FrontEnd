////////////////////////
//	Profile
////////////////////////

//TODO: Forklar!

angular.module('ProfilCtrl', [])

stories.controller('ProfilCtrl', function($scope, Requests, User, $state, $window) {

	$scope.ageGrp = null;
	$scope.gender = null;

	//TODO: Forklar!
	$scope.goLogin = function() {
		$state.go("login");
		// StatusBar.show();
	};

	//TODO: Forklar!
	$scope.setAgeGrp = function(ageGrp) {
		$scope.ageGrp = ageGrp;
		console.log('AgeGrp : ' + $scope.ageGrp);
	};

	//TODO: Forklar!
	$scope.setGender = function(gender) {
		$scope.gender = gender;
		console.log('Gender : ' + $scope.gender);
	};

	//loads and displays existing profile information when opening the view
	$scope.loadProfile = function() {
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);
			$scope.user = response.data;
			gender = parseInt($scope.user.userModel.gender);
			age_group = parseInt($scope.user.userModel.age_group);
			$scope.setGender(gender);
			$scope.setAgeGrp(age_group);

		});

	};

	//saves the profile information initially set by first-time user 
	$scope.saveProfil = function() {
		console.log("ageGrp" + $scope.ageGrp);
		console.log('Gender : ' + $scope.gender);

		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);

			user = new User($window.localStorage.getItem('userId'), response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.status);
				//TODO: If failed=?
			});

		});
		$state.go("preferences");

	};
	
	//saves the new profile information set in the settings -> preferences view
	$scope.updateProfil = function() {
		$scope.profileSaved = false;
		console.log("ageGrp" + $scope.ageGrp);
		console.log('Gender : ' + $scope.gender);

		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);

			user = new User($window.localStorage.getItem('userId'), response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.status);
			});

		});
		$scope.profileSaved = true;
	};



})