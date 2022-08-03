/**
 * Created by manish on 21/1/17.
 */
materialAdmin.controller("tyreMasterController",
	function ($rootScope, $state, $scope, $timeout, $localStorage, growlService,clientService, tyreMasterService, $uibModal,ReportService,spareService,Vehicle) {
		$scope.tyreMasters = [];
		$scope.selectedTyreMaster = {};
		$scope.indexSelectedFromList = 0;
		$scope.currentMode = "view";
		$rootScope.aIssueTyreData = [];
		$scope.isCollapsed = true;
		/*pagination vars start here*/
		$scope.currentPage = 1;
		$scope.maxSize = 7;
		$scope.itemsPerPage = 15;
		$scope.searchValue = "";
		$scope.totalPages = 0;
		$scope.totalItems = 0;
		$scope.aSts = ["Scrapped","On Road","Repository Bin","Stock","Issued for retreading"];
		$scope.aCts = ["New","Old","Retreaded","Scrapped","Sold"];
		var lastFilter;


		($scope.getAllTyreMasters = function (reset) {
			$scope.tyreMasters = [];
			$scope.selectedTyreMaster = {};
			if (reset) {
				$scope.indexSelectedFromList = 0;
			}
			function prepareQueryFilterObj() {

				var allowedKey = ['name','po_number','invoice_number','status','tyre_number','tyre_category','vehicle_no'];
	            var queryFilter = {};
	            for (var i = 0; i < allowedKey.length; i++) {
	                if($scope[allowedKey[i]]){
						if(allowedKey[i] == 'vehicle_no'){
							if($scope[allowedKey[i]].vehicle_reg_no){
							queryFilter[allowedKey[i]] = $scope[allowedKey[i]].vehicle_reg_no;
							}else{
								queryFilter[allowedKey[i]] = $scope[allowedKey[i]];
							}
						}else {
							queryFilter[allowedKey[i]] = $scope[allowedKey[i]];
						}
	                }
	            }
	            if($scope.currentPage){
	                queryFilter.skip = $scope.currentPage;
	            }
	            if ($scope.vendor_name && $scope.vendor_name._id) {
					queryFilter.vendor_id = $scope.vendor_name._id;
				}
	            return queryFilter;
			}

			function success(response) {
				//console.log(data);
				if (response.data) {
					$scope.aTyres = response.data;
					$scope.totalPages = response.pages;
					$scope.totalItems = 15 * response.pages;
					$scope.selectTyreMasterAtIndex($scope.indexSelectedFromList);
				}
			}

			function failure(response) {
				console.log(response);
			}
			var oFilter = prepareQueryFilterObj();
            lastFilter = oFilter;
            if(oFilter.invoice_number){
            	delete oFilter.skip;
				tyreMasterService.getAllTyre(oFilter, success, failure);
			}else {
				tyreMasterService.getTyreMasters(oFilter, success, failure);
			}
		})();

		($scope.getAllTyreForSearch = function (tyreNumber) {

			// if(tyreNumber.length <= 2)
			// 	return;

			function success(response) {
				//console.log(data);
				if (response.data) {
					$scope.aTyresSearch = response.data;
				}
			}

			function failure(	response) {
				console.log(response);
			}
			tyreMasterService.getAllTyreMasters({}, success, failure);
		})();

		$scope.onSelect = function($item, $model, $label){
			// modelObj = $item;
			$scope.getAllTyreMasters();
		}

		$scope.clearSearch = function(model) {
			$scope[model] = ''
			$scope.getAllTyreMasters();
		}

		$scope.selectTyreMasterAtIndex = function (index) {
			$scope.selectedTyreMaster = angular.copy($scope.aTyres[index]);
			$scope.indexSelectedFromList = index;
			$scope.currentMode = "view";
			//$rootScope.aIssueTyreData.push($scope.selectedTyreMaster);
			setTimeout(function () {
				var listItem = $($('.itemSel')[index]);
				listItem.siblings().removeClass('grn');
				listItem.addClass('grn');
			}, 0);
		};

		$scope.selectTyreIndex = function (dt ,index) {
			$scope.selected = angular.copy($scope.aTyres[index]);
			setTimeout(function () {
				var listItem = $($('.itemSel')[index]);
				listItem.siblings().removeClass('grn');
				listItem.addClass('grn');
			}, 0);
			var avail = false;
			if($rootScope.aIssueTyreData && $rootScope.aIssueTyreData.length>0){
				for(var x=0;x<$rootScope.aIssueTyreData.length;x++){
					if($rootScope.aIssueTyreData[x].tyre_number == dt.tyre_number){
						swal('warning','Already selected !!!','warning');
						avail = true;
					}
				}
				if(avail == false){
					$rootScope.aIssueTyreData.push($scope.selected);
				}
			}else {
				$rootScope.aIssueTyreData.push($scope.selected);
			}


		};

		$scope.removeSelected = function (dt,i) {
			$rootScope.aIssueTyreData.splice(i,1);
		}

		$scope.downloadReport = function(){
            ReportService.getTyreReport(lastFilter, function(data) {
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

		$scope.getAllPOvendor = function(vendor_name){

			// if(vendor_name.length <= 2)
			// 	return;

			function succ(data) {
                $scope.aPOvendor = data.data.data;
            }
            spareService.getAllPOvendorServ({all:true}, succ);
        };
		$scope.getAllPOvendor();

		($scope.getAllPO = function (po_number){

        	// if(po_number.length <= 2)
        	// 	return;

            function succ(data) {
              $scope.aPO = data.data.data;
            }

            spareService.getPOserv({all:true}, succ);
            // spareService.getPOserv({ponumder:po_number}, succ);
        })();

		($scope.getAllRegVehicles = function (vehicle_no) {

			// if(vehicle_no.length <= 2)
			// 	return;

			function success(response) {
				if (response && response.data && response.data.data){
					$scope.regVehicles = response.data.data;
				}
			}
			Vehicle.getAllregList({}, success); //get category = Horse and own vehicle
		})();
		$scope.getVehicles = function (viewValue) {
			if (viewValue && viewValue.toString().length > 1) {
				return new Promise(function (resolve, reject) {
					Vehicle.getNameTrim(viewValue, res => {
						resolve(res.data.data);
					}, err => {
						console.log`${err}`;
						reject([]);
					});

				});
			}

			return [];
		}

        $scope.grnDown = function(){
            $rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = $scope.aTyres;
            $rootScope.returnInwardData.client_full_name = $scope.clientData &&  $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tyreInvInwardPreview.html',
                controller: 'tyreInvImwardPrevCtrl'
            });
        }

		$scope.pageChanged = function () {
			$scope.getAllTyreMasters();
		};

		function succClient(res){
	        $scope.clientData = res.data[0];
	        var client_address = $scope.clientData  && $scope.clientData.client_address;
	        $scope.clientData.logo_url = URL.file_server+ "users/"+$scope.clientData && $scope.clientData.clientId +"/logo.jpg";
	        $scope.clientData.address = (client_address.line1?client_address.line1:"")+" "+(client_address && client_address.line2?client_address.line2:"")+" "+
		        (client_address && client_address.district?client_address.district:"")+" "+(client_address && client_address.city?client_address.city:"")+" "+(client_address && client_address.state?client_address.state:"")+" "+
		        (client_address && client_address.country?client_address.country:"");
	    }
	    (function(){
	        if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.clientId){
	            clientService.getClientByID({clientId:$localStorage.ft_data.userLoggedIn.clientId},succClient)
	        }
	    })()


		$scope.detailTyre = function(tData, index){
			$rootScope.tyreData = tData;
			$state.go('masters_tyre_management.tyre_detail');
		}

		$scope.previewIssueSlip = function(tData, index){
			$rootScope.tyreData = tData;
			$rootScope.tyreData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
        	$rootScope.tyreData.client_address = $scope.clientData && $scope.clientData.address;
			var modalInstance = $uibModal.open({
	            templateUrl: 'maintenance/views/tyreIssueSlipPreview.html',
	            controller: 'tyreIssueSlipPreviewPopUpCtrl'
	        });
		}

		$scope.tyreInwardClicked = function () {
			var rURL = "#!/mastersTyreManagement/tyreInward";
			$rootScope.redirect(rURL);
		};

		$scope.tyreIssueClicked = function () {
			if($rootScope.aIssueTyreData && $rootScope.aIssueTyreData.length>0){
				$rootScope.aIssueTyreData = $rootScope.aIssueTyreData;
				var rURL = "#!/mastersTyreManagement/tyreIssue";
				$rootScope.redirect(rURL);
			}else{
				swal("warning","Please select/add row first.","warning");
			}
		};

		$scope.tyreReturnClicked = function () {
			if($scope.selectedTyreMaster){
				var modalInstance = $uibModal.open({
					templateUrl: 'maintenance/views/returnTyrePopUp.html',
					controller: 'returnTyrePopUpCtrl',
					resolve: {
						thatTyre: function () {
							return $scope.selectedTyreMaster;
						}
					}
				});

				modalInstance.result.then(function () {
					$state.reload();
				}, function (data) {
					if (data != 'cancel') {
						swal("Oops!", data.data.message, "error")
					}
				});
			}else{
				swal("warning","Please select row first.","warning");
			}
		}

		$scope.moveToScrap = function () {
			if($scope.selectedTyreMaster){
				function succMove(response) {
					if (response.status == 'OK') {
						swal("Update!", response.message, "success");
						$scope.getAllTyreMasters();
					}
				}

				function failMove(response) {
					console.log(response);
				}

				var data = {};
				data.id = $scope.selectedTyreMaster._id;
				data.status = 'Scrapped';
				data.tyre_number = $scope.selectedTyreMaster.tyre_number;

				tyreMasterService.updateTyreMaster(data, succMove, failMove);
			}else{
				swal("warning","Please select row first.","warning");
			}
		};

		$scope.moveToStock = function () {
			if($scope.selectedTyreMaster){
				function succMove(response) {
					if (response.status == 'OK') {
						swal("Update!", response.message, "success");
						$scope.getAllTyreMasters();
					}
				}

				function failMove(response) {
					console.log(response);
				}

				var data = {};
				data.id = $scope.selectedTyreMaster._id;
				data.status = 'Stock';
				data.tyre_number = $scope.selectedTyreMaster.tyre_number;

				tyreMasterService.updateTyreMaster(data, succMove, failMove);
			}else{
				swal("warning","Please select row first.","warning");
			}
		};

		$scope.moveToRepobin = function () {
			if($scope.selectedTyreMaster){
				function succMove(response) {
					if (response.status == 'OK') {
						swal("Update!", response.message, "success");
						$scope.getAllTyreMasters();
					}
				}

				function failMove(response) {
					console.log(response);
				}

				var data = {};
				data.id = $scope.selectedTyreMaster._id;
				data.status = 'Repository Bin';
				data.tyre_number = $scope.selectedTyreMaster.tyre_number;

				tyreMasterService.updateTyreMaster(data, succMove, failMove);
			}else{
				swal("warning","Please select row first.","warning");
			}
		};

	});

