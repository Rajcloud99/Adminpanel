materialAdmin.controller("vehicleProfileCommonController",
	function ($rootScope, $stateParams, $state, $scope, $modal, modelService, Vehicle, Driver, HTTPConnection, URL, Vendor,ReportService) {

	var lastFilter;
	$rootScope.hideThis = false;
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 15;
	$scope.vehiclesOwn = [];
	$scope.vehiclesMarket = [];
	$scope.vehicle_type1 = ['All', 'Own', 'Market'];


	(function getModelMatrix() {
		function success(response){
			if (response.data && response.data.data){
				$rootScope.vehModelMatrix = response.data.data
			}
		}
		function failure(response){}
		modelService.getModelMatrix(success,failure);
	})();



	$scope.pageChanged = function () {
		/*if($stateParams.name){
		 var sUrl = "#!/masters/vehicle/vehicleprofile"+"/" +$scope.currentPage +"/" + $stateParams.name;
		 } else {
		 var sUrl = "#!/masters/vehicle/vehicleprofile"+"/" +$scope.currentPage +"/";
		 }*/
		//$rootScope.redirect(sUrl);
		$scope.getAllVehiclesList(true);
	};

	$scope.aStatus = ["Available", "Maintenance", "Booked", "Journey"];

	$scope.getALLVehicle = function () {
		$scope.currentPage = 1;
		$stateParams.name = '';
		$scope.vehicleName = '';
		var sUrl = "#!/masters/vehicle/vehicleprofile";
		$rootScope.redirect(sUrl);
		$state.reload();
	};

	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
		} catch (e) {
			//console.log('catch in vehicleProfileController');
		}
	}, true);

	function suc(response) {
		$rootScope.vehicleTypes = response.data.data;
	}

	function fail(response) {
		console.log('failed', response);
	}

	$scope.selectVehicle = function (vehicle, index) {
		$rootScope.vehicle = vehicle;
		if ($rootScope.vehicle) {
			$rootScope.vehicle.isNew = false;
		} else {
			$rootScope.vehicle = {};
			$rootScope.vehicle.isNew = false;
		}
		var sUrl = "#!/masters/vehicle/vehicleprofile/";
		$rootScope.redirect(sUrl);
		listItem = $($('.lv-item')[index]);
		listItem.siblings().removeClass('grn');
		listItem.addClass('grn');

	};
	$scope.editVehicle = function () {
		$rootScope.vehicle;
		$rootScope.vehicle.isNew = false;
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('grn');
	};

	$scope.newVehicleReg = function () {
		if ($rootScope.vehicle) {
			$rootScope.vehicle.isNew = true;
		} else {
			$rootScope.vehicle = {};
			$rootScope.vehicle.isNew = true;
		}
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('grn');
	};

	$rootScope.formateDate = function (date) {
		return new Date(date);
	};

	$scope.getAllDriverData = function(){
		function success(data) {
			$scope.aDrivers = data.data;

		}

		Driver.getAllDriversForDropdown({all:true}, success);
	}
	$scope.getAllDriverData();

	function prepareFilterObject(isPagination) {
		var myFilter = {};
		if ($scope.vehicleName) {
			myFilter.vehicle_reg_no = $scope.vehicleName;
		}
		if ($scope.vehicleType1 == 'Market') {
			myFilter.own = false;
			myFilter.is_market = true;
		}else if($scope.vehicleType1 == 'Own'){
			myFilter.own = true;
			myFilter.is_market = false;
		}
		/*else if($stateParams.name){
		 myFilter.name = $stateParams.name;
		 $scope.vehicleName = $stateParams.name;
		 }*/
		if (isPagination && $scope.currentPage) {
			myFilter.skip = $scope.currentPage;
		}
		if ($scope.vendorName && $scope.vendorName._id) {
			myFilter.vendor_id = $scope.vendorName._id;
		}
		if ($scope.driver && $scope.driver.name) {
			myFilter.driver_name = $scope.driver.name;
		}
		return myFilter;
	}

	$scope.getAllVehiclesList = function (isPagination) {
		$scope.vehicleType1 = '';
		function success(data) {
			$rootScope.vehicles = data.data;
			$scope.vehiclesMarket = [];
			$scope.vehiclesOwn = [];
			if ($rootScope.vehicles && $rootScope.vehicles.length > 0) {
				for (i = 0; i < $rootScope.vehicles.length; i++) {
					if ($rootScope.vehicles[i].is_market == false) {
						$scope.vehiclesOwn.push($rootScope.vehicles[i]);
					} else if ($rootScope.vehicles[i].is_market == true) {
						$scope.vehiclesMarket.push($rootScope.vehicles[i]);
					}
				}
			}

			if (data.data && data.data.length > 0) {
				$rootScope.vehicle = data.data[0];
				$scope.total_pages = data.pages;
				$scope.totalItems = 15 * data.pages;

				setTimeout(function () {
					listItem = $($('.lv-item')[0]);
					listItem.addClass('grn');
				}, 500);

			}
		}

		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		Vehicle.getAllVehicles(oFilter, success);
		//dataServices.loadCities();
	};
	$scope.getAllVehiclesList();

	$scope.downloadReport = function(){
		ReportService.getVehicleReport(lastFilter, function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}

	$scope.getVehicleByselect = function (sts) {
		if (sts == 'All') {
			//$rootScope.vehicles = [];
			$scope.getAllVehiclesList();
		}
		if (sts == 'Own') {
			$rootScope.vehicles = [];
			$rootScope.vehicles = $scope.vehiclesOwn;
		}
		if (sts == 'Market') {
			$rootScope.vehicles = [];
			$rootScope.vehicles = $scope.vehiclesMarket;
		}
	};

	$scope.deleteVehicle = function (deleteData, $index) {
		function delSuc(response) {}

		function delFail(response) {}

		var data = {};
		data.id = deleteData._id;
		//Vehicle.deleteVehicles(data,delSuc, delFail);
	};

	//vehicle SEARCHING
	$scope.onSelect = function ($item, $model, $label) {
		$scope.currentPage = 1;
		$scope.getAllVehiclesList();
	};

	$scope.getVname = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.vehicleNames = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			$scope.currentPage = 1;
			$scope.getAllVehiclesList();
		}
	};

	$scope.clearSearch = function() {
		$scope.vehicleName = '';
		$scope.getVname($scope.vehicleName);
	}
	//end vehicle search

	$scope.allocateDriver = function () {
		var modalInstance = $modal.open({
			templateUrl: 'views/myDrivers/AllocationpopUp.html',
			controller: 'dAllocatePopCtrl',
			resolve: {
				thatVahicle: function () {
					return $scope.vehicle;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function () {
			console.log('2');
		});
	};

	$scope.getAllVendorsList = function () {
		function successVendorList(res) {
			if (res.data.data) {
				$scope.aVendors = res.data.data;
			}
		}

		Vendor.getAllVendorsList({deleted: false}, successVendorList)
	};

	$scope.getAllVendorsList();

});

materialAdmin.controller("dAllocatePopCtrl", function ($rootScope, $scope, $modalInstance, thatVahicle, Vehicle, Driver) {
	//$("p").text("Vehicle");
	$scope.closeModal = function () {
		$modalInstance.close();
	};
	$scope.oVehicle = thatVahicle;

	// I will invoke myself
	(function () {
		function nameSuccess(res) {
			if (res.data.data) {
				$scope.dNames = res.data.data;
				if ($scope.dNames.length > 0) {
					for (var y = 0; y < $scope.dNames.length; y++) {
						$scope.dNames[y].namePlusCode = $scope.dNames[y].name + '(' + $scope.dNames[y].employee_code + ')';
					}
				}
			}
		}

		Driver.getAll(nameSuccess);
	})();

	function updateSuccess(res) {
		console.log(res);
		$modalInstance.close();
	}

	$scope.AllocateSubmit = function () {
		if ($scope.driverSelected) {
			var oData = {};
			oData._id = thatVahicle._id;
			oData.driver_license = $scope.driverSelected.license_no;
			oData.driver_name = $scope.driverSelected.name;
			oData.driver_employee_code = $scope.driverSelected.employee_code;
			oData.driver_contact_no = $scope.driverSelected.prim_contact_no;
			oData.driver = $scope.driverSelected._id;

			Vehicle.updateVehicle(oData, updateSuccess)
		}
	}
});

materialAdmin.controller("vehicleUpdateController",
	function ($rootScope, $scope, $interval, $modal, Vehicle, messageService, Vendor,
			  modelService, formValidationgrowlService, structureMasterService, $localStorage) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = true;

	$scope.showOwn = $localStorage.ft_data.client_config.clientId;


	//var oCity = {};
	$scope.vehicle = {};
	$scope.aVendors = [];
	$scope.aCatVehStructure = ['Horse', 'Truck','Trailer'];
	$scope.aOwners = ['B.K Tiwari', 'Gaurav','Jhalani', 'Manoj','Murtaza', 'N.P Shukla','Raj Singh', 'Rohit Ji','For Sale', 'HZL','Loni Fix', 'NAGPUR','NAGPUR-NCR', 'Proposed for Sale','Market','Mohit','VMST','om shree tpt Nagpur','ICD LONI(BASANT)','ICD LONI(N.P SHUKLA)','ICD LONI(ROHIT)'];


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
	/*function suc(response){
	 $rootScope.vehicleTypes = response.data.data;
	 };
	 function fail(response){
	 };
	 Vehicle.getVehicleTypes(suc,fail);*/
	if ($rootScope.vehicle && $rootScope.vehicle.status) {
		$scope.vehicle.status = $rootScope.vehicle.status;
	}

		$scope.vehicle.is_market = false;
		if($scope.vehicle.own){
			$scope.vehicle.own = 'yes';
		}else{
			$scope.vehicle.own = 'no';
		}




	function groupSuc(response) {
		if (response && response.data && response.data.data) {
			$rootScope.vehicleUGroups = response.data.data;
			if ($scope.vehicleUGroups && $scope.vehicleUGroups.length > 0) {
				for (var i = 0; i < $scope.vehicleUGroups.length; i++) {
					if ($scope.vehicleUGroups[i]._id == $scope.vehicle.veh_group) {
						$scope.vehicle.group_name = $scope.vehicleUGroups[i];
						if ($scope.vehicleUGroups[i] && $scope.vehicleUGroups[i].vehicle_types && $scope.vehicleUGroups[i].vehicle_types.length > 0) {
							for (var j = 0; j < $scope.vehicleUGroups[i].vehicle_types.length; j++) {
								$scope.vehicleUTypes = $scope.vehicleUGroups[i].vehicle_types;
								if ($scope.vehicleUGroups[i].vehicle_types[j]._id == $scope.vehicle.veh_type || $scope.vehicleUGroups[i].vehicle_types[j]._id == $scope.vehicle.veh_type._id) {
									$scope.vehicle.veh_type = $scope.vehicleUGroups[i].vehicle_types[j];
								}
							}
						}
					}
				}
			}
		}
	}

	function fail(res) {
		console.error("fail: ", res);
	}

	Vehicle.getGroupVehicleType(groupSuc, fail);

	function sucDriver(response) {
		if (response && response.data && response.data.data) {
			$rootScope.selectedDrivers = response.data.data;
			if ($scope.selectedDrivers && $scope.selectedDrivers.length > 0) {
				for (var i = 0; i < $scope.selectedDrivers.length; i++) {
					if ($scope.selectedDrivers[i].name == $scope.vehicle.driver_name) {
						$scope.vehicle.driver_name = $scope.selectedDrivers[i];
					}
				}
			}
		}
	}

	function failDriver(res) {
		console.error("fail: ", res);
	}

	Vehicle.getAllDrivers(sucDriver, failDriver);
	(function () {
		function successVendorList(res) {
			if (res.data.data) {
				//$scope.aVendors = res.data.data;
				$scope.aVendors = res.data.data;
				if ($scope.aVendors && $scope.aVendors.length > 0) {
					for (var i = 0; i < $scope.aVendors.length; i++) {
						if ($scope.aVendors[i]._id == $scope.vehicle.vendor_id) {
							$scope.vehicle.vendor_name = $scope.aVendors[i];
						}
					}
				}
			}
		}

		Vendor.getAllVendorsList({deleted: false}, successVendorList)
	})();

	$scope.getGroupUNames = function (selectType) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectType) {
			console.log(' Group & Vehicle');
			$scope.selecttName = selectType.name;
			//$scope.vehicleRegister.group_code = selectType.code;
			$scope.vehicleUTypes = selectType.vehicle_types;
			$scope.vehicle.veh_group = selectType._id;
		}
	};

	$scope.getDriverUMobile = function (selectDriver) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectDriver) {
			console.log(' Driver & Number2');
			console.log(JSON.stringify(selectDriver));
			$scope.selectDriverName = selectDriver;
			//$scope.vehicleRegister.group_code = selectType.code;
			$scope.vehicle.driver_license = selectDriver.license_no;
			if (selectDriver.prim_contact_no) {
				$scope.vehicle.driver_contact_no = selectDriver.prim_contact_no;
			}
		}
	};
	$scope.getVendorMobile = function (thatVendor) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (thatVendor) {
			$scope.selectedVendor = thatVendor;
			//$scope.vehicleRegister.group_code = selectType.code;
			if (thatVendor.prim_contact_no) {
				$scope.vehicle.vendor_mobile = thatVendor.prim_contact_no;
			}
		}
	};

	($scope.getAllStructureNames = function () {
		function success(response) {
			if (response.status.toLowerCase() === "ok" && response.data) {
				$scope.structuresObjArr = response.data;
				if ($scope.structuresObjArr && $scope.structuresObjArr.length > 0) {
					for (var i = 0; i < $scope.structuresObjArr.length; i++) {
						if ($scope.structuresObjArr[i].structure_name == $scope.vehicle.structure_name) {
							$scope.vehicle.structure = $scope.structuresObjArr[i];
						}
					}
				}
			}
		}

		function failure(response) {
		}

		structureMasterService.getStructureMasters({}, success, failure);
	})();

	$scope.aMake_years = ['2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000'];
	$scope.aManufectures = ['Ashok Leyland', 'Tata Motors', 'Bharat Benz', 'Eicher Motors', 'Force Motors', 'Mahindra Navistar', 'Swaraj Mazda', 'Premier Automobiles', 'Hindustan Motors', 'Tata Daewoo', 'Asia motor works'];

	function success(response) {
		if (response && response.data && response.data.data) {
			//$rootScope.vehicle = response.data.data;
			//$scope.vehicle = response.data.data;
			//$rootScope._id = response.data.data._id;
			var msg = response.data.message;
			swal("Success", msg, "success");
			var sUrl = "#!/masters/vehicle/vehicleprofile/";
			$rootScope.redirect(sUrl);
			window.location.reload();
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}


	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
			if ($scope.vehicle.manufacturer) {
				$scope.vehModels = $rootScope.vehModelMatrix[$scope.vehicle.manufacturer];
			}
		} catch (e) {
			console.log('catch in vehicleController');
		}
	}, true);


	$scope.updateVehicleErrMsg = false;
	$scope.saveVehicleDetails = function (form) {
		$scope.VUmsg = '';
		if ($scope.vehicle && $scope.vehicle.own == "yes") {
			$scope.vehicle.is_market = false;
			$scope.vehicle.own = true;
		} else if ($scope.vehicle && $scope.vehicle.own == "no") {
			$scope.vehicle.own = false;
			$scope.vehicle.is_market = true;
		}

		//if ($rootScope._id) {
		//	$scope.vehicle._id = $rootScope._id;
			//console.log("ID value")
		//}
		//console.log($scope.vehicle._id);
		if ($scope.selecttName) {
			$scope.vehicle.veh_group_name = '';
			$scope.vehicle.veh_group_name = $scope.selecttName;
		} else if ($scope.vehicle.group_name && typeof $scope.vehicle.group_name == 'object') {
			$scope.vehicle.group_name = $scope.vehicle.group_name.name;
		}

		if ($scope.vehicle.veh_type) {
			$scope.vehicle.veh_type_name = $scope.vehicle.veh_type.name;
			$scope.vehicle.veh_type = $scope.vehicle.veh_type._id;
		} else if ($scope.vehicle.veh_type && typeof $scope.vehicle.veh_type == 'object') {
			$scope.vehicle.veh_type = $scope.vehicle.veh_type.name;
		}

		if ($scope.selectDriverName) {
			$scope.vehicle.driver_name = $scope.selectDriverName.name;
			$scope.vehicle.driver_license = $scope.selectDriverName.license_no;
			$scope.vehicle.driver = $scope.selectDriverName._id;
		} else if ($scope.vehicle.driver_name && typeof $scope.vehicle.driver_name == 'object') {
			$scope.vehicle.driver_name = $scope.vehicle.driver_name.name;
		}

		if ($scope.selectedVendor) {
			$scope.vehicle.vendor_name = $scope.selectedVendor.name;
			$scope.vehicle.vendor_id = $scope.selectedVendor._id;
		} else if ($scope.vehicle.vendor_name && typeof $scope.vehicle.vendor_name == 'object') {
			$scope.vehicle.vendor_name = $scope.vehicle.vendor_name.name;
		}

		//console.log('sel str', $scope.vehicle.structure);

		if($scope.vehicle.structure) {
			$scope.vehicle.structure_name = $scope.vehicle.structure.structure_name;
			delete $scope.vehicle.structure;
		}

		//if (!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)) {
			var toUpdate = angular.copy($scope.vehicle);
			Vehicle.updateVehicle(toUpdate, success, failure);
			console.log('Update Vehicle');
		/*} else {
			$scope.VUmsg = '';
			$scope.updateVehicleErrMsg = true;
			$scope.VUmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function () {
				if ($scope.updateVehicleErrMsg) {
					$scope.$apply(function () {
						$scope.updateVehicleErrMsg = false;
					});
				}
			}, 7000);
		}*/

	}

	if ($rootScope.vehicle && $rootScope.vehicle.own == true) {
		$rootScope.vehicle.own = 'yes';
	}else if($rootScope.vehicle && $rootScope.vehicle.own == false){
		$rootScope.vehicle.own = 'no';
	}
	$scope.onStatusChange=function(){
		$scope.vehicle.last_known=$scope.vehicle.last_known || {};
		$scope.vehicle.last_known.status=$scope.vehicle.status;
	}

	});

