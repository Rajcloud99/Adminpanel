materialAdmin.controller("jobCardCommonController", function($rootScope,$modal,$uibModal,$localStorage,$state, $scope,DateUtils,jobCardServices,Vehicle,ReportService) {
  $rootScope.forUpdateBooking = {};
  $scope.currentPage = 1;
  $scope.maxSize = 5;
  $scope.itemsPerPage = 10;
  $scope.totalPages = 0;
  $scope.totalItems = 0;
  $scope.jobType = ["Internal","External"];
  $scope.aStatus = ["Open","Closed"];
  $scope.status = "Open";
  $scope.aMainType = ["Preventive","Running","Accident","Breakdown","Major","Minor","TrailerModification"];
  var lastFilter;
  if($localStorage.ft_data.userLoggedIn){
    $rootScope.logInUser = $localStorage.ft_data.userLoggedIn;
  }

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


  /*$scope.getRegVehicle = function(){
    function success(data) {
      $scope.aVehicle = data.data;
    };
    Vehicle.getAllVehicles({all:true}, success);
  };
  $scope.getRegVehicle();*/
	$scope.clearSearch = function(val) {
		switch (val) {
			case "customer":
				delete $scope.customerName;
				$rootScope.getAllJobCard();
				break;
			case "vehicle":
				delete $scope.vehicle_number;
				$rootScope.getAllJobCard();
				break;
			case "route":
				delete $scope.route_id;
				$rootScope.getAllJobCard();
				break;
			default:
				break;
		}
	}
	$scope.onSelect = function($item, $model, $label) {
		$rootScope.getAllJobCard();
	};
	$scope.getVname = function(viewValue) {
		if (viewValue && viewValue.toString().length > 1) {
			function oSuc(response) {
				$scope.aVehicles = response.data.data;
			}

			function oFail(response) {
				console.log(response);
			}

			Vehicle.getName(viewValue, oSuc, oFail);
		} else if (viewValue == '') {
			$rootScope.getAllJobCard();
		}
	};

  $scope.editModeJobCard = function(selectedJobCardInfo){
    if($scope.selectedJobCardInfo){
      $rootScope.forUpdateJobCard = $scope.selectedJobCardInfo;
      /*var jUrl = "#!/maintenance_process/updateJobCard/updateJobCardBasic";
      $rootScope.redirect(jUrl);*/
      var modalInstance = $uibModal.open({
        templateUrl: 'maintenance/views/jobCard/updateJobCardPop.html',
        controller: 'updateJobCardPopCtrl'
      });
    }else{
      swal("Warning", "Please select jobcard first.", "warning");
    }
  }
  $scope.getJobCardSingle = function(oJobCardData ,index){
    $rootScope.selectedJobCardInfoForService = oJobCardData;
    $scope.selectedJobCardInfo = oJobCardData;
    listItem = $($('.selectItem')[index]);
    listItem.siblings().removeClass('grn');
    listItem.addClass('grn');
    $scope.getTaskForJobCard();
  }

  $scope.getTaskSingle = function(oTaskData ,index){
    $scope.selectedTaskInfo = oTaskData;
    listItem = $($('.selectItem22')[index]);
    listItem.siblings().removeClass('grn');
    listItem.addClass('grn');
    $scope.getSpareForTask();
  }

  function prepareFilterObject(isPagination){
    var allowedKey = ['jobId','vehicle_number','last_trip_number','status','maintenance_type','job_type','start_date','end_date'];
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

  $scope.getSpareForTask = function(){
    function succ(data) {
      $scope.spares_allotted = data.data.data[0];
      /*setTimeout(function(){
         listItem = $($('.selectItem22')[0]);
         listItem.addClass('grn');
        }, 500);*/
      $scope.selectedTaskInfo.spares_allotted = $scope.spares_allotted;
    };

    if($scope.selectedTaskInfo && $scope.selectedTaskInfo.taskId){
      $scope.selTask = {};
      $scope.selTask.taskId = $scope.selectedTaskInfo.taskId;
      jobCardServices.getSelTaskSpare($scope.selTask, succ);
    }
  }

  $scope.getTaskForJobCard = function(){
    function succ(data) {
      $scope.aTaskForJobC = data.data.data;
      setTimeout(function(){
         listItem = $($('.selectItem22')[0]);
         listItem.addClass('grn');
        }, 500);
      $scope.selectedTaskInfo = data.data.data[0];
      $scope.getSpareForTask();
    };

    if($scope.selectedJobCardInfo && $scope.selectedJobCardInfo.jobId){
      $scope.selTask = {};
      $scope.selTask.jobId = $scope.selectedJobCardInfo.jobId;
      jobCardServices.getSelTask($scope.selTask, succ);
    }
  }

  //when click page change function call
  $scope.pageChanged = function() {
    $scope.getAllJobCard(true);
  };

  //Get all job card function call with status : open,,,,,
  $rootScope.getAllJobCard = function(isPagination){
    function success(data) {
      if(data.data && data.data.data){
        setTimeout(function(){
         listItem = $($('.selectItem')[0]);
         listItem.addClass('grn');
        }, 500);
        $scope.aJobCards = data.data.data;
        $scope.totalPages = data.data.pages;
        $scope.totalItems = 10*data.data.pages;
        $rootScope.selectedJobCardInfoForService = $scope.aJobCards[0];
        $scope.selectedJobCardInfo = $scope.aJobCards[0];
        /*for(var j=0;j<$scope.aJobCards.length;j++){
          if($scope.aJobCards[j].status == 'true'){
            $scope.aJobCards[j].sts = 'Open';
          }else{
            $scope.aJobCards[j].sts = 'Closed';
          }
        }*/
        $scope.getTaskForJobCard();
      }
    };
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with GET Job Card.","","error");
    }
    var oFilter = prepareFilterObject(isPagination);   //filter function for filter get data
    lastFilter = oFilter;
    jobCardServices.getAllJobCards(oFilter,success,failure);  // get all job card call
  };
  $rootScope.getAllJobCard();

  $scope.downloadReport = function(){
    if($scope.aJobCards && $scope.aJobCards.length>0){
      ReportService.getJobCardReport(lastFilter, function(data) {
        var a = document.createElement('a');
        a.href = data.data.url;
        a.download = data.data.url;
        a.target = '_blank';
        a.click();
      });
    }else{
      swal("Warning","Job card not available or selected.",'warninig');
    }
  }

  $scope.addJobCardPop = function(){
    var modalInstance = $uibModal.open({
		templateUrl: 'maintenance/views/jobCard/addJobCardPop.html',
        controller: 'addNewJobCardPopCtrl'
    });
  }

  function swalCallForVehicle(vehicleStatus){
    //Success Function
    function successUpdate(response){
      if(response){
        swal("Job card closed Successfully!", response.data.message, "success");
        $state.reload();
      }
    }

    //Failure Function
    function failureUpdate(response){
      if(response){
        swal("Job card closing failed!", response.data.error_message, "error");
        $state.reload();
      }
    }

    var confirm_btn_text = "AVAILABLE";
    var cancel_btn_text = "RESUME";
    var title_text;
    var detail_text;
    var showCancel = false;
    if(vehicleStatus.onTrip){
      title_text = "Vehicle No: "+vehicleStatus.vehicle_no+" was on trip number "+vehicleStatus.trip_no+" on "+vehicleStatus.trip_name+" route"
      detail_text = "Do you want to Resume the trip on this vehicle or make Available this Vehicle for other trip?";
      showCancel = true;
    }else{
      title_text = "Are you sure?"
      detail_text = vehicleStatus.vehicle_no+" is not any trip, System will automatically change the vehicle status to Available status.";
    }

    swal({
      title: title_text,
      text: detail_text,
      type: "warning",
      showCancelButton: showCancel,
      confirmButtonColor: "#4caf50",
      confirmButtonText: confirm_btn_text,
      cancelButtonText: cancel_btn_text,
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm){
      if (isConfirm) {
        vehicleStatus.current_veh_status = "Available";
        //swal("Deleted!", "Your imaginary file has been deleted.", "success");
        jobCardServices.updatejobcard(vehicleStatus, successUpdate,failureUpdate);
      } else {
        vehicleStatus.current_veh_status = "In Trip";
        //swal("Cancelled", "Your imaginary file is safe :)", "error");
        jobCardServices.updatejobcard(vehicleStatus, successUpdate,failureUpdate);
      }
    });
  }


  $scope.closeJobCard = function(){
    if($scope.selectedJobCardInfo){
      function successVehicle(data){
        if(data && data.data && data.data[0]){
          var vehicle = data.data[0];
          var vehicleStatus = {
            vehicle_no:vehicle.vehicle_reg_no,
            onTrip:false,
            status:"Closed",
            _id:$scope.selectedJobCardInfo._id
          };
          if(vehicle && vehicle.last_known && vehicle.last_known.trip_no){
            vehicleStatus.onTrip = true;
            vehicleStatus.trip_no = vehicle.last_known.trip_no;
            vehicleStatus.trip_name = vehicle.last_known.trip_name;
            vehicleStatus.datetime = vehicle.last_known.datetime;
          }
          swalCallForVehicle(vehicleStatus);
        }
      }
      Vehicle.getAllVehicles({vehicle_reg_no:$scope.selectedJobCardInfo.vehicle_number}, successVehicle);
    }else{
      swal("Warning", "Please select open jobcard first.", "warning");
    }
  }

  $scope.addExpense = function(){
    if($rootScope.selectedJobCardInfoForService){
      $rootScope.selectedJobCardInfoForService;
      $state.go('maintenance_process.addContractorExpenses');
    }else{
      swal("Warning", "Please select open jobcard first.", "warning");
    }
  }

  $scope.addServiceInJobCard = function(){
    if($rootScope.selectedJobCardInfoForService){
      $rootScope.selectedJobCardInfoForService;
      $state.go('maintenance_process.addService');
    }else{
      swal("Warning", "Please select jobcard first.", "warning");
    }
  }

  $scope.editServiceInJobCard = function(){
    if($scope.selectedTaskInfo){
      $rootScope.selTaskData = $scope.selectedTaskInfo;
      $state.go('maintenance_process.editService');
    }else{
      swal("Warning", "Please select jobcard service first.", "warning");
    }
  }

  $scope.closeService = function(){
    if($scope.selectedTaskInfo){
      function successClose(response){
        if(response && response.data){
          console.log(response);
          swal("Job Card Service Closed Successfully","","success");
          $state.reload();
        }
      }
      function failure(res){
        console.log("fail: ",res);
        $scope.msg = res.data.message;
        swal($scope.msg,"","error");
      }

      var closeObj = {};
      closeObj._id = $scope.selectedTaskInfo._id;
      closeObj.status = 'Closed';
      jobCardServices.updateJobCardTaskServ(closeObj, successClose,failure);
    }else{
      swal("Warning", "Please select jobcard open service first.", "warning");
    }
  }

  $scope.startService = function(){
    if($scope.selectedTaskInfo){
      function successStart(response){
        if(response && response.data){
          console.log(response);
          swal("Job Card Service Start Successfully","","success");
          $state.reload();
        }
      }
      function failure(res){
        console.log("fail: ",res);
        $scope.msg = res.data.message;
        swal($scope.msg,"","error");
      }

      var closeObj = {};
      closeObj._id = $scope.selectedTaskInfo._id;
      closeObj.start_datetime = new Date();
      jobCardServices.updateJobCardTaskServ(closeObj, successStart,failure);
    }else{
      swal("Warning", "Please select jobcard service first.", "warning");
    }
  }

  $scope.jcdClick = function(){
    if($rootScope.selectedJobCardInfoForService){
      var modalInstance = $uibModal.open({
        templateUrl: 'maintenance/views/jobCard/jcdPopup.html',
        controller: 'jcdPopCtrl'
      });
    }else{
      swal("Warning", "Please select jobcard first.", "warning");
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

    $scope.formats = ['dd-MMM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.format = DateUtils.format;
  //************* New Date Picker for multiple date selection in single form ******************

});

materialAdmin.controller("jcdPopCtrl", function($rootScope, $scope, $uibModalInstance,jobCardServices,growlService,formValidationgrowlService,billsService ) {
  $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel');
  };

  if($rootScope.selectedJobCardInfoForService){
    $scope.rootData = $rootScope.selectedJobCardInfoForService;
  }

  $scope.getJcd = function(){
   $scope.vehicleType1 = '';
    function success(response) {
      $scope.jcdData = response.data.data;    // array of all JCD
      $scope.jcdData.rootData = $scope.rootData;    // array of all JCD
      $scope.jcdData.spare_total_amt = 0;
      $scope.jcdData.expense_total_amt = 0;
      $scope.jcdData.oExpense_total_amt = 0;
		if($scope.jcdData.issuedSpare && $scope.jcdData.issuedSpare.length>0){
        for(var s=0;s<$scope.jcdData.issuedSpare.length;s++){
          $scope.jcdData.issuedSpare[s].used_qty = $scope.jcdData.issuedSpare[s].issued_spare.quantity - $scope.jcdData.issuedSpare[s].issued_spare.total_returned;
          $scope.jcdData.issuedSpare[s].value = $scope.jcdData.issuedSpare[s].used_qty * $scope.jcdData.issuedSpare[s].issued_spare.cost_per_piece;
          $scope.jcdData.spare_total_amt = $scope.jcdData.spare_total_amt + $scope.jcdData.issuedSpare[s].value;
        }
      }
      if($scope.jcdData.cExpense && $scope.jcdData.cExpense.length>0){
        for(var e=0;e<$scope.jcdData.cExpense.length;e++){
          $scope.jcdData.expense_total_amt = $scope.jcdData.cExpense[e].amount + $scope.jcdData.expense_total_amt;
        }
      }
		if($scope.jcdData.oExpense && $scope.jcdData.oExpense.length>0){
			for(var e=0;e<$scope.jcdData.oExpense.length;e++){
				$scope.jcdData.oExpense_total_amt = $scope.jcdData.oExpense[e].amount + $scope.jcdData.oExpense_total_amt;
			}
		}
      $scope.jcdData.gross_amt = $scope.jcdData.spare_total_amt + $scope.jcdData.expense_total_amt + $scope.jcdData.oExpense_total_amt;
    };
    function fail(response) {
      $scope.error = response.data.error;    // error in JCD
    };

    var dt = {};
    dt.jobId = $scope.rootData.jobId;

    jobCardServices.getJcdService(dt, success, fail); // get all register vehicle
  };
  $scope.getJcd();

  $scope.downloadJCD = function(){
    var data = $scope.jcdData;
    if(data){
        billsService.getJcdPdf(data, function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    }
  }

});

materialAdmin.controller("addNewJobCardPopCtrl", function($rootScope, $scope, $uibModalInstance,DateUtils,branchService,jobCardServices,growlService,formValidationgrowlService,Vehicle) {
  $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel');
  };
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

  $scope.objJobCard = {};
  $scope.today = function() {
    $scope.vehicle_in_datetime = new Date();
    $scope.estimated_release_date = new Date();
  };
  $scope.today();
  $scope.jobType = ["Internal","External"];
  $scope.objJobCard.job_type = "Internal";
  $scope.aStatus = ["Open","Closed"];
  $scope.aFlag = ["Red","Green","Yellow"];
  $scope.objJobCard.flag = "Green";
  $scope.aMainType = ["Preventive","Running","Accident","Breakdown","Major","Minor","TrailerModification"];
  //$scope.objJobCard.homId = 111;

  $scope.onBranchSelect= function(item,model,label){
    $scope.objJobCard.branch=item;
  }

  $scope.onVehicleSelect = function(item,model,label){
    $scope.objJobCard.last_trip_number = item.last_known.trip_no;
    $scope.objJobCard.driver_name = item.driver_name;
    $scope.objJobCard.vehicleFull=item;

  }
 

  // $scope.getVname = function(viewValue) {
	// 	if (viewValue && viewValue.length>1) {
	// 	$scope.vehicleType1 = '';
  //   function success(data) {
  //     $rootScope.vehicles = data.data;    // array of all vehicle
  //     $scope.vehiclesMarket = [];
  //     $scope.vehiclesOwn = [];
  //     if($rootScope.vehicles && $rootScope.vehicles.length>0){
  //       for(i=0;i<$rootScope.vehicles.length;i++){
  //         if($rootScope.vehicles[i].ownershipType == "own" || $rootScope.vehicles[i].ownershipType == "Own"){
  //           $scope.vehiclesOwn.push($rootScope.vehicles[i]);   // array of own vehicle
  //         } else if($rootScope.vehicles[i].ownershipType == "market"){
  //           $scope.vehiclesMarket.push($rootScope.vehicles[i]);   // array of market vehicle
  //         }
  //       }
  //     }
  //   };
	// 		function oFail(response) {
	// 			console.log(response);
	// 		}      
	// 		Vehicle.getNameTrim2(viewValue, success, oFail);
	// 	}
  // }


  $scope.getVname = function(viewValue) {
		if(viewValue.length < 3)
			return;
		$scope.vehicleType1 = '';
		return new Promise(function (resolve, reject){
		Vehicle.getNameTrim2(viewValue, success, oFail);
		function success(data) {
      $rootScope.vehicles = data.data;    // array of all vehicle
      $scope.vehiclesMarket = [];
      $scope.vehiclesOwn = [];
      if($rootScope.vehicles && $rootScope.vehicles.length>0){
        for(i=0;i<$rootScope.vehicles.length;i++){
          if($rootScope.vehicles[i].ownershipType == "own" || $rootScope.vehicles[i].ownershipType == "Own"){
            $scope.vehiclesOwn.push($rootScope.vehicles[i]);   // array of own vehicle
			      resolve($scope.vehiclesOwn);
          } else if($rootScope.vehicles[i].ownershipType == "market"){
            $scope.vehiclesMarket.push($rootScope.vehicles[i]);   // array of market vehicle
            resolve($scope.vehiclesMarket);
          }
        }
      }
    };function oFail(err) {
				console.log(err);
				reject([]);
			}
	});
  }


  $scope.getBname=function(viewValue) {
		if(viewValue.length < 3)
			return;
		return new Promise(function (resolve, reject) {	
		let filter ={name: viewValue,trim: true}
		branchService.getBranches(filter, function success(res) {
				resolve(res.data);
			}, function (err) {
				console.log(err);
				reject([]);
			});
	});
	}

  if($scope.enableNextTab == true){

  }else{
    $scope.enableNextTab = false;
  }

  $scope.addJobCard = function(form){
    function successPost(response){
      if(response && response.data){
        console.log(response);
        $rootScope.updateJobCardData = response.data.data;
        $scope.objJobCard = {};
        var msg = response.data.message;
        swal(msg,"","success");
        $uibModalInstance.dismiss('cancel');
        $rootScope.getAllJobCard();
      }
    }
    function failure(res){
      console.log("fail: ",res);
      var msg = res.data.message;
      swal(msg,"","error");
      $uibModalInstance.dismiss('cancel');
    }
    $scope.JobCardErrMsg = '';
    $scope.JobCardErrMsgCond = false;
    if(!form.$valid){
      swal("Please fill all mandatory fields","","error");
      return;
    }
    if(form.$valid){
      $scope.objJobCard.branchId = $scope.objJobCard.branch._id;
      $scope.objJobCard.branchName = $scope.objJobCard.branch.name;
      $scope.objJobCard.estimated_release_date = $scope.estimated_release_date;
      $scope.objJobCard.status = 'Open';
      $scope.objJobCard.vehicle_in_datetime = $scope.vehicle_in_datetime;
      $scope.objJobCard.vehicle_number = $scope.objJobCard.vehicleFull.vehicle_reg_no;
      $scope.objJobCard.vehicle_category = $scope.objJobCard.vehicleFull.category;
      $scope.objJobCard.vehicle_structure_name = $scope.objJobCard.vehicleFull.structure_name;
      //$scope.objJobCard.homId = $scope.objJobCard.hom.homId;
      //$scope.objJobCard.hom_short_name = $scope.objJobCard.hom.short_name;
      //$scope.objJobCard.job_card_open_date = $scope.job_card_open_date;
      delete $scope.objJobCard.branch;
      delete $scope.objJobCard.vehicleFull;

      jobCardServices.saveJobCardServ($scope.objJobCard, successPost,failure);
    } else {
      $scope.JobCardErrMsg = '';
      $scope.JobCardErrMsgCond = true;
      $scope.JobCardErrMsg = formValidationgrowlService.findError(form.$error);
      setTimeout(function(){
        if($scope.JobCardErrMsgCond){
          $scope.$apply(function() {
            $scope.JobCardErrMsgCond = false;
          });
        }
      }, 7000);
    }
  };

});

materialAdmin.controller("updateJobCardPopCtrl", function($rootScope, $scope,$state, $uibModalInstance,DateUtils,branchService,jobCardServices,growlService,formValidationgrowlService,Vehicle) {
  $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel');
  };
  $scope.upJobCard = $rootScope.forUpdateJobCard;

  //*** New Date Picker for multiple date selection in single form ****
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

  //*** New Date Picker for multiple date selection in single form ****//

  $scope.aMainType = ["Preventive","Running","Accident","Breakdown","Major","Minor","TrailerModification"];
  $scope.jobType = ["Internal","External"];
  $scope.aStatus = ["Open","Closed","Not started"];
  $scope.aFlag = ["Red","Green","Yellow"];
  //$scope.upJobCard.homId = 111;

  $scope.onVehicleSelect = function(){
    $scope.upJobCard.last_trip_number = $scope.upJobCard.vehicleFull.last_known.trip_no;
    $scope.upJobCard.driver_name = $scope.upJobCard.vehicleFull.driver_name;
  }

  let oBranch={_id:$scope.upJobCard.branchId,name:$scope.upJobCard.branchName};
  $scope.upJobCard.branch=oBranch;

  $scope.getBname=function(viewValue) {
		if(viewValue.length < 3)
			return;
		return new Promise(function (resolve, reject) {	
		let filter ={name: viewValue,trim: true}
		branchService.getBranches(filter, function success(res) {
				resolve(res.data);
			}, function (err) {
				console.log(err);
				reject([]);
			});
	});
	}

  // $scope.getRegVehicle = function(){
  //  $scope.vehicleType1 = '';
  //   function success(data) {
  //     $scope.vehicles = data.data.data;
  //     $scope.vehiclesMarket = [];
  //     $scope.vehiclesOwn = [];
  //     if($scope.vehicles && $scope.vehicles.length>0){
  //       for(i=0;i<$scope.vehicles.length;i++){
  //         if($scope.vehicles[i].is_market == false){
  //           $scope.vehiclesOwn.push($scope.vehicles[i]);
  //         } else if($scope.vehicles[i].is_market == true){
  //           $scope.vehiclesMarket.push($scope.vehicles[i]);
  //         }
  //       }
  //     }
  //     if($scope.vehiclesOwn.length>0){
  //       for(var d=0;d<$scope.vehiclesOwn.length;d++){
  //         if($scope.vehiclesOwn[d].vehicle_reg_no == $scope.upJobCard.vehicle_number){
  //           $scope.upJobCard.vehicleFull = $scope.vehiclesOwn[d];
  //         }
  //       }
  //     }
  //   };

  //   Vehicle.getAllregList({}, success);
  // };
  // $scope.getRegVehicle();

  // // get all branches function call ....
  // ($scope.getAllBranches = function(){
  //   function success(response){
  //       if(response && response.data){
  //           $scope.aBranch = response.data;
  //           if($scope.aBranch && $scope.aBranch.length>0){
  //             for(var b=0;b<$scope.aBranch.length;b++){
  //               if($scope.aBranch[b]._id == $scope.upJobCard.branchId){
  //                 $scope.upJobCard.branch = $scope.aBranch[b];
  //               }
  //             }
  //           }
  //       }
  //   }
  //   function failure(response){
  //       console.log(response);
  //   }
  //   branchService.getAllBranches({all:true},success,failure); // get all branches trim
  // })();

  $scope.upJobCard.vehicle_in_datetime=new Date($scope.upJobCard.vehicle_in_datetime);
  $scope.upJobCard.estimated_release_date=new Date($scope.upJobCard.estimated_release_date);

  $scope.updateBasicJobCard = function(form){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        $rootScope.forUpdateJobCard = response.data.data;
        var msg = response.data.message;
        swal(msg,"","success");
        //swal("Updated Successfully","","success");
        $uibModalInstance.dismiss('cancel');
        $state.reload();
      }
    }
    function failure(res){
      console.log("fail: ",res);
      var msg = res.data.message;
      swal(msg,"","error");
    }
    if(!form.$valid){
      swal("Please fill all mandatory fields","","error");
      return;
    }
    $scope.upJobCard;
    $scope.upJobCard.branchId = $scope.upJobCard.branch._id;
    $scope.upJobCard.branchName = $scope.upJobCard.branch.name;
    $scope.upJobCard.vehicle_number = $scope.upJobCard.vehicle.vehicle_reg_no;
    delete $scope.upJobCard.branch;
    delete $scope.upJobCard.vehicle;
    jobCardServices.updatejobcard($scope.upJobCard, successUpdate,failure);
  };

});

