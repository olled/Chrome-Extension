 /**
 * Holds the views of the extension
 * Heavy use of the class ProjectplaceAPICall found in projectplace-api.calls.js
 */
var PPAPI = new ProjectplaceAPICall();

 /**
  * ProjectplaceViewController - gets the data needed for the different views
  * 	Currently
  * 	* loadInitialView == Loads the initial data needed, project info, conversations from all projects, user info.
  * 	
  */
 var ProjectplaceViewController = {
 	totalNewPosts: 0,
	user:null,
	
	/**
	 * Loads all the data that is needed in the Main Conversations view
	 * @param {Object} callBack callback function, if any
	 */
	loadDataInitialView: function(callBack){
		
		/**
		 * Get the logged in users profile.
		 * 
		 * @param {Object} text - JSONTEXT
		 * @param {Object} xhr - XHR Object
		 */
		PPAPI.getMyProfile(function(text, xhr){
			ProjectplaceViewController.user = new UserInfo(text);
		});
		
		/**
		 * Gets the data for all User projects.
		 * Gets top 50 conversations for all projects ordered by last modified.
		 * @param {Object} txt - json text
		 * @param {Object} xhr - the xhr object
		 */
		PPAPI.getMyProjects(function(text, xhr){
			var projects = JSON.parse(text);
			ProjectplaceViewController.user.saveProjects(projects);
			for (var i = 0; i < projects.length; i++) {
				PPAPI.projectConversations(projects[i].id,function(t, xhr){
					ProjectplaceViewController.user.setConversations(t);
				}
				);
			}
		});
		/**
		 * Get all coworkers for logged in user
		 * @param {Object} text - JSONText
		 * @param {Object} xhr - xhr object
		 */
		PPAPI.getMyCoWorkers(function(text,xhr){
			var coworkers = JSON.parse(text);
			ProjectplaceViewController.user.saveCoworkers(coworkers);
			
		});		
	}
 }
