
/** modules.js
*** Last Update: 2o15-11-o8
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/

// Need this for Opera; doesn't matter for Chrome.
// ==UserScript==
//@include http://www.favslist.com/*
//@include https://www.favslist.com/*
//@include http://*.favslist.com/*
//@include https://*.favslist.com/*

//@exclude http://*/*.jpg
//@exclude http://*/*.jpeg
//@exclude http://*/*.png
//@exclude http://*/*.gif
//@exclude https://*/*.jpg
//@exclude https://*/*.jpeg
//@exclude https://*/*.png
//@exclude https://*/*.gif
// ==/UserScript==


//////////////////////////////////////// LEGEND /////////////////////////////////////////
/////  E N D   P R E V I O U S  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////  B E G I N   N E X T  /////
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////  T O O L S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // --- TAKEN FROM MY "global_js/helpers.js" FILE. --- //
 // determines whether or not a number is between two other numbers. It's a common thing
 // to test, hence a glo-func.
 // PARAM. isInclusive: optional boolean determining whether or not to include the
 // start|end-borders. Default is non-inclusive.
function isBetween( start, x, end, isInclusive ) {

   //---- VALIDATION -----//
  if (  !isNaN(start)  &&  !isNaN(x)  &&  !isNaN(end)  ) {

    if (isInclusive) {
      return (start <= x) && (x <= end);
    }
    else {
      return (start < x) && (x < end);
    }
  }

  else {
    return false;
  }
}



 // in case I forgot something before publishing a new FLEX version.
function turn_debug_off()
{
  $('#wooden_output_container').hide();
}



 // retrieves the YouTube ID from a given full YouTube url.
