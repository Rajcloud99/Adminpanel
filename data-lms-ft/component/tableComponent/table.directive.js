materialAdmin
	.directive('jaSortable', jaSortable)
	.directive('jaTable', jaTable)
	.filter('sumOfNumber', sumOfNumber)
	.controller('columnSettingPopupController', columnSettingPopupController);

jaTable.$inject = [
	'$filter',
	'$modal',
	'$parse',
	'$sce',
	'$timeout',
	'jaTableService',
	'sharedResource'
];

function columnSettingPopupController(
	$timeout,
	$uibModalInstance,
	columnSetting,
	jaTableService
) {
	let vm = this;
	vm.columnSetting = jaTableService.validateColumnSetting(columnSetting);
	vm.closeModal = closeModal;
	vm.save = save;
	vm.setVisibleColumn = setVisibleColumn;
	vm.checkAll = checkAll;
	vm.UncheckAll = UncheckAll;
	(function init() {
		prepareFunction();
	})();

   function prepareFunction(){
	   vm.allowedColumn = [];
		vm.columnSetting.allowedColumn.forEach(obj=>{
			vm.columnSetting.visibleColumn.indexOf(obj) !== -1 ? vm.allowedColumn.push({name:obj,isCheck:true}) : vm.allowedColumn.push({name:obj,isCheck:false})
		});
	}

	function closeModal() {
		$uibModalInstance.dismiss('close');
	}

	function save() {
		vm.columnSetting.visibleColumn = [];
		vm.allowedColumn.forEach(val=>{
			if(val.isCheck)
				vm.columnSetting.visibleColumn.push(val.name);
		});
		jaTableService.sortVisibleColumn(vm.columnSetting);
		$uibModalInstance.close(vm.columnSetting);
	}

	function setVisibleColumn(bool, val) {
		if (bool)
			vm.columnSetting.visibleColumn.push(val);
		else
			vm.columnSetting.visibleColumn.splice(vm.columnSetting.visibleColumn.indexOf(val), 1);
	}

	function checkAll(bool) {
		vm.UncheckTrue = false;
		if(bool) {
			vm.allowedColumn.forEach(val => {
				val.isCheck = true;
			});
		}else{
			prepareFunction();
		}
	}
	function UncheckAll(bool) {
		vm.checkTrue = false;
		if(bool) {
			vm.allowedColumn.forEach(val => {
				val.isCheck = false;
			});
		}else{
			prepareFunction();
		}
	}

}

function jaSortable() {

	function link(scope, element) {
		element.sortable({
			placeholder: "ui-state-highlight",
			cursor: "move",
			update: function (event, ui) {
				let arr = [];
				if(scope && scope.userLoggedIn && scope.userLoggedIn.userId === '000000') {
					element.children('li').each(function () {
						arr.push(angular.element(this).find('span').text());
					});
				} else {
					element.children('div').each(function () {
						arr.push(angular.element(this).find('span').text());
					});
				}

				console.log(arr);
				if(scope && scope.userLoggedIn && scope.userLoggedIn.userId === '000000') {
					scope.aHeader.forEach(item => item.order = arr.indexOf(item.label));
					scope.aHeader.sort((a,b) => {
						return a.order - b.order;
					});
				} else {
					scope.vm.columnSetting.allowedColumn = arr;
				}

			}
		});
	}

	return {
		link: link,
		restrict: 'E'
	};
}

