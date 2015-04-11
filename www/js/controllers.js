angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, Requests, User, $state, $ionicModal, $timeout, $rootScope ) {


$scope.responseData = {}
$scope.tempMail ;


  $scope.doLogin = function(email) {
      console.log('Mail : ' + email);
      $scope.tempMail = email;
      
      //request backend for the user with Email // 
      Requests.getUserFromEmail(email).then(function(response){
        $scope.responseData =  response.data;
        console.log('User : ', $scope.responseData.userModel);

          //For debugging
        console.log('Respons : ', $scope.responseData);
        console.log('responseData Model : ', $scope.responseData.userModel);
        
          //Checks if the userId is assisiated with a email then Login ok and sets scope.user to the model from backend
        if ($scope.responseData.status != "failed") {
          console.log('Første IF : ' + $scope.responseData.userModel.userId);
          $scope.user =  $scope.responseData.userModel

            //Sets the localStorage userId 
          window.localStorage['userId'] = $scope.user.userId;
        
            //TODO: Set user assosiated with the email ??
          $state.go("profile");
        }

          //If the e-mail is not recorded in the database make a new user 
        else {

            //Makes a new User object to send to backened
          $scope.user = new User($scope.tempMail);
         
          //TODO: / Gi beskjed om at ny bruker ble opprettet
          
            //Setting the provided mail(parameter) as email attribut on user
          $scope.user.email = $scope.tempMail
          Requests.addUser(email).then(function(response){
            $scope.responseData =  response.data;
            console.log('New user: ', $scope.responseData.status);

            if ($scope.responseData.status != "failed") {
              Requests.getUserFromEmail($scope.tempMail).then(function(response){
                $scope.responseData =  response.data;
                console.log('User : ', $scope.responseData.userModel);
                  //Sets the recived model as the user
                $scope.user =  $scope.responseData.userModel;
                console.log('New userId : ', $scope.user.userId);
                  //Sets the localStorage userId 
                window.localStorage['userId'] = $scope.user.userId;
                  //Go to the next view 
                $state.go("profile");
              });
            };
          });
        };
       /*
       $timeout(function() {
          //TODO: Sett opp feilmelding
          $state.go("profile");
        }, 1000);*/
      });
  }; 

    // Triggered in the login view to skip it
  $scope.closeLogin = function() {

     //Makes a new User object to send to backened Sets mail as -1 when no mail is provided
    $scope.user = new User(-1);
    
    console.log("Skip login, user:" + $scope.user);
    
    Requests.addUser(-1).then(function(response){
      $scope.responseData =  response.data;
      console.log('New user: ', $scope.responseData.status);
      $scope.user.userId = $scope.responseData.userId;
      console.log('New user: ', $scope.responseData);
      console.log('New userId: ', $scope.user.userId);

      if ($scope.responseData.status != "failed") {
        Requests.getUserFromId($scope.user.userId).then(function(response){
          $scope.responseData =  response.data;
          console.log('User : ', $scope.responseData.userModel);
            //Sets the recived model as the user
          $scope.user =  $scope.responseData.userModel;
          console.log('New userId : ', $scope.user.userId);
            //Sets the localStorage userId 
          window.localStorage['userId'] = $scope.user.userId;
            
            //setting mail as -1 and pushing to backend
            $scope.user.email = "-1";
          console.log('UpdateUser: ', $scope.user);
          Requests.updateUser(new User($scope.user)).then(function(response){
            console.log('Update User: ', $scope.responseData.status);
            console.log('Update User data: ', $scope.responseData);
          });
        });
      };
      //TODO: Gi beskjed om at det er opprettet en ny brukker / evt spør om det er ønsket til brukeren
    $state.go("profile");
    });
  };
  
    // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


/*
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
*/
  $scope.logout = function() {
    window.localStorage['userId'] = "-1";
    $state.go("login");
    console.log(window.localStorage['userId']);
  }


  //Next and previous view - input is view to navigate to

  $scope.goLogin = function() {
    $state.go("login");
    console.log("vi " + vi);
  };

  $scope.goPref = function() {
    $state.go("preferences");
  };

  $scope.goProfile = function() {
      $state.go("profile");
  };



  //Profile


  // Preferences
  function Category(name, icon, isSelected) {
    this.name = name;
    this.icon = icon;
    this.isSelected = isSelected;
  };
  $scope.categories = [];
  /*for(i=0; i<9; i++) {
      $scope.categories.push(new Category("Navn", "ion-star", false));
  };*/
	$scope.categories.push(new Category("Kunst", "icon-art", false));
	$scope.categories.push(new Category("Arkitektur", "icon-architecture", false));
	$scope.categories.push(new Category("Arkeologi", "icon-archeology", false));
	$scope.categories.push(new Category("Historie", "icon-history", false));
	$scope.categories.push(new Category("Musikk", "ion-music-note", false));
	$scope.categories.push(new Category("Natur", "icon-nature", false));
	$scope.categories.push(new Category("Litteratur", "ion-ios-book", false));
	$scope.categories.push(new Category("Tradisjon & mat", "icon-tradition", false));
	$scope.categories.push(new Category("Teknologi", "icon-technology", false));
	

  $scope.submitPreferences = function() {
    console.log("Submitting preferences");
    $state.go("app.recommendations");
  };

  //Need the userId to make this work
  /*Requests.getAllLists($scope.user.userId).then(function(response){
	$scope.collectionList = response.data;
  });*/
})

