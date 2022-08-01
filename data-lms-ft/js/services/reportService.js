materialAdmin.service('ReportService', ['HTTPConnection', 'URL', '$localStorage',
	function (HTTPConnection, URL, $localStorage) {

		function prepareParameters(oFilter) {
			var sParam = "";
			for (var property in oFilter) {
				sParam = sParam + "&" + property + "=" + oFilter[property];
			}
			return sParam;
		}

		this.getVehicleReport = function (oFilter, success, failure) {
			HTTPConnection.post(URL.VEHICLE_REPORT_MASTER, oFilter, success, failure);
		};

		this.getLogsReport = function (oFilter, succes, failure) {
			HTTPConnection.post(URL.LOGS_REPORT, oFilter, succes, failure);
		};

		this.addRemarkLogsReport = function (oFilter, succes, failure) {
			HTTPConnection.post(URL.ADD_REMARK_LOGS, oFilter, succes, failure);
		};

		this.getNotification = function (oFilter, success) {
			var url_with_params = URL.LOGS_NOTIFICATION + "?all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getCustomerReport = function (oFilter, success) {
			var url_with_params = URL.CUSTOMER_REPORT_MASTER + "?all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getBookingReport = function (oFilter, success) {
			var url_with_params = URL.BOOKING_REPORT_MASTER + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getGrBookingReport = function (oFilter, success) {
			var url_with_params = URL.GR_REPORT_API + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getBilldispatchReport = function (oFilter, success) {
			var url_with_params = URL.BILL_DISPATCH_REPORT_MASTER + "?sort=-1&all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getUnbillReport = function (oFilter, success) {
			var url_with_params = URL.UNBILL_MASTER + "?sort=-1&all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getBillReport = function (oFilter, success) {
			var url_with_params = URL.BILL_MASTER + "?sort=-1&all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getIncompleteTripReport = function (oFilter, success) {
			var url_with_params = URL.INCOMPLETE_TRIP + "?sort=-1" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getBilldispatchFormateReport = function (oFilter, success) {
			var url_with_params = URL.BILL_DISPATCH_REPORT_FORMATE + "?sort=-1&all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTripReport = function (oFilter, success) {
			var url_with_params = URL.TRIP_REPORT_MASTER + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getGrReport = function (oFilter, success) {
			var url_with_params = URL.GR_REPORT_MASTER + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getGrAckReport = function (oFilter, success) {
			var url_with_params = URL.GR_REPORT_MASTER + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getInventoryReport = function (oFilter, success) {
			var url_with_params = URL.INVENTORY_REPORT + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getGPSInventoryReport = function (oFilter, success) {
			var url_with_params = URL.GPS_INVENTORY_REPORT + "?sort=-1" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getInvInward = function (oFilter, success) {
			var url_with_params = URL.INVENTORY_INWARD_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllJobCardsReport = function (oFilter, success) {
			var url_with_params = URL.GET_JOBCARD_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllJobCardsTaskReport = function (oFilter, success) {
			var url_with_params = URL.GET_JOBCARD_TASK_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllToolReport = function (oFilter, success) {
			var url_with_params = URL.GET_TOOL_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getToolIssueReport = function (oFilter, success) {
			var url_with_params = URL.GET_TOOL_ISSUE_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllTyreReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreSummaryReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_SUMMARY_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreIssueReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_ISSUE_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreIssueSummaryReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_ISSUE_SUMMARY_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreRetreatReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_RETREAD_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreAssociationReport = function (oFilter, success) {
			var url_with_params = URL.GET_TYRE_ASSOCIATION_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAggreInventoryReport = function (oFilter, success) {
			var url_with_params = URL.INVENTORY_REPORT + "?sort=-1&aggregate=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getJobCardReport = function (oFilter, success) {
			var url_with_params = URL.JOBCARD_REPORT + "?sort=-1&no_of_docs=10" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getPoReport = function (oFilter, success) {
			var url_with_params = URL.PO_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getSoReport = function (oFilter, success) {
			var url_with_params = URL.SO_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getTyreReport = function (oFilter, success) {
			var url_with_params = URL.TYRE_REPORT + "?sort=-1&all=true" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getToolReport = function (oFilter, success) {
			var url_with_params = URL.TOOL_REPORT + "?sort=-1&no_of_docs=15" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getAllContractorExpenseReport = function (oFilter, success) {
			var url_with_params = URL.GET_CONT_EXPENSE_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllExpenseReport = function (oFilter, success) {
			var url_with_params = URL.GET_EXPENSE_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getAllSpareConsumptionReport = function (oFilter, success) {
			var url_with_params = URL.GET_SPARE_CON_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getAllcombinedExpenseReport = function (oFilter, success) {
			var url_with_params = URL.GET_COMBINED_EXP_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.getDieselEscalationReport = function (oFilter, succes, failure) {
			HTTPConnection.post(URL.DIESEL_ESCALATION_REPORT, oFilter, succes, failure);
		};

		this.getDoReport = function (oFilter, success) {
			var url_with_params = URL.DO_REPORT + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};

		this.downloadProfitReportGR = function (oFilter, success) {
			var url_with_params = URL.PROFIT_REPORT_GR + "?" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, success);
		};
		this.getReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_REPORT, data, success, failure);
		};
		this.rtpExpenseNew = function (data, success, failure) {
			HTTPConnection.post(URL.RTP_EXP_NEW, data, success, failure);
		};
		this.RTPRNew = function (data, success, failure) {
			HTTPConnection.post(URL.POST_RTPR_NEW, data, success, failure);
		};
		this.rtgpReport = function (data, success, failure) {
			HTTPConnection.post(URL.RT_GP_REPORT, data, success, failure);
		};
		this.combrtwisegpReport = function (data, success, failure) {
			HTTPConnection.post(URL.COMB_RTWISE_GP_REPORT, data, success, failure);
		};
		this.rtpGapReport = function (data, success, failure) {
			HTTPConnection.post(URL.RTP_GAP_REPORT, data, success, failure);
		};
		this.lastSettleRtpr = function (data, success, failure) {
			HTTPConnection.post(URL.LAST_SETTLE_RT_REPORT, data, success, failure);
		};
		this.lastSettleRtReport = function (data, success, failure) {
			HTTPConnection.post(URL.LAST_SETTLE_RT_REPORT_2, data, success, failure);
		};
		this.vehMonthlyPerformanceRpt = function (data, success, failure) {
			HTTPConnection.post(URL.MONTHLY_PERFORMANCE_REPORT, data, success, failure);
		};
		this.getDlpDupReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_DLP_DUP_REPORT, data, success, failure);
		};
		this.getjobOrderreport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_JOB_ORDER_REPORT, data, success, failure);
		};
		this.getjobOrderriskreport = function (data, success, failure) {
			HTTPConnection.post(URL.JOBRISKY_REPORT, data, success, failure);
		};
		this.getjobOrderpowercutreport = function (data, success, failure) {
			HTTPConnection.post(URL.JOBPOWERCONNECT_REPORT, data, success, failure);
		};
		this.getDrverPerfReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_DRVR_PRF_REPORT, data, success, failure);
		};
		this.getDrverAccReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_DRVR_ACC_REPORT, data, success, failure);
		};

		this.getDrverPaymentReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_DRVR_PAYMENT_REPORT, data, success, failure);
		};

		this.getFPAReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_FPA_REPORT, data, success, failure);
		};

		this.tripAdvDateRpt = function (data, success, failure) {
			HTTPConnection.post(URL.TRIP_ADVANCES_RPT, data, success, failure);
		};

		this.getMonthlyReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_BILLING_PARTY_REPORT, data, success, failure);
		};

		this.getGroupReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_BILLINGPARTY_GROUP_REPORT, data, success, failure);
		};

		this.getCnDeductionReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_CN_DEDUCTION_REPORT, data, success, failure);
		};

		this.getMrDeductionReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_MR_DEDUCTION_REPORT, data, success, failure);
		};

		this.getMrCnDeductionReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_MR_CN_DEDUCTION_REPORT, data, success, failure);
		};

		this.getGrMonthlyReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_GR_MONTHLY_REPORT, data, success, failure);
		};

		this.getUnbilledSummReport = function (data, success, failure) {
			HTTPConnection.post(URL.GET_UNBILLED_SUMM_REPORT, data, success, failure);
		};

		this.outStandingRpt = function (oFilter, success, failure) {
			HTTPConnection.post(URL.OUTSTANDING_REPORT, oFilter, success, failure);
		};
		this.outStandingMonthlyRpt = function (oFilter, success, failure) {
			HTTPConnection.post(URL.OUTSTANDING_MONTHLY_REPORT, oFilter, success, failure);
		};
		this.ledgerStandingMonthlyRpt = function (oFilter, success, failure) {
			HTTPConnection.post(URL.LEDGER_TRANSACTION_REPORT, oFilter, success, failure);
		};

		this.billLifeCycleReport = function (oFilter, success, failure) {
			HTTPConnection.post(URL.LIFE_CYCLE_REPORT, oFilter, success, failure);
		};
		this.getMonthlyDeductionReport = function (oFilter, success, failure) {
			HTTPConnection.post(URL.MONTHLY_DEDUCTION_REPORT, oFilter, success, failure);
		};
		this.getBPDeductionReport = function (oFilter, success, failure) {
			HTTPConnection.post(URL.BP_MONTHLY_REPORT, oFilter, success, failure);
		};
		this.cnWiseOutstandingRept= function (oFilter, success, failure) {
			HTTPConnection.post(URL.CN_WISE_OUTSTANDING_REPORT, oFilter, success, failure);
		};
		this.gstSales = function (oFilter, success, failure) {
			HTTPConnection.post(URL.GST_SALES_REPORT, oFilter, success, failure);
		};
		this.tripProfit = function (oFilter, success, failure) {
			HTTPConnection.post(URL.TRIP_PROFIT_REPORT, oFilter, success, failure);
		};
		this.dailyKmAnalysisReport = function (oFilter, success, failure) {
			HTTPConnection.post(URL.DAILY_KM_ANALYSIS, oFilter, success, failure);
		};
	}]);
