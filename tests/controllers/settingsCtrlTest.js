xdescribe("controller: SettingsCtrl", function () {
	beforeEach( function() {
        module('starter');
    });

    var scope, $httpBackend, SettingsCtrl, Requests, User;

    beforeEach(inject(function($controller, $rootScope, Requests, User, $injector) {
    	scope = $rootScope.$new();
    	Requests = jasmine.createSpyObj("Requests", ["rateFunction"]);
    	User = jasmine.createSpyObj("User", ["rateFunction"]);
    	$httpBackend = $injector.get("$httpBackend");
        SettingsCtrl = $controller('SettingsCtrl', {
            $scope: scope,
            Requests: Requests,
            User: User
        });
    }));

    // Ensure all requests have been executed and there are no outstanding expectations. 
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});