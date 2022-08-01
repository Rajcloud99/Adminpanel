materialAdmin.service('reportMRPService', ['HTTPConnection', 'URL','otherUtils',
	function(HTTPConnection, URL, otherUtils) {

		this.getQuotationReport = function(oQuery, success) {
			function parse(data) {
				 return success(data.data);
			}

			let url_with_params = URL.QUOTATION_REPORT + otherUtils.prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parse);
		};

		this.getSOReport = function(oQuery,success) {
			function parse(data) {
				return success(data.data);
			}
			let url_with_params = URL.SO_REPORT + otherUtils.prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parse);
		};

		this.getInvoiceReport = function(oQuery,success) {
			function parse(data) {
				return success(data.data);
			}
			let url_with_params = URL.SO_INVOICE_REPORT + otherUtils.prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parse);
		};
	}]);
