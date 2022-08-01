materialAdmin.controller("quoteToSOController",
	function ($rootScope, $stateParams, $state, $scope, userService, $localStorage, growlService, constants, salesOrderService, $uibModal, customer, spareService,$filter) {

		var selectedQuoteID;
		$scope.soapprmsg = '';
		$scope.customer = null;

		$scope.aPayTerms = [
			'100% AGAINST DELIVERY',
			'100% ADVANCE',
			'CASH PAID',
			'50% ADVANCE, BALANCE AGAINST DELIVERY',
			'50% ADVANCE, BALANCE PRIOR TO DISPATCH OF MATERIAL.',
			'100% WITHIN 3 TO 4 WEEKS',
			'100% WITHIN 1 WEEK AFTER DELIVERY'
		];
		$scope.aFreightTerms = [
			'INCLUSIVE',
			'FREIGHT EXTRA AS ACTUAL',
			'FREIGHT TO BE PAID',
			'FREIGHT TO BE BILLED'
		];

		$scope.$watch('customer', function(newVal, oldVal) {
			if(newVal !== null && typeof newVal === 'object' && newVal._id) {
				$scope.getCustomerSalesOrder();
				$scope.getQuotations();
			}
		});

		$scope.getCustomers = function (val) {
			if (val && typeof val === 'string' && val.length > 2) {
				customer.getAllcustomers({ name: val || '' }, function (data) {
					$scope.customers = data.data;
				});
			}
		};

		$scope.getCustomerSalesOrder = function () {
			salesOrderService.salesOrder({
				customer: $scope.customer._id,
				status: 'Unapproved'
			}, function (data) {
				$scope.allSaleOrders = data.data;
			}, function (err) { });
		};

		$scope.createSONew = function () {
			salesOrderService.getNewSO({
				customer: $scope.customer._id
			}, function (data) {
				swal(data.message, '', 'success');
				$scope.allSaleOrders.push(data.data);
				$scope.selectedSaleOrder = data.data;
				$scope.getAllSOApprover();
			}, function (err) {
				console.log(err);
			});
		};

		$scope.saleOrderChange = function (newSelectedSO) {
			$scope.soapprmsg = '';
			$scope.getAllSOApprover();
			$scope.selectedSaleOrder = newSelectedSO;
		};

		function calculateAndAppendData(soBody) {
			let total_quantity = 0;
			let total_discount = 0;
			let total_tax = 0;
			let subTotal1 = 0;
			let subTotal2 = 0;
			if (soBody.items && soBody.items.length>0) {
				for (let y = 0; y < soBody.items.length; y++) {
					let rowTotalBefore = (soBody.items[y].price_per_unit * soBody.items[y].quantity);
					let current_disc_amt = (rowTotalBefore * soBody.items[y].discount_percent)/100;
					let current_tax_amt = ((rowTotalBefore - current_disc_amt) * soBody.items[y].tax_percent)/100;
					let rowTotalAfter = rowTotalBefore - current_disc_amt + current_tax_amt;
					soBody.items[y].total = +rowTotalAfter.toFixed(2);

					subTotal1 += rowTotalBefore;
					subTotal2 += rowTotalAfter;
					total_discount += current_disc_amt;
					total_tax += current_tax_amt;
					total_quantity += soBody.items[y].quantity;
				}
			}
			soBody.subtotal1 = +subTotal1.toFixed(2);
			soBody.total_discount = +total_discount.toFixed(2);
			soBody.total_tax = +total_tax.toFixed(2);
			soBody.subtotal2= +subTotal2.toFixed(2);
			let total = subTotal2 + (soBody.shipping_charges || 0) + (soBody.other_charges || 0);
			soBody.total = +total.toFixed(2);
			soBody.total_quantity = total_quantity;
		}

		$scope.updateSO = function () {
			if ($scope.selectedSaleOrder.approver) {
				var clonedItems = angular.copy($scope.selectedSaleOrder.items);
				angular.forEach(clonedItems, function(item) {
					delete item.name;
					delete item.category_name;
					delete item.remaining_quantity;
					delete item.uom;
					if(item.item_ref._id) {
						item.item_ref = item.item_ref._id;
					}
				});
				var clonedSlectedSaleOrder = angular.copy($scope.selectedSaleOrder);
				clonedSlectedSaleOrder.items = clonedItems;
				clonedSlectedSaleOrder.approver = clonedSlectedSaleOrder.approver._id;
				clonedSlectedSaleOrder.customer = clonedSlectedSaleOrder.customer._id;
				delete clonedSlectedSaleOrder.last_modified_by;
				delete clonedSlectedSaleOrder.quotations;

				calculateAndAppendData(clonedSlectedSaleOrder);
				salesOrderService.updateSO(clonedSlectedSaleOrder._id, clonedSlectedSaleOrder, function (res) {
					swal(res.data.message,'','success');
					$scope.soapprmsg = '';
					$state.go('sales_order.quote-so', {}, {reload: true});
				}, function (err) {
					swal(err.data.message,'','failure');
					$scope.soapprmsg = '';
				});
			} else $scope.soapprmsg = 'required';
		};

		$scope.quantityChangeInSOHandler = function(aQ) {
			let found = $scope.quotations.find(q => q._id === aQ.quot_ref).items.find(item => item._id === aQ._id);
			if(aQ.quantity > found.remaining_quantity) {
				aQ.quantity = found.remaining_quantity;
			}
		};

		$scope.pushToAddedQuotes = function (q, qn, qid) {
			var isFound = $scope.selectedSaleOrder.items.findIndex(item => item._id === q._id);
			if (isFound === -1) {
				$scope.selectedSaleOrder.items.push({
					...q,
					uom: q.item_ref.uom,
					category_name: q.item_ref.category_name,
					quot_number: qn,
					quot_ref: qid,
					item_ref: q.item_ref._id
				});
			}
		};

		$scope.removeQuot = function (q) {
			var isFound = $scope.selectedSaleOrder.items.findIndex(item => item._id === q._id);
			if (isFound !== -1) {
				$scope.selectedSaleOrder.items.splice(isFound, 1);
			}
		};

		$scope.getAllSOApprover = function () {
			spareService.getAllSOapproverServ({}, function (data) {
				$scope.aApprover = data.data.data;
			});
		};

		$scope.getQuotations = function (cb) {
			salesOrderService.getQuotations({
				customer: $scope.customer._id,
				quot_status: 'Approved for sale,Partially converted to SO'
			}, function (res) {
				$scope.quotations = res;
			}, function (err) { });
		};

		$scope.quoteChange = function (quote, i) {
			$scope.selectedQuote = quote;
			selectedQuoteID = quote._id;
		};

		$scope.clearCustomerSearch = function () {
			$scope.customer = null;
			$scope.customers = null;
			$scope.selectedSaleOrder = null;
		};

		$scope.calcTotal = function (q) {
			var subtotalWithoutDiscount = q.price_per_unit * q.quantity;
			var subtotalWithDiscount = subtotalWithoutDiscount - (q.discount_percent / 100 * subtotalWithoutDiscount);
			var subtotalWithTax = subtotalWithDiscount + (q.tax_percent / 100 * subtotalWithDiscount);
			q.total = +subtotalWithTax.toFixed(2);
			return q.total;
		};

		$scope.show = function () {
			return $scope.customer !== null && typeof $scope.customer === 'object' && $scope.customer._id;
		};

	});
