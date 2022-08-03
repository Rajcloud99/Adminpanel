// Tracking Controllers

materialAdmin
	.factory('gpsDashboardDataFactory', gpsDashboardDataFactory)
	.controller('mapViewController', mapViewController)
	.controller('gpsAnalyticController', gpsAnalyticController)
	.controller('gpsDashboardController', gpsDashboardController)
	.controller('gpsMoniterController', gpsMoniterController)
	.controller('gpsMoniterInTripController', gpsMoniterInTripController)
	.controller('gpsMoniterAvailiableController', gpsMoniterAvailiableController)
	.controller('vehicleTrackController', vehicleTrackController)
	.controller('reportsCtrl',reportsCtrl)
	.controller('parkingReportCtrl',parkingReportCtrl)
	.controller('tripHistoryReportCtrl',tripHistoryReportCtrl)
	.controller('playbackCtrl', playbackCtrl)
	.controller('playPositionCtrl', playPositionCtrl);

mapViewController.$inject = [
	'$scope',
	'$state',
	'$filter',
	'$http',
	'$modal',
	'$localStorage',
	'$rootScope',
	'$timeout',
	'$window',
	'$uibModal',
	'Driver',
	'DatePicker',
	'FleetService',
	'lazyLoadFactory',
	'objToCsv',
	'otherUtils',
	'parseTableDataFilter',
	'Routes',
	'socketio',
	'utils',
	'Vehicle',
	'tripServices',
  'HTTPConnection',
  'URL'
];

gpsAnalyticController.$inject = [
	"$scope",
	"$timeout",
	"cacheData",
	"dashboardService",
	"isFloatFilter",
	"objToCsv",
	"orderByFilter",
	"utils",
	"Vehicle"
];

gpsDashboardController.$inject = [
	'$scope',
	'$timeout',
	'objToCsv',
	'dashboardService',
	'gpsDashboardDataFactory'
];

gpsMoniterController.$inject = [
	'$scope',
	'$timeout',
	'dashboardService',
	"Vehicle"
];

gpsMoniterInTripController.$inject = [
	'$scope',
	'$timeout',
	'objToCsv'
];

gpsMoniterAvailiableController.$inject = [
	'$scope',
	'$filter',
	'$timeout',
	'objToCsv',
	'utils'
];

reportsCtrl.$inject = [
	"$rootScope",
	"DateUtils",
	"$state",
	"$scope",
	"gpsReportService",
	"gpsSocketService",
	"Vehicle",
	"DatePicker",
	'$filter',
	"$timeout"
];

parkingReportCtrl.$inject = [
	'$scope',
	'$state',
	'$filter',
	'$http',
	'$modal',
	'$localStorage',
	'$rootScope',
	'$timeout',
	'$window',
	'$uibModal',
	'Driver',
	'DatePicker',
	'FleetService',
	'lazyLoadFactory',
	'objToCsv',
	'otherUtils',
	'parseTableDataFilter',
	'Routes',
	'socketio',
	'utils',
	'Vehicle',
	'tripServices',
  	'HTTPConnection',
  	'URL'
];

vehicleTrackController.$inject = [
	'$scope',
	'$stateParams',
	'$timeout',
	'DatePicker',
	'utils',
	'gpsSocketService'
];

tripHistoryReportCtrl.$inject = [
	'$filter',
	'$scope',
	'$timeout',
	'DatePicker',
	'consignorConsigneeService',
	'Driver',
	'objToCsv',
	'HTTPConnection',
	'URL',
	'customer'
];

playbackCtrl.$inject = [
	'$rootScope',
	'$scope',
	'$localStorage',
	'DateUtils',
	'$stateParams',
	'$interval',
	'$state',
	'gpsSocketService',
	'$timeout',
	'Vehicle',
	'stateDataRetain',
	'DatePicker'
];

playPositionCtrl.$inject = [
	'$rootScope', '$scope', 'DateUtils', '$uibModal', '$stateParams', 'utils', '$localStorage', '$interval', 'gpsSocketService', '$timeout',
	'stateDataRetain', 'objToCsv'
];


function tripDetailsPopUpController(
	$scope,
	$uibModalInstance,
	otherData,
	lazyLoadFactory,
	tripServices,
) {

	let vm = this;
	vm.closeModal = closeModal;
	vm.getAllTrip = getAllTrip;

	//init
	(function init() {

		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		vm.selectedTrip = [];
		vm.aTrip = [];
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: [
				'Trip No.',
				'CATEGORY',
				'Gr No.',
				'Customer',
				'Route Name',
				'Trip Start',
				'Trip End',
				'Trip KM',
				'Driver Name',
			]
		};
		vm.tableHead = [
			{
				'header': 'Trip No.',
				'bindingKeys': 'trip_no',
				'date': false
			},
			{
				'header': 'CATEGORY',
				'bindingKeys': 'category'
			},
			{
				'header': 'Gr No.',
				'filter': {
					'name': 'arrayOfGrToString',
					'aParam': [
						'gr',
					]
				}
			},
			{
				'header': 'Customer',
				'bindingKeys': 'gr[0].customer.name'

			},
			{
				'header': 'Route Name',
				'bindingKeys': 'route_name'
			},
			{
				'header': 'Trip Start',
				'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Trip End',
				'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Trip KM',
				'bindingKeys': 'totalKm'
			},
			{
				'header': 'Driver Name',
				'bindingKeys': 'driver.name || vehicle.driver_name'
			},
		];
       vm.vehicle = otherData.vehicle;
		getAllTrip();
	})();

	function getAllTrip(isGetActive) {

		// if (!vm.lazyLoad.update(isGetActive))
		// 	return;

		var oFilter = {
			isCancelled: false,
			no_of_docs: 6,
			skip: 1,
			sort: {_id:-1},
			vehicle: otherData.vehicle._id,
			summary: true
		};
		oFilter.__SRC__ = 'WEB';

		tripServices.getAllTripsWithPagination(oFilter, success);

		function success(res) {

			if (res.data.data) {
				res = res.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res.data);
			}
		}
	}

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}
}


function vehicleDetailPopupController(
	$scope,
	$uibModalInstance,
	modelDetail,
	otherData,
	Vehicle,
) {

	let vm = this;
	vm.closeModal = closeModal;
	vm.oVehicle = {};

	//init
	(function init() {
		vm.oVehicle = otherData.oVehicle;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}
}

function gpsAnalyticController(
	$scope,
	$timeout,
	cacheData,
	dashboardService,
	isFloatFilter,
	objToCsv,
	orderByFilter,
	utils,
	Vehicle
) {

	let vm = this;
	vm.downloadCsv = downloadCsv;
	vm.refreshKpiData = refreshKpiData;
	vm.showTableOfThisKpi = showTableOfThisKpi;
	vm.reportOnChange = reportOnChange;
	vm.getColor = getColor;

	function getColor(status) {
			switch ((status || '').toLowerCase()) {
				case 'running':
					return 'ja-green';
				case 'stopped':
					return 'ja-red';
				case 'stop':
					return 'ja-red';
				default :
					return 'ja-grey';
			}
	}


	const end = new Date(new Date().setDate(new Date().getDate() - 1)),
		endStr = new Date(end.setHours(23,59,59)).toISOString(),
		start = new Date(new Date(end.setDate(1)).setHours(0,0,0)).toISOString(),
		totalDays = Math.round((new Date(endStr).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000));
	let orderBy = null;

	vm.report = [
		{
			name: 'ETA Report',
			kpis: [
				{
					name: 'Segment',
					description: "This report is prepare to do weekly planning. Vehicles with current trips are shown here with their Expected Time of Arrival.",
					header: [
						{
							name: 'S.No',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: "data.vehicle.vehicle_reg_no",
							class: "data.vehicle.gpsData.status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.vehicle.gpsData.status'
						},
						{
							name: 'Driver Name',
							key: 'data.vehicle.trip.driver.name || data.vehicle.driver.name'
						},
						{
							name: 'Consignor',
							key: 'data.vehicle.gr.consignor.name || data.vehicle.gr.booking.consigner.name'
						},
						{
							name: 'Loading Date <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "((data.vehicle.gr.loading_ended_status.date || (data.vehicle.trip.statuses | filter: {status: 'Trip started'})[0].date || data.vehicle.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'vehicle.gr.loading_ended_status.date' : '-vehicle.gr.loading_ended_status.date');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Route(Km)',
							key: "data.vehicle.route_name || data.vehicle.route ? data.vehicle.route.name + ' (' + data.vehicle.route.route_distance + ')' : ''"
						},
						{
							name: 'Rem Km',
							key: "!data.vehicle.gpsData.status ?  'NA' : (data.vehicle.route.route_distance - data.distance_travelled | number:0).split(',').join(' ')"
						},
						{
							name: 'Halt Time',
							key: "data.vehicle.gpsData.status !== 'running'? data.vehicle.gpsData.stoppage_time : '0 min'"
						},
						{
							name: 'EXP. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.expected_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'expected_eta' : '-expected_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'CUR. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.current_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'current_eta' : '-current_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Address',
							key: "(data.vehicle.gpsData.address).split(',').join(' ') || 'NA'",
						},
					],
					reaponseFormatter: function(response){
						const aData = response || [],
							data = [],
							dataTable = [];

						for(let key in aData){
							if(aData.hasOwnProperty(key)){
								let count = 0;

								for(let k in aData[key]){
									if(aData[key].hasOwnProperty(k) && Array.isArray(aData[key][k])){
										count+=aData[key][k].length;
										dataTable.push(...aData[key][k]);
									}
								}

								data.push({
									key,
									count
								});
							}
						}

						return {
							data,
							dataTable
						};
					}
				},
				{
					name: 'Zone',
					api: function (segment) {
						return new Promise(function(resolve, reject) {
							dashboardService.getService('api/tracking/vehicle/location', {
								type: 'zone',
								segment_type: segment,
								status: "In Trip",
								route_type: 'destination',
								no_of_docs: Number.MAX_SAFE_INTEGER,
								__SRC__: 'WEB',
								$_methodType: 'post',
								$_cache: `ETA Report Zone ${segment}`
							}, function success(response){
								resolve(response);
							} , function failure(err) {
								reject(err);
							});
						});
					},
					reaponseFormatter: function(response, segment){
						const data = response.data || [],
							dataTable = [],
							cachedTime = cacheData.getDetail(`ETA Report Zone ${segment}`) || new Date();
						data.forEach(obj => {

							let key = Object.keys(obj)[0],
								count = 0;

							obj[key].forEach(arr => {
								count += arr.length;
								dataTable.push(...arr.map(o => {
									o.gpsData = o.gpsData || {};
									o.gpsData.stoppage_time = o.gpsData && o.gpsData.location_time && utils.calTimeDiffCurrentToLastInDHM(o.gpsData.location_time, cachedTime) || false;
									return o;
								}));
							});

							obj.key = key;
							obj.count = count;
							obj.arr = obj[key];
						});

						return {
							data,
							dataTable
						};
					},
					header: [
						{
							name: 'S.No',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: 'data.vehicle_reg_no',
							class: "data.gpsData.status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.gpsData.status'
						},
						{
							name: 'Driver Name',
							key: 'data.trip.driver.name || data.driver_name'
						},
						{
							name: 'Consignor',
							key: 'data.gr.consignor.name || data.gr.booking.consigner.name'
						},
						{
							name: 'Loading Date <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "((data.trip.gr.loading_ended_status.date || (data.trip.statuses | filter: {status: 'Trip started'})[0].date || data.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'trip.gr.loading_ended_status.date' : '-trip.gr.loading_ended_status.date');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Unloading Date',
							key: "((data.trip.gr.loading_started_status.date || (data.trip.statuses | filter: {status: 'Trip started'})[0].date || data.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')"
						},
						{
							name: 'Route(Km)',
							key: "data.trip.route_name || data.trip.route ? data.trip.route.name + ' (' + data.trip.route.route_distance + ')' : ''"
						},
						{
							name: 'Rem Km',
							key: "!data.gpsData.status ? 'NA' : (data.trip.route.route_distance - data.distance_travelled |number:0).split(',').join(' ')"
						},
						{
							name: 'Halt Time',
							key: "data.gpsData.status !== 'running'? data.gpsData.stoppage_time : '0 min'"
						},
						{
							name: 'EXP. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.expected_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'expected_eta' : '-expected_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'CUR. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.current_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'current_eta' : '-current_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Address',
							key: "(data.gpsData.address).split(',').join(' ') || 'NA'",
						}
					]
				},
				{
					name: 'Current ETA',
					reaponseFormatter: function(response){
						const data = [],
							dataTable = [],
							cachedTime = response[0] && response[0][0] && cacheData.getDetail(`ETA Report Zone ${response[0][0].segment}`) || new Date(),
							temp = {};

						response.forEach(arr => {
							dataTable.push(...arr.filter(o => {
								o.gpsData = o.gpsData || {};
								o.gpsData.stoppage_time = o.gpsData && o.gpsData.location_time && utils.calTimeDiffCurrentToLastInDHM(o.gpsData.location_time, cachedTime) || false;
								if(o.expected_eta ? !(Math.floor((new Date(o.expected_eta).getTime() - new Date().setHours(23,59,59)) / (1000 * 60 * 60 * 24)) > 5) : false){

									let str = '';
									if(Math.floor((new Date(o.expected_eta).getTime() - new Date().setHours(23,59,59)) / (1000 * 60 * 60 * 24)) < 0)
										str = `Today(${moment().format("DD/MM/YYYY")}) & Prev`;
									else
										str = moment(o.expected_eta).format("DD/MM/YYYY");
									temp[str] = temp[str] || [];
									temp[str].push(o);

									return true;
								}else
									return false;
							}));
						});

						for(let k in temp){
							if(temp.hasOwnProperty(k))
								data.push({
									key: k,
									count: temp[k].length,
									arr: temp[k]
								});
						}
						return {
							data,
							dataTable
						};
					},
					header: [
						{
							name: 'S.No',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: 'data.vehicle_reg_no',
							class: "data.gpsData.status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.gpsData.status'
						},
						{
							name: 'Driver Name',
							key: 'data.trip.driver.name || data.driver_name'
						},
						{
							name: 'Consignor',
							key: 'data.gr.consignor.name || data.gr.booking.consigner.name'
						},
						{
							name: 'Loading Date <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "((data.trip.gr.loading_ended_status.date || (data.trip.statuses | filter: {status: 'Trip started'})[0].date || data.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'trip.gr.loading_ended_status.date' : '-trip.gr.loading_ended_status.date');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Route(Km)',
							key: "data.trip.route_name || data.trip.route ? data.trip.route.name + ' (' + data.trip.route.route_distance + ')' : ''"
						},
						{
							name: 'Rem Km',
							key: "!data.gpsData.status ? 'NA' :(data.trip.route.route_distance - data.distance_travelled | number:0).split(',').join(' ')"
						},
						{
							name: 'Halt Time',
							key: "data.gpsData.status !== 'running'? data.gpsData.stoppage_time : '0 min'"
						},
						{
							name: 'EXP. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.expected_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'expected_eta' : '-expected_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'CUR. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.current_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'current_eta' : '-current_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Address',
							key: "(data.gpsData.address).split(',').join(' ') || 'NA'",
						}
					]
				},
				{
					name: 'generateItsTable',
					header: [
						{
							name: 'S.No',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: 'data.vehicle_reg_no',
							class: "data.gpsData.status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.gpsData.status'
						},
						{
							name: 'Driver Name',
							key: 'data.trip.driver.name || data.driver_name'
						},
						{
							name: 'Consignor',
							key: 'data.gr.consignor.name || data.gr.booking.consigner.name'
						},
						{
							name: 'Loading Date <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "((data.trip.gr.loading_ended_status.date || (data.trip.statuses | filter: {status: 'Trip started'})[0].date || data.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'trip.gr.loading_ended_status.date' : '-trip.gr.loading_ended_status.date');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Route(Km)',
							key: "data.trip.route_name || data.trip.route ? data.trip.route.name + ' (' + data.trip.route.route_distance + ')' : ''"
						},
						{
							name: 'Rem Km',
							key: "!data.gpsData.status ? 'NA' : (data.trip.route.route_distance - data.distance_travelled |number:0).split(',').join(' ')"
						},
						{
							name: 'Halt Time',
							key: "data.gpsData.status !== 'running'? data.gpsData.stoppage_time : '0 min'"
						},
						{
							name: 'EXP. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.expected_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'expected_eta' : '-expected_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'CUR. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.current_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'current_eta' : '-current_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Address',
							key: "(data.gpsData.address).split(',').join(' ') || 'NA'",
						}
					]
				}
			]
		},
		{
			name: 'Consignor Report',
			kpis: [
				{
					name: 'Segment',
					description: "This report is use to analyse consignor wise trip delay.",
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Consignor',
							key: 'data.key'
						},
						{
							name: 'Count',
							key: 'data.count+""'
						},
						{
							name: 'Delay(%)',
							key: 'data.percentData.Delayed+""'
						},
						{
							name: 'Early(%)',
							key: "data.percentData.Early+''"
						},
						{
							name: 'On Time(%)',
							key: "data.percentData['On Time']+''"
						},
						{
							name: 'No Gps(%)',
							key: "data.percentData['NA']+''"
						},
						{
							name: 'Overall Performance',
							key: "(data.percentData.Delayed|delayPerformance) || 'NA'"
						}
					],
					reaponseFormatter: function(response){
						const aData = response || [],
							data = [];

						for(let key in aData){
							if(aData.hasOwnProperty(key)){
								let count = 0;

								for(let k in aData[key]){
									if(aData[key].hasOwnProperty(k) && Array.isArray(aData[key][k])){
										count+=aData[key][k].length;
									}
								}

								data.push({
									key,
									count,
									percentData: aData[key].percentages
								});
							}
						}

						return {
							data,
							dataTable: data
						};
					},
					customGraphName: function(index, tableData){
						const segement = tableData.reduce( (a,b) => a+b.count,0 );
						vm.tableTitle = vm.aGraphObj[index].name = `${vm.selectedReport.kpis[index].name} (Consignor: ${segement}, Count: ${tableData.length})`;
					}
				},
				{
					name: 'Consignor',
					api: function (segment) {
						return new Promise(function (resolve, reject) {
							Vehicle.vehicleWise({
								status: "In Trip",
								all: "true",
								segment_type: segment,
								group_by: "consignor",
								gpsExists: true,
								$_cache: `Consignor Report Consignor ${segment}`
							}, function success(response){
								resolve(response);
							}, function failure(err) {
								reject(err);
							});
						});
					},
					reaponseFormatter: function(response){

						const aData = response.data || [],
							data = [];

						for(let key in aData){
							if(aData.hasOwnProperty(key)){
								let count = 0,
									arr = [];

								for(let k in aData[key]){
									if(aData[key].hasOwnProperty(k) && Array.isArray(aData[key][k])){
										count+=aData[key][k].length;
										arr.push(...aData[key][k]);
									}
								}

								data.push({
									key,
									count,
									arr,
									percentData: aData[key].percentages
								});
							}
						}

						return {
							data,
							dataTable: data
						};
					},
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Consignor',
							key: 'data.key'
						},
						{
							name: 'Count',
							key: 'data.count+""'
						},
						{
							name: 'Delay(%)',
							key: 'data.percentData.Delayed'
						},
						{
							name: 'Early(%)',
							key: "data.percentData.Early"
						},
						{
							name: 'On Time(%)',
							key: "data.percentData['On Time']"
						},
						{
							name: 'No Gps(%)',
							key: "data.percentData['NA']+''"
						},
						{
							name: 'Overall Performance',
							key: "(data.percentData.Delayed|delayPerformance) || 'NA'"
						}
					],
				},
				{
					name: 'generateItsTable',
					header: [
						{
							name: 'S.No',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: 'data.vehicle.vehicle_reg_no',
							class: "data.vehicle.gpsData.status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.vehicle.gpsData.status'
						},
						{
							name: 'Driver Name',
							key: 'data.vehicle.trip.driver.name || data.vehicle.driver.name'
						},
						{
							name: 'Consignor',
							key: 'data.vehicle.gr.consignor.name || data.vehicle.gr.booking.consigner.name'
						},
						{
							name: 'Loading Date <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "((data.vehicle.gr.loading_ended_status.date || (data.vehicle.trip.statuses | filter: {status: 'Trip started'})[0].date || data.vehicle.trip.allocation_date )|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'vehicle.gr.loading_ended_status.date' : '-vehicle.gr.loading_ended_status.date');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Route(Km)',
							key: "data.vehicle.route_name || data.vehicle.route ? data.vehicle.route.name + ' (' + data.vehicle.route.route_distance + ')' : ''"
						},
						{
							name: 'Rem Km',
							key: "(data.vehicle.route.route_distance - data.distance_travelled | number:0).split(',').join(' ') "
						},
						{
							name: 'EXP. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.expected_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'expected_eta' : '-expected_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'CUR. ETA <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: "(data.current_eta|date:'dd-MMM-yyyy At h:mma')",
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'current_eta' : '-current_eta');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Address',
							key: "(data.vehicle.gpsData.address).split(',').join(' ') || 'NA'",
						}
					]
				}
			]
		},
		{
			name: 'Km Report',
			kpis: [
				{
					name: 'Segment',
					description: "This report use to analyse current month KM running and diesel budget calculations.",
					customGraphName: function(index, tableData){
						const kmCount = tableData.reduce( (a,b) => a+b.count,0 ),
							km = isFloatFilter(kmCount) ? kmCount.toFixed(2) : kmCount;
						vm.aGraphObj[index].name = `${vm.selectedReport.kpis[index].name} (Km: ${km}, Count: ${tableData.length})`;
					},
					customTableTitle: function(index, tableData){
						const kmCount = tableData.reduce( (a,b) => a+b.count,0 ),
							km = isFloatFilter(kmCount) ? kmCount.toFixed(2) : kmCount;
						vm.tableTitle = `${vm.selectedReport.kpis[index].name} (Km: ${km}, Count: ${tableData.length}, From: ${moment(start).format("DD/MM/YYYY")} To: ${moment(endStr).format("DD/MM/YYYY")})`;
					},
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Segemnt',
							key: 'data.key'
						},
						{
							name: 'Total Km',
							key: '(data.count|isFloat) ? data.count.toFixed(2) : data.count',

						},
						{
							name: 'Days',
							key: `"${totalDays}"`
						},
						{
							name: 'Km/Day',
							key: `((data.count/${totalDays}) | isFloat) ? (data.count/${totalDays}).toFixed(2) : (data.count/${totalDays})`
						},
						{
							name: 'Km/Vehicle',
							key: `((data.count/data.vehicleWithGps) | isFloat) ? (data.count/data.vehicleWithGps).toFixed(2) : (data.count/data.vehicleWithGps)`
						},
						{
							name: 'Avg Km/Day/Vehicle',
							key: `((data.count/data.vehicleWithGps) | isFloat) ? ((data.count/data.vehicleWithGps)/${totalDays}).toFixed(2) : ((data.count/data.vehicleWithGps)/${totalDays})`
						}
					],
					reaponseFormatter: function(response){

						response.forEach( o => {
							o.count = isFloatFilter(o.count) ? Number(o.count.toFixed(2)) : o.count;
							o.arr = o.vehicles;
							o.vehicleWithGps = o.vehicles.filter( o => o.gps_exist).length;
						});

						return {
							data: response,
							dataTable: response
						};
					}
				},
				{
					name: 'generateItsTable',
					customTableTitle: function(index, tableData, e){
						// const km = e.data.count,
						// 	name = vm.selecteKpiChainName.slice(0, index);
						// vm.tableTitle = `${name} (Km: ${km}, Count: ${tableData.length}, From: ${moment(start).format("DD/MM/YYYY")} To: ${moment(endStr).format("DD/MM/YYYY")})`;
					},
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle No.',
							key: 'data.req_no',
							class: "data.veh_status",
						},
						{
							hideView: true, // it hide the column from frontend only
							name: 'Vehicle Status',
							key: 'data.veh_status'
						},
						{
							name: 'Total Km <i class="zmdi zmdi-swap-vertical zmdi-hc-fw"></i>',
							key: '(data.totalKm|isFloat) ? data.totalKm.toFixed(2) : data.totalKm+""',
							onClick: function () {
								vm.tableData = orderByFilter(vm.tableData, orderBy ? 'totalKm' : '-totalKm');
								console.log(orderBy, 'clicked');
								orderBy = !orderBy;
							}
						},
						{
							name: 'Days',
							key: `"${totalDays}"`
						},
						{
							name: 'Km/Day',
							key: `((data.totalKm/${totalDays}) | isFloat) ? (data.totalKm/${totalDays}).toFixed(2) : (data.totalKm/${totalDays})+""`
						},
						{
							name: 'Address',
							key: "(data.address).split(',').join(' ') || 'NA'",
						}
					],
				}
			]
		},
		{
			name: 'Vehicle(In Trip) Report',
			kpis: [
				{
					name: 'Zone',
					reaponseFormatter: function(response, segment){
						const data = response || [],
							dataTable = [];

						data.forEach(obj => {

							let key = Object.keys(obj)[0],
								count = 0;
							obj.arr = [];

							obj[key].forEach(arr => {

								arr = arr.filter( a => a.status === 'In Trip' || a.status === "Booked" );

								count += arr.length;
								dataTable.push(...arr.map(o => {
									o.gpsData = o.gpsData || {};
									return o;
								}));
								obj.arr.push(...arr);
							});

							obj.key = key;
							obj.count = count;
						});

						return {
							data,
							dataTable
						};
					},
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle',
							key: 'data.vehicle_reg_no',
							class: 'data.gpsData.status'

						},
						{
							name: 'Segemnt',
							key: 'data.segment'
						},
						{
							name: 'Address',
							key: "(data.address).split(',').join(' ') || 'NA'",
						}
					]
				},
				{
					name: 'generateItsTable',
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle',
							key: 'data.vehicle_reg_no',
							class: 'data.gpsData.status'
						},
						{
							name: 'Segemnt',
							key: 'data.segment'
						},
						{
							name: 'Address',
							key: "(data.address).split(',').join(' ') || 'NA'",
						}
					],
				}
			]
		},
		{
			name: 'Vehicle(Availiable) Report',
			kpis: [
				{
					name: 'Zone',
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle',
							key: 'data.vehicle_reg_no',
							class: 'data.gpsData.status'
						},
						{
							name: 'Segemnt',
							key: 'data.segment'
						},
						{
							name: 'Unloading Date',
							key: "((data.last_known.trip.gr[0].statuses|filter: {status:'Unloading Ended'})[0].date)|date:'dd-MMM-yyyy' || ((data.last_known.trip.statuses|filter: {status:'Trip Ended'})[0].date)|date:'dd-MMM-yyyy' || 'NA'"
						},

						{
							name: 'No of Days',
							key: "('noOfDays'|dateUtilsFilt:(((data.last_known.trip.gr[0].statuses|filter: {status:'Unloading Ended'})[0].date) || ((data.last_known.trip.statuses|filter: {status:'Trip Ended'})[0].date)))"
						},

						{
							name: 'Address',
							key: "(data.address).split(',').join(' ') || 'NA'",
						}
					],
					reaponseFormatter: function(response, segment){
						const data = response || [],
							dataTable = [];

						data.forEach(obj => {

							let key = Object.keys(obj)[0],
								count = 0;
							obj.arr = [];

							obj[key].forEach(arr => {

								arr = arr.filter( a => a.status === "Available" );

								count += arr.length;
								dataTable.push(...arr.map(o => {
									o.gpsData = o.gpsData || {};
									return o;
								}));
								obj.arr.push(...arr);
							});

							obj.key = key;
							obj.count = count;
						});

						return {
							data,
							dataTable
						};
					}
				},
				{
					name: 'generateItsTable',
					header: [
						{
							name: 'S.No.',
							key: '$parent.$parent.$index + 1'
						},
						{
							name: 'Vehicle',
							key: 'data.vehicle_reg_no',
							class: 'data.gpsData.status'
						},
						{
							name: 'Segemnt',
							key: 'data.segment'
						},
						{
							name: 'Unloading Date',
							key: "((data.last_known.trip.gr[0].statuses|filter: {status:'Unloading Ended'})[0].date)|date:'dd-MMM-yyyy At h:mma'"
						},

						{
							name: 'No of Days',
							key:"(((data.last_known.trip.gr[0].statuses|filter: {status:'Unloading Ended'})[0].date) ||'0')|filter : subtractCurrentDate"
						},
						{
							name: 'Address',
							key: "(data.address).split(',').join(' ') || 'NA'",
						}
					],
				}
			]
		}
	];

	// Init
	(function init() {

		vm.selectedReport = vm.report[0];
		vm.selecteKpiChainName = [];
		vm.selectedKpiTable = 0;
		vm.tableTitle = vm.selectedReport.name;
		vm.aGraphObj = [];
		vm.tableHeader = [];
		vm.tableData = [];

		getAllInTripVehicle(0);

	})();

	function downloadCsv(title = 'Eta Report') {

		if(!(vm.tableData || []).length)
			return;

		$scope.gAcVm.$eval = $scope.$eval;

		$scope.tableData = vm.tableData;

		objToCsv(
			title,
			vm.tableHeader.map( o => o.name),
			vm.tableData.map( (data, dataIndex) => {
				return vm.tableHeader.map( head => {
					if(head.key)
						return vm.$eval(head.key.replace(/data./g,`tableData[${dataIndex}].`));
					else
						return dataIndex+1;
				});
			})
		);
	}

	// get all In Trip vehicle
	function getAllInTripVehicle(index) {

		let oRequest = {
			status: "In Trip",
			group_by: "segment",
			all: "true",
			$_cache: 'ETA Report Segment'
		};

		Vehicle.vehicleWise(oRequest, success, failure);

		function failure(response) {
			console.log(response);
		}

		function success(response) {
			const formattedResponse = vm.selectedReport.kpis[index].reaponseFormatter && vm.selectedReport.kpis[index].reaponseFormatter(response.data) || response.data;
			vm.tableHeader = vm.selectedReport.kpis[index].header;
			vm.tableData = formattedResponse.dataTable.map( o => {
				o.vehicle.gpsData = o.vehicle.gpsData || {};
				o.vehicle.gpsData.stoppage_time = (o.vehicle.gpsData && o.vehicle.gpsData.location_time && utils.calTimeDiffCurrentToLastInDHM(o.vehicle.gpsData.location_time, cacheData.getDetail('ETA Report Segment'))) || false;
				return o;
			});

			renderKpi(formattedResponse.data, formattedResponse.dataTable, index);
		}
	}

	// get all In Trip vehicle with Gps Exist
	function getAllInTripVehicleWithGpsExist(index) {

		let oRequest = {
			status: "In Trip",
			group_by: "segment",
			all: "true",
			gpsExists: true,
			$_cache: 'Consignor Report Segment'
		};

		Vehicle.vehicleWise(oRequest, success, failure);

		function failure(response) {
			console.log(response);
		}

		function success(response) {

			const formattedResponse = vm.selectedReport.kpis[index].reaponseFormatter && vm.selectedReport.kpis[index].reaponseFormatter(response.data) || response.data;
			vm.tableHeader = vm.selectedReport.kpis[index].header;
			vm.tableData = formattedResponse.dataTable;
			renderKpi(formattedResponse.data, formattedResponse.dataTable, index);
		}
	}

	// get all In Trip vehicle Km Wise
	function getAllInTripVehicleKmWise(index) {

		let oRequest = {
			"start_time": start,
			"end_time": endStr,
			$_cache: 'Km Report Segment'
		};

		Vehicle.vehicleKmWise(oRequest, success, failure);

		function failure(response) {
			console.log(response);
		}

		function success(response) {

			const formattedResponse = vm.selectedReport.kpis[index].reaponseFormatter && vm.selectedReport.kpis[index].reaponseFormatter(response.data) || response.data;
			vm.tableHeader = vm.selectedReport.kpis[index].header;
			vm.tableData = formattedResponse.dataTable;
			renderKpi(formattedResponse.data, formattedResponse.dataTable, index);
		}
	}

	function getVehlicleInTrip(index) {

		let oReq = {
			type: 'zone',
			gpsExists: true,
			no_of_docs: Number.MAX_SAFE_INTEGER,
			__SRC__: 'WEB',
			$_cache: true,
			$_methodType: 'post',
		};

		dashboardService.getService('api/tracking/vehicle/location', oReq, successCallback, failureCallback);

		function failureCallback(response) {
			console.log(response);
		}

		function successCallback(response) {

			const formattedResponse = vm.selectedReport.kpis[index].reaponseFormatter && vm.selectedReport.kpis[index].reaponseFormatter(response.data) || response.data;
			vm.tableHeader = vm.selectedReport.kpis[index].header;
			vm.tableData = formattedResponse.dataTable;
			renderKpi(formattedResponse.data, formattedResponse.dataTable, index);
		}
	}

	function refreshKpiData(oGraph) {
		oGraph.api && oGraph.api.updateWithData(oGraph.selectedLegend.length ? oGraph.selectedLegend : oGraph.tempGraphData);
	}

	function reportOnChange() {


		vm.selectedKpiTable = 0;

		vm.aGraphObj = [];
		vm.selecteKpiChainName = [];
		orderBy = true;

		switch (vm.selectedReport.name){
			case vm.report[1].name:
				getAllInTripVehicleWithGpsExist(0);
				return;
			case vm.report[2].name:
				getAllInTripVehicleKmWise(0);
				return;
			case vm.report[3].name:
				getVehlicleInTrip(0);
				return;
			case vm.report[4].name:
				getVehlicleInTrip(0);
				return;
			default:
				getAllInTripVehicle(0);
				return;
		}
	}

	function renderKpi(data, dataTable, index) {
		let kpiName = vm.selectedReport.kpis[index].name;

		vm.aGraphObj[index] = vm.aGraphObj[index] || {
			graphType: [{
				type: "pieChart",
				showLabels: false,
				showLegend: false,
				legendPosition: 'right',
				xAxisKey: function (e) {
					return e.key + ` (${e.count})`;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				onDblClick: function(e){
					const kpi = vm.selectedReport.kpis[index+1];
					if(!kpi)
						return;

					vm.selectedKpiTable = index+1;
					orderBy = true;

					vm.selecteKpiChainName = [
						...vm.selecteKpiChainName.slice(0,index),
						{
							key: kpiName,
							value: e.data.key
						}
					];

					if(kpi.name === 'generateItsTable'){
						vm.tableHeader = kpi.header;
						vm.tableData = e.data.arr;
						setGraphAndTableName(kpiName, index+1, vm.tableData.length, true);
						$scope.$apply();
						return;
					}

					switch(typeof kpi.api){
						case 'function':

							kpi.api(e.data.key).then(function resolve(response) {

								const formattedResponse = kpi.reaponseFormatter && kpi.reaponseFormatter(response, e.data.key) || response;
								vm.tableData = formattedResponse.dataTable;
								renderKpi(formattedResponse.data, formattedResponse.dataTable, index+1);

							},function reject(err){
								console.log(err);
							});

							break;

						case 'string':

							break;

						default:
							const data = e.data.arr;
							const formattedResponse = kpi.reaponseFormatter && kpi.reaponseFormatter(data) || data;
							vm.tableData = formattedResponse.dataTable;
							renderKpi(formattedResponse.data, formattedResponse.dataTable, index+1);
					}

					vm.tableHeader = kpi.header;
					$scope.$apply();
				},
				legendStateChangeCallback: function(e){
					if(vm.selectedReport.kpis[index].customGraphName){
						const tempDataTable = dataTable.filter( (o,i) => !e.disabled[i] );
						vm.selectedReport.kpis[index].customGraphName(index, tempDataTable);
						vm.selectedReport.kpis[index].customTableTitle && vm.selectedReport.kpis[index].customTableTitle(index, tempDataTable);
					}else{
						let count = dataTable.length;
						e.disabled.forEach( (bool,i) => bool && (count -= data[i].count));
						setGraphAndTableName(kpiName, index, count);
					}

					$scope.$apply();
				}
			}],
			formatResponse: function(response){
				return response.data;
			},
			fullscreen: true,
			tempGraphData: angular.copy(data)
		};

		vm.aGraphObj[index].name = kpiName;
		vm.aGraphObj[index].description = vm.selectedReport.kpis[index].description;
		vm.aGraphObj[index].tableData = dataTable;

		if(vm.aGraphObj[index].graphData){
			vm.aGraphObj[index].api && vm.aGraphObj[index].api.updateWithData(data);
		}else
			vm.aGraphObj[index].graphData = data;

		setName(kpiName, index, dataTable);

		vm.aGraphObj[index].api && vm.aGraphObj[index].api.refresh();
	}

	function showTableOfThisKpi(oGraph, index) {
		vm.tableHeader = vm.selectedReport.kpis[index].header;
		vm.tableData = oGraph.tableData;
		vm.selectedKpiTable = index;

		setName(vm.selectedReport.kpis[index].name, index, oGraph.tableData);
	}

	function setName(kpiName, index, dataTable) {
		if(vm.selectedReport.kpis[index].customGraphName){
			vm.selectedReport.kpis[index].customGraphName(index, dataTable);
			vm.selectedReport.kpis[index].customTableTitle && vm.selectedReport.kpis[index].customTableTitle(index, dataTable);
		}else
			setGraphAndTableName(kpiName, index, dataTable.length);
	}

	function setGraphAndTableName(kpiName, i, count, onlySetTableTitle) {
		const arr = [];
		arr.push(
			...vm.selecteKpiChainName.slice(0, i),
			{
				key: 'Count',
				value: count
			}
		);

		if(onlySetTableTitle)
			vm.tableTitle = `${kpiName} (${arr.map( o => o.key+': '+o.value).join(', ')})`;
		else{
			vm.aGraphObj[i] = vm.aGraphObj[i] || {};
			vm.tableTitle = vm.aGraphObj[i].name = `${kpiName} (${arr.map( o => o.key+': '+o.value).join(', ')})`;
		}
	}
}

