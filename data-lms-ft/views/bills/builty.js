var builty_materials_headers = ['sl_no', 'container_no', 'boe_no', 'value', 'material_name', 'weight', 'rate', 'freight'];
var builty_trips_headers = ['vehicle_no', 'gr_no', 'trip_no', 'tin'];

materialAdmin.controller("builtyCtrl", function($rootScope,$localStorage, $scope, URL, $uibModalInstance, billsService,$timeout, clientService,thatTrip, broadcastService) {


    //$scope.edit_button = 'Edit';
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    var edit = false;
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
        var t1 = document.getElementById("t1");
        for (var i = 0; i < data.materials.length; i++) {
            var row = t1.insertRow(i + 1);
            for (var j = 0; j < builty_materials_headers.length; j++) {
                row.insertCell(j);
                var value;
                if((($localStorage.ft_data.userLoggedIn.clientId=="100002")||($localStorage.ft_data.userLoggedIn.clientId=="100003")) && (builty_materials_headers[j]=="rate")){
                    value = "Fixed";
                }else if((($localStorage.ft_data.userLoggedIn.clientId=="100002")||($localStorage.ft_data.userLoggedIn.clientId=="100003")) && (builty_materials_headers[j]=="freight")){
                    value = 0;
                }else if((($localStorage.ft_data.userLoggedIn.clientId=="100002")||($localStorage.ft_data.userLoggedIn.clientId=="100003")) && (builty_materials_headers[j]=="weight")){
                    value = "As per BOE attached";
                }else if((($localStorage.ft_data.userLoggedIn.clientId=="100002")||($localStorage.ft_data.userLoggedIn.clientId=="100003")) && (builty_materials_headers[j]=="value")){
                    value = "As per BOE attached";
                }else{
                    value = data.materials[i][builty_materials_headers[j]];
                }

                row.cells[j].innerHTML = value !== undefined ? value : '';
                row.cells[j].className += 'data ctd calign';
            }
        }

        var t2 = document.getElementById("t2");
        for (var i = 0; i < data.trips.length; i++) {
            var row = t2.insertRow(i + 1);
            for (var j = 0; j < builty_trips_headers.length; j++) {
                row.insertCell(j);
                var value = data.trips[i][builty_trips_headers[j]];
                row.cells[j].innerHTML = value !== undefined ? value : '';
                row.cells[j].className += 'data ctd calign';
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
        billsService.getBuiltyPdf(JSON.stringify(data), function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    };

});
