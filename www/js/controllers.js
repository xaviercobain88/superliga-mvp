/**
 * Created by xavier on 2/1/15.
 */
app.controller('LoginController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function(){
        alert("putos");
    }

}]);
app.controller('FeedController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function(){
        alert("putos");
    }

}]);

app.controller('SignupController', ['$scope', '$mdSidenav', '$location', function ($scope, $mdSidenav, $location) {
    $scope.goToSignUp = function(){
        alert("putos");
    }

}]);
app.controller('GenericController', ['$scope', '$timeout', '$mdBottomSheet','$window', function ($scope, $timeout, $mdBottomSheet, $window) {
    $scope.showGridBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'new-grid.html',
            controller: 'NewGridController',
            targetEvent: $event
        });

    };
    $scope.back = function(){
        $window.history.back();
    }
}]);
app.controller('NewGridController', ['$scope',  '$mdBottomSheet', function ($scope, $mdBottomSheet) {
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
}]);
app.controller('NewTournamentInfoController', ['$scope',  'RestServices','disciplines', function ($scope,  restServices, disciplines) {

    $scope.disciplines =  disciplines;
    $scope.info = {};

}]);


