
/** development_dump.js
*** Last Update: 2o15-11-o2
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/






 // checks if an object is an array
function IsArray()
{
  if (  ( arguments.length < 1 )  ||  ( arguments[0] == null )  ||  ( typeof arguments[0] != "object" )  )
	return false;
  else
  {
	var Hilf = arguments[0].constructor.toString();
	Hilf = Hilf.search( /function Array/ );
	   // if found (and if found at the beginning, pos 0) then it is an array
	return Hilf == 0;
  }
}







 // determines which element needs to be scrolled when the document/body itself needs
 // to be scrolled, and returns that element as a jQuery collection. Because, this is
 // browser-dependent, you know.
function get_doc_scrollElement()
{
  // for the sake of effectivity & simplicity, I'll choose a browser-sniffing solution
  // instead of the dynamic apprach that I had worked out with a helping nudge of
  // StackOverflow [1]. Because, the problem with that approach is that it fails to
  // identify the browser if scrollTop is already capped. And solving *that* problem
  // programmatically would be indeed possible, but imo less effective than this.
  //
  // [1]: http://stackoverflow.com/a/4915885/2126442

  if ( !!window.navigator.userAgent.match(/Chrome/) ) {
    return $('body');
  }

  else if ( !!window.navigator.userAgent.match(/Opera|Firefox/) ) {
    return $('html');
  }

  else {
    return $(null);
  }
}

 // let's gather all FLEX-relevant jQuery extensions here.
function wood_expands_jquery()
{
   // adds the given class name to the jQuery collection in question
   // if the given condition is true. Otherwise, removes the class name.
   // The class is added/removed to the collection as one whole.
  $.fn.addElseRemoveClass = function( condition, classes ){

    if (condition) {
      this.addClass(classes);      // apply to whole set, without looping over the elements.
    } else {
      this.removeClass(classes);
    }

    return this;
  };
}

//// DEVELOPMENT
//
// first tests.
//
function analyze_environment()
{
  var
    l = window.location,
    matches = [],
    tmp = ''
  ;
  environment = {};



  try {
    if (false) {}   // just so that all blocks start with "else if".


    else if (  matches = l.pathname.match( /^\/lists\/[^\/]+\/(\d+)/ )
    ) {
      environment.where = 'view-a-list';
      environment.id = matches[1];
    }


    else if (  matches = l.pathname.match( /^\/account\/lists\/(\d+)/ )
    ) {
      environment.where = 'edit-a-list';
      environment.id = matches[1];
    }


    else if (  matches = l.pathname.match( /^\/pages\/[^\/]+\/(\d+)\/?$/ )
    ) {
      environment.where = 'view-a-page';
      environment.id = matches[1];
    }


    else if (  matches = l.pathname.match( /^\/pages(?:\/p(\d+))?\/?$/ )
    ) {
      environment.where = 'browse-all-pages';
      environment.page = matches[1]  ? parseInt(matches[1], 10) +1  : 1;
    }


    else if (  matches = l.pathname.match( /^\/pages\/(\d+)(?:\/p(\d+))?\/?$/ )
    ) {
      environment.where = 'browse-category';
      environment.id = matches[1];
      environment.page = matches[2]  ? parseInt(matches[2], 10) +1  : 1;
    }


    else if (  l.pathname.match( /^\/pages\/add\b/ )
    ) {
      environment.where = 'search-or-create';
      if ( l.pathname.match( /\bcategories\/?$/ ) ) {
        environment.step = 'category';
      }
      else if ( l.pathname.match( /\bdescription\/?$/ ) ) {
        environment.step = 'description';
      }
      else {
        environment.step = 'search';
      }
    }


    else if ( matches = l.pathname.match( /^\/pages\/[^\/]+\/(\d+)\/edit(?:\/[^\/]*)?$/ )
    ) {
      environment.where = 'edit-a-page';
      environment.id = matches[1];
    }


    else if (  matches = l.pathname.match( /^\/users\/[^\/]+\/(\d+)/ )
    ) {
      environment.user_id = matches[1];

      tmp = $('li.user a.name').get(0)
        .pathname                                 // i.e.  /users/PedroJensen/13
        .match( /^\/users\/[^\/]+\/(\d+)/ )
      ;
      environment.whom = (tmp[1] === environment.user_id)  ? 'own'  : 'another';

      if (  matches = l.pathname.match( /^\/users\/[^\/]+\/(\d+)\/?$/ )
      ) {
        environment.where = 'user-feed';
      }
      else if (  matches = l.pathname.match( /\/\d+\/lists\/?$/ )
      ) {
        environment.where = 'user-tiles';
      }
      else if (  matches = l.pathname.match( /\/\d+\/lists\/(\d+)\/?$/ )
      ) {
        environment.list_id = matches[1];
        environment.where = 'user-list';
      }
      else if (  matches = l.pathname.match( /\/\d+\/pages\/?$/ )
      ) {
        environment.where = 'user-pages';
      }
      else if (  matches = l.pathname.match( /\/\d+\/pages\/(\d+)\/?$/ )
      ) {
        environment.list_id = matches[1];
        environment.where = 'user-pages-per-list';
      }
      else if (  matches = l.pathname.match( /\/\d+\/friends\/?$/ )
      ) {
        environment.where = 'user-friends';
      }
      else if (  matches = l.pathname.match( /\/\d+\/followers\/?$/ )
      ) {
        environment.where = 'user-followers';
      }
      else if (  matches = l.pathname.match( /\/\d+\/followings\/?$/ )
      ) {
        environment.where = 'user-followings';
      }
      else if (  matches = l.pathname.match( /\/\d+\/about\/?$/ )
      ) {
        environment.where = 'user-about';
      }
      else if (  matches = l.pathname.match( /\/\d+\/about\/([^\/]+)\/([^\/]+)\/?$/ )
      ) {
        environment.where = 'user-library';
        environment.corner = matches[1];
        switch (matches[2]) {
          case 'played':
          case 'read':
          case 'watched':
            environment.shelf = 'done';
            break;

          case 'collection':
            environment.shelf = 'collected';
            break;

          case 'backlog':
          case 'watchlist':
          case 'wishlist':
            environment.shelf = 'todo';
            break;
        }
      }
    }


    else if (  matches = l.pathname.match( /^\/status\/(\d+)/ )
    ) {
      environment.where = 'single-status';
      environment.id = matches[1];
    }


    else if (  l.pathname == '/'
	    ) {
	      environment.where = 'front-page';
    }


    else if (  l.pathname.match( /^\/notifications\/?/ )
    ) {
      environment.where = 'notifications';
    }


    else if (  matches = l.pathname.match( /^\/messages\/(\d+)\/?/ )
    ) {
      environment.where = 'pm-hub';
      environment.id = matches[1];
    }


    else if (  l.pathname.match( /^\/friends\/?/ )
    ) {
      environment.where = 'manage-friends';
    }


    else if (  l.pathname.match( /^\/forums\/?/ )
    ) {
      environment.where = 'forum-hub';
    }


    else if (  matches = l.pathname.match( /^\/forums\/[^\/]+\-f(\d+)(?:\-p(\d+))?\/?/ )
    ) {
      environment.where = 'subforum';
      environment.id = matches[1];
      environment.page = matches[2]  ? parseInt(matches[2], 10) +1  : 1;
    }


    else if (  matches = l.pathname.match( /^\/forums\/[^\/]+\-(\d+)\/?/ )
    ) {
      environment.where = 'forum-thread';
      environment.thread_id = matches[1];
      if (l.hash) {
        environment.post_id = l.hash.substring(1);
      }
    }


    else if (  matches = l.pathname.match( /^\/forums\/edit\/(\d+)\/?/ )
    ) {
      environment.where = 'forum-edit-post';
      environment.id = matches[1];
    }


    else if (  (tmp = $('.brandabout .avatar img'))  &&  tmp.length
    ) {
      environment.where = 'brand-page';   // fuck fan pages, I'll call them all "brand pages".
      tmp = tmp.attr('src').match( /\/x1\/(\d+)\-[^\/]+\..{3,4}$/ );
      if (tmp) {
        environment.id = tmp[1];
      }
    }
  }
  catch (e) {
    console.log(e);
  }

  //console.log( environment );
}











//// DEVELOPMENT
//
 // note, es geht nicht um den view-mode (wie da, wo ich den self-jumper eingefuegt habe),
 // sondern when editing a list (when ranking). da gibt's so 'ne combobox, um zu anderen
 // listen zu springen.
function optimize_jumper_to_other_lists()
{
  $('p.otherlist select option').each(function()
  {
    var $el = $(this), title = $el.text();

    $el.text(

      title
        .replace( /^All-Time Favorite/, "ATF" )
        .replace( /^Most Anticipated/, "MA" )
        .replace( /^Favorite/, "Fav" )
    );

    // Also, TODO: group them by Hub (manually, once) and add ----- separators. Make the combobox prettier!

  });
}










//// DEVELOPMENT
//
 // qnd fix.
function fix_thumb_aspectratio()
{
   // all list items , without honorable mentions , get their images
  $('div.profiluserlist li').not('.mini').find('img').each(function(){

     // preparation.
    var $el = $(this),
        url = $el.attr('src'),
        style_outer = "display: block; float: left;"
              +" background-repeat: no-repeat; background-position: center center;"
              +" border: 1px solid #505050; border-radius: 2px;"
              +" width: 60px; height: 60px; padding: 1px; margin-right: 10px;",
        style_inner = "display: block; opacity: 0.5;"
              +" background-repeat: repeat; background-position: center center;"
              +" width: 60px; height: 60px;";

// Hmmm. Unwanted reduced would-be-perfect-fit not fixed yet. Erkenntnisse today:
//
// · ‹img› stretches when style="width: 60px ; height: 60px;" (on natural 50×50)
//   whereas background-image doesn't.
//
// · outer ‹span›'s opacity is layed upon inner ‹span›. Therefore I'm laying the
//   tiled transparent background inside the full-opac foreground pic. Which is
//   unintuitive. But I didn't find a better way yet.

    $el.replaceWith(
      "<span style=\"background-image: url("+ url +"); "+ style_outer +"\">"
     +  "<span style=\"background-image: url("+ url +"); "+ style_inner +"\">"
     +"</span>"
    );
  });
}










//// DEVELOPMENT
//
// plz don't forget that I need to re-visit that.
//
 // make the goddamn automation of the Happening Now slideshow box go away!!
 // It's okay to be clickable but auto-slide is terrible.
function stop_happening() {

  var $el = $('div.fullwall div.slideshow');

   // validate environment.
  if ( $el.length ) {

     // first, stop the current automation.
    $el.timer('stop');

     // next, change class name in order to prevent the timer from being started again.
    $el.removeClass('slideshow').addClass('slideshow-disabled-automation');


     //--- copied from FL's master-script (and altered the class name) so that onclick
     // keeps working ---//
    $(document).on('click', 'div.slideshow-disabled-automation li', function(){
			var newslide = $('div.slideshow-disabled-automation .slide[rel="slide'+$(this).attr('rel')+'"]');
			if ( !newslide.is(':visible') ) {
				$('div.slideshow-disabled-automation .slide').slideUp('fast');
				newslide.slideDown('fast');

				// Save slide
				slide = parseInt($(this).attr('rel'));
				}
			return false;
		});
	// TODO: can I do this 'altered copy' programmatically?

  }
}











//// DEVELOPMENT
//
 // injects a button/link to let the user jump from several places in Favsland
 // (i.e., someone user's list) to the view mode(!) of one's own.
function inject_self_jumper()
{
  var
    matches = null,
    urlv = window.location.href,
    urlc = '',
    longstring = '',
    isCharts = false,
    isMine = false;

   // validate environment. Either of these two, I'm gonna call them
   // "otherlist" and "combinedlist" respectively:
   // www.favslist.com/users/user-name/numberic-user-id/lists/numeric-list-id
   // www.favslist.com/lists/list-title/numeric-list-id
  if (  (matches = urlv.match( /\/users\/[^\/]+\/.+\/lists\/([0-9]+)/ )
                || urlv.match( /\/lists\/[^\/]+\/([0-9]+)/ ))
    &&  (matches.length >= 2)  )
  {

     // get user name/id. Always of the logged in user, I mean. The FLEX / FL user.
    urlv = $('li.user a.name').attr('href');   // i.e. "users/PedroJensen/13"
    if (urlv)
    {
      isMine = !!window.location.href.match(new RegExp( urlv ));
      if (!isMine) {
        isCharts = !!window.location.href.match( /favslist\.com\/lists\/./ );
      }

       // the embed button doesn't even make sense on other people's lists.
       // Let me remove that while I'm here.
      if ( !isMine ) {
        $('.usershare a[href^="embed/"]').remove();
      }

      urlv += '/lists/'+ matches[1];
      urlc = '/lists/-/'+ matches[1];


      longstring = '<div class="wooden_jump_wrapper">';
      if (!isMine) {
        longstring +=
        '  <a href=\"'+ urlv +'\" class="bigbutton jumper jumpmine">'
       +'  <em></em>Mine</a>';
      }
      if (!isCharts) {
        longstring +=
        '  <a href=\"'+ urlc +'\" class="bigbutton jumper jumpcharts">'
       +'  <em></em>Charts</a>';
      }
      longstring += '</div>';


       // inject button/link.
      $('.statsrank').has('.bigrank')
        .add('.usershare').has('.bigrank')
        .find('.bigrank:first')
        .before(longstring);

       // advanced styling of "more than two buttons".
      var $greens = $('.wooden_jump_wrapper .jumper');
      if ($greens.length > 1) {
        $greens.addClass('halfbig');
      }

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


     // offer "create-list" link if user lands on empty own list.
    if (  isMine  &&  ($('.recolist').length == 0)  ) {
      $('.profileright').append(
        '<span class="no_list_msg">List does not exist.</span>'
       +'<a href="account/lists/'+ matches[1] +'" class="bigbutton bigrank">'
       +'<em></em>Make your list NOW!</a>'
      );
    }



  }  // end of ( valid environment: otherlist or combinedlist )


   // I want to be able to jump to view mode when I'm editing my own list as well.
  else if (  (matches = urlv.match( /\/account\/lists\/([0-9]+)/ ))
         &&  (matches.length >= 2)  )
  {
     // a tiny bit redundant but repeating similar code just twice is okay enough to do it.
     // get user name/id.
    urlv = $('li.user a.name').attr('href');
    if (urlv)
    {
      urlv += "/lists/"+ matches[1];

       // inject link.
      $('p:contains(Updates are automatically saved) a').before(
        "<a href=\""+ urlv +"\">See it</a> - "
      );
    }  // end of ( valid user things )
  }  // end of ( also valid: ranklist )
}












//// DEVELOPMENT
//
 // things need accesskeys, bitch-yah!
function slap_on_accesskeys()
{
  $(document).ready(function(){

    $('input#searchbox').attr('accesskey','s');
    $('.wooden_date_paste:first input[type="text"]').attr('accesskey','d');
  });
}






//// DEVELOPMENT
//
// qnd quickfix. so far, damit kann ich erstmal leben.
function freeze_on_sort()
{
  var
    $slider = $('.editcoversreviews'),
    prevPos = null,
    $textlist = $('#editlist'),
    prevnextOnoff = [false,true],
    $prev = $('.prev', $slider),
    $next = $('.next', $slider);

   // validate environment
  if (  $slider.length  &&  $textlist.length  ) {

    $slider = $slider.find('.viewport #reviews');

    $textlist.mousedown(function(){

      prevPos = parseInt( $slider.css('left'), 10 );
      prevPos = isNaN(prevPos)   ? 0   : prevPos;
//console.log(prevPos);

      prevnextOnoff[0] = !$prev.hasClass('disable');
      prevnextOnoff[1] = !$next.hasClass('disable');
//console.log(prevnextOnoff);

    }).mouseup(function(){

      var x = window.setTimeout(function(){

        $slider.css('left', prevPos);
//console.log( $slider.css('left') );
        clearTimeout(x);

        if ( prevnextOnoff[0] ) {
          $prev.removeClass('disable');
        }
        else {
          $prev.addClass('disable');
        }

        if ( prevnextOnoff[1] ) {
          $next.removeClass('disable');
        }
        else {
          $next.addClass('disable');
        }

      }, 1000);
    });


  }  // end of ( valid environment )
}






//// DEVELOPMENT
//
 // sets up the "Quicken Album Tracklist" module.
function set_up_quicken_album_tracklist()
{
  var
     // find the user input field in the "Tracklist" tab in the
     // "Edit a Page" context.
    $search = $('form[action^="/pages/"][action$="/edit"] .cat34song input[name="search"]');


   // validate environment.
  if ( $search.length ) {

    $search.after(
      '<div id="wooden_tracklist_box" class="wooden_container">'
     +'  <span class="returner"><span class="trimark">\u25b6</span> Batch&nbsp;&nbsp;&nbsp;</span>'
     +'  <select size="2">'
     +'  </select>'
     +'  <textarea class="tracklist_input"></textarea>'
     +'  <input type="button" class="button" id="butt_control_tracklist" value="Go" />'
     +'  <input type="button" class="button" id="butt_thide" value="Hide" />'
     +'</div>'
    )
      .parent().css('position', 'relative');

    modQATl = {
      $trackbox: $('#wooden_tracklist_box'),
      $control: $('#butt_control_tracklist'),
      $returner: $('.returner', this.$trackbox)
    };


     // list item clickability.
    modQATl.$trackbox.on('click', 'option',
    function(){
      $search.val( $(this).text() ).keyup();
    });


    modQATl.$control.click(
    function(){
      var $el = $(this);

       // process Go-click.
      if ($el.val() == 'Go') {
        process_tracklist();
        $el.val('Edit');
      }

       // process Edit-click.
      else {
        edit_tracklist();
        $el.val('Go');
      }
    });
    $('#butt_thide').click(hide_tl_pastebox);

     // in conclusion, enter hidden mode after everything has been set up.
    hide_tl_pastebox();

  }  // end of ( valid environment )
}

 // resets the "QAT" trackbox elements.
function edit_tracklist()
{
  modQATl.$trackbox
    .find('select')
      .html('')
      .hide()
    .end()
    .find('textarea')
      .show()
    .end();
}

// paste example cases:
// https://de.wikipedia.org/wiki/Es_gibt_Reis,_Baby
// http://www.musicline.de/de/product/724382832324
//
 // analyzes the user given tracklist and converts it into a list of comfortably clickable lines.
function process_tracklist()
{
  var
    i, s = '', result = [],
    list = modQATl.$trackbox.find('textarea').hide().val().split('\n');

   // process each line of the pastebox individually.
  for ( i = 0; i < list.length; i++ ) {

     // get rid of potential whitespace and the track no. at the beginning of the line.
    s = $.trim(list[i]).replace( /^\d{1,2}\.[ \t]*/, '' );
     // ignore empty/invalid lines.
    if (s) {
       // get rid of potential track duration at the end of the line.
      s = s.replace( /\d{1,2}:\d{2}[ \t]*$/, '' );
       // now trim again.
      s = $.trim(s);
       // remove wrapping quotes if present.
      s = s.replace( /^"([^\"]+)"(?:[ \t]+.+)?$/, '$1' );
       // escape pointy brackets.
      s = s.replace( />/g, '&gt;' ).replace( /</g, '&lt;' );

       // finally
      if ( s != "" ) {
        result.push( '<option value=\"'+ s.replace( /\"/g, '' ) +'\">'+ s +'</option>' );
      }

    }  // end of ( valid line )
  }  // end of ( for each line )

  modQATl.$trackbox.find('select').show().html(result.join(''));
}

 // hides the tracklist pastebox in any case now, as requested. Also sets up the "show again".
