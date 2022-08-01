materialAdmin.controller("addNewAndEditQuotationCtrl",
	function ($state, $rootScope, $scope, $uibModalInstance, $window, spareService, customer, salesOrderService, quote) {

		$scope.quoteDetail = { items: [] };
		$scope.modalTitle = 'Add New Quotation';
		$scope.submitBtnText = 'SAVE';
		if (quote) {
			$scope.modalTitle = 'Edit Quotation';
			$scope.submitBtnText = 'EDIT';
			$scope.quoteDetail = quote;
		}
		$scope.errMsg = '';
		$scope.discMsg = '';
		$scope.taxMsg = '';
		$scope.deliveryDatePopUp = false;
		$scope.expiryDatePopUp = false;
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
		$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
		$scope.format = $scope.formats[0];
		$scope.minDate = new $window.Date();
		$scope.aPriority = ['High', 'Medium', 'Low'];

		$scope.showModal = function ($event, key) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[key] = true;
		};

		$scope.closeModal = function (msg) {
			$uibModalInstance.close(msg || 'NO_RELOAD');
		};

		$scope.onDiscountChange = function (v) {
			if (v > 100) {
				$scope.discMsg = 'discount must be less than or equal to 100%';
			} else {
				$scope.discMsg = '';
			}
		};

		$scope.onTaxChange = function (v) {
			if (v > 40) {
				$scope.taxMsg = 'tax must be less than or equal to 40%';
			} else {
				$scope.taxMsg = '';
			}
		};

		$scope.getAllPRapprover = function () {
			spareService.getAllPRapproverCustom({ src: 'quotation' }, function (data) {
				$scope.aApprover = data;
			});
		};
		$scope.getAllPRapprover();

		$scope.getCustomers = function (val) {
			if (val && typeof val === 'string' && val.length > 2) {
				customer.getAllcustomersCustom({ name: val, src: 'quotation' }, function (data) {
					$scope.customers = data;
				});
			} else {
				$scope.customers = null;
			}
		};
		$scope.getCustomers();

		$scope.clearSearch = function () {
			$scope.customers = null;
			$scope.quoteDetail.customer = null;
		};

		$scope.getAllSpares = function (isPagination) {
			spareService.getAllSpareListTrueCustom({}, function (data) {
				$scope.aSpareRoot = data;
			});
		};
		$scope.getAllSpares();

		$scope.quantityChangeHandler = function (v) {
			if ($scope.selectedItem.quantity > v) {
				$scope.quantityMsg = 'quantity must be less than ' + v;
			} else {
				$scope.quantityMsg = '';
			}
		};

		function calculateAndAppendData(quotBody) {
			let total_quantity = 0;
			let total_discount = 0;
			let total_tax = 0;
			let subTotal1 = 0;
			let subTotal2 = 0;
			if (quotBody.items && quotBody.items.length>0) {
				for (let y = 0; y < quotBody.items.length; y++) {
					let rowTotalBefore = (quotBody.items[y].price_per_unit * quotBody.items[y].quantity);
					let current_disc_amt = (rowTotalBefore * quotBody.items[y].discount_percent)/100;
					let current_tax_amt = ((rowTotalBefore - current_disc_amt) * quotBody.items[y].tax_percent)/100;
					let rowTotalAfter = rowTotalBefore - current_disc_amt + current_tax_amt;
					quotBody.items[y].total = +rowTotalAfter.toFixed(2);
					subTotal1 += rowTotalBefore;
					subTotal2 += rowTotalAfter;
					total_discount += current_disc_amt;
					total_tax += current_tax_amt;
					total_quantity +=quotBody.items[y].quantity;
				}
			}
			quotBody.subtotal1 = +subTotal1.toFixed(2);
			quotBody.total_discount = +total_discount.toFixed(2);
			quotBody.total_tax= +total_tax.toFixed(2);
			quotBody.subtotal2= +subTotal2.toFixed(2);
			let total = subTotal2 + (quotBody.shipping_charges||0) + (quotBody.other_charges||0);
			quotBody.total = +total.toFixed(2);
			quotBody.total_quantity = total_quantity;
		}

		$scope.addQuotation = function () {
			if ($scope.selectedItem
				&& $scope.selectedItem.quantity
				&& $scope.selectedItem.price_per_unit
				&& $scope.discMsg === ''
				&& $scope.taxMsg === ''
				&& $scope.quantityMsg === ''
				&& $scope.selectedItem.tax_percent >= 0
				&& $scope.selectedItem.discount_percent >= 0) {
				var subtotalWithoutDiscount = $scope.selectedItem.price_per_unit * $scope.selectedItem.quantity;
				var subtotalWithDiscount = subtotalWithoutDiscount - ($scope.selectedItem.discount_percent / 100 * subtotalWithoutDiscount);
				var subtotalWithTax = subtotalWithDiscount + ($scope.selectedItem.tax_percent / 100 * subtotalWithDiscount);
				$scope.selectedItem.total = +subtotalWithTax.toFixed(2);
				$scope.selectedItem.item_ref = $scope.selectedItem._id;
				$scope.quoteDetail.items.push($scope.selectedItem);
				$scope.selectedItem = {};
				$scope.errMsg = '';
			} else $scope.errMsg = 'Please select the item first and fill all mandatory fields.';
		};

		$scope.editQuotation = function () {

		};

		$scope.formSubmitHandler = function () {
			var cloned = Object.assign({}, $scope.quoteDetail);
			cloned.quot_approver = cloned.quot_approver._id;
			cloned.customer = cloned.customer._id;
			calculateAndAppendData(cloned);
			if (cloned.items.length) {

				if ($scope.modalTitle === 'Edit Quotation') {
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


materialAdmin.controller("approveQuotationController", function ($scope, $uibModalInstance, salesOrderService, quote) {

	$scope.approve = function () {
		salesOrderService.updateQuotations(
			{ _id: quote._id, quot_status: 'Approved for sale' },
			function (res) {
				swal('Yesss!', res.data.message, 'success');
				$scope.closeModal('RELOAD');
			},
			function (err) {
				console.log(err);
				swal('Ooops!', err.data.message, 'error');
				$scope.closeModal();
			});
	};

	$scope.closeModal = function (msg) {
		$uibModalInstance.close(msg || 'NO_RELOAD');
	};
});

materialAdmin.controller("previewQuotationController", function ($scope, $uibModalInstance, salesOrderService) {
	$scope.closeModal = function (msg) {
		$uibModalInstance.close(msg || 'NO_RELOAD');
	};
});

materialAdmin.controller("quotationController",
	function ($rootScope, $stateParams, $state, $scope, spareService, userService, $localStorage, growlService, constants, salesOrderService, $uibModal, $window) {

		function prepareFilterObject(isPagination) {
			var allowedKey = ['quot_number', 'quot_approver', 'quot_status', 'priority'];
			var myFilter = {};
			for (var i = 0; i < allowedKey.length; i++) {
				if ($scope[allowedKey[i]]) {
					myFilter[allowedKey[i]] = $scope[allowedKey[i]];
				}
			}
			if (isPagination && $scope.pag.currentPage) {
				myFilter.skip = $scope.pag.currentPage;
			}
			return myFilter;
		}

		var lastFilter;
		$scope.pag = {
			currentPage: 1,
			maxSize: 3,
			totalItems: 0,
			itemsPerPage: 15,
			total_pages: 0
		};
		$scope.quotations = [];
		$scope.aStatus = ["Unapproved", "Expired", "Cancelled", "Approved for sale", "Partially converted to SO",
		"Fully converted to SO"];
		$scope.aPriority = ["Low", "Medium", "High"];

		$scope.selectThisRow = function (oQuot, index) {
			$scope.selectedQuotation = oQuot;
			$($('.quotTable tbody tr')).removeClass('grn');
			var row = $($('.quotTable tbody tr')[index]);
			row.addClass('grn');
		};

		$scope.getQuotations = function (isPagination) {
			var oFilter = prepareFilterObject(isPagination);
			lastFilter = oFilter;
			salesOrderService.getQuotations1(oFilter, function (res) {
				$scope.quotations = res.data;
				$scope.aQuotList = res.data;
				$scope.pag.total_pages = res.pages;
				$scope.pag.totalItems = 15 * res.pages;
			}, function (err) {
				console.log(err);
			});
		};
		$scope.getQuotations();

		$scope.addNewQuotation = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/quotation/addNewAndEditQuotationPopUp.html',
				controller: 'addNewAndEditQuotationCtrl',
				resolve: {
					quote: function () {
						return null;
					}
				}
			});
			modalInstance.result.then(function (msg) {
				if (msg === 'RELOAD') {
					$state.reload();
				}
			}, function (data) { });
		};

		$scope.convertToSalesOrder = function() {
			salesOrderService.convertToSalesOrder($scope.selectedQuotation._id, function (res) {
				swal('Yesss!', res.data.message, 'success');
				$scope.closeModal('RELOAD');
			},
			function (err) {
				console.log(err);
				swal('Ooops!', err.data.message, 'error');
				$scope.closeModal();
			});
		};

		$scope.editQuotation = function (quoteObj) {
			quoteObj = $scope.selectedQuotation;
			var modalInstance = $uibModal.open({
				templateUrl: 'views/quotation/addNewAndEditQuotationPopUp.html',
				controller: 'addNewAndEditQuotationCtrl',
				resolve: {
					quote: function () {
						return quoteObj;
					}
				}
			});
			modalInstance.result.then(function () {
				// $state.reload();
			}, function () { });
		};

		$scope.approveQuotation = function (q) {
			q = $scope.selectedQuotation;
			if (q.quot_status === 'Unapproved') {
				var modalInstance = $uibModal.open({
					templateUrl: 'views/quotation/approveQuotationPopup.html',
					controller: 'approveQuotationController',
					resolve: {
						quote: function () {
							return q;
						}
					}
				});
				modalInstance.result.then(function (msg) {
					if (msg === 'RELOAD') {
						$state.reload();
					}
				}, function () { });
			}
		};

		$scope.previewQuotation = function(q) {
			q = $scope.selectedQuotation;
			salesOrderService.previewQuotation({_id: q._id}, function(res) {
				var modalInstance = $uibModal.open({
					template: res,
					controller: 'previewQuotationController'
				});
				modalInstance.result.then(function (msg) {}, function () {});
			}, function(err) {

			});
		};

		$scope.getAllSOapprover = function () {
			spareService.getAllPRapproverCustom({}, function (data) {
				$scope.aApprover = data;
			});
		};
		$scope.getAllSOapprover();

	});
