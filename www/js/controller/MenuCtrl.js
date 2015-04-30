////////////////////////
//	Menu 
////////////////////////


angular.module('MenuCtrl', [])

stories.controller('MenuCtrl', function($scope, Requests, User, $state) {

	//$state, $ionicLoading

	$scope.logout = function() {
		console.log(window.localStorage['newUser'] + "Logout " + window.localStorage['userId']);

		//TODO: Trengs denne? 
		window.localStorage.clear();
		window.localStorage['userId'] = "-1";
		window.localStorage['newUser'] = true;
		$state.go("login");

		console.log("email" + $scope.email);
		console.log("login" + window.localStorage['newUser']);

		//TODO: add feedback to user
	}

	$scope.viewList = function(listName) {
		Requests.setSelectedTag(listName);
		$state.go("app.listView");
	};

	$scope.deleteList = function(list) {
		$ionicPlatform.ready(function() {
			$cordovaDialogs.confirm('Vil du slette listen "' + list.text + '"?', 'Slett liste', ['OK', 'Avbryt']).then(function(response) {
				if (response === 1) {
					var index = $scope.collectionList.indexOf(list);
					$scope.collectionList.splice(index, 1);
					Requests.removeTag(window.localStorage['userId'], list.text);
				}
			});
		});
	};

	$scope.updateMenu = function() {
		Requests.getAllLists(window.localStorage['userId']).then(function(response) {
			$scope.collectionList = response.data;
			console.log($scope.collectionList);
		});
	};

	$scope.updateMenu();


})