function hide_tl_pastebox()
{
  var
    slidingTime = 250,
    h = {
      small: 10,
      large: modQATl.$trackbox.data('fullHeight')
    },
    w = {
      small: 80,
      large: 300
    };

   // save the "full height" value, if not done so already.
  if (!h.large) {
    h.large = modQATl.$trackbox.css('height');
    h.large = isNaN(h)   ? 250   : h.large;
    modQATl.$trackbox.data('fullHeight', h.large);

     // while you're at it, set up the "show again" clickability.
    $('.cat').on('click', '#wooden_tracklist_box.wsh_hidden', function(e){
      if ( !$(e.target).is('#butt_thide') ) {

         // enter "visible" mode.
        modQATl.$returner.css('visibility', 'hidden');
        modQATl.$trackbox
          .animate({ width: w.large }, slidingTime, function(){
            $(this)
              .removeClass('wsh_hidden')
              .animate({ height: h.large }, slidingTime, function(){
                $('textarea.tracklist_input', this).focus();
              });
          });
      }
    });
  }  // end of ( grant "full height" value )


   // enter "hidden" mode.
  modQATl.$returner.css('visibility', 'visible');
  modQATl.$trackbox
    .animate({ height: h.small }, slidingTime, function(){
      $(this)
        .addClass('wsh_hidden')
        .animate({ width: w.small }, slidingTime);
    });
}









