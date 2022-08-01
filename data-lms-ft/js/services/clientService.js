/**
 * Created by manish on 1/8/16.
 */
materialAdmin.service('clientService', ['$rootScope', 'HTTPConnection', 'URL', '$localStorage',
    function($rootScope, HTTPConnection, URL) {

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

        this.getClients = function(oQuery, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            var url_with_params = URL.CLIENT_GET + prepareQeuryParams(oQuery);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.getClientByID = function(oQuery, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            var url_with_params = URL.CLIENT_BY_ID + prepareQeuryParams(oQuery);
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };


        this.updateClient = function(client, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            HTTPConnection.put(URL.CLIENT_UPDATE + client._id, client, parseSuccessResp, parseFailureResp);
        };

        this.updateMultiVehTypes = function(data, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            HTTPConnection.put(URL.VEH_TYPE_MULTIUPDATE, data, parseSuccessResp, parseFailureResp);
        };

        this.addClient = function(client, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            HTTPConnection.post(URL.CLIENT_ADD, client, parseSuccessResp, parseFailureResp);
        };

        this.deleteClient = function(client, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            HTTPConnection.delete(URL.CLIENT_DELETE + client._id, client, parseSuccessResp, parseFailureResp);
        };

        this.getClientNames = function(nameQuery, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            //var url_with_params = URL.CLIENT_GET_TRIM + "?name=" + nameQuery;
            var url_with_params = URL.CLIENT_GET;
            HTTPConnection.get(url_with_params, parseSuccessResp, parseFailureResp);
        };

        this.uploadClientDocs = function(documents, success, failure) {
            var parseSuccessResp = function(data) {
                success(data.data);
            };
            var parseFailureResp = function(data) {
                failure(data.data);
            };
            HTTPConnection.post(URL.CLIENT_UPLOAD_FILE + documents._id, documents, parseSuccessResp, parseFailureResp);
        };

        this.getImage = function(client, success, failure) {
            //var url='http://localhost:3002/api/download/client_logo_57f4b40352fd3d2c10e0e192.png';
            var url_with_params = URL.GET_IMAGE + client;
            HTTPConnection.get(url_with_params, success, failure);
        };

        this.getAllVehTypeServ = function(dt, success) {
            this.getAllSuccess = function(data) {
                success(data.data);
            }
            HTTPConnection.get(URL.VEHICLE_TYPEVEHICLE_GET + '?all=true&byClient=' + dt.clientId, this.getAllSuccess);
        }

		this.createBuilty = function(oFilter, success, fail) {
			var url_with_params = URL.CLIENT_BUILTY + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.grWithOutTripBuilty = function(oFilter, success, fail) {
			var url_with_params = URL.GR_WITHOUT_TRIP_BUILTY + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.tripPerformanceBuilty = function(oFilter, success, fail) {
			var url_with_params = URL.TRIP_PERFORMANCE_BUILTY + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.multiVendSlipBuilty = function(oFilter, success, fail) {
			var url_with_params = URL.MULT_VEND_SLIP_BUILTY + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.tripBuiltyPrint = function(oFilter, success, fail) {
			var url_with_params = URL.TRIP_PRINT;
			HTTPConnection.post(url_with_params, oFilter, success, fail);
		};

		this.createTripMemoBuilty = function(oHead, oBody, success, fail) {
			var url_with_params = URL.CLIENT_NEW_BUILTY +  prepareQeuryParams(oHead);
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};

		this.getTransportSlip = function(oFilter, success, fail) {
			var url_with_params = URL.PREVIEW_TRANSPORTER_SLIP + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.getTdsSlip = function(oFilter, success, fail) {
			var url_with_params = URL.PREVIEW_TDS + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.getLoadingSlip = function(id, success, fail) {
			var url_with_params = URL.LOADING_SLIP + id;
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.getDieselSlip = function(oFilter, success, fail) {
			var url_with_params = URL.CLIENT_DIESEL + prepareQeuryParams(oFilter);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.getBillPreview = function(oHead, oBody, success, fail) {
			var url_with_params = URL.BILL_PREVIEW + prepareQeuryParams(oHead);
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};

		this.getGenBillPreview = function(oBody, success, fail) {
			HTTPConnection.post(URL.GEN_BILL_PREVIEW , oBody, success, fail);
		};

		this.driverProfilePreview = function(oBody, success, fail) {
			HTTPConnection.post(URL.DRIVER_PREVIEW , oBody, success, fail);
		};


		this.multiBillPreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_PREVIEW_MULTI;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};

		this.getCovetNotePreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_COVER_NOTE;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
		this.getCreditNotePreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_CREDIT_NOTE;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
        this.getDebitNotePreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_DEBIT_NOTE;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
		this.getVoucherPreview = function(oBody, success, fail) {
			var url_with_params = URL.VOUCHER_PRINT;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
        this.ledgerPreview = function(oBody, success, fail) {
			var url_with_params = URL.LEDGER_PREVIEW;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
		this.getMoneyReceiptPreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_MONEY_RECEIPT;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};
		this.getPurchaseBillPreview = function(oBody, success, fail) {
			var url_with_params = URL.BILL_PURCHASE_BILL;
			HTTPConnection.post(url_with_params, oBody, success, fail);
		};

		this.getTripSummaryPreview = function(oHead, success, fail) {
			var url_with_params = URL.TRIP_SUMMARY_PREVIEW + prepareQeuryParams(oHead);
			HTTPConnection.get(url_with_params, success, fail);
		};

		this.getRoundTripSummaryPreview = function(oHead, success, fail) {
			var url_with_params = URL.ROUND_TRIP_SUMMARY_PREVIEW + prepareQeuryParams(oHead);
			HTTPConnection.get(url_with_params, success, fail);
		};
		this.getRoundTripDetailedSummaryPreview = function(oHead, success, fail) {
			var url_with_params = URL.ROUND_TRIP_DETAILED_SUMMARY_PREVIEW + prepareQeuryParams(oHead);
			HTTPConnection.get(url_with_params, success, fail);
		};
    }
]);
