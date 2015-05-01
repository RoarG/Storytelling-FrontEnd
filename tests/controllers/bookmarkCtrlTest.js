describe("controller: BookmarkCtrl", function () {
	beforeEach( function() {
        angular.mock.module('ionic');
        angular.mock.module('ui.router');
        angular.mock.module('backend.services');
        angular.mock.module('ngCordova');
        angular.mock.module('BookmarkCtrl');
        module('stories');
    });

	beforeEach(module(function($provide) {
        $provide.value('$ionicTemplateCache', function(){} );
    }));
     beforeEach(module(function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    var scope, rootScope, BookmarkCtrl, Requests, q, deferred, deferred2, deferred3;

    beforeEach(inject(function($controller, $rootScope, _Requests_, $injector, $window, $q) {
		scope = $rootScope.$new();
		rootScope = $rootScope;
		q = $q;
		Requests = _Requests_;
		Requests.setSelectedStory("DF111");
		window = $window;
        spyOn(window.localStorage, 'getItem');

        spyOn(Requests, 'getStoryTags').and.callFake(function(userId, storyId) {
        	deferred = q.defer();
            //deferred.resolve();
            var promise = deferred.promise;
            console.log(promise);
            return promise;
        });
        spyOn(Requests, 'getAllLists').and.callFake(function(userId) {
        	deferred2 = q.defer();
            //deferred2.resolve();
            var promise = deferred2.promise;
            console.log(promise);
            return promise;
        });
        spyOn(Requests, 'addNewTag').and.callFake(function(userId, tagName, storyId) {
        	deferred3 = q.defer();
            //deferred3.resolve();
            var promise = deferred3.promise;
            console.log(promise);
            return promise;
        });

        BookmarkCtrl = $controller('BookmarkCtrl', {
            $scope: scope,
            Requests: Requests
        });

        
/*
        $httpBackend.when(
                "POST",
                "http://188.113.108.37/requests/controller.php",
                {type: "getStoryTags", userId: undefined, storyId: "DF111"}).respond(200, [{text: "Les senere"}]);
        $httpBackend.when(
                "POST",
                "http://188.113.108.37/requests/controller.php",
                {type: "getAllLists", userId: undefined}).respond(200, [{text: "Les senere", checked: ""}, {text: "Favoritter", checked: ""}]);
        $httpBackend.when(
				"POST",
				"http://188.113.108.37/requests/controller.php",
				{type: "addNewTag", userId: undefined, tagName: "TagName", storyId: "DF111"}).respond(200, "");*/
    }));
/*
    // Ensure all requests have been executed and there are no outstanding expectations. 
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
*/
    //describe("successfully adding bookmark", function() {
        it('should have defined storyId', function() {
        	deferred2.resolve([{text: "Les senere", checked: ""}, {text: "Favoritter", checked: ""}]);
			scope.$apply();
			deferred.resolve([{text: "Les senere"}]);
        	scope.$apply();
        	
			expect(scope.storyId).toBeDefined();
			expect(scope.storyId).toBe("DF111");
			expect(scope.tags).toBeDefined();
			expect(scope.tags).toEqual([{text: "Les senere"}]);
			expect(scope.collectionList).toBeDefined();
			expect(scope.collectionList).toEqual([{text: "Les senere", checked: true}, {text: "Favoritter", checked: false}]);
        });
        it("should display text field when adding new item", function() {
        	deferred2.resolve([{text: "Les senere", checked: ""}, {text: "Favoritter", checked: ""}]);
			scope.$apply();
			deferred.resolve([{text: "Les senere"}]);
        	scope.$apply();

			scope.newItem();
			expect(scope.displayTextField).toBe(true);
        });
		it("should define a new tag and add the story to it", function() {
			deferred2.resolve([{text: "Les senere", checked: ""}, {text: "Favoritter", checked: ""}]);
			scope.$apply();
			deferred.resolve([{text: "Les senere"}]);
			scope.$apply();
        	//rootScope.$digest();
			scope.newItemName = "TagName";
			scope.addItem();
			deferred3.resolve("");
			scope.$apply();
        	//rootScope.$digest();
			expect(scope.newItemName).toBe(null);
			expect(scope.displayTextField).toBe(false);
			expect(scope.collectionList).toContain({text: "TagName", checked: true});
        });
    //});
});