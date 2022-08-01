materialAdmin.controller("toolMasterController",
    function($rootScope, $state, $scope, $state, $localStorage, growlService,$uibModal,clientService, toolService,spareService,ReportService) {
        $scope.inventories=[];
        $scope.selectedInventory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.atoolCategory=["new","old","scrapped"];
        var lastFilter;

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

        $scope.getAllPO = function(){
            function succ(data) {
              $scope.aPO = data.data.data;
            }
            spareService.getPOserv({all:true}, succ);
        };
        $scope.getAllPO();

        $scope.getAllPOvendor = function(){
            function succ(data) {
                $scope.aPOvendor = data.data.data;
            }
            spareService.getAllPOvendorServ({all:true}, succ);
        };
        $scope.getAllPOvendor();

        $scope.getAllSpares = function() {
            function success(data) {
                $scope.aSpare = data.data.data;
            }
            spareService.getAllSpareListAll({}, success);
        };
        $scope.getAllSpares();

        $scope.grnDown = function(){
            $rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = $scope.inventories;
            $rootScope.returnInwardData.client_full_name = $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData.address;
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tools/toolInvInwardPreview.html',
                controller: 'toolInvInwardPrevCtrl'
            });
        }

        function prepareFilterObject(isPagination){
            var allowedKey = ['spare_name','category','vendor_name','po_number','invoice_number'];
            var myFilter = {};
            for (var i = 0; i < allowedKey.length; i++) {
                if($scope[allowedKey[i]]){
                    myFilter[allowedKey[i]] = $scope[allowedKey[i]];
                }
            }
            if(isPagination && $scope.currentPage){
                myFilter.skip = $scope.currentPage;
            }
            return myFilter;
        };

        $scope.getAllTools = function(isPagination){
            $scope.inventories=[];
            $scope.selectedInventory={};

            function success(response){
                if(response.data && response.data.data && response.data.data.length>0){
                    $scope.inventories = response.data.data;
                    $scope.selectedTool = response.data.data[0];
                    setTimeout(function(){
                       listItem = $($('.selectItem')[0]);
                       listItem.addClass('grn');
                    }, 500);
                    $scope.totalPages = response.data.pages;
                    $scope.totalItems = 10*response.data.pages;
                }
            }
            function failure(response){
                console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
			if(oFilter.invoice_number){
				delete oFilter.skip;
				toolService.getAllToolMasters(oFilter, success, failure);
			}else {
				toolService.getToolMasters(oFilter,success,failure);
			}
        };
        $scope.getAllTools();


        $scope.pageChanged = function() {
            $scope.getAllTools(true);
        };

        $scope.selectTool = function(o,i){
            $scope.selectedTool = o;
            listItem = $($('.selectItem')[i]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
        }


        $scope.toolInward = function(oTrip, index) {
            /*var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tools/toolInwardPopUp.html',
                controller: 'toolInwardPopUpCtrl',
            });

            modalInstance.result.then(function(data) {
                swal("Success!", data.data.message, "success");
                $state.reload();
            }, function(data) {
                if (data != 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }
            });*/
            var rURL = "#!/maintenance_inventory/toolInward";
            $rootScope.redirect(rURL);
        }

        $scope.toolsIssue = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tools/toolsIssuePopUp.html',
                controller: 'toolsIssuePopUpCtrl',
                resolve: {
                    thatTool: function() {
                        return $scope.selectedTool;
                    }
                }
            });

            modalInstance.result.then(function() {
                $state.reload();
            }, function(data) {
                if (data != 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }
            });
        };

        $scope.returnTool = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tools/returnToolPopUp.html',
                controller: 'returnToolPopUpCtrl',
                resolve: {
                    thatTool: function() {
                        return $scope.selectedTool;
                    }
                }
            });

            modalInstance.result.then(function() {
                $state.reload();
            }, function(data) {
                if (data != 'cancel') {
                    swal("Oops!", data.data.message, "error")
                }
            });
        };
        $scope.toolHistory = function() {
            if($scope.selectedTool){
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/tools/toolHistoryPopUp.html',
                    controller: 'toolHistoryPopUpCtrl',
                    resolve: {
                        thatTool: function() {
                            return $scope.selectedTool;
                        }
                    }
                });

                modalInstance.result.then(function() {
                    $state.reload();
                }, function(data) {
                    if (data != 'cancel') {
                        swal("Oops!", data.data.message, "error")
                    }
                });
            }else{
                swal("warning","Tool not selected","warning");
            }
        }

        $scope.downloadReport = function(){
            ReportService.getToolReport(lastFilter, function(data) {
              var a = document.createElement('a');
                if(data.data.url){
                  a.href = data.data.url;
                  a.download = data.data.url;
                  a.target = '_blank';
                  a.click();
                }else{
                    swal("warning",data.data.message,"warning");
                }
            });
        }
    }
);

