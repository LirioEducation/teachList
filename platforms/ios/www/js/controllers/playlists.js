/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic', 'train.services'])
    .controller('PlaylistsCtrl', function($scope, $ionicNavBarDelegate, NavBarService){
        $scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.title(title);
            console.log("set title");
        };
        $scope.toggleShowBar = function() {
            $ionicNavBarDelegate.showBar(!$ionicNavBarDelegate.showBar());
        }
        NavBarService.setTransparency(true);
    })
.controller('PlaylistCtrl', function ($scope) {

    })
;
