materialAdmin
	.controller("debitNoteController", debitNoteController)
	.controller("debitNoteUpsertController", debitNoteUpsertController);

debitNoteController.$inject = [
	"$scope",
	"$state",
	"$uibModal",
	"billsService",
	"billingPartyService",
	"Vendor",
	"debitNoteService",
	"DatePicker",
	"lazyLoadFactory",
	"stateDataRetain",
];
debitNoteUpsertController.$inject = [
	"$filter",
	"$scope",
	"$state",
	"$localStorage",
	"$stateParams",
	"$uibModal",
	"accountingService",
	"billsService",
	"branchService",
	"billBookService",
	"billingPartyService",
	"DatePicker",
	"Vendor",
	"materialService",
	"debitNoteService",
	"$stateParams",
	"NumberUtil",
];

function debitNoteController(
	$scope,
	$state,
	$uibModal,
	billsService,
	billingPartyService,
	Vendor,
	debitNoteService,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain
) {
	let vm = this;

	vm.DatePicker = DatePicker;
	vm.lazyLoad = lazyLoadFactory();
	vm.myFilter = {};
	$scope.onStateRefresh = function () {
		getDebitNote();
	};

	vm.debitNoteUpsert = debitNoteUpsert;
	vm.getDebitNote = getDebitNote;
	vm.rptDownload = rptDownload;
	vm.printBill = printBill;
	vm.remove = remove;
	vm.deleteMisc = deleteMisc;
	vm.unapprove = unapprove;
	vm.approve = approve
	vm.getBilling = getBilling;
	vm.getVendorName = getVendorName;

	// init
	(function init() {
		if (stateDataRetain.init($scope, vm)) return;
		vm.selectType = "index";
		vm.columnSetting = {
			allowedColumn: [
				"debitNo",
				"Purchase Bill Ref No",
				"Vendor Name",
				"date",
				"amount",
				"Created By",
				"Created At",
				"Approved",
			],
		};
		vm.tableHead = [
			{
				header: "debitNo",
				bindingKeys: "debitNo",
				date: false,
			},
			{
				header: "Purchase Bill Ref No",
				bindingKeys: "purBillRefNo",
				date: false,
			},
			{
				header: "amount",
				bindingKeys: "totalAmount",
			},
			{
				header: "Reference",
				bindingKeys: "refNo",
				date: false,
			},
			{
				header: "date",
				bindingKeys: "date",
				date: "dd-MMM-yyyy",
			},
			{
				header: "Created By",
				bindingKeys: "createdBy",
			},
			{
				header: "Created At",
				bindingKeys: "created_at",
			},
			{
				header: "Approved",
				bindingKeys: 'this.voucher ? "Yes" : "No"',
				$eval: true,
			},
			{
				header: "Vendor Name",
				bindingKeys: "vendorName",
			},
		];
		// getDebitNote();
	})();

	//filter for Invoice
	function prepareFilter() {
		var myFilter = {};
		if (vm.myFilter.debitNo) {
			myFilter.debitNo = vm.myFilter.debitNo;
		}
		if (vm.myFilter.purBillRefNo) {
			myFilter.purBillRefNo = vm.myFilter.purBillRefNo;
		}

		if(vm.myFilter.vendor) {
			myFilter.vendor = vm.myFilter.vendor._id;
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
		if (vm.myFilter.voucher) {
			if (vm.myFilter.voucher === "approve") {
				myFilter.voucher = { $exists: true };
			} else if (vm.myFilter.voucher === "unApprove") {
				myFilter.voucher = { $exists: false };
			}
		}
		myFilter.no_of_docs = 30;
		myFilter.skip = vm.lazyLoad.getCurrentPage();
		myFilter.sort = { date: -1 };
		return myFilter;
	}

	function unapprove() {
		debitNoteService.unapprove(
			{
				_id: vm.oSelectedDebitNo._id,
			},
			onSuccess,
			(err) => {
				console.log(err);
			}
		);

		function onSuccess(res) {
			swal("Success", res.message, "success");
		}
	}
	function approve() {
		let req = {};
		// req.branch = vm.oSelectedDebitNo.branch._id;
		// delete vm.oSelectedDebitNo.branch;
		req = {...vm.oSelectedDebitNo};
		req.approve = true;
		if (vm.oSelectedDebitNo._id) req._id = vm.oSelectedDebitNo._id;
		if (vm.oSelectedDebitNo._id)
			debitNoteService.editDebitNote(req, successCallback, failureCallback);
		function failureCallback(err) {
			vm.disableSubmit = false;
			return swal("Error", err.message, "error");
		}

		function successCallback(response) {
			swal("success", response.message, "success");
			vm.disableSubmit = false;
			vm.oDebitNote = { totalAmount: 0 };
			vm.aBill = [];
			// calculateAmount
			console.log(items);
		}
	}
	function getBilling(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				billingPartyService.getBillingParty(
					{ name: viewValue },
					(res) => {
						resolve(res.data);
					},
					(err) => {
						reject([]);
						console.log`${err}`;
					}
				);
			});
		}
	}

	function getVendorName(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			Vendor.getName({
				name: viewValue,
				deleted: false
			}, res => vm.aVendor = res.data.data, err => console.log`${err}`);
		}
	}

	function debitNoteUpsert(type) {
		if (type == "add") $state.go("billing.debitNoteUpsert");
		else if (type == "edit")
			$state.go("billing.debitNoteUpsert", { data: vm.oSelectedDebitNo });
	}

	function getDebitNote(isGetActive, isDownload) {
		if (isDownload) {
			if (!vm.myFilter.start_date || !vm.myFilter.end_date) {
				return swal("Error", "Start and End Date is required", "error");
			} else if (vm.myFilter.start_date > vm.myFilter.end_date) {
				return swal(
					"Error",
					"Start date should be less than end date",
					"error"
				);
			}
		}

		if (!vm.lazyLoad.update(isGetActive)) return;

		var oFilter = prepareFilter();
		oFilter.populate = ["billingParty", "branch"];
		if (isDownload) oFilter.download = isDownload;
		debitNoteService.getDebitNote(oFilter, function (response) {
			if (isDownload) {
				var a = document.createElement("a");
				a.href = response.url;
				a.download = response.url;
				a.target = "_blank";
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
		if (!(request.start_date || request.end_date))
			return swal("", "From & To Date are mandatory", "error");

		debitNoteService.rpt(request, function (response) {
			if (response.url) {
				let a = document.createElement("a");
				a.href = response.url;
				a.download = response.url;
				a.target = "_blank";
				a.click();
			}
		});
	}

	function printBill() {
		if (!vm.oSelectedDebitNo)
			return swal('Warning', 'Select at least one Debit Note!!!!!', 'warning');

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
							dNoteName: templateKey
						};

						clientService.getDebitNotePreview(oFilter, success, fail);
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

					let aTemplate = ($scope.$constants.aDebitNoteTemplate || []);
					return {
						_id: vm.oSelectedDebitNo._id,
						aBillTemplate: aTemplate,
					};
				}
			}
		});
	}

	function remove() {
		debitNoteService.remove(
			{
				_id: vm.oSelectedDebitNo._id,
			},
			onSuccess,
			(err) => {
				swal("Error", err.message, "error");
			}
		);

		function onSuccess(res) {
			swal("Success", res.message, "success");
		}
	}

	function deleteMisc() {
		if (!(vm.oSelectedDebitNo && vm.oSelectedDebitNo._id)) return;

		swal(
			{
				title: "Do you really want to Delete this Debit Note?",
				type: "warning",
				showCancelButton: true,
				confirmButtonClass: "btn-danger",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				closeOnConfirm: true,
				closeOnCancel: true,
				allowOutsideClick: true,
			},
			function (isConfirm) {
				if (isConfirm) {
					debitNoteService.deleteMiscDebitNote(
						{
							_id: vm.oSelectedDebitNo._id,
						},
						onSuccess,
						onFailure
					);

					function onSuccess(res) {
						swal("Success", res.message, "success");
						getDebitNote();
					}
					function onFailure(err) {
						swal("Error", err.message, "error");
					}
				}
			}
		);
	}
}

