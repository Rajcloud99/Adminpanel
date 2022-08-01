materialAdmin
	.controller('billBookHomeController', billBookHomeController)
	.controller('billBookController', billBookController)
    .controller('billStationeryController', billStationeryController);

billBookHomeController.$inject = [
	'$state',
];
billBookController.$inject = [
	'$scope',
	'$state',
	'$uibModal',
	'billBookService',
	'branchService',
	'DatePicker',
	'growlService',
	'lazyLoadFactory',
	'stateDataRetain',
];
billStationeryController.$inject = [
	'$scope',
	'$uibModal',
	'billBookService',
	'branchService',
	'lazyLoadFactory',
	'stateDataRetain',
];

function billBookHomeController(
	$state,
) {

	$state.go('masters.billBook.book');
}


function billBookController(
	$scope,
	$state,
	$uibModal,
	billBookService,
	branchService,
	DatePicker,
	growlService,
	lazyLoadFactory,
	stateDataRetain,
) {

	let vm = this;

	vm.get = get;
	vm.missingStationary = missingStationary;
	vm.setAsDefault = setAsDefault;
	vm.submit = submit;
	vm.upsert = upsert;
	vm.stModify = stModify;
	vm.deleteBillBook = deleteBillBook;
	vm.getAllBranch = getAllBranch;
	vm.DatePicker = angular.copy(DatePicker);
	vm.dateChange =dateChange;
	vm.onStateRefresh = function (){
		vm.get();
	};

	(function init(){

		if(stateDataRetain.init($scope, vm))
			return;

		vm.oFilter = {};

		vm.billBookLazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: ['Name', 'Format', 'Min Count', 'Max Count', 'Type', 'Branch', 'Created By','Created At', 'Last Modified By', 'Last Modified Date','Auto', 'Centralize']
		};
		vm.tableHead = [
		 		{
				'header': 'Name',
				'bindingKeys': 'name',
			},
			{
				'header': 'Format',
				'bindingKeys': 'format',
				'date': false,
			},
			{
				'header': 'Min Count',
				'bindingKeys': 'min',
			},
			{
				'header': 'Max Count',
				'bindingKeys': 'max',
			},
			{
				'header': 'Type',
				'bindingKeys': 'type',
			},
			{
				'header': 'Branch',
				'bindingKeys': 'this.branch|arrayOfString:"name"',
				'eval': true
			},
			{
				'header': 'Created By',
				'bindingKeys': 'user',
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at',
			},
			{
				'header': 'Last Modified By',
				'bindingKeys': 'lastModifiedBy',
			},
			{
				'header': 'Last Modified Date',
				'bindingKeys': 'last_modified_at',
			},
			{
				'header' : 'Auto',
				'bindingKeys' : 'auto',
			},
			{
				'header' : 'Centralize',
				'bindingKeys' : 'centralize',
			}

		];

		// get();
	})();

	// Actual Function
	function get(isGetActive, download=false){

		if(!vm.billBookLazyLoad.update(isGetActive))
			return;

		if(download && !(vm.oFilter.start_date && vm.oFilter.end_date))
			return swal('warning',"Both From and To Date Should be Filled",'warning');

		var oFilter = prepareFilterObject(download);
		if (oFilter.download){
			billBookService.billBookReport(oFilter, onSuccess, onFailure);
		}else {
			billBookService.get(oFilter, onSuccess, onFailure);
		}


		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			if(download) {
				let a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			} else
				vm.billBookLazyLoad.putArrInScope.call(vm, isGetActive, response.data);
		}
	}


	function missingStationary(isGetActive, download=false){

				if(!vm.billBookLazyLoad.update(isGetActive))
					return;
			if(download && !(vm.oFilter.start_date && vm.oFilter.end_date))
				return swal('warning',"Both From and To Date Should be Filled",'warning');
			var oFilter = prepareFilterObject(download);
			billBookService.missingDocRpt(oFilter, onSuccess, onFailure);
				// Handle failure response
				function onFailure(response) {
				console.log(response);
				swal('Error!','Message not defined','error');
				}
			// Handle success response
			function onSuccess(response){
			if(download) {
			let a = document.createElement('a');
			a.href = response.url;
			a.download = response.url;
			a.target = '_blank';
			a.click();
			return;
			} else
				vm.billBookLazyLoad.putArrInScope.call(vm, isGetActive, response.data);
			}
		}
	function dateChange(){
		vm.oFilter.end_date = new Date(vm.oFilter.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

		var month = new Date(vm.oFilter.end_date).setMonth(vm.oFilter.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > vm.oFilter.start_date)
		vm.oFilter.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		vm.min_date = new Date(new Date(month).setHours(23,59,59));
	};



	function prepareFilterObject(download) {
		let prerFilter = {};

		if(vm.oFilter.name)
			prerFilter.name ={$regex:vm.oFilter.name, $options:'i'};

		if(vm.oFilter.type)
			prerFilter.type = vm.oFilter.type;

		if(vm.oFilter.branch && vm.oFilter.branch._id)
			prerFilter.branch = vm.oFilter.branch._id;

		if(vm.oFilter.start_date)
	 		prerFilter.fromDate = vm.oFilter.start_date;

		if(vm.oFilter.end_date)
			prerFilter.toDate = vm.oFilter.end_date;

		if(download)
			prerFilter.download = download;

		if(vm.oFilter.range)
			prerFilter.range = vm.oFilter.range;

		if(vm.oFilter.dateType)
		prerFilter.dateType = vm.oFilter.dateType;

		if(vm.oFilter.deleted === 'Yes')
			prerFilter.deleted = true;
		else
			prerFilter.deleted = {$ne: true};

		if(vm.oFilter.bookType === 'auto'){
			prerFilter.bookType = 'auto'
			// prerFilter.auto = true;
			// prerFilter.centralize = false;

		}else if(vm.oFilter.bookType === 'centralize'){
			// prerFilter.a = {$ne: true};
			// prerFilter.centralize = true;
			prerFilter.bookType = 'centralize'
		}


		prerFilter.skip = vm.billBookLazyLoad.getCurrentPage();
		prerFilter.no_of_docs = 20;
		return prerFilter;
	}

	function setAsDefault() {
		let request = {
			...vm.oBillBook,
			default: true
		};

		billBookService.update(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
		}

		function onSuccess(res) {
			vm.oBillBook = res.data.data;
		}
	}

	function submit(formData) {
		if(formData.$valid){
			get();
		}else{
			swal('Error','All Mandatory Fields are not filled','error');
		}
	}

	function deleteBillBook(data){
			swal({
					title: 'Are you sure to Delete this Book?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: "#F44336",
					confirmButtonText: "Delete",
					closeOnConfirm: true
				},
				function (isConfirmU) {
					if (isConfirmU) {
						req = {
							_id: vm.oBillBook._id,
						};
						if(data === 'softDelete'){
							billBookService.softDeleteBillBook(req, success ,failure);
						}else{
							billBookService.deleteBillBook(req, success ,failure);
						}
					}
				});
		function success(response) {
			if (response.message) {
				//growlService.growl(response.message, "success");
				swal('Success', response.message, 'success');
				$state.go('masters.billBook.book', {}, {reload: true});

			}
		}

		function failure(response) {
			if (response.message) {
				growlService.growl(response.message, "danger");
			}
		}

	}


	// Modify Bill Book Harikesh - 20/11/2019
	function stModify(type) {

		$uibModal.open({
			templateUrl: 'views/billBook/modifyBillBook.html',
			controller: ['$uibModalInstance', 'billBookService', 'branchService', 'DatePicker', 'modelDetail', 'oBillBook', billBookUpsertController],
			controllerAs: 'upsertVm',
			resolve: {
				oBillBook: function () {
					return vm.oBillBook;
				},
				modelDetail: function () {
					return {
						name: 'Stationary Book',
						type
					};
				}
			}
		}).result.then(function (res) {
			get();
		}, function (err) {
			console.log(err);
		});

	}

	//End

	function upsert(type='add') {
		$uibModal.open({
			templateUrl: 'views/billBook/upsertBillBook.html',
			controller: ['$uibModalInstance', 'billBookService', 'branchService', 'DatePicker', 'modelDetail', 'oBillBook', billBookUpsertController],
			controllerAs: 'upsertVm',
			resolve: {
				oBillBook: function () {
					return vm.oBillBook;
				},
				modelDetail: function () {
					return {
						name: 'Stationary Book',
						type
					};
				}
			}
		}).result.then(function (res) {
			get();
		}, function (err) {
			console.log(err);
		});
	}

	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 8,
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
}

