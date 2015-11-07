
/** jquery-modifications.js
*** Last Update: 2o15-o4-o4
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


(function( $ ){
  $.fn.woodrow = function( action ){
    return this.each(function(){


      if ( action === "cleanShow" ) {
       // sometimes show() doesn't yield satisfying results in regards to
       // display:block vs. display:inline, that's what this tries to optimize.

        if ( this ) {
          this.style.removeProperty('display');
        }
      }  // end of ( method cleanShow )


    });  // end of ( each )
  }  // end of ( plugin "woodrow" )




   // prevent $('#non-existant').offset().left from firing undefined errors.
  var original = $.fn.offset;
  $.fn.offset = function( coordinates, pass ) {
    var
      o = original.apply(this, arguments);

    return (typeof o === 'undefined')  ? {}  : o;
  }


}( jQuery ));  // end of ( valid jQuery )
