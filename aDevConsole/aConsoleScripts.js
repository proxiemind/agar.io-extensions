var blockTraffic	= false;

function ipInUrl() {

	chrome.runtime.sendMessage({a: "cu"}, function(r) {

		console.log('cu_callback', r);

		if(r.s == 'yes') {

			blockTraffic = true;

			document.getElementById('alink').value = r.v;
			document.getElementById('ipInUrl').style.display = 'inline-block';

		} else {

			blockTraffic = false;
			document.getElementById('ipInUrl').style.display = 'none';

		}

	});

	window.setTimeout(ipInUrl, 1000); // Background script can't send message here unfortunately. Better solution is needed.

}


function handleButton(c) {

	var alink = document.getElementById('alink');

	var originalLink = alink.value;

	var fraction = c == 'g' ? ' - [color=#6aa84f]GREEN[/color]' : c == 'b' ? ' - [color=#3d85c6]BLUE[/color]' : c == 'r' ? ' - [color=#cc0000]RED[/color]' : '';

	alink.value = '[size=30][url]' + alink.value + '[/url]' + fraction + '[/size]';

	var alink = document.getElementById('alink');
		alink.setSelectionRange(0, alink.selectionEnd);

	document.execCommand('copy');

	window.getSelection().removeAllRanges();

	alink.value = originalLink;

}


chrome.runtime.sendMessage({a: "mv"}, function(r) {

	document.getElementById('cV').innerHTML = 'v ' + r.v + ' beta';

});


chrome.devtools.network.onRequestFinished.addListener(function(net) {

	if(net.request.url === 'http://m.agar.io/findServer') {

		if(!blockTraffic) {

			net.getContent(function(content){
				document.getElementById('alink').value = 'http://agar.io/?ip=' + JSON.parse(content).ip;
				
			});

		}

		// ipInUrl(); // not working, kinda expected though

	}

});


window.setTimeout(function(){


	ipInUrl();


	chrome.runtime.sendMessage({a: "u"}, function(r) {

		console.log(r);

		if(r.s == 'yes') {

			if(r.v != 'noRealUpdate') {

				document.getElementById('updateAvailable').innerHTML = '<a href="https://github.com/proxiemind/agar.io-extensions/tree/Chrome#how-to-install-or-update" title="Go to GitHub for details" target="_blank">Agar.io Console <span id="v">' + r.v + '</span></a> update is available! <a href="https://github.com/proxiemind/agar.io-extensions/tree/Chrome#how-to-install-or-update" target="_blank">How to update?</a>';
				document.getElementById('updateAvailable').style.display = 'inline-block';

			}

		}


		// What a dirty hack :S No better ideas how to add listeners to those buttons in aConsole.html without chrome.* calls :/


		var justCopyLink	= document.getElementById('justCopyLink');
		var green			= document.getElementById('green');
		var blue			= document.getElementById('blue');
		var red				= document.getElementById('red');

		justCopyLink.addEventListener("click", function() {

			var alink = document.getElementById('alink');
				alink.setSelectionRange(0, alink.selectionEnd);

			document.execCommand('copy');

			window.getSelection().removeAllRanges();

		});

		green.addEventListener("click", function() {
			handleButton('g');
			
		});

		blue.addEventListener("click", function() {
			handleButton('b');
			
		});

		red.addEventListener("click", function() {
			handleButton('r');

		});


	});
	

}, 1000);