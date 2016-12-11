chrome.tabs.onActivated.addListener(function(infos){
	chrome.tabs.get(infos.tabId, function(tab){
		toogleBrowserAction(tab);
	});	
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	console.log('updated ! '+tab.url);
	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		toogleBrowserAction(tabs[0]);
	});
});

function toogleBrowserAction(tab){
	pathArray = tab.url.split( '/' );
    protocol = pathArray[0];
    host = pathArray[2];
    url = protocol + '//' + host;

	var gdoRegEx = /^(http|https):\/\/(www|uat|uat01|preview|preprod)?(gedeho|\.laredoute)(\.fr|\.com|\.co\.uk|\.be|\.ch|\.es|\.pt|\.pl|\.it|\.se|\.no|\.ru)/ig;

	if(gdoRegEx.test(url)){
		chrome.browserAction.enable(tab.id);
	}else{
		chrome.browserAction.disable(tab.id);
	}
}