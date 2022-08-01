materialAdmin
	.controller("crossDockingController", crossDockingController)

crossDockingController.$inject = [
	'$state',
	'$scope',
	'$modal',
	'lazyLoadFactory',
	'branchService',
	'tripServices',
	'Vehicle',
	'Vendor',
	'customer',
	'billingPartyService',
	'DatePicker',
	'stateDataRetain',
];


function crossDockingController(
	$state,
	$scope,
	$modal,
	lazyLoadFactory,
	branchService,
	tripServices,
	Vehicle,
	Vendor,
	customer,
	billingPartyService,
	DatePicker,
	stateDataRetain,
) {

	// functions Identifiers
	$scope.getAllCrossDocking = getAllCrossDocking;
	$scope.getAllBranch = getAllBranch;
	$scope.getVehicle = getVehicle;
	$scope.getVendorName = getVendorName;
	$scope.getCustomer = getCustomer;
	$scope.getBilling = getBilling;
	$scope.addCrossDocking = addCrossDocking;
	$scope.onStateRefresh = function () {
		getAllCrossDocking();
	};

	// INIT functions
	(function init() {
		$scope.oFilter = {};
		$scope.showTable = true;
		$scope.selectType = 'index';
		$scope.aCrossDocking = [];
		$scope.maxDate = new Date();
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.lazyLoad = lazyLoadFactory();

		if (stateDataRetain.init($scope))
			return;

		$scope.columnSetting = {
			allowedColumn: [
				'Trip No',
				'Gr No',
				'Vehicle No',
				'Source',
				'Destination',
				'Customer',
				'Billing Party',
				'Basic Freight',
				'Total Freight',
				'Created By',
				'Created At',
			]
		};
		$scope.tableHead = [
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			{
				'header': 'Gr No',
				'bindingKeys': 'grNumber',
				'date': false,
			},
			{
				'header': 'Basic Freight',
				'bindingKeys': 'basicFreight'
			},

			{
				'header': 'Total Freight',
				'bindingKeys': 'totalFreight'
			},

			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle_no'
			},
			{
				'header': 'Source',
				"bindingKeys": "acknowledge.source || trip.rName.split(' to ')[0]"
			},
			{
				'header': 'Destination',
				"bindingKeys": "acknowledge.destination|| trip.rName.split(' to ')[1]"
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer.name'
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name'
			},
			{
				'header': 'Created By',
				'bindingKeys':  'created_by_full_name',
			},
			{
				'header': 'Created At',
				'bindingKeys':  'created_at || trip.created_at',
			},
		];
	})();

	// Get all CrossDocking from backend
	function getAllCrossDocking(isGetActive) {
		if (!$scope.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilterObject();
		tripServices.getTripMemo(oFilter, onSuccess, err => {
			console.log(err);

		});

		function onSuccess(res) {
			if (res && res.data) {
				$scope.aSelectedDocking = res && res.data && res.data.data[0];
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, res.data);
			}
		}
	}

	function addCrossDocking() {

			var modalInstance = $modal.open({
				templateUrl: 'views/crossDocking/addCrossDocking.html',
				controller: ['$scope', '$uibModalInstance', '$stateParams','branchService','cityStateService', 'DatePicker', 'Vehicle', 'Driver','tripServices',crossDockingAddController],
				controllerAs: 'acdVm',
				size: 'xl',
				resolve: {

				}
			});


			modalInstance.result.then(function (response) {
				if (response) {

				}
			}, function (data) {

			});

	}