function gpsDashboardController(
	$scope,
	$timeout,
	objToCsv,
	dashboardService,
	gpsDashboardDataFactory
) {

	let vm = this;

	vm.downloadCsv = downloadCsv;
	vm.goBack = goBack;

	(function init(){
		vm.aData = [];
		vm.isBack = false;
		vm.visibility = true;
		getData();
	})();

	// Actual Function

	function downloadCsv(aData) {
		if(!(aData || []).length)
			return;
		objToCsv('DashboardReport', [
			'Vehicle',
			'Segment',
			'Status',
			'Address'
		], aData.map( o => {
			let arr = [];
			try{
				arr.push(o.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.segment || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.status || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.address.split(',').join(' ')  || 'NA');
			}catch(e){
				arr.push("NA");
			}
			return arr;
		}));
	}

	function customeTooltipChild(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response,
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			status[obj.status] = ++status[obj.status] || 1;
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function customeTooltipHead(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response[series.key],
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			obj.forEach(vehObj => {
				status[vehObj.status] = ++status[vehObj.status] || 1;
			});
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function dblClick(e) {
		if(vm.isBack)
			return;
		vm.store = vm.store || angular.copy(vm.data);
		const data = e.data.response;
		vm.isBack = true;
		vm.visibility = false;
		$scope.$apply();
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseChild;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipChild;
			vm.data = {
				data: data[Object.keys(data)[0]]
			};
			$scope.$apply();
		});
	}

	function click (e) {
		console.log(e);
		if(e.data.response && e.data.response[0] && e.data.response[0].device_imei){
			vm.showTable = true;
			vm.tableData = e.data.response;
		}
		else {
			vm.showTable = false;
			vm.tableData = [];
		}
		$scope.$apply();
	}

	function getData() {
		dashboardService.getService('api/tracking/vehicle/location', {
			__SRC__: 'WEB',
			type: 'zone',
			gpsExists: true,
			no_of_docs: Number.MAX_SAFE_INTEGER,
			$_methodType: 'post',
		}, successCallback, failureCallback);

		function successCallback(response) {
			vm.aData = gpsDashboardDataFactory();
			vm.aData[0].graphType[0].onDblClick = dblClick;
			vm.aData[0].graphType[0].click = click;
			vm.aData[0].graphType[0].formatResponse = formatResponseHead;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
			vm.data = response;
		}

		function failureCallback(err) {
			console.log(err, 'remove this log');
			swal('',err.data.message,'error');
		}
	}

	function goBack() {
		vm.isBack = false;
		vm.visibility = false;
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseHead;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
			vm.data = angular.copy(vm.store);
		});
	}

	function formatResponseChild(response) {
		return response.map(obj => {
			return {
				key: obj[0].state,
				value: obj.length,
				response: obj
			}
		});
	}

	function formatResponseHead(response){
		return response.map(obj => {
			const key = Object.keys(obj)[0];
			return {
				key: key,
				value: obj[key].reduce((a,b) => a + b.length, 0),
				response: obj
			}
		});
	}

}

function gpsMoniterController(
	$scope,
	$timeout,
	dashboardService,
	Vehicle
) {

	let vm = this;
	let numberFormat = function (e) {
		let temp = e+'';
		switch (temp.length){
			case 4: temp = temp.substr(0,1)+'K'; break;
			case 5: temp = temp.substr(0,2)+'K'; break;
			case 6: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'L'; break;
			case 7: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'L'; break;
			case 8: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'Cr'; break;
			case 9: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'Cr'; break;
		}
		return temp;
	};

	vm.setKpi = setKpi;

	(function init(){
		vm.aStatusData = [
			{
				name: 'Vehicle Status',
				graphType: [{
					type: "pieChart",
					xAxisKey: function (e) {
						return e.key;
					},
					yAxisKey: function (e) {
						return e.value;
					}
				}],
				formatResponse: function(response){
					return response.data;
				},
				fullscreen: false,
			},{
				name: 'Live Trips Status',
				graphType: [{
					type: "pieChart",
					xAxisKey: function (e) {
						return e.key;
					},
					yAxisKey: function (e) {
						return e.value;
					}
				}],
				formatResponse: function(response){
					return response.data;
				},
				fullscreen: false
			},{
				name: 'GPS Status',
				graphType: [{
					type: "pieChart",
					xAxisKey: function (e) {
						return e.key;
					},
					yAxisKey: function (e) {
						return e.value;
					}
				}],
				formatResponse: function(response){
					return response.data;
				},
				fullscreen: false
			}
		];
		// vm.aCurrentETAData = {
		// 	name: 'Current ETA',
		// 	graphType: [{
		// 		type: "discreteBarChart",
		// 		xAxisKey: function (e) {
		// 			return e.label;
		// 		},
		// 		xAxisLabel: 'Date',
		// 		yAxisKey: function (e) {
		// 			return e.value;
		// 		},
		// 		yAxisTickFormat: numberFormat,
		// 		yAxisLabel: 'Count',
		// 		customeTooltip: function (e) {
		// 			let series = e.series[0];
		// 			if (series.value === null) return;
        //
		// 			let tr = '';
		// 			e.data.list.forEach(function (o) {
		// 				tr +=
		// 					"<tr>" +
		// 						"<td class='key'>" + o.vehicle.vehicle_reg_no + "</td>" +
		// 						"<td class='key'>" + o.vehicle.segment_type + "</td>" +
		// 						"<td class='x-value'>" + (o.vehicle.trip.trip_no || 'NA') + "</td>" +
		// 					"</tr>";
		// 			});
        //
		// 			var header =
		// 				"<thead>" +
		// 					"<tr>" +
		// 						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
		// 						"<td class='key'><strong>" + series.key + "</strong></td>" +
		// 						"<td class='x-value'><strong>" + series.value + "</strong></td>" +
		// 					"</tr>" +
		// 					tr +
		// 				"</thead>";
        //
		// 			return "<table>" +
		// 				header +
		// 				"</table>";
		// 		}
		// 	}],
		// 	fullscreen: false
		// };
		vm.aStatusDataValue = [];
		vm.aVehData = [];
		Vehicle.vehicleWiseAll(setKpi);
	})();

	// Actual Function

	function setKpi(obj) {
		const oTemp = {};
		vm.gpsStatus = {
			active: 0,
			running: 0,
			stopped: 0,
			offline: 0,
		};
		vm.vehicleStatus = {
			inTrip: 0,
			maintenance: 0,
			available: 0,
			booked: 0,
			other: 0,
		};
		vm.delayStatus = {
			delay: 0,
			early: 0,
			onTime: 0,
		};

		vm.vehicleWiseData = obj;

		vm.vehicleWiseData.aTrSheetDevice.forEach( o => {
			if(vm.segmentType ? o.vehicle.segment_type === vm.segmentType : true){
				if(o.current_eta){
					const key = moment(o.current_eta).format('DD-MMM-YYYY');
					oTemp[key] = oTemp[key] || [];
					oTemp[key].push(o);
				}

				switch (o.vehicle.status){
					case "In Trip" : vm.vehicleStatus.inTrip++; break;
					case "Maintenance" : vm.vehicleStatus.maintenance++; break;
					case "Available" : vm.vehicleStatus.available++; break;
					case "Booked" : vm.vehicleStatus.booked++; break;
					default: vm.vehicleStatus.other++;
				}

				switch(o.vehicle.gpsData && o.vehicle.gpsData.status){
					case "running": vm.gpsStatus.running++; break;
					case "stopped": vm.gpsStatus.stopped++; break;
					case "offline": vm.gpsStatus.offline++; break;
				}

				switch(o.vehicle.status === "In Trip" && o.status){
					case 'Delayed':  vm.delayStatus.delay++; break;
					case 'Early': vm.delayStatus.early++; break;
					case 'On Time': vm.delayStatus.onTime++; break;
				}

				if(o.vehicle.gpsData)
					vm.gpsStatus.active++;
			}
		});


		// Vehicle Status
		vm.aStatusDataValue[0] = vm.aStatusDataValue[0] || [];

		vm.vehicleStatus.available = vm.vehicleStatus.available || 0;
		vm.aStatusDataValue[0][0] = vm.aStatusDataValue[0][0] || {};
		vm.aStatusDataValue[0][0].key = `Available (${vm.vehicleStatus.available})`;
		vm.aStatusDataValue[0][0].value = vm.vehicleStatus.available;

		vm.vehicleStatus.maintenance = vm.vehicleStatus.maintenance || 0;
		vm.aStatusDataValue[0][1] = vm.aStatusDataValue[0][1] || {};
		vm.aStatusDataValue[0][1].key = `Maintenance (${vm.vehicleStatus.maintenance})`;
		vm.aStatusDataValue[0][1].value = vm.vehicleStatus.maintenance;

		vm.vehicleStatus.inTrip = vm.vehicleStatus.inTrip || 0;
		vm.vehicleStatus.booked = vm.vehicleStatus.booked || 0;
		vm.aStatusDataValue[0][2] = vm.aStatusDataValue[0][2] || {};
		vm.aStatusDataValue[0][2].key = `In Transit (${(vm.vehicleStatus.inTrip + vm.vehicleStatus.booked)})`;
		vm.aStatusDataValue[0][2].value = (vm.vehicleStatus.inTrip + vm.vehicleStatus.booked);

		vm.vehicleStatus.other = vm.vehicleStatus.other || 0;
		vm.aStatusDataValue[0][3] = vm.aStatusDataValue[0][3] || {};
		vm.aStatusDataValue[0][3].key = `Others (${vm.vehicleStatus.other})`;
		vm.aStatusDataValue[0][3].value = vm.vehicleStatus.other;

		// Live Trips Status
		vm.aStatusDataValue[1] = vm.aStatusDataValue[1] || [];

		vm.delayStatus.delay = vm.delayStatus.delay || 0;
		vm.aStatusDataValue[1][0] = vm.aStatusDataValue[1][0] || {};
		vm.aStatusDataValue[1][0].key = `Delay (${vm.delayStatus.delay})`;
		vm.aStatusDataValue[1][0].value = vm.delayStatus.delay;

		vm.delayStatus.early = vm.delayStatus.early || 0;
		vm.aStatusDataValue[1][1] = vm.aStatusDataValue[1][1] || {};
		vm.aStatusDataValue[1][1].key = `Early (${vm.delayStatus.early})`;
		vm.aStatusDataValue[1][1].value = vm.delayStatus.early;

		vm.delayStatus.onTime = vm.delayStatus.onTime || 0;
		vm.aStatusDataValue[1][2] = vm.aStatusDataValue[1][2] || {};
		vm.aStatusDataValue[1][2].key = `On Time (${vm.delayStatus.onTime})`;
		vm.aStatusDataValue[1][2].value = vm.delayStatus.onTime;

		// GPS Status
		vm.aStatusDataValue[2] = vm.aStatusDataValue[2] || [];

		vm.gpsStatus.active = vm.gpsStatus.active || 0;
		vm.aStatusDataValue[2][0] = vm.aStatusDataValue[2][0] || {};
		vm.aStatusDataValue[2][0].key = `GPS Enabled (${vm.gpsStatus.active})`;
		vm.aStatusDataValue[2][0].value = vm.gpsStatus.active;

		vm.gpsStatus.running = vm.gpsStatus.running || 0;
		vm.aStatusDataValue[2][1] = vm.aStatusDataValue[2][1] || {};
		vm.aStatusDataValue[2][1].key = `Running (${vm.gpsStatus.running})`;
		vm.aStatusDataValue[2][1].value = vm.gpsStatus.running;

		vm.gpsStatus.stopped = vm.gpsStatus.stopped || 0;
		vm.aStatusDataValue[2][2] = vm.aStatusDataValue[2][2] || {};
		vm.aStatusDataValue[2][2].key = `Stopped (${vm.gpsStatus.stopped})`;
		vm.aStatusDataValue[2][2].value = vm.gpsStatus.stopped;

		vm.gpsStatus.offline = vm.gpsStatus.offline || 0;
		vm.aStatusDataValue[2][3] = vm.aStatusDataValue[2][3] || {};
		vm.aStatusDataValue[2][3].key = `Offine (${vm.gpsStatus.offline})`;
		vm.aStatusDataValue[2][3].value = vm.gpsStatus.offline;

		vm.aStatusData[0].api && vm.aStatusData[0].api.refresh();
		vm.aStatusData[1].api && vm.aStatusData[1].api.refresh();
		vm.aStatusData[2].api && vm.aStatusData[2].api.refresh();

		// TODO the kpi is hidden for enhancement @ gpsMoniter.html line:155
		// for(let k in oTemp){
		// 	if(!oTemp.hasOwnProperty(k))
		// 		return;
		// 	const obj = {};
		// 	obj.label = k;
		// 	obj.value = oTemp[k].length;
		// 	obj.list = oTemp[k];
		// 	vm.aVehData.push(obj);
		// }
		// vm.aVehData.sort(function(a,b){
		// 	// Turn your strings into dates, and then subtract them
		// 	// to get a value that is either negative, positive, or zero.
		// 	return new Date(a.label) - new Date(b.label);
		// });
	}
}