//// DEVELOPMENT
//
////////////////////////////////////// PLAN:
// on-install FLEX: generate "table" once.
//
// on-valid-enviro: load full "table" once into "local scope".
//
// on-click-on-things: work with local table.
//
function sorfilcat_lists_by_gaming()
{
   // validate environment (a very specific page, hence the very specific URL).
  if ( !!window.location.href.match( /^https?:\/\/www\.favslist\.com\/lists\/s233t184$/i )  ) {

    var
      group = [];

    modSFCL = {
      reference: {},
      table: {

        manufacturers: {
          none: [],
          Atari: [],
          Commodore: [],
          Microsoft: [],
          NEC: [],
          Nintendo: [],
          Sega: [],
          SNK: [],
          Sony: [],
        },

        generations: {
          gen1: [],
          gen2: [],
          gen3: [],
          gen4: [],
          gen5: [],
          gen6: [],
          gen7: [],
          gen8: [],
        },

        types: {
          Console: [],
          Handheld: [],
          Other: [],
        }

      },  // end of ( .table )

      sort: {

        releasedates: {},
        alphabet: {},

      }  // end of ( .sort )

    };  // end of ( setup modSFCL )


     // --- inject. --- //

    $('.firstline')
      .before(
        '<div id="wooden_sorfilcat">'
       +'  <span>Sort by:</span>'
       +'  <select class="sort">'
       +'    <option value="ofl" selected="selected">Original Favsland Order</option>'
       +'    <option value="rel">Release Year</option>'
       +'    <option value="abc">Alphabet</option>'
       +  '</select>'

       +'  <select class="verb">'
       +'    <option value="0" selected="selected">Select …</option>'
//       +'    <option value="sor">Sort</option>'
       +'    <option value="fil">Filter</option>'
       +'    <option value="hig">Highlight</option>'
       +'    <option value="cat" disabled="disabled">Categorize</option>'
       +  '</select>'
       +'  <span>by:</span>'
       +'  <select class="noun" disabled="disabled">'
       +'    <option value="0" selected="selected">Select …</option>'
       +'    <option value="man" class="wsh_fil wsh_hig wsh_cat">Manufacturer</option>'
       +'    <option value="rel" class="wsh_sor wsh_fil wsh_hig wsh_cat">Release Year</option>'
       +'    <option value="gen" class="wsh_fil wsh_hig wsh_cat">Generation</option>'
//       +'    <option value="abc" class="wsh_sor">Alphabet</option>'
       +'    <option value="typ" class="wsh_fil wsh_hig wsh_cat">Device Type</option>'
//       +'    <option value="ofl" class="wsh_sor">Original Favsland Order</option>'
       +  '</select>'
       +'  <select class="adjective">'
       +  '</select>'
       +'</div>'
      );

    prep_sorfilcat();



     // --- set up combobox clickability. --- //

     // VERB

    $('#wooden_sorfilcat select.verb')

    .change(function(){

       // alter noun's content dynamically in dependence of verb selection.
      var
        v = $(this).val(),
        selector = '#wooden_sorfilcat select.noun option.wsh_'+ v;

       // disable noun if the user resets the verb combobox (selects '0'). Else, enable noun.
      $('#wooden_sorfilcat select.noun').attr( 'disabled', (   (v !== '0')   ? null   : 'disabled') );

      $(selector)
        .show()
        .siblings(':not('+ selector +'):not([value="0"])')
        .hide()
        .parent()
        .val(0);


       // reset adjective.
      $('#wooden_sorfilcat select.adjective').html('');


       // reset content FX.
      reset_SorFilCat();
    });  // end of ( on change verb )


     // NOUN

    $('#wooden_sorfilcat select.noun').change(function(){

      var v = $(this).val();

      switch (v) {

         // Manufacturer
        case "man": {
          group = modSFCL.table.manufacturers;
          break;
        }

         // Release Year
        case "rel": {
          group = modSFCL.table.releasedates;
          break;
        }

         // Generation
        case "gen": {
          group = modSFCL.table.generations;
          break;
        }

         // Device Type
        case "typ": {
          group = modSFCL.table.types;
          break;
        }

        default: {
          group = undefined;
        }
      }  // end of ( switch-case )

      verb_plus_noun_equals_adjective(v);
    });


     // ADJECTIVE

    $('#wooden_sorfilcat select.adjective').change(function(){
//console.log('the world is changing.');

      if ($(this).val() === '0') {
        reset_SorFilCat();
        return false;
      }


      var
        mode = $('#wooden_sorfilcat select.verb').val(),
        noun = $('#wooden_sorfilcat select.noun').val(),
        $select_el = $(this),
        v =   ((noun == 'gen')   ? 'gen'   : '') +$select_el.val(),
        set =   (group)   ? group[v]   : undefined;

      if ( set !== undefined ) {

         // preventing chaotic animation queueing.
        $select_el.attr('disabled', 'disabled');

        if ( mode == 'sor' ) {

//          $('.forum').sort(function(a, b){
//
//            a = $('a:first', a).attr('href').match( /\d+$/ );
//            b = $('a:first', b).attr('href').match( /\d+$/ );
//            if (a) {
//              a = parseInt(a, 10);
//            }
//            if (b) {
//              b = parseInt(b, 10);
//            }
//
//            return
//          });

        }
        else {

        $('.forum').each(function(){

          var
            $el = $(this),
            id = $el.find('a:first').attr('href'),
            found = false,
            matches = id.match( /\d+$/ );

          if ( matches ) {
            id = parseInt(matches, 10);
            found =  $.inArray(id, set) != -1;
          }


     // --- take action in dependence of mode. --- //

          switch (mode) {
            case "sor": {
              // change order of '.forum' items.
              break;
            }
            case "fil": {
              var slideSpeed = 300;
              if (found) {
                $el = $el.filter(':hidden');
              }
              else {
                $el = $el.filter(':visible');
              }
              $el.animate({ height: 'toggle', opacity: 'toggle' }, slideSpeed, function(){

                 // trigger callback only after last animation.
                if ( !$el.filter(':animated').length ) {
                  $select_el.filter(':disabled').attr('disabled', null).focus();
                }
              });
              break;
            }
            case "hig": {
              found =   (found)   ? 1   : 0.2;
              $el.css('opacity', found);
              $select_el.filter(':disabled').attr('disabled', null).focus();
              break;
            }
            case "cat": {
              // change order of '.forum' items.
              break;
            }
            default: {
              $el.css({ opacity: 1 }).show();
            }
          }  // end of ( switch-case mode )
        });  // end of ( for each .forum line )
        }  // end of ( sort geht doch anders! )

         // if, for some reason, it's still disabled at this point, then enable it.
        $select_el.filter(':disabled').attr('disabled', null);

      }  // end of ( valid set )

    });  // end of ( on change-adjective )


     // SORT

    $('#wooden_sorfilcat select.sort').change(function(){

      var v = $(this).val();

      switch (v) {

         // Release Year
        case "rel": {
          group = $.map(modSFCL.table.releasedates, function(item, index){

            index =   (isNaN(index))   ? false   : parseInt(index, 10);
            return index;
          });

          var sorted = $('.forum').get().sort(function(a, b){

            a = $('a:first', a).attr('href').match( /\d+$/ );
            b = $('a:first', b).attr('href').match( /\d+$/ );
            if (a) {
              a = parseInt(a, 10);
            }
            if (b) {
              b = parseInt(b, 10);
            }

            return group.indexOf(a) - group.indexOf(b);
          });

          $('.forum').remove();
          $('.leftlists').append(sorted);

          break;
        }

         // Alphabet
        case "abc": {
          group = $.map(modSFCL.table, function(item){

            return item.tit;
          });
//console.log(modSFCL.table);
          var sorted = $('.forum').get().sort(function(a, b){

            a = $('a:first', a).attr('href').match( /\d+$/ );
            b = $('a:first', b).attr('href').match( /\d+$/ );
            if (a) {
              a = parseInt(a, 10);
            }
            if (b) {
              b = parseInt(b, 10);
            }

            return group.indexOf(a) - group.indexOf(b);
          });

          $('.forum').remove();
          $('.leftlists').append(sorted);

          break;
        }

         // Original Favsland Order … (TODO: THIS should be the default)
        case "ofl": {
          //group = modSFCL.table.manufacturers;
          break;
        }

        default: {
          group = undefined;
        }
      }  // end of ( switch-case )

      verb_plus_noun_equals_adjective(v);

    });  // end of ( on change-sort )


    extra_sorfilcat_thingies();

  }  // end of ( valid environment )
}

 // prepares the necessary internal mini-database – or: table – where
 // I manually declare what is what.
