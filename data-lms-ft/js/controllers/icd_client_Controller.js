/**
 * Created by manish on 31/8/16.
 */
/**
 * Created by manish on 30/8/16.
 */

materialAdmin.controller("icdController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, icdService, URL, client_config,$localStorage) {
        $rootScope.icdName = "";
        $rootScope.objICD=undefined;
        $rootScope.fileURLICD = URL.FILE_URL_CLIENT;
        $scope.icds=[];
        $scope.client_config = client_config;
        $rootScope.icd_index_selected=0;
        $scope.icd_type_ahead_value = "";
        
        $scope.currentPage = 1;
            $scope.maxSize = 3;
            $scope.items_per_page = 10;
            $scope.pageChanged = function() {
             $scope.getAllICDs(true);
        };

        function prepareFilterObject(){
           var myFilter = {};
           if($scope.icdTypeAheadValue){
              myFilter.port_name = $scope.icdTypeAheadValue;
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
                if($scope.currentPath == '/clients/icds'){
                    $rootScope.form_icd = "home";
                    $rootScope.icdName="";
                    $scope.icd_show_add_button = true;
                    $scope.icd_show_no_data = true;
                    $scope.objICD = undefined;
                    $scope.icd_action_tag ="";
                    var listItem = $($('.lv-item')[$rootScope.icd_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                }else if($scope.currentPath == '/clients/icds/add'){
                    $scope.icd_show_add_button = false;
                    $rootScope.icdName="";
                    $scope.icd_show_no_data = false;
                    $rootScope.form_icd = "add";
                    $scope.icd_action_tag ="Add";
                } else if ($scope.currentPath == '/clients/icds/edit'){
                    if ($rootScope.objICD) {
                        $scope.icd_show_add_button = false;
                        $rootScope.icdName=$rootScope.objICD.port_name;
                        $scope.icd_show_no_data = false;
                        $rootScope.form_icd = "edit";
                        $scope.icd_action_tag ="Edit";
                    }else{
                        $state.go('clients.icd')
                    }
                } else if ($scope.currentPath == '/clients/icds/view'){
                    if ($rootScope.objICD) {
                        $scope.icd_show_add_button = true;
                        $rootScope.icdName = $rootScope.objICD.port_name ;
                        $scope.icd_show_no_data = false;
                        $scope.icd_action_tag = "View";
                        $rootScope.form_icd = "view";
                    }else{
                        $state.go('clients.icd')
                    }
                }
            }
        );

        $scope.selectICD = function (icd,index) {
            $rootScope.objICD = icd;
            $rootScope.icdName = icd.port_name ;
            $rootScope.icd_index_selected = index;

            if (icd.port_name){
                $stateParams.name = icd.port_name ;
                $state.transitionTo('clients.icd.view',$stateParams,{reload:'clients.icd.view'});
            }
        };

        $scope.addICD = function () {
            $state.go('clients.icd.add');
        };

        $scope.resetICDName = function () {
            $scope.icdName ='';
            $rootScope.icdName='';
            $scope.icdsReloadOnClear = true;
            $scope.getICDNames('');
        };



        $scope.getICDNames = function(viewValue){
            function sucGeticdNames(response){
                console.log(response);
                $scope.icdNames = response.data;
            }
            function failGeticdNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.toString().length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                icdService.getICDNames(clientId,viewValue,sucGeticdNames,failGeticdNames);
            } else if (viewValue=='' && $scope.icdsReloadOnClear){
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.icdName = '';
                $scope.icdsReloadOnClear = false;
                //var sUrl = "#!/clients/icds";
                //$rootScope.redirect(sUrl);
                /*$state.go('icds');
                $state.reload();*/
                $scope.getAllICDs(true);
            }
        };

        $scope.getAllICDs = function(autoSelect,selectIndex,index, queryObj){
            if (!autoSelect){
                $rootScope.icdName="";
                $stateParams.name="";
            }
            function succGetICDs(response){
                console.log(response.data);
                if(response.data){
                    $scope.icds = response.data;
                }
                if(response.data && response.data.length>0){
                    $scope.icds = response.data;
                    $scope.total_pages = response.pages;
                    $scope.totalItems = 15*response.pages;

                    if (autoSelect) {
                        $scope.selectICD(response.data[0], 0);
                        //something was selected previously
                    }else if (selectIndex) {
                        $scope.selectICD(response.data[index], index);
                        //something was selected previously
                    }
                    else{
                        var listItem = $($('.lv-item')[$rootScope.icd_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }
            function failGetICDs(response){
                console.log(response);
            }
            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            var queryOb = prepareFilterObject();
            queryOb.clientId = clientId;
            icdService.getICDs(queryOb,succGetICDs,failGetICDs);
        };

        $scope.onICDTypeAheadSelect = function($item, $model, $label){
            $scope.currentPage = 1;
            $scope.icdsReloadOnClear = true;
            $rootScope.icdName = $label;
            /*var sUrl = "#!/clients/icds/view/" + $scope.currentPage + "/" + $label;
            $rootScope.redirect(sUrl);*/
            $scope.getAllICDs(true);
        };

        $scope.getAllICDs(true);
        $rootScope.getAllICDs = $scope.getAllICDs;
        $rootScope.selectICD = $scope.selectICD;
    });



materialAdmin.controller("icdAddController",
    function($rootScope, $scope, $interval,
             $modal, $state, $timeout,formValidationgrowlService, $stateParams, icdService, $localStorage, growlService, constants) {

        var listItem = $($('.lv-item')[$rootScope.icd_index_selected]);
        listItem.removeClass('grn');

        $scope.form_icd_read_only= false;
        $scope.form_icd_required_active = true;
        $scope.objICD = {};
        $scope.objICD.address={};

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objICD.address.city = $scope.autoCompleteCity1.c;
                    $scope.objICD.address.district = $scope.autoCompleteCity1.d;
                    $scope.objICD.address.state = $scope.autoCompleteCity1.st;
                    $scope.objICD.address.pincode = $scope.autoCompleteCity1.p;
                    $scope.objICD.address.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);

        $scope.saveICD = function(form) {
            function successSaveICD(response){
                if(response && response.data){
                    var msg = response.message;
                    //swal("Saved",msg,"success");
                    growlService.growl(msg,"success");
                    $rootScope.getAllICDs(true);
                }
            }
            function failureSaveICD(res){
                console.error("failure add icd: ",res);
            }
            
            $scope.objICD.clientId = $localStorage.ft_data.userLoggedIn.clientId;
            if(form.$valid){
            icdService.addICD($scope.objICD, successSaveICD, failureSaveICD);
            } else {
              $scope.msg = '';
              $scope.createIcdmsg = true;
              $scope.msg = formValidationgrowlService.findError(form.$error);   
              setTimeout(function(){ 
                if($scope.createIcdmsg){
                  $scope.$apply(function() {
                    $scope.createIcdmsg = false;
                  });
                }  
            }, 7000);    
         }
        };
    }
);

materialAdmin.controller("icdViewController",
    function($rootScope, $scope, $interval, $state , $stateParams, icdService, constants, growlService) {
        $scope.form_icd_read_only= true;
        $scope.form_icd_required_active = false;

        function dataReady(){
            $scope.objICD = angular.copy($rootScope.objICD);
            var listItem = $($('.lv-item')[$rootScope.icd_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objICD in viewController " + JSON.stringify($scope.objICD));
        }

        $scope.$watch($rootScope.objICD, function() {
            dataReady();
        });


        $scope.editICD = function(){
            if ($rootScope.objICD.port_name) {
                $state.go('clients.icd.edit',{});
            }
        };

        $scope.deleteICD = function(){
            swal({
                title: "Confirm delete ?",
                text: "icd "+$scope.objICD.name+" will be removed from icd clients",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteICD(response){
                    if (response.message){
                        growlService.growl(response.message, "success");
                        $state.go('clients.icd',{},{reload:true});
                    }
                }

                function failDeleteICD(response){
                    if (response.message){
                        //growlService.growl(response.message, "danger");
                    }
                }
                icdService.deleteICD($scope.objICD,succDeleteICD,failDeleteICD);
            });
        };
    }
);

materialAdmin.controller("icdEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
             $timeout, icdService, constants, growlService,formValidationgrowlService)
    {
        $scope.form_icd_read_only= false;
        $scope.form_icd_required_active = true;
        $scope.objICD = angular.copy($rootScope.objICD);
        

        $scope.autoCompleteCallbackCity1 = function(){
            if ($scope.autoCompleteCity1){
                $timeout(function() {
                    $scope.objICD.address.city = $scope.autoCompleteCity1.c;
                    $scope.objICD.address.district = $scope.autoCompleteCity1.d;
                    $scope.objICD.address.state = $scope.autoCompleteCity1.st;
                    $scope.objICD.address.pincode = $scope.autoCompleteCity1.p;
                    $scope.objICD.address.country = $scope.autoCompleteCity1.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCity1'], $scope.autoCompleteCallbackCity1);

        $scope.saveICD = function(form) {
            function successUpdateICD(response){
                if(response){
                    var msg = response.message;
                    growlService.growl(msg,"success");
                    $rootScope.getAllICDs(false,true,$rootScope.icd_index_selected);
                }
            }

            function failureUpdateICD(response){
                //var msg = response.message;
                //growlService.growl(msg,"danger");
            }

            function prepareDataICDUpdate(){
                var objICDCopy = angular.copy($scope.objICD);
                objICDCopy.last_modified_at = undefined;
                objICDCopy.created_at = undefined;
                objICDCopy.__v = undefined;
                objICDCopy.vendorId = undefined;
                objICDCopy._id=undefined;
                objICDCopy.clientId= undefined;
                return objICDCopy;
            }
            
            if(form.$valid){
                icdService.updateICD($scope.objICD._id,
                prepareDataICDUpdate(), successUpdateICD, failureUpdateICD);
            } else {
              $scope.msg = '';
              $scope.createIcdmsg = true;
              $scope.msg = formValidationgrowlService.findError(form.$error);   
              setTimeout(function(){ 
                if($scope.createIcdmsg){
                  $scope.$apply(function() {
                    $scope.createIcdmsg = false;
                  });
                }  
            }, 7000);    
         }
        };
    });







