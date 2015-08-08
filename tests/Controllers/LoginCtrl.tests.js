describe('LoginCtrl', function(){
         var scope;
         
         // load the controller's module
         beforeEach(module('starter.controllers'));
         
         beforeEach(inject(function($rootScope, $controller) {
                           scope = $rootScope.$new();
                           $controller('LoginCtrl', {$scope: scope});
                           }));
         
         // tests start here
         
});