function gpsMoniterInTripController(
	$scope,
	$timeout,
	objToCsv
){

	let vm = this;
	vm.test='hii';

	vm.downloadCsv = downloadCsv;
	vm.goBack = goBack;
	vm.init = init;

	// Actual Function
	function init(response){
		vm.inTripChart = {};
		response = angular.copy(response);
		vm.isBack = false;
		vm.visibility = true;
		vm.aData = [
			{
				name: 'Vehicle In Trip ',
				graphType: [{
					type: "pieChart",
					xAxisKey: function (e) {
						return e.key;
					},
					yAxisKey: function (e) {
						return e.value;
					}
				}],
				formatResponse: function(response){
					return response.data;
				},
				fullscreen: false
			}
		];
		vm.aData[0].graphType[0].onDblClick = dblClick;
		vm.aData[0].graphType[0].click = click;
		vm.aData[0].graphType[0].formatResponse = formatResponseHead;
		vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
		vm.data = response.data.map( o => {
			const key = Object.keys(o)[0];
			if(!key)
				return false;

			o[key] = (o[key] || []).map( a => {
				return a.filter( ad => (ad.status === "In Trip" || ad.status === "Booked"));
			});

			o[key] = o[key].filter( a => !!a.length);

			return o;
		});

		vm.data = vm.data.filter( o => !!o[Object.keys(o)[0]].length);
	}

	function downloadCsv(aData) {
		if(!(aData || []).length)
			return;
		objToCsv('InTripReport', [
			'Vehicle',
			'Segment',
			'Address'
		], aData.map( o => {
			let arr = [];
			try{
				arr.push(o.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.segment || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.address.split(',').join(' ') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			return arr;
		}));
	}


	function customeTooltipChild(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response,
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			status[obj.status] = ++status[obj.status] || 1;
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function customeTooltipHead(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response[series.key],
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			obj.forEach(vehObj => {
				status[vehObj.status] = ++status[vehObj.status] || 1;
			});
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function dblClick(e) {
		if(vm.isBack)
			return;
		vm.store = vm.store || angular.copy(vm.data);
		const data = e.data.response;
		vm.isBack = true;
		vm.visibility = false;
		$scope.$apply();
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseChild;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipChild;
			vm.data = {
				data: data[Object.keys(data)[0]]
			};
			$scope.$apply();
		});
	}
	function click (e) {
		console.log(e);
		if(e.data.response && e.data.response[0] && e.data.response[0].device_imei){
			vm.showTable = true;
			vm.tableData = e.data.response;
		}
		else {
			vm.showTable = false;
			vm.tableData = [];
		}
		$scope.$apply();
	}

	function goBack() {
		vm.isBack = false;
		vm.visibility = false;
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseHead;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
			vm.data = angular.copy(vm.store);
		});
	}

	function formatResponseChild(response) {
		return response.map(obj => {
			return {
				key: obj[0].state,
				value: obj.length,
				response: obj
			}
		});
	}

	function formatResponseHead(response){
		return response.map(obj => {
			const key = Object.keys(obj)[0];
			return {
				key: key,
				value: obj[key].reduce((a,b) => a + b.length, 0),
				response: obj
			}
		});
	}

}

function gpsMoniterAvailiableController(
	$scope,
	$filter,
	$timeout,
	objToCsv,
	utils
){

	let vm = this;
	vm.test='hii';

	vm.downloadCsv = downloadCsv;
	vm.goBack = goBack;
	vm.init = init;

	// Actual Function
	function init(response){
		response = angular.copy(response);
		vm.isBack = false;
		vm.visibility = true;
		vm.aData = [
			{
				name: 'Vehicle Availiable ',
				graphType: [{
					type: "pieChart",
					xAxisKey: function (e) {
						return e.key;
					},
					yAxisKey: function (e) {
						return e.value;
					}
				}],
				formatResponse: function(response){
					return response.data;
				},
				fullscreen: false
			}
		];
		vm.aData[0].graphType[0].onDblClick = dblClick;
		vm.aData[0].graphType[0].click = click;
		vm.aData[0].graphType[0].formatResponse = formatResponseHead;
		vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
		vm.data = response.data.map( o => {
			const key = Object.keys(o)[0];
			if(!key)
				return false;

			o[key] = (o[key] || []).map( a => {
				return a.filter( ad => ad.status === "Available");
			});

			o[key] = o[key].filter( a => !!a.length);

			return o;
		});
		vm.data = vm.data.filter( o => !!o[Object.keys(o)[0]].length);
	}

	function downloadCsv(aData) {
		if(!(aData || []).length)
			return;
		objToCsv('AvailiableReport', [
			'Vehicle',
			'Segment',
			'Address',
			'Consignor',
			'Last Route',
			'Last Unloading Date',
			'Halt Time'
		], aData.map( o => {
			let arr = [];
			try{
				arr.push(o.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.segment || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.address.split(',').join(' ') || 'NA' );
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.nearestConsignor.name || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push(o.last_known.trip_name || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push($filter('date')(o.last_known.unloadingDate, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push(o.last_known.haltTime);
			}catch(e){
				arr.push("NA");
			}
			return arr;
		}));
	}


	function customeTooltipChild(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response,
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			status[obj.status] = ++status[obj.status] || 1;
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function customeTooltipHead(e) {
		const series = e.series[0];
		if (series.value === null) return;

		const header =
			"<thead>" +
			"<tr>" +
			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
			"<td class='key'><strong>" + series.key + "</strong></td>" +
			"<td class='x-value'>" + series.value + "</td>" +

			"</thead>";

		const val = e.data.response[series.key],
			status = {};
		let body = "<tbody>";

		val.forEach(obj => {
			obj.forEach(vehObj => {
				status[vehObj.status] = ++status[vehObj.status] || 1;
			});
		});

		for(let i in status)
			body = body +
				"<tr>" +
				"<td class='key'><strong>" + i + "</strong></td>" +
				"<td class='key'></td>" +
				"<td class='x-value'>" + status[i] + "</td>" +
				"</tr>";

		body = body + "</tbody>";

		return (
			"<table>" +
			header +
			body +
			"</table>"
		);
	}

	function dblClick(e) {
		if(vm.isBack)
			return;
		vm.store = vm.store || angular.copy(vm.data);
		const data = e.data.response;
		vm.isBack = true;
		vm.visibility = false;
		$scope.$apply();
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseChild;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipChild;
			vm.data = {
				data: data[Object.keys(data)[0]]
			};
			$scope.$apply();
		});
	}
	function click (e) {
		if(e.data.response && e.data.response[0] && e.data.response[0].device_imei){
			vm.showTable = true;
			vm.tableData = e.data.response.map(o => {
				//o.last_known.haltTime = o.last_known.haltTime && utils.calTimeDiffCurrentToLastInDHM(o.last_known.haltTime);
				const grStatuses = (o.last_known.trip && o.last_known.trip.gr && o.last_known.trip.gr[0] && o.last_known.trip.gr[0].statuses) || [];
				const tripStatuses = o.last_known.trip && o.last_known.trip.statuses || [];
				o.last_known.unloadingDate = grStatuses.find(o => o.status === 'Unloading Ended');
				o.last_known.unloadingDate = o.last_known.unloadingDate || grStatuses.find(o => o.status === 'Loading Started');
				o.last_known.unloadingDate = o.last_known.unloadingDate || tripStatuses.find(o => o.status === 'Trip started');
				o.last_known.unloadingDate = o.last_known.unloadingDate && o.last_known.unloadingDate.date;
				return o;
			});
		}
		else {
			vm.showTable = false;
			vm.tableData = [];
		}
		$scope.$apply();
	}

	function goBack() {
		vm.isBack = false;
		vm.visibility = false;
		$timeout(function () {
			vm.visibility = true;
			vm.aData[0].graphType[0].formatResponse = formatResponseHead;
			vm.aData[0].graphType[0].customeTooltip = customeTooltipHead;
			vm.data = angular.copy(vm.store);
		});
	}

	function formatResponseChild(response) {
		return response.map(obj => {
			return {
				key: obj[0].state,
				value: obj.length,
				response: obj
			}
		});
	}

	function formatResponseHead(response){
		return response.map(obj => {
			const key = Object.keys(obj)[0];
			return {
				key: key,
				value: obj[key].reduce((a,b) => a + b.length, 0),
				response: obj
			}
		});
	}

}

function mapViewController(
	$scope,
	$state,
	$filter,
	$http,
	$modal,
	$localStorage,
	$rootScope,
	$timeout,
	$window,
	$uibModal,
	Driver,
	DatePicker,
	FleetService,
	lazyLoadFactory,
	objToCsv,
	otherUtils,
	parseTableDataFilter,
	Routes,
	socketio,
	utils,
	Vehicle,
	tripServices,
	HTTPConnection,
	URL
){

	// object Identifiers
	let vm = this,
		map,
		toolTipMap;

	var timer;

	vm.oLiveData = {};
	vm.oFilter = {
		dateBy: 'expected_eta'
	};
	if($scope.$user.segment_type.length)
		vm.oFilter.segment_type = $scope.$user.segment_type;

	vm.DatePicker = angular.copy(DatePicker);
	vm.aDateBy = [
		{
			name: 'Expected ETA',
			value: 'expected_eta'
		},
		{
			name: 'Loading Date',
			value: 'vehicle.gr.loading_ended_status.date'
		}
	];

	vm.aGrStatus = ["Vehicle Arrived for loading", "Vehicle Arrived for unloading"];

	//vm.lazyLoad = lazyLoadFactory(); // init lazyload
	$rootScope.maps = {};
	$rootScope.plottedMarkers = [];

	vm.orderBy = {};


	// functions Identifiers
	vm.applyFilter = applyFilter;
	vm.downloadCsv = downloadCsv;
	vm.downloadExcel = downloadExcel;
	vm.getAllFleet = getAllFleet;
	vm.showDetailVehicleView = showDetailVehicleView;
	vm.getColor = getColor;
	vm.getDriver = getDriver;
	vm.getRoute = getRoute;
	vm.zoomIn = zoomIn;
	vm.zoomOut = zoomOut;
	vm.onSelect = onSelect;
	vm.prepareFilter = prepareFilter;
	vm.cities = cities;
	vm.getLivetrackVehicleData = getLivetrackVehicleData;
	vm.clearLocation = clearLocation;
	vm.placeMarker = placeMarker;
	vm.focusOnMap = focusOnMap;
	vm.triggerDelay = triggerDelay;
	vm.remarkUpdate = remarkUpdate;
	vm.vehicleDetailView = vehicleDetailView;
	vm.showTripDetailPopup = showTripDetailPopup;
	vm.detailView = detailView;

	// INIT functions
	(function init() {
		vm.running = 0;
		vm.stopped = 0;
		vm.inactive = 0;
		vm.offline = 0;
		vm.tableView = false;
		vm.aVehicleStatus = [
			'Running',
			'Stopped',
			'Offline'
		];
		$scope.showMap = true;

		$scope.$on('stateRefresh', function () {
			getLivetrackVehicleData(true);
		});

		vm.pageNumber = 1;

		$timeout(function () {
			mapInit();
			tableMapInit();
		});

		getLivetrackVehicleData();
		getAllFleet();
	})();

	// Actual Functions

	function downloadCsv(aData) {
		let cnt = 1;
		objToCsv('TrackSheet', [
			'S.No',
			'TL No.',
			'V. No.',
			'Vehicle type',
			'V. Status',
			'Customer',
			//'Consignor',
			'Fleet',
			'Route',
			'Intermittent Point',
			'KM. covered',
			'KM. left',
			'Halt Time',
			'Vehicle Arrival - Loading',
			'Loading End',
			'Trip Start D&T',
			'Vehicle Arrival - Unloading',
			'Unloading End',
			'Trip Status',
			'Comment Status',
			'Comment Remark',
			'Remark',
			'GPS Status',
			'Location',
			'Last Known D&amp;T',
			'TAT Hour',
			'Planned ETA',
			'Predicted ETA',
			'Segment',
			'Mob. No',
		], aData.map( o => {
			let arr = [];

			try{
				arr.push(cnt++ || 0 );

			}catch(e){
				arr.push(0);
			}

			try{
				arr.push(o.vehicle.trip.trip_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push( o.vehicle.veh_type_name || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.gr.customer ? o.vehicle.gr.customer.name : (o.vehicle.gr.booking.customer.name || "NA"))
			}catch(e){
				arr.push("NA");
			}
			// try{
			// 	arr.push( o.vehicle.gr.consignor ? o.vehicle.gr.consignor.name : (o.vehicle.gr.booking.consigner.name || "NA"))
			// }catch (e) {
			// 	arr.push("NA");
			// }

			try{
				arr.push(o.vehicle.owner_group || 'NA');
			}catch(e){
				arr.push("NA");
			}

			// try{
			// 	arr.push(o.vehicle.segment_type || 'NA');
			// }catch(e){
			// 	arr.push("NA");
			// }

			try{
				arr.push(o.vehicle.route_name );
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('arrayOfIntermitPointforcsv')(o.vehicle.trip) || 'NA');
			} catch (e) {
				arr.push("NA");
			}

			try{
				arr.push($filter('toString')(o.distance_travelled) || '0');
			}catch(e){
				arr.push("0");
			}

			try{
				// arr.push($filter('toString')(o.vehicle.route.route_distance - o.distance_travelled) || 'NA');
				arr.push($filter('toString')((o.vehicle.route && o.vehicle.route_name) ? (o.vehicle.route.route_distance - (o.distance_travelled ? (o.distance_travelled) : '0')) : '0') || '0');
			}catch(e){
				arr.push("0");
			}

			try{
				arr.push(o.vehicle.gpsData.status !== 'running'? o.vehicle.gpsData.stoppage_time : '0 min');
			}catch(e){
				arr.push("0");
			}
			try{
				arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.pod && o.vehicle.gr.pod.loadingArrivalTime, 'dd-MMM-yyyy \'at\' h:mma') || $filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.vehicle_arrived_for_loading_status && o.vehicle.gr.vehicle_arrived_for_loading_status.date, 'dd-MMM-yyyy \'at\' h:mma')||'NA');
				// arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.vehicle_arrived_for_loading_status && o.vehicle.gr.vehicle_arrived_for_loading_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.pod && o.vehicle.gr.pod.billingLoadingTime, 'dd-MMM-yyyy \'at\' h:mma') || $filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.loading_ended_status && o.vehicle.gr.loading_ended_status.date, 'dd-MMM-yyyy \'at\' h:mma')|| 'NA');
				// arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.loading_ended_status && o.vehicle.gr.loading_ended_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push($filter('date')(o.vehicle && o.vehicle.trip && o.vehicle.trip.trip_start_status && o.vehicle.trip.trip_start_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.pod && o.vehicle.gr.pod.unloadingArrivalTime, 'dd-MMM-yyyy \'at\' h:mma')||$filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.vehicle_arrived_for_unloading_status && o.vehicle.gr.vehicle_arrived_for_unloading_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
				// arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.vehicle_arrived_for_unloading_status && o.vehicle.gr.vehicle_arrived_for_unloading_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.pod && o.vehicle.gr.pod.billingUnloadingTime, 'dd-MMM-yyyy \'at\' h:mma') ||$filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.unloading_ended_status && o.vehicle.gr.unloading_ended_status.date, 'dd-MMM-yyyy \'at\' h:mma')|| 'NA');
				// arr.push($filter('date')(o.vehicle && o.vehicle.gr && o.vehicle.gr.unloading_ended_status && o.vehicle.gr.unloading_ended_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.t_status || 'NA');
			}catch(e){
				arr.push("NA");
			}
			//************************ manual tracking last status
			try{
				arr.push(o.vehicle.mTrack && o.vehicle.mTrack.status  || 'NA');
			}catch(e){
				arr.push("NA");
			}
			//************************ manual tracking last remark
			try{
				arr.push(o.vehicle.mTrack && o.vehicle.mTrack.remarks.replace(/,/g,' ') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			//remark
			try{
				arr.push(o.vehicle.trip.rmk || 'NA');
			}catch(e){
				arr.push("NA");
			}

			//***********************gps status
			try{
				arr.push(o.vehicle.gpsData && o.vehicle.gpsData.status || 'NA');
			}catch(e){
				arr.push("NA");
			}
			//*************************

			try{
				arr.push((o.vehicle.gpsData.addr && o.vehicle.gpsData.addr.replace(/,/g,' ')) || (o.vehicle.gpsData.address && o.vehicle.gpsData.address.replace(/,/g,' ')) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.vehicle.gpsData.datetime, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}
			try{
				arr.push(o.vehicle.trip.tat_hr || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.expected_eta, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.current_eta, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.segment_type || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				if($scope.$configs && $scope.$configs.tracking && $scope.$configs.tracking.driverMob)
				    arr.push(o.vehicle.driver_contact_no || o.vehicle.trip && o.vehicle.trip.driver && o.vehicle.trip.driver.prim_contact_no || 'NA');
				else
					arr.push(o.vehicle.owner_mobile || 'NA');
			}catch(e){
				arr.push("NA");
			}

			return arr;
		}));


	}

	function downloadExcel() {
		let request = {
			all: true,
			download: true
		};
		Vehicle.vehicleWise(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.data.message, 'error');
		}

		function successCallback(response) {
			const $a = $window.document.createElement('a');
			$a.href = response.url;
			$a.click();
		}
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({ all: true }, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function triggerDelay() {
		if(timer){
			$timeout.cancel(timer);
			timer = null;
		}
		timer = $timeout(function(){
			applyFilter();
		},300);
	}

	function cities(query) {
		if (query && query.toString ().length > 2) {
			let oUrl = {type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"};
			let q = {
				location: map.getCenter ().lat + "," + map.getCenter ().lng,
				zoom: map.getZoom (),
				query: query
			};
			let locationUrl = oUrl.url + otherUtils.prepareQeury (q);
			return $http ({
				method: "get",
				url: locationUrl
			}).then (function (response) {
				if (oUrl.type === "mapMyIndiaGeoCode") {
					aLocations = mapMyIndiaResponse (response.data);
					return aLocations;
				} else {
					$scope.aLocations = response.data.suggestedLocations.map(o => ({
						...o,
						formatted_address: o.placeName + (o.placeAddress ? `(${o.placeAddress})` : '')
					}));
					return $scope.aLocations;
				}
				//return limitToFilter(response.data, 15);
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	}

	function mapMyIndiaResponse(responseData) {
		let result = [];
		if(responseData && responseData.results && responseData.results.length>0){
			for(let i=0; i<responseData.results.length;i++){
				responseData.results[i].display_name = responseData.results[i].formatted_address;
				if(responseData.results[i].lat){
					responseData.results[i].lat = parseFloat(responseData.results[i].lat);
				}
				if(responseData.results[i].latitude){
					responseData.results[i].lat = parseFloat(responseData.results[i].latitude);
				}
				if(responseData.results[i].lng){
					responseData.results[i].lng = parseFloat(responseData.results[i].lng);
				}
				if(responseData.results[i].longitude){
					responseData.results[i].lng = parseFloat(responseData.results[i].longitude);
				}
				if(!responseData.results[i].formatted_address){
					responseData.results[i].formatted_address = "";
					responseData.results[i].formatted_address += responseData.results[i].houseName?responseData.results[i].houseName+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].houseNumber?responseData.results[i].houseNumber+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].subDistrict?responseData.results[i].subDistrict+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].district?responseData.results[i].district+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].city?responseData.results[i].city+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].state?responseData.results[i].state:"";
				}
				result.push(responseData.results[i])
			}
		}
		return result;
	}

	let locationCircle;
	function clearLocation () {
		if (locationCircle && map.hasLayer (locationCircle)) {
			map.removeLayer (locationCircle)
		}
	}
	function setLocationCircle (lat,lng,radius) {
		if(lat && lng && radius) {
			clearLocation();
			locationCircle = L.circle ([lat, lng],parseInt(radius*1000))
				.bindTooltip (`(${lat},${lng})` , {permanent: false, direction: 'top'})
				.openTooltip ()
				.addTo (map);
			map.fitBounds(locationCircle.getBounds());
		}
	}

	function searchVehicleInRadius (lat,lng,radius) {
		setLocationCircle(lat,lng,radius);
		vm.aCopyTrSheetDevice = vm.aCopyTrSheetDevice.filter(obj => {
			return utils.getDistanceInKm(lat,lng,obj.lat,obj.lng) < radius;
		});
	}
	     //dev
		// function filterValue(expected_eta){
		 // 	return $filter('date')(vm.myFilter.vehicle.expected_eta, 'dd-MMM-yyyy \ h:mma')
		 // }

	function remarkUpdate(vehicle,type) {
		vm.vehicle = vehicle;
		vm.vehicle.type = type;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/gps/tracking/remarkPopup.html',
			controller: 'remarkUpdateCtrl',
			controllerAs: 'vm',
			resolve: {
				thatTrip: function () {
					return vm.vehicle;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			vm.vehicle = data.data.data;
		}, function (data) {

		});
	};

	function vehicleDetailView(vehicle) {
			$modal.open({
				templateUrl: 'views/gps/tracking/tripDetails.html',
				controller: ['$scope', '$uibModalInstance', 'otherData', 'lazyLoadFactory', 'tripServices', tripDetailsPopUpController],
				controllerAs: 'thVm',
				resolve: {
					otherData: function(){
						return {
							vehicle
						};
					}
				}
			}).result.then(function(response) {
				console.log('close',response);
			}, function(data) {
				console.log('cancel',data);
			});
		}

	function showTripDetailPopup(vehicle) {
		vehicle.manualTracking = true;
		$modal.open({
			templateUrl: 'views/myTripsStatus/myTripDetailPopup.html',
			controller: ['$rootScope', '$filter', '$scope', '$uibModal', '$uibModalInstance', '$timeout', 'DatePicker', 'growlService', 'objToCsv', 'oTrip', 'tripServices', 'utils', 'Vehicle', tripDetailPopupCtrl],
			controllerAs: 'vm',
			size: 'xl',
			resolve: {
				oTrip: vehicle
			}
		}).result.then();
	}
	function detailView(vehicle) {
		let request = {
			_id: vehicle._id
		};

		Vehicle.getVehiclesWithPagination(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
			// reject(err.data.message);
		}

		function onSuccess(res) {
			console.log(res);
			// swal('Success',res.data.message, 'success');
			callModal(res.data[0]);
		}

		function callModal(oVehicle) {
			$modal.open({
				templateUrl: 'views/myRegisteredVehicle/detailViewPopup.html',
				controller: ['$scope', '$uibModalInstance', 'modelDetail', 'otherData', 'Vehicle', vehicleDetailPopupController],
				controllerAs: 'detailVm',
				resolve: {
					modelDetail: function() {
						return {
							hideEditButton: true,
							hideKey: {
								device_imei: true,
							}
						};
					},
					otherData: function(){
						return {
							oVehicle
						};
					}
				}
			}).result.then(function(response) {
				console.log('close',response);
			}, function(data) {
				console.log('cancel',data);
			});
		}
	}

	function getColor(status) {
		switch(status){
			case 'running': return 'ja-green';
			case 'stopped': return 'ja-red';
			default : return 'ja-grey';
		}
	}

	function getDriver(str) {
		if(str.length <=2)
			return;
		Driver.getAllDrivers({
			name: str
		}, success);

		function success(data) {
			vm.aDriver = data.data;
		}
	}

	function getLivetrackVehicleData(toRefresh) {
		let initCb = function () {
			removeAllMarkerOnMap();
		};
		let cb = function (obj,resData) {
			vm.aTrSheetDevice = obj.aTrSheetDevice;
			plotMarkerOnMap(resData || obj.aTrSheetDevice);
			applyFilter();
		};
		Vehicle.vehicleWiseAll(cb, initCb, toRefresh)
	}

	function getRoute(str) {
		if(str.length <=2)
			return;
		Routes.getAllRoutes({
			name: str
		}, success);

		function success(data) {
			vm.aRoute = data.data.data;
		}
	}

	function mapInit() {
		$rootScope.maps = utils.initializeMapView('mapViewTracking', {
			zoomControl: false,
			hybrid: true,
			zoom: 4,
			search: true,
			location: false,
			center: new L.LatLng(21, 90)
		}, true);
		map = $rootScope.maps.map;
		map.on('dblclick', function(ev) {
			if(ev.originalEvent instanceof MouseEvent) {
				vm.location = {formatted_address: "Custom", lat: ev.latlng.lat, lng: ev.latlng.lng};
				applyFilter ();
			}
		});
	}

	function zoomIn() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom<17)
				$rootScope.maps.map.setZoom(++curZoom);
		}
	}

	function zoomOut() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom>2)
				$rootScope.maps.map.setZoom(--curZoom);
		}
	}

	function applyFilter() {

		//initialize

		vm.tripStatusCount = {
			running: 0,
			stopped: 0,
			offline: 0,
		};

		vm.timeStatusCount = {
			'Delayed' : 0,
			'Early' : 0,
			'On Time' : 0,
		};

		vm.availabilityStatusCount = {['In Trip']: 0,
			"In Trip": 0,
			"Maintenance": 0,
			"Available": 0,
			"Booked": 0,
			"Empty": 0,
			"Block": 0,
			"Driver rest": 0,
			"Accident": 0,
			other: 0
		};

		prepareFilter ();
		// vm.aCopyTrSheetDevice = $filter('orderBy')(vm.aCopyTrSheetDevice, Object.values(vm.orderBy)[0] ===1 ? Object.keys(vm.orderBy)[0] : '-'+Object.keys(vm.orderBy)[0] , false);
		vm.aCopyTrSheetDevice = $filter ('filter') (vm.aTrSheetDevice, vm.myFilter);
		vm.aCopyTrSheetDevice = vm.aCopyTrSheetDevice.filter(obj => {

			let delayBool = false,
				etaBool = false,
				segBool = false,
				fleetBool = false;

			if(vm.oFilter.segment_type && vm.oFilter.segment_type.length)
				segBool = !!vm.oFilter.segment_type.find(s => s === obj.vehicle.segment_type );
			else
				segBool = true;

			if(vm.oFilter.owner_group && vm.oFilter.owner_group.length)
				fleetBool = !!vm.oFilter.owner_group.find(s => s === obj.vehicle.owner_group );
			else
				fleetBool = true;

			if(vm.oFilter.delay){
				if(vm.oFilter.delay === 'Delayed')
					delayBool = obj.trip_delay > 3;
				else if(vm.oFilter.delay === 'Early')
					delayBool = obj.trip_delay < -3;
				else if(vm.oFilter.delay === 'On Time')
					delayBool = obj.trip_delay > -3 && obj.trip_delay < 3 && obj.vehicle.trip;
			}else
				delayBool = true;

			if(vm.oFilter.commomDate){
				let min = vm.oFilter.commomDate.setHours(0,0,0),
					max = vm.oFilter.commomDate.setHours(23,59,59),
					expected_eta;

				$scope.jaTemp = obj;
				expected_eta = parseTableDataFilter(obj, 'jaTemp.'+vm.oFilter.dateBy, $scope);

				if(expected_eta){
					expected_eta = new Date(expected_eta).getTime();
					if(expected_eta > min && expected_eta < max)
						etaBool = true;
				}
			}else
				etaBool = true;

			if(delayBool && etaBool && segBool && fleetBool){

				switch (obj.vehicle.status){
					case "In Trip" : vm.availabilityStatusCount["In Trip"]++; break;
					case "Maintenance" : vm.availabilityStatusCount["Maintenance"]++; break;
					case "Available" : vm.availabilityStatusCount["Available"]++; break;
					case "Booked" : vm.availabilityStatusCount["Booked"]++; break;
					case "Empty Trip" : vm.availabilityStatusCount["Empty"]++; break;
					case "Block" : vm.availabilityStatusCount["Block"]++; break;
					case "Driver rest" : vm.availabilityStatusCount["Driver rest"]++; break;
					case "Accident" : vm.availabilityStatusCount["Accident"]++; break;
					default: vm.availabilityStatusCount.other++;
				}

				switch(obj.vehicle.gpsData && obj.vehicle.gpsData.status){
					case "running": vm.tripStatusCount.running++; break;
					case "stopped": vm.tripStatusCount.stopped++; break;
					case "offline": vm.tripStatusCount.offline++; break;
					default: vm.tripStatusCount.stopped++;
				}
				switch(obj.status){
					case 'Delayed':  vm.timeStatusCount['Delayed']++; break;
					case 'Early': vm.timeStatusCount['Early']++; break;
					case 'On Time': vm.timeStatusCount['On Time']++; break;
				}

				return true;
			}else
				return false;
		});
		delete $scope.jaTemp;
		if(vm.location && (vm.location.lat || vm.location.latitude) && (vm.location.lng || vm.location.longitude) && vm.radius) {
			searchVehicleInRadius((vm.location.lat || vm.location.latitude), (vm.location.lng || vm.location.longitude), vm.radius);
		}
		vm.aCopyTrSheetDevice = $filter ('orderBy') (vm.aCopyTrSheetDevice, 'vehicle.gpsData.s_status', false);
		$timeout(function () {
			$scope.$apply();
		});
			removeAllMarkerOnMap();
			plotMarkerOnMap(vm.aCopyTrSheetDevice);
		return false;
	}

	function onSelect($item, $model, $label){
		if($item.eLoc){
		//TODO check MMI APIs
			let oUrl = {type: "mapMyIndiaELoc", url: "http://trucku.in:8081/api/mapmyindia/place_detail?place_id="};
			let locationUrl = oUrl.url + $item.eLoc;
			return $http ({
				method: "post",
				url: locationUrl
			}).then (function (response) {
				aLocations = mapMyIndiaResponse (response.data);
				// vm.location = aLocations[0] || {};
				applyFilter();
			});
		}else {
			applyFilter();
		}
	}

	function prepareFilter() {
		vm.myFilter = {};

		if(vm.oFilter.vehicle_reg_no){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.vehicle_reg_no = vm.oFilter.vehicle_reg_no;
		}
		if(vm.oFilter.status){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gpsData = vm.myFilter.vehicle.gpsData || {};
			if(vm.oFilter.status === "running" ||
				vm.oFilter.status === "stopped" ||
				vm.oFilter.status === "offline")
				vm.myFilter.vehicle.gpsData.status = vm.oFilter.status.toLowerCase();
			else if(vm.oFilter.status === "OnTrip")
				vm.myFilter.vehicle.trip = '!';
		}

		// if(vm.oFilter.branch)
		// 	vm.myFilter.branch = vm.oFilter.branch;

		if(vm.oFilter.trip_no){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.trip = vm.myFilter.vehicle.trip || {};
			vm.myFilter.vehicle.trip.trip_no = vm.oFilter.trip_no;
		}

		if(vm.oFilter.vehicleStatus){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.status = vm.oFilter.vehicleStatus;
		}

		if(vm.oFilter.grNumber){
			vm.myFilter.aGr = vm.myFilter.aGr || {};
			vm.myFilter.aGr.grNumber = vm.oFilter.grNumber;
		}

		if(vm.oFilter.grStatus){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gr = vm.myFilter.vehicle.gr || {};
			vm.myFilter.vehicle.gr.status = vm.oFilter.grStatus;
		}
		if(vm.oFilter.route){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.route = vm.myFilter.vehicle.route || {};
			vm.myFilter.vehicle.route._id = vm.oFilter.route._id;
		}

		if(vm.oFilter.driver){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.trip = vm.myFilter.vehicle.trip || {};
			vm.myFilter.vehicle.trip.driver = vm.oFilter.driver._id;
		}

		if(vm.oFilter.imei){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.device_imei = vm.oFilter.imei;
		}

		if(vm.oFilter.jaTemp){
			vm.myFilter['$'] = vm.oFilter.jaTemp;
		}
		if(vm.oFilter.customer){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gr = vm.myFilter.vehicle.gr || {};
			vm.myFilter.vehicle.gr.customer = vm.myFilter.vehicle.gr.customer || {};
			vm.myFilter.vehicle.gr.customer.name = vm.oFilter.customer;
		}
	}

	function showDetailVehicleView(vehicleObj, index){

		$scope.showMap = false;
		$scope.selectedIndex = index;
		$scope.isShow = true;
		$state.go('gps.tracking.vehicleDetailView', {data: vehicleObj});
		return;

		// $modal.open({
		// 	templateUrl: 'views/gps/tracking/vehicleTrack.html',
		// 	controller: ['$scope','$timeout', '$uibModalInstance', 'DatePicker', 'utils', 'gpsSocketService', 'vehicleObj', vehicleTrackController],
		// 	controllerAs: 'vmvVm',
		// 	backdrop: false,
		// 	resolve: {
		// 		'vehicleObj': function () {
		// 			return vehicleObj;
		// 		}
		// 	}
		// });

		// modalInstance.result.then(function(response) {
		// 	console.log('close',response);
		// }, function(data) {
		// 	console.log('cancel', data);
		// });

	}

	let vehiclePopup;
	function focusOnMap(vehicle) {
		let curentZoom = $scope.maps.map.getZoom();
		if(vehicle.vehicle.gpsData.lat && vehicle.vehicle.gpsData.lng)
		$scope.maps.map.setView([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng], 9);
		$scope.showMap=true;
		$scope.selectedIndex = null;
		try {
			vehiclePopup = new L.popup({closeOnClick:false})
				.setContent(vehicle.vehicle.vehicle_reg_no)
				.setLatLng([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng])
				.openOn($scope.maps.map);
		}catch (e){}
	}

	///////////////////////////////////////////////////
	function plotMarkerOnMap(data) {
		if(data && data.length>0) {
			for (var i = 0; i < data.length; i++) {
				if(!data[i].vehicle.gpsData)
					continue;

				if (data[i].vehicle.gpsData.lat && data[i].vehicle.gpsData.lng) {
					if ($rootScope.maps.map) {
						utils.addOnCluster($rootScope.maps, utils.createMarker(data[i].vehicle.gpsData), data[i].vehicle.gpsData)
						/*if ($rootScope.plottedMarkers.length > 1) {
							utils.prepareCluster($rootScope.maps, $rootScope.plottedMarkers);
						}*/
					}
				}
			}
		}else {
			$rootScope.maps.clusterL.Cluster._clusters = [];
		}
		if($rootScope.maps && $rootScope.maps.clusterL) {
			//$rootScope.maps.clusterL.FitBounds();
			//$rootScope.maps.map.fitBounds($rootScope.maps.map.getBounds());
		}
	};

	function removeAllMarkerOnMap () {
		if($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.map) {
			$rootScope.maps.map.removeLayer ($rootScope.maps.clusterL);
			$rootScope.maps.clusterL = utils.initializeCluster(map);
		}
	}

	// let toolTipMap,
	// 	toolTipMapDiv = ($('<div class="card-body" id="toolTipMapId"' +
	// 		'style="width:100%; height: 100%; z-index: 1;">' +
	// 		'</div>'))[0];

	function tableMapInit() {
		toolTipMap = utils.initializeMapView ('toolTipDiv', {
			zoomControl: true,
			hybrid: false,
			zoom: 13,
			search: false,
			location: false
		});
	}

	vm.downloadLiveTripReport = function(group) {
	  if(group) {
	    var filter = {__SRC__:'WEB',all: true, download:1,group_by:group};
	    HTTPConnection.post(URL.LIVE_TRACKER_VEHICLE, filter, (res) => {
        var $a = document.createElement('a');
        $a.setAttribute("type", "hidden");
        $a.setAttribute('id',`tripHistoryReport_${Math.random()}`);
        $a.setAttribute('href',res.data.url);
        $a.setAttribute('download',res.data.url);
        $a.setAttribute('target','_blank');
        document.body.appendChild($a);
        $a.click();
        $a.remove();
      }, (err) => {
        console.log(err);
      });
    }
  };

	function placeMarker(oVehicle) {
		if(!oVehicle.lng || !oVehicle.lat) return;
		if(toolTipMap.marker && toolTipMap.map.hasLayer(toolTipMap.marker)){
			toolTipMap.map.removeLayer(toolTipMap.marker);
		}
		toolTipMap.marker = L.marker([oVehicle.lat, oVehicle.lng])
			.bindTooltip(oVehicle.vehicle.vehicle_reg_no,{permanent:false,direction:'top'})
			.openTooltip()
			.addTo(toolTipMap.map);
		toolTipMap.map.setView(new L.LatLng(oVehicle.lat, oVehicle.lng), 8);
	}

	let zoomDeviceInMap = function (device) {
		if (device.status !== 'inactive') {
			$rootScope.maps.map.setView(new L.LatLng(device.lat, device.lng), 13);
			//map.fitBounds([[device.lat,device.lng]]);
		} else {
			swal('This Device is Inactive.');
		}
	}
}

