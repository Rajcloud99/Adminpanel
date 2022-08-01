
materialAdmin.service('genBillService',
	[	'HTTPConnection',
		'URL',
		function(
			HTTPConnection,
			URL
		){

			// functions Identifiers
			this.getGenBill = getGenBill;
			this.addGenBill = addGenBill;
			this.updateGenBill = updateGenBill;
			this.removeGenBill = removeGenBill;
			this.unApproveBill = unApproveBill;
			this.unApproveBill = unApproveBill;
			this.cancelBill = cancelBill;
			this.approveBill = approveBill;
			this.deleteBill = deleteBill;


			// Actual Functions

			function getGenBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.GET_GEN_BILLS, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function addGenBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.ADD_GEN_BILL, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function updateGenBill(request, successCallback, failureCallback) {

				var url = URL.UPDATE_GEN_BILL + request._id; // modify url

				HTTPConnection.post(url , request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function removeGenBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.REMOVE_GEN_BILL + request._id,  request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function unApproveBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.UNAPPROVE_GEN_BILL + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function approveBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.APPROVE_GEN_BILL + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function cancelBill(request, successCallback, failureCallback) {

				HTTPConnection.post(URL.CANCEL_GEN_BILL + request._id, request, onSuccess, onFailure);

				function onFailure(data) {
					if(typeof failureCallback === 'function')
						failureCallback(data.data);
				}
				function onSuccess(data) {
					if(typeof successCallback === 'function')
						successCallback(data.data);
				}
			}

			function deleteBill(request, successCallback, failureCallback) {

				var url = URL.DELETE_GEN_BILL + request._id; // modify url

				HTTPConnection.delete(url , request, onSuccess, onFailure);

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
