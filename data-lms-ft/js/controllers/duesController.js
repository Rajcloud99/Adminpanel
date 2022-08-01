materialAdmin
	.controller("duesController", duesController)
	.controller("duesUpsertController", duesUpsertController)
	.controller("insuranceDuesController", insuranceDuesController)
	.controller("permitDuesController", permitDuesController)
	.controller("otherDuesController", otherDuesController)
	.controller("emiDuesController", emiDuesController)
	.controller("calibrationDuesController", calibrationDuesController)
	.service("commonDuesService", commonDuesService);

duesController.$inject = [
	'$modal',
	'$scope',
	'accountingService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'stateDataRetain',
	'voucherService',
	'branchService',
	'Vehicle'
];
duesUpsertController.$inject = [
	'$scope',
	'$stateParams',
	'commonDuesService'
];
insuranceDuesController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'commonDuesService',
	'branchService',
	'DatePicker',
	'narrationService',
	'voucherService',
	'Vehicle'
];
otherDuesController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'commonDuesService',
	'branchService',
	'billsService',
	'billBookService',
	'DatePicker',
	'narrationService',
	'voucherService',
	'Vehicle'
];
emiDuesController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'commonDuesService',
	'branchService',
	'billsService',
	'billBookService',
	'DatePicker',
	'narrationService',
	'voucherService',
	'Vehicle'
];
calibrationDuesController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'commonDuesService',
	'branchService',
	'billsService',
	'billBookService',
	'DatePicker',
	'narrationService',
	'voucherService',
	'Vehicle'
];
permitDuesController.$inject = [
	'$scope',
	'$stateParams',
	'accountingService',
	'commonDuesService',
	'branchService',
	'billsService',
	'DatePicker',
	'narrationService',
	'voucherService',
	'Vehicle'
];
commonDuesService.$inject = [];

function duesController(
	$modal,
	$scope,
	accountingService,
	DatePicker,
	lazyLoadFactory,
	tripServices,
	stateDataRetain,
	voucherService,
	branchService,
	Vehicle
) {

	let vm = this;
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object
	vm.maxDate = new Date();


	// functions Identifiers
	vm.upsertDues = upsertDues;
	vm.deleteDues = deleteDues;
	vm.getAllVehicle = getAllVehicle;
	vm.getDues = getDues;
	vm.downloadDues = downloadDues;
	vm.downloadDuesSmry = downloadDuesSmry;
	vm.downloadInsurance = downloadInsurance;
	vm.accountMaster = accountMaster;
	vm.getAllBranch = getAllBranch;
	$scope.onStateRefresh = function () {
		getDues();
	};

	// INIT functions
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		// vm.oFilter.to_date = new Date();
		// vm.oFilter.from_date = new Date(new Date().setDate(new Date(vm.oFilter.to_date).getDate() - 7));

		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.selectType = 'index';
		vm.aVouchers = [];
		vm.aSelectedVouchers = [];
		vm.dateType = [
			{
				key: "Dues Entry",
				value: "created_at"
			}
		];
		vm.columnSetting = {
			allowedColumn: [
				'Dues Type',
				'Vehicle No',
				'Ref No',
				'Date',
				'CREDIT AC',
				'DEBIT AC',
				'Amount',
				// 'Narration',
				'Policy No',
				'Invoice No',
				'Cheque No',
				'Created By',
				'Created At'
			]
		};
		vm.tableHead = [
			{
				'header': 'Dues Type',
				'bindingKeys': 'duesType'
			},
			{
				'header': 'Vehicle No',
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'aVehCollection',
						'"veh_no"',
					]
				}
			},
			{
				'header': 'Ref No',
				'bindingKeys': 'refNo',
				'date': false
			},
			{
				'header': 'Date',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'CREDIT AC',
				'bindingKeys': 'from_account.name'
			},
			{
				'header': 'DEBIT AC',
				'bindingKeys': 'to_account.name'
			},
			{
				'header': 'Amount',
				'bindingKeys': 'amount'
			},
			// {
			// 	'header': 'Narration',
			// 	'bindingKeys': 'rmk',
			// 	'date': false
			// },
			{
				'header': 'Policy No',
				'filter': {
					'name': 'arrayOfString',
					'aParam': [
						'aVehCollection',
						'"plcyNo"',
					]
				}
			},
			{
				'header': 'Invoice No',
				'bindingKeys': 'invoiceNo',
				date: false
			},
			{
				'header': 'Cheque No',
				'bindingKeys': 'chqueno',
				date: false
			},
			{
				'header': 'Created By',
				'bindingKeys': 'created_by.full_name'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			}

		];
	})();

	// Actual Functions
	function upsertDues(type = 'add') {
		if (type == 'add') {
			stateDataRetain.go('accountManagment.duesUpsert', {
				data: {
					type
				}
			});
		} else if (type == 'edit') {

			if (Array.isArray(vm.aSelectedDues)) {
				if (vm.aSelectedDues.length !== 1)
					return swal('Warning', 'Please Select Single Dues', 'warning');
			} else if (!vm.aSelectedDues._id)
				return swal('Warning', 'Please Select Single Dues', 'warning');

			let selectedDues = Array.isArray(vm.aSelectedDues) ? vm.aSelectedDues[0] : vm.aSelectedDues;

			stateDataRetain.go('accountManagment.duesUpsert', {
				data: {
					selectedDues,
					type
				}
			});
		}
	}


	function prepareFilterObject(download) {
		var filter = {};
		if (vm.oFilter.from) {
			filter.from = moment(vm.oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if (vm.oFilter.to) {
			filter.to = moment(vm.oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.asOnDate) {
			filter.asOnDate = moment(vm.oFilter.asOnDate, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.refNo) {
			filter.refNo = vm.oFilter.refNo;
		}
		if (vm.oFilter.invoiceNo) {
			filter.invoiceNo = vm.oFilter.invoiceNo;
		}
		if (vm.oFilter.chqueno) {
			filter.chqueno = vm.oFilter.chqueno;
		}
		if (vm.oFilter.duesType && vm.oFilter.duesType.length) {
			filter.duesType = vm.oFilter.duesType;
		}

		if(vm.oFilter.reportType) {
			filter.reportType = vm.oFilter.reportType;
		}

		if(vm.oFilter.dateType) {
			filter.dateType = vm.oFilter.dateType;
		}

		if (vm.oFilter.vehicle) {
			filter.veh = vm.oFilter.vehicle._id;
		}
		if (vm.oFilter.ledger) {
			filter.account = vm.oFilter.ledger._id;
		}

		if (download) {
			filter.download = true;
			filter.no_of_docs = 10000;
		} else {
			filter.skip = vm.lazyLoad.getCurrentPage();
			filter.no_of_docs = 30;
		}


		return filter;
	}

	// Get Dues from backend
	function getDues(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();

		accountingService.getDues(oFilter, onSuccess, err => {
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

	function downloadDuesSmry () {
		if(!vm.oFilter.from || !vm.oFilter.to || !vm.oFilter.asOnDate) {
			return swal('warning',"All From,To and As on date should be Filled",'warning');
		}
		if(moment(vm.oFilter.from).isAfter(vm.oFilter.to)) {
			return swal('warning',"To date should be same or after from date",'warning');
		}
		if(moment(vm.oFilter.to).isAfter(vm.oFilter.asOnDate)) {
			return swal('warning',"As on date should be same or after to date",'warning');
		}
		var oFilter = prepareFilterObject();
		delete oFilter.no_of_docs;
		delete oFilter.skip;
		accountingService.duesSmryReport(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if(!response.url) {
				return swal('Success','No data Found','success');
			}
			var a = document.createElement('a');
			a.href = response.url;
			a.download = response.url;
			a.target = '_blank';
			a.click();
			return;	
		}


		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', response.data.massage, 'error');
		}

	}
	function downloadDues(download) {

		if (!vm.oFilter.invoiceNo && !(vm.oFilter.from && vm.oFilter.to)) {
			return swal('warning', "Both From and To Date should be Filled", 'warning');
		}
		if (!vm.oFilter.reportType) {
			return swal('warning', "select Report Type", 'warning');
		}

		var oFilter = prepareFilterObject(download);

		if(oFilter.reportType === 'Other'){
			if(!oFilter.duesType)
				oFilter.duesType = {$nin: ["Insurance", "Permit"]};
		}else if(oFilter.reportType === 'Permit'){
			oFilter.duesType = ['Permit'];
		}else if(oFilter.reportType === 'Insurance'){
			oFilter.duesType = ['Insurance'];
		}

		accountingService.getDues(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (download) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}
		}


		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', response.data.massage, 'error');
		}
	}

	function downloadInsurance(download) {

		if (!(vm.oFilter.from && vm.oFilter.to)) {
			return swal('warning', "Both From and To Date should be Filled", 'warning');
		}

		var oFilter = prepareFilterObject(download);
		oFilter.type = 'Insurance';
		oFilter.duesType = ['Insurance'];
		accountingService.getDues(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (download) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}
		}


		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', response.data.massage, 'error');
		}
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

	function accountMaster(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {
				accountingService.getAccountMaster({
					name: viewValue,
					no_of_docs: 6,
					sort: {
						name: 1
					}
				}, res => {
					resolve(res.data.data)
				}, err => {
					console.log`${err}`;
					reject([])
				});
			});
		} else
			return [];
	}

	function deleteDues() {

		if (vm.aSelectedDues.voucher && vm.aSelectedDues.voucher.acImp.st) {
			swal('Warning', 'Dues Cannot Be Deleted. Voucher Imported to A/c', 'warning');
			return;
		}

		swal({
				title: 'Are you sure you want to delete this Dues?',
				// text: '1. GST Not Registerd',
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
					accountingService.deleteDues({
						_id: vm.aSelectedDues._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						getDues();
					}
				}
			});
		return;
	}

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true}
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

}

function duesUpsertController(
	$scope,
	$stateParams,
	commonDuesService
) {

	let vm = this;

	vm.onTypeSelect = onTypeSelect;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter
		vm.aDuesType = ['Fitness Worksheet', 'Good and Token Tax', 'Sale Deed', 'Insurance', 'Permit', 'EMI', 'Calibration', 'Miscellaneous', 'PUC'];
		if ($stateParams.data) {
			vm.selectedDues = $stateParams.data.data.selectedDues;
			vm.mode = $stateParams.data.data.type.toLowerCase();
		}
		if (vm.mode == 'edit') {
			if (vm.selectedDues) {
				vm.oDues = vm.selectedDues;
			}
		}else{
			onTypeSelect(vm.aDuesType[0]);
		}

		$scope.$on('$destroy', function(){
			commonDuesService.put('type', undefined);
		});
	})();

	// Actual Function
	function onTypeSelect(type) {
		vm.oDues.duesType = type;
		commonDuesService.put('type', type);
	}
}

