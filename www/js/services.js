'use strict';

/* Services */


// Demonstrate how to register services
var services = angular.module('TournamentApp.Services', [ ]);

services.factory('endpoint', [ function () {
    //return  'http://192.168.0.108:8080/superliga-rest/api/v1/';
    return  'http://192.168.1.12:8080/superliga-rest/api/v1/';
}]);

services.factory('RestServices', ['$http', 'endpoint', '$localStorage', 'Utils', '$state', function ($http, endpoint, $localStorage, Utils, $state) {


    function send(path, data, params) {
        params = params || {};

        return $http.post(endpoint + path, data, params); //.then(function (response){ return response; });
    }

    function securedPost(path, data, params) {
        params = params || {};
        if (Utils.checkForValidUserOnStorage()) {
            var token = $localStorage.loggedUser.token;
            return $http.post(endpoint + path + "?token=" + token, data, params);
        } else {
            return false;
        }

    }
    function securedPut(path, data, params) {
        params = params || {};
        if (Utils.checkForValidUserOnStorage()) {
            var token = $localStorage.loggedUser.token;
            return $http.put(endpoint + path + "?token=" + token, data, params);
        } else {
            return false;
        }

    }

    function securedGet(path, params) {
        params = params || {};
        if (Utils.checkForValidUserOnStorage()) {
            var token = $localStorage.loggedUser.token;
            return $http.get(endpoint + path + "?token=" + token, params);
        } else {
            return false;
        }

    }

    function load(path, params, cache) {
        params = params || {};
        cache = cache || false;
        return $http.get(endpoint + path, { params: params, cache: cache }); //.then(function (response){ return response; });
    }

    return  {
        get: function (path, params, cache) {
            params = params || {};
            return load(path, params, cache)
        },
        post: function (path, data, params) {
            params = params || {};
            return send(path, data, params)
        },
        sPost: function (path, data, params) {
            params = params || {};
            return securedPost(path, data, params)
        },
        sPut: function (path, data, params) {
            params = params || {};
            return securedPut(path, data, params)
        },
        sGet: function (path, params) {
            params = params || {};
            return securedGet(path, params)
        },
        disciplines: function () {
            return load("disciplines");
        }
    }

}]);


services.factory('Utils', ['$mdDialog', '$animate', '$translate', '$localStorage',
    function ($mdDialog, $animate, $translate, $localStorage) {

        return {
            showError: function (translateKey) {
                if (translateKey instanceof Array && translateKey.length > 0) {
                    translateKey = translateKey[0];
                } else if (!translateKey) {
                    translateKey = 'ERROR_DEFAULT'
                }
                return $translate(translateKey).then(function (errorMessage) {
                    var title = "";
                    return $translate('DIALOG_TITLE_ERROR').then(function (errorTitle) {
                        title = errorTitle;
                        return $mdDialog.show($mdDialog.alert().title(title).content(errorMessage).ok("OK"));
                    })

                });
            },
            translate: function (translateKey) {
                $translate(translateKey).then(function (errorMessage) {
                    return errorMessage;
                })
            },
            newTournament: function () {
                return {name: "Nuevo_Campeonato", discipline: "FOOTBALL"}
            },
            stages: function () {
                return  [
                    {
                        inputTeams: 16,
                        outputTeams: 1,
                        groupsNumber: 1,
                        transientPhase: 1

                    }
                ];
            },
            routes: {
                FEED: "app.feed",
                LOGIN: "authentication.login",
                TOURNAMENT_STAGES: "tournament.stages",
                TOURNAMENT_UPDATE: "tournament.update"
            },
            checkForValidUserOnStorage: function () {
                if (angular.isDefined($localStorage.loggedUser) &&
                    angular.isDefined($localStorage.loggedUser.username)) {
                    return true;
                }
                return false;
            },
            loggedUser: function () {
                if (angular.isDefined($localStorage.loggedUser) && $localStorage.loggedUser) {
                    return $localStorage.loggedUser;
                } else {
                    return {}
                }
            }


        }
    }

]

);

services.factory('PageResult', ['RestServices', function (restServices) {

    return function PageResult(method, path, params) {

        var self = this;
        self.params = params;

        this.loadPage = function () {

            var collection = this.list = [];

            return restServices[method](path, self.params).then(function (response) {
                //console.log(response);
                self.page_number = response.data.data.page_number;
                self.total_pages = response.data.data.total_pages;
                self.size = response.data.data.size;
                self.total = response.data.data.total;
                [].push.apply(collection, response.data.data.entity_list);
                return self;
            });

            //return this;

        }

        this.orderBy = function (orderBy, desc) {
            desc = desc || false;
            this.params.orderBy = orderBy;
            this.params.desc = desc;
            this.loadPage();
        }
    }

}]);