materialAdmin.controller("toolInwordCtrl", function($rootScope, $scope,$uibModal,$state,$localStorage,DateUtils,growlService,spareService,clientService,formValidationgrowlService,poService,inventoryService,toolService) {
    $scope.aPOData = {};
    $scope.aToolCode = [];
    $scope.totalValue = 0;
    $scope.aPOData.category = 'new';
    $scope.aPOData.spare = [];

    //*************** New Date Picker for multiple date selection in single form ************
        $scope.today = function() {
          $scope.dt = new Date();
        };
        $scope.today();
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.open = function($event, opened) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope[opened] = true;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************


    $scope.invoice_date = new Date();

    ($scope.getAllPOs = function(){
        $scope.inventories=[];
        $scope.selectedInventory={};
        function prepareQueryFilterObj(){
            var queryFilter = {type:'Tool'};
            return queryFilter;
        }
        function success(response){
            if(response.data && response.data.data.length>0){
                $scope.inventories = response.data.data;
            }
        }
        function failure(response){
            console.log(response);
        }
        spareService.getAllPOForDorpdown(prepareQueryFilterObj(),success,failure);
    })();

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

    $rootScope.reloadPage = function(){
        $state.reload();
    }

    $scope.selPOFunc = function(data){
        $scope.aPOData = data;
		if(!$scope.aPOData.rFreight) {
			$scope.aPOData.rFreight = $scope.aPOData.freight;
		}else{
			$scope.aPOData.freight = $scope.aPOData.rFreight ;
		}
        $scope.aPOData.category = 'new';
        $scope.aPOData.cummulative_price = 0;
        for (var i = 0; i < $scope.aPOData.spare.length; i++) {
            $scope.aPOData.spare[i].rate_per_piece = $scope.aPOData.spare[i].rate;
			$scope.aPOData.spare[i].quantity = $scope.aPOData.spare[i].remaining_quantity;
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.spare[i].aToolCode = [];
			$scope.aPOData.cummulative_price = $scope.aPOData.cummulative_price + $scope.aPOData.spare[i].billing_amount;
            $scope.aPOData.spare[i].selected = true;
			$scope.aPOData.spare[i].compTax = $scope.aPOData.spare[i].tax;
        }
    }

    $scope.catChange = function(){
        if($scope.aPOData.category == 'old'){
            console.log($scope.aPOData.category);
        }else{
            console.log($scope.aPOData.category);
        }
    }

    $scope.addRowInTable = function() {
        $rootScope.aPOData = $scope.aPOData;
        var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/tools/toolOldAddPop.html',
            controller: 'oldToolPop'
        });
    }

    function succInventory(response){
        if(response.data && response.data.data){
            swal("Saved!", response.data.message, "success");
            $rootScope.reloadPage();
            $rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = response.data.data;
            $rootScope.returnInwardData.client_full_name = $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData.address;
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tools/toolInvInwardPreview.html',
                controller: 'toolInvInwardPrevCtrl'
            });
        }
    }
    function failInventory(response){
        swal("Error!", "", "error");
    }

    $scope.checkBXclick = false;
    $scope.clickCheckBX = function(){
        $scope.checkBXclick = true;
    }

    $scope.addNewTool = function() {
        if($scope.aPOData){
            var formData  = angular.copy($scope.aPOData)
            console.log(formData);
            if($scope.aPOData.category == 'new'){
                var toSend = {
                    "vendor_id":formData.vendor_id,
                    "vendorId":formData.vendorId,
                    "vendor_name":formData.vendor_name,
                    "po_number":formData.ponumder,
                    "po_id":formData._id,
					"freight": formData.freight,
                    "invoice_number":formData.invoice_number,
                    "invoice_date":$scope.invoice_date,
                    "category":formData.category
                };
            }else{
                var toSend = {
                    "category":formData.category
                };
            }
            var data = [];
            for (var i = 0; i < formData.spare.length; i++) {

                if(formData.spare[i].selected == true){
                    var oData = {
                        "spare_id":formData.spare[i]._id,
                        "spare_code":formData.spare[i].code,
                        "spare_name":formData.spare[i].name,
                        "quantity":formData.spare[i].quantity,
                        "rate_per_piece":formData.spare[i].rate_per_piece,
						"rate_inc_tax":formData.spare[i].rate_inc_tax,
                        "tax":formData.spare[i].tax,
                        "billing_amount":formData.spare[i].billing_amount,
                        "codes":formData.spare[i].aToolCode
                    }
                    data.push(oData);
                }

            }
            toSend.data = data;
            toSend.to_inward = true;
            if($scope.checkBXclick == true){
                $rootScope.toolInwardFinalData = toSend;
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/tools/toolInwardFinal.html',
                    controller: 'toolInwardFinalCtrl'
                });
            }else{
                toSend.to_inward = true;
                toolService.addToolInward(toSend,succInventory,failInventory);
            }
        }
    };

	$scope.checkFreight = function () {
		if($scope.aPOData.freight > $scope.aPOData.rFreight){
			$scope.aPOData.freight = 0;
			swal("warning", "Please enter less then freight!!!", "warning");
		}
	}

    $scope.checkQty = function(d,i){
        if(d.quantity > d.remaining_quantity){
            swal("Quantity must be less then to remaining quantity!!!","","warning");
            d.quantity = d.remaining_quantity;
            d.billing_amount = d.rate_inc_tax * d.quantity;
        }
		$scope.checkBXclick = true;
    }
	$scope.checkTax = function(d,i){
		if(d.tax > d.compTax){
			swal("Tax must be less then or equal to"+ d.compTax,"","warning");
			d.tax = d.compTax;
		}
	}

	$scope.calculate = function(i){
		var rateP = $scope.aPOData.spare[i].rate;
		if($scope.aPOData.spare[i].rate_per_piece == undefined){
			$scope.aPOData.spare[i].rate_per_piece = 0;
		}
		if($scope.aPOData.category=="old" || $scope.aPOData.spare[i].rate_per_piece <= rateP) {
			if($scope.aPOData.tax){
				$scope.aPOData.spare[i].rate_inc_tax = ($scope.aPOData.spare[i].rate_per_piece + ($scope.aPOData.spare[i].rate_per_piece*(($scope.aPOData.tax||0)/100) ));
			}else{
				$scope.aPOData.spare[i].rate_inc_tax = ($scope.aPOData.spare[i].rate_per_piece + ($scope.aPOData.spare[i].rate_per_piece*(($scope.aPOData.spare[i].tax||0)/100) ));
			}
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.spare[i].billing_amount = Math.ceil($scope.aPOData.spare[i].billing_amount*100)/100;
			$scope.aPOData.spare[i].rate_inc_tax = Math.ceil($scope.aPOData.spare[i].rate_inc_tax*100)/100;
			watchFunc();
		}else {
			$scope.aPOData.spare[i].rate_per_piece = rateP;
		}
    }
    function watchFunc(){
        $scope.totalValue = 0;
        if($scope.aPOData.spare && $scope.aPOData.spare[0]){
            for (var j = 0; j < $scope.aPOData.spare.length; j++) {
                $scope.totalValue+=$scope.aPOData.spare[j].billing_amount || 0;
            }
        }
    }
    $scope.$watch('InwordForm.$valid', function(newVal, oldVal){
        watchFunc();
     });

    $scope.calcTx = function(d){
        for (var k = 0; k < $scope.aPOData.spare.length; k++) {
            $scope.aPOData.spare[k].rate_inc_tax = ($scope.aPOData.spare[k].rate_per_piece + ($scope.aPOData.spare[k].rate_per_piece*(d/100) ));
            $scope.aPOData.spare[k].billing_amount = (($scope.aPOData.spare[k].rate_inc_tax || 0) * ($scope.aPOData.spare[k].quantity || 0));
        }
    }

    $scope.addCode = function(code, i){
        //$scope.aToolCode.push(code);
       // $scope.data = {};
       if($scope.aPOData.spare[i] && $scope.aPOData.spare[i].aToolCode.length<$scope.aPOData.spare[i].quantity){
            $scope.aPOData.spare[i].aToolCode.push($scope.aPOData.spare[i].toolCode);
            $scope.aPOData.spare[i].toolCode = '';
        }else{
            swal("No. of Codes must be equal to Quantity.","","warning");
        }
    }
    $scope.removeCode = function(index){
        $scope.aPOData.spare[0].aToolCode.splice(index, 1);
    }
});


