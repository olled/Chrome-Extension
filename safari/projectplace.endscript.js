/**
*	This script is loaded onload of the document object
*/

/**
 * Tries to get the B_CON frame from Projectplace.
 * If found, returns the frame object, else false.
 */
function getSpecificFrame()
{
	if (window.top == window)
	{
		var frameSetArr = document.getElementsByTagName('frameset');
		for (var i = 0; i < frameSetArr.length; i++)
		{
			if (frameSetArr[i].id == 'frameset_leftside')
			{
				var targetFrameSet = frameSetArr[i];
				var framesArr = targetFrameSet.getElementsByTagName('frame');
				for (var j = 0; j < framesArr.length;j++)
				{
					if (framesArr[j].name == 'B_CON')
					{
						return framesArr[j];
					}
				}
			}
		}
	}
	return false;
}
/**
 * Called from projectplace.global.html and dispatches a message(to projectplace.global.html) with the specific URL if found.
 */

function checkIfFrameIsFound()
{

	var specificFrame = getSpecificFrame();
	if (specificFrame)
	{log(specificFrame.contentWindow.window.location.href.toString())
		safari.self.tab.dispatchMessage("framefound", specificFrame.contentWindow.window.location.href.toString());
	}
}

/**
 * Set the src of the B_CON frame if found.
 * @param {String} frameUrl
 */
function reloadSpecificFrame(frameUrl)
{
	var specificFrame = getSpecificFrame();
	if (specificFrame)
	{
		specificFrame.src = frameUrl;
	}
}

/**
*	Logs to console messages sent from projectplace.global.html
**/
function log(text)
{
	console.log(text);

}

/**
*	handles passed messages from the projectplace.global.html page
**/
function messageHandler(msg)
{
	if (msg.message == "check-for-frame")
	{
		checkIfFrameIsFound();
	}
	else if (msg.name == "loadObject")
	{
		reloadSpecificFrame(msg.message);
	}
	else
	{
		log(msg.message);
	}
	
}
/**
 * Handles all calls from projectplace.global.html
 */
safari.self.addEventListener("message", messageHandler, false);
	
