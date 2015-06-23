////////////////////////
//	Profile
////////////////////////

// Controller for the entering and editing of profile information (age group and gender). 

angular.module('ProfilCtrl', [])

stories.controller('ProfilCtrl', function(
	$window, 
	$scope, 
	$ionicLoading,
	$state, 
	$cordovaDialogs,
	Requests, 
	User
) {

	$scope.ageGrp = null; // Integer value indicating age group (1: below 20, 2: 20-45, 3: 46-65, 4: over 66)
	$scope.gender = null; // 0: female, 1: male

	$scope.goLogin = function() {
		$state.go("login");
		// StatusBar.show();
	};

	$scope.setAgeGrp = function(ageGrp) {
		$scope.ageGrp = ageGrp;
	};

	$scope.setGender = function(gender) {
		$scope.gender = gender;
	};

	// Gets existing profile information from back-end when opening the view
	$scope.loadProfile = function() {
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			$scope.user = response.data;
			gender = parseInt($scope.user.userModel.gender);
			age_group = parseInt($scope.user.userModel.age_group);
			$scope.setGender(gender);
			$scope.setAgeGrp(age_group);

		}, function(response) {
			$rootScope.showAlert('Server Problemer', 'Får ikke svar fra server');	
		});

	};

	// Saves the profile information initially set by first-time user 
	$scope.saveProfil = function() {
		// Get user and add the new profile information to it. 
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			user = new User($window.localStorage.getItem('userId'), response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				// If successfully updated user, go to next step: setting preferences. 
				$state.go("preferences");
			}, function(response) {
				$rootScope.showAlert('Server Problemer', 'Får ikke svar fra server');	
			});

		}, function(response) {
			$rootScope.showAlert('Server Problemer', 'Får ikke svar fra server');	
		});

	};
	
	// Saves the new profile information set in the settings -> preferences view
	$scope.updateProfil = function() {
		$scope.profileSaved = false;
		// Get user and add the new profile information to it. 
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			user = new User($window.localStorage.getItem('userId'), response.data.userModel);
			user.setAgeGroup($scope.ageGrp);
			user.setGender($scope.gender);

			Requests.updateUser(user).then(function(response) {
				$scope.profileSaved = true;
				$ionicLoading.show({
					template: '<h2>Lagret</h2>',
					noBackdrop: false,
					duration: 1200
				});
			}, function(response) {
				$rootScope.showAlert('Server Problemer', 'Får ikke svar fra server');	
			});

		}, function(response) {
			$rootScope.showAlert('Server Problemer', 'Får ikke svar fra server');	
		});
	};



})