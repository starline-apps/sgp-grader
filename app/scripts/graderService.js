"use strict";

SGPGrader
    .factory("GraderService", ["Gateway", function(Gateway) {

        var service =  {
            get : function() {
                return Gateway.get("http://192.168.16.58:9000/teste.json");
               // return Gateway.get("http://192.168.16.55:8000/pucvirtual/api/v1/grade/rest/schedule/67441a3e-1e7f-11e4-9aaa-b8ac6f84a123/");
                //return Gateway.get("http://192.168.16.55:8000/pucvirtual/api/v1/grade/rest/schedule/8e40bbaa-5918-11e4-b814-74867afb4ce9/");
                //return Gateway.get("http://192.168.16.55:8000/pucvirtual/api/v1/grade/rest/schedule/67441a3e-1e7f-11e4-9aaa-b8ac6f84a123");

            },
            post : function(data) {
                //return Gateway.get("http://192.168.16.58:9000/teste.json");
                //return Gateway.post("http://192.168.16.55:8000/pucvirtual/api/v1/grade/rest/schedule/67441a3e-1e7f-11e4-9aaa-b8ac6f84a12/", data);
                return Gateway.post("http://192.168.16.55:8000/pucvirtual/api/v1/grade/rest/schedule/67441a3e-1e7f-11e4-9aaa-b8ac6f84a123", data);
            }
        };

        return service;


    }]);
