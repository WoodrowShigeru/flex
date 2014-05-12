
/** options.js
*** Last Update: 2o14-o5-o4
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
*** Encapsulate the process so that I can use the same code for both, Opera & Chrome (+moar).
**/


// TODO: synchronization! (I do have mentioned that somewhere else)


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
/*  var response = null;

  if ( say == "test" ) {
    response = "smörebröd";
  }

  sendResponse({ value: response });
*/
});



 // ============================================ //
 // ===== intializes the preferences page. ===== //
 // ============================================ //

$(document).ready(function(){


   // don't even try to start if the initiation went wrong.
  if (  !options  ||  !options.initiated  ||  !woodbox  ||  !woodbox.items  ) {

    console.log('[FLEX] Error: preferences initiation went wrong.');
    return false;
  }


   // --- preparation. --- //

  var
    i=0, a='',
    Obj = o = $check = null;

   // ‹input› [id] := [name].
  bloat_redundantly();



   // for each preference
  for ( a in options ) {

    o = (  options  &&  options[a]  ) ? options[a] : null;

     // validate currently iterated element as a preference.
    $check = $('#'+ a);
    if ( $check.length ) {


   // --- load default preferenece values. --- //

      if ( woodbox.items[a] !== undefined ) {
        $check.prop( 'checked', woodbox.items[a] == ACTIVE );
      }

      else if ( options[a].state !== undefined ) {
        $check.prop( 'checked', options[a].state == ACTIVE );
      }


   // --- make the checkboxes & co. insta-update the preferences object. --- //

      $check.change(function(e, a){
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


});  //__ end of ( READY )

 // ============================================ //
 // ============================================ //







 // ============================================ //
 // =============  M E T H O D S  ============== //
 // ============================================ //


   // --- browser detection and individual localStorage handling. --- //

 // Opera
if (  (typeof widget !== 'undefined')  &&  widget.preferences  ) {

  console.log('[FLEX] Opera detected.');

  for ( x in widget.preferences ) {
    woodbox.items[x] = widget.preferences[x];
  }


  woodbox.write = function( key, value ) {

    if (  (typeof key   === 'string')  &&  (key   !== '')
      &&  (typeof value === 'string')  &&  (value !== '')  ) {

      widget.preferences[key] = value;
    }
  };


   // getting extension resources from within an injected script needs FileReader in Opera.
   // But it's too slow to be used in the injected script, so I'm loading the resource here
   // for future use. … MUCH easier in Chrome.

  var
    fr1 = null,     // I explicitly need one FileReader per task or else the timing will
    fr2 = null,     // screw things up and overwrite earlier variables with the later values.
    imgFile = null,
    cssFile = null;


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

  cssFile = opera.extension.getFile('/css/style.css?v=1.0.2');
  if (cssFile) {

     // declare what to do upon execution.
    fr2 = new FileReader();
    fr2.onload = function(){
      widget.preferences.resource_css = fr2.result;
    };

     // execute.
    fr2.readAsText(cssFile);
  }


   // while you're at it, put on some makeup.
  document.title = widget.name +' v'+ widget.version;

}  // end of ( Opera )


  // Chrome
else if ( window.localStorage ) {

  console.log('[FLEX] Chrome detected.');

  for ( x in localStorage ) {
    woodbox.items[x] = localStorage[x];
  }


  woodbox.write = function( key, value ) {

    if (  (typeof key   == 'string')  &&  (key   != '')
      &&  (typeof value == 'string')  &&  (value != '')  ) {

      localStorage[key] = value;
    }
  };

   // while you're at it, put on some makeup.
  var man;
  if (  chrome  &&  (man = chrome.runtime.getManifest())  ) {
    document.title = man.name +' v'+ man.version;
  }

}  // end of ( Chrome )


 // Firefotz?
else if (false) {
  console.log('[FLEX] Firefotz detected.');
}
else {
  console.log('[FLEX] unknown browser. Or maybe IE. I don´t care.');
}





 // opens the "explanation" popup and fills it with content dependent on the click.
function explain_to_me()
{
  var
    $ex = $('#explanation'),
    $label = $(this).siblings('label'),
    o = $label.find('input').attr('id'),
    $reference = $('#header_banner'),
    pos = 0;

   // safety precaution.
  if (  !options  ||  !options[o]  ) {

    console.log('[FLEX] Error: could not explain.');
    return false;
  }



   // hide other overlay popups.
  $('.overlay').stop().fadeOut(200);

   // title.
  $ex.find('h2').text( $label.find('span.title').text() );

   // image.
  if ( options[o].imgSource != '' ) {
    $ex.find('img').attr( 'src', options[o].imgSource ).show();
  }
  else {
    $ex.find('img').hide();
  }

   // description.
  if ( options[o].description != '' ) {
    $ex.find('p').html( options[o].description );
  }

   // box itself.
  pos = (  $reference.length  &&  $reference.offset()  )
      ? $reference.offset().left +20 : 200;
  $ex
    .stop().show().css({ left: -400 , opacity: 0 })
    .animate({left: pos, opacity: 1}, slidingTime);
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
      auto = $el.data('autoHeight');

     // toggle: collapsed –› expanded.
    if ( $(this).hasClass('collapsed') ) {

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
  })
    // exclude the child elements from the toggling functionality. Checkboxes still need
    // to work as checkboxes.
  .children().not('h2').click(function(e){
    e.stopPropagation();
  });
}




 // does what it says.
function inject_question_marks()
{
  $('div.fieldset_group label').after('<span class="help ug_icon">Explain this!</span>');

  $('span.help').click(explain_to_me);

  $(document)
    .click(function(){
      if ( $('#explanation:visible').length ) {
        youve_said_enough();
      }
    })

     // make the overlays be closable with the ESC key.
    .keyup(function(e){

      var $overlay = $('.overlay:visible');
      if (  (e.which == 27)  &&  $overlay.length  ) {
        $overlay.fadeOut(fadingTime);
      }
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
      $infoline.css({ left: $src.offset().left + $src.outerWidth(), top: $src.offset().top });
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

    var v = $the_box.find('textarea').val();
    try {
      jason = JSON.parse(v);
    }
    catch (e) {
      console.log('[FLEX] Error: Invalid JSON syntax. '+ e);
    }

    console.log('before:');
    console.log(woodbox);

    if (  jason  &&  jason.items  ) {
      woodbox.items = jason.items;
      // TODO: though, not just woodbox, also localStorage … let's rather use  .write()  (TODO).
      // d'uh! Also the checkboxes, plz.
      // btw, does woodbox synchronize with options{}, checkboxes and localStorage on options-init?
    }

    console.log('after:');
    console.log(woodbox);

    return false;
  });


   // geh mal kurz ausm wech.
  $('#transport_box span.close').click(function(){

    $('#transport_box').fadeOut(fadingTime);
  });

  $(document)
    .click(function(){

      var $overlay = $('.overlay:visible');
      if ( $overlay.length ) {
        $overlay.fadeOut(300);
      }
    })

     // make the overlays be closable with the ESC key.
    .keyup(function(e){

      var $overlay = $('.overlay:visible');
      if (  (e.which == 27)  &&  $overlay.length  ) {
        $overlay.fadeOut(300);
      }
    });

}

function test_export() {}


