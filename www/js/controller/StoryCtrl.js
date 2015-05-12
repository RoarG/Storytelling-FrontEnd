////////////////////////
//  Story 
////////////////////////

//TODO: Forklar!

angular.module('StoryCtrl', [])

stories.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Requests, Story, $rootScope, $sce, $ionicLoading, $window, $cordovaInAppBrowser, $timeout, $ionicScrollDelegate, $ionicHistory, $cordovaDialogs, $interval) {

	$scope.storyId = Requests.getSelectedStory();
	$scope.userId = $window.localStorage.getItem('userId');

	console.log("storyId", $scope.storyId, "userid" , $scope.userId);
	// Get story data.
	//TODO: Forklar!
	Requests.getStory($scope.storyId, $scope.userId).then(function(response) {
		$scope.story = new Story(response.data);
		console.log(response);
		console.log($scope.story.imageList);



		//Decide what media format to display first
		if ($scope.story.videoList) {
			$scope.mediaType = "video";
			// If any of the videos are from youtube or vimeo, the url has to be changed so that it can be embedded in iframe. 
			for (var i = 0; i < $scope.story.videoList.length; i++) {
				var video = $scope.story.videoList[i];
				console.log("Video: " + video['videourl']);
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = video['videourl'].match(regExp);
				if (match && match[2].length == 11) {
					video['videourl'] = 'https://www.youtube.com/embed/' + match[2] + "?autoplay=0&showinfo=0&controls=1";
				} else if (video['videourl'].indexOf("vimeo.com") !== -1) {
					var r = /(videos|video|channels|\.com)\/([\d]+)/;
					video['videourl'] = "//player.vimeo.com/video/" + video['videourl'].match(r)[2];
					console.log("Vimeo: " + video['videourl']);
				}
			}
		} else if ($scope.story.audioList) {
			console.log($scope.story.audioList[0]["audiourl"])
			$scope.mediaType = "audio";

			$scope.audioFiles = {};
			for (var i = 0; i < $scope.story.audioList.length; i++) {
				$scope.audioFiles[$scope.story.audioList[i]["audiourl"]] = [new Media($scope.story.audioList[i]["audiourl"],
					// success callback
					function () { console.log("playAudio():Audio Success"); },
					// error callback
					function (err) { console.log("playAudio():Audio Error: " + err); }
				), 0];
				$scope.audioFiles[$scope.story.audioList[i]["audiourl"]][0].getCurrentPosition(function(position) {
					console.log("Audio position: " + position);
				})

			}

		} else {
			$scope.mediaType = "images";
		}

		

	$ionicLoading.hide();
	}, function(response) {
		console.log(response);
		$ionicLoading.hide();
		$ionicHistory.goBack();
		$cordovaDialogs.alert("Får ikke åpnet historien");
	});


	// Code to enable vertical scrolling when touching the media container.
	// Allows touch event in media container to propagate to outer container.
	// http://codepen.io/anon/pen/BoGkA
	$timeout(function(){
    //return false; // <--- comment this to "fix" the problem
    var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();
    var container = sv.__container;
    var originaltouchStart = sv.touchStart;
    var originalmouseDown = sv.mouseDown;
    var originaltouchMove = sv.touchMove;
    var originalmouseMove = sv.mouseMove;
    container.removeEventListener('touchstart', sv.touchStart);
    container.removeEventListener('mousedown', sv.mouseDown);
    document.removeEventListener('touchmove', sv.touchMove);
    document.removeEventListener('mousemove', sv.mousemove);
    sv.touchStart = function(e) {
      e.preventDefault = function(){}
      originaltouchStart.apply(sv, [e]);
    }
    sv.touchMove = function(e) {
      e.preventDefault = function(){}
      originaltouchMove.apply(sv, [e]);
    }
    sv.mouseDown = function(e) {
      e.preventDefault = function(){}
      originalmouseDown.apply(sv, [e]);
    }
    sv.mouseMove = function(e) {
      e.preventDefault = function(){}
      originalmouseMove.apply(sv, [e]);
    }
    container.addEventListener("touchstart", sv.touchStart, false);
    container.addEventListener("mousedown", sv.mouseDown, false);
    document.addEventListener("touchmove", sv.touchMove, false);
    document.addEventListener("mousemove", sv.mouseMove, false);
  });

		// Display selected image in modal. 
		$scope.showImages = function(index) {
			$scope.activeSlide = index;
			$scope.showModal('templates/image-popover.html');
		};

		//TODO: Forklar!
		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, function(modal) {
						$scope.childCtrl = modal;
						$scope.childCtrl.story = $scope.story;
			}, 
			{
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

		// Necessary for video urls //TODO: Forklar! WHY?
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

		// Play audio
		$scope.playAudio = function(url) {
			$scope.isAudioPlaying = true;
			$scope.audioFiles[url][0].play();

			interval = $interval(function() {
	     		$scope.audioFiles[url][0].getCurrentPosition(function(result) {
	     			if(result != -1) {
	     				$scope.audioFiles[url][1] = result;
	     			}
	     			if(result >= $scope.audioFiles[url][0].getDuration()-1 || result == -1) {
	     				$scope.isAudioPlaying = false;
	     				$scope.audioFiles[url][1] = -1;
	     				$interval.cancel(interval);
	     			}

	     			console.log("Currently: " + result + "/" +  $scope.audioFiles[url][0].getDuration());
	     		})
	     		
   			},1000);
		};

		$scope.pauseAudio = function(url) {
			$scope.isAudioPlaying = false;
			$scope.audioFiles[url][0].pause();
			$interval.cancel(interval);
		}

		$scope.sliderPositionChange = function(url) {
     		var mediaInMilli = $scope.audioFiles[url][1]*1000;
     		$scope.audioFiles[url][0].seekTo(mediaInMilli);
   		};

		//TODO: Forklar!
		document.addEventListener('webkitfullscreenchange', function(e) {
			if ($scope.fullscreen) {
				$scope.video.pause();
				console.log("Exit fullscreen");
				screen.lockOrientation('portrait')
			} else {
				$scope.fullscreen = true;
				console.log("Enter fullscreen");
				screen.unlockOrientation()
			}
		});
		
		//TODO: Forklar!
		$scope.openUrl = function(url) {
			open(url, '_system');
		};

		// Open all links in native browser
		$scope.onclickStoryContent = function (e) {
            e = e ||  window.event;
            var element = e.target || e.srcElement;

            if (element.tagName == 'A' && element.href && element.href.indexOf("#") === -1) {
              console.log(e);
                open(element.href, "_system", "location=no");
                
                return false; // prevent default action and stop event propagation
            }
        };
	})