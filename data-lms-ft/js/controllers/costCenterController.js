// costCategory Controllers

materialAdmin
	.controller("costCenterController", costCenterController)
	.controller("costCenterUpsertController", costCenterUpsertController);

costCenterController.$inject = [
	'$modal',
	'$uibModal',
	'accountingService',
	'lazyLoadFactory',
	'branchService',
	'DatePicker'
];

costCenterUpsertController.$inject = [
	'$scope',
	'$uibModalInstance',
	'accountingService',
	'branchService',
	'DatePicker',
	'selectCostCenter'
];

function costCenterController(
	$modal,
	$uibModal,
	accountingService,
	lazyLoadFactory,
	branchService,
	DatePicker
) {

	let vm = this;

	// functions Identifiers
	vm.getCostCenter = getCostCenter;
	vm.selectThisRow = selectThisRow;
	vm.getAllBranch = getAllBranch;
	vm.upsertCostCenter = upsertCostCenter;
	vm.deleteCostCenter = deleteCostCenter;

	// INIT functions
	(function init() {
		vm.selectType = 'index';
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		// getAccountMasters(true);
		vm.columnSetting = {
			allowedColumn: [
				'Name',
				'Feature',
				'category',
				'branch',
				'Added By',
				'Added On',
				'last Modified At',
				'Last Modified By'
			]
		};
		vm.tableHead = [
			{
				'header': 'Name',
				'bindingKeys': 'name',
				date: false
			},
			{
				'header': 'Feature',
				'bindingKeys': 'feature.join(", ")',
			},
			{
				'header': 'category',
				'bindingKeys': 'category.name'
			},
			{
				'header': 'branch',
				'bindingKeys': '(branch|arrayOfObjectToArray:"name").join(", ")',
				"$eval": true
			},
			{
				'header': 'Added By',
				'bindingKeys': 'created_by',
			},
			{
				'header': 'Added On',
				'bindingKeys': 'created_at',
				'date': true
			},
			{
				'header': 'last Modified At',
				'bindingKeys': 'last_modified_at',
				'date': true
			},
			{
				'header': 'Last Modified By',
				'bindingKeys': 'last_modified_by'
			}
		];

		// object Identifiers
		vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
		vm.aCostCenter = []; // to contain Cost Category
		vm.oFilter = {}; // initialize filter object
		vm.selectedCostCenter = null; // to contain selected Data
	})();

	// Actual Functions

	// Add or Edit Cost Category Modal
	function upsertCostCenter(costCenter) {

		var modalInstance = $modal.open({
			templateUrl: 'views/costCenter/costCenterUpsert.html',
			controller: 'costCenterUpsertController',
			controllerAs: 'vm',
			resolve: {
				'selectCostCenter': function () {
					return costCenter;
				}
			}
		});

		modalInstance.result.then(function (response) {
			if (response)
				if (costCenter)
					vm.selectedCostCenter = response;
				else
					vm.aCostCenter.push(response);

			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}


	// Get  CostCategory from backend
	function getCostCenter(isGetActive) {


		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject();
		accountingService.getCostCenter(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);

		}
	}

	//delete cost center
	function deleteCostCenter(costCenter){
		if (!vm.selectedCostCenter)
			return swal('Error', 'Please Select any cost center', 'error');

		swal({
				title: 'Are you sure you want to delete selected cost center?',
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
					accountingService.deleteCostCenter({
						_id: vm.selectedCostCenter._id
					}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.message, 'success');
						// getAllcostcenter();
						vm.getCostCenter;
					}

					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
				}
			});
		return;
	}

	function getAllBranch(viewValue) {
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


	function prepareFilterObject() {
		var requestFilter = {};


		if (typeof vm.oFilter.name !== 'undefined')
			requestFilter.name = vm.oFilter.name;

		if (typeof vm.oFilter.branch !== 'undefined')
			requestFilter.branch = vm.oFilter.branch._id;

		if (typeof vm.oFilter.from !== 'undefined')
			requestFilter.from = vm.oFilter.from;

		if (typeof vm.oFilter.to !== 'undefined')
			requestFilter.to = vm.oFilter.to;

		if (typeof vm.oFilter.feature !== 'undefined')
			requestFilter.feature = vm.oFilter.feature;

		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 20;

		return requestFilter;
	}

	function selectThisRow(oCostCenter, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		vm.selectedCostCenter = oCostCenter;
	}
}


function costCenterUpsertController(
	$scope,
	$uibModalInstance,
	accountingService,
	branchService,
	DatePicker,
	selectCostCenter,
) {
	let vm = this;

	// functions Identifiers
	vm.submit = submit;
	vm.closeModal = closeModal;
	vm.getBranch = getBranch;
	vm.getCostCenter = getCostCenter;
	vm.onBranchSelect = onBranchSelect;


	// INIT functions
	(function init() {
		// object Identifiers
		vm.oCostCategory = {}; //initialize with Empty Object
		vm.operationType = 'Add'; // Defines Operation type for Showing on View
		vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker

		// Operations
		if (typeof selectCostCenter !== 'undefined' && selectCostCenter !== null) {
			vm.oCostCategory = angular.copy(selectCostCenter); //initialize with param
			if (!selectCostCenter.isAdd) {
				vm.operationType = 'Edit';
				if(selectCostCenter.fromVendor)
					vm.isReadOnly = true;
			}

		}
	})();

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getBranch(viewValue) {
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

	function getCostCenter(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				accountingService.getCostCategory(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function onBranchSelect($item) {
		vm.oCostCategory.branch = vm.oCostCategory.branch || [];
		vm.oCostCategory.branch.push({
			_id: $item._id,
			name: $item.name
		});
		vm.branch = null;
	}

	// add or modify Cost Center
	function submit(formData) {
		console.log(formData);

		if (formData.$valid) {
			var request = vm.oCostCategory;

			console.log('form is valid', request);

			if(request.branch && request.branch._id){
				request.branch = {_id: request.branch._id, name : request.branch.name};
			}

			if(request.category && request.category._id){
				request.category = {_id: request.category._id, name : request.category.name};
			}


			// call respective service on based on operation type
			if (vm.operationType === 'Add') {
				accountingService.addCostCenter(request, onSuccess, onFailure);
			} else if (vm.operationType === 'Edit') {
				accountingService.updateCostCenter(request, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				swal('Success', response.message, 'success');
				$uibModalInstance.close(response.data);
			}
		}
	}

	//////////////////////////////////////////////////

}











