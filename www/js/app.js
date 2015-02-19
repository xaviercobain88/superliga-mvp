// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app = angular.module('TournamentApp', [
    'ui.router',
    'ngMaterial',
    'lumx',
    'TournamentApp.Services',
    'pascalprecht.translate',
    'angularFileUpload',
    'ngStorage'
]);
app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $translateProvider, $httpProvider) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $translateProvider.translations('es', {
            FOOTBALL: 'Fútbol',
            CHESS: 'Ajedrez',
            SAVE_AND_CONTINUE: "Guardar y continuar",
            PHASE: "Fase",
            ADD_STAGE: "Agrega Fase",
            ERROR_IMAGE_NOT_UPLOADED_YET: "La imagen aún no se ha cargado",
            ERROR_EMPTY_TOURNAMENT_NAME: "El nombre del torneo no puede estar vacío",
            ERROR_EMPTY_TOURNAMENT_DISCIPLINE: "La disciplina del torneo no puede estar vacío",
            ERROR_INVALID_STAGES: "Las fases no se ha configurado correctamente",
            NEW: "Nuevo",
            DELETE_STAGE: "Eliminar fase",
            ERROR_AT_LEAST_1_STAGE: "El torneo debe tener por lo menos una fase",
            DIALOG_TITLE_ERROR: ":( Algo esta mal!",
            CHOOSE_MODE: "Escoge el modo de juego",
            SINGLE_ELIMINATION: "Copa",
            ROUND_ROBIN: "Liga",
            GROUPS: "Grupos",
            CHOOSE_INPUT_GROUPS: "Total de equipos",
            CHOOSE_INPUT: "Equipos",
            CHOOSE_GROUPS_NUMBER: "Grupos",
            CHOOSE_OUTPUT: "Ganadores/clasificados de la fase",
            CHOOSE_GROUPS: "Grupos",
            CHOOSE_EMAIL: "Email",
            CHOOSE_PASSWORD: "Contraseña",
            PLACEHOLDER_CHOOSE_EMAIL: "Ingresa tu email",
            PLACEHOLDER_CHOOSE_PASSWORD: "Ingresa tu contraseña",
            PLACEHOLDER_CHOOSE_GROUPS: "Ingresa el número de grupos",
            PLACEHOLDER_CHOOSE_INPUT_GROUPS: "Ingresa el número total de equipos",
            PLACEHOLDER_CHOOSE_INPUT: "Ingresa el número de equipos",
            PLACEHOLDER_CHOOSE_GROUPS_NUMBER: "Ingresa el número de grupos",
            PLACEHOLDER_CHOOSE_OUTPUT: "Ingresa el número de ganadores/clasificados",
            LOGIN: "Ingresar",
            SIGN_UP: "Crea una cuenta",
            FORGOT_PASSWORD: "Has olvidado tu contraseña?",
            ERROR_DEFAULT: "Sucedió algo inesperado",
            ERROR_INVALID_USERNAME_OR_PASSWORD: "El email y/o contraseña no son válidos",
            NEW_TOURNAMENT_NAME : 'Nuevo Campeonato'

        });
        $translateProvider.translations('en', {
            FOOTBALL: 'Soccer',
            CHESS: 'Chess'
        });
        $translateProvider.preferredLanguage('es');
        $mdThemingProvider.theme('default')
            .primaryPalette('orange', {
                'default': '900', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '50', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '500', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            });

        $urlRouterProvider.otherwise("authentication/login");
        $stateProvider
            .state('authentication',
            {
                url: '/authentication',
                abstract: true,
                templateUrl: 'authentication.html'
            })
            .state('authentication.login',
            {
                url: '/login',
                templateUrl: 'login.html',
                controller: 'LoginController'
            })
            .state('authentication.signup',
            {
                url: '/signup',
                templateUrl: 'signup.html',
                controller: 'SignupController'
            })
            .state('app',
            {
                url: '/app',
                abstract: true,
                templateUrl: 'app-template.html'
            })
            .state('app.feed',
            {
                url: '/feed',
                templateUrl: 'feed.html',
                controller: 'FeedController'
            })
            .state('tournament',
            {
                url: '/tournament',
                abstract: true,
                templateUrl: 'tournament-wizard.html'
            })
            .state('tournament.update',
            {
                url: '/:tournamentId',
                templateUrl: 'tournament-wizard-info.html',
                controller: 'NewTournamentInfoController',
                resolve: {
                    disciplines: function (RestServices) {
                        return RestServices.disciplines().then(function (response) {
                            return response.data.data;
                        });
                    },
                    tournament: function (RestServices, $stateParams, $translate) {
                        return RestServices.get("tournaments/" + $stateParams.tournamentId).
                            then(function (response) {
                                var tournament = response.data.data;
                                return  $translate(tournament.name).then(
                                    function (response) {
                                        tournament.name=response;
                                        return tournament;
                                    },function () {
                                    return tournament;
                                }
                                    );
                            });
                    }
                }

            })
            .state('tournament.stages',
            {
                url: '/:tournamentId/stages',
                templateUrl: 'tournament-wizard-setup.html',
                controller: 'NewTournamentSettingsController',
                resolve: {
                    disciplines: function (RestServices) {
                        return RestServices.get("disciplines").then(function (response) {
                            return response.data.data;
                        });
                    },
                    tournament: function (Utils, $rootScope) {
                        if ($rootScope.tournament) {
                            return $rootScope.tournament;
                        } else {
                            return Utils.newTournament();
                        }
                    },
                    stages: function (Utils, $stateParams, RestServices, $state) {
                        return  RestServices.sGet("tournaments/" + $stateParams.tournamentId + "/stages").then(
                            function (response) {
                                var stages = response.data.data;
                                if (!stages || !(stages instanceof  Array && stages.length > 0)) {
                                    return Utils.stages()
                                } else {
                                    return stages;
                                }
                            }, function (response) {
                                Utils.showError(response.data.restApiMessages.dangerMessages).then(
                                    function () {
                                        $state.go(Utils.routes.FEED);
                                    }
                                );
                            });
                    }

                }

            })


    }

);

