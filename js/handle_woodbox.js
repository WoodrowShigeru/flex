
/** handle_woodbox.js
*** Last Update: 2o14-o5-23
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
***
*** Clarifying the purpose of the woodbox:
***
***     The FLEX options page does access the localStorage intensively, but I coded the
***   JavaScript of the options page in such a way so that I can use the exact same
***   script across all browsers, and not all browsers call their respective storage
***   "localStorage". Hence, the woodbox.write() interface.
***
***     Furthermore, the woodbox is supposed to update the localStorage that has been
***   established in a previous version of FLEX. Which is why I also need to set up the
***   woodbox when installing/updating FLEX in order to synchronize the old with the new
***   settings.
***
***     And this needs to be a separate file because I need this in both, the background
***   script environment as well as the options/preferences environment.
***
**/


//////////////////////////////////////// LEGEND /////////////////////////////////////////
/////  E N D   P R E V I O U S  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////  B E G I N   N E X T  /////
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////  I N S T A N T I A T I O N  /////
/////////////////////////////////////////////////////////////////////////////////////////


var
  woodbox = { modules: {} },

   // declare two constants – in order to avoid stupid typo errors with unpredictable
   // consequences.
  ACTIVE   = 'active',
  INACTIVE = 'inactive';



 // builds a totally fresh woodbox object from scratch.
