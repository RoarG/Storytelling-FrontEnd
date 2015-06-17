////////////////////////
//  Story 
////////////////////////

// Controller for displaying story content and viewing the associated media content. 

angular.module('StoryCtrl', [])

stories.controller('StoryCtrl', function(
	$window,
	$scope,
	$stateParams,
	$ionicPopup,
	$ionicModal,
	$ionicPopover,
	$sce,
	$ionicLoading,
	$cordovaInAppBrowser,
	$timeout,
	$ionicScrollDelegate,
	$ionicHistory,
	$cordovaDialogs,
	$interval,
	$rootScope,
	$cordovaSocialSharing,
	uiGmapGoogleMapApi,
	Requests,
	Story) {

	$scope.storyId = Requests.getSelectedStory();
	$scope.userId = $window.localStorage.getItem('userId');

	$scope.devicePlatform = ionic.Platform.isAndroid();
	console.log('platform ' + $scope.devicePlatform);

	// uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.map = {
    		center: { latitude: 45, longitude: -73 },
    		zoom: 8,
    		options: {
    			disableDefaultUI: true
    		}
    		
    	};
    	$scope.marker = {
        id: 0,
        coords: {
          latitude: 45,
          longitude: -73
        },
		

      }; 
       
      $scope.marker.options = {
        draggable: false,
        labelContent: "lat: " + $scope.marker.coords.latitude + '<br/> ' + 'lon: ' + $scope.marker.coords.longitude,
        labelAnchor: "73 120",
        labelClass: "marker-labels",
        title: "Fortelling"
        /*icon: {
        	url: "../../img/map_marker.png",
        	scaledSize: new google.maps.Size(34, 44)
        }*/
      };  
    	console.log($scope.map);
    });

	$scope.twtouched = false;
	$scope.fbtouched = false;
	$scope.alttouched = false;


	$scope.showAlert = function(title, msg) {
			var alertPopup = $ionicPopup.alert({
				cssClass: 'alertPopup',
				title: title,
				template: msg
			});
			alertPopup.then(function(response) {
				//Do something when closing the alert box
				console.log('closing the alert box');
			});
	};

	// Get the story data so it can be displayed
	Requests.getStory($scope.storyId, $scope.userId).then(function(response) {
		$scope.story = new Story(response.data);

		//Decide what media type to display first (images, video or audio), depending on which media types are available. 
		if ($scope.story.videoList) {
			$scope.mediaType = "video";
			// If any of the videos are from youtube or vimeo, the url has to be changed so that it can be embedded in iframe. 
			for (var i = 0; i < $scope.story.videoList.length; i++) {
				var video = $scope.story.videoList[i];
				// Youtube: 
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = video['videourl'].match(regExp);
				if (match && match[2].length == 11) {
					video['videourl'] = 'https://www.youtube.com/embed/' + match[2] + "?autoplay=1&showinfo=0&controls=1&modestbranding=1&playsinline=1";
				}
				// Vimeo:
				else if (video['videourl'].indexOf("vimeo.com") !== -1) {
					var r = /(videos|video|channels|\.com)\/([\d]+)/;
					video['videourl'] = "https://player.vimeo.com/video/" + video['videourl'].match(r)[2];
				}
			}
		} else if ($scope.story.audioList) {
			$scope.mediaType = "audio";

		} else {
			$scope.mediaType = "images";
		}

		// Creates audio files from the audio urls using the Cordova plugin Media. 
		// Adds them to the dictionary audioFiles so that they can be easily played later,
		// along with the current position so that the playing can easily be resumed. 
		if ($scope.story.audioList) {
			$scope.audioFiles = {};

			for (var i = 0; i < $scope.story.audioList.length; i++) {
				$scope.audioFiles[$scope.story.audioList[i]["audiourl"]] = [new Media($scope.story.audioList[i]["audiourl"],
					// success callback
					function() {
						console.log("playAudio():Audio Success");
					},
					// error callback
					function(err) {
						console.log("playAudio():Audio Error: " + err);
					}
				), 0];

			}
		}

		$ionicLoading.hide();
	}, function(response) {
		// If story data is not successfully retrieved, go back to recommendation view. 
		$ionicLoading.hide();
		$ionicHistory.goBack();
		$scope.showAlert('Vettu Hva?', 'Får ikke åpnet fortellingen');
	});


	// Code to enable vertical scrolling when touching the media container.
	// Allows touch event in media container to propagate to outer container.
	// http://codepen.io/anon/pen/BoGkA
	$timeout(function() {
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
			e.preventDefault = function() {}
			originaltouchStart.apply(sv, [e]);
		}
		sv.touchMove = function(e) {
			e.preventDefault = function() {}
			originaltouchMove.apply(sv, [e]);
		}
		sv.mouseDown = function(e) {
			e.preventDefault = function() {}
			originalmouseDown.apply(sv, [e]);
		}
		sv.mouseMove = function(e) {
			e.preventDefault = function() {}
			originalmouseMove.apply(sv, [e]);
		}
		container.addEventListener("touchstart", sv.touchStart, false);
		container.addEventListener("mousedown", sv.mouseDown, false);
		document.addEventListener("touchmove", sv.touchMove, false);
		document.addEventListener("mousemove", sv.mouseMove, false);
	});

	$scope.$on('$ionicView.leave', function() {
		// Pause all audio files when leaving the story view. 
		for (var url in $scope.audioFiles) {
			if ($scope.audioFiles.hasOwnProperty(url)) {
				$scope.audioFiles[url][0].pause();
			}
		}
	});

	$scope.twitterShare = function(message) {
		$ionicLoading.show({
			template: '<h2>Åpner Twitter</h2>'
		})

		// Visual indication when pressing the icon
		$scope.twtouched = true;
		setTimeout(function() {
			$scope.twtouched = false;
		}, 200);

		if ($scope.devicePlatform) {
			//First check if one can share on twitter
			$cordovaSocialSharing.shareViaTwitter("#VettuHva!", null, message)
			.then(function(result) {
				//Success!
			}, 	function(error) {
					$scope.showAlert('Vettu Hva?', 'Finner ikke Twitter applikasjonen');
				});
		}
			//Else IOS
		else {
			$cordovaSocialSharing.shareViaTwitter("#VettuHva!", null, message)
		}		
		$ionicLoading.hide();
	}

	$scope.fbShare = function(link) {
		$ionicLoading.show({
			template: '<h2>Åpner Facebook</h2>'
		})

		// Visual indication when pressing the icon
		$scope.fbtouched = true;
		setTimeout(function() {
			$scope.fbtouched = false;
		}, 200);

 			//If Android
		if ($scope.devicePlatform) {
			$cordovaSocialSharing.shareViaFacebook(link)
			.then(function(result) {
		      // Success!
			}, 	function(err) {
		      // An error occurred. Show a message to the user
				$scope.showAlert('Vettu Hva?', 'Finner ikke Facebook applikasjonen');
		     	});
		}
			//Else IOS
		else {
			$cordovaSocialSharing.shareViaFacebook(link);
		}		    
		$ionicLoading.hide();
	}

	//TODO: Hvorfor er denne så treg??
	$scope.altShare = function(message) {
		$ionicLoading.show({
			template: '<h2>Åpner delesenter</h2>'
		})
		
		// Visual indication when pressing the icon
		$scope.alttouched = true;
		setTimeout(function() {
			$scope.alttouched = false;
		}, 200)

		$window.plugins.socialsharing.share(message, "Vettu Hva? - Fortelling");
	
		$ionicLoading.hide();
	}

	// Display selected image in fullscreen in a modal. 
	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/image-popover.html');
	};

	// Displays the modal defined in templateUrl on top of the current view. 
	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, function(modal) {
			// Sends story data to the controller of the modal. 
			$scope.childCtrl = modal;
			$scope.childCtrl.story = $scope.story;
		}, {
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

	// Tells angular that the url is safe. Necessary for video urls. 
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

		// Continues to ask for the position in the audio file
		// so that the slider can be moved to the correct position. 
		interval = $interval(function() {
			$scope.audioFiles[url][0].getCurrentPosition(function(result) {
				if (result != -1) {
					$scope.audioFiles[url][1] = result;
				}
				if (result >= $scope.audioFiles[url][0].getDuration() - 1 || result == -1) {
					$scope.isAudioPlaying = false;
					$scope.audioFiles[url][1] = -1;
					$interval.cancel(interval);
				}
			})

		}, 1000);
	};
	// Pauses audio and stops checking for new position in audio file. 
	$scope.pauseAudio = function(url) {
		$scope.isAudioPlaying = false;
		$scope.audioFiles[url][0].pause();
		$interval.cancel(interval);
	}

	// The user has moved the position in the audio file. Updates it. 
	$scope.sliderPositionChange = function(url) {
		var mediaInMilli = $scope.audioFiles[url][1] * 1000;
		$scope.audioFiles[url][0].seekTo(mediaInMilli);
	};

	// Listens to event saying that fullscreen has been entered/exited
	// Unlocks orientation if fullscreen, goes to portrait orientation 
	// and pauses video if going out of fullscreen. 
	document.addEventListener('webkitfullscreenchange', function(e) {
		if ($scope.fullscreen) {
			$scope.video.pause();
			screen.lockOrientation('portrait')
		} else {
			$scope.fullscreen = true;
			screen.unlockOrientation()
		}
	});

	// Opens url in native browser. 
	$scope.openUrl = function(url) {
		open(url, '_system');
	};

	// Opens link clicked in event in native browser, if what was clicked is a proper link. 
	$scope.onclickStoryContent = function(e) {
		e = e || window.event;
		var element = e.target || e.srcElement;

		if (element.tagName == 'A' && element.href && element.href.indexOf("#") === -1) {
			open(element.href, "_system", "location=no");

			return false; // prevent default action and stop event propagation
		}
	};

	$scope.debug = function(e) {
		console.log("E: ", e);
	}

})
