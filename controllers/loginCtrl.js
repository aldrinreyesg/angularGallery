var angularGallery = angular.module('angularGallery', []);

angularGallery.controller('loginCtrl', function($scope) {
    req.flash('info', 'Welcome');
});

angularGallery.controller('loginCtrl', function ($scope, $http) {
    $scope.login = function() {
        // $scope.login.attr("disabled", "disabled");
        // .addClass('disabled');
        angular.element('.submit').attr("disabled", "disabled");
        angular.element('#ajax-msg')
            .addClass("fade")
            .removeClass("alert-success")
            .removeClass("alert-danger");
        angular.element('.progress').removeClass("fade");
        $http({
            method: "POST",
            url: "http://localhost:3000/services/login",
            params: {
                _username: $scope._username,
                _userpassword: $scope._userpassword
            }
        }).then(function mySuccess(response) {
            console.log(response);
            $scope._userpassword = '';
            $scope.msgText = response.data.message;
            angular.element('#ajax-msg').removeClass("fade");
            angular.element('.progress').addClass("fade");

            if(response.data.valid) {
                angular.element('#ajax-msg').addClass("alert-success");
                setTimeout( function() {
                    window.location.href = '/?token=' + response.data.token;
                    }, 3000);
            }else{
                angular.element('#ajax-msg').addClass("alert-danger");
                angular.element('.submit').removeAttr("disabled");
            }
        }, function myError(response) {
            console.log(response);
            $scope.msgType = false;
            $scope.msgText = response.data.message;
            angular.element('#ajax-msg').removeClass("fade");
            angular.element('.progress').addClass("fade");
        });
    }
});