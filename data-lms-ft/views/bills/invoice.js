var booking_info_headers = ['sl_no', 'trip_no', 'gr_date', 'gr_no', 'gr_type', 'veh_no', 'route', 'container_no', 'weight',
    'rate', 'freight', 'dtn_amt', 'wt_charge', 'other_charges', 'total'
];

materialAdmin.controller("invoiceCtrl", function($rootScope, $scope, $filter, $timeout, $stateParams, $modal, thatInvoice, customer,clientConfig, $modalInstance, billsService, bookingServices, clientService, broadcastService, URL) {
    $scope.mainCount = 0;
    var featureByStatus;
    if(thatInvoice.status=='billed'){
    	featureByStatus='Generated Bills';
    }else if(thatInvoice.status=='approved'){
		featureByStatus='Bill Dispatch';
	}else if(thatInvoice.status=='dispatched'){
		featureByStatus='Bill Dispatch';
	};
	$scope.showResetButton = (featureByStatus)?clientConfig.getAcl(featureByStatus,'Reset Bill'):false;
    function parseAddressToString(address) {
        var parsedAddress = "";
        if (address && address.line1) {
            parsedAddress += (address.line1 + ", ");
        }
        if (address && address.line1) {
            parsedAddress += (address.line2 + ", ");
        }
        if (address && address.city) {
            if (address.district == address.city) {
                delete address.district;
            }
            parsedAddress += (address.city + ", ");
        }
        if (address && address.district) {
            parsedAddress += (address.district + ", ");
        }

        if (address && address.state) {
            parsedAddress += (address.state + ", ");
        }
        if (address && address.pincode) {
            parsedAddress += (address.pincode + ", ");
        }
        if (address && address.country) {
            parsedAddress += address.country;
        }
        return parsedAddress;
    }


    $scope.billData = {};
    $scope.isMarketVehicle = false;
    $scope.showRate = false;
    $scope.colSpanValue = 12;
    $scope.payment_basisValue = "";
    var selectInVoice = angular.copy(thatInvoice);
    $scope.client_gstin = "NA";
    $scope.biller_gstin = (selectInVoice.billing_party_gstin_no) ? selectInVoice.billing_party_gstin_no : ((selectInVoice.gstin_state_code) ? selectInVoice.gstin_state_code : "----");

    function succClient(res) {
        $scope.clientData = res.data[0];
        if ($scope.clientData.gstin_no) {
            $scope.client_gstin = $scope.clientData.gstin_no;
        }
        var client_address = $scope.clientData.client_address;
        $scope.clientData.logo_url = URL.file_server + "users/"+ $scope.clientData.clientId + "/logo.jpg";
        $scope.clientData.address = (client_address.line1 ? client_address.line1 : "") + " " + (client_address && client_address.line2 ? client_address.line2 : "") + " " +
            (client_address && client_address.district ? client_address.district : "") + " " + (client_address && client_address.city ? client_address.city : "") + " " + (client_address && client_address.state ? client_address.state : "") + " " +
            (client_address && client_address.country ? client_address.country : "");
        $scope.mainCount += 1;
    }
    (function() {
        if (selectInVoice.clientId) {
            clientService.getClientByID({ clientId: selectInVoice.clientId }, succClient)
        }
    })()


    function succCustomer(res) {
        $scope.billingParty = res.data[0];
        if ($scope.billingParty.gstin_no) {
            $scope.biller_gstin = $scope.billingParty.gstin_no;
        }
        selectInVoice.billing_party_gstin_no = $scope.billingParty.gstin_no;
        selectInVoice.gstin_state_code = $scope.billingParty.state_code;
        selectInVoice.billing_party_name = $scope.billingParty.name;
        selectInVoice.sap_id = $scope.billingParty.sap_id;
        selectInVoice.apply_gst = ((typeof $scope.billingParty.gstin_registered == 'boolean') && ($scope.billingParty.gstin_registered === true)) ? false : true;
        selectInVoice.billing_party_address = parseAddressToString($scope.billingParty.address);
        $scope.mainCount += 1;
    }
    (function() {
        if (selectInVoice.billing_party_id) {
            customer.getAllcustomers({ _id: selectInVoice.billing_party_id, status: "Active" }, succCustomer)
        }
    })()

    function fixedToTwoDecimal(value) {
        return parseFloat((Math.round((value) * 100) / 100).toFixed(2))
    }


    function genarateBill() {
        $scope.total = {
            freight: 0, //freight
            loading_charge: 0, //unloading
            unloading_charge: 0, //unloading
            dtn_amt: 0, //detaintion
            other_charge: 0, //gr charges + fuel + other
            weightman_charges: 0, //weightman_charges
            overweight_charges: 0, //overweight
            extra_running: 0, //othr_exp
            //other_expances:0,
            total_expense: 0,
        };

        if (selectInVoice.booking_info && selectInVoice.booking_info.length > 0) {
            for (var i = 0; i < selectInVoice.booking_info.length; i++) {
                if (selectInVoice.booking_info[i].isMarketVehicle) {
                    $scope.isMarketVehicle = selectInVoice.booking_info[i].isMarketVehicle;
                }
                if ((selectInVoice.booking_info[i].payment_basis == "PMT") || (selectInVoice.booking_info[i].payment_basis == "PUnit")) {
                    $scope.showRate = true;
                    $scope.colSpanValue = 13;
                    $scope.payment_basisValue = selectInVoice.booking_info[i].payment_basis;
                }
                $scope.total.freight = fixedToTwoDecimal($scope.total.freight + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].freight) ? selectInVoice.booking_info[i].freight : 0));
                $scope.total.dtn_amt = fixedToTwoDecimal($scope.total.dtn_amt + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].dtn_amt) ? selectInVoice.booking_info[i].dtn_amt : 0));
                $scope.total.other_charge = fixedToTwoDecimal($scope.total.other_charge + ((selectInVoice.booking_info[i].other_charges || 0) + (selectInVoice.booking_info[i].fuel_price_hike || 0) + (selectInVoice.booking_info[i].gr_charges || 0)));
                $scope.total.loading_charge = fixedToTwoDecimal($scope.total.loading_charge + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].loading_charges) ? selectInVoice.booking_info[i].loading_charges : 0));
                $scope.total.unloading_charge = fixedToTwoDecimal($scope.total.unloading_charge + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].unloading_charges) ? selectInVoice.booking_info[i].unloading_charges : 0));
                $scope.total.weightman_charges = fixedToTwoDecimal($scope.total.weightman_charges + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].weightman_charges) ? selectInVoice.booking_info[i].weightman_charges : 0));
                $scope.total.overweight_charges = fixedToTwoDecimal($scope.total.overweight_charges + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].ovr_wt_chrgs) ? selectInVoice.booking_info[i].ovr_wt_chrgs : 0));
                $scope.total.extra_running = fixedToTwoDecimal($scope.total.extra_running + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].othr_exp) ? selectInVoice.booking_info[i].othr_exp : 0));
                $scope.total.total_expense = fixedToTwoDecimal($scope.total.total_expense + ((selectInVoice.booking_info[i] && selectInVoice.booking_info[i].total) ? selectInVoice.booking_info[i].total : 0));
            }
        }


        $scope.cgst = { freight: 0, loading_charge: 0, unloading_charge: 0, dtn_amt: 0, other_charge: 0, weightman_charges: 0, overweight_charges: 0, extra_running: 0, total_expense: 0 };
        $scope.sgst = { freight: 0, loading_charge: 0, unloading_charge: 0, dtn_amt: 0, other_charge: 0, weightman_charges: 0, overweight_charges: 0, extra_running: 0, total_expense: 0 };
        $scope.igst = { freight: 0, loading_charge: 0, unloading_charge: 0, dtn_amt: 0, other_charge: 0, weightman_charges: 0, overweight_charges: 0, extra_running: 0, total_expense: 0 };
        var total = angular.copy($scope.total);
        $scope.totalWithGST = total;
        if ($scope.isMarketVehicle === false) {
            if (selectInVoice.apply_gst) {
                var clientStateCode = $scope.client_gstin.slice(0, 2);
                var billerStateCode = $scope.biller_gstin.slice(0, 2);
                if (clientStateCode == billerStateCode) {
                    //result = ((10 / 100) * 1000)+1000; 10% of 1000
                    //apply cgst and sgst;
                    $scope.cgst = {
                        freight: fixedToTwoDecimal((2.5 / 100) * total.freight),
                        loading_charge: fixedToTwoDecimal((2.5 / 100) * total.loading_charge),
                        unloading_charge: fixedToTwoDecimal((2.5 / 100) * total.unloading_charge),
                        dtn_amt: fixedToTwoDecimal((2.5 / 100) * total.dtn_amt),
                        other_charge: fixedToTwoDecimal((2.5 / 100) * total.other_charge),
                        weightman_charges: fixedToTwoDecimal((2.5 / 100) * total.weightman_charges),
                        overweight_charges: fixedToTwoDecimal((2.5 / 100) * total.overweight_charges),
                        extra_running: fixedToTwoDecimal((2.5 / 100) * total.extra_running),
                        total_expense: fixedToTwoDecimal((2.5 / 100) * total.total_expense),
                    }
                    $scope.sgst = {
                        freight: fixedToTwoDecimal((2.5 / 100) * total.freight),
                        loading_charge: fixedToTwoDecimal((2.5 / 100) * total.loading_charge),
                        unloading_charge: fixedToTwoDecimal((2.5 / 100) * total.unloading_charge),
                        dtn_amt: fixedToTwoDecimal((2.5 / 100) * total.dtn_amt),
                        other_charge: fixedToTwoDecimal((2.5 / 100) * total.other_charge),
                        weightman_charges: fixedToTwoDecimal((2.5 / 100) * total.weightman_charges),
                        overweight_charges: fixedToTwoDecimal((2.5 / 100) * total.overweight_charges),
                        extra_running: fixedToTwoDecimal((2.5 / 100) * total.extra_running),
                        total_expense: fixedToTwoDecimal((2.5 / 100) * total.total_expense),
                    }
                    $scope.totalWithGST = {
                        freight: fixedToTwoDecimal((total.freight) + ($scope.cgst.freight) + ($scope.sgst.freight)),
                        loading_charge: fixedToTwoDecimal((total.loading_charge) + ($scope.cgst.loading_charge) + ($scope.sgst.loading_charge)),
                        unloading_charge: fixedToTwoDecimal((total.unloading_charge) + ($scope.cgst.unloading_charge) + ($scope.sgst.unloading_charge)),
                        dtn_amt: fixedToTwoDecimal((total.dtn_amt) + ($scope.cgst.dtn_amt) + ($scope.sgst.dtn_amt)),
                        other_charge: fixedToTwoDecimal((total.other_charge) + ($scope.cgst.other_charge) + ($scope.sgst.other_charge)),
                        weightman_charges: fixedToTwoDecimal((total.weightman_charges) + ($scope.cgst.weightman_charges) + ($scope.sgst.weightman_charges)),
                        overweight_charges: fixedToTwoDecimal((total.overweight_charges) + ($scope.cgst.overweight_charges) + ($scope.sgst.overweight_charges)),
                        extra_running: fixedToTwoDecimal((total.extra_running) + ($scope.cgst.extra_running) + ($scope.sgst.extra_running)),
                        total_expense: fixedToTwoDecimal((total.total_expense) + ($scope.cgst.total_expense) + ($scope.sgst.total_expense)),
                    };
                } else {
                    //apply IGST
                    $scope.igst = {
                        freight: fixedToTwoDecimal((5 / 100) * total.freight),
                        loading_charge: fixedToTwoDecimal((5 / 100) * total.loading_charge),
                        unloading_charge: fixedToTwoDecimal((5 / 100) * total.unloading_charge),
                        dtn_amt: fixedToTwoDecimal((5 / 100) * total.dtn_amt),
                        other_charge: fixedToTwoDecimal((5 / 100) * total.other_charge),
                        weightman_charges: fixedToTwoDecimal((5 / 100) * total.weightman_charges),
                        overweight_charges: fixedToTwoDecimal((5 / 100) * total.overweight_charges),
                        extra_running: fixedToTwoDecimal((5 / 100) * total.extra_running),
                        total_expense: fixedToTwoDecimal((5 / 100) * total.total_expense),
                    };

                    $scope.totalWithGST = {
                        freight: fixedToTwoDecimal((total.freight) + ($scope.igst.freight)),
                        loading_charge: fixedToTwoDecimal((total.loading_charge) + ($scope.igst.loading_charge)),
                        unloading_charge: fixedToTwoDecimal((total.unloading_charge) + ($scope.igst.unloading_charge)),
                        dtn_amt: fixedToTwoDecimal((total.dtn_amt) + ($scope.igst.dtn_amt)),
                        other_charge: fixedToTwoDecimal((total.other_charge) + ($scope.igst.other_charge)),
                        weightman_charges: fixedToTwoDecimal((total.weightman_charges) + ($scope.igst.weightman_charges)),
                        overweight_charges: fixedToTwoDecimal((total.overweight_charges) + ($scope.igst.overweight_charges)),
                        extra_running: fixedToTwoDecimal((total.extra_running) + ($scope.igst.extra_running)),
                        total_expense: fixedToTwoDecimal((total.total_expense) + ($scope.igst.total_expense)),
                    };
                }
            }
        }
        renderOnUI();
    }

    $scope.$watch('mainCount', function() {
        if ($scope.mainCount === 2) {
            genarateBill()
        };
    });

    function renderOnUI() {
        if (selectInVoice) {
            $scope.selectInVoice = selectInVoice;
            var data = selectInVoice;
            data.total_expenses_in_words = data.total_expenses ? billsService.currencyToWords(data.total_expenses) : undefined;
        } else {
            var bUrl = "#!/billing/bills";
            $rootScope.redirect(bUrl);
        }
    }



    $scope.downloadPDF = function() {
        $scope.selectInVoice.biller_gstin = $scope.biller_gstin;
        billsService.getInvoicePdf($scope.selectInVoice, function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    };

    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };


     $scope.resetBill = function (bill_no) {
     	swal({
				 title: "Are you sure?",
				 text: "Are you sure that you want to reset this bill? it will show in Unbill.",
				 showCancelButton: true,
				 confirmButtonText: 'Confirm',
				 cancelButtonText: 'Cancel',
				 showLoaderOnConfirm: true,
				 allowOutsideClick: false
			 },
			 function(isConfirm) {
				 if (isConfirm) {
				 	billsService.resetBill(bill_no,
						function (response) {
							setTimeout(function () {
								swal("Done!", response.data.message, "success");
								$scope.closeModal();
							},100)
						},
						function (response) {
				 			setTimeout(function () {
								swal("Failed!", response.data.message, "error");
							},100)
						});
				 }
			 })
	 }




    /*$scope.selectInVoice = angular.copy(thatInvoice);
    function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData.client_address;
        $scope.clientData.logo_url = URL.file_server+$scope.clientData.clientId +"/logo.jpg";
        $scope.clientData.address = (client_address.line1?client_address.line1:"")+" "+(client_address && client_address.line2?client_address.line2:"")+" "+
                (client_address && client_address.district?client_address.district:"")+" "+(client_address && client_address.city?client_address.city:"")+" "+(client_address && client_address.state?client_address.state:"")+" "+
                (client_address && client_address.country?client_address.country:"");
    }
    (function(){
        if($scope.selectInVoice.clientId){
            clientService.getClientByID({clientId:$scope.selectInVoice.clientId},succClient)
        }
    })()
    $scope.billData = {};

    if($scope.selectInVoice){
       var data = $scope.selectInVoice;
       data.total_expenses_in_words = billsService.currencyToWords(data.total_expenses);
    } else {
        var bUrl = "#!/billing/bills";
        $rootScope.redirect(bUrl);
    }


    console.log('DATA: ', data);
total
    $scope.getAllTableInfo = function(){
       setTimeout(
        function(){
            var table = document.getElementById("booking_info");
            for (var i = 0; i < data.booking_info.length; i++) {
                var row = table.insertRow(i + 1);
                for (var j = 0; j < booking_info_headers.length; j++) {
                    row.insertCell(j);
                    if(booking_info_headers[j] == "gr_date"){
                        var value = $filter('date')(data.booking_info[i][booking_info_headers[j]], 'dd-MM-yyyy');
                    }else if(booking_info_headers[j] == "other_charges"){
                        var value = (data.booking_info[i]['other_charges'] || 0) + (data.booking_info[i]['ovr_wt_chrgs'] || 0) +
                        (data.booking_info[i]['gr_charges'] || 0 ) + ( data.booking_info[i]['fuel_price_hike'] || 0);
                    }else{
                        var value = data.booking_info[i][booking_info_headers[j]];
                    }
                    row.cells[j].innerHTML = value !== undefined ? value : '';
                    row.cells[j].className += 'data ctd';
                }
            }

            var editables = document.getElementsByClassName("editable");
       },
     500);
    };

    for (var key in data) {
        $scope[key] = data[key];
    }

    $scope.getAllTableInfo();

    $scope.pdf = function() {
        billsService.getInvoicePdf(JSON.stringify(data), function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    };

    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };*/
});