function otherDuesController(
	$scope,
	$stateParams,
	accountingService,
	commonDuesService,
	branchService,
	billsService,
	billBookService,
	DatePicker,
	narrationService,
	voucherService,
	Vehicle
) {

	let vm = this;

	vm.submit = submit;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getAllVehicle = getAllVehicle;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.addVehicle = addVehicle;
	vm.deleteVehicle = deleteVehicle;
	vm.onSelect = onSelect;
	vm.onAcSelect = onAcSelect;
	vm.onVehSelect = onVehSelect;
	vm.getFitnessDues = getFitnessDues;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter'
		vm.selectedDues = {};
		vm.oDues.aVehCollection = [];
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if($stateParams.data.data.selectedDues){
				vm.selectedDues = angular.copy($stateParams.data.data.selectedDues);
				commonDuesService.put('type', vm.selectedDues.duesType);
			}
		}
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};
		vm.clientAccount = vm.clientAccount.dues || {};
		vm.mode = vm.mode || 'add';
		if (vm.mode == 'add')
			vm.oDues.date = new Date();
		if (vm.mode == 'edit') {
			prepareData();
			if(vm.oDues.iGSTAccount)
				vm.oDues.iGSTAccount = {_id:vm.oDues.iGSTAccount, name:vm.oDues.iGSTAccountName};
			if(vm.oDues.cGSTAccount)
				vm.oDues.cGSTAccount = {_id:vm.oDues.cGSTAccount, name:vm.oDues.cGSTAccountName};
			if(vm.oDues.sGSTAccount)
				vm.oDues.sGSTAccount = {_id:vm.oDues.sGSTAccount, name:vm.oDues.sGSTAccountName};
			if(vm.oDues.tdsAccount)
				vm.oDues.tdsAccount = {_id:vm.oDues.tdsAccount, name:vm.oDues.tdsAccountName};
			if(vm.oDues.iGST)
				vm.oDues.gstType = 'IGST';
			if(vm.oDues.cGST && vm.oDues.sGST)
				vm.oDues.gstType = 'CGST & SGST';
		}

		// otherDuesController
		commonDuesService.onChange('type', function (val) {
			vm.oDues.duesType = val;
			vm.amtLeble = undefined;
			if(val === 'Fitness Worksheet' || val ===  'Miscellaneous')
				vm.amtLeble = 'Inspection Fee'
		});

	})();

	// Actual Functions
	function prepareData() {
		if (vm.selectedDues) {
			vm.oDues = vm.selectedDues;
			if (vm.oDues.branch_name)
				vm.oDues.branch = {_id: vm.oDues.branch, name: vm.oDues.branch_name};
			vm.amt = vm.oDues.amount - (vm.oDues.iGST || (vm.oDues.cGST + vm.oDues.sGST) || 0) + (vm.oDues.tdsAmt || 0);
			calculateSummary();
		}
	}

	vm.maxDate = function (frimDate) {
		vm.max = moment(frimDate, 'DD/MM/YYYY').toISOString();
		if (vm.oDues.duesType === 'Fitness Worksheet') {
			vm.month = Number(24);
		} else {
			vm.month = Number(14);
		}
	};

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true},
					deleted: false,
					ownershipType: ["Own", "Associate"]
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

	function getAutoStationaryNo() {

		if (vm.oDues.branch) {
			vm.billBookId = vm.oDues.branch.refNoBook ? vm.oDues.branch.refNoBook.map(o => o.ref) : '';
		} else {
			vm.billBookId = undefined;
		}

		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			status: "unused"
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oDues.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
		}
	}

	function prepareRefFilter() {

		if (!vm.filter.refNo)
			return;

		accountingService.getDues(vm.filter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.selectedDues = response.data[0];
				vm.mode = 'edit';
				prepareData()
			}
		}
	}

	function addVehicle(index) {
		if (!vm.oVehicle.veh || !vm.oVehicle.frmdt || !vm.oVehicle.todt || !vm.oVehicle.amount) {
			swal('Error', 'Select all Mandatory fields', 'error');
			return;
		}
		if(!vm.oVehicle.veh.owner_name)
			return	swal('Error', 'Selected Vehicle Owner not found', 'error');

		if(vm.tdsRate)
			vm.oVehicle.tdsRate = vm.tdsRate;

		if (vm.oVehicle.tds && !vm.oVehicle.tdsRate)
			return swal('Error', 'Selecte TDS rate', 'error');

		vm.oVehicle.proCharge = (vm.oVehicle.proCharge || 0);
		vm.oVehicle.amount = (vm.oVehicle.amount || 0);
		vm.oVehicle.othrexp = (vm.oVehicle.othrexp || 0);

		let oPush = vm.oVehicle;

		if(vm.oDues.gstType) {
			let percent = vm.oDues.gstType === 'IGST' ? Number(18) : (Number(18) / 2);
			oPush.cGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.sGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.iGSTPercent = vm.oDues.gstType === 'IGST' ? percent : 0;
		}

		oPush.cGST = Math.round(oPush.proCharge * (oPush.cGSTPercent || 0) / 100);
		oPush.sGST = Math.round(oPush.proCharge * (oPush.sGSTPercent || 0) / 100);
		oPush.iGST = Math.round(oPush.proCharge * (oPush.iGSTPercent || 0) / 100);

		oPush.total = (oPush.proCharge + oPush.amount + oPush.othrexp + oPush.cGST + oPush.sGST + oPush.iGST);
		oPush.tds = vm.oVehicle.tds ? true : false;

		if (oPush.veh) {
			oPush.veh_no = oPush.veh.vehicle_reg_no;
			oPush.vehModel = oPush.veh.model;
			oPush.vehOwnerName = oPush.veh.owner_name;
			oPush.veh = oPush.veh._id;
		}
		if (oPush.frmdt && oPush.todt){
			oPush.frmdt = moment(oPush.frmdt, 'DD/MM/YYYY').toISOString();
			oPush.todt = moment(oPush.todt, 'DD/MM/YYYY').toISOString();
		}

		if(vm.oDues.txtyp === 'NL TAX')
			preparePayload(oPush);

		if(index != undefined) {
			vm.oDues.aVehCollection[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		}else {
			vm.oDues.aVehCollection.push(oPush);
		}

		vm.oVehicle = {frmdt:vm.oVehicle.frmdt,todt:vm.oVehicle.todt, amount:vm.oVehicle.amount};
		calculateSummary();
	}

	function deleteVehicle() {
		if(typeof vm.selectedIndex !== 'number') return;
		vm.oDues.aVehCollection.splice(vm.selectedIndex, 1);
		vm.oVehicle = {};
		calculateSummary();
	}

	function onSelect($index, veh) {
		if($scope.$role['Dues']['Update Policy']) {
			vm.selectedIndex = $index;
			vm.selectrdId = veh._id;
			vm.oVehicle = angular.copy(veh);
			vm.vehNo = vm.oVehicle.veh_no;
			vm.flag = true;
			vm.oVehicle.veh = {
				_id: vm.oVehicle.veh,
				vehicle_reg_no: vm.oVehicle.veh_no,
				model: vm.oVehicle.vehModel,
				owner_name: vm.oVehicle.vehOwnerName
			};
		}
	}

	function onAcSelect(item) {
		vm.PanNo = item.pan_no;
		vm.tdsApply = item.tdsApply;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		if(item.tdsSources && item.tdsCategory && item.tdsApply)
			getTDSRate();
		else
			vm.showTDSRate = true;

	}

	function onVehSelect(item) {
	 if(item.ownershipType === 'Associate'){
		 swal({
				 title: 'This is Associated Vehicle Do You want to Process?',
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
				 if (!isConfirm) {
					 vm.oVehicle.veh = null;
					 $scope.$apply()
				 }
			 });

	 }
	}

	// function isProcess(item) {
	// 	vm.oVehicle.veh = item;
	//
	//
	// }

	function getTDSRate() {
		if(vm.tdsApply && vm.tdsCategory && vm.tdsSources && vm.oDues.date){
			let oReq = {
				date: moment(vm.oDues.date, 'DD/MM/YYYY').toISOString(),
				cClientId: $scope.selectedClient,
			};

			vm.DuesDate = moment(vm.oDues.date, 'DD/MM/YYYY').toISOString();

			let isGetTDS = true;
			if(vm.oDues.from_account && vm.oDues.from_account.exeRate && vm.oDues.from_account.exeFrom && vm.oDues.from_account.exeTo){
				if(new Date(vm.DuesDate) >= new Date(vm.oDues.from_account.exeFrom) && new Date(vm.DuesDate) <= new Date(vm.oDues.from_account.exeTo)) {
					vm.tdsRate = vm.oDues.from_account.exeRate;
					isGetTDS = false;
				}
			}
			if(isGetTDS)
			billsService.getTDSRate(oReq, onSuccess, onFailure);

			function onSuccess(res) {
				vm.showTDSRate = false;
				if(res.data && res.data.data && res.data.data.length){
					vm.allTDSRate = res.data.data[0];
						vm.allTDSRate.aRate.forEach(obj => {
							if (obj.sources === vm.tdsSources) {
								switch (vm.tdsCategory) {
									case 'Individuals or HUF': {
										if (vm.PanNo)
											return vm.tdsRate = obj.ipRate;
										else
											return vm.tdsRate = obj.iwpRate;
									}
									case 'Non Individual/corporate': {
										if (vm.PanNo)
											return vm.tdsRate = obj.nipRate;
										else
											return vm.tdsRate = obj.niwpRate;
									}
									default:
										return vm.tdsRate = 0;
								}
							}
						});
				}
			}
			function onFailure(err) {
				vm.allTDSRate = {};
			}
		}

		if(!vm.tdsRate){
			vm.showTDSRate = true;
		}
	}

	function calculateSummary() {
		vm.oDues.tdsAmt = 0;

		vm.oDues.totalWithoutTax = 0;
		vm.oDues.proTotalWithoutTax = 0;
		vm.oDues.totalOthrexp = 0;
		vm.oDues.totalWithTax = 0;
		vm.oDues.cGST = 0;
		vm.oDues.sGST = 0;
		vm.oDues.iGST = 0;
		vm.oDues.prepaidAmt = 0;

		vm.oDues.aVehCollection.forEach((veh) => {
			vm.oDues.totalWithoutTax += (veh.amount || 0);
			vm.oDues.proTotalWithoutTax += (veh.proCharge || 0);
			vm.oDues.totalOthrexp += (veh.othrexp || 0);
			vm.oDues.totalWithTax += (veh.total || 0);
			vm.oDues.cGST += (veh.cGST || 0);
			vm.oDues.sGST += (veh.sGST || 0);
			vm.oDues.iGST += (veh.iGST || 0);
			vm.oDues.prepaidAmt += (veh.prepaidAmt || 0);
			vm.oDues.tdsAmt += (veh.tds ? Math.round((veh.proCharge) * (veh.tdsRate||0)/100) : 0);
		});
		vm.oDues.amount = (vm.oDues.totalWithTax - vm.oDues.tdsAmt);
		vm.oDues.proCharge = (vm.oDues.proTotalWithoutTax);
		vm.oDues.othrexp = (vm.oDues.totalOthrexp);
	}

	function calDays(fromDate, toDate) {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);
		fromDate.setHours(0, 0, 0);
		toDate.setHours(23, 59, 59);

		let day = 1000 * 60 * 60 * 24;
		let totday = (toDate - fromDate) / day;
		return Math.ceil(totday);

	}

	function dateCal(from, to) {
		from = new Date(from);
		to = new Date(to);
		let totYearDiff = new Date(to).getFullYear() - new Date(from).getFullYear();
		let finYearDate = new Date();
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if (totYearDiff === 0) {
			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;
		} else {
			if(from >= finYearDate)
				finYearDate.setFullYear(finYearDate.getFullYear() + 1);

			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;

		}
	}

	function getFitnessDues(vehicle) {

		if (!vehicle || !vehicle._id)
			return;


		var oFilter = {
			veh : vehicle._id,
			duesType: ["Fitness Worksheet"],
		};

		accountingService.getDues(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data && response.data.data.length && response.data.data[0].aVehCollection && response.data.data[0].aVehCollection.length) {
				response = response.data.data[0].aVehCollection[0];
				vm.oVehicle.amount = response.amount;
				vm.oVehicle.frmdt = response.frmdt;
				vm.oVehicle.todt = response.todt;
			}
		}
	}

	function preparePayload(payloadData) {
		if (!payloadData.frmdt || !payloadData.todt)
			return swal('Error', `From and To date required`, 'error');

		dateCal(payloadData.frmdt, payloadData.todt);

		if (vm.isFinancialYear) {
			vm.totalDays = calDays(payloadData.frmdt, payloadData.todt);
			vm.days = calDays(payloadData.frmdt, vm.financialYearDate);
			payloadData.prepaidAmt = 0;
			let sum = (payloadData.proCharge || 0) + (payloadData.amount || 0) + (payloadData.othrexp || 0);
			payloadData.postpaidAmt = Math.abs((sum / vm.totalDays) * vm.days);
			payloadData.prepaidAmt = (sum - payloadData.postpaidAmt);

		}
	}

	function GetFormattedDate(date) {
		var todayDate = new Date(date);
		var month = todayDate.getMonth() + 1;
		var day = todayDate.getDate();
		var year = todayDate.getFullYear();
		return day + "-" + month + "-" + year;
	}

	vm.setToDate = function(frimDate){
		if(vm.oDues.duesType === 'Fitness Worksheet' || vm.oDues.duesType === 'Miscellaneous') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 24));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}else if(vm.oDues.txtyp === 'HR TAX') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 3));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		} else{
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 12));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}
	};

	function preserveData() {
		let oFilter = {
			duesType:vm.oDues.duesType,
			branch:vm.oDues.branch,
			from_account:vm.oDues.from_account,
			to_account:vm.oDues.to_account,
			date:vm.oDues.date,
			txtyp:vm.oDues.txtyp,
			plcnm:vm.oDues.plcnm,
			rmk:vm.oDues.rmk,
			invoiceNo:vm.oDues.invoiceNo,
			// gstType:vm.oDues.gstType,
		};
		// if(vm.oDues.gstType === 'IGST')
		// 	oFilter.iGSTAccount = vm.oDues.iGSTAccount;
		// if(vm.oDues.gstType === 'CGST & SGST') {
		// 	oFilter.cGSTAccount = vm.oDues.cGSTAccount;
		// 	oFilter.sGSTAccount = vm.oDues.sGSTAccount;
		// }
		oFilter.aVehCollection = [];
		vm.oDues = oFilter;

	}

	// Dues submit
	function submit(formData) {
		if (formData.$valid) {

			let aDuess = angular.copy(vm.oDues);

			if (aDuess.amount > vm.maxAmount) {
				return swal('Error', `Limit Out Of Bound amount should be less then  ${vm.maxAmount}`, 'error');
			}
			if(aDuess.cGST && !aDuess.cGSTAccount)
				return swal('Error', "CGST Account required", 'error');
			if(aDuess.sGST && !aDuess.sGSTAccount)
				return swal('Error', "SGST Account required", 'error');
			if(aDuess.iGST && !aDuess.iGSTAccount)
				return swal('Error', "IGST Account required", 'error');
			if(aDuess.tdsAmt && !aDuess.tdsAccount)
				return swal('Error', "TDS Account required", 'error');
			else if(!aDuess.tdsAmt)
				aDuess.tdsAccount = undefined;
			if (aDuess.prepaidAmt && !vm.clientAccount.insPre)
				return swal('Error', `prepaid account required`, 'error');


			if (aDuess.branch) {
				aDuess.branch_name = aDuess.branch.name;
				aDuess.branch = aDuess.branch._id || aDuess.branch;
			}

			if (aDuess.from_account) {
				aDuess.fromAcName = aDuess.from_account.ledger_name || aDuess.from_account.name;
				aDuess.from_account = aDuess.from_account._id;
			}

			if (aDuess.to_account) {
				aDuess.toAcName = aDuess.to_account.ledger_name || aDuess.to_account.name;
				aDuess.to_account = aDuess.to_account._id;
			}
			if (aDuess.cGSTAccount && aDuess.cGSTAccount._id) {
				aDuess.cGSTAccountName = aDuess.cGSTAccount.ledger_name || aDuess.cGSTAccount.name;
				aDuess.cGSTAccount = aDuess.cGSTAccount._id;
			}
			if (aDuess.sGSTAccount && aDuess.sGSTAccount._id) {
				aDuess.sGSTAccountName = aDuess.sGSTAccount.ledger_name || aDuess.sGSTAccount.name;
				aDuess.sGSTAccount = aDuess.sGSTAccount._id;
			}
			if (aDuess.iGSTAccount && aDuess.iGSTAccount._id) {
				aDuess.iGSTAccountName = aDuess.iGSTAccount.ledger_name || aDuess.iGSTAccount.name;
				aDuess.iGSTAccount = aDuess.iGSTAccount._id;
			}
			if (aDuess.tdsAccount && aDuess.tdsAccount._id) {
				aDuess.tdsAccountName = aDuess.tdsAccount.ledger_name || aDuess.tdsAccount.name;
				aDuess.tdsAccount = aDuess.tdsAccount._id;
			}
			if (aDuess.prepaidAmt) {
				aDuess.prepaidAccName = vm.clientAccount.insPre.name;
				aDuess.prepaidAcc = vm.clientAccount.insPre._id;
			}

			if (aDuess.date)
				aDuess.date = moment(aDuess.date, 'DD/MM/YYYY').toISOString();

			aDuess.narration = narrationService({
				vehicleNo: aDuess.aVehCollection[0].veh_no,
				from: GetFormattedDate(aDuess.aVehCollection[0].frmdt),
				to: GetFormattedDate(aDuess.aVehCollection[0].todt)
			});

			aDuess.amt = ((aDuess.totalWithoutTax + aDuess.proTotalWithoutTax + aDuess.totalOthrexp) - (aDuess.prepaidAmt || 0));

			vm.isdisabled = true;
			if (aDuess._id) {
				accountingService.updateDues(aDuess, onSuccess, onFailure);
			} else {
				accountingService.addDues(aDuess, onSuccess, onFailure);
			}


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				vm.isdisabled = false;
				swal('Success', response.message, 'success');
				if (vm.dataPreserve && !aDuess._id) {
					preserveData();
				}else{
					vm.oDues = {duesType:vm.oDues.duesType};
					vm.oDues.aVehCollection = [];
				}

			}
		} else {
			vm.isdisabled = false;
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

function permitDuesController(
	$scope,
	$stateParams,
	accountingService,
	commonDuesService,
	branchService,
	billsService,
	DatePicker,
	narrationService,
	voucherService,
	Vehicle
) {

	let vm = this;

	vm.submit = submit;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getAllVehicle = getAllVehicle;
	vm.onVehSelect = onVehSelect;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.addVehicle = addVehicle;
	vm.deleteVehicle = deleteVehicle;
	vm.onSelect = onSelect;
	vm.onAcSelect = onAcSelect;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter'
		vm.selectedDues = {};
		vm.oDues.aVehCollection = [];
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if($stateParams.data.data.selectedDues){
				vm.selectedDues = angular.copy($stateParams.data.data.selectedDues);
				commonDuesService.put('type', vm.selectedDues.duesType);
			}
		}
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};
		vm.clientAccount = vm.clientAccount.dues || {};
		vm.mode = vm.mode || 'add';
		if (vm.mode == 'add')
			vm.oDues.date = new Date();
		if (vm.mode == 'edit') {
			prepareData();
			if(vm.oDues.iGSTAccount)
				vm.oDues.iGSTAccount = {_id:vm.oDues.iGSTAccount, name:vm.oDues.iGSTAccountName};
			if(vm.oDues.cGSTAccount)
				vm.oDues.cGSTAccount = {_id:vm.oDues.cGSTAccount, name:vm.oDues.cGSTAccountName};
			if(vm.oDues.sGSTAccount)
				vm.oDues.sGSTAccount = {_id:vm.oDues.sGSTAccount, name:vm.oDues.sGSTAccountName};
			if(vm.oDues.tdsAccount)
				vm.oDues.tdsAccount = {_id:vm.oDues.tdsAccount, name:vm.oDues.tdsAccountName};
			if(vm.oDues.iGST)
				vm.oDues.gstType = 'IGST';
			if(vm.oDues.cGST && vm.oDues.sGST)
				vm.oDues.gstType = 'CGST & SGST';
		}

		// otherDuesController
		commonDuesService.onChange('type', function (val) {
			vm.oDues.duesType = val;
		});

	})();

	// Actual Functions
	function prepareData() {
		if (vm.selectedDues) {
			vm.oDues = vm.selectedDues;
			if (vm.oDues.branch_name)
				vm.oDues.branch = {_id: vm.oDues.branch, name: vm.oDues.branch_name};
			calculateSummary();
		}
	}

	vm.maxDate = function (frimDate) {
		vm.max = moment(frimDate, 'DD/MM/YYYY').toISOString();
	};

	function preserveData() {
		let oFilter = {
			duesType:vm.oDues.duesType,
			branch:vm.oDues.branch,
			from_account:vm.oDues.from_account,
			to_account:vm.oDues.to_account,
			date:vm.oDues.date,
			insType:vm.oDues.insType,
			rmk:vm.oDues.rmk,
			invoiceNo:vm.oDues.invoiceNo,
			// gstType:vm.oDues.gstType,
		};
		// if(vm.oDues.gstType === 'IGST')
		// 	oFilter.iGSTAccount = vm.oDues.iGSTAccount;
		// if(vm.oDues.gstType === 'CGST & SGST') {
		// 	oFilter.cGSTAccount = vm.oDues.cGSTAccount;
		// 	oFilter.sGSTAccount = vm.oDues.sGSTAccount;
		// }
		oFilter.aVehCollection = [];
		vm.oDues = oFilter;

	}

	vm.setToDate = function(frimDate){
		vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
		vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 12));
		vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
	};


	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true},
					deleted: false,
					ownershipType: ["Own", "Associate"]
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

	function prepareRefFilter() {

		if (!vm.filter.refNo)
			return;

		accountingService.getDues(vm.filter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.selectedDues = response.data[0];
				vm.mode = 'edit';
				prepareData()
			}
		}
	}

	function addVehicle(index) {
		if (!vm.oVehicle.veh || !vm.oVehicle.frmdt || !vm.oVehicle.todt || !vm.oVehicle.amount) {
			swal('Error', 'Select all Mandatory fields', 'error');
			return;
		}

		if(!vm.oVehicle.veh.owner_name)
			return	swal('Error', 'Selected Vehicle Owner not found', 'error');

		if(vm.tdsRate)
			vm.oVehicle.tdsRate = vm.tdsRate;

		if (vm.oVehicle.tds && !vm.oVehicle.tdsRate)
			return swal('Error', 'Selecte TDS rate', 'error');

		if(!vm.oDues.insType)
			return swal('Error', 'Selecte Permit Policy', 'error');

		vm.oVehicle.proCharge = (vm.oVehicle.proCharge || 0);
		vm.oVehicle.amount = (vm.oVehicle.amount || 0);
		vm.oVehicle.othrexp = (vm.oVehicle.othrexp || 0);

		let oPush = vm.oVehicle;

		if(vm.oDues.gstType) {
			let percent = vm.oDues.gstType === 'IGST' ? Number(18) : (Number(18) / 2);
			oPush.cGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.sGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.iGSTPercent = vm.oDues.gstType === 'IGST' ? percent : 0;
		}

		oPush.cGST = Math.round(oPush.proCharge * (oPush.cGSTPercent || 0) / 100);
		oPush.sGST = Math.round(oPush.proCharge * (oPush.sGSTPercent || 0) / 100);
		oPush.iGST = Math.round(oPush.proCharge * (oPush.iGSTPercent || 0) / 100);

		oPush.total = (oPush.proCharge + oPush.amount + oPush.othrexp + oPush.cGST + oPush.sGST + oPush.iGST);
		oPush.tds = vm.oVehicle.tds ? true : false;

		if (oPush.veh) {
			oPush.veh_no = oPush.veh.vehicle_reg_no;
			oPush.vehModel = oPush.veh.model;
			oPush.vehOwnerName = oPush.veh.owner_name;
			oPush.veh = oPush.veh._id;
		}
		if (oPush.frmdt && oPush.todt){
			oPush.frmdt = moment(oPush.frmdt, 'DD/MM/YYYY').toISOString();
		    oPush.todt = moment(oPush.todt, 'DD/MM/YYYY').toISOString();
	    }

		if(vm.oDues.insType === 'Renewal')
		preparePayload(oPush);

        if(index != undefined) {
			vm.oDues.aVehCollection[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		}else {
			vm.oDues.aVehCollection.push(oPush);
		}

		vm.oVehicle = {othrexp:vm.oVehicle.othrexp, amount: vm.oVehicle.amount};
		calculateSummary();
	}

	function deleteVehicle() {
		if(typeof vm.selectedIndex !== 'number') return;
		vm.oDues.aVehCollection.splice(vm.selectedIndex, 1);
		vm.oVehicle = {};
		calculateSummary();
	}

	function onSelect($index, veh) {
		if($scope.$role['Dues']['Update Policy']) {
			vm.selectedIndex = $index;
			vm.selectrdId = veh._id;
			vm.oVehicle = angular.copy(veh);
			vm.vehNo = vm.oVehicle.veh_no;
			vm.flag = true;
			vm.oVehicle.veh = {
				_id: vm.oVehicle.veh,
				vehicle_reg_no: vm.oVehicle.veh_no,
				model: vm.oVehicle.vehModel,
				owner_name: vm.oVehicle.vehOwnerName
			};
		}
	}

	function onAcSelect(item) {
		vm.PanNo = item.pan_no;
		vm.tdsApply = item.tdsApply;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		if(item.tdsSources && item.tdsCategory && item.tdsApply)
			getTDSRate();
		else
			vm.showTDSRate = true;

	}

	function getTDSRate() {
		if(vm.tdsApply && vm.tdsCategory && vm.tdsSources && vm.oDues.date){
			let oReq = {
				date: moment(vm.oDues.date, 'DD/MM/YYYY').toISOString(),
				cClientId: $scope.selectedClient,
			};
			vm.DuesDate = moment(vm.oDues.date, 'DD/MM/YYYY').toISOString();

			let isGetTDS = true;
			if(vm.oDues.from_account && vm.oDues.from_account.exeRate && vm.oDues.from_account.exeFrom && vm.oDues.from_account.exeTo){
				if(new Date(vm.DuesDate) >= new Date(vm.oDues.from_account.exeFrom) && new Date(vm.DuesDate) <= new Date(vm.oDues.from_account.exeTo)) {
					vm.tdsRate = vm.oDues.from_account.exeRate;
					isGetTDS = false;
				}
			}
			if(isGetTDS)
			billsService.getTDSRate(oReq, onSuccess, onFailure);

			function onSuccess(res) {
				vm.showTDSRate = false;
				if(res.data && res.data.data && res.data.data.length) {
					vm.allTDSRate = res.data.data[0];
					if (vm.allTDSRate.tdsRate) {
						vm.tdsRate = vm.allTDSRate.tdsRate;
					} else {
						vm.allTDSRate.aRate.forEach(obj => {
							if (obj.sources === vm.tdsSources) {
								switch (vm.tdsCategory) {
									case 'Individuals or HUF': {
										if (vm.PanNo)
											return vm.tdsRate = obj.ipRate;
										else
											return vm.tdsRate = obj.iwpRate;
									}
									case 'Non Individual/corporate': {
										if (vm.PanNo)
											return vm.tdsRate = obj.nipRate;
										else
											return vm.tdsRate = obj.niwpRate;
									}
									default:
										return vm.tdsRate = 0;
								}
							}
						});
					}
				}
			}
			function onFailure(err) {
				vm.allTDSRate = {};
			}
		}

		if(!vm.tdsRate){
			vm.showTDSRate = true;
		}
	}

	function calculateSummary() {
		vm.oDues.tdsAmt = 0;

		vm.oDues.totalWithoutTax = 0;
		vm.oDues.proTotalWithoutTax = 0;
		vm.oDues.totalOthrexp = 0;
		vm.oDues.totalWithTax = 0;
		vm.oDues.cGST = 0;
		vm.oDues.sGST = 0;
		vm.oDues.iGST = 0;
		vm.oDues.prepaidAmt = 0;

		vm.oDues.aVehCollection.forEach((veh) => {
			vm.oDues.totalWithoutTax += (veh.amount || 0);
			vm.oDues.proTotalWithoutTax += (veh.proCharge || 0);
			vm.oDues.totalOthrexp += (veh.othrexp || 0);
			vm.oDues.totalWithTax += (veh.total || 0);
			vm.oDues.cGST += (veh.cGST || 0);
			vm.oDues.sGST += (veh.sGST || 0);
			vm.oDues.iGST += (veh.iGST || 0);
			vm.oDues.prepaidAmt += (veh.prepaidAmt || 0);
			vm.oDues.tdsAmt += (veh.tds ? Math.round((veh.proCharge) * (veh.tdsRate||0)/100) : 0);
		});
		vm.oDues.amount = (vm.oDues.totalWithTax - vm.oDues.tdsAmt);
		vm.oDues.proCharge = (vm.oDues.proTotalWithoutTax);
		vm.oDues.othrexp = (vm.oDues.totalOthrexp);
	}

	function onVehSelect(item) {
		if(item.ownershipType === 'Associate'){
			swal({
					title: 'This is Associated Vehicle Do You want to Process?',
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
					if (!isConfirm) {
						vm.oVehicle.veh = null;
						$scope.$apply()
					}
				});

		}
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

	function calDays(fromDate, toDate) {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);
		fromDate.setHours(0, 0, 0);
		toDate.setHours(23, 59, 59);

		let day = 1000 * 60 * 60 * 24;
		let totday = (toDate - fromDate) / day;
		return Math.ceil(totday);

	}

	function dateCal(from, to) {
		from = new Date(from);
		to = new Date(to);
		let totYearDiff = new Date(to).getFullYear() - new Date(from).getFullYear();
		let finYearDate = new Date();
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if (totYearDiff === 0) {
			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;
		} else {
			if(from >= finYearDate)
			finYearDate.setFullYear(finYearDate.getFullYear() + 1);

			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;

		}
	}

	function preparePayload(payloadData) {
		if (!payloadData.frmdt || !payloadData.todt)
			return swal('Error', `From and To date required`, 'error');

		// if (payloadData.frmdt)
		// 	payloadData.frmdt = moment(payloadData.frmdt, 'DD/MM/YYYY').toISOString();
		//
		// if (payloadData.todt)
		// 	payloadData.todt = moment(payloadData.todt, 'DD/MM/YYYY').toISOString();

		dateCal(payloadData.frmdt, payloadData.todt);

		if (vm.isFinancialYear) {
			vm.totalDays = calDays(payloadData.frmdt, payloadData.todt);
			vm.days = calDays(payloadData.frmdt, vm.financialYearDate);
			payloadData.prepaidAmt = 0;
			let sum = (payloadData.proCharge || 0) + (payloadData.amount || 0) + (payloadData.othrexp || 0);
			payloadData.postpaidAmt = Math.abs((sum / vm.totalDays) * vm.days);
			payloadData.prepaidAmt = (sum - payloadData.postpaidAmt);

		}
	}

	function GetFormattedDate(date) {
		var todayDate = new Date(date);
		var month = todayDate.getMonth() + 1;
		var day = todayDate.getDate();
		var year = todayDate.getFullYear();
		return day + "-" + month + "-" + year;
	}

	// Dues submit
	function submit(formData) {
		if (formData.$valid) {

			let aDuess = angular.copy(vm.oDues);

			if (aDuess.amount > vm.maxAmount) {
				return swal('Error', `Limit Out Of Bound amount should be less then  ${vm.maxAmount}`, 'error');
			}
			if(aDuess.cGST && !aDuess.cGSTAccount)
				return swal('Error', "CGST Account required", 'error');
			if(aDuess.sGST && !aDuess.sGSTAccount)
				return swal('Error', "SGST Account required", 'error');
			if(aDuess.iGST && !aDuess.iGSTAccount)
				return swal('Error', "IGST Account required", 'error');
			if(aDuess.tdsAmt && !aDuess.tdsAccount)
				return swal('Error', "TDS Account required", 'error');
			else if(!aDuess.tdsAmt)
				aDuess.tdsAccount = undefined;

			if (aDuess.prepaidAmt && !vm.clientAccount.insPre)
				return swal('Error', `prepaid account required`, 'error');

			if (aDuess.branch) {
				aDuess.branch_name = aDuess.branch.name;
				aDuess.branch = aDuess.branch._id || aDuess.branch;
			}

			if (aDuess.from_account) {
				aDuess.fromAcName = aDuess.from_account.ledger_name || aDuess.from_account.name;
				aDuess.from_account = aDuess.from_account._id;
			}

			if (aDuess.to_account) {
				aDuess.toAcName = aDuess.to_account.ledger_name || aDuess.to_account.name;
				aDuess.to_account = aDuess.to_account._id;
			}
			if (aDuess.cGSTAccount && aDuess.cGSTAccount._id) {
				aDuess.cGSTAccountName = aDuess.cGSTAccount.ledger_name || aDuess.cGSTAccount.name;
				aDuess.cGSTAccount = aDuess.cGSTAccount._id;
			}
			if (aDuess.sGSTAccount && aDuess.sGSTAccount._id) {
				aDuess.sGSTAccountName = aDuess.sGSTAccount.ledger_name || aDuess.sGSTAccount.name;
				aDuess.sGSTAccount = aDuess.sGSTAccount._id;
			}
			if (aDuess.iGSTAccount && aDuess.iGSTAccount._id) {
				aDuess.iGSTAccountName = aDuess.iGSTAccount.ledger_name || aDuess.iGSTAccount.name;
				aDuess.iGSTAccount = aDuess.iGSTAccount._id;
			}
			if (aDuess.tdsAccount && aDuess.tdsAccount._id) {
				aDuess.tdsAccountName = aDuess.tdsAccount.ledger_name || aDuess.tdsAccount.name;
				aDuess.tdsAccount = aDuess.tdsAccount._id;
			}
			if (aDuess.prepaidAmt) {
				aDuess.prepaidAccName = vm.clientAccount.insPre.name;
				aDuess.prepaidAcc = vm.clientAccount.insPre._id;
			}

			aDuess.narration = narrationService({
				vehicleNo: aDuess.aVehCollection[0].veh_no,
				from: GetFormattedDate(aDuess.aVehCollection[0].frmdt),
				to: GetFormattedDate(aDuess.aVehCollection[0].todt),
				permitNo: aDuess.aVehCollection[0].permitNo,
			});

			if (aDuess.date)
				aDuess.date = moment(aDuess.date, 'DD/MM/YYYY').toISOString();

			aDuess.amt = ((aDuess.totalWithoutTax + aDuess.proTotalWithoutTax + aDuess.totalOthrexp) - (aDuess.prepaidAmt || 0));

			vm.isdisabled = true;
			if (aDuess._id) {
				accountingService.updateDues(aDuess, onSuccess, onFailure);
			} else {
				accountingService.addDues(aDuess, onSuccess, onFailure);
			}


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				vm.isdisabled = false;
				swal('Success', response.message, 'success');
				if (vm.dataPreserve && !aDuess._id) {
					preserveData();
				}else{
					vm.oDues = {duesType:vm.oDues.duesType};
					vm.oDues.aVehCollection = [];
				}
			}
		} else {
			vm.isdisabled = false;
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

function insuranceDuesController(
	$scope,
	$stateParams,
	accountingService,
	commonDuesService,
	branchService,
	DatePicker,
	narrationService,
	voucherService,
	Vehicle
) {

	let vm = this;

	vm.submit = submit;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getAllVehicle = getAllVehicle;
	vm.onVehSelect = onVehSelect;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.addVehicle = addVehicle;
	vm.deleteVehicle = deleteVehicle;
	vm.onSelect = onSelect;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter'
		vm.selectedDues = {};
		vm.oDues.aVehCollection = [];
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if($stateParams.data.data.selectedDues){
				vm.selectedDues = angular.copy($stateParams.data.data.selectedDues);
				commonDuesService.put('type', vm.selectedDues.duesType);
			}
		}
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};
		vm.clientAccount = vm.clientAccount.dues || {};
		vm.mode = vm.mode || 'add';
		if (vm.mode == 'add')
			vm.oDues.date = new Date();
		if (vm.mode == 'edit') {
			prepareData();
			if(vm.oDues.iGSTAccount)
				vm.oDues.iGSTAccount = {_id:vm.oDues.iGSTAccount, name:vm.oDues.iGSTAccountName};
			if(vm.oDues.cGSTAccount)
				vm.oDues.cGSTAccount = {_id:vm.oDues.cGSTAccount, name:vm.oDues.cGSTAccountName};
			if(vm.oDues.sGSTAccount)
				vm.oDues.sGSTAccount = {_id:vm.oDues.sGSTAccount, name:vm.oDues.sGSTAccountName};
			if(vm.oDues.iGST)
				vm.oDues.gstType = 'IGST';
			if(vm.oDues.cGST && vm.oDues.sGST)
				vm.oDues.gstType = 'CGST & SGST';
		}

		// otherDuesController
		commonDuesService.onChange('type', function (val) {
			vm.oDues.duesType = val;
		});

	})();

	// Actual Functions
	function prepareData() {
		if (vm.selectedDues) {
			vm.oDues = vm.selectedDues;
			if (vm.oDues.branch_name)
				vm.oDues.branch = {_id: vm.oDues.branch, name: vm.oDues.branch_name};
			calculateSummary();
		}
	}

	vm.maxDate = function (frimDate) {
		vm.max = moment(frimDate, 'DD/MM/YYYY').toISOString();
	};
	vm.setToDate = function(frimDate){
		vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
		vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 12));
		vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
	};

	vm.setCategory = function (type) {

		if (type === 'New')
			vm.oDues.insCtgry = 'Capex';
		if (type === 'Renewal')
			vm.oDues.insCtgry = 'Opex';
	};

	function preserveData() {
		let oFilter = {
			duesType:vm.oDues.duesType,
			branch:vm.oDues.branch,
			from_account:vm.oDues.from_account,
			to_account:vm.oDues.to_account,
			date:vm.oDues.date,
			insType:vm.oDues.insType,
			insBroker:vm.oDues.insBroker,
			insCompany:vm.oDues.insCompany,
			chqueno:vm.oDues.chqueno,
			gstType:vm.oDues.gstType,
			rmk:vm.oDues.rmk,
		};
		if(vm.oDues.gstType === 'IGST')
			oFilter.iGSTAccount = vm.oDues.iGSTAccount;
		if(vm.oDues.gstType === 'CGST & SGST') {
			oFilter.cGSTAccount = vm.oDues.cGSTAccount;
			oFilter.sGSTAccount = vm.oDues.sGSTAccount;
		}
		oFilter.aVehCollection = [];
		vm.oDues = oFilter;

	}

	function onVehSelect(item) {
		if(item.ownershipType === 'Associate'){
			swal({
					title: 'This is Associated Vehicle Do You want to Process?',
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
					if (!isConfirm) {
						vm.oVehicle.veh = null;
						$scope.$apply()
					}
				});

		}
	}


	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true},
					deleted: false,
					ownershipType: ["Own", "Associate"]
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

	function prepareRefFilter() {

		if (!vm.filter.refNo)
			return;

		accountingService.getDues(vm.filter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.selectedDues = response.data[0];
				vm.mode = 'edit';
				prepareData()
			}
		}
	}

	function addVehicle(index) {
		if (!vm.oVehicle.veh || !vm.oVehicle.frmdt || !vm.oVehicle.todt) {
			swal('Error', 'Select all Mandatory fields', 'error');
			return;
		}
		if(!vm.oVehicle.veh.owner_name)
			return	swal('Error', 'Selected Vehicle Owner not found', 'error');


		vm.oVehicle.tpAmount = (vm.oVehicle.tpAmount) || 0;
		vm.oVehicle.amount = (vm.oVehicle.amount) || 0;
		let oPush = vm.oVehicle;

		if(vm.oDues.gstType && oPush.amount) {
			let percent = vm.oDues.gstType === 'IGST' ? Number(18) : (Number(18) / 2);
			oPush.cGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.sGSTPercent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.iGSTPercent = vm.oDues.gstType === 'IGST' ? percent : 0;
		}

		if(vm.oDues.gstType && oPush.tpAmount) {
			let percent = vm.oDues.gstType === 'IGST' ? Number(12) : (Number(12) / 2);
			oPush.tPcGSTpCent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.tPsGSTpCent = vm.oDues.gstType === 'IGST' ? 0 : percent;
			oPush.tPiGSTpCent = vm.oDues.gstType === 'IGST' ? percent : 0;
		}

		oPush.cGST = Math.round(oPush.amount * (oPush.cGSTPercent || 0) / 100);
		oPush.sGST = Math.round(oPush.amount * (oPush.sGSTPercent || 0) / 100);
		oPush.iGST = Math.round(oPush.amount * (oPush.iGSTPercent || 0) / 100);


		oPush.tPcGST = Math.round(oPush.tpAmount * (oPush.tPcGSTpCent || 0) / 100);
		oPush.tPsGST = Math.round(oPush.tpAmount * (oPush.tPsGSTpCent || 0) / 100);
		oPush.tPiGST = Math.round(oPush.tpAmount * (oPush.tPiGSTpCent || 0) / 100);

		oPush.total = (oPush.amount + oPush.tpAmount + oPush.cGST + oPush.sGST + oPush.iGST + oPush.tPcGST + oPush.tPsGST + oPush.tPiGST);

		if (oPush.veh) {
			oPush.veh_no = oPush.veh.vehicle_reg_no;
			oPush.vehModel = oPush.veh.model;
			oPush.vehOwnerName = oPush.veh.owner_name;
			oPush.veh = oPush.veh._id;
		}
		if (oPush.frmdt && oPush.todt){
			oPush.frmdt = moment(oPush.frmdt, 'DD/MM/YYYY').toISOString();
		    oPush.todt = moment(oPush.todt, 'DD/MM/YYYY').toISOString();
	    }

		if(vm.oDues.insType === 'Renewal')
		preparePayload(oPush);

        if(index != undefined) {
			vm.oDues.aVehCollection[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		}else {
			vm.oDues.aVehCollection.push(oPush);
		}

		vm.oVehicle = {};
		calculateSummary();
	}

	function deleteVehicle() {
		if(typeof vm.selectedIndex !== 'number') return;
		vm.oDues.aVehCollection.splice(vm.selectedIndex, 1);
		vm.oVehicle = {};
		calculateSummary();
	}

	function onSelect($index, veh) {
		if($scope.$role['Dues']['Update Policy']) {
			vm.selectedIndex = $index;
			vm.selectrdId = veh._id;
			vm.oVehicle = angular.copy(veh);
			vm.flag = true;
			vm.oVehicle.veh = {
				_id: vm.oVehicle.veh,
				vehicle_reg_no: vm.oVehicle.veh_no,
				model: vm.oVehicle.vehModel,
				owner_name: vm.oVehicle.vehOwnerName
			};
		}
	}

	function calculateSummary() {

		vm.oDues.totalWithoutTax = 0;
		vm.oDues.tpTotalWithoutTax = 0;
		vm.oDues.totalWithTax = 0;
		vm.oDues.cGST = 0;
		vm.oDues.sGST = 0;
		vm.oDues.iGST = 0;
		vm.totCGST = 0;
		vm.totSGST = 0;
		vm.totIGST = 0;
		vm.totTpCGST = 0;
		vm.totTpSGST = 0;
		vm.totTpIGST = 0;
		vm.oDues.prepaidAmt = 0;

		vm.oDues.aVehCollection.forEach((veh) => {
			vm.oDues.totalWithoutTax += (veh.amount || 0);
			vm.oDues.tpTotalWithoutTax +=  (veh.tpAmount || 0);
			vm.oDues.totalWithTax += (veh.total || 0);
			vm.oDues.cGST += (veh.cGST || 0) + (veh.tPcGST || 0);
			vm.oDues.sGST += (veh.sGST || 0) + (veh.tPsGST || 0);
			vm.oDues.iGST += (veh.iGST || 0) + (veh.tPiGST || 0);

			vm.totCGST += (veh.cGST || 0);
			vm.totSGST += (veh.sGST || 0);
			vm.totIGST += (veh.iGST || 0);

			vm.totTpCGST += (veh.tPcGST || 0);
			vm.totTpSGST += (veh.tPsGST || 0);
			vm.totTpIGST += (veh.tPiGST || 0);
			vm.oDues.prepaidAmt += (veh.prepaidAmt || 0);
		});
		vm.oDues.amount = (vm.oDues.totalWithTax);
		vm.oDues.tpAmount = (vm.oDues.tpTotalWithoutTax);
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

	function calDays(fromDate, toDate) {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);
		fromDate.setHours(0, 0, 0);
		toDate.setHours(23, 59, 59);

		let day = 1000 * 60 * 60 * 24;
		let totday = (toDate - fromDate) / day;
		return Math.ceil(totday);

	}

	function dateCal(from, to) {
		from = new Date(from);
		to = new Date(to);
		let totYearDiff = new Date(to).getFullYear() - new Date(from).getFullYear();
		let finYearDate = new Date();
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if (totYearDiff === 0) {
			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;
		} else {
			if(from >= finYearDate)
			finYearDate.setFullYear(finYearDate.getFullYear() + 1);

			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;

		}
	}

	function preparePayload(payloadData) {
		if (!payloadData.frmdt || !payloadData.todt)
			return swal('Error', `From and To date required`, 'error');

		dateCal(payloadData.frmdt, payloadData.todt);

		if (vm.isFinancialYear) {
			vm.totalDays = calDays(payloadData.frmdt, payloadData.todt);
			vm.days = calDays(payloadData.frmdt, vm.financialYearDate);
			payloadData.prepaidAmt = 0;
			let sum = (payloadData.tpAmount || 0) + (payloadData.amount || 0);
			payloadData.postpaidAmt = Math.abs((sum / vm.totalDays) * vm.days);
			payloadData.prepaidAmt = (sum - payloadData.postpaidAmt);

		}
	}

	function GetFormattedDate(date) {
		var todayDate = new Date(date);
		var month = todayDate.getMonth() + 1;
		var day = todayDate.getDate();
		var year = todayDate.getFullYear();
		return day + "-" + month + "-" + year;
	}


	// Dues submit
	function submit(formData) {
		if (formData.$valid) {

			let aDuess = angular.copy(vm.oDues);

			if (aDuess.amount > vm.maxAmount) {
				return swal('Error', `Limit Out Of Bound amount should be less then  ${vm.maxAmount}`, 'error');
			}
			if(aDuess.cGST && !aDuess.cGSTAccount)
				return swal('Error', "CGST Account required", 'error');
			if(aDuess.sGST && !aDuess.sGSTAccount)
				return swal('Error', "SGST Account required", 'error');
			if(aDuess.iGST && !aDuess.iGSTAccount)
				return swal('Error', "IGST Account required", 'error');
			if(aDuess.tPcGST && !aDuess.tPcGSTAcc)
				return swal('Error', "3P CGST Account required", 'error');
			if(aDuess.tPsGST && !aDuess.tPsGSTAcc)
				return swal('Error', "3P SGST Account required", 'error');
			if(aDuess.tPiGST && !aDuess.tPiGSTAcc)
				return swal('Error', "3P IGST Account required", 'error');
			if (aDuess.prepaidAmt && !vm.clientAccount.insPre)
				return swal('Error', `prepaid account required`, 'error');

			if (aDuess.branch) {
				aDuess.branch_name = aDuess.branch.name;
				aDuess.branch = aDuess.branch._id || aDuess.branch;
			}

			if (aDuess.from_account) {
				aDuess.fromAcName = aDuess.from_account.ledger_name || aDuess.from_account.name;
				aDuess.from_account = aDuess.from_account._id;
			}

			if (aDuess.to_account) {
				aDuess.toAcName = aDuess.to_account.ledger_name || aDuess.to_account.name;
				aDuess.to_account = aDuess.to_account._id;
			}
			if (aDuess.cGSTAccount && aDuess.cGSTAccount._id) {
				aDuess.cGSTAccountName = aDuess.cGSTAccount.ledger_name || aDuess.cGSTAccount.name;
				aDuess.cGSTAccount = aDuess.cGSTAccount._id;
			}
			if (aDuess.sGSTAccount && aDuess.sGSTAccount._id) {
				aDuess.sGSTAccountName = aDuess.sGSTAccount.ledger_name || aDuess.sGSTAccount.name;
				aDuess.sGSTAccount = aDuess.sGSTAccount._id;
			}
			if (aDuess.iGSTAccount && aDuess.iGSTAccount._id) {
				aDuess.iGSTAccountName = aDuess.iGSTAccount.ledger_name || aDuess.iGSTAccount.name;
				aDuess.iGSTAccount = aDuess.iGSTAccount._id;
			}
			if (aDuess.tPiGSTAcc && aDuess.tPiGSTAcc._id) {
				aDuess.tPiGSTAccName = aDuess.tPiGSTAcc.ledger_name || aDuess.tPiGSTAcc .name;
				aDuess.tPiGSTAcc = aDuess.tPiGSTAcc._id;
			}

			if (aDuess.tPcGSTAcc && aDuess.tPcGSTAcc._id) {
				aDuess.tPcGSTAccName = aDuess.tPcGSTAcc.ledger_name || aDuess.tPcGSTAcc .name;
				aDuess.tPcGSTAcc = aDuess.tPcGSTAcc._id;
			}
			if (aDuess.tPsGSTAcc && aDuess.tPsGSTAcc._id) {
				aDuess.tPsGSTAccName = aDuess.tPsGSTAcc.ledger_name || aDuess.tPsGSTAcc .name;
				aDuess.tPsGSTAcc = aDuess.tPsGSTAcc._id;
			}
			if (aDuess.prepaidAmt) {
				aDuess.prepaidAccName = vm.clientAccount.insPre.name;
				aDuess.prepaidAcc = vm.clientAccount.insPre._id;
			}

			if (aDuess.date)
				aDuess.date = moment(aDuess.date, 'DD/MM/YYYY').toISOString();


				aDuess.narration = narrationService({
				vehicleNo: aDuess.aVehCollection[0].veh_no,
				from: GetFormattedDate(aDuess.aVehCollection[0].frmdt),
				to: GetFormattedDate(aDuess.aVehCollection[0].todt),
				plcyNo: aDuess.aVehCollection[0].plcyNo,


			});

			aDuess.amt = ((aDuess.totalWithoutTax + aDuess.tpTotalWithoutTax)- aDuess.prepaidAmt);

			vm.isdisabled = true;
			if (aDuess._id) {
				accountingService.updateDues(aDuess, onSuccess, onFailure);
			} else {
				accountingService.addDues(aDuess, onSuccess, onFailure);
			}


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				vm.isdisabled = false;
				swal('Success', response.message, 'success');
				if (vm.dataPreserve && !aDuess._id) {
					preserveData();
				}else{
					vm.oDues = {duesType:vm.oDues.duesType};
					vm.oDues.aVehCollection = [];
				}
			}
		} else {
			vm.isdisabled = false;
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

function emiDuesController(
	$scope,
	$stateParams,
	accountingService,
	commonDuesService,
	branchService,
	billsService,
	billBookService,
	DatePicker,
	narrationService,
	voucherService,
	Vehicle
) {

	let vm = this;

	vm.submit = submit;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getAllVehicle = getAllVehicle;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.addVehicle = addVehicle;
	vm.deleteVehicle = deleteVehicle;
	vm.onSelect = onSelect;
	vm.onAcSelect = onAcSelect;
	vm.onVehSelect = onVehSelect;
	vm.getFitnessDues = getFitnessDues;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter'
		vm.selectedDues = {};
		vm.oDues.aVehCollection = [];
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if($stateParams.data.data.selectedDues){
				vm.selectedDues = angular.copy($stateParams.data.data.selectedDues);
				commonDuesService.put('type', vm.selectedDues.duesType);
			}
		}
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};
		vm.clientAccount = vm.clientAccount.dues || {};
		vm.mode = vm.mode || 'add';
		if (vm.mode == 'add')
			vm.oDues.date = new Date();
		if (vm.mode == 'edit') {
			prepareData();
		}

		// otherDuesController
		commonDuesService.onChange('type', function (val) {
			vm.oDues.duesType = val;
			vm.amtLeble = undefined;
			if(val === 'Fitness Worksheet' || val ===  'Miscellaneous')
				vm.amtLeble = 'Inspection Fee'
		});

	})();

	// Actual Functions
	function prepareData() {
		if (vm.selectedDues) {
			vm.oDues = vm.selectedDues;
			if (vm.oDues.branch_name)
				vm.oDues.branch = {_id: vm.oDues.branch, name: vm.oDues.branch_name};
			    vm.amt = vm.oDues.amount;
			calculateSummary();
		}
	}

	vm.maxDate = function (frimDate) {
		vm.max = moment(frimDate, 'DD/MM/YYYY').toISOString();
		if (vm.oDues.duesType === 'Fitness Worksheet') {
			vm.month = Number(24);
		} else {
			vm.month = Number(14);
		}
	};

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true},
					deleted: false,
					ownershipType: ["Own", "Associate"]
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

	function getAutoStationaryNo() {

		if (vm.oDues.branch) {
			vm.billBookId = vm.oDues.branch.refNoBook ? vm.oDues.branch.refNoBook.map(o => o.ref) : '';
		} else {
			vm.billBookId = undefined;
		}

		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			status: "unused"
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oDues.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
		}
	}

	function prepareRefFilter() {

		if (!vm.filter.refNo)
			return;

		accountingService.getDues(vm.filter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.selectedDues = response.data[0];
				vm.mode = 'edit';
				prepareData()
			}
		}
	}

	function addVehicle(index) {
		if (!vm.oVehicle.veh || !vm.oVehicle.amount) {
			swal('Error', 'Select all Mandatory fields', 'error');
			return;
		}
		if(!vm.oVehicle.veh.owner_name)
			return	swal('Error', 'Selected Vehicle Owner not found', 'error');


		vm.oVehicle.amount = (vm.oVehicle.amount || 0);
		vm.oVehicle.othrexp = (vm.oVehicle.othrexp || 0);

		let oPush = vm.oVehicle;

		oPush.total = ( oPush.amount + oPush.othrexp);

		if (oPush.veh) {
			oPush.veh_no = oPush.veh.vehicle_reg_no;
			oPush.vehModel = oPush.veh.model;
			oPush.vehOwnerName = oPush.veh.owner_name;
			oPush.veh = oPush.veh._id;
		}
		if (oPush.frmdt && oPush.todt){
			oPush.frmdt = moment(oPush.frmdt, 'DD/MM/YYYY').toISOString();
			oPush.todt = moment(oPush.todt, 'DD/MM/YYYY').toISOString();
		}

		if(index != undefined) {
			vm.oDues.aVehCollection[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		}else {
			vm.oDues.aVehCollection.push(oPush);
		}

		vm.oVehicle = {amount:vm.oVehicle.amount};
		calculateSummary();
	}

	function deleteVehicle() {
		if(typeof vm.selectedIndex !== 'number') return;
		vm.oDues.aVehCollection.splice(vm.selectedIndex, 1);
		vm.oVehicle = {};
		calculateSummary();
	}

	function onSelect($index, veh) {
		if($scope.$role['Dues']['Update Policy']) {
			vm.selectedIndex = $index;
			vm.selectrdId = veh._id;
			vm.oVehicle = angular.copy(veh);
			vm.vehNo = vm.oVehicle.veh_no;
			vm.flag = true;
			vm.oVehicle.veh = {
				_id: vm.oVehicle.veh,
				vehicle_reg_no: vm.oVehicle.veh_no,
				model: vm.oVehicle.vehModel,
				owner_name: vm.oVehicle.vehOwnerName
			};
		}
	}

	function onAcSelect(item) {
		vm.PanNo = item.pan_no;
		vm.tdsApply = item.tdsApply;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		if(item.tdsSources && item.tdsCategory && item.tdsApply)
			getTDSRate();
		else
			vm.showTDSRate = true;

	}

	function onVehSelect(item) {
		if(item.ownershipType === 'Associate'){
			swal({
					title: 'This is Associated Vehicle Do You want to Process?',
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
					if (!isConfirm) {
						vm.oVehicle.veh = null;
						$scope.$apply()
					}
				});

		}
	}

	// function isProcess(item) {
	// 	vm.oVehicle.veh = item;
	//
	//
	// }

	function getTDSRate() {
		if(vm.tdsApply && vm.tdsCategory && vm.tdsSources && vm.oDues.date){
			let oReq = {
				date: moment(vm.oDues.date, 'DD/MM/YYYY').toISOString(),
				cClientId: $scope.selectedClient,
			};

			vm.DuesDate = moment(vm.oDues.date, 'DD/MM/YYYY').toISOString();

			let isGetTDS = true;
			if(vm.oDues.from_account && vm.oDues.from_account.exeRate && vm.oDues.from_account.exeFrom && vm.oDues.from_account.exeTo){
				if(new Date(vm.DuesDate) >= new Date(vm.oDues.from_account.exeFrom) && new Date(vm.DuesDate) <= new Date(vm.oDues.from_account.exeTo)) {
					vm.tdsRate = vm.oDues.from_account.exeRate;
					isGetTDS = false;
				}
			}
			if(isGetTDS)
				billsService.getTDSRate(oReq, onSuccess, onFailure);

			function onSuccess(res) {
				vm.showTDSRate = false;
				if(res.data && res.data.data && res.data.data.length){
					vm.allTDSRate = res.data.data[0];
					vm.allTDSRate.aRate.forEach(obj => {
						if (obj.sources === vm.tdsSources) {
							switch (vm.tdsCategory) {
								case 'Individuals or HUF': {
									if (vm.PanNo)
										return vm.tdsRate = obj.ipRate;
									else
										return vm.tdsRate = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.PanNo)
										return vm.tdsRate = obj.nipRate;
									else
										return vm.tdsRate = obj.niwpRate;
								}
								default:
									return vm.tdsRate = 0;
							}
						}
					});
				}
			}
			function onFailure(err) {
				vm.allTDSRate = {};
			}
		}

		if(!vm.tdsRate){
			vm.showTDSRate = true;
		}
	}

	function calculateSummary() {
		vm.oDues.tdsAmt = 0;

		vm.oDues.totalWithoutTax = 0;
		vm.oDues.proTotalWithoutTax = 0;
		vm.oDues.totalOthrexp = 0;
		vm.oDues.totalWithTax = 0;
		vm.oDues.cGST = 0;
		vm.oDues.sGST = 0;
		vm.oDues.iGST = 0;
		vm.oDues.prepaidAmt = 0;

		vm.oDues.aVehCollection.forEach((veh) => {
			vm.oDues.totalWithoutTax += (veh.amount || 0);
			vm.oDues.proTotalWithoutTax += (veh.proCharge || 0);
			vm.oDues.totalOthrexp += (veh.othrexp || 0);
			vm.oDues.totalWithTax += (veh.total || 0);
			vm.oDues.cGST += (veh.cGST || 0);
			vm.oDues.sGST += (veh.sGST || 0);
			vm.oDues.iGST += (veh.iGST || 0);
			vm.oDues.prepaidAmt += (veh.prepaidAmt || 0);
			vm.oDues.tdsAmt += (veh.tds ? Math.round((veh.proCharge) * (veh.tdsRate||0)/100) : 0);
		});
		vm.oDues.amount = (vm.oDues.totalWithTax - vm.oDues.tdsAmt);
		vm.oDues.proCharge = (vm.oDues.proTotalWithoutTax);
		vm.oDues.othrexp = (vm.oDues.totalOthrexp);
	}

	function calDays(fromDate, toDate) {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);
		fromDate.setHours(0, 0, 0);
		toDate.setHours(23, 59, 59);

		let day = 1000 * 60 * 60 * 24;
		let totday = (toDate - fromDate) / day;
		return Math.ceil(totday);

	}

	function dateCal(from, to) {
		from = new Date(from);
		to = new Date(to);
		let totYearDiff = new Date(to).getFullYear() - new Date(from).getFullYear();
		let finYearDate = new Date();
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if (totYearDiff === 0) {
			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;
		} else {
			if(from >= finYearDate)
				finYearDate.setFullYear(finYearDate.getFullYear() + 1);

			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;

		}
	}

	function getFitnessDues(vehicle) {

		if (!vehicle || !vehicle._id)
			return;


		var oFilter = {
			veh : vehicle._id,
			duesType: ["Fitness Worksheet"],
		};

		accountingService.getDues(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data && response.data.data.length && response.data.data[0].aVehCollection && response.data.data[0].aVehCollection.length) {
				response = response.data.data[0].aVehCollection[0];
				vm.oVehicle.amount = response.amount;
				vm.oVehicle.frmdt = response.frmdt;
				vm.oVehicle.todt = response.todt;
			}
		}
	}

	function preparePayload(payloadData) {
		if (!payloadData.frmdt || !payloadData.todt)
			return swal('Error', `From and To date required`, 'error');

		dateCal(payloadData.frmdt, payloadData.todt);

		if (vm.isFinancialYear) {
			vm.totalDays = calDays(payloadData.frmdt, payloadData.todt);
			vm.days = calDays(payloadData.frmdt, vm.financialYearDate);
			payloadData.prepaidAmt = 0;
			let sum = (payloadData.proCharge || 0) + (payloadData.amount || 0) + (payloadData.othrexp || 0);
			payloadData.postpaidAmt = Math.abs((sum / vm.totalDays) * vm.days);
			payloadData.prepaidAmt = (sum - payloadData.postpaidAmt);

		}
	}

	function GetFormattedDate(date) {
		var todayDate = new Date(date);
		var month = todayDate.getMonth() + 1;
		var day = todayDate.getDate();
		var year = todayDate.getFullYear();
		return day + "-" + month + "-" + year;
	}

	vm.setToDate = function(frimDate){
		if(vm.oDues.duesType === 'Fitness Worksheet' || vm.oDues.duesType === 'Miscellaneous') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 24));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}else if(vm.oDues.txtyp === 'HR TAX') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 3));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		} else{
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 12));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}
	};

	function preserveData() {
		let oFilter = {
			duesType:vm.oDues.duesType,
			branch:vm.oDues.branch,
			from_account:vm.oDues.from_account,
			to_account:vm.oDues.to_account,
			date:vm.oDues.date,
			txtyp:vm.oDues.txtyp,
			plcnm:vm.oDues.plcnm,
			rmk:vm.oDues.rmk,
			invoiceNo:vm.oDues.invoiceNo,
			// gstType:vm.oDues.gstType,
		};
		// if(vm.oDues.gstType === 'IGST')
		// 	oFilter.iGSTAccount = vm.oDues.iGSTAccount;
		// if(vm.oDues.gstType === 'CGST & SGST') {
		// 	oFilter.cGSTAccount = vm.oDues.cGSTAccount;
		// 	oFilter.sGSTAccount = vm.oDues.sGSTAccount;
		// }
		oFilter.aVehCollection = [];
		vm.oDues = oFilter;

	}

	// Dues submit
	function submit(formData) {
		if (formData.$valid) {

			let aDuess = angular.copy(vm.oDues);

			if (aDuess.amount > vm.maxAmount) {
				return swal('Error', `Limit Out Of Bound amount should be less then  ${vm.maxAmount}`, 'error');
			}
			if(aDuess.cGST && !aDuess.cGSTAccount)
				return swal('Error', "CGST Account required", 'error');
			if(aDuess.sGST && !aDuess.sGSTAccount)
				return swal('Error', "SGST Account required", 'error');
			if(aDuess.iGST && !aDuess.iGSTAccount)
				return swal('Error', "IGST Account required", 'error');
			if(aDuess.tdsAmt && !aDuess.tdsAccount)
				return swal('Error', "TDS Account required", 'error');
			else if(!aDuess.tdsAmt)
				aDuess.tdsAccount = undefined;
			if (aDuess.prepaidAmt && !vm.clientAccount.insPre)
				return swal('Error', `prepaid account required`, 'error');


			if (aDuess.branch) {
				aDuess.branch_name = aDuess.branch.name;
				aDuess.branch = aDuess.branch._id || aDuess.branch;
			}

			if (aDuess.from_account) {
				aDuess.fromAcName = aDuess.from_account.ledger_name || aDuess.from_account.name;
				aDuess.from_account = aDuess.from_account._id;
			}

			if (aDuess.to_account) {
				aDuess.toAcName = aDuess.to_account.ledger_name || aDuess.to_account.name;
				aDuess.to_account = aDuess.to_account._id;
			}
			if (aDuess.cGSTAccount && aDuess.cGSTAccount._id) {
				aDuess.cGSTAccountName = aDuess.cGSTAccount.ledger_name || aDuess.cGSTAccount.name;
				aDuess.cGSTAccount = aDuess.cGSTAccount._id;
			}
			if (aDuess.sGSTAccount && aDuess.sGSTAccount._id) {
				aDuess.sGSTAccountName = aDuess.sGSTAccount.ledger_name || aDuess.sGSTAccount.name;
				aDuess.sGSTAccount = aDuess.sGSTAccount._id;
			}
			if (aDuess.iGSTAccount && aDuess.iGSTAccount._id) {
				aDuess.iGSTAccountName = aDuess.iGSTAccount.ledger_name || aDuess.iGSTAccount.name;
				aDuess.iGSTAccount = aDuess.iGSTAccount._id;
			}
			if (aDuess.tdsAccount && aDuess.tdsAccount._id) {
				aDuess.tdsAccountName = aDuess.tdsAccount.ledger_name || aDuess.tdsAccount.name;
				aDuess.tdsAccount = aDuess.tdsAccount._id;
			}
			if (aDuess.prepaidAmt) {
				aDuess.prepaidAccName = vm.clientAccount.insPre.name;
				aDuess.prepaidAcc = vm.clientAccount.insPre._id;
			}

			if (aDuess.date)
				aDuess.date = moment(aDuess.date, 'DD/MM/YYYY').toISOString();

			aDuess.narration = narrationService({
				vehicleNo: aDuess.aVehCollection[0].veh_no,
				from: GetFormattedDate(aDuess.aVehCollection[0].frmdt),
				to: GetFormattedDate(aDuess.aVehCollection[0].todt)
			});

			aDuess.amt = ((aDuess.totalWithoutTax + aDuess.proTotalWithoutTax + aDuess.totalOthrexp) - (aDuess.prepaidAmt || 0));

			vm.isdisabled = true;
			if (aDuess._id) {
				accountingService.updateDues(aDuess, onSuccess, onFailure);
			} else {
				accountingService.addDues(aDuess, onSuccess, onFailure);
			}


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				vm.isdisabled = false;
				swal('Success', response.message, 'success');
				if (vm.dataPreserve && !aDuess._id) {
					preserveData();
				}else{
					vm.oDues = {duesType:vm.oDues.duesType};
					vm.oDues.aVehCollection = [];
				}

			}
		} else {
			vm.isdisabled = false;
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

function calibrationDuesController(
	$scope,
	$stateParams,
	accountingService,
	commonDuesService,
	branchService,
	billsService,
	billBookService,
	DatePicker,
	narrationService,
	voucherService,
	Vehicle
) {

	let vm = this;

	vm.submit = submit;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getAllVehicle = getAllVehicle;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.prepareData = prepareData;
	vm.prepareRefFilter = prepareRefFilter;
	vm.addVehicle = addVehicle;
	vm.deleteVehicle = deleteVehicle;
	vm.onSelect = onSelect;
	vm.onAcSelect = onAcSelect;
	vm.onVehSelect = onVehSelect;
	vm.getFitnessDues = getFitnessDues;

	// INIT functions
	(function init() {
		vm.oDues = {};// initialize dues object
		vm.oFilter = {};// initialize filter'
		vm.selectedDues = {};
		vm.oDues.aVehCollection = [];
		vm.DatePicker = angular.copy(DatePicker); // initialize datepicker
		if ($stateParams.data) {
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if($stateParams.data.data.selectedDues){
				vm.selectedDues = angular.copy($stateParams.data.data.selectedDues);
				commonDuesService.put('type', vm.selectedDues.duesType);
			}
		}
		vm.clientAccount = $scope.$configs.client_allowed.find(o => o.clientId === $scope.selectedClient);
		vm.clientAccount = vm.clientAccount || {};
		vm.clientAccount = vm.clientAccount.dues || {};
		vm.mode = vm.mode || 'add';
		if (vm.mode == 'add')
			vm.oDues.date = new Date();
		if (vm.mode == 'edit') {
			prepareData();
		}

		// otherDuesController
		commonDuesService.onChange('type', function (val) {
			vm.oDues.duesType = val;
			vm.amtLeble = undefined;
			if(val === 'Fitness Worksheet' || val ===  'Miscellaneous')
				vm.amtLeble = 'Inspection Fee'
		});

	})();

	// Actual Functions
	function prepareData() {
		if (vm.selectedDues) {
			vm.oDues = vm.selectedDues;
			if (vm.oDues.branch_name)
				vm.oDues.branch = {_id: vm.oDues.branch, name: vm.oDues.branch_name};
			vm.amt = vm.oDues.amount;
			calculateSummary();
		}
	}

	vm.maxDate = function (frimDate) {
		vm.max = moment(frimDate, 'DD/MM/YYYY').toISOString();
		if (vm.oDues.duesType === 'Fitness Worksheet') {
			vm.month = Number(24);
		} else {
			vm.month = Number(14);
		}
	};

	function getAllVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no: viewValue,
					account: {$exists: true},
					deleted: false,
					ownershipType: ["Own", "Associate"]
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

	function getAutoStationaryNo() {

		if (vm.oDues.branch) {
			vm.billBookId = vm.oDues.branch.refNoBook ? vm.oDues.branch.refNoBook.map(o => o.ref) : '';
		} else {
			vm.billBookId = undefined;
		}

		if (!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": 'Ref No',
			"auto": true,
			"sch": 'vch',
			status: "unused"
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oDues.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
		}
	}

	function prepareRefFilter() {

		if (!vm.filter.refNo)
			return;

		accountingService.getDues(vm.filter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				response = response.data;
				vm.selectedDues = response.data[0];
				vm.mode = 'edit';
				prepareData()
			}
		}
	}

	function addVehicle(index) {
		if (!vm.oVehicle.veh || !vm.oVehicle.amount) {
			swal('Error', 'Select all Mandatory fields', 'error');
			return;
		}
		if(!vm.oVehicle.veh.owner_name)
			return	swal('Error', 'Selected Vehicle Owner not found', 'error');


		vm.oVehicle.amount = (vm.oVehicle.amount || 0);
		vm.oVehicle.othrexp = (vm.oVehicle.othrexp || 0);

		let oPush = vm.oVehicle;

		oPush.total = ( oPush.amount + oPush.othrexp);

		if (oPush.veh) {
			oPush.veh_no = oPush.veh.vehicle_reg_no;
			oPush.vehModel = oPush.veh.model;
			oPush.vehOwnerName = oPush.veh.owner_name;
			oPush.veh = oPush.veh._id;
		}
		if (oPush.frmdt && oPush.todt){
			oPush.frmdt = moment(oPush.frmdt, 'DD/MM/YYYY').toISOString();
			oPush.todt = moment(oPush.todt, 'DD/MM/YYYY').toISOString();
		}

		if(index != undefined) {
			vm.oDues.aVehCollection[index] = oPush;
			vm.selectedIndex = undefined;
			vm.selectrdId = undefined;
			vm.flag = false;
		}else {
			vm.oDues.aVehCollection.push(oPush);
		}

		vm.oVehicle = {amount:vm.oVehicle.amount};
		calculateSummary();
	}

	function deleteVehicle() {
		if(typeof vm.selectedIndex !== 'number') return;
		vm.oDues.aVehCollection.splice(vm.selectedIndex, 1);
		vm.oVehicle = {};
		calculateSummary();
	}

	function onSelect($index, veh) {
		if($scope.$role['Dues']['Update Policy']) {
			vm.selectedIndex = $index;
			vm.selectrdId = veh._id;
			vm.oVehicle = angular.copy(veh);
			vm.vehNo = vm.oVehicle.veh_no;
			vm.flag = true;
			vm.oVehicle.veh = {
				_id: vm.oVehicle.veh,
				vehicle_reg_no: vm.oVehicle.veh_no,
				model: vm.oVehicle.vehModel,
				owner_name: vm.oVehicle.vehOwnerName
			};
		}
	}

	function onAcSelect(item) {
		vm.PanNo = item.pan_no;
		vm.tdsApply = item.tdsApply;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		if(item.tdsSources && item.tdsCategory && item.tdsApply)
			getTDSRate();
		else
			vm.showTDSRate = true;

	}

	function onVehSelect(item) {
		if(item.ownershipType === 'Associate'){
			swal({
					title: 'This is Associated Vehicle Do You want to Process?',
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
					if (!isConfirm) {
						vm.oVehicle.veh = null;
						$scope.$apply()
					}
				});

		}
	}

	// function isProcess(item) {
	// 	vm.oVehicle.veh = item;
	//
	//
	// }

	function getTDSRate() {
		if(vm.tdsApply && vm.tdsCategory && vm.tdsSources && vm.oDues.date){
			let oReq = {
				date: moment(vm.oDues.date, 'DD/MM/YYYY').toISOString(),
				cClientId: $scope.selectedClient,
			};

			vm.DuesDate = moment(vm.oDues.date, 'DD/MM/YYYY').toISOString();

			let isGetTDS = true;
			if(vm.oDues.from_account && vm.oDues.from_account.exeRate && vm.oDues.from_account.exeFrom && vm.oDues.from_account.exeTo){
				if(new Date(vm.DuesDate) >= new Date(vm.oDues.from_account.exeFrom) && new Date(vm.DuesDate) <= new Date(vm.oDues.from_account.exeTo)) {
					vm.tdsRate = vm.oDues.from_account.exeRate;
					isGetTDS = false;
				}
			}
			if(isGetTDS)
				billsService.getTDSRate(oReq, onSuccess, onFailure);

			function onSuccess(res) {
				vm.showTDSRate = false;
				if(res.data && res.data.data && res.data.data.length){
					vm.allTDSRate = res.data.data[0];
					vm.allTDSRate.aRate.forEach(obj => {
						if (obj.sources === vm.tdsSources) {
							switch (vm.tdsCategory) {
								case 'Individuals or HUF': {
									if (vm.PanNo)
										return vm.tdsRate = obj.ipRate;
									else
										return vm.tdsRate = obj.iwpRate;
								}
								case 'Non Individual/corporate': {
									if (vm.PanNo)
										return vm.tdsRate = obj.nipRate;
									else
										return vm.tdsRate = obj.niwpRate;
								}
								default:
									return vm.tdsRate = 0;
							}
						}
					});
				}
			}
			function onFailure(err) {
				vm.allTDSRate = {};
			}
		}

		if(!vm.tdsRate){
			vm.showTDSRate = true;
		}
	}

	function calculateSummary() {
		vm.oDues.tdsAmt = 0;

		vm.oDues.totalWithoutTax = 0;
		vm.oDues.proTotalWithoutTax = 0;
		vm.oDues.totalOthrexp = 0;
		vm.oDues.totalWithTax = 0;
		vm.oDues.cGST = 0;
		vm.oDues.sGST = 0;
		vm.oDues.iGST = 0;
		vm.oDues.prepaidAmt = 0;

		vm.oDues.aVehCollection.forEach((veh) => {
			vm.oDues.totalWithoutTax += (veh.amount || 0);
			vm.oDues.proTotalWithoutTax += (veh.proCharge || 0);
			vm.oDues.totalOthrexp += (veh.othrexp || 0);
			vm.oDues.totalWithTax += (veh.total || 0);
			vm.oDues.cGST += (veh.cGST || 0);
			vm.oDues.sGST += (veh.sGST || 0);
			vm.oDues.iGST += (veh.iGST || 0);
			vm.oDues.prepaidAmt += (veh.prepaidAmt || 0);
			vm.oDues.tdsAmt += (veh.tds ? Math.round((veh.proCharge) * (veh.tdsRate||0)/100) : 0);
		});
		vm.oDues.amount = (vm.oDues.totalWithTax - vm.oDues.tdsAmt);
		vm.oDues.proCharge = (vm.oDues.proTotalWithoutTax);
		vm.oDues.othrexp = (vm.oDues.totalOthrexp);
	}

	function calDays(fromDate, toDate) {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);
		fromDate.setHours(0, 0, 0);
		toDate.setHours(23, 59, 59);

		let day = 1000 * 60 * 60 * 24;
		let totday = (toDate - fromDate) / day;
		return Math.ceil(totday);

	}

	function dateCal(from, to) {
		from = new Date(from);
		to = new Date(to);
		let totYearDiff = new Date(to).getFullYear() - new Date(from).getFullYear();
		let finYearDate = new Date();
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if (totYearDiff === 0) {
			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;
		} else {
			if(from >= finYearDate)
				finYearDate.setFullYear(finYearDate.getFullYear() + 1);

			if (from < finYearDate && to <= finYearDate) {
				vm.isFinancialYear = false;
			} else if (from <= finYearDate && to > finYearDate) {
				vm.isFinancialYear = true;
			} else if (from > finYearDate && to > finYearDate) {
				vm.isFinancialYear = false;
			}
			vm.financialYearDate = finYearDate;

		}
	}

	function getFitnessDues(vehicle) {

		if (!vehicle || !vehicle._id)
			return;


		var oFilter = {
			veh : vehicle._id,
			duesType: ["Fitness Worksheet"],
		};

		accountingService.getDues(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data && response.data && response.data.data.length && response.data.data[0].aVehCollection && response.data.data[0].aVehCollection.length) {
				response = response.data.data[0].aVehCollection[0];
				vm.oVehicle.amount = response.amount;
				vm.oVehicle.frmdt = response.frmdt;
				vm.oVehicle.todt = response.todt;
			}
		}
	}

	function preparePayload(payloadData) {
		if (!payloadData.frmdt || !payloadData.todt)
			return swal('Error', `From and To date required`, 'error');

		dateCal(payloadData.frmdt, payloadData.todt);

		if (vm.isFinancialYear) {
			vm.totalDays = calDays(payloadData.frmdt, payloadData.todt);
			vm.days = calDays(payloadData.frmdt, vm.financialYearDate);
			payloadData.prepaidAmt = 0;
			let sum = (payloadData.proCharge || 0) + (payloadData.amount || 0) + (payloadData.othrexp || 0);
			payloadData.postpaidAmt = Math.abs((sum / vm.totalDays) * vm.days);
			payloadData.prepaidAmt = (sum - payloadData.postpaidAmt);

		}
	}

	function GetFormattedDate(date) {
		var todayDate = new Date(date);
		var month = todayDate.getMonth() + 1;
		var day = todayDate.getDate();
		var year = todayDate.getFullYear();
		return day + "-" + month + "-" + year;
	}

	vm.setToDate = function(frimDate){
		if(vm.oDues.duesType === 'Fitness Worksheet' || vm.oDues.duesType === 'Miscellaneous') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 24));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}else if(vm.oDues.txtyp === 'HR TAX') {
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 3));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		} else{
			vm.frimDate = new Date(moment(frimDate, 'DD/MM/YYYY').toISOString());
			vm.oVehicle.todt = new Date(vm.frimDate.setMonth(vm.frimDate.getMonth() + 12));
			vm.oVehicle.todt = new Date(vm.frimDate.setDate(vm.frimDate.getDate() - 1));
		}
	};

	function preserveData() {
		let oFilter = {
			duesType:vm.oDues.duesType,
			branch:vm.oDues.branch,
			from_account:vm.oDues.from_account,
			to_account:vm.oDues.to_account,
			date:vm.oDues.date,
			txtyp:vm.oDues.txtyp,
			plcnm:vm.oDues.plcnm,
			rmk:vm.oDues.rmk,
			invoiceNo:vm.oDues.invoiceNo,
			// gstType:vm.oDues.gstType,
		};
		// if(vm.oDues.gstType === 'IGST')
		// 	oFilter.iGSTAccount = vm.oDues.iGSTAccount;
		// if(vm.oDues.gstType === 'CGST & SGST') {
		// 	oFilter.cGSTAccount = vm.oDues.cGSTAccount;
		// 	oFilter.sGSTAccount = vm.oDues.sGSTAccount;
		// }
		oFilter.aVehCollection = [];
		vm.oDues = oFilter;

	}

	// Dues submit
	function submit(formData) {
		if (formData.$valid) {

			let aDuess = angular.copy(vm.oDues);

			if (aDuess.amount > vm.maxAmount) {
				return swal('Error', `Limit Out Of Bound amount should be less then  ${vm.maxAmount}`, 'error');
			}
			if(aDuess.cGST && !aDuess.cGSTAccount)
				return swal('Error', "CGST Account required", 'error');
			if(aDuess.sGST && !aDuess.sGSTAccount)
				return swal('Error', "SGST Account required", 'error');
			if(aDuess.iGST && !aDuess.iGSTAccount)
				return swal('Error', "IGST Account required", 'error');
			if(aDuess.tdsAmt && !aDuess.tdsAccount)
				return swal('Error', "TDS Account required", 'error');
			else if(!aDuess.tdsAmt)
				aDuess.tdsAccount = undefined;
			if (aDuess.prepaidAmt && !vm.clientAccount.insPre)
				return swal('Error', `prepaid account required`, 'error');


			if (aDuess.branch) {
				aDuess.branch_name = aDuess.branch.name;
				aDuess.branch = aDuess.branch._id || aDuess.branch;
			}

			if (aDuess.from_account) {
				aDuess.fromAcName = aDuess.from_account.ledger_name || aDuess.from_account.name;
				aDuess.from_account = aDuess.from_account._id;
			}

			if (aDuess.to_account) {
				aDuess.toAcName = aDuess.to_account.ledger_name || aDuess.to_account.name;
				aDuess.to_account = aDuess.to_account._id;
			}
			if (aDuess.cGSTAccount && aDuess.cGSTAccount._id) {
				aDuess.cGSTAccountName = aDuess.cGSTAccount.ledger_name || aDuess.cGSTAccount.name;
				aDuess.cGSTAccount = aDuess.cGSTAccount._id;
			}
			if (aDuess.sGSTAccount && aDuess.sGSTAccount._id) {
				aDuess.sGSTAccountName = aDuess.sGSTAccount.ledger_name || aDuess.sGSTAccount.name;
				aDuess.sGSTAccount = aDuess.sGSTAccount._id;
			}
			if (aDuess.iGSTAccount && aDuess.iGSTAccount._id) {
				aDuess.iGSTAccountName = aDuess.iGSTAccount.ledger_name || aDuess.iGSTAccount.name;
				aDuess.iGSTAccount = aDuess.iGSTAccount._id;
			}
			if (aDuess.tdsAccount && aDuess.tdsAccount._id) {
				aDuess.tdsAccountName = aDuess.tdsAccount.ledger_name || aDuess.tdsAccount.name;
				aDuess.tdsAccount = aDuess.tdsAccount._id;
			}
			if (aDuess.prepaidAmt) {
				aDuess.prepaidAccName = vm.clientAccount.insPre.name;
				aDuess.prepaidAcc = vm.clientAccount.insPre._id;
			}

			if (aDuess.date)
				aDuess.date = moment(aDuess.date, 'DD/MM/YYYY').toISOString();

			aDuess.narration = narrationService({
				vehicleNo: aDuess.aVehCollection[0].veh_no,
				from: GetFormattedDate(aDuess.aVehCollection[0].frmdt),
				to: GetFormattedDate(aDuess.aVehCollection[0].todt)
			});

			aDuess.amt = ((aDuess.totalWithoutTax + aDuess.proTotalWithoutTax + aDuess.totalOthrexp) - (aDuess.prepaidAmt || 0));

			vm.isdisabled = true;
			if (aDuess._id) {
				accountingService.updateDues(aDuess, onSuccess, onFailure);
			} else {
				accountingService.addDues(aDuess, onSuccess, onFailure);
			}


			// Handle failure response
			function onFailure(response) {
				vm.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				vm.isdisabled = false;
				swal('Success', response.message, 'success');
				if (vm.dataPreserve && !aDuess._id) {
					preserveData();
				}else{
					vm.oDues = {duesType:vm.oDues.duesType};
					vm.oDues.aVehCollection = [];
				}

			}
		} else {
			vm.isdisabled = false;
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}



function commonDuesService() {
	return {
		get: key => this[key],
		put: (key, val) => {
			this[key] = val;
			typeof this[`${key}Fn`] === 'function' && this[`${key}Fn`](val);
		},
		onChange: (key, callback = _ => {}) =>  {
			this[`${key}Fn`] = callback;
			callback(this.type);
		}
	};
}


