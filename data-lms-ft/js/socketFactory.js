materialAdmin.factory('socketFactory', function (desktopNotification) {
	var socket;
	var oConfig = getSocketAppConfig();
	var BASE_URL =oConfig.base_url;
	var oSocketConfig = {'reconnection': true,'reconnectionDelay': 5000,'reconnectionDelayMax': 7000,'reconnectionAttempts': 100,
		'timeout':2000};

	function socketResponse(){
		socket.on("connect",function(args){
			console.log("successful connection",args);
		});
		socket.on("connect_error",function(args){
			console.log("connect_error",args);
		});
		socket.on("connect_timeout",function(args){
			console.log("connect_timeout",args);
		});
		socket.on("reconnect",function(args){
			//stopTimer();
			console.log("reconnect",args);
		});
		socket.on("reconnect_attempt",function(args){
			console.log("reconnect_attempt",args);
		});
		socket.on("reconnecting",function(args){
			console.log("reconnecting",args);
		});
		socket.on("reconnect_error",function(args){
			console.log("reconnect_error",args);
		});
		socket.on("reconnect_failed",function(args){
			console.log("reconnect_failed",args);
		});
		socket.on("disconnect",function(args){
			//startTimer();
			console.log("disconnect",args);
		});
		socket.on("message",function(args){
			try{
				var oRes = JSON.parse(JSON.stringify(args));
				Notification.requestPermission().then(function (permission) {
					// User allowed the notification
						var options = {
							body: oRes.content,
							icon: './img/logo.png',
							sound: './img/alert.mp3',
							onClick: function () {
							// Handle click event
							}
						};

						new Notification(oRes.title, options);
						socket.emit("deviceAcknowledgeNotif",oRes.notifId);
				}, function (permission) {
					// User denied the notification
				});
			}catch (e) {
				console.error(e);
			}
		});
	}

	return {
		connect: function(userId){
			return; //todo: remove to use notif socket
			if(socket && socket.connected===true){
				return;
			}
			var options = angular.copy(oSocketConfig);
			options.query = {
				deviceId : (Math.floor(Math.random() * 123654789) + 1).toString(),
				userId:userId,
				handshake_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJncHNnYWFkaSIsInRpbWUiOjE1MjIwMTA0OTgxNjJ9.0kD2fPtK2cybSL1rU51_azToU_SEr_TcNXPOzKgUxyA"
			};
			socket = io.connect(BASE_URL,options);
			socketResponse();
			socket.on("connect",function(args){
				console.log("successful connection",args);
			});
			socket.on("connect_error",function(args){
				console.log("connect_error",args);
			});
			socket.on("connect_timeout",function(args){
				console.log("connect_timeout",args);
			});
		},
		emit: function (eventName, data) {
			socket.emit(eventName, data)
		},
		manualSocketDisconnect:function () {
			socket.emit("manual-disconnection", socket.id);
			socket.close();
			console.log("Socket Closed. ");
		}
	};
});
