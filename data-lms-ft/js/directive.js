materialAdmin.directive('convertToNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function (val) {
				return val != null ? parseInt(val, 10) : null;
			});
			ngModel.$formatters.push(function (val) {
				return val != null ? '' + val : null;
			});
		}
	};
});
materialAdmin.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function () {
				scope.$apply(function () {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

materialAdmin.directive('lazyLoadTrigger', [function () {
	return {
		restrict: 'A',
		// scope: {
		// 	'dataLoading': '&lazyLoadTrigger',
		// },
		link: function (scope, element, attrs) {
			element.on('scroll', function (event) {
				let that = angular.element(this);
				if (that[0].scrollHeight - that.scrollTop() === that.outerHeight()) {
					scope.$eval(attrs.lazyLoadTrigger);
				}
			});
		}
	};
}]);

materialAdmin.directive('jaFixHead', ['$parse', '$timeout', function ($parse, $timeout) {
	return {
		restrict: 'A',
		link: link,
	};

	function link(scope, element, attr) {

		const eleWrapper = element.parent(),
			head = element.find('thead');

		let copyHead;

		if (attr.jaFixHead) {
			scope.$watch(attr.jaFixHead + '.length', function (newVal, oldVal) {
				if (newVal === 0)
					return;

				$timeout(function () {
					createHeadCopy()
				});
			});

			scope.$watch(attr.jaFixHead, function (newVal, oldVal) {
				// if(newVal === 0)
				// 	return;

				$timeout(function () {
					createHeadCopy()
				});
			});
		}

		createHeadCopy();

		eleWrapper.on('scroll', function () {
			const that = angular.element(this);
			copyHead.css({
				'top': that.scrollTop() + 'px'
			});
		});

		function createHeadCopy() {
			element.find('.ja-header-fix').remove();

			copyHead = head.clone().attr('class', 'ja-header-fix').css({
				'position': 'absolute',
				'z-index': '1',
				'top': '0px',
				'visibility': 'visible'
			});

			head.find('th').each(function (i) {
				const ele = angular.element(this),
					cEle = angular.element(copyHead.find('th')[i]);

				cEle.on('click', function () {
					ele.trigger('click');
				});

				cEle.css({
					height: ele.css('height'),
					width: ele.css('width')
				})
			});

			element.prepend(copyHead);
			head.css({'visibility': 'hidden'});
		}
	}
}]);

materialAdmin.directive('mapPlace', [function () {
	return {
		restrict: 'A',
		link: link,
		scope: {
			'mapPlace': '&'
		}
	};

	function link(scope, element, attr, controller) {

		const ele = element,
			map = angular.element('#toolTipDiv'),
			mapParent = map.parent();

		ele.on('mouseenter', function () {
			if (ele.children('div').length == 0)
				return;
			ele.children('div').css({
				'display': 'block'
			}).append(map);
			map.addClass('showIt').removeClass('hideIt');
			scope.mapPlace();
		});

		ele.on('mouseleave', function () {
			mapParent.append(map);
			ele.children('div').css({
				'display': 'none'
			});
			map.addClass('hideIt').removeClass('showIt');
		});

	}
}]);

materialAdmin.directive('postionTop', ['$window', function ($window) {
	return {
		restrict: 'A',
		link: link,
		scope: {
			'postionTop': '&',
			'address': '='
		}
	};

	function link(scope, element, attr, controller) {

		const ele = element,
			eleScroll = ele.parents('.ms-menu'),
			map = angular.element('#toolTipDiv'),
			mapParent = map.parent(),
			mapWrapper = angular.element('#toolTipDivMapWrapper'),
			window = $($window);

		ele.on('mouseenter', function (e) {
			mapWrapper.append(map);
			mapWrapper.show();
			mapWrapper.children('.addr').html(scope.address);
			let diff = window.height() - e.pageY - 400;
			diff = diff < 0 ? diff : 0;
			mapWrapper.css({
				'postion': 'fixed',
				'top': (e.pageY + diff - 10) + 'px',
				'left': (e.pageX - 10) + 'px'
			});
			map.addClass('showIt').removeClass('hideIt');
			scope.postionTop();
			e.stopImmediatePropagation();
		});

		mapWrapper.on('mouseleave', function (e) {
			hideIt();
		});

		mapWrapper.on('mouseover', function (e) {
			e.stopImmediatePropagation();
			e.stopPropagation();
		});

		angular.element('#section_main_masters_home').on('mouseover', function () {
			hideIt();
		});

		function hideIt() {
			if (mapWrapper.css('display') == 'block') {
				mapParent.append(map);
				mapWrapper.hide();
				map.removeClass('showIt').addClass('hideIt');
			}
		}
	}
}]);

materialAdmin.directive('jaLazyLoadRepeat', ['$timeout', function ($timeout) {
	return {
		'restrict': 'A',
		'link': link,
	};

	function link(scope, element, attr) {
		const key = attr.jaLazyLoadRepeatName || element.attr('ja-lazy-load-repeat').split('|')[0].trim().replace(/{|}/g, '');
		const repeatKey = 'jaArr' + key;
		let arr = undefined,
			isTriggered = false,
			lastScrollTop = 0,
			currentPage = 0,
			pageLength = 20,
			totalPages = 0;

		scope[repeatKey] = [];

		attr.$observe('jaLazyLoadRepeat', function (val) {
			currentPage = 0;
			scope['jaFilterArr' + key] = arr = val ? JSON.parse(val) : [];
			scope[repeatKey] = arr.slice(currentPage, pageLength);
			totalPages = arr.length / pageLength;
		});

		element.on('scroll', function (event) {
			const that = angular.element(this);

			if (that.scrollTop() < lastScrollTop) {
				lastScrollTop = that.scrollTop();
				return;
			}
			lastScrollTop = that.scrollTop();

			//console.log((that[0].scrollHeight - that.scrollTop()).toFixed(0), ' --- ', 100+that.outerHeight()+'');
			if (!isTriggered && (that[0].scrollHeight - that.scrollTop()).toFixed(0) <= 150 + that.outerHeight()) {
				isTriggered = true;

				// console.log('triggered');
				loadData(currentPage + 1);

				$timeout(function () {
					isTriggered = false;
				}, 200);
			}
		});

		function loadData(page) {
			if (page > totalPages)
				return;

			scope[repeatKey].push(...arr.slice(pageLength * page, pageLength * page + pageLength));
			currentPage = page;
		}
	}
}]);

materialAdmin.directive('jaPrint', ['$uibModal', function ($uibModal) {
	return {
		'restrict': 'A',
		'link': link,
		scope: {
			'jaPrint': '&'
		}
	};

	function link(scope, element, attr) {

		element.on('click', function () {
			scope.jaPrint()
				.then(function (res) {
					if (!res.html) {
						swal('Error', 'No Html Template Found', 'error');
						return;
					}

					openModal(res.aTemplate, res.html)
				}).catch(function (err) {
				console.log(err);
			});
		});

		function openModal(aTemplate = [], htmlSting) {
			$uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: ['$scope', '$uibModalInstance', 'modalData', printController],
				resolve: {
					modalData: function () {
						return {
							aTemplate,
							htmlSting
						}
					}
				}
			})
		}

		function printController(
			$scope,
			$uibModalInstance,
			modalData
		) {
			$scope.aTemplate = modalData.aTemplate;
			$scope.html = modalData.htmlSting;

			$scope.closeModal = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}
	}
}]);

materialAdmin.directive('regVehicleDetail', [function () {
	return {
		restrict: 'E',
		scope: {
			oVehicle: '=vehicle'
		},
		templateUrl: 'views/myRegisteredVehicle/registeredVehicleDetail.html',
		controller: function ($scope) {
			let vm = this;
			$scope.$watch('oVehicle', function (newVal) {
				vm.oVehicle = newVal;
			});
		},
		controllerAs: 'detailVm'
	};
}]);

materialAdmin.directive('stationaryFormat', [function () {

	return {
		restrict: 'A',
		link: link,
	}

	function link(scope, element, attr, controller) {

		let aAllowedAnnotation = [
			'{\\d{0,5}}',
			'{YYYY}',
			'{YY}',
			'{MMMM}',
			'{MMM}',
			'{MM}',
			'{DD}',
		];

		let regex = new RegExp(aAllowedAnnotation.join('|'), 'g');
		let format = '';
		let date = new Date();
		let num = 1;
		let genValue = 0;
		let digitMax = 16;
		let digitMaxOther = 20;

		scope.$watch(function (newVal) {
			genValue = 0;
			format = element[0].value;
			num = 1;
			if (element[0].value) {
				format = typeof format == 'string' && format.length > 0 && format || false;
				if (!!format.match(aAllowedAnnotation[0])) {
					let noOfZero = Number(format.match(aAllowedAnnotation[0])[0].slice(1, -1));
					let zeros = false;
					if (noOfZero - (num + '').length >= 0) {
						zeros = Array(noOfZero - (num + '').length).fill(0).join('');
						num = zeros + num;
						genValue = generateBookNo();
						if (genValue.length > digitMax && (attr.stationaryType == 'Bill' || attr.stationaryType == 'Credit Note')) {
							$('#showformatError').html(`Format value (${genValue}) should not be max ${digitMax} digits.`);
						} else if (genValue.length > digitMaxOther) {
							$('#showformatError').html(`Format value (${genValue}) should not be max ${digitMaxOther} digits.`);
						} else {
							$('#showformatError').html('');
						}
					} else
						return false;
				} else
					return false;
			} else
				return false;

		});

		function generateBookNo() {
			format = element[0].value;
			let genratedBookNo = format.replace(regex, function (match) {
				if (match.match(aAllowedAnnotation[0]))
					return num != 'regex' ? num : `(\\d${match})`;
				else
					return moment(date).format(match.slice(1, -1));
			});

			return genratedBookNo;
		}
	}

}]);

materialAdmin.directive('fillDate', [function () {
	return {
		restrict: 'A',
		'link': link,
	};

	function link(scope, element, attr, ngModel) {

		let aPtr = attr.ngModel.split('.');
		let wrapper, wrapperKey;
		const ISO_REGEX = '[0-9]{4}-[0-1]{1}[0-9]{1}-[0-3]{1}[0-9]{1}T[0-2]{1}[0-9]{1}:[0-6]{1}[0-9]{1}:[0-6]{1}[0-9]{1}.\\d+Z';

		element.on('blur', function (event) {

			let newDate = new Date();
			const value = element[0].value.trim();

			if (value.length > 0) {

				const value = element[0].value.trim();

				if (value.length > 0) {

					let aDate;

					aDate = value.replace(/[ ]|[.]|[-]/g, '/').split('/');

					let date = Number(aDate[0]) || new Date().getDate();
					let month = Number(aDate[1]) || new Date().getMonth() + 1;
					let year = Number(aDate[2]) || new Date().getFullYear();

					newDate = new Date(`${month}/${date}/${year}`);
					newDate = new Date(newDate.setHours(0, 0, 0, 0));

					if (attr.maxDate && newDate) {
						let maxDate = scope.$eval(attr.maxDate);

						if (newDate.getTime() >= maxDate.getTime()) {
							swal('Error', `Date should be less than ${moment(maxDate).format('DD/MM/YYYY')}`, 'error');
							newDate = false;
						}
					}

					if (attr.minDate && newDate) {
						let minDate = scope.$eval(attr.minDate);

						if (newDate.getTime() <= minDate.getTime()) {
							swal('Error', `Date should be grater than ${moment(minDate).format('DD/MM/YYYY')}`, 'error');
							newDate = false;
						}
					}
				}

			} else
				newDate = '';

			defineWrapper();
			wrapper[wrapperKey] = checkVal(newDate);
			scope.$apply();
			scope.$eval(attr.ngChange);
		});

		scope.$watch(attr.ngModel, function (newVal) {

			if (typeof newVal === 'string' && newVal.match(ISO_REGEX))
				newVal = new Date(newVal);

			if (newVal instanceof Date) {
				defineWrapper();
				wrapper[wrapperKey] = checkVal(newVal);
			}

		});

		function checkVal(val) {

			let date;

			if (val instanceof Date)
				date = moment(val);
			else
				date = moment(val, 'DD/MM/YYYY');

			if (!date.isValid())
				return '';

			return date.format('DD/MM/YYYY');
		}

		function defineWrapper() {
			if (aPtr.length > 1) {
				let valPtr = scope.$eval(aPtr.slice(0, -1).join('.'));
				wrapper = valPtr;
				wrapperKey = aPtr.slice(-1)[0];
			} else {
				wrapper = scope;
				wrapperKey = attr.ngModel;
			}
		}
	}

}]);

materialAdmin.directive('chosenExtend', ['$timeout', function ($timeout) {

	//TODO this component under development phase don't use it & don't delete it @JackAVins
	//chosen-extend="vm.justForTesting($veiwValue)"

	return {
		restrict: 'A',
		link,
		scope: {
			'onChangeFn': '&chosenExtend'
		}
	};

	function link(scope, element, attr) {

		if (!attr.ngOptions)
			return;

		var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

		let input;
		const inputEle = angular.element(element).parent();

		let optionExp = attr.ngOptions.match(NG_OPTIONS_REGEXP),
			value;

		// optionExp && (value = scope.$eval(optionExp[8]));

		optionExp && scope.$watch('$parent.' + optionExp[8], function (newVal, oldVal) {
			if (Array.isArray(newVal) && newVal.length === 0) {
				scope.$eval(`$parent.${optionExp[8]}.push({})`);
			}

			if (!newVal) {
				scope.$eval('$parent.' + optionExp[8] + ' = [{}]');
			}

			$timeout(function () {
				inputEle.find('.chosen-container .chosen-search input').val(input);
			});
		});


		inputEle.on('keyup', '.chosen-container .chosen-search input', function (event) {
			input = angular.element(this).val();
			scope.onChangeFn({$veiwValue: input});
		});
	}
}]);

materialAdmin.directive('focusMe', function ($timeout, $parse) {
	return {
		//scope: true,   // optionally create a child scope
		link: function (scope, element, attrs) {
			var model = $parse(attrs.focusMe);
			scope.$watch(model, function (value) {
				if (value === true) {
					$timeout(function () {
						element[0].focus();
					});
				}
			});
		}
	};
});

materialAdmin.directive('emptyTypeahead', ['$timeout', function ($timeout) {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {

			element.on('focus', function (e) {
				$timeout(function () {
					// if(angular.element(e.target).val() === '')
					let value = angular.element(e.target).val() || ' ';
					angular.element(e.target).val(value);
					modelCtrl.$setViewValue(value);
					// modelCtrl.$render();
					// angular.element(e.target).val('');
					angular.element(e.target).trigger("input");
					angular.element(e.target).trigger("change");
					// $timeout(function () {
					// 	angular.element(e.target).val(value);
					// });
					// $timeout(function () {
					// 	modelCtrl.$setViewValue('');
					// });
				});
			});

			// this parser run before typeahead's parser
			modelCtrl.$parsers.unshift(function (inputValue) {
				return modelCtrl.$viewValue = inputValue || secretEmptyKey;
			});

			// this parser run after typeahead's parser
			modelCtrl.$parsers.push(function (inputValue) {
				return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
			});
		}
	}
}]);

