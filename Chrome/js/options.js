
/** options.js
*** Last Update: 2o15-11-o7
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
*** Encapsulate the process so that I can use the same code for both, Opera & Chrome (+moar).
**/

console.log( 'Hello. I´m flex://js/options.js – you can call me Johnny.' );

var
  fadingTime = 300,
  slidingTime = 150;


 // ============================================ //
 // ===== intializes the preferences page. ===== //
 // ============================================ //

$(document).ready(function(){

  provide_woodbox();
  console.log('enter options, wb built.');
  console.log(woodbox);
  init_options();

});  //__ end of ( READY )


function init_options()
{
   // don't even try to start if the initiation went wrong.
  if (  !woodbox  ||  !woodbox.initiated  ||  !woodbox.synched  ) {

    console.log('[FLEX] Error: preferences initiation went wrong.');
    return false;
  }


   // --- preparation. --- //

  var
    i = 0, m = '',
    Obj = o = $check = null;

   // ‹input› [id] := [name].
  bloat_redundantly();



   // for each preference
  for ( m in woodbox.modules ) {

    o = ( woodbox.modules[m] ) ? woodbox.modules[m] : {};

     // validate currently iterated element as a preference.
    $check = $('#'+ m);
    if ( $check.length ) {


   // --- load default preference values. --- //

      if ( o !== undefined ) {
        $check.prop( 'checked', o.state === ACTIVE );
      }

      else {
        $check.prop( 'checked', o.defaultState === ACTIVE );
      }


   // --- make the checkboxes & co. insta-update the preferences object. --- //

      $check.change(function(){
        woodbox.write( this.id, (  (this.checked) ? ACTIVE : INACTIVE  ) );
      });


    }  // end of ( if valid preference )
  }  // end of ( for each preference )



   // --- add clickability to the actual HTML. --- //

  set_up_collapsed_expandability();
  inject_question_marks();
  all_or_nothing();
  comment_icons();

  test_import();  // import
  overlay_interactivity();

}

 // ============================================ //
 // ============================================ //







 // ============================================ //
 // =============  M E T H O D S  ============== //
 // ============================================ //


   // --- browser detection and individual extra initialization. --- //

if (validate_storage()) {

  switch (detect_browser()) {
     // Opera
    case 'o': {

      console.log('[FLEX] Opera detected.');

       // getting extension resources from within an injected script needs FileReader in Opera.
       // But it's too slow to be used in the injected script, so I'm loading the resource here
       // for future use. … MUCH easier in Chrome.
      var
        fr1 = null,     // I explicitly need one FileReader per task or else the timing will
        fr2 = null,     // screw things up and overwrite earlier variables with the later values.
        fr3 = null,
        fr4 = null,
        temp = null,
        imgFile = null,
        cssFile = null;


       // CUSTOM QUICKLINKS BACKGROUND IMAGE
      imgFile = opera.extension.getFile('/img/black-curtain-diag-stroke.png');
      if (imgFile) {

         // declare what to do upon execution.
        fr1 = new FileReader();
        fr1.onload = function() {
          widget.preferences.resource_curtain_src = fr1.result;
        };

         // execute.
        fr1.readAsDataURL(imgFile);
      }

       // FAVSLAND LOGO IMAGE
      imgFile = opera.extension.getFile('/img/logo-favsland.png');
      if (imgFile) {

         // declare what to do upon execution.
        fr3 = new FileReader();
        fr3.onload = function() {
          widget.preferences.resource_fl_logo_src = fr3.result;
        };

         // execute.
        fr3.readAsDataURL(imgFile);
      }

       // TRACK++ PAUSE-PLAY IMAGE
      imgFile = opera.extension.getFile('/img/pause-play.png');
      if (imgFile) {

         // declare what to do upon execution.
        fr4 = new FileReader();
        fr4.onload = function() {
          widget.preferences.resource_pauseplay_src = fr4.result;
        };

         // execute.
        fr4.readAsDataURL(imgFile);
      }

      cssFile = opera.extension.getFile('/css/style.css?v=1.0.2');
      if (cssFile) {

         // declare what to do upon execution.
        fr2 = new FileReader();
        fr2.onload = function(){
          temp = fr2.result;
           // skip the Byte Order Mark, if present.
          if ( temp.charCodeAt(0) === 65279 ) {
            temp = temp.substring(1);
          }
          widget.preferences.resource_css = temp;
        };

         // execute.
        fr2.readAsText(cssFile);
      }


       // while you're at it, put on some makeup.
      document.title = 'FLEX Preferences v'+ widget.version;

      break;
    }  // end of ( Opera )


     // Chrome
    case 'c': {
      console.log('[FLEX] Chrome detected.');

       // put on some makeup.
      var man;
      if (  chrome  &&  (man = chrome.runtime.getManifest())  ) {
        document.title = 'FLEX Preferences v'+ man.version;
      }

      break;
    }  // end of ( Chrome )


     // Firefotz
    case 'f': {
      console.log('[FLEX] Firefotz detected.');

       // put on some makeup.
      //var man;
      //if (  chrome  &&  (man = chrome.runtime.getManifest())  ) {
      //  document.title = man.name +' v'+ man.version;
      //}

      break;
    }  // end of ( Firefox )


    default: {
      console.log('[FLEX] unknown browser. Or maybe IE. I don´t care.');
      break;
    }

  }  // end of ( switch case: detect browser )
}  // end of ( valid storage )





 // opens the "explanation" popup and fills it with content dependent on the click.
