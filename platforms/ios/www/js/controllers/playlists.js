/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic', 'train.services', 'train.database'])
    .controller('PlaylistsCtrl', function($scope, $ionicNavBarDelegate, NavBarService, PlaylistDBFactory){
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

    })
.controller('PlaylistCtrl', function ($scope) {

    })
;
