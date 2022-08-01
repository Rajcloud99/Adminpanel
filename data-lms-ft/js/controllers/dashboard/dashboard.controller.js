materialAdmin
	.controller('dashboardDetailController', dashboardDetailController)
	.controller('kpiSettingModalController', kpiSettingModalController)
	.controller('summaryController', summaryController)
	.factory('summaryDataFactory', summaryDataFactory)
	.factory('detailDataFactory', detailDataFactory);


dashboardDetailController.$inject = [
	'$timeout',
	'detailDataFactory'
];

summaryController.$inject = [
	'$state',
	'summaryDataFactory'
];

function dashboardDetailController(
	$timeout,
	detailDataFactory
){
	let vm = this;
	vm.sideFilter = filterService(); // init filter on page

	vm.resetGraph = resetGraph;

	//init
	(function init() {
		vm.aData = detailDataFactory();
		vm.selectedGraph = vm.aData[0];
		vm.visibility = true;
		resetGraph();
	})();

	//Actual Function

	function resetGraph() {
		vm.visibility = false;
		$timeout(function () {
			vm.visibility = true;
		});
	}

}

function kpiSettingModalController(
	$uibModalInstance,
	DatePicker,
	graphData
) {
	let vm = this;
	vm.DatePicker = angular.copy(DatePicker);
	vm.graphData = graphData;
	vm.allowSubmit = true;

	console.log(graphData);

	vm.closeModal = closeModal;
	vm.kpiSettingFormSubmit = kpiSettingFormSubmit;

	function closeModal() {
		$uibModalInstance.dismiss();
	}

	function kpiSettingFormSubmit(formData) {
		if(formData.$valid && vm.allowSubmit){
			vm.allowSubmit = false;
			console.log(formData);
			$uibModalInstance.close(vm.graphData);
		}
	}
}

function summaryController(
	$state,
	summaryDataFactory
){
	let vm = this;
	vm.sideFilter = filterService();

	vm.aData = summaryDataFactory();

	vm.onClick = onClick;

	//init
	(function init() {

	})();

	//Actual Function
	function onClick(oGraph) {
		let request;

		switch (oGraph.name){
			case 'Revenue By Month': request = 'Bill Analysis'; break;
			case 'Billed/Unbilled': request = 'Gr Analysis'; break;
			case 'POD\'s': request = 'Gr Analysis'; break;
			case 'Revenue By Customer Wise': request = 'Bill Analysis'; break;
			case 'Vehicle Status': request = 'Vehicle Analysis'; break;
			case 'Receivable': request = 'Bill Analysis'; break;
			default:
				return;
		}

		$state.go('dashboard.detail', request);
	}
}

