materialAdmin
	.controller("roundTripController", roundTripController);

roundTripController.$inject = [
	'$uibModal',
	'$modal',
	'$scope',
	'$state',
	'$timeout',
	'DatePicker',
	'FleetService',
	'lazyLoadFactory',
	'otherUtils',
	'stateDataRetain',
	'tripServices',
	'growlService',
	'Vehicle',
	'Driver',
];

function roundTripController(
	$uibModal,
	$modal,
	$scope,
	$state,
	$timeout,
	DatePicker,
	FleetService,
	lazyLoadFactory,
	otherUtils,
	stateDataRetain,
	tripServices,
	growlService,
	Vehicle,
	Driver,
) {

	let vm = this;

	vm.columnSetting = {
		allowedColumn: [
			'RT No',
			'Settlement Date',
			'Audit Date',
			'Vehicle No',
			'Driver',
			'RT Start',
			'Route Km',
			'RT End',
			'Fleet',
			'Total KM',
			'Advance',
			'TT days',
			'Revenue',
			'Revenue/KM',
			'Expense',
			'Expense/KM',
			'Profit',
			'Profit/KM',
			'Profit/Day',
			'Diesel (Ltr.)',
			'Route',
			'Settlement By',
			'Settlement Remark',
			'Audit By',
		]
	};

	vm.tableHead = [
		{
			'header': 'RT No',
			'bindingKeys': '_id'
		},
		{
			'header': 'Settlement Date',
			'bindingKeys': 'trips.slice(-1)[0].markSettle.date',
			'date': true
		},
		{
			'header': 'Vehicle No',
			'bindingKeys': 'trips.slice(-1)[0].vehicle_no'
		},
		{
			'header': 'RT Start',
			'bindingKeys': 'firstTripStart.date',
			'date': true
		},
		{
			'header': 'RT End',
			'bindingKeys': 'lastTripEnd.date',
			'date': true
		},
		{
			'header': 'Driver',
			'bindingKeys': 'trips.slice(-1)[0].driver.name'
		},

		{
			'header': 'Fleet',
			'bindingKeys': 'trips.slice(-1)[0].vehicle.owner_group'
		},
		{
			'header': 'Total KM',
			'bindingKeys': 'totalKM',
		},
		{
			'header': 'Advance',
			'bindingKeys': 'total_advance'

		},
		{
			'header': 'TT days',
			'bindingKeys': 'rtElapsed.toFixed(0)'
		},
		{
			'header': 'Revenue',
			'bindingKeys': 'total_internal_freight'
		},
		{
			'header': 'Revenue/KM',
			'bindingKeys': 'this["revenue/km"]'
		},

		{
			'header': 'Expense',
			'bindingKeys': 'netExpense'
		},
		{
			'header': 'Expense/KM',
			'bindingKeys': 'this["expense/km"]',
			'eval': true
		},
		{
			'header': 'Profit',
			'bindingKeys': 'total_actual_profit'
		},
		{
			'header': 'Profit/KM',
			'bindingKeys': 'this["profit/km"]',
			'eval': true
		},
		{
			'header': 'Profit/Day',
			'bindingKeys': 'this["profit/day"]',
			'eval': true
		},
		{
			'header': 'Diesel (Ltr.)',
			'bindingKeys': 'this["total_diesel"]',
			'eval': true
		},
		{
			'header': 'Route',
			'bindingKeys': 'trips|arrayOfString:"route_name"',
		},
		{
			'header': 'Settlement By',
			'bindingKeys': 'trips.slice(-1)[0].markSettle.user_full_name',
		},
		{
			'header': 'Settlement Remark',
			'bindingKeys': 'trips.slice(-1)[0].markSettle.remark',
		},
		{
			'header': 'Audit Date',
			'bindingKeys': 'trips.slice(-1)[0].advSettled.date',
			'date': true
		},
		{
			'header': 'Audit By',
			'bindingKeys': 'trips.slice(-1)[0].advSettled.creation.user',
		},
	];

	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination

	// functions Identifiers
	vm.getRoundTrip = getRoundTrip;
	vm.getDriver = getDriver;
	vm.getVname = getVname;
	vm.getAllFleet = getAllFleet;
	vm.settleTrip = settleTrip;

	// this function trigger on state refresh
	vm.onStateRefresh = function (){
		vm.getRoundTrip();
	};

	// INIT functions
	(function init() {

		if(stateDataRetain.init($scope, vm))
			return;

		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		vm.oFilter = {};
		vm.selectType = 'index';
		getAllFleet();
	})();

	// Actual Functions


	function getRoundTrip(isGetActive) {

		if(!vm.lazyLoad.update(isGetActive))
			return;

		if(!vm.oFilter.tsNo && !(vm.oFilter.from && vm.oFilter.to))
			return swal('Error', 'From and To Date are required', 'error');

		let allowedTime = ['3', 'month'];

		if(moment(vm.oFilter.to).isAfter(moment(vm.oFilter.from).add(...allowedTime)))
			return swal('Error', `Max Allowed Time frame is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

		let oFilter = prepareFilter();
		oFilter['category'] = "Loaded";

		tripServices.getRoundTrip(oFilter, function (res) {
			if (res && res.data) {

				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({all: true}, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

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


	function prepareFilter() {
		let requestFilter = {};
		if (vm.oFilter.from) {
			requestFilter.from = vm.oFilter.from.toISOString();
		}
		if (vm.oFilter.to) {
			requestFilter.to = vm.oFilter.to.toISOString();
		}
		if (vm.oFilter.segment_type && vm.oFilter.segment_type.length) {
			requestFilter.segment_type = vm.oFilter.segment_type;
		}
		if (vm.oFilter.owner_group && vm.oFilter.owner_group.length) {
			requestFilter.owner_group = vm.oFilter.owner_group;
		}
		if (vm.oFilter.tsNo) {
			requestFilter['advSettled.tsNo'] = vm.oFilter.tsNo;
		}
		if (vm.oFilter.vehicle) {
			requestFilter['vehicle'] = vm.oFilter.vehicle._id;
			requestFilter.vehicle_no = vm.oFilter.vehicle.vehicle_reg_no;
		}
		if (vm.oFilter.driver) {
			requestFilter['driver'] = vm.oFilter.driver._id;
		}
		if (vm.oFilter.by) {
			requestFilter['by'] = vm.oFilter.by;
		}
		if (vm.oFilter.mSettle)
			requestFilter['markSettle.isSettled'] = vm.oFilter.mSettle === 'Yes' ? true : false;

		requestFilter.isCancelled = false;
		// requestFilter.ownershipType = { $ne: 'Market' };
		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 10;

		return requestFilter;
	}


	function settleTrip(aTrip) {
		aTrip = aTrip.trips;
		$state.go('booking_manage.tripSettlementView', {data: aTrip});
	}

}

