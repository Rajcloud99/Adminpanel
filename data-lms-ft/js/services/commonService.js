
materialAdmin.service('commonService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.updateClient = updateClient;


			// Actual Functions

			function updateClient(request, successCallback, failureCallback) {

				var url = URL.UPDATE_CLIENT; // modify url
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
