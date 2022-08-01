materialAdmin
	.controller("vehicleAccidentListController", vehicleAccidentListController);

vehicleAccidentListController.$inject = [
	'$scope',
	'accountingService',
	'lazyLoadFactory',
	'stateDataRetain',
	'branchService',
	'Vehicle',
	'$state',
	'$uibModal',
	'growlService'
];


function vehicleAccidentListController(
	$scope,
	accountingService,
	lazyLoadFactory,
	stateDataRetain,
	branchService,
	Vehicle,
	$state,
	$uibModal,
	growlService
) {

	// functions Identifiers
	$scope.upsertVehAccident = upsertVehAccident;
	$scope.deleteVehAccident = deleteVehAccident;
	$scope.getAllVehicle = getAllVehicle;
	$scope.getVehAccident = getVehAccident;
	$scope.accountMaster = accountMaster;
	$scope.getAllBranch = getAllBranch;
	$scope.uploadDocs = uploadDocs;
	$scope.previewBuilty = previewBuilty;
	$scope.onStateRefresh = function () {
		getVehAccident();
	};

	// INIT functions
	(function init() {
		$scope.oFilter = {}; // initialize filter object
		$scope.maxDate = new Date();
		$scope.duesVehicleId;
		$scope.myFilter = {};
		$scope.lazyLoad = lazyLoadFactory();
		$scope.selectType = 'index';
		$scope.dateType = [
			{
				key: "Dues Entry",
				value: "created_at"
			}
		];
		$scope.columnSetting = {
			allowedColumn: [
				'Vehicle',
				'Date Of Accident',
				'Place',
				'Police FIR',
				'Spot Survey Name',
				'Spot Survey No',
				'EST Cost',
				'Workshop Name',
				'Created By',
				'Created At'
			]
		};
		$scope.tableHead = [
			{
				'header': 'Vehicle',
				'bindingKeys': 'vehicle && vehicle[0] && vehicle[0].aVehCollection && vehicle[0].aVehCollection[0] && vehicle[0].aVehCollection[0].veh_no'
			},
			{
				'header': 'Date Of Accident',
				'bindingKeys': 'date',
				'date': 'dd-MMM-yyyy'
			},
			{
				'header': 'Place',
				'bindingKeys': 'place'
			},
			{
				'header': 'Police FIR',
				'bindingKeys': 'policeFIR',
				'date': false,
			},
			{
				'header': 'Spot Survey Name',
				'bindingKeys': 'spotSrvyName',
			},
			{
				'header': 'Spot Survey No',
				'bindingKeys': 'spotSrvyNo',
			},
			{
				'header': 'EST Cost',
				'bindingKeys': 'estCost'
			},
			{
				'header': 'Workshop Name',
				'bindingKeys': 'workshopName'
			},
			{
				'header': 'Created By',
				'bindingKeys': 'created_by_name'
			},
			{
				'header': 'Created At',
				'bindingKeys': 'created_at'
			},

		];
	})();

	// Actual Functions
	function upsertVehAccident(type = 'add') {
		if (type == 'add') {
			$state.go('booking_manage.vehicleAccident', {
				data: {
					type
				}
			});
		} else if (type == 'edit') {
			if (Array.isArray($scope.aSelectedVehAccident)) {
				if ($scope.aSelectedVehAccident.length !== 1)
					return swal('Warning', 'Please Select Single Vehicle', 'warning');
			} else if (!($scope.aSelectedVehAccident))
				return swal('Warning', 'Please Select Single Vehicle', 'warning');

			let selectedVehAcc = Array.isArray($scope.aSelectedVehAccident) ? $scope.aSelectedVehAccident[0] : $scope.aSelectedVehAccident;
			$state.go('booking_manage.vehicleAccident', {
				id: selectedVehAcc._id
			});
		}
	}


	$scope.onSelectVehicle = function (item) {
		// $scope.oAccident = item;
		accountingService.getDues({ veh: item._id }, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				console.log(response.data);
				$scope.duesVehicleId = response.data && response.data.data && response.data.data[0] && response.data.data[0]._id;
				console.log('duesVehicleId', $scope.duesVehicleId);
			}
		}
	}

	// Get vehicle accident from backend
	function getVehAccident(isGetActive) {
		if (!$scope.lazyLoad.update(isGetActive))
			return;


		var oFilter = prepareFilterObject();
		Vehicle.vehAccidentGet(oFilter, onSuccess, err => {
			console.log(err);
		});
		// accountingService.getDues(oFilter, onSuccess, err => {
		// 	console.log(err)
		// });

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
				$scope.aSelectedVehAccident = response && response.data[0];
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);
			}
		}
	}
	$scope.downloadVehAccident = function (download) {

		if (!($scope.oFilter.from && $scope.oFilter.to)) {
			return swal('warning', "Both From and To Date should be Filled", 'warning');
		}

		var oFilter = prepareFilterObject(download);
		Vehicle.vehAccidentGet(oFilter, onSuccess, err => {
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

	function prepareFilterObject(download) {
		var filter = {};
		if ($scope.oFilter.from) {
			filter.from = moment($scope.oFilter.from, 'DD/MM/YYYY').startOf('day').toISOString();
		}
		if ($scope.oFilter.to) {
			filter.to = moment($scope.oFilter.to, 'DD/MM/YYYY').endOf('day').toISOString();
		}


		if ($scope.oFilter.vehicle) {
			filter.vehicle = $scope.oFilter.duesVehicleId = $scope.duesVehicleId;
		}

		if (download) {
			filter.download = true;
			filter.no_of_docs = 10000;
		} else {
			filter.skip = $scope.lazyLoad.getCurrentPage();
			filter.no_of_docs = 30;
		}
		return filter;
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

	function uploadDocs() {

		if (!$scope.aSelectedVehAccident) {
			return swal('Warning', 'Please Select Single Vehicle', 'warning');
		}
		const aAllowedFiles = ['Accident Photos', 'Under Repair', 'Re-Inspection'];
		const modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'myUploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'accident',
					scopeModel: $scope.aSelectedVehAccident,
					scopeModelId: $scope.aSelectedVehAccident._id,
					uploadText: "Upload Vehicle Accident Documents",
					aAllowedFiles: aAllowedFiles,
					uploadFunction: Vehicle.uploadDocs
				}
			}
		});
		modalInstance.result.then(function (data) {
			$state.reload();
		}, function (data) {
			$state.reload();
		});
	}

	function previewBuilty() {
		if (!$scope.aSelectedVehAccident) {
			return swal('Warning', 'Please Select Single Vehicle', 'warning');
		}
		var va = $scope.aSelectedVehAccident;
		// va = vehicle Accident
		if (!Array.isArray(va.documents) || va.documents.length < 1) {
			growlService.growl("No documents to preview", "warning");
			return;
		}
		var documents = va.documents.map(curr => ({
			...curr,
			url: `${URL.BASE_URL}documents/view/${curr.docReference}`
		}));
		var modalInstance = $uibModal.open({
			templateUrl: 'views/carouselPopup.html',
			controller: 'carouselCtrl',
			resolve: {
				documents: function () {
					return documents;
				}
			}
		});
	};

	function deleteVehAccident() {
		if (!$scope.aSelectedVehAccident) {
			return swal('Warning', 'Please Select Single Vehicle', 'warning');
		}
		swal({
			title: 'Are you sure you want to delete this Entry?',
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
					Vehicle.deleteVehAccident({
						_id: $scope.aSelectedVehAccident._id
					}, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', res.data.message, 'success');
						getVehAccident();
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

materialAdmin.controller("myUploadFilesPopUpCtrl", function ($rootScope, $scope, URL, oUploadData, $uibModalInstance, Vehicle, dmsService) {
	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.putDocInListView = putDocInListView;
	$scope.initiateUpload = initiateUpload;
	$scope.getAllDocs = getAllDocs;
	$scope.selectCat = selectCat;
	$scope.hideSelect = false;
	(function init() {
		console.log('oUploadData', oUploadData);
		$scope.oUploadData = angular.copy(oUploadData);
		$scope.modelName = $scope.oUploadData.modelName;
		$scope.category = $scope.$configs.Doc[$scope.modelName];
		// $scope.category = {
		// 	accident: { ext: ["image/*", "application/pdf"], max: 5, name: 'Accident Photos', size: 3030 },
		// 	repair: { ext: ["image/*", "application/pdf"], max: 6, name: 'Under Repair', size: 4030 },
		// 	inspection: { ext: ["image/*", "application/pdf"], max: 6, name: 'Re-Inspection', size: 4030 },
		// };
		console.log('$scope.category', $scope.category);
		$scope.docData = [];
		$scope.oDoc = [];
		$scope.aFiles = [];
		$scope.aCompressFile = [];
		getAllDocs();
	})();

	function selectCat(key) {
		key = key.subName;
		if ($scope.category[key]) {
			$scope.keyData = $scope.category[key];
		}
		if ($scope.oDoc && $scope.oDoc[key]) {
			$scope.limit = $scope.keyData.max - $scope.oDoc[key].length;
		} else {
			$scope.limit = $scope.keyData.max;
		}
		$scope.aFiles = [];
		$scope.aCompressFile = [];
	}

	function getAllDocs() {
		let req = {
			_id: $scope.oUploadData.scopeModelId,
			modelName: $scope.modelName
		};
		console.log('req', req);
		dmsService.getAllDocs(req, success, failure);

		function success(res) {
			if (res && res.data) {
				$scope.docData = res.data;
			}
			prepareData();
		}

		function failure(res) {
			var msg = res.data.message;

		}
	}

	function prepareData() {
		// if user has already upload the image
		let mergeData = {};
		$scope.docData.files && $scope.docData.files.forEach(obj => {
			mergeData[obj.category] = mergeData[obj.category] || [];
			mergeData[obj.category].push(obj);
		});
		$scope.oDoc = mergeData;
		console.log('prerae data fun $scope.oDoc', $scope.oDoc);
		putDocInListView();
		initiateUpload();
	}

	function putDocInListView() {
		let oDoc;
		let notDefCounter = 1;
		let aDoc = [];
		for (let [key, value] of Object.entries($scope.category)) {
			if (key != "misc") {
				let aFiles = Array.isArray($scope.oDoc[key])
					? $scope.oDoc[key]
					: typeof $scope.oDoc[key] === "string"
						? [$scope.oDoc[key]]
						: [];
				let opr = (aFiles.length && "unshift") || "push";
				aDoc[opr]({
					category:
						($scope.category[key] &&
							`${$scope.category[key].name} (${(Array.isArray(aFiles) &&
								aFiles.length) ||
							0})`) ||
						`ND${notDefCounter++}`,
					files: aFiles.map(obj => ({ uri: `${URL.file_server}${obj.name}` }))
				});
			}
		}

		if ($scope.category.misc) {
			let aMiscFile = Array.isArray($scope.oDoc.misc)
				? $scope.oDoc.misc
				: typeof $scope.oDoc.misc === "string"
					? [$scope.oDoc.misc]
					: [];
			aDoc[(aMiscFile.length && "unshift") || "push"]({
				category:
					`${$scope.category.misc.name} (${aMiscFile.length || 0})` ||
					`ND${notDefCounter++}`,
				files: aMiscFile.map(obj => ({
					uri: `${URL.file_server}${obj.name}`
				}))
			});
		}
		$scope.aDoc = aDoc;

		// $scope.aDoc = [
		// 	{ $$hashKey: "object:5392", category: "Misc (1)" },
		// 	{ $$hashKey: "object:5393",category: "Loading Slip/Chalan (0)" },
		// 	{ $$hashKey: "object:5394", category: "Permit (0)" },
		// ];
		console.log('$scope.aDoc-->', $scope.aDoc);
	}

	function initiateUpload() {
		let uploadDocOpt = [];

		for (let [key, value] of Object.entries($scope.category))
			if (!$scope.oDoc[key] ? true : $scope.oDoc[key].length < value.max)
				uploadDocOpt.push({ name: value.name, subName: key });

		if (!uploadDocOpt.length) return alert("File upload Max limit reached");
		$scope.uploadDocOpt = uploadDocOpt;
	}

	$scope.compressFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if ($scope.limit > 0) {
			$scope.count = $scope.limit;
			if (files.length > $scope.limit) {
				for (let i = 0; i < $scope.limit; i++) {
					$scope.aCompressFile.push({ name: $scope.fileName.subName, fileValue: files[i] });
					$scope.count--;
				}
			} else {
				for (let i = 0; i < files.length; i++) {
					$scope.aCompressFile.push({ name: $scope.fileName.subName, fileValue: files[i] });
					$scope.count--;
				}
			}
			$scope.limit = $scope.count;
		} else {
			swal('Warning', 'upload limit exceeded', 'warning');
		}
		if ($scope.aCompressFile && $scope.aCompressFile.length) {
			var fd = new FormData();
			$scope.aCompressFile.forEach(obj => {
				fd.append('uploadfile', obj.fileValue);
			});
			fd.append(`bodyKey`, $scope.fileName.subName);
			fd.append(`modelName`, $scope.modelName);
			var data = {};
			data.formData = fd;
			data.fileUpload = true;
			data._id = angular.copy($scope.oUploadData.scopeModelId);
			data.modelName = angular.copy(oUploadData.modelName);
			dmsService.validateFile(data, success, failure);

			function success(res) {
				if (res && res.data && res.data) {
					res = res.data;
					res.forEach(obj => {
						if (obj.fileStatus === 'Error') {
							$scope.aCompressFile.forEach(aCom => {
								if (aCom.fileValue.name === obj.name) {
									aCom.fileStatus = obj.fileStatus;
									aCom.fileError = obj.fileError;
								}
							});
						}
					})
				} else {
					var msg = res.data.message;
					swal("Error", msg, "error");
				}
			}

			function failure(res) {
				var msg = res.data.message;
				swal("Error", msg, "error");
			}

		}
	};

	$scope.pushFileToUpload = function () {
		if ($scope.aCompressFile && $scope.aCompressFile.length) {
			$scope.aCompressFile.forEach(obj => {
				if (obj.fileStatus != 'Error')
					$scope.aFiles.push({ name: $scope.fileName.subName, fileValue: obj.fileValue });
			});
		}
		// $scope.fileName = undefined;
		$scope.toGRUpl = undefined;
		$scope.aCompressFile = [];
		// $scope.limit = 0;
	};
	$scope.popFileFromUpload = function (i) {
		$scope.aFiles.splice(i, 1);
		$scope.limit++;
	};

	$scope.getVname = function (viewValue) {

		return new Promise(function (resolve, reject) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
				resolve(response.data.data);
			}

			function oFail(response) {
				reject([]);
				console.log(response);
			}

			Vehicle.getNameTrim(viewValue, oSuc, oFail);
		});
	};

	$scope.onSelect = function (item) {
		$scope.oUploadData.scopeModelId = item._id;
	};

	$scope.saveClick = function () {
		function success(res) {
			if (res && res.status === 'Success') {
				swal('', res.message, 'success');
				$scope.docData = [];
				$scope.oDoc = [];
				$scope.aFiles = [];
				$scope.aCompressFile = [];
				getAllDocs();
			} else {
				var msg = res.data.message;
				swal("Error", msg, "error");
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			var msg = res.data.message;
			swal("Error", msg, "error");
			$uibModalInstance.dismiss(res);
			//growlService.growl(msg, "danger", 2);
		}

		if ($scope.aFiles.length > 0) {
			var fd = new FormData();
			for (var u = 0; u < $scope.aFiles.length; u++) {
				fd.append('uploadfile', $scope.aFiles[u].fileValue);
			}
			fd.append(`bodyKey`, $scope.fileName.subName);
			fd.append(`modelName`, $scope.modelName);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = angular.copy($scope.oUploadData.scopeModelId);
			data.modelName = angular.copy(oUploadData.modelName);
			dmsService.uploadFile(data, success, failure);
		} else {
			swal("warning", "Please select file first!", "warning");
			//$uibModalInstance.close(res);
		}
	}

});



