////////////////////////
//	Menu 
////////////////////////

// Controller for handling menu functions

angular.module('MenuCtrl', [])

stories.controller('MenuCtrl', function($scope, Requests, User, $state, $window, $ionicPlatform, $cordovaDialogs) {

	// Log out user and go to login screen. 
	$scope.logout = function() {

		//TODO: Trengs denne? SJEKKE HER ROAR!!! 
		$window.localStorage.clear();
		
		$window.localStorage.setItem('userId', "-1");
		$state.go("login");

		//TODO: add feedback to user
	}

	// View the bookmark list called listName. 
	$scope.viewList = function(listName) {
		Requests.setSelectedTag(listName);
		$state.go("app.listView");
	};

	// Delete list of bookmarks. 
	$scope.deleteList = function(list) {
		$ionicPlatform.ready(function() {
			$cordovaDialogs.confirm('Vil du slette listen "' + list.text + '"?', 'Slett liste', ['OK', 'Avbryt']).then(function(response) {
				// response == 1 means that the user has replied "OK", so the list is deleted and the bookmark is removed from the story. 
				if (response === 1) {
					var index = $scope.collectionList.indexOf(list);
					$scope.collectionList.splice(index, 1);
					Requests.removeTag($window.localStorage.getItem('userId'), list.text);
				}
			});
		});
	};
	// Go to app tutorial
	$scope.goAppOne = function () {
		$state.go('appOne');
	}
	// Update the bookmark lists in the menu. 
	$scope.updateMenu = function() {
		Requests.getAllLists($window.localStorage.getItem('userId')).then(function(response) {
			$scope.collectionList = response.data;
		}, function(response) {
			$cordovaDialogs.alert("Får ikke tak i bokmerker.");
		});
	};

	$scope.updateMenu();


})