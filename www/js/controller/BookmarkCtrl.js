////////////////////////
//  Bookmark 
////////////////////////

//TODO: Forklar!

angular.module('BookmarkCtrl', [])


stories.controller('BookmarkCtrl', function($scope, $rootScope, Requests, $window) {

	
	$scope.userId = $window.localStorage.getItem['userId'];
	$scope.storyId = Requests.getSelectedStory();
	
	//TODO:  Forklar!
	Requests.getStoryTags($scope.userId, $scope.storyId).then(function(response) {
		$scope.tags = response.data;

	//TODO: Fix!
	// May use the collectionList in AppCtrl instead
	// The collections a user has, and whether this story is in it.
	Requests.getAllLists($scope.userId).then(function(data, status) {
		$scope.collectionList = data;
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
	}, function(data, status) {
		console.log(status);
 	});
});

	// Display text field to enter name of new collection
	$scope.newItem = function() {
		$scope.displayTextField = true;
	};

	// Add text entered as a new collection/bookmark and add the story to it. 
	$scope.addItem = function() {
		if ($scope.newItemName) {
			$scope.collectionList.push({
				text: $scope.newItemName,
				checked: true
			});

			//Need the userId for this to work
			Requests.addNewTag($scope.newItemName, $scope.userId, $scope.story.storyId);
			$scope.tags.push($scope.newItemName);
			$scope.newItemName = null;
		}
		$scope.displayTextField = false;
	};

	//TODO: Hva gjør den/Hvordan?
	$scope.addTag = function(tag) {
		if (!tag.checked) {
			Requests.removeTagStory(tag.text, $scope.userId, $scope.story.storyId);
			for (var i = 0; i < $scope.tags.length; i++) {
				if ($scope.tags[i].valueOf() == tag.text.valueOf()) {
					$scope.tags.splice(i, 1);
				}
			}
			//TODO: Forklar.
		} else {
			Requests.tagStory(tag.text, $scope.userId, $scope.story.storyId);
			$scope.tags.push(tag["text"]);
		}
	};

})