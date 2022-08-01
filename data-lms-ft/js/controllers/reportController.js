materialAdmin.controller('fpaReportController', fpaReportController);
materialAdmin.controller('purBillRptCtrl', purBillRptCtrl);
materialAdmin.controller('hirePaymentCtrl', hirePaymentCtrl);

fpaReportController.$inject = [
	'$modal',
	'accountingService',
	'fpaBillService',
	'DatePicker',
	'FleetService',
	'lazyLoadFactory',
	'Vendor',
	'billsService',
	'ReportService'
];
purBillRptCtrl.$inject = [
	'accountingService',
	'billsService',
	'DatePicker',
	'tripServices'
];
hirePaymentCtrl.$inject = [
	'accountingService',
	'branchService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'ReportService'
];

function hirePaymentCtrl(
	accountingService,
	branchService,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	ReportService
) {

	let vm = this;

	// function identifier
	vm.accountMaster = accountMaster;
	vm.downloadReport = downloadReport;
	vm.getAllBranch = getAllBranch;
	vm.DatePicker = angular.copy(DatePicker);

	// init
	(function init() {

		vm.oFilter = {};
		vm.lazyLoad = lazyLoadFactory();

	})();



	// Actual Function

	function downloadReport() {
		function reportSuccess(data) {
			if (data.data) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

			var oFilter = prepareFilter()
		tripServices.getHirePaymentReport(oFilter, reportSuccess);
	};

	function getAllBranch(viewValue) {
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

	function accountMaster(viewValue, aGroup) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {


				let req = {
					name: viewValue,
					no_of_docs: 15,
					sort: {
						name: 1
					}
				};
				if (aGroup)
					req.aGroup = aGroup;

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		} else
			return [];
	}



	function prepareFilter() {
		let filter = {dateType: 'vendorDeal.deal_at', ownershipType: 'Market'};


		if (vm.oFilter.from)
			filter.from = vm.oFilter.from;

		if (vm.oFilter.to)
			filter.to = vm.oFilter.to;

		if (vm.oFilter.branch)
			filter.branch = vm.oFilter.branch._id;
		if (vm.oFilter.ledger)
			filter.account = vm.oFilter.ledger._id;

		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();

		return filter;
	}

}

function fpaReportController(
	$modal,
	accountingService,
	fpaBillService,
	DatePicker,
	FleetService,
	lazyLoadFactory,
	Vendor,
	billsService,
	ReportService
) {

	let vm = this;

	// function identifier
	vm.getFpaBills = getFpaBills;
	vm.report = report;
	vm.getVendors = getVendors;
	vm.accountmaster = accountmaster;
	vm.onVendorSelect = onVendorSelect;
	vm.getFPAReport = getFPAReport;
	vm.getAllFleet = getAllFleet;
	vm.DatePicker = angular.copy(DatePicker);

	// init
	(function init() {

		vm.myFilter = {};
		vm.vendor = {};
		vm.netTot = 0;
		vm.fpaTot = 0;
		vm.vehicleTot = 0;
		vm.lazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: [
				'Type',
				'Bill No',
				'Bill Date',
				'Due Date',
				'Branch',
				'Vendor',
				'Customer',
				'Remark',
				'Created At',
			]
		};
		vm.tableHead = [
			{
				'header': 'Type',
				'bindingKeys': 'type'
			},
			{
				'header': 'Bill No',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Bill Date',
				'bindingKeys': 'billDate'
			},
			{
				'header': 'Due Date',
				'bindingKeys': 'dueDate'
			},
			{
				'header': 'Branch',
				'bindingKeys': 'branch.name'
			},
			{
				'header': 'Vendor',
				'bindingKeys': 'vendor.name'
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name'
			},
			{
				'header': 'Remark',
				'bindingKeys': 'remarks'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at',
				'date': 'dd-mm-yyyy'
			}
		];

		// getFpaBills();
		getAllFleet();

	})();

	function getFPAReport(isGetActive, isDownload) {

		if (vm.myFilter.start_date && vm.myFilter.end_date) {
			if(vm.myFilter.start_date>vm.myFilter.end_date) {
				return swal("warning", "End date should be greater than Start date", "warning");
			}
		}

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		if (isDownload) oFilter.download = isDownload;

		if (isDownload && typeof isDownload === 'string')
			oFilter.billType = isDownload;

		ReportService.getFPAReport(oFilter, function (res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
			} else if (res.data && res.data.data) {
				vm.netTot = 0;
				vm.fpaTot = 0;
				vm.vendor = {};
				res.data.data.forEach(obj => {
					vm.netTot += obj.totalFreight;
					vm.fpaTot += obj.fpaAmount;
					vm.vendor[obj.ledgers.lName] = vm.vendor[obj.ledgers.lName] || {};
					vm.vendor[obj.ledgers.lName].vhe = vm.vendor[obj.ledgers.lName].vhe || {};
					vm.vendor[obj.ledgers.lName].amount = vm.vendor[obj.ledgers.lName].amount || 0;
					vm.vendor[obj.ledgers.lName].freightAmount = vm.vendor[obj.ledgers.lName].freightAmount || 0;
					vm.vendor[obj.ledgers.lName].freightAmount += obj.totalFreight;
					vm.vendor[obj.ledgers.lName].amount += obj.fpaAmount;

					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no] = vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no] || {};
					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].amount = vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].amount || 0;
					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].freightAmount = vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].freightAmount || 0;
					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].freightAmount += obj.totalFreight;
					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].amount += obj.fpaAmount;

					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].gr = vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].gr || {};
					vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].gr[obj.grNumber] = vm.vendor[obj.ledgers.lName].vhe[obj.vehicle_no].gr[obj.grNumber] || obj;
				});

				console.log(vm.vendor);
			}
		}, (err) => {
			swal('', err.data.message, 'error');
		});
	}

	// Actual Function

	function getFpaBills(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		fpaBillService.get(oFilter, function (res) {
			if (res && res.data) {

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);

			}
		});
	}

	function prepareFilter() {
		let filter = {};

		if (vm.myFilter.billNo)
			filter.billNo = vm.myFilter.billNo;

		if (vm.myFilter.vehicle_no)
			filter.vehicle_no = vm.myFilter.vehicle_no;

		if (vm.myFilter.grNumber)
			filter.grNumber = vm.myFilter.grNumber;

		if (vm.myFilter.owner_group)
			filter.owner_group = vm.myFilter.owner_group;

		if (vm.myFilter.dateType)
			filter.dateType = vm.myFilter.dateType;

		if (vm.myFilter.refNo)
			filter.refNo = vm.myFilter.refNo;

		if (vm.myFilter.start_date)
			filter.from = moment(vm.myFilter.start_date, 'DD/MM/YYYY').startOf('day').toISOString();

		if (vm.myFilter.end_date)
			filter.to = moment(vm.myFilter.end_date, 'DD/MM/YYYY').startOf('day').toISOString();

		if (vm.myFilter.account)
			filter.account = vm.myFilter.account._id;

		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();

		return filter;
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({all: true}, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function report(type) {
		fpaBillService.report({repType: type, fpa: vm.aSelectedBills._id}, (d) => {
			var a = document.createElement('a');
			a.href = d.url;
			a.download = d.url;
			a.target = '_blank';
			a.click();
		}, () => {
		});
	}

	// Vendor
	function getVendors(viewValue) {
		return new Promise(function (resolve) {
			if (viewValue && viewValue.toString().length > 2) {
				Vendor.getName({
					name: viewValue,
					deleted: false,
					ownershipType: 'Associate'
				}, res => resolve(res.data && res.data.data), err => resolve([]));
			} else {
				resolve([]);
			}
		});
	}

	// Accounts
	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
					// group: 'Vendor'
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

	function onVendorSelect($item, $model, $label) {
		vm.vendor = $item._id;
	}

	function onAccountSelect($item, $model, $label) {
		vm.myFilter.account = $item._id;
	}

}

materialAdmin.controller("TripReportController", function ($rootScope, $scope, $uibModal, DateUtils, $state, tripServices, billsService, Vehicle, Routes, bookingServices, customer, Driver,) {
	$scope.aStatus = ["Incomplete Report", "Allocation Report", "Dispatch Report", "Trip Complete Report", "Trip Cancel Report"/*,"Idle Hour Report"*/, "Trip Profitability Report", "Trip Comparison Report","Trip Settlememt Summary Report"];
	var daysToSubtract = 7; // Days you want to subtract
	$scope.end_date = new Date(new Date().setHours(23, 59, 59));
	$scope.start_date = new Date($scope.end_date.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
	$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0));
	$scope.timediff = function (start, end) {
		if (start && end) {
			duration = moment.duration(moment(end).diff(moment(start)));
			hours = duration.asHours();
			return hours;
		} else {
			return 0;
		}
	}

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if (download) {
			myFilter.report_download = download;
		}
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
		if ($scope.tripCustomer && $scope.tripCustomer.name) {
			myFilter.customer = $scope.tripCustomer._id;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.route) {
			myFilter.route = $scope.route._id;
		}
		if ($scope.reportType) {
			myFilter.reportType = $scope.reportType;
		}
		if ($scope.branch) {
			myFilter.branch = $scope.branch;
		}
		if ($scope.start_date && !$scope.reportType === 'Trip Comparison Report') {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date && !$scope.reportType === 'Trip Comparison Report') {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		if($scope.rptType){
			myFilter.rptType = $scope.rptType;
		}
		if ($scope.tsNo){
			myFilter.tsNo = parseInt($scope.tsNo);
		}
		if ($scope.driver) {
			myFilter.driver = $scope.driver._id;
			// showCheckbox = true;
		}
		return myFilter;
	};

	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		if($scope.reportType === 'Trip Settlememt Summary Report'){
			// $scope.end_date = new Date(new Date($scope.end_date).setHours(23, 59, 59));
			var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 12); // select month based on selected start date
			$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
			$scope.mxDate = $scope.end_date;
			}else {
			var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 1); // select month based on selected start date
			$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
			$scope.mxDate = $scope.end_date;
			}

	};

	$scope.getDriver = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Driver.getName(viewValue, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}
	$scope.getAllTrip = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis)
		if (oFilter.reportType == "Idle Hour Report") {
			oFilter.idleHourReport = oFilter.reportType;
			oFilter.idleHourReport = "idletimereport";
			delete oFilter.reportType;
			tripServices.getTripIdleHourReport(oFilter, function (data) {
				if (data.data.data || downloadThis) {
					if (downloadThis) {
						var a = document.createElement('a');
						a.href = data.data.url;
						a.download = data.data.url;
						a.target = '_blank';
						a.click();
					} else {
						$scope.aTrip = data.data.data;
					}
				} else {
					$scope.aTrip = [];
					swal("warning", data.data.message, "warning");
				}
			});
		} else if (oFilter.reportType == "Dispatch Report") {
			oFilter.type = 'Dispatch';
			tripServices.getAllTripsReport(oFilter, function (data) {
				if (data.data.data || downloadThis) {
					if (downloadThis) {
						var a = document.createElement('a');
						a.href = data.data.url;
						a.download = data.data.url;
						a.target = '_blank';
						a.click();
					} else {
						$scope.aTrip = data.data.data;
					}
				} else {
					$scope.aTrip = [];
					swal("warning", data.data.message, "warning");
				}
			});
		}else if (oFilter.reportType === "Trip Profitability Report") {
			// oFilter.from = new Date(oFilter.start_date);
			// oFilter.to = new Date(oFilter.end_date);
			oFilter.download = true;
			tripServices.tripProfit(oFilter, function (data) {
				if ((data && data.data) || downloadThis) {
					if (downloadThis) {
						var a = document.createElement('a');
						a.href = data && data.data && data.data.url;
						a.download = data && data.data && data.data.url;
						a.target = '_blank';
						a.click();
					} else {
						$scope.aTrip = data && data.data;
					}
				} else {
					$scope.aTrip = [];
					swal("warning", data && data.message, "warning");
				}
			});
		}else if (oFilter.reportType === "Trip Comparison Report") {
			let today = new Date();
			today.setDate(today.getDate() - 1);
			oFilter.to = new Date(today);
			// oFilter.dateType = 'Trip started';

			tripServices.getTripCompReport(oFilter, function (res) {
				if(res.data.url) {
					var a = document.createElement('a');
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = '_blank';
					a.click();
				}else{
					swal('', res.data.message, 'success');
				}
			});
		}
		else if (oFilter.reportType === "Trip Settlememt Summary Report") {
			var oFilter = prepareFilterObject(downloadThis)
			oFilter.from = 	$scope.start_date.toISOString();
			oFilter.to = $scope.end_date.toISOString();
			oFilter.download = true;
			tripServices.getRtSummaryReport(oFilter, function (res) {
					if(res.data.url) {
							var a = document.createElement('a');
							a.href = res.data.url;
							a.download = res.data.url;
							a.target = '_blank';
							a.click();
					}else{
							swal('', res.data.message, 'success');
					}
			});
		}

		else {
			tripServices.getAllTripsReport(oFilter, function (data) {
				if (data.data.data || downloadThis) {
					if (downloadThis) {
						var a = document.createElement('a');
						a.href = data.data.url;
						a.download = data.data.url;
						a.target = '_blank';
						a.click();
					} else {
						$scope.aTrip = data.data.data;
					}
				} else {
					$scope.aTrip = [];
					swal("warning", data.data.message, "warning");
				}
			});
		}
	}
	//$scope.getAllTrip();

	/*$scope.getAllTrip = function() {
		function success(res) {
			if (res.data.data) {
				$scope.aTrip = res.data.data;
				$scope.report_download = res.data.url;
			}
		}
		var oFilter = prepareFilterObject();
		tripServices.getAllTripsReport(oFilter, success)
	};
	$scope.getAllTrip();*/

	$scope.clearSearch = function (val) {
		switch (val) {
			case "customer":
				$scope.tripCustomer = '';
				$scope.getCname($scope.tripCustomer);
				break;
			case "vehicle":
				$scope.vehicle_no = '';
				$scope.getCname($scope.vehicle_no);
				break;
			case "route":
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
				$scope.aCustomer = response.data.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCname(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {

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

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {

		}
	};

	$scope.onSelect = function ($item, $model, $label) {

	};

	/*$scope.getCustomer = function(){
	   function success(data) {
		  $scope.aCustomer = data.data;
		};
	   bookingServices.getAllCustomers(success);
	  };
	$scope.getCustomer();

	$scope.getAllVehiclesList = function(){

	function success(data) {
			$rootScope.aVehicles = data.data;
	  };

	var oFilter = {};
	Vehicle.getAllVehicles(oFilter,success);

	}
	$scope.getAllVehiclesList();

	$scope.getAllRoutes = function(){
		function success(data) {
			$scope.aRoute = data.data.data;
		};
		Routes.getAllRoutes({},success);
	}
	$scope.getAllRoutes();*/

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

materialAdmin.controller("UnbilledReportController", function ($rootScope, $scope, $uibModal, constants, bookingServices, Routes, DateUtils, Vehicle, $state, ReportService, customer) {
	$scope.aStatus = ["Incomplete Trip", "Unbilled Invoice", "All Invoice"];
	$scope.reportType = "Incomplete Trip";
	/*$scope.getCustomer = function(){
	   function success(data) {
		  $scope.aCustomer = data.data;
		};
	   bookingServices.getAllCustomers(success);
	};
	$scope.getCustomer();*/

	/*$scope.getAllVehiclesList = function(){
		function success(data) {
			$rootScope.aVehicles = data.data;
		};

		var oFilter = {all:true};
		Vehicle.getAllVehicles(oFilter,success);
	}
	$scope.getAllVehiclesList();*/

	/*$scope.getAllRoutes = function(){
		function success(data) {
			$scope.aRoute = data.data.data;
		};
		Routes.getAllRoutes({},success);
	}
	$scope.getAllRoutes();*/
	//--------------- ---------------------------------------------------------//
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

	$scope.clearSearch = function (val) {
		switch (val) {
			case "customer":
				$scope.customer = '';
				$scope.getCname($scope.customer);
				break;
			case "vehicle":
				$scope.vehicle_no = '';
				$scope.getCname($scope.vehicle_no);
				break;
			case "route":
				$scope.route = '';
				$scope.getDname($scope.route);
				break;
			default:
				break;
		}
	}

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCname(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {

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

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {

		}
	};

	$scope.onSelect = function ($item, $model, $label) {

	};

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if ($scope.reportType) {
			myFilter.reportType = $scope.reportType;
		}
		if ($scope.status) {
			myFilter.status = $scope.status.key;
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.trip_no) {
			myFilter.trip_no = $scope.trip_no;
		}
		if ($scope.boe_no) {
			myFilter.boe_no = $scope.boe_no;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.route) {
			myFilter.route_name = $scope.route.name;
		}
		if ($scope.customer) {
			myFilter.customer_id = $scope.customer._id;
		}
		return myFilter;
	}

	function prepareTripFilterObject(download) {
		var myFilter = {"all": "true", "trip_end": false};
		if (download) {
			myFilter.report_download = download;
		}
		if ($scope.trip_no) {
			myFilter.trip_no = $scope.trip_no;
		}

		if ($scope.customer && $scope.customer.name) {
			myFilter.customer_id = $scope.customer._id;
		}
		if ($scope.vehicle_no) {
			myFilter.vehicle_no = $scope.vehicle_no;
		}
		if ($scope.route) {
			myFilter.route_id = $scope.route._id;
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.reportType) {
			myFilter.reportType = $scope.reportType;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date;
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date;
		}
		return myFilter;
	};

	$scope.downloadReport = function (downloadThis) {
		function reportSuccess(data) {
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
				swal("warning", data.data.message, "warning");
			}
		}

		if ($scope.reportType === "Incomplete Trip") {
			var oFilter = prepareTripFilterObject(downloadThis)
			ReportService.getIncompleteTripReport(oFilter, reportSuccess);
		} else {
			var oFilter = prepareFilterObject(downloadThis)
			ReportService.getUnbillReport(oFilter, reportSuccess);
		}
	};
	//$scope.downloadReport();
});

materialAdmin.controller("RegVehicleReportController", function ($rootScope, $scope, $uibModal, DateUtils, Driver, $state, Vehicle) {
	$scope.own_vehicle = true;
	$scope.aVehStatus = [
		{
			key: "All",
			val: ""
		},
		{
			key: "Ontrip",
			val: "Booked"
		},
		{
			key: "Maintenance",
			val: "Maintenance"
		},
		{
			key: "Available",
			val: "Available"
		},
		{
			key: "Offtrip",
			val: ""
		}
	];
	$scope.aVehDriver = [
		{
			key: "All",
			val: ""
		},
		{
			key: "Driver",
			val: "true"
		},
		{
			key: "No Driver",
			val: "false"
		}
	];

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {

		}
	};

	$scope.whoseVehicle = function () {
		if ($scope.own_vehicle) {
			$scope.own_vehicle = true;
		} else {
			$scope.own_vehicle = false;
		}
		//$scope.getAllVehicles();
	}

	$scope.getAllDriverData = function () {
		function success(data) {
			$scope.aDrivers = data.data;
		}

		Driver.getAllDriversForDropdown({all: true}, success);
	}
	$scope.getAllDriverData();

	function prepareFilterObject(download) {
		var myFilter = {};
		if (download) {
			myFilter.all = true;
			myFilter.download = true;
		}
		myFilter.own = $scope.own_vehicle;
		if ($scope.vehicle_reg_no) {
			myFilter.vehicle_reg_no = JSON.stringify([$scope.vehicle_reg_no]);
		}
		if ($scope.driver123 && $scope.driver123.name) {
			myFilter.driver_name = $scope.driver123.name;
		}
		if ($scope.status) {
			myFilter.status = $scope.status;
		}
		if ($scope.driverStatus) {
			myFilter.driverAvl = $scope.driverStatus;
		}
		if ($scope.status == "") {
			myFilter.reportType = "Offtrip";
			myFilter.ne_status = "Booked";
		}
		myFilter.ne_category = "Trailer";
		return myFilter;
	};

	$scope.getAllVehicles = function () {
		function success(res) {
			if (res.data.data) {
				$scope.aVehicle = res.data.data;
				$scope.report_download = res.data.url;
			}
		}

		var oFilter = prepareFilterObject();
		Vehicle.getAllVehicleReport(oFilter, success)
	};
	$scope.downloadReport = function (downloadThis) {
		function reportSuccess(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

		var oFilter = prepareFilterObject(downloadThis);
		Vehicle.getAllVehicleReport(oFilter, reportSuccess)
	};

	$scope.downloadGroupReport = function () {
		function reportGroupSuccess(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

		Vehicle.getGroupReport({}, reportGroupSuccess)
	};
});

materialAdmin.controller("fleetOwnerReportController", function ($rootScope, $scope, $uibModal, DateUtils, $state, Vehicle) {
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

	/*$scope.dateChange = function () {
		var endDate;
		var startDate = $scope.start_date;
		endDate = moment(startDate).add(1,'week').format('YYYY-MM-DD');
		$scope.end_date = endDate;

		$scope.mxDate = endDate;

	};*/ // validation remove and code comment by order nipun

	$scope.setStartDate = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	};

	$scope.setEndDate = function () {
		$scope.end_date = new Date(new Date($scope.end_date).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	};

	function prepareFilterObject(download) {
		var myFilter = {};//TODO pagination
		if (download) {
			myFilter.all = true;
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}

		return myFilter;
	}

	$scope.getAllVehicles = function () {
		function success(res) {
			if (res.data.data) {
				$scope.aVehicle = res.data.data;
				if ($scope.aVehicle && $scope.aVehicle.owner_trips.length > 0) {
					for (var v = 0; v < $scope.aVehicle.owner_trips.length; v++) {
						$scope.aVehicle.owner_trips[v].group = $scope.aVehicle.owner_trips[v]._id || 'NA';
						$scope.aVehicle.owner_trips[v].allot_vehicle = $scope.aVehicle.owner_trips[v].count || 0;
						$scope.aVehicle.owner_trips[v].hsd_today = $scope.aVehicle.owner_trips[v].totalTodayTripDiesel || 0;
						$scope.aVehicle.owner_trips[v].hsd_cumulative = $scope.aVehicle.owner_trips[v].totalTripDiesel || 0;
						$scope.aVehicle.owner_trips[v].trip_today = $scope.aVehicle.owner_trips[v].aTodaysTrips.length || 0;
						$scope.aVehicle.owner_trips[v].trip_cumulative = $scope.aVehicle.owner_trips[v].aTrips.length;
						$scope.aVehicle.owner_trips[v].working_progress = ($scope.aVehicle.owner_trips[v].count > 0 && $scope.aVehicle.workingDays > 0) ? parseFloat(($scope.aVehicle.owner_trips[v].aTrips.length / ($scope.aVehicle.owner_trips[v].count * $scope.aVehicle.workingDays)).toFixed(2)) : 0;
						//$scope.aVehicle.owner_trips[v].average_hsd = $scope.aVehicle.owner_trips[v].aTrips.length;
						$scope.aVehicle.owner_trips[v].average_hsd = ($scope.aVehicle.owner_trips[v].aTrips.length > 0) ? parseFloat(($scope.aVehicle.owner_trips[v].totalTodayTripDiesel / $scope.aVehicle.owner_trips[v].aTrips.length).toFixed(2)) : 0;
						//$scope.aVehicle.owner_trips[v].average_trip = $scope.aVehicle.owner_trips[v].aTrips.length;
						$scope.aVehicle.owner_trips[v].average_trip = ($scope.aVehicle.workingDays > 0) ? parseFloat(($scope.aVehicle.owner_trips[v].aTrips.length / $scope.aVehicle.workingDays).toFixed(2)) : 0;
						//$scope.aVehicle.owner_trips[v].trip_per_vehicle = $scope.aVehicle.owner_trips[v].aTrips.length;
						$scope.aVehicle.owner_trips[v].trip_per_vehicle = ($scope.aVehicle.owner_trips[v].count > 0) ? parseFloat(($scope.aVehicle.owner_trips[v].aTrips.length / $scope.aVehicle.owner_trips[v].count).toFixed(2)) : 0;
						$scope.aVehicle.owner_trips[v].working_days = $scope.aVehicle.workingDays;
						$scope.aVehicle.owner_trips[v].report_status = 'recieved';
					}
				}
				$scope.report_download = res.data.url;
			}
		}

		var oFilter = prepareFilterObject();
		Vehicle.getFleetOwnerReport(oFilter, success)
	};

	$scope.downloadReport = function () {
		function reportGroupSuccess(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

		var oFilter = prepareFilterObject(true);
		Vehicle.getFleetOwnerReport(oFilter, reportGroupSuccess)
	};
});

materialAdmin.controller("dieselEscalationReportController", function ($rootScope, $scope, $uibModal, DateUtils, $state, customer, ReportService) {
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

	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 1); // select month based on selected start date
		$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
		$scope.mxDate = new Date(new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 2));
	};

	$scope.clearSearch = function (val) {
		switch (val) {
			case "customer":
				$scope.customer = '';
				$scope.getCname($scope.customer);
				break;
			default:
				break;
		}
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomer = response.data.data;
			}

			function oFailC(response) {
				console.log(response);
			}

			customer.getCname(viewValue, oSucC, oFailC);
		} else if (viewValue === '') {

		}
	};

	$scope.onSelect = function (item, modal, label) {
		if (item && item.name) {
			function success(data) {
				if (data.data) {
					$scope.aContracts = data.data;
					$scope.aDoNumbers = [];
					if ($scope.aContracts && $scope.aContracts.length > 0) {
						for (var d = 0; d < $scope.aContracts.length; d++) {
							if ($scope.aContracts[d].do_number) {
								$scope.aDoNumbers.push($scope.aContracts[d].do_number);
							}
						}
					}
				}
			}

			customer.getAllContractsOfCustomer({customer__id: item._id}, success);
		} else {

		}
	};


	function prepareFilterObject(download) {
		var myFilter = {};//TODO pagination
		if (download) {
			myFilter.all = true;
			myFilter.download = true;
		}
		if ($scope.customer) {
			myFilter.customer = $scope.customer._id;
			myFilter.customerName = $scope.customer.name;
		}
		if ($scope.do_number) {
			myFilter.do_number = $scope.do_number;
		}
		if ($scope.start_date) {
			myFilter.start_date = ($scope.start_date).toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = ($scope.end_date).toISOString();
		}

		return myFilter;
	}

	$scope.getDieselEscReport = function () {
		function success(res) {
			if (res.data.data) {
				$scope.dieselEscalationData = res.data.data;
				var aModiData = $scope.dieselEscalationData.aModifiedData;
				if (aModiData && aModiData.length > 0) {
					for (var d = 0; d < aModiData.length; d++) {
						aModiData[d].normalize_qty = (aModiData[d].total_grn_qty * (100 - aModiData[d].main_actual_moisture)) / (100 - aModiData[d].main_estimated_moisture);
						aModiData[d].increased_rate = (aModiData[d].total_diesel_value_amt / aModiData[d].total_diesel_value_ltr) ? (aModiData[d].total_diesel_value_amt / aModiData[d].total_diesel_value_ltr) : 0;
						aModiData[d].percent_inc_in_diesel_rate = (((aModiData[d].increased_rate - aModiData[d].base_rate) * 100) / aModiData[d].base_rate) ? ((aModiData[d].increased_rate - aModiData[d].base_rate) * 100) / aModiData[d].base_rate : 0;
						aModiData[d].formula = (0.37 * (aModiData[d].percent_inc_in_diesel_rate / 100) * aModiData[d].main_pmt_rate) ? (0.37 * (aModiData[d].percent_inc_in_diesel_rate / 100) * aModiData[d].main_pmt_rate) : 0;
						aModiData[d].esc_amount = (aModiData[d].formula * aModiData[d].normalize_qty) ? (aModiData[d].formula * aModiData[d].normalize_qty) : 0;
					}
				}
				$scope.report_download = res.data.url;
			}
		}

		var oFilter = prepareFilterObject();
		ReportService.getDieselEscalationReport(oFilter, success)
	};

	$scope.downloadReport = function () {
		function reportGroupSuccess(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

		var oFilter = prepareFilterObject(true);
		ReportService.getDieselEscalationReport(oFilter, reportGroupSuccess)
	};
});

