/*jslint indent: 4*/
/*global TestCase, assertEquals, CONFIG, toLocaleDateString */
TestCase("Test Configurations", {
    setUp: function () {

    },

    testBaseUrlConfig: function () {
        assertEquals('https://api.projectplace.com', CONFIG.BASEURL);
    },
	testApiUrlCinfig: function () {
		assertEquals('https://api.projectplace.com/1', CONFIG.APIURL);
	},
    tearDown: function () {
    }
});
	
TestCase("Projectplace Utils", {
    setUp: function () {
    },
    testMilliSecToDate: function () {
		//assertEquals('Monday, April 16, 2012', toLocaleDateString(1234562));
    }
});
