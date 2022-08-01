materialAdmin.controller("inventoryController",
    function($rootScope, $state, $scope, $timeout,DateUtils, $localStorage, growlService,$uibModal, inventoryService,spareService,ReportService,clientService,maintenanceVendorService_) {
        $scope.inventories=[];
        $scope.selectedInventory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        var lastFilter;

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

        /*$scope.getAllPOvendor = function(){
            function succ(data) {
                $scope.aPOvendor = data.data.data;
            }
            spareService.getAllPOvendorServ({all:true}, succ);
        };
        $scope.getAllPOvendor();*/
		$scope.clearSearch = function(val) {
			switch (val) {
				case "spare":
					delete $scope.spare_name;
					$scope.getAllInventories(false, true);
					break;
				case "vendor":
					delete $scope.vendor_name;
					$scope.getAllInventories(false, true);
					break;
				default:
					break;
			}
		}

		$scope.getSname = function(viewValue) {
			if (viewValue && viewValue.toString().length > 2) {
				function oSucC(response) {
					$scope.aSpare = response.data.data;
				};

				function oFailC(response) {
					console.log(response);
				}
				var xyz = {};
				xyz.find = viewValue;
				spareService.getAllSpareList(xyz, oSucC, oFailC);
			} else if (viewValue == '') {
				$scope.currentPage = 1;
				$scope.getAllInventories(false, true);
			};
		};
		$scope.getVendorName = function(viewValue) {
			if (viewValue && viewValue.toString().length > 2) {
				function oSucC(response) {
					$scope.aPOvendor = response.data;
				};

				function oFailC(response) {
					console.log(response);
				}
				var xyz = {};
				xyz.find = viewValue;
				maintenanceVendorService_.getMaintenanceVendors(xyz, oSucC, oFailC);
			} else if (viewValue == '') {
				$scope.currentPage = 1;
				$scope.getAllInventories(false, true);
			};
		};

		$scope.onSelect = function($item, $model, $label) {
			$scope.currentPage = 1;
			$scope.getAllInventories(false, true);
		};

        /*$scope.getAllSpares = function() {
            function success(data) {
                $scope.aSpare = data.data.data;
            }
            spareService.getAllSpareListAll({}, success);
        };
        $scope.getAllSpares();*/

        $scope.grnDown = function(){
            $rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = $scope.inventories;

            $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/spareMaster/invInwardPreview.html',
                controller: 'invImwardPrevCtrl'
            });
        }

        function prepareFilterObject(isPagination, change, reset){
            var allowedKey = ['spare_name','vendor_name','po_number','invoice_number','start_date','end_date'];
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
        $scope.getAllInventories = function(isPagination, change, reset){
            $scope.inventories=[];
            $scope.selectedInventory={};

            function success(response){
                if(response.data && response.data.length>0){
                    $scope.inventories = response.data;
                    $rootScope.globalHomId33 = response.data[0].homId;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectInventoryAtIndex(0);
                }
            }
            function failure(response){
                //console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
            inventoryService.getInventories(oFilter,success,failure);
        };
        $scope.getAllInventories(false, true);

        $scope.selectInventoryAtIndex = function (index) {
            $scope.selectedInventory = $scope.inventories[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllInventories(true);
        };

        $scope.spareIssue = function() {
            var iURL = "#!/maintenance_inventory/spareIssue";
            $rootScope.redirect(iURL);
        };
        $scope.returnSpare = function() {
            var rURL = "#!/maintenance_inventory/returnSpare";
            $rootScope.redirect(rURL);
        };
        $scope.getPr = function() {
            var rURL = "#!/mrp_pr_po/showPR";
            $rootScope.redirect(rURL);
        };
        $scope.getInwords = function(){
            var rURL = "#!/maintenance_inventory/inventoryInword";
            $rootScope.redirect(rURL);
        };
        /*$scope.getPr = function() {
            function success(data) {
                $rootScope.aPR = data.data.data;
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/spareMaster/addPRpop.html',
                    controller: 'addPrCtrl'
                });
            }
            inventoryService.getPrServ({}, success);
        };*/

        $scope.downloadReport = function(){
            ReportService.getInventoryReport(lastFilter, function(data) {
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
    });


materialAdmin.controller("aggreInventoryController",
    function($rootScope, $state, $scope, $timeout, $localStorage, growlService,$uibModal, inventoryService,spareService,ReportService) {
        $scope.inventories=[];
        $scope.selectedInventory={};
        $scope.indexSelectedFromList=0;
        $scope.currentPage = 1;
        $scope.maxSize = 7;
        $scope.itemsPerPage = 10;
        $scope.searchValue ="";
        $scope.totalPages = 0;
        $scope.totalItems = 0;
        $scope.currentMode = "view";
        var lastFilter;

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

        function prepareFilterObject(isPagination){
            var allowedKey = ['spare_name','vendor_name','po_number','invoice_number'];
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
        $scope.getAllAggreInventories = function(isPagination){
            $scope.inventories=[];
            $scope.selectedInventory={};

            function success(response){
                if(response.data && response.data.length>0){
                    $scope.inventories = response.data;
                    $scope.totalPages = response.pages;
                    $scope.totalItems = 10*response.pages;
                    $scope.selectInventoryAtIndex(0);
                }
            }
            function failure(response){
                //console.log(response);
            }
            var oFilter = prepareFilterObject(isPagination);
            lastFilter = oFilter;
            inventoryService.getAggreInventories(oFilter,success,failure);
        };
        $scope.getAllAggreInventories();

        $scope.selectInventoryAtIndex = function (index) {
            $scope.selectedInventory = $scope.inventories[index];
            $scope.indexSelectedFromList=index;
            $scope.currentMode = "view";
            setTimeout(function(){
                var listItem = $($('.lv-item')[index]);
                listItem.siblings().removeClass('grn');
                listItem.addClass('grn');
            }, 0);
        };

        $scope.pageChanged = function() {
            $scope.getAllInventories(true);
        };

        $scope.downloadReport = function(){
            ReportService.getAggreInventoryReport(lastFilter, function(data) {
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
    });



materialAdmin.controller("spareIssueCtrl", function($rootScope, $scope,$modal,$state,$uibModal,userService,branchService,DateUtils,growlService,formValidationgrowlService,jobCardServices,spareService,mechanicService,contractorService, billsService) {
    $rootScope.aAddedTask = [];

    $scope.aIssueType = ["Mechanic","Branch","Contractor","Other"];

    ($scope.getAllBranches = function(reset){
        $scope.branches=[];
        function prepareQueryFilterObj(){
            var queryFilter = {};
            queryFilter.all = true;
            return queryFilter;
        }
        function success(response){
            //console.log(data);
            if(response.data && response.data.length>0){
                $scope.branches = response.data;
            }
        }
        function failure(response){
            //console.log(response);
        }
        branchService.getAllBranches(prepareQueryFilterObj(),success,failure);
    })();

    $scope.getUser = function(){
      function getsucc(response){
        $scope.aUser = response.data;
      }
      function getfail(response){
        //console.log(response);
      }
      userService.getUsers({all:true},getsucc, getfail)
    }
    $scope.getUser();

    function prepareFilterObject(){
        var myFilter = {};
        if($scope.status){
          myFilter.status = $scope.status;
        }
        if($scope.vehicle_number){
          myFilter.vehicle_number = $scope.vehicle_number;
        }
        //myFilter.status = "Open";

        return myFilter;
    }
    $scope.getAllJobCard = function(){
        function success(data) {
            $scope.aJobCardsOpen = [];
            $scope.aJobCardsClosed = [];
            if(data.data && data.data.data && data.data.data.length>0){
                $scope.aJobCardsForSpareIssue = data.data.data;
                for(var j=0;j<$scope.aJobCardsForSpareIssue.length;j++){
                    $scope.aJobCardsForSpareIssue[j].newShowField = $scope.aJobCardsForSpareIssue[j].jobId +' - '+ $scope.aJobCardsForSpareIssue[j].vehicle_number;
                    /*if($scope.aJobCardsForSpareIssue[j].status == 'Open'){
                        $scope.aJobCardsForSpareIssue[j].newShowField = $scope.aJobCardsForSpareIssue[j].jobId +' - '+ $scope.aJobCardsForSpareIssue[j].vehicle_number;
                        $scope.aJobCardsOpen.push($scope.aJobCardsForSpareIssue[j]);
                    }else{
                        $scope.aJobCardsClosed.push($scope.aJobCardsForSpareIssue[j]);
                    }*/
                }
            }
        }
        function failure(res){
          //console.log("fail: ",res);
          swal("Some error with GET Job Card.","","error");
        }
        var oFilter = prepareFilterObject();
        jobCardServices.getAllJobCardsFull(oFilter,success,failure);
    };
    $scope.getAllJobCard();

    $scope.selSerachQuery = function(){
        function successPost(response){
        if(response && response.data){
            //console.log(response);
            $scope.aTasks = response.data.data;

          }
        }
        function failure(res){
          //console.log("fail: ",res);
          swal("Some error with JobCard creation","","error");
        }
        $scope.objIssue = {};
        $scope.objIssue.jobId = $scope.selJobIdVehicle.jobId;
        $scope.gJobId = $scope.selJobIdVehicle.jobId;
        $rootScope.globalJobId = $scope.selJobIdVehicle.jobId;
        $rootScope.globalHomId = $scope.selJobIdVehicle.homId;
        spareService.getEstimatedSpare($scope.objIssue, successPost,failure);
    };

    $scope.getAllMechanics = function(){
        function success(data) {
          //$scope.aSuperviser = [];
          $scope.aMechanic = data.data;
          /*if(data.data.length>0){
            for(var s=0;s<data.data.length;s++){
              if(data.data[s].employee_type == 'Mechanic'){
                $scope.aMechanic.push(data.data[s]);
              }else if(data.data[s].employee_type == 'Supervisor'){
                $scope.aSuperviser.push(data.data[s]);
              }
            }
          }*/
        }
        mechanicService.getMechanicsByUser({}, success);
    };
    $scope.getAllMechanics();

    ($scope.getAllContractor = function(){
        $scope.contractors=[];
        $scope.selectedContractor={};
        $scope.indexSelectedFromList=0;
        //Used for Searching
        function prepareQueryFilterObj(){
            var queryFilter = {};

            return queryFilter;
        }
        function success(response){
            //console.log(data);
            if(response.data && response.data.length>0){
                $scope.contractors = response.data;
            }
        }
        function failure(response){
            //console.log(response);
        }
        contractorService.getContractorServ(prepareQueryFilterObj(),success,failure);
    })();

    $scope.isDisabled = false;
    $scope.issue = function(data ,index){
        data.issue_quantity = 0;
        data.flag = 'issued';
        $rootScope.aAddedTask.push(data);

    };

    $scope.addMore = function(){
        $rootScope.typeSel = null;
        if($scope.issue_type =='Mechanic' || $scope.issue_type =='Contractor'){
            if($scope.selJobIdVehicle && $scope.selJobIdVehicle.jobId){
                $rootScope.typeSel = $scope.selJobIdVehicle.jobId;
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/spareMaster/AddMoreIssue.html',
                    controller: 'addMoreIssueCtrl'
                });
            }else{
                swal("Please select jobid first !!!!!","","warning");
            }
        }else{
            if($scope.selJobIdVehicle && $scope.selJobIdVehicle.jobId){
                $rootScope.typeSel = $scope.selJobIdVehicle.jobId;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/spareMaster/AddMoreIssue.html',
                controller: 'addMoreIssueCtrl'
            });
        }
        /*if($scope.selJobIdVehicle && $scope.selJobIdVehicle.jobId){
            $rootScope.typeSel = $scope.selJobIdVehicle.jobId;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/spareMaster/AddMoreIssue.html',
            controller: 'addMoreIssueCtrl'
        });*/
    };

    $scope.removeThis = function(dt,i){
        $rootScope.aAddedTask.splice(i,1);
    }

    $scope.changeType = function(){
        /*$rootScope.globalJobId = null;
        $scope.issuer = null;
        $scope.branch = null;*/
    }

    $scope.postIssueFinal = function(){
        function succ(data) {
          $scope.resDataIssue = data.data;
          var msggg = data.data.message;
          swal(msggg,"","success");
          // $scope.downloadSlip(data.data.data);
          $state.reload();
        }

        function fail(data) {

          var msggg = data.data.message || data.data.error_message;
          swal(msggg,"","warning");

        }

        $scope.downloadSlip = function(slip, index) {
            billsService.getIssueSlipPdf(JSON.stringify(slip), function(data) {
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            });
        };

        if($scope.mech || $scope.contr){
            $scope.postIssue = {};
            $scope.postIssue.jobId = $scope.gJobId;
            if($scope.selJobIdVehicle && $scope.selJobIdVehicle.vehicle_number){
                $scope.postIssue.vehicle_number = $scope.selJobIdVehicle.vehicle_number;
				$scope.postIssue.branchName = $scope.selJobIdVehicle.branchName;
				$scope.postIssue.branchId = $scope.selJobIdVehicle.branchId;
                $scope.postIssue.job_type = $scope.selJobIdVehicle.job_type;
            }
            //$scope.postIssue.jobId = $rootScope.globalJobId;
            $scope.postIssue.homId = $rootScope.globalHomId;
            $scope.postIssue.issue_type = $scope.issue_type;
            if($scope.issue_type == 'Mechanic'){
                $scope.postIssue.mechanic_name = $scope.mech.full_name;
                $scope.postIssue.mechanic_employee_code = $scope.mech.userId;
                $scope.postIssue.issuer = 'Mechanic';
            }else if($scope.issue_type == 'Contractor'){
                $scope.postIssue.mechanic_name = $scope.contr.name;
                $scope.postIssue.mechanic_employee_code = $scope.contr._id;
                $scope.postIssue.issuer = $scope.contr.company;
            }else if($scope.issue_type == 'Branch'){
                $scope.postIssue.mechanic_name = $scope.mech.full_name;
                $scope.postIssue.mechanic_employee_code = $scope.mech.userId;
                $scope.postIssue.issuer = $scope.branch;
            }else if($scope.issue_type == 'Other'){
                $scope.postIssue.mechanic_name = $scope.mech.full_name;
                $scope.postIssue.mechanic_employee_code = $scope.mech.userId;
                $scope.postIssue.issuer = $scope.issuer;
            }
            $scope.postIssue.flag = 'issued';
            $scope.postIssue.spare_list = [];
            $scope.postIssue.spare_list = $rootScope.aAddedTask;
            spareService.postAllIssueServ($scope.postIssue, succ,fail);
        }else{
            swal('Please select mechanic or contractor',"","warning");
        }
    }

});

materialAdmin.controller("addMoreIssueCtrl", function($rootScope, $scope, $uibModalInstance,jobCardServices,growlService,formValidationgrowlService,spareService) {

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
    $scope.getTaskForJobCard = function(){
        function succ(data) {
          $scope.aTaskByJobId = data.data.data;
        }
        $scope.selTask = {};
        $scope.selTask.jobId = $rootScope.globalJobId;
        jobCardServices.getSelTask($scope.selTask, succ);
    };
    if($rootScope.globalJobId){
        $scope.getTaskForJobCard();
    }

    $scope.getAllSpares = function(isPagination){
        function success(data) {
          $scope.aSpareRoot = data.data.data;
          if($scope.aSpareRoot && $scope.aSpareRoot.length>0){
            for(var t=0;t<$scope.aSpareRoot.length;t++){
                $scope.aSpareRoot[t].newObj = $scope.aSpareRoot[t].code +' - '+ $scope.aSpareRoot[t].name;
            }
          }
        }
        var oFilter = prepareFilterObject(isPagination);
        spareService.getAllSpareListAll(oFilter, success);
    };
    $scope.getAllSpares();

    $scope.addIssueSubmit = function(){
        $scope.localData = {};
        if($scope.taskName){
            $scope.localData.task_name = $scope.taskName.task_name;
            $scope.localData.taskId = $scope.taskName.taskId;
        }
        if($scope.partName){
            $scope.localData.spare_name = $scope.partName.name;
            $scope.localData.spare_code = $scope.partName.code;
            $scope.localData.uom = $scope.partName.uom;
        }
        $scope.localData.flag = 'issued';
        $scope.localData.remaining_quantity = 0;
        $scope.localData.issue_quantity = 0;
        //$rootScope.aAddedTask.push($scope.localData);
        //$uibModalInstance.dismiss('cancel');

        if($scope.partName && $scope.partName.code){

            function success(data) {
                $scope.availData = data.data.data;
                $scope.availDataMsg = data.data.message;
                if($scope.availData && $scope.availData.availableQty){
                    $scope.localData.remaining_quantity = $scope.availData.availableQty;
                    $scope.addOne = false;
                    for(var x=0;x<$rootScope.aAddedTask.length;x++){
                        if($scope.localData.spare_code == $rootScope.aAddedTask[x].spare_code){
                            $scope.addOne = true;
                        }
                    }
                    if($scope.addOne == false){
                        $rootScope.aAddedTask.push($scope.localData);
                    }else{
                        swal("Already added in list","","warning");
                    }
                }else{
                    swal($scope.availDataMsg,"","warning");
                }
                /*if($rootScope.aAddedTask && $rootScope.aAddedTask.length>0){*/

                /*}*/

                $uibModalInstance.dismiss('cancel');
            }
            $scope.callInvServ = {};
            $scope.callInvServ.code = $scope.partName.code;

            spareService.getInvByCode($scope.callInvServ, success);
        }
    }

});

materialAdmin.controller("returnSpareCtrl", function($rootScope, $scope,$modal,$uibModal,DateUtils,growlService,formValidationgrowlService,jobCardServices,spareService,mechanicService, billsService) {
    function prepareFilterObject(){
        var myFilter = {};
        if($scope.status){
          myFilter.status = $scope.status;
        }
        if($scope.vehicle_number){
          myFilter.vehicle_number = $scope.vehicle_number;
        }

        return myFilter;
    }
    $scope.getAllJobCard = function(){
        function success(data) {
            $scope.aJobCardsOpen = [];
            $scope.aJobCardsClosed = [];
            if(data.data && data.data.data && data.data.data.length>0){
                $scope.aJobCardsForSpareIssue = data.data.data;
                for(var j=0;j<$scope.aJobCardsForSpareIssue.length;j++){
                    if($scope.aJobCardsForSpareIssue[j].status == 'Open'){
                        $scope.aJobCardsForSpareIssue[j].newShowField = $scope.aJobCardsForSpareIssue[j].jobId +' - '+ $scope.aJobCardsForSpareIssue[j].vehicle_number;
                        $scope.aJobCardsOpen.push($scope.aJobCardsForSpareIssue[j]);
                    }else{
                        $scope.aJobCardsClosed.push($scope.aJobCardsForSpareIssue[j]);
                    }
                }
            }
        }
        function failure(res){
          //console.log("fail: ",res);
          swal("Some error with GET Job Card.","","error");
        }
        var oFilter = prepareFilterObject();
        jobCardServices.getAllJobCards(oFilter,success,failure);
    };
    $scope.getAllJobCard();

    $scope.selSerachQuery22 = function(){
        function successPost(response){
            if(response && response.data){
                $scope.aSlipList = response.data.data;
                $scope.aSlipDetail = [];
                $scope.aSlipDetail.push($scope.aSlipList[0]);
                if($scope.aSlipDetail && $scope.aSlipDetail.length>0){
                    for(var x = 0;x<$scope.aSlipDetail[0].issued_spare.length;x++){
                        $scope.aSlipDetail[0].issued_spare[x].quantity22 = $scope.aSlipDetail[0].issued_spare[x].quantity;
                        $scope.aSlipDetail[0].issued_spare[x].quantity = 0;
                    }
                }
                setTimeout(function(){
                    var listItem = $($('.lv-item')[0]);
                    listItem.siblings().removeClass('grn');
                    listItem.addClass('grn');
                }, 0);
            }
        }
        function failure(res){
            swal("Some error with get list","","error");
        }
        $scope.objIssue = {};
        $scope.objIssue.jobId = $scope.selJobIdVehicle.jobId;
        $scope.objIssue.flag = 'issued';

        $rootScope.globalJobId22 = $scope.selJobIdVehicle.jobId;
        $rootScope.globalHomId22 = $scope.selJobIdVehicle.homId;
        spareService.getSlipList($scope.objIssue, successPost,failure);
    };

    $scope.selectSlipSide = function(s,i){
        $scope.aSlipDetail = [];
        $scope.aSlipDetail.push(s);
        if($scope.aSlipDetail && $scope.aSlipDetail.length>0){
            for(var x = 0;x<$scope.aSlipDetail[0].issued_spare.length;x++){
                if($scope.aSlipDetail[0].issued_spare[x].quantity22){

                }else{
                    $scope.aSlipDetail[0].issued_spare[x].quantity22 = $scope.aSlipDetail[0].issued_spare[x].quantity;
                    $scope.aSlipDetail[0].issued_spare[x].quantity = 0;
                }
            }
        }
        setTimeout(function(){
            var listItem = $($('.lv-item')[i]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
        }, 0);
    }

    $scope.selSlipNo = function(){
        function successGet(response){
            if(response && response.data){
                $scope.aSlipDetail = response.data.data;
                if($scope.aSlipDetail && $scope.aSlipDetail.length>0){
                    for(var x = 0;x<$scope.aSlipDetail[0].issued_spare.length;x++){
                        $scope.aSlipDetail[0].issued_spare[x].quantity22 = $scope.aSlipDetail[0].issued_spare[x].quantity;
                        $scope.aSlipDetail[0].issued_spare[x].quantity = 0;
                    }
                }
            }
        }
        function failure(res){
            swal("Some error with get slip data","","error");
        }
        $scope.objSlipNum = {};
        $scope.objSlipNum.slip_number = $scope.slip_no;
        spareService.getSlipDetail($scope.objSlipNum, successGet,failure);
    };

    $scope.qtyCheck = function(d,i){
        if(d.quantity>(d.quantity22-d.total_returned)){
            d.quantity = 0;
            swal("Please enter less then OR equal to REMAINING QTY.", "", "warning");
        }
    }

    $scope.reIssueSubmit = function(){
        function succReturn(data) {
          $scope.resDataIssue = data.data;
          var msggg = data.data.message;
          swal(msggg,"","success");

          $scope.downloadSlip(data.data.data);

        }

        $scope.downloadSlip = function(slip, index) {
            billsService.getIssueSlipPdf(JSON.stringify(slip), function(data) {
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            });
        };

        $scope.objReturnIssue = {};
        $scope.objReturnIssue.jobId = $scope.aSlipDetail[0].jobId;
        $scope.objReturnIssue.vehicle_number = $scope.aSlipDetail[0].vehicle_number;
        $scope.objReturnIssue.homId = $scope.aSlipDetail[0].homId;
        $scope.objReturnIssue.mechanic_name = $scope.aSlipDetail[0].mechanic_name;
        $scope.objReturnIssue.mechanic_employee_code = $scope.aSlipDetail[0].mechanic_employee_code;
        //$scope.objReturnIssue = $scope.aSlipDetail[0];
        $scope.objReturnIssue.spare_list = [];
        $scope.objReturnIssue.spare_list = $scope.aSlipDetail[0].issued_spare;
        for(var r=0;r<$scope.objReturnIssue.spare_list.length;r++){
            $scope.objReturnIssue.spare_list[r].flag = 'returned';
        }
        $scope.objReturnIssue.slip_number = $scope.aSlipDetail[0].slip_number;
        $scope.objReturnIssue.flag = 'returned';
        spareService.postAllIssueServ($scope.objReturnIssue, succReturn);
    }

});

materialAdmin.controller("inventoryInwordCtrl", function($rootScope, $scope,$uibModal,$localStorage,$state,DateUtils,growlService,spareService,formValidationgrowlService,poService,inventoryService,clientService) {
    $scope.aPOData = [];
    $scope.totalValue = 0;

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

    $scope.bill_date = new Date();

    ($scope.getAllPOs = function(){
        $scope.inventories=[];
        $scope.selectedInventory={};
        function prepareQueryFilterObj(){
            var queryFilter = {status:'inward',type:'Spare'};
            return queryFilter;
        }
        function success(response){
            if(response.data && response.data.data.length>0){
                $scope.inventories = response.data.data;
            }
        }
        function failure(response){
            //console.log(response);
        }
        spareService.getAllPOForDorpdown(prepareQueryFilterObj(),success,failure);
    })();

    $scope.selPOFunc = function(data){
        $scope.aPOData = data;
        if(!$scope.aPOData.rFreight) {
			$scope.aPOData.rFreight = $scope.aPOData.freight;
		}else{
			$scope.aPOData.freight = $scope.aPOData.rFreight ;
		}
        $scope.aPOData.cummulative_price = 0;
        for (var i = 0; i < $scope.aPOData.spare.length; i++) {
            $scope.aPOData.spare[i].rate_per_piece = $scope.aPOData.spare[i].rate;
			$scope.aPOData.spare[i].quantity = $scope.aPOData.spare[i].remaining_quantity;
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.cummulative_price = $scope.aPOData.cummulative_price + $scope.aPOData.spare[i].billing_amount;
            $scope.aPOData.spare[i].selected = true;
        }
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

    $scope.checkBXclick = false;
    $scope.clickCheckBX = function(){
        $scope.checkBXclick = true;
    }

    $rootScope.getInvGlobal = function() {
        $state.reload();
    }

    function succInventory(response){
        if(response.data && response.data.data){
            swal("Saved!", response.data.message, "success");
            $rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = response.data.data;
            $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
            $rootScope.getInvGlobal();
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/spareMaster/invInwardPreview.html',
                controller: 'invImwardPrevCtrl'
            });
        }
    }
    function failInventory(response){
        swal("Error!", "", "error");
    }

    $scope.addNewInventory = function() {
        var formData  = angular.copy($scope.aPOData)
        //console.log(formData);
        var toSend = {
            "vendor_id":formData.vendor_id,
            "vendorId":formData.vendorId,
            "vendor_name":formData.vendor_name,
            "po_number":formData.ponumder,
            "po_id":formData._id,
			"freight":formData.freight,
            "invoice_number":$scope.invoice_number,
            "bill_date":$scope.bill_date,
            "homId":formData.homId,
            "hom_short_name":formData.hom_short_name,
			"branchId" : formData.branchId,
			"branchName" : formData.branchName,
        };
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
                    "billing_amount":formData.spare[i].billing_amount
                }
                data.push(oData);
            }

        }
        toSend.data = data;
        toSend.to_inward = true;
        if($scope.checkBXclick == true){
            $rootScope.invFinalData = toSend;
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/spareMaster/inverdFinal.html',
                controller: 'invFinalCtrl'
            });
        }else{
            toSend.to_inward = true;
            inventoryService.saveInventory(toSend,succInventory,failInventory);
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
        }
        $scope.checkBXclick = true;
    }

    $scope.calculate = function(i){
		var rateP = $scope.aPOData.spare[i].rate;
		if($scope.aPOData.spare[i].rate_per_piece == undefined){
			$scope.aPOData.spare[i].rate_per_piece = 0;
		}
    	if($scope.aPOData.spare[i].rate_per_piece <= rateP) {
			$scope.aPOData.spare[i].rate_inc_tax = ($scope.aPOData.spare[i].rate_per_piece + ($scope.aPOData.spare[i].rate_per_piece * ($scope.aPOData.spare[i].tax / 100) ));
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.spare[i].billing_amount = Math.ceil($scope.aPOData.spare[i].billing_amount*100)/100;
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
});

materialAdmin.controller("invFinalCtrl", function($rootScope, $scope,$uibModal,$localStorage, $uibModalInstance,growlService,formValidationgrowlService,inventoryService,clientService) {

    $rootScope.returnInwardData = {};

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


    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    if($rootScope.invFinalData){
        $scope.invData = $rootScope.invFinalData;
    }
    $scope.invFinalSubmit = function(){
        if($scope.invData){

            function success(data) {
                $uibModalInstance.dismiss('cancel');
                $rootScope.returnInwardData = {};
                $rootScope.returnInwardData.data = data.data.data;
                $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
                $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
                $rootScope.getInvGlobal();
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/spareMaster/invInwardPreview.html',
                    controller: 'invImwardPrevCtrl'
                });
            }
            $scope.data = $scope.invData;
            $scope.data.to_inward = true;
            inventoryService.saveInventory($scope.data, success);
        }
    }
    $scope.invFinalCancel = function(){
        if($scope.invData){

            function success(data) {
                $uibModalInstance.dismiss('cancel');
                $rootScope.returnInwardData = {};
                $rootScope.returnInwardData.data = data.data.data;
                $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
                $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
                $rootScope.getInvGlobal();
                var modalInstance = $uibModal.open({
                    templateUrl: 'maintenance/views/spareMaster/invInwardPreview.html',
                    controller: 'invImwardPrevCtrl'
                });
            }
            $scope.data = $scope.invData;
            $scope.data.to_inward = false;

            inventoryService.saveInventory($scope.data, success);
        }
    }

});

