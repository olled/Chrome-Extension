
/*jslint browser: true, indent:4 */
/*global ProjectplaceViewController, chrome, ChromeExOAuth, CONFIG, window, user */


var ViewController = ProjectplaceViewController;

/**
 * Set up oauth communication/object
 */

var oauth = ChromeExOAuth.initBackgroundPage({
	'request_url': CONFIG.BASEURL + '/initiate',
	'authorize_url': CONFIG.BASEURL + '/authorize',
	'access_url': CONFIG.BASEURL + '/token',
	'consumer_key': CONFIG.OAUTH.CONSUMERKEY,
	'consumer_secret': CONFIG.OAUTH.CONSUMERSECRET,
	'scope': CONFIG.LOCALSTORAGEKEY,
	'app_name': CONFIG.APPNAME
});

/**

* A reference to the interval controller that checks for updates
=======
* A refrence to the interval controller that checks for updates

*/
var interValController = null;

/**
* Called from injected.js when the oauth process have been verified.
* Only called from https://service.projectplace.com/domBlank.html
*	- Closes the oauth request tab down, and calls the init method to get the data.
*/

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request.target) {
			oauth.getAccessToken(request.oauthToken, request.oauthVerifier, function () {
				chrome.tabs.getSelected(null, function (tab) {
					chrome.tabs.remove(tab.id);
				});
				ViewController.loadDataInitialView();
				
				interValController = window.setInterval(intervalCallForUpdates, 30000);
			});
			return false;
        }
});




/**
 * Called when the initial authorization have been done.
 * @param {Object} oauthToken
 * @param {Object} oauthVerifier
 */
function onAuthorized(oauthToken, oauthVerifier)
{
	ViewController.loadDataInitialView();
	interValController = window.setInterval(intervalCallForUpdates, 30000);
}
oauth.authorize(onAuthorized);

/**
 * Return the set ViewController object.
 */
function getViewControll() {
	return ViewController;
}
/**
 * Called on interval to get new conversations 
 */
function intervalCallForUpdates() {

	//console.log('...and here comes the update')
	//getViewControll().user.updateConversations();	
}