materialAdmin.controller("addContExpensesController", function($rootScope, $scope,DateUtils,constants,jobCardServices,growlService,partCategoryService,contractorService,mechanicService,taskService) {
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

  $scope.aStatus = ["Open","Closed"];

  $scope.objExpense = {};

  /*$scope.getAllParts = function(){
    function success(data) {
      $scope.aTask = data.data;
    };

    taskService.getTasksAll({}, success);
  };
  $scope.getAllParts();

  $scope.getAllMechanics = function(){
    function success(data) {
      $scope.aMechanic = data.data;
    };

    mechanicService.getMechanicsByUser({}, success);
  };
  $scope.getAllMechanics();*/

  $scope.getTaskForJobCard = function(){
    function succ(data) {
      $scope.aTaskForJobC = data.data.data;
    };

    if($scope.selectedJobCardInfoForService && $scope.selectedJobCardInfoForService.jobId){
      $scope.selTask = {};
      $scope.selTask.jobId = $scope.selectedJobCardInfoForService.jobId;
      jobCardServices.getSelTask($scope.selTask, succ);
    }
  }
  $scope.getTaskForJobCard();

  $scope.getContractorExpense = function(){
    function succ(data) {
      $scope.aContractorList = data.data.data;
    };
    function fail(data) {
      console.log("fail");
    };

    if($scope.selectedJobCardInfoForService && $scope.selectedJobCardInfoForService.jobId){
      $scope.selTask = {};
      $scope.selTask.jobId = $scope.selectedJobCardInfoForService.jobId;
      jobCardServices.getContExpense($scope.selTask, succ, fail);
    }
  }
  $scope.getContractorExpense();

  $scope.getAllSupervisor = function(){
    function success(data) {
      $scope.aSuperviser = data.data;
    };

    mechanicService.getSupervisorByUser({}, success);
  };
  $scope.getAllSupervisor();

  /*$scope.employeeEnvolved = [];
  $scope.addEmployee = function(){
    $scope.notAdd = false;
    if($scope.employeeEnvolved.length>0){
      for(var i=0;i<$scope.employeeEnvolved.length;i++){
        if($scope.employeeEnvolved[i].full_name == $scope.empEnvld.full_name){
          $scope.notAdd = true;
          swal("Already added in list","","warning");
        }
      }
    }
    if($scope.notAdd == false){
      $scope.employeeEnvolved.push($scope.empEnvld);
    }
  }

  $scope.removeEmplyee = function($index){
    $scope.employeeEnvolved.splice($index, 1);
  }*/

  /*$scope.selTaskForServ = function(){
    console.log($scope.objService.task_name);
    function success(data) {
      $scope.aSpareSugg = data.data.data;
    };

    $scope.sendData = {};
    $scope.sendData.task_name = $scope.objService.task_name.task_name;
    $scope.sendData.vehicle_models = '407';

    jobCardServices.getSpareSugg($scope.sendData, success);
  }
*/
  $scope.addReqQty = function(qty){
    $scope.qty = qty;
  }
  // selected
  //$scope.selection = [];

  // toggle selection for a given name
  /*$scope.toggleSelection = function toggleSelection(objSugg) {

      objSugg.quantity = $scope.qty;
      var idx = $scope.selection.indexOf(objSugg);


      if (idx > -1) {
        $scope.selection.splice(idx, 1); // is currently selected
      }


      else {
        $scope.selection.push(objSugg); // is newly selected
      }

  };*/

  /*$scope.removeSelPart = function($index){
    $scope.selection.splice($index, 1);
  }*/

  $scope.getAllContractor = function(){
    function success(data) {
      $scope.aContractor = data.data;
    };
    function fail(data) {
      console.log("fail");
    };

    contractorService.getContractorServ({}, success,fail);
  };
  $scope.getAllContractor();

  $scope.aContractorList=[];
  $scope.cont = {};
  $scope.addContractor = function(){
    if($scope.cont && $scope.cont.contractor_full && $scope.cont.contractor_full.name){
      $scope.notAdd = false;
      /*if($scope.aContractorList.length>0){
        for(var i=0;i<$scope.aContractorList.length;i++){
          if($scope.aContractorList[i].contractor_name == $scope.cont.contractor_full.name){
            $scope.notAdd = true;
            swal("Already added in list","","warning");
          }
        }
      }*/
      if($scope.notAdd == false){
        $scope.cont.contractor_name = $scope.cont.contractor_full.name;
        $scope.cont.contractor_id = $scope.cont.contractor_full._id;
		  delete $scope.cont.contractor_full;
        /*$scope.cont.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
        $scope.cont.jobId = $scope.selectedJobCardInfoForService.jobId;*/
		  if($scope.objExpense.supervisor_full && $scope.objExpense.supervisor_full.full_name) {
			  $scope.cont.supervisor_name = $scope.objExpense.supervisor_full.full_name;
			  $scope.cont.supervisor_employee_id = $scope.objExpense.supervisor_full._id;
		  }
		  $scope.cont.start_time = $scope.objExpense.start_datetime;
		  $scope.cont.end_time = $scope.objExpense.end_datetime;
        $scope.cont.taskId = $scope.objExpense.task_info.taskId;
        $scope.cont.task_name = $scope.objExpense.task_info.task_name;
        $scope.cont.remark = $scope.objExpense.remark;
        $scope.aContractorList.push($scope.cont);
        $scope.cont = {};
      }
    }
    $scope.cont = {};
  }

  $scope.removeContractor = function($index){
    //$scope.aContractorList.splice($index, 1);
    $scope.aContractorList[$index].deleted = true;
	$scope.addContExpenses();
  }

  $scope.addContExpenses = function(){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        var msg = response.data.message;
        swal(msg,"","success");
        var sUrl = "#!/maintenance_process/jobCardMain";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      $scope.msg = res.data.message;
      swal($scope.msg,"","error");
    }

    $scope.objExpense.jobId = $scope.selectedJobCardInfoForService.jobId;
    $scope.objExpense.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
    delete $scope.objExpense.task_info;
    if($scope.aContractorList && $scope.aContractorList.length>0){
      $scope.objExpense.contractor_expense = $scope.aContractorList;
    }

    console.log($scope.objExpense);

    jobCardServices.addExpenseServ($scope.objExpense, successUpdate,failure);
  };

});

