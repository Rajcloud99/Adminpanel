/**
 * Created by
 */

materialAdmin.service('voucherService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.addVoucher = addVoucher;
			this.addGSTPaymentVoucher = addGSTPaymentVoucher;
			this.tdsPayment = tdsPayment;
			this.editPlainVoucher = editPlainVoucher;
			this.getVoucherPreview = getVoucherPreview;
			this.deletePlainVoucher = deletePlainVoucher;
			this.getVoucher = getVoucher;
			this.bulkAddPlainVoucher = bulkAddPlainVoucher;
			this.bulkUpsertPlainVoucher = bulkUpsertPlainVoucher;
			this.reversePlainVoucher = reversePlainVoucher;
			this.getBillNo = getBillNo;
			this.createVouchersCommon = createVouchersCommon;
			this.downloadVouchers = downloadVouchers;
			this.clearCheque = clearCheque;
			this.unClearCheque = unClearCheque;
			this.downloadTDSReport = downloadTDSReport;
			this.voucherTDSReport = voucherTDSReport;
			this.TdsDayWise = TdsDayWise;
			this.TdsGroupSummary = TdsGroupSummary;
			this.TdsMonthly = TdsMonthly;
			this.addVehicleExp = addVehicleExp;
			this.editVehicleExp = editVehicleExp;
			this.deleteVehicleExp = deleteVehicleExp;

			this.upload = (qp = {}, p = {}) => new Promise((rs, rj) => (
				HTTPConnection.post(`${URL.PLAIN_VOUCHER_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
			));

			this.uploadVoucher = (qp = {}, p = {}) => new Promise((rs, rj) => (
				HTTPConnection.post(`${URL.VOUCHER_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
			));

			function serialize(obj, prefix) {
				var str = [], p;
				for (p in obj) {
					if (obj.hasOwnProperty(p)) {
						var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
						str.push((v !== null && !(v instanceof Date) && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
					}
				}
				return str.join("&");
		}

			function addVoucher(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.PLAIN_VOUCHER_ADD + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function tdsPayment(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.TDS_PAYMENT + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function bulkAddPlainVoucher(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.BULK_PLAIN_VOUCHER_ADD + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function bulkUpsertPlainVoucher(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.BULK_PLAIN_VOUCHER_UPSERT + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addGSTPaymentVoucher(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.GST_PAYMENT_VOUCHER_ADD + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editPlainVoucher(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.PLAIN_VOUCHER_EDIT + request._id, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getVoucherPreview (id , successCallback, failureCallback) {
				HTTPConnection.post(URL.VOUCHER_PRINT + id,onSuccess,onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deletePlainVoucher(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.PLAIN_VOUCHER_DELETE, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function reversePlainVoucher(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.PLAIN_VOUCHER_REVERSE, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getBillNo(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.GET_BILL_NO, request, onSuccess, onFailure);
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

				var urlWithParams = URL.PLAIN_VOUCHER_GET;

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

			function downloadVouchers(request, successCallback, failureCallback) {
				var urlWithParams = URL.PLAIN_VOUCHER_DOWNLOAD;
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

			function downloadTDSReport(request, successCallback, failureCallback) {
				var urlWithParams = URL.TDS_REPORT_DOWNLOAD;
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

			function TdsDayWise(request, successCallback, failureCallback) {
				var urlWithParams = URL.TDS_DAY_WISE;
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

				function TdsGroupSummary(request, successCallback, failureCallback) {
				var urlWithParams = URL.TDS_GROUP_SUMMARY;
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

			function TdsMonthly(request, successCallback, failureCallback) {
				var urlWithParams = URL.TDS_MONTHLY;
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

			function voucherTDSReport(request, successCallback, failureCallback) {
				var urlWithParams = URL.VOUCHER_TDS_REPORT;
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

			

			function createVouchersCommon(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.CREATE_VOUCHER_COMMON, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function clearCheque(request, successCallback, failureCallback) {

				let urlWithParams = URL.VOUCHER_CLEAR_CHEQUE + request._id;

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

			function unClearCheque(request, successCallback, failureCallback) {

				let urlWithParams = URL.VOUCHER_UNCLEAR_CHEQUE + request._id;

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

			function addVehicleExp(request, successCallback, failureCallback) {
				let _query = request._query;
				delete request._query;

				HTTPConnection.post(URL.VEHICLE_EXPENSE_ADD + '?' + prepareParameters(_query), request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editVehicleExp(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.VEHICLE_EXPENSE_EDIT + request._id, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteVehicleExp(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.VEHICLE_EXPENSE_DELETE, request, onSuccess, onFailure);
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
		}
	]
);
