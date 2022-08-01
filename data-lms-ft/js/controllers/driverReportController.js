materialAdmin.controller("driverReportController", function(
	$scope,
	$state,
	$uibModal,
	DatePicker,
	DateUtils,
	Driver,
	lazyLoadFactory,
	ReportService,
	tripServices,
	Vehicle,
	Vendor,
	branchService
) {

	let vm  = this;

	vm.getAllReport = getAllReport;
    vm.dateChange = dateChange;
    vm.getAllDriver = getAllDriver;
    vm.onDriverSelect = onDriverSelect;
    vm.removeDriver = removeDriver;
    vm.getVehicle = getVehicle;
    vm.getVendorName = getVendorName;
    vm.getAllBranch = getAllBranch;


	(function init(){
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory();
		vm.aDriverType =['Driver Performance','Driver Trip Account','Driver Payment Report'];
		vm.driverReport = 'Driver Performance';
		vm.oFilter = {};
		vm.columnSetting = {};
		vm.CONFIGS = $scope.$constants.aReportTypeConfig;

	})();

	function getAllDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					deleted: false,
				};

				Driver.getAllDrivers(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getAllBranch(viewValue, category) {
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


	function getVehicle (viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			Vehicle.getNameTrim(viewValue, function (res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
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

	function onDriverSelect(item) {
		vm.aDriver = vm.aDriver || [];
		if(vm.aDriver.length <10)
		   vm.aDriver.push(item);
		else
			return swal('Warning', 'you can not select more then 10 driver!!!!!', 'warning');
		vm.oFilter.driver = '';
	}
	function removeDriver(select, index){
		vm.aDriver.splice(index, 1);
	}


	function dateChange(dateType) {

		if (dateType === 'from' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.to instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange === 6)
				isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange < 6)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.from);
				vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 6));
			}

		} else if (dateType === 'to' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.from instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

			if (monthRange === 0)
				isNotValid = dateRange < 0;
			else if (monthRange === 1)
				isNotValid = monthRange < 0 ? true : false;
			else if (monthRange === 6)
				isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
			else if (monthRange < 6)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.to);
				vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 6));
			}
		}
	}



	function getAllReport(isGetActive, download = true) {

		let oFilter = prepareFilter(download);
		if(vm.driverReport) {
			if(oFilter.from && oFilter.to) {
				if(oFilter.to < oFilter.from) {
					return swal('Warning','From date can not greater than to date','warning');
				}
			}
		}
		if(vm.driverReport != 'Driver Payment Report') {
			// if (!(oFilter.driver && oFilter.driver.length))
			// 	return swal('Warning', 'please select driver!!!!!', 'warning');

			if(!(oFilter.from && oFilter.to))
				return swal('Warning', 'Please select from and to', 'warning');

			let allowedMonth = 12;
			// if(oFilter.driver.length == 1)
			// 	allowedMonth = 24;

			if(moment(oFilter.from).add(allowedMonth, 'month').isBefore(moment(oFilter.to)))
				return swal('Warning', `Only ${allowedMonth} month range allowed`, 'warning');

		} else {
			if(!oFilter.from && !oFilter.to){
				return swal('Warning', 'Please select from and to date', 'warning');
			}
		}

		if (vm.driverReport === 'Driver Performance') {
			oFilter.dateType = 'markSettle.date';
			ReportService.getDrverPerfReport(oFilter, success);
		} else if(vm.driverReport === 'Driver Trip Account'){
			ReportService.getDrverAccReport(oFilter, success);
		} else if(vm.driverReport === 'Driver Payment Report'){
			ReportService.getDrverPaymentReport(oFilter, success);
		}

		function success(res) {
			if (download && res.data.url) {
				var a = document.createElement('a');
				a.href = res.data.url;
				a.download = res.data.url;
				a.target = '_blank';
				a.click();
				return;
			}else if (res && res.data) {
				swal('', res.data.message, 'info');
				res = res.data.data;
			}
		}
	}


	function prepareFilter(download){
		var myFilter = {};


		if(vm.oFilter.from){
			myFilter.from = vm.oFilter.from.toISOString();
		}
		if(vm.oFilter.to){
			myFilter.to = vm.oFilter.to.toISOString();
		}
		if (vm.aDriver && vm.aDriver.length) {
			myFilter.driver = [];
			vm.aDriver.map((v) => {
				myFilter.driver.push(v._id);
			});
		}

		if(vm.vendor){
			myFilter.vendor = vm.vendor;
		}

		if(vm.vehicle){
			myFilter.vehicle = vm.vehicle;
		}

		if(vm.branch){
			myFilter.branch = vm.branch;
		}

		if(vm.refNo){
			myFilter.refNo = vm.refNo;
		}

		if(vm.amount){
			myFilter.amount = vm.amount;
		}

		if(vm.type){
			myFilter.type = vm.type;
		}

		if (vm.tsNo) {
			myFilter['advSettled.tsNo'] = vm.tsNo;
		}

		if(download){
			myFilter.download = true;
			if(vm.driverReport === 'Driver Performance')
				myFilter.markSettle = true;
		}
		return myFilter;
	}

});