materialAdmin.controller("vehicleReadController",
	function ($rootScope, $scope, $interval, $modal, modelService,Vehicle, messageService, formValidationgrowlService) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = false;
	$scope.createVehicleErrMsg = false;
	$scope.selectedModelId = undefined;

	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
		} catch (e) {
			console.log('catch in vehicleController');
		}
	}, true);


	if ($scope.vehicle && $scope.vehicle.driver_name && typeof $scope.vehicle.driver_name == 'object') {
		$scope.vehicle.driver_name = $scope.vehicle.driver_name.name;
	}

	if ($scope.vehicle && $scope.vehicle.vendor_name && typeof $scope.vehicle.vendor_name == 'object') {
		$scope.vehicle.vendor_name = $scope.vehicle.vendor_name.name;
	}
});

materialAdmin.controller("vehicleRegisterController",
	function ($rootScope, $scope,
			  $interval, $modal, Vehicle, messageService, Vendor, formValidationgrowlService, structureMasterService,$localStorage) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = false;
	$scope.vehicleRegister = {};
	//$scope.vehicleRegister.own = true;
	$scope.aVendors = [];
	$scope.vehModels = [];
	$scope.aCatVehStructure = ['Horse', 'Truck','Trailer'];
	$scope.aOwners = ['B.K Tiwari', 'Gaurav','Jhalani', 'Manoj','Murtaza', 'N.P Shukla','Raj Singh', 'Rohit Ji','For Sale', 'HZL','Loni Fix', 'NAGPUR','NAGPUR-NCR', 'Proposed for Sale','Market','Mohit','VMST','om shree tpt Nagpur','ICD LONI(BASANT)','ICD LONI(N.P SHUKLA)','ICD LONI(ROHIT)'];

	$scope.showOwn = $localStorage.ft_data.client_config.clientId;
	$scope.vehicleRegister.is_market = false;
	$scope.vehicleRegister.own = "yes";
	//$scope.vehicleRegister.own = true;

	$scope.$watch(function() {
		return $scope.vehicleRegister.manufacturer;
	},function() {
		if ($scope.vehicleRegister.manufacturer) {
			$scope.vehModels = JSON.parse(angular.toJson($rootScope.vehModelMatrix[$scope.vehicleRegister.manufacturer]));
		}
	});

	$scope.geolocate = function (sUId) {
		googlePlaceAPI.geolocate(sUId);
	};

	var gAPI = new googlePlaceAPI($interval);
	gAPI.fight($scope, ['city']);

	function suc(response) {
		$rootScope.vehicleTypes = response.data.data;
	}

	function fail(response) {
		//console.log('failed',response);
	}

	Vehicle.getVehicleTypes(suc, fail);

	function success(response) {
		if (response && response.data && response.data.data) {
			$rootScope.vehicleGroups = response.data.data;
		}
	}

	function fail(res) {
		console.error("fail: ", res);
	}

	(function () {
		function successVendorList(res) {
			if (res.data.data) {
				$scope.aVendors = res.data.data;
			}
		}

		Vendor.getAllVendorsList({deleted: false}, successVendorList)
	})();
	Vehicle.getGroupVehicleType(success, fail);

	function sucDriver(response) {
		if (response && response.data && response.data.data) {
			$rootScope.Drivers = response.data.data;
		}
	}

	function failDriver(res) {
		console.error("fail: ", res);
	}

	Vehicle.getAllDrivers(sucDriver, failDriver);

	$scope.getGroupNames = function (selectType) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectType) {
			console.log(' Group & Vehicle');
			$scope.selecttName = selectType.name;
			//$scope.vehicleRegister.group_code = selectType.code;
			$scope.vehicleTypesL = selectType.vehicle_types;
			$scope.vehicleRegister.veh_group = selectType._id;
		}
	};

	$scope.getDriverMobile = function (selectDriver) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectDriver) {
			console.log(' Driver & Number');
			console.log(JSON.stringify(selectDriver));
			$scope.selectDriverName = selectDriver.name;
			$scope.vehicleRegister.driver_license = selectDriver.license_no;

			//$scope.vehicleRegister.group_code = selectType.code;
			if (selectDriver.prim_contact_no) {
				$scope.vehicleRegister.driver_contact_no = selectDriver.prim_contact_no;
			}
		}
	};
	$scope.getVendorMobile = function (thatVendor) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (thatVendor) {
			$scope.selectVendorName = thatVendor;
			//$scope.vehicleRegister.group_code = selectType.code;
			if (thatVendor.prim_contact_no) {
				$scope.vehicleRegister.vendor_mobile = thatVendor.prim_contact_no;
			}
		}
	};

	($scope.getAllStructureNames = function () {
		function success(response) {
			if (response.status.toLowerCase() === "ok" && response.data) {
				$scope.structuresObjArr = response.data;
			}
		}

		function failure(response) {
		}

		structureMasterService.getStructureMasters({}, success, failure);
	})();

	$scope.aMake_years = ['2016', '2015', '2014', '2013', '2012', '2011',
		'2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000','1999','1998','1997'
	,'1996','1995','1994','1993','1992','1991'];

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

	function successPost(response) {
		if (response && response.data && response.data.data) {
			$scope.vehicleRegister = {};
			$scope.city = '';
			$scope.states = '';
			$scope.countrys = '';
			$rootScope.vehicle.isNew = false;
			var tempVehicle = [response.data.data];
			$rootScope.vehicles = $rootScope.vehicles.concat(tempVehicle);
			$rootScope.vehicle = response.data.data;
			var msgg = response.data.message;
			swal("Registered", msgg, "success");
			var sUrl = "#!/masters/vehicle/vehicleprofile/";
			$rootScope.redirect(sUrl);
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
			setDefaultValues($scope.vehicle);
		} catch (e) {
			console.log('catch in vehicleController');
		}
	}, true);

	$scope.vehicleRegisterDetails = function (vform) {
		$scope.Vmsg = '';
		if ($scope.vehicleRegister && $scope.vehicleRegister.own == "yes") {
			$scope.vehicleRegister.own == true;
			$scope.vehicleRegister.is_market = false;
		} else if ($scope.vehicleRegister && $scope.vehicleRegister.own == "no") {
			$scope.vehicleRegister.own == false;
			$scope.vehicleRegister.is_market = true;
		}
		/*if (vform.$valid) {*/
			if ($scope.selecttName) {
				$scope.vehicleRegister.veh_group_name = '';
				$scope.vehicleRegister.veh_group_name = $scope.selecttName;
			}
			if ($scope.vehicleRegister.veh_type) {
				$scope.vehicleRegister.veh_type_name = $scope.vehicleRegister.veh_type.name;
				$scope.vehicleRegister.veh_type = $scope.vehicleRegister.veh_type._id;
			}
			if ($scope.selectDriverName) {
				$scope.vehicleRegister.driver_name = $scope.selectDriverName;
			}
			if ($scope.selectVendorName) {
				$scope.vehicleRegister.vendor_id = $scope.selectVendorName._id;
				$scope.vehicleRegister.vendor_name = $scope.selectVendorName.name;
			}

			if($scope.vehicleRegister.structure) {
				$scope.vehicleRegister.structure_name = $scope.vehicleRegister.structure.structure_name;
				delete $scope.vehicleRegister.structure;
			}

			$scope.vehicleRegister.model_id = $scope.selectedModelId;

			delete $scope.vehicleRegister.this_vendor;

			Vehicle.saveVehicle($scope.vehicleRegister, successPost, failure);
			console.log('Save Vehicle', JSON.stringify($scope.vehicleRegister));
		/*} else {
			$scope.Vmsg = '';
			$scope.createVehicleErrMsg = true;
			$scope.Vmsg = formValidationgrowlService.findError(vform.$error);
			setTimeout(function () {
				if ($scope.createVehicleErrMsg) {
					$scope.$apply(function () {
						$scope.createVehicleErrMsg = false;
					});
				}
			}, 7000);
		}*/
	}
});

