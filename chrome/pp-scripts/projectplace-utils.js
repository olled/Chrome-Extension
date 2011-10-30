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

/**
 * http://stackoverflow.com/questions/979256/how-to-sort-a-json-array
 * By http://stackoverflow.com/users/43089/triptych
 * @param {Object} field
 * @param {Object} reverse
 * @param {Object} primer
 */
var sort_by = function(field, reverse, primer){

   reverse = (reverse) ? -1 : 1;

   return function(a,b){

       a = a[field];
       b = b[field];

       if (typeof(primer) != 'undefined'){
           a = primer(a);
           b = primer(b);
       }

       if (a<b) return reverse * -1;
       if (a>b) return reverse * 1;
       return 0;

   }
};