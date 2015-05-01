////////////////////////
// Login
////////////////////////

//TODO: Forklar!

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
	        $window.localStorage.setItem['responseData'] = response.data;

	        //For debugging
	        console.log('Response : ', response.data.status);
	        console.log('User : ', $scope.responseData.userModel);
	  
	   		$ionicLoading.hide();	

	   		if (response.data.status == "successfull") {
	   			console.log("TRUE");
	   			return true;
	   		}
	   		else
	   		{
	   			console.log("False");
	   			return false;
	   		}    
	    });
	}

        //Sets the user from the response 
	$scope.userExist = function () {
	    $scope.user = new User(response.data.userModel.userId, response.data.userModel);

	    //Sets the localStorage.getItem userId and User model
	    $window.localStorage.setItem['userId'] = $scope.user.userId;
	    $window.localStorage.setItem['userModel'] = $scope.responseData.userModel;
	    $scope.user.userId = $scope.responseData.userId;

	    //TODO: Set user assosiated with the email ??
	    $state.go("app.recommendations");

	    //Sets the input filed as a empty string
	    $scope.user.email = '';
	}

        //Adds a new user to the Database
	$scope.userDontExist = function (email) {
	    $scope.user.email = $scope.tempMail
	    Requests.addUser(email).then(function(response) {
	        $scope.responseData = response.data;

	        //Sets the localStorage.getItem userId 
	        $scope.user.userId = $scope.responseData.userId;
	        $window.localStorage.setItem['userId'] = $scope.responseData.userId;

	        //Go to the next view 
	        $state.go("profile");
	        //Sets the input as a empty string
	        $scope.user.email = '';
	        console.log("userDontExist called");
	    })
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
	    Requests.updateUser(new User($window.localStorage.getItem['userId'])).then(function (response1) {
	        console.log('Update User called, Response Status: ', response1.data.status);
	        console.log('Update User called, data: ', response1.data);
	    });
	}

	//TODO: Forklar!
	$scope.doLogin = function(email) {
	    $scope.showLoading();
	   
	   	console.log("RTES", $scope.requestUser(email));
	    	//TODO: Mail verifisring
	  
			//console.log("result: " , result)
		    if ($scope.requestUser(email))
			{
			    $scope.userExist();
			}
	            //If the e-mail is not recorded in the database make a new user 
		    else if (!$scope.requestUser(email))
			{
		        $scope.userDontExist();
			}
			else 
			{
			    console.log("Something when wrong with login");
			}
			
	};

	// Triggered in the login view to skip it
	$scope.closeLogin = function() {

		//Makes a new User object to send to backened Sets mail as -1 when no mail is provided
	    /*user = new User($scope.user);*/
	    $scope.userDontExist(-1);

			//If the addUser failed for some reason
	    if ($scope.responseData.status != "sucessfull") {
				console.log('Failed to add new user!');
	    };

			//TODO: Gi beskjed om at det er opprettet en ny brukker / evt spør om det er ønsket til brukeren
		$state.go("profile");
	};

})