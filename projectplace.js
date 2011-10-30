/*
Config and settings
*/
var urlConfig = {
	rootURL: 'https://service.projectplace.com/pp/',
	client_access: 'client_app.cgi',
	authRequest: 'client_app_system_gateway.cgi',
	getAuthKey: 'get_auth_info',
	getNotifications: 'notifications'
}

function getSettingsValues(key){
	return localStorage[key];
}

function showSettingsError(typeOfErr)
{
	var errorHeading = 'We have some problems..';
	var errorTxt = 'We are having some problems connecting to Projectplace! Please check that your username and password is correct.'
	
	if(typeOfErr == 'options-error')
	{
		var errorHeading = 'Missing options';
		var errorTxt = 'Please check the options page for the Projectplace Extension and add your username and password... Thanks.'
	
	}
	var notification = webkitNotifications.createNotification(
  		'Icon-48.png',  
  		errorHeading,
  		errorTxt
	);

	notification.show();

}

function errorHandler(obj,errtype, errtext)
{
	showSettingsError('no-connection');	
}

function postRequest(projectplaceURL, operation, value, successHandler)
{

	if((!getSettingsValues('email')) || (!getSettingsValues('pwd')))
	{
		showSettingsError('options-error');
		return false;
	}
	
	var postValue = "op="+operation
		+ "&password="+getSettingsValues('pwd')
		+"&user="+getSettingsValues('email')
	if(value)
		postValue += value;
	$.ajax({
	   	type: "POST",
   		url: projectplaceURL,
	   	data: postValue,
   		success: successHandler,
   		error: errorHandler
 	});
	
}


var count = 0;
function updateLabel(xmlstr, status)
{
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
	 	showSaveWallPostToDB(numberOfWallUpdates,titleAndCreator);
	}
}

function showSaveWallPostToDB(numberOfPosts, creatorArr)
{

	var pastNumberOfPosts = (localStorage['numberofwallposts']) ? localStorage['numberofwallposts'] : 0;
	var pastPostCreators = (localStorage['wallpostcreators']) ? localStorage['wallpostcreators'] : '';
	localStorage["lastpostcreator"] = creatorArr.join(',')

	
	var currentNumberOfPosts = parseInt(pastNumberOfPosts) + parseInt(numberOfPosts);
	localStorage['numberofwallposts'] = currentNumberOfPosts;
	
	chrome.browserAction.setBadgeText({ text: currentNumberOfPosts.toString()});
	chrome.browserAction.setTitle({title: "You have " + currentNumberOfPosts +" unread wall posts\nLast Conversation: "+creatorArr[2]+ "\nby "+creatorArr[3]})
	
	
	
	/*$.each(safari.extension.toolbarItems, function(i, v) {
        v.toolTip = "You have " + currentNumberOfPosts +" unread wall posts\nLast Conversation: "+creatorArr[2]+ '\nby '+creatorArr[3];
      });*/
}




function checkForNotifications(){

	if(getSettingsValues('checkfornotification') == 'true')
	{
		if((getSettingsValues('email')) && (getSettingsValues('pwd')))
		{
			postRequest(urlConfig.rootURL+urlConfig.client_access,urlConfig.getNotifications,'', updateLabel);
		}
	}
	else
	{
		clearInterval(interVallId);
	
	}
}

var interVallId = null;
function setIntervalCheck()
{
	checkForNotifications()
	interVallId = setInterval('checkForNotifications()', 30000);//120000
	

}
setIntervalCheck()



var userNameAndAuthKey = null;
function saveAuthKey(userNameAuth)
{
	userNameAndAuthKey = userNameAuth;
	if(!userNameAndAuthKey)
	{
		return errorHandler('no-connection')
	}
	chrome.tabs.getAllInWindow(null, checkAllFramesLoadProjectplace) 
}

function checkAllFramesLoadProjectplace(tabsArr)
{
	var bFound = false;
	var activeTab = null;

	for(var i = 0; i < tabsArr.length; i++)
	{
		var tabUrl = tabsArr[i].url
		if(tabUrl.indexOf(urlConfig.rootURL) != -1)
		{
				bFound = true;
				activeTab = tabsArr[i];
				break;
		}
	}
	if(!bFound)
	{
		chrome.tabs.create({'url': urlConfig.rootURL+urlConfig.authRequest+'?'+userNameAndAuthKey+'&action=startpage'}, function(tab) {});
	}
	else
	{		
		chrome.tabs.executeScript(activeTab.id, { code: "getSpecificFrame()" });
	}
	
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request.target) {
            switch (request.target) {
                case "getConfigUrl": sendResponse({ ConfigURL: urlConfig.rootURL+urlConfig.authRequest+'?'+userNameAndAuthKey }); return;
            }
         }
})

function resetNotifications()
{
	localStorage['numberofwallposts'] = 0;
	localStorage['lastpostcreator'] = '';
	
	chrome.browserAction.setBadgeText({ text: ''});
	chrome.browserAction.setTitle({title: "Open Projectplace"})
}


function openNewTabToProjectplace(){
	resetNotifications()

	postRequest(urlConfig.rootURL+urlConfig.client_access,urlConfig.getAuthKey,'', saveAuthKey);
}



chrome.browserAction.onClicked.addListener(function(tab) {
  openNewTabToProjectplace()
});

function log(msg){
	console.log(msg)
}
