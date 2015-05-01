
//TODO: Forklar

angular.module('backend.services', ['ngSanitize'])


//TODO: Forklar
stories.factory("Story", function ($sce) {

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

		//Returns array of usertags
		this.userTags = storyData.userTags;
	}

		/** Public method, assigned to prototype */
		Story.prototype.getStoryId = function () {
			return this.storyId;
		};

		/** Return the constructor function */
		return Story;
})


//TODO: Forklar
stories.factory('User', function (){

	/*if no userdata is retrieved from the database, use new User(userId). Else see
	Requests.updateUser*/
	function User(userId, userData){
		this.userId = userId;
		//TODO: Forklar
		if(userData != null && userData != undefined){
			if(userData.email == null || userData.email == undefined)
				this.email = -1;
			else
				this.email = userData.email;
			this.age_group = userData.age_group;
			this.gender = userData.gender;
			this.use_of_location = userData.use_of_location;
			this.category_preference = userData.category_preference;
		} else {
			this.email = -1;
			this.age_group = null;
			this.gender = null;
			this.use_of_location = null;
			this.category_preference = null;
		}
	};
	//TODO: Forklar
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
	//TODO: Forklar
	User.prototype.setEmail = function(email){ this.email = email; };
	User.prototype.setAgeGroup = function(age_group){ this.age_group = age_group; };
	User.prototype.setGender = function(gender){ this.gender = gender; };
	User.prototype.setUseOfLocation = function(use_of_location){ this.use_of_location = use_of_location; };
	User.prototype.setCategoryPreference = function(category_preference){
		this.category_preference = category_preference;
	};
	return User;
})


/**Handles communication with backend*/
stories.factory("Requests", function ($http) {
	var req = {
		method: 'POST',
		url: 'http://188.113.108.37/requests/controller.php',
		headers: {'Content-Type': 'application/json'} // 'Content-Type': application/json???
	}

	var selectedStory;
	var selectedTag;

	return {
		/**Retrieves single story from digitalt fortalt*/
		getStory: function(storyId, userId){
			req.data = {
				type: "getStory",
				storyId: storyId,
				userId: userId };
			return $http(req);
		},

		/**Retrieves recommended stories from the database*/
		getRecommendedStories: function(userId) {
			req.data = { type: "getStories",
						userId: userId};
			return $http(req);
		},

		/*Creates and retrieves recommended stories that are not currently in the recommendation-view*/
		getMoreRecommendedStories: function(userId){
			req.data = {type: "getMoreRecommendations",
						userId: userId};
			return $http(req);
		},
		
		/** Adds user rating to a story */
		addRating: function(storyId, userId, rating){
			req.data = {
				type: "rating",
				storyId: storyId,
				userId: userId,
				rating: rating};
			return $http(req);
		},
		
		//TODO: Forklar
		addTag: function(tagName, userId, storyId){
			req.data = {
				type: "addTag",
				userId: userId,
				storyId: storyId,
				tagName: tagName
			};
			$http(req);
		},
		/** Adds a new user to the database, takes a userinstance as input, can be partially filled (for no email set email = -1) **/
		addUser: function (userEmail){
			req.data = {type: "addUser",
				email: userEmail};

			return $http(req); /** Returns status successfull and userId upon success,
			 returns status failed if email exists in DB i.e. for example {'status: "sucessfull", userId:  235'} or {'status: "failed"} **/
		},

		/** Updates a user already in the DB, (for no email set email = -1). 
		userData should be User object. Create new user by using: 
		user = new User(userId, $scope.user) or new User(userId, response.data.userModel), then call updateUser(user)*/
		updateUser: function (userData){
			req.data = {type: "updateUser",
				userId: userData.userId,
				email: userData.email,
				age_group: userData.age_group,
				gender: userData.gender,
				use_of_location: userData.use_of_location,
				category_preference: userData.category_preference
				};
			return $http(req); /** Returns status successfull and userId upon success,
			 returns status failed if email exists in DB i.e. for example {'status: "sucessfull", userId:  235'} or {'status: "failed"} **/
		},

		/** Returns a user instance by using the user email address as input **/
		//TODO: Implement so that it needs confirmation via email
		getUserFromEmail: function(email){
			req.data = {type: "getUserFromEmail",
				'email': email};
			return $http(req); /** returns status successfull and userModel upon success, 
			e.g {"status":"successfull","userModel":{"userId":"1","email":"1@1.com","age_group":"0","gender":"0","user_of_location":"0","category_preference":["art and design","architecture"]}}
			and status failed upon no user found **/

		},

		/** Returns a user instance by using the user email address as input **/
		getUserFromId: function(userId){
			req.data = {type: "getUserFromId",
				'userId': userId};
			return $http(req); /** returns status successfull and userModel upon success, 
			e.g {"status":"successfull","userModel":{"userId":"1","email":"1@1.com","age_group":"0","gender":"0","user_of_location":"0","category_preference":["art and design","architecture"]}}
			and status failed upon no user found **/
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

		/*Get all tags connected to a story for a user*/
		getStoryTags: function (userId, storyId){
			req.data = {
				type: "getStoryTags",
				userId: userId,
				storyId: storyId
			};
			return $http(req);

		},

		/*Set rejected story state in database*/
		rejectStory: function(userId, storyId){
			req.data = {
				type: "rejectStory",
				userId: userId,
				storyId: storyId
			};
			$http(req);
		},
		
		/*Set story as recommended (happens when user sees story for the first time in the recommendation-view)*/
		recommendedStory: function(userId, storyId){
			req.data = {
				type: "recommendedStory",
				userId: userId,
				storyId: storyId
			};
			$http(req);
		},

//TODO: Forklar
		setSelectedStory: function (storyId){
			selectedStory = storyId;
		},
		getSelectedStory: function () {
			return selectedStory;
		},
		setSelectedTag: function (tagName) {
			selectedTag = tagName;
		},
		getSelectedTag: function () {
			return selectedTag;
		}
	}
});