function prep_sorfilcat()
{
  modSFCL.reference = {
    man: [
      'none',       // 0
      'Nintendo',   // 1
      'Sega',       // 2
      'Sony',       // 3
      'Microsoft',  // 4
      'Commodore',  // 5
      'Atari',      // 6
      'SNK',        // 7
      'NEC',        // 8
    ],
    typ: [
      'Console',    // 0
      'Handheld',   // 1
      'Other',      // 2
    ],
  };


var table = {

  l41: {
    tit: 'Arcade',
    man: 0,
    rel: 00000000,
    gen: 1,
    typ: 2,
  },

  l42: {
    tit: 'PC',
    man: 0,
    rel: 00000001,
    gen: 1,
    typ: 2,
  },

  l71: {
    tit: 'Jaguar',
    man: 6,
    rel: 19931115,
    gen: 5,
    typ: 0,
  },

  l68: {
    tit: 'Amiga',
    man: 5,
    rel: 19850101,
    gen: 4,
    typ: 2,
  },

  l69: {
    tit: 'Commodore 64',
    alt: [ 'C64' ],
    man: 5,
    rel: 19820801,
    gen: 3,
    typ: 2,
  },

  l62: {
    tit: 'PlayStation Portable',
    alt: [ 'PSP' ],
    man: 3,
    rel: 20041212,
    gen: 7,
    typ: 1,
  },

  l63: {
    tit: 'PlayStation',
    alt: [ 'PS1', 'PSX' ],
    man: 3,
    rel: 19941203,
    gen: 5,
    typ: 0,
  },

  l64: {
    tit: 'PlayStation 2',
    alt: [ 'PS2' ],
    man: 3,
    rel: 20000304,
    gen: 6,
    typ: 0,
  },

  l65: {
    tit: 'PlayStation 3',
    alt: [ 'PS3' ],
    man: 3,
    rel: 20061111,
    gen: 7,
    typ: 0,
  },

//  l--: {
//    tit: 'PlayStation 4',
//    alt: [ 'PS4' ],
//    man: 3,
//    rel: 20131115,
//    gen: 8,
//    typ: 0,
//  },

  l66: {
    tit: 'PlayStation Vita',
    alt: [ 'PS Vita' ],
    man: 3,
    rel: 20111217,
    gen: 8,
    typ: 1,
  },

  l55: {
    tit: 'Xbox',
    man: 4,
    rel: 20011115,
    gen: 6,
    typ: 0,
  },

  l56: {
    tit: 'Xbox 360',
    man: 4,
    rel: 20051122,
    gen: 7,
    typ: 0,
  },

//  l--: {
//    tit: 'Xbox One',
//    man: 4,
//    rel: 20131122,
//    gen: 8,
//    typ: 0,
//  },

  l43: {
    tit: 'Wii',
    man: 1,
    rel: 20061202,
    gen: 7,
    typ: 0,
  },

  l44: {
    tit: 'NES',
    alt: [ 'Nintendo', 'Nintendo Entertainment System' ],
    man: 1,
    rel: 19830715,
    gen: 3,
    typ: 0,
  },

  l45: {
    tit: 'SNES',
    alt: [ 'Super NES', 'Super Nintendo', 'Super Nintendo Entertainment System' ],
    man: 1,
    rel: 19901121,
    gen: 4,
    typ: 0,
  },

  l46: {
    tit: 'Nintendo DS',
    alt: [ 'NDS' ],
    man: 1,
    rel: 20041121,
    gen: 7,
    typ: 1,
  },

  l47: {
    tit: 'Game Boy',
    man: 1,
    rel: 19890421,
    gen: 4,
    typ: 1,
  },

  l48: {
    tit: 'Game Boy Advance',
    man: 1,
    rel: 20010321,
    gen: 6,
    typ: 1,
  },

  l49: {
    tit: 'Nintendo 3DS',
    alt: [ '3DS' ],
    man: 1,
    rel: 20110226,
    gen: 8,
    typ: 1,
  },

  l50: {
    tit: 'Nintendo 64',
    alt: [ 'N64' ],
    man: 1,
    rel: 19960623,
    gen: 5,
    typ: 0,
  },

  l54: {
    tit: 'GameCube',
    man: 1,
    rel: 20010914,
    gen: 6,
    typ: 0,
  },

  l152: {
    tit: 'Wii U',
    man: 1,
    rel: 20121118,
    gen: 8,
    typ: 0,
  },

  l57: {
    tit: 'Game Gear',
    man: 2,
    rel: 19901006,
    gen: 4,
    typ: 1,
  },

  l58: {
    tit: 'Master System',
    man: 2,
    rel: 19850101,
    gen: 3,
    typ: 0,
  },

  l59: {
    tit: 'Mega Drive',
    alt: [ 'Genesis' ],
    man: 2,
    rel: 19881029,
    gen: 4,
    typ: 0,
  },

  l60: {
    tit: 'Saturn',
    man: 2,
    rel: 19941122,
    gen: 5,
    typ: 0,
  },

  l61: {
    tit: 'Dreamcast',
    man: 2,
    rel: 19981127,
    gen: 6,
    typ: 0,
  },

  l67: {
    tit: 'PC Engine',
    man: 8,
    rel: 19871030,
    gen: 4,
    typ: 0,
  },

  l70: {
    tit: 'Neo Geo',
    man: 7,
    rel: 19900131,
    gen: 4,
    typ: 0,
  },
};  // end of ( setup table )


   // --- make this information insta-usable by this module. --- //

  var
    d, id,
    set = [],
    device = {},
    gloray = [],
    year = '';

  modSFCL.table.releasedates = {};

   // for each device
  for ( d in table ) {

    id = d.substring(1);
    id =   (isNaN(id))   ? 0   : parseInt(id, 10);
    device = table[d];
    device.id = id;

     // fill the global array in the global module object respectively.
    gloray = modSFCL.table.manufacturers[ modSFCL.reference.man[device.man] ];
    if (gloray !== undefined) {   // this in for-loop. Highly inefficient!
      gloray.push(id);
    }

    gloray = modSFCL.table.generations[ 'gen'+ device.gen ];   // I think I should rather use several
    if (gloray !== undefined) {                                // for-loops for more efficiency.
      gloray.push(id);
    }

    gloray = modSFCL.table.types[ modSFCL.reference.typ[device.typ] ];
    if (gloray !== undefined) {
      gloray.push(id);
    }

// aus debug gruenden, erstmal ein bisschen anders.
    year = parseInt( String(device.rel).substring(0,4), 10 );
     // make sure it's an object at this point.
    if (modSFCL.table.releasedates[year] === undefined) {
      modSFCL.table.releasedates[year] = [];
    }
    gloray = modSFCL.table.releasedates[year];
    if ( $.inArray(id, gloray) ) {
      gloray.push(id);
    }

    year = device.tit;
     // make sure it's an object at this point.
    if (modSFCL.table.releasedates[year] === undefined) {
      modSFCL.table.releasedates[year] = [];
    }
    gloray = modSFCL.table.releasedates[year];
    if ( $.inArray(id, gloray) ) {
      gloray.push(id);
    }
  }  // end of ( for each device )


   // convert object to array.
  gloray = $.map(table, function(item){
    return [item];
  });

   // pre-sort by release dates.
  gloray.sort(function(a,b){
    return a.rel - b.rel;
  });

  gloray = $.map(gloray, function(item){
    return item.id;
  });
  modSFCL.sort.releasedates = gloray;

//console.log(modSFCL.table);
}

