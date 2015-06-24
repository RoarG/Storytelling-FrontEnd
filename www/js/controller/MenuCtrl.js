////////////////////////
//  Menu 
////////////////////////

// Controller for handling menu functions

angular.module('MenuCtrl', [])

stories.controller('MenuCtrl', function(
	$window,
	$rootScope, 
	$scope, 
	$state, 
	$ionicPlatform, 
	$cordovaDialogs,
	$ionicPopup,
	$ionicHistory,
	$ionicSideMenuDelegate,
	$cordovaInAppBrowser,
	Requests, 
	User
) {

	$scope.group = false;
	Requests.getNumberOfNotifications($window.localStorage.getItem('userId')).then(function(response)  {
		$scope.notificationsCount = response.data['numberOfNotifications'];
		console.log("Number of notifications:" + $scope.notificationsCount);
	});
	
	$scope.goSettings = function () {
		$state.go('app.settings');
	};

	$scope.goAppOne = function () {
		$state.go('app.appOne');
	};

	$scope.goAbout = function () {
		$state.go('app.about');
	};

	$scope.goAcknowledgment = function () {
		$state.go('app.acknowledgment');
	};

	
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


	$scope.toggleBookmarksGroup = function(group) {
		if ($scope.isBookmarksGroupShown(group)) {
			$scope.shownBookmarksGroup = null;
		} else {
			$scope.shownBookmarksGroup = group;
		}
	};
	
	$scope.isBookmarksGroupShown = function(group) {
		return $scope.shownBookmarksGroup === group;
	};

	$scope.toggleHistoryGroup = function(group) {
		if ($scope.isHistoryGroupShown(group)) {
			$scope.shownHistoryGroup = null;
		} else {
			$scope.shownHistoryGroup = group;
		}
	};
	

	$scope.isHistoryGroupShown = function(group) {
		return $scope.shownHistoryGroup === group;
	};

	// View the bookmark list called listName. 
	$scope.viewList = function(listName) {
		Requests.setSelectedTag(listName);
		$state.go("app.listView");
	};

	// Delete list of bookmarks. 
	$scope.deleteList = function(list) {
		var confirmPopup = $ionicPopup.confirm({
			cssClass: 'popUp',
	     	title: 'Slett liste' , 
	     	template: 'Vil du slette listen "' + list.text + '"?', 
	     	cancelText: 'Avbryt',
	     	okText: 'OK'
	   		});
	   	   		
	   		confirmPopup.then(function(res) {
			    if(res) {
			    	var index = $scope.collectionList.indexOf(list);
					$scope.collectionList.splice(index, 1);
					Requests.removeTag($window.localStorage.getItem('userId'), list.text)
					.then(function(response) {
						if (response.data.status === "successfull") {
							$scope.updateMenu();
						} else if (response.data.status === "failed") {
							$rootScope.showAlert("Serverproblemer", "Slettingen ble ikke utført");
						}
					}, function(response) {
						$rootScope.showAlert("Serverproblemer", "Prøv igjen nå eller senere");
					});
		     	} else {
					$rootScope.showAlert("Serverproblemer", "Prøv igjen nå eller senere");
		     	}
		   	}); 
	}

	$scope.myGoBack = function() {
			var cState = $ionicHistory.currentStateName(); 
			if (cState == 'app.listView' || cState == 'app.settings' || cState == 'app.appOne' || cState == 'app.about' ||cState == 'app.acknowledgment' || cState == 'app.notificationView') {
				$ionicHistory.goBack();
				$ionicSideMenuDelegate.toggleLeft()
			}
			else if (cState == 'app.story' || cState == 'app.editProfile' || cState == 'app.editPreferences' ) {
				$ionicHistory.goBack();
			}

		};

		// Update the bookmark lists in the menu. 
	$scope.updateMenu = function() {
		Requests.getAllLists($window.localStorage.getItem('userId')).then(function(response) {
			$scope.collectionList = response.data;
			$scope.userMadeLists = [];
			$scope.defaultLists = [];
			for(var i = 0; i < $scope.collectionList.length; i++) {
				var tagName = $scope.collectionList[i].text;
				if(tagName == "Anbefalte fortellinger" || tagName == "Vurderte fortellinger" /*|| tagName == "Les senere"*/) {
					$scope.defaultLists.push($scope.collectionList[i]);
				} else {
					$scope.userMadeLists.push($scope.collectionList[i]);
				}
			}
		}, function(response) {
			if ($rootScope.networkAccess) {
					$rootScope.popup("Serverproblemer", "Prøv igjen nå eller senere" );
				}
				else {
					$rootScope.popUp("Ingen nettilgang", "Applikasjonen trenger en internettforbindelse for å virke");
				}
		});
	};

	$scope.viewNotifications = function() {
		$state.go("app.notificationView");
	}

	$scope.openUrl = function(url) {
		open(url, '_system');
	}


	$scope.updateMenu();

})
