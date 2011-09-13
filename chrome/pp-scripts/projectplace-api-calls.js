/**
 * Class handling all call to Projectplace
 * 
 * Used from projectplace-view-controller.js
 */
function ProjectplaceAPICall(){
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
ProjectplaceAPICall.prototype.Send = function(call, callback, method){
	var url = call;
	var request = {
		'method': (method?method:'GET')
	};
	oauth.sendSignedRequest(url, callback, request);
}

/**
 * Get all the users Projects  
 * @param {Object} callback - specific callback function to handle the result
 */
ProjectplaceAPICall.prototype.getMyProjects = function(callback){
	this.Send(APICALLS.USER.ME.GETMYPROJECTS,callback);
	return this
}


/**
 * Get a specific users profile  
 * @param {Object} callback - specific callback function to handle the result
 */
ProjectplaceAPICall.prototype.getMyProfile = function(callback){
	this.Send(APICALLS.USER.ME.GETMYPROFILE,callback);
	return this
}

ProjectplaceAPICall.prototype.getMyFavoriteProjects = function(callback){
	
	this.Send(APICALLS.USER.ME.GETMYFAVORITEPROJECTS, callback)
	return this;
}

/**
 * Get projects conversations  
 * @param {Object} callback - specific callback function to handle the result
 * @param {String} projectId - specific project id.
 */
ProjectplaceAPICall.prototype.projectConversations = function(projectId, callback){
	this.Send(APICALLS.PROJECTS.CONVERSATIONS.replace('PROJECT_ID', projectId),callback);
	return this
}
