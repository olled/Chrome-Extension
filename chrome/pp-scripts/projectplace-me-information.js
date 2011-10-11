/**
 * Constructor
 * @param {Object} jsonText - raw jsontext gotten through the api
 */
function UserInfo(jsonText){
	
	var _json = JSON.parse(jsonText);
	this.userid = _json.id;
	this.userKey = this.userid + '-user-json';
	this.userConvKey = this.userid + '-user-conv';
	this.userProjects = this.userid + '-projects';
	this.userTrendingConv = '-trending-conv';
	this._clearConversationsCache();
	this.saveUserJSON(_json);
}

/**
 * Returns the user full name
 */
UserInfo.prototype.getUserName = function(){
	return this.getJSONValue(this.userKey, ['first_name', 'last_name'], ' ')
	//For tests
	//this.getJSONValue(['first_name', 'last_name'], ' ')
	//this.getJSONValue('last_name')
}

/**
 * Saves the user information(json string) to local storage.
 * @param {Object} _json - The JSON string as text
 */
UserInfo.prototype.saveUserJSON = function(_json){
	localStorage[this.userKey] = JSON.stringify(_json);
}


UserInfo.prototype.setProject = function(projects){
	localStorage[this.userProjects] = JSON.stringify(projects);
}

/**
 * Called on init(on start of browser) to clear all the conversatsions data saved on client.
 *
 */
UserInfo.prototype._clearConversationsCache = function(){
	localStorage.removeItem(this.userConvKey);
}
/**
 * Saves all conversations with the key this.userConvKey. 
 * Clear the saved data with _clearConversatsionCache
 * @param {Object} jsonText - a specific projects conversations as json in text format.
 */

UserInfo.prototype.setConversations = function(jsonText){
	var savedConversations = this.getConversations();
	if (jsonText.indexOf('{') != -1) {
		
		var findBeginingOfString = /^\[/;
		var findEndOfString = /\]$/;
		jsonText = jsonText.replace(findBeginingOfString, '');
		jsonText = jsonText.replace(findEndOfString, '');
		
		if (savedConversations) {
			saved = JSON.stringify(savedConversations);
			saved = saved.replace(findBeginingOfString, '');
			saved = saved.replace(findEndOfString, '');
			jsonText = '['+saved +','+ jsonText +']';
		}
		else{
			jsonText = '['+jsonText +']';
		}
		
		localStorage[this.userConvKey] = jsonText;
	}
}

/**
 * Returns all conversations for user or project(projectId)
 * @param {Object} projectId -  Not manadatory, if submitted only return conversatsion for 
 * 								specific project.
 */
UserInfo.prototype.getConversations = function(projectId){
	if(!projectId){
		try {
			return this.getJSONValue(this.userConvKey);
		}
		catch(e){return null}
	}
	else{
		throw new Error('Not done!!!! Add get specific project conversation')
	}
}
/**
 * Returns the conversations object that have the highest post_count attribute
 */
UserInfo.prototype.getTrendingConversationId = function(){
	
	var highestCount = 0;
	var conversationsObject = null;
	var conversations = this.getConversations();
	for (var i = 0; i < conversations.length; i++)
	{
		if(conversations[i].post_count > highestCount){
			highestCount = conversations[i].post_count; 
			conversationsObject = conversations[i];
		}
	}
	
	return (conversationsObject ?conversationsObject.id : null);
	
}
UserInfo.prototype.getTrendingConversationObject = function(convId){
	var apiCall = new ProjectplaceAPICall();
	apiCall.specificConversation(convId, function(t, xhr){
		localStorage['-trending-conv'] = t;		
	});
}
UserInfo.prototype.getTrendingConversation = function(){
	
	return JSON.parse(localStorage[this.userTrendingConv]);
}



/**
 * Returns the values of key from saved JSON Object(jsonKey), if no key we return the complete JSON Object.
 * @param {Object} key - can be empty, string or Array.
 * @param {Object} seperator - Can be empty or specific character to separate values with(Only used when Array 
 * 							   is sent as key)
 */
UserInfo.prototype.getJSONValue = function(jsonKey, key, seperator){
	var JSONOBJ = JSON.parse(localStorage[jsonKey]);
	
	if(key){
		if(typeof key === 'object'){
			var savedFind = [];
			var i = 0;
			for(i in key){
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
		throw new Error('Key not of string or Array');
	}
	else{ 
		return JSONOBJ;
	}	
}
