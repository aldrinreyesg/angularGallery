var angularGallery = angular.module('angularGallery', []);

angularGallery.controller('loginCtrl', function($scope) {
    req.flash('info', 'Welcome');
});

angularGallery.controller('loginCtrl', function ($scope, $http) {
    $scope.login = function() {

        console.log($scope._username);
        console.log($scope._userpassword);
    }
    $http({
        method : "GET",
        url : "http://localhost:3000/services/login"
    }).then(function mySuccess(response) {
        $scope.myWelcome = response.data;
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
});