materialAdmin.controller("vehicleIdentificationCtrl", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = true;
	$rootScope.vehicle;

	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
			setDefaultValues($scope.vehicle);
		} catch (e) {
			console.log('catch in vehicleController');
		}
	}, true);
});

materialAdmin.controller("vehicle_Document", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = true;
	$rootScope.vehicle;

	function success(response) {
		if (response && response.data && response.data.data) {
			$rootScope.vehicle = response.data.data;
			$scope.vehicle = response.data.data;
			//$rootScope._id = response.data.data._id;
			var msg = response.data.message;
			swal("Success", msg, "success");
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.upload_documents = function (form) {
		if(form.$valid) {
			var fd = new FormData();
			if($scope.vehicle_image){
				fd.append('vehicle_image', $scope.vehicle_image);
			}
			if($scope.permit_doc){
				fd.append('permit_doc', $scope.permit_doc);
			}
			if($scope.fitness_certificate_doc){
				fd.append('fitness_certificate_doc', $scope.fitness_certificate_doc);
			}
			if($scope.chassis_trace){
				fd.append('chassis_trace', $scope.chassis_trace);
			}
			if($scope.insurance_doc){
				fd.append('insurance_doc', $scope.insurance_doc);
			}
			if($scope.road_tax_doc){
				fd.append('road_tax_doc', $scope.road_tax_doc);
			}
			if($scope.rc_book_doc){
				fd.append('rc_book_doc', $scope.rc_book_doc);
			}
			data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id  = $rootScope.vehicle._id;
			Vehicle.updateVehicle(data, success, failure);
		}
	}
});

materialAdmin.controller("driverDocument", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = true;
	$rootScope.vehicle;

	$scope.$watch(function () {
		return $rootScope.vehicle;
	}, function () {
		try {
			$scope.vehicle = $rootScope.vehicle;
			setDefaultValues($scope.vehicle);
		} catch (e) {
			console.log('catch in vehicleController');
		}
	}, true);
});

