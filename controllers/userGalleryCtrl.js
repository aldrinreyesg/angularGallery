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




    $scope.init = function () {
        $scope.loadGall();
    }
});
