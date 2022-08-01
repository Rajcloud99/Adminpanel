// Account Master Controllers

materialAdmin.controller('accountMasterController', function (
	$modal,
	$uibModal,
	objToCsv,
	$scope,
	$timeout,
	$state,
	accountingService,
	lazyLoadFactory,
	branchService,
	DatePicker,
	Pagination,
	growlService,
) {

	$scope.columnSetting = {
		allowedColumn: [
			'Name',
			'Tally Ledger',
			'Type',
			'Group',
			'Balance',
			'Branch',
			'Added By',
			'Added On',
			'Account Id',
			'Linked To',
			'Last Modified By',
			'Last Modified At',
		]
	};
	$scope.tableHead = [
		{
			'header': 'Name',
			'bindingKeys': 'name'
		},
		{
			'header': 'Tally Ledger',
			'bindingKeys': 'ledger_name'
		},
		{
			'header': 'Group',
			'bindingKeys': 'type.name || type'
		},
		{
			'header': 'Type',
			'bindingKeys': 'group && group.toString()'
		},
		{
			'header': 'Balance',
			'bindingKeys': 'balance'
		},
		{
			'header': 'Branch',
			'bindingKeys': 'branch.name'
		},
		{
			'header': 'Added By',
			'bindingKeys': 'created_by.full_name',
			'date': true
		},
		{
			'header': 'Added On',
			'bindingKeys': 'created_at'
		},
		{
			'header': 'Account Id',
			'bindingKeys': 'accountId',
			'date': false
		},
		{
			'header': 'Linked To',
			'bindingKeys': 'linkedTo.name'
		},
		{
			'header': 'Last Modified By',
			'bindingKeys': 'lastModifiedBy'
		},
		{
			'header': 'Last Modified At',
			'bindingKeys': 'last_modified_at'
		}


	];

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.aAccountMaster = []; // to contain account masters
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.pagination.items_per_page = 15;

	$scope.totalItems = 0;
	$scope.selectedAccountMaster = null; // to contain selected account master
	$scope.aggrs = [{label: 'Branch', value: 'branch'}];


	// functions Identifiers
	$scope.accountMaster = accountMaster;
	$scope.dateChange = dateChange;
	$scope.deleteAccount = deleteAccount;
	$scope.getAccountMasters = getAccountMasters;
	$scope.getAllBranch = getAllBranch;
	$scope.downloadReport = downloadReport;
	$scope.downloadStructureReport = downloadStructureReport;
	$scope.downloadStructureReportAll = downloadStructureReportAll;
	$scope.downloadBalanceSheet = downloadBalanceSheet;
	$scope.downloadSampleFile = downloadSampleFile;
	$scope.editClientId = editClientId;
	$scope.resetBalance = resetBalance;
	$scope.selectThisRow = selectThisRow;
	$scope.updateAccountMasterName = updateAccountMasterName;
	$scope.upload = upload;
	$scope.uploadModifyStructure = uploadModifyStructure;
	$scope.upsertAccountMaster = upsertAccountMaster;
	$scope.viewAccountMaster = viewAccountMaster;

	// INIT functions
	(function init() {
		$scope.selectType = 'index';
		$scope.lazyLoad = lazyLoadFactory(); // init lazyload
		// getAccountMasters(true);
	})();

	// Actual Functions

	// Add or Edit account master Modal
	function upsertAccountMaster(selectedAccountMaster) {

		var modalInstance = $modal.open({
			templateUrl: 'views/accounting/accountMasterUpsert.html',
			controller: 'accountMasterUpsertController',
			resolve: {
				'selectedAccountMaster': function () {
					return selectedAccountMaster;
				}
			}
		});

		modalInstance.result.then(function (response) {
			if (response)
				if (selectedAccountMaster)
					$scope.selectedAccountMaster = response;
				else
					$scope.aAccountMaster.push(response);

			console.log('close', response);
		}, function (data) {
			//console.log('cancel');
		});
	}

	function updateAccountMasterName(selectedAccount){

		var modalInstance =$modal.open({
			templateUrl: 'views/accounting/accountMasterEditName.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'accountingService',
				'selectedAccount',
				updateNameController
			],
			resolve: {
				'selectedAccount': function() {
					return selectedAccount;
				}
			}

		});

		modalInstance.result.then(function(response) {
			if(response)
				if(selectedAccountMasterEditName)
					$scope.selectedAccountMasterEditName = response;


			console.log('close',response);
		},
			function(data){
				console.log('cancel');
		});
	}

	// send to view account master page
	function viewAccountMaster(selectedAccountMaster) {
		if (selectedAccountMaster) {
			$state.go('accountManagment.view', {'data': selectedAccountMaster});
		}
	}

	// Get Account Masters from backend
	function getAccountMasters(isGetActive) {

		if($scope.oFilter.from && $scope.oFilter.to) {
			let monthRange = $scope.oFilter.to.getMonth() - $scope.oFilter.from.getMonth();
			monthRange += ($scope.oFilter.to.getFullYear() - $scope.oFilter.from.getFullYear()) * 12;
			if (monthRange > 3) {
				swal('warning', "Date range should be 3 month", 'warning');
				return;
			}
		}

		if(!$scope.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject($scope.oFilter);
		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {

			response = response.data;
			$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);
			// $scope.tableApi && $scope.tableApi.refresh();

			// update pagination
			// $scope.pagination.total_pages = response.count/$scope.pagination.items_per_page;
			// $scope.pagination.totalItems = response.count;


			//  setTimeout b'cos, its called when angular has done its rendering
			// setTimeout(function() {
			// show 1st row as selected row by default
			// $scope.aAccountMaster[0] && $scope.selectThisRow($scope.aAccountMaster[0],0);
			// });
		}
	}

	function accountMaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
					isGroup: true,
				};
				// if ($scope.operationType === 'Edit' && $scope.oAccountMaster && $scope.oAccountMaster.lvl) {
				// 	req['lvlLessThan'] = $scope.oAccountMaster.lvl;
				// }
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

	function dateChange(dateType) {

		if (dateType === 'startDate' && $scope.oFilter.to && $scope.oFilter.from) {

			let isDate = $scope.oFilter.to instanceof Date,
				monthRange = $scope.oFilter.to.getMonth() - $scope.oFilter.from.getMonth(),
				dateRange = $scope.oFilter.to.getDate() - $scope.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += ($scope.oFilter.to.getFullYear() -  $scope.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if(monthRange ===3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

            if (isDate && isNotValid) {
				let date = new Date($scope.oFilter.from);
				$scope.oFilter.to = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'endDate' && $scope.oFilter.to && $scope.oFilter.from) {

			let isDate = $scope.oFilter.from instanceof Date,
				monthRange = $scope.oFilter.to.getMonth() - $scope.oFilter.from.getMonth(),
				dateRange = $scope.oFilter.to.getDate() - $scope.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += ($scope.oFilter.to.getFullYear() -  $scope.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - $scope.oFilter.from.getDate() + $scope.oFilter.to.getDate() > 30 ? true : false);
			else if(monthRange ===3 && ($scope.oFilter.from.getDate() < $scope.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date($scope.oFilter.to);
				$scope.oFilter.from = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	function editClientId(selectedInfo) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/commonFolder/editClientIdPopUp.html',
			controller:  [
				'$scope',
				'$uibModalInstance',
				'selectedInfo',
				'commonService',
				editClientIdPopUpController
			],
			controllerAs: 'clientVm',
			resolve: {
				selectedInfo:{
					client_type : 'account',
					name:selectedInfo.name,
					clientId:selectedInfo.clientId,
					clientR:selectedInfo.clientR,
					_id:selectedInfo._id,
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			$scope.selectedInfo = data.data;
		}, function (data) {
		});
	}

	function resetBalance(selectedAccount){
		$uibModal.open({
			templateUrl: 'views/accounting/resetBalance.html',
			controller:  [
				'$uibModalInstance',
				'DatePicker',
				'otherData',
				'accountingService',
				resetBalancePopUpController
			],
			controllerAs: 'vm',
			resolve: {
				otherData: function(){
					return {
						selectedAccount
					};
				}
			}
		})
			.result
			.then(function (data) {
				console.log(data);
				$scope.selectedInfo = data.data;
			}, function (data) {

			});
	}

	// angular.element(document.getElementById('messages-main')).scope().editOpeningBalnc();
	$scope.editOpeningBalnc = function () {
		var today = new Date().getHours();
		//if (!(today < 11 || today >= 17))
			//return swal('warning', "you can update only in between 7PM to 11AM",'warning');
		let selectedInfo = $scope.selectedAccountMaster;
		if(!selectedInfo)
			return swal('warning', "Select at least one row",'warning');
		var modalInstance = $uibModal.open({
			templateUrl: 'views/accounting/openingBalncPopUp.html',
			controller:  [
				'$scope',
				'$uibModalInstance',
				'DatePicker',
				'selectedInfo',
				'accountingService',
				editOpeningBalncPopUpController
			],
			controllerAs: 'obVm',
			resolve: {
				selectedInfo:{
					client_type : 'account',
					name:selectedInfo.name,
					clientId:selectedInfo.clientId,
					clientR:selectedInfo.clientR,
					_id:selectedInfo._id,
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
			getAccountMasters();
		}, function (data) {
		});
	};

	function downloadReport(rptType) {
		if(!($scope.oFilter.from && $scope.oFilter.to) ){
			swal('warning', "Both From and To Date should be Filled",'warning');
			return;
		}

		let monthRange = $scope.oFilter.to.getMonth() - $scope.oFilter.from.getMonth();
		monthRange+= ($scope.oFilter.to.getFullYear() -  $scope.oFilter.from.getFullYear()) * 12;
		if(monthRange>3 && !rptType === 'csv'){
			swal('warning', "Date range should be 3 month",'warning');
			return;
		}

		var oFilter = prepareFilterObject($scope.oFilter);
		if(rptType === 'csv')
			oFilter.downloadCSV = true;
		else
			oFilter.download = true;
		oFilter.all = true;
		accountingService.getAccountMaster(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		}, err => {
			console.log(err);
			swal('Error!', 'Message not defined', 'error');
		});
	}

	function downloadStructureReport() {
		if(!$scope.selectedAccountMaster) {
			growlService.growl("Select account", "danger");
			return;
		}
		accountingService.getAccountMasterStructure({_id: $scope.selectedAccountMaster._id}, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		}, err => {
			swal('Error!', err.message, 'error');
		});
	}

	function downloadStructureReportAll() {

		accountingService.getAccountMasterStructureAll({"Download": "All"}, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		}, err => {
			swal('Error!', err.message, 'error');
		});
	}

	function downloadBalanceSheet() {
		if(!($scope.oFilter.from && $scope.oFilter.to)){
			swal('warning', "Both From and To Date should be Filled",'warning');
			return;
		}
		var oFilter = prepareFilterObject($scope.oFilter);
		oFilter.download = true;
		oFilter.all = true;
		accountingService.getBalanceSheetReport(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.download = res.url;
			a.target = '_blank';
			a.click();
		}, err => {
			swal('Error!', err.message, 'error');
		});
	}

	function downloadSampleFile() {
		objToCsv(null,
			[
				'NAME',
				'LEDGER',
				'TYPE',
				'GROUP',
				'ISGROUP',
				'BALANCE',
				'Bill Track'
			],[]);
	}
	function upload(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('excel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			accountingService.uploadAccounts({}, data)
				.then(function (d) {
					if (d.stats && d.stats.length > 0) {
						const header = ['STATUS', 'REJECTION REASON'];
						const body = d.stats.map(o => header.map(s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));
						objToCsv('AccountsLog', header, body);
					}
					swal({
						title: 'Info',
						text: d.message,
						type: "info"
					});
				})
				.catch(function (err) {
					swal(err.data.message, err.data.error, 'error');
				});
		}
	}

	function uploadModifyStructure(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('excel', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			accountingService.uploadModifiedAccount({}, data)
				.then(function (d) {
					if (d.stats && d.stats.length > 0) {
						const header = ['STATUS', 'REJECTION REASON'];
						const body = d.stats.map(o => header.map(s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));
						objToCsv('AccountsLog', header, body);
					}
					swal({
						title: 'Info',
						text: d.message,
						type: "info"
					});
				})
				.catch(function (err) {
					swal(err.data.message, err.data.error, 'error');
				});
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.clientId !== 'undefined')
			requestFilter.clientId = oFilter.clientId;

		if (typeof oFilter.name !== 'undefined')
			requestFilter.name = oFilter.name;

		// if (typeof oFilter.branch !== 'undefined')
		// 	requestFilter.branch = oFilter.branch;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type._id;

		if (typeof oFilter.branch !== 'undefined')
			requestFilter.branch = oFilter.branch._id;

		if (typeof oFilter.group !== 'undefined')
			requestFilter.group = oFilter.group;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = oFilter.from;

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = oFilter.to;

		if (typeof oFilter.aggregateBy !== 'undefined')
			requestFilter.aggregateBy = oFilter.aggregateBy;
		requestFilter.deleted = false;

		requestFilter.skip = $scope.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 20;

		// requestFilter.skip = $scope.pagination.currentPage;
		// requestFilter.no_of_docs = $scope.pagination.items_per_page;
		// requestFilter.all='true';
		return requestFilter;
	}

	function deleteAccount(){

		swal({
				title: 'Are you sure you want to delete this account?',
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
					let oRequest = {
						_id: $scope.selectedAccountMaster._id,
						deleted: true
					};
					oRequest.deleted = true;
					accountingService.updateAccountMaster(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Account deleted!!', 'success');
						getAccountMasters();
					}
				}
			});
		return;
	}

	function selectThisRow(oAccountMaster, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		$scope.selectedAccountMaster = oAccountMaster;
	}
});


function updateNameController(
	$scope,
	$uibModalInstance,
	accountingService,
	selectedAccount
) {

$scope.operationType = 'Edit';

//functions identifiers
$scope.submit = submit;
$scope.closeModal = closeModal;

// INIT
(function init(){
    $scope.isdisabled = false;
	$scope.oAccountMaster = selectedAccount;

	if (typeof selectedAccountMasterEditName !== 'undefined' && selectedAccountMasterEditName !== null) {
		$scope.oAccountMaster = angular.copy(selectedAccountMasterEditName); //initialize with param
		if (!selectedAccountMasterEditName.isAdd) {
			$scope.operationType = 'Edit';
		}
	}

})();

//Function Definition

function closeModal() {
	$uibModalInstance.dismiss();
}

function submit(formData) {
	console.log(formData);

	if (formData.$valid) {
		let request = {
			_id: $scope.oAccountMaster._id,
			name: $scope.oAccountMaster.name,
		};

		console.log('form is valid', request);

		// call respective service on based on operation type

		if ($scope.operationType === 'Edit') {
			$scope.isdisabled = true;
		   accountingService.updateAccountMasterEditName(request, onSuccess, onFailure);
		}

		// Handle failure response
		function onFailure(response) {
			$scope.isdisabled = false;
			console.log(response);
			let msg = response.message || 'Message not defined';
			swal('Error!', msg, 'error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.isdisabled = false;

			var msg = response.message;
		    if ($scope.operationType === 'Edit')

			  msg = msg || "Data Updated Successfully";

			swal('Success', msg, 'success');
			$uibModalInstance.close(response.data);
		}
	}
}

/////////////////////
}


materialAdmin.controller('accountMasterUpsertController', function (
	$scope,
	$uibModalInstance,
	accountingService,
	branchService,
	DatePicker,
	userService,
	selectedAccountMaster,
	billsService
) {
	// object Identifiers
	$scope.oAccountMaster = {}; //initialize with Empty Object
	$scope.operationType = 'Add'; // Defines Operation type for Showing on View
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.accountmaster = accountmaster;
	$scope.getBranch = getBranch;


	// functions Identifiers
	$scope.submit = submit;
	$scope.closeModal = closeModal;
	$scope.onSourceSelect = onSourceSelect;
	$scope.findTdsRate = findTdsRate;


	// INIT functions
	(function init(){
		$scope.isDisabled = false;
		$scope.isGroupAllowed = true;
		$scope.DatePicker = angular.copy(DatePicker);

	})();

	// Operations
	if (typeof selectedAccountMaster !== 'undefined' && selectedAccountMaster !== null) {
		$scope.oAccountMaster = angular.copy(selectedAccountMaster); //initialize with param
		if($scope.oAccountMaster.exeFrom)
			$scope.oAccountMaster.exeFrom = new Date($scope.oAccountMaster.exeFrom);

		if($scope.oAccountMaster.isGroupNotAllowed){
			$scope.isGroupAllowed = false;
		}

		if (!selectedAccountMaster.isAdd) {
			$scope.operationType = 'Edit';
			if(selectedAccountMaster.fromVendor)
			$scope.isReadOnly = true;
			if(selectedAccountMaster.tdsApply)
				$scope.findTdsRate();
		}

	}

	// Actual Functions

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	$scope.upDateToDate = function(from){
		if(!from)
         return $scope.oAccountMaster.exeTo = null;
		let finYearDate = new Date(from);
		finYearDate.setMonth(2);
		finYearDate.setDate(31);
		finYearDate.setHours(23, 59, 59);
		if(from >= finYearDate)
			finYearDate.setFullYear(finYearDate.getFullYear() + 1);
		$scope.oAccountMaster.exeTo = finYearDate;

	};

	$scope.validateRate = function (rate) {
		if(rate)
			$scope.oAccountMaster.exeRate = Number(rate.toFixed(2));
		if(rate > 25) {
			$scope.oAccountMaster.exeRate = 25;
			return swal('Error', 'Rate cannot be greater than 25', 'error');
		}
	}

function onSourceSelect(item) {
	$scope.oAccountMaster.tdsSources = item.source;
	$scope.oAccountMaster.tdsSection = item.section;
}
	// Get All Branches List
	// (function getBranch() {
	// 	try {
	// 		if ($scope.$aBranch.length > 0) {
	// 			$scope.aBranch = $scope.$aBranch;
	// 			return;
	// 		} else {
	// 			var branchFilter = {
	// 				all: true
	// 			};
	// 			branchService.getAllBranches(branchFilter, successBranches);
    //
	// 			function successBranches(data) {
	// 				$scope.aBranch = data.data;
	// 				$scope.oAccountMaster.branch = $scope.aBranch.find((obj) => obj._id == selectedAccountMaster.branch._id)
	// 			}
	// 		}
	// 	} catch (e) {
	// 	}
	// })();
	function getBranch(viewValue) {
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

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 20,
					isGroup: true,
				};
				if ($scope.operationType === 'Edit' && $scope.oAccountMaster && $scope.oAccountMaster.lvl) {
					req['lvlLessThan'] = $scope.oAccountMaster.lvl;
				}
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
	// (function getUser() {
	// 	try {
	// 		var userFilter = {
	// 			all: true
	// 		};
	// 		userService.getUsers(userFilter, successUsers);
    //
	// 		function successUsers(data) {
	// 			$scope.aUsers = data.data;
	// 		}
    //
	// 	} catch (e) {
	// 	}
	// })();

	$scope.onSourcesSelect = function(item) {
		$scope.$constants.tdsSources.forEach(obj=>{
			if(obj.source === item)
				$scope.oAccountMaster.tdsSection = obj.section;
		})
		$scope.findTdsRate();
	};

	function findTdsRate() {
		const oReq = {
			date: new Date(),
			cClientId: $scope.$configs.clientOps,
		};
		billsService.getTDSRate(oReq, onSuccess, onFailure);
		function onSuccess(res) {
			if(res.data && res.data.data && res.data.data.length) {
				$scope.prepareTdsTable = [];
				$scope.allTDSRate = res.data.data;
				if($scope.allTDSRate) {
					for(const d of $scope.allTDSRate) {
						const findRate = d.aRate.find((obj) => obj.section === $scope.oAccountMaster.tdsSection);
						$scope.prepareTdsTable.push(findRate);
					}
				}
			}
		}
		function onFailure(err) {
			console.log(err);
		}
	}

	// add or modify account master
	function submit(formData) {
		console.log(formData);

		if (formData.$valid) {
			var request = $scope.oAccountMaster;

			if(request.type && !request.type._id)
				return swal('Error!', 'invalid ledger group', 'error');

			if(request.branch && !request.branch._id)
				return swal('Error!', 'invalid Branch', 'error');

			if( $scope.oAccountMaster.type){
				request.type={
					_id: $scope.oAccountMaster.type._id,
					name: $scope.oAccountMaster.type.name,
					level: $scope.oAccountMaster.type.lvl,
				}
			}
			if($scope.oAccountMaster.tdsApply){
				if(!($scope.oAccountMaster.tdsCategory && $scope.oAccountMaster.tdsSources))
					return swal('Error!', 'TDS Category and TDS Sources Required', 'error');
			}

			if($scope.oAccountMaster.exeRate){
				if(!($scope.oAccountMaster.exeFrom && $scope.oAccountMaster.exeTo))
					return swal('Error!', 'exempted valid from and To Required', 'error');
			}

			console.log('form is valid', request);

			// call respective service on based on operation type
			if ($scope.operationType === 'Add') {
				$scope.isDisabled = true;
				accountingService.addAccountMaster(request, onSuccess, onFailure);
			} else if ($scope.operationType === 'Edit') {
				$scope.isDisabled = true;
				// delete request.opening_balance;
				accountingService.updateAccountMaster(request, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				$scope.isDisabled = false;
				console.log(response);
				let msg = response.message || 'Message not defined';
				swal('Error!', msg, 'error');
			}

			// Handle success response
			function onSuccess(response) {
				$scope.isDisabled = false;
				var msg = response.message;
				if ($scope.operationType === 'Add')
					msg = msg || "Data Added Successfully";
				else if ($scope.operationType === 'Edit')
					msg = msg || "Data Updated Successfully";

				swal('Success', msg, 'success');
				$uibModalInstance.close(response.data);
			}
		}
	}

	//////////////////////////////////////////////////

});

materialAdmin.controller('accountMasterViewController', function (
	$modal,
	$scope,
	$state,
	$stateParams
) {
	// object Identifiers
	if (typeof $stateParams.data !== 'undefined' && $stateParams.data !== null)
		$scope.oAccountMaster = angular.copy($stateParams.data); //initialize
	else
		$state.go('accountManagment.accountMaster');


	// functions Identifiers
	$scope.upsertAccountMaster = upsertAccountMaster;


	// INIT functions


	// Actual Functions
	// send to edit account master page
	function upsertAccountMaster(oAccountMaster) {

		var modalInstance = $modal.open({
			templateUrl: 'views/accounting/accountMasterUpsert.html',
			controller: 'accountMasterUpsertController',
			resolve: {
				'selectedAccountMaster': function () {
					return oAccountMaster;
				}
			}
		});

		modalInstance.result.then(function (response) {
			if (response)
				$scope.oAccountMaster = response;
			console.log('close', response);
		}, function (data) {
			console.log('cancel');
		});
	}


	//////////////////////////////////////////////////

});

// DayBook Controllers
// Day Book is the accounting term for Data Entries(Vouchers in our Term)

materialAdmin.controller('dayBookController', function (
	$modal,
	$scope,
	accountingService,
	DatePicker,
	Pagination,
	branchService
) {

	// object Identifiers
	$scope.aVouchers = []; // to contain vouchers
	$scope.aAccountMaster = [];
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.aggrs = [{label: 'From', value: 'from'}, {label: 'To', value: 'to'}, {label: 'Type', value: 'type'}];

	// functions Identifiers
	$scope.addVoucher = addVoucher;
	$scope.getVouchers = getVouchers;
	$scope.accountmaster = accountmaster;
	$scope.getAllBranch = getAllBranch;


	// INIT functions
	(function init() {
		// $scope.oFilter.to_date = new Date();
		// $scope.oFilter.from_date = new Date(new Date().setDate(new Date($scope.oFilter.to_date).getDate() - 7));
		// getVouchers();
		// getAccountMasters();
	})();


	// Actual Functions
	function addVoucher() {
		var addVoucherModal = $modal.open({
			templateUrl: 'views/accounting/addVoucherPopup.html',
			controller: 'addVoucherPopupController',
			resolve: {
				callback: function () {
					return false;
				},
				modalDetail: function () {
					return false;
				},
				otherDetail: function () {
					return false;
				}
			}
		});

		addVoucherModal.result.then(function (response) {
			// Call on Modal Close
			console.log(response);
			//$scope.aVouchers.push(response);
			getVouchers();
		}, function (response) {
			// Call on Modal Dismiss
		});
	}

	// Get Day Book from backend
	function getVouchers(isDownloadTrue) {

		var oFilter = prepareFilterObject($scope.oFilter);
		if (isDownloadTrue) {
			oFilter.download = true;
		}
		accountingService.getVoucher(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aVouchers = response.data.data;

				// update pagination
				$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.data.count;
			}
		}
	}

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 10,
					// isGroup: true,
				};
				// if ($scope.operationType === 'Edit' && $scope.oAccountMaster && $scope.oAccountMaster.lvl) {
				// 	req['lvlLessThan'] = $scope.oAccountMaster.lvl;
				// }
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

	function getAccountMasters() {

		accountingService.getAccountMaster({}, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMaster = response.data.data;
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.refNo !== 'undefined')
			requestFilter.refNo = oFilter.refNo;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.dateType !== 'undefined')
			requestFilter.dateType = oFilter.dateType;

		if (typeof oFilter.particular !== 'undefined')
			requestFilter.particular = oFilter.particular;

		if (typeof oFilter.from_date !== 'undefined')
			requestFilter.from_date = moment(oFilter.from_date, 'DD/MM/YYYY').toISOString();

		if (typeof oFilter.to_date !== 'undefined')
			requestFilter.to_date = moment(oFilter.to_date, 'DD/MM/YYYY').toISOString();

		if (typeof oFilter.name !== 'undefined')
			requestFilter.name = oFilter.name;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = [oFilter.from._id];

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = [oFilter.to._id];

		if (typeof oFilter.ledger !== 'undefined')
			requestFilter.ledger = oFilter.ledger._id;

		if (typeof oFilter.branch !== 'undefined')
			requestFilter.branch = oFilter.branch._id;

		// if(typeof oFilter.from !== 'undefined')
		// 	requestFilter.from = oFilter.from.map(obj=> obj._id);
		//
		// if(typeof oFilter.to !== 'undefined')
		// requestFilter.to = oFilter.to.map(obj=> obj._id);
		//
		// if(typeof oFilter.ledger !== 'undefined')
		// requestFilter.ledger = oFilter.ledger._id;

		if (typeof oFilter.aggregateBy !== 'undefined')
			requestFilter.aggregateBy = oFilter.aggregateBy;

		requestFilter.skip = $scope.pagination.currentPage;
		requestFilter.no_of_docs = $scope.pagination.items_per_page;

		return requestFilter;
	}

	//////////////////////////////////////////////////

});