function summaryDataFactory () {

	let numberFormat = function (e) {
		let temp = e+'';
		switch (temp.length){
			case 4: temp = temp.substr(0,1)+'K'; break;
			case 5: temp = temp.substr(0,2)+'K'; break;
			case 6: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'L'; break;
			case 7: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'L'; break;
			case 8: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'Cr'; break;
			case 9: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'Cr'; break;
		}
		return temp;
	};

	return function () {
		return [{
			name: 'Profit By Month',
			api: 'api/dashboard/profit-analysis',
			apiFilter: {
				aggregateBy: 'date',
				level: 'year',
				to: new Date(new Date().setHours(23,59,59)).toISOString(),
				from: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0,0,0)).toISOString()
			},
			graphType: [{
				type: "bulletChart",
				customeTooltip: function (e) {
					var series = e.series[0];
					if (e.label === 'Previous' || e.label === 'Maximum') return;

					let label = 'unKnown';
					switch (e.label){
						case 'Current': label = 'Profit'; break;
						case 'Mean': label = 'Billing Amount'; break;
					}

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='x-value'><strong>" + label + "</strong></td>" +
						"<td class='x-value'>" + series.value + "</td>" +
						"</tr>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
				xAxisTickFormat: numberFormat,
				graphValue: {
					title: "Profit",
					ranges: '[0].billing_amount',
					measures: '[0].profit'
				}
			}],
			fullscreen: true,
			// setting: {
			// 	api: '',
			// 	param: [
			// 		'name',
			// 		'target',
			// 		'date'
			// 	]
			// }
		},{
			name: 'Revenue By Month',
			api: 'api/dashboard/bill-analysis',
			apiFilter: {
				aggregateBy: 'date',
				level: 'year',
				to: new Date(new Date().setHours(23,59,59)).toISOString(),
				from: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0,0,0)).toISOString(),
				billCancelled: false
			},
			graphType: [{
				type: "bulletChart",
				customeTooltip: function (e) {
					var series = e.series[0];
					if (e.label === 'Previous' || e.label === 'Maximum') return;

					let label = 'unKnown';
					switch (e.label){
						case 'Current': label = 'Achived'; break;
						case 'Mean': label = 'Target'; break;
					}

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='x-value'><strong>" + label + "</strong></td>" +
						"<td class='x-value'>" + series.value + "</td>" +
						"</tr>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
				xAxisTickFormat: numberFormat,
				graphValue: {
					title: "Revenue",
					subtitle: '(₹)',
					ranges: '[0].target',
					measures: '[0].count',
					date: '[0].date'
				}
			}],
			fullscreen: true,
			// setting: {
			// 	api: '',
			// 	param: [
			// 		'name',
			// 		'target',
			// 		'date'
			// 	]
			// }
		},{
			name: 'Billed/Unbilled',
			api: 'api/dashboard/gr-analysis',
			apiFilter: {
				aggregateBy: 'billed_unbilled',
			},
			graphType: [{
				type: "bulletChart",
				customeTooltip: function (e) {
					var series = e.series[0];
					if (e.label === 'Previous' || e.label === 'Maximum') return;

					let label = 'unKnown';
					switch (e.label){
						case 'Current': label = 'Billed'; break;
						case 'Mean': label = 'Unbilled'; break;
					}

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='x-value'><strong>" + label + "</strong></td>" +
						"<td class='x-value'>" + series.value + "</td>" +
						"</tr>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
				graphValue: {
					title: "Billed/Unbilled",
					subtitle: '(Count)',
					ranges: '[0].count',
					measures: '[1].count',
					date: '[0].date'
				}
			},{
				type: "pieChart",
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
			},{
				type: 'table',
				head: [
					'Type',
					'Count'
				],
				body: {
					'Type': '_id',
					'Count': 'count',
				},
				formatResponse: function (response) {
					let arr = angular.copy(response);
					arr.push({
						_id: 'Total Bill',
						count: arr.reduce( (a,b) => a+b.count , 0)
					});
					return arr;
				}
			}],
			formatResponse: function(response){
				return response[0].data;
			},
			fullscreen: true
		},{
			name: 'POD\'s',
			api: 'api/dashboard/gr-analysis',
			apiFilter: {
				aggregateBy: 'pod'
			},
			graphType: [{
				type: "bulletChart",
				customeTooltip: function (e) {
					var series = e.series[0];
					if (e.label === 'Previous' || e.label === 'Maximum') return;

					let label = 'unKnown';
					switch (e.label){
						case 'Current': label = 'Acknowledged GR'; break;
						case 'Mean': label = 'Unacknowledged GR'; break;
					}

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='x-value'><strong>" + label + "</strong></td>" +
						"<td class='x-value'>" + series.value + "</td>" +
						"</tr>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
				graphValue: {
					title: "POD's",
					subtitle: '(Count)',
					ranges: '[1].count',
					measures: '[0].count',
					date: '[0].date'
				}
			},{
				type: "pieChart",
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				}
			},{
				type: 'table',
				head: [
					'Type',
					'Count'
				],
				body: {
					'Type': '_id',
					'Count': 'count',
				}
			}],
			fullscreen: true
		},{
			name: 'Revenue By Customer Wise',
			api: 'api/dashboard/bill-analysis',
			apiFilter: {
				aggregateBy: 'billing_party',
				to: new Date(new Date().setHours(23,59,59)).toISOString(),
				from: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0,0,0)).toISOString()
			},
			graphType: [{
				type: "discreteBarChart",
				xAxisKey: function (e) {
					if(typeof e._id === "object"){
						if(e._id.day){
							return e._id.day+ "-"+e._id.month+"-"+e._id.year;
						}else if(e._id.month){
							return e._id.month+"-"+e._id.year;
						}else if(e._id.year){
							return e._id.year;
						}
					}else
						return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				xAxisLabel: 'Customer',
				yAxisKey: function (e) {
					return e.count;
				},
				yAxisTickFormat: numberFormat,
				yAxisLabel: 'Revenue',
				customeTooltip: function (e) {
					let series = e.series[0];
					if (series.value === null) return;

					let data;

					if(typeof e.data._id === "object"){
						if(e.data._id.day){
							data = e.data._id.day+ "-"+e.data._id.month+"-"+e.data._id.year;
						}else if(e.data._id.month){
							data = e.data._id.month+"-"+e.data._id.year;
						}else if(e.data._id.year){
							data = e.data._id.year;
						}
					}else
						data = e.data._id;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + data + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				}
			},{
				type: 'table',
				head: [
					'Customer Name',
					'Revenue'
				],
				body: {
					'Customer Name': '_id',
					'Revenue': 'count',
				}
			}],
			fullscreen: true
		},{
			name: 'Vehicle Status',
			api: 'api/dashboard/vehicle-analysis',
			apiFilter: {
				aggregateBy: 'status'
			},
			graphType: [{
				type: "pieChart",
				donut: true,
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				}
			},{
				type: 'table',
				head: [
					'Status',
					'No of Vehicle'
				],
				body: {
					'Status': '_id',
					'No of Vehicle': 'count',
				}
			}],
			fullscreen: true
		},{
			name: 'Receivable',
			api: 'api/dashboard/bill-analysis',
			apiFilter: {
				aggregateBy: 'receivables'
			},
			graphType: [{
				type: "pieChart",
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"<td class='x-value'>" + d3.formsummary.aDataat(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
				formatResponse: function (response){
					return [{
						_id: "Amount Received",
						count: response[0].count
					},{
						_id: "Receivable",
						count: response[1].count - response[0].count
					}];
				}
			},{
				type: 'table',
				head: [
					'Receivable',
					'Amount'
				],
				body: {
					'Receivable': '_id',
					'Amount': 'count',
				},
				formatResponse: function (response) {
					let arr = angular.copy(response);
					arr.push({
						_id: 'Receivable Amount',
						count: arr[1].count - arr[0].count
					});
					return arr;
				}
			}],
			formatResponse: function(response){
				return response[0].data;
			},
			fullscreen: true
		}]
	};
}

