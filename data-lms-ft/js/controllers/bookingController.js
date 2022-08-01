materialAdmin.controller("bookingCommonController", function($rootScope,$modal,$localStorage, $scope,DateUtils,bookingServices,ReportService) {
  $rootScope.forUpdateBooking = {};
  var lastFilter;
  $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.pageChanged = function() {
     $scope.getBooking(true);
   };
  if($localStorage.ft_data.userLoggedIn){
    $rootScope.logInUser = $localStorage.ft_data.userLoggedIn;
  }
  //$scope.aBranch = ["Delhi","Dplah","Indore","Ujjain","Panipat","Jammu","Shajapur"];
  $scope.getAllBranchSelect();
  //$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Domestic – Containerized","Import - Cargo","Export – Cargo","Domestic – Cargo","Empty - Containerized","Empty - Vehicle","Transporter Booking"];

  //$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Import - Loose Cargo","Export – Loose cargo","Container FS","Container FDS","Domestic – Loose cargo"];
  $scope.aApprovearray = ["Approve","Reject","Cancel"];
  $scope.aStatus = ["Pending","Approve","Reject","Cancel"];
  $scope.editModeBooking = function(){
    if($scope.selectedBookingInfo){
      $rootScope.forUpdateBooking = $scope.selectedBookingInfo;
      var bUrl = "#!/booking_manage/updateBooking/updateBookingBasic";
      $rootScope.redirect(bUrl);
    }else{
      alert("Please Select Booking First !!!");
    }
  }
  $scope.getBookingSingle = function(oBookingData ,index){
    $rootScope.selectedBookingInfoForService = oBookingData;
    $scope.selectedBookingInfo = oBookingData;
    $scope.aApprov = [];
    for(i=0;i<$scope.aApprovearray.length;i++){
         if($scope.selectedBookingInfo.booking_status && $scope.selectedBookingInfo.booking_status.status != $scope.aApprovearray[i]){
            $scope.aApprov.push($scope.aApprovearray[i]);
         }
      }
    listItem = $($('.selectItem')[index]);
    listItem.siblings().removeClass('grn');
    listItem.addClass('grn');
    if(!$scope.selectedBookingInfo.booking_date){
      $scope.selectedBookingInfo.booking_date = '';
      $scope.selectedBookingInfo.booking_date = new Date();
      $scope.selectedBookingInfo.booking_date = moment($scope.selectedBookingInfo.booking_date).format('LLL');
    }else{
      $scope.selectedBookingInfo.booking_date = moment($scope.selectedBookingInfo.booking_date).format('LLL');
    }
    if(!$scope.selectedBookingInfo.last_date_of_dispatch){
      $scope.selectedBookingInfo.last_date_of_dispatch = '';
      $scope.selectedBookingInfo.last_date_of_dispatch = new Date();
      $scope.selectedBookingInfo.last_date_of_dispatch = moment($scope.selectedBookingInfo.last_date_of_dispatch).format('LLL');
    }else{
      $scope.selectedBookingInfo.last_date_of_dispatch = moment($scope.selectedBookingInfo.last_date_of_dispatch).format('LLL');
    }
    if($scope.selectedBookingInfo.info.length == 0){
      $scope.infoCon = [];
      for(var s=0;s<$scope.selectedBookingInfo.no_containers;s++){
        $scope.infoCon[s] = {};
        $scope.infoCon[s].item_no = s+1;
        $scope.infoCon[s].container_no = '';
        $scope.infoCon[s].size = $scope.selectedBookingInfo.route.rates.vehicle_type;
        $scope.infoCon[s].weight = {};
        $scope.infoCon[s].weight.value = 0;
        $scope.infoCon[s].weight.unit = 'tonne';$scope.selectedBookingInfo.boe_weight.unit;
        $scope.infoCon[s].loading_yard = '';
        $scope.infoCon[s].offloading_yard = '';
        $scope.infoCon[s].value = $scope.selectedBookingInfo.boe_value/$scope.selectedBookingInfo.no_containers;
        $scope.infoCon[s].documents = [];
        if($scope.selectedBookingInfo.documents_required.length>0){
          for(var t=0; t<$scope.selectedBookingInfo.documents_required.length;t++){
            $scope.infoCon[s].documents[t] = {};
            $scope.infoCon[s].documents[t].name = $scope.selectedBookingInfo.documents_required[t];
            $scope.infoCon[s].documents[t].identity  = $scope.selectedBookingInfo.documents_required[t] || 'Doc';
          }
        }
        $scope.selectedBookingInfo.info[s] = $scope.infoCon[s];
      }
      $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
    }
    $scope.consignerName = $scope.selectedBookingInfo.consigner_name;
    $scope.consigneeName = $scope.selectedBookingInfo.consignee_name;
    $scope.chaName = $scope.selectedBookingInfo.cha_name;
    $scope.billing = $scope.selectedBookingInfo.billing_party_name;
    $scope.transporter = $scope.selectedBookingInfo.transporter_name;
    $scope.getDoc(oBookingData);
  }

  function prepareFilterObject(isPagination){
    var myFilter = {};
    if($scope.booking && $scope.booking.length<=5){
      myFilter.booking_no = $scope.booking;
    } else if($scope.booking && $scope.booking.length>5){
      myFilter.bookingId = $scope.booking;
    }
    if($scope.bookingType){
      myFilter.booking_type = $scope.bookingType;
    } /*else if(!$scope.bookingType){
      myFilter.booking_type = '';
    }*/
    if($scope.boe_no){
      myFilter.boe_no = $scope.boe_no;
     }
    if($scope.bookingCustomer && $scope.bookingCustomer.name){
      myFilter.customer_id = $scope.bookingCustomer._id;
     }
    if($scope.branch){
      myFilter.branch = $scope.branch;
     }
    if($scope.start_date){
      myFilter.start_date = $scope.start_date;
     }
    if($scope.end_date){
      myFilter.end_date = $scope.end_date;
     }
     if($scope.searchBy){
      myFilter.status = $scope.searchBy;
     }
    if(isPagination && $scope.currentPage){
       myFilter.skip = $scope.currentPage;
      }

    return myFilter;
  };

  $scope.getBooking = function(isPagination){
   function success(data) {
    if(data.data && data.data.data){
      setTimeout(function(){
       listItem = $($('.selectItem')[0]);
       listItem.addClass('grn');
      }, 500);
      $scope.aBookings = data.data.data;
      $rootScope.selectedBookingInfoForService = $scope.aBookings[0];
      $scope.selectedBookingInfo = $scope.aBookings[0];
      $scope.total_pages = data.pages;
      $scope.totalItems = 15*data.pages;
      $scope.aApprov = [];
      for(i=0;i<$scope.aApprovearray.length;i++){
         if($scope.selectedBookingInfo.booking_status && $scope.selectedBookingInfo.booking_status.status != $scope.aApprovearray[i]){
            $scope.aApprov.push($scope.aApprovearray[i]);
         }
      }
    }
    if(data.data && data.data.data && data.data.data.length>0){
      setTimeout(function(){
       listItem = $($('.selectItem')[0]);
       listItem.addClass('grn');
      }, 500);
      $scope.aBookings = data.data.data;
      $rootScope.selectedBookingInfoForService = $scope.aBookings[0];
      $scope.selectedBookingInfo = $scope.aBookings[0];
      if(!$scope.selectedBookingInfo.booking_date){
        $scope.selectedBookingInfo.booking_date = '';
        $scope.selectedBookingInfo.booking_date = new Date();
        $scope.selectedBookingInfo.booking_date = moment($scope.selectedBookingInfo.booking_date).format('LLL');
      }else{
        $scope.selectedBookingInfo.booking_date = moment($scope.selectedBookingInfo.booking_date).format('LLL');
      }
      if(!$scope.selectedBookingInfo.last_date_of_dispatch){
        $scope.selectedBookingInfo.last_date_of_dispatch = '';
        $scope.selectedBookingInfo.last_date_of_dispatch = new Date();
        $scope.selectedBookingInfo.last_date_of_dispatch = moment($scope.selectedBookingInfo.last_date_of_dispatch).format('LLL');
      }else{
        $scope.selectedBookingInfo.last_date_of_dispatch = moment($scope.selectedBookingInfo.last_date_of_dispatch).format('LLL');
      }
      if($scope.selectedBookingInfo.info.length == 0){
        $scope.infoCon = [];
        for(var s=0;s<$scope.selectedBookingInfo.no_containers;s++){
        //for(var s=0;s<5;s++){
          $scope.infoCon[s] = {};
          $scope.infoCon[s].item_no = s+1;
          $scope.infoCon[s].container_no = '';
          $scope.infoCon[s].size = $scope.selectedBookingInfo.route.rates.vehicle_type;
          $scope.infoCon[s].weight = {};
          $scope.infoCon[s].weight.value = 0;
          $scope.infoCon[s].weight.unit = 'tonne';// $scope.selectedBookingInfo.boe_weight? $scope.selectedBookingInfo.boe_weight.unit : 0;
          $scope.infoCon[s].loading_yard = '';
          $scope.infoCon[s].offloading_yard = '';
          $scope.infoCon[s].value = $scope.selectedBookingInfo.boe_value/$scope.selectedBookingInfo.no_containers;
          $scope.infoCon[s].documents = [];
          if($scope.selectedBookingInfo.documents_required.length>0){
            for(var t=0; t<$scope.selectedBookingInfo.documents_required.length;t++){
              $scope.infoCon[s].documents[t] = {};
              $scope.infoCon[s].documents[t].name = $scope.selectedBookingInfo.documents_required[t];
              $scope.infoCon[s].documents[t].identity  = $scope.selectedBookingInfo.documents_required[t] || 'Doc';
            }
          }
          $scope.selectedBookingInfo.info[s] = $scope.infoCon[s];
        }
        //$scope.aSizeOfVehicle = $scope.selectedBookingInfo.route.rates;
        $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
      }
      $scope.consignerName = $scope.selectedBookingInfo.consigner_name;
      $scope.consigneeName = $scope.selectedBookingInfo.consignee_name;
      $scope.chaName = $scope.selectedBookingInfo.cha_name;
      $scope.billing = $scope.selectedBookingInfo.billing_party_name;
      $scope.transporter = $scope.selectedBookingInfo.transporter_name;
      $scope.getDoc($scope.selectedBookingInfo);
      if($scope.aBookings.length > 0){
        for(var p=0;p<$scope.aBookings.length;p++){
          if($scope.aBookings[p].booking_date){
            $scope.aBookings[p].booking_date = moment($scope.aBookings[p].booking_date).format('LLL');
          }
          if($scope.aBookings[p].boe_date){
            $scope.aBookings[p].boe_date = moment($scope.aBookings[p].boe_date).format('LLL');
          }
          if($scope.aBookings[p].do_validity){
            $scope.aBookings[p].do_validity = moment($scope.aBookings[p].do_validity).format('LLL');
          }
          if($scope.aBookings[p].gatepass_validity){
            $scope.aBookings[p].gatepass_validity = moment($scope.aBookings[p].gatepass_validity).format('LLL');
          }
          if($scope.aBookings[p].factory_invoice_date){
            $scope.aBookings[p].factory_invoice_date = moment($scope.aBookings[p].factory_invoice_date).format('LLL');
          }
          if($scope.aBookings[p].shipping_bill_date){
            $scope.aBookings[p].shipping_bill_date = moment($scope.aBookings[p].shipping_bill_date).format('LLL');
          }
          if($scope.aBookings[p].customer_invoice_date){
            $scope.aBookings[p].customer_invoice_date = moment($scope.aBookings[p].customer_invoice_date).format('LLL');
          }
        }
      }
      //console.log(data);
     }
    };
   function failure(res){
       console.log("fail: ",res);
       swal("Some error with GET booking.","","error");
    }
    var oFilter = prepareFilterObject(isPagination);
    lastFilter = oFilter;
    bookingServices.getAllBookings(oFilter,success,failure);
  };
  $scope.getBooking();

  $scope.downloadReport = function(){
      ReportService.getBookingReport(lastFilter, function(data) {
          var a = document.createElement('a');
          a.href = data.data.url;
          a.download = data.data.url;
          a.target = '_blank';
          a.click();
      });
  }

  //Changes By
  $rootScope.getAllUpdatedBooking = function(){
    $scope.getBooking();
  }

  $scope.getCustomer = function(){
   function success(data) {
      $scope.aCustomer = data.data;
    };
   bookingServices.getAllCustomers(success);
  };
  $scope.getCustomer();

  $scope.getDoc = function(bookingICargo){
    if(bookingICargo.route && bookingICargo.route.rates){
       $scope.aSizeOfVehicle = bookingICargo.route.rates;
    }
    var bookingloop = bookingICargo.documents_required;
    $scope.documents = [];
     for(i=0;i<bookingloop.length;i++){
         var dataObj = {};
         dataObj.name = bookingloop[i];
         dataObj.identity = '';
         $scope.documents.push(dataObj);
     }
  };

  $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
  $scope.aShippingLine = ["MGR","ALB","ASL"];
  $scope.cargo = {};
  function success(data) {
    $scope.aCustomersforDetails = data.data;
  };

  $scope.getNameforOtherDetails = function(name){
    if(name && name.length>1){
      var otherDetailsName = name;
      bookingServices.getAllCustomersforDetails(otherDetailsName, success);
    }
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
  $scope.option = function(approveData) {
     $rootScope.approveData = approveData;
  };

  $scope.approveAction = function(selectedBooking) {
      if(selectedBooking){
        $rootScope.selectedBooking = selectedBooking;
      } else if($rootScope.selectedBookingInfoForService){
        $rootScope.selectedBooking = $rootScope.selectedBookingInfoForService;
      }

      /*if($rootScope.approveData == 'Approve'){
          $scope.data = {};
          $scope.data.booking_status = {};
          $scope.data.booking_status.status = $rootScope.approveData;

          if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.role == 'approve_admin' && $rootScope.selectedBooking && $rootScope.selectedBooking._id){
            bookingServices.approveUpdateBooking($scope.data, successPost,failure);
          }
       }  else {
      */
        $scope.openModal('views/bookings/approveBooking.html');
      //}
    };
});


materialAdmin.controller("addBookingCommonController", function($rootScope,$scope,$uibModal,constants,growlService,$localStorage,bookingServices,Routes,SLDOServices,formValidationgrowlService) {
  $scope.addRoute = function() {
    //console.log("Hi, i am here!!");
    var modalInstance = $uibModal.open({
            templateUrl: 'views/bookings/addNewRouteModel.html',
            controller: 'bookingNewRoutePopUpCtrl',
            //controller: 'registerRouteController',
        });

        modalInstance.result.then(function() {
          $scope.getCustomersRoutes();
        }, function(data) {
            if (data != 'cancel') {
              $scope.getCustomersRoutes();
              //swal("Oops!", data.data.message, "error")
            }
        });
  };
  $scope.addNewVehicleType = function() {
    //console.log("Hi, i am here!!");
    var modalInstance = $uibModal.open({
            templateUrl: 'views/bookings/addNewVehicleTypeModel.html',
            controller: 'bookingNewVehicleTypePopUpCtrl',
        });

        modalInstance.result.then(function() {
            $scope.getAllVehType();
        }, function(data) {
            if (data != 'cancel') {
                $scope.getAllVehType();
                swal("Oops!", data.data.message, "error")
            }
        });
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

  //************* New Date Picker for multiple date selection in single form ******************//
  //*** doc selected ****//
    $scope.example5model = [];
    //console.log($scope.example5model);
    $scope.example5data = [
      {id: 1, label: "BOE No"},
      {id: 2, label: "Commissioner Certificate"},
      {id: 3, label: "Form 31"},
      {id: 4, label: "Form 16"},
      {id: 5, label: "Form 47"},
      {id: 6, label: "Form 18"},
      {id: 7, label: "Form 36"},
      {id: 8, label: "Form 38"},
      {id: 9, label: "IGM. Copy"},
      {id: 10, label: "Invoice No."},
      {id: 11, label: "Sale Tax Form"}
    ];
    $scope.example5settings = {
      showCheckAll: false,
      showUncheckAll: false,
      externalIdProp: ''
    };
    $scope.example5customTexts = {buttonDefaultText: 'Select Doc'};
  //** doc array making end ***//
  $scope.oBooking = {};
  $scope.oBookingExportContainer = {};
  $scope.oBookingLooseCargo = {};
  $scope.oBookingExportCargo = {};
  $scope.oBookingDomesticCargo = {};
  $scope.oBookingContainerFS = {};
  $scope.oBookingContainerFDS = {};
  $scope.oBookingEmpty = {};
  $scope.oBooking.booking_date = new Date();
  $scope.getCustomers = function(){
   function success(data) {
      $scope.aCustomers = data.data;
    };
   bookingServices.getAllCustomers(success);
  };
  $scope.getCustomers();

  $scope.getRoute = function(viewValue){
        function oSuc(response){
            $scope.routeNames = response.data.data;
        };
        function oFail(response){
          console.log(response);
        }

        if(viewValue && viewValue.toString().length>1){
            Vendor.transporterRoutes_ALL(viewValue,oSuc,oFail);
        }
    };

    $scope.onCustRouteSelect = function(item, model, label){
      if(model){
        $scope.oBooking.trip_type = model.route_type;
        $scope.oBooking.trip_distance = model.route_distance;
      }
    };


  $scope.getCustomersRoutes = function(viewValue){
    function success(data) {
      if((data.data) && (data.data.message == "Transport routes found")){
        $scope.aCustomersRoutes = data.data.data;
      }else{
        $scope.aCustomersRoutes = data.data;
      }
    };
    if($scope.oBooking.contract.name == 'One Time'){
      if(viewValue && viewValue.toString().length>2){
        Routes.getName(viewValue,success);
      }
    }else{
      bookingServices.getAllRoutesForCusrtomer($scope.oBooking.contract._id,success);
    }
  };
  $scope.getContract = function(){
   function success(data) {
      $scope.aContracts = data.data;
      if($scope.selected_contract_id){
        for(var a=0;a<$scope.aContracts.length;a++){
          if($scope.aContracts[a]._id == $scope.selected_contract_id){
            $scope.oBooking.contract = $scope.aContracts[a];
            $scope.oBooking.payment_type = $scope.oBooking.contract.payment_type;
            $scope.getCustomersRoutes();
            if($scope.oBooking.contract.name == 'One Time'){
              $scope.getAllVehType();
            }else{
              $scope.aPreVehicleType = [];
            }
          }
        }
      }
    };
   bookingServices.getAllContracts22($scope.oBooking.customer._id,success);
  };

  $scope.getTripLocation = function(){
    function success(data) {
      $scope.aTripLocations = data.data.data;
     };
    bookingServices.getAllTripLocation($scope.oBooking.customer.customerId,success);
  };
  $scope.locSelect = function(){
    $scope.oBooking.loading_point = $scope.oBooking.trip_location1;
  }
  $scope.locSelect2 = function(){
    $scope.oBooking.unloading_point = $scope.oBooking.trip_location2;
  }

  $scope.onCustomerSelect = function(){
    $scope.rateSingle = {};
    if($scope.oBooking.route && $scope.oBooking.route.route_name){
      $scope.oBooking.route.route_name = '';
    }
    $scope.oBooking.trip_type = '';
    $scope.oBooking.trip_distance = '';
    $scope.selected_contract_id = $scope.oBooking.customer.active_contract__id;
    //$scope.getCustomersRoutes();
    //$scope.aPreVehicleType = [];
    $scope.getContract();
    $scope.getTripLocation();
    //console.log($scope.oBooking);
  };
  $scope.onBookingTypeSelect = function(){
    $scope.rateSingle = {};
    if($scope.oBooking.customer && $scope.oBooking.customer.active_contract__id){
      $scope.selected_contract_id = $scope.oBooking.customer.active_contract__id;
      $scope.getCustomersRoutes();
    }
    //*** doc selected ****//

      if($scope.oBooking.booking_type == constants.bookingTypes.import_container || $scope.oBooking.booking_type == constants.bookingTypes.import_cargo){
        $scope.example5data = [
          {id: 1, label: "BOE No"},
          {id: 2, label: "Commissioner Certificate"},
          {id: 3, label: "Form 31"},
          {id: 4, label: "Form 16"},
          {id: 5, label: "Form 47"},
          {id: 6, label: "Form 18"},
          {id: 7, label: "Form 36"},
          {id: 8, label: "Form 38"},
          {id: 9, label: "IGM. Copy"},
          {id: 10, label: "Invoice No."},
          {id: 11, label: "Sale Tax Form"}
        ];
      }else if($scope.oBooking.booking_type == constants.bookingTypes.export_container || $scope.oBooking.booking_type == constants.bookingTypes.export_cargo){
        $scope.example5data = [
          {id: 1, label: "Loading Job Order"}
        ];
      }else if($scope.oBooking.booking_type == constants.bookingTypes.domestic_container || $scope.oBooking.booking_type == constants.bookingTypes.domestic_cargo){
        $scope.example5data = [
          {id: 1, label: "Form 31"},
          {id: 2, label: "Form 38"},
          {id: 3, label: "Invoice No"}
        ];
      }

    //** doc array making end ***//
  };
  /*$scope.onBranchSelect = function(){
    console.log($scope.oBooking);
  };*/
  $scope.getAllVehType = function(){
    function success(data) {
      $scope.aPreVehicleType = data.data;
     };
    bookingServices.getAllVehTypeServ({},success);
  };

  $scope.onContractSelect = function(){
    //console.log($scope.oBooking);
    if($scope.oBooking.contract.name == 'One Time'){
      $scope.getAllVehType();
    }else{
      $scope.aPreVehicleType = [];
    }
    //$scope.aPreVehicleType = [];

    $scope.getCustomersRoutes();
  }
  $scope.onRouteSelect = function(){
    //console.log($scope.oBooking.route_name);
    var item = angular.copy($scope.oBooking.route_name);
    $scope.oBooking.route_name = item.route_name;
    $scope.oBooking.trip_type = item.route_type;
    $scope.oBooking.trip_distance = item.route_distance;
    $scope.newItem = [];
    if($scope.oBooking.contract.name == 'One Time'){
      $scope.rateSingle = item;
      //$scope.aPreVehicleType = item.data;
    }else{
      for(var c=0;c<item.data.length;c++){
        if(item.data[c].booking_type == $scope.oBooking.booking_type){
          $scope.newItem.push(item.data[c]);
        }
      }
      item.data =  $scope.newItem;
      $scope.rateSingle = item;
      $scope.aPreVehicleType = item.data;
    }
  };

  $scope.preVehicleGetData = function(){
    $scope.newItem2 = [];
    if($scope.rateSingle && $scope.rateSingle.data && $scope.rateSingle.data.length>0){
      for(var c=0;c<$scope.rateSingle.data.length;c++){
        if($scope.oBooking.vehicle_type && $scope.oBooking.vehicle_type.vehicle_type){
          if($scope.rateSingle.data[c].vehicle_type == $scope.oBooking.vehicle_type.vehicle_type){
            $scope.newItem2.push($scope.rateSingle.data[c]);
          }
        }
      }
    }
    if($scope.oBooking.vehicle_type && $scope.oBooking.vehicle_type.vehicle_type){
      $scope.rateSingle.data =  $scope.newItem2;
    }
    //$scope.rateSingle = item;

    //**** check weight validation to veh capacity*******//
    if($scope.oBooking.boe_weight && $scope.oBooking.boe_weight.value){
      if($scope.oBooking.vehicle_type && $scope.oBooking.vehicle_type.capacity){
        var cc = $scope.oBooking.vehicle_type.capacity;
        var nn = $scope.oBooking.no_of_vehicle;
        var calc = cc*nn;
        if($scope.oBooking.boe_weight.value > calc){
          swal("Weight * no of vehicle is greater then selected vehicle capacity","","warning");
          $scope.oBooking.vehicle_type = '';
        }
      }
    }
    //**** check weight validation to veh capacity*******//
  };
  $scope.getMaterial = function(){
    function success(data) {
      $scope.aMaterialGroup = data.data.data;
      var addM = {};
      addM.name = 'Add New';
      $scope.aMaterialGroup.push(addM);
    };
   bookingServices.getAllMaterial(success);
  };
  $scope.getMaterialType = function(objMaterialGroup) {
    if($scope.oBooking.material_group && $scope.oBooking.material_group.name == 'Add New'){
      var modalInstance = $uibModal.open({
        templateUrl: 'views/material/dialogMaterialGroup.html',
        controller: 'materialGroupModalController',
        resolve: {
          objMaterialGroup : function(){
            return objMaterialGroup
          }
        }
      });
      modalInstance.result.then(function(message) {
        if (message) {
            growlService.growl(message,"success",3);
            $scope.oBooking.material_group = '';
            $scope.getMaterial();
        }
      }, function(data) {
      });


    }else if($scope.oBooking.material_group && $scope.oBooking.material_group.material_types){
      $scope.aMaterialType = $scope.oBooking.material_group.material_types;
      $scope.addNconfirm = true;
      for(var t=0;t<$scope.aMaterialType.length;t++){
        if($scope.aMaterialType[t].name == 'Add New'){
          $scope.addNconfirm = false;
        }
      }
      if($scope.addNconfirm){
        var addM = {};
        addM.name = 'Add New';
        $scope.aMaterialType.push(addM);
      }
    }
  }
  $scope.getMaterial();

  $scope.addNewMaterialType = function(objMaterialType){
    if($scope.oBooking.material_type == 'Add New'){
      var modalInstance = $uibModal.open({
        templateUrl: 'views/material/dialogMaterialType.html',
        controller: 'materialTypeModalController',
        resolve: {
            objMaterialType: function(){
                return objMaterialType;
            },
            materialGroups: function(){
                return $scope.aMaterialGroup;
            }
        }
      });

      modalInstance.result.then(function(message) {
        if (message) {
          growlService.growl(message,"success",3);
          $scope.oBooking.material_type = '';
          $scope.getMaterial();
        }
      }, function(data) {
        if (data != 'cancel') {
          swal("Oops!", data.data.error_message, "error")
        }
      });

    }
  }
  $scope.getShippingLine = function(){
   function success(data) {
      $scope.aShippingLine = data.data.data;
    };
   SLDOServices.getAllSLDO({},success);
  };
  $scope.getShippingLine();

  $scope.checkReCont = function() {
    if($scope.oBooking.reamining_container && $scope.oBooking.total_containers){
      if($scope.oBooking.reamining_container > $scope.oBooking.total_containers){
        alert('Remaining is less then total container !!!');
        $scope.oBooking.reamining_container = 0;
      }
    }
  }
  $scope.checkThisCont = function() {
    if($scope.oBooking.no_containers && $scope.oBooking.total_containers){
      if($scope.oBooking.no_containers > $scope.oBooking.total_containers){
        alert('This is less then total container !!!');
        $scope.oBooking.no_containers = 0;
      }else{
        $scope.oBooking.reamining_container = $scope.oBooking.total_containers - $scope.oBooking.no_containers;
      }
    }
  }
  $scope.weightTypeCondition = function(){
    if($scope.oBooking.weight_type == 'Fixed'){
      if($scope.rateSingle.data && $scope.rateSingle.data[0] && $scope.rateSingle.data[0].rate){
        $scope.oBooking.rates = $scope.rateSingle.data[0].rate.vehicle_rate;
        $scope.oBooking.final_rate = $scope.rateSingle.data[0].rate.vehicle_rate;
      }
    }else if($scope.oBooking.weight_type == 'PUnit'){
      $scope.oBooking.weight = '';
      $scope.oBooking.rates = $scope.rateSingle.data[0].rate.price_per_unit;
      $scope.oBooking.final_rate = $scope.rateSingle.data[0].rate.price_per_unit * $scope.oBooking.total_no_of_units;
    }else if($scope.oBooking.weight_type == 'PMT'){
      $scope.oBooking.weight = $scope.oBooking.boe_weight.value;
      /*if($scope.oBooking.boe_weight.unit == "mt"){
        $scope.oBooking.weight = $scope.oBooking.boe_weight.value;
      }else if ($scope.oBooking.boe_weight.unit == "tonne") {
        $scope.oBooking.weight = $scope.oBooking.boe_weight.value * (1.0160469088);
      }
      */
      if($scope.rateSingle.data && $scope.rateSingle.data[0] && $scope.rateSingle.data[0].rate){
        $scope.oBooking.rates = $scope.rateSingle.data[0].rate.price_per_mt;
        $scope.oBooking.final_rate = parseFloat(($scope.rateSingle.data[0].rate.price_per_mt * $scope.oBooking.weight).toFixed(2));
      }
    }
  };

  $scope.noOfUnit = function(){
    if($scope.oBooking.weight_type == 'PUnit'){
      $scope.oBooking.weight = '';
      $scope.oBooking.rates = $scope.rateSingle.data[0].rate.price_per_unit;
      $scope.oBooking.final_rate = $scope.rateSingle.data[0].rate.price_per_unit * $scope.oBooking.total_no_of_units;
    }
  };

  if($scope.enableNextTab == true){

  }else{
    $scope.enableNextTab = false;
  }

  $scope.addBooking = function(form){
    /*function successPost(response){
      if(response && response.data){
        console.log(response);
        $rootScope.updateBookingData = response.data.data;
        $scope.oBooking = {};
        $scope.enableNextTab = true;
        swal("Booking Created Successfully","","success");
        var sUrl = "#!/booking_manage/booking/addBookingDetails";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with booking creation","","error");
    }*/
    $scope.BookingErrMsg = '';
    $scope.BookingErrMsgCond = false;
    if(form.$valid){
      if($scope.oBooking.booking_type){
        /*if($scope.oBooking.vehicle_type && $scope.oBooking.vehicle_type.name){*/
          if($scope.oBooking.material_group && $scope.oBooking.material_group.name){
            $scope.fullBooking = angular.copy($scope.oBooking);
            $scope.fullBooking.customer_name =  $scope.oBooking.customer.name;
            $scope.fullBooking.contract_type =  $scope.oBooking.contract.contract_type;
            $scope.fullBooking.contract_name =  $scope.oBooking.contract.name;
            $scope.fullBooking.contract_id   =  $scope.oBooking.contract._id;
            //$scope.fullBooking.customer = $scope.oBooking.customer;
            $scope.fullBooking.customer.id =  $scope.oBooking.customer._id;
            //$scope.fullBooking.booking_type = $scope.oBooking.booking_type;
            //$scope.fullBooking.customer_name = $scope.oBooking.customer_name;
            $scope.fullBooking.contact_person = {};
            if($scope.oBooking.customer && $scope.oBooking.customer.prim_contact_name){
              $scope.fullBooking.contact_person.name = $scope.oBooking.customer.prim_contact_name;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.prim_cont_no){
              $scope.fullBooking.contact_person.mobile = $scope.oBooking.customer.prim_cont_no;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.prim_contact_designation){
              $scope.fullBooking.contact_person.role = $scope.oBooking.customer.prim_contact_designation;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.prim_email){
              $scope.fullBooking.contact_person.email = $scope.oBooking.customer.prim_email;
            }
            $scope.fullBooking.contact_person_2 = {};
            if($scope.oBooking.customer && $scope.oBooking.customer.sec_contact_name){
              $scope.fullBooking.contact_person_2.name = $scope.oBooking.customer.sec_contact_name;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.sec_cont_no){
              $scope.fullBooking.contact_person_2.mobile = $scope.oBooking.customer.sec_cont_no;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.sec_contact_designation){
              $scope.fullBooking.contact_person_2.role = $scope.oBooking.customer.sec_contact_designation;
            }
            if($scope.oBooking.customer && $scope.oBooking.customer.alt_email1){
              $scope.fullBooking.contact_person_2.email = $scope.oBooking.customer.alt_email1;
            }
            for(var x=0;x<$scope.oBooking.customer.type.length;x++){
              if($scope.oBooking.customer.type[x]=='Consignor'){
                $scope.fullBooking.consigner =  $scope.oBooking.customer._id;
                $scope.fullBooking.consigner_name  =  $scope.oBooking.customer.name;
              }else if($scope.oBooking.customer.type[x]=='Consignee'){
                $scope.fullBooking.consignee =  $scope.oBooking.customer._id;
                $scope.fullBooking.consignee_name  =  $scope.oBooking.customer.name;
              }else if($scope.oBooking.customer.type[x]=='CHA'){
                $scope.fullBooking.cha =  $scope.oBooking.customer._id;
                $scope.fullBooking.cha_name  =  $scope.oBooking.customer.name;
              }else if($scope.oBooking.customer.type[x]=='Transporter'){
                $scope.fullBooking.transporter =  $scope.oBooking.customer._id;
                $scope.fullBooking.transporter_name  =  $scope.oBooking.customer.name;
              }else if($scope.oBooking.customer.type[x]=='Billing party'){
                $scope.fullBooking.billing_party =  $scope.oBooking.customer._id;
                $scope.fullBooking.billing_party_name  =  $scope.oBooking.customer.name;
              }
            }
            $scope.fullBooking.material_group = $scope.oBooking.material_group.name;
            //$scope.fullBooking.branch = $scope.oBooking.branch;
            if($scope.oBooking.contract.name == 'One Time'){
              $scope.fullBooking.route = {
                route_id : $scope.oBooking.route_name._id,
                route_type:$scope.oBooking.route_name.route_type,
                route_distance:parseInt($scope.oBooking.route_name.route_distance_text),
                route_name : $scope.oBooking.route_name.name
              }
            }else{
              $scope.fullBooking.route =  $scope.rateSingle;
              $scope.fullBooking.route.name = $scope.fullBooking.route.route_name;
              if($scope.fullBooking && $scope.fullBooking.route && $scope.fullBooking.route.data && $scope.fullBooking.route.data[0]){
                for(var p=0;p<$scope.fullBooking.route.data.length;p++){
                  if($scope.fullBooking.route.data[p].vehicle_type == $scope.oBooking.vehicle_type.vehicle_type){
                    $scope.fullBooking.route.rates = $scope.fullBooking.route.data[p];
                  }
                }
              }
              $scope.fullBooking.route.route_id = $scope.fullBooking.route.route__id;
              $scope.fullBooking.route.route_type = $scope.oBooking.trip_type;
              $scope.fullBooking.route.route_distance = $scope.oBooking.trip_distance;
            }

            if($scope.oBooking.contract.name == 'One Time'){
              $scope.fullBooking.vehicle_type = $scope.oBooking.vehicle_type.name;
              $scope.fullBooking.vehicle_type_id = $scope.oBooking.vehicle_type._id;
            }else{
              $scope.fullBooking.vehicle_type = $scope.oBooking.vehicle_type.vehicle_type;
              $scope.fullBooking.vehicle_type_id = $scope.oBooking.vehicle_type.vehicle_type_id;
            }

            //$scope.fullBooking.boe_value = $scope.oBooking.boe_value;
            //$scope.fullBooking.boe_weight = $scope.oBooking.boe_weight;
            /*$scope.fullBooking.documents_required = [];
            if($scope.example5model.length>0){
              for(var s=0;s<$scope.example5model.length;s++){
                $scope.fullBooking.documents_required.push($scope.example5model[s].label);
              }
            }*/
            $scope.fullBooking.clientId = $localStorage.ft_data.userLoggedIn.clientId;
            $scope.fullBooking.no_of_vehicle = $scope.oBooking.no_of_vehicle;
            //bookingServices.addBooking($scope.fullBooking, successPost,failure);
            $rootScope.updateBookingData = $scope.fullBooking;
            $scope.enableNextTab = true;
            var sUrl = "#!/booking_manage/booking/addBookingDetails";
            $rootScope.redirect(sUrl);
          }else{
            alert('Please select material !!!');
          }
        /*}else{
          alert('Please select Preffered Vehicle !!!');
        }*/
      }
    }else {
      $scope.BookingErrMsg = '';
      $scope.BookingErrMsgCond = true;
      $scope.BookingErrMsg = formValidationgrowlService.findError(form.$error);
      setTimeout(function(){
        if($scope.BookingErrMsgCond){
          $scope.$apply(function() {
            $scope.BookingErrMsgCond = false;
          });
        }
      }, 7000);
    }
    /*else if(form.$error && form.$error.required){
      for(i=0;i<form.$error.required.length;i++){
        if(form.$error.required[i].$name){
          $scope.BookingErrMsg = $scope.BookingErrMsg+" "+form.$error.required[i].$name + " ,";
        }
      }
      if($scope.BookingErrMsg){
        $scope.BookingErrMsg = $scope.BookingErrMsg.substring(0, $scope.BookingErrMsg.length - 1);
        $scope.BookingErrMsg = $scope.BookingErrMsg + ' are require.';
        $scope.BookingErrMsgCond = true;
        setTimeout(function(){
          if($scope.BookingErrMsgCond){
            $scope.$apply(function() {
              $scope.BookingErrMsgCond = false;
            });
          }
        }, 7000);
      }
    }*/

  };

  //$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Domestic – Containerized","Import - Cargo","Export – Cargo","Domestic – Cargo","Empty - Containerized","Empty - Vehicle","Transporter Booking"];
  //$scope.aBookingTypes = ["Domestic – Loose cargo","Transporter Booking","Import - Containerized","Export – Containerized","Import - Loose Cargo","Export – Loose cargo","Container FS","Container FDS"];
  //$scope.aBranch = ["Delhi","Dplah","Indore","Ujjain","Panipat","Jammu","Shajapur"];
  //$scope.aRoutes = ["Delhi-Indore","Indore-Ujjain","Ujjain-Panipat","Panipat-Jammu","Jammu-shajapur"];
  $scope.aWeightTypes = ["PMT","PUnit","Fixed"];
  $scope.aTripTypeType = ["One Way","Two Way"];
  $scope.aDoc = ["Form 31","Form 47","Form 16"];
  //$scope.aMaterialGroup = ["Carbon","Cement","Chemical"];
  //$scope.aMaterialType = ["Carbon Bricks","Magni. Carbon Bricks","Chemical"];
  //$scope.aPreVehicleType = ["Truck1","truck 2","truck3"];
  //$scope.aShippingLine = ["MGR","ALB","ASL"];
  $scope.aContainerSize = ["20Ft","40Ft","All"];
  $scope.getAllBranchSelect();
});

materialAdmin.controller("addBookingController", function($rootScope,$scope,$localStorage,bookingServices,SLDOServices,formValidationgrowlService) {

});

materialAdmin.controller("addBookingExtraController", function($rootScope, $scope,$timeout,constants,bookingServices,growlService) {
  //$scope.myNumber = $rootScope.updateBookingData.no_containers;
  $scope.getNumber = function(num) {
      return new Array(num);
  };
  $scope.getAllVehType = function(){
    function success(data) {
      $scope.aVehiType = data.data;
     };
    bookingServices.getAllVehTypeServ({},success);
  };
  $scope.getAllVehType();
  $scope.aShippingLine = ["MGR","ALB","ASL"];
  $scope.cargo = {};
  $scope.containerInfo = [];
  $scope.infoCon = [];
  $scope.itemInfoCargo = [];
  $scope.aSizeOfVehicle = $rootScope.updateBookingData.route.rates;
  $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
  if($rootScope.updateBookingData){
    $timeout(function() {
      if($rootScope.updateBookingData.booking_type == constants.bookingTypes.domestic_cargo){
        if($rootScope.updateBookingData && $rootScope.updateBookingData.no_of_vehicle.length>0){
          var newObject = angular.copy($rootScope.updateBookingData);
          $scope.itemCargoUp = newObject;
          for(var s=0;s<$rootScope.updateBookingData.no_of_vehicle;s++){
            $scope.infoCon[s] = {};
            $scope.infoCon[s].item_no = s+1;
            //$scope.infoCon[s]._id = $rootScope.updateBookingData._id;
            //$scope.infoCon[s].no_of_units = $rootScope.updateBookingData.info[s].no_of_units;
            if($rootScope.updateBookingData.boe_weight && $rootScope.updateBookingData.boe_weight.value){
              $scope.infoCon[s].weight = {};
              $scope.infoCon[s].weight.value = $rootScope.updateBookingData.boe_weight.value/$rootScope.updateBookingData.no_of_vehicle;
              $scope.infoCon[s].weight.unit = 'tonne';//$rootScope.updateBookingData.boe_weight.unit;
            }else{
              $scope.infoCon[s].weight = {};
              $scope.infoCon[s].weight.value = 0;
              $scope.infoCon[s].weight.unit = 'tonne';//$rootScope.updateBookingData.boe_weight.unit;
            }
            if($scope.aVehiType && $scope.aVehiType.length>0){
              for(var v=0;v<$scope.aVehiType.length;v++){
                if($scope.aVehiType[v].name == $rootScope.updateBookingData.vehicle_type){
                  $scope.infoCon[s].vehicle_type = $scope.aVehiType[v];
                }
              }
            }
            //$scope.infoCon[s].vehicle_type = $rootScope.updateBookingData.vehicle_type;
            $scope.infoCon[s].rate = $rootScope.updateBookingData.rate || 0;
            $scope.infoCon[s].loading_yard = '';
            $scope.infoCon[s].offloading_yard = '';
            //$scope.infoCon[s].freight = $rootScope.updateBookingData.info[s].freight || 0;
            //$scope.infoCon[s].value = $rootScope.updateBookingData.info[s].value;
            /*$scope.infoCon[s].documents = [];
            if($rootScope.updateBookingData.documents_required.length>0){
              for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
                $scope.infoCon[s].documents[t] = {};
                $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
                $scope.infoCon[s].documents[t].identity  = 'Doc No.';
              }
            }*/
          }
        }
      }
    }, 4000); // 4 seconds
    //console.log($scope.infoCon);
    /*for(var s=0;s<$rootScope.updateBookingData.no_containers;s++){
      $scope.infoCon[s] = {};
      $scope.infoCon[s].item_no = s+1;
      $scope.infoCon[s].container_no = '';
      $scope.infoCon[s].size = $rootScope.updateBookingData.route.rates.vehicle_type;
      $scope.infoCon[s].weight = {};
      $scope.infoCon[s].weight.value = 0;
      $scope.infoCon[s].weight.unit = $rootScope.updateBookingData.boe_weight.unit;
      $scope.infoCon[s].loading_yard = '';
      $scope.infoCon[s].offloading_yard = '';
      $scope.infoCon[s].value = 0;
      $scope.infoCon[s].documents = [];
      if($rootScope.updateBookingData.documents_required.length>0){
        for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
          $scope.infoCon[s].documents[t] = {};
          $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
          $scope.infoCon[s].documents[t].identity  = 0000;
        }
      }
      //$scope.infoCon[s].documents = $rootScope.updateBookingData.documents_required;
      //$scope.containerInfo.push($scope.example5model[s].label);
    }

    if($rootScope.updateBookingData.booking_type == constants.bookingTypes.import_cargo || $rootScope.updateBookingData.booking_type == constants.bookingTypes.export_cargo || $rootScope.updateBookingData.booking_type == constants.bookingTypes.domestic_cargo || $rootScope.updateBookingData.booking_type == constants.bookingTypes.transporter){
      var newObject = angular.copy($rootScope.updateBookingData);
      $scope.itemCargoUp = newObject;
      for(var s=0;s<$rootScope.updateBookingData.info.length;s++){
        $scope.infoCon[s] = {};
        $scope.infoCon[s].item_no = s+1;
        $scope.infoCon[s]._id = $rootScope.updateBookingData.info[s]._id;
        $scope.infoCon[s].no_of_units = $rootScope.updateBookingData.info[s].no_of_units;
        if($rootScope.updateBookingData.info[s].weight && $rootScope.updateBookingData.info[s].weight.value){
          $scope.infoCon[s].weight = $rootScope.updateBookingData.info[s].weight;
        }else{
          $scope.infoCon[s].weight = {};
          $scope.infoCon[s].weight.value = 0;
          $scope.infoCon[s].weight.unit = $rootScope.updateBookingData.boe_weight.unit;
        }
        $scope.infoCon[s].loading_yard = '';
        $scope.infoCon[s].offloading_yard = '';
        $scope.infoCon[s].freight = $rootScope.updateBookingData.info[s].freight || 0;
        $scope.infoCon[s].rate = $rootScope.updateBookingData.info[s].rate || 0;
        $scope.infoCon[s].value = $rootScope.updateBookingData.info[s].value;
        $scope.infoCon[s].documents = [];
        if($rootScope.updateBookingData.documents_required.length>0){
          for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
            if($rootScope.updateBookingData.info[s].documents[t] && $rootScope.updateBookingData.info[s].documents[t].name){
              $scope.infoCon[s].documents[t] = $rootScope.updateBookingData.info[s].documents[t]
            }else{
              $scope.infoCon[s].documents[t] = {};
              $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
              $scope.infoCon[s].documents[t].identity  = 'Doc No.';
            }
          }
        }
      }
    }*/
  }
  $scope.checkContainerNo = function(containerNoType, index){
    var re = new RegExp('^[0-9]{4}[a-zA-Z]{7}$');
    if(re.test(containerNoType) == true){

    }else{
      $scope.infoCon[index].container_no = '';
    }
  }
  $scope.checkWeightCont = function(weight, index){
    var tWeight = '';
    var totalWeight = '';
    for(i=0;i<$scope.infoCon.length;i++){
       if($scope.infoCon[i].weight && $scope.infoCon[i].weight.value){
         tWeight = tWeight + $scope.infoCon[i].weight.value;
         tWeight = parseInt(tWeight);
       }
    }
    totalWeight = parseInt(tWeight);

    if(totalWeight > $rootScope.updateBookingData.boe_weight.value){
      $scope.infoCon[index].weight.value = '';
      swal("","Toatal weight should be less than Boe Weight","warning");
    } else if(weight && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*weight;
      $scope.infoCon[index].value = parseFloat($scope.value1.toFixed(2));
    }
  }

  $scope.addNewRowInTable = function(){
    $scope.infoConSingle = {};
    $scope.infoConSingle.item_no = $scope.infoCon.length+1;
    //$scope.infoConSingle.no_of_units = 0;
    $scope.infoConSingle.weight = {};
    $scope.infoConSingle.weight.value = 0;
    $scope.infoConSingle.weight.unit ='tonne';// $rootScope.updateBookingData.boe_weight.unit;
    if($scope.aVehiType && $scope.aVehiType.length>0){
      for(var v=0;v<$scope.aVehiType.length;v++){
        if($scope.aVehiType[v].name == $rootScope.updateBookingData.vehicle_type){
          $scope.infoConSingle.vehicle_type = $scope.aVehiType[v];
        }
      }
    }
    //$scope.infoConSingle.loading_yard = '';
    //$scope.infoConSingle.offloading_yard = '';
    //$scope.infoConSingle.freight = 0;
    $scope.infoConSingle.rate = 0;
    //$scope.infoConSingle.value = 0;
    //$scope.infoConSingle.documents = [];
    /*if($rootScope.updateBookingData.documents_required.length>0){
      for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
        $scope.infoConSingle.documents[t] = {};
        $scope.infoConSingle.documents[t].name = $rootScope.updateBookingData.documents_required[t];
        $scope.infoConSingle.documents[t].identity  = 0000;
      }
    }*/

    $scope.infoCon.push($scope.infoConSingle);
  }
  //$rootScope.onceWeight = false;
  $scope.checkWeight = function(weight, index){
    var tWeight = '';
    var totalWeight = '';
    //if($rootScope.onceWeight == true){
      for(i=0;i<$scope.infoCon.length;i++){
         if($scope.infoCon[i].weight && $scope.infoCon[i].weight.value){
           tWeight = tWeight + $scope.infoCon[i].weight.value;
           tWeight = parseInt(tWeight);
         }
      }
      totalWeight = parseInt(tWeight);
    /*}else{
      totalWeight = weight;
      $rootScope.onceWeight = true;
    }*/
    if(totalWeight > $rootScope.updateBookingData.boe_weight.value){
      $scope.infoCon[index].weight.value = '';
      swal("","Total weight should be less than Boe Weight","warning");
    } /*else if(weight && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*weight;
      $scope.valueFreight = $scope.infoCon[0].rate*weight;
      //$scope.cargo.freight = weight;
      $scope.infoCon[index].value = parseFloat(($scope.value1).toFixed(2));
      $scope.infoCon[index].freight = $scope.valueFreight;
      $scope.infoCon[index].rate = $scope.infoCon[0].rate;
    }*/
  }
  $rootScope.onceUnit = false;
  $scope.checkNoUnit = function(unit, index){
    var tUnit = '';
    var totalUnit = '';
    if($rootScope.onceUnit == true){
      for(i=0;i<$scope.infoCon.length;i++){
         if($scope.infoCon[i].no_of_units){
           tUnit = tUnit + $scope.infoCon[i].no_of_units;
           tUnit = parseInt(tUnit);
         }
      }
      totalUnit = parseInt(tUnit);
    }else{
      totalUnit = unit;
      $rootScope.onceUnit = true;
    }
    if(totalUnit > $scope.itemCargoUp.info[0].no_of_units){
      $scope.infoCon[index].no_of_units = '';
      swal("","Total no of unit should be less than total units","warning");
    } else if(unit && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*unit;
      $scope.valueFreight = $scope.infoCon[0].rate*unit;
      //$scope.cargo.freight = weight;
      $scope.infoCon[index].value = parseFloat(($scope.value1).toFixed(2));
      $scope.infoCon[index].freight = $scope.valueFreight;
      $scope.infoCon[index].rate = $scope.infoCon[0].rate;
    }
  }

  $scope.removeItems = function(selected, $index) {
    $scope.removeData = selected;
    $scope.infoCon.splice($index, 1);
  }

  $scope.addBookingExtra = function(){
    function successUpdate(response){
      if(response && response.data){
        //console.log(response);
        swal("Booking Added Successfully","","success");
        var sUrl = "#!/booking_manage/booking/addBookingBilling";
        $rootScope.redirect(sUrl);
        $rootScope.billingInfo = response.data.data;
        $rootScope.billingData = true;
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with booking Updation","","error");
    }
    /*if($scope.infoCon){
      var hasAllContNo = true;
      for(var c=0;c<$scope.infoCon.length;c++){
        if($scope.infoCon[c].container_no == ''){
          hasAllContNo = false;
          break;
        }else{
          hasAllContNo = true;
        }
      }
    }
    if(hasAllContNo){
      $scope.upBooking = {};
      $scope.upBooking.info = $scope.infoCon;
      bookingServices.updateBooking($scope.upBooking, successUpdate,failure);
    }else{
      growlService.growl("Please fill container number.", "warning");
    }*/
    $scope.upBooking = {};
    $scope.upBooking = $rootScope.updateBookingData;
    $scope.upBooking.info = $scope.infoCon;
    bookingServices.addBooking($scope.upBooking, successUpdate,failure);
  };

  $scope.updtBookingother = function(){
    function suc(response){
      if(response && response.data){
        $rootScope.updateBookingData._id = response.data.data._id;
        //console.log(response);
        swal("Booking Updated Successfully","","success");
      }
    }
    function fail(res){
      console.log("fail: ",res);
      swal("Some error with booking Updation","","error");
    }
    //$rootScope.updateBookingDataForService = $scope.updateBookingData;
    bookingServices.updateBooking($scope.updateBookingData, suc,fail);
  };

  function success(data) {
    $scope.aCustomersforDetails = data.data;
  };

  $scope.getNameforOtherDetails = function(name){
    if(name && name.length>1){
      var otherDetailsName = name;
      bookingServices.getAllCustomersforDetails(otherDetailsName, success);
    }
  };



  $scope.getAllIcd = function(){
    function successICD(data) {
       if(data.data && data.data.length>0){
          $scope.aIcdList = data.data;
       }
    };
   function failureICD(res){
       console.log("fail: ",res);
       swal("Some error with GET ICD.","","error");
    }

    bookingServices.getAllIcdService(successICD,failureICD);
  }
  $scope.getAllIcd();

});

materialAdmin.controller("addBookingBill", function($rootScope, $scope,bookingServices,userService) {
  $scope.getBooking = function(){
     function success(data) {
         if(data.data && data.data.data && data.data.data.length>0){
            $scope.aBookings = data.data.data;
         }
      };
     function failure(res){
         console.log("fail: ",res);
         swal("Some error with GET booking.","","error");
      }
    bookingServices.getAllBookings({}, success,failure);
  };
  $scope.getBooking();

  /*if($rootScope.billingInfo){
    if(!$rootScope.billingInfo.booking_date){
      $rootScope.billingInfo.booking_date = new Date();
    }
    if(!$rootScope.billingInfo.last_date_of_dispatch){
      $rootScope.billingInfo.last_date_of_dispatch = new Date();
    }
    $scope.billingInfo =$rootScope.billingInfo;
  }*/

  $scope.updtBookingother = function(){
    function suc(response){
      if(response && response.data){
        //console.log(response);
        swal("Booking Save Successfully","","success");
        var sUrl = "#!/booking_manage/bookings";
        $rootScope.redirect(sUrl);
      }
    }
    function fail(res){
      console.log("fail: ",res);
      swal("Some error with booking Save","","error");
    }
    if($scope.billingInfo.marketed_by_full){
      $scope.billingInfo.marketed_by = {};
      $scope.billingInfo.marketed_by.name = $scope.billingInfo.marketed_by_full.full_name;
      $scope.billingInfo.marketed_by.employeed_id = $scope.billingInfo.marketed_by_full.clientId;
      $scope.billingInfo.marketed_by.role  = $scope.billingInfo.marketed_by_full.role;
    }
    $rootScope.selectedBookingInfoForService = $scope.billingInfo;
    bookingServices.updateBooking222($scope.billingInfo, suc,fail);
  };

  function success(data) {
    $scope.aCustomersforDetails = data.data;
  };

  $scope.getNameforOtherDetails = function(customerName,customerType){
    var cType = JSON.stringify([customerType])
    var details = {
      type:cType,
      all:true
    }
    if(customerName && customerName.length>1){
      details.name = customerName;
      bookingServices.getAllCustomersforDetails(details, success);
    }
  };

  $scope.onConsignerSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.consigner = model._id;
      $scope.billingInfo.consigner_name = model.name;
    }
    //console.log(model);
  };
  $scope.onConsigneeSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.consignee = model._id;
      $scope.billingInfo.consignee_name = model.name;
    }
    //console.log(model);
  };
  $scope.onCHASelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.selectedBookingInfo.cha = model._id;
      $scope.billingInfo.cha_name = model.name;
    }
    //console.log(model);
  };
  $scope.onBillingSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.billing_party = model._id;
      $scope.billingInfo.billing_party_name = model.name;
    }
    //console.log(model);
  };
  $scope.onTransporterSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.transporter = model._id;
      $scope.billingInfo.transporter_name = model.name;
    }
    //console.log(model);
  };
  //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.example5model = [];
    //console.log($scope.example5model);
    $scope.example5data = [
      {id: 1, label: "Form 31"},
      {id: 2, label: "Form 16"},
      {id: 3, label: "Form 47"}
    ];
    $scope.example5settings = {
      showCheckAll: false,
      showUncheckAll: false,
      externalIdProp: ''
    };
    $scope.example5customTexts = {buttonDefaultText: 'Select Doc'};

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

  //************* New Date Picker for multiple date selection in single form ******************//
  $scope.getAllUsers = function(){
    function successUsers(data) {
      if(data.data && data.data.length>0){
        $scope.aUsers = data.data;
      }
    };
   function failureUsers(res){
       console.log("fail: ",res);
       swal("Some error with GET Users.","","error");
    }

    userService.getUsers({user_type:"Marketing Manager",all:true},successUsers,failureUsers);
  }
  $scope.getAllUsers();
});

