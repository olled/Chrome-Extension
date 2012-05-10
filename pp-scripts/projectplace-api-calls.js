/*jslint browser: true, indent:4 */
/*global oauth, APICALLS, localStorage, CONFIG */

/**
 * @description Class handling all call to Projectplace.
 * @constructor
 */

function ProjectplaceAPICall() {
	return this;
}

/**
 * Interface to the oauth.sendSignedRequest found in chrome_ex_oauth.js
 * The variable oauth is set in background.html
 * 
 * @param {Object} call - The API URL to call
 * @param {Object} callback - The callback function to call after loading data.
 * @param {Object} method - GET/POST
 */
ProjectplaceAPICall.prototype.Send = function (call, callback, method, message) {
	var url = call;
	var request = {
		'method': (method ? method:'GET'),
		'parameters':  (message ? message:''),
		'headers': {'Content-Type' : 'application/x-www-form-urlencoded'} 
	};
	return oauth.sendSignedRequest(url, callback, request);
};

/**
 * Get a specific users profile  
 * @param {Object} callback - specific callback function to handle the result
 */
ProjectplaceAPICall.prototype.getMyProfile = function (callback) {
	this.Send(APICALLS.USER.ME.GETMYPROFILE, callback);
	return this;
};

/**
 * Get all the users Projects  
 * @param {Object} callback - specific callback function to handle the result
 */
ProjectplaceAPICall.prototype.getMyProjects = function (callback) {
	this.Send(APICALLS.USER.ME.GETMYPROJECTS, callback);
	return this;
};

/**
 * Get the users favorite projects  
 * @param {Object} callback - specific callback function to handle the result
 */
ProjectplaceAPICall.prototype.getMyFavoriteProjects = function (callback) {
	this.Send(APICALLS.USER.ME.GETMYFAVORITEPROJECTS, callback);
	return this;
};
/**
 * @description Get's all the coworkers for the logged in user.
 * @param {Object} callback - the callback function for the result.
 */

ProjectplaceAPICall.prototype.getMyCoWorkers = function (callback) {
	this.Send(APICALLS.USER.ME.GETMYCOWORKERS, callback);
	return this;
};
/**
 * Get projects conversations  
 * @param {Object} callback - specific callback function to handle the result
 * @param {String} projectId - specific project id.
 */
ProjectplaceAPICall.prototype.projectConversations = function (projectId, callback, _time) {
	var message = {};
	console.log(_time);
	if (_time) {
		message = {'newer_than': _time};
	}

	this.Send(APICALLS.PROJECTS.CONVERSATIONS.replace('PROJECT_ID', projectId), callback, 'GET', message);
	return this;
};

/**
 * Get specific conversation  
 * @param {Object} callback - specific callback function to handle the result
 * @param {String} projectId - specific conversation id.
 */
ProjectplaceAPICall.prototype.getSpecificConversation = function (conversationId, callback) {
	return this.Send(APICALLS.CONVERSATIONS.GETSPECIFICCONVERSATION.replace('CONVERSATION_ID', conversationId), callback);
};

/**
 * @param {Number} conversationId - The id of the specific conversation to add a comment to
 * @param {String} message - The text to be sent as comment
 * @param {Object} callback - The callback function after Post 
 */
ProjectplaceAPICall.prototype.newSpecificConversationComment = function (conversationId, message, callback) {
	var params = 'text=' + message;  
	return this.Send(APICALLS.CONVERSATIONS.NEWSPECIFICCONVERSATIONSCOMMENT.replace('CONVERSATION_ID', conversationId), callback, 'post', params);
};


/**
 * Get user image href
 * @param {Object} callback - specific callback function to handle the result
 * @param {String} userid - specific user id.
 */
ProjectplaceAPICall.prototype.getUserImageHref = function (userid, callback) {
	var accessToken = localStorage['oauth_token' + CONFIG.APIURL];
	callback(APICALLS.USER.USERS.USERIMAGE.replace('USER_ID', userid).replace('ACCESS_TOKEN', accessToken));
};