materialAdmin.controller("vehicleGTController", function ($rootScope, $scope, $interval, $modal,  Vehicle, messageService, formValidationgrowlService,
$uibModal, growlService) {

	// $scope.getGroup = getGroup;
	// $scope.getType = getType;

    (function init(){
		$scope.oFilter = {};
		// getGroup();
		// getType();

	})();

	function prepareFilter(){
       let myFilter ={};

	   if($scope.oFilter.name)
	myFilter.name = $scope.oFilter.name;

	return myFilter;
	}


	// function getGroup(){

	// 	let request = prepareFilter();

		Vehicle.getGroup(success, fail);

		function success(response) {
			if (response && response.data && response.data.data) {
				$rootScope.vehicleGroup = response.data.data;
				setTimeout(function () {
					// show 1st row as selected row by default
					$scope.vehicleGroup[0] && $scope.onClickGtGroup($scope.vehicleGroup[0], 0);
				});
			}

		}

		function fail(res) {
			console.error("fail: ", res);
		}
	// }



	function succT(response) {
		if (response && response.data && response.data.data) {
			$rootScope.vehicleType = response.data.data;
			setTimeout(function () {
				// show 1st row as selected row by default
				$scope.vehicleType[0] && $scope.onClickGtType($scope.vehicleType[0], 0);
			});
		}

	}

	function failT(res) {
		console.error("fail: ", res);
	}

	$scope.onClickGtGroup = function(value, index){
		$scope.selectGtGroup = value;
		$scope.groupGtIndex = index;
	}


	$scope.onClickGtType = function(value, index){
	  $scope.selectGtType = value;
	  $scope.typeGtIndex = index;
	}


	Vehicle.getAllType(succT, failT);

	$scope.addVehicleGroup = function () {
		$scope.openModal('views/vehicle/createGroup.html');
	};

	$scope.addVehicleType = function () {
		$scope.openModal('views/vehicle/createVehicleType.html');
	};



	function delSuc(response) {
		if (response && response.data.message) {
			growlService.growl(response.data.message, "success");
		}
	}

	function delFail(response) {
		//console.error("fail: ",res);
		if (response && response.data && response.data.error_message) {
			growlService.growl(response.data.error_message, "danger");
		}
	}

	$scope.deleteVehicleGroup = function (VehicleGroup, $index) {
		var data = {};
		data.id = VehicleGroup._id;
		Vehicle.deleteVehicleGroup(data, delSuc, delFail);
	};

	$scope.editVehicleGroup = function (vehicleG, $index) {
		$rootScope.vehicleGRP = vehicleG;
		$scope.openModal('views/vehicle/editGroup.html');
	};

	$scope.editVehicleType = function (vehicleT, $index) {
		$rootScope.vehicleTYE = vehicleT;
		$scope.openModal('views/vehicle/editVehicleType.html');
	};
});