materialAdmin.controller("invImwardPrevCtrl", function($rootScope, $scope, $uibModalInstance,billsService) {

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };

    //console.log($rootScope.prData);

    $scope.localInwardData = $rootScope.returnInwardData;

	if($scope.localInwardData && $scope.localInwardData.data && $scope.localInwardData.data.length>0){
		var tAmt = 0;
		for(var t=0;t<$scope.localInwardData.data.length;t++){
			tAmt = tAmt + $scope.localInwardData.data[t].billing_amount;
		}
		$scope.localInwardData.totalAmt = tAmt;
		$scope.localInwardData.fTotalAmt = tAmt + $scope.localInwardData.data[0].freight;
	}

    $scope.downloadInward = function(data) {
        if(data){
            billsService.getInvInwardPdf(data, function(data) {
                var a = document.createElement('a');
                a.href = data.data.url;
                a.download = data.data.url;
                a.target = '_blank';
                a.click();
            });
        }
    };
    // $scope.downloadInward($scope.localInwardData);
});


materialAdmin.controller("otherExpensesController", function($rootScope, $scope,$uibModal,$state, Vehicle, DateUtils, otherExpensesService,jobCardServices) {
    $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.pageChanged = function() {
        $scope.fetchOE(true);
    };
    function prepareFilterObject(isPagination){
        var allowedKey = ['type','vehicle_no'];
        var myFilter = {};
        for (var i = 0; i < allowedKey.length; i++) {
            if($scope[allowedKey[i]]){
                myFilter[allowedKey[i]] = $scope[allowedKey[i]];
            }
        }
        if(isPagination && $scope.currentPage){
            myFilter.skip = $scope.currentPage;
        }
        if(myFilter.vehicle_no){
            myFilter.find = myFilter.vehicle_no;
            delete myFilter.vehicle_no;
            delete myFilter.type;
        }
        return myFilter;
    };

    $scope.fetchOE = function(isPagination) {
        var oFilter = prepareFilterObject(isPagination);
        otherExpensesService.get(oFilter, function(data) {
            $scope.aExpenses = data.data.data;
            $scope.total_pages = data.data.pages;
            $scope.totalItems = data.data.count;
            setTimeout(function(){
                listItem = $($('.selectItem')[0]);
                listItem.addClass('grn');
            }, 200);
        }, function(data) {
        });
    };
    $scope.fetchOE();

    $scope.addClicked = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/addExpensePopUp.html',
            controller: 'addExpensePopUp',
            resolve: {
                vehicleData: function() {
                    return $rootScope.aVehicles;
                }
            }
        });
        modalInstance.result.then(function(data) {
            if(data && data.data && data.data.message){
                swal("success!", data.data.message, "success")
            }
            $state.reload();
        }, function(data) {
            if (data != 'cancel') {
                if(data && data.data && data.data.message){
                    swal("Oops!", data.data.message, "error")
                }
            }
        });
    };

    $scope.getAllVehicles = function(){
        function success(data) {
            $rootScope.aVehicles = data.data.data;
        };

        var oFilter = {};
        Vehicle.getAllregList(oFilter,success);
    }
    $scope.getAllVehicles();



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
    //************* New Date Picker for multiple date selection in single form **************

});

