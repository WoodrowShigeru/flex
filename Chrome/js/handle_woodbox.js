
/** handle_woodbox.js
*** Last Update: 2o15-11-o7
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

   // declare two constants.
  ACTIVE   = 'active',
  INACTIVE = 'inactive'
;



 // builds a totally fresh woodbox object from scratch.
function build_woodbox()
{
   // for completion's sake. (saving these in localStorage is more important than in woodbox).
  woodbox.quicklinks = '';


   // one big modules sub-object to manage the preferences on the options/preferences page of FLEX.
  woodbox.modules = {


   // these modules also all have "state: null" as an attribute on-init. But that's too redundant to
   // write.


    sort_filters: {

      defaultState: INACTIVE,
      imgSource: 'sort_filters.png',
      description: "Lets you sort my Category Filter alphabetically, instead of using the dynamic order in dependence of the Pages.<br /><br />"
     +"This option affects both filters, 'Search or Create' as well as 'Recent Pages'."
    },


    hide_ticker: {

      defaultState: INACTIVE,
      imgSource: 'hide_ticker.png',
      description: "I personally find them all annoying. Your call."
    },


    expand_clickarea: {

      defaultState: ACTIVE,
      imgSource: 'expand_clickarea.png',
      description: "You can now click on the *entire* box area, not just the text/image. This not only affects the items in the master-search but also those mini-boxes all over FL."
    },


    fix_submit_search: {   // rename? fix master-search

      defaultState: ACTIVE,
      imgSource: 'search_single.png',
      description: "By FL default, if you submit a master-search it redirects you to the front page, regardless of the search results. I deactivated that. And as a bonus, single search results will be detected and handled accordingly. (buggy)"
    },


    paint_history: {

      defaultState: ACTIVE,
      imgSource: 'paint_history.png',
      description: "Where possible, I dynamically replaced the generic text with something more informative."
    },


    leftright_paging: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The pagination of multi-page areas, i.e. forum threads, is often out of immediate reach.<br /><br />"
       +"<b>My Solution:</b> Now you can also go prev|next with the left|right arrow keys on your keyboard. Convenience!"
    },


    toggle_spoilertitle: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "Togglingly adds a distinction between opened and closed spoilers, saying \"Hide\" instead of \"Show\"."
    },


    slapon_accesskeys: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Favsland doesn't use <a href='https://en.wikipedia.org/wiki/Access_key' target='_blank'>HTML accesskeys</a>.<br /><br />"
       +"<b>My Solution:</b> I'll add some, then.<br /><br />So far, only this: [s] —› master-search"
    },


    stop_happening: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "Stops the broken \"Happening Now\" box automation."
    },


    edit_is_in_the_way: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "The \"Edit\"-etc. options of a status/comment are often in the way (i.e. of a link). This module moves it out of the way into the free space below."
    },


    search_for_lists: {

      defaultState: ACTIVE,
      imgSource: 'search_lists.png',
      description: "I know that many have asked for this and I´ve made it happen: you can now textually search for available Lists."
    },


    soc_filter: {

      defaultState: ACTIVE,
      imgSource: 'category_filter.jpg',
      description: "Filter the search results by category. It dynamically offers only the categories that are present in the results."
    },


    custom_quicklinks: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The current selection is too static and not suitable for everyone.<br /><br />"
       +"<b>My Solution:</b> Users can customize them themselves via a drag and drop overlay menu."
    },


    radio_vs_quicklinks: {

      defaultState: ACTIVE,
      imgSource: 'slow_quick.png',
      description: "Fixes that, most unfavorably, you can have both selected at the same time: a quicklink and a combobox item. Which messes up the subsequent navigation of the category tree."
    },


    category_tree: {

      defaultState: ACTIVE,
      imgSource: 'category_tree.png',
      description: "Provides an always-current, clickable, in-document-searchable tree representing the current category system in use in FL."
    },


    yt_quickpaste: {

      defaultState: ACTIVE,
      imgSource: 'quicken_paste.png',
      description: "Conveniently reduces a full YouTube-link pasted from the clipboard (possibly containing additional playlist-/etc.-information) to the mere YouTube-ID. — (buggy in the \"Song › Music Clip\" field)"
    },


    textfocus_on_tabswitch: {

      defaultState: ACTIVE,
      imgSource: 'focus_text.png',
      description: "When switching categories, automatically focus the first available text field for a faster editing workflow."
    },


    losefocus_on_submit: {

      defaultState: INACTIVE,
      imgSource: '',
      description: "When submitting the form (with the Enter key) while you're inside an input field or combobox, automatically lose that focus. This makes it easier in Opera to use the hotkeys [1] and [2] to navigate to the neighbor tabs (and start editing the next prepared Page). Super convenient, imho. (Picture coming soon)"
    },


    clickable_edit_minibox: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Everywhere it shows up in the Favsland, you can click on a minibox and it'll take you to its Page. It acts like a link. Everywhere except in the Edit-a-Page environment (i.e. the search). Because clicking on the minibox rather \"selects\" it.<br /><br />"
       +"<b>My Solution:</b> I'm adding an extra button/link specifically in this environment."
    },


    create_at_top: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "When searching for other Pages while editing (i.e. a movie's actors), bring the 'Quick Create' link closer to the search field."
    },


    losefocus_trackno: {

      defaultState: INACTIVE,
      imgSource: '',
      description: "When editing an album's tracklist and leaving the browser tab, then returning (i.e. in order to fill the clipboard with the next track title), the focus is automatically moved from the track no. combobox to the text field. (Picture coming soon)"
    },


    date_quickpaste: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Dates are splitted into a combination of three comboboxes/fields, "
       +"making copy & paste impossible.<br /><br />"
       +"<b>My Solution:</b> I'm adding an intermediate field that translates \"date strings\" "
       +"into information that is comprehensible by these three comboboxes/fields."
    },


    viewpage_fixstyling: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "Provide a minimum height for bare Pages that you can rate but have no comments or side info."
    },


    apply_gender_to_cat: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The category always says \"Actor/Actress\" regardless of gender.<br /><br />"
       +"<b>My Solution:</b> I make it so that it instead says either \"Actor\" or \"Actress\", if possible."
    },


    expand_recentlists: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> My module has been ported over to the Favsland! … But it doesn´t feature the secret lists.<br /><br />"
       +"<b>My Solution:</b> I modified my old implementation to also remove the live version."
    },


    sorfilcat_gamingplats: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Displaying all gaming platforms at once can be a bit overwhelming when you're searching something specific.<br /><br />"
       +"<b>My Solution:</b> I'm adding a few gizmos so that users can apply dynamic filters to the list."
    },


    activate_abc: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "Highlights the currently selected letter (if any)."
    },


    editlist_fix_scrolltop: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "Make the left box scroll back up when a long list of new content is loaded."
    },


    provide_preview: {

      defaultState: ACTIVE,
      imgSource: 'preview_link.png',
      description: "Provides a convenient one-click way of opening a Page in another tab real quick, without the need to manually search or temporarily rank or anything."
    },


    article_readability: {

      defaultState: ACTIVE,
      imgSource: 'article_readability.png',
      description: "Let users toggle between the notations \"The Example\" and \"Example, The\" – for better readability. (Unfortunately, can't make this setting permanent)"
    },


    fix_long_eligibility: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "The \"List Eligibility Requirements\" box tears apart the site design when it has long content."
    },


    optimize_olist_jumper: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "Reduces the redundancy inside the \"jump to other lists\" combobox a bit, thus making it a bit prettier and easier to read. (Picture coming soon)"
    },


    categorize_eal: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Browsing items you want to rank just alphabetically can be a bit of a hassle – especially since there's sometimes already a category at hand.<br /><br />"
       +"<b>My Solution:</b> I grab all the categories (<i>of the current selection!</i>) and list them in a clickable manner, so that only a segment is listed. I.e. all Britney Spears songs."
    },


    preview_pane: {

      defaultState: ACTIVE,
      imgSource: 'preview-pane.gif',
      description:
        "<b>The Problem:</b> The native preview thumbnail is great, but it often gets in the way.<br /><br />"
       +"<b>My Solution:</b> There's plenty of room on the right side. (See? I'm thinking <i>outside the box</i> ;^)"
    },


    assisted_pagination: {

      defaultState: ACTIVE,
      imgSource: 'assisted-pagination.png',
      description:
        "<b>The Problem:</b> The super slim scroll bar is too awkward to use most of the times, especially without a mouse wheel (i.e. on notebooks).<br /><br />"
       +"<b>My Solution:</b> Without replacing anything, I add buttons to click, making it seem like you browse a continuous list <i>in paginated steps</i>.<br /><br />Don't let the appearance fool you, btw. The click area is much more generous than the slim button makes it out to be. (see&nbsp;screenshot)"
    },


    rp_filter: {

      defaultState: ACTIVE,
      imgSource: 'category_filter.jpg',
      description: "Filter the Recent Pages by category. (better Picture coming soon)"
    },


    self_jumper: {

      defaultState: ACTIVE,
      imgSource: 'self_jumper.jpg',
      description: "When browsing another user's list (any list) or the combined chart, provide a button to instantly jump to the display of your own list (if available). (better Picture coming soon)"
    },


    fix_thumb_aspectratio: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Many thumbnails all over FL have a broken aspect ratio.<br /><br />"
       +"<b>My Solution:</b> I've started fixing this. For now, only when viewing a user's list."
    },


    forumbox_vertscroll: {

      defaultState: ACTIVE,
      imgSource: 'forum_scrollbar.png',
      description: "Lets you scroll your unfinished posts! INSANITY ensues …"
    },


    anchor_consider_menu: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Hashtagged links, most prominently forum timestamps, are scrolled to the very top of the screen, which is the default browser behavior, but FL uses a menu bar that lies on top of everything, so the posts are always partly cut off.<br /><br />"
       +"<b>My Solution:</b> Make any forum timestamps consider the menu height.<br /><br />"
       +"As a bonus, I am also highlighting the post in question."
    },


    quicken_album_tracklist: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The tracks of a music album have to be added, typed, copy-pasted, whatever-ed one by one.<br /><br />"
       +"<b>My Solution:</b> I replaced some of the typing with more convenient clicking."
    },


    track_plusplus: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> When adding tracks to an album one by one, you have to manually set the track number, even though you're most probably adding the tracks in numerical order.<br /><br />"
       +"<b>My Solution:</b> I'm making that selection <i>for</i> the user, programmatically."
    },


    prevnext_category: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Frequently having to change from using keyboard+mouse to using the keyboard alone back and forth can be a hassle if you're editing many Pages in succession.<br /><br />"
       +"<b>My Solution:</b> Change to the next|previous category content via an [ALT + PAGE-UP|DOWN] press."
    },


    eap_submit: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "I'm modifying the appearance of the Submit button in this environment."
    },


    thereare_followupposts: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> Users often fail to notice that the last post displayed is in fact <i>not</i> the last post in the thread. The links/buttons are styled in gray, and gray on gray is hard to say— err, see.<br /><br />"
       +"<b>My Solution:</b> I am modifying the necessary CSS."
    },


    fix_fanpage_admin: {

      defaultState: ACTIVE,
      imgSource: '',
      description:
        "<b>The Problem:</b> The fan page header has broken CSS for fan page admins if you hover with the mouse over it.<br /><br />"
       +"<b>My Solution:</b> I'm fixing it."
    },


    debug_off: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "(Woody forgot to hide his annoying crap) (›‹ )"
    },


    submit_with_enter: {

      defaultState: ACTIVE,
      imgSource: '',
      description: "(Apart from the mega-meta-master search which works flawlessly everywhere, for unknown reasons) This was only an issue in Chrome, not Opera. (Picture coming soon)"
    },


  };


   // create a method that saves into the browser-dependent storage as well as the woodbox
   // at once.
  woodbox.write = function( key, value ) {
    save_to_storage( key, value );
  };


   // just so that I know that the object isn't empty at this point.
  woodbox.initiated = true;
  woodbox.synched = false;   // oy! "synchronized" is a reserved word in JavaScript.
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  I N S T A N T I A T I O N  ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////  S E T   U P   M E T H O D S  /////
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
     // (don't overwrite the resource settings).
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
/////  S E T   U P   M E T H O D S  /////////////////////////////////////////////////////
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

 // identifies the Internet Explorer browser. (Always returns a boolean.)
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
  else if ( true || isOpera() ) {
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

 // retrieves only the modules of the actual respective, browser-dependent storage
 // object. More specifically: only the module names, as an array. Returns an empty
 // array on error.
function get_modules()
{
  var
    x, result = [];

  for ( x in woodbox.modules ) {
    result.push(x);
  }

  return result;
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  S T O R A G E   I N T E R A C T I O N  ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