materialAdmin.controller("vehicleGroupController", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService, formValidationgrowlService) {
	$rootScope.hideThis = false;
	$scope.group = {};

	function successPost(response) {
		if (response && response.data && response.data.data) {
			$scope.VGmsg = '';
			$scope.group = {};
			$scope.closeModal();
			//$rootScope.vehicle.isNew = false;
			var tempvehicleGroup = [response.data.data];
			$rootScope.vehicleGroup = $rootScope.vehicleGroup.concat(tempvehicleGroup);
			//$rootScope.vehicleGroup = response.data.data;
			var msgg = response.data.message;
			swal("Registered", msgg, "success");
			var sUrl = "#!/masters/vehicleGT";
			$rootScope.redirect(sUrl);
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.vGroupErrormsg = false;
	$scope.groupRegisterDetails = function (form) {
		$scope.VGmsg = '';
		if (form.$valid) {
			Vehicle.saveGroup($scope.group, successPost, failure);
			console.log('Add Vehicle Group');
		} else {
			$scope.VGmsg = '';
			$scope.vGroupErrormsg = true;
			$scope.VGmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function () {
				if ($scope.vGroupErrormsg) {
					$scope.$apply(function () {
						$scope.vGroupErrormsg = false;
					});
				}
			}, 7000);
		}
	//}
		/*else if(form.$error && form.$error.required){
		 for(i=0;i<form.$error.required.length;i++){
		 if(form.$error.required[i].$name){
		 $scope.VGmsg = $scope.VGmsg+" "+form.$error.required[i].$name + " ,";
		 }
		 }
		 if($scope.VGmsg){
		 $scope.VGmsg = $scope.VGmsg.substring(0, $scope.VGmsg.length - 1);
		 $scope.VGmsg = $scope.VGmsg + ' are require.';
		 $scope.vGroupErrormsg = true;
		 setTimeout(function(){
		 if($scope.vGroupErrormsg){
		 $scope.$apply(function() {
		 $scope.vGroupErrormsg = false;
		 });
		 }
		 }, 7000);
		 }
		 }*/
		/*if($scope.group.name && $scope.group.code){
		 $scope.VGmsg1 = $scope.VGmsg2 = '';
		 Vehicle.saveGroup($scope.group, successPost,failure);
		 console.log('Add Vehicle Group');
		 }
		 else {
		 if(!($scope.group.name)){
		 $scope.VGmsg1 = 'Please Enter Group Name';
		 } else if(!($scope.group.code)){
		 $scope.VGmsg1 = '';
		 $scope.VGmsg2 = 'Please Enter Group code';
		 }
		 }*/
	}
});

