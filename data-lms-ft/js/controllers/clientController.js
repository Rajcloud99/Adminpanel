/**
 * Created by manish on 8/8/16.
 */
materialAdmin.controller("clientController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
        $timeout, clientService, URL, userLoggedIn, $uibModal, client_config, roleService, $localStorage) {
        $rootScope.clientName = "";
        $rootScope.objClient = undefined;
        $rootScope.tab_active_client = 1;
        $scope.fileURLClient = URL.FILE_URL_CLIENT;

        $scope.clients = [];
        $rootScope.client_index_selected = 0;
        $scope.client_type_ahead_value = "";
        $scope.userLoggedIn = userLoggedIn;
        $scope.client_config = client_config;


        $scope.$watch(function() {
                return $location.path();
            },
            function(a) {
                //console.log('url has changed: ' + a);
                $scope.currentPath = $location.path();
                if ($scope.currentPath == '/clients/clientInfo') {
                    $scope.show_password_button = false;
                    $rootScope.form_client = "home";
                    $rootScope.clientName = "";
                    $scope.client_show_add_button = true;
                    $scope.client_show_no_data = true;
                    $scope.objClient = undefined;
                    $scope.client_action_tag = "";
                    var listItem = $($('.lv-item')[$rootScope.client_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                } else if ($scope.currentPath == '/clients/clientInfo/add') {
                    $scope.show_password_button = true;
                    $scope.client_show_add_button = false;
                    $rootScope.clientName = "";
                    $scope.client_show_no_data = false;
                    $scope.tab1_active_client = true;
                    $rootScope.form_client = "add";
                    $scope.client_action_tag = "Add";
                } else if ($scope.currentPath == '/clients/clientInfo/edit') {
                    $scope.show_password_button = false;
                    $scope.client_show_add_button = false;
                    $rootScope.clientName = $rootScope.objClient.client_display_name;
                    $scope.client_show_no_data = false;
                    $rootScope.form_client = "edit";
                    $scope.client_action_tag = "Edit";
                } else if ($scope.currentPath == '/clients/clientInfo/view') {
                    $scope.show_password_button = true;
                    if ($rootScope.objClient) {
                        $rootScope.clientName = $rootScope.objClient.client_display_name;
                        $scope.client_show_add_button = true;
                        if ($rootScope.objClient && $rootScope.objClient.client_display_name) {
                            $rootScope.clientName = $rootScope.objClient.client_display_name;
                        }
                        $scope.client_show_no_data = false;
                        $scope.client_action_tag = "View";
                        $rootScope.form_client = "view";
                    } else {
                        $state.go('clients.clientInfo.add')
                    }
                }
            }
        );

        $rootScope.selectTabClient = function(index) {
            $rootScope.tab_active_client = index;
        };

        //Used for Searching
        function prepareFilterObject(queryObj, isPagination) {
            var myFilter = {};
            if ($rootScope.clientName) {
                myFilter.client_display_name = $scope.clientName;
            } else if ($stateParams.name) {
                myFilter.client_display_name = $stateParams.name;
                $scope.clientName = $stateParams.name;
            } else if (queryObj) {
                for (var key in queryObj) {
                    myFilter[key] = queryObj[key];
                }
            }
            if (isPagination && $scope.currentPage) {
                myFilter.skip = $scope.currentPage;
            } else if ($stateParams.skip) {
                myFilter.skip = $stateParams.skip;
                $scope.currentPage = $stateParams.skip;
            }
            return myFilter;
        }

        $scope.selectClient = function(client, index) {
            $rootScope.objClient = client;
            $rootScope.clientName = client.client_display_name;
            $rootScope.client_index_selected = index;

            if (!$stateParams.skip) {
                $stateParams.skip = 1;
            }
            if (client.client_display_name) {
                $stateParams.name = client.client_display_name;
                $state.transitionTo('clients.clientInfo.view', $stateParams, { reload: 'clients.clientInfo.view' });
            }
        };

        function getRoleNames() {
            function sucGetRoleNames(response) {
                //console.log(response);
                $rootScope.rolesTrim = response.data;
            }

            function failGetRoleNames(response) {
                console.log(response);
            }

            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
        }
        getRoleNames();

        $scope.addClient = function() {
            $scope.show_password_button = true;
            $state.go('clients.clientInfo.add');
        };

        $scope.resetClientName = function() {
            $scope.clientName = '';
            $rootScope.clientName = '';
            $scope.clientsReloadOnClear = true;
            $scope.getClientNames('');
        };

        $scope.getClientNames = function(viewValue) {
            function sucGetclientNames(response) {
                //console.log(response);
                $scope.clientNames = response.data;
            }

            function failGetclientNames(response) {
                console.log(response);
            }
            if (viewValue && viewValue.toString().length > 1) {
                clientService.getClientNames(viewValue, sucGetclientNames, failGetclientNames);
            } else if (viewValue == '' && $scope.clientsReloadOnClear) {
                $scope.currentPage = 1;
                $stateParams.name = '';
                $scope.clientName = '';
                $scope.clientsReloadOnClear = false;
                //var sUrl = "#!/masters/client";
                //$rootScope.redirect(sUrl);
                $state.go('clients.clientInfo.view');
                $state.reload();
            }
        };

        $scope.getAllClients = function(autoSelect, queryObj, isPagination) {
            if (!autoSelect) {
                $rootScope.clientName = "";
                $stateParams.name = "";
            }

            function succGetClients(response) {
                //console.log(response.data);
                if (response.data && response.data.length > 0) {
                    $scope.clients = response.data;

                    if (autoSelect) {
                        $scope.selectClient(response.data[0], 0);
                        //something was selected previously
                    } else {
                        var listItem = $($('.lv-item')[$rootScope.client_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }

            function failGetClients(response) {
                console.log(response);
            }
            var oFilter = prepareFilterObject(queryObj, isPagination);
            clientService.getClients(oFilter, succGetClients, failGetClients);
        };

        $scope.onClientTypeAheadSelect = function($item, $model, $label) {
            $scope.currentPage = 1;
            $scope.clientsReloadOnClear = true;
            /*$rootScope.clientName = $label;
            var sUrl = "#!/clients/clientInfo/view/"+$scope.currentPage +"/" + $label;
            $rootScope.redirect(sUrl);*/
            $scope.getAllClients(true);
        };

        $scope.getAllClients(true);
        $rootScope.getAllClients = $scope.getAllClients;
        $rootScope.selectClient = $scope.selectClient;

        $scope.addVehicletype = function() {
            $rootScope.selectedClient = $rootScope.objClient;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/client/vehicleTypePop.html',
                controller: 'clientVehTypeCtrl'
            });
        }
    });

materialAdmin.controller("clientVehTypeCtrl", function($rootScope, $scope, $localStorage, growlService, $uibModalInstance, $interval, clientService, $state) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getVehTypeAll = function() {
        function succ(response) {
            //console.log(response);
            $scope.aVehType = response.data;
        }

        function fail(response) {
            console.log(response);
        }

        var data = {};
        data.clientId = $rootScope.selectedClient.clientId;

        clientService.getAllVehTypeServ(data, succ, fail);
    };
    $scope.getVehTypeAll();

    var UserDATA = $localStorage.ft_data.userLoggedIn;
    if (UserDATA) {
        $scope.person = UserDATA.full_name;
    }

    $scope.addVehTypeSel = function() {
        if ($scope.aVehType && $scope.aVehType.length > 0) {
            for (var v = 0; v < $scope.aVehType.length; v++) {
                if ($scope.aVehType[v].avlClient == true) {
                    $scope.aVehType[v].availableClient = false;
                    /*if($scope.aVehType[v].clientInfo && $scope.aVehType[v].clientInfo.length>0){
                        for(var c=0;c<$scope.aVehType[v].clientInfo.length;c++){
                            if($scope.aVehType[v].clientInfo[c].clientId == $rootScope.selectedClient.clientId){
                                $scope.aVehType[v].availableClient = true;
                            }
                        }
                    }*/
                    if ($scope.aVehType[v].clientInfo && $scope.aVehType[v].clientInfo.length > 0) {

                    } else {
                        $scope.aVehType[v].clientInfo = [];
                    }
                    if ($scope.aVehType[v].availableClient == false) {
                        var info = {};
                        info.clientId = $rootScope.selectedClient.clientId;
                        info.sName = $scope.aVehType[v].sName;
                        $scope.aVehType[v].clientInfo.push(info);
                        delete $scope.aVehType[v].sName;
                        delete $scope.aVehType[v].avlClient;
                        delete $scope.aVehType[v].availableClient;
                    }
                } else if ($scope.aVehType[v].avlClient == false) {
                    if ($scope.aVehType[v].clientInfo && $scope.aVehType[v].clientInfo.length > 0) {
                        for (var c = 0; c < $scope.aVehType[v].clientInfo.length; c++) {
                            if ($scope.aVehType[v].clientInfo[c].clientId == $rootScope.selectedClient.clientId) {
                                $scope.aVehType[v].clientInfo.splice(c, 1);
                                delete $scope.aVehType[v].sName;
                                delete $scope.aVehType[v].avlClient;
                                delete $scope.aVehType[v].availableClient;
                            }
                        }
                    }
                }
            }
        }


        function succ(res) {
            swal('Vehicle Added Successfully!!!', '', 'success');
            $uibModalInstance.dismiss('cancel');
            $state.reload();
        };

        function fail(res) {
            console.log(res);
        };
        //console.log($scope.aVehType);
        clientService.updateMultiVehTypes({ vehTypes: $scope.aVehType }, succ, fail);
    }

});

materialAdmin.controller("clientAddController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams, formValidationgrowlService, $timeout, clientService, constants) {

        var listItem = $($('.lv-item')[$rootScope.client_index_selected]);
        listItem.removeClass('grn');

        $rootScope.tab_active_client = 1;

        $scope.form_client_read_only = false;
        $scope.form_client_required_active = true;
        $scope.objClient = {};
        $scope.objClient.address = {};
        //$scope.apps_accessible={};

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
        $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        /******date variables end ******/

        $scope.autoCompleteCallback = function() {
            if ($scope.autoCompleteCity) {
                $timeout(function() {
                    $scope.objClient.address.city = $scope.autoCompleteCity.c;
                    $scope.objClient.address.district = $scope.autoCompleteCity.d;
                    $scope.objClient.address.state = $scope.autoCompleteCity.st;
                    $scope.objClient.address.pincode = $scope.autoCompleteCity.p;
                    $scope.objClient.address.country = $scope.autoCompleteCity.cnt;
                })
            }
        };

        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallback);

        $scope.saveClient = function(form) {

            function successSaveClient(response) {
                if (response && response.data) {
                    $rootScope.objClient = response.data;
                    var msg = response.message;
                    swal("Saved", msg, "success");
                    $rootScope.getAllClients(true);
                    //$scope.viewClient();

                }
            }

            function failureSaveClient(res) {
                console.error("failure add client: ", res);
            }

            // if tab1 is active
            if ($scope.tab_active_client === 1) { // if tab1 is active
                if (form.$valid) {
                    clientService.addClient($scope.objClient, successSaveClient, failureSaveClient);
                    //console.log('client service add sent' + JSON.stringify($scope.objClient));
                } else {
                    $scope.Cmsg = '';
                    $scope.ClientShow = true;
                    $scope.Cmsg = formValidationgrowlService.findError(form.$error);
                    setTimeout(function() {
                        if ($scope.ClientShow) {
                            $scope.$apply(function() {
                                $scope.ClientShow = false;
                            });
                        }
                    }, 7000);
                }

            } else if ($scope.tab_active_client === 2) {
                clientService.updateClient($scope.objClient, successSaveClient, failureSaveClient);
                //console.log('client service add sent' + JSON.stringify($scope.objClient));
            } else if ($scope.tab_active_client === 3) {
                clientService.updateClient($scope.objClient, successSaveClient, failureSaveClient);
                //console.log('client service add sent' + JSON.stringify($scope.objClient));
            } else if ($scope.tab_active_client === 4) {
                clientService.updateClient($scope.objClient, successSaveClient, failureSaveClient);
                //console.log('client service add sent' + JSON.stringify($scope.objClient));
            } else if ($scope.tab_active_client === 5) {
                clientService.updateClient($scope.objClient, successSaveClient, failureSaveClient);
                //console.log('client service add sent' + JSON.stringify($scope.objClient));
            }
        };

        $scope.clearForm = function() {
            $scope.objClient = {};
            $scope.objClient.address = {};
            $scope.apps_accessible = {};
        }
    }
);

