////////////////////////
// Login
////////////////////////

//Controller handeling the logic in the Login view, like setting user id, requests to the Db and validating the input. 

angular.module('LoginCtrl', [])


stories.controller('LoginCtrl', function($scope, User, $state, Requests, $ionicLoading, $window) {


	$scope.responseData = {}
	$scope.tempMail = null;
	$scope.user = {};
	
	//TODO: Forklar! eller slett
	$scope.validateEmail = function(email) 	{

		var reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		if (reg.test(email)){
			return true; }
		else{
			return false;
		}
	} 

    //request backend for the user with Email // //TODO: Forklar!
	$scope.requestUser = function (email) {
	    Requests.getUserFromEmail(email).then(function(response) {
	        $scope.responseData = response.data;
	        $scope.responseData.status = response.data.status;
	        $window.localStorage.setItem('responseData', response.data);

	        //For debugging
	        console.log('Response : ', response.data.status);
	        console.log('User : ', $scope.responseData.userModel);
	  

	   		if (response.data.status === "successfull") {
	   			$scope.userExist(response.data);
	   		}
	   		else if (response.data.status === "failed")
	   		{
	   			$scope.userDontExist(email);
	   		}    
	   		$ionicLoading.hide();	
	    })
	}

        //Sets the user from the response 
	$scope.userExist = function (data) {
		console.log("userExist called", data.userModel.userId);
	    $scope.user = new User(data.userModel.userId, data.userModel);

	    //Sets the localStorage.getItem userId and User model
	    $window.localStorage.setItem('userId', data.userModel.userId) ;
	    $window.localStorage.setItem('userModel', $scope.responseData.userModel) ;

	    //TODO: Set user assosiated with the email ??
	    $state.go("app.recommendations");

	    //Sets the input filed as a empty string
	    $scope.user.email = '';
	}

	$scope.setLocalUser = function (userid){
		console.log("setLocalUser called");
		Requests.getUserFromId(userid).then(function(response){
			$window.localStorage.setItem('userId', $scope.responseData.userId);
			$window.localStorage.setItem('userModel', $scope.responseData.userModel) ;
		});
	}
        
        //Adds a new user to the Database
	$scope.userDontExist = function (email) {
	    $scope.user.email = $scope.tempMail
	    Requests.addUser(email).then(function(response) {
	        $scope.responseData = response.data;

	        //Sets the localStorage.getItem userId 
	        $scope.user.userId = $scope.responseData.userId;
	        $window.localStorage.setItem('userId', $scope.responseData.userId);

	        //Go to the next view 
	        //Sets the input as a empty string
	        $scope.user.email = '';
	        console.log("userDontExist called" , response.data.status );

	        //User is created on the server sider or not
	   		if (response.data.status === "sucessfull") 
	   		{
	   			$scope.setLocalUser(response.data.userId);
	        	$state.go("profile");
	   			$ionicLoading.hide();
	   		}
	   		else if (response.data.status === "failed")
	   		{
	   			$ionicLoading.hide();
	   			$scope.failedResponse();

	   		}    
	    });
	}

	//TODO: Forklar!
	$scope.failedResponse = function () {
	    console.log("Failed Response");
	}

	//TODO: Forklar!
	$scope.showValidatePopup = function () {
	    $ionicLoading.show({
	        template: '<h2>Du må bruke en gyldig adresse</h2>',
	        noBackdrop: true,
	        duration: 2000
	    });
	    console.log("showValidatePopup called");
	}

	//TODO: Forklar!
	$scope.showLoading = function () {
	    $ionicLoading.show({
	        template: '<h2>Kontakter server...<div class="icon ion-loading-a"></div></h2>',
	        noBackdrop: true,
	    });
	    console.log("showLoading called");
	}

	//TODO: Forklar!
	$scope.updateUser = function () {
	    Requests.updateUser(new User($window.localStorage.getItem('userId'))).then(function (response1) {
	        console.log('Update User called, Response Status: ', response1.data.status);
	        console.log('Update User called, data: ', response1.data);
	    });
	}

	//TODO: Forklar!
	$scope.doLogin = function(email) {
	    
	    $scope.showLoading();
	    	//TODO: Mail verifisring
	  	$scope.requestUser(email);			
	};

	// Triggered in the login view to skip it
	$scope.closeLogin = function() {

		//Makes a new User object to send to backened Sets mail as -1 when no mail is provided
	    /*user = new User($scope.user);*/
	    var bool = $scope.userDontExist(-1);
	    console.log("bool" + bool);
			//If the addUser failed for some reason
	    if (!bool) {
				console.log('Failed to add new user!');
	    };

			//TODO: Gi beskjed om at det er opprettet en ny brukker / evt spør om det er ønsket til brukeren
		$state.go("profile");
	};

})