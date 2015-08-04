/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.collections', ['ionic', 'train.services', 'train.database',   'ui.router', 'ngCordova', 'ng', 'ngSanitize'])

// Playlist Controller
    .controller('PlaylistCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, $ionicScrollDelegate, NavBarService, CollectionsDBFactory){

        var showDetails = {};

        NavBarService.setTransparency(true);
        $scope.playlist = []; // array of objects each with collection and nextStep
        $scope.collections = [];
        $scope.updatePlaylist = function()   {

            console.log("update playlist");


            CollectionsDBFactory.allCollections().then(function (collections) {
                $scope.collections = collections;
                console.log("allcollections");
                console.log(collections);

                for (i = 0; i < $scope.collections.length; i++) {
                    console.log("for loop");

                    var col = $scope.collections[i];
                    console.log("col " + col.Title);

                    $scope.setCollectionStep(col, i);
                }
            });

        };

        $scope.setCollectionStep = function (collection, playlistIndex) {
            curStepIndex = collection.CurrentStepIndex;
            console.log("curstepindex: " + curStepIndex);

            var steps = collection.Steps.split(',');
            var currentStepURI = steps[collection.CurrentStepIndex];

            console.log("currentStepURI: " + currentStepURI);
            CollectionsDBFactory.getCollectionStep(currentStepURI).then(function (step) {
                var playlistItem = {'collection': collection, 'nextStep': step};

                $scope.playlist[playlistIndex] = playlistItem;
                console.log("Playlist item: " + playlistItem);
                console.log("Playlist index: " + playlistIndex);
                console.log("Playlist item: " + collection.Title + " - " + step.Title);

            });
        };

        $scope.updatePlaylist();

        //$scope.currentStepDetails = {};
        $scope.onStepDetailClick = function (index) {
            if (showDetails[index] === true) {
                showDetails[index] = false;
            }
            else {

                /*
                var collection = $scope.playlist[index]['collection'];
                var steps = collection.Steps.split(',');
                var currentStep = steps[collection.CurrentStepIndex];
                console.log("collection.Steps: " + collection.Steps);
                console.log("currentStep: " + currentStep);

                CollectionsDBFactory.getCollectionStep(currentStep).then(function (step) {
                    $scope.currentStepDetails = step;
                    console.log("current step details: " + step.Title);
                });
                */

                showDetails[index] = true;
            }
            $ionicScrollDelegate.resize();
            console.log("ionic scroll");
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
        };

        $scope.showStepDetails = function (index) {
            return showDetails[index];
        };

        $scope.showCollection = function (index) {
            console.log("collection index: " + index);
            var collection = $scope.playlist[index].collection;
            console.log("collectionId: " + collection.URI);

            $state.go('app.playlist-collection', {'collectionId': collection.URI});
        };


    })

// Collection Controller

    .controller('CollectionCtrl', function ($scope, $cordovaFile, $cordovaCapture, $stateParams, $ionicHistory, CollectionsDBFactory, VideoService, MediaDBFactory) {
        $scope.collectionURI = $stateParams.collectionId;

        $scope.updateCollection = function()   {

            CollectionsDBFactory.getCollection($scope.collectionURI).then(function (collection) {
                $scope.collection = collection;
                console.log("Collection: " + collection);
                console.log("Collection URI: " + collection.URI);
                CollectionsDBFactory.getStepsForCollection(collection.URI).then(function (steps){
                    $scope.steps = steps;
                    $scope.stepProcessing();
                });
            });
        };
        $scope.updateCollection();

        $scope.stepProcessing = function() {
            $scope.sortSteps();
            console.log("completed " + $scope.completedSteps);
            for (i=0; i < $scope.completedSteps.length; i++) {
                var step = $scope.completedSteps[i];
                step.detailDisplay = false;
                console.log("step.detailDisplay " + step.detailDisplay);
            }
            for (i=0; i < $scope.nextSteps.length; i++) {
                var step = $scope.completedSteps[i];
                step.detailDisplay = false;
                console.log("step.detailDisplay " + detailDisplay);

            }
        };

        $scope.sortSteps = function () {
            var currentStep = $scope.collection.CurrentStepIndex;
            $scope.completedSteps = $scope.steps.slice(0,currentStep);
            $scope.nextSteps = $scope.steps.slice(currentStep, $scope.steps.length);
            $scope.completedStepCount = currentStep;
            console.log("sort steps: " + currentStep);
        };

        $scope.iconsDict = {Recording: '/img/CollectionIcons/recording.png',
            Article: '/img/CollectionIcons/article.png'};

          function icon (type) {
            if (type == Recording) {
                console.log('recording');
                return '/img/CollectionIcons/recording.png';
            }
            if (type == Article) {
                console.log('article');

                return '/img/CollectionIcons/article.png';
            }
             console.log('icon');

        };

        var videos = [];
        $scope.videos = [];
        $scope.clip = '';

        $scope.captureVideo = function () {
            console.log("capture video");
            $cordovaCapture.captureVideo().then(function (videoData) {
                VideoService.saveVideo(videoData).success(function (data) {
                    $scope.clip = data;
                    $scope.afterCapture();
                    $scope.$apply();
                }).error(function (data) {
                    console.log('ERROR: ' + data);
                });
            });
        };

        $scope.afterCapture = function () {

        };

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

    })

