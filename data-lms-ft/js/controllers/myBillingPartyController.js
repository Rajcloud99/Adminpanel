materialAdmin.controller('myBillingPartyController',function(
	$modal,
	$uibModal,
	$scope,
	$state,
	objToCsv,
	billingPartyService,
	customer,
	growlService,
	DatePicker,
	lazyLoadFactory,
	stateDataRetain,
	cityStateService,
	Pagination
)	{

	// object Identifiers
	$scope.DatePicker = angular.copy(DatePicker); // initialize Datepicker
	$scope.aBillingParty = []; // to contain Billing Party
	$scope.oFilter = {}; // initialize filter object
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.pagination.items_per_page = 8;
	$scope.dateChange = dateChange;
	$scope.selectedBillingParty = null; // to contain selected Billing Party



	// functions Identifiers
	$scope.getBillingParty = getBillingParty;
	$scope.selectThisRow = selectThisRow;
	$scope.upsertBillingParty = upsertBillingParty;
	$scope.viewBillingParty = viewBillingParty;
	$scope.getCustomers = getCustomers;
	$scope.uploadBp = uploadBp;
	$scope.downloadCsv = downloadCsv;
	//$scope.downloadReport = downloadReport;

	// INIT functions
	(function init(){
		getBillingParty();
	})();

	// Actual Functions

	// Add or Edit Billing Party Modal
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
					$scope.selectedBillingParty = response;
				else
					$scope.aBillingParty.push(response);

			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}
	$scope.editClientId = function (selectedInfo) {
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
					client_type : 'billingParty',
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
	};

	// send to view Billing Party page
	function viewBillingParty(selectedBillingParty) {
		if(selectedBillingParty){
			$state.go('masters.view', {'data' : selectedBillingParty});
		}
	}

	// Get Billing Party from backend
	function getBillingParty(download=false){

		var oFilter = prepareFilterObject(download);
		billingPartyService.getBillingParty(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			//swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response) {
			if (download) {
				// if(!($scope.oFilter.start_date && $scope.oFilter.end_date)){
				// 	swal('warning', "Both From and To Date should be Filled",'warning');
				// 	return;
				// }
				var a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			} else {
				$scope.aBillingParty = response.data;

				// update pagination
				$scope.pagination.total_pages = response.count / $scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.count;

				//  setTimeout b'cos, its called when angular has done its rendering
				setTimeout(function () {
					// show 1st row as selected row by default
					$scope.aBillingParty[0] && $scope.selectThisRow($scope.aBillingParty[0], 0);
				});
			}
		}
	}

	function uploadBp(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			billingPartyService.uploadCommon({modelName: 'billingparty'}, data)
				.then(function (d) {
					swal({title:'Info', text:d.message, type:"info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message,'error');
				});
		}
	}

	function downloadCsv() {
		objToCsv(null,
			[
				'Name',
				'Bill Name',
				'Address',
				'Segment',
				'GSTIN',
				"Pan No",
				"CIN No",
				"Contact Person",
				"Contact No",
				"State",
				'Location',

			],
			[]
		);
	}

	function getCustomers(viewValue){
		if(!viewValue || viewValue.length < 2)
			return;

		return new Promise(function (resolve,reject) {
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

	$scope.deleteBillingParty = function() {
		swal({
			title: "Confirm delete ?",
			text: "billingParty " + $scope.selectedBillingParty.name + " will be removed from BillingParty masters",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function() {
			function succDeleteBillingParty(response) {
					if (response.message) {
						growlService.growl(response.message, "success");
						$state.go('masters.billingParty', {}, {reload: true});

			     }
			}

			function failDeleteBillingParty(response) {
				if (response.message) {
					growlService.growl(response.message, "danger");
				}
			}
			billingPartyService.deleteBillingParty($scope.selectedBillingParty, succDeleteBillingParty, failDeleteBillingParty);
		});
	};


	// function downloadReport() {
	// 	var oFilter = prepareFilterObject($scope.oFilter);
	// 	oFilter.download = true;
	// 	billingPartyService.getBillingParty(oFilter, res => {
	// 		var a = document.createElement('a');
	// 		a.href = res.url;
	// 		a.download = res.url;
	// 		a.target = '_blank';
	// 		a.click();
	// 	}, err => {
	// 		console.log(err);
	// 		swal('Error!','Message not defined','error');
	// 	});
	// }
	function dateChange(){
		$scope.oFilter.end_date = new Date($scope.oFilter.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.oFilter.end_date).setMonth($scope.oFilter.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > $scope.oFilter.start_date)
		$scope.oFilter.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23,59,59));
	};

	function prepareFilterObject(download) {
		var requestFilter = {};

		if($scope.oFilter.clientId)
			requestFilter.clientId = $scope.oFilter.clientId;

		if($scope.oFilter.name)
			requestFilter.name = $scope.oFilter.name;

		if($scope.oFilter.address)
			requestFilter.address = $scope.oFilter.address;

		if($scope.oFilter.category)
			requestFilter.category = $scope.oFilter.category;

			if($scope.oFilter.state)
			requestFilter.state_name = $scope.oFilter.state;




		if($scope.oFilter.customer)
			requestFilter.customer = $scope.oFilter.customer._id;

		if($scope.oFilter.contact_person)
			requestFilter.contact_person = $scope.oFilter.contact_person;

		if($scope.oFilter.contact_number)
			requestFilter.contact_number = $scope.oFilter.contact_number;

		if($scope.oFilter.gstin)
			requestFilter.gstin = $scope.oFilter.gstin;

		if($scope.oFilter.state_code)
			requestFilter.state_code = $scope.oFilter.state_code;

		if($scope.oFilter.billing_dates)
			requestFilter.billing_dates = $scope.oFilter.billing_dates;

		if($scope.oFilter.last_modified_by_name)
			requestFilter.last_modified_by_name = $scope.oFilter.last_modified_by_name;

		if($scope.oFilter.start_date)
			requestFilter.from = $scope.oFilter.start_date;

		if($scope.oFilter.end_date)
			requestFilter.to = $scope.oFilter.end_date;

		if($scope.oFilter.aggregateBy)
			requestFilter.aggregateBy = $scope.oFilter.aggregateBy;

		if($scope.oFilter.reverse_charge)
			requestFilter.reverse_charge = $scope.oFilter.reverse_charge;

		if(download){
			requestFilter.download = download;
			requestFilter.all = true;
		}else {

			requestFilter.skip = $scope.pagination.currentPage;
			requestFilter.no_of_docs = $scope.pagination.items_per_page;
		}
		return requestFilter;
	}


	function selectThisRow(oBillingParty, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		$scope.selectedBillingParty = oBillingParty;
	}

	//////////////////////////////////////////////////


});

materialAdmin.controller('billingPartyUpsertController',function(
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
){
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
		$scope.readonlyAc = false;
		if(typeof selectedBillingParty !== 'undefined' && selectedBillingParty !== null){
			$scope.oBillingParty = angular.copy(selectedBillingParty); //initialize with param
			$scope.oBillingParty.account =  $scope.oBillingParty.account || {};
			$scope.oBillingParty.billBook = $scope.oBillingParty.billBook || {};
			$scope.oBillingParty.customer = $scope.oBillingParty.customer;
			if($scope.oBillingParty.account  && $scope.oBillingParty.account._id){
				$scope.readonlyAc = true;
			}
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

		if($scope.oBillingParty && $scope.oBillingParty.withHoldAccount) {
			$scope.showAccount = false;
			$scope.readwhcc = true;
		}
		else {
			$scope.showAccount = true;
			$scope.readwhcc = false;
		}

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
						no_of_docs: 10,
						isGroup: false,
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

				$scope.addNewAccount = function(type, check){
					var modalInstance = $modal.open({
						templateUrl: 'views/accounting/accountMasterUpsert.html',
						controller: 'accountMasterUpsertController',
						resolve: {
							'selectedAccountMaster': function () {
								return {
									'accountType' : 'Cash in Hand',
									'group': type ? [type] : ['Customer'],
									'name': $scope.oBillingParty.name,
									'ledger_name':$scope.oBillingParty.name,
									'isAdd': true,
									'typeBP' : type,
									'isGroupNotAllowed': true,
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
							$scope.oBillingParty.account = response;

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
					group: group,
					isGroup: false,
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
					deleted: false
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
					no_of_docs: 10,
					deleted: false
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

	//////////////////////////////////////////////////

});


materialAdmin.controller('billingPartyViewController',function(
	$modal,
	$scope,
	$state,
	$stateParams
){
	// object Identifiers
	if(typeof $stateParams.data !== 'undefined' && $stateParams.data !== null)
		$scope.oBillingParty =  angular.copy($stateParams.data) ; //initialize
	else
		$state.go('masters.billingParty');


	// functions Identifiers
	$scope.upsertBillingParty = upsertBillingParty;


	// INIT functions


	// Actual Functions
	// send to edit account master page
	function upsertBillingParty(oBillingParty) {

		var modalInstance = $modal.open({
			templateUrl: 'views/myBillingParty/billingPartyUpsert.html',
			controller: 'billingPartyUpsertController',
			resolve: {
				'selectedBillingParty': function () {
					return oBillingParty;
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				$scope.oBillingParty = response;
			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});
	}


	//////////////////////////////////////////////////

});
