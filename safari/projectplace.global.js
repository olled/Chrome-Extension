
/**
*
* Config
**/
var urlConfig = {
	rootURL: 'https://service.projectplace.com/pp/',
	client_access: 'client_app.cgi',
	authRequest: 'client_app_system_gateway.cgi',
	getAuthKey: 'get_auth_info',
	getNotifications: 'notifications',
	socketChannel: 'notification_channel' 
}
var localStorageKeys = {
	nrofposts: 'numberofwallposts',
	creator: 'lastpostcreator',
	userauth: 'usernameauth'
}
/**
 * Settings utility to get the Safari Settings values from the secureSettings
 */
var settings = {
	email: getSettingsValues('email'),
	pwd: getSettingsValues('pwd'),
	sendToStarPage: getSettingsValues('gotostartpage')
}

/**
* Handle calls from projectplace.endscript.js, and initialy from the settings obj initially, to get the settings values
*
**/
function getSettingsValues(key) {
    return safari.extension.secureSettings.getItem(key);
}


/**
*
* Handle the onclick of the Projectplace Toolbar button
**/
function handleProjectplaceButtonClick(event)
{
	openUpProjectplace();	
}


/**
 * Updated the settings attributes with user defined values.
 * Triggered on change in the SecureSettings property.
 * @param {EventObject} event - event object with attribute newValue
 */

function updateSettings(event)
{
	var userpwdUpdated = false;
	if(event.key == 'email')
	{
		settings.email = event.newValue;
		userpwdUpdated = true;
	}
	if(event.key == 'pwd')
	{
		settings.pwd = event.newValue;
		userpwdUpdated = true;
	}
	if(event.key == 'gotostartpage')
	{
		settings.sendToStarPage = event.newValue;
	}
	
	if(userpwdUpdated)
	{
		starSocketConnection();
	}
}


/**
 * 
 * @param {String} xmlstr - the returning XML as String.
 * @param {Int} status - the staus of the request. Not currently used!
 */
var count = 0;//TODO - save count in localsettings instead of this ugly global var.
function updateLabel(xmlstr, status)
{
	console.log(status)
	console.log(xmlstr)
	count += 1
	var xmlobject = (new DOMParser()).parseFromString(xmlstr.toString(), "text/xml");
	var notifications = $(xmlobject.getElementsByTagName('notification'));
	var titleAndCreator = new Array();
	
	var numberOfUpdates = parseInt($(xmlobject.getElementsByTagName('count')).text())
	var numberOfWallUpdates = 0;
	if(numberOfUpdates)
	{
		for(var i = 0; i < notifications.length; i++)
		{
			isWallItem = $(notifications[i].getElementsByTagName('project_wall_notification')[0].firstChild).text();
			if(isWallItem == 'True')
			{
				haveReadItem = $(notifications[i].getElementsByTagName('read')[0].firstChild).text();
				if(haveReadItem == 'False')
				{
					numberOfWallUpdates += 1;
					projectid =  $(notifications[i].getElementsByTagName('notify_obj_id')[0].firstChild).text();
					postid = $(notifications[i].getElementsByTagName('project_wall_conversation_id')[0].firstChild).text();
					postTitle = $(notifications[i].getElementsByTagName('title')[0].firstChild).text();
					postByWho = $(notifications[i].getElementsByTagName('notifier_name')[0].firstChild).text();
					
					titleAndCreator.push(projectid);
					titleAndCreator.push(postid);
					titleAndCreator.push(postTitle);
					titleAndCreator.push(postByWho);
					
				}
			}
			if(numberOfWallUpdates == numberOfUpdates)
			{
				break;
			}
		}
	}

	if(numberOfWallUpdates)
	{
	 	var currentNumberOfPosts = saveWallPostToDB(numberOfWallUpdates,titleAndCreator);
		$.each(safari.extension.toolbarItems, function(i, v) {
        	v.badge = currentNumberOfPosts;
        	v.toolTip = "You have " + currentNumberOfPosts +" unread wall posts\nLast Conversation: "+titleAndCreator[2]+ '\nby '+titleAndCreator[3];
      	});
	}
}



/**
 * resets the localstorage to none
 */
function clearConversatioData(removeUserAutData){
	if (removeUserAutData) {
		localStorage.clear();
		return true;
	}
	localStorage.removeItem(localStorageKeys.nrofposts);
	localStorage.removeItem(localStorageKeys.creator);
	
}
/*
 * Resets the toolbar badge and tooltip on login into projectplace.
 */
function resetNotifications()
{
	clearConversatioData();
	$.each(safari.extension.toolbarItems, function(i, v) {
        v.badge = 0;
        v.toolTip = "Projectplace Login";
      });
}

/**
 * 
 * @param {String} numberOfPosts found through the Projectplace API.
 * @param {Array} creatorArr contains projectid, postid,postTitle,postByWho 
 */
function saveWallPostToDB(numberOfPosts, creatorArr)
{

	var pastNumberOfPosts = (localStorage.getItem(localStorageKeys.nrofposts)) ? localStorage.getItem(localStorageKeys.nrofposts) : 0;
	
	var currentNrOfPosts = parseInt(pastNumberOfPosts) + parseInt(numberOfPosts);
	localStorage.setItem(localStorageKeys.creator, creatorArr.join(','));
	localStorage.setItem(localStorageKeys.nrofposts, currentNrOfPosts)
	return currentNrOfPosts;
	
}



/**
 * Calls resetNotification and tries to login the user.
 */
