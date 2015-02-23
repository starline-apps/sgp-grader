"use strict";
SGPGrader
    .factory("Gateway", ["$http","$q","Common",function($http, $q, Common) {
        var service = {
            post : function(path, obj){
                var d = $q.defer();
                console.log(obj);
                d.resolve(true);
                /*
                $http.post(path, obj)
                    .success(function(data) {
                        d.resolve(data);
                    })
                    .error(function(data) {
                        if (Common.isEmpty(data)){
                            data = "Undefined Error"
                        }
                        d.resolve({error:data});
                    });
                    */
                return d.promise;
            },
            get : function(path){
                var d = $q.defer();

                $http.get(path)
                    .success(function(data) {
                        d.resolve(data);
                    })
                    .error(function(data) {
                        if (Common.isEmpty(data)){
                            data = "Undefined Error"
                        }
                        d.resolve({error:data});

                    });

                return d.promise;
            }
        };
        return service;
    }]);