// get vehicle name
	function getVehicle(viewValue) {
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

// get vendor name

	function getVendorName(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					deleted: false,
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

// get all  branch
	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10
				};

				if ($scope.$configs.client_allowed)
					req.cClientId = JSON.stringify($scope.$configs.client_allowed.map((v) => v.clientId));

				if ($scope.aUserBranch && $scope.aUserBranch.length) {
					let branch = [];
					$scope.aUserBranch.forEach(obj => {
						if (obj.read)
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

// get customer
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

//billing party search
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

// prepare the filter object
	function prepareFilterObject(download) {
		var filter = {};
		if ($scope.oFilter.trip_no) {
			filter.trip_no = $scope.oFilter.trip_no;
		}
		if ($scope.oFilter.grNumber) {
			filter.grNumber = $scope.oFilter.grNumber;
		}
		if ($scope.oFilter.vehicle) {
			filter.vehicle = $scope.oFilter.vehicle._id;
		}
		if ($scope.oFilter.vendor) {
			filter.vendor = $scope.oFilter.vendor._id;
		}
		if ($scope.oFilter.branch) {
			filter.branch = $scope.oFilter.branch._id;
		}
		if ($scope.oFilter.customer) {
			filter.customer = $scope.oFilter.customer._id;
		}
		if($scope.oFilter.billingParty){
			filter.billingParty = $scope.oFilter.billingParty._id;
		}

		if ($scope.oFilter.fromDate) {
			filter.from = $scope.oFilter.fromDate;
		}
		if ($scope.oFilter.toDate) {
			filter.to = $scope.oFilter.toDate;
		}

		filter.gr_type = 'Cross Docking';


		if (download) {
			filter.download = true;
			filter.no_of_docs = 10000;
		} else {
			filter.skip = $scope.lazyLoad.getCurrentPage();
			filter.no_of_docs = 30;
		}
		return filter;
	}

}

function crossDockingAddController(
	$scope,
	$uibModalInstance,
	$stateParams,
	branchService,
	cityStateService,
	DatePicker,
	Vehicle,
	Driver,
	tripServices
) {
	let vm = this;

	// functions Identifiers
	vm.closeModal = closeModal;
	vm.getAllDriver = getAllDriver;
	vm.getAllVehicle = getAllVehicle;
	vm.onVehicleSelect = onVehicleSelect;
	vm.getAllBranch = getAllBranch;
	vm.getRoute = getRoute;
	vm.getLocation = getLocation;
	vm.removeGr = removeGr;
	vm.getGr =  getGr;
	vm.submit = submit;


	// INIT functions
	(function init() {

		vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker

	})();

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function onVehicleSelect(vehicle){
		if(vehicle.driver && vehicle.driver_name){
			vm.oGrData.driver = {_id: vehicle.driver, name: vehicle.driver_name};
		}
	}

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					deleted: false,
					status: 'Available',
				};

				Vehicle.getNameTrim1(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getAllDriver(viewValue) {
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

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10
				};

				if ($scope.$configs.client_allowed)
					req.cClientId = JSON.stringify($scope.$configs.client_allowed.map((v) => v.clientId));

				if ($scope.aUserBranch && $scope.aUserBranch.length) {
					let branch = [];
					$scope.aUserBranch.forEach(obj => {
						if (obj.read)
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

	function getLocation (viewValue) {
		return new Promise((resolve, reject) => {
			Routes.getLocation(viewValue)
				.then(aAddress => {
					resolve((aAddress || []).map(oAddress => {
						let aSplitAddress = (oAddress.placeAddress || '')
							.match(/([A-z0-9 \-\._\/\(\)]*)/g)
							.reduce((acc, str) => {
								if (str)
									acc.push(str.trim());
								return acc;
							}, [])
							.reverse();

						let pincode;
						if (aSplitAddress.length && aSplitAddress[0].match(/^\d{4,10}$/))
							pincode = aSplitAddress.shift();
						let state = aSplitAddress.length ? aSplitAddress.shift() : '';
						let district = aSplitAddress.length ? aSplitAddress.shift() : '';
						let city = aSplitAddress.length ? aSplitAddress.shift() : oAddress.placeName;



						return {
							c: city,
							d: district,
							s: state,
							f: Routes.getStateShortName(state),
							lat: oAddress.latitude,
							lng: oAddress.latitude,
						};
					}));
				});
		}).catch(err => {
			console.error(err)
		});
	};


	function getRoute (viewValue) {
		if (viewValue.length < 1) return;
		return new Promise(function (resolve, reject) {
			cityStateService.getCity({c:viewValue}, function success(res) {
				vm.aRoute = res.data
				resolve(res.data);
			}, function (err) {
				reject([]);
			});
		});
	}


	function removeGr(index) {
		if (typeof index === 'number' && vm.aItems.length) {
			vm.aItems.splice(index, 1);
		}
	}

	function getGr() {

		if (!vm.filter.grNo && !vm.filter.shipmentNo && !vm.filter.tripNo)
			return;

		// if (vm.aItems && vm.aItems.find(o => o.grNumber === vm.filter.grNo))
		// 	return swal('Warning', 'Gr Already added!!!', 'warning');

		let oFilter = {};

		oFilter["crossDockingTo"] = {
			$exists: false
		};

		if (vm.filter.grNo)
			oFilter.grNumber = vm.filter.grNo;
		else{
			oFilter["grNumber"] = {
				$exists: true
			};
		}
		if (vm.filter.shipmentNo)
			oFilter.shipmentNo = vm.filter.shipmentNo;
		if (vm.filter.tripNo)
			oFilter.trip_no = Number(vm.filter.tripNo);
		oFilter["bill"] = {
			$exists: false
		};

		oFilter.dateType = "grDate";
		oFilter['isNonBillable'] = false;

		vm.filter = {};

		tripServices.getAllTripGrData(oFilter, success, failure);

		function success(data) {
			if (data.data && data.data.data && data.data.data.length) {
				vm.aItems = vm.aItems || [];
				vm.aItems = data.data.data.reduce((arr, oGr) => {

					if (!arr.find(o => o._id === oGr._id))
						arr.push(oGr);

					return arr;

				}, vm.aItems);
			} else {
				swal('Warning', 'No Gr Found', 'warning');
			}
		}

		function failure(res) {
			swal('Some error with GET Grs.', '', 'error');
		}
	}

	function submit(formData) {
		if (formData.$valid) {
			let payload = {...vm.oGrData};

			if(vm.aItems && !vm.aItems.length)
				return swal('Select at least one Gr', '', 'error');

			payload.ids = vm.aItems.map( o => {return o._id;});


			if (payload.vehicle && payload.vehicle.vendor_id) {
				payload.vendor = payload.vehicle.vendor_id;
			}

			if (payload.vehicle && payload.vehicle._id) {
				payload.vehicle_no = payload.vehicle.vehicle_reg_no;
				payload.vehicle_ = payload.vehicle._id;
			}

			if (payload.driver && payload.driver._id){
				payload.driver_name = payload.driver.name;
			    payload.driver = payload.driver._id;
	     	}

			if(payload.branch && payload.branch._id)
				payload.branch = payload.branch._id;

			if(payload.ld && payload.uld) {
				payload['rName'] = `${payload.ld.c} to ${payload.uld.c}`
				payload['rKm'] =    payload.rKm || 1;
			}

			vm.isDisable = true;
			tripServices.addCrossDocking(payload, success, failure);

			function success(res) {
				vm.isDisable = false;
				if (res && res.data) {
					swal('Success', res.data.messages[0].message, 'success');
				}
				$uibModalInstance.dismiss();
			}

			function failure(res) {
				vm.isDisable = false;
				var msg = res.data.message;
				swal('Error', msg, 'error');
			}

		}else
			return swal('Error', 'All Mandatory Feilds are not filled', 'error');
	}

}




