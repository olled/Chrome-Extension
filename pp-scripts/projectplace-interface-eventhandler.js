var mainViewConfig = {
	TRENDINGBYCOMMENTS: 'trendingByComments',
	TRENDINGBYLIKES: 'trendingByLikes',
	SINGLECONVERSATION: 'singleconversation'	
}
var mainView = {
	_view: null,
	_goto: null,
	go: function(e){
		mainView._goto = e.srcElement.getAttribute('goto');
		mainView._view = e.srcElement.getAttribute('view');
		mainView._handleView();
	},
	_handleView: function(){
		if(mainView._view == mainViewConfig.SINGLECONVERSATION){
			console.log('single conversation view')
		}
	}
}

var singleConversation = {}
