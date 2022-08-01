materialAdmin.controller("driverCommonController", driverCommonController);
driverCommonController.$inject = [
	'$scope',
	'$state',
	'$rootScope',
	'$stateParams',
	'$uibModal',
	'objToCsv',
	'accountingService',
	'Vehicle',
	'stateDataRetain',
	'dmsService',
	'DatePicker',
	'Driver',
	'URL',
	'growlService'
];

function driverCommonController(
	$scope,
	$state,
	$rootScope,
	$stateParams,
	$uibModal,
	objToCsv,
	accountingService,
	Vehicle,
	stateDataRetain,
	dmsService,
	DatePicker,
	Driver,
	URL,
	growlService
) {

	$("p").text("Driver");
	$rootScope.wantThis = false;
	$rootScope.wantReg = false;
	$scope.DatePicker = angular.copy(DatePicker);
	$scope.filterObj = {};
	$scope.status = ['Enable', 'Disable'];
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.items_per_page = 10;
	$scope.dateChange = dateChange;
	$scope.clearSearch = clearSearch;
	$scope.setMode = setMode;
	$scope.getDriver = getDriver;
	$scope.getVname = getVname;
	$scope.uploadFiless = uploadFiless;
	$scope.uploadDocs = uploadDocs;
	$scope.previewDocs = previewDocs;
	$scope.driverPreview = driverPreview;
	$scope.driverAggrement = driverAggrement;
	$scope.driverStatus = driverStatus;
	$scope.addHappayAccount = addHappayAccount;
	$scope.uploadReport = uploadReport;
	$scope.onSelect = onSelect;
	$scope.copyAddress = copyAddress;
	$scope.getAccount = getAccount;
	$scope.addNewAccount = addNewAccount;
	$scope.onDelinkAccount = onDelinkAccount;
	$scope.getAllDriverData = getAllDriverData;
	$scope.downloadReport = downloadReport;
	// $scope.downloadCsv = downloadCsv;
	$scope.saveDriverDetails = saveDriverDetails;


	//init
	(function init() {
	$scope.tabs = [
		{title: 'Info', content: './../../views/myDrivers/driverProfile.html'},
		{title: 'Profile', content: './../../views/myDrivers/editProfile.html'},
		{title: 'Driving', content: './../../views/myDrivers/editDriving.html'},
		{title: 'Address', content: './../../views/myDrivers/editAddress.html'},
		{title: 'References', content: './../../views/myDrivers/editReferences.html'},
		{title: 'Guarantor', content: './../../views/myDrivers/editGuarantor.html'}
	];
	$scope.dupTabs = angular.copy($scope.tabs);
	})();

    $scope.pageChanged = function() {
     $scope.getAllDriverData(true);
   };

	 $scope.setAddData = function() {
		$scope.driver = {};
		if($scope.$configs.master && $scope.$configs.master.driver && $scope.$configs.master.driver.showAdharOnly){
			$scope.driver.id_proof_type="AadharCard";
		}

	};

	function setMode(mode) {
		$scope.readonly = false;
		$scope.mode = mode;
		if(mode != 'View'){
			 delete $scope.dupTabs[0];
		}else{
			$scope.dupTabs = angular.copy($scope.tabs);
		}
		if(mode === 'Add')
			$scope.setAddData();
		if(mode === 'Edit'){
			if($scope.driver && $scope.driver.account){
				$scope.readonly = true;
			}
		}


	}
	$scope.setMode("View");

	function copyAddress() {
		if($scope.driver.copyAddress){
			$scope.driver.permanent_address = 	$scope.driver.temporary_address;
		}
	}

	function addHappayAccount(){
		$uibModal.open({
			templateUrl: 'views/accounting/attachAccountPopup.html',
			controller: ['$modal', '$scope', '$uibModalInstance', 'accountingService', 'oData', attachAccountPopupCtrl],
			resolve: {
				oData: function() {
					return {
						title: 'Attach Happay Account',
						group: ['Happay'],
						history: $scope.driver.happayHistory || [],
						accountFilter: function(aAccount = []){
							return aAccount.filter( o => {
								return !($scope.driver.happayHistory || []).find(oh => {
									let id = typeof oh.happayAccount === 'object' ? oh.happayAccount._id : oh.happayAccount;
									return id === o._id;
								});
							});
						},
						callback: function (accountId) {
							Driver.driverHappayAttach({
								_id: $scope.driver._id,
								happay: accountId
							}, success, failure);

							function success(response){
								swal('Message', response.message, 'success');
							}

							function failure(response){
								swal('Message', response.message, 'failure');
							}
						}
					};
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

	function driverStatus(type){

		swal({
				title: `Are you sure you want to ${type} this Driver? `,
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
						_id:$scope.driver._id
					};
					if(type === 'Enable')
						oRequest.deleted = false;
					else if(type === 'Disable')
						oRequest.deleted = true;

					Driver.deleteStatus(oRequest, onSuccess, onFailure);

					function onFailure(err) {
						swal('Error', err.data.message, 'error');
					}

					function onSuccess(res) {
						swal('Success', 'Driver updated!!', 'success');
						$scope.getAllDriverData();
					}
				}
			});
		return;
	}

	function driverPreview() {
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function(
					$scope,
					$uibModalInstance,
					clientService,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;

					$scope.aTemplate = $scope.$configs.Bill.driverPreview;
					$scope.templateKey = $scope.aTemplate[0];

					$scope.getGR = function(templateKey = 'default_') {

						var oFilter = {
							_id: otherData._id,
							driverTemp: templateKey
						};

						clientService.driverProfilePreview(oFilter, success, fail);
					};

					$scope.getGR($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error','Something Went Wrong','error');
						$scope.closeModal();
					}

					$scope.closeModal = function() {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function() {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id){
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					return {
						_id:$scope.driver._id
					};
				}
			}
		});
	}

	function driverAggrement() {
		$uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: [
				'$scope',
				'$uibModalInstance',
				'clientService',
				'excelDownload',
				'otherData',
				function(
					$scope,
					$uibModalInstance,
					clientService,
					excelDownload,
					otherData,
				) {

					$scope.showSubmitButton = !!otherData.showSubmitButton;
					$scope.hidePrintButton = !!otherData.billPreviewBeforeGenerate;
					$scope.downloadExcel = downloadExcel;

					$scope.aTemplate = $scope.$configs.master && $scope.$configs.master.driver && $scope.$configs.master.driver.aggrePreview;
					$scope.templateKey = $scope.aTemplate[0];

					$scope.getGR = function(templateKey = 'default_') {

						var oFilter = {
							_id: otherData._id,
							driverTemp: templateKey
						};

						clientService.driverProfilePreview(oFilter, success, fail);
					};

					$scope.getGR($scope.templateKey && $scope.templateKey.key);

					function success(res) {
						$scope.html = angular.copy(res.data);
					}

					function fail(res) {
						swal('Error','Something Went Wrong','error');
						$scope.closeModal();
					}

					$scope.closeModal = function() {
						$uibModalInstance.dismiss('cancel');
					};

					$scope.submit = function() {
						$uibModalInstance.close(true);
					};

					function downloadExcel(id){
						excelDownload.html(id, 'sheet 1', `${$scope.aTemplate[0] && $scope.aTemplate[0].key || 'default'}_${moment().format('DD-MM-YYYY')}`);
					}
				}],
			resolve: {
				otherData: function () {

					return {
						_id:$scope.driver._id
					};
				}
			}
		});
	}

	function downloadReport(type) {
		var oFilter = prepareFilterObject();
		if(!$scope.$configs.driveRptFiltr){
			if(type === 'excel' && !oFilter._id && !($scope.filterObj.start_date && $scope.filterObj.end_date)){
				swal('warning', "Both From and To Date should be Filled",'warning');
				return;
			}
		}
		if(type=== 'csv')
			oFilter.downloadCSV = true;

		oFilter.download = true;
		oFilter.all = true;
		Driver.driversReport(oFilter, res => {
			var a = document.createElement('a');
			a.href = res.url;
			a.target = '_blank';
			a.download = res.url;
			a.click();
		}, err => {
			console.log(err);
			swal('Error!','Message not defined','error');
		});

	}

	function uploadReport(files, file, newFiles, duplicateFiles, invalidFiles, event) {
		if(file && event.type === "change") {
			var fd = new FormData();
			fd.append('excelFile', file);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			Driver.uploadCommon({modelName: 'Driver'}, data)
				.then(function (d) {
					swal({title:'Info', text:d.message, type:"info"});
				})
				.catch(function (err) {
					swal(err.data.status, err.data.message,'error');
				});
		}
	}

	function getAccount(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {
				let req = {
					name: viewValue,
					no_of_docs: 6,
					group: 'Driver',
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

	function addNewAccount(){
		var modalInstance = $uibModal.open({
			templateUrl: 'views/accounting/accountMasterUpsert.html',
			controller: 'accountMasterUpsertController',
			resolve: {
				'selectedAccountMaster': function () {
					return {
						'accountType' : 'Cash in Hand',
						'branch': $scope.oBranch,
						'group': ['Driver'],
						'name': $scope.driver.name + ' (' + $scope.driver.employee_code + ')',
						'ledger_name':$scope.driver.name,
						'code': $scope.driver.employee_code,
						'isAdd': true,
						'isGroupNotAllowed': true,
					};
				}
			}
		});

		modalInstance.result.then(function(response) {
			if(response)
				$scope.driver.account = response;

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
						masterSchema: 'Driver',
						masterId: $scope.driver._id,
						acntId: $scope.driver.account._id,
						wasLinkedTo: $scope.driver.name,
					}, onSuccess, onFailure);

					function onSuccess(res) {
						swal('Success', res.message, 'success');
						$scope.driver.account = undefined;
					}
					function onFailure(err) {
						swal('Error', err.message, 'error');
					}
				}
			});
	}

    function prepareFilterObject(isPagination){
       var myFilter = {
          "user_type" : "Driver"
       };
       if($scope.driver_id){
          myFilter._id = $scope.driver_id;
        }

	  if($scope.filterObj.start_date)
		  myFilter.from = $scope.filterObj.start_date;

	  if($scope.filterObj.end_date)
		  myFilter.to = $scope.filterObj.end_date;

	  if ($scope.filterObj.status) {
		  if($scope.filterObj.status === 'Enable')
			  myFilter.deleted = false;
		  else if($scope.filterObj.status === 'Disable')
			  myFilter.deleted = true;
	  }else {
		  myFilter.deleted = false;
	  }

         myFilter.skip = $scope.currentPage;
	     // myFilter.no_of_docs = $scope.items_per_page;
         /*else if($stateParams.skip){
          myFilter.skip = $stateParams.skip;
          $scope.currentPage = $stateParams.skip;
        } */
        return myFilter;
      }

    function getAllDriverData(isPagination){
    function success(data) {
  		$rootScope.drivers = data.data;
		 if(data.data && data.data.length>0){
  			$rootScope.driver = data.data[0];
        // $scope.total_pages = data.pages;
        // $scope.totalItems = 15*data.pages;
			$scope.total_pages = data.count/$scope.items_per_page;
			$scope.totalItems = data.count;
  			setTimeout(function(){
  				listItem = $($('.lv-item')[0]);
  		        	listItem.addClass('grn');
  			 }, 500);
  		 }
  	}
    var oFilter = prepareFilterObject(isPagination);
    Driver.getAllDrivers(oFilter, success);
  }
	$scope.getAllDriverData();

    function  dateChange() {
		$scope.filterObj.end_date = new Date($scope.filterObj.end_date.setHours(0,0,0)); //sets hour minutes & sec on selected date

		var month = new Date($scope.filterObj.end_date).setMonth($scope.filterObj.end_date.getMonth() - 12); // select month based on selected start date
		if(new Date(month).setHours(23,59,59) > $scope.filterObj.start_date)
		$scope.filterObj.start_date = new Date(new Date(month).setHours(23,59,59)); //sets hour minutes & sec on selected month
		$scope.min_date = new Date(new Date(month).setHours(23,59,59));
	}

   function clearSearch(){
    delete $scope.driver_id;
    $scope.getAllDriverData();
  }

	function getVname(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = prepareFilterObject(false);
				  req.name = viewValue;
				 delete  req._id;

				Driver.getAllDrivers(req, res => {
					$scope.Drivers = res.data;
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

	function getDriver(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise(function (resolve, reject) {

				let req = {license_no: viewValue};

				Driver.getAllDrivers(req, res => {
					$scope.dData = res.data;
					resolve(res.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

    function onSelect($item, $model, $label){
        $scope.currentPage = 1;
        $scope.driver_id = $item._id;
        $scope.getAllDriverData();
		$scope.setMode("View");
    }

  $scope.$watch(function() {
	    return $rootScope.driver;
	  }, function() {
	    try{
	      $scope.driver = $rootScope.driver;
	     }catch(e){
	    //console.log('catch in driverProfileController');
	    }
	  }, true);

  function suc(response){
  	$rootScope.vehicleTypes = response.data.data;
  }
  function fail(response){
  	console.log('failed',response);
  }
  //$scope.cities = dataServices.loadCities();
  $scope.selectDriver = function(driver,index){
    var sUrl = "#!/masters/driverDetails/profile";
    $rootScope.redirect(sUrl);
  	$rootScope.driver = driver;
  	listItem = $($('.lv-item')[index]);
  	listItem.siblings().removeClass('grn');
    listItem.addClass('grn');
	  $scope.setMode('View');

  };
  $scope.newDriverReg = function(){
  	$rootScope.driver = {};
  	listItem = $($('.lv-item'));
  	listItem.siblings().removeClass('grn');
  };
  $rootScope.formateDate = function(date){
  	return new Date(date);
  };

   $rootScope.UploadgetAllDriverData = function(){
    $scope.getAllDriverData();
  }

   function uploadFiless() {
		var aAllowedFiles = ['Photo','Address Proof Front Copy','Address Proof Back Copy','License Front Copy','License Back Copy','Other'];
		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve:{
				oUploadData:{
					scopeModel : $scope.driver,
					scopeModelId:$scope.driver._id,
					uploadText: "Upload Driver Documents",
					aAllowedFiles: aAllowedFiles,
					uploadFunction:Driver.updateDriver
				}
			}
		});
		modalInstance.result.then(function(data) {
			//$state.reload();
			//console.log(data);
			if(data && data.data){
				//$scope.vendor = data.data;
			}
		}, function(data) {
			if (data != 'cancel') {
				//swal("Oops!", data.data.message, "error")
			}
		});
	}

	function uploadDocs() {

		var modalInstance = $uibModal.open({
			templateUrl: 'views/uploadFiles.html',
			controller: 'uploadFilesPopUpCtrl',
			resolve: {
				oUploadData: {
					modelName: 'driver',
					scopeModel: $scope.driver,
					scopeModelId: $scope.driver._id,
					uploadText: "Upload Driver Documents",
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

	function previewDocs() {
		if(!($scope.driver && $scope.driver._id))
			return;
		$scope.getAllDocs = getAllDocs;
		let documents = [];
		(function init() {
			getAllDocs();
		})();

		function getAllDocs(){
			let req = {
				_id: $scope.driver._id,
				modelName: "driver"
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
							_id: $scope.driver._id,
							modelName: 'driver',
							url: `${URL.file_server}${doc.name}`
						});
					});
				}else{
					let name = `${key|| 'misc'}`.toUpperCase();
					documents.push({
						name,
						docName:doc.name,
						_id: $scope.driver._id,
						modelName: 'driver',
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
	}

	function saveDriverDetails(form) {

		if (!($scope.driver.name  && $scope.driver.employee_code &&  $scope.driver.license_no && $scope.driver.prim_contact_no))
			return swal('Error', `Mandatory fields Name, Code, License No, Mob. No, required`, 'error');

			if (!$scope.$configs.master.driver.idProofRequired && !( $scope.driver.id_proof_value && $scope.driver.id_proof_type) && $scope.$configs.master && $scope.$configs.master.driver && $scope.$configs.master.driver.showProof)
				return swal('Error', `Id Proof Mandatory fields required`, 'error');

			let driver_account_name = $scope.driver.name + ' (' + $scope.driver.employee_code + ')';
			if (($scope.driver.account && $scope.driver.account.name) !== driver_account_name && $scope.$configs.master && $scope.$configs.master.showAccount) {
				return swal('Error', `Please select driver account with name ${driver_account_name}.`, 'error')
			}

			if ($scope.$configs.master && $scope.$configs.master.showAccount && !($scope.driver.account))
				return swal('Error', `Account Mandatory fields required`, 'error');

			if ($scope.mode === 'Edit') {
				Driver.updateDriver($scope.driver, success, failure);
			} else if ($scope.mode === 'Add') {
				Driver.saveDriver($scope.driver, success, failure);
			}

			function success(response) {
				if (response && response.data && response.data.data) {
					$rootScope.driver = response.data.data;
					$scope.driver._id = response.data.data._id;
					swal(response.data.message, "", "success");
					$scope.getAllDriverData();
					$scope.setMode("View");

					// stateDataRetain.go('masters.driverDetails');
				}
			}

			function failure(response) {
				swal("error", response.data.message, "error");
			}


	}

}

materialAdmin.controller("driverProfileCtrl", function($rootScope, $scope, Driver) {
  $("p").text("Driver");
  $rootScope.wantThis = false;
  $rootScope.wantReg = false;
  $scope.$watch(function() {
     return $rootScope.driver;
    }, function() {
     try{
        $scope.driver = $rootScope.driver;
      }catch(e){
     }
   }, true);
});

materialAdmin.controller("registerDriverController", function($modal,$uibModal, $stateParams, $rootScope, $scope, accountingService, Driver,formValidationgrowlService, stateDataRetain, $timeout) {
  $rootScope.wantThis = true;
  $rootScope.wantReg = true;
  $scope.regDriverNew = {};
  $scope.regDriverNew.account ={};
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
  //*************** New Date Picker for multiple date selection in single form ************
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

  //************* New Date Picker for multiple date selection in single form ******************

  function successPost(response){
    $scope.regDriverNew = {};
    $scope.DriverReg.$dirty = false;
    if(response && response.data && (response.data.status=="OK") && response.data.data){
      $rootScope.drivers.push(response.data.data);
      $rootScope.driver = response.data.data;
      swal("Driver Registered Successfully","","success");
      var sUrl = "#!/masters/driverDetails/profile";
      $rootScope.redirect(sUrl);
    }else if(response && response.data && (response.data.status=="ERROR")){
      swal("Driver Registration failed",response.data.message,"error");
    }

    // var sUrl = "main.html#!/driverRegistration/Profile";
    // var newdrimsg = "New Driver is registered" ;
  //  messageService.setMessage(response.data.status, newdrimsg, sUrl);
  }
  function failure(res){
  	swal(res.data.message,"","error");
  	$scope.disableSubmit = false;
    // console.log("fail: ",res);
  }

  $scope.saveDriverDetails = function(form) {

	  $scope.disableSubmit = true;

    $scope.dmsg = '';
    //$scope.driver.license_no = $scope.driver.license_no.replace(/ +/g, "");
    //form.$valid
    if(true){
        /*if($scope.createDrivererrormsg){
            $scope.$apply(function() {
              $scope.createDrivererrormsg = false;
            });
          }*/
        if(!$scope.regDriverNew.employee_code)
			return swal('Warning', 'All Mandatory Field not filled', 'warning');

      Driver.saveDriver($scope.regDriverNew, successPost,failure);
    } /*else {
              $scope.dmsg = '';
              $scope.createDrivererrormsg = true;
              $scope.dmsg = formValidationgrowlService.findError(form.$error);
              setTimeout(function(){
                if($scope.createDrivererrormsg){
                  $scope.$apply(function() {
                    $scope.createDrivererrormsg = false;
                  });
                }
            }, 7000);
      }*/
  }
	try{
		if($scope.$configs.master.showAccount){

			$scope.onSelectAccount = onSelectAccount;
			// Get Account Masters
			($scope.getAccountMasters = function getAccountMasters(inputModel){

				var oFilter = {
					// all: true
					// onlyUnlinked: true,
					no_of_docs: 10,
					group: 'Driver',
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
					$scope.aAccountMaster = response.data.data;
					if($scope.regDriverNew.account && $scope.regDriverNew.account._id && !$scope.aAccountMaster.find( o => o._id === $scope.regDriverNew.account._id))
						$scope.aAccountMaster.unshift($scope.regDriverNew.account);
				}
			})();

			function onSelectAccount() {
				// if(vm.oVehicle.account === "addNewAccount"){
				$scope.regDriverNew.account = {};
				var modalInstance = $uibModal.open({
					templateUrl: 'views/accounting/accountMasterUpsert.html',
					controller: 'accountMasterUpsertController',
					resolve: {
						'selectedAccountMaster': function () {
							return {
								'accountType' : 'Cash in Hand',
								'branch': $scope.oBranch,
								'group': 'Driver',
								'name': $scope.regDriverNew.name,
								'ledger_name':$scope.regDriverNew.name,
								'isAdd': true,
								'isGroupNotAllowed': true,
							};
						}
					}
				});

				modalInstance.result.then(function(response) {
					if(response){
						$scope.aAccountMaster.push(response);
						$scope.regDriverNew.account = response;
					}

					console.log('close',response);
				}, function(data) {
					console.log('cancel');
				});
			}
		}
	}catch(e){}
});

materialAdmin.controller("editDriverController", function($modal, $rootScope, $stateParams, $scope, accountingService, Driver, formValidationgrowlService, stateDataRetain) {
    $("p").text("Driver");
    $rootScope.wantThis = true;
    $rootScope.wantReg = false;

	if ($stateParams.data) {
		$scope.driver = $stateParams.data;
		$scope.mode = $stateParams.mode;

	} else {
		$scope.driver = {};
		$scope.mode = $stateParams.mode;
	}

    // $scope.$watch(function() {
    //       return $rootScope.driver;
    //      }, function() {
    //       try{
    //           $scope.driver = $rootScope.driver;
    //        }catch(e){
    //       //console.log('catch in truckIdentificationController');
    //       }
    //      }, true);

    //*************** New Date Picker for multiple date selection in single form ************
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

  //************* New Date Picker for multiple date selection in single form ******************

  function success(response) {
    if(response && response.data && response.data.data){
        $rootScope.driver = response.data.data;
        $scope.driver._id = response.data.data._id;
        swal(response.data.message,"","success");
		var sUrl = "#!/masters/driverDetails/profile";
		$rootScope.redirect(sUrl);
      }
  }

  function failure(response){
      swal("error",response.data.message,"error");
    }


  $scope.saveDriverDetails = function(form) {
    /*if(form.$valid){*/
      Driver.updateDriver($scope.driver, success,failure);
    /*} else {
              $scope.dmsg = '';
              $scope.createDrivererrormsg = true;
              $scope.dmsg = formValidationgrowlService.findError(form.$error);
              setTimeout(function(){
                if($scope.createDrivererrormsg){
                  $scope.$apply(function() {
                    $scope.createDrivererrormsg = false;
                  });
                }
            }, 7000);
      }*/
  };

	try{
		if($scope.$configs.master.showAccount){

			$scope.showAccountDropdown = (($scope.driver || {}).account) ? false : true;

			$scope.driver.account = $scope.driver.account || {};

			// Account dropdown config's
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

			// Get Account Masters
			($scope.getAccountMasters = function (input){

				var oFilter = {
					name: input,
					no_of_docs: 10,
					'group': ['Driver'],
					isGroup: false,
				}; // filter to send
				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {

				}

				// Handle success response
				function onSuccess(response){
					$scope.aAccountMaster = response.data.data;
					if($scope.driver.account && $scope.driver.account._id && !$scope.aAccountMaster.find( o => o._id === $scope.driver.account._id))
						$scope.aAccountMaster.unshift($scope.driver.account);
				}
			})();


		}
	}catch(e){}
});

materialAdmin.controller("driverDocumentController", function($rootScope, $uibModal, $scope,  Driver) {
  $("p").text("Driver");
  $rootScope.wantThis = true;
  $rootScope.wantReg = false;
  function success(response) {
    if(response && response.data){
          $scope.driver = response.data;
          var msg = response.message;
          console.log("Updated Driver "+ JSON.stringify($scope.driver));
          swal("Updated",msg,"success");
          var sUrl = "#!/masters/driverDetails/profile";
          $rootScope.redirect(sUrl);
          $rootScope.UploadgetAllDriverData();
      }
    }

  function fail(response){
        if (response.message){
            growlService.growl(response.message, "danger",2);
        }
    }

  $scope.$watch(function() {
          return $rootScope.driver;
         }, function() {
          try{
              $scope.driver = $rootScope.driver;
           }catch(e){
          //console.log('catch in truckIdentificationController');
          }
         }, true);

  $scope.uploadDriverDoc = function(form) {
    if(form.$valid) {
      var fd = new FormData();
      if($scope.photo){
         fd.append('photo', $scope.photo);
      }
      if($scope.address_proof_front_copy){
         fd.append('address_proof_front_copy', $scope.address_proof_front_copy);
      }
      if($scope.address_proof_back_copy){
         fd.append('address_proof_back_copy', $scope.address_proof_back_copy);
      }
      if($scope.license_front_copy){
         fd.append('license_front_copy', $scope.license_front_copy);
      }
      if($scope.license_back_copy){
         fd.append('license_back_copy', $scope.license_back_copy);
      }
      var data = {};
      data.fileUpload = true;
      data.formData = fd;
      data._id = $scope.driver._id;
      Driver.updateDriver(data, success,fail);
    }
  }

  $scope.driverPreview = function(doc) {
    $scope.preview(doc);
  }


});

materialAdmin.controller("uploadFilesPopUpCtrl", function($rootScope, $scope, URL, oUploadData, $uibModalInstance, Vehicle, dmsService) {
	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};
	$scope.putDocInListView = putDocInListView;
	$scope.initiateUpload = initiateUpload;
	$scope.getAllDocs = getAllDocs;
	$scope.selectCat = selectCat;
	$scope.hideSelect = false;
	(function init() {
		$scope.oUploadData = angular.copy(oUploadData);
		$scope.modelName = $scope.oUploadData.modelName;
		$scope.category  = $scope.$configs.Doc[$scope.modelName];
		$scope.docData = [];
		$scope.oDoc = [];
		$scope.aFiles = [];
		$scope.aCompressFile = [];
		getAllDocs();
	})();

	function selectCat(key){
		key = key.subName;
		if($scope.category[key]){
			$scope.keyData = $scope.category[key];
		}
		if($scope.oDoc && $scope.oDoc[key]){
			$scope.limit = $scope.keyData.max - $scope.oDoc[key].length;
		}else{
			$scope.limit = $scope.keyData.max;
		}
		$scope.aFiles = [];
		$scope.aCompressFile = [];
	}

	function getAllDocs(){
		let req = {
			_id: $scope.oUploadData.scopeModelId,
			modelName: $scope.modelName
		};
		dmsService.getAllDocs( req,success,failure);

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
		let mergeData = {};
		$scope.docData.files && $scope.docData.files.forEach(obj=>{
			mergeData[obj.category] = mergeData[obj.category] || [];
			mergeData[obj.category].push(obj);
		});
		$scope.oDoc = mergeData;
		putDocInListView();
		initiateUpload();
	}

	function putDocInListView(){
		let  oDoc;
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
					files: aFiles.map(obj => ({ uri:  `${URL.file_server}${obj.name}` }))
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
		console.log(aDoc);
	}

	function initiateUpload() {
		let uploadDocOpt = [];

		for (let [key, value] of Object.entries($scope.category))
			if (!$scope.oDoc[key] ? true : $scope.oDoc[key].length < value.max)
				uploadDocOpt.push({name: value.name, subName: key});

		if (!uploadDocOpt.length) return alert("File upload Max limit reached");
		$scope.uploadDocOpt = uploadDocOpt;
	}

	$scope.compressFile = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
    if($scope.limit > 0) {
	$scope.count = $scope.limit;
	if (files.length > $scope.limit) {
		for (let i = 0; i < $scope.limit; i++){
			$scope.aCompressFile.push({name: $scope.fileName.subName, fileValue: files[i]});
		$scope.count--;}
	} else {
		for (let i = 0; i < files.length; i++){
			$scope.aCompressFile.push({name: $scope.fileName.subName, fileValue: files[i]});
		$scope.count--;}
	}
	$scope.limit = $scope.count;
}else{
	swal('Warning', 'upload limit exceeded', 'warning');
}
		if($scope.aCompressFile && $scope.aCompressFile.length){
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
			dmsService.validateFile( data,success,failure);

			function success(res) {
				if (res && res.data && res.data) {
					res = res.data;
					res.forEach(obj=>{
						 if(obj.fileStatus === 'Error'){
							$scope.aCompressFile.forEach(aCom => {
								if(aCom.fileValue.name === obj.name) {
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

	$scope.pushFileToUpload = function(){
		if($scope.aCompressFile && $scope.aCompressFile.length) {
			$scope.aCompressFile.forEach(obj => {
				if(obj.fileStatus != 'Error')
				$scope.aFiles.push({name: $scope.fileName.subName, fileValue: obj.fileValue});
			});
		}
		// $scope.fileName = undefined;
		$scope.toGRUpl = undefined;
		$scope.aCompressFile = [];
		// $scope.limit = 0;
	};
	$scope.popFileFromUpload = function(i){
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

	$scope.onSelect = function(item){
		$scope.oUploadData.scopeModelId = item._id;
	};

	$scope.saveClick = function() {
		function success(res) {
			if (res && res.status ==='Success') {
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

		if ($scope.aFiles.length>0) {
			var fd = new FormData();
			for (var u=0;u<$scope.aFiles.length;u++) {
				fd.append('uploadfile', $scope.aFiles[u].fileValue);
			}
			fd.append(`bodyKey`, $scope.fileName.subName);
			fd.append(`modelName`, $scope.modelName);
			var data = {};
			data.fileUpload = true;
			data.formData = fd;
			data._id = angular.copy($scope.oUploadData.scopeModelId);
			data.modelName = angular.copy(oUploadData.modelName);
			dmsService.uploadFile( data,success,failure);
		} else {
			swal("warning", "Please select file first!", "warning");
			//$uibModalInstance.close(res);
		}
	}

});

materialAdmin.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
