materialAdmin.controller('purchaseBillController', purchaseBillController);
materialAdmin.controller('genOBBillCtrl', genOBBillCtrl);
materialAdmin.controller('genBillOBalUpsert', genBillOBalUpsert);
materialAdmin.controller('genCrBillOBCtrl', genCrBillOBCtrl);
materialAdmin.controller('genCrBillOBUpsertCtrl', genCrBillOBUpsertCtrl);


genOBBillCtrl.$inject = [
	"$scope",
	"$state",
	"$timeout",
	"$uibModal",
	"DateUtils",
	"DatePicker",
	"billsService",
	"billingPartyService",
	"lazyLoadFactory",
	"stateDataRetain",
];
genBillOBalUpsert.$inject = [
	"$scope",
	"$timeout",
	"$uibModal",
	"DateUtils",
	"DatePicker",
	"billsService",
	"billingPartyService",
	"$stateParams"
];
genCrBillOBCtrl.$inject = [
	'$modal',
	'$scope',
	'$state',
	'accountingService',
	'billsService',
	'DatePicker',
	'lazyLoadFactory',
	'voucherService',
	'vendorFuelService',
	'$stateParams'
];
genCrBillOBUpsertCtrl.$inject = [
	"$scope",
	"$timeout",
	"$uibModal",
	"$stateParams",
	"accountingService",
	"DateUtils",
	"DatePicker",
	"billsService",
	"billingPartyService",
	"NumberUtil",
	"Vendor",
];


materialAdmin.controller('billsController', function (
	$rootScope,
	$scope,
	$state,
	$modal,
	$localStorage,
	$uibModal,
	customer,
	consignorConsigneeService,
	dateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	bookingServices,
	invoiceService,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	Vehicle
) {

	$scope.columnSetting = {
		allowedColumn: [
			'trip no',
			'gr no',
			'gr date',
			'TMemo No',
			'Vehicle No.',
			'customer',
			'consignor',
			'consignee',
			'billingparty',
			'Route Name',
			'Billing Route',
			'Payment Basis',
			'Payment Type',
			'Advance',
			'Invoice No',
			'Load Ref. No',
			'Incentive',
			'Qty',
			'Weight(T)',
			'Freight',
			'Total Freight',
			'CGst',
			'SGst',
			'IGst',
			'Total Amount',
			'eway bills',
			'trip no',
			'gr remark',
			'pod remark'
		]
	};

	$scope.tableHead = [
		{
			'header': 'trip no',
			'bindingKeys': 'trip.trip_no',
			'date': false
		},
		{
			'header': 'gr no',
			'bindingKeys': 'grNumber',
			'date': false
		},
		{
			'header': 'gr date',
			'bindingKeys': 'grDate',
			'date': 'dd-MMM-yyyy'
		},
		{
			'header': 'TMemo No',
			'bindingKeys': 'tMemo.tMNo'
		},
		{
			'header': 'Vehicle No.',
			'bindingKeys': 'trip.vehicle_no'
		},
		{
			'header': 'customer',
			'bindingKeys': 'customer.name'
		},
		{
			'header': 'consignor',
			'bindingKeys': 'consignor.name'
		},
		{
			'header': 'consignee',
			'bindingKeys': 'consignee.name'
		},
		{
			'header': 'billingparty',
			'bindingKeys': 'billingParty.name'
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
			'header': 'Payment Basis',
			'bindingKeys': 'payment_basis || booking.payment_basis'
		},
		{
			'header': 'Payment Type',
			'bindingKeys': 'payment_type || booking.payment_type '
		},
			{
			'header': 'Advance',
			'bindingKeys': 'tMemo.advance'
		},


		{
			'header': 'Invoice No',
			'filter': {
				'name': 'arrayOfString',
				'aParam': [
					'invoices',
					'"invoiceNo"',
				]
			}
		},
		{
			'header': 'Load Ref. No',
			'filter': {
				'name': 'arrayOfString',
				'aParam': [
					'invoices',
					'"loadRefNumber"',
				]
			}
		},
		{
			'header': 'Incentive',
			'bindingKeys': 'charges.incentive'
		},
		{
			'header': 'Qty',
			'filter': {
				'name': 'getArrayElementSum',
				'aParam': [
					'invoices',
					'"noOfUnits"',
				]
			}
		},
		{
			'header': 'Weight(T)',
			'filter': {
				'name': 'getArrayElementSum',
				'aParam': [
					'invoices',
					'"weightPerUnit"',
				]
			}
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
			'bindingKeys': 'cGST'
		},
		{
			'header': 'SGst',
			'bindingKeys': 'sGST'
		},
		{
			'header': 'IGst',
			'bindingKeys': 'iGST'
		},
		{
			'header': 'Total Amount',
			'bindingKeys': 'totalAmount'
		},
		{
			'header': 'trip no',
			'bindingKeys': 'trip.trip_no'
		},
		{
			'header': 'gr remark',
			'bindingKeys': 'remarks'
		},
		{
			'header': 'pod remark',
			'bindingKeys': 'pod.arRemark '
		},
	];

	$scope.DatePicker = angular.copy(DatePicker);
	$scope.myFilter = {
		acknowledge: true
	};
	$scope.onStateRefresh = function () {
		$scope.getGrs();
	};
	$scope.getGrs = getGrs;
	$scope.getVehicle = getVehicle;
	$scope.getBilling = getBilling;
	$scope.getCustomerName = getCustomerName;
	$scope.unbilledGRReport = unbilledGRReport;
	$scope.myFilter.noBill = true;
	$scope.selectedGrs = [];
	$scope.selectType = 'index';
	$scope.aPod = ["Received", "Not Received", "All"];
	$scope.aAcknowledged = [
		{
			name: "Acknowledged",
			value: true
		}, {
			name: "Not Acknowledged",
			value: false
		},
		{
			name: "All",
		}];

	(function init() {

		if (stateDataRetain.init($scope))
			return;

		if($scope.columnSetting.allowedColumn[3] == 'TMemo No' && !$scope.$configs.tripMemo){
			$scope.columnSetting.allowedColumn.splice(3,1);
		}
		$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		$scope.lazyLoad = lazyLoadFactory(); // init lazyload

	})();

	$scope.moisture = function (allGrs) {
		var aGRs = allGrs.map(gr => {
			return gr._id;
		});
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/myGRmoisturepopUp.html',
			controller: 'myGRmoisturepopUpCtrl',
			resolve: {
				aGR: function () {
					return aGRs;
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

	function prepareDownloadFilter() {
		var filter = {billQuery: true};

		if ($scope.myFilter.tripNo) {
			filter.trip_query = filter.trip_query || {};
			filter.trip_query.trip_no = $scope.myFilter.tripNo;
		}
		if ($scope.myFilter.grNo) {
			filter.grNumber = $scope.myFilter.grNo;
		} else {
			filter["grNumber"] = {
				$exists: true
			};
		}

		if ($scope.myFilter.from) {
			filter.from = dateUtils.setHours($scope.myFilter.from, 0, 0, 0).toISOString();
		}
		if ($scope.myFilter.to) {
			filter.to = dateUtils.setHours($scope.myFilter.to, 23, 59, 59).toISOString();
		}
		if ($scope.myFilter.asOnDate) {
			filter.asOnDate = dateUtils.setHours($scope.myFilter.asOnDate, 23, 59, 59).toISOString();
		}
		if ($scope.myFilter.customer) {
			filter.customer = $scope.myFilter.customer._id;
		}
		if ($scope.myFilter.consignor) {
			filter.consignor = $scope.myFilter.consignor._id;
		}
		if ($scope.myFilter.consignee) {
			filter.consignee = $scope.myFilter.consignee._id;
		}
		if ($scope.myFilter.billingParty) {
			filter['billingParty._id'] = $scope.myFilter.billingParty._id;
		} else
			filter.billingParty = {
				$exists: true
			};

		if ($scope.myFilter.segment_type) {
			filter.trip_query = filter.trip_query || {};
			filter.trip_query.segment_type = $scope.myFilter.segment_type;
		}


		if ($scope.myFilter.vehicle_no) {
			filter.vehicle = $scope.myFilter.vehicle_no._id;
		}

		if ($scope.myFilter.dateType) {
			filter.dateType = $scope.myFilter.dateType;
		}
		if ($scope.myFilter.branch) {
			filter.branch = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			filter.branch = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					filter.branch.push(obj._id);
			});
		}
		filter['isNonBillable'] = false;
		filter.skip = $scope.lazyLoad.getCurrentPage();
		filter.sort = {grDate: 1};
		return filter;
	}

	function unbilledGRReport() {
		if (!($scope.myFilter.from && $scope.myFilter.to)) {
			swal('Warning', 'From and To Date should be filled', 'warning');
			return;
		}
		if (!($scope.myFilter.asOnDate)) {
			swal('Warning', 'As On Date should be filled', 'warning');
			return;
		}

		var oFilter = prepareDownloadFilter();
		lastGRFilter = oFilter;
		tripServices.yetAnotherGRReport(oFilter).then(data => {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}

	$scope.editGr = function () {
		$scope.oTrip = $scope.selectedGrs;
		$scope.oTrip.editMode = true;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myGR/myGRpopUp.html',
			controller: 'myGRPopUpCtrl',
			resolve: {
				thatTrip: function () {
					return $scope.oTrip;
				},
				'formType': function () {
					return 'updateGr';
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

	// $scope.editGr = function(OperationType) {
	// 	stateDataRetain.go('booking_manage.grUpsert', {
	// 		mode: OperationType,
	// 		gr: $scope.selectedGrs
	// 	}, 'gr');
	// };

	$scope.selectBillType = function () {

		if (Array.isArray($scope.selectedGrs))
			$scope.selectedGr = $scope.selectedGrs;
		else if (typeof $scope.selectedGrs == 'object')
			$scope.selectedGr = [$scope.selectedGrs];
		else
			return;

		let isValid = true;

		$scope.selectedGr.forEach(o => {
			isValid && (isValid = Array.isArray(o.invoices));
		});

		if (!isValid)
			return swal('No Material Found on Some Gr\'s');

		let isProvisionalbillGen = $scope.selectedGr.reduce((bool, o) => bool ? bool : !!(o.provisionalBill && o.provisionalBill.length), false);

		$state.go('billing.previewBill', {
			data: {
				billType: isProvisionalbillGen ? 'Provisional Bill' : 'Actual Bill',
				aGrData: $scope.selectedGr,
				hideBillTypeOpt: !!isProvisionalbillGen
			}
		});
	};

	$scope.generateLoadingReceipt = function () {
		$state.go('billing.previewLoadingReceipt', {data: $scope.selectedGrs});
	};

	$scope.generateBillHistory = function () {
		$uibModal.open({
			templateUrl: 'views/bills/previewBillHistory.html',
			controller: 'previewBillHistoryCtrl',
			resolve: {
				unbilledGr: function () {
					return $scope.selectedGrs;
				}
			}
		});
	};

	function getGrs(isGetActive) {

		if ($scope.myFilter.consignor || $scope.myFilter.billingParty || $scope.myFilter.customer) {
			$scope.selectType = 'multiple';
			$scope.multipeGrSelection = true;
		} else {
			$scope.selectType = 'index';
		}

		if (!$scope.lazyLoad.update(isGetActive))
			return;

		if ($scope.myFilter.dateType) {
			if (!($scope.myFilter.from && $scope.myFilter.to)) {
				swal('warning', 'Please fill From Date and To Date', 'warning');
				return;
			}
		}

		let oFilter = prepareFilterObject();
		tripServices.getAllTripGrData(oFilter, success, failure);

		function success(response) {
			if (response && response.data) {
				response = response.data;
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);

			}
		}

		function failure(res) {
			swal('Some error with GET trips.', '', 'error');
		}
	}


	function getCustomerName(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				customer.getCustomerSearch(viewValue, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}


	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function getVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Vehicle.getNameTrim(viewValue, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	$scope.selectThisRow = function (oGr, index) {
		if ($scope.multipeGrSelection)
			return;

		$scope.selectedGrs = oGr;
		$($('.invoiceDetail tbody tr')).removeClass('grn');
		var row = $($('.invoiceDetail tbody tr')[index]);
		row.addClass('grn');

		/*/!*
		* Below code is for enabling/disabling single selected Provision Bill/ Actual Bill Button
		* *!/
		if(oGr.bill){
			$scope.provisionBillGenerateButton = false;
			$scope.actualBillGenerateButton = false;
		}else if(oGr.provisionalBill){
			$scope.provisionBillGenerateButton = false;
			$scope.actualBillGenerateButton = true;
		}else{
			$scope.provisionBillGenerateButton = true;
			$scope.actualBillGenerateButton = true;
		}*/
	};

	$scope.onCustomerSelect = function ($item, $model, $label) {
		//$scope.getContract($scope.myFilter.customer);
	};

	$scope.clearSelection = function () {
		$($('.invoiceDetail tbody tr')).removeClass('grn');

		if (!$scope.selectPreserve)
			$scope.selectedGrs = [];

		$scope.provisionBillGenerateButton = false;
		$scope.actualBillGenerateButton = false;
		$scope.multipeGrSelection = false;
		$scope.makeContractVisible = false;
	};

	$scope.getConsignor = function (viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				name: viewValue,
				no_of_docs: 10
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

	$scope.getConsignee = function (viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				name: viewValue,
				no_of_docs: 10
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

	function prepareFilterObject() {
		var filter = {dateType: "grDate"};

		if ($scope.myFilter.tripNo) {
			filter.trip_no = $scope.myFilter.tripNo;
		}
		if ($scope.myFilter.grNo) {
			filter.grNumber = $scope.myFilter.grNo;
		} else if ($scope.myFilter.tMNo) {
			filter.tMNo = $scope.myFilter.tMNo;
		}else {
			filter["grNoorTmemoNo"] = true
		}

		if ($scope.myFilter.received == 'Not Received')
			filter["pod.received"] = false;
		else if ($scope.myFilter.received == 'Received')
			filter["pod.received"] = true;

		if ($scope.myFilter.from) {
			filter.from = dateUtils.setHours($scope.myFilter.from, 0, 0, 0).toISOString();
		}
		if ($scope.myFilter.to) {
			filter.to = dateUtils.setHours($scope.myFilter.to, 23, 59, 59).toISOString();
		}
		if ($scope.myFilter.customer) {
			filter.customer = $scope.myFilter.customer._id;
		}
		if ($scope.myFilter.consignor) {
			filter.consignor = $scope.myFilter.consignor._id;
		}
		if ($scope.myFilter.consignee) {
			filter.consignee = $scope.myFilter.consignee._id;
		}
		if ($scope.myFilter.billingParty) {
			filter['billingParty._id'] = $scope.myFilter.billingParty._id;
		} else
			filter.billingParty = {
				$exists: true
			};

		if ($scope.myFilter.segment_type) {
			filter.trip_query = filter.trip_query || {};
			filter.trip_query.segment_type = $scope.myFilter.segment_type;
		}
		if ($scope.myFilter.contract_id) {
			filter.booking_query = filter.booking_query || {};
			filter.booking_query.contract_id = $scope.myFilter.contract_id._id;
			filter.all = 'true';
			$scope.pagination.items_per_page = -1;
		}

		if ($scope.myFilter.vehicle_no) {
			filter.vehicle = $scope.myFilter.vehicle_no._id;
		}

		if ($scope.myFilter.provisionBill || $scope.myFilter.actualBill || $scope.myFilter.noBill) {
			$scope.myFilter.grToShow = [];
			delete filter['provisionalBill.0'];
			delete filter.bill;
		}

		if ($scope.myFilter.provisionBill) {
			filter['provisionalBill.0'] = {$exists: true};
			filter.bill = {$exists: false};
			delete $scope.myFilter.provisionBill;
		}

		if ($scope.myFilter.actualBill) {
			filter.bill = {$exists: true};
			delete $scope.myFilter.actualBill;
		}
		if ($scope.myFilter.branch) {
			filter.branch = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			filter.branch = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					filter.branch.push(obj._id);
			});
		}

		if ($scope.myFilter.noBill) {
			filter['provisionalBill.0'] = {$exists: false};
			filter.bill = {$exists: false};
			delete $scope.myFilter.noBill;
		}
		if ($scope.myFilter.dateType) {
			filter.dateType = $scope.myFilter.dateType;
		}

		if ($scope.myFilter.shipmentNo)
			filter['invoices.ref2'] = $scope.myFilter.shipmentNo;

		if ($scope.$configs.GR && $scope.$configs.GR.grAck)
			filter['acknowledge.status'] = true;

		if ($scope.$configs.UnBilledGr && $scope.$configs.UnBilledGr.podReceived)
			filter['pod.received'] = true;

		filter.no_of_docs = 20;
		filter.bill = {$exists: false};
		// filter['provisionalBill'] = {$exists: false};
		filter['isProvBillGen'] = false;
		filter['isNonBillable'] = false;
		filter.skip = $scope.lazyLoad.getCurrentPage();
		filter.sort = {grNumber: 1, trip_no: -1};
		return filter;
	}

	/*
	* Get All Contract
	* */
	$scope.getContract = function (customerDetail) {
		if (!customerDetail)
			return;

		function success(data) {
			$scope.aContracts = data.data.length !== 0 ? data.data : [{}];

		}

		var contractFilter = {
			all: true,
			customer__id: customerDetail._id
		};
		customer.getAllContractsOfCustomer(contractFilter, success);
	};

	/* *********************************************************************
	 * *********************************************************************
	 * *********************************************************************
	 * *********************************************************************
	 * */

	$scope.show_bill = false;

	/*$scope.getCustomer = function() {
        //console.log('getting cus');

        function success(data) {
            $scope.aCustomers = data.data;
            //console.log('customers: ', $scope.aCustomers);
        }
        bookingServices.getAllCustomers(success);
    };
    $scope.getCustomer();*/

	/*$scope.getAllRoutes = function(){
        function success(data) {
            $scope.aRoute = data.data.data;
        };
        Routes.getAllRoutes({all:true},success);
    }
    $scope.getAllRoutes();*/

	// console.log(JSON.stringify($localStorage.availableCustomers));

	/*$scope.oBills = {};
    $scope.oBills.end_date = new Date();
    $scope.oBills.start_date = new Date($scope.oBills.end_date);
    $scope.oBills.start_date.setDate($scope.oBills.end_date.getDate() - 7);*/

	$scope.select = 'Trip No.';
	$scope.mode = 'trip';

	$scope.getBookings = function (customer, start_date, end_date) {
		//console.log('getting bookings',customer, start_date, end_date);

		function success(data) {
			if (data.data && data.data.data && data.data.data.length > 0) {
				$scope.aBookings = data.data.data;
			}
		}

		function failure(res) {
			//console.log("fail: ", res);
		}

		bookingServices.getAllBookings({}, success, failure);
	};
	// $scope.getBookings();


	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCustomerSearch(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {
			$scope.getInvoice(false, true);
		}
		;
	};

	$scope.getDname = function (viewValue) {
		function oSucD(response) {
			$scope.aRoute = response.data.data;
		};

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getName(viewValue, oSucD, oFailD);
		} else if (viewValue == '') {
			$scope.getInvoice(false, true);
		}
		;
	};

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.onInvoiceSelect = function (item, model, label) {
		$scope.selectInVoice = item;
	};

	$scope.$watch('oBills.bill_type', function (value) {
		$scope.show_bill = 'false';
	});

	//$scope.getInvoice();

	$scope.getBillPDFDATA = function (selectInVoice) {
		selectInVoice.download = true;
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/preViewBill.html',
			controller: 'invoiceCtrl',
			resolve: {
				thatInvoice: function () {
					return selectInVoice;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			$state.reload();
		});
	};

	$scope.editInvoice = function (selectInVoice) {
		$state.go('billing.invoice', {
			data: {
				'selectedInvoice': selectInVoice,
				'invoice': $scope.aInvoive
			}
		});
	};

	$scope.geneBillOk = function () {
		var allInvoice = $scope.aInvoive;
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/geneBillPop.html',
			controller: 'geneBillCntrl',
			resolve: {
				thatInvoice: function () {
					return allInvoice;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			$state.reload();
		});
	};

	$scope.geneBill = function (selectInVoice) {
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/geneBillPop.html',
			controller: 'geneBillCntrl',
			resolve: {
				thatInvoice: function () {
					return selectInVoice;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			$state.reload();
		});
	};
});

materialAdmin.controller('previewBillCtrl', function (
	$localStorage,
	$modal,
	$rootScope,
	$scope,
	$state,
	$stateParams,
	$timeout,
	$uibModal,
	$filter,
	billingPartyService,
	billsService,
	billBookService,
	branchService,
	customer,
	CustomerRateChartService,
	confService,
	DatePicker,
	growlService,
	incentiveService,
	tripServices,
	accountingService
) {

	let vm = this;

	vm.calculateTax = calculateTax;
	vm.setPercent = setPercent;
	vm.DatePicker = DatePicker;
	vm.editSupplyBill = editSupplyBill;
	vm.getGr = getGr;
	vm.removeGr = removeGr;
	vm.amountCeil = amountCeil;
	vm.amountFloor = amountFloor;
	vm.amountRefresh = amountRefresh;
	vm.onBillNoSelect = onBillNoSelect;
	vm.onChangeBillType = onChangeBillType;
	vm.generateBill = generateBill;
	vm.updateBill = updateBill;
	vm.getAccount = getAccount;
	vm.getBillBookNo = getBillBookNo;
	vm.grUpsertPopup = grUpsertPopup;
	vm.refreshRate = refreshRate;
	vm.getAllBranchSearch = getAllBranchSearch;
	vm.onBranchSelect = onBranchSelect;

	(function init() {

		vm.aBillType = ['Actual Bill', 'Provisional Bill'/*, 'Supplementary Bill'*/];
		vm.aItems = [];
		vm.billBookInfo = {};
		vm.selectedBill = {};
		vm.selectedBillIndex = {};
		vm.oBill = {};
		vm.billPercent = 0;
		vm.allowedPercent = 100;
		vm.filter = {};
		vm.oChargesToLock = {};
		vm.oCheckedCharges = {};
		vm.fetchingOtherSuppBill = false;
		vm.colSpan = 16;
		if($scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
			vm.colSpan++;
		$stateParams.data = $stateParams.data || {};

		if($stateParams.data && $stateParams.data.oBill && $stateParams.data.oBill._id){
			billsService.getGenerateBill({
				_id: $stateParams.data.oBill._id,
				populate: ["consignee", "vehicle", "consignor"]
			}, (res) => {
				res = res.data;
				if(res.data.length != 1){
					failed();
				}
				$stateParams.data.oBill = res.data[0];
				prepareScopeByMode();
			}, failed);

			function failed() {
				swal('Error', "No Bill Found", 'error');
				console.error(e.toString());
				$state.go('billing.bills');
				return;
			}
		}else if($stateParams.data && ($stateParams.data.aGrData || $stateParams.data.oBill)){
			prepareScopeByMode();
		}else{
			$state.go('billing.generatedBills');
		}

	})();

	// Function Definition

	function prepareScopeByMode(){
		try {
			vm.billType = $stateParams.data && $stateParams.data.billType || 'Actual Bill';
			vm.hideBillTypeOpt = $stateParams.data.hideBillTypeOpt || false;

			if ($stateParams.data.billNo) {
				vm.billBookInfo = {
					_id: $stateParams.data.stationaryId,
					bookNo: vm.billNo = $stateParams.data.billNo
				};
			}

			if (vm.billType === 'Supplementary Bill') {
				vm.suppBillType = true;
				vm.hideBillTypeOpt = true;
			} else
				vm.suppBillType = false;

			if ($stateParams.data && $stateParams.data.aGrData) { // Add Bill
				vm.editMode = false;
				vm.addMode = true;
				vm.billingParty = $stateParams.data.billingParty || $stateParams.data.aGrData[0].billingParty;
				vm.billNo = $stateParams.data.billNo;
				vm.branch = $stateParams.data.aGrData && $stateParams.data.aGrData[0] && $stateParams.data.aGrData[0].branch;
				getCostCenter();

				$stateParams.data.aGrData.forEach(oGr => {
					vm.aItems.push(transformGrToBill(oGr));
				});

			} else if ($stateParams.data.oBill) { //Preparing data for Editing Bill

				vm.editMode = true;
				vm.addMode = false;
				vm.operationType = $stateParams.data.operationType;
				let oBill = $stateParams.data.oBill;

				vm.billingParty = oBill.billingParty;
				vm.refNo = oBill.refNo;
				vm.tripNo = oBill.tripNo;
				vm.remarks = oBill.remarks;
				vm.billNo = oBill.billNo;
				vm.ccBranch = oBill.ccBranch;
				vm.sacCode = oBill.sacCode;
				// vm.branch = {_id: oBill.branch, billCC: oBill.ccBranch};
				vm.stationaryId = oBill.stationaryId;
				oBill.billDate && (vm.billDate = new Date(oBill.billDate));
				oBill.dueDate && (vm.dueDate = new Date(oBill.dueDate));
				oBill.submitionDate && (vm.submitionDate = new Date(oBill.submitionDate));
				oBill.reciveDate && (vm.reciveDate = new Date(oBill.reciveDate));
				vm.batchNumber = oBill.batchNumber;
				vm.aItems = oBill.items.map(o => {
					let obj = {...o};
					if (!obj.gr && obj.grData)
						obj.gr = obj.grData;
					if($scope.$configs.costCenter && $scope.$configs.costCenter.show && obj.gr && obj.gr._id){
						if (!o.gr.vehicle.costCenter)
							throw new Error(`Cost Center Not linked on Vehicle ${o.gr.vehicle_no}`);
						else
							obj.ccVehicle = o.gr.vehicle.costCenter;
					}

					return obj;
				});
				if(oBill.branch && oBill.branch._id)
					vm.branch = oBill.branch;
				if(!vm.ccBranch)
					getCostCenter();

				vm.oldTotalAmount = oBill.totalAmount;
				vm.billAmount = oBill.billAmount;
				vm.adjAmount = oBill.adjAmount;

				vm.billBookInfo = {
					_id: vm.stationaryId,
					bookNo: vm.billNo
				};

				vm.adjDebitAc = {
					_id: oBill.adjDebitAc && oBill.adjDebitAc._id || oBill.adjDebitAc,
					name: oBill.adjDebitAcName
				};

				if (!(vm.aItems[0] && vm.aItems[0].gr && vm.aItems[0].gr._id))
					vm.amtWithoutGR = vm.oBill.amount || 0;

				vm.clientAccount = ($scope.$configs && $scope.$configs.client_allowed || []).find(o => o.clientId === vm.billingParty.clientId);
				if(oBill.acknowledge){
					if(oBill.acknowledge.salesAccount && (vm.clientAccount && vm.clientAccount.salesAccWithoutGST) && !oBill.cGST && !oBill.sGST && !oBill.iGST)
						getAccountById(vm.clientAccount.salesAccWithoutGST)
							.then(aData => vm.salesAcccount = aData[0]);

					if(vm.clientAccount.salesAcc || oBill.acknowledge.salesAccount)
						getAccountById(vm.clientAccount.salesAcc || oBill.acknowledge.salesAccount)
							.then(aData => vm.salesAcccount = aData[0]);

					if(oBill.acknowledge.cGSTAccount)
						getAccountById(oBill.acknowledge.cGSTAccount)
							.then(aData => vm.cGSTAccount = aData[0]);

					if(oBill.acknowledge.sGSTAccount)
						getAccountById(oBill.acknowledge.sGSTAccount)
							.then(aData => vm.sGSTAccount = aData[0]);

					if(oBill.acknowledge.iGSTAccount)
						getAccountById(oBill.acknowledge.iGSTAccount)
							.then(aData => vm.iGSTAccount = aData[0]);

					if(oBill.acknowledge.adjDebitAc)
						getAccountById(oBill.acknowledge.adjDebitAc)
							.then(aData => vm.adjDebitAc = aData[0]);
				}
			}

			if (vm.billType === 'Provisional Bill') {
				vm.aBillType.splice(vm.aBillType.indexOf('Actual Bill'), 1)
			}

			onChangeBillType();

			vm.clientAccount = ($scope.$configs && $scope.$configs.client_allowed || []).find(o => o.clientId === vm.billingParty.clientId);
			vm.clientAccount = vm.clientAccount || {};
			let flag = true;
			vm.doesDefaultAccountConfigExists = true;

			if (vm.clientAccount && vm.clientAccount.salesAccWithoutGST && vm.clientAccount.salesAcc && vm.clientAccount.salesAccName && !vm.cGST && !vm.sGST && !vm.iGST ) {
				vm.salesAcccount = {_id: vm.clientAccount.salesAccWithoutGST, name: vm.clientAccount.salesAccWithoutGSTName};
			}else if (vm.clientAccount.salesAcc && vm.clientAccount.salesAccName) {
				vm.salesAcccount = {_id: vm.clientAccount.salesAcc, name: vm.clientAccount.salesAccName};
			}else
				vm.doesDefaultAccountConfigExists = false

			if (vm.clientAccount.cgstAcc && vm.clientAccount.cgstAccName) {
				vm.cGSTAccount = {_id: vm.clientAccount.cgstAcc, name: vm.clientAccount.cgstAccName};
			}else
				vm.doesDefaultAccountConfigExists = false

			if (vm.clientAccount.sgstAcc && vm.clientAccount.sgstAccName) {
				vm.sGSTAccount = {_id: vm.clientAccount.sgstAcc, name: vm.clientAccount.sgstAccName};
			}else
				vm.doesDefaultAccountConfigExists = false

			if (vm.clientAccount.igstAcc && vm.clientAccount.igstAccName) {
				vm.iGSTAccount = {_id: vm.clientAccount.igstAcc, name: vm.clientAccount.igstAccName};
			}else
				vm.doesDefaultAccountConfigExists = false

			if (vm.clientAccount.adjAcc && vm.clientAccount.adjAccName) {
				vm.adjDebitAc = {_id: vm.clientAccount.adjAcc, name: vm.clientAccount.adjAccName};
			}

			if (!vm.aItems[0].gr._id)
				vm.aItems = [];

			calculateTax();

		} catch (e) {
			swal('Error', e && e.message || e.toString(), 'error');
			console.error(e.toString());
			$state.go('billing.bills');
			return;
		}
	}

	function onBranchSelect(){
		getCostCenter();
	}

	function getCostCenter() {
		if(!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if(!(vm.branch && vm.branch._id))
			return;

		accountingService.getCostCenter({
			branch: vm.branch._id,
			feature: "Bill",
			projection: {_id: 1, name: 1, category: "$category.name"}
		}, (res) => {
			if(res.data.length)
				vm.ccBranch = res.data[0];
			else{
				swal('Error', "Cost Center Not linked on Branch", 'error');
				$state.go('billing.bills');
			}
		}, (res) => console.error(res));
	}

	function setPercent(){
		vm.aItems.forEach(oItem => {
			if(vm.billPercent > oItem.allowedPercent)
				oItem.billPercent = 0;
			else
				oItem.billPercent = vm.billPercent;
		});
		vm.calculateTax();
	}

	function transformGrToBill(oGr) {
		let obj = {
			gr: oGr,
			totFreight: oGr.totalFreight,
		};

		if($scope.$configs.costCenter) {
			if ($scope.$configs.costCenter && !(oGr.trip.vehicle.costCenter && oGr.trip.vehicle.costCenter._id))
				throw new Error(`Cost Center Not linked on Vehicle ${oGr.trip.vehicle_no}`);
			obj.ccVehicle = oGr.trip.vehicle.costCenter
		}

		if (vm.billType == 'Supplementary Bill') {
			obj.selectedSupply = [];
			obj.supplementaryBill = {
				basicFreight:  0,
				totalCharges:  0,
				totalDeduction:  0,
				charges:  {},
				deduction:  {},
			};
			oGr.supplementaryBill = oGr.supplementaryBill || {};
			oGr.selectedSupply = oGr.selectedSupply || [];

			if(oGr.supplementaryBill.charges){
				for (let [key, value] of Object.entries(oGr.supplementaryBill.charges)){
					if(!(oGr.selectedSupply.indexOf(key) + 1)){
						obj.selectedSupply.push(key);
						obj.supplementaryBill.charges[key] = value;
						obj.supplementaryBill.totalCharges += value;
					}
				}
			}
			if(oGr.supplementaryBill.deduction){
				for (let [key, value] of Object.entries(oGr.supplementaryBill.deduction)){
					if(!(oGr.selectedSupply.indexOf(key) + 1)){
						obj.selectedSupply.push(key);
						obj.supplementaryBill.deduction[key] = value;
						obj.supplementaryBill.totalDeduction += value;
					}
				}
			}
			if(oGr.supplementaryBill.basicFreight){
				if(!(oGr.selectedSupply.indexOf('basicFreight') + 1)){
					obj.selectedSupply.push('basicFreight');
					obj.supplementaryBill.basicFreight = oGr.supplementaryBill.basicFreight;
				}
			}
			// obj.supplementaryBill = {
			// 	basicFreight: oGr.supplementaryBill.basicFreight || 0,
			// 	totalCharges: oGr.supplementaryBill.totalCharges || 0,
			// 	totalDeduction: oGr.supplementaryBill.totalDeduction || 0,
			// 	charges: oGr.supplementaryBill.charges || {},
			// 	deduction: oGr.supplementaryBill.deduction || {},
			// };
		}

		return obj;
	}

	function extractFormulaExpr() {
		vm.aFormulaExpr = [];
		for (let [key, val] of Object.entries(vm.__FormList)) {
			if (val.evalExp) {
				vm.aFormulaExpr.push({
					...val,
					key
				});
			}
		}

		for (let i = 1; i < vm.aFormulaExpr.length; i++) {
			let obj = vm.aFormulaExpr[i];
			for (let j = 0; j < i; j++) {
				let exp = vm.aFormulaExpr[j].evalExp;
				if (Array.isArray(exp) && (exp.indexOf(obj.key) + 1)) {
					vm.aFormulaExpr.splice(j, 0, vm.aFormulaExpr.splice(i, 1)[0]);
				}
			}
		}
	}

	function getFormList() {
		let id = false;

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...id.configs};
			extractFormulaExpr();
		} else
			confService.get(id, function (response) {
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
				extractFormulaExpr();
			});

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...id.configs};
		} else
			confService.get(id, function (response) {
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
				// applyCss();
			});
	}

	function setPaymentBasis() {
		vm.selectedGr.invoices.forEach(oInv => {
			oInv.paymentBasis = vm.selectedGr.payment_basis || undefined;
		});
	}

	function getAllBranchSearch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

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

	function refreshRate() {
		vm.selectedGr = vm.aItems[0].gr;
		vm.__FormList = $scope.$configs.GR.config;
		getFormList();
		vm.aItems.forEach(oItem => {

			vm.selectedGr = oItem.gr;
			if (!vm.selectedGr.customer || !vm.selectedGr.grDate || !vm.selectedGr.acknowledge || !vm.selectedGr.acknowledge.source || !vm.selectedGr.acknowledge.destination)
				return;

			for (let i = 0; i < vm.selectedGr.invoices.length; i++) {
				fetchRateChart(vm.selectedGr.invoices[i], vm.selectedGr)
			}

		});
	}

	async function fetchRateChart(invoice, gr) {

		if (!invoice.material || !invoice.material.groupCode)
			return;

		let request = {};

		if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
			request.source = vm.selectedGr.acknowledge.source;
		if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
			request.destination = vm.selectedGr.acknowledge.destination;
		if (invoice.material && invoice.material.groupCode)
			request.materialGroupCode = invoice.material.groupCode;
		if (vm.selectedGr.customer && vm.selectedGr.customer._id)
			request.customer = vm.selectedGr.customer._id;
		if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
			request.to = new Date(vm.selectedGr.grDate).toISOString() || '';


		let res = await CustomerRateChartService.getAggr(request);
		if (res) {
			invoice.aRateChart = res.data || [];
			if (invoice.aRateChart[0] && invoice.aRateChart[0].baseRate && invoice.aRateChart[0].baseRate.length) {
				invoice.aCapacity = invoice.aRateChart[0].baseRate.filter(o => !!o.baseVal);
			} else {
				invoice.aCapacity = invoice.aRateChart.map(o => ({
					rate: o.rate,
					baseVal: o.baseValue,
					label: o.baseValueLabel
				})).filter(o => !!o.baseVal);
			}

			if (invoice.aRateChart.length === 0) {
				invoice.aCapacity = vm.__FormList.capacity.aValue && vm.__FormList.capacity.aValue.map(o => ({
					rate: invoice.rate || 0,
					baseVal: 0,
					label: o
				})) || {};
			}

			if (invoice.aCapacity.length && !(invoice.dummyCapacityObj && invoice.dummyCapacityObj.label)) {
				invoice.dummyCapacityObj = invoice.aCapacity[0];
				// calculateRate(invoice,gr);
			}

			invoice.aRateChart.sort((a, b) => a.baseValue - b.baseValue);
			calculateRate(invoice, gr);
			if (res.data)
				updateGr(gr);
			calculateTax();
		}
		// calculateTax();
	}

	function updateGr(gr) {
		vm.selectedGr = gr;

		vm.selectedGr.basicFreight = $filter('getArrayElementSum')(vm.selectedGr.invoices, 'freight');
		vm.selectedGr.totalDeduction = $filter('sumOfObject')(vm.selectedGr.deduction);
		vm.selectedGr.totalCharges = $filter('sumOfGrChargesWithTax')(vm.selectedGr.charges, vm.__FormList);
		vm.selectedGr.totalFreight = vm.selectedGr.basicFreight + vm.selectedGr.totalCharges - vm.selectedGr.totalDeduction;
		vm.selectedGr.totalChargesWithoutTax = $filter('sumOfGrChargesWithoutTax')(vm.selectedGr.charges, vm.__FormList);
		vm.selectedGr.totalDeductionWithoutTax = $filter('sumOfGrChargesWithoutTax')(vm.selectedGr.totalDeduction, vm.__FormList);
		vm.selectedGr.iGst = ((vm.selectedGr.totalFreight *
			vm.selectedGr.iGST_percent / 100 || 0));
		vm.selectedGr.sGst = ((vm.selectedGr.totalFreight *
			vm.selectedGr.sGST_percent / 100 || 0));
		vm.selectedGr.cGst = ((vm.selectedGr.totalFreight *
			vm.selectedGr.cGST_percent / 100 || 0));
		vm.selectedGr.totalAmount = ((vm.selectedGr.totalFreight + vm.selectedGr.iGst + vm.selectedGr.cGst +
			vm.selectedGr.sGst));

		if (vm.selectedGr.invoices.length) {

			if (vm.selectedGr.totalFreight < 0)
				return swal('Error', 'Total Freight should be grater than 0', 'error');
			let flag = false;
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(oInv => {
					if (oInv.paymentBasis !== vm.selectedGr.payment_basis)
						flag = true
				});
			}
			if (flag)
				return swal('Error', 'PaymentBasis should be same for all Item`s', 'error');
		}

		// Client wise validation
		if ($scope.$configs.GR.validation && $scope.$configs.GR.validation.ewayBill) {

			if (vm.selectedGr.eWayBills.length == 0)
				return swal('Error', 'E-WayBill Expiry and Number are Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].number)
				return swal('Error', 'E-WayBill Number is Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].expiry)
				return swal('Error', 'E-WayBill Expiry is Mandatory', 'error');

			if (vm.selectedGr.eWayBills[0].number) {
				if (vm.selectedGr.eWayBills[0].number.length < 15)
					return swal('Error', 'E-WayBill Number length should not be less than 15', 'error');
			}
		}
		// Validation END

		if (vm.selectedGr.totalFreight > $scope.$constants.grFreight) {

			return swal('Error', `Bill Amount is cannot be grater than ${$scope.$constants.grFreight}`, 'error')

		} else if (vm.selectedGr.totalFreight > 300000) {
			swal({
					title: 'Bill Amount is Grater Than 3 Lakhs. Are you sure you want to continue?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: 'rgb(94, 192, 222);',
					confirmButtonText: 'Yes!',
					closeOnConfirm: false
				},
				function (isConfirmU) {
					if (isConfirmU) {
						makeRequest();
					}
				});
		} else {
			makeRequest();
		}

		function makeRequest() {

			// setPodModelTime();

			let request = {
				...vm.selectedGr,
				gr_type: 'Own',
				//grDate: new Date(new Date(vm.selectedGr.grDate), 'DD/MM/YYYY'),
				grDate: new Date(vm.selectedGr.grDate),
				customer: vm.selectedGr.customer._id,
				consignor: vm.selectedGr.consignor && vm.selectedGr.consignor._id || undefined,
				consignee: vm.selectedGr.consignee && vm.selectedGr.consignee._id || undefined,
				billingParty: vm.selectedGr.billingParty && vm.selectedGr.billingParty._id || undefined,
				branch: vm.selectedGr.branch
			};

			vm.selectedGr.invoices.forEach((invObj, index) => {
				if (typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
					request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
				if (typeof invObj.billingNoOfUnits === 'undefined' && invObj.noOfUnits)
					request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
				if (invObj.invoiceDate)
					request.invoices[index].invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
			});
			if (request) {
				tripServices.updateGRservice(request, success, failure);
			}

			function success(res) {
				var message = res.data.message;
			}

			function failure(res) {
				swal('Error', res.data.message, 'error');
			}
		}

	}

	function setPaymentBasis(gr) {
		gr.invoices.forEach(oInv => {
			oInv.paymentBasis = gr.payment_basis || undefined;
		});
	}

	function calculateRate(oInvoice, gr) {

		if (oInvoice.dummyCapacityObj) {
			oInvoice.baseValueLabel = oInvoice.dummyCapacityObj.label;
			oInvoice.capacity = oInvoice.dummyCapacityObj.baseVal || 0;
		}

		if (!oInvoice.aRateChart)
			return;

		let baseValToCheck;

		try {
			if (vm.__FormList.capacity.visible)
				baseValToCheck = oInvoice.capacity;
			else
				baseValToCheck = oInvoice.noOfUnits || 0;

		} catch (e) {
			baseValToCheck = oInvoice.noOfUnits || 0;
		}

		if (typeof baseValToCheck === 'undefined')
			return false;

		setPaymentBasis(gr);

		let aRateChart = oInvoice.aRateChart || [];
		let foundRateChart;
		let foundRate;

		aRateChart.find(rateChart => {

			if (!Array.isArray(rateChart.baseRate) || !rateChart.baseRate.length) {

				if (baseValToCheck <= rateChart.baseValue) {
					foundRate = {
						baseVal: rateChart.baseValue,
						rate: rateChart.rate,
						baseValLabel: rateChart.baseValueLabel
					};
				}

			} else {
				foundRate = rateChart.baseRate.find(oRate => {
					if (baseValToCheck <= oRate.baseVal)
						return true;
					return false
				});
			}

			if (!foundRate)
				return false;

			foundRateChart = rateChart;
			return true
		});

		if (!foundRateChart && !foundRate && aRateChart[0]) {
			foundRateChart = aRateChart.slice(-1)[0];

			if (Array.isArray(foundRateChart.baseRate) && foundRateChart.baseRate.length)
				foundRate = foundRateChart.baseRate.slice(-1)[0];
			else {
				foundRate = {
					baseVal: foundRateChart.baseValue,
					rate: foundRateChart.rate,
					baseValLabel: foundRateChart.baseValueLabel
				};
			}

		}

		if (oInvoice && foundRateChart && foundRate)
			applyRates(oInvoice, foundRateChart, foundRate, gr);
	}

	function applyRates(oInvoice, foundRate, baseRate, gr) {

		if (baseRate.baseVal)
			gr.acknowledge.baseValue = oInvoice.baseValue = baseRate.baseVal;

		if (baseRate.baseValLabel)
			oInvoice.baseValueLabel = baseRate.baseValLabel;

		if (baseRate.rate)
			gr.acknowledge.rateChartRate = oInvoice.rate = oInvoice.rateChartRate = baseRate.rate;


		if (foundRate.routeDistance)
			gr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.invoiceRate)
			oInvoice.invoiceRate = foundRate.invoiceRate;

		if (foundRate.insurRate)
			oInvoice.insurRate = foundRate.insurRate;

		if (foundRate.grCharges && foundRate.grCharges.rate)
			gr.charges.grCharges = foundRate.grCharges.rate;
		if (foundRate.surCharges && foundRate.surCharges.rate)
			gr.charges.surCharges = foundRate.surCharges.rate;
		if (foundRate.cartageCharges && foundRate.cartageCharges.rate)
			gr.charges.cartageCharges = foundRate.cartageCharges.rate;
		if (foundRate.labourCharges && foundRate.labourCharges.rate)
			gr.charges.labourCharges = foundRate.labourCharges.rate;
		if (foundRate.otherCharges && foundRate.otherCharges.rate)
			gr.charges.other_charges = foundRate.otherCharges.rate;
		if (foundRate.prevFreightCharges && foundRate.prevFreightCharges.rate)
			gr.charges.prevFreightCharges = foundRate.prevFreightCharges.rate;
		if (foundRate.detentionLoading && foundRate.detentionLoading.rate)
			gr.loadingDetentionRate = foundRate.detentionLoading.rate;
		if (foundRate.detentionUnloading && foundRate.detentionUnloading.rate)
			gr.unloadingDetentionRate = foundRate.detentionUnloading.rate;
		if (foundRate.discount && foundRate.discount.rate)
			gr.deduction.discount = foundRate.discount.rate;

		if (foundRate.loading_charges && foundRate.loading_charges.rate)
			gr.charges.loading_charges = foundRate.loading_charges.rate;
		if (foundRate.unloading_charges && foundRate.unloading_charges.rate)
			gr.charges.unloading_charges = foundRate.unloading_charges.rate;
		if (foundRate.weightman_charges && foundRate.weightman_charges.rate)
			gr.charges.weightman_charges = foundRate.weightman_charges.rate;
		if (foundRate.overweight_charges && foundRate.overweight_charges.rate)
			gr.charges.overweight_charges = foundRate.overweight_charges.rate;
		if (foundRate.advance_charges && foundRate.advance_charges.rate)
			gr.deduction.advance_charges = foundRate.advance_charges.rate;
		if (foundRate.damage && foundRate.damage.rate)
			gr.deduction.damage = foundRate.damage.rate;
		if (foundRate.shortage && foundRate.shortage.rate)
			gr.deduction.shortage = foundRate.shortage.rate;
		if (foundRate.penalty && foundRate.penalty.rate)
			gr.deduction.penalty = foundRate.penalty.rate;
		if (foundRate.extra_running && foundRate.extra_running.rate)
			gr.charges.extra_running = foundRate.extra_running.rate;
		if (foundRate.dala_charges && foundRate.dala_charges.rate)
			gr.charges.dala_charges = foundRate.dala_charges.rate;
		if (foundRate.diesel_charges && foundRate.diesel_charges.rate)
			gr.charges.diesel_charges = foundRate.diesel_charges.rate;
		if (foundRate.kanta_charges && foundRate.kanta_charges.rate)
			gr.charges.kanta_charges = foundRate.kanta_charges.rate;
		if (foundRate.factory_halt && foundRate.factory_halt.rate)
			vm.selectedGr.charges.factory_halt = foundRate.factory_halt.rate;
		if (foundRate.company_halt && foundRate.company_halt.rate)
			gr.charges.company_halt = foundRate.company_halt.rate;
		if (foundRate.toll_charges && foundRate.toll_charges.rate)
			gr.charges.toll_charges = foundRate.toll_charges.rate;
		if (foundRate.green_tax && foundRate.green_tax.rate)
			gr.charges.green_tax = foundRate.green_tax.rate;

		if (foundRate.internal_rate && foundRate.internal_rate.rate)
			gr.internal_rate = foundRate.internal_rate.rate;
		if (foundRate.standardTime && foundRate.standardTime.rate)
			gr.standardTime = foundRate.standardTime.rate;

		gr.payment_basis = oInvoice.paymentBasis = foundRate.paymentBasis ? foundRate.paymentBasis : gr.payment_basis;
		eval(oInvoice, gr);

		if ((oInvoice.paymentBasis && oInvoice.paymentBasis.toLowerCase() || '') == 'fixed')
			oInvoice.freight = oInvoice.rate;

		if (foundRate.incentive && foundRate.incentive.rate) {

			switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
				case 'Master': {
					if (!gr.grDate || !gr.customer || !foundRate.incentive || !foundRate.incentive.rate)
						return;

					// Handle failure response
					function onFailure(response) {
						console.log(response);
					}

					// Handle success response
					function onSuccess(response) {
						vm.incentivePercent = (response && response.data && response.data.rate) || 0;
						// updateOnFreightChange();
					}

					incentiveService.autosuggest({
						customer: gr.customer._id,
						vehicle: gr.vehicle,
						date: new Date(vm.selectedGr.grDate).toISOString(),
					}, onSuccess, onFailure);

					break;
				}

				default:
					if (!vm.incentiveButtonClicked) {
						vm.incentiveButtonClicked = false;
						return;
					}

					switch (foundRate.incentive.basis) {

						case 'Percent of basic freight':
							vm.incentivePercent = foundRate.incentive.rate;
							// updateOnFreightChange();
							break;

						case 'Fixed':
							gr.charges.incentive = foundRate.incentive.rate;
							break;

						default:
							if (typeof gr.incentivePercent != "number")
								return;

							let aExp = vm.__FormList.incentive.evalExp.map(e => {
								if (e.toString().indexOf('(RC)') + 1)
									return $parse(e.replace('(RC)', ''))(foundRate);
								return e;
							});

							gr.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
					}

			}
		}
	}

	function eval(invoice, gr) {

		// let {gr, __FormList, aRateChart, aFormulaExpr, invoice} = this.state;
		// console.log('[invoice]', invoice);
		vm.aFormulaExpr.forEach(o => {
			let str = '';
			o.evalExp.forEach(s => {
				let temp;

				if (s === '+' || s === '*' || s === '/' || s === '-' || s === '(' || s === ')')
					str += s;
				else if (typeof s === 'number')
					str += s;
				else if ((index = s.indexOf('(RC)')) + 1) {
					let key = s.slice(0, index);
					str += (invoice['rateChart' + key[0].toUpperCase() + key.slice(1)] || invoice[key]);
				} else {
					let value = invoice[s] || gr[s] || 0;
					str += value;
				}
			});
			let value = $scope.$eval(str);
			invoice[o.key] = Number(value.toFixed(2));
		});
	}

	function calculateTax() {

		let sumOfAllGrFreight = 0;
		let sumOfAllGrChargesWithoutTax = 0;

		vm.aItems.forEach(oItem => {

			oItem.totFreight = 0;
			oItem.totalCharges = 0;
			oItem.totalDeduction = 0;
			oItem.totalChargesWithoutTax = 0;
			oItem.basicFreight = 0;

			if (vm.billType == 'Supplementary Bill') {

				oItem.supplementaryBill = oItem.supplementaryBill || oItem.gr.supplementaryBill || {}; // TODO Remove temp hack

				oItem.basicFreight = oItem.supplementaryBill.basicFreight || 0;
				oItem.totalCharges = oItem.supplementaryBill.totalCharges || 0;
				oItem.totalDeduction = oItem.supplementaryBill.totalDeduction || 0;
				oItem.totFreight = oItem.basicFreight + oItem.totalCharges - oItem.totalDeduction;
				oItem.cwt = 0;

			} else {

				oItem.basicFreight = oItem.gr.basicFreight;
				oItem.totalCharges = oItem.gr.totalCharges;
				oItem.cwt = oItem.totalChargesWithoutTax = oItem.gr.totalChargesWithoutTax || 0;
				oItem.totalDeduction = oItem.gr.totalDeduction;
				if (oItem.billPercent)
					oItem.totFreight = oItem.gr.totalFreight * oItem.billPercent / 100;
				else
					oItem.totFreight = oItem.gr.totalFreight;
			}

			//oItem.totFreight = Math.round2(oItem.totFreight, 2);
			sumOfAllGrFreight += (oItem.totFreight || 0);
			sumOfAllGrChargesWithoutTax += (oItem.totalChargesWithoutTax || 0);
		});


		vm.amount = sumOfAllGrFreight;
		extractTaxPercent();

		// if((vm.billType == 'Supplementary Bill' || vm.billType == 'Actual Bill') && !(vm.aItems[0] && vm.aItems[0].gr && vm.aItems[0].gr._id)){
		// 	vm.amount = vm.oBill.amount || 0;
		// 	vm.taxPercent = vm.oBill;
		// }

		vm.totCwt = sumOfAllGrChargesWithoutTax;
		vm.cGST_percent = vm.taxPercent.cGST_percent || 0;
		vm.cGST = Math.round((vm.amount * vm.cGST_percent / 100) * 100) / 100;
		vm.sGST_percent = vm.taxPercent.sGST_percent || 0;
		vm.sGST = Math.round((vm.amount * vm.sGST_percent / 100) * 100) / 100;
		vm.iGST_percent = vm.taxPercent.iGST_percent || 0;
		vm.iGST = Math.round((vm.amount * vm.iGST_percent / 100) * 100) / 100;
		vm.totalAmount = Math.round((vm.amount + vm.cGST + vm.sGST + vm.iGST + (sumOfAllGrChargesWithoutTax || 0)) * 100) / 100;
		if (vm.oldTotalAmount != vm.totalAmount)
			vm.billAmount = vm.totalAmount;
	}

	function onChangeBillType() {
		if (vm.billType === 'Provisional Bill') {
			vm.aItems.forEach(oItem => {
				if (Array.isArray(oItem.gr.provisionalBill)) {
					oItem.appliedPercent = oItem.gr.provisionalBill.reduce((percent, oPov) => {
						if ($stateParams.data.oBill && $stateParams.data.oBill._id == oPov.ref) {
							oItem.billPercent = oPov.percent;
							return percent;
						}
						return percent + oPov.percent
					}, 0);
				}

				oItem.allowedPercent = 100 - oItem.appliedPercent;

				if (!oItem.billPercent)
					oItem.billPercent = oItem.allowedPercent;
			});
			vm.colSpan = 18;
			if($scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
				vm.colSpan++;
		} else {
			vm.aItems.forEach(oItem => {
				oItem.billPercent = 100;
				oItem.allowedPercent = 100;
				oItem.appliedPercent = 0;
			});
			vm.colSpan = 16;
			if($scope.$configs.tripMemo && $scope.$configs.tripMemo.show)
				vm.colSpan++;
		}

		calculateTax();
	}

	function extractTaxPercent() {
		let oItem = vm.aItems.find(o => (o.gr.cGST_percent + o.gr.sGST_percent + o.gr.iGST_percent));

		if (oItem)
			vm.taxPercent = oItem.gr;
		else
			vm.taxPercent = {
				cGST_percent: 0,
				sGST_percent: 0,
				iGST_percent: 0
			}
	}

	function amountCeil() {
		vm.billAmount = Math.ceil(vm.totalAmount);
		vm.adjAmount = vm.totalAmount - vm.billAmount;
	}

	function amountFloor() {
		vm.billAmount = Math.floor(vm.totalAmount);
		vm.adjAmount = vm.totalAmount - vm.billAmount;
	}

	function amountRefresh() {
		vm.billAmount = vm.totalAmount;
		vm.adjAmount = 0;
	}

	function prepareBillPayload(manualBill) {

		let request = {};

		if (vm.addMode) {
			request.type = vm.billType;
			request.billingParty = vm.billingParty;
		} else if (vm.editMode) {
			Object.assign(request, $stateParams.data.oBill);
		}

		//request.billDate = vm.billDate;
		request.billDate = new Date(vm.billDate.setHours(0, 0, 0, 0));
		request.dueDate = vm.dueDate;
		request.submitionDate = vm.submitionDate;
		request.reciveDate = vm.reciveDate;
		request.batchNumber = vm.batchNumber;
		request.ccBranch = vm.ccBranch;
		request.refNo = vm.refNo || '';
		request.tripNo = vm.tripNo || '';
		request.billNo = vm.billNo;
		request.items = vm.aItems;
		request.remarks = vm.remarks || '';
		request.intRemarks = vm.intRemarks || '';
		request.sacCode = vm.sacCode || '';

		if (vm.billType === 'Provisional Bill')
			request.billPercent = vm.billPercent;

		if (vm.clientAccount.salesAccWithoutGST && vm.clientAccount.salesAccWithoutGSTName && !vm.cGST && !vm.sGST && !vm.iGST ) {
			request.salesAccountName = vm.clientAccount.salesAccWithoutGSTName;
			request.salesAccount = vm.clientAccount.salesAccWithoutGST;
		}else if (vm.clientAccount.salesAcc && vm.clientAccount.salesAccName) {
			request.salesAccountName =  vm.clientAccount.salesAccName;
			request.salesAccount = vm.clientAccount.salesAcc;
		}else if(vm.salesAcccount && vm.salesAcccount._id && vm.salesAcccount.name){
			request.salesAccountName = vm.salesAcccount && vm.salesAcccount.name;
			request.salesAccount = vm.salesAcccount && vm.salesAcccount._id;
		}


		request.iGSTAccountName = vm.iGSTAccount && vm.iGSTAccount.name || vm.clientAccount.igstAccName;
		request.cGSTAccountName = vm.cGSTAccount && vm.cGSTAccount.name || vm.clientAccount.cgstAccName;
		request.sGSTAccountName = vm.sGSTAccount && vm.sGSTAccount.name || vm.clientAccount.sgstAccName;
		request.adjDebitAcName = vm.adjDebitAc && vm.adjDebitAc.name || vm.clientAccount.adjAccName;
		request.woAccName = vm.clientAccount.woAccName;
		// request.salesAccount = vm.salesAcccount && vm.salesAcccount._id || vm.clientAccount.salesAcc;
		request.iGSTAccount = vm.iGSTAccount && vm.iGSTAccount._id || vm.clientAccount.igstAcc;
		request.cGSTAccount = vm.cGSTAccount && vm.cGSTAccount._id || vm.clientAccount.cgstAcc;
		request.sGSTAccount = vm.sGSTAccount && vm.sGSTAccount._id || vm.clientAccount.sgstAcc;
		request.adjDebitAc = vm.adjDebitAc && vm.adjDebitAc._id || vm.clientAccount.adjAcc;
		request.woAcc = vm.clientAccount.woAcc;

		if (vm.billBookInfo && vm.billBookInfo._id)
			request.stationaryId = vm.billBookInfo && vm.billBookInfo._id;
		else if(!manualBill)
			return swal('Error', 'Invalid Bill No', 'error');

		request.amount = vm.amount;

		request.totCwt = vm.totCwt;
		request.cGST = vm.cGST;
		request.sGST = vm.sGST;
		request.iGST = vm.iGST;
		request.cGST_percent = vm.cGST_percent;
		request.sGST_percent = vm.sGST_percent;
		request.iGST_percent = vm.iGST_percent;

		request.totalAmount = vm.totalAmount;
		request.billAmount = vm.billAmount;
		request.adjAmount = Math.round((vm.adjAmount) * 100) / 100;

		return request;
	}

	function updateBill(approve) {

		if(isNotValid())
			return ;

		if (vm.billAmount <= 0) {
			return swal('Error', 'Bill Amount should be grater than 0', 'error');
		}

		let manualBill = $scope.$configs.UnBilledGr && $scope.$configs.UnBilledGr.manualBill;

		let request = prepareBillPayload(manualBill);

		if(vm.branch && vm.branch._id){
			request.branch = vm.branch._id;
			request.branchName = vm.branch.name;
		}
		if(request.adjAmount && !request.adjDebitAc)
			return swal('Warning', 'Adjustment A/c required', 'warning');

		let subAmount = Math.abs(request.totalAmount - request.billAmount);
		if (subAmount > 2)
			return swal('Warning', 'Bill Amount and Total Amount can`t be differ more than 2₹ ...contact your administrator to obtain permission', 'warning');

		request.items = vm.aItems.map(o => ({
			...o,
			tMemoReceipt: o.gr.tMemoReceipt,
			gr: o.gr._id
		}));

		if (approve) {
			request.approve = true;
			request.remark = `Bill No:${request.billNo}, Approval Date: ${moment().format("DD/MM/YYYY")}, Party: ${vm.billingParty.name}`;
		}

		billsService.updateBill(request, success, failure);

		function success(response) {
			console.log(response);
			swal(response.data.message);
			$state.go('billing.generatedBills');
		}

		function failure(response) {
			console.log(response);
			swal('Error', response.data.message, 'error');
		}
	}

	function getAccount(name, group) {
		return new Promise(function (resolve, reject) {

			let oFilter = {
				no_of_docs: 10,
				name: name,
				group
			}; // filter to send

			accountingService.getAccountMasterDebounce(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {

			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}

		});
	}

	function getAccountById(_id) {
		return new Promise(function (resolve, reject) {

			if(!_id)
				resolve([]);

			let oFilter = {
				_id
			}; // filter to send

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {

			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}

		});
	}

	 function isNotValid(){

		// if (vm.billAmount <= 0) {
		// 	return swal('Error', 'Bill Amount should be grater than 0', 'error');
		// }

		if (vm.dueDate && vm.submitionDate) {
			if ((vm.dueDate < vm.submitionDate)) {
				swal('Error', 'Due Date should be greater than submition', 'error');
				return true;
			}
		}

		if (vm.dueDate && vm.billDate) {
			if ((vm.dueDate < vm.billDate)) {
				swal('Error', 'Due Date should be greater than bill date', 'error');
				return true;
			}
		}

		if (vm.submitionDate && vm.billDate) {
			if ((vm.submitionDate < vm.billDate)) {
				swal('Error', 'Submition Date should be greater than bill date', 'error');
				return true;
			}
		}

		vm.flag = false;
		if (vm.aItems && vm.aItems.length) {
			vm.aItems.forEach(obj => {
				if (new Date(obj.gr.grDate) > new Date(vm.billDate)) {
					vm.flag = true;
				}
			});
		}
		if (vm.flag) {
			swal('Error', 'Bill Date should be greater than GR Date', 'error');
			return true;
		}

		if (!vm.billingParty || !vm.billingParty.name) {
			swal('Error', 'No Billing Party Selected', 'error');
			return true;
		}

		if(vm.totCwt && !(vm.clientAccount.woAcc && vm.clientAccount.woAccName)){
			swal('Error', 'Without Tax Amount Found. But, Without Tax A/c not linked', 'error');
			return true;
		}

		if($scope.$configs.costCenter && $scope.$configs.costCenter.show){
			if(!vm.ccBranch) {
				swal('Error', `Cost Center Not linked on Branch ${vm.branch.name}`, 'error');
				return true;
			}

			let flag = false;
			vm.aItems.find(o => {
				if(!(o.ccVehicle && o.ccVehicle._id)) {
					flag = true;
					swal('Error', `Cost Center Not linked on Vehicle ${o.gr.vehicle.vehicle_reg_no || o.gr.trip.vehicle.vehicle_reg_no}`, 'error');
					return true;
				}
				return false;
			});

			if(flag)
				return flag;
		}

		return false
	}

	function generateBill() {

		if(isNotValid())
			return ;

		if (vm.billAmount <= 0) {
			return swal('Error', 'Bill Amount should be grater than 0', 'error');
		}

		let manualBill = $scope.$configs.UnBilledGr && $scope.$configs.UnBilledGr.manualBill;

		if (!manualBill && (vm.billBookInfo.bookNo != vm.billNo || !vm.billBookInfo)) {
			swal('Error', 'Bill No Required', 'error');
			return;
		}

		if(vm.billType === 'Actual Bill')
			vm.billPercent = 0;

		if (vm.billPercent === 100) {

			return swal({
					title: 'Are you sure?',
					text: "You want to generate Provision Bill of 100%",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: "#0F9E03",
					confirmButtonText: "Yes",
					closeOnConfirm: true
				},
				function (isConfirmU) {
					if (isConfirmU) {
						genBill();
					}
				});

		}

		if(!vm.billPercent)
			vm.billPercent = Math.min(vm.aItems.map(o => o.billPercent));

		if (vm.billPercent > vm.allowedPercent)
			return swal('Error', 'Bill % should be less than Allowed %', 'error');

		if (vm.billPercent <= 0)
			return swal('Error', 'Bill % should be greater than 0', 'error');

		let request = prepareBillPayload(manualBill);
		if(request.adjAmount && !request.adjDebitAc)
			return swal('Warning', 'Adjustment A/c required', 'warning');
		let subAmount = Math.abs(request.totalAmount - request.billAmount);
		if (subAmount > 2)
			return swal('Warning', 'Bill Amount and Total Amount can`t be differ more than 2₹ ...contact your administrator to obtain permission', 'warning');

		if (!manualBill && !request.stationaryId)
			return swal('Error', 'Invalid Bill Number', 'error');

		if(vm.branch){
			request.branch = vm.branch;
		}

		genBill();

		function genBill() {
			previewBill(request)
				.then(function (res) {

					request.billingParty = request.billingParty._id;
					if(vm.branch){
						request.branchName = vm.branch.name,
						request.branch = vm.branch._id
					}

					request.items = vm.aItems.map(o => ({
						...o,
						tMemoReceipt: o.gr.tMemoReceipt,
						gr: o.gr._id
					}));
					// request.items.gr.grNumber
					// request.sort = {grNumber: 1};
					if (res === 'approve')
						request.approve = true;

					billsService.generateBill(request, success, failure);

					function success(response) {
						console.log(response);
						if (response.data.status === 'success') {
							swal(response.data.message);
						} else {
							response.data.status = response.data.status || 'bill can`t be approve';
							swal('Warning', response.data.message + 'and ' + response.data.status, 'warning');
						}
						$state.go('billing.generatedBills');
					}

					function failure(response) {
						console.log(response);
					}

				})
				.catch(err => console.log(err));
		}
	}

	function removeGr(oItem) {
		if (vm.aItems.length) {
			let indx = vm.aItems.map(function(e) { return e.gr.grNumber; }).indexOf(oItem.gr.grNumber);
			vm.aItems.splice(indx, 1);
			calculateTax();
		}
	}

	function getGr() {

		if (!vm.filter.grNo && !vm.filter.shipmentNo && !vm.filter.tripNo && !vm.filter.from && !vm.filter.to && !vm.filter.tMNo)
			return;

		if (vm.aItems.find(o => o.gr.grNumber === vm.filter.grNo))
			return swal('Warning', 'Gr Already added!!!', 'warning');

		let oFilter = {
			'billingParty._id': vm.billingParty._id,
			skip: 1,
			no_of_docs: 500,
			// cClientId: $scope.$configs.clientOps,
			bClientId: vm.billingParty.clientId
		};

		if (vm.billType == 'Actual Bill') {
			oFilter["bill"] = {
				$exists: false
			};
		} else if (vm.billType == 'Supplementary Bill') {
			oFilter["supplementaryBillRef"] = {
				$exists: false
			};
		}

		if (vm.filter.grNo)
			oFilter.grNumber = vm.filter.grNo;
		if (vm.filter.shipmentNo)
			oFilter.shipmentNo = vm.filter.shipmentNo;
		if (vm.filter.tripNo)
			oFilter.trip_no = Number(vm.filter.tripNo);
		if (vm.filter.tMNo)
			oFilter.tMNo = vm.filter.tMNo;
		if (vm.filter.from)
			oFilter.from = moment(vm.filter.from, 'DD/MM/YYYY').startOf('day').toISOString();

		if (vm.filter.to)
			oFilter.to = moment(vm.filter.to, 'DD/MM/YYYY').endOf('day').toISOString();

		if ($scope.$configs.GR && $scope.$configs.GR.grAck)
			oFilter['acknowledge.status'] = true;

		if ($scope.$configs.UnBilledGr && $scope.$configs.UnBilledGr.podReceived)
			oFilter['pod.received'] = true;

		oFilter.dateType = "grDate";
		oFilter['isNonBillable'] = false;

		vm.filter = {};

		tripServices.getAllTripGrData(oFilter, success, failure);

		function success(data) {
			if (data.data && data.data.data && data.data.data.length) {

				vm.aItems = data.data.data.reduce((arr, oGr) => {

					if (!arr.find(o => o.gr._id === oGr._id))
						arr.push(transformGrToBill(oGr));

					return arr;

				}, vm.aItems);

				// if(!vm.aItems.find(o => o.gr._id === data.data.data[0]._id))
				// 	data.data.data.forEach(function (oItem) {
				// 		vm.aItems.push(transformGrToBill(oItem));
				// 	});

				// vm.aItems.sort( (a,b) => (a.gr.grNumber) - (b.gr.grNumber) );
				// vm.aItems.sort( (a,b) => (a.gr.trip_no) - (b.gr.trip_no) );


				calculateTax();
			} else {
				swal('Warning', 'No Gr Found', 'warning');
			}
		}

		function failure(res) {
			swal('Some error with GET trips.', '', 'error');
		}
	}

	function grUpsertPopup(gr, index) {

		$modal.open({
			templateUrl: 'views/bills/grUpsertPopup.html',
			controller: [
				'$modal',
				'$modalInstance',
				'$parse',
				'$scope',
				'$stateParams',
				'billBookService',
				'billingPartyService',
				'branchService',
				'CustomerRateChartService',
				'confService',
				'consignorConsigneeService',
				'customer',
				'cityStateService',
				'DatePicker',
				'dateUtils',
				'formulaEvaluateFilter',
				'materialService',
				'otherUtils',
				'stateDataRetain',
				'tripServices',
				'Vehicle',
				'incentiveService',
				'oGr',
				grUpsertPopupController
			],
			controllerAs: 'grUVm',
			size: 'xl',
			resolve: {
				oGr: function () {
					return {
						...gr
					};
				}
			}

		}).result.then(function (response) {
			applyData(response);
		}, function (data) {
			if (data && data.branch)
				applyData(data);
			else
				vm.Gr = undefined;
			vm.billingParty = vm.aItems[index].gr.billingParty;
			calculateTax();
			console.log('cancel', data);
		});

		function applyData(data) {
			vm.aItems[index].gr = data;
			vm.billingParty = vm.aItems[index].gr.billingParty;
			calculateTax();
		}
	}

	function getBillBookNo(viewValue) {

		let bpConfig = $scope.$configs.master && $scope.$configs.master.billingParty && $scope.$configs.master.billingParty.defaultBillBook || false;
        let manualBill = $scope.$configs.UnBilledGr && $scope.$configs.UnBilledGr.manualBill;
		if(viewValue != 'centrailized' && !manualBill && !bpConfig)
			if (!(vm.billingParty && Array.isArray(vm.billingParty.billBook) && vm.billingParty.billBook.length)) {
			swal('Error', `No Stationary Book linked to ${vm.billingParty.name} Billing Party`, 'error');
			return [];
		}

		if (!vm.billDate) {
			swal('Error', `Bill Date is mandatory`, 'error');
			return [];
		}


		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billingParty.billBook[0] && vm.billingParty.billBook[0].ref,
				type: 'Bill',
				useDate: moment(vm.billDate).startOf('day').toDate(),
				cClientId: vm.billingParty.clientId,
				status: 'unused'
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				delete requestObj.bookNo;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
				billBookService.getStationery(requestObj, oSuc, oFail);
			}else if (viewValue === 'auto') {
				requestObj.sch = 'onBook';
				requestObj.auto = true;
				billBookService.getStationery(requestObj, oSuc, oFail);
			}else if(!bpConfig) {
				if (!requestObj.billBookId && !manualBill)
					return vm.nonBillBook = true;
				// return swal('Erorr',`No Stationary Book linked to ${vm.billingParty.name} Billing Party`,'error');

				billBookService.getStationery(requestObj, oSuc, oFail);
			}else{
				delete requestObj.billBookId;
				requestObj.defaultBook = bpConfig;
				billBookService.getStationery(requestObj, oSuc, oFail);
			}

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto'){
					vm.billBookInfo = response.data[0];
					vm.billNo = vm.billBookInfo.bookNo;
				} else
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onBillNoSelect(item) {
		vm.billBookInfo = item;
	}

	function previewBill(oBill) {
		return new Promise(
			function (resolve, reject) {

				$uibModal.open({
					templateUrl: 'views/bills/builtyRender.html',
					controller: 'billRendorCtrl',
					resolve: {
						thatTrip: function () {
							return {
								billPreviewBeforeGenerate: true,
								oBill,
								// showSubmitButton: vm.billType == 'Provisionalbil Bill',
								showSubmitAndApproveButton: true, //vm.billType != 'Provisional Bill',
								//gr: oBill.items[0].gr
								gr: oBill
							};
						}
					}
				}).result.then(function (res) {

					if (res) {
						resolve(res);
					}

					reject(false);
				});
			});
	}

	function editSupplyBill(selectedBill, index) {
		selectedBill.billingParty = vm.billingParty;

		$uibModal.open({
			templateUrl: 'views/bills/editSupplyBill.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'$stateParams',
				'confService',
				'formulaEvaluateFilter',
				'growlService',
				'otherData',
				'tripServices',
				editSupplyBillController
			],
			controllerAs: 'sbVm',

			resolve: {
				otherData: function () {
					return {
						selectedItem: selectedBill,
						// aSelectedCharges: vm.oChargesToLock[selectedBill.gr._id] || {},
						// aSelectedCharges: vm.oChargesToLock || {},
						// oCheckedCharges: vm.oCheckedCharges[selectedBill.gr._id] || {}
						// oCheckedCharges: vm.oCheckedCharges || {}
					};
				}
			}
		}).result.then(function ({res, suppObj}) {
			vm.aItems[index].gr = res;
			vm.aItems[index].totFreight = suppObj.totalFreight;
			vm.aItems[index].selectedSupply = suppObj.selectedSupply;
			vm.aItems[index].supplementaryBill = {
				basicFreight: suppObj.basicFreight,
				totalCharges: suppObj.totalCharges - (suppObj.basicFreight || 0),
				totalDeduction: suppObj.totalDeduction,
				charges: suppObj.charges,
				deduction: suppObj.deduction
			};
			calculateTax();
		});

	}
});

materialAdmin.controller('previewLoadingReceiptCtrl', function (
	$localStorage,
	$rootScope,
	$scope,
	$state,
	$stateParams,
	$uibModal,
	billsService,
	customer,
	DatePicker,
	Routes
) {

	try {
		if ($stateParams.data && !$stateParams.data.oLoadingRecipt) {
			$scope.grData = $stateParams.data;
			$scope.billingParty = $scope.grData.booking.billing_party;
			$scope.route = $scope.grData.acknowledge && $scope.grData.acknowledge.source ? ($scope.grData.acknowledge.source + ' to ' + $scope.grData.acknowledge.destination) : 'NA';
			if (typeof $scope.grData.booking.rate === 'undefined') {
				$scope.grData.rate = $scope.grData.booking.routeData.data.find(function (obj) {
					if (obj.vehicle_type_id === $scope.grData.trip.vehicle.veh_type._id)
						return obj;
				}).rate.vehicle_rate;
			} else {
				$scope.grData.rate = $scope.grData.booking.rate;
			}
			$scope.aItems = $scope.grData;
		} else if ($stateParams.data.oLoadingRecipt) {
			//Preparing data for Editing Bill
			$scope.grData = $stateParams.data.oLoadingRecipt.items[0].gr;
			$scope.billingParty = $stateParams.data.oLoadingRecipt.billingParty;
			$scope.advance = $stateParams.data.oLoadingRecipt.advanceAsked;
			$scope.grData.rate = $stateParams.data.oLoadingRecipt.totalAmount;
			$scope.editBtn = $stateParams.data.edit;
		}
	} catch (e) {
		$state.go('billing.bills');
		// swal('Some Error with Loading Slip');
		console.log(e);
		return;
	}

	$scope.DatePicker = DatePicker;

	$scope.generateLoadingRecipt = function () {

		disableThisButtonAfterOneClick = true;

		var requestObject = {};

		requestObject.billingParty = $scope.billingParty._id;
		requestObject.route = $scope.grData.booking.route._id;
		requestObject.type = 'Loading Slip';
		requestObject.advanceAsked = $scope.advance;
		requestObject.totalAmount = $scope.balance;

		requestObject.items = [];
		requestObject.items.push({gr: $scope.grData._id});

		function success(response) {
			console.log(response);
			swal(response.data.message);
			$state.go('billing.generatedBills');
		}

		function failure(response) {
			console.log(response);
			swal(response.data.message, '', 'error');
			disableThisButtonAfterOneClick = false;
		}

		if ($scope.editBtn) {
			requestObject._id = $stateParams.data.oLoadingRecipt._id;
			billsService.updateBill(requestObject, success, failure);
		} else
			billsService.generateBill(requestObject, success, failure);
	};

	$scope.getBillingPartyName = function (viewValue) {

		if (viewValue && viewValue.toString().length <= 2)
			return;

		function oSucC(response) {
			$scope.aBillingParty = response.data;
		}

		function oFailC(response) {
			console.log(response);
		}

		var requestObj = {
			name: viewValue,
			type: JSON.stringify(['Billing party'])
		};
		customer.getAllCustomersNew(requestObj, oSucC, oFailC);
	};

	$scope.getRouteName = function (viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		function oSucC(response) {
			$scope.aRoute = response.data.data;
		}

		function oFailC(response) {
			console.log(response);
		}

		Routes.getAllRoutes({name: viewValue}, oSucC, oFailC);
	};

	$scope.takeAdvancePayment = function (gr) {
		let modalInstance = $uibModal.open({
			templateUrl: 'views/grMaster/advancePaymentGR.html',
			controller: 'grAdvancePaymentCtrller',
			resolve: {
				selectedTripGr: () => gr
			}
		});

		modalInstance.result.then(function (res) {
			console.log(res);
			$scope.grData.advance = res.data.advance;
		}, function (res) {
			console.log(res);
		});
	};

	$scope.test = function (t) {
		console.log(t);
	}
});

materialAdmin.controller('billRendorCtrl',
	function (
		$rootScope,
		$scope,
		$uibModalInstance,
		customer,
		excelDownload,
		thatTrip,
		clientService,
		sharedResource
	) {

		$scope.aTemplate = [];
		$scope.showSubmitButton = !!thatTrip.showSubmitButton;
		$scope.showSubmitAndApproveButton = !!thatTrip.showSubmitAndApproveButton;
		$scope.hidePrintButton = !!thatTrip.billPreviewBeforeGenerate;
		$scope.downloadExcel = downloadExcel;
		$scope.getGR = getGR;
		$scope.getBillTemplate = getBillTemplate;

		if (thatTrip.type === 'Loading Slip') {

			sharedResource.shareThisResourceWith($scope);

			try {
				$scope.aTemplate = $scope.$configs.billing_managment.loadingSlip;
			} catch (e) {
				$scope.aTemplate = [];
			}

			$scope.getGR = function (key) {
				clientService.getLoadingSlip(thatTrip._id + '?builtyName=' + (key || 'default'), success, fail);
			};

			$scope.getGR();
		} else {

			let gr = thatTrip.gr;
			let billType = 'bill';
			if (thatTrip.type === 'Supplementary Bill') {
				billType = 'Supplementary Bill';
			}

			/*
			if (gr.billingParty && gr.billingParty.billTemplate && gr.billingParty.billTemplate.length)
				$scope.aTemplate = (thatTrip.gr.billingParty.billTemplate || []).filter(o => !o.type || o.type === billType );
			else if (gr.customer && gr.customer.billTemplate && gr.customer.billTemplate.length)
				$scope.aTemplate = (thatTrip.gr.customer.billTemplate || []).filter(o => !o.type || o.type === billType);
			else if(gr.customer && typeof gr.customer === 'string' && gr.length == 24){
				customer.getAllcustomers({
					_id: gr.customer
				}, data => {
					if(data.data[0]){
						$scope.aTemplate = data.data[0].billTemplate;
						$scope.getGR($scope.aTemplate[0].key);
					}
				});
			}else
				$scope.aTemplate = $scope.$configs['Bill'] && ($scope.$configs['Bill']['Bill Templates'] || []).filter(o => !o.type || o.type === billType) || [];

			if($scope.aTemplate.length){
				$scope.templateKey = $scope.aTemplate[0];
				$scope.getGR($scope.aTemplate[0].key);
			}*/

			// New Function Call
			$scope.getBillTemplate(gr);
		}

		// New function
		function getBillTemplate(newTrip) {

			let defaultTemplate = $scope.$configs['Bill'] && $scope.$configs['Bill']['Bill Templates'] || [];
			// start...
			let billType = newTrip.type;
			if (newTrip.billingParty && newTrip.billingParty.billTemplate && newTrip.billingParty.billTemplate.length) {
				//$scope.aTemplate = (newTrip.billingParty.billTemplate || []).filter(o => !o.key || o.key === billType );
				$scope.aTemplate = newTrip.billingParty.billTemplate;
				if ($scope.aTemplate.length) {
					$scope.templateKey = $scope.aTemplate[0];
					$scope.getGR($scope.aTemplate[0].key);
				}
			} else if (newTrip.billingParty && newTrip.billingParty.customer && (typeof newTrip.billingParty.customer === 'string' || newTrip.billingParty.customer.length > 0)) {
				let customerId;
				if (typeof newTrip.billingParty.customer === 'string')
					customerId = newTrip.billingParty.customer;
				else
					customerId = newTrip.billingParty.customer[0];

				customer.getAllcustomers({
					_id: customerId,
					cClient: $scope.$configs.clientOps,
				}, data => {
					if (data.data[0] && data.data[0].billTemplate && data.data[0].billTemplate.length > 0) {
						$scope.aTemplate = data.data[0].billTemplate;
					}
					$scope.aTemplate = ($scope.aTemplate.length ? $scope.aTemplate : defaultTemplate).filter(o => !o.type || o.type === billType) || [];
					$scope.templateKey = $scope.aTemplate[0];
					$scope.getGR($scope.templateKey.key);
				});
			} else {
				$scope.aTemplate = defaultTemplate.filter(o => !o.type || o.type === billType) || [];

				if ($scope.aTemplate.length) {
					$scope.templateKey = $scope.aTemplate[0];
					$scope.getGR($scope.templateKey.key);
				}
			}
		}

		function getGR(templateKey = 'default') {

			var oFilter = {
				...(thatTrip.billPreviewBeforeGenerate ? {} : thatTrip),
				builtyName: templateKey
			};


			let oBody = thatTrip.oBill && {oBill: [thatTrip.oBill]} || {};
			clientService.getBillPreview(oFilter, oBody, success, fail);
		}

		function success(res) {
			$scope.html = angular.copy(res.data);
		}

		function fail(res) {
			swal('Error', 'Something Went Wrong', 'error');
		}

		function downloadExcel(id) {
			excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0].key}_${moment().format('DD-MM-YYYY')}`);
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.submit = function (approve) {
			$uibModalInstance.close(approve ? 'approve' : true);
		};
	});


//combine Bills
materialAdmin.controller('combineBillsController', function ($rootScope, $scope, $state, $modal, $localStorage, DateUtils, billsService, bookingServices, tripServices, customer) {

	$scope.show_bill = false;
	$scope.allInvoive = [];
	$scope.combine_invoice = [];
	$scope.getCustomer = function () {
		console.log('getting cus');

		function success(data) {
			$scope.aCustomers = data.data;
			//console.log('customers: ', $scope.aCustomers);
		}

		bookingServices.getAllCustomers(success);
	};
	$scope.getCustomer();

	$scope.getBookings = function (customer, start_date, end_date) {
		function success(data) {
			if (data.data && data.data.data && data.data.data.length > 0) {
				$scope.aBookings = data.data.data;
			}
		}

		function failure(res) {
			console.log('fail: ', res);
		}

		bookingServices.getAllBookings({}, success, failure);
	};
	$scope.getBookings();

	//filter for Invoice
	function prepareInvoiceFilterObject() {
		var myFilter = {};
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date;
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date;
		}
		if ($scope.customer) {
			myFilter.customer_id = $scope.customer._id;
		}

		return myFilter;
	};

	$scope.getInvoice = function () {
		function success(data) {
			//console.log(JSON.stringify(data));
			if (data.data && data.data.data) {
				$scope.allInvoive = data.data.data;
			}
		}

		function failure(res) {
			console.log('fail: ', res);
			swal('Some error with GET trips.', '', 'error');
		}

		var oFilter = prepareInvoiceFilterObject();
		tripServices.getAllInvoiceData(oFilter, success, failure);
	};

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope[opened] = true;
	};

	$scope.onInvoiceSelect = function (item, model, label) {
		console.log('invoice selected');
		$scope.selectInVoice = item;
	};

	$scope.$watch('oBills.bill_type', function (value) {
		$scope.show_bill = 'false';
	});

	$scope.getBillPDFDATA = function () {
		var combineThis = $scope.allInvoive[0];
		combineThis.download = true;
		combineThis.booking_info = [];
		for (var i = 0; i < $scope.combine_invoice.length; i++) {
			for (var j = 0; j < $scope.combine_invoice[i].length; j++) {
				combineThis.booking_info.push($scope.combine_invoice[i][j]);
			}
		}
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/preViewBill.html',
			controller: 'invoiceCtrl',
			resolve: {
				thatInvoice: function () {
					return combineThis;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			$state.reload();
		});
	};

	$scope.editInvoice = function (selectInVoice) {
		$state.go('billing.invoice', {
			data: {
				'selectedInvoice': selectInVoice,
				'invoice': $scope.allInvoive
			}
		});
	};

	$scope.approve = function (selectInVoice) {
		$rootScope.selectInVoice = selectInVoice;

		function success(data) {
			var msg = data.data.message;
			swal('Invoice Approved', msg, 'success');
		};

		swal({
				title: 'Are you sure to Approve this Invoice Bill.?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(94, 192, 222);',
				confirmButtonText: 'Yes, Approve!',
				closeOnConfirm: false
			},
			function (isConfirmU) {
				if (isConfirmU) {
					bookingServices.updateBil({'status': 'approve'}, success);
				}
			});
	};

	$scope.combineCheck = function (index, checked, booking_info) {
		if (checked) {
			$scope.combine_invoice.push(booking_info);
		} else {
			$scope.combine_invoice.splice(index, 1);
		}
	};

});

materialAdmin.controller('tripExpenseCntrl', function (
	$rootScope,
	$scope,
	$uibModal,
	$state,
	billsService,
	bookingServices,
	customer,
	Driver,
	DateUtils,
	tripServices,
	Pagination,
	Routes,
	Vehicle,
	Vendor
) {
	$('p').text('Trips Details');
	/*$scope.aBranch = ["Delhi", "Dplah", "Indore", "Ujjain", "Panipat", "Jammu", "Shajapur"];
    $scope.aBookingTypes = ["Import - Containerized", "Export – Containerized", "Import - Loose Cargo", "Export – Loose cargo", "Container FS", "Container FDS", "Domestic – Loose cargo"];*/
	$scope.infoSingleTrip = {};

	$scope.pagination = angular.copy(Pagination);
	$scope.pagination.pageChanged = function () {
		$scope.getAllTripExp(true);
	};

	/*
	* Define empty filterObj to filter data accordingly
	* */
	$scope.filterObj = {};

	$scope.filterObj.dateType = 'allocation_date';
	$scope.filterObj.paymentStatus = 'All';

	/*
	* Multi Select with Search Dropdown Settings
	* */
	$scope.selectSettings = {
		displayProp: 'name',
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		smartButtonTextConverter: function (itemText, originalItem) {
			return itemText;
		}
	};

	/*
	* Multi Select with Search Dropdown Events*/
	$scope.selectEvents = {
		onSelectionChanged: function () {
			$scope.getAllTripExp(true);
		}
	};

	var lastFilter;

	function prepareFilterObject(isPagination) {
		var myFilter = {};
		//myFilter.trip_stage = true;
		if ($scope.trip_no) {
			myFilter.trip_no = $scope.trip_no;
		}
		if ($scope.gr_no) {
			myFilter.gr_no = $scope.gr_no;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.filterObj.route) {
			myFilter.route_id = $scope.filterObj.route.map(obj => obj._id);
		}
		if ($scope.filterObj.customer) {
			myFilter.customer_id = $scope.filterObj.customer.map(obj => obj._id);
		}
		if ($scope.filterObj.driver) {
			myFilter.driver = $scope.filterObj.driver.map(obj => obj._id);
		}
		if ($scope.filterObj.type) {
			myFilter.type = $scope.filterObj.type;
		}
		if ($scope.filterObj.paidToVendor) {
			myFilter.paidToVendor = $scope.filterObj.paidToVendor;
		}
		if ($scope.start_date) {
			myFilter.from = $scope.start_date;
		}
		if ($scope.end_date) {
			myFilter.to = $scope.end_date;
		}
		if ($scope.filterObj.vendor) {
			myFilter.vendor = $scope.filterObj.vendor.map(obj => obj._id);
		}
		if ($scope.filterObj.dateType) {
			myFilter.dateType = $scope.filterObj.dateType;
		}
		if ($scope.filterObj.paymentStatus) {
			myFilter.paymentStatus = $scope.filterObj.paymentStatus;
		}
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}

		myFilter.no_of_docs = $scope.pagination.items_per_page;

		return myFilter;
	}

	$scope.getAllTripExp = function (isPagination) {
		function success(res) {
			if (res.data.data) {
				$scope.aTripExpense = res.data.data;
				$scope.pagination.total_pages = res.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.data.count;
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		billsService.getAllAggrTripsExpense(oFilter, success);
	};
	$scope.getAllTripExp();

	$scope.downloadReport = function () {
		lastFilter.download = 'true';
		billsService.getAllAggrTripsExpense(lastFilter, function (data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	};

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'customer':
				$scope.tripCustomer = '';
				$scope.getCname($scope.tripCustomer);
				break;
			case 'vehicle':
				$scope.vehicle_no = '';
				$scope.getVname($scope.vehicle_no);
				break;
			case 'route':
				$scope.route_id = '';
				$scope.getDname($scope.route_id);
				break;
			default:
				break;
		}
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			$scope.getAllTripExp();
		}
	};

	$scope.getVendorName = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			objValue = {};
			objValue.name = viewValue;
			objValue.deleted = false;

			Vendor.getAllVendorsList(objValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};

	/*
    * get Routes for filters in Multiple select dropdown with search
    * */

	$scope.getRoutes = function (inputValue) {
		if (inputValue.length <= 2)
			return;

		function success(response) {

			$scope.routes = [];
			Array.prototype.push.apply($scope.routes, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		Routes.getAllRoutes({name: inputValue}, success, failure);
	};

	/*
    * get Customer for filters in Multiple select dropdown with search
    * */
	$scope.getCustomers = function (inputModel) {
		if (inputModel.length <= 2)
			return;

		function success(response) {

			$scope.customers = [];
			Array.prototype.push.apply($scope.customers, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		customer.getCustomerSearch(inputModel, success, failure);
	};

	/*
    * get Driver for filters in Multiple select dropdown with search
    * */
	$scope.getDrivers = function (inputModel) {
		if (inputModel.length <= 2)
			return;

		function success(response) {

			$scope.drivers = [];
			Array.prototype.push.apply($scope.drivers, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		Driver.getName(inputModel, success, failure);
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.getAllTripExp();
	};

	$scope.tripExpDeatil = function (oTripExp, index) {
		listItem = $($('.selectItem')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');

		// $rootScope.selectedTripExp = oTripExp;

		$state.go('billing.tripExpenseDetail', {data: oTripExp});

		// var sUrl = '#!/billing/tripExpenseDetail';
		// $rootScope.redirect(sUrl);
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
	//************* New Date Picker for multiple date selection in single form ******************

});

materialAdmin.controller('tripExpDetailCtrl', function (
	$rootScope,
	$scope,
	$state,
	accountingService,
	DateUtils,
	$uibModal,
	$interval,
	$stateParams,
	tripServices,
	billsService,
	vendorFuelService
) {

	$scope.selectedAskPayment = {
		selected: null
	};

	$scope.account_data = {};
	$scope.selectedTripExp = $stateParams.data;

	if ($scope.selectedTripExp) {
		if ($scope.selectedTripExp.trip && $scope.selectedTripExp.trip._id) {
			var trip_id = $scope.selectedTripExp.trip._id;

			function success(data) {
				if (data.data && data.data.data) {
					$scope.aTrips = data.data.data.data;
					$scope.selectedTripExp.trip = $scope.aTrips[0];

					//Search gr asigned
					function getIndex(o) {
						return o.status === 'GR Assigned';
					}

					for (var g = 0; g < $scope.aTrips[0].gr.length; g++) {
						$scope.aTrips[0].gr[g].grDoneBy = {};
						$scope.aTrips[0].gr[g].grDoneBy = $scope.aTrips[0].gr[g].statuses.find(getIndex);
					}

				}
			}

			function failure(res) {
				console.log('fail: ', res);
				swal('Some error with GET trips.', '', 'error');
			}

			tripServices.getAllTripsWithPagination({_id: trip_id}, success, failure);
		}
	} else {
		var sUrl = '#!/billing/tripExpense';
		$rootScope.redirect(sUrl);
		return;
	}

	if ($scope.selectedTripExp && $scope.selectedTripExp.trip && $scope.selectedTripExp.trip.vendorDeal) {
		if ($scope.selectedTripExp.trip.vendorDeal.advance > $scope.selectedTripExp.vNet) {
			$scope.selectedTripExp.v_adv_remaining = $scope.selectedTripExp.trip.vendorDeal.advance - $scope.selectedTripExp.vNet;
			$scope.selectedTripExp.v_topay_remaining = $scope.selectedTripExp.trip.vendorDeal.toPay;
		} else {
			$scope.selectedTripExp.remaining = $scope.selectedTripExp.vNet - $scope.selectedTripExp.trip.vendorDeal.advance;
			$scope.selectedTripExp.v_adv_remaining = 0;
			$scope.selectedTripExp.v_topay_remaining = $scope.selectedTripExp.trip.vendorDeal.toPay - $scope.selectedTripExp.remaining;
		}
	}

	$scope.objStation = {};
	$scope.objTollTax = {};
	$scope.objAdditionalCost = {};
	$scope.objPenalty = {};
	$scope.aFuelType = ['Petrol', 'Diesel', 'CNG'];
	$scope.aFuelCompany = ['IOCL', 'HPCL', 'BPCL', 'Reliance'];
	$scope.isAcnowledged = function (statuses, value) {
		var found = statuses.find(function (element) {
			return element.status === value;
		});
		if (found) {
			return 'Acknowledged';
		} else {
			return 'Not Acknowledged';
		}
	};

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
				$scope.aAccountMasterOfVendor = [$scope.selectedTripExp.trip.vendor.account] || [];
				$scope.objDiesel.account_data = $scope.objDiesel.account_data || {};
				$scope.objDiesel.account_data.to = $scope.selectedTripExp.trip.vendor.account;
			} catch (e) {
				$scope.aAccountMasterOfVendor = [];
			}
		} else {
			$scope.aAccountMasterOfVendor = [];
			$scope.objDiesel.account_data.to = undefined;
		}

	};

	$scope.checkIsTDSdone = function (expense) {
		return !($scope.selectedTripExp.trip.vendorDeal.deductTDS && !(expense || []).find(obj => obj.type === 'Vendor TDS Deduct'));
	};

	$scope.fillExpenseDeal = function () {
		let obj = {
			type: 'Vendor TDS Deduct',
			person: $scope.selectedTripExp.trip.vendor.name,
			amount: $scope.selectedTripExp.trip.vendorDeal.total_expense * 0.02,
			date: new Date(),
			reference_no: $scope.selectedTripExp.trip.trip_no,
			trip_no: $scope.selectedTripExp.trip.trip_no,
			trip: $scope.selectedTripExp.trip._id,
			remark: '2% tds',
			account_data: {}
		};

		try {
			if ($scope.selectedTripExp.trip.vendor.account)
				obj.account_data.to = $scope.selectedTripExp.trip.vendor.account;
			else {
				swal('', 'Vendor has Account attached', 'error');
				return;
			}
		} catch (e) {
			swal('', 'Vendor has Account attached', 'error');
			return;
		}

		try {
			obj.account_data.from = {_id: $scope.$clientConfigs.accountDetails.tdsPayable};
		} catch (e) {
			swal('', 'Invalid From Account Data', 'error');
			return;
		}

		function success(res) {
			if (res && res.data && (res.data.status === 'OK')) {
				swal('', res.data.message, 'success');
				$state.reload('billing.tripExpenseDetail');
				return;
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			swal('', (res.data && res.data.message), 'error');
			$uibModalInstance.dismiss(res);
		}

		tripServices.addExpenseOnDiesel(obj, success, failure);
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

	$scope.acknowledgeDeal = function () {
		console.log($scope.selectedTripExp.trip);
		var selectedTrip = $scope.selectedTripExp.trip;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/acknowledgeDeal.html',
			controller: 'acknowledgeDealCtrl',
			resolve: {
				thatTrip: function () {
					return selectedTrip;
				}
			}
		});
		modalInstance.result.then(function (data) {
			/*console.log(data);
			$rootScope.selectedTrip = data.data.data;
			generateTripHistory();*/
		}, function (data) {

		});
	};

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

		tripServices.getExpenseByTripId({trip_id: $scope.selectedTripExp._id}, successEx, failureEx);
	};

	$scope.getExpenses();
	//*********** get trip expense end ****//

	//********* add more expense **********
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

	$scope.validateAmount = function (amt) {
		if ($scope.objDiesel.type === 'Driver Cash') {
			if ($scope.selectedTripExp.trip.vendor_payment && $scope.selectedTripExp.trip.vendor_payment.driver_cash) {
				if (amt > $scope.selectedTripExp.trip.vendor_payment.driver_cash) {
					swal('warning', 'Please enter less then or equal to vendor driver cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedTripExp.trip.route && $scope.selectedTripExp.trip.route.rates && $scope.selectedTripExp.trip.route.rates.allot && $scope.selectedTripExp.trip.route.rates.allot.cash) {
				if (amt > $scope.selectedTripExp.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		} else if ($scope.objDiesel.type === 'Diesel') {
			if ($scope.selectedTripExp.trip.vendor_payment && $scope.selectedTripExp.trip.vendor_payment.diesel && $scope.selectedTripExp.trip.vendor_payment.diesel.amount) {
				if (amt > $scope.selectedTripExp.trip.vendor_payment.diesel.amount) {
					swal('warning', 'Please enter less then or equal to vendor diesel cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedTripExp.trip.route && $scope.selectedTripExp.trip.route.rates && $scope.selectedTripExp.trip.route.rates.allot && $scope.selectedTripExp.trip.route.rates.allot.cash) {
				if (amt > $scope.selectedTripExp.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		} else if ($scope.objDiesel.type === 'Toll Tax') {
			if ($scope.selectedTripExp.trip.vendor_payment && $scope.selectedTripExp.trip.vendor_payment.toll_tax) {
				if (amt > $scope.selectedTripExp.trip.vendor_payment.toll_tax) {
					swal('warning', 'Please enter less then or equal to vendor toll tax cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			} else if ($scope.selectedTripExp.trip.route && $scope.selectedTripExp.trip.route.rates && $scope.selectedTripExp.trip.route.rates.allot && $scope.selectedTripExp.trip.route.rates.allot.cash) {
				if (amt > $scope.trip.route.rates.allot.cash) {
					swal('warning', 'Please enter less then or equal to route rate allot cash', 'warning');
					$scope.objDiesel.amount = $scope.diesel_info.amount;
				}
			}
		}
	};

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
		if (type.includes('Vendor')) {
			$scope.objDiesel.person = ($scope.selectedTripExp.trip && $scope.selectedTripExp.trip.vendorData && $scope.selectedTripExp.trip.vendorData.name) ? $scope.selectedTripExp.trip.vendorData.name : '';
		} else {
			$scope.objDiesel.person = '';
		}
	};

	$scope.vendorPayType = ['Vendor A/C Pay', 'Vendor Cash', 'Vendor Cheque', 'Vendor Penalty', 'Vendor Damage', 'Vendor Detention', 'Vendor Others'];

	$scope.setPayment = function (data) {
		$scope.selectedTripExp.netExpense = ($scope.selectedTripExp.netExpense || 0) + (data.amount || 0);

		if (data.type === 'Driver Cash') {
			$scope.selectedTripExp.driverCash = ($scope.selectedTripExp.driverCash || 0) + (data.amount || 0);
		} else if (data.type === 'Diesel') {
			$scope.selectedTripExp.diesel = ($scope.selectedTripExp.diesel || 0) + (data.amount || 0);
		} else if (data.type === 'Toll Tax') {
			$scope.selectedTripExp.tollTax = ($scope.selectedTripExp.tollTax || 0) + (data.amount || 0);
		} else if (data.type === 'Other Charges') {
			$scope.selectedTripExp.oCharges = ($scope.selectedTripExp.oCharges || 0) + (data.amount || 0);
		}

		if ($scope.vendorPayType.indexOf(data.type) > -1) {
			$scope.selectedTripExp.vNet = ($scope.selectedTripExp.vNet || 0) + (data.amount || 0);
			if ($scope.selectedTripExp && $scope.selectedTripExp.trip && $scope.selectedTripExp.trip.vendorDeal) {
				if ($scope.selectedTripExp.trip.vendorDeal.advance > $scope.selectedTripExp.vNet) {
					$scope.selectedTripExp.v_adv_remaining = $scope.selectedTripExp.trip.vendorDeal.advance - $scope.selectedTripExp.vNet;
					$scope.selectedTripExp.v_topay_remaining = $scope.selectedTripExp.trip.vendorDeal.toPay;
				} else {
					$scope.selectedTripExp.remaining = $scope.selectedTripExp.vNet - $scope.selectedTripExp.trip.vendorDeal.advance;
					$scope.selectedTripExp.v_adv_remaining = 0;
					$scope.selectedTripExp.v_topay_remaining = $scope.selectedTripExp.trip.vendorDeal.toPay - $scope.selectedTripExp.remaining;
				}
			}
		}
	};

	$scope.selectAskPayment = function (askPayment) {
		try {
			if ($scope.selectedAskPayment.selected.$$hashKey === askPayment.$$hashKey)
				$scope.selectedAskPayment.selected = {};
		} catch (e) {
			$scope.selectedAskPayment.selected = askPayment;
		}
	};

	$scope.addExpenseMore = function () {
		function success(res) {
			if (res && res.data && (res.data.status === 'OK')) {
				swal('', res.data.message, 'success');
				$state.reload('billing.tripExpenseDetail');
				return;
				// $scope.getExpenses();
				// $scope.setPayment(res.data.data);
				// $scope.objDiesel = null;
				//$uibModalInstance.close(res);
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			swal('', (res.data && res.data.message), 'error');
			$uibModalInstance.dismiss(res);
		}

		var oSend = {};
		//oSend.banking_detail = $scope.banking_detail;
		oSend = $scope.objDiesel;
		if ($scope.selectedAskPayment.selected)
			oSend.askPayment = $scope.selectedAskPayment.selected._id;
		oSend.trip_no = $scope.selectedTripExp.trip_no;
		oSend.trip = $scope.selectedTripExp._id;
		oSend.diesel_info = $scope.diesel_info;

		tripServices.addExpenseOnDiesel(oSend, success, failure);

	};
	//********* add more expense end **********

	$scope.ttlAmt = function () {
		$scope.objStation.amount = $scope.objStation.rate * $scope.objStation.litres;
	};

	$scope.addDiesel = function (fuelData) {
		$scope.selectedTripExp.diesel_expenses.push(fuelData);
		var diesel_price_ttl = 0;
		var diesel_qty_ttl = 0;
		for (var r = 0; r < $scope.selectedTripExp.diesel_expenses.length; r++) {
			diesel_price_ttl = diesel_price_ttl + $scope.selectedTripExp.diesel_expenses[r].rate;
			diesel_qty_ttl = diesel_qty_ttl + $scope.selectedTripExp.diesel_expenses[r].litres;
		}
		$scope.selectedTripExp.diesel_expenses_total_price = diesel_price_ttl;
		$scope.selectedTripExp.diesel_expenses_total_litre = diesel_qty_ttl;
		$scope.objStation = {};
	};

	$scope.removeDieselExp = function (index) {
		$scope.selectedTripExp.diesel_expenses.splice(index, 1);
		var diesel_price_ttl = 0;
		var diesel_qty_ttl = 0;
		for (var s = 0; s < $scope.selectedTripExp.diesel_expenses.length; s++) {
			diesel_price_ttl = diesel_price_ttl + $scope.selectedTripExp.diesel_expenses[s].rate;
			diesel_qty_ttl = diesel_qty_ttl + $scope.selectedTripExp.diesel_expenses[s].rate;
		}
		$scope.selectedTripExp.diesel_expenses_total_price = diesel_price_ttl;
		$scope.selectedTripExp.diesel_expenses_total_litre = diesel_qty_ttl;
		$scope.objStation = {};
	};

	$scope.addToll = function (tollData) {
		$scope.selectedTripExp.toll_tax_expenses.push(tollData);
		var toll_cost_ttl = 0;
		for (var u = 0; u < $scope.selectedTripExp.toll_tax_expenses.length; u++) {
			toll_cost_ttl = toll_cost_ttl + $scope.selectedTripExp.toll_tax_expenses[u].toll_cost;
		}
		$scope.selectedTripExp.toll_tax_total_price = toll_cost_ttl;
		$scope.objTollTax = {};
	};
	$scope.removeTollExp = function (index) {
		$scope.selectedTripExp.toll_tax_expenses.splice(index, 1);
		var toll_cost_ttl = 0;
		for (var v = 0; v < $scope.selectedTripExp.toll_tax_expenses.length; v++) {
			toll_cost_ttl = toll_cost_ttl + $scope.selectedTripExp.toll_tax_expenses[v].toll_cost;
		}
		$scope.selectedTripExp.toll_tax_total_price = toll_cost_ttl;
		$scope.objTollTax = {};
	};

	$scope.addAddiCost = function (addiCostData) {
		$scope.selectedTripExp.additional_expenses.push(addiCostData);
		var additional_cost_ttl = 0;
		for (var b = 0; b < $scope.selectedTripExp.additional_expenses.length; b++) {
			additional_cost_ttl = additional_cost_ttl + $scope.selectedTripExp.additional_expenses[b].cost;
		}
		$scope.selectedTripExp.additional_expenses_total_price = additional_cost_ttl;
		$scope.objAdditionalCost = {};
	};
	$scope.removeAddiCost = function (index) {
		$scope.selectedTripExp.additional_expenses.splice(index, 1);
		var additional_cost_ttl = 0;
		for (var c = 0; c < $scope.selectedTripExp.additional_expenses.length; c++) {
			additional_cost_ttl = additional_cost_ttl + $scope.selectedTripExp.additional_expenses[c].cost;
		}
		$scope.selectedTripExp.additional_expenses_total_price = additional_cost_ttl;
		$scope.objAdditionalCost = {};
	};

	$scope.addPenalty = function (penaltyData) {
		$scope.selectedTripExp.penalty.push(penaltyData);
		var penalty_ttl = 0;
		for (var h = 0; h < $scope.selectedTripExp.penalty.length; h++) {
			penalty_ttl = penalty_ttl + $scope.selectedTripExp.penalty[h].cost;
		}
		$scope.selectedTripExp.penalty_total_price = penalty_ttl;
		$scope.objPenalty = {};
	};
	$scope.removePenalty = function (index) {
		$scope.selectedTripExp.penalty.splice(index, 1);
		var penalty_ttl = 0;
		for (var j = 0; j < $scope.selectedTripExp.penalty.length; j++) {
			penalty_ttl = penalty_ttl + $scope.selectedTripExp.penalty[j].cost;
		}
		$scope.selectedTripExp.penalty_total_price = penalty_ttl;
		$scope.objPenalty = {};
	};

	$scope.updateTripExpense = function (selectedTripE) {
		function suc(response) {
			if (response && response.data) {
				console.log(response);
				swal('Trip Expense Updated Successfully', '', 'success');
			}
		}

		function fail(res) {
			console.log('fail: ', res);
			swal('Some error with trip expense updation', '', 'failure');
		}

		billsService.updateTripExpense(selectedTripE, suc, fail);
	};

});

materialAdmin.controller('acknowledgeDealCtrl', function ($rootScope, $scope, $state, $localStorage, branchService, constants, DateUtils, growlService, $uibModalInstance, $interval, thatTrip, tripServices, userService, accountingService) {

	$scope.accountingAvailable = (
		$localStorage.ft_data
		&& $localStorage.ft_data.configs
		&& $localStorage.ft_data.configs.master
		&& $localStorage.ft_data.configs.master.showAccount
	) || false;

	var last_route;
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.updated_status = {};

	try {
		$scope.aAccountMasterOfVendor = [thatTrip.vendor.account];
		$scope.trip = $scope.trip || {};
		$scope.trip.account_data = $scope.trip.account_data || {};
		$scope.trip.account_data.from = thatTrip.vendor.account;
	} catch (e) {
		$scope.aAccountMasterOfVendor = [];
	}

	(function () {

		var oFilter = {
			all: true,
			group: 'Purchase'
		}; // filter to send
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMasterOfPurchase = response.data.data;
		}
	})();

	if (!thatTrip) {
		var bUrl = '#!/booking_manage/tripsDetail';
		$rootScope.redirect(bUrl);
	} else {
		$scope.trip = thatTrip;
	}

	$scope.aType = ['Liter', 'Amount'];

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

	//vendor deal data

	if (!$scope.trip.vendorDeal) {
		$scope.trip.vendorDeal = {};
		$scope.trip.vendorDeal.diesel = {};
	}
	$scope.$constants = constants;

	if ($scope.trip.vendorDeal) {
		$scope.trip.vendorDeal.advance_due_date = new Date();
	}

	$scope.changePayType = function (pType) {
		if (pType === 'To pay' || pType === 'To be billed') {
			$scope.trip.vendorDeal.toPay = ($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.munshiyana || 0);
			$scope.trip.vendorDeal.advance = 0;
			if ($scope.trip.vendorDeal.diesel) {
				$scope.trip.vendorDeal.diesel.quantity = 0;
				$scope.trip.vendorDeal.diesel.rate = 0;
				$scope.trip.vendorDeal.diesel.amount = 0;
			}
			$scope.trip.vendorDeal.driver_cash = 0;
			$scope.trip.vendorDeal.toll_tax = 0;
			$scope.trip.vendorDeal.other_charges = 0;
			$scope.trip.vendorDeal.other_charges_remark = '';
			$scope.trip.vendorDeal.account_payment = 0;
		}
	};

	/*$scope.changeAmount = function () {
		if($scope.trip.vendorDeal.diesel.quantity && $scope.trip.vendorDeal.diesel.rate) {
			$scope.trip.vendorDeal.diesel.amount = $scope.trip.vendorDeal.diesel.quantity * $scope.trip.vendorDeal.diesel.rate;
		}else {
			$scope.trip.vendorDeal.diesel.amount = 0;
		}
	};*/
	$scope.changeAmount = function () {
		if ($scope.trip.vendorDeal.diesel.quantity && $scope.trip.vendorDeal.diesel.rate) {
			$scope.trip.vendorDeal.diesel.amount = $scope.trip.vendorDeal.diesel.quantity * $scope.trip.vendorDeal.diesel.rate;
		} else {
			$scope.trip.vendorDeal.diesel.amount = 0;
		}
	};
	$scope.changeTotal = function () {
		if ($scope.trip.vendorDeal.diesel.amount >= 0) {
			$scope.trip.vendorDeal.total_expense = ($scope.trip.vendorDeal.diesel.amount || 0) + ($scope.trip.vendorDeal.driver_cash || 0) + ($scope.trip.vendorDeal.toll_tax || 0) + ($scope.trip.vendorDeal.other_charges || 0);
		} else {
			//$scope.trip.deal.total_expense = 0;
		}
	};
	/*$scope.changeAdvance = function () {
		$scope.trip.vendorDeal.advance = ($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.toPay || 0);
	};*/
	$scope.changeAdvance = function (type) {
		var tot_exp = angular.copy($scope.trip.vendorDeal.total_expense);
		var joint_exp = ($scope.trip.vendorDeal.toPay || 0) + ($scope.trip.vendorDeal.advance || 0);
		if (type === 'munshiyana') {
			if ($scope.trip.vendorDeal.munshiyana > $scope.trip.vendorDeal.total_expense) {
				$scope.trip.vendorDeal.munshiyana = $scope.trip.vendorDeal.total_expense;
			}
			if ($scope.trip.vendorDeal.toPay >= $scope.trip.vendorDeal.munshiyana) {
				$scope.trip.vendorDeal.toPay = $scope.trip.vendorDeal.toPay - $scope.trip.vendorDeal.munshiyana;
				$scope.changeAdvance('topay');
			} else if ($scope.trip.vendorDeal.advance >= $scope.trip.vendorDeal.munshiyana) {
				$scope.trip.vendorDeal.advance = $scope.trip.vendorDeal.advance - $scope.trip.vendorDeal.munshiyana;
				$scope.changeAdvance('advance');
			}
		}
		if (type === 'advance') {
			$scope.trip.vendorDeal.toPay = (($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.munshiyana || 0)) - ($scope.trip.vendorDeal.advance || 0);
		}
		if (type === 'topay') {
			$scope.trip.vendorDeal.advance = (($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.munshiyana || 0)) - ($scope.trip.vendorDeal.toPay || 0);
		}
		if ($scope.trip.vendorDeal.payment_type === 'To pay' || $scope.trip.vendorDeal.payment_type === 'To be billed') {
			$scope.trip.vendorDeal.toPay = ($scope.trip.vendorDeal.total_expense || 0) - ($scope.trip.vendorDeal.munshiyana || 0);
			$scope.trip.vendorDeal.advance = 0;
		}
	};

	/*$scope.changeAcPayment = function () {
		$scope.trip.vendorDeal.account_payment = ($scope.trip.vendorDeal.advance || 0) - ($scope.trip.vendorDeal.diesel.amount || 0) - ($scope.trip.vendorDeal.driver_cash || 0) - ($scope.trip.vendorDeal.toll_tax || 0) - ($scope.trip.vendorDeal.other_charges || 0);
	};*/
	$scope.changeAcPayment = function () {

		$scope.trip.vendorDeal.account_payment = ($scope.trip.vendorDeal.advance || 0) - ($scope.trip.vendorDeal.diesel ? ($scope.trip.vendorDeal.diesel.amount || 0) : 0) - ($scope.trip.vendorDeal.driver_cash || 0) - ($scope.trip.vendorDeal.toll_tax || 0) - ($scope.trip.vendorDeal.other_charges || 0);
	};

	// end vendor deal data

	$scope.updateTripDataCall = function () {
		if (!$scope.trip.account_data.from._id) {
			return;
		}
		if (!$scope.trip.account_data.to._id) {
			return;
		}

		function success(res) {
			if (res && res.data && (res.data.status === 'OK' || res.data.success === 'OK')) {
				/*$rootScope.selectedTrip.branch = res.data.data.oBranch;
				$rootScope.selectedTrip.route = res.data.data.oRoute;
				$rootScope.selectedTrip.driver = res.data.data.oDriver;
				$rootScope.selectedTrip.trip_manager = res.data.data.oManager;
				$rootScope.selectedTrip.vendorDeal = res.data.data.vendorDeal;*/
				$uibModalInstance.close(res);
				var msg = res.data.message;
				$state.reload('billing.tripExpenseDetail');
				swal('Update', msg, 'success');
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

		var oSend = {};
		oSend._id = $scope.trip._id;
		oSend.branch = $scope.trip.oBranch._id;
		oSend.account_data = {};
		oSend.account_data.from = $scope.trip.account_data.from._id;
		oSend.account_data.to = $scope.trip.account_data.to._id;
		oSend.trip_manager = $scope.trip.oTripManager._id;
		oSend.vendorDeal = $scope.trip.vendorDeal;
		oSend.updated_status = $scope.updated_status;
		oSend.allocation_date = $scope.trip.allocation_date;
		console.log(oSend);
		tripServices.acknowledgeDeal(oSend, success, failure);
	};

	$scope.getAllBranch = function () {
		function success(response) {
			//console.log(data);
			if (response.data && response.data.length > 0) {
				$scope.aBranch = response.data;
				for (var b = 0; b < $scope.aBranch.length; b++) {
					if ($scope.trip.branch) {
						if ($scope.trip.branch._id == $scope.aBranch[b]._id) {
							$scope.trip.oBranch = $scope.aBranch[b];
						}
					}
				}
			}
		}

		function failure(response) {
			console.log(response);
		}

		branchService.getAllBranches({all: true}, success, failure);
	};
	$scope.getAllBranch();

	//Get all users for trip manager dropdown at final page
	$scope.getAllUsers = function () {
		function succGetUsers(response) {
			console.log(response.data);
			if (response.data && response.data.length > 0) {
				$scope.aUsers = response.data;
				for (var m = 0; m < $scope.aUsers.length; m++) {
					if ($scope.trip.trip_manager) {
						if ($scope.trip.trip_manager._id === $scope.aUsers[m]._id) {
							$scope.trip.oTripManager = $scope.aUsers[m];
						}
					}
				}
			}
		}

		function failGetUsers(response) {
			console.log(response);
		}

		userService.getUsers({all: true, user_type: 'Trip Manager'}, succGetUsers, failGetUsers);
	};
	$scope.getAllUsers();

});

materialAdmin.controller('billingReportCntrl', function ($rootScope, $scope, $uibModal, constants, DateUtils, $state, ReportService) {
	$scope.report = 'Invoice Wise';
	$scope.status = constants.aBillStatus[0];
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

	//************* New Date Picker for multiple date selection in single form ******************

	function prepareFilterObject(download) {
		var myFilter = {'all': 'true'};
		if ($scope.report) {
			myFilter.reportType = $scope.report;
		}
		if ($scope.status) {
			myFilter.status = $scope.status.key;
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.dispatch_start_date) {
			myFilter.start_date = $scope.dispatch_start_date;
		}
		if ($scope.dispatch_end_date) {
			myFilter.end_date = $scope.dispatch_end_date;
		}
		return myFilter;
	};

	$scope.dateChange = function () {
		var endDate;
		var startDate = $scope.dispatch_start_date;
		endDate = moment(startDate).add(1, 'months').format('YYYY-MM-DD');
		$scope.dispatch_end_date = endDate;
		$scope.mxDate = endDate;

	};

	$scope.downloadReport = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis);
		ReportService.getBilldispatchReport(oFilter, function (data) {
			if (data.data.data || downloadThis) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				} else {
					$scope.billingReport = data.data.data;
				}
			} else {
				$scope.billingReport = [];
				swal('warning', data.data.message, 'warning');
			}
		});
	};
});

materialAdmin.controller('costingReportCntrl', function ($scope) {

	$scope.$on('tripExpSearchChange', function (e, data) {
		$scope.isDownloadBtnDisabled = data;
	});

	$scope.reportType = $scope.$constants.aCoastingReportTypes[0];

	$scope.downloadSheet = function () {
		$scope.$broadcast('downloadEvent', $scope.aggregateBy); // it broadcast the event for child controller to for downloading respective data
	};

	$scope.aggrs = [
		{label: 'Vehicle wise', value: 'vehicle_no'},
		{label: 'Trip wise', value: 'trip_no'},
		{label: 'Allocation Date wise', value: 'allocation_date'}
	];

});

materialAdmin.controller('vendorReconciliationCtrl', function (
	$scope,
	billsService,
	Vendor
) {

	$scope.$emit('tripExpSearchChange', false);

	// its invoked when parent send 'downloadEvent' to child
	$scope.$on('downloadEvent', function () {
		$scope.getAllCostingReport(true);
	});

	function prepareFilterObject(isPagination) {
		var myFilter = {'all': 'true'};
		if ($scope.vendor) {
			myFilter.vendor = [$scope.vendor._id];
		}
		if (isPagination) {
			myFilter.download = true;
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		return myFilter;
	}

	$scope.getAllCostingReport = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis);
		billsService.getAllVendorCoasting(oFilter, function (data) {
			if (data.data.data || downloadThis) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				} else {
					$scope.aCostingReport = data.data.data;
					$scope.summary = {};
					var net_hire_charges = 0;
					var deductions = 0;
					var detention_to_add = 0;
					var actual_advance_paid = 0;
					var total_to_paid = 0;
					var balance_amount_paid = 0;
					for (var x = 0; x < $scope.aCostingReport.length; x++) {
						$scope.aCostingReport[x].allocation_date = $scope.aCostingReport[x].trip.statuses.find(function (element) {
							return element.status === 'Trip not started';
						}).date;
						var dateValue = $scope.aCostingReport[x].trip.aGR[0].statuses.find(function (element) {
							return element.status === 'GR Acknowledged';
						});

						$scope.aCostingReport[x].podSubmissionDate = dateValue ? dateValue.date : undefined;

						//$scope.summary.name = $scope.aCostingReport[0].trip.vendorData[0].name;
						if ($scope.aCostingReport[x].trip.vendorDeal) {
							net_hire_charges = net_hire_charges + ($scope.aCostingReport[x].trip.vendorDeal.total_expense || 0);
							balance_amount_paid = balance_amount_paid + ($scope.aCostingReport[x].trip.vendorDeal.advance >= $scope.aCostingReport[x].vNet ? ($scope.aCostingReport[x].trip.vendorDeal.advance || 0) - $scope.aCostingReport[x].vNet : 0);
						} else {
							net_hire_charges = 0;
							balance_amount_paid = 0;
						}
						deductions = deductions + ($scope.aCostingReport[x].vDamage || 0);
						detention_to_add = detention_to_add + ($scope.aCostingReport[x].vDetention || 0);
						actual_advance_paid = actual_advance_paid + $scope.aCostingReport[x].vNet;
						total_to_paid = net_hire_charges - (deductions + detention_to_add);
					}
					$scope.summary.name = $scope.aCostingReport[0].trip.vendorData.name;
					$scope.summary.date = new Date();
					$scope.summary.netHireAmt = net_hire_charges;
					$scope.summary.deductions = deductions;
					$scope.summary.detention_to_add = detention_to_add;
					$scope.summary.actual_advance_paid = actual_advance_paid;
					$scope.summary.total_to_paid = total_to_paid;
					$scope.summary.balance_amount_paid = balance_amount_paid;

					$scope.summary.total_paid_till_date = actual_advance_paid + balance_amount_paid;
					$scope.summary.netPaid = $scope.summary.total_paid_till_date + $scope.summary.total_to_paid;

				}
			} else {
				$scope.aCostingReport = [];
				swal('warning', data.data.message, 'warning');
			}
		});
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			objValue = {};
			objValue.name = viewValue;
			objValue.deleted = false;

			Vendor.getAllVendorsList(objValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};
});

materialAdmin.controller('fuelVendorReconciliationCtrl', function (
	$scope,
	$timeout,
	$uibModal,
	billsService,
	DatePicker,
	Vendor,
	vendorFuelService
) {

	$scope.$emit('tripExpSearchChange', false);

	var vm = this;

	vm.DatePicker = DatePicker;
	vm.vendor = '';
	vm.fuelVendor = '';
	vm.summaryReport = [];

	vm.getAllCostingReport = getAllCostingReport;
	vm.setTime = setTime;
	vm.showSummary = showSummary;
	downloadEventListener();

	// getAllCostingReport();

	function downloadEventListener() {
		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadEvent', function () {
			vm.getAllCostingReport(true);
		});
	}

	function generateSummaryReport() {
		$timeout(function () {

			vm.summaryReport = [];
			let aTemp = {},
				obj;

			vm.aCostingReport.map(obj => {
				let vendorStation,
					vendorName;
				try {
					if (obj.diesel_info.vendor.name)
						vendorStation = obj.diesel_info.station.fuel_company;
					else
						vendorStation = 'other';
				} catch (e) {
					vendorStation = 'other';
				}

				try {
					if (obj.diesel_info.vendor.name)
						vendorName = obj.diesel_info.vendor.name;
					else
						vendorName = 'other';
				} catch (e) {
					vendorName = 'other';
				}

				aTemp[vendorStation] = aTemp[vendorStation] || {};

				aTemp[vendorStation][vendorName] = aTemp[vendorStation][vendorName] || {};

				aTemp[vendorStation][vendorName] = {
					quantity: (aTemp[vendorStation][vendorName].quantity || 0) + obj.diesel_info.litre,
					amount: (aTemp[vendorStation][vendorName].amount || 0) + obj.amount
				};
			});

			console.log(aTemp);

			for (let fuelStation in aTemp) {
				for (let fuelVendor in aTemp[fuelStation]) {
					let tempObj = {
						name: fuelVendor,
						station: fuelStation,
						quantity: aTemp[fuelStation][fuelVendor].quantity,
						amount: aTemp[fuelStation][fuelVendor].amount
					};
					vm.summaryReport.push(tempObj);
				}
			}
		}, 0);
	}

	function getAllCostingReport(downloadThis) {
		var oFilter = prepareFilterObject(downloadThis);
		billsService.getFuelVendorReport(oFilter, function (data) {
			if (data.data.data || downloadThis) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				} else {
					vm.aCostingReport = data.data.data;
					generateSummaryReport();
				}
			} else {
				vm.aCostingReport = [];
				swal('warning', data.data.message, 'warning');
			}
		});
	}

	vm.getAllFuelVendor = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				vm.aFuelVendor = response.data;
			}

			function oFail(response) {
				console.log(response);
			}

			objValue = {'all': 'true'};
			objValue.name = viewValue;

			vendorFuelService.getVendorFuels(objValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};

	vm.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				vm.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			objValue = {'all': 'true'};
			objValue.name = viewValue;
			objValue.deleted = false;

			Vendor.getAllVendorsList(objValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};

	function prepareFilterObject(isPagination, aggBy) {
		var myFilter = {'all': 'true'};
		if (vm.fuelVendor) {
			myFilter['diesel_info.vendor'] = vm.fuelVendor._id;
		}
		if (vm.from) {
			myFilter.start_date = vm.from.toISOString();
		}
		if (vm.to) {
			myFilter.end_date = vm.to.toISOString();
		}
		if (isPagination) {
			myFilter.download = true;
		}
		if (isPagination && vm.currentPage) {
			myFilter.skip = vm.currentPage;
		}
		myFilter.dateKey = 'date';
		return myFilter;
	}

	function setTime() {
		if (vm.from)
			vm.from = new Date(vm.from.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
		if (vm.to)
			vm.to = new Date(vm.to.setHours(23, 59, 59)); //sets hour minutes & sec on selected date
	}

	function showSummary() {
		$uibModal.open({
			templateUrl: 'views/report/fuelVendorSummaryPopup.html',
			controller: 'fuelVendorSummaryPopupCtrl',
			controllerAs: 'vm',
			resolve: {
				'summary': function () {
					return vm.summaryReport;
				}
			}
		});
	}
});

materialAdmin.controller('fuelVendorSummaryPopupCtrl', function (
	$uibModalInstance,
	summary
) {

	var vm = this;
	vm.summary = summary;

	vm.closeModal = closeModal;

	function closeModal() {
		$uibModalInstance.dismiss();
	};

});

materialAdmin.controller('tripExpenseReportCtrl', function (
	$rootScope,
	$scope,
	$uibModal,
	$state,
	billsService,
	bookingServices,
	customer,
	Driver,
	DatePicker,
	DateUtils,
	tripServices,
	Routes,
	Vehicle,
	Vendor
) {

	$scope.$watch('tripExpenseReportFilterForm.$invalid', function (newVal, oldVal) {
		$scope.$emit('tripExpSearchChange', newVal);
	});

	// its invoked when parent send 'downloadEvent' to child
	$scope.$on('downloadEvent', function (e, aggBy) {
		var f = prepareFilterObject();
		f.aggregateBy = aggBy;
		$scope.downloadReport(f);
	});

	$scope.DatePicker = angular.copy(DatePicker);
	/*
	* Define empty filterObj to filter data accordingly
	* */
	$scope.filterObj = {};

	/*
	* Multi Select with Search Dropdown Settings
	* */
	$scope.selectSettings = {
		displayProp: 'name',
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		smartButtonTextConverter: function (itemText, originalItem) {
			return itemText;
		}
	};

	/*
	* Multi Select with Search Dropdown Events*/
	$scope.selectEvents = {
		onSelectionChanged: function () {
			$scope.getAllTripExp(true);
		}
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if ($scope.trip_no) {
			myFilter.trip_no = $scope.trip_no;
		}
		if ($scope.gr_no) {
			myFilter.gr_no = $scope.gr_no;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.filterObj.route) {
			myFilter.route_id = $scope.filterObj.route.map(obj => obj._id);
		}
		if ($scope.filterObj.customer) {
			myFilter.customer_id = $scope.filterObj.customer.map(obj => obj._id);
		}
		if ($scope.filterObj.driver) {
			myFilter.driver = $scope.filterObj.driver.map(obj => obj._id);
		}
		if ($scope.filterObj.type) {
			myFilter.type = $scope.filterObj.type;
		}
		if ($scope.filterObj.paidToVendor) {
			myFilter.paidToVendor = $scope.filterObj.paidToVendor;
		}
		if ($scope.start_date) {
			myFilter.from = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.to = $scope.end_date.toISOString();
		}
		if ($scope.reportType && $scope.reportType.name) {
			myFilter.reportType = $scope.reportType.name;
		}
		if ($scope.filterObj.vendor) {
			myFilter.vendor = $scope.filterObj.vendor.map(obj => obj._id);
		}
		if (isPagination && $scope.pagination.currentPage) {
			myFilter.skip = $scope.pagination.currentPage;
		}
		myFilter.all = true;

		return myFilter;
	}

	$scope.getAllTripExp = function (isPagination) {
		function success(res) {
			if (res.data.data) {
				$scope.aTripExpense = res.data.data;
				$scope.pagination.total_pages = res.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.data.count;

				if ($scope.aTripExpense) {
					$scope.aTripExpense = $scope.aTripExpense.map(function (obj) {
						if (obj.trip.vendorDeal.advance > obj.vNet) {
							obj.v_adv_remaining = obj.trip.vendorDeal.advance - obj.vNet;
							obj.v_topay_remaining = obj.trip.vendorDeal.toPay;
						} else {
							obj.remaining = obj.vNet - obj.trip.vendorDeal.advance;
							obj.v_adv_remaining = 0;
							obj.v_topay_remaining = obj.trip.vendorDeal.toPay - obj.remaining;
						}
						return obj;
					});
				}
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		// oFilter.aggregateBy = 'vehicle_no';
		billsService.getAllAggrTripsExpense(oFilter, success);
	};

	$scope.downloadReport = function (oFilter) {
		oFilter.download = 'true';
		billsService.getAllAggrTripsExpense(oFilter, function (data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	};

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'customer':
				$scope.tripCustomer = '';
				$scope.getCname($scope.tripCustomer);
				break;
			case 'vehicle':
				$scope.vehicle_no = '';
				$scope.getVname($scope.vehicle_no);
				break;
			case 'route':
				$scope.route_id = '';
				$scope.getDname($scope.route_id);
				break;
			default:
				break;
		}
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			$scope.getAllTripExp();
		}
	};

	$scope.getVendorName = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVendor = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			objValue = {};
			objValue.name = viewValue;
			objValue.deleted = false;

			Vendor.getAllVendorsList(objValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};

	/*
    * get Routes for filters in Multiple select dropdown with search
    * */
	$scope.getRoutes = function (inputModel) {
		if (inputModel.length <= 2)
			return;

		function success(response) {

			$scope.routes = [];
			Array.prototype.push.apply($scope.routes, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		Routes.getAllRoutes({name: inputModel}, success, failure);
	};

	/*
    * get Customer for filters in Multiple select dropdown with search
    * */
	$scope.getCustomers = function (inputModel) {
		if (inputModel.length <= 2)
			return;

		function success(response) {

			$scope.customers = [];
			Array.prototype.push.apply($scope.customers, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		customer.getCustomerSearch(inputModel, success, failure);
	};

	/*
    * get Driver for filters in Multiple select dropdown with search
    * */
	$scope.getDrivers = function (inputModel) {
		if (inputModel.length <= 2)
			return;

		function success(response) {

			$scope.drivers = [];
			Array.prototype.push.apply($scope.drivers, response.data.data.map(function (obj) {
				return {
					name: obj.name,
					_id: obj._id
				};
			}));

		}

		function failure(response) {
			console.log(response);
		}

		Driver.getName(inputModel, success, failure);
	};

	$scope.setMaxDate = function (startDate) {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
		$scope.maxDate = new Date((new Date(startDate)).getTime() + (3 * 30 * 24 * 60 * 60 * 1000));
	};
	$scope.setEndDate = function () {
		$scope.end_date = new Date(new Date($scope.end_date).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	};

});

materialAdmin.controller('profitReportCntrl', function ($rootScope, $scope, $uibModal, DateUtils, $state, tripServices, billsService, Vehicle, Routes, bookingServices, customer, Pagination) {

	$scope.aBranch = ['Delhi', 'Dplah', 'Indore', 'Ujjain', 'Panipat', 'Jammu', 'Shajapur'];
	$scope.aBookingTypes = ['Import - Containerized', 'Export – Containerized', 'Import - Loose Cargo', 'Export – Loose cargo', 'Container FS', 'Container FDS', 'Domestic – Loose cargo'];
	$scope.infoSingleTrip = {};

	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.items_per_page = 8;
	$scope.pageChanged = function () {
		$scope.getProfitReport(true);
	};
	var oFilterForDownload;

	function prepareFilterObject(isPagination) {
		var myFilter = {'all': 'true'};
		//myFilter.trip_stage = true;
		if ($scope.trip_no) {
			myFilter.trip_no = $scope.trip_no;
		}
		if ($scope.booking && $scope.booking.length <= 5) {
			myFilter.booking_no = $scope.booking;
		} else if ($scope.booking && $scope.booking.length > 5) {
			myFilter.bookingId = $scope.booking;
		}
		if ($scope.boe_no) {
			myFilter.boe_no = $scope.boe_no;
		}
		/*if($scope.bookingType){
        myFilter.booking_type = $scope.bookingType;
       } */
		if ($scope.tripCustomer && $scope.tripCustomer.name) {
			myFilter.customer_id = $scope.tripCustomer._id;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.route_id) {
			myFilter.route_id = $scope.route_id;
		}
		if ($scope.branch) {
			myFilter.branch = $scope.branch;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		oFilterForDownload = myFilter;
		return myFilter;
	};

	$scope.downloadProfitability = function () {
		oFilterForDownload.report_download = true;

		function success(res) {
			var a = document.createElement('a');
			a.href = res.data.url;
			a.download = res.data.url;
			a.target = '_blank';
			a.click();
			oFilterForDownload.report_download = false;
		};
		billsService.getProfitReportServ(oFilterForDownload, success);
	};

	$scope.getProfitReport = function (isPagination) {
		function success(res) {
			if (res.data.data) {
				$scope.aProfitReport = res.data.data;
				for (var l = 0; l < $scope.aProfitReport.length; l++) {
					if ($scope.aProfitReport[l].datetime) {
						$scope.aProfitReport[l].datetime = moment($scope.aProfitReport[l].datetime).format('LLL');
					}
				}
				$scope.total_pages = res.data.pages;
				$scope.totalItems = 15 * res.data.pages;
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		billsService.getProfitReportServ(oFilter, success);
	};
	//$scope.getProfitReport();

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'customer':
				$scope.tripCustomer = '';
				$scope.getCname($scope.tripCustomer);
				break;
			case 'vehicle':
				$scope.vehicle_no = '';
				$scope.getCname($scope.vehicle_no);
				break;
			case 'route':
				$scope.route = '';
				$scope.getDname($scope.route);
				break;
			default:
				break;
		}
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCustomerSearch(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {

		}
		;
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		} else if (viewValue == '') {

		}
	};

	$scope.onSelect = function ($item, $model, $label) {

	};

	$scope.setStartDate = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	};

	$scope.setEndDate = function () {
		$scope.end_date = new Date(new Date($scope.end_date).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	};

	$scope.getAllRoutes = function () {
		function success(data) {
			$scope.aRoute = data.data.data;
		};
		Routes.getAllRoutes({}, success);
	};
	$scope.getAllRoutes();

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
	//************* New Date Picker for multiple date selection in single form ******************

});

materialAdmin.controller('initialProfitReportCntrl', function ($rootScope, $scope, $uibModal, DateUtils, $state, tripServices, billsService, Vehicle, FleetService, Pagination) {

	$scope.infoSingleTrip = {};
	$scope.currentPage = 1;
	$scope.pagination = angular.copy(Pagination);
	$scope.pagination.maxSize = 5;
	$scope.pagination.items_per_page = 8;
	$scope.pageChanged = function () {
		$scope.getProfitReport(true);
	};
	var oFilterForDownload;

	function prepareFilterObject(isPagination) {
		var myFilter = {'all': 'true'};
		if ($scope.fleet && $scope.fleet.name) {
			myFilter.owner_group = $scope.fleet.name;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.start) {
			myFilter.start = $scope.start.toISOString();
		}
		if ($scope.end) {
			myFilter.end = $scope.end.toISOString();
		}
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		oFilterForDownload = myFilter;
		return myFilter;
	}

	$scope.downloadInitialProfitability = function () {
		oFilterForDownload.download = true;

		function success(res) {
			var a = document.createElement('a');
			a.href = res.data.url;
			a.download = res.data.url;
			a.target = '_blank';
			a.click();
			oFilterForDownload.download = false;
		}

		billsService.getInitialProfitReportServ(oFilterForDownload, success);
	};

	$scope.getInitialProfitReport = function (isPagination) {
		function success(res) {
			if (res.data.data) {
				$scope.aInitialProfitReport = res.data.data;
				for (var l = 0; l < $scope.aInitialProfitReport.length; l++) {
					if ($scope.aInitialProfitReport[l].datetime) {
						$scope.aInitialProfitReport[l].datetime = moment($scope.aInitialProfitReport[l].datetime).format('LLL');
					}
					$scope.aInitialProfitReport[l].totalDiesel = $scope.aInitialProfitReport[l].diesel + $scope.aInitialProfitReport[l].extraDiesel;
					$scope.aInitialProfitReport[l].hsdWorking = parseInt(((($scope.aInitialProfitReport[l].totalDiesel) / $scope.aInitialProfitReport[l].totalWorking) * 100 || 0) * 100) / 100 + '%' || 0;
					$scope.aInitialProfitReport[l].hsdMilage = $scope.aInitialProfitReport[l].totalrun / $scope.aInitialProfitReport[l].totalDiesel;
					$scope.aInitialProfitReport[l].netAmount = $scope.aInitialProfitReport[l].totalWorking - (($scope.aInitialProfitReport[l].Shortage || 0) + ($scope.aInitialProfitReport[l].totalDiesel || 0) + ($scope.aInitialProfitReport[l].driverCash || 0) + ($scope.aInitialProfitReport[l].miscExpense || 0));
					$scope.aInitialProfitReport[l].netAmountPercent = parseInt(($scope.aInitialProfitReport[l].netAmount / $scope.aInitialProfitReport[l].totalWorking || 0) * 100) / 100 + '%';
				}
				$scope.total_pages = res.data.pages;
				$scope.totalItems = 15 * res.data.pages;
			}
		}

		var oFilter = prepareFilterObject(isPagination);
		billsService.getInitialProfitReportServ(oFilter, success);
	};

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'fleet':
				$scope.fleet = '';
				$scope.getFname($scope.fleet);
				break;
			case 'vehicle':
				$scope.vehicle_no = '';
				$scope.getCname($scope.vehicle_no);
				break;
			default:
				break;
		}
	};

	$scope.getFname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aFleetOwner = response.data.data;
			}

			function oFailC(response) {
				console.log(response);
			}

			FleetService.getName(viewValue, oSucC, oFailC);
		} else if (viewValue === '') {

		}
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		} else if (viewValue === '') {

		}
	};

	$scope.onSelect = function ($item, $model, $label) {

	};

	$scope.setStartDate = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	};

	$scope.setEndDate = function () {
		$scope.end_date = new Date(new Date($scope.end_date).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
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
	//************* New Date Picker for multiple date selection in single form ******************

});

materialAdmin.controller('billDispatchController', function (
	$rootScope,
	$scope,
	$state,
	$uibModal,
	$localStorage,
	Routes,
	DateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	bookingServices,
	tripServices,
	invoiceService,
	lazyLoadFactory,
	growlService,
	Vehicle,
	URL,
	dmsService
) {

	$scope.uploadDocs = uploadDocs;
	$scope.previewDocs = previewDocs;
	$scope.getGeneratedBills = getGeneratedBills;
	$scope.billCancellationORApprovePopup = billCancellationORApprovePopup;
	$scope.billOperation = billOperation;
	$scope.getBillingPartyName = getBillingPartyName;
	$scope.onSelect = onSelect;
	$scope.updateBillForDispatch = updateBillForDispatch;
	$scope.printBill = printBill;

	// init
	(function init() {

		$scope.DatePicker = DatePicker;
		$scope.selectType = 'index';
		$scope.myFilter = {};
		$scope.myFilter.grStatus = 'Approved';
		$scope.columnSetting = {
			allowedColumn: [
				'actual bill no',
				'Gr No.',
				'status',
				'billing party',
				'billing date',
				'due date',
				'amount',
				'amount received',
				'due amount',
				'cgst',
				'sgst',
				'igst',
				'total tax',
				'CoverNote No',
				'created by',
			]
		};
		$scope.tableHead = [
			{
				'header': 'actual bill no',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Gr No.',
				'filter': {
					'name': 'getGrNumber',
					'aParam': [
						'items',
						'"gr"',
					]
				}
			},
			{
				'header': 'bill type',
				'bindingKeys': 'type'
			},
			{
				'header': 'status',
				'bindingKeys': 'status'
			},
			{
				'header': 'billing party',
				'bindingKeys': 'billingParty.name'
			},
			{
				'header': 'billing date',
				'bindingKeys': 'billDate',
				'date': true
			},
			{
				'header': 'due date',
				'bindingKeys': 'dueDate',
				'date': true
			},
			{
				'header': 'amount',
				'bindingKeys': 'billAmount',
				'date': false
			},
			{
				'header': 'amount received',
				'bindingKeys': 'this|calculateReceivedAmount',
				'eval': true
			},
			{
				'header': 'due amount',
				'bindingKeys': 'billAmount - (this|calculateReceivedAmount)',
				'eval': true
			},
			{
				'header': 'cgst',
				'bindingKeys': 'cGST',
				'date': false
			},
			{
				'header': 'sgst',
				'bindingKeys': 'sGST',
				'date': false
			},
			{
				'header': 'igst',
				'bindingKeys': 'iGST',
				'date': false
			},
			{
				'header': 'total tax',
				'bindingKeys': 'cGST + sGST + iGST',
				'eval': true
			},
			{
				'header': 'CoverNote No',
				'bindingKeys': 'coverNote.cnNo',
				'date': false
			},
			{
				'header': 'created by',
				'bindingKeys': 'created_by_name',
				'date': false
			},
		];
		$scope.abillStatus = $scope.$constants.abillStatus.filter(obj => obj !== 'Unapproved');
		$scope.lazyLoad = lazyLoadFactory();
		$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		getGeneratedBills();

	})();


	//function Implemention
	//filter for Invoice
	function prepareFilterObject() {
		var myFilter = {};

		if ($scope.myFilter.start_date)
			myFilter.start_date = $scope.myFilter.start_date;

		if ($scope.myFilter.end_date)
			myFilter.end_date = $scope.myFilter.end_date;

		if ($scope.myFilter.bill_no)
			myFilter.billNo = $scope.myFilter.bill_no;

		if ($scope.myFilter.search_billParty)
			myFilter.billingParty = $scope.myFilter.search_billParty._id;

		if ($scope.myFilter.grStatus)
			myFilter.status = $scope.myFilter.grStatus;

		if ($scope.myFilter.dateType)
			myFilter.dateType = $scope.myFilter.dateType;

		if ($scope.myFilter.branch) {
			myFilter.branches = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			myFilter.branches = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branches.push(obj._id);
			});
		}

		if ($scope.myFilter.gr_no)
			myFilter['items.gr.grNumber'] = $scope.myFilter.gr_no;

		myFilter.skip = $scope.lazyLoad.currentPage;
		// else
		// 	myFilter.all = 'true';

		myFilter.status = myFilter.status ? myFilter.status : 'Approved';
		myFilter['approve.status'] = true;
		myFilter.no_of_docs = 10;
		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		// myFilter.sort = {
		// 	$natural: -1
		// };
		return myFilter;
	}

	function billOperation(operationType) {

		console.log('to perform operation on Bill');
		var grData = {
			operationType: operationType,
			oBill: $scope.selectedBills
		};

		$state.go('billing.previewBill', {data: grData});
	}

	// function uploadDocs() {
	// 	var aAllowedFiles = ['Payment Advice', 'Charges Approval', 'Other'];
	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/uploadFiles.html',
	// 		controller: 'uploadFilesPopUpCtrl',
	// 		resolve: {
	// 			oUploadData: {
	// 				modelName: 'bill',
	// 				scopeModel: $scope.selectedBills,
	// 				scopeModelId: $scope.selectedBills._id,
	// 				uploadText: "Upload Docs",
	// 				aAllowedFiles: aAllowedFiles,
	// 				uploadFunction: Vehicle.uploadDocs
	// 			}
	// 		}
	// 	});
	// 	modalInstance.result.then(function (data) {
	// 		$state.reload();
	// 	}, function (data) {
	// 		$state.reload();
	// 	});
	// }

	// function previewDocs() {
	// 	if (!Array.isArray($scope.selectedBills.documents) || $scope.selectedBills.documents.length < 1) {
	// 		growlService.growl("No documents to preview", "warning");
	// 		return;
	// 	}
	// 	var documents = $scope.selectedBills.documents.map(curr => ({
	// 		...curr,
	// 		url: `${URL.BASE_URL}documents/view/${curr.docReference}`
	// 	}));
	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/carouselPopup.html',
	// 		controller: 'carouselCtrl',
	// 		resolve: {
	// 			documents: function () {
	// 				return documents;
	// 			}
	// 		}
	// 	});
	// }

	function uploadDocs(oBill) {
		if (oBill.length > 1) {
			swal('Warning', 'Please select only One Row', 'warning');
			return;
		}
		let selectedBill = oBill[0] || oBill;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'bill',
					scopeModel: selectedBill,
					scopeModelId: selectedBill._id,
					uploadText: "Upload Bill Documents",
					uploadFunction: Vehicle.uploadDocs
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	}

	function previewDocs(oBill) {
		if (!oBill._id)
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs() {
			let req = {
				_id: oBill._id,
				modelName: "bill"
			};
			dmsService.getAllDocs(req, success, failure);

			function success(res) {
				if (res && res.data) {
					$scope.oDoc = res.data;
					prepareData();
				} else {
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

		function prepareData() {
			let mergeData = {};
			$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj => {
				mergeData[obj.category] = mergeData[obj.category] || [];
				mergeData[obj.category].push(obj);
			});
			$scope.oDoc = mergeData;

			for (let [key, val] of Object.entries($scope.oDoc)) {
				if (Array.isArray(val)) {
					val.forEach((doc, i) => {
						let name = `${key || 'misc'} ${i || ''}`.toUpperCase();
						documents.push({
							name,
							docName: doc.name,
							_id: oBill._id,
							modelName: 'bill',
							url: `${URL.file_server}${doc.name}`
						});
					});
				} else {
					let name = `${key || 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName: doc.name,
						_id: oBill._id,
						modelName: 'bill',
						url: `${URL.file_server}${doc.name}`
					});
				}
			}

			$uibModal.open({
				templateUrl: 'views/carouselPopup.html',
				controller: 'carouselCtrl',
				resolve: {
					documents: function () {
						return documents;
					}
				}
			});
		}

		// if (documents.length < 1) {
		// 	growlService.growl("No documents to preview", "warning");
		// 	return;
		// }

	};

	function getGeneratedBills(isGetActive) {

		if (!$scope.lazyLoad.update(isGetActive))
			return;

		billsService.getGenerateBill(prepareFilterObject(), onSuccess, onFailure);

		// Handle failure response
		function onFailure(err) {
			console.log(err);
			swal('Error!', err.data.message, 'error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response.data);
		}
	}

	function billCancellationORApprovePopup(type) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billCancellationPopup.html',
			controller: 'billCancellationORApprovePopup',
			resolve: {
				Type: function () {
					return type;
				},
				oBill: function () {
					return $scope.selectedBills;
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log(response);

			function success(response) {
				console.log(response);
				swal('Bill Successfully ' + type + 'ed');
				$state.reload();
			}

			function failure(response) {
				console.log(response);
			}

			var reqObj = {};

			if (type === 'Cancel') {
				reqObj._id = $scope.selectedBill[0]._id;
				reqObj.cancel_reason = response.reason;
				reqObj.cancel_remark = response.remark;
				billsService.cancelBill(reqObj, success, failure);
			}
		});
	}

	function getBillingPartyName(viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		billingPartyService.getBillingParty({name: viewValue}, res => $scope.aBillingParty = res.data, err => console.log`${err}`);
	}

	function onSelect($item, $model, $label) {
		getGeneratedBills();
	}

	function updateBillForDispatch() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/dipatchPopUp.html',
			controller: 'dispatchPopUpCtrl',
			resolve: {
				Bill: function () {
					return $scope.selectedBills;
				}
			}
		});

		modalInstance.result.then(function (data) {
			swal(data, '', 'success');
		}, function (data) {
			swal('Oops!', data, 'error');
		});
	}

	function printBill() {
		var oFilter = {
			_id: $scope.selectedBills._id,
			//gr: $scope.selectedBills.items[0].gr
			gr: $scope.selectedBills
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	}


});

materialAdmin.controller('billAcknowledgeController', function (
	$rootScope,
	$scope,
	$state,
	$uibModal,
	$localStorage,
	Routes,
	DateUtils,
	DatePicker,
	billsService,
	bookingServices,
	billingPartyService,
	tripServices,
	invoiceService,
	Pagination,
	customer) {

	$scope.pagination = angular.copy(Pagination);
	$scope.selectedBill = {};
	$scope.DatePicker = DatePicker;
	$scope.myFilter = {};
	$scope.pagination.maxSize = 5;
	$scope.pagination.items_per_page = 8;
	$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

	//filter for Invoice
	function prepareInvoiceFilterObject() {
		var myFilter = {};
		if ($scope.myFilter.start_date) {
			myFilter.start_date = $scope.myFilter.start_date;
		}
		if ($scope.myFilter.end_date) {
			myFilter.end_date = $scope.myFilter.end_date;
		}
		if ($scope.myFilter.bill_no) {
			myFilter.billNo = $scope.myFilter.bill_no;
		}
		if ($scope.myFilter.search_billParty) {
			myFilter.billingParty = $scope.myFilter.search_billParty._id;
		}
		if ($scope.myFilter.search_route) {
			myFilter['item.route'] = $scope.myFilter.search_route._id;
		}
		if ($scope.myFilter.grStatus) {
			myFilter.status = $scope.myFilter.grStatus;
		}
		if ($scope.myFilter.dateType) {
			myFilter.dateType = $scope.myFilter.dateType;
		}
		if (!$scope.myFilter.gr_no) {
			myFilter.skip = $scope.pagination.currentPage;
			myFilter.no_of_docs = $scope.pagination.items_per_page;
		} else {
			myFilter.all = 'true';
		}
		if ($scope.myFilter.dateType) {
			myFilter.status = $scope.myFilter.dateType;
		}
		if ($scope.myFilter.branch) {
			myFilter.branches = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			myFilter.branches = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branches.push(obj._id);
			});
		}
		myFilter['approve.status'] = true;
		myFilter.cancelled = {$ne: true};
		myFilter.sort = {_id: -1};
		return myFilter;
	}

	$scope.billOperation = function (operationType) {
		console.log('to perform operation on Bill');
		var grData = {
			operationType: operationType,
			oBill: $scope.selectedBill,
			stateToSend: 'billing.billAcknowledge'
		};

		$state.go('billing.previewBill', {data: grData});
	};

	$scope.selectThisRow = function (bill, index) {
		$scope.selectedBill = bill;
		$($('.detailsList tbody tr')).removeClass('grn');
		var row = $($('.detailsList tbody tr')[index]);
		row.addClass('grn');
	};

	$scope.clearSelection = function () {
		$($('.detailsList tbody tr')).removeClass('grn');
		$scope.selectedBill = {};
	};

	$scope.uploadAcknowledgeBill = function (selectedBill) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/singleDocumentUploadPopup.html',
			controller: 'singleDocumentUploadPopupController',
			resolve: {
				label: function () {
					return 'Upload Bill';
				}
			}
		});

		modalInstance.result.then(function (data) {
			var request = {};
			request.fileUpload = data;
			request._id = selectedBill._id;
			console.log();
			return;
		}, function (data) {
			swal('File Upload Canceled', '', 'error');
		});
	};

	$scope.acknowledgeBill = function (selectedBill) {
		$scope.type = 'Acknowledge';
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billAcknowledgeDataPopup.html',
			controller: 'billAcknowledgeDataPopupController',
			resolve: {
				selectedBillData: function () {
					return selectedBill;
				},
				type: function () {
					return $scope.type;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
		}, function (data) {
			// swal("Bill Acknowledge Canceled",'', "error")
		});
	};

	($scope.getAcknowledgedBills = function () {
		function success(data) {
			if (data.data && data.data.data) {
				if ($scope.myFilter.gr_no) {
					$scope.aBill = data.data.data.filter(function (d) {
						return d.items.find(i => i.gr.grNumber === $scope.myFilter.gr_no)
					});
					$scope.pagination.total_pages = 1;
					$scope.pagination.totalItems = 1;
				} else {
					$scope.aBill = data.data.data;
					$scope.pagination.total_pages = data.data.count / $scope.pagination.items_per_page;
					$scope.pagination.totalItems = data.data.count;
				}
				setTimeout(function () {
					$scope.selectThisRow($scope.aBill[0], 0);
				});
			}
		}

		function failure(res) {
			swal('Some error with GET bills.', JSON.stringify(res), 'error');
		}

		var oFilter = prepareInvoiceFilterObject();
		if ($scope.myFilter.dateType) {
			if (!($scope.myFilter.start_date && $scope.myFilter.end_date)) {
				swal('warning', 'Please fill From Date and To Date', 'warning');
				return;
			}
		}
		billsService.getGenerateBill(oFilter, success, failure);
	})();

	$scope.clearSearch = function (val) {
		switch (val) {
			case 'customer':
				$scope.search_customer = '';
				$scope.getCname($scope.search_customer);
				break;
			case 'billingParty':
				$scope.search_billParty = '';
				$scope.getBillingPartyName($scope.search_billParty);
				break;
			case 'route':
				$scope.search_route = '';
				$scope.getDname($scope.search_route);
				break;
			default:
				break;
		}
	};

	$scope.getBillingPartyName = function (viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		billingPartyService.getBillingParty({name: viewValue}, res => $scope.aBillingParty = res.data, err => console.log`${err}`);
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			var requestObj = {
				name: viewValue,
				type: JSON.stringify(['Billing party'])
			};
			customer.getAllCustomersNew(requestObj, oSucC, oFailC);
		}
	};

	$scope.getDname = function (viewValue) {
		function oSucD(response) {
			$scope.aRoute = response.data.data;
		};

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getAllRoutes({name: viewValue}, oSucD, oFailD);
		}
	};

	$scope.printBill = function () {
		var oFilter = {
			_id: $scope.selectedBill._id,
			//gr: $scope.selectedBill.items[0].gr
			gr: $scope.selectedBill
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	};
});

materialAdmin.controller('billAcknowledgeDataPopupController', function (
	$scope,
	$state,
	$timeout,
	$uibModalInstance,
	accountingService,
	DatePicker,
	selectedBillData,
	billsService,
	type
) {

	$scope.accountmaster = getAccountById;

	(function init() {

		$scope.DatePicker = DatePicker;
		$scope.type = angular.copy(type);
		$scope.selectedBillData = angular.copy(selectedBillData);
		$scope.selectedBillData.paymentDate = new Date();
		$scope.selectedBillData.type = 'New Ref';
		$scope.selectedBillData.paymentRef = 'Gr Bill';

		if (!(selectedBillData.billingParty && selectedBillData.billingParty.account)) {
			swal('', 'No Billing Party Account Found, Please add Account to Acknowledge the bill', 'error');
			$scope.closeModal();
		}

		if(selectedBillData.acknowledge){
			if(selectedBillData.acknowledge.salesAccount)
				getAccountById(selectedBillData.acknowledge.salesAccount)
					.then(aData => {
						$scope.oData.sales.accountName = aData[0].name;
						$scope.oData.sales.from = aData[0]._id;
					});

			if(selectedBillData.acknowledge.cGSTAccount)
				getAccountById(selectedBillData.acknowledge.cGSTAccount)
					.then(aData => {
						$scope.oData.cgst.accountName = aData[0].name;
						$scope.oData.cgst.from = aData[0]._id;
					});

			if(selectedBillData.acknowledge.sGSTAccount)
				getAccountById(selectedBillData.acknowledge.sGSTAccount)
					.then(aData => {
						$scope.oData.sgst.accountName = aData[0].name;
						$scope.oData.sgst.from = aData[0]._id;
					});

			if(selectedBillData.acknowledge.iGSTAccount)
				getAccountById(selectedBillData.acknowledge.iGSTAccount)
					.then(aData => {
						$scope.oData.igst.accountName = aData[0].name;
						$scope.oData.igst.from = aData[0]._id;
					});

		}

		if (!selectedBillData.salesAccountName) {
			$scope.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === selectedBillData.billingParty.clientId);
			$scope.clientAccount = $scope.clientAccount || {};
		}

		$scope.oData = {
			_id: selectedBillData._id,
			acknowledge: {
				date: new Date(),
				remark: `Bill No:${selectedBillData.billNo}, Approval Date: ${moment().format("DD/MM/YYYY")}, Party: ${selectedBillData.billingParty.name}`,
			},
			sales: {
				amount: selectedBillData.amount,
				accountName: selectedBillData.salesAccountName || $scope.clientAccount.salesAccName,
				from: selectedBillData.salesAccount || $scope.clientAccount.salesAcc
			},
			igst: {
				amount: selectedBillData.iGST,
				accountName: selectedBillData.iGSTAccountName || $scope.clientAccount.igstAccName,
				percent: selectedBillData.iGST_percent,
				from: selectedBillData.iGSTAccount || $scope.clientAccount.igstAcc
			},
			cgst: {
				amount: selectedBillData.cGST,
				accountName: selectedBillData.cGSTAccountName || $scope.clientAccount.cgstAccName,
				percent: selectedBillData.cGST_percent,
				from: selectedBillData.cGSTAccount || $scope.clientAccount.cgstAcc
			},
			sgst: {
				amount: selectedBillData.sGST,
				accountName: selectedBillData.sGSTAccountName || $scope.clientAccount.sgstAccName,
				percent: selectedBillData.sGST_percent,
				from: selectedBillData.sGSTAccount || $scope.clientAccount.sgstAcc
			},
			woAcc: {
				amount: selectedBillData.totCwt,
				accountName: selectedBillData.woAccName || $scope.clientAccount.woAccName,
				from: selectedBillData.woAcc || $scope.clientAccount.woAcc
			},
		};
		if (selectedBillData.adjAmount) {
			$scope.oData.adj = {
				amount: selectedBillData.adjAmount,
				accountName: selectedBillData.adjDebitAcName,
				from: selectedBillData.adjDebitAc
			}
		}
	})();

	$scope.closeModal = function () {
		$uibModalInstance.dismiss();
	};

	function getAccountById(_id) {
		return new Promise(function (resolve, reject) {
			if(!_id)
				resolve([]);

			let req = {
				_id
			};

			accountingService.getAccountMaster(req, res => {
				resolve(res.data.data);
			}, err => {
				console.log`${err}`;
				reject([]);
			});

		});
	}

	$scope.acknowledgeBill = function (form) {
		if (!form.$valid)
			return swal('Error', 'Please fill all mandatory fields', 'error');

		let request = {
			_id: $scope.selectedBillData._id,
			date: $scope.oData.acknowledge.date,
			remark: $scope.oData.acknowledge.remark,
			salesAccountName: $scope.oData.sales.accountName,
			salesAccount: $scope.oData.sales.from,
			iGSTAccountName: $scope.oData.igst.accountName,
			iGSTAccount: $scope.oData.igst.from,
			cGSTAccountName: $scope.oData.cgst.accountName,
			cGSTAccount: $scope.oData.cgst.from,
			sGSTAccountName: $scope.oData.sgst.accountName,
			sGSTAccount: $scope.oData.sgst.from,
			woAccName: $scope.oData.woAcc.accountName,
			woAcc: $scope.oData.woAcc.from,
		};
		if ($scope.selectedBillData.adjAmount) {
			request.adjDebitAcName = $scope.oData.adj.accountName,
				request.adjDebitAc = $scope.oData.adj.from
		}

		billsService.acknowledgeBill(request, success, failure);

		function success(res) {
			$state.reload();
			swal('Success', res.data.message, 'success');
			$uibModalInstance.close('acknowledged');
		}

		function failure(res) {
			swal(res.data.message, '', 'error');
		}
	};

});

materialAdmin.controller('billSettlementController', function (
	$rootScope,
	$scope,
	$state,
	$timeout,
	$uibModal,
	$localStorage,
	accountingService,
	Routes,
	DateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	bookingServices,
	tripServices,
	invoiceService,
	Pagination,
	customer) {

	var vm = this;

	vm.DatePicker = DatePicker;
	vm.multipeBillSelection = false;
	vm.myFilter = {};
	vm.pagination = angular.copy(Pagination);
	vm.selectedBill = [];
	vm.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

	vm.addOrRemoveSelectedBill = addOrRemoveSelectedBill;
	vm.clearSelection = clearSelection;
	vm.creditNote = creditNote;
	vm.getAcknowledgedBills = getAcknowledgedBills;
	vm.getCname = getCname;
	vm.getBillingPartyName = getBillingPartyName;
	vm.printBill = printBill;
	vm.selectOrDeSelectAll = selectOrDeSelectAll;
	vm.selectThisRow = selectThisRow;
	vm.settleBill = settleBill;

	(function init() {
		getAcknowledgedBills();
	})();

	function addOrRemoveSelectedBill(bool, billObj) {
		if (bool) {
			vm.selectedBill.push(billObj);
			if (vm.selectedBill.length === vm.aBill.length)
				vm.boolJustCheck = true;
		} else {
			var indexToRemove = vm.selectedBill.findIndex(obj => obj._id == billObj._id);
			vm.selectedBill.splice(indexToRemove, 1);
			vm.boolJustCheck = false;
		}
	}

	//filter for Invoice
	function prepareInvoiceFilterObject() {
		var myFilter = {};
		if (vm.myFilter.start_date) {
			myFilter.start_date = vm.myFilter.start_date;
		}
		if (vm.myFilter.end_date) {
			myFilter.end_date = vm.myFilter.end_date;
		}
		if (vm.myFilter.bill_no) {
			myFilter.billNo = vm.myFilter.bill_no;
		}
		if (vm.myFilter.search_billParty) {
			myFilter.billingParty = vm.myFilter.search_billParty._id;
		}
		if (vm.myFilter.branch) {
			myFilter.branches = vm.myFilter.branch._id;
		} else if (vm.aBranch && vm.aBranch.length) {
			myFilter.branches = [];
			vm.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branches.push(obj._id);
			});
		}
		if (vm.myFilter.gr_no)
			myFilter['items.gr.grNumber'] = vm.myFilter.gr_no;
		// if (!vm.myFilter.gr_no) {
		myFilter.skip = vm.pagination.currentPage;
		myFilter.no_of_docs = vm.pagination.items_per_page;
		// }
		myFilter['acknowledge.status'] = true;
		myFilter['approve.status'] = true;
		myFilter.cancelled = {$ne: true};
		// myFilter.sort = {
		// 	$natural: -1
		// };
		return myFilter;
	}

	function clearSelection() {
		$($('.detailsList tbody tr')).removeClass('grn');
		vm.selectedBill = [];
		vm.multipeBillSelection = false;
	}

	function creditNote() {
		$state.go('billing.creditNoteUpsert', {
			data: {
				'billSettlement': vm.selectedBill,
			}
		});
	}

	function settleBill() {
		$state.go('billing.upsertMR', {
			data: {
				'billSettlement': vm.selectedBill,
			}
		});
	}

	function getAcknowledgedBills() {
		function success(data) {
			if (data.data && data.data.data) {
				if (vm.myFilter.gr_no) {
					vm.aBill = data.data.data.filter(function (d) {
						return d.items.find(i => i.gr.grNumber === vm.myFilter.gr_no)
					}).map(obj => {
						obj.crDrAmount = (obj.dcNotes || []).reduce((a, b) => a + b.netAmount, 0);
						return obj;
					});
					vm.pagination.total_pages = 1;
					vm.pagination.totalItems = 1;
				} else {
					vm.aBill = data.data.data.map(obj => {
						obj.crDrAmount = (obj.dcNotes || []).reduce((a, b) => a + b.netAmount, 0);
						return obj;
					});
					vm.pagination.total_pages = data.data.count / vm.pagination.items_per_page;
					vm.pagination.totalItems = data.data.count;
				}
				setTimeout(function () {
					vm.selectThisRow(vm.aBill[0], 0);
				});
			}
		}

		function failure(res) {
			swal('Some error with GET bills.', JSON.stringify(res), 'error');
		}

		var oFilter = prepareInvoiceFilterObject();
		billsService.getGenerateBill(oFilter, success, failure);
	}

	function getCname(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {

			var requestObj = {
				name: viewValue,
				type: JSON.stringify(['Billing party'])
			};
			customer.getAllCustomersNew(requestObj, oSucC, oFailC);

			function oSucC(response) {
				vm.aCustomer = response.data;
			}

			function oFailC(response) {
				console.log(response);
			}
		}
	}

	function getBillingPartyName(viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		billingPartyService.getBillingParty({name: viewValue}, res => vm.aBillingParty = res.data, err => console.log`${err}`);
	};

	function printBill() {
		var oFilter = {
			_id: vm.selectedBill[0]._id,
			//gr: vm.selectedBill[0].items[0].gr
			gr: vm.selectedBill[0]
		};
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	}

	function selectOrDeSelectAll() {
		$timeout(function () {
			if (vm.boolJustCheck) {
				vm.aBill.map(function (oBill) {
					oBill.boolJustCheck = true;
					addOrRemoveSelectedBill(oBill.boolJustCheck, oBill);
				});

			} else {
				vm.aBill.map(function (oBill) {
					oBill.boolJustCheck = false;
					addOrRemoveSelectedBill(oBill.boolJustCheck, oBill);
				});
			}
		}, 0);
	}

	function selectThisRow(bill, index) {
		if (vm.multipeBillSelection)
			return;

		vm.selectedBill[0] = bill;
		$($('.detailsList tbody tr')).removeClass('grn');
		var row = $($('.detailsList tbody tr')[index]);
		row.addClass('grn');
	}

	vm.onSelect = function ($item, $model, $label) {
		getAcknowledgedBills();
		vm.selectedBill = [];
		vm.multipeBillSelection = true;
	};
});

materialAdmin.controller('settleSelectedBillPopUpCtrl', function (
	$uibModalInstance,
	accountingService,
	oGr
) {
	// object Identifiers
	var aChargesType = [],
		isAmountValid = false,
		vm = this;

	vm.aCharges = angular.copy(oGr.settlement) || [];
	vm.msg = 'hii how are you';
	vm.remainingAmount = oGr.remainingAmount || 0;
	vm.formAmount = 0; // sum of values in form

	// function Identifiers
	vm.addCharges = addCharges;
	vm.appendCharges = appendCharges;
	vm.closeModal = closeModal;
	vm.onChangeChargeType = onChangeChargeType;
	vm.validateAmount = validateAmount;

	// INIT function
	oGr.settlement.length <= 0 && appendCharges();
	validateAmount();
	getAccountMasters();

	// Actual function
	function addCharges(formData) {
		console.log(formData);

		if (!isAmountValid) {
			swal('', 'Amount Enter Should Be Equal To or Smaller than Remaining Amount', 'error');
		} else if (formData.$valid) {
			// console.log('form is valid');
			let aCharges = vm.aCharges.map(obj => {
				return {
					'amount': obj.amount,
					'chargesType': obj.chargesType,
					'remark': obj.remark
				};
			});
			$uibModalInstance.close(aCharges);
		}
	}

	function appendCharges() {
		vm.aCharges.push({
			chargesType: null,
			amount: 0
		});
		onChangeChargeType();
	}

	function closeModal() {
		$uibModalInstance.dismiss('cancel');
	}

	// Get Account Masters from backend
	function getAccountMasters() {

		var oFilter = {
			'group': 'Bad Dept'
		};
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			aChargesType = response.data.data;
			onChangeChargeType();
		}
	}

	function onChangeChargeType() {

		if (aChargesType.length <= 0)
			return;

		vm.aCharges.map((obj, index, arr) => {
			let temp = obj.chargesType;
			obj.aChargesType = aChargesType.filter(obj1 => {
				if (temp === obj1._id)
					return true;
				return arr.findIndex(obj2 => obj2.chargesType === obj1._id) === -1 ? true : false;
			});
		});

		console.log(vm.aCharges);
	}

	function validateAmount() {
		vm.formAmount = (vm.aCharges || []).map(obj => obj.amount).reduce((a, b) => a + b, 0);
		if (vm.formAmount > vm.remainingAmount) {
			isAmountValid = false;
		} else
			isAmountValid = true;
	}

});

materialAdmin.controller('dispatchPopUpCtrl', function (
	$rootScope,
	$scope,
	$localStorage,
	$uibModalInstance,
	Bill,
	DatePicker,
	tripServices,
	branchService,
	billsService,
	Driver,
	vendorCourierService) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.DatePicker = DatePicker;
	$scope.aCourier = [];
	$scope.aCourierOfc = [];
	$scope.aDriver = [];
	$scope.show_me = true;
	$scope.aDispatched_by = ['Courier', 'Driver', 'By Hand'];
	$scope.bill = angular.copy(Bill);
	try {
		if ($scope.bill.dueDate)
			$scope.bill.dueDate = new Date($scope.bill.dueDate);
	} catch (e) {
	}
	$scope.bill.dispatch_person = $localStorage.ft_data.userLoggedIn.full_name;
	$scope.bill.dispatch_date = new Date();

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
			}
		}

		Driver.getAll(successDriver);
	})();

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
		if (v == 'Driver' || v == 'By Hand') {
			$scope.show_me = false;
		} else {
			$scope.show_me = true;
		}
	};

	$scope.updateTrip = function () {
		var oSend = {};
		if ($scope.show_me) {
			oSend.courier_name = $scope.bill.courier_name ? $scope.bill.courier_name.name : null;
			oSend.courier_id = $scope.bill.courier_name ? $scope.bill.courier_name._id : null;
			oSend.courier_office = $scope.bill.courier_office ? $scope.bill.courier_office.branch_name : null;
			oSend.courier_office_id = $scope.bill.courier_office ? $scope.bill.courier_office._id : null;
			oSend.courier_date = $scope.bill.courier_date;
		} else if ($scope.bill.dispatched_by == 'Driver') {
			oSend.driver_name = $scope.bill.driver_name ? $scope.bill.driver_name.name : null;
			oSend.driver_id = $scope.bill.driver_name ? $scope.bill.driver_name._id : null;
		}
		oSend.place = $scope.bill.place;
		oSend.branch = $scope.bill.branch ? $scope.bill.branch.name : null;
		oSend.branch_id = $scope.bill.branch ? $scope.bill.branch._id : null;

		oSend.dispatch_date = $scope.bill.dispatch_date;
		oSend.dispatch_person = $scope.bill.dispatch_person;
		var oUpdate = {_id: $scope.bill._id, 'dispatch': oSend};
		billsService.dispatchBill(oUpdate, success, failure);

		function success(res) {
			if (res && res.data && (res.data.status == 'OK')) {
				$uibModalInstance.close(res.data.message);
			} else {
				$uibModalInstance.dismiss(res.data.message);
			}
		}

		function failure(res) {
			$uibModalInstance.dismiss(res.data.message);
		}
	};
});

materialAdmin.controller('geneBillCntrl', function ($rootScope, $scope, $filter, DateUtils, bookingServices, $stateParams, $modal, thatInvoice, $modalInstance, billsService, URL) {
	$scope.allInvoice = angular.copy(thatInvoice);
	var clientId;
	$scope.gBillData = {
		due_date: new Date()
	};
	if (angular.isArray($scope.allInvoice)) {
		clientId = $scope.allInvoice[0].clientId;
		$scope.gBillData.customer_id = $scope.allInvoice[0].customer_id;
		$scope.gBillData.billing_party_id = $scope.allInvoice[0].billing_party_id;
		$scope.gBillData.billing_party_name = $scope.allInvoice[0].billing_party_name;
		$scope.gBillData.gstin_state_code = $scope.allInvoice[0].gstin_state_code;
		$scope.gBillData.billing_party_address = $scope.allInvoice[0].billing_party_address;
	} else {
		clientId = $scope.allInvoice.clientId;
		$scope.gBillData.customer_id = $scope.allInvoice.customer_id;
		$scope.gBillData.billing_party_id = $scope.allInvoice.billing_party_id;
		$scope.gBillData.billing_party_name = $scope.allInvoice.billing_party_name;
		$scope.gBillData.billing_party_address = $scope.allInvoice.billing_party_address;
		$scope.gBillData.gstin_state_code = $scope.allInvoice.gstin_state_code;
	}

	function parseAddressToString(address) {
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
	}

	function getCustomerByType(aCustomerType, success) {
		var cType = JSON.stringify(aCustomerType); //Array is for Multiple Type
		var details = {
			type: cType,
			all: true,
			status: 'Active'
		};
		bookingServices.getAllCustomersforDetails(details, success);
	};
	getCustomerByType(['Billing party'], function (data) {
		$scope.aBiller = data.data;
		if ($scope.gBillData.billing_party_id) {
			if ($scope.aBiller.length > 0) {
				for (var i = 0; i < $scope.aBiller.length; i++) {
					if ($scope.aBiller[i]._id == $scope.gBillData.billing_party_id) {
						$scope.gBillData.biller_id = $scope.aBiller[i];
						$scope.billerChange();
					}
				}
			}
		}
	});

	$scope.billerChange = function () {
		if ($scope.gBillData.biller_id) {
			$scope.gBillData.billing_party_id = $scope.gBillData.biller_id._id;
			$scope.gBillData.billing_party_name = $scope.gBillData.biller_id.name;
			$scope.gBillData.billing_party_address = parseAddressToString($scope.gBillData.biller_id.address);
			$scope.gBillData.billing_party_gstin_no = $scope.gBillData.biller_id.gstin_no;
			$scope.gBillData.gstin_state_code = $scope.gBillData.biller_id.state_code;
			$scope.gBillData.apply_gst = ((typeof $scope.gBillData.biller_id.gstin_registered == 'boolean') && ($scope.gBillData.biller_id.gstin_registered === true)) ? false : true;
			$scope.gBillData.sap_id = $scope.gBillData.biller_id.sap_id;
		}
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

	//************* New Date Picker for multiple date selection in single form ******************//

	$scope.generateBill = function () {
		function success(data) {
			swal('Bill generation complete.', '', 'success');
			$modalInstance.dismiss('cancel');
		}

		function failure(res) {
			//console.log("fail: ", res);
			swal('Some error with generate bill.', '', 'error');
		}

		$scope.invoice = [];
		if ($scope.allInvoice && $scope.allInvoice.length > 0) {
			for (var v = 0; v < $scope.allInvoice.length; v++) {
				if ($scope.allInvoice[v].selected == true) {
					$scope.invoice.push({
						'invoice_no': $scope.allInvoice[v].invoice_no,
						'trip_no': $scope.allInvoice[v].trip_no
					});
				}
			}
		} else {
			$scope.invoice[0] = {'invoice_no': $scope.allInvoice.invoice_no, 'trip_no': $scope.allInvoice.trip_no};
		}

		$scope.gBillData.invoice = $scope.invoice; //number in array [11,25,65]

		billsService.generateBillService($scope.gBillData, success, failure);
	};

	$scope.closeModal = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.previewBill = function () {
		var previewInvoice = [];
		if ($scope.allInvoice && $scope.allInvoice.length > 0) {
			for (var v = 0; v < $scope.allInvoice.length; v++) {
				if ($scope.allInvoice[v].selected == true) {
					Array.prototype.push.apply(previewInvoice, $scope.allInvoice[v].booking_info);
				}
			}
		} else {
			Array.prototype.push.apply(previewInvoice, $scope.allInvoice.booking_info);
		}
		var previewData = angular.copy($scope.gBillData);
		previewData.clientId = clientId;
		previewData.download = false;
		previewData.booking_info = angular.copy(previewInvoice);
		$scope.getBillPDFDATA(previewData);
	};

	$scope.getBillPDFDATA = function (selectInVoice) {
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/preViewBill.html',
			controller: 'invoiceCtrl',
			resolve: {
				thatInvoice: function () {
					return selectInVoice;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			$state.reload();
		});
	};

});

materialAdmin.controller('generatedBillsCntrl', function (
	$rootScope,
	$scope,
	$state,
	Routes,
	$modal,
	$timeout,
	$uibModal,
	DateUtils,
	DatePicker,
	billsService,
	bookingServices,
	billingPartyService,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	invoiceService,
	userService,
	tableAccessDetailFactory
) {

	$scope.DatePicker = angular.copy(DatePicker);
	$scope.generateCoverNote = generateCoverNote;
	$scope.addRemarkMultipleBill = addRemarkMultipleBill;
	$scope.genActFrmPro = genActFrmPro;
	$scope.genProFrmPro = genProFrmPro;
	$scope.dateChange = dateChange;
	$scope.selectedMultiBill = selectedMultiBill;
	$scope.onStateRefresh = function () {
		getGeneratedBills();
	};

	// init
	(function init() {
		if (stateDataRetain.init($scope))
			return;
		$scope.tableAccessDetail = tableAccessDetailFactory;

		let pageNameConst = 'Billing_Management_GENBill';
		let tableNameConst = 'GENBill';
		let oFoundTable = $scope.$tableAccess.find(oTable => oTable.clientId !== '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst);// given acess from admin
		let oFoundTables = $scope.$tableAccess.find(oTable => oTable.clientId === '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst);// given assess from super admin
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

		if(true) {
			for (const prop in oBinding) {
				if(oFoundTable && oFoundTable.configs)
				oBinding[prop].header = oFoundTable.configs[tableNameConst][prop];
			}
		}

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
			$scope.columnSetting.allowedColumn.push(oBinding[str] && oBinding[str].header);
			$scope.tableHead.push(oBinding[str]);
		});
		$scope.visibleDownload = visible.map(str => oBinding[str] && oBinding[str].header);
		$scope.oFoundTableId = false;
		if (oFoundTable && oFoundTable._id)
			$scope.oFoundTableId = oFoundTable._id;
		$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		$scope.lazyLoad = lazyLoadFactory(); // init lazyload
		$scope.selectedBill = [];
		$scope.aGeneratedBill = [];
		$scope.selectType = 'index';
		$scope.billIconStatus = true;
		$scope.billIconRemark = true;
		$scope.myFilter = {};
		if(!($scope.$configs.tripMemo && $scope.$configs.tripMemo.show))
			delete $scope.columnSetting.allowedColumn[2];


	})();


	//filter for Invoice
	function prepareInvoiceFilterObject(download) {
		let myFilter = {
			multiBill: {$ne: true}
		};

		if ($scope.myFilter.start_date)
			myFilter.start_date = $scope.myFilter.start_date;

		if ($scope.myFilter.end_date)
			myFilter.end_date = new Date(($scope.myFilter.end_date).setHours(23, 59, 59));

		if ($scope.myFilter.bill_no)
			myFilter.billNo = $scope.myFilter.bill_no;

		if ($scope.myFilter.coverNoteNo)
			myFilter['coverNote.cnNo'] = $scope.myFilter.coverNoteNo;

		if ($scope.myFilter.search_billParty)
			myFilter.billingParty = $scope.myFilter.search_billParty._id;

		if ($scope.myFilter.dateType)
			myFilter.dateType = $scope.myFilter.dateType;

		if ($scope.myFilter.status) {
			switch ($scope.myFilter.status) {
				case 'Unapproved': {
					myFilter.status = 'Unapproved';
					break;
				}
				case 'Approved': {
					myFilter.status = 'Approved';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Cancelled': {
					myFilter.status = 'Cancelled';
					break;
				}
				case 'Dispatched': {
					myFilter.status = 'Dispatched';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Acknowledged': {
					myFilter.status = 'Acknowledged';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
			}
		}

		if ($scope.myFilter.gr_no)
			myFilter['items.gr.grNumber'] = $scope.myFilter.gr_no;

		if ($scope.myFilter.branch) {
			myFilter.branches = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			myFilter.branches = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branches.push(obj._id);
			});
		}

		myFilter.populate = ['consignee', 'vehicle', 'consignor', 'creditNote','billingParty.account'];

		if (download) {
			myFilter.download = true;
			//myFilter.populate.push('creditNote')
		}

		myFilter.no_of_docs = 15;
		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		myFilter.sort = {
			billNo: -1
		};

		return myFilter;
	}

	function generateCoverNote(type) {

		if (type == 'edit' && (!($scope.selectedBill.coverNote && $scope.selectedBill.coverNote.coverNoteId))) {
			swal('warning', 'There is no CoverNote on Selected Bill', 'warning');
			return;
		}

		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/coverNotePopUp.html',
			controller: [
				'$scope',
				'$uibModal',
				'$uibModalInstance',
				'billingPartyService',
				'billsService',
				'billsCoverNoteService',
				'DatePicker',
				'lazyLoadFactory',
				'otherData',
				billsCoverNoteController
			],
			controllerAs: 'cnVm',

			resolve: {
				otherData: function () {
					return {
						aBill: $scope.selectedBill,
						type: type
					};
				}
			}
		});

	}

	function selectedMultiBill() {
		let aSelectedBill = [];
		if (!Array.isArray($scope.aSelectedBill)) {
			aSelectedBill = [$scope.aSelectedBill];
			$scope.aSelectedMBills = aSelectedBill;
		} else {
			aSelectedBill = $scope.aSelectedBill;
			$scope.aSelectedMBills = aSelectedBill;
		}

		if (aSelectedBill.length == 1) {
			$scope.selectedBill = Object.assign({}, aSelectedBill[0]);
			$scope.billIconStatus = false;
			$scope.billIconRemark = false;
		} else if (aSelectedBill.length > 1) {
			$scope.billIconStatus = true;
			$scope.billIconRemark = false;
		} else {
			$scope.billIconStatus = true;
			$scope.billIconRemark = true;
		}

	}

	function addRemarkMultipleBill() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/addRemarkMultiBillPopUp.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'billsService',
				'DatePicker',
				'otherData',
				billsAddRemarkController
			],
			controllerAs: 'arVm',

			resolve: {
				otherData: function () {
					return {
						aBill: $scope.aSelectedMBills,
					};
				}
			}
		});

	}

	function genActFrmPro() {
		$state.go('billing.previewBill', {
			data: {
				billType: 'Actual Bill',
				aGrData: $scope.selectedBill.items.map(o => o.gr),
				billNo: $scope.selectedBill.billNo,
				stationaryId: $scope.selectedBill.stationaryId,
				hideBillTypeOpt: true
			}
		});
	}

	function genProFrmPro() {
		$state.go('billing.previewBill', {
			data: {
				billType: 'Provisional Bill',
				aGrData: $scope.selectedBill.items.map(o => o.gr),
				billNo: $scope.selectedBill.billNo,
				stationaryId: $scope.selectedBill.stationaryId,
				hideBillTypeOpt: true
			}
		});
	}

	function dateChange(dateType) {

		if (dateType === 'startDate' && $scope.myFilter.end_date && $scope.myFilter.start_date) {

			let isDate = $scope.myFilter.end_date instanceof Date,
				monthRange = $scope.myFilter.end_date.getMonth() - $scope.myFilter.start_date.getMonth(),
				dateRange = $scope.myFilter.end_date.getDate() - $scope.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.myFilter.end_date.getFullYear() - $scope.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 3)
				isNotValid = monthRange < 0 ? true : (30 - $scope.myFilter.start_date.getDate() + $scope.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.myFilter.start_date);
				$scope.myFilter.end_date = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'endDate' && $scope.myFilter.end_date && $scope.myFilter.start_date) {

			let isDate = $scope.myFilter.start_date instanceof Date,
				monthRange = $scope.myFilter.end_date.getMonth() - $scope.myFilter.start_date.getMonth(),
				dateRange = $scope.myFilter.end_date.getDate() - $scope.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.myFilter.end_date.getFullYear() - $scope.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 3)
				isNotValid = monthRange < 0 ? true : (30 - $scope.myFilter.start_date.getDate() + $scope.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.myFilter.end_date);
				$scope.myFilter.start_date = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	$scope.generateBillWithOutGr = function (type) {

		$uibModal.open({
			templateUrl: 'views/bills/generateBillWithOutGrPopUp.html',
			controller: ['$modal', '$scope', '$uibModal', '$uibModalInstance', 'billingPartyService', 'billsService', 'billBookService', 'branchService', 'DatePicker', 'otherData', 'accountingService', generateBillWithOutGrController],
			controllerAs: 'gbwgVm',
			resolve: {
				otherData: function () {
					return {
						aBill: $scope.selectedBill,
						type: type
					};
				}
			},


		}).result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});
	};

	$scope.getGeneratedBills = function (isGetActive, isDownload) {

		if (isDownload) {
			if (!($scope.myFilter.start_date && $scope.myFilter.end_date)) {
				swal('Warning', 'From and To date Required', 'warning');
				return;
			}
		}

		if ($scope.myFilter && $scope.myFilter.search_billParty && $scope.myFilter.search_billParty._id)
			$scope.selectType = 'multiple';
		else
			$scope.selectType = 'index';

		if (!$scope.lazyLoad.update(isGetActive))
			return;

		function success(res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			} else if (res.data && res.data.data) {

				res = res.data;

				res.data.forEach(oBill => {
					oBill.freightTotal=0;
					oBill.freightDphTotal=0;
					oBill.dphTotal=0;
					oBill.dphgstTotal=0;
					oBill.dphfinalAmount=0;
					oBill.items.forEach(oItem => {
						oItem.rate=oItem.gr && oItem.gr.invoices && oItem.gr.invoices[0] && oItem.gr.invoices[0].rate || 0;
						oItem.dph=oItem.rate*((oItem.gr && oItem.gr.invoices && oItem.gr.invoices[0] && oItem.gr.invoices[0].dphRate||1)/100) ||  0;
						oItem.igst=(oItem.rate+oItem.dph)*12/100 ||0;
						oItem.totalAmount=oItem.rate+oItem.dph+oItem.igst ||0;
						oItem.totalDphAmount=oItem.rate+oItem.dph ||0;
					oBill.freightTotal+=oItem.rate;
					oBill.freightDphTotal+=oItem.totalDphAmount;
					oBill.dphTotal+=oItem.dph;
					oBill.dphgstTotal+=oItem.igst;
					oBill.dphfinalAmount+=oItem.totalAmount;

						if (!oItem.gr._id && oItem.grData)
							oItem.gr = oItem.grData;

						if (oItem.gr._id)
							oItem.gr.billingParty = oBill.billingParty;
					});
				});
if($scope.$configs && $scope.$configs.Bill && !$scope.$configs.Bill.showDphBillAmt){
	value = "DPH Bill Amount"
	$scope.columnSetting.allowedColumn = $scope.columnSetting.allowedColumn.filter(item => item !== value);
}
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res);
			}
		}

		function failure(res) {
			console.log('fail: ', res);
			swal('Some error with GET bills.', res.toString(), 'error');
		}

		var oFilter = prepareInvoiceFilterObject(isDownload);

		billsService.getGenerateBill(oFilter, success, failure);
	};

	$scope.selectThisRow = function (oBill, index) {
		$scope.selectedBill = oBill;
		$('.selectItem').removeClass('grn');
		var row = $($('.selectItem')[index]);
		row.addClass('grn');
	};

	$scope.billEditOperation = function (operationType) {
		$scope.reGenerateBill = [];
		$scope.flag = false;
		$scope.selectedBill.items.forEach(function (item) {
			if (!item.gr.bill) {
				$scope.reGenerateBill = [item.gr];
			} else {
				$scope.flag = true;
			}
		});
		if ($scope.reGenerateBill.length > 0) {
			$scope.reGenerateBill[0].billingParty = $scope.selectedBill.billingParty;
		}

		if ($scope.flag && $scope.reGenerateBill.length > 0) {
			swal({
					title: 'Some of Selected Gr are already Generated!!  Do you really want to Continue ?',
					text: '!!!!!!!!!!!!!!!!!!!!!!!',
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
						$state.go('billing.previewBill', {
							data: {
								// billNo: $scope.selectedBill.billNo,
								billType: 'Actual Bill',
								aGrData: $scope.reGenerateBill
							}
						});
					} else {
						return;
					}
				});
		} else if ($scope.flag && $scope.reGenerateBill.length <= 0) {
			return swal('Warning', 'All Gr are Already Generated!!!!', 'warning');
		} else {
			$state.go('billing.previewBill', {
				data: {
					// billNo: $scope.selectedBill.billNo,
					billType: 'Actual Bill',
					aGrData: $scope.reGenerateBill
				}
			});
		}
	};

	$scope.revertAck = function () {

		swal({
				title: 'Are you sure you want to Revert Acknowledge?',
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
					billsService.revertAcknowledgeBill({
						_id: $scope.selectedBill._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						$scope.getGeneratedBills();
						swal('Success', res.data.message, 'success');
					}
				}
			});
	};

	$scope.billApprovePopup = function (type) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billAcknowledgeDataPopup.html',
			controller: 'billAcknowledgeDataPopupController',
			resolve: {
				type: function () {
					return type;
				},
				selectedBillData: function () {
					return $scope.selectedBill;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			$timeout(function () {
				$scope.getGeneratedBills();
			}, 1000);
		}, function (data) {
			// swal("Bill Acknowledge Canceled",'', "error")
		});
	};

	$scope.billOperation = function (operationType) {
		if ($scope.selectedBill.acknowledge.status) {
			return swal('error', 'Can not edit..  Bill already acknowledge!!!!', 'error');
		}
		console.log('to perform operation on Bill');

		if (operationType == 'Edit & Gen') {

			$scope.selectedBill.type = data.billType;

			var grData = {
				operationType: 'Actual Bill',
				oBill: $scope.selectedBill
			};
			$state.go('billing.previewBill', {data: grData});

		} else {

			if ($scope.selectedBill.type === 'Loading Slip') {
				var resData = {};
				resData.oLoadingRecipt = $scope.selectedBill;
				resData.edit = true;
				$state.go('billing.previewLoadingReceipt', {data: resData});
			} else {
				var grData = {
					operationType: operationType,
					billType: $scope.selectedBill.type,
					oBill: $scope.selectedBill
				};
				$state.go('billing.previewBill', {data: grData});
			}
		}
	};

	$scope.generateSuppleBill = function (operationType) {
		if ($scope.selectedBill.type == 'Supplementary Bill')
			return;

		$state.go('billing.previewBill', {
			data: {
				billType: 'Supplementary Bill',
				billingParty: $scope.selectedBill.billingParty,
				aGrData: $scope.selectedBill.items.map(o => o.gr)
			}
		});

		// if ($scope.selectedBill.type === 'Supplementary Bill')
		// 	return swal('Warning', 'Supplementary Bill Already Generated!!!!!', 'warning');

		// $scope.suppleBillGenerate = [];
		// $scope.flag = false;
		// $scope.selectedBill.items.forEach(function(item) {
		// 	if(item.gr.supplementaryBill && !item.gr.supplementaryBillRef) {
		// 		$scope.suppleBillGenerate.push(item.gr);
		// 	}else {
		// 		$scope.flag = true;
		// 	}
		// });
		// if($scope.suppleBillGenerate.length > 0){
		// 	$scope.suppleBillGenerate[0].billingParty = $scope.selectedBill.billingParty;
		// }
		//
		// if($scope.flag && $scope.suppleBillGenerate.length <= 0) {
		// 	  return swal('Warning', 'No supplementaryBill Freight is There or Already Generated!!!!!', 'warning');
		// }
	};

	$scope.billCancellationORApprovePopup = function (type) {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		if ($scope.selectedBill.acknowledge.status && type === 'Cancel')
			return swal('Error', 'Approved Bill Cannot Be cancelled', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billCancellationPopup.html',
			controller: 'billCancellationORApprovePopup',
			resolve: {
				Type: function () {
					return type;
				},
				oBill: function () {
					return $scope.selectedBill;
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log(response);

			function success(response) {
				console.log(response);
				swal('Bill Successfully ' + type + 'ed');
				$state.reload();
			}

			function failure(response) {
				console.log(response);
				swal('Error', response.data.message, 'error');
			}

			var reqObj = {};

			if (type === 'Approve') {
				reqObj._id = $scope.selectedBill._id;
				reqObj.reason = response.reason;
				reqObj.remark = response.remark;
				reqObj.billDate = response.billDate;
				billsService.approveBill(reqObj, success, failure);
			} else if (type === 'Cancel') {
				reqObj._id = $scope.selectedBill._id;
				reqObj.cancel_reason = response.reason;
				reqObj.cancel_remark = response.remark;
				billsService.cancelBill(reqObj, success, failure);
			}
		});
	};

	$scope.printMultipleBill = function (type) {
		stateDataRetain.go('billing.printMultipleBill');
	};

	$scope.getBillingPartyName = function (viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		billingPartyService.getBillingParty({name: viewValue}, res => $scope.aBillingParty = res.data, err => console.log`${err}`);
	};

	$scope.getDname = function (viewValue) {
		function oSucD(response) {
			$scope.aRoute = response.data.data;
		};

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getAllRoutes({name: viewValue}, oSucD, oFailD);
		}
	};

	$scope.printBill = function () {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		var oFilter = {
			_id: $scope.selectedBill._id,
			type: $scope.selectedBill.type,
			//gr: $scope.selectedBill.items[0].gr
			gr: $scope.selectedBill
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	};

	$scope.onInvoiceSelect = function (item, model, label) {
		$scope.selectInVoice = item;
	};

	$scope.getBillPDFDATA = function (selectInVoice) {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		function success(data) {
			var selBillData = data.data;
			selBillData.download = true;
			var modalInstance = $modal.open({
				templateUrl: 'views/bills/preViewBill.html',
				controller: 'invoiceCtrl',
				resolve: {
					thatInvoice: function () {
						return selBillData;
					}
				}
			});

			modalInstance.result.then(function () {
				$state.reload();
			}, function (data) {
				/*if (data != 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }*/
				$state.reload();
			});
		}

		billsService.getdetailGeneBillData(selectInVoice, success);

	};

	$scope.approve = function (selectInVoice) {
		$rootScope.selectInVoice = selectInVoice;

		function success(data) {
			var msg = data.data.message;
			swal('Invoice Approved', msg, 'success');
			$state.reload();
		}

		swal({
				title: 'Are you sure to Approve this Invoice Bill.?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(94, 192, 222);',
				confirmButtonText: 'Yes, Approve!',
				closeOnConfirm: false
			},
			function (isConfirmU) {
				if (isConfirmU) {
					selectInVoice.status = 'approved';
					invoiceService.updateBill(selectInVoice, success);
				}

			});
	};

	//////////////////////////////////////////////////////////////////////////
});

materialAdmin.controller('printMultipleBillController', function (
	$scope,
	$state,
	$modal,
	$uibModal,
	DatePicker,
	billsService,
	clientService,
	customer,
	billingPartyService,
	billsCoverNoteService,
	stateDataRetain,
	lazyLoadFactory
) {

	let vm = this;

	vm.lazyLoad = lazyLoadFactory(); // init lazyload
	vm.DatePicker = angular.copy(DatePicker);
	vm.getGeneratedBills = getGeneratedBills;
	vm.getBillingPartyName = getBillingPartyName;
	vm.selectAll = selectAll;
	vm.UnSelectAll = UnSelectAll;
	vm.clickCheckBX = clickCheckBX;
	vm.printBill = printBill;
	vm.onStateRefresh = function () {
		getGeneratedBills();
	};

	// init
	(function init() {
		if (stateDataRetain.init($scope, vm))
			return;
		vm.selectedBill = [];
		vm.aGeneratedBill = [];
		vm.myFilter = {};
		vm.aPrintType = [{
			key: 'Bill',
			value: 'bill'
		}, {
			key: 'Cover Note',
			value: 'cover note'
		}];
		getGeneratedBills();

	})();

	function getGeneratedBills(isGetActive, reset = false) {

		if (!vm.lazyLoad.update(isGetActive))
			return;
		if (reset)
			vm.lazyLoad.reset();

		if (vm.printType === 'bill') {
			billsService.getGenerateBill(prepareInvoiceFilterObject(), success, failure);
		} else if (vm.printType === 'cover note') {
			billsCoverNoteService.get(prepareCoverNoteFilter(), success, failure);
		}

		function success(res) {
			if (res.data && res.data.data) {
				// vm.aBill = res.data.data;
				let defaultTemplate = $scope.$configs['Bill'] && $scope.$configs['Bill']['Bill Templates'] || [];
				res = res.data;
				vm.selectedBill = [];
				vm.aGetBillTemp = [];
				let customerId;
				let resData = res.data;
				let billType = vm.printType;
				for (let i = 0; i < resData.length; i++) {
					resData[i].aGetBillTemp = [];
					if (resData[i].billingParty && resData[i].billingParty.billTemplate && resData[i].billingParty.billTemplate.length) {
						resData[i].aGetBillTemp = resData[i].billingParty.billTemplate;
					} else if (resData[i].item && resData[i].item.length > 0 && resData[i].item[0].gr && resData[i].item[0].gr.customer.billTemplate && resData[i].item[0].gr.customer.billTemplate.length > 0) {
						resData[i].aGetBillTemp = resData[i].item[0].gr.customer.billTemplate;
					} else if (resData[i].billingParty && resData[i].billingParty.customer && (typeof resData[i].billingParty.customer === 'string' || resData[i].billingParty.customer.length > 0)) {

						if (typeof resData[i].billingParty.customer === 'string')
							customerId = resData[i].billingParty.customer;
						else
							customerId = resData[i].billingParty.customer[0];

						try {
							customer.getAllcustomers({
								_id: customerId,
								cClient: $scope.$configs.clientOps
							}, data => {
								if (data.data[0] && data.data[0].billTemplate && data.data[0].billTemplate.length > 0) {
									resData[i].aGetBillTemp = data.data[0].billTemplate;
								}

								resData[i].aGetBillTemp = (resData[i].aGetBillTemp.length ? resData[i].aGetBillTemp : defaultTemplate.filter(o => !o.type || o.type === billType)) || [];
								resData[i].setectedTamplate = resData[i].aGetBillTemp[0];
							});
						} catch (e) {
							console.log(e);
						}

					} else {
						resData[i].aGetBillTemp = defaultTemplate.filter(o => !o.type || o.type === billType) || [];
					}

					resData[i].setectedTamplate = resData[i].aGetBillTemp[0];
				}


				vm.lazyLoad.updateArr.call(vm, isGetActive, 'aBill', res);
			}
		}

		function failure(res) {
			console.log('fail: ', res);
			swal('Some error with GET bills.', res.toString(), 'error');
		}
	}

	function prepareInvoiceFilterObject() {
		var myFilter = {};

		if (vm.myFilter.start_date)
			myFilter.start_date = vm.myFilter.start_date;

		if (vm.myFilter.end_date)
			myFilter.end_date = new Date((vm.myFilter.end_date).setHours(23, 59, 59));

		if (vm.myFilter.bill_no)
			myFilter.billNo = vm.myFilter.bill_no;

		if (vm.myFilter.coverNoteNo)
			myFilter['coverNote.cnNo'] = vm.myFilter.coverNoteNo;

		if (vm.myFilter.search_billParty)
			myFilter.billingParty = vm.myFilter.search_billParty._id;

		if (vm.myFilter.dateType)
			myFilter.dateType = vm.myFilter.dateType;

		if (vm.myFilter.status) {
			switch (vm.myFilter.status) {
				case 'Unapproved': {
					myFilter.status = 'Unapproved';
					break;
				}
				case 'Approved': {
					myFilter.status = 'Approved';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Cancelled': {
					myFilter.status = 'Cancelled';
					break;
				}
				case 'Dispatched': {
					myFilter.status = 'Dispatched';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Acknowledged': {
					myFilter.status = 'Acknowledged';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
			}
		}

		if (vm.myFilter.gr_no)
			myFilter['items.gr.grNumber'] = vm.myFilter.gr_no;

		myFilter.no_of_docs = 200;
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.sort = {
			billNoInt: 1
		};

		return myFilter;
	}

	function prepareCoverNoteFilter() {
		var myFilter = {};

		if (vm.myFilter.start_date)
			myFilter.start_date = vm.myFilter.start_date;

		if (vm.myFilter.end_date)
			myFilter.end_date = new Date((vm.myFilter.end_date).setHours(23, 59, 59));

		// if (vm.myFilter.bill_no)
		// 	myFilter.billNo = vm.myFilter.bill_no;

		if (vm.myFilter.coverNoteNo)
			myFilter['cnNo'] = vm.myFilter.coverNoteNo;

		if (vm.myFilter.search_billParty)
			myFilter.billingParty = vm.myFilter.search_billParty._id;

		// if (vm.myFilter.dateType)
		// 	myFilter.dateType = vm.myFilter.dateType;

		// if (vm.myFilter.gr_no)
		// 	myFilter['items.gr.grNumber'] = vm.myFilter.gr_no;

		myFilter.no_of_docs = 200;
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.sort = {
			billNoInt: 1
		};

		return myFilter;
	}

	function getBillingPartyName(viewValue) {
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

	function selectAll() {
		for (var i = 0; i < vm.aBill.length; i++) {
			vm.aBill[i].selected = true;
		}
		vm.selectedBill.push(...vm.aBill);
	}

	function UnSelectAll() {
		for (var i = 0; i < vm.aBill.length; i++) {
			vm.aBill[i].selected = false;
		}
		vm.selectedBill = [];
	}

	function clickCheckBX(item) {
		if (item.selected == true) {
			vm.selectedBill.push(item);
		} else if (item.selected == false) {
			vm.selectedBill.pop(item);
		}
	}

	function printBill() {
		if (!(vm.selectedBill && vm.selectedBill.length))
			return swal('Warning', 'Select at least one Bill.', 'warning');

		if (!(vm.selectedBill.every(o => !!(o.setectedTamplate && o.setectedTamplate.key))))
			return swal('Warning', 'Template not Selected for One or More Selected Bill.', 'warning');

		let oFilter = {
			aBill: vm.selectedBill.map(oBill => ({_id: oBill._id, billTemplate: oBill.setectedTamplate.key})),
			group: vm.printType
		};

		clientService.multiBillPreview(oFilter, successCallback, failureCallback);

		function failureCallback(res) {
			console.log(res);
			swal('Error', res.data.message, 'error');
		}

		function successCallback(res) {

			$uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: ['$scope', '$uibModalInstance', 'excelDownload', 'html', function (
					$scope,
					$uibModalInstance,
					excelDownload,
					html
				) {

					$scope.downloadExcel = downloadExcel;
					$scope.html = angular.copy(html);
					$scope.closeModal = closeModal;

					function downloadExcel(id) {
						excelDownload.html(id, 'sheet 1', `${moment().format('DD-MM-YYYY hh:mm:ss')}`);
					}

					function closeModal() {
						$uibModalInstance.dismiss('cancel');
					}
				}],
				resolve: {
					html: function () {
						return angular.copy(res.data)
					}
				}
			});
		}
	}

	//////////////////////////////////////////////////////////////////////////
});

materialAdmin.controller('billCancellationORApprovePopup', function (
	$scope,
	$uibModalInstance,
	billsService,
	DatePicker,
	oBill,
	Type
) {

	$scope.DatePicker = DatePicker;
	$scope.type = angular.copy(Type);
	$scope.oBill = angular.copy(oBill);
	$scope.billDate = new Date();

	$scope.onChange = function (key, value) {
		$scope[key] = value;
	};

	$scope.closeModal = function () {
		$uibModalInstance.dismiss();
	};

	$scope.cancelBill = function () {
		console.log($scope.billCancellation);
		var resObj = {
			remark: $scope.remark,
			reason: $scope.reason,
			billDate: $scope.billDate
		};
		$uibModalInstance.close(resObj);
	};

	// (function () {
	// 	function success(data) {
	// 		//console.log(JSON.stringify(data));
	// 		if (data.data && data.data.data) {
	// 			if (data.data.data.length > 0) {
	// 				$scope.lastBillGenerationDate = new Date(data.data.data[0].billDate);
	// 				$scope.billNo = data.data.data[0].billNo;
	// 			} else
	// 				$scope.lastBillGenerationDate = new Date();
	// 		}
	// 	}
	//
	// 	function failure(res) {
	// 		console.log('fail: ', res);
	// 		swal('Some error with GET bills.', res.toString(), 'error');
	// 	}
	//
	// 	var oFilter = {
	// 		'skip': 1,
	// 		'no_of_docs': 1,
	// 		'approve.status': true,
	// 		'sort': {'$natural': -1}
	// 	};
	// 	billsService.getGenerateBill(oFilter, success, failure);
	// })();

});

materialAdmin.controller('previewBillHistoryCtrl', function (
	$scope,
	$uibModal,
	$uibModalInstance,
	$localStorage,
	tripServices,
	unbilledGr
) {
	$scope.gr = angular.copy(unbilledGr);
	$scope.configs = $localStorage.ft_data.configs;

	($scope.getGrs = function () {
		function success(data) {
			if (data.data && data.data.data) {
				$scope.grBillDetail = data.data.data[0];
			}
		}

		function failure(res) {
			swal('Some error with GET trips.', '', 'error');
		}

		var oFilter = {
			_id: $scope.gr._id,
			populate: ['bills', 'provisionalBills']
		};
		tripServices.getAllTripGrData(oFilter, success, failure);
	})();

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.printBill = function (bill) {
		var oFilter = {
			_id: bill.id,
			//gr: bill.items[0].gr
			gr: bill
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	};
});

purchaseBillController.$inject = [
	'$modal',
	'$scope',
	'$state',
	'accountingService',
	'billsService',
	'DatePicker',
	'lazyLoadFactory',
	'voucherService',
	'vendorFuelService',
	'tripServices',
	'stateDataRetain'
];

function purchaseBillController(
	$modal,
	$scope,
	$state,
	accountingService,
	billsService,
	DatePicker,
	lazyLoadFactory,
	voucherService,
	vendorFuelService,
	tripServices,
	stateDataRetain
) {

	let vm = this;

	// function identifier
	vm.accountmaster = accountmaster;
	vm.billOperation = billOperation;
	vm.dateChange = dateChange;
	vm.DatePicker = angular.copy(DatePicker);
	vm.getBills = getBills;
	vm.getPurcBills = getPurcBills;
	vm.getFuelVendor = getFuelVendor;
	vm.getAdvance = getAdvance;
	vm.onAccSelect = onAccSelect;
	vm.onAccountGrp = onAccountGrp;
	vm.remove = remove;
	vm.printBill = printBill;
	vm.removeAccount = removeAccount;
	vm.removeAcGroup = removeAcGroup;
	vm.reportDownload = reportDownload;
	vm.shouldDisableEditing = shouldDisableEditing;
	vm.unapprove = unapprove;
	vm.upsertBill = upsertBill;
	vm.onStateRefresh = function () {
		getBills();
	};

	// init
	(function init() {
		if (stateDataRetain.init($scope, vm)){
			return;
		}
		vm.myFilter = {};
		vm.aBillType=$scope.$constants.billType;
		// vm.aBillType = ['Diesel', 'Tyre', 'FPA', 'Spare', 'Spare Parts', 'Maintenance'];
		vm.aFuelCompany = ["Bio Diesel", "BPCL", "Essar", "HPCL", "IOCL", "RIL"];
		vm.lazyLoad = lazyLoadFactory();
		if($scope.$configs && $scope.$configs.purBill && $scope.$configs.purBill.taxPurCol) {
			vm.columnSetting = {
				allowedColumn: [
					'Bill No',
					'Bill Date',
					'Ref No',
					'Bill Type',
					'Vendor',
					'Ltr',
					'IGST @ 5%',
					'CGST @ 2.5%',
					'SGST @ 2.5%',
					'IGST @ 12%',
					'CGST @ 6%',
					'SGST @ 6%',
					'IGST @ 18%',
					'CGST @ 9%',
					'SGST @ 9%',
					'IGST @ 28%',
					'CGST @ 14%',
					'SGST @ 14%',
					'Bill Amount',
					'Debit Amount',
					'Rem Amount',
					'Total Payments',
					// 'REM Amount',
					'Paid Amount',
					'Remark',
					'Approved',
					'Created At',
					'lastModified At',
					'lastModified By',
				]
			};
			vm.tableHead = [
				{
					'header': 'Bill No',
					'bindingKeys': 'billNo',
					'date': false
				},
				{
					'header': 'Bill Date',
					'bindingKeys': 'billDate',
					'date': 'dd-MMM-yyyy'
				},
				{
					'header': 'Ref No',
					'bindingKeys': 'refNo',
					'date': false
				},
				{
					'header': 'Bill Type',
					'bindingKeys': 'billType',
				},
				{
					'header': 'Vendor',
					'bindingKeys': 'account.name'
				},
				{
					'header': 'Ltr',
					'bindingKeys': 'ltr'
				},
				{
					'header': 'IGST @ 5%',
					'bindingKeys': 'IGST5'
				},
				{
					'header': 'CGST @ 2.5%',
					'bindingKeys': 'CGST25'
				},
				{
					'header': 'SGST @ 2.5%',
					'bindingKeys': 'SGST25'
				},
				{
					'header': 'IGST @ 12%',
					'bindingKeys': 'IGST12'
				},
				{
					'header': 'CGST @ 6%',
					'bindingKeys': 'CGST6'
				},
				{
					'header': 'SGST @ 6%',
					'bindingKeys': 'SGST6'
				},
				{
					'header': 'IGST @ 18%',
					'bindingKeys': 'IGST18'
				},
				{
					'header': 'CGST @ 9%',
					'bindingKeys': 'CGST9'
				},
				{
					'header': 'SGST @ 9%',
					'bindingKeys': 'SGST9'
				},
				{
					'header': 'IGST @ 28%',
					'bindingKeys': 'IGST28'
				},
				{
					'header': 'CGST @ 14%',
					'bindingKeys': 'CGST14'
				},
				{
					'header': 'SGST @ 14%',
					'bindingKeys': 'SGST14'
				},
				{
					'header': 'Bill Amount',
					'bindingKeys': 'billAmount.toFixed(2)'
				},
				{
					'header': 'Debit Amount',
					'bindingKeys': 'debitAmount.toFixed(2)'
				},
				{
					'header': 'Rem Amount',
					'bindingKeys': 'remainingAmount.toFixed(2)'
				},
				{
					'header': 'Total Payments',
					'bindingKeys': 'totMaterial ? amount.toFixed(2) : totItem.toFixed(2)'
				},
				{
					'header': 'REM Amount',
					'bindingKeys': '(this.plainVoucher)[0] ? ((this.plainVoucher | calculateRemAmount)|roundOff) : "0"',
					'eval': true
				},

				// {
				// 	'header': 'Paid Amount',
				// 	'bindingKeys': 'paidAmount.toFixed(2)'
				// },
				{
					'header': 'Remark',
					'bindingKeys': 'remark'
				},
				{
					'header': 'Approved',
					'bindingKeys': 'this.plainVoucher ? "Yes" : "No"',
					'eval': true
				},
				{
					'header': 'Created At',
					'bindingKeys': 'created_at'
				},
				{
					'header': 'lastModified By',
					'bindingKeys': 'lastModifiedBy.name'
				},
				{
					'header': 'lastModified At',
					'bindingKeys': 'lastModifiedBy.date'
				}
			];
		} else {
			vm.columnSetting = {
				allowedColumn: [
					'Bill No',
					'Bill Date',
					'Ref No',
					'Bill Type',
					'Vendor',
					'Ltr',
					'CGST %',
					'SGST %',
					'IGST %',
					'CGST',
					'SGST',
					'IGST',
					'Bill Amount',
					'Total Payments',
					// 'REM Amount',
					'Paid Amount',
					'Remark',
					'Approved',
					'Created At',
				]
			};
			vm.tableHead = [
				{
					'header': 'Bill No',
					'bindingKeys': 'billNo',
					'date': false
				},
				{
					'header': 'Bill Date',
					'bindingKeys': 'billDate',
					'date': 'dd-MMM-yyyy'
				},
				{
					'header': 'Ref No',
					'bindingKeys': 'refNo',
					'date': false
				},
				{
					'header': 'Bill Type',
					'bindingKeys': 'billType',
				},
				{
					'header': 'Vendor',
					'bindingKeys': 'account.name'
				},
				{
					'header': 'Ltr',
					'bindingKeys': 'ltr'
				},
				{
					'header': 'CGST %',
					'bindingKeys': 'cGSTPercent'
				},
				{
					'header': 'SGST %',
					'bindingKeys': 'sGSTPercent'
				},
				{
					'header': 'IGST %',
					'bindingKeys': 'iGSTPercent'
				},
				{
					'header': 'CGST',
					'bindingKeys': 'cGST'
				},
				{
					'header': 'SGST',
					'bindingKeys': 'sGST'
				},
				{
					'header': 'IGST',
					'bindingKeys': 'iGST'
				},
				{
					'header': 'Bill Amount',
					'bindingKeys': 'billAmount.toFixed(2)'
				},
				{
					'header': 'Total Payments',
					'bindingKeys': 'totMaterial ? amount.toFixed(2) : totItem.toFixed(2)'
				},
				{
					'header': 'REM Amount',
					'bindingKeys': '(this.plainVoucher)[0] ? ((this.plainVoucher | calculateRemAmount)|roundOff) : "0"',
					'eval': true
				},

				// {
				// 	'header': 'Paid Amount',
				// 	'bindingKeys': 'paidAmount.toFixed(2)'
				// },
				{
					'header': 'Remark',
					'bindingKeys': 'remark'
				},
				{
					'header': 'Approved',
					'bindingKeys': 'this.plainVoucher ? "Yes" : "No"',
					'eval': true
				},
				{
					'header': 'Created At',
					'bindingKeys': 'created_at'
				}
			];
		}
		getBills();

	})();

	// Actual Function

	function upsertBill(isEdit) {
		if (isEdit) {
			$state.go('billing.addBill', {data: vm.selectedBill});
		} else {
			$state.go('billing.addBill');
		}
	}

	function shouldDisableEditing() {
		if (vm.selectedBill && vm.selectedBill.plainVoucher && vm.selectedBill.plainVoucher.length) {
			return Boolean(vm.selectedBill.plainVoucher.find(pv => pv.voucher));
		}
		return false;
	}

	function billOperation(type = 'view') {

		if (type != 'view' && vm.selectedBill.items.length == 0) {
			swal('Warning', 'No Advance Selected', 'error');
			return;
		}

		$modal.open({
			templateUrl: 'views/bills/purchaseBillUpsert.html',
			controller: [
				'$timeout',
				'$uibModalInstance',
				'accountingService',
				'billBookService',
				'billsService',
				'branchService',
				'DatePicker',
				'modelDetail',
				'otherData',
				'tripServices',
				'NumberUtil',
				purchaseBillUpsertController
			],
			controllerAs: 'pbuVm',
			resolve: {
				modelDetail: function () {
					return {
						type
					};
				},
				otherData: function () {
					return {
						aAdvances: vm.selectedBill.items,
						billObj: vm.selectedBill
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});

	}

	function getBills(isGetActive, isDownload) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		// if (isDownload){
		// 	oFilter.download = isDownload;
		// 	oFilter.no_of_docs = 500;
		// 	oFilter.skip = 1;
		// }

		if (isDownload)
			oFilter.download = isDownload;


		billsService.purchaseBillGet(oFilter, function (res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			} else if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function getPurcBills(isGetActive, isDownload) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		if (isDownload){
			oFilter.download = isDownload;
			oFilter.no_of_docs = 500;
			oFilter.skip = 1;
			oFilter.rptType = true;
		}

		if (isDownload && typeof isDownload === 'string')
			oFilter.billType = isDownload;

		billsService.purchaseBillGet(oFilter, function (res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			} else if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function reportDownload(billType) {

		if (!vm.myFilter.start_date || !vm.myFilter.end_date)
			return swal('Error', 'Start and End Date is required', 'error');

		let oFilter = prepareFilter();
		oFilter.download = true;
		if (billType)
			oFilter.billType = billType;

		billsService.reportDownload(oFilter, function (res) {
			let a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		});
	}

	function remove() {
		swal({
				title: 'Are you sure!!! you want to Remove Voucher?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#03A218',
				cancelButtonColor: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirmU) {
				if (isConfirmU) {
					billsService.purchaseBillRemove({
						_id: vm.selectedBill._id
					}, function (res) {
						swal('Success', res.message, 'success');
					});
				}
			});
	}

	function unapprove() {
		billsService.purchaseBillUnapprove({
			_id: vm.selectedBill._id
		}, function (res) {
			swal('Success', res.message, 'success');
			getBills();
		});
	}

	function getAdvance(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					reference_no: viewValue,
					no_of_docs: 10,
				};
				tripServices.tripAdvances(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getFuelVendor(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				vendorFuelService.getVendorFuels(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function accountmaster(viewValue, isGroup) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (isGroup)
					req.isGroup = true;
				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function onAccSelect(item) {
		vm.aAccount = vm.aAccount || [];
		vm.aAccount.push(item);
		vm.myFilter.account = '';
	}

	function onAccountGrp(item) {
		vm.aAccountGroup = vm.aAccountGroup || [];
		vm.aAccountGroup.push(item);
		vm.myFilter.acGroup = '';
	}

	function removeAccount(select, index) {
		vm.aAccount.splice(index, 1);
	}

	function removeAcGroup(select, index) {
		vm.aAccountGroup.splice(index, 1);
	}

	function dateChange(dateType) {

		if (dateType === 'startDate' && vm.myFilter.end_date && vm.myFilter.start_date) {

			let isDate = vm.myFilter.end_date instanceof Date,
				monthRange = vm.myFilter.end_date.getMonth() - vm.myFilter.start_date.getMonth(),
				dateRange = vm.myFilter.end_date.getDate() - vm.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += (vm.myFilter.end_date.getFullYear() - vm.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 12)
				isNotValid = monthRange < 0 ? true : (30 - vm.myFilter.start_date.getDate() + vm.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.myFilter.start_date);
				vm.myFilter.end_date = new Date(date.setMonth(date.getMonth() + 12));
			}

		} else if (dateType === 'endDate' && vm.myFilter.end_date && vm.myFilter.start_date) {

			let isDate = vm.myFilter.start_date instanceof Date,
				monthRange = vm.myFilter.end_date.getMonth() - vm.myFilter.start_date.getMonth(),
				dateRange = vm.myFilter.end_date.getDate() - vm.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += (vm.myFilter.end_date.getFullYear() - vm.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 12)
				isNotValid = monthRange < 0 ? true : (30 - vm.myFilter.start_date.getDate() + vm.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.myFilter.end_date);
				vm.myFilter.start_date = new Date(date.setMonth(date.getMonth() - 12));
			}
		}
	}

	function prepareFilter() {
		let filter = {
			multiBill: {$exists: false},
			billType: {$ne:'Dues Bill'}
		};

		if (vm.myFilter.billNo)
			filter.billNo = vm.myFilter.billNo;

		if (vm.myFilter.refNo)
			filter.refNo = vm.myFilter.refNo;

		if (vm.myFilter.type)
			// filter.billType = vm.myFilter.type;
			filter.billType = {$in:vm.myFilter.type};

		if (vm.myFilter.dieselrRfNo)
			filter['items'] = vm.myFilter.dieselrRfNo._id;

		if (vm.myFilter.fuel_company)
			filter.vendorFuelCpny = vm.myFilter.fuel_company;

		if (vm.myFilter.vendorfuel)
			filter.vendorFuel = vm.myFilter.vendorfuel._id;

		if (vm.aVendorfuel && vm.aVendorfuel.length) {
			filter.vendorFuel = [];
			vm.aVendorfuel.map((v) => {
				filter.vendorFuel.push(v._id);
			});
		}

		if (vm.myFilter.approved) {
			if (vm.myFilter.approved == 'true')
				filter.plainVoucher = true;
			else
				filter.plainVoucher = false;
		}

		if (vm.aAccount && vm.aAccount.length) {
			filter.account = [];
			vm.aAccount.map((v) => {
				filter.account.push(v._id);
			});
		}
		if (vm.aAccountGroup && vm.aAccountGroup.length) {
			filter.accountGroup = [];
			vm.aAccountGroup.map((v) => {
				filter.accountGroup.push(v._id);
			});
		}

		// if (vm.myFilter.account)
		// 	filter.account = vm.myFilter.account._id;

		if (vm.myFilter.start_date)
			filter.from = vm.myFilter.start_date;

		if (vm.myFilter.end_date)
			filter.to = vm.myFilter.end_date;

		if (vm.myFilter.dateType) filter.dateType = vm.myFilter.dateType;

		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();

		return filter;
	}

	function printBill() {
		if (!vm.selectedBill)
			return swal('Warning', 'Select at least one Purchase Bill!!!!!', 'warning');

		$modal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function (
					$scope,
					$uibModalInstance,
					clientService,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;

					$scope.aTemplate = otherData.aBillTemplate;
					$scope.templateKey = $scope.aTemplate[0];

					$scope.getBill = function (templateKey = 'default') {

						var oFilter = {
							_id: otherData._id,
							pBillName: templateKey
						};

						clientService.getPurchaseBillPreview(oFilter, success, fail);
					};

					$scope.getBill($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error', 'Something Went Wrong', 'error');
						$scope.closeModal();
					}

					$scope.closeModal = function () {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function () {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id) {
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0].key}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					let aTemplate = ($scope.$constants.aPurchaseBillTemplate || []);
					return {
						_id: vm.selectedBill._id,
						aBillTemplate: aTemplate,
					};
				}
			}
		});
	}
}

function purchaseBillUpsertController(
	$timeout,
	$uibModalInstance,
	accountingService,
	billBookService,
	billsService,
	branchService,
	DatePicker,
	modelDetail,
	otherData,
	tripServices,
	NumberUtil
) {

	let vm = this;

	// function identifier
	vm.closeModal = closeModal;
	vm.getBranch = getBranch;
	vm.getRefNo = getRefNo;
	vm.onBranchSelect = onBranchSelect;
	vm.onRefSelect = onRefSelect;
	vm.delAdvance = delAdvance;
	vm.refreshRemark = refreshRemark;
	vm.getAccount = getAccount;
	vm.addAdvance = addAdvance;
	vm.addDiscount = addDiscount;
	vm.deleteDiscount = deleteDiscount;
	vm.process = process;
	vm.calTds = calTds;
	vm.calAdjAmount = calAdjAmount;
	vm.submit = submit;

	// init
	(function init() {

		otherData = otherData || {};
		vm.isDisabled = false;
		vm.type = modelDetail.type || 'view';
		vm.aAdvances = otherData.aAdvances || [];
		vm.DatePicker = angular.copy(DatePicker);
		vm.aFromGroup = ['Diesel-Bill'];
		vm.aDiscountGroup = ['Discount'];

		// if (vm.aAdvances.length == 0) {
		// 	swal('Warning', 'No Advance Selected', 'error');
		// 	closeModal();
		// 	return;
		// }

		vm.billObj = otherData.billObj;

		if (vm.type !== 'add') {
			vm.billNo = vm.billObj.billNo;
			vm.vendor = vm.billObj.account.name;
			vm.remark = vm.billObj.remark;
			vm.from = vm.billObj.from_account;
			vm.billDate = vm.billObj.billDate;
			vm.aDiscount = vm.billObj.aDiscount || [];
			vm.remark = vm.billObj.remark;
			vm.branch = vm.billObj.branch;
			vm.selectedRefNo = {};
			vm.branch && onBranchSelect(vm.branch);
			vm.refNo = vm.billObj.refNo;
			vm.adjAmount = vm.billObj.adjAmount;
			vm.adjDebitAc = vm.billObj.adjDebitAc;
			vm.billAmount = vm.billObj.billAmount;
			vm.totItem = vm.billObj.totItem;
			vm.remark = vm.billObj.remark;
			vm.discount = vm.billObj.totDiscount;
			vm.totalAmount = vm.billObj.totalAmount;
			vm.tdsAmt = vm.billObj.tdsAmt;
			if(vm.billObj.tdsAc && vm.billObj.tdsAcName)
				vm.tdsAc = {_id: vm.billObj.tdsAc , name: vm.billObj.tdsAcName};


			if (vm.billObj.refNo)
				vm.selectedRefNo.bookNo = vm.billObj.refNo;

			if (vm.billObj.stationaryId)
				vm.selectedRefNo._id = vm.billObj.stationaryId;
			refreshRemark();
			// calculateAdvance();

		} else {
			// vm.billAmount = vm.aAdvances[0].amount || 0;
			vm.billNoDef = !!vm.aAdvances[0].bill_no;
			vm.billNo = vm.aAdvances[0].bill_no;
			vm.vendor = vm.aAdvances[0].from_account.name;
			//vm.billDate = new Date();
			vm.aDiscount = [];
			calculateAdvance();
		}
		// sum of all advances amount
		getAccount('aFromAccount', vm.aFromGroup);

	})();

	// Actual Function
	function process(oDiscount) {
		if (oDiscount)
			vm.discount -= oDiscount.amount;
		else
			vm.discount += vm.discountAmount;

		vm.totalAmount = vm.totItem - vm.discount;
		vm.billAmount = vm.totItem;
		vm.adjAmount = vm.adjAmount || 0;
		vm.billAmount += vm.adjAmount;
	}

	function addDiscount() {
		if (vm.discountAccount && vm.discountAmount) {
			vm.aDiscount.push({
				amount: vm.discountAmount,
				accountRef: vm.discountAccount._id,
				accountName: vm.discountAccount.name,
				remark: vm.discountRemark
			});
			process();
			vm.discountAccount = vm.discountAmount = discountRemark = undefined;
		}
	}

	function deleteDiscount(oDiscount, index) {
		process(oDiscount);
		vm.aDiscount.splice(index, 1);
	}

	function calAdjAmount() {
		vm.adjPercent = vm.billAmount * 1 / 100;
		vm.adjCalAmount = vm.billAmount - vm.totItem;
		if (vm.adjCalAmount > (-vm.adjPercent) && vm.adjCalAmount < vm.adjPercent) {
			vm.adjAmount = vm.adjCalAmount;
			vm.dupBillAmount = vm.billAmount;
			vm.flag = false;
		} else {
			vm.flag = true;
			$timeout(function () {
				vm.billAmount = vm.dupBillAmount || vm.totItem;
				vm.flag = false;
			}, 2000);
		}
	}

	function closeModal() {
		$uibModalInstance.close();
	}

	function calculateAdvance() {
		let aRate = [];
		vm.totalLit = 0;
		vm.totItem = vm.totAdv = vm.aAdvances.reduce((acc, cur) => {

			let foundRate = aRate.find(o => o.rate === (cur.dieseInfo && cur.dieseInfo.rate || 0));

			if (foundRate) {
				foundRate.liter += (cur.dieseInfo && cur.dieseInfo.litre || 0);
			} else {
				aRate.push({
					rate: (cur.dieseInfo && cur.dieseInfo.rate || 0),
					liter: (cur.dieseInfo && cur.dieseInfo.litre || 0)
				});
			}

			vm.totalLit += (cur.dieseInfo && cur.dieseInfo.litre || 0);
			return acc + (cur.amount || 0);
		}, 0);

		refreshRemark();
		vm.discount = vm.aDiscount.reduce((a, b) => a + (b.amount || 0), 0);
		vm.totalAmount = vm.amount = vm.totItem - vm.discount;
		vm.billAmount = vm.totItem || 0;
		calTds();
	}

	function calTds(){
		vm.billAmount = vm.totItem || 0;
		if(vm.tdsAmt) {
			vm.billAmount = vm.billAmount - NumberUtil.toFixed(vm.tdsAmt)
		}
	}

	function refreshRemark() {
		vm.totalLit = 0;
		vm.remark = vm.aAdvances.reduce((aRate, cur) => {

			let foundRate = aRate.find(o => o.rate === (cur.dieseInfo && cur.dieseInfo.rate || 0));

			if (foundRate) {
				foundRate.liter += (cur.dieseInfo && cur.dieseInfo.litre || 0);
			} else {
				aRate.push({
					rate: (cur.dieseInfo && cur.dieseInfo.rate || 0),
					liter: (cur.dieseInfo && cur.dieseInfo.litre || 0)
				});
			}
			vm.totalLit += (cur.dieseInfo && cur.dieseInfo.litre || 0);

			return aRate;
		}, []).map(o => `${NumberUtil.toFixed(o.liter)} Ltr. @ ${NumberUtil.toFixed(o.rate)}`).join(' + ') + `,Total ${NumberUtil.toFixed(vm.totalLit)} Ltr.`
	}

	function delAdvance(index) {
		if (!vm.aAdvances.length) {
			swal('Error', 'No Advance Selected', 'error');
			closeModal();
			return;
		}
		vm.aAdvances.splice(index, 1);
		calculateAdvance();
	}

	//In case of advance type is equal to Diesel or Driver Case then bill no of  advance and purchase bill should be same
	//In case of advance type is equal to Vendor advance then vendor paymentMode should be Diesel and Diesel Cash and bill no not required

	function addAdvance() {
		vm.oFilter = vm.oFilter || {};

		if (!(vm.oFilter.reference_no || (vm.oFilter.from && vm.oFilter.to)))
			return swal('Error', 'Reference No./Date Range is required', 'error');

		let oFilter = {
			from_account: vm.aAdvances[0] && vm.aAdvances[0].from_account,
			cond: [{
				$or: [
					{
						advanceType: {$in: ['Diesel', 'Driver Cash']}
					},
					{
						advanceType: 'Vendor Advance',
						'vendorPayment.paymentMode': {$in: ['Diesel', 'Diesel Cash']}
					}
				]
			}]
		};

		if(vm.oFilter.reference_no) {
			oFilter.reference_no = vm.oFilter.reference_no;
			oFilter.no_of_docs = 1;
			// oFilter['cond'][0]['$or'][0].bill_no = vm.billNo;
		}else
			oFilter.no_of_docs = 500;

		if(vm.oFilter.from && vm.oFilter.from) {
			oFilter.from = moment(vm.oFilter.from, "DD/MM/YYYY").toISOString();
			oFilter.to = moment(vm.oFilter.to, "DD/MM/YYYY").toISOString();
		}

		if (vm.billObj && vm.billObj._id)
			oFilter['cond'].push({
				$or: [{
					purchaseBill: {$exists: false},
				}, {
					purchaseBill: vm.billObj._id
				}]
			});
		else
			oFilter['purchaseBill'] = {
				$exists: false
			};

		if (vm.aAdvances.find(o => o.reference_no === vm.oFilter.reference_no))
			return swal('Warning', 'Advance Already Exist!!!', 'warning');

		tripServices.tripAdvances(oFilter, function (res) {
			if (res && res.data.count) {
				res = res.data.data;
				vm.aAdvances.push(...res.reduce((arr, obj) => {
					if(!vm.aAdvances.find(o => o._id === obj._id))
						arr.push(obj);
					return arr;
				}, []));
				calculateAdvance();
				vm.oFilter = {};
			} else
				swal('Warning', 'No Advance Found!!!', 'warning');
		});
	}

	function getAccount(name, aGroup) {
		if (!(aGroup && name))
			return [];

		return new Promise(function (resolve, reject) {

			var oFilter = {
				all: true,
				no_of_docs: 10,
				group: aGroup
			}; // filter to send

			if (name)
				oFilter.name = name;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				rejcet([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}
		});
	}

	function getBranch(viewValue, id) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};

				if (id)
					req._id = id;
				else if (viewValue)
					req.name = viewValue;

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

	function getRefNo(viewValue, auto) {

		if (!vm.billBookId) {
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}

		if (!vm.billDate) {
			swal('Error', 'Bill Date is Mandatory', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				billBookId: vm.billBookId,
				type: 'Ref No',
				useDate: moment(vm.billDate, "DD/MM/YYYY").startOf('day').toDate(),
				status: "unused"
			};

			if (viewValue)
				requestObj.bookNo = viewValue;

			if (auto)
				requestObj.auto = true;

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onBranchSelect(item) {
		vm.refNo = '';

		vm.billBookId = item.refNoBook ? item.refNoBook.map(o => o.ref) : '';

		if (item.autoBook) {
			vm.autoBranch = vm.autoBranch || []; // to preserve the auto branch refNo

			let foundBranch = vm.autoBranch.find(o => o._id === item._id);

			if (foundBranch)
				vm.refNo = foundBranch.refNo;
			else {
				let pr = getRefNo();
				if (pr instanceof Promise)
					pr.then(function (res) {
						vm.refNo = res.data && res.data[0] && res.data[0].bookNo;
						onRefSelect(res.data[0]);
						vm.autoBranch.push({
							_id: item._id,
							refNo: vm.refNo
						});
					});
			}
		}
	}

	function onRefSelect(item) {
		vm.selectedRefNo = item;
	}

	function submit(isAcknowledge = false) {

		if (!vm.from || !vm.from._id)
			return swal('Error', 'No From A/c Selected', 'error');

		if (vm.from._id == vm.aAdvances[0].from_account._id)
			return swal('Error', 'Credit A/c and Debit A/c cannot be same account', 'error');

		if (!vm.aAdvances.length) {
			swal('Error', 'No Advance Selected', 'error');
			return;
		}

		if (isAcknowledge) {
			if (!vm.refNo)
				return swal('Error', 'Ref No. is Mandatory', 'error');

			if (!(vm.branch && vm.branch._id))
				return swal('Error', 'Branch is Mandatory', 'error');
		}

		if (vm.adjAmount && !(vm.adjDebitAc && vm.adjDebitAc._id))
			return swal('Error', 'Adjustment A/c is Mandatory', 'error');

		if (vm.tdsAmt && !(vm.tdsAc && vm.tdsAc._id))
			return swal('Error', 'TDS A/c is Mandatory', 'error');

		let request = {
			account: vm.aAdvances[0].from_account._id,
			accountName: vm.vendor,
			billType: 'Diesel',
			adjDebitAc: vm.adjDebitAc && vm.adjDebitAc._id,
			adjDebitAcName: vm.adjDebitAc && vm.adjDebitAc.name,
			adjAmount: vm.adjAmount,
			tdsAc: vm.tdsAc && vm.tdsAc._id,
			tdsAcName: vm.tdsAc && vm.tdsAc.name,
			tdsAmt: vm.tdsAmt,
			from_account: vm.from._id,
			from_accountName: vm.from.name,
			billNo: vm.billNo,
			items: vm.aAdvances.map(adv => adv._id),
			totItem: vm.totItem,
			amount: vm.amount,
			totDiscount: vm.discount,
			totalAmount: vm.totalAmount,
			billAmount: vm.billAmount,
			ltr: vm.totalLit,
			remark: vm.remark || '',
			billDate: moment(vm.billDate, "DD/MM/YYYY").toDate(),
			aDiscount: vm.aDiscount || [],
			refNo: vm.refNo,
			branch: vm.branch._id
		};
		if (vm.aAdvances[0].diesel_info)
			request.vendorFuel = vm.aAdvances[0].diesel_info.vendor;

		if ((vm.selectedRefNo && vm.selectedRefNo.bookNo) === vm.refNo)
			request.stationaryId = vm.selectedRefNo._id;
		else
			delete request.stationaryId;

		if (isAcknowledge)
			request.acknowledge = true;

		vm.isDisabled = true;
		if (vm.type === 'add') {
			billsService.purchaseBillAdd(request, successCallback,failureCallback);
		} else {
			request._id = vm.billObj._id;
			request.account = vm.billObj.account._id;
			billsService.purchaseBillUpdate(request, successCallback,failureCallback);
		}

		function successCallback(response) {
			vm.isDisabled = false;
			swal('Success', response.message, 'success');
			closeModal();
			return;
		}
		function failureCallback(err) {
			vm.isDisabled = false;
			swal('Error', err.message, 'error');
			return;
		}
	}
}

function generateBillWithOutGrController(
	$modal,
	$scope,
	$uibModal,
	$uibModalInstance,
	billingPartyService,
	billsService,
	billBookService,
	branchService,
	DatePicker,
	otherData,
	accountingService
) {
	let vm = this;
	vm.oBill = {}; //initialize with Empty Object
	vm.DatePicker = angular.copy(DatePicker);

	vm.calculateTax = calculateTax;
	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.onSelect = onSelect;
	vm.getGstType = getGstType;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.getBillingParty = getBillingParty;
	vm.getBillBookNo = getBillBookNo;
	vm.getAdjAcnt = getAdjAcnt;
	vm.getAllBranchSearch = getAllBranchSearch;
	vm.amountCeil = amountCeil;
	vm.amountFloor = amountFloor;
	vm.amountRefresh = amountRefresh;
	vm.billType = ['Actual Bill', 'Supplementary Bill'];
	vm.aGstType = ['IGST', 'CGST & SGST'];

	// init

	(function () {
		vm.oBill.cGST_percent = 0;
		vm.oBill.cGST = 0;
		vm.oBill.sGST_percent = 0;
		vm.oBill.sGST = 0;
		vm.oBill.iGST_percent = 0;
		vm.oBill.iGST = 0;
		vm.oBill.totalAmount = 0;
		vm.type = angular.copy(otherData.type);
		if (vm.type) {
			vm.oBill = angular.copy(otherData.aBill);
			setAccount();
			vm.billBookInfo = {
				billNo: vm.oBill.billNo,
				_id: vm.oBill.stationaryId
			};
			if(vm.oBill.branch && vm.oBill.branchName){
				vm.oBill.branch = {
					name: vm.oBill.branchName,
					_id: vm.oBill.branch
				};
			}
			if (vm.oBill.billDate)
				vm.oBill.billDate = new Date(vm.oBill.billDate);
			if (vm.oBill.dueDate)
				vm.oBill.dueDate = new Date(vm.oBill.dueDate);
			if (vm.oBill.submitionDate)
				vm.oBill.submitionDate = new Date(vm.oBill.submitionDate);
			if (vm.oBill.adjDebitAc) {
				vm.adjDebitAc = {_id: vm.oBill.adjDebitAc, name: vm.oBill.adjDebitAcName}
			}
		}

	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function amountCeil() {
		vm.oBill.billAmount = Math.ceil(vm.oBill.totalAmount);
		vm.oBill.adjAmount = vm.oBill.totalAmount - vm.oBill.billAmount;
	}

	function amountFloor() {
		vm.oBill.billAmount = Math.floor(vm.oBill.totalAmount);
		vm.oBill.adjAmount = vm.oBill.totalAmount - vm.oBill.billAmount;
	}

	function amountRefresh() {
		vm.oBill.billAmount = vm.oBill.totalAmount;
		vm.oBill.adjAmount = 0;
	}

	function setAccount() {
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === vm.oBill.billingParty.clientId);
		vm.clientAccount = vm.clientAccount || {};

		if (!(vm.clientAccount.salesAcc && vm.clientAccount.salesAccName)) {
			swal('Error', 'Sales A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.igstAcc && vm.clientAccount.igstAccName)) {
			swal('Error', 'IGST A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.cgstAcc && vm.clientAccount.cgstAccName)) {
			swal('Error', 'CGST A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.sgstAcc && vm.clientAccount.sgstAccName)) {
			swal('Error', 'Sales A/c not linked', 'error');
			throw new Error();
		}

		if(vm.clientAccount.adjAcc && vm.clientAccount.adjAccName)
			vm.adjDebitAc = {_id:vm.clientAccount.adjAcc, name: vm.clientAccount.adjAccName}
	}

	 function getAllBranchSearch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

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

	function getAdjAcnt(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					group: 'Adjustment',
				};
				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});
			});
		}
		return [];
	}

	function getBillingParty(viewValue) {
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

	function getBillBookNo(viewValue) {

		let bpConfig = $scope.$configs.master && $scope.$configs.master.billingParty && $scope.$configs.master.billingParty.defaultBillBook || false;

		if(!bpConfig)
			if (!(vm.oBill.billingParty && Array.isArray(vm.oBill.billingParty.billBook) && vm.oBill.billingParty.billBook.length)) {
				swal('Error', `No Stationary Book linked to ${vm.oBill.billingParty.name} Billing Party`, 'error');
				return [];
			}

		if (!vm.oBill.billDate) {
			swal('Error', `Bill Date is mandatory`, 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.oBill.billingParty.billBook[0] && vm.oBill.billingParty.billBook[0].ref,
				type: 'Bill',
				useDate: moment(vm.oBill.billDate).startOf('day').toDate(),
				cClientId: vm.oBill.billingParty.clientId,
				status: 'unused'
			};

			if(!bpConfig) {
				if (!requestObj.billBookId)
					return vm.nonBillBook = true;
				// return swal('Erorr',`No Stationary Book linked to ${vm.billingParty.name} Billing Party`,'error');

				billBookService.getStationery(requestObj, oSuc, oFail);
			}else{
				delete requestObj.billBookId;
				requestObj.defaultBook = bpConfig;
				billBookService.getStationery(requestObj, oSuc, oFail);
			}

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onSelect(item, model, label) {
		vm.billBookInfo = item;

	}

	function onBillingPartySelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || '0';

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {
			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId == billingParty.clientId);

			if (user) {
				vm.userName = billingParty.clientName = user.name;
				vm.gstPercentType = billingParty.state_code == user.state_code ? vm.aGstType[1] : vm.aGstType[0];
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}

		getGstType();
		calculateTax();
		setAccount();
	}

	function getGstType() {

		if (vm.gstPercentType == 'CGST & SGST') {
			vm.oBill.cGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.oBill.sGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.oBill.iGST_percent = 0;

		} else {
			vm.oBill.iGST_percent = vm.gstPercentToApply;
			vm.oBill.cGST_percent = 0;
			vm.oBill.sGST_percent = 0;
		}

	}

	function calculateTax() {
		vm.oBill.amount = Number((vm.oBill.amount || 0).toFixed(2));
		vm.oBill.cGST_percent = vm.oBill.cGST_percent || 0;
		vm.oBill.sGST_percent = vm.oBill.sGST_percent || 0;
		vm.oBill.iGST_percent = vm.oBill.iGST_percent || 0;

		vm.oBill.cGST = Number(((vm.oBill.amount * vm.oBill.cGST_percent / 100) || 0).toFixed(2));
		vm.oBill.sGST = Number(((vm.oBill.amount * vm.oBill.sGST_percent / 100) || 0).toFixed(2));
		vm.oBill.iGST = Number(((vm.oBill.amount * vm.oBill.iGST_percent / 100) || 0).toFixed(2));
		vm.oBill.totalAmount = vm.oBill.amount + vm.oBill.cGST + vm.oBill.sGST + vm.oBill.iGST;
		vm.oBill.totalAmount = Number((vm.oBill.totalAmount || 0).toFixed(2));
		vm.oBill.billAmount = vm.oBill.totalAmount;
	}


	function submit(formData, approve) {
		var billRequestObject = {
			...vm.oBill
		};

		if (formData.$valid) {
			if(vm.clientAccount.salesAccWithoutGST && vm.clientAccount.salesAccWithoutGSTName && !vm.oBill.sGST && !vm.oBill.cGST && !vm.oBill.iGST) {
				billRequestObject.salesAccount = vm.clientAccount.salesAccWithoutGST;
				billRequestObject.salesAccountName = vm.clientAccount.salesAccWithoutGSTName;
			} else if(vm.clientAccount.salesAcc && vm.clientAccount.salesAccName) {
				billRequestObject.salesAccount = vm.clientAccount.salesAcc;
				billRequestObject.salesAccountName = vm.clientAccount.salesAccName;
			}
			billRequestObject.iGSTAccount = vm.clientAccount.igstAcc;
			billRequestObject.cGSTAccount = vm.clientAccount.cgstAcc;
			billRequestObject.sGSTAccount = vm.clientAccount.sgstAcc;
			billRequestObject.iGSTAccountName = vm.clientAccount.igstAccName;
			billRequestObject.cGSTAccountName = vm.clientAccount.cgstAccName;
			billRequestObject.sGSTAccountName = vm.clientAccount.sgstAccName;

			// if (!vm.billBookInfo)
			// 	return swal('Erorr', 'Incorect Bill No.', 'error');

			if (billRequestObject.adjAmount && !(vm.adjDebitAc && vm.adjDebitAc._id))
				return swal('Erorr', 'Adjustment account required', 'error');

			if (billRequestObject.adjAmount) {
				billRequestObject.adjAmount = Number((billRequestObject.adjAmount || 0).toFixed(2));
				billRequestObject.adjDebitAcName = vm.adjDebitAc.name;
				billRequestObject.adjDebitAc = vm.adjDebitAc._id;
			}

			if(billRequestObject.branch && billRequestObject.branch._id){
				billRequestObject.branchName = billRequestObject.branch.name;
				billRequestObject.branch = billRequestObject.branch._id;
			}

			billRequestObject.billingParty = vm.oBill.billingParty._id;
			billRequestObject.stationaryId = vm.billBookInfo && vm.billBookInfo._id;
			// billRequestObject.billAmount = billRequestObject.totalAmount = vm.oBill.amount + vm.oBill.cGST + vm.oBill.sGST + vm.oBill.iGST;

			if(!billRequestObject.stationaryId)
				return swal('Erorr', 'Please selected valid bill no.', 'error');

			if(approve)
				billRequestObject.approve = true;

			if (vm.type) {
				delete billRequestObject.items;
				billsService.updateBill(billRequestObject, success, failure);
			} else {
				billsService.generateBill_withoutGr(billRequestObject, success, failure);
			}

			function success(response) {
				console.log(response);
				swal(response.data.message);
				$uibModalInstance.dismiss();
				// $scope.go('billing.generatedBills');
			}

			function failure(response) {
				swal('Error', response.data.message, 'error');
				console.log(response);
			}
		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}
}

function billsAddRemarkController(
	$scope,
	$uibModalInstance,
	billsService,
	DatePicker,
	otherData,
) {
	let vm = this;
	vm.oBill = {}; //initialize with Empty Object
	vm.DatePicker = angular.copy(DatePicker);

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.onSelect = onSelect;
	// init

	(function () {
		vm.aBill = angular.copy(otherData.aBill);
		console.log(vm.aBill);
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function onSelect(item, model, label) {
		vm.billBookInfo = item;
	}

	function submit(formData) {

		if (formData.$valid) {

			if (!vm.remark && !vm.submitionDate)
				return swal('Erorr', 'Please provide atleast one input.', 'error');

			if (!Array.isArray(vm.aBill)) {
				vm.aBill = [vm.aBill];
			} else {
				vm.aBill = vm.aBill;
			}

			if (vm.aBill && vm.aBill.length == 0) {
				return swal('Erorr', 'Please select atleast one bill', 'error');
			}

			let aBillId = [];
			for (let b of vm.aBill) {
				aBillId.push(b._id);
			}

			let billRequestObject = {
				aBIds: aBillId,
				remarks: vm.remark,
				submitionDate: vm.submitionDate
			}

			billsService.addRemarkMultipleBills(billRequestObject, success, failure);

			function success(response) {
				console.log(response);
				swal(response.data.message);
				$uibModalInstance.dismiss();
			}

			function failure(response) {
				swal(response.data.message);
				console.log(response);
			}
		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}
}

function editSupplyBillController(
	$scope,
	$uibModalInstance,
	$stateParams,
	confService,
	formulaEvaluateFilter,
	growlService,
	otherData,
	tripServices
) {
	let vm = this;

	// function identifier
	vm.submit = submit;
	vm.closeModal = closeModal;
	vm.includeDisinclued = includeDisinclued;
	vm.calculateCheckedCharges = calculateCheckedCharges;
	vm.oChargesToLock = {};
	vm.oCheckedCharges = {};
	vm.oChecked = [];
	vm.oCheckedKey = [];
	vm.checkedCharges = [];
	vm.checkedDeduction = [];
	vm.checkedChargesKey = [];
	vm.checkedDeductionKey = [];
	vm.totCheckedCharges = 0;
	vm.totCheckedDeduction = 0;

	(function init() {

		vm.selectedGr = otherData.selectedItem.gr;
		vm.selectedItem = otherData.selectedItem;
		// vm.aSelectedCharges = otherData.aSelectedCharges.charges || [];
		// vm.aSelectedCharges = otherData.aSelectedCharges || {};
		// vm.aSelectedDeduction = otherData.aSelectedCharges.deduction || [];
		// vm.oCheckedCharges = otherData.oCheckedCharges || {};

		// some basic operation based on mode the state is rendered
		getSupplymentryBillOfGr();
		getFormList();
		vm.firstCall = true;
	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getSupplymentryBillOfGr() {

		if (vm.selectedGr.selectedSupply && vm.selectedGr.selectedSupply.length)
			vm.oChargesToLock = vm.selectedGr.selectedSupply;

		if (vm.selectedItem.selectedSupply && vm.selectedItem.selectedSupply.length)
			vm.oCheckedCharges = (vm.selectedItem.selectedSupply);
		else if (vm.selectedGr.supplementaryBill) {
			vm.oChecked.push(...Object.keys(vm.selectedGr.supplementaryBill.charges || {}).map(o => `${o}`));
			vm.oChecked.push(...Object.keys(vm.selectedGr.supplementaryBill.deduction || {}).map(o => `${o}`));
			if (vm.selectedGr.supplementaryBill.basicFreight)
				vm.oChecked.push('basicFreight');
		}
		if (vm.oChargesToLock.length && vm.oChecked.length) {
			for (let key in vm.oChecked) {
				if (vm.oChargesToLock.indexOf(vm.oChecked[key]) == -1) {
					vm.oCheckedKey.push(vm.oChecked[key]);
				}
			}
			vm.oChecked = vm.oCheckedKey;
		}
		vm.oCheckedCharges = vm.oCheckedCharges.length && vm.oCheckedCharges || vm.oChecked;
		vm.aSelectedCharges = vm.oChargesToLock || {};
	}

	function getFormList() {
		let id = false;

		if (vm.selectedItem.billingParty && vm.selectedItem.billingParty.configs && vm.selectedItem.billingParty.configs.GR)
			id = vm.selectedItem.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id || typeof id === 'object')
			return;

		confService.get(id, function (response) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
			vm.checkedCharges = [];
			vm.checkedDeduction = [];
			try {
				for (let key in vm.__FormList) {
					if (vm.__FormList.hasOwnProperty(key)) {

						if (vm.__FormList[key].visible && $scope.$constants.modelConfigs.GR[key] && $scope.$constants.modelConfigs.GR[key].isSupplymentry) {

							let value = vm.__FormList[key];
							let constantValue = $scope.$constants.modelConfigs.GR[key];

							if (!constantValue)
								continue;


							if (vm.aSelectedCharges.length) {
								if (vm.aSelectedCharges.indexOf(constantValue.modelKey) != -1) {
									value.__disable = true;
									value.__checked = true;
								}
							}

							if (vm.oCheckedCharges.length) {
								if ((vm.oCheckedCharges.indexOf(constantValue.modelKey) != -1) && !(constantValue.deduction)) {
									vm.checkedCharges.push(key);
									value.__checked = true;
									value.__disable = false;
								} else if ((vm.oCheckedCharges.indexOf(constantValue.modelKey) != -1) && (constantValue.deduction)) {
									vm.checkedDeduction.push(key);
									value.__checked = true;
									value.__disable = false;
								}
							}
						}
					}
				}
			} catch (e) {
				console.log(e)
				calculateCheckedCharges();
			}


			calculateCheckedCharges();
		});
	}

	function includeDisinclued(obj, name, isDeduction) {
		let isChecked = obj.__checked;
		let key = $(`form[name="supplyBillform"]`).find(`input[name="${name}"]`).attr('ng-model').split('.').slice(-1)[0];

		if (isChecked) {
			if (isDeduction) {
				vm.checkedDeduction.push(name);
				vm.checkedDeductionKey.push(key);
			} else {
				vm.checkedCharges.push(name);
				vm.checkedChargesKey.push(key);
			}
		} else {
			if (isDeduction) {
				vm.checkedDeduction.splice(vm.checkedDeduction.indexOf(name), 1);
				vm.checkedDeductionKey.splice(vm.checkedDeductionKey.indexOf(key), 1);
				vm.oCheckedCharges.splice(vm.oCheckedCharges.indexOf(key), 1);
			} else {
				vm.checkedCharges.splice(vm.checkedCharges.indexOf(name), 1);
				vm.checkedChargesKey.splice(vm.checkedChargesKey.indexOf(key), 1);
				vm.oCheckedCharges.splice(vm.oCheckedCharges.indexOf(key), 1);
			}
		}

		calculateCheckedCharges();
	}

	function calculateCheckedCharges() {
		vm.totCheckedCharges = formulaEvaluateFilter(vm.checkedCharges.join('__SEPERATOR__+__SEPERATOR__').split('__SEPERATOR__'), $scope, 'supplyBillform') || 0;
		vm.totCheckedDeduction = formulaEvaluateFilter(vm.checkedDeduction.join('__SEPERATOR__+__SEPERATOR__').split('__SEPERATOR__'), $scope, 'supplyBillform') || 0;
	}

	function submit(formData) {

		// console.log(formData);
		let request = {
			_id: vm.selectedGr._id,
			supplementaryBill: vm.selectedGr.supplementaryBill,
		};

		request.supplementaryBill.totalDeduction = vm.totalDeduction;
		request.supplementaryBill.totalCharges = vm.totalCharges;

		tripServices.updateGR(request, success, failure);

		function success(res) {

			let obj = {
				charges: {},
				deduction: {},
				selectedSupply: [],
				totalCharges: vm.totCheckedCharges,
				totalDeduction: vm.totCheckedDeduction,
				totalFreight: vm.totalFreight
			};

			if (vm.oCheckedCharges.length)
				obj.selectedSupply = vm.oCheckedCharges;

			vm.checkedChargesKey.forEach(key => {
				obj.selectedSupply.push(key);
				obj.charges[key] = obj.charges[key] || 0;
			});

			vm.checkedDeductionKey.forEach(key => {
				obj.selectedSupply.push(key);
				obj.deduction[key] = obj.deduction[key] || 0;
			});

			if (vm.selectedGr.selectedSupply && vm.selectedGr.selectedSupply.indexOf('basicFreight') === -1) {
				obj.basicFreight = (vm.selectedGr.supplementaryBill.basicFreight || 0);
			} else if (!vm.selectedGr.selectedSupply && obj.selectedSupply.indexOf('basicFreight') != -1) {
				obj.basicFreight = (vm.selectedGr.supplementaryBill.basicFreight || 0);
			}

			$uibModalInstance.close({res: res.data.data, suppObj: obj});
		}

		function failure(res) {
			swal('Error', res.data.message, 'error');
			reject(res.data.message);
		}
	}
}

function genOBBillCtrl(
	$scope,
	$state,
	$timeout,
	$uibModal,
	DateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	lazyLoadFactory,
	stateDataRetain,
) {

	$scope.DatePicker = angular.copy(DatePicker);
	$scope.dateChange = dateChange;
	$scope.selectedMultiBill = selectedMultiBill;
	$scope.addBill = addBill;
	$scope.onStateRefresh = function () {
		getGeneratedBills();
	};

	// init
	(function init() {
		if (stateDataRetain.init($scope))
			return;
		$scope.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		$scope.lazyLoad = lazyLoadFactory(); // init lazyload
		$scope.selectedBill = [];
		$scope.aGeneratedBill = [];
		$scope.selectType = 'index';
		$scope.billIconStatus = true;
		$scope.billIconRemark = true;
		$scope.myFilter = {};
		$scope.columnSetting = {
			allowedColumn: [
				'Bill No.',
				'Gr No.',
				'Bill Type',
				'Status',
				'Billing Party',
				'Billing Party A/C',
				'Billing Date',
				'Due Date',
				'Allocated Freight',
				'CGST',
				'SGST',
				'IGST',
				'Total Tax',
				'Bill Amount',
				'Amount Received',
				'Due Amount',
				'MR No',
				'CoverNote No',
				'Credit Note No',
				'Category',
				'Created By',
				'Bill Remark',
				'Remark',
			]
		};
		$scope.tableHead = [
			{
				'header': 'Bill No.',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Gr No.',
				'filter': {
					'name': 'getGrNumber',
					'aParam': [
						'items',
						'"gr"',
					]
				}
			},
			{
				'header': 'Bill Type',
				'bindingKeys': 'type'
			},
			{
				'header': 'Status',
				'bindingKeys': 'status'
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name'

			},
			{
				'header': 'Billing Party A/C',
				'bindingKeys': 'billingParty.billName'
			},
			{
				'header': 'Billing Date',
				'bindingKeys': 'billDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Due Date',
				'bindingKeys': 'dueDate | date:"dd-MMM-yyyy"',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Allocated Freight',
				'bindingKeys': 'amount'
			},
			{
				'header': 'Amount Received',
				//'bindingKeys': '(this | calReceivedAmt)|roundOff',
				'bindingKeys': '(this.recAmt || 0)|roundOff',
				'eval': true
			},
			{
				'header': 'Due Amount',
				//'bindingKeys': '((this.billAmount - (this | calReceivedAmt)) || 0)|roundOff',
				'bindingKeys': '(this.totDueAmt || 0)|roundOff',
				'eval': true

			},
			{
				'header': 'CGST',
				'bindingKeys': 'cGST',
			},
			{
				'header': 'SGST',
				'bindingKeys': 'sGST'
			},
			{
				'header': 'IGST',
				'bindingKeys': 'iGST'
			},
			{
				'header': 'Total Tax',
				'bindingKeys': 'iGST ? iGST: cGST + sGST'
			},
			{
				'header': 'Bill Amount',
				'bindingKeys': 'billAmount'
			},
			{
				'header': 'MR No',
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'receiving.moneyReceipt',
						'"mrNo"',
					]
				}
			},
			{
				'header': 'CoverNote No',
				'bindingKeys': 'coverNote.cnNo',
				'date': false
			},
			{
				'header': 'Credit Note No',
				'bindingKeys': 'this.creditNo',
				'date': false
			},
			{
				'header': 'Category',
				'bindingKeys': 'this.category',
				'date': false
			},
			{
				'header': 'Created By',
				'bindingKeys': 'created_by_name',
				'date': false
			},
			{
				'header': 'Bill Remark',
				'bindingKeys': 'remarks',
			},
			{
				'header': 'Remark',
				'bindingKeys': '(this | currentStatusRemark)',
				eval: true
			}
		];

	})();

	//filter for Invoice
	function prepareInvoiceFilterObject(download) {
		let myFilter = {
			multiBill: true
		};

		if ($scope.myFilter.start_date)
			myFilter.start_date = $scope.myFilter.start_date;

		if ($scope.myFilter.end_date)
			myFilter.end_date = new Date(($scope.myFilter.end_date).setHours(23, 59, 59));

		if ($scope.myFilter.bill_no)
			myFilter.billNo = $scope.myFilter.bill_no;

		if ($scope.myFilter.coverNoteNo)
			myFilter['coverNote.cnNo'] = $scope.myFilter.coverNoteNo;

		if ($scope.myFilter.search_billParty)
			myFilter.billingParty = $scope.myFilter.search_billParty._id;

		if ($scope.myFilter.dateType)
			myFilter.dateType = $scope.myFilter.dateType;

		if ($scope.myFilter.status) {
			switch ($scope.myFilter.status) {
				case 'Unapproved': {
					myFilter.status = 'Unapproved';
					break;
				}
				case 'Approved': {
					myFilter.status = 'Approved';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Cancelled': {
					myFilter.status = 'Cancelled';
					break;
				}
				case 'Dispatched': {
					myFilter.status = 'Dispatched';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
				case 'Acknowledged': {
					myFilter.status = 'Acknowledged';
					myFilter['approve.status'] = true;
					myFilter.cancelled = {$ne: true};
					break;
				}
			}
		}

		if ($scope.myFilter.gr_no)
			myFilter['items.gr.grNumber'] = $scope.myFilter.gr_no;

		if ($scope.myFilter.branch) {
			myFilter.branches = $scope.myFilter.branch._id;
		} else if ($scope.aBranch && $scope.aBranch.length) {
			myFilter.branches = [];
			$scope.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branches.push(obj._id);
			});
		}

		myFilter.populate = ['consignee', 'vehicle', 'consignor', 'creditNote'];

		if (download) {
			myFilter.download = true;
			//myFilter.populate.push('creditNote')
		}

		myFilter.no_of_docs = 15;
		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		myFilter.sort = {
			billNoInt: -1
		};

		return myFilter;
	}

	function selectedMultiBill() {
		let aSelectedBill = [];
		if (!Array.isArray($scope.aSelectedBill)) {
			aSelectedBill = [$scope.aSelectedBill];
			$scope.aSelectedMBills = aSelectedBill;
		} else {
			aSelectedBill = $scope.aSelectedBill;
			$scope.aSelectedMBills = aSelectedBill;
		}

		if (aSelectedBill.length == 1) {
			$scope.selectedBill = Object.assign({}, aSelectedBill[0]);
			$scope.billIconStatus = false;
			$scope.billIconRemark = false;
		} else if (aSelectedBill.length > 1) {
			$scope.billIconStatus = true;
			$scope.billIconRemark = false;
		} else {
			$scope.billIconStatus = true;
			$scope.billIconRemark = true;
		}

	}

	function dateChange(dateType) {

		if (dateType === 'startDate' && $scope.myFilter.end_date && $scope.myFilter.start_date) {

			let isDate = $scope.myFilter.end_date instanceof Date,
				monthRange = $scope.myFilter.end_date.getMonth() - $scope.myFilter.start_date.getMonth(),
				dateRange = $scope.myFilter.end_date.getDate() - $scope.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.myFilter.end_date.getFullYear() - $scope.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 3)
				isNotValid = monthRange < 0 ? true : (30 - $scope.myFilter.start_date.getDate() + $scope.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.myFilter.start_date);
				$scope.myFilter.end_date = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'endDate' && $scope.myFilter.end_date && $scope.myFilter.start_date) {

			let isDate = $scope.myFilter.start_date instanceof Date,
				monthRange = $scope.myFilter.end_date.getMonth() - $scope.myFilter.start_date.getMonth(),
				dateRange = $scope.myFilter.end_date.getDate() - $scope.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.myFilter.end_date.getFullYear() - $scope.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 3)
				isNotValid = monthRange < 0 ? true : (30 - $scope.myFilter.start_date.getDate() + $scope.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.myFilter.end_date);
				$scope.myFilter.start_date = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	function addBill(type) {
		if (type == 'edit') {
			if (Array.isArray($scope.aSelectedBill)) {
				if ($scope.aSelectedBill.length !== 1)
					return swal('Warning', 'Please Select Single Bill11', 'warning');
			} else if (!$scope.aSelectedBill._id)
				return swal('Warning', 'Please Select Single Bill', 'warning');

			let selectedBills = Array.isArray($scope.aSelectedBill) ? $scope.aSelectedBill[0] : $scope.aSelectedBill;
			// if (!selectedBills.refNo)
			// 	return swal('Warning', 'Voucher refNo not found', 'warning');

			$state.go('billing.genBillOBalUpsert', {
				data: {
					selectedBills,
					type
				}
			});


		} else {
			$state.go('billing.genBillOBalUpsert');

		}
	}

	$scope.getGeneratedBills = function (isGetActive, isDownload) {

		if (isDownload) {
			if (!($scope.myFilter.start_date && $scope.myFilter.end_date)) {
				swal('Warning', 'From and To date Required', 'warning');
				return;
			}
		}

		if ($scope.myFilter && $scope.myFilter.search_billParty && $scope.myFilter.search_billParty._id)
			$scope.selectType = 'multiple';
		else
			$scope.selectType = 'index';

		if (!$scope.lazyLoad.update(isGetActive))
			return;

		function success(res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			} else if (res.data && res.data.data) {

				res = res.data;

				res.data.forEach(oBill => {
					oBill.items.forEach(oItem => {

						if (!oItem.gr._id && oItem.grData)
							oItem.gr = oItem.grData;

						if (oItem.gr._id)
							oItem.gr.billingParty = oBill.billingParty;
					});
				});

				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res);
			}
		}

		function failure(res) {
			console.log('fail: ', res);
			swal('Some error with GET bills.', res.toString(), 'error');
		}

		var oFilter = prepareInvoiceFilterObject(isDownload);

		billsService.getGenerateBill(oFilter, success, failure);
	};

	$scope.selectThisRow = function (oBill, index) {
		$scope.selectedBill = oBill;
		$('.selectItem').removeClass('grn');
		var row = $($('.selectItem')[index]);
		row.addClass('grn');
	};

	$scope.revertAck = function () {

		swal({
				title: 'Are you sure you want to Revert Acknowledge?',
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
					billsService.revertAcknowledgeBill({
						_id: $scope.selectedBill._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						$scope.getGeneratedBills();
						swal('Success', res.data.message, 'success');
					}
				}
			});
	};

	$scope.billApprovePopup = function (type) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billAcknowledgeDataPopup.html',
			controller: 'billAcknowledgeDataPopupController',
			resolve: {
				type: function () {
					return type;
				},
				selectedBillData: function () {
					return $scope.selectedBill;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			$timeout(function () {
				$scope.getGeneratedBills();
			}, 1000);
		}, function (data) {
			// swal("Bill Acknowledge Canceled",'', "error")
		});
	};

	$scope.getBillingPartyName = function (viewValue) {
		if (viewValue && viewValue.toString().length <= 2)
			return;

		billingPartyService.getBillingParty({name: viewValue}, res => $scope.aBillingParty = res.data, err => console.log`${err}`);
	};

	$scope.getDname = function (viewValue) {
		function oSucD(response) {
			$scope.aRoute = response.data.data;
		};

		function oFailD(response) {
			//console.log(response);
		}

		if (viewValue && viewValue.toString().length > 2) {
			Routes.getAllRoutes({name: viewValue}, oSucD, oFailD);
		}
	};

	$scope.printBill = function () {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		var oFilter = {
			_id: $scope.selectedBill._id,
			type: $scope.selectedBill.type,
			//gr: $scope.selectedBill.items[0].gr
			gr: $scope.selectedBill
		};
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'billRendorCtrl',
			resolve: {
				thatTrip: oFilter
			}
		});
	};

	$scope.onInvoiceSelect = function (item, model, label) {
		$scope.selectInVoice = item;
	};

	$scope.getBillPDFDATA = function (selectInVoice) {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		function success(data) {
			var selBillData = data.data;
			selBillData.download = true;
			var modalInstance = $modal.open({
				templateUrl: 'views/bills/preViewBill.html',
				controller: 'invoiceCtrl',
				resolve: {
					thatInvoice: function () {
						return selBillData;
					}
				}
			});

			modalInstance.result.then(function () {
				$state.reload();
			}, function (data) {
				/*if (data != 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }*/
				$state.reload();
			});
		}

		billsService.getdetailGeneBillData(selectInVoice, success);

	};

	$scope.approve = function (selectInVoice) {
		$rootScope.selectInVoice = selectInVoice;

		function success(data) {
			var msg = data.data.message;
			swal('Invoice Approved', msg, 'success');
			$state.reload();
		}

		swal({
				title: 'Are you sure to Approve this Invoice Bill.?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: 'rgb(94, 192, 222);',
				confirmButtonText: 'Yes, Approve!',
				closeOnConfirm: false
			},
			function (isConfirmU) {
				if (isConfirmU) {
					selectInVoice.status = 'approved';
					invoiceService.updateBill(selectInVoice, success);
				}

			});
	};

	$scope.billCancellationORApprovePopup = function (type) {
		if (!$scope.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		if ($scope.selectedBill.acknowledge.status && type === 'Cancel')
			return swal('Error', 'Approved Bill Cannot Be cancelled', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billCancellationPopup.html',
			controller: 'billCancellationORApprovePopup',
			resolve: {
				Type: function () {
					return type;
				},
				oBill: function () {
					return $scope.selectedBill;
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log(response);

			function success(response) {
				console.log(response);
				swal('Bill Successfully ' + type + 'ed');
				$state.reload();
			}

			function failure(response) {
				console.log(response);
				swal('Error', response.data.message, 'error');
			}

			var reqObj = {};

			if (type === 'Approve') {
				reqObj._id = $scope.selectedBill._id;
				reqObj.reason = response.reason;
				reqObj.remark = response.remark;
				reqObj.billDate = response.billDate;
				billsService.approveBill(reqObj, success, failure);
			} else if (type === 'Cancel') {
				reqObj._id = $scope.selectedBill._id;
				reqObj.cancel_reason = response.reason;
				reqObj.cancel_remark = response.remark;
				billsService.cancelBill(reqObj, success, failure);
			}
		});
	};

	//////////////////////////////////////////////////////////////////////////
}

function genBillOBalUpsert(
	$scope,
	$timeout,
	$uibModal,
	DateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	$stateParams
) {
	let vm = this;
	vm.getBillingParty = getBillingParty;
	vm.onBPSelect = onBPSelect;
	vm.addBill = addBill;
	vm.calAmt = calAmt;
	vm.submit = submit;

	if ($stateParams.data) {
		vm.aBill = $stateParams.data.selectedBills;
		vm.mode = $stateParams.data.type.toLowerCase();
	}

	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.aBill = [];
		if ($stateParams.data) {
			vm.aBill.push($stateParams.data.selectedBills)
			vm.mode = $stateParams.data.type.toLowerCase();
			vm.billingParty = $stateParams.data.selectedBills.billingParty;
		}
	})();

	// function Definition
	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function onBPSelect($item) {
		vm.aBill = [];
		setAccount();
	}

	function setAccount() {
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === vm.billingParty.clientId);
		vm.clientAccount = vm.clientAccount || {};

		if (!(vm.clientAccount.mlObDr && vm.clientAccount.mlObDrName)) {
			swal('Error', 'Sales A/c not linked', 'error');
			throw new Error();
		}
	}

	function addBill() {
		let obj = {
			// amount: 0,
			// cGST_percent: 0,
			// iGST_percent: 0,
		};
		vm.aBill.push(obj);
		calAmt(obj);
	}

	function calAmt(oBill) {
		oBill.sGST_percent = oBill.cGST_percent = oBill.cGST_percent || 0;
		oBill.iGST_percent = oBill.iGST_percent || 0;

		if (oBill.cGST_percent > 0)
			oBill.iGST_percent = 0;
		else
			oBill.sGST_percent = oBill.cGST_percent = 0;

		oBill.amount = oBill.amount || 0;
		oBill.cGST_percent = oBill.cGST_percent || 0;
		oBill.cGST = Math.round((oBill.amount * oBill.cGST_percent / 100) * 100) / 100;
		oBill.sGST_percent = oBill.sGST_percent || 0;
		oBill.sGST = Math.round((oBill.amount * oBill.sGST_percent / 100) * 100) / 100;
		oBill.iGST_percent = oBill.iGST_percent || 0;
		oBill.iGST = Math.round((oBill.amount * oBill.iGST_percent / 100) * 100) / 100;
		oBill.totalAmount = Math.round((oBill.amount + oBill.cGST + oBill.sGST + oBill.iGST) * 100) / 100;
	}

	function submit(formData) {
		if (vm.mode === 'edit') {
			if (!vm.aBill.length)
				return swal('Error', 'Add at least one bill', 'error');

			let req = {
				acknowledge: true,
				aBill: [],
				_id: vm.billingParty._id
			};

			// let billRequestObject = {};

			vm.aBill.forEach(oBill => {
				let billRequestObject = {
					...oBill
				};
				billRequestObject.type = "Actual Bill";
				// billRequestObject.salesAccount = vm.clientAccount.mlObDr;
				// billRequestObject.salesAccountName = vm.clientAccount.mlObDrName;
				billRequestObject.billingParty = vm.billingParty._id;
				billRequestObject.billAmount = billRequestObject.totalAmount;

				req.aBill.push(billRequestObject);
			});

			billsService.editMultiBill(req, success, failure);

		} else {
			if (!formData.$valid)
				return swal('Error', 'All Mandatory Fields are not filled', 'error');

			if (!vm.aBill.length)
				return swal('Error', 'Add at least one bill', 'error');

			let req = {
				acknowledge: true,
				aBill: []
			};

			vm.aBill.forEach(oBill => {
				let billRequestObject = {
					...oBill
				};

				billRequestObject.type = "Actual Bill";
				billRequestObject.salesAccount = vm.clientAccount.mlObDr;
				billRequestObject.salesAccountName = vm.clientAccount.mlObDrName;

				billRequestObject.billingParty = vm.billingParty._id;
				billRequestObject.billAmount = billRequestObject.totalAmount;

				req.aBill.push(billRequestObject);
			});

			// if (vm.mode === 'edit') {
			// 	billsService.editMultiBill(req, success, failure);
			// }else {
			billsService.genMultiBill(req, success, failure);
			// }
		}

		function success(response) {
			console.log(response);
			swal(response.data.message);
			vm.aBill = [];
			vm.billingParty = null;
			// $scope.go('billing.genBillOBal');
		}

		function failure(response) {
			swal('Error', response.data.message, 'error');
			console.log(response);
		}
	}
}

function genCrBillOBCtrl(
	$modal,
	$scope,
	$state,
	accountingService,
	billsService,
	DatePicker,
	lazyLoadFactory,
	voucherService,
	vendorFuelService
) {

	let vm = this;
	vm.DatePicker = angular.copy(DatePicker);

	// function identifier
	vm.accountmaster = accountmaster;
	vm.approve = approve;
	vm.addBill = addBill;
	vm.billOperation = billOperation;
	vm.dateChange = dateChange;
	vm.getBills = getBills;
	vm.getFuelVendor = getFuelVendor;
	vm.onAccSelect = onAccSelect;
	vm.onAccountGrp = onAccountGrp;
	vm.remove = remove;
	vm.removeAccount = removeAccount;
	vm.removeAcGroup = removeAcGroup;
	vm.reportDownload = reportDownload;
	vm.shouldDisableEditing = shouldDisableEditing;
	vm.unapprove = unapprove;
	vm.upsertBill = upsertBill;

	// init
	(function init() {

		vm.myFilter = {};
		vm.aBillType = ['Diesel', 'Tyre', 'FPA', 'Spare', 'Spare Parts', 'Maintenance'];
		vm.aFuelCompany = ["Bio Diesel", "BPCL", "Essar", "HPCL", "IOCL", "RIL"];
		vm.lazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: [
				'Bill No',
				'Bill Date',
				'Bill Type',
				'Vendor',
				'Ltr',
				'Bill Amount',
				'Total Payments',
				// 'REM Amount',
				'Paid Amount',
				'Remark',
				'Approved',
				'Created At',
			]
		};
		vm.tableHead = [
			{
				'header': 'Bill No',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Bill Date',
				'bindingKeys': 'billDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Bill Type',
				'bindingKeys': 'billType',
			},
			{
				'header': 'Vendor',
				'bindingKeys': 'account.name'
			},
			{
				'header': 'Ltr',
				'bindingKeys': 'ltr'
			},
			{
				'header': 'Bill Amount',
				'bindingKeys': 'billAmount.toFixed(2)'
			},
			{
				'header': 'Total Payments',
				'bindingKeys': 'totMaterial ? amount.toFixed(2) : totItem.toFixed(2)'
			},
			{
				'header': 'REM Amount',
				'bindingKeys': '(this.plainVoucher)[0] ? ((this.plainVoucher | calculateRemAmount)|roundOff) : "0"',
				'eval': true
			},

			// {
			// 	'header': 'Paid Amount',
			// 	'bindingKeys': 'paidAmount.toFixed(2)'
			// },
			{
				'header': 'Remark',
				'bindingKeys': 'remark'
			},
			{
				'header': 'Approved',
				'bindingKeys': 'this.plainVoucher ? "Yes" : "No"',
				'eval': true
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			}
		];

		getBills();

	})();

	// Actual Function

	function approve() {
		billsService.purchaseBillApprove({
			_id: vm.selectedBill._id
		}, function (res) {
			swal('Success', res.message, 'success');
		});
	}

	function addBill(type) {
		if (type === 'edit') {
			// if (Array.isArray(vm.selectedBill)) {
			// 	if (vm.selectedBill.length !== 1)
			// 		return swal('Warning', 'Please Select Single Bill', 'warning');
			// } else if (!vm.selectedBill._id)
			// 	return swal('Warning', 'Please Select Single Bill', 'warning');
			let selectedBills = Array.isArray(vm.selectedBill) ? vm.selectedBill[0] : vm.selectedBill;
			$state.go('billing.genCrBillOBUpsert', {
				data: {
					selectedBills,
					type
				}
			});

		} else {
			$state.go('billing.genCrBillOBUpsert');
		}
	}

	function upsertBill(isEdit) {
		if (isEdit) {
			$state.go('billing.addBill', {data: vm.selectedBill});
		} else {
			$state.go('billing.addBill');
		}
	}

	function shouldDisableEditing() {
		if (vm.selectedBill && vm.selectedBill.plainVoucher && vm.selectedBill.plainVoucher.length) {
			return Boolean(vm.selectedBill.plainVoucher.find(pv => pv.voucher));
		}
		return false;
	}

	function billOperation(type = 'view') {

		if (type != 'view' && vm.selectedBill.items.length == 0) {
			swal('Warning', 'No Advance Selected', 'error');
			return;
		}

		$modal.open({
			templateUrl: 'views/bills/purchaseBillUpsert.html',
			controller: [
				'$timeout',
				'$uibModalInstance',
				'accountingService',
				'billBookService',
				'billsService',
				'branchService',
				'DatePicker',
				'modelDetail',
				'otherData',
				'tripServices',
				'NumberUtil',
				purchaseBillUpsertController
			],
			controllerAs: 'pbuVm',
			resolve: {
				modelDetail: function () {
					return {
						type
					};
				},
				otherData: function () {
					return {
						aAdvances: vm.selectedBill.items,
						billObj: vm.selectedBill
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});

	}

	function getBills(isGetActive, isDownload) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		if (isDownload) oFilter.download = isDownload;

		if (isDownload && typeof isDownload === 'string')
			oFilter.billType = isDownload;

		billsService.purchaseBillGet(oFilter, function (res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			} else if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function reportDownload(billType) {

		if (!vm.myFilter.start_date || !vm.myFilter.end_date)
			return swal('Error', 'Start and End Date is required', 'error');

		let oFilter = prepareFilter();
		oFilter.download = true;
		if (billType)
			oFilter.billType = billType;

		billsService.reportDownload(oFilter, function (res) {
			let a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		});
	}

	function remove() {
		swal({
				title: 'Are you sure!!! you want to Remove Voucher?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#03A218',
				cancelButtonColor: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirmU) {
				if (isConfirmU) {
					billsService.purchaseBillRemove({
						_id: vm.selectedBill._id
					}, function (res) {
						swal('Success', res.message, 'success');
					});
				}
			});
	}

	function unapprove() {
		billsService.purchaseBillUnapprove({
			_id: vm.selectedBill._id
		}, function (res) {
			swal('Success', res.message, 'success');
		});
	}

	function getFuelVendor(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				vendorFuelService.getVendorFuels(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function accountmaster(viewValue, isGroup) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (isGroup)
					req.isGroup = true;
				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function onAccSelect(item) {
		vm.aAccount = vm.aAccount || [];
		vm.aAccount.push(item);
		vm.myFilter.account = '';
	}

	function onAccountGrp(item) {
		vm.aAccountGroup = vm.aAccountGroup || [];
		vm.aAccountGroup.push(item);
		vm.myFilter.acGroup = '';
	}

	function removeAccount(select, index) {
		vm.aAccount.splice(index, 1);
	}

	function removeAcGroup(select, index) {
		vm.aAccountGroup.splice(index, 1);
	}

	function dateChange(dateType) {

		if (dateType === 'startDate' && vm.myFilter.end_date && vm.myFilter.start_date) {

			let isDate = vm.myFilter.end_date instanceof Date,
				monthRange = vm.myFilter.end_date.getMonth() - vm.myFilter.start_date.getMonth(),
				dateRange = vm.myFilter.end_date.getDate() - vm.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += (vm.myFilter.end_date.getFullYear() - vm.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 12)
				isNotValid = monthRange < 0 ? true : (30 - vm.myFilter.start_date.getDate() + vm.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.myFilter.start_date);
				vm.myFilter.end_date = new Date(date.setMonth(date.getMonth() + 12));
			}

		} else if (dateType === 'endDate' && vm.myFilter.end_date && vm.myFilter.start_date) {

			let isDate = vm.myFilter.start_date instanceof Date,
				monthRange = vm.myFilter.end_date.getMonth() - vm.myFilter.start_date.getMonth(),
				dateRange = vm.myFilter.end_date.getDate() - vm.myFilter.start_date.getDate(),
				isNotValid = false;
			monthRange += (vm.myFilter.end_date.getFullYear() - vm.myFilter.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange <= 12)
				isNotValid = monthRange < 0 ? true : (30 - vm.myFilter.start_date.getDate() + vm.myFilter.end_date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.myFilter.end_date);
				vm.myFilter.start_date = new Date(date.setMonth(date.getMonth() - 12));
			}
		}
	}

	function prepareFilter() {
		let filter = {
			multiBill: true
		};

		if (vm.myFilter.billNo)
			filter.billNo = vm.myFilter.billNo;

		if (vm.myFilter.refNo)
			filter.refNo = vm.myFilter.refNo;

		if (vm.myFilter.type)
			filter.billType = vm.myFilter.type;

		if (vm.myFilter.fuel_company)
			filter.vendorFuelCpny = vm.myFilter.fuel_company;

		if (vm.myFilter.vendorfuel)
			filter.vendorFuel = vm.myFilter.vendorfuel._id;

		if (vm.aVendorfuel && vm.aVendorfuel.length) {
			filter.vendorFuel = [];
			vm.aVendorfuel.map((v) => {
				filter.vendorFuel.push(v._id);
			});
		}

		if (vm.myFilter.approved) {
			if (vm.myFilter.approved == 'true')
				filter.plainVoucher = true;
			else
				filter.plainVoucher = false;
		}

		if (vm.aAccount && vm.aAccount.length) {
			filter.account = [];
			vm.aAccount.map((v) => {
				filter.account.push(v._id);
			});
		}
		if (vm.aAccountGroup && vm.aAccountGroup.length) {
			filter.accountGroup = [];
			vm.aAccountGroup.map((v) => {
				filter.accountGroup.push(v._id);
			});
		}

		// if (vm.myFilter.account)
		// 	filter.account = vm.myFilter.account._id;

		if (vm.myFilter.start_date)
			filter.from = vm.myFilter.start_date;

		if (vm.myFilter.end_date)
			filter.to = vm.myFilter.end_date;

		if (vm.myFilter.dateType) filter.dateType = vm.myFilter.dateType;

		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();

		return filter;
	}
}

function genCrBillOBUpsertCtrl(
	$scope,
	$timeout,
	$uibModal,
	$stateParams,
	accountingService,
	DateUtils,
	DatePicker,
	billsService,
	billingPartyService,
	NumberUtil,
	Vendor
) {
	let vm = this;
	vm.getBillingParty = getBillingParty;
	vm.onBPSelect = onBPSelect;
	vm.addBill = addBill;
	vm.calAmt = calAmt;
	vm.getVendor = getVendor;
	vm.accountMaster = accountMaster;
	vm.onVendSelect = onVendSelect;
	vm.submit = submit;
	if ($stateParams.data) {
		vm.aBill = $stateParams.data.selectedBills;
		vm.mode = $stateParams.data.type.toLowerCase();
	}
	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.aBill = [];
		vm.from_account;
		if ($stateParams.data) {
			vm.aBill.push($stateParams.data.selectedBills)
			vm.mode = $stateParams.data.type.toLowerCase();
			vm.vendor = $stateParams.data.selectedBills.vendor;
		}
	})();

	// function Definition
	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function onBPSelect($item) {
		vm.aBill = [];
		setAccount();
	}

	function setAccount() {
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === vm.billingParty.clientId);
		vm.clientAccount = vm.clientAccount || {};

		if (!(vm.clientAccount.salesAcc && vm.clientAccount.salesAccName)) {
			swal('Error', 'Sales A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.igstAcc && vm.clientAccount.igstAccName)) {
			swal('Error', 'IGST A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.cgstAcc && vm.clientAccount.cgstAccName)) {
			swal('Error', 'CGST A/c not linked', 'error');
			throw new Error();
		}

		if (!(vm.clientAccount.sgstAcc && vm.clientAccount.sgstAccName)) {
			swal('Error', 'Sales A/c not linked', 'error');
			throw new Error();
		}
	}

	function addBill() {
		let obj = {
			// amount: 0,
			// cGST_percent: 0,
			// iGST_percent: 0,
		};
		vm.aBill.push(obj);
		calAmt(obj);
	}

	function calAmt(oBill) {
		oBill.materialItems = [];
		oBill.aDiscount = [];
		oBill.totDiscount = [];
		oBill.totMaterial = 0;
		oBill.cGST = 0;
		oBill.cGSTPercent = 0;
		oBill.iGST = 0;
		oBill.iGSTPercent = 0;
		oBill.sGST = 0;
		oBill.sGSTPercent = 0;
		oBill.tdsAmt = 0;
		oBill.labourAmt = 0;
		oBill.billAmount = oBill.totalAmount = oBill.amount = oBill.amount || 0;
		oBill.adjAmount = 0;
	}

	function getVendor(viewValue, _id) {
		return new Promise(function (resolve, reject) {
			if (viewValue != false && viewValue && viewValue.length < 3) {
				return resolve([]);
			}

			let oReq = {
				name: viewValue,
				fpa: true,
				cClientId: $scope.selectedClient
			};

			if (_id) {
				delete oReq.name;
				oReq._id = _id;
			}

			Vendor.getAllVendorsList(oReq, function success(res) {
				resolve(res.data.data);
			}, function (err) {
				reject([]);
			});
		});
	}

	function onVendSelect(item) {
		item.ho_address = item.ho_address || {};
		// vm.tdsRate = item.tdsSources && item.tdsSources.tdsRate;
		vm.billType = item.billType;
		vm.gstn = item.gstn;
		vm.state_name = item.ho_address.state;
		vm.state_code = item.ho_address.state_code;
		vm.vendorAccnt = item.account;
		vm.PanNo = item.pan_no;
		vm.vendorId = item._id;
		vm.tdsVerify = item.tdsVerify;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		const foundClientAllowed = getAccountFromConfig();
		vm.taxType = foundClientAllowed.state_code == item.ho_address.state_code ? '2' : '1';
		if (!vm.vendorAccnt) {
			swal('Error!', 'Account not linked to selected vendor', 'error');
		}

		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};

		if (!(vm.clientAccount.mlObCr && vm.clientAccount.mlObCrName)) {
			swal('Error', 'Purchase A/c not linked', 'error');
			throw new Error();
		}

		vm.from_account = {
			_id: vm.clientAccount.mlObCr,
			name: vm.clientAccount.mlObCrName
		}

	}

	function getAccountFromConfig() {
		return $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient) || {};
	}

	function accountMaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				accountingService.getAccountMaster({name: viewValue}, res => resolve(res.data.data), err => reject(err));
			});
		}
	}

	function submit(formData) {
		if (vm.mode) {
			let req = {
				aBill: [],
				acknowledge: true,
				_id: vm.vendor._id
			};

			vm.aBill.forEach(oBill => {
				let oSend = {
					...oBill,
					itemsType: 'materials',
					vendor: vm.vendor._id,
					billNo: oBill.billNo,
					billDate: oBill.billDate,
					billType: oBill.billType,
					amount: NumberUtil.toFixed(oBill.amount),
					totalAmount: NumberUtil.toFixed(oBill.amount),
					billAmount: NumberUtil.toFixed(oBill.amount),
				};

				req.aBill.push(oSend);
			});

			billsService.editMultiCrBill(req, success, failure);

		} else {
			if (!vm.vendorAccnt) {
				swal('Error!', 'Account not linked to selected vendor', 'error');
				return;
			}

			if (!vm.from_account) {
				swal('Error!', 'Purchase Account required', 'error');
				return;
			}

			if (!formData.$valid)
				return swal('Error', 'All Mandatory Fields are not filled', 'error');

			if (!vm.aBill.length)
				return swal('Error', 'Add at least one bill', 'error');

			let req = {
				aBill: [],
				acknowledge: true,
			};

			vm.aBill.forEach(oBill => {
				let oSend = {
					itemsType: 'materials',
					vendor: vm.vendorId,
					account: vm.vendorAccnt && vm.vendorAccnt.ref && vm.vendorAccnt.ref._id,
					accountName: vm.vendorAccnt && vm.vendorAccnt.ref && vm.vendorAccnt.ref.ledger_name || vm.vendorAccnt.ref.name,
					from_account: vm.from_account && vm.from_account._id,
					from_accountName: vm.from_account && vm.from_account.name,
					billNo: oBill.billNo,
					billDate: oBill.billDate,
					billType: oBill.billType,
					tdsRate: 0,
					gstn: vm.gstn,
					state_name: vm.state_name,
					state_code: vm.state_code,
					amount: NumberUtil.toFixed(oBill.amount),
					totMaterial: NumberUtil.toFixed(oBill.amount || 0),
					totalAmount: NumberUtil.toFixed(oBill.amount),
					billAmount: NumberUtil.toFixed(oBill.amount),
					adjAmount: 0,
					sGST: 0,
					cGST: 0,
					iGST: 0,
					materialItems: [],
					refNo: oBill.billNo
				};

				req.aBill.push(oSend);
			});

			// if (vm.type) {
			// 	billsService.updateBill(req, success, failure);
			// } else {
			billsService.genMultiCrBill(req, success, failure);
			// }
		}


		function success(response) {
			console.log(response);
			swal(response.data.message)
			vm.aBill = [];
			vm.vendorAccnt = null;
			vm.from_account = null;
		}

		function failure(response) {
			swal('Error', response.data.message, 'error');
			console.log(response);
		}
	}
}


function grUpsertPopupController(
	$modal,
	$modalInstance,
	$parse,
	$scope,
	$stateParams,
	billBookService,
	billingPartyService,
	branchService,
	CustomerRateChartService,
	confService,
	consignorConsigneeService,
	customer,
	cityStateService,
	DatePicker,
	dateUtils,
	formulaEvaluateFilter,
	materialService,
	otherUtils,
	stateDataRetain,
	tripServices,
	Vehicle,
	incentiveService,
	oGr
) {
	let vm = this;

	// function identifier
	vm.closeModal = closeModal;
	vm.calculateIncentive = calculateIncentive;
	vm.calculateRate = calculateRate;
	vm.clearIncentive = clearIncentive;
	vm.calday = calday;
	vm.getConsignee = getConsignee;
	vm.getConsignor = getConsignor;
	vm.getBillingParty = getBillingParty;
	vm.getSuppIncentive = getSuppIncentive;
	vm.updateIncentive = updateIncentive;
	vm.clearSuppIncentive = clearSuppIncentive;
	vm.calculateGst = calculateGst;
	vm.getCustomers = getCustomers;
	vm.getBillBookNo = getBillBookNo;
	vm.getAllBranch = getAllBranch;
	vm.getVname = getVname;
	vm.getRates = getRates;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.SelectRateChart = SelectRateChart;
	vm.setPaymentBasis = setPaymentBasis;
	vm.updateInvoiceMaterialObj = updateInvoiceMaterialObj;
	vm.getRoute = getRoute;
	vm.getARBranch = getARBranch;
	vm.submit = submit;
	vm.setTime = setTime;
	vm.getGstType = getGstType;
	vm.aStates = otherUtils.getState();

	(function init() {

		if ($scope.$configs.GR.config)
			vm.__FormList = $scope.$configs.GR.config;

		vm.arMaxDate = new Date(new Date().setDate(new Date(new Date()).getDate() + 7));
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.material = {};
		vm.aGstType = ['IGST', 'CGST & SGST'];
		vm.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};
		vm.__RateChart = $scope.$constants.modelConfigs.RATE_CHART;
		vm.DatePicker = angular.copy(DatePicker);
		vm.selectMaterialEvents = {
			onSelectionChanged: function () {

			}
		};

		if ($stateParams.data || oGr) {
			vm.selectedGr = $stateParams.data && $stateParams.data.gr || oGr.gr;
			vm.mode = $stateParams.data && $stateParams.data.mode && $stateParams.data.mode.toLowerCase() || 'edit';

			if (vm.selectedGr.trip && vm.selectedGr.trip._id)
				getTrip(vm.selectedGr.trip._id);

		} else {
			stateDataRetain.back('booking_manage.myGR');
			return;
		}

		// some basic operation based on mode the state is rendered
		getFormList();

		if (vm.mode === 'add' || vm.mode === 'edit') {
			vm.selectedGr.customer = vm.selectedGr.customer;
			vm.selectedGr.billingParty = vm.selectedGr.billingParty;
			vm.selectedGr.consignor = vm.selectedGr.consignor || vm.selectedGr.consigner;
			vm.selectedGr.invoices = Array.isArray(vm.selectedGr.invoices) ? vm.selectedGr.invoices : [];
			vm.selectedGr.eWayBills = Array.isArray(vm.selectedGr.eWayBills) ? vm.selectedGr.eWayBills : [];
			vm.selectedGr.detention = vm.selectedGr.loadingDetention || 0;
			vm.selectedGr.payment_type = vm.selectedGr.payment_type;
			vm.selectedGr.payment_basis = vm.selectedGr.payment_basis;
			// if(vm.selectedGr.branch && typeof vm.selectedGr.branch === 'object' && vm.selectedGr.branch._id)
			// 	vm.selectedGr.branch = vm.selectedGr.branch._id;

			if(typeof vm.selectedGr.container != 'string')
				vm.selectedGr.container = '';

			// vm.selectedGr.branch = vm.selectedGr.branch || {};
			vm.selectedGr.deduction = vm.selectedGr.deduction || {};
			vm.selectedGr.charges = vm.selectedGr.charges || {};
			vm.selectedGr.pod = vm.selectedGr.pod || {};

			if (vm.selectedGr.pod.date)
				vm.selectedGr.pod.date = new Date(vm.selectedGr.pod.date);

			if (vm.selectedGr.pod.unloadingArrivalTime) {
				vm.selectedGr.pod.unloadingArrivalTime = new Date(vm.selectedGr.pod.unloadingArrivalTime);
				vm.unloadingArrivalTimeModel = new Date();
				vm.unloadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.unloadingArrivalTimeModel, vm.selectedGr.pod.unloadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingLoadingTime) {
				vm.selectedGr.pod.billingLoadingTime = new Date(vm.selectedGr.pod.billingLoadingTime);
				vm.billingLoadingTimeModel = new Date();
				vm.billingLoadingTimeModel = dateUtils.setHoursFromDate(vm.billingLoadingTimeModel, vm.selectedGr.pod.billingLoadingTime);
			}

			if (vm.selectedGr.pod.loadingArrivalTime) {
				vm.selectedGr.pod.loadingArrivalTime = new Date(vm.selectedGr.pod.loadingArrivalTime);
				vm.loadingArrivalTimeModel = new Date();
				vm.loadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.loadingArrivalTimeModel, vm.selectedGr.pod.loadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingUnloadingTime) {
				vm.selectedGr.pod.billingUnloadingTime = new Date(vm.selectedGr.pod.billingUnloadingTime);
				vm.billingUnloadingTimeModel = new Date();
				vm.billingUnloadingTimeModel = dateUtils.setHoursFromDate(vm.billingUnloadingTimeModel, vm.selectedGr.pod.billingUnloadingTime);
			}

			if (vm.selectedGr.grDate)
				vm.selectedGr.grDate = new Date(vm.selectedGr.grDate);


			// init function in form editable mode only
			// getAllBranch();
			getAllBranch();
			getMaterialGroup();
			getRates();
		}

		if (vm.mode === 'add') {
			let route = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
			vm.selectedGr.acknowledge = vm.selectedGr.acknowledge || {};
			vm.selectedGr.acknowledge.source = vm.selectedGr.route && vm.selectedGr.route.source && vm.selectedGr.route.source.c;
			vm.selectedGr.acknowledge.destination = vm.selectedGr.route && vm.selectedGr.route.destination && vm.selectedGr.route.destination.c;
			vm.selectedGr.acknowledge.destinationState = vm.selectedGr.consignee ? vm.selectedGr.consignee.state : undefined;
			vm.selectedGr.acknowledge.routeDistance = vm.selectedGr.route && vm.selectedGr.route.route_distance;
			vm.gstPercentToApply = vm.selectedGr.billingParty && vm.selectedGr.billingParty.percent || '0';
			vm.selectedGr.payment_type = $scope.$constants.paymentType[1];
			getGstType();
			if (vm.selectedGr.consignee && vm.selectedGr.consignee.state) {
				vm.aStates.find(o => {
					if ((o.state).toLowerCase() == (vm.selectedGr.consignee.state).toLowerCase()) {
						vm.selectedGr.acknowledge.destinationState = o.state;
						return;
					}
				});
			}
		}

		if (vm.mode === 'edit') {
			if(vm.selectedGr && vm.selectedGr.trip && vm.selectedGr.trip.route_name && vm.selectedGr.acknowledge) {
				let [src, dest] = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
				vm.selectedGr.acknowledge.source = vm.selectedGr.acknowledge.source ? vm.selectedGr.acknowledge.source:src;
				vm.selectedGr.acknowledge.destination = vm.selectedGr.acknowledge.destination ? vm.selectedGr.acknowledge.destination:dest;
			}
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(obj => {
					if (obj.baseValueLabel) {
						obj.aCapacity = [];
						obj.aCapacity.push({label: obj.baseValueLabel, baseVal: obj.baseValue, rate: obj.rate});
					}
				})
			}

			vm.selectedGr.vehicle2 = vm.selectedGr.vehicle2;
			vm.gstPercentToApply = String(vm.selectedGr.iGST_percent || (vm.selectedGr.cGST_percent + vm.selectedGr.sGST_percent) || '0');
			if (vm.selectedGr.iGST_percent)
				vm.gstPercentType = 'IGST';
			else if (vm.selectedGr.cGST_percent || vm.selectedGr.sGST_percent)
				vm.gstPercentType = 'CGST & SGST';

			if (vm.selectedGr.grNumber) {
				if (vm.selectedGr.stationaryId) {
					vm.grNumberModel = {
						bookNo: vm.selectedGr.grNumber,
						_id: vm.selectedGr.stationaryId
					}
				} else {
					vm.grNumberModel = vm.selectedGr.grNumber;
				}
			}
			if (vm.selectedGr.grDate)
				calday();


			vm.firstCall = true;
			setPaymentBasis();

			if(vm.selectedGr.billingParty)
				getBParty(vm.selectedGr.billingParty)

			if(vm.selectedGr.branch)
				getBranchV2(vm.selectedGr.branch)
		}

		// calculateIncentive();

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.charges.detentionLoading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.supplementaryBill.charges.detentionLoading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.charges.detentionUnloading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.supplementaryBill.charges.detentionUnloading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		// setting form view mode i.e. to preview(readonly) to edit/add(editable)
		if (vm.selectedGr.fpa && vm.selectedGr.fpa.vch && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.mode == 'edit') {
			vm.supplyReadonly = false;
			vm.readonly = true;
		} else if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = false;
			vm.isReadonly = false;
		} else {
			switch (vm.mode) {
				case 'add':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				case 'edit':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					vm.detailsReadonly = true;
					break;
				default:
					vm.readonly = true;
					vm.supplyReadonly = true;
					vm.isReadonly = true;
					break;
			}
		}

		applyCss();
	})();

	/*
	* Fetch RateChart on both case add/edit
	* Add -
	* if single RateChart
	* show that rate only
	* capacity dropdown = baselabel + config.aCapacity
	* else if multiple RateChart
	* capacity dropdown = baselabel + config.aCapacity
	*
	* Edit -
	* */


	// Actual Function

	function closeModal() {
		$modalInstance.dismiss();
	}

	vm.onBranchSelectEvents = {
		onSelectionChanged: function () {
			vm.grNumberModel = undefined;
		}
	};

	function applyCss() {
		setTimeout(() => {
			$('.form-wrapper').find('label, .label').removeClass('req');
			$('.form-wrapper').find('[required]').parents('.form-group').find('label, .label').addClass('req');
		}, 2000);
	}

	function calday() {
		vm.loadingMinDate = dateUtils.addDate(vm.selectedGr.grDate, -15);
	}

	function calculateIncentive(buttonClicked = false) {

		if (!(vm.__FormList && vm.__FormList.incentive && vm.__FormList.incentive.visible)) {
			vm.incentivePercent = 0;
			return;
		}

		if (buttonClicked) {
			vm.incentiveButtonClicked = true;
			getRates();
		}
	}

	function calculateRate(oInvoice) {

		if (oInvoice.dummyCapacityObj) {
			oInvoice.baseValueLabel = oInvoice.dummyCapacityObj.label;
			oInvoice.capacity = oInvoice.dummyCapacityObj.baseVal || 0;
		}

		if (!oInvoice.aRateChart)
			return;

		let baseValToCheck;

		try {
			if (vm.__FormList.capacity.visible)
				baseValToCheck = oInvoice.capacity;
			else
				baseValToCheck = oInvoice.noOfUnits || 0;

		} catch (e) {
			baseValToCheck = oInvoice.noOfUnits || 0;
		}

		if (typeof baseValToCheck === 'undefined')
			return false;

		setPaymentBasis();

		let aRateChart = oInvoice.aRateChart || [];
		let foundRateChart;
		let foundRate;

		aRateChart.find(rateChart => {

			if (!Array.isArray(rateChart.baseRate) || !rateChart.baseRate.length) {

				if (baseValToCheck <= rateChart.baseValue) {
					foundRate = {
						baseVal: rateChart.baseValue,
						rate: rateChart.rate,
						baseValLabel: rateChart.baseValueLabel
					};
				}

			} else {
				foundRate = rateChart.baseRate.find(oRate => {
					if (baseValToCheck <= oRate.baseVal)
						return true;
					return false
				});
			}

			if (!foundRate)
				return false;

			foundRateChart = rateChart;
			return true
		});

		if (!foundRateChart && !foundRate && aRateChart[0]) {
			foundRateChart = aRateChart.slice(-1)[0];

			if (Array.isArray(foundRateChart.baseRate) && foundRateChart.baseRate.length)
				foundRate = foundRateChart.baseRate.slice(-1)[0];
			else {
				foundRate = {
					baseVal: foundRateChart.baseValue,
					rate: foundRateChart.rate,
					baseValLabel: foundRateChart.baseValueLabel
				};
			}

		}

		if (oInvoice && foundRateChart && foundRate)
			applyRates(oInvoice, foundRateChart, foundRate);
	}

	function setTime(date) {
		vm.selectedGr.grDate = new Date((date).setHours(0, 0, 0));
	}

	vm.onSelect = function (item, model, lable) {
		if (item.state) {
			vm.aStates.find(o => {
				if ((o.state).toLowerCase() == (item.state).toLowerCase()) {
					vm.selectedGr.acknowledge.destinationState = o.state;
					return;
				}
			});
		}
	};

	function getGstType() {
		// if(!vm.selectedGr.billingParty){
		// 		swal('Warning', 'No BillingParty Selected!!!!!', 'warning');
		// 		return;
		// }
		// if(($scope.$clientConfigs.gstin_no.substr(0, 2) === vm.selectedGr.billingParty.state_code ) || ($scope.$clientConfigs.gstin_no.substr(1, 1) === vm.selectedGr.billingParty.state_code)) {
		if (vm.gstPercentType == 'CGST & SGST') {
			vm.selectedGr.cGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.sGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.iGST_percent = 0;

		} else if (vm.gstPercentType === 'IGST') {
			vm.selectedGr.iGST_percent = vm.gstPercentToApply;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		} else {
			vm.gstPercentToApply = 0
			vm.selectedGr.iGST_percent = 0;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		}

	}

	function clearIncentive() {

		vm.selectedGr.charges.incentive = 0;
		typeof vm.watcherClearer === 'function' && vm.watcherClearer();

	}

	function getBParty(id) {
		if (!id)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				_id: id,
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				vm.selectedGr.billingParty = response.data[0];
				resolve(response.data);
			}
		});
	}

	function getBranchV2(Id) {
		if (!Id)
			return;

		return new Promise(function (resolve, reject) {

			let req = {
				no_of_docs: 10,
				_id : Id
			};

			branchService.getAllBranches(req, res => {
				vm.selectedGr.branch = res.data[0];
				resolve(res.data);
			}, err => {
				console.log`${err}`;
				reject([]);
			});

		});

		return [];
	}


	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
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

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
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

	function getBillBookNo(viewValue) {

		if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}

		if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
			return [];

		if (!vm.selectedGr.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.selectedGr.branch && Array.isArray(vm.selectedGr.branch.grBook) && vm.selectedGr.branch.grBook.map(o => o.ref),
				type: 'Gr',
				useDate: moment(vm.selectedGr.grDate).startOf('day').toDate(),
				status: "unused"
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' ||viewValue === 'auto') {
					if (response.data[0]) {
						vm.grNumberModel = response.data[0];
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getBillingParty(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				customer: custId,
				name: viewValue
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

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

	function calculateGst(id) {
		if (!id)
			return swal('error', 'BillingParty Not Selected', 'error');

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				_id: id
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				onBillingPartySelect(response.data[0]);
				resolve(response.data);
			}
		});
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let customerFilter = {
				all: true,
				status: "Active",
				name: viewValue
			};

			customer.getAllcustomers(customerFilter, success);

			function success(data) {
				resolve(data.data);
			}
		});
	}


	function getRates(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.grDate || !vm.selectedGr.acknowledge || !vm.selectedGr.acknowledge.source || !vm.selectedGr.acknowledge.destination)
			return;

		// fetch rate chart for single invoice
		if (invoice) {
			fetchRateChart(invoice);
		} else {
			//	fetch rete chart for multiple invoices
			Promise.all(vm.selectedGr.invoices.map(invoiceObj => {
				return fetchRateChart(invoiceObj);
			})).then(function () {
				vm.firstCall = true;

			});
		}

		function fetchRateChart(invoice) {
			return new Promise(function (resolve, reject) {

				if (!invoice.material || !invoice.material.groupCode)
					return;

				let request = {};

				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
					request.source = vm.selectedGr.acknowledge.source;
				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
					request.destination = vm.selectedGr.acknowledge.destination;
				if (invoice.material && invoice.material.groupCode)
					request.materialGroupCode = invoice.material.groupCode;
				if (vm.selectedGr.customer && vm.selectedGr.customer._id)
					request.customer = vm.selectedGr.customer._id;
				if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
					request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

				function onSuccess(res) {
					invoice.aRateChart = res.data || [];
					if (invoice.aRateChart[0] && invoice.aRateChart[0].baseRate && invoice.aRateChart[0].baseRate.length) {
						invoice.aCapacity = invoice.aRateChart[0].baseRate.filter(o => !!o.baseVal);
					} else {
						invoice.aCapacity = invoice.aRateChart.map(o => ({
							rate: o.rate,
							baseVal: o.baseValue,
							label: o.baseValueLabel
						})).filter(o => !!o.baseVal);
					}

					if (invoice.aRateChart.length === 0) {
						invoice.aCapacity = vm.__FormList.capacity.aValue && vm.__FormList.capacity.aValue.map(o => ({
							rate: invoice.rate || 0,
							baseVal: 0,
							label: o
						})) || {};
					}

					if (invoice.aCapacity.length && !(invoice.dummyCapacityObj && invoice.dummyCapacityObj.label)) {
						invoice.dummyCapacityObj = invoice.aCapacity[0];
						calculateRate(invoice);
					}

					invoice.aRateChart.sort((a, b) => a.baseValue - b.baseValue);

					if (vm.firstCall)
						return resolve();

					calculateRate(invoice);
				}

				function onFailure(response) {
					console.log(response);
				}

				CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
			});
		}
	}

	function applyRates(oInvoice, foundRate, baseRate) {

		if (baseRate.baseVal)
			vm.selectedGr.acknowledge.baseValue = oInvoice.baseValue = baseRate.baseVal;
		if (baseRate.baseValLabel)
			oInvoice.baseValueLabel = baseRate.baseValLabel;
		if (baseRate.rate)
			vm.selectedGr.acknowledge.rateChartRate = oInvoice.rate = oInvoice.rateChartRate = baseRate.rate;

		if (foundRate.routeDistance)
			vm.selectedGr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.invoiceRate)
			oInvoice.invoiceRate = foundRate.invoiceRate;

		if (foundRate.insurRate)
			oInvoice.insurRate = foundRate.insurRate;

		if (foundRate.grCharges && foundRate.grCharges.rate)
			vm.selectedGr.charges.grCharges = foundRate.grCharges.rate;
		if (foundRate.surCharges && foundRate.surCharges.rate)
			vm.selectedGr.charges.surCharges = foundRate.surCharges.rate;
		if (foundRate.cartageCharges && foundRate.cartageCharges.rate)
			vm.selectedGr.charges.cartageCharges = foundRate.cartageCharges.rate;
		if (foundRate.labourCharges && foundRate.labourCharges.rate)
			vm.selectedGr.charges.labourCharges = foundRate.labourCharges.rate;
		if (foundRate.otherCharges && foundRate.otherCharges.rate)
			vm.selectedGr.charges.other_charges = foundRate.otherCharges.rate;
		if (foundRate.prevFreightCharges && foundRate.prevFreightCharges.rate)
			vm.selectedGr.charges.prevFreightCharges = foundRate.prevFreightCharges.rate;
		if (foundRate.detentionLoading && foundRate.detentionLoading.rate)
			vm.selectedGr.loadingDetentionRate = foundRate.detentionLoading.rate;
		if (foundRate.detentionUnloading && foundRate.detentionUnloading.rate)
			vm.selectedGr.unloadingDetentionRate = foundRate.detentionUnloading.rate;
		if (foundRate.discount && foundRate.discount.rate)
			vm.selectedGr.deduction.discount = foundRate.discount.rate;

		if (foundRate.loading_charges && foundRate.loading_charges.rate)
			vm.selectedGr.charges.loading_charges = foundRate.loading_charges.rate;
		if (foundRate.unloading_charges && foundRate.unloading_charges.rate)
			vm.selectedGr.charges.unloading_charges = foundRate.unloading_charges.rate;
		if (foundRate.weightman_charges && foundRate.weightman_charges.rate)
			vm.selectedGr.charges.weightman_charges = foundRate.weightman_charges.rate;
		if (foundRate.overweight_charges && foundRate.overweight_charges.rate)
			vm.selectedGr.charges.overweight_charges = foundRate.overweight_charges.rate;
		if (foundRate.advance_charges && foundRate.advance_charges.rate)
			vm.selectedGr.deduction.advance_charges = foundRate.advance_charges.rate;
		if (foundRate.damage && foundRate.damage.rate)
			vm.selectedGr.deduction.damage = foundRate.damage.rate;
		if (foundRate.shortage && foundRate.shortage.rate)
			vm.selectedGr.deduction.shortage = foundRate.shortage.rate;
		if (foundRate.penalty && foundRate.penalty.rate)
			vm.selectedGr.deduction.penalty = foundRate.penalty.rate;
		if (foundRate.extra_running && foundRate.extra_running.rate)
			vm.selectedGr.charges.extra_running = foundRate.extra_running.rate;
		if (foundRate.dala_charges && foundRate.dala_charges.rate)
			vm.selectedGr.charges.dala_charges = foundRate.dala_charges.rate;
		if (foundRate.diesel_charges && foundRate.diesel_charges.rate)
			vm.selectedGr.charges.diesel_charges = foundRate.diesel_charges.rate;
		if (foundRate.kanta_charges && foundRate.kanta_charges.rate)
			vm.selectedGr.charges.kanta_charges = foundRate.kanta_charges.rate;
		if (foundRate.factory_halt && foundRate.factory_halt.rate)
			vm.selectedGr.charges.factory_halt = foundRate.factory_halt.rate;
		if (foundRate.company_halt && foundRate.company_halt.rate)
			vm.selectedGr.charges.company_halt = foundRate.company_halt.rate;
		if (foundRate.toll_charges && foundRate.toll_charges.rate)
			vm.selectedGr.charges.toll_charges = foundRate.toll_charges.rate;
		if (foundRate.green_tax && foundRate.green_tax.rate)
			vm.selectedGr.charges.green_tax = foundRate.green_tax.rate;

		if (foundRate.internal_rate && foundRate.internal_rate.rate)
			vm.selectedGr.internal_rate = foundRate.internal_rate.rate;
		if (foundRate.standardTime && foundRate.standardTime.rate)
			vm.selectedGr.standardTime = foundRate.standardTime.rate;

		vm.selectedGr.payment_basis = oInvoice.paymentBasis = foundRate.paymentBasis;

		if (foundRate.incentive && foundRate.incentive.rate) {

			switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
				case 'Master': {
					if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !foundRate.incentive || !foundRate.incentive.rate)
						return;

					// Handle failure response
					function onFailure(response) {
						console.log(response);
					}

					// Handle success response
					function onSuccess(response) {
						vm.incentivePercent = (response && response.data && response.data.rate) || 0;
						updateOnFreightChange();
					}

					incentiveService.autosuggest({
						customer: vm.selectedGr.customer._id,
						vehicle: vm.selectedGr.vehicle,
						date: new Date(vm.selectedGr.grDate).toISOString(),
					}, onSuccess, onFailure);

					break;
				}

				default:
					if (!vm.incentiveButtonClicked) {
						vm.incentiveButtonClicked = false;
						return;
					}

					switch (foundRate.incentive.basis) {

						case 'Percent of basic freight':
							vm.incentivePercent = foundRate.incentive.rate;
							updateOnFreightChange();
							break;

						case 'Fixed':
							vm.selectedGr.charges.incentive = foundRate.incentive.rate;
							break;

						default:
							if (typeof vm.selectedGr.incentivePercent != "number")
								return;

							let aExp = vm.__FormList.incentive.evalExp.map(e => {
								if (e.toString().indexOf('(RC)') + 1)
									return $parse(e.replace('(RC)', ''))(foundRate);
								return e;
							});

							vm.selectedGr.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
					}

			}
		}
	}

	function getFormList() {
		let id = false;

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...id.configs};
		} else
			confService.get(id, function (response) {
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
				calculateIncentive();
			});

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if (!id)
			return;

		if (typeof id === 'object') {
			if (id.configs)
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...id.configs};
		} else
			confService.get(id, function (response) {
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
				applyCss();
			});
	}

	function getRoute (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				resolve(slicer(res.data));
			}, function (err) {
				reject([]);
			});
		});
	}

	// function getRoute(viewValue, projection) {
	// 	if (viewValue.length < 3) return;
	// 	return new Promise(function (resolve, reject) {
    //
	// 		let request = {
	// 			_t: 'autosuggest',
	// 			[projection]: viewValue,
	// 			projection
	// 		};
    //
	// 		// if(vm.selectedGr.customer && vm.selectedGr.customer._id)
	// 		// 	request.customer = vm.selectedGr.customer && vm.selectedGr.customer._id;
    //
	// 		CustomerRateChartService.get(request)
	// 			.then((res) => {
	// 				resolve(res.data);
	// 			})
	// 			.catch(e => reject([]));
	// 	});
	// }

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				Vehicle.getNameTrim(viewValue, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	}

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

	function getMaterialGroup() {
		var materialFilter = {
			all: true
		};

		materialService.getMaterialGroups(materialFilter, success);

		function success(response) {
			vm.aMaterialGroup = response.data;
		}
	}

	function getTrip(tripNo) {
		function success(res) {
			vm.oTrip = res.data.data.data[0];
			vm.nonSelectedGr = {
				totalWeight: 0,
				totalQty: 0,
				freight: 0,
				totalFreight: 0,
			};
			vm.oTrip.gr.forEach((o, i) => {
				if (o._id === vm.selectedGr._id) {
					vm.oTrip.gr[i] = vm.selectedGr;
					return;
				}
				vm.nonSelectedGr.totalFreight += o.totalFreight;
				vm.nonSelectedGr.totalQty += o.invoices.reduce((a, c) => {
					vm.nonSelectedGr.freight += (c.freight || 0);
					vm.nonSelectedGr.totalWeight += (c.billingWeightPerUnit || 0);
					return a + (c.billingNoOfUnits || 0);
				}, 0);
			});
		}

		tripServices.getAllTripsWithPagination({
			_id: tripNo
		}, success);
	}

	function onCustomerSelect(customer) {
		//TODO remove below code
		//******************************************************

		if (customer.configs && customer.configs.GR && customer.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...customer.configs.GR.configs};
			vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...customer.configs.RATE_CHART.configs};
		} else
			vm.__FormList = $scope.$configs.GR.config;

		vm.selectedGr.billingParty = undefined;
		//******************************************************

		calculateIncentive();
		applyCss();
	}

	function onBillingPartySelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || vm.gstPercentToApply || '0';

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {

			// todo remove this code
			if (!Array.isArray($scope.$configs.client_allowed)) {
				$scope.logout();
			}

			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId == billingParty.clientId);

			if (user) {
				vm.selectedGr.billingParty.clientName = user.name;
				vm.gstPercentType = billingParty.state_code == user.state_code ? vm.aGstType[1] : vm.aGstType[0];
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}

		getGstType();

		//TODO remove below code
		//******************************************************

		if (billingParty.configs && billingParty.configs.GR && billingParty.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...billingParty.configs.GR.configs};
			// vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...billingParty.configs.RATE_CHART.configs};
		} else
			getFormList();
		//******************************************************

		applyCss();
	}

	function updateInvoiceMaterialObj(invoice, materialObj) {
		invoice.material = {
			groupName: materialObj.name,
			groupCode: materialObj.code,
			groupId: materialObj._id
		};
	}

	function SelectRateChart(selectedRowIndex) {

		if (!vm.selectedGr.invoices[selectedRowIndex].material.groupCode) {
			swal('warning', "Please Select Material", 'warning');
			return;
		}

		let modalInstance = $modal.open({
			templateUrl: 'views/myGR/addRateChartPopUp.html',
			controller: ['$uibModalInstance', '$timeout', 'otherData', 'lazyLoadFactory', addRateChartPopUpController],
			controllerAs: 'rcVm',
			resolve: {
				otherData: function () {
					return {
						selectedGr: vm.selectedGr,
						selectedInvoice: vm.selectedGr.invoices[selectedRowIndex],
						__RateChart: vm.__RateChartList
					};
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	function setPaymentBasis() {
		vm.selectedGr.invoices.forEach(oInv => {
			oInv.paymentBasis = vm.selectedGr.payment_basis || undefined;
		});
	}

	function getBranch() {
		if ($scope.$aBranch.length > 0) {
			vm.aBranch = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		};
		branchService.getAllBranches(branchFilter, successBranches);

		function successBranches(data) {
			vm.aBranch = data.data;
		}
	}

	function getAllBranch(inputModel) {
		let req = {
			no_of_docs: 10,
		};

		if (inputModel)
			req.name = inputModel;

		if (vm.aUserBranch && vm.aUserBranch.length) {
			req._ids = [];
			vm.aUserBranch.forEach(obj => {
				if (obj.write)
					req._ids.push(obj._id)
			});
			if (!(req._ids && req._ids.length)) {
				return
			} else {
				let flag = false;
				req._ids.forEach(obj => {
					if (vm.selectedGr.branch._id === obj) {
						flag = true;
					}
				});
				if (!flag)
					vm.selectedGr.branch = {};
				req._ids = JSON.stringify(req._ids);
			}
		}

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			if (vm.selectedGr.branch && vm.selectedGr.branch._id && !vm.aBranch.find(o => o._id === vm.selectedGr.branch._id))
				vm.aBranch.unshift(vm.selectedGr.branch);
		}
	}

	function setPodModelTime() {
		vm.loadingArrivalTimeModel && (vm.selectedGr.pod.loadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.loadingArrivalTime, vm.loadingArrivalTimeModel));
		vm.billingLoadingTimeModel && (vm.selectedGr.pod.billingLoadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingLoadingTime, vm.billingLoadingTimeModel));
		vm.unloadingArrivalTimeModel && (vm.selectedGr.pod.unloadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.unloadingArrivalTime, vm.unloadingArrivalTimeModel));
		vm.billingUnloadingTimeModel && (vm.selectedGr.pod.billingUnloadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingUnloadingTime, vm.billingUnloadingTimeModel));
	}

	function getSuppIncentive() {
		return new Promise(function (resolve, reject) {
			let obj = vm.selectedGr.invoices && vm.selectedGr.invoices[0];
			if (!obj.material || !obj.material.groupCode)
				return;

			let request = {};

			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
				request.source = vm.selectedGr.acknowledge.source;
			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
				request.destination = vm.selectedGr.acknowledge.destination;
			if (obj.material && obj.material.groupCode)
				request.materialGroupCode = obj.material.groupCode;
			if (vm.selectedGr.customer && vm.selectedGr.customer._id)
				request.customer = vm.selectedGr.customer._id;
			if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
				request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

			function onSuccess(res) {
				vm.newData = res.data || [];
				if (vm.newData.length) {
					vm.newData = vm.newData[0];
					if (vm.newData.incentive && vm.newData.incentive.rate) {

						switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
							case 'Master': {
								if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !vm.newData.incentive || !vm.newData.incentive.rate)
									return;

								// Handle failure response
								function onFailure(response) {
									console.log(response);
								}

								// Handle success response
								function onSuccess(response) {
									vm.selectedGr.supplementaryBill.incentivePercent = (response && response.data && response.data.rate) || 0;
									updateIncentive();
								}

								incentiveService.autosuggest({
									customer: vm.selectedGr.customer._id,
									vehicle: vm.selectedGr.vehicle,
									date: new Date(vm.selectedGr.grDate).toISOString(),
								}, onSuccess, onFailure);

								break;
							}

							default:

								switch (vm.newData.incentive.basis) {

									case 'Percent of basic freight':
										vm.selectedGr.supplementaryBill.incentivePercent = vm.newData.incentive.rate;
										updateIncentive();
										break;

									case 'Fixed':
										vm.selectedGr.supplementaryBill.charges.incentive = vm.newData.incentive.rate;
										break;

									default:
										if (typeof vm.selectedGr.supplementaryBill.incentivePercent != "number")
											return;

										let aExp = vm.__FormList.suppIncentive.evalExp.map(e => {
											if (e.toString().indexOf('(RC)') + 1)
												return $parse(e.replace('(RC)', ''))(vm.newData);
											return e;
										});

										vm.selectedGr.supplementaryBill.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
								}

						}
					}
				}
			}

			function onFailure(response) {
				console.log(response);
			}

			CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
		});
	}


	function updateIncentive(newVal) {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.supplementaryBill.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.supplementaryBill.charges.incentive = newVal * (vm.selectedGr.supplementaryBill.incentivePercent || 0) / 100;
		});

	}

	function clearSuppIncentive() {
		vm.selectedGr.supplementaryBill.charges.incentive = 0;
		vm.selectedGr.supplementaryBill.incentivePercent = 0;
	}


	function submit(formData) {

		// if (!vm.selectedGr.billingParty)
		// 	return swal('Error', 'Billing party is Mandatory', 'error');
		//
		// if(!vm.selectedGr.billingParty.state_code)
		// 	return swal('Error', 'State Code not defined for Billing party', 'error');

		// if (!vm.selectedGr.billingParty.percent)
		// 	return swal('Error', 'Tax Percent not defined for Billing party', 'error');

		if (vm.selectedGr.invoices.length) {

			if (vm.selectedGr.totalFreight < 0)
				return swal('Error', 'Total Freight should be grater than 0', 'error');
			let flag = false;
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(oInv => {
					if (oInv.paymentBasis !== vm.selectedGr.payment_basis)
						flag = true
				});
			}
			if (flag)
				return swal('Error', 'PaymentBasis should be same for all Item`s', 'error');
		}

		// Client wise validation
		if ((vm.__FormList.eWayBillNum.req || vm.__FormList.eWayBillExp.req) && !vm.selectedGr.container) {

			if (vm.selectedGr.eWayBills.length == 0)
				return swal('Error', 'E-WayBill Expiry and Number are Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].number)
				return swal('Error', 'E-WayBill Number is Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].expiry)
				return swal('Error', 'E-WayBill Expiry is Mandatory', 'error');

			if (vm.selectedGr.eWayBills[0].number) {
				// if (vm.selectedGr.eWayBills[0].number.length < 12)
				// 	return swal('Error', 'E-WayBill Number length should not be less than 12', 'error');
			}
		}
		// Validation END

		// if(!(vm.grNumberModel && vm.grNumberModel._id))
		// 	return swal('Error', 'invalid Gr Number.', 'error');

		console.log(formData);

		if (formData.$valid) {

			if (vm.selectedGr.totalFreight > ($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)) {

				return swal('Error', `Bill Amount is cannot be grater than ${($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)}`, 'error')

			} else if (vm.selectedGr.totalFreight > 300000) {
				swal({
						title: 'Bill Amount is Grater Than 3 Lakhs. Are you sure you want to continue?',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: 'rgb(94, 192, 222);',
						confirmButtonText: 'Yes!',
						closeOnConfirm: false
					},
					function (isConfirmU) {
						if (isConfirmU) {
							makeRequest();
						}
					});
			} else {
				makeRequest();
			}

			function makeRequest() {

				// setPodModelTime();

				let request = {
					...vm.selectedGr,
					gr_type: 'Own',
					//grDate: new Date(new Date(vm.selectedGr.grDate), 'DD/MM/YYYY'),
					grDate: new Date(vm.selectedGr.grDate.setHours(0, 0, 0, 0)),
					customer: vm.selectedGr.customer._id,
					consignor: vm.selectedGr.consignor && vm.selectedGr.consignor._id || undefined,
					consignee: vm.selectedGr.consignee && vm.selectedGr.consignee._id || undefined,
					billingParty: vm.selectedGr.billingParty && vm.selectedGr.billingParty._id || undefined,
					branch: vm.selectedGr.branch
				};

				if (typeof vm.grNumberModel == 'object') {
					request.grNumber = vm.grNumberModel.bookNo;
					request.stationaryId = vm.grNumberModel._id;
				} else {
					request.grNumber = vm.grNumberModel;
					request.stationaryId = undefined;
				}
				if(!request.stationaryId && $scope.$configs.GR && !$scope.$configs.GR.manualGr)
					return swal('Error', 'Invalid Gr Number', 'error');


				vm.selectedGr.invoices.forEach((invObj, index) => {
					if (typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
						request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
					if (typeof invObj.billingNoOfUnits === 'undefined' && invObj.noOfUnits)
						request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
					if (invObj.invoiceDate)
						request.invoices[index].invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
				});
				if (vm.mode === 'edit') {
					tripServices.updateGRservice(request, success, failure);
				}

				function success(res) {
					var message = res.data.message;
					swal('Update', message, 'success');
					$modalInstance.dismiss(res.data.data);
				}

				function failure(res) {
					swal('Error', res.data.message, 'error');
				}
			}

		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}

	function updateOnFreightChange() {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.charges.incentive = newVal * vm.incentivePercent / 100;
		});

	}
}


/////////////////////////////////////////////////
////////////////////// FILTER //////////////////
///////////////////////////////////////////////

materialAdmin.filter('getGrAssinedDate', function () {
	return function (input) {
		if (!input || typeof input !== 'object')
			return false;

		angular.forEach(input, function (obj) {
			if (obj.status == 'GR Assigned')
				return obj.date;
		});

		return false;
	};
});

materialAdmin.filter('currentStatusRemark', function () {
	return function (input) {
		if (!input || typeof input !== 'object')
			return false;

		let res;
		switch (input.status) {
			case 'Approved':
				res = input.approve && input.approve.remark;
				break;
			case 'Cancelled':
				res = input.cancel_remark;
				break;
			case 'Acknowledged':
				res = input.acknowledge && input.acknowledge.remark;
				break;
			default:
				res = 'NA';
		}

		return res;
	};
});

materialAdmin.filter('getGrNumber', function () {
	return function (input) {
		if (!input)
			return false;

		if (input[0].gr)
			return input.map(obj => obj.gr.grNumber).join(' ,');

	};
});

materialAdmin.filter('getTMNumber', function () {
	return function (input, ele, key1, key2,  returnFalseString) {
		let returnObj;

		if (Array.isArray(input) && ele && key1 && key2)
			returnObj = (input.map(obj => (obj[ele][key1] && obj[ele][key1][key2])) || []).filter( o => !!o).join(', ');
		else
			returnObj = typeof returnFalseString !== 'undefined' ? returnFalseString : 'NA';

		return returnObj;
	};
});

/*
* It Calculates the period for current Finincial Year
* */
materialAdmin.filter('periodFilter', function () {
	return function (input) {
		var year = (new Date()).getFullYear();
		if ((new Date()).getMonth() >= 3)
			year = year + '-' + (year += 1).toString().substr(2, 2);
		else
			year = year + '-' + (year -= 1).toString().substr(2, 2);
		return year;
	};
});

/*
* It Checks Settlement Status
* */
materialAdmin.filter('checkSettlementStatus', function () {
	return function (input) {

		if (!input)
			return false;

		if (input.grTotalAmount === (input.settledAmount + input.receivedAmount + input.deduction))
			return true;
		else
			return false;
	};
});

/*
* It Calculate received amount for bill settlement
* */
materialAdmin.filter('calReceivedAmt', function () {
	return function (input) {
		if (!input)
			return 0;
		let receivedAmount = 0;
		if (input.items && input.items[0] && input.items[0].gr && input.items[0].gr.grNumber)
			input.receiving && input.receiving.deduction.map(o => {
				try {
					receivedAmount += (o.amount || 0);
				} catch (e) {
				}
			});
		input.receiving && input.receiving.moneyReceipt && input.receiving.moneyReceipt.map(o => {
			try {
				receivedAmount += (o.amount || 0);
			} catch (e) {
			}
		});

		return receivedAmount;

	};
});

materialAdmin.filter('calculateReceivedAmount', function () {
	return function (input) {
		if (!input)
			return 0;
		let receivedAmount = 0;
		if (input.items && input.items[0] && input.items[0].gr && input.items[0].gr.grNumber)
			input.items.map(oGr => {

				let temp = (oGr.settlement || []).reduce((accumulator, currentValue) => {
					return accumulator + currentValue.amountReceived + (currentValue.otherAmountTotal || 0);
				}, 0);

				try {
					receivedAmount += (temp || 0);
				} catch (e) {
				}
			});

		return receivedAmount;

	};
});

materialAdmin.filter('calculateRemAmount', function () {
	return function (input) {
		if (!input)
			return 0;
		let remAmount = 0;
		if (input[0])
			input.map(rem => {

				if (rem.paymentType == 'Maintenance' || rem.paymentType === 'Spare' || rem.paymentType === 'Tyre' || rem.paymentType === 'FPA' || rem.paymentType === 'Diesel') {
					remAmount = rem.remAmt;
				}

			});

		return remAmount;

	};
});

/*
* It Calculate received amount for bill settlement
* */
materialAdmin.filter('calculateDieselEsc', function () {
	return function (input) {
		if (!input)
			return 0;
		input.gr.booking = input.gr.booking || {};
		let grn_qty = Math.min((input.l_net_w || input.gr.l_net_w || 0), (input.ul_net_w || input.gr.ul_net_w || 0));
		let actual_moisture = input.actual_moisture || 0;
		let estimated_moisture = input.estimated_moisture || 0;
		let normalized_qty = (actual_moisture > estimated_moisture) ? (grn_qty * (100 - actual_moisture)) / (100 - estimated_moisture) : grn_qty;

		let diesel_base_rate = 0;
		try {
			if (input.booking.contract_id.diesel_base_price)
				diesel_base_rate = input.booking.contract_id.diesel_base_price;
		} catch (e) {
			try {
				if (input.gr.booking.contract_id.diesel_base_price)
					diesel_base_rate = input.gr.booking.contract_id.diesel_base_price;
			} catch (e) {
			}
		}

		let aExpense = [];
		try {
			if (input.trip.trip_expenses)
				aExpense = input.trip.trip_expenses;
		} catch (e) {
			try {
				if (input.gr.trip.trip_expenses)
					aExpense = input.gr.trip.trip_expenses;
			} catch (e) {
			}

		}

		let total_diesel_ltr = calculateDieselByKey(aExpense, "Diesel", "diesel_info", "litre");
		let total_diesel_amt = calculateDieselByKey(aExpense, "Diesel", "amount");

		let increased_rate = Number.isFinite(total_diesel_amt / total_diesel_ltr) ? (total_diesel_amt / total_diesel_ltr) : 0;

		let percent_inc_in_diesel_rate = Number.isFinite(((increased_rate - diesel_base_rate) * 100) / diesel_base_rate) ? ((increased_rate - diesel_base_rate) * 100) / diesel_base_rate : 0;

		let pmtRate = input.rate;

		let formula = Number.isFinite(0.37 * (percent_inc_in_diesel_rate / 100) * pmtRate) ? 0.37 * (percent_inc_in_diesel_rate / 100) * pmtRate : 0;
		let esc_amount = (Number.isFinite(formula * normalized_qty)) ? formula * normalized_qty : 0;

		return parseFloat(esc_amount.toFixed(2));

		function calculateDieselByKey(aExpense, type, key1, key2) {
			return aExpense.reduce(function (x, c) {
					return x + ((c.type == type) ? (key1 && key2) ? c[key1][key2] : c[key1] : 0)
				}, 0
			)
		}
	};
});