materialAdmin.controller("doReportController", function ($rootScope, $scope, $uibModal, DateUtils, $state, customer, ReportService) {
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

	$scope.clearSearch = function (val) {
		switch (val) {
			case "customer":
				$scope.customer = '';
				$scope.getCname($scope.customer);
				break;
			default:
				break;
		}
	};
	$scope.date = new Date();

	$scope.setStartDate = function () {
		$scope.date = new Date($scope.date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date
	};

	function prepareFilterObject(download) {
		var myFilter = {};//TODO pagination
		if (download) {
			myFilter.all = true;
			myFilter.download = true;
		}
		if ($scope.date) {
			myFilter.date = ($scope.date).toISOString();
		}

		return myFilter;
	}

	$scope.getDoReport = function () {
		function success(res) {
			if (res.data.data) {
				$scope.aContracts = res.data.data;
				$scope.report_download = res.data.url;
			}
		}

		var oFilter = prepareFilterObject();
		ReportService.getDoReport(oFilter, success)
	};

	$scope.downloadReport = function () {
		function reportGroupSuccess(data) {
			if (data.data.url) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", data.data.message, "warning");
			}
		}

		var oFilter = prepareFilterObject(true);
		ReportService.getDoReport(oFilter, reportGroupSuccess)
	};

	function timediff(start, end) {
		if (start && end) {
			var duration = moment.duration(moment(end).diff(moment(start)));
			hours = duration.asHours();
			return hours;
		} else {
			return 0;
		}
	}

	$scope.daysLeft = function (dt) {
		return parseInt(timediff($scope.date, dt.contract_end_date) / 24);
	};

	$scope.qty = function (dt) {
		return parseFloat((dt.totalWeight - dt.totalQty) / $scope.daysLeft(dt)).toFixed(2)
	};

	$scope.trucks = function (dt) {
		if (dt.lastGr) {
			var capacity = dt.lastGr.trip.vehicle.capacity || dt.lastGr.trip.vehicle.veh_type.capacity;
			return Math.ceil($scope.qty(dt) / capacity);
		} else {
			return "Serving Not Started";
		}
	};

	$scope.progress = function (dt) {
		return parseFloat((dt.totalQty / dt.totalWeight) * 100).toFixed(2)
	};
});