//********** update booking full ******************//
/*materialAdmin.controller("updateBookingCommonController", function($rootScope, $scope,bookingServices) {

});*/

materialAdmin.controller("updateBookingCommonController", function($rootScope,$scope,constants,bookingServices,SLDOServices,formValidationgrowlService) {
  $scope.getUpdateData = $rootScope.forUpdateBooking;
  $scope.oBookingUpData = $scope.getUpdateData;

  $scope.getAllBranchSelect();

  //console.log($scope.getUpdateData);
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
  //*** doc selected ****//
    if($scope.oBookingUpData.booking_type == constants.bookingTypes.import_container || $scope.oBookingUpData.booking_type == constants.bookingTypes.import_cargo){
      $scope.example5data = [
        {id: 1, label: "BOE No"},
        {id: 2, label: "Commissioner Certificate"},
        {id: 3, label: "Form 31"},
        {id: 4, label: "Form 16"},
        {id: 5, label: "Form 47"},
        {id: 6, label: "Form 18"},
        {id: 7, label: "Form 36"},
        {id: 8, label: "Form 38"},
        {id: 9, label: "IGM. Copy"},
        {id: 10, label: "Invoice No."},
        {id: 11, label: "Sale Tax Form"}
      ];
    }else if($scope.oBookingUpData.booking_type == constants.bookingTypes.export_container || $scope.oBookingUpData.booking_type == constants.bookingTypes.export_cargo){
      $scope.example5data = [
        {id: 1, label: "Loading Job Order"}
      ];
    }else if($scope.oBookingUpData.booking_type == constants.bookingTypes.domestic_cargo){
      $scope.example5data = [
        {id: 1, label: "Form 31"},
        {id: 2, label: "Form 38"},
        {id: 3, label: "Invoice No"}
      ];
    }
    $scope.example5settings = {
      showCheckAll: false,
      showUncheckAll: false,
      externalIdProp: ''
    };
    $scope.example5model = [];
    $scope.example5customTexts = {buttonDefaultText: 'Select Doc'};
    if($scope.oBookingUpData.documents_required.length>0){
      for(var a=0;a<$scope.oBookingUpData.documents_required.length;a++){
        if($scope.example5data && $scope.example5data.length>0){
          for(var b=0;b<$scope.example5data.length;b++){
            if($scope.oBookingUpData.documents_required[a] == $scope.example5data[b].label){
              $scope.example5model.push($scope.example5data[b]);
            }
          }
        }
      }
    }
  //** doc array making end ***//

  $scope.getContract = function(){
   function success(data) {
      $scope.aContracts = data.data;
      if($scope.oBookingUpData.contract_id){
        for(var q=0;q<$scope.aContracts.length;q++){
          if($scope.aContracts[q]._id == $scope.oBookingUpData.contract_id){
            $scope.oBookingUpData.contract = $scope.aContracts[q];
            //$scope.onRouteSelect();
          }
        }
      }
    };
    if($scope.oBookingUpData.customer){
      bookingServices.getAllContracts22($scope.oBookingUpData.customer.id || $scope.oBookingUpData.customer._id, success);
    }else{
      bookingServices.getAllContracts(success);
    }
  };
  $scope.getContract();
  $scope.getCustomersRoutes = function(){
    function success(data) {
      $scope.aCustomersRoutes = data.data;
      if($scope.oBookingUpData.customer_name){
        for(var a=0;a<$scope.aCustomersRoutes.length;a++){
          if($scope.aCustomersRoutes[a].route_name == $scope.oBookingUpData.route.route_name){
            $scope.oBookingUpData.route = $scope.aCustomersRoutes[a];
            $scope.onRouteSelect();
          }
        }
      }
     };
    bookingServices.getAllRoutesForCusrtomer($scope.selected_contract_id,success);
  };

  $scope.getTripLocation = function(){
    function success(data) {
      $scope.aTripLocations = data.data.data;
      if($scope.oBookingUpData.loading_point){
        if($scope.aTripLocations && $scope.aTripLocations.length>0){
          for(var v=0;v<$scope.aTripLocations.length;v++){
            if($scope.aTripLocations[v].name == $scope.oBookingUpData.loading_point.name){
              $scope.oBookingUpData.trip_location1 = $scope.aTripLocations[v];
            }
          }
        }
      }
      if($scope.oBookingUpData.unloading_point){
        if($scope.aTripLocations && $scope.aTripLocations.length>0){
          for(var j=0;j<$scope.aTripLocations.length;j++){
            if($scope.aTripLocations[j].name == $scope.oBookingUpData.unloading_point.name){
              $scope.oBookingUpData.trip_location2 = $scope.aTripLocations[j];
            }
          }
        }
      }
    };
    bookingServices.getAllTripLocation($scope.oBookingUpData.customer.customerId,success);
  };
  //$scope.getTripLocation();
  $scope.locSelect = function(){
    $scope.oBookingUpData.loading_point = $scope.oBookingUpData.trip_location1;
  }
  $scope.locSelect2 = function(){
    $scope.oBookingUpData.unloading_point = $scope.oBookingUpData.trip_location2;
  }

  $scope.onCustomerSelect = function(){
    $scope.rateSingle = {};
    /*if($scope.oBookingUpData.route && $scope.oBookingUpData.route.route_name){
      $scope.oBookingUpData.route.route_name = '';
    }*/
    $scope.oBookingUpData.trip_type = $scope.oBookingUpData.trip_type || '';
    $scope.oBookingUpData.trip_distance = $scope.oBookingUpData.trip_distance || '';
    $scope.selected_contract_id = $scope.oBookingUpData.customer.active_contract__id;
    $scope.oBookingUpData.customer_name = $scope.oBookingUpData.customer.name;
    $scope.aPreVehicleType = [];
    $scope.getCustomersRoutes();
    $scope.getTripLocation();
    //console.log($scope.oBookingUpData);
  };
  $scope.onBookingTypeSelect = function(){
    $scope.rateSingle = {};
    if($scope.oBookingUpData.customer && $scope.oBookingUpData.customer.active_contract__id){
      $scope.selected_contract_id = $scope.oBookingUpData.customer.active_contract__id;
      $scope.getCustomersRoutes();
    }
    //*** doc selected ****//

      if($scope.oBookingUpData.booking_type == constants.bookingTypes.import_container || $scope.oBookingUpData.booking_type == constants.bookingTypes.import_cargo){
        $scope.example5data = [
          {id: 1, label: "BOE No"},
          {id: 2, label: "Commissioner Certificate"},
          {id: 3, label: "Form 31"},
          {id: 4, label: "Form 16"},
          {id: 5, label: "Form 47"},
          {id: 6, label: "Form 18"},
          {id: 7, label: "Form 36"},
          {id: 8, label: "Form 38"},
          {id: 9, label: "IGM. Copy"},
          {id: 10, label: "Invoice No."},
          {id: 11, label: "Sale Tax Form"}
        ];
      }else if($scope.oBookingUpData.booking_type == constants.bookingTypes.export_container || $scope.oBookingUpData.booking_type == constants.bookingTypes.export_cargo){
        $scope.example5data = [
          {id: 1, label: "Loading Job Order"}
        ];
      }else if($scope.oBookingUpData.booking_type == constants.bookingTypes.domestic_cargo){
        $scope.example5data = [
          {id: 1, label: "Form 31"},
          {id: 2, label: "Form 38"},
          {id: 3, label: "Invoice No"}
        ];
      }

    //** doc array making end ***//
  };
  $scope.getCustomers = function(){
   function success(data) {
      $scope.aCustomers = data.data;
      if($scope.oBookingUpData.customer_name){
        for(var a=0;a<$scope.aCustomers.length;a++){
          if($scope.aCustomers[a].name == $scope.oBookingUpData.customer_name){
            $scope.oBookingUpData.customer = $scope.aCustomers[a];
            $scope.onCustomerSelect();
          }
        }
      }
    };
   bookingServices.getAllCustomers(success);
  };
  $scope.getCustomers();
  /*$scope.onBranchSelect = function(){
    console.log($scope.oBookingUpData);
  };*/
  $scope.getAllVehType = function(){
    function success(data) {
      $scope.aPreVehicleTypeLocalData = data.data;
     };
    bookingServices.getAllVehTypeServ({},success);
  };
  $scope.getAllVehType();
  $scope.onContractSelect = function(){
    //console.log($scope.oBookingUpData);
    $scope.aPreVehicleType = [];
  }
  $scope.onRouteSelect = function(){
    //console.log($scope.oBookingUpData.route);
    var item = $scope.oBookingUpData.route;
    $scope.oBookingUpData.route_name = item.route_name;
    $scope.oBookingUpData.trip_type = item.route_type;
    $scope.oBookingUpData.trip_distance = item.route_distance;
    $scope.newItem = [];
    for(var c=0;c<item.data.length;c++){
      if(item.data[c].booking_type == $scope.oBookingUpData.booking_type){
        $scope.newItem.push(item.data[c]);
      }
    }
    item.data =  $scope.newItem;
    $scope.rateSingle = item;
    if($scope.oBookingUpData.contract.name == 'One Time'){
      $scope.aPreVehicleType = $scope.aPreVehicleTypeLocalData;
    }else{
      $scope.aPreVehicleType = item.data;
    }
    if($scope.oBookingUpData.vehicle_type){
      for(var a=0;a<$scope.aPreVehicleType.length;a++){
        if($scope.aPreVehicleType[a].vehicle_type == $scope.oBookingUpData.vehicle_type){
          $scope.oBookingUpData.vehicle_type = $scope.aPreVehicleType[a];
          $scope.preVehicleGetData();
        }
      }
    }
  };
  $scope.preVehicleGetData = function(){
    $scope.newItem2 = [];
    for(var c=0;c<$scope.rateSingle.data.length;c++){
      if($scope.oBookingUpData.vehicle_type && $scope.oBookingUpData.vehicle_type.vehicle_type){
        if($scope.rateSingle.data[c].vehicle_type == $scope.oBookingUpData.vehicle_type.vehicle_type){
          $scope.newItem2.push($scope.rateSingle.data[c]);
        }
      }
    }
    if($scope.oBookingUpData.vehicle_type && $scope.oBookingUpData.vehicle_type.vehicle_type){
      $scope.rateSingle.data =  $scope.newItem2;
    }
  };
  $scope.getMaterial = function(){
    function success(data) {
      $scope.aMaterialGroup = data.data.data;
      if($scope.oBookingUpData.material_group){
        for(var a=0;a<$scope.aMaterialGroup.length;a++){
          if($scope.aMaterialGroup[a].name == $scope.oBookingUpData.material_group){
            $scope.oBookingUpData.material_group = $scope.aMaterialGroup[a];
            $scope.getMaterialType();
          }
        }
      }
    };
   bookingServices.getAllMaterial(success);
  };
  $scope.getMaterialType = function() {
    if($scope.oBookingUpData.material_group && $scope.oBookingUpData.material_group.material_types){
      $scope.aMaterialType = $scope.oBookingUpData.material_group.material_types;
    }
  }
  $scope.getMaterial();
  $scope.getShippingLine = function(){
   function success(data) {
      $scope.aShippingLine = data.data.data;
      if($scope.oBookingUpData.shipping_line_name){
        for(var a=0;a<$scope.aShippingLine.length;a++){
          if($scope.aShippingLine[a].name == $scope.oBookingUpData.shipping_line_name){
            $scope.oBookingUpData.shipping_line_name = $scope.aShippingLine[a].name;
          }
        }
      }
    };
   SLDOServices.getAllSLDO({}, success);
  };
  $scope.getShippingLine();

  $scope.checkReCont = function() {
    if($scope.oBookingUpData.reamining_container && $scope.oBookingUpData.total_containers){
      if($scope.oBookingUpData.reamining_container > $scope.oBookingUpData.total_containers){
        alert('Remaining is less then total container !!!');
        $scope.oBookingUpData.reamining_container = 0;
      }
    }
  }
  $scope.checkThisCont = function() {
    if($scope.oBookingUpData.no_containers && $scope.oBookingUpData.total_containers){
      if($scope.oBookingUpData.no_containers > $scope.oBookingUpData.total_containers){
        alert('This is less then total container !!!');
        $scope.oBookingUpData.no_containers = 0;
      }else{
        $scope.oBookingUpData.reamining_container = $scope.oBookingUpData.total_containers - $scope.oBookingUpData.no_containers;
      }
    }
  }

  $scope.weightTypeCondition = function(){
    if($scope.oBookingUpData.weight_type == 'Fixed'){
      $scope.oBookingUpData.rates = $scope.rateSingle.data[0].rate.vehicle_rate;
      $scope.oBookingUpData.final_rate = $scope.rateSingle.data[0].rate.vehicle_rate;
    }else if($scope.oBookingUpData.weight_type == 'PUnit'){
      $scope.oBookingUpData.weight = '';
      $scope.oBookingUpData.rates = $scope.rateSingle.data[0].rate.price_per_unit;
      $scope.oBookingUpData.final_rate = $scope.rateSingle.data[0].rate.price_per_unit * $scope.oBookingUpData.total_no_of_units;
    }else if($scope.oBookingUpData.weight_type == 'PMT'){
      $scope.oBookingUpData.weight = $scope.rateSingle.data[0].rate.min_payable_mt;
      $scope.oBookingUpData.rates = $scope.rateSingle.data[0].rate.price_per_mt;
      if($scope.oBookingUpData.weight > $scope.oBookingUpData.boe_weight.value){
        $scope.oBookingUpData.final_rate = $scope.rateSingle.data[0].rate.price_per_mt * $scope.oBookingUpData.weight;
      }else{
        $scope.oBookingUpData.final_rate = $scope.rateSingle.data[0].rate.price_per_mt * $scope.oBookingUpData.boe_weight.value;
      }
    }
  };
  setTimeout(function(){
    if($scope.oBookingUpData.weight_type){
      $scope.weightTypeCondition();
    }
  }, 2000);
  $scope.noOfUnit = function(){
    if($scope.oBookingUpData.weight_type == 'PUnit'){
      $scope.oBookingUpData.weight = '';
      $scope.oBookingUpData.rates = $scope.rateSingle.data[0].rate.price_per_unit;
      $scope.oBookingUpData.final_rate = $scope.rateSingle.data[0].rate.price_per_unit * $scope.oBookingUpData.total_no_of_units;
    }
  };

  $scope.updateBasicBooking = function(form){
    function successPost(response){
      if(response && response.data){
        //console.log(response);
        $rootScope.forUpdateBooking = response.data.data;
        $scope.oBookingUpData = {};
        swal("Booking Updated Successfully","","success");
        var sUrl = "#!/booking_manage/updateBooking/updateBookingExtra";
        $rootScope.redirect(sUrl);
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with booking creation","","error");
    }
    $scope.BookingErrMsgCond = false;
    if(!(form.$error.required) && !(form.$error.maxlength) && !(form.$error.minlength) && !(form.$error.email)){
      if($scope.oBookingUpData.booking_type){
        $scope.oBooking = angular.copy($scope.oBookingUpData);
        $scope.oBooking.booking_type = $scope.oBookingUpData.booking_type;
        $scope.oBooking.customer_name =  $scope.oBookingUpData.customer.name;
        $scope.oBooking.customer =  $scope.oBookingUpData.customer;
        $scope.oBooking.customer.id =  $scope.oBookingUpData.customer._id;
        $scope.oBooking.contract_type =  $scope.oBookingUpData.contract.contract_type;
        $scope.oBooking.contract_name =  $scope.oBookingUpData.contract.name;
        $scope.oBooking.contract_id   =  $scope.oBookingUpData.contract._id;
        //$scope.oBooking.branch = $scope.oBookingUpData.branch;  ////
        for(var x=0;x<$scope.oBookingUpData.customer.type.length;x++){
          if($scope.oBookingUpData.customer.type[x]=='Consignor'){
            $scope.oBooking.consigner =  $scope.oBookingUpData.customer._id;
            $scope.oBooking.consigner_name  =  $scope.oBookingUpData.customer.name;
          }else if($scope.oBookingUpData.customer.type[x]=='Consignee'){
            $scope.oBooking.consignee =  $scope.oBookingUpData.customer._id;
            $scope.oBooking.consignee_name  =  $scope.oBookingUpData.customer.name;
          }else if($scope.oBookingUpData.customer.type[x]=='CHA'){
            $scope.oBooking.cha =  $scope.oBookingUpData.customer._id;
            $scope.oBooking.cha_name  =  $scope.oBookingUpData.customer.name;
          }else if($scope.oBookingUpData.customer.type[x]=='Transporter'){
            $scope.oBooking.transporter =  $scope.oBookingUpData.customer._id;
            $scope.oBooking.transporter_name  =  $scope.oBookingUpData.customer.name;
          }else if($scope.oBookingUpData.customer.type[x]=='Billing party'){
            $scope.oBooking.billing_party =  $scope.oBookingUpData.customer._id;
            $scope.oBooking.billing_party_name  =  $scope.oBookingUpData.customer.name;
          }
        }
        $scope.oBooking.route =  $scope.rateSingle;
        $scope.oBooking.route.name = $scope.oBooking.route.route_name;
        if($scope.oBooking.contract.name == 'One Time'){
          $scope.oBooking.vehicle_type = $scope.oBookingUpData.vehicle_type.name;
          $scope.oBooking.vehicle_type_id = $scope.oBookingUpData.vehicle_type._id;
        }else{
          $scope.oBooking.vehicle_type = $scope.oBookingUpData.vehicle_type.vehicle_type;
          $scope.oBooking.vehicle_type_id = $scope.oBookingUpData.vehicle_type.vehicle_type_id;
        }

        for(var p=0;p<$scope.oBooking.route.data.length;p++){
          if($scope.oBooking.route.data[p].vehicle_type == $scope.oBookingUpData.vehicle_type.vehicle_type){
            $scope.oBooking.route.rates = $scope.oBooking.route.data[p];
          }
        }
        $scope.oBooking.route.route_id = $scope.oBooking.route.route__id;
        $scope.oBooking.route.route_type = $scope.oBookingUpData.trip_type;
        $scope.oBooking.route.route_distance = $scope.oBookingUpData.trip_distance;
        //$scope.oBooking.boe_value = $scope.oBookingUpData.boe_value; /////
        //$scope.oBooking.boe_weight = $scope.oBookingUpData.boe_weight; /////
        //$scope.oBooking.factory_invoice = $scope.oBookingUpData.factory_invoice; /////
        //$scope.oBooking.factory_invoice_date = $scope.oBookingUpData.factory_invoice_date; /////
        //$scope.oBooking.shipping_bill_no = $scope.oBookingUpData.shipping_bill_no; /////
        //$scope.oBooking.shipping_bill_date = $scope.oBookingUpData.shipping_bill_date; /////
        //$scope.oBooking.total_containers = $scope.oBookingUpData.total_containers; /////
        //$scope.oBooking.reamining_container = $scope.oBookingUpData.reamining_container; /////
        //$scope.oBooking.no_containers = $scope.oBookingUpData.no_containers; /////
        $scope.oBooking.documents_required = [];
        if($scope.example5model.length>0){
          for(var s=0;s<$scope.example5model.length;s++){
            $scope.oBooking.documents_required.push($scope.example5model[s].label);
          }
        }
        $scope.oBooking.material_group = $scope.oBookingUpData.material_group.name;
        //$scope.oBooking.material_type = $scope.oBookingUpData.material_type;  //////
        //$scope.oBooking.shipping_line_name = $scope.oBookingUpData.shipping_line_name; /////
        //$scope.oBooking.do_validity = $scope.oBookingUpData.do_validity; /////
        //$scope.oBooking.gatepass_validity = $scope.oBookingUpData.gatepass_validity; /////
        //$scope.oBooking.remarks = $scope.oBookingUpData.remarks; /////
        bookingServices.updateBasicFullBooking($scope.oBooking, successPost,failure);
      }
    } else {
            $scope.BookingErrMsg = '';
            $scope.BookingErrMsgCond = true;
            $scope.BookingErrMsg = formValidationgrowlService.findError(form.$error);
            setTimeout(function(){
              if($scope.BookingErrMsgCond){
                $scope.$apply(function() {
                  $scope.BookingErrMsgCond = false;
                });
              }
          }, 7000);
       }
      /*else if(form.$error && form.$error.required){
      for(i=0;i<form.$error.required.length;i++){
        if(form.$error.required[i].$name){
          $scope.BookingErrMsg = $scope.BookingErrMsg+" "+form.$error.required[i].$name + " ,";
        }
      }
      if($scope.BookingErrMsg){
        $scope.BookingErrMsg = $scope.BookingErrMsg.substring(0, $scope.BookingErrMsg.length - 1);
        $scope.BookingErrMsg = $scope.BookingErrMsg + ' are require.';
        $scope.BookingErrMsgCond = true;
        setTimeout(function(){
          if($scope.BookingErrMsgCond){
            $scope.$apply(function() {
              $scope.BookingErrMsgCond = false;
            });
          }
        }, 7000);
      }
    }*/
  };

  //$scope.aBookingTypes = ["Import - Containerized","Export – Containerized","Domestic – Containerized","Import - Cargo","Export – Cargo","Domestic – Cargo","Empty - Containerized","Empty - Vehicle","Transporter Booking"];

  //$scope.aBookingTypes = ["Domestic – Loose cargo","Transporter Booking","Import - Containerized","Export – Containerized","Import - Loose Cargo","Export – Loose cargo","Container FS","Container FDS"];
  //$scope.aBranch = ["Delhi","Dplah","Indore","Ujjain","Panipat","Jammu","Shajapur"];
  $scope.aRoutes = ["Delhi-Indore","Indore-Ujjain","Ujjain-Panipat","Panipat-Jammu","Jammu-shajapur"];
  $scope.aWeightTypes = ["PMT","PUnit","Fixed"];
  $scope.aTripTypeType = ["One Way","Two Way"];
  $scope.aDoc = ["Form 31","Form 47","Form 16"];
  $scope.getAllBranchSelect();
});

materialAdmin.controller("updateBookingExtraController", function($rootScope, $scope,constants,bookingServices) {
  $rootScope.updateBookingData = $rootScope.forUpdateBooking;
  $scope.getNumber = function(num) {
      return new Array(num);
  }
  $scope.aShippingLine = ["MGR","ALB","ASL"];
  $scope.cargo = {};
  $scope.containerInfo = [];
  $scope.infoCon = [];
  $scope.itemInfoCargo = [];
  $scope.aSizeOfVehicle = $rootScope.updateBookingData.route.rates;
  $scope.aYards = ['Denso Yard','abc yard','xyz yard'];
  if($rootScope.updateBookingData){
    /*for(var s=0;s<$rootScope.updateBookingData.no_containers;s++){
      if($rootScope.updateBookingData.info[s] && $rootScope.updateBookingData.info[s].item_no){
        $scope.infoCon[s] = {};
        $scope.infoCon[s]._id = $rootScope.updateBookingData.info[s]._id;
        $scope.infoCon[s].item_no = $rootScope.updateBookingData.info[s].item_no || s+1;
        $scope.infoCon[s].container_no = $rootScope.updateBookingData.info[s].container_no || '';
        $scope.infoCon[s].size = $rootScope.updateBookingData.info[s].size || $rootScope.updateBookingData.route.rates.vehicle_type;
        $scope.infoCon[s].weight = {};
        $scope.infoCon[s].weight.value = $rootScope.updateBookingData.info[s].weight.value || 0;
        $scope.infoCon[s].weight.unit = $rootScope.updateBookingData.info[s].weight.unit || $rootScope.updateBookingData.boe_weight.unit;
        $scope.infoCon[s].loading_yard = $rootScope.updateBookingData.info[s].loading_yard || '';
        $scope.infoCon[s].offloading_yard = $rootScope.updateBookingData.info[s].offloading_yard || '';
        $scope.infoCon[s].value = $rootScope.updateBookingData.info[s].value || 0;
        if($rootScope.updateBookingData.info[s].documents.length>0){
          $scope.infoCon[s].documents = $rootScope.updateBookingData.info[s].documents;
        }else{
          $scope.infoCon[s].documents = [];
          if($rootScope.updateBookingData.documents_required.length>0){
            for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
              $scope.infoCon[s].documents[t] = {};
              $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
              $scope.infoCon[s].documents[t].identity  = 0000;
            }
          }
        }
      }else{
        $scope.infoCon[s] = {};
        $scope.infoCon[s].item_no = s+1;
        $scope.infoCon[s].container_no = '';
        $scope.infoCon[s].size = $rootScope.updateBookingData.route.rates.vehicle_type;
        $scope.infoCon[s].weight = {};
        $scope.infoCon[s].weight.value = 0;
        $scope.infoCon[s].weight.unit = $rootScope.updateBookingData.boe_weight.unit;
        $scope.infoCon[s].loading_yard = '';
        $scope.infoCon[s].offloading_yard = '';
        $scope.infoCon[s].value = 0;

        $scope.infoCon[s].documents = [];
        if($rootScope.updateBookingData.documents_required.length>0){
          for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
            $scope.infoCon[s].documents[t] = {};
            $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
            $scope.infoCon[s].documents[t].identity  = 0000;
          }
        }
      }
    }*/

    if($rootScope.updateBookingData.booking_type == constants.bookingTypes.domestic_cargo){
      var newObject = angular.copy($rootScope.updateBookingData);
      $scope.itemCargoUp = newObject;
      for(var s=0;s<$rootScope.updateBookingData.info.length;s++){
        /*if($rootScope.updateBookingData.info[s] && $rootScope.updateBookingData.info[s].item_no){*/
          $scope.infoCon[s] = {};
          $scope.infoCon[s]._id = $rootScope.updateBookingData.info[s]._id;
          $scope.infoCon[s].item_no = $rootScope.updateBookingData.info[s].item_no || s+1;
          //$scope.infoCon[s].no_of_units = $rootScope.updateBookingData.info[s].no_of_units;
          if($rootScope.updateBookingData.info[s].weight && $rootScope.updateBookingData.info[s].weight.value){
            $scope.infoCon[s].weight = {};
            $scope.infoCon[s].weight.value = $rootScope.updateBookingData.boe_weight.value/$rootScope.updateBookingData.no_of_vehicle;
            $scope.infoCon[s].weight.unit = 'tonne';//$rootScope.updateBookingData.boe_weight.unit;
          }else{
            $scope.infoCon[s].weight = {};
            $scope.infoCon[s].weight.value = 0;
            $scope.infoCon[s].weight.unit = 'tonne';//$rootScope.updateBookingData.boe_weight.unit;
          }
          $scope.infoCon[s].loading_yard = $rootScope.updateBookingData.info[s].loading_yard || '';
          $scope.infoCon[s].offloading_yard = $rootScope.updateBookingData.info[s].offloading_yard || '';
          //$scope.infoCon[s].freight = $rootScope.updateBookingData.info[s].freight || 0;
          $scope.infoCon[s].rate = $rootScope.updateBookingData.info[s].rate || 0;
          //$scope.infoCon[s].value = $rootScope.updateBookingData.info[s].value;
          /*$scope.infoCon[s].documents = [];
          if($rootScope.updateBookingData.documents_required.length>0){
            for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
              if($rootScope.updateBookingData.info[s].documents[t] && $rootScope.updateBookingData.info[s].documents[t].name){
                $scope.infoCon[s].documents[t] = $rootScope.updateBookingData.info[s].documents[t]
              }else{
                $scope.infoCon[s].documents[t] = {};
                $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
                $scope.infoCon[s].documents[t].identity  = 0000;
              }
            }
          }*/
        /*}else{
          $scope.infoCon[s] = {};
          $scope.infoCon[s].item_no = s+1;
          $scope.infoCon[s].no_of_units = 0;
          $scope.infoCon[s].weight = {};
          $scope.infoCon[s].weight.value = 0;
          $scope.infoCon[s].weight.unit = $rootScope.updateBookingData.boe_weight.unit;
          $scope.infoCon[s].loading_yard = '';
          $scope.infoCon[s].offloading_yard = '';
          $scope.infoCon[s].freight = 0;
          $scope.infoCon[s].rate = 0;
          $scope.infoCon[s].value = 0;
          $scope.infoCon[s].documents = [];
          if($rootScope.updateBookingData.documents_required.length>0){
            for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
              $scope.infoCon[s].documents[t] = {};
              $scope.infoCon[s].documents[t].name = $rootScope.updateBookingData.documents_required[t];
              $scope.infoCon[s].documents[t].identity  = 0000;
            }
          }
        }*/
      }
    }
  }
  $scope.checkWeightCont = function(weight, index){
    var tWeight = '';
    var totalWeight = '';
    for(i=0;i<$scope.infoCon.length;i++){
       if($scope.infoCon[i].weight && $scope.infoCon[i].weight.value){
         tWeight = tWeight + $scope.infoCon[i].weight.value;
         tWeight = parseInt(tWeight);
       }
    }
    totalWeight = parseInt(tWeight);

    if(totalWeight > $rootScope.updateBookingData.boe_weight.value){
      $scope.infoCon[index].weight.value = '';
      swal("","Toatal weight should be less than Boe Weight","warning");
    } else if(weight && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*weight;
      //$scope.value1 =  parseFloat(Math.round($scope.value1 * 100) / 100).toFixed(2);
      $scope.infoCon[index].value = parseFloat($scope.value1.toFixed(2));
    }
  }

  $scope.addNewRowInTable = function(){
    $scope.infoConSingle = {};
    $scope.infoConSingle.item_no = $rootScope.updateBookingData.info.length+1;
    $scope.infoConSingle.no_of_units = 0;
    $scope.infoConSingle.weight = {};
    $scope.infoConSingle.weight.value = 0;
    $scope.infoConSingle.weight.unit = 'tonne';//$rootScope.updateBookingData.boe_weight.unit;
    //$scope.infoConSingle.loading_yard = '';
    //$scope.infoConSingle.offloading_yard = '';
    $scope.infoConSingle.freight = 0;
    $scope.infoConSingle.rate = 0;
    $scope.infoConSingle.value = 0;
    $scope.infoConSingle.documents = [];
    if($rootScope.updateBookingData.documents_required.length>0){
      for(var t=0; t<$rootScope.updateBookingData.documents_required.length;t++){
        $scope.infoConSingle.documents[t] = {};
        $scope.infoConSingle.documents[t].name = $rootScope.updateBookingData.documents_required[t];
        $scope.infoConSingle.documents[t].identity  = 0000;
      }
    }

    $scope.infoCon.push($scope.infoConSingle);
  }
  $rootScope.onceWeight = false;
  $scope.checkWeight = function(weight, index){
    var tWeight = '';
    var totalWeight = '';
    if($rootScope.onceWeight == true){
      for(i=0;i<$scope.infoCon.length;i++){
         if($scope.infoCon[i].weight && $scope.infoCon[i].weight.value){
           tWeight = tWeight + $scope.infoCon[i].weight.value;
           tWeight = parseInt(tWeight);
         }
      }
      totalWeight = parseInt(tWeight);
    }else{
      totalWeight = weight;
      $rootScope.onceWeight = true;
    }
    if(totalWeight > $rootScope.updateBookingData.boe_weight.value){
      $scope.infoCon[index].weight.value = '';
      swal("","Toatal weight should be less than Boe Weight","warning");
    } else if(weight && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*weight;
      $scope.valueFreight = $scope.infoCon[0].rate*weight;
      //$scope.cargo.freight = weight;
      $scope.infoCon[index].value = $scope.value1;
      $scope.infoCon[index].freight = $scope.valueFreight;
      $scope.infoCon[index].rate = $scope.infoCon[0].rate;
    }
  }
  $rootScope.onceUnit = false;
  $scope.checkNoUnit = function(unit, index){
    var tUnit = '';
    var totalUnit = '';
    if($rootScope.onceUnit == true){
      for(i=0;i<$scope.infoCon.length;i++){
         if($scope.infoCon[i].no_of_units){
           tUnit = tUnit + $scope.infoCon[i].no_of_units;
           tUnit = parseInt(tUnit);
         }
      }
      totalUnit = parseInt(tUnit);
    }else{
      totalUnit = unit;
      $rootScope.onceUnit = true;
    }
    if(totalUnit > $scope.itemCargoUp.info[0].no_of_units){
      $scope.infoCon[index].no_of_units = '';
      swal("","Toatal no of unit should be less than total units","warning");
    } else if(unit && $rootScope.updateBookingData.boe_weight.value && $rootScope.updateBookingData.boe_value) {
      $scope.value1 = ($rootScope.updateBookingData.boe_value/$rootScope.updateBookingData.boe_weight.value)*unit;
      $scope.valueFreight = $scope.infoCon[0].rate*unit;
      //$scope.cargo.freight = weight;
      $scope.infoCon[index].value = $scope.value1;
      $scope.infoCon[index].freight = $scope.valueFreight;
      $scope.infoCon[index].rate = $scope.infoCon[0].rate;
    }
  }
  $scope.checkContainerNo = function(containerNoType, index){
    var re = new RegExp('^[0-9]{4}[a-zA-Z]{7}$');
    if(re.test(containerNoType) == true){

    }else{
      $scope.infoCon[index].container_no = '';
    }
  }
  $scope.removeItems = function(selected, $index) {
    $scope.removeData = selected;
    $scope.infoCon.splice($index, 1);
  }

  $scope.addBookingExtra = function(){
    function successUpdate(response){
      if(response && response.data){
        //console.log(response);
        swal("Booking Updated Successfully","","success");
        if(response.data.data.booking_type == constants.bookingTypes.import_cargo || response.data.data.booking_type == constants.bookingTypes.export_cargo || response.data.data.booking_type == constants.bookingTypes.domestic_cargo){
          //$rootScope.updateBookingData = response.data.data;
        }else{
          var sUrl = "#!/booking_manage/updateBooking/updateBookingBilling";
          $rootScope.redirect(sUrl);
          $rootScope.billingInfo = response.data.data;
          //$rootScope.billingData = true;
        }
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with booking Updation","","error");
    }
    $scope.upBooking = {};
    //$scope.upBooking._id = $rootScope.updateBookingData._id;
    $scope.upBooking.info = $scope.infoCon;
    bookingServices.updateBooking($scope.upBooking, successUpdate,failure);

  };

  $scope.updtBookingother = function(){
    function suc(response){
      if(response && response.data){
        $rootScope.updateBookingData._id = response.data.data._id;
        //console.log(response);
        swal("Booking Updated Successfully","","success");
      }
    }
    function fail(res){
      console.log("fail: ",res);
      swal("Some error with booking Updation","","error");
    }
    //$rootScope.updateBookingDataForService = $scope.updateBookingData;
    bookingServices.updateBooking($scope.updateBookingData, suc,fail);
  };

  function success(data) {
      $scope.aCustomersforDetails = data.data;
    };

  $scope.getNameforOtherDetails = function(name){
    if(name && name.length>1){
      var otherDetailsName = name;
      bookingServices.getAllCustomersforDetails(otherDetailsName, success);
    }
  };
  $scope.getAllIcdForUpdate = function(){
    function successICD(data) {
       if(data.data && data.data.length>0){
          $scope.aIcdList = data.data;
       }
    };
   function failureICD(res){
       console.log("fail: ",res);
       swal("Some error with GET ICD.","","error");
    }

    bookingServices.getAllIcdService(successICD,failureICD);
  }
  $scope.getAllIcdForUpdate();
});

materialAdmin.controller("updateBookingBill", function($rootScope, $scope,bookingServices,userService) {
  $rootScope.billingInfo = $rootScope.forUpdateBooking;
  if($rootScope.billingInfo){
    $rootScope.billingInfo.booking_date = new Date();
    $scope.billingInfo.last_date_of_dispatch = new Date();
    $scope.billingInfo =$rootScope.billingInfo;
  }

  $scope.updtBookingother = function(){
    function suc(response){
      if(response && response.data){
        //console.log(response);
        swal("Booking Save Successfully","","success");
        var sUrl = "#!/booking_manage/bookings";
        $rootScope.redirect(sUrl);
      }
    }
    function fail(res){
      console.log("fail: ",res);
      swal("Some error with booking Save","","error");
    }
    $scope.billingInfo.marketed_by = {};
    $scope.billingInfo.marketed_by.name = $scope.billingInfo.marketed_by_full.full_name;
    $scope.billingInfo.marketed_by.employeed_id = $scope.billingInfo.marketed_by_full.clientId;
    $scope.billingInfo.marketed_by.role  = $scope.billingInfo.marketed_by_full.role;
    $rootScope.selectedBookingInfoForService = $scope.billingInfo;
    bookingServices.updateBooking222($scope.billingInfo, suc,fail);
  };

  function success(data) {
    $scope.aCustomersforDetails = data.data;
  };

  $scope.getNameforOtherDetails = function(customerName,customerType){
    var cType = JSON.stringify([customerType])
    var details = {
      type:cType,
      all:true
    }
    if(customerName && customerName.length>1){
      details.name = customerName;
      bookingServices.getAllCustomersforDetails(details, success);
    }
  };

  $scope.onConsignerSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.consigner = model._id;
      $scope.billingInfo.consigner_name = model.name;
    }
    //console.log(model);
  };
  $scope.onConsigneeSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.consignee = model._id;
      $scope.billingInfo.consignee_name = model.name;
    }
    //console.log(model);
  };
  $scope.onCHASelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.selectedBookingInfo.cha = model._id;
      $scope.billingInfo.cha_name = model.name;
    }
    //console.log(model);
  };
  $scope.onBillingSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.billing_party = model._id;
      $scope.billingInfo.billing_party_name = model.name;
    }
    //console.log(model);
  };
  $scope.onTransporterSelect = function(item, model, label){
    if(model && model._id && model.name){
      $scope.billingInfo.transporter = model._id;
      $scope.billingInfo.transporter_name = model.name;
    }
    //console.log(model);
  };
  //*************** New Date Picker for multiple date selection in single form ************
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.example5model = [];
    //console.log($scope.example5model);
    $scope.example5data = [
      {id: 1, label: "Form 31"},
      {id: 2, label: "Form 16"},
      {id: 3, label: "Form 47"}
    ];
    $scope.example5settings = {
      showCheckAll: false,
      showUncheckAll: false,
      externalIdProp: ''
    };
    $scope.example5customTexts = {buttonDefaultText: 'Select Doc'};

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

  //************* New Date Picker for multiple date selection in single form ******************//
  $scope.getAllUsersUp = function(){
    function successUsers(data) {
       if(data.data && data.data.length>0){
          $scope.aUsers = data.data;
          if($scope.billingInfo.marketed_by && $scope.billingInfo.marketed_by.name){
            for(var a=0;a<$scope.aUsers.length;a++){
              if($scope.aUsers[a].full_name == $scope.billingInfo.marketed_by.name){
                $scope.billingInfo.marketed_by_full = $scope.aUsers[a];
                $scope.onCustomerSelect();
              }
            }
          }
       }
    };
   function failureUsers(res){
       console.log("fail: ",res);
       swal("Some error with GET Users.","","error");
    }

    userService.getUsers({user_type:"Marketing Manager",all:true},successUsers,failureUsers);
  }
  $scope.getAllUsersUp();
});

