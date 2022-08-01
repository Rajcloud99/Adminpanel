materialAdmin.controller('dphController', dphController);

dphController.$inject = ['$uibModal', 'customer', 'DatePicker', 'dphService', 'lazyLoadFactory'];

function dphController($uibModal, customer, DatePicker, dphService, lazyLoadFactory) {

	const vm = this;
	vm.get = get;
	vm.upsert = upsert;
	vm.deleteDph = deleteDph;
	vm.getCustomers = getCustomers;

	(function init(){
		vm.oFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: ['Customer', 'Date', 'Price', 'Rate %']
		};
		vm.tableHead = [
			{
				'header': 'Customer',
				'bindingKeys': 'customer_name',
			},
			{
				'header': 'Date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'Price',
				'bindingKeys': 'rate',
			},
			{
				'header': 'Rate %',
				'bindingKeys': 'hike',
			},
		];
	})();

	function prepareFilterObject() {
		let prerFilter = {};

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
		dphService.get(request, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response.data);
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
			templateUrl: 'views/dph/upsertDph.html',
			controller: ['DatePicker','customer', '$uibModalInstance', 'dphService', 'modelDetail', 'oDph', dphUpsertController],
			controllerAs: 'upsertVm',
			resolve: {
				oDph: function () {
					return vm.oDph;
				},
				modelDetail: function () {
					return {
						name: 'Dph',
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

	function deleteDph() {
		let req = {};
		req._id = vm.oDph && vm.oDph._id;
		dphService.remove(req, onSuccess, onFailure);
		function onSuccess(res) {
			swal('Success', res.message, 'success');
			get();
			// $uibModalInstance.close(res.data.data);
		}
		function onFailure(err) {
			swal('Error', err.message, 'error');
		}
	}

}


function dphUpsertController(
	DatePicker,
	customer,
	$uibModalInstance,
	dphService,
	modelDetail,
	oDph
) {
	let vm = this;

	vm.closePopup = close;
	vm.submit = submit;
	vm.onCustomerSelect = onCustomerSelect;
	vm.getCustomers = getCustomers;

	(function init() {

		vm.DatePicker = angular.copy(DatePicker);
		vm.modelName= modelDetail.name || 'Dph';
		vm.modelType= modelDetail.type || 'add';

		vm.oDph = {};
        vm.oDph.date = new Date();
		if(vm.modelType === 'edit'){
			vm.oDph = angular.copy(oDph);
			vm.cust = vm.oDph.customer_name;
			vm.oDph.date = vm.oDph.date && new Date(vm.oDph.date) || '';
		}
	})();

	function close() {
		$uibModalInstance.dismiss();
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
		vm.oDph.customer_name = $item.name;
		vm.oDph.customer = $item._id;
	}

	function submit(formData) {
		if(formData.$valid){
			let oSend = {...vm.oDph};
			if(vm.modelType === 'edit'){
				dphService.update(oSend, onSuccess, onFailure);
			}else{
				dphService.add(oSend, onSuccess, onFailure);
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
