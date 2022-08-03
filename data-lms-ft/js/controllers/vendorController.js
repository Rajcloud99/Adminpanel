materialAdmin.controller("vendorRegistrationController",
	function($filter,
			 $rootScope,
			 $scope,
			 $state,
			 $uibModal,
			 $timeout,
			 DatePicker,
			 lazyLoadFactory,
			 Pagination,
			 Routes,
			 stateDataRetain,
			 growlService,
			 Vehicle,
			 Vendor,
			 dmsService,URL) {

		$scope.lazyLoad = lazyLoadFactory(); // init lazyload
		$scope.DatePicker = angular.copy(DatePicker);
		$scope.vendorDelete = vendorDelete;
		$scope.onStateRefresh = function () {
			getAllVendorsList();
		};

		$scope.columnSetting = {
			allowedColumn: [
				'Name',
				'pan no',
				'Category',
				'Ownership Type',
				'Contact Person',
				'Mobile',
				'Address',
				'Remark'
			]
		};

		$scope.tableHead = [
			{
				'header' :'Name',
				'bindingKeys': 'name',
			},
			{
				'header' :'Contact Person',
				'bindingKeys': 'contact_person_name',
			},
			{
				'header' :'No. Of Vehicle',
				'bindingKeys': 'noOfVehilce'
			},
			{
				'header' :'Mobile',
				'bindingKeys': 'prim_contact_no',
			},
			{
				'header' :'pan no',
				'bindingKeys': 'pan_no',
			},
			{
				'header' :'Category',
				'filter': {
					'name': 'mergeString',
					'aParam': ['category', ', ']
				}
			},
			{
				'header' :'Ownership Type',
				'bindingKeys': 'ownershipType',
			},
			{
				'header' :'Address',
				'filter': {
					'name': 'formatAddress',
					'aParam': [
						'ho_address',
						', '
					]
				}
			},
			{
				'header' :'Remark',
				'bindingKeys': 'ratings.remark'
			}
		];

		$scope.orderBy = {"name":1};

	$scope.pagination = Pagination;
		$scope.oFilter = {};

	/*
	* Rating dropdown prefilled values
	* */
	$scope.rating = [1,2,3,4,5];

	/*
	* Define empty filterObj to filter data accordingly
	* */
	$scope.filterObj = {};
	$scope.dateChange = dateChange;
	$scope.getAllVendorsList = getAllVendorsList;

	/*
	* Multi Select with Search Dropdown Settings
	* */
	$scope.selectSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		showCheckAll: false,
		showUncheckAll: false,
		smartButtonTextConverter: function(itemText, originalItem) {
			return itemText;
		}
	};

	/*
	* Multi Select with Search Dropdown Events*/
	$scope.selectEvents = {
		onSelectionChanged: function () {
			$scope.getAllVendorsList(true);
		}
	};

		(function init() {
			if (stateDataRetain.init($scope))
				return;
		$scope.getAllVendorsList(true);

	})();

	/*
	* Get all Vehicle Types of Particular Client for filters in Multiple select dropdown*/
	(function getGroupVehicleType() {
		function suc(response){

			/*
			* it map on each vehicle group's vehicle type
			* modify name by appending the vehicle group name at the last of the vehicle name
			* return array of object with two parameter with "name, _id"
			* */
			$scope.vehicleTypes = [];
			response.data.data.map(function(obj){
				Array.prototype.push.apply($scope.vehicleTypes,obj.vehicle_types.map(function (subObj) {
																	return {
																		name: subObj.name + '(' + obj.name + ')',
																		_id: subObj._id
																	}
																}));
			});
		}
		function fail(response){
			console.log('failed',response);
		}
		Vendor.getGroupVehicleType(suc, fail);
	})();

	/*
	* Select a row on click*/
	$scope.selectVendor = function(){
		$rootScope.vendor = $scope.vendor;
	};


		$scope.downloadExcelReport = function() {
			var oFilter = prepareFilterObject($scope.oFilter);
			oFilter.download = true;
			oFilter.no_of_docs = 10000;
			oFilter.deleted = false;
			oFilter.skip=1;

			Vendor.getTransportVendor(oFilter, res => {
				var a = document.createElement('a');
				a.href = res.url;
				a.download = res.url;
				a.target = '_blank';
				a.click();
			}, err => {
				console.log(err);
				swal('Error!','Message not defined','error');
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
						client_type : 'VendorTransport',
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

	$scope.uploadFiles = function () {

			var modalInstance = $uibModal.open({
				templateUrl: 'views/uploadFiles.html',
				controller: 'uploadFilesPopUpCtrl',
				resolve:{
					oUploadData:{
						modelName: 'vendor',
						scopeModel : $rootScope.vendor,
						scopeModelId:$rootScope.vendor._id,
						uploadText: "Upload Vendor Documents",
						uploadFunction:Vendor.updateVendor,
					}
				}
			});
			modalInstance.result.then(function(data) {
				$state.reload();
			}, function(data) {
				if (data != 'cancel') {
					//swal("Oops!", data.data.message, "error")
				}
			});
		};

	$scope.previewDocs = function () {
			if(!($scope.vendor && $scope.vendor._id))
				return;
			$scope.getAllDocs = getAllDocs;
			let documents = [];
			(function init() {
				getAllDocs();
			})();

			function getAllDocs(){
				let req = {
					_id: $scope.vendor._id,
					modelName: "vendor"
				};
				dmsService.getAllDocs( req,success,failure);

				function success(res) {
					if (res && res.data) {
						$scope.oDoc = res.data;
						prepareData();
					}else{
						growlService.growl("No documents to preview", "warning");
						return;
					}
				}

				function failure(res) {
					var msg = res.data.message;
					growlService.growl(msg, "error");
					return;
				}
			}

			function prepareData() {
				let mergeData = {};
				$scope.oDoc && $scope.oDoc.files && $scope.oDoc.files.forEach(obj=>{
					mergeData[obj.category] = mergeData[obj.category] || [];
					mergeData[obj.category].push(obj);
				});
				$scope.oDoc = mergeData;

				for (let [key, val] of Object.entries($scope.oDoc)) {
					if(Array.isArray(val)){
						val.forEach((doc, i) => {
							let name = `${key|| 'misc'} ${i || ''}`.toUpperCase();
							documents.push({
								name,
								docName:doc.name,
								_id: $scope.vendor._id,
								modelName: 'vendor',
								url: `${URL.file_server}${doc.name}`
							});
						});
					}else{
						let name = `${key|| 'misc'}`.toUpperCase();
						documents.push({
							name,
							docName:doc.name,
							_id: $scope.vendor._id,
							modelName: 'vendor',
							url: `${URL.file_server}${doc.name}`
						});
					}
				}

				$uibModal.open({
					templateUrl: 'views/carouselPopup.html',
					controller: 'carouselCtrl',
					resolve: {
						documents: function () {
							return documents;
						}
					}
				});
			}

			// if (documents.length < 1) {
			// 	growlService.growl("No documents to preview", "warning");
			// 	return;
			// }

		};

	/*
	* On click on Add vendor Button -
	* set the vendor object in $rootscope to empty
	* set showOnly to true, Such that the form is empty.
	* */
	$scope.add = function(){
		$scope.vendor = $rootScope.vendor = undefined;
		$rootScope.opertaionType = 'add';
	};

	/*
	* on click on edit Vendor button -
	* Copy the selected vendor object to $rootscope for accessibility on other page
	* set isNewVendor property to false, Such that form is prefilled.
	* */
	$scope.edit = function(){
		$scope.vendor = $rootScope.vendor;
		$rootScope.opertaionType = 'update';
	};

	/*
	* on click on Show Vendor button -
	* Copy the selected vendor object to $rootscope for accessibility on other page
	* set isNewVendor property to false, Such that form is prefilled.
	* */
	$scope.show = function(){
		if ($scope.vendor.clientR[0]) {
			$scope.vendor.clientName = [2];
			var i = 0;
			$rootScope.$configs.clientR.forEach(function (id) {
				if (id.lms_id == $scope.vendor.clientR[i])
					$scope.vendor.clientName[i++] = id.name;
			});
		}
		$rootScope.opertaionType = 'show';
		$state.go("masters.vendorRegistration.profile.basicInfo");
	};


	/*
	* get Routes for filters in Multiple select dropdown with search
	* */
		$scope.getRoutes = function (viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {


					Routes.getName(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}
			return [];

		}
	// $scope.getRoutes = function(inputModel){
	// 	if(inputModel.length <= 2)
	// 		return;
	// 	function success(response){
	//
	// 		$scope.routes = [];
	// 		Array.prototype.push.apply($scope.routes,response.data.data.map(function (obj) {
	// 			return {
	// 				name: obj.name,
	// 				_id: obj._id
	// 			}
	//
	// 		}));
	//
	// 	}
	// 	function failure(response){
	// 		console.log(response);
	// 	}
	// 	Routes.getAllRoutes({name: inputModel}, success, failure);
	// };

		function  dateChange() {
			$scope.filterObj.end_date = new Date($scope.filterObj.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

			var month = new Date($scope.filterObj.end_date).setMonth($scope.filterObj.end_date.getMonth() - 12); // select month based on selected start date
			if(new Date(month).setHours(23,59,59) > $scope.filterObj.start_date)
			$scope.filterObj.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
			$scope.min_date = new Date(new Date(month).setHours(23,59,59));
		};

	/*
	* prepare filter object to send
	* */
	function prepareFilterObject(){
		var myFilter = {};
		myFilter.cClientId = $scope.selectedClient;
		if($scope.filterObj.name)
			myFilter.name = $scope.filterObj.name;

		if($scope.filterObj.category)
			myFilter.category = $scope.filterObj.category;

		if($scope.filterObj.pan_no)
			myFilter.pan_no = $scope.filterObj.pan_no;

		if($scope.filterObj.ownershipType)
			myFilter.ownershipType = $scope.filterObj.ownershipType;

		if($scope.filterObj.contact_person)
			myFilter.contact_person_name = $scope.filterObj.contact_person;

		if($scope.filterObj.mobile)
			myFilter.prim_contact_no = $scope.filterObj.mobile;

		if($scope.filterObj.email)
			myFilter.email = $scope.filterObj.email;

		if($scope.filterObj.area)
			myFilter.area = $scope.filterObj.area;

		if($scope.filterObj.remarks)
			myFilter.remarks = $scope.filterObj.remarks;

		if($scope.filterObj.rating)
			myFilter.rating = $scope.filterObj.rating;

		if($scope.filterObj.start_date)
			myFilter.from = $scope.filterObj.start_date;

		if($scope.filterObj.end_date)
			myFilter.to = $scope.filterObj.end_date;

		if($scope.filterObj.vehicleType)
			myFilter.vehicleType = $scope.filterObj.vehicleType.map(obj => obj._id);

		if($scope.filterObj.route)
			myFilter.route = $scope.filterObj.route.map(obj => obj._id);

		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		myFilter.no_of_docs = 20;
		myFilter.sort = $scope.orderBy;
		myFilter.deleted = false;

		return myFilter;
	}

		function vendorDelete(oVendorData){

			swal({
					title: 'Are you sure you want to delete this vendor?',
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
						let oRequest = {
							...oVendorData
						};
						Vendor.deleteVendors(oRequest, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							swal('Success', 'Vendor deleted!!', 'success');
							getAllVendorsList();
						}
					}
				});
			return;
		}

	/*
	* Get Transport vendor list*/
		function  getAllVendorsList(isGetActive){
		function success(data) {
			if(data.data){
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, data);
			}
		}

		function failure(data) {
			console.log(data);
		}

		if(!$scope.lazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject();
		Vendor.getTransportVendor(oFilter, success, failure);
		//dataServices.loadCities();
	};
});

materialAdmin.controller('vendorProfileRegController', function (
	$modal,
	$rootScope,
	$scope,
	$state,
	$uibModal,
	$timeout,
	accountingService,
	otherUtils,
	DatePicker,
	Vendor
) {
	$scope.getAllRoute = getAllRoute;
	$scope.aGSTstates = otherUtils.getState();
	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
	$scope.setStateCode = function(state){
		$scope.vendor.ho_address.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};
	$scope.banking = {};
	$scope.vendorAc = {};
	if(!$rootScope.vendor){
		$scope.vendor = {};
		$scope.vendor.clientId = $scope.selectedClient;
	}else{
		$scope.vendor = $rootScope.vendor;
	}
	if($scope.vendor && $scope.vendor.ho_address && $scope.vendor.ho_address.country) {
		$scope.vendor.ho_address.country = $scope.vendor.ho_address.country;
	}else {
		$scope.vendor.ho_address = {
			country: 'India'
		};
	}

	// for stc if broker is using then category will be transporter by default prefilled
	if($scope.$user && $scope.$user.user_type && $scope.$user.user_type.length && $scope.$user.user_type.indexOf('Broker')+1) {
		$scope.isBroker = true;
		$scope.$constants.aVendorCategory.push("Transporter");
		$scope.vendor.category = [];
		$scope.vendor.category.push("Transporter");
	}

	$scope.client_allowed = angular.copy($scope.$configs.client_allowed);
	if($scope.vendor.account){
		$scope.vendor.account.forEach(item => {
			$scope.client_allowed.forEach(itm =>{
				if(item.clientId === itm.clientId){
					itm.vendorAccountObj = item.ref;
			}
			});
	});
	}
	if($scope.client_allowed &&  $scope.client_allowed.length == 1 && $scope.client_allowed[0].vendorAccountObj){
		$scope.readonlyAc = true;
	}else{
		$scope.readonlyAc = false;
	}


	if ($scope.$configs.clientOps) {
		$scope.vendor.clientR =  $scope.$configs.clientOps;
	}else {
		$scope.vendor.clientR =  $scope.selectedClient;
	}
	$scope.bindContactPerson = function() {
		if($scope.$configs.master && $scope.$configs.master.vendor && $scope.$configs.master.vendor.upDateField) {
			$scope.vendor.contact_person_name = $scope.vendor.name;
			$scope.vendor.phn = $scope.vendor.name
		}
	}
	try{
		if($scope.$configs.master.showAccount){

			// Get Account Masters

			$scope.addNewAccount = function(obj, check){
				$scope.vendor.account = {};
				var modalInstance = $modal.open({
					templateUrl: 'views/accounting/accountMasterUpsert.html',
					controller: 'accountMasterUpsertController',
					resolve: {
						'selectedAccountMaster': function () {
							return {
								'accountType' : 'Cash in Hand',
								'group': ['Vendor'],
								'name': $scope.vendor.name,
								'isAdd': true,
								'ledger_name': $scope.vendor.name,
								'clientId': obj.clientId,
								'tdsApply': true,
								'isGroupNotAllowed': true,
							};
						}
					}
				});

				modalInstance.result.then(function(response) {
					if(response){
						$scope.onAccountSelect(response, response.clientId);
					}
					console.log('close',response);
				}, function(data) {
					console.log('cancel');
				});
			};
			$scope.onDelinkAccount = function(obj) {
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
								masterSchema: 'VendorTransport',
								masterId: $scope.vendor._id,
								acntId: obj._id,
								wasLinkedTo: $scope.vendor.name,
							}, onSuccess, onFailure);

							function onSuccess(res) {
								swal('Success', res.message, 'success');
								$state.go('masters.vendorRegistration.show', {}, { reload: true });
							}
							function onFailure(err) {
								swal('Error', err.message, 'error');
							}
						}
					});
			};
		}
	}catch(e){}

	 $scope.upsertAccountMaster = function(selectedAccountMaster) {
		if(selectedAccountMaster) {
			selectedAccountMaster.fromVendor = true;
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
				if(response){
					$scope.onAccountSelect(response, response.clientId);
				}

				console.log('close', response);
			}, function (data) {
				console.log('cancel');
			});
		}
		else{
			swal('Warning','account not linked on selected vendor','warning');
		}
	}

	$scope.getAccount = function(viewValue, id) {
		if (viewValue && viewValue.toString().length > 1) {

			var oFilter = {
				group: ['Vendor'],
				name: viewValue,
				no_of_docs: 10,
				cClientId: id,
				isGroup: false,
			}; // filter to send
			return new Promise(function (resolve, reject) {

				accountingService.getAccountMaster(oFilter, oSuc, oFail);

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

	$scope.editInfo = function(){
		$rootScope.opertaionType = 'update';
	};

	$scope.onAccountSelect = function(account, clientId){
		if(clientId === $scope.selectedClient){
			if(account.exeRate){
				$scope.vendor.exeRate = account.exeRate;
				$scope.vendor.exeFrom = account.exeFrom;
				$scope.vendor.exeTo = account.exeTo;
			}
			if(account.tdsCategory && account.tdsSources){
			$scope.vendor.tdsCategory = account.tdsCategory;
			$scope.vendor.tdsSources = account.tdsSources;
			$scope.vendor.tdsSection = account.tdsSection;
			$scope.vendor.tdsVerify = true;
			$scope.isHide = false;

			// if(!$scope.vendor.pan_no && account.pan_no){
			// 		$scope.vendor.pan_no = account.pan_no;
			// 	    swal('Warning','PAN Number not linked on vendor!!! New PAN No Updated on Vendor','warning');
			// }else if($scope.vendor.pan_no && account.pan_no &&  $scope.vendor.pan_no != account.pan_no){
			// 	   $scope.vendor.pan_no = account.pan_no;
			// 	  swal('Warning','Different PAN Number found on Account and vendor!!! New PAN No Updated on Vendor','warning');
			//   }
			}
			else{
				$scope.vendor.tdsVerify = false;
				$scope.isHide = true;
				swal('Warning','TDS Category and TDS source not linked on selected account','warning');
			}
		}
	};

	/*
	* redirect user to default page (basicInfo) instead of letting user to see blank page where no tab is selected
	* */
	if($state.current.name === 'masters.vendorRegistration.profile')
		$state.go('masters.vendorRegistration.profile.basicInfo');

	/*
	* it get the all Routes
	* */
	// (function getRoutes(){
	// 	function success(response) {
	// 		$scope.routesList = [];
	// 		Array.prototype.push.apply($scope.routesList,response.data.data.map(function (obj) {
	// 			return {
	// 				name: obj.name,
	// 				_id: obj._id,
	// 				disabled: false
	// 			}
	// 		}));
	// 	}
	// 	function failure(response) {
	// 		console.log(response);
	// 	}
	// 	Vendor.getAllRoute({all:true},success,failure);
	// })();
	function getAllRoute(viewValue) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10
				};

				Vendor.getAllRoute(req, res => {
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
	}

	/*
	* it get the all vehicleType
	* */
	(function getVehicleType() {
		function suc(response){

			/*
			* it map on each vehicle group's vehicle type
			* modify name by appending the vehicle group name at the last of the vehicle name
			* return array of object with two parameter with "name, _id"
			* */
			$scope.vehicleTypesList = [];
			response.data.data.map(function(obj){
				Array.prototype.push.apply($scope.vehicleTypesList,obj.vehicle_types.map(function (subObj) {
					return {
						name: subObj.name + '(' + obj.name + ')',
						_id: subObj._id,
						disabled: false
					}
				}));
			});
		}
		function fail(response){
			console.log('failed',response);
		}
		Vendor.getGroupVehicleType(suc, fail);
	})();

	/*
	* it push the banking object to vendor.banking_detail array of objects
	* */
	$scope.addBank = function(bank){
		if(!$scope.vendor.banking_details)
			$scope.vendor.banking_details = [];
		$scope.vendor.banking_details.push(bank);
		$scope.banking = {};
		if($scope.vendor.name){
			$scope.submitForm()
		}

	};

	/*
	* it splice single object form array of objects with provided index at
	* */
	$scope.removeBank = function(index){
		$scope.vendor.banking_details.splice(index, 1);
		$scope.submitForm()
	};

	/*
	* it push the routes object to vendor.routes array of objects
	* */
	$scope.addRoute = function(items, model, label){
		$scope.routes = {};
		$scope.routes.route = {};
		$scope.routes.route = Object.assign({}, {
			name: items.name,
			_id: items._id,
			disabled: true,
		});

		if(!$scope.vendor.routes){
			$scope.vendor.routes = [];
		}
		$scope.vendor.routes.push($scope.routes);
		$scope.routes = '';
	};

	/*
	* it push vehicleType object to vendor.routes.vehicleTypes array of objects
	* it open model to get vehicleType and Rate to vehicleType object
	* */
	$scope.addVehicleType = function (route, vehicleTypeObj) {
		if(!route.vehicleTypes)
			route.vehicleTypes = [];
		vehicleTypeObj.vehicleType.disabled = true;
		route.vehicleTypes.push(vehicleTypeObj);
	};

	$scope.submitForm = function(){
		if(!$scope.vendor.pan_no) {
			return swal('Required', 'Pan No. is required', 'error');
		}
		if(!$scope.isBroker && !$scope.vendor.prim_contact_no) {
			return swal('Required', 'Vendor Mob. No. is required', 'error');
		}
		const pattern = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
		const found = $scope.vendor.pan_no.match(pattern);
		if(!found) {
			return swal('Error', 'Invalid Pan No. It should be Like ALWPG5809L', 'error');
		}
		function success(response) {
			// console.log(response);
			if($rootScope.opertaionType === 'update')
				var msg = 'Vendor Updated Successfully!';
			else if($rootScope.opertaionType === 'add')
				var msg = 'Vendor Added Successfully!';

			swal(msg);
			
			$rootScope.opertaionType='show';
			$state.go('masters.vendorRegistration.profile.basicInfo');

		}
		function failure(response) {
			console.log(response);
			response = response.data;
			let msg = response.message || 'Message not defined';
			swal('Error!', msg, 'error');
		}

		if($scope.client_allowed){
			$scope.vendor.account = [];
				$scope.client_allowed.forEach(item =>{
					if(item.vendorAccountObj && item.vendorAccountObj._id){
						$scope.vendor.account.push({
							clientId: item.clientId,
							ref: item.vendorAccountObj
						});
					}
			});
		}

		if($scope.vendor.exeRate && !($scope.vendor.exeFrom || $scope.vendor.exeTo))
			return swal('warning', "Both exeFrom and exeTo Date should be Filled",'warning');

		if($rootScope.opertaionType === 'update')
			Vendor.updateTransportVendor(angular.copy($scope.vendor),success,failure);
		else if($rootScope.opertaionType === 'add')
			Vendor.putTransportVendor(angular.copy($scope.vendor),success,failure);
	};

	$scope.uploadCheque = function (event) {
		event.preventDefault();
		var modalInstance = $uibModal.open({
			templateUrl: 'views/vendor/uploadCheque.html',
			controller: 'uploadChequePopUpCtrl',
			resolve:{
				oVendor: $scope.vendor
			}
		});
		modalInstance.result.then(function(data) {
			//$state.reload();
			//console.log(data);
			if(data && data.data){
				$scope.vendor = data.data;
			}
		}, function(data) {
			if (data != 'cancel') {
				//swal("Oops!", data.data.message, "error")
			}
		});
	}

});

materialAdmin.controller("uploadChequePopUpCtrl", function($rootScope, $scope, oVendor, growlService, $uibModalInstance, Vendor) {
	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.oVendor = oVendor;

	$scope.saveClick = function() {
		function success(res) {
			if (res && (res.status == "OK")) {
				var msg = res.message
				swal("success", msg, "success");
				$uibModalInstance.close(res);
			} else {
				var msg = res.message
				swal("Error", msg, "error");
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			var msg = res.message
			$uibModalInstance.dismiss(res);
			//growlService.growl(msg, "danger", 2);
		}
		if ($scope.cheque) {
			var fd = new FormData();
			fd.append('cancelled_cheque', $scope.cheque);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = angular.copy($scope.oVendor._id);
			data.bank_a_c = $scope.bank.a_c;
			Vendor.updateTransportVendor(data,success,failure);
		} else {
			swal("warning", "Please select Bank first!", "warning");
			//$uibModalInstance.close(res);
		}
	}

});


materialAdmin.controller('addVehicleTypeController',function ($uibModalInstance, $scope){

	$scope.types = [{name:'abc'},{name:'def'},{name:'ghi'},{name:'jkl'}];
	$scope.submit = function (vehicleType) {
		$uibModalInstance.close({'vehicleType': vehicleType});
	};
})

materialAdmin.controller("vendorProfileController", function($rootScope, $scope,$interval,$modal, Vendor,messageService) {
	$("p").text("Vendor");
	$rootScope.thisVendor = false;
	$rootScope.vendor;

	console.log($rootScope.vendor);
});

materialAdmin.controller("vendorUpdateController", function($rootScope,formValidationgrowlService, $scope,$interval,$modal,otherUtils, Vendor,messageService) {
	$("p").text("Vendor");
	$rootScope.thisVendor = true;
	$scope.aBanking = [];
	$scope.addressProofType = ["Voter ID","Aadhaar Card","Driving license","Passport"];
	if($rootScope.vendor.banking_details){
		$scope.aBanking = $rootScope.vendor.banking_details;
	}


	$scope.geolocate = function(sUId){
		googlePlaceAPI.geolocate(sUId);
	};
	//var oCity = {};
	$scope.vendor = {};

	$scope.addBank = function(bank,form){
		$scope.vendor.banking_details.push(bank);
		$scope.banking = {};
		$scope.saveVendorDetails(form)
	}
	$scope.removeBank = function(index,form){
		$scope.aBanking.splice(index, 1);
		$scope.saveVendorDetails(form)
	}


	//*************** New Date Picker for multiple date selection in single form ********
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();


	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form **************
	var gAPI = new googlePlaceAPI($interval);
	gAPI.fight($scope,['citys']);

	/*function branchSuc(response){
      $scope.vendorBranch = response.data.data;
    };
    function branchFail(response){
      console.log(response);
    }
    Vendor.getAllVendorBranch(branchSuc, branchFail);*/

	$scope.searchCity = function(){
		setTimeout(function(){
			if($scope.citys && $scope.citys.st){
				$scope.$apply(function() {
					$scope.state = '';
					$scope.state = $scope.citys.st;
				});
				console.log($scope.citys.s);
			}
			if($scope.citys && $scope.citys.cnt){
				$scope.$apply(function() {
					$scope.country = '';
					$scope.country = $scope.citys.cnt;
				});
				console.log($scope.citys.cnt);
			}
		}, 500);
	};

	function success(response) {
		if(response && response.data && response.data.data){
			$rootScope.vendor = response.data.data;
			$scope.vendor = response.data.data;
			var msg = response.data.message;
			swal("Success",msg,"success");
		}
	}

	function failure(res){
		console.error("fail: ",res);
	}


	$scope.$watch(function() {
		return $rootScope.vendor;
	}, function() {
		try{
			$scope.vendor = $rootScope.vendor;
			//setDefaultValues($scope.vendor);
		}catch(e){
			console.log('catch in vendorController');
		}
	}, true);
	$scope.aGSTstates = otherUtils.getState();
	$scope.setStateCode = function(state){
		$scope.vendor.ho_address.state_code = $scope.aGSTstates.find(obj => obj.state === state).first_two_txn;
	};

	$scope.saveVendorDetails = function(form) {
		if($scope.citys){
			//$scope.getFormatedCity($scope.city);
			$scope.vendor.ho_address.city = $scope.citys.c;
		}
		if($scope.state){
			$scope.vendor.ho_address.state = $scope.state;
		}
		if($scope.country){
			$scope.vendor.ho_address.country = $scope.country;
		}
		if(form.$valid && $scope.vendor && !$scope.vendor.isNew ){
			if($scope.vendor._id){
				if($scope.aBanking){
					$scope.vendor.banking_details = $scope.aBanking;
				}
				Vendor.updateVendor($scope.vendor, success,failure);
				console.log('Update Vendor');
			} else {
				var sUrl = "#!/masters/vendorRegistration/profile";
				$rootScope.redirect(sUrl);
			}
		} else {
			$scope.UUmsg = '';
			$scope.updateVendorerrormsg = true;
			$scope.UUmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function(){
				if($scope.updateVendorerrormsg){
					$scope.$apply(function() {
						$scope.updateVendorerrormsg = false;
					});
				}
			}, 7000);
		}
	}
});

materialAdmin.controller("vendorRouteController", function($rootScope,$localStorage, $uibModal,$state, $scope,$interval,
														   $modal, Vendor,messageService) {
	$("p").text("Vendor");
	//var oCity = {};
	$rootScope.vendor;
	$rootScope.thisVendor = true;
	//**** vehicle get start ******/
	function venSuc(response) {
		if(response && response.data && response.data.data){
			$rootScope.vehicleSelected = response.data.data;
			var print = $rootScope.vehicleSelected;
			// console.log(print);
			var msg = response.data.message;
			//swal("Success",msg,"success");
		}
	}

	function venFail(res){
		console.error("fail: ",res);
	}

	Vendor.getGroupVehicleType(venSuc, venFail);
	//**** vehicle get end ******/

	$scope.getRoute = function(viewValue){
		function oSuc(response){
			$scope.routeNames = response.data.data;
		};
		function oFail(response){
			console.log(response);
		}

		/*$scope.startsWith = function(state, viewValue) {
          return $scope.routeNames.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
        }*/

		if(viewValue && viewValue.toString().length>1){
			Vendor.transporterRoutes_ALL(viewValue,oSuc,oFail);
		}
	};
	$scope.getAllVendorRoutes = function(){
		function vSucc(response){
			$scope.aVendorRoutes = response.data.data;
		};
		function vFail(response){
			console.log(response);
		}

		Vendor.getAllVendorRouteService($scope.vendor,vSucc,vFail);
	};
	$scope.getAllVendorRoutes();

	$scope.addRoute = function() {
		function success(response) {
			if($scope.modalInstance){
				$scope.closeModal();
			}
			if(response && response.data && response.data.data){
				if(response && response.data && response.data.data){
					var oData = response.data.data;
					oData.modified_vehicle_type = "";
					for(var j=0; ((oData.vehicle_types)&&(oData.vehicle_types.length)&&(j <oData.vehicle_types.length)) ; j++) {
						if(oData.modified_vehicle_type){
							oData.modified_vehicle_type = oData.modified_vehicle_type +', '+ oData.vehicle_types[j].vehicle_type + '('+oData.vehicle_types[j].vehile_group+')';
						}else{
							oData.modified_vehicle_type = oData.vehicle_types[j].vehicle_type + '('+oData.vehicle_types[j].vehile_group+')';
						}
					}
					$scope.modified_vehicle.push(oData);
				}
				/*$scope.vendor._id = response.data.data._id;
                var tempVendor = $scope.AddSelectedRoute;
                $rootScope.vendor.routes_serviced.pop();
                $rootScope.vendor.routes_serviced.push(tempVendor);*/
				//$rootScope.vendor = response.data.data;
				var msg = response.data.message;
				swal("Success",msg,"success");
				$scope.SelectRoute = '';
			}
		}

		function failure(response){
			if($scope.modalInstance){
				$scope.closeModal();
			}
			console.log(response);
		}

		if($scope.SelectRoute){
			//$scope.vendor.routes_serviced.push($scope.SelectRoute._id); // add route in vendor
			//$scope.AddSelectedRoute = $scope.SelectRoute;
			var routeDataVar = {};
			routeDataVar.name = $scope.SelectRoute.name;
			routeDataVar.route_id = $scope.SelectRoute._id;
			routeDataVar.route_type = $scope.SelectRoute.route_type;
			routeDataVar.clientId = $localStorage.ft_data.userLoggedIn.clientId;
			routeDataVar.vendor_name = $scope.vendor.name;
			routeDataVar.vendor = $scope.vendor._id;
			routeDataVar.vendor_contact = $scope.vendor.prim_contact_no;
			//routeDataVar.remarks = $scope.vendor.remark;
			var data = [];
			angular.forEach($rootScope.vehicleSelected, function(selectedV, key) {
				angular.forEach(selectedV.vehicle_types, function(vehicleObj, key) {
					if(vehicleObj.selected) {
						vehicleObj.vehicle_type = vehicleObj.name;
						vehicleObj.vehicle_type_id = vehicleObj._id;
						vehicleObj.vehile_group = selectedV.name;
						vehicleObj.vehicle_group_id = selectedV._id;
						data.push(vehicleObj);
						//console.log(data);
					}
				});
			});
			/*var aVehicleData = [];
            if(data && data.length>0){
                for(var x=0;x<data.length;x++){
                    aVehicleData[x] = {
                        'vehicle_type' : '',
                        'vehicle_type_id' : '',
                        'vehile_group' : '',
                        'vehicle_group_id' : '',
                    };
                    aVehicleData[x].vehicle_type = data[x].vehicle_types[0].name;
                    aVehicleData[x].vehicle_type_id = data[x].vehicle_types[0]._id;
                    aVehicleData[x].vehile_group = data[x].name;
                    aVehicleData[x].vehicle_group_id = data[x]._id;
                }
            }*/
			routeDataVar.vehicle_types = data; // add vehicle in vendor
		}

		Vendor.addVendorRoute(routeDataVar, success,failure);
		console.log('add Vendor route');
	}

	$scope.editVgroup = function(vDataEdit,index){
		$rootScope.vRouteData = vDataEdit;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/vendor/editPopup.html',
			controller: 'vRoutePopUpCtrl',
		});

		modalInstance.result.then(function(res) {
			if(res && res.data && res.data.data){
				var oData = res.data.data;
				oData.modified_vehicle_type = "";
				for(var j=0; ((oData.vehicle_types)&&(oData.vehicle_types.length)&&(j <oData.vehicle_types.length)) ; j++) {
					if(oData.modified_vehicle_type){
						oData.modified_vehicle_type = oData.modified_vehicle_type +', '+ oData.vehicle_types[j].vehicle_type + '('+oData.vehicle_types[j].vehile_group+')';
					}else{
						oData.modified_vehicle_type = oData.vehicle_types[j].vehicle_type + '('+oData.vehicle_types[j].vehile_group+')';
					}
				}
				$scope.modified_vehicle[index] = oData ;
			}
		}, function() {

		});
	}

	$scope.addNewRoute=function(){
		$scope.modalInstance=$uibModal.open({
			templateUrl: 'views/vendor/addRoutePopUp.html',
			scope:$scope
		});
	}

	$scope.closeModal=function(){
		$scope.modalInstance.dismiss();//$scope.modalInstance.close() also works I think
	};

	$scope.removeRoute = function($index) {
		function Removesuc(response) {
			if(response && response.data && response.data.data){
				$scope.vendor._id = response.data.data._id;
				var msg = response.data.message;
				swal("Success",msg,"success");
				$scope.SelectRoute = '';
			}
		}

		$scope.vendor.routes_serviced.splice($index, 1);

		Vendor.updateVendor($scope.vendor, Removesuc,failure);
		console.log('Update Vendor');
	}
});

