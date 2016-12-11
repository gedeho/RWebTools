var gdoCookieName   = "ABRkg";
var gdoCurrentRkgSegment;
var gdoCurrentUrl;

document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        // Get Current URL :     
        gdoCurrentUrl = gdoGetBaseURL(tabs);
        // get Server Name :
        gdoSendMessage("getServerName");
        // Get Ranking Cookie :
        gdoGetCookieValue();
        // Toggle the "show decli" button in PDP :
        if(tabs[0].url.indexOf('ppdp/prod') !=-1) $('#showdcli').css('display', 'inline-block');
    });  

    $('#showdcli').click(function(){gdoSendMessage("showdcli");});
    $('#clbskt').click(function(){gdoSendMessage("clearBasket");});   
});

function gdoGetCookieValue(){
    chrome.cookies.get({url:gdoCurrentUrl, name:gdoCookieName}, function(cookie){ 
        if(cookie){
            gdoCurrentRkgSegment = cookie.value;
            var toggleValue = (cookie.value == "a") ? "on" : "off";
            $('#toggleRkgCookie').bootstrapToggle(toggleValue);
            $("#toggleRkgCookie").change(function(){
                gdoCurrentRkgSegment = (gdoCurrentRkgSegment == "a") ? "b" :"a";
                gdoChangeRkgCookie(gdoCurrentRkgSegment);
            });
        }else{$('.rankingToggle').hide();}  
    });
}

function gdoChangeRkgCookie(value){    
        var t = new Date();
        t.setMonth(t.getMonth()+1);        
        chrome.cookies.set({url:gdoCurrentUrl, name:gdoCookieName, value:value, expirationDate:t.getTime()});
        chrome.tabs.query({active:true, currentWindow: true}, function(tab){
            chrome.tabs.reload(tab.id);
    });
}

function gdoRemoveASPSession(){
    chrome.cookies.remove({url:gdoCurrentUrl, name:"ASP.NET_SessionId"})
}

function gdoGetBaseURL(tab){
    pathArray = tab[0].url.split( '/' );
    protocol = pathArray[0];
    host = pathArray[2];
    url = protocol + '//' + host;
    return url;
}

function gdoSendMessage(value){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: value}, function(response) {
            //console.log(response.farewell);
            if(response.serverName) $('.serverName span').text(response.farewell);
        });
    });
}