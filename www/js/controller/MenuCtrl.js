////////////////////////
//	Menu 
////////////////////////

//TODO: Forklar!

angular.module('MenuCtrl', [])

stories.controller('MenuCtrl', function($scope, Requests, User, $state, $window, $ionicPlatform, $cordovaDialogs) {

		//TODO: Forklar!
	$scope.logout = function() {
		console.log($window.localStorage.getItem('newUser') + "Logout " + $window.localStorage.getItem('userId'));

		//TODO: Trengs denne? SJEKKE HER ROAR!!!
		$window.localStorage.clear();
		console.log("Clear - id: " + $window.localStorage.getItem('userId'));
		
		$window.localStorage.setItem('userId', "-1");
		//$window.localStorage.setItem('newUser', true);
		$state.go("login");

		console.log("email" + $scope.email);
		console.log("login" + $window.localStorage.getItem('userId'));

		//TODO: add feedback to user
	}

	//TODO: Forklar!
	$scope.viewList = function(listName) {
		Requests.setSelectedTag(listName);
		$state.go("app.listView");
	};

	//TODO: Forklar! List? bookmark?
	$scope.deleteList = function(list) {
		$ionicPlatform.ready(function() {
			$cordovaDialogs.confirm('Vil du slette listen "' + list.text + '"?', 'Slett liste', ['OK', 'Avbryt']).then(function(response) {
				if (response === 1) {
					var index = $scope.collectionList.indexOf(list);
					$scope.collectionList.splice(index, 1);
					Requests.removeTag($window.localStorage.getItem('userId'), list.text);
				}
			});
		});
	};

	$scope.goAppOne = function () {
		console.log("TRAFF");
		$state.go('appOne');
	}
	//TODO: Forklar!
	$scope.updateMenu = function() {
		Requests.getAllLists($window.localStorage.getItem('userId')).then(function(response) {
			$scope.collectionList = response.data;
			console.log($scope.collectionList);
		}, function(response) {
			$cordovaDialogs.alert("Får ikke tak i bokmerker.");
		});
	};

	$scope.updateMenu();


})