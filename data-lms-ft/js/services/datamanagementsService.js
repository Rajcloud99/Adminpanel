
materialAdmin.service('dmsService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.getAllDocs = getAllDocs;
			this.getAllDocsV2 = getAllDocsV2;
			this.uploadFile = uploadFile;
			this.validateFile = validateFile;
			this.deleteFile = deleteFile;


			// Actual Functions

			function getAllDocsV2(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GET_ALL_DOCS_V, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function getAllDocs(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GET_ALL_DOCS, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}


			function uploadFile(request, successCallback, failureCallback) {

				var url = URL.DOC_UPLOAD + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function validateFile(request, successCallback, failureCallback) {

				var url = URL.DOC_VALIDATION + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteFile(request, successCallback, failureCallback) {

				var url = URL.DELETE_FILE + request._id; // modify url

				HTTPConnection.put(url , request, onSuccess, onFailure);

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
					sParam = sParam + "&" + property + "=" + encodeURIComponent(oFilter[property]);
				}
				return sParam;
			}

		}
	]
);
