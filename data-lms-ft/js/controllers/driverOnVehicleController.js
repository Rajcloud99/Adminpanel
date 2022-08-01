materialAdmin
	.controller("driverOnVehicleController", driverOnVehicleController)
	// .controller("addDriverOnVehicleController", addDriverOnVehicleController);

driverOnVehicleController.$inject = [
	'$rootScope',
	'$state',
	'$scope',
	'$timeout',
	'$localStorage',
	'growlService',
	'structureMasterService',
	'$uibModal',
	'driverOnVehicleService',
	'trailerMasterService',
	'Driver',
	'Vehicle',
	'DatePicker',
	'Pagination'
];

function driverOnVehicleController(
	$rootScope,
	$state,
	$scope,
	$timeout,
	$localStorage,
	growlService,
	structureMasterService,
	$uibModal,
	driverOnVehicleService,
	trailerMasterService,
	Driver,
	Vehicle,
	DatePicker,
	Pagination) {

	let vm = this;

	vm.driverOnVehicle = [];
	vm.regVehicles = [];
	vm.regDrivers = [];
	vm.selecteddriverOnVehicle = {};
	vm.indexSelectedFromList = 0;
	vm.currentMode = "view";
	vm.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.pagination = angular.copy(Pagination); // initialize pagination
	vm.pagination.currentPage = 1;
	vm.pagination.maxSize = 3;
	vm.pagination.itemsPerPage = 10;
	vm.searchValue = "";
	vm.totalPages = 0;
	vm.totalItems = 0;
	vm.selectedStructure = {};
	vm.aCategory = ["Associated", "Disassociated"];
	// functions Identifiers
	vm.getDriver = getDriver;
	vm.getVehicle = getVehicle;
	vm.getAlldriverOnVehicle = getAlldriverOnVehicle;
	vm.downloadPMT = downloadPMT;
	vm.selectdriverOnVehicleAtIndex = selectdriverOnVehicleAtIndex;
	vm.associateOrDisassociate = associateOrDisassociate;
	vm.upsertAssistantDriver = upsertAssistantDriver;
	vm.backdateEntry = backdateEntry;
	vm.updateDriverOnVehicle = updateDriverOnVehicle;
	vm.onSelect = onSelect;
	vm.onSelectDriver = onSelectDriver;
	// vm.dateChange = dateChange;
	vm.downloadDAReport = downloadDAReport;
	vm.DatePicker = angular.copy(DatePicker);


	//init
	(function init() {
		getAlldriverOnVehicle();

	})();

	function getAlldriverOnVehicle(reset) {
		vm.driverOnVehicle = [];
		vm.selecteddriverOnVehicle = {};
		if (reset) {
			vm.indexSelectedFromList = 0;
		}

		function success(response) {
			//console.log(data);
			response = response.data;
			vm.driverOnVehicle = response.data;
			vm.pagination.total_pages = response.count / vm.pagination.items_per_page;
			vm.pagination.totalItems = response.count;
			vm.selectdriverOnVehicleAtIndex(vm.indexSelectedFromList);

		}

		function failure(response) {
			console.log(response);
		}

		driverOnVehicleService.getdriverOnVehicle(prepareFilterObject(), success, failure);
	}

	function getAllRegVehicles() {
		function success(response) {
			if (response && response.data) {
				vm.regVehicles = response.data;
			}
		}

		Vehicle.getAllVehicles({all: "true"}, success); //get category = Horse and own vehicle
	}

	function downloadDAReport(download) {
		var oFilter = prepareFilterObject();
		oFilter.download = true;
		oFilter.skip = false;
		lastGRFilter = oFilter;
		driverOnVehicleService.driverVehicleAssc(oFilter, function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}

	function getAllDrivers() {
		function success(response) {
			vm.regDrivers = response.data;
		}

		Driver.getAllDrivers({all: "true"}, success);
	}

	// function getDriver(viewValue) {
	// 	//if (viewValue && viewValue.toString().length > 1) {
	// 		Driver.getName(viewValue, res => vm.aDriver = res.data.data, err => console.log`${err}`);
	// 	//}
	// }

	function getDriver(viewValue) {
		// if ((viewValue + '').length < 2)
		// 	return;
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				vm.aDriver = response.data.data;
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}

			Driver.getName(viewValue, oSuc, oFail);
		});
	};

	// function getVehicle(viewValue) {
	// 	if (viewValue && viewValue.toString().length > 0) {
	// 		Vehicle.getNameTrim(viewValue, res => vm.aVehicle = res.data.data, err => console.log`${err}`);
	// 		vm.aVehicle=res.data.data;
	// 	}
	//
	// }


	function getVehicle(viewValue) {
		// if ((viewValue + '').length < 2)
		// 	return;
		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				vm.aVehicle = response.data.data;
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		});
	};




	function onSelectDriver($item, $model, $label) {
		getAlldriverOnVehicle();
	}

	function onSelect($item, $model, $label) {
		getAlldriverOnVehicle();
	}

	function downloadPMT() {
		if (vm.driverOnVehicle && vm.driverOnVehicle.length > 0) {
			driverOnVehicleService.getdriverOnVehicle({download: true}, function (data) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			});
		} else {
			swal("warning", "Data not available.", "warning")
		}
	}

	function prepareFilterObject() {
		var myFilter = {};
		if (vm.currentPage) {
			myFilter.skip = vm.currentPage;
		}
		if (vm.vehicle) {
			myFilter.vehicle = vm.vehicle._id;
		}
		if (vm.driver) {
			myFilter.driver = vm.driver._id;
		}
		if (vm.driver2) {
			myFilter.driver2 = vm.driver2._id;
		}
		if ((vm.status == "Associated") || (vm.status == "Disassociated")) {
			myFilter.disassociated = vm.status == "Disassociated" ? true : false;
		}
		if (vm.start_date) {
			myFilter.from = vm.start_date.toISOString();
		}
		if (vm.end_date) {
			myFilter.to = vm.end_date.toISOString();
			// myFilter.to = vm.end_date;
		}

		myFilter.sort = -1;
		if (vm.sortBy && vm.sortBy === 'Assending') {
			myFilter.sort = 1;
		}

		myFilter.skip = vm.pagination.currentPage;
		myFilter.no_of_docs = vm.pagination.items_per_page;
		return myFilter;
	};

	function selectdriverOnVehicleAtIndex(index) {
		vm.selecteddriverOnVehicle = angular.copy(vm.driverOnVehicle[index]);
		vm.indexSelectedFromList = index;
		vm.currentMode = "view";
		setTimeout(function () {
			var listItem = $($('.lv-item')[index]);
			listItem.siblings().removeClass('grn');
			listItem.addClass('grn');
		}, 0);
	};


	function associateOrDisassociate(disassociate) {
		var modalInstance = $uibModal.open({
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
					return false;
				},
				otherData: function() {
					return {
						objdriverOnVehicle: disassociate,
						regVehicles: vm.regVehicles,
						regDrivers: vm.regDrivers,
					};
				},
				fromSettlement: function () {
					return false;
				},
			}

		});

		modalInstance.result.then(function (data) {
				if (data) {
					vm.driverOnVehicle.push(data);
					swal("success!", data.message, "success")

				}
				$state.reload();
			}, function (data) {
				if (data != 'cancel') {
					if (data && data.message) {
						swal("Oops!", data.message, "error")
					}
				}
			}
		);
	}

	function upsertAssistantDriver(disassociate) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/driverOnVehicle/upsertAssistantDriver.html',
			controller: [
				'$uibModalInstance',
				'callback',
				'otherUtils',
				'Driver',
				'Vehicle',
				'DatePicker',
				'driverOnVehicleService',
				'otherData',
				upsertAssistantDriverController
			],
			controllerAs: 'vm',
			resolve: {
				callback: function(){
					return false;
				},
				otherData: function() {
					return {
						objdriverOnVehicle: disassociate,
						regVehicles: vm.regVehicles,
						regDrivers: vm.regDrivers,
					};
				},
				fromSettlement: function () {
					return false;
				},
			}

		});

		modalInstance.result.then(function (data) {
				if (data) {
					vm.driverOnVehicle.push(data);
					swal("success!", data.message, "success")

				}
				$state.reload();
			}, function (data) {
				if (data != 'cancel') {
					if (data && data.message) {
						swal("Oops!", data.message, "error")
					}
				}
			}
		);
	}

	function updateDriverOnVehicle(selecteddriverOnVehicle) {
		if(!selecteddriverOnVehicle)
			return;

		var modalInstance = $uibModal.open({
			templateUrl: 'views/driverOnVehicle/updateDriverOnVehiclePopup.html',
			controller: [
				'$uibModalInstance',
				'callback',
				'otherUtils',
				'Driver',
				'Vehicle',
				'DatePicker',
				'driverOnVehicleService',
				'otherData',
				updateDriverOnVehicleController
			],
			controllerAs: 'vm',
			resolve: {
				callback: function(){
					return false;
				},
				otherData: function() {
					return {
						selecteddriverOnVehicle: selecteddriverOnVehicle,
					};
				},
				fromSettlement: function () {
					return false;
				},
			}

		});

		modalInstance.result.then(function (data) {
				if (data) {
					vm.driverOnVehicle.push(data);
					swal("success!", data.message, "success")

				}
				$state.reload();
			}, function (data) {
				if (data != 'cancel') {
					if (data && data.message) {
						swal("Oops!", data.message, "error")
					}
				}
			}
		);
	}
	///////////////// ************BackDate Entry for Driver*********** /////////////////////

	function backdateEntry() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/driverOnVehicle/BackdateEntryforDriverOnVehiclePopup.html',
			controller: [
				'$uibModalInstance',
				'callback',
				'Driver',
				'Vehicle',
				'DatePicker',
				'driverOnVehicleService',
				addBackDateEntryController
			],
			controllerAs: 'vm',
			resolve: {
				callback: function () {
					return false;
				}
			}

		});
	}

}

