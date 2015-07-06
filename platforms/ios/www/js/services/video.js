angular.module('train.services.video', [])

.service('VideoService', function ($q) {
  var videos = {};
  var deferred = $q.defer();
  var promise = deferred.promise;
         
  promise.success = function (fn) {
    promise.then(fn);
    return promise;
  };
  promise.error = function (fn) {
    promise.then(null, fn);
    return promise;
  };
  // Resolve the URL to the local file
  // Start the copy process
  function createFileEntry(fileURI) {
    window.resolveLocalFileSystemURL(fileURI, function (entry) {
      return copyFile(entry);
    }, fail);
  }
  // Create a unique name for the videofile
  // Copy the recorded video to the app dir
  function copyFile(fileEntry) {
    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
    var newName = makeid() + name;
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
      fileEntry.copyTo(fileSystem2, newName, function (succ) {
        return onCopySuccess(succ);
      }, fail);
    }, fail);
  }
 //
  function addToVideos(filename, videoURL, imageURL) {
         videos[filename] = {name: filename,
                            path: videoURL,
                            image: imageURL};
  }
  
  // Called on successful copy process
  // Creates a thumbnail from the movie
  // The name is the moviename but with .png instead of .mov
  function onCopySuccess(entry) {
    var name = entry.nativeURL.slice(0, -4);
    window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png', function (prevSucc) {
      return prevImageSuccess(prevSucc);
    }, fail);
  }
  // Called on thumbnail creation success
  // Generates the currect URL to the local moviefile
  // Finally resolves the promies and returns the name
  function prevImageSuccess(succ) {
    var correctUrl = succ.slice(0, -4);
    correctUrl += '.MOV';
    var filename = correctUrl.split("/").pop();
    addToVideos(filename, correctUrl, succ);
    deferred.resolve(correctUrl);
  }
  // Called when anything fails
  // Rejects the promise with an Error
  function fail(error) {
    console.log('FAIL: ' + error.code);
    deferred.reject('ERROR');
  }
  // Function to make a unique filename
  function makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
         
  
         
  // The object and functions returned from the Service
  return {
    // This is the initial function we call from our controller
    // Gets the videoData and calls the first service function
    // with the local URL of the video and returns the promise
    saveVideo: function (data) {
      createFileEntry(data[0].localURL);
      return promise;
    },
    
     getVideos: function () {
        return videos;
     }
  };
})

.factory('$localstorage', [
  '$window',
  'VideoService',
  function ($window, VideoService) {
    var videos = VideoService.getVideos();
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      setVideo: function (key, videoURL) {
        $window.localStorage[key] = JSON.stringify(videoURL);
        videos.push(key);
      },
      getVideo: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      getVideoURL: function (filename) {
        return videos[filename];
      },
      allVideos: function () {
        return videos;
      }
    };
  }
])