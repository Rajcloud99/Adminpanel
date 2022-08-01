materialAdmin.controller('summaryController', summaryController);
materialAdmin.controller('data1', data1);
materialAdmin.controller('data2', data2);
materialAdmin.controller('BookingAnalysisCtrl', BookingAnalysisCtrl);

summaryController.$inject = ['DatePicker'];
data1.$inject = ['$timeout','DatePicker'];
data2.$inject = ['$timeout', 'DatePicker'];
BookingAnalysisCtrl.$inject = ['$timeout', 'DatePicker'];

function summaryController(DatePicker) {
	// var vm = this;
	// vm.DatePicker = DatePicker;
	// // var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //
	// // var realData = [{
	// // 	date: new Date('1-1-2018'),
	// // 	revenueExpected: 3,
	// // 	revenueGenerated: 2
	// // },{
	// // 	date: new Date('2-1-2018'),
	// // 	revenueExpected: 5,
	// // 	revenueGenerated: 2
	// // },{
	// // 	date: new Date('3-1-2018'),
	// // 	revenueExpected: 7,
	// // 	revenueGenerated: 5
	// // },{
	// // 	date: new Date('4-1-2018'),
	// // 	revenueExpected: 7,
	// // 	revenueGenerated: 6
	// // },{
	// // 	date: new Date('5-1-2018'),
	// // 	revenueExpected: 8,
	// // 	revenueGenerated: 5
	// // }];
    //
	// vm.aAggregatedBy = [
	// 	'Date Wise',
	// 	'Customer Wise',
	// 	'Vehicle Type Wise',
	// 	'Vehicle Owner Wise'
	// ];
    //
	// // vm.aggregateByValue = 'Date Wise';
    //
	// vm.aCustomer = [
	// 	'customer 1',
	// 	'customer 2',
	// 	'customer 3',
	// 	'customer 4',
	// 	'customer 5',
	// ];
    //
	// vm.aLevel = [
	// 	'Year',
	// 	'Month',
	// 	'Week',
	// 	'Day'
	// ];
    //
	// vm.options = {
	// 	chart: {
	// 		type: 'discreteBarChart',
	// 		height: 450,
	// 		scale: 10,
	// 		x: function(d){return d[vm.xAxisDropdownValue];},
	// 		y: function(d){return d[vm.yAxisDropdownValue];},
	// 		stacked: true,
	// 		showControls: false,
	// 		xAxis: {
	// 			// axisLabel: vm.aggregateByValue,
	// 			// tickFormat: function(d) {
	// 			// 	console.log(d);
	// 			// },
	// 			// axisLabelDistance: 5
	// 		},
	// 		yAxis: {
	// 			// axisLabel: 'Revenue',
	// 			// axisLabelDistance: -10
	// 		},
	// 		discretebar: {
	// 			dispatch: {
	// 				elementDblClick: function(e) { console.log("! element Click !", e)},
	// 			}
	// 		},
	// 		tooltip: {
	// 			// contentGenerator: function (e) {
	// 			// 	var series = e.series[0];
	// 			// 	if (series.value === null) return;
     //            //
	// 			// 	var rows =
	// 			// 		"<tr>" +
	// 			// 		"<td class='key'>" + series.key + "</td>" +
	// 			// 		"<td class='x-value'><strong>" + series.value + "</strong></td>" +
	// 			// 		"</tr>" +
	// 			// 		"<tr>" +
	// 			// 		"<td class='key'>" + 'Revenue Expected: ' + "</td>" +
	// 			// 		"<td class='x-value'><strong>" + e.data[2] + "</strong></td>" +
	// 			// 		"</tr>";
     //            //
	// 			// 	var header =
	// 			// 		"<thead>" +
	// 			// 		"<tr>" +
	// 			// 		"<td class='key'><strong>" + e.value + "</strong></td>" +
	// 			// 		"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
	// 			// 		"</tr>" +
	// 			// 		"</thead>";
     //            //
	// 			// 	return "<table>" +
	// 			// 		header +
	// 			// 		"<tbody>" +
	// 			// 		rows +
	// 			// 		"</tbody>" +
	// 			// 		"</table>";
	// 			// }
	// 		}
	// 	}
	// };
    //
	// vm.api = {};
    //
	// // Genrate graph data from realdata
    //
	// // vm.data = [
	// // 	{
	// // 		'key' : 'Revenue Generated',
	// // 		"values": []
	// // 	},
	// // 	{
	// // 		'key' : 'Revenue Remain',
	// // 		"values": []
	// // 	}
	// // ];
    //
	// // realData.map(obj => {
	// // 	var remain = [],
	// // 		expected = [];
    // //
	// // 	remain.push(monthNames[obj.date.getMonth()]);
	// // 	remain.push(obj.revenueGenerated);
	// // 	remain.push(obj.revenueExpected);
    // //
	// // 	expected.push(monthNames[obj.date.getMonth()]);
	// // 	expected.push(obj.revenueExpected - obj.revenueGenerated);
	// // 	expected.push(obj.revenueExpected);
    // //
	// // 	vm.data[0].values.push(remain);
	// // 	vm.data[1].values.push(expected);
	// // });
    // //
	// // console.log(vm.data);
    //
	// vm.data = [
	// 	{
	// 		key: "Cumulative Return",
	// 		values: [
	// 			{
	// 				"label1" : "A" ,
	// 				"label2" : "January" ,
	// 				"value1" : 1,
	// 				"value2" : 50,
	// 				"value3" : 100
	// 			} ,
	// 			{
	// 				"label1" : "B" ,
	// 				"label2" : "February",
	// 				"value1" : 2,
	// 				"value2" : 45,
	// 				"value3" : 500
	// 			} ,
	// 			{
	// 				"label1" : "C" ,
	// 				"label2" : "March",
	// 				"value1" : 3,
	// 				"value2" : 30,
	// 				"value3" : 1200
	// 			} ,
	// 			{
	// 				"label1" : "D" ,
	// 				"label2" : "April",
	// 				"value1" : 4,
	// 				"value2" : 15,
	// 				"value3" : 200
	// 			} ,
	// 			{
	// 				"label1" : "E" ,
	// 				"label2" : "May",
	// 				"value1" : 5,
	// 				"value2" : 5,
	// 				"value3" : 800
	// 			} ,
	// 			{
	// 				"label1" : "F" ,
	// 				"label2" : "June",
	// 				"value1" : 4,
	// 				"value2" : 0,
	// 				"value3" : 1000
	// 			}
	// 		]
	// 	}
	// ];
    //
	// let dropdownObj = vm.data[0].values[0];
    //
	// vm.xAxisDropdown=[];
	// vm.xAxisDropdownValue = 'label2';
	// vm.yAxisDropdown=[];
	// vm.yAxisDropdownValue = 'value1';
    // //
	// // for(let i in dropdownObj){
	// // 	vm.xAxisDropdown.push(i);
	// // 	if(typeof dropdownObj[i] === 'number')
	// // 		vm.yAxisDropdown.push(i);
	// // }

}

