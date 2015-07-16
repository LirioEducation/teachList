/**
 * Created by justinkahn on 7/16/15.
 */

angular.module('train.controllers.playlists', ['ionic'])
    .controller('PlaylistsCtrl', function($scope, $ionicNavBarDelegate){
        $scope.setNavTitle = function(title) {
            $ionicNavBarDelegate.title(title);
            console.log("set title");
        };
        $scope.toggleShowBar = function() {
            $ionicNavBarDelegate.showBar(!$ionicNavBarDelegate.showBar());
        }
    })
.controller('PlaylistCtrl', function ($scope) {

    })
;
