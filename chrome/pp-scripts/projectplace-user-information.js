/**
 * Constructor
 * @param {Object} jsonText - raw jsontext gotten through the api
 */
function UserInfo(jsonText){
	this.localKey = 'pp-user-json';
	this.saveJSON(JSON.parse(jsonText));
}

/**
 * Returns the user full name
 */
UserInfo.prototype.getUserName = function(){
	return this.getJSONValue(['first_name', 'last_name'], ' ')
	//For tests
	//this.getJSONValue(['first_name', 'last_name'], ' ')
	//this.getJSONValue('last_name')
}

/**
 * Saves the user information(json string) to local storage.
 * @param {Object} _json - The jsonstring as text
 */
UserInfo.prototype.saveJSON = function(_json){
	localStorage[this.localKey] = JSON.stringify(_json);;
}

/**
 * Returns the values of key from saved JSON Object, if no key we return the complete JSON Object.
 * @param {Object} key - can be empty, string or Array.
 * @param {Object} seperator - Can be empty of specific character to separate values with. Used when Array 
 * 							   is sent as key 
 */
UserInfo.prototype.getJSONValue = function(key, seperator){
	var JSONOBJ = JSON.parse(localStorage[this.localKey]); 
	if(key){
		
		if(typeof key === 'object'){
			var savedFind = [];
			var i = 0;
			for(i;i<key.length; i++){
				for(var j in JSONOBJ){				
					if (j == key[i]) {
						savedFind.push(JSONOBJ[j]); 
					}
				
				}
			}
			return savedFind.join(seperator);
			
		}
		else if(typeof key === 'string'){
			for(var i in JSONOBJ){				
				if (i == key) {
					return JSONOBJ[i]; 
				}	
			}
		}
		throw 'Key not of string or Array';
	}
	else{ 
		return JSONOBJ;
	}	
}