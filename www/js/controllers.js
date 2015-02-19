/**
 * Created by xavier on 2/1/15.
 */
app.controller('LoginController', ['$scope', 'RestServices', '$state', 'Utils', '$localStorage',
    function ($scope, RestServices, $state, Utils, $localStorage) {

        $scope.init = function () {
            if (Utils.checkForValidUserOnStorage()) {
                $state.go(Utils.routes.FEED);
            }
            $scope.credentials = {};
        }
        $scope.login = function () {
            if (Utils.checkForValidUserOnStorage()) {
                $state.go(Utils.routes.FEED);
            } else {
                RestServices.post('login?username=' + $scope.credentials.username + "&" +
                        "password=" + $scope.credentials.password).then(function (response) {
                    $localStorage.loggedUser = response.data.data;
                    $state.go(Utils.routes.FEED);
                }, function (response) {
                    Utils.showError(response.data.restApiMessages.dangerMessages);
                });
            }


        }

        $scope.init();


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
app.controller('GenericController', ['$scope', '$timeout', '$mdBottomSheet', '$window', '$rootScope', 'Utils',
    function ($scope, $timeout, $mdBottomSheet, $window, $rootScope, Utils) {
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
app.controller('NewGridController', ['$scope', '$mdBottomSheet', "$state", "RestServices", "Utils",
    function ($scope, $mdBottomSheet, $state, RestServices, Utils) {
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
    $scope.newTournament = function(){
        RestServices.sPost("users/" + Utils.loggedUser().id + "/tournaments", $scope.tournament).
            then(function (response) {
                $state.go(Utils.routes.TOURNAMENT_UPDATE,
                    {tournamentId: response.data.data.id});
            }, function (response) {
                Utils.showError(response.data.restApiMessages.dangerMessages);
            });
    }
}]);
app.controller('NewTournamentInfoController',
    ['$scope', 'RestServices', 'disciplines' , 'endpoint', 'FileUploader',
        '$rootScope', 'Utils', '$state', 'tournament', 'RestServices', '$localStorage', '$translate',
        function ($scope, restServices, disciplines, endpoint, FileUploader, $rootScope, Utils, $state, tournament, RestServices, $localStorage, $translate) {


            $scope.init = function () {
                $rootScope.hasTabs = false;
                $scope.disciplines = disciplines;
                $scope.tournament = tournament;
                $scope.uploadedImage = false;
                $scope.randomColor = Math.floor((Math.random() * 1000000) + 1);
            }


            $scope.getImageUrl = function () {
                var path = 'http://dummyimage.com/200x200/' + $scope.randomColor + '/fff.gif&text=';
                if ($scope.tournament.name && !$scope.tournament.uploadedImage) {

                    return  $scope.tournament.uploadedImageURL = path + $scope.tournament.name.split(' ').map(function (s) {

                        return s.charAt(0).toUpperCase() ? s.charAt(0).toUpperCase() : '?';
                    }).join('');
                } else if ($scope.tournament.uploadedImage === true) {
                    return $scope.tournament.uploadedImageURL;
                }

                return 'http://dummyimage.com/200x200/' + $scope.randomColor + '/fff.gif&text=New';
                ;

            }

            //Uploader
            var uploader = $scope.uploader = new FileUploader({
                url: endpoint + 'images?token=MTIwMTUtMDItMDggMjM6MTI6MTEuMDk4'
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
                $rootScope.progressBar = 'indeterminate';
                uploader.uploadAll();
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {

                $rootScope.progressBar = null;
                $scope.tournament.uploadedImage = true;
                $scope.tournament.uploadedImageURL = response.data;

            };

            $scope.showError = function (messageKey) {
                Utils.showError(messageKey);
            };


            $scope.submit = function () {
                if ($rootScope.progressBar != null) {
                    Utils.showError('ERROR_IMAGE_NOT_UPLOADED_YET');
                } else if (!$scope.tournament.name) {
                    Utils.showError('ERROR_EMPTY_TOURNAMENT_NAME');
                } else if (!$scope.tournament.discipline) {
                    Utils.showError('ERROR_EMPTY_TOURNAMENT_DISCIPLINE');
                } else {
                    $rootScope.tournament = $scope.tournament;
                    RestServices.sPost("tournaments/"+$scope.tournament.id, $scope.tournament).
                        then(function (response) {
                            $state.go(Utils.routes.TOURNAMENT_STAGES,
                                {tournamentId: response.data.data.id});
                        }, function (response) {
                            Utils.showError(response.data.restApiMessages.dangerMessages);
                        });


                }

            }
            $scope.init();
        }]);
app.controller('NewTournamentSettingsController', [
    '$scope', '$rootScope', 'RestServices', 'Utils', 'disciplines', 'tournament', 'stages', '$stateParams',
    function ($scope, $rootScope, RestServices, Utils, disciplines, tournament, stages, $stateParams) {
        $scope.init = function () {
            $scope.tournament = tournament;
            $scope.stages = stages;
            $scope.goToStage(0);


        }
        $scope.areValidStages = function () {
            for (var stageIndex in $scope.stages) {
                var stage = $scope.stages[stageIndex];
                if (parseInt(stages.groupsNumber) > parseInt(stage.inputTeams) ||
                    parseInt(stage.groupsNumber) > parseInt(stage.outputTeams) ||
                    parseInt(stage.outputTeams) > parseInt(stage.inputTeams)) {
                    Utils.showError('ERROR_INVALID_STAGES');
                    return false;
                }
            }
            return true;

        }
        $scope.checkStageGroups = function (stage) {
            if (stage.mode != "GROUPS") {
                stage.groupsNumber = 1;
            }
        }
        $scope.addStage = function () {
            if ($scope.areValidStages()) {
                var newStageIndex = $scope.stages.length;

                $scope.stages.push({
                    inputTeams: 0,
                    outputTeams: 1,
                    groupsNumber: 1

                });
                $scope.$apply();
                //No se otra forma de sincronizar los tabs con los stages
                $scope.goToStage(newStageIndex);
            }

        }
        $scope.deleteStage = function ($index) {
            if ($scope.stages.length > 1) {
                $scope.stages.splice($index, 1);
                $scope.$apply();
            } else {
                Utils.showError('ERROR_AT_LEAST_1_STAGE');
            }

        }
        $scope.goToStage = function (stageIndex) {

            stageIndex = parseInt(stageIndex);

            $scope.stage = $scope.stages[stageIndex];
            $scope.selectedTabIndex = stageIndex;
            $scope.modes = disciplines[tournament.discipline];
            $scope.isOpenInputTeams = stageIndex == 0;
            if ($scope.modes && $scope.modes.length > 0 && !$scope.stage.mode) {
                $scope.stage.mode = $scope.modes[0];
            }
            calculateInputTeams(stageIndex);
        }
        function calculateInputTeams(stageIndexParam) {
            var relatedOutput = 0;
            var previousInput = 0;


            for (var stageIndex = 0; stageIndex < stageIndexParam; stageIndex++) {
                if (stageIndex == 0) {
                    previousInput = parseInt($scope.stages[stageIndex].inputTeams);
                    relatedOutput = parseInt($scope.stages[stageIndex].outputTeams);
                } else if (previousInput != $scope.stages[stageIndex].inputTeams) {
                    previousInput = parseInt($scope.stages[stageIndex].inputTeams);
                    relatedOutput = parseInt($scope.stages[stageIndex].outputTeams);
                } else if ((relatedOutput + parseInt($scope.stages[stageIndex].outputTeams)) < previousInput) {
                    relatedOutput += parseInt($scope.stages[stageIndex].outputTeams);
                } else {
                    relatedOutput += parseInt($scope.stages[stageIndex].outputTeams);
                    previousInput = relatedOutput;
                    relatedOutput = parseInt($scope.stages[stageIndex].outputTeams);
                }


            }
            $scope.inputs = [];
            if (relatedOutput == previousInput) {
                previousInput = 0;
            }
            if (relatedOutput > 1) {
                $scope.inputs.push(relatedOutput);
            }
            if (previousInput > 1) {
                $scope.inputs.push(previousInput);
            }
            if ($scope.inputs.length > 0 && !$scope.stages[stageIndex].inputTeams) {
                $scope.stages[stageIndex].inputTeams = $scope.inputs[0];
            }

            console.log($scope.inputs);

        }

        $scope.save = function(){

            RestServices.sPost("tournaments/"+$stateParams.tournamentId+"/stages",  $scope.stages).then(function (response) {
                console.log(response);
            }, function (response) {
                Utils.showError(response.data.restApiMessages.dangerMessages);
            });
            console.log($scope.stages);

        }


        $scope.init();

    }]);


