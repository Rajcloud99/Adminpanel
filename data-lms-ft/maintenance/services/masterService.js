
function prepareQueryParams(objFilter){
    var strParam = "";
    for(var key in objFilter){
        strParam = strParam +"&"+ key +"="+objFilter[key];
    }
    return strParam;
}

materialAdmin.service('modelService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
    function prepareParameters(oFilter){
        var sParam = "";
        for(var property in oFilter){
          sParam = sParam +"&"+ property +"="+oFilter[property];
        }
        return sParam;
    }

    this.saveModelServ = function(data, succes,failure) {
        HTTPConnection.post(URL.MODEL_ADD, data, succes,failure);
    };
    this.getAllModelList = function(oFilter,success) {
        var url_with_params = URL.MODEL_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    };

    this.updateModelServ = function(data, success,failure) {
        HTTPConnection.put(URL.MODEL_UPDATE+"/"+data._id, data, success,failure);
    };

    this.getModelMatrix = function (success,failure) {
        HTTPConnection.get(URL.MODEL_MATRIX_GET, success, failure);
    };

    this.getVehManufacturers = function (success,failure) {
        HTTPConnection.get(URL.MODEL_MANUFACTURER_GET, success, failure);
    }
}]);

materialAdmin.service('spareService', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
    function prepareParameters(oFilter){
        var sParam = "";
        for(var property in oFilter){
          sParam = sParam +"&"+ property +"="+oFilter[property];
        }
        return sParam;
    }

    this.saveSpareServ = function(data, succes,failure) {
        HTTPConnection.post(URL.SPARE_ADD, data, succes,failure);
    }
    this.postAllIssueServ = function(data, succes,failure) {
        HTTPConnection.post(URL.SPARE_ISSUE_ADD, data, succes,failure);
    }
    this.getAllSpareList = function(oFilter,success) {
        var url_with_params = URL.SPARE_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }
    this.getAllSpareListAll = function(oFilter,success) {
        var url_with_params = URL.SPARE_GET + "?all=true" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }
    this.getAllSpareListAll22 = function(data,success) {
        var url_with_params = URL.SPARE_GET + "?all=true";
        HTTPConnection.get(url_with_params, success);
    }
    this.getAllSpareListFull = function(oFilter,success) {
        var url_with_params = URL.SPARE_GET + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

    this.getAllSpareListTrue = function(oFilter,success) {
        var url_with_params = URL.SPARE_GET + "?all=true" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

	this.getAllSpareListTrueCustom = function(oFilter,success) {
		var url_with_params = URL.SPARE_GET + "?all=true" + prepareParameters(oFilter);
		HTTPConnection.get(url_with_params, function (data) {
			success(data.data.data);
		});
	};

    this.getEstimatedSpare = function(data,success,failure) {
        HTTPConnection.get(URL.SPARE_GET_ESTIMATED+"?jobId="+data.jobId, success,failure);
    }

    this.getInvByCode = function(data,success,failure) {
        HTTPConnection.get(URL.INVENTORY_GET_QTY+"?spare_code="+data.code, success,failure);
    }

    this.getSlipList = function(data,success,failure) {
        HTTPConnection.get(URL.SPARE_GET_SLIP+"?jobId="+data.jobId+"&flag="+data.flag, success,failure);
    }

	/*this.getAllSlipList = function(success, failure) {
        HTTPConnection.get(URL.SPARE_GET_SLIP, success, failure);
    }*/

    this.getAllSlipList = function(oFilter,success, fail) {
        var url_with_params = URL.SPARE_GET_SLIP + "?no_of_docs=15&sort=-1" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success, fail);
    }

    this.getAllRequestedUserService = function(data,success, failure) {
        HTTPConnection.get(URL.REQ_USER_GET, success, failure);
    }

    this.getSlipDetail = function(data,success,failure) {
        HTTPConnection.get(URL.SPARE_GET_SLIP+"?slip_number="+data.slip_number, success,failure);
    }

    this.getLastPurchaseDetail = function(data,success,failure) {
        HTTPConnection.get(URL.INVENTORY_GET+"?sort=-1&spare_code="+data.spare_code, success,failure);
    }

    this.updateSpareServ = function(data, success,failure) {
        HTTPConnection.put(URL.SPARE_UPDATE+"/"+data._id, data, success,failure);
    }

    this.getAllPr = function(oFilter,success,failure) {
        var url_with_params = URL.PR_GET + "?no_of_docs=15&sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
    }
    this.getAllPrAll = function(oFilter,success,failure) {
        var url_with_params = URL.PR_GET + "?all=true&sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
    }

    this.getPrByDate = function(data,success,failure) {
        HTTPConnection.get(URL.PR_GET + "?date="+data.date, success,failure);
    }

    this.createPOnewServ = function(data,success,failure) {
        HTTPConnection.get(URL.PO_CREATE, success,failure);
    }
    this.getAllPOserv = function(oFilter,success,failure) {
        var url_with_params = URL.PO_GET + "?no_of_docs=15&sort=-1" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
        //HTTPConnection.get(URL.PO_GET, success,failure);
    }
    this.getAllPOForDorpdown = function(oFilter,success,failure) {
        var url_with_params = URL.PO_GET + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
        //HTTPConnection.get(URL.PO_GET, success,failure);
    }
    this.getPOserv = function(oFilter,success,failure) {
        var url_with_params = URL.PO_GET + "?" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
        //HTTPConnection.get(URL.PO_GET + "?all=true" , success,failure);
    }
    this.getAllPOvendorServ = function(data,success,failure) {
        HTTPConnection.get(URL.MAINTENANCEVENDOR_GET + "?all=true", success,failure);
    }
    this.getAllPOapproverServ = function(data,success,failure) {
        HTTPConnection.get(URL.APPROVER_GET + "?user_type=POapprover", success,failure);
    }
    this.getAllPRapproverServ = function(data,success,failure) {
        HTTPConnection.get(URL.APPROVER_GET + "?user_type=PRapprover", success,failure);
    };

    this.getAllSOapproverServ = function(data,success,failure) {
        HTTPConnection.get(URL.APPROVER_GET + "?user_type=SOApprover", success,failure);
    };

	this.getAllPRapproverCustom = function(opts = {},success,failure) {
		HTTPConnection.get(URL.APPROVER_GET + "?user_type=QuotApprover", function (data) {
			if(opts.src === 'quotation') {
				data = data.data.data/*.map(function (appr) {
					return {
						'name': appr.full_name,
						'userId': appr._id
					};
				});*/
			} else {
				data = data.data.data;
			}
			success(data);
		},failure);
	};

    this.getInvoiceAck = function(data, success, failure) {
        HTTPConnection.get(URL.APPROVER_GET + '?full_name='+data+'&user_type=InvoiceAcknowledgor', function(res){success(res.data);},failure);
    };
    this.getInvoiceApprovers = function(data,success,failure) {
        HTTPConnection.get(URL.APPROVER_GET + "?user_type=InvoiceApprover", success,failure);
    };

    this.savePOeditServ = function(data, success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.put(URL.PO_UPDATE+"/"+data.po_id, data, parseSuccessData,parseFailureData);
    }
    this.savePOeditService2 = function(data, success,failure) {
        function parseSuccessData(data){
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        HTTPConnection.put(URL.PO_UPDATE222+"/"+data._id, data, parseSuccessData,parseFailureData);
    }
    this.removePRserv = function(data, succes,failure) {
        HTTPConnection.delete(URL.DEL_PR+"/"+data._id, data, succes,failure);
    }
    this.downloadPO = function(data, succes,failure) {
        HTTPConnection.post(URL.PO_DOWNLOAD, data, succes,failure);
    }

	this.downloadIssueSlip = function(data, succes,failure) {
        HTTPConnection.post(URL.ISSUE_SLIP_DOWNLOAD, data, succes,failure);
    }


}]);

