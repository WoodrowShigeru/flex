
/** main.js
*** Last Update: 2o15-11-o1
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
**/


var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var woodbox_clone = require("sdk/simple-prefs");

 // declare two constants – in order to avoid stupid typo errors with unpredictable
 // consequences.
var
  ACTIVE   = 'active',
  INACTIVE = 'inactive';



 // modify pages.
pageMod.PageMod({
   // includes and excludes.
  include: /https?:\/\/(www\.)?favslist\.com\/.*/,

   // inject what.
  contentScriptFile: [
    self.data.url("jquery-1.11.0.js"),
    self.data.url("jquery-modifications.js"),
    self.data.url("jquery-ui-1.10.4.min.js"),
    self.data.url("jquery.cyntax.plugin.min.js"),
    self.data.url("jquery.cyntax.timer.min.js"),

    self.data.url("modules.js"),
    self.data.url("development_dump.js"),
    self.data.url("modifyFavsland_forFirefox.js")
  ],
  contentScriptOptions: {
    resource_curtain:       self.data.url("black-curtain-diag-stroke.png"),
    resource_favsland_logo: self.data.url("logo-favsland.png"),
    resource_pauseplay:     self.data.url("pause-play.png"),
    preferences: woodbox_clone.prefs
  },
  contentStyleFile: self.data.url("style.css"),

   // quick 'n dirty fix for Firefox' erroneous interpretation of
   // "linking from inside an addon style.css file to the external domain root" as
   // "linking from inside an addon style.css file to the addon root".
  contentStyle: [
    ".recentlist_arrow { background-image: url("+ self.data.url("editlist.png") +"); }",
    "#top li.sfl-search-lists a.submit, #top #searchresults_for_lists:before { background-image: url("+ self.data.url("layers.png") +"); }",
    "#searchresults_for_lists li.result a span.img { background-image: url("+ self.data.url("x2_no.png") +"); }"
  ],


   // injection modifiers.
  attachTo: [ "existing", "top" ],
  onAttach: function(worker){

     // set Quicklinks.

    worker.port.on('setQuicklinks', function(Q){

      if (  (Q !== null)  &&  (Q !== undefined)  ) {
        woodbox_clone.prefs.quicklinks = String(Q);
      }
    });  // end of ( on receive 'setQuicklinks' )



     // get Preferences.

    worker.port.on('get_pref', function(pref){

      var value = '';

       // quicklinks extrawurst.
      if (pref == 'quicklinks') {
        value = woodbox_clone.prefs[pref];
        value = ((value === null) || (value === undefined))   ? ''   : value;
      }

       // regular case.
      else {
        value = (woodbox_clone.prefs[pref] === true)   ? ACTIVE   : INACTIVE;
      }

      worker.port.emit(  'got_pref',  {'pref': pref, 'value': value}  );

    });  // end of ( on receive 'get_pref' )

  }  // end of ( onAttach )
});  // end of ( modify pages )


