angular.module('train.database', []).factory('DBA', function ($cordovaSQLite, $q, $ionicPlatform) {
  return {
    // Handle query's and potential errors
    query: function (query, parameters) {
      parameters = parameters || [];
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query, parameters).then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.log(db);
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
      });
      var promise = q.promise;
      return promise;
    },
    // Proces a result set
    getAll: function (result) {
      var output = [];
      for (var i = 0; i < result.rows.length; i++) {
        output.push(result.rows.item(i));
      }
      //console.log('output ' + JSON.stringify(output));
      return output;
    },
    // Proces a single result
    getById: function (result) {
      var output = null;
      output = angular.copy(result.rows.item(0));
      return output;
    }
  };
})

    .factory('MediaDBFactory', function ($q, $cordovaSQLite, DBA) {
  return {
    allOfType: function (type) {
      var defer = $q.defer();
      var parameters = [type];
      DBA.query('SELECT URI, Name, MediaType, LocalMediaURL, LocalThumbnailURL FROM media WHERE MediaType = (?)', parameters).then(function (result) {
        var all = DBA.getAll(result);
        defer.resolve(all);
        console.log('allDelegate - query success: ' + all[0]);
      });
      return defer.promise;
    },
    getMedia: function (uri) {
      var defer = $q.defer();
      var parameters = [uri];
      DBA.query('SELECT Name, URI, MediaType, LocalMediaURL, LocalThumbnailURL, Tags, Description, Owner FROM media WHERE URI = (?)', parameters).then(function (result) {
        var item = DBA.getById(result);
        defer.resolve(item);
      });
      return defer.promise;
    },
    addMedia: function (member) {
      // turn tags array into a comma separated string
      var tags = '';
      if (member.tags) {
        tags = member.tags.join(',');
      }
      var parameters = [
        member.name,
        member.URI,
        member.mediaType,
        member.LocalMediaURL,
        member.LocalThumbnailURL,
        tags,
        member.text,
        member.itemOwner
      ];
      return DBA.query('INSERT INTO media (Name, URI, MediaType, LocalMediaURL, LocalThumbnailURL, Tags, Description, Owner) VALUES (?,?,?,?,?,?,?,?)', parameters);
    },
    removeMedia: function (member) {
      var parameters = [member.URI];
      return DBA.query('DELETE FROM media WHERE URI = (?)', parameters);
    }
  };
})

    .factory('PlaylistsDBFactory', function ($q, $cordovaSQLite, DBA) {
  return {
    allPlaylists: function () {
      var defer = $q.defer();
      DBA.query('SELECT URI, Title, Owner, SharedWith, Steps, CurrentStepIndex, Image, Description FROM Playlists').then(function (result) {
        var all = DBA.getAll(result);
        defer.resolve(all);
      });
      return defer.promise;
    },
    getPlaylist: function (member) {
      var defer = $q.defer();
      var parameters = [member];
      DBA.query('SELECT URI, Title, Owner, SharedWith, Steps, CurrentStepIndex, Image, Description FROM Playlists WHERE URI = (?)', parameters).then(function (result) {
        var item = DBA.getById(result);
        defer.resolve(item);
      });
      return defer.promise;
    },
    addPlaylist: function (member) {
      // turn tags array into a comma separated string
      //var tags = "";
      //if (member.tags) {
      //    tags = member.tags.join(",");
      //}
      //console.log("Tags: " + tags);
      var parameters = [
        member.URI,
        member.title,
        member.owner,
        member.sharedWith,
        member.steps,
        member.completedSteps,
        member.image
      ];
      return DBA.query('INSERT INTO Playlists (URI, Title, Owner, SharedWith, Steps, CurrentStepIndex, Image) VALUES (?,?,?,?,?,?,?)', parameters);
    },
    getStepsForPlaylist: function (uri) {
      var defer = $q.defer();
      var parameters = [uri];
      DBA.query('SELECT URI, Title, Type, Details, Time, Collection, Items FROM Steps WHERE Playlist = (?)', parameters).then(function (result) {
        var item = DBA.getAll(result);
        defer.resolve(item);
      });
      return defer.promise;
    },
    getPlaylistStep: function (uri) {
      var defer = $q.defer();
      var parameters = [uri];
      DBA.query('SELECT URI, Title, Type, Details, Time, Playlist, Items FROM Steps WHERE URI = (?)', parameters).then(function (result) {
        var item = DBA.getAll(result)[0];
        defer.resolve(item);
      });
      return defer.promise;
    },
    setPlaylistStepItems: function (origStep, newItem) {
      var parameters = [
        newItem,
        origStep.URI
      ];
      return DBA.query('UPDATE Steps SET Items = (?) WHERE URI = (?)', parameters);
    },
    addPlaylistStepItems: function (origStep, newItem) {
      return DBA.query('UPDATE Steps SET Items = (?) WHERE URI = (?)', parameters);
    },
    removePlaylistStepItem: function (origStep, itemToRemove) {
    }
  };
});