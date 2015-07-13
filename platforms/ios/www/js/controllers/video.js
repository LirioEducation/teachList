angular.module('train.controllers.video', [
  'ng',
  'ngCordova',
  'ui.router',
  'train.services',
  'train.database'
])

.controller('VideoPlayerCtrl', function ($scope, $stateParams, $localstorage) {
    $scope.filename = $stateParams.name;
            var filename = $scope.filename;
    $scope.video = $localstorage.getVideoURL(filename);
            $scope.videoURL = $scope.video.path;
})


.controller('VideoCtrl', function ($scope, $state, $stateParams, $cordovaCapture, VideoService, $localstorage, VideoDBFactory) {
  //var DBvideos = VideoDBFactory.all();
  //var videos = DBvideos["$$state"];
  //$scope.videos = videos.value;

  var videos = [];

  $scope.videos = [];


  $scope.updateVideos = function()   {
    //console.log("scope videos: " + JSON.stringify($scope.videos));

    VideoDBFactory.allDelegate(function(vids){
      $scope.videos = vids;
      console.log("scope videos: " + JSON.stringify($scope.videos));
    });

  };

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
    $cordovaCapture.captureImage(options).then(function (imageData) {
    }, function (err) {
    });
  };
  $scope.clip = '';
  $scope.captureVideo = function () {
    $cordovaCapture.captureVideo().then(function (videoData) {
      VideoService.saveVideo(videoData).success(function (data) {
        $scope.clip = data;
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
  $scope.showClip = function (clip) {
    console.log('show clip: ' + clip);
    console.log('number of videos: ');
    console.log('state:' + $state.current.name);
              
    $state.go('tab.video-player');
    console.log('state:' + $state.current.name);
  };
});