//dayWise Report

materialAdmin.controller('dayWiseReportController', function (
	$modal,
	$uibModal,
	$scope,
	$timeout,
	$state,
	accountingService,
	billingPartyService,
	customer,
	lazyLoadFactory,
	branchService,
	DatePicker,
	growlService
) {

    let vm = this;

	// object Identifiers
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.aAccountMaster = []; // to contain account masters
	vm.oFilter = {}; // initialize filter object
	vm.aStatus = ['settled', 'unsettled', 'overpaid'];
	vm.aggrs = ['account', 'date'];
	vm.maxDate = new Date();
	vm.aCategory = ['Fleet', 'Freight', 'Freight and Fleet'];
	vm.aAccountFilter = ['Ledger', 'Bill to Bill', 'Trial Balance', 'Branch Expense', 'Account Balance', 'Account Balance Monthly', 'Opening Balance'];
	vm.aGroupFilter = ['Ledger Group', 'Group Balance', 'Trial Balance','Group Trial Balance','Particulars Trial Balance'];
	vm.aBranchFilter = ['Bill to Bill', 'Trial Balance', 'Branch Expense'];
	if ($scope.$configs && $scope.$configs.customer && $scope.$configs.customer.category) {
		Array.prototype.push.apply(vm.aCategory, $scope.$configs.customer.category);
	}

	// functions Identifiers
	vm.getAccountMasters = getAccountMasters;
	vm.accountmaster = accountmaster;
	vm.getAllBranch = getAllBranch;
	vm.getBilling = getBilling;
	vm.getCustomer = getCustomer;
	vm.downloadReport = downloadReport;
	vm.dateChange = dateChange;
	vm.billtobill= billtobill;
	vm.resetAccountBalace= resetAccountBalace;
	vm.onBranchSelect= onBranchSelect;
	vm.onReportChange = onReportChange;

	// INIT functions
	(function init() {
		vm.aBranch = [];
		vm.oFilter.to = new Date();
		vm.oFilter.from = new Date(new Date().setDate(new Date(vm.oFilter.to).getDate() - 30));
		vm.selectType = 'index';

		// getAccountMasters(true);

	})();

	// Actual Functions

	function billtobill(){
		if(vm.reportType === 'Trial Balance'){


			vm.columnSetting ={

				allowedColumn:[
					'Transaction Detail',
					'Credit',
					'Debit',
				]

			};

			vm.tableHead = [
				{
					'header': 'Transaction Detail',
					'bindingKeys':'accountDetail.ledger_name'
				},
				{
					'header': 'Credit',
					'bindingKeys':'this.cr===0? "0": this.cr',
					'eval':true


				},
				{
					'header':'Debit',
					'bindingKeys': 'this.dr===0? "0": this.dr',
					'eval':true

					// 'this.cb.cb > 0 ? cb.cb : 0'
				}
			];


		}
		else if(vm.reportType === 'Group Trial Balance'){

			vm.columnSetting ={

				allowedColumn:[
					'Account',
					'Opening Balance',
					'Credit Amount',
					'Debit Amount',
					'Closing Balance',
					'Total'
				]

			};

			vm.tableHead = [
				{
					'header': 'Account',
					'bindingKeys': 'accountDetail.ledger_name'
				},
				{
					'header': 'Opening Balance',
					'bindingKeys': 'this.ob===0? "0":this.ob',
					'eval':true
				},
				{
					'header': 'Credit Amount',
					'bindingKeys': 'this.cr===0? "0": this.cr',
					'eval':true
				},
				{
					'header': 'Debit Amount',
					'bindingKeys': 'this.dr===0? "0": this.dr',
					'eval':true
				},
				{
					'header': 'Closing Balance',
					'bindingKeys': 'this.cb===0? "0":this.cb',
					'eval':true
				},

				{
					'header': 'Total',
					'bindingKeys': 'this.cr===0? "0": this.cr',
					'eval':true
				}

			];
		}
		else if(vm.reportType === 'Bill to Bill'){


			vm.columnSetting ={

				allowedColumn:[
					'Account',
					'Date',
					'Bill No',
					'Bill Amount',
					'CR/DR',
					'Paid Amount',
					'Net Balance',
					'Narration',
					'Due Date',
					'Over Due Days'
				]

			};

			vm.tableHead = [

				{
					'header': 'Account',
					'bindingKeys':'lName'
				},
				{
					'header': 'Date',
					'bindingKeys':'date'

				},
				{
					'header':'Bill No',
					'bindingKeys': '_id.billNo',
					date: false
				},
				{
					'header':'Bill Amount',
					'bindingKeys': 'billAmount',
					date: false
				},
				{
					'header':'CR/DR',
					'bindingKeys': 'cRdr'
				},
				{
					'header':'Paid Amount',
					'bindingKeys':'receivedAmount'
				},
				{
					'header':'Net Balance',
					'bindingKeys':'billAmount-receivedAmount || "0" ',
					'date': false
				},
				{
					'header':'Narration',
					'bindingKeys':'narration'
				},
				{
					'header':'Due Date',
					'bindingKeys':'dueDate || date'
				},
				{
					'header':'Over Due Days',
					'bindingKeys':"(parseInt(('calDays'|dateUtilsFilt:(dueDate || date):date) * 100)/100) || '0'",
					'eval': true
				}

			];


		}


		else if(vm.reportType === 'Group Balance'){


			vm.columnSetting ={

				allowedColumn: [
					'Account',
					'Opening Balance',
					'Op. Dr/Cr',
					'Debit Amount',
					'Credit Amount',
					'Closing Balance',
					'Cl Dr/Cr'
				]

			};

			vm.tableHead = [
				{
					'header': 'Opening Balance',
					'bindingKeys': 'this.ob===0? "0":this.ob',
					'eval':true
				},
				{
					'header': 'Closing Balance',
					'bindingKeys': 'this.cb===0? "0":this.cb',
					'eval':true
				},
				{
					'header': 'Account',
					'bindingKeys': 'account.name'
				},
				{
					'header': 'Debit Amount',
					'bindingKeys': 'this.dr===0? "0": this.dr',
					'eval':true
				},
				{
					'header': 'Credit Amount',
					'bindingKeys': 'this.cr===0? "0": this.cr',
					'eval':true
				},
				{
					'header': 'Op. Dr/Cr',
					'bindingKeys': 'this.ob > 0 ? "Dr" : "Cr"',
					'eval': true
				},
				{
					'header': 'Cl Dr/Cr',
					'bindingKeys': 'this.cb > 0 ? "Dr" : "Cr"',
					'eval': true
				}


			];


		}

		else if(vm.reportType === 'Vehicle Profit Report'){


			vm.columnSetting = {

				allowedColumn: [
					'Vehicle No',
					'Revenue',
					'Expense',
					'Profit'
				]

			};

			vm.tableHead = [
				{
					'header': 'Vehicle No',
					'bindingKeys': 'vehicleNo'
				},
				{
					'header': 'Revenue',
					'bindingKeys': 'revenue'
				},
				{
					'header': 'Expense',
					'bindingKeys': 'duesExp + advExp + voucherExp'
				},
				{
					'header': 'Profit',
					'bindingKeys': 'revenue'
				}
			];


		}

		else if(vm.reportType === 'Vehicle Expense Report'){


			vm.columnSetting ={

				allowedColumn: [
					'Vehicle No',
					'DuesExp',
					'AdvExp',
					'VoucherExp',
					'Expense'

				]

			};

			vm.tableHead = [
				{
					'header': 'Vehicle No',
					'bindingKeys': 'vehicleNo'
				},
				{
					'header': 'DuesExp',
					'bindingKeys': 'duesExp'
				},
				{
					'header': 'AdvExp',
					'bindingKeys': 'advExp'
				},
				{
					'header': 'VoucherExp',
					'bindingKeys': 'voucherExp'
				},
				{
					'header': 'Expense',
					'bindingKeys': 'duesExp + advExp + voucherExp'
				}
			];


		}
		else{

			vm.columnSetting = {
				allowedColumn: [
					'Account',
					'Date',
					'Opening Balance',
					'Op. Dr/Cr',
					'Debit Amount',
					'Credit Amount',
					'Closing Balance',
					'Cl Dr/Cr'
				]
			};
			vm.tableHead = [
				{
					'header': 'Opening Balance',
					'bindingKeys': 'this.ob===0? "0":(this.ob).toFixed(2)',
					'eval':true
				},
				{
					'header': 'Closing Balance',
					'bindingKeys': 'this.cb===0?"0":(this.cb).toFixed(2)',
					'eval':true
				},
				{
					'header': 'Account',
					'bindingKeys': 'account.name'
				},
				{
					'header': 'Debit Amount',
					'bindingKeys': 'this.dr===0? "0": this.dr', //edit
					'eval':true
				},
				{
					'header': 'Credit Amount',
					'bindingKeys': 'this.cr===0? "0": this.cr ',  //edit
					'eval':true
				},
				{
					'header': 'Op. Dr/Cr',
					'bindingKeys': 'this.ob > 0 ? "Dr" : "Cr"',
					'eval': true
				},
				{
					'header': 'Cl Dr/Cr',
					'bindingKeys': 'this.cb > 0 ? "Dr" : "Cr"',
					'eval': true
				}


			];
			if(vm.reportType === 'Account Balance Monthly'){
				vm.tableHead.push({
					'header': 'Date',
					'bindingKeys': 'date',
					'date': 'MMM-yyyy'
				});
			}else{
				vm.tableHead.push({
					'header': 'Date',
					'bindingKeys': 'date'
				});
			}
		}
		vm.lazyLoad = lazyLoadFactory(); // init lazyload

	}

	function onReportChange() {
		vm.oFilter.account=undefined;
		vm.oFilter.type=undefined;
		vm.aAccountMaster=[];
		vm.summary=undefined;
		vm.aBranch = [];
		vm.billtobill();
	}

	function onBranchSelect($item, $model, $label) {
		if(vm.reportType === 'Branch Expense') {
			vm.aBranch.push($item);
			vm.oFilter.branch = null;
		}
	}

	function resetAccountBalace(selectedAccountMaster){

		if (!selectedAccountMaster) {
			growlService.growl("Select atleast one row.", "danger");
			return;
		}

		if (!selectedAccountMaster.account) {
			growlService.growl("Account not found.", "danger");
			return;
		}

		if (!selectedAccountMaster.date) {
			growlService.growl("Account date not found.", "danger");
			return;
		}

		swal({
			title: 'Are you sure you want to RESET the balance?',
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
				let request = {
					account: selectedAccountMaster.account._id,
					start_date: moment(selectedAccountMaster.date).format('YYYY-MM-DD')
				};

				accountingService.resetBalance(request, successCallback, failureCallback);

				function failureCallback(response) {
					console.log(response);
					swal('Error', response.message, 'error');
				}

				function successCallback(response) {
					console.log(response);
					swal('Success', response.message, 'success');
					closeModal();
				}
			}
		});
	return;

	}
	// Get Account Masters from backend
	function getAccountMasters(isGetActive) {

		if(vm.reportType!='Trial Balance' && vm.reportType!='Branch Expense' &&  vm.reportType!='Vehicle Profit Report' &&  vm.reportType!='Vehicle Expense Report'){
			if (!(vm.oFilter.account || vm.oFilter.type)) {
				growlService.growl("Account is mandatory", "danger");
				return;
			}
		}

		if(vm.reportType=='Trial Balance')
		{
			if (!vm.oFilter.to) {
				growlService.growl("Date is mandatory.", "danger");
				return;
			}
		}
		else
		{
			if (!vm.oFilter.from || !vm.oFilter.to) {
				growlService.growl("'From' and 'To' date are mandatory", "danger");
				return;
			}
		}

		if(!vm.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject(vm.oFilter);
		if(vm.reportType === 'Ledger') {
			accountingService.accountBalances(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'Ledger Group') {
			accountingService.accountGroupBalances(oFilter, onSuccess, onFailure);
		}else if (vm.reportType === 'Account Balance') {
			accountingService.accountBalance(oFilter, onSuccess, onFailure);
		}else if (vm.reportType === 'Account Balance Monthly') {
			accountingService.accountBalanceMonthly(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'Group Balance') {
			accountingService.groupBalanceSummary(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'Trial Balance') {
			accountingService.detailTrailBalance(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'Group Trial Balance') {
         	accountingService.groupTrailBalance(oFilter, onSuccess, onFailure);
         } else if (vm.reportType === 'Bill to Bill' || vm.reportType ==='Aging Report') {
			accountingService.accountBilltoBill(oFilter, onSuccess, onFailure);
		} else if (vm.reportType === 'Opening Balance') {
			accountingService.accOpeningBal(oFilter, onSuccess, onFailure);
		}else if (vm.reportType === 'Vehicle Profit Report') {
			accountingService.vehicleProfitReport(oFilter, onSuccess, onFailure);
		}else if (vm.reportType === 'Vehicle Expense Report') {
			accountingService.vehicleExpenseReport(oFilter, onSuccess, onFailure);
		}

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			if(vm.reportType === 'Bill to Bill') {
				response = response.data;
			} else if(vm.reportType === 'Group Trial Balance') {
				response = response && response.data && response.data[0];
				response.data = response.ledgers;
				delete response.ledgers;
			}
			vm.summary = response.summary;
			vm.lazyLoad.putArrInScope.call(vm, isGetActive, response);
			vm.tCr = response.tCr;
			vm.tDr = response.tDr;
			// vm.tableApi && vm.tableApi.refresh();

		}
	}

	function accountmaster(viewValue,type) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
					sort: {
						name: 1
					}
				};
				if(vm.reportType === 'Ledger') req.isGroup = false;
				else if(vm.reportType === 'Ledger Group') req.isGroup = true;
				else if(vm.reportType === 'Trial Balance' && vm.reportType=== 'Group Trial Balance')
				{
					if(type==='true')
						req.isGroup = true;
					else
						req.isGroup = false;
				}
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

	function dateChange(dateType) {

		if (dateType === 'startDate' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.to instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() -  vm.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
			else if(monthRange ===3 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.from);
				vm.oFilter.to = new Date(date.setMonth(date.getMonth() + 3));
			}

		} else if (dateType === 'endDate' && vm.oFilter.to && vm.oFilter.from) {

			let isDate = vm.oFilter.from instanceof Date,
				monthRange = vm.oFilter.to.getMonth() - vm.oFilter.from.getMonth(),
				dateRange = vm.oFilter.to.getDate() - vm.oFilter.from.getDate(),
				isNotValid = false;
			monthRange += (vm.oFilter.to.getFullYear() - vm.oFilter.from.getFullYear()) * 12;

			if(monthRange === 0)
				isNotValid = dateRange < 0;
			else if(monthRange === 1)
				isNotValid = monthRange < 0 ? true: false;
			// else if(monthRange === 1)
			// 	isNotValid = monthRange < 0 ? true : (30 - vm.oFilter.from.getDate() + vm.oFilter.to.getDate() > 30 ? true : false);
			else if(monthRange ===3 && (vm.oFilter.from.getDate() < vm.oFilter.to.getDate()))
				isNotValid = true;
			else if(monthRange === 2 || monthRange === 3)
				isNotValid = false;
			else
				isNotValid = true;

			if (isDate && isNotValid) {
				let date = new Date(vm.oFilter.to);
				vm.oFilter.from = new Date(date.setMonth(date.getMonth() - 3));
			}
		}
	}

	function downloadReport() {

		if(!(vm.oFilter.from && vm.oFilter.to)){
			swal('warning', "Both From and To Date should be Filled",'warning');
			return;
		}
		// if(!vm.lazyLoad.update(false))
		// 	return;
		var oFilter = prepareFilterObject(vm.oFilter);
		if(vm.reportType === 'Trial Balance' || vm.reportType === 'Group Trial Balance')
			oFilter.download = 'trialBalanceDetail';
		if(vm.reportType === 'Particulars Trial Balance')
			oFilter.download = true;
		else if(vm.reportType === 'Account Balance Monthly') {
			oFilter.report = 'monthlyR';
			oFilter.download = true;
		}else
			oFilter.download = true;

		oFilter.all = true;

		if(vm.reportType === 'Bill to Bill')
			accountingService.bill2billRpt(oFilter, successCallback, failureCallback);
		else if (vm.reportType === 'Trial Balance') {
			accountingService.detailTrailBalance(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Group Trial Balance') {
             accountingService.groupTrailBalance(oFilter, successCallback, failureCallback);
         } else if (vm.reportType === 'Particulars Trial Balance') {
			accountingService.particularTrailBalance(oFilter, successCallback, failureCallback);
		} else if (vm.reportType === 'Branch Expense') {
			oFilter.reportType = vm.reportType;
			accountingService.branchExpenseRpt(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Ledger Outstanding Report Daywise') {
			oFilter.reportType = vm.reportType;
			accountingService.billLedgerOutstandingRpt(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Ledgers Outstanding Report Period Wise') {
			oFilter.reportType = vm.reportType;
			accountingService.billLedgOutstmonthlyRpt(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Account Balance') {
			oFilter.reportType = vm.reportType;
			accountingService.accountBalance(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Account Balance Monthly') {
			oFilter.reportType = vm.reportType;
			accountingService.accountBalanceMonthly(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Opening Balance') {
			oFilter.reportType = vm.reportType;
			if(!(oFilter.account || oFilter.group))
				return swal('warning', "Account or group required",'warning');
			accountingService.accOpeningBal(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Ledger Group') {
			oFilter.reportType = vm.reportType;
			if(!oFilter.type)
				return swal('warning', "Account Group is required",'warning');
				accountingService.accountGroupBalances(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Group Balance') {
			oFilter.reportType = vm.reportType;
			if(!oFilter.type)
				return swal('warning', "Account Group is required",'warning');
				accountingService.groupBalanceSummary(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Profit and Loss Summary' || vm.reportType === 'Profit and Loss Detail') {
			oFilter.reportType = vm.reportType;
			accountingService.profitAndLossReport(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Vehicle Profit Report') {
			oFilter.reportType = vm.reportType;
			accountingService.vehicleProfitReport(oFilter, successCallback, failureCallback);
		}else if (vm.reportType === 'Vehicle Expense Report') {
			oFilter.reportType = vm.reportType;
			accountingService.vehicleExpenseReport(oFilter, successCallback, failureCallback);
		}else if(vm.reportType === 'Daywise Cost Center'){
			oFilter.reportType = vm.reportType;
			accountingService.costCenterRpt(oFilter,successCallback, failureCallback);
		}else
			accountingService.accountBalances(oFilter, successCallback, failureCallback);

		function failureCallback(err) {
			console.log(err);
			swal('Error!', 'Message not defined', 'error');
		}

		function successCallback(res) {
			if(res.url){
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			}
			else{
				swal('error', 'No Data Found', 'warning');
			}
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.billNo !== 'undefined')
			requestFilter.billNo = oFilter.billNo;

		if (typeof oFilter.refNo !== 'undefined')
			requestFilter.refNo = oFilter.refNo;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = moment(oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = moment(oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();

		if (typeof oFilter.account !== 'undefined')
			requestFilter.account = oFilter.account._id;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type._id;

		if (typeof oFilter.status !== 'undefined')
			requestFilter.status = oFilter.status;

		if (typeof oFilter.group !== 'undefined')
			requestFilter.group = oFilter.group;

		if (typeof oFilter.aggregateBy !== 'undefined')
			requestFilter.aggregateBy = oFilter.aggregateBy;

		if (oFilter.branch || vm.aBranch.length) {
			if(vm.reportType === 'Branch Expense' && vm.aBranch.length) {
				requestFilter.branch = vm.aBranch.map(o => o._id);
			}else
				requestFilter.branch = oFilter.branch._id;
		}

		if (typeof oFilter.customer !== 'undefined')
			requestFilter.customer = oFilter.customer._id;

		if (typeof oFilter.billingParty !== 'undefined')
			requestFilter.billingParty = oFilter.billingParty._id;

		if (vm.oFilter.category) {
			requestFilter.category = vm.oFilter.category;
		}

		if(vm.oFilter.costCenterName){
			requestFilter.costCenter = vm.oFilter.costCenterName;
		}

		requestFilter.skip = vm.lazyLoad.getCurrentPage();
		requestFilter.no_of_docs = 20;
		requestFilter.sort = {date: 1};
		return requestFilter;
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

	// function selectThisRow(oAccountMaster, index) {
	// 	var row = $('.selectItem');
	// 	$(row).removeClass('grn');
	// 	$(row[index]).addClass('grn');
	// 	vm.selectedAccountMaster = oAccountMaster;
	// }

	//////////////////////////////////////////////////

});


//ledger Controller


materialAdmin.controller('ledgerController', function (
	$modal,
	$uibModal,
	$scope,
	accountingService,
	DatePicker,
	Pagination,
	growlService,
	branchService
) {

	// object Identifiers
	$scope.aVouchers = []; // to contain vouchers
	$scope.aAccountMaster = [];
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.aggrs = [{label: 'From', value: 'from'}, {label: 'To', value: 'to'}, {label: 'Type', value: 'type'}];
	$scope.maxDate = new Date();

	// functions Identifiers
	$scope.getVouchers = getVouchers;
	$scope.accountmaster = accountmaster;
	$scope.resetFilter = resetFilter;
	$scope.openBalRep = openBalRep;
	$scope.PreviewDayWiseOB = PreviewDayWiseOB;
	$scope.getAllBranch = getAllBranch;

	// INIT functions
	(function init() {
		// $scope.oFilter.to_date = new Date();
		// $scope.oFilter.from_date = new Date(new Date().setDate(new Date($scope.oFilter.to_date).getDate() - 365));

		$scope.initialFilter = angular.copy($scope.oFilter);
	})();

	//Functions

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

	function resetFilter() {
		$scope.oFilter = angular.copy($scope.initialFilter);
	}

	// Get Ledger from backend
	function getVouchers(isDownloadTrue) {

		var oFilter = prepareFilterObject($scope.oFilter);
		if (!oFilter)
			return;
		if (isDownloadTrue) {
			oFilter.download = true;
			oFilter.all = true;
		}
		accountingService.getLedger(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aVouchers = response.data.data;
				$scope.summary = response.data.summary;

				if($scope.oFilter.ledger.group.indexOf('banks') != -1) {
					$scope.showBankReconAmt = true;
					// $scope.aVouchers.forEach(oVch => {
					// 	if(!(oVch.chequeClear && oVch.chequeClear.date)) {
					// 		$scope.summary.ucChequeAmt = $scope.summary.ucChequeAmt || 0;
					// 		$scope.summary.ucChequeAmt += oVch.ledgers.reduce((acc, oLed) => acc + (oLed.cRdR === 'CR' ? oLed.amount : 0), 0);
					// 	}
					// 	$scope.summary.cbWUcCAmt = Math.abs($scope.summary.cb - $scope.summary.ucChequeAmt);
					// });
				}else
					$scope.showBankReconAmt = false;

				// update pagination
				$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.data.count;
			}
		}
	}

	function PreviewDayWiseOB() {
		if (!$scope.oFilter.ledger) {
			growlService.growl("Ledger name not selected", "danger");
			return;
		}

		if (!$scope.oFilter.from_date && !$scope.oFilter.to_date) {
			growlService.growl("From Date and To Date not selected", "danger");
			return;
		}


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

						$scope.getGR = function (templateKey = 'ledgerPreview') {

							var oFilter = {
								ledger: otherData._id,
								address: otherData.address,
								from_date: otherData.from,
								to_date: otherData.to,
								ledgerTemp: templateKey
							};

							clientService.ledgerPreview(oFilter, success, fail);
						};

						$scope.getGR();

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
							excelDownload.html(id, 'sheet 1', `${'ledgerPreview'}_${moment().format('DD-MM-YYYY')}`);
						}
					}],
				resolve: {
					otherData: function () {

						return {
							_id: $scope.oFilter.ledger._id,
							address: $scope.oFilter.ledger.address,
							from: moment($scope.oFilter.from_date, 'DD/MM/YYYY').toISOString(),
							to: moment($scope.oFilter.to_date, 'DD/MM/YYYY').toISOString()
						};
					}
				}
			});
		}


	function openBalRep() {
		if (!$scope.oFilter.ledger) {
			growlService.growl("Ledger name not selected", "danger");
			return;
		}

		if (!$scope.oFilter.from_date && !$scope.oFilter.to_date) {
			growlService.growl("From Date and To Date not selected", "danger");
			return;
		}

		let oSend = {accounts:[$scope.oFilter.ledger._id]};
		if ($scope.oFilter.from_date) {
			oSend['from'] = $scope.oFilter.from_date;
		}
		if ($scope.oFilter.to_date) {
			oSend['to'] = $scope.oFilter.to_date;
		}
		accountingService.openBalRep(oSend, onSuccess, onFailure);
		function onSuccess(response) {
			var a = document.createElement('a');
			a.href = response.url.url;
			a.download = response.url.url;
			a.target = '_blank';
			a.click();
		}
		function onFailure(response) {
			swal('Error!', 'Message not defined', 'error');
		}
	}

	function accountmaster(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
					sort: {name: 1}
				};
				// if ($scope.operationType === 'Edit' && $scope.oAccountMaster && $scope.oAccountMaster.lvl) {
				// 	req['lvlLessThan'] = $scope.oAccountMaster.lvl;
				// }
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

	function getAccountMasters() {

		accountingService.getAccountMaster({}, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMaster = response.data.data;
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.voucherId !== 'undefined')
			requestFilter.voucherId = oFilter.voucherId;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.particular !== 'undefined')
			requestFilter.particular = oFilter.particular;

		if (typeof oFilter.from_date !== 'undefined')
			requestFilter.from_date = moment(oFilter.from_date, 'DD/MM/YYYY').toISOString();
		else {
			swal('Error', 'Select From Date', 'error');
			return false;
		}

		if (typeof oFilter.to_date !== 'undefined')
			requestFilter.to_date = moment(oFilter.to_date, 'DD/MM/YYYY').toISOString();
		else {
			swal('Error', 'Select To Date', 'error');
			return false;
		}

		if (typeof oFilter.name !== 'undefined')
			requestFilter.name = oFilter.name;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = [oFilter.from._id];

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = [oFilter.to._id];

		if (typeof oFilter.ledger !== 'undefined')
			requestFilter.ledger = oFilter.ledger._id;
		else {
			swal('Error', 'Select Ledger A/c', 'error');
			return false;
		}

		if (typeof oFilter.branch !== 'undefined')
			requestFilter.branch = oFilter.branch._id;

		if (typeof oFilter.aggregateBy !== 'undefined')
			requestFilter.aggregateBy = oFilter.aggregateBy;

		// requestFilter.skip = $scope.pagination.currentPage;
		// requestFilter.no_of_docs = $scope.pagination.items_per_page;
		requestFilter.all = 'true';

		return requestFilter;
	}

	//////////////////////////////////////////////////

});

//bankReconciliation Controller

materialAdmin.controller('bankReconciliationCtrl', function (
	$modal,
	$uibModal,
	$scope,
	accountingService,
	DatePicker,
	Pagination,
	growlService,
	branchService
) {

	// object Identifiers
	$scope.aVouchers = []; // to contain vouchers
	$scope.aAccountMaster = [];
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.aggrs = [{label: 'From', value: 'from'}, {label: 'To', value: 'to'}, {label: 'Type', value: 'type'}, {label: 'asOnDate', value: 'asOnDate'}];
	$scope.maxDate = new Date();

	// functions Identifiers
	$scope.getVouchers = getVouchers;
	$scope.accountGet = accountGet;
	$scope.resetFilter = resetFilter;
	$scope.openBalRep = openBalRep;
	$scope.PreviewDayWiseOB = PreviewDayWiseOB;
	$scope.getAllBranch = getAllBranch;

	// INIT functions
	(function init() {
		// $scope.oFilter.to_date = new Date();
		// $scope.oFilter.from_date = new Date(new Date().setDate(new Date($scope.oFilter.to_date).getDate() - 365));

		$scope.initialFilter = angular.copy($scope.oFilter);
	})();

	//Functions

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

	function resetFilter() {
		$scope.oFilter = angular.copy($scope.initialFilter);
	}

	// Get Ledger from backend
	function getVouchers(isDownloadTrue) {

		var oFilter = prepareFilterObject($scope.oFilter);
		if (!oFilter)
			return;
		if (isDownloadTrue) {
			oFilter.download = true;
			oFilter.all = true;
		}
		accountingService.getbankReconciliation(oFilter, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aVouchers = response.data.data;
				$scope.summary = response.data.summary;

				if($scope.oFilter.ledger.group.indexOf('banks') != -1) {
					$scope.showBankReconAmt = true;
					$scope.aVouchers.forEach(oVch => {
						if(!(oVch.chequeClear && oVch.chequeClear.date)) {
							$scope.summary.ucChequeAmt = $scope.summary.ucChequeAmt || 0;
							$scope.summary.ucChequeAmt += oVch.ledgers.reduce((acc, oLed) => acc + (oLed.cRdR === 'CR' ? oLed.amount : 0), 0);
						}
						$scope.summary.cbWUcCAmt = Math.abs($scope.summary.cb - $scope.summary.ucChequeAmt);
					});
				}else
					$scope.showBankReconAmt = false;

				// update pagination
				$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.data.count;
			}
		}
	}

	function PreviewDayWiseOB() {
		if (!$scope.oFilter.ledger) {
			growlService.growl("Ledger name not selected", "danger");
			return;
		}

		if (!$scope.oFilter.from_date && !$scope.oFilter.to_date) {
			growlService.growl("From Date and To Date not selected", "danger");
			return;
		}


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

					$scope.getGR = function (templateKey = 'ledgerPreview') {

						var oFilter = {
							ledger: otherData._id,
							address: otherData.address,
							from_date: otherData.from,
							to_date: otherData.to,
							ledgerTemp: templateKey
						};

						clientService.ledgerPreview(oFilter, success, fail);
					};

					$scope.getGR();

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
						excelDownload.html(id, 'sheet 1', `${'ledgerPreview'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					return {
						_id: $scope.oFilter.ledger._id,
						address: $scope.oFilter.ledger.address,
						from: moment($scope.oFilter.from_date, 'DD/MM/YYYY').toISOString(),
						to: moment($scope.oFilter.to_date, 'DD/MM/YYYY').toISOString()
					};
				}
			}
		});
	}


	function openBalRep() {
		if (!$scope.oFilter.ledger) {
			growlService.growl("Ledger name not selected", "danger");
			return;
		}

		if (!$scope.oFilter.from_date && !$scope.oFilter.to_date) {
			growlService.growl("From Date and To Date not selected", "danger");
			return;
		}

		let oSend = {accounts:[$scope.oFilter.ledger._id]};
		if ($scope.oFilter.from_date) {
			oSend['from'] = $scope.oFilter.from_date;
		}
		if ($scope.oFilter.to_date) {
			oSend['to'] = $scope.oFilter.to_date;
		}
		accountingService.openBalRep(oSend, onSuccess, onFailure);
		function onSuccess(response) {
			var a = document.createElement('a');
			a.href = response.url.url;
			a.download = response.url.url;
			a.target = '_blank';
			a.click();
		}
		function onFailure(response) {
			swal('Error!', 'Message not defined', 'error');
		}
	}

	function accountGet(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 15,
					sort: {name: 1},
					group: ['banks']
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

	function getAccountMasters() {

		accountingService.getAccountMaster({}, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!', 'Message not defined', 'error');
		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMaster = response.data.data;
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.voucherId !== 'undefined')
			requestFilter.voucherId = oFilter.voucherId;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.particular !== 'undefined')
			requestFilter.particular = oFilter.particular;

		if (oFilter.from_date)
			requestFilter.from_date = moment(oFilter.from_date, 'DD/MM/YYYY').toISOString();
		else  if(!oFilter.asOnDate ){
			swal('Error', 'Select From Date', 'error');
			return false;
		}

		if (oFilter.to_date)
			requestFilter.to_date = moment(oFilter.to_date, 'DD/MM/YYYY').toISOString();
		else if(!oFilter.asOnDate) {
			swal('Error', 'Select To Date', 'error');
			return false;
		}
		if (oFilter.asOnDate)
			requestFilter.asOnDate = moment(oFilter.asOnDate, 'DD/MM/YYYY').toISOString();

		if (typeof oFilter.name !== 'undefined')
			requestFilter.name = oFilter.name;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = [oFilter.from._id];

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = [oFilter.to._id];

		if (oFilter.cheque) {
			if (oFilter.cheque === 'Clear') {
				requestFilter['chequeClear.date'] = {$exists: true};
			} else {
				requestFilter['chequeClear.date'] = {$exists: false};
			}
		}

		if (typeof oFilter.ledger !== 'undefined')
			requestFilter.ledger = oFilter.ledger._id;
		else {
			swal('Error', 'Select Ledger A/c', 'error');
			return false;
		}

		if (typeof oFilter.branch !== 'undefined')
			requestFilter.branch = oFilter.branch._id;

		if (typeof oFilter.aggregateBy !== 'undefined')
			requestFilter.aggregateBy = oFilter.aggregateBy;

		// requestFilter.skip = $scope.pagination.currentPage;
		// requestFilter.no_of_docs = $scope.pagination.items_per_page;
		requestFilter.all = 'true';

		return requestFilter;
	}

	//////////////////////////////////////////////////

});

// GST Report Controllers

materialAdmin.controller('accountGSTReportController', function (
	$modal,
	$scope,
	accountingService,
	DatePicker,
	Pagination
) {

	// object Identifiers
	$scope.aReport = []; // to contain vouchers
	$scope.aReportType = [
		'CGST',
		'SGST',
		'IGST'
	];
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination


	// functions Identifiers
	$scope.getReport = getReport;

	// INIT functions
	(function init() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setDate(new Date($scope.oFilter.to_date).getDate() - 7));
		getReport();
	})();


	// Actual Functions

	// Get Day Book from backend
	function getReport(isDownloadTrue) {

		var oFilter = prepareFilterObject($scope.oFilter);
		if (isDownloadTrue)
			oFilter.download = true;
		accountingService.getAccountReportTax(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aReport = response.data;

				// update pagination
				$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.data.count;
			}
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.from_date !== 'undefined')
			requestFilter.from_date = oFilter.from_date;

		if (typeof oFilter.to_date !== 'undefined')
			requestFilter.to_date = oFilter.to_date;

		return requestFilter;
	}

	//////////////////////////////////////////////////

});


// TDS Report Controllers

materialAdmin.controller('accountTDSReportController', function (
	$modal,
	$scope,
	accountingService,
	DatePicker,
	Pagination
) {

	// object Identifiers
	$scope.aReport = []; // to contain vouchers
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination


	// functions Identifiers
	$scope.getReport = getReport;

	// INIT functions
	(function init() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setDate(new Date($scope.oFilter.to_date).getDate() - 7));
		getReport();
	})();


	// Actual Functions

	// Get Day Book from backend
	function getReport(isDownloadTrue) {

		var oFilter = prepareFilterObject($scope.oFilter);
		if (isDownloadTrue)
			oFilter.download = true;
		accountingService.getAccountReportTDS(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.data.url;
				a.download = response.data.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aReport = response.data;

				// update pagination
				$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.data.count;
			}
		}
	}

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.from_date !== 'undefined')
			requestFilter.from_date = oFilter.from_date;

		if (typeof oFilter.to_date !== 'undefined')
			requestFilter.to_date = oFilter.to_date;

		return requestFilter;
	}

	//////////////////////////////////////////////////

});


// GSTR-1 Report Controllers

materialAdmin.controller('accountgstr-1Controller', function (
	$scope
) {

	// object Identifiers

	// functions Identifiers

	$scope.downloadSheet = downloadSheet;

	// INIT functions
	(function init() {
		$scope.aReportType = [
			{
				name: 'GSTR1',
				path: 'views/accounting/gstr1.html'
			},
			{
				name: 'Invoice',
				path: 'views/accounting/invoiceReport.html'
			},
			{
				name: 'Cr-Dr Note',
				path: 'views/accounting/crDrReport.html'
			},
			{
				name: 'GST Computation',
				path: 'views/accounting/gstComputation.html'
			},
			{
				name: 'GST Payment',
				path: 'views/accounting/gstPayment.html'
			}

		];
		$scope.reportType = $scope.aReportType[0];
	})();

	// Actual Functions

	function downloadSheet() {
		$scope.$broadcast('downloadAccountEvent', $scope.aggregateBy); // it broadcast the event for child controller to for downloading respective data
	}

	//////////////////////////////////////////////////

});


// Invoice Report Controllers

materialAdmin.controller('accountInvoiceReportController', function (
	$scope,
	accountingService,
	DatePicker,
	Pagination
) {

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oFilter = {};
	$scope.Pagination = angular.copy(Pagination);

	// functions Identifiers

	$scope.getInvoiceReport = getInvoiceReport;
	$scope.setDefaultDate 	= setDefaultDate;
	$scope.submit 			= submit;
	$scope.searchGstComp 	= searchGstComp;
	$scope.getGstCompReport = getGstCompReport;

	// INIT functions
	(function init() {
		setDefaultDate();
		getInvoiceReport();

		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadAccountEvent', function () {
			submit($scope.invoiceReport, true);
		});
	})();

	// Actual Functions

	function getInvoiceReport(isDownloadTrue) {

		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue)
			request.download = true;
		accountingService.getGSTR1InvoiceReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aReport = response.data;

				// $scope.Pagination.total_pages = response.data.count/$scope.Pagination.items_per_page;
				// $scope.Pagination.totalItems = response.data.count;
			}
		}
	}

	function getGstCompReport(isDownloadTrue) {

		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue) {
			request.download = true;
			request.downloadName = "GSTComputation";
		}
		accountingService.getGSTR1ComputationReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {

				if(response.data && response.data.data && response.data.data.length>0){
					let aGstCmp = response.data.data;
					// for (var i = 0; i < aGstCmp.length; i++) {
					// 					// 	aGstCmp[i].crAc = [];
					// 					// 	aGstCmp[i].drAc = [];
					// 					// 	aGstCmp[i].drAmt = [];
					// 					// 	aGstCmp[i].crAmt = [];
					// 					// 	aGstCmp[i].crAmtIGST = [];
					// 					// 	aGstCmp[i].crAmtCGST = [];
					// 					// 	aGstCmp[i].crAmtSGST = [];
					// 					// 	aGstCmp[i].crAmtCRAMT = [];
					// 					//
					// 					// 	aGstCmp[i].billNo = new Set();
					// 					// 	aGstCmp[i].tAmt = 0;
					// 					// 	for (var k = 0; k < aGstCmp[i].ledgers.length; k++) {
					// 					// 		if (aGstCmp[i].ledgers[k].cRdR == 'CR') {
					// 					// 			aGstCmp[i].crAc.push(aGstCmp[i].ledgers[k].lName);
					// 					// 			if(aGstCmp[i].ledgers[k].lName=='IGST')
					// 					// 				aGstCmp[i].crAmtIGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else if(aGstCmp[i].ledgers[k].lName=='CGST')
					// 					// 				aGstCmp[i].crAmtCGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else if(aGstCmp[i].ledgers[k].lName=='SGST')
					// 					// 				aGstCmp[i].crAmtSGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else
					// 					// 				aGstCmp[i].crAmtCRAMT.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					//
					// 					// 			aGstCmp[i].tAmt += aGstCmp[i].ledgers[k].amount;
					// 					//
					// 					// 		} else {
					// 					// 			aGstCmp[i].drAc.push(aGstCmp[i].ledgers[k].lName);
					// 					// 			aGstCmp[i].drAmt.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 		}
					// 					//
					// 					// 		if (aGstCmp[i].ledgers[k].bills.length) {
					// 					// 			(aGstCmp[i].ledgers[k].bills).forEach(o => aGstCmp[i].billNo.add(o.billNo));
					// 					// 		}
					// 					// 	}
					// 					//
					// 					//
					// 					// 	aGstCmp[i].billNo = [...aGstCmp[i].billNo].join(',');
					// 					//
					// 					// }

					$scope.aGSTComputationReport = aGstCmp;
				}
			}
		}
	}

	function prepareFilter(oFilter) {
		let filter = {};

		if (oFilter.from_date)
			filter.from_date = oFilter.from_date.toISOString();

		if (oFilter.to_date)
			filter.to_date = oFilter.to_date.toISOString();

		filter.skip = $scope.Pagination.currentPage;
		filter.no_of_docs = $scope.Pagination.items_per_page;

		return filter;
	}

	function setDefaultDate() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setMonth(new Date($scope.oFilter.to_date).getMonth() - 1));
	}

	function submit(formData, isDownloadTrue) {
		if (formData.$valid)
			getInvoiceReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	function searchGstComp(formData, isDownloadTrue) {
		if (formData.$valid)
			getGstCompReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	//////////////////////////////////////////////////

});

// GST Computation Controller

materialAdmin.controller('gstComputationReportController', function (
	$scope,
	accountingService,
	DatePicker,
	Pagination
) {

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oFilter = {};
	$scope.Pagination = angular.copy(Pagination);

	// functions Identifiers

	$scope.setDefaultDate 	= setDefaultDate;
	$scope.submit 			= submit;
	$scope.searchGstComp 	= searchGstComp;
	$scope.getGstCompReport = getGstCompReport;

	// INIT functions
	(function init() {
		setDefaultDate();
		getGstCompReport();

		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadAccountEvent', function () {
			submit($scope.gstCompReport, true);
		});
	})();

	// Actual Functions


	function getGstCompReport(isDownloadTrue) {

		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue) {
			request.download = true;
			request.downloadName = "GSTComputation";
		}
		accountingService.getGSTR1ComputationReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {

				if(response.data && response.data.data && response.data.data.length>0){
					let aGstCmp = response.data.data;
					// for (var i = 0; i < aGstCmp.length; i++) {
					// 					// 	aGstCmp[i].crAc = [];
					// 					// 	aGstCmp[i].drAc = [];
					// 					// 	aGstCmp[i].drAmt = [];
					// 					// 	aGstCmp[i].crAmt = [];
					// 					// 	aGstCmp[i].crAmtIGST = [];
					// 					// 	aGstCmp[i].crAmtCGST = [];
					// 					// 	aGstCmp[i].crAmtSGST = [];
					// 					// 	aGstCmp[i].crAmtCRAMT = [];
					// 					//
					// 					// 	aGstCmp[i].billNo = new Set();
					// 					// 	aGstCmp[i].tAmt = 0;
					// 					// 	for (var k = 0; k < aGstCmp[i].ledgers.length; k++) {
					// 					// 		if (aGstCmp[i].ledgers[k].cRdR == 'CR') {
					// 					// 			aGstCmp[i].crAc.push(aGstCmp[i].ledgers[k].lName);
					// 					// 			if(aGstCmp[i].ledgers[k].lName=='IGST')
					// 					// 				aGstCmp[i].crAmtIGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else if(aGstCmp[i].ledgers[k].lName=='CGST')
					// 					// 				aGstCmp[i].crAmtCGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else if(aGstCmp[i].ledgers[k].lName=='SGST')
					// 					// 				aGstCmp[i].crAmtSGST.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 			else
					// 					// 				aGstCmp[i].crAmtCRAMT.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					//
					// 					// 			aGstCmp[i].tAmt += aGstCmp[i].ledgers[k].amount;
					// 					//
					// 					// 		} else {
					// 					// 			aGstCmp[i].drAc.push(aGstCmp[i].ledgers[k].lName);
					// 					// 			aGstCmp[i].drAmt.push((aGstCmp[i].ledgers[k].amount).toFixed(2));
					// 					// 		}
					// 					//
					// 					// 		if (aGstCmp[i].ledgers[k].bills.length) {
					// 					// 			(aGstCmp[i].ledgers[k].bills).forEach(o => aGstCmp[i].billNo.add(o.billNo));
					// 					// 		}
					// 					// 	}
					// 					//
					// 					//
					// 					// 	aGstCmp[i].billNo = [...aGstCmp[i].billNo].join(',');
					// 					//
					// 					// }

					$scope.aGSTComputationReport = aGstCmp;
				}
			}
		}
	}

	function prepareFilter(oFilter) {
		let filter = {};

		if (oFilter.from_date)
			//filter.from_date = oFilter.from_date.toISOString();
			filter.from_date = new Date(new Date(oFilter.from_date).setHours(0, 0, 0)).toISOString();

		if (oFilter.to_date)
			filter.to_date = new Date(new Date(oFilter.to_date).setHours(23, 59, 59)).toISOString();

		filter.skip = $scope.Pagination.currentPage;
		filter.no_of_docs = $scope.Pagination.items_per_page;

		return filter;
	}

	function setDefaultDate() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setMonth(new Date($scope.oFilter.to_date).getMonth() - 1));
	}

	function submit(formData, isDownloadTrue) {
		if (formData.$valid)
			getGstCompReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	function searchGstComp(formData, isDownloadTrue) {
		if (formData.$valid)
			getGstCompReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	//////////////////////////////////////////////////

});

//GSTR1 Report controller for summary and monthly report

materialAdmin.controller('gstr1ReportController', function (
	$scope,
	accountingService,
	DatePicker,
) {

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oFilter = {};
	$scope.aReport = [];
	$scope.aReportgst = [];
	// functions Identifiers

	$scope.setDefaultDate 	= setDefaultDate;
	$scope.submit = submit;
	$scope.searchGstr1ReportType 	= searchGstr1ReportType;
	$scope.getGstr1MonthlyReport = getGstr1MonthlyReport;
	$scope.getGstr1SummaryReport = getGstr1SummaryReport;
	$scope.getGstr1CreditNoteReport = getGstr1CreditNoteReport;


	// INIT functions
	(function init() {
		setDefaultDate();


		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadAccountEvent', function () {
			if($scope.reportType){
			submit($scope.gstr1Report,$scope.reportType,true,);
			}else{
				swal('', ' Please Select Bill Report Type', 'warning');
			}
		});
	})();
	// Actual Functions
	function getGstr1MonthlyReport(isDownloadTrue) {
		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue) {
			request.download = true;
		}
		accountingService.getGSTR1MonthlyReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else{
		 	        $scope.aReport = [];
						aReportgst = [];
		           if(response.data && response.data[0].data && response.data[0].data.length>0){
					  $scope.aReport = response.data[0].data;
					$scope.aReportgst = response.data[0];
					  $scope.totaltaxaablefreight	= ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
					  $scope.totaltax = ($scope.aReportgst.totaligstAmount+$scope.aReportgst.totalsgstAmount+$scope.aReportgst.totalcgstAmount).toFixed(2);
					  $scope.grandtotaltax = (($scope.aReportgst.totaligstAmount+$scope.aReportgst.totalsgstAmount+$scope.aReportgst.totalcgstAmount)-($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue)).toFixed(2);
					  $scope.totalCreditNotetaxValue  = '(-)'+($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.grandtotaltaxable = ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.totalinvoiceAmt = ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
					  $scope.grandtotalinvoiceAmt = ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);
					  $scope.aReportgst.totalCreditNoteTaxableValue = '(-)'+ ($scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.aReportgst.totalCreditNoteInvoiceValue =  '(-)' +($scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);

		          	}
			}
		}
	}
	function getGstr1SummaryReport(isDownloadTrue) {

		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue) {
			request.download = true;
		}
		accountingService.getGSTR1SummaryReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				     $scope.aReport = [];
					  $scope.aReportgst = [];
			        if(response.data && response.data[0].data && response.data[0].data.length>0){
					  $scope.aReport = response.data[0].data;
					$scope.aReportgst = response.data[0];
                 $scope.totaltaxaablefreight	= ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
					  $scope.totaltax = ($scope.aReportgst.totaligstAmount+$scope.aReportgst.totalsgstAmount+$scope.aReportgst.totalcgstAmount).toFixed(2);
					  $scope.grandtotaltax = (($scope.aReportgst.totaligstAmount+$scope.aReportgst.totalsgstAmount+$scope.aReportgst.totalcgstAmount)-($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue)).toFixed(2);
					  $scope.totalCreditNotetaxValue  = '(-)'+($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.grandtotaltaxable = ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.totalinvoiceAmt = ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
					  $scope.grandtotalinvoiceAmt = ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);
					  $scope.aReportgst.totalCreditNoteTaxableValue = '(-)'+ ($scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
					  $scope.aReportgst.totalCreditNoteInvoiceValue =  '(-)' +($scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);
					  }
		      	}

			}
	}
		function getGstr1CreditNoteReport(isDownloadTrue) {
		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue) {
			request.download = true;
		}
		accountingService.getGSTR1CreditNoteReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
			}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
			        $scope.aReport = [];
					  $scope.aReportgst = [];
					  $scope.totaligst = 0;
					  $scope.totalcgst = 0;
					  $scope.totalsgst = 0;
			       if(response.data && response.data.length>0){
				    $scope.aReport = response.data[0].data;
					 $scope.aReportgst = response.data[0];
			 		 $scope.totaltaxaablefreight	= ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
				    $scope.totaltax = ($scope.aReportgst.totalIGSTAmount+$scope.aReportgst.totalSGSTAmount+$scope.aReportgst.totalCGSTAmount).toFixed(2);
				    $scope.grandtotaltax = (($scope.aReportgst.totalIGSTAmount+$scope.aReportgst.totalSGSTAmount+$scope.aReportgst.totalCGSTAmount)-($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue)).toFixed(2);
			       $scope.totalCreditNotetaxValue  = '(-)'+ ($scope.aReportgst.totalCreditNoteInvoiceValue - $scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
			       $scope.grandtotaltaxable = ($scope.aReportgst.totalTaxableFreightValue -$scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
				    $scope.totalinvoiceAmt =  ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
				    $scope.grandtotalinvoiceAmt = ($scope.aReportgst.totalAfterTaxAmount - $scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);
				    $scope.aReportgst.totalCreditNoteTaxableValue = '(-)'+ ($scope.aReportgst.totalCreditNoteTaxableValue).toFixed(2);
				    $scope.aReportgst.totalCreditNoteInvoiceValue =  '(-)' +($scope.aReportgst.totalCreditNoteInvoiceValue).toFixed(2);
					 $scope.aReportgst.totalWithoutGSTBillValue = ($scope.aReportgst.totalWithoutGSTBillValue).toFixed(2);
					//  $scope.aReportgst.totalcgstAmounts = '(-)'+($scope.aReportgst.totalCGSTAmount).toFixed(2);
					//  $scope.aReportgst.totaligstAmounts = '(-)'+($scope.aReportgst.totalIGSTAmount).toFixed(2);
					//  $scope.aReportgst.totalsgstAmounts = '(-)'+($scope.aReportgst.totalSGSTAmount).toFixed(2);
					//  $scope.aReportgst.totalTaxableFreightValue = '(-)'+($scope.aReportgst.totalTaxableFreightValue).toFixed(2);
					//  $scope.aReportgst.totalAfterTaxAmount = '(-)'+($scope.aReportgst.totalAfterTaxAmount).toFixed(2);
                  $scope.aReportgst.totalTaxableFreightValue= 0;
						$scope.aReportgst.totalAfterTaxAmount = 0;
					 for(i=0; i<=response.data[0].data.length-1; i++){
						 $scope.totaligst = $scope.totaligst + $scope.aReport[i].iGST;
						 $scope.totalsgst = $scope.totalsgst + $scope.aReport[i].sGST;
						 $scope.totalcgst = $scope.totalcgst + $scope.aReport[i].cGST;
						 $scope.aReportgst.totalTaxableFreightValue = $scope.aReportgst.totalTaxableFreightValue +$scope.aReport[i].amount;
				 		 $scope.aReportgst.totalAfterTaxAmount  = $scope.aReportgst.totalAfterTaxAmount  +$scope.aReport[i].totalAmount;
					  }
					      $scope.totalcgst = '(-)'+($scope.totalcgst).toFixed(2);
					      $scope.totaligst = '(-)'+($scope.totaligst).toFixed(2);
					      $scope.totalsgst = '(-)'+($scope.totalsgst).toFixed(2);
				      	$scope.aReportgst.totalTaxableFreightValue = '(-)'+($scope.aReportgst.totalTaxableFreightValue).toFixed(2);
				      	$scope.aReportgst.totalAfterTaxAmount = '(-)'+($scope.aReportgst.totalAfterTaxAmount).toFixed(2);


					   }
		      	}
		}
	}
	function prepareFilter(oFilter) {
		let filter = {};

		if (oFilter.start_date)
			filter.start_date = new Date(new Date(oFilter.start_date).setHours(0, 0, 0)).toISOString();

		if (oFilter.end_date)
			filter.end_date = new Date(new Date(oFilter.end_date).setHours(23, 59, 59)).toISOString();
		return filter;
	}
	function setDefaultDate() {
		$scope.oFilter.end_date = new Date();
		$scope.oFilter.start_date = new Date(new Date().setMonth(new Date($scope.oFilter.end_date).getMonth() - 1));
	}

	function submit(formData,type,isDownloadTrue) {

		if (formData.$valid ){
		  if (type == 'Monthly Bill Report'){
			getGstr1MonthlyReport(isDownloadTrue);
		  }else if(type == 'Summary Bill Report'){
			getGstr1SummaryReport(isDownloadTrue);
		  }else if(type == 'CreditNote Bill Report'){
	         getGstr1CreditNoteReport(isDownloadTrue);
		  }
		}
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	function searchGstr1ReportType(formData,type,isDownloadTrue) {
		if(!type){
			swal('', ' Please Select Bill Report Type', 'warning');

		}else{
		   	if (formData.$valid ){
	    	   if (type == 'Monthly Bill Report'){
			        getGstr1MonthlyReport(isDownloadTrue);
		      }else if(type == 'Summary Bill Report'){
	            	getGstr1SummaryReport(isDownloadTrue);
		            }else if(type == 'CreditNote Bill Report'){
	                 	getGstr1CreditNoteReport(isDownloadTrue);
		            }
	       	}
	     	else {
		    	swal('', 'Dates are Mandatory', 'warning');
		}
	}
}
});
// GST Payment Controller

materialAdmin.controller('gstPaymentReportController', function (
	$scope,
	$stateParams,
	branchService,
	billBookService,
	accountingService,
	growlService,
	otherUtils,
	voucherService,
	DatePicker,
	Pagination,
	$state
) {

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oFilter = {};
	$scope.Pagination = angular.copy(Pagination);
	$scope.isdisabled = false;
	$scope.oVoucher = {};// initialize voucher object
	$scope.aVoucher = {};// initialize voucher object
	$scope.oFilter = {};// initialize voucher object
	$scope.oFilter.aVoucher = $scope.oFilter.aVoucher || {};

	$scope.aPaymentMode = ['NEFT', 'Cash', 'Cheque'];
	$scope.oFilter.aVoucher.billType = 'New Ref';
	$scope.aType = ['DR', 'CR'];
	$scope.oFilter.oPaymentType = {"pType":"GST Payment", "voucherType":"Payment"};
	// $scope.oFilter.oVoucher.type = "Payment";


	$scope.oAccountMaster = {}; // initialize Account Master object
	if ($stateParams.data) {
		$scope.selectedVch = $stateParams.data.data.selectedVch;
		$scope.mode = $stateParams.data.data.type.toLowerCase();
	}
	$scope.mode = $scope.mode || 'add';
	$scope.aSecV = [];
	$scope.bills = [];
	if ($scope.mode === 'add') {
		$scope.oVoucher.chequeDate = new Date();
		$scope.oVoucher.billDate = new Date();
	}
	if ($scope.mode === 'edit' || $scope.mode === 'view') {
		prepareLedgersData();
		// getAllSv();
	}
	if ($scope.mode === 'view')
		$scope.readOnly = true;
	// getBillNo();
	$scope.opened = true;
	$scope.test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	$scope.oFilter.totalTaxPayment = 0;
	$scope.oFilter.taxPaymentCGST = 0;
	$scope.oFilter.interestCGST = 0;
	$scope.oFilter.penaltyCGST = 0;
	$scope.oFilter.feeCGST = 0;
	$scope.oFilter.totalCGST = 0;

	$scope.oFilter.taxPaymentSGST = 0;
	$scope.oFilter.interestSGST = 0;
	$scope.oFilter.penaltySGST = 0;
	$scope.oFilter.feeSGST = 0;
	$scope.oFilter.totalSGST = 0;

	$scope.oFilter.taxPaymentIGST = 0;
	$scope.oFilter.interestIGST = 0;
	$scope.oFilter.penaltyIGST = 0;
	$scope.oFilter.feeIGST = 0;
	$scope.oFilter.totalIGST = 0;
	$scope.upsertButtonLable = "Add Payment Voucher";
	// functions Identifiers

	$scope.setDefaultDate 		= setDefaultDate;
	$scope.submit 				= submit;
	$scope.submitPaymentVoucher = submitPaymentVoucher;
	$scope.searchGstPayment 	= searchGstPayment;

	$scope.getGstPaymentReport 	= getGstPaymentReport;
	$scope.setBillType 			= setBillType;
	$scope.onSelect 			= onSelect;
	$scope.getAllBranch 		= getAllBranch;
	$scope.getAutoStationaryNo 	= getAutoStationaryNo;
	$scope.getRefNo 			= getRefNo;
	$scope.taxPaymentCalculation = taxPaymentCalculation;
	$scope.accountMasterDetail 	 = accountMasterDetail;
	$scope.getBillNo 			= getBillNo;
	$scope.onBillSelect 		= onBillSelect;
	$scope.prepareData 			= prepareData;
	$scope.deleteVoucher 		= deleteVoucher;

	$scope.taxPayName = {
		"sgst":"SGST",
		"sgstfee":"SGST Fee",
		"sgstpenalty":"SGST Penalty",
		"sgstinterest":"SGST Interest",
		"cgst":"CGST",
		"cgstfee":"CGST Fee",
		"cgstpenalty":"CGST Penalty",
		"cgstinterest":"CGST Interest",
		"igst":"IGST",
		"igstfee":"IGST Fee",
		"igstpenalty":"IGST Penalty",
		"igstinterest":"IGST Interest"
	};

	// INIT functions
	(function init() {
		setDefaultDate();
		//getGstPaymentReport();

		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadAccountEvent', function () {
			submit($scope.gstPaymentReport, true);
		});
	})();

	function taxPaymentCalculation() {

		$scope.errorCGST = '';
		if(parseFloat($scope.oFilter.taxPaymentCGST)>parseFloat($scope.ledgerCGSTRemaining))
			$scope.errorCGST = true;

		$scope.errorSGST = '';
		if(parseFloat($scope.oFilter.taxPaymentSGST)>parseFloat($scope.ledgerSGSTRemaining))
			$scope.errorSGST = true;

		$scope.errorIGST = '';
		if(parseFloat($scope.oFilter.taxPaymentIGST)>parseFloat($scope.ledgerIGSTRemaining))
			$scope.errorIGST = true;

		$scope.oFilter.totalCGST = parseFloat($scope.oFilter.taxPaymentCGST) +
			parseFloat($scope.oFilter.interestCGST) +
			parseFloat($scope.oFilter.penaltyCGST) +
			parseFloat($scope.oFilter.feeCGST);

		$scope.oFilter.totalSGST = parseFloat($scope.oFilter.taxPaymentSGST) +
			parseFloat($scope.oFilter.interestSGST) +
			parseFloat($scope.oFilter.penaltySGST) +
			parseFloat($scope.oFilter.feeSGST);

		$scope.oFilter.totalIGST = parseFloat($scope.oFilter.taxPaymentIGST) +
			parseFloat($scope.oFilter.interestIGST) +
			parseFloat($scope.oFilter.penaltyIGST) +
			parseFloat($scope.oFilter.feeIGST);

		$scope.oFilter.totalTaxPayment = parseFloat($scope.oFilter.totalCGST) +
			parseFloat($scope.oFilter.totalSGST) + parseFloat($scope.oFilter.totalIGST);
	}

	function submitPaymentVoucher(formData) {
		if (formData.$valid) {
			if(parseFloat($scope.oFilter.taxPaymentCGST)){
				if(parseFloat($scope.oFilter.taxPaymentCGST)>parseFloat($scope.ledgerCGSTRemaining)){
					return swal('Error', `CGST Payment should not be greater than ${parseFloat($scope.ledgerCGSTRemaining)}`, 'error');
				}
			}
			if(parseFloat($scope.oFilter.taxPaymentSGST)){
				if(parseFloat($scope.oFilter.taxPaymentSGST)>parseFloat($scope.ledgerSGSTRemaining)){
					return swal('Error', `SGST Payment should not be greater than ${parseFloat($scope.ledgerSGSTRemaining)}`, 'error');
				}
			}
			if(parseFloat($scope.oFilter.taxPaymentIGST)){
				if(parseFloat($scope.oFilter.taxPaymentIGST)>parseFloat($scope.ledgerIGSTRemaining)){
					return swal('Error', `IGST Payment should not be greater than ${parseFloat($scope.ledgerIGSTRemaining)}`, 'error');
				}
			}

			if($scope.oFilter.oVoucher){
				if($scope.oFilter.oVoucher.type!='Payment'){
					return swal('Error', `Voucher type should be Payment`, 'error');
				}
			}

			if(($scope.oFilter.taxPaymentIGST=='' || $scope.oFilter.taxPaymentIGST==0) &&
				($scope.oFilter.taxPaymentSGST=='' || $scope.oFilter.taxPaymentSGST==0) &&
				($scope.oFilter.taxPaymentCGST=='' || $scope.oFilter.taxPaymentCGST==0) ){
				return swal('Error', `Atleast one TAX amount should be filled.`, 'error');
			}

			if($scope.oFilter.totalTaxPayment=='' || $scope.oFilter.totalTaxPayment==0){
				return swal('Error', `Total Payment amount cant be null or (0)`, 'error');
			}

			//vm.aSecV.push({...vm.oFilter.aVoucher});
			$scope.ledgers = [];
			let objCGST = {
				account: $scope.$clientConfigs.accountDetails.cgst,
				lName: $scope.taxPayName.cgst,
				amount: parseFloat($scope.oFilter.taxPaymentCGST),
				cRdR: "DR",
			};
			objCGST.bills = [];
			$scope.ledgers.push(objCGST);

			let objcgstfee = {
				account: $scope.$clientConfigs.accountDetails.cgstfee,
				lName: $scope.taxPayName.cgstfee,
				amount: parseFloat($scope.oFilter.feeCGST),
				cRdR: "DR",
			};
			objcgstfee.bills = [];
			$scope.ledgers.push(objcgstfee);

			let objcgstpenalty = {
				account: $scope.$clientConfigs.accountDetails.cgstpenalty,
				lName: $scope.taxPayName.cgstpenalty,
				amount: parseFloat($scope.oFilter.penaltyCGST),
				cRdR: "DR",
			};
			objcgstpenalty.bills = [];
			$scope.ledgers.push(objcgstpenalty);

			let objcgstinterest = {
				account: $scope.$clientConfigs.accountDetails.cgstinterest,
				lName: $scope.taxPayName.cgstinterest,
				amount: parseFloat($scope.oFilter.interestCGST),
				cRdR: "DR",
			};
			objcgstinterest.bills = [];
			$scope.ledgers.push(objcgstinterest);

			// SGST
			let objSGST = {
				account: $scope.$clientConfigs.accountDetails.sgst,
				lName: $scope.taxPayName.sgst,
				amount: parseFloat($scope.oFilter.taxPaymentSGST),
				cRdR: "DR",
			};
			objSGST.bills = [];
			$scope.ledgers.push(objSGST);

			let objsgstfee = {
				account: $scope.$clientConfigs.accountDetails.sgstfee,
				lName: $scope.taxPayName.sgstfee,
				amount: parseFloat($scope.oFilter.feeSGST),
				cRdR: "DR",
			};
			objsgstfee.bills = [];
			$scope.ledgers.push(objsgstfee);

			let objsgstpenalty = {
				account: $scope.$clientConfigs.accountDetails.sgstpenalty,
				lName: $scope.taxPayName.sgstpenalty,
				amount: parseFloat($scope.oFilter.penaltySGST),
				cRdR: "DR",
			};
			objsgstpenalty.bills = [];
			$scope.ledgers.push(objsgstpenalty);

			let objsgstinterest = {
				account: $scope.$clientConfigs.accountDetails.sgstinterest,
				lName: $scope.taxPayName.sgstinterest,
				amount: parseFloat($scope.oFilter.interestSGST),
				cRdR: "DR",
			};
			objsgstinterest.bills = [];
			$scope.ledgers.push(objsgstinterest);

			// IGST
			let objIGST = {
				account: $scope.$clientConfigs.accountDetails.igst,
				lName: $scope.taxPayName.igst,
				amount: parseFloat($scope.oFilter.taxPaymentIGST),
				cRdR: "DR",
			};
			objIGST.bills = [];
			$scope.ledgers.push(objIGST);

			let objigstfee = {
				account: $scope.$clientConfigs.accountDetails.igstfee,
				lName: $scope.taxPayName.igstfee,
				amount: parseFloat($scope.oFilter.feeIGST),
				cRdR: "DR",
			};
			objigstfee.bills = [];
			$scope.ledgers.push(objigstfee);

			let objigstpenalty = {
				account: $scope.$clientConfigs.accountDetails.igstpenalty,
				lName: $scope.taxPayName.igstpenalty,
				amount: parseFloat($scope.oFilter.penaltyIGST),
				cRdR: "DR",
			};
			objigstpenalty.bills = [];
			$scope.ledgers.push(objigstpenalty);

			let objigstinterest = {
				account: $scope.$clientConfigs.accountDetails.igstinterest,
				lName: $scope.taxPayName.igstinterest,
				amount: parseFloat($scope.oFilter.interestIGST),
				cRdR: "DR",
			};
			objigstinterest.bills = [];
			$scope.ledgers.push(objigstinterest);

			// DR
			let objTotalDr = {};
			if($scope.selectedVchId){
				objTotalDr = {
					account: $scope.oFilter.aVoucher._id,
					lName: $scope.oFilter.aVoucher.to,
					amount: parseFloat($scope.oFilter.totalTaxPayment),
					cRdR: "CR",
				};
			} else {
				objTotalDr = {
					account: $scope.oFilter.aVoucher.to._id,
					lName: $scope.oFilter.aVoucher.to.name,
					amount: parseFloat($scope.oFilter.totalTaxPayment),
					cRdR: "CR",
				};
			}
			objTotalDr.bills = [];
			$scope.ledgers.push(objTotalDr);

			$scope.oFilter.aVoucher.billNo = $scope.oVoucher.refNo;

			$scope.nonValid = false;

			// if (!$scope.aSecV.length) {
			// 	return swal('Error', `No New Data found`, 'error');
			// }
			if (!$scope.oVoucher.branch._id) {
				return swal('Error', `branch required`, 'error');
			}

			if($scope.oFilter.from_date=='' &&  $scope.oFilter.to_date==''){
				return swal('Error', `From Date and To Date should be required`, 'error');
			} else if($scope.oFilter.from_date>$scope.oFilter.to_date){
				return swal('Error', `From Date cant be greater than To Date`, 'error');
			}


			//prepareData();
			if ($scope.nonValid)
				return;
			let aVouchers = angular.copy($scope.oVoucher);
			(aVouchers.ledgers = $scope.ledgers).forEach(oLed => {
				(oLed.bills || []).forEach(oBill => {
					oBill.billNo = oBill.billNo && oBill.billNo.trim();
				});
			});
			aVouchers.branch = $scope.oVoucher.branch._id;
			if ($scope.selectedStationary || !aVouchers.stationaryId)
				aVouchers.stationaryId = ($scope.selectedStationary && $scope.selectedStationary.bookNo) === $scope.oVoucher.refNo ? $scope.selectedStationary._id : undefined
			if (aVouchers.billDate) {
				aVouchers.date = moment($scope.oVoucher.billDate, 'DD/MM/YYYY').toISOString();
				aVouchers.chequeDate = moment($scope.oVoucher.billDate, 'DD/MM/YYYY').toISOString();
			}

			aVouchers.from_date = new Date(new Date($scope.oFilter.from_date).setHours(0, 0, 0)).toISOString();
			aVouchers.to_date = new Date(new Date($scope.oFilter.to_date).setHours(0, 0, 0)).toISOString();

			$scope.isdisabled = true;
			if ($scope.selectedVchId) {
				aVouchers._id = $scope.selectedVchId;
				voucherService.editPlainVoucher(aVouchers, onSuccess, onFailure);
			} else {
				voucherService.addVoucher(aVouchers, onSuccess, onFailure);
			}

			// Handle failure response
			function onFailure(response) {
				$scope.isdisabled = false;
				console.log(response);
				swal('Error!', response.message, 'error');
			}

			// Handle success response
			function onSuccess(response) {

				swal('Success', response.message, 'success');
				$state.go('accountManagment.gstr-1', {}, {reload: true});
				$scope.isdisabled 				= false;
				$scope.oFilter.refNoUpdate 		= undefined;
				$scope.oVoucher.chequeDate 		= undefined;
				$scope.oVoucher.branch 			= undefined;
				$scope.oVoucher.paymentRef 		= undefined;
				$scope.oVoucher.narration 		= undefined;
				$scope.oVoucher.to.name			= undefined;
				$scope.oVoucher.to._id 			= undefined;
				$scope.oVoucher._id 			= undefined;
				$scope.oVoucher.name 			= undefined;
				$scope.oFilter.aVoucher 		= undefined;
				$scope.oVoucher.refNo 			= undefined;
				$scope.oVoucher.paymentMode 	= undefined;
				$scope.oFilter.taxPaymentCGST 	= 0;
				$scope.oFilter.interestCGST 	= 0;
				$scope.oFilter.penaltyCGST 		= 0;
				$scope.oFilter.feeCGST 			= 0;
				$scope.oFilter.totalCGST 		= 0;
				$scope.oFilter.taxPaymentSGST 	= 0;
				$scope.oFilter.interestSGST 	= 0;
				$scope.oFilter.penaltySGST 		= 0;
				$scope.oFilter.feeSGST 			= 0;
				$scope.oFilter.totalSGST 		= 0;
				$scope.oFilter.taxPaymentIGST 	= 0;
				$scope.oFilter.interestIGST 	= 0;
				$scope.oFilter.penaltyIGST 		= 0;
				$scope.oFilter.feeIGST 			= 0;
				$scope.oFilter.totalIGST 		= 0;
				$scope.DrLedgerPayment 			= 0;
				$scope.totTaxGSTs 				= 0;
				$scope.FRLedgerPayment 			= 0;
				$scope.ledgerIGSTRemaining 		= 0;
				$scope.ledgerSGSTRemaining 		= 0;
				$scope.ledgerCGSTRemaining 		= 0;

			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

	function deleteVoucher(hasAdminAccess) {

		if (!$scope.selectedVchId)
			return swal('Error', 'Voucher not found', 'error');
		let selectedVch;
		selectedVch = [$scope.selectedVchId];
		if (!hasAdminAccess)
			return swal('Error', 'You dont have permission to delete GST Payment Voucher', 'error');

		swal({
				title: 'Are you sure you want to delete selected GST Payment Voucher?',
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
						_id: selectedVch.map(v=>v)
					}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.message, 'success');
						$state.go('accountManagment.gstr-1', {}, {reload: true});
					}

					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
				}
			});
	}
	function billNoValidation(billNo, billType) {
		if (!otherUtils.isEmptyObject(billNo)) {
			billNo = (billNo).trim();
			if (billNo.length === 0)
				billNo = undefined;
		}
		if ((billType === 'New Ref' && otherUtils.isEmptyObject(billNo)) || (billType === 'Against Ref' && otherUtils.isEmptyObject(billNo))) {
			swal('Error', 'Bill No. Requierd', 'error');
			$scope.nonValid = true;
			return false;
		} else {
			return true;
		}
	}

	function prepareData() {
		$scope.ledgers = [];
		$scope.aSecV.forEach(item => {
			if ($scope.ledgers.length) {
				$scope.flag = false;
				$scope.ledgers.forEach(obj => {
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
						$scope.flag = true;
					}

				});
				if (!$scope.flag) {
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
					$scope.ledgers.push(obj);
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
				$scope.ledgers.push(obj);
			}
		});
	}

	function accountMasterDetail(viewValue) {
		if (viewValue && viewValue.toString().length > 2) {
			return new Promise(function (resolve, reject) {
				accountingService.getAccountMaster({
					name: viewValue,
					no_of_docs: 10,
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



	function prepareLedgersData() {
		$scope.selectedVch.ledgers.forEach(item => {
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
					obj._id = o._id;
					$scope.aSecV.push(obj);
				});
			} else {
				let obj = {};
				obj.amount = item.amount;
				obj._id = item._id;
				obj.to = {_id: item.account, name: item.lName};
				obj.cRdR = item.cRdR;
				$scope.aSecV.push(obj);
			}
		});

		if ($scope.aSecV.length > 0) {
			$scope.oVoucher = $scope.selectedVch;
			$scope.$constants.aVoucherPaymentType.find(o => {
				if (o.pType === $scope.oVoucher.vT) {
					$scope.oPaymentType = o;
					$scope.aVouchersType = $scope.oPaymentType.voucherType;
					return;
				}
			});
			onSelect($scope.oVoucher.branch, 'edit');
			if ($scope.oVoucher && $scope.oVoucher.date) $scope.oVoucher.chequeDate = new Date($scope.oVoucher.date);
			if ($scope.oVoucher && $scope.oVoucher.date) $scope.oVoucher.billDate = new Date($scope.oVoucher.date);
		} else {
			$scope.noRefNoFound = true;
			$scope.oPaymentType = undefined;
			$scope.oVoucher = {};
		}
	}

	function getBillNo(viewValue) {
		if ($scope.oFilter.aVoucher.billType != 'Against Ref')
			return;

		return new Promise(function (resolve, reject) {

			let requestObj = {
				billNo: viewValue && viewValue.trim(),
				ledgers: [$scope.oFilter.aVoucher.to._id],
				type: $scope.oVoucher.type,
				no_of_docs: 10
			};

			if ($scope.aSecV.length) {
				requestObj.billNo = {
					eq: requestObj.billNo,
					ne: $scope.aSecV.map(o => o.billNo)
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

		if (!$scope.billBookId.length) {
			return;
		}

		return new Promise(function (resolve, reject) {

			let requestObj = {
				bookNo: viewValue,
				billBookId: $scope.billBookId,
				type: $scope.type,
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
		if (!($scope.billBookId && $scope.billBookId.length))
			return growlService.growl('Ref Book not found on this branch', 'danger');

		let req = {
			"billBookId": $scope.billBookId,
			"type": $scope.type,
			"auto": true,
			"sch": 'vch',
			"status": "unused"
		};

		if (backDate)
			req.backDate = moment(backDate, 'DD/MM/YYYY').toISOString();

		billBookService.getStationery(req, success);

		function success(response) {
			$scope.aAutoStationary = response.data[0];
			$scope.oVoucher.refNo = $scope.aAutoStationary.bookNo;
			$scope.selectedStationary = $scope.aAutoStationary;
			// $scope.preserveRefNo.push({
			// 	name: $scope.oVoucher.branch.name,
			// 	refNo: $scope.aAutoStationary.bookNo,
			// 	selectedStationary: $scope.aAutoStationary
			// })
		}
	}

	function getAllBranch(viewValue, type) {
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

	function onBillSelect(item) {
		$scope.oFilter.aVoucher.bill = item._id;
		$scope.oFilter.aVoucher.billNo = item.billNo;
		$scope.date = item.date;
	}



	function onSelect(item, type) {

		$scope.oVoucher.vT 		= $scope.oFilter.oPaymentType.pType;
		$scope.fromGroup 		= "";
		$scope.toGroup 			= "";
		$scope.oVoucher.type 	= $scope.oFilter.oPaymentType.voucherType;
		$scope.type 			= 'Ref No';

		if ($scope.oVoucher.branch) {
			$scope.billBookId = $scope.oVoucher.branch.refNoBook ? $scope.oVoucher.branch.refNoBook.map(o => o.ref) : '';
			if (type == 'edit')
				return;
		}
	}
	// Actual Functions
	function setBillType() {
		if ($scope.oFilter.aVoucher.cRdR == 'CR' && $scope.oVoucher.type == 'Receipt') {
			$scope.oFilter.aVoucher.billType = 'On Account';
		} else if ($scope.oFilter.aVoucher.cRdR == 'DR' && $scope.oVoucher.type == 'Payment') {
			$scope.oFilter.aVoucher.billType = 'On Account';
		} else {
			$scope.oFilter.aVoucher.billType = undefined;
		}
	}

	function getGstPaymentReport(isDownloadTrue, searchType) {
		let request = {};
		if(searchType=='sRef'){
			if(!$scope.oFilter.refNoUpdate){
				return swal('Error!', `Ref Number should not be blank`, 'error');
			}
			request.refNoUpdate = $scope.oFilter.refNoUpdate;
		} else {
			request = prepareFilter($scope.oFilter);
			if (isDownloadTrue) {
				request.download = true;
				request.downloadName = "GSTPayment";
			}
		}

		$scope.selectedVchId = undefined;

		accountingService.getGSTR1PaymentReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				if(response.data && response.data.data && response.data.data.length>0){
					let aGstPayment 			= response.data.data;
					$scope.aGSTPaymentReport 	= aGstPayment;
					$scope.CGSTLedgerPayment  	= $scope.aGSTPaymentReport[0].ledgerCGST.toFixed(2);
					$scope.SGSTLedgerPayment  	= $scope.aGSTPaymentReport[0].ledgerSGST.toFixed(2);
					$scope.IGSTLedgerPayment  	= $scope.aGSTPaymentReport[0].ledgerIGST.toFixed(2);
					$scope.FRLedgerPayment  	= $scope.aGSTPaymentReport[0].ledgerFR.toFixed(2);
					$scope.DrLedgerPayment  	= $scope.aGSTPaymentReport[0].ledgerDr.toFixed(2);
					$scope.totTaxGSTs 			= (parseFloat($scope.CGSTLedgerPayment)+parseFloat($scope.SGSTLedgerPayment)+parseFloat($scope.IGSTLedgerPayment)).toFixed(2);

					let ledgerCGSTRemaining = (parseFloat($scope.CGSTLedgerPayment)).toFixed(2);
					let ledgerSGSTRemaining = (parseFloat($scope.SGSTLedgerPayment)).toFixed(2);
					let ledgerIGSTRemaining = (parseFloat($scope.IGSTLedgerPayment)).toFixed(2);

					if($scope.aGSTPaymentReport && $scope.aGSTPaymentReport[1]) {
						ledgerCGSTRemaining = (parseFloat($scope.CGSTLedgerPayment) - parseFloat($scope.aGSTPaymentReport[1].ledgerCGSTPaid)).toFixed(2);
						ledgerSGSTRemaining = (parseFloat($scope.SGSTLedgerPayment) - parseFloat($scope.aGSTPaymentReport[1].ledgerSGSTPaid)).toFixed(2);
						ledgerIGSTRemaining = (parseFloat($scope.IGSTLedgerPayment) - parseFloat($scope.aGSTPaymentReport[1].ledgerIGSTPaid)).toFixed(2);
					}

					if(response.searchRes && response.searchRes.length>0){

						$scope.upsertButtonLable = "Update Payment Voucher";

						$scope.oVoucher 			= angular.copy(response.searchRes[0]);
						$scope.oVoucher.billDate 	= $scope.oVoucher.date;
						$scope.selectedVchId 		= $scope.oVoucher._id;
						$scope.oFilter.from_date 	= $scope.oVoucher.from_date;
						$scope.oFilter.to_date 		= $scope.oVoucher.to_date;
						//$scope.oFilter 	= angular.copy(response.searchRes[0]);

						// calculate...
						if(response.searchRes[0].ledgers.length>0){

							let aLedg = response.searchRes[0].ledgers;
							for(let k=0; k<aLedg.length; k++){
								if(aLedg[k].lName=='CGST')
									$scope.oFilter.taxPaymentCGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='CGST Fee')
									$scope.oFilter.feeCGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='CGST Penalty')
									$scope.oFilter.penaltyCGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='CGST Interest')
									$scope.oFilter.interestCGST = parseFloat(aLedg[k].amount);

								if(aLedg[k].lName=='SGST')
									$scope.oFilter.taxPaymentSGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='SGST Fee')
									$scope.oFilter.feeSGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='SGST Penalty')
									$scope.oFilter.penaltySGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='SGST Interest')
									$scope.oFilter.interestSGST = parseFloat(aLedg[k].amount);

								if(aLedg[k].lName=='IGST')
									$scope.oFilter.taxPaymentIGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='IGST Fee')
									$scope.oFilter.feeIGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='IGST Penalty')
									$scope.oFilter.penaltyIGST = parseFloat(aLedg[k].amount);
								else if(aLedg[k].lName=='IGST Interest')
									$scope.oFilter.interestIGST = parseFloat(aLedg[k].amount);

								if(aLedg[k].cRdR=='CR'){
									$scope.oFilter.aVoucher._id 		= aLedg[k].account;
									$scope.oFilter.aVoucher.to 			= aLedg[k].lName;
									accountMasterDetail(aLedg[k].lName);
								}
							}
							//$scope.oVoucher.branch = 'Dharuhera Office';
							//getAllBranch(response.searchRes[0].branch.name, 'Edit');
							onSelect(response.searchRes[0].branch.name, 'edit');
							$scope.oFilter.totalCGST = (parseFloat($scope.oFilter.taxPaymentCGST) +
								parseFloat($scope.oFilter.feeCGST) +
								parseFloat($scope.oFilter.penaltyCGST) +
								parseFloat($scope.oFilter.interestCGST)).toFixed(2);

							$scope.oFilter.totalSGST = (parseFloat($scope.oFilter.taxPaymentSGST) +
								parseFloat($scope.oFilter.feeSGST) +
								parseFloat($scope.oFilter.penaltySGST) +
								parseFloat($scope.oFilter.interestSGST)).toFixed(2);

							$scope.oFilter.totalIGST = (parseFloat($scope.oFilter.taxPaymentIGST) +
								parseFloat($scope.oFilter.feeIGST) +
								parseFloat($scope.oFilter.penaltyIGST) +
								parseFloat($scope.oFilter.interestIGST)).toFixed(2);

								$scope.oFilter.totalTaxPayment = (parseFloat($scope.oFilter.totalCGST) +
								parseFloat($scope.oFilter.totalSGST) +
								parseFloat($scope.oFilter.totalIGST)).toFixed(2);

								$scope.ledgerCGSTRemaining	= (parseFloat(ledgerCGSTRemaining) + parseFloat($scope.oFilter.taxPaymentCGST)).toFixed(2);
								$scope.ledgerSGSTRemaining	= (parseFloat(ledgerSGSTRemaining) + parseFloat($scope.oFilter.taxPaymentSGST)).toFixed(2);
								$scope.ledgerIGSTRemaining 	= (parseFloat(ledgerIGSTRemaining) + parseFloat($scope.oFilter.taxPaymentIGST)).toFixed(2);
						}

					} else {
						$scope.upsertButtonLable = "Add Payment Voucher";
						$scope.oFilter.taxPaymentCGST 	= $scope.oFilter.totalCGST =  $scope.ledgerCGSTRemaining =  ledgerCGSTRemaining;
						$scope.oFilter.taxPaymentSGST 	= $scope.oFilter.totalSGST =  $scope.ledgerSGSTRemaining = 	ledgerSGSTRemaining;
						$scope.oFilter.taxPaymentIGST 	= $scope.oFilter.totalIGST =  $scope.ledgerIGSTRemaining = 	ledgerIGSTRemaining;
						$scope.oFilter.totalTaxPayment = parseFloat(ledgerCGSTRemaining) + parseFloat(ledgerSGSTRemaining) + parseFloat(ledgerIGSTRemaining);
					}
				}
			}
		}
	}

	function prepareFilter(oFilter) {
		let filter = {};

		if (oFilter.from_date)
			//filter.from_date = oFilter.from_date.toISOString();
		filter.from_date = new Date(new Date(oFilter.from_date).setHours(0, 0, 0)).toISOString();

		if (oFilter.to_date)
			filter.to_date = new Date(new Date(oFilter.to_date).setHours(23, 59, 59)).toISOString();

		filter.skip = $scope.Pagination.currentPage;
		filter.no_of_docs = $scope.Pagination.items_per_page;

		return filter;
	}

	function setDefaultDate() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setMonth(new Date($scope.oFilter.to_date).getMonth() - 1));
	}

	function submit(formData, isDownloadTrue) {
		if (formData.$valid)
			getGstPaymentReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	function searchGstPayment(formData, isDownloadTrue, searchType) {
		if (formData.$valid)
			getGstPaymentReport(isDownloadTrue, searchType);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	//////////////////////////////////////////////////

});


// Cr-Dr Report Controllers

materialAdmin.controller('accountCrDrReportController', function (
	$scope,
	accountingService,
	DatePicker,
	Pagination
) {

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.oFilter = {};
	$scope.Pagination = angular.copy(Pagination);

	// functions Identifiers

	$scope.getCrDrReport = getCrDrReport;
	$scope.setDefaultDate = setDefaultDate;
	$scope.submit = submit;

	// INIT functions
	(function init() {
		setDefaultDate();
		getCrDrReport();

		// its invoked when parent send 'downloadEvent' to child
		$scope.$on('downloadAccountEvent', function () {
			submit($scope.crDrReport, true);
		});
	})();

	// Actual Functions

	function getCrDrReport(isDownloadTrue) {

		let request = prepareFilter($scope.oFilter);
		if (isDownloadTrue)
			request.download = true;
		accountingService.getGSTR1CrDrReport(request, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.message, 'error');
		}

		function successCallback(response) {
			if (isDownloadTrue) {
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
			} else {
				$scope.aReport = response.data.data || [];
				$scope.Pagination.total_pages = response.data.count / $scope.Pagination.items_per_page;
				$scope.Pagination.totalItems = response.data.count;
			}
		}
	}

	function prepareFilter(oFilter) {
		let filter = {};

		if (oFilter.from_date)
			filter.from_date = oFilter.from_date.toISOString();

		if (oFilter.to_date)
			filter.to_date = oFilter.to_date.toISOString();

		filter.skip = $scope.Pagination.currentPage;
		filter.no_of_docs = $scope.Pagination.items_per_page;

		return filter;
	}

	function setDefaultDate() {
		$scope.oFilter.to_date = new Date();
		$scope.oFilter.from_date = new Date(new Date().setMonth(new Date($scope.oFilter.to_date).getMonth() - 1));
	}

	function submit(formData, isDownloadTrue) {
		if (formData.$valid)
			getCrDrReport(isDownloadTrue);
		else {
			swal('', 'Dates are Mandatory', 'warning');
		}
	}

	//////////////////////////////////////////////////
});


materialAdmin.controller('addVoucherPopupController', function (
	$scope,
	$uibModalInstance,
	accountingService,
	DatePicker,
	callback,
	constants,
	modalDetail,
	otherDetail,
	sharedResource
) {

	sharedResource.shareThisResourceWith($scope);
	// object Identifiers
	$scope.$constants = constants; // initialize constants
	$scope.DatePicker = angular.copy(DatePicker); // initialize datepicker
	$scope.oVoucher = {}; // initialize voucher object
	$scope.oAccountMaster = {}; // initialize Account Master object
	$scope.aTaxes = [];
	$scope.taxAmounts = [5, 12, 18, 28, 40];

	// functions Identifiers
	$scope.closePopup = closePopup;
	$scope.submit = submit;
	$scope.fromAccount = fromAccount;
	$scope.toAccount = toAccount;
	$scope.addTax = addTax;
	$scope.getAccounts = getAccounts;
	$scope.calculateTax = calculateTax;
	$scope.setTax = setTax;
	$scope.changeTaxType = changeTaxType;

	// INIT functions

	(function(){

		$scope.DatePicker = angular.copy(DatePicker);

		$scope.showBillDate = false;

		if(modalDetail){
			$scope.modalHeader = modalDetail.header;
			$scope.submitButtonLabel = modalDetail.submitButtonLabel;
		}

		if(otherDetail){

			$scope.hidePaymentType = !!otherDetail.hidePaymentType;
			$scope.showBillDate = !!otherDetail.showBillDate;

			if(otherDetail.from){
				if(otherDetail.from.value){
					$scope.oVoucher.from = otherDetail.from.value;
					$scope.aAccountMasterfrom = [$scope.oVoucher.from];
				}
				if(otherDetail.from.group){
					$scope.fromGroup = otherDetail.from.group;
					$scope.fromAccount();
				}
			}

			if(otherDetail.to){
				if(otherDetail.to.value){
					$scope.oVoucher.to = otherDetail.to.value;
					$scope.aAccountMasterto = [$scope.oVoucher.to];
				}
				if(otherDetail.to.group){
					$scope.toGroup = otherDetail.to.group;
					$scope.toAccount();
				}
			}

			if(otherDetail.amount)
				$scope.oVoucher.amount = otherDetail.amount;

			if(otherDetail.refNo)
				$scope.oVoucher.refNo = otherDetail.refNo;

			if(otherDetail.narration)
				$scope.oVoucher.narration = otherDetail.narration;

			if(otherDetail.billDate)
				$scope.oVoucher.billDate = otherDetail.billDate;

		}
	})();


	// Actual Functions
	// Close the modal
	function closePopup() {
		$uibModalInstance.dismiss();
	}


	// Get Account Masters
	function fromAccount() {

		var oFilter = {
			all: true,
			type: constants.fromAcByVoucherType[$scope.oVoucher.type]
		}; // filter to send

		if($scope.fromGroup)
			oFilter.group = $scope.fromGroup;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMasterfrom = response.data.data;
		}
	}

	function toAccount() {

		var oFilter = {
			all: true,
			type: constants.toAcByVoucherType[$scope.oVoucher.type]
		}; // filter to send

		if($scope.toGroup)
			oFilter.group = $scope.toGroup;

		accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {

		}

		// Handle success response
		function onSuccess(response) {
			$scope.aAccountMasterto = response.data.data;
		}
	};

	// Voucher submit
	function submit(formData) {

		console.log(formData);

		if(callback){
			callback($scope.oVoucher)
				.then(function (res) {
					$uibModalInstance.close(res);
				})
				.catch(function (err) {
					console.log(err);
				});
			return;
		}

		if (formData.$valid) {
			let oVoucher = angular.copy($scope.oVoucher);
			// if form is valid
			//$scope.oVoucher.date = typeof $scope.oVoucher.date === 'string' ? $scope.oVoucher.date : $scope.oVoucher.date.toISOString();
			oVoucher.to = oVoucher.to._id;
			oVoucher.from = oVoucher.from._id;

			if ($scope.aTaxes) {
				for (tax of $scope.aTaxes) {
					if (!tax.account || !tax.amount || !(tax.amount > 0)) {
						swal('Error!', 'Invalid Tax Data', 'error');
					}
				}
				if (oVoucher.type === "Sales") {
					oVoucher.tax_payable = $scope.aTaxes;
				} else if (oVoucher.type === "Purchase") {
					oVoucher.tax_paid = $scope.aTaxes;
					oVoucher.amount = oVoucher.netTotal;
				}
			}

			accountingService.addVoucher(oVoucher, onSuccess, onFailure);

			// Handle failure response
			function onFailure(response) {
				console.log(response);
				swal('Error!', 'Message not defined', 'error');
				$uibModalInstance.close('failure');
			}

			// Handle success response
			function onSuccess(response) {

				swal('Success', "Voucher Added Successfully", 'success');
				$uibModalInstance.close(response.data);
			}
		} else {
			if (formData.$error.required)
				swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
			else
				swal('Form Error!', 'Form is not Valid', 'error');
		}
	}

	//////////////////////////////////////////////////

	function addTax() {
		if ($scope.aTaxes.length <= 2)
			$scope.aTaxes.push({});
	}

	function getAccounts() {
		let accounts = []
		if ($scope.oVoucher.type === "Sales") {
			if ($scope.$clientConfigs.accountDetails.cgstPayable) {
				accounts.push({
					name: "C-GST",
					account: $scope.$clientConfigs.accountDetails.cgstPayable
				})
			}
			if ($scope.$clientConfigs.accountDetails.sgstPayable) {
				accounts.push({
					name: "S-GST",
					account: $scope.$clientConfigs.accountDetails.sgstPayable
				})
			}
			if ($scope.$clientConfigs.accountDetails.igstPayable) {
				accounts.push({
					name: "I-GST",
					account: $scope.$clientConfigs.accountDetails.igstPayable
				})
			}

		} else if ($scope.oVoucher.type === "Purchase") {
			if ($scope.$clientConfigs.accountDetails.cgstPaid) {
				accounts.push({
					name: "C-GST",
					account: $scope.$clientConfigs.accountDetails.cgstPaid
				})
			}
			if ($scope.$clientConfigs.accountDetails.sgstPaid) {
				accounts.push({
					name: "S-GST",
					account: $scope.$clientConfigs.accountDetails.sgstPaid
				})
			}
			if ($scope.$clientConfigs.accountDetails.igstPaid) {
				accounts.push({
					name: "I-GST",
					account: $scope.$clientConfigs.accountDetails.igstPaid
				})
			}

		}
		return accounts;
	};

	function calculateTax() {
		$scope.oVoucher.netTotal = $scope.oVoucher.amount;
		for (tax of $scope.aTaxes) {
			$scope.oVoucher.netTotal += tax.amount = $scope.oVoucher.amount * tax.percent / 100;
		}
	};

	function setTax() {
		for (tax of $scope.aTaxes) {
			tax.percent = $scope.taxPercent / $scope.aTaxes.length;
		}
		$scope.calculateTax();
	};

	function changeTaxType() {
		$scope.aTaxes = [];
		if (!$scope.$clientConfigs.accountDetails) {
			swal("error", "Tax Accounts not set!", "error");
		}
		if ($scope.oVoucher.type === "Sales") {
			if ($scope.taxType === "inter") {
				if ($scope.$clientConfigs.accountDetails.cgstPayable) {
					$scope.aTaxes.push({
						name: "C-GST",
						account: $scope.$clientConfigs.accountDetails.cgstPayable
					})
				} else swal("error", "CGST Payable account not found", "error");
				if ($scope.$clientConfigs.accountDetails.sgstPayable) {
					$scope.aTaxes.push({
						name: "S-GST",
						account: $scope.$clientConfigs.accountDetails.sgstPayable
					})
				} else swal("error", "SGST Payable account not found", "error");

			}
			else if ($scope.taxType === "intra") {
				if ($scope.$clientConfigs.accountDetails.igstPayable) {
					$scope.aTaxes.push({
						name: "I-GST",
						account: $scope.$clientConfigs.accountDetails.igstPayable
					})
				} else swal("error", "IGST Payable account not found", "error");
			}

		} else if ($scope.oVoucher.type === "Purchase") {
			if ($scope.taxType === "inter") {
				if ($scope.$clientConfigs.accountDetails.cgstPaid) {
					$scope.aTaxes.push({
						name: "C-GST",
						account: $scope.$clientConfigs.accountDetails.cgstPaid
					})
				} else swal("error", "CGST Paid account not found", "error");
				if ($scope.$clientConfigs.accountDetails.sgstPaid) {
					$scope.aTaxes.push({
						name: "S-GST",
						account: $scope.$clientConfigs.accountDetails.sgstPaid
					})
				} else swal("error", "SGST Paid account not found", "error");
			}
			else if ($scope.taxType === "intra") {
				if ($scope.$clientConfigs.accountDetails.igstPaid) {
					$scope.aTaxes.push({
						name: "I-GST",
						account: $scope.$clientConfigs.accountDetails.igstPaid
					})
				} else swal("error", "IGST Paid account not found", "error");
			}

		}
	}
});

materialAdmin.controller('accountReportController', function ($scope, accountingService, DatePicker, Pagination) {

	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.aVouchers = []; // to contain vouchers
	$scope.oFilter = {}; // initialize filter object

	function prepareFilterObject(oFilter) {
		var requestFilter = {};

		if (typeof oFilter.voucherId !== 'undefined')
			requestFilter.voucherId = oFilter.voucherId;

		if (typeof oFilter.type !== 'undefined')
			requestFilter.type = oFilter.type;

		if (typeof oFilter.particular !== 'undefined')
			requestFilter.particular = oFilter.particular;

		if (typeof oFilter.from !== 'undefined')
			requestFilter.from = oFilter.from;

		if (typeof oFilter.to !== 'undefined')
			requestFilter.to = oFilter.to;

		return requestFilter;
	}

	$scope.getVouchers = function () {
		var oFilter = prepareFilterObject($scope.oFilter);
		accountingService.getVoucher(oFilter, response => {
			$scope.aVouchers = response.data.data;
			$scope.pagination.total_pages = response.data.count / $scope.pagination.items_per_page;
			$scope.pagination.totalItems = response.data.count;
		}, err => {
		});
	};
	$scope.getVouchers();

});


function attachAccountPopupCtrl(
	$modal,
	$scope,
	$uibModalInstance,
	accountingService,
	oData
) {

	$scope.title = oData.title;
	$scope.history = oData.history;

	// function identifier

	$scope.submit = submit;
	$scope.closeModal = closeModal;

	// init
	(function init() {

		try {
			if ($scope.$configs.master.showAccount) {

				$scope.selectAccountSettings = {
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

				$scope.account = $scope.account || {};

				// Get Account Masters
				($scope.getAccounts = function (input) {

					if (input && input.length <= 2)
						return;

					var oFilter = {
						group: oData.group,
						name: input,
						no_of_docs: 10
					}; // filter to send
					accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

					// Handle failure response
					function onFailure(response) {

					}

					// Handle success response
					function onSuccess(response) {

						$scope.aAccount = oData.accountFilter && oData.accountFilter(response.data.data) || response.data.data;

						if ($scope.account && $scope.account._id && !$scope.aAccount.find(o => o._id === $scope.account._id))
							$scope.aAccount.unshift($scope.account);
					}
				})();

				$scope.addNewAccount = function () {
					$scope.account = {};
					var modalInstance = $modal.open({
						templateUrl: 'views/accounting/accountMasterUpsert.html',
						controller: 'accountMasterUpsertController',
						resolve: {
							'selectedAccountMaster': function () {
								return {
									'accountType': 'Cash in Hand',
									'group': oData.group,
									'isAdd': true
								};
							}
						}
					});

					modalInstance.result.then(function (response) {
						if (response) {
							$scope.aAccount.push(response);
							// $scope.account = response._id;
						}
						console.log('close', response);
					}, function (data) {
						console.log('cancel');
					});
				};
			}
		} catch (e) {
		}

	})();

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function submit() {
		oData.callback($scope.account);
		$uibModalInstance.close();
	}

}

function editOpeningBalncPopUpController(
	$scope,
	$uibModalInstance,
	DatePicker,
	selectedInfo,
	accountingService,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	vm.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	vm.minDate = new Date();
	// vm.minDate.setMonth(3);
	// vm.minDate.setDate(1);
	// if(new Date().getMonth() < 3){
		vm.minDate.setFullYear(vm.minDate.getFullYear() - 2);
	vm.minDate.setMonth(3);
	vm.minDate.setDate(1);
	// }

	if($scope.$configs && $scope.$configs.obDate)
		vm.minDate = new Date($scope.$configs.obDate);


	// init
	(function init() {
		vm.isDisabled = false;
		vm.selectedInfo = angular.copy(selectedInfo);

	})();


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}
	function submit() {
		// if(!vm.amount){
		// 	swal('error', 'amount is mandatory', 'error');
		// 	return;
		// }
		if(!vm.date){
			swal('error', 'date is mandatory', 'error');
			return;
		}

		let request = {
			amount: vm.amount,
			date: vm.date,
			_id: vm.selectedInfo._id,
		};
		vm.isDisabled = true;
		accountingService.updateOpenBal(request, success, failure);

		function success(res) {
			vm.isDisabled = false;
			var msg = res.message;
			swal('Update', msg, 'success');
			$uibModalInstance.close(res);
		}

		function failure(res) {
			vm.isDisabled = false;
			var msg = res.message;
			swal('error', msg, 'error');
			$uibModalInstance.dismiss(res);
		}
	}

}

function resetBalancePopUpController(
	$uibModalInstance,
	DatePicker,
	otherData,
	accountingService,
){
	let vm = this;

	// function identifier
	vm.closeModal = closeModal;
	vm.getAmount = getAmount;
	vm.resetBalance = resetBalance;

	// init()
	(function init(){
		vm.isDisabled = false;
		vm.selectedAccount = otherData.selectedAccount;
		vm.DatePicker = DatePicker;
		vm.minDate = new Date();
		vm.minDate.setMonth(3);
		vm.minDate.setDate(1);
		if(new Date().getMonth() < 3){
			vm.minDate.setFullYear(vm.minDate.getFullYear() - 1);
		}
	})();

	// function Definition

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function getAmount(date) {

		date = new Date(new Date(date).setHours(0, 0, 0)).toISOString();

		let request = {
			from: date,
			to: date,
			account: vm.selectedAccount._id,
			skip: 1,
			no_of_docs: 1
		};

		accountingService.accountBalances(request, successCallback, failureCallback);

		function failureCallback(response) {
			console.log(response);
		}

		function successCallback(response) {
			vm.openingBalance = response.data && response.data[0] && response.data[0].ob || 0;
			vm.closingBalance = response.data && response.data[0] && response.data[0].cb || 0;
		}
	}

	function resetBalance() {
		let request = {
			account: vm.selectedAccount._id,
			start_date: moment(vm.date).format('YYYY-MM-DD')
		};
		vm.isDisabled = true;
		accountingService.resetBalance(request, successCallback, failureCallback);

		function failureCallback(response) {
			vm.isDisabled = false;
			console.log(response);
			swal('Error', response.message, 'error');
		}

		function successCallback(response) {
			vm.isDisabled = false;
			console.log(response);
			swal('Success', response.message, 'success');
			closeModal();
		}
	}

}

