materialAdmin.controller("vendorPaymentCtrl", function($rootScope, $scope, $state, $modal, $localStorage, DateUtils, billsService, bookingServices, tripServices, Vendor,customer) {
    var lastFilter;
    /*$scope.getCustomer = function() {
        console.log('getting cus');

        function success(data) {
            $scope.aCustomers = data.data;
            console.log('customers: ', $scope.aCustomers);
        }
        bookingServices.getAllCustomers(success);
    };
    $scope.getCustomer();*/

    $scope.getAllVendorsList =function() {
        function successVendorList(res) {
            if (res.data.data) {
                $scope.aVendors = res.data.data;
            }
        }
        Vendor.getAllVendorsList({deleted: false}, successVendorList)
    }
    $scope.getAllVendorsList();

    /*$scope.customerPay = {};
    $scope.customerPay.end_date = new Date();
    $scope.customerPay.start_date = new Date($scope.customerPay.end_date);
    $scope.customerPay.start_date.setDate($scope.customerPay.end_date.getDate() - 7);*/

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    function prepareFilterObject(){
        var myFilter = {};
        if($scope.Customer && $scope.Customer.name){
          myFilter.customer_id = $scope.Customer._id;
         }
        if($scope.vendorName && $scope.vendorName._id){
            myFilter.vendor = $scope.vendorName._id;
         }
        if($scope.trip){
          myFilter.trip_no = $scope.trip;
         }
        if($scope.sdate){
          myFilter.start_date = $scope.sdate;
         }
        if($scope.edate){
          myFilter.end_date = $scope.edate;
         }
        /*if(isPagination && $scope.currentPage){
           myFilter.skip = $scope.currentPage;
          }*/
        return myFilter;
    };

    $scope.getvendorPayment = function() {

        function success(data) {
            console.log(JSON.stringify(data));
            if (data.data && data.data.data) {
                $scope.avendorTrip = data.data.data;
            }
        }

        function failure(res) {
            console.log("fail: ", res);
            swal("Some error with GET trips.", "", "error");
        }
        var oFilter = prepareFilterObject();
        lastFilter = oFilter;
        billsService.getAllVendorPayment(oFilter, success);
    };

    $scope.getvendorPayment();

    $scope.clearSearch = function(){
      $scope.Customer = '';
      $scope.getCname($scope.Customer);
    }

    $scope.getCname = function(viewValue){
      if(viewValue && viewValue.toString().length>2){
        function oSucC(response){
          $scope.aCustomer = response.data.data;
        };
        function oFailC(response){
          console.log(response);
        }
        customer.getCname(viewValue,oSucC,oFailC);
      }
      else if(viewValue == ''){
        $scope.currentPage = 1;
        $scope.getvendorPayment();
      };
    };

    $scope.onSelect=function ($item, $model, $label){
      $scope.currentPage = 1;
      $scope.getvendorPayment();
    };

    $scope.downloadReport = function(){
        lastFilter.report_download = "true";
        billsService.getAllVendorPayment(lastFilter, function(data) {
            var a = document.createElement('a');
            a.href = data.data.url;
            a.download = data.data.url;
            a.target = '_blank';
            a.click();
        });
    }

    $scope.getmyVendorDetailInfo = function(selected, index) {
        //$rootScope.selectedvendorPayment = selected;
        $state.go("billing.vendorPayDetails",{"data":selected})
        //var sUrl = "#!/billing/vendorPayDetails";
        //$rootScope.redirect(sUrl);
    }

    $scope.formatfindVendorRemainAmount = function(selectInVoice){
        var paid = 0;
        if(selectInVoice && selectInVoice.payment){
            for(i=0;i<selectInVoice.payment.length;i++){
                paid = paid + (selectInVoice.payment[i].amount || 0);
            }
            $rootScope.ramainingAmountforVendor = ((selectInVoice.total_expense || 0) - (paid || 0));
        }
        return paid;
    }
});

