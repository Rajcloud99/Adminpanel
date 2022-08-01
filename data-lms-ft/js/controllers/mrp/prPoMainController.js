materialAdmin.controller("prController", function($rootScope, $scope,$state,$localStorage,$modal,$uibModal,growlService,clientService,spareService,formValidationgrowlService,inventoryService, billsService,ReportService,maintenanceVendorService_) {
	var lastFilter;
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.itemsPerPage = 15;

	$scope.aStatus = ['New','Approved','Processed' ];

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

	function prepareFilterObject(isPagination){
		var allowedKey = ['prnumber','created_by','approved_by','status'];
		var myFilter = {};
		for (var i = 0; i < allowedKey.length; i++) {
			if($scope[allowedKey[i]]){
				myFilter[allowedKey[i]] = $scope[allowedKey[i]];
			}
		}
		if(isPagination && $scope.currentPage){
			myFilter.skip = $scope.currentPage;
		}
		if($scope.findText){
			myFilter.find = $scope.findText;
		}
		if($scope.status){

		}else{
			myFilter.more_status = JSON.stringify(["New","Approve"]);
			delete myFilter.status;
		}
		return myFilter;
	};

	$scope.clearSearch = function(val) {
		switch (val) {
			case "findText":
				delete $scope.findText;
				$scope.getAllPr();
				break;
			case "vehicle":
				delete $scope.vehicle_number;
				$scope.getAllPr();
				break;
			default:
				break;
		}
	}

	$scope.searchAll = function () {
		$scope.getAllPr();
	}

	$scope.getAllPr = function(isPagination) {
		function success(data) {
			$scope.aPrList = data.data.data;
			$scope.total_pages = data.data.pages;
			$scope.totalItems = 15*data.data.pages;
			/*if($scope.aPrList.length>0){
                for(var t=0;t<$scope.aPrList.length;t++){
                    $scope.aPrList[t].quantity = 0;
                }
            }*/
		}
		function failure(data) {
			//console.log('get PR failure!!!');
		}
		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		spareService.getAllPr(oFilter, success, failure);
	};
	$scope.getAllPr();

	$scope.pageChanged = function() {
		$scope.getAllPr(true);
	};

	$scope.getAllRequestedUser = function(){
		function succ1(data) {
			$scope.aUsers = data.data.data;
		}
		function fail1(data) {
			//console .log('Error to get Users !!!')
		}

		spareService.getAllRequestedUserService({}, succ1,fail1);
	};
	$scope.getAllRequestedUser();

	$scope.getAllPOapprover = function(){
		function succ(data) {
			$scope.aApprover = data.data.data;
		}

		spareService.getAllPOapproverServ({}, succ);
	};
	$scope.getAllPOapprover();

	$scope.editPO = function(data, index){
		data.isEditPO = true;
		$rootScope.editPOdata = data;
		$state.go('mrp_pr_po.PrPo');
	}

	$scope.previewPR = function(data, index) {
		$rootScope.prData = data;
		$rootScope.prData.client_full_name = $scope.clientData && $scope.clientData.client_full_name;
		$rootScope.prData.client_address = $scope.clientData &&  $scope.clientData.address;
		var modalInstance = $modal.open({
			templateUrl: 'maintenance/views/spareMaster/previewPR.html',
			controller: 'previewPRcontroller'
		});
	}

	$scope.approvePR = function(data, index) {
		function succ(data) {
			var msggg = data.data.message;
			swal(msggg,"","success");
			$scope.getAllPr();
		}
		function failure(data) {
			var msggg = data.data.message;
			swal(msggg,"","warning");
		}

		inventoryService.approvePRservice(data, succ, failure);
	}

	$scope.processPR = function(dt,i){
		function succ(data) {
			var msggg = data.data.message;
			swal(msggg,"","success");
			$scope.getAllPr();
		}
		function failure(data) {
			var msggg = data.data.message;
			swal(msggg,"","warning");
		}

		inventoryService.processPRservice(dt, succ, failure);
	}

	$scope.downloadPR = function(data, index,excel) {
		data.exportToExcel = excel;
		data.pr_created_by_name = data.created_by_name;
		billsService.getPRPdf(data, function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	};
	$scope.downloadReport = function(){
		ReportService.getPoReport(lastFilter, function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	}

	$scope.actionWithVendorData = function(data, index, action){
		maintenanceVendorService_.getMaintenanceVendors({vendorId:data.vendorId},function(response){
			if(response){
				var vendorData = response.data[0];
				data.supplier_address = vendorData.address.line1+" "+vendorData.address.line2+" "+vendorData.address.city+" "+vendorData.address.district+" "+vendorData.address.state+" "+vendorData.address.country;
				data.telephone = vendorData.prim_contact_no;
				data.email_id = vendorData.email;
				//data.supplier_site
				action(data, index)
			}
		})
	}

	$scope.addNewPr = function() {
		$state.go('mrp_pr_po.prAdd');
	}
	$scope.editPR = function(objPR,i) {
		$rootScope.updatePRdata = objPR;
		$state.go('mrp_pr_po.prEdit');
	}
});

materialAdmin.controller("previewPRcontroller", function($rootScope, $scope, $uibModalInstance) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	//console.log($rootScope.prData);

	$scope.prLocalData = $rootScope.prData;

});

materialAdmin.controller("PrCtrl", function($rootScope, $scope,DateUtils,$uibModal,growlService,inventoryService) {

	$scope.getAllPr = function() {
		function success(data) {
			$scope.aPrList = data.data.data;
			if($scope.aPrList.length>0){
				for(var t=0;t<$scope.aPrList.length;t++){
					$scope.aPrList[t].quantity = 0;
				}
			}
		}
		inventoryService.getPrServ({}, success);
	};

	$scope.getAllPr();  // get all PR


	$scope.aSendSelData = [];
	$scope.thisSel = function(data ,index){
		/*if(data.selected){
            $scope.aSendSelData.push(data);
        }else{
            $scope.aSendSelData.splice($scope.lst.indexOf(data),1);
        }*/
	}

	$scope.genertePR = function(){
		function successPost(response){
			if(response && response.data){
				$rootScope.prResData = response.data.data;
				swal("PR Generated Successfully","","success");
				var modalInstance = $uibModal.open({
					templateUrl: 'views/mrp/prPo/addPRpop.html',
					controller: 'addPrCtrl'
				});
			}
		}
		function failure(res){
			swal("Some error with PR generation","","error");
		}

		$scope.objPrData = {};
		$scope.objPrData.spares = [];
		if($scope.aPrList.length>0){
			for(var t=0; t<$scope.aPrList.length>0;t++){
				if($scope.aPrList[t].selected){
					$scope.objPrData.spares.push($scope.aPrList[t]);
				}
			}
		}
		$scope.objPrData.homId = $rootScope.homId;
		inventoryService.generatePRservice($scope.objPrData, successPost,failure);

		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/prPo/addPRpop.html',
			controller: 'addPrCtrl'
		});
	};

});

