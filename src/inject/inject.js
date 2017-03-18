chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.greeting){

			// TODO : http://www.laredoute.fr/clearcache.aspx?cacheType=session 

			case "showdcli" :
				displayDims();
				sendResponse({farewell: "Déclis affichées"});
				break;

			case "showdocid" :
				displayDocid();
				sendResponse({farewell: "Docid affichées"});
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

			case "getDOM" :
				sendResponse({dom:true, ssid:gdoGetSsid(), sskey:gdoGetSskey()});
				break

			default :
				sendResponse({farewell: "Demande non reconnue"});
		}
});

// Get SSID :
function gdoGetSsid(){
	return $('#crb-ssid').text();
}

// Get SSID :
function gdoGetSskey(){
	return $('#crb-sskey').text();
}

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

// affichage des valeurs de déclis en PDP :
function displayDocid(){
	$('.plpList-divMain .product-list article').each(function(){
		$(this).append(' <span class="vstyle docid">'+$(this).attr('data-documentid')+'</span>');
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