/*materialAdmin.controller("toolInwardPopUpCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage,formValidationgrowlService,spareService,maintenanceVendorService_,toolService) {
    $scope.aToolCode = [];
    $scope.aPO=[];
    $scope.aVendors = [];
    $scope.aTool=[];
    $scope.data = {};
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };


    function success(res) {
        if (res && res.data && (res.data.status == "OK")) {
            $uibModalInstance.close(res);
        } else {
            $uibModalInstance.dismiss(res);
        }
    }

    function failure(res) {
        $uibModalInstance.dismiss(res);
    }


    $scope.getAllPOs = function(){
        function prepareQueryFilterObj(){
            var queryFilter = {
                all:true,
                status:'Released'
            };
            return queryFilter;
        }
        function successPO(response){
            if(response.data && response.data.data.length>0){
                $scope.aPO = response.data.data;
            }
        }
        function failurePO(response){
            console.log(response);
        }
        spareService.getAllPOserv(prepareQueryFilterObj(),successPO,failurePO);
    };
    $scope.getAllPOs();

    $scope.getAllMaintenanceVendors = function(){
        function prepareQueryFilterObj(){
            var queryFilter = {all:true};
            return queryFilter;
        }
        function successVendor(response){
            if(response.data && response.data.length>0){
                $scope.aVendors = response.data;
                if($scope.aVendors && $scope.aVendors.length>0){
                    for(var x=0;x<$scope.aVendors.length;x++){
                        if($scope.aVendors[x]._id == $scope.tool.po_number.vendor_id){
                            $scope.tool.vendorData = $scope.aVendors[x];
                        }
                    }
                }
            }
        }
        function failureVendor(response){
            console.log(response);
        }
        maintenanceVendorService_.getMaintenanceVendors(prepareQueryFilterObj(),successVendor,failureVendor);
    };

    $scope.poSelect = function(){
        $scope.getAllMaintenanceVendors();
    }

    $scope.getAllPart = function(){
        function prepareQueryFilterObj(){
            var queryFilter = {
                all:true,
                category_name:"Tool"
            };
            return queryFilter;
        }
        function successPart(response){
            if(response.data  && response.data.data && response.data.data.length>0){
                $scope.aTool = response.data.data;
            }
        }
        function failurePart(response){
            console.log(response);
        }
        spareService.getAllSpareList(prepareQueryFilterObj(),successPart,failurePart);
    };
    $scope.getAllPart();



    $scope.addCode = function(code){
        $scope.aToolCode.push(code);
        $scope.data = {};
    }
    $scope.removeCode = function(index){
        $scope.aToolCode.splice(index, 1);
    }



    $scope.addInward = function(tool) {
        var toSend =  tool;

        toSend.po_number = tool.ponumder;

        toSend.spare_code = toSend.toolData.code;
        toSend.spare_name = toSend.toolData.name;

        toSend.vendor_name = toSend.vendorData.name;
        toSend.vendorId = toSend.vendorData.vendorId;

        toSend.codes = $scope.aToolCode;

        delete toSend.vendorData;
        delete toSend.toolData;

        toolService.addToolInward(toSend,success,failure);
    }
});*/

