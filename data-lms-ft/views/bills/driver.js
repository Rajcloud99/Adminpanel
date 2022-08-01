var materials_headers = ['nature', 'reference', 'place', 'quantity', 'rate_per_litre', 'amount'];

materialAdmin.controller("driverCtrl", function($rootScope, $scope, $localStorage, $timeout, $uibModalInstance, thatTrip, URL, clientService, billsService, broadcastService) {
    //$scope.edit_button = 'Edit';
    var edit = false;
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    var data = angular.copy(thatTrip);
    for (var key in data) {
        $scope[key] = data[key];
    }

    function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData.client_address;
        $scope.clientData.logo_url = URL.file_server+ "users/"+$scope.clientData.clientId +"/logo.jpg";
        $scope.clientData.address = (client_address.line1?client_address.line1:"")+" "+(client_address && client_address.line2?client_address.line2:"")+" "+
                (client_address && client_address.district?client_address.district:"")+" "+(client_address && client_address.city?client_address.city:"")+" "+(client_address && client_address.state?client_address.state:"")+" "+
                (client_address && client_address.country?client_address.country:"");
    }
    (function(){
        if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.clientId){
            clientService.getClientByID({clientId:$localStorage.ft_data.userLoggedIn.clientId},succClient)
        }
    })()

    $timeout(function(){
        var t1 = document.getElementById("materials");
        var t2 = document.getElementById("t2");


        for (var i = 0; i < data.materials.length; i++) {
            var row = t1.insertRow(i + 1);
            for (var j = 0; j < materials_headers.length; j++) {
                row.insertCell(j);
                var value = data.materials[i][materials_headers[j]];
                row.cells[j].innerHTML = value ? value : '';
                row.cells[j].className += 'data ctd';
            }
        }


        var editables = document.getElementsByClassName("editable");

        $scope.edit = function() {
            edit = !edit;
            if (edit) {
                $scope.edit_button = 'Save';
            } else {
                $scope.edit_button = 'Edit';
            }

            switch (edit) {
                case true:
                    for (var i = 0; i < editables.length; i++)
                        editables[i].setAttribute("contentEditable", true);
                    for (var i = 1; i < t1.rows.length; i++) {
                        for (var j = 0; j < t1.rows[i].cells.length; j++) {
                            t1.rows[i].cells[j].setAttribute("contentEditable", true);
                        }
                    }
                    for (var i = 1; i < t2.rows.length; i++) {
                        for (var j = 0; j < t2.rows[i].cells.length; j++) {
                            t2.rows[i].cells[j].setAttribute("contentEditable", true);
                        }
                    }
                    break;
                case false:
                    for (var i = 0; i < editables.length; i++)
                        editables[i].setAttribute("contentEditable", false);
                    for (var i = 1; i < t1.rows.length; i++) {
                        for (var j = 0; j < t1.rows[i].cells.length; j++) {
                            t1.rows[i].cells[j].setAttribute("contentEditable", false);
                        }
                    }
                    for (var i = 1; i < t2.rows.length; i++) {
                        for (var j = 0; j < t2.rows[i].cells.length; j++) {
                            t2.rows[i].cells[j].setAttribute("contentEditable", false);
                        }
                    }
                    break;
            }
        };
    }, 500);

    $scope.pdf = function() {
        billsService.getDriverPdf(JSON.stringify(data), function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    };
});
