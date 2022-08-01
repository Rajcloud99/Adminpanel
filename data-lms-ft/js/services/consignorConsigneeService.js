
materialAdmin.service('consignorConsigneeService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.addConsignorConsignee = addConsignorConsignee;
			this.updateConsignorConsignee = updateConsignorConsignee;
			this.getConsignorConsignee = getConsignorConsignee;
			this.deleteConsignorConsignee = deleteConsignorConsignee;
			//this.addVoucher = addVoucher;
			//this.getAccountReportTax = getAccountReportTax;
			//this.getAccountReportTDS = getAccountReportTDS;
			//this.getGSTR1CrDrReport = getGSTR1CrDrReport;
			//this.getGSTR1InvoiceReport = getGSTR1InvoiceReport;
			//this.getVoucher = getVoucher;



			// Actual Functions

			function addConsignorConsignee(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.CONSIGNOR_CONSIGNEE_ADD, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}


			function getConsignorConsignee(request, successCallback, failureCallback) {

				var urlWithParams = URL.CONSIGNOR_CONSIGNEE_GET +'?'+ prepareParameters(request);

				HTTPConnection.get(urlWithParams, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateConsignorConsignee(request, successCallback, failureCallback) {

				var url = URL.CONSIGNOR_CONSIGNEE_UPDATE + request._id; // modify url

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

			function deleteConsignorConsignee(request, successCallback, failureCallback) {

				//var url = URL.CONSIGNOR_CONSIGNEE_DELETE + request._id; //modify url

				HTTPConnection.delete(URL.CONSIGNOR_CONSIGNEE_DELETE + request._id,  request, onSuccess, onFailure);

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
					sParam = sParam + "&" + property + "=" + encodeURIComponent(oFilter[property]);
				}
				return sParam;
			}

		}
	]
);