materialAdmin.controller("prAddController", function($rootScope, $scope,growlService,$state,DateUtils,spareService,inventoryService,branchService) {

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

	$scope.getAllBranches = function(reset){
		$scope.branches=[];
		function prepareQueryFilterObj(){
			var queryFilter = {};
			queryFilter.all = true;
			return queryFilter;
		}
		function success(response){
			if(response.data && response.data.length > 0){
				$scope.aBranch = response.data;
			}
		}
		function failure(err){
			//console.log(response);
		}
		branchService.getAllBranches(prepareQueryFilterObj(),success,failure);
	};
	$scope.getAllBranches();

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.format = DateUtils.format;
	//************* New Date Picker for multiple date selection in single form ******************
	$scope.aSpareList = [];
	$scope.aPriority = ['High', 'Low','Medium'];
	$scope.priority = 'Medium';
	$scope.needed_date = $scope.dt;

	$scope.getAllPRapprover = function(){
		function succ(data) {
			$scope.aApprover = data.data.data;
		}

		spareService.getAllPRapproverServ({}, succ);
	};
	$scope.getAllPRapprover();

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

	$scope.changeItem = function(item){
		function success(data) {
			if(data.data &&data.data.data.length>0){
				$scope.previousRate =  data.data.data[0].rate_per_piece || 0;
				$scope.previousQty =  data.data.data[0].quantity || 0;
				$scope.previousVendorName =  data.data.data[0].vendor_name || 0;
				$scope.previousDate =  data.data.data[0].created_at || 0;
			}else{
				$scope.previousRate =  0;
				$scope.previousQty =  0;
				$scope.previousVendorName =  0;
				$scope.previousDate =  new Date();
			}
		}
		function fail(data) {
			swal('Last purchase detail fail',"","warning")
		}

		var data={};
		data.spare_code = item.code;

		spareService.getLastPurchaseDetail(data, success,fail);

		//*************** get qty service **********//
		function success1(data) {
			if(data.data && data.data.data && data.data.data.availableQty){

				$scope.inStockQty =  data.data.data.availableQty || 0;
			}else{
				$scope.inStockQty = 0;
			}

		}
		function fail1(data) {
			swal('First time purchase',"","warning");
		}

		var data={};
		data.code = item.code;

		spareService.getInvByCode(data, success1,fail1);
	}


	$scope.addSpareInList = function(){
		var sItem = {};
		sItem.part_ref = $scope.item._id;
		sItem.spare_name_code = $scope.item.spare_name_code;
		sItem.name = $scope.item.name;
		sItem.code = $scope.item.code;
		sItem.category_name = $scope.item.category_name;
		sItem.category_code = $scope.item.category_code;
		sItem.type = $scope.item.type;
		sItem.quantity = $scope.quantity;
		sItem.previousRate = $scope.previousRate;
		sItem.previousQty = $scope.previousQty;
		sItem.previousVendorName = $scope.previousVendorName;
		sItem.previousDate = $scope.previousDate;
		sItem.inStockQty = $scope.inStockQty;
		sItem.uom = $scope.item.uom;
		sItem.priority = $scope.priority;
		sItem.needed_date = $scope.needed_date;
		sItem.vehicle_make = $scope.vehicle_make;
		sItem.brand = $scope.brand;
		sItem.remark = $scope.remark;
		var already = false;
		if($scope.aSpareList && $scope.aSpareList.length>0){
			for(var s=0;s<$scope.aSpareList.length;s++){
				if($scope.aSpareList[s].code == sItem.code){
					already = true;
					break;
				}
			}
		}
		if(already){
			swal('Spare is already available...',"","warning");
		}else{
			$scope.aSpareList.push(sItem);
		}
	}

	$scope.removeItem = function(i){
		$scope.aSpareList.splice(i, 1);
	}

	$scope.prAddClick = function(){
		function succ(data) {
			//$scope.resDataIssue = data.data;
			var msggg = data.data.message;
			swal(msggg,"","success");
			$state.go('mrp_pr_po.pr');
		}

		$scope.sendData = {};
		$scope.sendData.branch = $scope.branch._id;
		$scope.sendData.branchId = $scope.branch._id;
		$scope.sendData.branchName = $scope.branch.name;
		//$scope.sendData.priority = $scope.priority;
		$scope.sendData.spare = $scope.aSpareList;
		$scope.sendData.approver = {};
		$scope.sendData.approver._id = $scope.approver._id;
		$scope.sendData.approver.name = $scope.approver.full_name;

		inventoryService.generatePRservice($scope.sendData, succ);

	}

	$scope.backList = function(){
		$state.go('mrp_pr_po.pr');
	}


});