// fills the combobox bla.
function verb_plus_noun_equals_adjective( mode )
{
  var
    items = [],
    set = (modSFCL.reference[mode])   ? modSFCL.reference[mode]   : null;

  if (mode == 'gen') {
    set = $.map(modSFCL.table.generations, function(item, index){

      var i = index.substring(3);
      return   (isNaN(i))   ? 0   : parseInt(i, 10);
    });
  }

  else if (mode == 'rel') {
    set = modSFCL.table.releasedates;
    set = $.map(modSFCL.table.releasedates, function(item, index){
      return index;
    });
  }

  else if (mode == 'ofl') {
    set = $('.forum').map(function(){
      var s = $('a[href]:first', this).attr('href');
      s = s.match( /\d+$/ );
      s =   (isNaN(s))   ? false   : parseInt(s, 10);
      return s;
    });
  }

  if (set) {
    items =
      '<option value="0">- no selection -</option>'
     +$.map(set, function(item, index){

        return '<option value="'+ item +'">'+ item +'</option>';
      });
  }
  $('#wooden_sorfilcat select.adjective').html(items);
}

function extra_sorfilcat_thingies()
{
  $('.forum a:contains(Favorite)').addClass('wooden_titlelinks').each(function(){

    var
      $el = $(this),
      s = $el.text().match( /^Favorite (.+) Games$/ );

    s = 'Favorite <span class="wooden_plat_emph">'+ s[1] +'</span> Games';
    $el.html(s);
  });
}

 // does what it says. This will only reset the content area, though; not the control
 // comboboxes.