materialAdmin.controller("bookingReportCntrl", function ($rootScope, $scope, $uibModal, DateUtils, $state, ReportService, customer) {
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
	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 1); // select month based on selected start date
		$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
		$scope.mxDate = $scope.end_date;
	};


	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if ($scope.report) {
			myFilter.aggregateBy = $scope.report;
		}
		if ($scope.bookingCustomer) {
			myFilter.bookingCustomer = $scope.bookingCustomer._id;
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		return myFilter;
	};


	$scope.getCname = function (viewValue) {
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
	};

	// $scope.getCname = function (viewValue) {
	// 	if (viewValue && viewValue.toString().length > 2) {
	// 		function oSucC(response) {
	// 			$scope.aCustomer = response.data.data;
	// 			console.log($scope.aCustomer);
	// 		};
	//
	// 		function oFailC(response) {
	// 			console.log(response);
	// 		}
	//
	// 		customer.getCname(viewValue, oSucC, oFailC);
	// 	} else if (viewValue == '') {
	//
	// 	}
	// 	;
	// };

	$scope.downloadReport = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis)
		ReportService.getBookingReport(oFilter, function (data) {
			if (data.data || downloadThis) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				} else {
					$scope.bookingReport = data.data;
				}
			} else {
				$scope.bookingReport = [];
				swal("warning", data.data.message, "warning");
			}
		});
	}
	//$scope.downloadReport();
});