materialAdmin.controller("approveBookingController", function($rootScope, $scope,bookingServices,$localStorage) {
    $rootScope.selectedBooking;
    $scope.approveValue = {};
    //$rootScope.approveData = 'approve';
    $scope.aRegion = ["Customer want to reject","Vehicle not available","Booking enter by mistake","Customer not present"];
    $scope.data = {};
    $scope.data.booking_status = {};

    $scope.approveUpdate = function(Value){
      $scope.data.booking_status.status = $rootScope.approveData;
      if(Value && Value.option){
        $scope.data.booking_status.option = Value.option;
      }
      if(Value && Value.comment){
        $scope.data.booking_status.comment = Value.comment;
      }
      $scope.data.booking_status.date = new Date();
      if($scope.logInUser && $scope.logInUser.full_name)
      $scope.data.booking_status.person = $scope.logInUser.full_name;
    function successPost(response){
      if(response && response.data){
        $scope.closeModal();
        //console.log(response);
        $rootScope.selectedBooking = response.data.data;
        $rootScope.getAllUpdatedBooking();
        swal("Booking Updated Successfully","","success");
        /*var sUrl = "#!/booking_manage/updateBooking/updateBookingExtra";
        $rootScope.redirect(sUrl);*/
      }
    }
    function failure(res){
      console.log("fail: ",res);
      swal("Some error with booking creation","","error");
    }


    if($localStorage.ft_data.userLoggedIn && $localStorage.ft_data.userLoggedIn.role == 'approve_admin' && $rootScope.selectedBooking && $rootScope.selectedBooking._id){
      bookingServices.approveUpdateBooking($scope.data, successPost,failure);
    }
  }

});

