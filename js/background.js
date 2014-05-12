
/** background.js
*** Last Update: 2o14-o4-29
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


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



  sendResponse({value: response});
});








//crome.runtime.onInstalled.addListener(function(){});


















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












test_test();

function test_test()
{
var
  local_woodbox = {
    items: {},
    write: 'blub'
  },
  ACTIVE   = 'active',
  INACTIVE = 'inactive';


  local_woodbox.items = {

     // just so that I know that the options object isn't empty at this point.
    initiated: true,


      pref_sort_filters: {

        state: null,
        defaultState: INACTIVE,
        imgSource: 'img/sort_filters.png',
        description: "Lets you sort my Category Filter alphabetically, instead of using the dynamic order in dependence of the Pages. This option affects both filters, 'Search or Create' as well as 'Recent Pages'."
      },


      pref_hide_ticker: {

        state: null,
        defaultState: INACTIVE,
        imgSource: 'img/hide_ticker.png',
        description: "I personally find them all annoying. Your call."
      },


      pref_new: {

        state: null,
        defaultState: INACTIVE,
        imgSource: '',
        description: "A new preference for debug purposes."
      },

  };

  var x, unrecog=0, list = [], bool = false, st = '', o ={};

  for ( x in local_woodbox.items ) {

    o = local_woodbox.items[x];
    if (typeof o == "object") {

      bool = localStorage  &&  ( localStorage[x] !== undefined );
      st = (bool) ? localStorage[x] : o.defaultState;

      if (!bool) {
        unrecog++;
      }

      list.push({  item: x , state: st , default: o.defaultState , exists: bool  });
    }
  }


//  console = get_options_console();
  console.log('number of prefs:');
  console.log(list.length);
  console.log('prefs:');
  console.log(list);
  console.log('number of unrecognized prefs:');
  console.log(unrecog);

}



