materialAdmin
    .controller("driverCounsellingAddController", driverCounsellingAddController);

driverCounsellingAddController.$inject = [
    '$scope',
    'Vehicle',
    'Driver',
    'tripServices',
    'DatePicker',
    'accountingService',
    'stateDataRetain',
    '$state',
    '$stateParams',
];



function driverCounsellingAddController(
    $scope,
    Vehicle,
    Driver,
    tripServices,
    DatePicker,
    accountingService,
    stateDataRetain,
    $state,
    $stateParams
) {

    //let vm = this;
    $scope.DatePicker = angular.copy(DatePicker); // initialize pagination

    // functions Identifiers
    $scope.getDriver = getDriver;
    $scope.getIdData = getIdData;
    $scope.fillFormData = fillFormData;
    // vm.getVehicle = getVehicle;
    $scope.submit = submit;


    // INIT functions
    (function init() {
        $scope.edit = false;
        if($stateParams && $stateParams.id) {
            // update mode
            $scope.edit = true;
            $scope.getIdData($stateParams.id);
        } else {
            // add mode
            $scope.edit = false;
        }
        // getAllTrip(true);
        $scope.duesData;
        $scope.duesVehicleId;
        $scope.selectedVeh;
        $scope.oCounselling = {};
        $scope.oCounselling.date = new Date();
        $scope.receivedIdData;
        $scope.vehc;
        $scope.maxDate = new Date();
    })();

    // get the id from param and get the data
    function getIdData(id) {
        Vehicle.getCurrentVehicle({_id: id}, onSuccess, err => {
            console.log(err);
        });

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
                $scope.receivedIdData = response.data[0];
                // store the vehicle no
                $scope.selectedVeh = response.data[0] && response.data[0].vehicle[0] && response.data[0].vehicle[0].aVehCollection[0].veh_no;
                $scope.fillFormData(response.data[0]);
                if (response.data.length == 0) {
                    swal('Error!', 'Sorry no record found', 'error');
                } else if(response.data.length > 1) {
                    swal('Error!', 'Sorry more than one record found', 'error');
                } else {
                    $scope.fillFormData(response.data[0]);
                }
			}
		}
    }

    function fillFormData(data) {
        $scope.oCounselling.date = new Date(data && data.date);
    }


    function getDriver(viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {
                Driver.getName(viewValue, res => {
                    resolve(res.data.data)
                }, err => {
                    reject([]);
                    console.log`${err}`;
                });
            });
        }
    }

    $scope.getVehicle = function (viewValue) {
        if (viewValue && viewValue.toString().length > 1) {
            return new Promise(function (resolve, reject) {
                Vehicle.getName(viewValue, res => {
                    resolve(res.data.data)
                }, err => {
                    reject([]);
                    console.log`${err}`;
                });
            });
        }
    }


    // on vehicle select
    $scope.onSelect = function (item) {
        if(item) {
            $scope.oCounselling['vehicle'] = item._id;
            if(item.owner_group) {
                $scope.oCounselling['fleet'] = item.owner_group;
            }
        }
    }

    // on driver code select
    $scope.onDriverCodeSelect = function (item) {
        if(item) {
            $scope.oCounselling['driverCode'] = item._id;
        }
    }

    // submit the form
    function submit(formData) {
        if (formData.$valid) {
                // add mode
                if(!$scope.oCounselling.driverBalCopy) {
                    delete $scope.oCounselling.driverBalCopy;
                }
                if(!$scope.oCounselling.driverBalSystem) {
                    delete $scope.oCounselling.driverBalSystem;
                }
                if(!$scope.oCounselling.fleet) {
                    delete $scope.oCounselling.fleet;
                }
                Driver.drivCounsellingAdd($scope.oCounselling, onSuccess, err => {
                    console.log(err);
                });
                function onSuccess(response) {
                    if(response) {
                        swal("Success", response.message, "success");
                        $state.go('masters.driverCounsellingList', {

                        });
                    }
                }

        } else {
            if (formData.$error.required)
                swal('Form Error!', 'All Mandatory Fields should be filled', 'error');
            else
                swal('Form Error!', 'Form is not Valid', 'error');
        }
    }

}