function retrieve_YouTube_id( url )
{
  var matches = [], Hilf = url;

  url = (url) ? url.trim() : "undefined";

   // detect abbreviated links.
   // http://youtu.be/FFt-x6ucABU
  if ( !(matches = url.match(   /^https?:\/\/youtu.be\/([a-zA-Z0-9-_]+)(?:&.+)?/   )) ) {

     // detect complex long links, with or without extra parameters.
     // https://www.youtube.com/watch?v=RPAI_kmIGI4&list=PLB2E4D6B92832F90D
    if ( !(matches = url.match(   /www\.youtube(?:-nocookie)?\.com\/[^\"]+[\?\&]v=([a-zA-Z0-9-_]+)(?:&.+)?$/   )) ) {

        // detect iFrame embed.
        // <iframe width="560" height="315" src="//www.youtube.com/embed/S7b1aLY3tyI"
        //  frameborder="0" allowfullscreen></iframe>
      matches = url.match(   /www\.youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9-_]+)(?:&.+)?/   );
    }
  }

   // if either has been found, with a valid ID.
  if (  matches  &&  (matches.length > 1)  ) {
    Hilf = matches[1];
  }

  return Hilf;
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  T O O L S  ///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////  O M N I - P R E S E N T  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // stops the fucking annoying ticker, hides the annoying social buttons.
 // I wish I could merely delay the socialbox' up-popping, or replace hover with click.
 // But nope, nothing works. So, I have to completely hide it.
function stop_the_ticker_and_hide_social()
{
  $('div.ticker_wrapper').html( "Woody successfully removed the annoying ticker." )
    .css('font-weight','normal');

  $('li.social', '.menu').add('.announce', '.menu').hide();
}



 // fixes the links in the mini-box of search results that belongs to the
 // mega-meta-master quick-search, meaning that the whole list item becomes clickable.
 // In fact, let's do the same with every (non-hover) appearance of the mini-box.
function properly_linkify_sresults_and_miniboxes()
{
   // lol, it's such an identical procedure that I can use the very same routine! (›‹ )
   // Hence, the following for-loop.
  var i, selectors = [ '#searchresults li.result', 'div.blockpage' ], $el, $a;

  for ( i = 0; i < selectors.length; i++ )
  {
     // copy the various events of the ‹a› and paste it onto the ‹li›.
     // (it's actually a reproduction and not a proper copy)
    $('body').on('mouseenter', selectors[i], function(){
      $el = $(this).css('cursor', 'pointer');
      $a = $('a', $el);
      if ( $a.length )
        window.status = $a.get(0).href;
      // window.status only works in Opera, btw. It is NOT ALLOWED in other browsers. … Pfft, lame.

    }).on('mouseleave', selectors[i], function(){
      window.status = "";

    }).on('click', selectors[i], function(){
      $a = $('a', this);
      if ( $a.length )
        window.location.href = $a.get(0).href;
    });

  }  // end of ( for each selector )
}



 // on submit of the mega-meta-master search, loads the single search result if the
 // search brought exactly one result. Otherwise, do nothing.
function fix_sresults_submit()
{
  $('form[action*="search"]', '#alltop').submit(function(e){
     // stop the broken redirect to the front page, in any case.
    e.preventDefault();

    var $results = $('li.result');
    if ( $results.length == 1 )
      window.location.href = $('a', $results).attr('href');
  });

   // if you type enter (rather than clicking the submit button), a new search is
   // triggered, resulting in an empty search results list for a short time.
  $(document).on('keydown', '#searchbox', function(e){
    if ( e.which == 13 )
    {
      e.preventDefault();
      $(this).closest('form').submit();
    }
  });
}


 // changes the document's title, if necessary. Because otherwise, every second web page
 // says just "Favslist" – the history is unnavigatable like that!
function paint_doc_title()
{
   // analyze title
  if (  document  &&  document.title  &&  (document.title.toLowerCase() == "favslist")  )
  {
     // find a better title.
    var better = "";
    if ( better = $('h1:first').text() )
    {
       // change title appearance now.
      document.title = better;
       // change this current document's appearance in the browser history.
      window.history.replaceState( {state:0}, better, window.location.href );
      // irreproducably buggy in Chrome. Does jQ search too early?
    }
  }
}



 // lets the user submit any form with the enter key. The way it should be. (Actually, this is a
 // Chrome-specific issue, it already works flawlessly in Opera. However, the mega-meta-master
 // search does submit with enter in Chrome, funnily enough …).
function submit_forms_with_enter_key()
{
  $(document).on('keyup', 'form', function(e){
    if ( e.which == 13 )
    {
       // get the actual source element.
      var src = ( src = $(e.target).get(0) )
            ? src.nodeName.toLowerCase() : null;

      if (  (e.which == 13)  &&  (src != "textarea")  )
        $(this).submit();
    }
  });
}



 // sets up functionality so that users can hit the left|right arrow keys which will
 // redirect the current page to a contextually appropriate previous|next page if the
 // context supports "paging", i.e. Recent Pages, subforums, threads.
function leftright_paging()
{
  var $pagerlinks = $('.pagination a.no');

   // validate environment for the setup.
  if ( $pagerlinks.length ) {
    $('body').keyup(function(e){

       // abort redirection if the text cursor is inside elements that actually use
       // the arrow keys themselves.
      if ( $(e.target).is('input, textarea, select') ) {
        return false;
      }

       // --- prepare redirect and validate for the key-up event ---
      var
        pIndex = $('.pagination strong:last'),  // current index
        prevnext = [],
        limits = [1,0],
        url = $pagerlinks.last().text(),
        delimiter = '';

       // get the "right limit". (abusing url because I don't want too many one-time variables)
      limits[1] = (isNaN(url)) ? 0 : parseInt(url, 10);

       // get current index as a numeric and calculate prev|next values.
      pIndex =
        ( isNaN(pIndex.text()) ) ? 1 : parseInt( pIndex.text(), 10 );
      prevnext = [ pIndex-1, pIndex+1 ];

       // validate request.
       // ‹— 37      —› 39
      if ((  (e.which == 37)  &&  (limits[0] <= prevnext[0])  )
       || (  (e.which == 39)  &&  (prevnext[1] <= limits[1])  )) {

         // prepare the new target page index, complete with the right delimiter.
        pIndex = String( prevnext[( (e.which == 37) ? 0 : 1 )] -1 );
        delimiter =
          ( window.location.href.match( /\/forums\/[^\/]+$/ ) ) ? '-' : '/';

         // remove the current pIndex. We got our own.
         // grab any potential hash, while you're here.
        url = window.location.href.replace( /[\-\/]p\d+(?:#.*)?/, '' );

         // --- FINALLY! Execute redirect ---
        window.location.href = url +delimiter +'p'+ pIndex;

      } // end of ( valid request )
    });  // end of ( body key up )
  }  // end of ( valid environment )
}



 // gives those spoiler-links more context-sensitively appropriate text.
function toggle_spoilertitle()
{
   // get all relevant links, from past, present, future … and do the magic.
  $(document).on('click', 'p.spoiler a',                  function(){

    var $el = $(this);
    $el.text(  ($el.text() == 'Show Spoiler') ? 'Hide Spoiler' : 'Show Spoiler'  );
  });
}



 // I have hereby declared a price for using FLEX! (^__^ )
function hijack_logo()
{
  if ( url_favsland_logo !== '' ) {

     // inject my version of the FL logo.
    $('#top.all .logo').css({ backgroundImage: 'url('+ url_favsland_logo +')' , width: 210 });

     // my logo is a bit wider which is why I need to reduce the size of the neighbor element.
    $('#searchbox').css('width', 390);
  }
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  O M N I - P R E S E N T  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////  S E A R C H   F O R   L I S T S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // sets the module "Search for Lists" in place.
function set_up_search_for_lists()
{
   // injection.
  $('#top .options li.search').after(
    '<li class="sfl-search-lists sfl-hidden">'
   +  '<form>'
   +    '<input type="text" name="term" class="search" autocomplete="off" placeholder="Search for lists!" />'
   +    '<input type="submit" class="submit" />'
   +    '<a href="#" class="submit"></a>'
   +  '</form>'

   +  '<ul id="searchresults_for_lists" class="sfl-hidden">'
   +    '<li class="info sfl-sticky">'
   +      'Lists'
   +      '<span class="sfl-length">(<span>12</span>)</span>'
   +      '<span class="sfl-close">&#10006;</span>'
   +      '<span class="sfl-pagination sfl-next sfl-active">&#9654;</span>'
   +      '<span class="sfl-pagination sfl-prev"           >&#9664;</span>'
   +    '</li>'
   +    '<li class="sfl-sticky sfl-no-match sfl-hidden">No match has been found.</li>'
   +  '</ul><!-- /#searchresults_for_lists -->'

   +'</li><!-- /.sfl-search-lists -->'
  )
    .parent('.options').append(
      '<li id="sfl_toggler_reference"><span>… and Lists!</span></li>'
    )
  ;
  var
    $sresults = $('#searchresults_for_lists'),
    $search_for_lists = $('li.sfl-search-lists'),
    timer = null,
    time_limit = 800
  ;

   // clickability: toggle between the native search-for-all (except lists) form
   // and my search-for-lists form.
  $('#sfl_toggler_reference span').click(function(){
    var
      $el = $(this),
      $original_search = $('li.search'),
      $both = $original_search.add($search_for_lists),
      access = $both.find('input.search').attr('accesskey')
    ;
     // on-toggle, copy the term and move the accesskey from one form to the other.
    $both
      .find('input.search')
        .attr('accesskey', null)
        .filter(':hidden')
          .val( $both.find('input.search:visible').val() )
          .attr( 'accesskey', access )
        .end()
      .end()
      .toggleClass('sfl-hidden')
      .find('input.search:visible')
        .focus()
    ;
     // change text.
    $el
      .toggleClass('sfl-active')
      .html( $el.is('.sfl-active')  ? '&#65513;'  : '… and Lists!' )
    ;
     // potentially start a new search for Lists when toggling to SfL with a given term.
    if (  !!$search_for_lists.find('input.search:visible').val()
      &&  $sresults.is('.sfl-hidden')
    ) {
       // just show if it has merely been hidden.
      if ( $sresults.has('li.result').length ) {
        unhide_sfl_results();
       // start a new search.
      } else {
        ready_list_model();
        search_for_lists();
      }
    }
  });  // end of ( toggler )


   // start a search for Lists on-form-submit.
  $search_for_lists.find('form')
    .submit(function(e){
      ready_list_model();
      search_for_lists();

       // prevent it from submitting twice, measure #1 (a known jQuery bug)
      e.stopPropagation();
      e.preventDefault();
    })
     // clicking the identical looking submit button also submits this new form.
    .find('a').click(function(e){
      $search_for_lists.find('form').submit();

      e.stopPropagation();
      e.preventDefault();
    })
  ;  // end of ( form )


   // closing (not hiding) the search results: via close button [x].
  $('.sfl-close').click(reset_sfl_form);


   // hide results popup if user is right now deleting the term.
  $search_for_lists.find('input.search').on('input', function(){   // .on(input) detects mouse key up presses, ctrl+z,
    if ( !$(this).val() ) {                                        // and also cut via mouse context menu thingy.
      reset_sfl_form();
    }
  })
     // show search results on focus.
    .focus(function(){
      unhide_sfl_results();
    })

    .keydown(function(e){
      switch (e.which) {
         // prevent it from submitting twice, measure #2
        case 13:
          e.stopPropagation();
          e.preventDefault();
          break;

         // hide (but not close) results on-ESC.
        case 27:
          $sresults.addClass('sfl-hidden');
           // not sresult is hidden and input has the focus. Can't show it on-focus.
           // Hence, this trick.
          $search_for_lists.on('click.on_already_focused', 'input.search', function(){
            $sresults.filter('.sfl-hidden').removeClass('sfl-hidden');
            $search_for_lists.off('click.on_already_focused');
          });
          break;
      }
    })  // end pf ( keydown )

    .keyup(function(e){
      var
        key = e.which
      ;
      switch (true) {
         // bugfix: the native "submit form on-keyup" logic – for some reason –
         // doesn't work on certain parts of FL.
         // i.e.  http://www.favslist.com/forums/List-Suggestions-358-p6#21107
        case (key == 13):
          $search_for_lists.find('form').submit();

          e.stopPropagation();
          e.preventDefault();
          break;

         // don't submit on command keys like CTRL, etc.
        case (
          $.inArray(key, [9,16,17,18,19,20,27,32,33,34,35,36,37,38,39,40,91,92,93,
                          112,113,114,115,116,117,118,119,120,121,122,123,144,145]
          ) != -1
        ):
          // do nothing.
          break;

         // submit the form if the user entered a term and started idling,
         // but hasn't hit enter yet.
        default:
          clearTimeout(timer);
          var
            $input = $(this)
          ;
          timer = setTimeout(function(){
            var
              old_term = $sresults.data('represents_term'),
              new_term = $input.val()
            ;
            if (  timer                    // #1  time is up.
              &&  new_term                 // #2  term is non-empty.
              &&  (new_term != old_term)   // 3#  no search has been done with this term yet.
            ) {
              $search_for_lists.find('form').submit();
            }
          }, time_limit);
          break;

      }  // end of ( switch-case )
    })  // end of ( keyup )
  ;  // end of ( input.search )

   // clicking the search results away.
  $(document).click(function(e){
    var
      $el = $(e.target),
      selector = '.sfl-search-lists, #sfl_toggler_reference'
    ;
    if ( !($el.is(selector) || $el.closest(selector).length) ) {
      hide_sfl_results();
    }
  });

   // paginate controller clicking.
  $('.sfl-pagination').click(function(){
    var
      $controller = $(this),
      is_next = $controller.is('.sfl-next'),
      visible_edge =
        $sresults.find(
          'li.result:not(.sfl-hidden)' + (is_next  ? ':last'  : ':first')
        ).index('li.result'),
      step = 10 +1,  // +1 due to how .nextUntil() and .prevUntil() work (excluding the target).
      $new_set = $()
    ;

     // leave routine now if controller is deactivated (hard edge).
    if ( $controller.is(':not(.sfl-active)') ) {
      return false;
    }

     // hide last set, concentrate on edge.
    $new_set = $sresults.find('li.result').addClass('sfl-hidden')
      .eq(visible_edge)
    ;
     // define new set.
    $new_set = is_next
      ? $new_set.nextUntil( $sresults.find('li.result').eq(visible_edge + step) )
      : $new_set.prevUntil( $sresults.find('li.result').eq(visible_edge - step) )
    ;
     // show it.
    $new_set = $new_set.not('.sfl-sticky')
      .removeClass('sfl-hidden')
       // concentrate on edge, for immediate check. Is always the right edge,
       // due to how prevUntil works.
      .last()
    ;

     // potentially deactivate prev button …
    $('.sfl-pagination.sfl-prev').addElseRemoveClass(
      $new_set.prevUntil('.sfl-sticky').length,
      'sfl-active'
    );
     // … and next button.
    $('.sfl-pagination.sfl-next').addElseRemoveClass(
      $new_set.nextUntil().length,
      'sfl-active'
    );
  });  // end of ( controller)


   // minor usability fix: expand click area of matches.
  $sresults.on('click', 'li.result', function(){
    var
      url = $(this).find('a').attr('href')
    ;
    if (url) {
      window.location.href = url;
    }
  })
  ;  // end of ( ‹li› within search results )
}


 // provides a minimalistical representation of all the FL lists.
 // Returns nothing, but fills the glovar all_lists (assoc_array).
function ready_list_model()
{
   // if unitiated (once per page load), then generate it
   // … with some AJAX help!
  if ( $.isEmptyObject(all_lists) ) {
    $.ajax({
      url: '/account/lists/',
      processData: false,
      type: 'POST',
      dataType: 'html',

      error: function(a, b, error_thrown){
        $('#searchresults_for_lists')
          .html('AJAX Error:<br />'+ error_thrown);   // untested. I don't know how.
      },  // i.e. if not logged in.

      success: function(data){
        var
          i, tmplist = []
        ;
        all_lists = {};

         // pasting the full HTML document inside a jQuery $() brace,
         // get and remap all relevant links.
        tmplist = $(data).find('#content a').map(function(){
          var
             // id, title, simplified-title, img-src, view-url
            id= t= s= i= u  = null
          ;                                                      // example:
          id = this.href.replace( /^.*account\/lists\/?/, '' );  // 3
          t = $(this).text();                                    // Current Fav Five
          s = t.replace( /\&/g, 'and' )                          // Current-Fav-Five
               .replace( /['']/g, '' )
               .replace( /[ :_+\/\\]/g, '-' );
          i = s +'-'+ id+ '.jpg';                                // Current-Fav-Five-3.jpg
          u = this.href                                          // lists/Current-Fav-Five/3
               .replace( 'account/', '' )
               .replace( 'lists/', 'lists/'+ s +'/' );

          return { id:id, title:t, simplified:s, img_src:i, url:u };
        }).get();


         // use remapped list to fill all_lists with.
         // (nothing more than convert pure_array to assoc_array)
        for ( i = 0; i < tmplist.length; i++ ) {
          all_lists[ tmplist[i].id ] = tmplist[i];
        }

         // re-do the search (asynchronously).
        search_for_lists();

      }  // end of ( success )
    });  // end of ( ajax )
  }  // end of ( glovar is empty )
}


 // executes an individual search.
function search_for_lists()
{
  var
    $sresults = $('#searchresults_for_lists'),
    $no_match = $sresults.find('.sfl-no-match'),
    $match_count = $sresults.find('.sfl-length span'),
    $set = $(),
    original_input = $('.sfl-search-lists form input.search').val(),
    terms = [],
    step = 10,
    results = [],   // a list of numerical IDs.
    i, id, obj,
    does_match = true
  ;
  reset_sfl_results();

  try {
    terms = original_input.trim().toLowerCase().replace( /  +/g, ' ' );
    if (terms) {
      terms = terms.split(' ');
       // iterate over all lists.
      for (id in all_lists) {
         // a AND b:
         // we assume that it's a match by default and technically
         // search for any mismatching component.
        does_match = true;
        i = 0;
        while (  (i < terms.length)  &&  does_match  ) {
          does_match = all_lists[id].title.toLowerCase().indexOf(terms[i]) != -1;
          i++;
        }
        if (does_match) {
          results.push(id);
        }
      }  // end of ( for each list )

// a OR b:                                       // maybe I'll need it again some day.
//      for (id in all_lists) {
//        found = false;
//        i = 0;
//        while (  (i < terms.length)  &&  !found  ) {
//          found = all_lists[id].title.toLowerCase().indexOf(terms[i]) != -1;
//          i++;
//        }
//        if (found) {
//          results.push(id);
//        }
//      }  // end of ( for each list )

      $sresults.data('represents_term', original_input);   // for overriding the on-keyup timer.

    }  // end of ( valid terms )
  }
  catch (ex) {
    results = [];
  }


   // display results.
  $sresults.find('.sfl-pagination')
    .addElseRemoveClass(results.length <= step, 'sfl-hidden')
  ;
  if ( !results.length ) {
    $no_match.removeClass('sfl-hidden');
  }

  else {
    $no_match.addClass('sfl-hidden');
    $match_count.text( results.length );

    for ( i = 0; i < results.length; i++ ) {
      obj = all_lists[ results[i] ];
      $set = $set.add(
        '<li class="result">'
       +  '<a href=\"'+ obj.url +'\">'
       +    '<span class="img" '
       +      ( obj.img_src  ? 'style="background-image: url(/photos/lists/x2/'+ obj.img_src +');"'  : '')
       +    '></span>'
       +    '<span class="sfl-text">'+ obj.title +'</span>'
       +  '</a>'
       +'</li>'
      );
    }
  }  // end of ( results > 0 )

   // by default, only show the first [step] (i.e. the first 10) items.
  $set
    .filter(':lt('+ step +')')
      .removeClass('sfl-hidden')
    .end()
    .filter(':gt('+ (step-1) +')')
      .addClass('sfl-hidden')
    .end()
  ;
   // show sresults container.
  $sresults.append($set).removeClass('sfl-hidden');
}


 // resets the entire Search-for-Lists form, including input mask and
 // search results container.
function reset_sfl_form()
{
  reset_sfl_results();
  document.querySelector('.sfl-search-lists form').reset();          // JavaScript function
  document.querySelector('.sfl-search-lists input.search').focus();
}


 // resets the Search-for-Lists results container. This will delete the list of results.
function reset_sfl_results()
{
  $('#searchresults_for_lists')
    .addClass('sfl-hidden')             // hide container.
    .find('li:not(.sfl-sticky)')        // remove list items.
      .remove()
    .end()
    .data('represents_term', null)      // reset reference for on-keyup timer.
    .find('.sfl-length span')           // reset match count.
      .text('0')
    .end()
    .find('.sfl-pagination.sfl-prev')   // reset controllers.
      .removeClass('sfl-active')
      .siblings('.sfl-next')
        .addClass('sfl-active')
  ;
}


 // hides the Search-for-Lists results container if visible.
function hide_sfl_results()
{
  $('#searchresults_for_lists')
    .not('.sfl-hidden')
    .addClass('sfl-hidden')
  ;
}


 // show the Search-for-Lists results container if hidden
 // and if the list has existing search results.
function unhide_sfl_results()
{
  var
    $sresults = $('#searchresults_for_lists.sfl-hidden')
  ;
  if ( $sresults.has('li.result').length ) {
    $sresults.removeClass('sfl-hidden');
  }
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  S E A R C H   F O R   L I S T S  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////  S E A R C H   O R   C R E A T E  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // adds a filter with which to highlight one category of the search results at a time.
function filter_soc_search_results()
{
   // get text field element. Also check if we're in the right environment, the SoC page.
  var $Obj = $('form[action*="pages/add"]').find(':text[name="name"]');

  if ( $Obj.length )
  {
     // set up the filter on.key-up. (Actually, delay it a bit so that it works better).
    $Obj.keyup(function(){
      Timer = setTimeout(delay_soc_filter_fire, 2000);

    }).after('<select id="wooden_soc_filter" size="1" style="margin-left: 20px;"></select>');

    $Obj = $('#wooden_soc_filter');
    if ( $Obj.length )  // safety precaution
    {
       // make it work! (Add functionality afterwards).
      $Obj.change(function(){
         // reset
        if ( $(this).val() === "0" )
          reset_soc_filter();

         // highlight
        else
        {
          $('#wooden_soc_filter option:first:contains(Filter)').text("[RESET]");

          var Category = $('#wooden_soc_filter :selected').text();
          if ( Category == "" )  // safety precaution
            alert("[Woodrow] Invalid category.");

          else
          {
             // first hide everything …
            $('.blockpage').css('opacity','0.2')

             // … then get the ones needed …
            .filter(function(){
              return $('p.tohide', this).text() === Category;
            })

             // … and highlight them.
            .css('opacity','1');
          }
        }

      });  // end of ( filter on.change )
    }  // end of ( found #wooden_soc_filter )
  }  // end of ( valid environment )
}

 // resets the self-created filter. I encapsulated this so that I can call it
 // in various situations, not just one.
function reset_soc_filter()
{
  $('.blockpage', '#approx').css('opacity','1');
  $('.blockpage', '#exacts').css('opacity','1');
  var $filter = $('#wooden_soc_filter');
  $('option:first:contains(RESET)', $filter).text("Filter …");
  $filter.val(0);
}

 // delays the setup of the "Search or Create" category filter.
function delay_soc_filter_fire()
{
   // Quick! Top priority: save the value and then clear the timer.
  var temp = Timer;
   // clear the Timer in any case. I want this point to be reached only once.
  Timer = clearTimeout(Timer);

   // if the conditions are good, then set it up.
  if (temp)
  {
    reset_soc_filter();

     // get the categories that are present in the current set of
     // search results. (Avoid duplicates).
    var Options = [], i, Out = "";
    $('.blockpage p.tohide').each(function(){
      var cat = $(this).text();
      if ( $.inArray( cat, Options ) == -1 ) {
        Options.push(cat);
      }
    });

    if ( opopSortFilters ) {
      Options.sort();
    }

     // display.
    Out = "<option value='0'>Filter …</option>";
    for ( i = 0; i < Options.length; i++ )
      Out += "<option>"+ Options[i] +"</option>";
    $('#wooden_soc_filter').html(Out);

  }  // end of ( validate not-too-soon time and only-once occurance of the filter setup )
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  S E A R C H   O R   C R E A T E  /////////////////////////////////////////////////
/////////////////////////////////////////////////////////////  A D D   A   P A G E  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // the selection should be either or. Very strictly so! Currently, it is not.
function fix_radio_vs_quicklinks()
{
  var $quicklinks_combobox = $('select[name*="quicklinks"]'),
      $form = $quicklinks_combobox.closest('form');

   // validate environment.
  if (  $quicklinks_combobox.length  &&  $form.length  )
  {
    $(':radio', $form).change(function(){
      $quicklinks_combobox.val("none");
    });
    $quicklinks_combobox.change(function(){
      $(':radio:checked', $form).attr('checked', null);
    });

  }  // end of ( valid environment )
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  A D D   A   P A G E  /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////  V I E W   A   P A G E  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // fixes all the bad styling when viewing a Page. Maybe I'm gonna do more CSS fixes here
 // in the future. Hence a func. Also, for the FLEX user to tick on|off.
function fix_styling_viewpage()
{
   // can't do it properly with style.css because FL has unusable class names.
  $('div.tabs div.page').css('height', 300);
}



 // removes the "slash-ambiguity" in the category where possible.
function apply_gender_to_cat()
{
  var
    g = null,
    $gender = $('.pageright').has('h2:contains(About)').find('li:contains(Gender:)'),
    $cat = $('.pageinfos h1 span a:contains(Actor/Actress)');

   // validate environment.
  if (  $gender.length  &&  $cat.length  ) {

     // get gender.
    g = $gender.text().replace( /Gender:[ \t]?/, '' );

     // apply variation.
    g =   (g == 'Female')   ? 'Actress'   : 'Actor';
    $cat.text(g);

  }  // end of ( valid environment )
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  V I E W   A   P A G E  ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////  E D I T   A   P A G E  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // adds a self-made text version of the category tree, in its most up-to-date form.
 // Conveniently clickable, too!
function add_category_tree()
{
  var
    $items = null,

     // find the Categories tab inside the edit form.
    $cat_container = $('form[action^="/pages/"][action$="/edit"] .catlist'),

     // retrieve the combobox which has more than one items. One of them suffices.
    $select = $('select.page_category').first();


   // validate environment.
  if (  $cat_container.length  &&  $select.length  ) {

     // I'm gonna modify the items, therefore I need to copy this.
    $select = $select.clone();
     // remove the "Select..." line (in my copy).
    $select.children('option[value="0"]').remove();

     // init: modify form.
    $cat_container.append('<div id="tree_box"><ul></ul></div>');



     // convert the elements for my purposes.
    $items = $('option', $select).map(function(){

      var
        $source = $(this),
        $copy = $('<li></li>'),
        title = $source.text().replace( / \(\d+ pages\)$/, '' );

      $copy
        .data( 'cat_id' , $source.val() )
        .text(title);

      return $copy;
    });  // end of ( convert element )


     // display
    $('#tree_box ul').html($items.get());


     // this actually makes the items clickable.
    $('#tree_box li').click(function(){

       // search for an existing id.
      var
        id = $(this).data('cat_id'),
        PreviousCategories = [];


       // get the current categories, in order to prevent duplicates.
       // (KiRK is also already verifying things on his end, anyway, but safe is safe).
      $('select[name="page_categories[]"] option:checked').each(function(){
        PreviousCategories.push( $(this).val() );
      });

      if (!id) {
        alert('[FLEX] Could not find id: '+ id +'.');
      }
      else if ( $.inArray( id, PreviousCategories ) != -1 ) {
        alert('[FLEX] Category already assigned.');
      }

       // add a new category, complete with combobox.
      else {

         // set the last combobox (which is always "free") to the new value.
        $('.page_category').last().val(id);

         // create a new "free" combobox. This is copied from how KiRK does it.
         // (Okay, I tweaked it a bit).
        var $copy = $('.page_category').first().clone();
        $('a:contains((+)):visible').before($copy);
        $('option:selected', $copy).removeAttr('selected');
      }
    });  // end of ( tree item click )
  }  // end of ( valid environment )
}



 // on pasting a YouTube-URL in a text field, automatically reduce it to its mere
 // minimum, the YouTube-ID.
function quicken_YouTube_paste()
{
   // find all text fields in the context of "Edit a Page".
  $('.cat input[type="text"]').blur(function(e) {

    $(this).val( retrieve_YouTube_id( $(this).val() ) );
  });
}



/*
//// RE-OPENED
//
 // automatically focuses the first form element of interest when browsing the
 // Page category tabs, for quicker Page-editing.
function auto_focus_first_field()
{
   // validate environment.
  if ( $('.cat').length )
  {
     // on any category-switch …
    $('a').each(function(){
      var $el = $(this);
      if ( $el.parent().siblings('form[action*="/edit"]').length )
      {
        $el.click(function(){

           // locate all possible elements …
          $('input[type="text"]', '.cat:visible')

           // … (excluding comboboxes that are inside a minibox, like track no.;
           //    or that are already fix, pre-set Page categories) …
          .add('select', '.cat:visible').filter(function(){
            return !$(this).closest('div.blockpage').length
              &&   !$(this).filter(':not(.page_category)').closest('.catlist').length;
          })

           // … and focus on the first item in that set of candidates.
           // "first" meaning the first element that appears in the DOM hierarchy,
           // regardless of when I added it to the set.
          .eq(0).focus();
        });

      }  // end of ( for each ‹a› with that form nearby )
    });  // end of ( for each ‹a› / any category switch )

  }  // end of ( valid environment )
}
*/



 // I need this so that I can switch tabs faster with my Opera hotkeys [1] and [2] after a submit,
 // i.e. when I'm pseudo-batch-editing a music album's tracks.
function lose_focus_on_submit()
{
  var $form = $('form').has('.cat');

   // validate environment.
  if ( $form.length )
  {
    $form.submit(function(){
      $('select:focus').add('input:focus').add('textarea:focus').blur();
    });

  }  // end of ( valid environment )
}


//// DEVELOPMENT
//
// modified version, in comparison to Opera.
//
 // sets up the creation of a "Create Page" link that is closer to the search field,
 // on-key-up in that search field.
function set_up_create_create()
{
   // validate environment and, at the same time, get text field element. Actually, all of them.
  var $field = $('input[name="search"]', '.cat');

  if ( $field.length )
    $(document).on('keyup.createcreate', $field, copy_create_link);
    $(document).on('keyup', $field, function(){
/*
// can't get the timing right.
      if ( $field.val() === '' ) {
        $('.wooden_create:visible').fadeOut(100);
      }
      else {
        $('.wooden_create:visible').fadeIn(100);
      }
*/
    });

     // while you're at it …
//    .on('keyup', $field, function(){
//      $(window).scrollTop( $(window).scrollTop() +100 );
//    });
// TODO: … though, does it work right?
}

 // adds a create-page link closer to a search-for-page field.
function copy_create_link()
{
   // Favsland's on-key events never worked well with Opera. Hence, a timer.
  Timer = setTimeout( function(){
     // this time, only get the visible one.
    var $field = $('input[name="search"]:visible', '.cat');

     // only add if you haven't already.
    if (  $field.length  &&  !$('.wooden_create:visible').length  )
    {
       // create a modified copy and – if it worked as expected – inject it.
      var $clone = $('.addpage:visible').clone().attr('id',null).addClass('wooden_create')
      .css('margin-left', 10).text('Create Page');

      if ( $clone.length )
      {
        $field.after($clone);
         // unbind this event so that we won't try to add this link again.
        $(document).off('keyup.createcreate', $field, copy_create_link);
      }
    }  // end of ( haven't already )
  }, 500 );
}


 // automatically sets the focus back onto the search field when I leave
 // and return to the browser window/tab, if the focus was on a track no. combobox.
function auto_blur_trackno_on_deactivate()
{
  $(window).focus(function(){
     // either album view or individual-song view.
    if (  $('select[name*="songtracks"]:focus', '.cat').length
      ||  $('select[name*="albumtracks"]:focus', '.cat').length  )

      $('input[name="search"]:visible', '.cat').focus();
  });
}



 // sets up an automatically incrementing track number whenever songs are
 // added to an album.
function setup_track_plusplus()
{
   // find the "Tracklist" tab in the "Edit a Page" environment.
  var $context = $('form[action^="/pages/"][action$="/edit"] .cat34song');

   // validate environment.
  if ( $context.length ) {


     // --- preparation and setup --- //

    var conditional_style =
      ( !$context.find('div.list').children().length )
      ? 'style="display: none;"'
      : '';

     // inject Pause|Unpause popup.
    $('div.list', $context).css('position', 'relative').prepend(
      '<div class="wooden_pauseplay_trackpp" '+ conditional_style +'>'
     +'  <span class="img" style="background-image: '
     +'   url(\''+ url_pauseplay +'\');">&nbsp;</span>'
     +'  <span class="text">Track++</span>'
     +'</div>'
    );


     // make Track++ paused if user wants so.
    $context.on('click', '.wooden_pauseplay_trackpp', function(){

      $(this).toggleClass('paused');
      trackpp_mode = !trackpp_mode;
    });



     // --- execution of the actual magic --- //

     // when clicking on a minibox and adding a song to an album (non-final).
    $('#check34song').on('click', '.add', function(e){

       // exclude clicks on my wooden preview links.
      if ( !$(e.target).is('.wooden_mb_preview') ) {

         // don't show it yet when the tracklist is empty.
         // Make it fade in after the first addition.
        var $tpp_box = $('.wooden_pauseplay_trackpp:hidden');
        if ( $tpp_box.length ) {
          $tpp_box.fadeIn(1350);
        }

        if ( trackpp_mode ) {
          var                       // simply always use the last song (if available).
            $el = $context.find('div.list > div:not(.wooden_pauseplay_trackpp):last'),
            disval = $el.find('select[name^="songdiscs"]').val(),
            track = $el.find('select[name^="songtracks"]').val();

          disval =   (isNaN(disval))   ? 1   : parseInt(disval, 10);
          track  =   (isNaN(track))    ? 0   : parseInt(track,  10);
          track++;

          $('select[name^="songdiscs"]', this).val(disval);
          $('select[name^="songtracks"]', this).val(track);
        }
      }  // end of ( exclude wooden preview )
    });  // end of ( click: make lower go upper )
  }  // end of ( valid environment )
}



 // modifies the Submit button of the Edit a Page environment, mostly its CSS attributes,
 // in order to provide a constantly fix button location. No one likes dancing buttons.
function improve_EAP_update_button()
{
  var
    $context = $('form[action^="/pages"][action$="/edit"]'),
    $link_blocks = $('a.ismodal', $context).closest('p.center'),   // ‹p›. FL started having two
    $mine = $link_blocks.first();   // so $link_blocks is plural. But I only need one ($mine).

   // validate environment.
  if ( $context.length ) {

    // ----- button itself and internal stuff ----- //

     // almost all of it is done via styling.
    $mine
      .addClass('wooden_EAP_submit wooden_container')

      .find('a:contains(Cancel)')
        .css('margin-right', 10)
      .end()

      .find('a.ismodal')
        .addClass('greenbutton')
      .end()

       // remove the " - " text node. (must be the last block in my jQ Wurst).
      .contents().filter(function(){
        return this.nodeType == 3;
      }).remove();


    // ----- external, injection and stuff ----- //

    $link_blocks.filter(':not(:first)').remove();   // keep one, remove all others.
    $context.append( $mine );

  }  // end of ( valid environment )
}



 // restores the core functionality of – what I call throughout FLEX – "miniboxes",
 // which is to open the respective FL Page, as Favsland decided to drop it in this
 // environment in order to connect Pages with one another. You can do both now.
function optimize_eap_miniboxes()
{
  // There are two types of miniboxes in the edit-a-page (EAP) environment:
  // "div.blockpage.add", which show up and are suggested to you if you search,
  // and "div.list > div", which don't have the blockpage class and are already
  // locked up there. (i.e. a movie Page that already has set up actors before
  // you start editing on that movie Page)

  var $context = $('.cat').has('input[name="search"]').first();

   // validate environment.
  if ( $context.length ) {

    var selection = '.list > div, div.add';

     // initial injection. (Injecting my buttons to things that are already there
     // on page-loading, before you start editing)
    inject_new_mb_preview_buttons();

     // hook up many delegated events onto this always-present collection.
    $('.cat')

        // try to inject new Preview buttons on-key-up in the EAP search fields.
        // (Actually, delay it a bit so that it works better).
      .find('input[name="search"]')
        .keyup(function(){                   // delay as seen in the "SOC Filter" module.
          Timer = setTimeout(delay_inject_new_mb_fire, 2000);
        })
      .end()

        // make the Preview buttons that I just injected appear and disappear on-mouse-interaction.
      .on('mouseenter', selection, function(){
        $(this).find('.wooden_mb_preview').stop().fadeIn(100);
      })
      .on('mouseleave', selection, function(){
        $(this).find('.wooden_mb_preview').stop().fadeOut(100);
      })

        // click on Preview button should not bubble up and make lower go upper.
      .on('click', '.wooden_mb_preview', function(e){
        e.stopPropagation();
      });

  }  // end of ( valid environment )
}

 // tries to inject a new batch of minibox preview buttons into the EAP environment.
function inject_new_mb_preview_buttons()
{
  var
    $upper_divs = $('.cat div.list').children('div'),      // the already added "list items"
    $lower_divs = $('div.add'),                            // the "list items" that are being suggested
                                                           // when searching in EAP.
    $all_checkboxes = $upper_divs.add($lower_divs).find(':checkbox');

   // inject Preview buttons next to checkboxes.
  $all_checkboxes.each(function(){
    var
      $el = $(this),
      $parent = $el.closest('.list > div, div[rel]'),
      value = $el.val(),
      c = 'wooden_mb_preview ';

     // only inject if not present already. Also, if valid.
    if (  !$el.siblings('.wooden_mb_preview').length  &&  !isNaN(value)  ) {

       // adjust the positioning of the injected button in the special case of an album tracklist.
      if ( $parent.has('select[name^="songtracks"]').length ) {  // that combobox messes things up.

         // there are even two non-FLEX special cases: already added before editing, and added just now.
        c +=   ( $parent.is('.blockpage') )   ? 'track_added '   : 'track_already';
      }

      $el.after(
         '<a class="'+ c +'" title="Preview" target="_blank" '
        +'href=\"/pages/-/'+ value +'\" >Preview</a>'
      );
    }  // end of ( this instance not injected before  +  valid value )
  });  // end of ( for each checkbox )
}

 // triggers the EAP minibox-preview injection only if a timer has been running
 // and makes sure to only trigger it once.
function delay_inject_new_mb_fire()
{
   // Quick! Top priority: save the value and then clear the timer.
  var temp = Timer;
   // clear the Timer in any case. I want this point to be reached only once.
  Timer = clearTimeout(Timer);

   // if the conditions are good, then set it up.
  if (temp) {
    inject_new_mb_preview_buttons();
  }
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  E D I T   A   P A G E  ///////////////////////////////////////////////////////////
/////////////////////////////////////////////  Q U I C K E N   D A T E   P A S T E  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // injects my wooden date paste box into the Edit a Page form, wherever possible.
function set_up_date_paste()
{
  var
    $date_m = null,
    $date_d = null,
    $date_y = null;


   // --- search and prepare the elements. ---

   // combobox month.
  $date_m = $('form[action^="/pages/"][action$="/edit"] select').filter(function(){
    return $(this).text().match( /Month.*January.*April.*May.*June.*December/ ) !== null;
  }).addClass('date_paste date_m');

   // combobox day.
  $date_d = $date_m.next('select').addClass('date_paste date_d');

   // combobox year.
  $date_y = $date_d.next(function(){
    var $el = $(this);
    return $el.is('select') || $el.is('input[type="text"]');
  }).addClass('date_paste date_y');


   // --- validate environment. ---
  if ( $date_m.length ) {

     // --- inject box. ---
    $date_m.parent().append(
      '<div class="wooden_date_paste">'
     +  '<input type="text" placeholder="Quick Date Paste" value="" />'
     +'</div>'
    ).addClass('date_paste_container');


     // hook up functionality.
    $('.wooden_date_paste input').blur(quicken_date_paste);

  }  // end of ( valid environment )
}


 // analyzes the given input date string and tries to evaluate it.
 // Parameter e is the blur event of the text field in which the paste happened.
function quicken_date_paste( e )
{
   // validate condition / safety precaution.
  var
    $src = $(e.target || e.srcElement),
    input = $src.val(),
    $context = $src.closest('.date_paste_container'),
    result = null;

  if (  $context.length  &&  (input != '')  ) {


     // --- preparation ---

     // like modERLi, use this global variable for the transfer between sub-functions.
    modQDtP = {
      monthsENG: null,
      monthsGER: null,
      monthsFRA: null,
      input: input,
      pasted_date: {
        yyyy: '',
        mm: '',
        dd: ''
      },
      $context: $context
    };


     // prepare a handy months string with some RegEx tricks.
     // The non-capturing groups are there to quickly transform this string into
     // a list of 3-letter months. But not just for conversion, also already
     // for the search itself.
    modQDtP.monthsENG =
      'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|'
     +'Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';
    modQDtP.monthsGER =
      'Jan(?:uar)?|Feb(?:ruar)?|Mär(?:z)?|Apr(?:il)?|Mai|Jun(?:i)?|'
     +'Jul(?:i)?|Aug(?:ust)?|Sep(?:tember)?|Okt(?:ober)?|Nov(?:ember)?|Dez(?:ember)?';
    modQDtP.monthsFRA =
      'Jan(?:vier)?|Fév(?:rier)?|Mar(?:s)?|Avr(?:il)?|Mai|Jui(?:n)?|'
     +'Jui(?:llet)?|Aoû(?:t)?|Sep(?:tembre)?|Oct(?:obre)?|Nov(?:embre)?|Déc(?:embre)?';



     // --- data allocation ---            // Auto-detect, by doing several tests until one succeeds.

    if (!find_valid_date('YMD jap')) {     // --- Test #1 ---
    if (!find_valid_date('DMY num')) {     // --- Test #2 ---
    if (!find_valid_date('DMY ger')) {     // --- Test #3 ---
                                           // …
    if (!find_valid_date('DMY fra')) {
    if (!find_valid_date('YMD num')) {
    if (!find_valid_date('YMD eng')) {

    if (!find_valid_date('MDY eng')) {
    if (!find_valid_date('MDY num')) {
    if (!find_valid_date('DMY eng')) {
         find_valid_date('D?M?Y');

    }}} }}} }}}

    // regardless of the last test's fail state, the pasted date inside the glovar is always
    // well-defined enough for us to proceed like this at this point.


     // --- data analysis ---

    with ( modQDtP.pasted_date ) {
       // validate data.
      yyyy = ((yyyy != '')  &&  !isNaN(yyyy))   ? parseInt(yyyy, 10)   : null;
      mm =   ((mm != '')  &&  !isNaN(mm)  &&  isBetween(0, mm, 13))   ? parseInt(mm, 10)   : 0;
      dd =   ((dd != '')  &&  !isNaN(dd)  &&  isBetween(0, dd, 32))   ? parseInt(dd, 10)   : 0;
    }


   // --- data usage ---

  insert_date_data();

   // reset when finished.
  $src.val(null);

  }  // end of ( valid condition )
}



 // scans a string in the expectedly pre-set module glovar by applying the given format string.
 // Always returns the success as boolean. In case of a success, the date data has already been filled
 // into the module glovar.
function find_valid_date( format )
{
   // safety precaution.
  if (  !modQDtP
    ||  !modQDtP.input
    ||  !modQDtP.monthsENG
    ||  !modQDtP.monthsGER
    ||  !modQDtP.monthsFRA
    ||  !modQDtP.pasted_date
  ) {
    return false;
  }


  var
    matches = null,
    order = [,,],
    months = null,
     // I'm using an object with RegExp string parts because I (may) need to repeat
     // the test in different YMD orders.
    reg = {
      del: ',?[ \\t\\/\\.\\-] ?',        // default delimiter
      simdel: '\\. ?',                   // simple delimiter
      dd: '\\d{1,2}(?:st|nd|rd|th|er)?', // day
      mm: '\\d{1,2}',                    // month (as numeric)
      yyyy: '\\d{4}',                    // year
      exp: null                          // expression
    };

   // reset.
  modQDtP.pasted_date.yyyy = '';
  modQDtP.pasted_date.mm   = '';
  modQDtP.pasted_date.dd   = '';


   // select one of the expected test formats.
  switch (format) {

     // EXAMPLE:  1995, March 29th
    case 'YMD eng': {
      with (reg) {
        exp = RegExp(  '('+yyyy+')'  +del+  '('+modQDtP.monthsENG+')'  +del+  '('+dd+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
       // define the order of the captured groups (0 being the entire match).
      order = [1,2,3];
       // cleanse the data.                            // December —› dec  (month in comparison string)
      months = modQDtP.monthsENG.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


     // EXAMPLE:  1995/03/29
    case 'YMD num': {
      with (reg) {
        exp = RegExp(  '('+yyyy+')'  +del+  '('+mm+')'  +del+  '('+dd+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [1,2,3];

      break;
    }


     // EXAMPLE:  1995("toshi", YEAR as Kanji) 03("getsu", MONTH as Kanji) 29("hi", DAY as Kanji)
    case 'YMD jap': {
      japdel = '(?: |\\u3000|\\t)?';
      with (reg) {
        exp = RegExp(
          '(\\d{4})'+   japdel +'\\u5E74'+ japdel
         +'(\\d{1,2})'+ japdel +'\\u6708'+ japdel
         +'(\\d{1,2})'+ japdel +'\\u65E5'
        );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [1,2,3];

      break;
    }


     // EXAMPLE:  Mar 29th 1995
    case 'MDY eng': {
      with (reg) {
        exp = RegExp(  '('+modQDtP.monthsENG+')'  +del+  '('+dd+')'  +del+  '('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,1,2];
      months = modQDtP.monthsENG.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


     // EXAMPLE:  03/29 1995
    case 'MDY num': {
      with (reg) {
        exp = RegExp(  '('+mm+')'  +del+  '('+dd+')'  +del+  '('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,1,2];

      break;
    }


     // EXAMPLE:  29 March, 1995
    case 'DMY eng': {

      with (reg) {
        exp = RegExp(  '('+dd+')'  +del+  '('+modQDtP.monthsENG+')'  +del+  '('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,2,1];
      months = modQDtP.monthsENG.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


     // EXAMPLE:  29.3.1995
    case 'DMY num': {

      with (reg) {
        exp = RegExp(  '('+dd+')'  +simdel+  '('+mm+')'  +simdel+  '('+yyyy+')'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,2,1];

      break;
    }


     // EXAMPLE:  29. März 1995
    case 'DMY ger': {

      with (reg) {
        exp = RegExp(  '('+dd+')'  +simdel+  '('+modQDtP.monthsGER+')'  +',? '+  '('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,2,1];
      months = modQDtP.monthsGER.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


     // EXAMPLE:  29 avril 1995
    case 'DMY fra': {

      fradel = '[ \\t]';
      with (reg) {
        exp = RegExp(  '('+dd+')'  +fradel+  '('+modQDtP.monthsFRA+')'  +fradel+  '('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,2,1];
      months = modQDtP.monthsFRA.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


     // EXAMPLE:  Apr 1995
    case 'D?M?Y': {
      with (reg) {
         // re-do Test ‹DMY eng› with a tweak, so as to cover incomplete input as well.
        exp = RegExp(  '(?:(?:('+dd+')'  +del+  ')?('+modQDtP.monthsENG+')'  +del+  ')?('+yyyy+')',   'i'  );
      }
      matches = modQDtP.input.match(reg.exp);
      order = [3,2,1];
      months = modQDtP.monthsENG.replace( /\([^\)]+\)\?/g, '' ).toLowerCase();

      break;
    }


    default: { break; }
  }  // end of ( switch format )



  if (matches) {
    with (modQDtP.pasted_date) {

      yyyy = String(matches[ order[0] ]);       // convert everything into a string, even null.
      mm   = String(matches[ order[1] ]);
      dd   = String(matches[ order[2] ]);

      // --- normalize, so that when leaving this func, these three are always numerics ---

      dd = dd.replace( /\D/g, '' );             // 4th —› 4  (user input)
      if (isNaN(mm)  &&  months) {
        mm = mm.substring(0,3).toLowerCase();   // December —› dec  (month in user input)
        mm = months.split('|').indexOf(mm) +1;  // dec —› 11 +1 —› 12
      }
      // else just use ‹mm› right away.
    }
  }

  return !!matches;
}


 // actually inserts the data collected from the pasted date string glovar into the date triplet
 // defined by $context (remember, there can be multiple date triplets in one FL form).
function insert_date_data()
{
  with ( modQDtP.pasted_date ) {
     // execute. Validate the components individually in case of incomplete user input.
    if (yyyy) {
      $('.date_y', modQDtP.$context).val(yyyy);
    }
    if (mm) {
      $('.date_m', modQDtP.$context).val(mm);
    }
    if (dd) {
      $('.date_d', modQDtP.$context).val(dd);
    }
  }  // end of ( with glovar )
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  Q U I C K E N   D A T E   P A S T E  /////////////////////////////////////////////
///////////////////////////////////////////////////////////  E D I T   A   L I S T  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // makes the scrollbox always scroll to the top whenever a new list of items
 // is loaded (click on letter or type in search).
function fix_scrolltop_in_editlist()
{
  if (environment.where == 'edit-a-list') {
    var
      $list = $('#choicelist'),
      $handle = $list.siblings('.slimScrollBar')
    ;
   // I don't get why …
   //    $(document).on('click', '#alphabet a', func(){});
   // … doesn't work with click.
   // Stupid piece of shit.

    $('#alphabet li a').click(function(){
      $list.scrollTop(0);
      $handle.css('top', 0);
    });

    $('#searchlist').on('keyup', this, function(){
      $list.scrollTop(0);
      $handle.css('top', 0);
    });
  }  // end of ( valid environment )
}


 // gives users a Preview link which enables them to jump to a Page while browsing
 // the unranked search results on the Edit List page.
function provide_preview_link()
{
  var $list = $('#choicelist');

   // identify environment.
  if ( $list.length )
  {
    $('div.choicelist ul li span.text').css('width', '60%');

     // onmouseover
    $list.on('mouseenter', 'li', function(){
      var
        $preview = $('.EAL_preview', this);

       // initialize the preview link for this specific list item.
      if ( !$preview.length ) {
        var
          $el = $(this),
          $cat = $el.find('span.cat'),
          o = document.createElement('span'),
          id = $el.attr('id');

        if ( $cat.length )
        {
           // validate the ID.
          id = isNaN(id)  ? 0  : parseInt( id, 10 );

           // prepare link.
          o.title = $cat.text();
          o.innerHTML = '<a target="_blank" '
                       +' href="http://www.favslist.com/pages/-/'+ id +'">Open</a>';
          o.className = 'EAL_preview';

           // inject the link.
          $cat.before(o);
        }
      }  // end of ( init preview per li )

      $preview.show();

     // onmouseout
    }).on('mouseleave', 'li', function(){

      $('.EAL_preview', this).hide();
    });

  }  // end of ( valid environment )
}



 // in a listing, moves the articles to the back of the title for better readability.
 // Example: The Legend of Zelda (listed under L) —› Legend of Zelda, The
function set_up_article_readability()
{
  var $list = $('#choicelist'),
      $atoz = $('#alphabet');

   // validate environment
  if (  $list.length  &&  $atoz.length  )
  {
     // create and inject checkbox element.
    $atoz.after(
      "<fieldset style='color: #CECECE; font-weight: 500;' title='Move THE and A to the end, for better readability.'>"
       +"<input type='checkbox' id='check_art' style='margin-left: 7px;' /> "
       +"<label for='check_art' style='cursor: pointer;'>Art.</label>"
     +"</fieldset>"
    );
    // TODO (bugfix): apparently, this already suffices to cause an error on a click of
    // that very checkbox. But I have no clue why.

     // make the checkbox work.
    $('#check_art').click(function(){
       // analyze each currently visible title.
      $('li span.text, li.no', $list).each(function(){
        var s = $(this).html(), xpr = "", alternative = "";

        if ( !$(this).data('original') ) {
          $(this).data('original', s);
        }

         // Either move the article from the front to the back …
        if ( $('#check_art:checked').length )
        {
          xpr = /^(The|A) ([^:]+)/;
          alternative = "$2, $1";
           // if you can find a match then apply the changes.
          s = s.replace( ( xpr ), alternative );
        }

         // … or vice versa (revert the changes).
        else
        {
          s = $(this).data('original');
        }

        $(this).html(s).mouseup(function(){  $(this).text( $(this).attr('title') );  });

      });  // end of ( for each ‹span› element )
    });

     // automatically reset the checkbox upon requesting a new sub-list (easiest fix).
    $('li a', $atoz).click(function(){
      $('#check_art:checked').attr('checked', null);
    });

    $('#searchlist').on('keyup', function(){
      $('#check_art:checked').attr('checked', null);
    });
  }  // end of ( valid environment )
}



 // fixes that the page design is shattered if the List Eligibility Requirements is too
 // long, by adding two CSS attributes.
function fix_toolong_eligibility_box()
{
  $('div.headerlist ul.criteres').addClass('fix_eligibility');
}



 // sets up the "Categorize EAL" module.
function set_up_categorize_EAL()
{
  var
    $abc = $('.alphabet');    // currently, everything depends on the alphabet :^/

   // validate environment.
//  if ( $abc.length ) {

    $abc.find('li a')

       // clickability (in a delayed fashion, to give FL-php time to load first).
      .click(function(){
        Timer = setTimeout(delayed_categorize_EAL, 600);
      });

     // also hook it up into the search.
    $('#searchlist').keyup(
    function(){

      Timer = setTimeout(delayed_categorize_EAL, 1000);
    });


     // automatically categorize on initial page-load.
    Timer = setTimeout(delayed_categorize_EAL, 1000);

//  }  // end of ( valid environment )
}

 // gets my injected box, or creates and injects it if it doesn't exist yet.
 // Always returns my box as a jQuery collection.
function get_ealcat_listbox()
{
  var
    $choice = $('.choicelist'),
    $box = $('#wooden_ealcat_list'),
    $show = null,
    slidingTime = 200;

   // create if non-existant.
  if ( !$box.length ) {

     // injection.
    $box = $choice
      .closest('.cell')
      .prepend(
        '<div id="wooden_ealcat_list" class="wooden_container" style="display: none;">'
       +'  <div class="wsh_right">'
       +'    <input type="button" value="Reset" id="ealcat_reset" />'
       +'</div>'
       +'  <ul></ul>'
       +'</div>'
      )
      .find('.share .search')
        .addClass('wsh_override')
        .prepend('<span id="wooden_show_ealcat">Show</span>')
      .end()
      .find('#wooden_ealcat_list')
      .css({
        width: $choice.outerWidth() -1,      // -1 because of border
        height: $choice.outerHeight()
      });


     // --- clickability --- //

     // show/hide button.
    $show = $('#wooden_show_ealcat');

     // reset button.
    $('#ealcat_reset').click(
    function(){
	  $('#choicelist > li').show();
	  $show.text('Show');
	  $('#wooden_ealcat_list').slideUp(slidingTime);
    });

    $show.click(function(){
      if ( $box.filter(':hidden').length ) {

        $show.text('Hide');
        $box.stop().slideDown(slidingTime);
      }
      else {
        $show.text('Show');
        $box.stop().slideUp(slidingTime);
      }
    });

     // click on wood-item.
    $box.on('click', 'li',
    function(){
      load_ealcat( $('.cat_name', this).text() );
      $show.text('Show');
      $box.slideUp(slidingTime);
    });
  }  // end of ( non-existant )

   // return the actual list element.
  return $box.find('ul');
}

 // if the timer allows it, generates a new list of categories
 // based on the current FL-item selection.
function delayed_categorize_EAL()
{
   // Quick! Top priority: save the value and then clear the timer.
  var temp = Timer;
   // clear the Timer in any case. I want this point to be reached only once.
  Timer = clearTimeout(Timer);

   // if the delay conditions are good, then set it up.
  if (temp) {
    var
      cats = $('#choicelist li:not([rel=""])'),
      $wooden_list = get_ealcat_listbox(),
      len = 0;

     // create a list of categories.
    cats = cats.map(
      function(){
        return $(this).attr('rel');
      })
      .get()
      .sort();
    cats.unshift("[none]");

     // remove duplicates.
    cats = cats.filter(
    function(item, index, cats){

      return index == cats.indexOf(item);
    });

     // convert raw content to pretty content.
    for ( i = 0; i < cats.length; i++ ) {
      if ( cats[i] == "[none]" ) {
        cats[i] = '<li><span class="cat_name">'+ cats[i] +'</span></li>';
      }
      else {
        len = $('.choicelist li:contains('+ cats[i] +')').length;
        cats[i] = '<li><span class="cat_name">'+ cats[i] +'</span>'
                 +'<span class="cat_count">('+ len +')</span></li>';
      }
    }

     // display.
    $wooden_list
      .html( cats.join('') )
      .scrollTop(0);

  }  // end of ( valid delay conditions )
}

 // filters the current FL-item selection by the given category Cat;
 // in other words, processes a wood-item click.
function load_ealcat( cat )
{
  $('#choicelist > li')
    .woodrow('cleanShow')
    .filter(
    function(){
      if (cat == '[none]') {
        cat = '';
      }
      return $(this).attr('rel') != cat;
    })
    .hide();
}



 // injects a big wide preview area for hovered-on items of the left column.
function set_up_preview_pane()
{
  if ( environment.where == 'edit-a-list') {

     // inject.
    $('.editlist:first')
      .append(
        '<div id="wooden_preview_pane" class="hidden">'
       +  '<div class="wooden_prevpane_inner">'
       +    '<h2>placeholder</h2>'
       +    '<p class="category-1">'
       +      '<span class="icon">&#9733;</span>'
       +      '<span class="text">placeholder</span>'
       +    '</p>'
       +    '<img class="photo" src="/photos/pages/x1/no.png" alt="placeholder" title="placeholder" />'
       +  '</div>'
       +'</div><!-- /#wooden_preview_pane -->'
      )
    ;
    $('body').addClass('wsh_preview_pane_activated');


     // set up the interactivity.
    var
      $pane = $('#wooden_preview_pane'),
      $src_img = $('#cursorMessageDiv img')
    ;
     // left column.
    $('#choicelist')
      .on('mouseleave', function(){
        $pane.addClass('hidden');
      })

      .on('mousedown', function(){
        $pane.addClass('hidden');
      })

      .on('mouseenter', 'li:not(.explain)', function(){
        var
          $el = $(this),
          imgsrc = $el.data('img'),
          title = '',
          cat = $el.attr('rel')
        ;
         // don't show when dragging something into the right column.
         // e.which / e.buttons are the worst in Firefotz!
        if ( !$('.ui-sortable-helper').length ) {
          $pane.show().removeClass('hidden');
        }

         // if this data value exists (stemming from my other module,
         // Article Readability), then by all means: take it.
        if (  !(title = $el.data('original'))
          &&  !(title = $el.find('.text').data('original'))
        ) {

           // otherwise:
          title =
            $el.is('.no')  // if already ranked
            ? $el.text()
            : $el.find('.text').text();
        }


        $pane
          .find('h2')
            .html(title)
          .end()
          .find('img.photo')
            .attr('src', imgsrc)
          .end()

           // apply text to "category". Hide if empty, else show.
          .find('.category-1')
            .find('.text')
              .text(cat)
            .end()
            .has('.text:empty')
              .css('visibility', 'hidden')
            .end()
            .has('.text:not(:empty)')
              .css('visibility', 'visible')
            .end()
          .end()
        ;

      })  // end of ( mouseenter li )
    ;


     // right column.

     // opacity alone doesn't suffice if you want to let users
     // click/drag/interact with the content underneath.
    $('.editlist')
      .on('mouseenter', function(){
        $pane.hide();
      })
      .on('mouseleave', function(){
        $pane.show();
      })
    ;
  }  // end of ( valid environment )
}



 // sets up an alternative to the native, super slim, super awkward scroll bar
 // in the Edit-a-List environment.
function eal_assisted_pagination()
{
  var
    $list = $('#choicelist'),
    $container = $list.closest('.slimScrollDiv'),
    $handle = $container.find('.slimScrollBar'),
    module = {
      initiated: false,
      speed: 200,
      container: {
        interval: 0,
        offset: 0,
      },
      item: {
        height: 0,
        count: 0,
      },
      handle: {
        max: 0,
        final: 0,
      },
    }
  ;
  if (environment.where == 'edit-a-list') {

     // injection.
    $container.append(
      '<span class="apa-pagination apa-up   apa-hidden">'
     +  '<span class="apa-controller">\u25B2</span>'
     +'</span>'
     +'<span class="apa-pagination apa-down apa-hidden">'
     +  '<span class="apa-controller">\u25Bc</span>'
     +'</span>'
    );
  }  // end of ( valid environment )


   // initiate my controller buttons. Since they depend on slimScrollBar,
   // and that one is also initiated on the first li.mouseenter, this
   // kinda works perfect.
  $list.on('mouseenter', 'li', function(){
    if ( $list.get(0).scrollHeight > $container.height() ) {
      $('.apa-pagination').removeClass('apa-hidden');
    }
  });


   // clickabili-functionality.
  $('.apa-pagination').click(function(){
    var
      $new_top_li = $(),
      target = 0,
      ratio = 0,
      tmp = null,
      is_next = $(this).is('.apa-down')
      handle_top = 0
    ;
    with (module) {
       // these never change.
      if (!initiated) {
         // item height.
        tmp = $list.find('li:first').outerHeight();     // a single item's height.
        item.height = tmp  ? tmp  : 1;                  // prevent division by 0.
        tmp = null;                                     // for better readability.

         // container intervals.
        tmp = $container.height() - item.height;        // the size or height of one step. (is one item shorter because
        tmp = parseInt((tmp / item.height), 10);        // that item will be the scroll reference)
        container.interval = tmp;
        tmp = null;

         // container offset.
        container.offset =                              // in order to "calibrate" the scrollTop experience.
          $list.offset()                                // Also, measure it *now* because of FL's jumpy
          ? $list.offset().top                          // page-load nature.
          : 0;

        initiated = true;

      }  // end of ( never changes )

       // these change with each new search, letter-change, (de)ranking.

       // handle.
      tmp = $container.height();
      handle.max = tmp;                                         // full space of the rail.
      handle.final = parseInt((tmp - $handle.height()), 10);    // last possible position.
      tmp = null;

      item.count = $list.find('li').length;

    }  // end of ( with: module )


    try {
       // get current top-most ‹li› (index).
      target = parseInt(($list.scrollTop() / module.item.height), 10);
      target += module.container.interval * (is_next  ? 1  : -1);
      target = (target < 0)  ? 0  : target;

       // get ratio.
      ratio = target / module.item.count;                 // (gonna need this later).

      $new_top_li = $list.find('li').eq(target);

       // will set ul scrollTop to ( li.offset.top - offset )
      target = $list.scrollTop() + $new_top_li.offset().top - module.container.offset;

       // also move the slimScrollBar, so that the next mousewheel event won't
       // override my scrollTop with nonsense (because that's how slimscroll works).
      handle_top = ratio * module.handle.max;
      handle_top = parseInt(handle_top, 10);
      if (handle_top > module.handle.final) {
        handle_top = module.handle.final;
      }

       // execute scrollage.
      if (target || (target === 0)) {
        $list.stop().animate({ scrollTop: target }, module.speed);

        $handle.css({ top: handle_top });
      }
    }
    catch (ex) {
      return false;
    }
  });  // end of ( controller-click )
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  E D I T   A   L I S T  ///////////////////////////////////////////////////////////
///////////////////////////////////////////  E X P A N D   R E C E N T   L I S T S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // replaces the Latest Three of recently published Favslist lists with a much longer list.
 // More specifically, with a small framework that lets the user load the three before that,
 // and then the three before that, and then …
function set_up_expand_recent_lists()
{
  var
    $container = $('div.message.lasttops');
    $first = $container.find('div.lasttop:first'),
    itemWidth = $first.outerWidth(true);

  itemWidth = (  isNaN(itemWidth)  ||  (itemWidth < 0)  )  ? 0 : itemWidth;  // safety precaution


   // validate environment.
  if (  $container.length  &&  itemWidth  ) {

    var
      $template = $first.clone(),
      $slider = null,
      i, lists = [],
      itemHeight = $first.height() +40;    // extra height just for looks.


     // completely remove the current three.
    $container.children('div.lasttop')
      .add('div.list_of_lists')   // also remove the ported implementation on FL (it doesn't feature the secret lists)
      .remove();

     // inject a sliding framework.
    $container.append(
      '<div class="wooden_listoflists">'
     +  '<div class="wooden_overflow">'
     +    '<div class="wooden_slider"></div>'
     +  '</div>'
     +  '<span class="recentlist_arrow arrow_left">&nbsp;</span>'
     +  '<span class="recentlist_arrow arrow_right">&nbsp;</span>'
     +'</div>'
    );
    $('.wooden_listoflists').height(itemHeight);
    $slider = $('.wooden_slider');


     // get the data.
    lists = $('select option').map(get_initial_ranklists);

     // sort the data by id, descendingly.
    lists.sort(function(a,b){
      return b.id - a.id;
    });

     // create a global variable exclusive to this module, mostly for the transport to
     // the sub-functions.
    modERLi = {
      $container: $container,
      $slider: $slider,
      $template: $template,
      itemWidth: itemWidth,
      itemHeight: itemHeight,
      remaining: lists,
      fadingTime: 200
    }

     // now that we know how many items there are, let's adjust the width of the slider.
     // The full width will only be needed in the rare case of a user reaching the extreme
     // right and "unrecent" end – but safe is safe.
    $slider.width( itemWidth * lists.length );

     // initial inject. In most cases, the user won't even notice something has changed
     // (except for the new arrows) – unless there's a recent secret list!
    inject_next_recent3lists();
    $slider.css('margin-left', 0);

     // initialize the state of this classname. The ':lt(3)' is a safety precaution.
    $slider.find('.lasttop:lt(3)').addClass('active');
    handle_recentlists_arrow_visibility();

     // arrow clickability.
    $container.find('.recentlist_arrow').click(recentlists_arrowclick);

  }  // end of ( valid environment )
}


 // injects new lists to the "Recent Lists" list in increments of three.
function inject_next_recent3lists()
{
  var i;

   // inject the data. Three items (at most).
  for ( i = 0; i < 3; i++ ) {
    if (i < modERLi.remaining.length) {

      var
        list = modERLi.remaining[i],
        imgurl = '';

       // safety pracaution.
      if (list) {

         // construct image url.
        imgurl = list.url.replace( /^lists\/([^\/]+)\/(\d+)$/, 'photos/lists/x1/$1-$2.jpg' );

         // create item …
        modERLi.$template.clone()
          .find('a')                  // go to child level
            .attr('href', list.url)
          .end()                      // return to template level
          .find('img')
            .attr({  src:imgurl  ,  alt:list.title  })
          .end()
          .find('h3')
            .text(list.title)
          .end()
           // … and inject it.
          .appendTo( modERLi.$slider );

      }  // end of ( safety )
    }  // end of ( if at least one item remaining )
  }  // end of ( for )


   // prepare the next step: reduce the list by its first three items.
  modERLi.remaining = modERLi.remaining.slice(3);
}


 // advances my "Recent Lists" slider to the next three items. Always exactly three.
 // Boolean parameter isNext is either next or previous, thus defining the direction
 // in which to advance.
function step_prevnext_recent3lists( isNext )
{
   // --- preparation ---
  var
    $all = modERLi.$slider.find('.lasttop'),
    $act = $all.filter('.active'),
    a=l=step = 0,
    $three = null;


  if (isNext) {
    l = $all.last().index();              // limit, edge of slider
    a = $act.last().index();              // edge of "active block"
    step = (( (l-a) > 3 )  ? 3 : (l-a));  // modifier amount by which to step
  }
   // isPrev
  else {
    l = 0;
    a = $act.first().index();
    step = (( (a-l) > 3 )  ? 3 : (a-l)) *(-1);
  }

   // get set.
  $three = $act.map(function(){

    var                      // don't confuse the indices: map param "index" would refer to
      i = $(this).index();   // ".active" items;  jQ.index() refers to ".lasttop" siblings + self.

    return $all.get( i+step );
  });


   // --- execution ---

   // firstly, class name.
  $act.removeClass('active');
  $three.addClass('active');

   // secondly, margin-left.
  a = modERLi.$slider.find('.lasttop.active:first').index();
  a = (a < 0)   ? 0   : 0 - a* modERLi.itemWidth;

  modERLi.$slider.animate({ marginLeft: a +'px' });
}


 // retrieves the full list of all rankable Lists. Even the promoted ones, the "secret" ones,
 // as well as the ones otherwise and officially excluded from "recent-ness". In order to
 // achieve this, I'm using the combobox right above these "Recent Lists". Returns a jQuery
 // collection (filled with drastically reduced objects) – not an array!
function get_initial_ranklists()
{
  var
    $el = $(this),    // this = an ‹option› element
    title = $el.text(),
    url = $el.val(),
    id = url.replace( /^.+\/(\d+)$/, "$1" ),   // retrieve the numeric FL ID representing the list.
    result = null;


  result =
    (  isNaN(id)  ||  (id == 0)  )
      ? null
      : {  title:title  ,  url:url  ,  id:parseInt(id, 10)  };

  return result;
}


 // determines whether or not my "Recent Lists" arrows have now reached a hard border,
 // and acts accordingly.
function handle_recentlists_arrow_visibility()
{
  var
    $left  = $('.recentlist_arrow.arrow_left',  modERLi.$container),
    $right = $('.recentlist_arrow.arrow_right', modERLi.$container);


   // left arrow
  if (  modERLi.$slider.find('.lasttop:first').is('.active')  ) {

    $left.filter(':visible').fadeOut(modERLi.fadingTime);
  } else {
    $left.filter(':hidden').fadeIn(modERLi.fadingTime);
  }


   // right arrow
  if (  !modERLi.remaining.length
     &&  modERLi.$slider.find('.lasttop:last').is('.active')  ) {

    $right.filter(':visible').fadeOut(modERLi.fadingTime);
  } else {
    $right.filter(':hidden').fadeIn(modERLi.fadingTime);
  }
}


 // handles the "Recent Lists" arrow clickability.
function recentlists_arrowclick()
{
   // prevent animation from breaking when arrow-user is impatient. Must be set early.
  if ( $.finish ) {
    modERLi.$slider.finish();   // this doesn't work in Opera because I'm using FL's jQuery (1.8) in Opera.
  }
  else {
    modERLi.$slider.stop(true, true);
  }

  var
    prevnext = null,
    isNext = $(this).is('.arrow_right'),
    before = modERLi.$slider.css('margin-left'),
    isRightBorder = modERLi.$slider.find('.lasttop:last').is('.active'),
    isSoft = !!modERLi.remaining.length;

   // get the current slider position as a number/integer.
  before = before.match( /\d+.*px/ )   ? parseInt(before, 10)   : 0;

   // validate click, don't proceed on a bump against the hard borders. An additional
   // safety precaution, as the arrow visibility kinda already prevents that.
  if (  (isNext  &&  ((isRightBorder && isSoft)  ||  !isRightBorder))  // looks redundant but it isn't!
    || (!isNext  &&  (before < 0))  ) {

     // first, inject if necessary. That is, if we're bumping against
     // a soft right border.
    if (  isNext  &&  isRightBorder  &&  isSoft  ) {
      inject_next_recent3lists();
    }

     // then, advance a step.
    step_prevnext_recent3lists(isNext);
    handle_recentlists_arrow_visibility();

  }  // end of ( valid click )
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  E X P A N D   R E C E N T   L I S T S  ///////////////////////////////////////////
///////////////////////////////////////////////  B R O W S E   C A T E G O R I E S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // provides a user-interactive category filter for easier browsing of recently
 // added Pages.
function filter_recent_pages()
{
  var matches = null, v=0,
      url = window.location.href,
      $Obj = $('a:contains(Add page)');  // inject the filter next to this link.

   // validate environment.
  if (  $Obj.length  &&  (matches = url.match( /\/pages\/?(p[0-9]+)?$/ ))  )
  {
    var style = "position: fixed; z-index: 10000001; padding: 20px; border: 1px solid #797979; "
      +"background-color: antiquewhite; cursor: move; border-radius: 3px; box-shadow: 3px 3px 10px -5px #200000;";

     // take the link as positioning orientation.
    v = $Obj.position().left + $Obj.width() + 20;
    v = isNaN(v) ? 500 : v;
    style += " left: "+ v +"px;";

    v = $Obj.position().top - 15;
    v = isNaN(v) ? 200 : v;
    style += " top: "+ v +"px;";

    $Obj.after(
      '<fieldset class="wooden_drag" style="'+ style +'">'
     +  '<select id="wooden_rp_filter" size="1" style="cursor: default;"></select>'
     +'</fieldset>'
    );

        $Obj = $('#wooden_rp_filter');
        if ( $Obj.length )  // safety precaution
        {
           // get the categories that are present in the current recent Pages.
           // (Avoid duplicates).
          var Options = [], i, Out = "";
          $('.blockpage p:last-child').each(function(){
            var cat = $(this).text();
            if ( $.inArray( cat, Options ) == -1 ) {
              Options.push(cat);
            }
          });

          if ( opopSortFilters ) {
            Options.sort();
          }

           // display.
          Out = "<option value='0'>Filter …</option>";
          for ( i = 0; i < Options.length; i++ )
            Out += "<option>"+ Options[i] +"</option>";
          $Obj.html(Out);

           // make it work! (Add functionality afterwards).
          $Obj.change(function(){
             // reset
            if ( $(this).val() === "0" )
              reset_rp_filter();

             // highlight
            else
            {
              $('#wooden_rp_filter option:first:contains(Filter)').text("[RESET]");

              var Category = $('#wooden_rp_filter :selected').text();
              if ( Category == "" )  // safety precaution
                alert("[Woodrow] Invalid category.");

              else
              {
                 // first hide everything …
                $('.blockpage').css('opacity','0.2')

                 // … then get the ones needed …
                .filter(function(){
                  return $('p:last-child', this).text() === Category;
                })

                 // … and highlight them.
                .css('opacity','1');
              }
            }

          });  // end of ( filter on.change )


           // extra gimmick: make it draggable.

             // … enable this again because otherwise, the combobox won't work anymore.
          $Obj.mouseenter(function(){
             // undo.
            if ( $Obj.enableSelection )
             $Obj.enableSelection();

          }).mouseleave(function(){
             // prevent text selection on-drag.
            if ( $Obj.disableSelection )
             $Obj.disableSelection();
          });

          $Obj = $Obj.closest('fieldset.wooden_drag');
          if ( $Obj.length )
          {
            $Obj.mousedown(function(e)
            {
               // validate drag operation: only allow dragging with the left mouse button.
               // The combobox doesn't belong to the "valid drag-start area".
              if (  (e.which == 1)
                &&  (   ( e.srcElement && (e.srcElement.nodeName.toLowerCase() == "fieldset") )        // Opera
                    ||  ( e.target     && (    e.target.nodeName.toLowerCase() == "fieldset") )   )  ) // Chrome
              {

                 // Make the fieldset mimick the cursor movement. For that, it is constantly
                 // repositioned on-move, using the mouse cursor position and taking into account
                 // where inside the fieldset the drag has started. That's why I'm forwarding the
                 // x|y-coordinates from the time of the drag-start.

                $(window).mousemove( {x: e.offsetX, y: e.offsetY}, function(e)
                {
                  hello_Im_dragging = true;

                  var x = e.pageX - e.data.x - 21 - $(document).scrollLeft();
                  var y = e.pageY - e.data.y - 21 - $(document).scrollTop();

                  $Obj.css('left', x).css('top', y);

                });  // end of ( mouse move)
              }  // end of ( left-click )
            })  // end of ( mouse down )
            .mouseup(function(e)
            {
              var Out = $('#output').text()+ ' :: up.';
//              $('#output').text(Out);
              var was_dragging = hello_Im_dragging;
              hello_Im_dragging = false;

              $(window).unbind('mousemove');

               // quick-fix, so that it doesn't cause error messages in other browsers.
//              widget.preferences.pos_rp_filter = {
//                'top':  $Obj.position().top,
//                'left': $Obj.position().left
//              };

              if (!was_dragging) {
                // detect click. If I need it, that's how it works. But I don't need it.
              }
            });  // end of ( mouse up )

// on-drop: save location in preferences object.

	      }  // end of ( drag functionality / found fieldset )
    }  // end of ( found #wooden_rp_filter )

// TODO:
// · Force-reposition on-resize-window (i.e. to/from fullscreen).
// · Save/load filter position to/from preferences.
// · Code cleanup / merge with wooden_soc_filter.
// · I should use $(window).mouseup() to end the drag. Instead of $Obj.mouseup(). Then it doesn't
//   matter *that* much that the box' position is sometimes off (it's perfect in Opera but now it's
//   not in Chrome).

  }  // end of ( valid environment )
}

function reset_rp_filter()
{
// kommt noch
  $('.blockpage').css('opacity','1');
  var $filter = $('#wooden_rp_filter');
  $('option:first:contains(RESET)', $filter).text("Filter …");
  $filter.val(0);
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  B R O W S E   C A T E G O R I E S  ///////////////////////////////////////////////
/////////////////////////////////////  A N O T H E R   U S E R ' S   P R O F I L E  /////
/////////////////////////////////////////////////////////////////////////////////////////


//// NOTE:  sent back to development status (modify_forChrome)
/*
 // injects a button/link to let the user jump from several places in Favsland
 // (i.e., someone user's list) to the view mode(!) of one's own.
function inject_self_jumper()
{
  var matches = null,
      url = window.location.href;

   // validate environment. Either of these two, I'm gonna call them
   // "otherlist" and "combinedlist" respectively:
   // www.favslist.com/users/user-name/numberic-user-id/lists/numeric-list-id
   // www.favslist.com/lists/list-title/numeric-list-id
  if (  (matches = url.match( /\/users\/[^\/]+\/.+\/lists\/([0-9]+)/ )
                || url.match( /\/lists\/[^\/]+\/([0-9]+)/ ))
    &&  (matches.length >= 2)  )
  {
     // get user name/id.
    url = $('li.user a.name').attr('href');
    if (url)
    {
      url += "/lists/"+ matches[1];

       // inject button/link.
      $('.bigrank').before(
        "<a href=\""+ url +"\" class='bigbutton bigview' "
        +"style='line-height: 30px; font-size: 10px; margin-left: 4px; float: right;'>"
       +"<em></em>View</a>"
      );

       // in the case of combined charts, I'm having arrangement issues injecting the button.
      var $p = $('.statsrank').find("p:contains(It's your turn to infl)");
      if ( $p.length )
      {
         // my solution: shorten the text …
        $p.html( $p.html().replace("It's your turn to infl", "Infl") )
         // … and remove the line break.
        .find('br').before(" ").remove();
      }
    }  // end of ( valid user things )
  }  // end of ( valid environment: otherlist or combinedlist )


   // I want to be able to jump to view mode when I'm ranking my own list as well.
  else if (  (matches = url.match( /\/account\/lists\/([0-9]+)/ ))
         &&  (matches.length >= 2)  )
  {
     // a tiny bit redundant but repeating similar code just twice is okay enough to do it.
     // get user name/id.
    url = $('li.user a.name').attr('href');
    if (url)
    {
      url += "/lists/"+ matches[1];

       // inject link.
      $('p:contains(Updates are automatically saved) a').before(
        "<a href=\""+ url +"\">See it</a> - "
      );
    }  // end of ( valid user things )
  }  // end of ( also valid: ranklist )
}
*/


/////////////////////////////////////////////////////////////////////////////////////////
/////  A N O T H E R   U S E R ' S   P R O F I L E  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////  F O R U M  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // fixes the forum's (imo) broken edit box which – for some *weird* reason –
 // doesn't have a vertical scrollbar by default. Unthinkable!
function fix_forum_vert_scroll()
{
   // how to, most effectively, identify the forum-edit-box' presence …
  if (  $('div.smileylist').length  &&  $('div.textarea textarea').length  )

    $('div.textarea textarea').css('overflow-y', 'scroll');
}



 // I often read the last post in a thread – only to realize that there are several more
 // thread pages. And I just didn't notice them. That's because gray on gray is hard to say—
 // err, see. This func fixes the styling a bit.
function css_highlight_followup_thread_pages()
{
   // only in the forums.
  if ( window.location.href.indexOf( 'favslist.com/forums/' ) != -1 ) {

    $('.pagination strong ~ a.no').addClass('followup');
  }
}





 // make the sitewide hashtagged internal links (i.e. forum timestamps) consider the
 // menu height so that the respective content isn't partly conceiled by it.
function anchor_consider_menu()
{
  var
    hash = null,
    isVisible = false;

  isVisible =
    (typeof document.hasFocus === 'undefined')
    ? (document.visibilityState == 'visible')   // Opera, extra-sausage.
    : document.hasFocus();


  $(window)
    .focus(function(){
      isVisible = true;
    })
    .blur(function(){
      isVisible = false;
    });


   // get the hashtag/id.
  if (hash = extract_hashtag(window.location.href)) {

    var
      $anchor = $('a[name="'+ hash +'"]');

     // safety precaution.
    if (  $anchor.length  &&  $anchor.offset()  ) {

       // let the webpage load.
      $(document).ready(function(){

        if (isVisible) {
          highlight_post(hash);

           // prevent the browser's default behavior from triggering.
          return false;
        }
         // act WHEN you become visible. (But only once).
        else {
          $(window).one('focus', function(){

            highlight_post(hash);

             // prevent the browser's default behavior from triggering.
            return false;
          });
        }

      });  // end of ( doc.ready )
    }  // end of ( valid $anchor )
  }  // end of ( got hashtag/id )


   // also do the same for currently visible forum timestamps.
  $('a.topic').click(function(){

    if (hash = extract_hashtag(this.href)) {

      highlight_post(hash);

       // prevent the browser's default behavior from triggering.
      return false;
    }
  });
}

 // extracts the hashtag segment from a given URL string.
 // Returns the mere hashtag as a string, or null if not found.
function extract_hashtag( url )
{
  var hash = null;

  if (  url  &&  (hash = url.match( /#(.+)$/ ))  ) {
    hash = hash[1];
  }

  return hash;
}

 // highlights a post identifyable by the given hashtag/id, with the help of color
 // and scrolling.
function highlight_post( hash )
{
  var
    $anchor = $('a[name="'+ hash +'"]');

   // validate parameter
  if ( $anchor.length ) {

     // calculate the height of the mega-meta-master-menu – if it hasn't been already.
    if (!metaMenuHeight) {
      metaMenuHeight = $('#top').height();
      metaMenuHeight = (metaMenuHeight) ? metaMenuHeight +25 : 104;
    }

     // apply highlight color without any fx.
    $anchor.next().css({ backgroundColor: 'lightsalmon' });

     // scroll the document. (prepending a delay makes the animation somehow look
    $scrolldoc.delay(1)                            // smoother. I don't know why)

       // scroll the document so that the post in question isn't partially concealed
       // by the mega-meta-master-menu anymore – as is FL's default situation.
       // (This will actually be fired before the browser's default behavior sets the
       // scrollTop.)
      .animate({
          scrollTop: $anchor.offset().top -metaMenuHeight
        },
        250,
         // when finished scrolling (and no sooner), fade the highlight color back
         // to transparency. (jQuery UI is needed for this!)
        function(){
          $anchor.next().animate({
              backgroundColor: 'transparent'
            },
            250, 'easeOutQuad'
          );
        }  // end of ( scrolling event's callback )
      );  // end of ( first / upper-most animation bracket )
  }  // end of ( validate parameter )
}


/////////////////////////////////////////////////////////////////////////////////////////
/////  F O R U M  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////  B R A N D S   /   F A N S  /////
/////////////////////////////////////////////////////////////////////////////////////////


 // fixes a bad implementation of an fan-page-admin-only overlay element. (Visible if you
 // hover over the header image as a fan page admin).
function fix_fanpage_admin_overlay()
{
   // no need to validate the environment. jQuery does so already.

  $('.brandheader.upload').has('.optionsdefault').css('overflow-x', 'hidden');
}



/////////////////////////////////////////////////////////////////////////////////////////
/////  B R A N D S   /   F A N S  ///////////////////////////////////////////////////////
/////////////////////////////////  Q U I C K L I N K S   C U S T O M I Z A T I O N  /////
/////////////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////////////////////////////////////
/////  Q U I C K L I N K S   C U S T O M I Z A T I O N  /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


// eof.
