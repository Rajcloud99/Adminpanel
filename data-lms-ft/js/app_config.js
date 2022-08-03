var getAppConfig = function() {
	var oCoinfig = {
		'base_url': 'http://3.110.92.242:3002/',
		'reporting_url': 'http://3.110.92.242:3002/', // change this to 3002 to se>
		'search_url': 'http://3.110.92.242:3002/', // change this to 3002 to serve>
		'file_server': 'http://3.110.92.242:7652/',
		'gps_url': 'http://43.205.24.249:5001',
		'trucku_url': 'http://43.205.24.249:8081/'
	};
	return oCoinfig;
};

var getSocketAppConfig = function () {
	var oCoinfig = {
		base_url: 'http://localhost:2020',
	};
	return oCoinfig;
};
