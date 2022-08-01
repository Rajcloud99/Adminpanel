materialAdmin.service('fpaMasterService', fpaMasterService);

fpaMasterService.$inject = ['HTTPConnection', 'URL'];

function fpaMasterService(HTTPConnection, URL) {

	this.add = add;
	this.get = get;
	this.update = update;
	this.autosuggest = autosuggest;

	// Actual Function

	function get(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.FPA_GET, request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	function autosuggest(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.FPA_AUTOSUGGEST, request, onSuccess, onFailure);

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

		HTTPConnection.post(URL.FPA_ADD, request, onSuccess, onFailure);

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

		var url = URL.INCENTIVE_UPDATE + request._id; // modify url

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
}

materialAdmin.service('fpaBillService', fpaBillService);

fpaBillService.$inject = ['HTTPConnection', 'URL'];

function fpaBillService(HTTPConnection, URL) {

	this.add = add;
	this.get = get;
	this.update = update;
	this.report = report;

	// Actual Function

	function get(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.FPA_BILL_GET, request, onSuccess, onFailure);

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

		HTTPConnection.post(URL.FPA_BILL_ADD, request, onSuccess, onFailure);

		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	}

	function report(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.FPA_BILL_REPORT, request, onSuccess, onFailure);

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

		var url = URL.INCENTIVE_UPDATE + request._id; // modify url

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
}

