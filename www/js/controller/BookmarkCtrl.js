////////////////////////
//  Bookmark 
////////////////////////

// Controller that handles the bookmarks for a story. 

angular.module('BookmarkCtrl', [])


stories.controller('BookmarkCtrl', function($scope, $rootScope, Requests, $window, $cordovaDialogs) {

	
	$scope.userId = $window.localStorage.getItem('userId');
	$scope.storyId = Requests.getSelectedStory();
	
	// Gets all the bookmarks associated with the story.  
	Requests.getStoryTags($scope.userId, $scope.storyId).then(function(response) {
		$scope.tags = response.data;
		console.log($scope.tags);

	// Gets all the bookmark lists the user has.
	// Then goes through them and sets "checked" to true/false depending on whether the story has that bookmark. 
	Requests.getAllLists($scope.userId).then(function(response) {
		$scope.collectionList = response.data;
		for (var i = 0; i < $scope.collectionList.length; i++) {
			for (var j = 0; j < $scope.tags.length; j++) {
				if ($scope.collectionList[i]["text"].valueOf() === $scope.tags[j]["text"].valueOf()) {
					$scope.collectionList[i]["checked"] = true;
				}
			}
			if ($scope.collectionList[i]["checked"].valueOf() === "".valueOf()) {
				$scope.collectionList[i]["checked"] = false;
			}
		}
	}, function(response) {
		$cordovaDialogs.alert("Får ikke tak i bokmerker");
 	});
}, function(response) {
	$cordovaDialogs.alert("Får ikke tak i bokmerker");
});

	// Display text field to enter name of new bookmark list
	$scope.newItem = function() {
		$scope.displayTextField = true;
	};

	// Add text entered as a new bookmark list and add the story to it. 
	$scope.addItem = function() {
		if ($scope.newItemName && !$scope.containsObjectWithProperty($scope.collectionList, "text", $scope.newItemName)) {
			$scope.collectionList.push({
				text: $scope.newItemName,
				checked: true
			});

			Requests.addNewTag($scope.newItemName, $scope.userId, $scope.storyId);
			$scope.tags.push($scope.newItemName);
		}
		$scope.newItemName = null;
		$scope.displayTextField = false;
	};

	// Checks whether an array contains an object with a property with a certain value. 
	$scope.containsObjectWithProperty = function(array, propertyName, property) {
		for(var i = 0; i < array.length; i++) {
			if(array[i][propertyName] && array[i][propertyName] === property) {
				return true;
			}
		}
		return false;
	}

	// Toggles whether a tag is associated with the story. 
	$scope.toggleTag = function(tag) {
		// If the story already had that tag, remove the tag. 
		if (!tag.checked) {
			Requests.removeTagStory(tag.text, $scope.userId, $scope.storyId);
			for (var i = 0; i < $scope.tags.length; i++) {
				if ($scope.tags[i].valueOf() == tag.text.valueOf()) {
					$scope.tags.splice(i, 1);
				}
			}
		// If the story does not already have the tag, add the tag. 
		} else {
			Requests.tagStory(tag.text, $scope.userId, $scope.storyId);
			$scope.tags.push(tag["text"]);
		}
	};

})