materialAdmin.controller("editInvoiceCtrl", function($rootScope, $scope, $localStorage, $uibModal, $stateParams, billsService, DateUtils, bookingServices, broadcastService, invoiceService) {
    if ($stateParams && $stateParams.data) {
        $rootScope.editInvoiceCtrl = $stateParams.data
    } else {
        $stateParams.data = $rootScope.editInvoiceCtrl;
    }

    function getCustomerByType(aCustomerType, success) {
        var cType = JSON.stringify(aCustomerType); //Array is for Multiple Type
        var details = {
            type: cType,
            all: true,
            status: "Active"
        }
        bookingServices.getAllCustomersforDetails(details, success);
    };


    var dependentData = $stateParams.data;
    $scope.selectInVoice = dependentData.selectedInvoice;
    $scope.aInvoice = dependentData.invoice;
    $scope.saveBill = saveBillFunc;

    $scope.updateInvoice = updateInvoiceFunc;

    function parseAddressToString(address) {
        var parsedAddress = "";
        if (address && address.line1) {
            parsedAddress += (address.line1 + ", ");
        }
        if (address && address.line1) {
            parsedAddress += (address.line2 + ", ");
        }
        if (address && address.city) {
            if (address.district == address.city) {
                delete address.district;
            }
            parsedAddress += (address.city + ", ");
        }
        if (address && address.district) {
            parsedAddress += (address.district + ", ");
        }

        if (address && address.state) {
            parsedAddress += (address.state + ", ");
        }
        if (address && address.pincode) {
            parsedAddress += (address.pincode + ", ");
        }
        if (address && address.country) {
            parsedAddress += address.country;
        }
        return parsedAddress;
    }

    $scope.billerChange = function() {
        if ($scope.selectInVoice.biller_id) {
            $scope.selectInVoice.billing_party_id = $scope.selectInVoice.biller_id._id;
            $scope.selectInVoice.billing_party_name = $scope.selectInVoice.biller_id.name;
            $scope.selectInVoice.billing_party_address = parseAddressToString($scope.selectInVoice.biller_id.address);
            $scope.selectInVoice.billing_party_gstin_no = $scope.selectInVoice.biller_id.gstin_no;
            $scope.selectInVoice.gstin_state_code = $scope.selectInVoice.biller_id.state_code;
            $scope.selectInVoice.apply_gst = ((typeof $scope.selectInVoice.biller_id.gstin_registered == 'boolean') && ($scope.selectInVoice.biller_id.gstin_registered === true)) ? false : true;
            $scope.selectInVoice.sap_id = $scope.selectInVoice.biller_id.sap_id;
        }
    }

    getCustomerByType(['Billing party'], function(data) {
        $scope.aBiller = data.data;
        if ($scope.selectInVoice.billing_party_id) {
            if ($scope.aBiller.length > 0) {
                for (var i = 0; i < $scope.aBiller.length; i++) {
                    if ($scope.aBiller[i]._id == $scope.selectInVoice.billing_party_id) {
                        $scope.selectInVoice.biller_id = $scope.aBiller[i];
                        $scope.billerChange();
                    }
                }
            }
        }
    });

    function updateInvoiceFunc(info, index) {
        //$scope.aInvoice[i] = invoice
        var passData = {
            "selectedInfo": info,
            "invoice": $scope.selectInVoice,
            "index": index,
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'views/bills/editBillingInfo.html',
            controller: 'editBillingInfoCtrl',
            resolve: {
                thatData: function() {
                    return passData;
                }
            }
        });

        modalInstance.result.then(function(res) {
            $scope.selectInVoice = res.data.data;
            $rootScope.editInvoiceCtrl.selectInVoice = $scope.selectInVoice
        }, function(data) {
            if (data != 'cancel') {
                swal("Oops!", data.data.error_message, "error")
            }
        });
    }







    function saveBillFunc(selectInVoice) {
        //$scope.selectInVoice._id = selectInVoice._id;
        //swal("Invoice Updated", "", "success");
        function success(data) {
            var msg = data.data.message
            swal("Invoice Updated", msg, "success");
        };

        function failure(res) {
            console.log("fail: ", res);
            var msg = res.data.error_message;
            swal("", msg, "error");
        }
        if (selectInVoice.isMarketVehicle) {
            selectInVoice.booking_info.map(function(o) {
                o.isMarketVehicle = true;
                return o
            });
        }

        invoiceService.updateInvoice(selectInVoice, success, failure);
    };

    //*************** New Date Picker for multiple date selection in single form ************
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
    $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************

});


