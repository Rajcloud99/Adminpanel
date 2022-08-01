materialAdmin.service('CustomerRateChartService', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage', function($rootScope, HTTPConnection, URL, $localStorage) {

	const serialize = function (obj, prefix) {
		var str = [], p;
		for (p in obj) {
			if (obj.hasOwnProperty(p)) {
				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
				str.push((v !== null && !(v instanceof Date) && typeof v === "object") ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
			}
		}
		return str.join("&");
	};

	this.get = (f = {}) => new Promise((rs, rj) => HTTPConnection.get(`${URL.GET_OR_CREATE_CUSTOMER_RATE_CHART}?${serialize(f)}`, d => rs(d.data), e => rj(e)));

	this.getAggr = (f = {}) => new Promise((rs, rj) => HTTPConnection.get(`${URL.GET_CUSTOMER_RATE_CHART}?${serialize(f)}`, d => rs(d.data), e => rj(e)));

	this.add = (f = {}) => new Promise((rs, rj) => HTTPConnection.post(URL.GET_OR_CREATE_CUSTOMER_RATE_CHART, f, d => rs(d.data), e => rj(e)));

	this.remove = (f = {}) => new Promise((rs, rj) => HTTPConnection.post(URL.REMOVE_CUSTOMER_RATE_CHART, f, d => rs(d.data), e => rj(e)));

	this.deleteRate = (f = {}) => new Promise((rs, rj) => HTTPConnection.post(URL.DELETE_RATE, f, d => rs(d.data), e => rj(e)));

	this.uploadDownloadSample = (qp = {}, p = {}, cid) => new Promise((rs, rj) => (
		HTTPConnection.post(`${URL.CUSTOMER_RATE_CHART_DOWNLOAD_SAMPLE}/${cid}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
	));

	this.uploadDownloadRate = (qp = {}, p = {}) => new Promise((rs, rj) => {
		qp.request_id = Date.now()+''+Math.round(Math.random()*100);
		HTTPConnection.post(`${URL.RATE_UPLOAD}?${serialize(qp)}`, p, d => rs(d.data), e => rj(e), true)
	});


}]);
