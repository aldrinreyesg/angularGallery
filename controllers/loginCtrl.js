var angularGallery = angular.module('angularGallery', []);

angularGallery.controller('loginCtrl', function($scope) {
    req.flash('info', 'Welcome');
});

angularGallery.controller('loginCtrl', function ($scope, $http) {
    $scope.login = function() {


        angular.element('.submit').attr("disabled", "disabled");
        angular.element('#ajax-msg')
            .addClass("fade")
            .removeClass("alert-success")
            .removeClass("alert-danger");
        angular.element('.progress').removeClass("fade");
        var user = {
                user: {
                    email: $scope._username,
                    password: $scope._userpassword
                }
            };
        $http({
            method: "POST",
            url: "http://localhost:3000/api/users/login",
            data: JSON.stringify(user),
            headers : {'Content-Type': 'application/json'},
            timeout: 15000
        }).then(function mySuccess(response) {
            console.log(response.data.users);
            $scope._userpassword = '';
            $scope.msgText = response.data.users;
            angular.element('#ajax-msg').removeClass("fade");
            angular.element('.progress').addClass("fade");

            if(response.data.user) {
                angular.element('#ajax-msg').addClass("alert-success");
                setTimeout( function() {
                    window.location.href = '/?token=' + response.data.token;
                    }, 3000);
            }else{
                if(!angular.isUndefined(response.data.message.type)) {
                    $scope.msgText = response.data.message.text;
                }else{
                    $scope.msgText = "timeout";
                }
                angular.element('#ajax-msg').addClass("alert-danger");
                angular.element('#ajax-msg').removeClass("fade");
                angular.element('.progress').addClass("fade");
                angular.element('.submit').removeAttr("disabled");

            }
        }, function myError(response) {
            console.log(response);
            if(angular.isUndefined(response.data.message)) {
                $scope.msgText = "timeout";
            }else {
                $scope.msgType = response.data.message.type;
                $scope.msgText = response.data.message.text;
            }
            angular.element('#ajax-msg').addClass("alert-danger");
            angular.element('#ajax-msg').removeClass("fade");
            angular.element('.progress').addClass("fade");
            angular.element('.submit').removeAttr("disabled");
        });
    }
    $scope.cancel = function() {
        window.location.href = "/";
    }
});