materialAdmin.controller("addExpensePopUp", function($rootScope, $scope, $uibModalInstance,$localStorage, vehicleData,otherExpensesService,jobCardServices) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.aVehicles = angular.copy(vehicleData);
    $scope.oExpense = {
        type:'Other'
    };
    $scope.oExpense.bill_date = new Date();

    function allJobID(){
      function succ(data) {
        $scope.aJobCards = data.data.data;
      };
      function fail(data) {
        $scope.aJobCards = [];
      };
      jobCardServices.getAllJobCardsFull({},succ,fail);
    };
    allJobID();

    $scope.selJobid = function(jid){
        if(jid && $scope.aVehicles && $scope.aVehicles.length>0){
            for(var v=0;v<$scope.aVehicles.length;v++){
                if($scope.aVehicles[v].vehicle_reg_no == jid.vehicle_number){
                    $scope.oExpense.vehicle_no_full = $scope.aVehicles[v];
                }
            }
        }
    }

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

        $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

    //************* New Date Picker for multiple date selection in single form ******************
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
    $scope.add = function(form) {
        if($scope.oExpense.jobid_full){
            $scope.oExpense.jobId = $scope.oExpense.jobid_full.jobId;
            $scope.oExpense.vehicle_no = $scope.oExpense.jobid_full.vehicle_number;
            delete $scope.oExpense.jobid_full;
            delete $scope.oExpense.vehicle_no_full;
        }

        otherExpensesService.add($scope.oExpense,success,failure);
    }
});


