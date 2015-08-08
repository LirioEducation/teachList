angular.module('teachList.controllers.video', [
  'ng',
    "ngSanitize",
  'ngCordova',
  'ui.router',
  'teachList.services',
  'teachList.database',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster"
])

.controller('VideoPlayerCtrl', function ($scope, $stateParams, MediaDBFactory) {
        console.log('VideoPlayerCtrl');
        $scope.filename = $stateParams.videoId;
        var filename = $scope.filename;
        MediaDBFactory.getMedia(filename).then(function(data){
            $scope.video = data;
            $scope.videoURL = $scope.video.LocalMediaURL;

            console.log("filename: " + filename);
            console.log("videoURL: " + $scope.videoURL);
        });
})
    .controller('HomeCtrl',
    ["$sce", function ($sce) {
        this.config = {
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            tracks: [
                {
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
            theme: "lib/videogular-themes-default/videogular.css",
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png"
            }
        };
    }]
)
    .directive("myStopButton",
    function() {
        return {
            restrict: "E",
            require: "^videogular",
            template: "<div class='iconButton' ng-click='API.stop()'>STOP</div>"
        }
    }
)

.controller('VideoCtrl', function ($scope, $cordovaFile, $state, $stateParams, $cordovaCapture, VideoService, ImageService, MediaDBFactory) {

        $scope.listCanSwipe = true;
        $scope.shouldShowDelete = false;
        $scope.videos = [];
        $scope.images = [];

        $scope.onVideoDelete = function (item){
            console.log("Delete:");

            var vidName = item.LocalMediaURL.substr(item.LocalMediaURL.lastIndexOf('/') + 1);
            var imgName = item.LocalThumbnailURL.substr(item.LocalThumbnailURL.lastIndexOf('/') + 1);

            console.log("Delete:" + vidName);
            $scope.videos.splice($scope.videos.indexOf(item), 1);
            MediaDBFactory.removeMedia(item);

            $cordovaFile.removeFile(cordova.file.dataDirectory, vidName)
                .then(function (success) {
                  // success

                }, function (error) {
                  // error
                  console.log(error);
                });

            $cordovaFile.removeFile(cordova.file.dataDirectory, imgName)
                .then(function (success) {
                  // success

                }, function (error) {
                  // error
                  console.log(error);
                });
        };

        $scope.onImageDelete = function (item){
            console.log("Delete:");

            var imgName = item.LocalMediaURL.substr(item.LocalMediaURL.lastIndexOf('/') + 1);

            console.log("Delete:" + imgName);
            $scope.images.splice($scope.images.indexOf(item), 1);
            MediaDBFactory.removeMedia(item);

            $cordovaFile.removeFile(cordova.file.dataDirectory, imgName)
                .then(function (success) {
                    // success

                }, function (error) {
                    // error
                    console.log(error);
                });
            console.log("delete image: " + $scope.images.length);

        };

        $scope.updateVideos = function()   {

            MediaDBFactory.allOfType('Video').then(function (videos) {
              $scope.videos = videos;
                console.log("update Videos");
                console.log($scope.videos[$scope.videos.length - 1]);
            });
        };
        $scope.updateImages = function()   {

            MediaDBFactory.allOfType('Image').then(function (images) {
                $scope.images = images;
                console.log("update Images: " + $scope.images.length);
                console.log($scope.images[$scope.images.length - 1]);
            });
        };
        $scope.updateVideos();
        $scope.updateImages();


        $scope.captureAudio = function () {
            var options = {
          limit: 3,
          duration: 10
        };
        $cordovaCapture.captureAudio(options).then(function (audioData) {
        }, function (err) {
        });
        };

        $scope.recentImageURL = '';
        $scope.captureImage = function () {

            var options = { limit: 3 };
            $cordovaCapture.captureImage(options).then( function (imageData) {
                    ImageService.saveImage(imageData).success(function (data) {
                        $scope.recentImageURL = data;
                        console.log("image url data: " + data);
                        $scope.updateImages();
                        $scope.$apply();
                    }).error(function (data) {
                        console.log('ERROR' + data);
                    });
                });
        };


        $scope.clip = '';

        $scope.captureVideo = function () {
        $cordovaCapture.captureVideo().then(function (videoData) {
          VideoService.saveVideo(videoData).success(function (data) {
              $scope.clip = data;
              $scope.updateVideos();
              $scope.$apply();
          }).error(function (data) {
            console.log('ERROR: ' + data);
          });
        });
        };

        $scope.urlForClipThumb = function (clipUrl) {
            var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            var sliced = trueOrigin.slice(0, -4);
            return sliced + '.png';
        };

});