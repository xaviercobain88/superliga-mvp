'use strict';

/* Services */


// Demonstrate how to register services
var services = angular.module('TournamentApp.Services', []);

services.factory('endpoint', [ function () {
    return  'http://192.168.0.108:8080/superliga-rest/api/v1/';
}]);

services.factory('RestServices', ['$http', 'endpoint', function ($http, endpoint) {



    function send(path, params) {
        params = params || {};
        return $http.post(endpoint + path, params); //.then(function (response){ return response; });
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
        post: function (path, params) {
            params = params || {};
            return send(path, params)
        }
    }

}]);

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