function build_woodbox()
{
   // for completion's sake. (saving these in localStorage is more important than in woodbox).
  woodbox.quicklinks = '';


   // one big modules sub-object to manage the preferences on the options/preferences page of FLEX.
  woodbox.modules = {


    sort_filters: {

      state: null,
      defaultState: INACTIVE,
      imgSource: 'img/sort_filters.png',
      description: "Lets you sort my Category Filter alphabetically, instead of using the dynamic order in dependence of the Pages. This option affects both filters, 'Search or Create' as well as 'Recent Pages'."
    },


    hide_ticker: {

      state: null,
      defaultState: INACTIVE,
      imgSource: 'img/hide_ticker.png',
      description: "I personally find them all annoying. Your call."
    },


    expand_clickarea: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/expand_clickarea.png',
      description: "This not only affects the items in the mega-meta-master search but also those mini-boxes all over FL."
    },


    fix_submit_search: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/search_single.png',
      description: "By default, if you submit a mega-meta-master search it redirects you to the front page, regardless of the search results. I deactivated that. And as a bonus, single search results will be detected and handled accordingly."
    },


    paint_history: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/paint_history.png',
      description: "Where possible, I dynamically replaced the generic text with something more informative."
    },


    leftright_paging: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> You can only browse through 'paged' areas, i.e. the Recent Pages, by scrolling to the pagination and clicking with the mouse.<br /><br />"
       +"<b>My Solution:</b> Now you can also go prev|next with the left|right arrow keys on your keyboard. Convenience!"
    },


    toggle_spoilertitle: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Spoiler-links keep saying \"Show Spoiler\" even when their respective hidden texts are opened up.<br /><br />"
       +"<b>My Solution:</b> Toggle \"Show\" with \"Hide\". It's that simple."
    },


    slapon_accesskeys: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Favsland doesn't use <a href='https://en.wikipedia.org/wiki/Access_key' target='_blank'>HTML accesskeys</a>.<br /><br />"
       +"<b>My Solution:</b> I'll add some, then."
    },


    stop_happening: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "Reduces the functionality of the Happening Now box to \"React to user click, yes. Autonomously, no.\" Some things are just too annoying."
    },


    soc_filter: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/category_filter.jpg',
      description: "Filter the search results by category. It dynamically offers only the categories present in the results, not all of FL's categories."
    },


    custom_quicklinks: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The current selection is too static and not suitable for everyone.<br /><br />"
       +"<b>My Solution:</b> Users can customize them themselves via a drag and drop overlay menu."
    },


    radio_vs_quicklinks: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/slow_quick.png',
      description: "Fixes that, most unfavorably, you can have both selected at the same time: a quicklink and a slowlink. Which messes up the subsequent navigation of the category tree."
    },


    category_tree: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/category_tree.png',
      description: "Provides an always-current, clickable, in-document-searchable tree representing the current category system in use in FL. Sadly, I can only provide it when editing, not when adding (when it is most needed) … but still: better than nothing! Right?"
    },


    yt_quickpaste: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/quicken_paste.png',
      description: "Conveniently reduces a full YouTube-link pasted from the clipboard (possibly containing additional playlist-/etc.-information) to the mere YouTube-ID."
    },


    textfocus_on_tabswitch: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/focus_text.png',
      description: "Automatically focus the first available text field (move the cursor there) and bring it into view when switching the category."
    },


    losefocus_on_submit: {

      state: null,
      defaultState: INACTIVE,
      imgSource: '',
      description: "When submitting the form (with the Enter key) while you're inside an input field or combobox, automatically lose that focus. This makes it easier in Opera to use the hotkeys [1] and [2] to navigate to the neighbor tabs (and start editing the next prepared Page). Super convenient, imho. (Picture coming soon)"
    },


    clickable_edit_minibox: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "(Picture coming soon)"
    },


    create_at_top: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "When searching for other Pages while editing (i.e. a movie's actors), bring the 'Quick Create' link closer to the search field. Move it from below the search results to above them. (Picture coming soon)"
    },


    losefocus_trackno: {

      state: null,
      defaultState: INACTIVE,
      imgSource: '',
      description: "When editing an album's tracklist and leaving the browser tab, then returning (i.e. in order to fill the clipboard with the next track title), the focus is automatically moved from the track no. combobox to the text field. (Picture coming soon)"
    },


    date_quickpaste: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Dates are splitted into a combination of three comboboxes/fields, "
       +"making copy & paste impossible.<br /><br />"
       +"<b>My Solution:</b> I'm adding an intermediate field that translates \"date strings\" "
       +"into information that is comprehensible by these three comboboxes/fields."
    },


    viewpage_fixstyling: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> When a Page is lacking comments and sidebar attributes, the footer runs into the \"user average score\" box.<br /><br />"
       +"<b>My Solution:</b> I'm giving the content area a minimum height attribute."
    },


    expand_recentlists: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The Recent Lists list lists only three lists. This is particularly a problem if you've been away from FL for more than a week and there have been quite a few new lists by now.<br /><br />"
       +"<b>My Solution:</b> I'm just listing 'em all. And I mean … <i>all!</i> … That enough for ya?!"
    },


    editlist_fix_scrolltop: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "Make the list of search/letter results scroll back to top when new content is loaded. (Picture coming soon)"
    },


    provide_preview: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/preview_link.png',
      description: "Provides a convenient one-click way of opening a Page in another tab real quick, without the need to manually search or temporarily rank or anything."
    },


    article_readability: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/article_readability.png',
      description: "Moves the articles to the back of the title, to better/faster read why a Page is listed under the selected letter. Changeable on the fly. Unfortunately, it has to be manually re-set each time new content is loaded. (Picture coming soon)"
    },


    detect_duplicates: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "If you hover over an unranked list item, my extension tries to load its image. It doesn't always work. In the future you'll be able to decide \"on duplicates\" vs. \"always\". (Picture coming soon)"
    },


    fix_long_eligibility: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "The \"List Eligibility Requirements\" box was once design-distortingly long. It may happen again … (Picture coming soon)"
    },


    optimize_olist_jumper: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "Reduces the redundancy inside the \"jump to other lists\" combobox a bit, thus making it a bit prettier. (Picture coming soon)"
    },


    rp_filter: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/category_filter.jpg',
      description: "Filter the Recent Pages by category. (better Picture coming soon)"
    },


    self_jumper: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/self_jumper.jpg',
      description: "When browsing another user's list (any list) or the combined chart, provide a button to instantly jump to the display of your own list (if available). (better Picture coming soon)"
    },


    fix_thumb_aspectratio: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Many thumbnails all over FL have a broken aspect ratio.<br /><br />"
       +"<b>My Solution:</b> I've started fixing this. For now, only when viewing a user's list."
    },


    forumbox_vertscroll: {

      state: null,
      defaultState: ACTIVE,
      imgSource: 'img/forum_scrollbar.png',
      description: "Lets you scroll your unfinished posts! INSANITY ensues …"
    },


    fix_yt_overlay_bug: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "If you scroll pages with a YouTube embed a bit down, they will lay over the FL header bar (apparently, only in Opera). (Picture coming soon)"
    },


    anchor_consider_menu: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Hashtagged links, most prominently forum timestamps, are scrolled to the very top of the screen, which is the default browser behavior, but FL uses a menu bar that lies on top of everything, so the posts are always partly cut off.<br /><br />"
       +"<b>My Solution:</b> Make any forum timestamps consider the menu height.<br /><br />"
       +"As a bonus, I am also highlighting the post in question."
    },


    thereare_followupposts: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Users often fail to notice that the last post in a thread is in fact <i>not</i> the last post in a thread. The links/buttons are styled in gray, and gray on gray is hard to say— err, see.<br /><br />"
       +"<b>My Solution:</b> I am modifying the necessary CSS."
    },


    debug_off: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "(Woody forgot to hide his annoying crap) (›‹ ) (Picture coming soon)"
    },


    submit_with_enter: {

      state: null,
      defaultState: ACTIVE,
      imgSource: '',
      description: "(Apart from the mega-meta-master search which works flawlessly everywhere, for unknown reasons) This was only an issue in Chrome, not Opera. (Picture coming soon)"
    },


  };


  woodbox.write = function( key, value ) {
    save_to_storage( key, value );
    woodbox.modules[key] = value;
  };


   // just so that I know that the object isn't empty at this point.
  woodbox.initiated = true;
  woodbox.synched = false;   // oy! "synchronized" is a reserved word in JavaScript.
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  I N S T A N T I A T I O N  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////  S E T U P   M E T H O D S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // synchronizes the internal woodbox with the browser-dependent localStorage/widget.
 // This is mainly done to avoid that the user-customized settings get lost on each
 // new FLEX update.