materialAdmin.controller("prEditController", function($rootScope, $scope,growlService,$state,DateUtils,spareService,inventoryService) {

	$rootScope.updatePRdata;
	//console.log($rootScope.updatePRdata);
	if($rootScope.updatePRdata){

	}else{
		swal('warning','Context lost !!!','warning');
		$rootScope.redirect('#!/mrp_pr_po/pr');
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
	$scope.aPriority = ['High', 'Low','Medium'];
	$scope.aSpareList = $rootScope.updatePRdata.spare;
	if($scope.aSpareList && $scope.aSpareList.length>0){
		for(var j=0;j<$scope.aSpareList.length;j++){
			if($scope.aSpareList[j].code && $scope.aSpareList[j].name){
				$scope.aSpareList[j].spare_name_code = $scope.aSpareList[j].name + '/ '+ $scope.aSpareList[j].code;
			}
		}
	}
	$scope.priority = $rootScope.updatePRdata.priority;
	$scope.needed_date = $rootScope.updatePRdata.spare[0] && $rootScope.updatePRdata.spare[0].needed_date;

	$scope.getAllPRapprover = function(){
		function succ(data) {
			$scope.aApprover = data.data.data;
			if($scope.aApprover && $scope.aApprover.length>0){
				for(var a=0;a<$scope.aApprover.length;a++){
					if($scope.aApprover[a]._id === $rootScope.updatePRdata.approver._id){
						$scope.approver = $scope.aApprover[a];
					}
				}
			}
		}

		spareService.getAllPRapproverServ({}, succ);
	};
	$scope.getAllPRapprover();

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

	$scope.changeItem = function(item){
		function success(data) {
			if(data.data &&data.data.data.length>0){
				$scope.previousRate =  data.data.data[0].rate_per_piece || 0;
				$scope.previousQty =  data.data.data[0].quantity || 0;
				$scope.previousVendorName =  data.data.data[0].vendor_name || '';
				$scope.previousDate =  data.data.data[0].created_at || 0;
			}else{
				$scope.previousRate =  0;
				$scope.previousQty =  0;
				$scope.previousVendorName =  '';
				$scope.previousDate =  new Date();
			}
		}
		function fail(data) {
			swal('Last purchase detail fail',"","warning")
		}

		var data={};
		data.spare_code = item.code;

		spareService.getLastPurchaseDetail(data, success,fail);

		//*************** get qty service **********//
		function success1(data) {
			if(data.data && data.data.data && data.data.data.availableQty){

				$scope.inStockQty =  data.data.data.availableQty || 0;
			}else{
				$scope.inStockQty = 0;
			}

		}
		function fail1(data) {
			swal('First time purchase',"","warning");
		}

		var data={};
		data.code = item.code;

		spareService.getInvByCode(data, success1,fail1);
	}


	$scope.addSpareInList = function(){
		var sItem = {};
		console.log($scope.item);
		sItem.part_ref = $scope.item._id;
		sItem.spare_name_code = $scope.item.spare_name_code;
		sItem.name = $scope.item.name;
		sItem.code = $scope.item.code;
		sItem.type = $scope.item.type;
		sItem.category_name = $scope.item.category_name;
		sItem.category_code = $scope.item.category_code;
		sItem.type = $scope.item.type;
		sItem.previousRate = $scope.previousRate;
		sItem.previousQty = $scope.previousQty;
		sItem.quantity = $scope.quantity;
		sItem.previousVendorName = $scope.previousVendorName;
		sItem.previousDate = $scope.previousDate;
		sItem.inStockQty = $scope.inStockQty;
		sItem.uom = $scope.item.uom;
		sItem.priority = $scope.priority;
		sItem.needed_date = $scope.needed_date;
		sItem.vehicle_make = $scope.vehicle_make;
		sItem.brand = $scope.brand;
		sItem.remark = $scope.remark;
		var already = false;
		if($scope.aSpareList && $scope.aSpareList.length>0){
			for(var s=0;s<$scope.aSpareList.length;s++){
				if($scope.aSpareList[s].code === sItem.code){
					already = true;
					break;
				}
			}
		}
		if(already){
			swal('Spare is already available...',"","warning");
		}else{
			$scope.aSpareList.push(sItem);
		}
	}

	$scope.removeItem = function(i){
		$scope.aSpareList.splice(i, 1);
	}

	$scope.prUpdateClick = function(){
		function succ(data) {
			//$scope.resDataIssue = data.data;
			var msggg = data.data.message;
			swal(msggg,"","success");
			$state.go('mrp_pr_po.pr');
		}


		$scope.upData = $rootScope.updatePRdata;
		//$scope.upData.priority = $scope.priority;
		$scope.upData.spare = $scope.aSpareList;
		$scope.upData.approver = {};
		$scope.upData.approver._id = $scope.approver._id;
		$scope.upData.approver.name = $scope.approver.full_name;
		if($scope.upData && $scope.upData._id){
			inventoryService.updatePRservice($scope.upData, succ);
		}else{
			swal('warning','Context lost !!!','warning');
			$rootScope.redirect('#!/mrp_pr_po/pr');
		}

	}
	$scope.backList = function(){
		$state.go('mrp_pr_po.pr');
	}


});

materialAdmin.controller("PrPoCntrl", function($rootScope, $scope,$modal,$window,$state,$uibModal,DateUtils,growlService,formValidationgrowlService,jobCardServices,spareService,mechanicService,branchService) {
	$scope.aAddedTask = [];

	$scope.aPayTerms = [
		'100% AGAINST DELIVERY',
		'100% ADVANCE',
		'CASH PAID',
		'50% ADVANCE, BALANCE AGAINST DELIVERY',
		'50% ADVANCE, BALANCE PRIOR TO DISPATCH OF MATERIAL.',
		'100% WITHIN 3 TO 4 WEEKS',
		'100% WITHIN 1 WEEK AFTER DELIVERY'
	];
	$scope.aFreightTerms = [
		'INCLUSIVE',
		'FREIGHT EXTRA AS ACTUAL',
		'FREIGHT TO BE PAID',
		'FREIGHT TO BE BILLED'
	];

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

	$scope.changeDate = function(){
		//console.log($scope.dateSearch);
		function succ(data) {
			$scope.aPR = data.data.data;
		}
		$scope.filter = {};
		$scope.filter.date = $scope.dateSearch;
		spareService.getPrByDate($scope.filter, succ);
	}

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
	$rootScope.getAllPrList = function(){
		function succ(data) {
			$scope.aPR = data.data.data;
		}
		var obj123 = {};
		obj123.status = 'Approved';
		spareService.getAllPrAll(obj123, succ);
	};
	$rootScope.getAllPrList();


	// console.log($localStorage.ft_data.userLoggedIn.branch);
	$scope.getAllBranches = function(reset){
		function prepareQueryFilterObj(){
			var queryFilter = {};
			queryFilter.all = true;
			return queryFilter;
		}
		function success(response){
			if(response.data && response.data.length > 0){
				$scope.aBranch = response.data;
			}
		}
		function failure(err){
			//console.log(response);
		}
		branchService.getAllBranches(prepareQueryFilterObj(),success,failure);
	};
	$scope.getAllBranches();

	$rootScope.getAllPO = function(){
		function succ(data) {
			$scope.aPO = data.data.data;
			if($rootScope.editPOdata && $rootScope.editPOdata.isEditPO === true){
				for(var p=0;p<$scope.aPO.length;p++){
					if($scope.aPO[p].ponumder === $rootScope.editPOdata.ponumder){
						$scope.poNoSel = $scope.aPO[p];
						$scope.changePO($scope.poNoSel);
					}
				}
			}
		}

		spareService.getPOserv({status:'Unapproved'}, succ);
	};
	$rootScope.getAllPO();

	$rootScope.getAllPOvendor = function(){
		function succ(data) {
			$scope.aPOvendor = data.data.data;

			if($scope.aPOvendor && $scope.aPOvendor.length>0 && $scope.dataPObyChange && $scope.dataPObyChange.vendorId){
				for(var v=0;v<$scope.aPOvendor.length;v++){
					if($scope.aPOvendor[v].vendorId === $scope.dataPObyChange.vendorId){
						$scope.vendorSel = $scope.aPOvendor[v];   //set vendor by po change
					}
				}
			}
		}

		spareService.getAllPOvendorServ({}, succ);
	};
	$rootScope.getAllPOvendor();

	$rootScope.getAllPOapprover = function(){
		function succ(data) {
			$scope.aApprover = data.data.data;
		}

		spareService.getAllPOapproverServ({}, succ);
	};
	$rootScope.getAllPOapprover();

	if($rootScope.editPOdata && $rootScope.editPOdata.isEditPO === true){
		$scope.promiseDate = moment($rootScope.editPOdata.promised_date).format('LLL');
		$scope.neededDate = moment($rootScope.editPOdata.needed_date).format('LLL');
		$scope.remark = $rootScope.editPOdata.remark;
	}

	$scope.createPOnew = function(){
		$scope.poAvail = false;
		function succ(data) {
			$scope.dtPO = data.data.data;
			$scope.msg = data.data.message;
			if($scope.aPO && $scope.aPO.length>0){
				for(var p=0;p<$scope.aPO.length;p++){
					if($scope.aPO[p].ponumder === $scope.dtPO.ponumder){
						$scope.poAvail = true;
					}
				}
			}
			if($scope.poAvail === false){
				$scope.aPO.push($scope.dtPO);
				$scope.poNoSel = $scope.aPO[$scope.aPO.length - 1];
				$scope.vendorSel = undefined;
				$scope.POapprover = undefined;
				$scope.freight =  0;
				$scope.tax = 0;
				$scope.remark = undefined;
				$scope.promiseDate = undefined;
				$scope.neededDate = undefined;
			}
			swal($scope.msg,"","success");
			$scope.aAddedTask = [];
			$scope.POapprover = undefined;
			$scope.remark = undefined;
			$scope.freight =  0;
			$scope.tax = 0;
		}
		spareService.createPOnewServ({}, succ);
	}

	$scope.prNumSelect = function(obj,i){
		$scope.prNum = obj;
	}


	$scope.pushToPo = function(prData, index){
		var avail = false;
		if($scope.poNoSel && $scope.poNoSel.ponumder){
			if($scope.aAddedTask && $scope.aAddedTask.length>0){
				for(var r=0;r<$scope.aAddedTask.length;r++){
					if($scope.aAddedTask[r].code === prData.code && $scope.aAddedTask[r].prnumber === $scope.prNum.prnumber){
						avail = true;
						break;
					}
				}
			}
			if(avail){
				swal('Spare is already available...',"","warning");
			}else{
				//$scope.aPR[index].disableThis = true;
				$scope.prNum.spare[index].disableThis = true;
				//prData.sn = $scope.aAddedTask.length + 1;
				$scope.POpushData = {};
				$scope.POpushData.part_ref = prData.part_ref;
				//$scope.POpushData.sn = prData.sn;
				$scope.POpushData.prnumber = $scope.prNum.prnumber;
				$scope.POpushData.code = prData.code;
				$scope.POpushData.name = prData.name;
				$scope.POpushData.quantity = prData.remaining_quantity;
				$scope.POpushData.localQuantity = prData.remaining_quantity;
				$scope.prNum.spare[index].remaining_quantity = 0;
				$scope.POpushData.uom = prData.uom;
				if(prData.type){
					$scope.POpushData.type = prData.type;
				}
				$scope.POpushData.tax = prData.tax || 0;
				$scope.POpushData.rate = prData.rate;
				$scope.POpushData.brand = prData.brand;
				$scope.POpushData.previousRate = prData.previousRate;
				$scope.POpushData.rate_inc_tax = prData.rate_inc_tax;
				$scope.POpushData.localPush = true;
				//$scope.POpushData.created_by_name = prData.created_by_name;
				$scope.aAddedTask.push($scope.POpushData);
			}

		}else{
			swal("Please select PO number first.","","warning");
		}
	}

	$scope.removeDt = function(data, $index){

		if($scope.aPR && $scope.aPR.length>0){
			for(var x=0;x<$scope.aPR.length;x++){
				if($scope.aPR[x].prnumber === data.prnumber){
					for(var s=0;s<$scope.aPR[x].spare.length;s++){
						if($scope.aPR[x].spare[s].code === data.code){
							$scope.aAddedTask.splice($index, 1);
							$scope.aPR[x].spare[s].remaining_quantity = data.localQuantity;
						}
					}
				}
			}
		}
	}

	$scope.removePRdt = function(data, $index){
		//$scope.aPR.splice($index, 1);

		function succ(data) {
			$scope.aPR.splice($index, 1);
		}
		var rDataPR = {};
		rDataPR._id = data._id;
		spareService.removePRserv(rDataPR, succ);
	}

	$scope.removeFromPO = function(data, $index){
		$scope.aAddedTask.splice($index, 1);
	}

	$scope.addAllTax = function(){

		if($scope.aAddedTask && $scope.aAddedTask.length>0){
			for(var v=0;v<$scope.aAddedTask.length;v++){
				$scope.aAddedTask[v].tax = $scope.tax;
			}
		}

	}
	$scope.addTax = function(tax){

		$scope.tax = tax||0;
	}

	$scope.changePO = function(data){
		$scope.aAddedTask = data.spare;
		$scope.dataPObyChange = data;
		$scope.venSelected === false
		if($scope.aPOvendor && $scope.aPOvendor.length>0 && data && data.vendorId){
			for(var v=0;v<$scope.aPOvendor.length;v++){
				if($scope.aPOvendor[v].vendorId === data.vendorId){
					$scope.vendorSel = $scope.aPOvendor[v];   //set vendor by po change
					$scope.venSelected = true;
				}
			}
		}
		if($scope.venSelected === false){
			$scope.vendorSel = '';
		}
		if($rootScope.editPOdata && $rootScope.editPOdata.isEditPO === true){
			$rootScope.getAllPOvendor();
		}
		if($scope.aPR && $scope.aPR.length>0){
			for(var s=0;s<$scope.aPR.length;s++){
				if($scope.aPR[s].disableThis === true){
					$scope.aPR[s].disableThis = false;  //condition disable/enable PR push
				}
			}
		}
		if($scope.aAddedTask && $scope.aAddedTask.length>0){
			for(var p=0;p<$scope.aAddedTask.length;p++){
				if($scope.aPR && $scope.aPR.length>0){
					for(var q=0;q<$scope.aPR.length;q++){
						if($scope.aPR[q]._id === $scope.aAddedTask[p].pr_id){
							$scope.aPR[q].disableThis = true;   //condition disable/enable PR push
						}
					}
				}
			}
		}

		$scope.poAppSelected = false;
		if($scope.aApprover && $scope.aApprover.length>0){
			for(var r=0;r<$scope.aApprover.length;r++){
				if(data.approver && data.approver._id){
					if($scope.aApprover[r]._id === data.approver._id){
						$scope.POapprover = $scope.aApprover[r];   //set vendor by po change
						$scope.poAppSelected = true;
					}
				}
			}
		}

		if($scope.poAppSelected === false){
			$scope.POapprover = undefined;
		}

		$scope.freight = data.freight || 0;
		$scope.tax = data.tax || 0;
		//$scope.remark = data.remark || 'NA';
	}

	$scope.POeditSave = function(){
		function success(data) {
			$scope.resDataIssue = data.data;
			var msggg = data.message;
			swal(msggg,"","success");
			$state.reload();
		}
		function fail(data) {
			//console.error("failure add branch: ",data);
		}

		$scope.poLocData = {};
		$scope.poLocData.branch = $scope.branch._id;
		$scope.poLocData.branchId = $scope.branch._id;
		$scope.poLocData.branchName = $scope.branch.name;
		$scope.poLocData.spare = $scope.aAddedTask;
		if($scope.vendorSel && $scope.vendorSel.name){
			$scope.poLocData.vendor_name = $scope.vendorSel.name;
			$scope.poLocData.vendor_id = $scope.vendorSel._id;
			$scope.poLocData.vendorId = $scope.vendorSel.vendorId;
		}
		if($scope.poNoSel){
			$scope.poLocData._id = $scope.poNoSel._id;
		}
		$scope.poLocData.promised_date = $scope.promiseDate;
		//$scope.poLocData.needed_date = $scope.neededDate;
		if($scope.POapprover){
			$scope.poLocData.approver = {};
			$scope.poLocData.approver.name = $scope.POapprover.full_name;
			$scope.poLocData.approver._id = $scope.POapprover._id;
		}
		$scope.poLocData.freight = $scope.freight;
		$scope.poLocData.tax = $scope.tax;
		$scope.poLocData.remark = $scope.remark;
		$scope.poLocData.payment_terms = $scope.payment_terms;
		$scope.poLocData.freightTerms = $scope.freightTerms;

		spareService.savePOeditService2($scope.poLocData, success ,fail);
	}


});

materialAdmin.controller("poDetailPrintCtrl",
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

			$scope.downloadPO = function(data) {
				billsService.getPOPdf(JSON.stringify(billsService.preparePOData(data)), function(res) {
					if(res) {
						$scope.html = angular.copy(res.data);
					} else {
						swal('Error', 'Something Went Wrong', 'error');
					}
				});
			}
			$scope.actionWithVendorData = function(data){
				if(data.vendorId){
					maintenanceVendorService_.getMaintenanceVendors({vendorId:data.vendorId},function(response){
						if(response){
							var vendorData = response.data[0];
							data.supplier_address = vendorData.address ?parseAddressToString(vendorData.address):"";
							data.telephone = vendorData.prim_contact_no;
							data.email_id = vendorData.email;
							//data.supplier_site
							$scope.downloadPO(data);
						}
					})
				}else{
					$scope.downloadPO(data);
				}
			}
		function parseAddressToString(address){
			var parsedAddress = "";
			if(address && address.line1){
				parsedAddress+=(address.line1+", ");
			}
			if(address && address.line1){
				parsedAddress+=(address.line2+", ");
			}
			if(address && address.city){
				parsedAddress+=(address.city+", ");
			}
			if(address && address.district){
				parsedAddress+=(address.district+", ");
			}
			if(address && address.state){
				parsedAddress+=(address.state+", ");
			}
			if(address && address.pincode){
				parsedAddress+=(address.pincode+", ");
			}
			if(address && address.country){
				parsedAddress+=address.country;
			}
			return parsedAddress;
		}
			$scope.getGR = function () {
				var oFilter = angular.copy(thatPO);
				$scope.actionWithVendorData(oFilter);
			}
			$scope.getGR();

			$scope.closeModal = function () {
				$uibModalInstance.dismiss('cancel');
			};
		});
