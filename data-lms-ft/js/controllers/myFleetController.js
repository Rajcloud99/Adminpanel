materialAdmin.controller("FleetController", FleetControllerFunction);
FleetControllerFunction.$inject = ['$scope', '$state', '$uibModal', '$q', 'FleetService'];

function FleetControllerFunction($scope, $state, $uibModal, $q, FleetService, VEHICLE) {
    $scope.tabs = [
        { title: 'PROFILE', content: './../../views/myRegisteredFleet/fleetProfile.html' },
		{ title: 'MONTHLY MANPOWER', content: './../../views/myRegisteredFleet/monthlyManpower.html'}
		//{ title: 'IDENTIFICATION', content: './../../views/myRegisteredVehicle/vehicleIdentity.html' },
        //{ title: 'DOCUMENTS', content: './../../views/myRegisteredVehicle/vehicleDocuments.html' }
    ];

    //-------------------------******************------------------------------------------
    $scope.setMode = function(mode) {
        $scope.fleet_mode = mode;
    };
    $scope.setMode("View");
    //----------------------***********************-----------------------------------------
    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 7;
    //---------------****************------------------------------------------------------
    $scope.oSearchRegisteredFleet = {};
    //$scope.checkAll = 0;

    //------------------------------------------------------------------------------------------

    //--------------********************------------------------------------------------------
    $scope.pageChanged = function() {
        $scope.getFleetList(true);
    };
    //-------------------------------------*****************-----------------------------------
    function successFleetByName(response) {
        $scope.fleetNames = response.data.data;
    }

    function failFleetByName(response) {
        //
    }

    $scope.getFleetByName = function(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            FleetService.getName(viewValue, successFleetByName, failFleetByName);
        } else if (viewValue == '') {
            $scope.getFleetList();
        }
    };

    $scope.onSelect = function($item, $model, $label) {
        $scope.oSearchRegisteredFleet._id = $item._id;
        $scope.getFleetList();
    };

    $scope.clearSearch = function() {
        delete $scope.oSearchRegisteredFleet._id;
        $scope.getFleetList();
    };

    //----------------------********************-------------------------------------
    function prepareFilterObject(isPagination) {
        var myFilter = { no_of_docs: $scope.items_per_page };
        if ($scope.oSearchRegisteredFleet) {
            if ($scope.oSearchRegisteredFleet._id) {
                myFilter._id = $scope.oSearchRegisteredFleet._id;
            }
            if (isPagination && $scope.currentPage) {
                myFilter.skip = $scope.currentPage;
            }
        }
        return myFilter;
    }
    $scope.getFleetList = function(isPagination) {
        var oFilter = prepareFilterObject(isPagination);
        FleetService.getFleetWithPagination(oFilter, function(res) {
            if (res && res.data) {
                $scope.aFleet = res.data;
                $scope.total_pages = res.pages;
                $scope.totalItems = res.count;
                if (res.data && res.data[0]) {
                    $scope.selectFleet(0);
                } else {
                    $scope.oFleet = {};
                }
            }
        });
    };
    //-------------------****----------------------------------------------------------
    function removeSelectedCSSclass() {
        listItem = $($('.lv-item'));
        listItem.siblings().removeClass('list_border_background');
    }
    //------------------******************----------------------------------------------
    function addSelectedCSSclass(i) {
        setTimeout(function() {
            listItem = $($('.lv-item')[i]);
            listItem.addClass('list_border_background');
        }, 100);
    }
    //---------------------***********---------------------------------------------------
    $scope.selectFleet = function(i) {
        $scope.setMode("View");
        if ($scope.aFleet && $scope.aFleet.length > 0) {
            setViewOrEditData($scope.aFleet[i]);
            removeSelectedCSSclass();
            addSelectedCSSclass(i);
        }
    };
    //---------------------****************************-----------------------------------
    $scope.$watch('fleet_mode', function(newVal, oldVal) {
        switch ($scope.fleet_mode) {
            case "Add":
                removeSelectedCSSclass();
                setAddData();
                break;
            default:
                break;
        }
    }, true);
    //---------------------------------------**********---------------------------------------

    //-----------------------Set Add Data--------------------------------------------------
    function setAddData() {
        $scope.oFleet = {};
    }
    //-----------------------------Binding Functions------------------------------------

    //-------------------------Set Edit Data---------------------------------------------
    function setViewOrEditData(fleetData) {
        $scope.oFleet = fleetData;
    }

    //-----------------------------------------------------------------------------------------

    /* $scope.$watch('checkAll', function(newVal, oldVal) {
        if (newVal != oldVal) {
            if ($scope.checkAll === 0) {
                $scope.getFleetList();
            }
        }
	}, true); */

    $scope.getFleetList();
    //----------------------------------------------------------------




    //----------------------------Save---------------------------------

    function succSubmitFleet(response) {
        if (response && response.data && response.data.data) {
            if(response.data.status=='ERROR'){
                swal("Failed!", response.data.message, "error");
            }
            else {
            swal("Done!", response.data.message, "success");
            $state.reload();
            }
        }
    }

    function failSubmitFleet(res) {
        swal("Failed!", response.data.message, "error");
    }

    $scope.submitFleet = function() {
        var oSend = angular.copy($scope.oFleet);

        if ($scope.fleet_mode == 'Add') {
            FleetService.saveFleet(oSend, succSubmitFleet, failSubmitFleet);
        } else {
            FleetService.updateFleet(oSend, succSubmitFleet, failSubmitFleet);
        }
    };

    $scope.deleteFleetMode = function() {
        swal({
            title: 'Are you sure to DELETE this Fleet?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#F44336",
            confirmButtonText: "Delete",
            closeOnConfirm: true
        },
        function (isConfirmU) {
            if (isConfirmU) {
                var oSend = angular.copy($scope.oFleet);
                FleetService.deleteFleet(oSend, succSubmitFleet, failSubmitFleet);
            }
        });
    };

    // to select particular row
    $scope.selectThis = function(index){
		$scope.monthlyManpowerSelectedIndex = index;
	};

	// Add Salary Model

	$scope.addManpower = function(oType, index){

		var fleetObj = {
			type: oType,
			_id: $scope.oFleet._id,
			monthlyManpower: $scope.oFleet.monthlyManpower,
			index: (Number.isInteger(index) && index>=0) ? index : false
		};

		var modalInstance = $uibModal.open({
			templateUrl: 'views/myRegisteredFleet/addMonthlyManpowerModal.html',
			controller: 'addMonthlyManpowerModalCtrl',
			resolve: {
				fleetObj: function() {
					return fleetObj;
				}
			}
		});

		modalInstance.result.then(function(response) {
			$scope.oFleet.monthlyManpower = response;
		});
	};
}

	materialAdmin.controller("addMonthlyManpowerModalCtrl", function (
		$filter,
		$localStorage,
		$scope,
		$uibModalInstance,
		DatePicker,
		FleetService,
		fleetObj
	){
		$scope.DatePicker = DatePicker;
		$scope.DatePicker.dateSettings.minMode = 'month';
		$scope.fleetObj = angular.copy(fleetObj);
		$scope.fleetObj.monthlyManpower = $filter('orderBy')($scope.fleetObj.monthlyManpower, '-created_at');

		if(Number.isInteger($scope.fleetObj.index)){
			$scope.month = new Date($scope.fleetObj.monthlyManpower[$scope.fleetObj.index].mm_yy);
			$scope.amount = $scope.fleetObj.monthlyManpower[$scope.fleetObj.index].amount;
		}

		$scope.closeModal = function() {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.updateManpower = function(){
			console.log($scope.addMonthlyManpower);

			if(Number.isInteger($scope.fleetObj.index)){
				var oSend = {};
				oSend._id = $scope.fleetObj._id;
				oSend.monthlyManpower = $scope.fleetObj.monthlyManpower;
				oSend.monthlyManpower[$scope.fleetObj.index].amount = $scope.amount;
			}else{

				var flag = false;
				($scope.fleetObj.monthlyManpower || []).map(function(obj){
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
				tempObj.amount = $scope.amount;
				tempObj.component = 'manpower';
				tempObj.created_by = $localStorage.ft_data.userLoggedIn.full_name;
				tempObj.created_at = new Date();
				oSend._id = $scope.fleetObj._id;
				oSend.monthlyManpower = ($scope.fleetObj.monthlyManpower || []);
				oSend.monthlyManpower.push(tempObj);
			}

			function updateFleetSuccess(response) {
				if (response && response.data && response.data.data) {
					swal("Done!", response.data.message, "success");
					$uibModalInstance.close(response.data.data.monthlyManpower);
				}
			}

			function updateFleetFailure(res) {
				swal("Failed!", response.data.message, "error");
			}

			FleetService.updateFleet(oSend, updateFleetSuccess, updateFleetFailure);

		};

	});