materialAdmin.controller("slipPrintCtrl",
	function(
		$rootScope,
		$scope,
		$state,
		$uibModalInstance,
		excelDownload,
		clientService,
		billsService,
		thatPO,
		sharedResource,
		clientConfig,
		maintenanceVendorService_){
			$scope.aTemplate = [];
			$scope.templateKey = $scope.aTemplate[0];
			$scope.showSubmitButton = false;
			$scope.showSubmitAndApproveButton = false;
			$scope.hidePrintButton = false;
			$scope.downloadExcel = false;

			$scope.downloadSlip = function(slip) {
		        billsService.getIssueSlipPdf(JSON.stringify(slip), function(res) {
                    if(res) {
						$scope.html = angular.copy(res.data);
					} else {
						swal('Error', 'Something Went Wrong', 'error');
					}
                });
	        };

			$scope.getGR = function () {
				var oFilter = angular.copy(thatPO);
				$scope.downloadSlip(oFilter);
			}
			$scope.getGR();

			$scope.closeModal = function () {
				$uibModalInstance.dismiss('cancel');
			};
});
materialAdmin.controller("printSlipsController", function($rootScope, $scope, Vehicle, DateUtils, spareService,$uibModal, billsService,jobCardServices) {
	$scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 15;
    $scope.totalPages = 0;
    $scope.totalItems = 0;

    /*spareService.getAllSlipList(function(data) {
		const slips = data.data.data;
		for(var i = 0; i < slips.length; i++) {
			var spares = '';
			for(var j = 0; j < slips[i].issued_spare.length; j++) {
				spares+=slips[i].issued_spare[j].spare_name+'('+slips[i].issued_spare[j].quantity+')';
			}
			slips[i].spares = spares;
		}


		$scope.aSlips = slips;

	}, function(err) {
		console.log(err);
	});*/

    function prepareFilterObject(isPagination){
        var allowedKey = ['jobId','status','start_date','end_date'];
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

    //when click page change function call
    $scope.pageChanged = function() {
        $scope.getAllSlip(true);
    };

    function allJobID(){
      function succ(data) {
        $scope.aJobID = data.data.data;
      };
      function fail(data) {
        $scope.aJobID = [];
      };
      jobCardServices.getAllJobCards({all:true},succ,fail);
    };
    allJobID();

    $scope.getAllSlip = function(isPagination){
        function success(data) {
          if(data.data && data.data.data){

            const slips = data.data.data;
            for(var i = 0; i < slips.length; i++) {
                /*var spares = '';
                for(var j = 0; j < slips[i].issued_spare.length; j++) {
                    spares+=slips[i].issued_spare[j].spare_name+'('+slips[i].issued_spare[j].quantity+')';
                }
                slips[i].spares = spares;*/
                var all_qty = 0;
                for(var j = 0; j < slips[i].issued_spare.length; j++) {
                    all_qty+=slips[i].issued_spare[j].quantity;
                }
                slips[i].all_quantity = all_qty;
            }

            $scope.aSlips = slips;

            setTimeout(function(){
             listItem = $($('.selectItem')[0]);
             listItem.addClass('grn');
            }, 500);
            $scope.totalPages = data.data.pages;
            $scope.totalItems = 15*data.data.pages;
            //$rootScope.selectedJobCardInfoForService = $scope.aJobCards[0];
            //$scope.selectedJobCardInfo = $scope.aJobCards[0];
          }
        };
        function failure(res){
          //console.log("fail: ",res);
          swal("Some error with GET slip.","","error");
        }
        var oFilter = prepareFilterObject(isPagination);   //filter function for filter get data
        lastFilter = oFilter;
        spareService.getAllSlipList(oFilter,success,failure);  // get all job card call
    };
    $scope.getAllSlip();

    $scope.printSlip = function(data) {
		var oFilter = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'slipPrintCtrl',
			resolve: {
				thatPO: oFilter
			}
		});
	}
	// $scope.downloadSlip = function(slip) {
	// 	billsService.getIssueSlipPdf(JSON.stringify(slip), function(data) {
    //         var a = document.createElement('a');
    //         a.href = data.data.url;
    //         a.download = data.data.url;
    //         a.target = '_blank';
    //         a.click();
    //     });
	// };
});