function reset_SorFilCat()
{
   // reset highlight & filter modifications.
  $('.forum').css('opacity', 1).show();
}







//// DEVELOPMENT
//
 // switches the visibility of the category content tabs when Editing a Page.

// TODO: doesn't work with the lyrics tab … whuuut?
function prevnext_category()
{
  var
    $categories = $('.cat'),
    $current = null,
    $followup = $(null);

   // validate environment
  if ( $categories.length ) {
    $(document).keydown(function(e){  // keyup is too late! PageDowns involuntarily alter comboboxes.

      $current = $categories.filter(':visible');

      if (e.altKey) {

         // pgUp
        if ( e.which == 33 ) {
          e.preventDefault();
          $followup = $current.prev('.cat');
        }
         // pgDown
        else if ( e.which == 34 ) {
          e.preventDefault();
          $followup = $current.next('.cat');
        }

         // execute
        if ( $followup.length ) {

          $current.hide();
          $followup.show();

           // do that focus thing of that other module.
          if (do_focus_first_field) {
            go_focus_first_field();
          }
        }
      }  // end of ( ALT )
    });  // end of ( event )
  }  // end of ( valid environment )
}




//// DEVELOPMENT
//
function give_taglist_thumbnails()
{
return false;
// $taglist ‹li›s don't have a Page-ID … Can you imagine?!!


  var $taglist = $('.textntags-tag-list:first');

   // validate environment
  if ( $taglist.length ) {
//console.log('valid.');

    var long_style = "display: block; position: absolute; top: -100px; left: 35px; width: 80px;"
       +" height: 80px; background-image:url(http://www.favslist.com/photos/pages/x3/no.png);"
       +" background-position: 50% 50%; border: 1px solid #232323;";

    $taglist.after(
      "<div id='comparator_deux' style='"+ long_style +"'>"
     +"</div>"
    );


  }  // end of ( valid environment )
}











