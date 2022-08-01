/**
 * Created by Dev
 */

materialAdmin.service('directoryService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.getDirectory = getDirectory;


			// Actual Functions

			function getDirectory(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.GET_DIRECTORY, request, onSuccess, onFailure);
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
