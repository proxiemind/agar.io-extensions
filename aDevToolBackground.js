var responses = Array();
var updateAvailable = null;
var url = null;
var urlTabId = null;


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	if(urlTabId == tabId) {

		url = tab.url;

		console.log('updated', url);

	}

});


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


function checkURL() {

	chrome.tabs.query({active: true, url: "*://agar.io/*"}, function(tabs) {

		if(tabs.length > 0) {

			url			= tabs[0].url;
			urlTabId	= tabs[0].id;

			console.log('tab: ', tabs[0]);
			console.log('url: ', url);

		} else {

			url			= null;
			urlTabId	= null;

			console.log('NO Active Agar.io tab');

		}

	});

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

		} catch(e) {

		}

		sR({v: chrome.runtime.getManifest().version, s: "OK"});

	} else if(r.a == "cu") {

		if(url != null) {

			if(url.indexOf('ip') !== -1) {

				sR({v: url, s: "yes"});

			} else{

				sR({s: "no"});

			}

		} else {

			sR({s: "no"});

			// Async, so need to wait until next iteration
			checkURL();

		}


	} else if(r.a == "u") {

		if(updateAvailable != null) {
			
			sR({v: updateAvailable, s: "yes"});

		} else {

			sR({s: "no"});

		}

	} else if(r.a == 'init') {

		checkURL();

		sR({s: "ok"});

	}

});