angular.module('starter.controllers', [
  'starter.services',
  'starter.video.controllers'
]).controller('CollectionsCtrl', function ($scope, $http, Collections) {
  $scope.items = Collections.all();
  $scope.data = { showDelete: false };
  $scope.edit = function (item) {
    alert('Edit Item: ' + item.title);
  };
  $scope.share = function (item) {
    alert('Share Item: ' + item.title);
  };
  $scope.moveItem = function (item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  $scope.onItemDelete = function (item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  $http.get('http://echo.jsontest.com/conditions/frightful').then(function (resp) {
    $scope.conditions = resp.data.conditions;
  }, function (err) {
    console.error('ERR', err);  // err.status will contain the status code
  })  /*       
    var authToken;
    
    $http.get('/auth.py').success(function(data, status, headers) {
                                  authToken = headers('A-Token');
                                  $scope.user = data;
                                  });
    
    $scope.saveMessage = function(message) {
    var headers = { 'Authorization': authToken };
    $scope.status = 'Saving...';
    
    $http.post('/add-msg.py', message, { headers: headers } ).success(function(response) {
                                                                      $scope.status = '';
                                                                      }).error(function() {
                                                                               $scope.status = 'ERROR!';
                                                                               });
    };
             */;
}).controller('TryingCtrl', function ($scope) {
}).controller('BrowseCtrl', function ($scope) {
}).controller('LoginCtrl', function ($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};
  $scope.login = function () {
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {
      $state.go('tab.collections');
    }).error(function (data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})  ///// Old Controllers
.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/menu-items/login.html', { scope: $scope }).then(function (modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.login = function () {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeLogin();
    }, 1000);
  };
}).controller('PlaylistsCtrl', function ($scope) {
  $scope.playlists = [
    {
      title: 'Reggae',
      id: 1
    },
    {
      title: 'Chill',
      id: 2
    },
    {
      title: 'Dubstep',
      id: 3
    },
    {
      title: 'Indie',
      id: 4
    },
    {
      title: 'Rap',
      id: 5
    },
    {
      title: 'Cowbell',
      id: 6
    }
  ];
}).controller('PlaylistCtrl', function ($scope, $stateParams) {
}).controller('DashCtrl', function ($scope) {
}).controller('ChatsCtrl', function ($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  };
}).controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}).controller('AccountCtrl', function ($scope) {
  $scope.settings = { enableFriends: true };
});