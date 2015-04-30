////////////////////////
//	Profile
////////////////////////


angular.module('ProfilCtrl', [])

stories.controller('ProfilCtrl', function($scope, Requests, User, $state) {

	$scope.ageGrp = null;
	$scope.gender = null;

	$scope.goLogin = function() {
		$state.go("login");
		StatusBar.show();
		console.log("vi " + vi);
	};

	$scope.setAgeGrp = function(ageGrp) {
		$scope.ageGrp = ageGrp;
		console.log('AgeGrp : ' + $scope.ageGrp);
	};

	$scope.setGender = function(gender) {
		$scope.gender = gender;
		console.log('Gender : ' + $scope.gender);
	};

	$scope.loadProfile = function() {
		Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);
			$scope.user = response.data;
			gender = parseInt($scope.user.userModel.gender);
			age_group = parseInt($scope.user.userModel.age_group);
			$scope.setGender(gender);
			$scope.setAgeGrp(age_group);

		});

	};

	$scope.saveProfil = function() {
		console.log("ageGrp" + $scope.ageGrp);
		console.log('Gender : ' + $scope.gender);

		Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);

			user = new User(window.localStorage['userId'], response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.status);
				//TODO: If failed=?
			});

		});
		$state.go("preferences");

	};

	$scope.updateProfil = function() {
		console.log("ageGrp" + $scope.ageGrp);
		console.log('Gender : ' + $scope.gender);

		Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);

			user = new User(window.localStorage['userId'], response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.status);
			});

		});

	};



})