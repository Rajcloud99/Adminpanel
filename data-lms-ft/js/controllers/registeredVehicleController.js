materialAdmin
	.controller("RegisteredVehicleController", RegisteredVehicleController)
	.controller("RegisteredVehicleDetailController", RegisteredVehicleDetailController)
	.controller("RegisteredVehicleUpsertController", RegisteredVehicleUpsertController);

RegisteredVehicleController.$inject = [
	'$scope',
	'$state',
	'$timeout',
	'$uibModal',
	'Driver',
	'DatePicker',
	'FleetService',
	'Vehicle',
	'Vendor',
	'Pagination',
	'ReportService',
	'objToCsv',
	'utils',
	'growlService',
	'URL',
	'dmsService'
];
RegisteredVehicleDetailController.$inject = [
	'$state',
	'$scope',
	'$uibModal',
	'$stateParams'
];
RegisteredVehicleUpsertController.$inject = [
	'$scope',
	'$state',
	'$uibModal',
	'$stateParams',
	'accountingService',
	'DatePicker',
	'Driver',
	'FleetService',
	'modelService',
	'structureMasterService',
	'Vehicle',
	'Vendor'
];

function addRatePopupCtrl(
	$scope,
	$uibModalInstance,
	oVehicle,
	Vehicle
) {
	$scope.closeModal = closeModal;
	$scope.getRateHis = getRateHis;
	$scope.submit = submit;

	//init
	(function init() {
		$scope.oVehicle = angular.copy(oVehicle);
		$scope.budget = {};
		$scope.oVehicle.budgetV2 = [];
		$scope.mode = $scope.oVehicle.mode;
		let serviceTyp= $scope.$configs.master.aServiceType ||['Normal', 'Express', 'Empty'];
		if($scope.mode === 'View'){
			getRateHis();
		}else if($scope.oVehicle.current_budget){
			for (let [key, value] of Object.entries($scope.oVehicle.current_budget)){
				if(serviceTyp.indexOf(key) === -1){
					// $scope.oVehicle.budgetV2.push({[key]: value});
				}else {
					$scope.oVehicle.budgetV2.push({...value, serviceTyp: key});
				}
			}
		}
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss($scope.oVehicle);
	}

	// to get rate history
	function getRateHis() {
		Vehicle.getAllRates({
			_id: $scope.oVehicle._id,
		}, success, failure);

		function success(response){
			$scope.oVehicle.budgetV2 = response.data.data;
		}

		function failure(response){

		}
	}

	function submit(formData) {
		if(formData.$valid){

			const oReq = angular.copy($scope.budget);
			oReq._id = $scope.oVehicle._id;

			Vehicle.vehAddRates(oReq, successCallback, failureCallback);

			function successCallback(res) {
				$scope.budget = {};
				$scope.oVehicle = res.data.data;
				swal('',res.data.message,'success');
				$uibModalInstance.dismiss($scope.oVehicle);
				$scope.detentionSetDateRangeForm.$submitted = false;
			}

			function failureCallback(res) {
				swal('',res.data.message,'success');
			}

		}else{
			swal('','All Mandatory Field arr not Filled','error');
		}
	}


}

function RegisteredVehicleController(
	$scope,
	$state,
	$timeout,
	$uibModal,
	Driver,
	DatePicker,
	FleetService,
	Vehicle,
	Vendor,
	Pagination,
	ReportService,
    objToCsv,
	utils,
	growlService,
	URL,
	dmsService
) {

	$scope.filterObj = {};
	$scope.DatePicker = angular.copy(DatePicker);

	//function identifier
	$scope.addFasttagAccount = addFasttagAccount;
	$scope.addRates = addRates;
	$scope.associateSegment = associateSegment;
	$scope.updateStatus = updateStatus;
	$scope.fleetSegment = fleetSegment;
	$scope.soldVehicle = soldVehicle;
	$scope.downloadCompositeReport=downloadCompositeReport;
	$scope.downloadExcelReport = downloadExcelReport;
	$scope.downloadCsv = downloadCsv;
	$scope.downloadCsvVehRate = downloadCsvVehRate;
	$scope.dateChange = dateChange;
	$scope.getVehicle = getVehicle;
	$scope.getVehiclesList = getVehiclesList;
	$scope.getAllDriver = getAllDriver;
	$scope.getAllVendors = getAllVendors;
	$scope.liveTrack = liveTrack;
	$scope.show = show;
	$scope.getAllFleet = getAllFleet;
	$scope.upsert = upsert;
	$scope.uploadDocs = uploadDocs;
	$scope.uploadRates =  uploadHandler;
	$scope.previewDocs = previewDocs;
	$scope.selectThisRow = selectThisRow;
	$scope.edit = edit;
	$scope.uploadReport = uploadReport;
	$scope.vehicleDelete = vehicleDelete;
	$scope.vehicleStatus = vehicleStatus;
	$scope.pagination = angular.copy(Pagination); // initialize pagination
	$scope.pagination.currentPage = 1;
	$scope.pagination.maxSize = 3;
	$scope.pagination.items_per_page = 11;

		//init
	(function init() {

		$scope.selectSettings = {
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

		$scope.searchOwnership = ['Own', 'Associate', 'Market'];
		$scope.status = ['Enable', 'Disable'];

		$scope.oVehicle = {};
		$scope.filterObj.driver = {};
		$scope.filterObj.vendor = {};

		getVehiclesList(true);
		getAllDriver();
		getAllVendors();
		getAllFleet();
	})();

	//Actual Function

	function downloadCsv() {
		objToCsv(null,
			[
				'Vehicle No',
				'IMEI',
				'OwnershipType',
				'Segment',
				'Model',
				'Model Year',
				'Category',
				'Cost Center',
				"Manufacturer",
				'Structure',
				"Fleet",
				"Status",
				"Vehicle Group",
				"Vehicle Type",
				"Capacity(Ton)",
				"Permit Expiry Date",
				"Owner Name",
				"Owner Mob",
				"Vendor Name",
				"Chasis No.",
				"Engine No.",
				"Insurance Company",
				"Insurance No.",
				"Insurance Amount",
				"Insurance Expiry Date",
				"Registration Date"
			],
			[]
		);
	}

	function downloadCsvVehRate() {
		objToCsv(null,
			[
				'vId',
				'Vehicle No',
				'Normal Rate',
				'Normal Mileage',
				'Normal Advance',
				'Express Rate',
				'Express Mileage',
				"Express Advance",
				"Empty Rate",
				'Empty Mileage',
				"Empty Advance",
			],
			[]
		);
	}

	 function uploadReport(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			Driver.uploadCommon({modelName: 'RegisteredVehicle'}, data)
				.then(function (d) {
					swal({title:'Info', text:d.message, type:"info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message,'error');
				});
		}
	};

	function uploadDocs() {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve:{
				oUploadData:{
					modelName: 'regVehicle',
					scopeModel : $scope.oVehicle,
					scopeModelId:$scope.oVehicle._id,
					uploadText: "Upload Vehicle Documents",
					uploadFunction: Vehicle.uploadDocs
				}
			}
		});
		modalInstance.result.then(function(data) {
			$state.reload();
		}, function(data) {
			$state.reload();
		});
	}

	function uploadHandler(files, file, newFiles, duplicateFiles, invalidFiles, event) {

		if (file && event.type === "change") {
			var fd = new FormData();
			fd.append('vehicleRate', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			Vehicle.uploadRates({}, data)
				.then(function (d) {
					if (d.data && d.data.length > 0) {
						const header = ['vId', 'VEHICLE NO', 'STATUS', 'REJECTION REASON'];
						const body = d.data.map(o => header.map(s => s && o[s] && (Array.isArray(o[s]) ? o[s].join(', ') : o[s]) || ''));
						objToCsv('VehRatesLog', header, body);
					}
					swal({title: 'Info', text: d.message, type: "info"});
				}).catch(function (err) {
				swal(err.data.message, err.data.error, 'error');
			});
		}
	}

	// function previewDocs() {
	// 	if(!Array.isArray($scope.oVehicle.documents) || $scope.oVehicle.documents.length < 1) {
	// 		growlService.growl("No documents to preview", "warning");
	// 		return;
	// 	}
	// 	var documents = $scope.oVehicle.documents.map(curr => ({
	// 		...curr,
	// 		url: `${URL.BASE_URL}documents/view/${curr.docReference}`
	// 	}));
	// 	var modalInstance = $uibModal.open({
	// 		templateUrl: 'views/carouselPopup.html',
	// 		controller: 'carouselCtrl',
	// 		resolve: {
	// 			documents: function () {
	// 				return documents;
	// 			}
	// 		}
	// 	});
	// }

	function previewDocs() {
		if(!($scope.oVehicle && $scope.oVehicle._id))
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: $scope.oVehicle._id,
				modelName: "regVehicle"
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
							_id: $scope.oVehicle._id,
							modelName: 'regVehicle',
							url: `${URL.file_server}${doc.name}`
						});
					});
				}else{
					let name = `${key|| 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName:doc.name,
						_id: $scope.oVehicle._id,
						modelName: 'regVehicle',
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

	function addFasttagAccount(){
		$uibModal.open({
			templateUrl: 'views/accounting/attachAccountPopup.html',
			controller: ['$modal', '$scope', '$uibModalInstance', 'accountingService', 'oData', attachAccountPopupCtrl],
			resolve: {
				oData: function() {
					return {
						title: 'Attach Fasttag Account',
						group: ['FastTag'],
						history: $scope.oVehicle.fasttagHistory || [],
						accountFilter: function(aAccount = []){
							return aAccount.filter( o => {
								return !$scope.oVehicle.fasttagHistory.find(oh => {
									let id = typeof oh.tagAccount === 'object' ? oh.tagAccount._id : oh.tagAccount;
									return id === o._id;
								});
							});
						},
						callback: apiCallback
					};
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

	function addRates(mode) {
		$scope.oVehicle.mode = mode || 'Add';
		$uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/addRatePopup.html',
			controller: ['$scope', '$uibModalInstance', 'oVehicle', 'Vehicle', addRatePopupCtrl],
			backdrop: false,
			resolve: {
				oVehicle: function() {
					return $scope.oVehicle;
				}
			}
		}).result.then(function(data) {
			//$state.reload();
		}, function(data) {
			$scope.oVehicle = typeof data === 'object' ? data : $scope.oVehicle;
		});
	}

	function associateSegment() {
		$uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/associateSegmentPopup.html',
			controller: ['$scope', '$uibModalInstance', 'oVehicle', 'Vehicle', associateSegmentPopupCtrl],
			controllerAs: 'associateSegmentVm',
			resolve: {
				oVehicle: function() {
					return $scope.oVehicle;
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

	function updateStatus() {
		$uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/updateStatusPopup.html',
			controller: ['$scope', '$uibModalInstance', 'oVehicle', 'Vehicle', updateStatusPopupCtrl],
			controllerAs: 'usVm',
			resolve: {
				oVehicle: function() {
					return $scope.oVehicle;
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

	// Fleet Segment - Harikesh - dated: 11/08/2019
	function fleetSegment() {
		$uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/fleetSegmentPopup.html',
			controller: ['$scope', '$uibModalInstance', 'oVehicle', 'Vehicle', 'FleetService', fleetSegmentPopupCtrl],
			controllerAs: 'fleetSegmentVm',
			resolve: {
				oVehicle: function() {
					return $scope.oVehicle;
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

	//END

	// sold vehicle
	function soldVehicle() {
		$uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/soldVehicle.html',
			controller: ['$scope','$uibModalInstance','oVehicle','Vehicle', soldVehicleCtrl],
			controllerAs: 'soldVehicleVm',
			size:'lg',
			resolve: {
				oVehicle: function() {
					return $scope.oVehicle;
				}
			}
		}).result.then(function(data) {
			//success
		}, function (data) {
			// error
		});
	}

	//end

	function apiCallback(acccountId) {
		Vehicle.vehicleFasttagAttach({
			_id: $scope.oVehicle._id,
			fasttag: acccountId
		}, success, failure);

		function success(response){
			swal('Message', response.message, 'success');
		}

		function failure(response){
			swal('Message', response.message, 'failure');
		}
	}
	function  dateChange() {
		$scope.filterObj.end_date = new Date($scope.filterObj.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.filterObj.end_date).setMonth($scope.filterObj.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > $scope.filterObj.start_date)
		$scope.filterObj.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23,59,59));
	};

	function downloadExcelReport() {
		var oFilter = prepareFilterObject(false, true);
		 	oFilter.download = true;
		ReportService.getVehicleReport(oFilter, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.data.message, 'error');
		}

		function successCallback(response) {
			if(response.data && response.data.url){
			const a = document.createElement('a');
			a.href = response.data.url;
			a.target = '_blank';
			a.click();
			}else{
				swal('', response.data.message, 'error');
			}
		}
	}

	function downloadCompositeReport() {
		var oFilter = prepareFilterObject(false, true);
			 oFilter.download = true;
			 oFilter.all = true;
			 oFilter.reportType = "compostionMatrixExcel";
			 oFilter.isCancelled = false;
			 Vehicle.VehCompositeReport(oFilter, successCallback, failureCallback);

		function failureCallback(response) {
			swal('', response.data.message, 'error');
		}

		function successCallback(response) {
			const a = document.createElement('a');
			a.href = response.data.url;
			a.target = '_blank';
			a.click();
		}
	}

	function selectThisRow(vehicle, i) {
		$scope.index = i;
		$scope.oVehicle = vehicle;
		$scope.$broadcast("SelectRow", vehicle);
	}

	function getAllDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Driver.getAllDriversForList({name:viewValue}, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}


	function getAllVendors (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Vendor.vendorTrim({name: viewValue,deleted: false}, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}

	function getVehicle(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			let oFilter = prepareFilterObject(false);
			oFilter.vehicle_no = viewValue;

			Vehicle.getAllVehicles(oFilter, success, fail);

			function success(res) {
				if (res.data) {
					$scope.aRegisteredVehicles = res.data;
				}
			}

			function fail(res) {
				// console.log(res);
			}
		}
	}

	$scope.onSelect = function($item, $model, $label) {
 		// $scope.oSearchRegisteredVehicle.vehicleName = $item.vehicle_reg_no;
 		// $scope.getVehiclesList();
		// $scope.$broadcast("SelectRow", $item);
		$scope.selectThisRow($item, 0);
 	};

	$scope.clearSearch = function() {
 		delete $scope.vehicleName;
 		$scope.getVehiclesList();
 	};




	$scope.setVehicleMode = function(mode) {
 		$scope.registered_vehicle_mode = mode;
 	};
 	$scope.setVehicleMode("View");

	// $scope.selectVehicle = function() {
	// 	$scope.setVehicleMode("View");
 	// 	if ($scope.oVehicle) {
 	// 		setViewOrEditData($scope.oVehicle);
 	// 		removeSelectedCSSclass();
 	// 	}
 	// };
 	// $scope.selectVehicle();

	function removeSelectedCSSclass() {
 		listItem = $($('.lv-item'));
 		listItem.siblings().removeClass('list_border_background');
 	}

	function getVehiclesList(isPagination) {

		// if(!isGetActive)
		// 	$scope.lazyLoad.reset();

		let oFilter = prepareFilterObject(isPagination);

		Vehicle.getVehiclesWithPagination(oFilter, function(res) {
			if (res && res.data) {
				$scope.aRegisteredVehicles = res.data;
				$scope.aRegisteredVehicles.forEach((vehicle) => {
					let today = new Date();
					today = moment(today);
					let diff1,diff2,diff3,diff4,diff5;
					if(vehicle.puc_expiry_date)
					diff1 = moment(vehicle.puc_expiry_date).diff(today,'days');
					else diff1 = 31;
					if(vehicle.permit_expiry_date)
					diff2 = moment(vehicle.permit_expiry_date).diff(today,'days');
					else diff2 = 31;
					if(vehicle.insurance_expiry_date)
					diff3 = moment(vehicle.insurance_expiry_date).diff(today,'days');
					else diff3 = 31;
					if(vehicle.fitness_cert_expiry_date)
					diff4 = moment(vehicle.fitness_cert_expiry_date).diff(today,'days');
					else diff4 = 31;
					if(vehicle.road_tax_doc_expiry_date)
					diff5 = moment(vehicle.road_tax_doc_expiry_date).diff(today,'days');
					else diff5 = 31;
					if(diff1 <= 0 || diff2 <= 0 || diff3 <= 0 || diff4 <= 0 || diff5 <= 0)
					{
						vehicle.myStyle = {'background-color': '#F08080'};
					} else if(diff1 < 30 || diff2 < 30 || diff3 < 30 || diff4 < 30 || diff5 < 30) {
						vehicle.myStyle = {'background-color': '#FFA07A'}
					}
				});
				$scope.pagination.total_pages = res.count/$scope.pagination.items_per_page;
				$scope.pagination.totalItems = res.count;

				// $scope.index = 0;
				// $scope.oVehicle = $scope.aRegisteredVehicles[$scope.index];
				// $scope.$broadcast("SelectRow", $scope.aRegisteredVehicles[$scope.index]);
				$scope.selectThisRow($scope.aRegisteredVehicles[0], 0);


				// $scope.lazyLoad.incCurrentPage();
			}
		});
	}

	// Redirect to livetrack page
	function liveTrack() {
		$state.go('masters.liveTrackPage');
	}

	function edit() {
		$state.go("masters.registeredVehicleUpsert", { data: {
				mode: 'Edit',
				oVehicle: $scope.oVehicle
			}});
	}

	function vehicleStatus(type){

		swal({
				title: `Are you sure you want to ${type} this vehicle? `,
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
						_id:$scope.oVehicle._id
					};
					if(type === 'Enable')
						oRequest.deleted = false;
					else if(type === 'Disable')
						oRequest.deleted = true;

					Vehicle.deleteStatus(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Vehicle updated!!', 'success');
						getVehiclesList();
					}
				}
			});
		return;
	}

	function vehicleDelete(){

			swal({
					title: 'Are you sure you want to delete this vehicle?',
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
							...$scope.oVehicle
						};
						oRequest.deleted = true;
						Vehicle.updateVehicle(oRequest, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							swal('Success', 'Vehicle deleted!!', 'success');
							getVehiclesList();
						}
					}
				});
			return;
		}

	function prepareFilterObject(isPagination,download) {
		let myFilter = {};

		if(download){
			myFilter.ownershipType  = 'Own';
		}

		if ($scope.vehicleName) {
			myFilter.vehicle_reg_no = $scope.vehicleName;
			delete myFilter.ownershipType;
		}




		if ($scope.filterObj.ownershipType && $scope.filterObj.ownershipType !== 'All') {
			myFilter.ownershipType = $scope.filterObj.ownershipType;
		}





		if ($scope.filterObj.vendorName)  {
			myFilter.vendor_id= $scope.filterObj.vendorName._id;

		}

		if ($scope.filterObj.driverName)  {
			myFilter.driver= $scope.filterObj.driverName._id;
		}

		if ($scope.filterObj.vehicleId) {
			myFilter.vehicle_no = $scope.filterObj.vehicleId;
		}

		if ($scope.filterObj.owner_group) {
			myFilter.owner_group = $scope.filterObj.owner_group;
		}




		if ($scope.filterObj.from) {
			myFilter.from = moment($scope.filterObj.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if ($scope.filterObj.to) {
			myFilter.to = moment($scope.filterObj.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}

		if ($scope.filterObj.status) {
			// if($scope.filterObj.status === 'Enable')
			// myFilter.deleted = false;
			 if($scope.filterObj.status === 'Disable')
				myFilter.deleted = true;
		}
		// else {
			// myFilter.deleted = false;
		// }


		myFilter.skip = $scope.pagination.currentPage;
		myFilter.no_of_docs = $scope.pagination.items_per_page;


		// myFilter.skip = $scope.lazyLoad.getCurrentPage();
		// myFilter.no_of_docs = 20;
		// myFilter.sort = $scope.orderBy;

		return myFilter;
	}

	function getAllFleet() {
		FleetService.getFleetWithPagination({ all: true }, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			$scope.aOwners = response.data;
		}
	}

	function show(){
		$state.go("masters.registeredVehicleDetail", { data: $scope.oVehicle});
	}

	function upsert(mode) {
		$state.go("masters.registeredVehicleUpsert", { data: {
			mode: mode,
			oVehicle: $scope.oVehicle
		}});
	}

	//////////////////////////////////////////////////////////////////////////////////////
}

function RegisteredVehicleDetailController(
	$state,
	$scope,
	$uibModal,
	$stateParams
) {

	let vm = this;

	//function identifier
	vm.addSalary = addSalary;
	vm.selectThis = selectThis;
	vm.upsert = upsert;

	$scope.$on("SelectRow", function (evt, vehicle) {
		 vm.oVehicle = vehicle;
	});

	(function init(){
		if(!$stateParams.data){
			$state.go('masters.registeredVehicle');
			return;
		}

		vm.oVehicle = $stateParams.data;
		vm.monthlySalarySelectedIndex = 0;
	})();

	// to select particular row
	function selectThis(index){
		vm.monthlySalarySelectedIndex = index;
	}

	// Add Salary Model

	function addSalary(oType, index){

		var vehicleObj = {
			type: oType,
			_id: vm.oVehicle._id,
			monthlyCharges: vm.oVehicle.monthlyCharges,
			index: (Number.isInteger(index) && index>=0) ? index : false

		};

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/addDriverSalaryModal.html',
			controller: 'addDriverSalaryModalCtrl',
			resolve: {
				vehicleObj: function() {
					return vehicleObj;
				}
			}
		});

		modalInstance.result.then(function(response) {
			vm.oVehicle.monthlyCharges = response;
		});
	}

	function upsert() {
		$state.go("masters.registeredVehicleUpsert", { data: {
				mode: 'Edit',
				oVehicle: vm.oVehicle
			}});
	}
}





function RegisteredVehicleUpsertController(
	$scope,
	$state,
	$uibModal,
	$stateParams,
	accountingService,
	DatePicker,
	Driver,
	FleetService,
	modelService,
	structureMasterService,
	Vehicle,
	Vendor
){

	let vm = this;

	//Function Identifier
	vm.getAllVendorsListOnSearch = getAllVendorsListOnSearch;
	vm.onVendorSelect = onVendorSelect;
	vm.setModal = setModal;
	vm.submit = submit;
	vm.setVehicleType = setVehicleType;
	vm.vehicleCheckExist = vehicleCheckExist;
	vm.getAllDriver = getAllDriver;
	vm.getALLAccount = getALLAccount;
	vm.getCostCenter = getCostCenter;
	vm.vehicleStatus = vehicleStatus;
	vm.onDriverChanged = onDriverChanged;
	vm.onOwnershipSelect = onOwnershipSelect;
	vm.oVehicle = {};
	vm.oVehicle.current_budget = {};

	(function init() {

		if(!$stateParams.data){
			$state.go('masters.registeredVehicle');
			return;
		}

		vm.regVehPattern = $scope.$constants.regVehPattern;
		if($scope.$configs.master && $scope.$configs.master.vehicle && $scope.$configs.master.vehicle.pattern)
			vm.regVehPattern = $scope.$configs.master.vehicle.pattern;

		if($stateParams.data.mode === 'Add'){
			vm.oVehicle.ownershipType = 'Market';
			vm.oVehicle.category = 'Horse';
			vm.oVehicle.status = 'Available';
			vm.oVehicle.activeStatus = true;
			vm.readOnly = false;
			if( $scope.$configs.costCenter && $scope.$configs.costCenter.market && $scope.$configs.costCenter.market._id)
			vm.oVehicle.costCenter = $scope.$configs.costCenter.market;
		}
		vm.readonlyAC = false;
		if($stateParams.data.mode === 'Edit'){
			vm.readOnly = true;
			vm.oVehicle = $stateParams.data.oVehicle;

			vm.mode = $stateParams.data.mode;
			vm.oVehicle.driver = vm.oVehicle.driver && {
				_id: vm.oVehicle.driver,
				name: vm.oVehicle.driver_name,
				prim_contact_no: vm.oVehicle.driver_contact,
				license_no: vm.oVehicle.driver_license
			} || null;

			if(vm.oVehicle.manufactureDate)
				vm.oVehicle.manufactureDate = new Date(vm.oVehicle.manufactureDate);

			if(vm.oVehicle.permit_expiry_date)
				vm.oVehicle.permit_expiry_date = new Date(vm.oVehicle.permit_expiry_date);

			if(vm.oVehicle.puc_issuance_date)
				vm.oVehicle.puc_issuance_date = new Date(vm.oVehicle.puc_issuance_date);

			if(vm.oVehicle.puc_expiry_date)
				vm.oVehicle.puc_expiry_date = new Date(vm.oVehicle.puc_expiry_date);

			if(vm.oVehicle.insurance_expiry_date)
				vm.oVehicle.insurance_expiry_date = new Date(vm.oVehicle.insurance_expiry_date);

			if(vm.oVehicle.fitness_cert_issuance_date)
				vm.oVehicle.fitness_cert_issuance_date = new Date(vm.oVehicle.fitness_cert_issuance_date);

			if(vm.oVehicle.fitness_cert_expiry_date)
				vm.oVehicle.fitness_cert_expiry_date = new Date(vm.oVehicle.fitness_cert_expiry_date);

			if(vm.oVehicle.road_tax_doc_issuance_date)
				vm.oVehicle.road_tax_doc_issuance_date = new Date(vm.oVehicle.road_tax_doc_issuance_date);

			if(vm.oVehicle.road_tax_doc_expiry_date)
				vm.oVehicle.road_tax_doc_expiry_date = new Date(vm.oVehicle.road_tax_doc_expiry_date);

			if(vm.oVehicle.veh_type)
				vm.oVehicle.veh_type = vm.oVehicle.veh_type._id;

			vm.oVehicle.owner_name = vm.oVehicle.owner_name || vm.oVehicle.supervisor_name;
			vm.oVehicle.owner_mobile = vm.oVehicle.owner_mobile || vm.oVehicle.supervisor_contact_no;

			vm.isAccountLinked = (vm.oVehicle.account && vm.oVehicle.account._id) ? true : false;
			if(vm.oVehicle.account && vm.oVehicle.account._id){
				vm.readonlyAC = true;
			}
			if(vm.oVehicle.ownershipType === 'Market' && vm.oVehicle.vendor_id){
				getVehicleCount(vm.oVehicle.vendor_id)
			}


		}else{
			vm.mode = $stateParams.data.mode;

		}

		vm.DatePicker = angular.copy(DatePicker);
		vm.aCategory = ['Horse', 'Truck', 'Trailer'];
		vm.aStatus = ["Available", "Maintenance", "Booked", "In Trip", "Empty"];

		if(vm.oVehicle && vm.oVehicle._id){
			if(vm.oVehicle.deleted)
				vm.status = 'Disable';
			else
				vm.status = 'Enable';
		}else{
			vm.status = 'Enable';
		}

		getAllFleet();
		getAllManufracturer();
		getAllVehicleGroups();
    	getAllVehicleTypes();
		getAllStructureNames();

		try{
			if($scope.$configs.master.showAccount){

				vm.onSelectAccount = onSelectAccount;
				vm.onDelinkAccount = onDelinkAccount;

				// Get Account Masters
				(vm.getAccountMasters = function getAccountMasters(inputModel){

					var oFilter = {
						// all: true
						no_of_docs: 10,
						onlyUnlinked: true,
						group: 'Vehicle',
						isGroup: false,
					}; // filter to send
					if(inputModel)
						oFilter.name = inputModel;
					accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

					// Handle failure response
					function onFailure(response) {

					}

					// Handle success response
					function onSuccess(response){
						vm.aAccountMaster = response.data.data;
						if(vm.oVehicle.account && vm.oVehicle.account._id && !vm.aAccountMaster.find( o => o._id === vm.oVehicle.account._id))
							vm.aAccountMaster.unshift(vm.oVehicle.account);
					}
				})();

				function onSelectAccount(check) {
					// if(vm.oVehicle.account === "addNewAccount"){
						var modalInstance = $uibModal.open({
							templateUrl: 'views/accounting/accountMasterUpsert.html',
							controller: 'accountMasterUpsertController',
							resolve: {
								'selectedAccountMaster': function () {
									return {
										'group': ['Vehicle'],
										'name': vm.oVehicle.vehicle_reg_no,
										'ledger_name':vm.oVehicle.vehicle_reg_no,
										'branch': {},
										'limit': 500000,
										'opening_balance': 0,
										'isAdd': true,
										'isGroupNotAllowed': true,
									};
								}
							}
						});

						modalInstance.result.then(function(response) {
							if(response){
								// vm.aAccountMaster.push(response);
								vm.oVehicle.account = response;
							}

							console.log('close',response);
						}, function(data) {
							console.log('cancel');
						});
					}

				function onDelinkAccount() {
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
									masterSchema: 'RegisteredVehicle',
									masterId: vm.oVehicle._id,
									acntId: vm.oVehicle.account._id,
									wasLinkedTo: vm.oVehicle.vehicle_reg_no,
								}, onSuccess, onFailure);

								function onSuccess(res) {
									swal('Success', res.message, 'success');
									$state.go('masters.registeredVehicle', {}, { reload: true });
								}
								function onFailure(err) {
									swal('Error', err.message, 'error');
								}
							}
						});
				}

				}
		}catch(e){}
	})();

	function onOwnershipSelect(type){
		if(type === 'Market' && $scope.$configs.costCenter && $scope.$configs.costCenter.market && $scope.$configs.costCenter.market._id)
			vm.oVehicle.costCenter = $scope.$configs.costCenter.market;
		else
			vm.oVehicle.costCenter = undefined;

	}

	//Actual Function
	function getALLAccount(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 6,
					group: 'Vehicle',
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

	function getCostCenter(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 6,
					projection: {_id: 1, name: 1, category: "$category.name"}
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

	function setVehicleType(_oVehType) {
		if (_oVehType && _oVehType._id) {
			vm.oVehicle.veh_type = _oVehType._id;
			vm.oVehicle.veh_type_name = _oVehType.name;
		}
	}

	function onDriverChanged () {
		vm.oVehicle.driver_employee_code = vm.oVehicle.driver && vm.oVehicle.driver.employee_code;
		vm.oVehicle.driver_contact_no = vm.oVehicle.driver && vm.oVehicle.driver.prim_contact_no;
	}

	// function onChange () {


	// 	 if(vm.oVehicle.ownershipType = 'Market'){
	// 		vm.oVehicle.costCenter.market

	// 	 }
	// 	 else {
	// 		vm.oVehicle.costCenter= undefined;
	// 	 }

	// 	}

	function vehicleStatus(type){

		swal({
				title: `Are you sure you want to ${type} this vehicle? `,
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
						_id:vm.oVehicle._id
					};
					if(type === 'Enable')
					oRequest.deleted = false;
					else if(type === 'Disable')
					oRequest.deleted = true;

					Vehicle.deleteStatus(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Vehicle updated!!', 'success');
						getVehiclesList();
					}
				}else{
					if(type === 'Enable')
					vm.status = 'Disable';
					else if(type === 'Disable')
						vm.status = 'Enable';
				}
			});
		return;
	}

	$scope.getAllDriver = function (v) {
		if (v.length > 2) {
			return new Promise(function (resolve, reject) {
				Driver.getName(v, function (d) {
					resolve(d.data.data);
				}, function (e) {
					resolve([]);
				});
			});
		}
	};





	function getAllDriver (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				Driver.getName(viewValue, res => {
					resolve(res.data.data)
				}, err => {
					reject([]);
					console.log`${err}`;
				});
			});
		}
	}



	function getAllFleet() {
		FleetService.getFleetWithPagination({ all: true }, successFleetMasters, failureFleetMasters);

		function failureFleetMasters(response) {

		}

		function successFleetMasters(response) {
			vm.aOwners = response.data;
		}
	}

	function getAllManufracturer() {
		modelService.getModelMatrix(successModelMatrix, failureModelMatrix);

		function successModelMatrix(response) {
			if (response.data && response.data.data) {
				vm.vehModelMatrix = JSON.parse(angular.toJson(response.data.data));
				vm.oVehicle.manufacturer && setModal(vm.oVehicle.manufacturer);
			}
		}

		function failureModelMatrix(response) {}
	}

	function getAllVehicleGroups() {

		Vehicle.getGroupVehicleType(successGroupVehicleType, failGroupVehicleType);

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				vm.aVehicleGroups = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}

	function getAllVehicleTypes() {

		Vehicle.getAllType(successGroupVehicleType, failGroupVehicleType);

		function successGroupVehicleType(response) {
			if (response && response.data && response.data.data) {
				vm.aVehicleTypes = response.data.data;
			}
		}

		function failGroupVehicleType(res) {
			console.error("fail: ", res);
		}
	}

	function getAllVendorsListOnSearch(vendorName=''){

		if(vendorName.length <= 2)
			return;

		var reqObj = {
			'ownershipType': vm.oVehicle.ownershipType,
			deleted: false
		};
		if(vendorName)
			reqObj.name = vendorName;


		Vendor.getAllVendorsList(reqObj, successVendorList);

		function successVendorList(res) {
			if (res.data.data) {
				vm.aVendors = res.data.data;
			}
		}
	}

	function getAllStructureNames() {

		structureMasterService.getStructureMasters({}, successStructureMasters, failureStructureMasters);

		function successStructureMasters(response) {
			if (response.status.toLowerCase() === "ok" && response.data) {
				vm.aStructure = response.data;
			}
		}

		function failureStructureMasters(response) {}
	}

	function setModal(manufacturer) {
		if ((manufacturer) && (vm.vehModelMatrix) && (Object.keys(vm.vehModelMatrix).length > 0)) {
			vm.aModels = JSON.parse(angular.toJson(vm.vehModelMatrix[manufacturer]));
		}
	}

	function onVendorSelect($item, $model, $label) {
		getVehicleCount($item._id);
		vm.oVehicle.vendor_id = $item._id;
		vm.oVehicle.vendor_name = $item.name;
		vm.oVehicle.vendor_mobile = $item.prim_contact_no;
		vm.oVehicle.owner_name = $item.name;
		vm.oVehicle.owner_mobile = $item.prim_contact_no;
	}

	function getVehicleCount(venderId) {
		if (venderId && vm.oVehicle.ownershipType === 'Market') {
			return new Promise(function (resolve, reject) {
				let req = {
					vendor_id: venderId,
					deleted: false,
					ownershipType: 'Market',
					project: {_id: 1}
				};

				Vehicle.getNameTrim1(req, res => {
					if(res.data.data.length){
                     vm.vehicleCount = res.data.data.length;
					}else
					resolve(res.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});
			});
		}

		return [];
	}

	function vehicleCheckExist () {
		if(vm.oVehicle.vehicle_reg_no) {
			var oSend = {};
			oSend.vehicle_reg_no = vm.oVehicle.vehicle_reg_no;
			if(vm.oVehicle._id)
				oSend._id = vm.oVehicle._id;

			Vehicle.vehicleCheckExists(oSend, sucRes, failRes);

			function sucRes(res) {
				vm.checkExists = '';
			}

			function failRes(res) {
				vm.checkExists = res.data.message;
			}
		}
	}


	function submit(formData) {
		if(formData.$valid){

			let oRequest = {
				...vm.oVehicle
			};

			if(oRequest.ownershipType!='Market' && $scope.$configs.master.showAccount && !(vm.oVehicle.account && vm.oVehicle.account._id))
				return swal('','Invalid account please enter valid account','error');

			if($scope.$configs.costCenter && $scope.$configs.costCenter.show && !(vm.oVehicle.costCenter && vm.oVehicle.costCenter._id))
				return swal('','Invalid costCenter  please enter valid costCenter','error');

			if(oRequest.permit_expiry_date)
				oRequest.permit_expiry_date = oRequest.permit_expiry_date.toISOString();

			if(oRequest.insurance_expiry_date)
				oRequest.insurance_expiry_date = oRequest.insurance_expiry_date.toISOString();

			if(oRequest.fitness_cert_issuance_date)
				oRequest.fitness_cert_issuance_date = oRequest.fitness_cert_issuance_date.toISOString();

			if(oRequest.fitness_cert_expiry_date)
				oRequest.fitness_cert_expiry_date = oRequest.fitness_cert_expiry_date.toISOString();

			if(oRequest.road_tax_doc_issuance_date)
				oRequest.road_tax_doc_issuance_date = oRequest.road_tax_doc_issuance_date.toISOString();

			if(oRequest.road_tax_doc_expiry_date)
				oRequest.road_tax_doc_expiry_date = oRequest.road_tax_doc_expiry_date.toISOString();

			if(oRequest.sd)
				oRequest.sd = moment(oRequest.sd, 'DD/MM/YYYY').startOf('day').toISOString();

			if(oRequest.veh_group){
					try{
						oRequest.veh_group_name = vm.aVehicleGroups.find(obj => obj._id === oRequest.veh_group).name;
					}catch (e) {
						swal('','Invalid Group Id','error');
						return;
					}
				}
			if(oRequest.veh_type){
				try{
					oRequest.veh_type_name = vm.aVehicleTypes.find(obj => obj._id === oRequest.veh_type).name;
				}catch (e) {
					swal('','Invalid Type Id','error');
					return;
				}
			}

			if(vm.oVehicle.driver){
				oRequest.driver_contact_no = vm.oVehicle.driver.prim_contact_no;
				oRequest.driver_employee_code = vm.oVehicle.driver.employee_code;
				oRequest.driver_license = vm.oVehicle.driver.license_no;
				oRequest.driver_name = vm.oVehicle.driver.name;
				oRequest.driver = vm.oVehicle.driver._id;
			}
			vm.disableSubmit = true;
			if (vm.mode == 'Add') {

				if(oRequest.status === vm.aStatus[0]){
					oRequest.last_known = oRequest.last_known || {};
					oRequest.last_known.status = oRequest.status;
				}
				Vehicle.saveVehicle(oRequest, succSubmitVehicle, failSubmitVehicle);
			} else {
				Vehicle.updateVehicle(oRequest, succSubmitVehicle, failSubmitVehicle);
			}

			function succSubmitVehicle(response) {
				vm.disableSubmit = false;
				if (response && response.data && response.data.data) {
					swal("Done!", response.data.message, "success");
					$state.go("masters.registeredVehicleDetail", { data: response.data.data});
				}
			}

			function failSubmitVehicle(response) {
				swal("Failed!", response.data.message, "error");
				vm.disableSubmit = false;
			}

		}else{
			swal('','All Mandatory Field should Be Filled','error');
			vm.disableSubmit = false;
		}
	}
}

//function RegisteredVehicleDetailController(
// 	$rootScope,
// 	$scope,
// 	$state,
// 	$uibModal,
// 	$q,
// 	DateUtils,
// 	modelService,
// 	structureMasterService,
// 	Vehicle,
// 	Driver,
// 	DatePicker,
// 	Vendor,
// 	ReportService,
// 	FleetService,
// 	clientConfig,
// 	$stateParams
// ) {
//
// 	let vm = this;
//
// 	if(!$stateParams.data)
// 		$state.go('masters.registeredVehicle');
//
// 	vm.oVehicle = $stateParams.data;
//
// 	$scope.tabs = [
// 		{ title: 'PROFILE', content: './../../views/myRegisteredVehicle/vehicleProfile.html' },
// 		{ title: 'IDENTIFICATION', content: './../../views/myRegisteredVehicle/vehicleIdentity.html' },
// 		{ title: 'DRIVER SALARY', content: './../../views/myRegisteredVehicle/driverSalary.html' }
// 		//{ title: 'DOCUMENTS', content: './../../views/myRegisteredVehicle/vehicleDocuments.html' }
// 	];
//
// 	$scope.DatePicker = DatePicker;
//
// 	$scope.setVehicleMode = function(mode) {
// 		$scope.registered_vehicle_mode = mode;
// 	};
// 	$scope.setVehicleMode("View");
//
// 	//----------------------***********************-----------------------------------------
// 	$scope.currentPage = 1;
// 	$scope.maxSize = 3;
// 	$scope.items_per_page = 7;
// 	//---------------****************------------------------------------------------------
// 	$scope.aStatus = ["Available", "Maintenance", "Booked", "Journey"];
// 	$scope.aCategory = ['Horse', 'Truck', 'Trailer'];
// 	$scope.searchOwnership = ['All', 'Own', 'Market'];
// 	$scope.aStatus = ["Available", "Maintenance", "Booked", "Journey"];
// 	$scope.aMake_years = ['2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003',
// 		'2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991'
// 	];
// 	/* $scope.aOwners = ['B.K Tiwari', 'Gaurav', 'Jhalani', 'Manoj', 'Murtaza', 'N.P Shukla', 'Raj Singh', 'Rohit Ji', 'For Sale', 'HZL',
//         'Loni Fix', 'NAGPUR', 'NAGPUR-NCR', 'Proposed for Sale', 'Market', 'Mohit', 'VMST', 'om shree tpt Nagpur',
//         'ICD LONI(BASANT)', 'ICD LONI(N.P SHUKLA)', 'ICD LONI(ROHIT)', 'Ashok', 'Banwari', 'Basant', 'Harsh(Future Truck)', 'Ram Lakhan', 'Umesh'
//     ]; */
// 	$scope.aModels = [];
// 	$scope.oSearchRegisteredVehicle = {};
// 	$scope.checkAll = 0;
//
// 	$scope.fleet_Label = clientConfig.getFeatureValue("fleet", "label");
//
// 	//-------------------*************-------------------------------------------------------
// 	function successFleetMasters(response) {
// 		if (response && response.data) {
// 			$scope.aOwners = response.data;
// 			$scope.checkAll++;
// 		}
// 	}
//
// 	function failureFleetMasters(response) {}
// 	$scope.getAllFleet = function() {
// 		FleetService.getFleetWithPagination({ all: true }, successFleetMasters, failureFleetMasters);
// 	};
// 	$scope.getAllFleet(); //7
// 	//------------------------------------------------------------------------------------------
// 	function successStructureMasters(response) {
// 		if (response.status.toLowerCase() === "ok" && response.data) {
// 			$scope.aStructure = response.data;
// 			$scope.checkAll++;
// 		}
// 	}
//
// 	function failureStructureMasters(response) {}
// 	$scope.getAllStructureNames = function() {
// 		structureMasterService.getStructureMasters({}, successStructureMasters, failureStructureMasters);
// 	};
// 	$scope.getAllStructureNames(); //6
// 	//-------------------*************-------------------------------------------------------
// 	$scope.getAllDriverData = function() {
// 		Driver.getAllDriversForDropdown({ all: true }, function success(data) {
// 			$scope.aDriver = data.data;
// 			$scope.checkAll++;
// 		});
// 	};
// 	$scope.getAllDriverData(); //5
// 	//----------------------------------****************---------------------------------------
// 	function successModelMatrix(response) {
// 		if (response.data && response.data.data) {
// 			$scope.vehModelMatrix = JSON.parse(angular.toJson(response.data.data));
// 			$scope.checkAll++;
// 		}
// 	}
//
// 	function failureModelMatrix(response) {}
//
// 	function getModelMatrix() {
// 		modelService.getModelMatrix(successModelMatrix, failureModelMatrix);
// 	}
// 	getModelMatrix(); //4
// 	//--------------********************------------------------------------------------------
// 	$scope.pageChanged = function() {
// 		$scope.getVehiclesList(true);
// 	};
// 	//-------------------------------------*****************-----------------------------------
// 	function successVehicleByName(response) {
// 		$scope.vehicleNames = response.data.data;
// 	}
//
// 	function failVehicleByName(response) {
// 		//
// 	}
//
// 	$scope.getVehicleByName = function(viewValue) {
// 		if (viewValue && viewValue.toString().length > 1) {
// 			Vehicle.getName(viewValue, successVehicleByName, failVehicleByName);
// 		} else if (viewValue == '') {
// 			$scope.getVehiclesList();
// 		}
// 	};
//
// 	$scope.onSelect = function($item, $model, $label) {
// 		$scope.oSearchRegisteredVehicle.vehicleName = $item.vehicle_reg_no;
// 		$scope.getVehiclesList();
// 	};
//
// 	$scope.clearSearch = function() {
// 		delete $scope.oSearchRegisteredVehicle.vehicleName;
// 		$scope.getVehiclesList();
// 	};
//
// 	//$scope.getVehiclesList();//3
// 	//-------------------------------------------------------------------------------
// 	/* $scope.getModelData = function(manufacturer) {
//         if ((manufacturer) && ($scope.vehModelMatrix) && (Object.keys($scope.vehModelMatrix).length > 0)) {
//             $scope.aModels = JSON.parse(angular.toJson($scope.vehModelMatrix[manufacturer]));
//         }
//     }; */
// 	//-----------------------------***********************----------------------------
// 	$scope.downloadReport = function() {
// 		var oFilter = prepareFilterObject();
// 		ReportService.getVehicleReport(oFilter, function(data) {
// 			var a = document.createElement('a');
// 			a.href = data.data.url;
// 			a.download = data.data.url;
// 			a.target = '_blank';
// 			a.click();
// 		});
// 	};
// 	//-------------------****----------------------------------------------------------
// 	function removeSelectedCSSclass() {
// 		listItem = $($('.lv-item'));
// 		listItem.siblings().removeClass('list_border_background');
// 	}
// 	//---------------------***********---------------------------------------------------
// 	$scope.selectVehicle = function() {
// 		$scope.setVehicleMode("View");
// 		if ($scope.oVehicle) {
// 			setViewOrEditData($scope.oVehicle);
// 			removeSelectedCSSclass();
// 		}
// 	};
// 	$scope.selectVehicle();
// 	//---------------------****************************-----------------------------------
// 	$scope.$watch('registered_vehicle_mode', function(newVal, oldVal) {
// 		switch ($scope.registered_vehicle_mode) {
// 			case "Add":
// 				removeSelectedCSSclass();
// 				setAddData();
// 				break;
// 			default:
// 				break;
// 		}
// 	}, true);
// 	//-------------------------**********---------------------------------------
// 	function successVendorList(res) {
// 		if (res.data.data) {
// 			$scope.aVendors = res.data.data;
// 			$scope.checkAll++;
// 		}
// 	}
// 	($scope.getAllVendorsList = function() {
// 		Vendor.getAllVendorsList({}, successVendorList);
// 	})(); //2
//
// 	$scope.getAllVendorsListOnSearch = function(vendorName) {
// 		if(vendorName.length <= 2)
// 			return;
// 		var reqObj = {};
// 		if(vendorName)
// 			reqObj.name = vendorName;
//
// 		Vendor.getAllVendorsList(reqObj, successVendorList);
// 	};
// 	//--------------------------------------------------------------------------
// 	function successGroupVehicleType(response) {
// 		if (response && response.data && response.data.data) {
// 			$scope.aVehicleGroups = response.data.data;
// 			$scope.checkAll++;
// 		}
// 	}
//
// 	function failGroupVehicleType(res) {
// 		console.error("fail: ", res);
// 	}
// 	$scope.getGroups = function() {
// 		Vehicle.getGroupVehicleType(successGroupVehicleType, failGroupVehicleType);
// 	};
// 	$scope.getGroups(); //1
// 	//-----------------------Set Add Data--------------------------------------------------
// 	function setAddData() {
// 		$scope.oVehicle = {};
// 	}
// 	//-----------------------------Binding Functions------------------------------------
// 	function setOnEditVehicleGroup(group_id) {
// 		if (group_id) {
// 			if ($scope.aVehicleGroups && $scope.aVehicleGroups.length > 0) {
// 				for (var i = 0; i < $scope.aVehicleGroups.length; i++) {
// 					if ($scope.aVehicleGroups[i]._id === group_id) {
// 						return $scope.aVehicleGroups[i];
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	function setOnEditVehicleType(veh_type_id) {
// 		if (veh_type_id) {
// 			if ($scope.aVehicleType && $scope.aVehicleType.length > 0) {
// 				for (var i = 0; i < $scope.aVehicleType.length; i++) {
// 					if ($scope.aVehicleType[i]._id === veh_type_id) {
// 						return $scope.aVehicleType[i];
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	function setOnEditVehicleStructure(structure_name) {
// 		if (structure_name) {
// 			if ($scope.aStructure && $scope.aStructure.length > 0) {
// 				for (var i = 0; i < $scope.aStructure.length; i++) {
// 					if ($scope.aStructure[i].structure_name === structure_name) {
// 						return $scope.aStructure[i];
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	function setOnEditDriver(driver_id) {
// 		if (driver_id) {
// 			if ($scope.aDriver && $scope.aDriver.length > 0) {
// 				for (var i = 0; i < $scope.aDriver.length; i++) {
// 					if ($scope.aDriver[i]._id === driver_id) {
// 						return $scope.aDriver[i];
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	function setOnEditVendor(vendor_id) {
// 		if (vendor_id) {
// 			if ($scope.aVendors && $scope.aVendors.length > 0) {
// 				for (var i = 0; i < $scope.aVendors.length; i++) {
// 					if ($scope.aVendors[i]._id === vendor_id) {
// 						return $scope.aVendors[i];
// 					}
// 				}
// 			}
// 		}
// 	}
// 	//-------------------------Set Edit Data---------------------------------------------
// 	function setViewOrEditData(vehicleData) {
// 		vehicleData.group_data = vehicleData.veh_group ? setOnEditVehicleGroup(vehicleData.veh_group) : undefined;
// 		$scope.aVehicleType = (vehicleData.group_data && vehicleData.group_data.vehicle_types) ? vehicleData.group_data.vehicle_types : [];
// 		vehicleData.veh_type_data = vehicleData.veh_type ? setOnEditVehicleType(vehicleData.veh_type._id) : undefined;
// 		vehicleData.structure = vehicleData.structure_name ? setOnEditVehicleStructure(vehicleData.structure_name) : undefined;
// 		vehicleData.ownershipType = vehicleData.ownershipType ? vehicleData.ownershipType : "Own";
// 		vehicleData.capacity_tonne = vehicleData.capacity_tonne ? vehicleData.capacity_tonne : (vehicleData.veh_type && vehicleData.veh_type.capacity ? vehicleData.veh_type.capacity : 0);
// 		vehicleData.driver_data = vehicleData.driver ? setOnEditDriver(vehicleData.driver) : undefined;
// 		vehicleData.vendor_data = vehicleData.vendor_id ? setOnEditVendor(vehicleData.vendor_id) : undefined;
// 		//$scope.getModelData(vehicleData.manufacturer);
// 		//oVehicle.model
// 		$scope.oVehicle = vehicleData;
//
// 	}
//
// 	//-----------------------------------------------------------------------------------------
//
// 	// $scope.$watch('checkAll', function(newVal, oldVal) {
// 	// 	if (newVal !== oldVal) {
// 	// 		if ($scope.checkAll === 6) {
// 	// 			$scope.getVehiclesList();
// 	// 		}
// 	// 	}
// 	// }, true);
// 	//----------------------------------------------------------------
// 	$scope.changeLastKnown = function() {
// 		if (!($scope.oVehicle.last_known && $scope.oVehicle.last_known.status)) {
// 			$scope.oVehicle.last_known = {};
// 		}
// 		$scope.oVehicle.last_known.status = ($scope.oVehicle.status) ? $scope.oVehicle.status : undefined;
// 		$scope.oVehicle.last_known.datetime = new Date();
// 	};
//
//
//
// 	//----------------------------Save---------------------------------
//
// 	function succSubmitVehicle(response) {
// 		if (response && response.data && response.data.data) {
// 			swal("Done!", response.data.message, "success");
// 			$state.reload();
// 		}
// 	}
//
// 	function failSubmitVehicle(res) {
// 		swal("Failed!", response.data.message, "error");
// 	}
//
// 	$scope.submitVehicle = function() {
// 		var oSend = angular.copy($scope.oVehicle);
// 		oSend.veh_group = (oSend.group_data && oSend.group_data._id) ? oSend.group_data._id : undefined;
// 		oSend.veh_group_name = (oSend.group_data && oSend.group_data.name) ? oSend.group_data.name : undefined;
// 		oSend.veh_type = (oSend.veh_type_data && oSend.veh_type_data._id) ? oSend.veh_type_data._id : undefined;
// 		oSend.veh_type_name = (oSend.veh_type_data && oSend.veh_type_data.name) ? oSend.veh_type_data.name : undefined;
// 		oSend.structure_name = (oSend.structure && oSend.structure.structure_name) ? oSend.structure.structure_name : undefined;
// 		oSend.own = (oSend.ownership == "yes") ? true : false;
// 		oSend.is_market = !oSend.own;
// 		oSend.driver = (oSend.driver_data && oSend.driver_data._id) ? oSend.driver_data._id : undefined;
// 		oSend.driver_name = (oSend.driver_data && oSend.driver_data.name) ? oSend.driver_data.name : undefined;
// 		oSend.driver_license = (oSend.driver_data && oSend.driver_data.license_no) ? oSend.driver_data.license_no : undefined;
// 		oSend.driver_employee_code = (oSend.driver_data && oSend.driver_data.employee_code) ? oSend.driver_data.employee_code : undefined;
// 		oSend.driver_contact_no = (oSend.driver_data && oSend.driver_data.prim_contact_no) ? oSend.driver_data.prim_contact_no : undefined;
//
// 		oSend.vendor_id = (oSend.vendor_data && oSend.vendor_data._id) ? oSend.vendor_data._id : undefined;
// 		oSend.vendor_name = (oSend.vendor_data && oSend.vendor_data.name) ? oSend.vendor_data.name : undefined;
// 		oSend.vendor_mobile = (oSend.vendor_data && oSend.vendor_data.prim_contact_no) ? oSend.vendor_data.prim_contact_no : undefined;
//
//
// 		delete oSend.group_data;
// 		delete oSend.veh_type_data;
// 		delete oSend.structure;
// 		delete oSend.ownership;
// 		delete oSend.driver_data;
// 		delete oSend.vendor_data;
// 		if ($scope.registered_vehicle_mode == 'Add') {
// 			Vehicle.saveVehicle(oSend, succSubmitVehicle, failSubmitVehicle);
// 		} else {
// 			Vehicle.updateVehicle(oSend, succSubmitVehicle, failSubmitVehicle);
// 		}
// 	};
//
// 	// to select particular row
// 	$scope.selectThis = function(index){
// 		$scope.monthlySalarySelectedIndex = index;
// 	};
//
// 	// Add Salary Model
//
// 	$scope.addSalary = function(oType, index){
//
// 		var vehicleObj = {
// 			type: oType,
// 			_id: $scope.oVehicle._id,
// 			monthlyCharges: $scope.oVehicle.monthlyCharges,
// 			index: (Number.isInteger(index) && index>=0) ? index : false
//
// 		};
// 		var modalInstance = $uibModal.open({
// 			templateUrl: 'views/myRegisteredVehicle/addDriverSalaryModal.html',
// 			controller: 'addDriverSalaryModalCtrl',
// 			resolve: {
// 				vehicleObj: function() {
// 					return vehicleObj;
// 				}
// 			}
// 		});
//
// 		modalInstance.result.then(function(response) {
// 			$scope.oVehicle.monthlyCharges = response;
// 		});
// 	};
//
//
// 	// Redirect to livetrack page
// 	$scope.liveTrack = function () {
// 		$rootScope.selectedVehicleData = $scope.oVehicle;
// 		$rootScope.redirect("#!/masters/liveTrackPage");
// 	}
// }

materialAdmin.controller("addDriverSalaryModalCtrl", function (
	$filter,
	$localStorage,
	$scope,
	$uibModalInstance,
	DatePicker,
	Vehicle,
	vehicleObj
){
	$scope.DatePicker = DatePicker;
	$scope.DatePicker.dateSettings.minMode = 'month';
	$scope.vehicleObj = angular.copy(vehicleObj);
	$scope.vehicleObj.monthlyCharges = $filter('orderBy')($scope.vehicleObj.monthlyCharges, '-created_at');

	if(Number.isInteger($scope.vehicleObj.index)){
		$scope.month = new Date($scope.vehicleObj.monthlyCharges[$scope.vehicleObj.index].mm_yy);
		$scope.salary = $scope.vehicleObj.monthlyCharges[$scope.vehicleObj.index].amount;
	}

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.updateSalary = function(){
		console.log($scope.addDriverSalary);

		if(Number.isInteger($scope.vehicleObj.index)){
			var oSend = {};
			oSend._id = $scope.vehicleObj._id;
			oSend.monthlyCharges = $scope.vehicleObj.monthlyCharges;
			oSend.monthlyCharges[$scope.vehicleObj.index].amount = $scope.salary;
		}else{

			var flag = false;
			($scope.vehicleObj.monthlyCharges || []).map(function(obj){
				var month = (new Date(obj.mm_yy)).getMonth(),
					year = (new Date(obj.mm_yy)).getFullYear();
				if(month === $scope.month.getMonth() && year === $scope.month.getFullYear())
					flag = true;
			});

			if(flag){
				swal('Error','Date Already Selected','error');
				return;
			}

			var tempObj = {},
				oSend = {};
			tempObj.mm_yy = $scope.month;
			tempObj.component = 'driver_salary';
			tempObj.amount = $scope.salary;
			tempObj.created_by = $localStorage.ft_data.userLoggedIn.full_name;
			tempObj.created_at = new Date();
			oSend._id = $scope.vehicleObj._id;
			oSend.monthlyCharges = ($scope.vehicleObj.monthlyCharges || []);
			oSend.monthlyCharges.push(tempObj);
		}

		function updateVehicleSuccess(response) {
			if (response && response.data && response.data.data) {
				swal("Done!", response.data.message, "success");
				$uibModalInstance.close(response.data.data.monthlyCharges);
			}
		}

		function updateVehicleFailure(res) {
			swal("Failed!", response.data.message, "error");
		}

		Vehicle.updateVehicle(oSend, updateVehicleSuccess, updateVehicleFailure)

	};

});


materialAdmin.controller("liveTrackPageController", function (
	$filter,
	$localStorage,
	$scope,
	$rootScope,
	$uibModal,
	$state,
	utils,
	objToCsv,
	DatePicker,
	Vehicle,
	$timeout,

) {

	let vm = this,
	map,
	toolTipMap;

	$scope.selectedliveData = null;
	$scope.oLiveData = null;
	$rootScope.maps = {};
	$rootScope.plottedMarkers = [];
	// function Identifier
	$scope.selectThisRow = selectThisRow;
	$scope.updateliveData = updateliveData;

	$scope.getLivetrackVehicleData = getLivetrackVehicleData;
	$scope.plotMarketArry = plotMarketArry;
	// INIT functions
	(function init() {

		$scope.showMap = false;

		$timeout(function () {
			mapInit();
		});
	})();

	function prepareFilterObject(isPagination) {
		var myFilter = {};

		if($rootScope.selectedTripData){
			myFilter.trip = $rootScope.selectedTripData._id;
		}
		if ($scope.from) {
			myFilter.from = $scope.from;
		}
		if ($scope.to) {
			myFilter.to = $scope.to;
		}
		if ($scope.address) {
			myFilter.address = $scope.address;
		}
		return myFilter;
	}

	$scope.getAllLiveTrack = function(isPagination) {
		function succGetTracking(res) {
			if (res.data.status === 'OK') {
				//alert("in....");
				console.log(res);
				$scope.aLiveTrackData = res.data.data.data;

			} else {
				alert('Errrrr.......');
			}
		}

		function failGetTraking(res) {
			alert('res');
		}
		var oFilter = prepareFilterObject(isPagination);
		if(oFilter.trip)
			Vehicle.getAllTrackingData(oFilter, succGetTracking, failGetTraking);
		else
			$state.go('booking_manage.myTrips');
	};
	$scope.getAllLiveTrack();

	$scope.deleteliveData = function() {
		swal({
			title: "Confirm delete ?",
			text: "Live Track Address:  " + $scope.selectedliveData.address + " will be removed.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function() {
			function succDeleteliveData(response) {
					if (response.message) {
						swal("Done!", response.message, "success");
						$state.go('masters.liveTrackPage', {}, {reload: true});
			     }
			}

			function failDeleteliveData(response) {
				if (response.message) {
					growlService.growl(response.message, "danger");
					swal("Opps!", response.message, "error");
				}
			}
			Vehicle.deleteliveData($scope.selectedliveData, succDeleteliveData, failDeleteliveData);
		});
	};


	// add more locations
	$scope.addMoreLocation = function(){
		if($rootScope.selectedVehicleData && $rootScope.selectedVehicleData.vehicle_reg_no) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/myRegisteredVehicle/addMoreLocation.html',
				controller: 'addMoreLocationCtrl',
				resolve: {
					'oLiveData': function () {
						return {};
					}
				}
			});
		}else {
			swal("Warning", "Please go back and select vehicle for add more live track.", "warning");
		}
	};

	// edit more locations

	function updateliveData(oLiveData) {
		if($rootScope.selectedVehicleData && $rootScope.selectedVehicleData.vehicle_reg_no) {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/myRegisteredVehicle/addMoreLocation.html',
			controller: 'addMoreLocationCtrl',
			resolve: {
				'oLiveData': function () {
					return oLiveData;
				}
			}

		});

		modalInstance.result.then(function(response) {
			if(response)
				if(selectedliveData)
					$scope.selectedliveData = response;
				else
					$scope.aLiveTrackData.push(response);

			console.log('close',response);
		}, function(data) {
			console.log('cancel');
		});

		}
		else {
		swal("Warning", "Please go back and select vehicle for add more live track.", "warning");
		}
	}

	// Live Track Page Redirct...

	/*$scope.myLiveTrackMap = function (oLiveData) {
		var sUrl = '#!/masters/liveTrackMap';
		$rootScope.redirect(sUrl);
	};*/




	function removeAllMarkerOnMap () {
		if($rootScope.maps && $rootScope.maps.clusterL && $rootScope.maps.map) {
			$rootScope.maps.map.removeLayer ($rootScope.maps.clusterL);
			$rootScope.maps.clusterL = utils.initializeCluster(map);
		}
	}




	function getLivetrackVehicleData(toRefresh) {
		let initCb = function () {
			removeAllMarkerOnMap();
		};
		let cb = function (obj,resData) {
			vm.aTrSheetDevice = obj.aTrSheetDevice;
			plotMarkerOnMap(resData || obj.aTrSheetDevice);
		};
	}

	function plotMarketArry()
	{
		$scope.showMap = !$scope.showMap;
		if(!$scope.showMap)
			return;

		$rootScope.maps.map && $timeout(function(){ $rootScope.maps.map.invalidateSize()});

		utils.removeAllMarker();
		let cords = [];
		//let cordsAddr = [];

		$scope.aLiveTrackData.forEach(oData => {
			if(oData.lat && oData.lng) {
				cords.push({lat: oData.lat, lng: oData.lng, address: oData.address});
				//cordsAddr.push({address: oData.address});
			}
		});

		cords.forEach( oCords => utils.addMarker(oCords));
		utils.fitMap(cords);

	}


	function mapInit() {
		//alert('in....');
		$rootScope.maps = utils.initializeMapView('mapViewLiveTracking', {
			zoomControl: false,
			hybrid: true,
			zoom: 4,
			search: true,
			location: false,
			center: new L.LatLng(21, 90)
		}, true);
	}

	/*function zoomIn() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom<17)
				$rootScope.maps.map.setZoom(++curZoom);
		}
	}

	function zoomOut() {
		if($rootScope.maps.map){
			curZoom = $rootScope.maps.map.getZoom();
			if(curZoom && curZoom>2)
				$rootScope.maps.map.setZoom(--curZoom);
		}
	}*/





	// END


	/*$scope.updateliveData = function(selectedliveData){
		if($rootScope.selectedVehicleData && $rootScope.selectedVehicleData.vehicle_reg_no) {
			var modalInstance = $uibModal.open({
				templateUrl: 'views/myRegisteredVehicle/addMoreLocation.html',
				controller: 'addMoreLocationCtrl'
			});
		}else {
			swal("Warning", "Please go back and select vehicle for add more live track.", "warning");
		}
	};*/


	$scope.downloadLiveTrackCsv = function(){
		//alert('in....');


		if(!($scope.aLiveTrackData || []).length)
			return;


		let title = 'Live Track';
		let header = [
			"DATE",
			"ADDRESS",
			"STATUS",
			"REMARK",
			"CREATED BY",
			"ENTRY DATE"
		];

		let body = $scope.aLiveTrackData.map( o => {
			let arr = [];
			try{
				arr.push(($filter('date')(o.created_at, 'dd-MMM-yyyy \'at\' h:mma')) || '');
			}catch(e){
				arr.push("");
			}

			try{
				arr.push(o.address.split(',').join(' ')  || '');
			}catch(e){
				arr.push("");
			}

			try{
				arr.push(o.status || '');
			}catch(e){
				arr.push("");
			}

			try{
				arr.push(o.remarks || '');
			}catch(e){
				arr.push("");
			}

			try{
				arr.push(o.created_by || '');
			}catch(e){
				arr.push("");
			}

			try{
				arr.push(($filter('date')(o.datetime, 'dd-MMM-yyyy \'at\' h:mma')) || '');
			}catch(e){
				arr.push("");
			}

			return arr;
		});

		objToCsv(title, header, body);

	};

	function selectThisRow(oliveData, index) {
		var row = $('.selectItem');
		$(row).removeClass('grn');
		$(row[index]).addClass('grn');
		$scope.selectedliveData = oliveData;
	}


});


materialAdmin.controller("addMoreLocationCtrl", function (
	$filter,
	$http,
	$localStorage,
	$scope,
	$rootScope,
	$timeout,
	$uibModalInstance,
	constants,
	DatePicker,
	limitToFilter,
	utils,
	otherUtils,
	objToCsv,
	Vehicle,
	FleetService,
	oLiveData
){
	$scope.DatePicker = DatePicker;
	$scope.oLiveData = angular.copy(oLiveData);
	$scope.oLiveData.date = new Date();
	//$scope.DatePicker.dateSettings.minMode = 'month';
	//$scope.vehicleObj = angular.copy(vehicleObj);
	$scope.oLiveData.date = new Date();
	$scope.oLiveData.datetime = $scope.oLiveData.date;
	$scope.oLiveData.reportingdate = new Date ();
	$scope.oLiveData.reportingdatetime = $scope.oLiveData.reportingdate;

	// $scope.liveTrackStatus = ["Running", "Stopped", "In Traffic"];
	$scope.liveTrackStatus = ["Running", "Stopped", "In Traffic","Driver Issue","Vehicle Breakdown","Puncture","Traffic Jam","Customer Issue","Driver Rest", "Maintenance"],

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	// MAP code start here....
	$scope.aLocationUrl = [{type: "gpsGaadi", url: "http://52.220.18.209/search?format=json&addressdetails=1q=&q="},
		{type: "mapMyIndia", url: "http://trucku.in:8081/api/mapmyindia/atlas/api/places/search/json"},
		{type: "mapMyIndiaGeoCode", url: "http://trucku.in:8081/api/mapmyindia/geo_code?addr="},
	];

	var map, drawnItems, drawControl, marker;

	$scope.callAtTimeout = function() {
		map = utils.initializeMapView('mapForLiveTrack', {
			zoomControl: true,
			hybrid: true,
			zoom: 4,
			search: false,
			location: false,
			center: new L.LatLng(21, 90)
		}, false).map;
		drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);
		drawControl = new L.Control.Draw({
			edit: {
				featureGroup: drawnItems,
				edit: false,
				remove: false
			},
			draw: {
				polygon: false,
				polyline: false,
				circlemarker: false,
				//marker : false,
				circle: false,
				rectangle: false

			}
		});
		map.addControl(drawControl);

		map.on(L.Draw.Event.CREATED, function(event) {
			var layer = event.layer;
			$scope.landarkData = JSON.parse(JSON.stringify(event.layer._latlng));

			/*getAddressByLatLng($scope.landarkData.location.latitude, $scope.landarkData.location.longitude,function (address) {
                setValue.geoname.value = address;
            })*/

			popup = L.popup();
			layer.bindPopup(popup);
			if (marker !== undefined) {
				drawnItems.removeLayer(marker);
			}
			marker = layer;
			drawnItems.addLayer(marker);
			$scope.getAddress($scope.landarkData.lat, $scope.landarkData.lng);
		});

	};

	$timeout( function(){ $scope.callAtTimeout(); }, 1000);

	function renderMap(data) {
		$scope.oLiveData.lat = data.latitude;
		$scope.oLiveData.lng = data.longitude;
		$scope.oLiveData.address = data.formattedAddress;
		$scope.oLiveData.current_location = data;
		$scope.selectedData = data;
		map.setView([data.latitude, data.longitude], 17);

		//var reg = ($scope.dataGeoCreate && $scope.dataGeoCreate.reg_no)?$scope.dataGeoCreate.reg_no:undefined
		var title = "";
		if (marker !== undefined) {
			drawnItems.removeLayer(marker);
		}
		marker = L.marker([data.latitude, data.longitude]).bindTooltip(title,{permanent:false,direction:'top'}).openTooltip();
		drawnItems.addLayer(marker);
	}

	function mapMyIndiaResponse(responseData) {
		var result = [];
		if(responseData && responseData.results && responseData.results.length>0){
			for(var i=0; i<responseData.results.length;i++){
				responseData.results[i].display_name = responseData.results[i].formatted_address;
				if(responseData.results[i].lat){
					responseData.results[i].lat = parseFloat(responseData.results[i].lat);
				}
				if(responseData.results[i].lng){
					responseData.results[i].lon = parseFloat(responseData.results[i].lng);
				}
				result.push(responseData.results[i])
			}
		}
		return result;
	}

	$scope.getCityByPlaceId = function(query) {
		if (query && query.toString().length > 2) {
			var oUrl = $scope.aLocationUrl[2];
			var locationUrl = oUrl.url+query;
			$http({
				method: "POST",
				url: locationUrl
			}).then(function (response) {
				if(oUrl.type==="mapMyIndiaGeoCode"){
					var res = mapMyIndiaResponse(response.data);
					if(res[0] && res[0].lat && res[0].lon){
						renderMap(res[0])
					}
				}
			}, function (response) {

			});
		}
	};

	$scope.cities = function(query) {
		if (query && query.toString().length > 2) {
			var oUrl = $scope.aLocationUrl[1];
			var q = {
				location: map.getCenter().lat+","+map.getCenter().lng,
				zoom: map.getZoom(),
				query: query
			};
			var locationUrl = oUrl.url+otherUtils.prepareQeury(q);
			return  $http({
				method: "get",
				url: locationUrl
			}).then(function (response) {
				if(oUrl.type==="mapMyIndiaGeoCode"){
					$scope.aLocations = mapMyIndiaResponse(response.data);
					return limitToFilter($scope.aLocations);
				}else {
					$scope.aLocations = response.data.suggestedLocations;
					return $scope.aLocations.map(function (suggestion) {
						suggestion.formattedAddress = suggestion.placeName+((suggestion.placeAddress && suggestion.placeAddress!="")?', '+suggestion.placeAddress:'');
						return suggestion;
					});
				}
				//return limitToFilter(response.data, 15);
			});
		} else if (query === '') {
			$scope.aLocations = [];
		}
	};

	$scope.getAddress = function(lat,lng,draw){
		if(!lat || !lng){
			return;
		}
		$scope.oLiveData.lat = lat;
		$scope.oLiveData.lng = lng;
		var url = "http://13.229.178.235:4242/reverse?lat="+lat+"&lon="+lng;
		$http({
			method: "get",
			url: url
		}).then(function (response) {
			$scope.oLiveData.address = response.data.display_name;
			if(draw){
				renderMap({latitude:lat,longitude:lng});
			}
			//return limitToFilter(response.data, 15);
		});
	};

	$scope.onSelect = function($item, $model, $label) {
		if($item.latitude && $item.longitude){
			renderMap($item)
		}

	};

	// Delete Add New Live Track Location

	$scope.deleteLiveTrackClicked = function(){
		swal({
			title: "Confirm delete ?",
			text: "Vehicle "+$scope.liveData.vehicle_number+" live track location will be removed.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#F44336",
			confirmButtonText: "Delete",
			closeOnConfirm: true
		}, function(){
			function successDeleteLiveTrack(response){
				if (response){
					if (response.message) {
						growlService.growl(response.message, "success", 2);
					}
					$scope.getAllBranches(false);
				}
			}
			function failureDeleteLiveTrack(response){
				if (response.message){
					growlService.growl(response.message, "danger",2);
				}
			}
			Vehicle.deleteLiveTrack($scope.liveData,
				$scope.liveData, successDeleteLiveTrack, failureDeleteLiveTrack);
		});
	};


	// call submit data function for create new landmark
	$scope.addNewLocationData = function(formnameNL,value) {

		if(!value) {
			if(formnameNL.$valid) {
				if($rootScope.selectedVehicleData && $rootScope.selectedVehicleData.vehicle_reg_no) {
						$scope.oLiveData.vehicle_number = $rootScope.selectedVehicleData.vehicle_reg_no;
					if($rootScope.selectedTripData){
						$scope.oLiveData.trip = $rootScope.selectedTripData.manualTracking ? ($rootScope.selectedTripData.vehicle && $rootScope.selectedTripData.vehicle.trip._id) : $rootScope.selectedTripData._id;
					}

					let request = {
						"vehicle_number": $scope.oLiveData.vehicle_number,
						"trip": $scope.oLiveData.trip,
						"current_location": $scope.oLiveData.current_location,
						"address":$scope.oLiveData.address,
						"lat":$scope.oLiveData.lat,
						"lng":$scope.oLiveData.lng,
						"status": $scope.oLiveData.status,
						"speed": $scope.oLiveData.speed,
						"duration": $scope.oLiveData.duration,
						"remarks":$scope.oLiveData.remarks,
						"datetime": $scope.oLiveData.datetime,
					};

					Vehicle.saveLiveTrackData(request, succSave, failSave);
				}else {
					alert("Vehicle no. not provided");
				}

			} else {
				return swal("Error!", 'All fields are requied.', "Fail");
			}
		} else {
			if(formnameNL.$valid) {
				if($rootScope.aSelectedVehicle && $rootScope.aSelectedVehicle.vehicle_reg_no) {
						$scope.oLiveData.vehicle_number = $rootScope.aSelectedVehicle.vehicle_reg_no;
					if($rootScope.aSelectedVehicle.trip){
						$scope.oLiveData.trip = $rootScope.aSelectedVehicle.trip._id;
					}
					let request = {
						"vehicle_number": $scope.oLiveData.vehicle_number,
						"trip": $scope.oLiveData.trip,
						"current_location": $scope.oLiveData.current_location,
						"address":$scope.oLiveData.address,
						"remarks":$scope.oLiveData.remarks,
						"datetime": $scope.oLiveData.datetime,
						"reportingdate": $scope.oLiveData.reportingdatetime
					};
					if($scope.oLiveData.remarks === 'Other')
					request.remarks = $scope.oLiveData.otherremarks;

					Vehicle.saveLiveTrackData(request, succSave, failSave);
				}else {
					alert("Vehicle no. not provided");
				}

			} else {
				return swal("Error!", 'All fields are requied.', "Fail");
			}
		}




		function succSave(res) {
			if (res.data.status === 'OK') {
				//$state.reload('masters.liveTrackPage');
				if(res.data.types == 'success')
				{
					swal("Done!", res.data.message, "success");
				}
				else
				{
					swal("Oops!", res.data.message, "error");
				}
				//swal("Oops!", data.message, "error")
				$uibModalInstance.close(res);

			} else {
				swal("Oops!", res.data.message, "error");
				//swal("Error!", res.data.message, "Fail");
				$uibModalInstance.close();
			}
		}

		function failSave(res) {
			swal("Oops!", res.data.message, "error");
			$uibModalInstance.close();
		}
	};





});

function associateSegmentPopupCtrl(

	$scope,
	$uibModalInstance,
	oVehicle,
	Vehicle
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.getVehicle = getVehicle;
	vm.onSelect = onSelect;
	vm.removeVehicleOfThisSegment = removeVehicleOfThisSegment;
	vm.submit = submit;

	//init
	(function init() {
		vm.aVehicle = [];
		vm.oVehicle = oVehicle;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss($scope.oVehicle);
	}

	function getVehicle(viewValue) {

		if(viewValue.length < 3)
			return;

		return new Promise(function (resolve, reject) {
			Vehicle.getName(viewValue, function success(res) {
				resolve(res.data.data);
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function onSelect($item, $model) {
		vm.vehicle = '';
		if(vm.segment_type && $item.segment_type === vm.segment_type){
			swal('Warning',`Selected vehicle is already of ${vm.segment_type} segment`,'warning');
			return;
		}else if(vm.aVehicle.find(o => o._id === $model._id)){
			swal('Warning',`Vehicle Already Selected`,'warning');
			return;
		}
		vm.aVehicle.push($model);
	}

	function removeVehicleOfThisSegment(segment) {
		vm.aVehicle = vm.aVehicle.filter(o => o.segment_type !== segment);
	}

	function submit(formData) {

		if(!vm.aVehicle.length){
			swal('Error','No Vehicle selected','error');
			return;
		}

		if(formData.$valid){

			const oReq = {
				aVehicle: vm.aVehicle,
				segment_type: vm.segment_type
			};

			Vehicle.associateSegment(oReq, successCallback, failureCallback);

			function successCallback(res) {
				$scope.oVehicle = res.data.data;
				swal('',res.data.message,'success');
			}

			function failureCallback(res) {
				swal('Error',res.data.message,'error');
			}

		}else{
			swal('','All Mandatory Field arr not Filled','error');
		}
	}
}

function updateStatusPopupCtrl(

	$scope,
	$uibModalInstance,
	oVehicle,
	Vehicle
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;

	//init
	(function init() {
		vm.oVehicle = oVehicle;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss(vm.oVehicle);
	}

	function submit(formData) {


		if(formData.$valid){

			const oReq = {
				...vm.oVehicle
			};
			oReq.status = vm.status;
			oReq.remark = vm.remark;

			Vehicle.updateVehicle(oReq, successCallback, failureCallback);

			function successCallback(res) {
				vm.oVehicle = res.data.data;
				swal('',res.data.message,'success');
				$uibModalInstance.dismiss(vm.oVehicle);
			}

			function failureCallback(res) {
				swal('Error',res.data.message,'error');
			}

		}else{
			swal('','All Mandatory Field arr not Filled','error');
		}
	}
}

// Fleet Segment

function fleetSegmentPopupCtrl(

	$scope,
	$uibModalInstance,
	oVehicle,
	Vehicle,
	FleetService
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.getVehicle = getVehicle;
	vm.getFleet 	= getFleet;
	vm.onSelect = onSelect;
	vm.removeVehicleOfThisSegment = removeVehicleOfThisSegment;
	vm.submit = submit;

	//init
	(function init() {
		vm.aVehicle = [];
		vm.oVehicle = oVehicle;
	})();

	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss($scope.oVehicle);
	}

	// Added by harikesh - dated: 08/11/2019
	function getFleet(viewValue) {

		if(viewValue.length < 3)
			return;

		return new Promise(function (resolve, reject) {
			FleetService.getName(viewValue, function success(res) {
				resolve(res.data.data);
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}
	//end

	function getVehicle(viewValue) {

		if(viewValue.length < 3)
			return;

		return new Promise(function (resolve, reject) {
			Vehicle.getName(viewValue, function success(res) {
				resolve(res.data.data);
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function onSelect($item, $model) {
		vm.vehicle = '';
		if(vm.segment_type && $item.segment_type === vm.segment_type){
			swal('Warning',`Selected vehicle is already of ${vm.segment_type} segment`,'warning');
			return;
		}else if(vm.aVehicle.find(o => o._id === $model._id)){
			swal('Warning',`Vehicle Already Selected`,'warning');
			return;
		}
		vm.aVehicle.push($model);
	}

	function removeVehicleOfThisSegment(segment) {
		vm.aVehicle = vm.aVehicle.filter(o => o.segment_type !== segment);
	}

	function submit(formData) {

		if(!vm.aVehicle.length){
			swal('Error','No Vehicle selected','error');
			return;
		}


		if(formData.$valid){

			const oReq = {
				aVehicle: vm.aVehicle,
				fleetName: vm.name.name,
				fleetId: vm.name._id
			};

			FleetService.fleetSegment(oReq, successCallback, failureCallback);

			function successCallback(res) {
				$scope.oVehicle = res.data.data;
				swal('',res.data.message,'success');
			}

			function failureCallback(res) {
				swal('Error',res.data.message,'error');
			}

		}else{
			swal('','All Mandatory Field arr not Filled','error');
		}
	}
}

//sold vehicle
function soldVehicleCtrl (
	$scope,
	$uibModalInstance,
	oVehicle,
	Vehicle
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.getVehicle = getVehicle;
	vm.submit = submit;

	(
		function init () {
			vm.oVehicle = oVehicle;
			if(vm.oVehicle.status === 'Sold')
				vm.oVehicle.soldVendor_name = vm.oVehicle.soldVendor_name || vm.oVehicle.vendor_name;
			vm.vehicle = oVehicle;
		}
	)();

	// Actual Functions
	function closeModal() {
		$uibModalInstance.dismiss($scope.oVehicle);
	}

	function getVehicle(viewValue) {

		if(viewValue.length < 3)
			return;

		return new Promise(function (resolve, reject) {
			Vehicle.getName(viewValue, function success(res) {
				resolve(res.data.data);
			},function (err) {
				console.log(err);
				reject([]);
			});
		});
	}

	function submit(formData) {
		if(formData.$valid) {
			const  oReq = {
				_id: vm.vehicle._id,
				status : 'Sold',
				ownershipType: 'Sold',
				soldVendor_name : vm.oVehicle.soldVendor_name,
				vendor_address :vm.oVehicle.vendor_address,
				vendor_phno :vm.oVehicle.vendor_phno,
				vendor_panNo :vm.oVehicle.vendor_panNo,
				sd : moment(vm.oVehicle.sd, 'DD/MM/YYYY').startOf('day').toISOString(),
				sa : vm.oVehicle.sa
			};
			let start = moment(vm.oVehicle.manufactureDate || vm.oVehicle.created_at || vm.oVehicle.uploaded_at);
			let end = moment(oReq.sd);
			let days = end.diff(start,'days');
			console.log(days);
			if(end.diff(start,'days') < 0) {
				return swal('Error','You can not sell before registration date','error');
			}

			Vehicle.updateRegVehicle(oReq, successCallback, failureCallback);

			function successCallback(res) {
				$scope.oVehicle = res.data.data;
				swal('',res.data.message,'success');
				$uibModalInstance.dismiss($scope.oVehicle);
			}

			function failureCallback(res) {
				swal('Error',res.data.message,'error');
			}
		}else{
			swal('','All Mandatory Field are not Filled','error');
		}
	}

}

