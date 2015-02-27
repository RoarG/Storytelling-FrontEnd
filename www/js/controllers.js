angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { id: 1,
    title: 'Nidarosdomen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    thumbnail: 'https://media.snl.no/system/images/8077/standard_nidarosdomen__e2_80_93_1_4.jpg'},
    { id: 2,
    title: 'Holmenkollen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://img2.custompublish.com/getfile.php/2131868.92.bcqacdpwfu/holmenkollen_f_ntb_meldetjeneste_skiforeningen.jpg?return=www.langrenn.com'},
    { id: 3,
    title: 'Galdhøpiggen',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://peakbook.org/gfx/images/1/5c/jans_hpiggen.jpg/jans_hpiggen-1.jpg'},
    { id: 4,
    title: 'Oldemors dukkehus',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.3204/7443?width=600&height=380'},
    {  id: 5,
    title: '17. mai på Songe',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.2776/6481?width=600&height=380'},
  ];
  
  $scope.remove = function(playlist) {
	var index = $scope.playlists.indexOf(playlist)
	$scope.playlists.splice(index, 1);
  }
})


.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Stories) {
    $scope.mediaType = "text";
    $scope.story = Stories.all()[0];

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
        $scope.modal.remove()
    };

    $ionicPopover.fromTemplateUrl('templates/bookmarks-dropdown.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });


})

    .controller('BookmarkCtrl', function($scope) {
        $scope.collectionList = [
            {text: "Les senere", checked: false},
            {text: "Favoritter", checked: false}
        ];

        $scope.addItem = function() {
            $scope.collectionList.push({text: $scope.newItemName, checked: true});
            $scope.newItemName = null;
        }
    });