materialAdmin.controller('remarkUpdateCtrl', function (
	growlService,
	$uibModalInstance,
	thatTrip,
	tripServices,
	Vehicle) {

	let vm = this;
	vm.vehicle = {};
	vm.vehicle = thatTrip;
	vm.type = thatTrip.type;
	vm.vehicle.vehicle.vehicle_reg_no = vm.vehicle.vehicle.vehicle_reg_no;
	vm.owner_mobile = vm.vehicle.vehicle.owner_mobile;
	vm.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};


	vm.updateInfo = function () {
		function success(res) {
			console.log(res);
			swal(res.data.message);
			$uibModalInstance.close(res);

		}

		function failure(res) {
			var msg = res.data.message;
			$uibModalInstance.dismiss(res);
			growlService.growl(msg, 'danger', 2);
		}

		var oSend = {};
		if (vm.vehicle && vm.type == 'Remark') {
			oSend._id = vm.vehicle.vehicle.trip._id;
			oSend.rmk = vm.rmk;
			tripServices.update(oSend, success, failure);
		}
		else if(vm.vehicle && vm.type == 'Owner_Mobile_No'){
			oSend._id = vm.vehicle.vehicle._id;
			oSend.owner_mobile = vm.owner_mobile;
			oSend.ownershipType = 'Own';
			Vehicle.updateRegVehicle(oSend, success, failure);
		}

	};

});

