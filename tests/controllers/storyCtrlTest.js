xdescribe("controller: StoryCtrl", function () {
	beforeEach( function() {
        angular.mock.module('ionic');
        angular.mock.module('ui.router');
        angular.mock.module('backend.services');
        angular.mock.module('ngCordova');
        angular.mock.module('StoryCtrl');
        module('stories');
    });

    beforeEach(module(function($provide) {
        $provide.value('$ionicTemplateCache', function(){} );
    }));
     beforeEach(module(function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    var scope, Requests, Story, q, deferred;

    beforeEach(inject(function($controller, $rootScope, $q, $stateParams, $ionicModal, Requests, Story, $sce, $ionicLoading, $injector, $window) {
    	scope = $rootScope.$new();
    	Requests = Requests;
    	Story = Story;
    	q = $q;
    	window = $window;
        spyOn(window.localStorage, 'getItem').and.callFake(function() {
        	return 1;
        });

    	spyOn(Requests, 'getStory').and.callFake(function(storyId, userId) {
            deferred = $q.defer();
            deferred.resolve({storyId: "DF2222"});
            var promise = deferred.promise;
            console.log(promise);
            return promise;
        });
        spyOn(Requests, 'getSelectedStory').and.callFake(function() {
            return "DF2222";
        });

        StoryCtrl = $controller('StoryCtrl', {
            $scope: scope,
            $stateParams: $stateParams,
            $ionicModal: $ionicModal,
            Requests: Requests,
            Story: Story,
            $sce: $sce,
            $ionicLoading: $ionicLoading
        });
    }));

    it("should initialize story", function() {
		deferred.resolve();
        scope.$root.$digest();
        expect(scope.storyId).toBe("DF2222");
        expect(scope.story).toEqual({storyId: "DF2222"});
    });
});