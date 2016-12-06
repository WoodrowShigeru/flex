
/** options.js
*** Last Update: 2o16-12-o5
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
*** Encapsulate the process so that I can use the same code for both, Opera, Chrome +moar.
**/
;
(function( $, flex, woodbox ){
  console.log( '[FLEX] Hi, I´m flex://preferences – you can call me Johnny.' );

  var
    preferences = {},
    $explanation = $('#explanation')
  ;

  preferences = {

    fx_times: {
      fade: 300,
      slide: 150,
      before_expanding: 150,
      after_collapsing: 250,
      infoline: 150,
    },

    init: function(){
      var
        $groups = $('div.fieldset_group'),
        $infoline = $('#infoline'),
        $check = null
      ;
      woodbox.init();
      woodbox.load();
       // don't even try to start if the initiation went wrong.
      if (  !woodbox  ||  !woodbox.instantiated  ||  !woodbox.loaded  ) {

        console.log('[FLEX] Error: preference initiation went wrong.');
        return false;
      }


       //----- bloat redundantly:  ‹input, set [id] := [name] /› -----//

      $groups.find('input').each(function(){
        var
          $el = $(this),
          $sub = $el.closest('.sub'),
          main = $sub.siblings('.main').find('input').attr('id')
        ;
        if ( !$el.attr('id') ) {
          $el.attr( 'id', $el.attr('name') );

           // is sub.
          if ($sub.length  &&  main) {
            $el
              .data('main', main)
              .addClass('sub_formelement')
            ;
          }
        }
      });


       //----- checkboxes: load from storage, set up interactivity -----//

      $('.fieldset_group input[name]').each(function(){
        var
          $el = $(this),
          m = this.id,
          main = $el.data('main'),
          module = woodbox.modules[m]  ? woodbox.modules[m]  : {}
        ;
        if (main  &&  woodbox.modules[main]) {
          module = woodbox.modules[main];
        }
        if (module.deprecated) {
          $el
            .closest('fieldset')
              .addClass('deprecated')
              .attr('disabled', 'disabled')
              .append('<span class="annotation ug_icon">Module deprecated.</span>')
          ;
        } else {
          $el
            .prop( 'checked', module.active )

            .change(function(){   // ----- future scope!
              var
                $el = $(this),
                $fieldset = $el.closest('fieldset'),
                main = $el.data('main'),
                sub_id = ''
              ;
               // is valid sub.
              if ($el.is('.sub_formelement')  &&  woodbox.modules[main]) {
                sub_id = this.id.replace( /^[^\-]+\-/, '');
                woodbox.set_sub(main, sub_id, this.checked);

               // is main (or standalone w/o sub).
              } else {
                woodbox.write_activity(this.id, this.checked);

                if ( $fieldset.is('.main') ) {
                  preferences.dis_or_enable_subgroup(this.id, this.checked);
                }
              }
            })  // end of ( change func )
          ;
        }  // end of ( module not deprecated )
        preferences.dis_or_enable_subgroup(m, module.active);

          // TODO  On-change, I should send a message to update the woodbox in modify.js

      });  // end of ( each ‹input› )


       //----- set up the accordeon FX -----//

      $groups.click(function(e){
        var
          $group = $(this),
          $where_am_i = $(e.target)
        ;
         // exclude the child elements from the toggling functionality.
         // Checkboxes still need to work as checkboxes.
        if ($where_am_i.is('div.fieldset_group, h2')) {
          $group.toggleClass('collapsed');
        }
      });


       //----- inject question marks -----//

      $groups.find('fieldset:not(.sub) label').after('<span class="help ug_icon">Explain this!</span>');
      $('span.help').click(function(e){

        preferences.explain(this);

        e.stopPropagation();
        return false;
      });


      //----- set up custom tooltips -----//

      $('.ug_icon')
        .mouseenter(function(e){
          var
            $src = $(e.target)
          ;
          $infoline
             // content.
            .find('.text')
              .text( $src.text() )
            .end()

             // position.
            .css({
              left: $src.offset().left + $src.outerWidth() +2,
              top:  $src.offset().top  -2
            })

             // visibility.
            .stop()
            .fadeIn(preferences.fx_times.infoline)
          ;
        })

        .mouseleave(function(){
          $infoline.stop().fadeOut(preferences.fx_times.infoline);
        })
      ;


      //----- all or nothing: "de/activate all" buttons and mutual influence -----//

      $('.all_buttons').each(function(){
        var
          $checks = $('.fieldset_group :checkbox'),
          $on = $(':radio[name="all_checkboxes"][value="on"]'),
          $off = $(':radio[name="all_checkboxes"][value="off"]')
        ;

         // make the checkboxes affect the radios.
        $checks.change(function(){

           // this.checked shows the result after the user clicked the checkbox.
           // if any checkbox is activated by the user, untick the "deactivate all" radio (if ticked).
          if (this.checked) {
            $off.filter(':checked').prop('checked', false);
          }

           // if any checkbox is deactivated by the user, untick the "activate all" radio (if ticked).
          else {
            $on.filter(':checked').prop('checked', false);
          }
        });


         // make the radios affect the checkboxes.
        $on.add($off).click(function(){
          $checks
            .prop( 'checked', $(this).is($on) )
            .each(function(){
              var
                $el = $(this),
                main = $el.data('main'),
                sub_id = ''
              ;
              if ($el.is('.sub_formelement')  &&  woodbox.modules[main]) {
                sub_id = this.id.replace( /^[^\-]+\-/, '');
                woodbox.set_sub(main, sub_id, this.checked);

              } else {
                woodbox.write_activity(this.id, this.checked);
              }
              preferences.dis_or_enable_subgroup(this.id, this.checked);

            })  // end of ( each )
          ;  // end of ( $checks chain )
        });  // end of ( on+off on-click )
      });  // end of ( each all_buttons: just a wrapper for local variable scope )


      //----- header buttons -----//

      $('.all_buttons .button').click(function(){
        switch (this.name) {

          case 'open_all_groups':
          case 'close_all_groups':

            if (this.name == 'close_all_groups') {
              $groups.addClass('collapsed');
            } else {
              $groups.removeClass('collapsed');
            }
          break;

          default:
          break;
        }   // end of ( switch-case: button name )
      });


      //----- set up peanuts -----//

       // peanut #1
      $(document).on('click', '#explanation .close', function(e){
        preferences.stop_explaining();
      });

       // peanut #2
      switch (flex.browser) {
         // Opera
        case 'o': {
          console.log('[FLEX] Opera detected.');
          break;
        }  // end of ( Opera )


         // Chrome
        case 'c': {
          console.log('[FLEX] Chrome detected.');

           // put on some makeup.
          var man;
          if (chrome  &&  ( man = chrome.runtime.getManifest() )) {
            document.title = 'FLEX Preferences v'+ man.version;
          }
          break;
        }  // end of ( Chrome )


         // Firefotz
        case 'f': {
          console.log('[FLEX] Firefox detected.');
          break;
        }  // end of ( Firefox )


        default: {
          console.log('[FLEX] unknown browser. Or maybe IE. I don´t care.');
          break;
        }
      }  // end of ( switch-case browser )

      //----------------------------------//



      // TODO
      // - head tools
      //   - import/export

    },  // end of ( func init )


    stop_explaining: function(){
      $explanation
        .addClass('inlay_collapsed')
        .delay(preferences.fx_times.after_collapsing)
        .queue(function(){

          $explanation
            .remove()
            .appendTo('#flimsy_elements')
            .attr('class', 'inlay inlay_collapsed')
            .dequeue()
          ;
        })
      ;
    },


    explain: function( span ){
      var
        $label = $(span).siblings('label'),
        m = $label.find('input').attr('id'),
        this_exact_module_was_opened = $explanation.is('.'+m)
      ;
       // safety precaution.
      if (  !woodbox  ||  !woodbox.modules  ||  !woodbox.modules[m]  ) {

        console.log('[FLEX] Error: could not explain '+ m +'.');
        return false;
      }

       // important: reset the classes of the ex element.
      $explanation.attr('class', 'inlay');

       // hide already opened shit.
      if (!$explanation.parent().is('#flimsy_elements')) {
        console.log('hiding already opened shit detected.');
        preferences.stop_explaining();
//        $explanation.dequeue();   // TODO  is this helpful or does it cause bugs?
      }


       // don't show at all if it was open already.
      if (!this_exact_module_was_opened) {
        $explanation.addClass(m);

         // title.
        $explanation.find('h2').text( $label.find('span.title').text() );

         // image: reset classes.
        $explanation.find('img').attr('class', '');

        if ( woodbox.modules[m].imgSource != '' ) {
          $explanation
            .find('img')
              .attr('src', 'img/'+ woodbox.modules[m].imgSource)
              .show()
          ;
        }
        else {
          $explanation.find('img').hide();
        }

         // description.
        if ( woodbox.modules[m].description != '' ) {
          $explanation.find('p').html( woodbox.modules[m].description );
        }

         // box itself.
        $explanation
          .remove()
          .insertAfter( $label.closest('fieldset') )
          .delay(preferences.fx_times.after_expanding)
          .queue(function(){
            $explanation
              .removeClass('inlay_collapsed')
              .dequeue()
            ;
          })
        ;  // end of ( $explanation chain )
      }  // end of ( wasn't opened )
    },  // end of ( preferences.explain )


    dis_or_enable_subgroup: function( key, do_enable ){

      $('fieldset.main').has('#'+key)
        .siblings('.sub').attr('disabled', (do_enable  ? null  : 'disabled'))
      ;
    }

  };  // end of ( plugin object declaration )


  preferences.init();

})(jQuery, flex, woodbox);






var
  fx_time_fade = 300,
  fx_time_slide = 150
;


 // ============================================ //
 // ===== intializes the preferences page. ===== //
 // ============================================ //

 // not needed.
$(document).ready(function(){});  //__ end of ( READY )


 // obsolete, old stuff
function init_options()
{
   // --- preparation. --- //

  var
    i = 0, m = '',
    Obj = o = $check = null;


   // --- add clickability to the actual HTML. --- //

//  set_up_collapsed_expandability();
//  inject_question_marks();
//  all_or_nothing();
//  comment_icons();

  test_import();  // import
  overlay_interactivity();

}

 // ============================================ //
 // ============================================ //







 // ============================================ //
 // =============  M E T H O D S  ============== //
 // ============================================ //



 // ============================================ //
 // ============================================ //


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


