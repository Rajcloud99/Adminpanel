var googlePlaceAPI = function(interval) {

	var placeSearch;oAutoComplete = {};
	var componentForm = {
		  street_number: 'short_name',
		  route: 'long_name',
		  sublocality_level_2: 'long_name',
		  sublocality_level_3: 'long_name',
		  sublocality_level_1: 'long_name',//c
		  sublocality: 'long_name',
		  locality: 'long_name',
		  administrative_area_level_2: 'long_name',//d
		  administrative_area_level_1: 'short_name',//state
		  country : 'short_name',
		  postal_code: 'short_name'
	};
    var self = this;
	var callB_;

	function initAutocomplete(aUIds) {
		oAutoComplete = {};
		aUIds.forEach(function(sUId){
			oAutoComplete[sUId] = new google.maps.places.Autocomplete((document.getElementById(sUId)),{types: ['geocode'],componentRestrictions: { country: "in" }});
			oAutoComplete[sUId].name = sUId;
			oAutoComplete[sUId].addListener('place_changed', fillInAddress);
		});
	  self.stopFight();
	}

	function fillInAddress() {
	  var place = this.getPlace();
	  var oSelectedPlace = {};
	  var oCity = {};
	  for (var i = 0; i < place.address_components.length; i++) {
	   var addressType = place.address_components[i].types[0];
	    if (componentForm[addressType]) {

	    	//var val = place.address_components[i][componentForm[addressType]];
            //document.getElementById(addressType).value = val;

	    	oSelectedPlace[addressType] =  place.address_components[i][componentForm[addressType]];
	    	if(addressType == 'administrative_area_level_1'){
	    		oSelectedPlace['administrative_area_level_1_f'] = place.address_components[i]['long_name'];
	    	}else if(addressType == 'country'){
	    		oSelectedPlace['country_f'] = place.address_components[i]['long_name'];
	    	}
	    	
	     }
	  }
	 oCity.c = oSelectedPlace.sublocality_level_1 || oSelectedPlace.sublocality 
		 || oSelectedPlace.locality || oSelectedPlace.administrative_area_level_2;
	 oCity.d = oSelectedPlace.administrative_area_level_2|| oSelectedPlace.locality ||  oSelectedPlace.sublocality || oSelectedPlace.sublocality_level_1;
	if(!oCity.c && oSelectedPlace.administrative_area_level_1_f){
		oCity.c = oSelectedPlace.administrative_area_level_1_f;
	}
	if(!oCity.d && oSelectedPlace.administrative_area_level_1_f){
		oCity.d = oSelectedPlace.administrative_area_level_1_f;
	}
	 /*angular.forEach(oCity,function(city,key){
		 oCity[key] = city && city.toLowerCase ? city.toLowerCase(): city;
	 });*/

	 //Code Change
     if(oSelectedPlace && oSelectedPlace.administrative_area_level_1){
	   oCity.st_s =  oSelectedPlace.administrative_area_level_1;	
	 }
	 if(oSelectedPlace && oSelectedPlace.administrative_area_level_1_f){
	   oCity.st =  oSelectedPlace.administrative_area_level_1_f;	
	 }
	 if(oSelectedPlace && oSelectedPlace.country){
	   oCity.cnt_s = oSelectedPlace.country;
	 }
	 if(oSelectedPlace && oSelectedPlace.country_f){
	   oCity.cnt = oSelectedPlace.country_f;
	 }
     //
	 if(oSelectedPlace.postal_code){
		 oCity.p = oSelectedPlace.postal_code;
	 }
	 oCity.address_components = oSelectedPlace;
	 oCity.formatted_address = place.formatted_address;
	 if(place.geometry && place.geometry.location){
		 oCity.geometry = {};
		 oCity.geometry.location = place.geometry.location.toJSON()
	 }
	 oCity.place_id  =  place.place_id; 
	 oCity.types  =  place.types;
	 oCity.url  =  place.url;
	 oCity.vicinity =  place.vicinity;
	 self.myScope[this.name]= oCity;//
	 if(self.myScope && self.myScope.selectText){
	 	self.myScope.selectText();
	 }
	 var results = oCity.s;
	 console.log(oSelectedPlace,oCity,results);
		if (callB_) {
			callB_();
		}
	 /*document.getElementById(addressType).value = oSelectedPlace[addressType];*/
	};

	this.geolocate = function(sUIds) {
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      var geolocation = {
	        lat: position.coords.latitude,
	        lng: position.coords.longitude
	      };
	      var circle = new google.maps.Circle({
	        center: geolocation,
	        radius: position.coords.accuracy
	      });
	      oAutoComplete[sUIds].setBounds(circle.getBounds());
	    });
	  }
	};
	  var stop;

      this.fight = function(myScope,aUIds,callB) {
    	  var self =this;
    	  this.myScope = myScope;
		  callB_=callB;
        // Don't start a new fight if we are already fighting
        if ( angular.isDefined(stop) ) return;

        stop = interval(function() {
        	var bUILoaded = true;
        	aUIds.forEach(function(sUIds){
        		if (!document.getElementById(sUIds)){
        			bUILoaded = false;
        		}
        	});
          if (bUILoaded && google && google.maps &&  google.maps.places && google.maps.places.Autocomplete) {
        	  initAutocomplete(aUIds,callB);
          } else {
            self.stopFight();
          }
        }, 100);
      };

      this.stopFight = function() {
        if (angular.isDefined(stop)) {
          interval.cancel(stop);
          stop = undefined;
        }
      };
//      $scope.$on('$destroy', function() {
//          // Make sure that the interval is destroyed too
//          $scope.stopFight();
//        });
      //$scope.fight();
      return this;
};