function data1($timeout, DatePicker) {
	var vm = this;
	vm.DatePicker = DatePicker;
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	vm.aggregateByValue = 'Date Wise';
	vm.levelValue = 'Month';

	// var realData = [{
	// 	date: new Date('1-1-2018'),
	// 	revenueExpected: 3,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('2-1-2018'),
	// 	revenueExpected: 5,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('3-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 5
	// },{
	// 	date: new Date('4-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 6
	// },{
	// 	date: new Date('5-1-2018'),
	// 	revenueExpected: 8,
	// 	revenueGenerated: 5
	// }];

	vm.aAggregatedBy = [
		'Date Wise',
		'Customer Wise',
		'Vendor Wise',
		'Vehicle Owner Wise'
	];

	vm.aLevel = [
		'Month',
		'Day'
	];

	vm.selectedMonth = null;

	vm.applyFilter = applyFilter;
	vm.setMaxDate = setMaxDate;

	vm.options = {
		chart: {
			type: 'discreteBarChart',
			height: 520,
			scale: 10,
			x: function(d){return d['DATE'];},
			y: function(d){return d['REVENUE'];},
			stacked: true,
			showControls: false,
			xAxis: {
				// axisLabel: vm.aggregateByValue,
				// tickFormat: function(d) {
				// 	console.log(d);
				// },
				// axisLabelDistance: 5
				rotateLabels: -70

			},
			yAxis: {
				// axisLabel: 'Revenue',
				// axisLabelDistance: -10
			},
			discretebar: {
				dispatch: {
					elementDblClick: function(e) {
						if(vm.selectedMonth !== null || vm.aggregateByValue !== 'Date Wise')
							return;
						let index = monthNames.indexOf(e.data['DATE']);
						vm.selectedMonth = index !== -1 ? index : null ;
						generateAggregatedByDay();
						$timeout(vm.api.refresh(),100)
					},
				}
			},
			tooltip: {
				contentGenerator: function (e) {
					if(vm.aggregateByValue === 'Date Wise' && vm.levelValue === 'Day'){
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='x-value'><strong>" + e.data['CUSTOMER'] + "</strong></td>" +
							"</tr>" +
							"<tr>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}else{
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}
				}
			}
		}
	};

	vm.api = {};

	// Genrate graph data from realdata

	// vm.data = [
	// 	{
	// 		'key' : 'Revenue Generated',
	// 		"values": []
	// 	},
	// 	{
	// 		'key' : 'Revenue Remain',
	// 		"values": []
	// 	}
	// ];

	// realData.map(obj => {
	// 	var remain = [],
	// 		expected = [];
	//
	// 	remain.push(monthNames[obj.date.getMonth()]);
	// 	remain.push(obj.revenueGenerated);
	// 	remain.push(obj.revenueExpected);
	//
	// 	expected.push(monthNames[obj.date.getMonth()]);
	// 	expected.push(obj.revenueExpected - obj.revenueGenerated);
	// 	expected.push(obj.revenueExpected);
	//
	// 	vm.data[0].values.push(remain);
	// 	vm.data[1].values.push(expected);
	// });
	//
	// console.log(vm.data);

	var aActualData = [
		{
			"DATE": "02-13-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 60630,
			"EXPENSE": 1066,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 34166,
			"EXPENSE": 36138,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 32797,
			"EXPENSE": 17913,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "05-21-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 39047,
			"EXPENSE": 1373,
			"VENDOR": "abcd",
			"POD AGING": ""
		},
		{
			"DATE": "05-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 42591,
			"EXPENSE": 19366,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": ""
		},
		{
			"DATE": "02-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 63330,
			"EXPENSE": 37332,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 17227,
			"EXPENSE": 7918,
			"VENDOR": "BMRC TPT",
			"POD AGING": ""
		},
		{
			"DATE": "06-26-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 80297,
			"EXPENSE": 33640,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 38076,
			"EXPENSE": 22683,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 72394,
			"EXPENSE": 23878,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 16746,
			"EXPENSE": 38976,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "01-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 42056,
			"EXPENSE": 24495,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 57503,
			"EXPENSE": 37724,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 12460,
			"EXPENSE": 40745,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": ""
		},
		{
			"DATE": "06-20-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 85272,
			"EXPENSE": 42949,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42781,
			"EXPENSE": 2228,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 72480,
			"EXPENSE": 3693,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 6
		},
		{
			"DATE": "06-12-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 88509,
			"EXPENSE": 28175,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "06-13-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73895,
			"EXPENSE": 5845,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11738,
			"EXPENSE": 31206,
			"VENDOR": "BMRC TPT",
			"POD AGING": 7
		},
		{
			"DATE": "04-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 35174,
			"EXPENSE": 43279,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-30-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 95892,
			"EXPENSE": 10112,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-28-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 72240,
			"EXPENSE": 12836,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 12474,
			"EXPENSE": 10777,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 11444,
			"EXPENSE": 23402,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80871,
			"EXPENSE": 34010,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 54545,
			"EXPENSE": 48272,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 13
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72217,
			"EXPENSE": 48346,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "06-10-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 79193,
			"EXPENSE": 28093,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 15411,
			"EXPENSE": 23025,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62109,
			"EXPENSE": 26599,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 45685,
			"EXPENSE": 21480,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 15
		},
		{
			"DATE": "04-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41787,
			"EXPENSE": 9833,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 63183,
			"EXPENSE": 1567,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 12882,
			"EXPENSE": 11526,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 18
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 42174,
			"EXPENSE": 25237,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 50516,
			"EXPENSE": 6849,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 18
		},
		{
			"DATE": "06-16-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 43918,
			"EXPENSE": 31910,
			"VENDOR": "BMRC TPT",
			"POD AGING": 25
		},
		{
			"DATE": "06-25-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 13121,
			"EXPENSE": 28934,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 67299,
			"EXPENSE": 29494,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 25
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 82345,
			"EXPENSE": 13321,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-06-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 49776,
			"EXPENSE": 49863,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46071,
			"EXPENSE": 48160,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 6
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 94986,
			"EXPENSE": 23281,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 28
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 36633,
			"EXPENSE": 32118,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 28
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 61000,
			"EXPENSE": 6511,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 71221,
			"EXPENSE": 15307,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "02-03-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 30215,
			"EXPENSE": 5091,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 30
		},
		{
			"DATE": "05-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 13832,
			"EXPENSE": 42307,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 30
		},
		{
			"DATE": "03-11-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36426,
			"EXPENSE": 38141,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 86823,
			"EXPENSE": 11382,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "01-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 56324,
			"EXPENSE": 19275,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "02-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 50535,
			"EXPENSE": 30761,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67949,
			"EXPENSE": 42135,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-01-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 33743,
			"EXPENSE": 21144,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-26-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76704,
			"EXPENSE": 14757,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 44130,
			"EXPENSE": 48581,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 91421,
			"EXPENSE": 9908,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 34757,
			"EXPENSE": 32185,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 32
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 50376,
			"EXPENSE": 14804,
			"VENDOR": "New",
			"POD AGING": 32
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 18116,
			"EXPENSE": 38886,
			"VENDOR": "BMRC TPT",
			"POD AGING": 32
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 51356,
			"EXPENSE": 34459,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 15374,
			"EXPENSE": 2900,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 57190,
			"EXPENSE": 24280,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 21679,
			"EXPENSE": 37411,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "01-29-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89163,
			"EXPENSE": 15331,
			"VENDOR": "New",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85512,
			"EXPENSE": 24782,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 39655,
			"EXPENSE": 46039,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 45
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 70881,
			"EXPENSE": 17640,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "03-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 70830,
			"EXPENSE": 32358,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 52
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 97159,
			"EXPENSE": 18630,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 72347,
			"EXPENSE": 38326,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "06-11-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 71507,
			"EXPENSE": 33584,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 68035,
			"EXPENSE": 1039,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "03-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 69120,
			"EXPENSE": 23485,
			"VENDOR": "BMRC TPT",
			"POD AGING": 55
		},
		{
			"DATE": "03-26-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19057,
			"EXPENSE": 47734,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "02-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 80342,
			"EXPENSE": 21084,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 64289,
			"EXPENSE": 10735,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-05-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73318,
			"EXPENSE": 40898,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 60
		},
		{
			"DATE": "04-17-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 79632,
			"EXPENSE": 36753,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "03-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41776,
			"EXPENSE": 41833,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 83465,
			"EXPENSE": 4227,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-26-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85276,
			"EXPENSE": 29505,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55860,
			"EXPENSE": 35848,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 56902,
			"EXPENSE": 9185,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52044,
			"EXPENSE": 38729,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 91288,
			"EXPENSE": 23872,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "05-20-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 56420,
			"EXPENSE": 39869,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89331,
			"EXPENSE": 11432,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "02-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 93611,
			"EXPENSE": 9654,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 39464,
			"EXPENSE": 11245,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 4
		},
		{
			"DATE": "06-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 46013,
			"EXPENSE": 38726,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 72778,
			"EXPENSE": 48377,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 22780,
			"EXPENSE": 14227,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46363,
			"EXPENSE": 6512,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 42534,
			"EXPENSE": 5606,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 5
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80225,
			"EXPENSE": 39600,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74634,
			"EXPENSE": 2527,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 22554,
			"EXPENSE": 35236,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 23176,
			"EXPENSE": 7340,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 66369,
			"EXPENSE": 41337,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82432,
			"EXPENSE": 2312,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 45524,
			"EXPENSE": 26788,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 34593,
			"EXPENSE": 23766,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-20-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 83633,
			"EXPENSE": 25344,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 11
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 28457,
			"EXPENSE": 7817,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67795,
			"EXPENSE": 4467,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 66845,
			"EXPENSE": 13703,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 11
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36965,
			"EXPENSE": 38920,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 71729,
			"EXPENSE": 32194,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-22-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 79838,
			"EXPENSE": 30684,
			"VENDOR": "BMRC TPT",
			"POD AGING": 14
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89588,
			"EXPENSE": 47705,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 70190,
			"EXPENSE": 32167,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "04-10-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 27945,
			"EXPENSE": 16191,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 21236,
			"EXPENSE": 10225,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 34848,
			"EXPENSE": 6526,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 67606,
			"EXPENSE": 30348,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73661,
			"EXPENSE": 4878,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 65454,
			"EXPENSE": 27286,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52961,
			"EXPENSE": 43502,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 83065,
			"EXPENSE": 35684,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 35184,
			"EXPENSE": 30904,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 19331,
			"EXPENSE": 28997,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 67601,
			"EXPENSE": 39737,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 25
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 74893,
			"EXPENSE": 42831,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 28248,
			"EXPENSE": 26608,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 7
		},
		{
			"DATE": "02-20-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 66768,
			"EXPENSE": 19096,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 74416,
			"EXPENSE": 27273,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-23-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 15902,
			"EXPENSE": 49359,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21631,
			"EXPENSE": 38194,
			"VENDOR": "New",
			"POD AGING": 90
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 98671,
			"EXPENSE": 25645,
			"VENDOR": "New",
			"POD AGING": 85
		},
		{
			"DATE": "04-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 20340,
			"EXPENSE": 10087,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 16
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 98364,
			"EXPENSE": 40147,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 16
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 78365,
			"EXPENSE": 12926,
			"VENDOR": "BMRC TPT",
			"POD AGING": 16
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 56084,
			"EXPENSE": 46434,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38422,
			"EXPENSE": 13937,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 23654,
			"EXPENSE": 28631,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 10889,
			"EXPENSE": 15653,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-19-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 75345,
			"EXPENSE": 18944,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 80458,
			"EXPENSE": 18870,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-24-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 80324,
			"EXPENSE": 38820,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62413,
			"EXPENSE": 12663,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41247,
			"EXPENSE": 46837,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 17672,
			"EXPENSE": 32533,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "01-10-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76931,
			"EXPENSE": 1663,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "03-15-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 51899,
			"EXPENSE": 43454,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 87234,
			"EXPENSE": 42853,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85514,
			"EXPENSE": 29705,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-31-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72124,
			"EXPENSE": 22595,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 40088,
			"EXPENSE": 42286,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38866,
			"EXPENSE": 15725,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-09-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74930,
			"EXPENSE": 13862,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 57633,
			"EXPENSE": 12262,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "05-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 42205,
			"EXPENSE": 44824,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21879,
			"EXPENSE": 29575,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-26-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 23580,
			"EXPENSE": 4388,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 37818,
			"EXPENSE": 19542,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-03-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 53429,
			"EXPENSE": 35426,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 26646,
			"EXPENSE": 13511,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 53065,
			"EXPENSE": 42785,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-30-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 40061,
			"EXPENSE": 20380,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 11
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 73580,
			"EXPENSE": 24135,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 11
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 11758,
			"EXPENSE": 29908,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 65235,
			"EXPENSE": 44059,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 21
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62136,
			"EXPENSE": 16147,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 82707,
			"EXPENSE": 3011,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 21
		},
		{
			"DATE": "04-29-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42430,
			"EXPENSE": 3459,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 99687,
			"EXPENSE": 48502,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 94099,
			"EXPENSE": 7629,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 54738,
			"EXPENSE": 29032,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82298,
			"EXPENSE": 25677,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "04-05-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 95975,
			"EXPENSE": 15810,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "04-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 26679,
			"EXPENSE": 37964,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "03-04-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 27598,
			"EXPENSE": 38665,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11678,
			"EXPENSE": 39805,
			"VENDOR": "BMRC TPT",
			"POD AGING": 4
		},
		{
			"DATE": "03-02-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73587,
			"EXPENSE": 47150,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "01-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19502,
			"EXPENSE": 42485,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 41815,
			"EXPENSE": 26132,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 64269,
			"EXPENSE": 37998,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 27701,
			"EXPENSE": 30992,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55733,
			"EXPENSE": 39542,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-05-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21932,
			"EXPENSE": 15978,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 12820,
			"EXPENSE": 24267,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-20-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 99704,
			"EXPENSE": 5558,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 73911,
			"EXPENSE": 25195,
			"VENDOR": "New",
			"POD AGING": 5
		}
	];

	// vm.aCustomer = aActualData.map(obj => obj['CUSTOMER']).filter(function (value, index, self) {
	// 	return self.indexOf(value) === index;
	// });

	generateAggregatedByMonth();

	function applyFilter() {
		if(vm.aggregateByValue === 'Date Wise'){
			if(vm.levelValue === 'Month')
				generateAggregatedByMonth();
			else
				generateAggregatedByDay();
		}else if(vm.aggregateByValue === 'Customer Wise')
			generateAggregatedByCustomer();
		else if(vm.aggregateByValue === 'Vendor Wise')
			generateAggregatedByVendor();
		else if(vm.aggregateByValue === 'Vehicle Owner Wise')
			generateAggregatedByVehicleOwnership();

	}

	function generateAggregatedByCustomer() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['CUSTOMER']] = (temp[obj['CUSTOMER']] || 0) + obj['REVENUE'];

		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVendor() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['VENDOR']] = (temp[obj['VENDOR']] || 0) + obj['REVENUE'];
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVehicleOwnership() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['OWNER_TYPE']] = (temp[obj['OWNER_TYPE']] || 0) + obj['REVENUE'];
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByMonth() {
		vm.levelValue = 'Month';
		vm.selectedMonth = null;
		let aggregatedByMonth = {};
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}

			aggregatedByMonth[index] = {};
			aggregatedByMonth[index]['DATE'] = monthNames[index];
			aggregatedByMonth[index]['REVENUE'] = (aggregatedByMonth[index]['REVENUE'] || 0) + obj['REVENUE'];
		});
		let arr = [];
		for( let obj in aggregatedByMonth){
			arr.push(aggregatedByMonth[obj]);
		}
		applyData(arr);
	}

	function generateAggregatedByDay() {
		if(vm.selectedMonth === null && (!vm.to || !vm.from)){
			vm.levelValue = 'Month';
			swal('','Please Select From And To','warning');
			return;
		}
		vm.levelValue = 'Day';
		let aggregatedByDay = [];
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;

				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': obj['REVENUE']
				});
			}else if(index === vm.selectedMonth){
				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': obj['REVENUE']
				});
			}
		});
		aggregatedByDay.sort(function(a,b){
			return new Date(a['DATE']) - new Date(b['DATE']);
		});
		applyData(aggregatedByDay);
	}

	function applyData(aData){
		vm.data = [
			{
				key: "Cumulative Return",
				values: aData
			}
		];
	}

	function setMaxDate() {
		vm.to = null;
		let tempDate =  new Date(vm.from);
		vm.maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
		applyFilter();
	}

}

