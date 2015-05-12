////////////////////////
//  Preferences
////////////////////////

//TODO: Forklar!

angular.module('PrefCtrl', [])

stories.controller('PrefCtrl', function($scope, Requests, User, $state, $ionicLoading, $window, $ionicHistory, $cordovaDialogs) {



	//TODO: Forklar!
	function Category(name, icon, isSelected) {
		this.name = name;
		this.icon = icon;
		this.isSelected = isSelected;
	};
	$scope.categories = [];

	$scope.categories.push(null);
	$scope.categories.push(new Category("Kunst", "icon-art", false));
	$scope.categories.push(new Category("Arkitektur", "icon-architecture", false));
	$scope.categories.push(new Category("Arkeologi", "icon-archeology", false));
	$scope.categories.push(new Category("Historie", "icon-history", false));
	$scope.categories.push(new Category("Tradisjon & mat", "icon-tradition", false));
	$scope.categories.push(new Category("Natur", "icon-nature", false));
	$scope.categories.push(new Category("Litteratur", "ion-ios-book", false));
	$scope.categories.push(new Category("Musikk", "ion-music-note", false));
	$scope.categories.push(new Category("Teknologi", "ion-gear-b", false));

	$scope.selectedCat = [];

	
	$scope.goProfile = function() {
		$state.go('profile');
	}
	
	//TODO: Forklar!
	$scope.selectedCategory = function(category) {
		addToArray = true;
		for (var i = 0; i < $scope.selectedCat.length; i++) {
			if ($scope.selectedCat[i] == category) {
				addToArray = false;
			}
		}
		if (addToArray) {
			console.log("selected category: " + category);
			$scope.selectedCat.push(category);
			console.log("selected category: " + $scope.selectedCat);
		} else {
			console.log("selected category: " + category);
			index = $scope.selectedCat.indexOf(category);
			$scope.selectedCat.splice(index, 1);
			console.log("selected category: " + $scope.selectedCat);
		}
	};

	//loads and displays existing preferences when opening the view
	$scope.loadPreferences = function() {
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			console.log("response status(getUserFromId) : " + response.data.status);
			$scope.user = response.data;
			category_preference = $scope.user.userModel.category_preference;
			for (element in category_preference) {
            	index = parseInt(category_preference[element]);
             	$scope.selectedCategory(index);
              	$scope.categories[index].isSelected = true;
     		}

		}, function(response) {
			$cordovaDialogs.alert("Får ikke svar fra server.");
		});
	};

	$scope.isSelectedCat = function () {

	console.log("isSelectedCat: ", $scope.selectedCat);
	
		if ($scope.selectedCat.length > 0 && $scope.selectedCat.length <= 9) 
		{
			return true
		}
		else 
		{
			return false
		}
	}

	//saves the preferences initially chosen by first-time user //TODO: Forklar! CLEAN UP ROAR
	$scope.savePreferences = function() {
		console.log("Saving Preferences: ", $scope.isSelectedCat());

		if($scope.isSelectedCat()) 
		{
			Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
				user = new User($window.localStorage.getItem('userId'), response.data.userModel);
				console.log("response status(getUserFromId) : " + response.data.status);
				console.log("$window.localStorage.getItem('userId') : " + $window.localStorage.getItem('userId'));

				user.setCategoryPreference($scope.selectedCat);
				console.log("$scope.selectedCat) : " + user.category_preference);
				console.log("user: " + user);

				$ionicLoading.show({
					template: '<h2>Vennligst vent mens vi finner historier vi tror du vil like</h2><div class="icon ion-loading-a"></div>',
					noBackdrop: false
				});

				Requests.updateUser(user).then(function(response) {
					console.log("response status(updateUser) : " + response.data.userId);
					$ionicHistory.clearCache()
					$state.go("app.recommendations");
					$ionicLoading.hide();
				});

			});
		}
		else 
		{
			$ionicLoading.show({
					template: '<h2>Du må velge minst en kategori</h2>',
					noBackdrop: false,
					duration: 2000
				});
		}
	};

	//saves the new preferences chosen in the settings -> preferences view
	$scope.updatePreferences = function() {
		$scope.preferencesSaved = false;
		console.log("Saving Preferences");

		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			user = new User($window.localStorage.getItem('userId'), response.data.userModel);
			console.log("response status(getUserFromId) : " + response.data.status);

			user.setCategoryPreference($scope.selectedCat);
			console.log("$scope.selectedCat) : " + user.category_preference);
			console.log("user: " + user);

			Requests.updateUser(user).then(function(response) {
				console.log("response status(updateUser) : " + response.data.userId);
			}, function(response) {
				$cordovaDialogs.alert("Får ikke svar fra server.");
			});

		}, function(response) {
			$cordovaDialogs.alert("Får ikke svar fra server.");
		});
		$scope.preferencesSaved = true;
	};

})