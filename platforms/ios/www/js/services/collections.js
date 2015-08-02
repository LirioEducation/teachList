/**
 * Created by justinkahn on 8/2/15.
 */
angular.module('train.services.collections', ['train.database'])

    // collections
    .factory('CollectionsFactory', function ($q, CollectionsDBFactory) {

        this.allCollections = '';
        allCollections = this.allCollections;

        function getCollections() {
            var defer = $q.defer();
            console.log("ffffffffff");
            console.log(allCollections);


            CollectionsDBFactory.allCollections().then(function (collections) {
                console.log("akjdf;alkdjf;aklf");
                allCollections = collections;
                defer.resolve(allCollections);
                console.log("collectionsFactory: " + allCollections);
            });

            return defer.promise;
        }

        /*

        function getCollection (collectionURI) {
            CollectionsDBFactory.getCollection(collectionURI).then(function (collection) {
                currentCollection = collection;
                console.log("Collection: " + collection);
                console.log("Collection URI: " + collection.URI);
                CollectionsDBFactory.getStepsForCollection(collection.URI).then(function (steps){
                    collectionSteps = steps;
                    stepProcessing();
                });
            });
        }
        */

        return {
            all: function () {
                console.log("collections factory all");

                return allCollections;
            },

            refresh: function () {
                console.log("get collections");

                return getCollections();
            },

            getNextStep: function (collection) {
                console.log("get next step");

                var defer = $q.defer();

                var steps = collection.Steps.split(',');
                var currentStep = steps[collection.CurrentStepIndex];

                CollectionsDBFactory.getCollectionStep(currentStep).then(function (step) {
                    defer.resolve(step);
                });

                return defer.promise;
            },

            get: function (title) {
                for (var i = 0; i < allCollections.length; i++) {
                    if (allCollections[i].title === parseInt(title)) {
                        return allCollections[i];
                    }
                }
                return null;
            }
        };
    })

    // collections
    .factory('StepsFactory', function (CollectionsDBFactory) {

        var currentCollection = '';
        var collectionSteps = [];
        var completedSteps = [];
        var nextSteps = [];

        function sortSteps() {
            var currentStep = currentCollection.CurrentStepIndex;
            completedSteps = collectionSteps.slice(0,currentStep);
            nextSteps = collectionSteps.slice(currentStep, collectionSteps.length);
        };

        function stepProcessing() {
            sortSteps();
            console.log("completed " + completedSteps);
            for (i=0; i < completedSteps.length; i++) {
                var step = completedSteps[i];
                step.detailDisplay = false;
                console.log("step.detailDisplay " + step.detailDisplay);
            }
            for (i=0; i < nextSteps.length; i++) {
                var step = completedSteps[i];
                step.detailDisplay = false;
                console.log("step.detailDisplay " + detailDisplay);
            }
        };

        function getCollection (collectionURI) {
            CollectionsDBFactory.getCollection(collectionURI).then(function (collection) {
                currentCollection = collection;
                console.log("Collection: " + collection);
                console.log("Collection URI: " + collection.URI);
                CollectionsDBFactory.getStepsForCollection(collection.URI).then(function (steps){
                    collectionSteps = steps;
                    stepProcessing();
                });
            });
        };

        return {
            all: function () {
                return collectionSteps;
            },

            get: function (title) {
                for (var i = 0; i < collectionSteps.length; i++) {
                    if (collectionSteps[i].title === parseInt(title)) {
                        return collectionSteps[i];
                    }
                }
                return null;
            }
        };
    });