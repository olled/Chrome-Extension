
TestCase("Test Configurations", {
    setUp: function() {
        
    },

    testUrlConfig: function() {
        assertEquals('https://service.projectplace.com/pp/', urlConfig.rootURL);
		
    }

});
	
TestCase("Test LocalStorage", {
    setUp: function() {
       
    },
	testClearOfWallPosts: function()
	{
		assertFalse(false);
	},
	
	testSetUserNamePwd: function()
	{
		assertEquals(1, 1);
	},
	testRemoveUserNamePwd : function()
	{
		
		assertNull(null);
	}
});
