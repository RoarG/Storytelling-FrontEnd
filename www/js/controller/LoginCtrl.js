angular.module('LoginCtrl', [])


stories.controller('LoginCtrl', function($scope, $state, $ionicSlideBoxDelegate, Requests) {

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

})