materialAdmin.controller("tyreIssueSlipPreviewPopUpCtrl", function ($rootScope, $scope, $state,$window, $localStorage, formValidationgrowlService,$uibModalInstance,tyreIssueService) {

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go('masters_tyre_management.tyre_master');
    };

    $scope.getSelTyreIssue = function () {
		function success(response) {
			if (response.data.status === "OK" && response.data) {
				$scope.tyreDataNew = response.data.data[0];
			}
		}

		function failure(response) {
		}

		tyreIssueService.getIssuedTyreDetail($scope.tyreData, success, failure);
	};
	$scope.getSelTyreIssue();

    $scope.downloadPDF = function(){

    	function success(response) {
			if (response.url) {
				$window.open(response.url, '_blank');
			}
		}

		function failure(response) {
		}

		//$scope.tyreFullData = $scope.tyreData + $scope.tyreDataNew;
		var mergedObject = angular.extend($scope.tyreData, $scope.tyreDataNew);

		tyreIssueService.downloadIssueSlip(mergedObject, success, failure);

    };

});

materialAdmin.controller("tyreDetailController", function ($rootScope, $scope,$state,$timeout,structureMasterService,tyreIssueService,tyreMasterService) {
	$scope.getAllStructureNames = function () {
		function success(response) {
			if (response.status.toLowerCase() === "ok" && response.data) {
				$scope.structuresObjArr = response.data;
				if($scope.structuresObjArr && $scope.structuresObjArr.length>0){
					$scope.onVehicleSelect($scope.selectedTyreMaster);
				}
			}
		}

		function failure(response) {
		}

		structureMasterService.getStructureMasters({}, success, failure);
	};


	$scope.getTyreIssueForVeh = function (veh_no) {

		function prepareQueryFilterObj() {
			var queryFilter = {};
			queryFilter.vehicle_no = veh_no;
			queryFilter.isReturned = false;
			return queryFilter;
		}

		function success(response) {
			if (response.data) {
				$scope.issuedTyres = response.data;
				console.log('issued tyres', $scope.issuedTyres);
				$scope.issued_positions = [];
				$scope.issued_tyres = [];
				for (var i = 0; i < $scope.issuedTyres.length; i++) {
					$scope.issued_positions.push($scope.issuedTyres[i].association_position);
					$scope.issued_tyres.push($scope.issuedTyres[i].tyre_number);
				}
				console.log('issued_positions', $scope.issued_positions);
			}
		}

		function failure(response) {
			console.log(response);
		}

		tyreIssueService.get(prepareQueryFilterObj(), success, failure);
	};

	$scope.getTyreIssueForVeh2 = function (veh_no) {

		function prepareQueryFilterObj() {
			var queryFilter = {};
			queryFilter.vehicle_no = veh_no;
			queryFilter.isReturned = false;
			return queryFilter;
		}

		function success(response) {
			if (response.data) {
				$scope.issuedTyres222 = response.data;
				console.log('issued tyres222', $scope.issuedTyres222);
				$scope.issued_positions222 = [];
				$scope.issued_tyres222 = [];
				for (var i = 0; i < $scope.issuedTyres222.length; i++) {
					$scope.issued_positions222.push($scope.issuedTyres222[i].association_position);
					$scope.issued_tyres222.push($scope.issuedTyres222[i].tyre_number);
				}
				console.log('issued_positions222', $scope.issued_positions222);
			}
		}

		function failure(response) {
			console.log(response);
		}

		tyreIssueService.get(prepareQueryFilterObj(), success, failure);
	};

	$scope.getNumber = function(num) {
		if (num) {
			return new Array(num);
		}
	};

	$scope.onVehicleSelect = function (veh) {
		console.log('selected veh', JSON.stringify(veh), $scope.structuresObjArr);
		$scope.selectedStructure = $scope.getStructure(veh.structure_name);
		$scope.getTyreIssueForVeh(veh.vehicle_no || veh.trailer_no);
	};

	// for second structure
	$scope.onVehicleSelect2 = function (veh2) {
		console.log('selected veh2', JSON.stringify(veh2), $scope.structuresObjArr);
		$timeout(function() {
			$scope.$apply(function() {
				$scope.selectedStructure2 = $scope.getStructure(veh2.structure_name);
			});
		}, 2000);
		$scope.getTyreIssueForVeh2(veh2.vehicle_reg_no || veh2.trailer_no);
	};

	$scope.getStructure = function(str) {
		for(var i = 0; i < $scope.structuresObjArr.length; i++) {
			if(str == $scope.structuresObjArr[i].structure_name) return $scope.structuresObjArr[i];
		}
		return null;
	};

	if($rootScope.tyreData){

		if ($rootScope.tyreData && $rootScope.tyreData.vehicle_no) {
			function success(response) {
				if (response && response.data) {
					$scope.associatedVehData = response.data;
					if($scope.associatedVehData && $scope.associatedVehData.vehicle_reg_no) {
						$scope.onVehicleSelect2($scope.associatedVehData);
					}
					console.log('associated',$scope.associatedVehData );
				}
			}

			tyreMasterService.getStructureByVehicleNo({vehicle_no: $rootScope.tyreData.vehicle_no}, success); //get vehicle no and structure by vehicle no....
		}

		$scope.selectedTyreMaster = $rootScope.tyreData;
		$scope.getAllStructureNames();
	}else{
		$state.go('masters_tyre_management.tyre_master');
	}

	$scope.back = function(){
		$state.go('masters_tyre_management.tyre_master');
	}


});

