materialAdmin.service('incentiveService', incentiveService);

incentiveService.$inject = ['HTTPConnection', 'URL'];

function incentiveService(HTTPConnection, URL) {

	this.add = add;
	this.get = get;
	this.update = update;
	this.autosuggest = autosuggest;

	// Actual Function

	function get(request, successCallback, failureCallback) {

		HTTPConnection.post(URL.INCENTIVE_GET, request, onSuccess, onFailure);

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

		HTTPConnection.post(URL.INCENTIVE_ADD, request, onSuccess, onFailure);

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

		HTTPConnection.post(URL.INCENTIVE_AUTO_SUGGEST, request, onSuccess, onFailure);

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
