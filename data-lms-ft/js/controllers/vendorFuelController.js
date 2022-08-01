/**
 * Created by manish on 30/8/16.
 */

materialAdmin.controller("vendorFuelController",
    function($rootScope, $stateParams, $state, $scope, $window, $location,
        $timeout, vendorFuelService, URL, DatePicker, client_config, $localStorage, branchService) {
        $rootScope.vendorFuelName = "";
        $rootScope.objVendorFuel = undefined;
        $rootScope.fileURLVendorFuel = URL.FILE_URL_CLIENT;
        $scope.vendorFuels = [];
        $scope.client_config = client_config;
        $rootScope.vendorFuel_index_selected = 0;
        $scope.vendorFuel_type_ahead_value = "";
		$scope.DatePicker = angular.copy(DatePicker); // initialize pagination

        $scope.currentPage = 1;
        $scope.maxSize = 3;
        $scope.items_per_page = 10;
        $scope.pageChanged = function() {
            $scope.getAllVendorFuels(true);
        };

        function prepareFilterObject() {
            var myFilter = {};
            if ($scope.vendorFuelTypeAheadValue) {
                myFilter.name = $scope.vendorFuelTypeAheadValue;
            }

            if ($scope.currentPage) {
                myFilter.skip = $scope.currentPage;
            }
            return myFilter;
        };

        $scope.$watch(function() {
                return $location.path();
            },
            function(a) {
                console.log('url has changed: ' + a);
                $scope.currentPath = $location.path();
                if ($scope.currentPath == '/masters/vendorFuel') {
                    $rootScope.form_vendorFuel = "home";
                    $rootScope.vendorFuelName = "";
                    $scope.vendorFuel_show_add_button = true;
                    $scope.vendorFuel_show_no_data = true;
                    $scope.objVendorFuel = undefined;
                    $scope.vendorFuel_action_tag = "";
                    var listItem = $($('.lv-item')[$rootScope.vendorFuel_index_selected]);
                    listItem.siblings().removeClass('grn');
                    listItem.removeClass('grn');
                } else if ($scope.currentPath == '/masters/vendorFuel/add') {
                    $scope.vendorFuel_show_add_button = false;
                    $rootScope.vendorFuelName = "";
                    $scope.vendorFuel_show_no_data = false;
                    $rootScope.form_vendorFuel = "add";
                    $scope.vendorFuel_action_tag = "Add";
                } else if ($scope.currentPath == '/masters/vendorFuel/edit') {
                    if ($rootScope.objVendorFuel) {
                        $scope.vendorFuel_show_add_button = false;
                        $rootScope.vendorFuelName = $rootScope.objVendorFuel.name;
                        $scope.vendorFuel_show_no_data = false;
                        $rootScope.form_vendorFuel = "edit";
                        $scope.vendorFuel_action_tag = "Edit";
                    } else {
                        $state.go('masters.vendorFuel')
                    }
                } else if ($scope.currentPath == '/masters/vendorFuel/view') {
                    if ($rootScope.objVendorFuel) {
                        $scope.vendorFuel_show_add_button = true;
                        $rootScope.vendorFuelName = $rootScope.objVendorFuel.name;
                        $scope.vendorFuel_show_no_data = false;
                        $scope.vendorFuel_action_tag = "View";
                        $rootScope.form_vendorFuel = "view";
                    } else {
                        $state.go('masters.vendorFuel')
                    }
                }
            }
        );

        $scope.selectVendorFuel = function(vendorFuel, index) {
            $rootScope.objVendorFuel = vendorFuel;
            $rootScope.vendorFuelName = vendorFuel.name;
            $rootScope.vendorFuel_index_selected = index;

            if (!$stateParams.skip) {
                $stateParams.skip = 1;
            }
            if (vendorFuel.name) {
                $stateParams.name = vendorFuel.name;
                $state.transitionTo('masters.vendorFuel.view', $stateParams, { reload: 'masters.vendorFuel.view' });
            }
        };

        $scope.addVendorFuel = function() {
            $state.go('masters.vendorFuel.add');
        };

        $scope.resetVendorFuelName = function() {
            $scope.vendorFuelName = '';
            $rootScope.vendorFuelName = '';
            $scope.vendorFuelsReloadOnClear = true;
            $scope.getVendorFuelNames('');
        };

        $scope.getAllVendorFuels = function(autoSelect, selectIndex, index) {
            if (!autoSelect) {
                $rootScope.vendorFuelName = "";
                $stateParams.name = "";
            }

            function succGetVendorFuels(response) {
                console.log(response.data);
                if (response.data) {
                    $scope.vendorFuels = response.data;
                }
                if (response.data && response.data.length > 0) {
                    $scope.vendorFuels = response.data;
                    $scope.total_pages = response.pages;
                    $scope.totalItems = 15 * response.pages;
                    setTimeout(function() {
                        listItem = $($('.lv-item')[0]);
                        listItem.addClass('grn');
                    }, 500);

                    if (autoSelect) {
                        $scope.selectVendorFuel(response.data[0], 0);
                        //something was selected previously
                    } else if (selectIndex) {
                        $scope.selectVendorFuel(response.data[index], index);
                        //something was selected previously
                    } else {
                        var listItem = $($('.lv-item')[$rootScope.vendorFuel_index_selected]);
                        listItem.siblings().removeClass('grn');
                        listItem.addClass('grn');
                    }
                }
            }

            function failGetVendorFuels(response) {
                console.log(response);
            }
            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            var queryObj = prepareFilterObject();
            queryObj.clientId = clientId;
            vendorFuelService.getVendorFuels(queryObj, succGetVendorFuels, failGetVendorFuels);
        };

        $scope.getVendorFuelNames = function(viewValue) {
            function sucGetvendorFuelNames(response) {
                console.log(response);
                $scope.vendorFuelNames = response.data;
            }

            function failGetvendorFuelNames(response) {
                console.log(response);
            }
            if (viewValue && viewValue.toString().length > 1) {
                var clientId = $localStorage.ft_data.userLoggedIn.clientId;
                vendorFuelService.getVendorFuelNames(clientId, viewValue, sucGetvendorFuelNames, failGetvendorFuelNames);
            } else if (viewValue == '' && $scope.vendorFuelsReloadOnClear) {
                $scope.currentPage = 1;
                //$stateParams.name = '';
                $scope.vendorFuelName = '';
                $scope.vendorFuelsReloadOnClear = false;
                //var sUrl = "#!/masters/vendorFuel";
                //$rootScope.redirect(sUrl);
                /*$state.go('vendorFuels');
                $state.reload();*/
                $scope.getAllVendorFuels(true);
            }
        };

        $scope.onVendorFuelTypeAheadSelect = function($item, $model, $label) {
            $scope.currentPage = 1;
            $scope.vendorFuelsReloadOnClear = true;
            $rootScope.vendorFuelName = $label;
            /*var sUrl = "#!/masters/vendorFuel/view/" + $scope.currentPage + "/" + $label;
            $rootScope.redirect(sUrl);*/
            $scope.getAllVendorFuels(true);
        };

        $scope.getAllVendorFuels(true);
        $rootScope.getAllVendorFuels = $scope.getAllVendorFuels;
        $rootScope.selectVendorFuel = $scope.selectVendorFuel;

        function getBranchesTrim() {
            function sucGetBranchesTrim(response) {
                console.log(response);
                $rootScope.branchesTrim = response.data;
            }

            function failGetBranchesTrim(response) {
                console.log(response);
            }

            var clientId = $localStorage.ft_data.userLoggedIn.clientId;
            branchService.getBranchesTrim({ "clientId": clientId }, sucGetBranchesTrim, failGetBranchesTrim);
        }
        getBranchesTrim();
    });

