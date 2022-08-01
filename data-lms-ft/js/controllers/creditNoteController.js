materialAdmin
	.controller("creditNoteController", creditNoteController)
	.controller("creditNoteUpsertController", creditNoteUpsertController);

creditNoteController.$inject = [
	'$scope',
	'$state',
	'$uibModal',
	'billsService',
	'billingPartyService',
	'creditNoteService',
	'DatePicker',
	'lazyLoadFactory',
	'stateDataRetain'
];
creditNoteUpsertController.$inject = [
	'$filter',
	'$scope',
	'$state',
	'$localStorage',
	'$stateParams',
	'$uibModal',
	'accountingService',
	'billsService',
	'branchService',
	'billBookService',
	'billingPartyService',
	'DatePicker',
	'creditNoteService',
	'NumberUtil'
];


function creditNoteController(
	$scope,
	$state,
	$uibModal,
	billsService,
	billingPartyService,
	creditNoteService,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain) {

	var vm = this;

	vm.DatePicker = DatePicker;
	vm.lazyLoad = lazyLoadFactory();
	vm.myFilter = {};
	$scope.onStateRefresh = function () {
		getCreditNote();
	};

	vm.creditNoteUpsert = creditNoteUpsert;
	vm.getCreditNote = getCreditNote;
	vm.rptDownload = rptDownload;
	vm.printBill = printBill;
	vm.remove = remove;
	vm.deleteMisc = deleteMisc;
	vm.unapprove = unapprove;
	vm.getBilling = getBilling;
	vm.miscCreditNotePopUp = miscCreditNotePopUp;

	// init
	(function init() {
		if (stateDataRetain.init($scope, vm))
			return;
		vm.selectType = 'index';
		vm.columnSetting = {
			allowedColumn: [
				'creditNo',
				'billNo',
				'Billing Party',
				'Category',
				'date',
				'amount',
				'Created By',
				'Created At',
				'Approved',
			]
		};
		vm.tableHead = [
			{
				'header': 'creditNo',
				'bindingKeys': 'creditNo',
				'date': false
			},
			{
				'header': 'billNo',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Billing Party',
				'bindingKeys': 'billingParty.name',
			},
			{
				'header': 'amount',
				'bindingKeys': 'totalAmount'
			},
			{
				'header': 'Reference',
				'bindingKeys': 'refNo',
				'date': false
			},
			{
				'header': 'date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Created By',
				'bindingKeys': 'createdBy'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			},
			{
				'header': 'Approved',
				'bindingKeys': 'this.voucher ? "Yes" : "No"',
				$eval: true
			},
			{
				'header': 'Category',
				'bindingKeys': 'category'
			},
		];
		// getCreditNote();
	})();

	//filter for Invoice
	function prepareFilter() {
		var myFilter = {};
		if (vm.myFilter.creditNo) {
			myFilter.creditNo = vm.myFilter.creditNo;
		}
		if (vm.myFilter.billNo) {
			myFilter.billNo = vm.myFilter.billNo;
		}
		if (vm.myFilter.billingParty && vm.myFilter.billingParty._id) {
			myFilter.billingParty = vm.myFilter.billingParty._id;
		}
		if (vm.myFilter.start_date) {
			myFilter.start_date = vm.myFilter.start_date;
		}
		if (vm.myFilter.end_date) {
			myFilter.end_date = vm.myFilter.end_date;
		}
		if (vm.myFilter.dateType) {
			myFilter.dateType = vm.myFilter.dateType;
		}
		if(vm.myFilter.voucher) {
			if(vm.myFilter.voucher === 'approve') {
				myFilter.voucher = {$exists: true};
			} else if (vm.myFilter.voucher === 'unApprove') {
				myFilter.voucher = {$exists: false};
			}
		}
		myFilter.no_of_docs = 30;
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.sort = {date: -1};
		return myFilter;
	}

	function unapprove() {
		creditNoteService.unapprove({
			_id: vm.oSelectedCreditNo._id
		}, onSuccess, err => {
			console.log(err)
		});

		function onSuccess(res) {
			swal('Success', res.message, 'success');
		}
	}

	function miscCreditNotePopUp(operationType = 'Add') {

		vm.oSelectedCreditNo = vm.oSelectedCreditNo || {};

		$uibModal.open({
			templateUrl: 'views/bills/miscCreditNotePopup.html',
			controller: ['$filter',
				'$scope',
				'$state',
				'$localStorage',
				'$stateParams',
				'$uibModal',
				'$uibModalInstance',
				'accountingService',
				'billsService',
				'branchService',
				'billBookService',
				'billingPartyService',
				'branchService',
				'DatePicker',
				'creditNoteService',
				'NumberUtil',
				'aCreditNote',
				miscCreditNotePopUpController],
			controllerAs: 'mcnVm',
			size: 'xl',
			resolve: {
				aCreditNote: function () {
					return {
						oSelectedCreditNo: vm.oSelectedCreditNo,
						operationType: operationType
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			 vm.oSelectedCreditNo = response;
			// getTrips();
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({name: viewValue}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function creditNoteUpsert(type) {
		if (type == 'add')
			$state.go('billing.creditNoteUpsert');
		else if (type == 'edit')
			$state.go('billing.creditNoteUpsert', {data: vm.oSelectedCreditNo});
	}

	function getCreditNote(isGetActive, isDownload) {
		if (isDownload) {
			if (!vm.myFilter.start_date || !vm.myFilter.end_date) {
				return swal('Error', 'Start and End Date is required', 'error');
			} else if (vm.myFilter.start_date > vm.myFilter.end_date) {
				return swal('Error', 'Start date should be less than end date', 'error');
			}
		}

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilter();
		oFilter.populate = ['billingParty', 'branch'];
		if (isDownload) oFilter.download = isDownload;
		creditNoteService.getCreditNote(oFilter, function (response) {
			if (isDownload) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else if (response && response.data) {
				response = response.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			}
		});


		/*
		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			}
		}*/
	}

	function rptDownload(type) {
		let request = prepareFilter();
		request.download = type;
		if(!(request.start_date || request.end_date))
			return swal('', 'From & To Date are mandatory', 'error');

		creditNoteService.rpt(request, function (response) {
			if(response.url){
				let a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			}
		});
	}

	function printBill() {
		if (!vm.oSelectedCreditNo)
			return swal('Warning', 'Select at least one Credit Note!!!!!', 'warning');

		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function (
					$scope,
					$uibModalInstance,
					clientService,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;

					$scope.aTemplate = otherData.aBillTemplate;
					$scope.templateKey = $scope.aTemplate[0];

					$scope.getGR = function (templateKey = 'default') {

						var oFilter = {
							_id: otherData._id,
							cNoteName: templateKey
						};

						clientService.getCreditNotePreview(oFilter, success, fail);
					};

					$scope.getGR($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error', 'Something Went Wrong', 'error');
						$scope.closeModal();
					}

					$scope.closeModal = function () {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function () {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id) {
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0].key}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					let aTemplate = ($scope.$constants.aCreditNoteTemplate || []);
					return {
						_id: vm.oSelectedCreditNo._id,
						aBillTemplate: aTemplate,
					};
				}
			}
		});
	}

	function remove() {
		creditNoteService.remove({
			_id: vm.oSelectedCreditNo._id
		}, onSuccess, err => {
			swal('Error', err.message, 'error');
		});

		function onSuccess(res) {
			swal('Success', res.message, 'success');
		}
	}

	function deleteMisc() {
		if(!(vm.oSelectedCreditNo && vm.oSelectedCreditNo._id))
			return;

			swal({
					title: 'Do you really want to Delete this Credit Note?',
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
						creditNoteService.deleteMiscCreditNote({
							_id: vm.oSelectedCreditNo._id
						}, onSuccess, onFailure);

						function onSuccess(res) {
							swal('Success', res.message, 'success');
							getCreditNote();
						}
						function onFailure(err) {
							swal('Error', err.message, 'error');
						}
					}
				});
		}
}

function creditNoteUpsertController(
	$filter,
	$scope,
	$state,
	$localStorage,
	$stateParams,
	$uibModal,
	accountingService,
	billsService,
	branchService,
	billBookService,
	billingPartyService,
	DatePicker,
	creditNoteService,
	NumberUtil
) {
	// object Identifiers
	var vm = this;
	vm.filter = {};
	vm.oCreditNote = {};

	// functions Identifiers
	vm.addDeduction = addDeduction;
	vm.addMiscellaneousGr = addMiscellaneousGr;
	vm.calculateAmount = calculateAmount;
	vm.getAccount = getAccount;
	vm.getBill = getBill;
	vm.getCnBookNo = getCnBookNo;
	vm.getCreditNote = getCreditNote;
	vm.getCreditNoteByCreditNo = getCreditNoteByCreditNo;
	vm.onCategoryChange = onCategoryChange;
	vm.onCNoteSelect = onCNoteSelect;
	vm.refreshBillamt = calculateAmount;
	vm.refreshDeduction = refreshDeduction;
	vm.removeDeduction = removeDeduction;
	vm.removeMiscellaneousGr = removeMiscellaneousGr;
	vm.selectBill = selectBill;
	vm.submit = submit;

	// INIT functions
	(function init() {
		if (!$stateParams.data) {
			vm.readonly = true;
			calculateAmount();
			vm.disableSubmit = false;
		}

		/*
		* the "generateReverseVoucher" manages the voucher reverse toggle button on UI
		* In case of add this button is by default checked and user can toggle it, if the Money Receipt isn't generated on it.
		* In case of edit this button is disabled if Money Receipt is generated and checked if it was checked while adding. Also, if this key is again enabled if the money receipt is deleted.
		* */
		vm.generateReverseVoucher = {
			visible: true,
			value: false,
			disable: false
		};

		vm.isBillWithoutGr = false;
		vm.oCreditNote.totalAmount = 0;

		if ($stateParams.data && $stateParams.data.billSettlement) {
			vm.readonly = false;
			vm.aBill = $stateParams.data.billSettlement;
			vm.billNo = vm.aBill[0].billNo;
			calculateAmount();
			calEachItemDeductionReceived();
		} else if ($stateParams.data) {
			vm.readonly = false;
			getCreditNote($stateParams.data._id);
		}

	})();

	// Actual Functions

	/*
	* All the deduction applied that has been applied on Money Receipt, for them we generate Credit Note to Balance off the account.
	* In this function we distribute deduction of respective gr that doesn't belong to any Credit Note.
	* */
	function showDeductionWithoutCreditNote() {
		let oBill = vm.aBill[0];
		oBill.receiving.deduction.forEach(oRecDec => {
			if (oRecDec.cNoteRef || !oRecDec.grRef)
				return;

			let fdItem = oBill.items.find(oItem => oItem.gr._id === oRecDec.grRef);

			if (!fdItem)
				return;

			fdItem.aDeduction = fdItem.aDeduction || [];
			fdItem.aDeduction.push({
				amount: oRecDec.amount,
				genFrom: oRecDec.genFrom,
				deductionType: oRecDec.deductionType,
				remark: oRecDec.remark,
				...oRecDec
			});
		});
	}

	/*
	* this function add deduction
	* */
	function addDeduction() {
		vm.selectedItem.aDeduction.push({});
		refreshDeduction();
	}

	/*
	* this function remove deduction
	* */
	function removeDeduction() {
		vm.dedSelectedItem.aDeduction.splice(vm.selectedDeductionIndex, 1);
		calculateAmount();
		refreshDeduction();
	}

	/*
	* this function restrict duplicated deduction applied on same gr of credit note
	* */
	function refreshDeduction() {
		if($scope.$configs.creditNote.dedAccPrefill) {
			// default account for mmp set to sales a/c
			getAccount('Sales A/c', ['Receipt Deduction']).then(data => {
				vm.aBill[0].items.forEach(oItem => {
					oItem.aDeduction.forEach(oDed => {
						if(data && data[0] && data[0].name === 'Sales A/c')
						oDed.deductionAccount = oDed.deductionAccount || data[0];
					});
				});
			},err => {console.log(err)});
		}
		let aDeductionConstant = $scope.$constants.deductionObj;
		vm.aBill[0].items.forEach(oItem => {
			oItem.aDeduction.forEach(oDed => {
				oDed.aDeductionTypeConstant = aDeductionConstant.filter(oConstDed => !oItem.aDeduction.find(oNestedDed => oNestedDed.deductionType != oDed.deductionType ? oNestedDed.deductionType === oConstDed.name : false));
			});
		});
	}

	/*
	* this function gives a provision for adding deduction directly on bill without gr
	* it add an NA Gr item on bill and user can select this NA Gr and apply deduction on it.
	* */
	function addMiscellaneousGr() {
		vm.aBill[0].items.push({
			gr: {},
			totFreight: 0,
			isMiscellaneous: true
		});
		vm.isMiscellaneousAdded = true;
	}

	function removeMiscellaneousGr() {
		vm.aBill[0].items = vm.aBill[0].items.filter(o => !o.isMiscellaneous);
		vm.isMiscellaneousAdded = false;
	}

	// fetch credit note by Id or CreditNo
	function getCreditNote(_id, creditNo) {

		let request = {
			no_of_docs: 1,
			populate: ['billRef']
		};

		if (_id)
			request._id = _id;
		else if (creditNo)
			request.creditNo = creditNo;
		else
			return;

		creditNoteService.getCreditNote(request, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			try {
				if (response && response.data) {
					vm.readonly = false;
					response = response.data.data[0];
					toBillData(response);
					vm.filter = {};
					refreshDeduction();
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	/*
	* this function extract the Bill Data from the Credit note fetched.
	* then entire html and angular binding is done on the basis of Bill Data. so when the credit note is fetched then
	* the Bill Data is extracted from credit note and shown on UI.
	* */
	function toBillData(oCreditNote) {
		if (oCreditNote.billRef) {
			vm.billNo = oCreditNote.billRef.billNo;
			vm.oCreditNote = oCreditNote;
			vm.aBill = Array.isArray(oCreditNote.billRef) ? oCreditNote.billRef : [oCreditNote.billRef];
			vm.aBill[0].receiving = vm.aBill[0].receiving || {};
			vm.aBill[0].receiving.deduction = vm.aBill[0].receiving.deduction || [];
			vm.aBill[0].receiving.moneyReceipt = vm.aBill[0].receiving.moneyReceipt || [];
			let taxPercent = vm.aBill[0].cGST_percent + vm.aBill[0].sGST_percent + vm.aBill[0].iGST_percent;

			if (vm.aBill[0].receiving.moneyReceipt.length)
				vm.generateReverseVoucher.disable = true;
			vm.oCreditNote.genRevVch = !!vm.oCreditNote.genRevVch;

			// In case of credit note full(gr reversal) the gr is unlinked so the grNumber and other gr details aren't visible so we replace the gr with grData(which is the copy of the linked gr)
			vm.aBill[0].items.forEach(o => {
				if (!(o.gr && o.gr._id) && o.grData) {
					o.gr = o.grData;
					o.gr._id = o.gr.grId;
				}
			});

			if (vm.aBill[0].items.length === 0 || !vm.aBill[0].items[0].totFreight) {
				vm.isBillWithoutGr = true;
				genEmptyGr(vm.aBill[0]);
			}

			oCreditNote.grs.forEach(function (item) {
				if (item.deductionAccount) // preparing deduction account object similar to typeahead search object
					item.deductionAccount = item.dedAccName ? {
						_id: item.deductionAccount,
						name: item.dedAccName
					} : item.deductionAccount;

				let fdItem = vm.aBill[0].items.find(obj => obj.gr.grNumber === item.grNumber);
				// let fdDed = vm.aBill[0].receiving.deduction.find(o => o.deductionType ? (o.deductionType === item.deductionType && (o.grRef === item.grRef)) : (o.grRef === item.grRef));
				// Object.assign(item, fdDed);

				// the amount saved on creditNote.grs.amount is always inclusive of tax i.e. ∑(grs.amount) is equal to creditNote.totalAmount
				if (vm.oCreditNote.genRevVch)
					item.amount = NumberUtil.toFixed((item.amount * 100) / (100 + taxPercent)) || 0;

				if (fdItem) {
					fdItem.aDeduction = fdItem.aDeduction || [];
					fdItem.aDeduction.push(item);
				} else {
					let lastItem = vm.aBill[0].items[vm.aBill[0].items.length - 1];
					if (lastItem.gr._id) {
						addMiscellaneousGr();
						lastItem = vm.aBill[0].items[vm.aBill[0].items.length - 1];
					}
					lastItem.aDeduction = lastItem.aDeduction || [];
					lastItem.aDeduction.push(item);
				}

				if (vm.oCreditNote.category == 'Full(Gr Reversal)' && fdItem.aDeduction.length) {
					fdItem.checked = true;
					fdItem.disableCheck = true;
				}
			});

			getWithHoldAcc();

		}

		vm.cnBookId = vm.aBill[0].billingParty.cnBook.filter(o => !!o).map(o => o.ref);
		vm.showBillNo = true;

		showDeductionWithoutCreditNote();
		calEachItemDeductionReceived();
		calculateAmount();
		resetOnFullCreditNote();
	}

	function getWithHoldAcc() {
		getAccount(false, [], vm.aBill[0].billingParty.withHoldAccount)
			.then(function (aData) {
				vm.aBill[0].billingParty.withHoldAccount = aData[0];
			})
	}

	function onCategoryChange() {

		if (vm.isBillWithoutGr) {
			if(vm.oCreditNote.category === 'Full'){
				genEmptyGr();
				removeMiscellaneousGr();
			}else {
				removeEmptyGr();
				addMiscellaneousGr();
			}
		}

		if (vm.oCreditNote.category == 'Partial') {
			vm.aBill.forEach(oBill => {
				oBill.items.forEach(oItem => {
					oItem.aDeduction = [];
				});
			});
		} else if (vm.oCreditNote.category == 'Full(Gr Reversal)' || vm.oCreditNote.category == 'Full') {
			vm.oCreditNote.genRevVch = false;
			if (vm.aBill[0].items.length === 0 || typeof vm.aBill[0].items[0].totFreight == "undefined")
				vm.oCreditNote.genRevVch = true;
			vm.aBill.forEach(oBill => {
				oBill.items.forEach(oItem => {
					oItem.aDeduction = [{
						genFrom: 'cn',
						amount: oItem.grAmountWithTax
					}]
				});
			});
			removeMiscellaneousGr();
		}

		calculateAmount();
		resetOnFullCreditNote();
	}

	/*
	* this function manage the internal and overall amount calculation on the fetched bill
	* "genRevVch" => when the value of this key is true then the nature of its implementation differs on the bases of credit note category. when it's -
	* 				1) "full" => then the bill amount(which is inclusive of tax) is put in credit note amount.
	*  				2) "full(gr reversal)" => ∑(checked gr's totalFreight) key is picked from bill.items.totFreight(which is exclusive of tax).
	* 				3) "partial" => ∑(deduction amount) entered by user is exclusive of tax
	* 				else when its false then in case of partial the ∑(deduction amount) is inclusive of tax.
	*
	* */
	function calculateAmount() {

		let oBill = vm.aBill && vm.aBill[0] || {cGST_percent: 0, sGST_percent: 0, iGST_percent: 0};
		let taxPercent = (oBill.cGST_percent + oBill.sGST_percent + oBill.iGST_percent) || 0;

		if (oBill._id) {
			vm.oCreditNote.totalAmount = 0;

			oBill.items.forEach(function (oItem) {
				oItem.aDeduction = oItem.aDeduction || [];

				// "oItem.totFreight" => it's exclusive of tax, so we have calculate the "oItem.grAmountWithTax" i.e. "oItem.totFreight" with inclusive of tax
				if(taxPercent && oBill.cGST_percent || oBill.sGST_percent) {
					let percent = taxPercent/2;
					oItem.grAmountWithTax = oItem.totFreight;
					oItem.grAmountWithTax += oItem.totFreight * percent / 100;
					oItem.grAmountWithTax += oItem.totFreight * percent / 100;
				}else
					oItem.grAmountWithTax = oItem.totFreight + oItem.totFreight * taxPercent / 100;

				oItem.grAmountWithTax = Math.round(oItem.grAmountWithTax * 100) / 100;

				oItem.deduction = oItem.aDeduction.reduce((amt, oDed) => {
					if (vm.oCreditNote.category == 'Full(Gr Reversal)')
						return amt + oItem.checked ? oDed.amount : 0;
					return amt + oDed.amount;
				}, 0);

				if (vm.oCreditNote.genRevVch) // if true then deduction amount is exclusive of tax. so we include tax in it.
					vm.oCreditNote.totalAmount += oItem.deduction = (oItem.deduction + oItem.deduction * taxPercent / 100);
				else
					vm.oCreditNote.totalAmount += oItem.deduction;
			});
		}

		// handling round off error
		if(vm.oCreditNote.category === 'Full'){
			let amt = Math.round2(vm.oCreditNote.totalAmount - oBill.billAmount, 2);
			if(Math.abs(amt) <= 0.02) {
				vm.oCreditNote.totalAmount -= amt;
				if(oBill.items.length && oBill.items[0].deduction)
					oBill.items[0].deduction -= amt;
			}
		}

		vm.oCreditNote.totalAmount = NumberUtil.toFixed(vm.oCreditNote.totalAmount);

		//this fn assumes that the "vm.oCreditNote.totalAmount" is always provided and it extract the "vm.oCreditNote.amount" from it.
		vm.oCreditNote.amount = Math.round2((vm.oCreditNote.totalAmount * 100) / (100 + taxPercent) || 0, 2);

		vm.oCreditNote.cGST = Math.round2((vm.oCreditNote.amount * oBill.cGST_percent / 100) || 0, 2);
		vm.oCreditNote.sGST = Math.round2((vm.oCreditNote.amount * oBill.sGST_percent / 100) || 0, 2);
		vm.oCreditNote.iGST = Math.round2((vm.oCreditNote.amount * oBill.iGST_percent / 100) || 0, 2);

		/*
		* "receivedAmount" => total amount received on the bill by other generated credit note and money receipt.
		* "remainingAmount" => total amount that is remaining or that can be received on the bill.
		* "deductionApplied" => it's the sum of all the deduction applied on the bill. Note: Excluding current credit note's deductions in case of edit credit note.
		* */

		oBill.receivedAmount = 0;
		oBill.receivedAmount += oBill.receiving && Array.isArray(oBill.receiving.moneyReceipt) && oBill.receiving.moneyReceipt.reduce((a, b) => a + (b.amount || 0), 0) || 0;
		// restrict addition of current credit note grRef's amount in "receivedAmount". In case of edit only.
		oBill.receivedAmount += oBill.deductionApplied = oBill.receiving && Array.isArray(oBill.receiving.deduction) && oBill.receiving.deduction.reduce((amt, oDed) => {
			if (oDed.mrRef || (vm.oCreditNote && vm.oCreditNote._id && oDed.cNoteRef && vm.oCreditNote._id === oDed.cNoteRef)) { // in case of edit credit note
				return amt;
			} else { // in case of add credit note
				return amt + oDed.amount;
			}
		}, 0) || 0;

		oBill.remainingAmount = NumberUtil.toFixed(oBill.billAmount - oBill.receivedAmount);
	}

	// it validate and if valid then fetch credit note by creditNo
	function getCreditNoteByCreditNo() {
		if (!vm.filter.creditNo && !vm.filter.refNo)
			return;

		if (vm.oCreditNote && vm.oCreditNote.creditNo == vm.filter.creditNo)
			return;

		getCreditNote(false, vm.filter.creditNo);
	}

	function resetOnFullCreditNote(){
		let amt = Math.round2(vm.oCreditNote.totalAmount - vm.oCreditNote.cGST - vm.oCreditNote.sGST - vm.oCreditNote.iGST - vm.oCreditNote.amount, 2);
		if(Math.abs(amt) <= 0.02)
			vm.oCreditNote.amount += amt;

		if(vm.aBill && vm.aBill.length && vm.oCreditNote.category == 'Full'){
			vm.oCreditNote.cGST = vm.aBill[0].cGST;
			vm.oCreditNote.sGST = vm.aBill[0].sGST;
			vm.oCreditNote.iGST = vm.aBill[0].iGST;
			vm.oCreditNote.amount = vm.aBill[0].amount;
			vm.oCreditNote.totalAmount = vm.aBill[0].billAmount;
			if(vm.aBill[0].adjAmount)
			vm.oCreditNote.adjAmount = (vm.aBill[0].adjAmount || 0);
		}
	}

	// fetch bill
	function getBill() {

		if (vm.aBill && vm.aBill.find(o => o.billNo === vm.billNo))
			return;

		vm.filter.no_of_docs = 1;

		let request = {
			billNo: vm.billNo,
			isBillRegexDisable: true,
			no_of_docs: 1,
			status: 'Approved',
			'acknowledge.status': true,
			sort: {_id: -1}
		};

		billsService.getGenerateBill(request, success, failure);

		function success(res) {

			try {

				if (res.data && res.data.data) {
					vm.aBill = res.data.data;

					vm.isBillWithoutGr = !!vm.aBill[0].items.find(o => !((o.grData && o.grData._id) || (o.gr && o.gr._id)));

					vm.aBill[0].items = vm.aBill[0].items.filter(o => o.gr && o.gr._id);

					vm.aBill[0].receiving = vm.aBill[0].receiving || {};
					vm.aBill[0].receiving.deduction = vm.aBill[0].receiving.deduction || [];
					vm.aBill[0].receiving.moneyReceipt = vm.aBill[0].receiving.moneyReceipt || [];

					// bill is only get in case of add credit note, on modify of bill no in case of edit credit note is same as add credit note.
					if (vm.aBill[0].receiving.moneyReceipt.length) {
						vm.oCreditNote.genRevVch = false;
						vm.generateReverseVoucher.disable = true;
					} else {
						vm.oCreditNote.genRevVch = true;
						vm.generateReverseVoucher.disable = false;
					}

					vm.oCreditNote = vm.oCreditNote || {};

					showDeductionWithoutCreditNote();
					calEachItemDeductionReceived();
					calculateAmount();
					setAccount(vm.aBill[0]);
					vm.cnBookId = vm.aBill[0].billingParty.cnBook.map(o => o.ref);
				}
				vm.readonly = false;
				refreshDeduction();

			} catch (e) {
				console.log(e);
			}
		}

		function failure(res) {
			swal('Some error with GET bills.', JSON.stringify(res), 'error');
		}
	}

	//create empty Gr for bill without gr
	function genEmptyGr() {
		let oBill = vm.aBill[0];
		oBill.items = [{gr: {}, grData: {}, totFreight: oBill.billAmount, grAmountWithTax: oBill.billAmount, emptyGr: true}];
	}

	//remove empty Gr for bill without gr
	function removeEmptyGr() {
		let oBill = vm.aBill[0];
		for(let [index, oItem] of oBill.items.entries()) {
			if(oItem.emptyGr){
				oBill.items.splice(index, 1);
				break;
			}
		}
	}

	// it sets the default account that's save in client config
	function setAccount(oBill) {
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === oBill.billingParty.clientId);
		vm.clientAccount = vm.clientAccount || {};
        if(vm.clientAccount.igstAcc) {
			vm.oCreditNote.iGSTAccount = {
				name: vm.clientAccount.igstAccName,
				_id: vm.clientAccount.igstAcc
			};
		}
		if(vm.clientAccount.cgstAcc) {
			vm.oCreditNote.cGSTAccount = {
				name: vm.clientAccount.cgstAccName,
				_id: vm.clientAccount.cgstAcc
			};
		}
		if(vm.clientAccount.sgstAcc) {
			vm.oCreditNote.sGSTAccount = {
				name: vm.clientAccount.sgstAccName,
				_id: vm.clientAccount.sgstAcc
			};
		}
	}

	/*
	* this function calculate the total amount already received on each gr of bill
	* "deductionReceived" => this is the key on each item of gr that contain the already received ∑deduction of each gr.
	* */
	function calEachItemDeductionReceived() {
		let oBill = vm.aBill && vm.aBill[0] || {};
		if (oBill._id) {
			let taxPercent = (oBill.cGST_percent + oBill.sGST_percent + oBill.iGST_percent) || 0;
			oBill.items.forEach(function (item) {
				let totDed = oBill.receiving.deduction.reduce((amt, obj) => obj.grRef === item.gr._id ? amt + obj.amount : amt, 0);
				// the amount saved on creditNote.grs.amount is always inclusive of tax i.e. ∑(grs.amount) is equal to creditNote.totalAmount
				if (vm.oCreditNote.genRevVch)
					item.deductionReceived = NumberUtil.toFixed((totDed * 100) / (100 + taxPercent)) || 0;
				else
					item.deductionReceived = NumberUtil.toFixed(totDed);
			});
		}
	}

	function onCNoteSelect(item, model, label) {
		vm.oCreditStationary = item;
	}

	// fetch credit note stationary
	function getCnBookNo(viewValue) {

		let bpConfig = $scope.$configs.master && $scope.$configs.master.billingParty && $scope.$configs.master.billingParty.defaultCreditNoteBook || false;

		if(!bpConfig && !vm.cnBookId.length) {
			return swal('Error',`Please attach Credit Note Book with billing party ${vm.aBill[0].billingParty.name} on master page`,'error');
		}
		if(!bpConfig)
			if (!vm.cnBookId.length)
			return [];

		if(!vm.oCreditNote.date){
			swal('Error', 'Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.cnBookId,
				type: 'Credit Note',
				useDate: moment(vm.oCreditNote.date, 'DD/MM/YYYY').startOf('day').toDate(),
				status: "unused"
			};

			if(bpConfig){
				delete requestObj.billBookId;
				requestObj.defaultBook = bpConfig;
				billBookService.getStationery(requestObj, oSuc, oFail);
			}else{
				billBookService.getStationery(requestObj, oSuc, oFail);
			}


			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	// fetch the account
	function getAccount(viewValue, group = [], id) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 3) {
				return resolve([]);
			} else {

				let req = {
					no_of_docs: 6,
				};

				if (viewValue)
					req.name = viewValue;
				else if (id)
					req._id = id;

				if (group.length)
					req.group = group;

				accountingService.getAccountMaster(req, res => resolve(res.data.data), err => resolve([]));
			}
		});
	}

	function selectBill(pIndex, index) {
		vm.selectedBillIndex = pIndex;
		vm.selectedBill = vm.aBill[pIndex];
		vm.selectedGrIndex = index;
		vm.selectedItem = vm.selectedBill.items[index] || vm.selectedBill.items;
		vm.selectedGr = vm.selectedItem.gr;
		vm.selectedItem.aDeduction = vm.selectedItem.aDeduction || [];
	}

	function submit(formData, approve) {
		console.log(vm.aBill);

		let totDeduction = 0;
		let grs = [];

		if (vm.oCreditNote.category == 'Partial') {
			for(let i=0; i<vm.aBill[0].items.length; i++){
				for(let j=0; j<vm.aBill[0].items[i].aDeduction.length; j++){
					if(!vm.aBill[0].items[i].aDeduction[j].deductionAccount){
						return swal('Error', 'Deduction Account is Mandatory', 'error');
					}
					if(!vm.aBill[0].items[i].aDeduction[j].remark){
						return swal('Error', 'Deduction Remark is Mandatory', 'error');
					}
				}
			}
		}

		// deduction applied on money receipt there credit note is generated so we ignore those deduction amount in bill amount validation, because its already added on the bill deduction
		let mrDeduction = NumberUtil.toFixed(vm.aBill[0].receiving.deduction.reduce((amt, oRecDed) => {
			if (oRecDed.genFrom === 'mr' && oRecDed.mrRef && (oRecDed.cNoteRef ? oRecDed.cNoteRef === vm.oCreditNote._id : true))
				if (vm.aBill[0].items.find(oItem => oItem.aDeduction.find(oDed => oDed.deductionType === oRecDed.deductionType && oDed.grRef && oRecDed.grRef)))
					return amt + oRecDed.amount;
			return amt;
		}, 0));

		if (/*vm.oCreditNote.category != 'Full' && */vm.oCreditNote.totalAmount > (vm.aBill[0].remainingAmount + mrDeduction))
			return swal('Error', 'Amount Should be less than or equal to Remaining Amount.', 'error');

		if (vm.oCreditNote.amount < 1)
			return swal('Error', 'Total Amount should be Greater than 0.', 'error');

		if (vm.oCreditNote.category == 'Full(Gr Reversal)')
			vm.aBill[0].items = vm.aBill[0].items.filter(o => o.checked);

		vm.aBill[0].items.forEach(oItem => {
			(oItem.aDeduction || []).forEach(function (oDed) {
				let deductionAmount = oDed.amount;
				if(oDed.deductionType === 'Adj Amount')
					oItem.adjDeduction = true;

				if (vm.oCreditNote.genRevVch && vm.oCreditNote.category == 'Partial') {
					let taxPercent = (vm.aBill[0].cGST_percent + vm.aBill[0].sGST_percent + vm.aBill[0].iGST_percent) || 0;
					deductionAmount = NumberUtil.toFixed(deductionAmount + (deductionAmount * taxPercent / 100));
				}
                if(!oItem.adjDeduction)
				grs.push({
					grNumber: oItem.gr && oItem.gr.grNumber,
					grRef: oItem.gr && oItem.gr._id,
					deductionType: oDed.deductionType,
					deductionAccount: oDed.deductionAccount && oDed.deductionAccount._id,
					dedAccName: oDed.deductionAccount && oDed.deductionAccount.name,
					remark: oDed.remark,
					amount: deductionAmount,
					voucher: oDed.voucher,
				});
			});
			if(!oItem.adjDeduction)
			totDeduction += (oItem.deduction || 0);
		});

		if(vm.oCreditNote.category == 'Full' && vm.oCreditNote.adjAmount && !vm.aBill[0].items[0].emptyGr){
			grs.push({
				deductionType: 'Adj Amount',
				amount: Math.abs(vm.oCreditNote.adjAmount),
			});
			totDeduction -= (vm.oCreditNote.adjAmount || 0);
		}

		totDeduction = NumberUtil.toFixed(totDeduction);

		if (totDeduction != vm.oCreditNote.totalAmount)
			return swal('Error', 'Deduction Should be equal to Total Amount', 'error');

		let request = {...vm.oCreditNote};
		request.amount = NumberUtil.toFixed(vm.oCreditNote.amount);
		request.billRef = vm.aBill[0]._id;
		request.billNo = vm.aBill[0].billNo;
		request.cGST = NumberUtil.toFixed(vm.oCreditNote.cGST);
		request.sGST = NumberUtil.toFixed(vm.oCreditNote.sGST);
		request.iGST = NumberUtil.toFixed(vm.oCreditNote.iGST);
		request.cGSTPercent = vm.aBill[0].cGST_percent || 0;
		request.sGSTPercent = vm.aBill[0].sGST_percent || 0;
		request.iGSTPercent = vm.aBill[0].iGST_percent || 0;
		request.grs = grs;
		request.oCreditStationary = vm.oCreditStationary && vm.oCreditStationary._id;

		if (request.date)
			request.date = moment(request.date, 'DD/MM/YYYY').toISOString();
		if (vm.aBill[0].billingParty)
			request.billingParty = vm.aBill[0].billingParty._id || vm.aBill[0].billingParty;
		if (request.iGSTAccount)
			request.iGSTAccount = request.iGSTAccount._id || request.iGSTAccount;
		if (request.cGSTAccount)
			request.cGSTAccount = request.cGSTAccount._id || request.cGSTAccount;
		if (request.sGSTAccount)
			request.sGSTAccount = request.sGSTAccount._id || request.sGSTAccount;
		if (vm.aBill[0] && vm.aBill[0].adjDebitAc)
			request.adjDebitAc = vm.aBill[0].adjDebitAc._id || vm.aBill[0].adjDebitAc;
		if (vm.aBill[0] && vm.aBill[0].adjDebitAcName)
			request.adjDebitAcName = vm.aBill[0].adjDebitAcName;

		if (approve)
			request.approve = approve;

		vm.disableSubmit = true;
		if (vm.oCreditNote._id)
			creditNoteService.editCreditNote(request, successCallback, failureCallback);
		else
			creditNoteService.addCreditNote(request, successCallback, failureCallback);

		function failureCallback(err) {
			vm.disableSubmit = false;
			return swal('Error', err.message, 'error');
		}

		function successCallback(response) {
			swal('success', response.message, 'success');
			vm.disableSubmit = false;
			vm.oCreditNote = {totalAmount: 0};
			vm.aBill = [];
			calculateAmount()
		}

	}
}

function miscCreditNotePopUpController(
	$filter,
	$scope,
	$state,
	$localStorage,
	$stateParams,
	$uibModal,
	$uibModalInstance,
	accountingService,
	billsService,
	branchService,
	billBookService,
	billingPartyService,
	branchService,
	DatePicker,
	creditNoteService,
	NumberUtil,
	aCreditNote
) {
	// object Identifiers
	var vm = this;

	// functions Identifiers
	vm.addDeduction = addDeduction;
	vm.closeModal = closeModal;
	vm.ChargesConfig = ChargesConfig;
	vm.getAccount = getAccount;
	vm.getCnBookNo = getCnBookNo;
	vm.refreshDeduction = refreshDeduction;
	vm.removeDeduction = removeDeduction;
	vm.getBillingParty = getBillingParty;
	vm.getAllBranch = getAllBranch;
	vm.onBranchSelect = onBranchSelect;
	vm.calculateSummary = calculateSummary;
	vm.onCNoteSelect = onCNoteSelect;
	vm.setAccount = setAccount;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.isDisabled= false;
		vm.filter = {};
		vm.oCreditNote = {};
		vm.dealAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		if (aCreditNote.operationType === 'Edit') {
			vm.oCreditNote = aCreditNote.oSelectedCreditNo;
			vm.operationType = aCreditNote.operationType;

			if(vm.oCreditNote.cGSTPercent && vm.oCreditNote.sGSTPercent){
				vm.gstType = 'CGST & SGST';
				vm.gstPercent = vm.oCreditNote.cGSTPercent + vm.oCreditNote.sGSTPercent;
			}else if(vm.oCreditNote.iGSTPercent){
				vm.gstType = 'IGST';
				vm.gstPercent = vm.oCreditNote.iGSTPercent;
			}
			refreshDeduction();
			vm.oCreditNote.grs.forEach(obj =>{
				obj.deductionAccount = {name: obj.dedAccName, _id: obj.deductionAccount}
			})

		} else if (aCreditNote.operationType === 'Add') {
			vm.operationType = aCreditNote.operationType;
		}

	})();

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}
	/*
	* this function add deduction
	* */
	function addDeduction() {
		vm.oCreditNote.grs = vm.oCreditNote.grs || [];
		vm.oCreditNote.grs.push({});
		refreshDeduction();
	}

	/*
	* this function remove deduction
	* */
	function removeDeduction() {
		vm.oCreditNote.grs.splice(vm.selectedDeductionIndex, 1);
		calculateSummary();
		refreshDeduction();
	}

	function refreshDeduction() {
		let aDeductionConstant = $scope.$constants.miscDeductionObj;
			vm.oCreditNote.grs.forEach(oDed => {
				oDed.aDeductionTypeConstant = aDeductionConstant.filter(oConstDed => !vm.oCreditNote.grs.find(oNestedDed => oNestedDed.deductionType != oDed.deductionType ? oNestedDed.deductionType === oConstDed.name : false));
			});
	}

	function onBranchSelect(item) {
		vm.cnBookId = item.miscCNBook && item.miscCNBook.map(o => o.ref);

	}

	function onCNoteSelect(item, model, label) {
		vm.oCreditStationary = item;
	}

	function calculateSummary() {

		vm.oCreditNote.amount = 0;
		vm.oCreditNote.cGST = 0;
		vm.oCreditNote.sGST = 0;
		vm.oCreditNote.iGST = 0;


		vm.oCreditNote.grs && vm.oCreditNote.grs.forEach((ded) => {
			vm.oCreditNote.amount += (ded.amount || 0);
		});

		if(vm.gstType && vm.gstPercent) {
			let percent = vm.gstType === 'IGST' ? Number(vm.gstPercent) : (Number(vm.gstPercent) / 2);
			vm.oCreditNote.cGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
			vm.oCreditNote.sGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
			vm.oCreditNote.iGSTPercent = vm.gstType === 'IGST' ? percent : 0;
		}

		vm.oCreditNote.cGST = (vm.oCreditNote.amount * (vm.oCreditNote.cGSTPercent || 0) / 100);
		vm.oCreditNote.sGST = (vm.oCreditNote.amount * (vm.oCreditNote.sGSTPercent || 0) / 100);
		vm.oCreditNote.iGST = (vm.oCreditNote.amount * (vm.oCreditNote.iGSTPercent || 0) / 100);

		vm.oCreditNote.totalAmount = (vm.oCreditNote.amount + vm.oCreditNote.cGST + vm.oCreditNote.sGST + vm.oCreditNote.iGST);
	}

	function setAccount() {

		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === vm.oCreditNote.billingParty.clientId);
		vm.clientAccount = vm.clientAccount || {};

		if(vm.gstType === 'IGST') {
			vm.oCreditNote.iGSTAccount = {
				name: vm.clientAccount.igstAccName,
				_id: vm.clientAccount.igstAcc
			};
		}
		else if(vm.gstType === 'CGST & SGST'){

			vm.oCreditNote.cGSTAccount = {
				name: vm.clientAccount.cgstAccName,
				_id: vm.clientAccount.cgstAcc
			};

			vm.oCreditNote.sGSTAccount = {
				name: vm.clientAccount.sgstAccName,
				_id: vm.clientAccount.sgstAcc
			};
			}
		calculateSummary();
		}

	function ChargesConfig(type, oDeduction) {
		let oType = $scope.$constants.miscDeductionObj.find(obj=> obj.name === type);
		for (let key in vm.dealAcc.miscCnote) {
			if (vm.dealAcc.miscCnote.hasOwnProperty(key)) {
				if (key === oType.value) {
					oDeduction.deductionAccount = {
						_id: vm.dealAcc.miscCnote[key]._id,
						name: vm.dealAcc.miscCnote[key].name
					};
				}
			}
		}
	}

	// fetch credit note stationary
	function getCnBookNo(viewValue) {
		if (!vm.cnBookId.length)
			return [];

		if(!vm.oCreditNote.date){
			swal('Error', 'Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.cnBookId,
				type: 'Credit Note',
				useDate: moment(vm.oCreditNote.date, 'DD/MM/YYYY').startOf('day').toDate(),
				status: 'unused'
			};
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

	// fetch the branch
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

	// fetch the billingParty
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

	// fetch the account
	function getAccount(viewValue, group = [], id) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 3) {
				return resolve([]);
			} else {

				let req = {
					no_of_docs: 6,
				};

				if (viewValue)
					req.name = viewValue;
				else if (id)
					req._id = id;

				if (group.length)
					req.group = group;

				accountingService.getAccountMaster(req, res => resolve(res.data.data), err => resolve([]));
			}
		});
	}

	function submit(formData, approve) {

		if (vm.oCreditNote.amount < 1)
			return swal('Error', 'Total Amount should be Greater than 0.', 'error');

		let request = {...angular.copy(vm.oCreditNote)};
		request.amount = NumberUtil.toFixed(vm.oCreditNote.amount);
		request.cGST = NumberUtil.toFixed(vm.oCreditNote.cGST);
		request.sGST = NumberUtil.toFixed(vm.oCreditNote.sGST);
		request.iGST = NumberUtil.toFixed(vm.oCreditNote.iGST);
		request.cGSTPercent = vm.oCreditNote.cGSTPercent || 0;
		request.sGSTPercent = vm.oCreditNote.sGSTPercent || 0;
		request.iGSTPercent = vm.oCreditNote.iGSTPercent || 0;
		request.grs.forEach(obj=>{
			if(obj.deductionAccount && obj.deductionAccount._id){
				obj.dedAccName = obj.deductionAccount.name;
				obj.deductionAccount = obj.deductionAccount._id;
			}
		});

		request.oCreditStationary = vm.oCreditStationary && vm.oCreditStationary._id;

		if (request.date)
			request.date = moment(request.date, 'DD/MM/YYYY').toISOString();
		if (vm.oCreditNote.billingParty)
			request.billingParty = vm.oCreditNote.billingParty._id || vm.oCreditNote.billingParty;
		if (request.iGSTAccount)
			request.iGSTAccount = request.iGSTAccount._id || request.iGSTAccount;
		if (request.cGSTAccount)
			request.cGSTAccount = request.cGSTAccount._id || request.cGSTAccount;
		if (request.sGSTAccount)
			request.sGSTAccount = request.sGSTAccount._id || request.sGSTAccount;

		if (approve)
			request.approve = approve;

			request.isMiscCreditNote = true;
			request.category = 'Full';
		vm.isDisabled= true;
		if (vm.oCreditNote._id)
			creditNoteService.editMiscCreditNote(request, successCallback, failureCallback);
		else
			creditNoteService.addMiscCreditNote(request, successCallback, failureCallback);

		function failureCallback(err) {
			vm.isDisabled= false;
			return swal('Error', err.message, 'error');
		}

		function successCallback(response) {
			vm.isDisabled= false;
			swal('success', response.message, 'success');
		}

	}
}