materialAdmin.controller("vendorPayDetailsCtrl", function($rootScope, $uibModal, $interval,$scope, $state,$stateParams, $modal, $localStorage, DateUtils, billsService, bookingServices, tripServices, Vendor,customer) {
    //console.log($stateParams);
    $scope.selectedvendorPayment = $stateParams.data;
    if(!$scope.selectedvendorPayment){
        var bUrl = "#!/billing/vendorPayment";
        $rootScope.redirect(bUrl);
    }
    $scope.formatfindVendorRemainAmount = function(selectInVoice){
        var paid = 0;
        if(selectInVoice && selectInVoice.payment){
            for(i=0;i<selectInVoice.payment.length;i++){
                paid = paid + (selectInVoice.payment[i].amount || 0);
            }
            $rootScope.ramainingAmountforVendor = ((selectInVoice.total_expense || 0) - (paid || 0));
        }
        return paid;
    }
    $scope.addNewRowInTable = function(selectedvendorPayment){
        var myData = angular.copy(selectedvendorPayment)
        var modalInstance = $uibModal.open({
            templateUrl: 'views/bills/vendorPayBillpopUp.html',
            controller: 'PaymentvendorAddCtrl',
            resolve: {
                thatSVP: function() {
                    return myData;
                }
            }
        });
        modalInstance.result.then(function (allData) {
          $scope.selectedvendorPayment = allData;
        }, function () {
          //$log.info('modal-component dismissed at: ' + new Date());
        });
    }

    $scope.statusExpense = function(selectedvendorPayment, info, index){
        /*function suc(data) {
            var msg = data.data.message
            swal("Trip Expense Updated", msg, "success");
        };

        function failure(res){
          console.log("fail: ",res);
          var msg = res.data.error_message;
          swal("", msg, "error");
        }

        if(selectedvendorPayment && selectedvendorPayment._id){
            $scope.vendorPaymentDataID = selectedvendorPayment._id;
            //$scope.payment = selectedCustomerPayment.payment;
        }
        selectedvendorPayment.payment.splice(index, 1);
        //selectedCustomerPayment.payment.shift(index);
        $scope.data = selectedvendorPayment
        if($scope.vendorPaymentDataID){
            billsService.updateTripExpenseInVendorPayment($scope.data, suc, failure);
        }*/
        var mixData = {
            all: selectedvendorPayment,
            selected: info,
            index: index
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'views/bills/vendorPaymentStatus.html',
            controller: 'PaymentvendorStatusCtrl',
            resolve: {
                thatData: function() {
                    return mixData;
                }
            }
        });

        modalInstance.result.then(function (allData) {
          $scope.selectedvendorPayment = allData;
        }, function () {
          //$log.info('modal-component dismissed at: ' + new Date());
        });
    }
});

materialAdmin.controller("PaymentvendorStatusCtrl", function($rootScope, $scope,$localStorage, $uibModalInstance,tripServices, $interval, thatData,Vendor) {
    $scope.heading_value = "Vendor Payment";
    var mixData = angular.copy(thatData);
    $scope.selectedvendorPayment = mixData.all;
    $scope.expenseOption = mixData.selected;
    $scope.pre_amount = angular.copy(mixData.selected.amount);
    $scope.statusSet = ['Paid'];

    $scope.other = false;
    $scope.aKey = ["Advance","Balance","Part","Other"];
    //$scope.expenseOption.date = new Date();
    $scope.oData = {};
    $scope.modePayment = ["Cash","Internet Banking","Cheque"];
    $scope.modeshow = false;
    $scope.statusMode = false;
    $scope.aBank = [];
    $scope.bankSelect = function(o){
        $scope.expenseOption.banking_detail = o;
    }
    //******************************
    function successVendor(res){
            if(res.data && res.data.data && res.data.data[0].banking_details){
                $scope.aBank = res.data.data[0].banking_details;
            }
        }

    (function(){
        if($scope.selectedvendorPayment && $scope.selectedvendorPayment.vendor){
            Vendor.getAllVendorById({_id:$scope.selectedvendorPayment.vendor},successVendor)
        }
    })();

    //******************************
    $scope.modeFunction = function(){
        if($scope.expenseOption.mode == "Cash"){
            $scope.modeshow = false;
        }else{
            $scope.modeshow = true;
        }
    }
    $scope.statusChange = function(){
        if($scope.expenseOption.status == 'Paid'){
            $scope.statusMode = true;
        }else{
            $scope.statusMode = false;
        }
    }
    $scope.keyChange = function(){
        if($scope.expenseOption.key == "Other"){
            $scope.other = true;
        }else{
            $scope.other = false;
        }
    }











    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    if(!mixData){
        var bUrl = "#!/billing/vendorPayment";
        $rootScope.redirect(bUrl);
    }

    var UserDATA = $localStorage.ft_data.userLoggedIn;
    if(UserDATA && UserDATA.full_name){
       $scope.selectedvendorPayment.person = UserDATA.full_name;
    }

    function suc(data) {
        var msg = data.data.message
        $scope.other = false;
        $scope.oData = {};
        swal("Updated", msg, "success");
        $uibModalInstance.close(data.data.data);
    };

    function failure(res){
      console.log("fail: ",res);
      var msg = res.data.error_message;
      swal("", msg, "error");
      $scope.closeModal();
      //swal("Some error with booking creation","","failure");
    }

    $scope.statusUpdate = function(postData){
        if(postData.amount<$scope.pre_amount){
            var preData = angular.copy(postData);
            var diff = ($scope.pre_amount - postData.amount);
            preData.amount = angular.copy(diff);
            preData.status = 'Unpaid';
            $scope.selectedvendorPayment.payment.push(postData);
            $scope.selectedvendorPayment.payment[mixData.index] = preData;
            tripServices.updateTripExpPay($scope.selectedvendorPayment, suc, failure);
        }else{
            $scope.selectedvendorPayment.payment[mixData.index] = postData;
            tripServices.updateTripExpPay($scope.selectedvendorPayment, suc, failure);
        }
    }
});