function vehicleTrackController(
	$scope,
	$stateParams,
	$timeout,
	DatePicker,
	utils,
	gpsSocketService
){

	let LeafIcon = L.Icon.extend({
		options: {
			iconSize:   [36, 45],
			iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
			popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
		}
	});


	////////////////////////////////////////////////////////////////

	let lineIconOptions = L.Icon.extend({
		options: {
			iconSize:   [15, 15],
			iconAnchor: [7.5, 7.5]
		}
	});


	//Object Identifier
	let vm = this,
		oRes, map, oMap,flagLayer, lineLayer, startPointMarker, endPointMarker,stopMarkers,
		flagIcon = new LeafIcon({iconUrl: 'img/stopFlag.png'}),
		startIcon = new LeafIcon({iconUrl: 'img/start.png'}),
		stopIcon = new LeafIcon({iconUrl: 'img/stop.png'}),
		greenFlagIcon = new LeafIcon({iconUrl: 'img/greenFlag.png'}),
		yellowFlagIcon = new LeafIcon({iconUrl: 'img/yellowFlag.png'}),
		greyFlagIcon = new LeafIcon({iconUrl: 'img/greyFlag.png'}),
		lineIcon = new lineIconOptions({iconUrl: getLineIconSvg()})
	;

	//Function Identifier
	vm.closeModal = closeModal;
	vm.search = search;
	vm.getColor = getColor;
	vm.dateChange = dateChange;
	vm.plotFlagData = plotFlagData;
	vm.resizeFullScreen = resizeFullScreen;
	vm.resizeSmallScreen = resizeSmallScreen;
	vm.aTime = ["15 min", "30 min", "1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr"];

	$scope.vehicle = $stateParams.data;
	$scope.isShow = true;

	$scope.dateTimeStart = new Date();
	$scope.dateTimeStart.setHours(0);
	$scope.dateTimeStart.setMinutes(0);
	$scope.dateTimeStart.setSeconds(0);
	$scope.dateTimeStart.getMilliseconds(0);
	$scope.dateTimeEnd = new Date();

	function getColor(status) {
		switch(status){
			case 'running': return 'ja-green';
			case 'stopped': return 'ja-red';
			default : return 'ja-grey';
		}
	}

	//Init
	(function init() {
		vm.playData = [];
		vm.DatePicker = angular.copy(DatePicker);
		vm.aHour = Array(24).fill('').map((o,i) => i);
		vm.aMin = Array(60).fill('').map((o,i) => i);
		vm.start = {};
		vm.end = {};

		vm.start.date = $scope.dateTimeStart;
		vm.start.hour = $scope.dateTimeStart.getHours();
		vm.start.min = $scope.dateTimeStart.getMinutes();

		vm.end.date = $scope.dateTimeEnd;
		vm.end.hour = $scope.dateTimeEnd.getHours();
		vm.end.min = $scope.dateTimeEnd.getMinutes();
		vm.zoomIn = zoomIn;
		vm.zoomOut = zoomOut;

		$timeout(function () {
			mapInit();
		});
		getplayData();
		dateChange();
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function dateChange(dateType){
		let maxDay=14;
		if(dateType === 'startDate' && vm.end.date){
			if(moment(vm.end.date).add(-maxDay, 'day').isAfter(moment(vm.start.date))){
				vm.end.date = moment(vm.start.date).add(maxDay, 'day').toDate();
			}
			if(vm.start.date > vm.end.date)
			vm.end.date = vm.start.date;
		}else if(dateType === 'endDate' && vm.start.date){
			if(moment(vm.start.date).add(-maxDay, 'day').isAfter(moment(vm.end.date))){
				vm.start.date = moment(vm.end.date).add(maxDay, 'day').toDate();
			}
		}
		vm.maxStartDate=new Date();
		vm.maxEndDate = Math.min(moment(vm.start.date).add(maxDay, 'day').toDate(), new Date());
		vm.minEndDate=vm.start.date;

		if(dateType === 'startDate' && vm.end_date && vm.start_date){

			let isDate = vm.end.date instanceof Date,
				monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
				dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date(vm.start.date);
				vm.end.date = new Date(date.setMonth(date.getMonth() + 1));
			}

		}else if(dateType === 'endDate' && vm.end_date && vm.start_date) {

			let isDate = vm.start.date instanceof Date,
				monthRange = vm.end.date.getMonth() - vm.start.date.getMonth(),
				dateRange = vm.end.date.getDate() - vm.start.date.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - vm.start.date.getDate() + vm.end.date.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date(vm.end.date);
				vm.start.date = new Date(date.setMonth(date.getMonth() - 1));
			}
		}
	}

	function zoomIn() {
		if(map){
			curZoom = map.getZoom();
			if(curZoom && curZoom<17)
				map.setZoom(++curZoom);
		}
	}

	function zoomOut() {
		if(map){
			curZoom = map.getZoom();
			if(curZoom && curZoom>2)
				map.setZoom(--curZoom);
		}
	}

	function resizeFullScreen(){
		$scope.isShow = true;
	}

	function resizeSmallScreen(){
		$scope.isShow = false;
	}

	function getplayData() {
		let playBack = {};
		playBack.request = 'playback';
		playBack.version = 2;
		playBack.device_id = $stateParams.data.vehicle.device_imei;
		playBack.start_time = $scope.dateTimeStart.toISOString();
		playBack.end_time = $scope.dateTimeEnd.toISOString();
		playBack.selected_uid = $scope.$clientConfigs.gpsId;
		playBack.login_uid = $scope.$clientConfigs.gpsId;
		playBack.lms_uid = $scope.$user.userId;
		playBack.idling = true;
		gpsSocketService.getplayData(playBack, playBackResponse);
		$timeout(()=>{
			if($stateParams.data.vehicle && $stateParams.data.vehicle.trip && $stateParams.data.vehicle.trip.geofence_points) {
				let geofence_points = $stateParams.data.vehicle.trip.geofence_points;
				if(geofence_points.length)
				plotFlagData(geofence_points);
			}
		},100);
		function playBackResponse(oRes){
			if(oRes){
				if(oRes.status === 'OK'){
					for (let i = 0; i < oRes.data.length; i++) {
						oRes.data[i].start_time_cal = oRes.data[i].start_time;
						oRes.data[i].end_time_cal = oRes.data[i].end_time;
						oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
						oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
						if(oRes.data[i].duration){
							oRes.data[i].duration = oRes.data[i].duration/3600;
							oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
							oRes.data[i].duration = parseFloat(oRes.data[i].duration);
						}
						if(oRes.data[i].distance){
							oRes.data[i].distance = oRes.data[i].distance/1000;
							oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
						}
					}
					if(oRes.tot_dist){
						oRes.tot_dist = oRes.tot_dist/1000;
						oRes.tot_dist = oRes.tot_dist.toFixed(2);
					}
					vm.playData = oRes.data.length ? oRes.data : [];
					plotData(oRes.data);
					//$rootScope.playData = oRes;
					//$rootScope.redirect('/#!/main/playPosition');
				}
				else if(oRes.status === 'ERROR'){
					//swal(oRes.message, "", "error");
				}
			}
			$timeout(function () {
				vm.oRes = oRes;
			});
		}
	}

	function mapInit() {
			oMap = utils.initializeMapView('mapViewVehicleTrackingModal', {
				zoomControl: false,
				hybrid: true,
				zoom: 4,
				search: false,
				location: false,
				center: new L.LatLng(21, 90)
			}, false);
			map = oMap.map;

		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);

		if(false && $stateParams.data && $stateParams.data.lat && $stateParams.data.lng){
			let marker = L.marker([$stateParams.data.lat, $stateParams.data.lng]);
			utils.makeMarker(marker,$stateParams.data.vehicle.gpsData);
			map.addLayer(marker);
		}
	}

	function search() {
		$scope.dateTimeStart = vm.start.date;
		$scope.dateTimeStart.setHours(vm.start.hour);
		$scope.dateTimeStart.setMinutes(vm.start.min);
		$scope.dateTimeStart.setSeconds(0);

		$scope.dateTimeEnd = vm.end.date;
		$scope.dateTimeEnd.setHours(vm.end.hour);
		$scope.dateTimeEnd.setMinutes(vm.end.min);
		$scope.dateTimeEnd.setSeconds(0);

		let diff=vm.end.date-vm.start.date;
		let TotalDays = Math.ceil(diff / (1000 * 3600 * 24));
		if(TotalDays>15){
			return swal('Date range cannot be more then 15days!', "", "error");
		}

		getplayData();
	}

	var fixedPolylineOptions = {
		color: 'blue',
		weight: 2.5,
		opacity: 0.8
	};

	/**
	 * @return {string}
	 */
	let SecondsTohhmmss = function(totalSeconds) {
		totalSeconds = totalSeconds*3600;
		let hours   = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
		let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

		// round seconds
		seconds = Math.round(seconds * 100) / 100

		let result = (hours < 10 ? "0" + hours : hours) + " hours " ;
		result += (minutes < 10 ? "0" + minutes : minutes) + " minutes " ;
		//result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
		return result;
	};

	function getLineIconSvg() {
		let iColor = "blue";
		let svgCode  = utils.lineMarkerSvg(iColor);
		return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
	}

	let plotData = function (data) {

		if (map.hasLayer(lineLayer))
			map.removeLayer(lineLayer);

		if(map.hasLayer(startPointMarker))
			map.removeLayer(startPointMarker);

		if(map.hasLayer(endPointMarker))
			map.removeLayer(endPointMarker);

		if(stopMarkers && stopMarkers.length ) {
			for(const marker of stopMarkers) {
				map.removeLayer(marker);
			}
		}
		stopMarkers = [];

		lineLayer = new L.layerGroup();
		lineLayer.addTo(map);
		let polylinePoints = [];
		let startPoint = data[0].start;
		let endPoint = data[data.length-1].stop;
		let startPopup = '<div class="map-popup">'+
			'<p class="pp-hd">Start Info</p>'+
			'<p>Start Time: <span>'+data[0].start_time + '</span></p>'+
			'</div>';
		let endPopup = '<div class="map-popup">'+
			'<p class="pp-hd">End Info</p>'+
			'<p>End Time: <span>'+data[data.length-1].end_time + '</span></p>'+
			'</div>';

		startPointMarker = new L.marker([startPoint.latitude , startPoint.longitude], {icon: startIcon});
		startPointMarker.bindPopup(startPopup).openPopup().addTo(map);

		endPointMarker = new L.marker([endPoint.latitude , endPoint.longitude ], {icon: stopIcon});
		endPointMarker.bindPopup(endPopup).openPopup().addTo(map);

		let pointSkipper = 0;
		for (let point of data){
			if(point.drive){
				if(point.points) {
					for (let ping of point.points) {
						pointSkipper++;
						let pointX = new L.LatLng(ping.lat, ping.lng);
						polylinePoints.push(pointX);
						if (pointSkipper % 8 === 0) {
							let lineMarker = L.marker(pointX, {icon: lineIcon});
							lineMarker.setRotationAngle((ping.course || 90));
							lineLayer.addLayer(lineMarker);
						}
					}
				}
			}else {

				if(point.idle_duration && point.idle_duration>0){
					point.idle_duration = point.idle_duration/60;
					point.idle_duration = point.idle_duration.toFixed(2);
				}else{
					point.idle_duration = 0;
				}
				let pointmid = new L.LatLng(point.stop.latitude, point.stop.longitude);
				polylinePoints.push(pointmid);
				let stopPopup = '<div class="map-popup">'+
					'<p class="pp-hd">Stop Info</p>'+
					'<p>Strt Time: <span>'+point.start_time + '</span></p>'+
					'<p>End Time: <span>'+point.end_time + '</span></p>'+
					'<p>Residence : <span>'+SecondsTohhmmss(point.duration)+'</span></p>'+
					'<p>Address &nbsp;&nbsp;&nbsp; : <span>'+point.start_addr+'</span></p>'+
					'<p>Nearest Landmark : <span>'+point.NearLandMark+'</span></p>'+
					'<p>Lat Lng :<span>'+point.stop.latitude+', '+point.stop.longitude+'</span></p>'+
					'<p>Idle Duration :<span>'+point.idle_duration +' Minutes</span></p>'+
					'</div>';
				point.marker = L.marker([point.stop.latitude, point.stop.longitude],
					{icon: flagIcon}).bindPopup(stopPopup)
					.openPopup();
					//.on('click',onMarkerClick);
				stopMarkers.push(point.marker);
				point.marker.addTo(map);
			}
			let playBackLine = new L.Polyline(polylinePoints, fixedPolylineOptions);
			lineLayer.addLayer(playBackLine);
			map.fitBounds(playBackLine.getBounds());
		}
	}

	function onMarkerClick(e) {
		console.log(e);
	}
	 function plotFlagData (data) {
		if(map.hasLayer(flagLayer)) {
			map.removeLayer(flagLayer);
		}
		flagLayer = new L.layerGroup();
		flagLayer.addTo(map);
		data.forEach((point)=>{
			let pointLatLng = new L.LatLng(point.geozone[0].latitude, point.geozone[0].longitude);
			// preprocess
			if(!point.tat_km) {
				point.tat_km = 'NA';
			} else if(!point.tat_min) {
				point.tat_min = 'NA';
			} else if(!point.halt_d) {
				point.halt_d = 'NA';
			}
			let flagPopup = '<div class="map-popup">'+
				'<p> Name: <span>'+ point.name +'</span></p>'+
				'<p> LATITUDE: <span>'+ point.geozone[0].latitude +'</span></p>'+
				'<p> LONGITUDE: <span>'+ point.geozone[0].longitude +'</span></p>'+
				'<p> TAT(HR): <span>'+ point.tat_hr +'</span></p>'+
				'<p> TAT(MIN): <span>'+ point.tat_min +'</span></p>'+
				'<p> TAT(KM): <span>'+ point.tat_km +'</span></p>'+
				'<p> HALT: <span>'+ point.halt_d +'</span></p>'+
				'</div>';
			let Flag;
			if(point.type === 'city') {
				Flag = greenFlagIcon;
			} else if(point.type === 'toll') {
				Flag = yellowFlagIcon;
			} else if(point.type === 'parking') {
				Flag = greyFlagIcon;
			}
			let flagMarker = L.marker(pointLatLng, {icon: Flag}).bindPopup(flagPopup).on('click',onMarkerClick);
			flagLayer.addLayer(flagMarker);
			flagLayer.addTo(map);
		});
	};
}

function reportsCtrl(
	$rootScope,
	DateUtils,
	$state,
	$scope,
	gpsReportService,
	gpsSocketService,
	Vehicle,
	DatePicker,
	$filter,
	$timeout
) {
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.aReportTypes = [
		{
			scope: "report_parking",
			name: 'Halt Report'
		},{
			scope: "report_overspeed",
			name: 'Overspeed Report'
		},{
			scope: "report_activity",
			name: 'Activity Report'
		},
		/*{
			scope: "report_activity_interval",
			name: 'Detailed Activity Report'
		},*/
		{
			scope: 'report_mileage2',
			name: "Kilometer Report"
		}
	]
	$scope.segmentData =[];
	$scope.applyFilter = applyFilter;
	$scope.deleteKey = deleteKey;

	//init
	(function init() {
		getAllRegVehicles();
		$scope.deviceNum = {device_imei : '!true'};
		if($scope.$configs && $scope.$configs.tracking && $scope.$configs.tracking.aReportTypes)
			$scope.aReportTypes  = $scope.$configs.tracking.aReportTypes;
	})();

	function getAllRegVehicles(){

		//var oFilter = prepareFilterObject($scope.oFilter);
		let filter = {
			all:'true',
			device_imei:{
				$exists:true,
				$ne:null
			},
			project:{
				device_imei: 1,
				vehicle_reg_no: 1,
				status: 1,
				segment_type: 1
			}
		};

		if($rootScope.$user && $rootScope.$user.vehicle_allowed && $rootScope.$user.vehicle_allowed.length){
			filter.vehicle_reg_no = $rootScope.$user.vehicle_allowed;
		}


		Vehicle.getAllVehicles(filter, onSuccess, onFailure);


		function onFailure(response) {
			console.log(response);
		}

		function onSuccess(response){
			$scope.segmentData = response.data.map( (o,i) => {
				o.index = i;
				o.selected = false;
				return o;
			});
		}
	}

	function deleteKey() {
		delete $scope.deviceNum['segment_type'];
	}

	function applyFilter() {
		$scope.myFilter = {};
		if($scope.segment_type)
			$scope.myFilter = $scope.segment_type;


		$scope.vehicleSegment = $filter ('filter') ($scope.segmentData, $scope.myFilter);
		$scope.segmentData = $scope.vehicleSegment;
		$timeout(function () {
			$scope.$apply();
		});

		return false;
	}

	//*************** custome Date time Picker for multiple date selection in single form ************
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMinMaxDate = function(type) {
		$scope.dateOptions1.maxDate = ($scope.dateTimeEnd || new Date());
		if(!($scope.reportType === 'report_mileage' || $scope.reportType === 'report_mileage2')) {
			if($scope.dateTimeEnd) {
				var someDate1 = angular.copy($scope.dateTimeEnd);
				var numberOfDaysToSub = 6;
				someDate1.setDate(someDate1.getDate() - numberOfDaysToSub);
				$scope.dateOptions1.minDate = someDate1;
			}
		}

		$scope.dateOptions2.minDate = ($scope.dateTimeStart || new Date());
		if(!($scope.reportType === 'report_mileage' || $scope.reportType === 'report_mileage2')) {
			var someDate = angular.copy($scope.dateTimeStart || new Date());
			var numberOfDaysToAdd = 6;
			someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
			$scope.dateOptions2.maxDate = someDate;
		}
	};
	//$scope.toggleMin();

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions1 = {
		//dateDisabled: disabled,
		//minMode: 'month',
		formatYear: 'yy',
		maxDate: ($scope.dateTimeEnd || new Date()),
		//minDate: $scope.minDate ? null : new Date(),
		startingDay: 1
	};
	$scope.dateOptions2 = {
		//dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(),
		minDate: ($scope.dateTimeStart || new Date()),
		startingDay: 1
	}

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	$scope.formateDate = function(date){
		return new Date(date).toDateString();
	};
	//********************//**********************//*****************//
	$scope.aHours = [];
	for(var h = 0;h<24;h++){
		$scope.aHours[h] = h;
	}
	$scope.aMinutes = [];
	for(var m = 0;m<60;m++){
		$scope.aMinutes[m] = m;
	}
	//************* custome Date time Picker for multiple date selection in single form ******************

	$scope.hourSel1 = 0;
	$scope.hourSel2 = 23;
	$scope.minuteSel1 = 0;
	$scope.minuteSel2 = 59;

	$scope.wrongDateRange = false;
	var dateTimeStart;
	var dateTimeEnd;
	$scope.getNoti = function(){
		if($scope.dateTimeStart && $scope.dateTimeEnd){
			if($scope.dateTimeEnd>$scope.dateTimeStart){
				$scope.wrongDateRange = false;
				dateTimeStart= $scope.dateTimeStart;
				dateTimeEnd = $scope.dateTimeEnd;
			}else{
				var hr1 = $scope.hourSel1*60;
				var hrMin1 = hr1 + $scope.minuteSel1;

				var hr2 = $scope.hourSel2*60;
				var hrMin2 = hr2 + $scope.minuteSel2;
				if(hrMin1 >= hrMin2){
					$scope.wrongDateRange = true;
				}else{
					$scope.wrongDateRange = false;
				}
			}
		}
	}

	$scope.aMinMinutes = [];
	for(var m=0;m<=59;m++){
		$scope.aMinMinutes[m] = {};
		$scope.aMinMinutes[m].name = '> '+m+' min';
		$scope.aMinMinutes[m].scope = m;
	}

	$scope.aMinHours = [];
	for(var h=0;h<25;h++){
		$scope.aMinHours[h] = {};
		$scope.aMinHours[h].name = h+' hour';
		$scope.aMinHours[h].scope = h;
	}

	$scope.minHours = 0;
	$scope.minMinutes = 15;

	$scope.actMinHours = 0;
	$scope.actMinMinutes = 30;

	$scope.changeInMinutes = function(){
		if($scope.minHours < 1 && $scope.minMinutes < 15){
			swal("Please select greater then 15 min.", "", "error");
			$scope.minMinutes = 15;
		}
		if($scope.minHours === 24){
			$scope.minMinutes = 0;
		}
	}
	$scope.changeHour = function(){
		if($scope.minHours === 24 && $scope.minMinutes > 1){
			//swal("Please select greater then 15 min.", "", "error");
			$scope.minMinutes = 0;
		}
	}

	$scope.aTimeFilter = ['Last Hour', 'Today', 'Yesterday', 'Last 2 days', 'Last 3 days', 'Last Week', 'Last Month'];

	$scope.filterMe = function(timeFilter,month){
		if(timeFilter === 'Last Hour'){
			var currentTime = moment()._d;
			var lastHourTime = moment(currentTime).subtract(1,'hours')._d;
			$scope.dateTimeEnd = currentTime;
			$scope.dateTimeStart = lastHourTime;
		}
		else if(timeFilter === 'Today'){
			var fromTime = moment();
			var toTime = moment(fromTime);
			fromTime.hour(0);
			fromTime.minute(0);
			fromTime.second(0);
			fromTime.millisecond(0);
			toTime.hour(23);
			toTime.minute(59);
			toTime.second(59);
			$scope.dateTimeEnd = toTime._d;
			$scope.dateTimeStart = fromTime._d;
		}
		else if(timeFilter === 'Yesterday'){
			var yesterday = moment().subtract(1,'day');
			var fromTime = yesterday;
			var toTime = moment(yesterday);
			fromTime.hour(0);
			fromTime.minute(0);
			fromTime.second(0);
			fromTime.millisecond(0);
			toTime.hour(23);
			toTime.minute(59);
			toTime.second(59);
			$scope.dateTimeEnd = toTime._d;
			$scope.dateTimeStart = fromTime._d;
		}
		else if(timeFilter === 'Last 2 days'){
			var currentDate = moment().subtract(1,'day');
			var last2Day = currentDate.clone().subtract(1,'day');
			last2Day.hour(0);
			last2Day.minute(0);
			last2Day.second(0);
			last2Day.millisecond(0);
			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = last2Day._d;
		}
		else if(timeFilter === 'Last 3 days'){
			var currentDate = moment().subtract(1,'day');
			var last3day = currentDate.clone().subtract(2,'day');
			last3day.hour(0);
			last3day.minute(0);
			last3day.second(0);
			last3day.millisecond(0);
			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = last3day._d;
		}
		else if(timeFilter === 'Last Week'){
			var currentDate = moment().subtract(1,'day');
			var lastweek = currentDate.clone().subtract(6,'day');
			lastweek.hour(0);
			lastweek.minute(0);
			lastweek.second(0);
			lastweek.millisecond(0);
			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = lastweek._d;
		}
		else if(timeFilter === 'Last Month'){
			var currentDate = moment();
			var lastMonth = currentDate.clone().subtract(1,'month');
			lastMonth.hour(0);
			lastMonth.minute(0);
			lastMonth.second(0);
			lastMonth.millisecond(0);
			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = lastMonth._d;
		}else if (timeFilter === 'Month Wise') {
			if(month){
				var today = new Date(month);
				var startDate = moment([today.getFullYear(), today.getMonth()]);
				var endDate = moment(startDate.clone()).endOf('month');

				$scope.dateTimeStart = startDate._d;
				$scope.dateTimeEnd = endDate._d;
			}else{
				$scope.dateTimeEnd = null;
				$scope.dateTimeStart = null;
			}
		}
	}

	if($scope.segmentData && $scope.segmentData.length>=0){
		for (var i = 0; i < $scope.segmentData.length; i++) {
			$scope.segmentData[i].selected = false;
		}
	}
	$scope.lst = [];

	$scope.checkAll =  function(){$timeout(checkAll);}

	function checkAll () {
		$scope.lst = [];
		if ($scope.selectedAll) {
			$scope.selectedAll = true;
		} else {
			$scope.selectedAll = false;
		}
		angular.forEach($scope.jaFilterArrsegmentData, function (deviceR) {
			 if(deviceR.device_imei){
				deviceR.selected = $scope.selectedAll;
				if(deviceR.selected === true){
					$scope.lst.push(deviceR);
				}else{
					$scope.lst.splice($scope.lst.indexOf(deviceR), 1);
				}
			}else{

			}
		});
	}

	$scope.change = function(deviceR, index){
		if(deviceR.selected){
			$scope.segmentData[deviceR.index].selected = deviceR.selected = !($scope.segmentData[deviceR.index].selected);
			$scope.lst.push(deviceR);
		}else{
			$scope.lst = $scope.lst.filter(obj => obj.device_imei !== deviceR.device_imei );
			$scope.segmentData[deviceR.index].selected = deviceR.selected = false;
		}

		// console.log(deviceR);
	};
	$scope.removeDeviceArr = function(sList, index){
		$scope.lst.splice(index, 1);
		$scope.segmentData[sList.index].selected = sList.selected = false;
		//$scope.change(sList, false);
	}

	$scope.changeRadio = function(deviceR, selTruck){
		if(selTruck || (deviceR && deviceR.vehicle_reg_no)){
			deviceR.selected = true;
			$scope.lstRadio = deviceR;
			$scope.lst[0] = deviceR;
		}
	};

	$scope.changeTrip = function(tripD){
		if(tripD) {
			$scope.tripData = tripD;
			if(!$scope.tripData.start_time) {
				var new_start_date = moment().subtract(1, 'day');
				$scope.hourSel1 = new_start_date.hour();
				$scope.minuteSel1 = new_start_date.minute();
			}
			if(!$scope.tripData.end_time) {
				var new_end_date = moment(new Date());
				$scope.hourSel2 = new_end_date.hour();
				$scope.minuteSel2 = new_end_date.minute();
			}

			$scope.dateTimeStart = $scope.tripData.start_time || new_start_date._d;
			$scope.dateTimeStart = new Date($scope.dateTimeStart);
			var sDT = $scope.dateTimeStart;
			$scope.hourSel1 = sDT.getHours();
			$scope.minuteSel1 = sDT.getMinutes();
			$scope.dateTimeEnd = $scope.tripData.end_time || new_end_date._d;
			$scope.dateTimeEnd = new Date($scope.dateTimeEnd);
			var eDT = $scope.dateTimeEnd;
			$scope.hourSel2 = eDT.getHours();
			$scope.minuteSel2 = eDT.getMinutes();
		}


	};

	$scope.getMin = function () {
		if ($scope.speedLim) {
			if ($scope.speedLim>49) {
				$scope.minSpeedWrong = true;
				return $scope.speedLim;
			} else {
				/*swal("Select min speed 50km/h");*/
				$scope.minSpeedWrong = false;
				$scope.minS = "Select min speed 50km/h";
			}
		}
	}
	$scope.durationLim = 30;
	$scope.getMinDuration = function () {
		if ($scope.durationLim) {
			if ($scope.durationLim>=10) {
				$scope.minDurationWrong = true;
				return $scope.durationLim;
			} else {
				/*swal("Select min speed 50km/h");*/
				$scope.minDurationWrong = false;
				$scope.minD = "Select min time 10 minute.";
			}
		}
	}

	function dwnldResponse(oRes){
		// $rootScope.loader = false;
		var a = document.createElement('a');
		a.href = oRes.data || oRes.url;
		a.download = oRes.data || oRes.url;
		a.target = '_blank';
		a.click();
	};

	$scope.generateR = function () {
		if($scope.dateTimeEnd && $scope.dateTimeStart){
			//**** custom time add with date ******//
			var xx = $scope.dateTimeStart;
			xx.setHours($scope.hourSel1);
			xx.setMinutes($scope.minuteSel1);
			xx.setMilliseconds(0);
			$scope.dateTimeStart = xx;
			var yy = $scope.dateTimeEnd;
			yy.setHours($scope.hourSel2);
			yy.setMinutes($scope.minuteSel2);
			$scope.dateTimeEnd = yy;

			//**** custom time add with date ******//

			if($scope.lst.length>0 || $scope.reportType === 'report_activity_interval'){
				var report = {};
				$rootScope.reportData = [];
				$rootScope.forGetDeviceList = [];
				$rootScope.forGetDeviceList = $scope.lst;
				$scope.aDevImei = [];
				if($scope.reportType != 'report_activity_interval'){
					for(var i=0;i<$scope.lst.length;i++){
						$scope.aDevImei[i] = parseInt($scope.lst[i].device_imei);
					}
					report.device_id = $scope.aDevImei;
				}

				if($scope.reportType === 'details_analysis'){
					var someDate = angular.copy($scope.dateTimeStart);
					var numberOfDaysToAdd = 1;
					someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
					if($scope.dateTimeEnd > someDate)
						return swal('warning', 'You can get only 24 hr data', 'warning');
				}

				report.reportType = $scope.reportType;
				report.start_time = $scope.dateTimeStart;
				report.end_time = $scope.dateTimeEnd;
				report.selected_uid = $scope.$clientConfigs.gpsId;
				report.login_uid = $scope.$clientConfigs.gpsId;
				report.lms_uid = $scope.$user.userId;
				report.download = true;

				if ($scope.reportType === 'exception_report' ||
					$scope.reportType === 'vehicle_exceptions' ) {
					let oFilter = {download: true};
					oFilter.imei = report.device_id;
					if($scope.rfid && $scope.rfid.rfid)
						oFilter.rfid = $scope.rfid.rfid;

					oFilter.from = report.start_time;
					oFilter.to = report.end_time;
					oFilter.login_uid = $scope.$clientConfigs.gpsId;
					oFilter.user_id = $scope.$clientConfigs.gpsId;

					if ($scope.reportType == 'exception_report') {
						oFilter.code = ['over_speed','sos','hb','ha','idle','fw','nd','cd','tl'];
						gpsReportService.alertReport(oFilter, dwnldResponse);
					}else if ($scope.reportType == 'vehicle_exceptions') {
						oFilter.imei = oFilter.imei.length ? oFilter.imei : undefined;
						gpsReportService.vehicleExceptionsRpt(oFilter, dwnldResponse);
					}
				} else {
					gpsReportService.downloadReport(report).then(dwnldResponse);
				}

				// gpsReportService
				// 	.downloadReport(report)
				// 	.then(dwnldResponse);

				// if($scope.reportType === 'report_parking'){
				// 	report.request = 'download_report_parking';
				// 	$scope.minTime = $scope.minMinutes+($scope.minHours*60);
				// 	report.minimum_time_in_mins = $scope.minTime;
				// }
				// if($scope.reportType === 'report_acc'){
				// 	//report.speed_limit = $scope.speedLim;
				// }
				// if($scope.reportType === 'report_activity_trip'){
				// 	//report.speed_limit = $scope.speedLim;
				// 	report.request = 'download_report_activity';
				// 	report.trip_no = $scope.trip_full.trip_no;
				// }
				// if($scope.reportType === 'report_activity_interval'){
				// 	report.request = 'download_report_activity_interval';
				// 	$scope.actMinTime = $scope.actMinMinutes+($scope.actMinHours*60);
				// 	report.time_interval = $scope.actMinTime;
				// 	report.device_id = $scope.lstRadio.device_imei;
				// }
				// if($scope.reportType === 'report_overspeed'){
				// 	if($scope.speedLim && $scope.speedLim>49){
				// 		report.request = 'download_report_overspeed';
				// 		report.speed_limit = $scope.speedLim;
				// 		gpsReportService.downloadReport(report,dwnldResponse);
				// 		$rootScope.loader = true;
				// 		$timeout(function() {
				// 			$rootScope.loader = false;
				// 		}, 100000);
				// 	}else{
				// 		swal("Select min speed 50km/h");
				// 	}
                //
				// }else{
				// 	;
				// 	$rootScope.loader = true;
				// 	$timeout(function() {
				// 		$rootScope.loader = false;
				// 	}, 100000);
				// }
			}else{
				swal("Please select vehicle ");
			}

		}else{
			swal("Please select date 'from' and 'to' ");
		}
	};
	//PLAYBACK HOME PAGE FUNCTION
	$scope.homePage = function () {
		$rootScope.redirect('/#!/main/user');
	};

};

