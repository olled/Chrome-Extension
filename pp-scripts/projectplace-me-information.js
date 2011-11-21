/**
 * @description Create the logged in user object 
 * @constructor
 * @param {Object} jsonText - raw jsontext gotten through the api
 */
function UserInfo(jsonText){
	
	var _json = JSON.parse(jsonText);
	this.userid = _json.id;
	this.userKey = this.userid + '-user-json';
	this.userConvKey = this.userid + '-user-conv';
	this.userProjects = this.userid + '-projects';
	this.userTrendingConv = '-trending-conv';
	this.userCoworkers = this.userid +'-coworkers';
	this._saveOldConversations();
	this.saveUserJSON(_json);
}

/**
 * Returns the user full name
 */
UserInfo.prototype.getUserName = function(){
	return this.getJSONValue(this.userKey, ['first_name', 'last_name'], ' ');
};

/**
 * Saves the user information(json string) to local storage.
 * @param {Object} _json - The JSON string as text
 */
UserInfo.prototype.saveUserJSON = function(_json){
	localStorage[this.userKey] = JSON.stringify(_json);
};

/**
 * Saves all the ids/names of the users projects
 * @param {Object} projects - jsonObject
 */
UserInfo.prototype.saveProjects = function(projects){
	localStorage[this.userProjects] = JSON.stringify(projects);
};

/**
 * Save all coworkers for user.
 * @param {Object} coworkers - JSON Object with all coworkers in all projects
 */
UserInfo.prototype.saveCoworkers = function(coworkers){
	localStorage[this.userCoworkers] = JSON.stringify(coworkers);
};

/**
 * Returns all coworkers from localstorage.
 */
UserInfo.prototype.getCoworkers = function(){
	return JSON.parse(localStorage[this.userCoworkers]);
};

/**
 * Returns the JSON Object of a specific user with id matching value.
 * @param {Object} value - The value to search for in the Coworker JSON Object
 */
UserInfo.prototype.getSpecificCoWorker = function(value){
	
	var coWorkers = this.getJSONValue(this.userCoworkers);
	for(var coworker in coWorkers) {
		if(coWorkers[coworker].id == value){
			return coWorkers[coworker];	
		}
	}
	
	
	if(this.userid == value){
		return this.getJSONValue(this.userKey);
	}
	return null;
};

/**
 * Returns a single project as a JSON object
 * @param {Object} projectId - The project id to get
 */
UserInfo.prototype.getSpecificProject = function(projectId){
	var projects = this.getJSONValue(this.userProjects);
	for(var project in projects) {
		if(projects[project].id == projectId){
			return projects[project];	
		}
	}
	return null;
};
/**
 * Called on init(on start of browser) to clear all the conversatsions data saved on client.
 *
 */
UserInfo.prototype._saveOldConversations = function(){
	var c = localStorage[this.userConvKey];
	if (c) {
		localStorage['-old' + this.userConvKey] = c;
		localStorage.removeItem(this.userConvKey);
	} 
};

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
			var saved = JSON.stringify(savedConversations);
			saved = saved.replace(findBeginingOfString, '');
			saved = saved.replace(findEndOfString, '');
			jsonText = '['+saved +','+ jsonText +']';
		}
		else{
			jsonText = '['+jsonText +']';
		}
		
		localStorage[this.userConvKey] = jsonText;
	}
};

/**
 * Returns all conversations for user or project(projectId)
 * @param {Object} projectId -  Not manadatory, if submitted only return conversation for 
 *								specific project.
 */
UserInfo.prototype.getConversations = function(projectId){
	if(!projectId){
		try {
			return this.getJSONValue(this.userConvKey);
		}
		catch(e){return null;}
	}
	else{
		throw new Error('Not done!!!! Add get specific project conversation');
	}
};

/**
 * Returns the conversations object id that have the highest post_count attribute
 */
UserInfo.prototype.getTrendingConversationOnCommentsId = function(){
	
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
	
};
/**
 * Returns the conversations object id that have the highest nr of likes
 */
