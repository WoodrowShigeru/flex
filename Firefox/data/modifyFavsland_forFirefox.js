
/** modifyFavsland_forFirefox.js
*** Last Update: 2o15-11-o7
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


var
  Timer = 0,
  hello_Im_dragging = false,
  $drag_item = null,
  $scrolldoc = null,
  environment = {},
  remember = null,

   // options for my options, preferences for my preferences.
  opopSortFilters = false,
  opopComparatorAlways = true,

  all_lists = {},   // for quicker search-for-lists (until next page load).

   // FLEX imgs
  url_curtain = '',
  url_favsland_logo = '',
  url_pauseplay = '',

  user_quicklinks = [],
  metaMenuHeight = null,
  do_focus_first_field = false,
  modERLi = {},
  modQDtP = {},
  modQATl = {},
  modSFCL = {},
  trackpp_mode = true;


 // declare two constants – in order to avoid stupid typo errors with unpredictable
 // consequences.
var
  ACTIVE   = 'active',
  INACTIVE = 'inactive';


wood_expands_jquery();
analyze_environment();










//// DEVELOPMENT, but the raw features work!
//
 // this is quite qnd.
function setup_custom_quicklinks_combo()
{
   // validate environment.
  if ( $('h2:contains(Quicklinks)').next('ul').length ) {

     // debug.
    $('#wooden_output').text( user_quicklinks );

     // prepare elements.
    var
      button = '<a href="#" id="wooden_a_cuqu_enter" class="greenbutton">Customize</a>',
      curtain = '<div id="wooden_cuqu_curtain" style="background-image: url(\''+ url_curtain +'\');">'
        +'<div class="wooden_cuqu_baseline">'
        +'<div id="wooden_cuqu_pool" class="wooden_droppable"><div class="wooden_cuqu_overflow">'
        +'<ul></ul></div></div>'
        +'<div id="wooden_cuqu_selection" class="wooden_droppable"><div class="wooden_cuqu_overflow">'
        +'<ul></ul></div></div>'
        +'<a href="#" id="wooden_a_cuqu_leave" class="greenbutton">Done Bear</a>'
        +'<span style="clear: both;">&nbsp;</span>'
        +'</div></div><!-- /#wooden_cuqu_curtain -->';


     // inject elements.
    $('h2:contains(Quicklinks)', 'form[action*="/pages/add/categories"]')
      .before(button).before(curtain);


    // TODO / contemplate: maybe measure the bounds of each, pool and selection, once,
    //      and then attach them as  .data()  ? Instead of on each drop.


     // make the toggling work.
    var $butt_enter = $('#wooden_a_cuqu_enter');
    var $butt_leave = $('#wooden_a_cuqu_leave');

    $('#wooden_a_cuqu_enter').click(function(){

      enter_quicklinks_customize_mode();
      return false;
    });

    $('#wooden_a_cuqu_leave').click(function(){

      leave_quicklinks_customize_mode();
      return false;
    });


     // fill the lists.
    var $copy = $('select[name*="quicklinks"]').clone();

     // first, the pool.
    $( 'option:first', $copy ).remove();
    var s = $copy.html().replace( /\boption\b/gi, 'li class="wooden_draggable"' );
    $('#wooden_cuqu_pool ul').html(s);

     // then the selection.
    var $batch = $('#wooden_cuqu_pool li.wooden_draggable').filter(function(){

      var i = -1;
      if ( user_quicklinks.length ) {

        var val = String( $(this).val() );
        i = $.inArray( val, user_quicklinks );
      }

      return i != -1;
    }).detach();

    $batch.appendTo('#wooden_cuqu_selection ul');

    set_radios();



    $(window)
      .mousedown(cuqu_mousedown)
      .mousemove(cuqu_mousemove)
      .mouseup(cuqu_mouseup);

  }  // end of ( valid environment )
}


function enter_quicklinks_customize_mode() {

  $('#wooden_a_cuqu_enter').fadeOut();
  $('#wooden_cuqu_curtain').fadeIn();
}

function leave_quicklinks_customize_mode() {

  user_quicklinks = $('#wooden_cuqu_selection li.wooden_draggable').map(function(){

     // initially, I wanted to trim this as a safety measure. But it's a number,
     // no need to trim.
    return $(this).val();
  }).get();

  self.port.emit("setQuicklinks", user_quicklinks);

   // debug.
  $('#wooden_output').text( user_quicklinks );

  set_radios();

  $('#wooden_cuqu_curtain').fadeOut(function(){
    $('#wooden_a_cuqu_enter').fadeIn();
  });
}

function drag_qlink_with_mouse(e) {

  var
    $drag = $('.wooden_dragged'),
    $hover = $(e.target),   // obsolete?
    coords = {
      x: e.pageX,
      y: e.pageY,
      w: $drag.width()/2,
      h: $drag.height()/2
    };

  $drag
    .css( 'left', coords.x - coords.w )
    .css( 'top',  coords.y - coords.h );
}

 // determines whether or not an element is inside the bounds of a bigger "here" element
 // at the given time. Since I'm dragging with the object RIGHT UNDER the mouse, I can't
 // simply use srcTarget or something similar.
function does_drop_here( el, here ) {

  var bool = false;

  el = $(el);
  here = $(here);

   // validate parameters.
  if (  el.length  &&  here.length  &&  el.offset()  &&  here.offset()  ) {

    var
      coords = {
        x: 0,
        y: 0
      },
      bounds = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };

     // mouse cursor is in the very middle of the element. That's how my drag works.
    coords.x = el.offset().left + el.width()/2;
    coords.y = el.offset().top + el.height()/2;

    bounds.top    = here.offset().top;
    bounds.left   = here.offset().left;
    bounds.right  = here.offset().left + here.width();
    bounds.bottom = here.offset().top + here.height();

    bool =
      isBetween( bounds.left, coords.x, bounds.right, true )
  &&  isBetween( bounds.top, coords.y, bounds.bottom, true );  // don't forget that 0,0 is the TOP left corner.

  }  // end of ( valid parameters )

  return bool;
}

function cuqu_mousedown( e ) {

  if (  $(e.target).hasClass('wooden_draggable')  &&  (e.which == 1)  ) {

    hello_Im_dragging = true;
    $drag_item = $(e.target).addClass('wooden_dragged');
    drag_qlink_with_mouse(e);

     // disable text selection.
    return false;
  }
}

function cuqu_mousemove(e) {

  if ( hello_Im_dragging ) {

     // stop the drag if we're leaving the safe zone.
    if (  isBetween( 150, e.pageX, 1150 )
      &&  isBetween( 150, e.pageY, 850 )  ) {

      drag_qlink_with_mouse(e);
    }
  }  // end of ( what to do when dragging )
}

function cuqu_mouseup(e){

  if ( hello_Im_dragging ) {

    var
      validDrop = false,
      selector = '',
      $source = $(e.target).closest('.wooden_droppable');   // now it's the drag-source.


    if ( $source.length ) {
      switch ( $source.attr('id') ) {

        case "wooden_cuqu_pool": {

          if (does_drop_here( e.target, '#wooden_cuqu_selection' )) {

            validDrop = true;
            selector = '#wooden_cuqu_selection ul';
          }
          break;
        }

        case "wooden_cuqu_selection": {

          if (does_drop_here( e.target, '#wooden_cuqu_pool' )) {

            validDrop = true;
            selector = '#wooden_cuqu_pool ul';
          }
          break;
        }

        default: {
          break;
        }
      }

      if ( validDrop ) {

        save_quicklink( $drag_item.val() );
        $drag_item.removeClass('wooden_dragged').detach().appendTo(selector);
        $drag_item = null;
      }
    }  // end of ( found the source )

    hello_Im_dragging = false;
  }
}

function set_radios()
{

  //var user_quicklinks = [12,27,18];
  var $quicklinks_context = $('h2:contains(Quicklinks)').next('ul');

  var i;
//  console.log('user_quicklinks is array:');
//  console.log( IsArray(user_quicklinks) );   // Yes. Yes, it is. Even when one-item-ed or empty.
  for ( i = 0; i < user_quicklinks.length; i++ ) {

    if ( !isNaN(user_quicklinks[i]) ) {
      user_quicklinks[i] = String( user_quicklinks[i] );
    }
  }

  var $template = $('li', $quicklinks_context).add('#cats li').first().clone().attr('checked', null);
  var $source_items = $('select[name*="quicklinks"] option');
//  console.log('----------\nthis is the template.');
//  console.log($template);
//  console.log($source_items);
//  console.log(user_quicklinks);
  var $result = $source_items.map(function(){

    var $el = $(this), v = String( $el.val() );
    //v = (isNaN(v)) ? 'undefined' : parseInt(v, 10);
    if ( user_quicklinks.indexOf(v) != -1 ) {
      var $item = $template.clone();
      $item.find('input').attr({ value: v , id: 'c'+v });
      $item.find('label').attr( 'for', 'c'+v ).text( $el.text() );
      return $item;
    }
    else {
      return null;
    }
  });
  $quicklinks_context.find('li').remove();
//  console.log($result);
  for ( i = 0; i < $result.length; i++) {
    $quicklinks_context.append( $result[i] );
  }
}

function save_quicklink( id ) {

   // validate parameters.
  if (  (id !== undefined)  &&  (id !== null)  ) {
/*
    chrome.runtime.sendMessage({method: 'setQL', key: String(id)}, function(response){

      var o = (response) ? response.value : 'invalid';
      var item = $('#wooden_cuqu_pool li[value="'+ o +'"]');
      $('li:last', '#wooden_cuqu_selection').after( item.clone() );
    });
*/  }  // end of ( valid parameters )
}

































 // Let's wrap the code, even if unnecessary, for semantic's sake.
{  // ------------------- begin "pseudo-ready" -------------------

     // debug
//    $('body').append(
//      '<div id="wooden_output_container">'
//     +'  <h2>Debug</h2>'
//     +'  <div id="wooden_output">-</div>'
//     +'</div>'
//    );


     // retrieve the element which can be scrolled when trying to scroll
     // the document programmatically. ---> ‹body› or ‹html› (differs
     // between browsers, that's why I need a getter!)
    if ( $scrolldoc === null ) {
      $scrolldoc = get_doc_scrollElement();
    }

     // if there's a "choicelist" element, then apply this style to its
     // parent "cell". Since one module needs this, it's better to code
     // and style around if I set this in stone for all modules.
    $('.choicelist').closest('.cell').css('position', 'relative');



    remember =   (self.options)   ? self.options   : {};


     // --- prepare the resources. ---

    if ( remember.resource_curtain ) {
      url_curtain = remember.resource_curtain;
    }

    if ( remember.resource_favsland_logo ) {
      url_favsland_logo = remember.resource_favsland_logo;
    }

    if ( remember.resource_pauseplay ) {
      url_pauseplay = remember.resource_pauseplay;
    }



     // --- hook up the modules. ---

    hijack_logo();   // SPECIAL!


    self.port.on('got_pref', function(P){

       // validate Pref object.
      if (  P  &&  ((P.value === ACTIVE) || (P.pref === 'quicklinks'))  ) {

        switch (P.pref) {

          case "hide_ticker": {
            stop_the_ticker_and_hide_social();
            break;
          }

          case "expand_clickarea": {
            properly_linkify_sresults_and_miniboxes();
            break;
          }

          case "fix_submit_search": {
            fix_sresults_submit();
            break;
          }

          case "paint_history": {
            paint_doc_title();
            break;
          }

          case "leftright_paging": {
            leftright_paging();
            break;
          }

          case "toggle_spoilertitle": {
            toggle_spoilertitle();
            break;
          }

          case "stop_happening": {
            stop_happening();
            break;
          }

          case "soc_filter": {
            filter_soc_search_results();
            break;
          }

          case "quicklinks": {
            user_quicklinks = (P.value)   ? P.value.replace( / /g, '' ).split(',')   : [];
            break;
          }

          case "custom_quicklinks": {
            setup_custom_quicklinks_combo();
            break;
          }

          case "radio_vs_quicklinks": {
            fix_radio_vs_quicklinks();
            break;
          }

          case "category_tree": {
            add_category_tree();
            break;
          }

          case "yt_quickpaste": {
            quicken_YouTube_paste();
            break;
          }

          case "textfocus_on_tabswitch": {
            do_focus_first_field = true;
            auto_focus_first_field();
            break;
          }

//// Deactivated this module in Firefox altogether. There's no need for it,
//     no benefit from it.
//
          case "losefocus_on_submit": {
//            lose_focus_on_submit();
            break;
          }

          case "clickable_edit_minibox": {
            optimize_eap_miniboxes();
            break;
          }

          case "create_at_top": {
            set_up_create_create();
            break;
          }

//// Deactivated this module in Firefox altogether. This browser is a bit
//     stubborn in general when it comes to focusing, only little benefit anyway.
//
          case "losefocus_trackno": {
//            auto_blur_trackno_on_deactivate();
            break;
          }

          case "date_quickpaste": {
            set_up_date_paste();
            break;
          }

          case "viewpage_fixstyling": {
            fix_styling_viewpage();
            break;
          }

          case "apply_gender_to_cat": {
            apply_gender_to_cat();
            break;
          }

          case "expand_recentlists": {
            set_up_expand_recent_lists();
            break;
          }

          case "sorfilcat_gamingplats": {
            sorfilcat_lists_by_gaming();
            break;
          }

          case "activate_abc": {
            activate_abc_items();
            break;
          }

          case "editlist_fix_scrolltop": {
            fix_scrolltop_in_editlist();
            break;
          }

          case "provide_preview": {
            provide_preview_link();
            break;
          }

          case "article_readability": {
            set_up_article_readability();
            break;
          }

          case "fix_long_eligibility": {
            fix_toolong_eligibility_box();
            break;
          }

          case "optimize_olist_jumper": {
            optimize_jumper_to_other_lists();
            break;
          }

          case "categorize_eal": {
            set_up_categorize_EAL();
            break;
          }

          case "rp_filter": {
            filter_recent_pages();
            break;
          }

          case "self_jumper": {
            inject_self_jumper();
            break;
          }

          case "fix_thumb_aspectratio": {
            fix_thumb_aspectratio();
            break;
          }

          case "anchor_consider_menu": {
            anchor_consider_menu();
            break;
          }

          case "thereare_followupposts": {
            css_highlight_followup_thread_pages();
            break;
          }

          case "debug_off": {
            turn_debug_off();
            break;
          }

          case "sort_filters": {
            opopSortFilters = P.value === ACTIVE;
            break;
          }

          case "submit_with_enter": {
            submit_forms_with_enter_key();
            break;
          }

          case "quicken_album_tracklist": {
            set_up_quicken_album_tracklist();
            break;
          }

          case "prevnext_category": {
            prevnext_category();
            break;
          }

          case "eap_submit": {
            improve_EAP_update_button();
            break;
          }

          case "fix_fanpage_admin": {
            fix_fanpage_admin_overlay();
            break;
          }

          case "slapon_accesskeys": {
            slap_on_accesskeys();
            break;
          }

          case "track_plusplus": {
            setup_track_plusplus();
            break;
          }

          case "forumbox_vertscroll": {
            fix_forum_vert_scroll();
            break;
          }

          case "search_for_lists": {
            set_up_search_for_lists();
            break;
          }

          case "preview_pane": {
            set_up_preview_pane();
            break;
          }

          case "assisted_pagination": {
            eal_assisted_pagination();
            break;
          }

          default: {
            console.log( '[FLEX] Error: couldn´t find preference "'+ P.pref +'".' );
            break;
          }

        }  // end of ( switch case )
      }  // end of ( valid Pref object )
    });  // end of ( listen to "got_pref" message )


//console.log(remember.preferences);
//console.log(typeof remember.preferences);

     // call this first! And exclude it in the following for-loop.
    self.port.emit('get_pref', 'sort_filters');


     // send "get_pref" messages for each module.
    if ( remember.preferences ) {
      for ( x in remember.preferences ) {
        if ( x !== 'sort_filters' ) {
          self.port.emit('get_pref', x);
        }
      }
    }


}  // ------------------- end of ( pseudo-ready ) -------------------