materialAdmin.controller("POdetailController", function($rootScope, $scope,$state,$modal,$uibModal,growlService,spareService,formValidationgrowlService,inventoryService, billsService,ReportService,maintenanceVendorService_) {
	var lastFilter;

	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.itemsPerPage = 15;

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

	function prepareFilterObject(isPagination){
		var allowedKey = ['ponumder','vendor_name'];
		var myFilter = {status:'Unapproved'};
		for (var i = 0; i < allowedKey.length; i++) {
			if($scope[allowedKey[i]]){
				myFilter[allowedKey[i]] = $scope[allowedKey[i]];
			}
		}
		if(isPagination && $scope.currentPage){
			myFilter.skip = $scope.currentPage;
		}
		if($scope.findText){
			myFilter.find = $scope.findText;
		}
		return myFilter;
	};

	$scope.clearSearch = function(val) {
		switch (val) {
			case "findText":
				delete $scope.findText;
				$scope.getAllPOserv();
				break;
			case "vehicle":
				delete $scope.vehicle_number;
				$scope.getAllPOserv();
				break;
			default:
				break;
		}
	}

	$scope.searchAll = function () {
		$scope.getAllPOserv();
	}

	$scope.getAllPOserv = function(isPagination){
		function succ(data) {
			$scope.aPOlist = data.data.data;
			$scope.total_pages = data.data.pages;
			$scope.totalItems = 15*data.data.pages;
		}
		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		spareService.getAllPOserv(oFilter, succ);
	};
	$scope.getAllPOserv();

	$scope.pageChanged = function() {
		$scope.getAllPOserv(true);
	};

	$scope.editPO = function(data, index){
		data.isEditPO = true;
		$rootScope.editPOdata = data;
		$state.go('mrp_pr_po.PrPo');
	}

	$scope.previewPO = function(data, index) {
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/purchaseOrder.html',
			controller: 'purchaseOrderCtrl',
			size: 'lg',
			resolve: {
				data: function() {
					return billsService.preparePOData(data);
				}
			}
		});

		modalInstance.result.then(function() {
			//$state.reload();
		}, function(data) {
			//$state.reload();
		});
	}

	$scope.approvePO = function(data, index) {
		$rootScope.selPOdata = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/prPo/approvePO.html',
			controller: 'approvePOctrl',
			resolve: {
				thatPO: function () {
					return $scope.selPOdata;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data !== 'cancel') {
				swal("Oops!", data.message, "error")
			}
		});
	}

	$scope.downloadPO = function(data, index) {
		billsService.getPOPdf(JSON.stringify(billsService.preparePOData(data)), function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	};
	$scope.downloadReport = function(){
		if($scope.aPOlist && $scope.aPOlist.length>0){
			ReportService.getPoReport(lastFilter, function(data) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			});
		}else{
			swal("warning","PO not available.","warning")
		}
	}

	function parseAddressToString(address){
		var parsedAddress = "";
		if(address && address.line1){
			parsedAddress+=(address.line1+", ");
		}
		if(address && address.line1){
			parsedAddress+=(address.line2+", ");
		}
		if(address && address.city){
			parsedAddress+=(address.city+", ");
		}
		if(address && address.district){
			parsedAddress+=(address.district+", ");
		}
		if(address && address.state){
			parsedAddress+=(address.state+", ");
		}
		if(address && address.pincode){
			parsedAddress+=(address.pincode+", ");
		}
		if(address && address.country){
			parsedAddress+=address.country;
		}
		return parsedAddress;
	}

	$scope.printPODetail = function(data,) {
		var oFilter = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'poDetailPrintCtrl',
			resolve: {
				thatPO: oFilter
			}
		});
	}

	$scope.actionWithVendorData = function(data, index, action){
		if(data.vendorId){
			maintenanceVendorService_.getMaintenanceVendors({vendorId:data.vendorId},function(response){
				if(response){
					var vendorData = response.data[0];
					data.supplier_address = vendorData.address?parseAddressToString(vendorData.address):"";
					data.telephone = vendorData.prim_contact_no;
					data.email_id = vendorData.email;
					//data.supplier_site
					action(data, index)
				}
			})
		}else{
			action(data, index);
		}
	}
});

