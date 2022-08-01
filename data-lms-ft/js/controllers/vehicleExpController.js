materialAdmin
	.controller("vehicleExpController", vehicleExpController)
	.controller("upsertVehicleExpCtrl", upsertVehicleExpCtrl);

vehicleExpController.$inject = [
	'$modal',
	'$filter',
	'$scope',
	'accountingService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'stateDataRetain',
	'voucherService',
	'branchService'
];
upsertVehicleExpCtrl.$inject = [
	'$modal',
	'$scope',
	'$stateParams',
	'accountingService',
	'branchService',
	'billBookService',
	'billsService',
	'DatePicker',
	'growlService',
	'otherUtils',
	'voucherService',
	'Vehicle'
];


function vehicleExpController(
	$modal,
	$filter,
	$scope,
	accountingService,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	stateDataRetain,
	voucherService,
	branchService,
) {

	let vm = this;

	// functions Identifiers
	vm.addExpense = addExpense;
	vm.getExpenses = getExpenses;
	vm.accountMaster = accountMaster;
	vm.getAllBranch = getAllBranch;
	vm.deleteExpense = deleteExpense;
	$scope.onStateRefresh = function () {
		getExpenses();
	};

	// INIT functions
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
		vm.lazyLoad = lazyLoadFactory();
		vm.oFilter = {}; // initialize filter object
		vm.maxDate = new Date();
		vm.selectType = 'index';
		vm.aExpenses = [];

		vm.aSelectedExpenses = [];
		vm.oAccountMaster = {}; // initialize Account Master object
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
				'Purchase Bill No',
				"Pay Date",
				"Pay Ref",
				"Pay Mode",
				'Created By',
				'Created At',
				'last modified At',
				'last modified By',
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
				'header': 'Purchase Bill No',
				'bindingKeys': 'vehicleExp.purchaseBillNo',
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
	function addExpense(type = 'add') {
		if (type == 'add') {
			stateDataRetain.go('booking_manage.upsertVehicleExp', {
				data: {
					type
				}
			});
		} else if (type == 'edit' || type == 'view') {

			if (Array.isArray(vm.aSelectedExpenses)) {
				if (vm.aSelectedExpenses.length !== 1)
					return swal('Warning', 'Please Select Single Expense', 'warning');
			} else if (!vm.aSelectedExpenses._id)
				return swal('Warning', 'Please Select Single Expense', 'warning');

			let selectedExp = Array.isArray(vm.aSelectedExpenses) ? vm.aSelectedExpenses[0] : vm.aSelectedExpenses;
			if (!selectedExp.refNo)
				return swal('Warning', 'Expense refNo not found', 'warning');

			stateDataRetain.go('booking_manage.upsertVehicleExp', {
				data: {
					selectedExp,
					type
				}
			});
		}
	}

	// Get vehicle Expense from backend
	function getExpenses(isGetActive, deletedSearch) {

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();
		 oFilter.populatePurBill = true;

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

	function deleteExpense() {

		if (!vm.aSelectedExpenses)
			return swal('Error', 'Please Select a Expense', 'error');

		let selectedExp;

		swal({
				title: 'Are you sure you want to delete selected Vehicle Expense?',
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
					voucherService.deleteVehicleExp({
						_id: vm.aSelectedExpenses._id
					}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.message, 'success');
						vm.tableApi.refresh();
					}

					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
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

	function accountMaster(viewValue, aGroup) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {


				let req = {
					name: viewValue,
					no_of_docs: 15,
					sort: {
						name: 1
					}
				};
				if (aGroup)
					req.aGroup = aGroup;

				accountingService.getAccountMaster(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		} else
			return [];
	}

	function prepareFilterObject() {
		var filter = {vT : "Vehicle Expense", type: "Journal"};

		if (vm.oFilter.PlanVoucherId) {
			filter.PlanVoucherId = vm.oFilter.PlanVoucherId;
		}
		if (vm.oFilter.type) {
			filter.type = vm.oFilter.type;
		}
		if (vm.oFilter.from_date) {
			filter.from_date = moment(vm.oFilter.from_date, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if (vm.oFilter.to_date) {
			filter.to_date = moment(vm.oFilter.to_date, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.refNo) {
			filter.refNo = vm.oFilter.refNo;
		}
		if (vm.oFilter.purchaseBillNo) {
			filter['vehicleExp.purchaseBillNo'] = vm.oFilter.purchaseBillNo;
		}

		if (vm.oFilter.creditAcnt) {
			filter.ledger = [vm.oFilter.creditAcnt._id];
		}







		if (vm.oFilter.billNo) {
			filter.billNo = vm.oFilter.billNo;
		}
		if (vm.oFilter.name) {
			filter.name = vm.oFilter.name;
		}
		if (vm.oFilter.from) {
			filter.from = [vm.oFilter.from._id];
		}
		if (vm.oFilter.to) {
			filter.to = [vm.oFilter.to._id];
		}
		if (vm.oFilter.dateType) {
			filter.dateType = vm.oFilter.dateType;
		}
		if (vm.oFilter.branch) {
			filter.branch = vm.oFilter.branch._id;
		}

		filter.no_of_docs = 10;
		filter.skip = vm.lazyLoad.getCurrentPage();
		filter.sort = {'_id': -1};

		return filter;
	}
}

function upsertVehicleExpCtrl(
	$modal,
	$scope,
	$stateParams,
	accountingService,
	branchService,
	billBookService,
	billsService,
	DatePicker,
	growlService,
	otherUtils,
	voucherService,
	Vehicle
) {

	let vm = this;

	// functions Identifiers
	vm.submit = submit;
	vm.addItems = addItems;
	vm.addLabRep = addLabRep;
	vm.onItemSelect = onItemSelect;
	vm.getAccount = getAccount;


	// vm.onLedgerSelect = onLedgerSelect;
	vm.getAllBranch = getAllBranch;
	vm.onSelect = onSelect;
	vm.deleteItems = deleteItems;
	vm.deleteLabRep = deleteLabRep;
	vm.onRefSelect = onRefSelect;
	vm.getAllvehicle = getAllvehicle;
	vm.getPurchseBill = getPurchseBill;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;

	// INIT functions
	(function init() {
		vm.oExpense = {};// initialize voucher object
		vm.aExpense = [];// initialize voucher object
		vm.oFilter = {};// initialize voucher object
		vm.oItem = {};
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.oExpense = angular.copy($stateParams.data.data.selectedExp) || {};
			vm.mode = $stateParams.data.data.type.toLowerCase();
		}
		vm.dealAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
		vm.oExpense.vT = "Vehicle Expense";
		vm.oExpense.type= "Journal";

		vm.mode = vm.mode || 'add';
		if (vm.mode === 'add') {
			vm.oExpense.chequeDate = new Date();
			vm.oExpense.billDate = new Date();
		}
		if (vm.mode === 'edit') {
			    vm.aExpense = vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.items;
			    vm.aLabRep = vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.labRepItems || [];
			    vm.oExpense.billDate = vm.oExpense.date;

			    if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.gstType)
			    	vm.gstType = vm.oExpense.vehicleExp.gstType;

			    if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.purchaseBill) {
					vm.selectedPurBill =  vm.oExpense.vehicleExp.purchaseBill;
					vm.PurchseBillNo = vm.oExpense.vehicleExp.purchaseBillNo;
					vm.aMaterialList = [];
					if(vm.selectedPurBill.materialItems && vm.selectedPurBill.materialItems.length){
						vm.oItem.qty = vm.selectedPurBill.remMatQty;
						vm.maxQty = vm.selectedPurBill.remMatQty;
						vm.selectedPurBill.materialItems.forEach(obj=>{
							if(!(vm.aMaterialList.indexOf(obj.material) + 1))
							   vm.aMaterialList.push(obj.material);
						})
					}
				}
			if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.creditAcnt)
				vm.creditAcnt = {_id: vm.oExpense.vehicleExp.creditAcnt, name: vm.oExpense.vehicleExp.creditAcntName}

			if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.igstAcnt)
				vm.igstAcnt = {_id: vm.oExpense.vehicleExp.igstAcnt, name: vm.oExpense.vehicleExp.igstAcntName}

			if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.cgstAcnt)
				vm.cgstAcnt = {_id: vm.oExpense.vehicleExp.cgstAcnt, name: vm.oExpense.vehicleExp.cgstAcntName}

			if(vm.oExpense.vehicleExp && vm.oExpense.vehicleExp.sgstAcnt)
				vm.sgstAcnt = {_id: vm.oExpense.vehicleExp.sgstAcnt, name: vm.oExpense.vehicleExp.sgstAcntName}
			onSelect();
			calculateSummary();
		}

	})();

	// Actual Functions

	function getPurchseBill() {
		if (vm.PurchseBillNo) {
			vm.noPurBillFound = false;
			let req = {
				billNo: vm.PurchseBillNo,
				billType: {$ne: "Dues Bill"},
				multiBill: {$exists: false},
				plainVoucher: {$exists: true},
				no_of_docs: 30
			};

			billsService.purchaseBillGet(req, onSuccess, err => {
				console.log(err)
			});
		}

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data.length) {
				vm.selectedPurBill = response.data[0];
				vm.aMaterialList = [];

				if(vm.selectedPurBill.materialItems && vm.selectedPurBill.materialItems.length){
					vm.oItem.qty = vm.selectedPurBill.remMatQty;
					vm.maxQty = vm.selectedPurBill.remMatQty;
					vm.selectedPurBill.materialItems.forEach(obj=>{
						if(!(vm.aMaterialList.indexOf(obj.material) + 1))
							vm.aMaterialList.push(obj.material);
					})
				}
				} else {
				    vm.selectedPurBill = undefined
					vm.noPurBillFound = true;
				}
			}
	}

	function getAccount(name, group) {

		return new Promise(function (resolve, reject) {

			var oFilter = {
				all: true,
				no_of_docs: 10,
				isGroup: false
			}; // filter to send

			if (name)
				oFilter.name = name;
			if(group)
				oFilter.group = group;

			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				rejcet([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data.data);
			}
		});
	}

	function addItems() {
		if (!vm.oItem.name || !vm.oItem.qty || !vm.oItem.rate || !(vm.oItem.vehicle && vm.oItem.vehicle._id)) {
			swal('Error','preFill all mandatory fields','error');
			return;
		}
		if(vm.oItem.vehicle && vm.oItem.vehicle.ownershipType === 'Own' && !vm.oItem.vehicle.account)
			return swal('Error','Account not found for selected Vehicle','error');

		if(vm.oItem.vehicle && vm.oItem.vehicle.ownershipType === 'Associate' && !(vm.oItem.vehicle.vendor_id && vm.oItem.vehicle.vendor_id.account))
			return swal('Error','Vendor Account not found for selected Vehicle','error');

		let oPush = vm.oItem;

		if(vm.oItem.vehicle.ownershipType === 'Own') {
			oPush.accountName = vm.oItem.vehicle.account.name;
			oPush.account = vm.oItem.vehicle.account._id;
		}else if(vm.oItem.vehicle.ownershipType === 'Associate') {
			oPush.accountName = vm.oItem.vehicle.vendor_id.account.name;
			oPush.account = vm.oItem.vehicle.vendor_id.account._id;
		}
		oPush.vehicleNo = vm.oItem.vehicle.vehicle_reg_no;
		oPush.ownershipType = vm.oItem.vehicle.ownershipType;
		oPush.vehicle = vm.oItem.vehicle._id;

		vm.oItem.gstPercent = vm.oItem.gstPercent || 0;
		oPush.amount = vm.oItem.rate * vm.oItem.qty;

		let percent = vm.gstType === 'IGST' ? vm.oItem.gstPercent : (vm.oItem.gstPercent / 2);
		oPush.cGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
		oPush.sGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
		oPush.iGSTPercent = vm.gstType === 'IGST' ? percent : 0;

		oPush.cGST = oPush.amount * oPush.cGSTPercent / 100;
		oPush.sGST = oPush.amount * oPush.sGSTPercent / 100;
		oPush.iGST = oPush.amount * oPush.iGSTPercent / 100;

		oPush.amountWithTax = oPush.amount + oPush.cGST + oPush.sGST + oPush.iGST;

		vm.aExpense = vm.aExpense || [];
		vm.aExpense.push(oPush);
		vm.oItem = {};
		calculateSummary();
	}

	function onItemSelect($index, item) {
		vm.oItemIndex = $index;
		vm.oItemId = item._id;
	}

	function addLabRep() {
		if (!vm.oLabRep.type || !vm.oLabRep.qty || !vm.oLabRep.rate || !(vm.oLabRep.vehicle && vm.oLabRep.vehicle._id)) {
			swal('Error','preFill all mandatory fields','error');
			return;
		}

		if(vm.oLabRep.vehicle && vm.oLabRep.vehicle.ownershipType === 'Own' && !vm.oLabRep.vehicle.account)
			return swal('Error','Account not found for selected Vehicle','error');

		if(vm.oLabRep.vehicle && vm.oLabRep.vehicle.ownershipType === 'Associate' && !(vm.oLabRep.vehicle.vendor_id && vm.oItem.vehicle.vendor_id.account))
			return swal('Error','Vendor Account not found for selected Vehicle','error');


		let oPush = vm.oLabRep;

		if(vm.oLabRep.vehicle.ownershipType === 'Own') {
			oPush.accountName = vm.oLabRep.vehicle.account.name;
			oPush.account = vm.oLabRep.vehicle.account._id;
		}else if(vm.oLabRep.vehicle.ownershipType === 'Associate') {
			oPush.accountName = vm.oLabRep.vehicle.vendor_id.account.name;
			oPush.account = vm.oLabRep.vehicle.vendor_id.account._id;
		}
		oPush.vehicleNo = vm.oLabRep.vehicle.vehicle_reg_no;
		oPush.ownershipType = vm.oLabRep.vehicle.ownershipType;
		oPush.vehicle = vm.oLabRep.vehicle._id;

		vm.oLabRep.gstPercent = vm.oLabRep.gstPercent || 0;
		oPush.totalWithoutTax = vm.oLabRep.rate * vm.oLabRep.qty;

		let percent = vm.gstType === 'IGST' ? vm.oLabRep.gstPercent : (vm.oLabRep.gstPercent / 2);
		oPush.cGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
		oPush.sGSTPercent = vm.gstType === 'IGST' ? 0 : percent;
		oPush.iGSTPercent = vm.gstType === 'IGST' ? percent : 0;

		oPush.cGST = oPush.totalWithoutTax * oPush.cGSTPercent / 100;
		oPush.sGST = oPush.totalWithoutTax * oPush.sGSTPercent / 100;
		oPush.iGST = oPush.totalWithoutTax * oPush.iGSTPercent / 100;

		oPush.total = oPush.totalWithoutTax + oPush.cGST + oPush.sGST + oPush.iGST;

		vm.aLabRep.push(oPush);
		vm.oLabRep = {};
		calculateSummary();
	}

	function deleteItems() {
		if(typeof vm.oItemIndex !== 'number') return;
		vm.aExpense.splice(vm.oItemIndex, 1);
		calculateSummary();
	}

	function deleteLabRep() {
		if(typeof vm.olabrepIndex !== 'number') return;
		vm.aLabRep.splice(vm.olabrepIndex, 1);
		calculateSummary();
	}

	function calculateSummary() {

		vm.totalWithoutTax = 0;
		vm.totalWithTax = 0;
		vm.cGST = 0;
		vm.sGST = 0;
		vm.iGST = 0;

		vm.aExpense.forEach((item) => {
			vm.totalWithoutTax += (item.amount||0);
			vm.totalWithTax += (item.amountWithTax||0);
			vm.cGST += (item.cGST||0);
			vm.sGST += (item.sGST||0);
			vm.iGST += (item.iGST||0);
		});


		vm.aLabRep.forEach((lab) => {
			vm.totalWithoutTax += (lab.totalWithoutTax||0);
			vm.labourAmt += (lab.totalWithoutTax||0);
			vm.totalWithTax += (lab.total||0);
			vm.cGST += (lab.cGST||0);
			vm.sGST += (lab.sGST||0);
			vm.iGST += (lab.iGST||0);
		});
	}

	function getAllvehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let req = {
					vehicle_no: viewValue,
					ownershipType: ["Own", "Associate"],
					populate : ['vendor_id', 'vendor_id.account']
				};

				Vehicle.getAllVehicles(req, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
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

	function onSelect() {
		if (vm.oExpense.branch) {
		vm.billBookId = vm.oExpense.branch.refNoBook ? vm.oExpense.branch.refNoBook.map(o => o.ref) : '';
		}
	}

	function onRefSelect(item, model, label) {
		vm.selectedStationary = item;
	}

	function getRefNo(viewValue) {

		if (!vm.billBookId.length) {
			return;
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'Ref No',
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

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (backDate)
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oExpense.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
		}
	}


	// vehicle Expense submit
	function submit(formData) {
		if (formData.$valid) {

			if (!vm.aExpense.length) {
				return swal('Error', `add at least one item`, 'error');
			}

			if(!(vm.creditAcnt && vm.creditAcnt._id))
				return swal('Error', `Credit Account Required`, 'error');

			if(vm.iGST && !(vm.igstAcnt && vm.igstAcnt._id))
				return swal('Error', `IGST Account Required`, 'error');

			if(vm.cGST && !(vm.cgstAcnt && vm.cgstAcnt._id))
				return swal('Error', `CGST Account Required`, 'error');

			if(vm.sGST && !(vm.sgstAcnt && vm.sgstAcnt._id))
				return swal('Error', `SGST Account Required`, 'error');

			vm.totQty = 0;
			if(vm.aExpense.length){
				vm.aExpense.forEach(obj=>{
					vm.totQty += obj.qty;
				})
			}

			if(vm.maxQty && vm.totQty > vm.maxQty)
				return swal('Error', `Total Qty cannot greater than ${vm.maxQty}`, 'error');

			let aExpenses = angular.copy(vm.oExpense);

			let vehicleExp ={
				creditAcntName: vm.creditAcnt.name,
				creditAcnt: vm.creditAcnt._id,
				items: vm.aExpense,
				totQty: vm.totQty,
			}


			if(vm.totalWithoutTax)
				vehicleExp.totalWithoutTax = vm.totalWithoutTax;

			if(vm.totalWithTax)
				vehicleExp.totalWithTax = vm.totalWithTax;

			if(vm.labourAmt)
				vehicleExp.labourAmt = vm.labourAmt;

			if(vm.aLabRep && vm.aLabRep.length)
				vehicleExp.labRepItems = vm.aLabRep;

			if(vm.gstType)
				vehicleExp.gstType = vm.gstType;
			if(vm.iGST && vm.igstAcnt && vm.igstAcnt._id){
				vehicleExp.igstAcntName = vm.igstAcnt.name;
				vehicleExp.igstAcnt = vm.igstAcnt._id;
				vehicleExp.iGST = vm.iGST;
			}

			if(vm.cGST && vm.cgstAcnt && vm.cgstAcnt._id){
				vehicleExp.cgstAcntName = vm.cgstAcnt.name;
				vehicleExp.cgstAcnt = vm.cgstAcnt._id;
				vehicleExp.cGST = vm.cGST;
			}

			if(vm.sGST && vm.sgstAcnt && vm.sgstAcnt._id){
				vehicleExp.sgstAcntName = vm.sgstAcnt.name;
				vehicleExp.sgstAcnt = vm.sgstAcnt._id;
				vehicleExp.sGST = vm.sGST;
			}
			if(vm.selectedPurBill && vm.selectedPurBill._id){
				vehicleExp.purchaseBill = vm.selectedPurBill._id;
				vehicleExp.purchaseBillNo = vm.selectedPurBill.billNo;
			}


			aExpenses.vehicleExp = vehicleExp;
			aExpenses.branchName = vm.oExpense.branch.name;
			aExpenses.branch = vm.oExpense.branch._id;
			if (vm.selectedStationary || !aExpenses.stationaryId)
				aExpenses.stationaryId = (vm.selectedStationary && vm.selectedStationary.bookNo) === vm.oExpense.refNo ? vm.selectedStationary._id : undefined;
			if (aExpenses.billDate) {
				aExpenses.date = moment(vm.oExpense.billDate, 'DD/MM/YYYY').toISOString();
				aExpenses.chequeDate = moment(vm.oExpense.billDate, 'DD/MM/YYYY').toISOString();
			}

			vm.isdisabled = true;
			 if (vm.oExpense._id) {
				 aExpenses._id = vm.oExpense._id;
				voucherService.editVehicleExp(aExpenses, onSuccess, onFailure);
			} else {
				voucherService.addVehicleExp(aExpenses, onSuccess, onFailure);
			}


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
				vm.oExpense.refNo = undefined;
				vm.oExpense.narration = undefined;
				vm.oExpense.paymentMode = undefined;
				vm.oExpense.chequeDate = undefined;
				vm.oExpense.paymentRef = undefined;
				vm.oExpense._id = undefined;
				vm.aExpense = [];
			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}



