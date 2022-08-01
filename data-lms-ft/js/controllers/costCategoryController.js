// costCategory Controllers

materialAdmin
	.controller("costCategoryController", costCategoryController)
	.controller("costCatUpsertController", costCatUpsertController);

costCategoryController.$inject = [
	'$modal',
	'$uibModal',
	'accountingService',
	'lazyLoadFactory',
	'branchService',
	'DatePicker'
];

costCatUpsertController.$inject = [
	'$scope',
	'$uibModalInstance',
	'accountingService',
	'branchService',
	'DatePicker',
	'selectCostCategory',
];

function costCategoryController(
	$modal,
	$uibModal,
	accountingService,
	lazyLoadFactory,
	branchService,
	DatePicker
) {

	let vm = this;

	// functions Identifiers
	vm.getCostCategory = getCostCategory;
	vm.selectThisRow = selectThisRow;
	vm.upsertCostCategory = upsertCostCategory;


	// INIT functions
	(function init() {
		vm.selectType = 'index';
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		// getAccountMasters(true);
		vm.columnSetting = {
			allowedColumn: [
				'Name',
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
		vm.aCostCategory = []; // to contain Cost Category
		vm.oFilter = {}; // initialize filter object
		vm.selectedCategory = null; // to contain selected Data
	})();

	// Actual Functions

	// Add or Edit Cost Category Modal
	function upsertCostCategory(CostCategory) {

		var modalInstance = $modal.open({
			templateUrl: 'views/costcategory/costCategoryUpsert.html',
			controller: 'costCatUpsertController',
			controllerAs: 'uccVm',
			resolve: {
				'selectCostCategory': function () {
					return CostCategory;
				}
			}
		});

		modalInstance.result.then(function (response) {
			if (response)
				if (CostCategory)
					vm.selectedCategory = response;
				else
					vm.aCostCategory.push(response);

			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}


	// Get  CostCategory from backend
	function getCostCategory(isGetActive) {


		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject();
		accountingService.getCostCategory(oFilter, onSuccess, onFailure);

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


	function prepareFilterObject() {
		var requestFilter = {};


		if (typeof vm.oFilter.name !== 'undefined')
			requestFilter.name = vm.oFilter.name;


		if (typeof vm.oFilter.from !== 'undefined')
			requestFilter.from = vm.oFilter.from;

		if (typeof vm.oFilter.to !== 'undefined')
			requestFilter.to = vm.oFilter.to;

		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 20;

		return requestFilter;
	}

	function selectThisRow(oCostCategory, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		vm.selectedCategory = oCostCategory;
	}
}


 function costCatUpsertController(
	$scope,
	$uibModalInstance,
	accountingService,
	branchService,
	DatePicker,
	selectCostCategory
) {
	 let vm = this;

	// functions Identifiers
	 vm.submit = submit;
	 vm.closeModal = closeModal;


	// INIT functions
	 (function init() {
		 // object Identifiers
		 vm.oCostCategory = {}; //initialize with Empty Object
		 vm.operationType = 'Add'; // Defines Operation type for Showing on View
		 vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
		 vm.aCategory = ['Advance', 'Money Receipt', 'Credit Note', 'Bill'];

		 // Operations
		 if (typeof selectCostCategory !== 'undefined' && selectCostCategory !== null) {
			 vm.oCostCategory = angular.copy(selectCostCategory); //initialize with param
			 if (!selectCostCategory.isAdd) {
				 vm.operationType = 'Edit';
				 if(selectCostCategory.fromVendor)
					 vm.isReadOnly = true;
			 }

		 }
	 })();



	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	// add or modify Cost Center
	function submit(formData) {
		console.log(formData);

		if (formData.$valid) {
			var request = vm.oCostCategory;

			console.log('form is valid', request);

			// call respective service on based on operation type
			if (vm.operationType === 'Add') {
				accountingService.addCostCategory(request, onSuccess, onFailure);
			} else if (vm.operationType === 'Edit') {
				accountingService.updateCostCategory(request, onSuccess, onFailure);
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











