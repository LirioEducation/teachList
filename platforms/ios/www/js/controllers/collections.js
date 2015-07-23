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
.controller('CollectionCtrl', function ($scope, $cordovaFile, $cordovaCapture, $stateParams, CollectionsDBFactory, VideoService, VideoDBFactory) {
        $scope.collectionURI = $stateParams.collectionId;

        $scope.updateCollection = function()   {

            CollectionsDBFactory.getCollection($scope.collectionURI).then(function (collection) {
                $scope.collection = collection;
                console.log("Collection: " + collection);
                console.log("Collection URI: " + collection.URI);
                CollectionsDBFactory.getStepsForCollection(collection.URI).then(function (steps){
                    $scope.steps = steps;
                    $scope.sortSteps();
                });
            });
        };
        $scope.updateCollection();


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

        }


        var showDetails = {};

        $scope.onStepDetailClick = function (index) {
            if (showDetails[index] === true) {
                showDetails[index] = false;
            }
            else {
                showDetails[index] = true;
            }
            //console.log("onStepDetailClick: " + showDetails[index]);
        };

        $scope.showStepDetails = function (index) {
            //console.log("showStepDetails: " + showDetails[index]);
            return showDetails[index];
        };

    });
