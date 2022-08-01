/**
 * Created by manish on 30/8/16.
 */

/***** Abhishek update *******/
materialAdmin.controller("courierCommonController", function(
	$rootScope,
	$stateParams,
	$state,
	growlService,
	$scope,
	$window,
	$location,
	$timeout,
	vendorFuelService,
	URL,
	Pagination,
	$localStorage,
	branchService,
	vendorCourierService) {
    $("p").text("Courier Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantReg = false;
    $rootScope.wantThisEdit = false;

    $scope.pagination = Pagination;

    function prepareFilterObject(isPagination){
       var myFilter = {};
        if($scope.vendorCourierTypeAheadValue){
          myFilter.name = $scope.vendorCourierTypeAheadValue;
        }
        if($scope.currentPage){
         myFilter.skip = $scope.currentPage;
        }
        if(isPagination && $scope.currentPage){
           myFilter.skip = $scope.currentPage;
        }
        return myFilter;
    };

    $rootScope.getCourierOffice = function(){
        function successGetOffice(response){
            if(response && response.data){
                $rootScope.aCourierOffices = response.data;
            }
        }
        function failGetOffice(res){
            //console.error("failure add vendorCourier: ",res);
            var msg = res.data.message;
            //swal("Saved",msg,"success");
            growlService.growl(msg,"success");
        }
        var clientId = $localStorage.ft_data.userLoggedIn.clientId;
        var queryOfficeObj = {};
        queryOfficeObj.clientId = clientId;
        queryOfficeObj.courier_vendor_id = $rootScope.selectedCourierVendorData._id;
        vendorCourierService.GetCourierOfficeAll(queryOfficeObj, successGetOffice, failGetOffice);
    }



    $scope.getAllVendorCouriers = function(isPagination){
        function succGetVendorCouriers(response){
            // console.log(response.data);
            /*if(response.data){
                $scope.vendorCouriers = response.data;
            }*/
            if(response.data && response.data.length>0){
                $rootScope.vendorCouriers = response.data;
                $rootScope.selectedCourierVendorData = response.data[0];
				$scope.pagination.total_pages = response.count/$scope.pagination.items_per_page;
				$scope.pagination.totalItems = response.count;
                $scope.getCourierOffice();
                setTimeout(function(){
                    listItem = $($('.lv-item')[0]);
                        listItem.addClass('grn');
                }, 500);
            }
        }
        function failGetVendorCouriers(response){
            console.log(response);
        }
        var clientId = $localStorage.ft_data.userLoggedIn.clientId;
        var queryObj = prepareFilterObject(isPagination);
        queryObj.clientId = clientId;
        vendorCourierService.getVendorCouriers(queryObj,succGetVendorCouriers,failGetVendorCouriers);
    };

    $scope.getAllVendorCouriers();


    $scope.selectCourierV = function(vendorF,index){
        var sUrl = "#!/masters/vendorCourierCommon/profile";
        $rootScope.redirect(sUrl);
        $rootScope.selectedCourierVendorData = vendorF;
        $scope.getCourierOffice();
        listItem = $($('.lv-item')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');

    };

    $rootScope.formateDate = function(date){
        return new Date(date);
    };

    ///BY ME
    $scope.getVendorCourierNames = function(viewValue){
        if(viewValue.length){
          $scope.getAllVendorCouriers(true);
        } else {
          $scope.getAllVendorCouriers(true);
        }
    };

    $scope.onVendorCourierTypeAheadSelect = function($item, $model, $label){
        $scope.currentPage = 1;
        $scope.vendorCouriersReloadOnClear = true;
        $rootScope.vendorCourierName = $label;
        /*var sUrl = "#!/masters/vendorCourier/view/" + $scope.currentPage + "/" + $label;
        $rootScope.redirect(sUrl);*/
        $scope.getAllVendorCouriers(true);
    };

    $scope.resetVendorCourierName = function(){
        $scope.vendorCourierTypeAheadValue = '';
        $scope.getVendorCourierNames($scope.vendorCourierTypeAheadValue);
    };

    $scope.getCname = function(viewValue){
      if(viewValue && viewValue.toString().length>2){
       customer.getCname(viewValue,oSucC,oFailC);
      }
      else if(viewValue == ''){
        $scope.currentPage = 1;
        //$stateParams.name = '';
        //var sUrl = "#!/masters/vendorRegistration/profile"+"/" +$scope.currentPage +"/";
        $scope.getCustomers();
      };
    };

});

materialAdmin.controller("courierProfileCtrl", function($rootScope, $stateParams, $state, $scope, $window, $location,$timeout, vendorFuelService, URL,$localStorage, branchService,vendorCourierService) {
  $("p").text("Courier Vendor");
  $rootScope.wantThis = false;
  $rootScope.wantReg = false;
  $rootScope.wantThisEdit = false;

    $scope.$watch(function() {
        return $rootScope.selectedCourierVendorData;
    }, function() {
        try{
            $scope.selectedCourierVendorData = $rootScope.selectedCourierVendorData;
        }catch(e){
        }
   }, true);

});

materialAdmin.controller("courierVendorAddCtrl", function($rootScope, $scope, $interval,$modal, $state, $timeout, $stateParams, accountingService,formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils,vendorCourierService) {
    $("p").text("Courier Vendor");
    $rootScope.wantThis = true;
    $rootScope.wantReg = true;
    $rootScope.wantThisEdit = false;
    $scope.objVendorCourier = {};
    $scope.objCourierData= {};
    $scope.objVendorCourier.address={};


    //$scope.getAllBranchSelect();

    $scope.autoCompleteCallbackCity = function(){
        if ($scope.autoCompleteCity){
            $timeout(function() {
                $scope.objVendorCourier.address.city = $scope.autoCompleteCity.c;
                $scope.objVendorCourier.address.district = $scope.autoCompleteCity.d;
                $scope.objVendorCourier.address.state = $scope.autoCompleteCity.st;
                $scope.objVendorCourier.address.pincode = $scope.autoCompleteCity.p;
                $scope.objVendorCourier.address.country = $scope.autoCompleteCity.cnt;
            })
        }
    };

    var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope,['autoCompleteCity'], $scope.autoCompleteCallbackCity);

    $scope.objVendorCourier.status = 'Active';
    $scope.saveVendorCourier = function(vfData){
       if (vfData.$valid) {
        function successSaveVendorCourier(response){
            if(response && response.data){
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $rootScope.selectedCourierVendorData = response.data;
				$rootScope.aCourierOffices = [];
                if(!$rootScope.vendorCouriers){
                   $rootScope.vendorCouriers = [];
                }
                $rootScope.vendorCouriers.unshift($rootScope.selectedCourierVendorData);
                var sUrl = "#!/masters/vendorCourierCommon/profile";
                $rootScope.redirect(sUrl);
                setTimeout(function(){
					listItem.removeClass('grn');
                    listItem = $($('.lv-item')[0]);
                    listItem.addClass('grn');
                }, 500);
            }
        }
        function failureSaveVendorCourier(res){
            console.error("failure add vendorCourier: ",res);
        }

        $scope.objVendorCourier.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        console.log($scope.objVendorCourier);
        vendorCourierService.addVendorCourier($scope.objVendorCourier, successSaveVendorCourier, failureSaveVendorCourier);
        } else {
            $scope.VendorCourier = '';
            $scope.createVendorCourierErrMsg = true;
            $scope.VendorCourier = formValidationgrowlService.findError(vfData.$error);
            setTimeout(function() {
                if ($scope.createVendorCourierErrMsg) {
                    $scope.$apply(function() {
                        $scope.createVendorCourierErrMsg = false;
                    });
                }
            }, 7000);
        }
    }

	try{
		if($scope.$configs.master.showAccount){
			// Get Account Masters
			(function getAccountMasters(){

				var oFilter = {
					all: true
				}; // filter to send
				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {

				}

				// Handle success response
				function onSuccess(response){
					response.data.data.unshift({
						'name': "Add New Account",
						'_id':  "addNewAccount"
					});
					$scope.aAccountMaster = response.data.data;
				}
			})();

			$scope.onSelectAccount = function () {
				if($scope.objVendorCourier.account === "addNewAccount"){
					$scope.objVendorCourier.account = null;
					var modalInstance = $modal.open({
						templateUrl: 'views/accounting/accountMasterUpsert.html',
						controller: 'accountMasterUpsertController',
						resolve: {
							'selectedAccountMaster': function () {
								return {
									'accountType' : 'Cash in Hand',
									'group': 'Vendor',
									'name': $scope.objVendorCourier.name,
									'isAdd': true
								};
							}
						}
					});

					modalInstance.result.then(function(response) {
						if(response)
							$scope.aAccountMaster.push(response);
							$scope.objVendorCourier.account = response._id;

						console.log('close',response);
					}, function(data) {
						console.log('cancel');
					});
				}

			};
		}
	}catch(e){}
});

materialAdmin.controller("courierVendorAddOfficeCtrl", function($rootScope, $scope, $interval,$modal, $state, $timeout, $stateParams,formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils,vendorCourierService) {
    $("p").text("Courier Vendor");
    $rootScope.wantThis = true;
    $rootScope.wantReg = true;
    $rootScope.wantThisEdit = false;
    $scope.objOffice = {};

    $scope.autoCompleteCallbackCity = function(){
        if ($scope.autoCompleteCity){
            $timeout(function() {
                $scope.objVendorFuel.address.city = $scope.autoCompleteCity.c;
                $scope.objVendorFuel.address.district = $scope.autoCompleteCity.d;
                $scope.objVendorFuel.address.state = $scope.autoCompleteCity.st;
                $scope.objVendorFuel.address.pincode = $scope.autoCompleteCity.p;
                $scope.objVendorFuel.address.country = $scope.autoCompleteCity.cnt;
            })
        }
    };
    var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope,['autoCompleteCity'], $scope.autoCompleteCallbackCity);

    /*$scope.getCourierOffice = function(){
        function successGetOffice(response){
            if(response && response.data){
                $scope.aCourierOffices = response.data;
            }
        }
        function failGetOffice(res){
            console.error("failure add vendorCourier: ",res);
        }
        vendorCourierService.GetCourierOfficeAll($rootScope.vendorData.vendorId, successGetOffice, failGetOffice);
    }*/

    $scope.addOffice = function(){

        function successAddOffice(response){
            if(response && response.data){
                var msg = response.data.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $scope.objOffice = {};
                $scope.getCourierOffice();
            }
        }
        function failAddOffice(res){
            console.error("failure add vendorCourier: ",res);
        }

        $scope.objOffice.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        $scope.objOffice.vendorId = $rootScope.selectedCourierVendorData.vendorId;
        //$scope.objOffice.courier_vendor_id = $rootScope.vendorData._id;
        $scope.objOffice.courier_vendor_id = $rootScope.selectedCourierVendorData._id;

        vendorCourierService.addCourierOffice($scope.objOffice, successAddOffice, failAddOffice);
    }

    $scope.savebtn = false;
    $scope.editMode = true;
    $scope.editOffice = function(edtOfficeData){
        $scope.savebtn = true;
        $scope.editMode = false;
    }

    $scope.updateOffice = function(upOfficeData){
        function successUpOffice(response){
            if(response && response.data){
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $scope.objOffice = {};
                $scope.getCourierOffice();
                $scope.savebtn = false;
                $scope.editMode = true;
            }
        }
        function failUpOffice(res){
            console.error("failure add vendorCourier: ",res);
        }
        vendorCourierService.updateCourierOffice(upOfficeData, successUpOffice, failUpOffice);
    }

    $scope.getCourierOffice();

});

