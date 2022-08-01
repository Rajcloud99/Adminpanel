materialAdmin.controller("invoicesController", function($uibModal, $rootScope, $stateParams, $state, $scope, userService, $localStorage, growlService, constants, salesOrderService, $uibModal, customer, spareService,$filter) {

	var lastFilter;
	/*var billFlow = {
		Unapproved: {
			Approved: {
				Dispatched: {

				}
			},
			Cancelled: {

			}
		}	
	};*/

	$scope.aPriority = ["Low", "Medium", "High"];
	$scope.aStatus = ["Unapproved", "Approved", "Dispatched", "Cancelled", "Part Payment Received", "Full Payment Received"];

	function prepareFilterObject(isPagination) {
		var allowedKey = ['invoice_no', 'approver', 'status', 'priority'];
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

	$scope.selectThisRow = function (inv, index) {
		$scope.selectedInvoice = inv;
		$($('.soTable tbody tr')).removeClass('grn');
		var row = $($('.soTable tbody tr')[index]);
		row.addClass('grn');
	};

	$scope.getInvoices = function(isPagination) {
		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		salesOrderService.getInvoice(oFilter, function(invoices) {
			$scope.aInvoices = invoices.data;
			$scope.pag.total_pages = invoices.pages;
			$scope.pag.totalItems = 15 * invoices.pages;
		}, function(err) {

		});
	};
	$scope.getInvoices();

	$scope.approveInvoice = function() {
		if ($scope.selectedInvoice.status === 'Unapproved') {
				var modalInstance = $uibModal.open({
					templateUrl: 'views/quotation/approveInvoicePopup.html',
					controller: 'approveInvoiceController',
					resolve: {
						invoice: angular.copy($scope.selectedInvoice)
					}
				});
				modalInstance.result.then(function (msg) {
					if (msg === 'RELOAD') {
						$state.reload();
					}
				}, function () { });
			}
	};

	$scope.declineInvoice = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/quotation/declineInvoicePopup.html',
			controller: 'declineInvoiceController',
			resolve: {
				invoice: function () {
					return angular.copy($scope.selectedInvoice);
				}
			}
		});
		modalInstance.result.then(function (msg) {
			if (msg === 'RELOAD') {
				$state.reload();
			}
		}, function () { });
	};

	$scope.previewInvoice = function() {
		salesOrderService.previewInvoice({ _id: $scope.selectedInvoice._id }, function (res) {
			var modalInstance = $uibModal.open({
				template: res,
				controller: 'previewSOController'
			});
			modalInstance.result.then(function (msg) { }, function () { });
		}, function (err) { });
	};

	$scope.billDispatch = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/quotation/invoiceBillDispatchPopup.html',
			controller: 'invoiceBillDispatchCtrl',
			resolve: {
				Bill: $scope.selectedInvoice
			}
		});
		modalInstance.result.then(function(data) {
			swal(data, '', "success");
			$state.reload();
		}, function(data) {
		});
	};

	$scope.acknowledgeInvoice = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/quotation/invoiceAcknowledgePopup.html',
			controller: 'invoiceAcknowledgePopupCtrl',
			resolve: {
				Bill: $scope.selectedInvoice
			}
		});
		modalInstance.result.then(function(data) {
			swal(data, '', "success");
			$state.reload();
		}, function(data) {
		});
	};

});

materialAdmin.controller('invoiceAcknowledgePopupCtrl', function(spareService,$rootScope,$scope,$localStorage,$uibModalInstance,DatePicker,salesOrderService,Bill,customer,$window) {

	$scope.minDate = new $window.Date();
	$scope.DatePicker = DatePicker;
	$scope.bill = angular.copy(Bill);

	$scope.closeModal = function (msg, d) {
		if(msg === 'RELOAD') {
			$uibModalInstance.close(d);
		}else{
			$uibModalInstance.dismiss();
		}
	};

	$scope.acknowledgeInvoice = function() {
		var oSend = angular.copy($scope.oSend);
		oSend.status = 'Acknowledged';
		oSend.acknowledged_date = new $window.Date();
		oSend.acknowledged_by = $localStorage.ft_data.userLoggedIn._id;
		// oSend.acknowledged_by = oSend.acknowledged_by._id;
		salesOrderService.dispatchInvoice($scope.bill._id, oSend, function(res) {
			$scope.closeModal('RELOAD', res.data.message);
		}, function(err) {
			$scope.closeModal();
		});
	};

	$scope.getCustomers = function(val) {
		if (val && typeof val === 'string' && val.length > 2) {
			spareService.getInvoiceAck(val, function (data) {
				$scope.customers = data.data;
			});
		}
	};

	$scope.clearSearch = function() {
		$scope.oSend.acknowledged_by = null;
		$scope.customers = [];
	};

});

