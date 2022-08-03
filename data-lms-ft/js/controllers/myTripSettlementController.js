materialAdmin
	.controller("myTripSettlementController", myTripSettlementController)
	.controller("tripSettlementViewController", tripSettlementViewController)
	.controller("emptyTripController", emptyTripController);

emptyTripController.$inject = [
	'$scope',
	'$uibModalInstance',
	'Vehicle',
	'Driver',
	'Routes',
	'tripServices',
	'DatePicker',
	'trip'
];

function emptyTripController(
	$scope,
	$uibModalInstance,
	Vehicle,
	Driver,
	Routes,
	tripServices,
	DatePicker,
	trip
) {

	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oTrip = trip;
	$scope.v_no = trip.vehicle.vehicle_reg_no;
	$scope.d_no = (trip.driver || {}).name;
	$scope.oSend = {
		route: undefined,
		route_name: undefined,
		branch: trip.branch._id,
		vehicle: trip.vehicle._id,
		vehicle_no: trip.vehicle.vehicle_reg_no,
		driver: (trip.driver || {})._id,
		lastTrip: trip._id,
		segment_type: trip.segment_type,
		tripStartDate: undefined,
		tripStartTime: new Date(),
		tripEndDate: undefined,
		tripEndTime: new Date(),
		startOdo:undefined,
		endOdo: undefined,
	};

	$scope.onVehSelect = function (veh) {
		$scope.v_no = veh.vehicle_reg_no;
		$scope.oSend.vehicle = veh._id;
		$scope.oSend.vehicle_no = veh.vehicle_reg_no;
	};

	$scope.onDriverSelect = function (dri) {
		$scope.d_no = dri.name;
		$scope.oSend.driver = dri._id;
	};

	$scope.onSelectSource = function () {
		$scope.setRouteKm();
	}

	$scope.onSelectDest = function (viewValue) {
		$scope.setRouteKm();
	}

	$scope.setRouteKm = function () {
		if ($scope.oSend.ld && $scope.oSend.uld && $scope.oSend.ld.location && $scope.oSend.uld.location) {
			if (google && google.maps && google.maps.DistanceMatrixService) {
				new google.maps.DistanceMatrixService().getDistanceMatrix(
					{
						origins: [$scope.oSend.ld.location],
						destinations: [$scope.oSend.uld.location],
						travelMode: "DRIVING",
						// unitSystem: UnitSystem,
					},
					(response) => {
						console.log(response);
						if (
							response &&
							Array.isArray(response.rows) &&
							response.rows[0]
						) {
							let element = response.rows[0].elements;
							$scope.oSend.rKm = Math.round2(element[0].distance.value / 1000, 2);
							$scope.$apply();
						}
					}
				);
			}
		}
	}

	$scope.getRoutes = function (v) {
		if (v.length > 2) {
			return new Promise(function (resolve, reject) {
				Routes.getName(v, function (d) {
					resolve(d.data.data);
				}, function (e) {
					resolve([]);
				});
			});
		}
	};

	$scope.getDriver = function (v) {
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

	$scope.getVehicle = function (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			Vehicle.getNameTrim(viewValue, function (res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	};

	$scope.submitEmptyTrip = function (form) {
		if (form.$valid) {
			let oSend = angular.copy($scope.oSend);
			if(oSend.ld && oSend.ld.c && oSend.uld && oSend.uld.c) {
				oSend.rName = `${oSend.ld.c} to ${oSend.uld.c}`;
			}
			if(oSend.route) {
				oSend.route_name = oSend.route.name;
				oSend.route_distance = oSend.route.route_distance;
				oSend.route = oSend.route._id;
			}

			// set timing for start date

			if(oSend.tripStartTime) {
				oSend.tripStartDate.setHours(oSend.tripStartTime.getHours());
				oSend.tripStartDate.setMinutes(oSend.tripStartTime.getMinutes());
				oSend.tripStartDate.setMilliseconds(0);
			}
			// set timing for end date

			if(oSend.tripEndTime) {
				oSend.tripEndDate.setHours(oSend.tripEndTime.getHours());
				oSend.tripEndDate.setMinutes(oSend.tripEndTime.getMinutes());
				oSend.tripEndDate.setMilliseconds(0);
			}

			tripServices.createEmptyTrip(oSend, function (d) {
				swal({
					title: d.data.message,
					type: d.data.status.toLowerCase(),
					text: ''
				});
				$uibModalInstance.close();
			}, function (e) {
				swal('Error', e.data && e.data.message, 'error');
				throw e;
			});
		}
	};

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

}

myTripSettlementController.$inject = [
	'$uibModal',
	'$modal',
	'$scope',
	'$state',
	'$timeout',
	'customer',
	'DatePicker',
	'lazyLoadFactory',
	'otherUtils',
	'stateDataRetain',
	'tripServices',
	'growlService',
	'Vehicle',
	'Driver',
	'Vendor',
	'URL',
	'dmsService'
];

function myTripSettlementController(
	$uibModal,
	$modal,
	$scope,
	$state,
	$timeout,
	customer,
	DatePicker,
	lazyLoadFactory,
	otherUtils,
	stateDataRetain,
	tripServices,
	growlService,
	Vehicle,
	Driver,
	Vendor,
	URL,
	dmsService
) {

	let vm = this;

	vm.columnSetting = {
		allowedColumn: [
			'Allocation Date',
			'Settlement Date',
			'Audit Date',
			'Category',
			'TripStart',
			'TripEnd',
			'Trip No',
			// 'No Of Docs',
			'RT No',
			'Consignor',
			'Gr No',
			'Vehicle No',
			'Customer',
			'Route',
			'Route Km',
			'Intermittent Point',
			'Budget Amt/Diesel(L)',
			'Advance Amt/Diesel(L)',
			'Settled Amt/Diesel(L)',
			'Driver Name',
			'Trip Status',
			'Ownership',
			'Vendor Name',
		]
	};

	vm.tableHead = [
		{
			'header': 'Allocation Date',
			'bindingKeys': 'allocation_date',
			'date': true
		},
		{
			'header': 'Settlement Date',
			'bindingKeys': 'markSettle.date',
			'date': true
		},
		{
			'header': 'Audit Date',
			'bindingKeys': 'advSettled.date',
			'date': true
		},
		{
			'header': 'Category',
			'bindingKeys': 'category'
		},
		{
			'header': 'TripStart',
			'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
			'date': true
		},
		{
			'header': 'TripEnd',
			'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
			'date': true
		},
		{
			'header': 'Trip No',
			'bindingKeys': 'trip_no'
		},
		// {
		// 	'header': 'No Of Docs',
		// 	'bindingKeys': 'noOfDocs ? noOfDocs : " 0 "',
		// },
		{
			'header': 'RT No',
			'bindingKeys': 'advSettled.tsNo'
		},
		{
			'header': 'Consignor',
			'bindingKeys': 'gr[0].consignor.name'
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
			'header': 'Vehicle No',
			'bindingKeys': 'vehicle.vehicle_reg_no',
			'date': false
		},
		{
			'header': 'Customer',
			'bindingKeys': 'gr[0].customer.name'

		},
		{
			'header': 'Route',
			'bindingKeys': 'route_name || rName'
		},
		{
			'header': 'Route Km',
			'bindingKeys': 'this.rKm || this.totalKm',
		},
		{
			'header': 'Intermittent Point',
			'filter': {
				'name': 'arrayOfIntermitPoint',
				'aParam': [
					'gr',
				]
			}
		},
		{
			'header': 'Budget Amt/Diesel(L)',
			'bindingKeys': "(netBudget.toFixed(2) || vendorDeal.total_expense || 0) + ' / ' + (dieselBudgetLtr.toFixed(2) || 0) + '(L)'"
		},
		{
			'header': 'Advance Amt/Diesel(L)',
			'bindingKeys': '(tAdv.toFixed(2) || 0) + " / " + (dieselGivenLtr.toFixed(2) || 0) + "(L)"'
		},
		{
			'header': 'Settled Amt/Diesel(L)',
			'bindingKeys': '(actual_expense.toFixed(2) || 0) + " / " + (dieselSettledLtr.toFixed(2) || 0) + "(L)"'
		},
		{
			'header': 'Driver Name',
			'bindingKeys': 'driver.nameCode || driver.name'
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
			'header': 'Vendor Name',
			'bindingKeys': 'vendor.name'
		},
	];

	// object Identifiers
	vm.aTripSettlement = []; // to contain Trip Settlement
	vm.selectedTripSettlement = null; // to contain selected Trip Settlement
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination

	// functions Identifiers
	vm.dateChange = dateChange;
	vm.getAllTrip = getAllTrip;
	vm.getDriver = getDriver;
	vm.getVehicle = getVehicle;
	vm.getGr = getGr;
	vm.getsearchGr = getsearchGr;
	vm.getVendorName = getVendorName;
	vm.getCustomer = getCustomer;
	vm.settlementCacheCSV = settlementCacheCSV;
	vm.onSelect = onSelect;
	vm.settlementReport = settlementReport;
	vm.settleTrip = settleTrip;
	vm.emptyTrip = emptyTrip;
	vm.uploadDocs = uploadDocs;
	vm.previewDocs = previewDocs;
	// this function trigger on state refresh
	vm.onStateRefresh = function (){
		vm.getAllTrip();
	};

	// INIT functions
	(function init() {


		if(stateDataRetain.init($scope, vm))
			return;

		vm.oFilter= {};
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		vm.aSelectedTrips = [];
		vm.selectType = 'index';
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		vm.aOwnershipVehicle = ["Own", "Associate", "Sold"];
		if($scope.$configs.tripSettlement && $scope.$configs.tripSettlement.isOwnOnly){
			vm.aOwnershipVehicle = ["Own", "Sold"];
		}
		vm.showTable = true;
		vm.maxEndDate = new Date();

		// getAllTrip(true);
	})();

	// Actual Functions
	function dateChange(dateType) {
		if(dateType === 'startDate' && vm.oFilter.end_date){
			if(moment(vm.oFilter.end_date).add(-12, 'month').isAfter(moment(vm.oFilter.start_date))){
				vm.oFilter.end_date = moment(vm.oFilter.start_date).add(12, 'month').toDate();
			}

			if(vm.oFilter.start_date > vm.oFilter.end_date)
				vm.oFilter.end_date = vm.oFilter.start_date;
		}else if(dateType === 'endDate' && vm.oFilter.start_date){
			if(moment(vm.oFilter.start_date).add(-12, 'month').isAfter(moment(vm.oFilter.end_date))){
				vm.oFilter.start_date = moment(vm.oFilter.end_date).add(12, 'month').toDate();
			}
		}
		vm.maxEndDate = Math.min(moment(vm.oFilter.start_date).add(12, 'month').toDate(), new Date());
	}
	// function dateChange(dateType) {
	//
	// 	if (dateType === 'startDate' && vm.end_date && vm.start_date) {
	//
	// 		let isDate = vm.end_date instanceof Date,
	// 			monthRange = vm.end_date.getMonth() - vm.start_date.getMonth(),
	// 			dateRange = vm.end_date.getDate() - vm.start_date.getDate(),
	// 			isNotValid = false;
	// 		monthRange += (vm.end_date.getFullYear() -  vm.start_date.getFullYear()) * 12;
	//
	// 		if (monthRange === 0)
	// 			isNotValid = dateRange < 0;
	// 		else if(monthRange ===1 && !vm.vehicle && !vm.vendor)
	// 			isNotValid = monthRange < 0 ? true : (30 - vm.start_date.getDate() + vm.end_date.getDate() > 30 ? true : false);
	// 		else if(monthRange <=3 && !vm.vehicle && !vm.vendor)
	// 		isNotValid = true;
	// 		else if(monthRange ===3 && (vm.start_date.getDate() < vm.end_date.getDate()))
	// 			isNotValid = true;
	// 		else if(monthRange === 1 || monthRange === 2 || monthRange === 3)
	// 			isNotValid = false;
	// 		else
	// 			isNotValid = true;
	//
	// 		if (isDate && isNotValid && (vm.vehicle || vm.vendor)) {
	// 			let date = new Date(vm.start_date);
	// 			vm.end_date = new Date(date.setMonth(date.getMonth() + 3));
	// 		}else if (isDate && isNotValid) {
	// 			let date = new Date(vm.start_date);
	// 			vm.end_date = new Date(date.setMonth(date.getMonth() + 1));
	// 		}
	//
	// 	} else if (dateType === 'endDate' && vm.end_date && vm.start_date) {
	//
	// 		let isDate = vm.start_date instanceof Date,
	// 			monthRange = vm.end_date.getMonth() - vm.start_date.getMonth(),
	// 			dateRange = vm.end_date.getDate() - vm.start_date.getDate(),
	// 			isNotValid = false;
	// 		monthRange += (vm.end_date.getFullYear() -  vm.start_date.getFullYear()) * 12;
	// 		if (monthRange === 0)
	// 			isNotValid = dateRange < 0;
	// 		else if(monthRange ===1 && !vm.vehicle && !vm.vendor)
	// 			isNotValid = monthRange < 0 ? true : (30 - vm.start_date.getDate() + vm.end_date.getDate() > 30 ? true : false);
	// 		else if(monthRange <=3 && !vm.vehicle && !vm.vendor)
	// 			isNotValid = true;
	// 		else if(monthRange ===3 && (vm.start_date.getDate() < vm.end_date.getDate()))
	// 			isNotValid = true;
	// 		else if(monthRange === 1 || monthRange === 2 || monthRange === 3)
	// 			isNotValid = false;
	// 		else
	// 			isNotValid = true;
	//
	// 		if (isDate && isNotValid && (vm.vehicle || vm.vendor)) {
	// 			let date = new Date(vm.end_date);
	// 			vm.start_date = new Date(date.setMonth(date.getMonth() - 3));
	// 		}else if (isDate && isNotValid) {
	// 			let date = new Date(vm.end_date);
	// 			vm.start_date = new Date(date.setMonth(date.getMonth() - 1));
	// 		}
	// 	}
	// }


	function getAllTrip(isGetActive) {

		if(!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function getDriver(viewValue) {
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

	function getVendorName(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Vendor.getName({name: viewValue,deleted: false}, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function onSelect($item, $model, $label) {
		getAllTrip();

		// vm.aSelectedTrips = [];
		// getAllTrip();
	}

	function prepareFilter() {
		let requestFilter = {};
		let showCheckbox = false;
		requestFilter.ownershipType = { $ne: 'Market' };

		if($scope.$configs.tripSettlement && $scope.$configs.tripSettlement.isOwnOnly)
			requestFilter.ownershipType  = {$nin: ["Market", "Associate"]};

		if (vm.oFilter.vehicle) {
			requestFilter.vehicle = vm.oFilter.vehicle._id;
			showCheckbox = true;
		}

		if (vm.oFilter.bookingCustomer && vm.oFilter.bookingCustomer.name) {
			requestFilter.customer_id = vm.oFilter.bookingCustomer._id;
			//showCheckbox = true;
		}

		if (vm.aBranch && vm.aBranch.length) {
			requestFilter.branch = vm.aBranch.map((v) => v._id);
		}else if (vm.aUserBranch && vm.aUserBranch.length) {
			requestFilter.branch = [];
			vm.aUserBranch.forEach(obj => {
				if(obj.read)
					requestFilter.branch.push(obj._id);
			});
		}

		if (vm.oFilter.driver) {
			requestFilter.driver = vm.oFilter.driver._id;
			showCheckbox = true;
		}

		if (vm.oFilter.vendor) {
			requestFilter.vendor = vm.oFilter.vendor._id;
			showCheckbox = true;
		}

		if (showCheckbox) {
			vm.selectType = 'multiple';
		} else
			vm.selectType = 'index';

		if (vm.oFilter.tsNo) {
			requestFilter['advSettled.tsNo'] = vm.oFilter.tsNo;
		}

		if (vm.oFilter.start_date) {
			requestFilter.from = vm.oFilter.start_date;
		}

		if (vm.oFilter.end_date) {
			requestFilter.to = new Date((vm.oFilter.end_date).setHours(23,59,59));
			// requestFilter.to = vm.end_date;
		}

		if (vm.oFilter.trip_no) {
			requestFilter.trip_no = vm.oFilter.trip_no;
		}

		if (vm.oFilter.ownershipType) {
			requestFilter.ownershipType = vm.oFilter.ownershipType;
		}

		if (vm.oFilter.grData) {
			requestFilter._id =  vm.oFilter.grData.trip;
		}

		if (vm.oFilter.segment_type) {
			requestFilter.segment_type = vm.oFilter.segment_type;
		}
		if (vm.oFilter.dateType) {
			requestFilter.dateType = vm.oFilter.dateType;
		}
     	if (vm.oFilter.mSettle) {
			requestFilter['markSettle.isSettled'] = vm.oFilter.mSettle === 'Yes' ? true : false;
		}

		if (vm.oFilter.sortBy && vm.oFilter.sortBy === 'Assending') {
			requestFilter.sort = {start_date: 1};
		}else if (vm.oFilter.sortBy && vm.oFilter.sortBy === 'Dessending') {
			requestFilter.sort = {start_date: -1};
		}

		requestFilter.tripSettleType = vm.oFilter.tripSettleType;
		requestFilter.isCancelled = false;
		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 8;
		requestFilter.summary = true;
		return requestFilter;
	}

	function getGr(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1
				};
				tripServices.getAllGRItem(req, res => {
					resolve(res.data.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}
	function getsearchGr(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1,
				};
				tripServices.getGrTrim(
					req,
					(res) => {
						resolve(res.data.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function settlementCacheCSV() {
		let oFilter = prepareFilter();

		if(!(vm.oFilter.start_date && vm.oFilter.end_date)){
			swal('Warning','AllocationDate From and To should be filled','warning');
			return;
		}

		let allowedTime = ['1', 'year'];

		if(moment(vm.oFilter.end_date).isAfter(moment(vm.oFilter.start_date).add(...allowedTime)))
			return swal('Error', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

		delete oFilter.skip;
		delete oFilter.no_of_docs;
		oFilter.all = true;

		if(oFilter.tripSettleType === "Unsetteled")
			tripServices.getUnSettlementCSV(oFilter, success);
		else
			tripServices.getSettlementCSV(oFilter, success);

		function success(d) {
			if(d.data.url) {
				var a = document.createElement('a');
				a.href = d.data.url;
				a.download = d.data.url;
				a.target = '_blank';
				a.click();
			}else{
				swal('', d.data.message, 'success');
			}
		}
	}

	function settlementReport(isCSV) {
		let oFilter = prepareFilter();
		oFilter.download = 'onTripSettle';

		if(!(vm.oFilter.start_date && vm.oFilter.end_date)){
			swal('Warning','AllocationDate From and To should be filled','warning');
			return;
		}

		delete oFilter.skip;
		delete oFilter.no_of_docs;
		oFilter.all = true;

		if(isCSV)
			oFilter.downloadCSV = true;

		let allowedTime = ['1', 'month'];

		if(moment(vm.oFilter.end_date).isAfter(moment(vm.oFilter.start_date).add(...allowedTime)))
			return swal('Error', `Max Allowed Time frame for  Report is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

		tripServices.getTripReportsNew(oFilter, function (d) {
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

	function settleTrip(aTrip) {
		if (!Array.isArray(aTrip)) {
			if (otherUtils.isEmptyObject(aTrip)) {
				swal('Error', 'No Trip Selected', 'error');
				return;
			}
			aTrip = [aTrip];
		} else if (!aTrip.length) {
			swal('Error', 'No Trip Selected', 'error');
			return;
		}

		let tsNo = aTrip[0].advSettled && aTrip[0].advSettled.tsNo;

		if(tsNo)
			if(aTrip.find( o => (o.advSettled && o.advSettled.tsNo) ? o.advSettled.tsNo != tsNo : true )){
				swal('Error','Trip with Different Trip Settlement Group is Selected','error');
				return;
			}

		if(!aTrip[0].vehicle)
			return swal('Error','vehicle not found on selectedTrip','error');

		$state.go('booking_manage.tripSettlementView', {data: aTrip});
	}

	function emptyTrip(trip) {
		if (trip && !Array.isArray(trip)) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/myTripSettlement/emptyTripPopup.html',
				controller: 'emptyTripController',
				resolve: {
					trip: function () {
						return angular.copy(trip);
					}
				}
			});
			modalInstance.result.then(function (data) {
				$state.reload();
			}, function (data) {
				if (data !== 'cancel') {
				}
			});
		}
	}

	function uploadDocs(oTrip) {
		if (oTrip.length > 1) {
			swal('Warning', 'Please select only One Row', 'warning');
			return;
		}
		let selectedTrip = oTrip[0] || oTrip;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'trip',
					scopeModel: selectedTrip,
					scopeModelId: selectedTrip._id,
					uploadText: "Upload Trip Documents",
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

	function previewDocs(oTrip) {
		if(!oTrip._id)
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: oTrip._id,
				modelName: "trip"
			};
			dmsService.getAllDocs( req,success,failure);

			function success(res) {
				if (res && res.data) {
					$scope.oDoc = res.data;
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

		function prepareData() {
			let mergeData = {};
			$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj=>{
				mergeData[obj.category] = mergeData[obj.category] || [];
				mergeData[obj.category].push(obj);
			});
			$scope.oDoc = mergeData;

			for (let [key, val] of Object.entries($scope.oDoc)) {
				if(Array.isArray(val)){
					val.forEach((doc, i) => {
						let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
						documents.push({
							name,
							docName:doc.name,
							_id: oTrip._id,
							modelName: 'trip',
							url: `${URL.file_server}${doc.name}`
						});
					});
				}else{
					let name = `${key|| 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName:doc.name,
						_id: oTrip._id,
						modelName: 'trip',
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

	}


	//////////////////////////////////////////////////


}


tripSettlementViewController.$inject = [
	'$modal',
	'$scope',
	'$state',
	'$stateParams',
	'$timeout',
	// '$templateCache',
	'accountingService',
	'clientService',
	'dateUtils',
	'orderByFilter',
	'tripServices',
	'growlService',
	'vendorFuelService'
];

function tripSettlementViewController(
	$modal,
	$scope,
	$state,
	$stateParams,
	$timeout,
	// $templateCache,
	accountingService,
	clientService,
	dateUtils,
	orderByFilter,
	tripServices,
	growlService,
	vendorFuelService
) {

	let vm = this;
	// object Identifiers
	if (!$stateParams.data) {
		$state.go('booking_manage.tripSettlement');
		return;
	}

	vm.columnSetting = {
		allowedColumn: [
			'Allocation Date',
			'TripStart',
			'TripEnd',
			'Trip No',
			'Consignor',
			'Gr No',
			// 'Vehicle No',
			'Route',
			'Route Km',
			'Intermittent Point',
			'Ext. Km',
			// 'Budget Amt/Diesel(L)',
			// 'Advance Amt/Diesel(L)',
			// 'Settled Amt/Diesel(L)',
			'Driver Name',
			// 'Trip Status',
			// 'Ownership',
			'AR No',
			'Pod Status',
		]
	};
	vm.tableHead = [
		{
			'header': 'Allocation Date',
			'bindingKeys': 'allocation_date',
			'date': true
		},
		{
			'header': 'TripStart',
			'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
			'date': true
		},
		{
			'header': 'TripEnd',
			'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
			'date': true
		},
		{
			'header': 'Trip No',
			'bindingKeys': 'trip_no'
		},
		{
			'header': 'Consignor',
			'bindingKeys': 'gr[0].consignor.name'
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
			'header': 'Vehicle No',
			'bindingKeys': 'vehicle.vehicle_reg_no',
			'date': false
		},
		{
			'header': 'Route',
			'bindingKeys': 'route_name || rName'
		},
		{
			'header': 'Route Km',
			'bindingKeys': 'route.route_distance || rKm'
		},
		{
			'header': 'Intermittent Point',
			'filter': {
				'name': 'arrayOfIntermitPoint',
				'aParam': [
					'gr',
				]
			}
		},
		{
			'header': 'Ext. Km',
			'bindingKeys': 'extraKm'
		},
		{
			'header': 'Budget Amt/Diesel(L)',
			'bindingKeys': "((netBudget|roundOff) || 0) + ' / ' + ((dieselBudgetLtr|roundOff) || 0) + '(L)'"
		},
		{
			'header': 'Advance Amt/Diesel(L)',
			'bindingKeys': '((tAdv|roundOff) || 0) + " / " + ((dieselGivenLtr|roundOff) || 0) + "(L)"'
		},
		{
			'header': 'Settled Amt/Diesel(L)',
			'bindingKeys': '((actual_expense|roundOff) || 0) + " / " + ((dieselSettledLtr|roundOff) || 0) + "(L)"'
		},
		{
			'header': 'Driver Name',
			'bindingKeys': 'driver.name'
		},
		{
			'header': 'AR No',
			'bindingKeys': 'gr[0].pod.arNo'
		},
		{
			'header': 'Pod Status',
			'bindingKeys': 'this.gr[0].pod.received ? "Received" : "Not Received"',
			'eval': true
		}
	];

	// functions Identifiers

	vm.addTrip = addTrip;
	vm.addExpense = addExpense;
	vm.addKilometer = addKilometer;
	vm.associateDriver = associateDriver;
	vm.driverPayment = driverPayment;
	vm.advanceOper = advanceOper;
	vm.calLiter = calLiter;
	vm.editSettle = editSettle;
	vm.markTripSettled = markTripSettled;
	vm.accountManagerRemark = accountManagerRemark;
	vm.printSummary = printSummary;
	vm.printRTSummary = printRTSummary;
	vm.printRTDetailedSummary = printRTDetailedSummary;
	vm.previewSettlement = previewSettlement;
	vm.removeTrip = removeTrip;
	vm.removeSettlementTrip = removeSettlementTrip;
	vm.rowSelect = rowSelect;
	vm.settleTripCompletely = settleTripCompletely;
	vm.revertSettleTripCompletely = revertSettleTripCompletely;
	vm.showAdvances = showAdvances;
	vm.showSuspense = showSuspense;
	vm.submit = submit;
	vm.uploadLoadingSlip = uploadLoadingSlip;
	vm.upsertTripSettlement = upsertTripSettlement;
	vm.gettotalgpskm = gettotalgpskm;



	// INIT functions

	(function init() {

		if ($stateParams.data.localStorage) {
			vm.aTrips = angular.copy($stateParams.data.aTrips);
			vm.aSettle = angular.copy($stateParams.data.aSettle);

		} else {
			vm.aTrips = $stateParams.data;
			vm.aSettle = [];
		}

		vm.oSettle = {};
		vm.advanceTyp = [];
		vm.vehicle = vm.aTrips[0].vehicle.vehicle_reg_no || vm.aTrips[0].vehicle_no;
		// vm.aDriver = [vm.aTrips[0].driver && vm.aTrips[0].driver.name];
		// vm.aDriver_expiry = vm.aTrips[0].driver && vm.aTrips[0].driver.license_expiry_date;
		vm.driveBalance = 0;
		vm.noVoucherCreate = false; // Voucher of settlement will be create or not if true then voucher will be created else not
		// vm.oSettle.person = vm.aDriver[0];
		vm.oSettle.account_data = vm.oSettle.account_data || {};
		vm.oSettle.account_data.to = vm.oSettle.account_data.to || {};
		vm.oSettle.account_data.from = vm.oSettle.account_data.from || {};

		vm.selectRouteSettings = {
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
		vm.selectRouteEvents = {
			onSelectionChanged: function () {
				vm.oSettle.person = vm.oSettle.account_data.to.name;
			}
		};
		vm.tsNo = vm.aTrips[0].advSettled && vm.aTrips[0].advSettled.tsNo;

		if(vm.tsNo && vm.aTrips.find( o => (o.advSettled && o.advSettled.tsNo) ? o.advSettled.tsNo != vm.tsNo : true )){
			swal('Error','Trip with Different Trip Settlement Group is Selected','error');
			$state.go('booking_manage.tripSettlement');
			return;
		}

		getAllTrip();

		// getFuelVendor();
		updateTripSummary();

	})();

	// Actual Functions

	function addTrip(){

		if(!(vm.selectedTrip && vm.selectedTrip.advSettled))
			return swal('Warning', 'No Trip Selected', 'warning');

         if(vm.aTrips[0].tripStarted)
         	 vm.start = vm.aTrips[0].tripStarted;

		if(vm.aTrips.length > 1)
			vm.end = vm.aTrips.slice(-1)[0].tripEnded || new Date();
		else
			vm.end = vm.aTrips[0].tripEnded || new Date();
		vm.start = new Date( vm.start.setDate( vm.start.getDate() - 5));
		vm.end = new Date( vm.end.setDate( vm.end.getDate() + 5));

		$modal.open({
			templateUrl: 'views/myTripSettlement/addTripOnSettlementPopup.html',
			controller: ['$uibModalInstance', 'lazyLoadFactory', 'otherData', 'tripServices', addTripOnSettlement],
			controllerAs: 'aTSVm',
			resolve: {
				otherData: function(){
					return {
						tsNo: vm.selectedTrip.advSettled.tsNo,
						vehicle_no: vm.selectedTrip.vehicle_no,
						start: vm.start,
						end: vm.end,
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			applyData(response);
			getAllTrip();

		}, function(data) {
			console.log('cancel',data);
		});
	}

	function addExpense(formData, oSettle) {

		oSettle.advanceType = 'Driver Cash';

		if (formData.$invalid){
			swal('Error','All Mandatory Field not filled','error');
			return;
		}
		/*TODO validate with actual account outstandings @kamal
                if(oSettle.amount > vm.totalAdvance[oSettle.type].amount){
                    swal('Error',`Amount Should be less than ${vm.totalAdvance[oSettle.type].amount}`,'error');
                    return;
                }
        */
		const oTrip = {
			trip_no: vm.selectedTrip.trip_no,
			trip_id: vm.selectedTrip._id,
			...oSettle
		};
		oTrip.created_at = new Date().toISOString();
		if (oTrip.type !== 'Diesel' && oTrip.diesel_info)
			delete oTrip.diesel_info;
		else if (oTrip.type === 'Diesel' && oTrip.diesel_info) {
			oTrip.diesel_info.vendor = oTrip.diesel_info.vendor;
			oTrip.diesel_info.station = oTrip.diesel_info.station;
		}
		vm.aSettle.push(oTrip);
		vm.oSettle = {
			person: vm.aDriver[0]
		};

	}

	function addKilometer() {
		$modal.open({
			templateUrl: 'views/myTripSettlement/addKilometerPopup.html',
			controller: ['$scope', '$uibModalInstance', 'otherData', 'tripServices', addKilometerPopupCtrl],
			controllerAs: 'aKVm',
			resolve: {
				otherData: function(){
					return {
						selectedTrip: vm.selectedTrip
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			getAllTrip();
		}, function(data) {
			console.log('cancel',data);
		});
	}

	function accountManagerRemark() {
		$modal.open({
			templateUrl: 'views/myTripSettlement/settleTripAccManagerRemark.html',
			controller: ['$uibModalInstance', 'otherData', 'tripServices', accountManagerRemarkPopupCtrl],
			controllerAs: 'sTAmr',
			resolve: {

				otherData: function(){
					return {
						selectedTrip: vm.selectedTrip
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			getAllTrip();
		}, function(data) {
			console.log('cancel',data);
		});
	}


	function associateDriver() {
		if( !(vm.selectedTrip && vm.selectedTrip._id))
			return swal('Warning', 'No Trip Selected', 'warning');

		$modal.open({
			templateUrl: 'views/driverOnVehicle/addDriverOnVehiclePopup.html',
			controller: [
				'$uibModalInstance',
				'callback',
				'otherUtils',
				'Driver',
				'Vehicle',
				'DatePicker',
				'driverOnVehicleService',
				'otherData',
				addDriverOnVehicleController
			],
			controllerAs: 'vm',
			resolve: {
				callback: function(){
					return function(data){
						return new Promise(function (resolve, reject) {

							if(!(data.driver && data.driver._id)){
								swal('Error', 'No Driver Found', 'error');
								return reject();
							}

							let oFilter = {
								driver: data.driver._id,
								date: dateUtils.setHours(data.ass_date, 0, 0, 0)
							};

							if(vm.aTrips[0].advSettled.tsNo)
								oFilter.tsNo = vm.aTrips[0].advSettled.tsNo;
							else
								oFilter.aTrips = vm.aTrips.map(o => o._id);

							tripServices.rtDriverAssociate(oFilter, function (res) {
								resolve(res.data);
								if(res.data && res.data.status != 'Ok')
									swal("warning", res.data.message, "warning");
								else
								swal('Success', res.data.message, 'success');
							});
						});
					};
				},
				otherData: function() {
					let selectedTripVehicle = {
						...vm.selectedTrip.vehicle,
						driver: vm.selectedTrip.driver
					};
					return {
						vehicle: selectedTripVehicle,
						fromPage: 'ts'
					};
				},
				fromSettlement: function () {
					return true;
				},
			}

		}).result
			.then(function (data) {
				// console.log(data);
				getAllTrip();
			}, function (data) {
				// console.log(data);
			}
		);
	}

	function applyData(res) {
		vm.aTrips = res.data;

		vm.aTrips.forEach( oTrip => {
			if(!vm.payments)                             // once driver payment done hide add and delete trip advance option from settlement view page
			vm.payments = oTrip.payments.length && true;

			oTrip.statuses.forEach( oStatus => {
				if(oStatus.status === 'Trip started')
					oTrip.tripStarted = new Date(oStatus.date) || undefined;
				else if(oStatus.status === 'Trip ended')
					oTrip.tripEnded = new Date(oStatus.date) || undefined;
			});
		});

		vm.aTrips.sort( (a,b) => new Date(a.tripStarted) - new Date(b.tripStarted) );

		vm.aDriverDetails = vm.aTrips.find( o => (o.driver));
		if(vm.aDriverDetails){
			vm.aDriver = [vm.aDriverDetails.driver.nameCode || vm.aDriverDetails.driver.name];
			vm.oSettle.person = vm.aDriverDetails.driver.nameCode ||vm.aDriverDetails.driver.name;
			vm.aDriver_expiry = vm.aDriverDetails.driver.license_expiry_date;
			if(vm.aDriverDetails.driver.blacklisted)
				vm.aDriverStatus = 'Not Active';
			else
				vm.aDriverStatus = 'Active';
		}else {
			vm.aDriverStatus = 'No Driver';
		}
		vm.susRemark = [];
		vm.aTrips.find( o => (o.suspenseRemark) ? (vm.susRemark = o.suspenseRemark) : '');


		vm.summary = res.summary;
		vm.tableApi && vm.tableApi.refresh();
		vm.tableApi && vm.tableApi.selectFirstRow();
		updateTripSummary();
	}

	function revertSettleTripCompletely(){

			if(!(vm.selectedTrip && vm.selectedTrip._id))
				return swal('Error', 'Please select a trip', 'error');

			if(!vm.aTrips[0].advSettled.tsNo)
				return swal('Error', 'This is not completely settled.', 'error');

			swal({
				   title: 'Are you sure you want to REVERT COMPLETELY SETTLED TRIP?',
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

				if(isConfirm) {

					$modal.open({
						templateUrl: 'views/myTripSettlement/revertRmkPopUp.html',
						controller: ['$scope', '$uibModalInstance', 'otherData', 'tripServices', revertRmkPopUpCtrl],
						controllerAs: 'rrVm',
						resolve: {
							otherData: function(){
								return {
									selectedTrip: vm.selectedTrip,
									summary: vm.summary
								};
							}
						}
					}).result.then(function(response) {
						console.log('close',response);
						getAllTrip();
					}, function(data) {
						console.log('cancel',data);
					});

			   }

			   });
		   return;
	}


	function revertRmkPopUpCtrl(
		$scope,
		$uibModalInstance,
		otherData,
		tripServices,
	) {

		let vm = this;

		// function identifer
		vm.closeModal = closeModal;
		vm.submit = submit;

		// init
		(function init() {
			vm.selectedTrip = otherData.selectedTrip;
			vm.summary = otherData.summary;
		})();

		// Actual Function

		function closeModal() {
			$uibModalInstance.dismiss();
		}

		function submit(formData) {
			if(formData.$valid){


				let request = {
					tsNo: vm.selectedTrip.advSettled.tsNo,
					remark: vm.remark,
					adv: vm.summary.netAdvance || 0,
					exp: vm.summary.netExpense || 0,
					dp: vm.summary.driverPayment || 0,
					netAdvObj: vm.summary.netAdvObj || {},
					netExpObj: vm.summary.netExpObj || {},
				};

				tripServices.revertSettledTrip(request, onSuccess, onFailure);

				function onFailure(err) {
					swal('Error', err.data.message, 'error');
					reject(err.data.message);
				}

				function onSuccess(res) {
					console.log(res);
					swal('Success',res.data.message, 'success');
					$uibModalInstance.close(res.data);
				}

			}else{
				swal('Error','All Mandatory Fields are not filled','error');
			}
		}

	}




	function settleTripCompletely() {

		if(!(vm.selectedTrip && vm.selectedTrip._id))
			return swal('Error', 'Select a Trip', 'error');

		if(vm.aTrips) {
			let driver, flag1, flag2;
			vm.aTrips.forEach(obj => {
				driver = driver || obj.driver && obj.driver._id;
				if (!(obj.driver && obj.driver._id))
					flag1 = true;
				if (obj.driver && obj.driver._id != driver)
					flag2 = true;
			});
			if (flag1)
				return swal('Error', 'Driver not found on some of Trips', 'error');
			else if (flag2)
				return swal('Error', 'Driver should be same on all Trips', 'error');
		}

		$modal.open({
			templateUrl: 'views/myTripSettlement/settleTripCompletely.html',
			controller: ['$scope', '$uibModalInstance', 'DatePicker', 'callback', 'modelData', 'otherData', 'tripServices', settleTripCompPopupCtrl],
			controllerAs: 'sTCVm',
			resolve: {
				callback: function(){
					return false;
				},
				modelData: function(){
					return false;
				},
				otherData: function(){
					return {
						tsNo: vm.selectedTrip.advSettled.tsNo,
						aTrips: vm.aTrips,
						aTripsSummary: vm.summary,
						closingBal: vm.summary.openCloseBal.driver.closing || 0
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			getAllTrip();

		}, function(data) {
			console.log('cancel',data);
		});
	}

	function advanceOper(type = 'add') {

		$modal.open({
			templateUrl: 'views/tripSuspense/approvalPopup.html',
			controller: ['$scope', '$modal', '$uibModalInstance', 'accountingService', 'branchService', 'callback', 'DatePicker', 'lazyLoadFactory', 'modelDetail', 'otherData', 'billBookService', 'tripServices', 'Vehicle', 'narrationService','vendorFuelService'/*, 'associatedriverOnVehicle'*/, approvalPopupController],
			controllerAs: 'approvalVm',
			resolve: {
				callback: function(){
					return function(oTrip){
						let oAdvance = oTrip.oAdvance;
						return new Promise(function (resolve, reject) {

							if(oAdvance.advanceType === 'Diesel')
								oAdvance.amount = oAdvance.diesel_info.rate * oAdvance.diesel_info.litre;


							let request = {
								...oAdvance,
								_id: oTrip._id
							};

							tripServices.addAdvance(request, onSuccess, onFailure);

							function onFailure(err) {
								swal('Error', err.data.message, 'error');
								reject(err.data.message);
							}

							function onSuccess(res) {
								console.log(res);
								swal('Success',res.data.message, 'success');
								resolve(res.data.data);
							}
						});
					}
				},
				modelDetail: function() {
					return {
						type,
						showTripForm: false
					};
				},
				otherData: function(){
					return {
						selectedTrip: vm.selectedTrip
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);

			getAllTrip();

		}, function(data) {
			console.log('cancel',data);
		});
	}

	function calLiter(info) {
		setAmount(Math.round(info.litre * info.rate * 100) / 100);
	}

	function driverPayment(){

		if(!(vm.selectedTrip && vm.selectedTrip._id))
			return swal('Error', 'Select a Trip', 'error');

		if(!(vm.selectedTrip.driver && vm.selectedTrip.driver.account))
			return swal('Error', 'No Driver or Drive A/c not linked.', 'error');

		if(vm.aTrips) {
			let driver, flag1, flag2;
			vm.aTrips.forEach(obj => {
				driver = driver || obj.driver && obj.driver._id;
				if (!(obj.driver && obj.driver._id))
					flag1 = true;
				if (obj.driver && obj.driver._id != driver)
					flag2 = true;
			});
			if (flag1)
				return swal('Error', 'Driver not found on some of Trips', 'error');
			else if (flag2)
				return swal('Error', 'Driver should be same on all Trips', 'error');
		}

		$modal.open({
			templateUrl: 'views/myTripSettlement/payments.html',
			controller: [
				'$uibModalInstance',
				'accountingService',
				'branchService',
				'billBookService',
				'DatePicker',
				'narrationService',
				'otherDetail',
				'tripServices',
				'$scope',
				paymentsController
			],
			controllerAs: 'pVm',
			resolve: {
				otherDetail: function () {
					return {
						branch: vm.selectedTrip.branch,
						driverAccount: vm.selectedTrip.driver.account,
						trip: vm.selectedTrip,
						payments: vm.aTrips.reduce((arr, oTrip) => (arr.push(...oTrip.payments), arr), []),
						allTrip: vm.aTrips,
						aTripsSummary: vm.summary,
					};
				}
			}
		})
			.result
			.then(function (response) {
				console.log(response);
				getAllTrip();
			}, function (err) {
				console.log(err);
			});
	}

	function editSettle() {

		if (!(vm.selectedSettle && vm.selectedSettle._id)) {
			swal('Error', 'No Settle Selected', 'error');
			return;
		}
		if (vm.selectedSettle && vm.selectedSettle.voucher) {
			swal('Error', 'Selected Settle Not Editable', 'error');
			return;
		}

		vm.selectedSettle.advanceType = vm.selectedSettle.type;
		vm.selectedSettle.dieseInfo = vm.selectedSettle.diesel_info;

		$modal.open({
			templateUrl: 'views/myTripAdvance/tripAmountPopup.html',
			controller: ['$uibModalInstance', 'tripData', 'callback', tripAmountPopupController],
			controllerAs: 'tripAmountVm',
			resolve: {
				tripData: function () {
					return {
						name: 'Settlement',
						type: 'Edit',
						oshAdvance: vm.selectedSettle
					};
				},
				callback: function () {
					return function (oSettle) {
						return new Promise(function (resolve, reject) {

							if (!$scope.$configs.tripSettlement.settleLitreWise && oSettle.amount === vm.selectedSettle.amount) {
								swal('Warning', 'Amount Not changed', 'warning');
								reject();
								return;
							}

							let request = {
								_id: vm.selectedSettle._id,
								remark: oSettle.remark,
							};

							if(oSettle.amount)
								request.amount = oSettle.amount;

							if(oSettle.diesel_info)
								request.diesel_info = oSettle.diesel_info;

							tripServices.UpdateSettleTrip(request, onSuccess, onFailure)

							function onFailure(err) {
								swal('Error', err.data.message, 'error');
								reject(err.data.message);
							}

							function onSuccess(res) {
								console.log(res);
								resolve(res.data.data);
							}
						});
					};
				}
			}
		}).result.then(function (response) {
			// vm.selectedSettleTrip = response;
            swal('success', 'Data Updated Successfully', 'success');
			getAllTrip();

			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function getAllTrip() {

		let tsNo, aTripId = [];

		if(vm.aTrips[0].advSettled && vm.aTrips[0].advSettled.tsNo)
			tsNo = vm.aTrips[0].advSettled.tsNo;
		else
			aTripId = vm.aTrips.map(o=>o._id);

		let oFilter = {
			'summary': true
		};

		if(tsNo){
			oFilter['advSettled.tsNo'] = tsNo
		}else if(aTripId.length){
			oFilter._id = aTripId;
		}

		oFilter.no_of_docs = 35;

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {
				res = res.data.data;
				$timeout(() => {
					vm.selectedTrip = res.data[0]; // assign first trip by default
					vm.tableApi.refresh(); // re-draw the table (necessary for selected first trip by default )
				}, 200);
				applyData(res);
				getSuspense();
				if($scope.$configs && $scope.$configs.booking && $scope.$configs.booking.odometer){
					vm.totalodometerkm=0;
					for(let i=0; i<res.data.length; i++){
						if(res.data[i].endOdo && res.data[i].startOdo){
				 	   vm.totalodometerkm =  vm.totalodometerkm +(res.data[i].endOdo - res.data[i].startOdo);
						}
			       }
				}
					if($scope.$configs && $scope.$configs.tripSettlement && $scope.$configs.tripSettlement.gpsKm){
						vm.totalgpskm =0;
				// 	 if(res.data[0].vehicle.device_imei){
				//     let device_imei = [];
               // let stdate = res.data[0].start_date;
				// 	let enddate = res.data[res.data.length-1].end_date;
				// 	device_imei.push(res.data[0].vehicle.device_imei);
				// 	if(stdate && enddate){
				// 	gettotalgpskm(stdate,enddate,device_imei);
				// 	}
				// 	 }
						//new gkm km changes
						for(let i=0; i<res.data.length; i++){
							if(res.data[i].playBack && res.data[i].playBack.tot_dist){
								vm.totalgpskm =  vm.totalgpskm + res.data[i].playBack.tot_dist;
							}
						}
						if(vm.totalgpskm > 0){
							vm.totalgpskm =  vm.totalgpskm /1000;
						}
				}
			}
		});
	}

	function getFuelVendor() {
		function fuelSucc(res) {
			if (res.data.data) {
				vm.aFuelVendor = res.data.data;
			}
		}

		vendorFuelService.getAllFuelVendors({}, fuelSucc);
	}

	 function gettotalgpskm(st,ed,imei){
      tripServices.totalgpskmget({
			end_time: ed,
			start_time:st,
			device_imei:imei

		}, success, fail);

		function success(res) {
			if (res && res.data) {
         vm.totalgpskm = res.data.data.tot_dist;
			vm.totalgpskm =  vm.totalgpskm /1000;
			}
		}

		function fail(res) {
		}
	 }
	function getSuspense() {

		let aTrips = orderByFilter(vm.aTrips.map(oTrip => {
			oTrip.tripStartDate = (oTrip.statuses.find(oStatus => oStatus.status === 'Trip started') || {}).date;
			oTrip.tripEndDate = (oTrip.statuses.find(oStatus => oStatus.status === 'Trip ended') || {}).date;
			return oTrip;
		}), 'tripStartDate', true);

		let oFilter = {
			from: dateUtils.setHours(aTrips[aTrips.length-1].tripStartDate, 0, 0, 0),
			to: dateUtils.setHours(aTrips[0].tripEndDate, 23, 59, 59),
			vehicle_no: aTrips[0].vehicle.vehicle_reg_no,
			trip: {$exists:false},
			all: true
		};

		tripServices.tripAdvances(oFilter, function (res) {
			if (res && res.data) {
				res = res.data;
				vm.aSuspense = res.data;
				vm.aggrOfSupense = res.data.reduce( (a,c) => a+c.amount, 0);
			}
		});
	}

	function removeTrip() {
		let request = {
			trip: vm.selectedTrip._id,
			tsNo: vm.selectedTrip.advSettled.tsNo
		};
		if(vm.aTrips.length == 1 && vm.selectedTrip && vm.selectedTrip._id && vm.selectedTrip.advSettled &&vm.selectedTrip.advSettled.tsNo){
			return swal('Error','Last trip of RT can not be remove','error');
		}else {

			tripServices.settleRemoveTrip(request, function (res) {
				if (res && res.data) {
					swal('Success', res.data.message, 'success');
					applyData(res.data);
					getAllTrip();
				}
			});
		}
	}

	function removeSettlementTrip(expid) {

		if(!expid){
			swal('Warning', "Please select atleast one expense row.", 'error');
		}
		else {
			let request = {
				_id: expid,
			};

			tripServices.removeSettlementTripExpense(request, function (res) {
				if (res && res.data) {
					swal('Success', res.data.message, 'success');
					vm.aSettle = []; // Empty the added settle array
					vm.selectedAdvType = undefined; // remove selected mark from advance summary table

					// update atrips with settled trip data
					res.data.data.forEach(oTrip => {
						vm.aTrips[vm.aTrips.findIndex(o => o._id === oTrip._id)] = oTrip;
					});

					vm.selectedTrip = vm.aTrips[0];
					vm.tableApi && vm.tableApi.refresh();
					vm.summary = res.data.summary;
				}
				else
				{
					swal('Fail', res.data.message, 'error');
				}
			});
		}
	}

	function markTripSettled(type) {

		if(!(vm.selectedTrip && vm.selectedTrip._id))
			return swal('Error', 'Select a Trip', 'error');

		if(!vm.aTrips[0].advSettled.tsNo)
			return swal('Error', 'Not a single Settlement Found', 'error');

		if(vm.aTrips) {
			let driver, flag1, flag2;
			vm.aTrips.forEach(obj => {
				driver = driver || obj.driver && obj.driver._id;
				if (!(obj.driver && obj.driver._id))
					flag1 = true;
				if (obj.driver && obj.driver._id != driver)
					flag2 = true;
			});
			if (flag1)
				return swal('Error', 'Driver not found on some of Trips', 'error');
			else if (flag2)
				return swal('Error', 'Driver should be same on all Trips', 'error');
		}

		$modal.open({
			templateUrl: 'views/myTripSettlement/settleTripCompletely.html',
			controller: ['$scope', '$uibModalInstance', 'DatePicker', 'callback', 'modelData', 'otherData', 'tripServices', settleTripCompPopupCtrl],
			controllerAs: 'sTCVm',
			resolve: {
				callback: function(){
					return function (data) {
						return new Promise(function (resolve, reject) {

							let request = {
								...data,
							};

							tripServices.markSettled(request, onSuccess, onFail);

							function onSuccess(res) {
								resolve(res);
								console.log(res);
								getAllTrip();
								swal('Success',res.data.message, 'success');
							}

							function onFail(err) {
								swal('Error',err.data.message,'error');
								reject();
								console.log(err);
							}
						});
					};
				},
				modelData: function(){
					return {
						dateLabel: 'Settlement',
						skipAccountCal: true
					};
				},
				otherData: function(){
					return {
						tsNo: vm.selectedTrip.advSettled.tsNo,
						aTrips: vm.aTrips,
						selectedTrip: vm.selectedTrip,
						type: type

					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			getAllTrip();

		}, function(data) {
			console.log('cancel',data);
		});

	}

	function printSummary() {

		return new Promise(function (resolve, reject) {

			if(!vm.tsNo)
				reject();


			clientService.getTripSummaryPreview({
				tsNo: vm.tsNo
			}, success, fail);

			function success(res) {
				// it resolve a obj with 2 key 'aTemplate' & 'html'
				resolve({
					html: res.data
				});
			}

			function fail(err) {
				swal('Error','Something Went Wrong','error');
				reject();
			}
		});
	}

	function printRTSummary() {

		$modal.open({
			templateUrl: 'views/myTripSettlement/rtSummary.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'otherData',
				function (
					$scope,
					$uibModalInstance,
					otherData
				){
					let vm = this;

					vm.closeModal = closeModal;

					(function init(){
						vm.aTrips = otherData.aTrips;
						vm.summary = otherData.summary;
						vm.aggrOfSupense = otherData.aggrOfSupense;
						vm.susRemark = otherData.susRemark;


						vm.aDriverDetails = vm.aTrips.find( o => (o.driver));
						if(vm.aDriverDetails){
							vm.aDriver = vm.aDriverDetails.driver.nameCode || vm.aDriverDetails.driver.name;
							vm.aDriver_expiry = vm.aDriverDetails.driver.license_expiry_date;
							if(vm.aDriverDetails.driver.blacklisted)
								vm.aDriverStatus = 'Not Active';
							else
								vm.aDriverStatus = 'Active';
						}else {
							vm.aDriverStatus = 'No Driver';
						}
					})();

					function closeModal() {
						$uibModalInstance.dismiss();
					}
				}
			],
			controllerAs: 'rtSummaryVm',
			resolve: {
				otherData: function(){
					return {
						aTrips: vm.aTrips,
						summary: vm.summary,
						aggrOfSupense: vm.aggrOfSupense,
						susRemark: vm.susRemark
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			applyData(response)

		}, function(data) {
			console.log('cancel',data);
		});

		// return new Promise(function (resolve, reject) {
		// 	if(!vm.tsNo) reject();
		// 	clientService.getRoundTripSummaryPreview({tsNo: vm.tsNo}, success, fail);
		// 	function success(res) {
		// 		// it resolve a obj with 2 key 'aTemplate' & 'html'
		// 		resolve({
		// 			html: res.data
		// 		});
		// 	}
		// 	function fail(err) {
		// 		swal('Error','Something Went Wrong','error');
		// 		reject();
		// 	}
		// });
	}

	function printRTDetailedSummary() {
		// $templateCache.remove('views/myTripSettlement/rtDetailSummary.html');
		let temp='';
		if($scope.$configs && $scope.$configs.tripSettlement && $scope.$configs.tripSettlement.rtDetailSinglePagePrint){
		temp='views/myTripSettlement/rtDetailSummarySp.html';
		} else{
			temp='views/myTripSettlement/rtDetailSummary.html';
		}
		$modal.open({
			templateUrl: temp,
			controller: [
				'$scope',
				'$uibModalInstance',
				'otherData',
				function (
					$scope,
					$uibModalInstance,
					otherData
				){
					let vm = this;

					vm.closeModal = closeModal;

					(function init(){
						vm.aTrips = otherData.aTrips;
						vm.aAdvances = otherData.aAdvances;
						vm.aExpense = otherData.aExpense;
						vm.summary = otherData.summary;
						vm.aggrOfSupense = otherData.aggrOfSupense;
						vm.susRemark = otherData.susRemark;

						vm.aDriverDetails = vm.aTrips.find( o => (o.driver));
						if(vm.aDriverDetails){
							vm.aDriver = vm.aDriverDetails.driver.nameCode || vm.aDriverDetails.driver.name;
							vm.aDriver_expiry = vm.aDriverDetails.driver.license_expiry_date;
							if(vm.aDriverDetails.driver.blacklisted)
								vm.aDriverStatus = 'Not Active';
							else
								vm.aDriverStatus = 'Active';
						}else {
							vm.aDriverStatus = 'No Driver';
						}
					})();

					function closeModal() {
						$uibModalInstance.dismiss();
					}
				}
			],
			controllerAs: 'rtDetSummaryVm',
			resolve: {
				otherData: function(){

					let aExpense = [];
					let aAdvances = [];

					vm.aTrips.forEach(oTrip => {
						aExpense.push(...oTrip.trip_expenses);
					});

					if($scope.$configs.tripSettlement && $scope.$configs.tripSettlement.settleLitreWise){
					vm.aAdvances.forEach(adv => {
						if(adv.advanceType!= 'Fastag')
						aAdvances.push(adv);
					});}
					else{aAdvances = vm.aAdvances;}

					return {
						aTrips: vm.aTrips,
						aAdvances,
						aExpense,
						summary: vm.summary,
						aggrOfSupense: vm.aggrOfSupense,
						susRemark: vm.susRemark
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			applyData(response)

		}, function(data) {
			console.log('cancel',data);
		});


		// return new Promise(function (resolve, reject) {
		// 	if(!vm.tsNo) reject();
		// 	clientService.getRoundTripDetailedSummaryPreview({tsNo: vm.tsNo}, success, fail);
		// 	function success(res) {
		// 		// it resolve a obj with 2 key 'aTemplate' & 'html'
		// 		resolve({
		// 			html: res.data
		// 		});
		// 	}
		// 	function fail(err) {
		// 		swal('Error','Something Went Wrong','error');
		// 		reject();
		// 	}
		// });
	}

	function previewSettlement(key) {


		$modal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'tripServices',
				'excelDownload',
				'otherData',
				function(
					$scope,
					$uibModalInstance,
					tripServices,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;


					if(key === "tripsheet_Preview"){
						$scope.aTemplate = $scope.$configs.Bill.tripsheetPreview;
					}
					else{
						$scope.aTemplate = $scope.$configs.Bill.tripSettlement;
					}

					$scope.templateKey = $scope.aTemplate[0];

					$scope.getGR = function(templateKey = 'default_') {

						var oFilter = {
							_id: vm.aTrips[0] && vm.aTrips[0]._id,
							tsNo: vm.aTrips[0].advSettled && vm.aTrips[0].advSettled.tsNo,
							tempName: templateKey
						};
						if(key === "tripsheet_Preview")
							oFilter.tripsheet = true;

						tripServices.getTripSettlPreview(oFilter, success, fail);
					};

					$scope.getGR($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error','Something Went Wrong','error');
						$scope.closeModal();
					}

					$scope.closeModal = function() {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function() {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id){
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					return {
						_id: vm.aTrips[0]._id,
						tsNo: vm.aTrips[0].advSettled && vm.aTrips[0].advSettled.tsNo,
					};
				}
			}
		});
	};

	function setAmount(amt) {
		vm.oSettle.amount = vm.oSettle.diesel_info.amount = amt;
	}

	function showAdvances(type) {

		let otherObj = {
			advType: type,
			selectedTrip: vm.selectedTrip,
			aAdvances: vm.aAdvances,
			isAdvModified: false
		};

		if (!vm.selectedTrip) {
			swal('Warning', 'No Trip Selected', 'warning');
			return;
		}

		$modal
			.open({
				templateUrl: 'views/myTripSettlement/settleAdvancesPopup.html',
				controller: ['$modal','$uibModalInstance', 'modelDetail', 'orderByFilter', 'otherObj', settleAdvancesPopupCtrl],
				controllerAs: 'settleAdvPopupVm',
				resolve: {
					modelDetail: function () {
						return {};
					},
					otherObj: function () {
						return otherObj;
					}
				}
			})
			.result
			.then(function (response) {
				// console.log('success', data);
			}, function (data) {
				// console.log('cancel', data);
				if(otherObj.isAdvModified){
					getAllTrip();
				}
			});
	}

	function showSuspense(type) {

		let otherObj = {
			aTrips: vm.aTrips,
			aSuspense: vm.aSuspense,
			isSuspenseModified: false
		};

		$modal
			.open({
				templateUrl: 'views/myTripSettlement/suspensePopup.html',
				controller: ['$uibModalInstance', 'DatePicker', 'dateUtils', 'lazyLoadFactory', 'modelDetail', 'objToCsv', 'orderByFilter', 'otherObj', 'tripServices', supensePopupCtrl],
				controllerAs: 'suspensPopupVm',
				resolve: {
					modelDetail: function () {
						return {};
					},
					otherObj: function () {
						return otherObj;
					}
				}
			})
			.result.then(function (response) {
				console.log('success', data);
			}, function (data) {
				console.log('cancel', data);
				if(otherObj.isSuspenseModified){
					getAllTrip();
				}
			});
	}

	function submit() {
		let request = {
			aSettle: vm.aSettle.map(o => {
				let account_data;
				if(vm.noVoucherCreate)
					account_data = {
						from: o.account_data.from._id,
						fromName: o.account_data.from.name,
						to: o.account_data.to._id,
						toName: o.account_data.to.name
					};
				else
					account_data = false;

				return {
					...o,
					account_data,
					remark: (o.remark ? o.remark : '')
				};
			}),
			aTrips: vm.aTrips.map(o => o._id)
		};
		vm.disableSubmit = true;
		tripServices.settleTrip(request, successCallback, failureCallback);

		function failureCallback(res) {
			swal('', res.data.message, 'error');
			console.log(res);
			vm.disableSubmit = false;
		}

		function successCallback(res) {
			swal('', res.data.message, 'success');
			vm.disableSubmit = false;
			getAllTrip();
			// vm.aSettle = []; // Empty the added settle array
			// vm.selectedAdvType = undefined; // remove selected mark from advance summary table

			// update atrips with settled trip data
			// res.data.data.forEach(oTrip => {
			// 	vm.aTrips[vm.aTrips.findIndex(o => o._id === oTrip._id)] = oTrip;
			// });

			// vm.selectedTrip = vm.aTrips[0];
			// vm.tableApi && vm.tableApi.refresh();
			// vm.summary = res.data.summary;
			// updateTripSummary();
		}
	}

	function updateTripSummary() {

		vm.aAdvances = [];
		vm.isAdvanceVoucherGen = true;
		vm.advSummary = {};
		vm.settleSummary = {};
		let i = 0;


		vm.aTrips.forEach(obj => {
			try {

				//advance summary
				let tempObj = {};


				obj.advanceBudget.forEach(o => {

					tempObj[o.advanceType] = tempObj[o.advanceType] || 0;
					tempObj[o.advanceType] += o.amount;
					if(!(vm.advanceTyp.find( obj => obj === o.advanceType)))
						vm.advanceTyp[i++] = o.advanceType;

					vm.advSummary[o.advanceType] = vm.advSummary[o.advanceType] || {
						amt: 0,
						settleAmt: {
							amt: 0,
							lit: 0
						}
					};
					if($scope.$configs && $scope.$configs.tripSettlement && $scope.$configs.tripSettlement.settleLitreWise && o.advanceType === 'Fastag'){
						vm.advSummary[o.advanceType].amt += o.cloneAmount;
						o.amount = o.cloneAmount;
					}
					else
					   vm.advSummary[o.advanceType].amt += o.amount;


					// check if any of advance has voucher or not
					if(vm.isAdvanceVoucherGen)
						vm.isAdvanceVoucherGen = !!o.voucher;

					o.trip_Id = obj._id;
					o.trip_no = obj.trip_no;

					vm.aAdvances.push(o);
				});

				obj.segAdvBudget = tempObj;
				tempObj = {};

				//Settlement summary

				obj.trip_expenses.forEach(o => {

					tempObj[o.type] = tempObj[o.type] || 0;
					tempObj[o.type] += o.amount;
					if(!(vm.advanceTyp.find( obj => obj === o.advanceType)))
						vm.advanceTyp[i++] = o.advanceType;

					vm.advSummary[o.advanceType] = vm.advSummary[o.advanceType] || {
						amt: 0,
						settleAmt: {
							amt: 0,
							lit: 0
						}
					};

					vm.advSummary[o.advanceType].settleAmt.amt += o.amount;
					vm.advSummary[o.advanceType].settleAmt.lit += o.dieseInfo && o.dieseInfo.litre || 0;

					vm.settleSummary[o.type] = vm.settleSummary[o.type] || {
						amt: 0,
						lit: 0
					};

					vm.settleSummary[o.type].amt += o.amount;
					vm.settleSummary[o.type].lit += o.diesel_info && o.diesel_info.litre || 0;
				});

				obj.segSettlement = tempObj;

			} catch (e) {
				console.log(e);
			}
		});
	}

	function uploadLoadingSlip(loading_slip) {
		//console.log(loading_slip);
		var fd = new FormData();
		fd.append('loading_slip', loading_slip);
		var data = {};
		data.fileUpload = true;
		data.formData = fd;
		data._id = vm.selectedTrip._id;
		tripServices.uploadSlip(data, successLoc, failureLoc);

		function successLoc(res) {
			if (res && res.data && (res.data.status == 'OK')) {
				vm.selectedTrip = vm.aTrips[vm.aTrips.findIndex(o => o._id === vm.selectedTrip._id)] = res.data.data;
				swal('Updated', res.data.message, 'success');
			} else {
				swal('Error', res.data.message, 'error');
			}
		}

		function failureLoc(res) {
			var msg = res.data.message;
			swal('Error', msg, 'error');
		}
	}

	function upsertTripSettlement(oTripSettlement) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myTripSettlement/tripSettlementUpsert.html',
			controller: 'tripSettlementUpsertController',
			resolve: {
				'selectedTripSettlement': function () {
					return oTripSettlement;
				}
			}
		});

		modalInstance.result.then(function (response) {
			if (response)
				vm.oTripSettlement = response;
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	function rowSelect(key) {

		vm.selectedAdvType = key;

		vm.oSettle = {
			person: vm.aDriver[0],
			advanceType: key,
			account_data: {
				to: {},
				from: {}
			},
			diesel_info: {},
			amount: 0
		};
	}

	//////////////////////////////////////////////////
}

function settleAdvancesPopupCtrl(
	$modal,
	$uibModalInstance,
	modelDetail,
	orderByFilter,
	otherObj
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.editAndSettle = editAndSettle;
	vm.moveToSuspense = moveToSuspense;
	vm.settleAll = settleAll;

	// init
	(function init() {

		vm.aSelectedAdv = [];

		vm.columnSetting = {
			allowedColumn: [
				'Type',
				'Trip No.',
				'Person',
				'reference no',
				'Date',
				'Amount',
				'Vendor Name',
				// 'Station',
				'Liter',
				'Rate',
				// 'created At',
				'Entry By',
				'Remark',
				'Voucher Created'
			]
		};
		vm.tableHead = [
			{
				'header': 'Type',
				'bindingKeys': 'advanceType',
			},
			{
				'header': 'Trip No.',
				'bindingKeys': 'trip_no',
			},
			{
				'header': 'Person',
				'bindingKeys': 'person'
			},
			{
				'header': 'reference no',
				'bindingKeys': 'reference_no',
				'date': false
			},
			{
				'header': 'Date',
				'bindingKeys': "date",
				'date': true
			},
			{
				'header': 'Amount',
				'bindingKeys': 'amount'
			},
			{
				'header': 'Vendor Name',
				'bindingKeys': 'dieseInfo.vendor.name'
			},
			{
				'header': 'Station',
				'bindingKeys': 'dieseInfo.station.address'
			},
			{
				'header': 'Liter',
				'bindingKeys': 'dieseInfo.litre'
			},
			{
				'header': 'Rate',
				'bindingKeys': 'dieseInfo.rate'
			},
			{
				'header': 'created At',
				'bindingKeys': 'created_at',
				'date': true
			},
			{
				'header': 'Entry By',
				'bindingKeys': 'createdBy ||created_by.full_name'
			},
			{
				'header': 'Remark',
				'bindingKeys': '(narration || "").concat("  ",(remark || ""))'
			},
			{
				'header': 'Voucher Created',
				'filter': {
					'name': 'toBoolean',
					'aParam': [
						'voucher',
						true
					]
				}
			}
		];
		// TODO ja-Table is to modified to use this featuer
		// vm.coloredRow = [{
		// 	key: 'amount',
		// 	value: '1',
		// 	valueType: 'number',
		// 	bgColor: '#e28787',
		// 	color: 'white'
		// }];

		vm.advType = otherObj.advType;
		vm.selectedTrip = otherObj.selectedTrip;
		// vm.aAdvances = otherObj.aAdvances;

		vm.aAdvances = orderByFilter(otherObj.aAdvances, ['date','advanceType']);

		// vm.aAdvances.sort((a,b) => {
		// 	if (new Date(a.date).getTime() > new Date(b.date).getTime()) return 1;
		// 	if (new Date(a.date).getTime() < new Date(b.date).getTime()) return -1;
		// 	return 0;
		// });

	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function editAndSettle() {

		if (vm.aSelectedAdv.length === 0) {
			swal('Warning', 'Select a Advance', 'warning');
			return;
		}

		if (vm.aSelectedAdv.length > 0) {
			swal('Warning', 'Select Single Advance', 'warning');
			return;
		}

		// TODO remove
		console.log('edit and settle');
	}


	function moveToSuspense() {
		if (!vm.oSelectedAdv.length)
			return swal('Warning', 'No Row Selected', 'warning');

		// if(!vm.oSelectedAdv.linkable)
		// 	return swal('Warning', 'Advance Cannot be Move to Suspence, Because it Advance Contra Entry', 'warning');

		$modal.open({
			templateUrl: 'views/myTripSettlement/suspenseRemarkPopUp.html',
			controller: ['$uibModalInstance', 'otherData', 'tripServices', suspenseRemarkPopUpCtrl],
			controllerAs: 'sRVm',
			resolve: {
				otherData: function(){
					return {
						oSelectedAdv: vm.oSelectedAdv
					};
				}
			}
		}).result.then(function(response) {
			console.log('close',response);
			otherObj.isAdvModified = true;
			vm.aAdvances = vm.aAdvances.filter( o => o._id != vm.oSelectedAdv._id);
			vm.tableApi && vm.tableApi.refresh();

			// $uibModalInstance.dismiss();
		}, function(data) {
			console.log('cancel',data);
		});
	}

	function settleAll() {

		if (vm.aSelectedAdv.length === 0) {
			swal('Warning', 'Select at least one Advance', 'warning');
			return;
		}

		if (vm.aSelectedAdv.length > 0) {
			swal('Warning', 'Select Single Advance', 'warning');
			return;
		}

		// TODO remove
		console.log('settle all');
	}

}

function supensePopupCtrl(
	$uibModalInstance,
	DatePicker,
	dateUtils,
	lazyLoadFactory,
	modelDetail,
	objToCsv,
	orderByFilter,
	otherObj,
	tripServices
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.deleteSupense = deleteSupense;
	vm.getSuspense = getSuspense;
	vm.mapTrip = mapTrip;

	// init
	(function init() {

		vm.aSelectedAdv = [];
		vm.lazyLoad = lazyLoadFactory();
		vm.DatePicker = angular.copy(DatePicker);

		vm.columnSetting = {
			allowedColumn: [
				'Type',
				// 'Trip No.',
				// 'Person',
				'Date',
				'Amount',
				'Vendor Name',
				// 'Station',
				'Liter',
				'Rate',
				// 'created At',
				'Entry By',
				'Ref No.',
				'Remark',
				'SuspenseRemark',
				'Suspense By User',
				// 'Voucher Created'
			]
		};
		vm.tableHead = [
			{
				'header': 'Type',
				'bindingKeys': 'advanceType',
			},
			{
				'header': 'Trip No.',
				'bindingKeys': 'trip_no',
			},
			{
				'header': 'Person',
				'bindingKeys': 'person'
			},
			{
				'header': 'Date',
				'bindingKeys': "date",
				'date': true
			},
			{
				'header': 'Amount',
				'bindingKeys': 'amount'
			},
			{
				'header': 'Vendor Name',
				'bindingKeys': 'dieseInfo.vendor.name'
			},
			{
				'header': 'Station',
				'bindingKeys': 'dieseInfo.station.address'
			},
			{
				'header': 'Liter',
				'bindingKeys': 'dieseInfo.litre'
			},
			{
				'header': 'Rate',
				'bindingKeys': 'dieseInfo.rate'
			},
			{
				'header': 'created At',
				'bindingKeys': 'created_at',
				'date': true
			},
			{
				'header': 'Entry By',
				'bindingKeys': 'created_by.full_name'
			},
			{
				'header': 'Remark',
				'bindingKeys': 'remark'
			},
			{
				'header': 'Ref No.',
				'bindingKeys': 'reference_no',
				'date': false
			},{
				'header': 'Suspense By User',
				'bindingKeys': 'unmapHistory[unmapHistory.length-1].user_name'
			},
			{
				'header': 'SuspenseRemark',
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'unmapHistory',
						'"suspenseRemark"',
					]
				}
			},
			{
				'header': 'Voucher Created',
				'filter': {
					'name': 'toBoolean',
					'aParam': [
						'voucher',
						true
					]
				}
			}
		];

		vm.aTrips = orderByFilter(otherObj.aTrips.map(oTrip => {
			oTrip.tripStartDate = (oTrip.statuses.find(oStatus => oStatus.status === 'Trip started') || {}).date;
			oTrip.tripEndDate = (oTrip.statuses.find(oStatus => oStatus.status === 'Trip ended') || {}).date;
			return oTrip;
		}), 'tripStartDate', true);

		vm.from = vm.aTrips[vm.aTrips.length-1].tripStartDate;
		vm.to = vm.aTrips[0].tripEndDate;
		// getSuspense();
		vm.aTripSuspense = otherObj.aSuspense;
		if(vm.aTripSuspense && vm.aTripSuspense.length)
			vm.skipCount = 1;
	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function deleteSupense() {
		if(vm.aSelectedSuspense.length!==1){
			swal('Error', 'Please Select single susense to delete', 'error');
			return;
		}

		if (vm.aSelectedSuspense[0].voucher) {
			swal('Warning', 'Advance Cannot Be Deleted.', 'warning');
			return;
		}

		swal({
				title: 'Are you sure you want to delete this advance?',
				// text: '1. GST Not Registerd',
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
					tripServices.deleteAdvance({
						_id: vm.aSelectedSuspense[0]._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						vm.aTripSuspense = vm.aTripSuspense.filter( o => o._id !== vm.aSelectedSuspense[0]._id);
						vm.aSelectedSuspense = [];
						vm.tableApi && vm.tableApi.refresh();
					}
				}
			});
	}

	function getSuspense(isGetActive) {

		if(!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = {
			from: dateUtils.setHours(vm.from, 0, 0, 0),
			to: dateUtils.setHours(vm.to, 23, 59, 59),
			vehicle_no: vm.aTrips[0].vehicle.vehicle_reg_no,
			trip: {$exists:false},
			linkable: true,
			skip: vm.lazyLoad.getCurrentPage(),
			sort: {
				date: 1
			}
		};

		if(vm.skipCount){
			vm.skipCount = 0;
			oFilter.skip += vm.skipCount;
			}

		if(vm.advanceType){
			oFilter.advanceType = vm.advanceType;
			vm.selectType = 'index';
		}

		tripServices.tripAdvances(oFilter, function (res) {
			if (res && res.data) {

				res = res.data;

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);

			}
		});
	}

	function mapTrip() {

		// let voucherTrips = vm.aSelectedSuspense.filter(t => t.voucher);
        //
		// if (voucherTrips.length) {
		// 	swal('Warning', `Advance Can\'t Be Re-mapped, voucher created of trip ${voucherTrips.map(t => t.trip_no).join(', ')}`, 'warning');
		// 	return;
		// }
		if(!vm.tripId && vm.aTrips && vm.aTrips.length === 1)
			vm.tripId = vm.aTrips[0]._id;
		else if(!vm.tripId)
			return swal('Error', 'please select trip on which you map Suspense','error')

		swal({
				title: 'Are you sure you want to remap trip on selected advances?',
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
					tripServices.mapTripOnAdv({ _id: vm.aSelectedSuspense.map(t => t._id), trip: vm.tripId }, onSuccess, onFailure);
					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						vm.aSelectedSuspense = [];

						const header = [
							'ADVANCE DATE',
							'ADVANCE TYPE',
							'REFERENCE NO',
							'VEHICLE NO',
							'REJECTION REASON'
						];

						const body = (res.data.stats || []).map(o => header.map( s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));

						if(body.length)
							objToCsv('AdvancesLog', header, body);
						getSuspense();
						otherObj.isSuspenseModified = true;
					}
					function onFailure(err) {
						swal('Error', err.data.message, 'error');
						vm.aSelectedSuspense = [];

						const header = [
							'ADVANCE DATE',
							'ADVANCE TYPE',
							'REFERENCE NO',
							'VEHICLE NO',
							'REJECTION REASON'
						];

						const body = (err.data.stats || []).map(o => header.map( s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));

						objToCsv('AdvancesLog', header, body);
					}
				}
			});
	}

}

function suspenseRemarkPopUpCtrl(
	$uibModalInstance,
	otherData,
	tripServices,
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.setModalWidth = setModalWidth;

	// init
	(function init() {
		vm.isDisabled = false;
		vm.oSelectedAdv = otherData.oSelectedAdv;
	})();

	// Actual Function

	function setModalWidth() {
		$('.modal-dialog:has(form[name="suspenseRemark"])').attr('id','suspenseRemarkId');
	}

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit() {

         let request = {
			 advance: vm.oSelectedAdv,
			 suspenseRemark: vm.suspenseRemark
		 };
		vm.isDisabled = true;
		tripServices.unmapAdvFromTrip(request, successCallback, failureCallback);

		function failureCallback(err) {
			vm.isDisabled = false;
			swal('Error', err.data.message, 'error');
		}

		function successCallback(res) {
			vm.isDisabled = false;
			console.log(res);
			swal('Success', res.data.message, 'success');
			$uibModalInstance.close(res.data);
		}
	}

}

function addKilometerPopupCtrl(
	$scope,
	$uibModalInstance,
	otherData,
	tripServices,
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.submit = submit;

	// init
	(function init() {
		vm.selectedTrip = otherData.selectedTrip;
		vm.max = $scope.$configs.tripSettlement && $scope.$configs.tripSettlement.addKMlimit || $scope.$constants.addKMlimit;
		vm.min = -(vm.max)
	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {

		if(vm.kilometer === 0){
			swal('Error','Value cannot be 0','error');
			return;
		}

		console.log(formData);
		if(formData.$valid){

			let request = {
				_id: otherData.selectedTrip._id,
				extraKm: vm.selectedTrip.extraKm,
				summary: true
			};

			tripServices.update(request, onSuccess, onFailure);

			function onFailure(err) {
				swal('Error', err.data.message, 'error');
				reject(err.data.message);
			}

			function onSuccess(res) {
				console.log(res);
				swal('Success',res.data.message, 'success');
				$uibModalInstance.close(res.data);
			}

		}else{
			swal('Error','All Mandatory Fields are not filled','error');
		}
	}

}


function accountManagerRemarkPopupCtrl(
	$uibModalInstance,
	otherData,
	tripServices,
	$scope
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.currentDate = new Date();

	// init
	(function init() {
		vm.selectedTrip = otherData.selectedTrip;
	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}


	function submit(formData) {

		if(vm.remark === 0){
			swal('Error','Remark is required.','error');
			return;
		}
		//&& vm.selectedTrip.advSettled && vm.selectedTrip.advSettled.tsNo
		if(vm.selectedTrip && vm.selectedTrip.advSettled && !vm.selectedTrip.advSettled.tsNo){
			swal('Error','RT number not found.','error');
			return;
		}



		console.log(formData);
		if(formData.$valid){

			let request = {
				remark: vm.remark,
			   tsNo: vm.selectedTrip.advSettled.tsNo,
			};

		   tripServices.settleAccManagerRmk(request, onSuccess, onFailure);

			function onFailure(err) {
				swal('Error', err.data.message, 'error');
				reject(err.data.message);
			}

			function onSuccess(res) {
				console.log(res);
				swal('Success',res.data.message, 'success');
				$uibModalInstance.close(res.data);
			}

		}else{
			swal('Error','All Mandatory Fields are not filled','error');
		}
	}

}

function settleTripCompPopupCtrl(
	$scope,
	$uibModalInstance,
	DatePicker,
	callback,
	modelData,
	otherData,
	tripServices,
) {

	let vm = this;

	// function identifier
	vm.closeModal = closeModal;
	vm.submit = submit;




	// init
	(function init() {
		vm.updateDate = false;
		vm.DatePicker = angular.copy(DatePicker);
		vm.selectedTrip = angular.copy(otherData.selectedTrip);
		vm.type = angular.copy(otherData.type);
		vm.closingBal = angular.copy(otherData.closingBal) || 0;
		if(vm.selectedTrip && vm.selectedTrip.markSettle && vm.selectedTrip.markSettle.date)
			vm.markDate = vm.date = new Date(vm.selectedTrip.markSettle.date);
		else
			vm.minDate = new Date(otherData.aTrips.slice(-1)[0].tripEnded);
		// containing all driver A/C on entire round trip
		vm.aDriver = [];
		// vm.aHappay = [];
		// vm.aFastag = [];

		vm.dateLabel = modelData.dateLabel || 'Audit';
		// pre-fill the audit date in modal
		if(otherData && otherData.aTrips && otherData.aTrips[0] && otherData.aTrips[0].markSettle && otherData.aTrips[0].markSettle.date)
			vm.date = new Date(otherData && otherData.aTrips && otherData.aTrips[0] && otherData.aTrips[0].markSettle &&
				otherData.aTrips[0].markSettle.date);

		vm.skipAccountCal = modelData.skipAccountCal || false;

		if(!vm.skipAccountCal){
			vm.tripStarted = otherData.aTrips[0].tripStarted;
			vm.tripEnded = otherData.aTrips[otherData.aTrips.length-1].tripEnded;

			otherData.aTrips.forEach(oTrip => {

                vm.vehicle = oTrip.vehicle && oTrip.vehicle._id;
				let $driver = oTrip.driver && oTrip.driver.account || false;
				// all Settlement will be done on drive now
				// let $happay = oTrip.driver && oTrip.driver.happay || false;
				// let $fastag = oTrip.vehicle && oTrip.vehicle.fasttag || false;

				if($driver && !vm.aDriver.find(o => o._id === $driver._id))
					vm.aDriver.push($driver);

				// if($happay && !vm.aHappay.find(o => o._id === $happay._id))
				// 	vm.aHappay.push($happay);
                //
				// if($fastag && !vm.aFastag.find(o => o._id === $fastag._id))
				// 	vm.aFastag.push($fastag);
			});

			if(!vm.aDriver.length){
				swal('Error', 'Driver A/c not linked', 'error');
				closeModal();
				return;
			}

			// if(!vm.aHappay.length){
			// 	swal('Error', 'Happay A/c not linked', 'error');
			// 	closeModal();
			// 	return;
			// }
            //
			// if(!vm.aFastag.length){
			// 	swal('Error', 'Fastag A/c not linked', 'error');
			// 	closeModal();
			// 	return;
			// }

			//putting the first driver on entire trip
			vm.aDriver[0].fromDate = new Date(vm.tripStarted);
			vm.aDriver[0].toDate = new Date(vm.tripEnded);

			// vm.aHappay[0].fromDate = new Date(vm.tripStarted);
			// vm.aHappay[0].toDate = new Date(vm.tripEnded);
            //
			// vm.aFastag[0].fromDate = new Date(vm.tripStarted);
			// vm.aFastag[0].toDate = new Date(vm.tripEnded);
		}

		if($scope.$role['Trip Settlement']['Update MarkSettle Date']){
			vm.updateDate = true;
			vm.minDate = new Date(otherData.aTrips.slice(-1)[0].tripEnded);
		}

			})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit(formData) {

		if(typeof callback === 'function'){
			callback({
				date: vm.date,
				remark: vm.remark,
				tsNo: otherData.tsNo,
			})
				.then(function (res) {
					$uibModalInstance.close(res.data);
				})
				.catch(function (err) {
					console.log(err);
				});

			return;
		}

		let summaryAdvObj = otherData.aTripsSummary.netAdvObj;
		let summaryExp = otherData.aTripsSummary.netExpense;
		let aVoucher = [];

		let oAdv = {
			'fastag': "Fastag",
			'happay': "Happay",
			"diesel": "Diesel",
			"driverCash" : "Driver Cash"
		};

		let counter = 0;
		for(let k in summaryAdvObj)
			if(summaryAdvObj.hasOwnProperty(k)
				&& ['fastag', 'happay', 'vendor', 'diesel', 'driverCash'].indexOf(k)+1
				&& summaryAdvObj[k] != 0){

				if(!shouldCreateVoucher(oAdv[k]))
					continue;

				aVoucher.push({
					amount: summaryAdvObj[k],
					from: $scope.$clientConfigs.accountDetails.internalDriver,
					to: vm.aDriver[0]._id,
					narration: `Advance for RT-${otherData.tsNo} for ${k}`,
					refNo: `RT-${otherData.tsNo}/${Date.now()+ ++counter}`,
					vT: `Dr ${k}`
				});
			}

		aVoucher.push({
			amount: summaryExp,
			from: vm.aDriver[0]._id,
			to: $scope.$clientConfigs.accountDetails.internalExpense,
			narration: `Expense for RT-${otherData.tsNo}`,
			refNo: `RT-${otherData.tsNo}/${Date.now()+ ++counter}`,
			vT: 'Dr Expense'
		});

		console.log(formData);

		if(formData.$valid){

			let request = {
				date: vm.date,
				openingBal: vm.aDriver[0].balance - otherData.aTripsSummary.driverIncentiveVch,
				closingBal: vm.closingBal,
				remark: vm.remark,
				tsNo: otherData.tsNo,
				vehicle: vm.vehicle,
				aVoucher
			};

			tripServices.settleCompletely(request, onSuccess);

			function onSuccess(res) {
				console.log(res);
				swal('Success',res.data.message, 'success');
				$uibModalInstance.close(res.data);
			}

		}else{
			swal('Error','All Mandatory Fields are not filled','error');
		}
	}

	function shouldCreateVoucher(advanceType){
		let fdType = ($scope.$constants.expenseObj && $scope.$configs.master.expenseObj || []).find(o => o.name === advanceType);

		if(fdType && fdType.settle && fdType.settle.dont)
			return false;

		return true;
	}

}

function addTripOnSettlement(
	$uibModalInstance,
	lazyLoadFactory,
	otherData,
	tripServices,
) {

	let vm = this;

	// function identifer
	vm.closeModal = closeModal;
	vm.getTrips = getTrips;
	vm.submit = submit;

	// init
	(function init() {
		vm.lazyLoad = lazyLoadFactory();
		vm.start = angular.copy(otherData.start);
		vm.end = angular.copy(otherData.end);
		vm.columnSetting = {
			allowedColumn: [
				'Trip No',
				'RT No',
				'Allocation Date',
				'TripStart',
				'TripEnd',
				'Consignor',
				'Gr No',
				'Route'
			]
		};
		vm.tableHead = [
			{
				'header': 'Allocation Date',
				'bindingKeys': 'allocation_date',
				'date': true
			},
			{
				'header': 'RT No',
				'bindingKeys': 'advSettled.tsNo',
				'date': true
			},
			{
				'header': 'TripStart',
				'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
				'date': true
			},
			{
				'header': 'TripEnd',
				'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy \'at\' h:mma")',
				'date': true
			},
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			{
				'header': 'Consignor',
				'bindingKeys': 'gr[0].consignor.name'
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
				'header': 'Route',
				'bindingKeys': 'route_name || rName'
			}
		];
		getTrips();
	})();

	// Actual Function

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getTrips(isGetActive) {

		if(!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		tripServices.getAllTripsWithPagination(oFilter, function (res) {
			if (res && res.data) {
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);

			}
		});
	}

	function prepareFilter() {
		let requestFilter = {};

		if(vm.start)
			requestFilter.from = vm.start;
		if(vm.end)
			requestFilter.to = vm.end;

		if (vm.tripNo)
			requestFilter.trip_no = vm.tripNo;

		requestFilter.dateType = 'allocation_date';
		requestFilter.status = "Trip ended";

		requestFilter.vehicle_no = otherData.vehicle_no;

		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 10;
		return requestFilter;
	}

	function submit() {
		if(vm.selectedTrip && vm.selectedTrip._id){

			if(vm.selectedTrip.advSettled && vm.selectedTrip.advSettled.tsNo){
				return swal('Error', 'Selected Trip already has RT Number', 'error');
			}

			let request = {
				trip: vm.selectedTrip._id,
				tsNo: otherData.tsNo
			};

			tripServices.settleAddTrip(request, function (res) {
				if (res && res.data) {
					swal('Success', res.data.message, 'success');
					$uibModalInstance.close(res.data);
				}
			});

		}else{
			swal('Error','Select a Trip to add','error');
		}
	}

}

function paymentsController(
	$uibModalInstance,
	accountingService,
	branchService,
	billBookService,
	DatePicker,
	narrationService,
	otherDetail,
	tripServices,
	$scope,
) {

	let vm = this;
	vm.driverPaymentsConfig = $scope.$configs && $scope.$configs.driverPayments;

	// functions Identifiers
	vm.closePopup = closePopup;
	vm.submit = submit;
	vm.fromAccount = fromAccount;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.onBranchSelect = onBranchSelect;
	vm.setPaymentType = setPaymentType;
	vm.deletePayment = deletePayment;
	vm.getRefNo = getRefNo;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.driverPaymentEdit = driverPaymentEdit;
	vm.onRefSelect = onRefSelect;
	vm.clear = clear;
	vm.getGr = tripServices.getGr;

	// INIT functions

	(function init() {

		vm.aDriverPaymentType = $scope.$configs.driverPayments && $scope.$configs.driverPayments.aDriverPaymentType || $scope.$constants.aDriverPaymentType;
		vm.DatePicker = angular.copy(DatePicker);
		vm.minDate = new Date();
		vm.minDate.setMonth(3);
		vm.minDate.setDate(1);
		if(new Date().getMonth() < 3){
			vm.minDate.setFullYear(vm.minDate.getFullYear() - 1);
		}
		vm.oVoucher = {
			branch: vm.driverPaymentsConfig && vm.driverPaymentsConfig.branch,
			type: 'Journal'
		};
		vm.driverAccount = otherDetail.driverAccount || false;
		if(!vm.driverAccount){
			swal('Error', 'Driver A/c not found', 'error',);
			return closePopup();
		}
		vm.trip = otherDetail.trip;
		vm.aPayment = otherDetail.payments;
		vm.totDrSecurity = otherDetail.aTripsSummary.totDrSecurity || 0;
		vm.aTrips = otherDetail.allTrip;
		vm.driver = vm.aTrips[0].driver;
		vm.hideFrom = false;
		vm.hideTo = false;
		vm.oVoucher.billDate = new Date(vm.aTrips[0].tripStartDate || vm.aTrips[0].start_date);
		vm.billBookId = $scope.$configs.driverPayments.branch && $scope.$configs.driverPayments.branch.billBook

	})();

	// Actual Functions
	// Close the modal
	function closePopup() {
		$uibModalInstance.dismiss();
	}

	function getRefNo(viewValue) {

		if(!vm.billBookId)
			return [];

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
				status: "unused"
			};

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

	function onRefSelect(item, model , label) {
		vm.selectedRefNo = item;
	}

	function getAutoStationaryNo() {

		if(!vm.billBookId)
			return [];

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'onBook',
			"status": "unused"
		};

		if (vm.oVoucher.billDate)
			// req.useDate = moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oVoucher.refNo = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
		}
	}

	function driverPaymentEdit(payment) {

		vm.oVoucher = {
			_id: payment._id,
			paymentType: payment.vT,
			type: payment.type,
			from: {
				_id: payment.ledgers[0].account,
				name: payment.ledgers[0].lName
			},
			to: {
				_id: payment.ledgers[1].account,
				name: payment.ledgers[1].lName
			},
			amount: payment.ledgers[0].amount,
			oldAmt: payment.ledgers[0].amount,        // amount befour edit
			rate: payment.drPay && payment.drPay.rate,
			liter: payment.drPay && payment.drPay.liter,
			refNo: payment.refNo,
			stationaryId: payment.stationaryId,
			billDate: payment.date,
			narration: payment.narration,
			gr: payment.gr,
			branch: {_id: payment.branch, name: payment.branchName}
		};

		vm.selectedRefNo = {
			_id: payment.stationaryId,
			bookNo: payment.refNo
		};
		$scope.$configs.driverPayments.aDriverPaymentType.find(o => {
			if(o.pType === vm.oVoucher.paymentType){
				vm.oPaymentType = o;
				vm.aVouchersType = vm.oPaymentType.voucherType;
				return true;
			}
			return false;
		});

		vm.oPaymentType = vm.aDriverPaymentType.find(o => o.pType === payment.vT);

		checkPaymentType();

		if (vm.oVoucher && vm.oVoucher.billDate)
			vm.oVoucher.billDate = new Date(vm.oVoucher.billDate);

	}

	function clear() {
		vm.oVoucher = {
			branch: vm.driverPaymentsConfig && vm.driverPaymentsConfig.branch,
			type: 'Journal'
		};

	}

	function deletePayment(payment) {
		if(!(payment && payment._id))
			return swal('Error!', 'Select at least one payment type', 'error');

		swal({
			title: 'Are you sure to Delete this Payment?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function() {
			function succDelete(response) {
				if (response.data) {
					swal('success', response.data.message, 'success');
					vm.oVoucher = {};
					$uibModalInstance.close(response.data);
				}
			}
			function failDelete(response) {
				if (response.data) {
					swal('Error!',response.data.message , 'error');
				}
			}
			tripServices.deleteTripPayment({paymentId:payment._id}, succDelete, failDelete);
		});

	}

	// Get Account Masters
	function fromAccount() {

		let oFilter = {
			all: true,
			type: constants.fromAcByVoucherType[vm.oVoucher.type]
		}; // filter to send

		if (vm.fromGroup)
			oFilter.group = vm.fromGroup;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			vm.aAccountMasterfrom = response.data.data;
		}
	}

	function onBranchSelect(item){
		vm.billBookId = item.refNoBook ? item.refNoBook.map(o => o.ref) : '';
	}

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

	function accountmaster(viewValue, type) {

		return new Promise(function (resolve, reject) {

			let oFilter = {
				name: viewValue,
				no_of_docs: 10
			};

			switch (type) {
				case 'to':
					if (vm.toGroup)
						oFilter.group = vm.toGroup;
					break;
				case 'from':
					if (vm.fromGroup)
						oFilter.group = vm.fromGroup;
					break;
			}

			if (viewValue && viewValue.toString().length > 2) {
				accountingService.getAccountMaster(oFilter, res => {

					let aAccount = res.data.data;

					if (vm.oVoucher.from && vm.oVoucher.from._id)
						aAccount = aAccount.filter(o => o._id !== vm.oVoucher.from._id);
					else if (vm.oVoucher.to && vm.oVoucher.to._id)
						aAccount = aAccount.filter(o => o._id !== vm.oVoucher.to._id);

					resolve(aAccount);

				}, err => {
					console.log`${err}`;
					reject([]);
				});
			}
		});
	}

	// Voucher submit
	function submit(formData) {

		console.log(formData);
		if (formData.$valid) {

			if(!(vm.driverAccount._id === vm.oVoucher.from._id || vm.driverAccount._id === vm.oVoucher.to._id))
				return swal("Error", "Driver Payment should have its rt Driver account on either Cr or Dr side", "error");

			if(vm.oPaymentType.pType === 'Driver Security'){
				let maxSecurity = vm.totDrSecurity;
				if(vm.oVoucher._id)
					maxSecurity = (maxSecurity - vm.oVoucher.oldAmt || 0);

				let remAmt = (vm.driver.drMaxSecurity || 0) - (maxSecurity || 0);
				  if(vm.oVoucher.amount > remAmt)
					  return swal("Error", `Driver Security amount cant be greater than  ${remAmt}`, "error");

			}

			let request = {
				amount: vm.oVoucher.amount,
				paymentType: vm.oPaymentType.pType,
				type: vm.oVoucher.type,
				billDate: vm.oVoucher.billDate.toISOString(),
				branch: vm.driverPaymentsConfig && vm.driverPaymentsConfig.branch && vm.driverPaymentsConfig.branch._id || vm.oVoucher.branch && vm.oVoucher.branch._id,
				branchName: vm.driverPaymentsConfig && vm.driverPaymentsConfig.branch && vm.driverPaymentsConfig.branch.name || vm.oVoucher.branch && vm.oVoucher.branch.name,
				from: vm.oVoucher.from._id,
				fromName: vm.oVoucher.from.name,
				to: vm.oVoucher.to._id,
				toName: vm.oVoucher.to.name,
				narration: 'Being Cash Paid' + '; ' + narrationService({vehicleNo: vm.trip.vehicle_no, tripNo: vm.trip.trip_no,}) + '; ' + vm.oVoucher.narration ,
				refNo: vm.oVoucher.refNo,
				drPay: {
					rate: vm.oVoucher.rate,
					liter: vm.oVoucher.liter,
				},
				tsNo: vm.trip.advSettled.tsNo
			};

			if(vm.oVoucher.gr)
				request.gr = {
					_id: vm.oVoucher.gr._id,
					grNumber: vm.oVoucher.gr.grNumber
				};

			if(vm.selectedRefNo && vm.selectedRefNo.bookNo === request.refNo)
				request.stationaryId = vm.selectedRefNo._id;
			else
				delete request.stationaryId;

			if(vm.oVoucher._id){
				request._id = vm.oVoucher._id;
	     		tripServices.tripPaymentUpdate(request, onSuccess, onFailure);
			}else{
				request.tripId = vm.trip._id;
				tripServices.tripPayment(request, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				console.log(response.data);
				swal('Error!', response.data.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				swal('Success', response.data.message, 'success');
				$uibModalInstance.close(response.data);
			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

	function checkPaymentType() {
		if (["Shortage", "Challan", "Shortage Diesel"].indexOf(vm.oPaymentType.pType) != -1)
			vm.showGr = true;
	}

	function setPaymentType(oPaymentType) {
		vm.oVoucher.from = undefined;
		vm.oVoucher.to = undefined;
		vm.hideFrom = false;
		vm.hideTo = false;

		checkPaymentType();

		if(oPaymentType.fromGroup.find(s => s.toString().toLowerCase() === 'driver') && oPaymentType.toGroup.find(s => s.toString().toLowerCase() === 'driver')){
			vm.fromGroup = oPaymentType.fromGroup;
			vm.toGroup = oPaymentType.toGroup;
		}else if(oPaymentType.fromGroup.find(s => s.toString().toLowerCase() === 'driver')){
			vm.hideFrom = true;
			vm.oVoucher.from = vm.driverAccount;
			vm.toGroup = oPaymentType.toGroup;
		}else if(oPaymentType.toGroup.find(s => s.toString().toLowerCase() === 'driver')){
			vm.hideTo = true;
			vm.oVoucher.to = vm.driverAccount;
			vm.fromGroup = oPaymentType.fromGroup;
		}
	}
}
