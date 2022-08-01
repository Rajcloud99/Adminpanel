materialAdmin.controller('grMasterController', function ($rootScope, $scope, $modal, branchService, tripServices) {
	//****** get branc start ***//
	$scope.getAllBranch = function () {
		function succGetBranches(res) {
			if (res.status === 'OK') {
				$rootScope.aBranches = res.data;
			} else {
				alert('Errrrr.......');
			}
		}

		function failGetBranches(res) {
			alert('res');
		}

		branchService.getAllBranches({all: true}, succGetBranches, failGetBranches);
	};
	$scope.getAllBranch();
	//**** get branch end ****//
});
materialAdmin.controller('allGrMasterCtrl', function ($rootScope, $scope, $uibModal, $modal, $state, branchService, tripServices, Pagination) {
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	$scope.pageChanged = function () {
		$scope.getAllMasterGr(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if ($scope.grNum) {
			myFilter.gr_no = $scope.grNum;
		}
		if ($scope.book_year) {
			myFilter.book_year = $scope.book_year;
		}
		if ($scope.branch_name) {
			myFilter.branch_name = $scope.branch_name;
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		myFilter.isCentralized = false;
		return myFilter;
	}

	$scope.getAllMasterGr = function (isPagination) {
		function allMasterGrSuccess(res) {
			if (res.data.status == 'OK') {
				$scope.aAllGrMasterList = res.data.data;
				$scope.total_pages = res.data.no_of_pages;
				$scope.totalItems = 10 * res.data.no_of_pages;
			} else {
				alert('No Data !!!!!');
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		tripServices.getAllMasterGRService(oFilter, allMasterGrSuccess);
	};
	$scope.getAllMasterGr();

	$scope.editGrM = function (sGR) {
		$rootScope.selectedGR = sGR;
		$state.go('masters.updateGrMaster');
	};
});

materialAdmin.controller('cancelGrMasterCtrl', function ($rootScope, $scope, $uibModal, tripServices, Pagination) {
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	$scope.pageChanged = function () {
		$scope.getUsedMasterGr(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if ($scope.grNum) {
			myFilter.gr_no = $scope.grNum;
		}
		if ($scope.bNumber) {
			myFilter.booking_no = $scope.bNumber;
		}
		if ($scope.tNumber) {
			myFilter.trip_no = $scope.tNumber;
		}
		if ($scope.branch_name) {
			myFilter.branch_name = $scope.branch_name;
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}

		myFilter.gr_Status = 'Cancelled';

		return myFilter;
	}

	$rootScope.getCancelMasterGr = function (isPagination) {

		function allCancelMasterGrSuccess(res) {
			if (res.data.status == 'OK') {
				$scope.aCancelGrMasterList = res.data.data;
				$scope.selectedGR = $scope.aCancelGrMasterList[0];
				$scope.total_pages = res.data.no_of_pages;
				$scope.totalItems = 10 * res.data.no_of_pages;
				setTimeout(function () {
					listItem = $($('.selectItem')[0]);
					listItem.addClass('grn22');
				}, 200);
			} else {
				alert('No Data !!!!!');
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		tripServices.getUsedMasterGRService(oFilter, allCancelMasterGrSuccess);
	};
	$rootScope.getCancelMasterGr();

	$scope.select = function (dt, i) {
		$scope.selectedGR = dt;
		setTimeout(function () {
			$('.selectItem').removeClass('grn22');
			listItem = $($('.selectItem')[i]);
			listItem.addClass('grn22');
		}, 200);
	};

	$scope.freeGR = function () {
		if ($scope.selectedGR) {
			$rootScope.selGR = $scope.selectedGR;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/grMaster/cancelGRPopUp.html',
				controller: 'cancelGRPopUpCtrl'
			});
		}
	};
});

materialAdmin.controller('cancelGRPopUpCtrl', function ($rootScope, $scope, growlService, $uibModalInstance, tripServices) {
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.toggleMin = function () {
		$scope.maxDate = new Date();
		var aloc_date = $scope.maxDate; // - 1000 * 60 * 60 * 24 * 2
		$scope.minDate = new Date(aloc_date);
	};
	$scope.toggleMin();
	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	//************* New Date Picker for multiple date selection in single form ******************

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.aReason = ['Vehicle is not availabel.', 'Driver is not availabel.', 'Price not match', 'Wrong GR no. updated', 'Other'];

	if ($rootScope.selGR) {
		$scope.selGR = $rootScope.selGR;
	} else {
		var bUrl = '#!/masters/grMaster/canceledGr';
		$rootScope.redirect(bUrl);
	}

	$scope.cancelClick = function () {

		function success(res) {
			if (res && res.data && (res.data.status == 'OK')) {
				var msg = res.data.message;
				swal('success', msg, 'success');
				$uibModalInstance.close(res);
				$rootScope.getCancelMasterGr();

			} else {
				var msg = res.data.message;
				swal('Error', msg, 'error');
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			var msg = res.data.message;
			$uibModalInstance.dismiss(res);
			growlService.growl(msg, 'danger', 2);
		}

		if ($scope.selGR._id) {
			oUpdate = {};
			oUpdate._id = $scope.selGR._id;
			oUpdate.reason = $scope.reason;
			oUpdate.remark = $scope.remark;

			tripServices.cancelGRservice(oUpdate, success, failure);
		} else {
			swal('warning', 'Please select GR first!', 'warning');
			$uibModalInstance.close(res);
		}
	};

});

materialAdmin.controller('usedGrMasterCtrl', function ($rootScope, $scope, $modal, $uibModal, tripServices, Pagination) {
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	$scope.pageChanged = function () {
		$scope.getUsedMasterGr(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if ($scope.grNum) {
			myFilter.gr_no = $scope.grNum;
		}
		if ($scope.bNumber) {
			myFilter.booking_no = $scope.bNumber;
		}
		if ($scope.tNumber) {
			myFilter.trip_no = $scope.tNumber;
		}
		if ($scope.branch_name) {
			myFilter.branch_name = $scope.branch_name;
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}

		myFilter.gr_Status = 'Used';

		return myFilter;
	};
	$scope.getUsedMasterGr = function (isPagination) {

		function allUsedMasterGrSuccess(res) {
			if (res.data.status == 'OK') {
				$scope.aUsedGrMasterList = res.data.data;
				$scope.total_pages = res.data.no_of_pages;
				$scope.totalItems = 10 * res.data.no_of_pages;
			} else {
				alert('No Data !!!!!');
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		tripServices.getUsedMasterGRService(oFilter, allUsedMasterGrSuccess);
	};
	$scope.getUsedMasterGr();
});
materialAdmin.controller('addGrMasterCtrl', function ($rootScope, $scope, $modal, $state, $localStorage, branchService, tripServices) {
	$scope.oGrMaster = {'isCentralized': false};
	//****** get branc start ***//
	$scope.getAllBranch = function () {
		function succGetBranches(res) {
			if (res.status == 'OK') {
				$scope.aBranches = res.data;
			} else {
				alert('Errrrr.......');
			}
		}

		function failGetBranches(res) {
			alert('res');
		}

		branchService.getAllBranches({all: true}, succGetBranches, failGetBranches);
	};
	$scope.getAllBranch();
	//**** get branch end ****//
	// *** save gr start *****//
	$scope.saveGrMaster = function (grData) {
		$scope.oGrMaster.created_by = $localStorage.ft_data.userLoggedIn._id;
		if ($scope.oGrMaster.isCentralized) {
			if ($scope.oGrMaster.grCode && $scope.oGrMaster.grSeries && $scope.oGrMaster.book_no && $scope.oGrMaster.book_year) {
				delete $scope.oGrMaster.gr_no_end;
				delete $scope.oGrMaster.gr_no_start;
				tripServices.addGrMaster($scope.oGrMaster, succGrM);
			} else {
				swal('warning', 'Please fill all required fields.', 'warning');
			}
		} else {
			if ($scope.oGrMaster.gr_no_start && $scope.oGrMaster.gr_no_end && $scope.oGrMaster.book_no && $scope.oGrMaster.book_year) {
				delete $scope.oGrMaster.grCode;
				delete $scope.oGrMaster.grSeries;
				$scope.oGrMaster.branch_name = $scope.oGrMaster.temp_data.name;
				$scope.oGrMaster.branch_code = $scope.oGrMaster.temp_data.code;
				$scope.oGrMaster.branch = $scope.oGrMaster.temp_data._id;
				tripServices.addGrMaster($scope.oGrMaster, succGrM);
			} else {
				swal('warning', 'Please fill all required fields.', 'warning');
			}
		}

		function succGrM(res) {
			if (res.data.status == 'OK') {
				var msg = res.data.message;
				swal('Save', msg, 'success');
				$state.go('masters.grMaster');
			} else {
				alert('Errrr......');
			}
		}

	};
	// *** save gr end *****//
});
materialAdmin.controller('updateGrMasterCtrl', function ($rootScope, $scope, $modal, $state, $localStorage, branchService, tripServices) {
	$scope.oGrMaster = {};
	$scope.oGrMaster = $rootScope.selectedGR;
	//****** get branc start ***//
	$scope.getAllBranch = function () {
		function succGetBranches(res) {
			if (res.status == 'OK') {
				$scope.aBranches = res.data;
				if ($scope.aBranches.length > 0) {
					for (var i = 0; i < $scope.aBranches.length; i++) {
						if ($scope.aBranches[i].name == $scope.oGrMaster.branch_name) {
							$scope.oGrMaster.temp_data = $scope.aBranches[i];
						}
					}
				}
			} else {
				alert('Errrrr.......');
			}
		};

		function failGetBranches(res) {
			alert('res');
		}

		branchService.getBranches({all: true}, succGetBranches, failGetBranches);
	};
	$scope.getAllBranch();
	//**** get branch end ****//

	// *** save gr start *****//
	$scope.updateGrMaster = function (grData) {
		function succGrMupdate(res) {
			if (res.data.status == 'OK') {
				var msg = res.data.message;
				swal('Update', msg, 'success');
				$state.go('masters.grMaster');
			} else {
				alert('Errrr......');
			}
		};
		$scope.oGrMaster._id = $scope.oGrMaster._id;
		if ($scope.oGrMaster.isCentralized) {
			delete $scope.oGrMaster.gr_no_end;
			delete $scope.oGrMaster.gr_no_start;
		} else {
			delete $scope.oGrMaster.grCode;
			delete $scope.oGrMaster.grSeries;
			$scope.oGrMaster.branch_name = $scope.oGrMaster.temp_data.name;
			$scope.oGrMaster.branch_code = $scope.oGrMaster.temp_data.code;
		}
		tripServices.updateGrMasterS($scope.oGrMaster, succGrMupdate);
	};
	// *** save gr end *****//
});

materialAdmin.controller('carouselCtrl', function ($scope, documents) {
	$scope.index = 0;
	$scope.images = documents;
	$scope.updateTsPrevious = function () {
		$scope.tsPrevious = +new Date();
	};
	$scope.updateTsNext = function () {
		$scope.tsNext = +new Date();
	};
});

materialAdmin.directive('wallopSlider', function () {
	return {
		restrict: 'EA',
		transclude: true,
		replace: false,
		scope: {
			images: '=',
			animation: '@',
			currentItemIndex: '=',
			onNext: '&',
			onPrevious: '&'
		},
		template: `
<div class="wallop-slider {{animationClass}}">
	<ul class="wallop-slider__list">
		<li class="wallop-slider__item {{itemClasses[$index]}}" ng-repeat="i in images">
			<div style="background-color:white;font-size:x-large;font-weight:bolder;text-align:center;">{{i.name}}</div>
			<img src="{{i.url}}" alt="Click download to view PDF file" style="object-fit:contain;font-size:large;" />
		</li>
	</ul>
	<button ng-show="images.length>1" style="padding-left:10px;" class="st-button wallop-slider__btn wallop-slider__btn--previous btn btn--previous" ng-disabled="prevDisabled" ng-click="onPrevButtonClicked()">
		Previous
	</button>
	<button ng-show="images.length>1" class="st-button wallop-slider__btn wallop-slider__btn--next btn btn--next" ng-disabled="nextDisabled" ng-click="onNextButtonClicked()">
		Next
	</button>
	<button class="btn" ng-click="onDownloadButtonClicked()">
		Download
	</button>
	<button class="btn" ng-click="printDoc(images[currentItemIndex].url)">
		Print
	</button>
	<button class="btn" ng-click="deleteDoc(images[currentItemIndex])">
		Delete
	</button>
</div>`,
		controller: function ($window, $scope, $timeout, Vehicle, dmsService) {

			_updatePagination();
			$scope.itemClasses = [];

			$scope.$watch('images', function (images) {
				if (images.length) {
					_goTo(0);
				}
			});

			$scope.$watch('itemClasses', function (itemClasses) {
				console.log('itemClasses', itemClasses);
			});

			// set animation class corresponding to animation defined in CSS. e.g. rotate, slide
			if ($scope.animation) {
				$scope.animationClass = 'wallop-slider--' + $scope.animation;
			}

			var _displayOptions = {
				btnPreviousClass: 'wallop-slider__btn--previous',
				btnNextClass: 'wallop-slider__btn--next',
				itemClass: 'wallop-slider__item',
				currentItemClass: 'wallop-slider__item--current',
				showPreviousClass: 'wallop-slider__item--show-previous',
				showNextClass: 'wallop-slider__item--show-next',
				hidePreviousClass: 'wallop-slider__item--hide-previous',
				hideNextClass: 'wallop-slider__item--hide-next'
			};

			function updateClasses() {
				if ($scope.itemClasses.length !== $scope.images.length) {
					$scope.itemClasses = [];
					for (var i = 0; i < $scope.images.length; i++) {
						$scope.itemClasses.push('');
					}
				}
			}

			function _nextDisabled() {
				console.log('$scope.currentItemIndex', $scope.currentItemIndex, $scope.images.length);

				return ($scope.currentItemIndex + 1) === $scope.images.length;
			}

			function _prevDisabled() {
				return !$scope.currentItemIndex;
			}

			function _updatePagination() {
				$scope.nextDisabled = _nextDisabled();
				$scope.prevDisabled = _prevDisabled();
			}

			function _clearClasses() {
				for (var i = 0; i < $scope.images.length; i++) {
					$scope.itemClasses[i] = '';
				}

			}

			// go to slide
			function _goTo(index) {
				if (index >= $scope.images.length || index < 0 || index === $scope.currentItemIndex) {
					if (!index) {
						$scope.itemClasses[0] = _displayOptions.currentItemClass;
					}
					return;
				}

				_clearClasses();

				$scope.itemClasses[$scope.currentItemIndex] = (index > $scope.currentItemIndex) ? _displayOptions.hidePreviousClass : _displayOptions.hideNextClass;

				var currentClass = (index > $scope.currentItemIndex) ? _displayOptions.showNextClass : _displayOptions.showPreviousClass;
				$scope.itemClasses[index] = _displayOptions.currentItemClass + ' ' + currentClass;

				$scope.currentItemIndex = index;

				_updatePagination();

			}

			// button event handlers
			// consider using the ng-tap directive to remove delay
			$scope.onPrevButtonClicked = function () {
				_goTo($scope.currentItemIndex - 1);
			};
			$scope.onNextButtonClicked = function () {
				_goTo($scope.currentItemIndex + 1);
			};
			$scope.onDownloadButtonClicked = function () {
				var $a = document.createElement('a');
				$a.setAttribute("type", "hidden");
				$a.setAttribute("title", $scope.images[$scope.currentItemIndex].name);
				$a.setAttribute('href', $scope.images[$scope.currentItemIndex].url);
				$a.setAttribute('target', '_blank');
				document.body.appendChild($a);
				$a.click();
				document.body.removeChild($a);
			};

			$scope.deleteDoc = function(images){
              if(images){
				  let req = {
					  _id: images._id,
					  modelName: images.modelName,
					  name: images.docName
				  };
				  dmsService.deleteFile( req,success,failure);

				  function success(res) {
					  if (res) {
						  var msg = res.message;
						  swal('', msg, "success");
						  return;
					  }
				  }

				  function failure(res) {
					  var msg = res.message;
					  swal('', msg, "error");
					  return;
				  }
			  }
			}

			$scope.printDoc = function (source) {
				Pagelink = "about:blank";
				var pwa = window.open(Pagelink, "_new");
				pwa.document.open();
				pwa.document.write($scope.DocPrint(source));
				pwa.document.close();
			};
			$scope.DocPrint = function (source) {
				return "<html><head><script>function step1(){\n" +
					"setTimeout('step2()', 10);}\n" +
					"function step2(){window.print();window.close()}\n" +
					"</scri" + "pt></head><body onload='step1()'>\n" +
					"<img src='" + source + "' /></body></html>";
			};

			$scope.$watch('currentItemIndex', function (newVal, oldVal) {
				if (oldVal > newVal) {
					if (typeof $scope.onPrevious === 'function') {
						$scope.onPrevious();
					}
				} else {
					if (typeof $scope.onNext === 'function') {
						$scope.onNext();
					}
				}
			});

		}
	};
});

materialAdmin.filter('getInvoiceNo', function () {
	return function (input) {
		if (!input)
			return false;
		return input.map(obj => obj.invoiceNo).join(' ,');

	};
});

materialAdmin.controller('myGRController', function (
	$stateParams,
	$scope,
	$uibModal,
	$state,
	$filter,
	billingPartyService,
	customer,
	DatePicker,
	branchService,
	consignorConsigneeService,
	DateUtils,
	lazyLoadFactory,
	Pagination,
	stateDataRetain,
	tripServices,
	userService,
	tableAccessDetailFactory,
	Vehicle,
	Vendor,
	URL,
	dmsService,
	growlService,
	xlsxWrapper) {

	$scope.getAllGR = getAllGR;
	$scope.getAllFPA = getAllFPA;
	$scope.uploadGR = uploadGR;
	$scope.printTDS = printTDS;
	$scope.uploadDocs = uploadDocs;
	$scope.previewBuilty = previewBuilty;
	$scope.grReceive = grReceive;
	$scope.showHistory = showHistory;
	$scope.addRemark = addRemark;
	$scope.getCustomer = getCustomer;
	$scope.getVehicles = getVehicles;
	$scope.getVendors = getVendors;
	$scope.getBilling = getBilling;
	$scope.getAllBranch = getAllBranch;
	$scope.selectRow = selectRow;
	$scope.printBuilty = printBuilty;
	$scope.cancelGR = cancelGR;
	$scope.genMultiGr = genMultiGr;
	$scope.revertMultiGr = revertMultiGr;
	$scope.previewTransportSlip = previewTransportSlip;
	$scope.previewTDS = previewTDS;
	$scope.grOpperation = grOpperation;
	$scope.mrOpperation = mrOpperation;
	$scope.grStatusUpdate = grStatusUpdate;
	$scope.downloadGRReport = downloadGRReport;
	$scope.dailyMISreport = dailyMISreport;
	$scope.downloadPODReport = downloadPODReport;
	$scope.downloadGRReportCron = downloadGRReportCron; // Added by Harikesh dated: 23-10-2019
	// $scope.downloadGRReportMMT = downloadGRReportMMT;
	$scope.downloadMRReport = downloadMRReport;
	$scope.getConsignor = getConsignor;
	$scope.getConsignee = getConsignee;
	$scope.genFPABill = genFPABill;
	$scope.addMultipleGr = addMultipleGr;
	$scope.isNonBillable = isNonBillable;
	$scope.moveGr = moveGr;
	$scope.unMapGrFromTrip = unMapGrFromTrip;
	$scope.onFromDateChange = onFromDateChange;

	// this function trigger on state refresh
	$scope.onStateRefresh = function () {
		$scope.getAllGR();
	};


	// init
	(function init() {

		if (stateDataRetain.init($scope))
			return;

		$scope.tableAccessDetail = tableAccessDetailFactory;

		let pageNameConst = 'Booking_Management_GR';
		let tableNameConst = 'GR';
		$scope.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
		$scope.aGrStatus = ['Gr Generated', 'Gr Not Generated'];
		if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
			Array.prototype.push.apply($scope.aCategory, $scope.$configs.customer.category);
		}

		let oFoundTable = $scope.$tableAccess.find(oTable => (oTable.clientId !== '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst));
		let oFoundTables = $scope.$tableAccess.find(oTable => (oTable.clientId === '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst));// given acess to super admin
		if(oFoundTable && oFoundTables) {
			oFoundTable.configs = oFoundTables.configs;
			let orderedAccess = [];
			oFoundTables.access.forEach( (item) => {
				if(oFoundTable.access.includes(item)) {
					orderedAccess.push(item);
				}
			});
			oFoundTable.access = orderedAccess;
		}
		oFoundTable = oFoundTable ? oFoundTable : oFoundTables;
		let visible = oFoundTable ? oFoundTable.visible : $scope.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let access = oFoundTable ? oFoundTable.access : $scope.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let oBinding = $scope.tableAccessDetail[pageNameConst][tableNameConst];

		// only client have these access
		if(true) {
			for (const prop in oBinding) {
				if(oFoundTable && oFoundTable.configs)
				oBinding[prop].header = oFoundTable.configs[tableNameConst][prop];
			}
			// oBinding.forEach(item => item.order = access.indexOf(item.header));
			// oBinding.sort((a,b) => {
			// 	return a.order - b.order;
			// });
		}

		$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		$scope.visibleDownload = visible.map(str => oBinding[str].header);
		$scope.oFoundTableId = false;
		if (oFoundTable && oFoundTable._id)
			$scope.oFoundTableId = oFoundTable._id;

		$scope.columnSetting = {
			allowedColumn: [],
			visibleColumn: visible.map(str => oBinding[str].header),
			visibleCb: (columnSetting) => {

				if (!(oFoundTable && oFoundTable._id))
					return;

				let currentSetting = columnSetting.visibleColumn;
				let mapTable = $scope.tableAccessDetail[pageNameConst][tableNameConst + 'Column'].reduce((obj, str) => {
					obj[oBinding[str].header] = str;
					return obj;
				}, {});

				let request = {
					pages: pageNameConst,
					table: tableNameConst,
					access: columnSetting.allowedColumn.map(str => mapTable[str]),
					visible: currentSetting.map(str => mapTable[str]),
					_id: oFoundTable._id
				};

				userService.updateOneTableConfig(request, successVis, failureVis);

				function successVis(data) {
					if (data.data && data.data) {
						let d = data.data;
						$scope.$tableAccess.splice(0, $scope.$tableAccess.length);
						for (let i of d) {
							$scope.$tableAccess.push(i);
						}
					}
				}

				function failureVis(res) {
					swal("Error in table column setting", "", "error");
				}
			}
		};
		$scope.tableHead = [];

		access.forEach(str => {
			$scope.columnSetting.allowedColumn.push(oBinding[str].header);
			$scope.tableHead.push(oBinding[str]);
		});

		$scope.oFilter = {};
		$scope.grPagination = angular.copy(Pagination);
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.lazyLoad = lazyLoadFactory(); // init lazyload
		$scope.selectedTrip = [];
		$scope.selectType = 'index';
		$scope.grPagination.maxSize = 5;
		$scope.grPagination.items_per_page = 5;
		$scope.aType = ["Shipment No", "Invoice No", "LoadRef No"];
		$scope.aBill = ["Billed", "Un billed", "Non Billable", "All"];
		$scope.aPod = ["Received", "Not Received", "All"];
		$scope.aAcknowledged = ["Acknowledged", "Not Acknowledged", "All"];
		// getAllGR(true);
		getAllVehicleGroup();

	})();

	// Actual Function

	function onFromDateChange() {
		if($scope.oFilter.to && $scope.oFilter.from > $scope.oFilter.to)
			$scope.oFilter.to = Math.min($scope.oFilter.from, new Date());
	}

	function prepareFilterObject(isPagination) {
		var myFilter = {populate: ['provisionalBill'], source: 'GR', dateType: "grDate", gr_type : {$nin: ["Trip Memo", "Cross Docking"]}};

		if ($scope.oFilter.isGr === 'Gr Generated')
			myFilter.grNumber = {$exists: true };
		else if($scope.oFilter.isGr === 'Gr Not Generated')
			myFilter.grNumber = {$exists: false };

		if ($scope.oFilter.grNumber) {
			myFilter.grNumber = $scope.oFilter.grNumber;
		}

		if ($scope.oFilter.grDocType) {
			myFilter.grDocType = $scope.oFilter.grDocType;
		}

		if ($scope.oFilter.bill_no) {
			myFilter.bill_query = myFilter.bill_query || {};
			myFilter.bill_query.billNo = $scope.oFilter.bill_no;
		}
		if ($scope.oFilter.dateType) {
			myFilter.dateType = $scope.oFilter.dateType;
		}
		if($scope.oFilter.deliveryStatus)
			myFilter.dateType = $scope.oFilter.deliveryStatus;

		if ($scope.oFilter.bill) {
			if ($scope.oFilter.bill == 'Billed') {
				myFilter.billedGr = true;
			} else if ($scope.oFilter.bill == 'Un billed') {
				myFilter.unBilledGr = true;
				// myFilter.bill = {$exists: false};
				// myFilter.isNonBillable = false;
				// myFilter.provisionalBill = {$exists: false};
			} else if ($scope.oFilter.bill == 'Non Billable') {
				myFilter.isNonBillable = true;
			}
		}
		if ($scope.oFilter.received == 'Not Received')
			myFilter["pod.received"] = false;
		else if ($scope.oFilter.received == 'Received')
			myFilter["pod.received"] = true;
		else if($scope.oFilter.received == 'POD Updated By')
			myFilter["pod.user"] = 'all';
		else if ($scope.oFilter.received == 'Hard Copy') {
			myFilter["pod.received"] = true;
		} else if($scope.oFilter.received == 'Soft Copy') {
			myFilter["noOfDocs"] = { $ne: 0};
		}
		if ($scope.oFilter.acknowledge == 'Acknowledged')
			myFilter["acknowledge.status"] = true;
		else if ($scope.oFilter.acknowledge == 'Not Acknowledged')
			myFilter["acknowledge.status"] = false;

		if ($scope.oFilter.status) {
			if ($scope.oFilter.status === 'Trip cancelled') {
				myFilter.isCancelled = true;
			}
			myFilter.status = $scope.oFilter.status;
		}

		if($scope.oFilter.tripStatus) { //
			myFilter.trip_query = myFilter.trip_query || {};
			myFilter.trip_query['status'] = $scope.oFilter.tripStatus;
		}

		if ($scope.oFilter.grStatus) {
			if($scope.oFilter.grStatus == 'GR Not Acknowledged'){
				myFilter['acknowledge.status'] = false;
			} else {
				myFilter.status = $scope.oFilter.grStatus;
			}
		}

		if($scope.oFilter.vendPaymStatus) { //
			myFilter.vendPaymStatus = $scope.oFilter.vendPaymStatus;
		}

		if($scope.oFilter.boe_no) {
			myFilter.boe_no = $scope.oFilter.boe_no;
		}

		if ($scope.oFilter.segment_type) {
			myFilter.trip_query = myFilter.trip_query || {};
			myFilter.trip_query.segment_type = $scope.oFilter.segment_type;
		}
		if ($scope.oFilter.Ownership) {
			myFilter.trip_query = myFilter.trip_query || {};
			myFilter.trip_query.ownershipType = $scope.oFilter.Ownership;
		}

		if ($scope.oFilter.veh_group) {
			myFilter.vehicle_query = myFilter.vehicle_query || {};
			myFilter.vehicle_query.veh_group_name = $scope.oFilter.veh_group.name;
		}

		if ($scope.oFilter.grCustomer) {
			// myFilter.booking_query = myFilter.booking_query ? myFilter.booking_query : {};
			myFilter.customer = $scope.oFilter.grCustomer._id;
		}

		if ($scope.oFilter.grConsignor) {
			myFilter.consignor = $scope.oFilter.grConsignor._id;
		}

		if ($scope.oFilter.grConsignee) {
			myFilter.consignee = $scope.oFilter.grConsignee._id;
		}

		if ($scope.oFilter.billingParty) {
			myFilter['billingParty._id'] = $scope.oFilter.billingParty._id;
		}

		if ($scope.oFilter.bPclientId) {
			myFilter['billingParty.clientId'] = $scope.oFilter.bPclientId;
		}
		if ($scope.oFilter.category) {
			myFilter['customer.category'] = $scope.oFilter.category;
		}

		if ($scope.oFilter.vehicle_no) {
			myFilter.vehicle = $scope.oFilter.vehicle_no._id;
		}

		if ($scope.oFilter.type) {
			myFilter.shipmentNo = $scope.oFilter.shipmentNo;
		} else if ($scope.oFilter.shipmentNo)
			myFilter.shipmentNo = $scope.oFilter.shipmentNo;

		if ($scope.oFilter.trip_no) {
			// myFilter.trip_query = myFilter.trip_query ? myFilter.trip_query : {};
			// myFilter.trip_query.trip_no = $scope.oFilter.trip_no;
			myFilter.trip_no = $scope.oFilter.trip_no;
		}

		if ($scope.oFilter.vendor_id) {
			myFilter.vehicle_query = myFilter.vehicle_query ? myFilter.vehicle_query : {};
			myFilter.vehicle_query.vendor_id = $scope.oFilter.vendor_id._id;
		}

		if ($scope.oFilter.route_id) {
			myFilter.route_id = $scope.oFilter.route_id._id;
		}
		if ($scope.oFilter.branch) {
			myFilter.branch = $scope.oFilter.branch._id;
		}else if ($scope.aBranch && $scope.aBranch.length) {
			myFilter.branch = [];
			$scope.aBranch.forEach(obj => {
				if(obj.read)
					myFilter.branch.push(obj._id);
			});
		}
		if ($scope.oFilter.from) {
			myFilter.from = new Date(($scope.oFilter.from).setHours(0, 0, 0));
		}
		if ($scope.oFilter.to) {
			myFilter.to = new Date(($scope.oFilter.to).setHours(23, 59, 59));
		}
		if ($scope.oFoundTableId) {
			myFilter.tableId = $scope.oFoundTableId;
		} else {
			myFilter.tableId = false;
		}

		// myFilter.sort = {grNumber: 1};
             myFilter.sort = {grDate : -1,trip_no: -1};

		if ($scope.oFilter.sortBy && $scope.oFilter.sortBy === 'Assending') {
			myFilter.sort = {'trip.start_date': 1};
		}else if ($scope.oFilter.sortBy && $scope.oFilter.sortBy === 'Dessending') {
			myFilter.sort = {'trip.start_date': -1};
		}

		myFilter.no_of_docs = 8;
		myFilter.skip = $scope.lazyLoad.getCurrentPage();

		return myFilter;
	}

	function getAllVehicleGroup() {
		Vehicle.getGroupVehicleType(successGroupVehicleType, failGroupVehicleType)

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				$scope.aVehicleGroups = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}

	function getAllGR(isGetActive) {
		$scope.selectType = 'index';

		if (!$scope.lazyLoad.update(isGetActive))
			return;

		if ($scope.oFilter.dateType) {
			if (!($scope.oFilter.from && $scope.oFilter.to)) {
				swal('warning', 'Please fill From and To Date', 'warning');
				return;
			}
		}

		if ($scope.oFilter.from && $scope.oFilter.to) {
			if($scope.oFilter.from>$scope.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}
		}

		let oFilter = prepareFilterObject();
		tripServices.getAllGRItem(oFilter, success, fail);

		function success(response) {
			if (response && response.data) {

				response = response.data;

				// response.data.data[i].sumextratds = ($filter.response.data.data[i].trip.vendorDeal.charges|sumObjKey,'tdsAmount');
				// response.data.data[i].totpayable = (response.data.data[i].trip.vendorDeal.totWithMunshiyana + response.data.data[i].trip.vendorDeal.totalCharges - response.data.data[i].trip.vendorDeal.totalDeduction - (response.data.data[i].trip.vendorDeal.tdsAmount || 0) - (sumextratds || 0));

				var sumextratds = 0;
				for (let i = 0; i < response.data.data.length; i++) {
					let oGr = response.data.data[i];
					oGr.eWayBillExpiry = false;
					let isHighlightedRow = $scope.$configs && $scope.$configs.GR && $scope.$configs.GR.highlightedRow;
					if(isHighlightedRow && oGr.eWayBills && oGr.eWayBills.length && oGr.trip.status === 'Trip started'){
						oGr.eWayBills.forEach(obj=>{
							if(obj.expiry && new Date(obj.expiry) <= new Date())
								oGr.eWayBillExpiry = true;
						})
					}
					response.data.data[i].trip.vendorDeal = response.data.data[i].trip.vendorDeal || {};
					var totcharges = response.data.data[i].trip.vendorDeal.charges || 0;
					let sumextratds = $filter('sumObjKey')(totcharges, 'tdsAmount');

					// response.data.data[i].sumextratds = ($filter.response.data.data[i].trip.vendorDeal.charges|sumObjKey,'tdsAmount');
					// for (let key in totcharges) {

					// 	if (totcharges.hasOwnProperty(key)) {

					// 		sumextratds += (totcharges[key].tdsAmount || 0);
					// 	 }
					//  }
					response.data.data[i].totpayable = ((response.data.data[i].trip.vendorDeal.totWithMunshiyana || 0) + (response.data.data[i].trip.vendorDeal.totalCharges || 0) - (response.data.data[i].trip.vendorDeal.totalDeduction || 0) - (response.data.data[i].trip.vendorDeal.tdsAmount || 0) - (sumextratds || 0));
				}


				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response.data);
				// $scope.tableApi && $scope.tableApi.refresh();
			}
			// if(response.data.data.data) {
			// 	$scope.aTrip = response.data.data.data;
			// 	$scope.grPagination.total_pages = response.data.data.count / 10;
			// 	$scope.grPagination.totalItems = response.data.data.count;
			// 	if(response.data.data.length > 0) {
			// 		setTimeout(function() {
			// 			listItem = $($('.selectItem')[0]);
			// 			listItem.addClass('grn');
			// 		}, 200);
			// 		$scope.tripNo = response.data.data.data[0].trip_no;
			// 	}
			// }


		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function getAllFPA(isGetActive) {
		if (!($scope.oFilter.vendor_id && $scope.oFilter.vendor_id.ownershipType === 'Associate')) {
			growlService.growl("Selected vendor is not of 'ASSOCIATE' type", "danger");
			return;
		}
		if ($scope.oFilter.dateType) {
			if (!($scope.oFilter.from && $scope.oFilter.to)) {
				growlService.growl("Please fill From and To Date", "danger");
				return;
			}
		}
		$scope.selectType = 'multiple';
		$scope.selectedTrip = [];
		if (!$scope.lazyLoad.update(isGetActive)) return;
		let oFilter = prepareFilterObject();
		oFilter.no_of_docs = 100;
		oFilter.grNumber = {$exists: true};
		tripServices.getAllGRItem(oFilter, success, fail);

		function success(response) {
			if (response && response.data) {
				response = response.data;
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response.data);
				// $scope.tableApi && $scope.tableApi.refresh();
			}
			// if(response.data.data.data) {
			// 	$scope.aTrip = response.data.data.data;
			// 	$scope.grPagination.total_pages = response.data.data.count / 10;
			// 	$scope.grPagination.totalItems = response.data.data.count;
			// 	if(response.data.data.length > 0) {
			// 		setTimeout(function() {
			// 			listItem = $($('.selectItem')[0]);
			// 			listItem.addClass('grn');
			// 		}, 200);
			// 		$scope.tripNo = response.data.data.data[0].trip_no;
			// 	}
			// }
		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function downloadGRReport(isV2 = false, isCSV) {
		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.from && $scope.oFilter.to){
			if($scope.oFilter.from>$scope.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}

			if(moment($scope.oFilter.to).add(-3, 'month').isAfter(moment($scope.oFilter.from))) {
				return swal("warning", "Max 3 Month data Allowed", "warning");
			}
		}
		let aDownloadRistrict = [];
		var oFilter = prepareFilterObject();
		lastGRFilter = oFilter;
		$scope.disableDwnGrRpt = true;
		if(isCSV)
			oFilter.downloadCSV = true;
		tripServices[isV2 ? 'gRReportV2' : 'yetAnotherGRReport'](oFilter).then(data => {
			$scope.disableDwnGrRpt = false;
			if(data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', data.data.message, 'success');
			}
		});
	}

	function dailyMISreport(isV2 = false, isCSV) {
		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.from && $scope.oFilter.to){
			if($scope.oFilter.from>$scope.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}

			if(moment($scope.oFilter.to).add(-3, 'month').isAfter(moment($scope.oFilter.from))) {
				return swal("warning", "Max 3 Month data Allowed", "warning");
			}
		}
		let aDownloadRistrict = [];
		var oFilter = prepareFilterObject();
		lastGRFilter = oFilter;
		$scope.disableDwnGrRpt = true;
		if(isCSV)
			oFilter.downloadCSV = true;

		tripServices.dailyMISreport(oFilter).then(d => {
			if(d.data.url) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', d.data.message, 'success');
			}

		});
	}
	function downloadPODReport() {
		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.from && $scope.oFilter.to){
			if($scope.oFilter.from>$scope.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}
			if(moment($scope.oFilter.to).add(-3, 'month').isAfter(moment($scope.oFilter.from))) {
				return swal("warning", "Max 3 month data Allowed", "warning");
			}
		}
		let aDownloadRistrict = [];
		var oFilter = prepareFilterObject();
		oFilter.download = true;
		lastGRFilter = oFilter;

		$scope.disableDwnPodRpt = true;
		tripServices.yetPODReport(oFilter).then(data => {
			$scope.disableDwnPodRpt = false;
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}

	function downloadGRReportCron(isPagination) {
		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.from && $scope.oFilter.to){
			if($scope.oFilter.from>$scope.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}
			if($scope.oFilter.bill === "Un billed"){
				if(moment($scope.oFilter.to).add(-3, 'year').isAfter(moment($scope.oFilter.from))) {
					return swal("warning", "Max 3 Year data Allowed", "warning");
				}
			}else{
				if(moment($scope.oFilter.to).add(-1, 'year').isAfter(moment($scope.oFilter.from))) {
					return swal("warning", "Max 1 Year data Allowed", "warning");
				}
			}
		}
		let aDownloadRistrict = [];
		var oFilter = prepareFilterObject(isPagination);
		lastGRFilter = oFilter;

		tripServices.yetAnotherGRReportCron(oFilter).then(res => {
			if(!res.data.url) {
				xlsxWrapper(res.data.data, 'trip_report');
			}else{
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			}
		});
	}

	// function downloadGRReportMMT(isPagination) {
	// 	if (!($scope.oFilter.from && $scope.oFilter.to)) {
	// 		swal('Warning', 'From and To Date should be filled', 'warning');
	// 		return;
	// 	} else if($scope.oFilter.from && $scope.oFilter.to){
	// 		if($scope.oFilter.from>$scope.oFilter.to) {
	// 			return swal("warning", "To date should be greater than From date", "warning");
	// 		}
	// 	}
	// 	let aDownloadRistrict = [];
	// 	var oFilter = prepareFilterObject(isPagination);
	// 	oFilter.cType = 'MMT';
	// 	lastGRFilter = oFilter;
	//
	// 	tripServices.yetAnotherGRReportMMT(oFilter).then(data => {
	// 		var a = document.createElement('a');
	// 		a.href = data.data.url;
	// 		a.download = data.data.url;
	// 		a.target = '_blank';
	// 		a.click();
	// 	});
	// }

	function downloadMRReport(type, isPagination) {
		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		} else if($scope.oFilter.from && $scope.oFilter.to && !type){
			if(moment($scope.oFilter.to).add(-3, 'month').isAfter(moment($scope.oFilter.from))) {
				return swal("warning", "Max 3 month data Allowed", "warning");
			}
		}else if(type){
			if(moment($scope.oFilter.to).add(-12, 'month').isAfter(moment($scope.oFilter.from))) {
				return swal("warning", "Max 1 year data Allowed", "warning");
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		lastGRFilter = oFilter;
		oFilter.mrReport = true;
		// oFilter.branch = {$exists:true};
		oFilter.sort = {branch: 1};
		if(type){
			oFilter.downloadCSV = true;
			oFilter.mrCSV = true;
		}

		tripServices.yetAnotherGRReport(oFilter).then(d => {
			if(d.data.url) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', d.data.message, 'success');
			}

		});
	}

	function genFPABill() {
		if (!$scope.oFilter || !$scope.oFilter.vendor_id) {
			growlService.growl("Please select vendor from filters", "danger");
			return;
		}
		if (!Array.isArray($scope.selectedTrip)) {
			growlService.growl("Please select grs of vendor", "danger");
			return;
		}
		let st = $scope.selectedTrip.filter(y => Boolean(y.fpaBill));
		if (st && st.length > 0) {
			growlService.growl(`some of the selected grs have FPA BILL already generated`, "danger");
			return;
		}
		let st1 = $scope.selectedTrip.filter(y => (!y.totalFreight));
		if (st1 && st1.length > 0) {
			growlService.growl(`some of the selected grs doesn't have total freight`, "danger");
			return;
		}
		$uibModal.open({
			templateUrl: 'views/fpaMaster/generateFPABill.html',
			controller: 'genFpaBillCtrl',
			resolve: {
				grs$$: () => $scope.selectedTrip,
				vendorDetails$$: () => ({
					vendor: $scope.oFilter.vendor_id._id,
					vendor_name: $scope.oFilter.vendor_id.name
				})
			}
		});
	}

	function uploadGR(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('grExcel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			tripServices.uploadGRs(data)
				.then(function (d) {
					swal({
						title: d.data.message,
						type: "info"
					});
					$uibModalInstance.close();
				}).catch(function (err) {
				swal(err.data.message, err.data.error, 'error');
			});
		}
	}

	function getConsignor(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				name: viewValue
			};
			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignee(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				name: viewValue
			};
			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function printTDS() {
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'tdsRenderCtrl',
			resolve: {
				thatTrip: $scope.selectedTrip
			}
		});
	}

	function uploadDocs(gr) {
		console.log(gr);
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'gr',
					scopeModel: gr,
					scopeModelId: gr._id,
					uploadText: "Upload GR Documents",
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	}

	function previewBuilty(gr) {
		if(!gr._id)
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: gr._id,
				modelName: "gr"
			};

			let aAllDoc = [];
			aAllDoc.push(gr._id);

			if(gr.trip && gr.trip._id)
				aAllDoc.push(gr.trip._id);

			if(gr.vehicle)
				aAllDoc.push(gr.vehicle);

			let reqId = {};
			let _id = [];
			reqId._id =  aAllDoc;
			//dmsService.getAllDocs( req,success,failure);
			dmsService.getAllDocsV2(reqId, success, failure);

			function success(res) {
				if (res && res.data.length>0 ) {
					//$scope.oDoc = res.data;
					let aDocData 	= [];
					let aDocRes 	= [];
					let obTrip 		= {};
					let livedObj 	= {};
					aDocData = res.data;
					livedObj = aDocData.reduce(function(o,i){
						if(!o.hasOwnProperty(i.linkTo)){
							o[i.linkTo] = [];
						}

						var grouped = {};
						if(i.files && i.files.length>0) {
							i.files.forEach(function (t) {
								if (!grouped[t.category]) {
									grouped[t.category] = [];
								}

								if(i.linkTo=='gr') {
									if(gr._id==i.linkToId){
										grouped[t.category].push({
											name: `${URL.file_server}${t.name}`,
											iName:t.name,
											_id: i._id,
											sId: gr._id,
											sNumber:gr.grNumber
										});
									}
								}

								if(i.linkTo=='trip') {
									if(gr.trip && (gr.trip._id==i.linkToId)){
										grouped[t.category].push({
											name: `${URL.file_server}${t.name}`,
											iName:t.name,
											_id: i._id,
											sId: gr.trip._id,
											sNumber:gr.trip.trip_no
										});
									}
								}

								if(i.linkTo=='regVehicle') {
									if(gr.vehicle && (gr.vehicle._id==i.linkToId)){
										grouped[t.category].push({
											name: `${URL.file_server}${t.name}`,
											iName:t.name,
											_id: i._id,
											sId: gr.vehicle,
											sNumber:gr.vehicle_no
										});
									}
								}
							})
						}
						o[i.linkTo].push(grouped);
						return o;
					},{});

					//$scope.oDoc = res.data;
					$scope.oDoc = livedObj;
					prepareData();

				}else{
					growlService.growl("No documents to preview", "warning");
					return;
				}
			}

			function failure(res) {
				var msg = res.data.message;
				growlService.growl(msg, "error");
				return;
			}
		}

		// function prepareData() {
		// 	let mergeData = {};
		// 	$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj=>{
		// 		mergeData[obj.category] = mergeData[obj.category] || [];
		// 		mergeData[obj.category].push(obj);
		// 	});
		// 	$scope.oDoc = mergeData;
		//
		// 	for (let [key, val] of Object.entries($scope.oDoc)) {
		// 		if(Array.isArray(val)){
		// 			val.forEach((doc, i) => {
		// 				let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
		// 				documents.push({
		// 					name,
		// 					docName:doc.name,
		// 					_id: gr._id,
		// 					modelName: 'gr',
		// 					url: `${URL.file_server}${doc.name}`
		// 				});
		// 			});
		// 		}else{
		// 			let name = `${key|| 'misc'}`.toUpperCase();
		// 			documents.push({
		// 				name,
		// 				docName:doc.name,
		// 				_id: gr._id,
		// 				modelName: 'gr',
		// 				url: `${URL.file_server}${doc.name}`
		// 			});
		// 		}
		// 	}
		//
		// 	$uibModal.open({
		// 		templateUrl: 'views/carouselPopup.html',
		// 		controller: 'carouselCtrl',
		// 		resolve: {
		// 			documents: function () {
		// 				return documents;
		// 			}
		// 		}
		// 	});
		//
		//
		//
		//
		// }

		// if (documents.length < 1) {
		// 	growlService.growl("No documents to preview", "warning");
		// 	return;
		// }

	};

	function prepareData() {
		$uibModal.open({
			templateUrl: 'views/previewDocumentPopup.html', //'views/carouselPopup.html',
			controller:  'preiveDocPopupCtrl',
			resolve: {
				documents: function () {
					return $scope.oDoc;
				}
			}
		});
	}


	function grReceive(oTrip, index) {
		// if(oTrip.pod.received == true){
		// 	swal('Warning','Gr already Receive','warning');
		// 	return;
		// }
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/grReceive.html',
			controller: 'grReceivePopUpCtrl',
			resolve: {
				thatTrip: function () {
					return oTrip;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data != 'cancel') {
				swal('Oops!', data.data.message, 'error');
			}
		});
	}

	function showHistory(oTrip) {
		$uibModal.open({
			templateUrl: 'views/myGR/pendingGrHistoryPopup.html',
			controller: 'pendingGrHistoryPopupCtrl',
			resolve: {
				thatTrip: function () {
					return oTrip;
				}
			}
		});
	}

	function addRemark(oTrip, index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/addRemark.html',
			controller: 'addRemarkPopUpCtrl',
			resolve: {
				thatTrip: function () {
					return oTrip;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data != 'cancel') {
				swal('Oops!', data.data.message, 'error');
			}
		});
	};

	$scope.grAckRevert = function(){
		if($scope.selectedTrip.bill)
			return swal('Oops!', 'can not revert!!! bill already generated', 'error');

		if ($scope.selectedTrip.acknowledge.status) {
			swal({
					title: 'Do you want to Revert Acknowledgement ?',
					text: '',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#DD6B55',
					confirmButtonText: 'Yes, i want',
					cancelButtonText: 'No, cancel it!',
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						tripServices.revertGrAcknowledge({
							_id: $scope.selectedTrip._id
						}, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							$scope.getAllGR();
							swal('Success', res.data.message, 'success');
						}
					}
				});
		}
	};

	$scope.grAckRmk = function (remark) {
		if (remark.acknowledge.status == true) {
			swal('Warning', 'Gr already acknowledge', 'warning');
			return;
		}


		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGRacknowledge/addGrRemark.html',
			controller: ['$scope', '$uibModalInstance', 'Info', 'tripServices', addGrRemarkController],
			controllerAs: 'rmVm',
			resolve: {
				Info: function () {
					return remark;
				}
			}
		});
	};


	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				customer.getCustomerSearch(viewValue, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getVehicles(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				// let req = {
				// 	name: viewValue,
				// 	no_of_docs: 10,
				//
				// };

				Vehicle.getNameTrim(viewValue, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}


	function getVendors(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					deleted: false
				};

				Vendor.getName(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}


	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				billingPartyService.getBillingParty(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if ($scope.aBranch && $scope.aBranch.length) {
					let branch = [];
					$scope.aBranch.forEach(obj => {
						if(obj.read)
							branch.push(obj);
					});
					resolve(branch);
				} else
				  branchService.getAllBranches(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function selectRow(info, index) {
		$scope.tripNo = info.trip_no;
		$scope.selectedTrip = info;
	}

	function printBuilty() {
		//alert("Functioning remaining");
		$scope.oTrip = $scope.selectedTrip;
		if ($scope.oTrip && $scope.oTrip.grNumber) {
			var oFilter = {_id: $scope.oTrip._id,item:$scope.oTrip};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: 'builtyRendorCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
	}

	function revertMultiGr(){
		if(($scope.selectedTrip.bill || ($scope.selectedTrip.provisionalBill && $scope.selectedTrip.provisionalBill.ref && $scope.selectedTrip.provisionalBill.ref.length)))
			return swal('Error', 'bill already genereted can not revert', 'error');

			swal({
					title: 'Do you want to Revert Gr ?',
					text: '',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#DD6B55',
					confirmButtonText: 'Yes, i want',
					cancelButtonText: 'No, cancel it!',
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function (isConfirm) {
					if (isConfirm) {
						tripServices.revertMultiGr({
							_id: $scope.selectedTrip.trip._id,
							grNumber: $scope.selectedTrip.grNumber
						}, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							$scope.getAllGR();
							swal('Success', res.data.message, 'success');
						}
					}
				});
	};

	function genMultiGr() {
		if(($scope.selectedTrip.bill || ($scope.selectedTrip.provisionalBill && $scope.selectedTrip.provisionalBill.ref && $scope.selectedTrip.provisionalBill.ref.length)))
			return swal('Error', 'bill genereted already', 'error');
		if($scope.selectedTrip.invToBill)
			return swal('Error', 'gr genereted already', 'error');
		if(!$scope.selectedTrip.grNumber)
			return swal('Error', 'gr Number Not Found!!! Gr No required', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/genMultipleGrPopUp.html',
			controller: 'genMultipleGrPopUpCtrl',
			controllerAs: 'gmgVm',
			resolve: {
				thatGr: function () {
					return $scope.selectedTrip;
				}
			}
		});
	}

	function cancelGR() {
		let isCancelledGr = false;
		if($scope.selectedTrip && $scope.selectedTrip.moneyReceipt){
			$scope.selectedTrip.moneyReceipt.collection.forEach(obj=>{
				if(obj.paymentId)
					isCancelledGr = true;
			});
		}
		if(isCancelledGr)
			return swal('Error', 'Can`t Cancel Payment link to MR', 'error');

		swal({
				title: 'Are you sure you want to Cancel this Gr?',

				type: 'warning',
				showCancelButton: true,
				confirmButtonClass: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirm) {
				if (isConfirm) {
					tripServices.cancelGR({
						_id: $scope.selectedTrip._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('GR Cancel Failed', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('GR Cancelled', res.data.message, 'success');
					}
				}
			});
	}

	function previewTransportSlip(oTrip) {
		if (oTrip && oTrip.gr_no) {
			var oFilter = {trip_no: oTrip.trip_no, gr_no: oTrip.gr_no, booking_no: oTrip.booking_info[0].booking_no};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/transportSlipRender.html',
				controller: 'transportSlipRenderCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
	}

	function previewTDS(oTrip) {
		if (oTrip && oTrip.gr_no) {
			var oFilter = {trip_no: oTrip.trip_no, gr_no: oTrip.gr_no, booking_no: oTrip.booking_info[0].booking_no};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/tdsSlipRender.html',
				controller: 'tdsSlipRenderCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
	}

	function grOpperation(OperationType) {
		stateDataRetain.go('booking_manage.grUpsert', {
			mode: OperationType,
			gr: $scope.selectedTrip
		}, 'gr');
	}

	function mrOpperation(OperationType) {
		stateDataRetain.go('booking_manage.moneyReceipt', {
			mode: OperationType,
			gr: $scope.selectedTrip
		}, 'gr');
	}

	function grStatusUpdate() {
		$uibModal.open({
			templateUrl: 'views/myTripsStatus/statusUpdatePopup.html',
			controller: 'statusUpdateCtrl',
			resolve: {
				callback: function () {
					return function (request) {
						return new Promise(function (resolve, reject) {
							if ($scope.$role['GR']['Admin Edit'])
								tripServices.admUpdateGr(request, success, failure);
							else
								tripServices.updateGrStatus(request, success, failure);

							function success(res) {
								console.log(res);
								$scope.selectedTrip = res.data.data;
								swal('GR Status Updated', res.data.message, 'success');
								resolve();
							}

							function failure(err) {
								swal('Error', err.data.message, 'error');
								reject(err);
							}
						});
					}
				},
				modelData: function () {
					return {
						header: 'Gr Number ' + $scope.selectedTrip.grNumber
					};
				},
				otherData: function f() {
					let statuses = [
						{key: 'GR Assigned', label: 'GR Assigned'},
						{key: 'Vehicle Arrived for loading', label: 'Vehicle Arrived for loading'},
						{key: 'Loading Started', label: 'Loading Started'},
						{key: 'Loading Ended', label: 'Loading Ended'},
						{key: 'Departure' , label: 'Departure ' },
						{key: 'Vehicle Arrived for unloading', label: 'Vehicle Arrived for unloading'},
						{key: 'Unloading Started', label: 'Unloading Started'},
						{key: 'Unloading Ended', label: 'Unloading Ended'},
						{key: 'Trip cancelled', label: 'Trip cancelled'},
						{key: 'GR Acknowledged', label: 'GR Acknowledged'},
						{key: 'GR Received', label: 'GR Received'},
					];

					if (!$scope.$role['GR']['Admin Edit'])
					statuses = statuses.filter(s => !($scope.selectedTrip.statuses || []).find(o => o.status === s.key));

					return {
						aStatuses: statuses,
						selectedData: $scope.selectedTrip,
						adminAccess: $scope.$role['GR']['Admin Edit']
					};
				}
			}
		});
	}

	function addMultipleGr() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/addMultipleGrPopUp.html',
			controller: 'addMultipleGrPopUpCtrl',
			controllerAs: 'amgVm',
			resolve: {
				thatGr: function () {
					return $scope.selectedTrip;
				}
			}
		});
	}

	function moveGr() {
		let isCancelledGr = false;
		if($scope.selectedTrip && $scope.selectedTrip.moneyReceipt){
			$scope.selectedTrip.moneyReceipt.collection.forEach(obj=>{
				if(obj.paymentId)
					isCancelledGr = true;
			});
		}
		if(isCancelledGr)
			return swal('Error', 'Can`t Move Gr Payment link to MR', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/moveGrPopUp.html',
			controller: 'moveGrPopupController',
			controllerAs: 'mgVm',
			resolve: {
				thatGr: function () {
					return $scope.selectedTrip;
				}
			}
		});
	}

	function unMapGrFromTrip() {
		let isCancelledGr = false;
		if($scope.selectedTrip && $scope.selectedTrip.moneyReceipt){
			$scope.selectedTrip.moneyReceipt.collection.forEach(obj=>{
				if(obj.paymentId)
					isCancelledGr = true;
			});
		}
		if(isCancelledGr)
			return swal('Error', 'Can`t UnMap Gr Payment link to MR', 'error');

		if(!($scope.selectedTrip.trip && $scope.selectedTrip.trip_no))
			return swal('Error', 'Trip not Found on selected Gr', 'error');

		if($scope.selectedTrip.pod && $scope.selectedTrip.pod.received)
			return swal('Error', 'Can not unMap Gr POD Already Received', 'error');

		if($scope.selectedTrip.bill)
			return swal('Error', 'Can not UnMap Gr Bill Already Generated', 'error');

		if($scope.selectedTrip.supplementaryBillRef && $scope.selectedTrip.supplementaryBillRef.length)
			return swal('Error', 'Can not UnMap Gr supplementaryBill Already Generated', 'error');

		if($scope.selectedTrip.provisionalBill && $scope.selectedTrip.provisionalBill.length)
			return swal('Error', 'Can not UnMap Gr provisionalBill Already Generated', 'error');


		swal({
				title: 'Are you sure you want to UnMap this Gr from Trip?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonClass: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirm) {
				if (isConfirm) {
					let req = {
						_id: $scope.selectedTrip._id,
					};
					tripServices.unMapGrFromTrip(req, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						$uibModalInstance.dismiss(res);
					}
				}
			});
		return;
	}

	function isNonBillable(selectedGr) {

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/grNonBillablePopUp.html',
			controller: ['$uibModalInstance', 'DatePicker', 'selectedGr', 'tripServices', grNonBillablePopUpController],
			controllerAs: 'gnbVm',
			resolve: {
				selectedGr: function () {
					return selectedGr;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
		}, function (data) {
		});
	}
});


// materialAdmin.controller('preiveDocPopupCtrl', function ($rootScope, $scope, $uibModal, $uibModalInstance, dmsService, documents) {
// 	$scope.images = documents;
// 	$scope.closeModal = closeModal;
//
//
// 	(function init() {
//
// 	})();
//
//
//
// 	function closeModal() {
// 		$uibModalInstance.dismiss();
// 	}
//
// 	$scope.onDownloadButtonClicked = function (title, name) {
// 		var $a = document.createElement('a');
// 		$a.setAttribute("type", "hidden");
// 		$a.setAttribute("title", title);
// 		$a.setAttribute('href', name);
// 		$a.setAttribute('target', '_blank');
// 		document.body.appendChild($a);
// 		$a.click();
// 		document.body.removeChild($a);
// 	};
//
// 	$scope.deleteDoc = function(modelName, iName, id){
// 		if(iName){
// 			let req = {
// 				_id: id,
// 				modelName: modelName,
// 				name: iName
// 			};
// 			dmsService.deleteFile( req,success,failure);
//
// 			function success(res) {
// 				if (res) {
// 					var msg = res.message;
// 					swal('', msg, "success");
// 					closeModal();
// 					return;
// 				}
// 			}
//
// 			function failure(res) {
// 				var msg = res.message;
// 				swal('', msg, "error");
// 				return;
// 			}
// 		}
// 	}
//
// 	$scope.printDoc = function (source) {
// 		Pagelink = "about:blank";
// 		var pwa = window.open(Pagelink, "_new");
// 		pwa.document.open();
// 		pwa.document.write($scope.DocPrint(source));
// 		pwa.document.close();
// 	};
// 	$scope.DocPrint = function (source) {
// 		return "<html><head><script>function step1(){\n" +
// 			"setTimeout('step2()', 10);}\n" +
// 			"function step2(){window.print();window.close()}\n" +
// 			"</scri" + "pt></head><body onload='step1()'>\n" +
// 			"<img src='" + source + "' /></body></html>";
// 	};
//
// 	$scope.$watch('currentItemIndex', function (newVal, oldVal) {
// 		if (oldVal > newVal) {
// 			if (typeof $scope.onPrevious === 'function') {
// 				$scope.onPrevious();
// 			}
// 		} else {
// 			if (typeof $scope.onNext === 'function') {
// 				$scope.onNext();
// 			}
// 		}
// 	});
//
//
//
// });


materialAdmin.controller('addMultipleGrPopUpCtrl', function (
	$scope,
	$uibModalInstance,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	thatGr,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.thatGr = angular.copy(thatGr);
	vm.getAllGrs = getAllGrs;
	vm.submit = submit;
	vm.numOfGr = 1;

	// init
	(function init() {
		vm.columnSetting = {
			allowedColumn: [
				'Trip No',
				'Gr No',
				'Gr Date',
				'Loading Date',
				'Vehicle No',
				'Customer',
				'Consignor',
				'BillingParty',
			]
		};
		vm.tableHead = [
			{
				'header': 'Trip No',
				'bindingKeys': 'trip.trip_no'
			},
			{
				'header': 'Gr No',
				'bindingKeys': 'grNumber',
				'date': false
			},
			{
				'header': 'Gr Date',
				'bindingKeys': 'grDate',
				'date': 'dd-mm-yyyy'
			},
			{
				'header': 'Loading Date',
				'bindingKeys': '((statuses | filter:{"status": "Loading Ended"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-mm-yyyy'
			},
			{
				'header': 'Vehicle No',
				'bindingKeys': 'trip.vehicle_no',
				'date': false
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name || booking.customer.name'
			},
			{
				'header': 'Consignor',
				'bindingKeys': 'consignor.name || booking.consignor.name'
			},
			{
				'header': 'BillingParty',
				'bindingKeys': 'billingParty.name || booking.billingParty.name'
			},
			{
				'header': 'Route',
				'bindingKeys': 'route.name || booking.route.name'
			},
		];
		vm.aSelectedGr = [];
		vm.lazyLoad = lazyLoadFactory();
		getAllGrs();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAllGrs(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		tripServices.getAllGRItem(oFilter, function (res) {
			if (res && res.data) {

				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);

				vm.selectedTrip = res.data;
			}
		});
	}

	function prepareFilter() {
		var request = {source: 'GR'};

		if (vm.thatGr.trip.trip_no) {
			request.trip_query = request.trip_query || {};
			request.trip_query.trip_no = vm.thatGr.trip.trip_no;
		}

		request.no_of_docs = 10;
		request.skip = vm.lazyLoad.getCurrentPage();

		request.sort = {_id: -1};
		return request;
	}

	function submit(form) {

		let oRequest = {
			trip: {
				_id: vm.thatGr.trip._id,
				gr: [...new Array(vm.numOfGr)].reduce((acc, curr) => {
					delete vm.thatGr._id;
					delete vm.thatGr.grNumber;
					return [...acc, vm.thatGr];
				}, []),
			}
		};
		tripServices.addMoreGRInTrip(oRequest, success, failure);

		function success(res) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
			stateDataRetain.back('booking_manage.myGR', res.data.data);
		}

		function failure(res) {
			swal('Error', res.data.message, 'error');
		}
	}
});

materialAdmin.controller('genMultipleGrPopUpCtrl', function (
	$scope,
	$uibModalInstance,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	thatGr,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.thatGr = angular.copy(thatGr);
	vm.grId = vm.thatGr._id;
	vm.getAllGrs = getAllGrs;
	vm.numValidation = numValidation;
	vm.submit = submit;
	vm.numOfGr = 2;

	// init
	(function init() {
		vm.columnSetting = {
			allowedColumn: [
				'Trip No',
				'Gr No',
				'Gr Date',
				'Loading Date',
				'Vehicle No',
				'Customer',
				'Consignor',
				'BillingParty',
			]
		};
		vm.tableHead = [
			{
				'header': 'Trip No',
				'bindingKeys': 'trip.trip_no'
			},
			{
				'header': 'Gr No',
				'bindingKeys': 'grNumber',
				'date': false
			},
			{
				'header': 'Gr Date',
				'bindingKeys': 'grDate',
				'date': 'dd-mm-yyyy'
			},
			{
				'header': 'Loading Date',
				'bindingKeys': '((statuses | filter:{"status": "Loading Ended"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-mm-yyyy'
			},
			{
				'header': 'Vehicle No',
				'bindingKeys': 'trip.vehicle_no',
				'date': false
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name || booking.customer.name'
			},
			{
				'header': 'Consignor',
				'bindingKeys': 'consignor.name || booking.consignor.name'
			},
			{
				'header': 'BillingParty',
				'bindingKeys': 'billingParty.name || booking.billingParty.name'
			},
			{
				'header': 'Route',
				'bindingKeys': 'route.name || booking.route.name'
			},
		];
		vm.aSelectedGr = [];
		vm.lazyLoad = lazyLoadFactory();
		getAllGrs();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAllGrs(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		tripServices.getAllGRItem(oFilter, function (res) {
			if (res && res.data) {

				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);

				// vm.selectedTrip = res.data;
			}
		});
	}

	function prepareFilter() {
		var request = {source: 'GR'};

		if (vm.thatGr.trip.trip_no) {
			request.trip_query = request.trip_query || {};
			request.trip_query.trip_no = vm.thatGr.trip.trip_no;
		}

		request.no_of_docs = 10;
		request.skip = vm.lazyLoad.getCurrentPage();

		request.sort = {_id: -1};
		return request;
	}

	function numValidation(num) {
		if(num<2)
			vm.numError = 'InValid Number minimum 2 gr Only';
		else if(num>20)
			vm.numError = 'InValid Number maximum 20 gr Only';
		else
		vm.numError = undefined;
	}

	function submit(form) {

		let oRequest = {
			trip: {
				_id: vm.thatGr.trip._id,
				grId: vm.grId,
				grNumber: vm.thatGr.grNumber,
				gr: [...new Array(vm.numOfGr -1)].reduce((acc, curr) => {
					delete vm.thatGr._id;
					return [...acc, vm.thatGr];
				}, []),
			}
		};
		tripServices.genMultiGrInTrip(oRequest, success, failure);

		function success(res) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
			stateDataRetain.back('booking_manage.myGR', res.data.data);
		}

		function failure(res) {
			swal('Error', res.data.message, 'error');
		}
	}
});


materialAdmin.controller('moveGrPopupController', function (
	$scope,
	$uibModalInstance,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	thatGr,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.DatePicker = angular.copy(DatePicker);
	vm.selectedGr = angular.copy(thatGr);
	vm.getTrips = getTrips;
	vm.moveGrInTrip = moveGrInTrip;

	// init
	(function init() {

		vm.columnSetting = {
			allowedColumn: [
				'Trip Entry',
				'Trip Start',
				'Trip No',
				'Gr No',
				'Consignor',
				'Vehicle No',
				'Route',
				'Route Km',
				'Deal Total',
				'Total Advance',
				'Revenue',
				'Revenue/KM',
				'Profit',
				'Profit/KM',
				//'Budget',
				//'Cash Adv',
				'Vendor Deal',
				'Vendor Charges',
				'Vendor Deduction',
				'Balance',
				'tds extra',
				'TDS Percentage',
				'Adv/KM',
				//'Settled Amt',
				'Driver Name',
				'Driver No.',
				'Vendor Name',
				'Pan Card No.',
				'Trip Status',
				'Ownership',
				'hire slip',
				'Branch',
				'Vendor Company',
				'Last Update Time',
				'Vendor Advance Paid',
				'Pay by Cheque',
				'Pay by Broker',
				'Pay by Diesel',
				'Pay by Cash',
				'Remaining Amount'
			]
		};

		vm.tableHead = [
			{
				'header': 'Trip Entry',
				'bindingKeys': 'allocation_date',
				'date': true
			},
			{
				'header': 'Trip Start',
				'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			{
				'header': 'Gr No',
				'filter': {
					'name': 'arrayOfGrToString',
					'aParam': [
						'gr',
					]
				}
			},
			{
				'header': 'Consignor',
				'bindingKeys': 'gr[0].consignor.name'
			},
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle.vehicle_reg_no',
				'date': false
			},
			{
				'header': 'Branch',
				'bindingKeys': 'branch.name'
			},
			{
				'header': 'Route',
				'bindingKeys': 'route_name'
			},
			{
				'header': 'Route Km',
				'bindingKeys': 'totalKm'
			},
			/*{
				'header': 'Budget',
				'bindingKeys': "(netBudget.toFixed(2) || vendorDeal.total_expense || 0)"
			},*/
			{
				'header': 'Vendor Deal',
				'bindingKeys': '(vendorDeal && vendorDeal.totWithMunshiyana || 0)'
			},
			{
				'header': 'Vendor Charges',
				'bindingKeys': '(vendorDeal && vendorDeal.totalCharges.toFixed(2) || 0)'
			},
			{
				'header': 'Vendor Deduction',
				'bindingKeys': '(vendorDeal && vendorDeal.totalDeduction.toFixed(2) || 0)'
			},
			{
				'header': 'Deal Total',
				'bindingKeys': '(vendorDeal && vendorDeal.totalDeal.toFixed(2) || 0)'
			},
			{
				'header': 'Cash Adv',
				'bindingKeys': '(totalCash.toFixed(2) || 0)'
			},
			{
				'header': 'Total Advance',
				'bindingKeys': '(tAdv.toFixed(2) || 0)'
			},
			{
				'header': 'Balance',
				'bindingKeys': '(this.vendorDeal && this.vendorDeal.totalDeal || 0) - (this.tAdv || 0)',
				'eval': true
			},
			{
				'header': 'tds extra',
				'bindingKeys': '(this.vendorDeal && this.vendorDeal.charges|sumObjKey:"tdsAmount")',
				'eval': true
			},
			{
				'header': 'TDS Percentage',
				'bindingKeys': 'vendor.tdsRate'
			},
			{
				'header': 'Adv/KM',
				'bindingKeys': 'advPKM'
			},
			{
				'header': 'Revenue',
				'bindingKeys': 'totRev.toFixed(2) || 0'
			},
			{
				'header': 'Revenue/KM',
				'bindingKeys': 'internal_freightPKM || actaul_freightPKM'
			},
			// { //charan
			// 	'header': 'Profit',
			// 	'bindingKeys': '(intial_profit.toFixed(2) || freight_profit.toFixed(2) || 0)'
			// },
			{
				'header': 'Profit',
				'bindingKeys': '(totRev.toFixed(2) || 0) - (vendorDeal && vendorDeal.totalDeal.toFixed(2) || 0)'
			},
			{
				'header': 'Profit/KM',
				'bindingKeys': 'profitPKM || frProfitPKM'
			},
			/*{
				'header': 'Settled Amt',
				'bindingKeys': '(actual_expense.toFixed(2) || 0)'
			},*/
			{
				'header': 'Driver Name',
				'bindingKeys': 'driver.name'
			},
			{
				'header': 'Driver No.',
				'bindingKeys': 'driver.prim_contact_no'
			},
			{
				'header': 'Vendor Name',
				'bindingKeys': 'vendor.name'
			},
			{
				'header': 'Pan Card No.',
				'bindingKeys': 'vendor.pan_no'
			},
			{
				'header': 'Trip Status',
				'bindingKeys': 'status'
			},
			{
				'header': 'Ownership',
				'bindingKeys': 'ownershipType'
			},
			{
				'header': 'hire slip',
				'bindingKeys': 'vendorDeal.loading_slip'
			},
			{
				'header': 'Vendor Company',
				'bindingKeys': '(($user.client_allowed|filter:{"clientId":this.vendor.clientId})[0].name)',
				'eval': true
			},
			{
				'header': 'Last Update Time',
				'bindingKeys': 'last_modified_at'
			},
			{
				'header': 'Vendor Advance Paid',
				'bindingKeys': 'vendorAdvancePaid'
			},
			{
				'header': 'Pay by Cheque',
				'bindingKeys': 'payByCheque'
			},
			{
				'header': 'Pay by Broker',
				'bindingKeys': 'payByBroker'
			},
			{
				'header': 'Pay by Diesel',
				'bindingKeys': 'payByDiesel'
			},
			{
				'header': 'Pay by Cash',
				'bindingKeys': 'payByCash'
			},
			{
				'header': 'Remaining Amount',
				'bindingKeys': 'remainingAmt'
			}
		];
		vm.selectedTrip = [];
		vm.lazyLoad = lazyLoadFactory();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getTrips(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let request = prepareFilter();
		tripServices.getAllTripsWithPagination(request, success, failure);

		function success(res) {
			res = res.data.data;
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
		}

		function failure(res) {
			swal("Failed!", res.data.data.data, "error");
		}
	}

	function prepareFilter() {
		var request = {};

		if (vm.from) {
			request.from = vm.from;
		}
		if (vm.to) {
			request.to = vm.to;
		}
		// if(vm.gr.customer)
		// request.customer = vm.gr.customer.customer._id;
		if(vm.selectedGr.trip_no)
		request.trip_no = {$ne: vm.selectedGr.trip_no};
		request.vehicle = vm.selectedGr.vehicle;
		request.category = 'Loaded';
		request.isCancelled = false;

		request.no_of_docs = 5;
		request.skip = vm.lazyLoad.getCurrentPage();

		request.sort = {_id: -1};
		return request;
	}

	function moveGrInTrip(selectedTrip) {
		if (!selectedTrip)
			return swal('Warning', 'Please Select at least one row', 'warning');

		if (selectedTrip && selectedTrip.gr && selectedTrip.gr[0].grDate) {
			let totday = (selectedTrip.gr[0].grDate - vm.selectedGr.grDate) / (1000 * 60 * 60 * 24);
			if (totday > 3 && totday <= (-3))
				return swal('Warning', 'gr date should not differ for more than 3 days for the new trip grs', 'warning');
		}

		const tripStatuses = selectedTrip.statuses || [];
		selectedTrip.tripStartDate = tripStatuses.find(o => o.status === 'Trip started');
		selectedTrip.tripEndDate = tripStatuses.find(o => o.status === 'Trip ended');

		if (!selectedTrip.tripStartDate)
			return swal('Warning', 'Selected trip not started yet', 'warning');
		selectedTrip.tripEndDate = (selectedTrip.tripEndDate && new Date(selectedTrip.tripEndDate.date)) || new Date();

		// if(selectedTrip.tripStartDate && selectedTrip.tripEndDate){
		// 	if((new Date(vm.selectedGr.grDate).getTime() < new Date(selectedTrip.tripStartDate.date).getTime()) || new Date(vm.selectedGr.grDate).getTime() > new Date(selectedTrip.tripEndDate).getTime())
		// 		return swal('Warning', 'gr date should be in between new trip start date and end date', 'warning');
		// }

		swal({
				title: 'Are you sure you want to Move this Gr?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonClass: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirm) {
				if (isConfirm) {
					let req = {
						_id: selectedTrip._id,
						gr: vm.selectedGr._id
					};
					tripServices.moveGrIntoAnotherTrip(req, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						$uibModalInstance.dismiss(res);
					}
				}
			});
		return;
	}

	function submit(form) {

		let oRequest = {

			trip: {

				_id: vm.thatGr.trip._id,
				gr: [...new Array(vm.numOfGr)].reduce((acc, curr) => {
					delete vm.thatGr._id;
					delete vm.thatGr.grNumber;
					return [...acc, vm.thatGr];
				}, []),
			}
		};
		tripServices.moveGRInTrip(oRequest, success, failure);

		function success(res) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
		}

		function failure(res) {
			swal('Error', res.data.message, 'error');
		}
	}
});

materialAdmin.controller('grAdvancePaymentCtrller', function ($window, $scope, $localStorage, $uibModalInstance, growlService, accountingService, tripServices, selectedTripGr) {

	$scope.accountingAvailable = (
		$localStorage.ft_data
		&& $localStorage.ft_data.configs
		&& $localStorage.ft_data.configs.master
		&& $localStorage.ft_data.configs.master.showAccount
	) || false;

	$scope.advancePaymentData = {};
	$scope.advancePaymentData.from = billingPartyAccount;
	$scope.selectedTripGr = selectedTripGr;
	$scope.aFromAccount = [selectedTripGr.billingPartyAccount];

	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.maxDate = new $window.Date();
	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getAccountMasters = function () {
		accountingService.getAccountMaster({
			all: true,
			group: 'Transaction',
		}, function onSuccess(response) {
			$scope.aToAccount = response.data.data;
		}, (err) => {
		});
	}

	$scope.accountingAvailable && $scope.getAccountMasters();

	function getAdvancePayments() {
		tripServices.getAdvancePayments(selectedTripGr._id, res => {
			$scope.advancePayments = res.data.data.advance;
		}, (err) => {
			console.log(err);
		});
	}

	getAdvancePayments();

	$scope.updateTripGR = function () {
		var oSend = Object.assign({}, $scope.advancePaymentData);
		oSend.user = $localStorage.ft_data.userLoggedIn._id;
		oSend = {data: oSend};
		tripServices.addAdvancePayment(selectedTripGr._id, oSend, res => {
			console.log(res);
			if (res.data.status === 'OK') {
				swal('Advance Added', null, 'success');
				//$uibModalInstance.close(res.data);
			} else {
				swal('Unable to add advance', null, 'error');
				//$uibModalInstance.dismiss(res);
			}
			getAdvancePayments();
		}, err => {
			//$uibModalInstance.dismiss(err);
			growlService.growl(err.data.message, 'danger', 2);
		});
	};

});

materialAdmin.controller('myGRAckController', function (
	$rootScope,
	$scope,
	$uibModal,
	Pagination,
	$state,
	Vendor,
	stateDataRetain,
	tripServices,
	billsService,
	DateUtils,
	Vehicle,
	Routes,
	bookingServices,
	ReportService,
	customer) {
	var lastAckFilter;
	var oSearchGRAckFilter = {};
	//$scope.ackSts = ["Non-Acknowledged", "Acknowledged"];
	//$scope.status = "Non-Acknowledged";
	$scope.currentPage = ($rootScope.oSearchGRAckFilter && $rootScope.oSearchGRAckFilter.skip) ? $rootScope.oSearchGRAckFilter.skip : 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	var defaultSearch = {no_of_docs: $scope.items_per_page};
	var isSearchPreserved = (($rootScope.oSearchGRAckFilter) && (Object.keys($rootScope.oSearchGRAckFilter).length > 0)) ? true : false;
	$rootScope.oSearchGRAckFilter = isSearchPreserved ? $rootScope.oSearchGRAckFilter : angular.copy(defaultSearch);

	$scope.pageChanged = function () {
		$scope.getGRAck(true, true);
	};
	$scope.aBill = ["Billed", "Un billed", "All"];
	$scope.aPod = ["Received", "Not Received", "All"];
	$scope.aAcknowledged = ["Acknowledged", "Not Acknowledged", "All"];

	$scope.onStateRefresh = function () {
		// refresh code
	};

	(function init() {

		if (stateDataRetain.init($scope))
			return;

	})();

	function prepareFilterObject(isPagination, change, reset) {
		var myFilter = angular.copy(defaultSearch);
		if (reset) {
			$rootScope.oSearchGRAckFilter = angular.copy(defaultSearch);
		}
		if (change) {
			if ($rootScope.oSearchGRAckFilter) {
				if ($rootScope.oSearchGRAckFilter.status) {
					myFilter.status = $rootScope.oSearchGRAckFilter.status;
				}
				if ($rootScope.oSearchGRAckFilter.boe_no) {
					myFilter.boe_no = $rootScope.oSearchGRAckFilter.boe_no;
				}
				if ($scope.oSearchGRAckFilter.bill) {
					if ($scope.oSearchGRAckFilter.bill == 'Billed') {
						myFilter.bill = {$exists: true};
					} else if ($scope.oSearchGRAckFilter.bill == 'Un billed') {
						myFilter.bill = {$exists: false};
					}
				}
				if ($scope.oSearchGRAckFilter.received == 'Not Received')
					myFilter["pod.received"] = false;
				else if ($scope.oSearchGRAckFilter.received == 'Received')
					myFilter["pod.received"] = true;

				if ($scope.oSearchGRAckFilter.acknowledge == 'Acknowledged')
					myFilter["acknowledge.status"] = true;
				else if ($scope.oSearchGRAckFilter.acknowledge == 'Not Acknowledged')
					myFilter["acknowledge.status"] = false;


				if ($rootScope.oSearchGRAckFilter.customer) {
					myFilter.customer_id = $rootScope.oSearchGRAckFilter.customer._id;
				}
				// if($rootScope.oSearchGRAckFilter.container_no) {
				// 	myFilter.container_no = $rootScope.oSearchGRAckFilter.container_no;
				// }
				if ($rootScope.oSearchGRAckFilter.route_id) {
					myFilter.booking_query = myFilter.booking_query || {};
					myFilter.booking_query.route = $rootScope.oSearchGRAckFilter.route_id._id;
				}
				if ($scope.oSearchGRAckFilter.from) {
					myFilter.from = myFilter.from = new Date(($scope.oSearchGRAckFilter.from).setHours(0, 0, 0));
				}
				if ($scope.oSearchGRAckFilter.to) {
					myFilter.to = new Date(($scope.oSearchGRAckFilter.to).setHours(23, 59, 59));
				}

				if ($rootScope.oSearchGRAckFilter.trip_no) {
					myFilter.trip_query = myFilter.trip_query || {};
					myFilter.trip_query.trip_no = $rootScope.oSearchGRAckFilter.trip_no;
				}
				if ($rootScope.oSearchGRAckFilter.vehicle_no) {
					myFilter.trip_query = myFilter.trip_query ? myFilter.trip_query : {};
					myFilter.trip_query.vehicle_no = $rootScope.oSearchGRAckFilter.vehicle_no;
				}
				// if($rootScope.oSearchGRAckFilter.booking_no) {
				// 	myFilter.booking_query = myFilter.booking_query || {};
				// 	myFilter.booking_query.booking_no = $rootScope.oSearchGRAckFilter.booking_no;
				// }
				if ($rootScope.oSearchGRAckFilter.grNumber) {
					myFilter.grNumber = $rootScope.oSearchGRAckFilter.grNumber;
				}
				if ($scope.oSearchGRAckFilter.dateType) {
					myFilter.dateType = $scope.oSearchGRAckFilter.dateType;
				}
				// if($rootScope.oSearchGRAckFilter.branch) {
				// 	myFilter.branch = $rootScope.oSearchGRAckFilter.branch;
				// }
				if ($scope.oSearchGRAckFilter.vendor_id) {
					myFilter.trip_query = myFilter.trip_query ? myFilter.trip_query : {};
					myFilter.trip_query.vendor = $scope.oSearchGRAckFilter.vendor_id._id;
				}
				if ($rootScope.oSearchGRAckFilter.customer) {
					myFilter.booking_query = myFilter.booking_query || {};
					myFilter.booking_query.customer = $rootScope.oSearchGRAckFilter.customer._id;
				}

				// myFilter['acknowledge.status'] = true;
				//
				// myFilter.bill = {
				// $exists: false
				// };
				//
				// myFilter.provisionalBill = {
				// $exists: false
				// };

			}
		}
		if (isPagination) {
			myFilter.skip = $scope.currentPage;
			$rootScope.oSearchGRAckFilter.skip = myFilter.skip;
		} else if (isSearchPreserved) {
			isSearchPreserved = false;
			if ($rootScope.oSearchGRAckFilter && $rootScope.oSearchGRAckFilter.skip) {
				myFilter.skip = $rootScope.oSearchGRAckFilter.skip;
			}
		}
		myFilter.sort = {
			$natural: -1
		};
		return myFilter;
	}

	$scope.getVendorName = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vendor.getName({name: viewValue, deleted: false}, oSuc, oFail);
		}
	};

	$scope.getGRAck = function (isPagination, change, reset, download) {
		function ack_success(res) {
			if (res.data.url) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			} else if (res.data.data.data) {
				$scope.aGRack = res.data.data.data;
				$scope.total_pages = res.data.data.pages;
				$scope.totalItems = $scope.items_per_page * res.data.data.pages;
				if (res.data.data.data.length > 0) {
					setTimeout(function () {
						listItem = $($('.selectItem')[0]);
						listItem.addClass('grn');
					}, 200);
					$scope.tripNo = res.data.data.data[0].trip_no;
					$scope.aInfo = res.data.data.data[0].booking_info;
					$scope.selectedTrip = res.data.data.data[0];
				}
			}
		}

		function fail(res) {
			//$uibModalInstance.dismiss(res);
		}

		var oFilter = prepareFilterObject(isPagination, change, reset);
		if ($scope.oSearchGRAckFilter.dateType) {
			if (!($scope.oSearchGRAckFilter.from && $scope.oSearchGRAckFilter.to)) {
				swal('warning', 'Please fill From and To Date', 'warning');
				return;
			}
		}
		if (download) {
			oFilter.download = true;
		}
		tripServices.getAllGRItem(oFilter, ack_success, fail);
	};
	// $scope.getGRAck(false, true, false);

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'customer':
				delete $rootScope.oSearchGRAckFilter.customer;
				$scope.getGRAck(false, true, false);
				break;
			case 'vehicle':
				delete $rootScope.oSearchGRAckFilter.vehicle_no;
				$scope.getGRAck(false, true, false);
				break;
			case 'route':
				delete $rootScope.oSearchGRAckFilter.route_id;
				$scope.getGRAck(false, true, false);
				break;
			default:
				break;
		}
	};
	$scope.onSelect = function ($item, $model, $label) {
		$scope.getGRAck(false, true, false);
	};
	$scope.getDname = function (viewValue) {
		function oSucD(response) {
			$scope.searchRoute = response.data.data;
		};

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getName(viewValue, oSucD, oFailD);
		} else if (viewValue == '') {
			$scope.getGRAck(false, true, false);
		}

	};
	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.searchCustomer = response.data;
			};

			function oFailC(response) {
				//console.log(response);
			}

			customer.getCustomerSearch(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {
			$scope.getGRAck(false, true, false);
		}
		;
	};
	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.searchVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			$scope.getGRAck(false, true, false);
		}
	};

	/*$scope.infoItem = function(info, index) {
		listItem = $($('.selectItem')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');
		$scope.tripNo = info.trip_no;
		$scope.selectedTrip = info;
		$scope.aInfo = info.booking_info;
	};*/

	$scope.infoItemSelected = function (info, index) {
		listItem = $($('.selectItem')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');
		$scope.tripNo = info.trip_no;
		$scope.selectedTrip = info;
		$scope.aInfo = info.booking_info;
		$rootScope.selectedGR = info;
		var sUrl = '#!/booking_manage/grAckDetails';
		$rootScope.redirect(sUrl);
	};

	$scope.myGRAckDeatils = function (oTrip, index) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGRacknowledge/myGRackPopUp.html',
			controller: 'myGRackPopUpCtrl',
			resolve: {
				thatTrip: function () {
					return oTrip;
				}
			}
		});

		modalInstance.result.then(function () {
			//$state.reload();
		}, function (data) {
			if (data != 'cancel') {
				swal('Oops!', data.data.error_message, 'error');
			}
		});
	};

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form **************
	/*$scope.getAllVehicles = function(){
    function success(data) {
      $rootScope.aVehicles = data.data;
    };
    var oFilter = {all:true};
    Vehicle.getAllVehicles(oFilter,success);
  }
  $scope.getAllVehicles();*/
	/*$scope.getAllRoute = function(){
    function success(data) {
      $scope.aRoute = data.data.data;
    };
    Routes.getAllRoutes({all:true},success);
  }
  $scope.getAllRoute();
  $scope.getCustomers = function(){
    function success(data) {
      $scope.aCustomer = data.data;
    };
    bookingServices.getAllCustomers(success);
  };
  $scope.getCustomers();*/
});