materialAdmin.controller("AddvehicleTypeController", function (
	$rootScope,
	$scope,
	$interval,
	$modal,
	Vehicle,
	messageService,
	materialService,
	formValidationgrowlService
) {
	//$("p").text("Vehicle");
	$rootScope.hideThis = false;
	$scope.vType = {};
	$scope.cVehicleErrMsg = false;

	$scope.onChangeMaterialType = onChangeMaterialType;
	$scope.aMaterialAllowed = [];

	$scope.appendMaterial = function () {
		$scope.aMaterialAllowed.push({
			material_type: undefined,
			units: 0,
			weight: 0
		});
		onChangeMaterialType();
	};

	(function init() {
		getMaterial();
	})();

	function success(response) {
		if (response && response.data && response.data.data) {
			$rootScope.vehicleGroup = response.data.data;
		}
	}

	function fail(res) {
		console.error("fail: ", res);
	}

	Vehicle.getallGroup(success, fail);

	function successPost(response) {
		if (response && response.data && response.data.data) {
			$scope.vType = {};
			$scope.closeModal();
			//$rootScope.vehicle.isNew = false;
			var tempvType = [response.data.data];
			$rootScope.vehicleType = $rootScope.vehicleType.concat(tempvType);
			//$rootScope.vType = response.data.data;
			var msgg = response.data.message;
			swal("Registered", msgg, "success");
			var sUrl = "#!/masters/vehicleGT";
			$rootScope.redirect(sUrl);
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.vTypeDetails = function (form) {
		$scope.VTmsg = '';
		if ($scope.selectName) {
			$scope.vType.group_name = {};
			$scope.vType.group_name = $scope.selectName;
		}
		if (form.$valid) {
			$scope.vType.materialAllowed = $scope.aMaterialAllowed;
			Vehicle.saveVehicleType($scope.vType, successPost, failure);
			console.log('Add Vehicle Type');
		} else {
			$scope.VTmsg = '';
			$scope.cVehicleErrMsg = true;
			$scope.VTmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function () {
				if ($scope.cVehicleErrMsg) {
					$scope.$apply(function () {
						$scope.cVehicleErrMsg = false;
					});
				}
			}, 7000);
		}
	};

	$scope.getGroupName = function (selectType) {
		//Vehicle.saveVehicleType($scope.vType, successPost,failure);
		if (selectType) {
			console.log(' Group');
			$scope.selectName = selectType.name;
			$scope.vType.group_code = selectType.code;
			//$scope.vType.group_name = selectType.name;
			$scope.vType.group = selectType._id;
		}
	};

	function getMaterial() {
		function succGetMaterials(response){
			console.log(response.data);
			if(response.data && response.data.length>0){
				$scope.aMaterialType = response.data;
			}
		}
		function failGetMaterials(response){
			console.log(response);
		}
		//var clientId = $localStorage.ft_data.userLoggedIn.clientId;
		materialService.getMaterialTypes({all: true},succGetMaterials,failGetMaterials);
	}

	function onChangeMaterialType() {

		if($scope.aMaterialType.length <= 0)
			return;

		$scope.aMaterialAllowed.map((obj, index, arr) => {
			let temp = obj.material_type;
			obj.aMaterialType = $scope.aMaterialType.filter(obj1 => {
				if(temp === obj1._id)
					return true;
				return arr.findIndex(obj2 => obj2.material_type === obj1._id) === -1 ? true : false;
			});
		});
	}
});

materialAdmin.controller("vehicleGTEditController", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService, formValidationgrowlService,
															  $uibModal, growlService) {
	$rootScope.vehicleGRP;

	function successPost(response) {
		if (response && response.data && response.data.message) {
			$scope.VGmsg = '';
			$scope.closeModal();
			var msgg = response.data.message;
			swal("Registered", msgg, "success");
			var sUrl = "#!/masters/vehicleGT";
			$rootScope.redirect(sUrl);
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.groupEditDetails = function (form) {
		$scope.VGmsg = '';
		if ($scope.vehicleGRP && $scope.vehicleGRP._id) {
			$scope.VGTID = $scope.vehicleGRP._id
		}
		if (form.$valid) {
			if ($scope.vehicleGRP._id) {
				Vehicle.editGroup($scope.vehicleGRP, successPost, failure);
			} else {
				$scope.closeModal();
			}

		} else {
			$scope.VGmsg = '';
			$scope.vGroupErrormsg = true;
			$scope.VGmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function () {
				if ($scope.vGroupErrormsg) {
					$scope.$apply(function () {
						$scope.vGroupErrormsg = false;
					});
				}
			}, 7000);
		}
	};
});

materialAdmin.controller("EditvehicleTypeController", function ($rootScope, $scope, $interval, $modal, Vehicle, messageService, formValidationgrowlService,
																$uibModal, growlService, materialService) {
	$rootScope.vehicleTYE;

	$scope.onChangeMaterialType = onChangeMaterialType;

	$scope.appendMaterial = function () {
		$scope.vehicleTYE.materialAllowed = $scope.vehicleTYE.materialAllowed || [];
		$scope.vehicleTYE.materialAllowed.push({
			material_type: undefined,
			units: 0,
			weight: 0
		});
		onChangeMaterialType();
	};

	(function init() {
		getMaterial();
	})();

	function successPost(response) {
		if (response && response.data && response.data.message) {
			$rootScope.vehicleTYE = response.data.data;
			//$rootScope.vehicleTYE._id = $rootScope.vehicleID;
			$scope.closeModal();
			var msgg = response.data.message;
			swal("Registered", msgg, "success");
			var sUrl = "#!/masters/vehicleGT";
			$rootScope.redirect(sUrl);
		}
	}

	function failure(res) {
		console.error("fail: ", res);
	}

	$scope.editVehicleTypeDetails = function (forms) {
		$scope.VTmsg = '';
		/*if(!($scope.vehicleTYE._id)){
		 $scope.vehicleTYE._id = $rootScope.vehicleID;
		 }*/
		if (forms.$valid) {
			if ($scope.vehicleTYE._id) {
				Vehicle.editType($scope.vehicleTYE, successPost, failure);
			} else {
				$scope.closeModal();
				var sUrl = "#!/masters/vehicleGT";
				$rootScope.redirect(sUrl);
			}

		} else {
			$scope.VTmsg = '';
			$scope.vTypeErrormsg = true;
			$scope.VTmsg = formValidationgrowlService.findError(forms.$error);
			setTimeout(function () {
				if ($scope.vTypeErrormsg) {
					$scope.$apply(function () {
						$scope.vTypeErrormsg = false;
					});
				}
			}, 7000);
		}
	}

	function getMaterial() {
		function succGetMaterials(response){
			console.log(response.data);
			if(response.data && response.data.length>0){
				$scope.aMaterialType = response.data;
				onChangeMaterialType();
			}
		}
		function failGetMaterials(response){
			console.log(response);
		}
		//var clientId = $localStorage.ft_data.userLoggedIn.clientId;
		materialService.getMaterialTypes({all: true},succGetMaterials,failGetMaterials);
	}

	function onChangeMaterialType() {

		if($scope.aMaterialType.length <= 0)
			return;

		$scope.vehicleTYE.materialAllowed.map((obj, index, arr) => {
			let temp = obj.material_type;
			obj.aMaterialType = $scope.aMaterialType.filter(obj1 => {
				if(temp === obj1._id)
					return true;
				return arr.findIndex(obj2 => obj2.material_type === obj1._id) === -1 ? true : false;
			});
		});
	}
});
