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
        all : function() {
            console.log('VideoDBFactory.all');
            return DBA.query("SELECT Name, LocalVideoURL FROM videos")
                .then(function(result){
                    console.log('found');
                    var all =  DBA.getAll(result);
                    console.log('all: ' + JSON.stringify(all));
                    return all;
                });
        },

        allDelegate: function() {
            var defer = $q.defer();

            DBA.query("SELECT URI, Name, LocalVideoURL, LocalImageURL FROM videos")
                .then(function(result){
                    var all = DBA.getAll(result);
                    defer.resolve(all);
                    console.log("allDelegate - query success: " + all[0]);
                });

            return defer.promise;
        },

        get : function(member) {
            var defer = $q.defer();

            var parameters = [member];
             DBA.query("SELECT Name, LocalVideoURL, LocalImageURL FROM videos WHERE URI = (?)", parameters)
                .then(function(result) {
                    var item = DBA.getById(result);
                    console.log(item);
                    defer.resolve(item);
                });
            return defer.promise;
        },

        add : function(member) {
            var parameters = [member.name, member.URI, member.localVideoURL, member.localImageURL];
            return DBA.query("INSERT INTO videos (Name, URI, LocalVideoURL, LocalImageURL) VALUES (?,?,?,?)", parameters);
        },

        remove : function(member) {
            var parameters = [member.URI];
            return DBA.query("DELETE FROM videos WHERE URI = (?)", parameters);
        },

        update : function(origMember, editMember) {
            //var parameters = [editMember.name, editMember.URI, editMember.localVideoURL, editMember.localImageURL, origMember.URI];

            var parameters = [editMember.id, editMember.name, origMember.id];
            return DBA.query("UPDATE videos SET id = (?), name = (?) WHERE id = (?)", parameters);
        }

    }


});