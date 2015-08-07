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
  $stateProvider  // setup an abstract state for the menu directive

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
                  templateUrl: "templates/menu-playlist.html",
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