function addDriverOnVehicleController(
	$uibModalInstance,
	callback,
	otherUtils,
	Driver,
	Vehicle,
	DatePicker,
	driverOnVehicleService,
	otherData,
	fromSettlement
) {

	let vm = this;

	vm.fromSettlement = fromSettlement;
	vm.objdriverOnVehicle = otherData.objdriverOnVehicle;
	vm.assDate = (otherData.objdriverOnVehicle && otherData.objdriverOnVehicle.ass_date) ? new Date(otherData.objdriverOnVehicle.ass_date) : new Date();
	let cloneDate = new Date(vm.assDate.valueOf());
	vm.minDate = new Date(cloneDate.setDate(cloneDate.getDate() + 1));
	vm.fromPage = otherData.fromPage || false;
	vm.regVehicles = otherData.regVehicles;
	vm.regDrivers = otherData.regDrivers;
	vm.selectedVehicle = otherData.vehicle || false;
	vm.save = save;
	vm.closeModal = closeModal;
	vm.getDriver = getDriver;
	vm.getVehicle = getVehicle;
	vm.DatePicker = angular.copy(DatePicker);

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				Driver.getName(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

			});
		}

		return [];
	}

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

	vm.aHours = [];
	vm.aMinutes = [];

	for (let h = 0; h < 24; h++)
		vm.aHours.push(h);

	for (let m = 0; m < 60; m++)
		vm.aMinutes.push(m);

	vm.hourSel1 = new Date().getHours();
	vm.minuteSel1 = new Date().getMinutes();

	if (otherUtils.isEmptyObject(vm.objdriverOnVehicle)) {
		vm.objdriverOnVehicle = {};
		vm.objdriverOnVehicle.ass_date = new Date();
		vm.currentMode = "Associate";
	} else {
		vm.currentMode = "Disassociate";
		vm.objdriverOnVehicle.disass_date = new Date();
		vm.objdriverOnVehicle.disassociated = true;
	}


	function closeModal() {
		$uibModalInstance.dismiss('cancel');
		vm.objdriverOnVehicle.disassociated = false
	}

	function save() {

		if(typeof callback === "function"){
			callback(parseBeforeSave())
				.then(function (res) {
					$uibModalInstance.close(res);
				});
			return;
		}

		function success(res) {
			if (res && res.data && (res.status == "OK")) {
				$uibModalInstance.close(res);
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			if (res && res.message) {
				swal("Oops!", res.message, "error")
			}
			//$uibModalInstance.dismiss(res);
		}

		function parseBeforeSave() {
			if (vm.currentMode === "Associate") {
			let date = new Date(new Date(vm.objdriverOnVehicle.ass_date).setHours(vm.hourSel1, vm.minuteSel1));
			vm.objdriverOnVehicle.ass_date=date.toISOString();
				return vm.objdriverOnVehicle;

			}else if (vm.currentMode === "Disassociate") {
				let date = new Date(new Date(vm.objdriverOnVehicle.disass_date).setHours(vm.hourSel1, vm.minuteSel1));
				vm.objdriverOnVehicle.disass_date=date.toISOString();
				return vm.objdriverOnVehicle;
			}


		}

		if (vm.currentMode === "Associate") {
			driverOnVehicleService
				.associatedriverOnVehicle(parseBeforeSave(), success
					, failure);
		} else if (vm.currentMode === "Disassociate") {
			driverOnVehicleService.disassociatedriverOnVehicle
			(vm.objdriverOnVehicle._id, parseBeforeSave(),
				success, failure);
		}
	}


}

	function upsertAssistantDriverController(
		$uibModalInstance,
		callback,
		otherUtils,
		Driver,
		Vehicle,
		DatePicker,
		driverOnVehicleService,
		otherData,
		fromSettlement
	) {

		let vm = this;

		vm.fromSettlement = fromSettlement;
		vm.objdriverOnVehicle = otherData.objdriverOnVehicle;
		vm.fromPage = otherData.fromPage || false;
		vm.regVehicles = otherData.regVehicles;
		vm.regDrivers = otherData.regDrivers;
		vm.selectedVehicle = otherData.vehicle || false;
		vm.save = save;
		vm.closeModal = closeModal;
		vm.getDriver = getDriver;
		vm.getVehicle = getVehicle;
		vm.DatePicker = angular.copy(DatePicker);

		function getDriver(viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {

					Driver.getName(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}

			return [];
		}

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

		vm.aHours = [];
		vm.aMinutes = [];

		for (let h = 0; h < 24; h++)
			vm.aHours.push(h);

		for (let m = 0; m < 60; m++)
			vm.aMinutes.push(m);

		vm.hourSel1 = new Date().getHours();
		vm.minuteSel1 = new Date().getMinutes();

		if (otherUtils.isEmptyObject(vm.objdriverOnVehicle)) {
			vm.objdriverOnVehicle = {};
			vm.objdriverOnVehicle.ass_date = new Date();
			vm.currentMode = "Associate";
		} else {
			vm.currentMode = "Disassociate";
			vm.objdriverOnVehicle.disass_date = new Date();
			vm.objdriverOnVehicle.disassociated = true;
		}


		function closeModal() {
			$uibModalInstance.dismiss('cancel');
			vm.objdriverOnVehicle.disassociated = false
		}

		function save() {

			if(typeof callback === "function"){
				callback(parseBeforeSave())
					.then(function (res) {
						$uibModalInstance.close(res);
					});
				return;
			}

			function success(res) {
				if (res && res.data && (res.status == "OK")) {
					$uibModalInstance.close(res);
				} else {
					$uibModalInstance.dismiss(res);
				}
			}

			function failure(res) {
				if (res && res.message) {
					swal("Oops!", res.message, "error")
				}
				//$uibModalInstance.dismiss(res);
			}

			function parseBeforeSave() {
				if (vm.currentMode === "Associate") {
					let date = new Date(new Date(vm.objdriverOnVehicle.ass_date).setHours(vm.hourSel1, vm.minuteSel1));
					vm.objdriverOnVehicle.ass_date=date.toISOString();
					return vm.objdriverOnVehicle;

				}else if (vm.currentMode === "Disassociate") {
					let date = new Date(new Date(vm.objdriverOnVehicle.disass_date).setHours(vm.hourSel1, vm.minuteSel1));
					vm.objdriverOnVehicle.disass_date=date.toISOString();
					return vm.objdriverOnVehicle;
				}


			}

			if (vm.currentMode === "Associate") {
				driverOnVehicleService
					.assistantAssociate(parseBeforeSave(), success
						, failure);
			} else if (vm.currentMode === "Disassociate") {
				driverOnVehicleService.assistantDisassociate
				(vm.objdriverOnVehicle._id, parseBeforeSave(),
					success, failure);
			}
		}


	}

function updateDriverOnVehicleController(
	$uibModalInstance,
	callback,
	otherUtils,
	Driver,
	Vehicle,
	DatePicker,
	driverOnVehicleService,
	otherData,
	fromSettlement
) {

	let vm = this;

	vm.fromSettlement = fromSettlement;
	vm.objdriverOnVehicle = otherData.selecteddriverOnVehicle;
	vm.currentMode = "Edit";

	vm.save = save;
	vm.closeModal = closeModal;
	vm.getDriver = getDriver;
	vm.getVehicle = getVehicle;
	vm.DatePicker = angular.copy(DatePicker);


	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				Driver.getName(viewValue, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

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

	function closeModal() {
		$uibModalInstance.dismiss('cancel');
		vm.objdriverOnVehicle.disassociated = false
	}

	function save() {

		if(typeof callback === "function"){
			callback(parseBeforeSave())
				.then(function (res) {
					$uibModalInstance.close(res);
				});
			return;
		}

		function success(res) {
			if (res && res.data && (res.status == "OK")) {
				$uibModalInstance.close(res);
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			if (res && res.message) {
				swal("Oops!", res.message, "error")
			}
			//$uibModalInstance.dismiss(res);
		}

		function parseBeforeSave() {
			return vm.objdriverOnVehicle;
		}

		if (vm.currentMode === "Edit") {
			driverOnVehicleService.updateDriverOnVehicle
			(vm.objdriverOnVehicle._id, parseBeforeSave(),
				success, failure);
		}
	}


}


function addBackDateEntryController(
	$uibModalInstance,
	callback,
	Driver,
	Vehicle,
	DatePicker,
	driverOnVehicleService,

) {

	let vm = this;
	vm.objbackdateDriver = {};
	vm.save = save;
	vm.closeModal = closeModal;
	vm.getDriver = getDriver;
	vm.getVehicle = getVehicle;
	vm.DatePicker = angular.copy(DatePicker);

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				Driver.getName(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

			});
		}

		return [];
	}

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

	vm.aHours = [];
	vm.aMinutes = [];

	for (let h = 0; h < 24; h++)
		vm.aHours.push(h);

	for (let m = 0; m < 60; m++)
		vm.aMinutes.push(m);

	function closeModal() {
		$uibModalInstance.dismiss('cancel');
	}

	function save() {
        if(!vm.objbackdateDriver.vehicle){
			 return swal("warning", "vehicle is  mandatory.", "warning");
		   }
		if(!(vm.objbackdateDriver.driver && vm.objbackdateDriver.driver.name)){
			 return swal("warning", "driver is mandatory.", "warning");
	        }
	   if(!vm.objbackdateDriver.ass_date){
		      return swal("warning", "association date is mandatory.", "warning");
            }
       if(!vm.objbackdateDriver.disass_date){
	           return swal("warning", "disassociation date is mandatory.", "warning");
           }

		function success(res) {
			if (res && res.data && (res.status == "OK")) {
				swal("success!", res.message, "success");
				$uibModalInstance.close(res);
			} else {
				swal("error", res.message, "error");
				// $uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			if (res && res.message) {
				swal("Oops!", res.message, "error")
			}
			//$uibModalInstance.dismiss(res);
		}
		let ass_date = new Date(new Date(vm.objbackdateDriver.ass_date).setHours(vm.hourSel1, vm.minuteSel1));
		vm.objbackdateDriver.ass_date = ass_date.toISOString();
		let disass_date = new Date(new Date(vm.objbackdateDriver.disass_date).setHours(vm.hourSel11, vm.minuteSel11));
		vm.objbackdateDriver.disass_date = disass_date.toISOString();


			driverOnVehicleService.backdateEntry({
			vehicle: vm.objbackdateDriver.vehicle._id,
			driver: vm.objbackdateDriver.driver._id,
			ass_date: vm.objbackdateDriver.ass_date,
			disass_date: vm.objbackdateDriver.disass_date,
			ass_remark: vm.objbackdateDriver.ass_remark,
			ass_veh_odo: vm.objbackdateDriver.ass_veh_odo,
			disass_remark: vm.objbackdateDriver.disass_remark,
			disass_veh_odo: vm.objbackdateDriver.disass_veh_odo,
			},success, failure);

		}
	}


