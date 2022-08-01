var getAppConfig = function() {
    var oCoinfig = {
		'base_url': 'http://3.110.92.242:3002/',
		'reporting_url': 'http://3.110.92.242:3002/', // change this to 3002 to serve from main app server
		'search_url': 'http://3.110.92.242:3002/', // change this to 3002 to serve from main app server
		'file_server': 'http://3.110.92.242:7652/',
		'gps_url': 'http://trucku.in:5001',
		'trucku_url': 'http://trucku.in:8081/'
	};
	return oCoinfig;
};

var getSocketAppConfig = function () {
	var oCoinfig = {
		base_url: 'http://trackyourcar.in:2020',
	};
	return oCoinfig;
};
