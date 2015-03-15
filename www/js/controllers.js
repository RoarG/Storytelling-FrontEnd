angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, Requests) {
  // Form data for the login modal
  $scope.loginData = {};


/*
$scope.login(mail) = function() {
  
  //Sets user according to the mail provided in login
  Requests.getUser(mail).then(function(response){
    //Henter bare en spesifik historie nå, visste ikke hvordan jeg skulle hente
    //id-er fra array
    $scope.user = new User(response.data);
  });
}*/



  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    console.log("Closing" + $scope.logingData);
  };


  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form and sets the next view
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $state.go("profile");

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

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
  for(i=0; i<9; i++) {
      $scope.categories.push(new Category("Navn", "ion-star", false));
  };

  $scope.submitPreferences = function() {
    console.log("Submitting preferences");
    $state.go("app.listView");
  };

  //Need the userId to make this work
  /*Requests.getAllLists($scope.user.userId).then(function(response){
	$scope.collectionList = response.data;
  });*/
})

.controller('ListViewCtrl', function($scope, Requests, $state, $rootScope) {

  //Controlleren må hente Requests
  //Må ha .then() for å kunne hente fra http.post i backend.services
  Requests.getMultipleStories().then(function(response){
    $scope.storyPreviews =  response.data;

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
	var index = $scope.storyPreviews.indexOf(story)
	$scope.storyPreviews.splice(index, 1);
  }
  
  //? Hva er index til her?
  $scope.open = function(story) {
	var index = $scope.storyPreviews.indexOf(story)
  $rootScope.storyId = story.id;
  $state.go("app.story");
  }
})


  //? Hva er denne til?
.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Requests, Story, $rootScope) {
    $scope.mediaType = "text"; //Type of media currently displayed

    // Get story data. 
    //$scope.story = Stories.all()[0];
    //console.log($stateParams.id);
    //Controlleren må hente Requests og Story
    //Må ha .then() for å kunne hente fra http.post i backend.services
    //Requests.getStory('DF.1098').then(function(response){
    Requests.getStory($rootScope.storyId).then(function(response){
      //Henter bare en spesifik historie nå, visste ikke hvordan jeg skulle hente
      //id-er fra array
      $scope.story = new Story(response.data);
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

    // Set up bookmark dropdown
    $ionicPopover.fromTemplateUrl('templates/bookmarks-dropdown.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    // Clean up bookmark popover. 
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
})


.controller("RatingCtrl", function($scope, Requests) {
      
        $scope.rating = 0;
      
        // Rate story
        $scope.rateFunction = function(rating) {
            $scope.rating = rating;
            Requests.addRating($scope.story.storyId, 34, rating);
            console.log("Rated story: " + rating);
        };
        $scope.notInterested = function() {
            Requests.addRating($scope.story.storyId, 34, 0);
            console.log("Not interested");
            $scope.rating=0;
        };
})

.controller('BookmarkCtrl', function($scope, $rootScope, Requests) {

	     	// May use the collectionList in AppCtrl instead
        // The collections a user has, and whether this story is in it.
        $scope.collectionList = [
            {text: "Les senere", checked: false},
            {text: "Favoritter", checked: false}
        ];

        // Display text field to enter name of new collection
        $scope.newItem = function() {
          $scope.displayTextField = true;
        };

        // Add text entered as a new collection and add the story to it. 
        $scope.addItem = function() {

            $scope.collectionList.push({text: $scope.newItemName, checked: true});
			     
             //Need the userId for this to work
			       //Requests.addNewTag($scope.newItemName, $scope.user.userId, $scope.story.storyId);
            $scope.newItemName = null;
            $scope.displayTextField = false;
        };

        // Hides text field when popover is hidden. 
        $scope.$on('popover.hidden', function() {
            $scope.displayTextField = false;
       });

});
