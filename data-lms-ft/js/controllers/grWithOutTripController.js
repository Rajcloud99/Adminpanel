materialAdmin
	.controller("grWithOutTripController", grWithOutTripController)
	.controller("upsertGrWithOutTripController", upsertGrWithOutTripController)
	.controller("billingPartyUpsertController", billingPartyUpsertController)
	//.controller("materialGroupModalController", materialGroupModalController)
	.controller("withoutTripBuiltyRendorCtrl", withoutTripBuiltyRendorCtrl);

grWithOutTripController.$inject = [
	'$stateParams',
	'$scope',
	'$uibModal',
	'$state',
	'$filter',
	'billingPartyService',
	'customer',
	'DatePicker',
	'branchService',
	'consignorConsigneeService',
	'DateUtils',
	'lazyLoadFactory',
	'stateDataRetain',
	'tripServices',
	'userService',
	'tableAccessDetailFactory',
];

upsertGrWithOutTripController.$inject = [
	'$modal',
	'$uibModal',
	'$parse',
	'$scope',
	'$stateParams',
	'$localStorage',
	'billBookService',
	'billingPartyService',
	'branchService',
	'CustomerRateChartService',
	'confService',
	'consignorConsigneeService',
	'customer',
	'DatePicker',
	'dateUtils',
	'formulaEvaluateFilter',
	'materialService',
	'otherUtils',
	'stateDataRetain',
	'tripServices',
	'Vehicle',
	'incentiveService',
	'cityStateService',
	'growlService'

];

billingPartyUpsertController.$inject = [
	'$modal',
	'$state',
	'$scope',
	'$timeout',
	'$uibModalInstance',
	'accountingService',
	'branchService',
	'billingPartyService',
	'billBookService',
	'customer',
	'DatePicker',
	'otherUtils',
	'selectedBillingParty',
	'sharedResource'
];

// materialGroupModalController.$inject = [
// 	'$rootScope',
// 	'$scope',
// 	'$interval',
// 	'$state',
// 	'$stateParams',
// 	'$uibModalInstance',
// 	'objMaterialGroup',
//     'materialService',
// 	'constants',
// 	'growlService',
// 	'otherUtils',
// 	'formValidationgrowlService',
// 	'$localStorage'
// ];

withoutTripBuiltyRendorCtrl.$inject = [
	$rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService
];

// function materialGroupModalController(
// 	$rootScope,
// 	$scope,
// 	$interval,
// 	$state ,
// 	$stateParams,
// 	$uibModalInstance,
// 	objMaterialGroup,
//     materialService,
// 	constants,
// 	growlService,
// 	otherUtils,
// 	formValidationgrowlService,
// 	$localStorage

// ){
// 	$scope.objMaterialGroup = objMaterialGroup ||{};

// 	if (otherUtils.isEmptyObject(objMaterialGroup)) {
// 		$scope.form_material_group = "Add";
// 	}else{
// 		$scope.form_material_group = "Edit";
// 	}

// 	$scope.closeModal = function() {
// 		$uibModalInstance.dismiss('cancel');
// 	};

// 	$scope.saveMaterialGroup = function(form) {

// 		function prepareDataMaterialGroupUpdate(){
// 			var objMaterialGroupCopy = angular.copy($scope.objMaterialGroup);
// 			objMaterialGroupCopy.last_modified_at = undefined;
// 			objMaterialGroupCopy.created_at = undefined;
// 			objMaterialGroupCopy.__v = undefined;
// 			objMaterialGroupCopy._id=undefined;
// 			objMaterialGroupCopy.clientId= undefined;
// 			return objMaterialGroupCopy;
// 		}
// 		function success(res) {
// 			if (res && res.status == "OK") {
// 				$uibModalInstance.close(res.message);
// 			} else {
// 				//$uibModalInstance.dismiss(res);
// 				growlService.growl(constants.default_error_message,"danger",3);
// 			}
// 		}

// 		function failure(res) {
// 			//$uibModalInstance.dismiss(res);
// 		}

// 		if(form.$valid){
// 			if ($scope.form_material_group =='Add'){
// 			   //$scope.objMaterialGroup.clientId = $localStorage.ft_data.userLoggedIn.clientId;
// 			   materialService.addMaterialGroup($scope.objMaterialGroup, success, failure);
// 			}else{
// 				materialService.updateMaterialGroup($scope.objMaterialGroup._id,
// 				prepareDataMaterialGroupUpdate(), success, failure);
// 			}
// 		} else {
// 		  $scope.mmsg = '';
// 		  $scope.materialGroupmsg = true;
// 		  $scope.mmsg = formValidationgrowlService.findError(form.$error);
// 		  setTimeout(function(){
// 			if($scope.materialGroupmsg){
// 			  $scope.$apply(function() {
// 				$scope.materialGroupmsg = false;
// 			  });
// 			}
// 		}, 7000);
//   }
// 	}
// }




