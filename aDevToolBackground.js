var responses = Array();
var updateAvailable = null;
// var url = null;

function ajaxRequest(dataString, url, method, responseFunction) {
	
	var sOperationId = '',
//			range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
			range = 'abcdefghijklmnopqrstuvwxyz0123456789',
			i;
	
	// Generate Operation Id
	for(i=0; i < 10; i++) {
		sOperationId += range.charAt(Math.floor(Math.random() * range.length));
	}
	
	// Perform AJAX request
	var XMLHttpRequestObject = false,
			timeout = false,
			bRequestOK = false;
	responses[sOperationId] = null;
	
	if (window.XMLHttpRequest) {
		XMLHttpRequestObject = new XMLHttpRequest();
		// XMLHttpRequestObject.overrideMimeType('text/xml')
	} else if (window.ActiveXObject) {
		XMLHttpRequestObject = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	if (XMLHttpRequestObject) {
		// XMLHttpRequestObject.setRequestHeader('Content-Type','application/json');
		
		XMLHttpRequestObject.onreadystatechange = function() {
			if(!timeout) {
				window.setTimeout(function(){
					if(!bRequestOK) {
						XMLHttpRequestObject.abort();
						console.log('ajax error');
						
					}
				}, 8900);
				timeout = true;
			}
			
			if (XMLHttpRequestObject.readyState == 4 && XMLHttpRequestObject.status == 200) {
				responses[sOperationId] = XMLHttpRequestObject.responseText;
				responseFunction(responses[sOperationId], sOperationId);
				bRequestOK = true;
				
			}
		};
		
		XMLHttpRequestObject.open(method, url);
		if(dataString != null)
			XMLHttpRequestObject.send(dataString);
		else
			XMLHttpRequestObject.send();
	}
	
	// Return Operation Id
	return sOperationId;
	
}


chrome.runtime.onMessage.addListener(function(r, s, sR) {

	if (r.a == "mv") {

		try {

			ajaxRequest(null, 'https://raw.githubusercontent.com/proxiemind/agar.io-extensions/Chrome/manifest.json', 'GET', function(response) {
		
				var json = JSON.parse(response);

				console.log(json);

				if(json.version != chrome.runtime.getManifest().version) {

					updateAvailable = json.version;

				} else {

					updateAvailable = 'noRealUpdate';

				}
				
				
			});

			// chrome.tabs.query({active: true, lastFocusedWindow: false}, function(tabs) {

			// 	url = tabs[0].url;

			// });

		} catch(e) {

		}

		sR({v: chrome.runtime.getManifest().version, s: "OK"});

	// } else if(r.a == "cu") {

	// 	if(url.indexOf('ip') !== -1) {

	// 		sR({v: url, s: "yes"});

	// 	} else{

	// 		sR({s: "no"});

	// 	}

	} else if(r.a == "u") {

		if(updateAvailable != null) {
			
			sR({v: updateAvailable, s: "yes"});

		} else {

			sR({s: "no"});

		}

	}

});