materialAdmin.controller("addJobCardCommonController", function($rootScope,$scope,$modal,DateUtils,$localStorage,jobCardServices,formValidationgrowlService,Vehicle) {
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

  $scope.objJobCard = {};
  $scope.today = function() {
    $scope.objJobCard.vehicle_IN_Date = new Date();
    $scope.objJobCard.estimated_release_date = new Date();
  };
  $scope.today();
  $scope.jobType = ["Internal","External"];
  $scope.aStatus = ["Open","Closed"];
  $scope.aFlag = ["Red","Green","Yellow"];
  $scope.aMainType = ["Preventive","Running","Accident","Breakdown","Major","Minor","TrailerModification"];
  //$scope.objJobCard.homId = 111;
  $scope.onVehicleSelect = function(){
    $scope.objJobCard.last_trip_number = $scope.objJobCard.vehicleFull.last_known.trip_no;
    $scope.objJobCard.driver_name = $scope.objJobCard.vehicleFull.driver_name;
  }
  $scope.getRegVehicle = function(){
   $scope.vehicleType1 = '';
    function success(data) {
      $rootScope.vehicles = data.data;
      $scope.vehiclesMarket = [];
      $scope.vehiclesOwn = [];
      if($rootScope.vehicles && $rootScope.vehicles.length>0){
        for(i=0;i<$rootScope.vehicles.length;i++){
          if($rootScope.vehicles[i].is_market == false){
            $scope.vehiclesOwn.push($rootScope.vehicles[i]);
          } else if($rootScope.vehicles[i].is_market == true){
            $scope.vehiclesMarket.push($rootScope.vehicles[i]);
          }
        }
      }

      if(data.data && data.data.length > 0) {
        $rootScope.vehicle = data.data[0];
        $scope.total_pages = data.pages;
        $scope.totalItems = 15 * data.pages;

        setTimeout(function() {
            listItem = $($('.lv-item')[0]);
            listItem.addClass('grn');
        }, 500);
      }
    };

    Vehicle.getAllVehicles({}, success);
  };
  $scope.getRegVehicle();

  /*$scope.getHom = function(){
    function succ11(data) {
      $scope.aHOM = data.data;
    };
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with get HOMs","","error");
    }

    homService.getHOMs({},succ11,failure);
  }
  $scope.getHom();*/

  if($scope.enableNextTab == true){

  }else{
    $scope.enableNextTab = false;
  }

  $scope.addJobCard = function(form){
    function successPost(response){
      if(response && response.data){
        console.log(response);
        $rootScope.updateJobCardData = response.data.data;
        $scope.objJobCard = {};
        $scope.enableNextTab = true;
        var msg = response.data.message;
        swal(msg,"","success");
        var sUrl = "#!/maintenance_process/jobCard/addJobCardService";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      var msg = response.data.message;
      swal(msg,"","error");
    }
    $scope.JobCardErrMsg = '';
    $scope.JobCardErrMsgCond = false;
    if(form.$valid){
      $scope.objJobCard.vehicle_number = $scope.objJobCard.vehicleFull.vehicle_reg_no;
      //$scope.objJobCard.homId = $scope.objJobCard.hom.homId;
      //$scope.objJobCard.hom_short_name = $scope.objJobCard.hom.short_name;
      $scope.objJobCard.status = "Not started";
      $scope.objJobCard.vehicle_IN_Date = $scope.vehicle_IN_Date;
      //$scope.objJobCard.job_card_open_date = $scope.job_card_open_date;
      $scope.objJobCard.estimated_release_date = $scope.estimated_release_date;

      jobCardServices.saveJobCardServ($scope.objJobCard, successPost,failure);
    } else {
      $scope.JobCardErrMsg = '';
      $scope.JobCardErrMsgCond = true;
      $scope.JobCardErrMsg = formValidationgrowlService.findError(form.$error);
      setTimeout(function(){
        if($scope.JobCardErrMsgCond){
          $scope.$apply(function() {
            $scope.JobCardErrMsgCond = false;
          });
        }
      }, 7000);
    }
  };

});
materialAdmin.controller("addJobCardController", function($rootScope,$scope,$localStorage) {

});

materialAdmin.controller("addServiceController", function($rootScope, $scope,DateUtils,constants,jobCardServices,growlService,partCategoryService,contractorService,mechanicService,taskService) {
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

  $scope.aStatus = ["Open","Closed"];
  $scope.aPriority = ["High","Medium","Low"];
  $scope.objService = {};

  $scope.getAllParts = function(){
    function success(data) {
      $scope.aTask = data.data;
    };

    taskService.getTasksAll({}, success);
  };
  $scope.getAllParts();

  $scope.getAllMechanics = function(){
    function success(data) {
      $scope.aMechanic = data.data;
    };

    mechanicService.getMechanicsByUser({}, success);
  };
  $scope.getAllMechanics();

  $scope.getAllSupervisor = function(){
    function success(data) {
      $scope.aSuperviser = data.data;
    };

    mechanicService.getSupervisorByUser({}, success);
  };
  $scope.getAllSupervisor();

  $scope.employeeEnvolved = [];
  $scope.addEmployee = function(){
    $scope.notAdd = false;
    if($scope.employeeEnvolved.length>0){
      for(var i=0;i<$scope.employeeEnvolved.length;i++){
        if($scope.employeeEnvolved[i].full_name == $scope.empEnvld.full_name){
          $scope.notAdd = true;
          swal("Already added in list","","warning");
        }
      }
    }
    if($scope.notAdd == false){
      $scope.employeeEnvolved.push($scope.empEnvld);
    }
  }

  $scope.removeEmplyee = function($index){
    $scope.employeeEnvolved.splice($index, 1);
  }

  $scope.selTaskForServ = function(){
    console.log($scope.objService.task_name);
    function success(data) {
      $scope.aSpareSugg = data.data.data;
    };

    $scope.sendData = {};
    $scope.sendData.task_name = $scope.objService.task_name.task_name;
    $scope.sendData.vehicle_models = '407';

    jobCardServices.getSpareSugg($scope.sendData, success);
  }

  $scope.addReqQty = function(qty){
    $scope.qty = qty;
  }
  // selected
  $scope.selection = [];

  // toggle selection for a given name
  $scope.toggleSelection = function toggleSelection(objSugg) {

      objSugg.quantity = $scope.qty;
      var idx = $scope.selection.indexOf(objSugg);

      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.selection.push(objSugg);
      }

  };

  $scope.removeSelPart = function($index){
    $scope.selection.splice($index, 1);
  }

  $scope.getAllContractor = function(){
    function success(data) {
      $scope.aContractor = data.data;
    };
    function fail(data) {
      console.log("fail");
    };

    contractorService.getContractorServ({}, success,fail);
  };
  $scope.getAllContractor();

  $scope.aContractorList=[];
  $scope.cont = {};
  $scope.addContractor = function(){
    if($scope.cont && $scope.cont.contractor_full && $scope.cont.contractor_full.name){
      $scope.notAdd = false;
      /*if($scope.aContractorList.length>0){
        for(var i=0;i<$scope.aContractorList.length;i++){
          if($scope.aContractorList[i].contractor_name == $scope.cont.contractor_full.name){
            $scope.notAdd = true;
            swal("Already added in list","","warning");
          }
        }
      }*/
      if($scope.notAdd == false){
        $scope.cont.contractor_name = $scope.cont.contractor_full.name;
        delete $scope.cont.contractor_full;
        /*$scope.cont.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
        $scope.cont.jobId = $scope.selectedJobCardInfoForService.jobId;
        $scope.cont.taskId = $scope.selectedJobCardInfoForService.taskId;*/
        $scope.aContractorList.push($scope.cont);
        $scope.cont = {};
      }
    }
    $scope.cont = {};
  }

  $scope.removeContractor = function($index){
    //$scope.aContractorList.splice($index, 1);
    $scope.aContractorList[$index].deleted = true;
  }

  $scope.addJobCardService = function(){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        var msg = response.data.message;
        swal(msg,"","success");
        var sUrl = "#!/maintenance_process/jobCardMain";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      $scope.msg = res.data.message;
      swal($scope.msg,"","error");
    }

    $scope.objService.jobId = $scope.selectedJobCardInfoForService.jobId;
    $scope.objService.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
    $scope.objService.task_name = $scope.objService.task_name.task_name;
    //$scope.objService.job_id = $scope.selectedJobCardInfoForService._id;
    if($scope.objService.supervisor_full && $scope.objService.supervisor_full.full_name){
      $scope.objService.supervisor_name = $scope.objService.supervisor_full.full_name;
      $scope.objService.supervisor_employee_id = $scope.objService.supervisor_full._id;
      //$scope.objService.supervisor_id = $scope.objService.supervisor_full._id;
    }
    $scope.objService.start_datetime = $scope.objService.start_datetime;
    //$scope.objService.close_datetime = $scope.close_datetime;

    $scope.objService.spares_needed = [];
    if($scope.selection.length>0){
      for(var x=0;x<$scope.selection.length;x++){
        $scope.objService.spares_needed[x] = {};
        $scope.objService.spares_needed[x].quantity = $scope.selection[x].quantity;
        $scope.objService.spares_needed[x].spare_code = $scope.selection[x].code;
        $scope.objService.spares_needed[x].spare_name = $scope.selection[x].name;
      }
    }

    $scope.objService.mechanics_involved = [];
    if($scope.employeeEnvolved.length>0){
      for(var x=0;x<$scope.employeeEnvolved.length;x++){
        $scope.objService.mechanics_involved[x] = {};
        $scope.objService.mechanics_involved[x].name = $scope.employeeEnvolved[x].full_name;
        $scope.objService.mechanics_involved[x].employee_id = $scope.employeeEnvolved[x].employee_code;
      }
    }

    if($scope.aContractorList && $scope.aContractorList.length>0){
      $scope.objService.contractor_expense = $scope.aContractorList;
    }

    console.log($scope.objService);

    jobCardServices.saveJobCardTaskServ($scope.objService, successUpdate,failure);
  };

});

