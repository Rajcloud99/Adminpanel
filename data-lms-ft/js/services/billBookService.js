materialAdmin
	.service('billBookService', billBookService);

billBookService.$inject = [
	'$timeout',
	'HTTPConnection',
	'URL',
	'debounceWrapper'
];

function billBookService(
	$timeout,
	HTTPConnection,
	URL,
	debounceWrapper
){

	this.add = add;
	this.modifyBookStationary = modifyBookStationary;
	this.get = get;
	this.billBookReport = billBookReport;
	this.fullyUnusedReport = fullyUnusedReport;
	this.missingDocRpt = missingDocRpt;
	this.getStationery = debounceWrapper(getStationery);
	this.getStationeryV2 = debounceWrapper(getStationeryV2);
	this.billStationeryUse = billStationeryUse;
	this.deleteBillBook = deleteBillBook;
	this.softDeleteBillBook = softDeleteBillBook;
	this.update = update;
	this.disable= disable;
	this.enable = enable;
	this.freeStationaryReq = freeStationaryReq;
	this.deleteStationaryReq = deleteStationaryReq;

	// Actual Function

	function get(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_BOOK_GET, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function fullyUnusedReport(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.STOCK_BOOK,request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function billBookReport(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_BOOK_GETREPORT, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function missingDocRpt(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.MISSING_STATIONARY_RPT, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function getStationery(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_STATIONERY_GET, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function getStationeryV2(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_STATIONERY_GETV2, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function add(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_BOOK_ADD, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function modifyBookStationary(request, successCallback, failureCallback) {
		HTTPConnection.post(URL.BILL_BOOK_STA_MODIFY, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function update(request, successCallback, failureCallback) {

		var url = URL.BILL_BOOK_UPDATE + request._id; // modify url

		HTTPConnection.put(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function billStationeryUse(request, successCallback, failureCallback) {

		var url = URL.BILL_STATIONERY_USE + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function disable(request, successCallback, failureCallback) {

		var url = URL.BILL_STATIONERY_ENABEL + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	// Added By Harikesh - 22/11/2019

	function freeStationaryReq(request, successCallback, failureCallback) {

		var url = URL.BILL_STATIONERY_FREE + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function deleteStationaryReq(request, successCallback, failureCallback) {

		var url = URL.BILL_STATIONERY_DELETE + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	// ENd

	function enable(request, successCallback, failureCallback) {

		var url = URL.BILL_STATIONERY_DISABEL + request._id; // modify url

		HTTPConnection.post(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function deleteBillBook(request, successCallback, failureCallback) {

		var url = URL.BILL_BOOK_DELETE + request._id; // modify url

		HTTPConnection.delete(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function softDeleteBillBook(request, successCallback, failureCallback) {

		var url = URL.BILL_BOOK_SOFT_DELETE + request._id; // modify url

		HTTPConnection.delete(url, request, onSuccess(successCallback), onFailure(failureCallback));
	}

	function onSuccess(callbackfn) {
		return function(data){
			if(typeof callbackfn === 'function')
				callbackfn(data.data);
		}
	}

	function onFailure(callbackfn) {
		return function(data){
			if(typeof callbackfn === 'function')
				callbackfn(data.data);
			else
				data.data.message && swal('Error', data.data.message, 'error');
		}
	}
}
