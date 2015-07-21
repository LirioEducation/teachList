/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic', 'train.services', 'train.database',   'ui.router'])
    .controller('PlaylistCtrl', function($scope, $state, $stateParams, $ionicNavBarDelegate, NavBarService, CollectionsDBFactory){

        var showDetails = {};

        $scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.title(title);
            console.log("set title");
        };
        $scope.toggleShowBar = function() {
            $ionicNavBarDelegate.showBar(!$ionicNavBarDelegate.showBar());
        }
        NavBarService.setTransparency(true);

        $scope.playlist = [];
        $scope.updatePlaylist = function()   {

            CollectionsDBFactory.allCollections().then(function (collections) {
                $scope.playlist = collections;
                console.log(collections);
            });
        };

        $scope.updatePlaylist();

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

        $scope.showCollection = function (index) {
            console.log("collection index: " + index);
            var collection = $scope.playlist[index];
            console.log("collection: " + collection);
            console.log("collection URI: " + collection.URI);
            $state.transitionTo('tab.playlist-collection', {collectionId: collection.URI});

            //var collectionURL = '/tab/playlist/' + collectionURI;
            //$state.transitionTo('url', {url: collectionURL});

        };


    })
.controller('CollectionCtrl', function ($scope, $stateParams, CollectionsDBFactory) {
        $scope.collectionURI = $stateParams.collectionId;
        console.log("$stateParams: " + $stateParams);
        console.log("collection URI ", + $scope.collectionURI);

        $scope.updateCollection = function()   {
            console.log("collection URI ", + $scope.collectionURI);

            CollectionsDBFactory.getCollection($scope.collectionURI).then(function (collection) {
                $scope.collection = collection;
                console.log("Collection: " + collection);
                console.log("Collection URI: " + collection.URI);
                CollectionsDBFactory.getStepsForCollection(collection.URI).then(function (steps){
                    $scope.steps = steps;
                    console.log("Steps: " + steps);
                });
            });
        };
        $scope.updateCollection();

    })
;
