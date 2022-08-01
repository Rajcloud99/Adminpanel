materialAdmin
	.controller("billsMoneyReceiptController", billsMoneyReceiptController)
	.controller("billsMoneyReceiptUpsertController", billsMoneyReceiptUpsertController)
	.controller("billWiseMoneyReceiptUpsertCtrl", billWiseMoneyReceiptUpsertCtrl)
	.controller("pullVoucherPopUpCtrl", pullVoucherPopUpCtrl);

billsMoneyReceiptController.$inject = [
	'$scope',
	'$state',
	'$uibModal',
	'billsService',
	'billingPartyService',
	'DatePicker',
	'dmsService',
	'growlService',
	'lazyLoadFactory',
	'moneyReceiptService',
	'stateDataRetain'
];
billsMoneyReceiptUpsertController.$inject = [
	'$filter',
	'$scope',
	'$state',
	'$stateParams',
	'$uibModal',
	'accountingService',
	'billsService',
	'branchService',
	'billBookService',
	'billingPartyService',
	'DatePicker',
	'growlService',
	'moneyReceiptService',
	'NumberUtil',
	'tripServices'
];

billWiseMoneyReceiptUpsertCtrl.$inject = [
	'$filter',
	'$scope',
	'$state',
	'$stateParams',
	'$uibModal',
	'accountingService',
	'billsService',
	'branchService',
	'billBookService',
	'billingPartyService',
	'DatePicker',
	'moneyReceiptService',
	'NumberUtil',
	'tripServices'
];
pullVoucherPopUpCtrl.$inject = [
	 '$uibModalInstance',
	 'moneyReceiptService'
];

function billsMoneyReceiptController(
	$scope,
	$state,
	$uibModal,
	billsService,
	billingPartyService,
	DatePicker,
	dmsService,
	growlService,
	lazyLoadFactory,
	moneyReceiptService,
	stateDataRetain) {

	var vm = this;

	vm.DatePicker = DatePicker;
	vm.lazyLoad = lazyLoadFactory();
	vm.myFilter = {};
	$scope.onStateRefresh = function () {
		getMoneyReceipt();
	};

	vm.deleteMr = deleteMr;
	vm.moneyReceiptUpsert = moneyReceiptUpsert;
	vm.billMoneyReceiptUpsert = billMoneyReceiptUpsert;
	vm.getMoneyReceipt = getMoneyReceipt;
	vm.pullVoucher = pullVoucher;
	vm.printMR = printMR;
	vm.uploadDocs = uploadDocs;
	vm.previewBuilty = previewBuilty;
	vm.getBilling = getBilling;
	(function init() {
		if (stateDataRetain.init($scope, vm))
			return;
		vm.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		vm.selectType = 'index';
		if("$configs.moneyReceipt.mrNoDate"){
			vm.columnSetting = {
				allowedColumn: [
					'MR No',
					'MR date',
					'billingParty',
					'payment Mode',
					'Bank Received',
					'Advice Amount',
					'narration',
					'Created By',
					'Created At',
				]
			};
		}else{
			vm.columnSetting = {
				allowedColumn: [
					'CR No',
					'CR date',
					'billingParty',
					'payment Mode',
					'Bank Received',
					'Advice Amount',
					'narration',
					'Created By',
					'Created At',
				]
			};
		}

		vm.tableHead = [
			{
				'header': 'CR No',
				'bindingKeys': 'mrNo',
				'date': false
			},
			{
				'header': 'CR date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'MR No',
				'bindingKeys': 'mrNo',
				'date': false
			},
			{
				'header': 'MR date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'payment Mode',
				'bindingKeys': 'paymentMode',
				'date': false
			},
			{
				'header': 'billingParty',
				'bindingKeys': 'bpNam'
			},
			{
				'header': 'narration',
				'bindingKeys': 'narration',
				'date': false
			},
			{
				'header': 'Bank Received',
				'bindingKeys': 'receivedAmount',
				'date': false
			},
			{
				'header': 'Advice Amount',
				'bindingKeys': 'adviceAmount',
				'date': false
			},
			{
				'header': 'Created By',
				'bindingKeys': 'createdBy'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			},
		];
		// getMoneyReceipt();
	})();

	//filter for Invoice
	function deleteMr() {
		if (!vm.aSelectedMR)
			return swal('Error', 'Select One Money Receipt', 'error');

		swal({
			title: "Confirm delete ?",
			text: "MR "+vm.aSelectedMR.mrNo+" will be removed from Money Receipt",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function(){
			function successCallback(response) {
				console.log(response);
				swal('', response.message, 'success');
			}
			function failureCallback(err) {
				console.log(err);
				swal('', err.message, 'error');
			}
			moneyReceiptService.removeMoneyReceipt({_id: vm.aSelectedMR._id}, successCallback, failureCallback);
		});

		// moneyReceiptService.removeMoneyReceipt({_id: vm.aSelectedMR._id}, successCallback, failureCallback);


	}

	function uploadDocs(selectedRow) {
		console.log(selectedRow);
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'moneyReceipt',
					scopeModel: selectedRow,
					scopeModelId: selectedRow._id,
					uploadText: "Upload moneyReceipt Documents",
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	}


	function previewBuilty(moneyReceipt) {
		if(!moneyReceipt._id)
			return;
		vm.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: moneyReceipt._id,
				modelName: "moneyReceipt"
			};

			let aAllDoc = [];
			aAllDoc.push(moneyReceipt._id);

			let reqId = {};
			let _id = [];
			reqId._id =  aAllDoc;
			//dmsService.getAllDocs( req,success,failure);
			dmsService.getAllDocsV2(reqId, success, failure);

			function success(res) {
				if (res && res.data.length>0 ) {
					//$scope.oDoc = res.data;
					let aDocData 	= [];
					let aDocRes 	= [];
					let obTrip 		= {};
					let livedObj 	= {};
					aDocData = res.data;
					livedObj = aDocData.reduce(function(o,i){
						if(!o.hasOwnProperty(i.linkTo)){
							o[i.linkTo] = [];

						}

						var grouped = {};
						if(i.files && i.files.length>0) {
							i.files.forEach(function (t) {
								if (!grouped[t.category]) {
									grouped[t.category] = [];
								}

								if(i.linkTo=='moneyReceipt') {
									if(moneyReceipt._id==i.linkToId){
										grouped[t.category].push({
											name: `${URL.file_server}${t.name}`,
											iName:t.name,
											_id: i._id,
											sId: moneyReceipt._id,
											sNumber:moneyReceipt.mrNo
										});
									}
								}
							})
						}
						o[i.linkTo].push(grouped);
						return o;
					},{});

					//vm.oDoc = res.data;
					vm.oDoc = livedObj;
					prepareData();

				}else{
					growlService.growl("No documents to preview", "warning");
					return;
				}
			}

			function failure(res) {
				var msg = res.data.message;
				growlService.growl(msg, "error");
				return;
			}
		}

	};

	function prepareData() {
		$uibModal.open({
			templateUrl: 'views/previewDocumentPopup.html', //'views/carouselPopup.html',
			controller:  'preiveDocPopupCtrl',
			resolve: {
				documents: function () {
					return vm.oDoc;
				}
			}
		});
	}

	function prepareInvoiceFilterObject() {
		var myFilter = {};

		if (vm.myFilter.mrNo) {
			myFilter.mrNo = vm.myFilter.mrNo;
		}
		if (vm.myFilter.billNo) {
			myFilter.billNo = vm.myFilter.billNo;
		}
		if (vm.myFilter.billingParty) {
			myFilter.billingParty = vm.myFilter.billingParty._id;
		}
		if (vm.myFilter.start_date) {
			myFilter.from_date = vm.myFilter.start_date;
		}
		if (vm.myFilter.end_date) {
			myFilter.to_date = vm.myFilter.end_date;
		}
		if (vm.myFilter.branch) {
			myFilter.branch = vm.myFilter.branch._id;
		} else if (vm.aBranch && vm.aBranch.length) {
			myFilter.branch = [];
			vm.aBranch.forEach(obj => {
				if (obj.read)
					myFilter.branch.push(obj._id);
			});
		}
		myFilter.no_of_docs = 30;
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.sort = {_id: -1};
		return myFilter;
	}

	function getMoneyReceipt(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareInvoiceFilterObject();
		moneyReceiptService.getMoneyReceipt(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			}
		}
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

	function printMR() {
		if (!vm.aSelectedMR)
			return swal('Warning', 'Select at least one Money Receipt!!!!!', 'warning');

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

					$scope.getGR = function (templateKey = 'default_') {

						var oFilter = {
							_id: otherData._id,
							mReceiptName: templateKey
						};

						clientService.getMoneyReceiptPreview(oFilter, success, fail);
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
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					// let aTemplate = ($scope.$constants.aMoneyReceiptTemplate || []);
					let aTemplate = ($scope.$configs.Bill && $scope.$configs.Bill.mRTemplate || []);
					return {
						_id: vm.aSelectedMR._id,
						aBillTemplate: aTemplate,
					};
				}
			}
		});
	}

	function pullVoucher() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/pullVoucherPopUp.html',
			controller: ['$uibModalInstance', 'moneyReceiptService', 'voucherService', pullVoucherPopUpCtrl],
			controllerAs: 'pvVm',
			resolve: {}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
		}, function (data) {

		});
	}

	function moneyReceiptUpsert(type) {
		if (type == 'add')
			$state.go('billing.upsertMR');
		else if (type == 'edit')
			$state.go('billing.upsertMR', {data: vm.aSelectedMR});
	}

	function billMoneyReceiptUpsert(type) {
		if (type == 'add')
			$state.go('billing.upsertBillMR');
		else if (type == 'edit')
			$state.go('billing.upsertBillMR', {data: vm.aSelectedMR});
	}
}