materialAdmin.controller("vendorFuelAddController",
    function($rootScope, $scope, $interval,
        $modal, $state, $timeout, $stateParams, formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils) {

        var listItem = $($('.lv-item')[$rootScope.vendorFuel_index_selected]);
        listItem.removeClass('grn');

        $scope.form_vendorFuel_read_only = false;
        $scope.form_vendorFuel_required_active = true;
        $scope.objVendorFuel = {};
        $scope.objFuelData = {};
        $scope.objVendorFuel.address = {};

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

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName) {
            for (var i = 0; i < $rootScope.branchesTrim.length; i++) {
                if ($rootScope.branchesTrim[i].name == branchName) {
                    $scope.objVendorFuel.branch_id = $rootScope.branchesTrim[i]._id;
                    $scope.objVendorFuel.branch_code = $rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity = function() {
            if ($scope.autoCompleteCity) {
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
        gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallbackCity);

        $scope.saveVendorFuel = function(form) {
            function successSaveVendorFuel(response) {
                if (response && response.data) {
                    var msg = response.message;
                    //swal("Saved",msg,"success");
                    growlService.growl(msg, "success");
                    $rootScope.getAllVendorFuels(true);
                }
            }

            function failureSaveVendorFuel(res) {
                console.error("failure add vendorFuel: ", res);
            }

            var fuel_price_matrix = [];
            for (var i = 1; i < 6; i++) {
                if ($scope.objFuelData["fuel_type" + i.toString()] != null &&
                    $scope.objFuelData["price" + i.toString()] != null) {
                    var obj = {};
                    obj["fuel_type"] = $scope.objFuelData["fuel_type" + i.toString()];
                    obj["price"] = $scope.objFuelData["price" + i.toString()];
                    fuel_price_matrix.push(obj);
                }
            }



            $scope.objVendorFuel.fuel_price_matrix = fuel_price_matrix;
            $scope.objVendorFuel.clientId = $localStorage.ft_data.userLoggedIn.clientId;

            if (form.$valid) {
                vendorFuelService.addVendorFuel($scope.objVendorFuel, successSaveVendorFuel, failureSaveVendorFuel);
            } else {
                $scope.Fmsg = '';
                $scope.fuelVendor = true;
                $scope.Fmsg = formValidationgrowlService.findError(form.$error);
                setTimeout(function() {
                    if ($scope.fuelVendor) {
                        $scope.$apply(function() {
                            $scope.fuelVendor = false;
                        });
                    }
                }, 7000);
            }
        };
    }
);

materialAdmin.controller("vendorFuelViewController",
    function($rootScope, $scope, $interval, $state, $stateParams, vendorFuelService, constants, growlService) {
        $scope.form_vendorFuel_read_only = true;
        $scope.form_vendorFuel_required_active = false;
        $scope.objFuelData = {};

        function initFuelData() {
            for (var i = 0; i < $scope.objVendorFuel.fuel_price_matrix.length; i++) {
                var obj = $scope.objVendorFuel.fuel_price_matrix[i];
                $scope.objFuelData["fuel_type" + (i + 1).toString()] = obj["fuel_type"];
                $scope.objFuelData["price" + (i + 1).toString()] = obj["price"];
            }
        }

        function dataReady() {
            $scope.objVendorFuel = angular.copy($rootScope.objVendorFuel);
            initFuelData();
            var listItem = $($('.lv-item')[$rootScope.vendorFuel_index_selected]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
            console.log("objVendorFuel in viewController " + JSON.stringify($scope.objVendorFuel));
        }

        $scope.$watch($rootScope.objVendorFuel, function() {
            dataReady();
        });

        $scope.editVendorFuel = function() {
            if (!$stateParams.skip) {
                $stateParams.skip = 1;
            }
            if ($rootScope.objVendorFuel.name) {
                $stateParams.name = $rootScope.objVendorFuel.name;
                $state.go('masters.vendorFuel.edit', {});
            }
        };

        $scope.deleteVendorFuel = function() {
            swal({
                title: "Confirm delete ?",
                text: "vendorFuel " + $scope.objVendorFuel.name + " will be removed from vendorFuel masters",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function() {
                function succDeleteVendorFuel(response) {
                    if (response.message) {
                        growlService.growl(response.message, "success");
                        $state.go('masters.vendorFuel', {}, { reload: true });
                    }
                }

                function failDeleteVendorFuel(response) {
                    if (response.message) {
                        //growlService.growl(response.message, "danger");
                    }
                }
                vendorFuelService.deleteVendorFuel($scope.objVendorFuel, succDeleteVendorFuel, failDeleteVendorFuel);
            });
        };
    }
);

materialAdmin.controller("vendorFuelEditController",
    function($rootScope, $scope, $interval, $modal, $state, $stateParams,
        $timeout, vendorFuelService, constants, growlService, formValidationgrowlService) {
        $scope.form_vendorFuel_read_only = false;
        $scope.form_vendorFuel_required_active = true;
        $scope.objVendorFuel = angular.copy($rootScope.objVendorFuel);
        $scope.objFuelData = {};

        function initFuelData() {
            for (var i = 0; i < $scope.objVendorFuel.fuel_price_matrix.length; i++) {
                var obj = $scope.objVendorFuel.fuel_price_matrix[i];
                $scope.objFuelData["fuel_type" + (i + 1).toString()] = obj["fuel_type"];
                $scope.objFuelData["price" + (i + 1).toString()] = obj["price"];
            }
        }
        initFuelData();

        //on branch selection, loop and set other variables
        $scope.branchSelected = function(branchName) {
            for (var i = 0; i < $rootScope.branchesTrim.length; i++) {
                if ($rootScope.branchesTrim[i].name == branchName) {
                    $scope.objVendorFuel.branch_id = $rootScope.branchesTrim[i]._id;
                    $scope.objVendorFuel.branch_code = $rootScope.branchesTrim[i].code;
                }
            }
        };

        $scope.autoCompleteCallbackCity = function() {
            if ($scope.autoCompleteCity) {
                $timeout(function() {
                    $scope.objVendorFuel.address1.city = $scope.autoCompleteCity.c;
                    $scope.objVendorFuel.address1.district = $scope.autoCompleteCity.d;
                    $scope.objVendorFuel.address1.state = $scope.autoCompleteCity.st;
                    $scope.objVendorFuel.address1.pincode = $scope.autoCompleteCity.p;
                    $scope.objVendorFuel.address1.country = $scope.autoCompleteCity.cnt;
                })
            }
        };

        var gAPI = new googlePlaceAPI($interval);
        gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallbackCity);

        $scope.saveVendorFuel = function(form) {
            function successUpdateVendorFuel(response) {
                if (response) {
                    var msg = response.message;
                    growlService.growl(msg, "success");
                    $rootScope.getAllVendorFuels(false, true, $rootScope.vendorFuel_index_selected);
                }
            }

            function failureUpdateVendorFuel(response) {
                //var msg = response.message;
                //growlService.growl(msg,"danger");
            }


            var fuel_price_matrix = [];
            for (var i = 1; i < 6; i++) {
                var obj = {};
                obj["fuel_type"] = $scope.objFuelData["fuel_type" + i.toString()];
                obj["price"] = $scope.objFuelData["price" + i.toString()];
                fuel_price_matrix.push(obj);
            }

            $scope.objVendorFuel.fuel_price_matrix = fuel_price_matrix;

            function prepareDataVendorFuelUpdate() {
                var objVendorFuelCopy = angular.copy($scope.objVendorFuel);
                objVendorFuelCopy.last_modified_at = undefined;
                objVendorFuelCopy.created_at = undefined;
                objVendorFuelCopy.__v = undefined;
                objVendorFuelCopy.vendorId = undefined;
                objVendorFuelCopy._id = undefined;
                objVendorFuelCopy.clientId = undefined;
                return objVendorFuelCopy;
            }

            if (form.$valid) {
                vendorFuelService.updateVendorFuel($scope.objVendorFuel._id,
                    prepareDataVendorFuelUpdate(), successUpdateVendorFuel, failureUpdateVendorFuel);
            } else {
                $scope.Fmsg = '';
                $scope.fuelVendor = true;
                $scope.Fmsg = formValidationgrowlService.findError(form.$error);
                setTimeout(function() {
                    if ($scope.fuelVendor) {
                        $scope.$apply(function() {
                            $scope.fuelVendor = false;
                        });
                    }
                }, 7000);
            }
        };
    });





/***** ajay update *******/
materialAdmin.controller("fuelCommonController", function($rootScope, $stateParams, $state, DatePicker, growlService, $scope, $window, $location, $timeout, vendorFuelService, URL, $localStorage, branchService) {
    $("p").text("Fuel Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantprofile = true;
    $rootScope.wantReg = false;
    $rootScope.wantThisEdit = false;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.items_per_page = 15;
    $scope.oFilter = {};
	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
	$scope.aStatus = ['Active', 'Inactive'];
	$scope.oFilter.status = 'Active';
    $scope.pageChanged = function() {
        $scope.getAllVendorFuels(true);
    };
	function prepareFilter(){
		var myFilter = {};
		// myFilter.vendorId = $rootScope.selectedFuelVendorData.vendorId;
		myFilter.fuel_vendor_id = $rootScope.selectedFuelVendorData._id;
		myFilter.sort = {
			$natural: -1
		};
		return myFilter;

	}

	$scope.getFuelStation = function() {
		let request = prepareFilter();
		function successGetStation(response) {
			if (response && response.data) {
				$scope.aFuelStations = response.data.data;
			}
		}

		function failGetStation(res) {
			//console.error("failure add vendorFuel: ",res);
			var msg = res.data.message;
			//swal("Saved",msg,"success");
			growlService.growl(msg, "success");
		}
		vendorFuelService.GetFuelStationObj(request, successGetStation, failGetStation);
	};

    function prepareFilterObject(isPagination) {
        var myFilter = {};
        if ($scope.vendorData) {
            myFilter._id = $scope.vendorData._id;
        }
		if ($scope.oFilter.status) {
			myFilter.status = $scope.oFilter.status;
		}
        if (isPagination && $scope.currentPage) {
            myFilter.skip = $scope.currentPage;
        }

        return myFilter;
    };

    $rootScope.getAllVendorFuels = function(isPagination) {
        function succGetVendorFuels(response) {
            console.log(response.data);
            /* if (response.data) {
                $scope.vendorFuels = response.data;
            } */
            if (response.data) {
                $scope.vendorFuels = response.data;
                $scope.total_pages = response.pages;
                $scope.totalItems = $scope.items_per_page * response.pages;
                $rootScope.selectedFuelVendorData = response.data[0];
                $scope.getFuelStation();
                setTimeout(function() {
                    listItem = $($('.lv-item')[0]);
                    listItem.addClass('grn');
                }, 500);
            }
        }

        function failGetVendorFuels(response) {
            console.log(response);
        }
        var queryObj = prepareFilterObject(isPagination);
        vendorFuelService.getVendorFuels(queryObj, succGetVendorFuels, failGetVendorFuels);
    };
    $rootScope.getAllVendorFuels();




    $scope.selectFuelV = function(vendorF, index) {
        var sUrl = "#!/masters/vendorFuelCommon/profile";
        $rootScope.redirect(sUrl);
        $rootScope.selectedFuelVendorData = vendorF;
        $scope.getFuelStation();
        listItem = $($('.lv-item')[index]);
        listItem.siblings().removeClass('grn');
        listItem.addClass('grn');

    };

    $rootScope.formateDate = function(date) {
        return new Date(date);
    };

    function successVehicleByName(response) {
        $scope.aVendorNames = response.data;
    }

    function failVehicleByName(response) {
        //
    }

    $scope.getVendorByName = function(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            vendorFuelService.getVendorFuels({ name: viewValue, all: true }, successVehicleByName, failVehicleByName);
        } else if (viewValue == '') {
            $rootScope.getAllVendorFuels();
        }
    };

    $scope.onSelect = function($item, $model, $label) {
        $scope.vendorData = $item;
        $rootScope.getAllVendorFuels();
    };

    $scope.clearSearch = function() {
        delete $scope.vendorData;
        $rootScope.getAllVendorFuels();
    };

});

materialAdmin.controller("fuelProfileCtrl", function(
	$rootScope,
	$stateParams,
	$state,
	$scope,
	$uibModal,
	$modal,
	lazyLoadFactory,
	vendorFuelService)
{
    $("p").text("Fuel Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantprofile = true;
    $rootScope.wantReg = false;
    $rootScope.wantThisEdit = false;
    $scope.index = 0;
    $scope.updateStation = updateStation;
    $scope.oFilter = {};
	$scope.selectType = 'index';
	$scope.aFuelCompany = ["Bio Diesel","BPCL", "Essar","HPCL", "IOCL", "RIL"];
	$scope.lazyLoad = lazyLoadFactory(); // init lazyload

	$scope.columnSetting = {
		allowedColumn: [
			'Effective Date',
			'Fuel Type',
			'Fuel Price',
		]
	};
	$scope.tableApi = {};
	$scope.tableHead = [
		{
			'header': 'Effective Date',
			'bindingKeys': 'effective_date',
			'date': 'dd-MMM-yyyy'
		},
		{
			'header': 'Fuel Type',
			'bindingKeys': 'fuel_type'
		},
		{
			'header': 'Fuel Price',
			'bindingKeys': 'fuel_price'
		},
	];

	$scope.getFuelStation = function(isGetActive,download = false) {

		if(!download && !$scope.lazyLoad.update(isGetActive))
			return;

		let request = prepareFilter();
		if(download){
			request.download = true;
			vendorFuelService.GetFuelStationObj(request, res => {
					var a = document.createElement('a');
					a.href = res.data.url;
					a.download = res.data.url;
					a.target = '_blank';
					a.click();
				}, err => {
					console.log(err);
					swal(err.data.status,err.data.message,'error');
				});
			}
			else {
			vendorFuelService.GetFuelStationObj(request, successGetStation, failGetStation);
		}
		function successGetStation(response) {
			if (response && response.data) {
				response = response.data;
				$scope.lazyLoad.putArrInScope.call($scope, isGetActive, response);
				$scope.aSelectedStation = response.data;
			}
		}

		function failGetStation(res) {
			console.error("failure add vendorFuel: ", res);
		}

	}

	function prepareFilter() {
		let myFilter = {};

		if ($scope.oFilter.start_date) {
			myFilter.from = $scope.oFilter.start_date.toISOString();
		}
		if ($scope.oFilter.end_date) {
			myFilter.to = $scope.oFilter.end_date.toISOString();
		}

		// myFilter.vendorId = $rootScope.selectedFuelVendorData.vendorId;
		myFilter.fuel_vendor_id = $rootScope.selectedFuelVendorData._id;
		myFilter.skip = $scope.lazyLoad.getCurrentPage();
		myFilter.sort = {
			$natural: -1
		};

		return myFilter;
	}

	function updateStation(type = 'add') {

		// vm.aSelectedTrips refer to array of advances

		let selectedAdv = $scope.aSelectedStation;

		if (type === 'delete') {
			var request = {};
			request = $scope.aSelectedStation;
			request._id = $scope.aSelectedStation._id;

			swal({
					title: 'Are you sure you want to delete this price?',
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
						vendorFuelService.deleteFuelStation(request, onSuccess, onFailure);

						function onFailure(err) {
							swal('Error', err.data.message, 'error');
						}

						function onSuccess(res) {
							swal('Success', res.data.message, 'success');
							$scope.getFuelStation();
						}
					}
				});
			return;
		}

		$modal.open({
			templateUrl: 'views/vendorFuel/fuelStationUpsertPopUp.html',
			controller: ['$rootScope','$scope','$localStorage', '$uibModalInstance', 'callback','DatePicker', 'modelDetail', 'otherData', 'vendorFuelService', fuelStationUpsertController],
			controllerAs: 'fuelVm',
			resolve: {
				callback: function () {
					return function (oTrip) {
						return new Promise(function (resolve, reject) {

						});
					}
				},
				modelDetail: function () {
					return {
						type
					};
				},
				otherData: function () {
					return {
						selectedAdv
					};
				}
			}
		}).result.then(function (response) {
			console.log('close', response);
			$scope.getFuelStation();
		}, function (data) {
			console.log('cancel', data);
		});
	}

    $scope.$watch(function() {
        return $rootScope.selectedFuelVendorData;
    }, function() {
        try {
            $scope.selectedFuelVendorData = $rootScope.selectedFuelVendorData;
        } catch (e) {}
    }, true);

    $scope.selectRow = function(index){
    	$scope.index = index;
	};

	$scope.showHistory = function (fuelStationObj) {
		console.log(fuelStationObj);
		$uibModal.open({
			templateUrl: 'views/vendorFuel/vendorFuelHistory.html',
			controller: ['$scope', '$uibModalInstance', 'fuelStationObj', vendorFuelHistoryCtrl],
			resolve: {
				fuelStationObj: function() {
					return fuelStationObj;
				}
			}
		}).result.then(function(data) {
			// success
		}, function(data) {
			// error
		});
	}

});

function fuelStationUpsertController(
	$rootScope,
	$scope,
	$localStorage,
	$uibModalInstance,
	callback,
	DatePicker,
	modelDetail,
	otherData,
	vendorFuelService,
) {
	let vm = this;

	vm.closeModal = closeModal;
	vm.submit = submit;
	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination
	vm.aFuelType = ["Petrol", "Diesel", "CNG"];
    vm.selectedAdv = otherData.selectedAdv;
    vm.name = $rootScope.selectedFuelVendorData.name;


	//Actual Function
	function closeModal() {
		$uibModalInstance.dismiss();
	}


	function submit(formData) {

		vm.date = new Date();
        if(vm.objStation.effective_date)
		 vm.date = moment(vm.objStation.effective_date, 'DD/MM/YYYY').startOf('day').toISOString();

			let request = {
				clientId: $rootScope.selectedFuelVendorData.clientId,
				fuel_vendor_id: $rootScope.selectedFuelVendorData._id,
				vendorId: $rootScope.selectedFuelVendorData.vendorId,
		        fuel_type: vm.objStation.fuel_type,
				fuel_price: vm.objStation.fuel_price,
				effective_date: vm.date
			}
		vendorFuelService.addFuelStation(request, onSuccess, onFailure);

		function onFailure(err) {
			swal('Error', err.data.message, 'error');
			reject(err.data.message);
		}

		function onSuccess(res) {
			console.log(res);
			swal('Success', res.data.message, 'success');
			$uibModalInstance.dismiss();
			resolve(res.data);

		}

			// callback(request)
			// 	.then(function (res) {
			// 		$uibModalInstance.close(res);
			// 	})
			// 	.catch(function (err) {
			// 		console.log(err);
			// 	});

		}
}

materialAdmin.controller("fuelVendorAddCtrl", function($rootScope, $uibModal, $scope, $interval, $modal, $state, $timeout, $stateParams, accountingService, formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils) {
    $("p").text("Fuel Vendor");
    $rootScope.wantThis = true;
    $rootScope.wantprofile = false;
    $rootScope.wantReg = true;
    $rootScope.wantThisEdit = false;
    $scope.objVendorFuel = {};
    $scope.objVendorFuel.account = {};
    $scope.objFuelData = {};
    $scope.aBanking = [];
    $scope.objVendorFuel.address = {};
    $scope.objVendorFuel.status = "Active";
	$scope.aFuelCompany = ["Bio Diesel","BPCL", "Essar","HPCL", "IOCL", "RIL"];

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


    $scope.addBank = function(bank) {
        $scope.aBanking.push(bank);
        $scope.banking = {};
    }
    $scope.removeBank = function(index) {
        $scope.aBanking.splice(index, 1);
    }

    //$scope.getAllBranchSelect();

    $scope.autoCompleteCallbackCity = function() {
        if ($scope.autoCompleteCity) {
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
    gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallbackCity);

    $scope.saveVendorFuel = function(vfData) {

        function successSaveVendorFuel(response) {
            if (response && response.data) {
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg, "success");
                $rootScope.getAllVendorFuels();
                $rootScope.vendorData = response.data;
                var sUrl = "#!/masters/vendorFuelCommon/profile";
                $rootScope.redirect(sUrl);
            }
        }

        function failureSaveVendorFuel(res) {
            console.error("failure add vendorFuel: ", res);
        }
        if ($scope.aBanking && $scope.aBanking.length > 0) {
            $scope.objVendorFuel.banking_details = $scope.aBanking;
        }

        $scope.objVendorFuel.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        console.log($scope.objVendorFuel);
        vendorFuelService.addVendorFuel($scope.objVendorFuel, successSaveVendorFuel, failureSaveVendorFuel);
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
					isGroup: false,
					// group: 'Vendor'
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
					if($scope.objVendorFuel.account && $scope.objVendorFuel.account._id && !$scope.aAccountMaster.find( o => o._id === $scope.objVendorFuel.account._id))
						$scope.aAccountMaster.unshift($scope.objVendorFuel.account);
				}
			})();

			function onSelectAccount() {
				$scope.objVendorFuel.account = {};
				var modalInstance = $uibModal.open({
					templateUrl: 'views/accounting/accountMasterUpsert.html',
					controller: 'accountMasterUpsertController',
					resolve: {
						'selectedAccountMaster': function () {
							return {
								'accountType' : 'Cash in Hand',
								'group': 'Vendor',
								'name': $scope.objVendorFuel.name,
                                'ledger_name': $scope.objVendorFuel.name,
								'isAdd': true,
								'isGroupNotAllowed': true,
							};
						}
					}
				});

				modalInstance.result.then(function(response) {
					if(response){
						$scope.aAccountMaster.push(response);
						$scope.objVendorFuel.account = response;
					}

					console.log('close',response);
				}, function(data) {
					console.log('cancel');
				});
			}
		}
	}catch(e){}


});

