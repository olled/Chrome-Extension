var safari = null;
settings = {
			email: '',
			pwd: '',
			sendToStarPage: ''
		}
TestCase("Test Configurations", {
    setUp: function() {
        safari = new Object();
		
		safari.application = new Object();
		safari.extension = new Object();
		safari.application.addEventListener = function(){};
		localStorage.clear();
    },

    testUrlConfig: function() {
        assertEquals('https://service.projectplace.com/pp/', urlConfig.rootURL);
		assertEquals('client_app.cgi', urlConfig.client_access);
    },

	testProjectplaceFrameUrl: function(){
		setUserNameAndPwd('test');
		var startpageURL = parseProjectplaceURL('https://service.projectplace.com/pp/pp.cgi/0/800?op=central&tab=overview');
		var startpageExpected = 'https://service.projectplace.com/pp/client_app_system_gateway.cgi?test&action=startpage';
		assertEquals(startpageExpected, startpageURL);
		
		var projectpageURL = parseProjectplaceURL('https://service.projectplace.com/pp/pp.cgi/0/800');
		var projectpageExpected = 'https://service.projectplace.com/pp/client_app_system_gateway.cgi?test&obj_id=800';
		assertEquals(projectpageExpected, projectpageURL);
		
		var strangepageURL = parseProjectplaceURL('https://service.projectplace.com/pp/pp.cgi/800');
		var strangepageExpected = 'https://service.projectplace.com/pp/client_app_system_gateway.cgi?test&action=startpage';
		assertEquals(strangepageExpected, strangepageURL);
	
		var loginUrl = parseProjectplaceURL('https://service.projectplace.com/pp/loginpage.cgi?lang=swedish');
		var loginUrlExpected = 'https://service.projectplace.com/pp/client_app_system_gateway.cgi?test&action=startpage';
		assertEquals(loginUrlExpected, loginUrl);
		
		var betterSafeThenSorryUrl = parseProjectplaceURL('http://dn.se');
		var betterSafeThenSorryExpected = 'https://service.projectplace.com/pp/client_app_system_gateway.cgi?test&action=startpage';
		assertEquals(betterSafeThenSorryExpected, betterSafeThenSorryUrl);
		
		
}});
	
TestCase("Test LocalStorage", {
    setUp: function() {
        safari = new Object();
		
		safari.application = new Object();
		safari.extension = new Object();
		safari.application.addEventListener = function(){};
		localStorage.clear();
    },
	testSaveOfWallPosts: function()
	{
		var projectId = 12;
		var postId = 122;
		var postTitle = 'the title of a post \o/';
		var postByWho = 'Olle Dahlstrom';
		
		var nrOfWallPosts = 2;
		
		var currentNrOfPosts = saveWallPostToDB(nrOfWallPosts,new Array(projectId, postId, postTitle, postByWho));
		assertEquals(currentNrOfPosts, localStorage.getItem('numberofwallposts'))
		assertEquals(nrOfWallPosts, localStorage.getItem('numberofwallposts'));
	},
	testClearOfWallPosts: function()
	{
		var projectId = 100;
		var postId = 200;
		var postTitle = 'the title of a post';
		var postByWho = 'Olle Dahlstrom';
		
		var nrOfWallPosts = 2;
		
		var currentNrOfPosts = saveWallPostToDB(nrOfWallPosts,new Array(projectId, postId, postTitle, postByWho));
		assertEquals(currentNrOfPosts, localStorage.getItem('numberofwallposts'));
		assertEquals(new Array(projectId, postId, postTitle, postByWho).toString(), localStorage.getItem('lastpostcreator'));
		clearConversatioData();
		
		assertNull(localStorage.getItem('numberofwallposts'));
		assertNull(localStorage.getItem('lastpostcreator'));
	},
	
	testSetUserNamePwd: function()
	{
		var localUserNamePwd = 'user=olle&auth=123';
		setUserNameAndPwd(localUserNamePwd);
		assertEquals(localUserNamePwd, getUserNameAndPwd());
	},
	testRemoveUserNamePwd : function()
	{
		var localUserNamePwd = 'user=olle&auth=123';
		setUserNameAndPwd(localUserNamePwd);
		assertEquals('user=olle&auth=123', getUserNameAndPwd());
		clearConversatioData();
		assertEquals('user=olle&auth=123', getUserNameAndPwd());
		
		clearConversatioData(true);
		assertNull(getUserNameAndPwd());
	}
});
