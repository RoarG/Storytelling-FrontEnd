angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

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
    $state.go("app.profile")

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Preferences
  function Category(name, icon, isSelected) {
    this.name = name;
    this.icon = icon;
    this.isSelected = isSelected;
  }
  $scope.categories = [];
  for(i=0; i<9; i++) {
      $scope.categories.push(new Category("Navn", "ion-star", false));
  };

  $scope.preferences = function() {
    $ionicModal.fromTemplateUrl('templates/preferences.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
    //$scope.modal.show();
  };
    $scope.submitPreferences = function() {
      console.log("Submit preferences: ");
      $scope.modal.hide();
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
    };
})

.controller('ListViewCtrl', function($scope) {
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
  ];
  //remove a story from the listview
  $scope.remove = function(story) {
	var index = $scope.storyPreviews.indexOf(story)
	$scope.storyPreviews.splice(index, 1);
  }
  
  $scope.open = function(story) {
	var index = $scope.storyPreviews.indexOf(story)
  }
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Stories) {
    $scope.mediaType = "text"; //Type of media currently displayed

    // Get story data. 
    $scope.story = Stories.all()[0];

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

.controller("RatingCtrl", function($scope) {
        $scope.rating = 0;
        // Rate story
        $scope.rateFunction = function(rating) {
            $scope.rating = rating;
            console.log("Rated story: " + rating);
        };
        $scope.notInterested = function() {
            console.log("Not interested");
            $scope.rating=0;
        };
      })

    .controller('BookmarkCtrl', function($scope, $rootScope) {

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
            $scope.newItemName = null;
            $scope.displayTextField = false;
        };

        // Hides text field when popover is hidden. 
        $scope.$on('popover.hidden', function() {
            $scope.displayTextField = false;
       });

    });