function data2($timeout, DatePicker) {
	var vm = this;
	vm.DatePicker = DatePicker;
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	vm.aggregateByValue = 'Date Wise';
	vm.levelValue = 'Month';

	// var realData = [{
	// 	date: new Date('1-1-2018'),
	// 	revenueExpected: 3,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('2-1-2018'),
	// 	revenueExpected: 5,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('3-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 5
	// },{
	// 	date: new Date('4-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 6
	// },{
	// 	date: new Date('5-1-2018'),
	// 	revenueExpected: 8,
	// 	revenueGenerated: 5
	// }];

	vm.aAggregatedBy = [
		'Date Wise',
		'Customer Wise',
		'Vendor Wise',
		'Vehicle Owner Wise'
	];

	vm.aLevel = [
		'Month',
		'Day'
	];

	vm.selectedMonth = null;

	vm.applyFilter = applyFilter;
	vm.setMaxDate = setMaxDate;

	vm.options = {
		chart: {
			type: 'discreteBarChart',
			height: 520,
			scale: 10,
			x: function(d){return d['DATE'];},
			y: function(d){return d['REVENUE'];},
			stacked: true,
			showControls: false,
			xAxis: {
				// axisLabel: vm.aggregateByValue,
				// tickFormat: function(d) {
				// 	console.log(d);
				// },
				// axisLabelDistance: 5
				rotateLabels: -70

			},
			yAxis: {
				// axisLabel: 'Revenue',
				// axisLabelDistance: -10
			},
			discretebar: {
				dispatch: {
					elementDblClick: function(e) {
						if(vm.selectedMonth !== null || vm.aggregateByValue !== 'Date Wise')
							return;
						let index = monthNames.indexOf(e.data['DATE']);
						vm.selectedMonth = index !== -1 ? index : null ;
						generateAggregatedByDay();
						$timeout(vm.api.refresh(),100)
					},
				}
			},
			tooltip: {
				contentGenerator: function (e) {
					if(vm.aggregateByValue === 'Date Wise' && vm.levelValue === 'Day'){
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='x-value'><strong>" + e.data['CUSTOMER'] + "</strong></td>" +
							"</tr>" +
							"<tr>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}else{
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}
				}
			}
		}
	};

	vm.api = {};

	// Genrate graph data from realdata

	// vm.data = [
	// 	{
	// 		'key' : 'Revenue Generated',
	// 		"values": []
	// 	},
	// 	{
	// 		'key' : 'Revenue Remain',
	// 		"values": []
	// 	}
	// ];

	// realData.map(obj => {
	// 	var remain = [],
	// 		expected = [];
	//
	// 	remain.push(monthNames[obj.date.getMonth()]);
	// 	remain.push(obj.revenueGenerated);
	// 	remain.push(obj.revenueExpected);
	//
	// 	expected.push(monthNames[obj.date.getMonth()]);
	// 	expected.push(obj.revenueExpected - obj.revenueGenerated);
	// 	expected.push(obj.revenueExpected);
	//
	// 	vm.data[0].values.push(remain);
	// 	vm.data[1].values.push(expected);
	// });
	//
	// console.log(vm.data);

	var aActualData = [
		{
			"DATE": "02-13-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 60630,
			"EXPENSE": 1066,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 34166,
			"EXPENSE": 36138,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 32797,
			"EXPENSE": 17913,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "05-21-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 39047,
			"EXPENSE": 1373,
			"VENDOR": "abcd",
			"POD AGING": ""
		},
		{
			"DATE": "05-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 42591,
			"EXPENSE": 19366,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": ""
		},
		{
			"DATE": "02-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 63330,
			"EXPENSE": 37332,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 17227,
			"EXPENSE": 7918,
			"VENDOR": "BMRC TPT",
			"POD AGING": ""
		},
		{
			"DATE": "06-26-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 80297,
			"EXPENSE": 33640,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 38076,
			"EXPENSE": 22683,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 72394,
			"EXPENSE": 23878,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 16746,
			"EXPENSE": 38976,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "01-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 42056,
			"EXPENSE": 24495,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 57503,
			"EXPENSE": 37724,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 12460,
			"EXPENSE": 40745,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": ""
		},
		{
			"DATE": "06-20-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 85272,
			"EXPENSE": 42949,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42781,
			"EXPENSE": 2228,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 72480,
			"EXPENSE": 3693,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 6
		},
		{
			"DATE": "06-12-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 88509,
			"EXPENSE": 28175,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "06-13-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73895,
			"EXPENSE": 5845,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11738,
			"EXPENSE": 31206,
			"VENDOR": "BMRC TPT",
			"POD AGING": 7
		},
		{
			"DATE": "04-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 35174,
			"EXPENSE": 43279,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-30-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 95892,
			"EXPENSE": 10112,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-28-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 72240,
			"EXPENSE": 12836,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 12474,
			"EXPENSE": 10777,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 11444,
			"EXPENSE": 23402,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80871,
			"EXPENSE": 34010,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 54545,
			"EXPENSE": 48272,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 13
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72217,
			"EXPENSE": 48346,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "06-10-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 79193,
			"EXPENSE": 28093,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 15411,
			"EXPENSE": 23025,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62109,
			"EXPENSE": 26599,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 45685,
			"EXPENSE": 21480,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 15
		},
		{
			"DATE": "04-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41787,
			"EXPENSE": 9833,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 63183,
			"EXPENSE": 1567,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 12882,
			"EXPENSE": 11526,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 18
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 42174,
			"EXPENSE": 25237,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 50516,
			"EXPENSE": 6849,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 18
		},
		{
			"DATE": "06-16-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 43918,
			"EXPENSE": 31910,
			"VENDOR": "BMRC TPT",
			"POD AGING": 25
		},
		{
			"DATE": "06-25-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 13121,
			"EXPENSE": 28934,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 67299,
			"EXPENSE": 29494,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 25
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 82345,
			"EXPENSE": 13321,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-06-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 49776,
			"EXPENSE": 49863,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46071,
			"EXPENSE": 48160,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 6
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 94986,
			"EXPENSE": 23281,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 28
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 36633,
			"EXPENSE": 32118,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 28
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 61000,
			"EXPENSE": 6511,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 71221,
			"EXPENSE": 15307,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "02-03-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 30215,
			"EXPENSE": 5091,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 30
		},
		{
			"DATE": "05-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 13832,
			"EXPENSE": 42307,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 30
		},
		{
			"DATE": "03-11-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36426,
			"EXPENSE": 38141,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 86823,
			"EXPENSE": 11382,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "01-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 56324,
			"EXPENSE": 19275,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "02-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 50535,
			"EXPENSE": 30761,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67949,
			"EXPENSE": 42135,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-01-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 33743,
			"EXPENSE": 21144,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-26-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76704,
			"EXPENSE": 14757,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 44130,
			"EXPENSE": 48581,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 91421,
			"EXPENSE": 9908,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 34757,
			"EXPENSE": 32185,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 32
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 50376,
			"EXPENSE": 14804,
			"VENDOR": "New",
			"POD AGING": 32
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 18116,
			"EXPENSE": 38886,
			"VENDOR": "BMRC TPT",
			"POD AGING": 32
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 51356,
			"EXPENSE": 34459,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 15374,
			"EXPENSE": 2900,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 57190,
			"EXPENSE": 24280,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 21679,
			"EXPENSE": 37411,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "01-29-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89163,
			"EXPENSE": 15331,
			"VENDOR": "New",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85512,
			"EXPENSE": 24782,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 39655,
			"EXPENSE": 46039,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 45
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 70881,
			"EXPENSE": 17640,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "03-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 70830,
			"EXPENSE": 32358,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 52
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 97159,
			"EXPENSE": 18630,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 72347,
			"EXPENSE": 38326,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "06-11-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 71507,
			"EXPENSE": 33584,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 68035,
			"EXPENSE": 1039,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "03-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 69120,
			"EXPENSE": 23485,
			"VENDOR": "BMRC TPT",
			"POD AGING": 55
		},
		{
			"DATE": "03-26-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19057,
			"EXPENSE": 47734,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "02-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 80342,
			"EXPENSE": 21084,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 64289,
			"EXPENSE": 10735,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-05-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73318,
			"EXPENSE": 40898,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 60
		},
		{
			"DATE": "04-17-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 79632,
			"EXPENSE": 36753,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "03-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41776,
			"EXPENSE": 41833,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 83465,
			"EXPENSE": 4227,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-26-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85276,
			"EXPENSE": 29505,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55860,
			"EXPENSE": 35848,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 56902,
			"EXPENSE": 9185,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52044,
			"EXPENSE": 38729,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 91288,
			"EXPENSE": 23872,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "05-20-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 56420,
			"EXPENSE": 39869,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89331,
			"EXPENSE": 11432,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "02-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 93611,
			"EXPENSE": 9654,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 39464,
			"EXPENSE": 11245,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 4
		},
		{
			"DATE": "06-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 46013,
			"EXPENSE": 38726,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 72778,
			"EXPENSE": 48377,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 22780,
			"EXPENSE": 14227,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46363,
			"EXPENSE": 6512,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 42534,
			"EXPENSE": 5606,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 5
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80225,
			"EXPENSE": 39600,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74634,
			"EXPENSE": 2527,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 22554,
			"EXPENSE": 35236,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 23176,
			"EXPENSE": 7340,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 66369,
			"EXPENSE": 41337,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82432,
			"EXPENSE": 2312,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 45524,
			"EXPENSE": 26788,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 34593,
			"EXPENSE": 23766,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-20-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 83633,
			"EXPENSE": 25344,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 11
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 28457,
			"EXPENSE": 7817,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67795,
			"EXPENSE": 4467,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 66845,
			"EXPENSE": 13703,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 11
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36965,
			"EXPENSE": 38920,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 71729,
			"EXPENSE": 32194,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-22-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 79838,
			"EXPENSE": 30684,
			"VENDOR": "BMRC TPT",
			"POD AGING": 14
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89588,
			"EXPENSE": 47705,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 70190,
			"EXPENSE": 32167,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "04-10-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 27945,
			"EXPENSE": 16191,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 21236,
			"EXPENSE": 10225,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 34848,
			"EXPENSE": 6526,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 67606,
			"EXPENSE": 30348,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73661,
			"EXPENSE": 4878,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 65454,
			"EXPENSE": 27286,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52961,
			"EXPENSE": 43502,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 83065,
			"EXPENSE": 35684,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 35184,
			"EXPENSE": 30904,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 19331,
			"EXPENSE": 28997,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 67601,
			"EXPENSE": 39737,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 25
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 74893,
			"EXPENSE": 42831,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 28248,
			"EXPENSE": 26608,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 7
		},
		{
			"DATE": "02-20-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 66768,
			"EXPENSE": 19096,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 74416,
			"EXPENSE": 27273,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-23-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 15902,
			"EXPENSE": 49359,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21631,
			"EXPENSE": 38194,
			"VENDOR": "New",
			"POD AGING": 90
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 98671,
			"EXPENSE": 25645,
			"VENDOR": "New",
			"POD AGING": 85
		},
		{
			"DATE": "04-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 20340,
			"EXPENSE": 10087,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 16
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 98364,
			"EXPENSE": 40147,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 16
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 78365,
			"EXPENSE": 12926,
			"VENDOR": "BMRC TPT",
			"POD AGING": 16
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 56084,
			"EXPENSE": 46434,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38422,
			"EXPENSE": 13937,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 23654,
			"EXPENSE": 28631,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 10889,
			"EXPENSE": 15653,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-19-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 75345,
			"EXPENSE": 18944,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 80458,
			"EXPENSE": 18870,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-24-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 80324,
			"EXPENSE": 38820,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62413,
			"EXPENSE": 12663,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41247,
			"EXPENSE": 46837,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 17672,
			"EXPENSE": 32533,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "01-10-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76931,
			"EXPENSE": 1663,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "03-15-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 51899,
			"EXPENSE": 43454,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 87234,
			"EXPENSE": 42853,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85514,
			"EXPENSE": 29705,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-31-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72124,
			"EXPENSE": 22595,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 40088,
			"EXPENSE": 42286,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38866,
			"EXPENSE": 15725,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-09-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74930,
			"EXPENSE": 13862,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 57633,
			"EXPENSE": 12262,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "05-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 42205,
			"EXPENSE": 44824,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21879,
			"EXPENSE": 29575,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-26-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 23580,
			"EXPENSE": 4388,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 37818,
			"EXPENSE": 19542,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-03-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 53429,
			"EXPENSE": 35426,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 26646,
			"EXPENSE": 13511,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 53065,
			"EXPENSE": 42785,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-30-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 40061,
			"EXPENSE": 20380,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 11
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 73580,
			"EXPENSE": 24135,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 11
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 11758,
			"EXPENSE": 29908,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 65235,
			"EXPENSE": 44059,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 21
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62136,
			"EXPENSE": 16147,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 82707,
			"EXPENSE": 3011,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 21
		},
		{
			"DATE": "04-29-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42430,
			"EXPENSE": 3459,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 99687,
			"EXPENSE": 48502,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 94099,
			"EXPENSE": 7629,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 54738,
			"EXPENSE": 29032,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82298,
			"EXPENSE": 25677,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "04-05-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 95975,
			"EXPENSE": 15810,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "04-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 26679,
			"EXPENSE": 37964,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "03-04-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 27598,
			"EXPENSE": 38665,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11678,
			"EXPENSE": 39805,
			"VENDOR": "BMRC TPT",
			"POD AGING": 4
		},
		{
			"DATE": "03-02-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73587,
			"EXPENSE": 47150,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "01-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19502,
			"EXPENSE": 42485,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 41815,
			"EXPENSE": 26132,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 64269,
			"EXPENSE": 37998,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 27701,
			"EXPENSE": 30992,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55733,
			"EXPENSE": 39542,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-05-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21932,
			"EXPENSE": 15978,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 12820,
			"EXPENSE": 24267,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-20-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 99704,
			"EXPENSE": 5558,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 73911,
			"EXPENSE": 25195,
			"VENDOR": "New",
			"POD AGING": 5
		}
	];

	// vm.aCustomer = aActualData.map(obj => obj['CUSTOMER']).filter(function (value, index, self) {
	// 	return self.indexOf(value) === index;
	// });

	generateAggregatedByMonth();

	function applyFilter() {
		if(vm.aggregateByValue === 'Date Wise'){
			if(vm.levelValue === 'Month')
				generateAggregatedByMonth();
			else
				generateAggregatedByDay();
		}else if(vm.aggregateByValue === 'Customer Wise')
			generateAggregatedByCustomer();
		else if(vm.aggregateByValue === 'Vendor Wise')
			generateAggregatedByVendor();
		else if(vm.aggregateByValue === 'Vehicle Owner Wise')
			generateAggregatedByVehicleOwnership();

	}

	function generateAggregatedByCustomer() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['CUSTOMER']] = (temp[obj['CUSTOMER']] || 0) + (obj['REVENUE'] - obj['EXPENSE']);

		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVendor() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['VENDOR']] = (temp[obj['VENDOR']] || 0) + (obj['REVENUE'] - obj['EXPENSE']);
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVehicleOwnership() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['OWNER_TYPE']] = (temp[obj['OWNER_TYPE']] || 0) + (obj['REVENUE'] - obj['EXPENSE']);
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByMonth() {
		vm.levelValue = 'Month';
		vm.selectedMonth = null;
		let aggregatedByMonth = {};
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}

			aggregatedByMonth[index] = {};
			aggregatedByMonth[index]['DATE'] = monthNames[index];
			aggregatedByMonth[index]['REVENUE'] = (aggregatedByMonth[index]['REVENUE'] || 0) + (obj['REVENUE'] - obj['EXPENSE']);
		});
		let arr = [];
		for( let obj in aggregatedByMonth){
			arr.push(aggregatedByMonth[obj]);
		}
		applyData(arr);
	}

	function generateAggregatedByDay() {
		if(vm.selectedMonth === null && (!vm.to || !vm.from)){
			vm.levelValue = 'Month';
			swal('','Please Select From And To','warning');
			return;
		}
		vm.levelValue = 'Day';
		let aggregatedByDay = [];
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;

				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': (obj['REVENUE'] - obj['EXPENSE'])
				});
			}else if(index === vm.selectedMonth){
				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': (obj['REVENUE'] - obj['EXPENSE'])
				});
			}
		});
		aggregatedByDay.sort(function(a,b){
			return new Date(a['DATE']) - new Date(b['DATE']);
		});
		applyData(aggregatedByDay);
	}

	function applyData(aData){
		vm.data = [
			{
				key: "Cumulative Return",
				values: aData
			}
		];
	}

	function setMaxDate() {
		vm.to = null;
		let tempDate =  new Date(vm.from);
		vm.maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
		applyFilter();
	}

}