UserInfo.prototype.getTrendingConversationOnLikesId = function(){
	
	var highestCount, currentCount = 0;
	var conversationsObject = null;
	var conversations = this.getConversations();
	
	
	for (var i = 0; i < conversations.length; i++)
	{
		if (conversations[i].liked_by) {
			currentCount = 0;
			for(var like in conversations[i].liked_by){
				currentCount++;
			}
			currentCount++; // due to start at 0.
			if (currentCount > highestCount) {
				highestCount = currentCount;
				conversationsObject = conversations[i];
			}
		}
	}
	
	return (conversationsObject ?conversationsObject.id : null);
	
};
/**
 * Save the Trending Conversation to the localstorage
 * @param {Object} convId - the specific id of the conversation to save
 */
UserInfo.prototype.setTrendingConversationObject = function(convId){
	var apiCall = new ProjectplaceAPICall();
	apiCall.specificConversation(convId, function(t, xhr){
		localStorage['-trending-conv'] = t;		
	});
};
/**
 * Return the Trending Conversation, the conversation in all projects that
 * has the highest number of comments.
 */
UserInfo.prototype.getTrendingConversation = function(){
	return JSON.parse(localStorage[this.userTrendingConv]);
};

/**
 * Compares the dates between the saved conversations and the newly gotten and returns the 
 * number of new items found..
 */
UserInfo.prototype.getNewConversationsCount = function(){
	var oldHighestDate = 0;
	var numberOfNewPosts = 0;
	
	if(!localStorage['-old'+ this.userConvKey]){
		return 0;
	}
	var oldUserConversations = this.getJSONValue('-old'+ this.userConvKey);
	var newUserConversations = this.getJSONValue(this.userConvKey);
	
	
	for (var i = 0; i < oldUserConversations.length; i++) {
	
		if (oldHighestDate < oldUserConversations[i].last_post_time) {
			oldHighestDate = oldUserConversations[i].last_post_time;
		}
	}
	
	for(var j = 0; i < newUserConversations.length; j++){
		if (oldHighestDate < newUserConversations[j].last_post_time){
			numberOfNewPosts++;
		}
	}
	
	if (numberOfNewPosts) {
		setNewBadge(numberOfNewPosts)
	}
	return numberOfNewPosts;
};
/**
 * Return the four newest conversations by date
 */
UserInfo.prototype.getTopFourConversationsByDate = function(){
	var topFourConv = [];
	var allConv = this.getJSONValue(this.userConvKey);
	allConv.sort(sort_by('last_post_time', true, parseInt));
	
	topFourConv.push(allConv[0]);
	topFourConv.push(allConv[1]);
	topFourConv.push(allConv[2]);
	topFourConv.push(allConv[3]);
	
	return topFourConv;
};

/**
 * Gets a specific conversations without any comments from localstorage.
 * Must be called after all the conversions have been save though .setConversations()
 * @param {Object} convId - the specific id of the conversation to save
 */
UserInfo.prototype.getSpecificConversation = function(convId, callback){
	
	var allConversations = this.getConversations();
	for(var conv in allConversations){
		if(allConversations[conv].id == convId){
			callback(allConversations[conv]);
			break;
		}
	}
};


/**
 * Gets a specific conversations comments from the API.
 * @param {Object} convId - the specific id of the conversation to save
 */
UserInfo.prototype.getSpecificConversationComments = function(convId, callback){
	var apiCall = new ProjectplaceAPICall();
	apiCall.specificConversation(convId, callback);
};
/**
 * Gets a specific users conversations .
 * @param {Number} userId - the id of a user
 * @param {Function} callback - the callback function
 */
UserInfo.prototype.getConversationsForSpecificUser = function(userId, callback){
	var conversations = this.getConversations();
	var userConversations = [];
	
	for(var i = 0; i < conversations.length; i++){
		if(conversations[i].posts[0].author_id == userId){
			userConversations.push(conversations[i]);	
		}
	}
	callback(userConversations);
};
/**
 * Gets a specific coworkers image url
 * @param {Number} userid - the specific id of the user to get
 */
UserInfo.prototype.getUserImageHref = function(userid, callback){
	var apiCall = new ProjectplaceAPICall();
	apiCall.getUserImageHref(userid, callback);
};



/**
 * Returns the values of key from saved JSON Object(jsonKey), if no key we return the complete JSON Object.
 * @param {Object} jsonKey - the key in localstorage
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
			for(var j in JSONOBJ){				
				if (j == key) {
					return JSONOBJ[j]; 
				}	
			}
		}
		throw new Error('Key not of string or Array');
	}
	else{ 
		return JSONOBJ;
	}	
};
