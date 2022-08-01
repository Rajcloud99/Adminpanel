/**
 * Created by
 */

materialAdmin.service('moneyReceiptService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.getMoneyReceipt = getMoneyReceipt;
			this.addMoneyReceipt = addMoneyReceipt;
			this.addMoneyReceiptV2 = addMoneyReceiptV2;
			this.editMoneyReceipt = editMoneyReceipt;
			this.editMoneyReceiptV2 = editMoneyReceiptV2;
			this.removeMoneyReceipt = removeMoneyReceipt;
			this.pullVoucher = pullVoucher;


			// Actual Functions

			function getMoneyReceipt(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.GET_MONEY_RECEIPT, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addMoneyReceipt(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ADD_MONEY_RECEIPT, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}


			function addMoneyReceiptV2(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ADD_MONEY_RECEIPTV2, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editMoneyReceipt(request, successCallback, failureCallback) {
				var url = URL.EDIT_MONEY_RECEIPT + request._id; // modify url
				HTTPConnection.put(url, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editMoneyReceiptV2(request, successCallback, failureCallback) {
				var url = URL.EDIT_MONEY_RECEIPTV2 + request._id; // modify url
				HTTPConnection.put(url, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function removeMoneyReceipt(request, successCallback, failureCallback) {
				var url = URL.REMOVE_MONEY_RECEIPT + request._id; // modify url
				HTTPConnection.delete(url, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function pullVoucher(request, successCallback, failureCallback) {

				var url = URL.PULL_VOUCHER + request._id; // modify url

				HTTPConnection.post(url, request, onSuccess, onFailure);
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