materialAdmin.controller("toolInwardFinalCtrl", function($rootScope, $scope,$localStorage,$uibModal, $uibModalInstance,growlService,formValidationgrowlService,clientService,inventoryService,toolService) {

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

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

    if($rootScope.toolInwardFinalData){
        $scope.invData = $rootScope.toolInwardFinalData;
    }
    $scope.inwardFinalSubmit = function(){
        if($scope.invData){

            function success(response) {
                swal("Saved!", response.data.message, "success");
                $rootScope.reloadPage();
                $uibModalInstance.dismiss('cancel');
                $rootScope.returnInwardData = {};
                $rootScope.returnInwardData.data = data.data.data;
                $rootScope.returnInwardData.client_full_name = $scope.clientData.client_full_name;
                $rootScope.returnInwardData.client_address = $scope.clientData.address;
                //$rootScope.getInvGlobal();
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/tools/toolInvInwardPreview.html',
                    controller: 'toolInvInwardPrevCtrl'
                });
            }
            function fail(response) {
                swal("Oops!", response.data.message, "error")
                $uibModalInstance.dismiss('cancel');
            }

            $scope.data = $scope.invData;
            $scope.data.to_inward = true;
            toolService.addToolInward($scope.data, success,fail);
        }
    }
    $scope.inwardFinalCancel = function(){
        if($scope.invData){

            function success(data) {
                swal("Saved!", data.data.message, "success");
                $rootScope.reloadPage();
                $uibModalInstance.dismiss('cancel');
                $rootScope.returnInwardData = {};
                $rootScope.returnInwardData.data = data.data.data;
                $rootScope.returnInwardData.client_full_name = $scope.clientData.client_full_name;
                $rootScope.returnInwardData.client_address = $scope.clientData.address;
                //$rootScope.getInvGlobal();
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/tools/toolInvInwardPreview.html',
                    controller: 'toolInvInwardPrevCtrl'
                });
            }
            function fail(data) {
                swal("Oops!", data.data.message, "error")
                $uibModalInstance.dismiss('cancel');
            }

            $scope.data = $scope.invData;
            $scope.data.to_inward = false;

            toolService.addToolInward($scope.data, success,fail);
        }
    }

});

