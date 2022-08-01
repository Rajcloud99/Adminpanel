/**
 * Created by manish on 4/5/18.
 */

materialAdmin.controller("addNewAndEditQuotationCtrl",
	function ($state, $rootScope, $scope, $uibModalInstance, $window, userService,
			  customerService, vendorService,
			  customer, salesOrderService, sim) {

		$scope.simDetail = {};
		$scope.modalTitle = 'Add New Sim';
		$scope.submitBtnText = 'SAVE';
		if(sim) {
			$scope.modalTitle = 'Edit Sim';
			$scope.submitBtnText = 'EDIT';
			$scope.simDetail = sim;
		}
		$scope.errMsg = '';
		$scope.discMsg = '';
		$scope.taxMsg = '';
		$scope.activationDatePopUp = false;
		$scope.billExpiryDatePopUp = false;
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
		$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
		$scope.format = $scope.formats[0];
		$scope.minDate = new $window.Date();

		$scope.showModal = function($event, key) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[key] = true;
		};

		$scope.closeModal = function(msg) {
			$uibModalInstance.close(msg || 'NO_RELOAD');
		};

		$scope.getCustomers = function(val) {
			if(val && typeof val === 'string' && val.length > 2) {
				customer.getAllCustomersNew({name: val, trim:true, all:true, sort:-1}, function(data) {
					$scope.customers = data;
				});
			} else {
				$scope.customers = null;
			}
		};

		$scope.getCustomers();

		$scope.clearSearch = function() {
			$scope.customers = null;
			$scope.quoteDetail.customer = null;
		};

		$scope.getAllSpares = function(isPagination){
			spareService.getAllSpareListTrueCustom({}, function(data) {
				$scope.aSpareRoot = data;
			});
		};
		$scope.getAllSpares();

		$scope.quantityChangeHandler = function(v) {
			if($scope.selectedItem.quantity > v) {
				$scope.quantityMsg = 'quantity must be less than ' + v;
			} else {
				$scope.quantityMsg = '';
			}
		};

		$scope.addQuotation = function() {
			if($scope.selectedItem
				&& $scope.selectedItem.quantity
				&& $scope.selectedItem.price_per_unit
				&& $scope.discMsg === ''
				&& $scope.taxMsg === ''
				&& $scope.quantityMsg === ''
				&& $scope.selectedItem.tax_percent >= 0
				&& $scope.selectedItem.discount_percent >= 0) {
				let subtotalWithoutDiscount = $scope.selectedItem.price_per_unit * $scope.selectedItem.quantity;
				let subtotalWithDiscount = subtotalWithoutDiscount - ($scope.selectedItem.discount_percent/100 * subtotalWithoutDiscount);
				let subtotalWithTax = subtotalWithDiscount + ($scope.selectedItem.tax_percent/100 * subtotalWithDiscount);
				$scope.selectedItem.total = subtotalWithTax;
				$scope.selectedItem.item_ref = $scope.selectedItem._id;
				$scope.quoteDetail.items.push($scope.selectedItem);
				$scope.selectedItem = {};
				$scope.errMsg = '';
			} else $scope.errMsg = 'Please select the item first and fill all mandatory fields.';
		};

		$scope.editQuotation = function() {

		};

		$scope.formSubmitHandler = function () {
			let cloned  = Object.assign({}, $scope.quoteDetail);
			cloned.quot_approver = cloned.quot_approver._id;
			cloned.customer = cloned.customer._id;
			if(cloned.items.length) {

				if($scope.modalTitle === 'Edit Quotation') {
					cloned.possible_delivery_by = new $window.Date(cloned.possible_delivery_by).toISOString();
					cloned.quot_expiry_date = new $window.Date(cloned.quot_expiry_date).toISOString();
					salesOrderService.updateQuotations(cloned, function (res) {
						swal(res.data.message, "", "success");
						$scope.closeModal('RELOAD');
					}, function () {
						swal("Some error occurred. Please try again", "", "error");
						$scope.closeModal('NO_RELOAD');
					});
				} else {
					cloned.possible_delivery_by = cloned.possible_delivery_by.toISOString();
					cloned.quot_expiry_date = cloned.quot_expiry_date.toISOString();
					salesOrderService.addQuotations(cloned, function (res) {
						swal(res.data.message, "", "success");
						$scope.closeModal('RELOAD');
					}, function (err) {
						swal("Some error occurred. Please try again", "", "error");
						$scope.closeModal('NO_RELOAD');
					});
				}
			} else {
				$scope.errMsg = 'No Items Added';
			}
		};
	}
);

materialAdmin.controller("simController",
	function($rootScope, $stateParams, $state, $scope, userService,
			 customerService, vendorService,
			 $localStorage, growlService , constants,
			 simMasterService, $uibModal) {

		$scope.getSims = function () {
			simMasterService.getSims({no_of_docs:10},function (res) {
				$scope.sims = res;
			}, function (err) {});
		};
		$scope.getSims();

		$scope.addNewSim = function () {
			let modalInstance = $uibModal.open({
				templateUrl: 'views/sim/addNewAndEditSimPopUp.html',
				controller: 'addNewAndEditSimCtrl',
				resolve: {
					quote: function () {
						return null;
					}
				}
			});
			modalInstance.result.then(function(msg) {
				if(msg === 'RELOAD') {
					$state.reload();
				}
			}, function(data) {});
		};

		$scope.editSim = function (quoteObj) {
			let modalInstance = $uibModal.open({
				templateUrl: 'views/sim/addNewAndEditSimPopUp.html',
				controller: 'addNewAndEditSimCtrl',
				resolve: {
					quote: function () {
						return quoteObj;
					}
				}
			});
			modalInstance.result.then(function(msg) {
				if(msg === 'RELOAD') {
					$state.reload();
				}
			}, function() {});
		};

	});









