materialAdmin.controller("sldoCommonController", function($rootScope, $scope, SLDOServices) {
  $("p").text("SLDO");
  //$rootScope.wantThis = false;
  $rootScope.wantRegSL = false;
  $scope.currentPage = 1;
    $scope.maxSize = 3;
    $scope.items_per_page = 10;
    $scope.pageChanged = function() {
     $scope.getAllSLDO(true);
   };
  
  function prepareFilterObject(isPagination){
       var myFilter = {};
       if($scope.sldoName){
          myFilter.name = $scope.sldoName;
        } 
        if(isPagination && $scope.currentPage){
         myFilter.skip = $scope.currentPage;
        } 
        return myFilter;
      };

  $scope.getAllSLDO = function(isPagination){
  function success(data) {
		$rootScope.sldos = data.data.data;
    $scope.sldos = data.data.data;
		if(data.data && data.data.data.length>0){
      $scope.total_pages = data.data.pages;
      $scope.totalItems = 15*data.data.pages;
			$rootScope.sldo = data.data.data[0];
			setTimeout(function(){ 
				listItem = $($('.lv-item')[0]);
		        	listItem.addClass('grn');
			 }, 500);
		}
  	};
    var oFilter = prepareFilterObject(isPagination);
  	SLDOServices.getAllSLDO(oFilter, success);
  }
  $scope.getAllSLDO();

  function oSucC(response){
    $scope.sldos = response.data.data;
  };
  function oFailC(response){
    console.log(response);
  }

  $scope.clearSearch = function(){
    $scope.sldoName = '';
    $scope.getSLDOName($scope.sldoName);
  }

  $scope.getSLDOName = function(viewValue){
      if(viewValue && viewValue.toString().length>2){
       SLDOServices.getCname(viewValue,oSucC,oFailC);
      }
      else if(viewValue == ''){
        $scope.currentPage = 1;
        $scope.getAllSLDO();
      };
    };

  $scope.onSelect=function ($item, $model, $label){
        $scope.currentPage = 1;
        $scope.getAllSLDO();
    };

    $scope.$watch(function() {
	    return $rootScope.sldo;
	  }, function() {
	    try{
	      $scope.sldo = $rootScope.sldo;
	     }catch(e){
	    //console.log('catch in driverProfileController');
	    }
	  }, true);
  
  
  //$scope.cities = dataServices.loadCities();
  $scope.selectRoute = function(sldo,index){
    var sUrl = "#!/masters/sldoDetails/list";
    $rootScope.redirect(sUrl);
  	$rootScope.sldo = sldo;
  	listItem = $($('.lv-item')[index]);
  	listItem.siblings().removeClass('grn');
    listItem.addClass('grn');

  };
  $scope.newDriverReg = function(){
  	$rootScope.sldo = {};
  	listItem = $($('.lv-item'));
  	listItem.siblings().removeClass('grn');
  };
  $rootScope.formateDate = function(date){
  	return new Date(date);  
  };
});

materialAdmin.controller("sldoProfileCtrl", function($rootScope, $scope) {
    $("p").text("SLDO");
  //$rootScope.wantThis = false;
  $rootScope.wantRegSL = false;
  $scope.$watch(function() {
     return $rootScope.sldo;
    }, function() {
     try{
        $scope.sldo = $rootScope.sldo;
      }catch(e){
     }
   }, true);
});

materialAdmin.controller("registerSLDOController", function($rootScope, $scope, SLDOServices) {
  $("p").text("SLDO");
  $rootScope.wantRegSL = true;
  $scope.sldoReg = {};

  function successPost(response){
    $scope.sldoReg = {};
    if(response && response.data && (response.data.status=="OK") && response.data.data){
      $rootScope.sldos.push(response.data.data);
      $rootScope.sldo = response.data.data;
      $scope.SLDO.$dirty = false;
      swal("SLDO Registered Successfully","","success");
      var sUrl = "#!/masters/sldoDetails/list";
      $rootScope.redirect(sUrl);
    }else if(response && response.data && (response.data.status=="ERROR")){
      swal("SLDO Registration failed",response.data.message,"error");
    }
  }
  function failure(res){
    swal("SLDO Registration Failed","","error");
    console.log("fail: ",res);
  }
  
  $scope.createSLDOerrormsg = false;
  $scope.saveSLDORegDetails = function(form) {
    $scope.SLDOmsg = '';
    if(form.$valid){
      SLDOServices.saveSLDO($scope.sldoReg, successPost,failure);
    } else if(form.$error && form.$error.required){
            for(i=0;i<form.$error.required.length;i++){
              if(form.$error.required[i].$name){
                $scope.SLDOmsg = $scope.SLDOmsg+" "+form.$error.required[i].$name + " ,";
              }
            }
            if($scope.SLDOmsg){
              $scope.SLDOmsg = $scope.SLDOmsg.substring(0, $scope.SLDOmsg.length - 1);
              $scope.SLDOmsg = $scope.SLDOmsg + ' are require.';
              $scope.createSLDOerrormsg = true;
                 setTimeout(function(){ 
              if($scope.createSLDOerrormsg){
                $scope.$apply(function() {
                  $scope.createSLDOerrormsg = false;
                });
              }
            }, 7000);
          }
    } else if((form.$error.minlength && form.$error.minlength.length>0) || (form.$error.maxlength && form.$error.maxlength.length>0)){
         $scope.SLDOmsg = 'Please enter valid mobile number';
             $scope.createSLDOerrormsg = true;
             setTimeout(function(){ 
              if($scope.createSLDOerrormsg){
                $scope.$apply(function() {
                  $scope.createSLDOerrormsg = false;
                });
              }
            }, 7000);
      }
  }
});

materialAdmin.controller("editSLDOController", function($rootScope, $scope, Driver) {
    $rootScope.wantRegSL = false;
    /*$("p").text("Routes");
    $rootScope.wantThis = true;
    $rootScope.wantReg = false;
    $scope.$watch(function() {
          return $rootScope.driver;
         }, function() {
          try{
              $scope.driver = $rootScope.driver;
           }catch(e){
          //console.log('catch in truckIdentificationController');
          }
         }, true);
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

  //************* New Date Picker for multiple date selection in single form ******************
  
  function success(response) {
    if(response && response.data && response.data.driver){
        $rootScope.driver = response.data.driver;
      }
  }

  function failure(response){
      console.error("fail: ",response);
    }

   
  $scope.saveDriverDetails = function() {
    Routes.updateRoute($scope.driver, success,failure);
  }*/
});