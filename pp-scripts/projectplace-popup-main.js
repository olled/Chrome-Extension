var initialLoad = true;
clearBadgeText();

var background = chrome.extension.getBackgroundPage();
var user = background.getViewControll().user;

function _showTrendingObject(view, trendingId){
	runSpinner.close();
	if (view == 'by-comments') {
		var trendingObject = user.getTrendingConversation();
		var coworker = user.getSpecificCoWorker(trendingObject.posts[0].author_id);
		var lastPost = toLocaleDateString(trendingObject.last_post_time);
		$('#trendingPost').html(trendingObject.posts[0].message);
		$('#trendingWhoUpdatesDates').html(coworker.sort_name + ' || Nr of Comments: '+ (trendingObject.post_count -1) + ' - '+lastPost )
		
		document.getElementById('getInvolved').setAttribute('goto',trendingId);
	}
}

function _displayTrendingCommentsBy(trendingId){
	var arrOfFourConversations = user.getTopFourConversationsByDate();
	var mainConf = {
		trendingpost: '',
		trendingwho: '',
		nrofupdate: '',
		lastdate: '',
		conversationId: '',
		view: mainViewConfig.SINGLECONVERSATION,
		commentsViewActive: 'active',
		linksViewActive: '',
		conversationsOne: arrOfFourConversations[0].posts[0].message,
		conversationsOneWho: user.getSpecificCoWorker(arrOfFourConversations[0].posts[0].author_id).sort_name,
		conversationsOneId: arrOfFourConversations[0].id,
		conversationsTwo : arrOfFourConversations[1].posts[0].message,
		conversationsTwoWho: user.getSpecificCoWorker(arrOfFourConversations[1].posts[0].author_id).sort_name,
		conversationsTwoId: arrOfFourConversations[1].id,
		conversationsThree : arrOfFourConversations[2].posts[0].message,
		conversationsThreeWho: user.getSpecificCoWorker(arrOfFourConversations[2].posts[0].author_id).sort_name,
		conversationsThreeId: arrOfFourConversations[2].id
	};
	var main = ich.mainView(mainConf)
	$('#content').empty();
	$('#content').append(main);
	runSpinner.run();
	window.setTimeout('_showTrendingObject("by-comments",'+trendingId+')',2000);
	
}
function _displayTrendingLikedBy(trendingId){
	var arrOfFourConversations = user.getTopFourConversationsByDate();
	var trendingObject = user.getTrendingConversation();
	
	var coworker = user.getSpecificCoWorker(trendingObject.posts[0].author_id);
	
	var lastPost = toLocaleDateString(trendingObject.last_post_time);
	var likedByNr = 0;
	for (var like in trendingObject.liked_by){
		likedByNr++;
	}
	
	var mainConf = {
		trendingpost: trendingObject.posts[0].message,
		trendingwho: coworker.sort_name,
		viewuser: mainViewConfig.SINGLEPERSONVIEW,
		userid: coworker.id,
		nrofupdate: 'Nr of Likes: '+ likedByNr,
		lastdate: lastPost,
		conversationId: trendingId,
		view: mainViewConfig.SINGLECONVERSATION,
		commentsViewActive: '',
		linksViewActive: 'active',
		conversationsOne: arrOfFourConversations[0].posts[0].message,
		conversationsOneWho: user.getSpecificCoWorker(arrOfFourConversations[0].posts[0].author_id).sort_name,
		conversationsOneId: arrOfFourConversations[0].id,
		conversationsTwo : arrOfFourConversations[1].posts[0].message,
		conversationsTwoWho: user.getSpecificCoWorker(arrOfFourConversations[1].posts[0].author_id).sort_name,
		conversationsTwoId: arrOfFourConversations[1].id,
		conversationsThree : arrOfFourConversations[2].posts[0].message,
		conversationsThreeWho: user.getSpecificCoWorker(arrOfFourConversations[2].posts[0].author_id).sort_name,
		conversationsThreeId: arrOfFourConversations[2].id
	};
	var main = ich.mainView(mainConf);
	$('#content').empty();	
	$('#content').append(main);
}
var runSpinner = {
	_spinner: null,
	run: function(_target){
		var opts = {
			lines: 12, // The number of lines to draw
			length: 7, // The length of each line
			width: 2, // The line thickness
			radius: 10, // The radius of the inner circle
			color: '#000', // #rbg or #rrggbb
			speed: 1, // Rounds per second
			trail: 100, // Afterglow percentage
			shadow: true // Whether to render a shadow
		};
		var target = (!_target?document.getElementById('trending') : document.getElementById(_target));
		runSpinner._spinner = new Spinner(opts).spin(target);
	},
	close: function(){
		runSpinner._spinner.stop();
	}
}

