materialAdmin.controller("customerPaymentCtrl", function($rootScope, $scope, $state, $modal, $localStorage, DateUtils, billsService, bookingServices, tripServices, Vendor,customer) {

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
        if($scope.bookingCustomer && $scope.bookingCustomer.name){
          myFilter.customer_id = $scope.bookingCustomer._id;
         }
        /*if($scope.vendorName && $scope.vendorName._id){
            myFilter.vendor_id = $scope.vendorName._id;
         }*/
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

    $scope.getCustomerPayment = function(customer, start_date, end_date) {
        console.log('getting invoice', customer, start_date, end_date);

        function success(data) {
            console.log(JSON.stringify(data));
            if (data.data && data.data.data && data.data.data.length > 0) {
                $rootScope.aInvoive = data.data.data;
                // console.log(data);
                // console.log('bookings', $scope.aBookings);
            }

            // console.log('boes', $scope.aBoes);
            // console.log('boenos', $scope.aBoeNos);
        }

        function failure(res) {
            console.log("fail: ", res);
            swal("Some error with GET trips.", "", "failure");
        }
        var oFilter = prepareFilterObject();
        tripServices.getAllCustomerPayment(oFilter, success);
    };

    $scope.getCustomerPayment();

    $scope.clearSearch = function(){
      $scope.bookingCustomer = '';
      $scope.getCname($scope.bookingCustomer);
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
        $scope.getCustomerPayment();
      };
    };

    $scope.onSelect=function ($item, $model, $label){
      $scope.currentPage = 1;
      $scope.getCustomerPayment();
    };

    $scope.getmyDetailInfo = function(selected, index) {
        $rootScope.selectedCustomerPayment = selected;
        var sUrl = "#!/billing/customerPayDetails";
        $rootScope.redirect(sUrl);
    }

    $rootScope.formatfindPaidAmount = function(selectInVoice){
        var paid = 0;
        if(selectInVoice && selectInVoice.payment){
            for(i=0;i<selectInVoice.payment.length;i++){
                paid = paid + (selectInVoice.payment[i].amount || 0);
            }
            $rootScope.ramainingAmount = ((selectInVoice.total_expenses || 0) - (paid || 0));
        }
        return paid;
    }
});

materialAdmin.controller("customerPayDetailsCtrl", function($rootScope, $uibModal, $interval,$scope, $state, $modal, $localStorage, DateUtils, billsService, bookingServices, tripServices, Vendor,customer) {
    $rootScope.selectedCustomerPayment;
    if(!$rootScope.selectedCustomerPayment){
        var bUrl = "#!/billing/customerPayment";
        $rootScope.redirect(bUrl);
    }

    $scope.addNewRowInTable = function(selectedCustomerPayment){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/bills/customerPayBillpopUp.html',
            controller: 'PaymentAddCtrl',
            resolve: {
                thatSCP: function() {
                    return selectedCustomerPayment;
                }
            }
        });
    }

    $scope.removeItems = function(selectedCustomerPayment, info, index){
        function suc(data) {
            var msg = data.data.message
            swal("Customer Payment Updated", msg, "success");
        };

        function failure(res){
          console.log("fail: ",res);
          var msg = res.data.error_message;
          swal("", msg, "failure");
        }

        if(selectedCustomerPayment && selectedCustomerPayment._id){
            $rootScope.billDataID = selectedCustomerPayment._id;
            //$scope.payment = selectedCustomerPayment.payment;
        }
        selectedCustomerPayment.payment.splice(index, 1);
        //selectedCustomerPayment.payment.shift(index);
        $scope.data = selectedCustomerPayment
        if($rootScope.billDataID){
            billsService.customerPaymentUpdate($scope.data, suc, failure);
        }
    }
});

materialAdmin.controller("PaymentAddCtrl", function($rootScope, $scope,$localStorage, $uibModalInstance, $interval, thatSCP,billsService) {
    $scope.payOption = {};
    $scope.statusSet = ['Paid', 'Unpaid']
    $scope.payment = [];
    $scope.payOption.date = new Date();

    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    if(!thatSCP){
        var bUrl = "#!/billing/customerPayment";
        $rootScope.redirect(bUrl);
    }

    var UserDATA = $localStorage.ft_data.userLoggedIn;
    if(UserDATA && UserDATA.full_name){
       $scope.payOption.person = UserDATA.full_name;
    }

    function suc(data) {
        var msg = data.data.message
        swal("Customer Payment Updated", msg, "success");
        $scope.closeModal();
    };

    function failure(res){
      console.log("fail: ",res);
      var msg = res.data.error_message;
      swal("", msg, "error");
      $scope.closeModal();
      //swal("Some error with booking creation","","failure");
    }

    $scope.addPayment = function(payOption){
        console.log(payOption);
        if(thatSCP && thatSCP._id){
            $rootScope.billDataID = thatSCP._id;
            //$scope.payment = thatSCP.payment;
        }
        if(!thatSCP.payment){
           thatSCP.payment = [];
        }
        if(thatSCP){
            thatSCP.payment.push(payOption);
            var totalPaid = 0;
            for(i=0;i<thatSCP.payment.length;i++){
                totalPaid = totalPaid + (thatSCP.payment[i].amount || 0);
            }
        }

        if(totalPaid && totalPaid <= thatSCP.total_expenses){
            $scope.data = thatSCP;
            if($rootScope.billDataID){
                billsService.customerPaymentUpdate($scope.data, suc, failure);
            }
        } else{
              if(thatSCP && thatSCP.payment && thatSCP.payment.length>0){
                thatSCP.payment.pop(payOption);
              }
              var totalPaid = 0;
              $scope.dmsg = '';
              $scope.createerror = true;
              $scope.dmsg = 'Total amount should be less or equal to Total Expenses';
              setTimeout(function(){
                if($scope.createerror){
                  $scope.$apply(function() {
                    $scope.createerror = false;
                  });
                }
              }, 7000);
        }
    }

});