function debitNoteUpsertController(
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
	Vendor,
	materialService,
	debitNoteService,
	$stateParams,
	NumberUtil
) {
	// object Identifiers
	var vm = this;
	vm.filter = {};
	vm.oDebitNote = {};
	vm.billNo = "";
	// functions Identifiers
	vm.getAllBranch = getAllBranch;
	vm.addDeduction = addDeduction;
	vm.addMiscellaneousGr = addMiscellaneousGr;
	vm.calculateAmount = calculateAmount;
	vm.getAccount = getAccount;
	vm.getBill = getBill;
	vm.getCnBookNo = getCnBookNo;
	vm.getDebitNote = getDebitNote;
	vm.accountmaster = accountmaster;
	vm.getDebitNoteByDebitNo = getDebitNoteByDebitNo;
	vm.changeQuantity = changeQuantity;
	// vm.refreshBillamt = calculateAmount;
	// vm.refreshDeduction = refreshDeduction;
	vm.removeDeduction = removeDeduction;
	vm.removeMiscellaneousGr = removeMiscellaneousGr;
	vm.selectBill = selectBill;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getBillBookNo = getBillBookNo;
	vm.onRefSelect = onRefSelect;
	vm.getHSNCode = getHSNCode;
	vm.getMaterial = getMaterial;
	vm.getVendor = getVendor;
	// vm.addMaterial = addMaterial;
	vm.onMaterialSelect = onMaterialSelect;
	vm.selectBill = selectBill;
	vm.onBranchSelect = onBranchSelect;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.disableSubmit = false;
		// if (!$stateParams.data) {
		// 	vm.readonly = true;
		// 	calculateAmount();
		// 	vm.disableSubmit = false;
		// }
		vm.taxType = "1";
		if ($stateParams.data) {
			vm.taxType = $stateParams.data.iGST > 0 ? "1" : "2";
		}
		// vm.lazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: [
				"Name",
				"Code",
				"Description",
				"HSN",
				"Unit",
				"Rate",
				"Quantity",
				"CGST Rt.",
				"CGST Amt.",
				"SGST Rt.",
				"SGST Amt.",
				"IGST Rt.",
				"IGST Amt.",
				"Total",
			],
		};
		vm.tableHead = [
			{
				header: "Name",
				bindingKeys: "name",
			},
			{
				header: "Code",
				bindingKeys: "code",
			},
			{
				header: "Description",
				bindingKeys: "desc",
			},
			{
				header: "HSN",
				bindingKeys: "hsnCode",
			},
			{
				header: "Unit",
				bindingKeys: "unit",
			},
			{
				header: "Rate",
				bindingKeys: "rate",
			},
			{
				header: "Quantity",
				bindingKeys: "quantity",
			},
			{
				header: "CGST Rt.",
				bindingKeys: "cGSTPercent",
			},
			{
				header: "CGST Amt.",
				bindingKeys: "cGST",
			},
			{
				header: "SGST Rt.",
				bindingKeys: "sGSTPercent",
			},
			{
				header: "SGST Amt.",
				bindingKeys: "sGST",
			},
			{
				header: "IGST Rt.",
				bindingKeys: "iGSTPercent",
			},
			{
				header: "IGST Amt.",
				bindingKeys: "iGST",
			},
			{
				header: "Total",
				bindingKeys: "total",
			},
		];
		vm.amount = 0; // ∑(of Material + Repair/Labour amount without tax)
		vm.labourAmt = 0; // ∑(of Repair/Labour amount without tax)
		vm.totalAmount = 0; // ∑(of Material + Repair/Labour amount with tax)
		vm.cGST = 0; // cGST% of vm.amount
		vm.sGST = 0; // sGST% of vm.amount
		vm.iGST = 0; // iGST% of vm.amount
		vm.tdsAmt = 0; // ∑(tds% of Repair/Labour amount on which user want ot apply tds)
		vm.aMaterials = [];

		// vm.purchAcc = getAccountFromConfig();
		if ($stateParams.data) {
			vm.isEdit = true;
			$stateParams.data.account = $stateParams.data.account || {};
			$stateParams.data.account.ho_address =
				$stateParams.data.account.ho_address || {};
			vm.vendor = $stateParams.data.vendor;

			// getVendor(false, vm.vendor._id).then(function(data){
			// 	data[0] && onVendSelect(data[0]);
			// });
			vm.oDebitNote.branch = $stateParams.data.branch;
			vm.oDebitNote.date = $stateParams.data.date;
			vm.oDebitNote._id = $stateParams.data._id;
			// vm.billNo = $stateParams.data.purBillNo;
			vm.oDebitNote.debitNo = $stateParams.data.debitNo;
			vm.billNo = $stateParams.data.purBillRefNo;
			vm.getBill();
			if ($stateParams.data.tdsAc)
				vm.tdsAc = {
					_id: $stateParams.data.tdsAc,
					name: $stateParams.data.tdsAcName,
				};
			if ($stateParams.data.tcsAc)
				vm.tcsAc = {
					_id: $stateParams.data.tcsAc,
					name: $stateParams.data.tcsAcName,
				};
			// if($stateParams.data.labourAc)
			// 	vm.labourAc = {_id:$stateParams.data.labourAc, name:$stateParams.data.labourAcName};
			if ($stateParams.data.discountAcnt)
				vm.discountAcnt = {
					_id: $stateParams.data.discountAcnt,
					name: $stateParams.data.discountAcName,
				};

			vm.tdsRate = $stateParams.data.tdsRate;
			// vm.tcsRate = $stateParams.data.tcsRate;
			// vm.applyTcs = $stateParams.data.tcsRate ? true : false;
			vm.gstn = $stateParams.data.account.gstn;
			vm.state_name = $stateParams.data.account.ho_address.state;
			vm.state_code = $stateParams.data.account.ho_address.state_code;
			vm.from_account = $stateParams.data.from_account;
			vm.adjDebitAc = $stateParams.data.adjDebitAc;
			// vm.billNo = $stateParams.data.billNo;
			vm.billDate = moment($stateParams.data.billDate).format("DD/MM/YYYY");
			// vm.actulDate = moment($stateParams.data.actulDate).format('DD/MM/YYYY');
			// vm.billType = $stateParams.data.billType;
			// vm.branch = $stateParams.data.branch;
			// vm.remark = $stateParams.data.remark;
			// vm.prchType = $stateParams.data.prchType;
			// vm.partyType = $stateParams.data.partyType;
			// vm.vchType = $stateParams.data.plainVoucher && $stateParams.data.plainVoucher.type;
			// vm.refNo = $stateParams.data.refNo;
			vm.amount = $stateParams.data.amount || 0;
			vm.tdsAmt = $stateParams.data.tdsAmt || 0;
			vm.totalAmount = $stateParams.data.totalAmount || 0;
			vm.billAmount = $stateParams.data.billAmount || 0;
			vm.adjAmount = $stateParams.data.adjAmount || 0;
			vm.sGST = $stateParams.data.sGST || 0;
			vm.sgstAcnt = $stateParams.data.sgstAcnt;
			vm.cGST = $stateParams.data.cGST || 0;
			vm.cgstAcnt = $stateParams.data.cgstAcnt;
			vm.iGST = $stateParams.data.iGST || 0;
			vm.igstAcnt = $stateParams.data.igstAcnt;
			vm.taxType = $stateParams.data.iGST > 0 ? "1" : "2";

			// vm.aLabRep = $stateParams.data.labRepItems;
			// vm.purid = $stateParams.data._id;
			// vm.partyType = $stateParams.data.partyType;
			// calculateSummary();

			if (vm.branch)
				vm.billBookId = vm.branch.refNoBook
					? vm.branch.refNoBook.map((o) => o.ref)
					: "";
		}
		vm.isBillWithoutGr = false;
		vm.oDebitNote.totalAmount = 0;
		getAllBranch();
		// if ($stateParams.data && $stateParams.data.billSettlement) {
		// 	vm.readonly = false;
		// 	vm.aBill = $stateParams.data.billSettlement;
		// 	vm.billNo = vm.aBill[0].billNo;
		// 	calculateAmount();
		// 	calEachItemDeductionReceived();
		// } else if ($stateParams.data) {
		// 	vm.readonly = false;
		// 	getDebitNote($stateParams.data._id);
		// }
	})();

	// Actual Functions

	function onMaterialSelect($index, mat) {
		vm.oMaterialIndex = $index;
		vm.oMaterialId = mat.$$hashKey;
		vm.selectedItem = mat;
	}

	function selectBill(pIndex, index) {
		vm.selectedBillIndex = pIndex;
		vm.selectedBill = vm.aBill[pIndex];
		// vm.selectedGrIndex = index;
		vm.selectedItem = vm.selectedBill.items[index] || vm.selectedBill.items;
		// vm.selectedGr = vm.selectedItem.gr;
		vm.selectedItem.aDeduction = vm.selectedItem.aDeduction || [];
	}

	function getVendor(viewValue, _id) {
		return new Promise(function (resolve, reject) {
			if (viewValue != false && viewValue && viewValue.length < 3) {
				return resolve([]);
			}

			let oReq = {
				name: viewValue,
				fpa: true,
				cClientId: $scope.selectedClient,
			};

			if (_id) {
				delete oReq.name;
				oReq._id = _id;
			}

			Vendor.getAllVendorsList(
				oReq,
				function success(res) {
					resolve(res.data.data);
				},
				function (err) {
					reject([]);
				}
			);
		});
	}

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				accountingService.getAccountMaster(
					{ name: viewValue },
					(res) => resolve(res.data.data),
					(err) => reject(err)
				);
			});
		}
	}

	// function addMaterial() {
	// 	if (!vm.taxType || !vm.oMaterial || (vm.oMaterial.gstPercent < 0 ) || !vm.oMaterial.quantity || !vm.oMaterial.rate || !vm.oMaterial.unit) {
	// 		swal('Error','Select tax type and all other fields','error');
	// 		return;
	// 	}
	// 	let oPush = { ...vm.oMaterial };
	// 	oPush.totalWithoutTax = vm.oMaterial.rate * vm.oMaterial.quantity;
	// 	oPush.totAfterDiscount = oPush.totalWithoutTax - (vm.oMaterial.discount || 0);
	// 	vm.oMaterial.frgtGstPercent = vm.oMaterial.frgtGstPercent || 0;
	// 	// vm.taxType === '1' for IGST
	// 	let percent = vm.taxType === '1' ? vm.oMaterial.gstPercent : (vm.oMaterial.gstPercent / 2);
	// 	let frgtPercent = vm.taxType === '1' ? vm.oMaterial.frgtGstPercent : (vm.oMaterial.frgtGstPercent / 2);
	// 	oPush.cGSTPercent = vm.taxType === '1' ? 0 : percent;
	// 	oPush.sGSTPercent = vm.taxType === '1' ? 0 : percent;
	// 	oPush.iGSTPercent = vm.taxType === '1' ? percent : 0;
	// 	oPush.frgtCGSTPercent = vm.taxType === '1' ? 0 : frgtPercent;
	// 	oPush.frgtSGSTPercent = vm.taxType === '1' ? 0 : frgtPercent;
	// 	oPush.frgtIGSTPercent = vm.taxType === '1' ? frgtPercent : 0;

	// 	oPush.frgt = oPush.frgt || 0

	// 	oPush.cGST = oPush.totAfterDiscount * oPush.cGSTPercent / 100;
	// 	oPush.sGST = oPush.totAfterDiscount * oPush.sGSTPercent / 100;
	// 	oPush.iGST = oPush.totAfterDiscount * oPush.iGSTPercent / 100;
	// 	oPush.frgtCGST = oPush.frgt * oPush.frgtCGSTPercent / 100;
	// 	oPush.frgtSGST = oPush.frgt * oPush.frgtSGSTPercent / 100;
	// 	oPush.frgtIGST = oPush.frgt * oPush.frgtIGSTPercent / 100;

	// 	oPush.total = oPush.totAfterDiscount + oPush.cGST + oPush.sGST + oPush.iGST + oPush.frgt + oPush.frgtCGST + oPush.frgtSGST + oPush.frgtIGST;

	// 	oPush.hsnCode = oPush.hsnCode && oPush.hsnCode.hsnCode;
	// 	oPush.material = oPush.material && oPush.material.name;
	// 	vm.aMaterials.push(oPush);
	// 	vm.oMaterial = undefined;
	// 	calculateSummary();
	// }
	function calculateSummary() {
		if (vm.partyType == "Unregistered") removeTax();

		vm.tdsAmt = 0;
		vm.tcsAmt = 0;

		vm.totalMaterialWithoutTax = 0;
		vm.tableTotalMaterialWithoutTax = 0;
		vm.totalMaterialWithTax = 0;
		vm.totMaterialAfterDiscount = 0;
		vm.cGSTOfMaterial = 0;
		vm.sGSTOfMaterial = 0;
		vm.iGSTOfMaterial = 0;
		vm.tableCGSTOfMaterial = 0;
		vm.tableSGSTOfMaterial = 0;
		vm.tableIGSTOfMaterial = 0;
		vm.discountOfMaterial = 0;
		vm.totFrgt = 0;
		vm.frgtCGSTOfMaterial = 0;
		vm.frgtSGSTOfMaterial = 0;
		vm.frgtIGSTOfMaterial = 0;

		vm.aMaterials.forEach((mat) => {
			vm.totalMaterialWithoutTax +=
				(mat.totalWithoutTax || 0) + (mat.frgt || 0);
			vm.tableTotalMaterialWithoutTax += mat.totalWithoutTax || 0;
			vm.totalMaterialWithTax += mat.total || 0;
			vm.cGSTOfMaterial += (mat.cGST || 0) + (mat.frgtCGST || 0);
			vm.sGSTOfMaterial += (mat.sGST || 0) + (mat.frgtSGST || 0);
			vm.iGSTOfMaterial += (mat.iGST || 0) + (mat.frgtIGST || 0);
			vm.tableCGSTOfMaterial += mat.cGST || 0;
			vm.tableSGSTOfMaterial += mat.sGST || 0;
			vm.tableIGSTOfMaterial += mat.iGST || 0;
			vm.rateMaterial += mat.rate || 0;
			vm.discountOfMaterial += mat.discount || 0;
			vm.totFrgt += mat.frgt || 0;
			vm.frgtCGSTOfMaterial = mat.frgtCGST || 0;
			vm.frgtSGSTOfMaterial = mat.frgtSGST || 0;
			vm.frgtIGSTOfMaterial = mat.frgtIGST || 0;
		});

		vm.amount = NumberUtil.toFixed(vm.amt - vm.totDiscount);
		vm.totGST = vm.cGST + vm.sGST + vm.iGST;
		vm.totalAmount = NumberUtil.toFixed(
			vm.amount + vm.cGST + vm.sGST + vm.iGST - NumberUtil.toFixed(vm.tdsAmt)
		);
		if (vm.tcsRate && vm.applyTcs) {
			vm.tcsAmt = ((vm.totalAmount || 0) * (vm.tcsRate || 0)) / 100;
			vm.totalAmount = vm.totalAmount - NumberUtil.toFixed(vm.tcsAmt);
		}
		vm.billAmount = NumberUtil.toFixed(vm.totalAmount) + (vm.adjAmount || 0);
	}
	function getHSNCode(viewValue, code = "hsnCode") {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 1) {
				return resolve([]);
			}
			let req = { [code]: viewValue };

			materialService.getMaterialTypes(
				req,
				function success(res) {
					resolve(res.data);
				},
				function (err) {
					console.log(err);
					reject([]);
				}
			);
		});
	}

	function getMaterial(viewValue) {
		return new Promise(function (resolve, reject) {
			if (viewValue.length < 1) {
				return resolve([]);
			}
			let req = { material: viewValue && viewValue.trim() };
			if (vm.oMaterial.hsnCode) req.hsnCode = vm.oMaterial.hsnCode.hsnCode;

			materialService.getMaterialTypes(
				req,
				function success(res) {
					resolve(res.data);
					if (res.data[0].material) {
						vm.allMaterial = [];
						res.data[0].material.forEach((obj) => {
							vm.allMaterial.push({ ...res.data[0], name: obj });
						});
					}
				},
				function (err) {
					console.log(err);
					reject([]);
				}
			);
		});
	}

	function onBranchSelect() {
		if (vm.oDebitNote.branch) {
			vm.oDebitNote.debitNo = "";
			vm.billBookId = vm.oDebitNote.branch.debitBook
				? vm.oDebitNote.branch.debitBook.map((o) => o.ref)
				: "";
		}
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				branchService.getAllBranches(
					req,
					(res) => {
						resolve(res.data);
					},
					(err) => {
						console.log`${err}`;
						reject([]);
					}
				);
			});
		}

		return [];
	}

	function onRefSelect(item, model, label) {
		vm.selectedStationary = item;
	}

	function getBillBookNo(viewValue) {
		if (!vm.billBookId.length) {
			return;
		}

		return new Promise(function (resolve, reject) {
			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: "Debit Note",
				status: "unused",
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

	function getAutoStationaryNo(backDate) {
		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl("Ref Book not found on this branch", "danger");

		let req = {
			billBookId: vm.billBookId,
			type: "Ref No",
			auto: true,
			sch: "vch",
			status: "unused",
		};

		if (backDate) req.backDate = moment(backDate, "DD/MM/YYYY").toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.selectBill.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
		}
	}

	/*
	 * All the deduction applied that has been applied on Money Receipt, for them we generate Debit Note to Balance off the account.
	 * In this function we distribute deduction of respective gr that doesn't belong to any Debit Note.
	 * */
	function showDeductionWithoutDebitNote() {
		let oBill = vm.aBill[0];
		oBill.receiving.deduction.forEach((oRecDec) => {
			if (oRecDec.cNoteRef || !oRecDec.grRef) return;

			let fdItem = oBill.items.find((oItem) => oItem.gr._id === oRecDec.grRef);

			if (!fdItem) return;

			fdItem.aDeduction = fdItem.aDeduction || [];
			fdItem.aDeduction.push({
				amount: oRecDec.amount,
				genFrom: oRecDec.genFrom,
				deductionType: oRecDec.deductionType,
				remark: oRecDec.remark,
				...oRecDec,
			});
		});
	}

	/*
	 * this function add deduction
	 * */
	function addDeduction() {
		if (!vm.selectedItem) {
			swal("Error", "Please selece a row from material details table", "error");
		}
		vm.selectedItem.aDeduction = vm.selectedItem.aDeduction || [];
		vm.selectedItem.aDeduction.push({});
		refreshDeduction();
	}

	/*
	 * this function remove deduction
	 * */
	function removeDeduction() {
		if (!vm.selectedItem) {
			swal("Error", "Please selece a row from material details table", "error");
		}
		vm.dedSelectedItem.aDeduction.splice(vm.selectedDeductionIndex, 1);
		calculateAmount();
		refreshDeduction();
	}

	/*
	 * this function restrict duplicated deduction applied on same gr of debit note
	 * */
	function refreshDeduction() {
		// if($scope.$configs.debitNote.dedAccPrefill) {
		// 	// default account for mmp set to sales a/c
		// 	getAccount('Sales A/c', ['Receipt Deduction']).then(data => {
		// 		vm.aBill[0].items.forEach(oItem => {
		// 			oItem.aDeduction.forEach(oDed => {
		// 				if(data && data[0] && data[0].name === 'Sales A/c')
		// 				oDed.deductionAccount = oDed.deductionAccount || data[0];
		// 			});
		// 		});
		// 	},err => {console.log(err)});
		// }
		let aDeductionConstant = $scope.$constants.deductionObj;
		vm.aBill[0].materialItems.forEach((oItem) => {
			// if(!oItem.aDeduction) continue;
			if (oItem.aDeduction) {
				oItem.aDeduction.forEach((oDed) => {
					oDed.aDeductionTypeConstant = aDeductionConstant.filter(
						(oConstDed) =>
							!oItem.aDeduction.find((oNestedDed) =>
								oNestedDed.deductionType != oDed.deductionType
									? oNestedDed.deductionType === oConstDed.name
									: false
							)
					);
				});
			}
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
			isMiscellaneous: true,
		});
		vm.isMiscellaneousAdded = true;
	}

	function removeMiscellaneousGr() {
		vm.aBill[0].items = vm.aBill[0].items.filter((o) => !o.isMiscellaneous);
		vm.isMiscellaneousAdded = false;
	}

	// fetch debit note by Id or DebitNo
	function getDebitNote(_id, debitNo) {
		let request = {
			no_of_docs: 1,
			populate: ["billRef"],
		};

		if (_id) request._id = _id;
		else if (debitNo) request.debitNo = debitNo;
		else return;

		debitNoteService.getDebitNote(request, onSuccess, (err) => {
			console.log(err);
		});

		// Handle success response
		function onSuccess(response) {
			try {
				if (response && response.data) {
					vm.readonly = false;
					response = response.data.data[0];
					// toBillData(response);
					vm.filter = {};
					// refreshDeduction();
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	/*
	 * this function extract the Bill Data from the Debit note fetched.
	 * then entire html and angular binding is done on the basis of Bill Data. so when the debit note is fetched then
	 * the Bill Data is extracted from debit note and shown on UI.
	 * */
	// function toBillData(oDebitNote) {
	// 	if (oDebitNote.billRef) {
	// 		vm.billNo = oDebitNote.billRef.billNo;
	// 		vm.oDebitNote = oDebitNote;
	// 		vm.aBill = Array.isArray(oDebitNote.billRef) ? oDebitNote.billRef : [oDebitNote.billRef];
	// 		vm.aBill[0].receiving = vm.aBill[0].receiving || {};
	// 		vm.aBill[0].receiving.deduction = vm.aBill[0].receiving.deduction || [];
	// 		vm.aBill[0].receiving.moneyReceipt = vm.aBill[0].receiving.moneyReceipt || [];
	// 		let taxPercent = vm.aBill[0].cGST_percent + vm.aBill[0].sGST_percent + vm.aBill[0].iGST_percent;

	// 		if (vm.aBill[0].receiving.moneyReceipt.length)
	// 			vm.generateReverseVoucher.disable = true;
	// 		vm.oDebitNote.genRevVch = !!vm.oDebitNote.genRevVch;

	// 		// In case of debit note full(gr reversal) the gr is unlinked so the grNumber and other gr details aren't visible so we replace the gr with grData(which is the copy of the linked gr)
	// 		vm.aBill[0].items.forEach(o => {
	// 			if (!(o.gr && o.gr._id) && o.grData) {
	// 				o.gr = o.grData;
	// 				o.gr._id = o.gr.grId;
	// 			}
	// 		});

	// 		if (vm.aBill[0].items.length === 0 || !vm.aBill[0].items[0].totFreight) {
	// 			vm.isBillWithoutGr = true;
	// 			genEmptyGr(vm.aBill[0]);
	// 		}

	// 		oDebitNote.grs.forEach(function (item) {
	// 			if (item.deductionAccount) // preparing deduction account object similar to typeahead search object
	// 				item.deductionAccount = item.dedAccName ? {
	// 					_id: item.deductionAccount,
	// 					name: item.dedAccName
	// 				} : item.deductionAccount;

	// 			let fdItem = vm.aBill[0].items.find(obj => obj.gr.grNumber === item.grNumber);
	// 			// let fdDed = vm.aBill[0].receiving.deduction.find(o => o.deductionType ? (o.deductionType === item.deductionType && (o.grRef === item.grRef)) : (o.grRef === item.grRef));
	// 			// Object.assign(item, fdDed);

	// 			// the amount saved on debitNote.grs.amount is always inclusive of tax i.e. ∑(grs.amount) is equal to debitNote.totalAmount
	// 			if (vm.oDebitNote.genRevVch)
	// 				item.amount = NumberUtil.toFixed((item.amount * 100) / (100 + taxPercent)) || 0;

	// 			if (fdItem) {
	// 				fdItem.aDeduction = fdItem.aDeduction || [];
	// 				fdItem.aDeduction.push(item);
	// 			} else {
	// 				let lastItem = vm.aBill[0].items[vm.aBill[0].items.length - 1];
	// 				if (lastItem.gr._id) {
	// 					addMiscellaneousGr();
	// 					lastItem = vm.aBill[0].items[vm.aBill[0].items.length - 1];
	// 				}
	// 				lastItem.aDeduction = lastItem.aDeduction || [];
	// 				lastItem.aDeduction.push(item);
	// 			}
	// 		});

	// 		getWithHoldAcc();

	// 	}

	// 	vm.dnBookId = vm.aBill[0].billingParty.dnBook.filter(o => !!o).map(o => o.ref);
	// 	vm.showBillNo = true;

	// 	showDeductionWithoutDebitNote();
	// 	calEachItemDeductionReceived();
	// 	calculateAmount();
	// 	resetOnFullDebitNote();
	// }

	function getWithHoldAcc() {
		getAccount(false, [], vm.aBill[0].billingParty.withHoldAccount).then(
			function (aData) {
				vm.aBill[0].billingParty.withHoldAccount = aData[0];
			}
		);
	}
	// function calculateAmount() {

	// 	let oBill = vm.aBill && vm.aBill[0] || {cGST_percent: 0, sGST_percent: 0, iGST_percent: 0};
	// 	let taxPercent = (oBill.cGST_percent + oBill.sGST_percent + oBill.iGST_percent) || 0;

	// 	if (oBill._id) {
	// 		vm.oDebitNote.totalAmount = 0;

	// 		oBill.items.forEach(function (oItem) {
	// 			oItem.aDeduction = oItem.aDeduction || [];

	// 			// "oItem.totFreight" => it's exclusive of tax, so we have calculate the "oItem.grAmountWithTax" i.e. "oItem.totFreight" with inclusive of tax
	// 			if(taxPercent && oBill.cGST_percent || oBill.sGST_percent) {
	// 				let percent = taxPercent/2;
	// 				oItem.grAmountWithTax = oItem.totFreight;
	// 				oItem.grAmountWithTax += oItem.totFreight * percent / 100;
	// 				oItem.grAmountWithTax += oItem.totFreight * percent / 100;
	// 			}else
	// 				oItem.grAmountWithTax = oItem.totFreight + oItem.totFreight * taxPercent / 100;

	// 			oItem.grAmountWithTax = Math.round(oItem.grAmountWithTax * 100) / 100;
	// 		});
	// 	}
	// 	vm.oDebitNote.totalAmount = NumberUtil.toFixed(vm.oDebitNote.totalAmount);

	// 	//this fn assumes that the "vm.oDebitNote.totalAmount" is always provided and it extract the "vm.oDebitNote.amount" from it.
	// 	vm.oDebitNote.amount = Math.round2((vm.oDebitNote.totalAmount * 100) / (100 + taxPercent) || 0, 2);

	// 	vm.oDebitNote.cGST = Math.round2((vm.oDebitNote.amount * oBill.cGST_percent / 100) || 0, 2);
	// 	vm.oDebitNote.sGST = Math.round2((vm.oDebitNote.amount * oBill.sGST_percent / 100) || 0, 2);
	// 	vm.oDebitNote.iGST = Math.round2((vm.oDebitNote.amount * oBill.iGST_percent / 100) || 0, 2);

	// 	/*
	// 	* "receivedAmount" => total amount received on the bill by other generated debit note and money receipt.
	// 	* "remainingAmount" => total amount that is remaining or that can be received on the bill.
	// 	* "deductionApplied" => it's the sum of all the deduction applied on the bill. Note: Excluding current debit note's deductions in case of edit debit note.
	// 	* */

	// 	oBill.receivedAmount = 0;
	// 	oBill.receivedAmount += oBill.receiving && Array.isArray(oBill.receiving.moneyReceipt) && oBill.receiving.moneyReceipt.reduce((a, b) => a + (b.amount || 0), 0) || 0;
	// 	// restrict addition of current debit note grRef's amount in "receivedAmount". In case of edit only.
	// 	oBill.receivedAmount += oBill.deductionApplied = oBill.receiving && Array.isArray(oBill.receiving.deduction) && oBill.receiving.deduction.reduce((amt, oDed) => {
	// 		if (oDed.mrRef || (vm.oDebitNote && vm.oDebitNote._id && oDed.cNoteRef && vm.oDebitNote._id === oDed.cNoteRef)) { // in case of edit debit note
	// 			return amt;
	// 		} else { // in case of add debit note
	// 			return amt + oDed.amount;
	// 		}
	// 	}, 0) || 0;

	// 	oBill.remainingAmount = NumberUtil.toFixed(oBill.billAmount - oBill.receivedAmount);
	// }
	function changeQuantity(obj) {
		vm.oMaterial = vm.selectedItem;
		vm.taxType = vm.selectedItem.iGSTPercent > 0 ? '1' : '2';
		let oPush = { ...vm.oMaterial };
		oPush.totalWithoutTax = obj.rate * obj.quantity;
		// obj.rate = vm.oMaterial.rate;
		obj.totalWithoutTax = oPush.totalWithoutTax;
		// don't affect discount, frgt calculations for timebeing
		vm.oMaterial.discount = 0;
		vm.oMaterial.frgtGstPercent = 0;
		oPush.frgt = 0;
		//end of not affecting discount
		oPush.totAfterDiscount =
			oPush.totalWithoutTax - (vm.oMaterial.discount || 0);
		obj.totAfterDiscount = oPush.totAfterDiscount;
		vm.oMaterial.frgtGstPercent = vm.oMaterial.frgtGstPercent || 0;
		obj.frgtCGSTPercent = vm.oMaterial.frgtCGSTPercent;
		// vm.taxType === '1' for IGST
		let percent =
			vm.taxType === "1"
				? vm.oMaterial.gstPercent
				: vm.oMaterial.gstPercent / 2;
		let frgtPercent =
			vm.taxType === "1"
				? vm.oMaterial.frgtGstPercent
				: vm.oMaterial.frgtGstPercent / 2;
		oPush.cGSTPercent = vm.taxType === "1" ? 0 : percent;
		obj.cGSTPercent = oPush.cGSTPercent;
		oPush.sGSTPercent = vm.taxType === "1" ? 0 : percent;
		obj.sGSTPercent = oPush.sGSTPercent;
		oPush.iGSTPercent = vm.taxType === "1" ? percent : 0;
		obj.iGSTPercent = oPush.iGSTPercent;
		oPush.frgtCGSTPercent = vm.taxType === "1" ? 0 : frgtPercent;
		obj.frgtCGSTPercent = oPush.frgtCGSTPercent;
		oPush.frgtSGSTPercent = vm.taxType === "1" ? 0 : frgtPercent;
		obj.frgtSGSTPercent = oPush.frgtSGSTPercent;
		oPush.frgtIGSTPercent = vm.taxType === "1" ? frgtPercent : 0;
		obj.frgtIGSTPercent = oPush.frgtIGSTPercent;

		oPush.frgt = oPush.frgt || 0;
		obj.frgt = oPush.frgt;
		oPush.cGST = (oPush.totAfterDiscount * oPush.cGSTPercent) / 100;
		obj.cGST = oPush.cGST;
		oPush.sGST = (oPush.totAfterDiscount * oPush.sGSTPercent) / 100;
		obj.sGST = oPush.sGST;
		oPush.iGST = (oPush.totAfterDiscount * oPush.iGSTPercent) / 100;
		obj.iGST = oPush.iGST;
		oPush.frgtCGST = (oPush.frgt * oPush.frgtCGSTPercent) / 100;
		obj.frgtCGST = oPush.frgtCGST;
		oPush.frgtSGST = (oPush.frgt * oPush.frgtSGSTPercent) / 100;
		obj.frgtSGST = oPush.frgtSGST;
		oPush.frgtIGST = (oPush.frgt * oPush.frgtIGSTPercent) / 100;
		obj.frgtIGST = oPush.frgtIGST;

		oPush.total =
			oPush.totAfterDiscount +
			oPush.cGST +
			oPush.sGST +
			oPush.iGST +
			oPush.frgt +
			oPush.frgtCGST +
			oPush.frgtSGST +
			oPush.frgtIGST;
		obj.totalAmount = oPush.total;
		oPush.hsnCode = oPush.hsnCode;
		obj.HSNCode = oPush.hsnCode;
		oPush.material = oPush.material;
		obj.material = oPush.material;
	}
	function calculateAmount() {
		vm.totalMaterialWithoutTax = 0;
		vm.tableTotalMaterialWithoutTax = 0;
		vm.totalMaterialWithTax = 0;
		vm.totMaterialAfterDiscount = 0;
		vm.cGSTOfMaterial = 0;
		vm.sGSTOfMaterial = 0;
		vm.iGSTOfMaterial = 0;
		vm.tableCGSTOfMaterial = 0;
		vm.tableSGSTOfMaterial = 0;
		vm.tableIGSTOfMaterial = 0;
		vm.discountOfMaterial = 0;
		vm.totFrgt = 0;
		vm.frgtCGSTOfMaterial = 0;
		vm.frgtSGSTOfMaterial = 0;
		vm.frgtIGSTOfMaterial = 0;
		vm.aMaterials.forEach((mat) => {
			vm.totalMaterialWithoutTax +=
				(mat.totalWithoutTax || 0) + (mat.frgt || 0);
			vm.tableTotalMaterialWithoutTax += mat.totalWithoutTax || 0;
			vm.totalMaterialWithTax += mat.total || 0;
			vm.cGSTOfMaterial += (mat.cGST || 0) + (mat.frgtCGST || 0);
			vm.sGSTOfMaterial += (mat.sGST || 0) + (mat.frgtSGST || 0);
			vm.iGSTOfMaterial += (mat.iGST || 0) + (mat.frgtIGST || 0);
			vm.tableCGSTOfMaterial += mat.cGST || 0;
			vm.tableSGSTOfMaterial += mat.sGST || 0;
			vm.tableIGSTOfMaterial += mat.iGST || 0;
			vm.rateMaterial += mat.rate || 0;
			vm.discountOfMaterial += mat.discount || 0;
			vm.totFrgt += mat.frgt || 0;
			vm.frgtCGSTOfMaterial = mat.frgtCGST || 0;
			vm.frgtSGSTOfMaterial = mat.frgtSGST || 0;
			vm.frgtIGSTOfMaterial = mat.frgtIGST || 0;
		});
	}

	// it validate and if valid then fetch debit note by debitNo
	function getDebitNoteByDebitNo() {
		if (!vm.filter.debitNo && !vm.filter.refNo) return;

		if (vm.oDebitNote && vm.oDebitNote.debitNo == vm.filter.debitNo) return;

		getDebitNote(false, vm.filter.debitNo);
	}

	function resetOnFullDebitNote() {
		let amt = Math.round2(
			vm.oDebitNote.totalAmount -
			vm.oDebitNote.cGST -
			vm.oDebitNote.sGST -
			vm.oDebitNote.iGST -
			vm.oDebitNote.amount,
			2
		);
		if (Math.abs(amt) <= 0.02) vm.oDebitNote.amount += amt;
	}

	// fetch bill
	function getBill() {
		if (vm.aBill && vm.aBill.find((o) => o.billNo === vm.billNo)) return;

		vm.filter.no_of_docs = 1;

		let request = {
			refNo: vm.billNo,
			no_of_docs: 1,
			plainVoucher: true,
			multiBill: {
				$exists: false,
			},
			billType: {
				$ne: "Dues Bill",
			},
		};

		billsService.purchaseBillGet(request, success, failure);

		function success(res) {
			try {
				if (res.data) {
					vm.aBill = res.data;

					// vm.isBillWithoutGr = !!vm.aBill[0].items.find(o => !((o.grData && o.grData._id) || (o.gr && o.gr._id)));

					// vm.aBill[0].items = vm.aBill[0].items.filter(o => o.gr && o.gr._id);
					vm.aMaterials = vm.aBill[0].materialItems;
					// select first row of material table by default,
					if (vm.aMaterials) onMaterialSelect(0, vm.aMaterials[0]);
					if (vm.aBill[0].deduction) {
						vm.aBill[0].deduction.forEach((ded) => {
							let idx = vm.aMaterials.findIndex(
								(mat) => mat.material === ded.material
							);
							if (idx !== -1) {
								vm.aBill[0].materialItems[idx].aDeduction =
									vm.aBill[0].materialItems[idx].aDeduction || [];
								vm.aBill[0].materialItems[idx].aDeduction.push(ded);
							}
						});
					}

					// vm.aBill[0].materialItems.forEach((mat,idx)=>{
					// 	if(!mat.aDeduction) vm.aBill[0].materialItems[idx].aDeduction = [];
					// });
					calculateAmount();
					refreshDeduction();
					vm.aBill[0].receiving = vm.aBill[0].receiving || {};
					vm.aBill[0].receiving.deduction =
						vm.aBill[0].receiving.deduction || [];
					// vm.aBill[0].receiving.moneyReceipt = vm.aBill[0].receiving.moneyReceipt || [];

					// bill is only get in case of add debit note, on modify of bill no in case of edit debit note is same as add debit note.
					// if (vm.aBill[0].receiving.moneyReceipt.length) {
					// 	vm.oDebitNote.genRevVch = false;
					// 	vm.generateReverseVoucher.disable = true;
					// } else {
					// 	vm.oDebitNote.genRevVch = true;
					// 	vm.generateReverseVoucher.disable = false;
					// }

					vm.oDebitNote = vm.oDebitNote || {};

					showDeductionWithoutDebitNote();
					calEachItemDeductionReceived();
					calculateAmount();
					setAccount(vm.aBill[0]);
					// vm.dnBookId = vm.aBill[0].billingParty.cnBook.map(o => o.ref);
				}
				vm.readonly = false;
				refreshDeduction();
			} catch (e) {
				console.log(e);
			}
		}

		function failure(res) {
			swal("Some error with GET bills.", JSON.stringify(res), "error");
		}
	}

	//create empty Gr for bill without gr
	function genEmptyGr() {
		let oBill = vm.aBill[0];
		oBill.items = [
			{
				gr: {},
				grData: {},
				totFreight: oBill.billAmount,
				grAmountWithTax: oBill.billAmount,
				emptyGr: true,
			},
		];
	}

	//remove empty Gr for bill without gr
	function removeEmptyGr() {
		let oBill = vm.aBill[0];
		for (let [index, oItem] of oBill.items.entries()) {
			if (oItem.emptyGr) {
				oBill.items.splice(index, 1);
				break;
			}
		}
	}

	// it sets the default account that's save in client config
	function setAccount(oBill) {
		// vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === oBill.billingParty.clientId);
		// vm.clientAccount = vm.clientAccount || {};
		// vm.oDebitNote.iGSTAccount = {
		// 	name: vm.clientAccount.igstAccName,
		// 	_id: vm.clientAccount.igstAcc
		// };
		// vm.oDebitNote.cGSTAccount = {
		// 	name: vm.clientAccount.cgstAccName,
		// 	_id: vm.clientAccount.cgstAcc
		// };
		// vm.oDebitNote.sGSTAccount = {
		// 	name: vm.clientAccount.sgstAccName,
		// 	_id: vm.clientAccount.sgstAcc
		// };
	}

	/*
	 * this function calculate the total amount already received on each gr of bill
	 * "deductionReceived" => this is the key on each item of gr that contain the already received ∑deduction of each gr.
	 * */
	function calEachItemDeductionReceived() {
		let oBill = (vm.aBill && vm.aBill[0]) || {};
		if (oBill._id) {
			let taxPercent =
				oBill.cGST_percent + oBill.sGST_percent + oBill.iGST_percent || 0;
			oBill.items.forEach(function (item) {
				let totDed = oBill.receiving.deduction.reduce(
					(amt, obj) => (obj.grRef === item.gr._id ? amt + obj.amount : amt),
					0
				);
				// the amount saved on debitNote.grs.amount is always inclusive of tax i.e. ∑(grs.amount) is equal to debitNote.totalAmount
				if (vm.oDebitNote.genRevVch)
					item.deductionReceived =
						NumberUtil.toFixed((totDed * 100) / (100 + taxPercent)) || 0;
				else item.deductionReceived = NumberUtil.toFixed(totDed);
			});
		}
	}

	function onCNoteSelect(item, model, label) {
		vm.oDebitStationary = item;
	}

	// fetch debit note stationary
	function getCnBookNo(viewValue) {
		let bpConfig =
			($scope.$configs.master &&
				$scope.$configs.master.billingParty &&
				$scope.$configs.master.billingParty.defaultDebitNoteBook) ||
			false;

		if (!bpConfig && !vm.cnBookId.length) {
			return swal(
				"Error",
				`Please attach Debit Note Book with billing party ${vm.aBill[0].billingParty.name} on master page`,
				"error"
			);
		}
		if (!bpConfig) if (!vm.cnBookId.length) return [];

		if (!vm.oDebitNote.date) {
			swal("Error", "Date is required", "error");
			return [];
		}

		return new Promise(function (resolve, reject) {
			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.cnBookId,
				type: "Debit Note",
				useDate: moment(vm.oDebitNote.date, "DD/MM/YYYY")
					.startOf("day")
					.toDate(),
				status: "unused",
			};

			if (bpConfig) {
				delete requestObj.billBookId;
				requestObj.defaultBook = bpConfig;
				billBookService.getStationery(requestObj, oSuc, oFail);
			} else {
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

				if (viewValue) req.name = viewValue;
				else if (id) req._id = id;

				if (group.length) req.group = group;

				accountingService.getAccountMaster(
					req,
					(res) => resolve(res.data.data),
					(err) => resolve([])
				);
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
		let items = [];
		let purquantity = 0; // quantity on purchase bill,..
		let purTotalAmount = 0;
		let req = {};
		req.cGST = 0;
		req.sGST = 0;
		req.iGST = 0;
		req.amount = 0;
		req.quantity = 0;
		req.totalAmount = 0;
		vm.aBill[0].materialItems.forEach((mat) => {
			purTotalAmount += mat.total;
			purquantity += mat.quantity;
			if (mat.aDeduction) {
				// items.push(mat.aDeduction);
				mat.aDeduction.forEach((ded) => {
					req.cGST += ded.cGST;
					req.sGST += ded.sGST;
					req.iGST += ded.iGST;
					ded.amount = ded.totAfterDiscount ? ded.totAfterDiscount : ded.amount;
					if (ded.dedAccName.name && ded.dedAccName._id) {
						ded.deductionAccount = ded.dedAccName && ded.dedAccName._id;
						ded.dedAccName = ded.dedAccName.name;
					}
					req.amount += ded.amount;
					req.quantity += ded.quantity;
					req.totalAmount += ded.totalAmount;
					items.push(ded);
				});
			}
		});
		req.items = items;
		// check total quantities or debit amount not greter pur bill amount
		if (req.quantity > purquantity || req.totalAmount > purTotalAmount) {
			return swal(
				"Error",
				"Debit total amount or total quantites can not be greater purchase bill",
				"error"
			);
		}
		// req.items.forEach((ded)=>{
		// 	delete ded.aDeductionTypeConstant;
		// });
		req.purBillNo = vm.aBill[0].billNo;
		req.purBillRefNo = vm.billNo;
		req.purBillRef = vm.aBill[0]._id;
		req.clientId = vm.oDebitNote.branch.clientId;
		req.branch = vm.oDebitNote.branch._id;
		// req.date = new Date (vm.selectBill.date).toISOString();
		req.date = moment(vm.oDebitNote.date, "DD/MM/YYYY").toISOString();
		req.debitNo = vm.oDebitNote.debitNo;
		req.debitStationaryId = vm.oDebitNote.branch.debitBook[0]._id;
		if (vm.aBill[0].igstAcnt && vm.aBill[0].igstAcnt._id)
			req.iGSTAccount = vm.aBill[0].igstAcnt._id;
		if (vm.aBill[0].sgstAcnt && vm.aBill[0].sgstAcnt._id)
			req.sGSTAccount = vm.aBill[0].sgstAcnt._id;
		if (vm.aBill[0].cgstAcnt && vm.aBill[0].cgstAcnt._id)
			req.cGSTAccount = vm.aBill[0].cgstAcnt._id;
		if (vm.oDebitNote._id) req._id = vm.oDebitNote._id;

		if (approve)
			req.approve = approve;

		vm.disableSubmit = true;
		if (vm.oDebitNote._id)
			debitNoteService.editDebitNote(req, successCallback, failureCallback);
		else debitNoteService.addDebitNote(req, successCallback, failureCallback);

		function failureCallback(err) {
			vm.disableSubmit = false;
			return swal("Error", err.message, "error");
		}

		function successCallback(response) {
			swal("success", response.message, "success");
			vm.disableSubmit = false;
			vm.oDebitNote = { totalAmount: 0 };
			vm.aBill = [];
			// calculateAmount
			console.log(items);
		}
	}
}
