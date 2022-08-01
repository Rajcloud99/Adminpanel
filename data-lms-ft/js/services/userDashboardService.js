/**
 * Created by JA
 */

materialAdmin.service('userDashboardService', userDashboardService);

userDashboardService.$inejct = [
	'HTTPConnection',
	'URL'
];

function userDashboardService(
	HTTPConnection,
	URL
){

	// functions Identifiers
	this.upsertDashboardRole = upsertDashboardRole;
	this.getDashboardRole = getDashboardRole;


	// Actual Functions

	function upsertDashboardRole(request, successCallback, failureCallback) {

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

	function getDashboardRole(request, successCallback, failureCallback) {

		var urlWithParams = 'URL.ACCOUNT_MASTER_GET' +'?'+ prepareParameters(request);

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

	function prepareParameters(oFilter) {
		var sParam = "";

		for (var property in oFilter) {
			sParam = sParam + "&" + property + "=" + oFilter[property];
		}
		return sParam;
	}

}
