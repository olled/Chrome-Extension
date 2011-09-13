var CONFIG = {
	BASEURL: 'https://api.projectplace.com',
	APIURL: 'https://api.projectplace.com/1',
	OAUTH: {
		CONSUMERKEY: 'a5398f2cdfb161f5788b261350068fbc',
		CONSUMERSECRET : '76b3226ccb9a17925fae34a631fc28110f8f90d5'
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
		
	}
}