materialAdmin.controller("bookingNewVehicleTypePopUpCtrl", function($rootScope, $scope, $uibModalInstance,Vehicle) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    /*function success(res) {
        if (res && res.data && (res.data.status == "OK")) {
            $uibModalInstance.close(res);
        } else {
            $uibModalInstance.dismiss(res);
        }
    }*/
//************************************************Type****************************
    /*$rootScope.hideThis = false;
    $scope.vType = {};
    $scope.cVehicleErrMsg = false;*/

    function success(response) {
        if (response && response.data && response.data.data) {
            $scope.vehicleGroup = response.data.data;
        }
    }

    function fail(res) {
        console.error("fail: ", res);
    }
    function allGroup(){
      Vehicle.getallGroup(success, fail);
    };
    allGroup();

    function succType(response) {
        if (response && response.data && response.data.data) {
            $scope.vType = {};
            $uibModalInstance.close(response);
        }
    }

    function failType(res) {
        console.error("fail: ", res);
    }

    $scope.vTypeDetails = function () {
      if ($scope.selectName) {
        $scope.vType.group_name = {};
        $scope.vType.group_name = $scope.selectName;
      }
      //if () {
        Vehicle.saveVehicleType($scope.vType, succType, failType);
      //}
    };

    $scope.getGroupName = function (selectType) {
        if (selectType) {
            $scope.selectName = selectType.name;
            $scope.vType.group_code = selectType.code;
            $scope.vType.group = selectType._id;
        }
    }



//********************************************************************************
    function succGroup(response) {
      if (response && response.data && response.data.data) {
        $scope.group = {}
        allGroup();
      }
    }

    function groupFail(res) {
      console.error("fail: ", res);
    }

    //$scope.vGroupErrormsg = false;
    $scope.groupRegisterDetails = function() {
      if ($scope.group) {
        Vehicle.saveGroup($scope.group, succGroup, groupFail);
      }
    }

});

