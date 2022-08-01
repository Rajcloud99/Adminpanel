materialAdmin
	.controller("tdsPaymentController", tdsPaymentController)
	.controller("addTdsPaymentrController", addTdsPaymentrController);

tdsPaymentController.$inject = [
	'$modal',
	'$filter',
	'$scope',
	'accountingService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'stateDataRetain',
	'voucherService'
];
addTdsPaymentrController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'branchService',
	'billBookService',
	'billsService',
	'DatePicker',
	'growlService',
	'otherUtils',
	'voucherService'
];

function tdsPaymentController(
	$modal,
	$filter,
	$scope,
	accountingService,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	stateDataRetain,
	voucherService
) {

	let vm = this;
	// object Identifiers
	vm.aAccountMaster = [];
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object
	vm.maxDate = new Date();


	// functions Identifiers
	vm.addPayment = addPayment;
	vm.getTdsVouchers = getTdsVouchers;
	$scope.onStateRefresh = function () {
		getTdsVouchers();
	};

	// INIT functions
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		vm.oFilter.to_date = new Date();

		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.selectType = 'multiple';
		vm.aVouchers = [];
		vm.aSelectedVouchers = [];
		vm.columnSetting = {
			allowedColumn: [
				'Category',
				'Vch Type',
				'Date',
				'Reference',
				'CREDIT AC',
				'CR Amt',
				'DEBIT AC',
				'DR Amt',
				'Narration',
				"Bill No",
				'Branch',
				"Pay Date",
				"Pay Ref",
				"Pay Mode",
				"Reversed By",
				"Reversed At",
				'Created By',
				'Created At',
				'last modified At',
				'last modified By',
				'Reversed',
			]
		};
		vm.tableHead = [
			{
				'header': 'Vch Type',
				'bindingKeys': 'type'
			},
			{
				'header': 'Category',
				'bindingKeys': 'vT'
			},
			{
				'header': 'CR Amt',
				html: true,
				filter: {
					name: 'trustAsHtml',
					aParam: ['crAmt']
				}
			},
			{
				'header': 'DR Amt',
				html: true,
				filter: {
					name: 'trustAsHtml',
					aParam: ['drAmt']
				}
			},
			{
				'header': 'CREDIT AC',
				html: true,
				filter: {
					name: 'trustAsHtml',
					aParam: ['crAc']
				}
			},
			{
				'header': 'DEBIT AC',
				// 'bindingKeys': 'this.drAc|trustAsHtml',
				html: true,
				filter: {
					name: 'trustAsHtml',
					aParam: ['drAc']
				}
			},
			{
				'header': 'Amount',
				'bindingKeys': 'amount'
			},
			{
				'header': 'Reference',
				'bindingKeys': 'refNo',
				'date': false
			},
			{
				'header': 'Narration',
				'bindingKeys': 'narration',
				'date': false
			},
			{
				'header': 'Date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Branch',
				'bindingKeys': 'branch.name'
			},
			{
				'header': 'Bill No',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Pay Date',
				'bindingKeys': 'paymentDate || chequeDate'
			},
			{
				'header': 'Pay Ref',
				'bindingKeys': 'paymentRef',
				'date': false
			},
			{
				'header': 'Pay Mode',
				'bindingKeys': 'paymentMode'
			},
			{
				'header': 'Reversed',
				'bindingKeys': 'this.reversed ? "Yes" : "No"',
				'eval': true
			},
			{
				'header': 'Reversed By',
				'bindingKeys': 'by'
			},
			{
				'header': 'Reversed At',
				'bindingKeys': 'at'
			},
			{
				'header': 'Deleted',
				'bindingKeys': 'this.deleted ? "Yes" : "No"',
				'eval': true
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
				'header': 'last modified At',
				'bindingKeys': 'last_modified_at'
			},
			{
				'header': 'last modified By',
				'bindingKeys': 'last_modified_by_name'
			}
		];
	})();

	// Actual Functions
	function addPayment(type = 'add') {
		if (type == 'edit') {
			let selectedVch;

			if (Array.isArray(vm.aSelectedVouchers)) {
				selectedVch = vm.aSelectedVouchers;
			} else
				return swal('Warning', 'Please Select Single Voucher', 'warning');


			stateDataRetain.go('accountManagment.tdsPaymentAdd', {
				data: {
					selectedVch,
					type
				}
			});
		}
	}

	// Get Day Book from backend
	function getTdsVouchers(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();

		voucherService.getVoucher(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {

			if (response && response.data) {
				response = response.data;

				var by = '';
				var at = '';
				for (var i = 0; i < response.data.length; i++) {

					for (var j = 0; j < response.data[i].his.length; j++) {

						if (response.data[i].his[j].cat == 'Revert') {
							response.data[i].by = response.data[i].his[j].by;
							response.data[i].at = response.data[i].his[j].at;
						}
					}
				}

				for (var i = 0; i < response.data.length; i++) {
					response.data[i].crAc = [];
					response.data[i].drAc = [];
					response.data[i].drAmt = [];
					response.data[i].crAmt = [];
					response.data[i].billNo = new Set();
					response.data[i].tAmt = 0;
					for (var k = 0; k < response.data[i].ledgers.length; k++) {
						if (response.data[i].ledgers[k].cRdR == 'CR') {
							response.data[i].crAc.push(response.data[i].ledgers[k].lName);
							response.data[i].crAmt.push((response.data[i].ledgers[k].amount).toFixed(2));
							response.data[i].tAmt += response.data[i].ledgers[k].amount;
						} else {
							response.data[i].drAc.push(response.data[i].ledgers[k].lName);
							response.data[i].drAmt.push((response.data[i].ledgers[k].amount).toFixed(2));
						}

						if (response.data[i].ledgers[k].bills.length) {
							(response.data[i].ledgers[k].bills).forEach(o => response.data[i].billNo.add(o.billNo));
						}
					}

					response.data[i].crAc = (response.data[i].crAc).join('<br>');
					response.data[i].drAc = (response.data[i].drAc).join('<br>');
					response.data[i].drAmt = (response.data[i].drAmt).join('<br>');
					response.data[i].crAmt = (response.data[i].crAmt).join('<br>');
					response.data[i].billNo = [...response.data[i].billNo].join(',');

				}
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
				// vm.tableApi && vm.tableApi.refresh();
			}
		}
	}

	function prepareFilterObject() {
		var filter = {};

		if (vm.oFilter.from_date) {
			filter.from_date = moment(vm.oFilter.from_date, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if (vm.oFilter.to_date) {
			filter.to_date = moment(vm.oFilter.to_date, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.tdsSection) {
			filter.tdsSection = vm.oFilter.tdsSection;
		}
		filter.vT = 'Vendor TDS';
		filter['acImp.st'] = true;
		filter['tdsVoucher.paid'] = false;

		filter.skip = vm.lazyLoad.getCurrentPage();
		if (!vm.oFilter.sortBy) {
			filter.sort = {refNoInt: 1};
			vm.oFilter.sortBy = "refNo";
		} else if (vm.oFilter.sortBy === 'date') {
			filter.sort = {date: -1};
		} else if (vm.oFilter.sortBy === 'acExp.at') {
			filter.sort = {'acExp.at': -1};
		} else if (vm.oFilter.sortBy === 'acImp.at') {
			filter.sort = {'acImp.at': -1};
		} else if (vm.oFilter.sortBy === 'created_at') {
			filter.sort = {'created_at': -1};
		} else {
			filter.sort = {'_id': -1};
		}
		return filter;
	}
}

function addTdsPaymentrController(
	$scope,
	$stateParams,
	accountingService,
	branchService,
	billBookService,
	billsService,
	DatePicker,
	growlService,
	otherUtils,
	voucherService
) {

	let vm = this;

	// functions Identifiers
	vm.submit = submit;
	vm.setUsed = setUsed;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.prepareData = prepareData;
	vm.prepareLedgersData = prepareLedgersData;
	vm.onSelect = onSelect;
	vm.onBillSelect = onBillSelect;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.getBillNo = getBillNo;
	vm.removeVoucher = removeVoucher;
	vm.setAmount = setAmount;
	vm.setBillType = setBillType;
	vm.culAmount = culAmount;

	// INIT functions
	(function init() {
		vm.isdisabled = false;
		vm.oVoucher = {};// initialize voucher object
		vm.aVoucher = {};// initialize voucher object
		vm.oFilter = {};// initialize voucher object
		vm.oFilter.aVoucher = vm.oFilter.aVoucher || {};
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
		vm.aBillType = ['New Ref', 'On Account', 'Against Ref'];
		vm.aType = ['DR', 'CR'];
		vm.aVoucherPaymentType = [
			{
				pType: "TDS Payment",
				voucherType: ["Payment"]
			}
		];
		vm.oAccountMaster = {}; // initialize Account Master object

		vm.opened = true;
		vm.totAmt = 0;
		vm.aSecV = [];
		vm.bills = [];
		vm.test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

			if ($stateParams.data) {
				vm.selectedVch = $stateParams.data.data.selectedVch;
				vm.mode = $stateParams.data.data.type.toLowerCase();
			}
			if (vm.mode === 'edit' || vm.mode === 'view') {
				prepareLedgersData();
			}

		vm.mode = vm.mode || 'add';
		if (vm.mode === 'add') {
			vm.oVoucher.chequeDate = new Date();
			vm.oVoucher.billDate = new Date();
		}
		if (vm.mode === 'view')
			vm.readOnly = true;
	})();

	// Actual Functions


	function billNoValidation(billNo, billType) {
		if (!otherUtils.isEmptyObject(billNo)) {
			billNo = (billNo).trim();
			if (billNo.length === 0)
				billNo = undefined;
		}
		if ((billType === 'New Ref' && otherUtils.isEmptyObject(billNo)) || (billType === 'Against Ref' && otherUtils.isEmptyObject(billNo))) {
			swal('Error', 'Bill No. Requierd', 'error');
			vm.nonValid = true;
			return false;
		} else {
			return true;
		}
	}


	vm.myFilter = function (item) {
		return !item.deleted;
	};

	function removeVoucher(aSecV) {
		aSecV.deleted = true;
	}

	// Get Account Masters

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 20,
				};
				// req.group = ['Transaction','banks','Internal Cashbook','Cashbook', 'Lorry Hire', 'Staff', 'Office', 'Others', 'Vendor', 'Happay Master', 'FastTag Master', 'Miscellaneous','Customer'];

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function setAmount(item, model, label) {
		vm.oFilter.aVoucher.amount = item.remAmt && Number(item.remAmt.toFixed(2));
	}

	function setBillType() {
		if (vm.oFilter.aVoucher.cRdR == 'CR' && vm.oVoucher.type == 'Receipt') {
			vm.oFilter.aVoucher.billType = 'On Account';
		} else if (vm.oFilter.aVoucher.cRdR == 'DR' && vm.oVoucher.type == 'Payment') {
			vm.oFilter.aVoucher.billType = 'On Account';
		} else {
			vm.oFilter.aVoucher.billType = undefined;
		}
	}


	function culAmount(totCreditAmount) {
		vm.oFilter.aVoucher = vm.oFilter.aVoucher || {};
		vm.oFilter.aVoucher.amount = totCreditAmount - (vm.totAmount || 0);
	}

	function setUsed(item, model, label) {
		vm.oVoucher.edited = true;
		vm.selectedStationary = item;
		vm.aSecV[0].billNo = item.bookNo;
	}


	function prepareLedgersData() {
		let obj = {accountEditable:true};
		obj.amount = 0;
		obj.to = undefined;
		obj.cRdR = 'CR';
		obj.billType = 'New Ref';
		vm.aSecV.push(obj);
		vm.selectedVch.forEach(obj => {
			obj.ledgers.forEach(item=>{
			if (item.bills.length && item.cRdR === 'CR') {
				item.bills.forEach(o => {
					let obj = {accountEditable:false};
					vm.totAmt += o.amount;
					obj.amount = o.amount;
					obj.billNo = o.billNo;
					obj.billType = 'Against Ref';
					obj.to = {_id: item.account, name: item.lName};
					obj.cRdR = 'DR';
					obj._id = o._id;
					vm.aSecV.push(obj);
				});
			} else if(item.cRdR === 'CR') {
				let obj = {accountEditable:false};
				vm.totAmt += item.amount;
				obj.amount = item.amount;
				obj._id = item._id;
				obj.to = {_id: item.account, name: item.lName};
				obj.cRdR = 'DR';
				vm.aSecV.push(obj);
			}
		});
	});

		vm.aSecV[0].amount = vm.totAmt;


		if (vm.aSecV.length > 0) {
			// vm.oVoucher = vm.selectedVch;
			$scope.$constants.aVoucherPaymentType.find(o => {
				if (o.pType === vm.oVoucher.vT) {
					vm.oPaymentType = o;
					vm.aVouchersType = vm.oPaymentType.voucherType;
					return;
				}
			});
			onSelect(vm.oVoucher.branch, 'edit');
			if (vm.oVoucher && vm.oVoucher.date) vm.oVoucher.chequeDate = new Date(vm.oVoucher.date);
			if (vm.oVoucher && vm.oVoucher.date) vm.oVoucher.billDate = new Date(vm.oVoucher.date);
		} else {
			vm.noRefNoFound = true;
			vm.oPaymentType = undefined;
			vm.oVoucher = {};
		}
	}


	function prepareData() {
		vm.ledgers = [];
		vm.aSecV.forEach(item => {
			if (vm.ledgers.length) {
				vm.flag = false;
				vm.ledgers.forEach(obj => {
					if (item.to._id == obj.account && item.cRdR == obj.cRdR) {
						obj.amount += item.amount;
						if (item.billNo || item.billType) {
							billNoValidation(item.billNo, item.billType);
							obj.bills.push({
								amount: item.amount,
								billNo: item.billNo,
								billType: item.billType,
							})
						}
						vm.flag = true;
					}

				});
				if (!vm.flag) {
					let obj = {
						account: item.to._id,
						lName: item.to.ledger_name || item.to.name,
						amount: item.amount,
						cRdR: item.cRdR,
					};
					obj.bills = obj.bills || [];
					if (item.billNo || item.billType) {
						billNoValidation(item.billNo, item.billType);
						obj.bills.push({
							amount: item.amount,
							billNo: item.billNo,
							billType: item.billType,
						})
					}
					vm.ledgers.push(obj);
				}
			} else {
				let obj = {
					account: item.to._id,
					lName: item.to.ledger_name || item.to.name,
					amount: item.amount,
					cRdR: item.cRdR,
				};
				obj.bills = obj.bills || [];
				if (item.billNo || item.billType) {
					billNoValidation(item.billNo, item.billType);
					obj.bills.push({
						amount: item.amount,
						billNo: item.billNo,
						billType: item.billType,
					})
				}
				vm.ledgers.push(obj);
			}
		});
	}


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

	function getBillNo(viewValue) {
		if (vm.oFilter.aVoucher.billType != 'Against Ref')
			return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				billNo: viewValue && viewValue.trim(),
				ledgers: [vm.oFilter.aVoucher.to._id],
				type: vm.oVoucher.type,
				no_of_docs: 10
			};

			if (vm.aSecV.length) {
				requestObj.billNo = {
					eq: requestObj.billNo,
					ne: vm.aSecV.map(o => o.billNo)
				};
			}

			voucherService.getBillNo(requestObj, oSuc, oFail);

			function oSuc(response) {
				resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function getRefNo(viewValue) {

		if (!vm.billBookId.length) {
			return;
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: vm.type,
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

	function getAutoStationaryNo(backDate) {
		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		if (!vm.oVoucher.branch.autoBook)
			return;

		let req = {
			"billBookId": vm.billBookId,
			"type": vm.type,
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (backDate)
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oVoucher.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
			vm.preserveRefNo.push({
				name: vm.oVoucher.branch.name,
				refNo: vm.aAutoStationary.bookNo,
				selectedStationary: vm.aAutoStationary
			});
			vm.aSecV[0].billNo = vm.oVoucher.refNo;
		}
	}

	function onBillSelect(item) {
		vm.oFilter.aVoucher.bill = item._id;
		vm.oFilter.aVoucher.billNo = item.billNo;
		vm.date = item.date;
	}

	function onSelect(item, type) {
		if (type == 'PaymentType') {
			vm.oVoucher.vT = item.pType;
			vm.fromGroup = item.fromGroup;
			vm.toGroup = item.toGroup;
			vm.aVouchersType = item.voucherType;
			if (item.voucherType.length)
				vm.oVoucher.type = item.voucherType[0];
		}
		vm.type = 'Ref No';
		if (vm.oVoucher.branch) {
			if (vm.type == 'Cash Receipt') {
				vm.billBookId = vm.oVoucher.branch.crBook ? vm.oVoucher.branch.crBook.map(o => o.ref) : '';
			} else {
				vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';
			}
			if (type == 'edit')
				return;

			vm.oVoucher.refNo = '';
			if (vm.oVoucher.branch.autoBook) {
				vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';
				vm.type = 'Ref No';
				vm.preserveRefNo = vm.preserveRefNo || [];
				if (vm.preserveRefNo.length) {
					let flag;
					vm.preserveRefNo.find(o => {
						if (o.name === vm.oVoucher.branch.name) {
							vm.oVoucher.refNo = o.refNo;
							vm.selectedStationary = o.selectedStationary;
						}
					});
				}
			}
		}
	}


	// Voucher submit
	function submit(formData) {
		if (formData.$valid) {
			vm.nonValid = false;

			if (!vm.aSecV.length) {
				return swal('Error', `No New Data found`, 'error');
			}
			if (!vm.oVoucher.branch._id) {
				return swal('Error', `branch required`, 'error');
			}
			prepareData();
			if (vm.nonValid)
				return;

			let aVouchers = angular.copy(vm.oVoucher);
			(aVouchers.ledgers = vm.ledgers).forEach(oLed => {
				(oLed.bills || []).forEach(oBill => {
					oBill.billNo = oBill.billNo && oBill.billNo.trim();
				});
			});

			aVouchers.branch = vm.oVoucher.branch._id;
			if (vm.selectedStationary || !aVouchers.stationaryId)
				aVouchers.stationaryId = (vm.selectedStationary && vm.selectedStationary.bookNo) === vm.oVoucher.refNo ? vm.selectedStationary._id : undefined;
			if (aVouchers.billDate) {
				aVouchers.date = moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString();
				aVouchers.chequeDate = moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString();
			}
			vm.isdisabled = true;
			aVouchers.upDateVoucher = vm.selectedVch.map(v => v._id);

			voucherService.tdsPayment(aVouchers, onSuccess, onFailure);


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				swal('Success', response.message, 'success');
				vm.isdisabled = false;
				vm.oVoucher.refNo = undefined;
				vm.oVoucher.narration = undefined;
				vm.oVoucher.paymentMode = undefined;
				vm.oVoucher.chequeDate = undefined;
				vm.oVoucher.paymentRef = undefined;
				vm.oVoucher._id = undefined;
				vm.oFilter.aVoucher = undefined;
				vm.aSecV = [];
			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

