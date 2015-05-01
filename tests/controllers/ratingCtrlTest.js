xdescribe("controller: RatingCtrl", function () {


    beforeEach( function() {
        angular.mock.module('ionic');
        angular.mock.module('ui.router');
        angular.mock.module('backend.services');
        angular.mock.module('ngCordova');
        angular.mock.module('RatingCtrl');
        module('stories');
    });

    beforeEach(module(function($provide) {
        $provide.value('$ionicTemplateCache', function(){} );
    }));
     beforeEach(module(function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    var scope, Requests, RatingCtrl, window, q, deferred;


    beforeEach(inject(function($controller, $rootScope, $window, $injector, Requests, $q, Story) {
        scope = $rootScope.$new();
        scope.story = new Story({ rating: 0 });
        //RequestsMock = Requests;
        window = $window;
        spyOn(window.localStorage, 'getItem').and.callFake(function() {
            return 1;
        });
        q = $q;
        Requests = Requests;
        Story = Story;
        RatingCtrl = $controller('RatingCtrl', {
            $scope: scope,
            Requests: Requests,
            Story: Story
        });


        spyOn(Requests, 'addRating').and.callFake(function(story, userId, rating) {
            deferred = q.defer();
            deferred.resolve('');
            var promise = deferred.promise;
            console.log(promise);
            return promise;
        });
        spyOn(Requests, 'getSelectedStory').and.callFake(function() {
            return "DF111";
        });
    }));

    describe("successfully rating story", function() {

        it('should have defined rateFucntion', function() {
            expect(scope.rateFunction).toBeDefined();
            expect(scope.ratingStatus).toBe("notRated");
            expect(scope.userId).toBe(1);
        });
        it('should rate story', function() {
            scope.rateFunction(3);
            deferred.resolve();
            scope.$root.$digest();
            expect(scope.story.rating).toBe(3);
            expect(scope.ratingStatus).toBe("rated");
            
        });
    });


});