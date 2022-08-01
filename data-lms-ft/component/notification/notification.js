materialAdmin
	.directive('notifBell', notifBell)

notifBell.$inject = [
	"$interval",
	"$localStorage",
	"$rootScope",
	'$timeout',
	"ReportService"
];

function notifBell(
	$interval,
	$localStorage,
	$rootScope,
	$timeout,
	ReportService
){

	return {
		restrict: 'A',
		templateUrl: 'component/notification/notification.html',
		link: function(scope, element, attrs, vm) {
			$(element).hide();
			if($localStorage.ft_data && $localStorage.ft_data.access_control) { //$scope.$role['Logs']['Notification']
				if($localStorage.ft_data.access_control['Logs'] && $localStorage.ft_data.access_control['Logs']['Notification']) {
					$(element).show();
					loadNotification();
					// $interval(function() {
						// loadNotification();
					// }, 1000 * 60 * 10);
				}
			}
		}
	};

	function loadNotification() {
		function succNotif(response) {
			//console.log(data);
			if (response.data) {
				if(response.data.data && response.data.data.length){
					let aNotifData = [];
					for (let deltaData of response.data.data) {
						aNotifData.push({
							"time": new Date(deltaData.time),
							"uif": deltaData.uif,
							"_id": deltaData._id,
							"refTo": deltaData.refTo,
							"dwnldLnk": deltaData.dwnldLnk,
							"category": deltaData.category,
							"delta": JSON.parse(deltaData.delta),
							"action": deltaData.action,
						});
					}

					$rootScope.notifShow = aNotifData;
					$rootScope.aSelectedLogs = aNotifData
				}
			}
		}

		function failNotif(response) {
			console.log(response);
		}
		ReportService.getNotification({"category":"Notification"}, succNotif, failNotif);

	}
}
