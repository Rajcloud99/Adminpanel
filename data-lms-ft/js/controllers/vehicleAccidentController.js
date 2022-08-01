materialAdmin
    .controller("vehicleAccidentController", vehicleAccidentController);

vehicleAccidentController.$inject = [
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



function vehicleAccidentController(
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
        $scope.oAccident = {};
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
        $scope.vehc = data && data.vehicle && data.vehicle[0] && data.vehicle[0].aVehCollection &&
            data.vehicle[0].aVehCollection[0] && data.vehicle[0].aVehCollection[0].veh_no;
        $scope.oAccident.permitNo = data && data.permitNo;
        if(data && data.fitnessToDt) {
            $scope.oAccident.fitnessToDt = new Date(data && data.fitnessToDt);
        }
        if(data && data.frmInsDt) {
            $scope.oAccident.frmInsDt = new Date(data && data.frmInsDt);
        }
        if(data && data.toInsDt) {
            $scope.oAccident.toInsDt = new Date(data && data.toInsDt);
        }
        if(data && data.taxVal) {
            $scope.oAccident.taxVal = new Date(data && data.taxVal);
        }
        $scope.oAccident.date =  new Date(data && data.date);
        $scope.oAccident.trip_no = data && data.trip_no;
        if(data && data.consignee) {
            $scope.oAccident.consignee = data && data.consignee;
        }
        if(data && data.consigneeName) {
            $scope.oAccident.consigneeName = data && data.consigneeName;
        }
        $scope.oAccident.place = data && data.place;
        $scope.oAccident.policeFIR = data && data.policeFIR;
        $scope.oAccident.spotSrvyName = data && data.spotSrvyName;
        if(data && data.spotSrvyDate) {
            $scope.oAccident.spotSrvyDate = new Date(data && data.spotSrvyDate);
        }
        $scope.oAccident.spotSrvyNo = data && data.spotSrvyNo;
        $scope.oAccident.plcyNo = data && data.plcyNo;
        $scope.oAccident.plcytyp = data && data.plcytyp;
        $scope.oAccident.claimNo = data && data.claimNo;
        $scope.oAccident.thrdPrtyInjDetail = data && data.thrdPrtyInjDetail;
        $scope.oAccident.divOffice = data && data.divOffice;
        $scope.oAccident.idvVehicle = data && data.idvVehicle;
        $scope.oAccident.owner_name = data && data.owner_name;
        if(data && data.finalSrvyDate) {
            $scope.oAccident.finalSrvyDate = new Date(data.finalSrvyDate);
        }
        if(data && data.finalSrvyName) {
            $scope.oAccident.finalSrvyName = data.finalSrvyName;
        }
        if(data && data.estCost) {
            $scope.oAccident.estCost = data.estCost;
        }
        if(data && data.reinspectionDate) {
            $scope.oAccident.reinspectionDate = new Date(data.reinspectionDate);
        }
        $scope.oAccident.workshopName = data && data.workshopName;
        $scope.oAccident.address = data && data.address;
        if(data && data.finalPayment && data.finalPayment.amount) {
            $scope.oAccident.newAmount = data.finalPayment.amount;
        }
        if(data && data.finalPayment && data.finalPayment.chequeNO) {
            $scope.oAccident.chequeNO = data.finalPayment.chequeNO;
        }
        if(data && data.finalPayment && data.finalPayment.date) {
            $scope.oAccident.paymentDate = new Date(data && data.finalPayment && data.finalPayment.date);
        }
        $scope.oAccident.driverName = data && data.driverName;
        $scope.oAccident.driverLicenceNumber = data && data.driverLicenceNumber;
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

    $scope.onSelectDtOfAcdent = function(value) {
        // get trip no
        tripServices.findByAdvanceDate({vehicle_no: $scope.selectedVeh, advanceDate: value}, onSuccessCall, err => {
            console.log(err);
        });
        function onSuccessCall(response) {
            const tripNo = response && response.data && response.data.data && response.data.data[0] &&
            response.data.data[0].trip_no;
            if(tripNo) {
                $scope.oAccident['trip_no'] = tripNo;
            } else {
                $scope.oAccident['trip_no'] = null;
            }
        }
    }

    // on vehicle select
    $scope.onSelect = function (item) {
        // $scope.oAccident = item;
        // get dues
        console.log(item);
        $scope.selectedVeh = item.vehicle_reg_no;
        $scope.oAccident.owner_name = item.owner_name;
        accountingService.getDues({veh: item._id}, onSuccess, err => {
			console.log(err)
		});

		// Handle success response
		function onSuccess(response) {
			if (response && response.data) {
                $scope.duesData = response.data.data;
                $scope.duesVehicleId = $scope.duesData[0]._id;
                // $scope.oAccident = $scope.duesData[0] && $scope.duesData[0].aVehCollection[0];
                for(const d of $scope.duesData) {
                    if(d.duesType === 'Insurance') {
                        $scope.oAccident['plcyNo'] = d.aVehCollection[0].plcyNo;
                        $scope.oAccident['plcytyp'] = d.aVehCollection[0].plcytyp;
                        $scope.oAccident['frmInsDt'] = new Date(d.aVehCollection[0].frmdt);
                        $scope.oAccident['toInsDt'] = new Date(d.aVehCollection[0].todt);
                    }
                    else if(d.duesType === 'Fitness Worksheet') {
                        $scope.oAccident['fitnessToDt'] = new Date(d && d.aVehCollection[0].todt);
                    }
                    else if(d.duesType === 'Good and Token Tax') {
                        $scope.oAccident['taxVal'] = new Date(d && d.aVehCollection[0].todt);
                    }
                    else if(d.duesType === 'Permit') {
                        const findNationalPermit = d.aVehCollection.find(item => item.prmityp === 'National Permit');
                        if(findNationalPermit) {
                            $scope.oAccident['permitNo'] = findNationalPermit.permitNo;
                        }
                    }
                }
			}
        }
        if($scope.oAccident.date) {
            $scope.onSelectDtOfAcdent($scope.oAccident.date);
        }
        // get consghinee
        tripServices.getAllGRItem({vehicle: item._id, skip: 1, no_of_docs: 5}, onSuccessCallBack, err => {
            console.log(err);
        });
        function onSuccessCallBack(response) {
            const consghineeRes = response && response.data && response.data.data && response.data.data.data &&
                response.data.data.data[0];
                if(consghineeRes) {
                    $scope.oAccident['consignee'] = consghineeRes && consghineeRes.consignee._id;
                    $scope.oAccident['consigneeName'] = consghineeRes && consghineeRes.consignee.name;
                }
        }

    }

    // submit the form
    function submit(formData) {
        if (formData.$valid) {
            if($scope.oAccident.estCost <= 0) {
                return swal('Warning', 'Invalid Estimated Cost', 'warning');
            }
            if($scope.oAccident.newAmount <= 0) {
                return swal('Warning', 'Invalid Payment Amount', 'warning');
            }
            // delete the key if it is undefined , null or ''
            if(!$scope.oAccident.trip_no) {
                delete $scope.oAccident.trip_no;
            }
            if(!$scope.oAccident.consignee) {
                delete $scope.oAccident.consignee;
            }
            if(!$scope.oAccident.consigneeName) {
                delete $scope.oAccident.consigneeName;
            }
            // updation mode
            if($scope.edit) {
                $scope.oAccident.vehicle = $scope.duesVehicleId ? $scope.duesVehicleId : $scope.receivedIdData.vehicle && $scope.receivedIdData.vehicle[0] && $scope.receivedIdData.vehicle[0]._id;
                $scope.oAccident.finalPayment = {};
                $scope.oAccident.finalPayment['amount'] = $scope.oAccident.newAmount;
                $scope.oAccident.finalPayment['chequeNO'] = $scope.oAccident.chequeNO;
                $scope.oAccident.finalPayment['date'] = $scope.oAccident.paymentDate;

                Vehicle.vehAccidentUpdate($stateParams.id, $scope.oAccident, onSuccess, err => {
                    console.log(err);
                });
                function onSuccess(response) {
                    if(response) {
                        swal("Success", response.message, "success");
                        $state.go('booking_manage.vehicleList', {

                        });
                    }
                }
            } else {
                // add mode
                $scope.oAccident.vehicle = $scope.duesVehicleId;
                $scope.oAccident.finalPayment = {};
                $scope.oAccident.finalPayment['amount'] = $scope.oAccident.newAmount;
                $scope.oAccident.finalPayment['chequeNO'] = $scope.oAccident.chequeNO;
                $scope.oAccident.finalPayment['date'] = $scope.oAccident.paymentDate;
                Vehicle.vehAccidentAdd($scope.oAccident, onSuccess, err => {
                    console.log(err);
                });
                function onSuccess(response) {
                    if(response) {
                        swal("Success", response.message, "success");
                        $state.go('booking_manage.vehicleList', {

                        });
                    }
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

