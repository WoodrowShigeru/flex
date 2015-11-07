
/** jquery-modifications.js
*** Last Update: 2o15-o1-o6
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


(function( $ ){
  $.fn.woodrow = function( action ){
    return this.each(function(){


      if ( action === "cleanShow" ) {

        if ( this ) {
          this.style.removeProperty('display');
        }
      }  // end of ( method cleanShow )


    });  // end of ( each )
  }  // end of ( plugin "woodrow" )
}( jQuery ));  // end of ( valid jQuery )
