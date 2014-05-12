
/** options_defaults.js
*** Last Update: 2o14-o4-29
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


var
  x, options = {},
  woodbox = { items: {} },
  fadingTime = 300,
  slidingTime = 150,

   // declare two constants – in order to avoid stupid typo errors with unpredictable
   // consequences.
  ACTIVE   = 'active',
  INACTIVE = 'inactive';



 // one big options object to manage the preferences on the options/preferences page of FLEX.
options = {

   // just so that I know that the options object isn't empty at this point.
  initiated: true,


  pref_sort_filters: {

    state: INACTIVE,
    imgSource: 'img/sort_filters.png',
    description: "Lets you sort my Category Filter alphabetically, instead of using the dynamic order in dependence of the Pages. This option affects both filters, 'Search or Create' as well as 'Recent Pages'."
  },


  pref_hide_ticker: {

    state: INACTIVE,
    imgSource: 'img/hide_ticker.png',
    description: "I personally find them all annoying. Your call."
  },


  pref_clickarea: {

    state: ACTIVE,
    imgSource: 'img/expand_clickarea.png',
    description: "This not only affects the items in the mega-meta-master search but also those mini-boxes all over FL."
  },


  pref_fix_submit_search: {

    state: ACTIVE,
    imgSource: 'img/search_single.png',
    description: "By default, if you submit a mega-meta-master search it redirects you to the front page, regardless of the search results. I deactivated that. And as a bonus, single search results will be detected and handled accordingly."
  },


  pref_paint_history: {

    state: ACTIVE,
    imgSource: 'img/paint_history.png',
    description: "Where possible, I dynamically replaced the generic text with something more informative."
  },


  pref_leftright_paging: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> You can only browse through 'paged' areas, i.e. the Recent Pages, by scrolling to the pagination and clicking with the mouse.<br /><br />"
     +"<b>My Solution:</b> Now you can also go prev|next with the left|right arrow keys on your keyboard. Convenience!"
  },


  pref_toggle_spoilertitle: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> Spoiler-links keep saying \"Show Spoiler\" even when their respective hidden texts are opened up.<br /><br />"
     +"<b>My Solution:</b> Toggle \"Show\" with \"Hide\". It's that simple."
  },


  pref_anchor_consider_menu: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> Hashtagged links, most prominently forum timestamps, are scrolled to the very top of the screen, which is the default browser behavior, but FL uses a menu bar that lies on top of everything, so the posts are always partly cut off.<br /><br />"
     +"<b>My Solution:</b> Make any forum timestamps consider the menu height.<br /><br />"
     +"As a bonus, I am also highlighting the post in question."
  },


  pref_stop_happening: {

    state: ACTIVE,
    imgSource: '',
    description: "Reduces the functionality of the Happening Now box to \"React to user click, yes. Autonomously, no.\" Some things are just too annoying."
  },


  pref_soc_filter: {

    state: ACTIVE,
    imgSource: 'img/category_filter.jpg',
    description: "Filter the search results by category. It dynamically offers only the categories present in the results, not all of FL's categories."
  },


  pref_custom_quicklinks: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> The current selection is too static and not suitable for everyone.<br /><br />"
     +"<b>My Solution:</b> Users can customize them themselves via a drag and drop overlay menu."
  },


  pref_radio_vs_quicklinks: {

    state: ACTIVE,
    imgSource: 'img/slow_quick.png',
    description: "Fixes that, most unfavorably, you can have both selected at the same time: a quicklink and a slowlink. Which messes up the subsequent navigation of the category tree."
  },


  pref_category_tree: {

    state: ACTIVE,
    imgSource: 'img/category_tree.png',
    description: "Provides an always-current, clickable, in-document-searchable tree representing the current category system in use in FL. Sadly, I can only provide it when editing, not when adding (when it is most needed) … but still: better than nothing! Right?"
  },


  pref_yt_quickpaste: {

    state: ACTIVE,
    imgSource: 'img/quicken_paste.png',
    description: "Conveniently reduces a full YouTube-link pasted from the clipboard (possibly containing additional playlist-/etc.-information) to the mere YouTube-ID."
  },


  pref_textfocus_on_tabswitch: {

    state: ACTIVE,
    imgSource: 'img/focus_text.png',
    description: "Automatically focus the first available text field (move the cursor there) and bring it into view when switching the category."
  },


  pref_losefocus_on_submit: {

    state: INACTIVE,
    imgSource: '',
    description: "When submitting the form (with the Enter key) while you're inside an input field or combobox, automatically lose that focus. This makes it easier in Opera to use the hotkeys [1] and [2] to navigate to the neighbor tabs (and start editing the next prepared Page). Super convenient, imho. (Picture coming soon)"
  },


  pref_clickable_edit_minibox: {

    state: ACTIVE,
    imgSource: '',
    description: "(Picture coming soon)"
  },


  pref_create_at_top: {

    state: ACTIVE,
    imgSource: '',
    description: "When searching for other Pages while editing (i.e. a movie's actors), bring the 'Quick Create' link closer to the search field. Move it from below the search results to above them. (Picture coming soon)"
  },


  pref_losefocus_trackno: {

    state: INACTIVE,
    imgSource: '',
    description: "When editing an album's tracklist and leaving the browser tab, then returning (i.e. in order to fill the clipboard with the next track title), the focus is automatically moved from the track no. combobox to the text field. (Picture coming soon)"
  },


  pref_date_quickpaste: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> Dates are splitted into a combination of three comboboxes/fields, "
     +"making copy & paste impossible.<br /><br />"
     +"<b>My Solution:</b> I'm adding an intermediate field that translates \"date strings\" "
     +"into information that is comprehensible by these three comboboxes/fields."
  },


  pref_viewpage_fixstyling: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> When a Page is lacking comments and sidebar attributes, the footer runs into the \"user average score\" box.<br /><br />"
     +"<b>My Solution:</b> I'm giving the content area a minimum height attribute."
  },


  pref_expand_recentlists: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> The Recent Lists list lists only three lists. This is particularly a problem if you've been away from FL for more than a week and there have been quite a few new lists by now.<br /><br />"
     +"<b>My Solution:</b> I'm just listing 'em all. And I mean … <i>all!</i> … That enough for ya?!"
  },


  pref_editlist_fix_scrolltop: {

    state: ACTIVE,
    imgSource: '',
    description: "Make the list of search/letter results scroll back to top when new content is loaded. (Picture coming soon)"
  },


  pref_provide_preview: {

    state: ACTIVE,
    imgSource: 'img/preview_link.png',
    description: "Provides a convenient one-click way of opening a Page in another tab real quick, without the need to manually search or temporarily rank or anything."
  },


  pref_article_readability: {

    state: ACTIVE,
    imgSource: 'img/article_readability.png',
    description: "Moves the articles to the back of the title, to better/faster read why a Page is listed under the selected letter. Changeable on the fly. Unfortunately, it has to be manually re-set each time new content is loaded. (Picture coming soon)"
  },


  pref_detect_duplicates: {

    state: ACTIVE,
    imgSource: '',
    description: "If you hover over an unranked list item, my extension tries to load its image. It doesn't always work. In the future you'll be able to decide \"on duplicates\" vs. \"always\". (Picture coming soon)"
  },


  pref_fix_long_eligibility: {

    state: ACTIVE,
    imgSource: '',
    description: "The \"List Eligibility Requirements\" box was once design-distortingly long. It may happen again … (Picture coming soon)"
  },


  pref_optimize_olist_jumper: {

    state: ACTIVE,
    imgSource: '',
    description: "Reduces the redundancy inside the \"jump to other lists\" combobox a bit, thus making it a bit prettier. (Picture coming soon)"
  },


  pref_rp_filter: {

    state: ACTIVE,
    imgSource: 'img/category_filter.jpg',
    description: "Filter the Recent Pages by category. (better Picture coming soon)"
  },


  pref_self_jumper: {

    state: ACTIVE,
    imgSource: 'img/self_jumper.jpg',
    description: "When browsing another user's list (any list) or the combined chart, provide a button to instantly jump to the display of your own list (if available). (better Picture coming soon)"
  },


  pref_fix_thumb_aspectratio: {

    state: ACTIVE,
    imgSource: '',
    description:
      "<b>The Problem:</b> Many thumbnails all over FL have a broken aspect ratio.<br /><br />"
     +"<b>My Solution:</b> I've started fixing this. For now, only when viewing a user's list."
  },


  pref_forumbox_vertscroll: {

    state: ACTIVE,
    imgSource: 'img/forum_scrollbar.png',
    description: "Lets you scroll your unfinished posts! INSANITY ensues …"
  },


  pref_fix_yt_overlay_bug: {

    state: ACTIVE,
    imgSource: '',
    description: "If you scroll pages with a YouTube embed a bit down, they will lay over the FL header bar (apparently, only in Opera). (Picture coming soon)"
  },


  pref_debug_off: {

    state: ACTIVE,
    imgSource: '',
    description: "(Woody forgot to hide his annoying crap) (›‹ ) (Picture coming soon)"
  },


  pref_submit_with_enter: {

    state: ACTIVE,
    imgSource: '',
    description: "(Apart from the mega-meta-master search which works flawlessly everywhere, for unknown reasons) This was only an issue in Chrome, not Opera. (Picture coming soon)"
  },


};







 // needed when publishing a new version.
if (false) {

   // count the modules, the attributes with the respective prefix.
  var module_index, modules = [];
  for ( module_index in options ) {
    if ( module_index.indexOf('pref') == 0 ) {
      modules.push(module_index);
    }
  }
  alert(modules.length);
}

