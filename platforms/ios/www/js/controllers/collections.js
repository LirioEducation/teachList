/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic', 'train.services', 'train.database',   'ui.router', 'ngCordova', 'ng'])
    .controller('PlaylistCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, NavBarService, CollectionsDBFactory){

        var showDetails = {};


        NavBarService.setTransparency(true);

        $scope.playlist = [];
        $scope.updatePlaylist = function()   {

            CollectionsDBFactory.allCollections().then(function (collections) {
                $scope.playlist = collections;
            });
        };

        $scope.updatePlaylist();

        //$scope.currentStepDetails = {};
        $scope.onStepDetailClick = function (index) {
            if (showDetails[index] === true) {
                showDetails[index] = false;
            }
            else {

                var collection = $scope.playlist[index];
                var steps = collection.Steps.split(',');
                var currentStep = steps[collection.CurrentStepIndex];
                console.log("collection.Steps: " + collection.Steps);
                console.log("currentStep: " + currentStep);

                CollectionsDBFactory.getCollectionStep(currentStep).then(function (step) {
                    $scope.currentStepDetails = step;
                    console.log("current step details: " + step.Title);
                });
                showDetails[index] = true;
            }
        };

        $scope.showStepDetails = function (index) {
            return showDetails[index];
        };

        $scope.showCollection = function (index) {
            console.log("collection index: " + index);
            var collection = $scope.playlist[index];
            $state.transitionTo('tab.playlist-collection', {collectionId: collection.URI});
        };


    })
.controller('CollectionCtrl', function ($scope, $cordovaFile, $cordovaCapture, $stateParams, CollectionsDBFactory, VideoService, MediaDBFactory) {
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



            /*
            $scope.showDetails = {0:{0: false}, 1:{0: false}};

            $scope.onStepDetailClick = function (parentIndex, index) {
                console.log("showStepDetails: " + parentIndex + " " + index);

                if ($scope.showDetails[parentIndex][index] === true) {
                    $scope.showDetails[parentIndex][index] = false;
                }
                else {
                    $scope.showDetails[parentIndex][index] = true;
                }
                console.log("onStepDetailClick: " + index + "-" + showDetails[parentIndex][index]);
            };

            $scope.showStepDetails = function (parentIndex, index) {
                console.log("showStepDetails: " + parentIndex + " " + index);

                console.log("showStepDetails: " + parentIndex + " " + index + "-" + showDetails[parentIndex][index]);
                var show = $scope.showDetails[parentIndex][index];
                console.log("show " + show);
                return show;
            };
            */
    })
    .controller('RecordingStepCtrl', function ($scope, $cordovaCapture, VideoService, MediaDBFactory) {
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

        $scope.display = false;

        $scope.pleaseClick = function () {
            console.log("pleaseClick " + $scope.display);

            $scope.display = !$scope.display;
            console.log("pleaseClick " + $scope.display);

        };
    })
    .directive('recordingStep', function() {
        return {
            restrict: 'E',
            scope: {
                step: '=',
                parentIndex: '@',
                index: '@'
            },
            controller: 'RecordingStepCtrl',
            link: function(scope, element, attrs) {
                console.log("recordingStep");
                console.log("recordingStep: " + scope.step);
                console.log("parentIndex: " + scope.parentIndex);
            },
            templateUrl: 'templates/directives/step-Recording.html'
        };
    })
;
