materialAdmin.controller("UsersController", UsersControllerFunction);
UsersControllerFunction.$inject = [
	'$scope',
	'$state',
	'$localStorage',
	'$modal',
	'accountingService',
	'userService',
	'departmentService',
	'roleService',
	'DatePicker',
	'branchService',
	'customer',
	'Vehicle',
	'tableAccessDetailFactory'
];

function UsersControllerFunction(
	$scope,
	$state,
	$localStorage,
	$modal,
	accountingService,
	userService,
	departmentService,
	roleService,
	DatePicker,
	branchService,
	customer,
	Vehicle,
	tableAccessDetailFactory
	) {

	$scope.tabs = [
		{title: 'BASIC INFO', content: './../../views/user/userBasicInfo.html'},
		{title: 'ROLE', content: './../../views/user/userRole.html'},
		{title: 'FEATURE', content: './../../views/user/feature.html'},
		{title: 'TABLE COLUMN SETTING', content: './../../views/user/tableColumnSetting.html'}
	];

	$scope.userIdExist = false;
	$scope.viewUserInfo = viewUserInfo;
	$scope.viewUserPass = viewUserPass;
	$scope.prepTable = prepTable;
	$scope.getAllTableCoumumnSetting = getAllTableCoumumnSetting;
	$scope.saveTableCol = saveTableCol;
	$scope.selectedUser = null;
	$scope.dateChange = dateChange;
	$scope.getAllBranch = getAllBranch;
	$scope.getAllCustomer = getAllCustomer;
	$scope.onBranchSelect = onBranchSelect;
	$scope.onCustSelect = onCustSelect;
	$scope.getVname = getVname;
	$scope.onVehicleSelect = onVehicleSelect;
	$scope.removeVehicle = removeVehicle;
	$scope.clearAll = clearAll;
	$scope.filterObj = {};
	$scope.oColHeaderSet = {};
	//$scope.oColHeaderSet.checked = {};
	$scope.oUser = {};
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	//*************** New Date Picker for multiple date selection in single form ************
	$scope.today = function () {
		$scope.dt = new Date();
	};
	$scope.today();
	$scope.tableView = {};

	$scope.tableAccessDetail = tableAccessDetailFactory;
	Object.freeze(tableAccessDetailFactory);

	$scope.selectSettings = {
		displayProp: "name",
		enableSearch: true,
		searchField: 'name',
		smartButtonMaxItems: 1,
		smartButtonTextConverter: function (itemText, originalItem) {
			return itemText;
		}
	};

	$scope.checkUserId = function (id) {
		function succ(data) {
			// console.log(data);
			if (!data.isAvailable)
				$scope.userIdExist = true;
			else
				$scope.userIdExist = false;
		};

		function fail(data) {
			console.log(data);
		};

		userService.userIsAvailiable(id, succ, fail);
	};

	function viewUserPass(selectedUser) {
		if (selectedUser.password)
			return;
		userService.getPassword(selectedUser, success, failure);

		function success(response) {
			selectedUser.password = response.data.password;
		}

		function failure(response) {
			console.log(response);
		}
	}

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function ($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	function viewUserInfo(selectedUser) {
		if (selectedUser) {
			$state.go('usermanage.view', {'data': selectedUser});
		}
	}

	$scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	//************* New Date Picker for multiple date selection in single form ******************

	//-------------------------******************------------------------------------------
	$scope.setMode = function (mode) {
		$scope.user_mode = mode;
		// if (mode === 'Edit')
			// $scope.getAllBranch();
		// try{$scope.branch = $scope.oUser.branch.map(obj=>obj._id)[0] ? $scope.oUser.branch.map(obj=>obj._id) : $scope.oUser.branch;}catch(e){}
	};

	$scope.deleteUser = function (user) {
		swal({
				title: 'Are you sure you want to delete this user?',
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
					userService.deleteUser(user, successCallback, failureCallback);

					function failureCallback(response) {
						swal('', response.message, 'error');
					}

					function successCallback(response) {
						swal('', response.message, 'success');
						$state.reload();
					}
				}
			});
	};

	$scope.setMode("View");

	$scope.setRoleMode = function (mode) {
		$scope.roleInputMode = mode;
		if (mode == 'Edit') {
			/*if($scope.oUser && $scope.oUser.oRoleData &&  $scope.oUser.oRoleData.name){
				$scope.oUser.oRoleData.name = "";
			}*/
			$scope.oUser.oRoleData = {};
		}
	};
	$scope.setRoleMode("View");
	//----------------------***********************-----------------------------------------
	//---------------****************------------------------------------------------------
	$scope.oSearchRegisteredUser = {};
	$scope.checkAll = 0;

	//------------------------------------------------------------------------------------------
	function getAllRoles() {
		function succGetRoles(response) {
			if (response.data && response.data.length > 0) {
				$scope.aRole = response.data;

			}
			$scope.checkAll++;
		}

		function failGetRoles(response) {
			$scope.checkAll++;
			console.log(response)
		}

		roleService.getRoles({all: true}, succGetRoles, failGetRoles)
	}

	getAllRoles();
	//------------------------------------------------------------------------------------------

	//------------------------------------------------------------------------------------------
	function getAllTableCoumumnSetting(id, tabName) {
		function succGetColSet(response) {
			$scope.aAccessTable = response.data;
			if (response && response.data && response.data.length && $scope.userLoggedIn.userId === '000000' && $scope.tableView) {
				let idx = response.data.findIndex(e => e.clientId === '000000' && e.pages === $scope.tableView.colSetting);
				if(idx !== -1) {
					$scope.configs = response.data[idx].configs;
				}

			}
			prepTable();
		}

		function failGetColSet(response) {
			$scope.checkAll++;
			console.log(response)
		}

		if (tabName == 'TABLE COLUMN SETTING')
			roleService.getTableColSet({all: true, _id: $scope.oUser._id}, succGetColSet, failGetColSet)
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



	function onVehicleSelect(item) {
		$scope.oUser.vehicle_allowed = $scope.oUser.vehicle_allowed || [];

		if($scope.oUser.vehicle_allowed.find(o => o === $scope.oUser.vehicle.vehicle_reg_no))
			return swal('Warning', 'vehicle Already added!!!', 'warning');

		$scope.oUser.vehicle_allowed.push(item.vehicle_reg_no);
		$scope.oUser.vehicle = '';
	}
	function removeVehicle(select, index){
		$scope.oUser.vehicle_allowed.splice(index, 1);
	}
	function clearAll(select, index){
		$scope.oUser.vehicle_allowed = [];
	}


	//getAllTableCoumumnSetting();

	function saveTableCol(colSeitting) {

		let page = $scope.tableView.colSetting;
		let table = page.split('_').slice(-1)[0];
		let configs = {};
		configs[table] = {};
		let access = $scope.aHeader.reduce((arr, oHead) => {
			if(oHead.checked){
				arr.push(oHead.key);
				if($scope.userLoggedIn.userId === '000000' ) {
					let keyc = oHead.key;
					configs[table][keyc] = oHead.header;
				}
			}

			return arr;
		}, []);
		let visible = access;

		if($scope.aAccessTable.length){
			let foundData = $scope.aAccessTable.find(oAcc => oAcc.pages === page && oAcc.table === table);
			if(foundData) {
				visible = foundData.visible.filter( str => access.indexOf(str)+1)
			}
		}

		let request = {
			table,
			pages: page,
			visible,
			access,
			configs,
			"_id": $scope.oUser._id
		};
		userService.updateTableConfig(request, successVis, failureVis);

		function successVis(data) {
			//console.log(data);
			swal("Done!", data.message, "success");
			$state.reload();
		}

		function failureVis(res) {
			swal("Error in table column setting", "", "error");
		}
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 10,
				};

				$scope.$configs.client_allowed && $scope.$configs.client_allowed.map((v) => {
					req.multiClientId = req.multiClientId || [];
					req.multiClientId.push(v.clientId);
				});
				req.multiClientId = JSON.stringify(req.multiClientId);

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

	function onBranchSelect(SelectedBranch) {
		$scope.oUser.branch = $scope.oUser.branch || [];
		let obj = {
			_id: SelectedBranch._id,
			name: SelectedBranch.name,
			read: true,
			write: true
		};
		$scope.oUser.branch.push(obj);
		$scope.oUser.selectBranch = undefined;
	}
	$scope.removeBranch = function(i){
		$scope.oUser.branch.splice(i, 1);
	};

	$scope.readAll = function(key){
		$scope.oUser.branch.forEach(obj =>{
			if(key === true){
				obj.read = key;
			}else if(key === false){
				obj.write = key;
				obj.read = key;
			}
		})
	};
	$scope.writeAll = function(key){
		$scope.oUser.branch.forEach(obj =>{
			if(key === true){
				obj.write = key;
				obj.read = key;
			}else if(key === false){
				obj.write = key;
			}

		})
	};


	function getAllCustomer(viewValue) {
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

	function onCustSelect(SelectedCust) {
		$scope.oUser.aCustomer = $scope.oUser.aCustomer || [];
		let obj = {
			_id: SelectedCust._id,
			name: SelectedCust.name,
		};
		$scope.oUser.aCustomer.push(obj);
		$scope.oUser.selectCust = undefined;
	}

	$scope.removeCust = function(i){
		$scope.oUser.aCustomer.splice(i, 1);
	};

	//------------------------------------------------------------------------------------------
	// function getTableColName(colSetting) {
	// 	$scope.aHeader = [];
	// 	if (colSetting) {
	// 		let aCs = colSetting.split('_');
	// 		if (aCs && aCs.length > 0) {
	// 			let aRCs = aCs.reverse();
	// 			let oTc = $scope.tableAccessDetail[colSetting][aRCs[0]];
	// 			let keyc = Object.keys(oTc);
	// 			for (let i of keyc) {
	// 				if ($scope.aHeaderChecked.find(element => element.header == oTc[i].header)) {
	// 					$scope.aHeader.push({'header': oTc[i].header, 'checked': true});
	// 				} else {
	// 					$scope.aHeader.push({'header': oTc[i].header, 'checked': false});
	// 				}
	// 			}
	// 		}
	// 	}
	//
	// }

	function prepTable() {
		let colSetting = $scope.tableView.colSetting; // name of dropdown table s.t. BOOKING_MANAGEMENT_GR
		if(!colSetting) return;
		let aSelected = [];
		let tableName = colSetting.split('_').slice(-1)[0];// last part name of dropdown s.t. GR/TRIP/VOUCHER

		if($scope.aAccessTable.length){
			let foundDatas = $scope.aAccessTable.find(oAcc => oAcc.clientId === '000000' && oAcc.pages === colSetting && oAcc.table === tableName);
			let foundData = $scope.aAccessTable.find(oAcc => oAcc.clientId !== '000000' && oAcc.pages === colSetting && oAcc.table === tableName);
			foundData = foundDatas ? foundDatas : foundData;
			aSelected = foundData ? foundData.access : [];
			aSelected = Array.from(new Set(aSelected));// if backend is sending duplicate
		}

		if($scope.aAccessTable.length){
			if ($scope.userLoggedIn.userId === '000000' && $scope.tableView) {
				let idx = $scope.aAccessTable.findIndex(e => e.clientId === '000000' && e.pages === $scope.tableView.colSetting);
				if(idx !== -1) {
					$scope.configs = $scope.aAccessTable[idx].configs;// gets changed header object
				}

			}
		}

		$scope.aHeader = [];

		let tableData = tableAccessDetailFactory[colSetting];// default table list
		if(aSelected.length) {
			let sortedAccess = aSelected.slice(0);
			tableData[`${tableName}Column`].forEach((item) => {
				if(aSelected.indexOf(item) === -1) {
					sortedAccess.push(item);// pushing which don't have user acess
				}
			});
			tableData[`${tableName}Column`] = sortedAccess;
		}

		for (let key of tableData[`${tableName}Column`]) {
			if($scope.userLoggedIn.userId === '000000') {
				$scope.aHeader.push({
					label : tableData[tableName][key].header,
					header: ($scope.configs && $scope.configs[tableName] && $scope.configs[tableName][key]) || tableData[tableName][key].header,
					key,
					checked: aSelected.length ? !!(aSelected.indexOf(key)+1) : true
				})
			} else {
				$scope.aHeader.push({
					label: tableData[tableName][key].header,
					key,
					checked: aSelected.length ? !!(aSelected.indexOf(key)+1) : true
				})
			}
		}
		$scope.aHeader = Array.from(new Set($scope.aHeader));
	}

	//------------------------------------------------------------------------------------------
	function getAllTableSetting() {

		let tbs = [];
		for (let ta in $scope.tableAccessDetail) {
			tbs.push(ta);
		}
		$scope.tbAcc = tbs;

	}

	getAllTableSetting();

	//------------------------------------------------------------------------------------------

	function getDepartment() {
		function sucDepartment(response) {
			// console.log(response);
			$scope.aDepartment = response.data;
			$scope.checkAll++;

		}

		function failDepartment(response) {
			$scope.checkAll++;
			console.log(response);
		}

		departmentService.getDepartmentTrims({}, sucDepartment, failDepartment);
	}

	getDepartment();

	//***-----------------------------------------------------------------------
	$scope.initializeRole = function () {
		$scope.loggedUserRole = ($localStorage && $localStorage.ft_data && $localStorage.ft_data.access_control) ? angular.copy($localStorage.ft_data.access_control) : {};
		//$scope.oUser.oRoleData.role={};
	}();

	//--------------********************------------------------------------------------------
	$scope.pageChanged = function () {
		$scope.getUsersList(true);
	};

	//-------------------------------------*****************-----------------------------------
	function successUserByName(response) {
		$scope.aUserName = response.data;
	}

	function failUserByName(response) {
		//
	}

	$scope.getUserByName = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			userService.getUserNames(viewValue, successUserByName, failUserByName);
		} else if (viewValue == '') {
			$scope.getUsersList();
		}
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.oSearchRegisteredUser._id = $item._id;
		$scope.getUsersList();
	};

	$scope.clearSearch = function () {
		delete $scope.oSearchRegisteredUser._id;
		$scope.getUsersList();
	};

	$scope.checkAllRole = function (all) {
		if (all) {
			//all = false;
			$scope.oUser.oRoleData.role = angular.copy($scope.loggedUserRole);
		} else {
			//$scope.selectedAll = false;
			$scope.oUser.oRoleData.role = undefined;
		}
		/*angular.forEach($scope.Items, function (item) {
			item.Selected = $scope.selectedAll;
		});*/

		//console.log($scope.loggedUserRole);

	};
	$scope.selectmodules = function (module,all) {
		if(!$scope.oUser.oRoleData.role){
			$scope.oUser.oRoleData.role = {};
		}

		if (all) {
			for(let access in $scope.loggedUserRole[module]){
				$scope.loggedUserRole[module][access] = true;
			}
			return $scope.oUser.oRoleData.role[module] = $scope.loggedUserRole[module];
		}
		else {
			for(let access in $scope.loggedUserRole[module]){
				$scope.loggedUserRole[module][access] = false;
			}
			return $scope.oUser.oRoleData.role[module] = $scope.loggedUserRole[module];
		}
	};


	//----------------------********************-------------------------------------
	$scope.downloadReport = function () {

		if (!($scope.filterObj.start_date && $scope.filterObj.end_date)) {
			swal('warning', "Both From and To Date should be Filled", 'warning');
			return;
		}
		var oFilter = prepareFilterObject();
		oFilter.download = true;
		oFilter.all = true;
		oFilter.no_of_docs = 300;
		userService.getUsers(oFilter, function (data) {
			if (data.url) {
				var a = document.createElement('a');
				a.href = data.url;
				a.download = data.url;
				a.target = '_blank';
				a.click();
			}
		});
	}

	function dateChange() {
		$scope.filterObj.start_date = new Date($scope.filterObj.start_date.setHours(0, 0, 0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.filterObj.start_date).setMonth($scope.filterObj.start_date.getMonth() + 2); // select month based on selected start date
		$scope.filterObj.end_date = new Date(new Date(month).setHours(23, 59, 59)); //sets hour minutes & sec on selected month
	};

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if ($scope.oSearchRegisteredUser._id) {
			myFilter._id = $scope.oSearchRegisteredUser._id;
		}
		if ($scope.filterObj.start_date)
			myFilter.from = $scope.filterObj.start_date;

		if ($scope.filterObj.end_date)
			myFilter.to = $scope.filterObj.end_date;

		myFilter.skip = $scope.currentPage;

		return myFilter;
	}

	$scope.getUsersList = function (isPagination) {
		var oFilter = prepareFilterObject(isPagination);
		userService.getUsers(oFilter, function (res) {
			if (res && res.data) {
				$scope.aUser = res.data;
				$scope.total_pages = res.count / $scope.items_per_page;
				$scope.totalItems = res.count;
				if (res.data && res.data[0]) {
					$scope.selectUser(0, 0);

				} else {
					$scope.oUser = {};
				}
			}
		});
	};

	//-------------------****----------------------------------------------------------
	function removeSelectedCSSclass() {
		listItem = $($('.lv-item'));
		listItem.siblings().removeClass('list_border_background');
	}

	//------------------******************----------------------------------------------
	function addSelectedCSSclass(i) {
		setTimeout(function () {
			listItem = $($('.lv-item')[i]);
			listItem.addClass('list_border_background');
		}, 100);
	}

	//---------------------***********---------------------------------------------------
	$scope.selectUser = function (u, i) {
		$scope.setMode("View");
		if ($scope.aUser && $scope.aUser.length > 0) {
			setViewOrEditData($scope.aUser[i]);
			removeSelectedCSSclass();
			addSelectedCSSclass(i);
			$scope.selectedUser = u;
		}
	};
	//---------------------****************************-----------------------------------
	$scope.$watch('user_mode', function (newVal, oldVal) {
		switch ($scope.user_mode) {
			case "Add":
				removeSelectedCSSclass();
				setAddData();
				break;
			default:
				break;
		}

		$scope.showAccountDropdown = ($scope.oUser || {}).account ? false : true;
	}, true);
	//---------------------------------------**********---------------------------------------

	//-----------------------Set Add Data--------------------------------------------------
	function setAddData() {
		$scope.oUser = {"oRoleData": {}};
	}

	//-----------------------------Binding Functions------------------------------------
	function bindDepartmentData(departmentData) {
		var toReturnData;
		if (departmentData && (departmentData.department_id || departmentData.department) && $scope.aDepartment && $scope.aDepartment.length > 0) {
			for (var i = 0; i < $scope.aDepartment.length; i++) {
				if (departmentData.department_id == $scope.aDepartment[i]._id) {
					toReturnData = $scope.aDepartment[i];
				} else if (departmentData.department == $scope.aDepartment[i].name) {
					toReturnData = $scope.aDepartment[i];
				}
			}
		}
		return toReturnData;
	}

	function bindRoleData(roleDate) {
		var toReturnData = {};
		if (roleDate && roleDate.access && $scope.aRole && $scope.aRole.length > 0) {
			for (var i = 0; i < $scope.aRole.length; i++) {
				if (roleDate.access._id == $scope.aRole[i]._id) {
					toReturnData = $scope.aRole[i];
				}
			}
		}
		return toReturnData;
	}

	//-------------------------Set Edit Data---------------------------------------------
	function setViewOrEditData(userData) {
		$scope.setRoleMode("View");
		userData.department_data = bindDepartmentData(userData);
		userData.oRoleData = bindRoleData(userData);
		$scope.oUser = userData//angular.copy(userData);
		$scope.oUser.aCustomer = $scope.oUser.customer//angular.copy(userData);
		getAllTableCoumumnSetting($scope.oUser._id, "TABLE COLUMN SETTING");
		$scope.showAccountDropdown = ($scope.oUser || {}).account ? false : true;
		// console.log($scope.aRole)
	}

	//-----------------------------------------------------------------------------------------

	$scope.$watch('checkAll', function (newVal, oldVal) {
		if (newVal != oldVal) {
			if ($scope.checkAll === 2) {
				$scope.getUsersList();
			}
		}
	}, true);
	//----------------------------------------------------------------

	//----------------------------Save---------------------------------

	function succSubmitUser(response) {
		if (response && response.data) {
			swal("Done!", response.message, "success");
			$state.reload();
		}
	}

	function failSubmitUser(res) {
		swal("Failed!", res.message, "error");
	}

	$scope.submitUser = function () {
		var oSend = angular.copy($scope.oUser);
		oSend.branch = $scope.oUser.branch;
		oSend.customer = $scope.oUser.aCustomer;
		oSend.department = oSend.department_data ? oSend.department_data.name : undefined;
		oSend.department_code = oSend.department_data ? oSend.department_data.code : undefined;
		oSend.department_id = oSend.department_data ? oSend.department_data._id : undefined;
		if ($scope.roleInputMode == 'View') {
			oSend.access = $scope.oUser.oRoleData._id;
		} else {
			delete oSend.access;
			delete oSend.oRoleData._id;
			oSend.accessBody = oSend.oRoleData;
		}

		if ($scope.user_mode == 'Add') {
			userService.addUser(oSend, succSubmitUser, failSubmitUser);
		} else {
			userService.updateUser(oSend._id, oSend, succSubmitUser, failSubmitUser);
		}
	};

	// (function() {
	// 	var branchFilter = {
	// 		all: true
	// 	}
	// 	branchService.getBranches(branchFilter, successBranches);
	// 	function successBranches(data) {
	// 		$scope.aBranches = data.data;
	// 	}
	// })();


	// try{
	// 	if($scope.$configs.master.showAccount){
	// 		// Get Account Masters
	// 		(function getAccountMasters(){
	//
	// 			var oFilter = {
	// 				all: true
	// 			}; // filter to send
	// 			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
	//
	// 			// Handle failure response
	// 			function onFailure(response) {
	//
	// 			}
	//
	// 			// Handle success response
	// 			function onSuccess(response){
	// 				response.data.data.unshift({
	// 					'name': "Add New Account",
	// 					'_id':  "addNewAccount"
	// 				});
	// 				$scope.aAccountMaster = response.data.data;
	// 			}
	// 		})();
	//
	// 		$scope.onSelectAccount = function () {
	// 			if($scope.oUser.account === "addNewAccount"){
	// 				$scope.oUser.account = null;
	// 				var modalInstance = $modal.open({
	// 					templateUrl: 'views/accounting/accountMasterUpsert.html',
	// 					controller: 'accountMasterUpsertController',
	// 					resolve: {
	// 						'selectedAccountMaster': function () {
	// 							return {
	// 								'accountType' : 'Cash in Hand',
	// 								'group': 'Vendor',
	// 								'name': $scope.oUser.name,
	// 								'isAdd': true
	// 							};
	// 						}
	// 					}
	// 				});
	//
	// 				modalInstance.result.then(function(response) {
	// 					if(response)
	// 						$scope.aAccountMaster.push(response);
	// 						$scope.oUser = response._id;
	//
	// 					console.log('close',response);
	// 				}, function(data) {
	// 					console.log('cancel');
	// 				});
	// 			}
	//
	// 		};
	// 	}
	// }catch(e){}
}

materialAdmin.controller('userInfoViewController', function (
	$modal,
	$scope,
	$state,
	$stateParams,
	userService
) {
	// object Identifiers
	$scope.userInfo = userInfo;
	if (typeof $stateParams.data !== 'undefined' && $stateParams.data !== null)
		$scope.aUser = angular.copy($stateParams.data); //initialize
	else
		$state.go('usermanage.users');


	// functions Identifiers


	// INIT functions
	(function init() {
		userInfo(true);
	})();

	function userInfo(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			userService.updatePassword(viewValue, res => $scope.oUser = res.data.data, err => console.log`${err}`);
		}
	}

	// Actual Functions


	//////////////////////////////////////////////////

});

