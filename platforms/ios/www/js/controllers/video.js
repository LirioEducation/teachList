angular.module('train.controllers.video', [
  'ng',
  'ngCordova',
  'ui.router',
  'train.services',
  'train.database'
])

.controller('VideoPlayerCtrl', function ($scope, $stateParams, $localstorage, VideoDBFactory) {
        $scope.filename = $stateParams.name;
        var filename = $scope.filename;
        VideoDBFactory.getVideo(filename).then(function(data){
            $scope.video = data;
            $scope.videoURL = $scope.video.LocalVideoURL;

            console.log("filename: " + filename);
            console.log("videoURL: " + $scope.videoURL);
        });
})


.controller('VideoCtrl', function ($scope, $cordovaFile, $state, $stateParams, $cordovaCapture, VideoService, $localstorage, VideoDBFactory) {

        $scope.listCanSwipe = true;
        $scope.shouldShowDelete = false;
        var videos = [];
        $scope.videos = [];

        $scope.onItemDelete = function (item){


            var vidName = item.LocalVideoURL.substr(item.LocalVideoURL.lastIndexOf('/') + 1);
            var imgName = item.LocalImageURL.substr(item.LocalImageURL.lastIndexOf('/') + 1);

            console.log("Delete:" + vidName);

            // TODO: remove image file

            //VideoDBFactory.remove(item);

            $scope.videos.splice($scope.videos.indexOf(item), 1);

            $cordovaFile.removeFile(cordova.file.dataDirectory, vidName)
                .then(function (success) {
                  // success
                  VideoDBFactory.removeVideo(item);

                }, function (error) {
                  // error
                  //console.log(cordova.file.dataDirectory);
                  console.log(error);
                });

            $cordovaFile.removeFile(cordova.file.dataDirectory, imgName)
                .then(function (success) {
                  // success

                }, function (error) {
                  // error
                  //console.log(cordova.file.dataDirectory);
                  console.log(error);
                });

        };


        $scope.updateVideos = function()   {

            VideoDBFactory.allVideos().then(function (videos) {
              $scope.videos = videos;
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
                function (imageData) {},
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