materialAdmin.controller("tyreInwordCtrl", function ($rootScope,$localStorage, $scope,$state, $uibModal, DateUtils, growlService, spareService, formValidationgrowlService, poService, inventoryService, toolService, tyreMasterService, DateUtils,clientService,maintenanceVendorService_) {
	$scope.aPOData = [];
	$scope.aTyreNumber = [];
	$scope.aTestTyre = [];
	$scope.totalValue = 0;
	$scope.invoice_date = new Date();
	$scope.aSts = ['Scrapped', 'On Road', 'Repository Bin', 'Stock'];
	$scope.category = 'new';
	($scope.getAllPOs = function () {
		$scope.inventories = [];
		$scope.selectedInventory = {};
		function prepareQueryFilterObj() {
			var queryFilter = {type: 'Tyre'};
			return queryFilter;
		}

		function success(response) {
			if (response.data && response.data.data.length > 0) {
				$scope.inventories = response.data.data;
			}
		}

		function failure(response) {
			console.log(response);
		}

		spareService.getAllPOForDorpdown(prepareQueryFilterObj(), success, failure);
	})();

	$rootScope.reloadPage = function(){
		$state.reload();
	}

	$scope.catChange = function (cat) {
		//console.log($scope.category);
		if(cat == 'old') {
			if ($scope.category == 'old') {
				$scope.aPOData.spare = [];
			}
		}
	}

	$scope.getVendors = function () {
		function success(response) {
			if (response.data && response.data.length > 0) {
				$scope.aVendors = response.data;
			}
		}

		function failure(response) {
			console.log(response);
		}


		maintenanceVendorService_.getMaintenanceVendorsAll({},success,failure);
	}
	$scope.getVendors();

	$scope.addRowInTable = function() {
		$rootScope.aPOData = $scope.aPOData;
		var modalInstance = $uibModal.open({
			templateUrl: 'maintenance/views/tyreOldAddPop.html',
			controller: 'oldTyrePop'
		});
	}

	function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData && $scope.clientData.client_address;
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

	$scope.selPOFunc = function (data) {
		$scope.aPOData = data;
		if(!$scope.aPOData.rFreight) {
			$scope.aPOData.rFreight = $scope.aPOData.freight;
		}else{
			$scope.aPOData.freight = $scope.aPOData.rFreight ;
		}
		$scope.aPOData.aTestTyre = [];
		$scope.aPOData.cummulative_price = 0;
		for (var i = 0; i < $scope.aPOData.spare.length; i++) {
			$scope.aPOData.spare[i].rate_per_piece = $scope.aPOData.spare[i].rate;
			$scope.aPOData.spare[i].quantity = $scope.aPOData.spare[i].remaining_quantity;
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.spare[i].aTyreNumber = [];
			//$scope.aPOData.spare[i].aTestTyre = [];
			$scope.aPOData.cummulative_price = $scope.aPOData.cummulative_price + $scope.aPOData.spare[i].billing_amount;
			$scope.aPOData.spare[i].selected = true;
			$scope.aPOData.spare[i].compTax = $scope.aPOData.spare[i].tax;
		}
	}

	$scope.addCode = function (code, i) {
		if($scope.aPOData.spare[i] && $scope.aPOData.spare[i].aTyreNumber.length<$scope.aPOData.spare[i].quantity){
			//$scope.aToolCode.push(code);
			var tyrNumb = $scope.aPOData.spare[i].tyreN;
			$scope.tyreData = {};
			$scope.tyreData.tyre_number = $scope.aPOData.spare[i].tyreN;
			$scope.tyreData.retread_count = $scope.aPOData.spare[i].retread || 0;
			$scope.tyreData.status = $scope.aPOData.spare[i].sts || 'Stock';
			if($scope.tyreData.retread_count >0){
				$scope.tyreData.category="Retreaded";
			}else{
				$scope.tyreData.category="Old";
			}
			//$scope.aPOData.spare[i].aTestTyre.push($scope.tyreData.tyre_number);
			if($scope.aPOData && $scope.aPOData.aTestTyre.length>0){
				$scope.avail = false;
				for(var t=0;t<$scope.aPOData.aTestTyre.length;t++){
					if($scope.aPOData.aTestTyre[t] == $scope.tyreData.tyre_number){
						console.log("error");
						$scope.avail = true;
					}

				}
				if($scope.avail == false){
					$scope.aPOData.aTestTyre.push($scope.tyreData.tyre_number);
					$scope.aPOData.spare[i].aTyreNumber.push($scope.tyreData);
				}else{
					swal("Exists!", "This tyre already entered by you...", "warning");
				}
			}else{
				$scope.aPOData.aTestTyre.push($scope.tyreData.tyre_number);
				$scope.aPOData.spare[i].aTyreNumber.push($scope.tyreData);
			}

			//$scope.aPOData.spare[i].aTyreNumber.push($scope.tyreData);
			$scope.aPOData.spare[i].tyreN = '';
			$scope.aPOData.spare[i].retread = '';
			$scope.aPOData.spare[i].sts = '';
		}else{
            swal("No. of Tyres must be equal to Quantity.","","warning");
            $scope.aPOData.spare[i].tyreN = '';
			$scope.aPOData.spare[i].retread = '';
			$scope.aPOData.spare[i].sts = '';
        }
	}
	$scope.removeCode = function (tyrNum, index) {
		if($scope.aPOData.spare && $scope.aPOData.spare.length>0){
			for(var g=0;g<$scope.aPOData.spare.length;g++){
				for(var h=0;h<$scope.aPOData.spare[g].aTyreNumber.length;h++){
					if($scope.aPOData.spare[g].aTyreNumber[h].tyre_number == tyrNum.tyre_number){
						$scope.aPOData.spare[g].aTyreNumber.splice(h, 1);
					}
				}
			}
		}
		if($scope.aPOData.aTestTyre && $scope.aPOData.aTestTyre.length>0){
			for(var q=0;q<$scope.aPOData.aTestTyre.length;q++){
				if($scope.aPOData.aTestTyre[q] == tyrNum.tyre_number){
					$scope.aPOData.aTestTyre.splice(q, 1);
				}
			}
		}
	}

	function succInward(response) {
		if (response.data && response.data.status == 'OK') {
			swal("Saved!", response.data.message, "success");
			$rootScope.reloadPage();
			$rootScope.returnInwardData = {};
            $rootScope.returnInwardData.data = response.data.data;
            $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
            //$rootScope.getInvGlobal();
            var modalInstance = $uibModal.open({
                templateUrl: 'maintenance/views/tyreInvInwardPreview.html',
                controller: 'tyreInvImwardPrevCtrl'
            });
		}else if(response.data.status == 'ERROR'){
			swal("Exists!", response.data.message, "warning");
		}
	}

	function failInward(response) {
		swal("Error!", response.data && response.data.message, "error");
	}

	$scope.checkBXclick = false;
	$scope.clickCheckBX = function () {
		$scope.checkBXclick = true;
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

        $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.format = DateUtils.format;
    //************* New Date Picker for multiple date selection in single form ******************

	$scope.aTcat=["Old","Retreaded"];
	$scope.aTstatus=["Repository Bin","Stock"];

	$scope.addNewTyre = function () {
		var formData = angular.copy($scope.aPOData)
		console.log(formData);
		var toSend = {
			"vendor_id": formData.vendor_id,
			"vendorId": formData.vendorId,
			"vendor_name": formData.vendor_name,
			"po_number": formData.ponumder,
			"test_tyres": formData.aTestTyre,
			"freight": formData.freight,
			/*"homId":formData.homId,*/
		 	//"remark":formData.remark,
			"po_id": formData._id,
			"invoice_number": $scope.invoice_number,
			"invoice_date": $scope.invoice_date
		};
		var data = [];
		for (var i = 0; i < formData.spare.length; i++) {

			if (formData.spare[i].selected == true) {
				var oData = {
					"spare_id": formData.spare[i]._id,
					"spare_code": formData.spare[i].code,
					"spare_name": formData.spare[i].name,
					"quantity": formData.spare[i].quantity,
					"rate_per_piece": formData.spare[i].rate_per_piece,
					"billing_amount": formData.spare[i].billing_amount,
					"tax": formData.spare[i].tax,
					"tyres": formData.spare[i].aTyreNumber,
					"remark": formData.spare[i].remark,
					"tyre_category": "New",
					"status": "Stock"

				}
				data.push(oData);
			}

		}
		toSend.data = data;
		toSend.to_inward = true;
		toSend.type="New";
		if ($scope.checkBXclick == true) {
			$rootScope.tyreInwardFinalData = toSend;
			var modalInstance = $uibModal.open({
				templateUrl: 'maintenance/views/tyreInwardFinal.html',
				controller: 'tyreInwardFinalCtrl'
			});
		} else {
			toSend.to_inward = true;
			toSend.type = 'New';
			tyreMasterService.addTyreInward(toSend, succInward, failInward);
		}
	};

	$scope.addOldTyre = function () {
		var formDataaaa = $scope.aPOData;
		console.log(formDataaaa);
		var toSend = {
			//"po_number": formData.ponumder,
			"test_tyres": formDataaaa.aTestTyre,
			"freight": $scope.freight,
			//"po_id": formData._id,
			"invoice_number": $scope.invoice_number || "",
			"invoice_date": $scope.invoice_date
		};
		if($scope.vendor){
			toSend.vendor_id=$scope.vendor._id;
			toSend.vendorId=$scope.vendor.vendorId;
			toSend.vendor_name=$scope.vendor.name;
		}
		var data = [];
		for (var i = 0; i < formDataaaa.spare.length; i++) {

			if (formDataaaa.spare[i].selected == true) {
				var oData = {
					"spare_id": formDataaaa.spare[i]._id,
					"spare_code": formDataaaa.spare[i].code,
					"spare_name": formDataaaa.spare[i].name,
					"quantity": formDataaaa.spare[i].quantity,
					"rate_per_piece": formDataaaa.spare[i].rate_per_p,
					"billing_amount": formDataaaa.spare[i].billing_amount,
					"tax": formDataaaa.spare[i].tax,
					"tyres": formDataaaa.spare[i].aTyreNumber,
					"remark": formDataaaa.spare[i].remark,
					"tyre_category": $scope.tyreCategory,
					"status": $scope.statusTyre
				};
				data.push(oData);
			}
		}
		toSend.data = data;
		toSend.to_inward = true;
		toSend.type = 'Old';
		tyreMasterService.addTyreInward(toSend, succInward, failInward);

	};

	$scope.removeThis = function (dt, i) {
		$scope.aPOData.spare.splice(i, 1);
	}

	$scope.checkFreight = function () {
		if($scope.aPOData.freight > $scope.aPOData.rFreight){
			$scope.aPOData.freight = 0;
			swal("warning", "Please enter less then freight!!!", "warning");
		}
	}


	$scope.checkQty = function (d, i) {
		if (d.quantity > d.remaining_quantity) {
			swal("Quantity must be less then to remaining quantity!!!", "", "warning");
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

	$scope.calculate = function (i) {
		var rateP = $scope.aPOData.spare[i].rate;
		if($scope.aPOData.spare[i].rate_per_piece == undefined){
			$scope.aPOData.spare[i].rate_per_piece = 0;
		}
		if($scope.aPOData.spare[i].rate_per_piece <= rateP) {
			$scope.aPOData.spare[i].rate_inc_tax = ($scope.aPOData.spare[i].rate_per_piece + ($scope.aPOData.spare[i].rate_per_piece * ($scope.aPOData.spare[i].tax / 100) ));
			$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
			$scope.aPOData.spare[i].billing_amount = Math.ceil($scope.aPOData.spare[i].billing_amount*100)/100;
			$scope.aPOData.spare[i].rate_inc_tax = Math.ceil($scope.aPOData.spare[i].rate_inc_tax*100)/100;
			watchFunc();
		}else {
			$scope.aPOData.spare[i].rate_per_piece = rateP;
		}
	}

	$scope.calculateOld = function (i) {

		if($scope.aPOData.spare[i].rate_per_p == undefined){
			$scope.aPOData.spare[i].rate_per_p = 0;
		}
		$scope.aPOData.spare[i].tax = $scope.aPOData.spare[i].tax || 0;

		$scope.aPOData.spare[i].rate_inc_tax = ($scope.aPOData.spare[i].rate_per_p + ($scope.aPOData.spare[i].rate_per_p * ($scope.aPOData.spare[i].tax / 100) ));
		$scope.aPOData.spare[i].billing_amount = (($scope.aPOData.spare[i].rate_inc_tax || 0) * ($scope.aPOData.spare[i].quantity || 0));
		$scope.aPOData.spare[i].billing_amount = Math.ceil($scope.aPOData.spare[i].billing_amount*100)/100;
		$scope.aPOData.spare[i].rate_inc_tax = Math.ceil($scope.aPOData.spare[i].rate_inc_tax*100)/100;
		watchFunc();

	}

	function watchFunc() {
		$scope.totalValue = 0;
		if ($scope.aPOData.spare && $scope.aPOData.spare[0]) {
			for (var j = 0; j < $scope.aPOData.spare.length; j++) {
				$scope.totalValue += $scope.aPOData.spare[j].billing_amount || 0;
			}
		}
	}

	$scope.$watch('InwordForm.$valid', function (newVal, oldVal) {
		watchFunc();
	});

	$scope.calcTx = function (d) {
		for (var k = 0; k < $scope.aPOData.spare.length; k++) {
			$scope.aPOData.spare[k].rate_inc_tax = ($scope.aPOData.spare[k].rate_per_piece + ($scope.aPOData.spare[k].rate_per_piece * (d / 100) ));
			$scope.aPOData.spare[k].billing_amount = (($scope.aPOData.spare[k].rate_inc_tax || 0) * ($scope.aPOData.spare[k].quantity || 0));
		}
	}


});

materialAdmin.controller("tyreInwardFinalCtrl", function ($rootScope, $scope,$localStorage,$uibModal, $uibModalInstance, growlService, formValidationgrowlService, inventoryService, tyreMasterService,clientService) {

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};

	function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData && $scope.clientData.client_address;
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

	if ($rootScope.tyreInwardFinalData) {
		$scope.invData = $rootScope.tyreInwardFinalData;
	}
	$scope.invFinalSubmit = function () {
		if ($scope.invData) {

			function success(response) {
				swal("Saved!", response.data.message, "success");
				$rootScope.reloadPage();
				$rootScope.returnInwardData = {};
	            $rootScope.returnInwardData.data = response.data && response.data.data;
	            $rootScope.returnInwardData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
	            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
	            //$rootScope.getInvGlobal();
	            var modalInstance = $uibModal.open({
	                templateUrl: 'maintenance/views/tyreInvInwardPreview.html',
	                controller: 'tyreInvImwardPrevCtrl'
	            });
				$uibModalInstance.dismiss('cancel');
			}

			$scope.data = $scope.invData;
			$scope.data.to_inward = true;
			tyreMasterService.addTyreInward($scope.data, success);
		}
	}
	$scope.invFinalCancel = function () {
		if ($scope.invData) {

			function success(response) {
				swal("Saved!", response.data.message, "success");
				$rootScope.reloadPage();
				$rootScope.returnInwardData = {};
	            $rootScope.returnInwardData.data = response.data.data;
	            $rootScope.returnInwardData.client_full_name =  $scope.clientData && $scope.clientData.client_full_name;
	            $rootScope.returnInwardData.client_address = $scope.clientData && $scope.clientData.address;
	            //$rootScope.getInvGlobal();
	            var modalInstance = $uibModal.open({
	                templateUrl: 'maintenance/views/tyreInvInwardPreview.html',
	                controller: 'tyreInvImwardPrevCtrl'
	            });
				$uibModalInstance.dismiss('cancel');
			}

			$scope.data = $scope.invData;
			$scope.data.to_inward = false;
			$scope.data.type = 'New';

			tyreMasterService.addTyreInward($scope.data, success);
		}
	}

});

materialAdmin.controller("tyreInvImwardPrevCtrl", function($rootScope, $scope, $uibModalInstance,billsService) {

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
            billsService.getTyreInvInwardPdf(data, function(data) {
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

materialAdmin.controller("oldTyrePop", function($rootScope, $scope, $uibModalInstance,jobCardServices,growlService,formValidationgrowlService,spareService,inventoryService) {

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
		myFilter.type = "Tyre";
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

	$scope.addTyreData = function(){

		if($scope.qty > 0){
			$scope.localData = {};
			$scope.localData.code = $scope.spare_name_code.code;
			$scope.localData.name = $scope.spare_name_code.name;
			$scope.localData.quantity =  $scope.qty;
			$scope.localData.selected =  true;
			$scope.localData.aTyreNumber =  [];

			if($rootScope.aPOData.spare && $rootScope.aPOData.spare.length>0){

			}else {
				$rootScope.aPOData.spare = [];
			}

			$rootScope.aPOData.spare.push($scope.localData);
			$scope.closeModal();
			$rootScope.aPOData.aTestTyre = [];

		}else{
			swal("Please enter quantity","","warning");
		}
	}

});


materialAdmin.controller("tyreIssueCtrl", function ($rootScope, $state, $scope, $uibModal, DateUtils, growlService, spareService,branchService,mechanicService, formValidationgrowlService,Driver, Vehicle, inventoryService, jobCardServices, tyreMasterService, structureMasterService, trailerMasterService, tyreIssueService) {
	$scope.totalValue = 0;
	$scope.aIssuere = ['Mechanic', 'Driver'];
	$scope.aType = ['Horse', 'Trailer'];
	$scope.type = 'Horse';
	$scope.posi={};
	$scope.selectableTyre=[];
	$scope.selectedTyre=[];

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

    $scope.issue_date = $scope.dt;
	$scope.tyreDataForIssue = $rootScope.aIssueTyreData[0];
	/*$scope.tyre_selected=function () {
		console.log($scope.posi);
		/!*$scope.selectedTyre=[];
		for(var j in $scope.posi){
			if($scope.posi[j] && $scope.posi[j]!=null){
				$scope.selectedTyre.push($scope.posi[j]);
			}
		}*!/
		if($scope.aIssueTyreData.indexOf($scope.posi[position]) !==-1){
			$scope.aIssueTyreData[$scope.aIssueTyreData.indexOf($scope.posi[position])].position=position;
		}

	};*/

	$scope.tyre_selected=function (position) {
		console.log($scope.posi);
		 for(var j in $scope.posi) {
			 if ($scope.posi[j]==$scope.posi[position] && j != position) {
				 ///set error
				 swal("Warning!", "Tyre already issued at "+j, "warning");
				 $scope.posi[position]=null;
				 break;
			 }
		 }

	};

	$scope.getTyreList=function (position) {
		var list=[];
		for(var i=0; i<$rootScope.aIssueTyreData.length; i++){
			var issued=false;
			tyre=$rootScope.aIssueTyreData[i];
			for(var j in $scope.posi){
				if(tyre == $scope.posi[j] && j!=position){
					issued=true;
					break;
				}
			}
			if(!issued){
				list.push(tyre);
			}
		}
		return list;
	};

	$scope.disableSelection=function (tyre,position) {
		if(tyre.position && tyre.position!=position){
			return true;
		}
		else{
			return false;
		}
	};

	$scope.onTypSel = function (type) {
		if(type == 'Trailer'){
			if($scope.job) {
				$scope.getVehicleData();
				$scope.vehicle2save=$scope.job.vehicle.associated_vehicle;
			}
		}else {
			if($scope.job) {
				$scope.onVehicleSelect($scope.job);
				$scope.job.structure_name = $scope.job.vehicle.structure_name;
				$scope.vehicle2save=$scope.job.vehicle_number;
				$scope.getTyreIssueForVeh($scope.job.vehicle_number);
			}
		}
	}

	function prepareFilterObject() {
		var myFilter = {};
		if ($scope.bookingType) {
			myFilter.booking_type = $scope.bookingType;
		}
		if ($scope.boe_no) {
			myFilter.boe_no = $scope.boe_no;
		}
		//myFilter = {status:'Open'};

		return myFilter;
	}

	$scope.getNumber = function(num) {
		if (num) {
			return new Array(num);
		}
	};

	($scope.getAllRegVehicles = function () {
		function success(response) {
			if (response && response.data && response.data.data) {
				$scope.regVehicles = response.data.data;
			}
		}

		Vehicle.getOwnedVehicle(success);
	})();

	$scope.getVehicleData = function () {
		function success(response) {
			if (response && response.data && response.data.data) {
				$scope.vehicleData = response.data.data;
				$scope.job.structure_name = $scope.vehicleData[0].structure_name;
				$scope.selectedStructure = $scope.getStructure($scope.job.structure_name);
				$scope.getTyreIssueForVeh($scope.job.vehicle.associated_vehicle);
			}
		}

		var veh = {};
		veh.vehicle_reg_no = $scope.job.vehicle.associated_vehicle;

		Vehicle.getVehicleByNum(veh, success);
	};



	($scope.getAllBranches = function(){
        function success(response){
            if(response && response.data){
                $scope.aBranch = response.data;
            }
        }
        function failure(response){
            console.log(response);
        }
        branchService.getBranchesTrim({all:true},success,failure);
    })();

    $scope.getTaskForJobCard = function(sDT){
	    function succ(data) {
	      $scope.aTaskForJobC = data.data.data;

	    };

	    $scope.selTask = {};
	    $scope.selTask.jobId = sDT;
	    jobCardServices.getSelTask($scope.selTask, succ);
  	}

  	$scope.getAllDriverData = function(){
	  	function success(data) {
			$scope.drivers = data.data;

	  	}

	    Driver.getAllDriversForDropdown({all:true}, success);
  	}

  	$scope.getAllDriverData();

  	$scope.jobCardSelected = function(jobDT){
  		var jobid = jobDT.jobId;
  		$scope.type='Horse';
		$scope.selectedStructure = null;
			$scope.getTaskForJobCard(jobid);
  		//if(jobDT.vehicle_category == 'Truck'){
			$scope.onTypSel($scope.type);
  		//}
  	}

  	$scope.getAllMechanics = function(){
        function success(data) {
          $scope.aMechanic = data.data;
          /*if($scope.aMechanic.length>0){
            for(var s=0;s<$scope.aMechanic.length;s++){
                $scope.aMechanic.push(data.data[s]);
            }
          }*/
        }
        mechanicService.getMechanicsByUser({}, success);
    };
    $scope.getAllMechanics();

	$scope.getAllStructureNames = function () {
		function success(response) {
			if (response.status.toLowerCase() === "ok" && response.data) {
				$scope.structuresObjArr = response.data;
			}
		}

		function failure(response) {
		}

		structureMasterService.getStructureMasters({}, success, failure);
	};
	$scope.getAllStructureNames();

	/*($scope.getAllTrailers = function (reset) {
		$scope.trailers = [];
		$scope.selectedTrailer = {};
		if (reset) {
			$scope.indexSelectedFromList = 0;
		}
		function prepareQueryFilterObj() {
			var queryFilter = {all:true};
			// if($scope.searchValue && $scope.searchValue.length>0){
			// 	queryFilter.name = $scope.searchValue;
			// }
			// queryFilter.skip = $scope.currentPage;
			return queryFilter;
		}

		function success(response) {
			//console.log(data);
			if (response.data && response.data.length > 0) {
				$scope.trailers = response.data;
			}
		}

		function failure(response) {
			console.log(response);
		}

		trailerMasterService.getTrailerMasters(prepareQueryFilterObj(), success, failure);
	})();*/

	($scope.getAllTyreMasters = function (reset) {
		$scope.tyreMasters = [];
		$scope.selectedTyreMaster = {};
		if (reset) {
			$scope.indexSelectedFromList = 0;
		}
		function prepareQueryFilterObj() {
			var queryFilter = {};
			queryFilter.status = 'Stock';
			return queryFilter;
		}

		function success(response) {
			//console.log(data);
			if (response.data && response.data.length > 0) {
				$scope.aTyres = response.data;
			}
		}

		function failure(response) {
			console.log(response);
		}

		tyreMasterService.getTyreMasters(prepareQueryFilterObj(), success, failure);
	})();

	$scope.getTyreIssueForVeh = function (veh_no) {

		function prepareQueryFilterObj() {
			var queryFilter = {};
			queryFilter.vehicle_no = veh_no;
			queryFilter.isReturned = false;
			return queryFilter;
		}

		function success(response) {
			if (response.data) {
				$scope.issuedTyres = response.data;
				console.log('issued tyres', $scope.issuedTyres);
				$scope.issued_positions = [];
				$scope.issued_tyres = [];
				for (var i = 0; i < $scope.issuedTyres.length; i++) {
					$scope.issued_positions.push($scope.issuedTyres[i].association_position);
					$scope.issued_tyres.push($scope.issuedTyres[i].tyre_number);
				}
				console.log('issued_positions', $scope.issued_positions);
			}
		}

		function failure(response) {
			console.log(response);
		}

		tyreIssueService.get(prepareQueryFilterObj(), success, failure);
	};

	$scope.onVehicleSelect = function (veh) {
		console.log('selected veh', JSON.stringify(veh), $scope.structuresObjArr);
		$scope.selectedStructure = $scope.getStructure(veh.vehicle.structure_name);

	};

	$scope.getStructure = function(str) {
		for(var i = 0; i < $scope.structuresObjArr.length; i++) {
			if(str == $scope.structuresObjArr[i].structure_name) return $scope.structuresObjArr[i];
		}
		return null;
	};

	$scope.onTyreClicked = function (frontOrRear, axle, leftOrRight, position) {
		var code = frontOrRear + axle + leftOrRight + position;
		console.log('onTyreClicked', code);
		if ($scope.issued_positions.indexOf(code) > -1) return;
		else $scope.association_position = code;
	};

	$scope.getAllJobCard = function () {
		function success(data) {
			if (data.data && data.data.data && data.data.data.length > 0) {
				$scope.aJobCards = data.data.data;
				if($scope.aJobCards && $scope.aJobCards.length>0){
					for(var f=0;f<$scope.aJobCards.length;f++){
						$scope.aJobCards[f].idVehicle = $scope.aJobCards[f].jobId+ '--' + $scope.aJobCards[f].vehicle_number;
					}
				}
			}
		};
		function failure(res) {
			console.log("fail: ", res);
			swal("Some error with GET Job Card.", "", "error");
		}

		var oFilter = prepareFilterObject();
		jobCardServices.getAllJobCardsFull(oFilter, success, failure);
	};
	$scope.getAllJobCard();

	$scope.issueClick = function(selection){
		if(selection == 'Driver'){
			if($scope.drivers && $scope.drivers.length>0){
				for(var d=0;d<$scope.drivers.length;d++){
					if($scope.drivers[d].name == $scope.job.driver_name){
						$scope.driver = $scope.drivers[d];
					}
				}
			}
		}
	}


	function succInward(response) {
		if (response.data && response.data.data) {
			swal("Saved!", response.data.message, "success");
		}
	}

	function failInward(response) {
		swal("Error!", "", "error");
	}

	$scope.tyreToIssue={};
	$scope.tyre_id=[];
	$scope.tyre_number=[];
	$scope.reformatTyreToIssue=function () {
		for(var j in $scope.posi){
			if($scope.posi[j]!=null){
				$scope.tyreToIssue[j]={};
				$scope.tyreToIssue[j]._id=$scope.posi[j]._id;
				$scope.tyreToIssue[j].tyre_number=$scope.posi[j].tyre_number;
				$scope.tyre_id.push($scope.tyreToIssue[j]._id);
				$scope.tyre_number.push($scope.tyreToIssue[j].tyre_number);
			}
		}
	};



	$scope.addTyreIssue = function () {
		function succIssue(response) {
			if (response.data) {
				$rootScope.response = response.data;
				var modalInstance = $uibModal.open({
		            templateUrl: 'maintenance/views/tyreIssueSlipDownload.html',
		            controller: 'tyreIssueSlipDwnPopUpCtrl'
		        });
				swal("Saved!", response.data.message, "success");
				$state.go('masters_tyre_management.tyre_master');
			}
			swal("Saved!", response.message, "success");
			$state.go('masters_tyre_management.tyre_master');
		}

		function failIssue(response) {
			swal("Error!", response.message, "error");
		}

		if($scope.issued_to == 'Driver'){
			$scope._id = $scope.driver && $scope.driver._id;
			$scope.name =  $scope.driver && $scope.driver.name;
		}else if($scope.issued_to == 'Mechanic'){
			$scope._id = $scope.mechanic && $scope.mechanic._id;
			$scope.name =$scope.mechanic &&  $scope.mechanic.full_name;
		}

		//if($scope.job.vehicle_category == 'Truck'){
			$scope.vehicle = {};
			$scope.vehicle.structure_name =  $scope.job && $scope.job.structure_name;
			$scope.vehicle.vehicle_reg_no =  $scope.job && $scope.job.vehicle_number;

		if(!($scope.job && $scope.job.jobId)){
				swal("Error!", "Please Select Job", "error");
				return;
	    	}
		if(!($scope.task && $scope.task.taskId)){
			swal("Error!", "Please Select Task", "error");
			return;
		}
		if(!($scope.issued_odometer)){
			swal("Error!", "Odometer  Reading is Mandatory", "error");
			return;
		}
		if(!$scope.branch){
			swal("Error!", "Branch is mandatory", "error");
			return;
		}
		if(!$scope.issued_to){
			swal("Error!", "Issue to  is mandatory", "error");
			return;
		}

			if(!($scope.selectedStructure)){
				swal("Error!", " Structure  not found ! Please select Different Job Card Or Update that Job Card", "error");
				return;
			}



		//}
		$scope.reformatTyreToIssue();
		if(Object.keys($scope.tyreToIssue).length === 0){
			swal("Error!", "please  Select tyre	", "error");
			return;
		}
		var reqObj = {
			jobId:  $scope.job && $scope.job.jobId,
			taskId: $scope.task && $scope.task.taskId,
			branch: $scope.branch && $scope.branch.name,
			branchName: $scope.branch && $scope.branch.name,
			branchId :$scope.branch && $scope.branch._id,
			allTyre_number: $scope.tyre_number,
			vehicle_no: $scope.vehicle2save ,
			structure_name: $scope.vehicle && $scope.vehicle.structure_name ,
			vehicle_type: $scope.type,
			user_type: $scope.issued_to,
			issued_by_employee_code: $scope._id,
			issued_by_employee_name: $scope.name,
			allTyre_id: $scope.tyre_id,
			remark: $scope.iRemark,
			issued_odometer: $scope.issued_odometer,
			allTyres:$scope.tyreToIssue
		};

		console.log('tyre', $scope.tyre);

		console.log('ReqObj', reqObj);

		tyreIssueService.issue(reqObj, succIssue, failIssue);

	};

});

materialAdmin.controller("tyreIssueSlipDwnPopUpCtrl", function ($rootScope, $scope, $state,$window,$uibModalInstance) {

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go('masters_tyre_management.tyre_master');
    };

    $scope.downloadPDF = function(){
        $window.open($rootScope.response.url, '_blank');
    };

});

materialAdmin.controller("returnTyrePopUpCtrl", function ($rootScope, $scope, $uibModalInstance, $localStorage, thatTyre, formValidationgrowlService, spareService, maintenanceVendorService_, tyreIssueService, toolService, Driver) {
	$scope.aToolCode = [];
	$scope.aPO = [];
	$scope.aVendors = [];
	$scope.aTool = [];
	$scope.data = {};
	$scope.driverData = {};
	$scope.MechanicData = {};

	$scope.aIssueCat = ["mechanic", "driver"];

	function prepareFilterObject() {
		var myFilter = {};
		if ($scope.bookingType) {
			myFilter.booking_type = $scope.bookingType;
		}
		if ($scope.boe_no) {
			myFilter.boe_no = $scope.boe_no;
		}

		return myFilter;
	}

	$scope.tyre = angular.copy(thatTyre);
	$scope.tyre.return_by_type = 'mechanic';

	$scope.getIssueById = function () {
		function successUser(response) {
			if (response.data && response.data.data && response.data.data.length > 0) {
				$scope.objIssuedTyre = response.data.data[0];

			}
		}

		function failureUser(response) {
			console.log(response);
		}

		tyreIssueService.getIssuedTyre({issue_id: $scope.tyre.issue_id}, successUser, failureUser);
	}
	$scope.getIssueById();

	if ($scope.tyre.tyre_category == 'new' && $scope.objIssuedTyre.association_position == 'SPA0') {
		$scope.aReturnStatus = ['new', 'old', 'scrapped'];
	} else {
		$scope.aReturnStatus = ['old', 'scrapped'];
	}

	$scope.closeModal = function () {
		$uibModalInstance.dismiss('cancel');
	};


	($scope.getUserByCat = function () {
		function successUser(response) {
			if (response.data && response.data.data.length > 0) {

				$scope.aUsers = response.data.data;
				if($scope.tyre.return_by_type == 'mechanic')
					$scope.MechanicData  = $scope.aUsers;

				if($scope.tyre.return_by_type == 'driver')
					$scope.driverData= $scope.aUsers;
			}
		}

		function failureUser(response) {
			console.log(response);
		}

		toolService.getAllUser({"mechanic": true,"supervisor": true,"all": true}, successUser, failureUser);
	})();

	$scope.getDriverByCat = function(){
		function successUser(response) {
			if (response.data && response.data.data.length > 0) {

				$scope.aUsers = response.data.data;
				if($scope.tyre.return_by_type == 'mechanic')
					$scope.MechanicData  = $scope.aUsers;

				if($scope.tyre.return_by_type == 'driver')
					$scope.driverData= $scope.aUsers;
			}
		}

		Driver.getAllDriversForList({},successUser);
	};

	/*$scope.getAllJobCard = function(){
	 function success(data) {
	 if(data.data && data.data.data && data.data.data.length>0){
	 $scope.aJobCards = data.data.data;
	 }
	 };
	 function failure(res){
	 console.log("fail: ",res);
	 swal("Some error with GET Job Card.","","error");
	 }
	 var oFilter = prepareFilterObject();
	 jobCardServices.getAllJobCards(oFilter,success,failure);
	 };
	 $scope.getAllJobCard();*/

	function success(res) {
		if (res && res.data && (res.status == "OK")) {
			swal("Success",res.message,"success");
			$uibModalInstance.close(res);
		} else {
			$uibModalInstance.dismiss(res);
		}
	}

	function failure(res) {
		$uibModalInstance.dismiss(res);
	}

	$scope.returnTyre = function (tyre) {
		tyreIssueService.return(tyre, success, failure);
	}

	$scope.getCatagoryList = function(e){

		function isEmpty( obj ) {
			for ( var prop in obj ) {
				return false;
			}
			return true;
		}

		if(e=='mechanic'){

			if(isEmpty($scope.MechanicData))
				$scope.getUserByCat();
			else
				$scope.aUsers = $scope.MechanicData;

		}else if(e=='driver'){

			if(isEmpty($scope.driverData)){
				$scope.getDriverByCat();
			}else
				$scope.aUsers = $scope.driverData;
		}
	};
});

materialAdmin.controller("tyreRetreatedCtrl", function ($rootScope, $scope, $uibModal,$localStorage,clientService, DateUtils,$state, growlService, spareService, formValidationgrowlService, Vehicle, inventoryService, jobCardServices, tyreMasterService, structureMasterService, trailerMasterService) {
	$scope.totalValue = 0;
    $scope.aMasterSts = ['Returned' , 'Issued'];

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

    $scope.getTyreMaster = function () {
        function successUser(response) {
            if (response.data) {
                $scope.aTyres = response.data;
            }
        }

        function failureUser(response) {
            console.log(response);
        }


        tyreMasterService.getAllTyre({}, successUser, failureUser);
    }
    $scope.getTyreMaster();

    function prepareFilterObject() {
        var queryFilter = {};
        if($scope.returned == 'Returned'){
            queryFilter.returned = true;
        }else if($scope.returned == 'Issued'){
            queryFilter.returned = false;
        }
        if($scope.tyre_number){
            queryFilter.tyre_number = $scope.tyre_number;
        }
        return queryFilter;
    }

	$scope.getAllRetrIssueTyre = function () {
		function success(data) {
			if (data.data) {
				$scope.aRetreated = data.data;
                $scope.selectTyreReIssue(0);
			}
		};
		function failure(res) {
			console.log("fail: ", res);
			swal("Some error with GET Issue Retreated.", "", "error");
		}

		var oFilter = prepareFilterObject();
		tyreMasterService.getAllReIssueTyr(oFilter, success, failure);
	};
	$scope.getAllRetrIssueTyre();

    $scope.selectTyreReIssue = function (index) {
        $scope.selectedTyreIssue = angular.copy($scope.aRetreated [index]);
        $scope.indexSelectedFromList = index;
        setTimeout(function () {
            var listItem = $($('.full-item')[index]);
            listItem.siblings().removeClass('grn');
            listItem.addClass('grn');
        }, 0);
    };

    $scope.tyreIssuePop = function() {
        $rootScope.returnClick = false;
        var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/tyreIssuePopUp.html',
            controller: 'tyreIssuePopUpCtrl'
        });

        modalInstance.result.then(function () {
            $state.reload();
        }, function (data) {
            if (data != 'cancel') {
                swal("Oops!", data.message, "error")
            }
        });
    }

    $scope.tyreReturnPop = function() {
        $rootScope.returnClick = true;
        var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/tyreReturnPopUp.html',
            controller: 'tyreReturnPopUpCtrl',
            resolve: {
                thatTyre: function () {
                    return $scope.selectedTyreIssue;
                }
            }
        });

        modalInstance.result.then(function () {
            $state.reload();
        }, function (data) {
            if (data != 'cancel') {
                swal("Oops!", data.message, "error")
            }
        });
    }

    function succClient(res){
        $scope.clientData = res.data[0];
        var client_address = $scope.clientData && $scope.clientData.client_address;
        $scope.clientData.logo_url = URL.file_server+ "users/"+$scope.clientData.clientId +"/logo.jpg";
        $scope.clientData.address = (client_address.line1?client_address.line1:"")+" "+(client_address && client_address.line2?client_address.line2:"")+" "+
	        (client_address && client_address.district?client_address.district:"")+" "+(client_address && client_address.city?client_address.city:"")+" "+(client_address && client_address.state?client_address.state:"")+" "+
	        (client_address && client_address.country?client_address.country:"");
    }
    (function(){
        if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.clientId){
            clientService.getClientByID({clientId:$localStorage.ft_data.userLoggedIn.clientId},succClient)
        }
    })();

    $scope.previewReIssueSlip = function(tData, index){
		$rootScope.retData = tData;
		$rootScope.retData.client_full_name = $scope.clientData &&  $scope.clientData.client_full_name;
    	$rootScope.retData.client_address = $scope.clientData &&  $scope.clientData.address;
		var modalInstance = $uibModal.open({
            templateUrl: 'maintenance/views/retIssueReturnPreview.html',
            controller: 'retIssueReturnPreviewPopUpCtrl'
        });
	}

});

