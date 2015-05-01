xdescribe("controller: AppCtrl", function () {
	beforeEach( function() {
        module('starter');
    });

    var scope, $httpBackend, AppCtrl, Requests, User;

    beforeEach(inject(function($controller, $rootScope, Requests, User, $state, $ionicModal, $timeout, $ionicLoading, $ionicPlatform, $cordovaDialogs, $injector) {
        scope = $rootScope.$new();
        Requests = jasmine.createSpyObj("Requests", ["rateFunction"]);
        User = jasmine.createSpyObj("User", ["rateFunction"]);
        $httpBackend = $injector.get("$httpBackend");
        AppCtrl = $controller('AppCtrl', {
            $scope: scope,
            Requests: Requests,
            User: User,
            $state: $state,
            $ionicModal: $ionicModal,
            $timeout: $timeout,
            $ionicLoading: $ionicLoading,
            $ionicPlatform: $ionicPlatform,
            $cordovaDialogs: $cordovaDialogs
        });
    }));

    // Ensure all requests have been executed and there are no outstanding expectations. 
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});