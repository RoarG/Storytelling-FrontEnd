angular.module('starter.services', [])

    .factory("Stories", function() {
        var stories = [{
            storyId: 0,
            title: "Tittel på historie",
            author: "Forfatter",
            published: "22.02.15",
            categoryList: ["Kat1", "Kat2"],
            introduction: "Intro",
            text: "Historiens tekst ",
            imageList: ["http://i.dailymail.co.uk/i/pix/2014/10/06/1412613364603_wps_17_SANTA_MONICA_CA_AUGUST_04.jpg",
                "http://www.jeremynoeljohnson.com/wp-content/uploads/2014/06/crazy_cat_2.jpg"],
            videoList: "Video",
            audioList: "S",
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
    });