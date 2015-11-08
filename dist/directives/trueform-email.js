/**
 * Created by rodrigo on 06/11/15.
 */

var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;


angular.module("TrueForm.email", []).directive("tfEmail", function () {

  return {

    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      var isEmailValid = function (value) {

        var dateRegExp = new RegExp(pattern);

        //RegExp
        return value.match(dateRegExp);


      };

      ngModel.$parsers.push(function(viewValue) {

        if (!isEmailValid(viewValue) && viewValue) ngModel.$setValidity('tfEmail', false);
        else ngModel.$setValidity('tfEmail', true);

        return viewValue;
      });
    }

  };

});