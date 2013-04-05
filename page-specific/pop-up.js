
document.addEventListener('DOMContentLoaded', function () {
  
  	ChromeExOAuth.sendRequest("GET", '/templates/templates.json', '', '', function (xhr) {
	    if (xhr.readyState == 4) {
	    	var _jsonTemplates = JSON.parse(xhr.responseText)
	    	var templates = _jsonTemplates.templates;
	    	for(var i = 0; i < templates.length; i++ ){
	    		if(templates[i].partial === ''){
		        	ich.addTemplate(templates[i].name, templates[i].template);
		        }
		        else{
		        	ich.addPartial(templates[i].name, templates[i].template);
		        }
	    	}
	    }
  	});
});

function wait(){
	views.mainView(mainViewConfig.TRENDINGBYCOMMENTS);
}
window.setTimeout(wait, 500)