function billBookUpsertController(
	$uibModalInstance,
	billBookService,
	branchService,
	DatePicker,
	modelDetail,
	oBillBook,
) {
	let vm = this;

	vm.closePopup = close;
	vm.submit = submit;
	vm.modifyStationary = modifyStationary;
	vm.getAllBranch = getAllBranch;
	vm.getBillBook = getBillBook;
	vm.onChangeFy=onChangeFy;
	vm.changeStationaryType = changeStationaryType;

	(function init() {
		vm.singleBillBook = [{}];
		vm.oBillBook = {};
		fromYear=new Date().getMonth()<3 ? new Date().getFullYear()-1 : new Date().getFullYear();
		toYear=(new Date().getMonth()<3 ? new Date().getFullYear() :new Date().getFullYear()+1);
		vm.fy=fromYear+'-'+toYear.toString().slice(-2);
		onChangeFy(vm.fy);
		vm.fyList=[];
		for (let i = toYear-2; i <= toYear; i++){
			const ft=i-1+'-'+i.toString().slice(-2);
			vm.fyList.push(ft);
			delete ft;
		}

		vm.DatePicker = angular.copy(DatePicker); // initialize pagination
		vm.selectSettings = {
			displayProp: "name",
			enableSearch: true,
			searchField: 'name',
			smartButtonMaxItems: 1,
			showCheckAll: false,
			showUncheckAll: false,
			smartButtonTextConverter: function (itemText, originalItem) {
				return itemText;
			}
		};

		vm.modelName = modelDetail.name || 'Stationary Book';
		vm.modelType = modelDetail.type || 'add';
		vm.editMode = false;
		vm.aBranch = [];
		vm.branchMod = [];
		// vm.oBillBook = {};

		if(vm.modelType === 'edit'){
			vm.editMode = true;
			vm.oBillBook = angular.copy(oBillBook);

			vm.oBillBook.endDate = vm.oBillBook.endDate && new Date(vm.oBillBook.endDate);
			vm.oBillBook.startDate = vm.oBillBook.startDate && new Date(vm.oBillBook.startDate);
			if(vm.oBillBook.branch.length)
				vm.branchMod.push(...vm.oBillBook.branch.map(o => ({ _id: o.ref, name: o.name})));
		}

	})();

	function close() {
		$uibModalInstance.dismiss();
	}

	function onChangeFy(fy){
		console.log(fy);
		const strYear = String(fy).slice(0, 4);
		const fromYear = Number(strYear);
		const toYear=fromYear+1;
		vm.oBillBook.minDate=new Date(fromYear,3, 1);
		vm.oBillBook.maxDate=new Date(toYear, 2, 31);
		vm.oBillBook.startDate=vm.oBillBook.minDate;
		vm.oBillBook.endDate=vm.oBillBook.maxDate;
	}

	function changeStationaryType(chnval)
	{
		alert('in....'+StationaryType.name);
		alert(chnval.name);
	}


	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let request = {
					name :viewValue,
				};

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

	vm.onBranchSelect = function(item){
		if(vm.branchMod.length)
			return 	swal('warning', "Only single Branch Allowed",'warning');

		vm.branchMod.push(item);
	}
	//
	// function getAllBranch(inputModel) {
	// 	let req = {
	// 		no_of_docs: 8,
	// 	};
	//
	// 	if (inputModel)
	// 		req.name = inputModel;
	//
	// 	branchService.getAllBranches(req, success);
	//
	// 	function success(data) {
	// 		vm.aBranch = data.data;
	//
	// 		vm.branchMod.forEach( oBranch => {
	// 			if(!vm.aBranch.find(o => o._id === oBranch._id))
	// 				vm.aBranch.unshift(oBranch);
	// 		});
	// 	}
	// }

	// added by harikesh - dated: 20/11/2019
	function getBillBook(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let request = {
					name :{$regex:viewValue, $options:'i'},
					auto: false
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
	}

	// Harikesh... modify Submit

	function modifyStationary(formData)
	{

		//vm.oBillBook.StationaryType
		if(formData.$valid){

			if(!vm.oBillBook.BillBook){
				swal('Error','Billbook Name should be required.','error');
				return;
			}

			let requestJson = {};
			if(vm.oBillBook && vm.oBillBook.StationaryType)
			{
				if(vm.oBillBook.StationaryType=='Range')
				{
					if(!vm.oBillBook.min && !vm.oBillBook.max){
						swal('Error','Min and Max should be required','error');
						return;
					}
					else{
						if(vm.oBillBook.min >= vm.oBillBook.max){
							swal('Error','Min Should be Smaller Than Max','error');
							return;
						}
					}
					// Make the json...
					requestJson  = {
						"name": vm.oBillBook.BillBook.name,
						"clientId": vm.oBillBook.BillBook.clientId,
						"billBookId": vm.oBillBook.BillBook._id,
						"range": [
							{
							"min": vm.oBillBook.min,
							"max": vm.oBillBook.max
							},
						]
					}
				}
				else{

					if(!vm.singleBillBook && vm.singleBillBook.length==0)
					{
						swal('Error','Please enter atleast one stationary no.','error');
						return;
					}

					let missingSta = [];
					for(i=0; i<vm.singleBillBook.length; i++)
					{
						missingSta[i] = vm.singleBillBook[i].StationryNo;
					}

					requestJson  = {
						"name": vm.oBillBook.BillBook.name,
						"clientId": vm.oBillBook.BillBook.clientId,
						"billBookId": vm.oBillBook.BillBook._id,
						"missingSta": missingSta
					};

				}

			}

			let request = requestJson;


			billBookService.modifyBookStationary(request, onSuccess, onFailure);


			function onFailure(err) {
				swal('Error', err.message, 'error');
			}

			function onSuccess(res) {
				swal('Success', res.message, 'success');
				$uibModalInstance.close(res.data);
			}

		}else
			swal('Error','All Mandatory Field Should be Filled','error');
	}

	// end

	function submit(formData) {

		if(formData.$valid){
			// check that user not will enter either "["  or this "]"

			let allowedTime = ['1', 'year'];
			if(moment(vm.oBillBook.endDate).isAfter(moment(vm.oBillBook.startDate).add(...allowedTime)))
			return swal('Error', `Max Allowed Time for stationary book is ${allowedTime[0]} ${allowedTime[1]}`, 'error');

			if(!(vm.oBillBook.format.includes('{') && vm.oBillBook.format.includes('}'))) {
				return swal('Error','Only { and } brackes are allowed','error');
			}
			if(vm.oBillBook.min >= vm.oBillBook.max){
				swal('Error','Min Should be Smaller Than Max','error');
				return;
			}

			if(vm.oBillBook.centralize){
				vm.oBillBook.auto = true;
				vm.branchMod = [];
			}

			let request = {
				...vm.oBillBook,
				branch: vm.branchMod.map(o => ({ref: o._id, name: o.name}))
			};
			if(vm.modelType === 'edit'){
				billBookService.update(request, onSuccess, onFailure);
			}else{
				billBookService.add(request, onSuccess, onFailure);
			}

			function onFailure(err) {
				swal('Error', err.message, 'error');
			}

			function onSuccess(res) {
				swal('Success', res.message, 'success');
				$uibModalInstance.close(res.data);
			}

		}else
			swal('Error','All Mandatory Field Should be Filled','error');

	}
}


function billStationeryController(
	$scope,
	$uibModal,
	billBookService,
	branchService,
	lazyLoadFactory,
	stateDataRetain,
) {

	let vm = this;

	vm.get = get;
	vm.downloadStockbook = downloadStockbook;
	vm.getBillBook = getBillBook;
	vm.submit = submit;
	vm.updateStationary = updateStationary;
	vm.freeStationary = freeStationary;
	vm.deleteStationary = deleteStationary;
	vm.getAllBranch = getAllBranch;

	vm.onStateRefresh = function (){
		vm.get();
	};

	(function init(){

		if(stateDataRetain.init($scope, vm))
			return;

		vm.oFilter = {};
		vm.billStationeryLazyLoad = lazyLoadFactory();
		vm.columnSetting = {
			allowedColumn: ['Stationery No', 'type', 'status','Enable/Disable','Book Name', 'Min', 'Max', 'Branch', 'created at', 'last modified','Stationery Remark']
		};
		vm.tableHead = [
			{
				'header': 'Stationery No',
				'bindingKeys': 'bookNo',
				'date': false
			},
			{
				'header': 'type',
				'bindingKeys': 'type',
			},
			{
				'header': 'status',
				'bindingKeys': 'status',
			},
			{
				'header': 'Enable/Disable',
				'bindingKeys': 'disable === true ? "Disabled": "Enabled"',
			},
			{
				'header': 'Book Name',
				'bindingKeys': 'billBookId.name',
			},
			{
				'header': 'Stationary BookId',
				'bindingKeys': 'billBookId',
			},
			{
				'header': 'created at',
				'bindingKeys': 'created_at',
				'date': true
			},
			{
				'header': 'last modified',
				'bindingKeys': 'last_modified_at',
				'date': true
			},
			{
				'header': 'Stationery Remark',
				'bindingKeys': 'commonHistory[0].remark',
			}
		];

		// get();
	})();


	function getAllBranch(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {
					name: viewValue,
					no_of_docs: 8,
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
	// Actual Function
	function get(isGetActive, download= false){

		if(!( vm.oFilter.type)){ //&& vm.oFilter.BillBook
			swal('Error','BillBook Type required','error');
				return;
		}


		if(!vm.billStationeryLazyLoad.update(isGetActive))
			return;

		var oFilter = prepareFilterObject(download);
		if($scope.$configs.master.stationaryRpt)
			oFilter.stationaryRpt = true;
		billBookService.getStationeryV2(oFilter, onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			if(download) {
				let a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}else {
				vm.billStationeryLazyLoad.putArrInScope.call(vm, isGetActive, response);
			}

		}
	}

	function downloadStockbook() {
		var oFilter = prepareFilterObject(download=true);
		oFilter.deleted = {"$ne": true};
		billBookService.fullyUnusedReport(oFilter,onSuccess, onFailure);

		// Handle failure response
		function onFailure(response) {
			console.log(response);
			swal('Error!','Message not defined','error');
		}

		// Handle success response
		function onSuccess(response){
			if(download) {
				let a = document.createElement('a');
				a.href = response.url;
				a.download = response.url;
				a.target = '_blank';
				a.click();
				return;
			}
		}
	}
	// Free Stationry - Added By Harikesh - 22/11/2019
	function freeStationary() {
		function success(res) {
			console.log(res);
			swal(res.message);
			$uibModalInstance.close(res);

		}

		function failure(res) {
			swal(res.message);
			$uibModalInstance.dismiss(res);

		}

		if(!(vm.oBillBook._id) && vm.oBillBook){
			swal('Error','Please Search and Select Stationary','error');
				return;
		}

		swal({
			title: 'Are you sure to FREE this Stationary?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#2196f3",
			confirmButtonText: "Free",
			closeOnConfirm: true
		},
		function (isConfirmU) {
			if (isConfirmU) {
				let request = {
					_id: vm.oBillBook._id,
					currentStatus: vm.oBillBook.status,
				};
				billBookService.freeStationaryReq(request, success, failure);
			}
		});
	}
	// END

	// Delete Stationry - Added By Harikesh - 22/11/2019
	function deleteStationary() {
		function success(res) {
			console.log(res);
			swal(res.message);
			$uibModalInstance.close(res);

		}

		function failure(res) {
			swal(res.message);
			$uibModalInstance.dismiss(res);

		}

		if(!(vm.oBillBook._id)){
			swal('Error','Please Search and Select Stationary','error');
				return;
		}

		swal({
			title: 'Are you sure to DELETE this Stationary?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		},
		function (isConfirmU) {
			if (isConfirmU) {

				let request = {
					_id: vm.oBillBook._id,
					currentStatus: vm.oBillBook.status,
				};

				billBookService.deleteStationaryReq(request, success, failure);
			}
		});



	}
	// END


	function getBillBook(viewValue, deletedKey) {
		if (viewValue && viewValue.toString().length > 1) {

			return new Promise(function (resolve, reject) {

				let request = {
					name :{$regex:viewValue, $options:'i'}
				};
				if(deletedKey)
					request.deletedKey = 'all'

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
	}

	function prepareFilterObject(download) {
		let prerFilter = {
			cClientId: $scope.selectedClient
		};

		if(vm.oFilter.bookNo)
			prerFilter.bookNo = vm.oFilter.bookNo;

		if(vm.oFilter.BillBook)
			prerFilter.billBookId = vm.oFilter.BillBook._id;

		if(vm.oFilter.type)
			prerFilter.type = vm.oFilter.type;

		if(vm.oFilter.status && vm.oFilter.status === 'disable')
			prerFilter['disable'] = {$eq: true};
		else if(vm.oFilter.status)
			prerFilter.status = vm.oFilter.status;

		if(vm.oFilter.branch && vm.oFilter.branch._id)
			prerFilter.branch = vm.oFilter.branch._id;

		if(vm.oFilter.range)
			prerFilter.range = vm.oFilter.range;

		if(download)
			prerFilter.download = download;

		prerFilter.skip = vm.billStationeryLazyLoad.getCurrentPage();
		prerFilter.no_of_docs = 20;

		return prerFilter;
	}

	function submit(formData) {
		if(formData.$valid){
			get();
		}else{
			swal('Error','All Mandatory Fields are not filled','error');
		}
	}

	function updateStationary(type) {

		if(!(vm.oBillBook && vm.oBillBook._id))
			return swal('Error', 'No Book Selected', 'error');
		vm.oBillBook.type = type;

		var modalInstance = $uibModal.open({
			templateUrl: 'views/billBook/stationeryRemark.html',
			controller: 'stationeryRemarkCtrl',
			controllerAs: 'vm',
			resolve: {
				data:function () {
					return vm.oBillBook;
				}
			}
		});

		modalInstance.result.then(function (data) {
			console.log(data);
		}, function (data) {

		});
	}

	// function updateStationarymmmmm(type) {
    //
	// 	if(!(vm.oBillBook && vm.oBillBook._id))
	// 		return swal('Error', 'No Book Selected', 'error');
    //
	// 	let request = {
	// 		_id: vm.oBillBook._id
	// 	};
    //
	// 	billBookService[type](request, onSuccess);
    //
	// 	function onSuccess(res) {
	// 		swal('Success', res.message, 'success');
	// 	}
	// }
}

materialAdmin.controller('stationeryRemarkCtrl', function (
	$uibModalInstance,
	billBookService,
	data) {

	let vm = this;

	vm.oBillBook = angular.copy(data);
	vm.type =  vm.oBillBook.type;
	vm.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};


	vm.updateInfo = function () {
		function success(res) {
			console.log(res);
			swal(res.message);
			$uibModalInstance.close(res);

		}

		function failure(res) {
			swal(res.message);
			$uibModalInstance.dismiss(res);

		}

		let request = {
			_id: vm.oBillBook._id,
			remark: vm.rmk,
		};
		billBookService[vm.type](request, success, failure);
		}


});

