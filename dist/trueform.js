/**
 * Created by rodrigo on 13/10/15.
 */
var trueForm = angular.module("TrueForm", []);

trueForm.directive('tfBirthdate', function(){

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, attrs, element, ngModel){

      if(ngModel){

        //Parse
        ngModel.$parses.push(function(value) {

        });

        //Format
        ngModel.$render = function (value) {

        };
      }
    }
  }
});