function detailDataFactory() {

	let numberFormat = function (e) {
		let temp = e+'';
		switch (temp.length){
			case 4: temp = temp.substr(0,1)+'K'; break;
			case 5: temp = temp.substr(0,2)+'K'; break;
			case 6: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'L'; break;
			case 7: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'L'; break;
			case 8: temp = temp.substr(0,1) + (Number(temp.substr(1,2)) > 10 ? '.'+temp.substr(1,2) : '') +'Cr'; break;
			case 9: temp = temp.substr(0,2) + (Number(temp.substr(2,2)) > 10 ? '.'+temp.substr(2,2) : '') +'Cr'; break;
		}
		return temp;
	};

	return function () {
		return [{
			name: 'Bill Analysis',
			api: 'api/dashboard/bill-analysis',
			apiFilter: {
				aggregateBy: 'billing_party',
				to: new Date(new Date().setHours(23,59,59)).toISOString(),
				from: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0,0,0)).toISOString()
			},
			graphType: [{
				type: "discreteBarChart",
				xAxisKey: function (e) {
					if(typeof e._id === "object"){
						if(e._id.day){
							return e._id.day+ "-"+e._id.month+"-"+e._id.year;
						}else if(e._id.month){
							return e._id.month+"-"+e._id.year;
						}else if(e._id.year){
							return e._id.year;
						}
					}else
						return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				xAxisLabel: 'Customer',
				yAxisKey: function (e) {
					return e.count;
				},
				yAxisTickFormat: numberFormat,
				yAxisLabel: 'Revenue',
				customeTooltip: function (e) {
					let series = e.series[0];
					if (series.value === null) return;

					let data;

					if(typeof e.data._id === "object"){
						if(e.data._id.day){
							data = e.data._id.day+ "-"+e.data._id.month+"-"+e.data._id.year;
						}else if(e.data._id.month){
							data = e.data._id.month+"-"+e.data._id.year;
						}else if(e.data._id.year){
							data = e.data._id.year;
						}
					}else
						data = e.data._id;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + data + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				}
			},{
				type: 'table',
				head: [
					'Customer Name',
					'Revenue'
				],
				body: {
					'Customer Name': '_id',
					'Revenue': 'count',
				}
			}],
			fullscreen: true,
			filter:{
				aAggregatedBy: [{
					name:'Date Wise',
					value:'date'
				},{
					name:'Billing Party Wise',
					value:'billing_party'
				},{
					name:'Vendor Wise',
					value:'vendor'
				},{
					name:'Ownership Type Wise',
					value:'ownership_type'
				}],
				aLevel: [{
					name: 'Year',
					value: 'year'
				},{
					name: 'Month',
					value: 'month'
				},{
					name: 'Day',
					value: 'day'
				}]
			}
		},{
			name: 'Gr Analysis',
			api: 'api/dashboard/gr-analysis',
			apiFilter: {
				aggregateBy: 'billed_unbilled',
			},
			graphType: [{
				type: "pieChart",
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				},
			},{
				type: 'table',
				head: [
					'Type',
					'Count'
				],
				body: {
					'Type': '_id',
					'Count': 'count',
				},
				formatResponse: function (response) {
					let arr = angular.copy(response);
					arr.push({
						_id: 'Total Bill',
						count: arr.reduce( (a,b) => a+b.count , 0)
					});
					return arr;
				}
			}],
			formatResponse: function(response){
				return response[0].data;
			},
			fullscreen: true,
			filter:{
				aAggregatedBy: [{
					name:'Date Wise',
					value:'Date Wise',
				},{
					name:'Customer Wise',
					value:'Customer Wise',
				},{
					name:'Billed/Unbilled Wise',
					value:'billed_unbilled',
				},{
					name:'Status Wise',
					value:'Status Wise',
				}],
				aLevel: [{
					name: 'Year',
					value: 'year'
				},{
					name: 'Month',
					value: 'month'
				},{
					name: 'Day',
					value: 'day'
				}]
			}
		},{
			name: 'Vehicle Analysis',
			api: 'api/dashboard/vehicle-analysis',
			apiFilter: {
				aggregateBy: 'status'
			},
			graphType: [{
				type: "pieChart",
				donut: true,
				xAxisKey: function (e) {
					return e._id.length > 16 ? e._id.substr(0,16)+'...' : e._id;
				},
				yAxisKey: function (e) {
					return e.count;
				},
				customeTooltip: function (e) {
					var series = e.series[0];
					if (series.value === null) return;

					var header =
						"<thead>" +
						"<tr>" +
						"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
						"<td class='key'><strong>" + e.data._id + "</strong></td>" +
						"<td class='x-value'>" + d3.format(",.1f")(e.data.count) + "</td>" +
						"</thead>";

					return "<table>" +
						header +
						"</table>";
				}
			},{
				type: 'table',
				head: [
					'Status',
					'No of Vehicle'
				],
				body: {
					'Status': '_id',
					'No of Vehicle': 'count',
				}
			}],
			fullscreen: true
		}]
	};
}