// Recording Step Controller
    .controller('RecordingStepCtrl', function ($scope, $state, $cordovaCapture, $ionicScrollDelegate, VideoService, CollectionsDBFactory, MediaDBFactory) {
        $scope.clip = '';
        $scope.collectionId = $state.params.collectionId;

        // load in the videos
        $scope.loadVideos = function () {
            $scope.videoURI = $scope.step.Items;
            MediaDBFactory.getMedia($scope.videoURI).then(function(data) {
                $scope.video = data;
            });
        };

        $scope.loadVideos();


        $scope.captureVideo = function () {
            console.log("capture video");

            $cordovaCapture.captureVideo().then(function (videoData) {
                VideoService.saveVideo(videoData).success(function (data) {
                    $scope.clip = data;
                    console.log("video data: " + data);
                    $scope.afterCapture(data);
                    $scope.$apply();
                }).error(function (data) {
                    console.log('ERROR: ' + data);
                });
            });
        };

        $scope.afterCapture = function (data) {
            //$scope.step.Items = data;
            CollectionsDBFactory.setCollectionStepItems($scope.step ,data).then(function() {
                //console.log("after Catpture: " + data);
                $scope.step.Items = data;
                $scope.videoURL = $scope.video.LocalMediaURL;

            });

            console.log("scope.step: " + $scope.step);
        };

        $scope.display = false;

        $scope.detailDisplay = function () {
            //console.log("pleaseClick " + $scope.display);

            $scope.display = !$scope.display;
            //console.log("pleaseClick " + $scope.display);

            $ionicScrollDelegate.resize();
            console.log("ionic scroll");
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        };

        $scope.showVideo = function () {
            console.log("show video");
            console.log($scope.step.Items);
            console.log($scope.collectionId);
            console.log($state.current.name);
            var vid = $scope.step.Items;
            var collection = $scope.collectionId;
            //$state.go('tab.playlist-collection.video', {'name': $scope.step.Items});
            //$state.go('tab.video');
            $state.go('app.playlist-collection-video', {'collectionId': collection, 'videoId': vid});
        };

        $scope.calcStepNumber = function (curIndex) {
            return  (1 + parseInt(curIndex) + parseInt($scope.stepNumber)) + ' ';
        };

    })

    .controller('VideogularPlayerCtrl', function ($scope, $stateParams, $sce, MediaDBFactory) {
        console.log('VideogularPlayerCtrl');
        $scope.filename = $stateParams.videoId;
        var filename = $scope.filename;

        $scope.config = {
            videos: [
                {src: [], type: ''},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},

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


        MediaDBFactory.getMedia(filename).then(function(data){
            $scope.video = data;
            $scope.videoURL = $scope.video.LocalMediaURL;

            console.log("filename: " + filename);
            console.log("videoURL: " + $scope.videoURL);
            var resourceURL = $sce.trustAsResourceUrl($scope.videoURL);
            console.log("resourceURL: " + resourceURL);
            $scope.config.videos[0].src = $sce.trustAsResourceUrl($scope.videoURL);
            $scope.config.videos[0].type = 'video/mp4';

            console.log("filename: " + filename);
            console.log("videoURL: " + $scope.videoURL);
        });


    }).controller('RecordingPlayerCtrl', function ($scope, $timeout, $ionicScrollDelegate, $stateParams, MediaDBFactory) {

        $scope.comments = [];
        $scope.filename = $stateParams.videoId;
        var filename = $scope.filename;
        MediaDBFactory.getMedia(filename).then(function(data){
            $scope.video = data;
            $scope.videoURL = $scope.video.LocalMediaURL;
            $scope.poster = $scope.video.LocalThumbnailURL;
            $scope.commentArray = $scope.video.Comments.split(',');
            $scope.comments = parseComments($scope.commentArray);

            console.log($scope.videoURL);
        });


        function parseComments(commentArray) {
            var newCommArray = [];
            for(i=0; 2*i < commentArray.length; i++) {
                var comment = {'commenter': commentArray[2*i], 'comment': commentArray[2*i+1]};
                newCommArray[i] = comment;
            }
            return newCommArray;
        }

        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function() {

            console.log("send message");

            alternate = !alternate;

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            var newComm = {
                commenter: alternate ? '12345' : '54321',
                comment: $scope.data.message,
            };
            console.log("new comm: " + newComm.comment);
            $scope.comments.push(newComm);
            $scope.$apply();

            console.log("Comments: " + $scope.comments.length);


            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
             cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];
    })


    // Article Step Controller
    .controller('ArticleStepCtrl', function ($scope, $state, $cordovaCapture, VideoService, CollectionsDBFactory, MediaDBFactory) {
        $scope.article = '';
        $scope.collectionId = $state.params.collectionId;

        // load in the videos
        $scope.loadArticle = function () {
            $scope.articleURL = $scope.step.Items;
            // parse as html
        };

        $scope.loadArticle();

        $scope.display = false;

        $scope.detailDisplay = function () {
            $scope.display = !$scope.display;
        };

        $scope.readArticle = function () {
            console.log($scope.step.Items);
            console.log($scope.collectionId);
            console.log($state.current.name);
            var vid = $scope.step.Items;
            var collection = $scope.collectionId;

            $state.go('app.playlist-collection-article', {'collectionId': collection, 'article': vid});
        };

        $scope.calcStepNumber = function (curIndex) {
            return  (1 + parseInt(curIndex) + parseInt($scope.stepNumber)) + ' ';
        };
    })
    .controller('ArticleCtrl', function ($scope, $stateParams) {
        $scope.article = $stateParams.article;


    })


    .directive('recordingStep', function() {
        return {
            restrict: 'E',
            scope: {
                step: '=',
                parentIndex: '@',
                index: '@',
                stepNumber: '@'
            },
            controller: 'RecordingStepCtrl',
            link: function(scope, element, attrs) {
                console.log("recordingStep");
                console.log("recordingStep: " + scope.step);
                console.log("recordingStep-Items: " + scope.step.Items);
                console.log("parentIndex: " + scope.parentIndex);
            },
            templateUrl: 'templates/directives/step-recording.html'
        };
    })

    .directive('articleStep', function() {
        return {
            restrict: 'E',
            scope: {
                step: '=',
                parentIndex: '@',
                index: '@',
                stepNumber: '@'
            },
            controller: 'ArticleStepCtrl',
            link: function(scope, element, attrs) {
                console.log("recordingStep");
                console.log("recordingStep: " + scope.step);
                console.log("recordingStep-Items: " + scope.step.Items);
                console.log("parentIndex: " + scope.parentIndex);
            },
            templateUrl: 'templates/directives/step-Article.html'
        };
    })

    .filter('renderHTMLCorrectly', function($sce)
    {
        return function(stringToParse)
        {
            return $sce.trustAsHtml(stringToParse);
        }
    })





        .directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })

    .directive('videoComment', function() {
        return {
            restrict: 'E',
            scope: {
                user: '@',
                comment: '@'
            },
            controller: 'videoCommentCtrl',
            link: function(scope, element, attrs) {

            },
            templateUrl: 'templates/directives/video-comment.html'
        };
    })

    .controller('videoCommentCtrl', function ($scope) {


    })

;