materialAdmin.controller("toolInvInwardPrevCtrl", function($rootScope, $scope, $uibModalInstance,billsService) {

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    //console.log($rootScope.prData);

    $scope.localInwardData = $rootScope.returnInwardData;

	if($scope.localInwardData && $scope.localInwardData.data && $scope.localInwardData.data.length>0){
		var tAmt = 0;
		for(var t=0;t<$scope.localInwardData.data.length;t++){
			tAmt = tAmt + $scope.localInwardData.data[t].rate_inc_tax;
		}
		$scope.localInwardData.totalAmt = tAmt;
		$scope.localInwardData.fTotalAmt = tAmt + $scope.localInwardData.data[0].freight;
	}

    $scope.downloadInward = function(data) {
        if(data){
            billsService.getToolInvInwardPdf(data, function(data) {
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            });
        }
    };
    $scope.downloadInward($scope.localInwardData);
});

materialAdmin.controller("oldToolPop", function($rootScope, $scope, $uibModalInstance,jobCardServices,growlService,formValidationgrowlService,spareService,inventoryService) {

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    function prepareFilterObject(isPagination){
        var myFilter = {};
        if($scope.part_name){
          myFilter.name = $scope.part_name;
        }
        if(isPagination && $scope.currentPage){
         myFilter.skip = $scope.currentPage;
        }
        return myFilter;
    }


    $scope.getAllSpares = function(isPagination){
        function success(data) {
          $scope.aSpareRoot = data.data.data;
          for(var j=0;j<$scope.aSpareRoot.length;j++){
            if($scope.aSpareRoot[j].code && $scope.aSpareRoot[j].name){
                $scope.aSpareRoot[j].spare_name_code = $scope.aSpareRoot[j].name + '/ '+ $scope.aSpareRoot[j].code;
            }
          }
        }
        var oFilter = prepareFilterObject(isPagination);
        spareService.getAllSpareListTrue(oFilter, success);
    };
    $scope.getAllSpares();

    $scope.addToolData = function(){

        if($scope.qty > 0){
            $scope.localData = {};
            $scope.localData.code = $scope.spare_name_code.code;
            $scope.localData.name = $scope.spare_name_code.name;
            $scope.localData.quantity =  $scope.qty;
            $scope.localData.selected =  true;
            $scope.localData.aToolCode =  [];

            $rootScope.aPOData.spare.push($scope.localData);
            $scope.closeModal();

        }else{
            swal("Please enter quantity","","warning");
        }
    }

});