materialAdmin.controller("PaymentvendorAddCtrl", function($rootScope, $scope,$localStorage, $uibModalInstance,tripServices, $interval, thatSVP,Vendor) {
    $scope.heading_value = "Vendor Payment";
    $scope.selectedvendorPayment = angular.copy(thatSVP);
    $scope.expenseOption = {};
    $scope.statusSet = ['Paid', 'Unpaid'];
    $scope.other = false;
    $scope.aKey = ["Advance","Balance","Part","Other"];
    $scope.expenseOption.date = new Date();
    $scope.oData = {};
    $scope.modePayment = ["Cash","Internet Banking","Cheque"];
    $scope.modeshow = false;
    $scope.statusMode = false;
    $scope.aBank = [];
    $scope.bankSelect = function(o){
        $scope.expenseOption.banking_detail = o;
    }
    //******************************
    function successVendor(res){
            if(res.data && res.data.data && res.data.data[0].banking_details){
                $scope.aBank = res.data.data[0].banking_details;
            }
        }

    (function(){
        if(thatSVP && thatSVP.vendor){
            Vendor.getAllVendorById({_id:thatSVP.vendor},successVendor)
        }
    })();

    //******************************
    $scope.modeFunction = function(){
        if($scope.expenseOption.mode == "Cash"){
            $scope.modeshow = false;
        }else{
            $scope.modeshow = true;
        }
    }
    $scope.statusChange = function(){
        if($scope.expenseOption.status == 'Paid'){
            $scope.statusMode = true;
        }else{
            $scope.statusMode = false;
        }
    }
    $scope.keyChange = function(){
        if($scope.expenseOption.key == "Other"){
            $scope.other = true;
        }else{
            $scope.other = false;
        }
    }

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    if(!thatSVP){
        var bUrl = "#!/billing/vendorPayment";
        $rootScope.redirect(bUrl);
    }

    var UserDATA = $localStorage.ft_data.userLoggedIn;
    if(UserDATA && UserDATA.full_name){
       $scope.expenseOption.person = UserDATA.full_name;
    }

    function suc(data) {
        var msg = data.data.message
        $scope.other = false;
        $scope.oData = {};
        swal("Updated", msg, "success");
        $uibModalInstance.close(data.data.data);
    };

    function failure(res){
      console.log("fail: ",res);
      var msg = res.data.error_message;
      swal("", msg, "error");
      $scope.closeModal();
      //swal("Some error with booking creation","","failure");
    }

    $scope.addExpenseInfo = function(data){
        //console.log(expenseOption);
        var expenseOption = angular.copy(data);
        if(expenseOption.key == "Other"){
            expenseOption.key = $scope.oData.myKey;
        }
        if(thatSVP && thatSVP._id){
            $scope.vendorPaymentDataID = thatSVP._id;
            //$scope.payment = thatSVP.payment;
        }
        if(!thatSVP.payment){
           thatSVP.payment = [];
        }
        if(thatSVP){
            thatSVP.payment.push(expenseOption);
            var totalPaid = 0;
            for(i=0;i<thatSVP.payment.length;i++){
                totalPaid = totalPaid + (thatSVP.payment[i].amount || 0);
            }
        }

        if(totalPaid && totalPaid <= thatSVP.total_expense){
            $scope.data = thatSVP;
            if($scope.vendorPaymentDataID){
                tripServices.updateTripExpPay($scope.data, suc, failure);
            }
        }else{
          if(thatSVP && thatSVP.payment && thatSVP.payment.length>0){
            thatSVP.payment.pop(expenseOption);
          }
          var totalPaid = 0;
          $scope.dmsg = '';
          $scope.create = true;
          $scope.dmsg = 'Total amount should be less or equal to Total Expenses';
          setTimeout(function(){
            if($scope.create){
              $scope.$apply(function() {
                $scope.create = false;
              });
            }
          }, 7000);
        }
    }
});
