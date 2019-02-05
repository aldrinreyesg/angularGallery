angular
    .module('angularGallery', ['ngCookies'])

    .controller('loginCtrl', ['$scope', function($scope) {
        req.flash('info', 'Welcome');
    }])

    .controller('loginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

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
                url: "http://localhost:3000/api/security/login",
                data: JSON.stringify(user),
                headers : {'Content-Type': 'application/json'},
                timeout: 15000
            }).then(function mySuccess(response) {
                console.log(response.data.user);

                $scope.msgText = response.data.message.text;
                angular.element('#ajax-msg').removeClass("fade");
                angular.element('.progress').addClass("fade");

                if(response.data.user) {
                    angular.element('#ajax-msg').addClass("alert-success");
                    $cookies.put('token', response.data.user.token);
                    setTimeout( function() {
                        $scope._userpassword = '';
                        window.location.href = '/admin';
                        // window.location.href = '/admin?token=' + response.data.user.token;
                        }, 2000);
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
    }]);