materialAdmin.controller("toolsIssuePopUpCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage,thatTool,formValidationgrowlService,spareService,Driver,maintenanceVendorService_,toolService,Vehicle,contractorService) {
    $scope.aToolCode = [];
    $scope.aPO=[];
    $scope.aVendors = [];
    $scope.aTool=[];
    $scope.data = {};

    $scope.tool = angular.copy(thatTool);
    console.log($scope.tool);
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.aIssueCat = ["driver","mechanic","contractor","other"]

    $scope.getUserByCat = function(d){
        function successUser(response){
            if(response.data && response.data.data.length>0){
                $scope.aUsers = response.data.data;
            }
        }
        function failureUser(response){
            console.log(response);
        }
        if(d == 'driver'){
			$scope.tool.issuer = '';
			$scope.tool.issuer_name = '';
			function successD(response){
				if(response.data && response.data.length>0){
					$scope.aDrivers = response.data;
				}
			}

			Driver.getAllDriversForDropdown({all:true}, successD);
		}else if (d == 'mechanic') {
			$scope.tool.issuer = '';
			$scope.tool.issuer_name = '';
			toolService.getAllUser({}, successUser, failureUser);
		}else if (d == 'contractor') {
			$scope.tool.issuer = '';
			$scope.tool.issuer_name = '';
			function successC(response){
				if(response.data && response.data.length>0){
					$scope.aContractor = response.data;
				}
			}
			contractorService.getContractorServ({}, successC, failureUser);
		}else if (d == 'other') {
			$scope.tool.issuer = '';
			$scope.tool.issuer_name = '';
		}
    }

    $scope.getRegVeh = function(){
        function successVeh(response){
            if(response.data && response.data.data.length>0){
                $scope.aVeh = response.data.data;
            }
        }
        function failureVeh(response){
            console.log(response);
        }
        Vehicle.getAllregList({},successVeh,failureVeh);
    }
    $scope.getRegVeh();

    $scope.addCode = function(code){
        $scope.aToolCode.push(code);
        $scope.data = {};
    }
    $scope.removeCode = function(index){
        $scope.aToolCode.splice(index, 1);
    }

    $scope.issueTool = function(tool) {
		function success(res) {
			if (res && res.data && (res.data.status == "OK")) {
				$uibModalInstance.close(res);
				swal("Success", res.data.message, "success")
			} else {
				$uibModalInstance.dismiss(res);
			}
		}

		function failure(res) {
			$uibModalInstance.dismiss(res);
		}


        var toSend =  tool;
        if(toSend.status){

                toSend.issue_to_employee_code = toSend.issuer.employee_code || toSend.issuer.userId || toSend.issuer.company || 'other';
                toSend.issue_to_employee_name = toSend.issuer.full_name || toSend.issuer.name || toSend.issuer_name;
                if(toSend.vehicle_num_obj && toSend.vehicle_num_obj.vehicle_reg_no){
                    toSend.vehicle_number = toSend.vehicle_num_obj.vehicle_reg_no;
                }
                toSend.tool_code = toSend.spare_code;
                toSend.issue_status = toSend.category;

                toSend.codes = $scope.aToolCode;

                delete toSend.issuer;
                delete toSend.vehicle_num_obj;
                if(toSend.issuer_type == 'driver' && !toSend.vehicle_number ){
                    swal("Enter vehicle no.", "", "warning");
                }
                else{
                    toolService.issueTool(toSend,success,failure);
                }

        }else{
            swal("Status not available", "", "warning");
        }
    }



});
materialAdmin.controller("returnToolPopUpCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage,thatTool,formValidationgrowlService,Driver,spareService,maintenanceVendorService_,toolService,contractorService) {
    $scope.aToolCode = [];
    $scope.aPO=[];
    $scope.aVendors = [];
    $scope.aTool=[];
    $scope.data = {};

    $scope.aIssueCat = ["driver","mechanic","contractor","other"];


    $scope.tool = angular.copy(thatTool);
    console.log($scope.tool);

    if($scope.tool.category == 'old'){
        $scope.aReturnStatus = ['old','scrapped'];
    }else{
        $scope.aReturnStatus = ['old','new','scrapped'];
    }

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getIssueById = function(){
        function successUser(response){
            if(response.data  && response.data.data && response.data.data.length>0){
                $scope.aIssue = response.data.data;
                $scope.tool.issue_status = $scope.aIssue[0].issue_status;
                $scope.tool.issuer_type = $scope.aIssue[0].issuer_type;
                $scope.tool.issuer = $scope.aIssue[0].issue_to_employee_name;
                $scope.tool.vehicle_number = $scope.aIssue[0].vehicle_number;
                $scope.tool.post_id = $scope.aIssue[0]._id;
            }
        }
        function failureUser(response){
            console.log(response);
        }
        toolService.getIssuedTool({toolId:$scope.tool.toolId,issued:true},successUser,failureUser);
    }
    $scope.getIssueById();

    $scope.getUserByCat = function(d){
        function successUser(response){
            if(response.data && response.data.data.length>0){
                $scope.aUsers = response.data.data;
            }
        }
        function failureUser(response){
            console.log(response);
        }
		if(d == 'driver'){
			$scope.tool.returnBy = '';
			$scope.tool.returnBy_name = '';
			function successD(response){
				if(response.data && response.data.length>0){
					$scope.aDrivers = response.data;
				}
			}

			Driver.getAllDriversForDropdown({all:true}, successD);
		}else if (d == 'mechanic') {
			$scope.tool.returnBy = '';
			$scope.tool.returnBy_name = '';
			toolService.getAllUser({}, successUser, failureUser);
		}else if (d == 'contractor') {
			$scope.tool.returnBy = '';
			$scope.tool.returnBy_name = '';
			function successC(response){
				if(response.data && response.data.length>0){
					$scope.aContractor = response.data;
				}
			}
			contractorService.getContractorServ({}, successC, failureUser);
		}else if (d == 'other') {
			$scope.tool.returnBy = '';
			$scope.tool.returnBy_name = '';
		}
    }
    //$scope.getUserByCat();

    function success(res) {
        if (res && res.data && (res.data.status == "OK")) {
            $uibModalInstance.close(res);
			swal("Success", res.data.message, "success");
        } else {
            $uibModalInstance.dismiss(res);
        }
    }

    function failure(res) {
        $uibModalInstance.dismiss(res);
    }

    $scope.returnTool = function(tool) {
        var toSend =  tool;

        toSend.return_by_employee_code = toSend.returnBy.employee_code || toSend.returnBy.userId || toSend.returnBy.company || 'other'; //toSend.returnBy.clientId;
        toSend.return_by_employee_name = toSend.returnBy.full_name || toSend.returnBy.name || toSend.returnBy_name;
        toSend.tool_code = toSend.spare_code;

        delete toSend.returnBy;

        toolService.returnToolService(toSend,success,failure);
    }
});


materialAdmin.controller("toolHistoryPopUpCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage,$state,thatTool,toolService) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    if(thatTool){
        $scope.history = angular.copy(thatTool);
    }else{
        $uibModalInstance.dismiss('cancel');
    }

    (function(){
        function successPart(response){
            if(response.data  && response.data.data && response.data.data.length>0){
                $scope.aIssue = response.data.data;
            }
        }
        function failurePart(response){
            console.log(response);
        }
        toolService.getIssuedTool({tool_id:$scope.history._id},successPart,failurePart)
    })();
});