function billingPartyUpsertController(
	$modal,
	$state,
	$scope,
	$timeout,
	$uibModalInstance,
	accountingService,
	branchService,
	billingPartyService,
	billBookService,
	customer,
	DatePicker,
	otherUtils,
	selectedBillingParty,
	sharedResource
) {
	//let vm = this;
	// object Identifiers
	$scope.obj = {};
	$scope.oBillingParty = {}; //initialize with Empty Object
	$scope.oBillingParty.branch = {};
	$scope.oBillingParty.billing_dates = new Date();
	$scope.operationType = 'Add'; // Defines Operation type for Showing on View
	$scope.DatePicker = angular.copy(DatePicker);


	// functions Identifiers
	$scope.closeModal = closeModal;
	$scope.getbillBooks = getbillBooks;
	$scope.getAllBranch = getAllBranch;
	$scope.getCustomer = getCustomer;
	$scope.getBpHoldAccount = getBpHoldAccount;
	$scope.addBillBook = addBillBook;
	$scope.removeBillBook = removeBillBook;
	$scope.submit = submit;
	$scope.onStateSelect = onStateSelect;

	$scope.selectAccountSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		selectionLimit: 1,
		smartButtonTextConverter: function(itemText, originalItem)
		{
			return itemText;
		}
	};

	$scope.selectSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		singleSelection:true,
		// selectionLimit: 1,
		smartButtonTextConverter: function(itemText, originalItem)
		{
			return itemText;
		}
	};


	// INIT functions
	(function init() {
		sharedResource.shareThisResourceWith($scope);
		// getCustomer();
		// getAllBranch();

		if(typeof selectedBillingParty !== 'undefined' && selectedBillingParty !== null){
			$scope.oBillingParty = angular.copy(selectedBillingParty); //initialize with param
			$scope.oBillingParty.account =  $scope.oBillingParty.account || {};
			$scope.oBillingParty.billBook = $scope.oBillingParty.billBook || {};
			$scope.oBillingParty.customer = $scope.oBillingParty.customer;
			if(!($scope.oBillingParty.billingBranch && $scope.oBillingParty.billingBranch.name))
				delete $scope.oBillingParty.billingBranch;
			$scope.oBillingParty.branch = $scope.oBillingParty.branch || {};
			if($scope.oBillingParty.cnBook && $scope.oBillingParty.cnBook[0]) {
				$scope.cnBook = [];
				$scope.cnBook.push(...$scope.oBillingParty.cnBook.map(o => ({
					name: o.name,
					_id: o.ref
				})));
			}else{
				$scope.cnBook = [];
			}

			if($scope.oBillingParty.isCustomer)
				$scope.isCustomer = $scope.oBillingParty.isCustomer;

			if($scope.oBillingParty.isConsignor)
				$scope.isConsignor = $scope.oBillingParty.isConsignor;

			if($scope.oBillingParty.isConsignee)
				$scope.isConsignee = $scope.oBillingParty.isConsignee;

			if(Array.isArray($scope.oBillingParty.billBook) && $scope.oBillingParty.billBook[0] && $scope.oBillingParty.billBook[0].ref){
				if($scope.oBillingParty.billBook.length === 1){
					$scope.oBillingParty.billBookObj = {};
					Object.assign($scope.oBillingParty.billBookObj, {
						_id: $scope.oBillingParty.billBook[0].ref,
						name: $scope.oBillingParty.billBook[0].name
					});
				}else{

					 $scope.oBillingParty.billBookData = $scope.oBillingParty.billBook.map(o => ({
					 	ref: o.ref,
					 	name: o.name,
					 	branch: {
					 		_id: o.branch,
					 		name: o.branchName
						}
					 }));

				}
			}

			if($scope.oBillingParty.billing_dates)
				$scope.oBillingParty.billing_dates = new Date($scope.oBillingParty.billing_dates);
			if(!selectedBillingParty.isAdd){
				$scope.operationType = 'Edit';
			}
		}

		if ($scope.$configs.clientOps) {
			$scope.oBillingParty.clientR =  $scope.$configs.clientOps;
		}else {
			$scope.oBillingParty.clientR =  $scope.selectedClient;
		}

		if($scope.oBillingParty && $scope.oBillingParty.withHoldAccount)
			$scope.showAccount = false;
		else
			$scope.showAccount = true;

		if((typeof $scope.oBillingParty.account === 'string' && $scope.oBillingParty.account.length > 0) || (typeof $scope.oBillingParty.account === 'object' && !otherUtils.isEmptyObject($scope.oBillingParty.account)))
			$scope.isAccountLinked = true;
		else
			$scope.isAccountLinked = false;

		try{
			if($scope.$configs.master.showAccount){

				// Get Account Masters
				$scope.getAccountMasters = function (input){

					if(input && input.length <= 2)
						return;

					var oFilter = {
						group: ['Customer'],
						name: input,
						no_of_docs: 10
					}; // filter to send
					accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

					// Handle failure response
					function onFailure(response) {

					}

					// Handle success response
					function onSuccess(response){
						$scope.aAccountMaster = response.data.data;
						if($scope.oBillingParty.account && $scope.oBillingParty.account._id && !$scope.aAccountMaster.find( o => o._id === $scope.oBillingParty.account._id))
							$scope.aAccountMaster.unshift($scope.oBillingParty.account);
					}
				};
				$scope.getAccountMasters();

				$scope.addNewAccount = function(type){
					var modalInstance = $modal.open({
						templateUrl: 'views/accounting/accountMasterUpsert.html',
						controller: 'accountMasterUpsertController',
						resolve: {
							'selectedAccountMaster': function () {
								return {
									'accountType' : 'Cash in Hand',
									'group': type ? [type] : ['Customer'],
									'name': $scope.oBillingParty.name,
									'isAdd': true
								};
							}
						}
					});

					modalInstance.result.then(function(response) {
						if(!type) {
							// if (response) {
							// 	$scope.aAccountMaster.push(response);
							// }
							$scope.isAccountLinked = true;

							$timeout(function () {
								$scope.isAccountLinked = false;
							});
						}

						console.log('close',response);
					}, function(data) {
						console.log('cancel');
					});
				};

				$scope.onDelinkAccount = function(type) {
					swal({
							title: 'Do you really want to delink this account?',
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
								accountingService.delink({
									masterSchema: 'billingparty',
									masterId: $scope.oBillingParty._id,
									acntId: type ? $scope.oBillingParty.withHoldAccount._id : $scope.oBillingParty.account._id,
									wasLinkedTo: $scope.oBillingParty.name,
									withHoldAccount: type ? true : false
								}, onSuccess, onFailure);

								function onSuccess(res) {
									swal('Success', res.message, 'success');
									$state.go('masters.billingParty', {}, { reload: true });
									$uibModalInstance.dismiss();
								}
								function onFailure(err) {
									swal('Error', err.message, 'error');
								}
							}
						});
				};
			}
		}catch(e){}
	})();


	function onStateSelect(item) {
		$scope.billingState = $scope.$constants.aGSTstates.find( o => o.state === item);
		if($scope.billingState) {
			$scope.oBillingParty.state_code = $scope.billingState.first_two_txn;
			$scope.oBillingParty.state_name_code = $scope.billingState.state_code;
		}
	}


	function getBpHoldAccount(viewValue, group) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 6,
					group: group
				};

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

	function addBillBook(obj) {

		let valid = true;

		($scope.oBillingParty.billBookData || []).forEach(o => {
			if(!o.branch._id)
				valid = false;
		});

		if(!obj.name || !valid)
			return;

		$scope.oBillingParty.billBookData = $scope.oBillingParty.billBookData || [];
		$scope.oBillingParty.billBookData.push({
			ref: obj._id,
			name: obj.name,
			branch: {}
		});
		$scope.oBillingParty.billBookObj = undefined;
	}

	function removeBillBook(index) {
		if($scope.oBillingParty.billBookData.length && typeof index === 'number' && index >= 0)
			$scope.oBillingParty.billBookData.splice(index, 1);
	}


	// Actual Functions
	$scope.getCnBooks = function(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let request = {
					name :{$regex:viewValue, $options:'i'},
					type: 'Credit Note',
					no_of_docs: 10,
				};

				billBookService.get(request, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data.data);
				}

				function oFail(response) {
					reject([]);
				}
			});
		} else
			return [];
	};

	$scope.onBookSelect = function(item){
		$scope.cnBook.push(item);
	};

	function getbillBooks(viewValue){

		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				var oFilter = {
					name: {$regex:viewValue, $options:'-i'},
					type: 'Bill',
					no_of_docs: 10
				}; // filter to send

				billBookService.get(oFilter, oSuc, oFail);

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

	function getAllBranch(inputModel) {
		let req = {
			no_of_docs: 10,
		};

		if(inputModel)
			req.name = inputModel;

		branchService.getAllBranches(req, success);

		function success(data) {
			$scope.aBranch = data.data;
			if($scope.oBillingParty.branch && $scope.oBillingParty.branch._id && !$scope.aBranch.find( o => o._id === $scope.oBillingParty.branch._id))
				$scope.aBranch.unshift($scope.oBillingParty.branch);
		}
	}

	function closeModal() {
		$uibModalInstance.dismiss();
	}


	$scope.getPercent = function (value) {
		if(value=='RCM'){
			$scope.oBillingParty.percent = '5';
		}
		else {
			$scope.oBillingParty.percent = '12';
		}

	};
	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
					status: "Active"
				};

				if($scope.$configs.clientOps){
					req.cClient = $scope.$configs.clientOps;
				}

				customer.getAllcustomers(req, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	$scope.getAllBranchSearch = function (viewValue) {
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

    //
    // function getCustomer(viewValue) {
		// function success(data) {
		// 	$scope.aCustomers = data.data;
		// }
		// let customerFilter = {
		// 	name: viewValue,
		// 	no_of_docs: 10,
		// 	status: "Active"
		// };
		// customer.getAllcustomers(customerFilter, success);
	// }

	// add or modify Billing Party
	function submit(formData) {
		console.log(formData);

		let billBook = [];
		let billingBranch = {};

		if(Array.isArray($scope.oBillingParty.billBookData))
			$scope.oBillingParty.billBookData.forEach(o => {
				if(o.branch && o.branch._id)
					billBook.push({
						ref: o.ref,
						name: o.name,
						branch: o.branch._id,
						branchName: o.branch.name
					});
			});
		else if($scope.oBillingParty.billBookObj) {
			billBook.push({
				ref: $scope.oBillingParty.billBookObj._id,
				name: $scope.oBillingParty.billBookObj.name
			});
		}
		if($scope.oBillingParty.billingBranch){
			billingBranch.refId = $scope.oBillingParty.billingBranch._id || $scope.oBillingParty.billingBranch.refId,
			billingBranch.name = $scope.oBillingParty.billingBranch.name
		}

		if(formData.$valid){
			var request = $scope.oBillingParty;
			request.billBook = billBook;
			request.billingBranch = billingBranch;
			request.percent = request.percent || 0;

			console.log('form is valid', request);
			if($scope.cnBook)
				request.cnBook = $scope.cnBook.map(o => ({
					name: o.name,
					ref: o._id
				}));

			if(request.configs && (!(request.configs.GR && request.configs.RATE_CHART)))
				delete request.configs;

			if($scope.operationType === 'Add' && request.isCustomer){
				delete request.customer;
			}


			// call respective service on based on operation type
			if($scope.operationType === 'Add'){
				billingPartyService.addBillingParty(request, onSuccess, onFailure);
			}else if($scope.operationType === 'Edit'){
				delete request.__v;
				billingPartyService.updateBillingParty(request, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg,'error');
			}

			// Handle success response
			function onSuccess(response){

				var msg = response.message;
				if($scope.operationType === 'Add')
					msg = msg || "Data Added Successfully";
				else if($scope.operationType === 'Edit')
					msg = msg || "Data Updated Successfully";

				swal('Success',msg,'success');
				$uibModalInstance.close(response.data);
			}
		}else{
		swal('Error', 'All Mandatory Fields are not filled', 'error');
	}
	}


}

function grWithOutTripController(
	$stateParams,
	$scope,
	$uibModal,
	$state,
	$filter,
	billingPartyService,
	customer,
	DatePicker,
	branchService,
	consignorConsigneeService,
	DateUtils,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	userService,
	tableAccessDetailFactory,
) {

	let vm = this;

	vm.getAllGR = getAllGR;
	vm.getCustomer = getCustomer;
	vm.getBilling = getBilling;
	vm.getAllBranch = getAllBranch;
	vm.getConsignor = getConsignor;
	vm.getConsignee = getConsignee;
	vm.grOpperation = grOpperation;
	vm.mapGrIntoTrip = mapGrIntoTrip;
	vm.printBuilty = printBuilty;

	// this function trigger on state refresh
	vm.onStateRefresh = function () {
		vm.getAllGR();
	};


	// init
	(function init() {

		if (stateDataRetain.init($scope, vm))
			return;

		vm.tableAccessDetail = tableAccessDetailFactory;

		let pageNameConst = 'Booking_Management_GR';
		let tableNameConst = 'GR';
		vm.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
		vm.aGrStatus = ['Gr Generated', 'Gr Not Generated'];
		if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
			Array.prototype.push.apply(vm.aCategory, $scope.$configs.customer.category);
		}

		let oFoundTable = $scope.$tableAccess.find(oTable => oTable.pages === pageNameConst && oTable.table === tableNameConst);
		let visible = oFoundTable ? oFoundTable.visible : vm.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let access = oFoundTable ? oFoundTable.access : vm.tableAccessDetail[pageNameConst][tableNameConst + 'Column'];
		let oBinding = vm.tableAccessDetail[pageNameConst][tableNameConst];

		vm.aBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.visibleDownload = visible.map(str => oBinding[str].header);
		vm.oFoundTableId = false;
		if (oFoundTable && oFoundTable._id)
			vm.oFoundTableId = oFoundTable._id;

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

		vm.oFilter = {};
		vm.DatePicker = angular.copy(DatePicker);
		vm.lazyLoad = lazyLoadFactory(); // init lazyload
		vm.selectedTrip = [];
		vm.selectType = 'index';
		vm.aType = ["Shipment No", "Invoice No", "LoadRef No"];
		vm.aBill = ["Billed", "Un billed", "Non Billable", "All"];
		vm.aPod = ["Received", "Not Received", "All"];
		vm.aAcknowledged = ["Acknowledged", "Not Acknowledged", "All"];

	})();

	// Actual Function

	function onFromDateChange() {
		if(vm.oFilter.to && vm.oFilter.from > vm.oFilter.to)
			vm.oFilter.to = Math.min(vm.oFilter.from, new Date());
	}

	function grOpperation(OperationType) {
		if(OperationType === 'edit'){
		stateDataRetain.go('booking_manage.upsertGrWithOuttrip', {
			mode: OperationType,
			gr: vm.selectedTrip
		}, 'gr');
		}else if(OperationType === 'add'){
			stateDataRetain.go('booking_manage.upsertGrWithOuttrip', {
				mode: OperationType,
				gr: {}
			}, 'gr');
		}
	}

	function mapGrIntoTrip() {
		let isCancelledGr = false;
		if(vm.selectedTrip && vm.selectedTrip.moneyReceipt){
			vm.selectedTrip.moneyReceipt.collection.forEach(obj=>{
				if(obj.paymentId)
					isCancelledGr = true;
			});
		}
		if(isCancelledGr)
			return swal('Error', 'Can`t Map Gr Payment link to MR', 'error');

		var modalInstance = $uibModal.open({
			templateUrl: 'views/grWithOutTrip/mapGrPopUp.html',
			controller: ['$scope', '$uibModalInstance', 'DatePicker', 'lazyLoadFactory', 'stateDataRetain', 'tripServices', 'thatGr', mapGrPopupController],
			controllerAs: 'mgVm',
			resolve: {
				thatGr: function () {
					return vm.selectedTrip;
				}
			}
		});
	}

	function prepareFilterObject(isPagination) {
		var myFilter = {source: 'GR', dateType: "grDate", gr_type : {$ne: 'Trip Memo'}, trip : {$exists: false }};


		if (vm.oFilter.grNumber) {
			myFilter.grNumber = vm.oFilter.grNumber;
		}

		if (vm.oFilter.grDocType) {
			myFilter.grDocType = vm.oFilter.grDocType;
		}

		if (vm.oFilter.dateType) {
			myFilter.dateType = vm.oFilter.dateType;
		}


		if (vm.oFilter.grCustomer) {
			myFilter.customer = vm.oFilter.grCustomer._id;
		}

		if (vm.oFilter.grConsignor) {
			myFilter.consignor = vm.oFilter.grConsignor._id;
		}

		if (vm.oFilter.grConsignee) {
			myFilter.consignee = vm.oFilter.grConsignee._id;
		}

		if (vm.oFilter.billingParty) {
			myFilter['billingParty._id'] = vm.oFilter.billingParty._id;
		}

		if (vm.oFilter.route_id) {
			myFilter.route_id = vm.oFilter.route_id._id;
		}
		if (vm.oFilter.branch) {
			myFilter.branch = vm.oFilter.branch._id;
		}else if (vm.aBranch && vm.aBranch.length) {
			myFilter.branch = [];
			vm.aBranch.forEach(obj => {
				if(obj.read)
					myFilter.branch.push(obj._id);
			});
		}
		if (vm.oFilter.from) {
			myFilter.from = new Date((vm.oFilter.from).setHours(0, 0, 0));
		}
		if (vm.oFilter.to) {
			myFilter.to = new Date((vm.oFilter.to).setHours(23, 59, 59));
		}
		if (vm.oFoundTableId) {
			myFilter.tableId = vm.oFoundTableId;
		} else {
			myFilter.tableId = false;
		}

		myFilter.sort = {grNumber: 1};

		myFilter.no_of_docs = 5;
		myFilter.skip = vm.lazyLoad.getCurrentPage();

		return myFilter;
	}

	function getAllGR(isGetActive) {
		vm.selectType = 'index';

		if (!vm.lazyLoad.update(isGetActive))
			return;

		if (vm.oFilter.dateType) {
			if (!(vm.oFilter.from && vm.oFilter.to)) {
				swal('warning', 'Please fill From and To Date', 'warning');
				return;
			}
		}

		if (vm.oFilter.from && vm.oFilter.to) {
			if(vm.oFilter.from>vm.oFilter.to) {
				return swal("warning", "To date should be greater than From date", "warning");
			}
		}

		let oFilter = prepareFilterObject();
		tripServices.getAllGRItem(oFilter, success, fail);

		function success(response) {
			if (response && response.data) {

				response = response.data;

				vm.lazyLoad.putArrInScope.call(vm, isGetActive, response.data);
				// vm.tableApi && vm.tableApi.refresh();
			}
		}

		function fail(response) {
			//$uibModalInstance.dismiss(res);
		}
	}

	function getConsignor(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				name: viewValue
			};
			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignee(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				name: viewValue
			};
			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getCustomer(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				customer.getCustomerSearch(viewValue, res => {
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getBilling(viewValue) {
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

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};
				if (vm.aBranch && vm.aBranch.length) {
					let branch = [];
					vm.aBranch.forEach(obj => {
						if(obj.read)
							branch.push(obj);
					});
					resolve(branch);
				} else
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

	function printBuilty() {
		if (vm.selectedTrip && vm.selectedTrip._id) {
			console.log(vm.selectedTrip);
			var oFilter = {_id: vm.selectedTrip._id};
			var modalInstance = $uibModal.open({
				templateUrl: 'views/bills/builtyRender.html',
				controller: 'withoutTripBuiltyRendorCtrl',
				resolve: {
					thatTrip: oFilter
				}
			});
		}
		;
	};

}

function withoutTripBuiltyRendorCtrl($rootScope, $scope, clientConfig, $uibModalInstance, thatTrip, clientService){
	$scope.aTemplate = clientConfig.getFeature('GR', 'GR_WT_Templates') ? clientConfig.getFeature('GR', 'GR_WT_Templates') : [];

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function success(res) {
		$scope.html = angular.copy(res.data);
	}

	function fail(res) {

	}

	$scope.getGR = function (templateKey) {
		var oFilter = angular.copy(thatTrip);
		if (templateKey && (templateKey != 'default')) {
			oFilter.builtyName = templateKey;
		}
		clientService.grWithOutTripBuilty(oFilter, success, fail);
	};

	if ($scope.aTemplate && !($scope.aTemplate.length > 1)) {
		$scope.getGR($scope.aTemplate[0].key);
	} else {
		$scope.templateKey = $scope.aTemplate[0];
		$scope.getGR($scope.aTemplate[0].key);
	}

	$scope.printDiv = function (elem) {
		var contents = document.getElementById(elem).innerHTML;
		var frame1 = document.createElement('iframe');
		frame1.name = 'frame1';
		frame1.style.position = 'absolute';
		frame1.style.top = '-1000000px';
		document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write('<html><head><title></title>');
		frameDoc.document.write('</head><body>');
		frameDoc.document.write(contents);
		frameDoc.document.write('</body></html>');
		frameDoc.document.close();
		setTimeout(function () {
			window.frames['frame1'].focus();
			window.frames['frame1'].print();
			document.body.removeChild(frame1);
		}, 500);
	};
}


function upsertGrWithOutTripController(
	$modal,
	$uibModal,
	$parse,
	$scope,
	$stateParams,
	$localStorage,
	billBookService,
	billingPartyService,
	branchService,
	CustomerRateChartService,
	confService,
	consignorConsigneeService,
	customer,
	DatePicker,
	dateUtils,
	formulaEvaluateFilter,
	materialService,
	otherUtils,
	stateDataRetain,
	tripServices,
	Vehicle,
	incentiveService,
	cityStateService,
	growlService
) {
	let vm = this;

	// function identifier
	vm.calculateIncentive = calculateIncentive;
	vm.calculateRate = calculateRate;
	vm.clearIncentive = clearIncentive;
	vm.calday = calday;
	vm.getConsignee = getConsignee;
	vm.getConsignor = getConsignor;
	vm.getBillingParty = getBillingParty;
	vm.getSuppIncentive = getSuppIncentive;
	vm.updateIncentive = updateIncentive;
	vm.clearSuppIncentive = clearSuppIncentive;
	vm.calculateGst = calculateGst;
	vm.getCustomers = getCustomers;
	vm.getBillBookNo = getBillBookNo;
	vm.getAllBranch = getAllBranch;
	vm.getVname = getVname;
	vm.getRates = getRates;
	vm.onCustomerSelect = onCustomerSelect;
	vm.onBillingPartySelect = onBillingPartySelect;
	vm.SelectRateChart = SelectRateChart;
	vm.setPaymentBasis = setPaymentBasis;
	vm.updateInvoiceMaterialObj = updateInvoiceMaterialObj;
	vm.getRoute = getRoute;
	vm.upsertBillingParty = upsertBillingParty;
	vm.upsertConsignorConsignee = upsertConsignorConsignee;
	vm.addMaterialGroup = addMaterialGroup;
	vm.getAllMaterialGroups = getAllMaterialGroups;
	vm.getARBranch = getARBranch;
	vm.submit = submit;
	vm.setTime = setTime;
	vm.getGstType = getGstType;
	vm.getSources = getSources;
	vm.aStates = otherUtils.getState();

	(function init() {

		if($scope.$configs.GR.config)
			vm.__FormList = $scope.$configs.GR.config;

		vm.arMaxDate = new Date(new Date().setDate(new Date(new Date()).getDate() + 7));
		vm.aUserBranch = $scope.$configs.branchAccessCtl && $scope.$user.branch || [];

		vm.material = {};
		vm.aGstType = ['IGST', 'CGST & SGST'];
		vm.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			selectionLimit: 1,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};
		vm.__RateChart = $scope.$constants.modelConfigs.RATE_CHART;
		vm.DatePicker = angular.copy(DatePicker);
		vm.selectMaterialEvents = {
			onSelectionChanged: function () {}
		};

		if ($stateParams.data) {
			// getGrById( $stateParams.data && $stateParams.data.gr);
			vm.selectedGr = angular.copy($stateParams.data && $stateParams.data.gr);
			vm.mode = $stateParams.data && $stateParams.data.mode && $stateParams.data.mode.toLowerCase();

			if (vm.selectedGr.trip && vm.selectedGr.trip._id)
				getTrip(vm.selectedGr.trip._id);

		} else {
			stateDataRetain.back('booking_manage.grWithOutTrip');
			return;
		}

		// some basic operation based on mode the state is rendered
		getFormList();

		if (vm.mode === 'add' || vm.mode === 'edit') {
			vm.selectedGr.customer = vm.selectedGr.customer;
			vm.selectedGr.billingParty = vm.selectedGr.billingParty;
			vm.selectedGr.consignor = vm.selectedGr.consignor || vm.selectedGr.consigner;
			vm.selectedGr.invoices = Array.isArray(vm.selectedGr.invoices) ? vm.selectedGr.invoices : [];
			vm.selectedGr.eWayBills = Array.isArray(vm.selectedGr.eWayBills) ? vm.selectedGr.eWayBills : [];
			vm.selectedGr.detention = vm.selectedGr.loadingDetention || 0;
			vm.selectedGr.payment_type = vm.selectedGr.payment_type;
			vm.selectedGr.payment_basis = vm.selectedGr.payment_basis;
			// if(vm.selectedGr.branch && typeof vm.selectedGr.branch === 'object' && vm.selectedGr.branch._id)
			// 	vm.selectedGr.branch = vm.selectedGr.branch._id;

			if(typeof vm.selectedGr.container != 'string')
				vm.selectedGr.container = '';


			vm.selectedGr.branch = vm.selectedGr.branch || {};
			vm.selectedGr.deduction = vm.selectedGr.deduction || {};
			vm.selectedGr.charges = vm.selectedGr.charges || {};
			vm.selectedGr.pod = vm.selectedGr.pod || {};

			if (vm.selectedGr.pod.date)
				vm.selectedGr.pod.date = new Date(vm.selectedGr.pod.date);

			if (vm.selectedGr.pod.unloadingArrivalTime) {
				vm.selectedGr.pod.unloadingArrivalTime = new Date(vm.selectedGr.pod.unloadingArrivalTime);
				vm.unloadingArrivalTimeModel = new Date();
				vm.unloadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.unloadingArrivalTimeModel, vm.selectedGr.pod.unloadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingLoadingTime) {
				vm.selectedGr.pod.billingLoadingTime = new Date(vm.selectedGr.pod.billingLoadingTime);
				vm.billingLoadingTimeModel = new Date();
				vm.billingLoadingTimeModel = dateUtils.setHoursFromDate(vm.billingLoadingTimeModel, vm.selectedGr.pod.billingLoadingTime);
			}

			if (vm.selectedGr.pod.loadingArrivalTime) {
				vm.selectedGr.pod.loadingArrivalTime = new Date(vm.selectedGr.pod.loadingArrivalTime);
				vm.loadingArrivalTimeModel = new Date();
				vm.loadingArrivalTimeModel = dateUtils.setHoursFromDate(vm.loadingArrivalTimeModel, vm.selectedGr.pod.loadingArrivalTime);
			}

			if (vm.selectedGr.pod.billingUnloadingTime) {
				vm.selectedGr.pod.billingUnloadingTime = new Date(vm.selectedGr.pod.billingUnloadingTime);
				vm.billingUnloadingTimeModel = new Date();
				vm.billingUnloadingTimeModel = dateUtils.setHoursFromDate(vm.billingUnloadingTimeModel, vm.selectedGr.pod.billingUnloadingTime);
			}

			if (vm.selectedGr.grDate)
				vm.selectedGr.grDate = new Date(vm.selectedGr.grDate);


			// init function in form editable mode only
			// getAllBranch();
			getAllBranch();
			getMaterialGroup();
			// getRates();
		}

		if (vm.mode === 'add') {
			// let route = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
			vm.selectedGr.acknowledge = vm.selectedGr.acknowledge || {};
			if($scope.$configs.booking && $scope.$configs.booking.showRoute) {
				vm.selectedGr.acknowledge.source = vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source;
			} else {
				vm.selectedGr.acknowledge.source = vm.selectedGr.route && vm.selectedGr.route.source && vm.selectedGr.route.source.c;
			}
			if($scope.$configs.booking && $scope.$configs.booking.showRoute) {
				vm.selectedGr.acknowledge.destination = vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination;
			} else {
				vm.selectedGr.acknowledge.destination = vm.selectedGr.route && vm.selectedGr.route.destination && vm.selectedGr.route.destination.c;
			}
			vm.selectedGr.acknowledge.destinationState = vm.selectedGr.consignee ? vm.selectedGr.consignee.state : undefined;
			vm.selectedGr.acknowledge.routeDistance = vm.selectedGr.route && vm.selectedGr.route.route_distance;
			vm.gstPercentToApply = vm.selectedGr.billingParty && vm.selectedGr.billingParty.percent || '0';
			vm.selectedGr.payment_type = $scope.$constants.paymentType[1];
			getGstType();
			if (vm.selectedGr.consignee && vm.selectedGr.consignee.state) {
				vm.aStates.find(o => {
					if ((o.state).toLowerCase() == (vm.selectedGr.consignee.state).toLowerCase()) {
						vm.selectedGr.acknowledge.destinationState = o.state;
						return;
					}
				});
			}
		}

		if (vm.mode === 'edit') {
			if(vm.selectedGr && vm.selectedGr.trip && vm.selectedGr.trip.route_name && vm.selectedGr.acknowledge) {
				let [src, dest] = vm.selectedGr.trip.route_name.split('to').map(o => o.trim());
				vm.selectedGr.acknowledge.source = vm.selectedGr.acknowledge.source ? vm.selectedGr.acknowledge.source:src;
				vm.selectedGr.acknowledge.destination = vm.selectedGr.acknowledge.destination ? vm.selectedGr.acknowledge.destination:dest;
			}
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(obj => {
					if (obj.baseValueLabel) {
						obj.aCapacity = [];
						obj.aCapacity.push({label: obj.baseValueLabel, baseVal: obj.baseValue, rate: obj.rate});
					}
				})
			}

			vm.selectedGr.vehicle2 = vm.selectedGr.vehicle2;
			vm.gstPercentToApply = String(vm.selectedGr.iGST_percent || (vm.selectedGr.cGST_percent + vm.selectedGr.sGST_percent) || '0');
			if (vm.selectedGr.iGST_percent)
				vm.gstPercentType = 'IGST';
			else if (vm.selectedGr.cGST_percent || vm.selectedGr.sGST_percent)
				vm.gstPercentType = 'CGST & SGST';

			if (vm.selectedGr.grNumber) {
				if (vm.selectedGr.stationaryId) {
					vm.grNumberModel = {
						bookNo: vm.selectedGr.grNumber,
						_id: vm.selectedGr.stationaryId
					}
				} else {
					vm.grNumberModel = vm.selectedGr.grNumber;
				}
			}
			if (vm.selectedGr.grDate)
				calday();


			// vm.firstCall = true;
			setPaymentBasis();
		}

		// calculateIncentive();

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.charges.detentionLoading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionLoading) {
			vm.selectedGr.detentionLoading = vm.selectedGr.supplementaryBill.charges.detentionLoading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		if (vm.selectedGr.charges && vm.selectedGr.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.charges.detentionUnloading;
			if (vm.selectedGr.bill && vm.mode == 'edit')
				vm.isReadonly = true;
		} else if (vm.selectedGr.supplementaryBill && vm.selectedGr.supplementaryBill.charges && vm.selectedGr.supplementaryBill.charges.detentionUnloading) {
			vm.selectedGr.detentionUnloading = vm.selectedGr.supplementaryBill.charges.detentionUnloading;
			if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit')
				vm.isReadonly = true;
		}

		// setting form view mode i.e. to preview(readonly) to edit/add(editable)
		if($scope.$configs.GR.grAck && vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.status && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if (vm.selectedGr.fpa && vm.selectedGr.fpa.vch && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = true;
			vm.isReadonly = true;
		} else if ((vm.selectedGr.bill || (vm.selectedGr.provisionalBill && vm.selectedGr.provisionalBill.ref && vm.selectedGr.provisionalBill.ref.length)) && vm.mode == 'edit') {
			vm.supplyReadonly = false;
			vm.readonly = true;
		} else if (vm.selectedGr.supplementaryBillRef && vm.selectedGr.supplementaryBillRef.length && vm.mode == 'edit') {
			vm.supplyReadonly = true;
			vm.readonly = false;
			vm.isReadonly = false;
		} else {
			switch (vm.mode) {
				case 'add':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				case 'edit':
					vm.readonly = false;
					vm.isReadonly = false;
					vm.supplyReadonly = false;
					break;
				default:
					vm.readonly = true;
					vm.supplyReadonly = true;
					vm.isReadonly = true;
					break;
			}
		}

		applyCss();
	})();

	/*
	* Fetch RateChart on both case add/edit
	* Add -
	* if single RateChart
	* show that rate only
	* capacity dropdown = baselabel + config.aCapacity
	* else if multiple RateChart
	* capacity dropdown = baselabel + config.aCapacity
	*
	* Edit -
	* */


	// Actual Function

	// async function getGrById(viewValue) {
	//
	// 	let request = {
	// 		_id: viewValue._id,
	// 		skip: 1,
	// 		no_of_docs: 5,
	// 		populate: ["provisionalBill"],
	// 		source: "GR"
	// 	};
	//
	// 	 await tripServices.getAllGRItem(request, onSuccess, onFailure);
	//
	// 	// Handle failure response
	// 	function onFailure(response) {
	// 		console.log(response);
	//
	// 	}
	//
	// 	// Handle success response
	// 	function onSuccess(response) {
	// 		vm.selectedGr = response.data.data.data[0];
	// 	}
	// }


	vm.onBranchSelectEvents = {
		onSelectionChanged: function () {
			vm.grNumberModel = undefined;
		}
	};

	function applyCss() {
		setTimeout(() => {
			$('.form-wrapper').find('label, .label').removeClass('req');
			$('.form-wrapper').find('[required]').parents('.form-group').find('label, .label').addClass('req');
		}, 2000);
	}

	function calday() {
		vm.loadingMinDate = dateUtils.addDate(vm.selectedGr.grDate, -15);
	}

	function calculateIncentive(buttonClicked = false) {

		if (!(vm.__FormList && vm.__FormList.incentive && vm.__FormList.incentive.visible)) {
			vm.incentivePercent = 0;
			return;
		}

		if (buttonClicked) {
			vm.incentiveButtonClicked = true;
			getRates();
		}
	}

	function calculateRate(oInvoice) {

		if (oInvoice.dummyCapacityObj) {
			oInvoice.baseValueLabel = oInvoice.dummyCapacityObj.label;
			oInvoice.capacity = oInvoice.dummyCapacityObj.baseVal || 0;
		}

		if (!oInvoice.aRateChart)
			return;

		let baseValToCheck;

		try {
			if (vm.__FormList.capacity.visible)
				baseValToCheck = oInvoice.capacity;
			else
				baseValToCheck = oInvoice.noOfUnits || 0;

		} catch (e) {
			baseValToCheck = oInvoice.noOfUnits || 0;
		}

		if (typeof baseValToCheck === 'undefined')
			return false;

		setPaymentBasis();

		let aRateChart = oInvoice.aRateChart || [];
		let foundRateChart;
		let foundRate;

		aRateChart.find(rateChart => {

			if (!Array.isArray(rateChart.baseRate) || !rateChart.baseRate.length) {

				if (baseValToCheck <= rateChart.baseValue) {
					foundRate = {
						baseVal: rateChart.baseValue,
						rate: rateChart.rate,
						baseValLabel: rateChart.baseValueLabel
					};
				}

			} else {
				foundRate = rateChart.baseRate.find(oRate => {
					if (baseValToCheck <= oRate.baseVal)
						return true;
					return false
				});
			}

			if (!foundRate)
				return false;

			foundRateChart = rateChart;
			return true
		});

		if (!foundRateChart && !foundRate && aRateChart[0]) {
			foundRateChart = aRateChart.slice(-1)[0];

			if (Array.isArray(foundRateChart.baseRate) && foundRateChart.baseRate.length)
				foundRate = foundRateChart.baseRate.slice(-1)[0];
			else {
				foundRate = {
					baseVal: foundRateChart.baseValue,
					rate: foundRateChart.rate,
					baseValLabel: foundRateChart.baseValueLabel
				};
			}

		}

		if (oInvoice && foundRateChart && foundRate)
			applyRates(oInvoice, foundRateChart, foundRate);
	}

	function setTime(date) {
		vm.selectedGr.grDate = new Date((date).setHours(0, 0, 0));
	}

	vm.onSelect = function (item, model, lable) {
		if (item.state) {
			vm.aStates.find(o => {
				if ((o.state).toLowerCase() == (item.state).toLowerCase()) {
					vm.selectedGr.acknowledge.destinationState = o.state;
					return;
				}
			});
		}
	};

	function getGstType() {
		// if(!vm.selectedGr.billingParty){
		// 		swal('Warning', 'No BillingParty Selected!!!!!', 'warning');
		// 		return;
		// }
		// if(($scope.$clientConfigs.gstin_no.substr(0, 2) === vm.selectedGr.billingParty.state_code ) || ($scope.$clientConfigs.gstin_no.substr(1, 1) === vm.selectedGr.billingParty.state_code)) {
		if (vm.gstPercentType == 'CGST & SGST') {
			vm.selectedGr.cGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.sGST_percent = Number((vm.gstPercentToApply / 2).toFixed(2));
			vm.selectedGr.iGST_percent = 0;

		} else if(vm.gstPercentType ===  'IGST'){
			vm.selectedGr.iGST_percent = vm.gstPercentToApply;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		} else {
			vm.gstPercentToApply = 0
			vm.selectedGr.iGST_percent = 0;
			vm.selectedGr.cGST_percent = 0;
			vm.selectedGr.sGST_percent = 0;
		}

	}

	function clearIncentive() {

		vm.selectedGr.charges.incentive = 0;
		typeof vm.watcherClearer === 'function' && vm.watcherClearer();

	}

	function getSources(viewValue) {
		if (viewValue && viewValue.toString().length >= 2) {
			return new Promise(function (resolve, reject) {

				let requestObj = {
					query: viewValue,
				};

				cityStateService.autosuggestCity(requestObj, oSuc, oFail);

				function oSuc(response) {
					resolve(response.data);
				}

				function oFail(response) {
					console.log(response);
					reject([]);
				}
			});
		}
	}

	function getConsignee(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignee',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getConsignor(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				type: 'Consignor',
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			if($scope.$configs.GR.custConfig)
				oFilter.customer = custId;

			consignorConsigneeService.getConsignorConsignee(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function getBillBookNo(viewValue) {

		if (viewValue != 'centrailized' && !vm.selectedGr.branch) {
			swal('Warning', 'Please Select Branch', 'warning');
			return [];
		}

		if (viewValue != 'centrailized' && !vm.selectedGr.branch.grBook)
			return [];

		if (!vm.selectedGr.grDate) {
			swal('Error', 'Gr Date is required', 'error');
			return [];
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: vm.selectedGr.branch && Array.isArray(vm.selectedGr.branch.grBook) && vm.selectedGr.branch.grBook.map(o => o.ref),
				type: 'Gr',
				useDate: moment(vm.selectedGr.grDate).startOf('day').toDate(),
				status: "unused"
			};

			if (viewValue === 'centrailized') {
				delete requestObj.billBookId;
				requestObj.centralize = true;
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}else if(viewValue === 'auto'){
				requestObj.sch = 'onBook';
				requestObj.auto = true;
			}

			billBookService.getStationery(requestObj, oSuc, oFail);

			function oSuc(response) {
				if (viewValue === 'centrailized' || viewValue === 'auto') {
					if (response.data[0]) {
						vm.grNumberModel = response.data[0];
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

	function getBillingParty(viewValue, custId) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				// customer: custId,
				name: viewValue
			};

			// if($scope.$configs.GR.custConfig)
			// 	oFilter.customer = custId;

			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				resolve(response.data);
			}
		});
	}

	function calculateGst(id) {
		if (!id)
			return swal('error', 'BillingParty Not Selected', 'error');

		return new Promise(function (resolve, reject) {
			let oFilter = {
				all: 'true',
				_id: id
			};
			billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				reject([]);
			}

			// Handle success response
			function onSuccess(response) {
				onBillingPartySelect(response.data[0]);
				resolve(response.data);
			}
		});
	}

	function getCustomers(viewValue) {
		if (!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve, reject) {
			let customerFilter = {
				all: true,
				status: "Active",
				name: viewValue
			};

			customer.getAllcustomers(customerFilter, success);

			function success(data) {
				resolve(data.data);
			}
		});
	}


	function getRates(invoice = false) {

		if (!vm.selectedGr.customer || !vm.selectedGr.grDate || !vm.selectedGr.acknowledge || !vm.selectedGr.acknowledge.source || !vm.selectedGr.acknowledge.destination)
			return;

		// fetch rate chart for single invoice
		if (invoice) {
			fetchRateChart(invoice);
		} else {
			//	fetch rete chart for multiple invoices
			Promise.all(vm.selectedGr.invoices.map(invoiceObj => {
				return fetchRateChart(invoiceObj);
			})).then(function () {
				vm.firstCall = false;

			});
		}

		function fetchRateChart(invoice) {
			return new Promise(function (resolve, reject) {

				if (!invoice.material || !invoice.material.groupCode)
					return;

				let request = {};

				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
					request.source = vm.selectedGr.acknowledge.source;
				if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
					request.destination = vm.selectedGr.acknowledge.destination;
				if (invoice.material && invoice.material.groupCode)
					request.materialGroupCode = invoice.material.groupCode;
				if (vm.selectedGr.customer && vm.selectedGr.customer._id)
					request.customer = vm.selectedGr.customer._id;
				if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
					request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

				function onSuccess(res) {
					invoice.aRateChart = res.data || [];
					if (invoice.aRateChart[0] && invoice.aRateChart[0].baseRate && invoice.aRateChart[0].baseRate.length) {
						invoice.aCapacity = invoice.aRateChart[0].baseRate.filter(o => !!o.baseVal);
					} else {
						invoice.aCapacity = invoice.aRateChart.map(o => ({
							rate: o.rate,
							baseVal: o.baseValue,
							label: o.baseValueLabel
						})).filter(o => !!o.baseVal);
					}

					if (invoice.aRateChart.length === 0) {
						invoice.aCapacity = vm.__FormList.capacity.aValue && vm.__FormList.capacity.aValue.map(o => ({
							rate: invoice.rate || 0,
							baseVal: 0,
							label: o
						})) || {};
					}

					if (invoice.aCapacity.length && !(invoice.dummyCapacityObj && invoice.dummyCapacityObj.label)) {
						invoice.dummyCapacityObj = invoice.aCapacity[0];
						calculateRate(invoice);
					}

					invoice.aRateChart.sort((a, b) => a.baseValue - b.baseValue);

					if (vm.firstCall)
						return resolve();

					calculateRate(invoice);
				}

				function onFailure(response) {
					console.log(response);
				}

				CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
			});
		}
	}

	function applyRates(oInvoice, foundRate, baseRate) {

		if (baseRate.baseVal)
			vm.selectedGr.acknowledge.baseValue = oInvoice.baseValue = baseRate.baseVal;
		if (baseRate.baseValLabel)
			oInvoice.baseValueLabel = baseRate.baseValLabel;
		if (baseRate.rate)
			vm.selectedGr.acknowledge.rateChartRate = oInvoice.rate = oInvoice.rateChartRate = baseRate.rate;

		if (foundRate.routeDistance)
			vm.selectedGr.acknowledge.routeDistance = oInvoice.routeDistance = foundRate.routeDistance;

		if (foundRate.invoiceRate)
			oInvoice.invoiceRate = foundRate.invoiceRate;

		if (foundRate.insurRate)
			oInvoice.insurRate = foundRate.insurRate;

		if (foundRate.grCharges && foundRate.grCharges.rate)
			vm.selectedGr.charges.grCharges = foundRate.grCharges.rate;
		if (foundRate.surCharges && foundRate.surCharges.rate)
			vm.selectedGr.charges.surCharges = foundRate.surCharges.rate;
		if (foundRate.cartageCharges && foundRate.cartageCharges.rate)
			vm.selectedGr.charges.cartageCharges = foundRate.cartageCharges.rate;
		if (foundRate.labourCharges && foundRate.labourCharges.rate)
			vm.selectedGr.charges.labourCharges = foundRate.labourCharges.rate;
		if (foundRate.otherCharges && foundRate.otherCharges.rate)
			vm.selectedGr.charges.other_charges = foundRate.otherCharges.rate;
		if (foundRate.prevFreightCharges && foundRate.prevFreightCharges.rate)
			vm.selectedGr.charges.prevFreightCharges = foundRate.prevFreightCharges.rate;
		if (foundRate.detentionLoading && foundRate.detentionLoading.rate)
			vm.selectedGr.loadingDetentionRate = foundRate.detentionLoading.rate;
		if (foundRate.detentionUnloading && foundRate.detentionUnloading.rate)
			vm.selectedGr.unloadingDetentionRate = foundRate.detentionUnloading.rate;
		if (foundRate.discount && foundRate.discount.rate)
			vm.selectedGr.deduction.discount = foundRate.discount.rate;

		if (foundRate.loading_charges && foundRate.loading_charges.rate)
			vm.selectedGr.charges.loading_charges = foundRate.loading_charges.rate;
		if (foundRate.unloading_charges && foundRate.unloading_charges.rate)
			vm.selectedGr.charges.unloading_charges = foundRate.unloading_charges.rate;
		if (foundRate.weightman_charges && foundRate.weightman_charges.rate)
			vm.selectedGr.charges.weightman_charges = foundRate.weightman_charges.rate;
		if (foundRate.overweight_charges && foundRate.overweight_charges.rate)
			vm.selectedGr.charges.overweight_charges = foundRate.overweight_charges.rate;
		if (foundRate.advance_charges && foundRate.advance_charges.rate)
			vm.selectedGr.deduction.advance_charges = foundRate.advance_charges.rate;
		if (foundRate.damage && foundRate.damage.rate)
			vm.selectedGr.deduction.damage = foundRate.damage.rate;
		if (foundRate.shortage && foundRate.shortage.rate)
			vm.selectedGr.deduction.shortage = foundRate.shortage.rate;
		if (foundRate.penalty && foundRate.penalty.rate)
			vm.selectedGr.deduction.penalty = foundRate.penalty.rate;
		if (foundRate.extra_running && foundRate.extra_running.rate)
			vm.selectedGr.charges.extra_running = foundRate.extra_running.rate;
		if (foundRate.dala_charges && foundRate.dala_charges.rate)
			vm.selectedGr.charges.dala_charges = foundRate.dala_charges.rate;
		if (foundRate.diesel_charges && foundRate.diesel_charges.rate)
			vm.selectedGr.charges.diesel_charges = foundRate.diesel_charges.rate;
		if (foundRate.kanta_charges && foundRate.kanta_charges.rate)
			vm.selectedGr.charges.kanta_charges = foundRate.kanta_charges.rate;
		if (foundRate.factory_halt && foundRate.factory_halt.rate)
			vm.selectedGr.charges.factory_halt = foundRate.factory_halt.rate;
		if (foundRate.company_halt && foundRate.company_halt.rate)
			vm.selectedGr.charges.company_halt = foundRate.company_halt.rate;
		if (foundRate.toll_charges && foundRate.toll_charges.rate)
			vm.selectedGr.charges.toll_charges = foundRate.toll_charges.rate;
		if (foundRate.green_tax && foundRate.green_tax.rate)
			vm.selectedGr.charges.green_tax = foundRate.green_tax.rate;

		if (foundRate.internal_rate && foundRate.internal_rate.rate)
			vm.selectedGr.internal_rate = foundRate.internal_rate.rate;
		if (foundRate.standardTime && foundRate.standardTime.rate)
			vm.selectedGr.standardTime = foundRate.standardTime.rate;

		vm.selectedGr.payment_basis = oInvoice.paymentBasis = foundRate.paymentBasis;

		if (foundRate.incentive && foundRate.incentive.rate) {

			switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
				case 'Master': {
					if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !foundRate.incentive || !foundRate.incentive.rate)
						return;

					// Handle failure response
					function onFailure(response) {
						console.log(response);
					}

					// Handle success response
					function onSuccess(response) {
						vm.incentivePercent = (response && response.data && response.data.rate) || 0;
						updateOnFreightChange();
					}

					incentiveService.autosuggest({
						customer: vm.selectedGr.customer._id,
						vehicle: vm.selectedGr.vehicle,
						date: new Date(vm.selectedGr.grDate).toISOString(),
					}, onSuccess, onFailure);

					break;
				}

				default:
					if (!vm.incentiveButtonClicked) {
						vm.incentiveButtonClicked = false;
						return;
					}

					switch (foundRate.incentive.basis) {

						case 'Percent of basic freight':
							vm.incentivePercent = foundRate.incentive.rate;
							updateOnFreightChange();
							break;

						case 'Fixed':
							vm.selectedGr.charges.incentive = foundRate.incentive.rate;
							break;

						default:
							if (typeof vm.selectedGr.incentivePercent != "number")
								return;

							let aExp = vm.__FormList.incentive.evalExp.map(e => {
								if (e.toString().indexOf('(RC)') + 1)
									return $parse(e.replace('(RC)', ''))(foundRate);
								return e;
							});

							vm.selectedGr.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
					}

			}
		}
	}

	function getFormList() {
		let id = false;

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.GR)
			id = vm.selectedGr.billingParty.configs.GR;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.GR)
			id = vm.selectedGr.customer.configs.GR;

		if (!id)
			return;

		if(typeof id === 'object') {
			if (id.configs)
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...id.configs};
		}else
			confService.get(id, function (response) {
				vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...response.data.configs};
				calculateIncentive();
			});

		if (vm.selectedGr.billingParty && vm.selectedGr.billingParty.configs && vm.selectedGr.billingParty.configs.RATE_CHART)
			id = vm.selectedGr.billingParty.configs.RATE_CHART;
		else if (vm.selectedGr.customer && vm.selectedGr.customer.configs && vm.selectedGr.customer.configs.RATE_CHART)
			id = vm.selectedGr.customer.configs.RATE_CHART;

		if (!id)
			return;

		if(typeof id === 'object') {
			if (id.configs)
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...id.configs};
		}else
			confService.get(id, function (response) {
				vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...response.data.configs};
				applyCss();
			});
	}

	// function getRoute (viewValue) {
	// 	if (viewValue.length < 1) return;
	// 	return new Promise(function (resolve, reject) {
	// 		cityStateService.getCity({c:viewValue}, function success(res) {
	// 			resolve(slicer(res.data));
	// 		}, function (err) {
	// 			reject([]);
	// 		});
	// 	});
	// }
	function upsertBillingParty(selectedBillingParty) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myBillingParty/billingPartyUpsert.html',
			controller: 'billingPartyUpsertController',
			resolve: {
				'selectedBillingParty': function () {
					return selectedBillingParty;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				if(selectedBillingParty)
					vm.selectedBillingParty = response;
				else
					vm.aBillingParty.push(response);

			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}

	 function addMaterialGroup(objMaterialGroup) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/material/dialogMaterialGroup.html',
			controller: 'materialGroupModalController',
			resolve: {
				objMaterialGroup : function(){
					return objMaterialGroup
				}
			}
		});

		modalInstance.result.then(function(message) {
			if (message) {
				growlService.growl(message,"success",3);
				vm.getAllMaterialGroups();
			}
		}, function(data) {
		});
	}

	function getAllMaterialGroups(queryObj){
		$scope.pagi2 = true;
		let request = prepareFilterObject(queryObj);
		$scope.pagi2 = false;
		function succGetMaterials(response){
			console.log(response.data);
			if(response.data && response.data.length>0){
				$scope.materialGroups = response.data;
				$scope.pagination2.total_pages2 = response.pages;
				$scope.pagination2.totalItems2 = response.count;
			}
		}
		function failGetMaterials(response){
			console.log(response);
		}
		//var clientId = $localStorage.ft_data.userLoggedIn.clientId;
		materialService.getMaterialGroups(request,succGetMaterials,failGetMaterials);
	}

	function upsertConsignorConsignee(selectedConsignorConsignee) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myConsignorConsignee/consignorUpsert.html',
			controller: 'ConsignorConsigneeUpsertController',
			resolve: {
				'selectedConsignorConsignee': function () {
					return selectedConsignorConsignee;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				if(selectedConsignorConsignee)
					$scope.selectedConsignorConsignee = response;
				else
					$scope.aConsignorConsignee.push(response);

			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}


	function getRoute(viewValue, projection) {
		if (viewValue.length < 3) return;
		return new Promise(function (resolve, reject) {

			let request = {
				_t: 'autosuggest',
				[projection]: viewValue,
				projection
			};

			// if(vm.selectedGr.customer && vm.selectedGr.customer._id)
			// 	request.customer = vm.selectedGr.customer && vm.selectedGr.customer._id;

			CustomerRateChartService.get(request)
				.then((res) => {
					resolve(res.data);
				})
				.catch(e => reject([]));
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

	function getARBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {


			let request = {
				name: viewValue
			};

			return new Promise(function (resolve, reject) {

				branchService.getAllBranches(request, oSuc, oFail);

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

	function getMaterialGroup() {
		var materialFilter = {
			all: true
		};

		materialService.getMaterialGroups(materialFilter, success);

		function success(response) {
			vm.aMaterialGroup = response.data;
		}
	}

	function getTrip(tripNo) {
		function success(res) {
			vm.oTrip = res.data.data.data[0];
			vm.nonSelectedGr = {
				totalWeight: 0,
				totalQty: 0,
				freight: 0,
				totalFreight: 0,
			};
			vm.oTrip.gr.forEach((o, i) => {
				if (o._id === vm.selectedGr._id) {
					vm.oTrip.gr[i] = vm.selectedGr;
					return;
				}
				vm.nonSelectedGr.totalFreight += o.totalFreight;
				vm.nonSelectedGr.totalQty += o.invoices.reduce((a, c) => {
					vm.nonSelectedGr.freight += (c.freight || 0);
					vm.nonSelectedGr.totalWeight += (c.billingWeightPerUnit || 0);
					return a + (c.billingNoOfUnits || 0);
				}, 0);
			});
		}

		tripServices.getAllTripsWithPagination({
			_id: tripNo
		}, success);
	}

	function onCustomerSelect(customer) {
		//TODO remove below code
		//******************************************************

		if (customer.configs && customer.configs.GR && customer.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...customer.configs.GR.configs};
			vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...customer.configs.RATE_CHART.configs};
		} else
			vm.__FormList = $scope.$configs.GR.config;

		vm.selectedGr.billingParty = undefined;
		//******************************************************

		calculateIncentive();
		applyCss();
	}

	function onBillingPartySelect(billingParty) {

		vm.gstPercentToApply = billingParty.percent || vm.gstPercentToApply || '0';

		if(billingParty.customer && billingParty.customer._id)
			vm.selectedGr.customer = billingParty.customer;

		if (!billingParty.state_code)
			swal('Error', 'State Code not Set for Billing party', 'error');
		else {

			// todo remove this code
			if (!Array.isArray($scope.$configs.client_allowed)) {
				$scope.logout();
			}

			let user = ($scope.$configs.client_allowed || []).find(o => o.clientId == billingParty.clientId);

			if (user) {
				vm.selectedGr.billingParty.clientName = user.name;
				vm.gstPercentType = billingParty.state_code == user.state_code ? vm.aGstType[1] : vm.aGstType[0];
			} else {
				swal('Error', 'Billing party not registered to current client', 'error');
			}
		}

		getGstType();

		//TODO remove below code
		//******************************************************

		if (billingParty.configs && billingParty.configs.GR && billingParty.configs.GR.configs) {
			vm.__FormList = {...$scope.$constants.modelConfigs.GR, ...billingParty.configs.GR.configs};
			// vm.__RateChartList = {...$scope.$constants.modelConfigs.RATE_CHART, ...billingParty.configs.RATE_CHART.configs};
		} else
			getFormList();
		//******************************************************

		applyCss();
	}

	function updateInvoiceMaterialObj(invoice, materialObj) {
		invoice.material = {
			groupName: materialObj.name,
			groupCode: materialObj.code,
			groupId: materialObj._id,
			unit: materialObj.unit
		};
	}

	function SelectRateChart(selectedRowIndex) {

		if (!vm.selectedGr.invoices[selectedRowIndex].material.groupCode) {
			swal('warning', "Please Select Material", 'warning');
			return;
		}

		let modalInstance = $modal.open({
			templateUrl: 'views/myGR/addRateChartPopUp.html',
			controller: ['$uibModalInstance', '$timeout', 'otherData', 'lazyLoadFactory', addRateChartPopUpController],
			controllerAs: 'rcVm',
			resolve: {
				otherData: function () {
					return {
						selectedGr: vm.selectedGr,
						selectedInvoice: vm.selectedGr.invoices[selectedRowIndex],
						__RateChart: vm.__RateChartList
					};
				}
			}
		});

		modalInstance.result.then(function (response) {
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}

	function setPaymentBasis() {
		vm.selectedGr.invoices.forEach(oInv => {
			oInv.paymentBasis = vm.selectedGr.payment_basis || undefined;
		});
	}

	function getBranch() {
		if ($scope.$aBranch.length > 0) {
			vm.aBranch = $scope.$aBranch;
			return;
		}
		var branchFilter = {
			all: true
		};
		branchService.getAllBranches(branchFilter, successBranches);

		function successBranches(data) {
			vm.aBranch = data.data;
		}
	}

	function getAllBranch(inputModel) {
		let req = {
			no_of_docs: 10,
		};

		if (inputModel)
			req.name = inputModel;

		if (vm.aUserBranch && vm.aUserBranch.length) {
			req._ids = [];
			vm.aUserBranch.forEach(obj => {
				if (obj.write)
					req._ids.push(obj._id)
			});
			if (!(req._ids && req._ids.length)) {
				return
			} else {
				let flag = false;
				req._ids.forEach(obj=>{
					if(vm.selectedGr.branch._id === obj){
						flag = true;
					}
				});
				if(!flag)
					vm.selectedGr.branch = {};
				req._ids = JSON.stringify(req._ids);
			}
		}

		branchService.getAllBranches(req, success);

		function success(data) {
			vm.aBranch = data.data;
			if (vm.selectedGr.branch && vm.selectedGr.branch._id && !vm.aBranch.find(o => o._id === vm.selectedGr.branch._id))
				vm.aBranch.unshift(vm.selectedGr.branch);
		}
	}

	function setPodModelTime() {
		vm.loadingArrivalTimeModel && (vm.selectedGr.pod.loadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.loadingArrivalTime, vm.loadingArrivalTimeModel));
		vm.billingLoadingTimeModel && (vm.selectedGr.pod.billingLoadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingLoadingTime, vm.billingLoadingTimeModel));
		vm.unloadingArrivalTimeModel && (vm.selectedGr.pod.unloadingArrivalTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.unloadingArrivalTime, vm.unloadingArrivalTimeModel));
		vm.billingUnloadingTimeModel && (vm.selectedGr.pod.billingUnloadingTime = dateUtils.setHoursFromDate(vm.selectedGr.pod.billingUnloadingTime, vm.billingUnloadingTimeModel));
	}

	function getSuppIncentive() {
		return new Promise(function (resolve, reject) {
			let obj = vm.selectedGr.invoices && vm.selectedGr.invoices[0];
			if (!obj.material || !obj.material.groupCode)
				return;

			let request = {};

			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.source)
				request.source = vm.selectedGr.acknowledge.source;
			if (vm.selectedGr.acknowledge && vm.selectedGr.acknowledge.destination)
				request.destination = vm.selectedGr.acknowledge.destination;
			if (obj.material && obj.material.groupCode)
				request.materialGroupCode = obj.material.groupCode;
			if (vm.selectedGr.customer && vm.selectedGr.customer._id)
				request.customer = vm.selectedGr.customer._id;
			if (vm.selectedGr.grDate && new Date(vm.selectedGr.grDate).toString() !== 'Invalid Date')
				request.to = new Date(vm.selectedGr.grDate).toISOString() || '';

			function onSuccess(res) {
				vm.newData = res.data || [];
				if (vm.newData.length) {
					vm.newData = vm.newData[0];
					if (vm.newData.incentive && vm.newData.incentive.rate) {

						switch (vm.__FormList.incentive && vm.__FormList.incentive.expression && vm.__FormList.incentive.expression[0]) {
							case 'Master': {
								if (!vm.selectedGr.grDate || !vm.selectedGr.customer || !vm.newData.incentive || !vm.newData.incentive.rate)
									return;

								// Handle failure response
								function onFailure(response) {
									console.log(response);
								}

								// Handle success response
								function onSuccess(response) {
									vm.selectedGr.supplementaryBill.incentivePercent = (response && response.data && response.data.rate) || 0;
									updateIncentive();
								}

								incentiveService.autosuggest({
									customer: vm.selectedGr.customer._id,
									vehicle: vm.selectedGr.vehicle,
									date: new Date(vm.selectedGr.grDate).toISOString(),
								}, onSuccess, onFailure);

								break;
							}

							default:

								switch (vm.newData.incentive.basis) {

									case 'Percent of basic freight':
										vm.selectedGr.supplementaryBill.incentivePercent = vm.newData.incentive.rate;
										updateIncentive();
										break;

									case 'Fixed':
										vm.selectedGr.supplementaryBill.charges.incentive = vm.newData.incentive.rate;
										break;

									default:
										if (typeof vm.selectedGr.supplementaryBill.incentivePercent != "number")
											return;

										let aExp = vm.__FormList.suppIncentive.evalExp.map(e => {
											if (e.toString().indexOf('(RC)') + 1)
												return $parse(e.replace('(RC)', ''))(vm.newData);
											return e;
										});

										vm.selectedGr.supplementaryBill.charges.incentive = formulaEvaluateFilter(aExp, $scope, 'grUpset');
								}

						}
					}
				}
			}

			function onFailure(response) {
				console.log(response);
			}

			CustomerRateChartService.getAggr(request).then(onSuccess).catch(onFailure);
		});
	}


	function updateIncentive(newVal) {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.supplementaryBill.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.supplementaryBill.charges.incentive = newVal * (vm.selectedGr.supplementaryBill.incentivePercent || 0) / 100;
		});

	}

	function clearSuppIncentive() {
		vm.selectedGr.supplementaryBill.charges.incentive = 0;
		vm.selectedGr.supplementaryBill.incentivePercent = 0;
	}


	function submit(formData) {

		if (vm.selectedGr.invoices.length){

			if (vm.selectedGr.totalFreight < 0)
				return swal('Error', 'Total Freight should be grater than 0', 'error');
			let flag = false;
			if (vm.selectedGr.invoices && vm.selectedGr.invoices.length) {
				vm.selectedGr.invoices.forEach(oInv => {
					if (oInv.paymentBasis !== vm.selectedGr.payment_basis)
						flag = true
				});
			}
			if (flag)
				return swal('Error', 'PaymentBasis should be same for all Item`s', 'error');}

		// Client wise validation
		if ((vm.__FormList.eWayBillNum.req || vm.__FormList.eWayBillExp.req) && !vm.selectedGr.container) {

			if (vm.selectedGr.eWayBills.length == 0)
				return swal('Error', 'E-WayBill Expiry and Number are Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].number)
				return swal('Error', 'E-WayBill Number is Mandatory', 'error');

			if (!vm.selectedGr.eWayBills[0].expiry)
				return swal('Error', 'E-WayBill Expiry is Mandatory', 'error');

			if (vm.selectedGr.eWayBills[0].number) {
				// if (vm.selectedGr.eWayBills[0].number.length < 12)
				// 	return swal('Error', 'E-WayBill Number length should not be less than 12', 'error');
			}
		}
		// Validation END

		if(!vm.grNumberModel)
			return swal('Error', 'Gr Number is Mandatory', 'error');

		if (typeof vm.grNumberModel == 'string' && !vm.selectedGr.invToBill) {
			vm.grNumberModel = vm.grNumberModel.trim();
			// let letterNumber = /^[0-9a-zA-Z]+$/;
			// if(!((vm.grNumberModel).match(letterNumber)))
			// 	return swal('Error', 'Invalid Gr Number', 'error');
			let letterSymbl = /^[^.,]+$/;
			if(!(vm.grNumberModel).match(letterSymbl))
				return swal('Error', 'Gr Number should not contain . or , ' , 'error');
		}

		console.log(formData);

		if (formData.$valid) {

			if(vm.__FormList.customer.req && vm.selectedGr.customer && !vm.selectedGr.customer._id)
				return swal('Error', 'customer is Mandatory', 'error');

			if(vm.__FormList.consignor.req && vm.selectedGr.consignor && !vm.selectedGr.consignor._id)
				return swal('Error', 'consignor is Mandatory', 'error');

			if(vm.__FormList.consignee.req && vm.selectedGr.consignee && !vm.selectedGr.consignee._id)
				return swal('Error', 'consignee is Mandatory', 'error');

			if(vm.__FormList.billingParty.req && vm.selectedGr.billingParty && !vm.selectedGr.billingParty._id)
				return swal('Error', 'billingParty is Mandatory', 'error');


			if (vm.selectedGr.totalFreight > ($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)) {

				return swal('Error', `Bill Amount is cannot be grater than ${($scope.$configs.GR && $scope.$configs.GR.maxAllowedFreight || $scope.$constants.grFreight)}`, 'error')

			} else if (vm.selectedGr.totalFreight > 300000) {
				swal({
						title: 'Bill Amount is Grater Than 3 Lakhs. Are you sure you want to continue?',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: 'rgb(94, 192, 222);',
						confirmButtonText: 'Yes!',
						closeOnConfirm: false
					},
					function (isConfirmU) {
						if (isConfirmU) {
							makeRequest();
						}
					});
			} else {
				makeRequest();
			}

			function makeRequest() {

				// setPodModelTime();

				let request = {
					...vm.selectedGr,
					gr_type: 'Own',
					//grDate: new Date(new Date(vm.selectedGr.grDate), 'DD/MM/YYYY'),
					grDate: new Date(vm.selectedGr.grDate.setHours(0,0,0,0)),
					customer: vm.selectedGr.customer._id,
					consignor: vm.selectedGr.consignor && vm.selectedGr.consignor._id || undefined,
					consignee: vm.selectedGr.consignee && vm.selectedGr.consignee._id || undefined,
					billingParty: vm.selectedGr.billingParty && vm.selectedGr.billingParty._id || undefined,
					branch: vm.selectedGr.branch
				};

				if (typeof vm.grNumberModel == 'object') {
					request.grNumber = vm.grNumberModel.bookNo;
					request.stationaryId = vm.grNumberModel._id;
				} else if(!vm.selectedGr.invToBill){
					request.grNumber = vm.grNumberModel;
					request.stationaryId = undefined;
				}

				if(!request.stationaryId)
					return swal('Error', 'Invalid Gr Number', 'error');

				vm.selectedGr.invoices.forEach((invObj, index) => {
					if (typeof invObj.billingWeightPerUnit === 'undefined' && invObj.weightPerUnit)
						request.invoices[index].billingWeightPerUnit = invObj.weightPerUnit;
					if (typeof invObj.billingNoOfUnits === 'undefined' && invObj.noOfUnits)
						request.invoices[index].billingNoOfUnits = invObj.noOfUnits;
					if (invObj.invoiceDate)
						request.invoices[index].invoiceDate = moment(invObj.invoiceDate, 'DD/MM/YYYY').toISOString();
				});
				if (vm.mode === 'edit') {
					tripServices.updateGRservice(request, success, failure);
				} else {
					tripServices.addGr(request, success, failure);
				}

				function success(res) {
					var message = res.data.message;
					swal('Update', message, 'success');
					if(vm.mode === 'edit') {
						stateDataRetain.back('booking_manage.grWithOutTrip', res.data.data);
					}else {
						vm.selectedGr = {};
						vm.grNumberModel = undefined;
					}
				}

				function failure(res) {
					swal('Error', res.data.message, 'error');
				}
			}

		} else {
			swal('Error', 'All Mandatory Fields are not filled', 'error');
		}
	}

	function updateOnFreightChange() {
		vm.watcherClearer = $scope.$watch('grUVm.selectedGr.basicFreight', function (newVal, oldVal) {
			vm.selectedGr.charges.incentive = newVal * vm.incentivePercent / 100;
		});

	}
}


 function mapGrPopupController(
	$scope,
	$uibModalInstance,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	tripServices,
	thatGr,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.DatePicker = angular.copy(DatePicker);
	vm.selectedGr = angular.copy(thatGr);
	vm.getTrips = getTrips;
	vm.mapGrIntoTrip = mapGrIntoTrip;

	// init
	(function init() {

		vm.columnSetting = {
			allowedColumn: [
				'Trip Entry',
				'Trip Start',
				'Trip End',
				'Trip No',
				'Gr No',
				'Vehicle No',
				'Route',
				'Route Km',
				'Driver Name',
				'Driver No.',
				'Vendor Name',
				'Trip Status',
				'Ownership',
				'Branch',
			]
		};

		vm.tableHead = [
			{
				'header': 'Trip Entry',
				'bindingKeys': 'allocation_date',
				'date': true
			},
			{
				'header': 'Trip Start',
				'bindingKeys': '((statuses | filter:{"status": "Trip started"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Trip End',
				'bindingKeys': '((statuses | filter:{"status": "Trip ended"})[0].date | date:"dd-MMM-yyyy")',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Trip No',
				'bindingKeys': 'trip_no'
			},
			{
				'header': 'Gr No',
				'filter': {
					'name': 'arrayOfGrToString',
					'aParam': [
						'gr',
					]
				}
			},
			{
				'header': 'Vehicle No',
				'bindingKeys': 'vehicle.vehicle_reg_no',
				'date': false
			},
			{
				'header': 'Branch',
				'bindingKeys': 'branch.name'
			},
			{
				'header': 'Route',
				'bindingKeys': 'route_name'
			},
			{
				'header': 'Route Km',
				'bindingKeys': 'totalKm'
			},
			{
				'header': 'Driver Name',
				'bindingKeys': 'driver.name'
			},
			{
				'header': 'Driver No.',
				'bindingKeys': 'driver.prim_contact_no'
			},
			{
				'header': 'Vendor Name',
				'bindingKeys': 'vendor.name'
			},
			{
				'header': 'Trip Status',
				'bindingKeys': 'status'
			},
			{
				'header': 'Ownership',
				'bindingKeys': 'ownershipType'
			},
		];
		vm.selectedTrip = [];
		vm.lazyLoad = lazyLoadFactory();

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getTrips(isGetActive) {

		if (!vm.lazyLoad.update(isGetActive))
			return;

		let request = prepareFilter();
		tripServices.getAllTripsWithPagination(request, success, failure);

		function success(res) {
			res = res.data.data;
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, res);
		}

		function failure(res) {
			swal("Failed!", res.data.data.data, "error");
		}
	}

	function prepareFilter() {
		var request = {};

		if (vm.oFilter.from) {
			request.from = vm.oFilter.from;
		}
		if (vm.oFilter.to) {
			request.to = vm.oFilter.to;
		}

		if(vm.oFilter.trip_no)
			request.trip_no =  vm.oFilter.trip_no;

		request.category = 'Loaded';
		request.isCancelled = false;

		request.no_of_docs = 5;
		request.skip = vm.lazyLoad.getCurrentPage();

		request.sort = {_id: -1};
		return request;
	}

	function mapGrIntoTrip(selectedTrip) {
		if (!selectedTrip)
			return swal('Warning', 'Please Select at least one row', 'warning');

		// if (selectedTrip && selectedTrip.gr && selectedTrip.gr[0].grDate) {
		// 	let totday = (selectedTrip.gr[0].grDate - vm.selectedGr.grDate) / (1000 * 60 * 60 * 24);
		// 	if (totday > 3 && totday <= (-3))
		// 		return swal('Warning', 'gr date should not differ for more than 3 days for the new trip grs', 'warning');
		// }

		const tripStatuses = selectedTrip.statuses || [];
		selectedTrip.tripStartDate = tripStatuses.find(o => o.status === 'Trip started');
		selectedTrip.tripEndDate = tripStatuses.find(o => o.status === 'Trip ended');

		if(selectedTrip.tripEndDate)
			return swal('Warning', 'Selected trip already end cant not Map Gr', 'warning');

		if (!selectedTrip.tripStartDate)
			return swal('Warning', 'Selected trip not started yet', 'warning');
		selectedTrip.tripEndDate = (selectedTrip.tripEndDate && new Date(selectedTrip.tripEndDate.date)) || new Date();

		// if(selectedTrip.tripStartDate && selectedTrip.tripEndDate){
		// 	if((new Date(vm.selectedGr.grDate).getTime() < new Date(selectedTrip.tripStartDate.date).getTime()) || new Date(vm.selectedGr.grDate).getTime() > new Date(selectedTrip.tripEndDate).getTime())
		// 		return swal('Warning', 'gr date should be in between new trip start date and end date', 'warning');
		// }

		swal({
				title: 'Are you sure you want to Map this Gr?',
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
					let req = {
						tripId: selectedTrip._id,
						grId: vm.selectedGr._id
					};
					tripServices.mapGrIntoTrip(req, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						$uibModalInstance.dismiss(res);
					}
				}
			});
		return;
	}
}





