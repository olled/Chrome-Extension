/**
 * Takes a milli sec string form the API's, and converts it to a valid
 * javascript date/millisec string.
 * @param {Object} msec - milli sec string from the API's
 */
function toLocaleDateString(msec){
	var createValidDate = parseInt(msec+'000');
	return new Date(createValidDate).toLocaleDateString();
}


function setNewBadge(numberToUpdate){
	chrome.browserAction.setBadgeText({
		text: numberToUpdate.toString()
	});
	chrome.browserAction.setTitle({
		title: "You have " + numberToUpdate + " unread wall posts"
	});
}
function clearBadgeText(){
	chrome.browserAction.setBadgeText({
		text: ''
	});
	chrome.browserAction.setTitle({
		title: "Open Projectplace"
	})
}