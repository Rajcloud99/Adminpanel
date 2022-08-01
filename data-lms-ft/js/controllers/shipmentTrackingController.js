materialAdmin
	.controller("shipmentTrackingController", shipmentTrackingController);

shipmentTrackingController.$inject = [
	'$stateParams',
	'$scope',
	'$uibModal',
	'$state',
	'$filter',
	'DatePicker',
	'DateUtils',
	'lazyLoadFactory',
	'stateDataRetain',
	'tripServices',
	'userService',
	'Vehicle'
];

function shipmentTrackingController(
	$stateParams,
	$scope,
	$uibModal,
	$state,
	$filter,
	DatePicker,
	DateUtils,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	userService,
	Vehicle,
) {

	let vm = this;

	vm.getAllGR = getAllGR;
	vm.syncStatus = syncStatus;
	vm.getVehicles = getVehicles;
	vm.onStateRefresh = function () {
		vm.getAllGR();
	};


	// init
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;
		vm.oFilter = {};
		vm.count = 0;
		vm.aShipment = [];
		vm.selectedGr = [];
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		vm.cust = $scope.$configs.tracking && $scope.$configs.tracking.custs && $scope.$configs.tracking.custs[0]._id;
		vm.custStatus = $scope.$configs.tracking && $scope.$configs.tracking.custs && $scope.$configs.tracking.custs[0].status;
		vm.aStatus = ["Vehicle Arrived for loading", "Loading Ended", "Vehicle Arrived for unloading", "Unloading Ended"];

		vm.columnSetting = {
			allowedColumn: [
				'Shipment No',
				'Event Date',
				'Event Type',
				'Event Message',
				'Event Location',
				'Gr Number',
				'Gr Date',
				'Vehicle',
				'Route',
				'Country',
				'Street 1',
				'Street 2',
				'Street 3',
				'State',
				'Zip',
				'City',
				'Lat',
				'Lng',
				'last sync at',
				'last sync by',
			]
		};

		vm.tableHead = [

			{
				'header': 'Shipment No',
				'bindingKeys': 'this.invoices | getShipmentNum',
				"eval": true
			},
			{
				'header': 'Event Date',
				'bindingKeys': 'statuses.date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Gr Date',
				'bindingKeys': 'grDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Event Type',
				'bindingKeys': 'statuses.shellStatus + " ("  + statuses.status + ")"'
			},
			{
				'header': 'Event Message',
				'bindingKeys': 'statuses.remark'
			},
			{
				'header': 'Event Location',
				'bindingKeys': 'statuses.location.display_name'
			},

			{
				'header': 'Country',
				'bindingKeys': 'statuses.location.detail.Country || "India"'
			},
			{
				'header': 'Street 1',
				'bindingKeys': 'statuses.location.detail.locality'
			},
			{
				'header': 'Street 2',
				'bindingKeys': 'statuses.location.detail.place'
			},
			{
				'header': 'Street 3',
				'bindingKeys': 'statuses.location.detail.zone'
			},
			{
				'header': 'State',
				'bindingKeys': 'statuses.location.detail.state'
			},
			{
				'header': 'Zip',
				'bindingKeys': 'statuses.location.detail.postal',
				'date': false
			}, {
				'header': 'City',
				'bindingKeys': 'statuses.location.detail.city'
			},
			{
				'header': 'Lat',
				'bindingKeys': 'statuses.gpsData.lat'
			}, {
				'header': 'Lng',
				'bindingKeys': 'statuses.gpsData.lng'
			}, {
				'header': 'Gr Number',
				'bindingKeys': 'grNumber',
				date: false
			}, {
				'header': 'Vehicle',
				'bindingKeys': 'vehicle_no'
			}, {
				'header': 'Route',
				'bindingKeys': 'route.name'
			},
			{
				'header': 'last sync at',
				'bindingKeys': 'statuses.syncDate | date:"dd-MMM-yyyy"'
			},
			{
				'header': 'last sync by',
				'bindingKeys': 'statuses.syncBy'
			}

		];
	})();

	// Actual Function


	function getAllGR(isGetActive, download = false) {
		// vm.selectType = 'index';

		if (!vm.lazyLoad.update(isGetActive))
			return;

		if (vm.oFilter.dateType) {
			if (!(vm.oFilter.from && vm.oFilter.to)) {
				swal('warning', 'Please fill From and To Date', 'warning');
				return;
			}
		}

		if (vm.oFilter.from && vm.oFilter.to) {
			if (vm.oFilter.from > vm.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}
		}

		let request = prepareFilterObject(download);

		tripServices.getAllGR(request, success, fail);

		function success(response) {
			if (response && response.data) {
				if (request.download) {
					var a = document.createElement('a');
					a.href = response.data.url;
					a.download = response.data.url;
					a.target = '_blank';
					a.click();
					return;
				}
				response = response.data;
				response.data.forEach(obj => {
					obj.uKey = vm.count++;
				});
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);

			}
		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function prepareFilterObject(download) {
		var myFilter = {source: 'GR', dateType: "grDate"};

		if (vm.oFilter.grNumber) {
			myFilter.grNumber = vm.oFilter.grNumber;
		}

		if (vm.oFilter.status) {
			if (vm.oFilter.status === 'Trip cancelled') {
				myFilter.isCancelled = true;
			}
			myFilter["statuses.status"] = vm.oFilter.status;
		} else {
			myFilter["statuses.status"] = vm.aStatus;
		}

		if (vm.oFilter.dateType) {
			myFilter.dateType = vm.oFilter.dateType;
		}
		if (vm.oFilter.delivered) {
			if (vm.oFilter.delivered === "true")
				myFilter.delivered = true;
			else if (vm.oFilter.delivered === "false")
				myFilter.delivered = false;
		}
		if (vm.oFilter.sync) {
			if (vm.oFilter.sync === "true")
				myFilter.sync = true;
			else if (vm.oFilter.sync === "false")
				myFilter.sync = false;
		}
		if (vm.oFilter.shipmentNo) {
			myFilter.shipmentNo = vm.oFilter.shipmentNo;
		}

		if (vm.oFilter.from) {
			myFilter.from = new Date((vm.oFilter.from).setHours(0, 0, 0));
		}
		if (vm.oFilter.to) {
			myFilter.to = new Date((vm.oFilter.to).setHours(23, 59, 59));
		}

		if (vm.oFilter.vehicle_no) {
			myFilter.vehicle = vm.oFilter.vehicle_no._id;
		}

		myFilter.customer = vm.cust;
		myFilter.custStatus = vm.custStatus;

		if (download) {
			myFilter.download = download;
		} else {
			myFilter.no_of_docs = 20;
			myFilter.skip = vm.lazyLoad.getCurrentPage();
		}

		myFilter.sort = {grNumber: 1};
		return myFilter;
	}

	function syncStatus(selectedGr) {
		let msg = undefined;

		vm.selectedGr.forEach(obj => {

			obj.shipmentNo = obj.invoices.map(o => o.ref1).join(', ');

			if (!(obj.integration && obj.shipmentNo)) {
				msg = `Vehicle: ${obj.vehicle_no}; Status : ${obj.statuses.status}; ShipmentNo Required`;
				return;
			}

			if (obj.statuses.syncDate) {
				msg = `ShipmentNo:  ${obj.shipmentNo}; Vehicle: ${obj.vehicle_no}; Status : ${obj.statuses.status} Already Sync`;
				return;
			}

			if (obj.integration && obj.integration.shell.delivered) {
				msg = `ShipmentNo:  ${obj.shipmentNo}; Vehicle: ${obj.vehicle_no}; Status : ${obj.statuses.status} Already Delivered`;
				return;
			}

			// if (obj.statuses && !obj.statuses.gpsData) {
			// 	msg = `ShipmentNo:  ${obj.shipmentNo}; Vehicle: ${obj.vehicle_no}; Status : ${obj.statuses.status} GPS Data Not Found`;
			// 	return;
			// }
		});

		if (msg)
			return swal('warning', msg, 'warning');

		let request = vm.selectedGr.reduce((arr, oGr) => {
			arr.push(...oGr.shipmentNo.split(",").map(o => ({...oGr, shipmentNo: o.trim()})));
			return arr;
		}, []);

		swal({
				title: 'Do you really want to to sync status?',
				text: '',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#DD6B55',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No, cancel it!',
				closeOnConfirm: true,
				closeOnCancel: true
			},
			function (isConfirm) {
				if (isConfirm) {
					tripServices.syncStatus(request, success, fail);

					function success(response) {
						if (response && response.data) {
							getAllGR();
							swal('', response.data.message, 'success');
						}
					}

					function fail(response) {
						swal('error', response.data.message, 'error');
					}
				}
			});
	}

	function getVehicles(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

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
}