function addRemarkController($scope, $uibModalInstance, lazyLoadFactory, DatePicker, otherData, ReportService, commonTableSettingFactory) {

	let vm = this;
	vm.closeModal 	= closeModal;
	vm.submit 		= submit;
	vm.aDL = [];
	vm.oLogs = angular.copy(otherData.aLogs);

	vm.lazyLoad = lazyLoadFactory();
	vm.commonTableSetting = commonTableSettingFactory;

	if (vm.oLogs.category == "Notification" && (vm.oLogs.refTo == "TripAdvances" || vm.oLogs.refTo == "TripSettle"))
		vm.oDeltaLog = JSON.parse(vm.oLogs.delta);
	//else
	//vm.oDeltaLog 	= {};

	(function init() {
		vm.selectType = 'index';


	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(){

		let oFilter = prepareFilterObject();

		ReportService.addRemarkLogsReport(oFilter, function (res) {
			if (res && res.data) {
				swal('Success', res.data.message, 'success');
				$uibModalInstance.close(res.data);
			} else {
				swal("warning", data.data.message, "warning");
				$uibModalInstance.close(res.data);
			}
		});
	}

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};

		if (download) {
			myFilter.download = true;
		}

		if ($scope.arVm.remark) {
			myFilter.remark = $scope.arVm.remark;
		}
		if ($scope.arVm.oLogs._id || ($scope.arVm.oLogs && $scope.arVm.oLogs.length>0)) {
			if($scope.arVm.oLogs && $scope.arVm.oLogs.length>0)
				myFilter._id = $scope.arVm.oLogs[0]._id;
			else
				myFilter._id = $scope.arVm.oLogs._id;
		}

		return myFilter;
	};

}
function viewDeltaController($scope, $uibModalInstance, lazyLoadFactory, DatePicker, otherData, commonTableSettingFactory) {

	let vm = this;
	vm.closeModal = closeModal;
	vm.aDL = [];
	vm.oLogs = angular.copy(otherData.aLogs);

	vm.lazyLoad = lazyLoadFactory();
	vm.commonTableSetting = commonTableSettingFactory;

	if (vm.oLogs.category == "Notification" && (vm.oLogs.refTo == "TripAdvances" || vm.oLogs.refTo == "TripSettle"))
		vm.oDeltaLog = JSON.parse(vm.oLogs.delta);
	//else
	//vm.oDeltaLog 	= {};

	(function init() {
		vm.selectType = 'index';
		if (vm.oLogs.category == "delete" && (vm.oLogs.refTo == "TripAdvances" || vm.oLogs.refTo == "tripadvances")) {
			vm.pageName = 'Booking_Management_TripAdv';
			vm.tableName = 'TripAdv';
			vm.tableColumnHead = getTableColumnHead(vm.pageName, vm.tableName);

			vm.columnSetting = {
				allowedColumn: vm.tableColumnHead.aAllowedColumn
			};

			vm.tableHead = vm.tableColumnHead.aTableHead;
			let isGetActive = true;
			setTimeout(function () {
				if (vm.oLogs.delta) {
					let oDL = JSON.parse(vm.oLogs.delta);
					vm.aDL = [oDL];
					vm.objData = {"data": vm.aDL};
					/*Object.keys(oDL).map(function(key){
					aDL.push({[key]:oDL[key]})
					return aDL;
				});*/
					//vm.aDL()
					vm.lazyLoad.putArrInScope.call(vm, isGetActive, vm.objData);
				}
			}, 1000);
		}

	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getTableColumnHead(pageName, tableName) {
		let obj = {};
		let aTableHead = [];
		let aAllowedColumn = [];
		let tableConf = vm.commonTableSetting;
		let oTableName = tableConf[pageName][tableName];
		let aColumn = tableConf[pageName][tableName + 'Column'];
		aColumn.forEach(function (key) {
			aTableHead.push(oTableName[key]);
			aAllowedColumn.push(oTableName[key].header);
		});

		obj.aTableHead = aTableHead;
		obj.aAllowedColumn = aAllowedColumn;
		return obj;
	}


}

materialAdmin.controller("logsReportCntrl", function (
	$scope,
	DatePicker,
	DateUtils,
	$uibModal,
	lazyLoadFactory,
	ReportService,
	commonTableSettingFactory,
) {

	let vm = this;
	//vm.prepareTable = prepareTable;
	vm.getLogsReport = getLogsReport;
	//vm.onTypeSelect = onTypeSelect;
	vm.dateChange = dateChange;
	vm.viewDelta = viewDelta;
	vm.addManagerRemark = addManagerRemark;

	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.aSelectedLogs = [];
		vm.oFilter = {};
		vm.aLogs = [];
		vm.selectType = 'index';

		vm.lazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: [
				'RefTo',
				'UIF',
				'Category',
				'User',
				'Log Date',
				'RT',
				'REF',
				'Delete Remark',
				'Added By',
				'Action Remark',
				'Action By',
				'Action Datetime',
				'Link'
			]
		};
		vm.tableHead = [

			{
				'header': 'RefTo',
				'bindingKeys': 'refTo',
				'date': false
			},

			{
				'header': 'UIF',
				'bindingKeys': 'uif',
				'date': false
			},

			{
				'header': 'Category',
				'bindingKeys': 'category',
			},
			{
				'header': 'User',
				'bindingKeys': 'user'
			},
			{
				'header': 'Log Date',
				'bindingKeys': 'time',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'RT',
				'bindingKeys': 'action.tsNo'
			},
			{
				'header': 'REF',
				'bindingKeys': 'action.refNo'
			},
			{
				'header': 'Delete Remark',
				'bindingKeys': 'deleteRemark'
			},
			{
				'header': 'Added By',
				'bindingKeys': 'action.addedUser'
			},
			{
				'header': 'Action Remark',
				'bindingKeys': 'action.remark'
			},
			{
				'header': 'Action By',
				'bindingKeys': 'action.remarkByUser'
			},
			{
				'header': 'Action Datetime',
				'bindingKeys': 'action.remarkDatetime',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Link',
				// 'bindingKeys': "dwnldLnk|trustAsHtml",
				html: true,
				filter: {
					name: 'trustAsHtml',
					aParam: ['dwnldLnk']
				}
				// "eval": true
			}
		];

		vm.onStateRefresh = function () {
			getLogsReport();
		};

	})();


	function dateChange(dateType) {

		if (dateType === 'from' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.to instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
				// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange === 3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if (monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.from);
				vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'to' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.from instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
				// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange === 3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if (monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.to);
				vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}


	function getLogsReport(isGetActive, download) {

		if (!(vm.oFilter.category)) {
			swal('Warning', 'Category is required', 'warning');
			return;
		}

		if (!(vm.oFilter.selectedRep) && (vm.oFilter.category != 'Expiry')) {
			swal('Warning', 'Select From is required', 'warning');
			return;
		}

		if(download){
			if(!vm.oFilter.from || !vm.oFilter.to){
				swal('Warning', 'From Date and To Date are requied', 'warning');
				return;
			}
		}

		if (vm.oFilter.from && vm.oFilter.to && vm.oFilter.from > vm.oFilter.to) {
			swal('Warning', 'From should be less than To Date', 'warning');
			return;
		}

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter(download);

		ReportService.getLogsReport(oFilter, function (res) {
			if (res && res.data) {
				if(!download)
					vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);
				else {
					var a = document.createElement('a');
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = '_blank';
					a.click();
				}
			}
		});

	}


	function addManagerRemark() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/report/addRemarkPopUp.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'lazyLoadFactory',
				'DatePicker',
				'otherData',
				'ReportService',
				'commonTableSettingFactory',
				addRemarkController
			],
			controllerAs: 'arVm',

			resolve: {
				otherData: function () {
					return {
						aLogs: vm.aSelectedLogs,
					};
				}
			}
		});

	}

	function viewDelta() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/report/viewDeltaPopUp.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'lazyLoadFactory',
				'DatePicker',
				'otherData',
				'commonTableSettingFactory',
				viewDeltaController
			],
			controllerAs: 'vdVm',

			resolve: {
				otherData: function () {
					return {
						aLogs: vm.aSelectedLogs,
					};
				}
			}
		});

	}

	function prepareFilter(download) {
		var myFilter = {};


		if (vm.oFilter.from) {
			myFilter.from = vm.oFilter.from.toISOString();
		}
		if (vm.oFilter.to) {
			myFilter.to = vm.oFilter.to.toISOString();
		}
		if (vm.oFilter.selectedRep) {
			myFilter.selectedRep = vm.oFilter.selectedRep;
		}
		if (vm.oFilter.refUIF) {
			myFilter.refUIF = vm.oFilter.refUIF;
		}
		if (vm.oFilter.dateType === 'docDate') {
			myFilter.dateType = 'docDate';
		}
		if (vm.oFilter.category) {
			myFilter.category = vm.oFilter.category;
		}
		if(vm.oFilter.category=== 'Expiry' && vm.oFilter.subCategory) {
			myFilter.subCategory = vm.oFilter.subCategory;
		}
		if(download){
			myFilter.download = download;
		}
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 10;

		return myFilter;
	}

});

