
/** handle_woodbox.js
*** Last Update: 2o16-11-3o
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
************************ FIREFOX DEBUGGING MODE BREAKS THE TIMESTAMP
***
***
*** The purpose of the woodbox:
***
***     FLEX accesses the localStorage intensively – which has different names depending
***   on the browser, unfortunately. This custom-made interface deals with that.
***
***     Furthermore, the woodbox updates the localStorage if it has been already
***   established in a previous version of FLEX.
***
***     This needs to be a separate file because this code is needed in both environments,
***   the background script as well as the options/preferences.
**/

// TODO  clean up: commentary blocks are a bit messed up now.



//////////////////////////////////////// LEGEND /////////////////////////////////////////
/////  E N D   P R E V I O U S  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////  B E G I N   N E X T  /////
/////////////////////////////////////////////////////////////////////////////////////////

;
var
  woodbox = null,
  flex = null
;
flex = (function(){

  /** The Tool Methods:
   *
   * is_opera()
   * is_chrome()
   * is_firefotz()
   * is_ie()
   * detect_browser()
   *
   * flex.is_empty_object( obj )
  */


   // identifies the Opera browser. Always returns a boolean.
   // Opera support is only guaranteed for Opera 12.16 / Opera Presto.
  function is_opera(){

    return !!window.navigator.userAgent.match(/Opera/);
  }


   // identifies the Chrome browser. Always returns a boolean.
  function is_chrome(){

    return !!window.navigator.userAgent.match(/Chrome/);
  }


   // identifies the Firefox browser. Always returns a boolean.
  function is_firefotz(){

    return !!window.navigator.userAgent.match(/Firefox/);
  }


   // identifies the Internet Explorer browser. Always returns a boolean.
  function is_ie(){

  	return false;   // not necessary, don't want to support it.
  }



   // does what it says. Returns either the char [ocfi], or the string 'unknown'.
  function detect_browser(){
    var
      browser_localscope = ''
    ;
    switch (true) {

      case is_opera():
        browser_localscope = 'o';
      break;

      case is_chrome():
        browser_localscope = 'c';
      break;

      case is_firefotz():
        browser_localscope = 'f';
      break;

      case is_ie():
        browser_localscope = 'i';
      break;

      default:
        browser_localscope = 'unknown';
      break;

    }  // end of ( switch case )

    return browser_localscope;
  }



/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////  S T O R A G E   I N T E R A C T I O N  /////
/////////////////////////////////////////////////////////////////////////////////////////

  return {
    browser: detect_browser(),

    is_empty_object: function( obj ){
       // because ( Object.keys(new Date()).length === 0 )
       // we have to do some additional check
       //
       // http://stackoverflow.com/a/32108184/2126442
      return  (Object.keys(obj).length === 0)  &&  (obj.constructor === Object);
    },


  /** The Model Methods:
   *
   * flex.save_to_storage( key, value )
   * flex.delete_from_storage( key )
   * flex.get_from_storage( key )
   * flex.get_storage_key( num )
   * flex.validate_storage()
   * flex.get_storage()
  */

     // saves the given key-value pair to the respective, browser-dependent storage.
     // Parameter key must be a non-empty string.
    save_to_storage: function( key, value ){
      try {
        console.log('save_to_storage()', key, value);
        switch (flex.browser) {
          case 'o': {
            widget.preferences[key] = value;
            break;
          }

          case 'c': {
            localStorage.setItem(key, value);
            break;
          }

          case 'f':
          case 'i':
          default: {
            console.log('[FLEX] Cannot save: this browser is not supported.');
            break;
          }
        }  // end of ( switch-case: browser )

      } catch (ex) {
        console.log('[FLEX] Could not save to storage.');
        console.log('[FLEX] given key:', key);
        console.log('[FLEX] given value:', value);
        console.log(ex);
      }
    },  // end of ( func: save_to_storage )


     // deletes a given key from the respective, browser-dependent storage.
     // Parameter key must be a non-empty string.
    delete_from_storage: function( key ){

       // validate parameters.
      if ((typeof key != 'string')
      ||  (key === '')
      ) {
        console.log('[FLEX] Could not delete from storage: invalid parameters.');

      } else {
      console.log('delete_from_storage()');
        switch (flex.browser) {
          case 'o': {                         // the way  delete  works, I don't even
            delete widget.preferences[key];   // need to validate. No errors on null or undefined.
            break;
          }

          case 'c': {
            localStorage.removeItem(key);
            break;
          }

          case 'f':
          case 'i':
          default: {
            console.log('[FLEX] Cannot delete: this browser is not supported.');
            break;
          }
        }  // end of ( switch case )
      }  // end of ( valid parameters )
    },  // end of ( func: delete_from_storage )


     // gets the value from the browser-dependent storage. This is a general "read from storage".
    get_from_storage: function( key ){
      var
        value = ''
      ;
      switch (flex.browser) {
        case 'o': {
          value = widget.preferences[key];
          break;
        }

        case 'c': {
          value = localStorage.getItem(key);
          break;
        }

        case 'f':
        case 'i':
        default: {
          console.log('[FLEX] Cannot get the value: this browser is not supported.');
          break;
        }
      }  // end of ( switch case )

       // rewrite Boolstring into Boolean.
      if (value === 'true') {
        value = true;

      } else if (value === 'false') {
        value = false;
      }

      return value;
    },  // end of ( func: get_from_storage )


     // retrieves the available key in the storage at the "num-th" position (0-based).
     // necessary for while-looping.
    get_storage_key: function( num ){
      var
        key = ''
      ;
      try {
        switch (flex.browser) {
          case 'o': {
            key = Object.keys(widget.preferences)[num];
            break;
          }

          case 'c': {
            key = localStorage.key(num);
            break;
          }

          case 'f':
          case 'i':
          default: {
            console.log('[FLEX] Cannot get the key: the woodbox is not supported for this browser.');
            break;
          }
        }  // end of ( switch case )

      } catch (ex) {
        console.log('[FLEX] Could not get the key.');
        console.log('[FLEX] given num:', num);
        console.log(ex);

        key = '';
      }

      return key;
    },  // end of ( func: get_storage_key )


    set_storage_activity: function( key, activity ){
      var
        module = flex.get_from_storage(key)
      ;
      try {
        module = JSON.parse(module);
        module.active = (activity === true);
        flex.save_to_storage(key, JSON.stringify(module));

      } catch (ex) {
        console.log('[FLEX] Could not set the module activity for ‹'+ key +'› within the storage.');
        console.log(ex);
      }
    },  // end of ( func: set_storage_activity )


     // validates whether or not the browser-dependent storage is existant, available and
     // ready. Always returns boolean.
    validate_storage: function(){
      var
        result = false
      ;
      switch (flex.browser) {
        case 'o': {
          result = !!(widget  &&  widget.preferences);
          break;
        }

        case 'c': {
          result = !!localStorage;
          break;
        }

        case 'f':
        case 'i':
        default: {
          console.log('[FLEX] Cannot validate: this browser is not supported.');
          break;
        }
      }  // end of ( switch case )

      return result;
    },  // end of ( func: validate_storage )


     // retrieves the actual respective, browser-dependent storage object. Despite all these
     // previous methods I may still need the object itself, i.e. for loop iteration.
     // Returns an empty object on error.
    get_storage: function(){
      var
        result = {}
      ;
      try {
        console.log('get_storage()', flex.browser);
        switch (flex.browser) {
          case 'o': {
            result = widget.preferences;
            break;
          }

          case 'c': {
            result = localStorage;
            break;
          }

          case 'f':
          case 'i':
          default: {
            console.log('[FLEX] Cannot retrieve storage: this browser is not supported.');
            break;
          }
        }  // end of ( switch case )

      } catch (ex) {
        console.log('[FLEX] Could not get storage.');
        console.log(ex);
      }

      return result;
    },  // end of ( func: get_storage )



/////////////////////////////////////////////////////////////////////////////////////////
/////  S T O R A G E   I N T E R A C T I O N  ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////  T O O L S /////
/////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////
/////  T O O L S ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

  };  // end of ( return giant {} )

})();   // end of ( factory: flex ) =====================================================


