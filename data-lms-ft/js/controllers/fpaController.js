materialAdmin
	.controller("fpaController", fpaController)
	.controller("fpaUpsertController", fpaUpsertController)
	.controller("fpaDedPopupController", fpaDedPopupController);


fpaController.$inject = [
	'$scope',
	'$state',
	'$stateParams',
	'billingPartyService',
	'DatePicker',
	'lazyLoadFactory',
	'stateDataRetain',
	'tripServices',
	'voucherService',
	'Vehicle',
	'Vendor'
];

fpaUpsertController.$inject = [
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
	'fpaMasterService',
	'growlService',
	'tripServices',
	'voucherService',
	'Vehicle',
	'Vendor'
];

function fpaController(
    $scope,
	$state,
	$stateParams,
	billingPartyService,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	voucherService,
    Vehicle,
	Vendor
) {

	let vm = this;
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.oFilter = {}; // initialize filter object
	vm.maxDate = new Date();


	// functions Identifiers
	vm.upsertFpaGr = upsertFpaGr;
	vm.getFpaGr = getFpaGr;
	vm.deleteFpaGr = deleteFpaGr;
	// vm.approve = approve;
	// vm.unapprove = unapprove;
	$scope.onStateRefresh = function () {
		getFpaGr();
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
				'FPA DATE',
				'FPA NO',
				'Associate Name',
				'TOTAL FREIGHT',
				'Advice Amount',
				'TOTAL Deduction',
				'Factor',
				'vehicle No',
				'Created At',
				'Created By',
			]
		};
		vm.tableHead = [
			{
				'header': 'FPA DATE',
				'bindingKeys': 'fpa.date',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'FPA NO',
				'bindingKeys': 'fpa.refNo',
			},
			{
				'header': 'Associate Name',
				'bindingKeys': 'fpa.vndrName'
			},
			{
				'header': 'TOTAL AMOUNT',
				'bindingKeys': 'totalAmount'
			},
			{
				'header': 'TOTAL FREIGHT',
				'bindingKeys': 'totalFreight'
			},
			{
				'header': 'Advice Amount',
				'bindingKeys': 'fpa.amt'
			},
			{
				'header': 'TOTAL Deduction',
				'bindingKeys': 'fpa.dedAmt'
			},
			{
				'header': 'Factor',
				'bindingKeys': 'fpa.factor',
			},
			{
				'header': 'vehicle No',
				'bindingKeys': 'vehicle_no',
			},
			{
				'header': 'Created At',
				'bindingKeys': 'fpa.createdAt',
				'date': 'dd-MMM-yyyy',
			},
			{
				'header': 'Created By',
				'bindingKeys': 'fpa.createdBy'
			}
		];
	})();

	// Actual Functions
	function upsertFpaGr(type = 'add') {
		if (type == 'add') {
			stateDataRetain.go('booking_manage.fpaUpsert', {
				data: {
					type
				}
			});
		} else if (type == 'edit') {

			if (Array.isArray(vm.aSelectedFpaGr)) {
				if (vm.aSelectedFpaGr.length !== 1)
					return swal('Warning', 'Please Select Single row', 'warning');
			} else if (!vm.aSelectedFpaGr._id)
				return swal('Warning', 'Please Select Single row', 'warning');

			let selectedFpaGr = Array.isArray(vm.aSelectedFpaGr) ? vm.aSelectedFpaGr[0] : vm.aSelectedFpaGr;

			stateDataRetain.go('booking_manage.fpaUpsert', {
				data: {
					selectedFpaGr,
					type
				}
			});
		}
	}

	function deleteFpaGr() {

		if (Array.isArray(vm.aSelectedFpaGr)) {
			if (vm.aSelectedFpaGr.length !== 1)
				return swal('Warning', 'Please Select Single row', 'warning');
		} else if (!vm.aSelectedFpaGr._id)
			return swal('Warning', 'Please Select Single row', 'warning');

		let selectedFpaGr = Array.isArray(vm.aSelectedFpaGr) ? vm.aSelectedFpaGr[0] : vm.aSelectedFpaGr;

		if(selectedFpaGr.fpa && selectedFpaGr.fpa.vch) {


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
						tripServices.deleteFpa({_id: selectedFpaGr.fpa.vch}, onSuccess, onFailure);

						function onSuccess(res) {
							swal('Success', res.data.message, 'success');
							getFpaGr();
						}

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}
					}
				});
		}else{
			return swal('Warning', 'Fpa Voucher not found', 'warning');
		}
	}

	function prepareFilter() {
		var filter = { source: 'GR', dateType: "grDate", gr_type : {$ne: 'Trip Memo'}};

		filter['fpa.refNo'] = {$exists: true};

		if (vm.oFilter.from) {
			filter.from = moment(vm.oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if (vm.oFilter.to) {
			filter.to = moment(vm.oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}
		if (vm.oFilter.grNumber) {
			filter.grNumber = vm.oFilter.grNumber;
		}
		if (vm.oFilter.fpaNo) {
			filter['fpa.refNo'] = vm.oFilter.fpaNo;
		}

		filter.sort = {'fpa.date': -1};
		filter.skip = vm.lazyLoad.getCurrentPage();
		filter.no_of_docs = 20;


		return filter;
	}

	// Get Dues Bill from backend
	function getFpaGr(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let oFilter = prepareFilter();
		if(oFilter.from && oFilter.to)
			oFilter.dateType = 'fpa.date';


		tripServices.getAllGRItem(oFilter, function (res) {
			if (res && res.data && res.data.data) {
				res = res.data.data;
				vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
			}
		});
	}

	// function unapprove() {
	// 	billsService.purchaseBillUnapprove({
	// 		_id: vm.aSelectedFpaGr._id
	// 	}, function (res) {
	// 		swal('Success', res.message, 'success');
	// 	});
	// }
	//
	// function approve() {
	// 	billsService.purchaseBillApprove({
	// 		_id: vm.aSelectedFpaGr._id
	// 	}, function (res) {
	// 		swal('Success', res.message, 'success');
	// 	});
	// }


}


function fpaUpsertController(
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
	fpaMasterService,
	growlService,
	tripServices,
	voucherService,
	Vehicle,
	Vendor

) {
	// object Identifiers
	var vm = this;
	vm.filter = {};
	vm.myFilter = {};
	vm.oVoucher = {};
	vm.FpaRate = [];

	// functions Identifiers
	vm.getGr = getGr;
	vm.getAllBranch = getAllBranch;
	vm.getAllBillingParty = getAllBillingParty;
	vm.getAllVehicle = getAllVehicle;
	vm.getAutoStationaryNo = getAutoStationaryNo;
	vm.getRefNo = getRefNo;
	vm.getAllAccount = getAllAccount;
	vm.getVendorName = getVendorName;
	vm.onVendorSelect = onVendorSelect;
	vm.onRefNoSelect = onRefNoSelect;
	vm.onBranchSelect = onBranchSelect;
	vm.prepareRefFilter = prepareRefFilter;
	vm.applyDeduction = applyDeduction;
	vm.getAccount = getAccount;
	vm.onSelect = onSelect;
	vm.refreshDeduction = refreshDeduction;
	vm.calculateAmount = calculateAmount;
	vm.addDeduction = addDeduction;
	vm.removeDeduction = removeDeduction;
	vm.DeductionConfig = DeductionConfig;
	vm.submit = submit;

	// INIT functions
	(function init() {
		vm.aItems = [];
		vm.totReceivedAmount = 0;
		vm.showDelete = false;
		vm.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
		// vm.aDeductionType = ['TDS','Insurance','Operation Charge'];
		vm.aDeductionType= [
			{
				name: 'TDS',
				value: 'tdsDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Insurance',
				value: 'insuranceDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Shortage Charges',
				value: 'shortageDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			},
			{
				name: 'Operation Charges',
				value: 'operationDeduction',
				a1: 'Deduction',
				a2: '$vendor'
			}];

		 vm.defAcc = $scope.$configs.client_allowed.filter(o => o.clientId === $scope.selectedClient)[0];
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];
		if(vm.defAcc && vm.defAcc.vDealPurAcc){
			vm.oVoucher.drAccount = {
				_id: vm.defAcc.vDealPurAcc,
				name: vm.defAcc.vDealPurAccName
			};
		}
		vm.mode = 'add';
		if ($stateParams.data) {
			vm.selectedFpaGr = $stateParams.data.data.selectedFpaGr;
			vm.mode = $stateParams.data.data.type.toLowerCase();
		}
		if(vm.mode === 'edit'){
			vm.filter.refNo = vm.selectedFpaGr.fpa.refNo;
			prepareRefFilter();
		}


	})();

	// Actual Functions

	function prepareFilterObject() {
		let oFilter = {};

		if (vm.myFilter.vehicleNo) {
			oFilter.vehicle = vm.myFilter.vehicleNo._id;
			vm.vehicleNo = vm.myFilter.vehicleNo.vehicle_reg_no;
		}
		if (vm.myFilter.branch) {
			oFilter.branch  = vm.myFilter.branch._id;
		}
		if (vm.myFilter.billingParty) {
			oFilter.billingParty = vm.myFilter.billingParty._id;
		}
		if (vm.myFilter.from_date) {
			oFilter.from = moment(vm.myFilter.from_date, 'DD/MM/YYYY').toISOString();
			vm.from_date = vm.myFilter.from_date;
		}
		if (vm.myFilter.to_date) {
			oFilter.to = moment(vm.myFilter.to_date, 'DD/MM/YYYY').toISOString();
			vm.to_date = vm.myFilter.to_date;
		}

		if(vm.oVoucher.crAccount && vm.oVoucher.crAccount._id){
			oFilter.vehicle_query = oFilter.vehicle_query ? oFilter.vehicle_query : {};
			oFilter.vehicle_query.vendor_id = vm.oVoucher.crAccount._id;
		}
		oFilter.dateType = "grDate";
		oFilter['fpa.refNo'] = {$exists: false};
		oFilter.skip = 1;
		oFilter.no_of_docs = 15;

		return oFilter;
	}

	function getGr(){
		// if(!vm.myFilter.vehicleNo)
		// 	return swal('Warning', 'Vehicle no required', 'warning');

		let request = prepareFilterObject();
		request['billingParty.clientId'] =  $scope.selectedClient;

		tripServices.getAllGRItem(request, success, failure);

		function success(res) {
			if(res.data && res.data.data && res.data.data.data.length) {
				res.data.data.data.forEach(item => {
					if(!vm.aItems.find(o => o.grNumber === item.grNumber)) {
						item.factor = vm.FpaRate.length && vm.FpaRate[0].rate || Number(vm.factor) || 0;
						vm.aItems.push(item);
					}
				});

			}else {
				swal('Warning', 'No Gr Found', 'warning');
			}
		}

		function failure(res) {
			swal('Some error with GET GR.', '', 'error');
		}
	}

	function prepareRefFilter() {
		if (!vm.filter.refNo)
			return;

		vm.aItems = [];
		vm.oVoucher = {};
		let request = {
			skip: 1
		};
		if (vm.filter.refNo)
			request.refNo =  vm.filter.refNo;


		tripServices.getFpa(request, success, failure);

		function success(response) {
			if (response && response.data && response.data.data) {
				vm.showDelete = true;
				vm.noRefNoFound = false;
				vm.oVoucher = response.data.data[0];
				if(vm.oVoucher.branch)
					vm.billBookId = vm.oVoucher.branch.fpaBook ? vm.oVoucher.branch.fpaBook.map(o => o.ref) : '';
				if(vm.oVoucher.ledgers) {
					vm.oVoucher.ledgers.forEach(item => {

						if (item.cRdR == 'CR') {
							vm.oVoucher.crAccount = {account :{_id: item.account, name: item.lName}};
						}
						else if (item.cRdR == 'DR') {
							vm.oVoucher.drAccount = {_id: item.account, name: item.lName};
							vm.totReceivedAmount = item.amount;
						}
					});
				}
				if (vm.oVoucher && vm.oVoucher.gr) {
					vm.vendor_id = vm.oVoucher.gr[0].fpa.vndr;
					vm.oVoucher.gr.forEach(item => {
						if (item.fpa) {
							item.amt = item.fpa.amt;
							item.rmk = item.fpa.rmk;
							item.factor = item.fpa.factor;
							item.dedAmt = item.fpa.dedAmt;
							item.linkMr = item.fpa.linkMr;
						}
						if(item.fpa.deduction) {
							for (let k in item.fpa.deduction) {
								if (item.fpa.deduction.hasOwnProperty(k)) {
									let val = item.fpa.deduction[k];
									if(val){
										item.aDeduction = item.aDeduction || [];
										val.from = {_id: val.from, name: val.fromName}
										let fIdx = vm.aDeductionType.findIndex(oType => oType.name === val.typ);
										val.typ = vm.aDeductionType[fIdx];
										item.aDeduction.push(val);
									}
								}
							}
						}
						vm.aItems.push(item);
						if(item.fpa.vndr)
							vm.oVoucher.crAccount._id = item.fpa.vndr;
							vm.oVoucher.crAccount.name = item.fpa.vndrName;
					});
				}
				refreshDeduction();
			}
			else
				swal('Error', 'No Data Found', 'error');
		}

		function failure(res) {
			vm.noRefNoFound = true;
			swal('Error', res.data.message, 'error');
		}
	}

	function DeductionConfig(type, oDeduction) {
		// let oType = vm.aDeductionType.find(obj=> obj.name === type);
		for (let key in vm.defAcc.fpaGr) {
			if (vm.defAcc.fpaGr.hasOwnProperty(key)) {
				if (key === type.value) {
					oDeduction.from = {
						_id: vm.defAcc.fpaGr[key]._id,
						name: vm.defAcc.fpaGr[key].name
					};
				}
			}
		}
	}

	function onSelect(item){
		item.aDeduction = item.aDeduction || [];
		// if(!item.aDeduction.length)
		// 	item.aDeduction.push({});
	}

	function onVendorSelect(vendor){
		if(vendor && vendor._id)
			getFpaRate()
	}

	function getFpaRate(){
		if(vm.oVoucher.date && vm.oVoucher.crAccount) {
			let oFilter = {
				vendor: vm.oVoucher.crAccount._id,
				type: 'Commission',
				date: moment(vm.oVoucher.date, 'DD/MM/YYYY').toISOString(),
			}

			fpaMasterService.get(oFilter, onSuccess, onFailure);

			// Handle success response
			function onSuccess(response) {
				if(response.data && response.data.data)
				vm.FpaRate = response.data.data;
			}

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				swal('Error!', 'Message not defined', 'error');
			}
		}

	}

	function addDeduction(selectedGr) {
		if(!selectedGr)
			return;
		selectedGr.aDeduction = selectedGr.aDeduction || [];
		selectedGr.aDeduction.push({});
		refreshDeduction();

	}

	function removeDeduction(selectedGr, index) {
		if(!selectedGr)
			return;
		selectedGr.dedAmt -= selectedGr.aDeduction[index].amount;
		selectedGr.aDeduction.splice(index, 1);
		// calculateSummary();
	}

	function refreshDeduction() {
		let aDeductionConstant = vm.aDeductionType;
		vm.aItems.forEach(oItem => {
			oItem.aDeduction = oItem.aDeduction || [];
			oItem.aDeduction.forEach(oDed => {
				oDed.aDeductionTypeConstant = aDeductionConstant.filter(oConstDed => !oItem.aDeduction.find(oNestedDed => oNestedDed.typ != oDed.typ ? oNestedDed.typ === oConstDed.name : false));
			});
		});
	}

	function calculateAmount() {
		vm.aItems.forEach(oItem => {
			oItem.aDeduction = oItem.aDeduction || [];
			oItem.dedAmt = 0;
			oItem.aDeduction.forEach(oDed => {
				oItem.dedAmt += oDed.amount;
			});
		});
	}

	function applyDeduction(){
		if(typeof vm.selectedIndex === 'undefined' || !vm.aItems[vm.selectedIndex])
			return swal('Warning', 'Select a Gr to add deduction', 'warning');

		$uibModal.open({
			templateUrl: 'views/fpa/fpaDeductionPopUp.html ',
			controller: ['$scope', '$uibModalInstance', "selectedGr", fpaDedPopupController],
			controllerAs: "vm",
			resolve: {
				selectedGr: () => {
					return vm.aItems[vm.selectedIndex];
				}
			}
		});
	}

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


				if(vm.aUserBranch && vm.aUserBranch.length){
					req._ids = [];
					vm.aUserBranch.forEach(obj=>{
						if(obj.write)
							req._ids.push(obj._id)
					});
					if(!(req._ids && req._ids.length)) {
						return
					}else {
						req._ids = JSON.stringify(req._ids);
					}
				}

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

	function getAllVehicle(viewValue, _id) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {
				req = {
					vehicle_no:viewValue,
					vendor_id : _id || vm.vendor_id,
				};
				if ($scope.$configs.clientOps) {
					req.cClientId =  $scope.$configs.clientOps;
				}else {
					req.cClientId =  $scope.selectedClient;
				}

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

	function getAllBillingParty(viewValue) {
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

	function getAutoStationaryNo() {

		if(!(vm.billBookId && vm.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');


		if(vm.filter.date){
			swal('Error', 'Date is mandatory', 'error');
			return [];
		}

		let req = {
			"billBookId": vm.billBookId,
			"type": 'FPA',
			"auto": true,
			"sch": 'vch',
			useDate: moment(vm.filter.date, 'DD/MM/YYYY').startOf('day').toDate(),
			"status": "unused"
		};

		billBookService.getStationery(req, success);

		function success(response) {
			vm.aAutoStationary = response.data[0];
			vm.oVoucher.refNo = vm.aAutoStationary.bookNo;
			vm.selectedStationary = vm.aAutoStationary;
			// vm.preserveRefNo.push({name:vm.oVoucher.branch.name,refNo:vm.aAutoStationary.bookNo,selectedStationary: vm.aAutoStationary})
		}
	}

	function onBranchSelect() {
		vm.oVoucher.refNo = '';
		vm.billBookId = vm.oVoucher.branch.fpaBook ? vm.oVoucher.branch.fpaBook.map(o => o.ref) : '';

	}

	function getRefNo(viewValue) {

		if (!vm.billBookId)
			return;

		if(vm.filter.date){
			swal('Error', 'Date is mandatory', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.billBookId,
				type: 'FPA',
				useDate: moment(vm.filter.date, 'DD/MM/YYYY').startOf('day').toDate(),
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


	function onRefNoSelect(item, model, label) {
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

	function getVendorName(viewValue, category) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = { name: viewValue,deleted: false };
				req.ownershipType = "Associate";
				req['account.0'] = {$exists: true};
				req.fpa = true;
				if ($scope.$configs.clientOps) {
					req.cClientId =  $scope.$configs.clientOps;
				}else {
					req.cClientId =  $scope.selectedClient;
				}

				Vendor.getName(req, res => {
					if(res.data.data){
						for(let o of res.data.data){
							if(o.account &&  o.account._id) {
								o.account =  o.account.ref;
							}
						}
					}
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function prepareData() {
		vm.ledgers = [];
		vm.ledgers.push({
			account: vm.oVoucher.crAccount.account._id,
			lName: vm.oVoucher.crAccount.account.ledger_name || vm.oVoucher.crAccount.account.name,
			amount: Number(vm.totReceivedAmount),
			cRdR: 'CR',
			bills:[{
				amount: Number(vm.totReceivedAmount),
				billNo: vm.oVoucher.refNo,
				billType: 'New Ref',
			}]
		}, {
			account: vm.oVoucher.drAccount._id,
			lName: vm.oVoucher.drAccount.name,
			amount: Number(vm.totReceivedAmount),
			cRdR: 'DR',
		});
	}

	function prepareDeducLedger(obj){
		obj.ledgers = [];
		obj.ledgers.push({
			account: vm.oVoucher.crAccount.account._id,
			lName: vm.oVoucher.crAccount.account.ledger_name || vm.oVoucher.crAccount.account.name,
			amount: Number(obj.amount),
			cRdR: 'DR',
		}, {
			account: obj.from._id,
			lName: obj.from.name,
			amount: Number(obj.amount),
			cRdR: 'CR',
			bills:[{
				amount: obj.amount,
				billNo: vm.oVoucher.refNo,
				billType: 'Against Ref',
			}]
		});
	}

	function submit(formData) {

		console.log(vm.aItems);

		if (formData.$valid) {

			let oVch = {
				branch: vm.oVoucher.branch && vm.oVoucher.branch._id,
				refNo: vm.oVoucher.refNo,
				stationaryId: vm.selectedStationary && vm.selectedStationary._id || vm.oVoucher.stationaryId,
				date: vm.oVoucher.date,
				paymentMode: vm.oVoucher.paymentMode,
				paymentRef: vm.oVoucher.paymentRef,
				paymentDate: vm.oVoucher.date,
				narration: vm.oVoucher.narration ? vm.oVoucher.narration : 'Period from ' + vm.from_date + ' to ' + vm.to_date + ' vehicle no. '+ vm.vehicleNo,
			};

			oVch.date = moment(oVch.date, 'DD/MM/YYYY').toISOString();
			oVch.paymentDate = moment(oVch.date, 'DD/MM/YYYY').toISOString();

			if(!(vm.oVoucher.crAccount._id)) {
				vm.oVoucher.crAccount = undefined;
				return swal('Error', 'crAccount required ', 'error');
			}
			let isValid = true, msg = '';

			vm.aItems.forEach(items => {
				if (items.aDeduction && items.aDeduction.length) {
					for (let key in items.aDeduction) {
						if (items.aDeduction.hasOwnProperty(key)) {
							let ptr = items.aDeduction[key];
							let from = ptr.from && ptr.from._id || false;
							let typ = ptr.typ || false;
							let amount = ptr.amount || false;
							if (!from || !amount || !typ) {
								if(!from )
									msg = 'deduction account is not valid'
								if(!amount )
									msg = 'deduction amount is not valid'
								if(!typ )
									msg = 'deduction typ is not valid'
								isValid = false;
								break;
							}
						}
					}
				}
			});

			if(!isValid)
				return swal('Error', msg, 'error');



			vm.gr = [];
			vm.aItems.forEach(items => {
				items.fpaDeduction =  {};
				if(items.aDeduction && items.aDeduction.length){
					items.aDeduction.forEach(obj=>{
						prepareDeducLedger(obj);
						items.fpaDeduction[obj.typ.value] ={
							...obj,
							amount: obj.amount,
							typ: obj.typ.name,
						    from: obj.from._id,
							fromName: obj.from.name,
							to: vm.oVoucher.crAccount.account._id,
							toName: vm.oVoucher.crAccount.account.name,
							date: moment(vm.oVoucher.date, 'DD/MM/YYYY').toISOString(),
							remark: obj.remark,
							ledgers: obj.ledgers
						};
					})
				}
				let obj = {
					_id: items._id,
					rmk: items.rmk,
					amt: items.amt,
					vndr: /*items.fpa && items.fpa.vndr ||*/ vm.oVoucher.crAccount._id,
					vndrName: /*items.fpa && items.fpa.vndrName ||*/ vm.oVoucher.crAccount.name,
					factor: items.factor,
					dedAmt: items.dedAmt || 0,
					linkMr: items.linkMr,
					fpaDeduction: items.fpaDeduction,
				};
				vm.gr.push(obj);
			});
			prepareData();
			oVch.ledgers = vm.ledgers;
			oVch.gr = vm.gr;


			if(vm.oVoucher._id){
				oVch._id = vm.oVoucher._id;
				tripServices.editFpa(oVch, success, failure);
			}else{
				tripServices.addFpa(oVch, success, failure);
			}

			function success(response) {
				console.log(response);
				vm.oVoucher.refNo = undefined;
				vm.oVoucher.narration = undefined;
				vm.oVoucher.paymentMode = undefined;
				vm.oVoucher.crAccount = undefined;
				vm.oVoucher.paymentRef = undefined;
				vm.oVoucher.branch = undefined;
				vm.oVoucher._id = undefined;
				vm.myFilter = {};
				vm.aItems = [];
				vm.preserveRefNo = [];
				swal('', response.data.message, 'success');
			}

			function failure(err) {
				console.log(err);
				swal('', err.data.message, 'error');
			}

		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}

	}

}

function fpaDedPopupController(
	$scope,
	$uibModalInstance,
	selectedGr
) {

	let vm = this;

	vm.close = closeModal;
	vm.getDeduction = getDeduction;
	vm.applyPercent = applyPercent;
	vm.submit = submit;

	(function init(){
		vm.aDeductionType = ['Insurance','Operation Charge', 'TDS'];
		vm.dedType = selectedGr.dedType || vm.aDeductionType[0];
		vm.dedAmt = selectedGr.dedAmt || 0;
		vm.linkMr = selectedGr.linkMr || false;
	})();

	// function definition

	function closeModal(){
		$uibModalInstance.close();
	}

	function getDeduction() {
		// switch (vm.selectedDedType) {
		// 	case vm.aDeductionType[0]:
		// 		vm.appliedDeduction;
		// 		break;
		// }
	}

	function applyPercent(){

	}

	function submit(){
		selectedGr.dedAmt = vm.dedAmt;
		selectedGr.linkMr = vm.linkMr;
		selectedGr.dedType = vm.dedType;
		closeModal();
	}

}