materialAdmin.controller("fuelVendorAddStationCtrl", function($rootScope, $scope, $interval, $modal, $state, $timeout, $stateParams, formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils) {
    $("p").text("Fuel Vendor");
    $rootScope.wantThis = true;
    $rootScope.wantReg = true;
	$rootScope.wantprofile = false;
    $rootScope.wantThisEdit = false;
    $scope.objStation = {};
    $scope.aFuelType = ["Petrol", "Diesel", "CNG"];
	$scope.aFuelCompany = ["Bio Diesel","BPCL", "Essar","HPCL", "IOCL", "RIL"];

    $scope.getFuelStation = function() {
        function successGetStation(response) {
            if (response && response.data) {
                $scope.aFuelStationsAdd = response.data.data;
            }
        }

        function failGetStation(res) {
            console.error("failure add vendorFuel: ", res);
        }
        vendorFuelService.GetFuelStationAll($rootScope.vendorData.vendorId, successGetStation, failGetStation);
    }

    $scope.addStation = function() {

        function successAddStation(response) {
            if (response && response.data) {
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg, "success");
                $scope.objStation = {};
                $scope.getFuelStation();
            }
        }

        function failAddStation(res) {
            console.error("failure add vendorFuel: ", res);
        }

        $scope.objStation.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        $scope.objStation.vendorId = $rootScope.vendorData.vendorId;
        $scope.objStation.fuel_vendor_id = $rootScope.vendorData._id;

        vendorFuelService.addFuelStation($scope.objStation, successAddStation, failAddStation);
    }

    $scope.savebtn = false;
    $scope.editMode = true;
    $scope.editStation = function(edtStationData) {
        $scope.savebtn = true;
        $scope.editMode = false;
    }

    $scope.updateStation = function(upStationData) {
        function successUpStation(response) {
            if (response && response.data) {
                var msg = response.message;
                //swal("Saved",msg,"success");
                growlService.growl(msg, "success");
                $scope.objStation = {};
                $scope.getFuelStation();
                $scope.savebtn = false;
                $scope.editMode = true;
            }
        }

        function failUpStation(res) {
            console.error("failure add vendorFuel: ", res);
        }
        vendorFuelService.updateFuelStation(upStationData, successUpStation, failUpStation);
    }

});
materialAdmin.controller("fuelVendorEditCtrl", function($rootScope, $scope, $interval, $modal, $state, $timeout, $stateParams, accountingService, formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils) {
    $("p").text("Fuel Vendor");
    $rootScope.wantThis = false;
    $rootScope.wantReg = false;
	$rootScope.wantprofile = false;
    $rootScope.wantThisEdit = true;
    $scope.objVendorFuel = {};
    $scope.objFuelData = {};
    $scope.aBanking = [];
    $scope.objVendorFuel.address = {};
	$scope.aFuelCompany = ["Bio Diesel","BPCL", "Essar","HPCL", "IOCL", "RIL"];


    if ($rootScope.selectedFuelVendorData) {
        $scope.objVendorFuel = $rootScope.selectedFuelVendorData;
    }

	$scope.showAccountDropdown = $scope.objVendorFuel.account ? false : true;

    if ($scope.objVendorFuel && $scope.objVendorFuel.banking_details) {
        $scope.aBanking = $scope.objVendorFuel.banking_details;
    }

    $scope.addBank = function(bank) {
        $scope.aBanking.push(bank);
        $scope.banking = {};
    }
    $scope.removeBank = function(index) {
        $scope.aBanking.splice(index, 1);
    }

    //$scope.getAllBranchSelect();

    $scope.autoCompleteCallbackCity = function() {
        if ($scope.autoCompleteCity) {
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
    gAPI.fight($scope, ['autoCompleteCity'], $scope.autoCompleteCallbackCity);

    $scope.saveVendorFuel = function(vfData) {

        function successEditVendorFuel(response) {
            if (response && response.data) {
                var msg = response.message;
                swal("Saved", msg, "success");
                //growlService.growl(msg,"success");
                var sUrl = "#!/masters/vendorFuelCommon/editStations";
                $rootScope.redirect(sUrl);
                $rootScope.getAllVendorFuels();
                //$scope.vendorData = response.data;
            }
        }

        function failureEditVendorFuel(res) {
            swal('Error', res.data.message, 'error');
            console.log("failure add vendorFuel: ", res);
        }

        if ($scope.aBanking) {
            $scope.objVendorFuel.banking_details = $scope.aBanking;
        }

        $scope.objVendorFuel.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        console.log($scope.objVendorFuel);
        vendorFuelService.editVendorFuel($scope.objVendorFuel, successEditVendorFuel, failureEditVendorFuel);
    }

	// try{
	// 	if($scope.$configs.master.showAccount){
	// 		// Get Account Masters
	// 		(function getAccountMasters(){
    //
	// 			var oFilter = {
	// 				no_of_docs: 10
	// 			}; // filter to send
	// 			accountingService.getAccountMaster(oFilter, onSuccess, onFailure);
    //
	// 			// Handle failure response
	// 			function onFailure(response) {
    //
	// 			}
    //
	// 			// Handle success response
	// 			function onSuccess(response){
	// 				response.data.data.unshift({
	// 					'name': "Add New Account",
	// 					'_id':  "addNewAccount"
	// 				});
	// 				$scope.aAccountMaster = response.data.data;
	// 			}
	// 		})();
    //
	// 		$scope.onSelectAccount = function () {
	// 			if($scope.objVendorFuel.account === "addNewAccount"){
	// 				$scope.objVendorFuel.account = null;
	// 				var modalInstance = $modal.open({
	// 					templateUrl: 'views/accounting/accountMasterUpsert.html',
	// 					controller: 'accountMasterUpsertController',
	// 					resolve: {
	// 						'selectedAccountMaster': function () {
	// 							return {
	// 								'accountType' : 'Cash in Hand',
	// 								'group': 'Vendor',
	// 								'name': $scope.objVendorFuel.name,
	// 								'isAdd': true
	// 							};
	// 						}
	// 					}
	// 				});
    //
	// 				modalInstance.result.then(function(response) {
	// 					if(response)
	// 						$scope.aAccountMaster.push(response);
	// 						$scope.objVendorFuel.account = response._id;
    //
	// 					console.log('close',response);
	// 				}, function(data) {
	// 					console.log('cancel');
	// 				});
	// 			}
    //
	// 		};
	// 	}
	// }catch(e){}

	try{
		if($scope.$configs.master.showAccount){

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

			$scope.objVendorFuel.account = $scope.objVendorFuel.account || {};
			$scope.showAccountDropdown = !($scope.objVendorFuel.account && $scope.objVendorFuel.account.name);

			// Get Account Masters
			($scope.getAccountMasters = function (input){

				if(input && input.length <= 2)
					return;

				var oFilter = {
					name: input,
					no_of_docs: 10,
					isGroup: false,
				}; // filter to send
				accountingService.getAccountMaster(oFilter, onSuccess, onFailure);

				// Handle failure response
				function onFailure(response) {

				}

				// Handle success response
				function onSuccess(response){
					$scope.aAccountMaster = response.data.data;
					if($scope.objVendorFuel.account && $scope.objVendorFuel.account._id && !$scope.aAccountMaster.find( o => o._id === $scope.objVendorFuel.account._id))
						$scope.aAccountMaster.unshift($scope.objVendorFuel.account);
				}
			})();

			$scope.addNewAccount = function(){
				$scope.objVendorFuel.account = {};
				var modalInstance = $modal.open({
					templateUrl: 'views/accounting/accountMasterUpsert.html',
					controller: 'accountMasterUpsertController',
					resolve: {
						'selectedAccountMaster': function () {
							return {
								'name': $scope.objVendorFuel.name,
								'isAdd': true,
								'isGroupNotAllowed': true,
							};
						}
					}
				});

				modalInstance.result.then(function(response) {
					if(response){
						$scope.aAccountMaster.push(response);
					}
					console.log('close',response);
				}, function(data) {
					console.log('cancel');
				});
			};
			$scope.onDelinkAccount = function() {
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
								masterSchema: 'VendorFuel',
								masterId: $scope.objVendorFuel._id,
								acntId: $scope.objVendorFuel.account._id,
								wasLinkedTo: $scope.objVendorFuel.name,
							}, onSuccess, onFailure);

							function onSuccess(res) {
								swal('Success', res.message, 'success');
							}
							function onFailure(err) {
								swal('Error', err.message, 'error');
							}
						}
					});
			};
		}
	}catch(e){}

});