materialAdmin.directive('disableBtn', ['$timeout', function (
	$timeout
) {
	return {
		restrict: 'A',
		'link': link,
	};

	function link(scope, element, attr, ngModel) {
		let timeout;
		element.on('click', function (event) {
			timeout = $timeout(function () {
				$(element).prop('disabled', false);
			}, 1000 * 60 * 4);
		});

		scope.$on('$destroy', function () {
			$timeout.cancel(timeout);
		});
	}

}]);

materialAdmin.directive('isShipmentNumValid', ["isShellTrackingDocFilter", function (
	isShellTrackingDocFilter
) {
	return {
		restrict: 'A',
		'link': link,
	};

	function link(scope, element, attr, ngModel) {

		scope.$watchGroup([attr.customer, attr.ngModel], ([customer, shipmentNum]) => {
			if (isShellTrackingDocFilter(customer)) {
				let ele = element.parent();
				ele.find('#sne').remove();

				let form = scope.$eval(attr.isShipmentNumValid);
				form && form.$setValidity("invalidRefNum", true);

				if (shipmentNum && !isValidShipmentNumber(shipmentNum)) {
					form && form.$setValidity("invalidRefNum", false);
					element.parent().append(`
						<div class="error" id="sne">Invalid Shipment Number</div>
					`);
				}
			}
		});
	}

	function isValidShipmentNumber(string) {
		try {
			let arr = string.split(",").map(o => {
				o = o.trim();

				if (o.match(/[^0-9,]/g) || o.length == 0)
					throw new Error("invalid string");

				return o;
			});

			// let noOfComma = string.match(/,/g) || 0;
			// let noOfWord = noOfComma + 1;
			//
			// if(arr.length != noOfWord)
			// 	throw new Error("invalid string");

			return true;
		} catch (e) {
			// console.log(e);
			return false;
		}
	}

}]);

