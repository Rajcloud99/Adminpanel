materialAdmin.service('salesOrderService', ['$rootScope', 'HTTPConnection', 'URL',
	function ($rootScope, HTTPConnection, URL) {

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

		function prepareParameters(oFilter) {
			var sParam = "";
			for (var property in oFilter) {
				sParam = sParam + "&" + property + "=" + oFilter[property];
			}
			return sParam;
		}

		this.getQuotations = function (oFilter, success, failure) {
			var url_with_params = URL.ALL_QUOTATIONS + "?no_of_docs=15&sort=-1" + formQuery(oFilter);
			HTTPConnection.get(url_with_params, function (data) {
				data = data.data.data.map(function (a) {
					a.items = a.items.map(function (b) {
						return {
							...b,
							name: b.item_ref.name,
							category_name: b.item_ref.category_name
						};
					});
					return a;
				});
				success(data);
			}, function (err) {
				failure(err.data);
			});
		};

		this.getQuotations1 = function (oFilter, success, failure) {
			var url_with_params = URL.ALL_QUOTATIONS + "?no_of_docs=15&sort=-1" + prepareParameters(oFilter);
			HTTPConnection.get(url_with_params, function (res) {
				var result = res.data;
				result.data = result.data.map(function (a) {
					a.items = a.items.map(function (b) {
						return {
							...b,
							name: b.item_ref.name,
							category_name: b.item_ref.category_name
						};
					});
					return a;
				});
				success(result);
			}, function (err) {
				failure(err.data);
			});
		};

		this.addQuotations = function (data, success, failure) {
			HTTPConnection.post(URL.ADD_QUOTATIONS, data, success, failure);
		};

		this.updateQuotations = function (data, success, failure) {
			HTTPConnection.put(URL.UPDATE_QUOTATIONS + data._id, data, success, failure);
		};

		this.convertToSalesOrder = function(id, success, failure) {
			HTTPConnection.put(URL.DIRECT_CONVERT_TO_SO + id, {}, success, failure);
		};

		this.getNewSO = function (data, success, failure) {
			HTTPConnection.get(URL.NEW_SO + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		}

		this.salesOrder = function (data, success, failure) {
			HTTPConnection.get(URL.CUSTOMER_SO + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		};

		this.updateSO = function (soId, data, success, failure) {
			HTTPConnection.put(URL.UPDATE_SO + soId, data, success, failure);
		};

		this.previewQuotation = function(data, success, failure) {
			HTTPConnection.get(URL.PREVIEW_QUOTATION + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		};

		this.previewSO = function(data, success, failure) {
			HTTPConnection.get(URL.PREVIEW_SO + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		};

		this.addInvoice = function(data, success, failure) {
			HTTPConnection.post(URL.ADD_INVOICE, data, function (d) {
				success(d.data);
			}, failure);
		};

		this.getInvoice = function(data, success, failure) {
			HTTPConnection.get(URL.GET_INVOICE + formQuery(data), function(d) {
				success(d.data);
			}, failure);
		};

		this.updateInvoice = function(data, success, failure) {
			HTTPConnection.put(URL.UPDATE_INVOICE + data._id, data, success, failure);
		};

		this.previewInvoice = function(data, success, failure) {
			HTTPConnection.get(URL.PREVIEW_INVOICE + formQuery(data), function (d) {
				success(d.data);
			}, failure);
		};

		this.dispatchInvoice = function(id, data, success, failure) {
			HTTPConnection.put(URL.DISPATCH_INVOICE + id, data, success, failure);
		};

	}
]);
