
var mainViewConfig = {
	TRENDINGBYCOMMENTS: 'trendingByComments',
	TRENDINGBYLIKES: 'trendingByLikes',
	SINGLECONVERSATION: 'singleconversation',
	CONVERSATIONS: 'allconversation',
	ALLPEOPLESVIEW: 'allpeoplesview',
	ABOUTME: 'aboutme'	
}

var mainViewNavigation = {
	_view: null,
	_goto: null,
	go: function(e){
		mainViewNavigation._goto = e.srcElement.getAttribute('goto');
		mainViewNavigation._view = e.srcElement.getAttribute('view');
		mainViewNavigation._handleView();
	},
	_handleView: function(){
		
		if(mainViewNavigation._view == mainViewConfig.SINGLECONVERSATION){
			views.singleConversationsView(mainViewNavigation._goto);
			return false;
		}
		if(mainViewNavigation._view == mainViewConfig.CONVERSATIONS){
			views.allConversationsView();
			return false;
		}
		if(mainViewNavigation._view == mainViewConfig.ALLPEOPLESVIEW){
			views.allPeoplesView();
			return false;
		}
		if(mainViewNavigation._view == mainViewConfig.ABOUTME){
			views.aboutView();
			return false;
		}
		
	}
}

var singleConversation = {}
