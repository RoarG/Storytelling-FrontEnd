////////////////////////
//  Story 
////////////////////////

angular.module('StoryCtrl', [])

stories.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Requests, Story, $rootScope, $sce, $ionicLoading) {

	$scope.story = Requests.getSelectedStory();

	//Decide what media format to display first
	if ($scope.story.videoList) {
		$scope.mediaType = "video";
	} else if ($scope.story.audioList) {
		$scope.mediaTypes = "sound";
	} else {
		$scope.mediaType = "images";
	}

	// Display selected image in modal. 
	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/image-popover.html');
	};

	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove();
	};

	// Necessary for video urls
	$scope.getTrustedUrl = function(url) {
		return $sce.trustAsResourceUrl(url);
	};

	// Play selected video in fullscreen
	$scope.playVideo = function(index) {
		$scope.fullscreen = false;
		$scope.video = document.getElementById("Video" + index);
		if ($scope.video.webkitEnterFullscreen) {
			$scope.video.webkitEnterFullscreen();
		} else if ($scope.video.webkitRequestFullScreen) {
			$scope.video.webkitRequestFullScreen();
		} else if ($scope.video.requestFullscreen) {
			$scope.video.requestFullscreen();
		}
		$scope.video.play();
	};

	document.addEventListener('webkitfullscreenchange', function(e) {
		if ($scope.fullscreen) {
			$scope.video.pause();
			console.log("Exit fullscreen");
		} else {
			$scope.fullscreen = true;
			console.log("Enter fullscreen");
		}
	});

	$scope.openUrl = function(url) {
		window.open(url, '_system');
	};
})