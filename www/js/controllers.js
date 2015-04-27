angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, Requests, User, $state, $ionicModal, $timeout, $ionicLoading,$rootScope, $ionicPlatform, $cordovaDialogs) {

  ////////////////////////
  // Onboarding
  ////////////////////////

/*$scope.hide = function () {*/
  console.log("Windows.Statusbar" + window.StatusBar)
/*}*/

  ////////////////////////
  // Login
  ////////////////////////


$scope.responseData = {}
$scope.tempMail = null;
$scope.user = {};

  $scope.doLogin = function(email) {

      //TODO: Mail verifisring

      console.log('Mail : ' + $scope.user.email);
      $scope.tempMail = email;
      
      //request backend for the user with Email // 
      Requests.getUserFromEmail(email).then(function(response){
        $scope.responseData =  response.data;
        window.localStorage['responseData'] =  response.data; 

          //For debugging
        console.log('Respons, Eksistere bruken : ', $scope.responseData);
        console.log('User : ', $scope.responseData.userModel);
          //SJEKK OM JEG FÅR SATT DENNE!!!! tol objetet
        console.log('Respons, Eksistere bruker  2: ', $scope.responseData);
          //Checks if the userId is assisiated with a email then Login ok and sets scope.user to the model from backend
        if ($scope.responseData.status != "failed") {
          $scope.user = new User(response.data.userModel.userId, response.data.userModel);
          console.log($scope.user);
          console.log('User id : ' + $scope.responseData.userModel.userId);
          /*$scope.user =  $scope.responseData.userModel*/

            //Sets the localStorage userId 
          window.localStorage['userId'] = $scope.user.userId;
         
          window.localStorage['userModel'] = $scope.responseData.userModel;
            //Onbaoarding will not be showing next app startup
          window.localStorage['newUser'] = true;
          
          console.log('User model : ' + $scope.responseData);
            //TODO: Set user assosiated with the email ??
          $state.go("app.recommendations");

            //Sets the input as a empty string
          $scope.user.email = '';
        }

          //If the e-mail is not recorded in the database make a new user 
        else {

            //Makes a new User object to send to backened
            /*$scope.user = new User($scope.tempMail);*/
            //TODO: / Gi beskjed om at ny bruker ble opprettet
           
            //Setting the provided mail(parameter) as email attribut on user
          $scope.user.email = $scope.tempMail
          Requests.addUser(email).then(function(response){
            $scope.responseData =  response.data;
            console.log('Responsdata etter addUser :', $scope.responseData);
            console.log('New user id: ', $scope.responseData.userId);
        
              //Sets the localStorage userId 
            window.localStorage['userId'] = $scope.responseData.userId;
            
              //Go to the next view 
            $state.go("profile");
               //Sets the input as a empty string
            $scope.user.email = '';

              //If the addUser failed for some reason
            if ($scope.responseData.status != "sucessfull") {
             /* Requests.getUserFromEmail($scope.tempMail).then(function(response){
                $scope.responseData =  response.data;
                console.log('User : ', $scope.responseData.userModel);
                  //Sets the recived model as the user
                $scope.user =  $scope.responseData.userModel;

              });*/
              console.log('Failed to add new user!');
            };
          });
        };
      });
  }; 

    // Triggered in the login view to skip it
  $scope.closeLogin = function() {

     //Makes a new User object to send to backened Sets mail as -1 when no mail is provided
    /*user = new User($scope.user);*/
          
    Requests.addUser(-1).then(function(response){
 

      $scope.responseData =  response.data;
      console.log('New user: ', $scope.responseData.status);
        //Sets the localStorage userId 
      $scope.user.userId = $scope.responseData.userId;
      window.localStorage['userId'] = $scope.user.userId;

  Requests.updateUser(new User(window.localStorage['userId'])).then(function(response1){
            console.log('Update User!: ', response1.data.status);
            console.log('Update User !data: ', response1.data);
           });              


        //debug
      console.log('New user: ', $scope.responseData);
      console.log('New userId: ', $scope.user.userId);

        //If the addUser failed for some reason
      if ($scope.responseData.status != "sucessfull") {
        console.log('Failed to add new user!');
      };
        //TODO: Gi beskjed om at det er opprettet en ny brukker / evt spør om det er ønsket til brukeren
      $state.go("profile");
    });
  };


  ////////////////////////
  //  Meny
  ////////////////////////

  $scope.logout = function() {
    console.log(window.localStorage['newUser'] +"Logout " + window.localStorage['userId']);
      //TODO: Trengs denne? 
    window.localStorage.clear();
    window.localStorage['userId'] = "-1";
    window.localStorage['newUser'] = true;
    $state.go("login");


    console.log("email" + $scope.email);
    console.log("login" + window.localStorage['newUser']);

    //TODO: add feedback to user
  }


  ////////////////////////
  //Slett denne seksjonen?
  ////////////////////////
  
     // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

 /**/
  ////////////////////////
  //Profile
  ////////////////////////

$scope.ageGrp = null;
$scope.gender = null;

$scope.setAgeGrp = function(ageGrp) {
    $scope.ageGrp = ageGrp;
    console.log('AgeGrp : ' + $scope.ageGrp);
};

$scope.setGender = function(gender) {
    $scope.gender = gender;
    console.log('Gender : ' + $scope.gender);
};

$scope.loadProfile = function() {
    Requests.getUserFromId(window.localStorage['userId']).then(function(response){
    console.log("response status(getUserFromId) : " + response.data.status);
    $scope.user = response.data;
    gender = parseInt($scope.user.userModel.gender);
    age_group = parseInt($scope.user.userModel.age_group);
    $scope.setGender(gender);
    $scope.setAgeGrp(age_group);

  });

};

$scope.saveProfil = function() {
      console.log("ageGrp" + $scope.ageGrp);
      console.log('Gender : ' + $scope.gender);

      Requests.getUserFromId(window.localStorage['userId']).then(function(response){
        console.log("response status(getUserFromId) : " + response.data.status);
        
        user = new User(window.localStorage['userId'], response.data.userModel);
        user.setAgeGroup($scope.ageGrp);
        user.setGender($scope.gender);
        
        Requests.updateUser(user).then(function(response){
          console.log("response status(updateUser) : " + response.data.status);  
          //TODO: If failed=?
        });

      });
      $state.go("preferences");

};

$scope.updateProfil = function() {
      console.log("ageGrp" + $scope.ageGrp);
      console.log('Gender : ' + $scope.gender);

      Requests.getUserFromId(window.localStorage['userId']).then(function(response){
        console.log("response status(getUserFromId) : " + response.data.status);
        
        user = new User(window.localStorage['userId'], response.data.userModel);
        user.setAgeGroup($scope.ageGrp);
        user.setGender($scope.gender);
        
        Requests.updateUser(user).then(function(response){
          console.log("response status(updateUser) : " + response.data.status);  
        });

      });

};


  ////////////////////////
  //Preferences
  ////////////////////////


  function Category(name, icon, isSelected) {
    this.name = name;
    this.icon = icon;
    this.isSelected = isSelected;
  };
  $scope.categories = [];
  /*for(i=0; i<9; i++) {
      $scope.categories.push(new Category("Navn", "ion-star", false));
  };*/
  $scope.categories.push(null);
  $scope.categories.push(new Category("Kunst", "icon-art", false));
  $scope.categories.push(new Category("Arkitektur", "icon-architecture", false));
  $scope.categories.push(new Category("Arkeologi", "icon-archeology", false));
  $scope.categories.push(new Category("Historie", "icon-history", false));
  $scope.categories.push(new Category("Tradisjon & mat", "icon-tradition", false));
  $scope.categories.push(new Category("Natur", "icon-nature", false));
  $scope.categories.push(new Category("Litteratur", "ion-ios-book", false));
  $scope.categories.push(new Category("Musikk", "ion-music-note", false));
  $scope.categories.push(new Category("Teknologi", "ion-gear-b", false));
  
  $scope.selectedCat = [];

  $scope.selectedCategory = function(category) {
      addToArray = true;
      for (var i = 0; i < $scope.selectedCat.length; i++) {
        if($scope.selectedCat[i] == category) {
          addToArray = false;
        }
      }
      if (addToArray) {
        console.log("selected category: "+ category);
        $scope.selectedCat.push(category);
        console.log("selected category: "+ $scope.selectedCat);
      }
      else {
        console.log("selected category: "+ category);
        index = $scope.selectedCat.indexOf(category);
        $scope.selectedCat.splice(index, 1);
        console.log("selected category: "+ $scope.selectedCat);
      } 
    };

  //TODO have to parse category names back into numbers ?
  $scope.loadPreferences = function() {
      Requests.getUserFromId(window.localStorage['userId']).then(function(response){
      console.log("response status(getUserFromId) : " + response.data.status);
      $scope.user = response.data;
      category_preference = $scope.user.userModel.category_preference;
    });
  };


  $scope.savePreferences = function() {
    console.log("Saving Preferences");
    
        Requests.getUserFromId(window.localStorage['userId']).then(function(response){
          user = new User(window.localStorage['userId'], response.data.userModel);
          console.log("response status(getUserFromId) : " + response.data.status);
         
          user.setCategoryPreference($scope.selectedCat);
          console.log("$scope.selectedCat) : " + user.category_preference);
          console.log("user: " + user);
            
	    $ionicLoading.show({
			template: '<h2>Vennligst vent mens vi finner historier vi tror du vil like</h2><div class="icon ion-loading-a"></div>',
			noBackdrop: false
		});
			
          Requests.updateUser(user).then(function(response){
            console.log("response status(updateUser) : " + response.data.userId);
			$state.go("app.recommendations");			
          });

        });
  };

  $scope.updatePreferences = function() {
    console.log("Saving Preferences");
    
        Requests.getUserFromId(window.localStorage['userId']).then(function(response){
          user = new User(window.localStorage['userId'], response.data.userModel);
          console.log("response status(getUserFromId) : " + response.data.status);
         
          user.setCategoryPreference($scope.selectedCat);
          console.log("$scope.selectedCat) : " + user.category_preference);
          console.log("user: " + user);
      
          Requests.updateUser(user).then(function(response){
            console.log("response status(updateUser) : " + response.data.userId);   
          });

        });
  };


  //Next and previous view - input is view to navigate to

  $scope.goLogin = function() {
    $state.go("login");
    StatusBar.show();
    console.log("vi " + vi);
  };

  $scope.goProfile = function() {
      $state.go("profile");
  };

  $scope.goPreferences = function() {
      $state.go("preferences");
  };

  $scope.goOnboardOne = function() {
      $state.go("onboardOne");
  };
  
  $scope.goOnboardTwo = function() {
      $state.go("onboardTwo");
  };

  $scope.goOnboardTree = function() {
      $state.go("onboardTree");
      window.localStorage['newUser'] = false;
  };




  ///////////////////////
  //Menu
  ////////////////////////
  
  $scope.viewList = function(listName) {
    Requests.setSelectedTag(listName);
    $state.go("app.listView");
  };

  $scope.deleteList = function(list) {
    $ionicPlatform.ready(function() {
      $cordovaDialogs.confirm('Vil du slette listen "' + list.text + '"?' , 'Slett liste', ['OK','Avbryt']).then(function(response) {
          if(response === 1) {
          var index = $scope.collectionList.indexOf(list);
          $scope.collectionList.splice(index, 1);
          Requests.removeTag(window.localStorage['userId'], list.text);
        }
      });
    });
  };

  

$scope.updateMenu = function() {
  Requests.getAllLists(window.localStorage['userId']).then(function(response){
    $scope.collectionList = response.data;
    console.log($scope.collectionList);
  });
};

$scope.updateMenu();

})