materialAdmin.controller("editBillingInfoCtrl", function($rootScope, $scope, $uibModalInstance, $localStorage, thatData, invoiceService) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    /* remoteData Structure is like this
         {
            "selectedInfo":info,
            "invoice":$scope.selectInVoice,
            "index":index,
        }
    */
	/*function prepareInfoForTransporter(infoData) {
		if($scope.oBooking.payment_type && $scope.oBooking.weight_type){
			if($scope.oBooking.payment_type=='To be billed'){
				infoData.advance = 0;
				infoData.balance = (infoData.freight - infoData.advance);
			}else if($scope.oBooking.payment_type=='Advance & to be billed'){
				infoData.advance = $scope.oBooking.advance_payment;
				infoData.balance = (infoData.freight - infoData.advance);
			}else if($scope.oBooking.payment_type=='Advance & to pay'){
				infoData.advance = $scope.oBooking.advance_payment;
				infoData.balance = (infoData.freight - infoData.advance);
			}else if($scope.oBooking.payment_type=='To pay'){
				infoData.advance = 0;
				infoData.balance = (infoData.freight - infoData.advance);
			}
		}
	}*/
    var remoteData = angular.copy(thatData);

    $scope.upadateData = remoteData.selectedInfo;


    function success(res) {
        if (res && res.data && (res.data.status == "OK")) {
            $uibModalInstance.close(res);
        } else {
            $uibModalInstance.dismiss(res);
        }
    }

    function failure(res) {
        $uibModalInstance.dismiss(res);
    }

    $scope.updateInvoice = updateAinvoiceFunc;
	$scope.advanceIsOk = true;

    function updateAinvoiceFunc() {
        var oSend = remoteData.invoice;
        var indexedData = $scope.upadateData;
        indexedData.total = indexedData.toCalc;
        delete indexedData.toCalc;
        oSend.booking_info[remoteData.index] = indexedData;
        var subTotal = 0;
        for (var i = 0; i < oSend.booking_info.length; i++) {
            var oInfo = oSend.booking_info[i];
            subTotal += oInfo.total;
            if (oInfo.isMarketVehicle) {
                oSend.isMarketVehicle = oInfo.isMarketVehicle;
            }
        }
        oSend.sub_total = parseFloat((subTotal || 0).toFixed(2));
        oSend.total_expenses = oSend.sub_total;
        invoiceService.updateInvoice(oSend, success, failure);
    }

    $scope.$watchGroup([
        'upadateData.gr_charges',
        'upadateData.fuel_price_hike',
        'upadateData.dtn_amt',
        'upadateData.rate',
        'upadateData.weight',
        'upadateData.loading_charges',
        'upadateData.unloading_charges',
        'upadateData.other_charges',
        'upadateData.othr_exp',
        'upadateData.weightman_charges',
        'upadateData.ovr_wt_chrgs',
		'upadateData.totalAdvance'
    ], function(newValues, oldValues, scope) {
        // newValues array contains the current values of the watch expressions
        if (newValues !== oldValues) {
            if ($scope.upadateData) {
                if ($scope.upadateData.payment_basis == "PMT") {
                    $scope.upadateData.freight = parseFloat((($scope.upadateData.weight || 0) * ($scope.upadateData.rate || 0)).toFixed(2));
                } else if ($scope.upadateData.payment_basis == "PUnit") {
                    $scope.upadateData.freight = parseFloat((($scope.upadateData.no_of_unit || 0) * ($scope.upadateData.rate || 0)).toFixed(2));
                } else {
                    $scope.upadateData.freight = $scope.upadateData.rate;
                }
                if($scope.upadateData.isTransporter && Number.isFinite($scope.upadateData.totalAdvance)){
					$scope.advanceIsOk =  ($scope.upadateData.totalAdvance<=$scope.upadateData.freight)?true:false;
					if($scope.advanceIsOk){
						$scope.upadateData.totalBalance = ($scope.upadateData.freight - $scope.upadateData.totalAdvance);
					}
				}


				//fix data
                $scope.upadateData.toCalc = parseFloat((($scope.upadateData.othr_exp || 0) + ($scope.upadateData.weightman_charges || 0) + ($scope.upadateData.fuel_price_hike || 0) + ($scope.upadateData.dtn_amt || 0) + ($scope.upadateData.ovr_wt_chrgs || 0) + ($scope.upadateData.gr_charges || 0) + ($scope.upadateData.loading_charges || 0) + ($scope.upadateData.unloading_charges || 0) + ($scope.upadateData.other_charges || 0) + ($scope.upadateData.freight || 0)).toFixed(2));
            }
        }
    });
});
