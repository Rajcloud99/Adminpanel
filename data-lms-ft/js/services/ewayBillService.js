materialAdmin.service('ewayBillServices',['$rootScope', 'HTTPConnection', 'URL', function($rootscope, HTTPConnection, URL){
    this.getEwayBill = function (data, success, failure) {
        HTTPConnection.post(URL.GET_EWB2, data, success, failure);
    };

    this.getEwayBillReports2 = function (data, success, failure) {
        HTTPConnection.post(URL.GET_EWB2, data, success, failure);
    }
    this.getEwayBillReports = function (data, success, failure) {
        HTTPConnection.post(URL.GET_EWB, data, success, failure);
    }
}]);

function failureCommounFun(err) {
    swal('Error',err.data.message,'error');
}