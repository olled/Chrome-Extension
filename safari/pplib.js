(function() {  
	Array.prototype.remove = function(e) {
		for (var i = 0; i < this.length; i++)
			if (e == this[i]) return this.splice(i, 1);
	};

	Array.prototype.each = function(fn) {
		for (var i = 0; i < this.length; i++) fn(this[i]);
	};

	var PP = {
		SocketChannel:function(webSocket, channelHash){
			var _listeners = [];
			var _presenceListeners = [];
			var _ws = webSocket;
			var _channelHash = channelHash;
			var _whoOnlineListener = null;
			var _onConnectedListeners = [];
			var _connected = false;
			
			function _notifyListeners(message) {
				_listeners.each(function(f) {
					f(message);
				});
			}

			function _notifyPresence(presence) {
				_presenceListeners.each(function(f) {
					f(presence);
				});
			}
			
			function _notifyWhoOnline(onlineUsers) {
				if(_whoOnlineListener) {
					_whoOnlineListener(onlineUsers.users);
				}
			}
			
			function _sendMessageFromClient(msg) {
				var sendMessageData = {
					channelHash:_channelHash,
					sendmessage: {
						message:msg
					}
				};
				_ws.send(JSON.stringify(sendMessageData));
			}
			
			function _addOnChannelConnected(listener) {
				_onConnectedListeners.push(listener);
			}
			
			function _addOnMessageListener(listener) {
				_listeners.push(listener);
			}

			function _addOnPresenceChange(listener) {
				_presenceListeners.push(listener);
			}
			
			function _whoOnline(callback) {
				_whoOnlineListener = callback;
				var whoOnlineData = {
					channelHash:_channelHash,
					whoonline: {}
				};
				_ws.send(JSON.stringify(whoOnlineData));
			}
			
			return {
				setConnected:function (b) {
					_connected = b;
					_onConnectedListeners.each(function(f) {
						f();
					});
				},
				
				isConnected:function () {
					return _connected;
				},
				
				notifyListeners:function (message) {
					_notifyListeners(message);
				},

				notifyPresence:function (presence) {
					_notifyPresence(presence);
				},
				
				notifyWhoOnline:function (onlineUsers) {
					_notifyWhoOnline(onlineUsers);
				},
				
				addOnChannelConnected:function(listener) {
					_addOnChannelConnected(listener);
					return this;
				},
				
				addOnMessageListener:function(listener) {
					_addOnMessageListener(listener);
					return this;
				},

				addOnPresenceChange:function(listener) {
					_addOnPresenceChange(listener);
					return this;
				},
				
				sendMessage:function(message) {
					_sendMessageFromClient(message);
				},
				
				whoOnline:function(callback){
					_whoOnline(callback);
				}
			};
		},
		
		Socket:function(consumerKey, serverURL) {
			var SERVER_URL = 'wss://localhost';
			if(serverURL) {SERVER_URL = serverURL;}
			
			var _ws = null;
			var _channels = {};
			var _connectListners = [];
			var _disconnectListners = [];
			var _connected = false;
			var _consumerKey = consumerKey;
			
			if (!("WebSocket" in window)) {
				return null;
			};
			
			function sendIsAliveSignal() {
				setTimeout(
						function() {
							_send("{}");
							sendIsAliveSignal();
						}, 
						15000);
			}
			
			function _setupSocket() {
				_ws.onopen = function () {
					_connected = true;
					_connectListners.each(function(f) {
						f();
					});
					sendIsAliveSignal();
				};
				
				_ws.onmessage = function(event) { 
					var data = JSON.parse(event.data);
					var channelName = _generateChannelName(data.channelHash);
					if(data.channelconnect) {
						_channels[channelName].setConnected(data.channelconnect);
					} else if(data.broadcast) {
						_channels[channelName].notifyListeners({from:data.broadcast.uID,
																message:data.broadcast.message});
					} else if(data.presence) {
						_channels[channelName].notifyPresence({uID:data.presence.uID,
																isOnline:data.presence.isOnline});
					} else if(data.whoonline) {
						_channels[channelName].notifyWhoOnline({users:data.whoonline.users});
					}
				};
		
				_ws.onclose = function() {
					_disconnectListners.each(function(f) {
						f();
					});
				};
			}
			
			_ws = new WebSocket(SERVER_URL);
			_setupSocket();
			
			function _generateChannelName(channelHash) {
				return 'channel_' + channelHash;
			}
			
			function _createChannel(c, u, ch) {
				var channelName = _generateChannelName(ch);
				if (!(channelName in _channels)) {
					var initialChannelConnectRequest = {
						channelconnect: {
							consumerKey:_consumerKey,
							uID:u,
							channel:c,
							channelHash:ch
						}
					};
					_send(JSON.stringify(initialChannelConnectRequest));
					_channels[channelName] = new PP.SocketChannel(_ws, ch);
				}
				return _channels[channelName];
			}
			
			function _send(msg) {
				if(_connected) {
					_ws.send(msg);
				}
			}
			
			return {
				createChannel:function(channel, uID, channelHash) {
					return _createChannel(channel, uID, channelHash);
				},
				
				addOnConnectListener:function(listener) {
					_connectListners.push(listener);
					return this;
				},
				
				addOnDisconnectListener:function(listener) {
					_disconnectListners.push(listener);
					return this;
				}
			};
		}
    };
	
    if(!window.pplib) {window.pplib=PP;}
})();