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
	Requests, 
	User
) {

	$scope.group = false;
	
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
					Requests.removeTag($window.localStorage.getItem('userId'), list.text);
					//TODO: Håndtere fail for Requests  
					$scope.updateMenu();
		     	} else {
		    	   console.log('Noe gikk galt');
		     	}
		   	}); 
	}


	$scope.myGoBack = function() {
			$ionicHistory.goBack();
			$ionicSideMenuDelegate.toggleLeft()
		};

	

		// Update the bookmark lists in the menu. 
	$scope.updateMenu = function() {
		Requests.getAllLists($window.localStorage.getItem('userId')).then(function(response) {
			$scope.collectionList = response.data;
			$scope.userMadeLists = [];
			$scope.defaultLists = [];
			for(var i = 0; i < $scope.collectionList.length; i++) {
				var tagName = $scope.collectionList[i].text;
				if(tagName == "Historikk" || tagName == "Lest" /*|| tagName == "Les senere"*/) {
					$scope.defaultLists.push($scope.collectionList[i]);
				} else {
					$scope.userMadeLists.push($scope.collectionList[i]);
				}
			}
		}, function(response) {
			if ($rootScope.networkAccess) {
					$rootScope.popup("Server problemer", "Prøv igjen nå eller senere" );
				}
				else {
					$rootScope.popUp("Ingen nettilgang", "Appliksjonen trenger en internett forbindelse for å virke");
				}
		});
	};

	$scope.updateMenu();


})
