materialAdmin.controller("dieselCtrl", function($rootScope, $scope,$uibModalInstance, $timeout,$localStorage,URL, thatTrip, billsService, clientService, broadcastService) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    var edit = false;
    var data = angular.copy(thatTrip);;
    $scope.data = data;
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

    $scope.fillData = function(slip) {
        for (var key in slip) {
            $scope[key] = slip[key];
        }
    };

    $scope.fillData(data[0]);

    $scope.show_selector = false;
    if (data.length > 1) $scope.show_selector = true;

    $scope.onSlipSelect = function(slip) {
        $scope.fillData(slip);
    };

    $timeout( function(){
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
                    break;
                case false:
                    for (var i = 0; i < editables.length; i++)
                        editables[i].setAttribute("contentEditable", false);
                    break;
            }
        };
    }, 500 );



    $scope.pdf = function() {
        billsService.getDieselPdf(JSON.stringify(data), function(data) {
            console.log(data.data.url);
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    };

});