.controller('ListViewCtrl', function($scope, Requests, Story, $state, $rootScope, $ionicLoading, categoryPicker) {
  //Display loading screen
  $ionicLoading.show({
      template: '<h2>Laster inn...</h2><div class="icon ion-loading-a"></div>',
      noBackdrop: false
  });

  //Call the categoryPicker service
  $scope.chooseCategories = function(categories) {
     categoryPicker(categories);
  };

$scope.tag = Requests.getSelectedTag();
 // Retrieve stories associated with selected tag
 Requests.getStoryList($scope.tag, window.localStorage['userId']).success(function(data, status) {
    $scope.storyPreviews =  data;
    $ionicLoading.hide();
  }).error(function(data, status) {
    console.log(status);
});

  //remove a story from the listview
  $scope.remove = function(story) {
	 var index = $scope.storyPreviews.indexOf(story);
	 $scope.storyPreviews.splice(index, 1);
   Requests.removeTagStory(Requests.getSelectedTag(), window.localStorage['userId'], story.id);
  };
  
  $scope.open = function(story) {
    $ionicLoading.show({
      template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
      noBackdrop: false
    });
    // Get story data.
    //Må ha .then() for å kunne hente fra http.post i backend.services
    Requests.getStory(story.id, window.localStorage['userId']).success(function (data, status) {
      Requests.setSelectedStory(new Story(data));
      $state.go("app.story");
      $ionicLoading.hide();
    }).error(function(data, status) {
        console.log(status)
    })
  };
})


