////////////////////////
//  Menu 
////////////////////////

// Controller for handling menu functions

angular.module('MenuCtrl', [])

stories.controller('MenuCtrl', function(
	$window, 
	$scope, 
	$state, 
	$ionicPlatform, 
	$cordovaDialogs,
	Requests, 
	User) {


	$scope.goSettings = function () {
		$state.go('app.settings');
	};

	$scope.goAppOne = function () {
		$state.go('app.appOne');
	};

	$scope.goAbout = function () {
		$state.go('app.about');
	};

	$scope.group = false;
	/*
	 * if given group is the selected group, deselect it
	 * else, select the given group
	 */
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};

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

		// Update the bookmark lists in the menu. 
	$scope.updateMenu = function() {
		Requests.getAllLists($window.localStorage.getItem('userId')).then(function(response) {
			$scope.collectionList = response.data;
			$scope.userMadeLists = [];
			$scope.defaultLists = [];
			for(var i = 0; i < $scope.collectionList.length; i++) {
				var tagName = $scope.collectionList[i].text;
				if(tagName == "Historikk" || tagName == "Lest" || tagName == "Les senere") {
					$scope.defaultLists.push($scope.collectionList[i]);
				} else {
					$scope.userMadeLists.push($scope.collectionList[i]);
					console.log(tagName);
				}
			}
		}, function(response) {
			$cordovaDialogs.alert("Får ikke tak i bokmerker.");
		});
	};

	$scope.updateMenu();


})
