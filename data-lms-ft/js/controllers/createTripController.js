materialAdmin
	.controller("createTripController", createTripController);

createTripController.$inject = [
	'$scope',
	'$modal',
	'$uibModal',
	'$timeout',
	'$localStorage',
	'$stateParams',
	'branchService',
	'bookingServices',
	'customer',
	'cityStateService',
	'DatePicker',
	'DateUtils',
	'Driver',
	'FleetService',
	'lazyLoadFactory',
	'Routes',
	'tripServices',
	'userService',
	'vehicleAllcationService',
	'Vehicle',
	'Vendor'
];

function createTripController(
	$scope,
	$modal,
	$uibModal,
	$timeout,
	$localStorage,
	$stateParams,
	branchService,
	bookingServices,
	customer,
	cityStateService,
	DatePicker,
	DateUtils,
	Driver,
	FleetService,
	lazyLoadFactory,
	Routes,
	tripServices,
	userService,
	vehicleAllcationService,
	Vehicle,
	Vendor) {

	let vm = this;

	vm.columnSetting = {
		allowedColumn: [
			'Vehicle No.',
			'Capacity(Tonne)',
			'Vehicle Type(Group)',
			'Segment',
			'Status',
			'Permit Expiry Date',
			'Vendor',
			'Driver',
		]
	};

	vm.tableHead = [
		{
			'header': 'Vehicle No.',
			'bindingKeys': 'vehicle_reg_no',
		},
		{
			'header': 'Capacity(Tonne)',
			'bindingKeys': 'capacity_tonne || veh_type.capacity || 0',
		},
		{
			'header': 'Vehicle Type(Group)',
			'bindingKeys': 'veh_type.name',
			'date': false
		},
		{
			'header': 'Segment',
			'bindingKeys': 'segment_type'
		},
		{
			'header': 'Status',
			'bindingKeys': 'status'
		},
		{
			'header': 'Permit Expiry Date',
			'bindingKeys': 'permit_expiry_date'
		},
		{
			'header': 'Vendor',
			'bindingKeys': 'vendor_name'
		},
		{
			'header': 'Driver',
			'bindingKeys': 'driver_name'
		}
	];

	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.lazyLoad = lazyLoadFactory(); // init lazyload
	vm.filterObj = {};
	vm.myFilter = {};
	vm.filterObj.vehicleSts = "Available";

	vm.getAllRegVehicle = getAllRegVehicle;
	vm.getVname = getVname;
	vm.getAllBranch = getAllBranch;
	vm.getLoadingBabu = getLoadingBabu;
	vm.getAllUsers = getAllUsers;
	vm.getSources = getSources;
	vm.getVehicles = getVehicles;
	vm.onVehSelect = onVehSelect;
	vm.grDetailPopup = grDetailPopup;
	vm.vendorDealPopUp = vendorDealPopUp;
	vm.selectedRow = selectedRow;
	vm.grSearch = grSearch;
	vm.addGr = addGr;
	vm.next = next;
	vm.submit = submit;
	vm.AddMvehicle = AddMvehicle;

	(function init() {
		getLoadingBabu();
		getAllUsers();
	})();

	vm.addMoreGr = function (index) {
		vm.aVehicleSelected[index].gr = vm.aVehicleSelected[index].gr || [];
		vm.aVehicleSelected[index].gr.push({});
	};

	vm.setUnknownDriver = function (sVehicle, index) {
		if (sVehicle.unknown_driver === true) {
			sVehicle.driver_name = "unknown";
		} else {
			sVehicle.driver_name = "";
		}
	};

	function selectedRow() {
		if (!Array.isArray(vm.selectedVehicle))
			return;

		for(let selected of vm.selectedVehicle)
		if (selected.ownershipType === "Own" && !selected.driver) {
			swal('No Driver', 'Driver Should be allocated on Vehicle to select this vehicle', 'error');
			return;
		}else if(selected.ownershipType != "Own"){
			if (!(selected.vendor_id))
				return swal('Error', 'No Vendor Found on Selected Vehicle', 'error');

			vm.selectedVendorInfo = selected.vendor_id;
		}
	}

	function next(){
		if(!Array.isArray(vm.selectedVehicle))
			return;
		if(vm.filterObj.vehicle_type != "Own"){
			if (!vm.selectedVehicle.every(o => o.vendor_id._id === vm.selectedVendorInfo._id))
				return swal('Error', 'All Selected Vehicle should belong to same Vendor', 'error');
		}
		vm.showDetails =true;
		vm.aVehicleSelected = angular.copy(vm.selectedVehicle);
	}

	function AddMvehicle () {
		var modalInstance = $uibModal.open({
				templateUrl: 'views/vehicleAllcation/addNewMvehicle.html',
				controller: 'addNewMvehicleCtrl',
				resolve: {
					thatData: function () {
						return {};
					}
				}
		});

		modalInstance.result.then(function () {

		}, function (data) {
			if(data != 'cancel') {
				swal("Oops!",data.message, "error")
			}
		});
	};

	function vendorDealPopUp(oTrip) {

		vm.oTrip = oTrip;
		vm.oTrip.vendor = vm.selectedVendorInfo;
		vm.oTrip.branch = vm.branch;
		vm.oTrip.loading_babu = vm.loading_babu;
		vm.oTrip.trip_manager = vm.trip_manager;
		vm.oTrip.allocation_date = vm.allocation_date;

		$modal.open({
			templateUrl: 'views/myTripAdvance/vendorDealPopUp.html',
			controller: ['$scope', '$uibModalInstance', 'accountingService', 'billBookService', 'branchService', 'billsService', 'bookingServices', 'callback', 'constants', 'DateUtils', 'DatePicker', 'formulaFactory', 'growlService', 'oTrip', 'sharedResource', 'tripServices', 'userService', 'Vendor', vendorDealPopUpController],
			controllerAs: 'ackDealVm',
			size: 'xl',
			resolve: {
				callback: function () {
					return function (data) {
						return new Promise(function (resolve, reject) {
							vm.oTrip.vendorDeal = data.vendorDeal;
							vm.oTrip.vendor = data.vendor;
							vm.oTrip.branch = data.branch;
							resolve('success');
						});
					};
				},
				oTrip: function () {
					return {
						...vm.oTrip
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			vm.oTrip = response;
		}, function (data) {
			console.log('cancel', data);
		});
	}

	// add Gr
	function addGr(index) {

		if (!vm.myFilter.gr)
			return;

		let request = {
			bill : {$exists: false},
		trip : {$exists: false},
		trip_no : {$exists: false},
		vehicle : {$exists: false},
		skip : 1,
			no_of_docs: 10,
		};

		if (vm.myFilter.gr)
			request.grNumber = vm.myFilter.gr;



		tripServices.getAllTripGrData(request, success, failure);

		function success(response) {
			if (response && response.data && response.data.data && response.data.data.length) {
				response = response.data.data[0];
				vm.aVehicleSelected[index].gr = vm.aVehicleSelected[index].gr || [];
				let gr = vm.aVehicleSelected[index].gr.find(o => o._id === response._id);
				if(!gr)
				vm.aVehicleSelected[index].gr.push(response);
			}
		}

		function failure(res) {
			swal('Some error with GET trips.', '', 'error');
		}
	}

	function grDetailPopup(oTrip, index) {

		oTrip.gr[index].src = oTrip.ld;
		oTrip.gr[index].dest = oTrip.uld;
		oTrip.gr[index].branch = oTrip.gr[index].branch || vm.branch;
		oTrip.gr[index].billingParty = oTrip.gr[index].billingParty || oTrip.gr[index].billing_party;
		oTrip.gr[index].consignee = Array.isArray(oTrip.gr[index].consignee) && oTrip.gr[index].consignee[0] || oTrip.gr[index].consignee;
		oTrip.gr[index].consignor = oTrip.gr[index].consignor || oTrip.gr[index].consigner;
		oTrip.gr[index].usedGR = [];
		oTrip.gr[index].acknowledge = oTrip.gr[index].acknowledge || {source: oTrip.ld && oTrip.ld.c, destination: oTrip.uld && oTrip.uld.c};
		oTrip.gr.forEach(o => {
			if (o.grNumber && o.grNumber != oTrip.gr[index].grNumber)
				oTrip.gr[index].usedGR.push(o.grNumber);
		});
		oTrip.grCounter = oTrip.grCounter || 1;
		// $localStorage.ft_data.newGr = oTrip.gr[index];

		$modal.open({
			templateUrl: 'views/vehicleAllcation/allocationGrUpsert.html',
			controller: [
				'$modal',
				'$modalInstance',
				'$parse',
				'$scope',
				'$rootScope',
				'$stateParams',
				'billBookService',
				'billingPartyService',
				'branchService',
				'CustomerRateChartService',
				'confService',
				'consignorConsigneeService',
				'customer',
				'DatePicker',
				'dateUtils',
				'formulaEvaluateFilter',
				'materialService',
				'otherUtils',
				'stateDataRetain',
				'tripServices',
				'Vehicle',
				'incentiveService',
				'oTrip',
				allocationGrUpsertController
			],
			controllerAs: 'grUVm',
			size: 'xl',
			resolve: {
				oTrip: function () {
					return {
						...oTrip.gr[index],
						grCounter: oTrip.grCounter
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
			console.log('cancel', data);
		});

		function applyData(data) {
			if (data.grNumber)
				oTrip.grCounter++;
			oTrip.gr[index] = data;
		}
	}

	function getSources(viewValue) {
		if (viewValue && viewValue.toString().length >= 2) {
			return new Promise(function (resolve, reject) {

				let requestObj = {
					query: viewValue,
				};

				cityStateService.autosuggestCity(requestObj, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}
			});
		}
	}

	function getVehicles(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					vehicle_no: viewValue,
					// vehicle_reg_no: viewValue,
					no_of_docs: 10,
					status: "Available",
					deleted: false
				};
				if(vm.filterObj.vehicle_type)
					req.ownershipType = vm.filterObj.vehicle_type;

				Vehicle.getAllVehicles(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function onVehSelect(item) {
		if(item){
			vm.showTable = true;
			getAllRegVehicle();
		}
	}

	function getAllBranch(viewValue) {
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

	function getLoadingBabu() {
		userService.getUsers({user_type: 'Loading Babu', all: 'true'}, (res) => {
			vm.aLoadingBabus = res.data;
		}, (err) => {
		});
	}


	function  getAllUsers() {
		function succGetUsers(response) {
			console.log(response.data);
			if (response.data && response.data.length > 0) {
				vm.aUsers = response.data;
			}
		}

		function failGetUsers(response) {
			console.log(response);
		}

		userService.getUsers({all: true, user_type: 'Trip Manager'}, succGetUsers, failGetUsers);
	}


	function getAllVehicleType() {
		function succType(res) {
			if (res.data && res.data.data && res.data.data[0]) {
				vm.aVehicleTypes = res.data.data;
			}
		}

		function failType(res) {
			vm.aVehicleTypes = [];
		}
		Vehicle.getAllType(succType, failType)
	}

	 function getVname(viewValue) {

		if (viewValue.length <= 2)
			return;
		vm.getAllRegVehicle();

	}

	function getVendor(viewValue) {
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
			}

			let res = {
				deleted: false,
				name : viewValue
			};

			Vendor.getName(res, oSuc, oFail);
		});
	}

	vm.weightValidaton = function (veh, index) {

		veh.loadedWeight = 0;
		for (var i = 0; i < veh.gr.length; i++) {
			veh.loadedWeight += veh.gr[i].weight;
		}
		vm.flag = false;

		veh.capacity_tonne = veh.capacity_tonne || veh.veh_type && veh.veh_type.capacity || 0;

		if (veh.loadedWeight > (veh.capacity_tonne + (veh.capacity_tonne * (veh.overloadAllowed || 0) / 100))) {
			// $scope.flag = true;

			$timeout(function () {
				swal('Error', 'weight cannot be greater than allowed Capacity', 'error');
				veh.gr[index].weight = 0;
				// $scope.flag = false;
			}, 2000);
		}
	};

	function grSearch(oTrip, index) {
		oTrip.gr = oTrip.gr || [];

		var modalInstance = $modal.open({
			templateUrl: 'views/grWithOutTrip/addGrPopUp.html',
			controller: ['$scope',
				'$uibModalInstance',
				'DatePicker',
				'lazyLoadFactory',
				'stateDataRetain',
				'tripServices',
				'oTrip',
				addGrPopupController],
			controllerAs: 'agVm',
			resolve: {
				oTrip: function () {
					return {
						...oTrip,
					};
				}
			}
		});
	}


	 function getAllRegVehicle(isGetActive) {

		 if(!vm.lazyLoad.update(isGetActive))
			 return;

		var oFilter = prepareFilterObject();
		 oFilter.populate = ['vendor_id'];

		 if(oFilter.status === 'Available')
			 vm.selectType = 'multiple';
		 else
		 vm.selectType = undefined;



		 Vehicle.getAllregList(oFilter, function (res) {
			 if (res && res.data) {
				 res = res.data;
				 vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			 }
		 });

	}

	function prepareFilterObject() {
		var myFilter = {status: 'Available'};

		if (vm.filterObj.veh_type && vm.filterObj.veh_type.length > 0)
			myFilter.veh_type = vm.filterObj.veh_type.map(obj => obj._id);

		if (vm.filterObj.vehicleNum)
			myFilter.vehicle_no = vm.filterObj.vehicleNum;

		if (vm.filterObj.vehicleSts)
			myFilter.status = vm.filterObj.vehicleSts;

		if (vm.filterObj.vendor) {
			myFilter.vendor_id = vm.filterObj.vendor._id;
		}

		if(vm.filterObj.vehicle_type)
		myFilter.ownershipType = vm.filterObj.vehicle_type;

		if (vm.filterObj.vehicle)
			myFilter._id = vm.filterObj.vehicle._id;

		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 10;

		myFilter.deleted = false;

		return myFilter;
	}

	function submit() {
		var allocationOk = true;
		if (vm.aVehicleSelected && vm.aVehicleSelected.length > 0) {
			for (var a = 0; a < vm.aVehicleSelected.length; a++) {
				if (!vm.aVehicleSelected[a].driver_name) {
					allocationOk = false;
				}

				if (!(vm.aVehicleSelected[a].ld && vm.aVehicleSelected[a].uld && vm.aVehicleSelected[a].rKm)) {
					allocationOk = false;
				}

				if (!(vm.branch && vm.branch._id)) {
					allocationOk = false;
				}

				vm.totalWeight = 0;
				if (vm.aVehicleSelected[a].gr && vm.aVehicleSelected[a].gr.length > 0) {
					for (var g = 0; g < vm.aVehicleSelected[a].gr.length; g++) {
						vm.totalWeight += vm.aVehicleSelected[a].gr[g].weight;
						if (!vm.aVehicleSelected[a].gr[g].weight) {
							allocationOk = false;
						}
					}
				} else {
					swal('warning', 'All vehicle not attached with Gr.', 'warning');
					allocationOk = false;
				}
				if (vm.totalWeight > (vm.aVehicleSelected[a].capacity_tonne + (vm.aVehicleSelected[a].capacity_tonne * (vm.aVehicleSelected[a].overloadAllowed || 0) / 100))) {
					return swal('Error', 'weight cannot be greater than allowed Capacity', 'error');
				}
			}
		} else {
			swal('warning', 'Vehicle not Available.', 'warning');
			allocationOk = false;
		}
		if (allocationOk === true) {

			function succ(response) {
				vm.disableSubmit = false;
				console.log(response.data);
				let succMess = "Trip is successfully created \n";
				if (response.data.messages && response.data.messages.length > 0) {
					for (let i = 0; i < response.data.messages.length; i++) {
						succMess += response.data.messages[i].message + " \n";
					}
				}
				swal('Success', succMess, 'success');
				delete $localStorage.ft_data.grData;
				vm.aVehicleSelected = [];
				vm.showDetails = false;
				vm.showTable = false;
				vm.filterObj = {};

			}

			function fail(response) {
				console.log(response);
				vm.disableSubmit = false;
			}

			var allocationData = [];
			var allocationDataFinal = [];

			allocationData = vm.aVehicleSelected;
			for (var a = 0; a < allocationData.length; a++) {
				allocationDataFinal[a] = {};
				allocationDataFinal[a].vehicle_no = allocationData[a].vehicle_reg_no;
				allocationDataFinal[a].driver_name = allocationData[a].driver_name;
				allocationDataFinal[a].vehicle = allocationData[a]._id;
				allocationDataFinal[a].route = allocationData[a].route && allocationData[a].route._id;
				allocationDataFinal[a].route_name = allocationData[a].route && allocationData[a].route.name;
				allocationDataFinal[a].branch = allocationData[a].branch || vm.branch._id;
				if(allocationData[a].ld && allocationData[a].uld) {
					allocationDataFinal[a]['rName'] = `${allocationData[a].ld.c} to ${allocationData[a].uld.c}`;
					allocationDataFinal[a]['rKm'] =  allocationData[a].rKm || 1;
				}
				console.log('selBookData,', vm.selBookData);

				//allocationDataFinal[a].driver = $scope.formDataSelected.driver;
				allocationDataFinal[a].trip_manager = vm.trip_manager;
				allocationDataFinal[a].loading_babu = vm.loading_babu;
				allocationDataFinal[a].vendor = allocationData[a].vendor || vm.selectedVendorInfo && vm.selectedVendorInfo._id;
				allocationDataFinal[a].allocation_date = vm.allocation_date || new Date();
				allocationDataFinal[a].vendorDeal = allocationData[a].vendorDeal || {};

				allocationDataFinal[a].gr = [];
				for (var v = 0; v < allocationData[a].gr.length; v++) {
					allocationDataFinal[a].gr[v] = {
						...allocationData[a].gr[v]
					};
					if(!allocationDataFinal[a].gr[v].acknowledge){
						allocationDataFinal[a].gr[v].acknowledge = {
							source: allocationData[a].ld && allocationData[a].ld.c,
							destination: allocationData[a].uld && allocationData[a].uld.c
						};
					}
					allocationDataFinal[a].gr[v].branch = allocationDataFinal[a].gr[v].branch && allocationDataFinal[a].gr[v].branch._id || allocationData[a].gr[v].branch_id && allocationData[a].gr[v].branch_id._id || vm.branch && vm.branch._id;
					// allocationDataFinal[a].gr[v].branch = allocationData[a].gr[v].branch_id._id;

					allocationDataFinal[a].gr[v].billingParty = allocationDataFinal[a].gr[v].billingParty && allocationDataFinal[a].gr[v].billingParty._id || allocationData[a].gr[v].billing_party && allocationData[a].gr[v].billing_party._id;
					allocationDataFinal[a].gr[v].consignee = Array.isArray(allocationData[a].gr[v].consignee) ? (allocationData[a].gr[v].consignee[0] && allocationData[a].gr[v].consignee[0]._id) : (allocationData[a].gr[v].consignee && allocationData[a].gr[v].consignee._id);
					allocationDataFinal[a].gr[v].consignor = allocationDataFinal[a].gr[v].consignor && allocationDataFinal[a].gr[v].consignor._id || allocationData[a].gr[v].consigner && allocationData[a].gr[v].consigner._id;

					allocationDataFinal[a].gr[v].invoices && allocationDataFinal[a].gr[v].invoices.forEach(invObj=>{
						invObj.invoiceDate= moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
					});
				}
			}
			vm.disableSubmit = true;

				vehicleAllcationService.createTrip({trips: allocationDataFinal}, succ, fail);

		} else {
				swal('warning', 'Weight, route, driver, branch not added on all vehicle. Please check it.', 'warning');
				$scope.disableSubmit = false;

		}
	};

}

function addGrPopupController(
	$scope,
	$uibModalInstance,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	oTrip,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.DatePicker = angular.copy(DatePicker);
	vm.selectedTrip = oTrip;
	vm.getGrs = getGrs;
	vm.addGrIntoTrip = addGrIntoTrip;

	// init
	(function init() {

		vm.columnSetting = {
			allowedColumn: [
				'Gr No',
				'Gr Date',
				'BILLING ROUTE',
				'Customer',
				'CONSIGNOR',
				'CONSIGNEE',
				'BILLING PARTY',
				'MATERIAL CODE',
				'MATERIAL NAME',
				'RATE',
				'FREIGHT',
				'TOTAL FREIGH',
				'TOTAL AMOUNT',
				'Branch',
				'ENTRY BY'
			]
		};

		vm.tableHead = [
			{
				'header': 'Gr Date',
				'bindingKeys': 'grDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Gr No',
				'bindingKeys': 'grNumber'
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name '
			},
			{
				'header': 'CONSIGNOR',
				'bindingKeys': 'consignor.name'
			},
			{
				'header': 'CONSIGNEE',
				'bindingKeys': 'consignee.name'
			},
			{
				'header': 'BILLING ROUTE',
				'bindingKeys': '(acknowledge.source) + " to "  + (acknowledge.destination)',
				'date': false
			},
			{
				'header': 'Branch',
				'bindingKeys': 'branch.name'
			},
			{
				'header': 'BILLING PARTY',
				'bindingKeys': 'billingParty.name'
			},
			{
				'header': 'MATERIAL CODE',
				'bindingKeys': 'invoices[0].material.groupCode',
				'date': false
			},

			{
				'header': 'MATERIAL NAME',
				'bindingKeys': 'invoices[0].material.groupName'
			},
			{
				'header': 'FREIGHT',
				'bindingKeys': 'basicFreight'
			},
			{
				'header': 'RATE',
				'bindingKeys': 'invoices[0].rate'
			},
			{
				'header': 'TOTAL FREIGH',
				'bindingKeys': 'totalFreight'
			},
			{
				'header': 'TOTAL AMOUNT',
				'bindingKeys': 'totalAmount'
			},
			{
				'header': 'ENTRY BY',
				'bindingKeys': 'created_by_full_name'
			}
		];
		vm.lazyLoad = lazyLoadFactory();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getGrs(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilterObject();
		tripServices.getAllGRItem(oFilter, success, fail);

		function success(response) {
			if (response && response.data) {

				response = response.data;

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response.data);
				// vm.tableApi && vm.tableApi.refresh();
			}
		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function prepareFilterObject(isPagination) {
		var myFilter = {source: 'GR', dateType: "grDate", gr_type : {$ne: 'Trip Memo'}, trip : {$exists: false }};


		if (vm.oFilter.grNumber) {
			myFilter.grNumber = vm.oFilter.grNumber;
		}

		if (vm.oFilter.grDocType) {
			myFilter.grDocType = vm.oFilter.grDocType;
		}

		if (vm.oFilter.dateType) {
			myFilter.dateType = vm.oFilter.dateType;
		}


		if (vm.oFilter.grCustomer) {
			myFilter.customer = vm.oFilter.grCustomer._id;
		}

		if (vm.oFilter.grConsignor) {
			myFilter.consignor = vm.oFilter.grConsignor._id;
		}

		if (vm.oFilter.grConsignee) {
			myFilter.consignee = vm.oFilter.grConsignee._id;
		}

		if (vm.oFilter.billingParty) {
			myFilter['billingParty._id'] = vm.oFilter.billingParty._id;
		}

		if (vm.oFilter.route_id) {
			myFilter.route_id = vm.oFilter.route_id._id;
		}
		if (vm.oFilter.branch) {
			myFilter.branch = vm.oFilter.branch._id;
		}else if (vm.aBranch && vm.aBranch.length) {
			myFilter.branch = [];
			vm.aBranch.forEach(obj => {
				if(obj.read)
					myFilter.branch.push(obj._id);
			});
		}
		if (vm.oFilter.from) {
			myFilter.from = new Date((vm.oFilter.from).setHours(0, 0, 0));
		}
		if (vm.oFilter.to) {
			myFilter.to = new Date((vm.oFilter.to).setHours(23, 59, 59));
		}
		if (vm.oFoundTableId) {
			myFilter.tableId = vm.oFoundTableId;
		} else {
			myFilter.tableId = false;
		}

		myFilter.sort = {grNumber: 1};

		myFilter.no_of_docs = 5;
		myFilter.skip = vm.lazyLoad.getCurrentPage();

		return myFilter;
	}

	function addGrIntoTrip() {
		if (!vm.selectedGr)
			return swal('Warning', 'Please Select at least one row', 'warning');


		swal({
				title: 'Are you sure you want to add this Gr?',
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
					vm.selectedTrip.gr = vm.selectedGr.reduce((arr, oGr) => {

						if (!arr.find(o => o._id === oGr._id))
							arr.push(oGr);

						return arr;

					}, vm.selectedTrip.gr);
				// vm.selectedTrip.gr.push(...vm.selectedGr);
				// 	 swal('Success', 'Gr added successfully', 'success');
					$uibModalInstance.dismiss();
				}
			});
		return;
	}
}