materialAdmin.controller("billReportCtrl", function (
	$rootScope,
	$scope,
	$uibModal,
	DateUtils,
	$state,
	ReportService,
	billingPartyService,
	DatePicker,
	customer
) {

	$scope.DatePicker = DatePicker;

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if ($scope.report) {
			myFilter.aggregateBy = $scope.report;
		}
		if ($scope.reportType) {
			myFilter.reportType = $scope.reportType;
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.billingParty) {
			myFilter.billingParty = $scope.billingParty._id;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		if ($scope.customer) {
			myFilter.customer = $scope.customer._id;
		}
		return myFilter;
	}
	//////////////////////////////// for bill life cycle
	function prepareFilterObjectlifeCycle(download) {
		var myFilter = { };
		// if ($scope.settled) {
		// 	switch ($scope.settled) {
		// 		case 'SettledBill': {
		// 			myFilter.settled = true;
		// 			break;
		// 		}
		// 		case 'UnSettledBill': {
		// 			myFilter.settled = false;
		// 			break;
		// 		}
		// 	}
		// }
		if($scope.settled) {
			if($scope.settled === 'SettledBill') {
				myFilter.settled = true;
			} else if ($scope.settled === 'UnSettledBill') {
				myFilter.settled = false;
			}
		}
		if (download) {
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}

		return myFilter;
	}

	$scope.getCname = function (viewValue) {
		return new Promise((resolve, reject) => {
			if (viewValue && viewValue.toString().length > 2) {
				function oSucC(response) {
					resolve(response.data.data);
				}

				function oFailC(response) {
					resolve([]);
				}

				customer.getCname(viewValue, oSucC, oFailC);
			} else {
				resolve([]);
			}
		});
	};

	$scope.onSelect = function ($item) {
		$scope.customer = $item;
	};

	$scope.dateRange = function (dateType) {

		if (dateType === 'startDate' && $scope.end_date && $scope.start_date && ($scope.reportType === 'Advance Date wise amount report' || $scope.reportType === 'Advance Date wise count report')) {

			let isDate = $scope.end_date instanceof Date,
				monthRange = $scope.end_date.getMonth() - $scope.start_date.getMonth(),
				dateRange = $scope.end_date.getDate() - $scope.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.end_date.getFullYear() - $scope.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 2 && ($scope.start_date.getDate() < $scope.end_date.getDate()))
				isNotValid = true;
			else if (monthRange > 2)
				isNotValid = true;
			else if (monthRange === 1 || monthRange === 2)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.start_date);
				$scope.end_date = new Date(date.setMonth(date.getMonth() + 2));
			}

		} else if (dateType === 'endDate' && $scope.end_date && $scope.start_date && ($scope.reportType === 'Advance Date wise amount report' || $scope.reportType === 'Advance Date wise count report')) {

			let isDate = $scope.start_date instanceof Date,
				monthRange = $scope.end_date.getMonth() - $scope.start_date.getMonth(),
				dateRange = $scope.end_date.getDate() - $scope.start_date.getDate(),
				isNotValid = false;
			monthRange += ($scope.end_date.getFullYear() - $scope.start_date.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 2 && ($scope.start_date.getDate() < $scope.end_date.getDate()))
				isNotValid = true;
			else if (monthRange > 2)
				isNotValid = true;
			else if (monthRange === 1 || monthRange === 2)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.end_date);
				$scope.start_date = new Date(date.setMonth(date.getMonth() - 2));
			}
		}
	};

	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 1); // select month based on selected start date
		$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
		$scope.mxDate = $scope.end_date;
	};

	$scope.getBilling = function(viewValue) {
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

	$scope.downloadReport = function (downloadThis) {

		var oFilter = prepareFilterObject(downloadThis);

		if($scope.reportType === 'Bill Life Cycle Report') {
			 oFilter = prepareFilterObjectlifeCycle(downloadThis);
			ReportService.billLifeCycleReport(oFilter, onSuccess, onFailure);
		}
		else if ($scope.reportType === 'Bill Report')
			ReportService.getBillReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'OutStanding Report (Customer)')
			ReportService.outStandingRpt(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'OutStanding Monthly Report')
			ReportService.outStandingMonthlyRpt(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'Bill Ledger Transaction Report')
			ReportService.ledgerStandingMonthlyRpt(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'Billing Party Monthly Report')
			ReportService.getMonthlyReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'Billingparty Group Report')
			ReportService.getGroupReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'MR Deduction Report')
			ReportService.getMrDeductionReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'CN Deduction Report')
			ReportService.getCnDeductionReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'MR And CN Deduction Report')
			ReportService.getMrCnDeductionReport(oFilter, onSuccess, onFailure);
		else if ($scope.reportType === 'Monthly Deduction') {
			oFilter.from_date = oFilter.start_date;
			oFilter.to_date = oFilter.end_date;
			ReportService.getMonthlyDeductionReport(oFilter, onSuccess, onFailure);
		} else if ($scope.reportType === 'Billing Party Wise Deductions') {
			oFilter.from_date = oFilter.start_date;
			oFilter.to_date = oFilter.end_date;
			ReportService.getBPDeductionReport(oFilter, onSuccess, onFailure);
		} else if ($scope.reportType === 'Advance Date wise amount report' || $scope.reportType === 'Advance Date wise count report') {
			oFilter.advanceType = {$nin: ["Vendor Advance", "Vendor Diesel", "Vendor Balance"]};
			oFilter.from = new Date(oFilter.start_date);
			oFilter.to = new Date(oFilter.end_date);
			ReportService.tripAdvDateRpt(oFilter, onSuccess, onFailure);
		}
			else if ($scope.reportType === 'GST Sales') {
			oFilter.gstSales = true;
			// oFilter.from = new Date(oFilter.start_date);
			// oFilter.to = new Date(oFilter.end_date);
			ReportService.gstSales(oFilter, onSuccess, onFailure);
		}
		else if ($scope.reportType === 'CN Wise Outstanding Report') {
			ReportService.cnWiseOutstandingRept(oFilter, onSuccess, onFailure);
		}

		function onSuccess(response) {
			if (response.data || downloadThis) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = response.data.url;
					a.download = response.data.url;
					a.target = '_blank';
					a.click();
				} else {
					$scope.billReport = response.data;
				}
			} else {
				$scope.billReport = [];
				swal("warning", response.data.message, "warning");
			}
		}

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}
	};
	//$scope.downloadReport();
});

