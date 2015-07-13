angular.module('train.services.video', ['train.database'])

.service('$localstorage', [
  '$window',
  function ($window) {
    //var videos = VideoService.getVideos();
    var localStorageKey = '*localStorageKey*';

    /*
    // need this to instantiate the videos array if none exists
    var videos = $window.localStorage.getItem(localStorageKey);
    if (videos == null) {
      $window.localStorage.setItem(localStorageKey, []);
    }

    this.set = function (key, value) {
      $window.localStorage.setItem(key, value);
    };
    this.get = function (key, defaultValue) {
      return $window.localStorage.getItem(key) || defaultValue;
    };
    this.setObject = function (key, value) {
      $window.localStorage.setItem(key, JSON.stringify(value));
    };
    this.getObject = function (key) {
      return JSON.parse($window.localStorage.getItem(key) || '{}');
    };
    this.setVideo = function (key, videoObj) {
      $window.localStorage.setItem(key, JSON.stringify(videoObj));
      var localVideos = $window.localStorage.getItem(localStorageKey);

      console.log("localStorageKey: " + localStorageKey);
      console.log("key: " + key);

      if ($window.)
      if (localVideos) {
        console.log("localVideos is null");
      }
      else {

      }
      localVideos.push(key);
      $window.localStorage.setItem(localStorageKey, localVideos);
    };
    this.getVideo = function (key) {
      return JSON.parse($window.localStorage.setItem(key) || '{}');
    };
    this.getVideoURL = function (filename) {
      return videos[filename];
    };
    this.allVideos = function () {
      //return JSON.parse($window.localStorage.setItem(localStorageKey) || '[]');
      return videos;
    };

    */

    return {
      set: function (key, value) {
        $window.localStorage.setItem(key, value);
      },
      get: function (key, defaultValue) {
        return $window.localStorage.getItem(key) || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage.setItem(key, JSON.stringify(value));
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage.getItem(key) || '{}');
      },
      setVideo: function (key, videoObj) {
        $window.localStorage.setItem(key, JSON.stringify(videoObj));
        var localVideos = $window.localStorage.getItem(localStorageKey);
        console.log(localVideos);

        if (! (localVideos instanceof Array)) {
          localVideos = [];
        }
        console.log("localStorageKey: " + localStorageKey);
        console.log("key: " + key);

        if ($window.localStorage)
          if (localVideos instanceof Array) {
            console.log("localVideos is not null");
            console.log(localVideos);
          }
          else {

          }

        localVideos.push(key);
        console.log(localVideos);

        $window.localStorage.setItem(localStorageKey, localVideos);
        localVideos = $window.localStorage.getItem(localStorageKey);
        console.log(localVideos);

      },
      getVideo: function (key) {
        return JSON.parse($window.localStorage.getItem(key) || '{}');
      },
      getVideoURL: function (filename) {
        return videos[filename];
      },
      allVideos: function () {
        console.log('allVideos');
        var value = $window.localStorage.getItem(localStorageKey);
        console.log('return: ' + value);
        return value;
        //return videos;
      }
    };
  }
])

.factory('VideoService', ['$q', '$localstorage', 'VideoDBFactory', function ($q, $localstorage, VideoDBFactory) {
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
         //videos[filename] = {name: filename,
         //                   path: videoURL,
         //                   image: imageURL};

        $localstorage.setVideo(filename, {name: filename,
                                           path: videoURL,
                                          image: imageURL});

    VideoDBFactory.add({URI: filename,
                        name: filename,
                        localVideoURL: videoURL,
                        localImageURL: imageURL});

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
}])