function billsMoneyReceiptUpsertController(
	$filter,
	$scope,
	$state,
	$stateParams,
	$uibModal,
	accountingService,
	billsService,
	branchService,
	billBookService,
	billingPartyService,
	DatePicker,
	growlService,
	moneyReceiptService,
	NumberUtil,
	tripServices
){
	// object Identifiers
	var vm = this;

	vm.oMoneyReceipt = {};
	vm.oCostCenter = {};
	vm.balanceAmount = 0;
	vm.DatePicker = DatePicker;
	vm.selectedGr = null;
	vm.totalReceiving = null;
	vm.remainingBillAmount = null;
	vm.disableSubmit = false;
	vm.totBillTds = 0;
	vm.totBillExtCharge = 0;
	vm.totBillExtCharge2 = 0;

	// functions Identifiers
	vm.addBill = addBill;
	vm.addGrForDed = addGrForDed;
	vm.addMiscellaneousBill = addMiscellaneousBill;
	vm.applyExtraCharge = applyExtraCharge;
	vm.applyTDS = applyTDS;
	vm.clearBillData = clearBillData;
	vm.getAllBranch = getAllBranch;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getBills = getBills;
	vm.getMoneyReceipt = getMoneyReceipt;
	vm.getBillingParty = getBillingParty;
	vm.getMrStationary = getMrStationary;
	vm.getAllAccount = getAllAccount;
	vm.getAccount = getAccount;
	// vm.isSettled = isSettled;
	vm.onBPSelect = onBPSelect;
	vm.onDedAccSelect = onDedAccSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.onMrNoSelect = onMrNoSelect;
	vm.onSelectbillNo = onSelectbillNo;
	vm.removeGr = removeGr;
	vm.refreshBillamt = refreshBillamt;
	vm.showGrPaymentDeductions = showGrPaymentDeductions;
	// vm.selectThisGr = selectThisGr;
	vm.selectBill = selectBill;
	vm.refreshDeductionType = refreshDeductionType;
	vm.validateReceivedAmount = validateReceivedAmount;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.isDisabled = false;
		vm.aBill = [];
		vm.oMoneyReceipt.receivedAmount = 0;
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
		vm.isTDSApplied = false;
		vm.isExtChargeApplied = false;
		vm.isMiscellaneousAdded = false;
		vm.isBranchEditable = true;
		vm.extraCharges = [];
		vm.extraCharges2 = [];

		if (!$stateParams.data) {
			vm.readonly = true;
			vm.mode = 'add';
		} else if ($stateParams.data && $stateParams.data.billSettlement) {
			vm.readonly = false;
			vm.mode = 'add';
			vm.aBill = $stateParams.data.billSettlement;
			refreshBillamt();
		} else if ($stateParams.data) {
			vm.readonly = false;
			getMoneyReceipt($stateParams.data._id);
		}
	})();

	// Actual Functions

	// Prepare oMR object from Mr in edit mode
	function prepareFromMr(oMr) {

		vm.oMoneyReceipt = oMr;
		vm.isBranchEditable = vm.oMoneyReceipt.isVchAlGen ? !(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id) : true;

		if (!(vm.oMoneyReceipt.billingParty && vm.oMoneyReceipt.billingParty._id))
			delete vm.oMoneyReceipt.billingParty;

		if (vm.oMoneyReceipt.bankAccount) {
			vm.oMoneyReceipt.bankAccount = vm.oMoneyReceipt.bankAccountName ? {
				_id: vm.oMoneyReceipt.bankAccount,
				name: vm.oMoneyReceipt.bankAccountName
			} : vm.oMoneyReceipt.bankAccount;
		}

		if (vm.oMoneyReceipt.extChargeAccount) {
			vm.oMoneyReceipt.extChargeAccount = vm.oMoneyReceipt.extChargeAccountName ? {
				_id: vm.oMoneyReceipt.extChargeAccount,
				name: vm.oMoneyReceipt.extChargeAccountName
			} : vm.oMoneyReceipt.extChargeAccount;
		}

		if (vm.oMoneyReceipt.extChargeAccount2) {
			vm.oMoneyReceipt.extChargeAccount2 = vm.oMoneyReceipt.extChargeAccountName2 ? {
				_id: vm.oMoneyReceipt.extChargeAccount2,
				name: vm.oMoneyReceipt.extChargeAccountName2
			} : vm.oMoneyReceipt.extChargeAccount2;
		}

		if (vm.oMoneyReceipt.tdsAccount) {
			vm.oMoneyReceipt.tdsAccount = vm.oMoneyReceipt.tdsAccountName ? {
				_id: vm.oMoneyReceipt.tdsAccount,
				name: vm.oMoneyReceipt.tdsAccountName
			} : vm.oMoneyReceipt.tdsAccount;
		}

		if (vm.oMoneyReceipt.adjAmt) {
			vm.oMoneyReceipt.adjAcc = vm.oMoneyReceipt.adjAccNam ? {
				_id: vm.oMoneyReceipt.adjAcc,
				name: vm.oMoneyReceipt.adjAccNam
			} : vm.oMoneyReceipt.adjAcc;
		}

		vm.extraCharges = vm.oMoneyReceipt.extCharges || [];
		vm.isExtChargeApplied = !!vm.extraCharges.length;

		vm.extraCharges2 = vm.oMoneyReceipt.extCharges2 || [];
		vm.isExtChargeApplied2 = !!vm.extraCharges2.length;

		vm.aBill = vm.oMoneyReceipt.receiving.reduce((arr, oRec) => {

			if (oRec.billRef && oRec.grRef) {
				let foundBill = arr.find(o => o._id === (oRec.billRef && oRec.billRef._id));
				let itemRef = oRec.billRef.items.find(o => (o.gr._id ? o.gr._id : o.grData.grId) === oRec.grRef);

				if (foundBill) {
					foundBill.items.push(itemRef);
					foundBill.isTDSApplied = foundBill.isTDSApplied ? foundBill.isTDSApplied : !!oRec.tdsAmt;
				} else {
					arr.push(oRec.billRef);
					oRec.billRef.items = [itemRef];
					oRec.billRef.isTDSApplied = oRec.billRef.isTDSApplied ? oRec.billRef.isTDSApplied : !!oRec.tdsAmt;
				}

				itemRef.aDeduction = oRec.deduction;
				itemRef.receivedAmount = oRec.totReceived;
				itemRef.tdsAmount = oRec.tdsAmt;

			} else if (oRec.billRef && !oRec.grRef) {
				let foundBill = arr.find(o => o._id === (oRec.billRef && oRec.billRef._id));
				if(foundBill){
					let obj = {
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						receivedAmount: oRec.totReceived,
						tdsAmount: oRec.tdsAmt
					};

					if(!(oRec.grRef && oRec.grNumber)) {
						obj.canApplyTDS = true;
						obj.isNonReceivable = true;
						obj.hasOtherGr = true;
					}

					foundBill.items.push(obj);
				}else{
					oRec.billRef.isTDSApplied = oRec.billRef.isTDSApplied ? oRec.billRef.isTDSApplied : !!oRec.tdsAmt;
					oRec.billRef.items = [{
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						receivedAmount: oRec.totReceived,
						tdsAmount: oRec.tdsAmt
					}];
					arr.push(oRec.billRef);
				}
			} else if (oRec.grRef) {
				arr.push({
					canApplyTDS: true,
					billingParty: {account: {}},
					billNo: 'NA',
					isNonReceivable: true,
					items: [{
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						receivedAmount: 0,

					}]
				});
			} else {
				vm.isMiscellaneousAdded = true;
				arr.push({
					billNumber: oRec.billNo,
					bpNam: oRec.bpNam,
					billingParty: {account: {}},
					billNo: 'NA',
					canApplyTDS: true,
					isNonReceivable: true,
					items: [{
						gr: {
							grNumber: '',
						},
						aDeduction: oRec.deduction,
						receivedAmount: 0,
					}]
				});
			}

			return arr;
		}, []);

		vm.oMoneyReceipt.receivedAmount = vm.oMoneyReceipt.receivedAmount || 0;
		vm.oMoneyReceipt.adviceAmount = NumberUtil.toFixed(vm.oMoneyReceipt.adviceAmount || 0);
		vm.selectedStationary = {
			_id: vm.oMoneyReceipt.stationaryId,
			bookNo: vm.oMoneyReceipt.mrNo
		};

		vm.totBillTds = vm.oMoneyReceipt.totTdsAmount || 0;
		vm.totBillExtCharge = vm.oMoneyReceipt.totExtChargeAmount || 0;
		vm.totBillExtCharge2 = vm.oMoneyReceipt.totExtChargeAmount2 || 0;

		vm.aBill.forEach(distributeReceiving);
		vm.aBill.forEach(oBill => {
			oBill.items.forEach(o => {
				o.paymentIds = [];
				o.grMrAmt = (o.gr.moneyReceipt && o.gr.moneyReceipt.collection || []).reduce((acc, obj) => {
					if (obj.mrRef && obj.mrRef !== vm.oMoneyReceipt._id)
						return acc;
					if (obj.mrRef)
						o.grPay = true;
					if (obj.paymentId)
						o.paymentIds.push(obj.paymentId);
					return acc + (obj.paymentId ? obj.mrAmount : 0);
				}, 0);
			});
		})
		if (vm.oMoneyReceipt.branch && !vm.oMoneyReceipt.branch._id)
			getAllBranch(null, vm.oMoneyReceipt.branch);
		refreshDeductionType();
		refreshBillamt();
	}

	// add Bill
	function addBill() {

		if (!vm.myFilter.bill_no && !vm.myFilter.gr)
			return;
		if (vm.myFilter.bill_no && !vm.myFilter.bill_no._id)
			return swal('Warning', 'please select valid bill no', 'warning');

		let request = {
			'acknowledge.status': true,
			cancelled: {$ne: true},
			populate: ['billingParty.account', 'billingParty.withHoldAccount', 'creditNote.isReverse'],
			no_of_docs: 1000,
		};

		if (vm.oMoneyReceipt.billingParty)
			request['billingParty.customer'] = vm.oMoneyReceipt.billingParty.customer && vm.oMoneyReceipt.billingParty.customer._id;
		else
			return swal('Warning', 'Billing Party is required', 'warning');

		if (vm.myFilter.bill_no)
			request._id = vm.myFilter.bill_no._id;

		if (vm.myFilter.gr)
			request['items.gr.grNumber'] = vm.myFilter.gr;

		billsService.getGenerateBill(request, success, failure);

		function success(response) {
			try {
				if (response.data.data.length) {
					vm.aBill.push(...response.data.data
						.filter(oBill => {

							let foundBill = vm.aBill.find(o => o._id === oBill._id);

							if (foundBill) {
								foundBill.items.push(
									...oBill.items
										.filter(oFb =>
											!foundBill.items
												.find(o => (o.gr._id ? o.gr._id : o.grData.grId) === oFb.gr._id)
										)
								);
								return false;
							} else
								return true;
						})
						.map(oBill => {
							distributeReceiving(oBill);

							oBill.items.forEach(oItem => {
								if (oItem.gr && oItem.gr._id || oItem.grData && oItem.grData.grNumber)
									oItem.totFreight = oItem.totFreight;
								else {
									if (oItem.hasOtherGr)
										oItem.totFreight = 0
									else
										oItem.totFreight = oBill.amount;
								}

								oItem.totFreight = Math.round2(oItem.totFreight, 2);

								let cGST = Math.round2(oItem.totFreight * oBill.cGST_percent / 100, 2);
								let sGST = Math.round2(oItem.totFreight * oBill.sGST_percent / 100, 2);
								let iGST = Math.round2(oItem.totFreight * oBill.iGST_percent / 100, 2);

								let amt = Math.round2(oItem.totFreight + cGST + sGST + iGST, 2);

								let receivedAmt = NumberUtil.toFixed(
									oItem.billRecDecRef.reduce((amt, oBill) => amt + (oBill.amount || 0), 0) +
									oItem.billRecMrRef.reduce((amt, oBill) => amt + (oBill.amount || 0), 0));

								oItem.receivedAmount = NumberUtil.toFixed(amt - receivedAmt);

								// // pull credit note deduction if no mrRef found
								// oItem.aDeduction = oBill.receiving.deduction.filter(o => {
								// 	return o.genFrom === "cn" && !o.mrRef && o.grRef && oItem.grData && o.grRef === oItem.grData.grId;
								// }).map(o => {
								// 	o.readOnly = true;
								// 	o.type = o.deductionType;
								// 	return o;
								// });

							});

							return oBill;
						})
					);
				} else
					swal('Error', 'No Bill/Gr Found', 'error');

				refreshBillamt();

				let oBill;

				if ((oBill = vm.aBill.find(o => o._id === vm.myFilter.bill_no._id))) {
					oBill.items.forEach(o => {
						if (vm.myFilter.amount > 0) {
							let min = NumberUtil.toFixed(Math.abs(Math.min(vm.myFilter.amount, o.remainingAmount)));
							o.receivedAmount = min;
							vm.myFilter.amount -= min;
						} else
							o.receivedAmount = 0;

						o.paymentIds = [];
						o.grMrAmt = (o.gr.moneyReceipt && o.gr.moneyReceipt.collection || [])
							.reduce((acc, obj) => {
								if (obj.mrRef && obj.mrRef !== vm.oMoneyReceipt._id)
									return acc;
								if (obj.mrRef)
									o.grPay = true;
								if (obj.paymentId)
									o.paymentIds.push(obj.paymentId);
								return acc + (obj.paymentId ? obj.mrAmount : 0);
							}, 0);
					});

					if (vm.myFilter.tds > 0) {
						oBill.items[0].tdsAmount = vm.myFilter.tds;
					}
				}

				applyTDS();
				refreshBillamt();

				vm.myFilter = {};

			} catch (e) {
				console.error(e)
			}
		}

		function failure(res) {
			swal('Some error with GET bills.', JSON.stringify(res), 'error');
		}

	}

	function showGrPaymentDeductions() {
		$uibModal.open({
			templateUrl: 'views/bills/grPaymentDeduction.html',
			controller: [
				'$uibModalInstance',
				'otherDetail',
				function grPaymentDeductionController(
					$uibModalInstance,
					otherDetail
				) {
					let vm = this;

					vm.closePopup = close;

					(function init() {
						vm.aPayment = [];
						otherDetail.aBill.forEach(oBill => oBill.items.forEach(oItem => {
							if (oItem.gr && Array.isArray(oItem.gr.dedVch)) {
								oItem.gr.dedVch.forEach(o => o.grNumber = oItem.gr.grNumber);
								vm.aPayment.push(...oItem.gr.dedVch);
								if(oItem.gr.fpa && oItem.gr.fpa.linkMr)
									vm.aPayment.push({
										...oItem.gr.fpa,
										vT: "FPA",
										amount: oItem.gr.fpa.amt,
										grNumber: oItem.gr.grNumber
									});
							}
							if(oItem.gr && Array.isArray(oItem.gr.tMemoReceipt)) {
								vm.aPayment.push(...oItem.gr.tMemoReceipt);
							}
						}));
					})();

					// function definition
					function close() {
						$uibModalInstance.dismiss();
					}


				}
			],
			controllerAs: 'vm',
			resolve: {
				otherDetail: function () {
					return {
						aBill: vm.aBill
					};
				}
			}
		})
	}

	function getBills(billNo) {

		if (!(billNo && billNo.length > 2))
			return;

		return new Promise(function (resolve, reject) {

			let request = {
				'acknowledge.status': true,
				cancelled: {$ne: true},
				billNo,
				project: ['billNo', 'billAmount'],
				'acknowledge.voucher.acImp.st': true,
				populate: ['acknowledge.voucher'],
				no_of_docs: 10,
			};

			if (vm.oMoneyReceipt.billingParty)
				request['billingParty.customer'] = vm.oMoneyReceipt.billingParty.customer && vm.oMoneyReceipt.billingParty.customer._id;

			billsService.getGenerateBill(request, success, res => {
				reject([]);
				swal('Error', 'No Bill Found', 'error');
				console.log(res);
			});

			function success(res) {
				resolve(res.data.data);
			}
		});
	}

	function onSelectbillNo($item) {
		vm.myFilter.maxAmount = vm.myFilter.amount = NumberUtil.toFixed($item.billAmount);
		vm.myFilter.tds = 0;
	}

	// remove selected Gr from Bills
	function removeGr() {

		if (typeof vm.selectedGrIndex == 'number')
			vm.selectedBill.items.splice(vm.selectedGrIndex, 1);

		if (typeof vm.selectedBillIndex == 'number' && !vm.selectedBill.items.length)
			vm.aBill.splice(vm.selectedBillIndex, 1);

		if (vm.selectedBill.billNo === 'NA' && !(vm.selectedBill.items[0] && vm.selectedBill.items[0].gr && vm.selectedBill.items[0].gr.grNumber))
			vm.isMiscellaneousAdded = false;

		refreshBillamt();
	}

	// add Gr to Add Deduction on It
	function addGrForDed() {
		// set TDS Input Disabled

		if (!vm.myFilter.grDed)
			return;

		let request = {
			grNumber: vm.myFilter.grDed,
			bill_query: {
				'acknowledge.status': true,
				status: "Approved"
			},
			no_of_docs: 1,
			skip: 1,
		};

		tripServices.getAllGRItem(request, successCB, err => {
			swal('Error', err.data.message, 'error');
			console.log(err);
		});

		function successCB(res) {
			res = res.data.data.data;
			if (res.length)
				vm.aBill.push({
					billingParty: {account: {}},
					billNo: 'NA',
					receiving: {
						moneyReceipt: [],
						deduction: []
					},
					canApplyTDS: true,
					isNonReceivable: true,
					items: [{
						gr: res[0],
						receivedAmount: 0,
						aDeduction: [],
						billRecDecRef: [],
						billRecMrRef: []
					}]
				});
			else
				return swal('Error', 'No Gr found', 'error');

			vm.myFilter.grDed = null;
		}
	}

	function getMoneyReceipt(id) {

		let oFilter = {
			no_of_docs: 1,
			populate: true,
			_id: id
		};

		if (vm.mrNo)
			oFilter.mrNo = vm.mrNo;

		moneyReceiptService.getMoneyReceipt(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data.data && response.data.data[0]) {
				vm.mode = 'edit';
				prepareFromMr(response.data.data[0]);
			}
		}
	}

	// distribute all received deduction and Money Received on its respective Gr
	function distributeReceiving(oBill) {

		oBill.receiving = oBill.receiving || {};
		oBill.receiving.deduction = oBill.receiving.deduction || [];
		oBill.receiving.moneyReceipt = oBill.receiving.moneyReceipt || [];

		// add a miscellaneous gr (on bill with gr) if miscellaneous deduction found on credit note
		if (!!oBill.receiving.deduction.find(oDed => !oDed.grRef)) {
			if (!oBill.items.find(oItem => !((oItem.gr && oItem.gr._id) || (oItem.grData && oItem.grData.grNumber))))
				oBill.items.push({
					canApplyTDS: true,
					isNonReceivable: true,
					hasOtherGr: true,
					gr: {
						grNumber: '',
					},
					aDeduction: [],
					receivedAmount: 0,
				});
		}

		oBill.items.forEach(oItem => {

			if (vm.mode === 'add') {
				// oItem.aDeduction = oBill.receiving.deduction.reduce((arr, oDed) => {
				// 	if(!oDed.mrRef && oItem.gr._id ? oDed.grRef === oItem.gr._id : oDed.grNumber === oItem.grData.grNumber){
				// 		arr.push({
				// 			type: oDed.deductionType,
				// 			amount: oDed.amount,
				// 			readOnly: oDed.genFrom === 'cn'
				// 		});
				// 	}
				// 	return arr;
				// }, []);
			}

			oItem.billRecDecRef = oBill.receiving.deduction.filter(o => {
				if (oItem.gr._id)
					return o.grRef === oItem.gr._id;
				else if (oItem.grData)
					return o.grNumber === (oItem.grData && oItem.grData.grNumber);
				else if (!o.grRef)
					return true;
				else
					return false;
			});
			oItem.billRecMrRef = oBill.receiving.moneyReceipt.reduce((arr, oMr) => {
				arr.push(...oMr.grs.filter(o => oItem.gr._id ? o.grRef === oItem.gr._id : (o.grNumber) === (oItem.grData && oItem.grData.grNumber)).map(o => {
					o.mrNo = oMr.mrNo;
					return o;
				}));
				return arr;
			}, []);
		});
	}

	function refreshDeductionType(oItem, oDeduction) {
		vm.aBill.forEach(oBill => {
			oBill.items.forEach(oItem => {

				// let selectedDeduction = [...oItem.billRecDecRef.filter(o => o.mrRef).map(o => o.deductionType), ...(oItem.aDeduction || []).map(o => o.type)].filter(o => o);

				let selectedDeduction = [];

				if (oItem.billRecDecRef)
					selectedDeduction.push(...oItem.billRecDecRef.filter(o => o.mrRef).map(o => o.deductionType));

				if (oItem.aDeduction)
					selectedDeduction.push(...oItem.aDeduction.map(o => o.type));

				selectedDeduction = selectedDeduction.filter(o => o);
				if($scope.$configs.moneyReceipt.dedAccPrefill) {
					// default account for mmp set to sales a/c
					getAllAccount('Sales A/c', ['Receipt Deduction']).then(data => {
							oItem.aDeduction.forEach(oDed => {
								if(data && data[0] && data[0].name === 'Sales A/c')
								oDed.account = oDed.account || data[0];
							}, err => {console.log(err)});
						});
				}
				oItem.aDeduction.forEach(oDed => {
					oDed.aDeductionType = $scope.$constants.deductionObj.filter(o => selectedDeduction.indexOf(o.name) === -1 || oDed.type === o.name);
				});
			})
		});

		if (oItem && oDeduction) {
			let foundType = oItem.billRecDecRef.find(o => o.deductionType === oItem.aDeduction[vm.selectedDeductionIndex].type);

			if (foundType) {
				oItem.aDeduction[vm.selectedDeductionIndex].amount = foundType.amount;
				oItem.aDeduction[vm.selectedDeductionIndex].remark = foundType.remark;
				oItem.aDeduction[vm.selectedDeductionIndex].genFrom = foundType.genFrom;
				oItem.aDeduction[vm.selectedDeductionIndex].readOnly = foundType.genFrom === 'cn';
			} else {
				delete oItem.aDeduction[vm.selectedDeductionIndex].genFrom;
				delete oItem.aDeduction[vm.selectedDeductionIndex].readOnly;
				delete oItem.aDeduction[vm.selectedDeductionIndex].remark;
			}
			vm.refreshBillamt();
		}
	}

	function refreshBillamt() {

		vm.remainingBillAmount = 0;
		vm.totReceivedBillAmount = 0;
		vm.totBillReceiving = 0; // aka amount received on entire bill should be equal to advice amount
		vm.totBillDed = 0;
		let tdsOnGr = 0;

		adjustAdjustmentAmountOnGr();
		vm.aBill.forEach(oBill => {
			oBill.receivedAmount = 0;
			// adding amount to settlement Amount that's added on credit note but not on any gr of it.
			let naAmountReceivedOnCreditNote = oBill.receiving.deduction.reduce((amt, oDed) => {
				if (
					!oDed.grRef
					&& oDed.cNoteRef
					&& oDed.genFrom === 'cn'
					&& (
						oDed.genRevVch
						|| oDed.mrRef && (vm.oMoneyReceipt._id ? vm.oMoneyReceipt._id !== oDed.mrRef : true)
					)
				)
					return amt + oDed.amount;
				return amt;
			}, 0);

			oBill.items.forEach(function (oItem) {

				oItem.aDeduction = oItem.aDeduction || [];
				oItem.remainingAmount = 0;
				oItem.deduction = oItem.deduction || 0;
				oItem.settledAmount = oItem.settledAmount || 0;
				oItem.tdsAmount = oItem.tdsAmount || 0;
				oItem.receivedAmount = oItem.receivedAmount || 0;

				// oItem.totFreight = (oItem.gr && oItem.gr._id || oItem.grData && oItem.grData.grNumber) ? (oItem.totFreight || 0) : oBill.amount;
				// oItem.totFreight = Math.round2(oItem.totFreight, 2);
                //
				// oItem.cGST = Math.round2(oItem.totFreight * oBill.cGST_percent / 100, 2);
				// oItem.sGST = Math.round2(oItem.totFreight * oBill.sGST_percent / 100, 2);
				// oItem.iGST = Math.round2(oItem.totFreight * oBill.iGST_percent / 100, 2);
                //
				// oItem.grTotalAmount = Math.round2(oItem.totFreight + oItem.cGST + oItem.sGST + oItem.iGST + (oItem.cwt || 0), 2);
				oItem.deduction = oItem.aDeduction.reduce((a, c) => a + c.amount, 0);

				let deductionReceiving = 0;
				// adding all deduction received by credit note or other money receipt
				oItem.billRecDecRef.forEach(oRefDed => {
					if (
						oRefDed.genRevVch
						|| (
							oRefDed.mrRef
							&& (vm.oMoneyReceipt._id ? vm.oMoneyReceipt._id !== oRefDed.mrRef : true)
						)
					)
						deductionReceiving += oRefDed.amount;
				});

				let moneyReceiptReceiving = 0;
				// adding all Money receipt amount received on other money receipt
				oItem.billRecMrRef.forEach(oRefMr => {
					if (oRefMr.mrNo != vm.oMoneyReceipt.mrNo)
						moneyReceiptReceiving += oRefMr.amount;
				});

				// below code adjust itself "naAmountReceivedOnCreditNote" in settlement amount
				let settledAmt = NumberUtil.toFixed(deductionReceiving + moneyReceiptReceiving);
				if (naAmountReceivedOnCreditNote) {
					let remainingAmt = NumberUtil.toFixed((oItem.grTotalAmount - settledAmt));

					if (remainingAmt > naAmountReceivedOnCreditNote) {
						settledAmt += naAmountReceivedOnCreditNote;
						naAmountReceivedOnCreditNote = 0;
					} else if (remainingAmt < naAmountReceivedOnCreditNote) {
						settledAmt += remainingAmt;
						naAmountReceivedOnCreditNote -= remainingAmt;
					}
				}

				oItem.settledAmount = settledAmt;
				oItem.remainingAmount = NumberUtil.toFixed((oItem.grTotalAmount - oItem.settledAmount));
				oBill.receivedAmount += oItem.settledAmount;

				vm.totReceivedBillAmount += oItem.receivedAmount;
				vm.remainingBillAmount += oItem.remainingAmount;
				vm.totBillDed += oItem.deduction;
				tdsOnGr += (oItem.tdsAmount || 0);
				vm.totBillReceiving += oItem.receivedAmount;
			});

			oBill.remainingAmount = (oBill.billAmount - oBill.receivedAmount);
		});

		vm.oMoneyReceipt.adviceAmount = vm.totReceivedBillAmount = NumberUtil.toFixed(vm.totReceivedBillAmount);
		vm.adjAmt = vm.pendingAmount = NumberUtil.toFixed((vm.totReceivedBillAmount || 0) - ((vm.totBillDed || 0) + (vm.totBillTds || 0) + (vm.totBillExtCharge || 0) + (vm.totBillExtCharge2 || 0) + (vm.oMoneyReceipt.receivedAmount || 0)));

		if (tdsOnGr) {
			vm.totBillTds = tdsOnGr;
			vm.isTDSApplied = true;
		}
	}

	// to adjust the adjustment amount on each gr
	function adjustAdjustmentAmountOnGr() {
		let oBillItemAmount = {};
		vm.aBill.forEach(oBill => {
			oBill.items.forEach(oItem => {
				if (oItem.gr && oItem.gr._id || oItem.grData && oItem.grData.grNumber)
					oItem.totFreight = oItem.totFreight;
				else {
					if (oItem.hasOtherGr)
						oItem.totFreight = 0
					else
						oItem.totFreight = oBill.amount;
				}

				oItem.totFreight = Math.round2(oItem.totFreight, 2);

				oItem.cGST = (oItem.totFreight * oBill.cGST_percent / 100);
				oItem.sGST = (oItem.totFreight * oBill.sGST_percent / 100);
				oItem.iGST = (oItem.totFreight * oBill.iGST_percent / 100);

				oItem.grTotalAmount = oItem.totFreight + oItem.cGST + oItem.sGST + oItem.iGST + (oItem.cwt || 0);

				if(oBill.billNo){
					if(!oBillItemAmount[oBill.billNo])
						oBillItemAmount[oBill.billNo] = {
							amount: 0,
							count: 0
						};
					oBillItemAmount[oBill.billNo].amount += oItem.grTotalAmount;
					oBillItemAmount[oBill.billNo].count++;
				}
			});
		});

		vm.aBill.forEach(oBill => {
			if(!oBill.billNo)
				return;

			let ptr = oBillItemAmount[oBill.billNo];
			let diff = (oBill.billAmount - ptr.amount)/ptr.count;
			oBill.items.forEach(oItem => {
				if(oBill.billNo){
					oItem.grTotalAmount += diff;
				}
			});
		});

		vm.aBill.forEach(oBill => {
			if(!oBill.billNo)
				return;

			let diff = oBill.billAmount;
			let totGrAmount = 0;
			oBill.items.forEach(oItem => {
				totGrAmount += Math.round2(oItem.grTotalAmount, 2);
			});

			if(diff-=totGrAmount)
				oBill.items[0].grTotalAmount += diff;
		});
	}

	function clearBillData() {
		vm.aBill = [];
		refreshBillamt();
	}

	function getAllBranch(viewValue, id) {
		if (viewValue && viewValue.toString().length > 1 || id) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};

				if (id)
					req._id = id;
				else
					req.name = viewValue;

				branchService.getAllBranches(req, res => {
					resolve(res.data);
					if (id) {
						vm.oMoneyReceipt.branch = res.data[0];
						vm.billBookId = vm.oMoneyReceipt.branch.crBook ? vm.oMoneyReceipt.branch.crBook.map(o => o.ref) : '';
						getCostCenter();
					}
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}
		return [];
	}

	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({
					name: viewValue,
					project: JSON.stringify(['name', 'account.name', 'withHoldAccount.name', 'account._id', 'withHoldAccount._id', 'customer'])
				}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function getAutoStationaryNo() {
		if (!vm.oMoneyReceipt.date) {
			swal('Error', 'CN Date is required', 'error');
			return [];
		}

		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('crBook not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Cash Receipt',
			useDate: moment(vm.oMoneyReceipt.date, "DD/MM/YYYY").startOf('day').toDate(),
			"auto": true,
			"status": "unused",
			backDate: moment(vm.oMoneyReceipt.date || new Date(), 'DD/MM/YYYY').toISOString(),
			sch: 'cnote'
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.oMoneyReceipt.mrNo = response.data[0].bookNo;
		}
	}

	function onBPSelect(item) {

		if (!(item.account && item.account._id))
			swal('Error', 'A/c not linked with Billing party', 'error');

		vm.oMoneyReceipt.bpAcc = item.account._id;
		vm.oMoneyReceipt.bpAccNam = item.account.name;

		if (item.withHoldAccount && item.withHoldAccount._id) {
			vm.oMoneyReceipt.dedAcc = item.withHoldAccount._id;
			vm.oMoneyReceipt.dedAccNam = item.withHoldAccount.name;
		}
	}

	function onBranchSelect() {
		if (!vm.oMoneyReceipt.isVchAlGen)
			vm.oMoneyReceipt.mrNo = '';
		vm.billBookId = vm.oMoneyReceipt.branch.crBook ? vm.oMoneyReceipt.branch.crBook.map(o => o.ref) : '';
		getCostCenter();
	}

	function getCostCenter() {
		if(!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if(!(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id))
			return;

		let aDeduction = $scope.$constants.deductionObj.map(o => o.name);
		vm.oCostCenter = {};
		accountingService.getCostCenter({
			branch: vm.oMoneyReceipt.branch._id,
			feature: aDeduction,
			projection: {_id: 1, name: 1, category: "$category.name", feature: 1}
		}, (res) => {
			if(res.data.length)
				aDeduction.forEach(ded => {
					vm.oCostCenter[ded] = res.data.find(oCostCenter =>
						(Array.isArray(oCostCenter.feature) && oCostCenter.feature || [])
							.indexOf(ded) !== -1
					);
				});
			else{
				swal('Error', "Cost Center Not linked to Branch", 'error');
			}
		}, (res) => console.error(res));
	}

	function getMrStationary(viewValue) {

		if (!vm.oMoneyReceipt.date) {
			swal('Error', 'CN Date is required', 'error');
			return [];
		}


		if (!vm.billBookId)
			return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Cash Receipt',
				useDate: moment(vm.oMoneyReceipt.date, "DD/MM/YYYY").startOf('day').toDate(),
				status: "unused"
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

	function onMrNoSelect(item, model, label) {
		vm.selectedStationary = item;
	}

	function getAllAccount(viewValue, group) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 3) {
				return resolve([]);
			} else {
				accountingService.getAccountMaster({
					name: viewValue,
					group
				}, res => resolve(res.data.data), err => resolve([]));
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

	function onDedAccSelect(oAccount, oDeduction){
		if($scope.$configs.costCenter && $scope.$configs.costCenter.show){
			let dedType = oDeduction.type;
			let costCenter = vm.oCostCenter[dedType];
			if(!costCenter) {
				oDeduction.deductionAccount = undefined;
				return swal('Error', `Cost Center not linked to deduction type ${dedType}`, "error");
			}
			oDeduction.costCenter = costCenter;
		}
	}

	// function isSettled(oItem, $event) {
	// 	if (oItem.receivedAmount > 0 && oItem.receiviableAmount !== ((oItem.receivedAmount || 0) + (oItem.settlementAmount || 0)))
	// 		return 'border-red';
	// 	else
	// 		return '';
	// }

	// function selectThisGr(oGr) {
	// 	if (oGr)
	// 		vm.selectedGr = oGr;
	// 	else
	// 		vm.selectedGr = null;
	// }

	function validateReceivedAmount(item) {

		if (item.receivedAmount < item.grMrAmt)
			item.grPay = false;

		if ((item.receivedAmount /*+ item.deduction + (item.tdsAmount || 0)*/) > item.remainingAmount) {
			swal('', 'The Received amount should be less then or Equal to Remaining Amount', 'warning');
			item.receivedAmount = item.remainingAmount /*- item.deduction - item.tdsAmount*/;
		}

		refreshBillamt();
	}

	function applyTDS(oBill, oItem) {

		let totTDS = vm.aBill.reduce((amt, oBill) => {
			let tds = 0;
			oBill.items.forEach(oItem => {
				amt += (oItem.tdsAmount || 0);
				tds += (oItem.tdsAmount || 0);
			});
			oBill.isTDSApplied = !!tds;
			return amt;
		}, 0);

		if (totTDS) {
			vm.isTDSApplied = true;
			vm.totBillTds = totTDS;
		} else {
			vm.isTDSApplied = false;
			vm.totBillTds = 0;
		}
	}

	function applyExtraCharge() {

		let extCharge = vm.extraCharges.reduce((amt, oCharge) => amt + (oCharge.amt || 0), 0);

		if (extCharge) {
			vm.isExtChargeApplied = true;
			vm.totBillExtCharge = extCharge;
		} else {
			vm.isExtChargeApplied = false;
			vm.totBillExtCharge = 0;
		}

		let extCharge2 = vm.extraCharges2.reduce((amt, oCharge) => amt + (oCharge.amt || 0), 0);

		if (extCharge2) {
			vm.isExtChargeApplied2 = true;
			vm.totBillExtCharge2 = extCharge2;
		} else {
			vm.isExtChargeApplied2 = false;
			vm.totBillExtCharge2 = 0;
		}

		refreshBillamt();
	}

	function addMiscellaneousBill() {
		vm.aBill.push({
			billingParty: {account: {}},
			billNo: 'NA',
			receiving: {
				moneyReceipt: [],
				deduction: []
			},
			canApplyTDS: true,
			isNonReceivable: true,
			items: [{
				gr: {
					grNumber: ''
				},
				receivedAmount: 0,
				aDeduction: [{}],
				billRecDecRef: [],
				billRecMrRef: []
			}]
		});
		vm.isMiscellaneousAdded = true;
		vm.refreshDeductionType();
	}

	function selectBill(pIndex, index) {
		vm.selectedBillIndex = pIndex;
		vm.selectedBill = vm.aBill[pIndex];
		vm.selectedGrIndex = index;
		vm.selectedItem = vm.selectedBill.items[index];
		vm.selectedGr = vm.selectedItem.gr;
		vm.selectedItem.aDeduction = vm.selectedItem.aDeduction || [];
	}

	function submit() {
		console.log(vm.aBill);

		// validation
		for (let oBill of vm.aBill) {
			for (let oItem of oBill.items) {
				if (oBill.billNo && (oItem.receivedAmount) > oItem.remainingAmount)
					return swal('Error', `Gr Receiving should be less than remaining amount for Bill no ${oBill.billNo} and Gr No. ${oItem.gr.grNumber}`, 'error');
			}
		}

		// if (vm.oMoneyReceipt.receivedAmount && vm.oMoneyReceipt.receivedAmount > vm.totReceivedBillAmount)
		// 	return swal('Error', `Sum of Received Bill Amount should be equal to ${vm.oMoneyReceipt.receivedAmount}`, 'error');

		if (vm.oMoneyReceipt.adviceAmount != (vm.totReceivedBillAmount /*+ (vm.totBillDed || 0)*/))
			return swal('Error', 'Advice Amount is not completely distributed', 'error');

		if (vm.totReceivedBillAmount != NumberUtil.toFixed((vm.oMoneyReceipt.receivedAmount || 0) + (vm.totBillExtCharge || 0) + (vm.totBillExtCharge2 || 0) + (vm.totBillTds || 0) + (vm.totBillDed || 0) + (vm.adjAmt || 0)))
			return swal('Error', 'Sum of Received Bill Amount should be equal Sum of Bank Received, Deduction\'s, Tds Charge\'s, Extra Charge\'s', 'error');

		if (vm.totBillTds && !(vm.oMoneyReceipt.tdsAccount && vm.oMoneyReceipt.tdsAccount._id))
			return swal('Error', 'TDS A/c is Mandatory ', 'error');

		if (vm.totBillExtCharge && !(vm.oMoneyReceipt.extChargeAccount && vm.oMoneyReceipt.extChargeAccount._id))
			return swal('Error', 'Ext. Charges A/c is Mandatory', 'error');

		if (vm.totBillExtCharge2 && !(vm.oMoneyReceipt.extChargeAccount2 && vm.oMoneyReceipt.extChargeAccount2._id))
			return swal('Error', 'Ext. Charges A/c 2nd is Mandatory', 'error');

		if (vm.adjAmt && !(vm.oMoneyReceipt.adjAcc && vm.oMoneyReceipt.adjAcc._id))
			return swal('Error', 'Adjustment A/c is Mandatory', 'error');

		if (!(vm.oMoneyReceipt.bankAccount && vm.oMoneyReceipt.bankAccount._id))
			return swal('Error', 'Debit A/c is Mandatory', 'error');

		if (!(vm.oMoneyReceipt.billingParty && vm.oMoneyReceipt.billingParty._id))
			return swal('Error', 'Billing Party is mandatory', 'error');

		if($scope.$configs.moneyReceipt && $scope.$configs.moneyReceipt.dedNotToWithHold){

		}else if(vm.totBillDed && !(
			vm.oMoneyReceipt.billingParty
			&& vm.oMoneyReceipt.billingParty.withHoldAccount
			&& vm.oMoneyReceipt.billingParty.withHoldAccount._id
		))
			return swal('Error', 'Billing with Hold A/c isn\'t linked with Billing Party', 'error');

		if (!(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id))
			return swal('Error', 'Branch is Mandatory.', 'error');

		let crToUpdate = new Set();

		vm.aBill.forEach(oBill => {
			oBill.items.forEach(oItem => {
				oItem.aDeduction.forEach(oDed => {
					let found;
					if ((found = oItem.billRecDecRef.find(o => o.deductionType === oDed.type))) {
						found.creditNo && crToUpdate.add(found.creditNo);
					}
				});
			});
		});

		// if (crToUpdate.size) {
		//
		// 	// return swal('Warning', `Some Changes on deduction will lead to updation in Credit Note Deduction Amount on, ${[...crToUpdate].join(', ')}`, 'warning');
		//
		// 	swal({
		// 		title: "Are you sure you want to submit?",
		// 		text: `Some Changes on deduction will lead to updation in Credit Note Deduction Amount on, ${[...crToUpdate].join(', ')}`,
		// 		type: "warning",
		// 		showCancelButton: true,
		// 		confirmButtonColor: "#F44336",
		// 		confirmButtonText: "Yes, Sure!",
		// 		closeOnConfirm: true,
		// 		closeOnCancel: true,
		// 	}, function(isConfirm){
		// 		if(isConfirm){
		// 			prepareResponseAndSend();
		// 		}
		// 	});
		// } else {
		// vm.disableSubmit = true;
		prepareResponseAndSend();
		// }

		function prepareResponseAndSend() {
			// prepare response
			if (!vm.oMoneyReceipt.billingParty)
				vm.oMoneyReceipt.billingParty = vm.aBill[0].billingParty;

			let request = {
				mrNo: vm.oMoneyReceipt.mrNo,
				date: moment(vm.oMoneyReceipt.date || new Date(), 'DD/MM/YYYY').toISOString(),
				narration: vm.oMoneyReceipt.narration,
				branch: vm.oMoneyReceipt.branch._id,
				stationaryId: vm.selectedStationary && vm.selectedStationary._id,
				billingParty: vm.oMoneyReceipt.billingParty._id,
				bpNam: vm.oMoneyReceipt.billingParty.name,
				paymentMode: vm.oMoneyReceipt.paymentMode,

				receivedAmount: vm.oMoneyReceipt.receivedAmount || 0,
				totBillReceiving: vm.totReceivedBillAmount || 0,
				totBillDedReceiving: vm.totBillDed || 0,
				totTdsAmount: vm.totBillTds || 0,
				totExtChargeAmount: vm.totBillExtCharge || 0,
				totExtChargeAmount2: vm.totBillExtCharge2 || 0,
				adjAmt: vm.adjAmt || 0,

				bpAcc: vm.oMoneyReceipt.billingParty.account._id,
				bpAccNam: vm.oMoneyReceipt.billingParty.account.name,
				bankAccount: vm.oMoneyReceipt.bankAccount._id,
				bankAccountName: vm.oMoneyReceipt.bankAccount.name,
			};

			if (vm.oMoneyReceipt.paymentRef)
				request.paymentRef = vm.oMoneyReceipt.paymentRef;

			if (vm.oMoneyReceipt._id)
				request._id = vm.oMoneyReceipt._id;

			if (vm.totBillTds) {
				request.tdsAccount = vm.oMoneyReceipt.tdsAccount._id;
				request.tdsAccountName = vm.oMoneyReceipt.tdsAccount.name;
			}

			if (vm.totBillExtCharge) {
				request.extChargeAccount = vm.oMoneyReceipt.extChargeAccount._id;
				request.extChargeAccountName = vm.oMoneyReceipt.extChargeAccount.name;
			}

			if (vm.totBillExtCharge2) {
				request.extChargeAccount2 = vm.oMoneyReceipt.extChargeAccount2._id;
				request.extChargeAccountName2 = vm.oMoneyReceipt.extChargeAccount2.name;
			}

			if($scope.$configs.moneyReceipt && $scope.$configs.moneyReceipt.dedNotToWithHold){

			}else if (vm.totBillDed) {
				request.dedAcc = vm.oMoneyReceipt.billingParty.withHoldAccount._id;
				request.dedAccNam = vm.oMoneyReceipt.billingParty.withHoldAccount.name;
			}

			if (vm.adjAmt) {
				request.adjAcc = vm.oMoneyReceipt.adjAcc._id;
				request.adjAccNam = vm.oMoneyReceipt.adjAcc.name;
			}

			request.extCharges = vm.extraCharges || [];

			request.extCharges2 = vm.extraCharges2 || [];

			request.adviceAmount = request.totBillDedReceiving;

			request.grPayment = [];

			request.receiving = vm.aBill.reduce((arr, oBill) => {
				arr.push(...oBill.items.reduce((arr2, oItem) => {
					if (oItem.grPay)
						request.grPayment.push({
							gr_id: oItem.gr._id,
							paymentId: oItem.paymentIds
						});
					arr2.push({
						grRef: oItem.gr && oItem.gr._id,
						grNumber: oItem.gr && oItem.gr.grNumber || '',
						bP: oBill.billingParty._id,
						bpNam: oBill.billingParty.name,
						bpAcc: oBill.billingParty.account._id,
						bpAccNam: oBill.billingParty.account.name,
						totReceived: oItem.receivedAmount,
						totalDeduction: oItem.deduction,
						tdsAmt: oItem.tdsAmount || 0,
						billNo: oBill.billNo,
						billRef: oBill._id,
						deduction: oItem.aDeduction.map(oDed => ({
							deductionAccount: oDed && oDed.deductionAccount && oDed.deductionAccount._id,
							type: oDed.type,
							amount: oDed.amount,
							remark: oDed.remark,
							account: oDed.account && oDed.account._id &&
								{
								_id: oDed.account._id,
								name: oDed.account.name
							},
							costCenter: oDed.costCenter,
						}))
					});

					return arr2;
				}, []));

				return arr;
			}, []);

			console.log(request);
			vm.disableSubmit = true;
			if (request._id)
				moneyReceiptService.editMoneyReceipt(request, successCallback, failureCallback);
			else
				moneyReceiptService.addMoneyReceipt(request, successCallback, failureCallback);
		}

		function successCallback(response) {
			console.log(response);
			vm.disableSubmit = false;
			swal('', response.message, 'success');
			$state.go('billing.settleSelectedBill');
		}

		function failureCallback(err) {
			vm.disableSubmit = false;
			console.log(err);
			swal('', err.message, 'error');
		}

	}
}

function billWiseMoneyReceiptUpsertCtrl(
	$filter,
	$scope,
	$state,
	$stateParams,
	$uibModal,
	accountingService,
	billsService,
	branchService,
	billBookService,
	billingPartyService,
	DatePicker,
	moneyReceiptService,
	NumberUtil,
	tripServices
) {
	// object Identifiers
	var vm = this;

	vm.oMoneyReceipt = {};
	vm.oCostCenter = {};
	vm.balanceAmount = 0;
	vm.DatePicker = DatePicker;
	vm.selectedGr = null;
	vm.totalReceiving = null;
	vm.remainingBillAmount = null;
	vm.disableSubmit = false;
	vm.totBillTds = 0;
	vm.totBillExtCharge = 0;
	vm.totBillExtCharge2 = 0;

	// functions Identifiers
	vm.addBill = addBill;
	vm.addGrForDed = addGrForDed;
	// vm.addMiscellaneousBill = addMiscellaneousBill;
	vm.applyExtraCharge = applyExtraCharge;
	vm.applyTDS = applyTDS;
	vm.bulkAdd = bulkAdd;
	vm.clearBillData = clearBillData;
	vm.getAllBranch = getAllBranch;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getBills = getBills;
	vm.getMoneyReceipt = getMoneyReceipt;
	vm.getBillingParty = getBillingParty;
	vm.getMrStationary = getMrStationary;
	vm.getAllAccount = getAllAccount;
	vm.getAccount = getAccount;
	// vm.isSettled = isSettled;
	vm.onBPSelect = onBPSelect;
	vm.onDedAccSelect = onDedAccSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.onMrNoSelect = onMrNoSelect;
	vm.onSelectbillNo = onSelectbillNo;
	vm.removeGr = removeGr;
	vm.refreshBillamt = refreshBillamt;
	vm.showGrPaymentDeductions = showGrPaymentDeductions;
	// vm.selectThisGr = selectThisGr;
	vm.selectBill = selectBill;
	vm.addDeduction = addDeduction;
	vm.showAll = showAll;
	vm.refreshDeductionType = refreshDeductionType;
	vm.validateReceivedAmount = validateReceivedAmount;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.isDisabled = false;
		vm.aBill = [];
		vm.oMoneyReceipt.receivedAmount = 0;
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
		vm.isTDSApplied = false;
		vm.isExtChargeApplied = false;
		vm.isMiscellaneousAdded = false;
		vm.isBranchEditable = true;
		vm.extraCharges = [];
		vm.extraCharges2 = [];

		if (!$stateParams.data) {
			vm.readonly = true;
			vm.mode = 'add';
		} else if ($stateParams.data && $stateParams.data.billSettlement) {
			vm.readonly = false;
			vm.mode = 'add';
			vm.aBill = $stateParams.data.billSettlement;
			refreshBillamt();
		} else if ($stateParams.data) {
			vm.readonly = false;
			getMoneyReceipt($stateParams.data._id);
		}
	})();

	// Actual Functions

	// Prepare oMR object from Mr in edit mode
	function prepareFromMr(oMr) {

		vm.oMoneyReceipt = oMr;
		vm.isBranchEditable = vm.oMoneyReceipt.isVchAlGen ? !(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id) : true;

		if (!(vm.oMoneyReceipt.billingParty && vm.oMoneyReceipt.billingParty._id))
			delete vm.oMoneyReceipt.billingParty;

		if (vm.oMoneyReceipt.bankAccount) {
			vm.oMoneyReceipt.bankAccount = vm.oMoneyReceipt.bankAccountName ? {
				_id: vm.oMoneyReceipt.bankAccount,
				name: vm.oMoneyReceipt.bankAccountName
			} : vm.oMoneyReceipt.bankAccount;
		}

		if (vm.oMoneyReceipt.extChargeAccount) {
			vm.oMoneyReceipt.extChargeAccount = vm.oMoneyReceipt.extChargeAccountName ? {
				_id: vm.oMoneyReceipt.extChargeAccount,
				name: vm.oMoneyReceipt.extChargeAccountName
			} : vm.oMoneyReceipt.extChargeAccount;
		}

		if (vm.oMoneyReceipt.extChargeAccount2) {
			vm.oMoneyReceipt.extChargeAccount2 = vm.oMoneyReceipt.extChargeAccountName2 ? {
				_id: vm.oMoneyReceipt.extChargeAccount2,
				name: vm.oMoneyReceipt.extChargeAccountName2
			} : vm.oMoneyReceipt.extChargeAccount2;
		}

		if (vm.oMoneyReceipt.tdsAccount) {
			vm.oMoneyReceipt.tdsAccount = vm.oMoneyReceipt.tdsAccountName ? {
				_id: vm.oMoneyReceipt.tdsAccount,
				name: vm.oMoneyReceipt.tdsAccountName
			} : vm.oMoneyReceipt.tdsAccount;
		}

		if (vm.oMoneyReceipt.adjAmt) {
			vm.oMoneyReceipt.adjAcc = vm.oMoneyReceipt.adjAccNam ? {
				_id: vm.oMoneyReceipt.adjAcc,
				name: vm.oMoneyReceipt.adjAccNam
			} : vm.oMoneyReceipt.adjAcc;
		}

		vm.extraCharges = vm.oMoneyReceipt.extCharges || [];
		vm.isExtChargeApplied = !!vm.extraCharges.length;

		vm.extraCharges2 = vm.oMoneyReceipt.extCharges2 || [];
		vm.isExtChargeApplied2 = !!vm.extraCharges2.length;

		vm.aBill = vm.oMoneyReceipt.receiving.reduce((arr, oRec) => {

			if (oRec.billRef && oRec.grRef) {
				let foundBill = arr.find(o => o._id === (oRec.billRef && oRec.billRef._id));
				let itemRef = oRec.billRef.items.find(o => (o.gr._id ? o.gr._id : o.grData.grId) === oRec.grRef);

				if (foundBill) {
					foundBill.items.push(itemRef);
					foundBill.isTDSApplied = foundBill.isTDSApplied ? foundBill.isTDSApplied : !!oRec.tdsAmt;
				} else {
					arr.push(oRec.billRef);
					oRec.billRef.items = [itemRef];
					oRec.billRef.isTDSApplied = oRec.billRef.isTDSApplied ? oRec.billRef.isTDSApplied : !!oRec.tdsAmt;
				}

				itemRef.aDeduction = oRec.deduction;
				itemRef.receivedAmount = oRec.totReceived;
				itemRef.tdsAmount = oRec.tdsAmt;

			} else if (oRec.billRef && !oRec.grRef) {
				let foundBill = arr.find(o => o._id === (oRec.billRef && oRec.billRef._id));
				if(foundBill){
					let obj = {
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						// receivedAmount: oRec.totReceived,
						tdsAmount: oRec.tdsAmt
					};

					if(!(oRec.grRef && oRec.grNumber)) {
						obj.canApplyTDS = true;
						obj.isNonReceivable = true;
						obj.hasOtherGr = true;
					}

					foundBill.items.push(obj);
				}else{
					oRec.billRef.isTDSApplied = oRec.billRef.isTDSApplied ? oRec.billRef.isTDSApplied : !!oRec.tdsAmt;
					oRec.billRef.items = [{
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						// receivedAmount: oRec.totReceived,
						tdsAmount: oRec.tdsAmt
					}];
					arr.push(oRec.billRef);
				}
			} else if (oRec.grRef) {
				arr.push({
					canApplyTDS: true,
					billingParty: {account: {}},
					billNo: 'NA',
					isNonReceivable: true,
					items: [{
						gr: {
							_id: oRec.grRef,
							grNumber: oRec.grNumber
						},
						aDeduction: oRec.deduction,
						receivedAmount: 0,

					}]
				});
			} else {
				vm.isMiscellaneousAdded = true;
				arr.push({
					billNumber: oRec.billNo,
					bpNam: oRec.bpNam,
					billingParty: {account: {}},
					billNo: 'NA',
					canApplyTDS: true,
					isNonReceivable: true,
					items: [{
						gr: {
							grNumber: '',
						},
						aDeduction: oRec.deduction,
						receivedAmount: 0,
					}]
				});
			}

			return arr;
		}, []);

		vm.oMoneyReceipt.receivedAmount = vm.oMoneyReceipt.receivedAmount || 0;
		vm.oMoneyReceipt.adviceAmount = NumberUtil.toFixed(vm.oMoneyReceipt.adviceAmount || 0);
		vm.selectedStationary = {
			_id: vm.oMoneyReceipt.stationaryId,
			bookNo: vm.oMoneyReceipt.mrNo
		};

		vm.totBillTds = vm.oMoneyReceipt.totTdsAmount || 0;
		vm.totBillExtCharge = vm.oMoneyReceipt.totExtChargeAmount || 0;
		vm.totBillExtCharge2 = vm.oMoneyReceipt.totExtChargeAmount2 || 0;

		vm.aBill.forEach(distributeReceiving);
		vm.aBill.forEach(oBill => {
			oBill.items.forEach(o => {
				o.paymentIds = [];
				o.grMrAmt = (o.gr.moneyReceipt && o.gr.moneyReceipt.collection || []).reduce((acc, obj) => {
					if (obj.mrRef && obj.mrRef !== vm.oMoneyReceipt._id)
						return acc;
					if (obj.mrRef)
						o.grPay = true;
					if (obj.paymentId)
						o.paymentIds.push(obj.paymentId);
					return acc + (obj.paymentId ? obj.mrAmount : 0);
				}, 0);
			});
		})
		if (vm.oMoneyReceipt.branch && !vm.oMoneyReceipt.branch._id)
			getAllBranch(null, vm.oMoneyReceipt.branch);
		refreshDeductionType();
		refreshBillamt();
	}

	// add Bill
	function addBill() {

		if (!vm.myFilter.bill_no && !vm.myFilter.gr)
			return;

		if (vm.myFilter.bill_no && !vm.myFilter.bill_no._id)
			return swal('Warning', 'please select valid bill no', 'warning');

		let request = {
			'acknowledge.status': true,
			cancelled: {$ne: true},
			populate: ['billingParty.account', 'billingParty.withHoldAccount', 'creditNote.isReverse'],
			no_of_docs: 1000,
		};

		if (vm.oMoneyReceipt.billingParty)
			request['billingParty.customer'] = vm.oMoneyReceipt.billingParty.customer && vm.oMoneyReceipt.billingParty.customer._id;
		else
			return swal('Warning', 'Billing Party is required', 'warning');

		if (vm.myFilter.bill_no)
			request._id = vm.myFilter.bill_no._id;

		if (vm.myFilter.gr)
			request['items.gr.grNumber'] = vm.myFilter.gr;

		billsService.getGenerateBill(request, success, failure);

		function success(response) {
			try {
				if (response.data.data.length) {
					vm.aBill.push(...response.data.data
						.filter(oBill => {

							let foundBill = vm.aBill.find(o => o._id === oBill._id);

							if (foundBill) {
								return false;
							} else
								return true;
						})
						.map(oBill => {
							distributeReceiving(oBill);

							// oBill.items.forEach(oItem => {
                            //
							// 	oItem.receivedAmount = oItem.receivedAmount || 0;
							// 	oItem.receivedAmount = NumberUtil.toFixed(
							// 		oItem.billRecDecRef.reduce((amt, oBill) => amt + (oBill.amount || 0), 0) +
							// 		oItem.billRecMrRef.reduce((amt, oBill) => amt + (oBill.amount || 0), 0));
                            //
							// });

							// oBill.receivedAmount = NumberUtil.toFixed(oBill.billAmount - oBill.receivedAmt);

							return oBill;
						})
					);
				} else
					swal('Error', 'No Bill/Gr Found', 'error');

				refreshBillamt();
				applyTDS();
				refreshBillamt();

				vm.myFilter = {};

			} catch (e) {
				console.error(e)
			}
		}

		function failure(res) {
			swal('Some error with GET bills.', JSON.stringify(res), 'error');
		}

	}

	function showGrPaymentDeductions() {
		$uibModal.open({
			templateUrl: 'views/bills/grPaymentDeduction.html',
			controller: [
				'$uibModalInstance',
				'otherDetail',
				function grPaymentDeductionController(
					$uibModalInstance,
					otherDetail
				) {
					let vm = this;

					vm.closePopup = close;

					(function init() {
						vm.aPayment = [];
						otherDetail.aBill.forEach(oBill => oBill.items.forEach(oItem => {
							if (oItem.gr && Array.isArray(oItem.gr.dedVch)) {
								oItem.gr.dedVch.forEach(o => o.grNumber = oItem.gr.grNumber);
								vm.aPayment.push(...oItem.gr.dedVch);
								if(oItem.gr.fpa && oItem.gr.fpa.linkMr)
									vm.aPayment.push({
										...oItem.gr.fpa,
										vT: "FPA",
										amount: oItem.gr.fpa.amt,
										grNumber: oItem.gr.grNumber
									});
							}
							if(oItem.gr && Array.isArray(oItem.gr.tMemoReceipt)) {
								vm.aPayment.push(...oItem.gr.tMemoReceipt);
							}
						}));
					})();

					// function definition
					function close() {
						$uibModalInstance.dismiss();
					}


				}
			],
			controllerAs: 'vm',
			resolve: {
				otherDetail: function () {
					return {
						aBill: vm.aBill
					};
				}
			}
		})
	}

	function bulkAdd() {

		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/addBulkBillsPopup.html',
			controller: ['$scope',
				'$uibModalInstance',
				'DatePicker',
				'lazyLoadFactory',
				'stateDataRetain',
				'billsService',
				'aBill',
				'oMoneyReceipt',
				addBulkBillsPopupController],
			controllerAs: 'abVm',
			resolve: {
				aBill: function () {
					return {
						...vm.aBill,
					};
				},
				oMoneyReceipt: function () {
					return {
						...vm.oMoneyReceipt,
					};
				}
			}
		}).result.then(function (aBills) {
			applyData(aBills);
		}, function (aBills) {
			applyData(aBills);
		});
	}

	function applyData(aBills){
			if (aBills.length) {
				vm.aBill.push(...aBills
					.filter(oBill => {

						let foundBill = vm.aBill.find(o => o._id === oBill._id);

						if (foundBill) {
							return false;
						} else
							return true;
					})
					.map(oBill => {
						distributeReceiving(oBill);
						return oBill;
					})
				);

				refreshBillamt();
				applyTDS();
				refreshBillamt();
			}
		else
			swal('Error', 'No Bill/Gr Found', 'error');


	}

	function getBills(billNo) {

		if (!(billNo && billNo.length > 2))
			return;

		return new Promise(function (resolve, reject) {

			let request = {
				'acknowledge.status': true,
				cancelled: {$ne: true},
				billNo,
				project: ['billNo', 'billAmount'],
				'acknowledge.voucher.acImp.st': true,
				populate: ['acknowledge.voucher'],
				no_of_docs: 10,
			};

			if (vm.oMoneyReceipt.billingParty)
				request['billingParty.customer'] = vm.oMoneyReceipt.billingParty.customer && vm.oMoneyReceipt.billingParty.customer._id;

			billsService.getGenerateBill(request, success, res => {
				reject([]);
				swal('Error', 'No Bill Found', 'error');
				console.log(res);
			});

			function success(res) {
				resolve(res.data.data);
			}
		});
	}

	function onSelectbillNo($item) {
		vm.myFilter.maxAmount = vm.myFilter.amount = NumberUtil.toFixed($item.billAmount);
		vm.myFilter.tds = 0;
	}

	// remove selected Gr from Bills
	function removeGr() {

		// if (typeof vm.selectedGrIndex == 'number')
		// 	vm.selectedBill.items.splice(vm.selectedGrIndex, 1);

		if (typeof vm.selectedBillIndex == 'number')
			vm.aBill.splice(vm.selectedBillIndex, 1);

		if (vm.selectedBill.billNo === 'NA' && !(vm.selectedBill.items[0] && vm.selectedBill.items[0].gr && vm.selectedBill.items[0].gr.grNumber))
			vm.isMiscellaneousAdded = false;

		refreshBillamt();
	}

	// add Gr to Add Deduction on It
	function addGrForDed() {
		// set TDS Input Disabled

		if (!vm.myFilter.grDed)
			return;

		let request = {
			grNumber: vm.myFilter.grDed,
			bill_query: {
				'acknowledge.status': true,
				status: "Approved"
			},
			no_of_docs: 1,
			skip: 1,
		};

		tripServices.getAllGRItem(request, successCB, err => {
			swal('Error', err.data.message, 'error');
			console.log(err);
		});

		function successCB(res) {
			res = res.data.data.data;
			if (res.length)
				vm.aBill.push({
					billingParty: {account: {}},
					billNo: 'NA',
					receiving: {
						moneyReceipt: [],
						deduction: []
					},
					canApplyTDS: true,
					isNonReceivable: true,
					items: [{
						gr: res[0],
						receivedAmount: 0,
						aDeduction: [],
						billRecDecRef: [],
						billRecMrRef: []
					}]
				});
			else
				return swal('Error', 'No Gr found', 'error');

			vm.myFilter.grDed = null;
		}
	}

	function getMoneyReceipt(id) {

		let oFilter = {
			no_of_docs: 1,
			populate: true,
			_id: id
		};

		if (vm.mrNo)
			oFilter.mrNo = vm.mrNo;

		moneyReceiptService.getMoneyReceipt(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data.data && response.data.data[0]) {
				vm.mode = 'edit';
				prepareFromMr(response.data.data[0]);
			}
		}
	}

	// distribute all received deduction and Money Received on its respective Gr
	function distributeReceiving(oBill) {

		oBill.receiving = oBill.receiving || {};
		oBill.receiving.deduction = oBill.receiving.deduction || [];
		oBill.receiving.moneyReceipt = oBill.receiving.moneyReceipt || [];

		// add a miscellaneous gr (on bill with gr) if miscellaneous deduction found on credit note
		if (!!oBill.receiving.deduction.find(oDed => !oDed.grRef)) {
			if (!oBill.items.find(oItem => !((oItem.gr && oItem.gr._id) || (oItem.grData && oItem.grData.grNumber))))
				oBill.items.push({
					canApplyTDS: true,
					isNonReceivable: true,
					hasOtherGr: true,
					gr: {
						grNumber: '',
					},
					aDeduction: [],
					receivedAmount: 0,
				});
		}

		oBill.items.forEach(oItem => {

			if (vm.mode === 'add') {
				// oItem.aDeduction = oBill.receiving.deduction.reduce((arr, oDed) => {
				// 	if(!oDed.mrRef && oItem.gr._id ? oDed.grRef === oItem.gr._id : oDed.grNumber === oItem.grData.grNumber){
				// 		arr.push({
				// 			type: oDed.deductionType,
				// 			amount: oDed.amount,
				// 			readOnly: oDed.genFrom === 'cn'
				// 		});
				// 	}
				// 	return arr;
				// }, []);
			}

			oItem.billRecDecRef = oBill.receiving.deduction.filter(o => {
				if (oItem.gr._id)
					return o.grRef === oItem.gr._id;
				else if (oItem.grData)
					return o.grNumber === (oItem.grData && oItem.grData.grNumber);
				else if (!o.grRef)
					return true;
				else
					return false;
			});
			oItem.billRecMrRef = oBill.receiving.moneyReceipt.reduce((arr, oMr) => {
				arr.push(...oMr.grs.filter(o => oItem.gr._id ? o.grRef === oItem.gr._id : (o.grNumber) === (oItem.grData && oItem.grData.grNumber)).map(o => {
					o.mrNo = oMr.mrNo;
					return o;
				}));
				return arr;
			}, []);
		});
	}

	function refreshDeductionType(oItem, oDeduction) {
		vm.aBill.forEach(oBill => {
			oBill.items.forEach(oItem => {

				// let selectedDeduction = [...oItem.billRecDecRef.filter(o => o.mrRef).map(o => o.deductionType), ...(oItem.aDeduction || []).map(o => o.type)].filter(o => o);

				let selectedDeduction = [];

				if (oItem.billRecDecRef)
					selectedDeduction.push(...oItem.billRecDecRef.filter(o => o.mrRef).map(o => o.deductionType));

				if (oItem.aDeduction)
					selectedDeduction.push(...oItem.aDeduction.map(o => o.type));

				selectedDeduction = selectedDeduction.filter(o => o);

				oItem.aDeduction.forEach(oDed => {
					oDed.aDeductionType = $scope.$constants.deductionObj.filter(o => selectedDeduction.indexOf(o.name) === -1 || oDed.type === o.name);
				});
			})
		});

		if (oItem && oDeduction) {
			let foundType = oItem.billRecDecRef.find(o => o.deductionType === oItem.aDeduction[vm.selectedDeductionIndex].type);

			if (foundType) {
				oItem.aDeduction[vm.selectedDeductionIndex].amount = foundType.amount;
				oItem.aDeduction[vm.selectedDeductionIndex].remark = foundType.remark;
				oItem.aDeduction[vm.selectedDeductionIndex].genFrom = foundType.genFrom;
				oItem.aDeduction[vm.selectedDeductionIndex].readOnly = foundType.genFrom === 'cn';
			} else {
				delete oItem.aDeduction[vm.selectedDeductionIndex].genFrom;
				delete oItem.aDeduction[vm.selectedDeductionIndex].readOnly;
				delete oItem.aDeduction[vm.selectedDeductionIndex].remark;
			}
			vm.refreshBillamt();
		}
	}

	function refreshBillamt() {

		vm.remainingBillAmount = 0;
		vm.totReceivedBillAmount = 0;
		vm.totBillReceiving = 0; // aka amount received on entire bill should be equal to advice amount
		vm.totBillDed = 0;
		let tdsOnGr = 0;

		// adjustAdjustmentAmountOnGr();
		vm.aBill.forEach(oBill => {
			oBill.settledAmount = 0;
			oBill.deduction = 0;
			oBill.tdsAmount = 0;
			oBill.receivedAmount = oBill.receivedAmount || 0;
			oBill.remainingAmount = 0;
			// adding amount to settlement Amount that's added on credit note but not on any gr of it.
			let naAmountReceivedOnCreditNote = oBill.receiving.deduction.reduce((amt, oDed) => {
				if (
					!oDed.grRef
					&& oDed.cNoteRef
					&& oDed.genFrom === 'cn'
					&& (
						oDed.genRevVch
						|| oDed.mrRef && (vm.oMoneyReceipt._id ? vm.oMoneyReceipt._id !== oDed.mrRef : true)
					)
				)
					return amt + oDed.amount;
				return amt;
			}, 0);

			let moneyReceiptReceiving = 0;
			// adding all Money receipt amount received on other money receipt
			oBill.receiving.moneyReceipt.forEach(oRefMr => {
				if (oRefMr.mrNo != vm.oMoneyReceipt.mrNo)
					moneyReceiptReceiving += oRefMr.amount;
			});

			if(!oBill.receivedAmount)
			oBill.receiving.moneyReceipt.forEach(oRefMr => {
				if (oRefMr.mrNo === vm.oMoneyReceipt.mrNo)
					oBill.receivedAmount += oRefMr.amount;
			});

			let settledAmount = 0;
			let remAmount = 0;

			oBill.items.forEach(function (oItem) {

				oItem.aDeduction = oItem.aDeduction || [];
				oItem.deduction = oItem.aDeduction.reduce((a, c) => a + c.amount, 0);
				oBill.deduction += oItem.deduction || 0;

				tdsOnGr += (oItem.tdsAmount || 0);
				oBill.tdsAmount += (oItem.tdsAmount || 0);

				let deductionReceiving = 0;
				// adding all deduction received by credit note or other money receipt
				oItem.billRecDecRef.forEach(oRefDed => {
					if (
						oRefDed.genRevVch
						|| (
							oRefDed.mrRef
							&& (vm.oMoneyReceipt._id ? vm.oMoneyReceipt._id !== oRefDed.mrRef : true)
						)
					)
						deductionReceiving += oRefDed.amount;
				});

				// below code adjust itself "naAmountReceivedOnCreditNote" in settlement amount
				let settledAmt = NumberUtil.toFixed(deductionReceiving);
				if (naAmountReceivedOnCreditNote) {
					let remainingAmt = NumberUtil.toFixed((oItem.grTotalAmount - settledAmt));

					if (remainingAmt > naAmountReceivedOnCreditNote) {
						settledAmt += naAmountReceivedOnCreditNote;
						naAmountReceivedOnCreditNote = 0;
					} else if (remainingAmt < naAmountReceivedOnCreditNote) {
						settledAmt += remainingAmt;
						naAmountReceivedOnCreditNote -= remainingAmt;
					}
				}

				settledAmount += settledAmt;
			});
			    oBill.settledAmount = NumberUtil.toFixed(settledAmount + moneyReceiptReceiving);
			    oBill.remainingAmount = NumberUtil.toFixed((oBill.billAmount - oBill.settledAmount));
			    oBill.receivedAmount = oBill.receivedAmount || (remAmount ? remAmount : oBill.remainingAmount);

				vm.totReceivedBillAmount += oBill.receivedAmount;
				vm.remainingBillAmount += oBill.remainingAmount;
				vm.totBillDed += oBill.deduction;

				vm.totBillReceiving += oBill.receivedAmount;


			// oBill.remainingAmount = (oBill.billAmount - oBill.receivedAmount);
		});

		if (tdsOnGr) {
			vm.totBillTds = tdsOnGr;
			vm.isTDSApplied = true;
		}

		vm.oMoneyReceipt.adviceAmount = vm.totReceivedBillAmount = NumberUtil.toFixed(vm.totReceivedBillAmount);
		vm.adjAmt = vm.pendingAmount = NumberUtil.toFixed((vm.totReceivedBillAmount || 0) - ((vm.totBillDed || 0) + (vm.totBillTds || 0) + (vm.totBillExtCharge || 0) + (vm.totBillExtCharge2 || 0) + (vm.oMoneyReceipt.receivedAmount || 0)));

	}

	// to adjust the adjustment amount on each gr
	// function adjustAdjustmentAmountOnGr() {
	// 	let oBillItemAmount = {};
	// 	vm.aBill.forEach(oBill => {
	// 		oBill.items.forEach(oItem => {
	// 			if (oItem.gr && oItem.gr._id || oItem.grData && oItem.grData.grNumber)
	// 				oItem.totFreight = oItem.totFreight;
	// 			else {
	// 				if (oItem.hasOtherGr)
	// 					oItem.totFreight = 0
	// 				else
	// 					oItem.totFreight = oBill.amount;
	// 			}
    //
	// 			oItem.totFreight = Math.round2(oItem.totFreight, 2);
    //
	// 			oItem.cGST = (oItem.totFreight * oBill.cGST_percent / 100);
	// 			oItem.sGST = (oItem.totFreight * oBill.sGST_percent / 100);
	// 			oItem.iGST = (oItem.totFreight * oBill.iGST_percent / 100);
    //
	// 			oItem.grTotalAmount = oItem.totFreight + oItem.cGST + oItem.sGST + oItem.iGST + (oItem.cwt || 0);
    //
	// 			if(oBill.billNo){
	// 				if(!oBillItemAmount[oBill.billNo])
	// 					oBillItemAmount[oBill.billNo] = {
	// 						amount: 0,
	// 						count: 0
	// 					};
	// 				oBillItemAmount[oBill.billNo].amount += oItem.grTotalAmount;
	// 				oBillItemAmount[oBill.billNo].count++;
	// 			}
	// 		});
	// 	});
    //
	// 	vm.aBill.forEach(oBill => {
	// 		if(!oBill.billNo)
	// 			return;
    //
	// 		let ptr = oBillItemAmount[oBill.billNo];
	// 		let diff = (oBill.billAmount - ptr.amount)/ptr.count;
	// 		oBill.items.forEach(oItem => {
	// 			if(oBill.billNo){
	// 				oItem.grTotalAmount += diff;
	// 			}
	// 		});
	// 	});
    //
	// 	vm.aBill.forEach(oBill => {
	// 		if(!oBill.billNo)
	// 			return;
    //
	// 		let diff = oBill.billAmount;
	// 		let totGrAmount = 0;
	// 		oBill.items.forEach(oItem => {
	// 			totGrAmount += Math.round2(oItem.grTotalAmount, 2);
	// 		});
    //
	// 		if(diff-=totGrAmount)
	// 			oBill.items[0].grTotalAmount += diff;
	// 	});
	// }

	function clearBillData() {
		vm.aBill = [];
		refreshBillamt();
	}

	function getAllBranch(viewValue, id) {
		if (viewValue && viewValue.toString().length > 1 || id) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
				};

				if (id)
					req._id = id;
				else
					req.name = viewValue;

				branchService.getAllBranches(req, res => {
					resolve(res.data);
					if (id) {
						vm.oMoneyReceipt.branch = res.data[0];
						vm.billBookId = vm.oMoneyReceipt.branch.crBook ? vm.oMoneyReceipt.branch.crBook.map(o => o.ref) : '';
						getCostCenter();
					}
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}
		return [];
	}

	function getBillingParty(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty({
					name: viewValue,
					project: JSON.stringify(['name', 'account.name', 'withHoldAccount.name', 'account._id', 'withHoldAccount._id', 'customer'])
				}, res => {
					resolve(res.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function getAutoStationaryNo() {
		if (!vm.oMoneyReceipt.date) {
			swal('Error', 'CN Date is required', 'error');
			return [];
		}

		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('crBook not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Cash Receipt',
			useDate: moment(vm.oMoneyReceipt.date, "DD/MM/YYYY").startOf('day').toDate(),
			"auto": true,
			"status": "unused",
			backDate: moment(vm.oMoneyReceipt.date || new Date(), 'DD/MM/YYYY').toISOString(),
			sch: 'cnote'
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.oMoneyReceipt.mrNo = response.data[0].bookNo;
		}
	}

	function onBPSelect(item) {

		if (!(item.account && item.account._id))
			swal('Error', 'A/c not linked with Billing party', 'error');

		vm.oMoneyReceipt.bpAcc = item.account._id;
		vm.oMoneyReceipt.bpAccNam = item.account.name;

		if (item.withHoldAccount && item.withHoldAccount._id) {
			vm.oMoneyReceipt.dedAcc = item.withHoldAccount._id;
			vm.oMoneyReceipt.dedAccNam = item.withHoldAccount.name;
		}
	}

	function onBranchSelect() {
		if (!vm.oMoneyReceipt.isVchAlGen)
			vm.oMoneyReceipt.mrNo = '';
		vm.billBookId = vm.oMoneyReceipt.branch.crBook ? vm.oMoneyReceipt.branch.crBook.map(o => o.ref) : '';
		getCostCenter();
	}

	function getCostCenter() {
		if(!($scope.$configs.costCenter && $scope.$configs.costCenter.show))
			return;

		if(!(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id))
			return;

		let aDeduction = $scope.$constants.deductionObj.map(o => o.name);
		vm.oCostCenter = {};
		accountingService.getCostCenter({
			branch: vm.oMoneyReceipt.branch._id,
			feature: aDeduction,
			projection: {_id: 1, name: 1, category: "$category.name", feature: 1}
		}, (res) => {
			if(res.data.length)
				aDeduction.forEach(ded => {
					vm.oCostCenter[ded] = res.data.find(oCostCenter =>
						(Array.isArray(oCostCenter.feature) && oCostCenter.feature || [])
							.indexOf(ded) !== -1
					);
				});
			else{
				swal('Error', "Cost Center Not linked to Branch", 'error');
			}
		}, (res) => console.error(res));
	}

	function getMrStationary(viewValue) {

		if (!vm.oMoneyReceipt.date) {
			swal('Error', 'CN Date is required', 'error');
			return [];
		}


		if (!vm.billBookId)
			return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Cash Receipt',
				useDate: moment(vm.oMoneyReceipt.date, "DD/MM/YYYY").startOf('day').toDate(),
				status: "unused"
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

	function onMrNoSelect(item, model, label) {
		vm.selectedStationary = item;
	}

	function getAllAccount(viewValue, group) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 3) {
				return resolve([]);
			} else {
				accountingService.getAccountMaster({
					name: viewValue,
					group
				}, res => resolve(res.data.data), err => resolve([]));
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

	function onDedAccSelect(oAccount, oDeduction){
		if($scope.$configs.costCenter && $scope.$configs.costCenter.show){
			let dedType = oDeduction.type;
			let costCenter = vm.oCostCenter[dedType];
			if(!costCenter) {
				oDeduction.deductionAccount = undefined;
				return swal('Error', `Cost Center not linked to deduction type ${dedType}`, "error");
			}
			oDeduction.costCenter = costCenter;
		}
	}

	// function isSettled(oItem, $event) {
	// 	if (oItem.receivedAmount > 0 && oItem.receiviableAmount !== ((oItem.receivedAmount || 0) + (oItem.settlementAmount || 0)))
	// 		return 'border-red';
	// 	else
	// 		return '';
	// }

	// function selectThisGr(oGr) {
	// 	if (oGr)
	// 		vm.selectedGr = oGr;
	// 	else
	// 		vm.selectedGr = null;
	// }

	function validateReceivedAmount(bill) {

		// if (bill.receivedAmount < item.grMrAmt)
		// 	item.grPay = false;

		if ((bill.receivedAmount /*+ item.deduction + (item.tdsAmount || 0)*/) > bill.remainingAmount) {
			swal('', 'The Received amount should be less then or Equal to Remaining Amount', 'warning');
			bill.receivedAmount = bill.remainingAmount /*- item.deduction - item.tdsAmount*/;
		}

		refreshBillamt();
	}

	function applyTDS(oBill, oItem) {

		let totTDS = vm.aBill.reduce((amt, oBill) => {
			let tds = 0;
			oBill.items.forEach(oItem => {
				amt += (oItem.tdsAmount || 0);
				tds += (oItem.tdsAmount || 0);
			});
			oBill.isTDSApplied = !!tds;
			return amt;
		}, 0);

		if (totTDS) {
			vm.isTDSApplied = true;
			vm.totBillTds = totTDS;
		} else {
			vm.isTDSApplied = false;
			vm.totBillTds = 0;
		}
	}

	function applyExtraCharge() {

		let extCharge = vm.extraCharges.reduce((amt, oCharge) => amt + (oCharge.amt || 0), 0);

		if (extCharge) {
			vm.isExtChargeApplied = true;
			vm.totBillExtCharge = extCharge;
		} else {
			vm.isExtChargeApplied = false;
			vm.totBillExtCharge = 0;
		}

		let extCharge2 = vm.extraCharges2.reduce((amt, oCharge) => amt + (oCharge.amt || 0), 0);

		if (extCharge2) {
			vm.isExtChargeApplied2 = true;
			vm.totBillExtCharge2 = extCharge2;
		} else {
			vm.isExtChargeApplied2 = false;
			vm.totBillExtCharge2 = 0;
		}

		refreshBillamt();
	}

	// function addMiscellaneousBill() {
	// 	vm.aBill.push({
	// 		billingParty: {account: {}},
	// 		billNo: 'NA',
	// 		receiving: {
	// 			moneyReceipt: [],
	// 			deduction: []
	// 		},
	// 		canApplyTDS: true,
	// 		isNonReceivable: true,
	// 		items: [{
	// 			gr: {
	// 				grNumber: ''
	// 			},
	// 			receivedAmount: 0,
	// 			aDeduction: [{}],
	// 			billRecDecRef: [],
	// 			billRecMrRef: []
	// 		}]
	// 	});
	// 	vm.isMiscellaneousAdded = true;
	// 	vm.refreshDeductionType();
	// }

	function selectBill(index) {
		vm.selectedBillIndex = index;
		vm.selectedBill = vm.aBill[index];
		vm.aItems = vm.aBill[index].items;
		vm.flag = false;
	}

	function addDeduction(index){
		if(index === undefined)
			return;
		vm.aItems[index].gr = vm.aItems[index].gr || {};
		vm.aItems[index].aDeduction = vm.aItems[index].aDeduction || [];
		vm.aItems[index].aDeduction.push({});
		vm.refreshDeductionType();
	}

	function showAll() {
		vm.aItems = [];
		vm.flag = true;
		for (let oBill of vm.aBill) {
			vm.aItems.push(...oBill.items);
		}
	}

	function submit() {
		console.log(vm.aBill);

		// validation
		for (let oBill of vm.aBill) {
				if (oBill.billNo && (oBill.receivedAmount) > oBill.remainingAmount)
					return swal('Error', `Bill Receiving should be less than remaining amount for Bill no ${oBill.billNo} `, 'error');
		}

		// if (vm.oMoneyReceipt.receivedAmount && vm.oMoneyReceipt.receivedAmount > vm.totReceivedBillAmount)
		// 	return swal('Error', `Sum of Received Bill Amount should be equal to ${vm.oMoneyReceipt.receivedAmount}`, 'error');

		if (vm.oMoneyReceipt.adviceAmount != (vm.totReceivedBillAmount /*+ (vm.totBillDed || 0)*/))
			return swal('Error', 'Advice Amount is not completely distributed', 'error');

		if (vm.totReceivedBillAmount != NumberUtil.toFixed((vm.oMoneyReceipt.receivedAmount || 0) + (vm.totBillExtCharge || 0) + (vm.totBillExtCharge2 || 0) + (vm.totBillTds || 0) + (vm.totBillDed || 0) + (vm.adjAmt || 0)))
			return swal('Error', 'Sum of Received Bill Amount should be equal Sum of Bank Received, Deduction\'s, Tds Charge\'s, Extra Charge\'s', 'error');

		if (vm.totBillTds && !(vm.oMoneyReceipt.tdsAccount && vm.oMoneyReceipt.tdsAccount._id))
			return swal('Error', 'TDS A/c is Mandatory ', 'error');

		if (vm.totBillExtCharge && !(vm.oMoneyReceipt.extChargeAccount && vm.oMoneyReceipt.extChargeAccount._id))
			return swal('Error', 'Ext. Charges A/c is Mandatory', 'error');

		if (vm.totBillExtCharge2 && !(vm.oMoneyReceipt.extChargeAccount2 && vm.oMoneyReceipt.extChargeAccount2._id))
			return swal('Error', 'Ext. Charges A/c 2nd is Mandatory', 'error');

		if (vm.adjAmt && !(vm.oMoneyReceipt.adjAcc && vm.oMoneyReceipt.adjAcc._id))
			return swal('Error', 'Adjustment A/c is Mandatory', 'error');

		if (!(vm.oMoneyReceipt.bankAccount && vm.oMoneyReceipt.bankAccount._id))
			return swal('Error', 'Debit A/c is Mandatory', 'error');

		if (!(vm.oMoneyReceipt.billingParty && vm.oMoneyReceipt.billingParty._id))
			return swal('Error', 'Billing Party is mandatory', 'error');

		if($scope.$configs.moneyReceipt && $scope.$configs.moneyReceipt.dedNotToWithHold){

		}else if(vm.totBillDed && !(
			vm.oMoneyReceipt.billingParty
			&& vm.oMoneyReceipt.billingParty.withHoldAccount
			&& vm.oMoneyReceipt.billingParty.withHoldAccount._id
		))
			return swal('Error', 'Billing with Hold A/c isn\'t linked with Billing Party', 'error');

		if (!(vm.oMoneyReceipt.branch && vm.oMoneyReceipt.branch._id))
			return swal('Error', 'Branch is Mandatory.', 'error');

		let crToUpdate = new Set();

		vm.aBill.forEach(oBill => {
			oBill.items.forEach(oItem => {
				oItem.aDeduction.forEach(oDed => {
					let found;
					if ((found = oItem.billRecDecRef.find(o => o.deductionType === oDed.type))) {
						found.creditNo && crToUpdate.add(found.creditNo);
					}
				});
			});
		});

		// if (crToUpdate.size) {
		//
		// 	// return swal('Warning', `Some Changes on deduction will lead to updation in Credit Note Deduction Amount on, ${[...crToUpdate].join(', ')}`, 'warning');
		//
		// 	swal({
		// 		title: "Are you sure you want to submit?",
		// 		text: `Some Changes on deduction will lead to updation in Credit Note Deduction Amount on, ${[...crToUpdate].join(', ')}`,
		// 		type: "warning",
		// 		showCancelButton: true,
		// 		confirmButtonColor: "#F44336",
		// 		confirmButtonText: "Yes, Sure!",
		// 		closeOnConfirm: true,
		// 		closeOnCancel: true,
		// 	}, function(isConfirm){
		// 		if(isConfirm){
		// 			prepareResponseAndSend();
		// 		}
		// 	});
		// } else {
		// vm.disableSubmit = true;
		prepareResponseAndSend();
		// }

		function prepareResponseAndSend() {
			// prepare response
			if (!vm.oMoneyReceipt.billingParty)
				vm.oMoneyReceipt.billingParty = vm.aBill[0].billingParty;

			let request = {
				mrReceiving: "billWise",
				mrNo: vm.oMoneyReceipt.mrNo,
				date: moment(vm.oMoneyReceipt.date || new Date(), 'DD/MM/YYYY').toISOString(),
				narration: vm.oMoneyReceipt.narration,
				branch: vm.oMoneyReceipt.branch._id,
				stationaryId: vm.selectedStationary && vm.selectedStationary._id,
				billingParty: vm.oMoneyReceipt.billingParty._id,
				bpNam: vm.oMoneyReceipt.billingParty.name,
				paymentMode: vm.oMoneyReceipt.paymentMode,

				receivedAmount: vm.oMoneyReceipt.receivedAmount || 0,
				totBillReceiving: vm.totReceivedBillAmount || 0,
				totBillDedReceiving: vm.totBillDed || 0,
				totTdsAmount: vm.totBillTds || 0,
				totExtChargeAmount: vm.totBillExtCharge || 0,
				totExtChargeAmount2: vm.totBillExtCharge2 || 0,
				adjAmt: vm.adjAmt || 0,

				bpAcc: vm.oMoneyReceipt.billingParty.account._id,
				bpAccNam: vm.oMoneyReceipt.billingParty.account.name,
				bankAccount: vm.oMoneyReceipt.bankAccount._id,
				bankAccountName: vm.oMoneyReceipt.bankAccount.name,
			};

			if (vm.oMoneyReceipt.paymentRef)
				request.paymentRef = vm.oMoneyReceipt.paymentRef;

			if (vm.oMoneyReceipt._id)
				request._id = vm.oMoneyReceipt._id;

			if (vm.totBillTds) {
				request.tdsAccount = vm.oMoneyReceipt.tdsAccount._id;
				request.tdsAccountName = vm.oMoneyReceipt.tdsAccount.name;
			}

			if (vm.totBillExtCharge) {
				request.extChargeAccount = vm.oMoneyReceipt.extChargeAccount._id;
				request.extChargeAccountName = vm.oMoneyReceipt.extChargeAccount.name;
			}

			if (vm.totBillExtCharge2) {
				request.extChargeAccount2 = vm.oMoneyReceipt.extChargeAccount2._id;
				request.extChargeAccountName2 = vm.oMoneyReceipt.extChargeAccount2.name;
			}

			if($scope.$configs.moneyReceipt && $scope.$configs.moneyReceipt.dedNotToWithHold){

			}else if (vm.totBillDed) {
				request.dedAcc = vm.oMoneyReceipt.billingParty.withHoldAccount._id;
				request.dedAccNam = vm.oMoneyReceipt.billingParty.withHoldAccount.name;
			}

			if (vm.adjAmt) {
				request.adjAcc = vm.oMoneyReceipt.adjAcc._id;
				request.adjAccNam = vm.oMoneyReceipt.adjAcc.name;
			}

			request.extCharges = vm.extraCharges || [];

			request.extCharges2 = vm.extraCharges2 || [];

			request.adviceAmount = request.totBillDedReceiving;

			request.grPayment = [];

			request.receiving = vm.aBill.reduce((arr, oBill) => {
				arr.push(...oBill.items.reduce((arr2, oItem) => {
					if (oItem.grPay)
						request.grPayment.push({
							gr_id: oItem.gr._id,
							paymentId: oItem.paymentIds
						});
					arr2.push({
						grRef: oItem.gr && oItem.gr._id,
						grNumber: oItem.gr && oItem.gr.grNumber || '',
						bP: oBill.billingParty._id,
						bpNam: oBill.billingParty.name,
						bpAcc: oBill.billingParty.account._id,
						bpAccNam: oBill.billingParty.account.name,
						// totReceived: oItem.receivedAmount,
						totalDeduction: oItem.deduction,
						tdsAmt: oItem.tdsAmount || 0,
						billNo: oBill.billNo,
						billRef: oBill._id,
						deduction : oItem.aDeduction.reduce((arr, oDed) => {
							if(oDed.type && oDed.amount)
							arr.push({
								deductionAccount: oDed && oDed.deductionAccount && oDed.deductionAccount._id,
								type: oDed.type,
								amount: oDed.amount,
								remark: oDed.remark,
								account: oDed.account && oDed.account._id &&
								{
									_id: oDed.account._id,
									name: oDed.account.name
								},
								costCenter: oDed.costCenter,
							});
							return arr;
						}, [])
					});

					return arr2;
				}, []));

				return arr;
			}, []);

			request.billReceiving = vm.aBill.reduce((arr, oBill) => {
					arr.push({
						bP: oBill.billingParty._id,
						bpNam: oBill.billingParty.name,
						bpAcc: oBill.billingParty.account._id,
						bpAccNam: oBill.billingParty.account.name,
						totReceived: oBill.receivedAmount || 0,
						billNo: oBill.billNo,
						billRef: oBill._id,
					});
				return arr;
			}, []);

			console.log(request);
			vm.disableSubmit = true;
			if (request._id)
				moneyReceiptService.editMoneyReceiptV2(request, successCallback, failureCallback);
			else
				moneyReceiptService.addMoneyReceiptV2(request, successCallback, failureCallback);
		}

		function successCallback(response) {
			vm.disableSubmit = false;
			console.log(response);
			swal('', response.message, 'success');
			$state.go('billing.settleSelectedBill');
		}

		function failureCallback(err) {
			vm.disableSubmit = false;
			console.log(err);
			swal('', err.message, 'error');
		}

	}
}

function pullVoucherPopUpCtrl(
	$uibModalInstance,
	moneyReceiptService,
	voucherService
) {

	let vm = this;

	vm.closeModal = closeModal;
	vm.getRef = getRef;
	vm.submit = submit;

	(function init() {

	})();

	// function definition
	function closeModal() {
		$uibModalInstance.dismiss('cancel');
	}

	function getRef(name) {
		return new Promise(function (resolve, reject) {

			voucherService.getVoucher({
				refNo: name,
				project: ['refNo'],
				type: 'Receipt',
				no_of_docs: 10,
				sort : {refNoInt: 1}
			}, onSuccess, err => {
				console.log(err)
			});

			function onSuccess(res) {
				resolve(res.data.data);
			}
		});
	}

	function submit() {

		if (!(vm.refNo && vm.refNo._id))
			return swal("Error", "Invalid Ref No.", 'error');

		let req = {
			_id: vm.refNo._id
		};

		moneyReceiptService.pullVoucher(req, onSuccess, onFailure);

		function onFailure(response) {
			swal('Error!', response.message, 'error');
		}

		function onSuccess(response) {
			swal('Success', response.message, 'success');
			$uibModalInstance.close();
		}

	}

}

function addBulkBillsPopupController(
	$scope,
	$uibModalInstance,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	billsService,
	aBill,
	oMoneyReceipt,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.DatePicker = angular.copy(DatePicker);
	vm.aBill = aBill;
	vm.oMoneyReceipt = oMoneyReceipt;
	vm.getBills = getBills;
	vm.addBills = addBills;

	// init
	(function init() {
		vm.selectedBills = [];
		vm.columnSetting = {
			allowedColumn: [
				'Bill No.',
				// 'Gr No.',
				// 'TMemo No.',
				// 'Bill Type',
				// 'Status',
				// 'Billing Party',
				// 'Billing Party A/C',
				'Billing Date',
				// 'Due Date',
				// 'Allocated Freight',
				// 'CGST',
				// 'SGST',
				// 'IGST',
				// 'Total Tax',
				'Bill Amount',
				'Amount Received',
				'Due Amount',
				// 'MR No',
				// 'CoverNote No',
				// 'Credit Note No',
				// 'Category',
				// 'Created By',
				// 'Created At',
				// 'Last Modified At',
				// 'Last Modified By',
				// 'Bill Remark',
				// 'Remark',
			]
		};
		vm.tableHead = [
			{
				'header': 'Bill No.',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Gr No.',
				'filter': {
					'name': 'getGrNumber',
					'aParam': [
						'items',
						'"gr"',
					]
				}
			},
			{
				'header': 'TMemo No.',
				'filter': {
					'name': 'getTMNumber',
					'aParam': [
						'items',
						'"gr"',
						'"tMemo"',
						'"tMNo"'
					]
				}
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
				'bindingKeys': 'billingParty.account.name'
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
			{
				'header': 'Amount Received',
				//'bindingKeys': '(this | calReceivedAmt)|roundOff',
				'bindingKeys': '(this.recAmt || 0)|roundOff',
				'eval': true
			},
			{
				'header': 'Due Amount',
				//'bindingKeys': '((this.billAmount - (this | calReceivedAmt)) || 0)|roundOff',
				'bindingKeys': '(this.totDueAmt || 0)|roundOff',
				'eval': true

			},
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
				'bindingKeys': 'billAmount'
			},
			{
				'header': 'MR No',
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'receiving.moneyReceipt',
						'"mrNo"',
					]
				}
			},
			{
				'header': 'CoverNote No',
				'bindingKeys': 'coverNote.cnNo',
				'date': false
			},
			{
				'header': 'Credit Note No',
				'bindingKeys': 'this.creditNo',
				'date': false
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
				'header': 'Created At',
				'bindingKeys': 'created_at | date:"dd-MMM-yyyy"',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at | date:"dd-MMM-yyyy"',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Last Modified At',
				'bindingKeys': 'last_modified_at | date:"dd-MMM-yyyy"',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Last Modified By',
				'bindingKeys': 'last_modified_by',
				'date': false
			},
			{
				'header': 'Bill Remark',
				'bindingKeys': 'remarks',
			},
			{
				'header': 'Remark',
				'bindingKeys': '(this | currentStatusRemark)',
				eval: true
			}
		];
		vm.lazyLoad = lazyLoadFactory();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getBills(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilterObject();
		oFilter.sort={billDate:1,totDueAmt:1};
		billsService.getGenerateBill(oFilter, success, fail);

		function success(response) {
			if (response && response.data && response.data.data) {

				response = response.data;

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
				// vm.tableApi && vm.tableApi.refresh();
			}
		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function prepareFilterObject(isPagination) {
		var myFilter = {
			'acknowledge.status': true,
			'acknowledge.voucher.acImp.st': true,
			cancelled: {$ne: true},
			populate: ['billingParty.account', 'billingParty.withHoldAccount', 'creditNote.isReverse'],
		};

		if (vm.oMoneyReceipt.billingParty){
			myFilter['billingParty.customer'] = vm.oMoneyReceipt.billingParty.customer && vm.oMoneyReceipt.billingParty.customer._id || vm.oMoneyReceipt.billingParty.customer;
		}else {
		return swal('Warning', 'Billing Party is required', 'warning');
	     }

		if (vm.oFilter && vm.oFilter.from) {
			myFilter.start_date = new Date((vm.oFilter.from).setHours(0, 0, 0));
		}
		if (vm.oFilter && vm.oFilter.to) {
			myFilter.end_date = new Date((vm.oFilter.to).setHours(23, 59, 59));
		}


		myFilter.no_of_docs = 20;
		myFilter.skip = vm.lazyLoad.getCurrentPage();

		return myFilter;
	}

	function addBills() {
		if(!vm.selectedBills.length)
			return swal('', 'No Bill Selected', '');
		let msg = "Bill Added", selectedBills = [];

		vm.selectedBills.forEach(obj=>{
			if(obj.amountRecM >= obj.billAmount)
				msg = "MR already received on some of selected bills ";
			else
				selectedBills.push(obj);
		});

		if(!selectedBills.length) {
			msg = "MR already received on selected bills";
			return swal('warning', msg , 'warning');
		}

		if (selectedBills) {
			swal('success', msg , 'success');
			$uibModalInstance.dismiss(selectedBills);
		}
	}
}
