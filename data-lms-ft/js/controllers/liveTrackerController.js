materialAdmin.controller("liveTrackerController", function ($state,tripServices,$scope, liveTrackService, lazyLoadFactory, Pagination,$timeout, DatePicker,$rootScope) {

  $scope.DatePicker = angular.copy(DatePicker);
  $scope.lazyLoad = lazyLoadFactory();

  $scope.columnSetting = {
    allowedColumn: [
      	'Trip No.',
		'Vehicle No.',
		'Route Name',
		'Route Distance',
		'Distance Travelled (KM)',
		'Distance Remaining (KM)',
		'Loading Ended Date',
		'Estimated Arrival',
		'Current ETA',
		'Status',
		'Last Known Address',
		'Last Known Date & time',
    ]
  };

  $scope.tableHead = [
    {
      'header' :'Trip No.',
      'bindingKeys': 'trip_no',
    },
    {
      'header' :'Vehicle No.',
      'bindingKeys': 'vehicle.vehicle_reg_no',
    },
    {
      'header' :'Route Name',
      'bindingKeys': 'route.name',
    },
    {
      'header' :'Route Distance',
      'bindingKeys': 'route.route_distance',
    },
	  {
		  'header' :'Distance Travelled (KM)',
		  'filter': {
			  'name': 'toString',
			  'aParam': [
				  'distance_travelled'
			  ]
		  }
	  },
	  {
		  'header' :'Distance Remaining (KM)',
		  'filter':{
		  	'name':'subtract',
			  'aParam': [
				  'route.route_distance',
				  'distance_travelled'
			  ]
		  }
	  },
	  {
      'header' :'Loading Ended Date',
      'bindingKeys': 'gr.loading_ended_status.date',
    },
    {
      'header' :'Status',
      'bindingKeys': 't_status',
    },
    {
      'header' :'Trip Distance',
      'filter': {
        'name': 'date',
        'aParam': [
          'gpsData.datetime',
          'dd-MMM-yyyy \'at\' h:mma'
        ]
      }
    },
    {
      'header' :'Last Known Address',
      'bindingKeys': 'vehicle.gpsData.address',
    },
    {
      'header' :'Last Known Date & time',
      'filter': {
        'name': 'date',
        'aParam': [
          'vehicle.gpsData.datetime',
          'dd-MMM-yyyy \'at\' h:mma'
        ]
      }
    },
    {
      'header' :'Estimated Arrival',
      'bindingKeys': 'expected_eta',
    },
    {
      'header' :'Current ETA',
      'bindingKeys': 'current_eta'
    }
  ];

  $scope.orderBy = {"trip_no":1};

  $scope.pagination = Pagination;

  $scope.filterObj = {};

  function prepareFilterObject(){
    var myFilter = {};
    for(key in $scope.filterObj) {
      if($scope.filterObj.hasOwnProperty(key)) {
        myFilter[key] = $scope.filterObj[key];
      }
    }
    myFilter.skip = $scope.lazyLoad.getCurrentPage();
    myFilter.no_of_docs = 20;
    myFilter.sort = JSON.stringify($scope.orderBy);
    return myFilter;
  }

  ($scope.liveTrip = function(isGetActive){
    function success(data) {
		$scope.lazyLoad.putArrInScope.call($scope, isGetActive, data);
    }

    function failure(data) {
      console.log(data);
    }

	if(!$scope.lazyLoad.update(isGetActive))
	  return;

    var oFilter = prepareFilterObject();
    liveTrackService.getTrack(oFilter, success, failure);

  })(true);

  $scope.onVehicleSelect = function () {
    $scope.sT = null;
    tripServices.getAllTripsWithPagination({_id: $scope.selectedVehicle.trip._id}, function(res) {
      if (res.data.data && res.data.data.data) {
        if (res.data.data.data.length > 0) {
          for (var i = 0; i < res.data.data.data.length; i++) {
            res.data.data.data[i].containers = [];
            if (res.data.data.data[i].gr && res.data.data.data[i].gr.length > 0) {
              for (var x = 0; x < res.data.data.data[i].gr.length; x++) {
                if (res.data.data.data[i].gr[x].booking_info && res.data.data.data[i].gr[x].booking_info.length > 0) {
                  for (var m = 0; m < res.data.data.data[i].gr[x].booking_info.length; m++) {
                    res.data.data.data[i].containers.push(res.data.data.data[i].gr[x].booking_info[m].container_no);
                  }
                }
              }
            }
          }
        }
        $rootScope.selectedTrip = res.data.data.data[0];
        $scope.sT = res.data.data.data[0];
      }
    });
  };

  $scope.redirectForDetailPage = function () {
    $state.go('booking_manage.updatemyTrips');
  };

});


materialAdmin.service('liveTrackService',
  [	'HTTPConnection',
    'URL',
    function(
      HTTPConnection,
      URL
    ){

      // functions Identifiers
      this.getTrack = getTrack;

      // Actual Functions

      function getTrack(request, successCallback, failureCallback) {

        var urlWithParams = URL.LIVE_TRACKER +'?'+ prepareParameters(request);

        HTTPConnection.get(urlWithParams, onSuccess, onFailure);

        function onFailure(data) {
          if(typeof failureCallback === 'function')
            failureCallback(data.data);
        }
        function onSuccess(data) {
          if(typeof successCallback === 'function')
            successCallback(data.data);
        }
      }

      function prepareParameters(oFilter) {
        var sParam = "";

        for (var property in oFilter) {
          sParam = sParam + "&" + property + "=" + oFilter[property];
        }
        return sParam;
      }
    }
  ]
);
