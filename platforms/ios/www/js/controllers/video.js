angular.module('train.controllers.video', [
  'ng',
  'ngCordova',
  'ui.router',
  'train.services',
  'train.database'
])

.controller('VideoPlayerCtrl', function ($scope, $stateParams, MediaDBFactory) {
        $scope.filename = $stateParams.name;
        var filename = $scope.filename;
        MediaDBFactory.getMedia(filename).then(function(data){
            $scope.video = data;
            $scope.videoURL = $scope.video.LocalMediaURL;

            console.log("filename: " + filename);
            console.log("videoURL: " + $scope.videoURL);
        });
})


.controller('VideoCtrl', function ($scope, $cordovaFile, $state, $stateParams, $cordovaCapture, VideoService, MediaDBFactory) {

        $scope.listCanSwipe = true;
        $scope.shouldShowDelete = false;
        var videos = [];
        $scope.videos = [];

        $scope.onItemDelete = function (item){


            console.log("Delete:");

            var vidName = item.LocalMediaURL.substr(item.LocalMediaURL.lastIndexOf('/') + 1);
            var imgName = item.LocalThumbnailURL.substr(item.LocalThumbnailURL.lastIndexOf('/') + 1);

            console.log("Delete:" + vidName);


            //VideoDBFactory.remove(item);

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


        $scope.updateVideos = function()   {

            MediaDBFactory.allOfType('Video').then(function (videos) {
              $scope.videos = videos;
                console.log("update Videos");
                console.log($scope.videos[$scope.video.length - 1]);
            });
        };

        $scope.updateVideos();



        $scope.captureAudio = function () {
            var options = {
          limit: 3,
          duration: 10
        };
        $cordovaCapture.captureAudio(options).then(function (audioData) {
        }, function (err) {
        });
        };

        $scope.captureImage = function () {

            var options = { limit: 3 };
            $cordovaCapture.captureImage(options).then(
                function (imageData) {

                },
                function (err) {}
            );
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