materialAdmin.directive('grFormFormula', ['$timeout', function (
	$timeout
) {
	return {
		restrict: 'A',
		'link': _link,
	};

	function _link(scope, ...params) {
		$timeout(() => {
			scope.$watch('grUVm.__FormList', () => {
				link(scope, ...params);
			});
		});
		// $timeout(link, 0, scope, ...params);
	}

	function link(scope, element, attr, ngModel) {
		const splitExpr = attr.grFormFormula.split('.');
		const vm = scope.$eval(splitExpr[0]);
		var formConfig = scope.$eval(attr.grFormFormula);
		formConfig = formConfig || {};
		let isReadOnly = vm.readonly || !!formConfig.evalExp || (typeof formConfig.editable == 'undefined' ? false : !formConfig.editable);
		const required = (typeof formConfig.req == 'undefined' ? false : formConfig.req);
		const label = element.parents('.form-group').find('label');

		if (formConfig.isSupplymentry)
			isReadOnly = vm.supplyReadonly;

		if (required) {
			label.addClass('req');
			element.attr('required', required);
		}

		if (isReadOnly)
			element.attr('readonly', isReadOnly);

		if (typeof formConfig.notApplyTax == 'undefined' ? false : formConfig.notApplyTax)
			label.addClass('notApplyTax');

		if (formConfig.label) {
			element.attr('placeholder', formConfig.label);
			label.html(formConfig.label);
		}

		const {watcherExpression, evaluationExpression} = getWatchAndEvaluateExpression(formConfig.evalExp);

		watcherExpression.length && scope.$watchGroup(watcherExpression, (newVal, oldVal) => {
			$timeout(() => {
				scope.$eval(attr.ngModel + ' = ' + evaluationExpression);
			});
		});
	}

	function getWatchAndEvaluateExpression(aEvalExp = []) {
		let evaluationExpression = '';
		let watcherExpression = [];
		aEvalExp.forEach(s => {
			let temp;

			if (s === '+' || s === '*' || s === '/' || s === '-' || s === '(' || s === ')')
				evaluationExpression += s;
			else if (typeof s === 'number')
				evaluationExpression += s;
			else if ((index = s.indexOf('(RC)')) + 1) {
				let key = s.slice(0, index);
				let val;
				evaluationExpression += val = (scope.invoice['rateChart' + key[0].toUpperCase() + key.slice(1)] || scope.invoice[key]);
				watcherExpression.push(s);
			} else {
				if ((temp = $(`form input[name="${s}"]`).attr('ng-model'))) {
					temp = temp.replace(/invoice\./, 'grUVm.selectedGr.invoices[0].');
					evaluationExpression += temp;
					watcherExpression.push(temp);
				}
			}
		});

		return {
			evaluationExpression,
			watcherExpression
		}
	}

}]);

