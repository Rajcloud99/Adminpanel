/**
 * Created by JA
 */

materialAdmin.service('accountingService',
	[	'HTTPConnection',
		'URL',
		'debounceWrapper',
		function(
			HTTPConnection,
			URL,
			debounceWrapper
		){

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

			// functions Identifiers
			this.accountBalances = accountBalances;
			this.accountBalance = accountBalance;
			this.accountBalanceMonthly = accountBalanceMonthly;
			this.accountBilltoBill = accountBilltoBill;
			this.branchExpenseRpt = branchExpenseRpt;
			this.billLedgerOutstandingRpt = billLedgerOutstandingRpt;
			this.billLedgOutstmonthlyRpt = billLedgOutstmonthlyRpt;
			this.accountGroupBalances = accountGroupBalances;
			this.addAccountMaster = addAccountMaster;
			this.addVoucher = addVoucher;
			this.bill2billRpt = bill2billRpt;
			this.delink = delink;
			this.getAccountMasterDebounce = debounceWrapper(getAccountMaster);
			this.getAccountMaster = getAccountMaster;
			this.getAccountMasterStructure = getAccountMasterStructure;
			this.getAccountMasterStructureAll = getAccountMasterStructureAll;
			this.getBalanceSheetReport = getBalanceSheetReport;
			this.getAccountReportTax = getAccountReportTax;
			this.getAccountReportTDS = getAccountReportTDS;
			this.getGSTR1CrDrReport = getGSTR1CrDrReport;
			this.getGSTR1InvoiceReport = getGSTR1InvoiceReport;
			this.getGSTR1ComputationReport = getGSTR1ComputationReport;
			this.getGSTR1MonthlyReport = getGSTR1MonthlyReport;
			this.getGSTR1SummaryReport = getGSTR1SummaryReport;
			this.getGSTR1PaymentReport = getGSTR1PaymentReport;
			this.getGSTR1CreditNoteReport = getGSTR1CreditNoteReport;
			this.getLedger = getLedger;
			this.getbankReconciliation = getbankReconciliation;
			this.getVoucher = getVoucher;
			this.groupBalanceSummary = groupBalanceSummary;
			this.profitAndLossReport = profitAndLossReport;
			this.vehicleProfitReport = vehicleProfitReport;
			this.vehicleExpenseReport = vehicleExpenseReport;
			this.detailTrailBalance = detailTrailBalance;
			this.groupTrailBalance = groupTrailBalance;
			this.particularTrailBalance = particularTrailBalance;
			this.openBalRep = openBalRep;
			this.updateAccountMaster = updateAccountMaster;
			this.updateAccountMasterEditName = updateAccountMasterEditName;
			this.updateOpenBal = updateOpenBal;
			this.uploadAccounts = uploadAccounts;
			this.uploadModifiedAccount = uploadModifiedAccount;
			this.addDues = addDues;
			this.getDues = getDues;
			this.duesSmryReport = duesSmryReport;
			this.updateDues = updateDues;
			this.deleteDues = deleteDues;
			this.resetBalance = resetBalance;
			this.accOpeningBal = accOpeningBal;
			this.costCenterRpt = costCenterRpt;
			this.getCostCategory = getCostCategory;
			this.getCostCenter = getCostCenter;
			this.deleteCostCenter = deleteCostCenter
			this.addCostCategory = addCostCategory;
			this.updateCostCategory = updateCostCategory;
			this.addCostCenter = addCostCenter;
			this.updateCostCenter = updateCostCenter;

			function uploadAccounts(qp = {}, p = {}) {
				return new Promise((rs, rj) => (
					HTTPConnection.post(`${URL.ACCOUNTS_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
				));
			}

			function uploadModifiedAccount(qp = {}, p = {}) {
				return new Promise((rs, rj) => (
					HTTPConnection.post(`${URL.MODIFIED_ACCOUNTS_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
				));
			}

			function accountBalances(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_BALANCES, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function accountBalance(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_BALANCE, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			function accountBalanceMonthly(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_BALANCEMONTHLY, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			function accountGroupBalances(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_GROUP_BALANCES, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function accountBilltoBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_BILL_TO_BILL, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function branchExpenseRpt(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.BRANCH_EXPENSE_RPT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function groupBalanceSummary(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GROUP_BALANCES_SUMMARY, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			function vehicleProfitReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.VEHICLE_PROFIT_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function vehicleExpenseReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.VEHICLE_EXPENSE_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function costCenterRpt(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.COST_CENTER_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function profitAndLossReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.PROFIT_AND_LOSS_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function detailTrailBalance(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.DETAIL_TRIAL_BALANCES, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function groupTrailBalance(request, successCallback, failureCallback) {

            				HTTPConnection.post(URL.GROUP_TRIAL_BALANCES, request, onSuccess, onFailure);

            				function onFailure(data) {
            					if(typeof failureCallback === 'function')
            						failureCallback(data.data);
            				}
            				function onSuccess(data) {
            					if(typeof successCallback === 'function')
            						successCallback(data.data);
            				}
            }

			function particularTrailBalance(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.PARTICULAR_TRIAL_BALANCES, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function openBalRep(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_OP_BAL_REP, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addAccountMaster(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_MASTER_ADD, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addVoucher(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.VOUCHER_ADD, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAccountMaster(request, successCallback, failureCallback) {

				//var urlWithParams = URL.ACCOUNT_MASTER_GET +'?'+ prepareParameters(request);

				HTTPConnection.post(URL.ACCOUNT_MASTER_GET, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getBalanceSheetReport(request, successCallback, failureCallback) {

				//var urlWithParams = URL.ACCOUNT_MASTER_GET +'?'+ prepareParameters(request);

				HTTPConnection.post(URL.BALANCE_SHEET_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAccountMasterStructure(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ACCOUNT_MASTER_GET_STRUCTURE, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAccountMasterStructureAll(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ACCOUNT_MASTER_GET_STRUCTURE_ALL, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAccountReportTax(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_MASTER_REPORT_TAXES, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAccountReportTDS(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ACCOUNT_MASTER_REPORT_TDS, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getGSTR1CrDrReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1_CR_DR_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getGSTR1InvoiceReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1_INVOICE_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getGSTR1ComputationReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1_COMPUTATION_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			//gstr1 monthly report
			function getGSTR1MonthlyReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1__MONTHLY_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
						//gstr1 summary report
			function getGSTR1SummaryReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1__SUMMARY_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
							//gstr1 Credit Note  report
			function getGSTR1CreditNoteReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1__CREDITNOTE_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getGSTR1PaymentReport(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GSTR1_PAYMENT_REPORT, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			function getVoucher(request, successCallback, failureCallback) {

				var urlWithParams = URL.VOUCHER_GET;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getLedger(request, successCallback, failureCallback) {

				var urlWithParams = URL.LEGDER_GET;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getbankReconciliation(request, successCallback, failureCallback) {

				var urlWithParams = URL.BANK_RECON_GET;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addDues(request, successCallback, failureCallback) {

				var urlWithParams = URL.DUES_ADD;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getDues(request, successCallback, failureCallback) {

				var urlWithParams = URL.DUES_GET;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function duesSmryReport (request, successCallback, failureCallback) {

				var urlWithParams = URL.DUES_REPORT;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateDues(request, successCallback, failureCallback) {

				var url = URL.DUES_UPDATE + request._id; // modify url

				HTTPConnection.post(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteDues(request, successCallback, failureCallback) {

				var url = URL.DUES_DELETE + request._id; // modify url

				HTTPConnection.post(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function prepareParameters(oFilter) {
				var sParam = "";

				for (var property in oFilter) {
					sParam = sParam + "&" + property + "=" + oFilter[property];
				}
				return sParam;
			}

			function updateAccountMasterEditName(request, successCallback, failureCallback) {

				var url = URL.ACCOUNT_MASTER_EDIT_NAME + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateAccountMaster(request, successCallback, failureCallback) {

				var url = URL.ACCOUNT_MASTER_UPDATE + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateOpenBal(request, successCallback, failureCallback) {

				var url = URL.UPDATE_OPEN_BAL + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function delink(request, successCallback, failureCallback) {
				var urlWithParams = URL.DELINK_ACCOUNT;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function bill2billRpt(request, successCallback, failureCallback) {
				var urlWithParams = URL.BILL2BILL_REPORT;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function resetBalance(request, successCallback, failureCallback) {

				var urlWithParams = URL.RESET_BALANCE;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function billLedgerOutstandingRpt(request, successCallback, failureCallback) {

				var urlWithParams = URL.BILL_LEDGER_OUTSTANDING_RPT;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function billLedgOutstmonthlyRpt(request, successCallback, failureCallback) {

				var urlWithParams = URL.BILL_LEDGER_OUTSTANDING_MONTHLY_RPT;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function accOpeningBal(request, successCallback, failureCallback) {

				var urlWithParams = URL.ACC_OPENING_BAL;

				HTTPConnection.post(urlWithParams, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getCostCategory(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GET_COST_CATEGORY, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}
			function getCostCenter(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GET_COST_CENTER, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteCostCenter(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.DELETE_COST_CENTER, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addCostCategory(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ADD_COST_CATEGORY, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateCostCategory(request, successCallback, failureCallback) {

				HTTPConnection.put(URL.UPDATE_COST_CATEGORY + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addCostCenter(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ADD_COST_CENTER, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateCostCenter(request, successCallback, failureCallback) {

				HTTPConnection.put(URL.UPDATE_COST_CENTER + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}



		}
	]
);
