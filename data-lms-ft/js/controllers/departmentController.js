/**
 * Created by manish on 29/8/16.
 */
materialAdmin.controller("departmentController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, departmentService, URL, client_config, $localStorage) {
        $rootScope.departmentName = "";
        $rootScope.objDepartment=undefined;
        $scope.departments=[];
        $scope.client_config = client_config;
        $rootScope.department_index_selected=0;
        $scope.department_type_ahead_value = "";

        $scope.$watch(function() {
                return $location.path();
            },
            function(a){
                console.log('url has changed: ' + a);
                $scope.currentPath = $location.path();
                if($scope.currentPath == '/usermanage/departments'){
                    $rootScope.form_department = "home";
                    $rootScope.departmentName="";
                    $scope.department_show_add_button = true;
                    $scope.department_show_no_data = true;
                    $scope.objDepartment = undefined;
                    $scope.department_action_tag ="";
                    var listItem = $($('.lv-item')[$rootScope.department_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                }else if($scope.currentPath == '/usermanage/departments/add'){
                    $scope.department_show_add_button = false;
                    $rootScope.departmentName="";
                    $scope.department_show_no_data = false;
                    $rootScope.form_department = "add";
                    $scope.department_action_tag ="Add";
                } else if ($scope.currentPath == '/usermanage/departments/edit'){
                    if ($rootScope.objDepartment) {
                        $scope.department_show_add_button = false;
                        $rootScope.departmentName=$rootScope.objDepartment.name;
                        $scope.department_show_no_data = false;
                        $rootScope.form_department = "edit";
                        $scope.department_action_tag ="Edit";
                    }else{
                        $state.go('usermanage.departments')
                    }
                } else if ($scope.currentPath == '/usermanage/departments/view'){
                    if ($rootScope.objDepartment) {
                        $scope.department_show_add_button = true;
                        $rootScope.departmentName = $rootScope.objDepartment.name ;
                        $scope.department_show_no_data = false;
                        $scope.department_action_tag = "View";
                        $rootScope.form_department = "view";
                    }else{
                        $state.go('usermanage.departments')
                    }
                }
            }
        );

        $scope.selectDepartment = function (department,index) {
            $rootScope.objDepartment = department;
            $rootScope.departmentName = department.name ;
            $rootScope.department_index_selected = index;

            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if (department.name){
                $stateParams.name = department.department ;
                $state.transitionTo('usermanage.departments.view',$stateParams,{reload:'usermanage.departments.view'});
            }
        };

        $scope.addDepartment = function () {
            $state.go('usermanage.departments.add');
        };

        $scope.resetDepartmentName = function () {
            $scope.departmentName ='';
            $rootScope.departmentName='';
            $scope.departmentsReloadOnClear = true;
            $scope.getDepartmentNames('');
        };

        $scope.getDepartmentNames = function(viewValue){
            function sucGetdepartmentNames(response){
                console.log(response);
                $scope.departmentNames = response.data;
            }
            function failGetdepartmentNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.toString().length>1){
                departmentService.getDepartmentNames(viewValue,sucGetdepartmentNames,failGetdepartmentNames);
            } else if (viewValue=='' && $scope.departmentsReloadOnClear){
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.departmentName = '';
                $scope.departmentsReloadOnClear = false;
                //var sUrl = "#!/masters/department";
                //$rootScope.redirect(sUrl);
                $state.go('departments');
                $state.reload();
            }
        };

        $scope.getAllDepartments = function(autoSelect, selectIndex, index, queryObj){
            if (!autoSelect){
                $rootScope.departmentName="";
                $stateParams.name="";
            }
            function succGetDepartments(response){
                console.log(response.data);
                if(response.data && response.data.length>0){
                    $scope.departments = response.data;

                    if (autoSelect) {
                        $scope.selectDepartment(response.data[0], 0);
                    }else if (selectIndex) {
                        $scope.selectDepartment(response.data[index], index);
                    }else { //something was selected previously
                        var listItem = $($('.lv-item')[$rootScope.department_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }
            function failGetDepartments(response){
                console.log(response);
            }
            var queryObj_ = queryObj || {};
            queryObj_.clientId = $localStorage.ft_data.userLoggedIn.clientId;
            departmentService.getDepartments(queryObj_,succGetDepartments,failGetDepartments);
        };

        $scope.onDepartmentTypeAheadSelect = function($item, $model, $label){
            $scope.currentPage = 1;
            $scope.departmentsReloadOnClear = true;
            $rootScope.departmentName = $label;
            var sUrl = "#!/usermanage/departments/view/" + $scope.currentPage + "/" + $label;
            $rootScope.redirect(sUrl);
            $scope.getAllDepartments(true);
        };

        $scope.getAllDepartments(true);
        $rootScope.getAllDepartments = $scope.getAllDepartments;
        $rootScope.selectDepartment = $scope.selectDepartment;
    });

materialAdmin.controller("departmentAddController",
    function($rootScope, $scope, $interval,
             $modal, $state, $timeout, $stateParams,formValidationgrowlService, departmentService, $localStorage, growlService, constants,
             userService) {

        var listItem = $($('.lv-item')[$rootScope.department_index_selected]);
        listItem.removeClass('grn');

        $scope.form_department_read_only= false;
        $scope.form_department_required_active = true;
        $scope.objDepartment = {};

        /******date variables ******/
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
        /******date variables end ******/

        $scope.getUserNames = function(viewValue){
            function sucGetUserNames(response){
                console.log(response);
                $scope.userNames = response.data;
            }
            function failGetUserNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                userService.getUserNames(clientId,viewValue,sucGetUserNames,failGetUserNames);
                console.log("viewvalue" + viewValue);
            }
        };

        $scope.onUserTypeAheadSelect = function($item, option){
            if (option =='dep_head'){
                $timeout(function(){
                    $scope.objDepartment.head_employee_id = $item.userId;
                    $scope.objDepartment.head_id=$item._id;
                });

            }
        };

        $scope.saveDepartment = function(form) {
            function successSaveDepartment(response){
                if(response){
                    var msg = response.message;
                    growlService.growl(msg,"success",2);
                    $rootScope.getAllDepartments(true);
                }
            }
            function failureSaveDepartment(res){
                console.error("failure add department: ",res);
            }
            if(form.$valid){
               $scope.objDepartment.clientId = $localStorage.ft_data.userLoggedIn.clientId;
               departmentService.addDepartment($scope.objDepartment, successSaveDepartment, failureSaveDepartment);
            } else {
              $scope.Dmsg = '';
              $scope.Department = true;
              $scope.Dmsg = formValidationgrowlService.findError(form.$error);   
              setTimeout(function(){ 
                if($scope.Department){
                  $scope.$apply(function() {
                    $scope.Department = false;
                  });
                }  
            }, 7000);    
         }
        };
    }
);

materialAdmin.controller("departmentViewController",
    function($rootScope, $scope, $interval, $state , $stateParams, departmentService,
             constants, growlService, $localStorage) {
        $scope.form_department_read_only= true;
        $scope.form_department_required_active = false;

        function dataReady(){
            $scope.objDepartment = angular.copy($rootScope.objDepartment);
            var listItem = $($('.lv-item')[$rootScope.department_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objDepartment in viewController " + JSON.stringify($scope.objDepartment));
        }

        $scope.$watch($rootScope.objDepartment, function() {
            dataReady();
        });

        /******date variables ******/
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
        /******date variables end ******/

        $scope.editDepartment = function(){
            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if ($rootScope.objDepartment.name) {
                $stateParams.name = $rootScope.objDepartment.department ;
                $state.go('usermanage.departments.edit',{});
            }
        };

        $scope.deleteDepartment = function(){
            swal({
                title: "Confirm delete ?",
                text: "Department "+$scope.objDepartment.name+" will be removed from department masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteDepartment(response){
                    if (response.message){
                        growlService.growl(response.message, "success",2);
                        $state.go('usermanage.departments',{},{reload:true});
                    }
                }

                function failDeleteDepartment(response){
                    if (response.message){
                        //growlService.growl(response.message, "danger");
                    }
                }
                departmentService.deleteDepartment($scope.objDepartment._id,
                    $scope.objDepartment,succDeleteDepartment,failDeleteDepartment);
            });
        };
    }
);


materialAdmin.controller("departmentEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
             $timeout, departmentService, constants,formValidationgrowlService, growlService, $localStorage, userService)
    {
        $scope.form_department_read_only= false;
        $scope.form_department_required_active = true;
        $scope.objDepartment = angular.copy($rootScope.objDepartment);

        /******date variables ******/
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
        /******date variables end ******/


        $scope.getUserNames = function(viewValue){
            function sucGetUserNames(response){
                console.log(response);
                $scope.userNames = response.data;
            }
            function failGetUserNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                userService.getUserNames(clientId,viewValue,sucGetUserNames,failGetUserNames);
                console.log("viewvalue" + viewValue);
            }
        };

        $scope.onUserTypeAheadSelect = function($item, option){
            if (option =='dep_head'){
                $timeout(function(){
                    $scope.objDepartment.head_employee_id = $item.userId;
                    $scope.objDepartment.head_id=$item._id;
                });

            }
        };

        $scope.saveDepartment = function(form) {
            function prepareEditDataDep(){
                var objDepartmentCopy = angular.copy($scope.objDepartment);
                objDepartmentCopy .last_modified_at = undefined;
                objDepartmentCopy .created_at = undefined;
                objDepartmentCopy .__v = undefined;
                objDepartmentCopy ._id=undefined;
                objDepartmentCopy .clientId= undefined;
                return objDepartmentCopy ;
            }

            function successUpdateDepartment(response){
                if(response){
                    var msg = response.message;
                    growlService.growl(msg,"success",2);
                    $rootScope.getAllDepartments(false,true, $rootScope.department_index_selected);
                }
            }

            function failureUpdateDepartment(response){
                //var msg = response.message;
                //growlService.growl(msg,"danger");
            }
            if(!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)){
               departmentService.updateDepartment($scope.objDepartment._id,
                prepareEditDataDep(), successUpdateDepartment, failureUpdateDepartment);
             } else {
                  $scope.Dmsg = '';
                  $scope.Department = true;
                  $scope.Dmsg = formValidationgrowlService.findError(form.$error);   
                  setTimeout(function(){ 
                    if($scope.Department){
                      $scope.$apply(function() {
                        $scope.Department = false;
                      });
                    }  
                }, 7000);    
             }
        };
    });