function parkingReportCtrl(
	$scope,
	$state,
	$filter,
	$http,
	$modal,
	$localStorage,
	$rootScope,
	$timeout,
	$window,
	$uibModal,
	Driver,
	DatePicker,
	FleetService,
	lazyLoadFactory,
	objToCsv,
	otherUtils,
	parseTableDataFilter,
	Routes,
	socketio,
	utils,
	Vehicle,
	tripServices,
	HTTPConnection,
	URL
){

	// object Identifiers
	let vm = this,
		map,
		toolTipMap;

	var timer;

	vm.oLiveData = {};
	vm.oFilter = {
		dateBy: 'expected_eta'
	};
	if($scope.$user.segment_type.length)
		vm.oFilter.segment_type = $scope.$user.segment_type;

	vm.DatePicker = angular.copy(DatePicker);
	vm.selectType = 'index';
	vm.aSelectedVehicle = [];

	//vm.lazyLoad = lazyLoadFactory(); // init lazyload
	$rootScope.maps = {};
	$rootScope.plottedMarkers = [];

	vm.orderBy = {};
	vm.selectedoVehicle = {};

	// functions Identifiers
	vm.applyFilter = applyFilter;
	vm.downloadCsv = downloadCsv;
	vm.downloadExcel = downloadExcel;
	vm.getAllFleet = getAllFleet;
	vm.showDetailVehicleView = showDetailVehicleView;
	vm.getColor = getColor;
	vm.getDriver = getDriver;
	vm.getRoute = getRoute;
	vm.zoomIn = zoomIn;
	vm.zoomOut = zoomOut;
	vm.onSelect = onSelect;
	vm.prepareFilter = prepareFilter;
	vm.cities = cities;
	vm.getLivetrackVehicleData = getLivetrackVehicleData;
	vm.clearLocation = clearLocation;
	vm.addMoreLocation = addMoreLocation;
	vm.placeMarker = placeMarker;
	vm.focusOnMap = focusOnMap;
	vm.triggerDelay = triggerDelay;
	vm.remarkUpdate = remarkUpdate;
	vm.vehicleDetailView = vehicleDetailView;
	vm.detailView = detailView;
	vm.selectThisRow = selectThisRow;

	// INIT functions
	(function init() {
		vm.running = 0;
		vm.stopped = 0;
		vm.inactive = 0;
		vm.offline = 0;
		vm.tableView = false;
		vm.aVehicleStatus = [
			'Running',
			'Stopped',
			'Offline'
		];
		vm.tableHead = [
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle.vehicle_reg_no',
				'date': false
			},
			{
				'header': 'Vehicle Size',
				'bindingKeys': 'vehicle.veh_group_name'
			},
			{
				'header': 'Vehicle Type',
				'bindingKeys': 'vehicle.veh_type_name'
			},
			{
				'header': 'Segment',
				'bindingKeys': 'vehicle.segment_type'
			},
			{
				'header': 'Capacity',
				'bindingKeys': 'vehicle.capacity_tonne'
			},
			{
				'header': 'Status',
				'bindingKeys': 'vehicle.status'
			},
			{
				'header': 'Customer',
				'bindingKeys': 'vehicle.gr.customer.name'
			},
			{
				'header': 'From',
				"bindingKeys": "vehicle.trip.route_name.split(' to ')[0] || vehicle.trip.rName.split(' to ')[0]",
			},
			{
				'header': 'To',
				"bindingKeys": "vehicle.trip.route_name.split(' to ')[1] || vehicle.trip.rName.split(' to ')[1]",
			},
			{
				'header': 'Location',
				'bindingKeys': 'vehicle.status === "In Trip" ? (vehicle.gr.statuses | filter:{"status": "Vehicle Arrived for unloading"})[0].location2 : vehicle.mTrack.address'
			},
			{
				'header': 'GPS Location',
				'bindingKeys': 'vehicle.gpsData.address'
			},
			{
				'header': 'Loading Date',
				'bindingKeys': 'vehicle.gr.grDate || vehicle.mTrack.loadingdate'
			},
			{
				'header': 'Reporting Date',
				'bindingKeys': 'vehicle.status === "In Trip" ? (vehicle.gr.statuses | filter:{"status":  "Vehicle Arrived for unloading"})[0].date : vehicle.mTrack.reportingdate'
			},
			{
				'header': 'Remark',
				'bindingKeys': 'vehicle.status === "In Trip" ? (vehicle.gr.statuses | filter:{"status": "Vehicle Arrived for unloading"})[0].status : vehicle.mTrack.remarks'
			},
			{
				'header': 'Entry By',
				'bindingKeys': 'vehicle.status === "In Trip" ? (vehicle.gr.statuses | filter:{"status": "Vehicle Arrived for unloading"})[0].user_full_name : vehicle.mTrack.created_by'
			},
			{
				'header': 'Entry Date',
				'bindingKeys': 'vehicle.status === "In Trip" ? (vehicle.gr.statuses | filter:{"status": "Vehicle Arrived for unloading"})[0].systemDate : vehicle.mTrack.created_at'
			}
		];
		vm.columnSetting  = {
			allowedColumn: [
				'Vehicle No',
				'Vehicle Size',
				'Vehicle Type',
				'Segment',
				'Capacity',
				'Status',
				'Customer',
				'From',
				'To',
				'Location',
				'GPS Location',
				'Loading Date',
				'Reporting Date',
				'Remark',
				'Entry By',
				'Entry Date'
			]
		};
		vm.aDateBy = [
			{
				name: 'Expected ETA',
				value: 'expected_eta'
			},
			{
				name: 'Loading Date',
				value: 'vehicle.gr.loading_ended_status.date'
			}
		];
		vm.aGrStatus = ["Vehicle Arrived for loading", "Vehicle Arrived for unloading"];
		$scope.showMap = true;

		$scope.$on('stateRefresh', function () {
			getLivetrackVehicleData(true);
		});

		vm.pageNumber = 1;

		$timeout(function () {
			mapInit();
			tableMapInit();
		});

		getLivetrackVehicleData();
		getAllFleet();
	})();

	// Actual Functions

	function downloadCsv(aData) {
		let cnt = 1;
		let aCopyData = aData;
		aCopyData = aData.filter((item) => {
			let date
			if(item.vehicle.gr && item.vehicle.gr.statuses && item.vehicle.gr.statuses.length){
				let status =  item.vehicle.gr.statuses.find(o => o.status === "Vehicle Arrived for unloading")
				date = status && status.systemDate;
			}else if(item.vehicle.mTrack && item.vehicle.mTrack.reportingdate){
				date = item.vehicle.mTrack.reportingdate;
			}
			if(date)
			return ( new Date(date).getTime() >= vm.oFilter.fromDate.getTime()) &&
				     (new Date(date).getTime() <= vm.oFilter.toDate.getTime());
		});
		aData = aCopyData;
		objToCsv('TrackSheet', [
			'S.No',
			'Vehicle No',
			'Vehicle Size',
			'Vehicle Type',
			'Segment',
			'Capacity',
			'Status',
			'Customer',
			'From',
			'To',
			'Location',
			'GPS Location',
			'Loading Date',
			'Reporting Date',
			'Remark',
			'Entry By',
			'Entry Date'
		], aData.map( o => {
			let arr = [];

			try{
				arr.push(cnt++ || 0 );

			}catch(e){
				arr.push(0);
			}

			try{
				arr.push(o.vehicle.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.veh_group_name || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.veh_type_name || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.segment_type || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.capacity_tonne );
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status || 'NA');
			}catch(e){
				arr.push("0");
			}

			try{
				arr.push(o.vehicle.gr.customer ? o.vehicle.gr.customer.name : (o.vehicle.gr.booking.customer.name || "NA"))
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.trip && o.vehicle.trip.route_name && o.vehicle.trip.route_name.split(' to ')[0] || o.vehicle.trip && o.vehicle.trip.rName && o.vehicle.trip.rName.split(' to ')[0])
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.trip && o.vehicle.trip.route_name && o.vehicle.trip.route_name.split(' to ')[1] || o.vehicle.trip && o.vehicle.trip.rName && o.vehicle.trip.rName.split(' to ')[1])
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status === "In Trip" ? (o.vehicle.gr && o.vehicle.gr.statuses && o.vehicle.gr.statuses.find(o => o.status === "Vehicle Arrived for unloading").location2 || (o.vehicle.mTrack && o.vehicle.mTrack.address)) : (o.vehicle.mTrack && o.vehicle.mTrack.address) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push((o.vehicle.gpsData.address && o.vehicle.gpsData.address.replace(/,/g,' ')) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(($filter('date')(o.vehicle.gr && o.vehicle.gr.grDate && o.vehicle.gr.grDate, 'dd-MMM-yyyy')) || o.vehicle.mTrack && o.vehicle.mTrack.loadingdate || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status === "In Trip" ? (o.vehicle.gr && o.vehicle.gr.statuses && o.vehicle.gr.statuses.find(o => o.status === "Vehicle Arrived for unloading").date || (o.vehicle.mTrack && o.vehicle.mTrack.reportingdate)) : (o.vehicle.mTrack && o.vehicle.mTrack.reportingdate) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status === "In Trip" ? (o.vehicle.gr && o.vehicle.gr.statuses && o.vehicle.gr.statuses.find(o => o.status === ("Vehicle Arrived for unloading")).status || (o.vehicle.mTrack && o.vehicle.mTrack.remarks)) : (o.vehicle.mTrack && o.vehicle.mTrack.remarks) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status === "In Trip" ? (o.vehicle.gr && o.vehicle.gr.statuses && o.vehicle.gr.statuses.find(o => o.status === "Vehicle Arrived for unloading").user_full_name || (o.vehicle.mTrack && o.vehicle.mTrack.created_by)) : (o.vehicle.mTrack && o.vehicle.mTrack.created_by) || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status === "In Trip" ? (o.vehicle.gr && o.vehicle.gr.statuses && o.vehicle.gr.statuses.find(o => o.status === "Vehicle Arrived for unloading").systemDate || ($filter('date')(o.vehicle.mTrack.created_at, 'dd-MMM-yyyy'))) : ($filter('date')(o.vehicle.mTrack.created_at, 'dd-MMM-yyyy')) || 'NA');
			}catch(e){
				arr.push("NA");
			}
			return arr;
		}));


	}

	function downloadExcel() {
		let request = {
			all: true,
			download: true
		};
		Vehicle.vehicleWise(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.data.message, 'error');
		}

		function successCallback(response) {
			const $a = $window.document.createElement('a');
			$a.href = response.url;
			$a.click();
		}
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({ all: true }, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function triggerDelay() {
		if(timer){
			$timeout.cancel(timer);
			timer = null;
		}
		timer = $timeout(function(){
			applyFilter();
		},300);
	}

	function cities(query) {
		if (query && query.toString ().length > 2) {
			let oUrl = {type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"};
			let q = {
				location: map.getCenter ().lat + "," + map.getCenter ().lng,
				zoom: map.getZoom (),
				query: query
			};
			let locationUrl = oUrl.url + otherUtils.prepareQeury (q);
			return $http ({
				method: "get",
				url: locationUrl
			}).then (function (response) {
				if (oUrl.type === "mapMyIndiaGeoCode") {
					aLocations = mapMyIndiaResponse (response.data);
					return aLocations;
				} else {
					$scope.aLocations = response.data.suggestedLocations.map(o => ({
						...o,
						formatted_address: o.placeName + (o.placeAddress ? `(${o.placeAddress})` : '')
					}));
					return $scope.aLocations;
				}
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	}

	function mapMyIndiaResponse(responseData) {
		let result = [];
		if(responseData && responseData.results && responseData.results.length>0){
			for(let i=0; i<responseData.results.length;i++){
				responseData.results[i].display_name = responseData.results[i].formatted_address;
				if(responseData.results[i].lat){
					responseData.results[i].lat = parseFloat(responseData.results[i].lat);
				}
				if(responseData.results[i].latitude){
					responseData.results[i].lat = parseFloat(responseData.results[i].latitude);
				}
				if(responseData.results[i].lng){
					responseData.results[i].lng = parseFloat(responseData.results[i].lng);
				}
				if(responseData.results[i].longitude){
					responseData.results[i].lng = parseFloat(responseData.results[i].longitude);
				}
				if(!responseData.results[i].formatted_address){
					responseData.results[i].formatted_address = "";
					responseData.results[i].formatted_address += responseData.results[i].houseName?responseData.results[i].houseName+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].houseNumber?responseData.results[i].houseNumber+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].subDistrict?responseData.results[i].subDistrict+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].district?responseData.results[i].district+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].city?responseData.results[i].city+", ":"";
					responseData.results[i].formatted_address += responseData.results[i].state?responseData.results[i].state:"";
				}
				result.push(responseData.results[i])
			}
		}
		return result;
	}

	let locationCircle;
	function clearLocation () {
		if (locationCircle && map.hasLayer (locationCircle)) {
			map.removeLayer (locationCircle)
		}
	}
	function setLocationCircle (lat,lng,radius) {
		if(lat && lng && radius) {
			clearLocation();
			locationCircle = L.circle ([lat, lng],parseInt(radius*1000))
				.bindTooltip (`(${lat},${lng})` , {permanent: false, direction: 'top'})
				.openTooltip ()
				.addTo (map);
			map.fitBounds(locationCircle.getBounds());
		}
	}

	function searchVehicleInRadius (lat,lng,radius) {
		setLocationCircle(lat,lng,radius);
		vm.aCopyTrSheetDevice = vm.aCopyTrSheetDevice.filter(obj => {
			return utils.getDistanceInKm(lat,lng,obj.lat,obj.lng) < radius;
		});
	}

	function selectThisRow(oVehicle,index) {
		$scope.selectedoVehicle = oVehicle;
        $('.selectItem').removeClass('grn');
		var row = $($('.selectItem')[index]);
		row.addClass('grn');
	}
	// add more locations
	function addMoreLocation() {
		if (vm.aSelectedVehicle && vm.aSelectedVehicle.vehicle.vehicle_reg_no) {
			$rootScope.aSelectedTrip = vm.aSelectedVehicle.trip;
			$rootScope.aSelectedVehicle = vm.aSelectedVehicle.vehicle;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/myRegisteredVehicle/addMoreLocation.html',
				controller: 'addMoreLocationCtrl',
				resolve: {
					'oLiveData': function () {
						return {};
					}
				}
			});
			modalInstance.result.then(function(res) {
				updateLocation(res)
			}, function(res) {
				updateLocation(res)
			});
		} else {
			swal("Warning", "Please go back and select vehicle for add more live track.", "warning");
		}
	}

	function updateLocation(res){
		if(res && res.data && res.data.data)
		vm.aSelectedVehicle.vehicle.mTrack = res.data.data;
		vm.tableApi && vm.tableApi.refresh();
	}

	function remarkUpdate(vehicle,type) {
		vm.vehicle = vehicle;
		vm.vehicle.type = type;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/gps/tracking/remarkPopup.html',
			controller: 'remarkUpdateCtrl',
			controllerAs: 'vm',
			resolve: {
				thatTrip: function () {
					return vm.vehicle;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			vm.vehicle = data.data.data;
		}, function (data) {

		});
	};

	function vehicleDetailView(vehicle) {
			$modal.open({
				templateUrl: 'views/gps/tracking/tripDetails.html',
				controller: ['$scope', '$uibModalInstance', 'otherData', 'lazyLoadFactory', 'tripServices', tripDetailsPopUpController],
				controllerAs: 'thVm',
				resolve: {
					otherData: function(){
						return {
							vehicle
						};
					}
				}
			}).result.then(function(response) {
				console.log('close',response);
			}, function(data) {
				console.log('cancel',data);
			});
		}

	function detailView(vehicle) {
		let request = {
			_id: vehicle._id
		};

		Vehicle.getVehiclesWithPagination(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
			// reject(err.data.message);
		}

		function onSuccess(res) {
			console.log(res);
			// swal('Success',res.data.message, 'success');
			callModal(res.data[0]);
		}

		function callModal(oVehicle) {
			$modal.open({
				templateUrl: 'views/myRegisteredVehicle/detailViewPopup.html',
				controller: ['$scope', '$uibModalInstance', 'modelDetail', 'otherData', 'Vehicle', vehicleDetailPopupController],
				controllerAs: 'detailVm',
				resolve: {
					modelDetail: function() {
						return {
							hideEditButton: true,
							hideKey: {
								device_imei: true,
							}
						};
					},
					otherData: function(){
						return {
							oVehicle
						};
					}
				}
			}).result.then(function(response) {
				console.log('close',response);
			}, function(data) {
				console.log('cancel',data);
			});
		}
	}

	function getColor(status) {
		switch(status){
			case 'running': return 'ja-green';
			case 'stopped': return 'ja-red';
			default : return 'ja-grey';
		}
	}

	function getDriver(str) {
		if(str.length <=2)
			return;
		Driver.getAllDrivers({
			name: str
		}, success);

		function success(data) {
			vm.aDriver = data.data;
		}
	}

	function getLivetrackVehicleData(toRefresh) {
		let initCb = function () {
			removeAllMarkerOnMap();
		};
		let cb = function (obj,resData) {
			vm.aTrSheetDevice = obj.aTrSheetDevice;
			plotMarkerOnMap(resData || obj.aTrSheetDevice);
			applyFilter();
		};
		Vehicle.vehicleWiseAll(cb, initCb, toRefresh)
	}

	function getRoute(str) {
		if(str.length <=2)
			return;
		Routes.getAllRoutes({
			name: str
		}, success);

		function success(data) {
			vm.aRoute = data.data.data;
		}
	}

	function mapInit() {
		$rootScope.maps = utils.initializeMapView('mapViewTracking', {
			zoomControl: false,
			hybrid: true,
			zoom: 4,
			search: true,
			location: false,
			center: new L.LatLng(21, 90)
		}, true);
		map = $rootScope.maps.map;
		map.on('dblclick', function(ev) {
			if(ev.originalEvent instanceof MouseEvent) {
				vm.location = {formatted_address: "Custom", lat: ev.latlng.lat, lng: ev.latlng.lng};
				applyFilter ();
			}
		});
	}

	function zoomIn() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom<17)
				$rootScope.maps.map.setZoom(++curZoom);
		}
	}

	function zoomOut() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom>2)
				$rootScope.maps.map.setZoom(--curZoom);
		}
	}

	function applyFilter() {

		//initialize

		vm.tripStatusCount = {
			running: 0,
			stopped: 0,
			offline: 0,
		};

		vm.timeStatusCount = {
			'Delayed' : 0,
			'Early' : 0,
			'On Time' : 0,
		};

		vm.availabilityStatusCount = {['In Trip']: 0,
			"In Trip": 0,
			"Maintenance": 0,
			"Available": 0,
			"Booked": 0,
			"Empty": 0,
			"Accident": 0,
			other: 0
		};

		prepareFilter ();
		// vm.aCopyTrSheetDevice = $filter('orderBy')(vm.aCopyTrSheetDevice, Object.values(vm.orderBy)[0] ===1 ? Object.keys(vm.orderBy)[0] : '-'+Object.keys(vm.orderBy)[0] , false);
		vm.aCopyTrSheetDevice = $filter ('filter') (vm.aTrSheetDevice, vm.myFilter);
		vm.aCopyTrSheetDevice = vm.aCopyTrSheetDevice.filter(obj => {

			let delayBool = false,
				etaBool = false,
				segBool = false,
				fleetBool = false;

			if(vm.oFilter.segment_type && vm.oFilter.segment_type.length)
				segBool = !!vm.oFilter.segment_type.find(s => s === obj.vehicle.segment_type );
			else
				segBool = true;

			if(vm.oFilter.owner_group && vm.oFilter.owner_group.length)
				fleetBool = !!vm.oFilter.owner_group.find(s => s === obj.vehicle.owner_group );
			else
				fleetBool = true;

			if(vm.oFilter.delay){
				if(vm.oFilter.delay === 'Delayed')
					delayBool = obj.trip_delay > 3;
				else if(vm.oFilter.delay === 'Early')
					delayBool = obj.trip_delay < -3;
				else if(vm.oFilter.delay === 'On Time')
					delayBool = obj.trip_delay > -3 && obj.trip_delay < 3 && obj.vehicle.trip;
			}else
				delayBool = true;

			if(vm.oFilter.commomDate){
				let min = vm.oFilter.commomDate.setHours(0,0,0),
					max = vm.oFilter.commomDate.setHours(23,59,59),
					expected_eta;

				$scope.jaTemp = obj;
				expected_eta = parseTableDataFilter(obj, 'jaTemp.'+vm.oFilter.dateBy, $scope);

				if(expected_eta){
					expected_eta = new Date(expected_eta).getTime();
					if(expected_eta > min && expected_eta < max)
						etaBool = true;
				}
			}else
				etaBool = true;

			if(delayBool && etaBool && segBool && fleetBool){

				switch (obj.vehicle.status){
					case "In Trip" : vm.availabilityStatusCount["In Trip"]++; break;
					case "Maintenance" : vm.availabilityStatusCount["Maintenance"]++; break;
					case "Available" : vm.availabilityStatusCount["Available"]++; break;
					case "Booked" : vm.availabilityStatusCount["Booked"]++; break;
					case "Empty Trip" : vm.availabilityStatusCount["Empty"]++; break;
					case "Accident" : vm.availabilityStatusCount["Accident"]++; break;
					default: vm.availabilityStatusCount.other++;
				}

				switch(obj.vehicle.gpsData && obj.vehicle.gpsData.status){
					case "running": vm.tripStatusCount.running++; break;
					case "stopped": vm.tripStatusCount.stopped++; break;
					case "offline": vm.tripStatusCount.offline++; break;
					default: vm.tripStatusCount.stopped++;
				}
				switch(obj.status){
					case 'Delayed':  vm.timeStatusCount['Delayed']++; break;
					case 'Early': vm.timeStatusCount['Early']++; break;
					case 'On Time': vm.timeStatusCount['On Time']++; break;
				}

				return true;
			}else
				return false;
		});
		delete $scope.jaTemp;
		if(vm.location && vm.location.lat && vm.location.lng && vm.radius) {
			searchVehicleInRadius(vm.location.lat, vm.location.lng, vm.radius);
		}
		vm.aCopyTrSheetDevice = $filter ('orderBy') (vm.aCopyTrSheetDevice, 'vehicle.gpsData.s_status', false);
		$timeout(function () {
			$scope.$apply();
		});
		return false;
	}

	function onSelect($item, $model, $label){
		if($item.eLoc){
		//TODO check MMI APIs
			let oUrl = {type: "mapMyIndiaELoc", url: "http://trucku.in:8081/api/mapmyindia/place_detail?place_id="};
			let locationUrl = oUrl.url + $item.eLoc;
			return $http ({
				method: "post",
				url: locationUrl
			}).then (function (response) {
				aLocations = mapMyIndiaResponse (response.data);
				vm.location = aLocations[0] || {};
				applyFilter();
			});
		}else {
			applyFilter();
		}
	}

	function prepareFilter() {
		vm.myFilter = {};

		if(vm.oFilter.vehicle_reg_no){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.vehicle_reg_no = vm.oFilter.vehicle_reg_no;
		}
		if(vm.oFilter.veh_group_name) {
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.veh_group_name = vm.oFilter.veh_group_name;
		}
		if(vm.oFilter.veh_type_name) {
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.veh_type_name = vm.oFilter.veh_type_name;
		}
		if(vm.oFilter.status){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gpsData = vm.myFilter.vehicle.gpsData || {};
			if(vm.oFilter.status === "running" ||
				vm.oFilter.status === "stopped" ||
				vm.oFilter.status === "offline")
				vm.myFilter.vehicle.gpsData.status = vm.oFilter.status.toLowerCase();
			else if(vm.oFilter.status === "OnTrip")
				vm.myFilter.vehicle.trip = '!';
		}

		if(vm.oFilter.trip_no){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.trip = vm.myFilter.vehicle.trip || {};
			vm.myFilter.vehicle.trip.trip_no = vm.oFilter.trip_no;
		}

		if(vm.oFilter.vehicleStatus){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.status = vm.oFilter.vehicleStatus;
		}

		if(vm.oFilter.grNumber){
			vm.myFilter.aGr = vm.myFilter.aGr || {};
			vm.myFilter.aGr.grNumber = vm.oFilter.grNumber;
		}

		if(vm.oFilter.grStatus){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gr = vm.myFilter.vehicle.gr || {};
			vm.myFilter.vehicle.gr.status = vm.oFilter.grStatus;
		}

		if(vm.oFilter.route){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.route = vm.myFilter.vehicle.route || {};
			vm.myFilter.vehicle.route._id = vm.oFilter.route._id;
		}

		if(vm.oFilter.driver){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.trip = vm.myFilter.vehicle.trip || {};
			vm.myFilter.vehicle.trip.driver = vm.oFilter.driver._id;
		}

		if(vm.oFilter.imei){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.device_imei = vm.oFilter.imei;
		}

		if(vm.oFilter.jaTemp){
			vm.myFilter['$'] = vm.oFilter.jaTemp;
		}

		if(vm.oFilter.customer){
			vm.myFilter.vehicle = vm.myFilter.vehicle || {};
			vm.myFilter.vehicle.gr = vm.myFilter.vehicle.gr || {};
			vm.myFilter.vehicle.gr.customer = vm.myFilter.vehicle.gr.customer || {};
			vm.myFilter.vehicle.gr.customer.name = vm.oFilter.customer;
		}
	}

	function showDetailVehicleView(vehicleObj, index){

		$scope.showMap = false;
		$scope.selectedIndex = index;
		$scope.isShow = true;
		$state.go('gps.tracking.vehicleDetailView', {data: vehicleObj,isShow:$scope.showpopup});
		return;
	}

	let vehiclePopup;
	function focusOnMap(vehicle) {
		let curentZoom = $scope.maps.map.getZoom();
		$scope.maps.map.setView([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng], 9);
		$scope.showMap=true;
		$scope.selectedIndex = null;
		try {
			vehiclePopup = new L.popup({closeOnClick:false})
				.setContent(vehicle.vehicle.vehicle_reg_no)
				.setLatLng([vehicle.vehicle.gpsData.lat, vehicle.vehicle.gpsData.lng])
				.openOn($scope.maps.map);
		}catch (e){}
	}

	///////////////////////////////////////////////////
	function plotMarkerOnMap(data) {
		if(data && data.length>0) {
			for (var i = 0; i < data.length; i++) {
				if(!data[i].vehicle.gpsData)
					continue;

				if (data[i].vehicle.gpsData.lat && data[i].vehicle.gpsData.lng) {
					if ($rootScope.maps.map) {
						utils.addOnCluster($rootScope.maps, utils.createMarker(data[i].vehicle.gpsData), data[i].vehicle.gpsData)
					}
				}
			}
		}else {
			$rootScope.maps.clusterL.Cluster._clusters = [];
		}
		if($rootScope.maps && $rootScope.maps.clusterL) {
		}
	};

	function removeAllMarkerOnMap () {
		if($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.map) {
			$rootScope.maps.map.removeLayer ($rootScope.maps.clusterL);
			$rootScope.maps.clusterL = utils.initializeCluster(map);
		}
	}

	function tableMapInit() {
		toolTipMap = utils.initializeMapView ('toolTipDiv', {
			zoomControl: true,
			hybrid: false,
			zoom: 13,
			search: false,
			location: false
		});
	}

	vm.downloadLiveTripReport = function(group) {
	  if(group) {
	    var filter = {__SRC__:'WEB',all: true, download:1,group_by:group};
	    HTTPConnection.post(URL.LIVE_TRACKER_VEHICLE, filter, (res) => {
        var $a = document.createElement('a');
        $a.setAttribute("type", "hidden");
        $a.setAttribute('id',`tripHistoryReport_${Math.random()}`);
        $a.setAttribute('href',res.data.url);
        $a.setAttribute('download',res.data.url);
        $a.setAttribute('target','_blank');
        document.body.appendChild($a);
        $a.click();
        $a.remove();
      }, (err) => {
        console.log(err);
      });
    }
  };

	function placeMarker(oVehicle) {
		if(!oVehicle.lng || !oVehicle.lat) return;
		if(toolTipMap.marker && toolTipMap.map.hasLayer(toolTipMap.marker)){
			toolTipMap.map.removeLayer(toolTipMap.marker);
		}
		toolTipMap.marker = L.marker([oVehicle.lat, oVehicle.lng])
			.bindTooltip(oVehicle.vehicle.vehicle_reg_no,{permanent:false,direction:'top'})
			.openTooltip()
			.addTo(toolTipMap.map);
		toolTipMap.map.setView(new L.LatLng(oVehicle.lat, oVehicle.lng), 8);
	}

	let zoomDeviceInMap = function (device) {
		if (device.status !== 'inactive') {
			$rootScope.maps.map.setView(new L.LatLng(device.lat, device.lng), 13);
		} else {
			swal('This Device is Inactive.');
		}
	}
}