materialAdmin.controller("editServiceController", function($rootScope, $scope,DateUtils,constants,jobCardServices,$uibModal,growlService,partCategoryService,contractorService,mechanicService,taskService) {

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

  $scope.aStatus = ["Open","Closed"];
  $scope.aPriority = ["High","Medium","Low"];
  $scope.objService = $rootScope.selTaskData;
  $scope.cont = {};
  //$scope.objService.priority = $rootScope.selTaskData.priority;
  //$scope.objService.start_datetime = $rootScope.selTaskData.start_datetime;
  //$scope.objService.remarks = $rootScope.selTaskData.remarks;
  $scope.employeeEnvolved = [];
  if($rootScope.selTaskData && $rootScope.selTaskData.mechanics_involved && $rootScope.selTaskData.mechanics_involved.length>0){
    //$scope.employeeEnvolved = $rootScope.selTaskData.mechanics_involved;
    for(var c=0;c<$rootScope.selTaskData.mechanics_involved.length;c++){
      $scope.employeeEnvolved[c] = {};
      $scope.employeeEnvolved[c].full_name = $rootScope.selTaskData.mechanics_involved[c].name;
      $scope.employeeEnvolved[c]._id = $rootScope.selTaskData.mechanics_involved[c]._id;
    }
  }else{
    $scope.employeeEnvolved = [];
  }
  //

  $scope.getAllParts = function(){
    function success(data) {
      $scope.aTask = data.data;
    };

    taskService.getTasksAll({}, success);
  };
  $scope.getAllParts();

  $scope.getAllMechanics = function(){
    function success(data) {
      $scope.aMechanic = data.data;
    };

    mechanicService.getMechanicsByUser({}, success);
  };
  $scope.getAllMechanics();

  $scope.getAllSupervisor = function(){
    function success(data) {
      $scope.aSuperviser = data.data;
      if($scope.aSuperviser && $scope.aSuperviser.length>0){
        for(var s=0;s<$scope.aSuperviser.length;s++){
          if($scope.aSuperviser[s]._id == $rootScope.selTaskData.supervisor_employee_id){
            $scope.objService.supervisor_full = $scope.aSuperviser[s];
          }
        }
      }
    };

    mechanicService.getSupervisorByUser({}, success);
  };
  $scope.getAllSupervisor();

  $scope.addEmployee = function(){
    $scope.notAdd = false;
    if($scope.employeeEnvolved.length>0){
      for(var i=0;i<$scope.employeeEnvolved.length;i++){
        if($scope.employeeEnvolved[i].full_name == $scope.empEnvld.full_name){
          $scope.notAdd = true;
          swal("Already added in list","","warning");
        }
      }
    }
    if($scope.notAdd == false){
      $scope.employeeEnvolved.push($scope.empEnvld);
    }
  }

  $scope.removeEmplyee = function($index){
    $scope.employeeEnvolved.splice($index, 1);
  }

  /*$scope.selTaskForServ = function(){
    console.log($scope.objService.task_name);
    function success(data) {
      $scope.aSpareSugg = data.data.data;
    };

    $scope.sendData = {};
    $scope.sendData.task_name = $scope.objService.task_name.task_name;
    $scope.sendData.vehicle_models = '407';

    jobCardServices.getSpareSugg($scope.sendData, success);
  }*/

  $scope.addReqQty = function(qty){
    $scope.qty = qty;
  }
  // selected
  //$scope.selection = [];

  // toggle selection for a given name
  /*$scope.toggleSelection = function toggleSelection(objSugg) {

      objSugg.quantity = $scope.qty;
      var idx = $scope.selection.indexOf(objSugg);

      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.selection.push(objSugg);
      }

  };*/

  /*$scope.removeSelPart = function($index){
    $scope.selection.splice($index, 1);
  }*/

  $scope.getAllContractor = function(){
    function success(data) {
      $scope.aContractor = data.data;
    };
    function fail(data) {
      console.log("fail");
    };

    contractorService.getContractorServ({}, success,fail);
  };
  $scope.getAllContractor();

  if($rootScope.selTaskData){
    $scope.getContractorExpense = function(){
      function success(data) {
        $scope.aContractorList = data.data.data;
      };

      function fail(data) {
        console.log("fail");
      };

      var dt = {};
      dt.taskId = $rootScope.selTaskData.taskId;
      jobCardServices.getTasksContractorExpense(dt, success,fail);
    };
    $scope.getContractorExpense();
  }

  if($scope.aContractorList && $scope.aContractorList.length>0){

  }else{
    $scope.aContractorList=[];
  }

  $scope.addContractor = function(){
    if($scope.cont && $scope.cont.contractor_full && $scope.cont.contractor_full.name){
      $scope.notAdd = false;
      /*if($scope.aContractorList.length>0){
        for(var i=0;i<$scope.aContractorList.length;i++){
          if($scope.aContractorList[i].contractor_name == $scope.cont.contractor_full.name){
            $scope.notAdd = true;
            swal("Already added in list","","warning");
          }
        }
      }*/
      if($scope.notAdd == false){
        $scope.cont.contractor_name = $scope.cont.contractor_full.name;
        delete $scope.cont.contractor_full;
        /*$scope.cont.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
        $scope.cont.jobId = $scope.selectedJobCardInfoForService.jobId;
        $scope.cont.taskId = $scope.selectedJobCardInfoForService.taskId;*/
        $scope.aContractorList.push($scope.cont);
        $scope.cont = {};
      }
    }
    $scope.cont = {};
  }

  $scope.removeContractor = function($index){
    //$scope.aContractorList.splice($index, 1);
    $scope.aContractorList[$index].deleted = true;
  }

  $scope.reviewServiceSlip = function(){
    $rootScope.previewData = {};
    $rootScope.previewData.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
    $rootScope.previewData.jobId = $scope.selTaskData.jobId;
    $rootScope.previewData.job_type = $scope.selectedJobCardInfoForService.job_type;
    $rootScope.previewData.branchName = $scope.selectedJobCardInfoForService.branchName;
      $rootScope.previewData.contractorData = [];
      if($scope.aContractorList && $scope.aContractorList.length>0){
        for(var t=0;t<$scope.aContractorList.length;t++){
          $rootScope.previewData.contractorData[t] = {};
          $rootScope.previewData.contractorData[t].contractor_name = $scope.aContractorList[t].contractor_name;
          $rootScope.previewData.contractorData[t].bill_no = $scope.aContractorList[t].bill_number;
          $rootScope.previewData.contractorData[t].task_name = $scope.aContractorList[t].task_name;
          $rootScope.previewData.contractorData[t].amount = $scope.aContractorList[t].amount;
          $rootScope.previewData.contractorData[t].remark = $scope.aContractorList[t].remark;
        }
      }
    $rootScope.previewData.created_by = $scope.selTaskData.created_by_name;
    $rootScope.previewData.created_at = $scope.selTaskData.created_at;
    $rootScope.previewData.userBy = $scope.selTaskData.last_modified_by_name;
    $rootScope.previewData.printDate = new Date();
    var modalInstance = $uibModal.open({
        templateUrl: 'maintenance/views/jobCard/previewServicePop.html',
        controller: 'prevServiceCtrl'
    });
  }

  $scope.closeServIn = function(){
    function successClose(response){
      if(response && response.data){
        console.log(response);
        var msg = response.data.message;
        swal(msg,"","success");
        var sUrl = "#!/maintenance_process/jobCardMain";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      $scope.msg = res.data.message;
      swal($scope.msg,"","error");
    }

    var closeObj = {};
    closeObj._id = $scope.selTaskData._id;
    closeObj.status = 'Closed';
    jobCardServices.updateJobCardTaskServ(closeObj, successClose,failure);
  }

  $scope.updateJobCardService = function(){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        var msg = response.data.message;
        swal(msg,"","success");
        var sUrl = "#!/maintenance_process/jobCardMain";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      $scope.msg = res.data.message;
      swal($scope.msg,"","error");
    }

    $scope.objService.jobId = $scope.selTaskData.jobId;
    $scope.objService.vehicle_number = $scope.selectedJobCardInfoForService.vehicle_number;
    //$scope.objService.task_name = $scope.objService.task_name.task_name;
    //$scope.objService.job_id = $scope.selectedJobCardInfoForService._id;
    if($scope.objService.supervisor_full && $scope.objService.supervisor_full.full_name){
      $scope.objService.supervisor_name = $scope.objService.supervisor_full.full_name;
      $scope.objService.supervisor_employee_id = $scope.objService.supervisor_full._id;
      //$scope.objService.supervisor_id = $scope.objService.supervisor_full._id;
    }
    //$scope.objService.start_datetime = $scope.objService.start_datetime;
    //$scope.objService.close_datetime = $scope.close_datetime;

    /*$scope.objService.spares_needed = [];
    if($scope.selection.length>0){
      for(var x=0;x<$scope.selection.length;x++){
        $scope.objService.spares_needed[x] = {};
        $scope.objService.spares_needed[x].quantity = $scope.selection[x].quantity;
        $scope.objService.spares_needed[x].spare_code = $scope.selection[x].code;
        $scope.objService.spares_needed[x].spare_name = $scope.selection[x].name;
      }
    }*/

    $scope.objService.mechanics_involved = [];
    if($scope.employeeEnvolved.length>0){
      for(var x=0;x<$scope.employeeEnvolved.length;x++){
        $scope.objService.mechanics_involved[x] = {};
        $scope.objService.mechanics_involved[x].name = $scope.employeeEnvolved[x].full_name;
        $scope.objService.mechanics_involved[x].employee_id = $scope.employeeEnvolved[x]._id;
      }
    }

    if($scope.aContractorList && $scope.aContractorList.length>0){
      $scope.objService.contractor_expense = $scope.aContractorList;
    }

    console.log($scope.objService);

    jobCardServices.updateJobCardTaskServ($scope.objService, successUpdate,failure);
  };

});

