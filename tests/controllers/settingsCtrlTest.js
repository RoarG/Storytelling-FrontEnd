xdescribe("controller: SettingsCtrl", function () {
	beforeEach( function() {
        angular.mock.module('ionic');
        angular.mock.module('ui.router');
        angular.mock.module('backend.services');
        angular.mock.module('ngCordova');
        angular.mock.module('SettingsCtrl');
        module('stories');
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