materialAdmin.controller("retIssueReturnPreviewPopUpCtrl", function ($rootScope, $scope, $state,$window, $localStorage, formValidationgrowlService,$uibModalInstance,tyreIssueService) {

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go('masters_tyre_management.retreated');
    };

    /*$scope.getSelTyreIssue = function () {
		function success(response) {
			if (response.data.status === "OK" && response.data) {
				$scope.tyreDataNew = response.data.data[0];
			}
		}

		function failure(response) {
		}

		tyreIssueService.getIssuedTyreDetail($scope.tyreData, success, failure);
	};
	$scope.getSelTyreIssue();*/

    $scope.downloadPDF = function(){

    	function success(response) {
			if (response.url) {
				$window.open(response.url, '_blank');
			}
		}

		function failure(response) {
		}

		tyreIssueService.downloadRetreadIssueSlip($rootScope.retData, success, failure);
    };
});

materialAdmin.controller("tyreIssuePopUpCtrl", function ($rootScope, $scope, $uibModalInstance, DateUtils, $localStorage, formValidationgrowlService, spareService, maintenanceVendorService_, toolService, tyreMasterService) {

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

    function prepareFilterObject() {
        var myFilter = {};
        if ($scope.bookingType) {
            myFilter.booking_type = $scope.bookingType;
        }
        if ($scope.boe_no) {
            myFilter.boe_no = $scope.boe_no;
        }

        return myFilter;
    }

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getTyreMaster = function () {
        function successUser(response) {
            if (response.data && response.data.length > 0) {
                $scope.aTyres = response.data;
            }
        }

        function failureUser(response) {
            console.log(response);
        }


        tyreMasterService.getAllTyreRepoBin({all:true}, successUser, failureUser);
    }
    $scope.getTyreMaster();

    $scope.getVendors = function () {
        function success(response) {
            if (response.data && response.data.length > 0) {
                $scope.aVendors = response.data;
            }
        }

        function failure(response) {
            console.log(response);
        }


        maintenanceVendorService_.getMaintenanceVendorsAll({},success,failure);
    }
    $scope.getVendors();


    $scope.issue = function (data) {
        function success(res) {
            if (res && res.data && (res.status == "OK")) {
                $uibModalInstance.close(res);
                swal("Saved!", res.message, "success");
            } else {
                $uibModalInstance.dismiss(res);
            }
        }

        function failure(res) {
            $uibModalInstance.dismiss(res);
        }

        var toSend = data;
        toSend.vendor_name = toSend.vendor.name;
        toSend.vendorId = toSend.vendor.vendorId;

        delete toSend.vendor;

        tyreMasterService.issueTyreRetreat(toSend, success, failure);
    }
});