//// DEVELOPMENT
//
function autoselect_brand_n_users()
{
return false;
// won't work with my jQ, only FL's jQ. I think they enhanced their  .click()  event with PHP code or so.

   // validate environment.
  if ( $('.brandheader').length ) {

    $('#wooden_output').html( '<input type="button" value="brand+users" id="wsh_debug_brandnusers" />' );

    $('#wsh_debug_brandnusers').click(function(){

      $('.leftlist li:last a').click();
    });


    $(document).ready(function(){

      $('.leftlist.filters').on('click', 'li a', function(){
//console.log('I`m being clicked! Yaaay!');
      });

//console.log('also!');
//    $('.leftlist li:last a').click();


//console.log( $._data( $('.leftlist li:last a'), 'events' ) );    // strangely, this doesn't work at all.

    });  // qnd-eo ready.

  }  // end of ( valid environment )
}







//// DEVELOPMENT / RE-OPENED
//
 // automatically focuses the first form element of interest when browsing the
 // Page category tabs, for quicker Page-editing.
function auto_focus_first_field()
{
  var $links = $('a[rel="catlist"]');

   // validate environment.
  if ( $links.length ) {

    $links.add( $links.siblings('a') ).click(go_focus_first_field);

  }  // end of ( valid environment )
}

 // executes the searching of interesting elements and focusing of them.
