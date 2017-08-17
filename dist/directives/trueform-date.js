// Formatos de data
// ToDo - Criar constante angular
const formats = {
	'dd/MM/yyyy': {
		view: 'dd/MM/yyyy',
		delimiter: '/',
		regexp: '(0[1-9]|[12][0-9]|3[01])[/.](0[1-9]|1[0-2])[/.]((19|20)[0-9][0-9])'
	},
	'dd-MM-yyyy': {
		view: 'dd-MM-yyyy',
		delimiter: '-',
		regexp: '(0[1-9]|[12][0-9]|3[01])[-.](0[1-9]|1[0-2])[-.]((19|20)[0-9][0-9])'
	},
	'MM/dd/yyyy': {
		view: 'MM/dd/yyyy',
		delimiter: '/',
		regexp: '(0[1-9]|1[0-2])[/.](0[1-9]|[12][0-9]|3[01])[/.]((19|20)[0-9][0-9])'
	},
	'MM-dd-yyyy': {
		view: 'MM-dd-yyyy',
		delimiter: '-',
		regexp: '(0[1-9]|1[0-2])[-.](0[1-9]|[12][0-9]|3[01])[-.]((19|20)[0-9][0-9])'
	}
};

/**
 * Diretiva para validação de data
 * @param $filter
 * @param $browser
 * @returns {{restrict: string, require: string, link: link}}
 */
function trueFormDate($filter, $browser) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			// Event
			function listener() {
				// Current Value
				var value = element.val();

				// Removes the last character
				value = value.slice(0, value.length - 1) || '';

				// Update Value
				element.val(value);
			}

			// Get Format View
			// Todo - Criar arquivo utils
			function getObjectFormatView(formatView) {
				// Default the format is 'dd/MM/yyyy'
				return formats[formatView] || formats['dd/MM/yyyy'];
			}

			function pushNumber() {
				var format = getObjectFormatView(attrs.tfDateView);
				var value = element.val();
				var array = value.split(format.delimiter);
				var numbers = array.join('');
				var newValue = value;
				var i = 0;

				if (array[0].length > 2 || array[1].length > 2) {
					newValue = '';
					for (; i < numbers.length; i += 1) {
						if (i === 2 || i === 4) newValue += format.delimiter;
						newValue += numbers[i];
					}
				}
				// Update View Value Input
				element.val(newValue);
			}

			// Rules
			function isDateValid(value, format) {
				var maxDate = attrs.tfDateLimit === 'true';
				var date = value;
				var year = new Date().getFullYear();
				var month = new Date().getMonth() + 1; // JAN is equals 0
				var day = new Date().getDate();

				var error = false;
				var dateRegExp = new RegExp(format.regexp);
				var arrayDate = date.split(format.delimiter);

				// RegExp
				if (date.search(dateRegExp) === -1) error = true;

				// Current Date
				else if (maxDate && (arrayDate[2] > year
						|| (arrayDate[2] === year && arrayDate[1] > month)
						|| (arrayDate[2] === year && arrayDate[1] === month
						&& arrayDate[0] > day))) error = true;

				// Months with thirty days
				else if (((arrayDate[1] === 4) || (arrayDate[1] === 6)
						|| (arrayDate[1] === 9) || (arrayDate[1] === 11))
						&& (arrayDate[0] > 30)) error = true;

				// February
				else if (arrayDate[1] === 2
						&& arrayDate[0] > 28
						&& (arrayDate[2] % 4 !== 0)) error = true;

				return !error;
			}

			// Input Format
			function editValue(oldValue, index, formatCurrent) {
				var lastChar = oldValue[index];
				var newValue = oldValue;

				var prefix = oldValue.slice(0, index);
				var delimiter = formatCurrent.delimiter;
				var sufix = oldValue.slice(index + Math.abs(0));

				if (lastChar !== formatCurrent.delimiter) newValue = prefix + delimiter + sufix;

				element.val(newValue);
				return newValue;
			}

			function tfDateParse(viewValue) {
				var formatCurrent = getObjectFormatView(attrs.tfDateView);
				var delimter = formatCurrent.delimiter;
				var twoDelimter = delimter + delimter;
				var parse = viewValue;
				var p;
				// Format Input (Append '/')
				if (viewValue.length === 3) parse = editValue(parse, 2, formatCurrent);
				if (viewValue.length === 6) parse = editValue(parse, 5, formatCurrent);

				p = (parse + twoDelimter).split(delimter); // DD/MM/YYYY

				// Is date Valid?
				if (!isDateValid(viewValue, formatCurrent) && viewValue) ngModel.$setValidity('tfDate', false);
				else ngModel.$setValidity('tfDate', true);

				if (attrs.tfDateType === 'Number') parse = Number(p[2] + p[1] + p[0]);
				else if (attrs.tfDateType === 'String') parse = p[2] + p[1] + p[0];

				return parse;
			}

			function tfDateRender() {
				var formatCurrent = getObjectFormatView(attrs.tfDateView);
				var p = ngModel.$viewValue + '00000000';

				var value = p[0] + p[1] + p[2] + p[3] + ' ' + p[4] + p[5] + ' ' + p[6] + p[7];

				element.val($filter('date')(new Date(value), formatCurrent.view));
			}

			function tfDateKeydown(event) {
				var key = event.keyCode;
				if ((key >= 8 && key <= 57) || (key >= 96 && key <= 105)) {
					$browser.defer(pushNumber);
					return;
				}
				$browser.defer(listener);
			}

			if (ngModel) {
				// Parse
				ngModel.$parsers.push(tfDateParse);
				// Date Format dd/MM/yyyy
				ngModel.$render = tfDateRender;
				// Event Keyboard
				element.bind('keydown', tfDateKeydown);
			}
		}
	};
}

angular.module('TrueForm.date', []).directive('tfDate', trueFormDate);
