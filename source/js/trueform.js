//= include ../../dist/directives/trueform-date.js
//= include ../../dist/directives/trueform-email.js

(function(){
  angular.module('TrueForm', [
    //Date
    'TrueForm.date',
    //Mail
    'TrueForm.email'
  ]);
})();