materialAdmin.controller('invoiceBillDispatchCtrl', function($rootScope,$scope,$localStorage,$uibModalInstance,DatePicker,tripServices,branchService,billsService,Driver,vendorCourierService,Bill,salesOrderService) {

	$scope.closeModal = function (msg, d) {
		if(msg === 'RELOAD') {
			$uibModalInstance.close(d);
		}else{
			$uibModalInstance.dismiss();
		}
	};

	$scope.DatePicker = DatePicker;
	$scope.aCourier = [];
	$scope.aCourierOfc = [];
	$scope.aDriver = [];
	$scope.show_me = true;
	$scope.aDispatched_via = ['Courier', 'Person'];
	$scope.bill = angular.copy(Bill);
	try{
		if($scope.bill.dueDate) {
			$scope.bill.dueDate = new Date($scope.bill.dueDate);
		}
	}catch(e){}
	$scope.bill.dispatch_date = new Date();

	(function() {
		function successBranch(res) {
			if (res.data) {
				$scope.aBranch = res.data;
			}
		}
		branchService.getBranches({}, successBranch)
	})();

	(function() {
		function successCourier(res) {
			if (res.data) {
				$scope.aCourier = res.data;
			}
		}
		vendorCourierService.getVendorCouriers({}, successCourier)
	})();

	/*$scope.CourierFunc = function(item) {
		function successGetOffice(response) {
			if (response && response.data) {
				$scope.aCourierOfc = response.data;
			}
		}

		function failGetOffice(res) {

		}
		if (item._id) {
			oFilter = {
				courier_vendor_id: item._id
			}
			vendorCourierService.GetCourierOfficeAll(oFilter, successGetOffice, failGetOffice);
		}

	};*/

	$scope.DispatchedFunc = function(v) {
		if (v === 'Courier') {
			$scope.show_me = true;
		} else {
			$scope.show_me = false;
		}
	};

	$scope.dispatchInvoice = function() {
		var oSend = {};
		oSend.status = 'Dispatched';
		oSend.branch = $scope.bill.branch._id;
		oSend.dispatched_via = $scope.bill.dispatched_via;
		oSend.dispatched_by = $scope.bill.dispatched_by;
		oSend.dispatched_by_date = $scope.bill.dispatched_by_date;
		if($scope.bill.due_date) oSend.due_date = $scope.bill.due_date;
		if ($scope.bill.dispatched_via === 'Courier') {
			oSend.courier = $scope.bill.courier._id;
			oSend.courier_date = $scope.bill.courier_date;
		}
		salesOrderService.dispatchInvoice($scope.bill._id, oSend, function(res) {
			$scope.closeModal('RELOAD', res.data.message);
		}, function(err) {
			$scope.closeModal();
		});
	};
});

materialAdmin.controller("approveInvoiceController", function ($scope, $uibModalInstance, salesOrderService, invoice) {

	$scope.approve = function () {
		salesOrderService.updateInvoice({_id: invoice._id, status: 'Approved' },
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

materialAdmin.controller("declineInvoiceController", function ($scope, $uibModalInstance, salesOrderService, invoice, $window,userService,$localStorage) {

	$scope.rejectInvoice = function () {
		var oSend = angular.copy($scope.oSend);
		oSend.status = 'Cancelled';
		oSend.cancelled_by = $localStorage.ft_data.userLoggedIn._id;
		oSend.cancelled_by_date = new $window.Date();
		salesOrderService.dispatchInvoice(invoice._id, oSend,
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

materialAdmin.controller("previewSOController", function ($scope, $uibModalInstance, salesOrderService) {

	$scope.closeModal = function (msg) {
		$uibModalInstance.close(msg || 'NO_RELOAD');
	};

});
