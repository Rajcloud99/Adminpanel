var data = {
    client_full_name: 'Futuretrucks',
	addr1: 'aaaaaaaa',
	addr2: 'bbbbbbbbb',
	addr3: 'ccccccccc',

    supplier_code: 15573,
    supplier_name: 'xyz',
    supplier_site: 'pqr',
    supplier_address: 'qweqwqw jkbhbhbkjh jhbjhbjhbl hbjhbjkhbjh',


    po_no: '102155',
    rev_no: '0',
    op_date: new Date().toDateString(),
    po_type: 'Standard Purchase Order',



    ship_to_location: 'asasasas dddfsdfsdfsdf sdsdfsdfsdffs sdfsdfsdf sdfsdfsdf sdfsdfsdf',
    bill_to_location: 'qweqweqwe qewqweqweqw qweqweqweqeq qweqweqwe qweqweqw qweqweq qeqwq',


    subject: 'aaaas asdadasdasd asdasdasd asdasda adasd',





	data: []

};


materialAdmin.controller("purchaseOrderCtrl", function($scope, $localStorage, clientService, data) {
    function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData.client_address;
        $scope.clientData.logo_url = URL.file_server + "users/"+ $scope.clientData.clientId +"/logo.jpg";
        $scope.clientData.address = (client_address.line1?client_address.line1:"")+" "+(client_address && client_address.line2?client_address.line2:"")+" "+
                (client_address && client_address.district?client_address.district:"")+" "+(client_address && client_address.city?client_address.city:"")+" "+(client_address && client_address.state?client_address.state:"")+" "+
                (client_address && client_address.country?client_address.country:"");
    }
    (function(){
        if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.clientId){
            clientService.getClientByID({clientId:$localStorage.ft_data.userLoggedIn.clientId},succClient)
        }
    })()
    var headers = ['sr_no', 'code', 'name', 'brand','prnumber', 'uom', 'quantity', 'rate', 'price', 'tax', 'rate_inc_tax'];
    console.log('po data', JSON.stringify(data));
    data.created_at = new Date(data.created_at).toDateString();
    data.currency = 'INR';
    for (var key in data) {
        $scope[key] = data[key];
    }

    setTimeout(function() {
		let total = 0;
        var t1 = document.getElementById("t1");
        for (var i = 0; i < data.spare.length; i++) {
            var row = t1.insertRow(i + 1);
            for (var j = 0; j < headers.length; j++) {
                row.insertCell(j);

                var value = data.spare[i][headers[j]];

                switch(j) {
                    case 0:
                    value = i+1;
                    break;
					case 8:
                    value = data.spare[i][headers[7]] * data.spare[i][headers[6]];
					break;
					case 10:
                    value = data.spare[i][headers[10]] * data.spare[i][headers[6]];
                    break;
                }
                row.cells[j].innerHTML = value !== undefined ? value : '';
                row.cells[j].className += 'data ctd calign';
            }
        }

        var row = [];
		row[0] = t1.insertRow(t1.rows.length);
		row[1] = t1.insertRow(t1.rows.length);
		row[2] = t1.insertRow(t1.rows.length);
		for (var j = 0; j < headers.length; j++) {
			row[0].insertCell(j);
			row[1].insertCell(j);
			row[2].insertCell(j);
			switch(j) {
				case 9:
				row[0].cells[j].innerHTML = 'Sub Total';
				row[0].cells[j].className += 'data ctd calign bold';
				row[1].cells[j].innerHTML = 'Freight';
				row[1].cells[j].className += 'data ctd calign bold';
				row[2].cells[j].innerHTML = 'Total';
				row[2].cells[j].className += 'data ctd calign bold';
				break;
				case 10:
				row[0].cells[j].innerHTML = data.total !== undefined ? data.total : '';
				row[0].cells[j].className += 'data ctd calign';
				row[1].cells[j].innerHTML = data.freight !== undefined ? data.freight : '';
				row[1].cells[j].className += 'data ctd calign';
				row[2].cells[j].innerHTML = (parseInt(data.total) + parseInt(data.freight)) !== undefined ? (parseInt(data.total) + parseInt(data.freight)) : '';
				row[2].cells[j].className += 'data ctd calign';
				break;
				default:
				row[0].cells[j].innerHTML = '';
				row[0].cells[j].className += 'invis';
				row[1].cells[j].innerHTML = '';
				row[1].cells[j].className += 'invis';
				row[2].cells[j].innerHTML = '';
				row[2].cells[j].className += 'invis';
			}
		}

		// var row = t1.insertRow(t1.rows.length);
		// for (var j = 0; j < headers.length; j++) {
		// 	row.insertCell(j);
		// 	switch(j) {
		// 		case 12:
		// 		row.cells[j].innerHTML = 'Grand Total';
		// 		row.cells[j].className += 'data ctd calign bold';
		// 		break;
		// 		case 13:
		// 		row.cells[j].innerHTML = data.rate_inc_tax !== undefined ? data.rate_inc_tax : '';
		// 		row.cells[j].className += 'data ctd calign';
		// 		break;
		// 		default:
		// 		row.cells[j].innerHTML = '';
		// 		row.cells[j].className += 'invis';
		// 	}
		// }

    }, 500);
});
