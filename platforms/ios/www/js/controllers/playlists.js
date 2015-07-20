/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic', 'train.services', 'train.database'])
    .controller('PlaylistsCtrl', function($scope, $ionicNavBarDelegate, NavBarService, PlaylistDBFactory){

        var showDetails = {};

        $scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.title(title);
            console.log("set title");
        };
        $scope.toggleShowBar = function() {
            $ionicNavBarDelegate.showBar(!$ionicNavBarDelegate.showBar());
        }
        NavBarService.setTransparency(true);

        $scope.playlists = [];
        $scope.updatePlaylists = function()   {

            PlaylistDBFactory.allPlaylists().then(function (playlists) {
                $scope.playlists = playlists;
                console.log(playlists);
            });
        };

        $scope.updatePlaylists();

        $scope.onStepDetailClick = function (index) {
            if (showDetails[index] === true) {
                showDetails[index] = false;
            }
            else {
                showDetails[index] = true;
            }
            console.log("onStepDetailClick: " + index);
        }

        $scope.showStepDetails = function (index) {
            console.log("showStepDetails: " + index);
            return showDetails[index];
        }

    })
.controller('PlaylistCtrl', function ($scope) {

    })
;