function jaTable(
	$filter,
	$modal,
	$parse,
	$sce,
	$timeout,
	jaTableService,
	sharedResource
) {

	function link(scope, element, attrs, controller) {

		controller.api = {
			refresh: controller.refreshTable,
			clearSelection: controller.clearSelection,
			selectFirstRow: selectFirstRow,
			selectPreserve: controller.selectPreserve,
			bodyKey: attrs.tableBody.split('.').slice(-1)[0],
			selectableKey: attrs.tableSelectableModel.split('.').slice(-1)[0],
		};

		controller.applyColorOnRow = applyColorOnRow;
		controller.highlightRow = highlightRow;
		controller.cloneHeadFn = cloneHeadFn;
		controller.scrollToTop = scrollToTop;
		controller.selectAllRow = selectAllRow;
		controller.selectCheckAllCheckbox = selectCheckAllCheckbox;
		controller.selectFirstRow = selectFirstRow;
		controller.unSelectCheckAllCheckbox = unSelectCheckAllCheckbox;
		controller.unCheckAllCheckbox = unCheckAllCheckbox;
		controller.checkSelectedRows = checkSelectedRows;

		(function applyHeight() {
			element.find('form[name="tableForm"]').css({
				'height': controller.tableHeight || '300px',
				'overflow-y': 'scroll'
			});

			element.find('form[name="tableForm"]').on('scroll', checkScroll);

			function checkScroll(event) {
				const that = angular.element(this);

				const copyHeadHeight = Number.parseInt(element.find('.ja-header-fix').css('height') || 0);

				if ((that[0].scrollHeight - that.scrollTop()).toFixed(0) <= that.outerHeight()) {
					// console.log('stopped');
					controller.dataLoading();
					element.find('form[name="tableForm"]').off('scroll', checkScroll);
					$timeout(function () {
						element.find('form[name="tableForm"]').on('scroll', checkScroll);
						// console.log('active');
					}, 1000);
				}
			}

			element.find('form[name="tableForm"]').on('scroll', function () {
				const that = angular.element(this);
				element.find('.ja-header-fix').css({
					top: that.scrollTop() + 'px'
				});
			});
		})();

		function applyColorOnRow() {

			(controller.colouredRow || []).map(colorObj => {
				let columnIndex = controller.head.findIndex(head => head.key === colorObj.key);

				let parsedValue;
				switch (colorObj.valueType) {
					case 'number':
						parsedValue = Number(colorObj.value);
						break;
					case 'boolean':
						parsedValue = !!colorObj.value;
						break;
					default:
						parsedValue = colorObj.value;
				}

				controller.body.map((body, index) => {
					if (colorObj.value[0] === '!' ? (body[columnIndex] !== parsedValue) : (body[columnIndex] === parsedValue))
						angular.element(element.find('table tbody tr')[index]).css({
							'background': colorObj.bgColor,
							'color': colorObj.color || 'black'
						})
				});
			});
		}

		function cloneHeadFn() {

			const copyHead = $('<div class="ja-header-fix"></div>');
			copyHead.css({
				'z-index': 3,
				'position': 'relative',
				top: $('form[name="tableForm"]').scrollTop() + 'px'
			});

			const head = element.find('table thead');

			head.children().each(function (i) {

				let tDiv = $('<div></div>'),
					tr = $(this);

				$(this).children().each(function (i) {
					let td = $(this);
					tDiv.append($('<div></div>').css({
						'height': td.css('height'),
						'width': td.css('width'),
						'border-right': '1px solid white',
						'float': 'left',
						'text-align': 'center',
						'color': '#fff',
						'font-weight': '500',
						'background': '#2196f3',
						'text-transform': 'uppercase',
						'display': 'flex',
						'justify-content': 'center',
						'flex-direction': 'column'
					}).html(td.clone(true).children()));
				});
				tDiv.css({
					height: tr.css('height'),
					width: Number.parseInt(tr.css('width')) + 4 + 'px',
					border: '1px solid white'
				});
				copyHead.append(tDiv);
			});

			element.find('.ja-header-fix').remove();
			element.find('table').before(copyHead);

			element.find('table').css({
				top: `-${Number.parseInt(copyHead.css('height'))}px`
			});

			// head.find('th').each(function (i) {
			// 	const cEle = angular.element(copyHead.find('th')[i]);
			//
			// 	cEle.each(function() {
			// 		let attributes = $.map(this.attributes, item => item.name);
			// 		$.each(attributes, (i, item) => $(this).removeAttr(item));
			// 	});
			//
			// 	cEle.find('p input').removeAttr('id');
			//
			// 	const ele = angular.element(this);
			//
			// 	element.find('table').on('click', `thead.ja-header-fix tr th:nth-child(${i})`, function (event) {
			// 		$(this).clearQueue();
			// 		let bubblePath = parseBubblePath(event, 'th');
			// 		element.find(`table thead:not(.ja-header-fix) tr th:nth-child(${i}) ${bubblePath}`).trigger('click');
			// 		event.stopImmediatePropagation();
			// 	});
			//
			// 	cEle.css({
			// 		height: ele.css('height'),
			// 		width: ele.css('width')
			// 	});
			//
			// 	function parseBubblePath(event, tagCondition) {
			//
			// 		let arrPathString = [];
			//
			// 		for(let key in event.originalEvent.path)
			// 			if($(event.originalEvent.path[key]).prop('tagName').toLowerCase() === tagCondition)
			// 				break;
			// 			else
			// 				arrPathString.push($(event.originalEvent.path[key]).prop('tagName').toLowerCase());
			//
			// 		return arrPathString.reverse().join(' ');
			// 	}
			// });
		}

		function scrollToTop() {
			element.find('form').scrollTop('0px');
		}

		function selectAllRow() {
			element.find('div.ja-header-fix #tableSelectAllRow').change(function (event) {
				$(this).clearQueue();
				let checkValue;
				if (angular.element(this).prop('checked') === true)
					checkValue = false;
				else
					checkValue = true;

				element.find('div.ja-header-fix p input').prop('checked', !checkValue);

				element.find('table tbody tr').each(function (index) {
					let row = angular.element(this);
					if (row.find('input').prop('checked') === checkValue)
						row.children().first().trigger('click');
				});
				event.stopImmediatePropagation();
			});
		}

		function selectCheckAllCheckbox() {
			let flag = true;
			element.find('table tbody tr input').each(function () {
				if (angular.element(this).prop('checked') === false)
					flag = false;
			});
			if (flag)
				element.find('div.ja-header-fix #tableSelectAllRow').prop('checked', true);
		}

		function selectFirstRow() {
			$timeout(function () {
				element.find('table tbody tr').first().children('td').first().trigger('click');
			});
		}

		function unSelectCheckAllCheckbox() {
			element.find('div.ja-header-fix #tableSelectAllRow').prop('checked', false);
		}

		function unCheckAllCheckbox() {
			element.find('table tbody tr input').each(function () {
				angular.element(this).prop('checked', false);
			});
		}

		function checkSelectedRows() {
			if (Array.isArray(controller.selectableModel)) {
				let tempArr = [];
				controller.objToShowInTableBody.forEach((oBody, index) => {
					if (!!controller.selectableModel.find(oSel => oBody._id === oSel._id)) {
						element.find(`table tbody tr:nth-child(${index + 1})`).children('td').first().trigger('click');
						tempArr.push(oBody);
					}
				});
				controller.selectableModel = tempArr;
			}
		}
		function highlightRow(selectable) {

			controller.objToShowInTableBody.forEach((oBody, index) => {
				if (oBody.eWayBillExpiry) {
					angular.element(element.find('table tbody tr')[index]).css({
						'background': '#FE7F74'
					})

				}else if(oBody.dieselAdv ){
					angular.element(element.find('table tbody tr')[index]).css({
						'background': '#7FFFD4'
					})
				}else if(oBody.oEwayBillExpiryToday){
					angular.element(element.find('table tbody tr')[index]).css({
						'background': '#A9A9A9'
					})
				}else if(angular.element(element.find('table tbody tr')[index]).css('background').substr(0, 18) === "rgb(254, 127, 116)"){
					angular.element(element.find('table tbody tr')[index]).css({
						'background': '0, 0, 0, 0'
					})
				}
			});
			if(selectable != "multiple")
				selectFirstRow();
		}
	}

	return {
		link: link,
		restrict: 'A',
		scope: {
			'allEvent': '&tableAllEvent',
			'api': '=?tableApi',
			'colouredRow': '<tableColouredRow',
			'columnSetting': '=tableColumnSetting',
			'dataLoading': '&tableLoad',
			'orderByEvent': '&tableOrderByEvent',
			'orderByModel': '=tableOrderByModel',
			'objToShowInTableBody': '<tableBody',
			'objToShowInTableHeader': '=tableHead',
			'pointer': '<tableRowPointer',
			'rowClickEvent': '&tableRowClickEvent',
			'rowDblClickEvent': '&tableRowDblClickEvent',
			'rowSelectionEvent': '&tableRowSelectionEvent',
			'selectable': '=?tableSelectable',
			'selectPreserve': '=?tableSelectPreserve',
			'selectableModel': '=?tableSelectableModel',
			'showIndex': '<tableIndex',
			'tableHeight': '@tableHeight',
			'uIndex': "=?tableUid"
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'component/tableComponent/table.html',
		controller: function ($scope, $parse, $sce) {
			var vm = this;

			sharedResource.shareThisResourceWith($scope);

			vm.clearSelection = clearSelection;
			vm.columnHeaderClasses = columnHeaderClasses;
			vm.columnHeaderEvent = columnHeaderEvent;
			vm.columnSettingPopup = columnSettingPopup;
			vm.refreshTable = refreshTable;
			vm.rowBodyClasses = rowBodyClasses;
			vm.selectThisRow = selectThisRow;
			vm.dblClicked = dblClicked;

			function buildingTableData() {

				let visibleHeader = vm.objToShowInTableHeader;
				vm.columnSetting = jaTableService.validateColumnSetting(vm.columnSetting);
				let orderdVisible = [];
				vm.columnSetting.allowedColumn.forEach(item => {
					if(vm.columnSetting.visibleColumn.includes(item)) {
						orderdVisible.push(item);
					}
				});
				if(orderdVisible.length)
				vm.columnSetting.visibleColumn = orderdVisible;
				if (vm.columnSetting.isTrue) {
					visibleHeader = vm.columnSetting.visibleColumn.map(headerName => {
						let index = vm.objToShowInTableHeader.findIndex(obj => obj.header === headerName && obj.visible);
						return vm.objToShowInTableHeader[index];

					});
				} else {
					visibleHeader = vm.columnSetting.visibleColumn.map(headerName => {
						let index = vm.objToShowInTableHeader.findIndex(obj => obj.header === headerName);
						return vm.objToShowInTableHeader[index];

					});
				}

				vm.body = vm.objToShowInTableBody.map((oBody, index) => {
					let arr = [];

					vm.head = visibleHeader.filter(x => Boolean(x)).map(oHead => {

						// building body
						if (typeof oHead.eval === 'boolean' && oHead.eval) {

							let value = $scope.$eval(oHead.bindingKeys.replace(/this/g, `vm.objToShowInTableBody[${index}]`));
							arr.push(value);

						} else if (typeof oHead.bindingKeys === 'undefined') {
							if (typeof oHead.filter !== 'undefined') {
								let aParam = oHead.filter.aParam.map(param => {
									try {
										if (typeof param === 'string') // parse only string
											return $parse(param)(oBody); // if "param" is not an angular expression the it throw an syntax error
									} catch (e) {
										console.log('ja-Table Directive err => ', e);
									}
									return param;
								});
								let value = $filter(oHead.filter.name).apply(null, aParam);
								if (isFloat(value))
									value = value.toFixed(2);
								else if (Number.isNaN(value))
									value = 0;
								if (typeof value === 'boolean') // Convert boolean to sting boolean
									value = value.toString();
								arr.push(value);
							}
						} else if (typeof oHead.bindingKeys !== 'undefined') {
							let value = $parse(oHead.bindingKeys)(oBody);
							if (isFloat(value))
								value = value.toFixed(2);
							else if (Number.isNaN(value))
								value = 0;
							else if ((typeof value === 'string' || (typeof value === 'object' && value instanceof Date)) && (typeof oHead.date === 'undefined' ? true : oHead.date) && isDate(value))
								value = $filter('date')(value, typeof oHead.date === 'string' ? oHead.date : "dd-MMM-yyyy 'at' h:mma",'+0530');
							arr.push(value);
						} else
							arr.push(undefined);

						if (oHead.html) {
							arr.push({
								oHtml: arr.pop()
							});
						}

						// building head
						let tempHead = {};
						tempHead.name = oHead.header;
						tempHead.key = oHead.bindingKeys;
						if (vm.orderByModel && typeof tempHead.key !== 'undefined' && Object.keys(vm.orderByModel)[0] === tempHead.key)
							tempHead.orderBy = vm.orderByModel[tempHead.key] !== -1 ? 1 : -1;
						else if (oHead.sortable)
							tempHead.orderBy = oHead.sortable === 'active' ? 1 : 0;

						return tempHead;
					});

					if (vm.head.length > 0 && arr.length) {

						if (vm.showIndex && vm.selectable !== 'index') {
							vm.head.unshift({
								name: 'S.No'
							});
							arr.unshift(index + 1);
						}

						if (vm.selectable === 'index') {
							vm.head.unshift({
								name: 'S.No'
							});
							arr.unshift(index + 1);
						} else if (vm.selectable === 'single') {
							vm.head.unshift({
								name: '#'
							});
							arr.unshift({
								html: $sce.trustAsHtml(getSelectableType(vm.selectable))
							});
						} else if (vm.selectable === 'multiple') {
							let bool = vm.selectableModel;
							vm.head.unshift({
								name: $sce.trustAsHtml(`<input type=checkbox id="tableSelectAllRow" value="${bool}">`),
								html: true
							});
							arr.unshift({
								html: $sce.trustAsHtml(getSelectableType(vm.selectable))
							});
						}
					}

					return arr;
				});

				$timeout(function () {

					vm.unCheckAllCheckbox();

					vm.checkSelectedRows();

					if (vm.selectable === "true" || vm.selectable === 'index' || vm.selectable === 'single')
						typeof vm.selectFirstRow === 'function' && vm.selectFirstRow();

					vm.cloneHeadFn();

					if (vm.selectAllRow)
						vm.selectAllRow();

					// vm.highlightRow(vm.selectable);

					if (vm.colouredRow)
						vm.applyColorOnRow();
				}, 0);
			}

			function columnHeaderClasses(index, head) {
				let classes = typeof head.orderBy !== "undefined" ? 'pointer' : '';
				return classes;
			}

			function columnHeaderEvent(index, head) {
				if (typeof head.orderBy === "undefined")
					return;

				let orderBy = head.orderBy;
				resetOrderBy();
				head.orderBy = orderBy === 1 ? -1 : 1; //( 1 => ascending & -1 => descending ) change value of orderBy

				vm.orderByModel = {};
				vm.orderByModel[head.key] = head.orderBy;

				triggerEvent(['anyEvent', 'orderByEvent']);

				$timeout(function () {
					vm.scrollToTop && vm.scrollToTop();
				});
			}

			function columnSettingPopup() {
				var modalInstance = $modal.open({
					templateUrl: 'component/tableComponent/columnSettingPopup.html',
					controller: ['$timeout', '$uibModalInstance', 'columnSetting', 'jaTableService', columnSettingPopupController],
					controllerAs: 'vm',
					resolve: {
						'columnSetting': function () {
							return vm.columnSetting;
						}
					}
				});

				modalInstance.result.then(function (response) {
					vm.columnSetting = response;
					typeof vm.columnSetting.visibleCb === 'function' && vm.columnSetting.visibleCb(response);
					buildingTableData();
					console.log('close', response);
				}, function (data) {
					console.log('cancel', data);
				});
			}

			function dblClicked() {
				triggerEvent('rowDblClickEvent');
			}

			function getHeaderKey(index, name) {
				if (typeof index === "number" && !Number.isNaN(index))
					return vm.objToShowInTableHeader[index] || {};
				else if (typeof name === 'string')
					return vm.objToShowInTableHeader.find(obj => obj.header === name);
				else
					return null;
			}

			function getSelectableType(typeName) {
				if (typeof typeName === 'undefined')
					return null;
				switch (typeName) {
					case true:
						return 'selectable';
						break;
					case 'single':
						return '<input type=radio name="singleSelect">';
						break;
					case 'multiple':
						return '<input type=checkbox>';
						break;
					default:
						throw 'JA Table-directive: Table Error: Invalid Selectable type';
				}
			}

			function isDate(date) {
				date = new Date(date);
				return date instanceof Date && !Number.isNaN(date.valueOf())
			}

			function isFloat(n) {
				return Number(n) === n && n % 1 !== 0;
			}

			function rowBodyClasses() {
				return vm.selectable ? 'pointer' : '';
			}

			function isSortable(index) {
				return getHeaderKey(index).sortable === true;
			}

			function parseHeaderKey(index, name) {
				// index(type = number) of the "objToShowInTableBody" and head(type = string) of objToShowInTableHeader[any].header
				return $parse(getHeaderKey(null, name).bindingKeys)(vm.objToShowInTableBody[index]);
			}

			function refreshTable() {
				$timeout(function () {
					buildingTableData();
				});
			}

			function clearSelection() {
				vm.selectableModel = null;
			}

			function resetOrderBy() {
				vm.head.map(head => typeof head.orderBy !== 'undefined' && (head.orderBy = 0));
			}

			function selectThisRow(index, rowArr, event) {

				if (typeof vm.selectable === 'undefined')
					return null;

				let currentElement = angular.element(event.target),
					elementRow = currentElement.parents('tr');

				if (vm.selectable === "true" || vm.selectable === 'index') {
					vm.selectableModel = vm.objToShowInTableBody[index];
					markThisRow();
				} else if (vm.selectable === 'single') {
					if (elementRow.find('input').prop('checked') === true) {
						elementRow.find('input').prop('checked', false);
						vm.selectableModel = {};
					} else {
						elementRow.find('input').prop('checked', true);
						vm.selectableModel = vm.objToShowInTableBody[index];
					}
					removeRowMark();
				} else if (vm.selectable === 'multiple') {
					let uKey = vm.uIndex || '_id';
					vm.selectableModel = vm.selectableModel || [];
					if (!Array.isArray(vm.selectableModel))
						vm.selectableModel = [];
					if (elementRow.find('input').prop('checked') === true) {
						vm.selectableModel = vm.selectableModel.filter(obj => obj[uKey] !== vm.objToShowInTableBody[index][uKey]);
						elementRow.find('input').prop('checked', false);
						vm.unSelectCheckAllCheckbox();
					} else {
						let isExist = !!vm.selectableModel.find(o => o[uKey] === vm.objToShowInTableBody[index][uKey]);
						if (!isExist)
							vm.selectableModel.push(vm.objToShowInTableBody[index]);
						elementRow.find('input').prop('checked', true);
						vm.selectCheckAllCheckbox();
					}
					removeRowMark();
				} else
					throw 'JA Table-directive:Table Error: Invalid Selectable Type';

				function markThisRow() {
					currentElement.parents('tbody').children('tr').removeClass('selected');
					elementRow.addClass('selected');
					triggerEvent('rowClickEvent');
				}

				function removeRowMark() {
					currentElement.parents('tbody').children('tr').removeClass('selected');
					triggerEvent('rowClickEvent');
				}
			}

			function triggerEvent(type) {

				if (typeof type === 'string')
					triggerIt(type);
				else if (Array.isArray(type))
					type.map(name => triggerIt(name));
				else
					throw 'JA Table-directive: Table Error: Invalid Trigger Event type';

				function triggerIt(type) {
					$timeout(function () { // to call after the digest cycle has ran
						switch (type) {
							case 'anyEvent' :
								if (typeof vm.allEvent === 'function') // it is triggered for any type of event
									vm.allEvent();
								break;
							case 'orderByEvent' :
								if (typeof vm.orderByEvent === 'function') // it is triggered for Order By event only
									vm.orderByEvent();
								break;
							case 'rowClickEvent' :
								if (typeof vm.rowClickEvent === 'function') // it is triggered whenever user Click on a row
									vm.rowClickEvent();
								break;
							case 'rowDblClickEvent' :
								if (typeof vm.rowDblClickEvent === 'function') // it is triggered whenever user Click on a row
									vm.rowDblClickEvent();
								break;
							case 'rowSelectionEvent' :
								if (typeof vm.rowSelectionEvent === 'function') // it is triggered whenever user Click on a row
									vm.rowSelectionEvent();
								break;
							default:
								console.warn('Event matched to none, so no event triggered');
								return
						}
					}, 0);
				}
			}

			(function watchAnyChangesOnTableHeadOrBodyObject() {
				$scope.$watch('vm.objToShowInTableBody.length', function (newVal) {
					if (newVal >= 0)
						buildingTableData();
				});
			})();

		}
	};
}

function sumOfNumber() {
	return function (a, b) {
		if (!a && !b)
			return 0;
		else
			return a + b + 0.88888;
	}
}