materialAdmin.controller("grAckUpsertController",
	function ($scope,
			  $uibModalInstance,
			  CustomerRateChartService,
			  DatePicker,
			  dateUtils,
			  selectedGrAck,
			  tripServices
	) {

		$scope.selectedGRInfo = {};
		$scope.DatePicker = angular.copy(DatePicker);
		// $scope.dateUtils = angular.copy(dateUtils);


		(function init() {
			$scope.selectedGRInfo = angular.copy(selectedGrAck);
			$scope.selectedGRInfo.deduction.advance_charges = $scope.selectedGRInfo.deduction.advance_charges || selectedGrAck.booking.advancePayment;

			$scope.selectedRateInfo = {
				source: $scope.selectedGRInfo.source,
				customer: $scope.selectedGRInfo.customer
			};
		})();

		$scope.closeModal = function () {
			$uibModalInstance.dismiss();
		};

		$scope.validateDate = function () {

			$scope.selectedGRInfo.pod.unloadingArrivalTime =
				dateUtils.calDays($scope.selectedGRInfo.pod.billingUnloadingTime, $scope.selectedGRInfo.pod.unloadingArrivalTime) < 0
					? $scope.selectedGRInfo.pod.billingUnloadingTime
					: $scope.selectedGRInfo.pod.unloadingArrivalTime;

			$scope.selectedGRInfo.pod.billingLoadingTime =
				dateUtils.calDays($scope.selectedGRInfo.pod.unloadingArrivalTime, $scope.selectedGRInfo.pod.billingLoadingTime) < 0
					? $scope.selectedGRInfo.pod.unloadingArrivalTime
					: $scope.selectedGRInfo.pod.billingLoadingTime;

			$scope.selectedGRInfo.pod.loadingArrivalTime =
				dateUtils.calDays($scope.selectedGRInfo.pod.billingLoadingTime, $scope.selectedGRInfo.pod.loadingArrivalTime) < 0
					? $scope.selectedGRInfo.pod.billingLoadingTime
					: $scope.selectedGRInfo.pod.loadingArrivalTime;

		};

		$scope.getRoute = function (viewValue, projection) {
			if (viewValue.length < 3) return;
			return new Promise(function (resolve, reject) {
				CustomerRateChartService.get({
					_t: 'autosuggest',
					[projection]: viewValue,
					projection
				})
					.then((res) => {
						resolve(res.data);
					})
					.catch(e => reject([]));
			});
		};

		$scope.getRateChart = function () {

			let request = {
				source: $scope.selectedRateInfo.source || '',
				destination: $scope.selectedRateInfo.destination || '',
				customer: $scope.selectedGRInfo.booking.customer._id || '',
				to: $scope.selectedRateInfo.end_date && $scope.selectedRateInfo.end_date.toISOString() || '',
				from: $scope.selectedRateInfo.start_date && $scope.selectedRateInfo.start_date.toISOString() || ''
			};

			function onSuccess(res) {
				$scope.aRateChart = res.data || [];
				$scope.selectedRateChart = $scope.aRateChart[0];
				$scope.selectedGRInfo.detention = $scope.aRateChart.detention.rate;
			}

			function onFailure(response) {
				console.log(response);
				swal('Error!', msg, 'error');
			}

			CustomerRateChartService.get(request).then(onSuccess).catch(onFailure);
		};

		$scope.rowSelect = function (rateObj) {
			$scope.selectedRateChart = rateObj;
			if (rateObj.source)
				$scope.selectedGRInfo.acknowledge.source = rateObj.source;
			if (rateObj.destination)
				$scope.selectedGRInfo.acknowledge.destination = rateObj.destination;
			if (rateObj.rate)
				$scope.selectedGRInfo.rate = rateObj.rate;
			if (rateObj.detention)
				$scope.selectedGRInfo.detention = rateObj.detention.rate;
			if (rateObj.routeDistance)
				$scope.selectedGRInfo.acknowledge.routeDistance = rateObj.routeDistance;
		};

		// $scope.onMaterialTypeChange = function(materialId) {
		// 	var material_type = $scope.aMaterialType.find(m => m._id === materialId);
		// 	$scope.selectedGRInfo.booking.material_type.group_name = material_type.name;
		// };

		$scope.submit = function (formData) {

			console.log($scope.selectedGRInfo);
			console.log($scope.formData);
			//GR Acknowledged


			let request = {
				invoices: [
					{
						weightPerUnit: $scope.selectedGRInfo.invoices.weightPerUnit,
						noOfUnits: $scope.selectedGRInfo.invoices.noOfUnits,
						loadRefNumber: $scope.selectedGRInfo.invoices.loadRefNumber,
						invoiceNo: $scope.selectedGRInfo.invoices.invoiceNo,
						invoiceDate: $scope.selectedGRInfo.invoices.invoiceDate
					}
				],
				acknowledge: $scope.selectedGRInfo.acknowledge,
				charges: $scope.selectedGRInfo.charges,
				eWayBills: $scope.selectedGRInfo.eWayBills,
				pod: $scope.selectedGRInfo.pod,
				isGrBillable: $scope.selectedGRInfo.isGrBillable,
				payment_type: $scope.selectedGRInfo.payment_type,
				payment_basis: $scope.selectedGRInfo.payment_basis,
				rate: $scope.selectedGRInfo.rate,
				// weight_per_unit: $scope.selectedGRInfo.weight_per_unit,
				// total_no_of_units: $scope.selectedGRInfo.total_no_of_units,
				// loadRefNumber: $scope.selectedGRInfo.loadRefNumber,
				// invoiceNumber: $scope.selectedGRInfo.invoiceNumber,
				// invoiceDate: $scope.selectedGRInfo.invoiceDate,
				loadingRpt: $scope.selectedGRInfo.loadingRpt,
				isAlreadyAck: !!$scope.selectedGRInfo.statuses.find(o => o.status === 'GR Acknowledged'),
				_id: $scope.selectedGRInfo._id
			};

			request.acknowledge.status = true;

			tripServices.updateGRack(request, success, failure);

			function success(response) {
				swal("GrAckDetails Updated Successfully");
				$uibModalInstance.close(response.data);
			}

			function failure(response) {
				swal(response.data.message, '', 'error');
			}
		};
	});

