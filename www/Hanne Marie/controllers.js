angular.module('starter.controllers', [])

.controller('PlaylistsCtrl', function($scope, Requests) {

	//Controlleren må hente Requests
	//Må ha .then() for å kunne hente fra http.post i backend.services
	Requests.getMultipleStories().then(function(response){
		$scope.playlists =  response.data;

	});

	//Er ikke sikker på om denne må stå inni .then(). Tror ikke det, ettersom innholdet på
	//siden lastes før man kan bruke denne funksjonen
	$scope.remove = function(playlist) {
		var index = $scope.playlists.indexOf(playlist)
		$scope.playlists.splice(index, 1);
	};

// $scope.playlists = [
//     { id: 1,
//     title: 'Nidarosdomen',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
//     thumbnail: 'https://media.snl.no/system/images/8077/standard_nidarosdomen__e2_80_93_1_4.jpg',
//   categories: ['http://icons.iconseeker.com/png/16/function/circle-green.png', 'http://booki.flossmanuals.net/learning-with-etoys-ge/geoboards-and-puzzling-polygons/static/Polygon%20vertex%20atCursor.png', 'http://www.imaginemediastudio.com/images/circle_red.png']
//   },
//     { id: 2,
//     title: 'Holmenkollen',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     thumbnail: 'http://img2.custompublish.com/getfile.php/2131868.92.bcqacdpwfu/holmenkollen_f_ntb_meldetjeneste_skiforeningen.jpg?return=www.langrenn.com',
//   categories: ['http://icons.iconseeker.com/png/16/function/circle-green.png', 'http://booki.flossmanuals.net/learning-with-etoys-ge/geoboards-and-puzzling-polygons/static/Polygon%20vertex%20atCursor.png', 'http://www.imaginemediastudio.com/images/circle_red.png']
//   },
//     { id: 3,
//     title: 'Galdhøpiggen',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     thumbnail: 'http://peakbook.org/gfx/images/1/5c/jans_hpiggen.jpg/jans_hpiggen-1.jpg',
//   categories: ['http://icons.iconseeker.com/png/16/function/circle-green.png', 'http://booki.flossmanuals.net/learning-with-etoys-ge/geoboards-and-puzzling-polygons/static/Polygon%20vertex%20atCursor.png', 'http://www.imaginemediastudio.com/images/circle_red.png']
//   },
//     { id: 4,
//     title: 'Oldemors dukkehus',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.3204/7443?width=600&height=380',
//   categories:['http://icons.iconseeker.com/png/16/function/circle-green.png', 'http://booki.flossmanuals.net/learning-with-etoys-ge/geoboards-and-puzzling-polygons/static/Polygon%20vertex%20atCursor.png', 'http://www.imaginemediastudio.com/images/circle_red.png']
//   },
//     {  id: 5,
//     title: '17. mai på Songe',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     thumbnail: 'http://media31.dimu.no/media/image/H-DF/DF.2776/6481?width=600&height=380',
//   categories:['http://icons.iconseeker.com/png/16/function/circle-green.png', 'http://booki.flossmanuals.net/learning-with-etoys-ge/geoboards-and-puzzling-polygons/static/Polygon%20vertex%20atCursor.png', 'http://www.imaginemediastudio.com/images/circle_red.png']
//   },
//   ];

})


.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('StoryCtrl', function($scope, $stateParams, $ionicModal, $ionicPopover, Requests, Story) {

	//Controlleren må hente Requests og Story
	//Må ha .then() for å kunne hente fra http.post i backend.services
	Requests.getStory('DF.1098').then(function(response){
		//Henter bare en spesifik historie nå, visste ikke hvordan jeg skulle hente
		//id-er fra array
		$scope.story = new Story(response.data);
	});
	$scope.mediaType = "text";
})
.controller("RatingCtrl", function($scope, Requests) {
	//Controller trenger Requests
	$scope.rating = 0;
	//Lagt til add rating funksjoner, ikke noe rart som skjer her
	$scope.rateFunction = function(rating) {
		$scope.rating = rating;
		Requests.addRating($scope.story.storyId, 34, rating);
		console.log("Rated story: " + rating);
	};
	$scope.notInterested = function(Requests) {
		Requests.addRating($scope.story.storyId, 34, 0);
		console.log("Not interested");
	}
})