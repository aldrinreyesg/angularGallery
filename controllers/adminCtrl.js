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
            $scope.btnAccept = "Guardar";
            $scope.userForm.$setPristine();
            $scope.userForm.$setUntouched();
            // $scope.userForm = {
            //     username : "",
            //     password : "",
            //     passwordRepeat : "",
            //     email : ""
            // };
            angular.element("#modalUpdate").modal('toggle');
        };

        $scope.btnBorrar = function () {
            $scope.modalTitle = "Borrar elementos";
            $scope.modalText = "Está seguro de eliminar estos elementos?";
            $scope.btnAccept = "Eliminar";
            angular.element("#table-options").addClass("d-none");
            angular.element("#modalMsg").modal('toggle');
        };

        angular.element("#btnAccept").on('click', function () {
            console.log("eliminar");
            var selected = angular.element("#table").bootstrapTable('getSelections');
            angular.forEach(selected, function (value, key) {
                console.log(value._id);
                angular.element("#table").bootstrapTable('remove', {
                    field: '_id',
                    values: [value._id]
                });
            });

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


    }])
    .directive("compareTo", function () {
        return {
            require: "ngModel",
            scope:
                {
                    passwordRepeat: "=compareTo"
                },
            link: function (scope, element, attributes, paramval) {
                paramval.$validators.compareTo = function (val) {
                    return val == scope.passwordRepeat;
                };
                scope.$watch("passwordRepeat", function () {
                    paramval.$validate();
                });
            }
        };
    });