//console.log('flex', flex);




woodbox = (function( flex ){

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////  I N S T A N T I A T I O N  /////
/////////////////////////////////////////////////////////////////////////////////////////

  /** The Instantiation Methods:
   *
   * build_woodbox()
  */

  var
    wb = { modules: {}, renamed_modules: {} },

    deprecated = {
      ACTIVE:     'active',
      INACTIVE: 'inactive'
    }
  ;



   // builds a totally fresh woodbox object from scratch.
  function build_woodbox(){

    wb.modules = {

      sort_filters: {

        activeByDefault: false,
        imgSource: 'sort_filters.png',
        description: "Lets you sort my Category Filter alphabetically, instead of using the dynamic order in dependence of the Pages.<br /><br />"
       +"This option affects both filters, 'Search or Create' as well as 'Recent Pages'.",
        deprecated: true,
        sub: {}
      },


      hide_ticker: {

        activeByDefault: false,
        imgSource: 'hide_ticker.png',
        description: "I personally find them all annoying. Your call.",
        deprecated: false,
        sub: {}
      },


      expand_clickarea: {

        activeByDefault: true,
        imgSource: 'expand_clickarea.png',
        description: "You can now click on the *entire* box area, not just the text/image. This not only affects the items in the master-search but also those mini-boxes all over FL.",
        deprecated: false,
        sub: {}
      },


      fix_submit_search: {   // rename? fix master-search

        activeByDefault: true,
        imgSource: 'search_single.png',
        description: "By FL default, if you submit a master-search it redirects you to the front page, regardless of the search results. I deactivated that. And as a bonus, single search results will be detected and handled accordingly. (buggy)",
        deprecated: false,
        sub: {}
      },


      paint_history: {

        activeByDefault: true,
        imgSource: 'paint_history.png',
        description: "Where possible, I dynamically replaced the generic text with something more informative.",
        deprecated: false,
        sub: {}
      },


      leftright_paging: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The pagination of multi-page areas, i.e. forum threads, is often out of immediate reach.<br /><br />"
         +"<b>My Solution:</b> Now you can also go prev|next with <kbd>\u2190</kbd>|<kbd>\u2192</kbd>. Convenience!",
        deprecated: false,
        sub: {}
      },


      toggle_spoilertitle: {

        activeByDefault: true,
        imgSource: '',
        description:
          "Togglingly adds a distinction between opened and closed spoilers, saying \"Hide\" instead of \"Show\".",
        deprecated: false,
        sub: {}
      },


      slapon_accesskeys: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Favsland doesn't use <a href='https://en.wikipedia.org/wiki/Access_key' target='_blank'>HTML accesskeys</a>.<br /><br />"
         +"<b>My Solution:</b> I'll add some, then.<br /><br />So far, only this: <kbd>S</kbd> —› master-search",
        deprecated: false,
        sub: {}
      },


      stop_happening: {

        activeByDefault: true,
        imgSource: '',
        description: "Stops the broken \"Happening Now\" box automation.",
        deprecated: false,
        sub: {}
      },


      edit_is_in_the_way: {

        activeByDefault: true,
        imgSource: 'edit_is_in_the_way.jpg',
        description: "As the world-famous Engineer said: \"I´m movin´ this.\"",
        deprecated: false,
        sub: {}
      },


      search_for_lists: {

        activeByDefault: true,
        imgSource: 'search_lists.png',
        description: "I know that many have asked for this and I´ve made it happen: you can now textually search for available Lists.",
        deprecated: false,
        sub: {}
      },


      soc_filter: {

        activeByDefault: true,
        imgSource: 'category_filter.jpg',
        description: "Filter the search results by category. It dynamically offers only the categories that are present in the results.",
        deprecated: false,
        sub: {}
      },


      custom_quicklinks: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The current selection is too static and not suitable for everyone.<br /><br />"
         +"<b>My Solution:</b> Users can customize them themselves via a drag and drop overlay menu.",
        deprecated: false,
        sub: {
          set: []
        }
      },


      radio_vs_quicklinks: {

        activeByDefault: true,
        imgSource: 'slow_quick.png',
        description: "Fixes that, most unfavorably, you can have both selected at the same time: a quicklink and a combobox item. Which messes up the subsequent navigation of the category tree.",
        deprecated: false,
        sub: {}
      },


      category_tree: {

        activeByDefault: true,
        imgSource: 'category_tree.png',
        description: "Provides an always-current, clickable, in-document-searchable tree representing the current category system in use in FL.",
        deprecated: false,
        sub: {}
      },


      yt_quickpaste: {

        activeByDefault: true,
        imgSource: 'quicken_paste.png',
        description: "Conveniently reduces a full YouTube-link pasted from the clipboard (possibly containing additional playlist-/etc.-information) to the mere YouTube-ID. — (buggy in the \"Song › Music Clip\" field)",
        deprecated: false,
        sub: {}
      },


      textfocus_on_tabswitch: {

        activeByDefault: true,
        imgSource: 'focus_text.png',
        description: "When switching categories, automatically focus the first available text field for a faster editing workflow.",
        deprecated: false,
        sub: {}
      },


      losefocus_on_submit: {

        activeByDefault: false,
        imgSource: '',
        description: "When submitting the form (with the Enter key) while you're inside an input field or combobox, automatically lose that focus. This makes it easier in Opera to use the hotkeys [1] and [2] to navigate to the neighbor tabs (and start editing the next prepared Page). Super convenient, imho. (Picture coming soon)",
        deprecated: true,
        sub: {}
      },


      clickable_edit_minibox: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Everywhere it shows up in the Favsland, you can click on a minibox and it'll take you to its Page. It acts like a link. Everywhere except in the Edit-a-Page environment (i.e. the search). Because clicking on the minibox rather \"selects\" it.<br /><br />"
         +"<b>My Solution:</b> I'm adding an extra button/link specifically in this environment.",
        deprecated: false,
        sub: {}
      },


      create_at_top: {

        activeByDefault: true,
        imgSource: '',
        description: "When searching for other Pages while editing (i.e. a movie's actors), bring the 'Quick Create' link closer to the search field.",
        deprecated: false,
        sub: {}
      },


      losefocus_trackno: {

        activeByDefault: false,
        imgSource: '',
        description: "When editing an album's tracklist and leaving the browser tab, then returning (i.e. in order to fill the clipboard with the next track title), the focus is automatically moved from the track no. combobox to the text field. (Picture coming soon)",
        deprecated: false,
        sub: {}
      },


      date_quickpaste: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Dates are splitted into a combination of three comboboxes/fields, "
         +"making copy & paste impossible.<br /><br />"
         +"<b>My Solution:</b> I'm adding an intermediate field that translates \"date strings\" "
         +"into information that is comprehensible by these three comboboxes/fields.",
        deprecated: false,
        sub: {}
      },


      viewpage_fixstyling: {

        activeByDefault: true,
        imgSource: '',
        description:
          "Provide a minimum height for bare Pages that you can rate but have no comments or side info.",
        deprecated: false,
        sub: {}
      },


      apply_gender_to_cat: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The category always says \"Actor/Actress\" regardless of gender.<br /><br />"
         +"<b>My Solution:</b> I make it so that it instead says either \"Actor\" or \"Actress\", if possible.",
        deprecated: false,
        sub: {}
      },


      crossreferencing: {

        activeByDefault: true,
        imgSource: 'crossreferencing.png',
        description:
          "Types of supported cross-references:<br />"
         +"- episodes in a tv show<br />"
         +"- levels in a video game<br />"
         +"- songs in an album<br />"
         +"- books in a collection<br />"
         +"- books in a series<br />"
         +"- movies in a series<br />"
         +"- video games in a series",
        deprecated: false,
        sub: {}
      },


      expand_recentlists: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> My module has been ported over to the Favsland! … But it doesn´t feature the secret lists.<br /><br />"
         +"<b>My Solution:</b> I modified my old implementation to also remove the live version.",
        deprecated: true,
        sub: {}
      },


      sorfilcat_gamingplats: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Displaying all gaming platforms at once can be a bit overwhelming when you're searching something specific.<br /><br />"
         +"<b>My Solution:</b> I'm adding a few gizmos so that users can apply dynamic filters to the list.",
        deprecated: false,
        sub: {}
      },


      activate_abc: {

        activeByDefault: true,
        imgSource: '',
        description:
          "Highlights the currently selected letter (if any).",
        deprecated: false,
        sub: {}
      },


      editlist_fix_scrolltop: {

        activeByDefault: true,
        imgSource: '',
        description: "Make the left box scroll back up when a long list of new content is loaded.",
        deprecated: false,
        sub: {}
      },


      provide_preview: {

        activeByDefault: true,
        imgSource: 'preview_link.png',
        description: "Provides a convenient one-click way of opening a Page in another tab real quick, without the need to manually search or temporarily rank or anything.",
        deprecated: false,
        sub: {}
      },


      article_readability: {

        activeByDefault: true,
        imgSource: 'article_readability.png',
        description: "Let users toggle between the notations \"The Example\" and \"Example, The\" – for better readability. (Unfortunately, can't make this setting permanent)",
        deprecated: false,
        sub: {}
      },


      fix_long_eligibility: {

        activeByDefault: true,
        imgSource: '',
        description: "The \"List Eligibility Requirements\" box tears apart the site design when it has long content.",
        deprecated: false,
        sub: {}
      },


      optimize_olist_jumper: {

        activeByDefault: true,
        imgSource: '',
        description: "Reduces the redundancy inside the \"jump to other lists\" combobox a bit, thus making it a bit prettier and easier to read. (Picture coming soon)",
        deprecated: false,
        sub: {}
      },


      categorize_eal: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Browsing items you want to rank just alphabetically can be a bit of a hassle – especially since there's sometimes already a category at hand.<br /><br />"
         +"<b>My Solution:</b> I grab all the categories (<i>of the current selection!</i>) and list them in a clickable manner, so that only a segment is listed. I.e. all Britney Spears songs.",
        deprecated: false,
        sub: {}
      },


      preview_pane: {

        activeByDefault: true,
        imgSource: 'preview-pane.gif',
        description:
          "<b>The Problem:</b> The native preview thumbnail is great, but it often gets in the way.<br /><br />"
         +"<b>My Solution:</b> There's plenty of room on the right side. (See? I'm thinking <i>outside the box</i> ;^)",
        deprecated: false,
        sub: {}
      },


      assisted_pagination: {

        activeByDefault: true,
        imgSource: 'assisted-pagination.png',
        description:
          "<b>The Problem:</b> The super slim scroll bar is too awkward to use most of the times, especially without a mouse wheel (i.e. on notebooks).<br /><br />"
         +"<b>My Solution:</b> Without replacing anything, I add buttons to click, making it seem like you browse a continuous list <i>in paginated steps</i>.<br /><br />Don't let the appearance fool you, btw. The click area is much more generous than the slim button makes it out to be. (see&nbsp;screenshot)",
        deprecated: false,
        sub: {}
      },


      rp_filter: {

        activeByDefault: true,
        imgSource: 'category_filter.jpg',
        description: "Filter the Recent Pages by category. (better Picture coming soon)",
        deprecated: false,
        sub: {}
      },


      self_jumper: {

        activeByDefault: true,
        imgSource: 'self_jumper.jpg',
        description: "When browsing another user's list (any list) or the combined chart, provide a button to instantly jump to the display of your own list (if available). (better Picture coming soon)",
        deprecated: false,
        sub: {}
      },


      fix_thumb_aspectratio: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Many thumbnails all over FL have a broken aspect ratio.<br /><br />"
         +"<b>My Solution:</b> I've started fixing this. For now, only when viewing a user's list.",
        deprecated: false,
        sub: {}
      },


      cssfix_avatar_img_behind_name: {

        activeByDefault: true,
        imgSource: 'cssfix_avatar_img_behind_name.png',
        description:
          "<b>The Problem:</b> Weirdly, Favsland natively has this CSS bug where on most /users/ pages, "
         +"the user's avatar image appears behind the user's name in the top left corner. Cropped and "
         +"unintendedly, obviously.<br /><br />"
         +"<b>My Solution:</b> I remove that image.",
        deprecated: false,
        sub: {}
      },


      forumbox_vertscroll: {

        activeByDefault: true,
        imgSource: 'forum_scrollbar.png',
        description: "Lets you scroll your unfinished posts! INSANITY ensues …",
        deprecated: false,
        sub: {}
      },


      anchor_consider_menu: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Hashtagged links, most prominently forum timestamps, are scrolled to the very top of the screen, which is the default browser behavior, but FL uses a menu bar that lies on top of everything, so the posts are always partly cut off.<br /><br />"
         +"<b>My Solution:</b> Make any forum timestamps consider the menu height.<br /><br />"
         +"As a bonus, I am also highlighting the post in question.",
        deprecated: false,
        sub: {}
      },


      quicken_album_tracklist: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The tracks of a music album have to be added, typed, copy-pasted, whatever-ed one by one.<br /><br />"
         +"<b>My Solution:</b> I replaced some of the typing with more convenient clicking.",
        deprecated: false,
        sub: {}
      },


      track_plusplus: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> When adding tracks to an album one by one, you have to manually set the track number, even though you're most probably adding the tracks in numerical order.<br /><br />"
         +"<b>My Solution:</b> I'm making that selection <i>for</i> the user, programmatically.",
        deprecated: false,
        sub: {}
      },


      eap_prevnext_tab: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Frequently having to change from using keyboard+mouse to using the keyboard alone back and forth can be a hassle if you're editing many Pages in succession.<br /><br />"
         +"<b>My Solution:</b> Change to the next|previous tab via an <kbd>ALT</kbd> + <kbd>PAGE-UP|DOWN</kbd> press.",
        deprecated: false,
        sub: {}
      },


      eap_submit: {

        activeByDefault: true,
        imgSource: '',
        description:
          "I'm modifying the appearance of the Submit button in this environment.",
        deprecated: false,
        sub: {}
      },


      thereare_followupposts: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> Users often fail to notice that the last post displayed is in fact <i>not</i> the last post in the thread. The links/buttons are styled in gray, and gray on gray is hard to say— err, see.<br /><br />"
         +"<b>My Solution:</b> I am modifying the necessary CSS.",
        deprecated: false,
        sub: {}
      },


      eap_highlight_current_tab: {

        activeByDefault: true,
        imgSource: 'eap_highlight_current_tab.png',
        description:
          "<b>The Problem:</b> I'm surprised some people didn't notice that this environment has tabs – but to be fair: they <i>are</i> badly styled.<br /><br />"
         +"<b>My Solution:</b> I am modifying the necessary CSS.",
        deprecated: false,
        sub: {}
      },


      clarify_categories: {

        activeByDefault: true,
        imgSource: 'clarify_categories.png',
        description:
          "<b>The Problem:</b> It isn't intuitive that the first (top-most) category is the <i>primary</i> category, and that you can drag them with the gray box.<br /><br />"
         +"<b>My Solution:</b> I am modifying the necessary CSS to make that more clear.",
        deprecated: false,
        sub: {}
      },


      fix_fanpage_admin: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The fan page header has broken CSS for fan page admins if you hover with the mouse over it.<br /><br />"
         +"<b>My Solution:</b> I'm fixing it.",
        deprecated: false,
        sub: {}
      },


      handle_too_large_overlayboxes: {

        activeByDefault: true,
        imgSource: '',
        description:
          "<b>The Problem:</b> The soft popups that overlay the website (i.e. a Page's \"Wikipedia description\"), when filled with plenty of content, can be too large to fit the screen.<br /><br />"
         +"<b>My Solution:</b> I'm fixing it.",
        deprecated: false,
        sub: {}
      },


      embed_chat: {

        activeByDefault: true,
        imgSource: 'embed_chat.png',
        description:
          "Embed the Favslist chatroom from Chatango on the front page.",
        deprecated: false,
        sub: {}
      },


      debug_off: {

        activeByDefault: false,
        imgSource: '',
        description: "(Woody forgot to hide his annoying crap) (›‹ )",
        deprecated: true,
        sub: {}
      },


      submit_with_enter: {

        activeByDefault: true,
        imgSource: '',
        description: "(Apart from the mega-meta-master search which works flawlessly everywhere, for unknown reasons) This was only an issue in Chrome, not Opera. (Picture coming soon)",
        deprecated: true,
        sub: {}
      },


    };  // end of ( wb.modules )



    wb.renamed_modules = {
      prevnext_category: 'eap_prevnext_tab',

    };  // end of ( renamed_modules )


  /** The Woodbox Methods:
   *
   * woodbox.write( key, value )
   * woodbox.write_activity( key, activity )
   * woodbox.get_sub( key, subkey )
   * woodbox.set_sub( key, subkey, value )
   * woodbox.get_quicklinks()
  */

     // create a method that saves into the browser-dependent storage as well as the woodbox
     // at once.
    wb.write = function( key, value ) {
      flex.save_to_storage( key, value );
    };

    wb.write_activity = function( key, activity ){
      flex.set_storage_activity(key, activity);
    };

     // this is storage interaction!
    wb.get_sub = function( key, subkey ){
      var
        v, value = ''
      ;
      try {
        v = flex.get_from_storage(key);
        v = JSON.parse(v);
        v = v.sub[subkey];

        if (v) {
          value = v;
        }

      } catch (ex) {
        console.log('[FLEX] Could not get the subkey.');
        console.log('[FLEX] Given key:', key);
        console.log('[FLEX] Given subkey:', subkey);
        console.log(ex);
      }
      return value;
    };

    wb.set_sub = function( key, subkey, value ){
      var
        module = ''
      ;
      try {
        module = flex.get_from_storage(key);
        module = JSON.parse(module);
        if (
            (module.sub[subkey] !== undefined)
        &&  (value !== null)
        &&  (value !== undefined)
        ) {
          module.sub[subkey] = value;
          flex.save_to_storage( key, JSON.stringify(module) );
        }

        // TODO  again, what about woodbox itself?!

      } catch (ex) {
        console.log('[FLEX] Could not set the subkey.');
        console.log('[FLEX] Given key:', key);
        console.log('[FLEX] Given subkey:', subkey);
        console.log('[FLEX] Given value:', value);
        console.log(ex);
      }
    };


     // let's try to provide a streamlined function that returns reliable values: an array of integers.
    wb.get_quicklinks = function(){
      var
        x, set = []
      ;
      try {
        set = wb.modules.custom_quicklinks.sub.set;
        for (x in set) {
          set[x] = isNaN(set[x])  ? 0  : parseInt(set[x], 10);
        }

      } catch (ex) {
        console.log('[FLEX] Cannot get the quicklinks.');
        console.log(ex);
        set = [];
      }
      return set;
    };


     // just so that I know that the object isn't empty at this point.
    wb.instantiated = true;
    wb.loaded = false;
  }