function addGrRemarkController(
	$scope,
	$uibModalInstance,
	Info,
	tripServices
) {
	let vm = this;
	vm.info = angular.copy(Info);
	vm.closeModal = closeModal;
	vm.submit = submit;

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit() {

		let request = {
			acknowledge: {doneRemark: vm.remark},
			_id: vm.info._id
		};

		request.acknowledge.status = true;

		tripServices.updateGRack(request, success, failure);

		function success(response) {
			swal("GR acknowledged successfully");
			$uibModalInstance.close(response.data);
		}

		function failure(response) {
			swal(response.data.message, '', 'error');
		}
	};

}


function grNonBillablePopUpController(
	$uibModalInstance,
	DatePicker,
	selectedGr,
	tripServices,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;

	// init
	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.gr = angular.copy(selectedGr);
	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {

		if (formData.$valid) {

			let request = {
				his:
					{
						typ: 'NonBillable Gr',
						by: vm.gr.created_by_full_name,
						at: vm.date,
						rmk: vm.remark,
					},
				_id: vm.gr._id,
			};
			if (vm.gr.isNonBillable) {
				request.isNonBillable = false;
			} else {
				request.isNonBillable = true;
			}
			tripServices.updateNonBillGr(request, success, failure);

			function success(res) {
				var msg = res.data.message;
				swal('Update', msg, 'success');
				$uibModalInstance.close(res);
			}

			function failure(res) {
				var msg = res.data.message;
				growlService.growl(msg, 'danger', 2);
				$uibModalInstance.dismiss(res);
			}
		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}

}

materialAdmin.controller('myGRdetailController', function ($rootScope, $modal, $scope, $uibModal, accountingService, $state, $localStorage, tripServices, billsService, DateUtils, Vehicle, Routes, bookingServices, vendorCourierService, Driver, branchService, CustomerRateChartService, vendorFuelService, growlService, URL) {

	$scope.accountingAvailable = (
		$localStorage.ft_data
		&& $localStorage.ft_data.configs
		&& $localStorage.ft_data.configs.master
		&& $localStorage.ft_data.configs.master.showAccount
	) || false;

	if ($rootScope.selectedGR) {
		$localStorage.grACKdata = $rootScope.selectedGR;
	} else if ($localStorage.grACKdata) {
		$rootScope.selectedGR = $localStorage.grACKdata;
	}
	$scope.selectedGRInfo = $rootScope.selectedGR;

	function getIndex(o) {
		return o.status === 'GR Assigned';
	}

	$scope.selectedGRInfo.grDoneBy = $scope.selectedGRInfo.statuses.find(getIndex);

	if (!($scope.selectedGRInfo.acknowledge && $scope.selectedGRInfo.acknowledge.via)) {
		$scope.selectedGRInfo.acknowledge = $scope.selectedGRInfo.acknowledge || {};
		$scope.selectedGRInfo.acknowledge.via = {};
	}

	if (typeof $scope.selectedGRInfo.isGrBillable === 'undefined')
		$scope.selectedGRInfo.isGrBillable = true;

	//********* get trip expense ********//
	$scope.getExpenses = function () {
		function successEx(res) {
			if (res && res.data && (res.data.status === 'OK')) {
				$scope.objExp = {};
				$scope.objExp.aTripExpense = res.data.data;
			}
		}

		function failureEx(res) {
		}

		tripServices.getExpenseByTripId({trip_id: $scope.selectedGRInfo.trip._id}, successEx, failureEx);
	};

	//******edit GrAck******//
	$scope.modeGrAck = function (mode) {
		if (mode == 'Edit') {
			$state.go('booking_manage.editGrAckDetails', {data: $scope.selectedGRInfo});
		}
	};

	//*********** get trip expense end ****//

	$scope.getExpenses();
	$scope.selectedGRInfo.receiving_date = $scope.selectedGRInfo.receiving_date ? new Date($scope.selectedGRInfo.receiving_date) : new Date();
	if ($scope.selectedGRInfo.isMarketVehicle === false) {
		$scope.selectedGRInfo.type_of_gr = 'Manual';
	} else {
		$scope.selectedGRInfo.type_of_gr = 'Market';
	}

	//********* add more expense **********
	$scope.aDtype = ['Trip Creation', 'Gr Charges', 'Loading Charges', 'Unloading Charges', 'Other Charges', 'Chalan', 'Driver Cash', 'Diesel', 'Extra Diesel', 'Toll Tax', 'Vendor A/C Pay', 'Vendor Cash', 'Vendor Cheque', 'Vendor Penalty', 'Vendor Damage', 'Vendor Detention', 'Vendor Chalan', 'Vendor TDS Deduct'];
	$scope.diesel_info = {};
	$scope.objDiesel = {};

	$scope.$watchGroup(['diesel_info.rate', 'diesel_info.litre', 'diesel_info.amount'], function (newValues, oldValues, scope) {
		// newValues array contains the current values of the watch expressions
		if ($scope.diesel_info) {
			if ($scope.diesel_info.rate && $scope.diesel_info.litre) {
				$scope.diesel_info.amount = parseFloat($scope.diesel_info.rate * $scope.diesel_info.litre);
				$scope.objDiesel.amount = $scope.diesel_info.amount;
			} else {
				$scope.diesel_info.amount = null;
			}
		}
	});

	$scope.changeAmount = function () {
		if ($scope.selectedGRInfo.vendorDeal.diesel.quantity && $scope.selectedGRInfo.vendorDeal.diesel.rate) {
			$scope.selectedGRInfo.vendorDeal.diesel.amount = $scope.selectedGRInfo.vendorDeal.diesel.quantity * $scope.selectedGRInfo.vendorDeal.diesel.rate;
		} else {
			$scope.selectedGRInfo.vendorDeal.diesel.amount = 0;
		}
	};

	$scope.validateAmount = function (amt) {
		if ($scope.objDiesel.type === 'Driver Cash') {
			if ($scope.selectedGRInfo.trip.vendorDeal && $scope.selectedGRInfo.trip.vendorDeal.driver_cash) {
				if (amt > $scope.selectedGRInfo.trip.vendorDeal.driver_cash) {
					swal('warning', 'Please enter less then or equal to vendor driver cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedGRInfo.trip.route && $scope.selectedGRInfo.trip.route.rates && $scope.selectedGRInfo.trip.route.rates.allot && $scope.selectedGRInfo.trip.route.rates.allot.cash) {
				if (amt > $scope.selectedGRInfo.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		} else if ($scope.objDiesel.type === 'Diesel') {
			if ($scope.selectedGRInfo.trip.vendorDeal && $scope.selectedGRInfo.trip.vendorDeal.diesel && $scope.selectedGRInfo.trip.vendorDeal.diesel.amount) {
				if (amt > $scope.selectedGRInfo.trip.vendorDeal.diesel.amount) {
					swal('warning', 'Please enter less then or equal to vendor diesel cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedGRInfo.trip.route && $scope.selectedGRInfo.trip.route.rates && $scope.selectedGRInfo.trip.route.rates.allot && $scope.selectedGRInfo.trip.route.rates.allot.cash) {
				if (amt > $scope.selectedGRInfo.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		} else if ($scope.objDiesel.type === 'Toll Tax') {
			if ($scope.selectedGRInfo.trip.vendorDeal && $scope.selectedGRInfo.trip.vendorDeal.toll_tax) {
				if (amt > $scope.selectedGRInfo.trip.vendorDeal.toll_tax) {
					swal('warning', 'Please enter less then or equal to vendor toll tax cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedGRInfo.trip.route && $scope.selectedGRInfo.trip.route.rates && $scope.selectedGRInfo.trip.route.rates.allot && $scope.selectedGRInfo.trip.route.rates.allot.cash) {
				if (amt > $scope.selectedGRInfo.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		}
	};

	function getAdvancePayments() {
		tripServices.getAdvancePayments($scope.selectedGRInfo._id, res => {
			$scope.advancePayments = res.data.data.advance;
		}, (err) => {
			console.log(err);
		});
	}

	getAdvancePayments();

	function getRouteDetails() {
		CustomerRateChartService.get($scope.selectedGRInfo._id, res => {
			$scope.aRouteData = res.data.data.advance;
		}, (err) => {
			console.log(err);
		});
	}

	getRouteDetails();

	(function () {
		function fuelSucc(res) {
			if (res.data.data) {
				$scope.aFuelVendor = res.data.data;
			}
		}

		vendorFuelService.getAllFuelVendors({}, fuelSucc);
	})();

	$scope.fuelFunc = function (item) {
		function successGetStation(response) {
			if (response && response.data) {
				$scope.aFuelStations = response.data.data;
			}
		}

		function failGetStation(res) {

		}

		vendorFuelService.GetFuelStationAll(item.vendorId, successGetStation, failGetStation);
	};

	$scope.fuelStationFunc = function (item) {
		if (item.fuel_price) {
			$scope.diesel_info.rate = item.fuel_price;
		}
	};

	$scope.typeChange = function (type) {
		if (type === 'Diesel') {
			$scope.objDiesel.paidToVendor = true;
		} else {
			$scope.objDiesel.paidToVendor = false;
		}
		$scope.diesel_info.litre = 0;
		$scope.diesel_info.amount = 0;
		$scope.objDiesel.amount = 0;
	};

	$scope.addExpenseMore = function () {
		function success(res) {
			if (res && res.data && (res.data.status === 'OK')) {
				$scope.getExpenses();
				$scope.objDiesel = null;
				//$uibModalInstance.close(res);
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			$uibModalInstance.dismiss(res);
		}

		var oSend = {};
		//oSend.banking_detail = $scope.banking_detail;
		oSend = $scope.objDiesel;
		oSend.trip_no = $scope.selectedGRInfo.trip.trip_no;
		oSend.trip = $scope.selectedGRInfo.trip._id;
		oSend.diesel_info = $scope.diesel_info;

		tripServices.addExpenseOnDiesel(oSend, success, failure);

	};

	$scope.upsertGrAck = function (selectedGrAck) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myGRacknowledge/grAckUpsert.html',
			controller: 'grAckUpsertController',
			resolve: {
				'selectedGrAck': function () {
					return selectedGrAck;
				}
			}
		});

		modalInstance.result.then(function (response) {

			$scope.selectedGRInfo = {
				...$scope.selectedGRInfo,
				acknowledge: response.data.acknowledge,
				pod: response.data.pod,
				eWayBills: response.data.eWayBills,
				invoices: response.data.invoices,
				charges: response.data.charges,
				isGrBillable: response.data.isGrBillable,
				payment_type: response.data.payment_type,
				payment_basis: response.data.payment_basis,
				rate: response.data.rate,
				// weight_per_unit: response.data.weight_per_unit,
				// total_no_of_units: response.data.total_no_of_units,
				// loadRefNumber: response.data.loadRefNumber,
				// invoiceNumber: response.data.invoiceNumber,
				// invoiceDate: response.data.invoiceDate,
			};

			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	$scope.uploadDocs = function () {
		var gr = $scope.selectedGRInfo;
		var aAllowedFiles = ['GR', 'POD Front Copy', 'POD Back Copy', 'Other'];
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'TripGr',
					scopeModel: gr,
					scopeModelId: gr._id,
					uploadText: "Upload GR Documents",
					aAllowedFiles: aAllowedFiles,
					uploadFunction: Vehicle.uploadDocs
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	};


	$scope.previewBuilty = function () {
		var gr = $scope.selectedGRInfo;
		if (!Array.isArray(gr.documents) || gr.documents.length < 1) {
			growlService.growl("No documents to preview", "warning");
			return;
		}
		var documents = gr.documents.map(curr => ({
			...curr,
			url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		}));
		var modalInstance = $uibModal.open({
			templateUrl: 'views/carouselPopup.html',
			controller: 'carouselCtrl',
			resolve: {
				documents: function () {
					return documents;
				}
			}
		});
	};
	//********* add more expense end **********

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;

	//************* New Date Picker for multiple date selection in single form **************
	(function () {

		var oFilter = {
			all: true
		}; // filter to send
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMasterAll = response.data.data;
		}
	})();

	(function () {

		var oFilter = {
			all: true,
			group: ['Transaction', 'Managers']
		}; // filter to send
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMasterOfMoney = response.data.data;
		}
	})();

	$scope.setUnsetAccountMasterVendor = function (type) {

		if (type.toLowerCase().indexOf('vendor') !== -1) {
			try {
				$scope.aAccountMasterOfVendor = [$scope.selectedGRInfo.trip.vendor.account] || [];
				$scope.objDiesel.account_data.to = $scope.selectedGRInfo.trip.vendor.account;
			} catch (e) {
				$scope.aAccountMasterOfVendor = [];
			}
		} else {
			$scope.aAccountMasterOfVendor = [];
			$scope.objDiesel.account_data.to = undefined;
		}

	};

	$scope.gr = false;
	$scope.expense = false;
	$scope.invoice = false;
	$scope.changeGr = function () {
		$scope.gr = true;
	};

	$scope.changeExpense = function () {
		$scope.expense = true;
	};
	$scope.changeBill = function () {
		$scope.invoice = true;
	};
	$scope.editModeOff = true;
	$scope.editOn = function () {
		if ($scope.editModeOff === true) {
			$scope.editModeOff = false;
			$scope.changeGr();
			$scope.selectedGRInfo.receiving_person = ($scope.selectedGRInfo.receiving_person) ? $scope.selectedGRInfo.receiving_person : ($localStorage.ft_data && $localStorage.ft_data.userLoggedIn) ? $localStorage.ft_data.userLoggedIn.full_name : '';
			//$scope.selectedGRInfo.receiving_date = ($scope.selectedGRInfo.receiving_date)?$scope.selectedGRInfo.receiving_date:new Date();
			//$scope.selectedGRInfo.driver_name = $scope.selectedGRInfo.driver_name.name;
		} else {
			$scope.editModeOff = true;
			$scope.gr = false;
			$scope.expense = false;
			$scope.invoice = false;
			//$scope.selectedGRInfo.receiving_person = ($scope.selectedGRInfo.receiving_person)?$scope.selectedGRInfo.receiving_person:($localStorage.ft_data && $localStorage.ft_data.userLoggedIn)?$localStorage.ft_data.userLoggedIn.full_name:"";
			//$scope.selectedGRInfo.receiving_date = ($scope.selectedGRInfo.receiving_date)?$scope.selectedGRInfo.receiving_date:new Date();
		}
	};
	$scope.updateData = function () {
		function succUp(res) {
			if (res && res.data && (res.data.success === 'OK')) {
				$scope.editModeOff = true;
				$scope.gr = false;
				var msg = res.data.message;
				swal('Save', msg, 'success');
				//$scope.selectedGRInfo.driver_name = $scope.selectedGRInfo.driver_name.name;
				//$state.go('masters.grMaster');
			}
		}

		function failUp(res) {
			//console.log(JSON.stringify(res));
		}

		var updataGrAckdt = {};
		updataGrAckdt._id = $scope.selectedGRInfo._id;
		if ($scope.gr === true) {
			updataGrAckdt.acknowledge = $scope.selectedGRInfo.acknowledge;
			updataGrAckdt.acknowledge.status = true;
		}

		tripServices.updateGRack(updataGrAckdt, succUp, failUp);
	};

	$scope.aCourier = [];
	$scope.aCourierOfc = [];
	$scope.aDriver = [];
	//$scope.show_me = true;
	$scope.aDispatched_by = ['Driver', 'Courier', 'By Hand'];

	(function () {
		function successBranch(res) {
			if (res.data) {
				$scope.aBranch = res.data;
			}
		}

		branchService.getBranches({}, successBranch);
	})();

	(function () {
		function successCourier(res) {
			if (res.data) {
				$scope.aCourier = res.data;
			}
		}

		vendorCourierService.getVendorCouriers({}, successCourier);
	})();
	(function () {
		function successDriver(res) {
			if (res.data.data) {
				$scope.aDriver = res.data.data;
				for (var d = 0; d < $scope.aDriver.length; d++) {
					if ($scope.aDriver[d].driver_name === $scope.selectedGRInfo.driver_name) {
						$scope.selectedGRInfo.driver_name = $scope.aDriver[d].driver_name;
					}
				}
			}
		}

		Driver.getAll(successDriver);
	})();

	function success(res) {
		if (res && res.data && (res.data.status === 'OK')) {
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	$scope.CourierFunc = function (item) {
		function successGetOffice(response) {
			if (response && response.data) {
				$scope.aCourierOfc = response.data;
			}
		}

		function failGetOffice(res) {

		}

		if (item._id) {
			oFilter = {
				courier_vendor_id: item._id
			};
			vendorCourierService.GetCourierOfficeAll(oFilter, successGetOffice, failGetOffice);
		}

	};

	$scope.dispatch = function (v) {
		if (v === 'Driver') {
			$scope.show_me = false;
		} else {
			$scope.show_me = true;
		}
	};

	$scope.getIndex = function () {

	};

	// $scope.grAcknowledgement = function() {
	// 	$scope.oTrip = $scope.selectedGRInfo;
	// 	$scope.oTrip.editMode = true;
	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/myGR/myGRpopUp.html',
	// 		controller: 'myGRPopUpCtrl',
	// 		resolve: {
	// 			thatTrip: function() {
	// 				return $scope.oTrip;
	// 			},
	// 			'formType': function(){
	// 				return 'ackGr';
	// 			}
	// 		}
	// 	});
	//
	// 	modalInstance.result.then(function() {
	// 		$state.reload();
	// 	}, function(data) {
	// 		if(data != 'cancel') {
	// 			swal('Oops!', data.data.message, 'error');
	// 		}
	// 	});
	// };

	$scope.takeAdvancePayment = function (oGr) {
		$uibModal.open({
			templateUrl: 'views/grMaster/advancePaymentGR.html',
			controller: 'grAdvancePaymentCtrller',
			resolve: {
				selectedTripGr: () => oGr
			}
		});
	};

	$scope.printBuilty = function () {
		//alert("Functioning remaining");
		if ($scope.selectedGRInfo && $scope.selectedGRInfo) {
			var oFilter = {_id: $scope.selectedGRInfo._id};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: 'builtyRendorCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
		;
	};

	$scope.grDetailedView = function () {
		$scope.oTrip = $scope.selectedGRInfo;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/myGRDetailpopUp.html',
			controller: 'myGRDetailPopUpCtrl',
			resolve: {
				thatTrip: function () {
					return $scope.oTrip;
				}
			}
		});
	};

	$scope.showHistory = function (oTrip) {
		$uibModal.open({
			templateUrl: 'views/myGR/pendingGrHistoryPopup.html',
			controller: 'pendingGrHistoryPopupCtrl',
			resolve: {
				thatTrip: function () {
					return oTrip;
				}
			}
		});
	};
});

materialAdmin.controller('addPaymentvendorCtrl', function ($rootScope, $scope, $localStorage, $uibModalInstance, tripServices, $interval, thatSVP, Vendor) {
	$scope.heading_value = 'Vendor Payment';
	$scope.selectedvendorPayment = angular.copy(thatSVP);
	$scope.expenseOption = {};
	$scope.statusSet = ['Paid', 'Unpaid'];
	$scope.other = false;
	$scope.aKey = ['Advance', 'Balance', 'Part', 'Other'];
	$scope.expenseOption.date = new Date();
	$scope.oData = {};
	$scope.modePayment = ['Cash', 'Internet Banking', 'Cheque'];
	$scope.modeshow = false;
	$scope.statusMode = false;
	$scope.aBank = [];
	$scope.bankSelect = function (o) {
		$scope.expenseOption.banking_detail = o;
	};

	//******************************
	function successVendor(res) {
		if (res.data && res.data.data && res.data.data[0].banking_details) {
			$scope.aBank = res.data.data[0].banking_details;
		}
	}

	(function () {
		if (thatSVP.trip_expenses && thatSVP.trip_expenses.vendor) {
			Vendor.getAllVendorById({_id: thatSVP.trip_expenses.vendor}, successVendor);
		}
	})();

	//******************************
	$scope.modeFunction = function () {
		if ($scope.expenseOption.mode == 'Cash') {
			$scope.modeshow = false;
		} else {
			$scope.modeshow = true;
		}
	};
	$scope.statusChange = function () {
		if ($scope.expenseOption.status == 'Paid') {
			$scope.statusMode = true;
		} else {
			$scope.statusMode = false;
		}
	};
	$scope.keyChange = function () {
		if ($scope.expenseOption.key == 'Other') {
			$scope.other = true;
		} else {
			$scope.other = false;
		}
	};

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	if (!thatSVP) {
		var bUrl = '#!/booking_manage/grAcknowledgeDetails';
		$rootScope.redirect(bUrl);
	}

	var UserDATA = $localStorage.ft_data.userLoggedIn;
	if (UserDATA && UserDATA.full_name) {
		$scope.expenseOption.person = UserDATA.full_name;
	}

	function suc(data) {
		var msg = data.data.message;
		$scope.other = false;
		$scope.oData = {};
		swal('Updated', msg, 'success');
		$scope.closeModal();
	};

	function failure(res) {
		console.log('fail: ', res);
		var msg = res.data.error_message;
		swal('', msg, 'error');
		$scope.closeModal();
		//swal("Some error with booking creation","","failure");
	}

	$scope.addExpenseInfo = function (data) {
		//console.log(expenseOption);
		var expenseOption = angular.copy(data);
		if (expenseOption.key == 'Other') {
			expenseOption.key = $scope.oData.myKey;
		}
		if (thatSVP && thatSVP.trip_expenses._id) {
			$rootScope.vendorPaymentDataID = thatSVP.trip_expenses._id;
			//$scope.payment = thatSVP.payment;
		}
		if (!thatSVP.trip_expenses.payment) {
			thatSVP.trip_expenses.payment = [];
		}
		if (thatSVP) {
			thatSVP.trip_expenses.payment.push(expenseOption);
			var totalPaid = 0;
			for (i = 0; i < thatSVP.trip_expenses.payment.length; i++) {
				totalPaid = totalPaid + (thatSVP.trip_expenses.payment[i].amount || 0);
			}
		}

		if (totalPaid && totalPaid <= thatSVP.trip_expenses.total_expense) {
			$scope.data = thatSVP.trip_expenses;
			if ($rootScope.vendorPaymentDataID) {
				tripServices.updateTripExpPay($scope.data, suc, failure);
			}
		} else {
			if (thatSVP && thatSVP.trip_expenses.payment && thatSVP.trip_expenses.payment.length > 0) {
				thatSVP.trip_expenses.payment.pop(expenseOption);
			}
			var totalPaid = 0;
			$scope.dmsg = '';
			$scope.create = true;
			$scope.dmsg = 'Total amount should be less or equal to Total Expenses';
			setTimeout(function () {
				if ($scope.create) {
					$scope.$apply(function () {
						$scope.create = false;
					});
				}
			}, 7000);
		}
	};
});
materialAdmin.controller('addPaymentCustomerCtrl', function ($rootScope, $scope, $localStorage, $uibModalInstance, tripServices, $interval, thatSCP) {
	$scope.selectedvendorPayment = angular.copy(thatSCP);
	$scope.heading_value = 'Customer Payment';
	$scope.expenseOption = {};
	$scope.statusSet = ['Paid', 'Unpaid'];
	$scope.payment = [];
	$scope.expenseOption.date = new Date();
	$scope.other = false;
	$scope.aKey = ['Advance', 'Balance', 'Part', 'Other'];
	$scope.oData = {};
	$scope.modePayment = ['Cash', 'Internet Banking', 'Cheque'];
	$scope.modeshow = false;
	$scope.statusMode = false;
	$scope.aBank = [];
	$scope.modeFunction = function () {
		if ($scope.expenseOption.mode == 'Cash') {
			$scope.modeshow = false;
		} else {
			$scope.modeshow = true;
		}
	};
	$scope.statusChange = function () {
		if ($scope.expenseOption.status == 'Paid') {
			$scope.statusMode = true;
		} else {
			$scope.statusMode = false;
		}
	};
	$scope.keyChange = function () {
		if ($scope.expenseOption.key == 'Other') {
			$scope.other = true;
		} else {
			$scope.other = false;
		}
	};

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	if (!thatSCP) {
		var bUrl = '#!/billing/customerPayment';
		$rootScope.redirect(bUrl);
	}

	var UserDATA = $localStorage.ft_data.userLoggedIn;
	if (UserDATA && UserDATA.full_name) {
		$scope.expenseOption.person = UserDATA.full_name;
	}

	function suc(data) {
		var msg = data.data.message;
		$scope.other = false;
		$scope.oData = {};
		swal('Customer Payment Updated', msg, 'success');
		$scope.closeModal();
	};

	function failure(res) {
		console.log('fail: ', res);
		var msg = res.data.error_message;
		swal('', msg, 'error');
		$scope.closeModal();
		//swal("Some error with booking creation","","failure");
	}

	$scope.addExpenseInfo = function (data) {
		var expenseOption = angular.copy(data);
		if (expenseOption.key == 'Other') {
			expenseOption.key = $scope.oData.myKey;
		}
		if (thatSCP && thatSCP.trip_bills._id) {
			$rootScope.billDataID = thatSCP.trip_bills._id;
			//$scope.payment = thatSCP.payment;
		}
		if (!thatSCP.trip_bills.payment) {
			thatSCP.trip_bills.payment = [];
		}
		if (thatSCP) {
			thatSCP.trip_bills.payment.push(expenseOption);
			var totalPaid = 0;
			for (i = 0; i < thatSCP.trip_bills.payment.length; i++) {
				totalPaid = totalPaid + (thatSCP.trip_bills.payment[i].amount || 0);
			}
		}

		$scope.data = thatSCP.trip_bills;
		if ($rootScope.billDataID) {
			tripServices.custPayBil($scope.data, suc, failure);
		}

		/*if(totalPaid && totalPaid <= thatSCP.trip_bills.total_expenses){
      $scope.data = thatSCP.trip_bills;
      if($rootScope.billDataID){
        tripServices.custPayBil($scope.data, suc, failure);
      }
    } else{
        if(thatSCP && thatSCP.trip_bills.payment && thatSCP.trip_bills.payment.length>0){
        thatSCP.trip_bills.payment.pop(expenseOption);
        }
        var totalPaid = 0;
        $scope.dmsg = '';
        $scope.createerror = true;
        $scope.dmsg = 'Total amount should be less or equal to Total Expenses';
        setTimeout(function(){
        if($scope.createerror){
          $scope.$apply(function() {
          $scope.createerror = false;
          });
        }
        }, 7000);
    }*/
	};
});

/*
materialAdmin.controller("myGRchangeDetails", function($rootScope, $scope, constantshowAccounts, $uibModalInstance, thatTrip, bookingServices, tripServices) {
    $scope.trip = angular.copy(thatTrip);

	$scope.l_tare_w_ReadOnly = $scope.trip.l_tare_w ? true : false;
	$scope.l_gross_w_ReadOnly = $scope.trip.l_gross_w ? true : false;
	$scope.ul_tare_w_ReadOnly = $scope.trip.ul_tare_w ? true : false;
	$scope.ul_gross_w_ReadOnly = $scope.trip.ul_gross_w ? true : false;

    $scope.exportType = ($scope.trip.booking_info[0].booking_type) && (($scope.trip.booking_info[0].booking_type == constants.bookingTypes.export_container) || ($scope.trip.booking_info[0].booking_type == constants.bookingTypes.export_cargo));
    $scope.importType = ($scope.trip.booking_info[0].booking_type) && (($scope.trip.booking_info[0].booking_type == constants.bookingTypes.import_container) || ($scope.trip.booking_info[0].booking_type == constants.bookingTypes.import_cargo) || ($scope.trip.booking_info[0].booking_type == constants.bookingTypes.empty_container));
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    function getCustomerByType(aCustomerType, success) {
        var cType = JSON.stringify(aCustomerType); //Array is for Multiple Type
        var details = {
            type: cType,
            all: true,
            status: "Active"
        }
        bookingServices.getAllCustomersforDetails(details, success);
    }
    getCustomerByType(['Consignor'], function(data) {
        $scope.aConsigner = data.data;
        onEditBindingConsignor();
    });
    getCustomerByType(['Consignee'], function(data) {
        $scope.aConsignee = data.data;
        onEditBindingConsignee();
    });

    //!********************************-------------------**********************
    function onEditBindingConsignor() {
        if ($scope.trip.consigner_id) {
            for (var i = 0; i < $scope.aConsigner.length; i++) {
                if ($scope.trip.consigner_id == $scope.aConsigner[i]._id) {
                    $scope.trip.consigner = $scope.aConsigner[i];
                }
            }
        }
    }
    //-------------------------------------------------------------------------
    //!********************************-------------------**********************
    function onEditBindingConsignee() {
        if ($scope.trip.consignee_id) {
            for (var i = 0; i < $scope.aConsignee.length; i++) {
                if ($scope.trip.consignee_id == $scope.aConsignee[i]._id) {
                    $scope.trip.consignee = $scope.aConsignee[i];
                }
            }
        }
    }
    //-------------------------------------------------------------------------

    //!*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();
    $scope.toggleMin = function() {
        var date = new Date();
        var yesterday = date - 1000 * 60 * 60 * 24 * 2; // current date's milliseconds - 1,000 ms * 60 s * 60 mins * 24 hrs * (# of days beyond one to go back)
        $scope.minDate = new Date(yesterday);
    };
    $scope.toggleMin();
    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    //!************* New Date Picker for multiple date selection in single form ******************

    function success(res) {
        if (res && res.data && (res.data.status == "OK")) {
            //$scope.trip = res.data.data;
            $uibModalInstance.close(res);
        } else {
            $uibModalInstance.dismiss(res);
        }
    }

    function failure(res) {
        $uibModalInstance.dismiss(res);
    }

    $scope.updateGRDetails = function() {
        var oSend = angular.copy($scope.trip);
        if (oSend.consignee) {
            oSend.consignee_id = oSend.consignee._id;
            oSend.consignee_name = oSend.consignee.name;
        }
        if (oSend.consigner) {
            oSend.consigner_id = oSend.consigner._id;
            oSend.consigner_name = oSend.consigner.name;
        }

		if($rootScope.configs && $rootScope.configs['GR'] && $rootScope.configs['GR']['Add'] && $rootScope.configs['GR']['Add']['Show field']) {
			if ($rootScope.configs['GR']['Add']['Show field']['Loading Tare Weight'] && $scope.l_tare_w_ReadOnly)
				oSend.l_tare_w = $scope.trip.l_tare_w;

			if ($rootScope.configs['GR']['Add']['Show field']['Loading Gross Weight'] && $scope.l_gross_w_ReadOnly)
				oSend.l_gross_w = $scope.trip.l_gross_w;

			if ($rootScope.configs['GR']['Add']['Show field']['Loading Net Weight'] && ($scope.l_tare_w_ReadOnly || $scope.l_gross_w_ReadOnly))
				oSend.l_net_w = $scope.trip.l_net_w;

			if ($rootScope.configs['GR']['Add']['Show field']['Unloading Gross Weight'] && $scope.ul_gross_w_ReadOnly)
				oSend.ul_gross_w = $scope.trip.ul_gross_w;

			if ($rootScope.configs['GR']['Add']['Show field']['Unloading Tare Weight'] && $scope.ul_tare_w_ReadOnly)
				oSend.ul_tare_w = $scope.trip.ul_tare_w;

			if ($rootScope.configs['GR']['Add']['Show field']['Unloading Net Weight'] && ($scope.ul_gross_w_ReadOnly || $scope.ul_tare_w_ReadOnly))
				oSend.ul_net_w = $scope.trip.ul_net_w;
		}

        tripServices.updateGRDetails(oSend, success, failure);
    }

});
*/

materialAdmin.controller('myGRDetailPopUpCtrl', function ($rootScope, $scope, $uibModalInstance, thatTrip) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.gr = angular.copy(thatTrip);
});

materialAdmin.controller('builtyRendorCtrl', function ($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService) {
	if(thatTrip && thatTrip.item && thatTrip.item.customer && thatTrip.item.customer.grTemplate && thatTrip.item.customer.grTemplate.length > 0){
		$scope.aTemplate=thatTrip.item.customer.grTemplate||[];
	}else{
		$scope.aTemplate = clientConfig.getFeature('GR', 'GR Templates') ? clientConfig.getFeature('GR', 'GR Templates') : [];
	}


	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.createBuilty(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR($scope.aTemplate[0].key);
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR($scope.aTemplate[0].key);
	}

	$scope.printDiv = function (elem) {
		var contents = document.getElementById(elem).innerHTML;
		var frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('<html><head><title></title>');
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(contents);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function () {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
	};
});

materialAdmin.controller('transportSlipRenderCtrl', function ($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService) {
	$scope.aTemplate = clientConfig.getFeature('GR', 'GR Templates') ? clientConfig.getFeature('GR', 'GR Templates') : [];
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.getTransportSlip(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR();
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR();
	}
});

materialAdmin.controller('tdsRenderCtrl', function ($rootScope, $scope, thatTrip, clientConfig, $uibModalInstance, tripServices) {
	function parseOaddressToString(address) {
		var parsedAddress = '';
		if (address && address.line1) {
			parsedAddress += (address.line1 + ', ');
		}
		if (address && address.line1) {
			parsedAddress += (address.line2 + ', ');
		}
		if (address && address.city) {
			if (address.district == address.city) {
				delete address.district;
			}
			parsedAddress += (address.city + ', ');
		}
		if (address && address.district) {
			parsedAddress += (address.district + ', ');
		}
		if (address && address.state) {
			parsedAddress += (address.state + ', ');
		}
		if (address && address.pincode) {
			parsedAddress += (address.pincode + ', ');
		}
		if (address && address.country) {
			parsedAddress += address.country;
		}
		return parsedAddress;
	};
	$scope.aTemplate = [];
	tripServices.getTDS({
		customerName: thatTrip.booking.customer.name,
		address: parseOaddressToString(thatTrip.booking.customer.address)
	}, function (data) {
		$scope.html = data.data;
	});
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

materialAdmin.controller('tdsSlipRenderCtrl', function ($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService) {
	$scope.aTemplate = clientConfig.getFeature('GR', 'GR Templates') ? clientConfig.getFeature('GR', 'GR Templates') : [];
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.getTdsSlip(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR();
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR();
	}
});

materialAdmin.controller('myGRmoisturepopUpCtrl', function ($scope, $uibModalInstance, tripServices, aGR) {
	var aGR = aGR;

	$scope.closeModal = function () {
		$uibModalInstance.dismiss();
	};

	$scope.addMoisture = function (form) {
		$scope.moistureBtnEnabled = true;
		tripServices.addMoisture(
			{
				aGR: aGR,
				estimated_moisture: $scope.estimated_moisture,
				actual_moisture: $scope.actual_moisture,
				internal_rate: $scope.internal_rate
			},
			function (data) {
				var msg = data.data.message.map(item => item.message).join('\n');
				swal('', msg, 'success');
				$uibModalInstance.close();
			},
			function (err) {
				$scope.moistureBtnEnabled = false;
				$scope.estimated_moisture = null;
				$scope.actual_moisture = null;
				$scope.internal_rate = null;
			}
		);
	};
});

materialAdmin.controller('myGRPopUpCtrl', function (
	$rootScope,
	$scope,
	$uibModalInstance,
	$localStorage,
	clientConfig,
	consignorConsigneeService,
	customer,
	DatePicker,
	thatTrip,
	formType,
	formValidationgrowlService,
	branchService,
	tripServices) {

	$scope.$aBranch = $localStorage.ft_data.userLoggedIn.branch || [];
	$scope.container = {};
	$scope.isValidContainer = false;
	$scope.DatePicker = DatePicker;
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.gr = {};
	$scope.gr.booking = $scope.gr.booking || {};
	$scope.gr = angular.copy(thatTrip);
	$scope.gr.grDate = $scope.gr.grDate || $scope.gr.trip.allocation_date || Date.now();
	$scope.branch = $scope.gr.branch;
	$scope.gr.ownGR = '1';
	$rootScope.client_config = $localStorage.ft_data.client_config;
	$rootScope.configs = $localStorage.ft_data.configs;

	var UserDATA = $localStorage.ft_data.userLoggedIn;
	if (!$scope.gr.charges)
		$scope.gr.charges = {};

	(function init() {

		$scope.showBillingWeight = false;
		$scope.showCharges = false;
		$scope.addGrNumber = true;
		$scope.addGrDate = true;

		switch (formType) {
			case 'addGr':
				$scope.type = 'Add';
				$scope.readonly = false;
				break;
			case 'updateGr':
				$scope.type = 'Update';
				$scope.readonly = false;
				break;
			default:
				$scope.readonly = true;
		}

		$scope.gr.rate = $scope.gr.rate || $scope.gr.booking.rate;
		// $scope.gr.total_no_of_units = (Array.isArray($scope.gr.invoices) && $scope.gr.invoices[0] && $scope.gr.invoices.noOfUnit) || $scope.gr.total_no_of_units || $scope.gr.booking.total_no_of_units;

		$scope.gr.invoices = $scope.gr.invoices || [];
		$scope.gr.invoices[0] = $scope.gr.invoices[0] || {};
		$scope.gr.invoices[0].noOfUnits = $scope.gr.invoices[0] && $scope.gr.invoices[0].noOfUnits || $scope.gr.booking.total_no_of_units;
		$scope.gr.invoices[0].weightPerUnit = $scope.gr.invoices[0] && $scope.gr.invoices[0].weightPerUnit || $scope.gr.booking.weight_per_unit;
		$scope.gr.invoices[0].invoiceDate = $scope.gr.invoices[0] && $scope.gr.invoices[0].invoiceDate || $scope.gr.invoiceDate;
		$scope.gr.invoices[0].loadRefNumber = $scope.gr.invoices[0] && $scope.gr.invoices[0].loadRefNumber || $scope.gr.loadRefNumber;
		$scope.gr.invoices[0].invoiceNo = $scope.gr.invoices[0] && $scope.gr.invoices[0].invoiceNo || $scope.gr.invoiceNumber;

		$scope.gr.payment_type = $scope.gr.payment_type || $scope.gr.booking.payment_type;
		$scope.gr.payment_basis = $scope.gr.payment_basis || $scope.gr.booking.payment_basis;
		$scope.customer = $scope.gr.booking.customer;
		$scope.consignor = $scope.gr.consignor = $scope.gr.consignor || $scope.gr.booking.consigner;
		$scope.consignee = $scope.gr.consignee = $scope.gr.consignee || (Array.isArray($scope.gr.booking.consignee) ? $scope.gr.booking.consignee[0] : $scope.gr.booking.consignee);

		if ($scope.gr.statuses.find(obj => obj.status === 'GR Received')) {
			$scope.showBillingWeight = true;
			$scope.showCharges = true;
		}

		if ($scope.gr.grNumber)
			$scope.addGrNumber = false;

		if ($scope.gr.grDate)
			$scope.addGrDate = false;

	})();

	$scope.generateGR = function () {
		function successGen(res) {
			if (res && res.data && (res.data.status === 'OK')) {
				$scope.gr.grNumber = res.data.data;
			}
		}

		function failureGen(res) {
			console.log(JSON.stringify(res));
		}

		tripServices.generateCentralizedGR({}, successGen, failureGen);
	};

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	//-------------------------------------------------------------------------

	$scope.toggleMin = function () {
		/*var clientTripDateConfig = clientConfig.getFeatureValue("gr", "gr_start_date");
		$scope.maxDate = new Date();
		var aloc_date = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2
		var clientMaxDate = (clientTripDateConfig && clientTripDateConfig.min_hour) ? moment().subtract(clientTripDateConfig.min_hour, "hours")._d : angular.copy(aloc_date);

		if (thatTrip && thatTrip.trip.allocation_date) {
			thatTrip.trip.allocation_date = new Date(thatTrip.trip.allocation_date);
			aloc_date = thatTrip.trip.allocation_date;
		}
		if (aloc_date > clientMaxDate) {
			aloc_date = aloc_date;
		} else {
			aloc_date = clientMaxDate;
		}
		$scope.minDate = new Date(aloc_date);*/

		$scope.maxDate = new Date();
		var grAddPostDate = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2

		var daysBack = $localStorage.ft_data.configs.postGrAssign;
		grAddPostDate.setDate(grAddPostDate.getDate() - daysBack);
		$scope.minDate = new Date(grAddPostDate);

		if (thatTrip && thatTrip.trip.allocation_date) {
			thatTrip.trip.allocation_date = new Date(thatTrip.trip.allocation_date);
			var vehAlocDate = thatTrip.trip.allocation_date;
		}
		if (vehAlocDate > grAddPostDate) {
			$scope.minDate = new Date(vehAlocDate);
		} else {
			$scope.minDate = new Date(grAddPostDate);
		}
	};

	//-------------------------------------------------------------------------
	$scope.toggleMin();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form ******************

	$scope.$watchGroup(['gr.charges.grCharges', 'gr.charges.loading_charges', 'gr.charges.unloading_charges', 'gr.charges.other_charges', 'gr.charges.weightman_charges', 'gr.charges.detention', 'gr.deduction.damage', 'gr.deduction.penalty', 'gr.deduction.shortage'], function (newValues, oldValues, scope) {
		// newValues array contains the current values of the watch expressions
		if ($scope.gr) {
			var ttlFreight = 0,
				rate = 0;
			//ttlFreight = ttlFreight + $scope.gr.booking.freight;
			rate = $scope.gr.booking.rate;
			//$scope.gr.freight = ttlFreight;
			$scope.gr.total = (ttlFreight || 0) + ($scope.gr.charges.grCharges || 0) + ($scope.gr.charges.loading_charges || 0) + ($scope.gr.charges.unloading_charges || 0) + ($scope.gr.charges.other_charges || 0) + ($scope.gr.charges.detention || 0) + ($scope.gr.deduction.damage || 0) + ($scope.gr.deduction.penalty || 0) + ($scope.gr.deduction.shortage || 0);
			$scope.gr.charges.weightman_charges = (($scope.gr.charges.loading_charges || 0) + ($scope.gr.charges.unloading_charges || 0));
		}
	});

	$scope.clearContainer = function () {
		$scope.container.containerNumber = undefined;
		$scope.container.newContainerNumber = undefined;
	};

	$scope.validateContainer = function (containerNumber) {
		return !/^[a-zA-Z]{4}[0-9]{7}$/.test(containerNumber);
	};

	$scope.changeContainerNumber = function (newContainerNumber, oldContainerNumber) {

		if (newContainerNumber === oldContainerNumber) {
			$scope.clearContainer();
			return;
		}

		$scope.gr.container.find(obj => {
			if (obj.number === oldContainerNumber) {
				obj.oldNumber = obj.oldNumber || [];
				obj.oldNumber.push(obj.number);
				obj.number = newContainerNumber;
				$scope.clearContainer();
				return true;
			} else
				return false;
		});
	};

	function success(res) {
		if (res && res.data && (res.data.success === 'OK')) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	function failure(res) {
		$uibModalInstance.dismiss(res);
	}

	$scope.updateGR = function (form) {

		if ($scope.upsertGrForm['GR No.'].$error.pattern) {
			swal('Warning', 'Invalid Gr Number', 'error');
			return;
		}

		// if(form['Actual Moisture'].$invalid) {
		// 	swal('Actual Moisture Value Error', 'Value should be between 5.00 to 15.99', 'error');
		// 	return;
		// }
		// if(form['Estimated Moisture'].$invalid) {
		// 	swal('Estimated Moisture Value Error', 'Value should be between 5.00 to 15.99', 'error');
		// 	return;
		// }

		var oSend = {};
		$scope.gr.branch = $scope.branch;
		oSend = $scope.gr;

		if (typeof oSend.l_net_w !== 'undefined' || typeof oSend.ul_net_w !== 'undefined') {
			if (oSend.l_net_w && oSend.ul_net_w) {
				oSend.weight = oSend.l_net_w < oSend.ul_net_w ? oSend.l_net_w : oSend.ul_net_w;
			} else if (oSend.l_net_w) {
				oSend.weight = oSend.l_net_w;
			} else if (oSend.ul_net_w) {
				oSend.weight = oSend.ul_net_w;
			}
		}

		if (oSend.ownGR === '1') {
			oSend.ownGR = true;
			oSend.gr_type = 'Own';
		} else if (oSend.ownGR === '3') {
			oSend.ownGR = null;
			oSend.centralizedGR = true;
			oSend.gr_type = 'Centralized';
		} else {
			oSend.centralizedGR = null;
			oSend.ownGR = false;
			oSend.gr_type = 'Market';
		}

		delete oSend.statuses;
		if (oSend.editMode) {
			tripServices.updateGRservice(oSend, success, failure);
		} else {
			tripServices.addNewGRservice(oSend, success, failure);
		}

	};

	$scope.changeFreightCount = function () {
		$scope.gr.freight = ($scope.gr.weight || 0) * ($scope.gr.rate || 0);
	};

	$scope.fillNegativeEntry = function (value) {
		if (value) {
			value = '-' + value;
		}
	};

	$scope.getConsignor = function (name) {

		if (name.length < 2)
			return;

		let oFilter = {
			type: 'Consignor',
			all: 'true',
			customer: $scope.customer._id,
			name
		};
		consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.aConsignor = response.data;
		}
	};

	$scope.onConsignorSelect = function ($item, $model, $label) {
		$scope.gr.consignor = $model;
	};

	// Get Consignor/Consignee from backend
	$scope.getConsignee = function (name) {

		if (name.length < 2)
			return;

		let oFilter = {
			type: 'Consignee',
			all: 'true',
			customer: $scope.customer._id,
			name
		};
		consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.aConsignee = response.data;
		}
	};

	$scope.onConsigneeSelect = function ($item, $model, $label) {
		$scope.gr.consignee = $model;
	};

	$scope.getAllCustomers = function (name) {
		if (name.length < 2)
			return;

		function success(data) {
			$scope.aCustomers = data.data;
		}

		var customerFilter = {
			all: true,
			status: "Active",
			name
		};
		customer.getAllcustomers(customerFilter, success);
	}

	$scope.onCustomerSelect = function ($item, $model, $label) {
		$scope.gr.booking.customer = $model;
	};

	(function getBranch() {
		if ($scope.$aBranch.length > 0) {
			$scope.aBranch = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		};
		branchService.getAllBranches(branchFilter, successBranches);

		function successBranches(data) {
			$scope.aBranch = data.data;
		}
	})();

});

materialAdmin.controller('myGRackPopUpCtrl', function ($rootScope, $localStorage, $scope, $uibModalInstance, thatTrip, tripServices, branchService, Driver, vendorCourierService) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.aCourier = [];
	$scope.aCourierOfc = [];
	$scope.aDriver = [];
	$scope.show_me = true;
	$scope.aDispatched_by = ['Courier', 'Driver'];
	$scope.trip = angular.copy(thatTrip);

	//$scope.trip.receiving_person = ($localStorage && $localStorage.ft_data && )?:""

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form ******************
	//$scope.aInfo = [];
	(function () {
		function successBranch(res) {
			if (res.data) {
				$scope.aBranch = res.data;
			}
		}

		branchService.getAllMechanics({}, successBranch);
	})();

	(function () {
		function successCourier(res) {
			if (res.data) {
				$scope.aCourier = res.data;
			}
		}

		vendorCourierService.getVendorCouriers({}, successCourier);
	})();
	(function () {
		function successDriver(res) {
			if (res.data.data) {
				$scope.aDriver = res.data.data;
			}
		}

		Driver.getAll(successDriver);
	})();

	function success(res) {
		if (res && res.data && (res.data.status == 'OK')) {
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	$scope.CourierFunc = function (item) {
		function successGetOffice(response) {
			if (response && response.data) {
				$scope.aCourierOfc = response.data;
			}
		}

		function failGetOffice(res) {

		}

		if (item._id) {
			oFilter = {
				courier_vendor_id: item._id
			};
			vendorCourierService.GetCourierOfficeAll(oFilter, successGetOffice, failGetOffice);
		}

	};

	$scope.DispatchedFunc = function (v) {
		if (v == 'Driver') {
			$scope.show_me = false;
		} else {
			$scope.show_me = true;
		}
	};

	function failure(res) {
		$uibModalInstance.dismiss(res);
	}

	$scope.updateTrip = function () {
		var oSend = {};
		if ($scope.show_me) {
			oSend.courier_name = $scope.trip.courier_name ? $scope.trip.courier_name.name : null;
			oSend.courier_id = $scope.trip.courier_name ? $scope.trip.courier_name._id : null;
			oSend.courier_office = $scope.trip.courier_office ? $scope.trip.courier_office.branch_name : null;
			oSend.courier_office_id = $scope.trip.courier_office ? $scope.trip.courier_office._id : null;
			oSend.courier_date = $scope.trip.courier_date;
		} else {
			oSend.driver_name = $scope.trip.driver_name ? $scope.trip.driver_name.name : null;
			oSend.driver_id = $scope.trip.driver_name ? $scope.trip.driver_name._id : null;
		}
		oSend.trip_id = $scope.trip.trip_id;
		oSend.trip_no = $scope.trip.trip_no;
		oSend.gr_id = $scope.trip.gr_id;
		oSend.status = true;
		oSend.place = $scope.trip.place;
		oSend.branch = $scope.trip.branch ? $scope.trip.branch.name : null;
		oSend.branch_id = $scope.trip.branch ? $scope.trip.branch._id : null;

		oSend.receiving_date = $scope.trip.receiving_date;
		oSend.receiving_person = $scope.trip.receiving_person;
		tripServices.updateGRAck(oSend, success, failure);
	};
});

materialAdmin.controller('centralizedGrMasterCtrl', function ($rootScope, $scope, $modal, $uibModal, $state, branchService, tripServices, Pagination) {
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	$scope.aStatus = ['Active', 'Inactive'];
	$scope.pageChanged = function () {
		$scope.getAllMasterGr(true);
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {isCentralized: true};
		if ($scope.statusSearch) {
			if ($scope.statusSearch == 'Active') {
				myFilter.isActive = true;
			} else {
				myFilter.isActive = false;
			}
			//myFilter.status = $scope.statusSearch;
		}
		return myFilter;
	};

	$scope.getAllMasterGr = function (isPagination) {

		function allMasterGrSuccess(res) {
			if (res.data.status == 'OK') {
				$scope.aAllGrMasterList = res.data.data;
				$scope.total_pages = res.data.no_of_pages;
				$scope.totalItems = 10 * res.data.no_of_pages;
			} else {
				alert('No Data !!!!!');
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		tripServices.getAllMasterGRService(oFilter, allMasterGrSuccess);
	};
	$scope.getAllMasterGr();

	$scope.editGrM = function (sGR) {
		$rootScope.selectedGR = sGR;
		$state.go('masters.updateGrMaster');
	};
});

materialAdmin.controller('coverNoteController', coverNoteController);
coverNoteController.$inject = [
	'$scope',
	'$uibModal',
	'$state',
	'bookingServices',
	'billingPartyService',
	'customer',
	'DateUtils',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'Vehicle',
	'Vendor',
	'customer'
];

function coverNoteController(
	$scope,
	$uibModal,
	$state,
	bookingServices,
	billingPartyService,
	customer,
	DateUtils,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	Vehicle,
	Vendor,
	customer
) {

	let vm = this;
	vm.columnSetting = {
		allowedColumn: [
			'Vehicle No',
			'Ownership',
			'Gr No',
			'Gr Date',
			'Route',
			'Customer Name',
			'Consignor',
			'Consignee',
			'Route Name',
			'Billing Route',
			'Freight',
			'Total Freight',
			'CGst',
			'SGst',
			'IGst',
			'Total Amount',
			'Creation Date',
		]
	};

	vm.tableHead = [
		{
			'header': 'Vehicle No',
			'bindingKeys': 'trip.vehicle_no',
			'date': false
		},
		{
			'header': 'Ownership',
			'bindingKeys': 'trip.ownerShip',
			'date': false
		},
		{
			'header': 'Gr No',
			'bindingKeys': 'grNumber',
			'date': false
		},
		{
			'header': 'Gr Date',
			'bindingKeys': 'grDate',
			'date': true
		},
		{
			'header': 'Route',
			'bindingKeys': 'route.name'
		},
		{
			'header': 'Customer Name',
			'bindingKeys': 'customer.name'
		},
		{
			'header': 'Consignor',
			'bindingKeys': 'consignor.name'
		},
		{
			'header': 'Consignee',
			'bindingKeys': 'consignee.name'
		},
		{
			'header': 'Route Name',
			'bindingKeys': 'route.name || booking.route.name'
		},
		{
			'header': 'Billing Route',
			'bindingKeys': '(acknowledge.source) + " to "  + (acknowledge.destination)'
		},
		{
			'header': 'Freight',
			'bindingKeys': 'basicFreight'
		},
		{
			'header': 'Total Freight',
			'bindingKeys': 'totalFreight'
		},
		{
			'header': 'CGst',
			'bindingKeys': 'cGST || 0'
		},
		{
			'header': 'SGst',
			'bindingKeys': 'sGST || 0'
		},
		{
			'header': 'IGst',
			'bindingKeys': 'iGST || 0'
		},
		{
			'header': 'Total Amount',
			'bindingKeys': 'totalAmount'
		},
		{
			'header': 'Creation Date',
			'bindingKeys': 'created_at',
			'date': true
		},

	];
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.aCategory = ["Vehicle Hire"];
	vm.onSelect = onSelect;
	vm.getVendorName = getVendorName;
	vm.getCoverNote = getCoverNote;
	vm.makeCoverNote = makeCoverNote;
	vm.generateGr = generateGr;
	vm.getCustomer = getCustomer;
	vm.getBilling = getBilling;

	// INIT functions
	(function init() {
		vm.start_date = new Date();
		vm.end_date = new Date();
		vm.showTable = true;
		vm.aSelectedCover = [];
		vm.oFilter = {};
		vm.selectType = 'index';
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
	})();

	function getCoverNote(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilterObject();

		if (vm.status === "Vehicle Given") {
			tripServices.grsforCoverNote(oFilter, success, fail);
		} else {
			tripServices.coverNotesforGr(oFilter, success, fail);
		}

		function success(res) {
			if (res && res.data) {

				vm.aCoverNote = res.data.data;

				vm.grs = res.data.data[0];

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);

			}
		}

		function fail(res) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				vm.aCustomer = response.data;
			};

			function oFailC(response) {
				//console.log(response);
			}

			customer.getCustomerSearch(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {
			vm.getCoverNote();
		}
	}

	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		function oSucC(response) {
			vm.aBilling = response.data;
		}

		function oFailC(response) {
			console.log(response);
		}

		billingPartyService.getBillingParty({name: viewValue}, oSucC, oFailC);
	}

	function makeCoverNote() {

		tripServices.convertGrsToCovernote({
			lmsId: vm.lmsId,
			grs: vm.grs.map(obj => obj._id)
		}, success, fail);

		function success(res) {
			if (res && res.data) {
				console.log(res.data);
			}
		}

		function fail(res) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function generateGr() {
		tripServices.convertCovernotesToGr({
			lmsId: vm.lmsId,
			grs: vm.grs.map(obj => obj._id)
		}, success, fail);

		function success(res) {
			if (res && res.data) {
				console.log(res.data);
			}
		}

		function fail(res) {
			//$uibModalInstance.dismiss(res);
		}
	}


	function getVendorName(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			Vendor.getName({
				name: viewValue,
				deleted: false
			}, res => vm.aVendor = res.data.data, err => console.log`${err}`);
		}
	}

	var lastFilter;

	function prepareFilterObject() {
		var myFilter = {};
		if (vm.lmsId) {
			myFilter.lmsId = vm.lmsId;
		}
		if (vm.start_date) {
			myFilter.from = vm.start_date;
		}
		if (vm.oFilter.billingParty && vm.oFilter.billingParty._id) {
			myFilter.billingParty = vm.oFilter.billingParty._id;
		}
		if (vm.oFilter.grCustomer && vm.oFilter.grCustomer._id) {
			myFilter.customer = vm.oFilter.grCustomer._id;
		}

		if (vm.end_date) {
			myFilter.to = vm.end_date;
		}

		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 20;

		return myFilter;
	}

	function onSelect($item, $model, $label) {
		getCoverNote();
		vm.selectType = 'multiple';

	}
}

// materialAdmin.controller('pendingGRController', function(
// 	$rootScope,
// 	$scope,
// 	$uibModal,
// 	$state,
// 	Vendor,
// 	tripServices,
// 	billsService,
// 	DatePicker,
// 	DateUtils,
// 	Vehicle,
// 	Routes,
// 	bookingServices,
// 	ReportService,
// 	customer,
// 	Pagination,
// 	stateDataRetain,
// 	URL,
// 	growlService) {
// 	$scope.currentPage = 1;
// 	$scope.maxSize = 5;
// 	$scope.items_per_page = 10;
// 	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
// 	$scope.pageChanged = function() {
// 		$scope.getGRAck(true);
// 	};
//
// 	// $scope.expected_arrival = new Date();
//
// 	(function init() {
//
// 		$scope.$on('stateRefresh', function () {
// 			$scope.getGRAck;
// 		});
//
// 		stateDataRetain.init($scope);
//
// 		if(stateDataRetain.isStateLoaded)
// 			return;
//
// 	})();
//
// 	function prepareFilterObject(isPagination) {
// 		var myFilter = {no_of_docs: $scope.items_per_page, acknowledge_status: false};
// 		if($scope.selected) {
// 			myFilter.all = true;
// 		}
// 		if($scope.trip_no) {
// 			myFilter.trip_query = myFilter.trip_query || {};
// 			myFilter.trip_query.trip_no = $scope.trip_no;
// 		}
// 		if($scope.vehicle_no) {
// 			myFilter.trip_query = myFilter.trip_query ? myFilter.trip_query : {};
// 			myFilter.trip_query.vehicle_no = $scope.vehicle_no.vehicle_reg_no;
// 		}
// 		if($scope.booking_no) {
// 			myFilter.booking_query = myFilter.booking_query || {};
// 			myFilter.booking_query.booking_no = $scope.booking_no;
// 		}
// 		if($scope.boe_no) {
// 			myFilter.boe_no = $scope.boe_no;
// 		}
// 		if($scope.grCustomer && $scope.grCustomer.name) {
// 			myFilter.booking_query = myFilter.booking_query || {};
// 			myFilter.booking_query.customer = $scope.grCustomer._id;
// 		}
// 		if($scope.gr_no) {
// 			myFilter.grNumber = $scope.gr_no;
// 		}
// 		if($scope.route_id) {
// 			myFilter.route_id = $scope.route_id;
// 		}
// 		if($scope.branch) {
// 			myFilter.branch = $scope.branch;
// 		}
// 		if($scope.container_no) {
// 			myFilter.container_no = $scope.container_no;
// 		}
// 		if($scope.start_date) {
// 			myFilter.from = $scope.start_date;
// 		}
// 		if($scope.end_date) {
// 			myFilter.to = $scope.end_date;
// 		}
// 		if($scope.status) {
// 			myFilter.status = $scope.status;
// 		}
// 		if($scope.vendor_id) {
// 			myFilter.trip_query = myFilter.trip_query ? myFilter.trip_query : {};
// 			myFilter.trip_query.vendor = $scope.vendor_id._id;
// 		}
//
// 			myFilter.skip = $scope.currentPage;
// 			myFilter.sort = {
// 				$natural: -1
// 			};
//
// 		if($scope.expected_arrival) {
// 			myFilter.expected_arrival = $scope.expected_arrival
// 		}
//
// 		return myFilter;
// 	}
//
// 	$scope.getGRAck = function(isPagination, download) {
// 		function ack_success(res) {
// 			if(res.data.url) {
// 				var a = document.createElement('a');
// 				a.href = res.data.url;
// 				a.download = res.data.url;
// 				a.target = '_blank';
// 				a.click();
// 			} else if(res.data.data.data) {
// 				$scope.aTrip = res.data.data.data;
// 				$scope.total_pages = res.data.data.pages;
// 				//$scope.totalItems = res.data.count;
// 				$scope.totalItems = $scope.items_per_page * res.data.data.pages;
// 				if(res.data.data.data.length > 0) {
// 					setTimeout(function() {
// 						listItem = $($('.selectItem')[0]);
// 						listItem.addClass('grn');
// 					}, 200);
// 					$scope.tripNo = res.data.data.data[0].trip_no;
// 					$scope.aInfo = res.data.data.data[0].booking_info;
// 					$scope.selectedTrip = res.data.data.data[0];
// 				}
// 			}
// 		}
//
// 		function fail(res) {
// 			//$uibModalInstance.dismiss(res);
// 		}
//
// 		var oFilter = {};
// 		if(download) {
// 			oFilter = prepareFilterObject(true);
// 			oFilter.download = 'true';
// 			oFilter.all = true;
// 		} else {
// 			oFilter = prepareFilterObject(isPagination);
// 		}
// 		lastAckFilter = oFilter;
// 		if(oFilter.all === true) {
// 			tripServices.getAllPendingGrAll(oFilter, ack_success, fail);
// 		} else {
// 			tripServices.getAllGRItem(oFilter, ack_success, fail);
// 		}
// 	};
// 	// $scope.getGRAck();
// 	$scope.updateTripRemark = function(i) {
// 		function success(res) {
// 			if(res.data.data) {
// 				var message = res.data.message;
// 				swal('Update', message, 'success');
// 			}
// 		}
//
// 		function fail(res) {
// 			//$uibModalInstance.dismiss(res);
// 		}
//
// 		if($scope.aTrip[i] && $scope.aTrip[i].pending_gr_remarks) {
// 			var data = $scope.aTrip[i];
// 			tripServices.updateGRAck(data, success, fail);
// 		}
//
// 	};
//
// 	$scope.getCname = function(viewValue) {
// 		if(viewValue && viewValue.toString().length > 2) {
// 			function oSucC(response) {
// 				$scope.aCustomer = response.data.data;
// 			}
//
// 			function oFailC(response) {
// 				console.log(response);
// 			}
//
// 			customer.getCname(viewValue, oSucC, oFailC);
// 		} else if(viewValue == '') {
// 			$scope.currentPage = 1;
// 			$scope.getGRAck();
// 		}
// 	};
//
// 	$scope.getVname = function(viewValue) {
// 		if(viewValue && viewValue.toString().length > 1) {
// 			function oSuc(response) {
// 				$scope.aVehicles = response.data.data;
// 			}
//
// 			function oFail(response) {
// 				console.log(response);
// 			}
//
// 			Vehicle.getName(viewValue, oSuc, oFail);
// 		} else if(viewValue == '') {
// 			$scope.getAllGR();
// 		}
// 	};
//
// 	$scope.uploadDocs = function(gr) {
// 		var aAllowedFiles = ['GR', 'POD Front Copy', 'POD Back Copy', 'Other'];
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/uploadFiles.html',
// 			controller: 'uploadFilesPopUpCtrl',
// 			resolve:{
// 				oUploadData:{
// 					modelName: 'TripGr',
// 					scopeModel: gr,
// 					scopeModelId: gr._id,
// 					uploadText: "Upload GR Documents",
// 					aAllowedFiles: aAllowedFiles,
// 					uploadFunction: Vehicle.uploadDocs
// 				}
// 			}
// 		});
// 		modalInstance.result.then(function(data) {
// 			$state.reload();
// 		}, function(data) {
// 			$state.reload();
// 		});
// 	};
//
// 	$scope.previewBuilty = function(gr) {
// 		if(!Array.isArray(gr.documents) || gr.documents.length < 1) {
// 			growlService.growl("No documents to preview", "warning");
// 			return;
// 		}
// 		var documents = gr.documents.map(curr => ({
// 			...curr,
// 			url: `${URL.BASE_URL}documents/view/${curr.docReference}`
// 		}));
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/carouselPopup.html',
// 			controller: 'carouselCtrl',
// 			resolve: {
// 				documents: function () {
// 					return documents;
// 				}
// 			}
// 		});
// 	};
//
// 	$scope.getVendorName = function(viewValue) {
// 		if(viewValue && viewValue.toString().length > 1) {
// 			function oSuc(response) {
// 				$scope.aVendor = response.data.data;
// 			}
//
// 			function oFail(response) {
// 				console.log(response);
// 			}
//
// 			Vendor.getName({name: viewValue}, oSuc, oFail);
// 		}
// 	};
//
// 	$scope.infoItem = function(info, index) {
// 		listItem = $($('.selectItem')[index]);
// 		listItem.siblings().removeClass('grn');
// 		listItem.addClass('grn');
// 		$scope.tripNo = info.trip_no;
// 		$scope.selectedTrip = info;
// 		$scope.aInfo = info.booking_info;
// 	};
//
// 	$scope.infoItemSelected = function(info, index) {
// 		$scope.mod = 'view';
// 		listItem = $($('.selectItem')[index]);
// 		listItem.siblings().removeClass('grn');
// 		listItem.addClass('grn');
// 		$scope.tripNo = info.trip_no;
// 		$scope.selectedTrip = info;
// 		$rootScope.selectedGR = info;
// 		$scope.aInfo = info.booking_info;
// 		var sUrl = '#!/booking_manage/grAckDetails';
// 		$rootScope.redirect(sUrl);
// 	};
//
// 	/*$scope.printBuilty = function(oTrip) {
//       if (oTrip && oTrip.gr_no) {
//           var modalInstance = $uibModal.open({
//               //templateUrl: 'views/bills/builty.html',
//               //controller: 'builtyCtrl',
//       templateUrl: 'views/bills/builtyRender.html',
//       controller: 'builtyRendorCtrl',
//               resolve: {
//                   thatTrip: function() {
//                     var ht = "<div class=\\\"header\\\">\\r\\n        <div class=\\\"image\\\" style=\\\"    width: 182px;\\r\\n        height: 62px;\\r\\n        border: 1px solid;\\r\\n        margin-top: 34px;\\\">\\r\\n            Image\\r\\n        <\\/div>\\r\\n        <div class=\\\"address\\\" style=\\\"margin-left: 54%;\\\">\\r\\n            <div>RoadPiper Technologies Pvt Ltd.<\\/div>\\r\\n            <div>1st floor,Mohammadpur road\\/khandsa road,<\\/div>\\r\\n            <div>near toll tax, NH-8, Kheri Daula,Gurgaon<\\/div>\\r\\n            <div>support@roadpiper.com<\\/div>\\r\\n        <\\/div>\\r\\n    <\\/div>\\r\\n    <div class=\\\"belowHeader\\\" style=\\\"text-align: center;\\\">\\r\\n        <b>Loading Advance Slip \\/ Memo \\/Broker Slip<\\/b>\\r\\n    <\\/div>\\r\\n    <div class=\\\"step2\\\">\\r\\n        <div>NO.  <\\/div>\\r\\n        <div style=\\\"margin-left: 81%;\\\">Date:11\\/12\\/2017 <\\/div>\\r\\n        <div>Intented For  <\\/div>\\r\\n    <\\/div>\\r\\n    <table>\\r\\n        <tr>\\r\\n            <td>source<\\/td>\\r\\n            <td>Delhi <\\/td>\\r\\n        <\\/tr>\\r\\n        <tr>\\r\\n            <td>Destination<\\/td>\\r\\n            <td> Mumbai<\\/td>\\r\\n\\r\\n        <\\/tr>\\r\\n        <tr>\\r\\n            <td>Truck No<\\/td>\\r\\n            <td>  <\\/td>\\r\\n        <\\/tr>\\r\\n        <tr>\\r\\n            <td>Truck Details<\\/td>\\r\\n            <td>  <\\/td>\\r\\n        <\\/tr>\\r\\n        <tr>\\r\\n            <td>Driver Phone<\\/td>\\r\\n            <td><\\/td>\\r\\n        <\\/tr>\\r\\n    <\\/table>\\r\\n    <div class=\\\"step4\\\">\\r\\n        <div>\\r\\n            <b>Payment mode : <\\/b>\\r\\n        <\\/div>\\r\\n        <div>\\r\\n            <b>Total Rate :0<\\/b>\\r\\n        <\\/div>\\r\\n        <div>\\r\\n            <b>Advance <\\/b>\\r\\n        <\\/div>\\r\\n        <div>\\r\\n            <b>Balance<\\/b>\\r\\n        <\\/div>\\r\\n        <div>\\r\\n            <b>Detentation Rate<\\/b>\\r\\n        <\\/div>\\r\\n    <\\/div>\\r\\n    <p style=\\\"margin-left: 40px;\\r\\n    margin-top: 70px;\\\">No. TDS Deduction - TDS Declaration will be provided<\\/p>\\r\\n    <div style=\\\"display: flex;\\\">\\r\\n        <div style=\\\"width: 354px;\\r\\n        height: 140px;\\r\\n        border: 1px solid;\\\">\\r\\n            pan card image\\r\\n        <\\/div>\\r\\n        <div style=\\\"margin-left: 90px;\\\">\\r\\n            <div>\\r\\n                <div>GST No -07AACCF872F1Z1<\\/div>\\r\\n                <div>PAN No. of RoadPiper - AAHCR4047G<\\/div>\\r\\n                <div>Acc Name- Road Piper Technologies Private Limited<\\/div>\\r\\n                <div>IFSC Code- ICIC0000020<\\/div>\\r\\n                <div>ICICI Bank<\\/div>\\r\\n            <\\/div>\\r\\n        <\\/div>\\r\\n    <\\/div>\\r\\n    <div style=\\\"line-height: 7px;\\r\\n    margin-top: 60px;\\\">\\r\\n        <p>\\r\\n            <b>Terms & Conditions<\\/b>\\r\\n        <\\/p>\\r\\n        <p>This is an electronically generated copy and does not require any signature.<\\/p>\\r\\n        <p>-IN case of corrections kindly reply within 5 days of receipt.In the absence of any such intimation, it will be deemed\\r\\n            correct\\r\\n        <\\/p>\\r\\n        <p>-GST is not the responsibility of F.T logis, it is the responsibility of the consignee\\/consigner <\\/p>\\r\\n        <p>Please collect & verify Truck documentation at point of loading. <\\/p>\\r\\n        <p>Material insurance in purview of customer\\/Transporter<\\/p>\\r\\n        <style>\\r\\n    * {\\r\\n        margin-top: 1%;\\r\\n        margin-left: 10px;\\r\\n        margin-right: 7px;\\r\\n    }\\r\\n\\r\\n    .header {\\r\\n        display: flex;\\r\\n        border-bottom: 1px dotted;\\r\\n    }\\r\\n\\r\\n    table {\\r\\n        border-collapse: collapse;\\r\\n        width: 68%;\\r\\n        border: 1px solid;\\r\\n    }\\r\\n\\r\\n    th,\\r\\n    td {\\r\\n        text-align: left;\\r\\n        padding: 8px;\\r\\n        border-right: 1px solid;\\r\\n        border-bottom: 1px solid;\\r\\n        \\r\\n    }\\r\\n\\r\\n    tr:nth-child(even) {\\r\\n        background-color: #f2f2f2\\r\\n    }\\r\\n\\r\\n    th {\\r\\n        background-color: #4CAF50;\\r\\n        color: white;\\r\\n    }\\r\\n<\\/style>\\r\\n    <\\/div>"
//
//                       return ht//billsService.prepareBuiltyData(oTrip, null, null);
//                   }
//               }
//           });
//       };
//   };*/
// 	$scope.printBuilty = function() {
// 		//alert("Functioning remaining");
// 		$scope.oTrip = $scope.selectedTrip;
// 		if($scope.oTrip && $scope.oTrip.grNumber) {
// 			var oFilter = {_id: $scope.oTrip._id};
// 			var modalInstance = $uibModal.open({
// 				templateUrl: 'views/bills/builtyRender.html',
// 				controller: 'builtyRendorCtrl',
// 				resolve: {
// 					thatTrip: oFilter
// 				}
// 			});
// 		}
// 	};
//
// 	/*$scope.myGRDeatils = function(oTrip, index) {
//       var modalInstance = $uibModal.open({
//           templateUrl: 'views/myGR/myGRpopUp.html',
//           controller: 'myGRPopUpCtrl',
//           resolve: {
//               thatTrip: function() {
//                   return oTrip;
//               }
//           }
//       });
//
//       modalInstance.result.then(function() {
//           $state.reload();
//       }, function(data) {
//           if (data != 'cancel') {
//               swal("Oops!", data.data.message, "error")
//           }
//       });
//   };*/
//
// 	$scope.addRemark = function(oTrip, index) {
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/pendingGR/addRemark.html',
// 			controller: 'addRemarkPopUpCtrl',
// 			resolve: {
// 				thatTrip: function() {
// 					return oTrip;
// 				}
// 			}
// 		});
//
// 		modalInstance.result.then(function() {
// 			$state.reload();
// 		}, function(data) {
// 			if(data != 'cancel') {
// 				swal('Oops!', data.data.message, 'error');
// 			}
// 		});
// 	};
//
// 	$scope.grReceive = function(oTrip, index) {
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/pendingGR/grReceive.html',
// 			controller: 'grReceivePopUpCtrl',
// 			resolve: {
// 				thatTrip: function() {
// 					return oTrip;
// 				}
// 			}
// 		});
//
// 		modalInstance.result.then(function() {
// 			$state.reload();
// 		}, function(data) {
// 			if(data != 'cancel') {
// 				swal('Oops!', data.data.message, 'error');
// 			}
// 		});
// 	};
//
// 	$scope.showHistory = function(oTrip) {
// 		$uibModal.open({
// 			templateUrl: 'views/pendingGR/pendingGrHistoryPopup.html',
// 			controller: 'pendingGrHistoryPopupCtrl',
// 			resolve: {
// 				thatTrip: function() {
// 					return oTrip;
// 				}
// 			}
// 		});
// 	};
//
// 	$scope.previewGRDetails = function(oTrip) {
//
// 		$uibModal.open({
// 			templateUrl: 'views/myGR/myGRpopUp.html',
// 			controller: 'myGRPopUpCtrl',
// 			resolve: {
// 				thatTrip: function() {
// 					return oTrip;
// 				},
// 				'formType': function(){
// 					return 'readonly';
// 				}
// 			}
// 		});
//
// 		//
// 		// var modalInstance = $uibModal.open({
// 		// 	templateUrl: 'views/myGR/myGRDetailpopUp.html',
// 		// 	controller: 'myGRDetailPopUpCtrl',
// 		// 	resolve: {
// 		// 		thatTrip: function() {
// 		// 			return oTrip;
// 		// 		}
// 		// 	}
// 		// });
// 	};
//
// 	$scope.myGRAckDeatils = function(oTrip, index) {
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/myGRacknowledge/myGRackPopUp.html',
// 			controller: 'myGRackPopUpCtrl',
// 			resolve: {
// 				thatTrip: function() {
// 					return oTrip;
// 				}
// 			}
// 		});
//
// 		modalInstance.result.then(function() {
// 			$state.reload();
// 		}, function(data) {
// 			if(data != 'cancel') {
// 				swal('Oops!', data.data.error_message, 'error');
// 			}
// 		});
// 	};
//
// 	$scope.downloadPendingGRReport = function() {
// 		ReportService.getPendiGrReport(lastGRFilter, function(data) {
// 			var a = document.createElement('a');
// 			a.href = data.data.url;
// 			a.download = data.data.url;
// 			a.target = '_blank';
// 			a.click();
// 		});
// 	};
//
//
// 	//************* New Date Picker for multiple date selection in single form **************
// 	/*$scope.getAllVehicles = function(){
//     function success(data) {
//         $rootScope.aVehicles = data.data;
//       };
//     var oFilter = {};
//     Vehicle.getAllVehicles(oFilter,success);
//
//   }
//   $scope.getAllVehicles();
//   $scope.getAllRoute = function(){
//     function success(data) {
//       $scope.aRoute = data.data.data;
//     };
//     Routes.getAllRoutes({},success);
//   }
//   $scope.getAllRoute();*/
// 	/*$scope.getCustomers = function(){
//      function success(data) {
//       $scope.aCustomer = data.data;
//     };
//      bookingServices.getAllCustomers(success);
//     };
//   $scope.getCustomers();*/
// });
materialAdmin.controller('addRemarkPopUpCtrl', function ($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, tripServices) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.gr = angular.copy(thatTrip);
	$scope.pendingRemark = {};
	$scope.aReason = ['Pending gr reasons', 'Driver on another trip', 'Courier lost', 'Customer is not accepting', 'Gr was wrong'];

	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	//-------------------------------------------------------------------------

	$scope.toggleMin = function () {
		var clientTripDateConfig = clientConfig.getFeatureValue('gr', 'gr_start_date');
		$scope.maxDate = new Date();
		var aloc_date = angular.copy($scope.maxDate); // - 1000 * 60 * 60 * 24 * 2
		var clientMaxDate = (clientTripDateConfig && clientTripDateConfig.min_hour) ? moment().subtract(clientTripDateConfig.min_hour, 'hours')._d : angular.copy(aloc_date);

		if (thatTrip && thatTrip.trip.allocation_date) {
			thatTrip.trip.allocation_date = new Date(thatTrip.trip.allocation_date);
			aloc_date = thatTrip.trip.allocation_date;
		}
		if (aloc_date > clientMaxDate) {
			aloc_date = aloc_date;
		} else {
			aloc_date = clientMaxDate;
		}
		$scope.minDate = new Date(aloc_date);
	};

	//-------------------------------------------------------------------------
	//$scope.toggleMin();
	$scope.minDate = new Date();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form ******************

	function success(res) {
		if (res && res.data && (res.data.success == 'OK')) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	function failure(res) {
		$uibModalInstance.dismiss(res);
	}

	$scope.updateRemark = function (form) {
		var oSend = {};
		oSend.pendingRemark = $scope.pendingRemark;
		oSend._id = $scope.gr._id;

		tripServices.updateGRremark(oSend, success, failure);

	};
});

materialAdmin.controller('grReceivePopUpCtrl', function (
	$rootScope,
	$scope,
	branchService,
	DatePicker,
	clientConfig,
	$uibModalInstance,
	dateUtils,
	thatTrip,
	vendorCourierService,
	Driver,
	tripServices) {

	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	// $scope.changeGr = function() {
	// 	$scope.gr = true;
	// };
	$scope.gr = angular.copy(thatTrip);
	$scope.grReceive = {};
	$scope.aDispatched_by = ['Driver', 'Courier', 'By Hand'];
	$scope.getDriver = getDriver;
	$scope.getARBranch = getARBranch;
	$scope.ar_MinDate = $scope.gr.pod && $scope.gr.pod.billingUnloadingTime;

	(function init() {

		$scope.gr.pod = $scope.gr.pod || {};
		if ($scope.gr.pod.arNo)
			$scope.arNo = $scope.gr.pod.arNo;
		if ($scope.gr.pod.branch)
			$scope.branch = $scope.gr.pod.branch;
		if ($scope.gr.pod.arRemark)
			$scope.arRemark = $scope.gr.pod.arRemark;
		if ($scope.gr.pod.date)
			$scope.arDate = new Date($scope.gr.pod.date);
		if ($scope.gr.pod.type)
			$scope.grReceive.type = $scope.gr.pod.type;
		if ($scope.gr.pod.person)
			$scope.grReceive.person = $scope.gr.pod.person;
		if ($scope.gr.pod.driver){
			$scope.grReceive.driver = {_id: $scope.gr.pod.driver, name: $scope.gr.pod.driver_name};
		}else if(!$scope.grReceive.type) {
			if(($scope.gr.trip.driver && $scope.gr.trip.driver._id && $scope.gr.trip.driver.name) || ($scope.gr.driverData &&  $scope.gr.driverData.name &&  $scope.gr.driverData._id)){
		 	$scope.grReceive.driver = {_id: ($scope.gr.trip.driver._id || $scope.gr.driverData._id), name: ($scope.gr.trip.driver.name||$scope.gr.driverData.name)};
	     	}
    	  }
		if ($scope.gr.pod.courier)
			$scope.grReceive.courier = {_id: $scope.gr.pod.courier, name: $scope.gr.pod.courier_name};

		if ($scope.gr.acknowledge && $scope.gr.acknowledge.source && $scope.gr.acknowledge.destination)
			$scope.route = $scope.gr.acknowledge.source + ' to ' + $scope.gr.acknowledge.destination;

		if ($scope.gr.pod.loadingArrivalTime) {

			$scope.gr.pod.loadingArrivalTime = new Date($scope.gr.pod.loadingArrivalTime);
			$scope.loadingArrivalTimeModel = new Date();
			$scope.loadingArrivalTimeModel = dateUtils.setHoursFromDate($scope.loadingArrivalTimeModel, $scope.gr.pod.loadingArrivalTime);
		}

		if ($scope.gr.pod.billingLoadingTime) {

			$scope.gr.pod.billingLoadingTime = new Date($scope.gr.pod.billingLoadingTime);
			$scope.billingLoadingTimeModel = new Date();
			$scope.billingLoadingTimeModel = dateUtils.setHoursFromDate($scope.billingLoadingTimeModel, $scope.gr.pod.billingLoadingTime);
		}

		if ($scope.gr.pod.unloadingArrivalTime) {

			$scope.gr.pod.unloadingArrivalTime = new Date($scope.gr.pod.unloadingArrivalTime);
			$scope.unloadingArrivalTimeModel = new Date();
			$scope.unloadingArrivalTimeModel = dateUtils.setHoursFromDate($scope.unloadingArrivalTimeModel, $scope.gr.pod.unloadingArrivalTime);
		}

		if ($scope.gr.pod.billingUnloadingTime) {

			$scope.gr.pod.billingUnloadingTime = new Date($scope.gr.pod.billingUnloadingTime);
			$scope.billingUnloadingTimeModel = new Date();
			$scope.billingUnloadingTimeModel = dateUtils.setHoursFromDate($scope.billingUnloadingTimeModel, $scope.gr.pod.billingUnloadingTime);
		}
	})();


	(function () {
		function successCourier(res) {
			if (res.data) {
				$scope.aCourier = res.data;
			}
		}

		vendorCourierService.getVendorCouriers({}, successCourier);
	})();

	(function () {
		function successDriver(res) {
			if (res.data.data) {
				$scope.aDriver = res.data.data;
			}
		}

		Driver.getAll(successDriver);
	})();

	function getARBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {


			let request = {
				name: viewValue
			};

			return new Promise(function (resolve, reject) {

				branchService.getAllBranches(request, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	}

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			Driver.getName(viewValue, res => $scope.aDriver = res.data.data, err => console.log`${err}`);
		}
	}

	$scope.dispatch = function (v) {
		if (v === 'Driver') {
			$scope.show_me = false;
		} else {
			$scope.show_me = true;
		}
	};

	function success(res) {
		if (res && res.data && (res.data.status == 'OK')) {
			var message = res.data.message;
			swal('Update', message, 'success');
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	function failure(res) {
		$uibModalInstance.dismiss(res);
	}

	$scope.update = function (form) {
		var oSend = {
			pod: {
				arRemark: $scope.arRemark,
				arNo: $scope.arNo,
				branch: $scope.branch,
				type: $scope.grReceive.type,
				date: $scope.arDate,
			},
			_id: $scope.gr._id,
		};

		if ($scope.gr.pod.billingUnloadingTime) {
			oSend.pod.billingUnloadingTime = dateUtils.setHoursFromDate($scope.gr.pod.billingUnloadingTime, $scope.billingUnloadingTimeModel);
		}

		if ($scope.gr.pod.unloadingArrivalTime) {
			oSend.pod.unloadingArrivalTime = dateUtils.setHoursFromDate($scope.gr.pod.unloadingArrivalTime, $scope.unloadingArrivalTimeModel);
		}

		if ($scope.gr.pod.billingLoadingTime) {
			oSend.pod.billingLoadingTime = dateUtils.setHoursFromDate($scope.gr.pod.billingLoadingTime, $scope.billingLoadingTimeModel);
		}

		if ($scope.gr.pod.loadingArrivalTime)
			oSend.pod.loadingArrivalTime = dateUtils.setHoursFromDate($scope.gr.pod.loadingArrivalTime, $scope.loadingArrivalTimeModel);


		if ($scope.grReceive.type === 'Courier' && $scope.grReceive.courier) {
			oSend.pod.courier = $scope.grReceive.courier && $scope.grReceive.courier._id;
			oSend.pod.courier_name = $scope.grReceive.courier && $scope.grReceive.courier.name;
		} else if ($scope.grReceive.type === 'Driver' && $scope.grReceive.driver) {
			oSend.pod.driver = $scope.grReceive.driver && $scope.grReceive.driver._id;
			oSend.pod.driver_name = $scope.grReceive.driver && $scope.grReceive.driver.name;
		} else if ($scope.grReceive.type === 'By Hand' && $scope.grReceive.person) {
			oSend.pod.person = $scope.grReceive.person;
		}
		tripServices.updateGrReceive(oSend, success, failure);


	};
});

materialAdmin.controller('pendingGrHistoryPopupCtrl', function (
	$scope,
	$uibModalInstance,
	thatTrip
) {

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.gr = angular.copy(thatTrip);

});
