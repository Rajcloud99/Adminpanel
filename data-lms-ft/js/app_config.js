var getAppConfig = function() {
    var oCoinfig = {
        /*
        // 'base_url': 'http://13.232.202.194:3011/',
        // 'reporting_url': 'http://13.232.202.194:3002/', // change this to 3002 to serve from main app server
        // 'file_server': 'http://13.232.202.194:7652/',
        //
        // 'base_url': 'http://13.235.47.52:3011/',
        // 'reporting_url': 'http://13.235.47.52:3002/', // change this to 3002 to serve from main app server
        // 'file_server': 'http://13.235.47.52:7652/',
		'base_url': 'http://lmstest.umbrellaprotectionsystems.com:3006/',
		'reporting_url': 'http://lmstest.umbrellaprotectionsystems.com:3006/', // change$
		'file_server': 'http://lmstest.umbrellaprotectionsystems.com:7653/',
		'gps_url': 'http://trucku.in:5001',
		'trucku_url': 'http://trucku.in:8081/',
		*/
		'base_url': 'http://localhost:3002/',
		'reporting_url': 'http://localhost:3002/', // change this to 3002 to serve from main app server
		'search_url': 'http://localhost:3002/', // change this to 3002 to serve from main app server
		'file_server': 'http://localhost:7652/',
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