function explain_to_me( span )
{
  var
    $ex = $('#explanation'),
    $label = $(span).siblings('label'),
    o = $label.find('input').attr('id'),
    $reference = $('#header_banner'),
    pos = 0;

   // safety precaution.
  if (  !woodbox  ||  !woodbox.modules  ||  !woodbox.modules[o]  ) {

    console.log('[FLEX] Error: could not explain.');
    return false;
  }



   // hide other overlay popups.
  $('.overlay').stop().fadeOut(200);

   // title.
  $ex.find('h2').text( $label.find('span.title').text() );

   // image.
   //  reset classes.
  $ex.find('img').attr('class', '');

  if ( woodbox.modules[o].imgSource != '' ) {
    $ex
      .find('img')
        .attr('src', 'img/'+ woodbox.modules[o].imgSource)
        .addClass(o)
        .show()
    ;
  }
  else {
    $ex.find('img').hide();
  }

   // description.
  if ( woodbox.modules[o].description != '' ) {
    $ex.find('p').html( woodbox.modules[o].description );
  }

   // box itself.
//  pos = (  $reference.length  &&  $reference.offset()  )   // obsolete
//      ? $reference.offset().left +20 : 200;
//  $ex
//    .stop().show().css({ left: -400 , opacity: 0 })
//    .animate({left: pos, opacity: 1}, slidingTime);
  $ex
    .stop().show().css({ left: '-100%' , opacity: 0 })
    .animate({left: '50%', opacity: 1}, slidingTime);
}

 // closes the "explanation" popup.
function youve_said_enough()
{
  $('#explanation').fadeOut(fadingTime);
}






 // sets up the toggle gimmick FX for the preference groups.
function set_up_collapsed_expandability()
{
  var
    $groups = $('div.fieldset_group'),
    collapsedHeight = 0;


   // save height values for future use. First, when collapsed.
  collapsedHeight = $groups.filter('.collapsed:first').height();

   // save individual 'auto' values.
  $groups.each(function(){

    var
      $el = $(this),
      before = $el.height();

    $el
        // shortly set the height to auto and quickly read the value …
      .css('height','auto')
      .data('autoHeight', $el.height())
        // … then reset to the way it was before.
      .height(before);
  });


   // set up toggle functionality on clicking.
  $groups.click(function(e){
    var
      $el = $(this),
      $where_am_i = $(e.target),
      auto = $el.data('autoHeight')
    ;
     // exclude the child elements from the toggling functionality. Checkboxes still need
     // to work as checkboxes.
    if ( $where_am_i.is('div.fieldset_group, h2') ) {

       // toggle: collapsed –› expanded.
      if ( $el.hasClass('collapsed') ) {

         // safety precaution.
        if (!auto) {
          auto = 'auto';
        }

        $el
          .stop().animate({ height: auto }, 200)
          .removeClass('collapsed');
      }

       // toggle: expanded –› collapsed.
      else {
        $el
          .stop().animate({ height: collapsedHeight }, 250)
          .addClass('collapsed');
      }
      e.stopPropagation();
      e.preventDefault();

    }  // end of ( only container and h2 )
  });  // end of ( click )
}




 // does what it says.
function inject_question_marks()
{
  $('div.fieldset_group label').after('<span class="help ug_icon">Explain this!</span>');

  $('span.help').click(function(e){
    explain_to_me(this);
    e.stopPropagation();
  });
}





 // gives each relevant ‹input› an [id] which is exactly the same as the [name] attribute.
function bloat_redundantly()
{
  $('.fieldset_group input').each(function(){

    var $el = $(this);

    if ( !$el.attr('id') ) {
      $el.attr( 'id', $el.attr('name') );
    }
  });
}




 // set up mutual influences between the checkboxes and the radios.