materialAdmin.controller("approvePOctrl", function($rootScope, $scope, $uibModalInstance,thatPO,jobCardServices,growlService,formValidationgrowlService,spareService) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$rootScope.selPOdata = thatPO;
	$scope.aFreightTerms = [
		'INCLUSIVE',
		'FREIGHT EXTRA AS ACTUAL',
		'FREIGHT TO BE PAID',
		'FREIGHT TO BE BILLED'
	];

	$scope.aTerm = [
		'100% AGAINST DELIVERY',
		'100% ADVANCE',
		'CASH PAID',
		'50% ADVANCE, BALANCE AGAINST DELIVERY',
		'50% ADVANCE, BALANCE PRIOR TO DISPATCH OF MATERIAL.',
		'100% WITHIN 3 TO 4 WEEKS',
		'100% WITHIN 1 WEEK AFTER DELIVERY'
	];

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


	$rootScope.getAllPOvendor = function(){
		function succ(data) {
			$scope.aPOvendor = data.data.data;

			if($scope.aPOvendor && $scope.aPOvendor.length>0 && $rootScope.selPOdata && $rootScope.selPOdata.vendorId){
				for(var v=0;v<$scope.aPOvendor.length;v++){
					if($scope.aPOvendor[v].vendorId === $rootScope.selPOdata.vendorId){
						$scope.POvendorSel = $scope.aPOvendor[v];   //set vendor by po change
					}
				}
			}
		}

		spareService.getAllPOvendorServ({}, succ);
	};
	$rootScope.getAllPOvendor();

	$scope.approveFinal = function(){
		function success(data) {
			$scope.msg = data.message;
			swal($scope.msg,"","success");
			//$rootScope.getAllPOvendor();
			//$uibModalInstance.dismiss('cancel');
			$uibModalInstance.close(data);
		}
		function failure(res) {
			$scope.msg = res.message;
			swal($scope.msg,"","warning");
			$uibModalInstance.dismiss(res);
		}

		$scope.localData = {};
		$scope.localData = $rootScope.selPOdata;
		$scope.localData.billing_location = $scope.bill_loc;
		$scope.localData.shipping_location = $scope.ship_loc;
		$scope.localData.vendorId = $scope.POvendorSel.vendorId;
		$scope.localData.vendor_id = $scope.POvendorSel._id;
		$scope.localData.vendor_name = $scope.POvendorSel.name;
		$scope.localData.status = 'Approved';
		$scope.localData.po_id = $rootScope.selPOdata._id;

		spareService.savePOeditServ($scope.localData, success, failure);
	}

});

