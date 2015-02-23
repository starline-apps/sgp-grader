"use strict";
SGPGrader
    .factory("Common", ["$mdToast",function ($mdToast) {

        return {
            scrollTo : function(parentId, childId){
                var parentScrollTop = $("#" + parentId).scrollTop();
                var childTop = $("#" + childId).position().top;
                var parentHeight = $("#" + parentId).height();
                var childHeight = $("#" + childId).height();
                $("#" + parentId).animate(
                    {scrollTop : parentScrollTop + childTop - (parentHeight / 2) + (childHeight / 2) -150},
                    'slow'
                );
            },
            isNumeric : function (input){
                return (input - 0) == input && (''+input).trim().length > 0;
            },
            isEmpty : function(str){
              if (str===undefined){
                return true;
              }else if (str===null){
                return true;
              }else if (str===""){
                return true;
              }
              return false;
            },
            isError : function(obj){
                if (!this.isEmpty(obj.error)){
                    return true;
                }
                return false;
            },
            showToastMessage: function(text, type) {
                if (type==="warning"){
                    $mdToast.show({
                        template: "<md-toast class='bg-yellow-dark c-black s-120 bold'>"+text+"</md-toast>",
                        hideDelay: 2000,
                        position:"bottom right"
                    });
                }else{
                    $mdToast.show({
                        template: "<md-toast class='color-bg-3 c-white s-120 bold'>"+text+"</md-toast>",
                        hideDelay: 3000,
                        position:"bottom right"
                    });
                }

            },
            toogleDialog : function(name, bln){
                if (bln){
                    $("#overlay").fadeIn();
                    $("#"+name).fadeIn();
                }else{
                    $("#overlay").fadeOut();
                    $("#"+name).fadeOut();
                }

            }

        };
    }]);

SGPGrader.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
SGPGrader
    .directive('iconFill', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var object = angular.element(element[0].children[0]);
                if(angular.isDefined(attr.iconFill)) {
                    object.load(function () {
                        var svg = angular.element(this.getSVGDocument().documentElement);
                        svg.attr('fill', attr.iconFill);
                    });
                }
            }
        };
    });

function loadingOverlay(bln, blnOverlay){
    if (bln){
        $("#overlay").fadeIn();
        $("#loading").fadeIn();

    }else{
        if (!blnOverlay){
            $("#overlay").fadeOut();
        }
        $("#loading").fadeOut();
    }
}function loadingOverlay2(bln){
    if (bln){
        $(".overlay-transparent").fadeIn();
    }else{
        $(".overlay-transparent").fadeOut();
    }
}
function loading(bln, blnCancel){
    if (bln){
        setTimeout(function(){
            $("#container").fadeOut();
            $("#loading").fadeIn("slow");
        },1000);
    }else{
        setTimeout(function(){
            $("#loading").fadeOut("slow", function(){
                if (!blnCancel){
                    setTimeout(function(){
                        $("#container").fadeIn("slow");
                    },1000);
                }
            });
        },2000);

    }
}