function synchronize_woodbox()
{
   // better to validate it right away to make the subsequent validations more elegant.
   // This case will probably never happen (in Chrome) – I wouldn't know how – but safe is safe.
  if ( !validate_storage() ) {
    console.log('[FLEX] No storage object available. Cannot continue.');
    return false;
  }

  var
    x, list = [],
    o = {},
    store = get_storage(),
    backup = {};

   // in order to remove any deprecated modules.
  for ( x in store ) {
     // (don't overwrite the resource settings)
    if ( x.indexOf('resource_') != 0 ) {
      backup[x] = store[x];
      delete_from_storage(x);
    }
  }

   // process each module item that is defined in this file here.
  for ( x in woodbox.modules ) {

     // validate item (safety precaution)
    if (  (o = woodbox.modules[x])
      &&  (typeof o == "object")  // who would've thought? typeof null is "object", too …
      &&  !!o.defaultState  )
    {
       // new pref
      if ( backup[x] === undefined ) {

        save_to_storage( x, o.defaultState );
        o.state = o.defaultState;
      }

       // old pref
      else {
        o.state = backup[x];
        save_to_storage( x, o.state );
      }
    }  // end of ( valid preference item )


     // Quicklinks
    woodbox.quicklinks =
      (backup.quicklinks !== undefined)
      ? backup.quicklinks
      : '';
    save_to_storage( 'quicklinks', woodbox.quicklinks );
  }

  woodbox.synched = true;
}



 // creates … well, *fills* the woodbox object and synchronizes it with the localStorage.
