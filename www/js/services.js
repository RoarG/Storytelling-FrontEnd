var services = angular.module('starter.services', [])

    services.factory("Stories", function($sce) {
        var stories = [{
            storyId: 0,
            title: "Tittel på historie",
            author: "Forfatter",
            published: "22.02.15",
            categoryList: ["Kat1", "Kat2"],
            introduction: "Intro",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in quam sed arcu scelerisque luctus eget at augue. Proin nec nunc massa. Nulla auctor enim id odio porttitor viverra. Maecenas maximus bibendum nisi, facilisis pretium diam ornare nec. Curabitur vitae purus eleifend, accumsan tellus nec, eleifend lectus. Donec aliquam venenatis ex, in aliquam ante ultrices ac. Sed ac dui vitae tortor blandit fringilla. Morbi ut massa ac purus iaculis sollicitudin. Vestibulum laoreet ante fringilla felis placerat, maximus ullamcorper eros feugiat. Aenean varius pulvinar pulvinar. Curabitur quis aliquam arcu.",
            imageList: ["http://i.dailymail.co.uk/i/pix/2014/10/06/1412613364603_wps_17_SANTA_MONICA_CA_AUGUST_04.jpg",
                "http://www.jeremynoeljohnson.com/wp-content/uploads/2014/06/crazy_cat_2.jpg"],
            videoList: [
                $sce.trustAsResourceUrl("http://player.vimeo.com/video/95671493"),
                $sce.trustAsResourceUrl("https://www.youtube.com/embed/LqSbJm8N28A")],
            audioList: [$sce.trustAsResourceUrl("https://mm.dimu.org/multimedia/012Fxbrw.mp3?mmid=012Fxbrw&a=none")],
            url: "http://www.digitaltfortalt.no",
            rights: "Opphavsrett",
            county: "County",
            location: "Sted"
        }];

        return {
            all: function() {
                return stories;
            },
            get: function(storyId) {
                for (var i = 0; i < stories.length; i++) {
                    if (stories[i].id === parseInt(storyId)) {
                        return stories[i];
                    }
                }
                return null;
            }
        }
    }
	);
	
	// This service accepts a list of categories and returns a list of the corresponding category icons
	services.factory("categoryPicker", [function(categories) {
		return function(categories){
			var items = categories;
			for (i = 0; i < items.length; i++) {
				switch (items[i]) {
					case "history":
						items[i] = "icon-history";
						break;
					case "nature and adventure":
						items[i] = "icon-nature";
						break;
					case "science and technology":
						items[i] = "icon-technology";
						break;
					case "art and design":
						items[i] = "icon-art";
						break;
					case "architecture":
						items[i] = "icon-architecture";
						break;
					case "local traditions and food":
						items[i] = "icon-tradition";
						break;
					case "music":
						items[i] = "ion-music-note";
						break;
					case "archeology":
						items[i] = "icon-archeology";
						break;
					case "literature":
						items[i] = "ion-ios-book";
						break;
				}
			}
			console.log(items);
			return items;
		}
	}]);
