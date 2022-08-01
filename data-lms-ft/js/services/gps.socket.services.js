/**
 * Initial version by: Nipun Bhardwaj
 * Initial version created on: 16/08/18
 */

materialAdmin.service('gpsSocketService', ['$localStorage', '$rootScope', 'HTTPConnection', 'socketio', 'URL', function($localStorage, $rootScope, HTTPConnection, socketio, URL) {
	this.getplayData = function(playData, successCallback) {

		HTTPConnection.post(URL.VEHICLE_PLAYBACK, playData, onSuccess);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
	};

	this.getAlertData = function(request, successCallback, failureCallback) {
		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		let gpsId = $localStorage.ft_data.client_config.gpsId;
		request.selected_uid = gpsId;
   		request.login_uid = gpsId;
    	request.user_uid = gpsId;
    	request.sort = {_id: -1};
		HTTPConnection.post(URL.VEHICLE_ALERT, request, onSuccess, onFailure);
		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};


	this.getLandmark = function(request, successCallback, failureCallback) {

		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		HTTPConnection.post(URL.GET_LANDMARK, request, onSuccess, onFailure);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};

	this.addLandmark = function(request, successCallback, failureCallback) {

		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		HTTPConnection.post(URL.ADD_LANDMARK, request, onSuccess, onFailure);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};

	this.updateLandmark = function(request, successCallback, failureCallback) {

		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		HTTPConnection.post(URL.UPDATE_LANDMARK, request, onSuccess, onFailure);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};


	this.removeLandmark = function(request, successCallback, failureCallback) {

		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		HTTPConnection.post(URL.REMOVE_LANDMARK, request, onSuccess, onFailure);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};

	this.downloadLandmark = function(request, successCallback, failureCallback) {

		request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
		HTTPConnection.post(URL.DOWNLOAD_LANDMARK, request, onSuccess, onFailure);

		function onSuccess(data) {
			if(typeof successCallback === 'function')
				successCallback(data.data);
		}
		function onFailure(data) {
			if(typeof failureCallback === 'function')
				failureCallback(data.data);
		}
	};

	this.downloadReport = function(dReportData, response) {
		socketio.emit('message',dReportData);
		$rootScope.tReportCallback = response;
	};
	this.createTrip = function(tripData, response) {
		socketio.emit('message',tripData);
		$rootScope.createdTripCallback = response;
	};
	this.removeTripServ = function(tripData, response) {
		socketio.emit('message',tripData);
		$rootScope.removeTripCallback = response;
	};
	this.updateTrip = function(UpTripData, response) {
		socketio.emit('message',UpTripData);
		$rootScope.UpdateTripCallback = response;
	};
	this.getFeature = function(feature, response) {
		socketio.emit('message',feature);
		$rootScope.featureCallback = response;
	};

}]);

materialAdmin.service('gpsReportService', ['$rootScope', '$localStorage', 'HTTPConnection', 'socketio', 'URL',
	function(
		$rootScope,
		$localStorage,
		HTTPConnection,
		socketio,
		URL
	) {

		let httpOption = {
			headers: {
				'Authorization': $localStorage.user && $localStorage.user.token,
				'Content-Type': 'application/json'
			}
		};

		this.getReport = function(reportData, response) {
			var sReport = reportData;
			socketio.emit('message',sReport);
			$rootScope.reportCallback = response;
		};

		this.createAlerts = function(alertData, response) {
			//var sReport = reportData;
			socketio.emit('message',alertData);
			$rootScope.alertCallback = response;
		};

		this.getAllAlertsList = function(alertListData, response) {
			//var sReport = reportData;
			socketio.emit('message',alertListData);
			$rootScope.alertListCallback = response;
		};

		this.getAllNotifiList = function(notifiListData, response) {
			//var sReport = reportData;
			socketio.emit('message',notifiListData);
			$rootScope.notifiListCallback = response;
		};
		this.getCommand = function(commandData, response) {
			//var sReport = reportData;
			socketio.emit('message',commandData);
			$rootScope.commandCallback = response;
		};

		this.downloadReport = function(request) {
			return new Promise(function (resolve, reject) {

				let url;
				switch (request.reportType){
					case "report_parking": url = URL.HALT_REPORT; break;
					// case "report_halt_summary": url = URL.HALT_REPORT; break;
					case "report_overspeed": url = URL.OVERSPEED_REPORT; break;
					case "report_activity": url = URL.ACTIVITY_REPORT; break;
					case "report_activity_interval": url = URL.DETAILED_ACTIVITY_REPORT; break;
					case "report_mileage2": url = URL.KILOMITER_REPORT; break;
					// case "report_mileage1": url = URL.KILOMITER_REPORT1; break;
					case "idleSummary": url = URL.IDLE_SUMMARY; break;
					case "report_idealing": url = URL.IDLE_REPORT; break;
					case "report_driver_activity": url = URL.DRIVER_ACTIVITY_RPT; break;
					case "report_driver_activity_single": url = URL.DRIVER_ACTIVITY_RPT; break;
					case "details_analysis": url = URL.DETAILED_ANALYSIS_REPORT; break;
				}

				HTTPConnection
					.postOver(url, request, httpOption)
					.then(function (res) {
						resolve(res.data);
					}).catch(function (e) {
						console.log(e);
						swal('Error',e.data.message,'error');
						reject(e);
					});
			});
		};


		this.alertReport = function(request, successCallback, failureCallback) {

			request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
			HTTPConnection.post(URL.ALERT_REPORT, request, onSuccess, onFailure);

			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
		};

		this.vehicleExceptionsRpt = function(request, successCallback, failureCallback) {

			request.authorizationToken = $localStorage.ft_data.client_config.gpsgaadi_token;
			HTTPConnection.post(URL.VEHICLE_EXCEPTION_RPT, request, onSuccess, onFailure);

			function onSuccess(data) {
				if(typeof successCallback === 'function')
					successCallback(data.data);
			}
			function onFailure(data) {
				if(typeof failureCallback === 'function')
					failureCallback(data.data);
			}
		};

		this.remoAlert = function(removeAlertData, response) {
			//var sReport = reportData;
			socketio.emit('message',removeAlertData);
			$rootScope.removeAlertCallback = response;
		};

		this.updateAlert = function(updateAlertData, response) {
			//var sReport = reportData;
			socketio.emit('message',updateAlertData);
			$rootScope.updateAlertCallback = response;
		};

		this.downloadListService = function(listDwnData, response) {
			socketio.emit('message',listDwnData);
			$rootScope.downLoadNotifiCallback = response;
		};

		this.getTripNoService = function(tripNoData, response) {
			socketio.emit('message',tripNoData);
			$rootScope.tripNoCallback = response;
		};
		this.addAlarmSchedule = function(alarmData, response) {
			socketio.emit('message',alarmData);
			$rootScope.alarmSchecduleCallback = response;
		};
		this.getSchAlarm = function(getAlarmData, response) {
			socketio.emit('message',getAlarmData);
			$rootScope.getAlarmSchecduleCallback = response;
		};
		this.upAlarmOnServer = function(upAlarmData, response) {
			socketio.emit('message',upAlarmData);
			$rootScope.upAlarmOnServerCallback = response;
		};
	}
]);