function BookingAnalysisCtrl($timeout, DatePicker) {
	var vm = this;
	vm.DatePicker = DatePicker;
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// var realData = [{
	// 	date: new Date('1-1-2018'),
	// 	revenueExpected: 3,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('2-1-2018'),
	// 	revenueExpected: 5,
	// 	revenueGenerated: 2
	// },{
	// 	date: new Date('3-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 5
	// },{
	// 	date: new Date('4-1-2018'),
	// 	revenueExpected: 7,
	// 	revenueGenerated: 6
	// },{
	// 	date: new Date('5-1-2018'),
	// 	revenueExpected: 8,
	// 	revenueGenerated: 5
	// }];

	vm.aAggregatedBy = [
		'Date Wise',
		'Customer Wise'
	];
	vm.aggregateByValue = 'Date Wise';

	vm.aLevel = [
		'Month',
		'Day'
	];
	vm.levelValue = 'Month';

	vm.selectedMonth = null;

	vm.applyFilter = applyFilter;
	vm.setMaxDate = setMaxDate;

	vm.options = {
		chart: {
			type: 'discreteBarChart',
			height: 520,
			scale: 10,
			x: d => d['DATE'],
			y: d => d['REVENUE'],
			stacked: true,
			showControls: false,
			xAxis: {
				// axisLabel: vm.aggregateByValue,
				// tickFormat: function(d) {
				// 	console.log(d);
				// },
				// axisLabelDistance: 5
				rotateLabels: -70

			},
			yAxis: {
				// axisLabel: 'Revenue',
				// axisLabelDistance: -10
			},
			discretebar: {
				dispatch: {
					elementDblClick: function(e) {
						if(vm.selectedMonth !== null || vm.aggregateByValue !== 'Date Wise')
							return;
						let index = monthNames.indexOf(e.data['DATE']);
						vm.selectedMonth = index !== -1 ? index : null ;
						generateAggregatedByDay();
						$timeout(vm.api.refresh(),100)
					},
				}
			},
			tooltip: {
				contentGenerator: function (e) {
					if(vm.aggregateByValue === 'Date Wise' && vm.levelValue === 'Day'){
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='x-value'><strong>" + e.data['CUSTOMER'] + "</strong></td>" +
							"</tr>" +
							"<tr>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}else{
						var series = e.series[0];
						if (series.value === null) return;

						var header =
							"<thead>" +
							"<tr>" +
							"<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
							"<td class='key'>" + series.key+ "</td>" +
							"<td class='x-value'><strong>" + d3.format(",.1f")(series.value) + "</strong></td>" +
							"</tr>" +
							"</thead>";

						return "<table>" +
							header +
							"</table>";
					}
				}
			}
		}
	};

	vm.api = {};

	// Genrate graph data from realdata

	// vm.data = [
	// 	{
	// 		'key' : 'Revenue Generated',
	// 		"values": []
	// 	},
	// 	{
	// 		'key' : 'Revenue Remain',
	// 		"values": []
	// 	}
	// ];

	// realData.map(obj => {
	// 	var remain = [],
	// 		expected = [];
	//
	// 	remain.push(monthNames[obj.date.getMonth()]);
	// 	remain.push(obj.revenueGenerated);
	// 	remain.push(obj.revenueExpected);
	//
	// 	expected.push(monthNames[obj.date.getMonth()]);
	// 	expected.push(obj.revenueExpected - obj.revenueGenerated);
	// 	expected.push(obj.revenueExpected);
	//
	// 	vm.data[0].values.push(remain);
	// 	vm.data[1].values.push(expected);
	// });
	//
	// console.log(vm.data);

	var aActualData = [
		{
			"DATE": "02-13-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 60630,
			"EXPENSE": 1066,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 34166,
			"EXPENSE": 36138,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 32797,
			"EXPENSE": 17913,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "05-21-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 39047,
			"EXPENSE": 1373,
			"VENDOR": "abcd",
			"POD AGING": ""
		},
		{
			"DATE": "05-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 42591,
			"EXPENSE": 19366,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": ""
		},
		{
			"DATE": "02-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 63330,
			"EXPENSE": 37332,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 17227,
			"EXPENSE": 7918,
			"VENDOR": "BMRC TPT",
			"POD AGING": ""
		},
		{
			"DATE": "06-26-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 80297,
			"EXPENSE": 33640,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 38076,
			"EXPENSE": 22683,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 72394,
			"EXPENSE": 23878,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 16746,
			"EXPENSE": 38976,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": ""
		},
		{
			"DATE": "01-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 42056,
			"EXPENSE": 24495,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 57503,
			"EXPENSE": 37724,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": ""
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 12460,
			"EXPENSE": 40745,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": ""
		},
		{
			"DATE": "06-20-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 85272,
			"EXPENSE": 42949,
			"VENDOR": "New",
			"POD AGING": ""
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42781,
			"EXPENSE": 2228,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 72480,
			"EXPENSE": 3693,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 6
		},
		{
			"DATE": "06-12-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 88509,
			"EXPENSE": 28175,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "06-13-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73895,
			"EXPENSE": 5845,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11738,
			"EXPENSE": 31206,
			"VENDOR": "BMRC TPT",
			"POD AGING": 7
		},
		{
			"DATE": "04-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 35174,
			"EXPENSE": 43279,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-30-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 95892,
			"EXPENSE": 10112,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-28-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 72240,
			"EXPENSE": 12836,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 12474,
			"EXPENSE": 10777,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 11444,
			"EXPENSE": 23402,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80871,
			"EXPENSE": 34010,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 54545,
			"EXPENSE": 48272,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 13
		},
		{
			"DATE": "02-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72217,
			"EXPENSE": 48346,
			"VENDOR": "New",
			"POD AGING": 13
		},
		{
			"DATE": "06-10-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 79193,
			"EXPENSE": 28093,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 15411,
			"EXPENSE": 23025,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62109,
			"EXPENSE": 26599,
			"VENDOR": "New",
			"POD AGING": 15
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 45685,
			"EXPENSE": 21480,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 15
		},
		{
			"DATE": "04-11-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41787,
			"EXPENSE": 9833,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 63183,
			"EXPENSE": 1567,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 12882,
			"EXPENSE": 11526,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 18
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 42174,
			"EXPENSE": 25237,
			"VENDOR": "New",
			"POD AGING": 18
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 50516,
			"EXPENSE": 6849,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 18
		},
		{
			"DATE": "06-16-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 43918,
			"EXPENSE": 31910,
			"VENDOR": "BMRC TPT",
			"POD AGING": 25
		},
		{
			"DATE": "06-25-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 13121,
			"EXPENSE": 28934,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 67299,
			"EXPENSE": 29494,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 25
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 82345,
			"EXPENSE": 13321,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-06-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 49776,
			"EXPENSE": 49863,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46071,
			"EXPENSE": 48160,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 6
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 94986,
			"EXPENSE": 23281,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 28
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 36633,
			"EXPENSE": 32118,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 28
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 61000,
			"EXPENSE": 6511,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 71221,
			"EXPENSE": 15307,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "02-03-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 30215,
			"EXPENSE": 5091,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 30
		},
		{
			"DATE": "05-11-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 13832,
			"EXPENSE": 42307,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 30
		},
		{
			"DATE": "03-11-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36426,
			"EXPENSE": 38141,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 86823,
			"EXPENSE": 11382,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "01-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 56324,
			"EXPENSE": 19275,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "02-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 50535,
			"EXPENSE": 30761,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "02-22-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67949,
			"EXPENSE": 42135,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-01-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 33743,
			"EXPENSE": 21144,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-26-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76704,
			"EXPENSE": 14757,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 44130,
			"EXPENSE": 48581,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "04-30-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 91421,
			"EXPENSE": 9908,
			"VENDOR": "New",
			"POD AGING": 35
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 34757,
			"EXPENSE": 32185,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 32
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 50376,
			"EXPENSE": 14804,
			"VENDOR": "New",
			"POD AGING": 32
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 18116,
			"EXPENSE": 38886,
			"VENDOR": "BMRC TPT",
			"POD AGING": 32
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 51356,
			"EXPENSE": 34459,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 15374,
			"EXPENSE": 2900,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 57190,
			"EXPENSE": 24280,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "02-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 21679,
			"EXPENSE": 37411,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "01-29-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89163,
			"EXPENSE": 15331,
			"VENDOR": "New",
			"POD AGING": 16
		},
		{
			"DATE": "03-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85512,
			"EXPENSE": 24782,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 39655,
			"EXPENSE": 46039,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 45
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 70881,
			"EXPENSE": 17640,
			"VENDOR": "New",
			"POD AGING": 45
		},
		{
			"DATE": "03-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 70830,
			"EXPENSE": 32358,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 52
		},
		{
			"DATE": "02-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 97159,
			"EXPENSE": 18630,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 72347,
			"EXPENSE": 38326,
			"VENDOR": "New",
			"POD AGING": 52
		},
		{
			"DATE": "06-11-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 71507,
			"EXPENSE": 33584,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 68035,
			"EXPENSE": 1039,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "03-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 69120,
			"EXPENSE": 23485,
			"VENDOR": "BMRC TPT",
			"POD AGING": 55
		},
		{
			"DATE": "03-26-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19057,
			"EXPENSE": 47734,
			"VENDOR": "New",
			"POD AGING": 55
		},
		{
			"DATE": "02-17-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 80342,
			"EXPENSE": 21084,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 64289,
			"EXPENSE": 10735,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 60
		},
		{
			"DATE": "01-05-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73318,
			"EXPENSE": 40898,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 60
		},
		{
			"DATE": "04-17-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 79632,
			"EXPENSE": 36753,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "03-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41776,
			"EXPENSE": 41833,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "06-08-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 83465,
			"EXPENSE": 4227,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-26-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85276,
			"EXPENSE": 29505,
			"VENDOR": "New",
			"POD AGING": 65
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55860,
			"EXPENSE": 35848,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 56902,
			"EXPENSE": 9185,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52044,
			"EXPENSE": 38729,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 91288,
			"EXPENSE": 23872,
			"VENDOR": "New",
			"POD AGING": 42
		},
		{
			"DATE": "05-20-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 56420,
			"EXPENSE": 39869,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89331,
			"EXPENSE": 11432,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "02-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 93611,
			"EXPENSE": 9654,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 39464,
			"EXPENSE": 11245,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 4
		},
		{
			"DATE": "06-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 46013,
			"EXPENSE": 38726,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 72778,
			"EXPENSE": 48377,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 22780,
			"EXPENSE": 14227,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 46363,
			"EXPENSE": 6512,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-07-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 42534,
			"EXPENSE": 5606,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 5
		},
		{
			"DATE": "03-16-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 80225,
			"EXPENSE": 39600,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74634,
			"EXPENSE": 2527,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 5
		},
		{
			"DATE": "04-08-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 22554,
			"EXPENSE": 35236,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 23176,
			"EXPENSE": 7340,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 66369,
			"EXPENSE": 41337,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82432,
			"EXPENSE": 2312,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 45524,
			"EXPENSE": 26788,
			"VENDOR": "New",
			"POD AGING": 8
		},
		{
			"DATE": "04-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 34593,
			"EXPENSE": 23766,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-20-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 83633,
			"EXPENSE": 25344,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 11
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 28457,
			"EXPENSE": 7817,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-22-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 67795,
			"EXPENSE": 4467,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 66845,
			"EXPENSE": 13703,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 11
		},
		{
			"DATE": "04-06-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 36965,
			"EXPENSE": 38920,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "05-03-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 71729,
			"EXPENSE": 32194,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-22-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 79838,
			"EXPENSE": 30684,
			"VENDOR": "BMRC TPT",
			"POD AGING": 14
		},
		{
			"DATE": "06-17-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 89588,
			"EXPENSE": 47705,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Own",
			"REVENUE": 70190,
			"EXPENSE": 32167,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "04-10-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 27945,
			"EXPENSE": 16191,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 21236,
			"EXPENSE": 10225,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 14
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 34848,
			"EXPENSE": 6526,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "06-22-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 67606,
			"EXPENSE": 30348,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-18-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 73661,
			"EXPENSE": 4878,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "06-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 65454,
			"EXPENSE": 27286,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 52961,
			"EXPENSE": 43502,
			"VENDOR": "New",
			"POD AGING": 23
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 83065,
			"EXPENSE": 35684,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "04-24-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 35184,
			"EXPENSE": 30904,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "01-12-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 19331,
			"EXPENSE": 28997,
			"VENDOR": "New",
			"POD AGING": 25
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 67601,
			"EXPENSE": 39737,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 25
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 74893,
			"EXPENSE": 42831,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 28248,
			"EXPENSE": 26608,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 7
		},
		{
			"DATE": "02-20-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 66768,
			"EXPENSE": 19096,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-27-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 74416,
			"EXPENSE": 27273,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "06-23-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 15902,
			"EXPENSE": 49359,
			"VENDOR": "New",
			"POD AGING": 7
		},
		{
			"DATE": "04-21-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21631,
			"EXPENSE": 38194,
			"VENDOR": "New",
			"POD AGING": 90
		},
		{
			"DATE": "04-22-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 98671,
			"EXPENSE": 25645,
			"VENDOR": "New",
			"POD AGING": 85
		},
		{
			"DATE": "04-25-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 20340,
			"EXPENSE": 10087,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 16
		},
		{
			"DATE": "05-01-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 98364,
			"EXPENSE": 40147,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 16
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Market",
			"REVENUE": 78365,
			"EXPENSE": 12926,
			"VENDOR": "BMRC TPT",
			"POD AGING": 16
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 56084,
			"EXPENSE": 46434,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 16
		},
		{
			"DATE": "05-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38422,
			"EXPENSE": 13937,
			"VENDOR": "New",
			"POD AGING": 28
		},
		{
			"DATE": "05-16-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Rented",
			"REVENUE": 23654,
			"EXPENSE": 28631,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 10889,
			"EXPENSE": 15653,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "03-19-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 75345,
			"EXPENSE": 18944,
			"VENDOR": "New",
			"POD AGING": 10
		},
		{
			"DATE": "02-04-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 80458,
			"EXPENSE": 18870,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-24-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 80324,
			"EXPENSE": 38820,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "01-04-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62413,
			"EXPENSE": 12663,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "03-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 41247,
			"EXPENSE": 46837,
			"VENDOR": "New",
			"POD AGING": 12
		},
		{
			"DATE": "06-24-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 17672,
			"EXPENSE": 32533,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "01-10-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 76931,
			"EXPENSE": 1663,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "03-15-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 51899,
			"EXPENSE": 43454,
			"VENDOR": "New",
			"POD AGING": 20
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 87234,
			"EXPENSE": 42853,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-19-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 85514,
			"EXPENSE": 29705,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-31-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 72124,
			"EXPENSE": 22595,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "03-29-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 40088,
			"EXPENSE": 42286,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 38866,
			"EXPENSE": 15725,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "05-09-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 74930,
			"EXPENSE": 13862,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "03-07-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 57633,
			"EXPENSE": 12262,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 14
		},
		{
			"DATE": "05-08-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 42205,
			"EXPENSE": 44824,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-25-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21879,
			"EXPENSE": 29575,
			"VENDOR": "New",
			"POD AGING": 14
		},
		{
			"DATE": "05-26-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Market",
			"REVENUE": 23580,
			"EXPENSE": 4388,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 5
		},
		{
			"DATE": "04-01-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 37818,
			"EXPENSE": 19542,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-03-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 53429,
			"EXPENSE": 35426,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "01-21-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 26646,
			"EXPENSE": 13511,
			"VENDOR": "BMRC TPT",
			"POD AGING": 5
		},
		{
			"DATE": "05-12-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 53065,
			"EXPENSE": 42785,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "03-30-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 40061,
			"EXPENSE": 20380,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 11
		},
		{
			"DATE": "01-17-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Market",
			"REVENUE": 73580,
			"EXPENSE": 24135,
			"VENDOR": "VYAS ROADLINES",
			"POD AGING": 11
		},
		{
			"DATE": "01-14-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 11758,
			"EXPENSE": 29908,
			"VENDOR": "New",
			"POD AGING": 11
		},
		{
			"DATE": "01-02-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Market",
			"REVENUE": 65235,
			"EXPENSE": 44059,
			"VENDOR": "HPR CARGO CARRIER",
			"POD AGING": 21
		},
		{
			"DATE": "05-29-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 62136,
			"EXPENSE": 16147,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "03-03-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 82707,
			"EXPENSE": 3011,
			"VENDOR": "GTB ROADWAYS",
			"POD AGING": 21
		},
		{
			"DATE": "04-29-18",
			"CUSTOMER": "Maple",
			"OWNER_TYPE": "Own",
			"REVENUE": 42430,
			"EXPENSE": 3459,
			"VENDOR": "New",
			"POD AGING": 21
		},
		{
			"DATE": "04-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Rented",
			"REVENUE": 99687,
			"EXPENSE": 48502,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "01-19-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 94099,
			"EXPENSE": 7629,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-09-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 54738,
			"EXPENSE": 29032,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "06-02-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 82298,
			"EXPENSE": 25677,
			"VENDOR": "New",
			"POD AGING": 5
		},
		{
			"DATE": "04-05-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 95975,
			"EXPENSE": 15810,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "04-13-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Market",
			"REVENUE": 26679,
			"EXPENSE": 37964,
			"VENDOR": "GIRI TRANSPORT",
			"POD AGING": 4
		},
		{
			"DATE": "03-04-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Own",
			"REVENUE": 27598,
			"EXPENSE": 38665,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-27-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Market",
			"REVENUE": 11678,
			"EXPENSE": 39805,
			"VENDOR": "BMRC TPT",
			"POD AGING": 4
		},
		{
			"DATE": "03-02-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Market",
			"REVENUE": 73587,
			"EXPENSE": 47150,
			"VENDOR": "AMIT FREIGHT CARRIER",
			"POD AGING": 4
		},
		{
			"DATE": "01-25-18",
			"CUSTOMER": "Siemens",
			"OWNER_TYPE": "Rented",
			"REVENUE": 19502,
			"EXPENSE": 42485,
			"VENDOR": "New",
			"POD AGING": 4
		},
		{
			"DATE": "06-18-18",
			"CUSTOMER": "Mahindra",
			"OWNER_TYPE": "Own",
			"REVENUE": 41815,
			"EXPENSE": 26132,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "05-24-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 64269,
			"EXPENSE": 37998,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-19-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Rented",
			"REVENUE": 27701,
			"EXPENSE": 30992,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "04-28-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Rented",
			"REVENUE": 55733,
			"EXPENSE": 39542,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-05-18",
			"CUSTOMER": "Samsung",
			"OWNER_TYPE": "Rented",
			"REVENUE": 21932,
			"EXPENSE": 15978,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "02-02-18",
			"CUSTOMER": "FutureTrucks",
			"OWNER_TYPE": "Own",
			"REVENUE": 12820,
			"EXPENSE": 24267,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "03-20-18",
			"CUSTOMER": "WWG",
			"OWNER_TYPE": "Own",
			"REVENUE": 99704,
			"EXPENSE": 5558,
			"VENDOR": "New",
			"POD AGING": 6
		},
		{
			"DATE": "01-15-18",
			"CUSTOMER": "Mapro",
			"OWNER_TYPE": "Own",
			"REVENUE": 73911,
			"EXPENSE": 25195,
			"VENDOR": "New",
			"POD AGING": 5
		}
	];

	// vm.aCustomer = aActualData.map(obj => obj['CUSTOMER']).filter(function (value, index, self) {
	// 	return self.indexOf(value) === index;
	// });

	generateAggregatedByMonth();

	function applyFilter() {
		if(vm.aggregateByValue === 'Date Wise'){
			if(vm.levelValue === 'Month') generateAggregatedByMonth(); else generateAggregatedByDay();
		}else if(vm.aggregateByValue === 'Customer Wise') generateAggregatedByCustomer();
	}

	function generateAggregatedByCustomer() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['CUSTOMER']] = (temp[obj['CUSTOMER']] || 0) + obj['REVENUE'];

		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVendor() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['VENDOR']] = (temp[obj['VENDOR']] || 0) + obj['REVENUE'];
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByVehicleOwnership() {
		let temp = {};
		aActualData.map(obj => {
			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}
			temp[obj['OWNER_TYPE']] = (temp[obj['OWNER_TYPE']] || 0) + obj['REVENUE'];
		});

		let arr = [];
		for(let obj in temp) {
			arr.push({
				'DATE': obj,
				'REVENUE': temp[obj]
			})
		}

		applyData(arr);
	}

	function generateAggregatedByMonth() {
		vm.levelValue = 'Month';
		vm.selectedMonth = null;
		let aggregatedByMonth = {};
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;
			}

			aggregatedByMonth[index] = {};
			aggregatedByMonth[index]['DATE'] = monthNames[index];
			aggregatedByMonth[index]['REVENUE'] = (aggregatedByMonth[index]['REVENUE'] || 0) + obj['REVENUE'];
		});
		let arr = [];
		for(let obj in aggregatedByMonth){
			arr.push(aggregatedByMonth[obj]);
		}
		applyData(arr);
	}

	function generateAggregatedByDay() {
		if(vm.selectedMonth === null && (!vm.to || !vm.from)){
			vm.levelValue = 'Month';
			swal('','Please Select From And To','warning');
			return;
		}
		vm.levelValue = 'Day';
		let aggregatedByDay = [];
		aActualData.map(function (obj){
			let index = new Date(obj['DATE']).getMonth();

			if(vm.to && vm.from){
				let date = new Date(obj['DATE']).getTime(),
					from = vm.from.getTime(),
					to = vm.to.getTime();

				if(!(date >= from && date <= to))
					return;

				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': obj['REVENUE']
				});
			}else if(index === vm.selectedMonth){
				aggregatedByDay.push({
					'DATE': obj['DATE'],
					'CUSTOMER': obj['CUSTOMER'],
					'REVENUE': obj['REVENUE']
				});
			}
		});
		aggregatedByDay.sort(function(a,b){
			return new Date(a['DATE']) - new Date(b['DATE']);
		});
		applyData(aggregatedByDay);
	}

	function applyData(aData){
		vm.data = [
			{
				key: "Cumulative Return",
				values: aData
			}
		];
	}

	function setMaxDate() {
		vm.to = null;
		let tempDate =  new Date(vm.from);
		vm.maxDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
		applyFilter();
	}

}
