var angularGallery = angular.module('angularGallery', []);

angularGallery.controller('userGalleryCtrl', function($scope, $http) {
    $scope.loadGall = function() {
        $scope.user = "test";
        $scope.token = "asdasd";

        var timeout = 20000;
        $http({
            method: "GET",
            url: "http://localhost:3000/services/galleries",
            params: {
                user: $scope.user,
                token: $scope.token
            },
            timeout: timeout
        }).then(function mySuccess(response) {
            console.log(response);
            if(response.data.valid) {
                $scope.galleries = response.data.rows;
            }else{
                $scope.msgText = response.data.message;
                angular.element('#ajax-msg').removeClass("fade");
            }
        }, function myError(response) {
            console.log(response);
            $scope.msgType = false;
            $scope.msgText = response.data.message;
            angular.element('#ajax-msg').removeClass("fade");
        });
    }

    $scope.setSelectedGallery = function(gallery){

    }

    $scope.galleryVisible = function(row, value){
        console.log(row);
        // if(value){
        //     $scope.galVisibleColor.addClass('text-success');
        //     $scope.galVisiblePublicTrue.removeClass('fade');
        //     $scope.galVisiblePublicFalse.addClass('fade');
        // }else{
        //     $scope.galVisibleColor.addClass('text-danger');
        //     $scope.galVisiblePublicTrue.addClass('fade');
        //     $scope.galVisiblePublicFalse.removeClass('fade');
        // }

    }
    $scope.newImage = function(){
        if(!angular.isUndefined($scope.imgName) && !angular.isUndefined($scope.publicGall) && !angular.isUndefined($scope.inputGroupFile01)){
            var img = {
                name: $scope.imgName,
                desc: $scope.descript,
                public: $scope.publicGall,
                image: $scope.inputGroupFile01
            }
            var timeout = 20000;
            $http({
                method: "GET",
                url: "http://localhost:3000/services/imageUpload",
                params: {
                    token: $scope.token,
                    row: img
                },
                timeout: timeout
            }).then(function mySuccess(response) {
                console.log(response);
                if(response.data.valid) {
                    $scope.msgText = response.data.message;
                    angular.element('#ajax-msg').addClass("alert-success");
                    angular.element(".modal-add-img").modal('toggle');
                    angular.element('#ajax-msg').removeClass("fade");
                }else{
                    $scope.msgText = response.data.message;
                    angular.element('#ajax-msg').removeClass("fade");
                }
            }, function myError(response) {
                console.log(response);
                $scope.msgType = false;
                $scope.msgText = response.data.message;
                angular.element('#ajax-msg').addClass("alert-danger");
                angular.element('#ajax-msg').removeClass("fade");
            });
        }
    }

    $scope.delImg = function(){
        cleanMsg();
        var selected = angular.element("#table").bootstrapTable('getSelections');

        if( selected.length > 0 ) {
            var i = 0;
            var imgRow = [{}];
            angular.forEach(selected, function (value, key) {
                imgRow[i] = {_id: value._id}
                i++;
            });
            var timeout = 20000;
            $http({
                method: "GET",
                url: "http://localhost:3000/services/imageDelete",
                params: {
                    token: "asdadasd",
                    row: imgRow
                },
                timeout: timeout
            }).then(function mySuccess(response) {
                // console.log(response);
                if (response.data.valid) {
                    showMsg("success", response.data.message);
                    deleteTableRow();
                } else {
                    showMsg("danger", response.data.message);
                }
            }, function myError(response) {
                // console.log(response);
                // $scope.msgType = false;
                // $scope.msgText = response.data.message;
                showMsg("danger", 'Tiempo de ejecución agotado');
            });
        }else{
            showMsg("danger", "Debe seleccionar al menos un elemento");
        }

    }

    function deleteTableRow(){
        var ids = $.map(angular.element("#table").bootstrapTable('getSelections'), function (row) {
            return row._id;
        });
        angular.element("#table").bootstrapTable('remove', {
            field: '_id',
            values: ids
        });
    }

    $scope.init = function () {
        $scope.loadGall();
    }

    function cleanMsg() {
        angular.element('#ajax-msg').addClass("fade");
        angular.element('#ajax-msg').removeClass("alert-danger");
        angular.element('#ajax-msg').removeClass("alert-success");
    }

    function showMsg(type, msg) {
        switch (type) {
            case "danger":
                angular.element('#ajax-msg').addClass("alert-danger");
                break;
            case "info":
                angular.element('#ajax-msg').addClass("alert-warning");
                break;
            case "success":
                angular.element('#ajax-msg').addClass("alert-success");
                break;
        }
        $scope.msgText = msg;
        angular.element('#ajax-msg').removeClass("fade");
    }
});
