/**
 * Created by manish on 30/8/16.
 */

materialAdmin.controller("vendorMaintenanceController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, vendorMaintenanceService, URL, client_config,$localStorage, branchService) {
        $rootScope.vendorMaintenanceName = "";
        $rootScope.objVendorMaintenance=undefined;
        $rootScope.fileURLVendorMaintenance = URL.FILE_URL_CLIENT;
        $scope.vendorMaintenances=[];
        $scope.client_config = client_config;
        $rootScope.vendorMaintenance_index_selected=0;
        $scope.vendorMaintenance_type_ahead_value = "";
        
        $scope.currentPage = 1;
            $scope.maxSize = 3;
            $scope.items_per_page = 10;
            $scope.pageChanged = function() {
             $scope.getAllVendorMaintenances(true);
        };

        function prepareFilterObject(){
           var myFilter = {};
           if($scope.vendorMaintenanceTypeAheadValue){
              myFilter.name = $scope.vendorMaintenanceTypeAheadValue;
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
                if($scope.currentPath == '/masters/vendorMaintenance'){
                    $rootScope.form_vendorMaintenance = "home";
                    $rootScope.vendorMaintenanceName="";
                    $scope.vendorMaintenance_show_add_button = true;
                    $scope.vendorMaintenance_show_no_data = true;
                    $scope.objVendorMaintenance = undefined;
                    $scope.vendorMaintenance_action_tag ="";
                    var listItem = $($('.lv-item')[$rootScope.vendorMaintenance_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                }else if($scope.currentPath == '/masters/vendorMaintenance/add'){
                    $scope.vendorMaintenance_show_add_button = false;
                    $rootScope.vendorMaintenanceName="";
                    $scope.vendorMaintenance_show_no_data = false;
                    $rootScope.form_vendorMaintenance = "add";
                    $scope.vendorMaintenance_action_tag ="Add";
                } else if ($scope.currentPath == '/masters/vendorMaintenance/edit'){
                    if ($rootScope.objVendorMaintenance) {
                        $scope.vendorMaintenance_show_add_button = false;
                        $rootScope.vendorMaintenanceName=$rootScope.objVendorMaintenance.name;
                        $scope.vendorMaintenance_show_no_data = false;
                        $rootScope.form_vendorMaintenance = "edit";
                        $scope.vendorMaintenance_action_tag ="Edit";
                    }else{
                        $state.go('masters.vendorMaintenance')
                    }
                } else if ($scope.currentPath == '/masters/vendorMaintenance/view'){
                    if ($rootScope.objVendorMaintenance) {
                        $scope.vendorMaintenance_show_add_button = true;
                        $rootScope.vendorMaintenanceName = $rootScope.objVendorMaintenance.name ;
                        $scope.vendorMaintenance_show_no_data = false;
                        $scope.vendorMaintenance_action_tag = "View";
                        $rootScope.form_vendorMaintenance = "view";
                    }else{
                        $state.go('masters.vendorMaintenance')
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

        $scope.selectVendorMaintenance = function (vendorMaintenance,index) {
            $rootScope.objVendorMaintenance = vendorMaintenance;
            $rootScope.vendorMaintenanceName = vendorMaintenance.name ;
            $rootScope.vendorMaintenance_index_selected = index;

            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if (vendorMaintenance.name){
                $stateParams.name = vendorMaintenance.name ;
                $state.transitionTo('masters.vendorMaintenance.view',$stateParams,{reload:'masters.vendorMaintenance.view'});
            }
        };

        $scope.addVendorMaintenance = function () {
            $state.go('masters.vendorMaintenance.add');
        };

        $scope.resetVendorMaintenanceName = function () {
            $scope.vendorMaintenanceName ='';
            $rootScope.vendorMaintenanceName='';
            $scope.vendorMaintenancesReloadOnClear = true;
            $scope.getVendorMaintenanceNames('');
        };



        $scope.getVendorMaintenanceNames = function(viewValue){
            function sucGetvendorMaintenanceNames(response){
                console.log(response);
                $scope.vendorMaintenanceNames = response.data;
            }
            function failGetvendorMaintenanceNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.toString().length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                vendorMaintenanceService.getVendorMaintenanceNames(clientId,viewValue,sucGetvendorMaintenanceNames,failGetvendorMaintenanceNames);
            } else if (viewValue=='' && $scope.vendorMaintenancesReloadOnClear){
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.vendorMaintenanceName = '';
                $scope.vendorMaintenancesReloadOnClear = false;
                //var sUrl = "#!/masters/vendorMaintenance";
                //$rootScope.redirect(sUrl);
                /*$state.go('vendorMaintenances');
                $state.reload();*/
                $scope.getAllVendorMaintenances(true);
            }
        };

        $scope.getAllVendorMaintenances = function(autoSelect,selectIndex,index, queryObj){
            if (!autoSelect){
                $rootScope.vendorMaintenanceName="";
                $stateParams.name="";
            }
            function succGetVendorMaintenances(response){
                console.log(response.data);
                if(response.data){
                    $scope.vendorMaintenances = response.data;
                }
                if(response.data && response.data.length>0){
                    $scope.vendorMaintenances = response.data;
                    $scope.total_pages = response.pages;
                    $scope.totalItems = 15*response.pages;
                        setTimeout(function(){ 
                            listItem = $($('.lv-item')[0]);
                                listItem.addClass('grn');
                         }, 500);

                    if (autoSelect) {
                        $scope.selectVendorMaintenance(response.data[0], 0);
                        //something was selected previously
                    }else if (selectIndex) {
                        $scope.selectVendorMaintenance(response.data[index], index);
                        //something was selected previously
                    }
                    else{
                        var listItem = $($('.lv-item')[$rootScope.vendorMaintenance_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }
            function failGetVendorMaintenances(response){
                console.log(response);
            }
            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            var queryObj = prepareFilterObject();
            queryObj.clientId = clientId;
            vendorMaintenanceService.getVendorMaintenances(queryObj,succGetVendorMaintenances,failGetVendorMaintenances);
        };

        $scope.onVendorMaintenanceTypeAheadSelect = function($item, $model, $label){
            $scope.currentPage = 1;
            $scope.vendorMaintenancesReloadOnClear = true;
            $rootScope.vendorMaintenanceName = $label;
            /*var sUrl = "#!/masters/vendorMaintenance/view/" + $scope.currentPage + "/" + $label;
            $rootScope.redirect(sUrl);*/
            $scope.getAllVendorMaintenances(true);
        };

        $scope.getAllVendorMaintenances(true);
        $rootScope.getAllVendorMaintenances = $scope.getAllVendorMaintenances;
        $rootScope.selectVendorMaintenance = $scope.selectVendorMaintenance;
    });



materialAdmin.controller("vendorMaintenanceAddController",
    function($rootScope, $scope, $interval,
             $modal, $state, $timeout,formValidationgrowlService, $stateParams, vendorMaintenanceService, $localStorage, growlService, constants) {

        var listItem = $($('.lv-item')[$rootScope.vendorMaintenance_index_selected]);
        listItem.removeClass('grn');

        $scope.form_vendorMaintenance_read_only= false;
        $scope.form_vendorMaintenance_required_active = true;
        $scope.objVendorMaintenance = {};
        $scope.objVendorMaintenance.address1={};

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName){
            for (var i=0;i<$rootScope.branchesTrim.length;i++){
                if ($rootScope.branchesTrim[i].name ==branchName){
                    $scope.objVendorMaintenance.branch_id=$rootScope.branchesTrim[i]._id;
                    $scope.objVendorMaintenance.branch_code=$rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objVendorMaintenance.address1.city = $scope.autoCompleteCity1.c;
                    $scope.objVendorMaintenance.address1.district = $scope.autoCompleteCity1.d;
                    $scope.objVendorMaintenance.address1.state = $scope.autoCompleteCity1.st;
                    $scope.objVendorMaintenance.address1.pincode = $scope.autoCompleteCity1.p;
                    $scope.objVendorMaintenance.address1.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);

        $scope.saveVendorMaintenance = function(form) {
            function successSaveVendorMaintenance(response){
                if(response && response.data){
                    var msg = response.message;
                    //swal("Saved",msg,"success");
                    growlService.growl(msg,"success");
                    $rootScope.getAllVendorMaintenances(true);
                }
            }
            function failureSaveVendorMaintenance(res){
                console.error("failure add vendorMaintenance: ",res);
            }

            $scope.objVendorMaintenance.clientId = $localStorage.ft_data.userLoggedIn.clientId;

            if(form.$valid){
            vendorMaintenanceService.addVendorMaintenance($scope.objVendorMaintenance, successSaveVendorMaintenance, failureSaveVendorMaintenance);
            } else {
              $scope.Mmsg = '';
              $scope.MaintenanceVendor = true;
              $scope.Mmsg = formValidationgrowlService.findError(form.$error);   
              setTimeout(function(){ 
                if($scope.MaintenanceVendor){
                  $scope.$apply(function() {
                    $scope.MaintenanceVendor = false;
                  });
                }  
            }, 7000);    
         }

        };
    }
);

materialAdmin.controller("vendorMaintenanceViewController",
    function($rootScope, $scope, $interval, $state , $stateParams, vendorMaintenanceService, constants, growlService) {
        $scope.form_vendorMaintenance_read_only= true;
        $scope.form_vendorMaintenance_required_active = false;

        function dataReady(){
            $scope.objVendorMaintenance = angular.copy($rootScope.objVendorMaintenance);
            var listItem = $($('.lv-item')[$rootScope.vendorMaintenance_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objVendorMaintenance in viewController " + JSON.stringify($scope.objVendorMaintenance));
        }

        $scope.$watch($rootScope.objVendorMaintenance, function() {
            dataReady();
        });


        $scope.editVendorMaintenance = function(){
            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if ($rootScope.objVendorMaintenance.name) {
                $stateParams.name = $rootScope.objVendorMaintenance.name ;
                $state.go('masters.vendorMaintenance.edit',{});
            }
        };

        $scope.deleteVendorMaintenance = function(){
            swal({
                title: "Confirm delete ?",
                text: "vendorMaintenance "+$scope.objVendorMaintenance.name+" will be removed from vendorMaintenance masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteVendorMaintenance(response){
                    if (response.message){
                        growlService.growl(response.message, "success");
                        $state.go('masters.vendorMaintenance',{},{reload:true});
                    }
                }

                function failDeleteVendorMaintenance(response){
                    if (response.message){
                        //growlService.growl(response.message, "danger");
                    }
                }
                vendorMaintenanceService.deleteVendorMaintenance($scope.objVendorMaintenance,succDeleteVendorMaintenance,failDeleteVendorMaintenance);
            });
        };
    }
);

materialAdmin.controller("vendorMaintenanceEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
             $timeout, vendorMaintenanceService, constants, growlService,formValidationgrowlService)
    {
        $scope.form_vendorMaintenance_read_only= false;
        $scope.form_vendorMaintenance_required_active = true;
        $scope.objVendorMaintenance = angular.copy($rootScope.objVendorMaintenance);

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName){
            for (var i=0;i<$rootScope.branchesTrim.length;i++){
                if ($rootScope.branchesTrim[i].name ==branchName){
                    $scope.objVendorMaintenance.branch_id=$rootScope.branchesTrim[i]._id;
                    $scope.objVendorMaintenance.branch_code=$rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objVendorMaintenance.address1.city = $scope.autoCompleteCity1.c;
                    $scope.objVendorMaintenance.address1.district = $scope.autoCompleteCity1.d;
                    $scope.objVendorMaintenance.address1.state = $scope.autoCompleteCity1.st;
                    $scope.objVendorMaintenance.address1.pincode = $scope.autoCompleteCity1.p;
                    $scope.objVendorMaintenance.address1.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);

        $scope.saveVendorMaintenance = function(form) {
            function successUpdateVendorMaintenance(response){
                if(response){
                    var msg = response.message;
                    growlService.growl(msg,"success");
                    $rootScope.getAllVendorMaintenances(false,true,$rootScope.vendorMaintenance_index_selected);
                }
            }

            function failureUpdateVendorMaintenance(response){
                //var msg = response.message;
                //growlService.growl(msg,"danger");
            }

            function prepareDataVendorMaintenanceUpdate(){
                var objVendorMaintenanceCopy = angular.copy($scope.objVendorMaintenance);
                objVendorMaintenanceCopy.last_modified_at = undefined;
                objVendorMaintenanceCopy.created_at = undefined;
                objVendorMaintenanceCopy.__v = undefined;
                objVendorMaintenanceCopy.vendorId = undefined;
                objVendorMaintenanceCopy._id=undefined;
                objVendorMaintenanceCopy.clientId= undefined;
                return objVendorMaintenanceCopy;
            }
            
            if(form.$valid){
            vendorMaintenanceService.updateVendorMaintenance($scope.objVendorMaintenance._id,
                prepareDataVendorMaintenanceUpdate(), successUpdateVendorMaintenance, failureUpdateVendorMaintenance);
            } else {
                  $scope.Mmsg = '';
                  $scope.MaintenanceVendor = true;
                  $scope.Mmsg = formValidationgrowlService.findError(form.$error);   
                  setTimeout(function(){ 
                    if($scope.MaintenanceVendor){
                      $scope.$apply(function() {
                        $scope.MaintenanceVendor = false;
                      });
                    }  
                }, 7000);    
             }
         };
    });