.controller('RecommendationCtrl', function($scope, Requests, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory) {
  var storyPreviews = [];
  $scope.stories = [];
  $scope.userId = window.localStorage['userId'];

  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(false);
  });

  //Display loading screen
  $ionicLoading.show({
      template: '<h2>Laster inn</h2><div class="icon ion-loading-a"></div>',
      noBackdrop: false
    });

  Requests.getMultipleStories($scope.userId).then(function(response) {
    $scope.storyPreviews =  response.data;
	console.log("Første id (sjekk at den stemmer med første item i lista overnfor): "+$scope.storyPreviews[0].id);
    return Requests.getStory($scope.storyPreviews[0].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    return Requests.getStory($scope.storyPreviews[1].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    return Requests.getStory($scope.storyPreviews[2].id, $scope.userId);
  }).then(function(story){
    $scope.stories.push(new Story(story.data));
    Requests.setSelectedStory($scope.stories[0]);
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
    // If it is the last slide, go back to previous slide. Otherwise, next slide. 
    if(index == $scope.stories.length-1) {
      $ionicSlideBoxDelegate.previous();
    } else {
      $ionicSlideBoxDelegate.next();
    }
    // Wait 500 seconds so it slides to another slide before deleting current slide. 
    $timeout(function() {
      if(index < $scope.stories.length-1) {
        $ionicSlideBoxDelegate.previous();
      }
      $scope.stories.splice(index, 1);
      // Necessary to update slides:
      $ionicSlideBoxDelegate._instances[0].kill();
      $ionicSlideBoxDelegate.update();
    }, 500);
  };

/*
  Runs when going to next/previous slide (and when a slide is changed?)
  Set the story in current slide as the current story. 
 */
  $scope.slideChanged = function () {
      $ionicSlideBoxDelegate.update();
      Requests.setSelectedStory($scope.stories[$ionicSlideBoxDelegate.currentIndex()]);
    };

  $scope.openStory = function(story) {
    //Requests.setSelectedStory(story.storyId);
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

    $scope.story = Requests.getSelectedStory();

      //Decide what media format to display first
      if($scope.story.videoList) {
        $scope.mediaType = "video";
      } else if($scope.story.audioList) {
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


.controller("RatingCtrl", function($scope, Requests, User) {
        $scope.userId = window.localStorage['userId'];
        $scope.story = Requests.getSelectedStory();
        $scope.ratingSaved = false;
      
        // Rate story
        $scope.rateFunction = function(rating) {
            $scope.story.rating = rating;
            Requests.addRating($scope.story.storyId, $scope.userId, rating);
            console.log("Rated story: " + rating);
            $scope.ratingSaved = true;
        };
})

.controller('SettingsCtrl', function($scope, Requests, User) {
        //retrieve the user email when opening the settings view
        Requests.getUserFromId(window.localStorage['userId']).then(function(response) {
          $scope.user = response.data;
          $scope.email = $scope.user.userModel.email;
        });

        //test function which retrieves all user information
        $scope.retrieveUser = function() {
          $scope.userId = window.localStorage['userId'];
          Requests.getUserFromId($scope.userId).then(function(response) {
          $scope.user = response.data;
          console.log($scope.user);
          });
        };

        //updates the user's email
        $scope.saveEmail = function(email) {
          Requests.getUserFromId(window.localStorage['userId']).then(function(response){
            console.log("response status(getUserFromId) : " + response.data.status);
            
            user = new User(window.localStorage['userId'], response.data.userModel);
            user.setEmail(email);
            $scope.email = email;
            
            Requests.updateUser(user).then(function(response){
              console.log("response status(updateUser) : " + response.data.status);  
              //TODO: If failed= notify user that email is already in use
            });

          });

        };
})

.controller('BookmarkCtrl', function($scope, $rootScope, Requests) {
      $scope.userId = window.localStorage['userId'];
      $scope.story = Requests.getSelectedStory();

	     	// May use the collectionList in AppCtrl instead
        // The collections a user has, and whether this story is in it.
        Requests.getAllLists($scope.userId).success(function(data, status) {
          $scope.collectionList = data;
          for(var i = 0; i < $scope.collectionList.length; i++){
            for(var j = 0; j < $scope.story.userTags.length; j++){
              if($scope.collectionList[i]["text"].valueOf() == $scope.story.userTags[j].valueOf()) {
                $scope.collectionList[i]["checked"] = true;
              }
            }
            if($scope.collectionList[i]["checked"].valueOf() === "".valueOf()) {
              $scope.collectionList[i]["checked"] = false;
            }
          }
        }).error(function(data, status) {
          console.log(status);
        })

        // Display text field to enter name of new collection
        $scope.newItem = function() {
          $scope.displayTextField = true;
        };

        // Add text entered as a new collection and add the story to it. 
        $scope.addItem = function() {
            if($scope.newItemName) {
              $scope.collectionList.push({text: $scope.newItemName, checked: true});
           
              //Need the userId for this to work
              Requests.addNewTag($scope.newItemName, $scope.userId, $scope.story.storyId);
              $scope.story.userTags.push($scope.newItemName);
              $scope.newItemName = null;
            }
            $scope.displayTextField = false;
        };

        $scope.addTag = function(tag) {
            if(!tag.checked) {
              Requests.removeTagStory(tag.text, $scope.userId, $scope.story.storyId);
              for(var i = 0; i < $scope.story.userTags.length; i++) {
                if($scope.story.userTags[i].valueOf() == tag.text.valueOf()) {
                  $scope.story.userTags.splice(i, 1);
                }
              }
            } else {
              Requests.tagStory(tag.text, $scope.userId, $scope.story.storyId);
              $scope.story.userTags.push(tag["text"]);
          }
        };

});