materialAdmin.controller("releasePOctrl", function($rootScope, $scope, thatPO,$uibModalInstance,jobCardServices,growlService,formValidationgrowlService,spareService) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$rootScope.selPOforRelease = thatPO;

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

	$scope.qtyChange = function(d,i){
		$rootScope.selPOforRelease.spare[i].total = d.quantity * d.rate;
	}

	$scope.releaseFinal = function(){
		function success(data) {
			$scope.msg = data.message;
			swal($scope.msg,"","success");
			$uibModalInstance.close(data);
		}
		function fail(data) {
			swal("Some error with PO release","","error");
			$uibModalInstance.dismiss(data);
		}

		$scope.localData = {};
		$scope.localData = $rootScope.selPOforRelease;
		/*$scope.localData.billing_location = $scope.bill_loc;
        $scope.localData.shipping_location = $scope.ship_loc;
        $scope.localData.vendorId = $scope.POvendorSel.vendorId;
        $scope.localData.vendor_id = $scope.POvendorSel._id;
        $scope.localData.vendor_name = $scope.POvendorSel.name;*/
		$scope.localData.status = 'Released';
		$scope.localData.po_id = $rootScope.selPOforRelease._id;
		$scope.localData.updateFromOther = true;

		spareService.savePOeditServ($scope.localData, success,fail);
	}

});