/////////////////////////////////////////////////////////////////////////////////////////
/////  I N S T A N T I A T I O N  ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////  S E T   U P   M E T H O D S  /////
/////////////////////////////////////////////////////////////////////////////////////////

  /** The Main Methods:
   *
   * load_user_settings()
   * bring_storage_up_to_speed()
   *
   * woodbox.init()
   * woodbox.load()
   * woodbox.update()
  */

   // fills the woodbox with the content from the storage.
  function load_user_settings() {

     // better to validate it right away to make the subsequent validations more elegant.
     // This case will probably never happen (in Chrome) – I wouldn't know how – but safe is safe.
    if ( !flex.validate_storage() ) {
      console.log('[FLEX] No storage object available. Cannot continue loading the user settings.');
      return false;
    }

    var
      m = '',
      user_value = '',
      storage_module = {},
      sub = {}
    ;
     // at this point, storage already has the brand-new modules while the deprecated ones have been deleted.
    for (m in wb.modules) {
      if (!wb.modules[m].deprecated) {
        try {
          storage_module = flex.get_from_storage(m);
          storage_module = JSON.parse(storage_module);

          wb.modules[m].active = storage_module.active;
          if (storage_module.sub) {
            wb.modules[m].sub = storage_module.sub;
          }

        } catch (ex) {
          console.log('[FLEX] Cannot load module ‹'+m+'› from storage.');
          console.log(ex);
          wb.modules[m].active = wb.modules[m].activeByDefault !== false;
        }
      }
    }

    wb.loaded = true;
  }



  wb.update = function(){

    bring_storage_up_to_speed();
    load_user_settings();

    console.assert(
      wb.loaded,
      '[FLEX] Error: update went wrong.'
    );
  }

   // searches for old formatting in the storage and updates it, if necessary.
   // Updates it to more resemble the new woodbox.
   // Is called once on extension update/installation.
  function bring_storage_up_to_speed(){
    var
      i = 0,
      key = '',
      value = '',
      old_key = '',
      has_old_format = false,
      item =tmp  = {},
      moved = {
        quicklinks: null,
        sort_filters: null
      },
      storage_items = []
    ;

     // because I will delete while looping and don't want to confuse the index,
     // I'm going to loop only indirectly.
    storage_items = Object.keys(flex.get_storage());

     // go through each item already in the storage.
    for (i = 0; i < storage_items.length; i++) {
      key = storage_items[i];
      value = flex.get_from_storage(key);
        // raw value. Could be:
        // - "active", "inactive"
        // - true, false
        // - "{"active":true,"sub":{etc.}}"
        // - "6,49,192,5"
        // - nothing FLEX-related at all (safety precaution)


       // rewrite key if modules has been renamed.
      if (key in wb.renamed_modules) {
        old_key = key;
        key = wb.renamed_modules[key];
      } else {
        old_key = '';
      }

       // does the value have an old format?
      has_old_format = (value === deprecated.ACTIVE)  ||  (value === deprecated.INACTIVE);
      if (has_old_format) {
        value = value === deprecated.ACTIVE;
      }

       // move sub-settings away from storage-root.
      if (key in moved) {
        moved[key] = value;
        flex.delete_from_storage(key);

         // check if module exists.
      } else if (item = wb.modules[key]) {
         // delete modules that simply shouldn't be here anymore.
        if (item.deprecated) {
          flex.delete_from_storage(key);

         // save new format, if necessary.
        } else if (has_old_format) {
          tmp = {
            active: value
          };
          if (!flex.is_empty_object(item.sub)) {
            tmp.sub = item.sub;
          }
          flex.save_to_storage(key, JSON.stringify(tmp));
          if (old_key) {
            flex.delete_from_storage(old_key);
          }

         // save old value (which definitely has new format at this point)
         // under new name.
        } else if (old_key) {
          flex.save_to_storage(key, value);
          flex.delete_from_storage(old_key);
        }

         // end of ( module exists )
      } else {
        console.log('module does not exist:', key);
      }
    }  // end of ( for-loop: each storage item )


     // loop over moved (pre-defined by FLEX update):
     // restore the modules you have moved just now, as sub-settings.
    for (key in moved) {
      value = moved[key];

       // if it isn't a proper value, then it wasn't found in the current storage.
       // Which means: it has been moved already in a previous update! (very important!)
      if (value !== null) {
         // moved modules need special care, which only a switch-case can provide.
        switch (key) {


          case 'quicklinks':
  console.log('Shmock. The value is:', value);
            tmp = JSON.parse(flex.get_from_storage('custom_quicklinks'));
            tmp.sub = {
              set: value,
              checked: 100
            };
            flex.save_to_storage('custom_quicklinks', JSON.stringify(tmp));
          break;


          case 'sort_filters':
             // soc_filter.
            tmp = JSON.parse(flex.get_from_storage('soc_filter'));
            tmp.sub = {
              sorted: value
            };
            flex.save_to_storage('soc_filter', JSON.stringify(tmp));

             // rp_filter.
            tmp = JSON.parse(flex.get_from_storage('rp_filter'));
            tmp.sub = {
              sorted: value,
              pos: {
                x: 200,
                y: 350
              }
            };
            flex.save_to_storage('rp_filter', JSON.stringify(tmp));
          break;


        }  // end of ( switch-case )
      }  // end of ( freshly moved )
    }  // end of ( loop: restore moved )


     // loop over woodbox, add new modules.
    for (key in wb.modules) {
      item = wb.modules[key];

       // identify brand-new modules.
      if (  !item.deprecated  &&  !(key in moved)  &&  (flex.get_from_storage(key) === null)  ) {
        tmp = {
          active: item.activeByDefault
        };
        if (!flex.is_empty_object(item.sub)) {
          tmp.sub = item.sub;
        }
        flex.save_to_storage(key, JSON.stringify(tmp));

      }  // end of ( new module )
    }  // end of ( for-loop over all woodbox modules )
  }



   // fills the empty glovar woodbox.
  wb.init = function(){

    if (!wb.instantiated) {
      build_woodbox();
    }

    console.assert(
      wb.instantiated,
      '[FLEX] Error: woodbox initiation went wrong.'
    );
  }


   // loads any user-customized settings from the localStorage.
  wb.load = function(){

    load_user_settings();

    console.assert(
      wb.loaded,
      '[FLEX] Error: preference initiation went wrong.'
    );

  }




/////////////////////////////////////////////////////////////////////////////////////////
/////  S E T   U P   M E T H O D S  /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


  return wb;

})(flex);   // end of ( factory: woodbox ) ==================================================

//console.log('end of handle_woofwoof:', woodbox);

