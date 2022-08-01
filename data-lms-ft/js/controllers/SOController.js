materialAdmin.controller("SOController",
	function ($rootScope, $stateParams, $state, $scope, userService, $localStorage, growlService, constants, salesOrderService, $uibModal, customer, spareService, $filter, ReportService) {

		var lastFilter;
		$scope.aPriority = ["Low", "Medium", "High"];
		$scope.aStatus = ["Unapproved", "Approved", "Declined", "Partially Invoiced", "Fully Invoiced"];

		function prepareFilterObject(isPagination) {
			var allowedKey = ['so_number', 'approver', 'status', 'priority'];
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

		$scope.getSO = function (isPagination) {
			var oFilter = prepareFilterObject(isPagination);
			lastFilter = oFilter;
			salesOrderService.salesOrder(oFilter, function (res) {
				$scope.aSO = res.data;
			}, function (err) {
				console.log(err);
			});
		};
		$scope.getSO();

		$scope.getAllSOapprover = function () {
			spareService.getAllPRapproverCustom({}, function (data) {
				$scope.aApprover = data;
			});
		};
		$scope.getAllSOapprover();

		$scope.selectThisRow = function (oSO, index) {
			$scope.selectedSO = oSO;
			$($('.soTable tbody tr')).removeClass('grn');
			var row = $($('.soTable tbody tr')[index]);
			row.addClass('grn');
		};

		$scope.approveSO = function () {
			if ($scope.selectedSO.status === 'Unapproved') {
				var modalInstance = $uibModal.open({
					templateUrl: 'views/quotation/approveSOPopup.html',
					controller: 'approveSOController',
					resolve: {
						so: function () {
							return angular.copy($scope.selectedSO);
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

		$scope.declineSO = function () {
			if ($scope.selectedSO.status === 'Unapproved') {
				var modalInstance = $uibModal.open({
					templateUrl: 'views/quotation/declineSOPopup.html',
					controller: 'declineSOController',
					resolve: {
						so: function () {
							return angular.copy($scope.selectedSO);
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

		$scope.previewSO = function () {
			salesOrderService.previewSO({ _id: $scope.selectedSO._id }, function (res) {
				var modalInstance = $uibModal.open({
					template: res,
					controller: 'previewSOController'
				});
				modalInstance.result.then(function (msg) { }, function () { });
			}, function (err) { });
		};

		$scope.redirectForGenerateInvoicePage = function () {
			$state.go('sales_order.generateInvoice', {
				so_id: $scope.selectedSO._id
			});
		};

		$scope.downloadReport = function (isPagination) {
			if ($scope.aSO && $scope.aSO.length) {
				var oFilter = prepareFilterObject(isPagination);
				lastFilter = oFilter;
				oFilter.downloadExcel = true;
				ReportService.getSoReport(oFilter, function (data) {
					var a = document.createElement('a');
					a.href = data.data.url;
					a.download = data.data.url;
					a.target = '_blank';
					a.click();
				});
			} else {
				swal("warning", "SO not available.", "warning");
			}
		};

	});

materialAdmin.controller("generateInvoiceController", function (spareService, SLDOServices, $modal, customer, $timeout,$scope, $state, $stateParams, GPSService, salesOrderService, $localStorage) {
	const so_id = $stateParams.so_id;
	if (!so_id) {
		$state.go('sales_order.so');
		return;
	}

	$scope.show = true;
	$scope.globalErr = false;
	$scope.errMsg = "Invalid";

	/*$scope.isGstApplied = null;
	$scope.gstPercentToApply = 5;
	$scope.askToAppyGstOrNot = true;*/

	$scope.imei_list = {};
	$scope.imeis = {};

	$scope.clearSearch = function() {
		$scope.billingParty = null;
		$scope.aCustomers = null;
		$scope.isGenInvDis();
	};

	$scope.clearSearch1 = function() {
		$scope.ship_to = null;
		$scope.aShippingParties = null;
		$scope.isGenInvDis();
	};

	$scope.clearInvoiceApproverSearch = function() {
		$scope.approver = null;
		$scope.approvers = null;
		$scope.isGenInvDis();
	};

	$scope.getCustomers = function(val) {
		if(!val) {
			$scope.aCustomers = null;
		}
		if(val && typeof val === 'string' && val.length > 2)  {
			var t = JSON.stringify(['Billing party']);
			customer.getAllCustomersNew({name: val, type: t}, function(data) {
				$scope.aCustomers = data.data;
			});
		} else if(val._id) {
			customer.getAllCustomersNew(val, function(data) {
				$scope.billingParty = data.data[0];
				if($localStorage.ft_data.client_config.gstin_no.substr(0, 2) === $scope.billingParty.state_code) {
					$scope.gstType = 'cgst';
				}
				else {
					$scope.gstType = 'igst';
				}
			});
		} else {
			$scope.aCustomers = null;
		}
	};

	$scope.getShippingParties = function(val) {
		customer.getAllCustomersNew({name: val || '', type: JSON.stringify(['Consignee'])}, function(data) {
			$scope.aShippingParties = data.data;
		});
		/*SLDOServices.getCname(val || '', function(res) {
			$scope.aShippingParties = res.data.data;
		}, function(err) {});*/
	};

	$scope.getSO = function () {
		salesOrderService.salesOrder({ _id: so_id }, function (res) {
			var so = res.data[0];
			so.items = so.items.map(function (item) {
				return {
					...item,
					...item.item_ref,
					so_number: so.so_number,
					so_ref: so._id
				};
			});
			$scope.selectedSO = so;
			$scope.getCustomers({_id: res.data[0].customer._id});
		}, function (err) {});
	};
	$scope.getSO();

	$scope.isGenInvDis = function() {
		if($scope.globalErr) {
			return false;
		}
		if(!$scope.approver) {
			return false;
		}
		if(!$scope.approver._id) {
			return false;
		}
		if(!$scope.billingParty) {
			return false;
		}
		if(!$scope.billingParty._id) {
			return false;
		}
		if(!$scope.ship_to) {
			return false;
		}
		if(!$scope.ship_to._id) {
			return false;
		}
		if(!$scope.selectedSO) {
			return false;
		}
		if(!$scope.selectedSO.items) {
			return false;
		}
		return $scope.selectedSO.items.every(function(item, index) {
			if(!item.imei_list) {
				return false;
			}
			if(!item.imei_list.length) {
				return false;
			}
			return item.imei_list.length === item.quantity;
		});
	};

	$scope.getDevice = function (pid,i) {
		GPSService.getDevice({ stock_status: 'In stock', part_ref: pid, trim: true, all: true }, function (res) {
			$scope.imei_list[i] = res.data.map(function (imei, index) {
				return imei.imei;
			});
		}, function (err) {});
	};

	$scope.addRemoveIMEI = function (item, imeis, i) {
		item.item_ref = item._id;
		item.imei_list = imeis;
	};

	$scope.quantityChangeHandler = function (item) {
		if (item.quantity > item.remaining_quantity) {
			item.err = true;
			$scope.globalErr = true;
		} else {
			item.err = false;
			$scope.globalErr = false;
		}
		$scope.show = false;
    	$timeout(function(){
      		$scope.show = true;
    	});
	};

	$scope.calcTotal = function (q) {
		var subtotalWithoutDiscount = q.price_per_unit * q.quantity;
		var subtotalWithDiscount = subtotalWithoutDiscount - (q.discount_percent / 100 * subtotalWithoutDiscount);
		if($scope.gstType === 'igst') {
			q.igst_amount = +(q.igst_percent / 100 * subtotalWithDiscount).toFixed(2);
			var subtotalWithTax = subtotalWithDiscount + q.igst_amount;
		} else {
			var gstAmt = ((q.cgst_percent + q.sgst_percent) / 100 * subtotalWithDiscount);
			q.cgst_amount = +(gstAmt/2).toFixed(2);
			q.sgst_amount = +(gstAmt/2).toFixed(2);
			var subtotalWithTax = subtotalWithDiscount + gstAmt;
		}
		q.total = +subtotalWithTax.toFixed(2);
		return q.total;
	};

	$scope.calcTotatOfAllItems = function () {
		if ($scope.selectedSO) {
			var a = $scope.selectedSO.items.reduce(function (acc, currVal, index) {
				return acc + currVal.total;
			}, 0);
			$scope.totalOfAll = +a.toFixed(2);
			return +a.toFixed(2);
		}
	};

	$scope.generateInvoice = function () {
		var data = {};
		data.customer = $scope.billingParty._id;
		data.approver = $scope.approver._id;
		var selectedeSOCopy = angular.copy($scope.selectedSO);
		data.items = selectedeSOCopy.items.map(function (item, index) {
			if($scope.gstType === 'igst') {
				delete item.cgst_percent;
				delete item.cgst_amount;
				delete item.sgst_percent;
				delete item.sgst_amount;
			} else {
				delete item.igst_percent;
				delete item.igst_amount;
			}
			delete item.category_code;
			delete item.category_name;
			delete item.code;
			delete item.name;
			delete item.quot_number;
			delete item.quot_ref;
			delete item.uom;
			delete item.remaining_quantity;
			delete item.tax_percent;
			delete item.err;
			return item;
		});
		data.total_quantity = selectedeSOCopy.items.reduce(function(acc, currVal, i) {
			return acc + currVal.quantity;
		}, 0);
		data.subtotal2 = $scope.totalOfAll;
		data.ship_to = $scope.ship_to._id;
		data.additional_notes = $scope.additional_notes;
		salesOrderService.addInvoice(data, function(res) {
			swal('Yesss!', res.message, 'success');
			$state.go('sales_order.so', {}, {reload: true});
		}, function(err) {
			console.log(err);
			swal('Ooops!', err.data.message, 'error');
			$state.go('sales_order.so', {}, {reload: true});
		});
	};

	$scope.removeGST = function() {
		$scope.selectedSO.items.forEach(function(val, i) {
			val.sgst_percent = 0;
			val.cgst_percent = 0;
			val.igst_percent = 0;
		});
	};

	$scope.getInvoiceApprovers = function () {
		spareService.getInvoiceApprovers({}, function (res) {
			$scope.approvers = res.data.data;
		});
	};

});

materialAdmin.controller("approveSOController", function ($scope, $uibModalInstance, salesOrderService, so) {

	$scope.approve = function () {
		salesOrderService.updateSO(so._id, { status: 'Approved' },
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

materialAdmin.controller("declineSOController", function ($scope, $uibModalInstance, salesOrderService, so) {

	$scope.declineSO = function () {
		salesOrderService.updateSO(so._id, { status: 'Declined' },
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