var views = {
	mainView: function(trendingBy){
		runSpinner.run();
		if (trendingBy == mainViewConfig.TRENDINGBYCOMMENTS) {
			var trendingId = user.getTrendingConversationOnCommentsId();
			user.setTrendingConversationObject(trendingId);	
			var unReadItems = user.getNewConversationsCount();					
			
			
			if (!initialLoad) {
				
				$('#nav').empty();
			}
			else{
				initialLoad = false;
			}
			_displayTrendingCommentsBy(trendingId);
			var navConf = {
				nrOfUpDates: '['+unReadItems+']',
				allconversations: mainViewConfig.CONVERSATIONS,
				peoplesView: mainViewConfig.ALLPEOPLESVIEW,
				aboutMe: mainViewConfig.ABOUTME
				
			};
			
			var nav = ich.navigation(navConf);
			$('#nav').append(nav);
			
			return false;
		}
		else if (trendingBy == mainViewConfig.TRENDINGBYLIKES) {
			var trendingId = user.getTrendingConversationOnLikesId();
			user.setTrendingConversationObject(trendingId);	
			
			window.setTimeout('_displayTrendingLikedBy('+trendingId+');',2500)
			
			return false;
		}
	},
	singleConversationsView: function(conversationsId)
	{
		$('#content').empty();
		function _presentConversation(conversationObject){
			
			var coworker = user.getSpecificCoWorker(conversationObject.posts[0].author_id);
	
			var lastPost = toLocaleDateString(conversationObject.last_post_time);
			var likedByNr = 0;
			for (var like in conversationObject.liked_by){
				likedByNr++;
			}
			
			var comments = '';
			
			var singleNavConf = {
				authorName: coworker.sort_name,
				organisation: coworker.organisation_name,
				title: coworker.title,
				lastPost: lastPost,
				postMessage: conversationObject.posts[0].message,
				comments: comments
			};
			var singelNavigation = ich.singleNavigation(singleNavConf)
			$('#content').append(singelNavigation);
			
			runSpinner.run('singleConversationsComments');
			
			function _displayComments(t, xhr){
				var singleConversationWithComments = JSON.parse(t);
				var comments = singleConversationWithComments.posts;
				comments.sort(sort_by('created_time', true, parseInt));
				for(var i = 0; i < comments.length-1; i++){
					singleConf = {
						message:comments[i].message,
						who:user.getSpecificCoWorker(comments[i].author_id).sort_name,
						time: toLocaleDateString(comments[i].created_time)
					}
					$('#singleConversationsComments').append(ich.singleNavigationPost(singleConf));
				}
				runSpinner.close();
			}
			user.getSpecificConversationComments(conversationsId, _displayComments);	
		}
		user.getSpecificConversation(conversationsId, _presentConversation);
	},
	allConversationsView: function(){
		$('#content').empty();
		$('#content').append(ich.allConversationsView({}));
		
		var allConversations = user.getConversations();
		allConversations.sort(sort_by('last_post_time', true, parseInt));
		
		function _createRowOfConversations(){
			for(var i = 0; i < allConversations.length; i+=4){
				rowConfig = {
					view: mainViewConfig.SINGLECONVERSATION,
					
					conversationId1:allConversations[i].id,  
		            row1Message:allConversations[i].posts[0].message,
					who1: user.getSpecificCoWorker(allConversations[i].posts[0].author_id).sort_name,
					time1: toLocaleDateString(allConversations[i].last_post_time),
					
					conversationId2:allConversations[i+1].id,  
		            row2Message:allConversations[i+1].posts[0].message,
					who2: user.getSpecificCoWorker(allConversations[i+1].posts[0].author_id).sort_name,
					time2: toLocaleDateString(allConversations[i+1].last_post_time),
					
					conversationId3:allConversations[i+2].id,  
		            row3Message:allConversations[i+2].posts[0].message,
					who3: user.getSpecificCoWorker(allConversations[i+2].posts[0].author_id).sort_name,
					time3: toLocaleDateString(allConversations[i+2].last_post_time),
					
					conversationId4:allConversations[i+3].id,  
		            row4Message:allConversations[i+3].posts[0].message,
					who4: user.getSpecificCoWorker(allConversations[i+3].posts[0].author_id).sort_name,
					time4: toLocaleDateString(allConversations[i+3].last_post_time)
				}
				
				$('#content').append(ich.rowAllConversationsView(rowConfig));	
			}
			
		}
		_createRowOfConversations();
		
		
		//$('body').scrollSpy('refresh');
	},
	allPeoplesView: function(){
		
		$('#content').empty();
		$('#content').append(ich.allPeoplesView({}));
		
		var allUsers = user.getCoworkers();
		allUsers.sort(sort_by('sort_name', false));
		
		
		for(var i = 0; i< allUsers.length; i+=6){
			try {
				rowConfig = {
					userid1: allUsers[i].id,
					userdata1: allUsers[i].title +' '+ allUsers[i].description +' '+allUsers[i].organisation_name,
					username1: allUsers[i].sort_name,
					userid2: allUsers[i + 1].id,
					userdata2: allUsers[i + 1].title +' '+ allUsers[i + 1].description +' '+allUsers[i + 1].organisation_name,
					username2: allUsers[i + 1].sort_name,
					userid3: allUsers[i + 2].id,
					userdata3: allUsers[i + 2].title +' '+ allUsers[i + 2].description +' '+allUsers[i + 2].organisation_name,
					username3: allUsers[i + 2].sort_name,
					userid4: allUsers[i + 3].id,
					userdata4:allUsers[i + 3].title +' '+ allUsers[i + 3].description +' '+allUsers[i + 3].organisation_name,
					username4: allUsers[i + 3].sort_name,
					userid5: allUsers[i + 4].id,
					userdata5: allUsers[i + 4].title +' '+ allUsers[i + 4].description +' '+allUsers[i + 4].organisation_name,
					username5: allUsers[i + 4].sort_name,
					userid6: allUsers[i + 5].id,
					userdata6: allUsers[i + 5].title +' '+ allUsers[i + 5].description +' '+allUsers[i + 5].organisation_name,
					username6: allUsers[i + 5].sort_name,
					view: mainViewConfig.SINGLEPERSONVIEW
				}
				$('#content').append(ich.rowAllPeoplePage(rowConfig));
			}
			catch(e){
				console.log('Error in allPeoplesView ' + e);
			}
		}
		
		var allImages = document.getElementsByTagName('img');
		for(var i = 0; i < allImages.length; i++){
			
			function _setUserImage(sHref){
				allImages[i].src = sHref;
			}
			if (allImages[i].parentNode.id) {
				user.getUserImageHref(allImages[i].parentNode.id, _setUserImage);
			}
		}
		
		$(".media-grid > li > a").popover({})
		
	},
	singlePersonView: function(userId){
		removeAllPopovers();
		$('#content').empty();
		var singleUser = user.getSpecificCoWorker(userId);
		$('#content').append(ich.singlePersonHeading({
			userName: singleUser.sort_name,
			company: singleUser.organisation_name
		}));
		var userImg = ''; 
		user.getUserImageHref(userId, function(sHref){
			userImg = sHref;
			
		});
		
		var userConversations = []
		function _userConversations(conv){
			userConversations = conv;
		}
		
		user.getConversationsForSpecificUser(userId, _userConversations);
		
		
		$('#content').append(ich.singlePersonContent({
			userImageSrc: userImg,
			userName: singleUser.sort_name,
			title: singleUser.title,
			street: singleUser.address1,
			email: singleUser.email,
			city: singleUser.city,
			webb: singleUser.organisation_homepage,
			cell: singleUser.mobile_phone,
			workPhone: singleUser.work_phone
		}));
		if (userConversations.length) {
			for (var i = 0; i < userConversations.length; i += 4) {
				rowConfig = {
					view: mainViewConfig.SINGLECONVERSATION,
					conversationId1: userConversations[i].id,
					row1Message: userConversations[i].posts[0].message,
					who1: '',
					time1: toLocaleDateString(userConversations[i].last_post_time)
				}
				
				if (userConversations[i + 1]) {
					rowConfig.conversationId2 = userConversations[i + 1].id
					rowConfig.row2Message = userConversations[i + 1].posts[0].message
					rowConfig.who2 = ''
					rowConfig.time2 = toLocaleDateString(userConversations[i + 1].last_post_time)
				}
				if (userConversations[i + 2]) {
					rowConfig.conversationId3 = userConversations[i + 2].id
					rowConfig.row3Message = userConversations[i + 2].posts[0].message
					rowConfig.who3 = ''
					rowConfig.time3 = toLocaleDateString(userConversations[i + 2].last_post_time)
				}
				if (userConversations[i + 3]) {
					rowConfig.conversationId4 = userConversations[i + 3].id
					rowConfig.row4Message = userConversations[i + 3].posts[0].message
					rowConfig.who4 = ''
					rowConfig.time4 = toLocaleDateString(userConversations[i + 3].last_post_time)
				}
				
				$('#content').append(ich.rowAllConversationsView(rowConfig));
			}
		}
		else{
			$('#content').append(ich.noConversationsFound({}));
		}
	},
	projectsView: function(){
		
	},
	aboutView: function(){
		$('#content').empty();
		$('#content').append(ich.aboutView({}));
		$('#me').popover({});
	},
	contactsView: function(){
		
	}
}

$('body > .topbar').scrollSpy()

function removeAllPopovers(){
	var all = document.getElementsByTagName('*');
	for(var i = 0; i < all.length; i++){
		if(all[i].className.indexOf('popover') != -1){
			all[i].parentNode.removeChild(all[i]);
		}
	}
	
}