.controller('ListViewCtrl', function($scope, Requests, $state, $rootScope, $ionicLoading, categoryPicker) {
  //Display loading screen
  $ionicLoading.show({
      template: 'loading'
  });

  //Call the categoryPicker service
  $scope.chooseCategories = function(categories) {
     categoryPicker(categories);
  };

  //Controlleren må hente Requests
  //Må ha .then() for å kunne hente fra http.post i backend.services
  Requests.getMultipleStories().then(function(response){
    $scope.storyPreviews =  response.data;
    $ionicLoading.hide();
  });
  /*
  //some test data for the listview
  $scope.storyPreviews = [
    { id: 0,
    title: 'Nidarosdomen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    thumbnail: 'https://media.snl.no/system/images/8077/standard_nidarosdomen__e2_80_93_1_4.jpg',
	categories: ['kat1']
	},
    { id: 1,
    title: 'Holmenkollen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://img2.custompublish.com/getfile.php/2131868.92.bcqacdpwfu/holmenkollen_f_ntb_meldetjeneste_skiforeningen.jpg?return=www.langrenn.com',
	categories: ['kat1']
	},
    { id: 2,
    title: 'Galdhøpiggen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://peakbook.org/gfx/images/1/5c/jans_hpiggen.jpg/jans_hpiggen-1.jpg',
	categories: ['kat1']
	},
    { id: 3,
    title: 'Oldemors dukkehus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.3204/7443?width=600&height=380',
	categories:['kat1']
	},
    {  id: 4,
    title: '17. mai på Songe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.2776/6481?width=600&height=380',
	categories:['kat1']
	},
  ];*/

  //remove a story from the listview
  $scope.remove = function(story) {
	 var index = $scope.storyPreviews.indexOf(story);
	 $scope.storyPreviews.splice(index, 1);
  };
  
  $scope.open = function(story) {
    Requests.setSelectedStory(story.id);
    $state.go("app.story");
  };
})


.controller('RecommendationCtrl', function($scope, Requests, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state) {
  var storyPreviews = [];
  $scope.stories = [];
  $scope.userId = window.localStorage['userId'];

   //Display loading screen
  $ionicLoading.show({
      template: 'loading'
    });

  Requests.getMultipleStories().then(function(response){
    $scope.storyPreviews =  response.data;
    return Requests.getStory($scope.storyPreviews[0].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    return Requests.getStory($scope.storyPreviews[1].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    return Requests.getStory($scope.storyPreviews[2].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    $ionicSlideBoxDelegate.update();
    $ionicLoading.hide();
  });

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.rejectStory = function(index) {
    //$scope.stories.splice(index, 1);
    console.log("Reject story");
    
  };

  $scope.openStory = function(story) {
    Requests.setSelectedStory(story.storyId);
    $state.go("app.story");
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

    $scope.$on('$ionicView.beforeEnter', function(){
        $ionicSlideBoxDelegate.update();
    });

})

.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Requests, Story, $rootScope, $sce, $ionicLoading) {

    //Display loading screen
    $ionicLoading.show({
      template: 'loading'
    });

    $scope.userId = window.localStorage['userId'];

    // Get story data. 
    //$scope.story = Stories.all()[0];
    //console.log($stateParams.id);
    //Controlleren må hente Requests og Story
    //Må ha .then() for å kunne hente fra http.post i backend.services
    //Requests.getStory('DF.1098').then(function(response){
    Requests.getStory(Requests.getSelectedStory(), $scope.userId).then(function(response){
      //Henter bare en spesifik historie nå, visste ikke hvordan jeg skulle hente
      //id-er fra array
      // GetStory parameter 2(userID er $scope.user.userId)
      $scope.story = new Story(response.data);

      //Decide what media format to display first
      if($scope.story.videoList) {
        $scope.mediaType = "video";
      } else if($scope.story.audioList) {
        $scope.mediaTypes = "sound";
      } else {
        $scope.mediaType = "images";
      }
      $ionicLoading.hide();
    });

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
      var video = document.getElementById("Video" + index);
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullScreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
      video.play();
    };

    $scope.openUrl = function(url) {
      window.open(url, '_system');
    };
})


.controller("RatingCtrl", function($scope, Requests) {
        $scope.userId = window.localStorage['userId'];
        $scope.rating = 0;
      
        // Rate story
        $scope.rateFunction = function(rating) {
            $scope.rating = rating;
            Requests.addRating($scope.story.storyId, $scope.userId, rating);
            console.log("Rated story: " + rating);
        };
})

.controller('BookmarkCtrl', function($scope, $rootScope, Requests) {
      $scope.userId = window.localStorage['userId'];

	     	// May use the collectionList in AppCtrl instead
        // The collections a user has, and whether this story is in it.
        Requests.getAllLists($scope.userId).then(function(response) {
          $scope.collectionList = response.data;
          console.log($scope.collectionList);
        });

        // Display text field to enter name of new collection
        $scope.newItem = function() {
          $scope.displayTextField = true;
        };

        // Add text entered as a new collection and add the story to it. 
        $scope.addItem = function() {

            $scope.collectionList.push({text: $scope.newItemName, checked: true});
			     
             //Need the userId for this to work
			       Requests.addNewTag($scope.newItemName, $scope.userId, Requests.getSelectedStory());
            $scope.newItemName = null;
            $scope.displayTextField = false;
        };

        $scope.addTag = function(tag) {
            $scope.collectionList[tag.text] = true;
            Requests.tagStory(tag.text, $scope.userId, Requests.getSelectedStory);
        };

});
