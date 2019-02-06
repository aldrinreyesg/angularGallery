var token = '';

angular
    .module('angularGallery', ['ngCookies'])
    .controller('adminCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
        var token = $cookies.get('token');
        // console.log(token);

        angular.element(function () {
            getData();
        });

        angular.element('#table').on('refresh.bs.table', function (params) {
            getData();
        });

        $scope.btnAdd = function () {
            $scope.modalTitle = "Agregar Usuario";
            // $scope.modalText = "Está seguro de eliminar estos elementos?";
            $scope.btnEnviar = "Guardar";
            $scope.userForm.$setPristine();
            $scope.userForm.$setUntouched();
            // $scope.userForm = {
            //     username : "",
            //     password : "",
            //     passwordRepeat : "",
            //     email : ""
            // };
            angular.element("#modalUpdate").modal('toggle');
        }

        $scope.btnBorrar = function () {
            $scope.modalTitle = "Borrar elementos";
            $scope.modalText = "Está seguro de eliminar estos elementos?";
            $scope.btnAccept = "Eliminar";
            angular.element("#table-options").addClass("d-none");
            angular.element("#modalMsg").modal('toggle');
        }

        $scope.btnSend = function () {
            // console.log("validando formulario");
            console.log($scope.userForm.$valid);
            if($scope.userForm.$valid){
                var user = {
                    user : {
                        username: $scope.username,
                        password: $scope.pass1,
                        email: $scope.email,
                        role: $scope.role,
                        enabled: $scope.enabled,
                    }
                };
                saveData(user);
                angular.element("#modalProgessBar").removeClass('fade');
                $scope.msgText = "Usuario creado.";
                angular.element("#ajax-msg").addClass("alert-success");
                angular.element("#ajax-msg").removeClass("d-none");
                angular.element("#ajax-msg").removeClass("fade");
                // angular.element("#modalUpdate").modal('toggle');
            }
        }


        angular.element("#btnAccept").on('click', function () {
            console.log("eliminar");
            var selected = angular.element("#table").bootstrapTable('getSelections');
            // var users = [];
            var ids = [];
            angular.forEach(selected, function (value, key) {
                console.log(value._id);
                angular.element("#table").bootstrapTable('remove', {
                    field: '_id',
                    values: [value._id]
                });
                ids.push(value._id);
            });
            var users = {
                user: {
                    ids: ids
                }
            };
            console.log(JSON.stringify(users));
            deleteData(users);
            $scope.msgText = "Usuario eliminado.";
            angular.element("#ajax-msg").addClass("alert-success");
            angular.element("#ajax-msg").removeClass("d-none");
            angular.element("#ajax-msg").removeClass("fade");

            angular.element("#modalMsg").modal('toggle');
        });

        function getData(option){
            var token = 'Token ' + $cookies.get('token');
            header = {
                'Content-Type': 'application/json',
                'Authorization': token
            };
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/user/list',
                // data: JSON.stringify(user),
                headers: header,
                timeout: 15000
            }).then(function mySuccess(response) {
                var data = response.data.users;
                angular.element('#table').bootstrapTable('destroy');
                angular.element('#table').bootstrapTable({
                    data: data
                });
                console.log("datos cargados");
            }, function myError(response) {
                console.log(response);
            });
        }

        function saveData(user){
            var token = 'Token ' + $cookies.get('token');
            header = {
                'Content-Type': 'application/json',
                'Authorization': token
            };
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/security/create',
                data: JSON.stringify(user),
                headers: header,
                timeout: 15000
            }).then(function mySuccess(response) {
                var data = response.data.users;
                angular.element('#table').bootstrapTable('destroy');
                angular.element('#table').bootstrapTable({
                    data: data
                });
                console.log("datos cargados");
            }, function myError(response) {
                console.log(response);
            });
        }

        function deleteData(user){
            var token = 'Token ' + $cookies.get('token');
            header = {
                'Content-Type': 'application/json',
                'Authorization': token
            };
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/security/remove',
                data: JSON.stringify(user),
                headers: header,
                timeout: 15000
            }).then(function mySuccess(response) {
                var data = response.data.users;
                angular.element('#table').bootstrapTable('destroy');
                angular.element('#table').bootstrapTable({
                    data: data
                });
                console.log("datos cargados");
            }, function myError(response) {
                console.log(response);
            });
        }
    }]);