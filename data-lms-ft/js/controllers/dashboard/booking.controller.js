materialAdmin
	.controller('bookingAnalyticsCtrl', bookingAnalyticsCtrl);

bookingAnalyticsCtrl.$inject = [
	'$timeout',
	'DatePicker',
	'dashboardFactory',
	'dashboardService'
];

function bookingAnalyticsCtrl(
	$timeout,
	DatePicker,
	dashboardFactory,
	dashboardService,
){

	var vm = this;
	vm.aAggregatedBy = [
		'Date Wise',
		'Customer Wise',
		'Route Wise'
	];
	vm.aLevel = [
		'Year',
		'Month',
		'Day'
	];
	vm.api = {};
	vm.DatePicker = DatePicker;
	vm.filter = {};
	vm.filter.aggregateByValue = 'Date Wise';
	vm.filter.levelValue = 'Day';
	vm.isFullscreenActive = dashboardFactory.isFullscreenActive;
	vm.selectedMonth = null;

	vm.getAnalytics = getAnalytics;
	vm.hideFullscreen = dashboardFactory.closeFullscreen;
	vm.init = init;
	vm.showFullscreen = showFullscreen;
	vm.setMaxDate = setMaxDate;

	vm.options = {
		chart: {
			type: 'discreteBarChart',
			margin : {
				left: 75,
				bottom: 150
			},
			x: function(d){
				if(typeof d._id === "object"){
					if(d._id.day){
						return d._id.day+ "-"+d._id.month+"-"+d._id.year;
					}else if(d._id.month){
						return d._id.month+"-"+d._id.year;
					}else if(d._id.year){
						return d._id.year;
					}
				}
				return d._id;
			},
			y: function(d){return d.count;},
			stacked: true,
			showControls: false,
			xAxis: {
				// axisLabel: vm.filter.aggregateByValue,
				rotateLabels: -70,
				tickFormat: function(d){
					return d;
					//  return dashboardFactory.wrapLabels(d);
				}
			},
			// color:function (d, i) {
			// 	return d.color;
			// },
			yAxis: {
				// axisLabel: 'Revenue',
			},
			discretebar: {
				dispatch: {
					elementDblClick: function(e) {
						if(vm.selectedMonth !== null || vm.filter.aggregateByValue !== 'Date Wise')
							return;
						let index = monthNames.indexOf(e.data['DATE']);
						vm.selectedMonth = index !== -1 ? index : null ;
						generateAggregatedByDay();
						$timeout(vm.api.refresh,100)
					},
				}
			},
			tooltip: {
				// contentGenerator: function (e) {
				// 	if(vm.filter.aggregateByValue === 'Date Wise' && vm.filter.levelValue === 'Day'){
				// 		var series = e.series[0];
				// 		if (series.value === null) return;
                //
				// 		var header =
				// 			"<thead>" +
				// 			"<tr>" +
				// 			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
				// 			"<td class='x-value'><strong>" + e.data['CUSTOMER'] + "</strong></td>" +
				// 			"</tr>" +
				// 			"<tr>" +
				// 			"<td class='key'>" + series.key+ "</td>" +
				// 			"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
				// 			"</tr>" +
				// 			"</thead>";
                //
				// 		return "<table>" +
				// 			header +
				// 			"</table>";
				// 	}else{
				// 		var series = e.series[0];
				// 		if (series.value === null) return;
                //
				// 		var header =
				// 			"<thead>" +
				// 			"<tr>" +
				// 			"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
				// 			"<td class='key'>" + series.key+ "</td>" +
				// 			"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
				// 			"</tr>" +
				// 			"</thead>";
                //
				// 		return "<table>" +
				// 			header +
				// 			"</table>";
				// 	}
				// }
			}
		}
	};

	if(!vm.isFullscreenActive)
		vm.options.chart.height = 450;

	// init
	init();

	function init(){
		if(dashboardFactory.applyFilter(vm)){
			vm.filter.from = new Date(new Date().setMonth(new Date().getMonth() - 1));
			vm.filter.to = new Date(new Date().setMonth(vm.filter.from.getMonth() + 1));
		}
		getAnalytics();
	}

	function getAnalytics() {

		let request = prepareFilter();
		dashboardService.getBookingAnalytics(request, successCallback, failureCallback);

		function successCallback(response) {
			console.log(response);
			applyData(response);
		}

		function failureCallback(err) {
			console.log(err, 'remove this log');
			swal('',err.data.message,'error');
		}
	}

	function applyData(aData){
		vm.data = [
			{
				key: "Cumulative Return",
				values: aData
			}
		];
	}

	function prepareFilter() {
		let request = {};

		vm.filter.from = new Date(vm.filter.from.setHours(0,0,0));
		vm.filter.to = new Date(vm.filter.to.setHours(23,59,59));

		request.start_date = vm.filter.from.toISOString();
		request.end_date = vm.filter.to.toISOString();

		switch(vm.filter.aggregateByValue){
			case 'Date Wise' : request.aggregateBy = 'date'; break;
			case 'Customer Wise' : request.aggregateBy = 'customer'; break;
			case 'Route Wise' : request.aggregateBy = 'route'; break;
		}

		switch(vm.filter.levelValue){
			case 'Year' : request.level = 'year'; break;
			case 'Month' : request.level = 'month'; break;
			case 'Week' : request.level = 'week'; break;
			case 'Day' : request.level = 'day'; break;
		}

		return request;
	}

	function setMaxDate() {
		vm.filter.to = null;
		let tempDate =  new Date(vm.filter.from);
		vm.maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 5));
	}

	function showFullscreen() {
		dashboardFactory.openFullscreen({
			url: 'views/dashboard/bookingAnalytics.html',
			controller: 'bookingAnalyticsCtrl'
		}, vm);
	}

}