function provide_woodbox()
{
  if ( !woodbox.initiated ) {
    build_woodbox();
  }
  if ( !woodbox.synched ) {
    synchronize_woodbox();
  }

  console.assert(
    woodbox.initiated && woodbox.synched,
    '[FLEX] Error: preferences initiation went wrong.'
  );
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  S E T U P   M E T H O D S  ///////////////////////////////////////////////////////
///////////////////////////////////////////  S T O R A G E   I N T E R A C T I O N  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // identifies the Opera browser. Always returns a boolean.
function isOpera()
{
  return !!window.navigator.userAgent.match(/Opera/);
}

 // identifies the Chrome browser. Always returns a boolean.
function isChrome()
{
  return !!window.navigator.userAgent.match(/Chrome/);
}

 // identifies the Firefox browser. Always returns a boolean.
function isFirefotz()
{
  return !!window.navigator.userAgent.match(/Firefox/);
}

 // identifies the Internet Explorer browser. Always returns a boolean.
function isIE(){}





 // does what it says. Returns char [ocfi], or the string 'undefined' if
 // unknown/unsupported browser.
function detect_browser(){

  var browser = 'undefined';

       if ( isOpera() ) {
    browser = 'o';
  }
  else if ( isChrome() ) {
    browser = 'c';
  }
  else if ( isFirefotz() ) {
    browser = 'f';
  }
  else if ( isOpera() ) {
    browser = 'i';
  }

  return browser;
}




 // saves the given key-value pair to the respective, browser-dependent storage.
 // Parameter key must be a non-empty string.
function save_to_storage( key, value )
{
   // validate parameters.
  if (  (typeof key == 'string')  &&  (key !== '')  &&  (typeof value == 'string')  ) {

    switch ( detect_browser() ) {
      case 'o': {
        widget.preferences[key] = value;
        break;
      }

      case 'c': {
        localStorage[key] = value;
        break;
      }

      //case 'f': {}  // for the future.
      //case 'i': {}

      default: {
        console.log('[FLEX] Cannot save: unidentified browser.');
        break;
      }
    }  // end of ( switch case )
  }  // end of ( valid parameters )
  else {
    console.log('[FLEX] Could not save to storage: invalid parameters.');
  }
}


 // deletes a given key from the respective, browser-dependent storage.
 // Parameter key must be a non-empty string.
function delete_from_storage( key )
{
   // validate parameters.
  if (  (typeof key == 'string')  &&  (key !== '')  ) {

    switch ( detect_browser() ) {
      case 'o': {                         // the way  delete  works, I don't even
        delete widget.preferences[key];   // need to validate. No errors on null or undefined.
        break;
      }

      case 'c': {
        delete localStorage[key];
        break;
      }

      //case 'f': {}
      //case 'i': {}

      default: {
        console.log('[FLEX] Cannot delete: unidentified browser.');
        break;
      }
    }  // end of ( switch case )
  }  // end of ( valid parameters )
  else {
    console.log('[FLEX] Could not delete from storage: invalid parameters.');
  }
}


 // reads the given key from the respective, browser-dependent storage.
 // Parameter key must be a non-empty string.
//// … Errr, this one might actually be unnecessary. QUITE unnecessary.
function read_from_storage( key )
{
  var result = null;

   // validate parameters.
  if (  (typeof key == 'string')  &&  (key !== '')  ) {

    switch ( detect_browser() ) {
      case 'o': {
        result = widget.preferences[key];
        break;
      }

      case 'c': {
        result = localStorage[key];
        break;
      }

      //case 'f': {}
      //case 'i': {}

      default: {
        console.log('[FLEX] Cannot read: unidentified browser.');
        break;
      }
    }  // end of ( switch case )
  }  // end of ( valid parameters )
  else {
    console.log('[FLEX] Could not read from storage: invalid parameters.');
  }

  return result;
}


 // validates whether or not the browser-dependent storage is existant, available and
 // ready. Always returns boolean.
function validate_storage()
{
  var result = false;

  switch ( detect_browser() ) {
    case 'o': {
      result = !!widget  &&  !!widget.preferences;
      break;
    }

    case 'c': {
      result = !!localStorage;
      break;
    }

      //case 'f': {}
      //case 'i': {}

    default: {
      console.log('[FLEX] Cannot validate: unidentified browser.');
      break;
    }
  }  // end of ( switch case )

  return result;
}


 // retrieves the actual respective, browser-dependent storage object. Despite all these
 // previous methods I may still need the object itself, i.e. for loop iteration.
 // Returns an empty object on error.
function get_storage()
{
  var result = {};

  switch ( detect_browser() ) {
    case 'o': {
      result = widget.preferences;
      break;
    }

    case 'c': {
      result = localStorage;
      break;
    }

      //case 'f': {}
      //case 'i': {}

    default: {
      console.log('[FLEX] Cannot retrieve storage: unidentified browser.');
      break;
    }
  }  // end of ( switch case )

  return result;
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  S T O R A G E   I N T E R A C T I O N  ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


 // needed when publishing a new version.
if (false) {

   // count the modules, the attributes with the respective prefix.
  var module_index, modules = [];
  for ( module_index in woodbox.modules ) {
    if ( module_index.indexOf('pref') == 0 ) {
      modules.push(module_index);
    }
  }
  alert(modules.length);
}