materialAdmin.controller("POreleaseController", function($rootScope,DateUtils, $scope,$state,$modal,$uibModal,growlService,spareService,formValidationgrowlService,inventoryService, billsService,ReportService,maintenanceVendorService_) {
	var lastFilter;
	$scope.currentPage = 1;
	$scope.maxSize = 3;
	$scope.itemsPerPage = 15;
	$scope.aStatus = ["Approved","Unapproved","Received","Inwarded","Partial Inwarded","Released"];

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

	function prepareFilterObject(isPagination){
		var allowedKey = ['ponumder','vendor_name','status','start_date','end_date'];
		var myFilter = {not_show:'Unapproved'};
		for (var i = 0; i < allowedKey.length; i++) {
			if($scope[allowedKey[i]]){
				myFilter[allowedKey[i]] = $scope[allowedKey[i]];
			}
		}
		if(isPagination && $scope.currentPage){
			myFilter.skip = $scope.currentPage;
		}
		if($scope.findText){
			myFilter.find = $scope.findText;
		}
		return myFilter;
	};

	$scope.clearSearch = function(val) {
		switch (val) {
			case "findText":
				delete $scope.findText;
				$scope.getAllPOserv();
				break;
			case "vehicle":
				delete $scope.vehicle_number;
				$scope.getAllPOserv();
				break;
			default:
				break;
		}
	}

	$scope.searchAll = function () {
		$scope.getAllPOserv();
	}


	$scope.getAllPOserv = function(isPagination){
		function succ(data) {
			$scope.aPOlists = data.data.data;
			$scope.total_pages = data.data.pages;
			$scope.totalItems = 15*data.data.pages;
		}
		var oFilter = prepareFilterObject(isPagination);
		lastFilter = oFilter;
		spareService.getAllPOserv(oFilter, succ);
	};
	$scope.getAllPOserv();

	$scope.pageChanged = function() {
		$scope.getAllPOserv(true);
	};

	$scope.releasePO = function(data, index) {
		if(data.total > 100000){
			swal("PO amount is greater then 100000 ");
		}
		$rootScope.selPOforRelease = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/prPo/releasePO.html',
			controller: 'releasePOctrl',
			resolve: {
				thatPO: function () {
					return $scope.selPOforRelease;
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

	function parseAddressToString(address){
		var parsedAddress = "";
		if(address && address.line1){
			parsedAddress+=(address.line1+", ");
		}
		if(address && address.line1){
			parsedAddress+=(address.line2+", ");
		}
		if(address && address.city){
			parsedAddress+=(address.city+", ");
		}
		if(address && address.district){
			parsedAddress+=(address.district+", ");
		}
		if(address && address.state){
			parsedAddress+=(address.state+", ");
		}
		if(address && address.pincode){
			parsedAddress+=(address.pincode+", ");
		}
		if(address && address.country){
			parsedAddress+=address.country;
		}
		return parsedAddress;
	}
	$scope.printPODetail = function(data,) {
		var oFilter = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bills/builtyRender.html',
			controller: 'poDetailPrintCtrl',
			resolve: {
				thatPO: oFilter
			}
		});
	}
	$scope.actionWithVendorData = function(data, index, action){
		//if(data.status!='Inwarded'){
		if(data.vendorId){
			maintenanceVendorService_.getMaintenanceVendors({vendorId:data.vendorId},function(response){
				if(response){
					var vendorData = response.data[0];
					data.supplier_address = vendorData.address?parseAddressToString(vendorData.address):"";
					data.telephone = vendorData.prim_contact_no;
					data.email_id = vendorData.email;
					//data.supplier_site
					action(data, index)
				}
			})
		}else{
			action(data, index);
		}
		/*}else{
            swal('warning','PO Inwarded','warning');
        }*/

	}

	$scope.previewPO = function(data, index) {
		var modalInstance = $modal.open({
			templateUrl: 'views/bills/purchaseOrder.html',
			controller: 'purchaseOrderCtrl',
			size: 'lg',
			resolve: {
				data: function() {
					return billsService.preparePOData(data);
				}
			}
		});

		modalInstance.result.then(function() {
			//$state.reload();
		}, function(data) {
			/*if (data != 'cancel') {
                swal("Oops!", data.data.message, "error")
            }*/
			//$state.reload();
		});
	}

	$scope.downloadPO = function(data, index) {
		billsService.getPOPdf(JSON.stringify(billsService.preparePOData(data)), function(data) {
			var a = document.createElement('a');
			a.href = data.data.url;
			a.download = data.data.url;
			a.target = '_blank';
			a.click();
		});
	};

	$scope.downloadReport = function(){
		if($scope.aPOlists && $scope.aPOlists.length>0){
			ReportService.getPoReport(lastFilter, function(data) {
				var a = document.createElement('a');
				a.href = data.data.url;
				a.download = data.data.url;
				a.target = '_blank';
				a.click();
			});
		}else{
			swal("warning", "PO not available.","warning");
		}
	}

	$scope.UnApprovePO = function(data, index){
		$rootScope.selPOforUnApprove = data;
		var modalInstance = $uibModal.open({
			templateUrl: 'views/mrp/prPo/unApprovePO.html',
			controller: 'unApprovePOctrl',
			resolve: {
				thatPO: function () {
					return $scope.selPOforUnApprove;
				}
			}
		});

		modalInstance.result.then(function () {
			$state.reload();
		}, function (data) {
			if (data !== 'cancel') {
				swal("Oops!", data.message, "error")
			}
		});
	}


});

materialAdmin.controller("unApprovePOctrl", function($rootScope, $scope, thatPO,$uibModalInstance,jobCardServices,growlService,formValidationgrowlService,spareService,inventoryService) {

	$scope.closeModal = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$rootScope.selPOforUnApprove = thatPO;
	$scope.aReason = ['Vehicle is not availabel.', 'Driver is not availabel.', 'Price not match', 'Other'];


	function prepareFilterObject(isPagination){
		var myFilter = {};
		if(isPagination && $scope.currentPage){
			myFilter.skip = $scope.currentPage;
		}
		return myFilter;
	}

	$scope.unApproveFinal = function(){
		function success(data) {
			$scope.msg = data.message;
			swal($scope.msg,"","success");
			$uibModalInstance.close(data);
		}
		function fail(data) {
			swal("Some error with PO release","","error");
			$uibModalInstance.dismiss(data);
		}

		$scope.localData = {};
		$scope.localData = $rootScope.selPOforUnApprove;
		$scope.localData.status = 'Unapproved';
		$scope.localData.po_id = $rootScope.selPOforUnApprove._id;
		$scope.localData.updateFromOther = true;

		spareService.savePOeditServ($scope.localData, success,fail);
	}

});

