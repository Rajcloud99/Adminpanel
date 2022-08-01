materialAdmin.controller('incentiveController', incentiveController);

incentiveController.$inject = ['$uibModal', 'customer', 'DatePicker', 'incentiveService', 'lazyLoadFactory', 'Vehicle'];

function incentiveController($uibModal, customer, DatePicker, incentiveService, lazyLoadFactory, Vehicle) {

	const vm = this;
	vm.get = get;
	vm.upsert = upsert;
	vm.getVehicle = getVehicle;
	vm.getCustomers = getCustomers;
	vm.setAsDefault = setAsDefault;

	(function init(){
		vm.oFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: ['Vehicle', 'Customer', 'Start', 'End', 'Basis', 'Rate']
		};
		vm.tableHead = [
			{
				'header': 'Vehicle',
				'bindingKeys': 'vehicle_no',
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer_name',
			},
			{
				'header': 'Start',
				'bindingKeys': 'effectiveStart',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'End',
				'bindingKeys': 'effectiveEnd',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'Basis',
				'bindingKeys': 'basis',
			},
			{
				'header': 'Rate',
				'bindingKeys': 'rate',
			},
		];
	})();

	function prepareFilterObject() {
		let prerFilter = {};

		if(vm.oFilter.vehicle)
			prerFilter.vehicle = vm.oFilter.vehicle._id;

		if(vm.oFilter.customer)
			prerFilter.customer = vm.oFilter.customer._id;

		if(vm.oFilter.from)
			prerFilter.from = vm.oFilter.from;

		if(vm.oFilter.to)
			prerFilter.to = vm.oFilter.to;

		prerFilter.skip = vm.lazyLoad.getCurrentPage();
		prerFilter.no_of_docs = 10;

		return prerFilter;
	}

	function get(isGetActive){

		if(!vm.lazyLoad.update(isGetActive))
			return;

		var request = prepareFilterObject();
		incentiveService.get(request, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
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

	function getCustomers(viewValue) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {
			customer.getCname(viewValue, function success(res) {
				resolve(slicer(res.data.data));
			}, function (err) {
				reject([]);
			});
		});
	}

	function upsert(type='add') {
		$uibModal.open({
			templateUrl: 'views/incentive/upsertIncentive.html',
			controller: ['DatePicker','customer', 'Vehicle', '$uibModalInstance', 'incentiveService', 'modelDetail', 'oIncentive', incentiveUpsertController],
			controllerAs: 'upsertVm',
			resolve: {
				oIncentive: function () {
					return vm.oIncentive;
				},
				modelDetail: function () {
					return {
						name: 'Incentive',
						type
					};
				}
			}
		}).result.then(function (res) {
			get();
		}, function (err) {
			console.log(err);
		});
	}

	function setAsDefault() {
		let request = {
			...vm.oIncentive,
			default: true
		};

		incentiveService.update(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
		}

		function onSuccess(res) {
			vm.oIncentive = res.data.data;
		}
	}

}


function incentiveUpsertController(
	DatePicker,
	customer,
	Vehicle,
	$uibModalInstance,
	incentiveService,
	modelDetail,
	oIncentive
) {
	let vm = this;

	vm.closePopup = close;
	vm.submit = submit;
	vm.onCustomerSelect = onCustomerSelect;
	vm.getVehicle = getVehicle;
	vm.onVehSelect = onVehSelect;
	vm.getCustomers = getCustomers;

	(function init() {

		vm.DatePicker = angular.copy(DatePicker);
		vm.modelName= modelDetail.name || 'Incentive';
		vm.modelType= modelDetail.type || 'add';

		vm.oIncentive = {};

		if(vm.modelType === 'edit'){
			vm.oIncentive = angular.copy(oIncentive);
			vm.cust = vm.oIncentive.customer_name;
			vm.veh = vm.oIncentive.vehicle_no;
			vm.oIncentive.effectiveStart = vm.oIncentive.effectiveStart && new Date(vm.oIncentive.effectiveStart) || '';
			vm.oIncentive.effectiveEnd = vm.oIncentive.effectiveEnd && new Date(vm.oIncentive.effectiveEnd) || '';
		}
	})();

	function close() {
		$uibModalInstance.dismiss();
	}

	// Vehicle
	function getVehicle(viewValue) {
		return new Promise(function (resolve) {
			if (viewValue && viewValue.toString().length > 2) {
				Vehicle.getName(viewValue, res => resolve(res.data.data), err => resolve([]));
			} else {
				resolve([]);
			}
		});
	}
	function onVehSelect($item, $model, $label) {
		vm.oIncentive.vehicle_no = $item.vehicle_reg_no;
		vm.oIncentive.vehicle = $item._id;
	}

	// Customer
	function getCustomers(viewValue) {
		return new Promise(function (resolve) {
			if (viewValue && viewValue.toString().length > 2) {
				customer.getAllCustomersNew({name: viewValue}, res => resolve(res.data), err => resolve([]));
			} else {
				resolve([]);
			}
		});
	}
	function onCustomerSelect($item, $model, $label) {
		vm.oIncentive.customer_name = $item.name;
		vm.oIncentive.customer = $item._id;
	}

	function submit(formData) {
		if(formData.$valid){
			let oSend = {...vm.oIncentive};
			if(vm.modelType === 'edit'){
				incentiveService.update(oSend, onSuccess, onFailure);
			}else{
				incentiveService.add(oSend, onSuccess, onFailure);
			}

			function onFailure(err) {
				swal('Error', err.message, 'error');
			}

			function onSuccess(res) {
				swal('Success', res.data.message, 'success');
				$uibModalInstance.close(res.data.data);
			}

		}else swal('Error','All Mandatory Field Should be Filled','error');

	}

}
