materialAdmin.service('invoiceService', [ 'HTTPConnection', 'URL', function(HTTPConnection, URL) {
    this.updateInvoice = function(data, success,failure) {
		HTTPConnection.put(URL.INVOICE_UPDATE+data._id, data, success,failure);
	};
	this.updateBill = function(data, success,failure) {
		HTTPConnection.put(URL.INVOICE_UPDATE+"bill/"+data._id, data, success,failure);
	};
}]);
