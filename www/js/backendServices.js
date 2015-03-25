angular.module('backend.services', ['ngSanitize'])
.factory("Story", function ($sce) {

	 /**
	 * Constructor, with class name
	 */
	 function Story(storyData) {

	 	this.storyId = storyData.storyId;
	 	this.title = storyData.title;

		//Returns an array, use author[0]
		this.author = storyData.creatorList;
		this.imageList = storyData.imageList;
		this.introduction = storyData.introduction;

		//EXAMPLE VIDEO-URL: "http://mm01.dimu.no/multimedia/012FwwCj.mp4?mmid=012FwwCj"
		//Returns an array of arrays consisting of 'videourl' and 'posterurl'
		this.videoList = storyData.videoList;

		// NEEDS <p ng-bind-html="story.text"></p> where <p> {{story.text}} </p> is in story.html
		// to make html tags from story work
		this.text = $sce.trustAsHtml(storyData.theStory);

		//EXAMPLE AUDIO-URL: "http://mm01.dimu.no/multimedia/012QsXh9.mp3?mmid=012QsXh9"
		this.audioList = storyData.audioList;
		this.rights = storyData.rights;
		this.municipality = storyData.municipality;
		this.county = storyData.county;
		this.institution = storyData.institution;

		this.subcategoryList = storyData.subCategoryNames;
		this.categoryList = storyData.categoryList;
		this.url = storyData.url;  

		//These four not working now, needs userId as paramater   
		this.rating = storyData.rating;
		this.explanation = storyData.explanation;
		this.falseRecommend = storyData.falseRecommend;
		this.typeOfRecommendation = storyData.tyepOfRecommendation;

		this.updateMedia();
	}

	/** Adds the imageurl to imageList */
	Story.prototype.updateMedia = function(){
		
		if(this.imageList != null)
			for(var i = 0; i < this.imageList.length; i++){
				this.imageList[i] = $sce.trustAsResourceUrl("http://media31.dimu.no/media/image/H-DF/"+this.storyId+"/"+i+"?byIndex=true&height=400&width=400");
			}
		}

		/** Public method, assigned to prototype */
		Story.prototype.getStoryId = function () {
			return this.storyId;
		};

		/** Return the constructor function */
		return Story;
})


.factory('User', function (){
	function User(userData){
		this.userId = userData.userId;
		this.email = userData.email;
		this.age_group = userData.age_group;
		this.gender = userData.gender;
		this.use_of_location = userData.use_of_location;
		this.category_preference = userData.category_preference;
	};
	User.prototype.getUser = function() {
		var userData;
		userData.userId = this.userId;
		userData.email = this.email;
		userData.age_group = this.age_group;
		userData.gender = this.gender;
		userData.use_of_location = this.use_of_location;
		userData.category_preference = this.category_preference;
		return userData;
	};
	return User;
})


/**Handles communication with backend*/
.factory("Requests", function ($http) {
	var req = {
		method: 'POST',
		url: 'http://188.113.108.37/requests/controller.php',
		headers: {'Content-Type': 'application/json'} // 'Content-Type': application/json???
	}

	var selectedStory;

	/* DETTE MÅ BRUKES I Controllere:
 	Requests."metode"().then(function(response){
    		$scope."detsomskalbrukes" = new Story(response.data); eller bare response.data
    	}); TUNGVINT MÅTE?? :/*/

	return {
		/**Retrieves single story from digitalt fortalt*/
		getStory: function(storyId, userId){
			req.data = {
				type: "getStory",
				storyId: storyId,
				userId: userId };
			return $http(req);
		},

		//PRØVER Å HENTE DE 20 FØRSTE HISTORIENE FRA DATABASEN NÅ OG LEGGE TIL I LISTE
		//BRUKER GETALLSTORIES METODE I DBHELPER

		/**Retrieves multiple stories from the database, now returns 500 error when
		* story doesn't have pictures*/
		getMultipleStories: function(idArray) {
			req.data = { type: "getStories" };
			return $http(req);
		},

		/** Adds user rating to a story */
		addRating: function(storyId, userId, rating){
			req.data = {
				type: "rating",
				storyId: storyId,
				userId: userId,
				rating: rating};
			$http(req);
		},
		
		addTag: function(tagName, userId, storyId){
			req.data = {
				type: "addTag",
				userId: userId,
				storyId: storyId,
				tagName: tagName
			};
			$http(req);
		},
		/** Adss a new user to the database, takes a userinstance as input, can be partially filled (for no email set email = -1) **/
		addUser: function (userData){
			req.data = {type: "addUser",
				email: userData.email,
				age_group: userData.age_group,
				gender: userData.gender,
				use_of_location: userData.use_of_location,
				category_preference: userData.category_preference
				};
			$http(req);
		},

		/** Updates a user already in the DB, (for no email set email = -1) **/
		updateUser: function (userData){
			req.data = {type: "updateUser",
				userId: userData.userId,
				email: userData.email,
				age_group: userData.age_group,
				gender: userData.gender,
				use_of_location: userData.use_of_location,
				category_preference: userData.category_preference
				};
			return($http(req)); /** Returns status successful and userId upon sucess,
			 returns status failed if email exists in DB i.e. for example {'status: "sucessfull", userId:  235'} or {'status: "failed"} **/
		},

		/** Returns a user instance by using the user email address as input **/
		//TODO: Implement so that it needs confirmation via email
		getUserFromEmail: function(email){
			req.data = {type: "getUserFromEmail",
				'email': email};
			return $http(req);
		},

		/** Returns a user instance by using the user email address as input **/
		getUserFromId: function(userId){
			req.data = {type: "getUserFromId",
				'userId': userId};
			return $http(req);
		},

		/*Get all lists for a user*/
		getAllLists: function (userId){
			req.data = {
				type: "getAllLists",
				userId: userId
			};
			return $http(req);
		},
		
		/*Add new tag and connects it to user*/
		addNewTag: function(tagName, userId, storyId){
			req.data = {
				type: "addNewTag",
				userId: userId,
				tagName: tagName,
				storyId: storyId
			};
			$http(req);
		},
		
		/*Connects an existing tag, user and story*/
		tagStory: function (tagName, userId, storyId){
			req.data = {
				type: "tagStory",
				userId: userId,
				storyId: storyId,
				tagName: tagName
			};
			$http(req);
		},
		
		/*Remove tag from specific story/remove from list*/
		removeTagStory: function (tagName, userId, storyId){
			req.data = {
				type: "removeTagStory",
				userId: userId,
				storyId: storyId,
				tagName: tagName
			};
			$http(req);
		},
		
		/*Remove tag altogether from user, that is, remove the whole list*/
		removeTag: function (userId, tagName){
			req.data = {
				type: "removeTag",
				userId: userId,
				tagName: tagName
			};
			$http(req);
		},
		
		/*Get all stories that a user has connected to tagName*/
		getStoryList: function (tagName, userId){
			req.data = {
				type: "getList",
				userId: userId,
				tagName: tagName
			};
			return $http(req);
		},

		setSelectedStory: function (storyId){
			selectedStory = storyId;
		},
		getSelectedStory: function () {
			return selectedStory;
		}
	}
});