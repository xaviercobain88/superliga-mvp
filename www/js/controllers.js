/**
 * Created by xavier on 2/1/15.
 */
app.controller('LoginController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function () {
        alert("putos");
    }

}]);
app.controller('FeedController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function () {
        alert("putos");
    }

}]);

app.controller('SignupController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function () {
        alert("putos");
    }

}]);
app.controller('GenericController', ['$scope', '$timeout', '$mdBottomSheet', '$window', function ($scope, $timeout, $mdBottomSheet, $window) {
    $scope.showGridBottomSheet = function ($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'new-grid.html',
            controller: 'NewGridController',
            targetEvent: $event
        });

    };
    $scope.back = function () {
        $window.history.back();
    }
}]);
app.controller('NewGridController', ['$scope', '$mdBottomSheet', function ($scope, $mdBottomSheet) {
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
}]);
app.controller('NewTournamentInfoController', ['$scope', 'RestServices', 'disciplines' , 'endpoint', 'FileUploader',
    function ($scope, restServices, disciplines, endpoint, FileUploader) {

        $scope.disciplines = disciplines;
        $scope.tournamentInfo = {name: "Nuevo_Campeonato"};
        $scope.uploadedImage = false;
        $scope.randomColor = Math.floor((Math.random() * 1000000) + 1);

        $scope.getImageUrl = function () {

            if ($scope.tournamentInfo.name != undefined && $scope.uploadedImage === false) {
                var path = 'http://dummyimage.com/200x200/' + $scope.randomColor + '/fff.gif&text=';
                return path + $scope.tournamentInfo.name.split(' ').map(function (s) {
                    return s.charAt(0).toUpperCase();
                }).join('');
            } else if ($scope.uploadedImage === true) {
                return $scope.uploadedImageURL;
            }

            return 'http://dummyimage.com/200x200/' + $scope.randomColor + '/fff.gif&text=New';
            ;

        }

        //Uploader
        var uploader = $scope.uploader = new FileUploader({
            url: endpoint + 'images?token=MTIwMTUtMDItMDQgMTE6Mjc6MzkuMjcy'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onAfterAddingFile = function (fileItem) {
            console.log('onAfterAddingFile', fileItem);
            uploader.uploadAll();
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.log(response);
            $scope.uploadedImage = true;
            $scope.uploadedImageURL = response.data;

        };

    }]);


