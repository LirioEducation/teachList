angular.module('train.database', [])

    .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {

        return {
            // Handle query's and potential errors
            query : function (query, parameters) {
                parameters = parameters || [];
                var q = $q.defer();

                $ionicPlatform.ready(function () {
                    $cordovaSQLite.execute(db, query, parameters)
                        .then(function (result) {
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
            getAll : function(result) {
                var output = [];

                for (var i = 0; i < result.rows.length; i++) {
                    output.push(result.rows.item(i));
                }
                //console.log('output ' + JSON.stringify(output));
                return output;
            },

        // Proces a single result
            getById : function(result) {
                var output = null;
                output = angular.copy(result.rows.item(0));
                return output;
            }


        }


    })

.factory('VideoDBFactory', function($q, $cordovaSQLite, DBA) {



    return {

        allVideos: function() {
            var defer = $q.defer();

            DBA.query("SELECT URI, Name, LocalVideoURL, LocalImageURL FROM videos")
                .then(function(result){
                    var all = DBA.getAll(result);
                    defer.resolve(all);
                    console.log("allDelegate - query success: " + all[0]);
                });

            return defer.promise;
        },

        getVideo : function(member) {
            var defer = $q.defer();

            var parameters = [member];
             DBA.query("SELECT Name, URI, LocalVideoURL, LocalImageURL, Tags, Description, Owner FROM videos WHERE URI = (?)", parameters)
                .then(function(result) {
                    var item = DBA.getById(result);
                    //console.log(item);
                    defer.resolve(item);
                });
            return defer.promise;
        },

        addVideo : function(member) {
            // turn tags array into a comma separated string
            var tags = "";
            if (member.tags) {
                tags = member.tags.join(",");
            }

            console.log("Tags: " + tags);

            var parameters = [member.name, member.URI, member.localVideoURL, member.localImageURL, tags, member.text, member.itemOwner];

            return DBA.query("INSERT INTO videos (Name, URI, LocalVideoURL, LocalImageURL, Tags, Description, Owner) VALUES (?,?,?,?,?,?,?)", parameters);
        },

        removeVideo : function(member) {
            var parameters = [member.URI];
            return DBA.query("DELETE FROM videos WHERE URI = (?)", parameters);
        },

        updateVideo : function(origMember, editMember) {

            // turn tags array into a comma separated string
            var tags = "";
            if (editMember.tags) {
                tags = editMember.tags.join(",");
            }

            var parameters = [editMember.name, editMember.URI, editMember.localVideoURL, editMember.localImageURL, tags, editMember.text, editMember.itemOwner, origMember.URI];

            return DBA.query("UPDATE videos SET Name = (?), URI = (?), LocalVideoURL = (?), LocalImageURL = (?), Tags = (?), Description = (?), Owner = (?) WHERE URI = (?)", parameters);
        }
    }


})
    .factory('PlaylistDBFactory', function($q, $cordovaSQLite, DBA) {



        return {

            allPlaylists: function() {
                var defer = $q.defer();

                DBA.query("SELECT URI, Title, Owner, SharedWith, Steps, CompletedSteps, Image FROM playlists")
                    .then(function(result){
                        var all = DBA.getAll(result);
                        defer.resolve(all);
                        console.log("allDelegate - query success: " + all[0]);
                    });

                return defer.promise;
            },

            getPlaylist : function(member) {
                var defer = $q.defer();

                var parameters = [member];
                DBA.query("SELECT URI, Title, Owner, SharedWith, Steps, CompletedSteps, Image FROM playlists WHERE URI = (?)", parameters)
                    .then(function(result) {
                        var item = DBA.getById(result);
                        //console.log(item);
                        defer.resolve(item);
                    });
                return defer.promise;
            },

            addPlaylist : function(member) {
                // turn tags array into a comma separated string
                //var tags = "";
                //if (member.tags) {
                //    tags = member.tags.join(",");
                //}
                //console.log("Tags: " + tags);

                var parameters = [member.URI, member.title, member.owner, member.sharedWith, member.steps, member.completedSteps, member.image];
                return DBA.query("INSERT INTO playlists (URI, Title, Owner, SharedWith, Steps, CompletedSteps, Image) VALUES (?,?,?,?,?,?,?)", parameters);
            }
        }


    });