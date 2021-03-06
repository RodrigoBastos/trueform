/**
 * Created by rodrigo on 05/11/15.
 */


var formats  = {
  'dd/MM/yyyy': {
    'view': 'dd/MM/yyyy',
    'delimiter': '/',
    'regexp': '(0[1-9]|[12][0-9]|3[01])[/.](0[1-9]|1[0-2])[/.]((19|20)[0-9][0-9])'
  },
  'dd-MM-yyyy': {
    'view': 'dd-MM-yyyy',
    'delimiter': '-',
    'regexp': '(0[1-9]|[12][0-9]|3[01])[-.](0[1-9]|1[0-2])[-.]((19|20)[0-9][0-9])'
  },
  'MM/dd/yyyy': {
    'view': 'MM/dd/yyyy',
    'delimiter': '/',
    'regexp': '(0[1-9]|1[0-2])[/.](0[1-9]|[12][0-9]|3[01])[/.]((19|20)[0-9][0-9])'
  },
  'MM-dd-yyyy': {
    'view': 'MM-dd-yyyy',
    'delimiter': '-',
    'regexp': '(0[1-9]|1[0-2])[-.](0[1-9]|[12][0-9]|3[01])[-.]((19|20)[0-9][0-9])'
  }
};

angular.module("TrueForm.date",[]).directive('tfDate', function($filter, $browser){

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      /*
       * FUNCTIONS
       */

      //Event
      var listener = function () {

        //Current Value
        var value = element.val();

        //Removes the last character
        value = value.slice(0, value.length - 1);

        //Update Value
        element.val(value ? value : '');

      };

      var pushNumber = function () {

        var format = getObjectFormatView(attrs.tfDateView);
        var value = element.val();
        var array = value.split(format.delimiter);
        var numbers = array.join("");
        var newValue = value;

        if(array[0].length > 2 || array[1].length > 2){

          newValue = '';

          for(var i = 0; i < numbers.length; i++){
            if (i == 2 || i == 4) newValue = newValue + format.delimiter;
            newValue = newValue + numbers[i];
          }

        }
        //Update View Value Input
        element.val(newValue);
      };

      //Get Format View
      var getObjectFormatView = function (formatView){
        //Default the format is 'dd/MM/yyyy'
        return formats[formatView] || formats['dd/MM/yyyy'];
      };

      //Rules
      var isDateValid = function (value, format) {

        var maxDate = attrs.tfDateLimit == 'true';

        var date = value;
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1; //Jan equals 0
        var day  = new Date().getDate();

        var error = false;
        var dateRegExp = new RegExp(format.regexp);
        var arrayDate = date.split(format.delimiter);

        //RegExp
        if (date.search(dateRegExp) == -1) error = true;

        //Current Date
        else if (maxDate && (arrayDate[2] > year || (arrayDate[2] == year && arrayDate[1] > month) || (arrayDate[2] == year && arrayDate[1] == month && arrayDate[0] > day)))
          error = true;

        //Months with thirty days
        else if (((arrayDate[1] == 4) || (arrayDate[1] == 6) || (arrayDate[1] == 9) || (arrayDate[1] == 11)) && (arrayDate[0] > 30)) error = true;

        //February
        else if (arrayDate[1] == 2) {
          if (arrayDate[0] > 28 && (arrayDate[2] % 4 != 0)) error = true;
          if (arrayDate[0] > 29 && (arrayDate[2] % 4 != 0)) error = true;
        }

        return !error;

      };

      //Input Format
      var editValue = function (oldValue, index, formatCurrent) {

        var lastChar = oldValue[index];
        var newValue = oldValue;

        if (lastChar != formatCurrent.delimiter) newValue = (oldValue.slice(0,index) + formatCurrent.delimiter + oldValue.slice(index + Math.abs(0)));

        element.val(newValue);

        return newValue;

      };

      if(ngModel){

        //Parse
        ngModel.$parsers.push(function(viewValue) {

          var formatCurrent = getObjectFormatView(attrs.tfDateView);
          //Format Input (Append '/')
          if (viewValue.length == 3) viewValue = editValue(viewValue, 2, formatCurrent);
          if (viewValue.length == 6) viewValue = editValue(viewValue, 5, formatCurrent);

          var delimter = formatCurrent.delimiter;
          var twoDelimter = delimter+delimter;

          //Default Type DATE
          var response = viewValue;

          var p = (viewValue + twoDelimter).split(delimter); // DD/MM/YYYY

          //Is date Valid?
          if (!isDateValid(viewValue, formatCurrent) && viewValue) ngModel.$setValidity('tfDate', false);
          else ngModel.$setValidity('tfDate', true);

          if (attrs.tfDateType == 'Number') response = Number(p[2] + p[1] + p[0]);
          else if (attrs.tfDateType = 'String') response = p[2] + p[1] + p[0];

          return response;
        });

        //Date Format dd/MM/yyyy
        ngModel.$render = function () {

          var formatCurrent = getObjectFormatView(attrs.tfDateView);
          var p = ngModel.$viewValue + '00000000';

          var value = p[0] + p[1] + p[2] + p[3] + ' ' + p[4] + p[5] + ' ' + p[6] + p[7];

          element.val($filter('date')(new Date(value), formatCurrent.view));

        };

        //Event Keyboard
        element.bind('keydown', function (event) {

          console.log('event', event);
          var key = event.keyCode;

          if ((key >= 8 && key <= 57) || (key >= 96 && key <= 105)) {

            $browser.defer(pushNumber);
            return;
          }

          $browser.defer(listener);

        });
      }
    }
  };
});