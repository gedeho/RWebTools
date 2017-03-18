var gdoCookieName   = "ABRkg";
var gdoSerchCookieName = "ABSearchStrategy";
var gdoCurrentRkgSegment;
var gdoCurrentSrchSegment;
var gdoCurrentUrl;
var ID;

document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        // Get Current URL :     
        gdoCurrentUrl = gdoGetBaseURL(tabs);
        
        // get Server Name :
        gdoSendMessage("getServerName");
        // Get Ranking Cookie :
        gdoGetCookieValue(gdoCookieName, '#toggleRkgCookie');
        gdoGetCookieValue(gdoSerchCookieName, '#toggleSrchCookie');
        // Toggle the "show decli" button in PDP :
        
        if(tabs[0].url.indexOf('ppdp/prod') !=-1) $('#showdcli').css('display', 'inline-block');
        
        if(tabs[0].url.indexOf('pplp') !=-1) $('#showdocid').css('display', 'inline-block');
        
        if(tabs[0].url.indexOf('psrch/psrch') !=-1) $('#showdocid').css('display', 'inline-block');

        // Get Search Datas :
        gdoSendMessage('getDOM');
    });  

    $('#showdcli').click(function(){gdoSendMessage("showdcli");});
    $('#showdocid').click(function(){gdoSendMessage("showdocid");});
    $('#clbskt').click(function(){gdoSendMessage("clearBasket");});   
});

// function gdoGetCookieValue(){
//     chrome.cookies.get({url:gdoCurrentUrl, name:gdoCookieName}, function(cookie){ 
//         if(cookie){
//             gdoCurrentRkgSegment = cookie.value;
//             var toggleValue = (cookie.value == "a") ? "on" : "off";
//             $('#toggleRkgCookie').bootstrapToggle(toggleValue);
//             $("#toggleRkgCookie").change(function(){
//                 gdoCurrentRkgSegment = (gdoCurrentRkgSegment == "a") ? "b" :"a";
//                 gdoChangeRkgCookie(gdoCurrentRkgSegment);
//             });
//         }else{$('.rankingToggle').hide();}  
//     });
// }



function gdoGetCookieValue(cookieName, toggleButtonName){


    chrome.cookies.get({url:gdoCurrentUrl, name:cookieName}, function(cookie){ 
if(cookie){
   		 currentSegmentName = cookie.value.substr(cookie.value.length-1,1);
   		 currentCookieKW = cookie.value.substr(0,cookie.value.length-1);
   		 var toggleValue = (currentSegmentName == "a") ? "on" : "off";
        $(toggleButtonName).bootstrapToggle(toggleValue);
        $(toggleButtonName).change(function(){
            currentSegmentName = (currentSegmentName == "a") ? "b" :"a";
            gdoChangeRkgCookie(cookieName, currentCookieKW+currentSegmentName);
            $('.ssid-info').text("---");
		    $('.sskey-info').text("---");
   		 
   		});
}

else{
    if(cookieName==gdoCookieName){
        $('.rankingToggle').hide();
    }
    if(cookieName==gdoSerchCookieName){
        console.log('change cookie')
        gdoChangeRkgCookie(cookieName, 'b');
        $('.ssid-info').text("---");
    $('.sskey-info').text("---");

    }
}

        
    });
}






function gdoChangeRkgCookie(cookieName, value){    
        var t = new Date();
        t.setMonth(t.getMonth()+1);        
        chrome.cookies.set({url:gdoCurrentUrl, name:cookieName, value:value, expirationDate:t.getTime()});
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
            if(response.dom) displaySearchDatas(response);
        });
    });
}

function displaySearchDatas(datas){
    $('.ssid-info').text(datas.ssid);
    $('.sskey-info').text(datas.sskey);
}



