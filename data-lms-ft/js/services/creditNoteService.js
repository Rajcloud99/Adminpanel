/**
 * Created by
 */

materialAdmin.service('creditNoteService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.getCreditNote = getCreditNote;
			this.addCreditNote = addCreditNote;
			this.editCreditNote = editCreditNote;
			this.unapprove = unapprove;
			this.remove = remove;
			this.rpt = rpt;
			this.addMiscCreditNote = addMiscCreditNote;
			this.editMiscCreditNote = editMiscCreditNote;
			this.deleteMiscCreditNote = deleteMiscCreditNote;


			// Actual Functions

			function getCreditNote(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.GET_CREDIT_NOTE, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addCreditNote(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ADD_CREDIT_NOTE, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editCreditNote(request, successCallback, failureCallback) {
				var url = URL.EDIT_CREDIT_NOTE + request._id; // modify url
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

			function unapprove(request, successCallback, failureCallback) {
				var url = URL.UNAPPROVE_CREDIT_NOTE + request._id; // modify url
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

			function remove(request, successCallback, failureCallback) {
				var url = URL.REMOVE_CREDIT_NOTE + request._id; // modify url
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

			function rpt(request, successCallback, failureCallback) {
				let url;
				switch (request.download) {
					case 'dedRpt':
						url = URL.CREDIT_NOTE_DED_RPT;
						break;
				}
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

			function addMiscCreditNote(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.ADD_MISC_CREDIT_NOTE, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function editMiscCreditNote(request, successCallback, failureCallback) {
				HTTPConnection.post(URL.EDIT_MISC_CREDIT_NOTE + request._id, request, onSuccess, onFailure);
				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteMiscCreditNote(request, successCallback, failureCallback) {
				var url = URL.DELETE_MISC_CREDIT_NOTE + request._id; // modify url
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
