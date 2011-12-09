/*jslint browser: true, indent:4 */
/*global views, $*/
var mainViewConfig = {
	TRENDINGBYCOMMENTS: 'trendingByComments',
	TRENDINGBYLIKES: 'trendingByLikes',
	SINGLECONVERSATION: 'singleconversation',
	CONVERSATIONS: 'allconversation',
	ALLPEOPLESVIEW: 'allpeoplesview',
	SINGLEPERSONVIEW: 'singlepersonview',
	ABOUTME: 'aboutme'
};


var singleViewActions = {
	CREATECOMMENT: 'createSingleConversationComment'
};

var mainViewNavigation = {
	_view: null,
	_goto: null,
	go: function (e) {
		mainViewNavigation._goto = e.srcElement.getAttribute('goto');
		mainViewNavigation._view = e.srcElement.getAttribute('view');
		mainViewNavigation._handleView();
	},
	_handleView: function () {
		trackGAPage(mainViewNavigation._view + ' User: ' + user.getUserLastName() );
		if (mainViewNavigation._view == mainViewConfig.SINGLECONVERSATION) {
			views.singleConversationsView(mainViewNavigation._goto);
			return false;
		}
		if (mainViewNavigation._view == mainViewConfig.CONVERSATIONS) {
			views.allConversationsView();
			return false;
		}
		if (mainViewNavigation._view == mainViewConfig.ALLPEOPLESVIEW) {
			views.allPeoplesView();
			return false;
		}
		if (mainViewNavigation._view == mainViewConfig.ABOUTME) {
			views.aboutView();
			return false;
		}
		if (mainViewNavigation._view == mainViewConfig.SINGLEPERSONVIEW) {
			views.singlePersonView(mainViewNavigation._goto);
			return false;
		}
	}
};

var singleConversation = {
	go: function (e) {
		singleConversation._target = e.srcElement.getAttribute('target');
		singleConversation._action = e.srcElement.getAttribute('action');
		singleConversation._messageContainer = e.srcElement.getAttribute('messageContainer');
		singleConversation._actionHandler(e);
	},
	_actionHandler: function (e) {
		e.srcElement.disabled = 'disabled';
		if (singleConversation._action == singleViewActions.CREATECOMMENT) {
			singleActionOnObject.postCommentOnConversation(e.srcElement,singleConversation._target, singleConversation._messageContainer);
		}
	}
};