function openUpProjectplace()
{
	resetNotifications();
	postRequest(urlConfig.rootURL+urlConfig.client_access,urlConfig.getAuthKey,'', saveAuthKey);
}
/**
 * Handles all connections to Projectplace
 * @param {String} projectplaceURL - ROOT URL to projectplace
 * @param {String} operation - specific operation to call
 * @param {String} value - specific extra value to send through the API.
 * @param {Function} successHandler - the function to call on succes.
 */

function postRequest(projectplaceURL, operation, value, successHandler)
{
	
	if((settings.email == null) || (settings.pwd == null))
	{
		showSettingsError();
		return false;
	}
	
	var postValue = "op="+operation
		+ "&password="+settings.pwd
		+"&user="+settings.email
	
	if(value)
	{
		postValue += value;
	}
	$.ajax({
	   	type: "POST",
   		url: projectplaceURL,
	   	data: postValue,
   		success: successHandler
 	});	
}
/**
 * Shows an alert when missing username and/or password in setttings.
 */
function showSettingsError()
{
	alert('Missing username and/or password. \n\nPlease add username and password in \nPreferences-->Extensions-->Projectplace Login');
}

function setUserNameAndPwd(usernamePasswordAsString){
	localStorage.setItem(localStorageKeys.userauth, usernamePasswordAsString);
}

function getUserNameAndPwd(){
	
	return localStorage.getItem(localStorageKeys.userauth);
}
/**
 * Saves the authkey and logs the user in to Projectplace.
 * @param {String} userNameAuth - string with the username and auth key.
 */
function saveAuthKey(userNameAuth)
{
	setUserNameAndPwd(userNameAuth);
	var bFound = false;
	for (i in safari.application.browserWindows) {
        for (j in safari.application.browserWindows[i].tabs) {
          if (safari.application.browserWindows[i].tabs[j].url && safari.application.browserWindows[i].tabs[j].url.indexOf(urlConfig.rootURL) == 0) {
            var browserWindow = safari.application.browserWindows[i];
            
            browserWindow.activate();
            browserWindow.tabs[j].activate();
            if(settings.sendToStarPage == 'off' || !settings.sendToStarPage)
            {
            	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("check-for-frame", 'check-for-frame');
            }
            else
            {
            	browserWindow.tabs[j].url = urlConfig.rootURL+urlConfig.authRequest+'?'+getUserNameAndPwd()+'&action=startpage';
            }

            bFound = true;
            break;
          }
        }
      }
	if(!bFound)
	{
		var newTab = safari.application.activeBrowserWindow.openTab();
	    newTab.url = urlConfig.rootURL+urlConfig.authRequest+'?'+userNameAuth+'&action=startpage';
	}
}


/**
 * Function to get the specific url of a frame.
 * @param {String} frameUrl
 */
function parseProjectplaceURL(frameUrl)
{

	var bFound = false;
	var obj = '';
	if(frameUrl.indexOf('central') == -1)
	{
		if(frameUrl.indexOf('/pp/pp.cgi/0/') != -1)
		{
			obj = frameUrl.split('/pp/pp.cgi/0/')[1];
			if(obj.indexOf('?') != -1)
			{
				obj = obj.split('?')[0];
			}
		}
	}
	action = ''
	if(!obj)
	{
		action = '&action=startpage';
	}
	else
	{
		action = '&obj_id='+obj.toString()
	}
	return urlConfig.rootURL+urlConfig.authRequest+'?'+getUserNameAndPwd() +action; 
}

/**
 * Handles all calls between this script and the projectplace.endscript.js script.
 * @param {Event Object} event with message
 */
function messageListener(event) {
	if(event.name == 'framefound')
	{
		var urlToProjectplace = parseProjectplaceURL(event.message);
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("loadObject", urlToProjectplace);
	}
}

/**
 * One initial setup of the Socket
 * @param {Function} returnHandler - the function that will be called when we have a new notification
 */
function setUpSocketConnect(returnHandler){
	var consumerKey = '1748b383e717461c574bfb6d35ca3cd625e4fb18';
	var socket = new pplib.Socket(consumerKey, 'ws://pusher.projectplace.com:443');
	
	socket.addOnConnectListener(function(){
		postRequest(urlConfig.rootURL+urlConfig.client_access,urlConfig.socketChannel,'', function(data){
			var jsonObj = JSON.parse(data);
			groupChatChannel = socket.createChannel(jsonObj.channelName, jsonObj.id, jsonObj.channelHash);
			groupChatChannel.addOnMessageListener(function(data){				
				getNewNotificationsData(returnHandler);
			});
		});
	});
}

function getNewNotificationsData(returnHandler){
	postRequest(urlConfig.rootURL+urlConfig.client_access,urlConfig.getNotifications,'', returnHandler);
}

/**
 * Logs to the console
 * @param {String} msg
 */
function log(msg)
{	
	safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('message', msg);
}

/**
 * Called onload of this script if the username/password is saved.
 * Also called when a username/password is added/changed
 */
function starSocketConnection(){
	if (!((settings.email == null) || (settings.pwd == null))) {
		setUpSocketConnect(updateLabel)
	}
}

var kickStartSocketConnection = (function(){
	starSocketConnection()	
}());



safari.application.addEventListener("message", messageListener, false);
/*Listen to the onlick of the wall button*/
safari.application.addEventListener("command", handleProjectplaceButtonClick, false);
/*Listen to changes in the Settings panel*/
safari.extension.secureSettings.addEventListener("change", updateSettings, false);