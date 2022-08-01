materialAdmin.controller("gpsDeviceSlipsController",
	function($rootScope, $state, $scope,DateUtils,$uibModal, GPSService, ReportService, Pagination) {

		$scope.selectThisRow = function (slip, index) {
			$scope.selectedSlip = slip;
			$($('.slipTable tbody tr')).removeClass('grn');
			var row = $($('.slipTable tbody tr')[index]);
			row.addClass('grn');
		};

		$scope.getSlips = function() {
			GPSService.getDeviceSlips({}, function (res) {
				$scope.deviceSlips = res.data;
			}, function (err) {
			});
		};
		$scope.getSlips();

		$scope.previewSlip = function () {
			GPSService.previewSlip({ _id: $scope.selectedSlip._id }, function (res) {
				var modalInstance = $uibModal.open({
					template: res,
					controller: 'previewSlipController'
				});
				modalInstance.result.then(function (msg) { }, function () { });
			}, function (err) { });
		};

	});

materialAdmin.controller("previewSlipController", function ($scope, $uibModalInstance, salesOrderService) {

	$scope.printDiv = function(elem) {
		var contents = document.getElementById(elem).innerHTML;
		var frame1 = document.createElement('iframe');
		frame1.name = "frame1";
		frame1.style.position = "absolute";
		frame1.style.top = "-1000000px";
		document.body.appendChild(frame1);
		var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
		frameDoc.document.open();
		frameDoc.document.write(`
            <html>
                <head>
                    <title>Umbrella Protection Systems Pvt. Ltd.</title>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                </head>
                <body>
                ${contents}
                </body>
            </html>
            `);
		frameDoc.document.close();
		setTimeout(function () {
			window.frames["frame1"].focus();
			window.frames["frame1"].print();
			document.body.removeChild(frame1);
		}, 500);
	};

	$scope.closeModal = function (msg) {
		$uibModalInstance.close(msg || 'NO_RELOAD');
	};

});
