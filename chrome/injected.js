function getSpecificFrame()
{
	var frameSetArr = document.getElementsByTagName('frameset');
	for(var i = 0; i < frameSetArr.length; i++)
	{
		if(frameSetArr[i].id == 'frameset_leftside')
		{
			var targetFrameSet = frameSetArr[i];
			var framesArr = targetFrameSet.getElementsByTagName('frame');
			for(var j = 0; j < framesArr.length;j++)
			{
				if(framesArr[j].name == 'B_CON')
				{	
					var frameURL = framesArr[j].contentDocument.location;
					var theFrame = framesArr[j];
					break;
				}
			}
		}
	}
	chrome.extension.sendRequest({target: "getConfigUrl"}, function(response) { if(response.ConfigURL) reloadFrame(theFrame,response.ConfigURL,frameURL.toString()); });
	
	return false;
}

function reloadFrame(theFrame, url, frameURL)
{
	var specificId = parseProjectplaceURL(frameURL);
	if(!specificId){
		action = '&action=startpage';
	}
	else{
		action = '&obj_id='+specificId;
	}
	theFrame.src = url+action;
	
}

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
	return obj;

}
