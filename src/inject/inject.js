chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.greeting){

			// TODO : http://www.laredoute.fr/clearcache.aspx?cacheType=session 

			case "showdcli" :
				displayDims();
				sendResponse({farewell: "Déclis affichées"});
				break;

			case "clearBasket" :
				$.ajax({url: '/clearcache.aspx?cachetype=shoppingbasket'}).done(function() {	
					document.location.reload();
				});
				sendResponse({farewell: "Panier vidé"});
				break;

			case "getServerName" :
				var gdoSName = retrieveWindowVariables(["wa_data.server"]);
				sendResponse({serverName:true, farewell:gdoSName['wa_data.server']});
				break;

			default :
				sendResponse({farewell: "Demande non reconnue"});
		}
});

// affichage des valeurs de déclis en PDP :
function displayDims(){
	$('.product .set-colour, .product .set-size').show();
	$('.product .set-colour, .product .set-size').parent().show();
	$('.product .set-size li').each(function(){
		$(this).append(' <span class="vstyle size">'+$(this).attr('data-variant')+'</span>');
	});
	$('.product .set-colour li').each(function(){
		$(this).append(' <span class="vstyle color">'+$(this).attr('data-variant')+'</span>');
	});
}

// Récupérer une variable du document :
function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = $("body").attr("tmp_" + currVariable);
        $("body").removeAttr("tmp_" + currVariable);
    }

    $("#tmpScript").remove();

    return ret;
}



// chrome.extension.sendMessage({}, function(response) {
// 	var readyStateCheckInterval = setInterval(function() {
// 	if (document.readyState === "complete") {
// 		clearInterval(readyStateCheckInterval);
// 		// console.log('hello from injected script')
// 		// ----------------------------------------------------------
// 		// This part of the script triggers when page is done loading
// 		// console.log("Hello. This message was sent from scripts/inject.js");
// 	}
// 	}, 10);
// });