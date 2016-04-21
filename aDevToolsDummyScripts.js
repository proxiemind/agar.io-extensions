chrome.devtools.panels.create("Agar.io Console", null, "aDevConsole/aConsole.html", function(panel) {

		chrome.runtime.sendMessage({a: "init"}, function(r) {

			

		});

	}
);