/*jshint -W079 */
var SGPGrader = angular.module('SGPGrader', ['djangoRESTResources', 'ngAnimate','ngResource','ngSanitize','ngAnimate', 'ngMaterial'])
    .config(function($httpProvider) {
        var token = $('input[name=csrfmiddlewaretoken]').val();
        $httpProvider.defaults.headers.post['X-CSRFToken'] = token;
        $httpProvider.defaults.headers.put['X-CSRFToken'] = token;



        //cfpLoadingBarProvider.includeSpinner = true;
    });