materialAdmin.controller("fuelVendorEditStationCtrl", function($rootScope, $scope, DatePicker, $interval, $modal, $state, $timeout, $stateParams, formValidationgrowlService, vendorFuelService, $localStorage, growlService, otherUtils) {
    $rootScope.wantThis = false;
    $rootScope.wantReg = false;
	$rootScope.wantprofile = false;
    $rootScope.wantThisEdit = true;
    $scope.objStation = {};
	$scope.oFilter = {};
    $scope.aFuelType = ["Petrol", "Diesel", "CNG"];
	$scope.aFuelCompany = ["Bio Diesel","BPCL", "Essar","HPCL", "IOCL", "RIL"];
	$scope.DatePicker = angular.copy(DatePicker); // initialize pagination


	$scope.getFuelStation = function() {
		function successGetStation(response) {
			if (response && response.data) {
				$scope.aFuelStations = response.data.data;
			}
		}

		function failGetStation(res) {
			//console.error("failure add vendorFuel: ",res);
			var msg = res.data.message;
			//swal("Saved",msg,"success");
			growlService.growl(msg, "success");
		}
		vendorFuelService.GetFuelStationAll($rootScope.selectedFuelVendorData.vendorId, successGetStation, failGetStation);
	}

    $scope.addStation = function() {

        function successAddStation(response) {
            if (response && response.data) {
                var msg = response.message;
                //swal("Saved",msg,"success");
				swal(response.data.message, '', 'success');
                $scope.objStation = {};
                $scope.getFuelStation();
            }
        }

        function failAddStation(res) {
			swal(res.data.message, '', 'error');
        }

        $scope.objStation.clientId = $localStorage.ft_data.userLoggedIn.clientId;
        $scope.objStation.vendorId = $rootScope.selectedFuelVendorData.vendorId;
        $scope.objStation.fuel_vendor_id = $rootScope.selectedFuelVendorData._id;

        vendorFuelService.addFuelStation($scope.objStation, successAddStation, failAddStation);
    };

    $scope.savebtn = false;
    $scope.editMode = true;

    $scope.editStation = function(edtStationData) {
        $scope.savebtn = true;
        $scope.editMode = false;
    };
    $scope.updateStation = function(upStationData) {
        function successUpStation(response) {
            if (response && response.data) {
                var msg = response.message;
                //swal("Saved",msg,"success");
				swal(response.data.message, '', 'success');
                $scope.objStation = {};
                $scope.getFuelStation();
                $scope.savebtn = false;
                $scope.editMode = true;
            }
        }

        function failUpStation(res) {
			swal(res.data.message, '', 'error');
        }
        vendorFuelService.updateFuelStation(upStationData, successUpStation, failUpStation);
    }
    $scope.deleteStation = function(upStationData, $index) {
        function successUpStation(response) {
            if (response && response.data) {
            	$scope.aFuelStations.splice($index, 1);
                var msg = response.message;
				swal(response.data.message, '', 'success');
                $scope.objStation = {};
                $scope.getFuelStation();
                $scope.savebtn = false;
                $scope.editMode = true;
            }
        }

        function failUpStation(res) {
        	swal(res.data.message, '', 'error');
        }
        vendorFuelService.deleteFuelStation(upStationData, successUpStation, failUpStation);
    }

});

function vendorFuelHistoryCtrl(
	$scope,
	$uibModalInstance,
	fuelStationObj
) {

	$scope.fuelStationObj = fuelStationObj;

	$scope.closeModal = closeModal;

	function closeModal() {
		$uibModalInstance.dismiss();
	}


};
