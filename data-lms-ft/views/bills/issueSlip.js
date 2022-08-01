var app = angular.module("app", []);

var pairs = window.location.search.slice(1).split('&');

var result = {};
pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
});

// var data = JSON.parse(result.data);

var data = {
    client_full_name: 'Futuretrucks',
	slip_no: 12345,
    job_card_no: 234,
    vehicle_no: 'qwerty123',
    mechanic_name: 'abc',
    supervisor_name: 'zxc',
    datetime: new Date().toDateString(),
    job_card_type: 'type',
    branch_name: 'Branch',
    issued_by: 'feroz',
    verified_by: 'aaaaaaaa',
    received_by: 'ccccccc',
    reprinted_by: 'ddddddddddddddeeeeee',



	data: []

}


var headers = ['sl_no', 'spare_code', 'spare_name', 'category', 'uom', 'quantity_issued', 'rate', 'total', 'remarks'];

app.controller("issueSlipCtrl", function($scope) {
    for (var key in data) {
        $scope[key] = data[key];
    }
	console.log($scope.client_full_name);

    var t1 = document.getElementById("t1");
    for (var i = 0; i < data.data.length; i++) {
        var row = t1.insertRow(i + 1);
        for (var j = 0; j < headers.length; j++) {
            row.insertCell(j);
            var value = data.data[i][headers[j]];
            row.cells[j].innerHTML = value !== undefined ? value : '';
            row.cells[j].className += 'data ctd calign';
        }
    }

 
});