materialAdmin.directive('focusable', ['$timeout', function (
	$timeout
) {
	return {
		restrict: 'A',
		'link': link,
	};

	function link(scope, element, attr, ngModel) {
		$timeout(() => {
			let ele = jGetElement(element);
			ele.on('keydown', function (e) {
				if (e.which === 9) {
					e.preventDefault();
					let currentIndex = getIndex(element);
					let nextIndex = fixIndex(currentIndex + (e.shiftKey ? -1 : 1));
					let nextInput = getAllFocusableElement().get(nextIndex);
					while (isDisabled(nextInput)) {
						nextIndex = fixIndex(nextIndex + (e.shiftKey ? -1 : 1));
						nextInput = getAllFocusableElement().get(nextIndex);
					}
					focusOnElement(nextInput)
				}
			});
		}, 500);
	}

	function isDisabled(element) {
		let ele = angular.element(element);
		if (isChosen(ele))
			return !!jGetElement(ele).is('.chosen-disabled');

		return !!(ele.is('[disabled]') || ele.is('[readonly]'))
	}

	function fixIndex(index) {
		let length = getAllFocusableElement().length;
		if (index < 0)
			return length - 1;
		return index % length;
	}

	function focusOnElement(element) {
		let ele = getElement(element)
		ele.focus();
		ele.select();
	}

	function getElement(element) {
		let ele = element;
		if (isChosen(element))
			ele = ele.nextSibling.children[0];

		return ele;
	}

	function jGetElement(element) {
		let ele = $(element);
		if (isChosen(element))
			ele = ele.next();

		return ele;
	}

	function isChosen(ele) {
		return !!angular.element(ele).is('select[chosen]');
	}

	function getIndex(element) {
		return getAllFocusableElement().index(element);
	}

	function getAllFocusableElement() {
		return angular.element('[focusable]');
	}

}]);

