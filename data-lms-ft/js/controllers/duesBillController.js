materialAdmin
	.controller("duesBillController", duesBillController)
	.controller("duesBillUpsertController", duesBillUpsertController)

duesBillController.$inject = [
	'$modal',
	'$scope',
	'accountingService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'stateDataRetain',
	'billsService'
];
duesBillUpsertController.$inject = [
	'$stateParams',
	'accountingService',
	'billBookService',
	'billsService',
	'branchService',
	'DatePicker',
	'tripServices',
	'NumberUtil'
];

function duesBillController(
	$modal,
	$scope,
	accountingService,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	stateDataRetain,
	billsService,
) {

	let vm = this;
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object
	vm.maxDate = new Date();


	// functions Identifiers
	vm.upsertDuesBill = upsertDuesBill;
	vm.getDuesBill = getDuesBill;
	vm.approve = approve;
	vm.unapprove = unapprove;
	$scope.onStateRefresh = function () {
		getDuesBill();
	};

	// INIT functions
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.selectType = 'index';

		vm.columnSetting = {
			allowedColumn: [
				'Bill No',
				'Bill Date',
				'Bill Type',
				'Ref No',
				'Credit Ac',
				'Bill Amount',
				'Total Payments',
				'Paid Amount',
				'Remark',
				'Approved',
				'Created At',
			]
		};
		vm.tableHead = [
			{
				'header': 'Bill No',
				'bindingKeys': 'billNo',
				'date': false
			},
			{
				'header': 'Bill Date',
				'bindingKeys': 'billDate',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Bill Type',
				'bindingKeys': 'billType',
			},
			{
				'header': 'Ref No',
				'bindingKeys': 'refNo',
				'date': false
			},

			{
				'header': 'Credit Ac',
				'bindingKeys': 'account.name'
			},
			{
				'header': 'Bill Amount',
				'bindingKeys': 'billAmount.toFixed(2)'
			},
			{
				'header': 'Total Payments',
				'bindingKeys': 'totMaterial ? amount.toFixed(2) : totDues.toFixed(2)'
			},
			{
				'header': 'Remark',
				'bindingKeys': 'remark'
			},
			{
				'header': 'Approved',
				'bindingKeys': 'this.plainVoucher ? "Yes" : "No"',
				'eval': true
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			}
		];
	})();

	// Actual Functions
	function upsertDuesBill(type = 'add') {
		if (type == 'add') {
			stateDataRetain.go('accountManagment.duesBillUpsert', {
				data: {
					type
				}
			});
		} else if (type == 'edit') {

			if (Array.isArray(vm.aSelectedDuesBill)) {
				if (vm.aSelectedDuesBill.length !== 1)
					return swal('Warning', 'Please Select Single Dues', 'warning');
			} else if (!vm.aSelectedDuesBill._id)
				return swal('Warning', 'Please Select Single Dues', 'warning');

			let selectedDuesBill = Array.isArray(vm.aSelectedDuesBill) ? vm.aSelectedDuesBill[0] : vm.aSelectedDuesBill;

			stateDataRetain.go('accountManagment.duesBillUpsert', {
				data: {
					selectedDuesBill,
					type
				}
			});
		}
	}

	function prepareFilter() {
		var filter = {billType: 'Dues Bill'};

		if (vm.oFilter.from) {
			filter.from = moment(vm.oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if (vm.oFilter.to) {
			filter.to = moment(vm.oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.refNo) {
			filter.refNo = vm.oFilter.refNo;
		}
		if (vm.oFilter.billNo) {
			filter.billNo = vm.oFilter.billNo;
		}

		filter.skip = vm.lazyLoad.getCurrentPage();
		filter.no_of_docs = 20;


		return filter;
	}

	// Get Dues Bill from backend
	function getDuesBill(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();


		billsService.purchaseBillGet(oFilter, function (res) {
			if (res && res.data) {
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	function unapprove() {
		billsService.purchaseBillUnapprove({
			_id: vm.aSelectedDuesBill._id
		}, function (res) {
			swal('Success', res.message, 'success');
		});
	}

	function approve() {
		billsService.purchaseBillApprove({
			_id: vm.aSelectedDuesBill._id
		}, function (res) {
			swal('Success', res.message, 'success');
		});
	}


}

function duesBillUpsertController(
	$stateParams,
	accountingService,
	billBookService,
	billsService,
	branchService,
	DatePicker,
	tripServices,
	NumberUtil
) {

	let vm = this;

	// function identifier
	vm.getBranch = getBranch;
	vm.getRefNo = getRefNo;
	vm.onBranchSelect = onBranchSelect;
	vm.onRefSelect = onRefSelect;
	vm.delDuesItem = delDuesItem;
	vm.getAccount = getAccount;
	vm.addDues = addDues;
	vm.applyTax = applyTax;
	vm.applyTds = applyTds;
	vm.calculateDuesItems = calculateDuesItems;
	vm.submit = submit;

	// init
	(function init() {
        vm.isDisabled = false;
		vm.duesBillItems =  [];
		vm.DatePicker = angular.copy(DatePicker);

		vm.oDuesBill = {};// initialize dues object
		vm.oFilter = {};// initialize filter
		vm.mode = 'add';
		if ($stateParams.data) {
			vm.selectedDuesBill = $stateParams.data.data.selectedDuesBill;
			vm.mode = $stateParams.data.data.type.toLowerCase();
		}
		if (vm.mode == 'edit') {
			if (vm.selectedDuesBill) {
				vm.oDuesBill = vm.selectedDuesBill;
				vm.duesBillItems = vm.selectedDuesBill.duesBillItems;
				vm.dbItemDetails = vm.selectedDuesBill.dbItemDetails;
				vm.oDuesBill.billDate = new Date(vm.oDuesBill.billDate);
				vm.fitnessQty = vm.GTQty = vm.permitQty = vm.misQty = 0;
				vm.duesBillItems.forEach(obj=>{
					if(obj.duesType === 'Fitness Worksheet')
						vm.fitnessQty += 1;
					if(obj.duesType === 'Good and Token Tax')
						vm.GTQty += 1;
					if(obj.duesType === 'Permit')
						vm.permitQty += 1;
					if(obj.duesType === 'Miscellaneous')
						vm.misQty += 1;
				vm.dbItemDetails.forEach(obj2=>{
					if(obj._id === obj2.billId){
					obj.proCharge = obj2.proCharge;
					obj.applyGst = obj2.applyGst;
					obj.applyTds = obj2.applyTds;
					}
				});
			 });
			}
			if(vm.oDuesBill.iGST) {
				vm.oDuesBill.gstType = 'IGST';
				vm.oDuesBill.gstPercent = vm.oDuesBill.iGSTPercent;
			}

			if(vm.oDuesBill.cGST && vm.oDuesBill.sGST) {
				vm.oDuesBill.gstType = 'CGST & SGST';
				vm.oDuesBill.gstPercent = (vm.oDuesBill.cGSTPercent + vm.oDuesBill.sGSTPercent);
			}

			if(vm.oDuesBill.tdsAc) {
				vm.oDuesBill.tdsAc = {_id: vm.oDuesBill.tdsAc, name: vm.oDuesBill.tdsAcName};
			}
			if(vm.oDuesBill.branch && vm.oDuesBill.branch._id)
				vm.billBookId = vm.oDuesBill.branch.refNoBook ? vm.oDuesBill.branch.refNoBook.map(o => o.ref) : '';

		}else{
			vm.oDuesBill.billType = 'Dues Bill';
			vm.oDuesBill.itemsType = 'dues';
		}

	})();

	// Actual Function

	function delDuesItem(index) {
		if (!vm.duesBillItems.length) {
			swal('Error', 'No Bill Selected', 'error');
			return;
		}
		vm.duesBillItems.splice(index, 1);
		calculateDuesItems();
	}

	function calculateDuesItems() {
		vm.permitQty = 0;
		vm.fitnessQty = 0;
		vm.GTQty = 0;
		vm.misQty = 0;
		vm.amount = 0;
		vm.proCharge = 0;
		vm.proGstAmt = 0;
		vm.proTdsAmt = 0;
		vm.duesBillItems.forEach(obj=> {
               if(obj.duesType === 'Fitness Worksheet')
				   vm.fitnessQty += 1;
               if(obj.duesType === 'Good and Token Tax')
				   vm.GTQty += 1;
               if(obj.duesType === 'Permit')
				   vm.permitQty += 1;
               if(obj.duesType === 'Miscellaneous')
				   vm.misQty += 1;
               if(obj.amount)
               	vm.amount += obj.amount;
			   if(obj.proCharge)
				vm.proCharge += obj.proCharge;
               if(obj.applyGst)
				   vm.proGstAmt += obj.proCharge;
               if(obj.applyTds)
				   vm.proTdsAmt += obj.proCharge;

		});

		vm.oDuesBill.totalAmount = vm.oDuesBill.amount = vm.oDuesBill.totDues = ((vm.amount || 0) + (vm.proCharge || 0));
		vm.oDuesBill.totalAmount = Number(vm.oDuesBill.totalAmount.toFixed(2));
		vm.oDuesBill.billAmount = vm.oDuesBill.totalAmount;
		vm.oDuesBill.proCharge = vm.proCharge;

		if(!vm.oDuesBill.amount){
			vm.oDuesBill.cGST = 0;
			vm.oDuesBill.sGST = 0;
			vm.oDuesBill.iGST = 0;
		}
		applyTds();
		applyTax();
	}

	function applyTax(){
		if(!(vm.oDuesBill.gstType && vm.proGstAmt))
			return;

		    vm.oDuesBill.gstPercent = 18;

			let percent = vm.oDuesBill.gstType === 'IGST' ? Number(18) : (Number(18) / 2);
			vm.oDuesBill.cGSTPercent = vm.oDuesBill.gstType === 'IGST' ? 0 : percent;
			vm.oDuesBill.sGSTPercent = vm.oDuesBill.gstType === 'IGST' ? 0 : percent;
			vm.oDuesBill.iGSTPercent = vm.oDuesBill.gstType === 'IGST' ? percent : 0;

		vm.oDuesBill.cGST = (vm.proGstAmt * (vm.oDuesBill.cGSTPercent || 0) / 100);
		vm.oDuesBill.sGST = (vm.proGstAmt * (vm.oDuesBill.sGSTPercent || 0) / 100);
		vm.oDuesBill.iGST = (vm.proGstAmt * (vm.oDuesBill.iGSTPercent || 0) / 100);

		vm.oDuesBill.totalAmount = (vm.oDuesBill.amount + vm.oDuesBill.cGST + vm.oDuesBill.sGST + vm.oDuesBill.iGST - (vm.oDuesBill.tdsAmt || 0));
		vm.oDuesBill.totalAmount = Number(vm.oDuesBill.totalAmount.toFixed(2));
		vm.oDuesBill.billAmount = vm.oDuesBill.totalAmount;
	}

	function applyTds(){

		vm.oDuesBill.tdsAmt = Math.round((vm.proTdsAmt || 0) * (vm.oDuesBill.tdsRate||0)/100);
		vm.oDuesBill.totalAmount = (vm.oDuesBill.amount - (vm.oDuesBill.tdsAmt || 0));
		vm.oDuesBill.totalAmount = Number(vm.oDuesBill.totalAmount.toFixed(2));
		vm.oDuesBill.billAmount = vm.oDuesBill.totalAmount;
	}

	function addDues() {
		vm.oFilter = vm.oFilter || {};

		if (!(vm.oFilter.invoiceNo))
			return swal('Error', 'Invoice No. is required', 'error');

		let oFilter = {};

		if(vm.oFilter.refNo) {
			oFilter.refNo = vm.oFilter.refNo;
			oFilter.no_of_docs = 1;
		}else
			oFilter.no_of_docs = 500;
		if(vm.oFilter.invoiceNo)
			oFilter.invoiceNo = vm.oFilter.invoiceNo;

		if(vm.oFilter.from && vm.oFilter.to) {
			oFilter.frmdt = moment(vm.oFilter.from, "DD/MM/YYYY").toISOString();
			oFilter.todt = moment(vm.oFilter.to, "DD/MM/YYYY").toISOString();
		}

		oFilter['purchaseBill'] = {
				$exists: false
			};

		if (vm.duesBillItems.find(o => o.refNo === vm.oFilter.refNo))
			return swal('Warning', 'Dues Already Exist!!!', 'warning');

		accountingService.getDues(oFilter, function (response) {
			if (response && response.data && response.data.data && response.data.data.length) {
				response = response.data.data;
				vm.duesBillItems.push(...response.reduce((arr, obj) => {
					if(!vm.duesBillItems.find(o => o._id === obj._id)){
						obj.applyTds = true;
						obj.applyGst = true;
						arr.push(obj);
					}

					return arr;
				}, []));
				vm.duesBillItems.forEach(obj=>{
					if(obj.duesType ===  "Permit")
						obj.proCharge = 300;
					else if(obj.duesType ===  "Good and Token Tax")
						obj.proCharge = 150;
					else if(obj.duesType ===  "Fitness Worksheet")
						obj.proCharge = 50;
					else if(obj.duesType ===  "Miscellaneous")
						obj.proCharge = 50;
				})
				calculateDuesItems();
				vm.oFilter = {};
			} else
				swal('Warning', 'No Dues Found!!!', 'warning');
		});
	}

	function getAccount(name, group) {

		return new Promise(function (resolve, reject) {

			var oFilter = {
				all: true,
				no_of_docs: 10,
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

	function getBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					no_of_docs: 10,
					name : viewValue
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

	function getRefNo(viewValue, auto) {

		if (!vm.billBookId) {
			// swal('Error', `No ${vm.type} Book Linked to ${vm.oVoucher.branch.name} branch`, 'error');
			return;
		}

		if (!vm.oDuesBill.billDate) {
			swal('Error', 'Bill Date is Mandatory', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				billBookId: vm.billBookId,
				type: 'Ref No',
				useDate: vm.oDuesBill.billDate,
				status: 'unused'
			};

			if (viewValue)
				requestObj.bookNo = viewValue;

			if(auto)
				requestObj.auto = true;



			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (auto) {
					if (response.data[0]) {
						vm.selectedRefNo = response.data[0];
						resolve(response.data);
					}
				} else
					resolve(response.data);
			}

			function oFail(response) {
				console.log(response);
				reject([]);
			}
		});
	}

	function onBranchSelect(item) {
		vm.oDuesBill.refNo = '';

		vm.billBookId = item.refNoBook ? item.refNoBook.map(o => o.ref) : '';
	}

	function onRefSelect(item) {
		vm.selectedRefNo = item;
	}

	function prepareBillObj(){
		vm.oDuesBill.dbItemDetails = [];
		vm.duesBillItems.forEach(obj=>{
			vm.oDuesBill.dbItemDetails.push({proCharge: obj.proCharge, applyGst: obj.applyGst, applyTds: obj.applyTds, billId: obj._id})
		})
	}

	function submit(formData ,isAcknowledge = false) {

		if(formData.$valid) {


			// if (vm.from._id == vm.aAdvances[0].from_account._id)
			// 	return swal('Error', 'Credit A/c and Debit A/c cannot be same account', 'error');

			if (!vm.duesBillItems.length) {
				swal('Error', 'No Dues Selected', 'error');
				return;
			}

			if (isAcknowledge) {
				if (!vm.oDuesBill.refNo)
					return swal('Error', 'Ref No. is Mandatory', 'error');

			}

			if (vm.oDuesBill.adjAmount && !(vm.oDuesBill.adjDebitAc && vm.oDuesBill.adjDebitAc._id))
				return swal('Error', 'Adjustment A/c is Mandatory', 'error');


			vm.oDuesBill.duesBillItems = vm.duesBillItems;

			prepareBillObj();

			let request = {...vm.oDuesBill};

			request.account = request.account._id;
			request.branch = request.branch._id;

			if(request.adjDebitAc)
			request.adjDebitAc = request.adjDebitAc._id;

			if(request.tdsAc){
			request.tdsAcName = request.tdsAc.name;
			request.tdsAc = request.tdsAc._id;
			}


			if ((vm.selectedRefNo && vm.selectedRefNo.bookNo) === request.refNo)
				request.stationaryId = vm.selectedRefNo._id;
			else
				delete request.stationaryId;

			if (isAcknowledge)
				request.acknowledge = true;
			vm.isDisabled = true;
			if (vm.mode === 'add') {
				billsService.duesBillAdd(request, successCallback,failureCallback);
			} else {
				request._id = vm.oDuesBill._id;
				billsService.duesBillUpdate(request, successCallback,failureCallback);
			}
		}else{
			return swal('Error', 'Mandatory field Required', 'error');
		}
		function failureCallback(err) {
			vm.isDisabled = false;
			swal('Error', err.message, 'error');
			return;
		}
		function successCallback(response) {
			vm.isDisabled = false;
			swal('Success', response.message, 'success');
			return;
		}
	}
}