materialAdmin.controller("clientEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams, $timeout, clientService, formValidationgrowlService,
        $uibModal, $timeout) {
        $scope.form_client_read_only = false;
        $scope.form_client_required_active = true;
        $scope.objClient = angular.copy($rootScope.objClient);

        //$scope.apps_accessible ={};
        $scope.client_logo = $scope.objClient.client_logo;
        $scope.client_favicon = $scope.objClient.client_favicon;
        $scope.client_billing_doc = $scope.objClient.client_billing_doc;
        $scope.client_tin_doc = $scope.objClient.client_tin_doc;
        $scope.client_pan_doc = $scope.objClient.client_pan_doc;

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
        $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        /******date variables end ******/

        /***google autocomplete places ****/
        //noinspection JSUnresolvedVariable
        $scope.autoCompleteCallback = function() {
            if ($scope.autoCompleteCity) {
                $timeout(function() {
                    $scope.objClient.address.city = $scope.autoCompleteCity.c;
                    $scope.objClient.address.district = $scope.autoCompleteCity.d;
                    $scope.objClient.address.state = $scope.autoCompleteCity.st;
                    $scope.objClient.address.pincode = $scope.autoCompleteCity.p;
                    $scope.objClient.address.country = $scope.autoCompleteCity.cnt;
                })
            }
        };

        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallback);
        /**** google auto completee ends  ****/

        $scope.saveClient = function(form) {
            function viewClient() {
                if (!$stateParams.skip) {
                    $stateParams.skip = 1;
                }
                if ($rootScope.objClient.client_display_name) {
                    $stateParams.name = $rootScope.objClient.client_display_name;
                    var sUrl = "#!/clients/clientInfo/view";
                    $rootScope.redirect(sUrl);
                }
            }

            function successUpdateClient(response) {
                if (response && response.data) {
                    $scope.objClient = response.data;
                    $rootScope.objClient = response.data;
                    var msg = response.message;
                    //console.log("Updated client "+ JSON.stringify($scope.objClient));
                    swal("Updated", msg, "success");
                    $rootScope.getAllClients(false);
                    viewClient();
                }
            }

            function failureUpdateClient(response) {
                var msg = response.message;
                swal("Updation failed", msg, "failure");
                console.error("failure add client: ", res);
            }

            if ($scope.tab_active_client !== 5) { //if document upload tab is not activ
                //  if(form.$valid){
                clientService.updateClient($scope.objClient, successUpdateClient, failureUpdateClient);
                //console.log('clientService update sent' + JSON.stringify($scope.objClient));
                /*  } else {
                        $scope.Cmsg = '';
                        $scope.ClientShow = true;
                        $scope.Cmsg = formValidationgrowlService.findError(form.$error);
                        setTimeout(function(){
                          if($scope.ClientShow){
                            $scope.$apply(function() {
                              $scope.ClientShow = false;
                            });
                          }
                      }, 7000);
                   }
                   */
            } else { // upload documents
                var fd = new FormData();
                if ($scope.client_logo) {
                    fd.append('client_logo', $scope.client_logo);
                }
                if ($scope.client_favicon) {
                    fd.append('client_favicon', $scope.client_favicon);
                }
                if ($scope.client_billing_doc) {
                    fd.append('client_billing_doc', $scope.client_billing_doc);
                }
                if ($scope.client_pan_doc) {
                    fd.append('client_pan_doc', $scope.client_pan_doc);
                }
                if ($scope.client_tin_doc) {
                    fd.append('client_tin_doc', $scope.client_tin_doc);
                }
                var data = {};
                data.fileUpload = true;
                data.formData = fd;
                data._id = $scope.objClient._id;
                clientService.uploadClientDocs(data, successUpdateClient, failureUpdateClient);
            }
        };

        $scope.callPreview = function(logo) {
            $rootScope.preview(logo);

        }
    });