materialAdmin.controller("bookingNewRoutePopUpCtrl", function($rootScope, $timeout, $scope, $interval,$uibModalInstance, Routes,Vehicle,formValidationgrowlService) {
  $scope.closeModal = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $rootScope.editEnableRoute = false;
  $rootScope.wantRegRout = true;
  $scope.createcustmsg = false;
  var routes = [];
  var routeRequest;
  var sName = "";
  var dName = "";
  var srName = "";
  var drName = "";


  $scope.regRouteNew = {};
  $scope.geolocate = function(sUId){
    googlePlaceAPI.geolocate(sUId);
  };
  var gAPI = new googlePlaceAPI($interval);
  gAPI.fight($scope,['source','destination']);


//*************************************************************************
  function successOwnedVehicle(response){
    if(response.data.data){
      $scope.vehicleTypeData = response.data.data;
    }
  }

  //Self Invoking Function
  (function(){
    Vehicle.getType(successOwnedVehicle)
  })();

  $scope.searchCity = function(value){
    if((value== "1")||(value == "2")){
        setTimeout(function(){
        $scope.$apply(function() {
            if(value == "1"){
              srName = $scope.source.c;
              sName = $scope.source.c +"-"+$scope.source.d +"("+$scope.source.st_s+")";
              $scope.regRouteNew.source = $scope.source;
              $scope.fromCity = $scope.source.c;
              $scope.fromState = $scope.source.st;
            }else if(value== "2"){
              drName = $scope.destination.c;
              dName = $scope.destination.c +"-"+$scope.destination.d +"("+$scope.destination.st_s+")";
              $scope.regRouteNew.destination = $scope.destination;
              $scope.toCity = $scope.destination.c;
              $scope.toState = $scope.destination.st;
            }
            $scope.name = sName +" to "+dName;
            $scope.routeName = srName +" to "+drName;
            //routeDistance();
          });
      }, 500);
    }
  };

  function successPost(response){
    if(response && response.data && (response.data.status=="OK") && response.data.data){
      $uibModalInstance.close(response);
    }
  }
  function failure(res){
    console.log("fail: ",res);
    swal("Route Registration Failed","","error");
  }

  $scope.saveRouteRegDetails = function(form) {
    //if(form.$valid){
      $scope.rmsg1 = $scope.rmsg2 = $scope.rmsg3 = $scope.rmsg4 = $scope.rmsg5 = '';
      var allWayPoints = [];
      for (var i = 0; i < routes.length; i++) {
        var routeWayPoint = [];
        if(routes[i].overview_path) {
          var routeLength = routes[i].overview_path.length;
          var skipLength = Math.floor(routeLength/9);
          if(skipLength>10){
            for (var j = 0; j < routeLength; j=j+skipLength) {
              oCord = {};
              oCord.lat = routes[i].overview_path[j].lat();
              oCord.lng = routes[i].overview_path[j].lng();
              routeWayPoint.push(oCord);
            }
          }else{
            for (var j = 0; j < routeLength; j++) {
              oCord = {};
              oCord.lat = routes[i].overview_path[j].lat();
              oCord.lng = routes[i].overview_path[j].lng();
              routeWayPoint.push(oCord);
            }
          }
          allWayPoints.push({"route":routeWayPoint});
        }
        //console.log(allWayPoints);
      }
      $scope.regRouteNew.routeRequest = routeRequest;
      $scope.regRouteNew.routeWayPoints = allWayPoints;
      $scope.regRouteNew.name = $scope.routeName;
      Routes.saveRoute($scope.regRouteNew, successPost,failure);
    /*} else {
              $scope.dmsg = '';
              $scope.createcustmsg = true;
              $scope.dmsg = formValidationgrowlService.findError(form.$error);
              setTimeout(function(){
                if($scope.createcustmsg){
                  $scope.$apply(function() {
                    $scope.createcustmsg = false;
                  });
                }
              }, 7000);
      }*/
  }
});