function tripHistoryReportCtrl(
	$filter,
	$scope,
	$timeout,
	DatePicker,
	consignorConsigneeService,
	Driver,
	objToCsv,
	HTTPConnection,
	URL,
	customer
) {

	$scope.graphView = false;
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.filter = {
		startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
		endDate: new Date(),
	};
	$scope.aGraphTrip = [
		{
			_id: 'Early',
			count: 0,
			total: 0,
		},{
			_id: 'Delayed',
			count: 0,
			total: 0,
		},{
			_id: 'On Time',
			count: 0,
			total: 0,
		},
	];
	// $scope.showTable = true;

	$scope.oGraph = {
		name: 'Report Graph',
		graphType: [{
			type: "pieChart",
			xAxisKey: function (e) {
				return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
			},
			yAxisKey: function (e) {
				return e.count;
			},
			customeTooltip: function (e) {
				var series = e.series[0];
				if (series.value === null) return;

				var header =
					"<thead>" +
					"<tr>" +
					"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
					"<td class='key'><strong>" + e.data._id + "</strong></td>" +
					"<td class='key'><strong>" + ((e.data.count/e.data.total)*100).toFixed(2) + "%</strong></td>" +
					"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
					"</thead>";

				return "<table>" +
					header +
					"</table>";
			}
		}],
		fullscreen: false
	};

	$scope.dateChange = function (dateType){

		if(dateType === 'start_Date' && $scope.filter.endDate && $scope.filter.startDate){

			let isDate = $scope.filter.endDate instanceof Date,
				monthRange = $scope.filter.endDate.getMonth() - $scope.filter.startDate.getMonth(),
				dateRange = $scope.filter.endDate.getDate() - $scope.filter.startDate.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - $scope.filter.startDate.getDate() + $scope.filter.endDate.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date($scope.filter.startDate);
				$scope.filter.endDate = new Date(date.setMonth(date.getMonth() + 1));
			}

		}else if(dateType === 'end_Date' && $scope.filter.endDate && $scope.filter.startDate) {

			let isDate = $scope.filter.startDate instanceof Date,
				monthRange = $scope.filter.endDate.getMonth() - $scope.filter.startDate.getMonth(),
				dateRange = $scope.filter.endDate.getDate() - $scope.filter.startDate.getDate(),
				isNotValid = false;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true : (30 - $scope.filter.startDate.getDate() + $scope.filter.endDate.getDate() > 30 ? true : false);
			else
				isNotValid = true;

			if(isDate && isNotValid){
				let date = new Date($scope.filter.endDate);
				$scope.filter.startDate = new Date(date.setMonth(date.getMonth() - 1));
			}
		}
	}

	function prepareParameters(oFilter) {
		var sParam = "";
		for (var property in oFilter) {
			sParam = sParam + "&" + property + "=" + oFilter[property];
		}
		return sParam;
	}

	$scope.search = function (isDownload) {
		if(isDownload && !$scope.filter.group_by) {
			return;
		}
		var filter = angular.copy($scope.filter);
		if(filter.driver) {
			filter.driver = filter.driver._id;
		}
		if(filter.customer) {
			filter.customer = filter.customer._id;
		}

		filter.all = 'true';
		if(isDownload) {
			filter.download = 1;
		}
		HTTPConnection.get(URL.LIVE_TRACKER_TRIP_HISTORY + '?' + prepareParameters(filter), (res) => {
			if(isDownload) {
				var $a = document.createElement('a');
				$a.setAttribute("type", "hidden");
				$a.setAttribute('id',`tripHistoryReport_${Math.random()}`);
				$a.setAttribute('href',res.data.url);
				$a.setAttribute('download',res.data.url);
				$a.setAttribute('target','_blank');
				document.body.appendChild($a);
				$a.click();
				$a.remove();
			} else {
				$scope.aTrips = res.data.data;
				$scope.aTrips.forEach( o => {
					let status = o.trip.v_status || o.status;
					if(status === 'Early'){
						$scope.aGraphTrip[0].count++;
					}else if(status === 'Delayed'){
						$scope.aGraphTrip[1].count++;
					}else if(status === 'On Time'){
						$scope.aGraphTrip[2].count++;
					}
					$scope.aGraphTrip[0].total = $scope.aGraphTrip[1].total = ++$scope.aGraphTrip[2].total;
				});
			}
		}, (err) => {
			console.log('error')
		});
	};

	$scope.downloadCsv = function (aData) {
		if(!(aData || []).length)
			return;
		objToCsv('Historical Trip Report', [
			'Trip No.',
			'Vehicle No.',
			'Vehicle Status',
			'Consignor',
			'Customer',
			'Segment',
			'Route',
			'KM. covered',
			'KM. left',
			'Loading Date',
			'Unloading Date',
			'Status',
			'Acc. ETA',
			'Vehicle Arrival - Loading',
			'Vehicle Arrival - Unloading',
			'Trip Start D&T',
			'Trip End D&T',
			'Remark',
		], aData.map( o => {
			let arr = [];

			try{
				arr.push(o.trip_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.vehicle_reg_no || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.status || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.gr.consignor.name || o.gr.consignor.name.replace(/,/g,' ') || o.gr.booking.consigner || o.gr.booking.consigner.name.replace(/,/g,' ') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.gr.customer.name || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.vehicle.segment_type || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.route.name + ( o.route.route_distance ? ' (' + o.route.route_distance + ')' : ''));
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.distance_travelled || '0');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.route.route_distance - o.distance_travelled || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.gr.loading_ended_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')((o.gr.unloading_ended_status.date), 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.trip && o.trip.v_status);
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')((o.expected_eta), 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.gr.vehicle_arrived_for_loading_status && o.gr.vehicle_arrived_for_loading_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.gr.vehicle_arrived_for_unloading_status && o.gr.vehicle_arrived_for_unloading_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.trip_start_status && o.trip_start_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push($filter('date')(o.trip_end_status && o.trip_end_status.date, 'dd-MMM-yyyy \'at\' h:mma') || 'NA');
			}catch(e){
				arr.push("NA");
			}

			try{
				arr.push(o.rmk || 'NA');
			}catch(e){
				arr.push("NA");
			}

			return arr;
		}));
	};

	$scope.getCustomer = viewValue => {
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

	(() => {
		consignorConsigneeService.getConsignorConsignee({type: 'Consignor', all: 'true'}, res => {
			$scope.aConsigner = res.data;
		}, () => {});
	})();

	(() => {
		consignorConsigneeService.getConsignorConsignee({type: 'Consignee', all: 'true'}, res => {
			$scope.aConsignee = res.data;
		}, () => {});
	})();

	//$scope.showHideTable = function () {
		// 	$scope.showTable = false;
		// 	$timeout(function () {
		// 		$scope.showTable = true;
		// 	});
		// };

	$scope.getDriver = viewValue => {
		if (viewValue && viewValue.toString().length > 1) {
			Driver.getName(viewValue, res => { $scope.aDriver = res.data.data }, err => console.log`${err}`);
		}
	};
}


function gpsDashboardDataFactory () {

	return function () {
		return [{
			name: 'Vehicle',
			graphType: [{
				type: "pieChart",
				xAxisKey: function (e) {
					return e.key;
				},
				yAxisKey: function (e) {
					return e.value;
				}
			}],
			formatResponse: function(response){
				return response.data;
			},
			fullscreen: false
		}]
	};
}

function playbackCtrl(
$rootScope, $scope, $localStorage, DateUtils, $stateParams, $interval, $state, gpsSocketService, $timeout, Vehicle, stateDataRetain,DatePicker
) {
	$scope.DatePicker = angular.copy(DatePicker);
	$rootScope.showSideBar = false;
	$rootScope.states = {};
	$rootScope.states.actItm = 'playback';
	//init
	(function init() {
		getAllRegVehicles();
		$scope.deviceNum = {device_imei : '!true'};
	})();

	function getAllRegVehicles() {

		Vehicle.getAllVehicles({
			all: 'true',
			device_imei: {
				$exists: true,
				$ne: null
			},
			project: {
				device_imei: 1,
				vehicle_reg_no: 1,
				status: 1,
				segment_type: 1
			}
		}, onSuccess, onFailure);

		function onFailure(response) {
			console.log(response);
		}

		function onSuccess(response) {
			$scope.__vehicleData = response.data;

		}
	}

	//*************** custome Date time Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.toggleMinMaxDate = function (type) {
		$scope.dateOptions1.maxDate = ($scope.dateTimeEnd || new Date());
		$scope.dateOptions2.minDate = ($scope.dateTimeStart || new Date());
	};

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions1 = {
		formatYear: 'yy',
		maxDate: ($scope.dateTimeEnd || new Date()),
		startingDay: 1
	};
	$scope.dateOptions2 = {
		formatYear: 'yy',
		maxDate: new Date(),
		minDate: ($scope.dateTimeStart || new Date()),
		startingDay: 1
	}
	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	$scope.formateDate = function (date) {
		return new Date(date).toDateString();
	};
	//********************//end//**********************//*****************//
	$scope.aHours = [];
	for (var h = 0; h < 24; h++) {
		$scope.aHours[h] = h;
	}
	$scope.aMinutes = [];
	for (var m = 0; m < 60; m++) {
		$scope.aMinutes[m] = m;
	}
	//************* custome Date time Picker for multiple date selection in single form ******************
	$scope.wrongDateRange = false;
	var dateTimeStart;
	var dateTimeEnd;
	$scope.getNoti = function () {
		if ($scope.dateTimeStart && $scope.dateTimeEnd) {
			if ($scope.dateTimeEnd > $scope.dateTimeStart) {
				$scope.wrongDateRange = false;
				dateTimeStart = $scope.dateTimeStart;
				dateTimeEnd = $scope.dateTimeEnd;
			} else {
				var hr1 = $scope.hourSel1 * 60;
				var hrMin1 = hr1 + $scope.minuteSel1;

				var hr2 = $scope.hourSel2 * 60;
				var hrMin2 = hr2 + $scope.minuteSel2;
				if (hrMin1 >= hrMin2) {
					$scope.wrongDateRange = true;
				} else {
					$scope.wrongDateRange = false;
				}
			}
		}
	}
	$scope.hourSel1 = 0;
	$scope.hourSel2 = 23;
	$scope.minuteSel1 = 0;
	$scope.minuteSel2 = 59;


	$scope.aTimeFilter = ['Last Hour', 'Today', 'Yesterday', 'Last 2 days', 'Last 3 days', 'Last Week', 'Last Month'];

	$scope.filterMe = function (timeFilter) {
		if (timeFilter == 'Last Hour') {
			var currentTime = moment()._d;
			var lastHourTime = moment(currentTime).subtract(1, 'hours')._d;
			$scope.dateTimeEnd = currentTime;
			$scope.dateTimeStart = lastHourTime;
		}
		else if (timeFilter == 'Today') {
			var fromTime = moment();
			var toTime = moment(fromTime);
			fromTime.hour(00);
			fromTime.minute(00);
			fromTime.second(00);
			fromTime.millisecond(00);

			toTime.hour(23);
			toTime.minute(59);
			toTime.second(59);
			$scope.dateTimeEnd = toTime._d;
			$scope.dateTimeStart = fromTime._d;
		}
		else if (timeFilter == 'Yesterday') {
			var yesterday = moment().subtract(1, 'day');
			var fromTime = yesterday;
			var toTime = moment(yesterday);
			fromTime.hour(00);
			fromTime.minute(00);
			fromTime.second(00);
			fromTime.millisecond(00);

			toTime.hour(23);
			toTime.minute(59);
			toTime.second(59);
			$scope.dateTimeEnd = toTime._d;
			$scope.dateTimeStart = fromTime._d;
		}
		else if (timeFilter == 'Last 2 days') {
			var currentDate = moment().subtract(1, 'day');
			var last2Day = currentDate.clone().subtract(1, 'day');
			last2Day.hour(00);
			last2Day.minute(00);
			last2Day.second(00);
			last2Day.millisecond(00);

			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = last2Day._d;
		}
		else if (timeFilter == 'Last 3 days') {
			var currentDate = moment().subtract(1, 'day');
			var last3day = currentDate.clone().subtract(2, 'day');
			last3day.hour(00);
			last3day.minute(00);
			last3day.second(00);
			last3day.millisecond(00);

			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = last3day._d;
		}
		else if (timeFilter == 'Last Week') {
			var currentDate = moment().subtract(1, 'day');
			var lastweek = currentDate.clone().subtract(6, 'day');
			lastweek.hour(00);
			lastweek.minute(00);
			lastweek.second(00);
			lastweek.millisecond(00);

			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = lastweek._d;
		}
		else if (timeFilter == 'Last Month') {
			var currentDate = moment();
			var lastMonth = currentDate.clone().subtract(1, 'month');
			lastMonth.hour(00);
			lastMonth.minute(00);
			lastMonth.second(00);
			lastMonth.millisecond(00);

			currentDate.hour(23);
			currentDate.minute(59);
			currentDate.second(59);
			$scope.dateTimeEnd = currentDate._d;
			$scope.dateTimeStart = lastMonth._d;
		}
	}

	if ($rootScope.aTrSheetDevice && $rootScope.aTrSheetDevice.length > 0) {
		for (var i = 0; i < $rootScope.aTrSheetDevice.length; i++) {
			$rootScope.aTrSheetDevice[i].selected = false;
		}
	}
	$scope.toEnableBtn = false;
	$scope.setDefault = function (deviceR) {
		angular.forEach($rootScope.aTrSheetDevice, function (p) {
			p.selected = false; //set them all to false
		});
		deviceR.selected = true; //set the clicked one to true
		$scope.toEnableBtn = true;
	};

	function playBackResponse(response) {

		var oRes = response;
		$rootScope.loader = false;

		if (oRes) {
			if (oRes.status === 'OK') {
				for (var i = 0; i < (oRes.data && oRes.data.length); i++) {
					oRes.data[i].start_time_cal = oRes.data[i].start_time;
					oRes.data[i].end_time_cal = oRes.data[i].end_time;
					oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
					oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
					if (oRes.data[i].duration) {
						oRes.data[i].duration = oRes.data[i].duration / 3600;
						oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
						oRes.data[i].duration = parseFloat(oRes.data[i].duration);
					}
					if (oRes.data[i].distance) {
						oRes.data[i].distance = oRes.data[i].distance / 1000;
						oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
					}
				}
				if (oRes.tot_dist) {
					oRes.tot_dist = oRes.tot_dist / 1000;
					oRes.tot_dist = oRes.tot_dist.toFixed(2);
				}
				$rootScope.playData = oRes;
				$state.go('gps.playPosition', {
					data: {
						oRes
					}
				});

			}
			else if (oRes.status === 'ERROR') {
				//swal(oRes.message, "", "error");
			}
		}
	}

	$scope.playB = function () {

		$rootScope.playData = {};
		for (var i = 0; i < $scope.__vehicleData.length; i++) {
			if ($scope.__vehicleData[i].selected === true) {
				$scope.selTruck = $scope.__vehicleData[i];
			}
		}

		if ($scope.dateTimeEnd && $scope.dateTimeStart) {
			//**** custom time add with date ******//
			var xx = $scope.dateTimeStart;
			xx.setHours($scope.hourSel1);
			xx.setMinutes($scope.minuteSel1);
			xx.setMilliseconds(0);
			$scope.dateTimeStart = xx;
			var yy = $scope.dateTimeEnd;
			yy.setHours($scope.hourSel2);
			yy.setMinutes($scope.minuteSel2);
			$scope.dateTimeEnd = yy;

			//**** custom time add with date ******//
			if ($scope.selTruck) {
				$rootScope.reportData = [];

				var playBack = {};
				playBack.request = 'playback';
				playBack.version = 2;
				playBack.device_id = $scope.selTruck.device_imei;
				playBack.start_time = $scope.dateTimeStart;
				playBack.end_time = $scope.dateTimeEnd;

				$rootScope.selectedDevicekGlobalData = $scope.selTruck;
				gpsSocketService.getplayData(playBack, playBackResponse);

				$rootScope.loader = true;
				$timeout(function () {
					$rootScope.loader = false;
				}, 50000);
			} else {
				swal("Please select vehicle ");
			}
		} else {
			swal("Please select date 'from' and 'to' ");
		}
	};

	//PLAYBACK HOME PAGE FUNCTION
	$scope.homePage = function () {
		$rootScope.redirect('/#!/main/user');
	};
};

