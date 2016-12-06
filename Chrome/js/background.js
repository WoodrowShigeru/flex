
/** background.js
*** Last Update: 2o16-11-29
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/

console.log('early bird', woodbox);   // is {} at this point (empty).


 // on extension install (or update with new release).
 // hook up the listener early but implement it late, for timing reasons.
chrome.runtime.onInstalled.addListener(try_updating);

// https://developer.chrome.com/extensions/runtime#event-onInstalled
// replace_old_db()

 // on browser start (profile, actually).
chrome.runtime.onStartup.addListener(try_waking_up_woodbox);





chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
   // overwrite the console object with the right one, in case the options page exists. Which it should.
   // This is actually fairly buggy so let's keep its usage to a minimum.
//  console = get_options_console();
//  console.log('get_options_console test');



  var response_letter = 'invalid';
  var qnd_qlinks = null;   // TODO  clean up qnd.

   // preferences.
  if ( request.method === 'getPreference' ) {   // TODO  obsolete

    if ( request.key ) {
      response_letter = localStorage[request.key];
    }
  }


     // Quicklinks
  else if (
      (request.method === 'get')
  &&  (request.module === 'custom_quicklinks')
  ) {

    response_letter = woodbox.get_quicklinks();
  }

  else if (
      (request.method === 'set')
  &&  (request.module === 'custom_quicklinks')
  &&  (request.key !== '')
  ) {
  //  localStorage.quicklinks = request.key;
  //  response_letter = null;

    // ? woodbox.modules.custom_quicklinks.sub.set = request.key;
    woodbox.set_sub('custom_quicklinks', 'set', request.key);
  }


  else if ( request.method === 'dear_woodbox' ) {
    try_waking_up_woodbox();
    response_letter = woodbox;
    qnd_qlinks = woodbox.get_quicklinks();
  }



  sendResponse({value: response_letter , quicklinks: qnd_qlinks});
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








 // sets up the woodbox.//////
function try_updating(){

  console.log('trying to install/update FLEX.');

   // this is silly, but I need an intermediate step. I can't immediately call
   // provide_woodbox() – either due to timing or due to being split into
   // two files.
  woodbox.init();
  woodbox.update();

  console.log('update finished. The woodbox:', woodbox);
}

function try_waking_up_woodbox(){

  console.log('trying to provide woodbox.');

  woodbox.init();
  woodbox.load();
  console.log('provision finished', woodbox);
}






