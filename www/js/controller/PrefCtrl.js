
  ////////////////////////
  //	Preferences
  ////////////////////////


angular.module('PrefCtrl', [])

stories.controller('PrefCtrl', function($scope, Requests, User, $state, $ionicLoading) {


function Category(name, icon, isSelected) {
    this.name = name;
    this.icon = icon;
    this.isSelected = isSelected;
  };
  $scope.categories = [];

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

})