materialAdmin.controller("courierVendorEditCtrl", function($rootScope, $scope, $interval,$modal, $state, $timeout, $stateParams, accountingService,formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils,vendorCourierService) {
    $("p").text("Courier Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantReg = false;
    $rootScope.wantThisEdit = true;
    $scope.objVendorCourier = {};
    $scope.objCourierData= {};
    $scope.objVendorCourier.address={};

    if($rootScope.selectedCourierVendorData){
        $scope.objVendorCourier = $rootScope.selectedCourierVendorData;
    }

	$scope.showAccountDropdown = $scope.objVendorCourier.account ? false : true;


    //$scope.getAllBranchSelect();

    $scope.autoCompleteCallbackCity = function(){
        if ($scope.autoCompleteCity){
            $timeout(function() {
                $scope.objOffice.city = $scope.autoCompleteCity.c;
                $scope.objOffice.district = $scope.autoCompleteCity.d;
                $scope.objOffice.state = $scope.autoCompleteCity.st;
                $scope.objOffice.pincode = $scope.autoCompleteCity.p;
                $scope.objOffice.country = $scope.autoCompleteCity.cnt;
            })
        }
    };

    var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope,['autoCompleteCity'], $scope.autoCompleteCallbackCity);

    $scope.updateVendorCourier = function(vfData){

        function successEditVendorCourier(response){
            if(response && response.data){
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $rootScope.selectedCourierVendorData = response.data;
                var sUrl = "#!/masters/vendorCourierCommon/editOffices";
                $rootScope.redirect(sUrl);
            }
        }
        function failureEditVendorCourier(res){
            console.error("failure add vendorCourier: ",res);
        }

        $scope.objVendorCourier.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        console.log($scope.objVendorCourier);
        if($scope.objVendorCourier && $scope.objVendorCourier._id){
          vendorCourierService.updateVendorCourier($scope.objVendorCourier._id ,$scope.objVendorCourier, successEditVendorCourier, failureEditVendorCourier);
        }
    }

	try{
		if($scope.$configs.master.showAccount){
			// Get Account Masters
			(function getAccountMasters(){

				var oFilter = {
					all: true
				}; // filter to send
				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {

				}

				// Handle success response
				function onSuccess(response){
					response.data.data.unshift({
						'name': "Add New Account",
						'_id':  "addNewAccount"
					});
					$scope.aAccountMaster = response.data.data;
				}
			})();

			$scope.onSelectAccount = function () {
				if($scope.objVendorCourier.account === "addNewAccount"){
					$scope.objVendorCourier.account = null;
					var modalInstance = $modal.open({
						templateUrl: 'views/accounting/accountMasterUpsert.html',
						controller: 'accountMasterUpsertController',
						resolve: {
							'selectedAccountMaster': function () {
								return {
									'accountType' : 'Cash in Hand',
									'group': 'Vendor',
									'name': $scope.objVendorCourier.name,
									'isAdd': true
								};
							}
						}
					});

					modalInstance.result.then(function(response) {
						if(response)
							$scope.aAccountMaster.push(response);
							$scope.objVendorCourier.account = response._id;

						console.log('close',response);
					}, function(data) {
						console.log('cancel');
					});
				}

			};
		}
	}catch(e){}

});

