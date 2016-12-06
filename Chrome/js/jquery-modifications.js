
/** jquery-modifications.js
*** Last Update/Version: 2o16-o5-11
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/

// TODO  list all funcs in comments.


(function( $ ){

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
  };  // end of (  addElseRemoveClass()  )



   // sometimes show() doesn't yield satisfying results in regards to
   // display:block vs. display:inline, that's what this tries to optimize.
  $.fn.cleanShow = function(){
    return this.each(function(){
      this.style.removeProperty('display');
    });
  };  // end of (  cleanShow()  )




   // prevent $('#non-existant').offset().left from firing undefined errors.
  var original = $.fn.offset;
  $.fn.offset = function( coordinates, pass ){
    var
      o = original.apply(this, arguments)
    ;
    return (typeof o === 'undefined')  ? {}  : o;

  };  // end of (  new offset()  )


}( jQuery ));  // end of ( valid jQuery )