materialAdmin.controller("vRoutePopUpCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage,$interval,$modal, Vendor,messageService) {
	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.vRouteData = $rootScope.vRouteData;
	//**** vehicle get start ******/
	function venSuc(response) {
		if(response && response.data && response.data.data){
			$scope.vehicleS = response.data.data;
		}
	}

	function venFail(res){
		console.error("fail: ",res);
	}

	Vendor.getGroupVehicleType(venSuc, venFail);
	//**** vehicle get end ******/

	function vSuccess(res) {
		if (res && res.data && (res.data.status == "OK")) {
			$uibModalInstance.close(res);
		} else {
			//$uibModalInstance.dismiss(res);
		}
	}

	function vFailure(res) {
		$uibModalInstance.dismiss(res);
	}
	$scope.addVehicles = function() {
		$scope.checkDone = false;
		angular.forEach($scope.vehicleS, function(selectedV, key) {
			angular.forEach(selectedV.vehicle_types, function(vehicleObj, key) {
				if(vehicleObj.selected) {
					vehicleObj.vehicle_type = vehicleObj.name;
					vehicleObj.vehicle_type_id = vehicleObj._id;
					vehicleObj.vehile_group = selectedV.name;
					vehicleObj.vehicle_group_id = selectedV._id;
					$scope.vRouteData.vehicle_types.push(vehicleObj);
					$scope.checkDone = true;
				}
			});
		});

		if($scope.checkDone){
			var oSendData = {};
			var oSendData = $scope.vRouteData;
			oSendData.clientId = $localStorage.ft_data.userLoggedIn.clientId;
			//oSendData.vendor = $scope.vRouteData.vendor;
			//oSendData.vehicle_types = $scope.vRouteData.vehicle_types;
			Vendor.updateVroute(oSendData, vSuccess, vFailure);
		}
	}

	function vvvSuccess(res) {
		if (res && res.data && (res.data.status == "OK")) {

		} else {
			//$uibModalInstance.dismiss(res);
		}
	}

	$scope.removeGroup = function($index) {
		$scope.vRouteData.vehicle_types.splice($index, 1);

		Vendor.updateVroute($scope.vRouteData, vvvSuccess, vFailure);
	}
});
materialAdmin.controller("vendorVehicleController", function($rootScope, $scope,$interval,$modal, Vendor,messageService) {
	$("p").text("Vendor");
	//var oCity = {};
	$rootScope.vendor;
	$rootScope.thisVendor = true;

	function venSuc(response) {
		if(response && response.data && response.data.data){
			$rootScope.vehicleSelected = response.data.data;
			var print = $rootScope.vehicleSelected;
			console.log(print);
			var msg = response.data.message;
			//swal("Success",msg,"success");
		}
	}

	function venFail(res){
		console.error("fail: ",res);
	}

	Vendor.getGroupVehicleType(venSuc, venFail);

	function success(response) {
		if(response && response.data && response.data.data){
			$rootScope.vendor = response.data.data;
			var msg = response.data.message;
			swal("Success",msg,"success");
		}
	}

	function failure(res){
		console.error("fail: ",res);
	}


	$scope.$watch(function() {
		return $rootScope.vendor;
	}, function() {
		try{
			$scope.vendor = $rootScope.vendor;
			setDefaultValues($scope.vendor);
		}catch(e){
			console.log('catch in vendorController');
		}
	}, true);


	$scope.saveVehicles = function() {
		var data = [];
		angular.forEach($rootScope.vehicleSelected, function(selectedV, key) {
			angular.forEach(selectedV.vehicle_types, function(vehicleObj, key) {
				if(vehicleObj.selected) {
					data.push(vehicleObj._id);
				}
			});
		});

		$rootScope.vendor.vehicle_services_provided = data;
		Vendor.updateVendor($rootScope.vendor, success, failure);
	}

	function Removesuc(response) {
		if(response && response.data && response.data.data){
			$scope.vendor._id = response.data.data._id;
			var msg = response.data.message;
			swal("Success",msg,"success");
			$scope.SelectRoute = '';
		}
	}

	$scope.removeGroup = function($index) {
		$scope.vendor.vehicle_services_provided.splice($index, 1);

		Vendor.updateVendor($rootScope.vendor, success, failure);
	}

});