materialAdmin.service('inventoryService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {
    this.getInventories = function(oFilter,success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.INVENTORY_GET + "?no_of_docs=10&sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };

    this.getAggreInventories = function(oFilter,success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.INVENTORY_GET + "?sort=-1&aggregate=true" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };

    this.getPrServ = function(data,success,failure) {
        HTTPConnection.get(URL.INVENTORY_GET_PR, success,failure);
    }

    this.generatePRservice = function(data, succes,failure) {
        HTTPConnection.post(URL.PR_ADD, data, succes,failure);
    };
    this.updatePRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_UPDATE+"/"+data._id, data, success,failure);
    };
    this.processPRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_PROCESS+"/"+data._id, data, success,failure);
    };
    this.approvePRservice = function(data, success,failure) {
        HTTPConnection.put(URL.PR_APPROVE+"/"+data._id, data, success,failure);
    };
    this.saveInventory = function(data, succes,failure) {
        HTTPConnection.post(URL.INVENTORY_ADD, data, succes,failure);
    }
}]);

materialAdmin.service('poService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {
    this.getPOs = function(oFilter,success,failure) {
        function parseSuccessData(data){
            //console.log("success response :" +JSON.stringify(data.data));
            return success(data.data);
        }
        function parseFailureData(data){
            return failure(data.data);
        }
        var url_with_params = URL.PO_GET + "?sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, parseSuccessData, parseFailureData);
    };
}]);

materialAdmin.service('otherExpensesService', ['HTTPConnection', 'URL', function(HTTPConnection, URL) {

	this.add = function(data, success,failure) {
        HTTPConnection.post(URL.OTHER_EXPENSES_ADD, data, success,failure);
    };

	this.update = function(data, success,failure) {
        HTTPConnection.put(URL.OTHER_EXPENSES_UPDATE+"/"+data._id, data, success,failure);
    };

	this.approve = function(data, success,failure) {
        HTTPConnection.put(URL.OTHER_EXPENSES_APPROVE+"/"+data._id, {}, success,failure);
    };

	this.get = function(oFilter,success,failure) {
        var url_with_params = URL.OTHER_EXPENSES_GET + "?no_of_docs=10&sort=-1" + prepareQueryParams(oFilter);
        HTTPConnection.get(url_with_params, success,failure);
    };

}]);


