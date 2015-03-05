angular.module('starter.services', [])

    .factory("Stories", function($sce) {
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
    });