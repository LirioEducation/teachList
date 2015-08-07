/**
 * Created by justinkahn on 7/16/15.
 */
angular.module('train.controllers.playlists', [
  'ionic',
  'train.services',
  'train.database',
  'ui.router',
  'ngCordova',
  'ng',
  'ngSanitize'
])

// Progress Controller
.controller('ProgressCtrl', function ($scope, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, NavBarService, PlaylistsDBFactory) {

  var showDetails = {};
  NavBarService.setTransparency(true);
  $scope.progress = [];
  $scope.playlists = [];

  $scope.updateProgress = function () {
    console.log("update progress");
    PlaylistsDBFactory.allPlaylists().then(function (playlists) {
      $scope.playlists = playlists;

      for (i = 0; i < $scope.playlists.length; i++) {
        var col = $scope.playlists[i];
        $scope.setPlaylistStep(col, i);
      }
    });
  };

      $scope.setPlaylistStep = function (playlist, playlistIndex) {
    curStepIndex = playlist.CurrentStepIndex;
    var steps = playlist.Steps.split(',');
    var currentStepURI = steps[playlist.CurrentStepIndex];
    PlaylistsDBFactory.getPlaylistStep(currentStepURI).then(function (step) {
      var progressItem = {
        'playlist': playlist,
        'nextStep': step
      };
      $scope.progress[playlistIndex] = progressItem;
    });
  };
  $scope.updateProgress();

  $scope.onStepDetailClick = function (index) {
    if (showDetails[index] === true) {
      showDetails[index] = false;
    } else {
      showDetails[index] = true;
    }
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.showStepDetails = function (index) {
    return showDetails[index];
  };
  $scope.showPlaylist = function (index) {
    var playlist = $scope.progress[index].playlist;
    $state.go('app.progress-playlist', { 'playlistId': playlist.URI });
  };
})


// Playlist Controller
.controller('PlaylistCtrl', function ($scope, $cordovaFile, $cordovaCapture, $stateParams, $ionicHistory, PlaylistsDBFactory, VideoService, MediaDBFactory) {
  $scope.collectionURI = $stateParams.collectionId;
  $scope.updateCollection = function () {
    PlaylistsDBFactory.getCollection($scope.collectionURI).then(function (collection) {
      $scope.collection = collection;
      PlaylistsDBFactory.getStepsForCollection(collection.URI).then(function (steps) {
        $scope.steps = steps;
        $scope.stepProcessing();
      });
    });
  };
  $scope.updateCollection();
  $scope.stepProcessing = function () {
    $scope.sortSteps();
    for (i = 0; i < $scope.completedSteps.length; i++) {
      var step = $scope.completedSteps[i];
      step.detailDisplay = false;
    }
    for (i = 0; i < $scope.nextSteps.length; i++) {
      var step = $scope.completedSteps[i];
      step.detailDisplay = false;
    }
  };
  $scope.sortSteps = function () {
    var currentStep = $scope.collection.CurrentStepIndex;
    $scope.completedSteps = $scope.steps.slice(0, currentStep);
    $scope.nextSteps = $scope.steps.slice(currentStep, $scope.steps.length);
    $scope.completedStepCount = currentStep;
  };
  $scope.iconsDict = {
    Recording: '/img/CollectionIcons/recording.png',
    Article: '/img/CollectionIcons/article.png'
  };
  function icon(type) {
    if (type == Recording) {
      return '/img/CollectionIcons/recording.png';
    }
    if (type == Article) {
      return '/img/CollectionIcons/article.png';
    }
  }
  var videos = [];
  $scope.videos = [];
  $scope.clip = '';
  $scope.captureVideo = function () {
    $cordovaCapture.captureVideo().then(function (videoData) {
      VideoService.saveVideo(videoData).success(function (data) {
        $scope.clip = data;
        $scope.afterCapture();
        $scope.$apply();
      }).error(function (data) {
      });
    });
  };
  $scope.afterCapture = function () {
  };
  $scope.myGoBack = function () {
    $ionicHistory.goBack();
  };
})  // Recording Step Controller
.controller('RecordingStepCtrl', function ($scope, $state, $cordovaCapture, $ionicScrollDelegate, VideoService, PlaylistsDBFactory, MediaDBFactory) {
  $scope.clip = '';
  $scope.collectionId = $state.params.collectionId;
  // load in the videos
  $scope.loadVideos = function () {
    $scope.videoURI = $scope.step.Items;
    MediaDBFactory.getMedia($scope.videoURI).then(function (data) {
      $scope.video = data;
    });
  };
  $scope.loadVideos();
  $scope.captureVideo = function () {
    $cordovaCapture.captureVideo().then(function (videoData) {
      VideoService.saveVideo(videoData).success(function (data) {
        $scope.clip = data;
        $scope.afterCapture(data);
        $scope.$apply();
      }).error(function (data) {
      });
    });
  };
  $scope.afterCapture = function (data) {
    //$scope.step.Items = data;
    PlaylistsDBFactory.setCollectionStepItems($scope.step, data).then(function () {
      $scope.step.Items = data;
      $scope.videoURL = $scope.video.LocalMediaURL;
    });
  };
  $scope.display = false;
  $scope.detailDisplay = function () {
    $scope.display = !$scope.display;
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
  };
  $scope.showVideo = function () {
    var vid = $scope.step.Items;
    var collection = $scope.collectionId;

    $state.go('app.progress.playlist-recording', {
      'collectionId': collection,
      'videoId': vid
    });
  };
  $scope.calcStepNumber = function (curIndex) {
    return 1 + parseInt(curIndex) + parseInt($scope.stepNumber) + ' ';
  };
}).controller('VideogularPlayerCtrl', function ($scope, $stateParams, $sce, MediaDBFactory) {
  $scope.filename = $stateParams.videoId;
  var filename = $scope.filename;
  $scope.config = {
    videos: [
      {
        src: [],
        type: ''
      },
      {
        src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4'),
        type: 'video/mp4'
      }
    ],
    tracks: [{
        src: 'http://www.videogular.com/assets/subs/pale-blue-dot.vtt',
        kind: 'subtitles',
        srclang: 'en',
        label: 'English',
        default: ''
      }],
    theme: 'lib/videogular-themes-default/videogular.css',
    plugins: { poster: 'http://www.videogular.com/assets/images/videogular.png' }
  };
  MediaDBFactory.getMedia(filename).then(function (data) {
    $scope.video = data;
    $scope.videoURL = $scope.video.LocalMediaURL;
    var resourceURL = $sce.trustAsResourceUrl($scope.videoURL);
    $scope.config.videos[0].src = $sce.trustAsResourceUrl($scope.videoURL);
    $scope.config.videos[0].type = 'video/mp4';
  });
}).controller('RecordingPlayerCtrl', function ($scope, $timeout, $ionicScrollDelegate, $ionicHistory, $stateParams, MediaDBFactory) {
  $scope.comments = [];
  $scope.filename = $stateParams.videoId;
  var filename = $scope.filename;
  MediaDBFactory.getMedia(filename).then(function (data) {
    $scope.video = data;
    $scope.videoURL = $scope.video.LocalMediaURL;
    $scope.poster = $scope.video.LocalThumbnailURL;
    $scope.commentArray = $scope.video.Comments.split(',');
    $scope.comments = parseComments($scope.commentArray);
  });
  function parseComments(commentArray) {
    var newCommArray = [];
    for (i = 0; 2 * i < commentArray.length; i++) {
      var comment = {
        'commenter': commentArray[2 * i],
        'comment': commentArray[2 * i + 1]
      };
      newCommArray[i] = comment;
    }
    return newCommArray;
  }
  $scope.hideTime = true;
  var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  $scope.sendMessage = function () {
    alternate = !alternate;
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    var newComm = {
      commenter: alternate ? 'Justin' : 'Sarah',
      comment: $scope.data.message
    };
    $scope.comments.push(newComm);
    $scope.$apply();
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  };
  $scope.inputUp = function () {
    if (isIOS)
      $scope.data.keyboardHeight = 216;
    $timeout(function () {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  };
  $scope.inputDown = function () {
    if (isIOS)
      $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };
  $scope.closeKeyboard = function () {
    cordova.plugins.Keyboard.close();
  };
  $scope.data = {};
  $scope.myId = '12345';
  $scope.messages = [];
  $scope.myGoBack = function () {
    $ionicHistory.goBack();
  };
})  // Video Streaming Step Controller
.controller('VideoStreamingStepCtrl', function ($scope, $state) {
  $scope.collectionId = $state.params.collectionId;
  $scope.display = false;
  $scope.detailDisplay = function () {
    $scope.display = !$scope.display;
  };
  $scope.showVideo = function () {
    var vid = $scope.step.Items;
    var collection = $scope.collectionId;
    $state.go('app.progress-playlist-video', {
      'collectionId': collection,
      'videoURL': vid
    });
  };
  $scope.calcStepNumber = function (curIndex) {
    return 1 + parseInt(curIndex) + parseInt($scope.stepNumber) + ' ';
  };
})  // Video Streaming Player Controller
.controller('VideoStreamingPlayerCtrl', function ($scope, $timeout, $ionicScrollDelegate, $ionicHistory, $stateParams, MediaDBFactory) {
  $scope.comments = [];
  $scope.videoURL = $stateParams.videoId;
  function parseComments(commentArray) {
    var newCommArray = [];
    for (i = 0; 2 * i < commentArray.length; i++) {
      var comment = {
        'commenter': commentArray[2 * i],
        'comment': commentArray[2 * i + 1]
      };
      newCommArray[i] = comment;
    }
    return newCommArray;
  }
  $scope.hideTime = true;
  var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  $scope.sendMessage = function () {
    alternate = !alternate;
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    var newComm = {
      commenter: alternate ? 'Justin' : 'Sarah',
      comment: $scope.data.message
    };
    $scope.comments.push(newComm);
    $scope.$apply();
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  };
  $scope.inputUp = function () {
    if (isIOS)
      $scope.data.keyboardHeight = 216;
    $timeout(function () {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  };
  $scope.inputDown = function () {
    if (isIOS)
      $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };
  $scope.closeKeyboard = function () {
    cordova.plugins.Keyboard.close();
  };
  $scope.data = {};
  $scope.myId = '12345';
  $scope.messages = [];
  $scope.myGoBack = function () {
    $ionicHistory.goBack();
  };
})  // Article Step Controller
.controller('ArticleStepCtrl', function ($scope, $state) {
  $scope.article = '';
  $scope.collectionId = $state.params.collectionId;
  $scope.display = false;
  $scope.detailDisplay = function () {
    $scope.display = !$scope.display;
  };
  $scope.readArticle = function () {
    var article = $scope.step.Items;
    var collection = $scope.collectionId;
    $state.go('app.progress-playlist-article', {
      'collectionId': collection,
      'article': article
    });
  };
  $scope.calcStepNumber = function (curIndex) {
    return 1 + parseInt(curIndex) + parseInt($scope.stepNumber) + ' ';
  };
  $scope.isLink = function (str) {
    if (!/^(f|ht)tps?:\/\//i.test(str)) {
      return false;
    } else {
      return true;
    }
  };
}).controller('ArticleCtrl', function ($scope, $stateParams) {
  $scope.article = $stateParams.article;
  $scope.isLink = function (str) {
    if (!/^(f|ht)tps?:\/\//i.test(str)) {
      return false;
    } else {
      return true;
    }
  }  /*
        $scope.isLink = function (article) {
            var pat = /^https?:\/\//i;

            console.log(article);
            if (pat.test(article))
            {
                console.log("return true");
                return 'true';
            }
            return 'false';
        };
        */;
}).directive('recordingStep', function () {
  return {
    restrict: 'E',
    scope: {
      step: '=',
      parentIndex: '@',
      index: '@',
      stepNumber: '@'
    },
    controller: 'RecordingStepCtrl',
    link: function (scope, element, attrs) {
    },
    templateUrl: 'templates/directives/step-recording.html'
  };
}).directive('articleStep', function () {
  return {
    restrict: 'E',
    scope: {
      step: '=',
      parentIndex: '@',
      index: '@',
      stepNumber: '@'
    },
    controller: 'ArticleStepCtrl',
    link: function (scope, element, attrs) {
    },
    templateUrl: 'templates/directives/step-Article.html'
  };
}).directive('videoStep', function () {
  return {
    restrict: 'E',
    scope: {
      step: '=',
      parentIndex: '@',
      index: '@',
      stepNumber: '@'
    },
    controller: 'VideoStreamingStepCtrl',
    link: function (scope, element, attrs) {
    },
    templateUrl: 'templates/directives/step-video.html'
  };
}).filter('renderHTMLCorrectly', function ($sce) {
  return function (stringToParse) {
    return $sce.trustAsHtml(stringToParse);
  };
}).directive('input', function ($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function (scope, element, attr) {
      element.bind('focus', function (e) {
        if (scope.onFocus) {
          $timeout(function () {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function (e) {
        if (scope.onBlur) {
          $timeout(function () {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function (e) {
        if (e.which == 13) {
          if (scope.returnClose)
            element[0].blur();
          if (scope.onReturn) {
            $timeout(function () {
              scope.onReturn();
            });
          }
        }
      });
    }
  };
})
