/**
 * Created by manish on 8/8/16.
 */

materialAdmin.controller("userController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
             $timeout, userService, URL, client_config,$localStorage, roleService, departmentService) {
        $rootScope.userName = "";
        $rootScope.objUser=undefined;
        $scope.userPassButton = false;
        $rootScope.fileURLUser = URL.FILE_URL_CLIENT;
        $scope.users=[];
        $scope.client_config = client_config;
        $scope.localStorage = $localStorage;
        $rootScope.user_index_selected=0;
        $scope.user_type_ahead_value = "";
        $rootScope.tab_active_user =1;

        $scope.$watch(function() {
                return $location.path();
            },
            function(a){
                console.log('url has changed: ' + a);
                $scope.currentPath = $location.path();
                if($scope.currentPath == '/usermanage/users'){
                    $rootScope.form_user = "home";
                    $rootScope.userName="";
                    $scope.user_show_add_button = true;
                    $scope.user_show_no_data = true;
                    $scope.objUser = undefined;
                    $scope.user_action_tag ="";
                    var listItem = $($('.lv-item')[$rootScope.user_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                }else if($scope.currentPath == '/usermanage/users/add'){
                    $scope.user_show_add_button = false;
                    $rootScope.userName="";
                    $scope.user_show_no_data = false;
                    $rootScope.form_user = "add";
                    $scope.user_action_tag ="Add";
                } else if ($scope.currentPath == '/usermanage/users/edit'){
                    if ($rootScope.objUser) {
                        $scope.user_show_add_button = false;
                        $rootScope.userName=$rootScope.objUser.full_name;
                        $scope.user_show_no_data = false;
                        $rootScope.form_user = "edit";
                        $scope.user_action_tag ="Edit";
                    }else{
                        $state.go('usermanage.users')
                    }
                } else if ($scope.currentPath == '/usermanage/users/view'){
                    if ($rootScope.objUser) {
                        $scope.user_show_add_button = true;
                        $rootScope.userName = $rootScope.objUser.full_name ;
                        $scope.user_show_no_data = false;
                        $scope.user_action_tag = "View";
                        $rootScope.form_user = "view";
                    }else{
                        $state.go('usermanage.users')
                    }
                }
            }
        );

        function getDepartmentTrims(){
            function sucGetUserNames(response){
                console.log(response);
                $rootScope.departmentTrims = response.data;
            }
            function failGetUserNames(response){
                console.log(response);
            }

            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            departmentService.getDepartmentTrims({"clientId":clientId},sucGetUserNames,failGetUserNames);
        }
        getDepartmentTrims();

        /*function getRoleNames(){
            function sucGetRoleNames(response){
                console.log(response);
                $rootScope.rolesTrim = response.data;
            }
            function failGetRoleNames(response){
                console.log(response);
            }

            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            roleService.getRolesTrim(clientId,sucGetRoleNames,failGetRoleNames);
        }
        getRoleNames();*/

		$scope.getAllRoles = function() {
			function succGetRoles(response) {
				if (response.data && response.data.length > 0) {
					$scope.rolesTrim = response.data
				}
			}

			function failGetRoles(response) {
				console.log(response)
			}
			roleService.getRoles(succGetRoles, failGetRoles)
		}()


        $rootScope.selectTabUser = function(index){
            $rootScope.tab_active_user =index;
        };

        $scope.selectUser = function (user,index) {
            $rootScope.objUser = user;
            $rootScope.userName = user.full_name ;
            $rootScope.user_index_selected = index;

            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if (user.full_name){
                $stateParams.name = user.full_name ;
                $state.transitionTo('usermanage.users.view',$stateParams,{reload:'usermanage.users.view'});
            }
        };

        $scope.addUser = function () {
            $scope.userPassButton = true;
            $state.go('usermanage.users.add');
        };

        $scope.resetUserName = function () {
            $scope.userName ='';
            $rootScope.userName='';
            $scope.usersReloadOnClear = true;
            $scope.getUserNames('');
        };

        $scope.getUserNames = function(viewValue){
            function sucGetuserNames(response){
                console.log(response);
                $scope.userNames = response.data;
            }
            function failGetuserNames(response){
                console.log(response);
            }
            if(viewValue && viewValue.toString().length>1){
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                userService.getUserNames(clientId,viewValue,sucGetuserNames,failGetuserNames);
            } else if (viewValue=='' && $scope.usersReloadOnClear){
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.userName = '';
                $scope.usersReloadOnClear = false;
                //var sUrl = "#!/masters/user";
                //$rootScope.redirect(sUrl);
                //$state.go('users');
                $state.reload();
            }
        };

        function prepareFilterObject(){
            var myFilter = {
              "not_show" : "Driver"
            };
            if($scope.userId){
                myFilter.userId = $scope.userId
            }
            return myFilter;
        };

        $scope.getAllUsers = function(autoSelect,selectIndex,index, queryObj){
            if (!autoSelect){
                $rootScope.userName="";
                $stateParams.name="";
            }
            function succGetUsers(response){
                console.log(response.data);
                if(response.data && response.data.length>0){
                    $scope.users = response.data;

                    if (autoSelect) {
                        $scope.selectUser(response.data[0], 0);
                        //something was selected previously
                    }else if (selectIndex) {
                        $scope.selectUser(response.data[index], index);
                        //something was selected previously
                    }
                    else{
                        var listItem = $($('.lv-item')[$rootScope.user_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }
            function failGetUsers(response){
                console.log(response);
            }
            userService.getUsers(prepareFilterObject(),succGetUsers,failGetUsers);
        };

        $scope.onUserTypeAheadSelect = function($item, $model, $label){
                $scope.currentPage = 1;
                $scope.usersReloadOnClear = true;
                $rootScope.userName = $label;
                $scope.userId = $item.userId;
                //var sUrl = "#!/usermanage/users/view/" + $scope.currentPage + "/" + $label;
                //$rootScope.redirect(sUrl);
                $scope.getAllUsers(true);
        };

        $scope.getAllUsers(true);
        $rootScope.getAllUsers = $scope.getAllUsers;
        $rootScope.selectUser = $scope.selectUser;
    });

materialAdmin.controller("userAddController",
    function($rootScope, $scope, $interval,
             $modal, $state, $timeout, $stateParams, userService,formValidationgrowlService, $localStorage, growlService, constants) {

        var listItem = $($('.lv-item')[$rootScope.user_index_selected]);
        listItem.removeClass('grn');

        $rootScope.tab_active_user=1;
        $scope.localStorage = $localStorage;
        $scope.userPassButton = true;
        $scope.form_user_read_only= false;
        $scope.form_user_required_active = true;
        $scope.objUser = {};

        $scope.objUser.pc_allotted = true;
        $scope.objUser.seat_allotted = true;

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

        $scope.autoCompleteCallbackCurrCity = function(){
            if ($scope.autoCompleteCurrCity){
                $timeout(function() {
                    $scope.objUser.current_address.city = $scope.autoCompleteCurrCity.c;
                    $scope.objUser.current_address.district = $scope.autoCompleteCurrCity.d;
                    $scope.objUser.current_address.state = $scope.autoCompleteCurrCity.st;
                    $scope.objUser.current_address.pincode = $scope.autoCompleteCurrCity.p;
                    $scope.objUser.current_address.country = $scope.autoCompleteCurrCity.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackPermCity = function(){
            if ($scope.autoCompletePermCity){
                $timeout(function() {
                    $scope.objUser.permanent_address.city = $scope.autoCompletePermCity.c;
                    $scope.objUser.permanent_address.district = $scope.autoCompletePermCity.d;
                    $scope.objUser.permanent_address.state = $scope.autoCompletePermCity.st;
                    $scope.objUser.permanent_address.pincode = $scope.autoCompletePermCity.p;
                    $scope.objUser.permanent_address.country = $scope.autoCompletePermCity.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCurrCity'], $scope.autoCompleteCallbackCurrCity);
        var gAPI2 = new googlePlaceAPI($interval);
        gAPI2.fight($scope,['autoCompletePermCity'], $scope.autoCompleteCallbackPermCity);


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
            if (option =='hr_name'){
                $timeout(function(){
                    $scope.objUser.hr_manager_employee_code = $item.userId;
                    $scope.objUser.hr_manager_id=$item._id;
                });

            }else if (option=='ra_name'){
                $timeout(function () {
                    $scope.objUser.ra_employee_code = $item.userId;
                    $scope.objUser.ra_id=$item._id;
                });
            }
        };

        $scope.saveUser = function(form) {
            if (form && form.$valid) {
                function successSaveUser(response) {
                    if (response && response.data) {
                        $rootScope.objUser = response.data;
                        $scope.objUser = response.data;
                        var msg = response.message;
                        //swal("Saved",msg,"success");
                        growlService.growl(msg, "success", 2);
                        $scope.getAllUsers(true);
                    }
                }

                function failureSaveUser(res) {
                    console.error("failure add user: ", res);
                }

                // if tab1 is active
                if ($rootScope.tab_active_user===1) {  // if tab1 is active, register user first
                    userService.addUser($scope.objUser, successSaveUser, failureSaveUser);
                    console.log('user service add sent' + JSON.stringify($scope.objUser));
                }
            } else {
                $scope.Umsg = '';
                $scope.userMngmt = true;
                $scope.Umsg = formValidationgrowlService.findError(form.$error);
                setTimeout(function(){
                    if($scope.userMngmt){
                        $scope.$apply(function() {
                            $scope.userMngmt = false;
                        });
                    }
                }, 7000);
            }
        };
    }
);

materialAdmin.controller("userEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
             $timeout, userService, constants, growlService, $localStorage, formValidationgrowlService)
    {
        $scope.form_user_read_only= false;
        $scope.form_user_required_active = true;
        $scope.objUser = angular.copy($rootScope.objUser);
        $scope.originalUserCopy = angular.copy($rootScope.objUser);
        $scope.localStorage = $localStorage;

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

        /***google autocomplete places ****/
        $scope.autoCompleteCallbackCurrCity = function(){
            if ($scope.autoCompleteCurrCity){
                $timeout(function() {
                    $scope.objUser.current_address.city = $scope.autoCompleteCurrCity.c;
                    $scope.objUser.current_address.district = $scope.autoCompleteCurrCity.d;
                    $scope.objUser.current_address.state = $scope.autoCompleteCurrCity.st;
                    $scope.objUser.current_address.pincode = $scope.autoCompleteCurrCity.p;
                    $scope.objUser.current_address.country = $scope.autoCompleteCurrCity.cnt;
                })
            }
        };
        $scope.autoCompleteCallbackPermCity = function(){
            if ($scope.autoCompletePermCity){
                $timeout(function() {
                    $scope.objUser.permanent_address.city = $scope.autoCompletePermCity.c;
                    $scope.objUser.permanent_address.district = $scope.autoCompletePermCity.d;
                    $scope.objUser.permanent_address.state = $scope.autoCompletePermCity.st;
                    $scope.objUser.permanent_address.pincode = $scope.autoCompletePermCity.p;
                    $scope.objUser.permanent_address.country = $scope.autoCompletePermCity.cnt;
                })
            }
        };
        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope,['autoCompleteCurrCity'], $scope.autoCompleteCallbackCurrCity);
        var gAPI2 = new googlePlaceAPI($interval);
        gAPI2.fight($scope,['autoCompletePermCity'], $scope.autoCompleteCallbackPermCity);

        /**** google auto complete ends  ****/

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
            if (option =='hr_name'){
                $timeout(function(){
                    $scope.objUser.hr_manager_employee_code = $item.userId;
                    $scope.objUser.hr_manager_id=$item._id;
                });

            }else if (option=='ra_name'){
                $timeout(function () {
                    $scope.objUser.ra_employee_code = $item.userId;
                    $scope.objUser.ra_id=$item._id;
                });
            }
        };

        $scope.saveUser = function(form) {
            if (!(form.$error.required) && !(form.$error.maxlength)
                && !(form.$error.minlength) && !(form.$error.email)) {
                function successUpdateUser(response) {
                    if (response && response.data) {
                        $scope.objUser = response.data;
                        $rootScope.objUser = response.data;
                        var msg = response.message;
                        console.log("Updated user " + JSON.stringify($scope.objUser));
                        growlService.growl(msg, "success");
                        $rootScope.getAllUsers(false, true, $rootScope.user_index_selected);
                    }
                }

                function failureUpdateUser(response) {
                    //var msg = response.message;
                    //growlService.growl(msg,"danger");
                }

                function prepareDataUserUpdate() {
                    var objUserCopy = angular.copy($scope.objUser);
                    objUserCopy.last_modified_at = undefined;
                    objUserCopy.created_at = undefined;
                    objUserCopy.__v = undefined;
                    objUserCopy.userId = undefined;
                    objUserCopy._id = undefined;
                    objUserCopy.clientId = undefined;
                    /**Do not send role and department for update if not changed. Required at back-end**/
                    if (objUserCopy.role && objUserCopy.department
                        && objUserCopy.role === $scope.originalUserCopy.role
                        && objUserCopy.department ===$scope.originalUserCopy.department){
                        delete objUserCopy.role;
                        delete objUserCopy.department;
                    }
                    return objUserCopy;
                }

                if ($scope.tab_active_user!==4) {  //if document upload tab is not active
                    userService.updateUser($scope.objUser._id, prepareDataUserUpdate(),
                        successUpdateUser, failureUpdateUser);
                } else { // upload documents
                    var fd = new FormData();
                    if ($scope.previous_comp_salary_slip) {
                        fd.append('previous_comp_salary_slip', $scope.user_logo);
                    }
                    if ($scope.id_proof) {
                        fd.append('id_proof', $scope.user_favicon);
                    }
                    if ($scope.pf_account) {
                        fd.append('pf_account', $scope.user_billing_doc);
                    }
                    if ($scope.pan_proof) {
                        fd.append('pan_proof', $scope.user_pan_doc);
                    }
                    if ($scope.user_tin_doc) {
                        fd.append('dob_proof', $scope.user_tin_doc);
                    }
                    var data = {};
                    data.fileUpload = true;
                    data.formData = fd;
                    data._id = $scope.objUser._id;
                    userService.uploadUserDocs(data, successUpdateUser, failureUpdateUser);
                }
            } else {
                $scope.Umsg = '';
                $scope.userMngmt = true;
                $scope.Umsg = formValidationgrowlService.findError(form.$error);
                setTimeout(function(){
                    if($scope.userMngmt){
                        $scope.$apply(function() {
                            $scope.userMngmt = false;
                        });
                    }
                }, 7000);
            }
        };
    });

materialAdmin.controller("userViewController",
    function($rootScope, $scope, $interval, $localStorage, $state , $stateParams, userService, constants, growlService) {
        $scope.form_user_read_only= true;
        $scope.form_user_required_active = false;
        $scope.userPassButton = false;
        $scope.localStorage = $localStorage;

        $rootScope.tab_active_user=1;

        function dataReady(){
            $scope.objUser = angular.copy($rootScope.objUser);
            var listItem = $($('.lv-item')[$rootScope.user_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objUser in viewController " + JSON.stringify($scope.objUser));
        }

        $scope.$watch($rootScope.objUser, function() {
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

        $scope.editUser = function(){
            $scope.userPassButton = false;
            if(!$stateParams.skip){
                $stateParams.skip = 1;
            }
            if ($rootScope.objUser.full_name) {
                $stateParams.name = $rootScope.objUser.full_name ;
                $state.go('usermanage.users.edit',{});
            }
        };

        $scope.deleteUser = function(){
            swal({
                title: "Confirm delete ?",
                text: "user "+$scope.objUser.name+" will be removed from user masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                function succDeleteUser(response){
                    if (response.message){
                        growlService.growl(response.message, "success");
                        $state.go('usermanage.users',{},{reload:true});
                    }
                }

                function failDeleteUser(response){
                    if (response.message){
                        //growlService.growl(response.message, "danger");
                    }
                }
                userService.deleteUser($scope.objUser,succDeleteUser,failDeleteUser);
            });
        };

        $scope.changePassword = function(){
            $scope.openModal('views/client/changePassword.html');
        };
    }
);

materialAdmin.controller("changePassCtrl",
    function($rootScope, $scope, $interval, $state , $stateParams, $timeout, clientService, growlService,
             formValidationgrowlService) {
        $scope.user = {};
        function success(response){
            if(response && response.data && response.data.message){
                var msg = response.message;
                $scope.closeModal();
                swal("Updated",msg,"success");
                viewClient();
            }
        }

        function failure(response){
            var msg = response.data.message;
            swal("Updation failed",msg,"failure");
            console.error("failure in updation: ",res);
        }

        $scope.changePassword = function(form){
            if(form.$valid){
                if($scope.user.newPassword == $scope.user.new1Password){
                    clientService.changePassword($scope.user, success, failure);
                } else {
                    $scope.password = 'New Password and Confirm New Password not match';
                    $scope.changePass = true;
                    setTimeout(function(){
                        if($scope.changePass){
                            $scope.$apply(function() {
                                $scope.changePass = false;
                            });
                        }
                    }, 7000);
                }
            } else {
                $scope.password = '';
                $scope.changePass = true;
                $scope.password = formValidationgrowlService.findError(form.$error);
                setTimeout(function(){
                    if($scope.changePass){
                        $scope.$apply(function() {
                            $scope.changePass = false;
                        });
                    }
                }, 7000);
            }
        };
    });







