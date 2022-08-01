/**
 * Created by JA
 */

materialAdmin.service('dashboardService',
	[	'$timeout',
		'HTTPConnection',
		'URL',
		function(
			$timeout,
			HTTPConnection,
			URL,
			cacheData
		){

			// functions Identifiers
			this.getBillAnalytics = getBillAnalytics;
			this.getBookingAnalytics = getBookingAnalytics;
			this.getProfitAnalytics = getProfitAnalytics;
			this.getService =  getService;
			this.getTripAnalytics = getTripAnalytics;


			// Actual Functions

			function getBillAnalytics(request, successCallback, failureCallback) {

				var urlWithParams = URL.BILL_ANALYTICS +'?'+ prepareParameters(request);

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

			function getBookingAnalytics(request, successCallback, failureCallback) {

				var urlWithParams = URL.BOOKING_ANALYTICS +'?'+ prepareParameters(request);

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

			function getProfitAnalytics(request, successCallback, failureCallback) {

				var urlWithParams = URL.PROFIT_ANALYTICS +'?'+ prepareParameters(request);

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

			function getService(url, request, successCallback, failureCallback) {

				let $_methodType = request.$_methodType || 'get';

				delete request.$_methodType;

				let urlWithParams = URL.BASE_URL + url +'?'+ prepareParameters(request);

				let httpArr;

				if($_methodType === 'get')
					httpArr = [urlWithParams, onSuccess, onFailure];
				else
					httpArr = [URL.BASE_URL + url, request, onSuccess, onFailure];

				HTTPConnection[$_methodType](...httpArr);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					 if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getTripAnalytics(request, successCallback, failureCallback) {

				var urlWithParams = URL.TRIP_ANALYTICS +'?'+ prepareParameters(request);

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
	]
);
