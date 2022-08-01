
materialAdmin.service('billsCoverNoteService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.get = get;
			this.add = add;
			this.update = update;


			// Actual Functions

			function get(request, successCallback, failureCallback) {

				var url = URL.GET_COVER_NOTE; // modify url
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

			function add(request, successCallback, failureCallback) {

				var url = URL.ADD_COVER_NOTE; // modify url
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

			function update(request, successCallback, failureCallback) {

				var url = URL.UPDATE_COVER_NOTE + request._id; // modify url
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
