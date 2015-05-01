xdescribe("controller: RecommendationCtrl", function () {
	beforeEach( function() {
        angular.mock.module('ionic');
        angular.mock.module('ui.router');
        angular.mock.module('backend.services');
        angular.mock.module('ngCordova');
        angular.mock.module('RecomdCtrl');
        module('stories');
    });

    beforeEach(module(function($provide) {
        $provide.value('$ionicTemplateCache', function(){} );
    }));
     beforeEach(module(function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

	var scope, Requests, Story, RecommendationCtrl, q, deferred, $location, redirect, state;

    beforeEach(inject(function($controller, $rootScope, $injector, $window, _Requests_, Story, $ionicSlideBoxDelegate, $ionicModal, $ionicLoading, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory, $q) {
        scope = $rootScope.$new();
        state = $injector.get('$state');
        Requests = _Requests_;
		Story = Story;
		q = $q;
		window = $window;
        spyOn(window.localStorage, 'getItem').and.callFake(function() {
        	return 1;
        });

        spyOn(Requests, 'getRecommendedStories').and.callFake(function(userId) {
            deferred = $q.defer();
            deferred.resolve([{title: "Test", id: "DF2233"}]);
            var promise = deferred.promise;
            console.log(promise);
            return promise;
        });
        spyOn(Requests, 'recommendedStory').and.callFake(function(userId, storyId) {
        	return;
        });


        RecommendationCtrl = $controller('RecommendationCtrl', {
            $scope: scope,
            Requests: Requests,
            Story: Story,
            $ionicSlideBoxDelegate: $ionicSlideBoxDelegate,
            $ionicModal: $ionicModal,
            $ionicLoading: $ionicLoading,
            $state: $state,
            $ionicSideMenuDelegate: $ionicSideMenuDelegate,
            $timeout: $timeout,
            $ionicHistory: $ionicHistory
        });

    }));

    it("should get recommended stories", function() {
    	
		deferred.resolve();
        scope.$root.$digest();
        expect(scope.userId).toBe(1);
        expect(scope.storyPreviews).toBeDefined();
        expect(scope.storyPreviews).toEqual([{title: "Test", id: "DF2233"}]);
        expect(scope.recommendArray).toEqual(["DF2233"]);
        expect(Requests.getSelectedStory()).toEqual("DF2233");
    });


    describe("Successfully open a story", function() {
    	it("should direct you to app/story", function() {
    		spyOn(state, 'go');
    		scope.openStory();
    		expect(state.go).toHaveBeenCalledWith("app.story");
    	});
    });
});