materialAdmin.controller("courierVendorEditOfficeCtrl", function($rootScope, $scope, $interval,$modal, $state, $timeout, $stateParams,formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils,vendorCourierService) {
    $("p").text("Courier Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantReg = false;
    $rootScope.wantThisEdit = true;
    $scope.objOffice = {};

    $scope.autoCompleteCallbackCity = function(){
        if ($scope.autoCompleteCity){
            $timeout(function() {
                $scope.objOffice.city = $scope.autoCompleteCity.c;
                $scope.objOffice.district = $scope.autoCompleteCity.d;
                $scope.objOffice.state = $scope.autoCompleteCity.st;
                $scope.objOffice.pincode = $scope.autoCompleteCity.p;
                $scope.objOffice.country = $scope.autoCompleteCity.cnt;
            })
        }
    };
    var gAPI = new googlePlaceAPI($interval);
    gAPI.fight($scope,['autoCompleteCity'], $scope.autoCompleteCallbackCity);
    /*$scope.getCourierOffice = function(){
        function successGetOffice(response){
            if(response && response.data){
                $scope.aCourierOffices = response.data;
            }
        }
        function failGetOffice(res){
            console.error("failure add vendorCourier: ",res);
        }
        vendorCourierService.GetCourierOfficeAll($rootScope.selectedCourierVendorData.vendorId, successGetOffice, failGetOffice);
    }*/

    $scope.addOffice = function(){

        function successAddOffice(response){
            if(response && response.data){
                var msg = response.data.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $scope.objOffice = {};
                   $scope.getCourierOffice();
            }
        }
        function failAddOffice(res){
            console.error("failure add vendorCourier: ",res);
        }

        $scope.objOffice.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        $scope.objOffice.vendorId = $rootScope.selectedCourierVendorData.vendorId;
        $scope.objOffice.courier_vendor_id = $rootScope.selectedCourierVendorData._id;

        vendorCourierService.addCourierOffice($scope.objOffice, successAddOffice, failAddOffice);
    }

    $scope.savebtn = false;
    $scope.editMode = true;
    $scope.editOffice = function(edtOfficeData){
        $scope.savebtn = true;
        $scope.editMode = false;
    }

    $scope.updateOffice = function(upOfficeData){
        $scope.upOfficeData = upOfficeData;
        $rootScope.updateOfficeId = upOfficeData._id;
        function successUpOffice(response){
            if(response && response.data){
                var msg = response.data.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg,"success");
                $scope.objOffice = {};
                $scope.getCourierOffice();
                $scope.savebtn = false;
                $scope.editMode = true;
            }
        }
        function failUpOffice(res){
            console.error("failure add vendorCourier: ",res);
        }
        vendorCourierService.updateCourierOffice($scope.upOfficeData, successUpOffice, failUpOffice);
    }

});

