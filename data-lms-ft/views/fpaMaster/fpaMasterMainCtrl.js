materialAdmin.controller('fpaMasterMainCtrl', fpaMasterMainCtrl);

fpaMasterMainCtrl.$inject = ['lazyLoadFactory', '$uibModal', 'DatePicker', 'customer', 'Vendor', 'fpaMasterService'];

function fpaMasterMainCtrl(lazyLoadFactory, $uibModal,DatePicker,customer, Vendor, fpaMasterService) {

	const vm = this;
	vm.get = get;
	vm.getCustomer = getCustomer;
	vm.getVendor = getVendor;
	vm.upsert = upsert;
	vm.setAsDefault = setAsDefault;

	(function init(){
		vm.oFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.columnSetting = {
			allowedColumn: ['Date','Vendor/Associate', 'Customer', 'Type', 'Rate %']
		};
		vm.tableHead = [
			{
				'header': 'Date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'Vendor/Associate',
				'bindingKeys': 'vendor_name',
			},
			{
				'header': 'Customer',
				'bindingKeys': 'customer_name',
			},
			{
				'header': 'Type',
				'bindingKeys': 'type',
			},
			{
				'header': 'Rate %',
				'bindingKeys': 'rate',
			},
		];
	})();

	function prepareFilterObject(oFilter) {
		let prerFilter = {};

		if (vm.oFilter.from) {
			prerFilter.from = vm.oFilter.from;
		}
		if (vm.oFilter.to) {
			prerFilter.to = vm.oFilter.to;
		}
		if (vm.oFilter.vendor) {
			prerFilter.vendor = vm.oFilter.vendor._id;
		}
		if (vm.oFilter.customer) {
			prerFilter.customer = vm.oFilter.customer._id;
		}


		prerFilter.skip = vm.lazyLoad.getCurrentPage();
		prerFilter.no_of_docs = 20;

		return prerFilter;
	}

	function get(isGetActive){

		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject(vm.oFilter);
		fpaMasterService.get(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			response = response.data
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);

		}
	}

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

	function getVendor(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {name: viewValue, deleted: false};

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


	function upsert(type='add') {
		$uibModal.open({
			templateUrl: 'views/fpaMaster/upsertFpa.html',
			controller: ['DatePicker','customer', 'Vendor','Vehicle', 'fpaMasterService','$uibModalInstance', 'modelDetail', 'ofpa',fpaUpsertController],
			controllerAs: 'upsertVm',
			resolve: {
				ofpa: function () {
					return vm.ofpa;
				},
				modelDetail: function () {
					return {
						name: 'FPA',
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
			...vm.ofpa,
			default: true
		};

		incentiveService.update(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
		}

		function onSuccess(res) {
			vm.ofpa = res.data.data;
		}
	}

}


function fpaUpsertController(
	DatePicker,
	customer,
	Vendor,
	Vehicle,
	fpaMasterService,
	$uibModalInstance,
	modelDetail,
	ofpa
) {
	let vm = this;

	vm.closePopup = close;
	vm.submit = submit;
	vm.onCustomerSelect = onCustomerSelect;
	vm.getCustomers = getCustomers;
	vm.getVendors=getVendors;
	vm.onVendorSelect=onVendorSelect;

	(function init() {

		vm.DatePicker = angular.copy(DatePicker);
		vm.modelName= modelDetail.name || 'FPA';
		vm.modelType= modelDetail.type || 'add';

		vm.ofpa = {};

		if(vm.modelType === 'edit'){
			vm.ofpa = angular.copy(ofpa);
		}
	})();

	function close() {
		$uibModalInstance.dismiss();
	}

	// Vendor
	function getVendors(viewValue) {
		return new Promise(function (resolve) {
			if (viewValue && viewValue.toString().length > 2) {
				Vendor.getName({name: viewValue,ownershipType:'Associate',deleted: false}, res => resolve(res.data && res.data.data), err => resolve([]));
			} else {
				resolve([]);
			}
		});
	}
	function onVendorSelect($item, $model, $label) {
		vm.ofpa.vendor_name = $item.name;
		vm.ofpa.vendor = $item._id;
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
		vm.ofpa.customer_name = $item.name;
		vm.ofpa.customer = $item._id;
	}

	function submit(formData) {
		if(formData.$valid){
			let oSend = {...vm.ofpa};
			if(vm.modelType === 'edit'){
				fpaMasterService.update(oSend, onSuccess, onFailure);
			}else{
				fpaMasterService.add(oSend, onSuccess, onFailure);
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

materialAdmin.controller('genFpaBillCtrl', genFpaBillCtrl);

genFpaBillCtrl.$inject = ['$uibModalInstance','fpaBillService','DatePicker','branchService','$scope','lazyLoadFactory', '$uibModal','fpaMasterService','grs$$','vendorDetails$$'];

function genFpaBillCtrl($uibModalInstance,fpaBillService,DatePicker,branchService,$scope,lazyLoadFactory, $uibModal,fpaMasterService,grs$$,vendorDetails$$) {
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oSend = {
		vendor: vendorDetails$$.vendor,
	};
	$scope.vendorDetails$$ = vendorDetails$$;
	Promise.all(grs$$.map(async (gr) => {
		return new Promise((res, rej) => {
			fpaMasterService.autosuggest({
				vendor:$scope.oSend.vendor,
				customer:gr.customer._id,
				date:gr.grDate||new Date().toISOString(),
				projection:'rate,!_id'
			}, (d) => {
				return res({ ...gr, comission_percent:(d.data&&d.data.rate)||0 });
			},(e)=>{
				return res({ ...gr });
			});
		});
	})).then(grs => ($scope.grs$$ = grs));

	$scope.getBranches = function () {
			branchService.getBranches({}, d=>$scope.branches=d.data, (e)=>([]));
	};
	$scope.getBranches();
	$scope.submit = function (f) {
		console.log(f);
		if (f.$valid) {
			let d = {
				...$scope.oSend,
				items: $scope.grs$$.map(x=>({
					gr:x._id,
					remark:x.remark,
					comission_percent: x.comission_percent,
					freight:x.totalFreight,
					total:x.total&&+x.total,
				})),
				amount: $scope.grs$$.reduce((acc,x)=>(acc+=(+x.total)),0)
			};
			fpaBillService.add(d,(res)=>{
				swal('Success', res.message, 'success');
				$uibModalInstance.close(res.data);
			},(err)=>{
				swal('Error', err.message, 'error');
				$uibModalInstance.close();
			});
		}
	}
}
