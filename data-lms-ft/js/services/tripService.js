materialAdmin.service('tripServices', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
    function prepareParameters(oFilter) {
        delete oFilter.idleHourReport;
        var sParam = "";

        for (var property in oFilter) {
            sParam = sParam + "&" + property + "=" + oFilter[property];
        }
        return sParam;
    }

    let _this = this;

	const serialize = function (obj, prefix) {
		var str = [], p;
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push((v !== null && !(v instanceof Date) && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	};
	this.findByAdvanceDate = function(data, success, failure) {
		HTTPConnection.post(URL.FIND_BY_ADVANCE_DATE, data, success, failure);
	};
    this.createEmptyTrip = function (d = {}, s = () => {}, f = () => {}) {
			HTTPConnection.post(URL.CREATE_EMPTY_TRIP, d, s, f);
		};
    this.getApprovedPaymentReport = function (fi = {}, s = () => {}, fa = () => {}) {
			var url_with_params = URL.APPROVED_PAYMENT_REPORT + prepareParameters(fi);
			HTTPConnection.get(url_with_params, s, fa);
		};
    this.getAllTrips = function(oFilter, success, failure) {
        var url_with_params = URL.TRIP_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getAllTripsWithPagination = function(oFilter, success, failure) {
        var url_with_params = URL.TRIP_GET_V2; //URL.TRIP_GET; // commented date: 27/12/2019
        HTTPConnection.post(url_with_params,oFilter, success, failure);
	};

	this.getTripSettlPreview = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_SETTLE_PREVIEW; //URL.TRIP_GET; // commented date: 27/12/2019
		HTTPConnection.post(url_with_params,oFilter, success, failure);
	};

    this.getTripRecoReportsNew = function(oFilter, success, failure) {
			var url_with_params = URL.TRIP_RECO_REPORT_NEW;
			HTTPConnection.post(url_with_params, oFilter, success, failure);
		};

	this.getTripReportsNew = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_REPORT_NEW;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	this.getTripMemoReports = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_MEMO_REPORT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	this.getJobRiskyReports = function(oFilter, success, failure) {
		var url_with_params = URL.JOBRISKY_REPORT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	this.getJobOrderReports = function(oFilter, success, failure) {
		var url_with_params = URL.JOBORDER_REPORT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	this.getJobPowerConnectReports = function(oFilter, success, failure) {
		var url_with_params = URL.JOBPOWERCONNECT_REPORT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	this.getTripCompReport = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_COMP_REPORT_NEW;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	this.getRtSummaryReport = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_Settl_REPORT_NEW;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	this.getSettlementCSV = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_SETTLE_CSV_NEW;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	this.getUnSettlementCSV = function(oFilter, success, failure) {
		var url_with_params = URL.TRIP_UNSETTLE_CSV_NEW;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};

	this.getTripDetailReportsNew = function(oFilter, success, failure) { // added new
			var url_with_params = URL.TRIP_REPORT_DETAIL_NEW;
			HTTPConnection.post(url_with_params, oFilter, success, failure);
		};
	this.tripProfit = function(oFilter, success, failure) { // added new
		var url_with_params = URL.TRIP_PROFIT_REPORT;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
    this.getAllTripsReport = function(oFilter, success, failure) {
        var url_with_params = URL.TRIP_REPORT + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.getTripIdleHourReport = function(oFilter, success, failure) {
        var url_with_params = URL.TRIP_IDLE_HOUR_REPORT + "/" + oFilter.idleHourReport + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.getAllInvoiceData = function(oFilter, success, failure) {
        var url_with_params = URL.INVOICE_GET + "?no_of_docs=50" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

	this.getTDS = function(oFilter, success, failure) {
		var url_with_params = URL.PREVIEW_TDS +"?"+ prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, success, failure);
	};

	this.getAllTripGrData = function(oFilter, success, failure) {
		function getAllTripGrDataSuccess(response){
			success(response.data);
		}
		function getAllTripGrDataFailure(response){
			failure(response.data);
		}
		HTTPConnection.post(URL.GET_TRIP_GR, oFilter, getAllTripGrDataSuccess, getAllTripGrDataFailure);
	};


    this.getAllInvoiceDataForDispatchBill = function(oFilter, success, failure) {
        var url_with_params = URL.BILL_DISPATCH_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.updateBillDispatch = function(data, success, failure) {
        HTTPConnection.put(URL.BILL_DISPATCH_UPDATE + data._id, data, success, failure);
    }
    this.getAllCustomerPayment = function(oFilter, success, failure) {
        var url_with_params = URL.CUSTOMER_PAY_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);

	};

    this.getAllGRItem = function(oFilter, success, failure) {
        var url_with_params = URL.GRITEM_GET;
        HTTPConnection.post(url_with_params, oFilter, success, failure);
    };
    this.getAllGR = function(oFilter, success, failure) {
        var url_with_params = URL.GET_ALL_GR;
        HTTPConnection.post(url_with_params, oFilter, success, failure);
    };
	this.getGrTrim = function(oFilter, success, failure) {
		var url_with_params = URL.GET_GR_TRIM;
		HTTPConnection.post(url_with_params, oFilter, success, failure);
	};
	// this.downloadShipmentReport = function(oFilter, success, failure) {
	// 	var url_with_params = URL.GET_ALL_GR;
	// 	HTTPConnection.post(url_with_params, oFilter, success, failure);
	// };
	// this.downloadShipmentCSV = function(oFilter, success, failure) {
	// 	var url_with_params = URL.GET_ALL_GR;
	// 	HTTPConnection.post(url_with_params, oFilter, success, failure);
	// };
    this.syncStatus = function(oFilter, success, failure) {
        var url_with_params = URL.SYNC_STATUS;
        HTTPConnection.post(url_with_params, oFilter, success, failure);
    };
    this.getAllGRAck = function(oFilter, success, failure) {
        var url_with_params = URL.GR_ACK + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getAllGRWithPagination = function(oFilter, success, failure) {
        var url_with_params = URL.GR_ACK + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getAllGRAckAll = function(oFilter, success, failure) {
        var url_with_params = URL.GR_ACK + "?all=true" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.updateGRAck = function(data, success, failure) {
        HTTPConnection.put(URL.GR_ACK + data.trip_id, data, success, failure);
    };

	this.updateGRNum = function(data, success, failure) {
		HTTPConnection.put(URL.UPDATE_GR_NUM, data, success, failure);
	};

    this.updateGrReceive = function(data, success, failure) {
        HTTPConnection.post(URL.GR_RECEIVE + data._id, data, success, failure);
    };

	this.coverNotesforGr = function(data, success, failure) {
		HTTPConnection.post(URL.COVER_NOTE_FOR_GR, data, success, failure);
	};

	this.getIn = function(data, success, failure) {
		HTTPConnection.post(URL.GET_IN, data, success, failure);
	};

	this.addIncidental = function(data, success, failure) {
		HTTPConnection.post(URL.ADD_INCIDENTAL, data, success, failure);
	};

	this.editIncidental = function(data, success, failure) {
		HTTPConnection.post(URL.EDIT_INCIDENTAL + data._id, data, success, failure);
	};

	this.updateNonBillGr = function(data, success, failure) {
		HTTPConnection.post(URL.UPDATE_NON_BILL_GR + data._id, data, success, failure);
	};

	this.moveGrIntoAnotherTrip = function(data, success, failure) {
		HTTPConnection.post(URL.MOVE_GR_ANOTHER_TRIP + data._id, data, success, failure);
	};

	this.mapGrIntoTrip = function(data, success, failure) {
		HTTPConnection.post(URL.MAP_GR_INTO_TRIP, data, success, failure);
	};

     this.unMapGrFromTrip = function(data, success, failure) {
		HTTPConnection.post(URL.UNMAP_GR_FROM_TRIP + data._id, data, success, failure);
	};

	this.deleteIncidental = function(data, success, failure) {
		HTTPConnection.post(URL.DELETE_INCIDENTAL + data._id, data, success, failure);
	};

	this.getFpa = function(data, success, failure) {
		HTTPConnection.post(URL.GET_FPA_GR, data, success, failure);
	};

	this.addFpa = function(data, success, failure) {
		HTTPConnection.post(URL.ADD_FPA, data, success, failure);
	};

	this.editFpa = function(data, success, failure) {
		HTTPConnection.post(URL.EDIT_FPA + data._id, data, success, failure);
	};

	this.deleteFpa = function(data, success, failure) {
		HTTPConnection.post(URL.DELETE_FPA + data._id, data, success, failure);
	};

	this.grsforCoverNote = function(data, success, failure) {
		HTTPConnection.post(URL.GR_FOR_COVER_NOTE, data, success, failure);
	};

	this.convertGrsToCovernote = function(data, success, failure) {
		HTTPConnection.post(URL.CONVERT_GRS_TO_COVERNOTE, data, success, failure);
	};

    this.convertCovernotesToGr = function(data, success, failure) {
		HTTPConnection.post(URL.CONVERT_COVERNOTES_TO_GR, data, success, failure);
	};

	this.tripAdvances = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCES, data, success, failure);
	};

	this.downloadTripAdvances = function(queryParams, data, success, failure) {
		if(queryParams && (queryParams.downloadType === 'csv')) {
			HTTPConnection.post(`${URL.TRIP_ADVANCES_DOWNLOADONLYADV}?${serialize(queryParams)}`, data, success, failure);
		} else {
			HTTPConnection.post(`${URL.TRIP_ADVANCES_DOWNLOAD}?${serialize(queryParams)}`, data, success, failure);
		}
		// data.request_id = queryParams.request_id = Date.now()+''+Math.round(Math.random()*100);
	};

	this.downloadDieselTripReport = function(data, success, failure) {
		HTTPConnection.post(URL.DIESEL_TRIP_REPORT, data, success, failure);
	};

	this.uploadTripAdvances = (qp = {}, p = {}) => new Promise((rs, rj) => {
		qp.request_id = Date.now()+''+Math.round(Math.random()*100);
		HTTPConnection.post(`${URL.TRIP_ADVANCES_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
	});

	this.uploadForComparision = function(data, success, failure) {
		HTTPConnection.post(URL.UPLOAD_ADVANCES_COMPARE, data, success, failure);
	};

	this.createVouchers = function(data, success, failure) {
		HTTPConnection.post(URL.CREATE_VOUCHERS, data, success, failure);
	};
	this.tripAdvBillPreview = function(data, success, failure) {
		HTTPConnection.post(URL.TRIPADV_BILLPREVIEW, data, success, failure);
	};
    this.updateGRDetails = function(data, success, failure) {
        HTTPConnection.put(URL.GR_DETAILS_UPDATE + data.trip_no, data, success, failure);
    };
    this.addNewGRservice = function(data, success, failure) {
        HTTPConnection.put(URL.GR_NUMBER_ADD + data._id, data, success, failure);
    };
    this.addGr = function(data, success, failure) {
        HTTPConnection.post(URL.ADD_GR, data, success, failure);
    };
	/////////// driver change
	this.driverchange = function(data, success, failure) {
        HTTPConnection.post(URL.DRIVER_CHANGE, data, success, failure);
    };
    this.updateGR = function(data, success, failure) {
        HTTPConnection.put(URL.GR_ITEM_UPDATE + data._id, data, success, failure);
    };
	this.updateGRservice = function(data, success, failure) {
		HTTPConnection.put(URL.GR_NUMBER_ADD + data._id, data, success, failure);
	};
	this.updateGRremark = function(data, success, failure) {
		HTTPConnection.put(URL.GR_REMARK_UPDATE + data._id, data, success, failure);
	};
    this.update = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE + "/" + data._id, data, success, failure);
    };
    this.updatePendingGr = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE + "/" + data.trip_id, data, success, failure);
    };
    this.updateInfo = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE_INFO + "/" + data._id, data, success, failure);
    };
    this.updateVeh = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE_VEH + "/" + data._id, data, success, failure);
    };
	this.askPayment = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_ASK_PAYMENT + "/" + data._id, data, success, failure);
    };

	this.acknowledgeDeal = function(data, success, failure) {
		HTTPConnection.put(URL.ACK_DEAL + data._id, data, success, failure);
	};

	this.vendorDealCharges = function(data, success, failure) {
		HTTPConnection.put(URL.VENDOR_DEAL_CHARGES + data._id, data, success, failure);
	};

	this.updateStatus = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_UPDATE_STATUS + "/" + data._id, data, success, failure);
	};
	this.updateBulkStatus = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_UPDATE_BULK_STATUS, data, success, failure);
	};
	this.updateGrStatus = function(data, success, failure) {
		HTTPConnection.put(URL.UPDATE_GR_STATUS + "/" + data._id, data, success, failure);
	};
	this.addAdvancePayment = function(id, data, success, failure) {
		HTTPConnection.put(URL.ADD_ADV_PAYMENT + id, data, success, failure);
	};
	this.tripCancel = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_CANCEL + "/" + data._id, data, success, failure);
	};
    this.getAllMasterGRService = function(oFilter, success, failure) {
        var url_with_params = URL.MASTER_GR_GET_ALL + "/?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getUsedMasterGRService = function(oFilter, success, failure) {
        var url_with_params = URL.GET_USED_GR_MASTER + "/?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.addGrMaster = function(data, succes, failure) {
        HTTPConnection.post(URL.MASTER_GR_ADD, data, succes, failure);
    };

	this.getRate = function(data, succes, failure) {
		HTTPConnection.post(URL.GET_RATE, data, succes, failure);
	};

    this.updateGrMasterS = function(data, success, failure) {
        HTTPConnection.put(URL.MASTER_GR_UPDATE + "/" + data._id, data, success, failure);
    };
		this.getAdvancePayments = function(id, success, failure) {
			HTTPConnection.get(URL.GET_GR + id, success, failure);
		};
    this.updateTripExpensePayment = function(data, success, failure) {
        HTTPConnection.put(URL.GR_ACK + "/" + data._id, data, success, failure);
    };

    this.generateCentralizedGR = function(oFilter, success, failure) {
        var url_with_params = URL.MASTER_CENTRALIZED_GENERATE + "/?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.updateGRack = function(data, success, failure) {
        HTTPConnection.put(URL.GR_ACK_DTL_UPDATE + data._id, data, success, failure);
    };

	this.revertGrAcknowledge = function(filter, success, failure) {
		HTTPConnection.post(URL.REVERT_GR_ACK + filter._id, filter, success, failure);
	};

    this.updateTripExpPay = function(data, success, failure) {
        HTTPConnection.put(URL.VENDOR_PAY_UPDATE + data._id, data, success, failure);
    };

    this.custPayBil = function(data, success, failure) {
        HTTPConnection.put(URL.CUSTOMER_PAY_UPDATE + data._id, data, success, failure);
    };

    this.getAllPendingGr = function(oFilter, success, failure) {
        var url_with_params = URL.PENDINGGR_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getAllPendingGrWithPagination = function(oFilter, success, failure) {
        var url_with_params = URL.PENDINGGR_GET + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };
    this.getAllPendingGrAll = function(oFilter, success, failure) {
        var url_with_params = URL.PENDINGGR_GET + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, failure);
    };

    this.cancelGRservice = function(data, success, failure) {
        HTTPConnection.post(URL.CANCEL_GR_FREE + data._id, data, success, failure);
    };

    this.updateLocation = function(data, success, failure) {
        HTTPConnection.put(URL.TRIP_UPDATE_LOCATION + data._id, data, success, failure);
    };

	this.uploadSlip = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_UPLOAD_SLIP + data._id, data, success, failure);
	};

	this.updateTripLocation = function(data, success, failure) {
		HTTPConnection.put(URL.UPDATE_TRIP_LOCATION + data._id, data, success, failure);
	};

	this.updateGrLocation = function(data, success, failure) {
		HTTPConnection.put(URL.UPDATE_GR_LOCATION + data._id, data, success, failure);
	};
	this.removeTripLocation = function(data, success, failure) {
		HTTPConnection.put(URL.REMOVE_TRIP_LOCATION + data.trip_id, data, success, failure);
	};

	this.removeGrLocation = function(data, success, failure) {
		HTTPConnection.put(URL.REMOVE_GR_LOCATION + data.gr_id, data, success, failure);
	};

    //Expense services
	this.addExpenseOnDiesel = function(data, success, failure) {
		HTTPConnection.post(URL.ADD_EXPENSE_DIESEL , data, success, failure);
	};
	//addCrossDocking
	this.addCrossDocking = function(data, success, failure) {
		HTTPConnection.post(URL.ADD_CROSS_DOCKING , data, success, failure);
	};

	this.getExpenseByTripId = function(data, success, failure) {
		var url_with_params = URL.GET_EXPENSE_DIESEL + data.trip_id + "?" + prepareParameters(data);
		HTTPConnection.get(url_with_params, success, failure);
	};

	this.cancelGR = function(data, success, failure) {
		HTTPConnection.put(URL.CANCEL_TRIP_GR + data._id, data, success, failure);
    };

    this.addMoisture = function(data, success, failure) {
        HTTPConnection.post(URL.ADD_MOISTURE , data, success, failure);
    };

	//TRIP ADVANCE APPROVE
	this.approveAdvance = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_ADVANCE_APPROVE + data._id, data, success, failure);
	};

    //TRIP ADVANCE APPROVE
	this.addAdvance = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_ADVANCE_ADD + (data._id || 'no_trip'), data, success, failure);
	};

	//TRIP ADVANCE Diesel Request
	this.dieselReq = function(data, success, failure) {
		HTTPConnection.put(URL.DIESEL_REQ_ADD + (data._id || 'no_trip'), data, success, failure);
	};

	//TRIP UPDATE ADVANCE
	this.updateAdvance = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_ADVANCE_UPDATE + data._id, data, success, failure);
	};

	//TRIP REVERSE ADVANCE
	this.reverseAdvance = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_REVERSE, data, success, failure);
	};

	//TRIP REVERSE ADVANCE
	this.getLastSettleBal = function(data, success, failure) {
		HTTPConnection.post(URL.GET_LAST_SETTLE_BAL, data, success, failure);
	};

	//TRIP DELETE ADVANCE
	this.deleteAdvance = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_DELETE + data._id, data, success, failure);
	};
	this.deleteAdvances = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCES_DELETE, data,success, failure);
	};

	//TRIP ADD MULTI ADVANCE
	this.addMultiAdvance = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_MULTI_ADD, data, success, failure);
	};

	//TRIP ADD MULTI ADVANCE WITH MULTI REF
	this.addMultiAdvanceV2 = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_MULTI_ADD_V2, data, success, failure);
	};

	//TRIP EDIT MULTI ADVANCE
	this.editMultiAdvance = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_MULTI_EDIT, data, success, failure);
	};

	//TRIP DELETE MULTI ADVANCE
	this.deleteMultiAdvance = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_MULTI_DELETE + data.reference_no, data, success, failure);
	};

	//TRIP DELETE ADVANCE CONTRA
	this.deleteAdvanceContra = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_ADVANCE_DELETE_CONTRA + data._id, data, success, failure);
	};

	//REVERT SETTLED TRIP
	this.revertSettledTrip = function(data, success, failure) {
		HTTPConnection.post(URL.REVERT_SETTLED_TRIP, data, success, failure);
	};

	this.mapTripOnAdv = function(data, success, failure) {
		HTTPConnection.post(URL.RE_MAP_TRIP_ADV, data, success, failure);
	};

	this.unmapAdvFromTrip = function(data, success, failure) {
		HTTPConnection.post(URL.UN_MAP_TRIP_ADV, data, success, failure);
	};

	this.getSummary = function(data, success, failure) {
		HTTPConnection.post(URL.GET_SUMMARY, data, success, failure);
	}

	this.checkAdvCrDr = function(data, success, failure) {
		HTTPConnection.post(URL.CHECK_CR_DR, data, success, failure);
	};

	//TRIP SETTLEMENT
	this.settleTrip = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE, data, success, failure);
	};

	this.UpdateSettleTrip = function(data, success, failure) {
		HTTPConnection.put(URL.UPDATE_SETTLE_TRIP + data._id, data, success, failure);
	};

	//TRIP Payment
	this.tripPayment = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_PAYMENTS + '/' + data.tripId, data, success, failure);
	};
	this.deleteTripPayment = function(data, success, failure) {
		HTTPConnection.delete(URL.TRIP_PAYMENTS + '/' + data.paymentId, data, success, failure);
	};

	//TRIP Payment Update
	this.tripPaymentUpdate = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_PAYMENTS_UPDATE + '/' + data._id, data, success, failure);
	};

	this.addMoreGRInTrip = function(data, success, failure=()=>{}) {
		HTTPConnection.post(URL.POST_ADD_GR, data, success, failure);
	};
	this.genMultiGrInTrip = function(data, success, failure=()=>{}) {
		HTTPConnection.post(URL.GEN_MULTI_GR, data, success, failure);
	};

	this.grNoValidation = function(data, success, failure=()=>{}) {
		HTTPConnection.post(URL.Gen_ADD_GR, data, success, failure);
	};

	this.revertMultiGr = function(data, success, failure=()=>{}) {
		HTTPConnection.post(URL.REVERT_MULTI_GR + data._id, data, success, failure);
	};

	this.settleAccManagerRmk = function(data, success, failure=()=>{}) {
		HTTPConnection.post(URL.TRIP_SETTLE_ACCMANAGER_RMK, data, success, failure);
	};

	this.yetAnotherGRReport = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.AGGR_GR_REPORT, filter, d=>rs(d),e=>rj(e)));

	this.dailyMISreport = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.DAILY_MIS_REPORT, filter, d=>rs(d),e=>rj(e)));

	this.gRReportV2 = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.AGGR_GR_REPORTV2, filter, d=>rs(d),e=>rj(e)));

	this.yetPODReport = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.AGGR_POD_REPORT, filter, d=>rs(d),e=>rj(e)));
	this.yetAnotherGRReportCron = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.AGGR_GR_REPORT_CRON, filter, d=>rs(d),e=>rj(e)));
	// this.yetAnotherGRReportMMT = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.GR_REPORT_MMT, filter, d=>rs(d),e=>rj(e)));
	this.uploadGRs = (filter)=>new Promise((rs,rj)=>HTTPConnection.post(URL.UPL_GRS, filter, d=>rs(d),e=>rj(e)));

	this.markSettled = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE_MARK_COMPLETE, data, success, failure);
	};

	this.settleCompletely = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE_COMPLETELY, data, success, failureCommounFun);
	};

	this.settleAddTrip = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE_ADD_TRIP, data, success, failureCommounFun);
	};

///////////////TOTAL GPS KM GET for trip settlement  page
   this.totalgpskmget = function(data, success, failure) {
		HTTPConnection.post(URL.TOTAL_GPS_KM_GET, data, success, failure);
	};
	this.settleRemoveTrip = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE_REMOVE_TRIP, data, success, failureCommounFun);
	};
	// Added By Harikesh - 19-11-2019
	this.removeSettlementTripExpense = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_SETTLE_REMOVE_EXPENSE + '/' + data._id, data, success, failure || failureCommounFun);
	};

	this.rtDriverAssociate = function(data, success, failure) {
		HTTPConnection.put(URL.TRIP_DRIVER_ASSOCIATE, data, success, failureCommounFun);
	};

	this.vendorPayment = function(data, success, failure) {
		HTTPConnection.post(URL.VENDOR_PAYMENT, data, success, failure || failureCommounFun);
	};

	this.vendorPaymentUpdate = function(data, success, failure) {
		HTTPConnection.put(URL.VENDOR_PAYMENT, data, success, failure || failureCommounFun);
	};

	this.vendorPaymentDelete = function(data, success, failure) {
		HTTPConnection.put(URL.VENDOR_PAYMENT_DEL, data, success, failure || failureCommounFun);
	};

	this.vendorDealUpdate = function(data, success, failure) {
		HTTPConnection.put(URL.VENDOR_DEAL_UPDATE + '/' + data._id, data, success, failure || failureCommounFun);
	};

	this.getV2 = function(data, success, failure) {
		HTTPConnection.post(URL.TRIP_GET_V2, data, success, failureCommounFun);
	};

	this.getAlerts = function (data, success, failure) {
		HTTPConnection.post(URL.TRIP_ALERTS, data, success,failure || failureCommounFun);
	};

	this.getTripV2 = function(data, success, failure) {
		HTTPConnection.post(URL.GET_TRIP_V2, data, success, failureCommounFun);
	};
	this.getRoundTrip = function(data, success, failure) {
		HTTPConnection.post(URL.GET_ROUND_TRIP, data, success, failureCommounFun);
	};

	// Admin Service
	this.admUpdateGr = function(data, success, failure) {
		HTTPConnection.put(URL.ADM_UPDATE_GR + "/" + data._id, data, success, failure);
	};

	this.admUpdateTrip = function(data, success, failure) {
		HTTPConnection.put(URL.ADM_UPDATE_TRIP + "/" + data._id, data, success, failure);
	};

	this.revertAcknowledgeDeal = function(data, success, failure) {
		HTTPConnection.put(URL.RVT_ACK_DEAL + data._id, data, success, failure);
	};

	this.getHirePaymentReport = function(data, success, failure) {
		HTTPConnection.post(URL.HIRE_PAYMENT_RPT, data, success, failure);
	};

	this.getTripMemo = function(data, success, failure) {
        HTTPConnection.post(URL.TRIP_MEMO, data, success, failure);
    };
	this.getBrokerMemo = function(data, success, failure) {
        HTTPConnection.post(URL.BROKER_MEMO, data, success, failure);
    };
	this.updateTripMemo = function(data, success, failure) {
        HTTPConnection.post(URL.UPDATE_TRIP_MEMO + data._id, data, success, failure);
    };
	this.updateBrokerMemo = function(data, success, failure) {
        HTTPConnection.post(URL.UPDATE_BROKER_MEMO + data._id, data, success, failure);
    };

	this.custPaymentReceipt = function(data, success, failure) {
        HTTPConnection.post(URL.CUST_PAYMENT_RECEIPT, data, success, failure);
    };

	this.updateCustPaymentReceipt = function(data, success, failure) {
        HTTPConnection.post(URL.UPDATE_CUST_PAYMENT_RECEIPT, data, success, failure);
    };

	this.custPaymentReceiptDelete = function(data, success, failure) {
		HTTPConnection.put(URL.CUST_PAYMENT_RECEIPT_DEL, data, success, failure);
	};

	this.associatedriverOnVehicle = function(data, success,failure) {
		function parseSuccessData(data){
			//console.log("success response :" +JSON.stringify(data.data));
			return success(data.data);
		}
		function parseFailureData(data){
			return failure(data.data);
		}
		//console.log("called add : " + URL.DRIVER_ON_VEHICLE_ASSOCIATE+JSON.stringify(data));
		HTTPConnection.post(URL.DRIVER_ON_VEHICLE_ASSOCIATE, data, parseSuccessData,parseFailureData);
	};

	this.getGr = function (viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			return new Promise( (resolve, reject) => {
				let req = {
					grNumber: viewValue,
					no_of_docs: 10,
					skip: 1
				};
				_this.getAllGRItem(req, res => {
					resolve(res.data.data.data);
				}, err => {
					console.log`${err}`;
					reject([]);
				});

			});
		}

		return [];
	}

}]);

function failureCommounFun(err){
	swal('Error', err.data.message, 'error');
}
