materialAdmin.controller("showMapPublicCtrl", function($rootScope, $scope, $uibModalInstance,$localStorage, thatData) {
    $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.route = thatData;
    var remoteData = thatData;

    var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    var directionsService = new google.maps.DirectionsService();
    var latLng = new google.maps.LatLng(28.537184, 77.270998);
    var map;
    var myOptions = {
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latLng
    };
    
    setTimeout(
        function(){
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("directions"));
            calcRoute();
        },
    500);
    
    function calcRoute() {
        var waypts = [];
        for (var i = 0; i < remoteData.selectedRouteWayPoint.length; i++) {
            stop = new google.maps.LatLng(remoteData.selectedRouteWayPoint[i].lat, remoteData.selectedRouteWayPoint[i].lng)
            if((i===0) || (i===(remoteData.selectedRouteWayPoint.length-1))){
                waypts.push({
                    location: stop,
                });
            }else{
                   waypts.push({
                    location: stop,
                    stopover: false
                }); 
            }
        }
        var startPoint = waypts.shift();
        var endPoint =  waypts.pop();
        createMarker();
        var request = {};
        request.origin = startPoint;
        request.destination = endPoint;
        request.waypoints = waypts;
        request.travelMode = google.maps.DirectionsTravelMode.DRIVING;
        request.optimizeWaypoints = true;
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                //var route = response.routes[0];
            }
        });
    }

    function createMarker() {
        var marker1 = new google.maps.Marker({
            position: {lat: remoteData.selectedRouteWayPoint[0].lat, lng: remoteData.selectedRouteWayPoint[0].lng},
            map: map
        });
        var marker2 = new google.maps.Marker({
            position: {lat: remoteData.selectedRouteWayPoint[remoteData.selectedRouteWayPoint.length-1].lat, lng: remoteData.selectedRouteWayPoint[remoteData.selectedRouteWayPoint.length-1].lng},
            map: map
        });
    }
});