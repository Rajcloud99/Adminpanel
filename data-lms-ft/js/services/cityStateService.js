/**
 * Created by
 */

materialAdmin.service('cityStateService',
	[	'HTTPConnection',
		'URL',
		'debounceWrapper',
		function(
			HTTPConnection,
			URL,
			debounceWrapper
		){

			// functions Identifiers
			this.getCity = getCity;
			this.upsertCity = upsertCity;
			this.deleteCity = deleteCity;
			this.autosuggestCity = debounceWrapper(autosuggestCity);


			// Actual Functions

			function getCity(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.GET_CITY, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function upsertCity(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.UPSERT_CITY, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteCity(request, successCallback, failureCallback) {
				HTTPConnection.put(URL.DELETE_CITY + "/" + request._id, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function autosuggestCity(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.AUTOSUGGESR_CITY, request, onSuccess, onFailure);
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