//////////////////OLD CONTROLLER///////////////////////////////

materialAdmin.controller("vendorCourierController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, vendorCourierService, URL, client_config,$localStorage, branchService) {
        $rootScope.vendorCourierName = "";
        $rootScope.objVendorCourier=undefined;
        $rootScope.fileURLVendorCourier = URL.FILE_URL_CLIENT;
        $scope.vendorCouriers=[];
        $scope.client_config = client_config;
        $rootScope.vendorCourier_index_selected=0;
        $scope.vendorCourier_type_ahead_value = "";

        $scope.currentPage = 1;
            $scope.maxSize = 3;
            $scope.items_per_page = 10;
            $scope.pageChanged = function() {
             $scope.getAllVendorCouriers(true);
        };

        function prepareFilterObject(){
           var myFilter = {};
           if($scope.vendorCourierTypeAheadValue){
              myFilter.name = $scope.vendorCourierTypeAheadValue;
            }
            if($scope.currentPage){
             myFilter.skip = $scope.currentPage;
            }
            return myFilter;
        };

        $scope.$watch(function() {
                return $location.path();
            },
            function(a){
                console.log('url has changed: ' + a);
                $scope.currentPath = $location.path();
                if($scope.currentPath == '/masters/vendorCourier'){
                    $rootScope.form_vendorCourier = "home";
                    $rootScope.vendorCourierName="";
                    $scope.vendorCourier_show_add_button = true;
                    $scope.vendorCourier_show_no_data = true;
                    $scope.objVendorCourier = undefined;
                    $scope.vendorCourier_action_tag ="";
                    var listItem = $($('.lv-item')[$rootScope.vendorCourier_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                }else if($scope.currentPath == '/masters/vendorCourier/add'){
                    $scope.vendorCourier_show_add_button = false;
                    $rootScope.vendorCourierName="";
                    $scope.vendorCourier_show_no_data = false;
                    $rootScope.form_vendorCourier = "add";
                    $scope.vendorCourier_action_tag ="Add";
                } else if ($scope.currentPath == '/masters/vendorCourier/edit'){
                    if ($rootScope.objVendorCourier) {
                        $scope.vendorCourier_show_add_button = false;
                        $rootScope.vendorCourierName=$rootScope.objVendorCourier.name;
                        $scope.vendorCourier_show_no_data = false;
                        $rootScope.form_vendorCourier = "edit";
                        $scope.vendorCourier_action_tag ="Edit";
                    }else{
                        $state.go('masters.vendorCourier')
                    }
                } else if ($scope.currentPath == '/masters/vendorCourier/view'){
                    if ($rootScope.objVendorCourier) {
                        $scope.vendorCourier_show_add_button = true;
                        $rootScope.vendorCourierName = $rootScope.objVendorCourier.name ;
                        $scope.vendorCourier_show_no_data = false;
                        $scope.vendorCourier_action_tag = "View";
                        $rootScope.form_vendorCourier = "view";
                    }else{
                        $state.go('masters.vendorCourier')
                    }
                }
            }
        );

        function getBranchesTrim() {
            function sucGetBranchesTrim(response){
                console.log(response);
                $rootScope.branchesTrim = response.data;
            }
            function failGetBranchesTrim(response){
                console.log(response);
            }

            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            branchService.getBranchesTrim({"clientId":clientId},sucGetBranchesTrim,failGetBranchesTrim);
        }
        getBranchesTrim();

        $scope.selectVendorCourier = function (vendorCourier,index) {
            $rootScope.objVendorCourier = vendorCourier;
            $rootScope.vendorCourierName = vendorCourier.name ;
            $rootScope.vendorCourier_index_selected = index;

            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if (vendorCourier.name){
                $stateParams.name = vendorCourier.name ;
                $state.transitionTo('masters.vendorCourier.view',$stateParams,{reload:'masters.vendorCourier.view'});
            }
        };

        $scope.addVendorCourier = function () {
            $state.go('masters.vendorCourier.add');
        };

        $scope.resetVendorCourierName = function () {
            $scope.vendorCourierName ='';
            $rootScope.vendorCourierName='';
            $scope.vendorCourierTypeAheadValue = '';
            $scope.vendorCouriersReloadOnClear = true;
            $scope.getVendorCourierNames('');
        };



        $scope.getVendorCourierNames = function(viewValue){
            function sucGetvendorCourierNames(response){
                console.log(response);
                $scope.vendorCourierNames = response.data;
            }
            function failGetvendorCourierNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.toString().length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                vendorCourierService.getVendorCourierNames(clientId,viewValue,sucGetvendorCourierNames,failGetvendorCourierNames);
            } else if (viewValue=='' && $scope.vendorCouriersReloadOnClear){
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.vendorCourierName = '';
                $scope.vendorCouriersReloadOnClear = false;
                //var sUrl = "#!/masters/vendorCourier";
                //$rootScope.redirect(sUrl);
                /*$state.go('vendorCouriers');
                $state.reload();*/
                $scope.getAllVendorCouriers(true);
            }
        };

        $scope.getAllVendorCouriers = function(autoSelect,selectIndex,index, queryObj){
            if (!autoSelect){
                $rootScope.vendorCourierName="";
                $stateParams.name="";
            }
            function succGetVendorCouriers(response){
                console.log(response.data);
                if(response.data){
                    $scope.vendorCouriers = response.data;
                 }
                if(response.data && response.data.length>0){
                    $scope.vendorCouriers = response.data;
                    $scope.total_pages = response.pages;
                    $scope.totalItems = 15*response.pages;
                        setTimeout(function(){
                            listItem = $($('.lv-item')[0]);
                                listItem.addClass('grn');
                         }, 500);

                    if (autoSelect) {
                        $scope.selectVendorCourier(response.data[0], 0);
                        //something was selected previously
                    }else if (selectIndex) {
                        $scope.selectVendorCourier(response.data[index], index);
                        //something was selected previously
                    }
                    else{
                        var listItem = $($('.lv-item')[$rootScope.vendorCourier_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }
            function failGetVendorCouriers(response){
                console.log(response);
            }
            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            var queryObj = prepareFilterObject();
            queryObj.clientId = clientId;
            vendorCourierService.getVendorCouriers(queryObj,succGetVendorCouriers,failGetVendorCouriers);
        };

        $scope.onVendorCourierTypeAheadSelect = function($item, $model, $label){
            $scope.currentPage = 1;
            $scope.vendorCouriersReloadOnClear = true;
            $rootScope.vendorCourierName = $label;
            /*var sUrl = "#!/masters/vendorCourier/view/" + $scope.currentPage + "/" + $label;
            $rootScope.redirect(sUrl);*/
            $scope.getAllVendorCouriers(true);
        };

        $scope.getAllVendorCouriers(true);
        $rootScope.getAllVendorCouriers = $scope.getAllVendorCouriers;
        $rootScope.selectVendorCourier = $scope.selectVendorCourier;
    });



materialAdmin.controller("vendorCourierAddController",
    function($rootScope, $scope, $interval,
             $modal, $state, $timeout, $stateParams,formValidationgrowlService, vendorCourierService, $localStorage, growlService, constants) {

        var listItem = $($('.lv-item')[$rootScope.vendorCourier_index_selected]);
        listItem.removeClass('grn');

        $scope.form_vendorCourier_read_only= false;
        $scope.form_vendorCourier_required_active = true;
        $scope.objVendorCourier = {};
        $scope.objVendorCourier.address1={};
        $scope.objVendorCourier.address2={};
        $scope.objVendorCourier.address3={};

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName){
            for (var i=0;i<$rootScope.branchesTrim.length;i++){
                if ($rootScope.branchesTrim[i].name ==branchName){
                    $scope.objVendorCourier.branch_id=$rootScope.branchesTrim[i]._id;
                    $scope.objVendorCourier.branch_code=$rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objVendorCourier.address1.city = $scope.autoCompleteCity1.c;
                    $scope.objVendorCourier.address1.district = $scope.autoCompleteCity1.d;
                    $scope.objVendorCourier.address1.state = $scope.autoCompleteCity1.st;
                    $scope.objVendorCourier.address1.pincode = $scope.autoCompleteCity1.p;
                    $scope.objVendorCourier.address1.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackCity2 = function(){
            if ($scope.autoCompleteCity2){
                $timeout(function() {
                    $scope.objVendorCourier.address2.city = $scope.autoCompleteCity2.c;
                    $scope.objVendorCourier.address2.district = $scope.autoCompleteCity2.d;
                    $scope.objVendorCourier.address2.state = $scope.autoCompleteCity2.st;
                    $scope.objVendorCourier.address2.pincode = $scope.autoCompleteCity2.p;
                    $scope.objVendorCourier.address2.country = $scope.autoCompleteCity2.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackCity3 = function(){
            if ($scope.autoCompleteCity3){
                $timeout(function() {
                    $scope.objVendorCourier.address3.city = $scope.autoCompleteCity3.c;
                    $scope.objVendorCourier.address3.district = $scope.autoCompleteCity3.d;
                    $scope.objVendorCourier.address3.state = $scope.autoCompleteCity3.st;
                    $scope.objVendorCourier.address3.pincode = $scope.autoCompleteCity3.p;
                    $scope.objVendorCourier.address3.country = $scope.autoCompleteCity3.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);
        var gAPI2 = new googlePlaceAPI($interval);
        gAPI2.fight($scope,['autoCompleteCity2'], $scope.autoCompleteCallbackCity2);
        var gAPI3 = new googlePlaceAPI($interval);
        gAPI3.fight($scope,['autoCompleteCity3'], $scope.autoCompleteCallbackCity3);

        $scope.saveVendorCourier = function(form) {
            function successSaveVendorCourier(response){
                if(response && response.data){
                    var msg = response.message;
                    //swal("Saved",msg,"success");
                    growlService.growl(msg,"success");
                    $rootScope.getAllVendorCouriers(true);
                }
            }
            function failureSaveVendorCourier(res){
                console.error("failure add vendorCourier: ",res);
            }

            $scope.objVendorCourier.clientId = $localStorage.ft_data.userLoggedIn.clientId;

            if(form.$valid){
            vendorCourierService.addVendorCourier($scope.objVendorCourier, successSaveVendorCourier, failureSaveVendorCourier);
            } else {
                  $scope.Cmsg = '';
                  $scope.courierVendor = true;
                  $scope.Cmsg = formValidationgrowlService.findError(form.$error);
                  setTimeout(function(){
                    if($scope.courierVendor){
                      $scope.$apply(function() {
                        $scope.courierVendor = false;
                      });
                    }
                }, 7000);
             }
        };
    }
);

materialAdmin.controller("vendorCourierViewController",
    function($rootScope, $scope, $interval, $state , $stateParams, vendorCourierService, constants, growlService) {
        $scope.form_vendorCourier_read_only= true;
        $scope.form_vendorCourier_required_active = false;

        function dataReady(){
            $scope.objVendorCourier = angular.copy($rootScope.objVendorCourier);
            var listItem = $($('.lv-item')[$rootScope.vendorCourier_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objVendorCourier in viewController " + JSON.stringify($scope.objVendorCourier));
        }

        $scope.$watch($rootScope.objVendorCourier, function() {
            dataReady();
        });


        $scope.editVendorCourier = function(){
            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if ($rootScope.objVendorCourier.name) {
                $stateParams.name = $rootScope.objVendorCourier.name ;
                $state.go('masters.vendorCourier.edit',{});
            }
        };

        $scope.deleteVendorCourier = function(){
            swal({
                title: "Confirm delete ?",
                text: "vendorCourier "+$scope.objVendorCourier.name+" will be removed from vendorCourier masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteVendorCourier(response){
                    if (response.message){
                        growlService.growl(response.message, "success");
                        $state.go('masters.vendorCourier',{},{reload:true});
                    }
                }

                function failDeleteVendorCourier(response){
                    if (response.message){
                        //growlService.growl(response.message, "danger");
                    }
                }
                vendorCourierService.deleteVendorCourier($scope.objVendorCourier,succDeleteVendorCourier,failDeleteVendorCourier);
            });
        };
    }
);

materialAdmin.controller("vendorCourierEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
             $timeout, vendorCourierService, constants, growlService,formValidationgrowlService)
    {
        $scope.form_vendorCourier_read_only= false;
        $scope.form_vendorCourier_required_active = true;
        $scope.objVendorCourier = angular.copy($rootScope.objVendorCourier);

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName){
            for (var i=0;i<$rootScope.branchesTrim.length;i++){
                if ($rootScope.branchesTrim[i].name ==branchName){
                    $scope.objVendorCourier.branch_id=$rootScope.branchesTrim[i]._id;
                    $scope.objVendorCourier.branch_code=$rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objVendorCourier.address1.city = $scope.autoCompleteCity1.c;
                    $scope.objVendorCourier.address1.district = $scope.autoCompleteCity1.d;
                    $scope.objVendorCourier.address1.state = $scope.autoCompleteCity1.st;
                    $scope.objVendorCourier.address1.pincode = $scope.autoCompleteCity1.p;
                    $scope.objVendorCourier.address1.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackCity2 = function(){
            if ($scope.autoCompleteCity2){
                $timeout(function() {
                    $scope.objVendorCourier.address2.city = $scope.autoCompleteCity2.c;
                    $scope.objVendorCourier.address2.district = $scope.autoCompleteCity2.d;
                    $scope.objVendorCourier.address2.state = $scope.autoCompleteCity2.st;
                    $scope.objVendorCourier.address2.pincode = $scope.autoCompleteCity2.p;
                    $scope.objVendorCourier.address2.country = $scope.autoCompleteCity2.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackCity3 = function(){
            if ($scope.autoCompleteCity3){
                $timeout(function() {
                    $scope.objVendorCourier.address3.city = $scope.autoCompleteCity3.c;
                    $scope.objVendorCourier.address3.district = $scope.autoCompleteCity3.d;
                    $scope.objVendorCourier.address3.state = $scope.autoCompleteCity3.st;
                    $scope.objVendorCourier.address3.pincode = $scope.autoCompleteCity3.p;
                    $scope.objVendorCourier.address3.country = $scope.autoCompleteCity3.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);
        var gAPI2 = new googlePlaceAPI($interval);
        gAPI2.fight($scope,['autoCompleteCity2'], $scope.autoCompleteCallbackCity2);
        var gAPI3 = new googlePlaceAPI($interval);
        gAPI3.fight($scope,['autoCompleteCity3'], $scope.autoCompleteCallbackCity3);

        $scope.saveVendorCourier = function(form) {
            function successUpdateVendorCourier(response){
                if(response){
                    var msg = response.message;
                    growlService.growl(msg,"success");
                    $rootScope.getAllVendorCouriers(false,true,$rootScope.vendorCourier_index_selected);
                }
            }

            function failureUpdateVendorCourier(response){
                //var msg = response.message;
                //growlService.growl(msg,"danger");
            }

            function prepareDataVendorCourierUpdate(){
                var objVendorCourierCopy = angular.copy($scope.objVendorCourier);
                objVendorCourierCopy.last_modified_at = undefined;
                objVendorCourierCopy.created_at = undefined;
                objVendorCourierCopy.__v = undefined;
                objVendorCourierCopy.vendorId = undefined;
                objVendorCourierCopy._id=undefined;
                objVendorCourierCopy.clientId= undefined;
                return objVendorCourierCopy;
            }

            if(form.$valid){
              vendorCourierService.updateVendorCourier($scope.objVendorCourier._id,
                prepareDataVendorCourierUpdate(), successUpdateVendorCourier, failureUpdateVendorCourier);
            } else {
                  $scope.Cmsg = '';
                  $scope.courierVendor = true;
                  $scope.Cmsg = formValidationgrowlService.findError(form.$error);
                  setTimeout(function(){
                    if($scope.courierVendor){
                      $scope.$apply(function() {
                        $scope.courierVendor = false;
                      });
                    }
                }, 7000);
             }
        };
    });





