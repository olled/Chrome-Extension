 /**
 * Holds the views of the extension
 * Heavy use of the class ProjectplaceAPICall found in projectplace-api.calls.js
 */
var PPAPI = new ProjectplaceAPICall();

 
 /**
  * Constructor
  */
 function ProjectplaceViewController(){
	return this;
 }

/**
 * Creates the initial view
 * @param {Object} callBack callback function, if any
 */
 ProjectplaceViewController.prototype.loadInitialView = function(callBack){
	
	PPAPI.getMyProfile(function(text, xhr){
		var userInfo = new UserInfo(text);
		userInfo.getUserName()
		
	});
	
	PPAPI.getMyProjects(function(text, xhr){
		var projects = JSON.parse(text);
		for (var i = 0; i < projects.length; i++) {
			PPAPI.projectConversations(projects[i].id, function(text, xhr){
				//console.log(text)
			});
		}
	});
	
	
	
 }