materialAdmin.controller("grReportCntrl", function (
	$rootScope,
	$scope, $uibModal,
	DatePicker,
	DateUtils,
	$state,
	ReportService,
	tripServices,
	billingPartyService,
	customer
) {

	$scope.DatePicker = angular.copy(DatePicker);
	$scope.aBill = ["Billed", "Un billed"];
	$scope.aPod = ["Received", "Not Received"];
	$scope.aAcknowledged = ["Acknowledged", "Not Acknowledged"];
	$scope.oFilter = {};
	$scope.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
	if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
		Array.prototype.push.apply($scope.aCategory, $scope.$configs.customer.category);
	}

	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 2); // select month based on selected start date
		$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	};

	$scope.onTypeSelect = function (type) {

		if (type === 'grReportCron' || type === 'LoadingRpt')
			$scope.showFilters = true;
		else
			$scope.showFilters = false;

		if (type === 'BilledRpt' || type === 'UnbilledRpt' || type === 'LoadingRpt' || type === 'grReportCron' || type === 'UnbilledSumm') {
			$scope.hideFilter = true;
		} else
			$scope.hideFilter = false;
	}

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if ($scope.report) {
			myFilter.aggregateBy = $scope.report;
		}

		if (download) {
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		if ($scope.bill) {
			if ($scope.bill == 'Billed') {
				myFilter.bill = JSON.stringify({$exists: true});
			} else if ($scope.bill == 'Un billed') {
				myFilter.bill = JSON.stringify({$exists: false});
			}
		}
		if ($scope.received == 'Not Received')
			myFilter["pod.received"] = false;
		else if ($scope.received == 'Received')
			myFilter["pod.received"] = true;

		if ($scope.acknowledge == 'Acknowledged')
			myFilter["acknowledge.status"] = true;
		else if ($scope.acknowledge == 'Not Acknowledged')
			myFilter["acknowledge.status"] = false;

		if ($scope.status) {
			myFilter.status = $scope.status;
		}
		if ($scope.dateKey) {
			myFilter.dateKey = $scope.dateKey;
		}

		if ($scope.aBillParty && $scope.aBillParty.length) {
			myFilter.aBillingPartyDetail = [];
			$scope.aBillParty.map((v) => {
				myFilter.aBillingPartyDetail.push(v._id);
			});
		}

		if ($scope.aCstDetail && $scope.aCstDetail.length) {
			myFilter.aCustomerDetail = [];
			$scope.aCstDetail.map((v) => {
				myFilter.aCustomerDetail.push(v._id);
			});
		}

		if ($scope.billingParty) {
			myFilter["billingParty._id"] = $scope.billingParty._id;
		}
		if ($scope.category) {
			myFilter['customer.category'] = $scope.category;
		}

		if ($scope.customer) {
			myFilter.customer = $scope.customer._id;
		}

		if ($scope.oFilter.bPclientId) {
			myFilter.bPclientId = $scope.oFilter.bPclientId;
		}

		return myFilter;
	}

	$scope.onBillingPartySelect = function (item) {
		$scope.aBillParty = $scope.aBillParty || [];
		$scope.aBillParty.push(item);
		$scope.billingPartyBilled = '';
	}

	$scope.removeBillingParty = function (select, index) {
		$scope.aBillParty.splice(index, 1);
	}

	$scope.onCustomerSelect = function (item) {
		$scope.aCstDetail = $scope.aCstDetail || [];
		$scope.aCstDetail.push(item);
		$scope.customerBilled = '';
	}

	$scope.removeCustomerDetail = function (select, index) {
		$scope.aCstDetail.splice(index, 1);
	}

	function prepareFilterObjectCron(download) {
		var myFilter = {"all": "true"};
		if ($scope.report) {
			myFilter.aggregateBy = $scope.report;
		}

		if (download) {
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.from = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			//myFilter.to = $scope.end_date.toISOString();
			myFilter.to = new Date(new Date($scope.end_date).setHours(23, 59, 59)).toISOString();
		}
		if ($scope.dateKey) {
			myFilter.dateType = $scope.dateKey;
		}

		if ($scope.category) {
			myFilter['customer.category'] = $scope.category;
		}

		if ($scope.asOnDate) {
			//myFilter.asOnDate = $scope.asOnDate.toISOString();
			myFilter.asOnDate = new Date(new Date($scope.asOnDate).setHours(23, 59, 59)).toISOString();
		}

		if ($scope.billingParty) {
			myFilter["billingParty._id"] = $scope.billingParty._id;
		}
		if ($scope.customer) {
			myFilter.customer = $scope.customer._id;
		}
		if ($scope.oFilter.bPclientId) {
			myFilter['billingParty.clientId'] = $scope.oFilter.bPclientId;
		}

		myFilter.sort = {grNumber: 1};

		return myFilter;
	}

	$scope.getBilling = function (viewValue) {
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
	};

	$scope.getCustomer = function (viewValue) {
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
	};

	$scope.downloadReport = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis);

		// if ($scope.report === 'BilledRpt') {
		// 	oFilter.reportType = 'Billed Monthly Report';
		// 	ReportService.getGrMonthlyReport(oFilter, success, failure);
		// } else
		if ($scope.report === 'UnbilledRpt') {
			oFilter.reportType = 'Unbilled Monthly Report';
			ReportService.getGrMonthlyReport(oFilter, success, failure);
		}else if ($scope.report === 'UnbilledSumm') {
			oFilter.reportType = 'Unbilled Summary Report';
			ReportService.getUnbilledSummReport(oFilter, success, failure);
		} else if ($scope.report === 'LoadingRpt') {
			oFilter.reportType = 'Loading Monthly Report';
			ReportService.getGrMonthlyReport(oFilter, success, failure);
		} else if ($scope.report === 'grReportCron') {
			let oFilterCron = prepareFilterObjectCron(downloadThis);
			if (!$scope.asOnDate) {
				return swal("warning", "As On Date is required", "warning");
			}
			oFilterCron.reportType = 'Unbilled grs as on date';
			tripServices.yetAnotherGRReportCron(oFilterCron).then(data => {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			});
		} else {
			ReportService.getGrBookingReport(oFilter, success, failure);
		}

		function success(res) {
			if (res.data || downloadThis) {
				var a = document.createElement('a');
				a.href = res.data.url || res.data && res.data.data && res.data.data.url;
				a.download = res.data.url || res.data && res.data.data && res.data.data.url;
				a.target = '_blank';
				a.click();
			} else {
				swal("warning", res.data.message, "warning");
			}
		}

		function failure(res) {
			console.log('fail: ', res);
			swal('Some error with GET GRs.', res.toString(), 'error');
		}
	}
	// $scope.downloadReport();
});