function playPositionCtrl(
	$rootScope, $scope, DateUtils, $uibModal, $stateParams, utils, $localStorage, $interval, gpsSocketService, $timeout, stateDataRetain, objToCsv
){
	(function init() {
	})();
	$scope.playData = $rootScope.playData;
	$rootScope.againInitialiseCtrl = function () {
		$rootScope.showSideBar = false;
		$rootScope.states = {};
		$rootScope.states.actItm = 'playback';
		if (!$rootScope.selectedUser) {
			$rootScope.selectedUser = $localStorage.user;
		}
		var map;

		//*************** custome Date time Picker for multiple date selection in single form ************
		$scope.today = function () {
			$scope.dt = new Date();
		};
		$scope.today();

		$scope.toggleMinMaxDate = function (type) {
			$scope.dateOptions1.maxDate = ($scope.end_date_cal || new Date());
			$scope.dateOptions2.minDate = ($scope.start_date_cal || new Date());
		};
		//$scope.toggleMin();

		$scope.open = function ($event, opened) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope[opened] = true;
		};

		$scope.dateOptions1 = {
			//dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: ($scope.end_date_cal || new Date()),
			//minDate: $scope.minDate ? null : new Date(),
			startingDay: 1
		};
		$scope.dateOptions2 = {
			//dateDisabled: disabled,
			formatYear: 'yy',
			maxDate: new Date(),
			minDate: ($scope.start_date_cal || new Date()),
			startingDay: 1
		};

		$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.format = DateUtils.format;
		$scope.formateDate = function (date) {
			return new Date(date).toDateString();
		};
		//********************/end/**********************//*****************//

		$scope.aHours = [];
		for (var h = 0; h < 24; h++) {
			$scope.aHours[h] = h;
		}
		$scope.aMinutes = [];
		for (var m = 0; m < 60; m++) {
			$scope.aMinutes[m] = m;
		}
		//************* custome Date time Picker for multiple date selection in single form ******************

		$scope.wrongDateRange = false;
		var dateTimeStart;
		var dateTimeEnd;
		$scope.getNoti = function () {
			if ($scope.dateTimeStart && $scope.dateTimeEnd) {
				if ($scope.dateTimeEnd > $scope.dateTimeStart) {
					$scope.wrongDateRange = false;
					dateTimeStart = $scope.dateTimeStart;
					dateTimeEnd = $scope.dateTimeEnd;
				} else {
					$scope.wrongDateRange = true;
				}
			}
		};
		$scope.hourSel1 = 0;
		$scope.hourSel2 = 0;
		$scope.minuteSel1 = 0;
		$scope.minuteSel2 = 0;

		/**
		 * Convert seconds to hh-mm-ss format.
		 * @param {number} totalSeconds - the total seconds to convert to hh- mm-ss
		 **/
		var SecondsTohhmmss = function (totalSeconds) {
			totalSeconds = totalSeconds * 3600;
			var hours = Math.floor(totalSeconds / 3600);
			var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
			var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

			// round seconds
			seconds = Math.round(seconds * 100) / 100

			var result = (hours < 10 ? "0" + hours : hours) + " hours ";
			result += (minutes < 10 ? "0" + minutes : minutes) + " minutes ";
			//result += (seconds  < 10 ? "0" + seconds : seconds) + " seconds " ;
			return result;
		};

		$scope.slider = {
			value: 40,
			options: {
				floor: 10,
				ceil: 100,
				step: 10,
				showSelectionBar: true,
				getSelectionBarColor: function (value) {
					if (value <= 30)
						return '#2AE02A';
					if (value <= 50)
						return 'yellow';
					if (value <= 70)
						return 'orange';
					return 'red';
				}
			}
		};
		//**********secnds into hours minutes seconds end **********//

		if ($localStorage.onLocalselectedUser && $localStorage.onLocalselectedUser.devices) {
			for (var j = 0; j < $localStorage.onLocalselectedUser.devices.length; j++) {
				if ($localStorage.onLocalselectedUser.devices[j].imei === $rootScope.playData.device_id) {
					$rootScope.playData.reg_no = $localStorage.onLocalselectedUser.devices[j].reg_no;
				}
			}
		} else {
			for (var j = 0; j < $localStorage.user && $localStorage.user.devices && $localStorage.user.devices.length; j++) {
				if ($localStorage.user.devices[j].imei === $rootScope.playData.device_id) {
					$rootScope.playData.reg_no = $localStorage.user.devices[j].reg_no;
				}
			}
		}
		$scope.aPlayPosiData = $rootScope.playData && $rootScope.playData.data;
		var p = $scope.aPlayPosiData && $scope.aPlayPosiData.length - 1;
		$scope.firstLocation = $scope.aPlayPosiData && $scope.aPlayPosiData[0]; //first location data
		$scope.lastLocation = $scope.aPlayPosiData && $scope.aPlayPosiData[p]; //last location data


		//*********************//
		var id = document.getElementById("playMap");

		if (id && id.children.length > 0) {
			if ($rootScope.countPlay === 2) {
				var ccc = "<div id='" + $rootScope.countPlay + "' style='width: 100%; height: 100%;'></div>";
				document.getElementById('playMap').innerHTML = ccc;
			} else {
				var minusCount = $rootScope.countPlay - 1;
				document.getElementById(minusCount.toString()).innerHTML = "<div id='" + $rootScope.countPlay + "' style='width: 100%; height: 100%;'></div>";
			}
			var map = utils.initializeMapView($rootScope.countPlay.toString(), false, false).map;
		} else {
			map = utils.initializeMapView('playMap', false, false).map;
			$rootScope.countPlay = 1;
		}

		function getSVG() {
			var iColor = "#15e425";
			var svgCode = utils.takeIcon($rootScope.selectedDevicekGlobalData && $rootScope.selectedDevicekGlobalData.icon, iColor);
			return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
		}

		function getLineIconSvg(color) {
			var iColor = color || "blue";
			var svgCode = utils.lineMarkerSvg(iColor);
			return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svgCode);
		}

		var LeafIcon = L.Icon.extend({
			options: {
				iconSize: [36, 45],
				iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
				popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
			}
		});


		var lineIconOptions = L.Icon.extend({
			options: {
				iconSize: [15, 15],
				iconAnchor: [7.5, 7.5]
			}
		});

		var runIconLeaf = L.Icon.extend({
			options: {
				iconSize: [50, 50],
				iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
				popupAnchor: [0, -51] // point from which the popup should open relative to the iconAnchor
			}
		});

		var startIcon = new LeafIcon({iconUrl: 'img/start.png'}),
			stopIcon = new LeafIcon({iconUrl: 'img/stop.png'}),
			lineIcon = new lineIconOptions({iconUrl: getLineIconSvg()}),
			runIcon = new runIconLeaf({iconUrl: getSVG()}),
			flagIcon = new LeafIcon({iconUrl: 'img/stopFlag.png'}),
			h = $scope.aPlayPosiData && $scope.aPlayPosiData.length - 1;


		//map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
		var polylinePoints = [];
		$scope.newDriveAllPoints = [];
		var arrLatLng = [];

		var pointA = new L.LatLng($scope.aPlayPosiData && $scope.aPlayPosiData[0] && $scope.aPlayPosiData[0].start && $scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData && $scope.aPlayPosiData[0] && $scope.aPlayPosiData[0].start && $scope.aPlayPosiData[0].start.longitude);
		polylinePoints.push(pointA);
		arrLatLng.push([$scope.aPlayPosiData[0].start.latitude, $scope.aPlayPosiData[0].start.longitude]);
		$scope.newDriveAllPoints.push($scope.aPlayPosiData[0]);
		for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
			if ($scope.aPlayPosiData[i].drive === false) {
				var pointmid = new L.LatLng($scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude);
				polylinePoints.push(pointmid);
				arrLatLng.push([$scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData[i].stop.longitude]);
				$scope.newDriveAllPoints.push($scope.aPlayPosiData[i]);
				var stopPopup = '<div class="map-popup">' +
					'<p class="pp-hd">Stop Info</p>' +
					'<p>Strt Time: <span>' + $scope.aPlayPosiData[i].start_time + '</span></p>' +
					'<p>End Time: <span>' + $scope.aPlayPosiData[i].end_time + '</span></p>' +
					'<p>Residence : <span>' + SecondsTohhmmss($scope.aPlayPosiData[i].duration) + '</span></p>' +
					'<p>Address &nbsp;&nbsp;&nbsp; : <span>' + $scope.aPlayPosiData[i].start_addr + '</span></p>' +
					'<p>Nearest Landmark : <span>' + $scope.aPlayPosiData[i].NearLandMark + '</span></p>' +
					'</div>';
				var marker = L.marker([$scope.aPlayPosiData && $scope.aPlayPosiData[i] && $scope.aPlayPosiData[i].stop && $scope.aPlayPosiData[i].stop.latitude, $scope.aPlayPosiData && $scope.aPlayPosiData[i] && $scope.aPlayPosiData[i].stop &&  $scope.aPlayPosiData[i].stop.longitude], {icon: flagIcon}).bindPopup(stopPopup).openPopup().on('click', onMarkerClick);
				marker.addTo(map);

			}
			//else {
			if ($scope.aPlayPosiData[i].points && $scope.aPlayPosiData[i].points.length > 0) {
				for (var q = 0; q < $scope.aPlayPosiData[i].points.length; q++) {
					var pointX = new L.LatLng($scope.aPlayPosiData[i].points[q].lat, $scope.aPlayPosiData[i].points[q].lng);
					polylinePoints.push(pointX);
					arrLatLng.push([$scope.aPlayPosiData[i].points[q].lat, $scope.aPlayPosiData[i].points[q].lng]);
					$scope.newDriveAllPoints.push($scope.aPlayPosiData[i].points[q]);
				}
			}
			//}
		}
		var startPoint = $scope.aPlayPosiData[0],
			endPoint = $scope.aPlayPosiData[h],
			title = "start point";

		var startPopup = '<div class="map-popup">' +
			'<p class="pp-hd">Start Info</p>' +
			'<p>Start Time: <span>' + $scope.firstLocation.start_time + '</span></p>' +
			'</div>';
		var endPopup = '<div class="map-popup">' +
			'<p class="pp-hd">End Info</p>' +
			'<p>End Time: <span>' + $scope.lastLocation.end_time + '</span></p>' +
			'</div>';
		var arrowPopup = function (date) {
			return '<div class="map-popup">' +
				'<p>' + moment(date).format('LLL') + '</p>' +
				'</div>';
		}

		L.marker([startPoint.lat || (startPoint.start && startPoint.start.latitude), startPoint.lng || (startPoint.start && startPoint.start.longitude)], {icon: startIcon}).bindPopup(startPopup).openPopup().on('click', onMarkerClick).addTo(map);
		L.marker([endPoint.lat || (endPoint.stop &&endPoint.stop.latitude), endPoint.lng || (endPoint.stop && endPoint.stop.longitude)], {icon: stopIcon}).bindPopup(endPopup).openPopup().on('click', onMarkerClick).addTo(map);

		//Define an array of Latlng objects (points along the line)
		var polylineOptions = {
			color: 'blue',
			weight: 5,
			opacity: 0.4
		};
		var fixedPolylineOptions = {
			color: 'green',
			weight: 5,
			opacity: 0.6
		};
		var fixedPolylineLayer = new L.layerGroup().addTo(map);
		var fixedPolyline = new L.Polyline(polylinePoints, fixedPolylineOptions);
		fixedPolylineLayer.addLayer(fixedPolyline);

		var lineLayer = new L.layerGroup().addTo(map);
		var polyline = new L.Polyline([], polylineOptions);

		// add arrow marker to the map line
		var arrowMarkerList = [], arrowLineMarker;
		var skipThreshold = 5;
		var skip = 5;//parseInt($scope.newDriveAllPoints.length/5);
		for (var i = 0; i < $scope.newDriveAllPoints.length; i+=skip) {
			arrowLineMarker = L.marker([$scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude], {icon: new lineIconOptions({iconUrl: getLineIconSvg("green")})});
			arrowLineMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));
			fixedPolylineLayer.addLayer(arrowLineMarker);

		}

		//map.addLayer(fixedPolyline);
		lineLayer.addLayer(polyline);

		var runMarker = L.marker([$scope.newDriveAllPoints[0].lat || $scope.newDriveAllPoints[0].start.latitude, $scope.newDriveAllPoints[0].lng || $scope.newDriveAllPoints[0].start.longitude], {icon: runIcon}).addTo(map);
		runMarker.setRotationAngle(($scope.newDriveAllPoints[0].course || 90));

		// zoom the map to the polyline
		map.fitBounds(fixedPolyline.getBounds());

		//map.fitBounds(arrLatLng);

		function onMarkerClick(e) {
			console.log(this.options);
		}

		//************************//
		$scope.start_date_cal = $scope.aPlayPosiData[0].start_time_cal; //for inner calander
		$scope.end_date_cal = $scope.aPlayPosiData[h].end_time_cal; //for inner calander
		var sDT = new Date($scope.aPlayPosiData[0].start_time_cal);
		$scope.start_date_cal = sDT;
		$scope.hourSel1 = sDT.getHours();
		$scope.minuteSel1 = sDT.getMinutes();

		var eDT = new Date($scope.aPlayPosiData[h].end_time_cal);
		$scope.end_date_cal = eDT;
		$scope.hourSel2 = eDT.getHours();
		$scope.minuteSel2 = eDT.getMinutes();

		$scope.totalDistance = 0;

		for (var i = 0; i < $scope.aPlayPosiData.length; i++) {
			if ($scope.aPlayPosiData[i]) {
				$scope.totalDistance = $scope.totalDistance + parseFloat($scope.aPlayPosiData[i].distance);
			}
		}
		$scope.totalDistance = $scope.totalDistance.toFixed(2);
		//$scope.totalDistance = $scope.totalDistance/1000;
		$scope.playData.tot_dist = $scope.totalDistance;

		//********play marker ************/
		$scope.showStop = false;
		$scope.showPlay = true;
		$scope.watchSlider = false;
		var runningMarkers = [];
		var flightPath;
		var stop;
		var markerOk;
		$scope.play = function () {
			$scope.showPlay = false;
			$scope.showStop = true;
			$scope.watchSlider = true;
			if (angular.isDefined(stop)) return;
			$scope.$watch("slider.value", function () {
				if ($scope.watchSlider) {
					$interval.cancel(stop);
					if ($scope.slider.value === 10) {
						$scope.speedControll = 100 * 10;
					} else if ($scope.slider.value === 20) {
						$scope.speedControll = 200 * 4;
					} else if ($scope.slider.value === 30) {
						$scope.speedControll = 300 * 2;
					} else if ($scope.slider.value === 40) {
						$scope.speedControll = 400 * 1;
					} else if ($scope.slider.value === 50) {
						$scope.speedControll = 500 / 5;
					} else if ($scope.slider.value === 60) {
						$scope.speedControll = 600 / 10;
					} else if ($scope.slider.value === 70) {
						$scope.speedControll = 700 / 15;
					} else if ($scope.slider.value === 80) {
						$scope.speedControll = 800 / 20;
					} else if ($scope.slider.value === 90) {
						$scope.speedControll = 900 / 25;
					} else if ($scope.slider.value === 100) {
						$scope.speedControll = 1000 / 30;
					}
					stop = $interval(doSomething, $scope.speedControll);
				}
			});

			stop = $interval(doSomething, $scope.speedControll);

		};
		var i = 0;
		var ppline = [], linePoints;

		function doSomething() {
			if (i < $scope.newDriveAllPoints.length) {
				if (($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude) && ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude)) {
					$scope.newDriveAllPoints[i].average_speed = $scope.newDriveAllPoints[i].speed || $scope.newDriveAllPoints[i].top_speed;

					if (map.hasLayer(fixedPolylineLayer)) {
						fixedPolylineLayer.remove();
					}
					if ($scope.newDriveAllPoints[i].drive === false) {
						linePoints = {
							lat: ($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].stop.latitude),
							lng: ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].stop.longitude)
						};
					} else {
						linePoints = {
							lat: ($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude),
							lng: ($scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude)
						};
					}

					polyline.addLatLng(linePoints);

					$scope.speedChange = parseFloat(Math.round($scope.newDriveAllPoints[i].average_speed * 100) / 100).toFixed(2);
					if ($scope.newDriveAllPoints[i].cum_dist) {
						$scope.runningDistance = $scope.newDriveAllPoints[i].cum_dist / 1000;
						$scope.runningDistance = $scope.runningDistance.toFixed(2);
					}

					$scope.dateChange = moment($scope.newDriveAllPoints[i].datetime || $scope.newDriveAllPoints[i].start_time).format('LLL');

					var newLatLng = new L.LatLng($scope.newDriveAllPoints[i].lat || $scope.newDriveAllPoints[i].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude);
					runMarker.setLatLng(newLatLng);
					runMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));

					if(i%skip === 0) {
						var lineMarker = L.marker(newLatLng, {icon: lineIcon}).bindPopup(arrowPopup($scope.newDriveAllPoints[i].datetime));
						lineMarker.setRotationAngle(($scope.newDriveAllPoints[i].course || 90));
						lineLayer.addLayer(lineMarker);
					}

					runMarker.setZIndexOffset(9999);



					var getzoom = map.getZoom();
					if (getzoom <= 12) {
						map.setZoom(12);
					} else if (getzoom >= 13) {
						map.setZoom(15);
					}
					map.panTo(newLatLng);
				}
				i++;
			} else {
				$scope.stopFight();
			}
		}

		$scope.stopFight = function () {
			$scope.showStop = false;
			$scope.showPlay = true;
			$scope.watchSlider = false;
			if (angular.isDefined(stop)) {
				$interval.cancel(stop);
				stop = undefined;
			}
		};
		$scope.resetFight = function () {
			i = 0;
			var newLatLng = new L.LatLng($scope.newDriveAllPoints[0].lat || $scope.newDriveAllPoints[0].start.latitude, $scope.newDriveAllPoints[i].lng || $scope.newDriveAllPoints[i].start.longitude);
			runMarker.setLatLng(newLatLng);

			map.removeLayer(lineLayer);   // remove polylline for reset
			polyline = new L.Polyline([], polylineOptions);   // again add new polyline initialization
			lineLayer = new L.layerGroup([polyline]).addTo(map);

			$scope.stopFight();
		};
		$scope.$on('$destroy', function () {
			// Make sure that the interval is destroyed too
			$scope.stopFight();
		});

		//***********ROUTING line draw****************//
		$scope.clickOnce = true;
		$scope.line = function () {
			if (map.hasLayer(fixedPolylineLayer)) {
				fixedPolylineLayer.remove();
			} else {
				fixedPolylineLayer.addTo(map);
			}
		};
		/***********ROUTING line draw end****************/

			// GET LANDMARKS ARRAY
		var control = L.control.layers(null, null, {collapsed: true});

		control.addTo(map);

		//********play marker ************/

		//PLAYBACK HOME PAGE FUNCTION
		$scope.homePage = function () {
			$rootScope.redirect('/#!/main/user');
		};
		$scope.playBack = function () {
			$rootScope.redirect('/#!/main/playBack');
		};
	};
	$rootScope.againInitialiseCtrl();

	function playBackResponseIn(response) {
		var oRes = JSON.parse(response);
		if (oRes) {
			if (oRes.status === 'OK') {
				$rootScope.countPlay = $rootScope.countPlay + 1;
				for (var i = 0; i < (oRes.data && oRes.data.length); i++) {
					oRes.data[i].start_time = moment(oRes.data[i].start_time).format('LLL');
					oRes.data[i].end_time = moment(oRes.data[i].end_time).format('LLL');
					if (oRes.data[i].duration) {
						oRes.data[i].duration = oRes.data[i].duration / 3600;
						oRes.data[i].duration = oRes.data[i].duration.toFixed(2);
					}
					if (oRes.data[i].distance) {
						oRes.data[i].distance = oRes.data[i].distance / 1000;
						oRes.data[i].distance = oRes.data[i].distance.toFixed(2);
					}
				}
				$rootScope.playData = oRes;
				$rootScope.againInitialiseCtrl();
			}
			else if (oRes.status === 'ERROR') {
				//swal(oRes.message, "", "error");
			}
		}
	};

	$scope.inPlayBack = function () {
		var newObject = angular.copy($rootScope.playData);
		$scope.selTruck = newObject;
		$rootScope.playData = {};

		if ($scope.start_date_cal && $scope.end_date_cal) {
			//**** custom time add with date ******//
			$scope.start_date_cal = new Date($scope.start_date_cal);
			$scope.end_date_cal = new Date($scope.end_date_cal);
			var xx = $scope.start_date_cal;
			xx.setHours($scope.hourSel1);
			xx.setMinutes($scope.minuteSel1);
			$scope.start_date_cal = xx;
			var yy = $scope.end_date_cal;
			yy.setHours($scope.hourSel2);
			yy.setMinutes($scope.minuteSel2);
			$scope.end_date_cal = yy;

			//**** custom time add with date ******//
			if ($scope.selTruck) {
				$rootScope.reportData = [];

				var playBack = {};
				playBack.request = 'playback';
				playBack.version = 2;
				playBack.device_id = $scope.selTruck.device_id;
				playBack.start_time = $scope.start_date_cal;
				playBack.end_time = $scope.end_date_cal;

				gpsSocketService.getplayData(playBack, playBackResponseIn);

				$rootScope.loader = true;
				$timeout(function () {
					$rootScope.loader = false;
				}, 3000);
			} else {
				swal("Please select vehicle ");
			}
		} else {
			swal("Please select date 'from' and 'to' ");
		}
	};

	//*********toggle list view ***********//
	$scope.iconChange = true;
	$scope.toggle = true;

	$scope.$watch('toggle', function () {
		$scope.toggleText = $scope.toggle ? 'Show List' : 'Track on Map';
	});

	$scope.callFirst = true;

	$rootScope.showInList = function (tripD) {
		if ($scope.callFirst === true) {
			document.getElementById('map-togg2').style.display = "none";
			$scope.callFirst = false;
		} else {
			$scope.callFirst = true;
			document.getElementById('map-togg2').style.display = "block";
		}

	};

	$scope.viewOnMap = function (listData) {
		if (listData.start && listData.start.latitude) {
			listData.reg_no = $rootScope.playData.reg_no;
			$rootScope.sMapViewData = listData;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/playback/singleViewOnMap.html',
				controller: 'sViewOnMapCtrl'
			});
		}
	}

	$scope.downloadCsv = function (aData) {
		let cnt = 1;
		objToCsv('PlaybackSheet',[
			'S.No',
			'Start Time',
			'End Time',
			'Location',
			'Latitude',
			'Longitude',
			'Nearest Landmark',
			'Speed(Kmph)',
			'Duration(Hour)',
			'Distance(Kms)'
		], aData.map( o => {
			let arr = [];
			try {
				arr.push(cnt++ || 0);
			} catch (e) {
				arr.push(0);
			}

			try {
				arr.push(o.start_time && o.start_time.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.end_time && o.end_time.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start_addr && o.start_addr.replace(/,/g,' ') || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start && o.start.latitude || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.start && o.start.longitude || 'NA');
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.nearest_landmark && o.nearest_landmark.name && o.nearest_landmark.dist ? o.nearest_landmark.dist/1000 + " KM from " + o.nearest_landmark.name : "NA");
			} catch (e) {
				arr.push('NA');
			}

			try {
				arr.push(o.top_speed || '0');
			} catch (e) {
				arr.push('0');
			}

			try {
				arr.push(o.duration || "0");
			} catch (e) {
				arr.push("0");
			}

			try {
				arr.push(o.distance || "0");
			} catch (e) {
				arr.push('0');
			}
			return arr;
		}));
	}
};
