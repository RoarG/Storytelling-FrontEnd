////////////////////////
//  Preferences
////////////////////////

// Controller for the setting of which categories the user is interested in. 

angular.module('PrefCtrl', [])

stories.controller('PrefCtrl', function(
	$window, 
	$scope, 
	$state, 
	$ionicLoading, 
	$ionicHistory, 
	$cordovaDialogs,
	User, 
	Requests
) {


	// Create a category object for each of the categories.
	// Consists of the name, the icon to be displayed, and whether that category is selected by the user. 
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

	// Array of selected categories
	$scope.selectedCat = [];

	
	$scope.goProfile = function() {
		$state.go('profile');
	}
	
	// A category has been selected. 
	$scope.selectedCategory = function(category) {
		addToArray = true;
		// Checks whether this category has already been selected. 
		for (var i = 0; i < $scope.selectedCat.length; i++) {
			if ($scope.selectedCat[i] == category) {
				addToArray = false;
			}
		}
		// If the category is not already selected, select category
		if (addToArray) {
			$scope.selectedCat.push(category);
		// Else, deselect category
		} else {
			index = $scope.selectedCat.indexOf(category);
			$scope.selectedCat.splice(index, 1);
		}
	};

	// Loads existing preferences when opening the view
	$scope.loadPreferences = function() {
		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			$scope.user = response.data;
			category_preference = $scope.user.userModel.category_preference;
			for (element in category_preference) {
            	index = parseInt(category_preference[element]);
             	$scope.selectedCategory(index);
              	$scope.categories[index].isSelected = true;
     		}

		}, function(response) {
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
	};

	// Checks whether there are any selected categories. 
	$scope.isSelectedCat = function () {
	
		if ($scope.selectedCat.length > 0 && $scope.selectedCat.length <= 9) 
		{
			return true
		}
		else 
		{
			return false
		}
	}

	// Saves the preferences initially chosen by first-time user //TODO: CLEAN UP SOMMER
	$scope.savePreferences = function() {

		if($scope.isSelectedCat()) 
		{
			Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
				user = new User($window.localStorage.getItem('userId'), response.data.userModel);

				user.setCategoryPreference($scope.selectedCat);

				$ionicLoading.show({
					template: '<h2>Vennligst vent mens vi finner historier vi tror du vil like</h2><div class="icon ion-loading-a"></div>',
					noBackdrop: false
				});

				Requests.updateUser(user).then(function(response) {
					$ionicHistory.clearCache()
					$state.go("app.recommendations");
					$ionicLoading.hide();
				}, function(response) {
					$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
				});

			}, function(response) {
				$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
			});
		}
		// No category has been selected. Tell user
		else 
		{
			$ionicLoading.show({
					template: '<h2>Du må velge minst én kategori</h2>',
					noBackdrop: false,
					duration: 2000
				});
		}
	};

	// Saves the new preferences chosen in the settings -> preferences view
	$scope.updatePreferences = function() {
		$scope.preferencesSaved = false;

		Requests.getUserFromId($window.localStorage.getItem('userId')).then(function(response) {
			user = new User($window.localStorage.getItem('userId'), response.data.userModel);

			user.setCategoryPreference($scope.selectedCat);

			Requests.updateUser(user).then(function(response) {
				$scope.preferencesSaved = true;
				$ionicLoading.show({
					template: '<h2>Lagret</h2>',
					noBackdrop: false,
					duration: 1200
				})
				//$ionicHistory.clearCache();
			}, function(response) {
				$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
			});

		}, function(response) {
			$rootScope.showAlert('Serverproblemer', 'Får ikke svar fra server');
		});
		
	};

})