materialAdmin.controller("prevServiceCtrl", function($rootScope, $scope,$localStorage,clientService, $uibModalInstance,DateUtils,branchService,jobCardServices,growlService,formValidationgrowlService,Vehicle) {
  $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel');
  };

  $scope.dataForPrev = $rootScope.previewData;
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




});


materialAdmin.controller("updateJobCardCommonController", function($rootScope,$scope,constants,formValidationgrowlService,Vehicle,jobCardServices) {
  $scope.upJobCard = $rootScope.forUpdateJobCard;
  /*if($scope.upJobCard.status == 'true'){
    $scope.upJobCard.sts2 = 'Open';
  }else{
    $scope.upJobCard.sts2 = 'Closed';
  }*/
  //*** New Date Picker for multiple date selection in single form ****
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

  //*** New Date Picker for multiple date selection in single form ****//

  $scope.aMainType = ["Preventive","Running","Accident","Breakdown","Major","Minor","TrailerModification"];
  $scope.jobType = ["Internal","External"];
  $scope.aStatus = ["Open","Closed","Not started"];
  $scope.aFlag = ["Red","Green","Yellow"];
  //$scope.upJobCard.homId = 111;

  $scope.onVehicleSelect = function(){
    $scope.upJobCard.last_trip_number = $scope.upJobCard.vehicleFull.last_known.trip_no;
    $scope.upJobCard.driver_name = $scope.upJobCard.vehicleFull.driver_name;
  }
  $scope.getRegVehicle = function(){
   $scope.vehicleType1 = '';
    function success(data) {
      $scope.vehicles = data.data;
      $scope.vehiclesMarket = [];
      $scope.vehiclesOwn = [];
      if($scope.vehicles && $scope.vehicles.length>0){
        for(i=0;i<$scope.vehicles.length;i++){
          if($scope.vehicles[i].is_market == false){
            $scope.vehiclesOwn.push($scope.vehicles[i]);
          } else if($scope.vehicles[i].is_market == true){
            $scope.vehiclesMarket.push($scope.vehicles[i]);
          }
        }
      }
      if($scope.vehiclesOwn.length>0){
        for(var d=0;d<$scope.vehiclesOwn.length;d++){
          if($scope.vehiclesOwn[d].vehicle_reg_no == $scope.upJobCard.vehicle_number){
            $scope.upJobCard.vehicleFull = $scope.vehiclesOwn[d];
          }
        }
      }
    };

    Vehicle.getAllVehicles({}, success);
  };
  $scope.getRegVehicle();

  $scope.updateBasicJobCard = function(form){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        $rootScope.forUpdateJobCard = response.data.data;
        swal("Updated Successfully","","success");
        //var sUrl = "#!/booking_manage/updateBooking/updateBookingExtra";
        //$rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with updation","","error");
    }

    $scope.upJobCard;
    jobCardServices.updatejobcard($scope.upJobCard, successUpdate,failure);
  };

});

