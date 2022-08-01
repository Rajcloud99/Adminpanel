materialAdmin.service('jobCardServices', ['$rootScope', 'HTTPConnection', 'URL', function($rootScope, HTTPConnection, URL) {
    function prepareParameters(oFilter){
        var sParam = "";
        for(var property in oFilter){
          sParam = sParam +"&"+ property +"="+oFilter[property];
        }
        return sParam;
    }

    this.saveJobCardServ = function(data, succes,failure) {
        HTTPConnection.post(URL.JOBCARD_ADD, data, succes,failure);
    }
    this.getAllJobCards = function(oFilter,success) {
        var url_with_params = URL.JOBCARD_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

    this.getAllJobCardsFull = function(oFilter,success) {
        var url_with_params = URL.JOBCARD_GET + "?all=true" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

    this.getSelTask = function(data,success) {
        var url_with_params = URL.JOBCARD_TASK_GET + "?no_of_docs=10" + '&jobId=' + data.jobId;
        HTTPConnection.get(url_with_params, success);
    }

    this.getSelTaskSpare = function(data,success) {
        var url_with_params = URL.SPARE_GET_SLIP + "?taskId=" + data.taskId;
        HTTPConnection.get(url_with_params, success);
    }

    this.getSpareSugg = function(data, succes,failure) {
        HTTPConnection.post(URL.TASK_GET_SPARE, data, succes,failure);
    }

    this.addExpenseServ = function(data, succes,failure) {
        HTTPConnection.post(URL.UPDATE_EXPENSE, data, succes,failure);
    }

    this.getContExpense = function(data, succes,failure) {
        var url_with_params = URL.GET_EXPENSE + '?jobId=' + data.jobId;
        HTTPConnection.get(url_with_params, succes,failure);
        //HTTPConnection.get(URL.GET_EXPENSE + '?jobId=' + data.jobId, data, succes,failure);
    }

    this.saveJobCardTaskServ = function(data, succes,failure) {
        HTTPConnection.post(URL.JOBCARD_TASK_ADD, data, succes,failure);
    }

    this.updateJobCardTaskServ = function(data, success,failure) {
        HTTPConnection.put(URL.JOBCARD_TASK_UPDATE+"/"+data._id, data, success,failure);
    }

    this.getAllJobCardsTask = function(oFilter,success) {
        var url_with_params = URL.JOBCARD_TASK_GET + "?no_of_docs=10" + prepareParameters(oFilter);
        HTTPConnection.get(url_with_params, success);
    }

    this.updatejobcard = function(data, success,failure) {
        HTTPConnection.put(URL.UPDATE_JOB_CARD+"/"+data._id, data, success,failure);
    }

    this.getTasksContractorExpense = function(data,success,fail) {
        var url_with_params = URL.GET_TASK_CONTRACTOR_EXPENSE + "?taskId=" + data.taskId;
        HTTPConnection.get(url_with_params, success,fail);
    }

    this.getJcdService = function(data,success,fail) {
        var url_with_params = URL.GET_JCD + "/" + data.jobId;
        HTTPConnection.get(url_with_params, success,fail);
    }
}]);