materialAdmin.controller("tripPerformanceReportCntrl", function (
	$scope,
	$state,
	$uibModal,
	DatePicker,
	DateUtils,
	FleetService,
	lazyLoadFactory,
	ReportService,
	tripServices,
	Vehicle,
	Driver
) {

	let vm = this;
	vm.prepareTable = prepareTable;
	vm.getAllReport = getAllReport;
	vm.onTypeSelect = onTypeSelect;
	vm.getVname = getVname;
	vm.getDriver = getDriver;

	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory();
		vm.aggrs = ['Trip Detail', 'Loaded Trip'];
		vm.selectType = 'index';
		vm.oFilter = {};
		vm.columnSetting = {};
		vm.CONFIGS = $scope.$constants.aReportTypeConfig;
		prepareTable();
		getAllFleet();
		// console.log($scope.$role["Trip Performance Report"]);
	})();

	function getVname(viewValue) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		});
	}

	function getDriver(v) {
		if (v.length > 2) {
			return new Promise(function (resolve, reject) {
				Driver.getName(v, function (d) {
					resolve(d.data.data);
				}, function (e) {
					resolve([]);
				});
			});
		}
	};

	function onTypeSelect() {
		vm.reportConfig = vm.CONFIGS[vm.reportType]['tableHeader'];
		vm.oFilter = {};
		vm.oFilter.to = new Date();
		vm.oFilter.from = new Date(new Date().setDate(new Date(vm.oFilter.to).getDate() - 30));
		prepareTable();

	}

	function prepareTable() {
		vm.tableHead = [];
		vm.allowedColumn = [];
		for (let i in vm.reportConfig) {
			if (vm.reportConfig.hasOwnProperty(i)) {
				vm.tableHead.push({
					header: vm.reportConfig[i].name,
					bindingKeys: vm.reportConfig[i].key,
					date: vm.reportConfig[i].date
				});
				vm.allowedColumn.push(vm.reportConfig[i].name);
			}
		}
		vm.columnSetting = {allowedColumn: vm.allowedColumn};
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({all: true}, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function getAllReport(isGetActive, download = false) {

		if(!(vm.oFilter.from && vm.oFilter.to))
			return swal('Error', 'From and To Date are required', 'error');

		let allowedTime = ['3', 'month'];
		if(vm.reportType === 'RTP New' || vm.reportType === 'RTP Expense New' || vm.reportType ==='Monthly Performance'){
			allowedTime = ['1', 'year'];
		}

		if(moment(vm.oFilter.to).isAfter(moment(vm.oFilter.from).add(...allowedTime)))
			return swal('Error', `Max Allowed Time frame for "${vm.reportType}" Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

		let oFilter = prepareFilter(download);
		if(!(vm.CONFIGS[vm.reportType]['api'].name))
			return ;

		vm.api = vm.CONFIGS[vm.reportType]['api'].name;
		if(vm.reportType ==='Job Order Report' || vm.reportType ==='Job Order Risky Report' || vm.reportType ==='Job Order Power Report'){

		}else {
			oFilter['category'] = "Loaded";
		}
		if(vm.reportType ==='Monthly Performance')
			oFilter.dateType = 'Trip started';

		ReportService[vm.api](oFilter, success);

		function success(res) {
			vm.summaryConfig = vm.CONFIGS[vm.reportType]['summary'];
			if (download && res.data.url) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
				return;
			} else if (res && res.data && res.data.data) {
				vm.summary = res.data.data.summary;
				if(vm.reportType ==='Job Order Report' || vm.reportType ==='Job Order Risky Report' || vm.reportType ==='Job Order Power Report'){
					res = res.data;
				}else {
					res = res.data.data;
				}
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}else{
				swal('', res.data.message, 'success');
			}
		}
	}



	function prepareFilter(download) {
		var myFilter = {};

		if (vm.reportType == 'DLP')
			myFilter.rpType = 'dlp';

		if (vm.reportType == 'DUP')
			myFilter.rpType = 'dup';
		if (vm.reportType === 'RTP Expense') {
			myFilter.report_category = "RTPExpense";
		}
		if (vm.reportType === 'Detail RTP') {
			myFilter.report_category = "Performance";
			if (vm.oFilter.aggregateBy === 'Trip Detail')
				myFilter.showTrips = true;
			if (vm.oFilter.aggregateBy === 'Loaded Trip') {
				myFilter.category = 'Empty';
				myFilter.showTrips = true;
				myFilter.trip = "Loaded";
			}
		}
		if (vm.oFilter.from && vm.reportType !== 'Last Settle RT Report') {
			myFilter.from = vm.oFilter.from.toISOString();
		}
		if (vm.oFilter.to && vm.reportType !== 'Last Settle RT Report') {
			myFilter.to = vm.oFilter.to.toISOString();
		}
		if (vm.oFilter.segment_type) {
			myFilter.segment_type = vm.oFilter.segment_type;
		}
		if (vm.oFilter.owner_group) {
			myFilter.owner_group = vm.oFilter.owner_group;
		}
		if (vm.oFilter.tsNo) {
			myFilter['advSettled.tsNo'] = vm.oFilter.tsNo;
		}
		if (vm.oFilter.vehicle) {
			myFilter['vehicle'] = vm.oFilter.vehicle._id;
			myFilter.vehicle_no = vm.oFilter.vehicle.vehicle_reg_no;
		}
		if (vm.oFilter.driver) {
			myFilter['driver'] = vm.oFilter.driver._id;
		}
		if (vm.oFilter.by) {
			myFilter['by'] = vm.oFilter.by;
		}
		if (vm.oFilter.mSettle)
			myFilter['mSettle'] = vm.oFilter.mSettle === 'Yes' ? true : false;

		if (download) {
			myFilter.download = true;
			if(vm.oFilter.tsNo)
				myFilter.rtNo = vm.oFilter.tsNo;
		}
		return myFilter;
	}

});


materialAdmin.controller("settlementReportCntrl", function (
	$scope,
	$state,
	$uibModal,
	DatePicker,
	DateUtils,
	FleetService,
	lazyLoadFactory,
	ReportService,
	tripServices,
	Vehicle
) {

	let vm = this;
	vm.prepareTable = prepareTable;
	vm.getAllReport = getAllReport;
	vm.onTypeSelect = onTypeSelect;
	vm.dateChange = dateChange;
	vm.getVname = getVname;

	(function init() {
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory();
		vm.aggrs = ['Trip Detail', 'Loaded Trip'];
		vm.selectType = 'index';
		vm.oFilter = {};
		vm.columnSetting = {};
		vm.CONFIGS = $scope.$constRTPants.aReportTypeConfig;
		prepareTable();
		getAllFleet();
	})();

	function getVname(viewValue) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		});
	}

	function dateChange(dateType) {

		if (dateType === 'from' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.to instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
				// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange === 3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if (monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.from);
				vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'to' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.from instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
				// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange === 3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if (monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.to);
				vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	function onTypeSelect() {
		vm.reportConfig = vm.CONFIGS[vm.reportType]['tableHeader'];
		vm.oFilter = {};
		vm.oFilter.to = new Date();
		vm.oFilter.from = new Date(new Date().setDate(new Date(vm.oFilter.to).getDate() - 30));
		prepareTable();

	}

	function prepareTable() {
		vm.tableHead = [];
		vm.allowedColumn = [];
		for (let i in vm.reportConfig) {
			if (vm.reportConfig.hasOwnProperty(i)) {
				vm.tableHead.push({
					header: vm.reportConfig[i].name,
					bindingKeys: vm.reportConfig[i].key,
					date: vm.reportConfig[i].date
				});
				vm.allowedColumn.push(vm.reportConfig[i].name);
			}
		}
		vm.columnSetting = {allowedColumn: vm.allowedColumn};
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({all: true}, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function getAllReport(isGetActive, download = false) {

		let oFilter = prepareFilter(download);
	    if(!CONFIGS[vm.reportType] && CONFIGS[vm.reportType]['api'])
	    	return ;

		vm.api = vm.CONFIGS[vm.reportType]['api'].name;

		ReportService[vm.api](oFilter, success);

		function success(res) {
			vm.summaryConfig = vm.CONFIGS[vm.reportType]['summary'];
			if (download) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
				return;
			} else if (res && res.data) {
				vm.summary = res.data.data.summary;
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		}
	}


	function prepareFilter(download) {
		var myFilter = {};

		// if (vm.reportType == 'DLP')
		// 	myFilter.rpType = 'dlp';
		//
		// if (vm.reportType == 'DUP')
		// 	myFilter.rpType = 'dup';
		// if (vm.reportType === 'RTP Expense') {
		// 	myFilter.report_category = "RTPExpense";
		// }
		// if (vm.reportType === 'Detail RTP') {
		// 	myFilter.report_category = "Performance";
		// 	if (vm.oFilter.aggregateBy === 'Trip Detail')
		// 		myFilter.showTrips = true;
		// 	if (vm.oFilter.aggregateBy === 'Loaded Trip') {
		// 		myFilter.category = 'Empty';
		// 		myFilter.showTrips = true;
		// 	}
		// }
		if (vm.oFilter.from) {
			myFilter.from = vm.oFilter.from.toISOString();
		}
		if (vm.oFilter.to) {
			myFilter.to = vm.oFilter.to.toISOString();
		}
		if (vm.oFilter.segment_type) {
			myFilter.segment_type = vm.oFilter.segment_type;
		}
		if (vm.oFilter.owner_group) {
			myFilter.owner_group = vm.oFilter.owner_group;
		}
		if (vm.oFilter.tsNo) {
			myFilter['advSettled.tsNo'] = vm.oFilter.tsNo;
		}
		if (vm.oFilter.vehicle) {
			myFilter['vehicle'] = vm.oFilter.vehicle._id;
			myFilter.vehicle_no = vm.oFilter.vehicle.vehicle_reg_no;
		}
		if (download) {
			myFilter.download = true;
			myFilter.rtNo = vm.oFilter.tsNo;
		}
		return myFilter;
	}

});

materialAdmin.controller("profitReportGRCtrl", function ($rootScope, $scope, constants, $uibModal, DateUtils, $state, bookingServices, ReportService, customer) {
	$scope.report = constants.aBillDispatchReportTypes[3];
	$scope.status = constants.aBillingRegister[1];
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

	$scope.dateChange = function () {
		$scope.start_date = new Date($scope.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.start_date).setMonth($scope.start_date.getMonth() + 1); // select month based on selected start date
		$scope.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
		$scope.mxDate = $scope.end_date;

	};

	/*$scope.getCustomer = function() {
        function success(data) {
            $scope.aCustomers = data.data;
        }
        bookingServices.getAllCustomers(success);
    };
    $scope.getCustomer();*/

	$scope.clearSearch = function (val) {
		switch (val) {
			case "customer":
				$scope.search_customer = '';
				$scope.getCname($scope.search_customer);
				break;
			case "billingParty":
				$scope.search_billParty = '';
				$scope.getCname($scope.search_billParty);
				break;
			case "route":
				$scope.search_route = '';
				$scope.getDname($scope.search_route);
				break;
			default:
				break;
		}
	};

	$scope.getCname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			function oSucC(response) {
				$scope.aCustomers = response.data.data;
			};

			function oFailC(response) {
				console.log(response);
			}

			customer.getCname(viewValue, oSucC, oFailC);
		} else if (viewValue == '') {

		}
		;
	};


	$scope.onSelect = function ($item, $model, $label) {

	};

	function prepareFilterObject(download) {
		var myFilter = {"all": "true"};
		if (download) {
			myFilter.download = true;
		}
		if ($scope.start_date) {
			myFilter.start_date = $scope.start_date.toISOString();
		}
		if ($scope.end_date) {
			myFilter.end_date = $scope.end_date.toISOString();
		}
		/*if($scope.report){
			myFilter.reportType = $scope.report;
		}
		if($scope.status){
			myFilter.status = $scope.status.key;
			if(myFilter.status == "all"){
				delete myFilter.status;
			}
		}
		if($scope.search_billParty){
			myFilter.billing_party_id = $scope.search_billParty._id;
		}
		if($scope.search_customer){
			myFilter.customer_id = $scope.search_customer._id;
		}*/

		return myFilter;
	};

	$scope.downloadProfitReportGR = function (downloadThis) {
		var oFilter = prepareFilterObject(downloadThis);
		ReportService.downloadProfitReportGR(oFilter, function (data) {
			if (data.data.value || data.data.url) {
				if (downloadThis) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				} else {
					$scope.tripProfitList = data.data.value;
					console.log($scope.tripProfitList);
				}
			} else {
				$scope.tripProfitList = [];
				swal("warning", data.data.message, "warning");
			}
		});
	};

});

function purBillRptCtrl(
	accountingService,
	billsService,
	DatePicker,
	tripServices
) {
	let vm = this;

	vm.addTag = addTag;
	vm.download = download;
	vm.getAccount = getAccount;
	vm.removeTag = removeTag;
	vm.resetFilter = resetFilter;
	vm.dateChange = dateChange;

	(function init() {
		vm.aReportType = [{
			key: 'diesel',
			value: 'Billed Diesel(Amt)'
		}, {
			key: 'dieselLtr',
			value: 'Billed Diesel(Ltr)'
		}, {
			key: 'combineDieselDaywise',
			value: 'Combine Diesel(Amt) Daywise'
		}, {
			key: 'combineDiesel',
			value: 'Combine Diesel(Amt) Monthwise'
		}, {
			key: 'combineDieselLtrDaywise',
			value: 'Combine Diesel(Ltr) Daywise'
		}, {
			key: 'combineDieselLtr',
			value: 'Combine Diesel(Ltr) Monthwise'
		},{
			key: 'unsettledTripAdvance',
			value: 'Trip Advance Settlement'
		}];

		vm.aTripType = [{
			key: 'onTrip',
			value: 'On Trip'
		}, {
			key: 'withoutTrip',
			value: 'Without Trip'
		}];

		vm.aFuelCompany = ["Bio Diesel", "BPCL", "Essar", "HPCL", "IOCL", "RIL"];

		vm.report = vm.aReportType[0].key;
		vm.DatePicker = DatePicker;
		resetFilter();

	})();


	// function definition

	function addTag(from, oTag) {
		vm.oFilter[from].push(oTag);
	}

	function removeTag(from, index = -1) {
		vm[from].splice(index, 1);
	}

	function resetFilter() {
		vm.oFilter = {
			aAccountTag: [],
			aGroupTag: []
		};
	}

	function getAccount(name = '', aGroup = false) {
		if (name.length < 3) return [];

		return new Promise(function (resolve, reject) {
			let req = {
				name,
				no_of_docs: 10
			};

			if (aGroup) {
				req.isGroup = !!aGroup;
				aGroup.length && (req.group = aGroup);
			}

			accountingService.getAccountMaster(req, res => {
				resolve(res.data.data);
			}, err => {
				console.log`${err}`;
				reject([]);
			});

		});
	}

	function download(download = false) {
		let req = prepareFilter(download),
			msg = false;

		if (msg = isValid())
			return swal('Error', msg, 'error');

		if (vm.report == 'unsettledTripAdvance') {
			let d = '';
			req.sort = 'date';
			tripServices.downloadTripAdvances({downloadType: d}, req, function (response) {
				var a = document.createElement('a');
				a.href = response.data.url;
				a.download = response.data.url;
				a.target = '_blank';
				a.click();
			});
		} else {
			billsService.reportDownload(req, function (res) {
				if (download) {
					let a = document.createElement('a');
					a.href = res.url;
					a.download = res.url;
					a.target = '_blank';
					a.click();
				}
			});
		}
	}

	function isValid() {
		if (!vm.oFilter.from)
			return 'From is Mandatory';

		if (!vm.oFilter.to)
			return 'To is Mandatory';
	}

	function prepareFilter(download) {
		let oFilter = {};
		if (vm.report != 'unsettledTripAdvance') {
			oFilter = {
				billType: 'Diesel',
				download: vm.report
			};
		}

		if (vm.oFilter.from)
			oFilter.from = new Date(vm.oFilter.from.setHours(0, 0, 0));

		if (vm.oFilter.to)
			oFilter.to = new Date(vm.oFilter.to.setHours(23, 59, 59));

		if (vm.oFilter.aAccountTag.length)
			oFilter.account = vm.oFilter.aAccountTag.map(o => o._id);

		if (vm.oFilter.aGroupTag.length)
			oFilter.accountGroup = vm.oFilter.aGroupTag.map(o => o._id);

		if (vm.fuelCompany) {
			oFilter.fuelCompany = vm.fuelCompany;
		}

		if (vm.report == 'combineDiesel' || vm.report == 'combineDieselLtr' || vm.report == 'combineDieselDaywise' || vm.report == 'combineDieselLtrDaywise') {
			oFilter.advanceType = "Diesel";
		}

		if (vm.report == 'unsettledTripAdvance') {
			if (vm.ownershipType)
				oFilter.ownershipType = vm.ownershipType;
			if (vm.advanceType)
				oFilter.advanceType = vm.advanceType;
			if (vm.segment_type)
				oFilter.segment_type = vm.segment_type;
			if (vm.dateType)
				oFilter.dateType = vm.dateType;
			if (vm.tripType)
				oFilter.tripType = vm.tripType;

			if (vm.advSettled) {
				oFilter.advSettled = vm.advSettled;
			} else {
				oFilter.advSettled = false;
			}

			oFilter.download = vm.report;
		}
		return oFilter;
	}

	function dateChange(dateType) {
		if (vm.report == 'combineDieselDaywise' || vm.report == 'combineDieselLtrDaywise') {
			if (dateType === 'startDate' && vm.oFilter.to && vm.oFilter.from) {

				let isDate = vm.oFilter.to instanceof Date,
					monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
					dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
					isNotValid = false;
				monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

				if (monthRange === 0)
					isNotValid = dateRange < 0;
				else if (monthRange === 1)
					isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
				else if (monthRange <= 1 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
					isNotValid = true;
				else if (monthRange === 1)
					isNotValid = false;
				else
					isNotValid = true;

				if (isDate && isNotValid) {
					let date = new Date(vm.oFilter.from);
					vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 1));
				}

			} else if (dateType === 'endDate' && vm.oFilter.to && vm.oFilter.from) {

				let isDate = vm.oFilter.from instanceof Date,
					monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
					dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
					isNotValid = false;
				monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

				if (monthRange === 0)
					isNotValid = dateRange < 0;
				else if (monthRange === 1)
					isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
				else if (monthRange  <= 1 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
					isNotValid = true;
				else if (monthRange === 1)
					isNotValid = false;
				else
					isNotValid = true;

				if (isDate && isNotValid) {
					let date = new Date(vm.oFilter.to);
					vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 1));
				}
			}
		}
	}
}

materialAdmin.filter('calcTransitTime', function () {
	return function (inp) {
		let time;
		if (inp.trip.route.route_time && (time = inp.trip.route.route_time.find(curr => curr.vehicle_type_id === inp.trip.vehicle.veh_type._id))) {
			let {up_time, down_time} = time;
			return `${up_time.days + down_time.days} days ${up_time.hours + down_time.hours} hours`;
		} else {
			return 'NA';
		}
	};
});

materialAdmin.filter('calcExpDateOfDelivery', function () {
	return function (inp) {
		let time;
		if (inp.trip.route.route_time && (time = inp.trip.route.route_time.find(curr => curr.vehicle_type_id === inp.trip.vehicle.veh_type._id))) {
			let {up_time, down_time} = time;
			return moment(inp.grDate).add({
				days: up_time.days + down_time.days,
				hours: up_time.hours + down_time.hours
			}).format("DD-MM-YYYY");
		} else {
			return 'NA';
		}
	};
});

materialAdmin.filter('calcContainerNos', function () {
	return function (inp) {
		return inp.booking.container && inp.booking.container.length > 0 ? inp.booking.container.map(curr => `${curr.number} (Size: ${curr.length})`).join(', ') : 'NA';
	};
});

materialAdmin.filter('calcWeightChargeForBilling', function () {
	return function (inp) {
		if (inp.booking && inp.booking.routeData && inp.booking.routeData.data) {
			let contractRates = inp.booking.routeData.data.find(curr => curr.vehicle_type === inp.trip.vehicle.veh_type.name && curr.booking_type === inp.booking.booking_type);
			if (contractRates.rate.min_payable_mt > inp.weight) {
				return contractRates.rate.min_payable_mt;
			} else {
				return inp.weight;
			}
		} else {
			return inp.weight;
		}
	};
});

materialAdmin.filter('billingAmount', function () {
	return function (inp) {
		let extra_charges;
		if (inp.bill && inp.bill.items) {
			extra_charges = addInArrayOnKey(inp.bill.items, 'charges.advance');
		} else if (inp.provisionalBill && inp.provisionalBill.items) {
			extra_charges = addInArrayOnKey(inp.provisionalBill.items, 'charges.advance');
		}
		let bill_amt = ((inp.bill && inp.bill.totalAmount) || (inp.provisionalBill && inp.provisionalBill.totalAmount) || 0) + (extra_charges || 0);
		return bill_amt;
	};
});

function addInArrayOnKey(aData, key) {
	let toReturn = aData.reduce(function (accumulator, currentValue) {
			let keys = key.split(".");
			let cv = currentValue;
			for (let key of keys) {
				if (cv)
					cv = cv[key];
				else {
					cv = 0;
					break;
				}
			}
			return accumulator + ((cv) ? cv : 0);
		},
		0
	);
	return toReturn;
}

materialAdmin.filter('perMTRate', function () {
	return function (inp) {
		return (inp.booking && inp.booking.routeData && inp.booking.routeData.data && inp.booking.routeData.data.find(curr => curr.vehicle_type === inp.trip.vehicle.veh_type.name).rate.price_per_mt) || 'NA';
	};
});

materialAdmin.filter('formAddress', function () {
	return function (addr) {
		if (!addr.booking.billing_party)
			return 'NA';

		addr = addr.booking.billing_party.address;
		var str = '';
		if (addr.line1) str += addr.line1 + ', ';
		if (addr.line2) str += addr.line2 + ', ';
		if (addr.city) str += addr.city + ', ';
		if (addr.state) str += addr.state + ' ';
		if (addr.pincode) str += addr.pincode + ', ';
		if (addr.country) str += addr.country;
		return str;
	};
});

materialAdmin.filter('calcMargin', function () {
	return function (inp) {
		let extra_charges;
		if (inp.bill && inp.bill.items) {
			extra_charges = addInArrayOnKey(inp.bill.items, 'charges.advance');
		} else if (inp.provisionalBill && inp.provisionalBill.items) {
			extra_charges = addInArrayOnKey(inp.provisionalBill.items, 'charges.advance');
		}
		let bill_amt = ((inp.bill && inp.bill.totalAmount) || (inp.provisionalBill && inp.provisionalBill.totalAmount) || 0) + (extra_charges || 0);
		return bill_amt - ((inp.trip && inp.trip.vendorDeal && inp.trip.vendorDeal.total_expense) || 0);
	};
});

materialAdmin.filter('calcMarginPerc', function () {
	return function (inp) {
		let extra_charges;
		if (inp.bill && inp.bill.items) {
			extra_charges = addInArrayOnKey(inp.bill.items, 'charges.advance');
		} else if (inp.provisionalBill && inp.provisionalBill.items) {
			extra_charges = addInArrayOnKey(inp.provisionalBill.items, 'charges.advance');
		}
		let bill_amt = ((inp.bill && inp.bill.totalAmount) || (inp.provisionalBill && inp.provisionalBill.totalAmount) || 0) + (extra_charges || 0);
		return (bill_amt - ((inp.trip && inp.trip.vendorDeal && inp.trip.vendorDeal.total_expense) || 0)) / (bill_amt || 1) * 100;
	};
});