function all_or_nothing()
{
  var
    $checks = $('.fieldset_group :checkbox'),
    $on = $(':radio[name="all_checkboxes"][value="on"]'),
    $off = $(':radio[name="all_checkboxes"][value="off"]');


   // make the checkboxes affect the radios.
  $checks.change(function(){

     // this.checked shows the result after the user clicked the checkbox.
     // if any checkbox is activated by the user, uncheck the "deactivate all" radio box (if checked).
    if (this.checked) {
      $off.filter(':checked').prop('checked', false);
    }

     // if any checkbox is deactivated by the user, uncheck the "activate all" radio box (if checked).
    else {
      $on.filter(':checked').prop('checked', false);
    }
  });


   // make the radios affect the checkboxes.
  $on.click(function(){

    $checks.prop('checked', true).each(function(){
      woodbox.write( this.id, ACTIVE );
    });
  });
  $off.click(function(){

    $checks.prop('checked', false).each(function(){
      woodbox.write( this.id, INACTIVE );
    });
  });
}

 // ============================================ //
 // ============================================ //


function comment_icons()
{
  var $infoline = $('#infoline');

  $('.ug_icon')
    .mouseenter(function(e){

      var $src = $(e.target);

      $infoline.find('.text').text( $src.text() );
      $infoline.css({ left: $src.offset().left + $src.outerWidth() +2, top: $src.offset().top -2 });
      $infoline.stop().fadeIn(150);
    })
    .mouseleave(function(){
      $infoline.stop().fadeOut(150);
    });
}



 // qnd.  This is actually the setup, not an actual import.
function test_import() {

  var
    jason = null,
    $the_box = $('#transport_box'),
    pos = 0,
    border = 0,
    $reference = $('#header_banner');


  $('a.link_export').click(function(){

    $the_box.find('h2').text( 'Export Preferences' );
    $the_box.find('p.instruct').text( 'Save this somewhere.' );

    jason = JSON.stringify( woodbox );
    $('#transport_box textarea').val(jason);

    border = $(window).width();
    pos = (  $reference.length  &&  $reference.offset()  )
        ? $reference.offset().left +20 : 200;
    console.log(border);
    console.log(pos);
    console.log(border-pos);
    $the_box.stop().css('right', -400).show().animate({left: pos}, 150);


    return false;
  });


  $('a.link_import').click(function(){

     // prepare.
    var $overlay = $('.overlay:visible');
    if ( $overlay.length ) {
      $overlay.fadeOut(300);
    }

    $the_box.show();
    $the_box.find('h2').text( 'Import Preferences' );
    $the_box.find('p.instruct').text( 'Paste your exported preferences here.' );
    $the_box.find('textarea').val('');


// TODO: this following EXECUTE part needs to be separated from the suceeding INITIALIZE part.
// TODO: This is still not working right.
    var v = $the_box.find('textarea').val();
    try {
      jason = JSON.parse(v);
    }
    catch (e) {
      console.log('[FLEX] Error: Invalid JSON syntax. '+ e);
    }

    console.log('before:');
    console.log(woodbox);

    if (  jason  &&  jason.modules  ) {
      var
        x,
        $check = null;

      for ( x in jason.modules ) {

        woodbox.write( x, jason.modules[x] );
        $check = $('.fieldset_group :checkbox[name="'+ x +'"]'),
        $check.prop( 'checked', jason.modules[x].state === ACTIVE );

      }

       // Quicklinks
      if ( jason.quicklinks ) {
        woodbox.quicklinks = jason.quicklinks;
        save_to_storage( 'quicklinks', jason.quicklinks );
      }
    }

    console.log('after:');
    console.log(woodbox);

    return false;
  });
}

function test_export() {}




 // sets up show and hide functionality for all the overlay elements.
function overlay_interactivity()
{
  var
    selector = '.overlay:visible'
  ;
  $(document)
    .click(function(e){
      var
        $overlay = $(selector),
        $where_am_i = $(e.target)
      ;

      if (  $overlay.length  &&  !($where_am_i.is(selector) || $where_am_i.closest(selector).length)  ) {
        $overlay.fadeOut(300);
      }
    })  // end of ( click )

     // make the overlays be closable with the ESC key.
    .keyup(function(e){
      var
        $overlay = $(selector)
      ;
      if (  (e.which == 27)  &&  $overlay.length  ) {
        $overlay.fadeOut(300);
      }
    })  // end of ( keyup )
  ;  // end of ( document )
}


