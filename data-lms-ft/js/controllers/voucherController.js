materialAdmin
	.controller("voucherController", voucherController)
	.controller("addVoucherController", addVoucherController)
	.controller("remarkPopupController", remarkPopupController);

voucherController.$inject = [
	'$modal',
	'$filter',
	'$scope',
	'accountingService',
	'DatePicker',
	'lazyLoadFactory',
	'tripServices',
	'stateDataRetain',
	'voucherService',
	'branchService',
	'userService',
	'objToCsv',
	'tableAccessDetailFactory'
];
addVoucherController.$inject = [
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
	'voucherService'
];

function voucherUploadFailctrl(
	$filter,
	$uibModalInstance,
	lazyLoadFactory,
	otherData,
	objToCsv
) {
	let vm = this;
	vm.closeModal = closeModal;
	vm.downloadCsv = downloadCsv;

	(function init() {
		vm.aVch = [];

		vm.rejectedData = angular.copy(otherData.rejectedData);
		if (vm.rejectedData) {
			vm.rejectedData.forEach(obj => {
				vm.aVch.push(...obj);
			});
		}
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function downloadCsv(aData) {
		if (!(aData || []).length)
			return;

		objToCsv('', [
			'PAYMENT TYPE',
			'VOUCHER TYPE',
			'DATE',
			'BRANCH',
			'REFERENCE NO',
			'PAYMENT MODE',
			'PAYMENT REFERENCE NO',
			'NARRATION',
			"TYPE",
			'ACCOUNT',
			"AMOUNT",
			"BILL TYPE",
			"BILL NO",
		], aData.map(o => {
			let arr = [];
			try {
				arr.push(o.vT || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.type || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push($filter('date')(o.date, 'dd-MMM-yyyy') || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.branch || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.refNo || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.paymentMode || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.paymentRef || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.narration || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.cRdR || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.lName || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.amount || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.billType || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.billNo || '');
			} catch (e) {
				arr.push("");
			}
			return arr;
		}));
	}
}

function voucherController(
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
	userService,
	objToCsv,
	tableAccessDetailFactory
) {

	let vm = this;
	// object Identifiers
	vm.aAccountMaster = [];
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object
	vm.aggrs = [{label: 'From', value: 'from'}, {label: 'To', value: 'to'}, {label: 'Type', value: 'type'}];
	vm.maxDate = new Date();


	// functions Identifiers
	vm.addVoucher = addVoucher;
	vm.getVouchers = getVouchers;
	vm.clearCheque = clearCheque;
	vm.printVoucher = printVoucher;
	vm.unclearCheque = unclearCheque;
	vm.reverseVoucher = reverseVoucher;
	vm.deleteVoucher = deleteVoucher;
	vm.downloadVouchers = downloadVouchers;
	vm.downloadExl = downloadExl;
	vm.tdsReport = tdsReport;
	vm.createVouchers = createVouchers;
	vm.createVouchersCommon = createVouchersCommon;
	vm.createVouchersCommonIds = createVouchersCommonIds;
	vm.uploadVouchers = uploadHandler;
	vm.voucherUplodFail = voucherUplodFail;
	vm.downloadCsv = downloadCsv;
	vm.downloadDemoCsv = downloadDemoCsv;
	vm.accountMaster = accountMaster;
	vm.onLedgerSelect = onLedgerSelect;
	vm.onCostCenterSelect=onCostCenterSelect;
	vm.costCenter=costCenter;
	vm.removeLedger = removeLedger;
	vm.getUser = getUser;
	vm.tdsPayments = tdsPayments;
	vm.selectedVoucher = selectedVoucher;
	vm.shouldDisableEditing = shouldDisableEditing;
	vm.getAllBranch = getAllBranch;
	vm.showHistry=showHistry;
	vm.showHistryPopUpCtrl=showHistryPopUpCtrl;
	vm.aVoucher = ["Account imported", "Account not imported", "Tally exported", "Tally not exported", "Reversed"];
	$scope.onStateRefresh = function () {
		getVouchers();
	};

	// INIT functions
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		vm.tableAccessDetail = tableAccessDetailFactory;

		let pageNameConst = 'Account_Management_Voucher';
		let tableNameConst = 'Voucher';
		vm.totamt = 0;
		vm.oFilter.to_date = new Date();
		vm.oFilter.from_date = new Date(new Date().setDate(new Date(vm.oFilter.to_date).getDate() - 7));

		let oFoundTable = $scope.$tableAccess.find(oTable => oTable.clientId !== '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst);// given acess from admin
		let oFoundTables = $scope.$tableAccess.find(oTable => oTable.clientId === '000000' && oTable.pages === pageNameConst && oTable.table === tableNameConst);// given assess from super admin
		if(oFoundTable && oFoundTables) {
			oFoundTable.configs = oFoundTables.configs;
			let orderedAccess = [];
			oFoundTables.access.forEach( (item) => {
				if(oFoundTable.access.includes(item)) {
					orderedAccess.push(item);
				}
			});
			oFoundTable.access = orderedAccess;
		}
		oFoundTable = oFoundTable ? oFoundTable : oFoundTables;
		let visible = oFoundTable ? oFoundTable.visible : vm.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let access = oFoundTable ? oFoundTable.access : vm.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let oBinding = vm.tableAccessDetail[pageNameConst][tableNameConst];

		if(true) {
			for (const prop in oBinding) {
				if(oFoundTable && oFoundTable.configs)
				oBinding[prop].header = oFoundTable.configs[tableNameConst][prop];
			}
		}

		vm.visibleDownload = visible.map(str => oBinding[str].header);
		vm.oFoundTableId = false;
		if (oFoundTable && oFoundTable._id)
			vm.oFoundTableId = oFoundTable._id;

		vm.myFilter = {};
		vm.lazyLoad = lazyLoadFactory();
		vm.selectType = 'index';
		vm.aVouchers = [];
		vm.aSelectedVouchers = [];
		vm.columnSetting = {
			allowedColumn: [],
			visibleColumn: visible.map(str => oBinding[str].header),
			visibleCb: (columnSetting) => {

				if (!(oFoundTable && oFoundTable._id))
					return;

				let currentSetting = columnSetting.visibleColumn;
				let mapTable = vm.tableAccessDetail[pageNameConst][tableNameConst + 'Column'].reduce((obj, str) => {
					obj[oBinding[str].header] = str;
					return obj;
				}, {});

				let request = {
					pages: pageNameConst,
					table: tableNameConst,
					access: columnSetting.allowedColumn.map(str => mapTable[str]),
					visible: currentSetting.map(str => mapTable[str]),
					_id: oFoundTable._id
				};

				userService.updateOneTableConfig(request, successVis, failureVis);

				function successVis(data) {
					if (data.data && data.data) {
						let d = data.data;
						$scope.$tableAccess.splice(0, $scope.$tableAccess.length);
						for (let i of d) {
							$scope.$tableAccess.push(i);
						}
					}
				}

				function failureVis(res) {
					swal("Error in table column setting", "", "error");
				}
			}
		};

		vm.tableHead = [];

		access.forEach(str => {
			vm.columnSetting.allowedColumn.push(oBinding[str].header);
			vm.tableHead.push(oBinding[str]);
		});
		// vm.columnSetting = {
		// 	allowedColumn: [
		// 		'Category',
		// 		'Vch Type',
		// 		'Date',
		// 		'Reference',
		// 		'CREDIT AC',
		// 		'CR Amt',
		// 		'DEBIT AC',
		// 		'DR Amt',
		// 		'Narration',
		// 		"Bill No",
		// 		'Branch',
		// 		"Pay Date",
		// 		"Pay Ref",
		// 		"Pay Mode",
		// 		"Reversed By",
		// 		"Reversed At",
		// 		'Created By',
		// 		'Created At',
		// 		'last modified At',
		// 		'last modified By',
		// 		'Tally Export By',
		// 		'Reversed',

		// 		'Check Clear Date',
		// 		'Check Clear Remark',
		// 	]
		// };
		// vm.tableHead = [
		// 	{
		// 		'header': 'Vch Type',
		// 		'bindingKeys': 'type'
		// 	},
		// 	{
		// 		'header': 'Category',
		// 		'bindingKeys': 'vT'
		// 	},
		// 	{
		// 		'header': 'CR Amt',
		// 		html: true,
		// 		filter: {
		// 			name: 'trustAsHtml',
		// 			aParam: ['crAmt']
		// 		}
		// 	},
		// 	{
		// 		'header': 'DR Amt',
		// 		html: true,
		// 		filter: {
		// 			name: 'trustAsHtml',
		// 			aParam: ['drAmt']
		// 		}
		// 	},
		// 	{
		// 		'header': 'CREDIT AC',
		// 		html: true,
		// 		filter: {
		// 			name: 'trustAsHtml',
		// 			aParam: ['crAc']
		// 		}
		// 	},
		// 	{
		// 		'header': 'DEBIT AC',
		// 		// 'bindingKeys': 'this.drAc|trustAsHtml',
		// 		html: true,
		// 		filter: {
		// 			name: 'trustAsHtml',
		// 			aParam: ['drAc']
		// 		}
		// 	},
		// 	{
		// 		'header': 'Amount',
		// 		'bindingKeys': 'amount'
		// 	},
		// 	{
		// 		'header': 'Reference',
		// 		'bindingKeys': 'refNo',
		// 		'date': false
		// 	},
		// 	{
		// 		'header': 'Narration',
		// 		'bindingKeys': 'narration',
		// 		'date': false
		// 	},
		// 	{
		// 		'header': 'Date',
		// 		'bindingKeys': 'date',
		// 		'date': 'dd-MMM-yyyy'
		// 	},
		// 	{
		// 		'header': 'Branch',
		// 		'bindingKeys': 'branch.name'
		// 	},
		// 	{
		// 		'header': 'Bill No',
		// 		'bindingKeys': 'billNo',
		// 		'date': false
		// 	},
		// 	{
		// 		'header': 'Pay Date',
		// 		'bindingKeys': 'paymentDate || chequeDate'
		// 	},
		// 	{
		// 		'header': 'Pay Ref',
		// 		'bindingKeys': 'paymentRef',
		// 		'date': false
		// 	},
		// 	{
		// 		'header': 'Pay Mode',
		// 		'bindingKeys': 'paymentMode'
		// 	},
		// 	{
		// 		'header': 'Reversed',
		// 		'bindingKeys': 'this.reversed ? "Yes" : "No"',
		// 		'eval': true
		// 	},
		// 	{
		// 		'header': 'Reversed By',
		// 		'bindingKeys': 'by'
		// 	},
		// 	{
		// 		'header': 'Reversed At',
		// 		'bindingKeys': 'at'
		// 	},
		// 	{
		// 		'header': 'Deleted',
		// 		'bindingKeys': 'this.deleted ? "Yes" : "No"',
		// 		'eval': true
		// 	},
		// 	{
		// 		'header': 'Created By',
		// 		'bindingKeys': 'createdBy'
		// 	},
		// 	{
		// 		'header': 'Created At',
		// 		'bindingKeys': 'created_at'
		// 	},
		// 	{
		// 		'header': 'last modified At',
		// 		'bindingKeys': 'last_modified_at'
		// 	},
		// 	{
		// 		'header': 'last modified By',
		// 		'bindingKeys': 'last_modified_by_name'
		// 	},
		// 	{
		// 		'header': 'Tally Export By',
		// 		'bindingKeys': 'acExp.by'
		// 	},
		// 	{
		// 		'header': 'Check Clear Date',
		// 		'bindingKeys': 'chequeClear.date',
		// 		'date': true
		// 	},
		// 	{
		// 		'header': 'Check Clear Remark',
		// 		'bindingKeys': 'chequeClear.rem'
		// 	}
		// ];
	})();

	// Actual Functions
	function tdsPayments() {
		stateDataRetain.go('accountManagment.tdsPayment');
	}

	function addVoucher(type = 'add') {
		if (type == 'add') {
			stateDataRetain.go('accountManagment.voucherAdd', {
				data: {
					type
				}
			});
		} else if (type == 'edit' || type == 'view') {

			if (Array.isArray(vm.aSelectedVouchers)) {
				if (vm.aSelectedVouchers.length !== 1)
					return swal('Warning', 'Please Select Single Voucher', 'warning');
			} else if (!vm.aSelectedVouchers._id)
				return swal('Warning', 'Please Select Single Voucher', 'warning');

			let selectedVch = Array.isArray(vm.aSelectedVouchers) ? vm.aSelectedVouchers[0] : vm.aSelectedVouchers;
			if (!selectedVch.refNo)
				return swal('Warning', 'Voucher refNo not found', 'warning');

			stateDataRetain.go('accountManagment.voucherAdd', {
				data: {
					selectedVch,
					type
				}
			});
		}
	}

	function printVoucher() {
		if (!vm.aSelectedVouchers)
			return swal('Warning', 'Select at least one voucher!!!!!', 'warning');

		if(Array.isArray(vm.aSelectedVouchers))
			vm.aSelectedVouchers = vm.aSelectedVouchers[0];


		$modal.open({
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
							builtyName: templateKey
						};

						clientService.getVoucherPreview(oFilter, success, fail);
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
						let key =$scope.templateKey && $scope.templateKey.key || 'default';
						excelDownload.html(id, 'sheet 1', `${key}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					let aTemplate = ($scope.$constants.aVoucherTemplate || []);
					return {
						_id: vm.aSelectedVouchers._id,
						aBillTemplate: aTemplate,
					};
				}
			}
		});
	}

	function clearCheque() {
		let oVoucher;

		if (Array.isArray(vm.aSelectedVouchers))
			oVoucher = vm.aSelectedVouchers[0];
		else
			oVoucher = vm.aSelectedVouchers;

		if(!oVoucher)
			return swal('', 'Select at least one voucher', 'warning');

		$modal.open({
			templateUrl: 'views/bills/voucherClearCheque.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'DatePicker',
				'oVoucher',
				'voucherService',
				voucherClearChequeCtrl
			],
			controllerAs: 'vm',
			resolve: {
				oVoucher: function () {
					return oVoucher;
				}
			}
		})
	}

	function unclearCheque() {
		let oVoucher;

		if (Array.isArray(vm.aSelectedVouchers))
			oVoucher = vm.aSelectedVouchers[0];
		else
			oVoucher = vm.aSelectedVouchers;

		if(!oVoucher)
			return swal('', 'Select at least one voucher', 'warning');

		swal({
			title: "Confirm Reverse Cleared Cheque ?",
			text: "",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Reverse",
			closeOnConfirm: true
		}, function(){
			function succ(response){
				if (response.message){
					swal('', response.message, "success");
				}
			}

			function fail(response){
				if (response.message){
					swal('', response.message, "error");
				}
			}
			voucherService.unClearCheque(oVoucher, succ, fail);
		});
	}

	function deleteVoucher(hasAdminAccess) {

		if (!vm.aSelectedVouchers)
			return swal('Error', 'Please Select a Voucher', 'error');

		let selectedVch;

		// if(!$scope.$role['Voucher']['Delete'])
		// 	return swal('Error', 'you don not have access to delete Voucher. ask your admin', 'error');


		if (!Array.isArray(vm.aSelectedVouchers))
			selectedVch = [vm.aSelectedVouchers];
		else
			selectedVch = vm.aSelectedVouchers;

		let isVoucherCreated = false;
		let isDeletable = true;

		selectedVch.forEach(o => {
			if (o.voucher)
				isVoucherCreated = true;

			if (!o.isEditable)
				isDeletable = false;
			if (o.link)
				selectedVch.push({_id: o.link.Parent || o.link.TDS})
		});

		if (!hasAdminAccess ? isVoucherCreated : false)
			return swal('Error', 'Actual Voucher Already Created for some Voucher.', 'error');

		if (!isDeletable)
			return swal('Error', 'Voucher Cannot be deleted from here.', 'error');

		swal({
				title: 'Are you sure you want to delete selected vouchers?',
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
					voucherService.deletePlainVoucher({
						_id: selectedVch.map(v => v._id)
					}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.message, 'success');
						// getAllTripSus();
						vm.aVouchers = vm.aVouchers.filter(oVch => !selectedVch.find(o => o._id === oVch._id));
						vm.tableApi.refresh();
					}

					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
				}
			});
	}

	// Get Day Book from backend
	function getVouchers(isGetActive, deletedSearch) {

		if (vm.oFilter.voucher === 'Account not imported' || vm.oFilter.voucher === 'Account imported' || vm.oFilter.voucher === 'Reversed' || vm.oFilter.voucher === 'Tally not exported' || vm.oFilter.voucher === 'Tally exported') {
			vm.selectType = 'multiple';
			// vm.aSelectedVouchers = [];
		} else {
			vm.selectType = 'index';
		}

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();
		// if (isDownloadTrue) {
		// 	oFilter.download = true;
		// }
		if (deletedSearch) {
			oFilter.deleted = true;
		}
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

	function shouldDisableEditing() {
		let selV;
		if (Array.isArray(vm.aSelectedVouchers)) {
			selV = vm.aSelectedVouchers[0];
		} else {
			selV = vm.aSelectedVouchers;
		}
		if (selV) {
			if (!selV.isEditable) return true;
			return selV.acImp.st;
		}
		return false;
	}

	function selectedVoucher() {
		vm.totamt = 0;
		if (!Array.isArray(vm.aSelectedVouchers)) {
			vm.selectedVouch = [vm.aSelectedVouchers];
		} else {
			vm.selectedVouch = vm.aSelectedVouchers;
		}
		vm.selectedVouch.forEach(obj => {
			obj.totamt = obj.ledgers.reduce((a, b) => {

				if (b.cRdR === 'DR') {
					vm.totamt += b.amount;
				}
			}, 0);
		});
	}

	function reverseVoucher() {
		const sv = vm.aSelectedVouchers.filter(v => v.reversed);
		if (sv.length) {
			swal('Error!', `Vouchers ${sv.map(v => v.PlainVoucherId).join(', ')} are already reversed`, 'error');
			return;
		}
		$modal.open({
			templateUrl: 'views/accounting/remarkPopup.html',
			controller: 'remarkPopupController',
			resolve: {
				a: () => angular.copy(vm.aSelectedVouchers)
			}
		}).result.then(function (response) {
		}, function (response) {
		});
	}

	function downloadExl(downloadType) {

		var oFilter = prepareFilterObject();
		oFilter.download = downloadType;
		delete oFilter.skip;

		voucherService.downloadVouchers(oFilter, onSuccess, err => {
			console.log(err);
		});

		// Handle success response
		function onSuccess(response) {

			var a = document.createElement('a');
			a.href = response.url;
			a.download = response.url;
			a.target = '_blank';
			a.click();
		}
	}

	function tdsReport(downloadType, rptType) {

		var oFilter = prepareFilterObject();
		oFilter.download = downloadType;
		// oFilter.vT = rptType;
		delete oFilter.skip;

		voucherService.downloadTDSReport(oFilter, onSuccess, err => {
			console.log(err);
		});

		// Handle success response
		function onSuccess(response) {

			var a = document.createElement('a');
			a.href = response.url;
			a.download = response.url;
			a.target = '_blank';
			a.click();
		}
	}

	function downloadVouchers(downloadType, isGetActive) {

		if (vm.oFilter.voucher == 'Account not imported' || vm.oFilter.voucher == 'Tally not exported') {
			vm.selectType = 'multiple';
			vm.aSelectedVouchers = [];
		} else {
			vm.selectType = 'index';
		}

		if (!vm.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();
		oFilter.download = downloadType;
		if (downloadType == 'tally') {
			if (Array.isArray(vm.aSelectedVouchers) && vm.aSelectedVouchers.length) {
				oFilter.refNos = vm.aSelectedVouchers.map(v => v.refNo);
			}
		} else {
			if (Array.isArray(vm.aSelectedVouchers) && vm.aSelectedVouchers.length) {
				oFilter._id = vm.aSelectedVouchers.map(v => v._id);
			}
		}

		voucherService.downloadVouchers(oFilter, onSuccess, err => {
			console.log(err);
		});

		// Handle success response
		function onSuccess(response) {

			if (downloadType == 'tally') {
				let excelBlob = new Blob([response], {
					type: 'text/plain'
				});
				let fName = new Date().getDate();
				fName = 'TallyVouchers' + fName + '.xml';
				saveAs(excelBlob, fName);
			} else {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			}
		}
	}

	function showHistry() {
		if (Array.isArray(vm.aSelectedVouchers)) {
			if (vm.aSelectedVouchers.length !== 1)
				return swal('Warning', 'Please Select Single Voucher', 'warning');
		} else if (!vm.aSelectedVouchers._id)
			return swal('Warning', 'Please Select Single Voucher', 'warning');

		let selectedVch = Array.isArray(vm.aSelectedVouchers) ? vm.aSelectedVouchers[0] : vm.aSelectedVouchers;
		if(selectedVch.his.length < 1){
			swal('Error', 'No history Found', 'error');
			return;
		}
		$modal.open({
			templateUrl: 'views/bills/voucherHistoryPopUp.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'otherData',
				showHistryPopUpCtrl
			],
			controllerAs: 'shVm',
			resolve: {
				otherData: function() {
					return {
						voucher: selectedVch.his,
					};
				},
			}

		}).result.then(function (response) {
				console.log(response);
			}, function (data) {
				if (data != 'cancel') {
					console.log(data);
				}
			}
		);
	}

	function showHistryPopUpCtrl(
		$scope,
		$uibModalInstance,
		otherData,
	) {

		let vm = this;

		// function identifer
		vm.closeModal = closeModal;

		// init
		(function init() {
			vm.voucherHistory = otherData.voucher;
		})();

		function closeModal() {
			$uibModalInstance.dismiss();
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

	function createVouchers(selectedTrip) {
		let request = {
			advances: selectedTrip.map(o => o._id),
		};

		swal({
				title: 'Are you sure!!! you want to Create Voucher?',
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
					tripServices.createVouchers(request, onSuccess, onFailure);
				}
			});

		function onFailure(err) {
			swal('Error', err.message, 'error');
			reject(err.message);
		}

		function onSuccess(res) {
			console.log(res);
			swal(res.data.message);
			// resolve(res.data.data);

		}
	}

	function createVouchersCommon() {
		let request = {
			schema: 'PlainVoucher',
			findQuery: {
				from: vm.oFilter.from_date,
				to: vm.oFilter.to_date,
			}
		};
		if (vm.oFilter.ledger) {
			request.findQuery.account = vm.oFilter.ledger._id;
		}
		if (vm.oFilter.refNo) {
			request.findQuery.refNo = vm.oFilter.refNo;
		}
		swal({
				title: 'Are you sure!!! you want to Create Voucher?',
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
					voucherService.createVouchersCommon(request, onSuccess, onFailure);
				}
			});

		function onFailure(err) {
			swal('Error', err.message, 'error');
			reject(err.message);
		}

		function onSuccess(res) {
			console.log(res);
			swal(res.message);
		}
	}

	function createVouchersCommonIds(aVouch) {
		let request = {};
		if (aVouch && aVouch.length > 0) {
			request.ids = aVouch.map(v => v._id);
		} else {
			request.reqQuery = prepareFilterObject();
		}

		swal({
				title: 'Are you sure!!! you want to Create Voucher?',
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
					voucherService.createVouchersCommon(request, onSuccess, onFailure);
				}
			});

		function onFailure(err) {
			swal('Error', err.message, 'error');
			reject(err.message);
		}

		function onSuccess(res) {
			console.log(res);
			swal(res.message);
		}
	}

	function downloadCsv() {
		objToCsv(null,
			[
				'PAYMENT TYPE',
				'VOUCHER TYPE',
				'DATE',
				'BRANCH',
				'REFERENCE NO',
				'PAYMENT MODE',
				'PAYMENT REFERENCE NO',
				'NARRATION',
				"TYPE",
				'ACCOUNT',
				"AMOUNT",
				"BILL TYPE",
				"BILL NO",
			],
			[]
		);
	}

	function downloadDemoCsv() {
		let aData = [];
		aData.push({
			date: moment('13-04-2020', 'DD/MM/YYYY').endOf('day').toISOString(),
			vT: 'Other',
			type: 'Journal',
			branch: 'Dharuhera Office',
			refNo: 'UPS/REF/038',
			paymentMode: 'NEFT',
			paymentRef: '6748',
			narration: 'test data',
			cRdR: 'DR',
			lName: 'HDFC acct',
			amount: '2500',
			billType: 'New Ref'
		});
		aData.push({refNo: 'UPS/REF/038', cRdR: 'CR', lName: 'MACHINO POLYMERS', amount: '2500', billType: 'New Ref'});
		objToCsv('', [
			'PAYMENT TYPE',
			'VOUCHER TYPE',
			'DATE',
			'BRANCH',
			'REFERENCE NO',
			'PAYMENT MODE',
			'PAYMENT REFERENCE NO',
			'NARRATION',
			"TYPE",
			'ACCOUNT',
			"AMOUNT",
			"BILL TYPE",
			"BILL NO",
		], aData.map(o => {
			let arr = [];
			try {
				arr.push(o.vT || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.type || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push($filter('date')(o.date, 'dd-MM-yyyy') || '');
			} catch (e) {
				arr.push("");
			}

			try {
				arr.push(o.branch || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.refNo || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.paymentMode || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.paymentRef || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.narration || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.cRdR || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.lName || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.amount || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.billType || '');
			} catch (e) {
				arr.push("");
			}
			try {
				arr.push(o.billNo || '');
			} catch (e) {
				arr.push("");
			}
			return arr;
		}));
	}

	function uploadHandler(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('voucherExcel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			voucherService.uploadVoucher({}, data)
				.then(function (d) {
					if (d.data.aVoucherFailed && d.data.aVoucherFailed.length > 0) {
						swal({text: d.message});
						voucherUplodFail(d.data.aVoucherFailed);
					}
					swal({
						title: 'Info',
						text: d.message,
						type: "info"
					});
					$uibModalInstance.close();
				}).catch(function (err) {
				swal(err.data.message, err.data.error, 'error');
			});
		}
	}

	function voucherUplodFail(rejectedData) {
		$modal.open({
			templateUrl: 'views/bills/voucherUploadFailPopUp.html',
			controller: ['$filter', '$uibModalInstance', 'lazyLoadFactory', 'otherData', 'objToCsv', voucherUploadFailctrl],
			controllerAs: 'vuVm',
			resolve: {
				otherData: function () {
					return {
						rejectedData
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel', data);
		});
	}

	function getUser(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {
				userService.getUserNames(
					viewValue
					, res => {
						resolve(res.data)
					}, err => {
						console.log`${err}`;
						reject([])
					});
			});
		} else
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

	function costCenter(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
				};
				accountingService.getCostCenter(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		} else
			return [];
	}

	function onLedgerSelect(item) {
		vm.aLedger = vm.aLedger || [];
		vm.aLedger.push(item);
		vm.oFilter.ledger = '';
	}

	function onCostCenterSelect(item) {
		vm.oFilter.cost_center = item.name;
	}

	function removeLedger(select, index) {
		vm.aLedger.splice(index, 1);
	}

	function prepareFilterObject() {
		var filter = {};

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
		if (vm.oFilter.billNo) {
			filter.billNo = vm.oFilter.billNo;
		}
		if (vm.oFilter.name) {
			filter.name = vm.oFilter.name;
		}
		if (vm.oFilter.user) {
			filter.createdBy = vm.oFilter.user.full_name;
		}
		if (vm.oFilter.cost_center) {
			filter.cost_center = vm.oFilter.cost_center;
		}
		if (vm.oFilter.narration) {
			filter.narration = vm.oFilter.narration;
		}
		if (vm.oFilter.amount) {
			filter['ledgers.amount'] = Number(vm.oFilter.amount);
		}
		if (vm.oFilter.from) {
			filter.from = [vm.oFilter.from._id];
		}
		if (vm.oFilter.to) {
			filter.to = [vm.oFilter.to._id];
		}

		if (vm.aLedger && vm.aLedger.length) {
			filter.ledger = [];
			vm.aLedger.map((v) => {
				filter.ledger.push(v._id);
			});
		}
		if (vm.oFilter.ledger) {
			filter.ledger = vm.oFilter.ledger._id;
		}
		if (vm.oFilter.aggregateBy) {
			filter.aggregateBy = vm.oFilter.aggregateBy;
		}
		if (vm.oFilter.vT) {
			filter.vT = vm.oFilter.vT;
		}
		if (vm.oFilter.dateType) {
			filter.dateType = vm.oFilter.dateType;
		}
		if (vm.oFilter.cheque) {
			if (vm.oFilter.cheque === 'Clear') {
				filter['chequeClear.date'] = {$exists: true};
			} else {
				filter['chequeClear.date'] = {$exists: false};
			}
		}
		if (vm.oFilter.branch) {
			filter.branch = vm.oFilter.branch._id;
		}
		if (vm.oFilter.voucher) {
			if (vm.oFilter.voucher === 'Account imported') {
				filter['acImp.st'] = true;
			} else if (vm.oFilter.voucher === 'Account not imported') {
				filter['acImp.st'] = false;
			} else if (vm.oFilter.voucher === 'Tally not exported') {
				filter['acImp.st'] = true;
				filter['acExp.st'] = false;
			} else if (vm.oFilter.voucher === 'Tally exported') {
				filter['acImp.st'] = true;
				filter['acExp.st'] = true;
			} else if (vm.oFilter.voucher === 'Reversed') {
				filter.reversed = true;
			} else if (vm.oFilter.voucher === 'Deleted') {
				filter.deleted = true;
			}
			filter.no_of_docs = 100;
		} else {
			filter.no_of_docs = 10;
		}
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
		}else if (vm.oFilter.sortBy === 'last_modified_at') {
			filter.sort = {'last_modified_at': -1};
		} else {
			filter.sort = {'_id': -1};
		}
		return filter;
	}
}

function addVoucherController(
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
	voucherService
) {

	let vm = this;

	// functions Identifiers
	vm.submit = submit;
	vm.setUsed = setUsed;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getVouchers = getVouchers;
	vm.prepareRefFilter = prepareRefFilter;
	vm.prepareData = prepareData;
	vm.prepareLedgersData = prepareLedgersData;
	vm.onSelect = onSelect;
	vm.onBillSelect = onBillSelect;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.getBillNo = getBillNo;
	vm.addSec = addSec;
	vm.getAllSv = getAllSv;
	vm.getTDSRate = getTDSRate;
	vm.removeVoucher = removeVoucher;
	vm.setAmount = setAmount;
	vm.setBillType = setBillType;
	vm.culAmount = culAmount;
	vm.applyTDSOnAmount = applyTDSOnAmount;
	vm.onTDSApply = onTDSApply;
	vm.addCostCenter = addCostCenter;

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
		vm.oAccountMaster = {}; // initialize Account Master object
		vm.dealAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		if (vm.dealAcc) {
			vm.tdsAccountObj = {
				_id: vm.dealAcc.vDealTDSAcc,
				name: vm.dealAcc.vDealTDSAccName
			};
		}
		vm.opened = true;
		vm.aSecV = [];
		vm.bills = [];
		vm.test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		if ($stateParams.data && $stateParams.data.data.selectedVch && $stateParams.data.data.selectedVch.link) {
			let req = {};
			vm.mode = $stateParams.data.data.type.toLowerCase();
			if ($stateParams.data.data.selectedVch.link.Parent) {
				req._id = $stateParams.data.data.selectedVch.link.Parent;
				req.key = $stateParams.data.data.selectedVch.vT === 'Vendor TDS' ? 'TDS' : '';
				getVouchers(req);
			} else {
				req.key = $stateParams.data.data.selectedVch.link.TDS ? 'TDS' : '';
				req._id = $stateParams.data.data.selectedVch._id;
				getVouchers(req);
			}
		} else {
			if ($stateParams.data) {
				vm.selectedVch = angular.copy($stateParams.data.data.selectedVch);
				vm.mode = $stateParams.data.data.type.toLowerCase();
			}
			if (vm.mode === 'edit' || vm.mode === 'view') {
				vm.selectedStationary = {_id: vm.selectedVch.stationaryId ,bookNo: vm.selectedVch.refNo}
				prepareLedgersData();
				// getAllSv();
			}
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

	function getVouchers(req) {
		req.populate = true;

		voucherService.getVoucher(req, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {

			if (response && response.data) {
				vm.selectedVch = response.data.data[0];
				vm.mode = $stateParams.data.data.type.toLowerCase();
				if (vm.mode === 'edit' || vm.mode === 'view') {
					prepareLedgersData();
					prepareTDSLedgersData();
					// getAllSv();
				}
			}
		}
	}


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

	function prepareRefFilter() {
		if (vm.filter.refNo) {
			vm.noRefNoFound = false;
			let req = {
				refNo: vm.filter.refNo,
				no_of_docs: 30
			};

			voucherService.getVoucher(req, onSuccess, err => {
				console.log(err)
			});
		}

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				vm.selectedVch = response.data.data[0];
				if (vm.selectedVch && vm.selectedVch._id) {
					vm.aSecV = [];
					vm.mode = 'edit';
					if (!vm.selectedVch.isEditable)
						return swal('Warning', 'Voucher can not editable', 'warning');
					prepareLedgersData();
				} else {
					vm.noRefNoFound = true;
					vm.oPaymentType = undefined;
					vm.oVoucher = {};
				}
			}
		}
	}

	function getAllSv() {
		let req = {
			refNo: vm.selectedVch.refNo,
			no_of_docs: 30
		};

		voucherService.getVoucher(req, success);

		function success(response) {
			vm.aSecV = response.data.data;
			if (vm.aSecV.length > 0) {
				vm.totCreditAmount = vm.aSecV.reduce((a, c) => a + c.amount, 0);
				vm.totCreditAmount = Number((vm.totCreditAmount).toFixed(2));
				vm.oVoucher = vm.aSecV[0];
				$scope.$constants.aVoucherPaymentType.find(o => {
					if (o.pType === vm.oVoucher.vT) {
						vm.oPaymentType = o;
						vm.aVouchersType = vm.oPaymentType.voucherType;
						return;
					}
				});
				onSelect(vm.oVoucher.branch, 'edit');
				if (vm.oVoucher && vm.oVoucher.chequeDate) vm.oVoucher.chequeDate = new Date(vm.oVoucher.chequeDate);
				if (vm.oVoucher && vm.oVoucher.billDate) vm.oVoucher.billDate = new Date(vm.oVoucher.billDate);
			} else {
				vm.noRefNoFound = true;
				vm.oPaymentType = undefined;
				vm.oVoucher = {};
			}
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
					isGroup: false
				};

				if($scope.$configs.voucher && $scope.$configs.voucher[vm.oVoucher.type]){
					if($scope.$configs.voucher[vm.oVoucher.type][vm.oFilter.aVoucher.cRdR])
						req.type = $scope.$configs.voucher[vm.oVoucher.type][vm.oFilter.aVoucher.cRdR]
				}

				// if(vm.group && vm.oVoucher.type === 'Payment' && vm.oFilter.aVoucher.cRdR ==='CR')
				// 	req.group = vm.group;
				// if(vm.group && vm.oVoucher.type === 'Receipt' && vm.oFilter.aVoucher.cRdR ==='DR')
				// 	req.group = vm.group;
				// if(vm.group && vm.oVoucher.type === 'Contra' && vm.oFilter.aVoucher.cRdR ==='DR')
				// 	req.group = vm.group;


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
	}

	vm.onSelectAccount = function (item) {
		vm.account = item;
		vm.tdsApply = item.tdsApply;
		vm.tdsCategory = item.tdsCategory;
		vm.tdsSources = item.tdsSources;
		vm.tdsSection = item.tdsSection;
		vm.pan_no = item.pan_no;
		if (vm.tdsCategory && vm.tdsSources && vm.tdsSection)
			vm.tdsDetails = {tdsCategory: vm.tdsCategory, tdsSources: vm.tdsSources, tdsSection: vm.tdsSection};
		if (item.tdsApply && item.tdsCategory && item.tdsSources && vm.oFilter.aVoucher.cRdR === 'CR' && !vm.allTDSRate) {
			vm.isGet = true;
			getTDSRate();
		} else {
			vm.isGet = false;
		}
	};

	function getTDSRate() {
		if (vm.isGet && vm.oVoucher.billDate) {
			return new Promise(function (resolve, reject) {
				let req = {
					date: moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString(),
					cClientId: $scope.selectedClient
				};
				vm.billDate = moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString();

				let isGetTDS = true;
				if(vm.account && vm.account.exeRate && vm.account.exeFrom && vm.account.exeTo){
					if(new Date(vm.billDate) >= new Date(vm.account.exeFrom) && new Date(vm.billDate) <= new Date(vm.account.exeTo)) {
						vm.allTDSRate = {};
						vm.allTDSRate.tdsRate = vm.account.exeRate;
						isGetTDS = false;
					}
				}

				if(isGetTDS)
				billsService.getTDSRate(req, res => {
					resolve(res.data.data);
					vm.allTDSRate = res.data.data[0];
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}
	}

	function applyTDSOnAmount(oSec) {
		if (vm.allTDSRate) {
			if(vm.allTDSRate.tdsRate){
				oSec.tdsRate = vm.allTDSRate.tdsRate;
			}else {
				vm.allTDSRate.aRate.forEach(obj => {
					if (obj.sources === oSec.to.tdsSources) {
						switch (oSec.to.tdsCategory) {
							case 'Individuals or HUF': {
								if (oSec.to.pan_no)
									return oSec.tdsRate = obj.ipRate;
								else
									return oSec.tdsRate = obj.iwpRate;
							}
							case 'Non Individual/corporate': {
								if (oSec.to.pan_no)
									return oSec.tdsRate = obj.nipRate;
								else
									return oSec.tdsRate = obj.niwpRate;
							}
							default:
								return oSec.tdsRate = 0;
						}
					}
				});
			}
		} else {
			oSec.tdsRate = 0;
			oSec.tdsAmount = 0;
		}
	}

	function onTDSApply(oSec) {
		if (oSec.toApplyTDS)
			oSec.tdsAmount = (((oSec.amount) * (oSec.tdsRate || 0) / 100));
		else
			oSec.tdsAmount = 0;

		calculateSummary();
	}

	function calculateSummary() {

		vm.totTDSAmt = 0;
		vm.aSecV.forEach((obj) => {
			// obj.tdsAmount = (obj.tdsRate ? ((obj.amount) * (obj.tdsRate||0)/100) : 0);
			vm.totTDSAmt += obj.tdsAmount || 0;
		});
	}


	function addSec(type) {
		vm.oFilter.aVoucher.tdsRate = 0;
		if (!vm.oFilter.aVoucher.to || !vm.oFilter.aVoucher.amount) {
			swal('Error', 'Select all other fields', 'error');
			return;
		}

		if (!otherUtils.isEmptyObject(vm.oFilter.aVoucher.billNo))
			vm.oFilter.aVoucher.billNo = (vm.oFilter.aVoucher.billNo).trim();

		let valid = billNoValidation(vm.oFilter.aVoucher.billNo, vm.oFilter.aVoucher.billType);
		if (!valid)
			return;

		let shouldValidateBillType = true;

		if($scope.$configs.voucher && typeof $scope.$configs.voucher.billTypeValidation !== 'undefined')
			shouldValidateBillType = $scope.$configs.voucher.billTypeValidation;

		if(shouldValidateBillType){
			if (vm.oFilter.aVoucher.cRdR == 'CR' && vm.oVoucher.type == 'Receipt' && !vm.oFilter.aVoucher.billType) {
				return swal('Error', 'Bill Type Mandatory', 'error');
			} else if (vm.oFilter.aVoucher.cRdR == 'DR' && vm.oVoucher.type == 'Payment' && !vm.oFilter.aVoucher.billType) {
				return swal('Error', 'Bill Type Mandatory', 'error');
			}
		}

		if (vm.oFilter.aVoucher.cRdR == 'CR')
			applyTDSOnAmount(vm.oFilter.aVoucher);

		if (type == 'add') {
			vm.aSecV.push({...vm.oFilter.aVoucher});
			if (vm.aSecV.length > 1) {
				vm.oFilter.aVoucher.billNo = undefined;
			} else {
				if (vm.oFilter.aVoucher.cRdR === "DR") {
					vm.oFilter.aVoucher.cRdR = "CR";
					if (vm.oFilter.aVoucher.cRdR == 'CR' && vm.oVoucher.type == 'Receipt')
						vm.oFilter.aVoucher.billType = 'On Account';
				} else if (vm.oFilter.aVoucher.cRdR === "CR") {
					vm.oFilter.aVoucher.cRdR = "DR";
					if (vm.oFilter.aVoucher.cRdR == 'DR' && vm.oVoucher.type == 'Payment')
						vm.oFilter.aVoucher.billType = 'On Account';

					vm.oFilter.aVoucher.billNo = undefined;
				}
			}
			vm.oFilter.aVoucher.costCategory = undefined;
		} else if (type == 'edit') {
			vm.aSecV.push({...vm.oFilter.aVoucher});
			if (vm.aSecV.length > 1) {
				vm.oFilter.aVoucher.billNo = undefined;
			} else {
				if (vm.oFilter.aVoucher.cRdR === "DR") {
					vm.oFilter.aVoucher.cRdR = "CR";
					if (vm.oFilter.aVoucher.cRdR == 'CR' && vm.oVoucher.type == 'Receipt')
						vm.oFilter.aVoucher.billType = 'On Account';
				} else if (vm.oFilter.aVoucher.cRdR === "CR") {
					vm.oFilter.aVoucher.cRdR = "DR";
					if (vm.oFilter.aVoucher.cRdR == 'DR' && vm.oVoucher.type == 'Payment')
						vm.oFilter.aVoucher.billType = 'On Account';

					vm.oFilter.aVoucher.billNo = undefined;
				}
			}
			vm.oFilter.aVoucher.costCategory = undefined;
		}
		calculateSummary();
	}

	function addCostCenter(voucher){

				$modal.open({
					templateUrl: 'views/accounting/voucherCostCatPopUp.html',
					controller: ['$scope', '$filter', '$uibModalInstance', '$modalInstance', 'accountingService','lazyLoadFactory', 'otherData', voucherCostcatPopUpCtrl],
					controllerAs: 'vm',
					resolve: {
						otherData: function () {
							return {
								voucher: voucher,
								mode: vm.mode
							};
						}
					}
				}).result.then(function (response) {
					console.log('close', response);
				}, function (data) {
					console.log('cancel', data);
				});
	}


	function prepareLedgersData() {
		vm.selectedVch.ledgers.forEach(item => {
			// vm.billFilter = vm.billFilter || [];
			// vm.billFilter.push(item.account);
			if (item.bills.length) {
				item.bills.forEach(o => {
					let obj = {};
					obj.amount = o.amount;
					obj.billNo = o.billNo;
					obj.billType = o.billType;
					obj.to = {_id: item.account, name: item.lName};
					obj.cRdR = item.cRdR;
					obj.tdsAmount = item.tdsAmount;
					obj.tdsRate = item.tdsRate;
					obj.costCategory = item.costCategory;
					obj._id = o._id;
					vm.aSecV.push(obj);
				});
			} else {
				let obj = {};
				obj.amount = item.amount;
				obj._id = item._id;
				obj.to = {_id: item.account, name: item.lName};
				obj.cRdR = item.cRdR;
				obj.tdsAmount = item.tdsAmount;
				obj.tdsRate = item.tdsRate;
				obj.costCategory = item.costCategory;
				vm.aSecV.push(obj);
			}
		});

		if (vm.aSecV.length > 0) {
			vm.oVoucher = vm.selectedVch;
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
		calculateSummary();
	}

	function prepareTDSLedgersData() {
		vm.aTDSSecV = [];
		if (vm.selectedVch && vm.selectedVch.link && vm.selectedVch.link.TDS)
			vm.selectedVch.link.TDS.ledgers.forEach(item => {

				if (item.bills.length) {
					item.bills.forEach(o => {
						let obj = {};
						obj.amount = o.amount;
						obj.billNo = o.billNo;
						obj.billType = o.billType;
						obj.to = {_id: item.account, name: item.lName};
						obj.cRdR = item.cRdR;
						obj.tdsAmount = item.tdsAmount;
						obj.tdsRate = item.tdsRate;
						obj._id = o._id;
						vm.aTDSSecV.push(obj);
					});
				} else {
					let obj = {};
					obj.amount = item.amount;
					obj._id = item._id;
					obj.to = {_id: item.account, name: item.lName};
					obj.cRdR = item.cRdR;
					obj.tdsAmount = item.tdsAmount;
					obj.tdsRate = item.tdsRate;
					vm.aTDSSecV.push(obj);
				}
			});
	}


	function prepareData() {
		vm.ledgers = [];
		vm.aSecV.forEach(item => {
			if (vm.ledgers.length) {
				vm.flag = false;
				vm.ledgers.forEach(obj => {
					if (item.to._id == obj.account && item.cRdR == obj.cRdR) {
						obj.amount += item.amount;
						obj.tdsAmount += item.tdsAmount;
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
						tdsRate: item.tdsRate,
						tdsAmount: item.tdsAmount,
						costCategory: item.costCategory
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
					tdsRate: item.tdsRate,
					tdsAmount: item.tdsAmount,
					costCategory: item.costCategory
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

	function preserveData () {
		let oFilter = {
			type:vm.oVoucher.type || '',
			branch:vm.oVoucher.branch || '',
			billDate:vm.oVoucher.billDate || '',
			paymentMode:vm.oVoucher.paymentMode || '',
			// paymentRef:vm.oVoucher.paymentRef || '',
			narration:vm.oVoucher.narration || ''
		};
		vm.oVoucher  = oFilter;
		onSelect(vm.oPaymentType, 'PaymentType');
		vm.aSecV = [];
		vm.oFilter.aVoucher = {};
 	}

	function prepareTDSData() {
		vm.ledgers2 = [];
		vm.aSecV.forEach(item => {
			if (item.tdsAmount) {
				if (vm.ledgers2.length) {
					vm.flag = false;
					vm.ledgers2.forEach(obj => {
						if (item.to._id == obj.account && item.cRdR == obj.cRdR) {
							obj.amount += item.tdsAmount;
							obj.bills.push({
								amount: item.tdsAmount,
								billNo: vm.oVoucher.refNo,
								billType: 'Against Ref',
							});
							vm.flag = true;
						}
					});
					if (!vm.flag) {
						let obj = {
							account: item.to._id,
							lName: item.to.ledger_name || item.to.name,
							amount: item.tdsAmount,
							cRdR: 'DR',
						};
						obj.bills = obj.bills || [];
						obj.bills.push({
							amount: item.tdsAmount,
							billNo: vm.oVoucher.refNo,
							billType: 'Against Ref',
						});
						vm.ledgers2.push(obj);
					}
				} else {
					let obj = {
						account: item.to._id,
						lName: item.to.ledger_name || item.to.name,
						amount: item.tdsAmount,
						cRdR: 'DR',
					};
					obj.bills = obj.bills || [];
					obj.bills.push({
						amount: item.tdsAmount,
						billNo: vm.oVoucher.refNo,
						billType: 'Against Ref',
					});
					vm.ledgers2.push(obj);
				}
			}
		});
		if (vm.totTDSAmt) {
			let obj = {
				account: vm.tdsAccountObj._id,
				lName: vm.tdsAccountObj.name,
				amount: vm.totTDSAmt,
				cRdR: 'CR',
			};
			obj.bills = obj.bills || [];
			obj.bills.push({
				amount: vm.totTDSAmt,
				billNo: 'TDS/' + vm.oVoucher.refNo,
				billType: 'New Ref',
			});
			vm.ledgers2.push(obj);
		}
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

	function getAutoStationaryNo(viewValue) {

		if (vm.oVoucher.vT === 'Other') {
			vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';
			vm.type = 'Ref No';
		} else if(vm.oVoucher.vT === 'Customer Receipts' && $scope.$configs.voucher && $scope.$configs.voucher.allowCRAutoBook){
			vm.billBookId = vm.oVoucher.branch.crBook ? vm.oVoucher.branch.crBook.map(o => o.ref) : '';
		} else {
			vm.billBookId = undefined;
		}

		if (viewValue != 'centrailized' && !(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": vm.billBookId,
			"type": vm.type,
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (vm.oVoucher.billDate)
			req.useDate = moment(vm.oVoucher.billDate, 'DD/MM/YYYY').toISOString();

		if(viewValue === 'centrailized'){
			delete req.billBookId;
			req.centralize = true;
			req.sch = 'onBook';
		}

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oVoucher.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
			// vm.preserveRefNo.push({
			// 	name: vm.oVoucher.branch.name,
			// 	refNo: vm.aAutoStationary.bookNo,
			// 	selectedStationary: vm.aAutoStationary
			// })
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

		if (vm.oVoucher.vT == 'Customer Receipts') {
			vm.type = 'Cash Receipt';
		} else {
			vm.type = 'Ref No';
		}
		if (vm.oVoucher.branch) {
			if (vm.type == 'Cash Receipt') {
				vm.billBookId = vm.oVoucher.branch.crBook ? vm.oVoucher.branch.crBook.map(o => o.ref) : '';
			} else {
				vm.billBookId = vm.oVoucher.branch.refNoBook ? vm.oVoucher.branch.refNoBook.map(o => o.ref) : '';
			}
			if (type == 'edit')
				return;

			vm.oVoucher.refNo = '';
		}
	}


	// Voucher submit
	function submit(formData) {
		if (formData.$valid) {
			vm.nonValid = false;
			let msg = false;

			if (!vm.aSecV.length) {
				return swal('Error', `No New Data found`, 'error');
			}
			if (!vm.oVoucher.branch._id) {
				return swal('Error', `branch required`, 'error');
			}

			prepareData();
			if (vm.nonValid)
				return;

			if(vm.ledgers && vm.ledgers.length){
				vm.ledgers.forEach(val=> {
					if (val.costCategory && val.costCategory.length){
						let obj = val.costCategory;
					for (let k in obj) {
						obj[k].sum = 0;
						if (obj.hasOwnProperty(k)) {
							for (let j in obj[k]['center'])
								obj[k].sum += (obj[k]['center'][j].amount || 0);
						}
						if (obj[k].sum > 0 && obj[k].sum != val.amount) {
							msg = obj[k].category + ' Category amount should be equal to debit amount';
						}
					}
				}
				})
			}

			if(msg)
				return swal('Error', msg, 'error');

			if (vm.totTDSAmt)
				prepareTDSData();

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
			// vm.isdisabled = true;

			if(vm.aSecV && vm.aSecV.length){
				vm.aSecV.forEach(obj=>{
					if(obj.to && obj.to.opn_bal_date && new Date(obj.to.opn_bal_date) > new Date(aVouchers.date)){
						msg = 'The transaction is not allowed before opening balance date in account ' + obj.to.name;
					}
				})
			}
			if(msg)
				return swal('Error', msg, 'error');

			if(!(vm.selectedStationary && (vm.selectedStationary._id || vm.selectedStationary.bookNo)))
				return swal('Error', 'inValid ref Number', 'error');

			if (vm.totTDSAmt) {
				let req = {
					parentVoucher: aVouchers,
					childVoucher: angular.copy(aVouchers)
				};
				if (vm.oVoucher._id) {
					req.childVoucher.link = {Parent: vm.oVoucher._id};
					req.childVoucher._id = aVouchers.link && aVouchers.link.TDS && aVouchers.link.TDS._id;
				}
				if (vm.tdsDetails) {
					req.childVoucher.tdsCategory = vm.tdsDetails.tdsCategory;
					req.childVoucher.tdsSources = vm.tdsDetails.tdsSources;
					req.childVoucher.tdsSection = vm.tdsDetails.tdsSection
				}

				req.childVoucher.refNo = 'TDS/' + vm.oVoucher.refNo;
				req.childVoucher.ledgers = vm.ledgers2;
				req.childVoucher.vT = 'Vendor TDS';
				req.childVoucher.type = 'Journal';
				req.childVoucher.linkType = 'TDS';
				req.parentVoucher.linkType = 'Parent';
				delete req.childVoucher.stationaryId;
				vm.isdisabled = true;
				if (vm.oVoucher._id) {
					voucherService.bulkUpsertPlainVoucher(req, onSuccess, onFailure);
				} else {
					voucherService.bulkAddPlainVoucher(req, onSuccess, onFailure);
				}
			} else if (vm.oVoucher._id) {
				vm.isdisabled = true;
				aVouchers._id = vm.selectedVch._id;
				voucherService.editPlainVoucher(aVouchers, onSuccess, onFailure);
			} else {
				vm.isdisabled = true;
				voucherService.addVoucher(aVouchers, onSuccess, onFailure);
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
				// vm.oVoucher.refNo = undefined;
				// vm.oVoucher.narration = undefined;
				// vm.oVoucher.paymentMode = undefined;
				// vm.oVoucher.chequeDate = undefined;
				// vm.oVoucher.paymentRef = undefined;
				// vm.oVoucher._id = undefined;
				// // vm.oVoucher.billNo = undefined;
				// // vm.oVoucher.billType = undefined;
				// vm.oFilter.aVoucher = undefined;
				// vm.aSecV = [];
				if(vm.dataPreserve && !vm.oVoucher._id) {
					preserveData();
					vm.oFilter.aVoucher ={};
				}else {
					vm.oFilter.aVoucher ={};
					vm.oVoucher = {};
					vm.aSecV = [];
					vm.oPaymentType = undefined;
				}
			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

}

function remarkPopupController(
	$scope,
	$uibModalInstance,
	a,
	voucherService
) {
	$scope.isDisabled =false;
	$scope.closePopup = function () {
		$uibModalInstance.dismiss();
	};
	$scope.submit = function (form) {
		let ids = a.map(x => x._id);
		$scope.isDisabled =true;
		voucherService.reversePlainVoucher({ids, remark: $scope.remark,}, onSuccess, onFailure);

		function onFailure(response) {
			$scope.isDisabled =false;
			swal('Error!', 'Voucher can\'t be reversed', 'error');
			$uibModalInstance.close('failure');
		}

		function onSuccess(response) {
			$scope.isDisabled =false;
			swal('Success', "Voucher reversed successfully", 'success');
			$uibModalInstance.close(response.data);
		}
	};
}

function voucherClearChequeCtrl(
	$scope,
	$uibModalInstance,
	DatePicker,
	oVoucher,
	voucherService,
) {
	let vm = this;

	vm.closeModal = close;
	vm.submit = submit;

	(function init(){
		vm.DatePicker = angular.copy(DatePicker);
		vm.voucher = oVoucher;
		vm.date = new Date();
	})();

	// Actual function

	function close(){
		$uibModalInstance.dismiss();
	}

	function submit(){
		let req = {
			_id: vm.voucher._id,
			date: vm.date,
			remark: vm.remark
		};

		voucherService.clearCheque(req, (res) => {
			swal('Success', res.message, 'success');
			close();
		}, err => {
			swal('Error', err.message, 'error');
			close();
		})
	}
}

function voucherCostcatPopUpCtrl(
	$scope,
	$filter,
	$uibModalInstance,
	$modalInstance,
	accountingService,
	lazyLoadFactory,
	otherData,

) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.getCostCategory = getCostCategory;
	vm.getCostCenter = getCostCenter;
	vm.addCenter = addCenter;
	vm.add = add;
	vm.edit = edit;
	vm.submit = submit;

	// init
	(function init() {
		vm.oVoucher = otherData.voucher || {};
		vm.mode = otherData.mode;
		if(vm.mode === 'edit' || vm.mode === 'view' || (vm.mode === 'add' && (vm.oVoucher.costCategory && vm.oVoucher.costCategory.length)))
			prepareData(vm.oVoucher)
		vm.oFilter = {};
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function prepareData(oVoucher){
		oVoucher.costCategory.forEach(obj=>{
			obj.center.forEach(obj2=>{
				if(obj2.centerId && obj2.name){
					obj2.centerId = {_id: obj2.centerId, name: obj2.name};
				}
			})
		})
	}

	function addCenter(index){
    vm.oVoucher.costCategory[index].center.push({});
	}

	function add(){
		vm.oVoucher.costCategory = vm.oVoucher.costCategory || [];
		vm.oVoucher.costCategory.push({category: vm.category.name,categoryId: vm.category._id, center: [{}]})
		vm.category = undefined;

	}

	function edit(selectedRow){

		vm.aCenter = vm.aCenter || [];
		vm.aCenter.push(...selectedRow.center);
		vm.categoryName = selectedRow.category;
	}

	function getCostCategory(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				accountingService.getCostCategory(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getCostCenter(viewValue, _id) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				if(!_id)
					return;

				let req = {
					name: viewValue,
					category: _id,
					no_of_docs: 10,
				};

				accountingService.getCostCenter(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function prepareQuery(oVoucher){
		oVoucher.costCategory.forEach(obj=>{
			obj.center.forEach(obj2=>{
				if(obj2.centerId && obj2.centerId._id){
					obj2.name = obj2.centerId.name;
					obj2.centerId = obj2.centerId._id;
				}
			})
		})
	}

	function submit() {

         let msg = false, obj = vm.oVoucher.costCategory
		for(let k in obj){
			obj[k].sum = 0;
			if(obj.hasOwnProperty(k)) {
				for (let j in obj[k]['center'])
					obj[k].sum += (obj[k]['center'][j].amount || 0);
			}
			if(obj[k].sum > 0 && obj[k].sum != vm.oVoucher.amount){
				msg =  obj[k].category + ' Category amount should be equal to debit amount';
			}
		}

		if(msg)
			return swal('Warning', msg, 'error');


		prepareQuery(vm.oVoucher);

        let request = {...vm.oVoucher};

		if (request) {
			swal('success', 'Cost Category Added', 'success');
			$modalInstance.dismiss(request);
		}
	}

}
