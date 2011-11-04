
TestCase("Test Configurations", {
    setUp: function() {
        
    },

    testBaseUrlConfig: function() {
        assertEquals('https://api.projectplace.com', CONFIG.BASEURL);
    },
	testApiUrlCinfig: function(){
		assertEquals('https://api.projectplace.com/1', CONFIG.APIURL);
	}
});
	
TestCase("Test LocalStorage", {
    setUp: function() {
       
    }
});