materialAdmin.controller("updateJobCardTaskController", function($rootScope, $scope,$uibModal,jobCardServices) {
  $scope.updateTaskData = $rootScope.forUpdateJobCard;
  $rootScope.getTaskForJobCard = function(){
    function succ(data) {
      $scope.aTaskForJobC = data.data.data;
      setTimeout(function(){
         listItem = $($('.selectItem22')[0]);
         listItem.addClass('grn');
        }, 500);
      $scope.selectedTaskInfo = data.data.data[0];
    };

    $scope.selTask = {};
    $scope.selTask.jobId = $scope.updateTaskData.jobId;
    jobCardServices.getSelTask($scope.selTask, succ);
  }
  $rootScope.getTaskForJobCard();

  $scope.getTaskSingle = function(oTaskData ,index){
    $scope.selectedTaskInfo = oTaskData;
    listItem = $($('.selectItem22')[index]);
    listItem.siblings().removeClass('grn');
    listItem.addClass('grn');
    $scope.getTaskSpareForJC();
  }

  $scope.getTaskSpareForJC = function(){
    function succ(data) {
      $scope.spares_allotted = data.data.data;
      /*setTimeout(function(){
         listItem = $($('.selectItem22')[0]);
         listItem.addClass('grn');
        }, 500);*/
      $scope.selectedTaskInfo.spares_allotted = $scope.spares_allotted;
    };

    $scope.selTask = {};
    $scope.selTask.taskId = $scope.selectedTaskInfo.taskId;
    jobCardServices.getSelTaskSpare($scope.selTask, succ);
  }

  $scope.addNewTask = function(){
    var modalInstance = $uibModal.open({
        templateUrl: 'maintenance/views/jobCard/addTaskPop.html',
        controller: 'addNewTaskWhenUpdatePop'
    });
  }


});
materialAdmin.controller("addNewTaskWhenUpdatePop", function($rootScope, $scope, $uibModalInstance,DateUtils,jobCardServices,growlService,partCategoryService,mechanicService,taskService) {
  $scope.closeModal = function() {
      $uibModalInstance.dismiss('cancel');
  };
  $scope.jobCardData = $rootScope.forUpdateJobCard;

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

  $scope.updateJobCardData = $rootScope.forUpdateJobCard;
  $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
  //$scope.aStatus = ["Open","Closed"];
  $scope.aPriority = ["High","Medium","Low"];
  $scope.objJcTaskNew = {};

  $scope.getAllParts = function(){
    function success(data) {
      $scope.aTask = data.data;
    };

    taskService.getTasks({}, success);
  };
  $scope.getAllParts();

  $scope.getAllMech = function(){
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
      //$scope.aSuperviser = data.data;
    };

    mechanicService.getMechanicsByUser({}, success);
  };
  $scope.getAllMech();

  $scope.getAllSupervisor = function(){
    function success(data) {
      $scope.aSuperviser = data.data;
      /*$scope.aMechanic = [];
      if(data.data.length>0){
        for(var s=0;s<data.data.length;s++){
          if(data.data[s].employee_type == 'Mechanic'){
            $scope.aMechanic.push(data.data[s]);
          }else if(data.data[s].employee_type == 'Supervisor'){
            $scope.aSuperviser.push(data.data[s]);
          }
        }
      }*/
      //$scope.aSuperviser = data.data;
    };

    mechanicService.getSupervisorByUser({}, success);
  };
  $scope.getAllSupervisor();

  $scope.employeeEnvolved = [];
  $scope.addEmployee = function(){
    $scope.notAdd = false;
    if($scope.employeeEnvolved.length>0){
      for(var i=0;i<$scope.employeeEnvolved.length;i++){
        if($scope.employeeEnvolved[i].full_name == $scope.empEnvld.full_name){
          $scope.notAdd = true;
          swal("Already added in list","","warning");
        }
      }
    }
    if($scope.notAdd == false){
      $scope.employeeEnvolved.push($scope.empEnvld);
    }
  }

  $scope.removeEmplyee = function($index){
    $scope.employeeEnvolved.splice($index, 1);
  }

  $scope.selTaskForServ = function(){
    console.log($scope.objJcTaskNew.task_name);
    function success(data) {
      $scope.aSpareSugg = data.data.data;
    };

    $scope.sendData = {};
    $scope.sendData.task_name = $scope.objJcTaskNew.task_name.task_name;
    if($scope.updateJobCardData.vehicle_models){
      $scope.sendData.vehicle_models = $scope.updateJobCardData.vehicle_models;
    }

    jobCardServices.getSpareSugg($scope.sendData, success);
  }

  $scope.addReqQty = function(qty){
    $scope.qty = qty;
  }
  // selected
  $scope.selection = [];

  // toggle selection for a given name
  $scope.toggleSelection = function toggleSelection(objSugg) {

      objSugg.quantity = $scope.qty;
      var idx = $scope.selection.indexOf(objSugg);

      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.selection.push(objSugg);
      }

  };

  $scope.removeSelPart = function($index){
    $scope.selection.splice($index, 1);
  }

  /*$scope.againGetTaskForJobCard = function(){
    function succ(data) {
      $scope.aTaskForJobC = data.data.data;
      setTimeout(function(){
         listItem = $($('.selectItem22')[0]);
         listItem.addClass('grn');
        }, 500);
      $scope.selectedTaskInfo = data.data.data[0];
    };

    $scope.selTask = {};
    $scope.selTask.jobId = $scope.forUpdateJobCard.jobId;
    jobCardServices.getSelTask($scope.selTask, succ);
  }*/

  $scope.addJobCardService = function(){
    function successUpdate(response){
      if(response && response.data){
        console.log(response);
        var msg = response.data.message;
        swal(msg,"","success");
        $uibModalInstance.dismiss('cancel');
        //$scope.againGetTaskForJobCard();
        $rootScope.getTaskForJobCard();
      }
    }
    function failure(res){
      console.log("fail: ",res);
      $scope.msg = res.data.message;
      swal($scope.msg,"","error");
    }

    $scope.objJcTaskNew.jobId = $scope.updateJobCardData.jobId;
    $scope.objJcTaskNew.homId = $scope.updateJobCardData.homId;
    $scope.objJcTaskNew.status = 'Open';
    $scope.objJcTaskNew.task_name = $scope.objJcTaskNew.task_name.task_name;
    $scope.objJcTaskNew.supervisor_name = $scope.supervisor_full.full_name;
    $scope.objJcTaskNew.supervisor_employee_id = $scope.supervisor_full.userId;
    $scope.objJcTaskNew.supervisor_id = $scope.supervisor_full._id;
    $scope.objJcTaskNew.start_datetime = $scope.start_datetime;
    $scope.objJcTaskNew.close_datetime = $scope.close_datetime;

    $scope.objJcTaskNew.spares_needed = [];
    if($scope.selection.length>0){
      for(var x=0;x<$scope.selection.length;x++){
        $scope.objJcTaskNew.spares_needed[x] = {};
        $scope.objJcTaskNew.spares_needed[x].quantity = $scope.selection[x].quantity;
        $scope.objJcTaskNew.spares_needed[x].spare_code = $scope.selection[x].code;
        $scope.objJcTaskNew.spares_needed[x].spare_name = $scope.selection[x].name;
      }
    }

    $scope.objJcTaskNew.mechanics_involved = [];
    if($scope.employeeEnvolved.length>0){
      for(var x=0;x<$scope.employeeEnvolved.length;x++){
        $scope.objJcTaskNew.mechanics_involved[x] = {};
        $scope.objJcTaskNew.mechanics_involved[x].name = $scope.employeeEnvolved[x].full_name;
        $scope.objJcTaskNew.mechanics_involved[x].employee_id = $scope.employeeEnvolved[x].employee_code;
      }
    }

    console.log($scope.objJcTaskNew);

    jobCardServices.saveJobCardTaskServ($scope.objJcTaskNew, successUpdate,failure);
  };
});
