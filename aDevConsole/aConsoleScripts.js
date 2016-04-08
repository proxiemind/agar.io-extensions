// var blockTraffic = false;
var noRealUpdate = false;

chrome.runtime.sendMessage({a: "mv"}, function(r) {

	document.getElementById('cV').innerHTML = 'v ' + r.v + ' beta';

});

chrome.devtools.network.onRequestFinished.addListener(function(net) {

	if(!noRealUpdate) {

		chrome.runtime.sendMessage({a: "u"}, function(r) {

			console.log(r);

			if(r.s == 'yes') {

				if(r.v != 'noRealUpdate') {

					document.getElementById('updateAvailable').innerHTML = '<a href="https://github.com/proxiemind/agar.io-extensions/tree/Chrome#how-to-install-or-update" title="Go to GitHub for details" target="_blank">Agar.io Console <span id="v">' + r.v + '</span></a> update is available! <a href="https://github.com/proxiemind/agar.io-extensions/tree/Chrome#how-to-install-or-update" target="_blank">How to update?</a>';
					document.getElementById('updateAvailable').style.display = 'inline-block';

				}

				noRealUpdate = true;

			}

		});

	}


	
	if(net.request.url === 'http://m.agar.io/findServer') {

		// if(!blockTraffic) {

			net.getContent(function(content){
				document.getElementById('alink').innerHTML = 'http://agar.io/?ip=' + JSON.parse(content).ip;
				
			});

		// }

	}

});

// window.setTimeout(function(){

// 	chrome.runtime.sendMessage({a: "cu"}, function(r) {

// 		console.log('cu_callback', r);

// 		if(r.s == 'yes') {

// 			blockTraffic = true;

// 			document.getElementById('alink').innerHTML = r.v;
// 			document.getElementById('ipInUrl').style.display = 'inline-block';

// 		} else {

// 			blockTraffic = false;
// 			document.getElementById('ipInUrl').style.display = 'none';

// 		}

// 	});

// }, 1000);