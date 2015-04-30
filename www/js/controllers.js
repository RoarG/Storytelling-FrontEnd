angular.module('stories.controllers', [])

.controller('AppCtrl', function($scope, Requests, User, $state, 
  $ionicModal, $timeout, $ionicLoading, $rootScope, $ionicPlatform, $cordovaDialogs) {


  ////////////////////////
  //  Meny
  ////////////////////////

  


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
  //Preferences
  ////////////////////////


 

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
  
})