function go_focus_first_field()
{
   // locate all possible elements …
  $('.cat:visible input[type="text"]')

   // … (excluding comboboxes that are inside a minibox, like track no.;
   //    or that are already fix, pre-set Page categories) …
  .add('.cat:visible select').filter(function(){
    return !$(this).closest('div.blockpage').length
      &&   !$(this).filter(':not(.page_category)').closest('.catlist').length;
  })

   // … and focus on the first item in that set of candidates.
   // "first" meaning the first element that appears in the DOM hierarchy,
   // regardless of when I added it to the set.
  .eq(0).focus();
}






//// DEVELOPMENT
//
function eap_minibox_overflow()
{
  $('.list > div p:last-child,'
   +'#content .tabs:not(#overview,#media) > div p,'
   +'#content #approx > div.blockpage p')

    .addClass('wooden_eap_mb_overflow')
    .each(function(){

      var $el = $(this);
      $el.attr('title', $el.find('a').text());
    });

// also here (vg levels): http://www.favslist.com/pages/Red-Dead-Redemption/7190
}












//// DEVELOPMENT
//
 // highlights the current "letter"-selection (including "#" and "All")
 // in the Edit-a-List environment.
function activate_abc_items()
{
  var $abc = $('#alphabet');

   // validate environment.
  if ( $abc.length ) {

     // shift the highlight on abc-click.
    $abc.find('li a').click(
    function(e){

      $(this)
        .closest('li')
        .addClass('wsh_abc_active')
        .siblings('li')
        .removeClass('wsh_abc_active');
    });

     // trigger init-state.
    var x = $('li.all', $abc);                             // Either "All" …
    $abc = x.length   ? x   : $('li:contains(A)', $abc);   // … or "A".
    $abc.addClass('wsh_abc_active');

  }  // end of ( valid environment )
}