materialAdmin.controller("tyreReturnPopUpCtrl", function ($rootScope, $scope, $uibModalInstance, DateUtils,thatTyre, $localStorage, formValidationgrowlService, spareService, maintenanceVendorService_, toolService, tyreMasterService) {

    $scope.aSts = ["Repository Bin","Stock"];
    $scope.aRetStatus = ["Retreaded", "Failed"];
    $scope.tyre = thatTyre;
    $scope.failed = true;
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

    $scope.retStatusSel = function(sel){
    	if(sel == 'Failed'){
    		$scope.failed = false;
    	}else{
    		$scope.failed = true;
    	}
    }

    function prepareFilterObject() {
        var myFilter = {};
        if ($scope.bookingType) {
            myFilter.booking_type = $scope.bookingType;
        }
        if ($scope.boe_no) {
            myFilter.boe_no = $scope.boe_no;
        }

        return myFilter;
    }

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.return = function (data) {
        function success(res) {
            if (res && res.data && (res.status == "OK")) {
                $uibModalInstance.close(res);
                swal("Return!", res.message, "success");
            } else {
                $uibModalInstance.dismiss(res);
            }
        }

        function failure(res) {
            $uibModalInstance.dismiss(res);
        }

        var toSend = data;
        //toSend.vendor_name = toSend.vendor.name;
        //toSend.vendorId = toSend.vendor.vendorId;

        //delete toSend.vendor;

        tyreMasterService.returnTyreRetreat(toSend, success, failure);
    }
});
