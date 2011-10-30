var CONFIG = {
	BASEURL: 'https://api.projectplace.com',
	APIURL: 'https://api.projectplace.com/1',
	OAUTH: {
		CONSUMERKEY: 'YOURKEY',
		CONSUMERSECRET : 'YOURSECRET'
	},
	LOCALSTORAGEKEY: 'https://api.projectplace.com/1',
	APPNAME: 'Projectplace for Chrome'
}

var APICALLS = {
	USER: {
		ME: {
			GETMYPROJECTS: 			CONFIG.APIURL+'/user/me/projects.json',
			GETMYFAVORITEPROJECTS: 	CONFIG.APIURL +'/user/me/favorite-projects.json',
			GETMYPROFILE:  			CONFIG.APIURL+'/user/me/profile.json',
			GETMYCOWORKERS:			CONFIG.APIURL+'/user/me/coworkers.json'
		  }
	},
	PROJECTS:{
		CONVERSATIONS: CONFIG.APIURL+'/project/PROJECT_ID/conversations.json'
		
	},
	CONVERSATIONS: {
		SPECIFICCONVERSATION: CONFIG.APIURL+'/conversation/CONVERSATION_ID/posts.json'
		
	}
}

