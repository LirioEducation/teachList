// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('train', [
  'ionic',
  'train.controllers',
  'train.services',
  'train.controllers.video',
  'train.database'
]).run(function ($ionicPlatform, $cordovaSQLite) {
       
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    db = window.sqlitePlugin.openDatabase({name: "train-test.db", createFromLocation: 1});
    //db = $cordovaSQLite.openDB({name : "train-test.db", bgType: 1});
    //db = $cordovaSQLite.openDB("train-test.db");

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS videos (id integer primary key, firstname text, lastname text)");

});
}).config(function ($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider  // setup an abstract state for the tabs directive
.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })  // Each tab has its own nav history stack:
.state('tab.collections', {
    url: '/collections',
    views: {
      'tab-collections': {
        templateUrl: 'templates/tab-collect.html',
        controller: 'CollectionsCtrl'
      }
    }
  }).state('tab.playlist', {
    url: '/playlist',
    views: {
      'tab-playlist': {
        templateUrl: 'templates/tab-playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
      })
      .state('tab.playlist-collection', {
          url: '/playlist/:collectionId',
          views: {
            'tab-playlist': {
              templateUrl: 'templates/playlist-collection.html',
              controller: 'CollectionCtrl'
            }
          }
  })
      .state('tab.playlist-collection-recording', {
          url: '/playlist/:collectionId/:videoId',
          views: {
              'tab-playlist': {
                  templateUrl: 'templates/collection-recording.html',
                  controller: 'RecordingPlayerCtrl'
              }
          }
      })
      .state('tab.playlist-collection-article', {
          url: '/playlist/:collectionId/:article',
          views: {
              'tab-playlist': {
                  templateUrl: 'templates/collection-article.html',
                  controller: 'ArticleCtrl'
              }
          }
      })
      .state('tab.playlist-collection-video', {
          url: '/playlist/:collectionId/:videoId',
          views: {
              'tab-playlist': {
                  templateUrl: 'templates/collection-video.html',
                  controller: 'RecordingPlayerCtrl'
              }
          }
      })
      .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  }).state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  }).state('tab.video', {
    url: '/video',
    views: {
      'tab-video': {
        templateUrl: 'templates/tab-video.html',
        controller: 'VideoCtrl'
      }
    }
  }).state('tab.video-player', {
    url: '/video/:videoId',
    views: {
      'tab-video': {
        templateUrl: 'templates/tab-video-player.html',
        controller: 'VideoPlayerCtrl'
      }
    }
  }).state('tab.login', {
          url: '/login',
          views: {
              'tab-video': {
                  templateUrl: 'templates/tab-login.html',
                  controller: 'HomeCtrl'
              }
          }
      }).state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })




      .state('app', {
          url: "/app",
          abstract: true,
          templateUrl: "templates/menu.html",
          controller: ''
      })

      .state('app.playlists', {
          url: "/playlists",
          views: {
              'menuContent' :{
                  templateUrl: "templates/tab-playlist.html",
                  controller: 'PlaylistCtrl'
              }
          }
      })

      .state('app.playlist-collection', {
          url: '/playlist/:collectionId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/playlist-collection.html',
                  controller: 'CollectionCtrl'
              }
          }
      })

      .state('app.single', {
          url: "/playlists/:playlistId",
          views: {
              'menuContent' :{
                  templateUrl: "playlist.html",
                  controller: 'PlaylistCtrl'
              }
          }
      })
      .state('app.playlist-collection-recording', {
          url: '/playlist/:collectionId/:videoId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/collection-recording.html',
                  controller: 'RecordingPlayerCtrl'
              }
          }
      })
      .state('app.playlist-collection-video', {
          url: '/playlist/:collectionId/:videoId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/collection-video.html',
                  controller: 'VideoStreamingPlayerCtrl'
              }
          }
      })
      .state('app.playlist-collection-article', {
          url: '/playlist/:collectionId/:article',
          views: {
              'menuContent': {
                  templateUrl: 'templates/collection-article.html',
                  controller: 'ArticleCtrl'
              }
          }
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})
    /*
    .directive('stepIcon ', function () {
      return {
        restrict: 'E',   // 'A' is the default, so you could remove this line

        template: 'hello'
        //template:  "<img class='collection-icon' ng-src='img/CollectionIcons/{{step.Type}}.png'>"
        //"<img class=\"collection-icon\" ng-src='img/CollectionIcons/{{type}}.png'>"
        /*

         link: function (scope, element, attrs) {

         console.log("link ---------------");
         var imgURL = '';
         if (attrs.type == Recording) {
         console.log('recording');
         imgURL = '/img/CollectionIcons/recording.png';
         }
         if (attrs.type == Article) {
         console.log('article');
         imgURL = '/img/CollectionIcons/article.png';
         }
         console.log(attrs.type);

         var html ="<img src=imgURL>";
         //var e =$compile(html)(scope);
         //element.replaceWith(e);

         }
      };
    })
*/

    .directive('stepIcon', function() {
      return {
          restrict: 'E',
          scope: {
              step: '='
          },
          link: function(scope, element, attrs) {
              scope.type = attrs.type;
              console.log("attrs.type: " + attrs.type);
              scope.contentUrl = 'templates/directives/step-' + attrs.type + '.html';
              console.log("contentURL: " + scope.contentUrl);

              attrs.$observe("type",function(v){
                  scope.contentUrl = 'templates/directives/step-' + attrs.type + '.html';
              });
          },
          template:
            "<div class='' ng-switch='type'>" +
                "<div class='animate-switch' ng-switch-when='Recording'> Hello <div ng-include='contentUrl' ng-controller=''> </div> </div>" +
                "<div class='animate-switch' ng-switch-when='Article'> GoodBye <div ng-include='contentUrl' ng-controller=''> </div> </div>" +
                "<div class='animate-switch' ng-switch-default>default</div>" +
            "</div>"
      };
    });