materialAdmin.directive('placeAutocomplete', [
	function (

	) {
		return {
			require: 'ngModel',
			restrict: 'A',
			'link': link,
			scope: {
				"onSelect": '&',
				"ngModel": '='
			}
		};

		function link(scope, element, attr, ngModel) {
			if(google && google.maps && google.maps.places && google.maps.places.Autocomplete){
				const autocomplete = new google.maps.places.Autocomplete(element[0], {
					fields: ["address_components", 'geometry', "name"],
					types: ["(regions)"],
					language: "en",
					componentRestrictions: {country: "in"}
				});

				autocomplete.addListener("place_changed", fillInAddress);

				function fillInAddress() {
					// Get the place details from the autocomplete object.
					const place = autocomplete.getPlace();
					let c = "";
					let d = "";
					let f = "";
					let s = "";
					let pin = "";

					for (const component of place.address_components) {
						const componentType = component.types[0];

						switch (componentType) {
							case "sublocality_level_1":
								c = component.long_name;
								break;

							case "locality":
								c =  (c ? c + ' ' : '') + component.long_name;
								break;

							case "postal_code":
								pin = component.long_name;
								break;

							case "administrative_area_level_2":
								d = component.long_name;
								break;

							case "administrative_area_level_1": {
								if(!c)
									c = component.long_name;
								s = component.long_name;
								f = component.short_name;
								break;
							}
						}
					}

					let obj = {
						c, d, f, s, pin,
						location: place.geometry.location
					};

					scope.ngModel = obj;
					ngModel.$render();
					scope.$apply();
					scope.onSelect({
						$item: obj
					});
				}

				ngModel.$formatters.push((value) => {
					if(value && Object.keys(value).length && value.d) {
						value = value.c + ' ' + (value.d ? '(' + value.d + ')' : '') + ' (' + value.s + ')';
						return value;
					}else{
						return value.c;
					}
				});
			}
		}
	}]);

