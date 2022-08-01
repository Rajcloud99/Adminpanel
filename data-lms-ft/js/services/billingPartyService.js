
materialAdmin.service('billingPartyService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		) {

			// functions Identifiers
			this.addBillingParty = addBillingParty;
			this.updateBillingParty = updateBillingParty;
			this.getBillingParty = getBillingParty;
			this.deleteBillingParty = deleteBillingParty;
			this.deleteConfig = deleteConfig;
			//this.addVoucher = addVoucher;
			//this.getAccountReportTax = getAccountReportTax;
			//this.getAccountReportTDS = getAccountReportTDS;
			//this.getGSTR1CrDrReport = getGSTR1CrDrReport;
			//this.getGSTR1InvoiceReport = getGSTR1InvoiceReport;
			//this.getVoucher = getVoucher;


			// Actual Functions

			function addBillingParty(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.BILLING_PARTY_ADD, request, onSuccess, onFailure);

				function onFailure(data) {
					if (typeof failureCallback === 'function')
						failureCallback(data.data);
				}

				function onSuccess(data) {
					if (typeof successCallback === 'function')
						successCallback(data.data);
				}
			}


			function getBillingParty(request, successCallback, failureCallback) {

				var urlWithParams = URL.BILLING_PARTY_GET + '?' + prepareParameters(request);

				HTTPConnection.get(urlWithParams, onSuccess, onFailure);

				function onFailure(data) {
					if (typeof failureCallback === 'function')
						failureCallback(data.data);
				}

				function onSuccess(data) {
					if (typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateBillingParty(request, successCallback, failureCallback) {

				var url = URL.BILLING_PARTY_UPDATE + request._id; // modify url

				HTTPConnection.put(url, request, onSuccess, onFailure);

				function onFailure(data) {
					if (typeof failureCallback === 'function')
						failureCallback(data.data);
				}

				function onSuccess(data) {
					if (typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteBillingParty(request, successCallback, failureCallback) {

				//var url = URL.BILLING_PARTY_DELETE + request._id; //modify url

				HTTPConnection.delete(URL.BILLING_PARTY_DELETE + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if (typeof failureCallback === 'function')
						failureCallback(data.data);
				}

				function onSuccess(data) {
					if (typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteConfig(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.DELETE_BP_CONFIG + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if (typeof failureCallback === 'function')
						failureCallback(data.data);
				}

				function onSuccess(data) {
					if (typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			this.uploadCommon = (qp = {}, p = {}) => new Promise((rs, rj) => (
				HTTPConnection.post(`${URL.COMMON_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
			));

			function prepareParameters(oFilter) {
				var sParam = "";

				for (var property in oFilter) {
					sParam = sParam + "&" + property + "=" + encodeURIComponent(oFilter[property]);
				}
				return sParam;
			}


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

		}
	]
);
