/**
 * Created by pratik on 11/5/18.
 */
materialAdmin.service('GPSService', ['HTTPConnection', 'URL',
	function(HTTPConnection, URL) {

		function prepareQeuryParams(oQuery) {
			var sParam = "";
			for (var property in oQuery) {
				sParam = sParam + "&" + property + "=" + oQuery[property];
			}
			if (sParam.length > 0) {
				sParam = "?" + sParam;
			}
			return sParam;
		}
		function formQuery(queryObj) {
			var str = '?';
			for (var key in queryObj) {
				if (queryObj.hasOwnProperty(key)) {
					str += key + '=' + queryObj[key] + '&';
				}
			}
			str = str.slice(0, -1);
			return str;
		}

		this.getDevice = function(oQuery, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			var url_with_params = URL.DEVICE_MASTER_GET + prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
		};

		this.addDevice = function(oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.DEVICE_MASTER_INWARD, oData, parseSuccessResp, parseFailureResp);
		};

		this.allot_gps = function(oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.DEVICE_MASTER_ALLOCATE, oData, parseSuccessResp, parseFailureResp);
		};

		this.issue_gps = function(oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.DEVICE_MASTER_ISSUE, oData, parseSuccessResp, parseFailureResp);
		};
		this.returnFromSalesExecutive = function(oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.DEVICE_MASTER_RETURN_FROM_SALES, oData, parseSuccessResp, parseFailureResp);
		};
		this.returnFromCustomer = function(oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.DEVICE_MASTER_RETURN_FROM_CUSTOMER, oData, parseSuccessResp, parseFailureResp);
		};
		this.getDeviceSlips = function (oQuery,success,failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			var url_with_params = URL.DEVICE_MASTER_SLIPS_GET + prepareQeuryParams(oQuery);
			HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
		};
		this.previewSlip = function (data,success,failure) {
			HTTPConnection.get(URL.PREVIEW_DEVICE_MASTERS_SLIP + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		};
		this.update = function (id, data,success,failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.put(URL.DEVICE_MASTER_UPDATE + id, data, parseSuccessResp, parseFailureResp);
		};
		this.replaceDevice = function (oData, success, failure) {
			var parseSuccessResp = function(data) {
				success(data.data);
			};
			var parseFailureResp = function(data) {
				failure(data.data);
			};
			HTTPConnection.post(URL.REPLACE_DEVICE, oData, parseSuccessResp, parseFailureResp);
		};
	}
]);
