materialAdmin.controller('genBillController', genBillController);
materialAdmin.controller('genBillUpsertCtrl', genBillUpsertCtrl);

genBillController.$inject = [
	'$modal',
	'$scope',
	'$state',
	'$uibModal',
	'billsService',
	'billingPartyService',
	'DatePicker',
	'genBillService',
	'lazyLoadFactory',
	'stateDataRetain'
];
genBillUpsertCtrl.$inject = [
	'$modal',
	'$scope',
	'$state',
	'accountingService',
	'billsService',
	'DatePicker',
	'genBillService',
	'lazyLoadFactory',
	'materialService',
	'NumberUtil',
	'vendorFuelService',
	'Vendor',
	'Vehicle',
	'billingPartyService',
	'tripServices',
	'branchService',
	'billBookService',
	'$stateParams',
	'growlService',
];

function genBillController(
	$modal,
	$scope,
	$state,
	$uibModal,
	billsService,
	billingPartyService,
	DatePicker,
	genBillService,
	lazyLoadFactory,
	stateDataRetain,
) {

	let vm = this;

	// function identifier
	vm.DatePicker = angular.copy(DatePicker);

	vm.cancelBill = cancelBill;
	vm.printBill = printBill;
	vm.billApprove = billApprove;
	vm.getBills = getBills;
	vm.getBillingParty = getBillingParty;
	vm.remove = remove;
	vm.unApproveBill = unApproveBill;
	vm.upsertBill = upsertBill;
	vm.onStateRefresh = function (){
		vm.getBills();
	};

	// init
	(function init() {

		if(stateDataRetain.init($scope, vm))
			return;
		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.abillStatus = ["Unapproved", "Approved", "Cancelled"];
		vm.columnSetting = {
			allowedColumn: [
				'Bill No.',
				// 'Bill Type',
				'Status',
				'Billing Party',
				'Billing Party A/C',
				'Billing Date',
				// 'Due Date',
				'Allocated Freight',
				'CGST',
				'SGST',
				'IGST',
				'Total Tax',
				'Bill Amount',
				// 'Amount Received',
				// 'Due Amount',
				// 'Category',
				'Created By',
				'Remark',
			]
		};
		vm.tableHead = [
			{
				'header': 'Bill No.',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Bill Type',
				'bindingKeys': 'type'
			},
			{
				'header': 'Status',
				'bindingKeys': 'status'
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name'

			},
			{
				'header': 'Billing Party A/C',
				'bindingKeys': 'billingParty.billName'
			},
			{
				'header': 'Billing Date',
				'bindingKeys': 'billDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Due Date',
				'bindingKeys': 'dueDate | date:"dd-MMM-yyyy"',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Allocated Freight',
				'bindingKeys': 'amount'
			},
			// {
			// 	'header': 'Amount Received',
			// 	//'bindingKeys': '(this | calReceivedAmt)|roundOff',
			// 	'bindingKeys': '(this.recAmt || 0)|roundOff',
			// 	'eval': true
			// },
			// {
			// 	'header': 'Due Amount',
			// 	//'bindingKeys': '((this.billAmount - (this | calReceivedAmt)) || 0)|roundOff',
			// 	'bindingKeys': '(this.totDueAmt || 0)|roundOff',
			// 	'eval': true
			//
			// },
			{
				'header': 'CGST',
				'bindingKeys': 'cGST',
			},
			{
				'header': 'SGST',
				'bindingKeys': 'sGST'
			},
			{
				'header': 'IGST',
				'bindingKeys': 'iGST'
			},
			{
				'header': 'Total Tax',
				'bindingKeys': 'iGST ? iGST: cGST + sGST'
			},
			{
				'header': 'Bill Amount',
				'bindingKeys': 'billAmt'
			},
			{
				'header': 'Category',
				'bindingKeys': 'this.category',
				'date': false
			},
			{
				'header': 'Created By',
				'bindingKeys': 'created_by_name',
				'date': false
			},
			{
				'header': 'Remark',
				'bindingKeys': 'remark'
			}
		];

		// getBills();

	})();

	// Actual Function

	function upsertBill(isEdit) {
		if (isEdit) {
			$state.go('billing.genBillUpsert', {data: vm.selectedBill});
		} else {
			$state.go('billing.genBillUpsert');
		}
	}

	function getBills(isGetActive, isDownload) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();

		if (isDownload) oFilter.download = isDownload;

		if (isDownload && typeof isDownload === 'string')
			oFilter.billType = isDownload;

		genBillService.getGenBill(oFilter, function (res) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			} else if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function remove() {
		if(!vm.selectedBill)
			return;
		swal({
				title: 'Are you sure!!! you want to Remove Bill?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#03A218',
				cancelButtonColor: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirmU) {
				if (isConfirmU) {
					genBillService.removeGenBill({_id: vm.selectedBill._id}, success, failure);

					function success(res) {
						var message = res.message;
						swal('success', message, 'success');
						getBills();
					}

					function failure(res) {
						swal('Error', res.message, 'error');
					}

				}
			});
	}

	function unApproveBill() {
		if(!vm.selectedBill)
			return;

		if (!vm.selectedBill.acknowledge.status)
			return swal('Error', 'Bill Already unApproved', 'error');

		swal({
				title: 'Are you sure!!! you want to Remove Voucher?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#03A218',
				cancelButtonColor: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirmU) {
				if (isConfirmU) {
					genBillService.unApproveBill({_id: vm.selectedBill._id}, success, failure);

					function success(res) {
						var message = res.message;
						swal('success', message, 'success');
						getBills();
					}

					function failure(res) {
						swal('Error', res.message, 'error');
					}

				}
			});
	}

	function billApprove() {
		if(!vm.selectedBill)
			return;

		if (vm.selectedBill.acknowledge.status)
			return swal('Error', 'Bill Already Approved', 'error');

		swal({
				title: 'Are you sure!!! you want to Approve Bill?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#03A218',
				cancelButtonColor: 'btn-danger',
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true
			},
			function (isConfirmU) {
				if (isConfirmU) {
					let filter ={
						_id: vm.selectedBill._id,
						approve: true
					};
					genBillService.approveBill(filter, success, failure);

					function success(res) {
						var message = res.message;
						swal('success', message, 'success');
						getBills();
					}

					function failure(res) {
						swal('Error', res.message, 'error');
					}

				}
			});
	}

	function cancelBill (type) {
		if (!vm.selectedBill)
			return swal('Warning', 'Select at least one bill!!!!!', 'warning');

		if (vm.selectedBill.acknowledge.status)
			return swal('Error', 'Approved Bill Cannot Be cancelled', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/billCancellationPopup.html',
			controller: 'billCancellationORApprovePopup',
			resolve: {
				Type: function () {
					return type;
				},
				oBill: function () {
					return vm.selectedBill;
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log(response);

			function success(response) {
				console.log(response);
				swal('success', response.message, 'success');
				getBills();
				// $state.reload();
			}

			function failure(response) {
				console.log(response);
				swal('Error', response.message, 'error');
			}

			var reqObj = {};

			 if (type === 'Cancel') {
				reqObj._id = vm.selectedBill._id;
				reqObj.cancel_reason = response.reason;
				reqObj.cancel_remark = response.remark;
				 genBillService.cancelBill(reqObj, success, failure);
			}
		});
	}




	function printBill() {
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function(
					$scope,
					$uibModalInstance,
					clientService,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;

					$scope.aTemplate = $scope.$configs.Bill.genBill;
					$scope.templateKey = $scope.aTemplate[0];

					$scope.getGR = function(templateKey = 'default_') {

						var oFilter = {
							_id: otherData._id,
							billName: templateKey
						};

						clientService.getGenBillPreview(oFilter, success, fail);
					};

					$scope.getGR($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error','Something Went Wrong','error');
						$scope.closeModal();
					}

					$scope.closeModal = function() {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function() {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id){
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					return {
						_id:vm.selectedBill._id
					};
				}
			}
		});
	}

	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				billingPartyService.getBillingParty(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function prepareFilter() {
		let filter = {};

		if (vm.myFilter.billNo)
			filter.billNo = vm.myFilter.billNo;


		if (vm.myFilter.type)
			filter.billType = vm.myFilter.type;


		if (vm.myFilter.approved) {
			if (vm.myFilter.approved == 'true')
				filter['acknowledge.voucher'] = true;
			else
				filter['acknowledge.voucher'] = false;
		}

		if (vm.myFilter.start_date)
			filter.from = vm.myFilter.start_date;

		if (vm.myFilter.end_date)
			filter.to = vm.myFilter.end_date;

		if (vm.myFilter.billingParty)
			filter.billingParty = vm.myFilter.billingParty._id;

		if (vm.myFilter.status) {
			switch (vm.myFilter.status) {
				case 'Unapproved': {
					filter.status = 'Unapproved';
					break;
				}
				case 'Approved': {
					filter.status = 'Approved';
					filter.cancelled = {$ne: true};
					break;
				}
				case 'Cancelled': {
					filter.status = 'Cancelled';
					break;
				}
			}
		}

		if (vm.myFilter.dateType) filter.dateType = vm.myFilter.dateType;

		filter.no_of_docs = 20;
		filter.skip = vm.lazyLoad.getCurrentPage();

		return filter;
	}
}

function genBillUpsertCtrl(
	$modal,
	$scope,
	$state,
	accountingService,
	billsService,
	DatePicker,
	genBillService,
	lazyLoadFactory,
	materialService,
	NumberUtil,
	vendorFuelService,
	Vendor,
	Vehicle,
	billingPartyService,
	tripServices,
	branchService,
	billBookService,
	$stateParams,
	growlService
) {

	let vm = this;

	vm.accountmaster = accountmaster;
	vm.onRowClick = onRowClick;
	vm.addItems = addItems;
	vm.calculateSummary = calculateSummary;
	vm.deleteitems = deleteitems;
	vm.getHSNCode = getHSNCode;
	vm.getMaterial = getMaterial;
	vm.getVname = getVname;
	vm.getAllBranch = getAllBranch;
	vm.getBillBookNo = getBillBookNo;
	vm.onHSNCodeSelect = onHSNCodeSelect;
	vm.getRate = getRate;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getAllAccount = getAllAccount;
	vm.getBillingParty = getBillingParty;
	vm.onBillNoSelect = onBillNoSelect;
	vm.onItemSelect = onItemSelect;
	vm.onBPSelect = onBPSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.submit = submit;

	(function init() {
		vm.isDisabled = false;
		vm.myFilter = {};
		vm.DatePicker = angular.copy(DatePicker);

		vm.amount = 0; // ∑(of Material + Repair/Labour amount without tax)
		vm.totalAmount = 0; // ∑(of Material + Repair/Labour amount with tax)
		vm.cGST = 0; // cGST% of vm.amount
		vm.sGST = 0; // sGST% of vm.amount
		vm.iGST = 0; // iGST% of vm.amount
		vm.aBill = {};
		vm.aItems = [];
		vm.aBill.billDate = new Date();
		vm.gstinNo = $scope.$clientConfigs.gstin_no;

		if($stateParams.data) {
			vm.isEdit = true;
			vm.aBill = $stateParams.data;
			vm.aItems = $stateParams.data.items;
			calculateSummary();
		}
		if(vm.aBill.billingParty)
			onBPSelect(vm.aBill.billingParty);
		if(vm.aBill.branch)
		onBranchSelect();

		if(vm.aBill.acknowledge && vm.aBill.acknowledge.salesAccount)
			vm.aBill.salesAccount = vm.aBill.acknowledge.salesAccount;
		if(vm.aBill.acknowledge && vm.aBill.acknowledge.cGSTAccount)
			vm.aBill.cGSTAccount = vm.aBill.acknowledge.cGSTAccount;
		if(vm.aBill.acknowledge && vm.aBill.acknowledge.sGSTAccount)
			vm.aBill.sGSTAccount = vm.aBill.acknowledge.sGSTAccount;
		if(vm.aBill.acknowledge && vm.aBill.acknowledge.iGSTAccount)
			vm.aBill.iGSTAccount = vm.aBill.acknowledge.iGSTAccount;
		if(vm.aBill.acknowledge && vm.aBill.acknowledge.discountAcnt)
			vm.aBill.discountAcnt = {_id: vm.aBill.acknowledge.discountAcnt, name: vm.aBill.acknowledge.discountAcName};

		vm.selectedClient = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		if(vm.selectedClient) {
			vm.aBill.sellerName = vm.selectedClient.name;
			vm.aBill.salesAccount = {_id: vm.selectedClient.salesAcc, name: vm.selectedClient.salesAccName};
			vm.aBill.iGSTAccount = {_id: vm.selectedClient.igstAcc, name: vm.selectedClient.igstAccName};
			vm.aBill.cGSTAccount = {_id: vm.selectedClient.cgstAcc, name: vm.selectedClient.cgstAccName};
			vm.aBill.sGSTAccount = {_id: vm.selectedClient.sgstAcc, name: vm.selectedClient.sgstAccName};
		}


	})();

	function onRowClick($index, obj) {
		vm.selectedIndex = $index;
		vm.oItems = angular.copy(obj);
		vm.flag = true;
	}
	// function definition

	function addItems(index) {
		if (!vm.taxType || !vm.oItems || !vm.oItems.gstPercent || !vm.oItems.qty || !vm.oItems.amount || !vm.oItems.qtyUnit || !vm.oItems.hsn) {
			swal('Error','Select tax type and all other fields','error');
			return;
		}
		let oPush = { ...vm.oItems };

		oPush.name = (oPush.name && oPush.name.name) ? oPush.name.name : oPush.name;
		oPush.subTotal = vm.oItems.amount * vm.oItems.qty;
		oPush.totAfterDiscount = oPush.subTotal - (vm.oItems.discount || 0);
		// vm.taxType === '1' for IGST
		let percent = vm.taxType === '1' ? vm.oItems.gstPercent : (vm.oItems.gstPercent / 2);
		oPush.cGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.sGSTPercent = vm.taxType === '1' ? 0 : percent;
		oPush.iGSTPercent = vm.taxType === '1' ? percent : 0;

		oPush.cGST = oPush.totAfterDiscount * oPush.cGSTPercent / 100;
		oPush.sGST = oPush.totAfterDiscount * oPush.sGSTPercent / 100;
		oPush.iGST = oPush.totAfterDiscount * oPush.iGSTPercent / 100;

		oPush.amountWithTax = oPush.totAfterDiscount + oPush.cGST + oPush.sGST + oPush.iGST;

		if (index != undefined) {
			vm.aItems[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		} else {
			vm.aItems.push(oPush);
		}

		vm.oItems = undefined;
		calculateSummary();
	}


	function calculateSummary() {

		vm.totalItemWithoutTax = 0;
		vm.totalItemWithTax = 0;
		vm.totDiscount = 0;
		vm.cGSTOfItem = 0;
		vm.sGSTOfItem = 0;
		vm.iGSTOfItem = 0;

		vm.aItems.forEach((mat) => {
			vm.totalItemWithoutTax += (mat.subTotal||0);
			vm.totalItemWithTax += (mat.amountWithTax||0);
			vm.cGSTOfItem += (mat.cGST||0);
			vm.sGSTOfItem += (mat.sGST||0);
			vm.iGSTOfItem += (mat.iGST||0);
			vm.rateItem += (mat.amount||0);
			vm.totDiscount += (mat.discount||0);
		});


		vm.aBill.amount = NumberUtil.toFixed(vm.totalItemWithoutTax - vm.totDiscount);
		vm.aBill.cGST = NumberUtil.toFixed(vm.cGSTOfItem);
		vm.aBill.sGST = NumberUtil.toFixed(vm.sGSTOfItem);
		vm.aBill.iGST = NumberUtil.toFixed(vm.iGSTOfItem);
		vm.aBill.totDiscount = NumberUtil.toFixed(vm.totDiscount);
		vm.totGST = vm.cGST + vm.sGST + vm.iGST;
		vm.aBill.amountWithTax = vm.aBill.amount + vm.aBill.cGST + vm.aBill.sGST + vm.aBill.iGST;
		vm.aBill.billAmt = NumberUtil.toFixed(vm.aBill.amountWithTax);
	}

	function onItemSelect($index, mat) {
		vm.oitemIndex = $index;
		vm.oitemId = mat.$$hashKey;
	}

	function deleteitems() {
		if(typeof vm.oItemIndex !== 'number') return;
		vm.aItems.splice(vm.oItemIndex, 1);
		calculateSummary();
	}

	function getBillBookNo(viewValue) {

		if (!(vm.aBill.billingParty && Array.isArray(vm.aBill.billingParty.billBook) && vm.aBill.billingParty.billBook.length)) {
			return growlService.growl(`No Stationary Book linked to ${vm.aBill.billingParty.name} Billing Party`, 'danger');
		}

		if (!vm.aBill.billDate) {
			swal('Error', `Bill No is mandatory`, 'error');
			return [];
		}

		let date = moment(vm.aBill.billDate, 'DD/MM/YYYY').toISOString();

		vm.billBookId =  vm.aBill.billingParty.billBook.map(o => o.ref);

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Bill',
				useDate: moment(date).startOf('day').toDate(),
				status: "unused"
			};
			if (!requestObj.billBookId)
				return vm.nonBillBook = true;
			// return swal('Erorr',`No Stationary Book linked to ${vm.billingParty.name} Billing Party`,'error');

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onBillNoSelect(item){
		vm.selectedRefNo = item;
	}

	function getAutoStationaryNo(backDate) {
		if (!(vm.aBill.billingParty && Array.isArray(vm.aBill.billingParty.billBook) && vm.aBill.billingParty.billBook.length)) {
			return growlService.growl(`No Stationary Book linked to ${vm.aBill.billingParty.name} Billing Party`, 'danger');
		}

		vm.billBookId =  vm.aBill.billingParty.billBook.map(o => o.ref);

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Bill',
			"auto": true,
			"sch": 'vch',
			status: "unused"
		};

		if(backDate)
			// req.backDate = backDate;
		req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.aBill.billNo = vm.aAutoStationary.bookNo;
			vm.selectedRefNo = vm.aAutoStationary;
		}
	}

	function getAllAccount(viewValue, group) {
		return new Promise(function (resolve, reject) {
			if(viewValue.length < 3) {
				return resolve([]);
			} else {
				accountingService.getAccountMaster({name: viewValue, group}, res => resolve(res.data.data), err => resolve([]));
			}
		});
	}

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				Vehicle.getNameTrim(viewValue, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	}

	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				billingPartyService.getBillingParty(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function onBPSelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || vm.taxType || '0';

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {

			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId === billingParty.clientId);
			vm.BpState_code=billingParty.state_code;
			vm.UserState_code=user.state_code;
			vm.billingParty=billingParty;
			vm.userGSTNo=vm.gstinNo;
			if (user) {
				vm.aBill.billingParty.clientName = user.name;
				// vm.taxType = billingParty.state_code === user.state_code ? '2' : '1';
				if($scope.$configs && $scope.$configs.salesBill && $scope.$configs.salesBill.branchBasedGST){
					if(vm.branchStateCode && vm.BpState_code){
						vm.taxType = vm.branchStateCode == vm.BpState_code ? '2' : '1';
					}else{
						vm.taxType = user.state_code == billingParty.state_code ? '2' : '1';
					}
					
				}else{
					vm.taxType = user.state_code == billingParty.state_code ? '2' : '1';
				}
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}
		vm.getRate()
	}

	function getAllBranch(viewValue, category) {
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

	function onBranchSelect() {
		vm.refNo = '';
		vm.billBookId = vm.aBill.branch.refNoBook ? vm.aBill.branch.refNoBook.map(o => o.ref) : '';
		if($scope.$configs && $scope.$configs.salesBill && $scope.$configs.salesBill.branchBasedGST){
			if(vm.BpState_code && vm.aBill && vm.aBill.branch && vm.aBill.branch.gstin){
				vm.taxType = vm.BpState_code == vm.aBill.branch.gstin.substring(0,2) ? '2' : '1';
				vm.gstinNo=vm.aBill && vm.aBill.branch && vm.aBill.branch.gstin;
			}else{
				vm.taxType = vm.BpState_code == vm.UserState_code ? '2' : '1';
				vm.gstinNo=vm.userGSTNo;
			}
			vm.branchStateCode=	vm.aBill.branch.gstin.substring(0,2);
			vm.gstinNo=vm.aBill && vm.aBill.branch && vm.aBill.branch.gstin;			
		}
	}

	function getHSNCode(viewValue) {
		return new Promise(function (resolve, reject) {
			if(viewValue.length < 1) {
				return resolve([]);
			}
			let req = {hsnCode: viewValue};

			materialService.getMaterialTypes(req, function success(res) {
				resolve(res.data);
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function onHSNCodeSelect(item) {
		vm.oItems = vm.oItems || {};
		vm.oItems.qtyUnit = item.unit;
		// vm.oItems.rate = item.rate;
		vm.oItems.qty = item.pUnitWt;
		vm.oItems.gstPercent = item.gstPercent;
	}

	function getRate(item) {
		return new Promise(function (resolve, reject) {

			if (!vm.oItems || !vm.oItems.hsn || !vm.aBill.billingParty || !vm.aBill.billDate)
				return;

			let request = {};

			if (vm.oItems && vm.oItems.hsn)
				request.hsnCode = vm.oItems.hsn;
			if (vm.aBill.billingParty && vm.aBill.billingParty._id)
				request.billingParty = vm.aBill.billingParty._id;
			if (vm.aBill.billDate){
				request.to  = moment(vm.aBill.billDate, 'DD/MM/YYYY').toISOString();
				request.to  = moment(request.to ).startOf('day').toDate();
			}

			tripServices.getRate(request, function success(res) {
				resolve(res.data);
				if(res.data && res.data.data){
					vm.aRate = res.data.data || [];
					vm.oItems.amount = vm.aRate[0].rate;
				}
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}


	function getMaterial(viewValue) {
		return new Promise(function (resolve, reject) {
			if(viewValue && viewValue.length < 1) {
				return resolve([]);
			}
			let req = {material: viewValue && viewValue.trim()};
			if(vm.oItems.hsn)
				req.hsnCode = vm.oItems.hsn;

			materialService.getMaterialTypes(req, function success(res) {
				resolve(res.data);
				if(res.data[0] && res.data[0].material){
					vm.allMaterial =  [];
					res.data[0].material.forEach(obj=>{
						vm.allMaterial.push({...res.data[0],name:obj});
					})
				}
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function(resolve, reject) {
				accountingService.getAccountMaster({name: viewValue}, res => resolve(res.data.data), err => reject(err));
			});
		}
	}

	function preserveData() {
		let oFilter = {
			sellerName:vm.aBill.sellerName,
			salesAccount:vm.aBill.salesAccount,
			branch:vm.aBill.branch,
			billDate:vm.aBill.billDate,
		};

		if(vm.taxType === '1')
			oFilter.iGSTAccount = vm.aBill.iGSTAccount;
		if(vm.taxType === '2') {
			oFilter.cGSTAccount = vm.aBill.cGSTAccount;
			oFilter.sGSTAccount = vm.aBill.sGSTAccount;
		}

		vm.aItems = [];
		vm.aBill = oFilter;
	}

	function submit(formData) {
		vm.aBill.billDate = moment(vm.aBill.billDate, 'DD/MM/YYYY').toISOString();
		vm.aBill.billDate = moment(vm.aBill.billDate).startOf('day').toDate();
		// if (formData.$valid) {

			if (!(vm.aItems.length)) {
				growlService.growl('Add atleast 1 Item', 'danger');
				return;
			}

			let oSend = {
				...vm.aBill,
				acknowledge: vm.aBill.acknowledge || {}
			};

			oSend.items = vm.aItems;
			oSend.approve = true;

			if (vm.totDiscount && !oSend.discountAcnt) {
				swal('Error!', 'Discount Account required', 'error');
				return;
			}

			if (oSend.billingParty) {
				oSend.billingParty = oSend.billingParty._id;
			}

			if (oSend.branch) {
				oSend.branch = oSend.branch._id;
			}

			if (oSend.salesAccount) {
				oSend.salesAccountName = oSend.salesAccount.name;
				oSend.salesAccount = oSend.salesAccount._id;
			}

			if (oSend.iGSTAccount) {
				oSend.iGSTAccountName = oSend.iGSTAccount.name;
				oSend.iGSTAccount = oSend.iGSTAccount._id;
			}

			if (oSend.cGSTAccount) {
				oSend.cGSTAccountName = oSend.cGSTAccount.name;
				oSend.cGSTAccount = oSend.cGSTAccount._id;
			}

			if (oSend.sGSTAccount) {
				oSend.sGSTAccountName = oSend.sGSTAccount.name;
				oSend.sGSTAccount = oSend.sGSTAccount._id;
			}

			if (oSend.discountAcnt) {
				oSend.discountAcName = oSend.discountAcnt.name;
				oSend.discountAcnt = oSend.discountAcnt._id;
			}

			if ((vm.selectedRefNo && vm.selectedRefNo.bookNo) === oSend.billNo) oSend.stationaryId = vm.selectedRefNo._id;
			else delete oSend.stationaryId;
	    	vm.isDisabled = true;
			if (vm.isEdit) {
				oSend._id = vm.aBill._id;
				genBillService.updateGenBill(oSend, onSuccess, onFailure);
			} else {
				genBillService.addGenBill(oSend, onSuccess, onFailure);
			}

			function onSuccess(res) {
				vm.isDisabled = false;
				swal('Success', res.message, 'success');
				if (vm.isPreserveData && !oSend._id) {
					preserveData();
				}else{
					vm.aBill = {};
					vm.aItems = [];
				}
			}

			function onFailure(err) {
				vm.isDisabled = false;
				swal('Error', err.message, 'error');
			}
		// } else{
		// 	if (formData.$error.required)
		// 		swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
		// 	else
		// 		swal('Form Error!', 'Form is not Valid', 'error');
		// }
	}


}
