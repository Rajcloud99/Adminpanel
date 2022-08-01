materialAdmin.service('billsService', ['$rootScope', '$localStorage', 'customer', 'HTTPConnection', 'URL', 'constants', function($rootScope, $localStorage, customer, HTTPConnection, URL, constants) {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function prepareParameters(oFilter) {
        var sParam = "";

        for (var property in oFilter) {
            sParam = sParam + "&" + property + "=" + oFilter[property];
        }
        return sParam;
    }

    this.getAllVehicles = function(success, fail) {
        var url_with_params = URL.VEHICLE;
        HTTPConnection.get(url_with_params, success, fail);
    };

    this.getAllBookingsItems = function(success, failure) {
        HTTPConnection.get(URL.BOOKING_ITEMS, success, failure);
    };

    this.getdetailGeneBillData = function(data, success) {
        this.getGeneBillSuccess = function(data) {
            success(data.data);
        }
        HTTPConnection.get(URL.GENE_BILL_DETAILS + "/?bill_no=" + data._id, this.getGeneBillSuccess);
    }

    this.getAllTripsExpense = function(oFilter, success, failure) {
        var url_with_params = URL.TRIP_GET_EXPENSE + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

	this.getAllVendorCoasting = function(oFilter, success, failure) {
		//var url_with_params = URL.GET_VENDOR_COASTING + "?" + prepareParameters(oFilter);
		HTTPConnection.post(URL.GET_VENDOR_COASTING, oFilter, success, failure);
	};

	this.getFuelVendorReport = function(oFilter, success, failure) {
		var url_with_params = URL.FUEL_VENDOR_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, success, failure);
	};

	this.getAllAggrTripsExpense = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_GET_EXPENSE_AGGR;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

    this.getAllVendorPayment = function(oFilter, success, failure) {
        var url_with_params = URL.VENDOR_PAY_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.getAllBillReports = function(oFilter, success, failure) {
        var url_with_params = URL.BILL_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.getProfitReportServ = function(oFilter, success, failure) {
        var url_with_params = URL.GET_PROFIT_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

	this.getInitialProfitReportServ = function(oFilter, success, failure) {
		var url_with_params = URL.GET_INITIAL_PROFIT_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, success, failure);
	};

    this.updateTripExpense = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE_EXPENSE + data._id, data, success, failure);
    };
    this.updateTripExpenseInVendorPayment = function(data, success, failure) {
        HTTPConnection.put(URL.VENDOR_PAY_UPDATE + $rootScope.vendorPaymentDataID, data, success, failure);
    };
    this.postAllocate = function(Allote, succes, failure) {
        HTTPConnection.post(URL.ALLOTE_VEHICLE, Allote, succes, failure);
    };

    this.getTDSRate = function(oFilter, succes, failure) {
        HTTPConnection.post(URL.GET_TDS_RATE, oFilter, succes, failure);
    };

    this.getDriverPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_DRIVER, data, success, failure);
    };

    this.addRemarkMultipleBills = function(data, success, failure) {
        HTTPConnection.post(URL.ADDREMARK_MULTIBILLS, data, success, failure);
    };

    this.getDieselPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_DIESEL, data, success, failure);
    };

    this.getBuiltyPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_BUILTY, data, success, failure);
    };

    this.getInvoicePdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_INVOICE, data, success, failure);
    };

    this.getPOPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_PO, data, success, failure);
    };
    this.getPRPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_PR, data, success, failure);
    };

    this.getInvInwardPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_INV_INWARD, data, success, failure);
    };

    this.getToolInvInwardPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_TOOL_INV_INWARD, data, success, failure);
    };

    this.getTyreInvInwardPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_TYRE_INV_INWARD, data, success, failure);
    };

    this.getJcdPdf = function(data, success, failure) {
        HTTPConnection.post(URL.PDF_JCD, data, success, failure);
    };

    this.getIssueSlipPdf = function(data, success, failure) {
        HTTPConnection.post(URL.ISSUE_SLIP_DOWNLOAD, data, success, failure);
    };

    this.updateBillPayment = function(data, success, failure) {
        HTTPConnection.put(URL.INVOICE_UPDATE + $rootScope.billDataID, data, success, failure);
    };

    this.customerPaymentUpdate = function(data, success, failure) {
        HTTPConnection.put(URL.CUSTOMER_PAY_UPDATE + $rootScope.billDataID, data, success, failure);
    };

    this.generateBillService = function(billData, succes, failure) {
        HTTPConnection.post(URL.GENE_BILL, billData, succes, failure);
    };

    this.getAllGeneBills = function(oFilter, success, failure) {
        var url_with_params = URL.GET_GENE_BILLS + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

	this.resetBill = function(bill_no, success,failure) {
		HTTPConnection.put(URL.RESET_BILL+bill_no,{}, success,failure);
	};

	/*Generate Bill's Service*/
	this.generateBill = function(requestObject, success, failure){
		HTTPConnection.post(URL.GEN_BILL, requestObject, success, failure);
	};
	this.generateBill_withoutGr = function(requestObject, success, failure){
		HTTPConnection.post(URL.GEN_BILL_WITHOUT_GR, requestObject, success, failure);
	};
	this.genMultiBill = function(requestObject, success, failure){
		HTTPConnection.post(URL.GEN_MULTI_BILL, requestObject, success, failure);
	};
	this.editMultiBill = function(requestObject, success, failure){
		var url_with_params = URL.UPDATE_MULTI_BILL + requestObject._id;
		HTTPConnection.put(url_with_params, requestObject, success, failure);
	};

	this.genMultiCrBill = function(requestObject, success, failure){
		HTTPConnection.post(URL.GEN_MULTI_CR_BILL, requestObject, success, failure);
	};
	this.editMultiCrBill = function(requestObject, success, failure){
		var url_with_params = URL.UPDATE_MULTI_crBILL + requestObject._id;
		HTTPConnection.post(url_with_params, requestObject, success, failure);
	};
	/*Get Generate Bill's Service*/
	this.getGenerateBill = function(oFilter, success, failure){
		var url_with_params = URL.GET_GEN_BILL_V2;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	/*Update Bill's Service*/
	this.updateBill = function(oFilter, success, failure){
		var url_with_params = URL.UPDATE_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};
	/*Cancel Bill Service*/
	this.cancelBill = function(oFilter, success, failure){
		var url_with_params = URL.CANCEL_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};
	/*Appreove Bill Service*/
	this.approveBill = function(oFilter, success, failure){
		var url_with_params = URL.APPROVE_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};
	/*Dispatch Bill Service*/
	this.dispatchBill = function(oFilter, success, failure){
		var url_with_params = URL.DISPATCH_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};
	/*Acknowledge Bill Service*/
	this.acknowledgeBill = function(oFilter, success, failure){
		var url_with_params = URL.ACKNOWLEDGE_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};

	// Bill Amendment - Post
	this.revertAcknowledgeBill = function(oFilter, success, failure){
		var url_with_params = URL.REVERT_ACKNOWLEDGE_BILL + oFilter._id;
		HTTPConnection.put(url_with_params, oFilter, success, failure);
	};

	// Bill Settlement - Post
	this.settleBill = function(oFilter, success, failure){
		var url_with_params = URL.BILL_SETTLEMENT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	// Bill Amendment - Post
	this.amendBill = function(bill_id, oFilter, success, failure){
		var url_with_params = URL.BILL_AMENDMENT+bill_id;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	// Purchase Bill Get
	this.purchaseBillGet = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_GET, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
			typeof failureCallback === 'function' && failureCallback();
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Purchase Bill Diesel Report Download
	this.reportDownload = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_DIESEL_REPORT, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
			typeof failureCallback === 'function' && failureCallback();
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Dues Bill Add
	this.duesBillAdd = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.DUES_BILL_ADD, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
			typeof failureCallback === 'function' && failureCallback();
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Dues Bill Update
	this.duesBillUpdate = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.DUES_BILL_UPDATE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			// swal('Error', err.data.message, 'error');
			failureCallback(err.data);
		}

		function success(response) {
			successCallback(response.data);
		}
	};


	// Purchase Bill Add
	this.purchaseBillAdd = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_ADD, oFilter, success, failure);

		function failure(err) {
			// swal('Error', err.data.message, 'error');
			// typeof failureCallback === 'function' && failureCallback();
			failureCallback(err.data);
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Purchase Bill Update
	this.purchaseBillUpdate = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_UPDATE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			// swal('Error', err.data.message, 'error');
			failureCallback(err.data);

		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Upsert CREDIT_NOTE
	this.upsertCreditNote = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.CREDIT_NOTE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Unapprove Purchase Bill
	this.purchaseBillUnapprove = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_UNAPPROVE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Approve Purchase Bill
	this.purchaseBillApprove = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_APPROVE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	// Remove Purchase Bill
	this.purchaseBillRemove = function(oFilter, successCallback, failureCallback){

		HTTPConnection.post(URL.PURCHASE_BILL_REMOVE + oFilter._id, oFilter, success, failure);

		function failure(err) {
			swal('Error', err.data.message, 'error');
		}

		function success(response) {
			successCallback(response.data);
		}
	};

	function parseAddressToString(address) {
        var parsedAddress = "";
        if (address && address.line1) {
            parsedAddress += (address.line1 + ", ");
        }
        if (address && address.line1) {
            parsedAddress += (address.line2 + ", ");
        }
        if (address && address.city) {
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

    function getCustomer(id) {
        customer.getAllcustomers({ _id: id }, function(data) {
            if (data && data.data && data.data[0] && data.data[0].address) {
                return parseAddressToString(data.data[0].address);
            } else {
                return "";
            }
        })
    }

    this.prepareBuiltyData = function(trip, booking, customer) {
        //console.log('trip', trip);
        //getCustomer(trip.consigner_id)
        var data = {
            consignor_name: trip.consigner_name,
            consignor_address: getCustomer(trip.consigner_id),
            consignee_name: trip.consignee_name,
            consignee_address: getCustomer(trip.consignee_id),
            from: trip.route_name.split('to')[0],
            to: trip.route_name.split('to')[1],
            date: new Date(trip.allocation_date).toLocaleString(),
            materials: [],
            trips: [],

            gr_charges: trip.gr_charges,
            weightment_charges: trip.weightman_charges,
            chargeable_expenses: trip.other_charges,
            total_expenses: trip.total || 0,

            delivery_at: '--------------',
            trip_start: trip.trip_start,


            printed_by: 'Application',
            datetime: new Date().toLocaleString()
        };

        for (var i = 0; i < trip.booking_info.length; i++) {
            var info = trip.booking_info[i];
            var material = {
                sl_no: i + 1,
                container_no: info.container_no,
                booking_no: info.booking_no,
                boe_no: info.boe_no,
                value: info.value,
                //form_no: '',
                material_name: trip.material_type + " (" + trip.material_group + ")",
                //payment_type: '1',
                weight: info.weight ? info.weight.value : 0,
                rate: info.rate,
                freight: trip.freight,
            };
            info.documents.forEach(function(doc) {
                material.form_no += doc.name + ',';
            });
            //data.total_expenses += material.freight;
            data.materials.push(material);

        }

        //data.total_expenses += data.gr_charges;
        //data.total_expenses += data.weightment_charges;
        //data.total_expenses += data.chargeable_expenses;

        data.trips.push({
            vehicle_no: trip.vehicle_no,
            gr_no: trip.gr_no,
            trip_no: trip.trip_no,
            // tin: customer.tin_no,
        });

        data.total_expenses_in_words = toWords(parseFloat(data.total_expenses).toFixed(2));

        return data;
    };

    this.prepareDieselData = function(trip, booking, customer) {
        // console.log('booking', JSON.stringify(booking));
        var data = [];
        for (var i = 0; i < trip.diesel_vendors.length; i++) {
            var vendor = trip.diesel_vendors[i];
            var slip = {
                serial_no: 123456,
                truck_no: trip.vehicle_no,
                vendor_name: vendor.vendor_name || '',
                diesel_required: vendor.litres,
                rate: vendor.rate,
                amount: vendor.amount,
                driver_name: trip.driver_name,
                printed_by: 'Application',
                datetime: new Date().toLocaleString(),
                no: i + 1
            };
            slip.amount_in_words = toWords(parseFloat(slip.amount).toFixed(2));
            data.push(slip);
        }





        return data;
    };

    this.prepareDriverData = function(trip, booking, customer) {
        // console.log('trip', JSON.stringify(trip));
        function getGrs(trip) {
            var grs = [];
            if (trip && trip.gr && trip.gr.length > 0) {
                for (var i = 0; i < trip.gr.length; i++) {
                    grs.push(trip.gr[i].gr_no);
                }
            }
            return grs.filter(onlyUnique)
        }
        var data = {
            driver_name: trip.vehicle.driver_name,
            driver_details: '',
            //company_name: constants.company_details.company_name,
            //company_address: constants.company_details.company_address,
            vehicle_no: trip.vehicle_no,
            from: trip.route.route_name.split('to')[0],
            to: trip.route.route_name.split('to')[1],
            date: new Date(trip.created_at).toLocaleString(),
            total_expenses: 0,
            trip_no: trip.trip_no,
            vehicle_type: trip.vehicle_type,
            sl_no: 1,
            builty_no: getGrs(trip).join(", "),
            lic_no: trip.driver_license,
            driver_code: trip.driver_employee_code,
            billing_party: trip.gr[0] !== undefined ? trip.gr[0].billing_party_name : '',
            materials: [],
            supervisor_name: trip.created_by,
            datetime: new Date().toLocaleString()
        };

        //data.builty_no = getGrs().join(", ");

        data.materials.push({
            nature: 'Cash',
            amount: trip.actual_cash_alloted || 0
        });
        data.total_expenses += trip.actual_cash_alloted || 0;
        for (var i = 0; i < trip.diesel_vendors.length; i++) {
            var vendor = trip.diesel_vendors[i];
            var diesel = {
                nature: vendor.vendor_name,
                reference: '',
                place: vendor.fuel_type,
                quantity: vendor.litres || 0,
                rate_per_litre: vendor.rate || 0,
                amount: vendor.amount || 0
            };
            data.materials.push(diesel);
            data.total_expenses += (diesel.amount || 0);
        }

        data.total_expenses_in_words = toWords(parseFloat(data.total_expenses).toFixed(2));

        return data;
    };

    this.preparePOData = function(data) {
        //console.log('po data', JSON.stringify(data));
        var total = 0;
        for (var i = 0; i < data.spare.length; i++) {
            total += data.spare[i].rate_inc_tax * data.spare[i].quantity;
        }
        data.total = total.toFixed(2);
		if(data.freight && data.total ) {
			data.final = (parseInt(data.total) + parseInt(data.freight)) !== undefined ? (parseInt(data.total) + parseInt(data.freight)) : '';
		}else if(!data.freight && data.total){
			data.final = parseInt(data.total);
		}else if(data.freight && !data.total){
			data.final = parseInt(data.freight);
		}
        data.amount_in_words = this.currencyToWords(data.final);
        return data;
    };


    this.currencyToWords = function(num) {
        return toWords(parseFloat(num).toFixed(2));
    };

}]);

var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function intToWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    if (str === '') str = 'zero';
    return str;
}

function toWords(num) {
    var s = num.toString().split('.');
    return intToWords(s[0]) + ' rupees and ' + intToWords(s[1]) + ' paise';
}
