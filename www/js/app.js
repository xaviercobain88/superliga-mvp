// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app = angular.module('TournamentApp', ['ui.router', 'ngMaterial', 'lumx', 'TournamentApp.Services']);
app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
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
            .state('new-tournament',
            {
                url: '/new-tournament',
                abstract: true,
                templateUrl: 'tournament-wizard.html'
            })
            .state('new-tournament.info',
            {
                url: '/info',
                templateUrl: 'info.html',
                controller: 'NewTournamentInfoController',
                resolve : {
                    disciplines: function(RestServices){
                        return RestServices.get("disciplines").then(function(response){
                            return response.data.data;
                        });
                    }
                }

            })


    }

);