materialAdmin.controller("clientViewController",
    function($rootScope, $scope, $interval, $state, $stateParams, $timeout, clientService, growlService, constants) {
        $scope.form_client_read_only = true;
        $scope.form_client_required_active = false;
        $scope.apps_accessible = {};

        $rootScope.tab_active_client = 1;

        $scope.callPreview = function(logo) {
            $rootScope.preview(logo);
        }

        function dataReady() {
            $scope.objClient = angular.copy($rootScope.objClient);
            var listItem = $($('.lv-item')[$rootScope.client_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
        }

        $scope.$watch(function() {
            return $rootScope.objClient;
        }, function() {
            dataReady();
        });

        $scope.objFTData = constants.FTData;

        //console.log(JSON.stringify($scope.objClient));

        $scope.editClient = function() {
            $scope.show_password_button = false;
            if (!$stateParams.skip) {
                $stateParams.skip = 1;
            }
            if ($rootScope.objClient.client_display_name) {
                $stateParams.name = $rootScope.objClient.client_display_name;
                //var sUrl = "#!/masters/client/edit";
                $state.go('clients.clientInfo.edit', {});
            }
        };

        $scope.deleteClient = function() {
            swal({
                title: "Confirm delete ?",
                text: "client " + $scope.objClient.name + " will be removed from client masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function() {
                function succDeleteClient(response) {
                    if (response.message) {
                        growlService.growl(response.message, "success", 2);
                        $state.go('clients.clientInfo.view', {}, { reload: true });
                    }
                }

                function failDeleteClient(response) {
                    if (response.message) {
                        growlService.growl(response.message, "danger", 2);
                    }
                }

                clientService.deleteClient($scope.objClient, succDeleteClient, failDeleteClient);
            });
        };
    }
);

materialAdmin.controller("ImageModalController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams, $timeout, clientService, formValidationgrowlService,
        $uibModalInstance, $timeout, $window) {
        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        /*if($rootScope.pdf1){
          window.open($rootScope.pdf1,'pdf','resizable=1');
          setTimeout(function(){
                $scope.closeModal();
             }, 10);

        }*/

        $scope.downloadPDF = function() {
            window.open($rootScope.image1, 'pdf', 'resizable=1');
        }

    });
