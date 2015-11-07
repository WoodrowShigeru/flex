
/** background.js
*** Last Update: 2o14-o5-2o
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/

 // hook up the listener early but implement it late, for timing reasons.
chrome.runtime.onInstalled.addListener(try_getting_woodbox);





chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
   // overwrite the console object with the right one, in case the options page exists. Which it should.
   // This is actually fairly buggy so let's keep its usage to a minimum.
//  console = get_options_console();
//  console.log('get_options_console test');




  var response = 'invalid';

   // preferences.
  if ( request.method === 'getPreference' ) {

    if ( request.key ) {
      response = localStorage[request.key];
    }
  }


     // Quicklinks
  else if ( request.method === 'getQuicklinks' ) {
    response = localStorage.quicklinks;
  }

  else if (  (request.method === 'setQuicklinks')  &&  (request.key !== "")  ) {

    localStorage.quicklinks = request.key;
    response = null;
  }


  else if ( request.method === 'getWoodbox' ) {
    response = woodbox;
  }



  sendResponse({value: response});
});










 // retrieves the console object of the options page. Because I have an elaborate
 // options page and no interest in creating a blank background page just for the
 // console when I'm already extensively using the options console.
function get_options_console()
{
  var
    cons = console,
    optionsPage = null,
    views = chrome.extension.getViews();

   // safety precaution.
  if (  views  &&  (views.length > 1)  ) {

    optionsPage = views[1];
    if (optionsPage) {
      cons = optionsPage.console;
    }
  }

  return cons;
}








 // sets up the woodbox.
function try_getting_woodbox()
{
   // this is silly, but I need an intermediate step. I can't immediately call
   // provide_woodbox()  – either due to timing or due to being split into
   // two files.
  provide_woodbox();
}






