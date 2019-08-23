/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
  	id: "main",
    innerBounds: {
      width: 700,
      height: 600
    }
  });

});

chrome.commands.getAll(function(commands){
  console.log(commands)
})

chrome.commands.onCommand.addListener(function(command) {
  chrome.app.window.get("main").contentWindow.console.log('Command(BG):', command);
});