materialAdmin.controller("vendorRegisterController", function($rootScope, $scope,$interval,$modal, Vendor,messageService,formValidationgrowlService) {
	$("p").text("Vendor");
	$rootScope.thisVendor = false;
	$scope.vendorRegister = {};
	$scope.vendorRegister.ho_address = {};
	$scope.aBanking = [];
	$scope.addressProofType = ["Voter ID","Aadhaar Card","Driving license","Passport"];
	$scope.
		geolocate = function(sUId){
		googlePlaceAPI.geolocate(sUId);
	};

	var gAPI = new googlePlaceAPI($interval);
	gAPI.fight($scope,['city']);

	$scope.addBank = function(bank){
		$scope.aBanking.push(bank);
		$scope.banking = {};
	}
	$scope.removeBank = function(index){
		$scope.aBanking.splice(index, 1);
	}

	/*function branchSuc(response){
      $scope.vendorBranch = response.data.data;
    };
    function branchFail(response){
      console.log(response);
    }
    Vendor.getAllVendorBranch(branchSuc, branchFail);*/

	$scope.searchRegisterCity = function(){
		setTimeout(function(){
			if($scope.city && $scope.city.st && $scope.vendorRegister){
				$scope.$apply(function() {
					$scope.states = '';
					$scope.states = $scope.city.st;
					$scope.cities = $scope.city.c;
				});
				console.log($scope.city.s);
			}
			if($scope.city && $scope.city.cnt && $scope.vendorRegister){
				$scope.$apply(function() {
					$scope.countrys = '';
					$scope.countrys = $scope.city.cnt;
				});
				console.log($scope.city.cnt);
			}
		}, 500);
	};

	function successPost(response){
		if(response && response.data && response.data.data){
			$scope.vendorRegister = {};
			$scope.city = '';
			$scope.states = '';
			$scope.countrys = '';
			$rootScope.vendor.isNew = false;
			var tempVendor = [response.data.data];
			$rootScope.vendors = $rootScope.vendors.concat(tempVendor);
			$rootScope.vendor = response.data.data;
			var msgg = response.data.message;
			swal("Registered",msgg,"success");
			var sUrl = "#!/masters/vendorRegistration/profile";
			$rootScope.redirect(sUrl);
		}
	}
	function failure(res){
		console.error("fail: ",res);
	}

	$scope.$watch(function() {
		return $rootScope.vendor;
	}, function() {
		try{
			$scope.vendor = $rootScope.vendor;
			setDefaultValues($scope.vendor);
		}catch(e){
			console.log('catch in vendorController');
		}
	}, true);

	$scope.createVendorerrormsg = false;
	$scope.vendorRegisterDetails = function(form) {
		$scope.VUmsg = '';
		if(form.$valid){
			$scope.vendorRegister.ho_address.city = $scope.city.c;
			if($scope.vendorRegister && $scope.states){
				$scope.vendorRegister.ho_address.state = $scope.states;
			}
			if($scope.vendorRegister && $scope.countrys){
				$scope.vendorRegister.ho_address.country = $scope.countrys;
			}
			if($scope.aBanking.length>0){
				$scope.vendorRegister.banking_details = $scope.aBanking;
			}

			Vendor.saveVendor($scope.vendorRegister, successPost,failure);
		}else {
			$scope.VUmsg = '';
			$scope.createVendorerrormsg = true;
			$scope.VUmsg = formValidationgrowlService.findError(form.$error);
			setTimeout(function(){
				if($scope.createVendorerrormsg){
					$scope.$apply(function() {
						$scope.createVendorerrormsg = false;
					});
				}
			}, 7000);
		}
	}
});


