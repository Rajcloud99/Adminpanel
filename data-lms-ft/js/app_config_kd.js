var getAppConfig = function(source) {
    var oLocalCoinfig = {
        'base_url': 'http://13.235.47.52:3011/',//kapoors
		// 'reporting_url': 'http://13.232.202.194:3002/', // change this to 3002 to serve from main app server
		// 'file_server': 'http://13.232.202.194:7652/users/',
		//'base_url': 'http://localhost:3002/',
		'reporting_url': 'http://localhost:3002/', // change this to 3002 to serve from main app server
		'file_server': 'http://localhost:7652/users/',
		'gps_url': 'http://localhost:5001',
		'trucku_url': 'http://localhost:8081/'
	};
    var oCoinfig = {
		'base_url': 'http://lmstest.umbrellaprotectionsystems.com:3005/',
		'file_server': 'http://lmstest.umbrellaprotectionsystems.com:7652/users/',
		'gps_url': 'http://trucku.in:5001',
		'trucku_url': 'http://trucku.in:8081/',
		'reporting_url': 'http://lmstest.umbrellaprotectionsystems.com:3005/',
};
	if(source && source=='local'){
		return oLocalCoinfig;
	}
	return oLocalCoinfig;
};

var getSocketAppConfig = function () {
	var oCoinfig = {
		base_url: 'http://trackyourcar.in:2020',
	};
	return oCoinfig;
};
